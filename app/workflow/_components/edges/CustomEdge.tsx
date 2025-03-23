import React from 'react';
import { useConnection } from '@xyflow/react';
import { useTheme } from 'next-themes';

interface ConnectionProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

const CustomEdge: React.FC<ConnectionProps> = ({ fromX, fromY, toX, toY }) => {
  const {theme} = useTheme();
  const curStroke = theme === 'dark' ? 'white' : 'black';
  return (
    <g>
      <path
        fill="none"
        stroke={curStroke}
        strokeWidth={1.5}
        className="animated"
        d={`M${fromX},${fromY} C ${(fromX + toX) / 2} ${fromY}, ${(fromX + toX) / 2} ${toY}, ${toX},${toY}`}
      />
      <circle
        cx={toX}
        cy={toY}
        fill="#fff"
        r={5}
        stroke="blue-200"
        strokeWidth={1.5}
      />
    </g>
  );
};

export default CustomEdge;
