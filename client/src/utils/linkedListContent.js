// LinkedList Explorer Checkpoint Data (29 Checkpoints)
export const getLinkedListCheckpointContent = (checkpointId, lang = 'cpp') => {
  const language = (lang || 'cpp').toLowerCase() === 'js' ? 'javascript' : (lang || 'cpp').toLowerCase();

  const checkpoints = {
    ll_cp1: {
      title: 'Paid LinkedList Bootcamp Launch Video',
      subtitle: 'Paid LinkedList Bootcamp Launch Video',
      videoEmbedUrl: 'https://www.youtube.com/embed/cg6JGiXhQ9c?rel=0&modestbranding=1',
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
    ll_cp2: {
      title: 'L1 Introduction to LinkedList Traversal Length Search an Element',
      subtitle: 'L1 Introduction to LinkedList Traversal Length Search an Element',
      videoEmbedUrl: 'https://www.youtube.com/embed/Nq7ok-OyEpg?rel=0&modestbranding=1',
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
    ll_cp3: {
      title: 'L2 Deletion and Insertion in LL 8 Problems',
      subtitle: 'L2 Deletion and Insertion in LL 8 Problems',
      videoEmbedUrl: 'https://www.youtube.com/embed/VaECK03Dz-g?rel=0&modestbranding=1',
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
    ll_cp4: {
      title: 'L3 Introduction to Doubly LinkedList Insertions and Deletions',
      subtitle: 'L3 Introduction to Doubly LinkedList Insertions and Deletions',
      videoEmbedUrl: 'https://www.youtube.com/embed/0eKMU10uEDI?rel=0&modestbranding=1',
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
    ll_cp5: {
      title: 'L4 Reverse a DLL Multiple Approaches',
      subtitle: 'L4 Reverse a DLL Multiple Approaches',
      videoEmbedUrl: 'https://www.youtube.com/embed/u3WUW2qe6ww?rel=0&modestbranding=1',
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
    ll_cp6: {
      title: 'L5 Add 2 numbers in LinkedList Dummy Node Approach',
      subtitle: 'L5 Add 2 numbers in LinkedList Dummy Node Approach',
      videoEmbedUrl: 'https://www.youtube.com/embed/XmRrGzR6udg?rel=0&modestbranding=1',
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
    ll_cp7: {
      title: 'L6 Odd Even Linked List Multiple Approaches',
      subtitle: 'L6 Odd Even Linked List Multiple Approaches',
      videoEmbedUrl: 'https://www.youtube.com/embed/qf6qp7GzD5Q?rel=0&modestbranding=1',
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
    ll_cp8: {
      title: 'L7 Sort a LinkedList of 0s 1s and 2s Multiple Approaches',
      subtitle: 'L7 Sort a LinkedList of 0s 1s and 2s Multiple Approaches',
      videoEmbedUrl: 'https://www.youtube.com/embed/gRII7LhdJWc?rel=0&modestbranding=1',
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
    ll_cp9: {
      title: 'L8 Remove Nth Node from the end of the LinkedList Multiple Approaches',
      subtitle: 'L8 Remove Nth Node from the end of the LinkedList Multiple Approaches',
      videoEmbedUrl: 'https://www.youtube.com/embed/3kMKYQ2wNIU?rel=0&modestbranding=1',
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
    ll_cp10: {
      title: 'L9 Reverse a LinkedList Iterative and Recursive',
      subtitle: 'L9 Reverse a LinkedList Iterative and Recursive',
      videoEmbedUrl: 'https://www.youtube.com/embed/D2vI2DNJGd8?rel=0&modestbranding=1',
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
    ll_cp11: {
      title: 'L10 Check if a LinkedList is Palindrome or Not Multiple Approaches',
      subtitle: 'L10 Check if a LinkedList is Palindrome or Not Multiple Approaches',
      videoEmbedUrl: 'https://www.youtube.com/embed/lRY_G-u_8jk?rel=0&modestbranding=1',
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
    ll_cp12: {
      title: 'L11 Add 1 to a number represented by LinkedList',
      subtitle: 'L11 Add 1 to a number represented by LinkedList',
      videoEmbedUrl: 'https://www.youtube.com/embed/aXQWhbvT3w0?rel=0&modestbranding=1',
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
    ll_cp13: {
      title: 'L12 Find the intersection point of Y LinkedList',
      subtitle: 'L12 Find the intersection point of Y LinkedList',
      videoEmbedUrl: 'https://www.youtube.com/embed/0DYoPz2Tpt4?rel=0&modestbranding=1',
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
    ll_cp14: {
      title: 'L13 Find the middle element of the LinkedList Multiple Approaches',
      subtitle: 'L13 Find the middle element of the LinkedList Multiple Approaches',
      videoEmbedUrl: 'https://www.youtube.com/embed/7LjQ57RqgEc?rel=0&modestbranding=1',
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
    ll_cp15: {
      title: 'L14 Detect a loop or cycle in LinkedList With proof and Intuition',
      subtitle: 'L14 Detect a loop or cycle in LinkedList With proof and Intuition',
      videoEmbedUrl: 'https://www.youtube.com/embed/wiOo4DC5GGA?rel=0&modestbranding=1',
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
    ll_cp16: {
      title: 'L15 Find the length of the Loop in LinkedList',
      subtitle: 'L15 Find the length of the Loop in LinkedList',
      videoEmbedUrl: 'https://www.youtube.com/embed/I4g1qbkTPus?rel=0&modestbranding=1',
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
    ll_cp17: {
      title: 'L16 Delete the middle node of the LinkedList',
      subtitle: 'L16 Delete the middle node of the LinkedList',
      videoEmbedUrl: 'https://www.youtube.com/embed/ePpV-_pfOeI?rel=0&modestbranding=1',
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
    ll_cp18: {
      title: 'L17 Find the starting point of the LoopCycle in LinkedList Multiple Approaches',
      subtitle: 'L17 Find the starting point of the LoopCycle in LinkedList Multiple Approaches',
      videoEmbedUrl: 'https://www.youtube.com/embed/2Kd0KKmmHFc?rel=0&modestbranding=1',
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
    ll_cp19: {
      title: 'L18 Delete all occurrences of a Key in DLL',
      subtitle: 'L18 Delete all occurrences of a Key in DLL',
      videoEmbedUrl: 'https://www.youtube.com/embed/Mh0NH_SD92k?rel=0&modestbranding=1',
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
    ll_cp20: {
      title: 'L19 Find all Pairs with given Sum in DLL',
      subtitle: 'L19 Find all Pairs with given Sum in DLL',
      videoEmbedUrl: 'https://www.youtube.com/embed/YitR4dQsddE?rel=0&modestbranding=1',
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
    ll_cp21: {
      title: 'L20 Remove duplicates from sorted DLL',
      subtitle: 'L20 Remove duplicates from sorted DLL',
      videoEmbedUrl: 'https://www.youtube.com/embed/YJKVTnOJXSY?rel=0&modestbranding=1',
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
    ll_cp22: {
      title: 'L21 Reverse Nodes in K Group Size of LinkedList',
      subtitle: 'L21 Reverse Nodes in K Group Size of LinkedList',
      videoEmbedUrl: 'https://www.youtube.com/embed/lIar1skcQYI?rel=0&modestbranding=1',
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
    ll_cp23: {
      title: 'L22 Rotate a LinkedList',
      subtitle: 'L22 Rotate a LinkedList',
      videoEmbedUrl: 'https://www.youtube.com/embed/uT7YI7XbTY8?rel=0&modestbranding=1',
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
    ll_cp24: {
      title: 'L23 Merge two sorted Linked Lists',
      subtitle: 'L23 Merge two sorted Linked Lists',
      videoEmbedUrl: 'https://www.youtube.com/embed/jXu-H7XuClE?rel=0&modestbranding=1',
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
    ll_cp25: {
      title: 'L24 Flattening a LinkedList Multiple Approaches with Dry Run',
      subtitle: 'L24 Flattening a LinkedList Multiple Approaches with Dry Run',
      videoEmbedUrl: 'https://www.youtube.com/embed/ykelywHJWLg?rel=0&modestbranding=1',
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
    ll_cp26: {
      title: 'L25 Merge K Sorted Lists Multiple Approaches',
      subtitle: 'L25 Merge K Sorted Lists Multiple Approaches',
      videoEmbedUrl: 'https://www.youtube.com/embed/1zktEppsdig?rel=0&modestbranding=1',
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
    ll_cp27: {
      title: 'L26 Sort a Linked List Merge Sort and Brute Force',
      subtitle: 'L26 Sort a Linked List Merge Sort and Brute Force',
      videoEmbedUrl: 'https://www.youtube.com/embed/8ocB7a_c-Cc?rel=0&modestbranding=1',
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
    ll_cp28: {
      title: 'L27 Clone a LinkedList with Next and Random Pointers Copy List with Random Point',
      subtitle: 'L27 Clone a LinkedList with Next and Random Pointers Copy List with Random Pointers',
      videoEmbedUrl: 'https://www.youtube.com/embed/q570bKdrnlw?rel=0&modestbranding=1',
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
    ll_cp29: {
      title: 'L28 Design a Browser History LinkedList Implementation',
      subtitle: 'L28 Design a Browser History LinkedList Implementation',
      videoEmbedUrl: 'https://www.youtube.com/embed/mG3KLugbOdc?rel=0&modestbranding=1',
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
  const isLastCheckpoint = checkpointId === 'll_cp29';

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
