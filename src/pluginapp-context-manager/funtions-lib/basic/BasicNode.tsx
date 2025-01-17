import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Typography, Box, } from '@mui/material';

import FunctionsIcon from '@mui/icons-material/Functions';
import ToolBar from '../utils/ToolBar';

interface BaseNodeProps {
  id: string;
  isConnectable: boolean;
  content: React.ReactNode;
  icon?: React.ReactNode;
  additionalStyles?: object;
}

const BaseNode: React.FC<BaseNodeProps> = ({
  id,
  isConnectable,
  content,
  icon = <FunctionsIcon sx={{ marginRight: 1 }} />,
  additionalStyles = {},
}) => (
  <>
    <ToolBar id={id} />
    <Box
      sx={{
        padding: 1,
        border: '1px solid #ddd',
        borderRadius: 1,
        backgroundColor: '#fafafa',
        ...additionalStyles, // 合并额外的样式
      }}
    >
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {icon}
        <Typography sx={{ borderLeft: '1px solid #ddd', paddingLeft: 1 }}>
          {content}
        </Typography>
      </Box>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </Box>
  </>
);
export default BaseNode;
