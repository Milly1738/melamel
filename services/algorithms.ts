import {
  Algorithm,
  SortingAlgorithm,
  SearchingAlgorithm,
  StringSearchAlgorithm,
  GreedyAlgorithm,
  GraphAlgorithm,
  AnimationStep,
  ArrayStep,
  StringStep,
  GreedyActivityStep,
  GreedyKnapsackStep,
  GraphStep,
  Activity,
  KnapsackItem,
  Graph, Node, Edge
} from '../types.ts';
import { COLORS, DEFAULT_ARRAY_SIZE } from '../constants.tsx';

// --- DATA GENERATORS ---
export const generateRandomArray = (): number[] =>
  Array.from({ length: DEFAULT_ARRAY_SIZE }, () => Math.floor(Math.random() * 90) + 10);

export const generateRandomStringProblem = (): { text: string; pattern: string } => {
    const corpus = "ABACADABRACADABRA";
    const patternCorpus = ["ABRA", "CADA", "DAB", "ABRACADABRA"];
    const pattern = patternCorpus[Math.floor(Math.random() * patternCorpus.length)];
    return { text: corpus, pattern };
}

export const generateRandomActivities = (): Activity[] => {
    const activities: Activity[] = [];
    for (let i = 0; i < 8; i++) {
        const start = Math.floor(Math.random() * 20);
        const finish = start + Math.floor(Math.random() * 5) + 2;
        activities.push({ start, finish, name: `Activity ${i+1}`});
    }
    return activities.sort((a,b) => a.finish - b.finish);
};

export const generateRandomKnapsackProblem = (): { items: KnapsackItem[]; capacity: number } => {
    const items: KnapsackItem[] = [];
    for (let i = 0; i < 5; i++) {
        const weight = Math.floor(Math.random() * 15) + 5;
        const value = Math.floor(Math.random() * 40) + 10;
        items.push({ weight, value, ratio: value/weight });
    }
    return { items, capacity: 30 };
};

export const generateRandomGraph = (): Graph => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const numNodes = 7;
    for (let i = 0; i < numNodes; i++) {
        nodes.push({ id: i, x: Math.floor(Math.random() * 550) + 25, y: Math.floor(Math.random() * 350) + 25 });
    }
    for (let i = 0; i < numNodes; i++) {
        const target = (i + Math.floor(Math.random() * (numNodes - 2)) + 1) % numNodes;
        if (i !== target && !edges.some(e => (e.source === i && e.target === target) || (e.source === target && e.target === i))) {
            edges.push({ source: i, target, weight: Math.floor(Math.random() * 20) + 1 });
        }
    }
    // ensure connectivity
    for (let i=0; i < numNodes - 1; i++){
         if (!edges.some(e => (e.source === i && e.target === i+1) || (e.source === i+1 && e.target === i))) {
            edges.push({ source: i, target: i+1, weight: Math.floor(Math.random() * 20) + 1 });
        }
    }

    return { nodes, edges };
};

// --- ALGORITHM DISPATCHER ---
export function getAlgorithmGenerator(algorithm: Algorithm, data: any): Generator<AnimationStep> | null {
  switch (algorithm) {
    // Sorting
    case SortingAlgorithm.BUBBLE: return bubbleSort(data.array);
    case SortingAlgorithm.INSERTION: return insertionSort(data.array);
    case SortingAlgorithm.SELECTION: return selectionSort(data.array);
    case SortingAlgorithm.MERGE: return mergeSort(data.array);
    case SortingAlgorithm.QUICK: return quickSort(data.array);
    // Searching
    case SearchingAlgorithm.LINEAR: return linearSearch(data.array, data.array[Math.floor(Math.random() * data.array.length)]);
    case SearchingAlgorithm.BINARY: return binarySearch(data.array, data.array[Math.floor(Math.random() * data.array.length)]);
    // String Searching
    case StringSearchAlgorithm.NAIVE: return naiveStringSearch(data.strings.text, data.strings.pattern);
    case StringSearchAlgorithm.KMP: return kmpStringSearch(data.strings.text, data.strings.pattern);
    // Greedy
    case GreedyAlgorithm.ACTIVITY_SELECTION: return activitySelection(data.greedy.activities);
    case GreedyAlgorithm.FRACTIONAL_KNAPSACK: return fractionalKnapsack(data.greedy.knapsack.items, data.greedy.knapsack.capacity);
    // Graph
    case GraphAlgorithm.DIJKSTRA: return dijkstra(data.graph, 0);
    case GraphAlgorithm.PRIM: return prim(data.graph, 0);
    default: return null;
  }
}

