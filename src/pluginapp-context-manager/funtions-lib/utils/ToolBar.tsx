"use client";

import React from 'react';
import { Button, Box } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import {
  NodeToolbar,
  Position,
  useReactFlow,
} from '@xyflow/react';

interface ToolBarProps {
  id: string;
}
export default function ToolBar({ id }: ToolBarProps) {
  const { setNodes } = useReactFlow();
  const _onClick = (event: React.MouseEvent) => {
    setNodes((nodes) => {
      const newNodes = nodes.filter((n) => n.id !== id);
      return [...newNodes];
    });
  }
  return (
    <NodeToolbar
    // isVisible={isVisible}
    position={Position.Top}
    align="end"
    onMouseEnter={() => console.log('enter', id)}
    onMouseLeave={() => console.log('leave', id)}
  >
    <Button size="small" onClick={_onClick} sx={{justifyContent: "end", padding: 0, margin:0}}><ClearIcon/></Button>
  </NodeToolbar>
  )
}
