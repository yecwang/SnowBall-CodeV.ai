// EditView.jsx
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { AutoForm, AutoFields, SelectField, SubmitField } from 'uniforms-mui';
import Ajv, { JSONSchemaType } from 'ajv';
import { JSONSchemaBridge } from 'uniforms-bridge-json-schema';
import FunctionsIcon from '@mui/icons-material/Functions';

import { useSelector } from 'src/redux/store';
import {
  SharedContext,
  Variable,
} from 'src/pluginapp-context-manager/funtions-lib/utils/VariablesProvider';
import { TPagesConfig } from 'src/pluginapp-context-manager/types';
import { useLocales } from 'src/locales';
import { set } from 'lodash';

interface DynamicFormProps {
  schema: any;
  setNode: (node: any) => void;
  node: any;
  schemaValidator: (model: any) => any;
}


const DynamicForm = ({ schema, schemaValidator, setNode, node }: DynamicFormProps) => {
  const _onSubmit = (values: any) => {
    console.group('DynamicForm');
    console.log(values);
    console.groupEnd();
    setNode({ ...node, data: {...node.data, ...values} });
  };
  const { t } = useLocales();
  const schemaBridge = new JSONSchemaBridge({ schema, validator: schemaValidator });

  return (
    <AutoForm schema={schemaBridge} onSubmit={_onSubmit} >
      <AutoFields />
      <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '10px',
        width: '100%',
      }}
    >
      <SubmitField value={t('submit')} />
    </Box>
    </AutoForm>
  );
};

interface EditViewProps {
  nodeConfig: any;
  node: any;
  setNode: (node: any) => void;
  schemasConfig: SchemaConfig[];
  icon?: React.ReactNode;
}

export interface SchemaConfig {
  filed: string;
  type: string;
  required: boolean;
  relationField?: string;
  description?: string;
  componentStyle?: object;
  enum?: string[];
  // TODO: add when conditions
  when?: {
    field: string;
    value: string | boolean;
  }
}

interface ConvertOptions {
  variables?: Variable[];
  pages?: TPagesConfig[];
}

const DynamicEditView = ({
  nodeConfig,
  node,
  setNode,
  schemasConfig,
  icon = <FunctionsIcon sx={{ marginRight: 1 }} />,
}: EditViewProps) => {
  const _convertSchema = (
    schemasConfig: SchemaConfig[],
    { variables, pages }: ConvertOptions
  ) => {
    const schema: any = {
      title: 'Edit',
      type: 'object',
      properties: {},
      required: [],
    };

    const allOf = []
    for (const config of schemasConfig) {
      const fieldSchema: any = {
        type: config.type,
        title: config.description || config.filed,
      };

      if (config.required) {
        schema.required.push(config.filed);
      }

      if (config.enum) {
        fieldSchema.enum = config.enum
      }
      if (config.relationField === 'variables') {
        // fieldSchema.options = variables?.map((variable) => ({ label: variable.name, value: variable.id })) || [];
        // fieldSchema.enum = variables?.map((variable) => variable.id) || [];
        fieldSchema.uniforms = {
          options: variables?.map((variable) => ({
            label: variable.name,
            value: variable.id,
          })) || [],
        }
      }
      
      if (config.relationField === 'pages') {
        // fieldSchema.allowedValues = pages?.map((page) => ({ label: page.name, value: page.path })) || [];
        // fieldSchema.enum = pages?.map((page) => page.path) || [];
        fieldSchema.uniforms = {
          options: pages?.map((page) => ({
            label: page.name,
            value: page.path,
          })) || [],
        };
      }

      if (config.when) {
        allOf.push({
          if: {
            properties: {
              [config.when.field]: {
                const: config.when.value,
              },
            },
          },
          then: {
            required: [config.filed],
          },
        });
      }
      // if (config.componentStyle) {
      //   fieldSchema.uniforms = {
      //     ...(fieldSchema.uniforms || {}),
      //     style: config.componentStyle.style,
      //   };
      // }

      schema.properties[config.filed] = fieldSchema;
    }

    if (allOf.length) {
      schema.allOf = allOf;
    }
    return schema;
  };

  const _addSchemaValidator = (schema: any) => {
    const ajv = new Ajv({ allErrors: true, useDefaults: true });
    ajv.addKeyword({
      keyword: 'uniforms',
      metaSchema: {
        type: ['object', 'boolean'],
      },
      validate: () => true,
    });
  
    const validate = ajv.compile(schema);
  
    return (model: any) => {
      const valid = validate(model);
      if (valid) {
        return null;
      }
      return { details: validate.errors };
    };
  };
  console.group('EditViewDynamicForm');
  const project = useSelector((state) => state.project);
  const params = useParams();
  const projectID = Number(params.projectID);

  const setting = project[projectID]?.setting || {};

  const context = React.useContext(SharedContext);
  const variables = context?.variables || [];
  const pages: TPagesConfig[] = Array.isArray(setting?.pages) ? setting.pages : [];
  const schema = _convertSchema(schemasConfig, { variables, pages });
  const schemaValidator = _addSchemaValidator(schema);

  console.groupEnd();

  return (
    <Box
      hidden={!(node?.type === nodeConfig.type)}
      sx={{
        marginTop: 2,
        marginBottom: 2,
        marginLeft: 3,
        marginRight: 3,
        padding: 2,
        border: '1px solid #ddd',
        borderRadius: 1,
        backgroundColor: '#fafafa',
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        {icon}
        {nodeConfig.description}
      </Typography>
      <DynamicForm schema={schema}  schemaValidator={schemaValidator} setNode={setNode} node={node} />
    </Box>
  );
};

export default DynamicEditView;