// --- ALGORITHMS ---

// Sorting
function* bubbleSort(arr: number[]): Generator<ArrayStep> {
  const array = [...arr];
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      yield { array: [...array], highlights: { [j]: COLORS.compare, [j + 1]: COLORS.compare }, message: `Comparing ${array[j]} and ${array[j + 1]}` };
      if (array[j] > array[j + 1]) {
        yield { array: [...array], highlights: { [j]: COLORS.swap, [j + 1]: COLORS.swap }, message: `Swapping ${array[j]} and ${array[j + 1]}` };
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
      }
    }
  }
  yield { array: [...array], highlights: {}, message: 'Array is sorted!' };
}

function* insertionSort(arr: number[]): Generator<ArrayStep> {
  const array = [...arr];
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    yield { array: [...array], highlights: { [i]: COLORS.pivot }, message: `Selecting ${key} as pivot.` };
    while (j >= 0 && array[j] > key) {
      yield { array: [...array], highlights: { [j]: COLORS.compare, [j+1]: COLORS.compare }, message: `Comparing ${array[j]} and ${key}` };
      array[j + 1] = array[j];
      yield { array: [...array], highlights: { [j]: COLORS.swap, [j+1]: COLORS.swap }, message: `Shifting ${array[j+1]} right.` };
      j--;
    }
    array[j + 1] = key;
    yield { array: [...array], highlights: { [j+1]: COLORS.sorted }, message: `Inserted ${key}.` };
  }
  yield { array: [...array], highlights: {}, message: 'Array is sorted!' };
}

function* selectionSort(arr: number[]): Generator<ArrayStep> {
    const array = [...arr];
    for (let i = 0; i < array.length; i++) {
        let minIndex = i;
        for (let j = i + 1; j < array.length; j++) {
            yield { array: [...array], highlights: { [i]: COLORS.pivot, [j]: COLORS.compare, [minIndex]: COLORS.compare }, message: `Finding minimum, current min is ${array[minIndex]}.` };
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
        }
        yield { array: [...array], highlights: { [i]: COLORS.swap, [minIndex]: COLORS.swap }, message: `Swapping ${array[i]} and ${array[minIndex]}.` };
        [array[i], array[minIndex]] = [array[minIndex], array[i]];
    }
    yield { array: [...array], highlights: {}, message: 'Array is sorted!' };
}

function* mergeSort(arr: number[]): Generator<ArrayStep> {
    const array = [...arr];
    // This is complex to visualize iteratively with generators.
    yield { array, highlights: {}, message: 'Merge Sort is not implemented yet.' };
}

function* quickSort(arr: number[]): Generator<ArrayStep> {
    const array = [...arr];
     // This is complex to visualize iteratively with generators.
    yield { array, highlights: {}, message: 'Quick Sort is not implemented yet.' };
}


// Searching
function* linearSearch(arr: number[], target: number): Generator<ArrayStep> {
  const array = [...arr];
  yield { array, highlights: {}, message: `Searching for ${target}.` };
  for (let i = 0; i < array.length; i++) {
    yield { array, highlights: { [i]: COLORS.probe }, message: `Checking index ${i} (${array[i]})` };
    if (array[i] === target) {
      yield { array, highlights: { [i]: COLORS.found }, message: `Found ${target} at index ${i}.` };
      return;
    }
  }
  yield { array, highlights: {}, message: `${target} not found in the array.` };
}

