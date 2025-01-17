"use client";

import React, { memo, ChangeEventHandler } from 'react';
import { Handle, Position } from '@xyflow/react';
import { TextField, Box } from '@mui/material';
import * as babelTypes from '@babel/types';

import ToolBar from '../utils/ToolBar';

interface IfNodeProps {
  id: string;
  data: {
    condition: string;
  };
  isConnectable: boolean;
}

const Node: React.FC<IfNodeProps> = ({ id, data, isConnectable }) => (
  <>
    <ToolBar id={id} />
    <Box sx={{ padding: 1, border: '1px solid #ddd', borderRadius: 1, backgroundColor: '#fafafa' }}>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <Box sx={{ margin: 1 }}>
        <TextField fullWidth label="Condition" value={data.condition} variant="outlined" />
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
  const setCondition: ChangeEventHandler<HTMLInputElement> = (evt) => {
    setNode({ ...node, data: { ...node.data, condition: evt.target.value } });
  };

  return (
    <Box hidden={!(node?.type === 'if')} sx={{ margin: 1 }}>
      <TextField
        fullWidth
        label="Condition"
        value={node?.data?.condition || ''}
        onChange={setCondition}
        variant="outlined"
      />
    </Box>
  );
};

const codeGen = (node: any) => {
  const ifStatement = babelTypes.ifStatement(
    babelTypes.identifier(node?.data?.condition || ''),
    babelTypes.blockStatement([])
  );
  return ifStatement;
};

Node.displayName = 'IfNode';
export default memo(Node);
export { EditView, codeGen };
