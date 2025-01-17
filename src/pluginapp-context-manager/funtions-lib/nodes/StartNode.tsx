"use client";

import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Box, Typography } from '@mui/material';
import ToolBar from '../utils/ToolBar';

interface StartNodeProps {
  id: string;
  data: {
    label: string;
  };
  isConnectable: boolean;
}

const Node: React.FC<StartNodeProps> = ({ id, data, isConnectable }) => (
  <>
    <ToolBar id={id} />
    <Box sx={{ padding: 1, border: '1px solid #ddd', borderRadius: 1, backgroundColor: '#fafafa' }}>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <Typography variant="body1" sx={{ margin: 1 }}>
        Start
      </Typography>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </Box>
  </>
);

Node.displayName = 'StartNode';
export default memo(Node);
