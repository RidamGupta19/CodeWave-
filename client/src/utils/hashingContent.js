// Hashing Explorer Checkpoint Data (3 Checkpoints)
export const getHashingCheckpointContent = (checkpointId, lang = 'cpp') => {
  const language = (lang || 'cpp').toLowerCase() === 'js' ? 'javascript' : (lang || 'cpp').toLowerCase();

  const checkpoints = {
    hash_cp1: {
      title: 'Frequency Tracker',
      subtitle: 'Identify the maximum frequency of elements in an array using hashing.',
      videoEmbedUrl: 'https://www.youtube.com/embed/KEs5UyBJ39g?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Maximum Frequency',
          desc: 'Given an array of integers, find the frequency of the element that appears the most times.',
          functionName: 'maxFrequency',
          constraints: '1 <= arr.size() <= 10^5',
          testCases: [
            { input: '[1, 2, 2, 3, 3, 3, 4]', expected: '3' },
            { input: '[10, 10, 10, 10]', expected: '4' }
          ],
          hints: ['Use an unordered_map to store frequencies.', 'Track the maximum frequency while building the map.'],
          bp: '#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nint maxFrequency(vector<int>& arr) {\n    // Write your code here\n    \n}',
          sol: '#include <unordered_map>\nint maxFrequency(vector<int>& arr) {\n    unordered_map<int, int> mp;\n    int maxF = 0;\n    for(int x : arr) {\n        mp[x]++;\n        if(mp[x] > maxF) maxF = mp[x];\n    }\n    return maxF;\n}'
        },
        java: {
          title: 'Maximum Frequency',
          desc: 'Given a list of integers, find the frequency of the element that appears the most times.',
          functionName: 'maxFrequency',
          constraints: '1 <= arr.size() <= 10^5',
          testCases: [
            { input: 'java.util.Arrays.asList(1, 2, 2, 3, 3, 3, 4)', expected: '3' },
            { input: 'java.util.Arrays.asList(10, 10, 10, 10)', expected: '4' }
          ],
          hints: ['Use a HashMap to store frequencies.'],
          bp: 'import java.util.List;\nimport java.util.HashMap;\n\npublic class Solution {\n    public static int maxFrequency(List<Integer> arr) {\n        // Write your code here\n        return 0;\n    }\n}',
          sol: 'public static int maxFrequency(List<Integer> arr) {\n    java.util.Map<Integer, Integer> map = new java.util.HashMap<>();\n    int maxF = 0;\n    for(int x : arr) {\n        map.put(x, map.getOrDefault(x, 0) + 1);\n        if(map.get(x) > maxF) maxF = map.get(x);\n    }\n    return maxF;\n}'
        },
        python: {
          title: 'Maximum Frequency',
          desc: 'Given an array of integers, find the frequency of the element that appears the most times.',
          functionName: 'max_frequency',
          constraints: '1 <= len(arr) <= 10^5',
          testCases: [
            { input: '[1, 2, 2, 3, 3, 3, 4]', expected: '3' },
            { input: '[10, 10, 10, 10]', expected: '4' }
          ],
          hints: ['Use a dictionary or collections.Counter.'],
          bp: 'def max_frequency(arr: list) -> int:\n    # Write your code here\n    pass',
          sol: 'def max_frequency(arr):\n    counts = {}\n    max_f = 0\n    for x in arr:\n      counts[x] = counts.get(x, 0) + 1\n      if counts[x] > max_f: max_f = counts[x]\n    return max_f'
        },
        javascript: {
          title: 'Maximum Frequency',
          desc: 'Given an array of integers, find the frequency of the element that appears the most times.',
          functionName: 'maxFrequency',
          constraints: '1 <= arr.length <= 10^5',
          testCases: [
            { input: '[1, 2, 2, 3, 3, 3, 4]', expected: '3' },
            { input: '[10, 10, 10, 10]', expected: '4' }
          ],
          hints: ['Use an object or Map as frequency tracker.'],
          bp: 'function maxFrequency(arr) {\n    // Write your code here\n    \n}',
          sol: 'function maxFrequency(arr) {\n    let map = {};\n    let maxF = 0;\n    for(let x of arr) {\n        map[x] = (map[x] || 0) + 1;\n        if(map[x] > maxF) maxF = map[x];\n    }\n    return maxF;\n}'
        }
      }
    },
    hash_cp2: {
      title: 'Find Duplicates',
      subtitle: 'Find the count of elements that appear more than once using hashing.',
      videoEmbedUrl: 'https://www.youtube.com/embed/KEs5UyBJ39g?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Count Duplicates',
          desc: 'Given an array, return the count of elements that appear more than once.',
          functionName: 'countDuplicates',
          constraints: '1 <= arr.size() <= 10^5',
          testCases: [
            { input: '[1, 2, 2, 3, 3, 3, 4]', expected: '2' },
            { input: '[10, 20, 30]', expected: '0' }
          ],
          hints: ['Map each value to its frequency count.', 'Count elements having frequency > 1.'],
          bp: '#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nint countDuplicates(vector<int>& arr) {\n    // Write your code here\n    \n}',
          sol: '#include <unordered_map>\nint countDuplicates(vector<int>& arr) {\n    unordered_map<int, int> mp;\n    for(int x : arr) mp[x]++;\n    int cnt = 0;\n    for(auto p : mp) {\n        if(p.second > 1) cnt++;\n    }\n    return cnt;\n}'
        },
        java: {
          title: 'Count Duplicates',
          desc: 'Given a list of integers, return the count of elements that appear more than once.',
          functionName: 'countDuplicates',
          constraints: '1 <= arr.size() <= 10^5',
          testCases: [
            { input: 'java.util.Arrays.asList(1, 2, 2, 3, 3, 3, 4)', expected: '2' },
            { input: 'java.util.Arrays.asList(10, 20, 30)', expected: '0' }
          ],
          hints: ['Count the values in map exceeding frequency 1.'],
          bp: 'import java.util.List;\nimport java.util.HashMap;\n\npublic class Solution {\n    public static int countDuplicates(List<Integer> arr) {\n        // Write your code here\n        return 0;\n    }\n}',
          sol: 'public static int countDuplicates(List<Integer> arr) {\n    java.util.Map<Integer, Integer> map = new java.util.HashMap<>();\n    for(int x : arr) map.put(x, map.getOrDefault(x, 0) + 1);\n    int cnt = 0;\n    for(int v : map.values()) {\n        if(v > 1) cnt++;\n    }\n    return cnt;\n}'
        },
        python: {
          title: 'Count Duplicates',
          desc: 'Given an array, return the count of elements that appear more than once.',
          functionName: 'count_duplicates',
          constraints: '1 <= len(arr) <= 10^5',
          testCases: [
            { input: '[1, 2, 2, 3, 3, 3, 4]', expected: '2' },
            { input: '[10, 20, 30]', expected: '0' }
          ],
          hints: ['Filter keys with value > 1.'],
          bp: 'def count_duplicates(arr: list) -> int:\n    # Write your code here\n    pass',
          sol: 'def count_duplicates(arr):\n    counts = {}\n    for x in arr: counts[x] = counts.get(x, 0) + 1\n    return sum(1 for v in counts.values() if v > 1)'
        },
        javascript: {
          title: 'Count Duplicates',
          desc: 'Given an array, return the count of elements that appear more than once.',
          functionName: 'countDuplicates',
          constraints: '1 <= arr.length <= 10^5',
          testCases: [
            { input: '[1, 2, 2, 3, 3, 3, 4]', expected: '2' },
            { input: '[10, 20, 30]', expected: '0' }
          ],
          hints: ['Filter values with counts > 1.'],
          bp: 'function countDuplicates(arr) {\n    // Write your code here\n    \n}',
          sol: 'function countDuplicates(arr) {\n    let map = {};\n    for(let x of arr) map[x] = (map[x] || 0) + 1;\n    let cnt = 0;\n    for(let k in map) { if(map[k] > 1) cnt++; }\n    return cnt;\n}'
        }
      }
    },
    hash_cp3: {
      title: 'First Unique Element',
      subtitle: 'Identify the first element that appears exactly once in the array.',
      videoEmbedUrl: 'https://www.youtube.com/embed/KEs5UyBJ39g?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'First Unique',
          desc: 'Given an array, return the first element that appears exactly once. If none, return -1.',
          functionName: 'firstUnique',
          constraints: '1 <= arr.size() <= 10^5',
          testCases: [
            { input: '[9, 4, 9, 6, 7, 4]', expected: '6' },
            { input: '[1, 1, 2, 2]', expected: '-1' }
          ],
          hints: ['Use hashing to store counts.', 'Traverse the original array to find the first element with count == 1.'],
          bp: '#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nint firstUnique(vector<int>& arr) {\n    // Write your code here\n    \n}',
          sol: '#include <unordered_map>\nint firstUnique(vector<int>& arr) {\n    unordered_map<int, int> mp;\n    for(int x : arr) mp[x]++;\n    for(int x : arr) {\n        if(mp[x] == 1) return x;\n    }\n    return -1;\n}'
        },
        java: {
          title: 'First Unique',
          desc: 'Given a list, return the first element that appears exactly once. If none, return -1.',
          functionName: 'firstUnique',
          constraints: '1 <= arr.size() <= 10^5',
          testCases: [
            { input: 'java.util.Arrays.asList(9, 4, 9, 6, 7, 4)', expected: '6' },
            { input: 'java.util.Arrays.asList(1, 1, 2, 2)', expected: '-1' }
          ],
          hints: ['Traverse the list and verify counts in map.'],
          bp: 'import java.util.List;\nimport java.util.HashMap;\n\npublic class Solution {\n    public static int firstUnique(List<Integer> arr) {\n        // Write your code here\n        return -1;\n    }\n}',
          sol: 'public static int firstUnique(List<Integer> arr) {\n    java.util.Map<Integer, Integer> map = new java.util.HashMap<>();\n    for(int x : arr) map.put(x, map.getOrDefault(x, 0) + 1);\n    for(int x : arr) {\n        if(map.get(x) == 1) return x;\n    }\n    return -1;\n}'
        },
        python: {
          title: 'First Unique',
          desc: 'Given an array, return the first element that appears exactly once. If none, return -1.',
          functionName: 'first_unique',
          constraints: '1 <= len(arr) <= 10^5',
          testCases: [
            { input: '[9, 4, 9, 6, 7, 4]', expected: '6' },
            { input: '[1, 1, 2, 2]', expected: '-1' }
          ],
          hints: ['Traverse the array sequentially and check dict counts.'],
          bp: 'def first_unique(arr: list) -> int:\n    # Write your code here\n    pass',
          sol: 'def first_unique(arr):\n    counts = {}\n    for x in arr: counts[x] = counts.get(x, 0) + 1\n    for x in arr:\n      if counts[x] == 1: return x\n    return -1'
        },
        javascript: {
          title: 'First Unique',
          desc: 'Given an array, return the first element that appears exactly once. If none, return -1.',
          functionName: 'firstUnique',
          constraints: '1 <= arr.length <= 10^5',
          testCases: [
            { input: '[9, 4, 9, 6, 7, 4]', expected: '6' },
            { input: '[1, 1, 2, 2]', expected: '-1' }
          ],
          hints: ['Check elements sequentially for frequency === 1.'],
          bp: 'function firstUnique(arr) {\n    // Write your code here\n    \n}',
          sol: 'function firstUnique(arr) {\n    let map = {};\n    for(let x of arr) map[x] = (map[x] || 0) + 1;\n    for(let x of arr) {\n        if(map[x] === 1) return x;\n    }\n    return -1;\n}'
        }
      }
    }
  };

  const cp = checkpoints[checkpointId];
  if (!cp) return null;

  const langChallenge = cp.challenges[language] || cp.challenges.cpp;
  const isLastCheckpoint = checkpointId === 'hash_cp3';

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
