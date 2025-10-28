
import React from 'react';
import { GreedyActivityStep, GreedyKnapsackStep, GreedyAlgorithm, Activity, KnapsackItem } from '../types.ts';

interface GreedyVisualizerProps {
  step: GreedyActivityStep | GreedyKnapsackStep | any | null;
  algorithm: GreedyAlgorithm;
}

const ActivitySelectionVisualizer: React.FC<{ step: GreedyActivityStep }> = ({ step }) => {
    const { activities, highlights, selected } = step;
    return (
        <div className="w-full p-4 border border-gray-700 rounded bg-gray-900">
            <h3 className="text-xl font-bold mb-4 text-center">Activity Selection</h3>
            <div className="space-y-2">
                {activities.map((activity: Activity, index: number) => (
                    <div key={index} className={`p-2 rounded transition-colors duration-200 ${highlights[index] || 'bg-gray-700'}`}>
                        <span>{activity.name}: </span>
                        <span>Start: {activity.start}, Finish: {activity.finish}</span>
                        {selected.includes(index) && <span className="font-bold ml-4 text-green-400">(Selected)</span>}
                    </div>
                ))}
            </div>
        </div>
    );
};

const KnapsackVisualizer: React.FC<{ step: GreedyKnapsackStep }> = ({ step }) => {
    const { items, highlights, knapsack, capacity } = step;
    const fillPercentage = (knapsack.weight / capacity) * 100;
    return (
        <div className="w-full p-4 border border-gray-700 rounded bg-gray-900 flex gap-8">
            <div className="w-2/3">
                <h3 className="text-xl font-bold mb-4">Items</h3>
                 <div className="space-y-2">
                    {items.map((item: KnapsackItem, index: number) => (
                        <div key={index} className={`p-2 rounded transition-colors duration-200 ${highlights[index] || 'bg-gray-700'}`}>
                            <span>Item {index + 1}: </span>
                            <span>Weight: {item.weight}, Value: {item.value} (Ratio: {item.ratio.toFixed(2)})</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-1/3">
                 <h3 className="text-xl font-bold mb-4">Knapsack</h3>
                 <div className="w-full h-64 bg-gray-700 rounded border-2 border-gray-600 relative overflow-hidden">
                    <div className="bg-green-600 absolute bottom-0 w-full" style={{ height: `${fillPercentage}%` }}></div>
                 </div>
                 <div className="mt-4 text-center">
                     <p>Weight: {knapsack.weight.toFixed(2)} / {capacity}</p>
                     <p>Value: {knapsack.value.toFixed(2)}</p>
                 </div>
            </div>
        </div>
    );
};


const GreedyVisualizer: React.FC<GreedyVisualizerProps> = ({ step, algorithm }) => {
  if (!step) {
    return <div className="flex justify-center items-center w-full h-96 bg-gray-800 p-4 border border-gray-700 rounded text-gray-400">Generate a problem and press play.</div>;
  }

  switch (algorithm) {
    case GreedyAlgorithm.ACTIVITY_SELECTION:
      return <ActivitySelectionVisualizer step={step} />;
    case GreedyAlgorithm.FRACTIONAL_KNAPSACK:
        return <KnapsackVisualizer step={step} />;
    default:
      return <div className="text-gray-400">Visualizer not implemented for {algorithm}.</div>;
  }
};

export default GreedyVisualizer;
