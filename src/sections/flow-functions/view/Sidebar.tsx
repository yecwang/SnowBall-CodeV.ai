"use client";

import React from 'react';
import { Box, Typography } from '@mui/material';

interface SidebarProps {
  nodeTypes: { [key: string]: React.FC<any> };
}

const Sidebar: React.FC<SidebarProps> = ({ nodeTypes, }) => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    console.log('drag start', nodeType);
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
    event.stopPropagation()
  };

  const types = Object.keys(nodeTypes);
  // TODO: 添加类别
  // 系统Func
  // 数组
  // 字符串
  
  return (
    <Box sx={{ width: 200, padding: 2, borderRight: '1px solid #ddd' }}>
      <Typography variant="h6" gutterBottom>
        Available Nodes
      </Typography>

      {types.map((type) => (
        <div
          key={type}
          style={{
            padding: '8px',
            marginBottom: '10px',
            cursor: 'pointer',
            border: '1px solid #FFFF',
            borderRadius: '4px',
            backgroundColor: '#f5f5f5',
            transition: 'transform 0.3s ease-out',
            zIndex: 99999,
            wordWrap: 'break-word',
          }}
          onDragStart={(event) => onDragStart(event, type)}
          draggable
        >
          {type} node
        </div>
      ))}
    </Box>
  );
};

export default Sidebar;