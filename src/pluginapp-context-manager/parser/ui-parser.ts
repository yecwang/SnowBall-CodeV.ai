/* eslint-disable import/no-extraneous-dependencies */
import React from "react";
import ReactDOM from 'react-dom/client';
import * as ReactDnD from 'react-dnd'
import * as ReactDnDHTML5Backend from 'react-dnd-html5-backend'
// import ToolComponents from '../common/ToolComponents.js';
import { ParseResult } from '@babel/parser';
import generate from "@babel/generator";
import traverse, { NodePath } from '@babel/traverse';
import * as reactRedux from 'react-redux';
import * as reduxStore from 'src/redux/store';
import * as t from '@babel/types';
import * as material from '@mui/material';
import * as materialIcons from '@mui/icons-material';
import * as AdapterDateFns from '@mui/x-date-pickers/AdapterDateFns';
import * as LocalizationProvider from '@mui/x-date-pickers/LocalizationProvider';
import WrapBox, { EditModeAttr } from 'src/sections/pages/components/wrap-box'
import { UILib, configList } from 'src/pluginapp-context-manager/ui-lib';
import * as AstUtil from "../utils/ast-util";


let rootDom: any = null;
export type TUIParserExtra = {
  projectID: string;
  pageID: string;
}

/**
 * Parse and convert source code
 * 1. Add Provider to code
 * 2. Get the components attributes from code
 * 3. Add click event to code
 * 4. Add method which can render in builder container to code
 * @param code origin code string
 * @returns new_codes The after converted code 
 */
export function parse(code: string, extra: TUIParserExtra) {
  
  /**
   * Add DndProvider and redux provider to AST
   * @param ast 
   */
  const _addProvider = (ast: ParseResult<t.File>) => {
    // Add base library import codes to the original AST
    const providerCode = `
      import { useState } from 'react'
      import { DndProvider, useDrop } from 'react-dnd'
      import { HTML5Backend } from 'react-dnd-html5-backend'
      import { store, useDispatch, useSelector } from "store";
      import { Provider } from "react-redux";
      import WrapBox from 'wrap-box';
      import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
      import { LocalizationProvider as MuiLocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
      
      <Provider store={store}><DndProvider backend={HTML5Backend} context={window}><MuiLocalizationProvider dateAdapter={AdapterDateFns}></MuiLocalizationProvider></DndProvider></Provider>
    `;
    return AstUtil.addRootNodeCodesToAst(ast, providerCode, 'MuiLocalizationProvider')
  }
  const _formatErrorStack = (error: unknown) => {
    if (!(error instanceof Error)) {
      return `<pre style={{ color: "red" }}>${'unknown error'}</pre>`;
    }

    if (error && error.stack) {
      const stack = error.stack.split('\n').map(line => line.trim());
      const message = stack.shift();
      
      return `<div>
        <pre style={{ color: "red" }}>${message}</pre>
        <pre style={{ color: "#393333", lineHeight: "20px"}}>${stack.join('<br/>')}</pre>
      </div>`
    }
    
    return `<pre style={{ color: "red" }}>${error.message || 'unknown error'}</pre>`;
  }

  let new_codes = ''
  try {
    // convert code to AST
    const ast = AstUtil.convertCodeToAst(code);
    const comStructure = AstUtil.getComStructure(ast)
    
    // add DndProvider and redux provider to AST
    const result = _addProvider(ast);
    if (!result) {
      return code
    }

    // Traverse AST, get components attributes and bind onClick event
    traverse(ast, {
      JSXElement(path: NodePath<t.JSXElement>) {
        const openingElementNode = path.node.openingElement;
        if (!t.isJSXIdentifier(openingElementNode.name)) {
          return;
        }
        // find the attr from opening element node
        const attributes = AstUtil.findAttributes(path.node);
        
        if (!attributes.id) {
          return;
        }
        const attr: EditModeAttr = {
          projectID: extra.projectID,
          pageID: extra.pageID,
          attributes,
          componentName: openingElementNode.name.name,
          code: (configList as any)[`${openingElementNode.name.name}Config`]?.code,
          comStructure
        }
        AstUtil.addEditModeToNode(path, attr)
      }
    });
    new_codes = generate(ast).code
  } catch (ex) {
    console.error(ex)
    // error stack preview codes
    // new_codes = _formatErrorStack(ex)
  }
  
  return new_codes
}

export async function renderCodes(code: string, containerElementId: string, components: any, extra: TUIParserExtra) {
  
  const modules = {
    'react-dnd': ReactDnD,
    'react-dnd-html5-backend': ReactDnDHTML5Backend,
    'react': React,
    'react-redux': reactRedux,
    'store': {
      ...reduxStore
    },
    '@mui/icons-material': materialIcons,
    '@mui/material': material,
    '@mui/x-date-pickers/LocalizationProvider': LocalizationProvider,
    '@mui/x-date-pickers/AdapterDateFns': AdapterDateFns,
    'ui-lib': {...material, ...UILib},
    'wrap-box': WrapBox,
    'funs': {},
    ...components,
  }
  /**
   * Render the codes to the app container
   * @param node React.createElement node
   */
  function _render(node: any) {
    const rootElement = document.getElementById(containerElementId)
    if (!rootElement) {
      throw new Error(`container element not found: ${containerElementId}`)
    }
    // fix the warning of dev mode
    const key = Object.keys(rootElement).find(item=>item.startsWith('__reactContainer$'))
    if (!rootDom || !key) {
      rootDom = ReactDOM.createRoot(rootElement)
    }
    rootDom.render(node)
  }
  /**
  * Mock the require function for ES5 module
   * eg: const { Button } = require('ToolComponents')
   * @param moduleName 
   */
  function _require(moduleName: string) {
    let module = modules[moduleName];
    if (moduleName.startsWith('@mui/material/')) {
      const key = moduleName.replace('@mui/material/', '')
      module = modules['@mui/material'][key]
    }
    if (!module) {
      throw new Error(`module not found! with moduleName ${moduleName}`);
    }
  
    return module;
  }
  // 1. parse and convert code
  let new_codes = parse(code, extra)
  // wrap render function to the root React.createElement of given code
  new_codes = AstUtil.wrapMethodToRootReactElement(new_codes, 'render')
  
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const func = new Function("React", "render", "require", new_codes);
  func(React, _render, _require);
}