/* eslint-disable import/no-extraneous-dependencies */
import * as t from '@babel/types';
import * as AstUtil from "../utils/ast-util";
import { TVariable } from '../types';

const TYPE_MAP: { [key: string]: string } = {
  StringLiteral: 'string',
  NumericLiteral: 'number',
  BooleanLiteral: 'boolean',
  NullLiteral: 'null',
  ArrayExpression: 'Array<any>',
  ObjectExpression: 'object',
}
const TS_TYPE_ANNOTATION = {
  'string': t.tsStringKeyword(),
  'number': t.tsNumberKeyword(),
  'boolean': t.tsBooleanKeyword(),
  'Array<any>': t.tsTypeReference(t.identifier('Array'), t.tsTypeParameterInstantiation([t.tsAnyKeyword()])),
  'object': t.tsObjectKeyword(),
}
/**
 * Parses the given code and returns an array of TVariable.
 * @param code The code to parse.
 * @returns An array of TVariable.
 */
export function parse(code: string): Array<TVariable> {
  // 1. convert code to AST
  const ast = AstUtil.convertTSCodeToAst(code)
  return convertVarAstToVariables(ast)
}

/**
 * Generates code from the given array of TVariable.
 * @param variables The array of TVariable.
 * @returns The generated code.
 */
export function generateCode(variables: Array<TVariable>): string {
  let code = '';
  variables.forEach((variable) => {
    // code += `export ${variable.kind} ${variable.key}: ${variable.type} = ${variable.value};\n`
    // convert variable to AST object, and then convert AST object to code
    let { value } = variable
    if (variable.type === 'Array<any>' || variable.type === 'object') {
      value = JSON.parse(variable.value)
    }
    if (variable.type === 'number') {
      value = Number(variable.value)
    }
    if (variable.type === 'boolean') {
      value = variable.value === 'true'
    }
    const valueNode = AstUtil.getValueNode(value)
    if (!valueNode) {
      return
    }
    const variableNode = AstUtil.getVariableNode(variable.key, variable.kind, TS_TYPE_ANNOTATION[variable.type], valueNode)
    code += `${AstUtil.convertAstNodeToCode(variableNode)}\n`
  })

  code += `\nexport default {
  getVar: (key: string) => {
    return eval(key);
  },
  setVar: (key: string, value: any) => {
    eval(key + " = " + value);
  }
}`
  return code
}

/**
 * Converts the given AST to an array of TVariable.
 * @param ast The AST of the code.
 * @returns An array of TVariable.
 */
function convertVarAstToVariables(ast: any): Array<TVariable> {
  const list:Array<TVariable> = []
  ast.program.body.forEach((node: any) => {
    if (node.type === 'VariableDeclaration') {
      const currentVariableDeclaration = node.declarations[0]
      const variable: TVariable = {
        kind: node.kind,
        name: currentVariableDeclaration.id.name,
        key: currentVariableDeclaration.id.name,
        value: getValueFromNode(currentVariableDeclaration.init),
        type: TYPE_MAP[currentVariableDeclaration.init.type] || currentVariableDeclaration.init.type,
        description: 'var description',
      }
      if (variable.type === 'object' || variable.type === 'Array<any>') {
        variable.value = JSON.stringify(variable.value)
      }
      list.push(variable)
    }
  })

  return list
}

/**
 * Gets the value from the given node.
 * @param node The node.
 * @returns The value.
 */
function getValueFromNode(node: any) {
  if (node.type === 'ArrayExpression') {
    return node.elements.map((element: any) => getValueFromNode(element))
  }

  if (node.type === 'ObjectExpression') {
    const obj: { [key: string]: any } = {}
    node.properties.forEach((property: any) => {
      const key = property.key.name || property.key.value
      obj[key] = getValueFromNode(property.value)
    })
    return obj
  }

  return node.value
}