function* binarySearch(arr: number[], target: number): Generator<ArrayStep> {
  const array = [...arr].sort((a,b) => a - b);
  yield { array, highlights: {}, message: `Array must be sorted. Searching for ${target}.` };
  
  let low = 0;
  let high = array.length - 1;

  while(low <= high) {
    const mid = Math.floor((low + high) / 2);
    const highlights = {};
    for(let i=0; i < array.length; i++) {
        if(i < low || i > high) highlights[i] = COLORS.eliminated;
    }
    yield { array, highlights: {...highlights, [mid]: COLORS.probe}, message: `Probing middle element at index ${mid} (${array[mid]})` };
    
    if (array[mid] === target) {
      yield { array, highlights: { [mid]: COLORS.found }, message: `Found ${target} at index ${mid}.` };
      return;
    } else if (array[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  yield { array, highlights: {}, message: `${target} not found in the array.` };
}

// String Searching
function* naiveStringSearch(text: string, pattern: string): Generator<StringStep> {
    for (let i = 0; i <= text.length - pattern.length; i++) {
        let match = true;
        const highlights = {};
        const patternHighlights = {};

        for (let j = 0; j < pattern.length; j++) {
            highlights[i + j] = COLORS.compare;
            patternHighlights[j] = COLORS.compare;
            yield { text, pattern, highlights: {...highlights}, patternHighlights: {...patternHighlights}, patternStart: i, message: `Comparing pattern at index ${i}.` };

            if (text[i + j] !== pattern[j]) {
                highlights[i + j] = COLORS.mismatch;
                patternHighlights[j] = COLORS.mismatch;
                match = false;
                break;
            } else {
                 highlights[i + j] = COLORS.match;
                 patternHighlights[j] = COLORS.match;
            }
        }
        if (match) {
            const finalHighlights = {};
            for(let k=0; k < pattern.length; k++) finalHighlights[i+k] = COLORS.found;
            yield { text, pattern, highlights: finalHighlights, patternHighlights: {}, patternStart: i, message: `Pattern found at index ${i}.` };
            return;
        }
    }
     yield { text, pattern, highlights: {}, patternHighlights: {}, message: 'Pattern not found.' };
}

function* kmpStringSearch(text: string, pattern: string): Generator<StringStep> {
    yield { text, pattern, highlights: {}, patternHighlights: {}, message: 'KMP is not implemented yet.' };
}

// Greedy
function* activitySelection(activities: Activity[]): Generator<GreedyActivityStep> {
    yield { activities, highlights: {}, selected: [], message: 'Starting with activities sorted by finish time.' };
    
    const selected = [0];
    let lastFinishTime = activities[0].finish;

    yield { activities, highlights: {0: COLORS.select}, selected: [0], message: `Select first activity: ${activities[0].name}.` };

    for (let i = 1; i < activities.length; i++) {
        yield { activities, highlights: { [i]: COLORS.consider }, selected, message: `Considering activity: ${activities[i].name}.` };
        if (activities[i].start >= lastFinishTime) {
            selected.push(i);
            lastFinishTime = activities[i].finish;
            yield { activities, highlights: { [i]: COLORS.select }, selected, message: `Selected ${activities[i].name}.` };
        } else {
             yield { activities, highlights: { [i]: COLORS.reject }, selected, message: `${activities[i].name} conflicts. Rejected.` };
        }
    }
    yield { activities, highlights: {}, selected, message: 'Finished selecting activities.' };
}

function* fractionalKnapsack(items: KnapsackItem[], capacity: number): Generator<GreedyKnapsackStep> {
    const sortedItems = [...items].sort((a,b) => b.ratio - a.ratio);
    yield { items: sortedItems, highlights: {}, knapsack: { weight: 0, value: 0 }, capacity, message: 'Items sorted by value/weight ratio.' };

    let currentWeight = 0;
    let finalValue = 0;

    for (let i = 0; i < sortedItems.length; i++) {
        const item = sortedItems[i];
        yield { items: sortedItems, highlights: { [i]: COLORS.consider }, knapsack: { weight: currentWeight, value: finalValue }, capacity, message: `Considering Item ${i+1}.` };
        if (currentWeight + item.weight <= capacity) {
            currentWeight += item.weight;
            finalValue += item.value;
             yield { items: sortedItems, highlights: { [i]: COLORS.select }, knapsack: { weight: currentWeight, value: finalValue }, capacity, message: `Took entire Item ${i+1}.` };
        } else {
            const remaining = capacity - currentWeight;
            finalValue += item.value * (remaining / item.weight);
            currentWeight = capacity;
             yield { items: sortedItems, highlights: { [i]: COLORS.select }, knapsack: { weight: currentWeight, value: finalValue }, capacity, message: `Took a fraction of Item ${i+1}.` };
            break;
        }
    }
    yield { items: sortedItems, highlights: {}, knapsack: { weight: currentWeight, value: finalValue }, capacity, message: 'Knapsack is full.' };
}

// Graph
function* dijkstra(graph: Graph, startNodeId: number): Generator<GraphStep> {
    const distances: { [id: number]: number } = {};
    const prev: { [id: number]: number | null } = {};
    const pq: { id: number; dist: number }[] = [];

    graph.nodes.forEach(node => {
        distances[node.id] = Infinity;
        prev[node.id] = null;
    });
    distances[startNodeId] = 0;
    pq.push({ id: startNodeId, dist: 0 });

    const distStrings = Object.fromEntries(Object.entries(distances).map(([k, v]) => [k, v === Infinity ? '∞' : v]));
    yield { graph, nodeHighlights: { [startNodeId]: COLORS.nodeHighlight }, edgeHighlights: {}, distances: distStrings, message: `Starting Dijkstra from node ${startNodeId}.` };

    while (pq.length > 0) {
        pq.sort((a, b) => a.dist - b.dist);
        const { id: u } = pq.shift()!;

        yield { graph, nodeHighlights: { [u]: COLORS.visited }, edgeHighlights: {}, distances: distStrings, message: `Visiting node ${u}.` };

        const neighbors = graph.edges.filter(e => e.source === u || e.target === u);
        for (const edge of neighbors) {
            const v = edge.source === u ? edge.target : edge.source;
            const edgeKey = `${Math.min(u,v)}-${Math.max(u,v)}`;

            yield { graph, nodeHighlights: { [u]: COLORS.visited, [v]: COLORS.nodeHighlight }, edgeHighlights: {[edgeKey]: COLORS.edgeHighlight}, distances: distStrings, message: `Checking neighbor ${v}.` };
            
            const alt = distances[u] + edge.weight;
            if (alt < distances[v]) {
                distances[v] = alt;
                prev[v] = u;
                pq.push({ id: v, dist: alt });
                distStrings[v] = alt;
                 yield { graph, nodeHighlights: { [u]: COLORS.visited, [v]: COLORS.nodeHighlight }, edgeHighlights: {[edgeKey]: COLORS.edgeHighlight}, distances: {...distStrings}, message: `Updated distance to ${v} to ${alt}.` };
            }
        }
    }

    // Highlight final path from start to a random node
    const finalPathNode = graph.nodes[Math.floor(Math.random() * graph.nodes.length)].id;
    let current = finalPathNode;
    const pathEdges = {};
    while(prev[current] !== null) {
        const p = prev[current]!;
        pathEdges[`${Math.min(p,current)}-${Math.max(p,current)}`] = COLORS.path;
        current = p;
    }
    
    yield { graph, nodeHighlights: {}, edgeHighlights: pathEdges, distances: distStrings, message: `Finished. Shortest paths from node ${startNodeId} calculated.` };
}

function* prim(graph: Graph, startNodeId: number): Generator<GraphStep> {
    const mstEdges: { [key: string]: string } = {};
    const visited: Set<number> = new Set([startNodeId]);
    const edgesQueue: Edge[] = [];

    graph.edges.filter(e => e.source === startNodeId || e.target === startNodeId).forEach(e => edgesQueue.push(e));
    
    yield { graph, nodeHighlights: {[startNodeId]: COLORS.visited}, edgeHighlights: {}, message: `Starting Prim's from node ${startNodeId}.` };

    while (visited.size < graph.nodes.length && edgesQueue.length > 0) {
        edgesQueue.sort((a, b) => a.weight - b.weight);
        const edge = edgesQueue.shift()!;
        const edgeKey = `${Math.min(edge.source, edge.target)}-${Math.max(edge.source, edge.target)}`;

        yield { graph, nodeHighlights: {}, edgeHighlights: { ...mstEdges, [edgeKey]: COLORS.edgeHighlight }, message: `Considering edge (${edge.source}, ${edge.target}) with weight ${edge.weight}.` };

        const new_node = visited.has(edge.source) ? edge.target : edge.source;
        if (!visited.has(new_node)) {
            visited.add(new_node);
            mstEdges[edgeKey] = COLORS.path;
            yield { graph, nodeHighlights: { [new_node]: COLORS.visited }, edgeHighlights: { ...mstEdges }, message: `Adding edge (${edge.source}, ${edge.target}) to MST.` };

            graph.edges.filter(e => (e.source === new_node || e.target === new_node) && !visited.has(e.source === new_node ? e.target : e.source))
                .forEach(e => edgesQueue.push(e));
        }
    }
     yield { graph, nodeHighlights: {}, edgeHighlights: mstEdges, message: `Minimum Spanning Tree found.` };
}