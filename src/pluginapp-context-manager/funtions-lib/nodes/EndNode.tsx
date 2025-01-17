"use client";

import React, { memo } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { Box, Typography } from '@mui/material';

import ToolBar from '../utils/ToolBar';

interface EndNodeProps {
  id: string;
  data: {
    label: string;
  };
  isConnectable: boolean;
}

const Node: React.FC<EndNodeProps> = ({ id, data, isConnectable }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  return (
    <>
      <ToolBar id={id} />
      <Box
        sx={{ padding: 1, border: '1px solid #ddd', borderRadius: 1, backgroundColor: '#fafafa' }}
      >
        <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
        <Typography variant="body1" sx={{ margin: 1 }}>
          END
        </Typography>
      </Box>
    </>
  );
};

Node.displayName = 'EndNode';
export default memo(Node);
