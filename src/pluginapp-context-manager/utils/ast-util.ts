/* eslint-disable import/no-extraneous-dependencies */
import ObjPath from "object-path";
import { parse as babelParse, ParseResult } from '@babel/parser'
import * as t from '@babel/types';
import traverse, { NodePath } from '@babel/traverse';
import generate from "@babel/generator";
import { transform } from "@babel/standalone";
import { ComStructure, IAttribute } from "src/types/project/project";
import { EditModeAttr } from "src/sections/pages/components/wrap-box";
import { configList } from 'src/pluginapp-context-manager/ui-lib';

/**
 * Find the React.createElement node from ast
 * @param ast 
 * @returns AST node
 */
export function findReactNode(ast: any) {
  function _isReactNode(node: any) {
    const {type} = node; // "ExpressionStatement"
    const obj = ObjPath.get(node, "expression.callee.object.name");
    const func = ObjPath.get(node, "expression.callee.property.name");
    return (
      type === "ExpressionStatement" &&
      obj === "React" &&
      func === "createElement"
    );
  }
  const {body} = ast.program;
  return body.find(_isReactNode);
}

/**
 * Convert code to AST by babel parser
 * @param code code string
 * @returns AST
 */
export function convertCodeToAst(code: string) {
  return babelParse(code || '', {
    sourceType: "module",
    plugins: ["jsx", "decorators-legacy"]
  })
}

/**
 * Convert ts code to AST by babel parser
 * @param code code string
 * @returns AST
 */
export function convertTSCodeToAst(code: string): ParseResult<t.File> {
  return babelParse(code, {
    sourceType: "module", 
    plugins: ["typescript"]
  })
}

export function getComStructure(ast: ParseResult<t.File>) {
  // 1.遍历AST, 找到所有的JSXElement节点
  // 2.将当前节点放入Map中，key为id，value为数组，
  // 3.判断当前节点是否有父节点，将当前节点id跟在父节点中所处的位置index，组合成对象，放入Map中对应的父节点数组中
  // 4.返回Map
  const comStructure: ComStructure = {}
  traverse(ast, {
    JSXElement(path: any) {
      const elementIdItem = path.node.openingElement.attributes?.find((attr: any) => attr.name.name === 'id')
      const id = elementIdItem?.value?.value
      if (!id) {
        return;
      }
      comStructure[id] = {
        parent: '',
        parentDirection: 'column',
        componentName: path.node.openingElement.name.name,
        attributes: findAttributes(path.node),
        children: []
      }
      // 获取当前节点的父节点
      const parent = path.findParent((path: any) => t.isJSXElement(path.node))
      // 判断节点是否为JSXElement
      if (parent && t.isJSXElement(parent.node)) {
        const parentIdItem = parent.node.openingElement.attributes?.find((attr: any) => attr.name.name === 'id')
        const parentId = parentIdItem?.value?.value
        if (parentId) {
          comStructure[id].parent = parentId
          // 获取父节点的子组件的排序方向
          const parentSxItem = parent.node.openingElement.attributes?.find((attr: any) => attr.name.name === 'sx')
          if (parentSxItem) {
            const {properties} = parentSxItem.value.expression
            const flexDirection = properties.find((property: any) => property.key.value === 'flexDirection')
            if (flexDirection) {
              comStructure[id].parentDirection = flexDirection.value.value || 'column'
            }
          }
        }
      }
      path.node.children.forEach((child: any, index: number) => {
        if (t.isJSXElement(child)) {
          const childIdItem = child.openingElement.attributes?.find((attr: any) => attr.name.name === 'id')
          // @ts-ignore
          const childId = childIdItem?.value?.value
          if (childId) {
            comStructure[id].children.push(childId)
          }
        }
      })
    }
  })
  return comStructure
}

/**
 * Convert code to AST as root expression node and repleace the orignal AST
 * 1.Convert code to AST as root expression
 * 2.replace the orginal ast root expression
 * 3.put the orginal ast root expression to the new root expression's children
 * 
 * @param ast The orginal ast
 * @param code code string
 * @param rootElementName The new ast expression's node name which is the parent of the orginal ast expression
 * 
 * @returns true if success, false if failed
 */
