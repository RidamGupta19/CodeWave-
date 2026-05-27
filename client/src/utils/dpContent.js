// DP Explorer Checkpoint Data (56 Checkpoints)
export const getDPCheckpointContent = (checkpointId, lang = 'cpp') => {
  const language = (lang || 'cpp').toLowerCase() === 'js' ? 'javascript' : (lang || 'cpp').toLowerCase();

  const checkpoints = {
    dp_cp1: {
      title: 'DP 1. Introduction to Dynamic Programming  Memoization  Tabulation  Space Optimi',
      subtitle: 'DP 1. Introduction to Dynamic Programming  Memoization  Tabulation  Space Optimization Techniques',
      videoEmbedUrl: 'https://www.youtube.com/embed/tyB0ztf0DNY?rel=0&modestbranding=1',
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
    dp_cp2: {
      title: 'DP 2. Climbing Stairs  Learn How to Write 1D Recurrence Relations',
      subtitle: 'DP 2. Climbing Stairs  Learn How to Write 1D Recurrence Relations',
      videoEmbedUrl: 'https://www.youtube.com/embed/mLfjzJsN8us?rel=0&modestbranding=1',
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
    dp_cp3: {
      title: 'DP 3. Frog Jump  Dynamic Programming  Learn to write 1D DP',
      subtitle: 'DP 3. Frog Jump  Dynamic Programming  Learn to write 1D DP',
      videoEmbedUrl: 'https://www.youtube.com/embed/EgG3jsGoPvQ?rel=0&modestbranding=1',
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
    dp_cp4: {
      title: 'DP 4. Frog Jump with K Distance  Lecture 3 Follow Up Question',
      subtitle: 'DP 4. Frog Jump with K Distance  Lecture 3 Follow Up Question',
      videoEmbedUrl: 'https://www.youtube.com/embed/Kmh3rhyEtB8?rel=0&modestbranding=1',
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
    dp_cp5: {
      title: 'DP 5. Maximum Sum of Non-Adjacent Elements  House Robber  1-D  DP on Subsequence',
      subtitle: 'DP 5. Maximum Sum of Non-Adjacent Elements  House Robber  1-D  DP on Subsequences',
      videoEmbedUrl: 'https://www.youtube.com/embed/GrMBfJNk_NY?rel=0&modestbranding=1',
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
    dp_cp6: {
      title: 'DP 6. House Robber 2  1D DP  DP on Subsequences',
      subtitle: 'DP 6. House Robber 2  1D DP  DP on Subsequences',
      videoEmbedUrl: 'https://www.youtube.com/embed/3WaxQMELSkw?rel=0&modestbranding=1',
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
    dp_cp7: {
      title: 'DP 7. Ninjas Training  MUST WATCH for 2D CONCEPTS 🔥  Vacation  Atcoder  2D DP',
      subtitle: 'DP 7. Ninjas Training  MUST WATCH for 2D CONCEPTS 🔥  Vacation  Atcoder  2D DP',
      videoEmbedUrl: 'https://www.youtube.com/embed/AE39gJYuRog?rel=0&modestbranding=1',
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
    dp_cp8: {
      title: 'DP 8. Grid Unique Paths  Learn Everything about DP on Grids  ALL TECHNIQUES 🔥',
      subtitle: 'DP 8. Grid Unique Paths  Learn Everything about DP on Grids  ALL TECHNIQUES 🔥',
      videoEmbedUrl: 'https://www.youtube.com/embed/sdE0A2Oxofw?rel=0&modestbranding=1',
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
    dp_cp9: {
      title: 'DP 9. Unique Paths 2  DP on Grid with Maze Obstacles',
      subtitle: 'DP 9. Unique Paths 2  DP on Grid with Maze Obstacles',
      videoEmbedUrl: 'https://www.youtube.com/embed/TmhpgXScLyY?rel=0&modestbranding=1',
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
    dp_cp10: {
      title: 'DP 10. Minimum Path Sum in Grid  Asked to me In Microsoft Internship Interview  ',
      subtitle: 'DP 10. Minimum Path Sum in Grid  Asked to me In Microsoft Internship Interview  DP on GRIDS',
      videoEmbedUrl: 'https://www.youtube.com/embed/_rgTlyky1uQ?rel=0&modestbranding=1',
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
    dp_cp11: {
      title: 'DP 11. Triangle  Fixed Starting Point and Variable Ending Point  DP on GRIDS',
      subtitle: 'DP 11. Triangle  Fixed Starting Point and Variable Ending Point  DP on GRIDS',
      videoEmbedUrl: 'https://www.youtube.com/embed/SrP-PiLSYC0?rel=0&modestbranding=1',
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
    dp_cp12: {
      title: 'DP 12. Minimum/Maximum Falling Path Sum  Variable Starting and Ending Points  DP',
      subtitle: 'DP 12. Minimum/Maximum Falling Path Sum  Variable Starting and Ending Points  DP on Grids',
      videoEmbedUrl: 'https://www.youtube.com/embed/N_aJ5qQbYA0?rel=0&modestbranding=1',
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
    dp_cp13: {
      title: 'DP 13. Cherry Pickup II  3D DP Made Easy  DP On Grids',
      subtitle: 'DP 13. Cherry Pickup II  3D DP Made Easy  DP On Grids',
      videoEmbedUrl: 'https://www.youtube.com/embed/QGfn7JeXK54?rel=0&modestbranding=1',
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
    dp_cp14: {
      title: 'DP 14. Subset Sum Equals to Target  Identify DP on Subsequences and Ways to Solv',
      subtitle: 'DP 14. Subset Sum Equals to Target  Identify DP on Subsequences and Ways to Solve them',
      videoEmbedUrl: 'https://www.youtube.com/embed/fWX9xDmIzRI?rel=0&modestbranding=1',
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
    dp_cp15: {
      title: 'DP 15. Partition Equal Subset Sum  DP on Subsequences',
      subtitle: 'DP 15. Partition Equal Subset Sum  DP on Subsequences',
      videoEmbedUrl: 'https://www.youtube.com/embed/7win3dcgo3k?rel=0&modestbranding=1',
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
    dp_cp16: {
      title: 'Dp 16. Partition A Set Into Two Subsets With Minimum Absolute Sum Difference  DP',
      subtitle: 'Dp 16. Partition A Set Into Two Subsets With Minimum Absolute Sum Difference  DP on Subsequences',
      videoEmbedUrl: 'https://www.youtube.com/embed/GS_OqZb2CWc?rel=0&modestbranding=1',
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
    dp_cp17: {
      title: 'DP 17. Counts Subsets with Sum K  Dp on Subsequences',
      subtitle: 'DP 17. Counts Subsets with Sum K  Dp on Subsequences',
      videoEmbedUrl: 'https://www.youtube.com/embed/ZHyb-A2Mte4?rel=0&modestbranding=1',
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
    dp_cp18: {
      title: 'DP 18. Count Partitions With Given Difference  Dp on Subsequences',
      subtitle: 'DP 18. Count Partitions With Given Difference  Dp on Subsequences',
      videoEmbedUrl: 'https://www.youtube.com/embed/zoilQD1kYSg?rel=0&modestbranding=1',
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
    dp_cp19: {
      title: 'DP 19. 0/1 Knapsack  Recursion to Single Array Space Optimised Approach  DP on S',
      subtitle: 'DP 19. 0/1 Knapsack  Recursion to Single Array Space Optimised Approach  DP on Subsequences',
      videoEmbedUrl: 'https://www.youtube.com/embed/GqOmJHQZivw?rel=0&modestbranding=1',
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
    dp_cp20: {
      title: 'DP 20. Minimum Coins  DP on Subsequences  Infinite Supplies Pattern',
      subtitle: 'DP 20. Minimum Coins  DP on Subsequences  Infinite Supplies Pattern',
      videoEmbedUrl: 'https://www.youtube.com/embed/myPeWb3Y68A?rel=0&modestbranding=1',
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
    dp_cp21: {
      title: 'DP 21. Target Sum  DP on Subsequences',
      subtitle: 'DP 21. Target Sum  DP on Subsequences',
      videoEmbedUrl: 'https://www.youtube.com/embed/b3GD8263-PQ?rel=0&modestbranding=1',
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
    dp_cp22: {
      title: 'DP 22. Coin Change 2  Infinite Supply Problems   DP on Subsequences',
      subtitle: 'DP 22. Coin Change 2  Infinite Supply Problems   DP on Subsequences',
      videoEmbedUrl: 'https://www.youtube.com/embed/HgyouUi11zk?rel=0&modestbranding=1',
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
    dp_cp23: {
      title: 'DP 23. Unbounded Knapsack  1-D Array Space Optimised Approach',
      subtitle: 'DP 23. Unbounded Knapsack  1-D Array Space Optimised Approach',
      videoEmbedUrl: 'https://www.youtube.com/embed/OgvOZ6OrJoY?rel=0&modestbranding=1',
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
    dp_cp24: {
      title: 'DP 24. Rod Cutting Problem  1D Array Space Optimised Approach',
      subtitle: 'DP 24. Rod Cutting Problem  1D Array Space Optimised Approach',
      videoEmbedUrl: 'https://www.youtube.com/embed/mO8XpGoJwuo?rel=0&modestbranding=1',
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
    dp_cp25: {
      title: 'Dp 25. Longest Common Subsequence  Top Down  Bottom-Up  Space Optimised  DP on S',
      subtitle: 'Dp 25. Longest Common Subsequence  Top Down  Bottom-Up  Space Optimised  DP on Strings',
      videoEmbedUrl: 'https://www.youtube.com/embed/NPZn9jBrX8U?rel=0&modestbranding=1',
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
    dp_cp26: {
      title: 'DP 26. Print Longest Common Subsequence  Dp on Strings',
      subtitle: 'DP 26. Print Longest Common Subsequence  Dp on Strings',
      videoEmbedUrl: 'https://www.youtube.com/embed/-zI4mrF2Pb4?rel=0&modestbranding=1',
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
    dp_cp27: {
      title: 'DP 27. Longest Common Substring  DP on Strings 🔥',
      subtitle: 'DP 27. Longest Common Substring  DP on Strings 🔥',
      videoEmbedUrl: 'https://www.youtube.com/embed/_wP9mWNPL5w?rel=0&modestbranding=1',
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
    dp_cp28: {
      title: 'DP 28. Longest Palindromic Subsequence',
      subtitle: 'DP 28. Longest Palindromic Subsequence',
      videoEmbedUrl: 'https://www.youtube.com/embed/6i_T5kkfv4A?rel=0&modestbranding=1',
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
    dp_cp29: {
      title: 'DP 29. Minimum Insertions to Make String Palindrome',
      subtitle: 'DP 29. Minimum Insertions to Make String Palindrome',
      videoEmbedUrl: 'https://www.youtube.com/embed/xPBLEj41rFU?rel=0&modestbranding=1',
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
    dp_cp30: {
      title: 'DP 30. Minimum Insertions/Deletions to Convert String A to String B',
      subtitle: 'DP 30. Minimum Insertions/Deletions to Convert String A to String B',
      videoEmbedUrl: 'https://www.youtube.com/embed/yMnH0jrir0Q?rel=0&modestbranding=1',
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
    dp_cp31: {
      title: 'DP 31. Shortest Common Supersequence  DP on Strings',
      subtitle: 'DP 31. Shortest Common Supersequence  DP on Strings',
      videoEmbedUrl: 'https://www.youtube.com/embed/xElxAuBcvsU?rel=0&modestbranding=1',
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
    dp_cp32: {
      title: 'DP 32. Distinct Subsequences  1D Array Optimisation Technique 🔥',
      subtitle: 'DP 32. Distinct Subsequences  1D Array Optimisation Technique 🔥',
      videoEmbedUrl: 'https://www.youtube.com/embed/nVG7eTiD2bY?rel=0&modestbranding=1',
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
    dp_cp33: {
      title: 'DP 33. Edit Distance  Recursive to 1D Array Optimised Solution 🔥',
      subtitle: 'DP 33. Edit Distance  Recursive to 1D Array Optimised Solution 🔥',
      videoEmbedUrl: 'https://www.youtube.com/embed/fJaKO8FbDdo?rel=0&modestbranding=1',
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
    dp_cp34: {
      title: 'DP 34. Wildcard Matching  Recursive to 1D Array Optimisation 🔥',
      subtitle: 'DP 34. Wildcard Matching  Recursive to 1D Array Optimisation 🔥',
      videoEmbedUrl: 'https://www.youtube.com/embed/ZmlQ3vgAOMo?rel=0&modestbranding=1',
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
    dp_cp35: {
      title: 'DP 35. Best Time to Buy and Sell Stock  DP on Stocks 🔥',
      subtitle: 'DP 35. Best Time to Buy and Sell Stock  DP on Stocks 🔥',
      videoEmbedUrl: 'https://www.youtube.com/embed/excAOvwF_Wk?rel=0&modestbranding=1',
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
    dp_cp36: {
      title: 'DP 36. Buy and Sell Stock - II  Recursion to Space Optimisation',
      subtitle: 'DP 36. Buy and Sell Stock - II  Recursion to Space Optimisation',
      videoEmbedUrl: 'https://www.youtube.com/embed/nGJmxkUJQGs?rel=0&modestbranding=1',
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
    dp_cp37: {
      title: 'DP 37. Buy and Sell Stocks III  Recursion to Space Optimisation',
      subtitle: 'DP 37. Buy and Sell Stocks III  Recursion to Space Optimisation',
      videoEmbedUrl: 'https://www.youtube.com/embed/-uQGzhYj8BQ?rel=0&modestbranding=1',
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
    dp_cp38: {
      title: 'DP 38. Buy and Stock Sell IV  Recursion to Space Optimisation',
      subtitle: 'DP 38. Buy and Stock Sell IV  Recursion to Space Optimisation',
      videoEmbedUrl: 'https://www.youtube.com/embed/IV1dHbk5CDc?rel=0&modestbranding=1',
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
    dp_cp39: {
      title: 'DP 39. Buy and Sell Stocks With Cooldown  Recursion to Space Optimisation',
      subtitle: 'DP 39. Buy and Sell Stocks With Cooldown  Recursion to Space Optimisation',
      videoEmbedUrl: 'https://www.youtube.com/embed/IGIe46xw3YY?rel=0&modestbranding=1',
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
    dp_cp40: {
      title: 'DP 40. Buy and Sell Stocks With Transaction Fee  Recursion to Space Optimisation',
      subtitle: 'DP 40. Buy and Sell Stocks With Transaction Fee  Recursion to Space Optimisation',
      videoEmbedUrl: 'https://www.youtube.com/embed/k4eK-vEmnKg?rel=0&modestbranding=1',
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
    dp_cp41: {
      title: 'DP 41. Longest Increasing Subsequence  Memoization',
      subtitle: 'DP 41. Longest Increasing Subsequence  Memoization',
      videoEmbedUrl: 'https://www.youtube.com/embed/ekcwMsSIzVc?rel=0&modestbranding=1',
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
    dp_cp42: {
      title: 'DP 42. Printing Longest Increasing Subsequence  Tabulation  Algorithm',
      subtitle: 'DP 42. Printing Longest Increasing Subsequence  Tabulation  Algorithm',
      videoEmbedUrl: 'https://www.youtube.com/embed/IFfYfonAFGc?rel=0&modestbranding=1',
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
    dp_cp43: {
      title: 'DP 43. Longest Increasing Subsequence  Binary Search  Intuition',
      subtitle: 'DP 43. Longest Increasing Subsequence  Binary Search  Intuition',
      videoEmbedUrl: 'https://www.youtube.com/embed/on2hvxBXJH4?rel=0&modestbranding=1',
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
    dp_cp44: {
      title: 'DP 44. Largest Divisible Subset  Longest Increasing Subsequence',
      subtitle: 'DP 44. Largest Divisible Subset  Longest Increasing Subsequence',
      videoEmbedUrl: 'https://www.youtube.com/embed/gDuZwBW9VvM?rel=0&modestbranding=1',
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
    dp_cp45: {
      title: 'DP 45. Longest String Chain  Longest Increasing Subsequence  LIS',
      subtitle: 'DP 45. Longest String Chain  Longest Increasing Subsequence  LIS',
      videoEmbedUrl: 'https://www.youtube.com/embed/YY8iBaYcc4g?rel=0&modestbranding=1',
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
    dp_cp46: {
      title: 'DP 46. Longest Bitonic Subsequence  LIS',
      subtitle: 'DP 46. Longest Bitonic Subsequence  LIS',
      videoEmbedUrl: 'https://www.youtube.com/embed/y4vN0WNdrlg?rel=0&modestbranding=1',
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
    dp_cp47: {
      title: 'DP 47. Number of Longest Increasing Subsequences',
      subtitle: 'DP 47. Number of Longest Increasing Subsequences',
      videoEmbedUrl: 'https://www.youtube.com/embed/cKVl1TFdNXg?rel=0&modestbranding=1',
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
    dp_cp48: {
      title: 'DP 48. Matrix Chain Multiplication  MCM  Partition DP Starts 🔥',
      subtitle: 'DP 48. Matrix Chain Multiplication  MCM  Partition DP Starts 🔥',
      videoEmbedUrl: 'https://www.youtube.com/embed/vRVfmbCFW7Y?rel=0&modestbranding=1',
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
    dp_cp49: {
      title: 'DP 49. Matrix Chain Multiplication  Bottom-Up  Tabulation',
      subtitle: 'DP 49. Matrix Chain Multiplication  Bottom-Up  Tabulation',
      videoEmbedUrl: 'https://www.youtube.com/embed/pDCXsbAw5Cg?rel=0&modestbranding=1',
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
    dp_cp50: {
      title: 'DP 50. Minimum Cost to Cut the Stick',
      subtitle: 'DP 50. Minimum Cost to Cut the Stick',
      videoEmbedUrl: 'https://www.youtube.com/embed/xwomavsC86c?rel=0&modestbranding=1',
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
    dp_cp51: {
      title: 'DP 51. Burst Balloons  Partition DP  Interactive G-Meet Session Update',
      subtitle: 'DP 51. Burst Balloons  Partition DP  Interactive G-Meet Session Update',
      videoEmbedUrl: 'https://www.youtube.com/embed/Yz4LlDSlkns?rel=0&modestbranding=1',
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
    dp_cp52: {
      title: 'DP 52. Evaluate Boolean Expression to True  Partition DP',
      subtitle: 'DP 52. Evaluate Boolean Expression to True  Partition DP',
      videoEmbedUrl: 'https://www.youtube.com/embed/MM7fXopgyjw?rel=0&modestbranding=1',
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
    dp_cp53: {
      title: 'DP 53. Palindrome Partitioning - II  Front Partition 🔥',
      subtitle: 'DP 53. Palindrome Partitioning - II  Front Partition 🔥',
      videoEmbedUrl: 'https://www.youtube.com/embed/_H8V5hJUGd0?rel=0&modestbranding=1',
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
    dp_cp54: {
      title: 'DP 54. Partition Array for Maximum Sum  Front Partition 🔥',
      subtitle: 'DP 54. Partition Array for Maximum Sum  Front Partition 🔥',
      videoEmbedUrl: 'https://www.youtube.com/embed/PhWWJmaKfMc?rel=0&modestbranding=1',
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
    dp_cp55: {
      title: 'DP 55. Maximum Rectangle Area with all 1s  DP on Rectangles',
      subtitle: 'DP 55. Maximum Rectangle Area with all 1s  DP on Rectangles',
      videoEmbedUrl: 'https://www.youtube.com/embed/tOylVCugy9k?rel=0&modestbranding=1',
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
    dp_cp56: {
      title: 'DP 56. Count Square Submatrices with All Ones  DP on Rectangles 🔥',
      subtitle: 'DP 56. Count Square Submatrices with All Ones  DP on Rectangles 🔥',
      videoEmbedUrl: 'https://www.youtube.com/embed/auS1fynpnjo?rel=0&modestbranding=1',
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
  const isLastCheckpoint = checkpointId === 'dp_cp56';

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
