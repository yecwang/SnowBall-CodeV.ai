/* eslint-disable import/no-extraneous-dependencies */
import * as t from '@babel/types';
import { ParseResult } from '@babel/parser'
import traverse, { NodePath } from '@babel/traverse'

import * as AstUtil from "../utils/ast-util";
import { TFunction, TProject, TFunctionReferences, FunctionCallSource } from '../types';

export function parse(code: string) {
  // const _convertAstToFunctions = (ast: ParseResult<t.File>) => {
  //   const _extraTypeInTypeAnnotation = (type: string) => {
  //     const regex = /TS(.*?)Keyword/;
  //     return regex.exec(type)?.[1] || type;
  //   }

  //   const results: TFunction[]  = []
  //   ast.program.body.forEach((node) => {
  //     if (node.type === 'FunctionDeclaration') {
  //       const currentFunctionDeclaration = node
  //       results.push({
  //         name: currentFunctionDeclaration.id?.name || '',
  //         params: currentFunctionDeclaration.params.map((param) => {
  //           const { typeAnnotation } = param;
  //           const type = !t.isNoop(typeAnnotation) && typeAnnotation?.typeAnnotation?.type;

  //           return {
  //             name: param.type === 'Identifier' ? param.name : '',
  //             type: _extraTypeInTypeAnnotation(type as string),
  //           };
  //         })
  //       })
  //     }
  //   })
  //   return results;
  // }

  // const ast = AstUtil.convertTSCodeToAst(code);
  // console.log('ast', ast)
  // return _convertAstToFunctions(ast);
}

export function addFunction(originCode: string, functionName: string, functionDescription?: string) {
  const ast = AstUtil.convertTSCodeToAst(originCode);

  const newFunctionCode = `
    /**
     * ${functionDescription}
     */
    function ${functionName}() {}
  `
  // 将 newFunctionCode 添加到AST中，只需要 FunctionDeclaration 节点
  const functionNode = AstUtil.convertCodeToAst(newFunctionCode).program.body[0];
  ast.program.body.unshift(functionNode);

  // 源代码中有 export { }，需要将新添加的 function 节点也放到 export 中导出，导出的节点是放在 specifiers 数组中
  const exportNode = ast.program.body.find((node) => node.type === 'ExportNamedDeclaration');
  if (exportNode && t.isExportNamedDeclaration(exportNode)) {
    const exportNodeSpecifiers = exportNode.specifiers;
    const newSpecifier = t.exportSpecifier(t.identifier(functionName), t.identifier(functionName));
    exportNodeSpecifiers.push(newSpecifier);
  }

  return AstUtil.convertAstNodeToCode(ast);
}

export function parseFuncParams(code: string) {
  const ast = AstUtil.convertTSCodeToAst(code);
  const results: {
    name: string;
    isReturn: boolean;
    parameters: {
      name: string;
    }[];
  }[]  = []
  ast.program.body.forEach((node) => {
    if (node.type === 'FunctionDeclaration') {
      const currentFunctionDeclaration = node
      const haveReturn = currentFunctionDeclaration.body.body.some((body) => body.type === 'ReturnStatement');
      results.push({
        name: currentFunctionDeclaration.id?.name || '',
        isReturn: haveReturn,
        parameters: currentFunctionDeclaration.params.map((param) => ({
            name: param.type === 'Identifier' ? param.name : '',
          }))
      })
    }
  })
  return results;
}


export function checkReferences(project: TProject, functionNames: string[]) {
  const _updateFunctionReferences = (checkFunctionName: string, referencePaths: string[], callSource: FunctionCallSource) => {
    if (!checkFunctionName) {
      return;
    }

    if (!functionReferences[checkFunctionName]) {
      functionReferences[checkFunctionName] = [];
    }
    
    functionReferences[checkFunctionName].push({
      callSource,
      paths: referencePaths,
    });
  }
  const _checkReferencesInPages = () => {
    const _getComponentText = (path: NodePath<t.JSXElement>) => {
      for (const child of path.node.children) {
        if (child.type === 'JSXText') {
          return child.value.trim();
        } 
      }
      
      return '';
    }
    const _getComponentName = (node: t.JSXIdentifier | t.JSXMemberExpression | t.JSXNamespacedName): string => {
      if (node.type === 'JSXIdentifier') {
        return node.name;
      } if (node.type === 'JSXMemberExpression') {
        return `${_getComponentName(node.object)  }.${  _getComponentName(node.property)}`;
      }
      return '';
    }
    const _checkTargetValue = (attr: t.JSXAttribute | t.JSXSpreadAttribute) => {
      const attrValue = attr.type === 'JSXAttribute' && attr.value && attr.value.type === 'StringLiteral' && attr.value.value;
      if (!attrValue) {
        return null;
      }

      return functionNames.find((name) => name === attrValue as string);
    }

    for (const [pageName, pageCode] of Object.entries(project.pages)) {
      if (typeof pageCode !== 'string') {
        continue;
      }
      const ast = AstUtil.convertCodeToAst(pageCode);
      traverse(ast, {
        JSXElement(path) {
          for (const attr of path.node.openingElement.attributes) {
            const checkFunctionName = _checkTargetValue(attr);
            if (!checkFunctionName) {
              continue;
            }

            const referencePaths = [pageName];
            const componentValue = _getComponentText(path) || _getComponentName(path.node.openingElement.name);
            if (componentValue) {
              referencePaths.push(componentValue);
            }

            _updateFunctionReferences(checkFunctionName, referencePaths, FunctionCallSource.Page);
          }
        },
      });
    }
  }
  const _checkReferencesInFunctions =() => {
    const _checkTargetValue = (innerPath: NodePath<t.CallExpression>) => {
      const { callee } = innerPath.node;
      if (
        callee.type === 'MemberExpression' &&
        callee.object.type === 'Identifier' &&
        callee.object.name === 'global' &&
        callee.property.type === 'Identifier' &&
        callee.property.name === 'getFunction' &&
        innerPath.node.arguments.length > 0 &&
        innerPath.node.arguments[0].type === 'StringLiteral' &&
        innerPath.node.arguments[0].value
      ) {
        const attrValue = innerPath.node.arguments[0].value
        const checkFunctionName = functionNames.find((name) => name === attrValue as string);
        
        return checkFunctionName;
      }

      return null;
    }

    for (const func of project.functions) {
      if (!func.code) {
        continue;
      }

      const ast = AstUtil.convertCodeToAst(func.code);
      traverse(ast, {
        FunctionDeclaration(path) {
          if (!path.node) {
            return;
          }
          
          traverse(path.node, {
            CallExpression(innerPath) {
              const checkFunctionName = _checkTargetValue(innerPath);
              console.log({ checkFunctionName })
              if (checkFunctionName) {
                _updateFunctionReferences(checkFunctionName, [func.name], FunctionCallSource.Function);
              }
            },
            noScope: true,
          });
          
        },
      });
    }
  }

  const functionReferences: TFunctionReferences = {};
  _checkReferencesInPages();
  _checkReferencesInFunctions();
  return functionReferences
}
