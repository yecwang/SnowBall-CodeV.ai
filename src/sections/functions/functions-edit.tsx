'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
// @mui
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// components
import { useSettingsContext } from 'src/components/settings';

import Blockly, { WorkspaceSvg } from 'blockly';
import { javascriptGenerator, Order } from 'blockly/javascript';
// eslint-disable-next-line import/no-extraneous-dependencies
// import '@blockly/toolbox-search';

// routes
import { useSearchParams } from 'next/navigation';
import { useSelector } from 'src/redux/store';
import { useParams } from 'src/routes/hook';
// redux
import { setFunctions } from 'src/redux/slices/project';
import { useDispatch } from 'react-redux';

import useServerAction from 'src/hooks/use-server-action';
import { TFunction, TVariable } from 'src/pluginapp-context-manager/types';
import * as projectActions from 'src/services/server-actions/project/client';
import _ from 'lodash';
// ----------------------------------------------------------------------
const blocklyThem = () => {
  const defaultBlockStyles = {
    colour_blocks: {
      colourPrimary: '#05427f',
      colourSecondary: '#2974c0',
      colourTertiary: '#2d74bb',
    },
    list_blocks: {
      colourPrimary: '#b69ce8',
      colourSecondary: '#ccbaef',
      colourTertiary: '#9176c5',
    },
    logic_blocks: {
      colourPrimary: '#9fd2f1',
      colourSecondary: '#c0e0f4',
      colourTertiary: '#74bae5',
    },
    loop_blocks: {
      colourPrimary: '#aa1846',
      colourSecondary: '#d36185',
      colourTertiary: '#7c1636',
    },
    math_blocks: {
      colourPrimary: '#e6da39',
      colourSecondary: '#f3ec8e',
      colourTertiary: '#f2eeb7',
    },
    procedure_blocks: {
      colourPrimary: '#590721',
      colourSecondary: '#8c475d',
      colourTertiary: '#885464',
    },
    text_blocks: {
      colourPrimary: '#058863',
      colourSecondary: '#5ecfaf',
      colourTertiary: '#04684c',
    },
    variable_blocks: {
      colourPrimary: '#4b2d84',
      colourSecondary: '#816ea7',
      colourTertiary: '#83759e',
    },
    variable_dynamic_blocks: {
      colourPrimary: '#4b2d84',
      colourSecondary: '#816ea7',
      colourTertiary: '#83759e',
    },
  };

  const categoryStyles = {
    colour_category: {
      colour: '#05427f',
    },
    list_category: {
      colour: '#b69ce8',
    },
    logic_category: {
      colour: '#9fd2f1',
    },
    loop_category: {
      colour: '#aa1846',
    },
    math_category: {
      colour: '#e6da39',
    },
    procedure_category: {
      colour: '#590721',
    },
    text_category: {
      colour: '#058863',
    },
    variable_category: {
      colour: '#4b2d84',
    },
    variable_category_system: {
      colour: '#058863',
    },
    variable_dynamic_category: {
      colour: '#4b2d84',
    },
  };
  const theme = Blockly.Theme.defineTheme('custom', {
    name: 'custom',
    blockStyles: defaultBlockStyles,
    categoryStyles,
    componentStyles: {},
    fontStyle: {},
    // startHats: null,
  });
  return theme;
};

interface FunctionDefine {
  type: string;
  inputsInline: boolean;
  colour: number | string;
  tooltip: string;
  helpUrl: string;
  message0: string;
  args0: any[];
  message1?: string;
  args1?: any[];
  previousStatement?: any;
  nextStatement?: any;
  output?: any;
}

interface FunctionParser {
  name: string;
  isReturn: boolean;
  parameters: { name: string }[];
}

