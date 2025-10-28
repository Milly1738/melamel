import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header.tsx';
import Controls from './components/Controls.tsx';
import ArrayVisualizer from './components/ArrayVisualizer.tsx';
import StringVisualizer from './components/StringVisualizer.tsx';
import GreedyVisualizer from './components/GreedyVisualizer.tsx';
import GraphVisualizer from './components/GraphVisualizer.tsx';
import CodeModal from './components/CodeModal.tsx';
import { Mode, Algorithm, AnimationStep, Graph, GreedyAlgorithm } from './types.ts';
import { DEFAULT_ALGORITHM, DEFAULT_SPEED } from './constants.tsx';
import * as algorithms from './services/algorithms.ts';
import { CODE_SNIPPETS } from './services/codeSnippets.ts';

// A pure function to generate data based on the mode
const generateInitialData = (mode: Mode) => {
  switch (mode) {
    case Mode.SORTING:
    case Mode.SEARCHING:
      return { array: algorithms.generateRandomArray() };
    case Mode.STRING_SEARCHING:
      return { strings: algorithms.generateRandomStringProblem() };
    case Mode.GREEDY:
      return { 
        greedy: {
          activities: algorithms.generateRandomActivities(),
          knapsack: algorithms.generateRandomKnapsackProblem()
        }
      };
    case Mode.GRAPH:
      return { graph: algorithms.generateRandomGraph() };
    default:
      return {};
  }
};


const App: React.FC = () => {
  const [mode, setMode] = useState<Mode>(Mode.SORTING);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm>(DEFAULT_ALGORITHM[Mode.SORTING]);
  const [speed, setSpeed] = useState<number>(DEFAULT_SPEED);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [steps, setSteps] = useState<AnimationStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [data, setData] = useState<any>(() => generateInitialData(Mode.SORTING));

  const intervalRef = useRef<number | null>(null);

  // Centralized function to generate steps and reset the animation state
  const generateSteps = (algo: Algorithm, currentData: any) => {
    try {
      const generator = algorithms.getAlgorithmGenerator(algo, currentData);
      if (generator) {
        setSteps(Array.from(generator));
      } else {
        setSteps([{ message: `${algo} is not implemented yet.` } as AnimationStep]);
      }
    } catch (e) {
      console.error(e);
      setSteps([{ message: `Error generating steps. Check algorithm implementation.` } as AnimationStep]);
    }
    setCurrentStepIndex(0);
    setIsPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };
  
  // Initial setup
  useEffect(() => {
    generateSteps(selectedAlgorithm, data);
  }, []);

  // Animation interval effect
  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
  
    intervalRef.current = window.setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        // End of animation
        setIsPlaying(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
        return prev;
      });
    }, 300 - speed);
  
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed, steps]);


  const handleModeChange = (newMode: Mode) => {
    const newAlgorithm = DEFAULT_ALGORITHM[newMode];
    const newData = generateInitialData(newMode);
    
    setMode(newMode);
    setSelectedAlgorithm(newAlgorithm);
    setData(newData);
    generateSteps(newAlgorithm, newData);
  };
  
  const handleAlgorithmChange = (algo: Algorithm) => {
    setSelectedAlgorithm(algo);
    // Regenerate steps with the new algorithm but the same data
    generateSteps(algo, data);
  };

  const handlePlayPause = () => {
    if (steps.length === 0 || currentStepIndex >= steps.length - 1) return;
    setIsPlaying(prev => !prev);
  };

  const handleNewData = () => {
      const newData = generateInitialData(mode);
      setData(newData);
      generateSteps(selectedAlgorithm, newData);
  };
  
  const handleCustomArray = (arr: number[]) => {
      const newData = { ...data, array: arr };
      setData(newData);
      generateSteps(selectedAlgorithm, newData);
  }

  const handleCustomStrings = (strings: {text: string, pattern: string}) => {
      const newData = { ...data, strings: strings };
      setData(newData);
      generateSteps(selectedAlgorithm, newData);
  }

  const currentStep = steps[currentStepIndex] || null;

  const renderVisualizer = () => {
    if (!currentStep) {
        return <div className="p-4 text-center text-gray-400">Select an algorithm and press play.</div>;
    }
    switch (mode) {
      case Mode.SORTING:
      case Mode.SEARCHING:
        return <ArrayVisualizer step={currentStep} algorithm={selectedAlgorithm}/>;
      case Mode.STRING_SEARCHING:
        return <StringVisualizer step={currentStep} />;
      case Mode.GREEDY:
        return <GreedyVisualizer step={currentStep} algorithm={selectedAlgorithm as GreedyAlgorithm} />;
      case Mode.GRAPH:
        return <GraphVisualizer step={currentStep} />;
      default:
        return <div className="p-4 text-center">Select a mode to begin.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col font-sans">
      <Header />
      <Controls
        mode={mode}
        onModeChange={handleModeChange}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onReset={handleNewData}
        onSpeedChange={setSpeed}
        onAlgorithmChange={handleAlgorithmChange}
        onShowCode={() => setIsModalOpen(true)}
        speed={speed}
        selectedAlgorithm={selectedAlgorithm}
        onCustomArray={handleCustomArray}
        onCustomStrings={handleCustomStrings}
      />
      <main className="flex-grow p-4 flex flex-col">
        <p className="text-center mb-4 text-gray-400 h-6">
            {currentStep?.message || 'Ready.'}
        </p>
        <div className="container mx-auto flex-grow flex items-center justify-center">
            {renderVisualizer()}
        </div>
      </main>
      <CodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        codeSnippets={CODE_SNIPPETS[selectedAlgorithm]}
        algorithmName={selectedAlgorithm}
      />
    </div>
  );
};

export default App;