import * as t from '@babel/types';
import traverse from '@babel/traverse';
import * as parser from '@babel/parser';
import generator from '@babel/generator';

export interface CodeGenProps {
  node: any;
  codeTemplate: string;
  templateConfig: {
    [key: string]: {
      type?: 'identifier' | 'stringLiteral' | 'numericLiteral' | 'booleanLiteral' | 'objectExpression' | 'arrayExpression';
      value: string; 
      relation?: 'NodeData';
    };
  };
}

/**
 * 将 JavaScript 对象转换为 Babel 的 ObjectExpression AST 节点
 * @param obj JavaScript 对象
 * @returns ObjectExpression AST 节点
 */
const buildObjectExpression = (obj: any): t.ObjectExpression => {
  const properties = Object.entries(obj).map(([key, value]) => {
    let valueNode: t.Expression;

    if (typeof value === 'string') {
      valueNode = t.stringLiteral(value);
    } else if (typeof value === 'number') {
      valueNode = t.numericLiteral(value);
    } else if (typeof value === 'boolean') {
      valueNode = t.booleanLiteral(value);
    } else if (Array.isArray(value)) {
      valueNode = buildArrayExpression(value);
    } else if (typeof value === 'object' && value !== null) {
      valueNode = buildObjectExpression(value);
    } else {
      valueNode = t.nullLiteral();
    }

    return t.objectProperty(t.identifier(key), valueNode);
  });

  return t.objectExpression(properties);
};

/**
 * 将 JavaScript 数组转换为 Babel 的 ArrayExpression AST 节点
 * @param arr JavaScript 数组
 * @returns ArrayExpression AST 节点
 */
const buildArrayExpression = (arr: any[]): t.ArrayExpression => {
  const elements = arr.map(item => {
    if (typeof item === 'string') {
      return t.stringLiteral(item);
    } if (typeof item === 'number') {
      return t.numericLiteral(item);
    } if (typeof item === 'boolean') {
      return t.booleanLiteral(item);
    } if (Array.isArray(item)) {
      return buildArrayExpression(item);
    } if (typeof item === 'object' && item !== null) {
      return buildObjectExpression(item);
    } 
      return t.nullLiteral();
    
  });

  return t.arrayExpression(elements);
};

const CodeGen = ({ node, codeTemplate, templateConfig }: CodeGenProps) => {
  console.group('CodeGen');
  console.log('node:', node);
  console.log('codeTemplate:', codeTemplate);
  console.log('templateConfig:', templateConfig);
  const ast = parser.parse(codeTemplate, {
    sourceType: 'module',
  });
  const statements: t.Statement[] = [];

  traverse(ast, {
    Identifier(path) {
      const placeholder = path.node.name;
      const replaceConfig = templateConfig[placeholder];

      if (replaceConfig) {
        // 从 node.data 中获取实际的替换值
        const replacementKey = replaceConfig.value;
        let replacementValue = replaceConfig.value
        if (replaceConfig.relation === 'NodeData') {
          replacementValue = node.data[replaceConfig.value];
        }

        if (replacementValue === undefined) {
          throw new Error(`Replacement value for key "${replacementKey}" is undefined in node.data.`);
        }

        const type = replaceConfig.type || 'identifier';
        let newNode: t.Node;

        switch (type) {
          case 'identifier':
            if (typeof replacementValue !== 'string') {
              throw new Error(`Replacement value for identifier "${replacementKey}" must be a string.`);
            }
            newNode = t.identifier(replacementValue);
            break;
          case 'stringLiteral':
            if (typeof replacementValue !== 'string') {
              throw new Error(`Replacement value for stringLiteral "${replacementKey}" must be a string.`);
            }
            newNode = t.stringLiteral(replacementValue);
            break;
          case 'numericLiteral':
            if (typeof replacementValue !== 'number') {
              throw new Error(`Replacement value for numericLiteral "${replacementKey}" must be a number.`);
            }
            newNode = t.numericLiteral(replacementValue);
            break;
          case 'booleanLiteral':
            if (typeof replacementValue !== 'boolean') {
              throw new Error(`Replacement value for booleanLiteral "${replacementKey}" must be a boolean.`);
            }
            newNode = t.booleanLiteral(replacementValue);
            break;
          case 'objectExpression':
            if (typeof replacementValue !== 'object' || Array.isArray(replacementValue) || replacementValue === null) {
              throw new Error(`Replacement value for objectExpression "${replacementKey}" must be a non-null object.`);
            }
            newNode = buildObjectExpression(replacementValue);
            break;
          case 'arrayExpression':
            if (!Array.isArray(replacementValue)) {
              throw new Error(`Replacement value for arrayExpression "${replacementKey}" must be an array.`);
            }
            newNode = buildArrayExpression(replacementValue);
            break;
          default:
            throw new Error(`Unsupported type: ${type}`);
        }

        path.replaceWith(newNode);
      }
    },
  });
  // 查看修改后的代码


  ast.program.body.forEach(node => {
    if (t.isStatement(node)) {
      statements.push(node);
    }
  });
  const output = generator(ast).code;
  console.log(`Output code: `, output);
  console.log(statements)
  console.groupEnd();
  return statements;
};

export default CodeGen;