export function addRootNodeCodesToAst(ast: ParseResult<t.File>, code: string, rootElementName: string) {
  // Convert code to AST
  const providerAst: any = babelParse(code, {
    sourceType: "module",
    plugins: ['jsx']
  });

  // add new import node to the top of the original AST
  providerAst.program.body.forEach((node: any) => {
    if (node.type !== 'ImportDeclaration') {
      return
    }
    ast.program.body.unshift(node);
  })
  // get the original root expression node
  const currentRootElementNode: any = ast.program.body.find((item: any) => item.type === "ExpressionStatement");
  if (!currentRootElementNode) {
    return false
  }

  // put the original ast root expression to the new root expression's children
  traverse(providerAst, {
    JSXElement: (path: NodePath<any>) => {
      if (path.node.openingElement.name.name === rootElementName) {
        path.node.children = [currentRootElementNode.expression]
      }
    }
  })
  // get the new root expression
  const expression: any = providerAst.program?.body?.find((node: any) => node.type === 'ExpressionStatement')?.expression;
  // replace the orginal AST root expression
  currentRootElementNode.expression = expression;
  return true
}

/**
 * Wrap the code by given method name
 * eg: origin code React.createElement("div", null, "Hello World") the new code render(React.createElement("div", null, "Hello World"))
 * @param code The origin code
 * @returns new_codes The new code wrapped by given method
 */
export function wrapMethodToRootReactElement(code: string, method: string) {
  // 1. transform code
  const transformCode = transform(code, {
    presets: ["es2015", "react"],
  }).code;

  // 2. get AST
  // @ts-ignore
  const ast = babelParse(transformCode, {
    sourceType: "module",
    plugins: ['jsx']
  });
  // 3. find React.createElement expression in the body of program
  const rnode = findReactNode(ast);
  if (rnode) {
    const nodeIndex = ast.program.body.indexOf(rnode);
    // 4. convert the React.createElement invocation to source and remove the trailing semicolon
    const createElSrc = generate(rnode).code.slice(0, -1).replace('/*#__PURE__*/', '');
    // console.log("method: ", method)
    // console.log("createElSrc: ", createElSrc)
    // 5. transform React.createElement(...) to render(React.createElement(...)), 
    // where render is a callback passed from outside
    // eg: origin code React.createElement("div", null, "Hello World") the new codes render(React.createElement("div", null, "Hello World"))
    const renderCallAst = babelParse(`${method}(${createElSrc})`).program.body[0];
    ast.program.body[nodeIndex] = renderCallAst;
  }
  // convert the ast to code
  const new_code = generate(ast).code
  return new_code
}

/**
 * Get the OpeningElement node attributes
 * @param node 
 * @returns attr The attributes of target node
 */
export function findAttributes(node: any) {
  const _combineAttributes = (attributes: any, componentName: string) => ({
    ...(configList as any)[`${componentName}Config`]?.attributes,
    ...attributes,
  })

  const openingElementNode = node.openingElement;
  const attr: any = {}
  const attributes = openingElementNode?.attributes
  if (!attributes) { 
    return attr
  }
  attributes.forEach((attribute: any) => {
    if (!attribute.name.name) {
      return
    }
    if (!attribute.value) {
      attr[attribute.name.name] = true
    } else if (attribute.value.value != null) {
      attr[attribute.name.name] = attribute.value.value
    } else if (attribute.value.expression) {
      attr[attribute.name.name] = generate(attribute.value.expression).code
      if (attribute.value.expression.type === 'ObjectExpression') {
        attr[attribute.name.name] = objectFromExpression(attribute.value.expression)
      }
    }
  })
  if (t.isJSXText(node.children[0])) {
    attr.label = node.children[0].value
  }
  return _combineAttributes(attr, openingElementNode.name.name)
}

