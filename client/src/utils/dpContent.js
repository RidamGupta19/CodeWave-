// Dynamic Programming Explorer Checkpoint Data (3 Checkpoints)
export const getDpCheckpointContent = (checkpointId, lang = 'cpp') => {
  const language = (lang || 'cpp').toLowerCase() === 'js' ? 'javascript' : (lang || 'cpp').toLowerCase();

  const checkpoints = {
    dp_cp1: {
      title: 'Climbing Stairs',
      subtitle: 'Use Dynamic Programming to count distinct ways to climb stairs.',
      videoEmbedUrl: 'https://www.youtube.com/embed/tyB0ztf0DNY?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Climbing Stairs',
          desc: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
          functionName: 'climbStairs',
          constraints: '1 <= n <= 45',
          testCases: [
            { input: '2', expected: '2' },
            { input: '3', expected: '3' },
            { input: '5', expected: '8' }
          ],
          hints: ['This follows the Fibonacci sequence pattern: ways(n) = ways(n-1) + ways(n-2).', 'Use memoization or bottom-up tabulation to solve in O(N) time.'],
          bp: 'int climbStairs(int n) {\n    // Write your code here\n    \n}',
          sol: 'int climbStairs(int n) {\n    if(n <= 2) return n;\n    int prev2 = 1, prev = 2;\n    for(int i = 3; i <= n; i++) {\n        int curr = prev + prev2;\n        prev2 = prev;\n        prev = curr;\n    }\n    return prev;\n}'
        },
        java: {
          title: 'Climbing Stairs',
          desc: 'Each time you can climb 1 or 2 steps. Find distinct ways to climb to n steps.',
          functionName: 'climbStairs',
          constraints: '1 <= n <= 45',
          testCases: [
            { input: '2', expected: '2' },
            { input: '3', expected: '3' },
            { input: '5', expected: '8' }
          ],
          hints: ['Use simple variables to space-optimize the DP.'],
          bp: 'public class Solution {\n    public static int climbStairs(int n) {\n        // Write your code here\n        return 0;\n    }\n}',
          sol: 'public static int climbStairs(int n) {\n    if(n <= 2) return n;\n    int prev2 = 1, prev = 2;\n    for(int i = 3; i <= n; i++) {\n        int curr = prev + prev2;\n        prev2 = prev;\n        prev = curr;\n    }\n    return prev;\n}'
        },
        python: {
          title: 'Climbing Stairs',
          desc: 'Each time you can climb 1 or 2 steps. Find distinct ways to climb to n steps.',
          functionName: 'climb_stairs',
          constraints: '1 <= n <= 45',
          testCases: [
            { input: '2', expected: '2' },
            { input: '3', expected: '3' },
            { input: '5', expected: '8' }
          ],
          hints: ['Iteratively calculate sums.'],
          bp: 'def climb_stairs(n: int) -> int:\n    # Write your code here\n    pass',
          sol: 'def climb_stairs(n):\n    if n <= 2: return n\n    prev2, prev = 1, 2\n    for i in range(3, n + 1):\n        curr = prev + prev2\n        prev2, prev = prev, curr\n    return prev'
        },
        javascript: {
          title: 'Climbing Stairs',
          desc: 'Each time you can climb 1 or 2 steps. Find distinct ways to climb to n steps.',
          functionName: 'climbStairs',
          constraints: '1 <= n <= 45',
          testCases: [
            { input: '2', expected: '2' },
            { input: '3', expected: '3' },
            { input: '5', expected: '8' }
          ],
          hints: ['Accumulate using dynamic variables.'],
          bp: 'function climbStairs(n) {\n    // Write your code here\n    \n}',
          sol: 'function climbStairs(n) {\n    if(n <= 2) return n;\n    let prev2 = 1, prev = 2;\n    for(let i = 3; i <= n; i++) {\n        let curr = prev + prev2;\n        prev2 = prev;\n        prev = curr;\n    }\n    return prev;\n}'
        }
      }
    },
    dp_cp2: {
      title: 'House Robber',
      subtitle: 'Find the maximum amount of money you can rob without alerting police (non-adjacent sum optimization).',
      videoEmbedUrl: 'https://www.youtube.com/embed/7cELW7O_E9k?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'House Robber',
          desc: 'Given a list of non-negative integers representing the amount of money of each house, determine the maximum amount of money you can rob tonight without robbing adjacent houses.',
          functionName: 'rob',
          constraints: '1 <= nums.size() <= 100',
          testCases: [
            { input: '[1, 2, 3, 1]', expected: '4' },
            { input: '[2, 7, 9, 3, 1]', expected: '12' }
          ],
          hints: ['DP State: dp[i] = max(dp[i-1], nums[i] + dp[i-2]).', 'Optimize space to O(1) by maintaining the two previous sums.'],
          bp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint rob(vector<int>& nums) {\n    // Write your code here\n    \n}',
          sol: 'int rob(vector<int>& nums) {\n    int n = nums.size();\n    if(n == 0) return 0;\n    if(n == 1) return nums[0];\n    int prev2 = 0, prev = nums[0];\n    for(int i = 1; i < n; i++) {\n        int curr = max(prev, nums[i] + prev2);\n        prev2 = prev;\n        prev = curr;\n    }\n    return prev;\n}'
        },
        java: {
          title: 'House Robber',
          desc: 'Determine max robbery money from non-adjacent houses.',
          functionName: 'rob',
          constraints: '1 <= nums.size() <= 100',
          testCases: [
            { input: 'java.util.Arrays.asList(1, 2, 3, 1)', expected: '4' },
            { input: 'java.util.Arrays.asList(2, 7, 9, 3, 1)', expected: '12' }
          ],
          hints: ['Implement the max(prev, current + prev2) state transition.'],
          bp: 'import java.util.List;\n\npublic class Solution {\n    public static int rob(List<Integer> nums) {\n        // Write your code here\n        return 0;\n    }\n}',
          sol: 'public static int rob(List<Integer> nums) {\n    int n = nums.size();\n    if(n == 0) return 0;\n    if(n == 1) return nums.get(0);\n    int prev2 = 0, prev = nums.get(0);\n    for(int i = 1; i < n; i++) {\n        int curr = Math.max(prev, nums.get(i) + prev2);\n        prev2 = prev;\n        prev = curr;\n    }\n    return prev;\n}'
        },
        python: {
          title: 'House Robber',
          desc: 'Determine max robbery money from non-adjacent houses.',
          functionName: 'rob',
          constraints: '1 <= len(nums) <= 100',
          testCases: [
            { input: '[1, 2, 3, 1]', expected: '4' },
            { input: '[2, 7, 9, 3, 1]', expected: '12' }
          ],
          hints: ['Keep track of maximums iteratively.'],
          bp: 'def rob(nums: list) -> int:\n    # Write your code here\n    pass',
          sol: 'def rob(nums):\n    if not nums: return 0\n    prev2, prev = 0, nums[0]\n    for i in range(1, len(nums)):\n        curr = max(prev, nums[i] + prev2)\n        prev2, prev = prev, curr\n    return prev'
        },
        javascript: {
          title: 'House Robber',
          desc: 'Determine max robbery money from non-adjacent houses.',
          functionName: 'rob',
          constraints: '1 <= nums.length <= 100',
          testCases: [
            { input: '[1, 2, 3, 1]', expected: '4' },
            { input: '[2, 7, 9, 3, 1]', expected: '12' }
          ],
          hints: ['Iterate and track two previous values.'],
          bp: 'function rob(nums) {\n    // Write your code here\n    \n}',
          sol: 'function rob(nums) {\n    let n = nums.length;\n    if(n === 0) return 0;\n    if(n === 1) return nums[0];\n    let prev2 = 0, prev = nums[0];\n    for(let i = 1; i < n; i++) {\n        let curr = Math.max(prev, nums[i] + prev2);\n        prev2 = prev;\n        prev = curr;\n    }\n    return prev;\n}'
        }
      }
    },
    dp_cp3: {
      title: 'Min Path Sum',
      subtitle: 'Find the minimum sum path from top-left to bottom-right in a grid.',
      videoEmbedUrl: 'https://www.youtube.com/embed/NPZn9jBrX8U?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Minimum Path Sum',
          desc: 'Given a grid of non-negative integers, find a path from top-left to bottom-right which minimizes the sum of all numbers along its path. You can only move down or right.',
          functionName: 'minPathSum',
          constraints: '1 <= grid.size(), grid[i].size() <= 100',
          testCases: [
            { input: '[[1, 3, 1], [1, 5, 1], [4, 2, 1]]', expected: '7' },
            { input: '[[1, 2, 3], [4, 5, 6]]', expected: '12' }
          ],
          hints: ['Recurrence: dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]).', 'Fill rows and columns sequentially.'],
          bp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint minPathSum(vector<vector<int>>& grid) {\n    // Write your code here\n    \n}',
          sol: 'int minPathSum(vector<vector<int>>& grid) {\n    int m = grid.size(), n = grid[0].size();\n    vector<vector<int>> dp(m, vector<int>(n, 0));\n    dp[0][0] = grid[0][0];\n    for(int j = 1; j < n; j++) dp[0][j] = dp[0][j - 1] + grid[0][j];\n    for(int i = 1; i < m; i++) dp[i][0] = dp[i - 1][0] + grid[i][0];\n    for(int i = 1; i < m; i++) {\n        for(int j = 1; j < n; j++) {\n            dp[i][j] = grid[i][j] + min(dp[i - 1][j], dp[i][j - 1]);\n        }\n    }\n    return dp[m - 1][n - 1];\n}'
        },
        java: {
          title: 'Minimum Path Sum',
          desc: 'Find path from top-left to bottom-right minimizing cell sums.',
          functionName: 'minPathSum',
          constraints: '1 <= grid.size(), grid[i].size() <= 100',
          testCases: [
            { input: 'java.util.Arrays.asList(java.util.Arrays.asList(1, 3, 1), java.util.Arrays.asList(1, 5, 1), java.util.Arrays.asList(4, 2, 1))', expected: '7' },
            { input: 'java.util.Arrays.asList(java.util.Arrays.asList(1, 2, 3), java.util.Arrays.asList(4, 5, 6))', expected: '12' }
          ],
          hints: ['Compute matching grid DP sums.'],
          bp: 'import java.util.List;\n\npublic class Solution {\n    public static int minPathSum(List<List<Integer>> grid) {\n        // Write your code here\n        return 0;\n    }\n}',
          sol: 'public static int minPathSum(List<List<Integer>> grid) {\n    int m = grid.size(), n = grid.get(0).size();\n    int[][] dp = new int[m][n];\n    dp[0][0] = grid.get(0).get(0);\n    for(int j = 1; j < n; j++) dp[0][j] = dp[0][j - 1] + grid.get(0).get(j);\n    for(int i = 1; i < m; i++) dp[i][0] = dp[i - 1][0] + grid.get(i).get(0);\n    for(int i = 1; i < m; i++) {\n        for(int j = 1; j < n; j++) {\n            dp[i][j] = grid.get(i).get(j) + Math.min(dp[i - 1][j], dp[i][j - 1]);\n        }\n    }\n    return dp[m - 1][n - 1];\n}'
        },
        python: {
          title: 'Minimum Path Sum',
          desc: 'Find path from top-left to bottom-right minimizing cell sums.',
          functionName: 'min_path_sum',
          constraints: '1 <= len(grid), len(grid[0]) <= 100',
          testCases: [
            { input: '[[1, 3, 1], [1, 5, 1], [4, 2, 1]]', expected: '7' },
            { input: '[[1, 2, 3], [4, 5, 6]]', expected: '12' }
          ],
          hints: ['Tabulate values from left/top bounds.'],
          bp: 'def min_path_sum(grid: list) -> int:\n    # Write your code here\n    pass',
          sol: 'def min_path_sum(grid):\n    m, n = len(grid), len(grid[0])\n    dp = [[0] * n for _ in range(m)]\n    dp[0][0] = grid[0][0]\n    for j in range(1, n): dp[0][j] = dp[0][j-1] + grid[0][j]\n    for i in range(1, m): dp[i][0] = dp[i-1][0] + grid[i][0]\n    for i in range(1, m):\n        for j in range(1, n):\n            dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])\n    return dp[m-1][n-1]'
        },
        javascript: {
          title: 'Minimum Path Sum',
          desc: 'Find path from top-left to bottom-right minimizing cell sums.',
          functionName: 'minPathSum',
          constraints: '1 <= grid.length, grid[0].length <= 100',
          testCases: [
            { input: '[[1, 3, 1], [1, 5, 1], [4, 2, 1]]', expected: '7' },
            { input: '[[1, 2, 3], [4, 5, 6]]', expected: '12' }
          ],
          hints: ['Accumulate matrix min matching values.'],
          bp: 'function minPathSum(grid) {\n    // Write your code here\n    \n}',
          sol: 'function minPathSum(grid) {\n    let m = grid.length, n = grid[0].length;\n    let dp = Array.from({length: m}, () => new Array(n).fill(0));\n    dp[0][0] = grid[0][0];\n    for(let j = 1; j < n; j++) dp[0][j] = dp[0][j - 1] + grid[0][j];\n    for(let i = 1; i < m; i++) dp[i][0] = dp[i - 1][0] + grid[i][0];\n    for(let i = 1; i < m; i++) {\n        for(let j = 1; j < n; j++) {\n            dp[i][j] = grid[i][j] + Math.min(dp[i - 1][j], dp[i][j - 1]);\n        }\n    }\n    return dp[m - 1][n - 1];\n}'
        }
      }
    }
  };

  const cp = checkpoints[checkpointId];
  if (!cp) return null;

  const langChallenge = cp.challenges[language] || cp.challenges.cpp;
  const isLastCheckpoint = checkpointId === 'dp_cp3';

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
