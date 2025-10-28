
import React from 'react';
import { ArrayStep, Algorithm, SortingAlgorithm, SearchingAlgorithm } from '../types.ts';
import { COLORS } from '../constants.tsx';

interface ArrayVisualizerProps {
  step: ArrayStep | any | null;
  algorithm: Algorithm;
}

const ArrayVisualizer: React.FC<ArrayVisualizerProps> = ({ step, algorithm }) => {
  if (!step || !step.array) {
    return <div className="flex justify-center items-center w-full h-96 bg-gray-800 p-4 border border-gray-700 rounded text-gray-400">Generate data and press play to start.</div>;
  }

  const { array, highlights } = step;
  const maxValue = Math.max(...array, 1);

  const isSearching = Object.values(SearchingAlgorithm).includes(algorithm as SearchingAlgorithm);
  
  return (
    <div className={`flex items-end h-96 w-full gap-px bg-gray-800 p-4 border border-gray-700 rounded ${isSearching ? 'justify-start' : 'justify-center'}`}>
      {array.map((value, index) => {
        const height = (value / maxValue) * 100 + '%';
        const color = highlights[index] || COLORS.default;

        return (
          <div key={index} className="flex flex-col items-center flex-grow relative" style={{ minWidth: '8px' }}>
            <div
              className={`w-full transition-colors duration-200 ${color}`}
              style={{ height }}
              title={`${value}`}
            ></div>
            <span className="text-xs text-gray-400 mt-1">{value}</span>
            { isSearching && <span className="absolute -bottom-5 text-xs text-gray-500">{index}</span> }
          </div>
        );
      })}
    </div>
  );
};

export default ArrayVisualizer;
