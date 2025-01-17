"use client";

import React, { FC } from 'react';
import {
  EdgeProps,
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
  Edge,
  useReactFlow,
} from '@xyflow/react';
import { TextField } from '@mui/material';

const CustomEdge: FC<EdgeProps<Edge<{ label: string }>>> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const { setEdges } = useReactFlow();
  // @ts-ignore
  const [ifStatus, setIfStatus] = React.useState(data && data.if ? 'Y' : 'N');
  const handleEdgeUpdate = (edgeId: string, label: string) => {
    setIfStatus(label);
    setEdges((edges) => {
      const newEdges = edges.map((edge) => {
        if (edge.id === edgeId) {
          edge.data = edge.data || {};
          edge.data.if = label.toUpperCase() === "Y" || label.toUpperCase() === "YES";
        }
        return edge;
      });
      return newEdges;
    });
  }
  return (
    <>
      <BaseEdge id={id} path={edgePath}/>
      <EdgeLabelRenderer>
        <TextField
          value={ifStatus}
          size='small'
          onChange={(e) => handleEdgeUpdate(id, e.target.value)}
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            background: '#fafafa',
            width: '3rem',
            padding: 0,
            margin: 0,
            pointerEvents: 'all',
            textAlign: 'center',
            alignItems: 'center',
          }}
        />

      </EdgeLabelRenderer>
    </>
  );
};

export default CustomEdge;
