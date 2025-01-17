"use client";

import React from 'react';
import { useConnection } from '@xyflow/react';

export default ({ fromX, fromY, toX, toY }: { fromX: number, fromY: number, toX: number, toY: number }) => {
  // TODO: need figure out how to get the connection line to render
  const { fromHandle } = useConnection();

  return (
    <g>
      <path
        fill="none"
        stroke="#20B486"
        strokeWidth={1.5}
        className="animated"
        d={`M${fromX},${fromY} C ${fromX} ${toY} ${fromX} ${toY} ${toX},${toY}`}
      />
      <circle
        cx={toX}
        cy={toY}
        fill="#fff"
        r={3}
        stroke="red"
        strokeWidth={1.5}
      />
    </g>
  );
};
