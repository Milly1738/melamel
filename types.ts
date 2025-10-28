
export enum Mode {
  SORTING = 'Sorting',
  SEARCHING = 'Searching',
  STRING_SEARCHING = 'String Searching',
  GREEDY = 'Greedy',
  GRAPH = 'Graph',
}

export enum SortingAlgorithm {
  BUBBLE = 'Bubble Sort',
  INSERTION = 'Insertion Sort',
  SELECTION = 'Selection Sort',
  MERGE = 'Merge Sort',
  QUICK = 'Quick Sort',
}

export enum SearchingAlgorithm {
  LINEAR = 'Linear Search',
  BINARY = 'Binary Search',
}

export enum StringSearchAlgorithm {
  NAIVE = 'Naive Search',
  KMP = 'Knuth-Morris-Pratt',
}

export enum GreedyAlgorithm {
  ACTIVITY_SELECTION = 'Activity Selection',
  FRACTIONAL_KNAPSACK = 'Fractional Knapsack',
}

export enum GraphAlgorithm {
  DIJKSTRA = "Dijkstra's Algorithm",
  PRIM = "Prim's Algorithm",
}

export type Algorithm =
  | SortingAlgorithm
  | SearchingAlgorithm
  | StringSearchAlgorithm
  | GreedyAlgorithm
  | GraphAlgorithm;

// Animation Step Types
export interface BaseStep {
  message: string;
}

export interface ArrayStep extends BaseStep {
  array: number[];
  highlights: { [index: number]: string }; // color
}

export interface StringStep extends BaseStep {
  text: string;
  pattern: string;
  highlights: { [index: number]: string }; // color for text
  patternHighlights: { [index: number]: string }; // color for pattern
  // FIX: Add optional `patternStart` property used for visualizer positioning.
  patternStart?: number;
}

export interface Activity {
  start: number;
  finish: number;
  name: string;
}
export interface GreedyActivityStep extends BaseStep {
  activities: Activity[];
  highlights: { [index: number]: string };
  selected: number[];
}

export interface KnapsackItem {
  weight: number;
  value: number;
  ratio: number;
}
export interface GreedyKnapsackStep extends BaseStep {
  items: KnapsackItem[];
  highlights: { [index: number]: string };
  knapsack: { weight: number; value: number; };
  capacity: number;
}

export interface Node {
  id: number;
  x: number;
  y: number;
}
export interface Edge {
  source: number;
  target: number;
  weight: number;
}
export interface Graph {
  nodes: Node[];
  edges: Edge[];
  isDirected?: boolean;
}
export interface GraphStep extends BaseStep {
  graph: Graph;
  nodeHighlights: { [id: number]: string };
  edgeHighlights: { [edgeKey: string]: string };
  distances?: { [id: number]: number | string };
}

export type AnimationStep =
  | ArrayStep
  | StringStep
  | GreedyActivityStep
  | GreedyKnapsackStep
  | GraphStep;