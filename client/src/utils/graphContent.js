// Graph Explorer Checkpoint Data (3 Checkpoints)
export const getGraphCheckpointContent = (checkpointId, lang = 'cpp') => {
  const language = (lang || 'cpp').toLowerCase() === 'js' ? 'javascript' : (lang || 'cpp').toLowerCase();

  const checkpoints = {
    graph_cp1: {
      title: 'Find Node Degree',
      subtitle: 'Calculate the degree of a given node from the graph adjacency list.',
      videoEmbedUrl: 'https://www.youtube.com/embed/M3_pLsDdeuU?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Calculate Degree',
          desc: 'Given an undirected graph represented as an adjacency list adj (vector of vectors), return the degree of node u. Adjacency list is 0-indexed.',
          functionName: 'getNodeDegree',
          constraints: '0 <= u < adj.size(), 1 <= adj.size() <= 10^4',
          testCases: [
            { input: '[[1, 2], [0, 2], [0, 1]], 0', expected: '2' },
            { input: '[[], [2], [1]], 0', expected: '0' }
          ],
          hints: ['Adjacency list index u stores the list of neighbors for node u.', 'The degree is simply the size of this neighbor list: adj[u].size().'],
          bp: '#include <vector>\nusing namespace std;\n\nint getNodeDegree(vector<vector<int>>& adj, int u) {\n    // Write your code here\n    \n}',
          sol: 'int getNodeDegree(vector<vector<int>>& adj, int u) {\n    return adj[u].size();\n}'
        },
        java: {
          title: 'Calculate Degree',
          desc: 'Given an undirected graph represented as an adjacency list, return the degree of node u.',
          functionName: 'getNodeDegree',
          constraints: '0 <= u < adj.size(), 1 <= adj.size() <= 10^4',
          testCases: [
            { input: 'java.util.Arrays.asList(java.util.Arrays.asList(1, 2), java.util.Arrays.asList(0, 2), java.util.Arrays.asList(0, 1)), 0', expected: '2' },
            { input: 'java.util.Arrays.asList(java.util.Collections.emptyList(), java.util.Arrays.asList(2), java.util.Arrays.asList(1)), 0', expected: '0' }
          ],
          hints: ['Find the size of the neighbors list at index u.'],
          bp: 'import java.util.List;\n\npublic class Solution {\n    public static int getNodeDegree(List<List<Integer>> adj, int u) {\n        // Write your code here\n        return 0;\n    }\n}',
          sol: 'public static int getNodeDegree(List<List<Integer>> adj, int u) {\n    return adj.get(u).size();\n}'
        },
        python: {
          title: 'Calculate Degree',
          desc: 'Given an undirected graph represented as an adjacency list, return the degree of node u.',
          functionName: 'get_node_degree',
          constraints: '0 <= u < len(adj)',
          testCases: [
            { input: '[[1, 2], [0, 2], [0, 1]], 0', expected: '2' },
            { input: '[[], [2], [1]], 0', expected: '0' }
          ],
          hints: ['Return len(adj[u]).'],
          bp: 'def get_node_degree(adj: list, u: int) -> int:\n    # Write your code here\n    pass',
          sol: 'def get_node_degree(adj, u):\n    return len(adj[u])'
        },
        javascript: {
          title: 'Calculate Degree',
          desc: 'Given an undirected graph represented as an adjacency list, return the degree of node u.',
          functionName: 'getNodeDegree',
          constraints: '0 <= u < adj.length',
          testCases: [
            { input: '[[1, 2], [0, 2], [0, 1]], 0', expected: '2' },
            { input: '[[], [2], [1]], 0', expected: '0' }
          ],
          hints: ['Return the length of the array at adj[u].'],
          bp: 'function getNodeDegree(adj, u) {\n    // Write your code here\n    \n}',
          sol: 'function getNodeDegree(adj, u) {\n    return adj[u].length;\n}'
        }
      }
    },
    graph_cp2: {
      title: 'Find Path',
      subtitle: 'Use Breadth-First Search (BFS) to check if a path exists between two nodes.',
      videoEmbedUrl: 'https://www.youtube.com/embed/V63W7p_p4uE?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Has Path',
          desc: 'Given an adjacency list adj representing an undirected graph, return true if a path exists from source to target, else false.',
          functionName: 'hasPath',
          constraints: '1 <= adj.size() <= 1000',
          testCases: [
            { input: '[[1, 2], [0, 3], [0, 3], [1, 2]], 0, 3', expected: 'true' },
            { input: '[[1], [0], [3], [2]], 0, 3', expected: 'false' }
          ],
          hints: ['Standard BFS traversal.', 'Use a queue to store visited nodes, tracking them in a visited array.'],
          bp: '#include <vector>\n#include <queue>\nusing namespace std;\n\nbool hasPath(vector<vector<int>>& adj, int src, int dest) {\n    // Write your code here\n    \n}',
          sol: '#include <queue>\nbool hasPath(vector<vector<int>>& adj, int src, int dest) {\n    if(src == dest) return true;\n    int n = adj.size();\n    vector<bool> vis(n, false);\n    queue<int> q;\n    q.push(src);\n    vis[src] = true;\n    while(!q.empty()) {\n        int u = q.front(); q.pop();\n        for(int v : adj[u]) {\n            if(v == dest) return true;\n            if(!vis[v]) {\n                vis[v] = true;\n                q.push(v);\n            }\n        }\n    }\n    return false;\n}'
        },
        java: {
          title: 'Has Path',
          desc: 'Given an adjacency list, return true if a path exists from source to target, else false.',
          functionName: 'hasPath',
          constraints: '1 <= adj.size() <= 1000',
          testCases: [
            { input: 'java.util.Arrays.asList(java.util.Arrays.asList(1, 2), java.util.Arrays.asList(0, 3), java.util.Arrays.asList(0, 3), java.util.Arrays.asList(1, 2)), 0, 3', expected: 'true' },
            { input: 'java.util.Arrays.asList(java.util.Arrays.asList(1), java.util.Arrays.asList(0), java.util.Arrays.asList(3), java.util.Arrays.asList(2)), 0, 3', expected: 'false' }
          ],
          hints: ['Implement standard dynamic queue BFS.'],
          bp: 'import java.util.List;\nimport java.util.Queue;\nimport java.util.LinkedList;\n\npublic class Solution {\n    public static boolean hasPath(List<List<Integer>> adj, int src, int dest) {\n        // Write your code here\n        return false;\n    }\n}',
          sol: 'public static boolean hasPath(List<List<Integer>> adj, int src, int dest) {\n    if(src == dest) return true;\n    int n = adj.size();\n    boolean[] vis = new boolean[n];\n    java.util.Queue<Integer> q = new java.util.LinkedList<>();\n    q.add(src); vis[src] = true;\n    while(!q.isEmpty()) {\n        int u = q.poll();\n        for(int v : adj.get(u)) {\n            if(v == dest) return true;\n            if(!vis[v]) {\n                vis[v] = true; q.add(v);\n            }\n        }\n    }\n    return false;\n}'
        },
        python: {
          title: 'Has Path',
          desc: 'Given an adjacency list, return true if a path exists from source to target, else false.',
          functionName: 'has_path',
          constraints: '1 <= len(adj) <= 1000',
          testCases: [
            { input: '[[1, 2], [0, 3], [0, 3], [1, 2]], 0, 3', expected: 'True' },
            { input: '[[1], [0], [3], [2]], 0, 3', expected: 'False' }
          ],
          hints: ['Use list queue and visited set.'],
          bp: 'def has_path(adj: list, src: int, dest: int) -> bool:\n    # Write your code here\n    pass',
          sol: 'def has_path(adj, src, dest):\n    if src == dest: return True\n    q = [src]\n    vis = {src}\n    while q:\n        u = q.pop(0)\n        for v in adj[u]:\n            if v == dest: return True\n            if v not in vis:\n                vis.add(v)\n                q.append(v)\n    return False'
        },
        javascript: {
          title: 'Has Path',
          desc: 'Given an adjacency list, return true if a path exists from source to target, else false.',
          functionName: 'hasPath',
          constraints: '1 <= adj.length <= 1000',
          testCases: [
            { input: '[[1, 2], [0, 3], [0, 3], [1, 2]], 0, 3', expected: 'true' },
            { input: '[[1], [0], [3], [2]], 0, 3', expected: 'false' }
          ],
          hints: ['Implement graph queue validation.'],
          bp: 'function hasPath(adj, src, dest) {\n    // Write your code here\n    \n}',
          sol: 'function hasPath(adj, src, dest) {\n    if(src === dest) return true;\n    let n = adj.length;\n    let vis = new Array(n).fill(false);\n    let q = [src]; vis[src] = true;\n    while(q.length > 0) {\n        let u = q.shift();\n        for(let v of adj[u]) {\n            if(v === dest) return true;\n            if(!vis[v]) {\n                vis[v] = true; q.push(v);\n            }\n        }\n    }\n    return false;\n}'
        }
      }
    },
    graph_cp3: {
      title: 'Count Connected Components',
      subtitle: 'Identify and count disjoint subgraphs in an undirected graph.',
      videoEmbedUrl: 'https://www.youtube.com/embed/XpkfK_Mh6vA?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Connected Components',
          desc: 'Given total nodes n and list of edges (vector of vectors), return the count of connected components.',
          functionName: 'countComponents',
          constraints: '1 <= n <= 1000',
          testCases: [
            { input: '5, [[0, 1], [1, 2], [3, 4]]', expected: '2' },
            { input: '5, [[0, 1], [1, 2], [2, 3], [3, 4]]', expected: '1' }
          ],
          hints: ['Build adjacency list from edges.', 'Perform DFS from each unvisited node. Incremented component count on each fresh traversal.'],
          bp: '#include <vector>\nusing namespace std;\n\nint countComponents(int n, vector<vector<int>>& edges) {\n    // Write your code here\n    \n}',
          sol: 'void dfs(int u, vector<vector<int>>& adj, vector<bool>& vis) {\n    vis[u] = true;\n    for(int v : adj[u]) {\n        if(!vis[v]) dfs(v, adj, vis);\n    }\n}\nint countComponents(int n, vector<vector<int>>& edges) {\n    vector<vector<int>> adj(n);\n    for(auto& e : edges) {\n        adj[e[0]].push_back(e[1]);\n        adj[e[1]].push_back(e[0]);\n    }\n    vector<bool> vis(n, false);\n    int count = 0;\n    for(int i = 0; i < n; i++) {\n        if(!vis[i]) {\n            count++;\n            dfs(i, adj, vis);\n        }\n    }\n    return count;\n}'
        },
        java: {
          title: 'Connected Components',
          desc: 'Given total nodes n and list of edges, return the count of connected components.',
          functionName: 'countComponents',
          constraints: '1 <= n <= 1000',
          testCases: [
            { input: '5, java.util.Arrays.asList(java.util.Arrays.asList(0, 1), java.util.Arrays.asList(1, 2), java.util.Arrays.asList(3, 4))', expected: '2' },
            { input: '5, java.util.Arrays.asList(java.util.Arrays.asList(0, 1), java.util.Arrays.asList(1, 2), java.util.Arrays.asList(2, 3), java.util.Arrays.asList(3, 4))', expected: '1' }
          ],
          hints: ['Use recursive DFS helper with visited tracker array.'],
          bp: 'import java.util.List;\nimport java.util.ArrayList;\n\npublic class Solution {\n    public static int countComponents(int n, List<List<Integer>> edges) {\n        // Write your code here\n        return 0;\n    }\n}',
          sol: 'static void dfs(int u, java.util.List<java.util.List<Integer>> adj, boolean[] vis) {\n    vis[u] = true;\n    for(int v : adj.get(u)) {\n        if(!vis[v]) dfs(v, adj, vis);\n    }\n}\npublic static int countComponents(int n, List<List<Integer>> edges) {\n    java.util.List<java.util.List<Integer>> adj = new java.util.ArrayList<>();\n    for(int i = 0; i < n; i++) adj.add(new java.util.ArrayList<>());\n    for(java.util.List<Integer> e : edges) {\n        adj.get(e.get(0)).add(e.get(1));\n        adj.get(e.get(1)).add(e.get(0));\n    }\n    boolean[] vis = new boolean[n];\n    int count = 0;\n    for(int i = 0; i < n; i++) {\n        if(!vis[i]) {\n            count++;\n            dfs(i, adj, vis);\n        }\n    }\n    return count;\n}'
        },
        python: {
          title: 'Connected Components',
          desc: 'Given total nodes n and list of edges, return the count of connected components.',
          functionName: 'count_components',
          constraints: '1 <= n <= 1000',
          testCases: [
            { input: '5, [[0, 1], [1, 2], [3, 4]]', expected: '2' },
            { input: '5, [[0, 1], [1, 2], [2, 3], [3, 4]]', expected: '1' }
          ],
          hints: ['Iterate through components via adjacency list and recursion.'],
          bp: 'def count_components(n: int, edges: list) -> int:\n    # Write your code here\n    pass',
          sol: 'def count_components(n, edges):\n    adj = [[] for _ in range(n)]\n    for u, v in edges:\n        adj[u].append(v)\n        adj[v].append(u)\n    vis = [False] * n\n    def dfs(u):\n        vis[u] = True\n        for v in adj[u]:\n            if not vis[v]: dfs(v)\n    count = 0\n    for i in range(n):\n        if not vis[i]:\n            count += 1\n            dfs(i)\n    return count'
        },
        javascript: {
          title: 'Connected Components',
          desc: 'Given total nodes n and list of edges, return the count of connected components.',
          functionName: 'countComponents',
          constraints: '1 <= n <= 1000',
          testCases: [
            { input: '5, [[0, 1], [1, 2], [3, 4]]', expected: '2' },
            { input: '5, [[0, 1], [1, 2], [2, 3], [3, 4]]', expected: '1' }
          ],
          hints: ['Map edges to adjacency mapping.'],
          bp: 'function countComponents(n, edges) {\n    // Write your code here\n    \n}',
          sol: 'function countComponents(n, edges) {\n    let adj = Array.from({length: n}, () => []);\n    for(let [u, v] of edges) {\n        adj[u].push(v); adj[v].push(u);\n    }\n    let vis = new Array(n).fill(false);\n    function dfs(u) {\n        vis[u] = true;\n        for(let v of adj[u]) { if(!vis[v]) dfs(v); }\n    }\n    let count = 0;\n    for(let i = 0; i < n; i++) {\n        if(!vis[i]) { count++; dfs(i); }\n    }\n    return count;\n}'
        }
      }
    }
  };

  const cp = checkpoints[checkpointId];
  if (!cp) return null;

  const langChallenge = cp.challenges[language] || cp.challenges.cpp;
  const isLastCheckpoint = checkpointId === 'graph_cp3';

  return {
    title: cp.title,
    subtitle: cp.subtitle,
    videoEmbedUrl: cp.videoEmbedUrl,
    challengeTitle: langChallenge.title,
    challengeDescription: langChallenge.desc,
    approach: langChallenge.approach || '',
    code: langChallenge.sol || '',
    editorBoilerplate: langChallenge.bp || '',
    testCases: langChallenge.testCases,
    functionName: langChallenge.functionName,
    hints: langChallenge.hints,
    constraints: langChallenge.constraints,
    hasVideo: true,
    isLastCheckpoint
  };
};
