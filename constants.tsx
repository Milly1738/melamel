import {
  Mode,
  Algorithm,
  SortingAlgorithm,
  SearchingAlgorithm,
  StringSearchAlgorithm,
  GreedyAlgorithm,
  GraphAlgorithm,
} from './types';

export const ALGORITHMS_BY_MODE: { [key in Mode]: Algorithm[] } = {
  [Mode.SORTING]: [
    SortingAlgorithm.BUBBLE,
    SortingAlgorithm.INSERTION,
    SortingAlgorithm.SELECTION,
    SortingAlgorithm.MERGE,
    SortingAlgorithm.QUICK,
  ],
  [Mode.SEARCHING]: [
    SearchingAlgorithm.LINEAR,
    SearchingAlgorithm.BINARY,
  ],
  [Mode.STRING_SEARCHING]: [
    StringSearchAlgorithm.NAIVE,
    StringSearchAlgorithm.KMP,
  ],
  [Mode.GREEDY]: [
    GreedyAlgorithm.ACTIVITY_SELECTION,
    GreedyAlgorithm.FRACTIONAL_KNAPSACK,
  ],
  [Mode.GRAPH]: [
    GraphAlgorithm.DIJKSTRA,
    GraphAlgorithm.PRIM,
  ],
};

export const DEFAULT_ALGORITHM: { [key in Mode]: Algorithm } = {
  [Mode.SORTING]: SortingAlgorithm.BUBBLE,
  [Mode.SEARCHING]: SearchingAlgorithm.LINEAR,
  [Mode.STRING_SEARCHING]: StringSearchAlgorithm.NAIVE,
  [Mode.GREEDY]: GreedyAlgorithm.ACTIVITY_SELECTION,
  [Mode.GRAPH]: GraphAlgorithm.DIJKSTRA,
};

export const COLORS = {
  default: 'bg-blue-500',
  compare: 'bg-yellow-500',
  swap: 'bg-red-500',
  sorted: 'bg-green-500',
  found: 'bg-green-500',
  pivot: 'bg-purple-500',
  probe: 'bg-indigo-500',
  eliminated: 'bg-gray-600',
  match: 'bg-green-500',
  mismatch: 'bg-red-500',
  textDefault: 'bg-gray-700',
  patternDefault: 'bg-blue-800',
  consider: 'bg-yellow-500',
  select: 'bg-green-500',
  reject: 'bg-red-500',
  nodeDefault: 'fill-blue-500',
  edgeDefault: 'stroke-gray-400',
  nodeHighlight: 'fill-yellow-400',
  edgeHighlight: 'stroke-yellow-400',
  path: 'stroke-green-500',
  visited: 'fill-indigo-500',
};

export const DEFAULT_SPEED = 150;
export const DEFAULT_ARRAY_SIZE = 20;
