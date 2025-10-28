import { Algorithm } from '../types.ts';

type CodeSnippets = {
  [key in Algorithm]?: {
    python: string;
    typescript: string;
  };
};

export const CODE_SNIPPETS: CodeSnippets = {
  'Bubble Sort': {
    python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`,
    typescript: `function bubbleSort(arr: number[]): number[] {
    const n = arr.length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}`,
  },
  'Insertion Sort': {
    python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and key < arr[j]:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`,
    typescript: `function insertionSort(arr: number[]): number[] {
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
    return arr;
}`,
  },
  'Selection Sort': {
    python: `def selection_sort(arr):
    for i in range(len(arr)):
        min_idx = i
        for j in range(i + 1, len(arr)):
            if arr[min_idx] > arr[j]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,
    typescript: `function selectionSort(arr: number[]): number[] {
    for (let i = 0; i < arr.length; i++) {
        let minIndex = i;
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
    return arr;
}`,
  },
  'Linear Search': {
    python: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1`,
    typescript: `function linearSearch(arr: number[], target: number): number {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) {
            return i;
        }
    }
    return -1;
}`,
  },
  'Binary Search': {
    python: `def binary_search(arr, target):
    # Array must be sorted
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
    typescript: `function binarySearch(arr: number[], target: number): number {
    // Array must be sorted
    let low = 0;
    let high = arr.length - 1;
    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return -1;
}`,
  },
    'Naive Search': {
    python: `def naive_search(text, pattern):
    n, m = len(text), len(pattern)
    for i in range(n - m + 1):
        if text[i:i+m] == pattern:
            return i
    return -1`,
    typescript: `function naiveStringSearch(text: string, pattern: string): number {
    const n = text.length;
    const m = pattern.length;
    for (let i = 0; i <= n - m; i++) {
        let j = 0;
        while (j < m && text[i + j] === pattern[j]) {
            j++;
        }
        if (j === m) {
            return i;
        }
    }
    return -1;
}`,
    },
    'Activity Selection': {
    python: `def activity_selection(activities):
    # Assumes activities are sorted by finish time
    selected = [activities[0]]
    last_finish_time = activities[0]['finish']
    
    for i in range(1, len(activities)):
        if activities[i]['start'] >= last_finish_time:
            selected.append(activities[i])
            last_finish_time = activities[i]['finish']
            
    return selected`,
    typescript: `interface Activity {
    name: string;
    start: number;
    finish: number;
}
function activitySelection(activities: Activity[]): Activity[] {
    // Assumes activities are sorted by finish time
    if (activities.length === 0) return [];
    const selected = [activities[0]];
    let lastFinishTime = activities[0].finish;

    for (let i = 1; i < activities.length; i++) {
        if (activities[i].start >= lastFinishTime) {
            selected.push(activities[i]);
            lastFinishTime = activities[i].finish;
        }
    }
    return selected;
}`,
    },
    'Fractional Knapsack': {
    python: `def fractional_knapsack(items, capacity):
    # Sort items by value/weight ratio
    items.sort(key=lambda x: x['value'] / x['weight'], reverse=True)
    
    total_value = 0
    for item in items:
        if capacity == 0:
            return total_value
        
        weight = min(item['weight'], capacity)
        total_value += weight * (item['value'] / item['weight'])
        capacity -= weight
        
    return total_value`,
    typescript: `interface Item {
    weight: number;
    value: number;
}
function fractionalKnapsack(items: Item[], capacity: number): number {
    items.sort((a, b) => (b.value / b.weight) - (a.value / a.weight));
    
    let totalValue = 0;
    for (const item of items) {
        if (capacity === 0) return totalValue;
        
        const weight = Math.min(item.weight, capacity);
        totalValue += weight * (item.value / item.weight);
        capacity -= weight;
    }
    return totalValue;
}`,
    },
    "Dijkstra's Algorithm": {
    python: `import heapq

def dijkstra(graph, start):
    distances = {node: float('infinity') for node in graph}
    distances[start] = 0
    pq = [(0, start)]

    while pq:
        current_distance, current_node = heapq.heappop(pq)

        if current_distance > distances[current_node]:
            continue

        for neighbor, weight in graph[current_node].items():
            distance = current_distance + weight
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(pq, (distance, neighbor))
    
    return distances`,
    typescript: `// Simplified implementation using an array as a priority queue
function dijkstra(graph, startNode) {
    const distances = {};
    const visited = new Set();
    const pq = [];

    Object.keys(graph).forEach(node => distances[node] = Infinity);
    distances[startNode] = 0;
    pq.push({ id: startNode, dist: 0 });

    while (pq.length > 0) {
        pq.sort((a, b) => a.dist - b.dist);
        const { id: u } = pq.shift();

        if (visited.has(u)) continue;
        visited.add(u);
        
        for (let neighbor in graph[u]) {
            const weight = graph[u][neighbor];
            const newDist = distances[u] + weight;
            if (newDist < distances[neighbor]) {
                distances[neighbor] = newDist;
                pq.push({ id: neighbor, dist: newDist });
            }
        }
    }
    return distances;
}`,
    },
    "Prim's Algorithm": {
    python: `import heapq

def prim(graph, start_node):
    mst = []
    visited = {start_node}
    edges = [
        (weight, start_node, to_node)
        for to_node, weight in graph[start_node].items()
    ]
    heapq.heapify(edges)

    while edges:
        weight, from_node, to_node = heapq.heappop(edges)
        if to_node not in visited:
            visited.add(to_node)
            mst.append((from_node, to_node, weight))

            for next_node, next_weight in graph[to_node].items():
                if next_node not in visited:
                    heapq.heappush(edges, (next_weight, to_node, next_node))
    return mst`,
    typescript: `// Simplified implementation using an array as a priority queue
function prim(graph, startNode) {
    const mst = [];
    const visited = new Set();
    const pq = [];
    
    const addEdges = (node) => {
        visited.add(node);
        for (const neighbor in graph[node]) {
            pq.push({ from: node, to: neighbor, weight: graph[node][neighbor] });
        }
    };

    addEdges(startNode);

    while (pq.length > 0 && visited.size < Object.keys(graph).length) {
        pq.sort((a, b) => a.weight - b.weight);
        const edge = pq.shift();

        if (!visited.has(edge.to)) {
            mst.push(edge);
            addEdges(edge.to);
        }
    }
    return mst;
}`,
    },
};