export function combineAttributes (attributes: any, componentName: string) {
  return {
    ...(configList as any)[`${componentName}Config`]?.attributes,
    ...attributes,
  }
}

/**
 * Get object from ObjectExpression in AST
 * @param expression The target ObjectExpression node
 * @returns object The js object
 */
export function objectFromExpression (expression: any) {
  const obj: any = {};
  expression.properties.forEach((property: any) => {
    const key = property.key.name || property.key.value;
    const value = property.value.type === 'ObjectExpression'
      ? objectFromExpression(property.value)
      : property.value.value;
    obj[key] = value;
  });
  return obj;
}

/**
 * Add onclick event to node
 * @param node The target OpeningElement node
 * @param funcCode onclick event function code
 */
export function addOnclickEventToNode(node: any, funcCode: string) {
  node.attributes = node.attributes || [];
  const {attributes} = node;
  const onClickAttributeIndex = attributes.findIndex((attribute: any) => t.isJSXAttribute(attribute) && attribute.name.name === 'onClick');
  const funcAst: any = convertCodeToAst(funcCode)
  const funcExpression = funcAst.program.body[0].expression.openingElement.attributes[0];
  if (onClickAttributeIndex !== -1) {
    attributes[onClickAttributeIndex] = funcExpression;
    return;
  }

  attributes.push(funcExpression);
}


export function addEditModeToNode(path: any,  attr: EditModeAttr) {
  const {parent, node} = path
  if (node.openingElement.name.name === 'Page' ) {
    return;
  }

  // generate the edit mode container
  const wrapBoxCode = `<WrapBox id='wrapbox_${attr.attributes.id}' sx={{}} root={${parent.type === 'ReturnStatement'}} comAttr={${JSON.stringify(attr)}}></WrapBox>`
  const wrapBoxcAst: any = convertCodeToAst(wrapBoxCode)

  // replace the container by WrapBox
  if (node.openingElement.name.name === 'Container' || node.openingElement.name.name === 'Box') {
    // generate the edit mode container
    // add current node into the edit mode container
    wrapBoxcAst.program.body[0].expression.children = node.children
    const { attributes: nodeAttributes } = node.openingElement
    const { attributes: comAttributes } = wrapBoxcAst.program.body[0].expression.openingElement
    nodeAttributes.forEach((attr: any) => {
      if (attr.name.name !== 'id') {
        comAttributes.push(attr)
      }
    })
    wrapBoxcAst.program.body[0].expression.children = node.children
    if (parent.type === 'ReturnStatement') {
      path.container.argument = wrapBoxcAst.program.body[0].expression
    } else {
      // replace the current node with the edit mode container
      const index = parent.children.findIndex((item: any) => item === node)
      parent.children[index] = wrapBoxcAst.program.body[0].expression
    }
    return 
  }
  // wrap the component by WrapBox
  // get the sx attribute from WrapBox
  // const sxAttr = wrapBoxcAst.program.body[0].expression.openingElement.attributes.find((attr: any) => attr.name.name === 'sx')
  // const needMoveProperties = []
  // const needCopyProperties = []
  // // const needMoveProperties = [ 'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
  // //   'top', 'right', 'bottom', 'left', 'position', 'zIndex']
  // // const needCopyProperties = ['width', 'height', 'minWidth', 'maxWidth', 'minHeight', 'maxHeight' ]
  
  // node.openingElement.attributes.forEach((attr: any) => {
  //   // move the component margin related style to WrapBox
  //   if (attr.name.name === 'sx') {
  //     const sxProperties = attr.value.expression.properties
  //     const newProperties: any[] = []
  //     sxProperties.forEach((property: any) => {
  //       // 所有涉及到位置信息的属性都转移到WrapBox中
  //       if (needCopyProperties.includes(property.key.name)) {
  //         sxAttr.value.expression.properties.push(property)
  //         newProperties.push(property)
  //       }
  //       if (needMoveProperties.includes(property.key.name)) {
  //         sxAttr.value.expression.properties.push(property)
  //       } else {
  //         newProperties.push(property)
  //       }
  //     })
  //     attr.value.expression.properties = newProperties
  //   }
  //   // if (attr.name.name === 'fullWidth') {
  //   //   // 将width设置为100% 放入sx属性中
  //   //   sxAttr.value.expression.properties.push(t.objectProperty(t.stringLiteral('width'), t.stringLiteral('100%')))
  //   // }
  //   // if (attr.name.name === 'fullHeight') {
  //   //   sxAttr.value.expression.properties.push(t.objectProperty(t.stringLiteral('height'), t.stringLiteral('100%')))
  //   // }
  //   // if (attr.name.name === 'width' || attr.name.name === 'height') {
  //   //   sxAttr.value.expression.properties.push(t.objectProperty(t.stringLiteral(attr.name.name), attr.value))
  //   // }
  //   // if (attr.name.name === 'variant') {
  //   //   wrapBoxcAst.program.body[0].expression.openingElement.attributes.push(t.jsxAttribute(t.jsxIdentifier('variant'), attr.value))
  //   // }
  // })

  // add current node into the edit mode container
  wrapBoxcAst.program.body[0].expression.children = [node]
  // replace the current node with the edit mode container
  const index = parent.children.findIndex((item: any) => item === node)
  parent.children[index] = wrapBoxcAst.program.body[0].expression
}

