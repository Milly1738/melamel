import React, { useState } from 'react';
import { Mode, Algorithm } from '../types.ts';
import { ALGORITHMS_BY_MODE } from '../constants.tsx';

interface ControlsProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onAlgorithmChange: (algorithm: Algorithm) => void;
  onShowCode: () => void;
  speed: number;
  selectedAlgorithm: Algorithm;
  onCustomArray: (arr: number[]) => void;
  onCustomStrings: (strings: { text: string; pattern: string }) => void;
}

const Controls: React.FC<ControlsProps> = (props) => {
  const { mode, onModeChange, isPlaying, onPlayPause, onReset, onSpeedChange, onAlgorithmChange, onShowCode, speed, selectedAlgorithm, onCustomArray, onCustomStrings } = props;
  const [customArrayInput, setCustomArrayInput] = useState('');
  const [customTextInput, setCustomTextInput] = useState('');
  const [customPatternInput, setCustomPatternInput] = useState('');

  const handleSetCustomArray = () => {
    const arr = customArrayInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    if (arr.length > 0) {
      onCustomArray(arr);
    }
  };

  const handleSetCustomStrings = () => {
    onCustomStrings({ text: customTextInput, pattern: customPatternInput });
  };

  const renderCustomInput = () => {
    if (mode === Mode.SORTING || mode === Mode.SEARCHING) {
      return (
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="e.g., 5,3,8,1"
            value={customArrayInput}
            onChange={(e) => setCustomArrayInput(e.target.value)}
            className="p-2 rounded bg-gray-700 border border-gray-600 text-white w-48"
            disabled={isPlaying}
          />
          <button onClick={handleSetCustomArray} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-600" disabled={isPlaying}>
            Set Array
          </button>
        </div>
      );
    }
    if (mode === Mode.STRING_SEARCHING) {
      return (
        <div className="flex items-center gap-2">
          <input type="text" placeholder="Text" value={customTextInput} onChange={e => setCustomTextInput(e.target.value)} className="p-2 rounded bg-gray-700 border border-gray-600 text-white w-32" disabled={isPlaying} />
          <input type="text" placeholder="Pattern" value={customPatternInput} onChange={e => setCustomPatternInput(e.target.value)} className="p-2 rounded bg-gray-700 border border-gray-600 text-white w-24" disabled={isPlaying} />
          <button onClick={handleSetCustomStrings} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-600" disabled={isPlaying}>
            Set Strings
          </button>
        </div>
      )
    }
    return null;
  };

  return (
    <div className="bg-gray-800 shadow-md">
      <div className="p-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-b border-gray-700">
        {(Object.values(Mode)).map(m => (
          <button
            key={m}
            onClick={() => onModeChange(m)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${mode === m ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
            disabled={isPlaying}
          >
            {m}
          </button>
        ))}
      </div>
      <div className="p-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
        <div>
          <select
            value={selectedAlgorithm}
            onChange={(e) => onAlgorithmChange(e.target.value as Algorithm)}
            className="p-2 rounded bg-gray-700 border border-gray-600 text-white"
            disabled={isPlaying}
          >
            {(ALGORITHMS_BY_MODE[mode] || []).map(algo => (
              <option key={algo} value={algo}>{algo}</option>
            ))}
          </select>
        </div>

        <button onClick={onPlayPause} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-600 min-w-[80px]">
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button onClick={onReset} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-500" disabled={isPlaying}>
          New Data
        </button>

        <div className="flex items-center">
          <label className="mr-2 font-medium">Speed:</label>
          <input type="range" min="10" max="290" value={speed} onChange={(e) => onSpeedChange(Number(e.target.value))} />
        </div>

        {renderCustomInput()}

        <button onClick={onShowCode} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          View Code
        </button>
      </div>
    </div>
  );
};

export default Controls;