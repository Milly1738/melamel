
import React from 'react';
import { StringStep } from '../types.ts';
import { COLORS } from '../constants.tsx';

interface StringVisualizerProps {
  step: StringStep | any | null;
}

const StringVisualizer: React.FC<StringVisualizerProps> = ({ step }) => {
  if (!step || !step.text || !step.pattern) {
    return <div className="flex justify-center items-center w-full h-96 bg-gray-800 p-4 border border-gray-700 rounded text-gray-400">Generate data and press play to start.</div>;
  }

  const { text, pattern, highlights, patternHighlights, patternStart = 0 } = step;

  return (
    <div className="w-full font-mono text-lg p-4 border border-gray-700 rounded bg-gray-900">
      <div className="mb-4">
        <p className="text-sm text-gray-400 mb-2">Text</p>
        <div className="flex gap-1">
          {text.split('').map((char, index) => (
            <div key={index} className={`w-8 h-8 flex items-center justify-center rounded ${highlights[index] || COLORS.textDefault}`}>
              {char}
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-400 mb-2">Pattern</p>
        <div className="flex gap-1" style={{ marginLeft: `${patternStart * 2.25}rem` }}>
           {pattern.split('').map((char, index) => (
            <div key={index} className={`w-8 h-8 flex items-center justify-center rounded ${patternHighlights[index] || COLORS.patternDefault}`}>
              {char}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StringVisualizer;