/**
 * Add ref and style to node
 * @param node The target OpeningElement node
 * @param code target element code
 */
export function addRefAndStyleToNode(node: any, code: string) {
  node.attributes = node.attributes || [];
  const {attributes} = node;
  const refAttributeIndex = attributes.findIndex((attribute: any) => t.isJSXAttribute(attribute) && attribute.name.name === 'ref');
  const funcAst: any = convertCodeToAst(code)
  const funcExpression = funcAst.program.body[0].expression.openingElement.attributes[0];
  if (refAttributeIndex !== -1) {
    attributes[refAttributeIndex] = funcExpression;
    return;
  }

  attributes.push(funcExpression);
}

/**
 * update the component attributes in source code
 * @param code source code
 * @param attributes component new attributes
 * @param componentName component name
 * @returns new_code new source code
 */
export function updateComponentAttributes(code: string, attributes: IAttribute, componentName: string) {
  
  const ast = convertCodeToAst(code)
  traverse(ast, {
    JSXElement: (path: any) => {
      const elementAttr = findAttributes(path.node)
      if (elementAttr.id === attributes.attributes.id) {
        let newAttributes = attributes.attributes
        if (typeof newAttributes === 'string') {
          newAttributes = JSON.parse(newAttributes)
        }
        
        const componentCode = _replace(componentName, newAttributes)
        const componentAst = convertCodeToAst(componentCode)
        const statement: any = componentAst.program.body[0]
        const newExpression = statement.expression
        if (t.isJSXText(path.node.children[0]) && newExpression.children[0]) {
          path.node.children[0] = newExpression.children[0]
        }
        path.node.openingElement.attributes = newExpression.openingElement.attributes
      }
    }
  })
  // convert the ast to code
  const new_code = generate(ast)
  return new_code.code
}

/**
 * replace the placeholder in code with attributes
 * @param code component code string, eg: Button
 * @param attr attributes object, eg: {label: '按钮'}
 * @returns replaced codes, eg: <Button label="按钮"></Button>
 */
function _replace(name: string, attr: {[key: string]: any}) {
  let code = `<${name}`
  Object.keys(attr).forEach(key => {
    let value = attr[key]
    if (key === 'funs') {
      return;
    }
    if (typeof value !== 'string') {
      value = JSON.stringify(value)
      code += ` ${key}={${value}}`
    } else {
      code += ` ${key}="${value}"`
    }
  })
  code += ` funs={funs}>${attr.label||''}</${name}>`
  
  return code
}

