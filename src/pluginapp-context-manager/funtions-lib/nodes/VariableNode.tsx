"use client";

import React, { memo, ChangeEventHandler } from 'react';
import { Handle, Position } from '@xyflow/react';
import { TextField, Box, Select, Typography, Grid, MenuItem } from '@mui/material';
import * as babelTypes from '@babel/types';

import ToolBar from '../utils/ToolBar';

interface VariableNodeProps {
  id: string;
  data: {
    variable: string;
    value: string;
  };
  isConnectable: boolean;
}

const Node: React.FC<VariableNodeProps> = ({ id, data, isConnectable }) => (
  <>
    <ToolBar id={id} />
    <Box sx={{ padding: 1, border: '1px solid #ddd', borderRadius: 1, backgroundColor: '#fafafa' }}>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <Box sx={{ margin: 1 }}>
        <Typography>{data.variable || 'Variable'}</Typography>
      </Box>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </Box>
  </>
);

interface EditViewProps {
  node: any;
  setNode: (node: any) => void;
}

const EditView: React.FC<EditViewProps> = ({ node, setNode }) => {
  const setVariable: ChangeEventHandler<HTMLInputElement> = (evt) => {
    setNode({ ...node, data: { ...node.data, variable: evt.target.value } });
  };

  const setValue: ChangeEventHandler<HTMLInputElement> = (evt) => {
    setNode({ ...node, data: { ...node.data, value: evt.target.value } });
  };

  return (
    <Box hidden={!(node?.type === 'variable')} sx={{ margin: 1, paddingTop: '1rem',paddingRight: '1rem' }}>
      <Typography variant="h5">Variable Configure</Typography>
      <Grid container spacing={2} justifyContent="center" textAlign="center" alignItems="center" paddingTop="2rem">
        <Grid item xs={4}>
          <Typography>Variable Type:</Typography>
        </Grid>
        <Grid item xs={8}>
          <Select
            value={node?.data?.type || 'let'}
            // size='medium'
            fullWidth
            onChange={(evt) => {
              console.log(evt.target.value);
              setNode({ ...node, data: { ...node.data, type: evt.target.value } });
            }}
          >
            <MenuItem value="let">变量</MenuItem>
            <MenuItem value="const">常量</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={4}>
          <Typography>variable name:</Typography>
        </Grid>
        <Grid item xs={8}>
          <TextField
            fullWidth
            value={node?.data?.variable || ''}
            onChange={setVariable}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={4}>
          <Typography>Value:</Typography>
        </Grid>
        <Grid item xs={8}>
          <TextField
            fullWidth
            value={node?.data?.value || ''}
            onChange={setValue}
            variant="outlined"
            sx={{ marginTop: 2 }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

const codeGen = (node: any) => {
  const variableDeclaration = babelTypes.variableDeclaration(node?.data?.type || 'let', [
    babelTypes.variableDeclarator(
      babelTypes.identifier(node?.data?.variable || ''),
      babelTypes.stringLiteral(node?.data?.value || '')
    ),
  ]);
  // const identifier = babelTypes.identifier(node?.data?.variable || '');

  // const typeAnnotation = babelTypes.tsTypeAnnotation(
  //   babelTypes.tsStringKeyword()
  // );
  // identifier.typeAnnotation = typeAnnotation;
  // const varValue = babelTypes.stringLiteral(node?.data?.value);
  // const variableDeclarator = babelTypes.variableDeclarator(identifier, varValue);

  // const variableDeclaration = babelTypes.variableDeclaration(node?.data?.type || 'let', [variableDeclarator]);
  return variableDeclaration;
};

Node.displayName = 'VariableNode';
export default memo(Node);
export { EditView, codeGen };
