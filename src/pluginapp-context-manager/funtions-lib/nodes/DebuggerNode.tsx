"use client";

import React, { memo, ChangeEventHandler } from 'react';
import { Handle, Position } from '@xyflow/react';
import { TextField, Box, Typography } from '@mui/material';
import * as babelTypes from '@babel/types';
import { AutoForm } from 'uniforms-mui';
import { JSONSchemaBridge } from 'uniforms-bridge-json-schema';
import Ajv, { JSONSchemaType } from 'ajv';
import ToolBar from '../utils/ToolBar';


interface DebuggerNodeProps {
  id: string;
  data: {
    label: string;
  };
  isConnectable: boolean;
}

const Node: React.FC<DebuggerNodeProps> = ({ id, data, isConnectable }) => (
  <>
    <ToolBar id={id} />
    <Box sx={{ padding: 1, border: '1px solid #ddd', borderRadius: 1, backgroundColor: '#fafafa' }}>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <Box sx={{ margin: 1 }}>
        <TextField
          fullWidth
          label="Debugger"
          value={data.label}
          InputProps={{
            readOnly: true,
          }}
          variant="outlined"
        />
      </Box>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </Box>
  </>
);

interface EditViewProps {
  node: any;
  setNode: (node: any) => void;
}


type FormData = {
  firstName: string;
  lastName: string;
  workExperience: number;
  size: string;
};

const schema: JSONSchemaType<FormData> = {
  title: 'Guest',
  type: 'object',
  properties: {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    workExperience: {
      description: 'Work experience in years',
      type: 'integer',
      minimum: 0,
      maximum: 100,
    },
    size: {
      type: 'string',
      default: 'm',
      enum: ['xs', 's', 'm', 'l', 'xl'],
    },
  },
  required: ['firstName', 'lastName'],
};

const ajv = new Ajv({
  allErrors: true,
  useDefaults: true,
  keywords: ['uniforms'],
});

function createValidator<T>(schema: JSONSchemaType<T>) {
  const validator = ajv.compile(schema);

  return (model: Record<string, unknown>) => {
    validator(model);
    return validator.errors?.length ? { details: validator.errors } : null;
  };
}

const schemaValidator = createValidator(schema);


const bridge = new JSONSchemaBridge({
  schema,
  validator: schemaValidator,
});

const EditView = ({ node, setNode }: EditViewProps) => (
    <Box sx={{ margin: 1, paddingTop: '1rem', paddingRight: '1rem' }} hidden={!(node?.type === 'debugger')} >
      <Typography variant="h5">DEBUGGER Configure</Typography>
      <AutoForm schema={bridge} onSubmit={console.log} />
    </Box>

  );
const codeGen = (node: any) => {
  const consoleLog = babelTypes.expressionStatement(
    babelTypes.callExpression(
      babelTypes.memberExpression(babelTypes.identifier('console'), babelTypes.identifier('log')),
      [babelTypes.identifier(node?.data?.variable || '')]
    )
  );
  return consoleLog;
};

Node.displayName = 'DebuggerNode';
export default memo(Node);
export { EditView, codeGen };