export function addComponentToCode(code: string, targetId: string, component: any, isContainer: boolean) {
  const ast = convertCodeToAst(code)
  // add import code to the top of the original AST
  if (component.importCode) {
    const importArr = Array.isArray(component.importCode) ? component.importCode : []
    importArr.forEach((item: string) => {
      const importAst = convertCodeToAst(item)
      if (!isContainTargetImportCode(ast, importAst)) {
        ast.program.body.unshift(importAst.program.body[0]);
      }
    })
  }
  const replacedCode = _replace(component.name, {...component.attributes, id: component.id})
  
  const wrapAst = babelParse(replacedCode, {
    sourceType: "module",
    plugins: [
      "jsx",
      "typescript",
      "decorators-legacy"
    ]
  })
  const expressionStatement: any = wrapAst.program.body[0]
  traverse(ast, {
    JSXElement(path: any) {
      const elementAttr = findAttributes(path.node)
      if (elementAttr.id === targetId) {
        // 如果当前是容器组件，且组件没有子组件，则直接添加子组件
        if (isContainer && path.node.children?.length === 0) {
          path.node.children.push(expressionStatement.expression)
          return
        }
        const targetParentNode = path.parent
        // 将sourceNode插入到targetNode的位置
        // ReturnStatement
        if (t.isReturnStatement(targetParentNode)) {
          // @ts-ignore
          const index = targetParentNode.argument?.children?.indexOf(path.node)
          // @ts-ignore
          targetParentNode.argument?.children?.splice(index, 0, expressionStatement.expression)
        } else {
          const index = targetParentNode.children?.indexOf(path.node)
          targetParentNode.children?.splice(index, 0, expressionStatement.expression)
        }
      }
    }
  })
  const new_codes = generate(ast)
  return new_codes.code
}

export function moveComponentInCode(code: string, sourceId: string, targetId: string, isContainer: boolean) {
  // 解析code 转换为AST
  // 将sourceId的节点移动到targetId的节点位置上
  const ast = convertCodeToAst(code)
  let sourceNode: any = null
  let targetParentNode: any = null
  let targetNode: any = null
  let targetIndex = -1
  traverse(ast, {
    JSXElement(path: any) {
      const elementAttr = findAttributes(path.node)
      if (elementAttr.id === sourceId) {
        sourceNode = path.node
        // 从父节点中删除
        path.remove()
      }
      if (elementAttr.id === targetId) {
        targetNode = path.node
        targetParentNode = path.parent
        // 将sourceNode插入到targetNode的位置
        // ReturnStatement
        if (t.isReturnStatement(targetParentNode)) {
          // @ts-ignore
          targetIndex = targetParentNode.argument?.children?.indexOf(path.node)
        } else {
          targetIndex = targetParentNode.children?.indexOf(path.node)
        }
      }
    }
  })
  if (isContainer && targetNode.children?.length === 0) {
    // 如果当前是容器组件，且组件没有子组件，则直接添加子组件
    targetNode.children.push(sourceNode)
  } else if (t.isReturnStatement(targetParentNode)) {
    // 将sourceNode插入到targetNode的位置上
    // @ts-ignore
    targetParentNode.argument?.children?.splice(targetIndex, 0, sourceNode)
  } else {
    // 将sourceNode插入到targetNode的位置上
    targetParentNode.children?.splice(targetIndex, 0, sourceNode)
  }

  const new_codes = generate(ast)
  return new_codes.code
}


export function deleteFromCode(code: string, id: string) {
  const ast = convertCodeToAst(code)
  traverse(ast, {
    JSXElement(path: any) {
      const elementAttr = findAttributes(path.node)
      if (elementAttr.id === id) {
        path.remove()
      }
    }
  })
  
  const new_codes = generate(ast)
  return new_codes.code
}

export function isContainTargetImportCode(ast: any, importAst: any) {
  const importName = importAst.program.body[0].specifiers[0].local.name
  let isContain = false
  traverse(ast, {
    ImportDeclaration(path: any) {
      if (path.node.specifiers.find((item:any) => item.local.name === importName)) {
        isContain = true
      }
    }
  })
  return isContain
}

