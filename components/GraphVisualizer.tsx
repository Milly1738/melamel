
import React from 'react';
import { GraphStep, Node, Edge } from '../types.ts';
import { COLORS } from '../constants.tsx';

interface GraphVisualizerProps {
  step: GraphStep | any | null;
}

const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ step }) => {
  if (!step || !step.graph) {
    return <div className="flex justify-center items-center w-full h-96 bg-gray-800 p-4 border border-gray-700 rounded text-gray-400">Generate a graph and press play.</div>;
  }

  const { graph, nodeHighlights, edgeHighlights, distances } = step;
  const { nodes, edges } = graph;

  return (
    <div className="w-full h-[32rem] p-4 border border-gray-700 rounded bg-gray-900 relative">
      <svg width="100%" height="100%" viewBox="0 0 600 400">
        {/* Edges */}
        {edges.map((edge, index) => {
          const sourceNode = nodes.find(n => n.id === edge.source);
          const targetNode = nodes.find(n => n.id === edge.target);
          if (!sourceNode || !targetNode) return null;
          
          const edgeKey = `${Math.min(edge.source, edge.target)}-${Math.max(edge.source, edge.target)}`;
          const color = edgeHighlights[edgeKey] || COLORS.edgeDefault;

          return (
            <g key={index}>
              <line
                x1={sourceNode.x} y1={sourceNode.y}
                x2={targetNode.x} y2={targetNode.y}
                className={`transition-all duration-300 ${color}`}
                strokeWidth="2"
              />
              <text
                x={(sourceNode.x + targetNode.x) / 2}
                y={(sourceNode.y + targetNode.y) / 2 - 5}
                textAnchor="middle"
                fill="#cbd5e1"
                fontSize="12"
              >
                {edge.weight}
              </text>
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map(node => {
          const color = nodeHighlights[node.id] || COLORS.nodeDefault;
          return (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r="15"
                className={`transition-all duration-300 ${color}`}
                stroke="#1f2937"
                strokeWidth="3"
              />
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dy=".3em"
                fill="white"
                fontWeight="bold"
              >
                {node.id}
              </text>
            </g>
          );
        })}
      </svg>
      {distances && (
        <div className="absolute top-2 right-2 bg-gray-800 p-2 rounded border border-gray-700 text-xs">
          <h4 className="font-bold mb-1">Distances:</h4>
          {Object.entries(distances).map(([nodeId, dist]) => (
             // FIX: Coerce dist to string to prevent React render error for type 'unknown'.
             <p key={nodeId}>Node {nodeId}: {String(dist)}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default GraphVisualizer;