export default function FunctionsEdit() {
  const { run: updateFunctions } = useServerAction(projectActions.updateFunctions);
  const { run: getFuncsParams } = useServerAction(projectActions.getFuncsParams);
  const { run: getSysFuncs } = useServerAction(projectActions.getSysFuncs);
  const settings = useSettingsContext();
  const urlSearchParams = useSearchParams();
  const project = useSelector((state) => state.project);
  const params = useParams();
  const projectID = Number(params.projectID);
  const dispatch = useDispatch();
  const [projectFunctions, setProjectFunctions] = useState<TFunction[]>([]);
  const [code, setCode] = useState('');
  const [workspace, setWorkspace] = useState<WorkspaceSvg | null>(null);
  const functionName = urlSearchParams.get('name');
  
  const currentFunc = project[projectID]?.functions.find((func) => func.name === functionName);
  const defaultToolbox = {
    kind: 'categoryToolbox',
    contents: [
      {
        kind: 'category',
        name: 'Logic',
        categorystyle: 'logic_category',
        contents: [
          {
            type: 'controls_if',
            kind: 'block',
          },
          {
            type: 'logic_compare',
            kind: 'block',
            fields: {
              OP: 'EQ',
            },
          },
          {
            type: 'logic_operation',
            kind: 'block',
            fields: {
              OP: 'AND',
            },
          },
          {
            type: 'logic_negate',
            kind: 'block',
          },
          {
            type: 'logic_boolean',
            kind: 'block',
            fields: {
              BOOL: 'TRUE',
            },
          },
          {
            type: 'logic_null',
            kind: 'block',
            enabled: false,
          },
          {
            type: 'logic_ternary',
            kind: 'block',
          },
        ],
      },
      {
        kind: 'category',
        name: 'Loops',
        categorystyle: 'loop_category',
        contents: [
          {
            type: 'controls_repeat_ext',
            kind: 'block',
            inputs: {
              TIMES: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 10,
                  },
                },
              },
            },
          },
          {
            type: 'controls_repeat',
            kind: 'block',
            enabled: false,
            fields: {
              TIMES: 10,
            },
          },
          {
            type: 'controls_whileUntil',
            kind: 'block',
            fields: {
              MODE: 'WHILE',
            },
          },
          {
            type: 'controls_for',
            kind: 'block',
            fields: {
              VAR: {
                name: 'i',
              },
            },
            inputs: {
              FROM: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 1,
                  },
                },
              },
              TO: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 10,
                  },
                },
              },
              BY: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 1,
                  },
                },
              },
            },
          },
          {
            type: 'controls_forEach',
            kind: 'block',
            fields: {
              VAR: {
                name: 'j',
              },
            },
          },
          {
            type: 'controls_flow_statements',
            kind: 'block',
            enabled: false,
            fields: {
              FLOW: 'BREAK',
            },
          },
        ],
      },
      {
        kind: 'category',
        name: 'Math',
        categorystyle: 'math_category',
        contents: [
          {
            type: 'math_number',
            kind: 'block',
            fields: {
              NUM: 123,
            },
          },
          {
            type: 'math_arithmetic',
            kind: 'block',
            fields: {
              OP: 'ADD',
            },
            inputs: {
              A: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 1,
                  },
                },
              },
              B: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 1,
                  },
                },
              },
            },
          },
          {
            type: 'math_single',
            kind: 'block',
            fields: {
              OP: 'ROOT',
            },
            inputs: {
              NUM: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 9,
                  },
                },
              },
            },
          },
          {
            type: 'math_trig',
            kind: 'block',
            fields: {
              OP: 'SIN',
            },
            inputs: {
              NUM: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 45,
                  },
                },
              },
            },
          },
          {
            type: 'math_constant',
            kind: 'block',
            fields: {
              CONSTANT: 'PI',
            },
          },
          {
            type: 'math_number_property',
            kind: 'block',
            fields: {
              PROPERTY: 'EVEN',
            },
            inputs: {
              NUMBER_TO_CHECK: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 0,
                  },
                },
              },
            },
          },
          {
            type: 'math_round',
            kind: 'block',
            fields: {
              OP: 'ROUND',
            },
            inputs: {
              NUM: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 3.1,
                  },
                },
              },
            },
          },
          {
            type: 'math_on_list',
            kind: 'block',
            fields: {
              OP: 'SUM',
            },
          },
          {
            type: 'math_modulo',
            kind: 'block',
            inputs: {
              DIVIDEND: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 64,
                  },
                },
              },
              DIVISOR: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 10,
                  },
                },
              },
            },
          },
          {
            type: 'math_constrain',
            kind: 'block',
            inputs: {
              VALUE: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 50,
                  },
                },
              },
              LOW: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 1,
                  },
                },
              },
              HIGH: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 100,
                  },
                },
              },
            },
          },
          {
            type: 'math_random_int',
            kind: 'block',
            inputs: {
              FROM: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 1,
                  },
                },
              },
              TO: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 100,
                  },
                },
              },
            },
          },
          {
            type: 'math_random_float',
            kind: 'block',
          },
          {
            type: 'math_atan2',
            kind: 'block',
            inputs: {
              X: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 1,
                  },
                },
              },
              Y: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 1,
                  },
                },
              },
            },
          },
        ],
      },
      {
        kind: 'category',
        name: 'Text',
        categorystyle: 'text_category',
        contents: [
          {
            type: 'text',
            kind: 'block',
            fields: {
              TEXT: '',
            },
          },
          {
            type: 'text_join',
            kind: 'block',
          },
          {
            type: 'text_append',
            kind: 'block',
            fields: {
              name: 'item',
            },
            inputs: {
              TEXT: {
                shadow: {
                  type: 'text',
                  fields: {
                    TEXT: '',
                  },
                },
              },
            },
          },
          {
            type: 'text_length',
            kind: 'block',
            inputs: {
              VALUE: {
                shadow: {
                  type: 'text',
                  fields: {
                    TEXT: 'abc',
                  },
                },
              },
            },
          },
          {
            type: 'text_isEmpty',
            kind: 'block',
            inputs: {
              VALUE: {
                shadow: {
                  type: 'text',
                  fields: {
                    TEXT: '',
                  },
                },
              },
            },
          },
          {
            type: 'text_indexOf',
            kind: 'block',
            fields: {
              END: 'FIRST',
            },
            inputs: {
              VALUE: {
                block: {
                  type: 'variables_get',
                  fields: {
                    VAR: {
                      name: 'text',
                    },
                  },
                },
              },
              FIND: {
                shadow: {
                  type: 'text',
                  fields: {
                    TEXT: 'abc',
                  },
                },
              },
            },
          },
          {
            type: 'text_charAt',
            kind: 'block',
            fields: {
              WHERE: 'FROM_START',
            },
            inputs: {
              VALUE: {
                block: {
                  type: 'variables_get',
                  fields: {
                    VAR: {
                      name: 'text',
                    },
                  },
                },
              },
            },
          },
          {
            type: 'text_getSubstring',
            kind: 'block',
            fields: {
              WHERE1: 'FROM_START',
              WHERE2: 'FROM_START',
            },
            inputs: {
              STRING: {
                block: {
                  type: 'variables_get',
                  fields: {
                    VAR: {
                      name: 'text',
                    },
                  },
                },
              },
            },
          },
          {
            type: 'text_changeCase',
            kind: 'block',
            fields: {
              CASE: 'UPPERCASE',
            },
            inputs: {
              TEXT: {
                shadow: {
                  type: 'text',
                  fields: {
                    TEXT: 'abc',
                  },
                },
              },
            },
          },
          {
            type: 'text_trim',
            kind: 'block',
            fields: {
              MODE: 'BOTH',
            },
            inputs: {
              TEXT: {
                shadow: {
                  type: 'text',
                  fields: {
                    TEXT: 'abc',
                  },
                },
              },
            },
          },
          {
            type: 'text_count',
            kind: 'block',
            inputs: {
              SUB: {
                shadow: {
                  type: 'text',
                  fields: {
                    TEXT: '',
                  },
                },
              },
              TEXT: {
                shadow: {
                  type: 'text',
                  fields: {
                    TEXT: '',
                  },
                },
              },
            },
          },
          {
            type: 'text_replace',
            kind: 'block',
            inputs: {
              FROM: {
                shadow: {
                  type: 'text',
                  fields: {
                    TEXT: '',
                  },
                },
              },
              TO: {
                shadow: {
                  type: 'text',
                  fields: {
                    TEXT: '',
                  },
                },
              },
              TEXT: {
                shadow: {
                  type: 'text',
                  fields: {
                    TEXT: '',
                  },
                },
              },
            },
          },
          {
            type: 'text_reverse',
            kind: 'block',
            inputs: {
              TEXT: {
                shadow: {
                  type: 'text',
                  fields: {
                    TEXT: '',
                  },
                },
              },
            },
          },
          {
            type: 'text_print',
            kind: 'block',
            inputs: {
              TEXT: {
                shadow: {
                  type: 'text',
                  fields: {
                    TEXT: 'abc',
                  },
                },
              },
            },
          },
          {
            type: 'text_prompt_ext',
            kind: 'block',
            fields: {
              TYPE: 'TEXT',
            },
            inputs: {
              TEXT: {
                shadow: {
                  type: 'text',
                  fields: {
                    TEXT: 'abc',
                  },
                },
              },
            },
          },
        ],
      },
      {
        kind: 'category',
        name: 'Lists',
        categorystyle: 'list_category',
        contents: [
          {
            type: 'lists_create_with',
            kind: 'block',
          },
          {
            type: 'lists_create_with',
            kind: 'block',
          },
          {
            type: 'lists_repeat',
            kind: 'block',
            inputs: {
              NUM: {
                shadow: {
                  type: 'math_number',
                  fields: {
                    NUM: 5,
                  },
                },
              },
            },
          },
          {
            type: 'lists_length',
            kind: 'block',
          },
          {
            type: 'lists_isEmpty',
            kind: 'block',
          },
          {
            type: 'lists_indexOf',
            kind: 'block',
            fields: {
              END: 'FIRST',
            },
            inputs: {
              VALUE: {
                block: {
                  type: 'variables_get',
                  fields: {
                    VAR: {
                      name: 'list',
                    },
                  },
                },
              },
            },
          },
          {
            type: 'lists_getIndex',
            kind: 'block',
            fields: {
              MODE: 'GET',
              WHERE: 'FROM_START',
            },
            inputs: {
              VALUE: {
                block: {
                  type: 'variables_get',
                  fields: {
                    VAR: {
                      name: 'list',
                    },
                  },
                },
              },
            },
          },
          {
            type: 'lists_setIndex',
            kind: 'block',
            fields: {
              MODE: 'SET',
              WHERE: 'FROM_START',
            },
            inputs: {
              LIST: {
                block: {
                  type: 'variables_get',
                  fields: {
                    VAR: {
                      name: 'list',
                    },
                  },
                },
              },
            },
          },
          {
            type: 'lists_getSublist',
            kind: 'block',
            fields: {
              WHERE1: 'FROM_START',
              WHERE2: 'FROM_START',
            },
            inputs: {
              LIST: {
                block: {
                  type: 'variables_get',
                  fields: {
                    VAR: {
                      name: 'list',
                    },
                  },
                },
              },
            },
          },
          {
            type: 'lists_split',
            kind: 'block',
            fields: {
              MODE: 'SPLIT',
            },
            inputs: {
              DELIM: {
                shadow: {
                  type: 'text',
                  fields: {
                    TEXT: ',',
                  },
                },
              },
            },
          },
          {
            type: 'lists_sort',
            kind: 'block',
            fields: {
              TYPE: 'NUMERIC',
              DIRECTION: '1',
            },
          },
          {
            type: 'lists_reverse',
            kind: 'block',
          },
        ],
      },
      {
        kind: 'category',
        name: 'Variables',
        custom: 'VARIABLE',
        categorystyle: 'variable_category',
      },
      {
        kind: 'category',
        name: 'System_Variables',
        custom: 'SYSTEM_VARIABLE',
        categorystyle: 'variable_category_system',
      },
      {
        kind: 'category',
        name: 'Functions',
        custom: 'PROCEDURE',
        categorystyle: 'procedure_category',
      },
      {
        kind: 'category',
        name: 'DOM_Functions',
        custom: 'DOM_PROCEDURE',
        categorystyle: 'procedure_category',
      },
      {
        kind: 'search',
        name: 'Search',
        contents: [],
      },
    ],
  };

  const currentVariables =
    project[projectID]?.variables && project[projectID]?.variables.length
      ? project[projectID]?.variables
      : [
          {
            kind: 'let',
            key: 'item',
            type: 'Number',
            value: 0,
          },
          {
            kind: 'let',
            key: 'text',
            type: 'String',
            value: 'Hello',
          },
          {
            kind: 'let',
            key: 'list',
            type: 'Array',
            value: [],
          },
        ];

  let isLoad = false;

  const startBlocklyWithReturn = (currentFunc: TFunction) => {
    const startBlocks = {
      blocks: {
        languageVersion: 0,
        blocks: [
          {
            type: 'procedures_defreturn',
            x: 630,
            y: 190,
            icons: {
              comment: {
                text: currentFunc.description,
                pinned: false,
                height: 80,
                width: 160,
              },
            },
            fields: {
              NAME: currentFunc.name,
            },
          },
        ],
      },
    };

    return startBlocks;
  };

  const startBlocklyWithoutReturn = (currentFunc: TFunction) => {
    const startBlocks = {
      blocks: {
        languageVersion: 0,
        blocks: [
          {
            type: 'procedures_defnoreturn',
            x: 250,
            y: 30,
            icons: {
              comment: {
                text: currentFunc.description,
                pinned: false,
                height: 80,
                width: 160,
              },
            },
            fields: {
              NAME: currentFunc.name,
            },
          },
        ],
      },
    };
    return startBlocks;
  };

  const initSystemVariable = (ws: any, variables: TVariable[]) => {
    const customVariableBlockly = (variable: TVariable) => {
      const varGet = {
        type: `system_variable_${variable.key}_get`,
        message0: '%1',
        args0: [
          {
            type: 'field_variable',
            name: 'VAR',
            variable: `${variable.key}`,
          },
        ],
        // message0: '%1 %2',
        // args0: [
        //   {
        //     type: 'field_input',
        //     name: 'NAME',
        //     text: `${variable.key}`,
        //   },
        // ],
        inputsInline: false,
        output: null,
        colour: 230,
        tooltip: '',
        helpUrl: '',
      };

      const varSet = {
        type: `system_variable_${variable.key}_set`,
        message0: '%{BKY_VARIABLES_SET}',
        args0: [
          {
            type: 'field_variable',
            name: 'VAR',
            variable: `${variable.key}`,
          },
          {
            type: 'input_value',
            name: 'VALUE',
          },
        ],
        inputsInline: true,
        previousStatement: null,
        nextStatement: null,
        colour: 230,
        tooltip: '',
        helpUrl: '',
      };

      Blockly.defineBlocksWithJsonArray([varGet, varSet]);
      javascriptGenerator.forBlock[`system_variable_${variable.key}_get`] = function (
        block: any,
        generator: any
      ) {
        // block.getField('NAME').textContent_
        return [`global.getVariable("${block.getField('VAR').getVariable().name}")\n`, Order.NONE];
      };
      javascriptGenerator.forBlock[`system_variable_${variable.key}_set`] = function (
        block: any,
        generator: any
      ) {
        const value = generator.valueToCode(block, 'VALUE', Order.ATOMIC);
        return `global.setVariable("${block.getField('VAR').getVariable().name}", ${value})\n`;
      };
    };

    const registerVariables: { kind: string; type: string }[][] = [];
    variables.forEach((variable: TVariable) => {
      customVariableBlockly(variable);
      registerVariables.push([
        {
          kind: 'block',
          type: `system_variable_${variable.key}_get`,
        },
        {
          kind: 'block',
          type: `system_variable_${variable.key}_set`,
        },
      ]);
    });

    ws.registerToolboxCategoryCallback('SYSTEM_VARIABLE', () => registerVariables.flat());
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const initFunction = async (ws: any, functions: TFunction[]) => {
      const customFuncBlockly = (
        funcDef: FunctionParser,
      ) => {
        if (!funcDef) return
        const customFunc: FunctionDefine = {
          type: funcDef.name,
          inputsInline: true,
          colour: 290,
          tooltip: 'call exists func',
          helpUrl: '',
          message0: '',
          args0: [],
        };

        if (funcDef.isReturn) {
          customFunc.output = 'Number';
        } else {
          customFunc.previousStatement = null;
          customFunc.nextStatement = null;
        }

        if (funcDef && funcDef.parameters && funcDef.parameters.length) {
          customFunc.message0 = `function ${funcDef.name} (${funcDef.parameters
            .map((_, i) => `%${i + 1}`)
            .join(', ')})`;
        } else {
          customFunc.message0 = `function ${funcDef.name} ()`;
        }

        if (funcDef && funcDef.parameters) {
          funcDef.parameters.forEach((parameter) => {
            customFunc.args0.push({
              type: 'input_value',
              name: parameter.name,
            });
          });
        }
        Blockly.defineBlocksWithJsonArray([customFunc]);
        javascriptGenerator.forBlock[funcDef.name] = function (block: any, generator: any) {
          // get block inputs
          const params: Array<String> = [];
          if (funcDef && funcDef.parameters) {
            funcDef.parameters.forEach((parameter) => {
              params.push(generator.valueToCode(block, parameter.name, Order.ATOMIC));
            });
          }
          if (funcDef.isReturn) {
            return [`${funcDef.name}(${params.join(',')}) \n`, Order.NONE];
          }
          return `${funcDef.name}(${params.join(',')}) \n`;
        };
      };

      const systemFuncs = async (ws: any) => {
        // @ts-ignore
        const {data: functions}= await getSysFuncs()
        // @ts-ignore
        
        if (functions && functions.length) {
          // @ts-ignore
          functions.forEach((func: FunctionParser) => {
            customFuncBlockly(func);
          });
          // @ts-ignore
          ws.registerToolboxCategoryCallback('DOM_PROCEDURE', () =>
            // @ts-ignore
            functions.map((func: FunctionParser) => ({
              kind: 'block',
              type: func.name,
            }))
          );
        }
      }
      await systemFuncs(ws)
      // @ts-ignore
      const functionParams = await getFuncsParams(projectID);

      const defFuncs:FunctionParser[] = []
      functions.forEach((func) => {
        // @ts-ignore
        const funcParseDef = functionParams.data?.find((_) => _.name === func.name);
        if (funcParseDef) {
          customFuncBlockly(funcParseDef)
          defFuncs.push(funcParseDef)
        }
      });

      ws.registerToolboxCategoryCallback('PROCEDURE', () =>
        defFuncs.map((func) => ({
          kind: 'block',
          type: func.name,
        }))
      );
    };
    const loadBlockly = async () => {
      const ws = Blockly.inject('blocklyDiv', {
        theme: blocklyThem(),
        // renderer: 'Zelos',
        toolbox: defaultToolbox,
        grid: { spacing: 20, length: 4, colour: '#ccc', snap: true },
        move: {
          scrollbars: {
            horizontal: true,
            vertical: true,
          },
          drag: true,
          wheel: false,
        },
        zoom: {
          controls: false,
          wheel: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2,
          pinch: true,
        },
      });
      initSystemVariable(ws, currentVariables);
      // FIXME: using projectFunctions instead of functions
      await initFunction(ws, project[projectID]?.functions);
      ws.addChangeListener(() => {
        generateCode();
      });

      setWorkspace(ws);
      // TODO: parent setWorkspace
      if (ws) {
        // @ts-ignore
        if (!currentFunc?.serializationLoad) {
          Blockly.serialization.workspaces.load(
            // @ts-ignore
            currentFunc.isReturn
              // @ts-ignore
              ? startBlocklyWithReturn(currentFunc)
              // @ts-ignore
              : startBlocklyWithoutReturn(currentFunc),
            ws
          );
        } else {
          // @ts-ignore
          Blockly.serialization.workspaces.load(JSON.parse(currentFunc.serializationLoad), ws);
        }
      }
    }
    if (!currentFunc) {
      return;
    }

    setProjectFunctions(project[projectID]?.functions || []);

    if (!currentFunc) {
      return;
    }

    setProjectFunctions(project[projectID]?.functions || []);
    if (!isLoad) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isLoad = true;
      loadBlockly();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFunc?.name]);

  const generateCode = () => {
    const code = javascriptGenerator.workspaceToCode(workspace);
    setCode(code);
  };

  // const handleSave = async () => {
  //   if (workspace) {
  //     const state = Blockly.serialization.workspaces.save(workspace);
  //     const saveFunc = {...currentFunc};

  //     saveFunc.serializationLoad = JSON.stringify(state);
  //     saveFunc.code = code;
  //     setProjectFunctions(projectFunctions.map((func) => (func.name === saveFunc.name ? saveFunc : func)));
  //   }
  //   const { error } = await updateFunctions(projectID, projectFunctions);
  //   if (!error) {
  //     dispatch(setFunctions({ projectID, functions: projectFunctions }));
  //   }
  // };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const handleSave = useCallback(async () => {
    let saveFuncs = [...projectFunctions];
    if (workspace) {
      const state = Blockly.serialization.workspaces.save(workspace);
      const saveFunc = { ...currentFunc };
      // @ts-ignore
      saveFunc.serializationLoad = JSON.stringify(state);
      saveFunc.code = code;
      // @ts-ignore
      saveFuncs = projectFunctions.map((func) => (func.name === saveFunc.name ? saveFunc : func));
    }
    // @ts-ignore
    const { error } = await updateFunctions(projectID, saveFuncs);
    if (!error) {
      dispatch(setFunctions({ projectID, functions: saveFuncs }));
    }
  }, [workspace, projectFunctions, updateFunctions, projectID, currentFunc, code, dispatch]);

  if (!currentFunc) {
    return <Typography variant="h3">Function not found</Typography>;
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <div style={{ height: '800px' }} id="blocklyDiv" />
      <Box sx={{ mt: 0.5, height: '200px' }} style={{ border: '0.5px solid grey' }}>
        <Editor theme='vs-dark' defaultLanguage="javascript" value={code} />;
      </Box>
      <Button
        sx={{ position: 'fixed', bottom: 0, right: 0, margin: 2 }}
        variant="outlined"
        color="inherit"
        onClick={handleSave}
      >
        Save
      </Button>
    </Container>
  );
}
