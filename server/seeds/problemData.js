const sampleProblems = [
  {
    title: 'Two Sum',
    slug: 'two-sum',
    phaseNumber: 3,
    topic: 'Arrays',
    difficulty: 'Easy',
    problemType: 'Coding',
    description:
      'Given an array of integers and a target value, return the zero-based indices of the two numbers whose sum equals the target. You may assume exactly one valid answer exists.',
    inputFormat:
      'The first line contains an integer n. The second line contains n space-separated integers. The third line contains the target integer.',
    outputFormat:
      'Print two zero-based indices in ascending order separated by a single space.',
    constraints:
      '2 <= n <= 10^5\n-10^9 <= nums[i], target <= 10^9\nExactly one valid answer exists.',
    examples: [
      {
        input: '4\n2 7 11 15\n9',
        output: '0 1',
        explanation: 'nums[0] + nums[1] = 2 + 7 = 9.'
      }
    ],
    visibleTestCases: [
      { input: '4\n2 7 11 15\n9', expectedOutput: '0 1' },
      { input: '4\n3 2 4 6\n6', expectedOutput: '1 2' }
    ],
    hiddenTestCases: [
      { input: '2\n3 3\n6', expectedOutput: '0 1' },
      { input: '5\n-1 -2 -3 -4 -5\n-8', expectedOutput: '2 4' }
    ],
    starterCode: {
      java: `import java.io.*;\nimport java.util.*;\n\npublic class Main {\n  public static void main(String[] args) throws Exception {\n    BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n    int n = Integer.parseInt(br.readLine().trim());\n    int[] nums = Arrays.stream(br.readLine().trim().split("\\\\s+")).mapToInt(Integer::parseInt).toArray();\n    int target = Integer.parseInt(br.readLine().trim());\n\n    // TODO: solve the problem and print the answer.\n  }\n}\n`,
      python: `def solve(nums, target):\n    # TODO: return the answer as a string like "0 1"\n    return ""\n\n\nif __name__ == "__main__":\n    n = int(input().strip())\n    nums = list(map(int, input().split()))\n    target = int(input().strip())\n    print(solve(nums, target))\n`,
      cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nstring solve(const vector<int>& nums, int target) {\n    // TODO: return the answer as a string like "0 1"\n    return "";\n}\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; ++i) cin >> nums[i];\n    int target;\n    cin >> target;\n    cout << solve(nums, target);\n    return 0;\n}\n`,
      javascript: `function solve(nums, target) {\n  // TODO: return the answer as a string like "0 1"\n  return "";\n}\n\nconst fs = require("fs");\nconst input = fs.readFileSync(0, "utf8").trim().split(/\\s+/);\nlet idx = 0;\nconst n = Number(input[idx++]);\nconst nums = [];\nfor (let i = 0; i < n; i += 1) nums.push(Number(input[idx++]));\nconst target = Number(input[idx++]);\nprocess.stdout.write(solve(nums, target));\n`
    },
    functionSignature: {
      java: 'static String solve(int[] nums, int target)',
      python: 'def solve(nums: list[int], target: int) -> str',
      cpp: 'string solve(const vector<int>& nums, int target)',
      javascript: 'function solve(nums, target)'
    },
    expectedComplexity: 'O(n) time, O(n) extra space',
    hints: ['Use a hash map to remember previously seen numbers.', 'Check the complement before storing the current value.'],
    editorial:
      'Scan the array once. For each value nums[i], compute target - nums[i] and look for that value in a hash map. If it exists, you found the answer. Otherwise, store nums[i] with its index.',
    tags: ['array', 'hash-map', 'two-pointers'],
    relatedResources: [
      {
        title: 'GeeksforGeeks - Two Sum Problem',
        url: 'https://www.geeksforgeeks.org/check-if-pair-with-given-sum-exists-in-array/',
        type: 'article'
      }
    ]
  },
  {
    title: 'Maximum Subarray',
    slug: 'maximum-subarray',
    phaseNumber: 3,
    topic: 'Arrays',
    difficulty: 'Medium',
    problemType: 'Coding',
    description:
      'Given an integer array, find the contiguous subarray with the largest sum and print that sum.',
    inputFormat:
      'The first line contains an integer n. The second line contains n space-separated integers.',
    outputFormat:
      'Print a single integer representing the maximum subarray sum.',
    constraints:
      '1 <= n <= 10^5\n-10^4 <= nums[i] <= 10^4',
    examples: [
      {
        input: '9\n-2 1 -3 4 -1 2 1 -5 4',
        output: '6',
        explanation: 'The subarray [4, -1, 2, 1] has the largest sum of 6.'
      }
    ],
    visibleTestCases: [
      { input: '9\n-2 1 -3 4 -1 2 1 -5 4', expectedOutput: '6' },
      { input: '1\n1', expectedOutput: '1' }
    ],
    hiddenTestCases: [
      { input: '5\n5 4 -1 7 8', expectedOutput: '23' },
      { input: '4\n-1 -2 -3 -4', expectedOutput: '-1' }
    ],
    starterCode: {
      java: `import java.io.*;\nimport java.util.*;\n\npublic class Main {\n  public static void main(String[] args) throws Exception {\n    BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n    int n = Integer.parseInt(br.readLine().trim());\n    int[] nums = Arrays.stream(br.readLine().trim().split("\\\\s+")).mapToInt(Integer::parseInt).toArray();\n\n    // TODO: print the maximum subarray sum.\n  }\n}\n`,
      python: `def solve(nums):\n    # TODO: return the maximum subarray sum as a string\n    return ""\n\n\nif __name__ == "__main__":\n    n = int(input().strip())\n    nums = list(map(int, input().split()))\n    print(solve(nums))\n`,
      cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nstring solve(const vector<int>& nums) {\n    // TODO: return the maximum subarray sum as a string\n    return "";\n}\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; ++i) cin >> nums[i];\n    cout << solve(nums);\n    return 0;\n}\n`,
      javascript: `function solve(nums) {\n  // TODO: return the maximum subarray sum as a string\n  return "";\n}\n\nconst fs = require("fs");\nconst input = fs.readFileSync(0, "utf8").trim().split(/\\s+/).map(Number);\nlet idx = 0;\nconst n = input[idx++];\nconst nums = input.slice(idx, idx + n);\nprocess.stdout.write(solve(nums));\n`
    },
    functionSignature: {
      java: 'static String solve(int[] nums)',
      python: 'def solve(nums: list[int]) -> str',
      cpp: 'string solve(const vector<int>& nums)',
      javascript: 'function solve(nums)'
    },
    expectedComplexity: 'O(n) time, O(1) extra space',
    hints: ['Track the best subarray sum ending at the current index.', 'Restart the running sum when extending it stops being useful.'],
    editorial:
      "Use Kadane's algorithm. At each position, decide whether to start a new subarray at the current value or extend the previous one. Keep the global maximum while scanning once.",
    tags: ['array', 'dynamic-programming', 'kadane'],
    relatedResources: [
      {
        title: "GeeksforGeeks - Kadane's Algorithm",
        url: 'https://www.geeksforgeeks.org/largest-sum-contiguous-subarray/',
        type: 'article'
      }
    ]
  },
  {
    title: 'Third Maximum Number',
    slug: 'third-maximum-number',
    phaseNumber: 3,
    topic: 'Arrays',
    difficulty: 'Easy',
    problemType: 'Coding',
    description:
      'Given an integer array, return the third distinct maximum number. If the third distinct maximum does not exist, return the maximum number.',
    inputFormat:
      'The first line contains an integer n. The second line contains n space-separated integers.',
    outputFormat:
      'Print a single integer representing the third distinct maximum number, or the maximum if fewer than three distinct numbers exist.',
    constraints:
      '1 <= n <= 10^4\n-2^31 <= nums[i] <= 2^31 - 1',
    examples: [
      {
        input: '3\n3 2 1',
        output: '1',
        explanation: 'The three distinct values are 3, 2, and 1, so the third maximum is 1.'
      }
    ],
    visibleTestCases: [
      { input: '3\n3 2 1', expectedOutput: '1' },
      { input: '2\n1 2', expectedOutput: '2' }
    ],
    hiddenTestCases: [
      { input: '4\n2 2 3 1', expectedOutput: '1' },
      { input: '5\n5 2 4 1 3', expectedOutput: '3' }
    ],
    starterCode: {
      java: `import java.io.*;\nimport java.util.*;\n\npublic class Main {\n  public static void main(String[] args) throws Exception {\n    BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n    int n = Integer.parseInt(br.readLine().trim());\n    int[] nums = Arrays.stream(br.readLine().trim().split("\\\\s+")).mapToInt(Integer::parseInt).toArray();\n\n    // TODO: print the answer.\n  }\n}\n`,
      python: `def solve(nums):\n    # TODO: return the answer as a string\n    return ""\n\n\nif __name__ == "__main__":\n    n = int(input().strip())\n    nums = list(map(int, input().split()))\n    print(solve(nums))\n`,
      cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nstring solve(const vector<int>& nums) {\n    // TODO: return the answer as a string\n    return "";\n}\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; ++i) cin >> nums[i];\n    cout << solve(nums);\n    return 0;\n}\n`,
      javascript: `function solve(nums) {\n  // TODO: return the answer as a string\n  return "";\n}\n\nconst fs = require("fs");\nconst input = fs.readFileSync(0, "utf8").trim().split(/\\s+/).map(Number);\nlet idx = 0;\nconst n = input[idx++];\nconst nums = input.slice(idx, idx + n);\nprocess.stdout.write(solve(nums));\n`
    },
    functionSignature: {
      java: 'static String solve(int[] nums)',
      python: 'def solve(nums: list[int]) -> str',
      cpp: 'string solve(const vector<int>& nums)',
      javascript: 'function solve(nums)'
    },
    expectedComplexity: 'O(n) time, O(1) extra space',
    hints: ['Track the top three distinct values as you scan.', 'Duplicates should not count as separate maximums.'],
    editorial:
      'Maintain the first, second, and third distinct maximum values while scanning the array once. Skip duplicates, and update the three tracked values in descending order.',
    tags: ['array', 'sorting'],
    relatedResources: [
      {
        title: 'GeeksforGeeks - Third Largest Element',
        url: 'https://www.geeksforgeeks.org/third-largest-element-array-distinct-elements/',
        type: 'article'
      }
    ]
  }
];

module.exports = sampleProblems;
