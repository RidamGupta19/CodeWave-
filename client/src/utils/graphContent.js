// Graph Explorer Checkpoint Data (56 Checkpoints)
export const getGraphCheckpointContent = (checkpointId, lang = 'cpp') => {
  const language = (lang || 'cpp').toLowerCase() === 'js' ? 'javascript' : (lang || 'cpp').toLowerCase();

  const checkpoints = {
    graph_cp1: {
      title: 'G1 Introduction to Graph Types Different Conventions Used',
      subtitle: 'G1 Introduction to Graph Types Different Conventions Used',
      videoEmbedUrl: 'https://www.youtube.com/embed/M3_pLsDdeuU?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp2: {
      title: 'G2 Graph Representation in C Two Ways to Represent',
      subtitle: 'G2 Graph Representation in C Two Ways to Represent',
      videoEmbedUrl: 'https://www.youtube.com/embed/3oI-34aPMWM?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp3: {
      title: 'G3 Graph Representation in Java Two Ways to Represent',
      subtitle: 'G3 Graph Representation in Java Two Ways to Represent',
      videoEmbedUrl: 'https://www.youtube.com/embed/OsNklbh9gYI?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp4: {
      title: 'G4 What are Connected Components ',
      subtitle: 'G4 What are Connected Components ',
      videoEmbedUrl: 'https://www.youtube.com/embed/lea-Wl_uWXY?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp5: {
      title: 'G5 BreadthFirst Search BFS C and Java Traversal Technique in Graphs',
      subtitle: 'G5 BreadthFirst Search BFS C and Java Traversal Technique in Graphs',
      videoEmbedUrl: 'https://www.youtube.com/embed/-tgVpUgsQ5k?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp6: {
      title: 'G6 DepthFirst Search DFS C and Java Traversal Technique in Graphs',
      subtitle: 'G6 DepthFirst Search DFS C and Java Traversal Technique in Graphs',
      videoEmbedUrl: 'https://www.youtube.com/embed/Qzf1a--rhp8?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp7: {
      title: 'G7 Number of Provinces C Java Connected Components',
      subtitle: 'G7 Number of Provinces C Java Connected Components',
      videoEmbedUrl: 'https://www.youtube.com/embed/ACzkVtewUYA?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp8: {
      title: 'G8 Number of Islands Number of Connected Components in Matrix C Java',
      subtitle: 'G8 Number of Islands Number of Connected Components in Matrix C Java',
      videoEmbedUrl: 'https://www.youtube.com/embed/muncqlKJrH0?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp9: {
      title: 'G9 Flood Fill Algorithm C Java',
      subtitle: 'G9 Flood Fill Algorithm C Java',
      videoEmbedUrl: 'https://www.youtube.com/embed/C-2_uSRli8o?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp10: {
      title: 'G10 Rotten Oranges C Java',
      subtitle: 'G10 Rotten Oranges C Java',
      videoEmbedUrl: 'https://www.youtube.com/embed/yf3oUhkvqA0?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp11: {
      title: 'G11 Detect a Cycle in an Undirected Graph using BFS C Java',
      subtitle: 'G11 Detect a Cycle in an Undirected Graph using BFS C Java',
      videoEmbedUrl: 'https://www.youtube.com/embed/BPlrALf1LDU?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp12: {
      title: 'G12 Detect a Cycle in an Undirected Graph using DFS C Java',
      subtitle: 'G12 Detect a Cycle in an Undirected Graph using DFS C Java',
      videoEmbedUrl: 'https://www.youtube.com/embed/zQ3zgFypzX4?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp13: {
      title: 'G13 Distance of nearest cell having 1 01 Matrix C Java',
      subtitle: 'G13 Distance of nearest cell having 1 01 Matrix C Java',
      videoEmbedUrl: 'https://www.youtube.com/embed/edXdVwkYHF8?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp14: {
      title: 'G14 Surrounded Regions Replace Os with Xs C Java',
      subtitle: 'G14 Surrounded Regions Replace Os with Xs C Java',
      videoEmbedUrl: 'https://www.youtube.com/embed/BtdgAys4yMk?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp15: {
      title: 'G15 Number of Enclaves Multisource BFS C Java',
      subtitle: 'G15 Number of Enclaves Multisource BFS C Java',
      videoEmbedUrl: 'https://www.youtube.com/embed/rxKcepXQgU4?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp16: {
      title: 'G16 Number of Distinct Islands Constructive Thinking DFS C Java',
      subtitle: 'G16 Number of Distinct Islands Constructive Thinking DFS C Java',
      videoEmbedUrl: 'https://www.youtube.com/embed/7zmgQSJghpo?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp17: {
      title: 'G17 Bipartite Graph BFS C Java',
      subtitle: 'G17 Bipartite Graph BFS C Java',
      videoEmbedUrl: 'https://www.youtube.com/embed/-vu34sct1g8?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp18: {
      title: 'G18 Bipartite Graph DFS C Java',
      subtitle: 'G18 Bipartite Graph DFS C Java',
      videoEmbedUrl: 'https://www.youtube.com/embed/KG5YFfR0j8A?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp19: {
      title: 'G19 Detect cycle in a directed graph using DFS Java C',
      subtitle: 'G19 Detect cycle in a directed graph using DFS Java C',
      videoEmbedUrl: 'https://www.youtube.com/embed/9twcmtQj4DU?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp20: {
      title: 'G20 Find Eventual Safe States DFS',
      subtitle: 'G20 Find Eventual Safe States DFS',
      videoEmbedUrl: 'https://www.youtube.com/embed/uRbJ1OF9aYM?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp21: {
      title: 'G21 Topological Sort Algorithm DFS',
      subtitle: 'G21 Topological Sort Algorithm DFS',
      videoEmbedUrl: 'https://www.youtube.com/embed/5lZ0iJMrUMk?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp22: {
      title: 'G22 Kahns Algorithm Topological Sort Algorithm BFS',
      subtitle: 'G22 Kahns Algorithm Topological Sort Algorithm BFS',
      videoEmbedUrl: 'https://www.youtube.com/embed/73sneFXuTEg?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp23: {
      title: 'G23 Detect a Cycle in Directed Graph Topological Sort Kahns Algorithm BFS',
      subtitle: 'G23 Detect a Cycle in Directed Graph Topological Sort Kahns Algorithm BFS',
      videoEmbedUrl: 'https://www.youtube.com/embed/iTBaI90lpDQ?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp24: {
      title: 'G24 Course Schedule I and II Prerequisite Tasks Topological Sort',
      subtitle: 'G24 Course Schedule I and II Prerequisite Tasks Topological Sort',
      videoEmbedUrl: 'https://www.youtube.com/embed/WAOfKpxYHR8?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp25: {
      title: 'G25 Find Eventual Safe States BFS Topological Sort',
      subtitle: 'G25 Find Eventual Safe States BFS Topological Sort',
      videoEmbedUrl: 'https://www.youtube.com/embed/2gtg3VsDGyc?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp26: {
      title: 'G26 Alien Dictionary Topological Sort',
      subtitle: 'G26 Alien Dictionary Topological Sort',
      videoEmbedUrl: 'https://www.youtube.com/embed/U3N_je7tWAs?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp27: {
      title: 'G27 Shortest Path in Directed Acyclic Graph Topological Sort',
      subtitle: 'G27 Shortest Path in Directed Acyclic Graph Topological Sort',
      videoEmbedUrl: 'https://www.youtube.com/embed/ZUFQfFaU-8U?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp28: {
      title: 'G28 Shortest Path in Undirected Graph with Unit Weights',
      subtitle: 'G28 Shortest Path in Undirected Graph with Unit Weights',
      videoEmbedUrl: 'https://www.youtube.com/embed/C4gxoTaI71U?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp29: {
      title: 'G29 Word Ladder I Shortest Paths',
      subtitle: 'G29 Word Ladder I Shortest Paths',
      videoEmbedUrl: 'https://www.youtube.com/embed/tRPda0rcf8E?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp30: {
      title: 'G30 Word Ladder 2 Shortest Paths',
      subtitle: 'G30 Word Ladder 2 Shortest Paths',
      videoEmbedUrl: 'https://www.youtube.com/embed/DREutrv2XD0?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp31: {
      title: 'G31 Word Ladder 2 Optimised Approach for Leetcode',
      subtitle: 'G31 Word Ladder 2 Optimised Approach for Leetcode',
      videoEmbedUrl: 'https://www.youtube.com/embed/AD4SFl7tu7I?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp32: {
      title: 'G32 Dijkstras Algorithm Using Priority Queue C and Java Part 1',
      subtitle: 'G32 Dijkstras Algorithm Using Priority Queue C and Java Part 1',
      videoEmbedUrl: 'https://www.youtube.com/embed/V6H1qAeB-l4?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp33: {
      title: 'G33 Dijkstras Algorithm Using Set Part 2',
      subtitle: 'G33 Dijkstras Algorithm Using Set Part 2',
      videoEmbedUrl: 'https://www.youtube.com/embed/PATgNiuTP20?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp34: {
      title: 'G34 Dijkstras Algorithm Why PQ and not Q Intuition Time Complexity Derivation Pa',
      subtitle: 'G34 Dijkstras Algorithm Why PQ and not Q Intuition Time Complexity Derivation Part 3',
      videoEmbedUrl: 'https://www.youtube.com/embed/3dINsjyfooY?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp35: {
      title: 'G35 Print Shortest Path Dijkstras Algorithm',
      subtitle: 'G35 Print Shortest Path Dijkstras Algorithm',
      videoEmbedUrl: 'https://www.youtube.com/embed/rp1SMw7HSO8?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp36: {
      title: 'G36 Shortest Distance in a Binary Maze',
      subtitle: 'G36 Shortest Distance in a Binary Maze',
      videoEmbedUrl: 'https://www.youtube.com/embed/U5Mw4eyUmw4?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp37: {
      title: 'G37 Path With Minimum Effort',
      subtitle: 'G37 Path With Minimum Effort',
      videoEmbedUrl: 'https://www.youtube.com/embed/0ytpZyiZFhA?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp38: {
      title: 'G38 Cheapest Flights Within K Stops',
      subtitle: 'G38 Cheapest Flights Within K Stops',
      videoEmbedUrl: 'https://www.youtube.com/embed/9XybHVqTHcQ?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp39: {
      title: 'G39 Minimum Multiplications to Reach End',
      subtitle: 'G39 Minimum Multiplications to Reach End',
      videoEmbedUrl: 'https://www.youtube.com/embed/_BvEJ3VIDWw?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp40: {
      title: 'G40 Number of Ways to Arrive at Destination',
      subtitle: 'G40 Number of Ways to Arrive at Destination',
      videoEmbedUrl: 'https://www.youtube.com/embed/_-0mx0SmYxA?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp41: {
      title: 'G41 Bellman Ford Algorithm',
      subtitle: 'G41 Bellman Ford Algorithm',
      videoEmbedUrl: 'https://www.youtube.com/embed/0vVofAhAYjc?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp42: {
      title: 'G42 Floyd Warshall Algorithm',
      subtitle: 'G42 Floyd Warshall Algorithm',
      videoEmbedUrl: 'https://www.youtube.com/embed/YbY8cVwWAvw?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp43: {
      title: 'G43 Find the City With the Smallest Number of Neighbours at a Threshold Distance',
      subtitle: 'G43 Find the City With the Smallest Number of Neighbours at a Threshold Distance',
      videoEmbedUrl: 'https://www.youtube.com/embed/PwMVNSJ5SLI?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp44: {
      title: 'G44 Minimum Spanning Tree Theory',
      subtitle: 'G44 Minimum Spanning Tree Theory',
      videoEmbedUrl: 'https://www.youtube.com/embed/ZSPjZuZWCME?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp45: {
      title: 'G45 Prims Algorithm Minimum Spanning Tree C and Java',
      subtitle: 'G45 Prims Algorithm Minimum Spanning Tree C and Java',
      videoEmbedUrl: 'https://www.youtube.com/embed/mJcZjjKzeqk?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp46: {
      title: 'G46 Disjoint Set Union by Rank Union by Size Path Compression',
      subtitle: 'G46 Disjoint Set Union by Rank Union by Size Path Compression',
      videoEmbedUrl: 'https://www.youtube.com/embed/aBxjDBC4M1U?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp47: {
      title: 'G47 Kruskals Algorithm Minimum Spanning Tree C and Java',
      subtitle: 'G47 Kruskals Algorithm Minimum Spanning Tree C and Java',
      videoEmbedUrl: 'https://www.youtube.com/embed/DMnDM_sxVig?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp48: {
      title: 'G48 Number of Provinces Disjoint Set',
      subtitle: 'G48 Number of Provinces Disjoint Set',
      videoEmbedUrl: 'https://www.youtube.com/embed/ZGr5nX-Gi6Y?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp49: {
      title: 'G49 Number of Operations to Make Network Connected DSU',
      subtitle: 'G49 Number of Operations to Make Network Connected DSU',
      videoEmbedUrl: 'https://www.youtube.com/embed/FYrl7iz9_ZU?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp50: {
      title: 'G50 Accounts Merge DSU',
      subtitle: 'G50 Accounts Merge DSU',
      videoEmbedUrl: 'https://www.youtube.com/embed/FMwpt_aQOGw?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp51: {
      title: 'G51 Number of Islands II Online Queries DSU',
      subtitle: 'G51 Number of Islands II Online Queries DSU',
      videoEmbedUrl: 'https://www.youtube.com/embed/Rn6B-Q4SNyA?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp52: {
      title: 'G52 Making a Large Island DSU',
      subtitle: 'G52 Making a Large Island DSU',
      videoEmbedUrl: 'https://www.youtube.com/embed/lgiz0Oup6gM?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp53: {
      title: 'G53 Most Stones Removed with Same Row or Column DSU',
      subtitle: 'G53 Most Stones Removed with Same Row or Column DSU',
      videoEmbedUrl: 'https://www.youtube.com/embed/OwMNX8SPavM?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp54: {
      title: 'G54 Strongly Connected Components Kosarajus Algorithm',
      subtitle: 'G54 Strongly Connected Components Kosarajus Algorithm',
      videoEmbedUrl: 'https://www.youtube.com/embed/R6uoSjZ2imo?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp55: {
      title: 'G55 Bridges in Graph Using Tarjans Algorithm of time in and low time',
      subtitle: 'G55 Bridges in Graph Using Tarjans Algorithm of time in and low time',
      videoEmbedUrl: 'https://www.youtube.com/embed/qrAub5z8FeA?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
    graph_cp56: {
      title: 'G56 Articulation Point in Graph',
      subtitle: 'G56 Articulation Point in Graph',
      videoEmbedUrl: 'https://www.youtube.com/embed/j1QDfU21iZk?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'int solve() {\n    return 1;\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\n    public static int solve() {\n        // Write your logic here\n        return 1;\n    }\n}',
          sol: 'public static int solve() {\n    return 1;\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\n    # Write your logic here\n    return 1',
          sol: 'def solve():\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\n    // Write your logic here\n    return 1;\n}',
          sol: 'function solve() {\n    return 1;\n}'
        }
      }
    },
  };

  const cp = checkpoints[checkpointId];
  if (!cp) return null;

  const langChallenge = cp.challenges[language] || cp.challenges.cpp;
  const isLastCheckpoint = checkpointId === 'graph_cp56';

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