/**
 * Returns the Babel AST node corresponding to the given value.
 * 
 * @param value - The value to convert to an AST node.
 * @returns The Babel AST node representing the value.
 */
export function getValueNode(value: any): any{
  const type = typeof value;
  switch (type) {
    case 'string':
      return t.stringLiteral(value);
    case 'number':
      return t.numericLiteral(value);
    case 'boolean':
      return t.booleanLiteral(value);
    case 'object': {
      if (value == null) {
        return t.nullLiteral();
      }
      if (Array.isArray(value)) {
        return t.arrayExpression(value.map(getValueNode));
      }
      const keys = Object.keys(value);
      if (keys.length === 0) {
        return t.objectExpression([]);
      }
      const properties = keys.map(key => t.objectProperty(t.stringLiteral(key), getValueNode(value[key])));
      return t.objectExpression(properties);
    }
    default:
      return null
  }
}


export function getVariableNode(key: string, kind: "let" | "const", type: t.TSType, valueNode: any): any {
  const identifier = t.identifier(key)
  identifier.typeAnnotation = t.tsTypeAnnotation(type)
  return t.variableDeclaration(kind, [
    t.variableDeclarator(identifier, valueNode)
  ])
}

/**
 * Convert AST node to code
 * @param node The target AST node
 * @returns code The code string
 */
export function convertAstNodeToCode(node: any): string {
  // 生成TS代码
  return generate(node).code;
}

export function getComTree(code: string) {
  const getTreeList = (list: any[], map: any) => list.map((item: any) => {
    item.children = map[item.id] || []
    if (item.children.length > 0) {
      item.children = getTreeList(item.children, map)
    }
    return item
  })
  const ast = convertCodeToAst(code)
  const comStructure = getComStructure(ast)
  const parentMap: any = {
  }
  const rootNodes: any = []
  Object.keys(comStructure).forEach((key: string) => {
    const item = comStructure[key]
    if (item.parent) {
      if (!parentMap[item.parent]) {
        parentMap[item.parent] = []
      }
      parentMap[item.parent].push({
        id: key,
        label: item.componentName,
        children: []
      })
    } else {
      rootNodes.push({
        id: key,
        label: item.componentName,
        children: []
      })
    }
  })
  return {
    treeStructure: getTreeList(rootNodes, parentMap),
    comStructure
  } 
}

/**
 * Draft
 * Insert page codes to the original AST
 * @param ast 
 * @param componentName 
 * @param prefix 
 * @returns 
 */
export function insertPageComponent(ast: any, componentName: string, prefix: string) {
  // const pageComponentName = componentName.split(prefix)[1];
  // const { page } = reduxStore.store.getState().codes;
  // const code = page[pageComponentName];
  // if (!code) {
  //   throw new Error(`Invalid page component ${componentName}`);
  // }

  // const isExistsPageComponentNode = ast.program.body.some((bodyNode: any) => 
  //   t.isVariableDeclaration(bodyNode) &&
  //   bodyNode.declarations.some(declaration => t.isIdentifier(declaration.id) && declaration.id.name === componentName)
  // );
  // if (isExistsPageComponentNode) {
  //   return;
  // }

  // const pageCardComponentAst = babelParse(code, {
  //   sourceType: "module",
  //   plugins: [
  //     "jsx",
  //   ]
  // });
  // const pageComponentNode = pageCardComponentAst.program.body.find(bodyNode => {
  //   if (!t.isVariableDeclaration(bodyNode)) {
  //     return false;
  //   }

  //   return bodyNode.declarations.some(declarationNode => 
  //     t.isIdentifier(declarationNode.id) && declarationNode.id.name === pageComponentName
  //   );
  // });
  // if (!t.isVariableDeclaration(pageComponentNode) || !t.isIdentifier(pageComponentNode.declarations[0].id)) {
  //   return;
  // }

  // pageComponentNode.declarations[0].id.name = componentName;
  // ast.program.body.push(pageComponentNode);
}