// Striver's Arrays Playlist Checkpoint Data (28 Videos/Checkpoints)
// Each checkpoint contains unique watch video links and progressive coding challenges.
// Boilerplates are kept minimal: only function/class declarations, no pre-filled loops or logic.

export const getArraysCheckpointContent = (checkpointId, lang = 'cpp') => {
  const language = (lang || 'cpp').toLowerCase() === 'js' ? 'javascript' : (lang || 'cpp').toLowerCase();

  const checkpoints = {
    arr_cp1: {
      title: 'Second Largest Element',
      subtitle: 'Identify the second largest element in an array in a single O(N) pass.',
      videoEmbedUrl: 'https://www.youtube.com/embed/37E9ckMDdTk?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Second Largest Element',
          desc: 'Given an array of integers, return the second largest element. If it does not exist, return -1.',
          functionName: 'getSecondLargest',
          constraints: '2 <= arr.size() <= 10^5, -10^9 <= arr[i] <= 10^9',
          testCases: [
            { input: '[12, 35, 1, 10, 34, 1]', expected: '34' },
            { input: '[10, 10, 10]', expected: '-1' }
          ],
          hints: ['Keep track of largest and secondLargest.', 'Update them as you traverse the array in one pass.'],
          bp: '#include <vector>\nusing namespace std;\n\nint getSecondLargest(vector<int>& arr) {\n    // Write your code here\n    \n}',
          sol: 'int getSecondLargest(vector<int>& arr) {\n    int largest = -1e9, sec = -1e9;\n    for(int x : arr) {\n        if(x > largest) { sec = largest; largest = x; }\n        else if(x < largest && x > sec) { sec = x; }\n    }\n    return sec == -1e9 ? -1 : sec;\n}'
        },
        java: {
          title: 'Second Largest Element',
          desc: 'Given an array of integers, return the second largest element. If it does not exist, return -1.',
          functionName: 'getSecondLargest',
          constraints: '2 <= arr.size() <= 10^5',
          testCases: [
            { input: 'java.util.Arrays.asList(12, 35, 1, 10, 34, 1)', expected: '34' },
            { input: 'java.util.Arrays.asList(10, 10, 10)', expected: '-1' }
          ],
          hints: ['Use one pass to update largest and secondLargest.'],
          bp: 'import java.util.List;\n\npublic class Solution {\n    public static int getSecondLargest(List<Integer> arr) {\n        // Write your code here\n        return -1;\n    }\n}',
          sol: 'public static int getSecondLargest(List<Integer> arr) {\n    int largest = Integer.MIN_VALUE, sec = Integer.MIN_VALUE;\n    for(int x : arr) {\n        if(x > largest) { sec = largest; largest = x; }\n        else if(x < largest && x > sec) { sec = x; }\n    }\n    return sec == Integer.MIN_VALUE ? -1 : sec;\n}'
        },
        python: {
          title: 'Second Largest Element',
          desc: 'Given an array of integers, return the second largest element. If it does not exist, return -1.',
          functionName: 'get_second_largest',
          constraints: '2 <= len(arr) <= 10^5',
          testCases: [
            { input: '[12, 35, 1, 10, 34, 1]', expected: '34' },
            { input: '[10, 10, 10]', expected: '-1' }
          ],
          hints: ['Initialize largest and second largest to float("-inf").'],
          bp: 'def get_second_largest(arr: list) -> int:\n    # Write your code here\n    pass',
          sol: 'def get_second_largest(arr):\n    largest = float("-inf")\n    sec = float("-inf")\n    for x in arr:\n        if x > largest: sec = largest; largest = x\n        elif x < largest and x > sec: sec = x\n    return -1 if sec == float("-inf") else sec'
        },
        javascript: {
          title: 'Second Largest Element',
          desc: 'Given an array of integers, return the second largest element. If it does not exist, return -1.',
          functionName: 'getSecondLargest',
          constraints: '2 <= arr.length <= 10^5',
          testCases: [
            { input: '[12, 35, 1, 10, 34, 1]', expected: '34' },
            { input: '[10, 10, 10]', expected: '-1' }
          ],
          hints: ['Traverse the array and update values.'],
          bp: 'function getSecondLargest(arr) {\n    // Write your code here\n    \n}',
          sol: 'function getSecondLargest(arr) {\n    let largest = -Infinity, sec = -Infinity;\n    for(let x of arr) {\n        if(x > largest) { sec = largest; largest = x; }\n        else if(x < largest && x > sec) { sec = x; }\n    }\n    return sec === -Infinity ? -1 : sec;\n}'
        }
      }
    },
    arr_cp2: {
      title: 'Rotate Array by K Places',
      subtitle: 'Left rotate an array by K places in-place or with minimal space.',
      videoEmbedUrl: 'https://www.youtube.com/embed/wvcQg43_V8U?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Rotate Array',
          desc: 'Given an array of integers, left rotate it by k places. Return the modified array.',
          functionName: 'rotateArray',
          constraints: '1 <= arr.size() <= 10^5, 0 <= k <= 10^5',
          testCases: [
            { input: '[1, 2, 3, 4, 5, 6, 7], 3', expected: '4,5,6,7,1,2,3' },
            { input: '[1, 2, 3, 4, 5], 2', expected: '3,4,5,1,2' }
          ],
          hints: ['Normalize k by taking k = k % n.', 'Reverse the first k elements, then the remaining elements, and then the entire array.'],
          bp: '#include <vector>\nusing namespace std;\n\nvector<int> rotateArray(vector<int>& arr, int k) {\n    // Write your code here\n    \n}',
          sol: 'vector<int> rotateArray(vector<int>& arr, int k) {\n    int n = arr.size();\n    k = k % n;\n    vector<int> temp(arr.begin(), arr.begin() + k);\n    for(int i = k; i < n; i++) arr[i - k] = arr[i];\n    for(int i = 0; i < k; i++) arr[n - k + i] = temp[i];\n    return arr;\n}'
        },
        java: {
          title: 'Rotate Array',
          desc: 'Given an array of integers, left rotate it by k places.',
          functionName: 'rotateArray',
          constraints: '1 <= arr.size() <= 10^5, 0 <= k <= 10^5',
          testCases: [
            { input: 'new java.util.ArrayList<>(java.util.Arrays.asList(1, 2, 3, 4, 5, 6, 7)), 3', expected: '[4, 5, 6, 7, 1, 2, 3]' },
            { input: 'new java.util.ArrayList<>(java.util.Arrays.asList(1, 2, 3, 4, 5)), 2', expected: '[3, 4, 5, 1, 2]' }
          ],
          hints: ['Use modulo operation for k.', 'Create a temporary array for rotated elements.'],
          bp: 'import java.util.List;\n\npublic class Solution {\n    public static List<Integer> rotateArray(List<Integer> arr, int k) {\n        // Write your code here\n        return arr;\n    }\n}',
          sol: 'public static List<Integer> rotateArray(List<Integer> arr, int k) {\n    int n = arr.size();\n    k = k % n;\n    java.util.List<Integer> temp = new java.util.ArrayList<>(arr.subList(0, k));\n    for(int i = k; i < n; i++) arr.set(i - k, arr.get(i));\n    for(int i = 0; i < k; i++) arr.set(n - k + i, temp.get(i));\n    return arr;\n}'
        },
        python: {
          title: 'Rotate Array',
          desc: 'Given an array of integers, left rotate it by k places.',
          functionName: 'rotate_array',
          constraints: '1 <= len(arr) <= 10^5',
          testCases: [
            { input: '[1, 2, 3, 4, 5, 6, 7], 3', expected: '4,5,6,7,1,2,3' },
            { input: '[1, 2, 3, 4, 5], 2', expected: '3,4,5,1,2' }
          ],
          hints: ['Use list slicing to rotate the array.'],
          bp: 'def rotate_array(arr: list, k: int) -> list:\n    # Write your code here\n    pass',
          sol: 'def rotate_array(arr, k):\n    n = len(arr)\n    k = k % n\n    return arr[k:] + arr[:k]'
        },
        javascript: {
          title: 'Rotate Array',
          desc: 'Given an array of integers, left rotate it by k places.',
          functionName: 'rotateArray',
          constraints: '1 <= arr.length <= 10^5',
          testCases: [
            { input: '[1, 2, 3, 4, 5, 6, 7], 3', expected: '4,5,6,7,1,2,3' },
            { input: '[1, 2, 3, 4, 5], 2', expected: '3,4,5,1,2' }
          ],
          hints: ['Slice the array and concatenate.'],
          bp: 'function rotateArray(arr, k) {\n    // Write your code here\n    \n}',
          sol: 'function rotateArray(arr, k) {\n    let n = arr.length;\n    k = k % n;\n    return arr.slice(k).concat(arr.slice(0, k));\n}'
        }
      }
    },
    arr_cp3: {
      title: 'Find Single Element',
      subtitle: 'Find the element that appears once while all other elements appear twice.',
      videoEmbedUrl: 'https://www.youtube.com/embed/bYWLJb3vCWY?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Find Single Element',
          desc: 'Given a non-empty array of integers where every element appears twice except for one, find that single element. Solve in O(N) time and O(1) space.',
          functionName: 'getSingleElement',
          constraints: '1 <= arr.size() <= 10^5',
          testCases: [
            { input: '[4, 1, 2, 1, 2]', expected: '4' },
            { input: '[2, 2, 1]', expected: '1' }
          ],
          hints: ['XORing a number with itself results in 0 (A ^ A = 0).', 'XORing a number with 0 results in the number itself (A ^ 0 = A).'],
          bp: '#include <vector>\nusing namespace std;\n\nint getSingleElement(vector<int>& arr) {\n    // Write your code here\n    \n}',
          sol: 'int getSingleElement(vector<int>& arr) {\n    int ans = 0;\n    for(int x : arr) ans ^= x;\n    return ans;\n}'
        },
        java: {
          title: 'Find Single Element',
          desc: 'Find the element that appears once while all other elements appear twice.',
          functionName: 'getSingleElement',
          constraints: '1 <= arr.size() <= 10^5',
          testCases: [
            { input: 'java.util.Arrays.asList(4, 1, 2, 1, 2)', expected: '4' },
            { input: 'java.util.Arrays.asList(2, 2, 1)', expected: '1' }
          ],
          hints: ['XOR all the elements together.'],
          bp: 'import java.util.List;\n\npublic class Solution {\n    public static int getSingleElement(List<Integer> arr) {\n        // Write your code here\n        return 0;\n    }\n}',
          sol: 'public static int getSingleElement(List<Integer> arr) {\n    int ans = 0;\n    for(int x : arr) ans ^= x;\n    return ans;\n}'
        },
        python: {
          title: 'Find Single Element',
          desc: 'Find the element that appears once while all other elements appear twice.',
          functionName: 'get_single_element',
          constraints: '1 <= len(arr) <= 10^5',
          testCases: [
            { input: '[4, 1, 2, 1, 2]', expected: '4' },
            { input: '[2, 2, 1]', expected: '1' }
          ],
          hints: ['Use the bitwise XOR operator.'],
          bp: 'def get_single_element(arr: list) -> int:\n    # Write your code here\n    pass',
          sol: 'def get_single_element(arr):\n    ans = 0\n    for x in arr: ans ^= x\n    return ans'
        },
        javascript: {
          title: 'Find Single Element',
          desc: 'Find the element that appears once while all other elements appear twice.',
          functionName: 'getSingleElement',
          constraints: '1 <= arr.length <= 10^5',
          testCases: [
            { input: '[4, 1, 2, 1, 2]', expected: '4' },
            { input: '[2, 2, 1]', expected: '1' }
          ],
          hints: ['Iterate and compute running XOR.'],
          bp: 'function getSingleElement(arr) {\n    // Write your code here\n    \n}',
          sol: 'function getSingleElement(arr) {\n    let ans = 0;\n    for(let x of arr) ans ^= x;\n    return ans;\n}'
        }
      }
    },
    arr_cp4: {
      title: 'Longest Subarray with Sum K',
      subtitle: 'Find the length of the longest contiguous subarray whose sum equals K.',
      videoEmbedUrl: 'https://www.youtube.com/embed/frf7qxiN2qU?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Longest Subarray with Sum K',
          desc: 'Given an array of positive integers and an integer k, find the length of the longest subarray with sum equal to k.',
          functionName: 'longestSubarrayWithSumK',
          constraints: '1 <= arr.size() <= 10^5, 1 <= k <= 10^9',
          testCases: [
            { input: '[1, 2, 3, 1, 1, 1, 1, 4, 2, 3], 3', expected: '3' },
            { input: '[2, 3, 5, 1, 9], 10', expected: '3' }
          ],
          hints: ['Use a sliding window (two pointers) approach.', 'Extend the right pointer, and shrink from the left if the sum exceeds k.'],
          bp: '#include <vector>\nusing namespace std;\n\nint longestSubarrayWithSumK(vector<int>& arr, int k) {\n    // Write your code here\n    \n}',
          sol: 'int longestSubarrayWithSumK(vector<int>& arr, int k) {\n    int left = 0, right = 0, sum = 0, maxLen = 0;\n    int n = arr.size();\n    while(right < n) {\n        sum += arr[right];\n        while(left <= right && sum > k) {\n            sum -= arr[left];\n            left++;\n        }\n        if(sum == k) maxLen = max(maxLen, right - left + 1);\n        right++;\n    }\n    return maxLen;\n}'
        },
        java: {
          title: 'Longest Subarray with Sum K',
          desc: 'Find the length of the longest subarray with sum equal to k.',
          functionName: 'longestSubarrayWithSumK',
          constraints: '1 <= arr.size() <= 10^5',
          testCases: [
            { input: 'java.util.Arrays.asList(1, 2, 3, 1, 1, 1, 1, 4, 2, 3), 3', expected: '3' },
            { input: 'java.util.Arrays.asList(2, 3, 5, 1, 9), 10', expected: '3' }
          ],
          hints: ['Use two pointers to form a sliding window.'],
          bp: 'import java.util.List;\n\npublic class Solution {\n    public static int longestSubarrayWithSumK(List<Integer> arr, int k) {\n        // Write your code here\n        return 0;\n    }\n}',
          sol: 'public static int longestSubarrayWithSumK(List<Integer> arr, int k) {\n    int left = 0, right = 0, sum = 0, maxLen = 0, n = arr.size();\n    while(right < n) {\n        sum += arr.get(right);\n        while(left <= right && sum > k) {\n            sum -= arr.get(left);\n            left++;\n        }\n        if(sum == k) maxLen = Math.max(maxLen, right - left + 1);\n        right++;\n    }\n    return maxLen;\n}'
        },
        python: {
          title: 'Longest Subarray with Sum K',
          desc: 'Find the length of the longest subarray with sum equal to k.',
          functionName: 'longest_subarray_with_sum_k',
          constraints: '1 <= len(arr) <= 10^5',
          testCases: [
            { input: '[1, 2, 3, 1, 1, 1, 1, 4, 2, 3], 3', expected: '3' },
            { input: '[2, 3, 5, 1, 9], 10', expected: '3' }
          ],
          hints: ['Maintain window sum and shrink from left when it exceeds k.'],
          bp: 'def longest_subarray_with_sum_k(arr: list, k: int) -> int:\n    # Write your code here\n    pass',
          sol: 'def longest_subarray_with_sum_k(arr, k):\n    left = right = sum_val = max_len = 0\n    n = len(arr)\n    while right < n:\n        sum_val += arr[right]\n        while left <= right and sum_val > k:\n            sum_val -= arr[left]\n            left += 1\n        if sum_val == k:\n            max_len = max(max_len, right - left + 1)\n        right += 1\n    return max_len'
        },
        javascript: {
          title: 'Longest Subarray with Sum K',
          desc: 'Find the length of the longest subarray with sum equal to k.',
          functionName: 'longestSubarrayWithSumK',
          constraints: '1 <= arr.length <= 10^5',
          testCases: [
            { input: '[1, 2, 3, 1, 1, 1, 1, 4, 2, 3], 3', expected: '3' },
            { input: '[2, 3, 5, 1, 9], 10', expected: '3' }
          ],
          hints: ['Implement the sliding window technique.'],
          bp: 'function longestSubarrayWithSumK(arr, k) {\n    // Write your code here\n    \n}',
          sol: 'function longestSubarrayWithSumK(arr, k) {\n    let left = 0, right = 0, sum = 0, maxLen = 0, n = arr.length;\n    while(right < n) {\n        sum += arr[right];\n        while(left <= right && sum > k) {\n            sum -= arr[left];\n            left++;\n        }\n        if(sum === k) maxLen = Math.max(maxLen, right - left + 1);\n        right++;\n    }\n    return maxLen;\n}'
        }
      }
    },
    arr_cp5: {
      title: 'Two Sum',
      subtitle: 'Find two indices in the array that add up to target K.',
      videoEmbedUrl: 'https://www.youtube.com/embed/UXDSeD9mN-k?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Two Sum',
          desc: 'Given an array of integers arr and an integer target, return the indices of the two numbers such that they add up to target. Assume exactly one solution.',
          functionName: 'twoSum',
          constraints: '2 <= arr.size() <= 10^4',
          testCases: [
            { input: '[2, 7, 11, 15], 9', expected: '0,1' },
            { input: '[3, 2, 4], 6', expected: '1,2' }
          ],
          hints: ['Use a hash map to store elements and their indices.', 'For each element, check if target - element is already in the map.'],
          bp: '#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& arr, int target) {\n    // Write your code here\n    \n}',
          sol: '#include <unordered_map>\nvector<int> twoSum(vector<int>& arr, int target) {\n    unordered_map<int, int> mp;\n    for(int i = 0; i < arr.size(); i++) {\n        int rem = target - arr[i];\n        if(mp.count(rem)) return {mp[rem], i};\n        mp[arr[i]] = i;\n    }\n    return {};\n}'
        },
        java: {
          title: 'Two Sum',
          desc: 'Find the two indices that add up to target.',
          functionName: 'twoSum',
          constraints: '2 <= arr.size() <= 10^4',
          testCases: [
            { input: 'java.util.Arrays.asList(2, 7, 11, 15), 9', expected: '[0, 1]' },
            { input: 'java.util.Arrays.asList(3, 2, 4), 6', expected: '[1, 2]' }
          ],
          hints: ['HashMap stores values and indices.'],
          bp: 'import java.util.List;\nimport java.util.HashMap;\n\npublic class Solution {\n    public static List<Integer> twoSum(List<Integer> arr, int target) {\n        // Write your code here\n        return null;\n    }\n}',
          sol: 'public static List<Integer> twoSum(List<Integer> arr, int target) {\n    java.util.Map<Integer, Integer> map = new java.util.HashMap<>();\n    for(int i = 0; i < arr.size(); i++) {\n        int rem = target - arr.get(i);\n        if(map.containsKey(rem)) return java.util.Arrays.asList(map.get(rem), i);\n        map.put(arr.get(i), i);\n    }\n    return java.util.Collections.emptyList();\n}'
        },
        python: {
          title: 'Two Sum',
          desc: 'Find the two indices that add up to target.',
          functionName: 'two_sum',
          constraints: '2 <= len(arr) <= 10^4',
          testCases: [
            { input: '[2, 7, 11, 15], 9', expected: '0,1' },
            { input: '[3, 2, 4], 6', expected: '1,2' }
          ],
          hints: ['Use a Python dictionary.'],
          bp: 'def two_sum(arr: list, target: int) -> list:\n    # Write your code here\n    pass',
          sol: 'def two_sum(arr, target):\n    seen = {}\n    for i, num in enumerate(arr):\n        rem = target - num\n        if rem in seen: return [seen[rem], i]\n        seen[num] = i\n    return []'
        },
        javascript: {
          title: 'Two Sum',
          desc: 'Find the two indices that add up to target.',
          functionName: 'twoSum',
          constraints: '2 <= arr.length <= 10^4',
          testCases: [
            { input: '[2, 7, 11, 15], 9', expected: '0,1' },
            { input: '[3, 2, 4], 6', expected: '1,2' }
          ],
          hints: ['Use a Map object or raw object as hash map.'],
          bp: 'function twoSum(arr, target) {\n    // Write your code here\n    \n}',
          sol: 'function twoSum(arr, target) {\n    let mp = {};\n    for(let i = 0; i < arr.length; i++) {\n        let rem = target - arr[i];\n        if(rem in mp) return [mp[rem], i];\n        mp[arr[i]] = i;\n    }\n    return [];\n}'
        }
      }
    },
    arr_cp6: {
      title: 'Sort Array of 0s, 1s, and 2s',
      subtitle: 'Sort the array in-place without library sort functions (Dutch National Flag Algorithm).',
      videoEmbedUrl: 'https://www.youtube.com/embed/tp8JIuCXBaU?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Sort 0s, 1s, and 2s',
          desc: 'Given an array containing only 0s, 1s, and 2s, sort it in-place.',
          functionName: 'sortZeroOneTwo',
          constraints: '1 <= arr.size() <= 10^5',
          testCases: [
            { input: '[2, 0, 2, 1, 1, 0]', expected: '0,0,1,1,2,2' },
            { input: '[2, 0, 1]', expected: '0,1,2' }
          ],
          hints: ['Maintain three pointers: low, mid, and high.', 'Process values at mid: swap 0s with low, 2s with high, and increment mid for 1s.'],
          bp: '#include <vector>\nusing namespace std;\n\nvector<int> sortZeroOneTwo(vector<int>& arr) {\n    // Write your code here\n    \n}',
          sol: 'vector<int> sortZeroOneTwo(vector<int>& arr) {\n    int low = 0, mid = 0, high = arr.size() - 1;\n    while(mid <= high) {\n        if(arr[mid] == 0) { swap(arr[low], arr[mid]); low++; mid++; }\n        else if(arr[mid] == 1) { mid++; }\n        else { swap(arr[mid], arr[high]); high--; }\n    }\n    return arr;\n}'
        },
        java: {
          title: 'Sort 0s, 1s, and 2s',
          desc: 'Sort an array of 0s, 1s, and 2s in-place.',
          functionName: 'sortZeroOneTwo',
          constraints: '1 <= arr.size() <= 10^5',
          testCases: [
            { input: 'new java.util.ArrayList<>(java.util.Arrays.asList(2, 0, 2, 1, 1, 0))', expected: '[0, 0, 1, 1, 2, 2]' },
            { input: 'new java.util.ArrayList<>(java.util.Arrays.asList(2, 0, 1))', expected: '[0, 1, 2]' }
          ],
          hints: ['Apply the Dutch National Flag algorithm.'],
          bp: 'import java.util.List;\n\npublic class Solution {\n    public static List<Integer> sortZeroOneTwo(List<Integer> arr) {\n        // Write your code here\n        return arr;\n    }\n}',
          sol: 'public static List<Integer> sortZeroOneTwo(List<Integer> arr) {\n    int low = 0, mid = 0, high = arr.size() - 1;\n    while(mid <= high) {\n        if(arr.get(mid) == 0) {\n            int temp = arr.get(low); arr.set(low, 0); arr.set(mid, temp); low++; mid++;\n        } else if(arr.get(mid) == 1) {\n            mid++;\n        } else {\n            int temp = arr.get(high); arr.set(high, 2); arr.set(mid, temp); high--;\n        }\n    }\n    return arr;\n}'
        },
        python: {
          title: 'Sort 0s, 1s, and 2s',
          desc: 'Sort an array of 0s, 1s, and 2s in-place.',
          functionName: 'sort_zero_one_two',
          constraints: '1 <= len(arr) <= 10^5',
          testCases: [
            { input: '[2, 0, 2, 1, 1, 0]', expected: '0,0,1,1,2,2' },
            { input: '[2, 0, 1]', expected: '0,1,2' }
          ],
          hints: ['Swap elements using low, mid, high pointers.'],
          bp: 'def sort_zero_one_two(arr: list) -> list:\n    # Write your code here\n    pass',
          sol: 'def sort_zero_one_two(arr):\n    low, mid, high = 0, 0, len(arr) - 1\n    while mid <= high:\n        if arr[mid] == 0:\n            arr[low], arr[mid] = arr[mid], arr[low]\n            low += 1; mid += 1\n        elif arr[mid] == 1:\n            mid += 1\n        else:\n            arr[mid], arr[high] = arr[high], arr[mid]\n            high -= 1\n    return arr'
        },
        javascript: {
          title: 'Sort 0s, 1s, and 2s',
          desc: 'Sort an array of 0s, 1s, and 2s in-place.',
          functionName: 'sortZeroOneTwo',
          constraints: '1 <= arr.length <= 10^5',
          testCases: [
            { input: '[2, 0, 2, 1, 1, 0]', expected: '0,0,1,1,2,2' },
            { input: '[2, 0, 1]', expected: '0,1,2' }
          ],
          hints: ['Perform three-way partitioning.'],
          bp: 'function sortZeroOneTwo(arr) {\n    // Write your code here\n    \n}',
          sol: 'function sortZeroOneTwo(arr) {\n    let low = 0, mid = 0, high = arr.length - 1;\n    while(mid <= high) {\n        if(arr[mid] === 0) {\n            let temp = arr[low]; arr[low] = 0; arr[mid] = temp; low++; mid++;\n        } else if(arr[mid] === 1) {\n            mid++;\n        } else {\n            let temp = arr[high]; arr[high] = 2; arr[mid] = temp; high--;\n        }\n    }\n    return arr;\n}'
        }
      }
    },
    arr_cp7: {
      title: 'Majority Element I',
      subtitle: 'Find the element that appears more than n/2 times in the array (Boyer-Moore Voting Algorithm).',
      videoEmbedUrl: 'https://www.youtube.com/embed/nP_ns3uSh80?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Majority Element',
          desc: 'Given an array of size n, return the majority element which appears more than n/2 times. Assume it always exists.',
          functionName: 'majorityElement',
          constraints: '1 <= arr.size() <= 10^5',
          testCases: [
            { input: '[3, 2, 3]', expected: '3' },
            { input: '[2, 2, 1, 1, 1, 2, 2]', expected: '2' }
          ],
          hints: ['Use Boyer-Moore Voting Algorithm.', 'Maintain a candidate and a counter. Increment/decrement based on match.'],
          bp: '#include <vector>\nusing namespace std;\n\nint majorityElement(vector<int>& arr) {\n    // Write your code here\n    \n}',
          sol: 'int majorityElement(vector<int>& arr) {\n    int candidate = 0, count = 0;\n    for(int x : arr) {\n        if(count == 0) candidate = x;\n        count += (x == candidate) ? 1 : -1;\n    }\n    return candidate;\n}'
        },
        java: {
          title: 'Majority Element',
          desc: 'Find the element that appears more than n/2 times.',
          functionName: 'majorityElement',
          constraints: '1 <= arr.size() <= 10^5',
          testCases: [
            { input: 'java.util.Arrays.asList(3, 2, 3)', expected: '3' },
            { input: 'java.util.Arrays.asList(2, 2, 1, 1, 1, 2, 2)', expected: '2' }
          ],
          hints: ['Moore\'s Voting Algorithm provides O(N) solution.'],
          bp: 'import java.util.List;\n\npublic class Solution {\n    public static int majorityElement(List<Integer> arr) {\n        // Write your code here\n        return 0;\n    }\n}',
          sol: 'public static int majorityElement(List<Integer> arr) {\n    int cand = 0, count = 0;\n    for(int x : arr) {\n        if(count == 0) cand = x;\n        count += (x == cand) ? 1 : -1;\n    }\n    return cand;\n}'
        },
        python: {
          title: 'Majority Element',
          desc: 'Find the element that appears more than n/2 times.',
          functionName: 'majority_element',
          constraints: '1 <= len(arr) <= 10^5',
          testCases: [
            { input: '[3, 2, 3]', expected: '3' },
            { input: '[2, 2, 1, 1, 1, 2, 2]', expected: '2' }
          ],
          hints: ['Keep candidate count.'],
          bp: 'def majority_element(arr: list) -> int:\n    # Write your code here\n    pass',
          sol: 'def majority_element(arr):\n    cand, count = 0, 0\n    for x in arr:\n        if count == 0: cand = x\n        count += 1 if x == cand else -1\n    return cand'
        },
        javascript: {
          title: 'Majority Element',
          desc: 'Find the element that appears more than n/2 times.',
          functionName: 'majorityElement',
          constraints: '1 <= arr.length <= 10^5',
          testCases: [
            { input: '[3, 2, 3]', expected: '3' },
            { input: '[2, 2, 1, 1, 1, 2, 2]', expected: '2' }
          ],
          hints: ['Implement candidate matching traversal.'],
          bp: 'function majorityElement(arr) {\n    // Write your code here\n    \n}',
          sol: 'function majorityElement(arr) {\n    let cand = 0, count = 0;\n    for(let x of arr) {\n        if(count === 0) cand = x;\n        count += (x === cand) ? 1 : -1;\n    }\n    return cand;\n}'
        }
      }
    },
    arr_cp8: {
      title: 'Maximum Subarray Sum',
      subtitle: 'Find the maximum sum of a contiguous subarray (Kadane\'s Algorithm).',
      videoEmbedUrl: 'https://www.youtube.com/embed/AHZpyENo7k4?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Maximum Subarray Sum',
          desc: 'Given an integer array, find the contiguous subarray which has the largest sum and return its sum.',
          functionName: 'maxSubarraySum',
          constraints: '1 <= arr.size() <= 10^5',
          testCases: [
            { input: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]', expected: '6' },
            { input: '[5, 4, -1, 7, 8]', expected: '23' }
          ],
          hints: ['Use Kadane\'s Algorithm.', 'Iterate through the array, add element to running sum. Reset sum to 0 if it goes below 0.'],
          bp: '#include <vector>\nusing namespace std;\n\nint maxSubarraySum(vector<int>& arr) {\n    // Write your code here\n    \n}',
          sol: 'int maxSubarraySum(vector<int>& arr) {\n    int sum = 0, maxi = -1e9;\n    for(int x : arr) {\n        sum += x;\n        maxi = max(maxi, sum);\n        if(sum < 0) sum = 0;\n    }\n    return maxi;\n}'
        },
        java: {
          title: 'Maximum Subarray Sum',
          desc: 'Find the maximum sum of a contiguous subarray.',
          functionName: 'maxSubarraySum',
          constraints: '1 <= arr.size() <= 10^5',
          testCases: [
            { input: 'java.util.Arrays.asList(-2, 1, -3, 4, -1, 2, 1, -5, 4)', expected: '6' },
            { input: 'java.util.Arrays.asList(5, 4, -1, 7, 8)', expected: '23' }
          ],
          hints: ['Implement Kadane\'s algorithm with running sum.'],
          bp: 'import java.util.List;\n\npublic class Solution {\n    public static int maxSubarraySum(List<Integer> arr) {\n        // Write your code here\n        return 0;\n    }\n}',
          sol: 'public static int maxSubarraySum(List<Integer> arr) {\n    int sum = 0, maxi = Integer.MIN_VALUE;\n    for(int x : arr) {\n        sum += x;\n        maxi = Math.max(maxi, sum);\n        if(sum < 0) sum = 0;\n    }\n    return maxi;\n}'
        },
        python: {
          title: 'Maximum Subarray Sum',
          desc: 'Find the maximum sum of a contiguous subarray.',
          functionName: 'max_subarray_sum',
          constraints: '1 <= len(arr) <= 10^5',
          testCases: [
            { input: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]', expected: '6' },
            { input: '[5, 4, -1, 7, 8]', expected: '23' }
          ],
          hints: ['Reset sum to 0 if sum < 0.'],
          bp: 'def max_subarray_sum(arr: list) -> int:\n    # Write your code here\n    pass',
          sol: 'def max_subarray_sum(arr):\n    sum_val, maxi = 0, float("-inf")\n    for x in arr:\n        sum_val += x\n        maxi = max(maxi, sum_val)\n        if sum_val < 0: sum_val = 0\n    return maxi'
        },
        javascript: {
          title: 'Maximum Subarray Sum',
          desc: 'Find the maximum sum of a contiguous subarray.',
          functionName: 'maxSubarraySum',
          constraints: '1 <= arr.length <= 10^5',
          testCases: [
            { input: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]', expected: '6' },
            { input: '[5, 4, -1, 7, 8]', expected: '23' }
          ],
          hints: ['Maintain running sum and max sum.'],
          bp: 'function maxSubarraySum(arr) {\n    // Write your code here\n    \n}',
          sol: 'function maxSubarraySum(arr) {\n    let sum = 0, maxi = -Infinity;\n    for(let x of arr) {\n        sum += x;\n        maxi = Math.max(maxi, sum);\n        if(sum < 0) sum = 0;\n    }\n    return maxi;\n}'
        }
      }
    },
    arr_cp9: {
      title: 'Rearrange Array by Sign',
      subtitle: 'Rearrange elements in-place or out-of-place alternately by their sign.',
      videoEmbedUrl: 'https://www.youtube.com/embed/h4aBagy4Uok?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Rearrange by Sign',
          desc: 'Given an array of size n containing equal number of positive and negative integers, rearrange them alternately starting with positive. Return the result.',
          functionName: 'rearrangeBySign',
          constraints: '2 <= arr.size() <= 10^5, size is even',
          testCases: [
            { input: '[3, 1, -2, -5, 2, -4]', expected: '3,-2,1,-5,2,-4' },
            { input: '[1, -1]', expected: '1,-1' }
          ],
          hints: ['Maintain two indices: posIdx = 0, negIdx = 1.', 'Create result array and place elements accordingly.'],
          bp: '#include <vector>\nusing namespace std;\n\nvector<int> rearrangeBySign(vector<int>& arr) {\n    // Write your code here\n    \n}',
          sol: 'vector<int> rearrangeBySign(vector<int>& arr) {\n    int n = arr.size();\n    vector<int> ans(n);\n    int pos = 0, neg = 1;\n    for(int x : arr) {\n        if(x > 0) { ans[pos] = x; pos += 2; }\n        else { ans[neg] = x; neg += 2; }\n    }\n    return ans;\n}'
        },
        java: {
          title: 'Rearrange by Sign',
          desc: 'Rearrange positive and negative numbers alternately.',
          functionName: 'rearrangeBySign',
          constraints: '2 <= arr.size() <= 10^5',
          testCases: [
            { input: 'java.util.Arrays.asList(3, 1, -2, -5, 2, -4)', expected: '[3, -2, 1, -5, 2, -4]' },
            { input: 'java.util.Arrays.asList(1, -1)', expected: '[1, -1]' }
          ],
          hints: ['Fill positive at even indices, negative at odd indices.'],
          bp: 'import java.util.List;\nimport java.util.ArrayList;\n\npublic class Solution {\n    public static List<Integer> rearrangeBySign(List<Integer> arr) {\n        // Write your code here\n        return null;\n    }\n}',
          sol: 'public static List<Integer> rearrangeBySign(List<Integer> arr) {\n    int n = arr.size();\n    java.util.List<Integer> ans = new java.util.ArrayList<>(java.util.Collections.nCopies(n, 0));\n    int pos = 0, neg = 1;\n    for(int x : arr) {\n        if(x > 0) { ans.set(pos, x); pos += 2; }\n        else { ans.set(neg, x); neg += 2; }\n    }\n    return ans;\n}'
        },
        python: {
          title: 'Rearrange by Sign',
          desc: 'Rearrange positive and negative numbers alternately.',
          functionName: 'rearrange_by_sign',
          constraints: '2 <= len(arr) <= 10^5',
          testCases: [
            { input: '[3, 1, -2, -5, 2, -4]', expected: '3,-2,1,-5,2,-4' },
            { input: '[1, -1]', expected: '1,-1' }
          ],
          hints: ['Create an empty array and fill based on elements.'],
          bp: 'def rearrange_by_sign(arr: list) -> list:\n    # Write your code here\n    pass',
          sol: 'def rearrange_by_sign(arr):\n    ans = [0] * len(arr)\n    pos, neg = 0, 1\n    for x in arr:\n        if x > 0:\n            ans[pos] = x; pos += 2\n        else:\n            ans[neg] = x; neg += 2\n    return ans'
        },
        javascript: {
          title: 'Rearrange by Sign',
          desc: 'Rearrange positive and negative numbers alternately.',
          functionName: 'rearrangeBySign',
          constraints: '2 <= arr.length <= 10^5',
          testCases: [
            { input: '[3, 1, -2, -5, 2, -4]', expected: '3,-2,1,-5,2,-4' },
            { input: '[1, -1]', expected: '1,-1' }
          ],
          hints: ['Populate an array at even/odd increments.'],
          bp: 'function rearrangeBySign(arr) {\n    // Write your code here\n    \n}',
          sol: 'function rearrangeBySign(arr) {\n    let ans = new Array(arr.length);\n    let pos = 0, neg = 1;\n    for(let x of arr) {\n        if(x > 0) { ans[pos] = x; pos += 2; }\n        else { ans[neg] = x; neg += 2; }\n    }\n    return ans;\n}'
        }
      }
    },
    arr_cp10: {
      title: 'Buy and Sell Stock',
      subtitle: 'Maximize profit by buying and selling a stock once.',
      videoEmbedUrl: 'https://www.youtube.com/embed/excAOvwF_Wk?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Buy & Sell Stock',
          desc: 'Given array prices representing stock values per day, return the maximum profit. If no profit can be made, return 0.',
          functionName: 'maxProfit',
          constraints: '1 <= prices.size() <= 10^5',
          testCases: [
            { input: '[7, 1, 5, 3, 6, 4]', expected: '5' },
            { input: '[7, 6, 4, 3, 1]', expected: '0' }
          ],
          hints: ['Keep track of the minimum price seen so far.', 'On each day, calculate the potential profit and update the max profit.'],
          bp: '#include <vector>\nusing namespace std;\n\nint maxProfit(vector<int>& prices) {\n    // Write your code here\n    \n}',
          sol: 'int maxProfit(vector<int>& prices) {\n    int minPrice = 1e9, maxProf = 0;\n    for(int p : prices) {\n        minPrice = min(minPrice, p);\n        maxProf = max(maxProf, p - minPrice);\n    }\n    return maxProf;\n}'
        },
        java: {
          title: 'Buy & Sell Stock',
          desc: 'Find maximum profit by buying and selling once.',
          functionName: 'maxProfit',
          constraints: '1 <= prices.size() <= 10^5',
          testCases: [
            { input: 'java.util.Arrays.asList(7, 1, 5, 3, 6, 4)', expected: '5' },
            { input: 'java.util.Arrays.asList(7, 6, 4, 3, 1)', expected: '0' }
          ],
          hints: ['Update minPrice dynamically and compute profit.'],
          bp: 'import java.util.List;\n\npublic class Solution {\n    public static int maxProfit(List<Integer> prices) {\n        // Write your code here\n        return 0;\n    }\n}',
          sol: 'public static int maxProfit(List<Integer> prices) {\n    int minPrice = Integer.MAX_VALUE, maxProf = 0;\n    for(int p : prices) {\n        minPrice = Math.min(minPrice, p);\n        maxProf = Math.max(maxProf, p - minPrice);\n    }\n    return maxProf;\n}'
        },
        python: {
          title: 'Buy & Sell Stock',
          desc: 'Find maximum profit by buying and selling once.',
          functionName: 'max_profit',
          constraints: '1 <= len(prices) <= 10^5',
          testCases: [
            { input: '[7, 1, 5, 3, 6, 4]', expected: '5' },
            { input: '[7, 6, 4, 3, 1]', expected: '0' }
          ],
          hints: ['Initialize min_price to float("inf").'],
          bp: 'def max_profit(prices: list) -> int:\n    # Write your code here\n    pass',
          sol: 'def max_profit(prices):\n    min_price, max_prof = float("inf"), 0\n    for p in prices:\n        min_price = min(min_price, p)\n        max_prof = max(max_prof, p - min_price)\n    return max_prof'
        },
        javascript: {
          title: 'Buy & Sell Stock',
          desc: 'Find maximum profit by buying and selling once.',
          functionName: 'maxProfit',
          constraints: '1 <= prices.length <= 10^5',
          testCases: [
            { input: '[7, 1, 5, 3, 6, 4]', expected: '5' },
            { input: '[7, 6, 4, 3, 1]', expected: '0' }
          ],
          hints: ['Iterate and check buy/sell options.'],
          bp: 'function maxProfit(prices) {\n    // Write your code here\n    \n}',
          sol: 'function maxProfit(prices) {\n    let minPrice = Infinity, maxProf = 0;\n    for(let p of prices) {\n        minPrice = Math.min(minPrice, p);\n        maxProf = Math.max(maxProf, p - minPrice);\n    }\n    return maxProf;\n}'
        }
      }
    },
    arr_cp11: {
      title: 'Next Permutation',
      subtitle: 'Rearrange numbers into the lexicographically next greater permutation.',
      videoEmbedUrl: 'https://www.youtube.com/embed/JDOXKqF60RQ?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Next Permutation',
          desc: 'Rearrange numbers into the lexicographically next greater permutation. Change it in-place and return the modified array.',
          functionName: 'nextPermutation',
          constraints: '1 <= nums.size() <= 10^4',
          testCases: [
            { input: '[1, 2, 3]', expected: '1,3,2' },
            { input: '[3, 2, 1]', expected: '1,2,3' }
          ],
          hints: ['Find the breakpoint from the right (nums[i] < nums[i+1]).', 'Swap with the next larger element, then reverse the remaining elements.'],
          bp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvector<int> nextPermutation(vector<int>& nums) {\n    // Write your code here\n    \n}',
          sol: 'vector<int> nextPermutation(vector<int>& nums) {\n    int n = nums.size(), i = n - 2;\n    while(i >= 0 && nums[i] >= nums[i + 1]) i--;\n    if(i >= 0) {\n        int j = n - 1;\n        while(nums[j] <= nums[i]) j--;\n        swap(nums[i], nums[j]);\n    }\n    reverse(nums.begin() + i + 1, nums.end());\n    return nums;\n}'
        },
        java: {
          title: 'Next Permutation',
          desc: 'Generate next greater permutation in-place.',
          functionName: 'nextPermutation',
          constraints: '1 <= nums.size() <= 10^4',
          testCases: [
            { input: 'new java.util.ArrayList<>(java.util.Arrays.asList(1, 2, 3))', expected: '[1, 3, 2]' },
            { input: 'new java.util.ArrayList<>(java.util.Arrays.asList(3, 2, 1))', expected: '[1, 2, 3]' }
          ],
          hints: ['Trace indices backward, swap, and reverse.'],
          bp: 'import java.util.List;\n\npublic class Solution {\n    public static List<Integer> nextPermutation(List<Integer> nums) {\n        // Write your code here\n        return nums;\n    }\n}',
          sol: 'public static List<Integer> nextPermutation(List<Integer> nums) {\n    int n = nums.size(), i = n - 2;\n    while(i >= 0 && nums.get(i) >= nums.get(i + 1)) i--;\n    if(i >= 0) {\n        int j = n - 1;\n        while(nums.get(j) <= nums.get(i)) j--;\n        int temp = nums.get(i); nums.set(i, nums.get(j)); nums.set(j, temp);\n    }\n    int l = i + 1, r = n - 1;\n    while(l < r) {\n        int temp = nums.get(l); nums.set(l, nums.get(r)); nums.set(r, temp);\n        l++; r--;\n    }\n    return nums;\n}'
        },
        python: {
          title: 'Next Permutation',
          desc: 'Generate next greater permutation in-place.',
          functionName: 'next_permutation',
          constraints: '1 <= len(nums) <= 10^4',
          testCases: [
            { input: '[1, 2, 3]', expected: '1,3,2' },
            { input: '[3, 2, 1]', expected: '1,2,3' }
          ],
          hints: ['Find the pivot and replace.'],
          bp: 'def next_permutation(nums: list) -> list:\n    # Write your code here\n    pass',
          sol: 'def next_permutation(nums):\n    n = len(nums)\n    i = n - 2\n    while i >= 0 and nums[i] >= nums[i+1]: i -= 1\n    if i >= 0:\n        j = n - 1\n        while nums[j] <= nums[i]: j -= 1\n        nums[i], nums[j] = nums[j], nums[i]\n    nums[i+1:] = reversed(nums[i+1:])\n    return nums'
        },
        javascript: {
          title: 'Next Permutation',
          desc: 'Generate next greater permutation in-place.',
          functionName: 'nextPermutation',
          constraints: '1 <= nums.length <= 10^4',
          testCases: [
            { input: '[1, 2, 3]', expected: '1,3,2' },
            { input: '[3, 2, 1]', expected: '1,2,3' }
          ],
          hints: ['Follow next-permutation standard pivot algorithm.'],
          bp: 'function nextPermutation(nums) {\n    // Write your code here\n    \n}',
          sol: 'function nextPermutation(nums) {\n    let n = nums.length, i = n - 2;\n    while(i >= 0 && nums[i] >= nums[i + 1]) i--;\n    if(i >= 0) {\n        let j = n - 1;\n        while(nums[j] <= nums[i]) j--;\n        let temp = nums[i]; nums[i] = nums[j]; nums[j] = temp;\n    }\n    let l = i + 1, r = n - 1;\n    while(l < r) {\n        let temp = nums[l]; nums[l] = nums[r]; nums[r] = temp;\n        l++; r--;\n    }\n    return nums;\n}'
        }
      }
    },
    arr_cp12: {
      title: 'Leaders in an Array',
      subtitle: 'Identify all elements which are greater than all elements to their right.',
      videoEmbedUrl: 'https://www.youtube.com/embed/cHrH9CQ8pmY?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Leaders in an Array',
          desc: 'Find all leaders in the array. An element is a leader if it is greater than or equal to all elements to its right. Return leaders list in left-to-right order.',
          functionName: 'leaders',
          constraints: '1 <= arr.size() <= 10^5',
          testCases: [
            { input: '[16, 17, 4, 3, 5, 2]', expected: '17,5,2' },
            { input: '[1, 2, 3, 4, 0]', expected: '4,0' }
          ],
          hints: ['Scan the array from right to left.', 'Maintain a running maximum, and add elements matching or exceeding it.'],
          bp: '#include <vector>\nusing namespace std;\n\nvector<int> leaders(vector<int>& arr) {\n    // Write your code here\n    \n}',
          sol: 'vector<int> leaders(vector<int>& arr) {\n    vector<int> ans;\n    int n = arr.size(), maxi = -1e9;\n    for(int i = n - 1; i >= 0; i--) {\n        if(arr[i] >= maxi) { ans.push_back(arr[i]); maxi = arr[i]; }\n    }\n    reverse(ans.begin(), ans.end());\n    return ans;\n}'
        },
        java: {
          title: 'Leaders in an Array',
          desc: 'Find all leaders in the array (scanned from right to left).',
          functionName: 'leaders',
          constraints: '1 <= arr.size() <= 10^5',
          testCases: [
            { input: 'java.util.Arrays.asList(16, 17, 4, 3, 5, 2)', expected: '[17, 5, 2]' },
            { input: 'java.util.Arrays.asList(1, 2, 3, 4, 0)', expected: '[4, 0]' }
          ],
          hints: ['Iterate backwards and reverse the final list.'],
          bp: 'import java.util.List;\nimport java.util.ArrayList;\n\npublic class Solution {\n    public static List<Integer> leaders(List<Integer> arr) {\n        // Write your code here\n        return null;\n    }\n}',
          sol: 'public static List<Integer> leaders(List<Integer> arr) {\n    java.util.List<Integer> ans = new java.util.ArrayList<>();\n    int n = arr.size(), maxi = Integer.MIN_VALUE;\n    for(int i = n - 1; i >= 0; i--) {\n        if(arr.get(i) >= maxi) { ans.add(arr.get(i)); maxi = arr.get(i); }\n    }\n    java.util.Collections.reverse(ans);\n    return ans;\n}'
        },
        python: {
          title: 'Leaders in an Array',
          desc: 'Find all leaders in the array.',
          functionName: 'leaders_in_array',
          constraints: '1 <= len(arr) <= 10^5',
          testCases: [
            { input: '[16, 17, 4, 3, 5, 2]', expected: '17,5,2' },
            { input: '[1, 2, 3, 4, 0]', expected: '4,0' }
          ],
          hints: ['Start from index len(arr)-1 down to 0.'],
          bp: 'def leaders_in_array(arr: list) -> list:\n    # Write your code here\n    pass',
          sol: 'def leaders_in_array(arr):\n    ans = []\n    maxi = float("-inf")\n    for x in reversed(arr):\n        if x >= maxi:\n            ans.append(x); maxi = x\n    return ans[::-1]'
        },
        javascript: {
          title: 'Leaders in an Array',
          desc: 'Find all leaders in the array.',
          functionName: 'leaders',
          constraints: '1 <= arr.length <= 10^5',
          testCases: [
            { input: '[16, 17, 4, 3, 5, 2]', expected: '17,5,2' },
            { input: '[1, 2, 3, 4, 0]', expected: '4,0' }
          ],
          hints: ['Reverse traversal is the most optimal.'],
          bp: 'function leaders(arr) {\n    // Write your code here\n    \n}',
          sol: 'function leaders(arr) {\n    let ans = [];\n    let maxi = -Infinity;\n    for(let i = arr.length - 1; i >= 0; i--) {\n        if(arr[i] >= maxi) { ans.push(arr[i]); maxi = arr[i]; }\n    }\n    return ans.reverse();\n}'
        }
      }
    },
    arr_cp13: {
      title: 'Longest Consecutive Sequence',
      subtitle: 'Find the length of the longest consecutive elements sequence in O(N).',
      videoEmbedUrl: 'https://www.youtube.com/embed/oO5uLE7EUlM?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Longest Consecutive Sequence',
          desc: 'Given an unsorted array of integers, return the length of the longest consecutive elements sequence.',
          functionName: 'longestConsecutive',
          constraints: '0 <= arr.size() <= 10^5',
          testCases: [
            { input: '[100, 4, 200, 1, 3, 2]', expected: '4' },
            { input: '[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]', expected: '9' }
          ],
          hints: ['Put all elements in an unordered set.', 'For each element, check if x-1 is in the set. If not, x is the start of a sequence.'],
          bp: '#include <vector>\n#include <unordered_set>\nusing namespace std;\n\nint longestConsecutive(vector<int>& arr) {\n    // Write your code here\n    \n}',
          sol: '#include <unordered_set>\nint longestConsecutive(vector<int>& arr) {\n    unordered_set<int> s(arr.begin(), arr.end());\n    int maxLen = 0;\n    for(int x : arr) {\n        if(!s.count(x - 1)) {\n            int curr = x, len = 1;\n            while(s.count(curr + 1)) { curr++; len++; }\n            maxLen = max(maxLen, len);\n        }\n    }\n    return maxLen;\n}'
        },
        java: {
          title: 'Longest Consecutive Sequence',
          desc: 'Find the length of the longest consecutive elements sequence.',
          functionName: 'longestConsecutive',
          constraints: '0 <= arr.size() <= 10^5',
          testCases: [
            { input: 'java.util.Arrays.asList(100, 4, 200, 1, 3, 2)', expected: '4' },
            { input: 'java.util.Arrays.asList(0, 3, 7, 2, 5, 8, 4, 6, 0, 1)', expected: '9' }
          ],
          hints: ['Use HashSet for O(1) lookups.'],
          bp: 'import java.util.List;\nimport java.util.HashSet;\n\npublic class Solution {\n    public static int longestConsecutive(List<Integer> arr) {\n        // Write your code here\n        return 0;\n    }\n}',
          sol: 'public static int longestConsecutive(List<Integer> arr) {\n    java.util.Set<Integer> set = new java.util.HashSet<>(arr);\n    int maxLen = 0;\n    for(int x : arr) {\n        if(!set.contains(x - 1)) {\n            int curr = x, len = 1;\n            while(set.contains(curr + 1)) { curr++; len++; }\n            maxLen = Math.max(maxLen, len);\n        }\n    }\n    return maxLen;\n}'
        },
        python: {
          title: 'Longest Consecutive Sequence',
          desc: 'Find the length of the longest consecutive elements sequence.',
          functionName: 'longest_consecutive',
          constraints: '0 <= len(arr) <= 10^5',
          testCases: [
            { input: '[100, 4, 200, 1, 3, 2]', expected: '4' },
            { input: '[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]', expected: '9' }
          ],
          hints: ['Convert the list into a set.'],
          bp: 'def longest_consecutive(arr: list) -> int:\n    # Write your code here\n    pass',
          sol: 'def longest_consecutive(arr):\n    s = set(arr)\n    max_len = 0\n    for x in arr:\n        if (x - 1) not in s:\n            curr, len_val = x, 1\n            while (curr + 1) in s: curr += 1; len_val += 1\n            max_len = max(max_len, len_val)\n    return max_len'
        },
        javascript: {
          title: 'Longest Consecutive Sequence',
          desc: 'Find the length of the longest consecutive elements sequence.',
          functionName: 'longestConsecutive',
          constraints: '0 <= arr.length <= 10^5',
          testCases: [
            { input: '[100, 4, 200, 1, 3, 2]', expected: '4' },
            { input: '[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]', expected: '9' }
          ],
          hints: ['Store in Set and scan sequentially.'],
          bp: 'function longestConsecutive(arr) {\n    // Write your code here\n    \n}',
          sol: 'function longestConsecutive(arr) {\n    let s = new Set(arr);\n    let maxLen = 0;\n    for(let x of arr) {\n        if(!s.has(x - 1)) {\n            let curr = x, len = 1;\n            while(s.has(curr + 1)) { curr++; len++; }\n            maxLen = Math.max(maxLen, len);\n        }\n    }\n    return maxLen;\n}'
        }
      }
    },
    arr_cp14: {
      title: 'Set Matrix Zeroes',
      subtitle: 'Zero rows and columns containing zeros in-place with minimal space complexity.',
      videoEmbedUrl: 'https://www.youtube.com/embed/N0MgLvceX7M?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Set Matrix Zeroes',
          desc: 'Given an MxN matrix, if an element is 0, set its entire row and column to 0 in-place.',
          functionName: 'setZeroes',
          constraints: '1 <= matrix.size(), matrix[0].size() <= 200',
          testCases: [
            { input: '[[1,1,1],[1,0,1],[1,1,1]]', expected: '1,0,1,0,0,0,1,0,1' },
            { input: '[[0,1,2,0],[3,4,5,2],[1,3,1,5]]', expected: '0,0,0,0,0,4,5,0,0,3,1,0' }
          ],
          hints: ['Use the first row and first column as trackers/states.', 'Keep a boolean variable to track if the first row/column itself contains zero.'],
          bp: '#include <vector>\nusing namespace std;\n\nvector<vector<int>> setZeroes(vector<vector<int>>& matrix) {\n    // Write your code here\n    \n}',
          sol: 'vector<vector<int>> setZeroes(vector<vector<int>>& matrix) {\n    int n = matrix.size(), m = matrix[0].size();\n    bool col0 = false;\n    for(int i = 0; i < n; i++) {\n        if(matrix[i][0] == 0) col0 = true;\n        for(int j = 1; j < m; j++) {\n            if(matrix[i][j] == 0) { matrix[i][0] = 0; matrix[0][j] = 0; }\n        }\n    }\n    for(int i = n - 1; i >= 0; i--) {\n        for(int j = m - 1; j >= 1; j--) {\n            if(matrix[i][0] == 0 || matrix[0][j] == 0) matrix[i][j] = 0;\n        }\n        if(col0) matrix[i][0] = 0;\n    }\n    return matrix;\n}'
        },
        java: {
          title: 'Set Matrix Zeroes',
          desc: 'Set matrix rows/columns to 0 in-place.',
          functionName: 'setZeroes',
          constraints: '1 <= matrix.size(), matrix[0].size() <= 200',
          testCases: [
            { input: 'new java.util.ArrayList<>(java.util.Arrays.asList(new java.util.ArrayList<>(java.util.Arrays.asList(1,1,1)), new java.util.ArrayList<>(java.util.Arrays.asList(1,0,1)), new java.util.ArrayList<>(java.util.Arrays.asList(1,1,1))))', expected: '[[1, 0, 1], [0, 0, 0], [1, 0, 1]]' },
            { input: 'new java.util.ArrayList<>(java.util.Arrays.asList(new java.util.ArrayList<>(java.util.Arrays.asList(0,1,2,0)), new java.util.ArrayList<>(java.util.Arrays.asList(3,4,5,2)), new java.util.ArrayList<>(java.util.Arrays.asList(1,3,1,5))))', expected: '[[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]]' }
          ],
          hints: ['Use index 0 of row/col to mark zeros.'],
          bp: 'import java.util.List;\n\npublic class Solution {\n    public static List<List<Integer>> setZeroes(List<List<Integer>> matrix) {\n        // Write your code here\n        return matrix;\n    }\n}',
          sol: 'public static List<List<Integer>> setZeroes(List<List<Integer>> matrix) {\n    int n = matrix.size(), m = matrix.get(0).size();\n    boolean col0 = false;\n    for(int i = 0; i < n; i++) {\n        if(matrix.get(i).get(0) == 0) col0 = true;\n        for(int j = 1; j < m; j++) {\n            if(matrix.get(i).get(j) == 0) {\n                matrix.get(i).set(0, 0); matrix.get(0).set(j, 0);\n            }\n        }\n    }\n    for(int i = n - 1; i >= 0; i--) {\n        for(int j = m - 1; j >= 1; j--) {\n            if(matrix.get(i).get(0) == 0 || matrix.get(0).get(j) == 0) matrix.get(i).set(j, 0);\n        }\n        if(col0) matrix.get(i).set(0, 0);\n    }\n    return matrix;\n}'
        },
        python: {
          title: 'Set Matrix Zeroes',
          desc: 'Set matrix rows/columns to 0 in-place.',
          functionName: 'set_zeroes',
          constraints: '1 <= len(matrix), len(matrix[0]) <= 200',
          testCases: [
            { input: '[[1,1,1],[1,0,1],[1,1,1]]', expected: '[[1, 0, 1], [0, 0, 0], [1, 0, 1]]' },
            { input: '[[0,1,2,0],[3,4,5,2],[1,3,1,5]]', expected: '[[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]]' }
          ],
          hints: ['Iterate backwards during update to avoid overwriting trackers.'],
          bp: 'def set_zeroes(matrix: list) -> list:\n    # Write your code here\n    pass',
          sol: 'def set_zeroes(matrix):\n    n, m = len(matrix), len(matrix[0])\n    col0 = False\n    for i in range(n):\n        if matrix[i][0] == 0: col0 = True\n        for j in range(1, m):\n            if matrix[i][j] == 0: matrix[i][0] = matrix[0][j] = 0\n    for i in range(n - 1, -1, -1):\n        for j in range(m - 1, 0, -1):\n            if matrix[i][0] == 0 or matrix[0][j] == 0: matrix[i][j] = 0\n        if col0: matrix[i][0] = 0\n    return matrix'
        },
        javascript: {
          title: 'Set Matrix Zeroes',
          desc: 'Set matrix rows/columns to 0 in-place.',
          functionName: 'setZeroes',
          constraints: '1 <= matrix.length, matrix[0].length <= 200',
          testCases: [
            { input: '[[1,1,1],[1,0,1],[1,1,1]]', expected: '1,0,1,0,0,0,1,0,1' },
            { input: '[[0,1,2,0],[3,4,5,2],[1,3,1,5]]', expected: '0,0,0,0,0,4,5,0,0,3,1,0' }
          ],
          hints: ['Track zeros in a space-optimized way.'],
          bp: 'function setZeroes(matrix) {\n    // Write your code here\n    \n}',
          sol: 'function setZeroes(matrix) {\n    let n = matrix.length, m = matrix[0].length;\n    let col0 = false;\n    for(let i = 0; i < n; i++) {\n        if(matrix[i][0] === 0) col0 = true;\n        for(let j = 1; j < m; j++) {\n            if(matrix[i][j] === 0) { matrix[i][0] = 0; matrix[0][j] = 0; }\n        }\n    }\n    for(let i = n - 1; i >= 0; i--) {\n        for(let j = m - 1; j >= 1; j--) {\n            if(matrix[i][0] === 0 || matrix[0][j] === 0) matrix[i][j] = 0;\n        }\n        if(col0) matrix[i][0] = 0;\n    }\n    return matrix;\n}'
        }
      }
    },
    arr_cp15: {
      title: 'Rotate Matrix 90 Degrees',
      subtitle: 'Rotate an NxN matrix by 90 degrees clockwise in-place.',
      videoEmbedUrl: 'https://www.youtube.com/embed/Z0R2u6gd3GU?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Rotate Matrix 90 Degrees',
          desc: 'Rotate the given NxN matrix by 90 degrees clockwise in-place.',
          functionName: 'rotate',
          constraints: '1 <= matrix.size() <= 100',
          testCases: [
            { input: '[[1,2,3],[4,5,6],[7,8,9]]', expected: '7,4,1,8,5,2,9,6,3' },
            { input: '[[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]', expected: '15,13,2,5,14,3,4,1,12,6,8,9,16,7,10,11' }
          ],
          hints: ['Transpose the matrix (swap matrix[i][j] with matrix[j][i]).', 'Reverse each row in the transposed matrix.'],
          bp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvector<vector<int>> rotate(vector<vector<int>>& matrix) {\n    // Write your code here\n    \n}',
          sol: 'vector<vector<int>> rotate(vector<vector<int>>& matrix) {\n    int n = matrix.size();\n    for(int i = 0; i < n; i++) {\n        for(int j = i + 1; j < n; j++) swap(matrix[i][j], matrix[j][i]);\n    }\n    for(int i = 0; i < n; i++) reverse(matrix[i].begin(), matrix[i].end());\n    return matrix;\n}'
        },
        java: {
          title: 'Rotate Matrix 90 Degrees',
          desc: 'Rotate the matrix by 90 degrees clockwise.',
          functionName: 'rotate',
          constraints: '1 <= matrix.size() <= 100',
          testCases: [
            { input: 'new java.util.ArrayList<>(java.util.Arrays.asList(new java.util.ArrayList<>(java.util.Arrays.asList(1,2,3)), new java.util.ArrayList<>(java.util.Arrays.asList(4,5,6)), new java.util.ArrayList<>(java.util.Arrays.asList(7,8,9))))', expected: '[[7, 4, 1], [8, 5, 2], [9, 6, 3]]' }
          ],
          hints: ['Transpose then reverse each row.'],
          bp: 'import java.util.List;\n\npublic class Solution {\n    public static List<List<Integer>> rotate(List<List<Integer>> matrix) {\n        // Write your code here\n        return matrix;\n    }\n}',
          sol: 'public static List<List<Integer>> rotate(List<List<Integer>> matrix) {\n    int n = matrix.size();\n    for(int i = 0; i < n; i++) {\n        for(int j = i + 1; j < n; j++) {\n            int temp = matrix.get(i).get(j);\n            matrix.get(i).set(j, matrix.get(j).get(i));\n            matrix.get(j).set(i, temp);\n        }\n    }\n    for(int i = 0; i < n; i++) {\n        java.util.Collections.reverse(matrix.get(i));\n    }\n    return matrix;\n}'
        },
        python: {
          title: 'Rotate Matrix 90 Degrees',
          desc: 'Rotate the matrix by 90 degrees clockwise.',
          functionName: 'rotate_image',
          constraints: '1 <= len(matrix) <= 100',
          testCases: [
            { input: '[[1,2,3],[4,5,6],[7,8,9]]', expected: '[[7, 4, 1], [8, 5, 2], [9, 6, 3]]' }
          ],
          hints: ['Transpose then reverse rows.'],
          bp: 'def rotate_image(matrix: list) -> list:\n    # Write your code here\n    pass',
          sol: 'def rotate_image(matrix):\n    n = len(matrix)\n    for i in range(n):\n        for j in range(i + 1, n): matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]\n    for i in range(n): matrix[i].reverse()\n    return matrix'
        },
        javascript: {
          title: 'Rotate Matrix 90 Degrees',
          desc: 'Rotate the matrix by 90 degrees clockwise.',
          functionName: 'rotate',
          constraints: '1 <= matrix.length <= 100',
          testCases: [
            { input: '[[1,2,3],[4,5,6],[7,8,9]]', expected: '7,4,1,8,5,2,9,6,3' }
          ],
          hints: ['In-place matrix elements swapping.'],
          bp: 'function rotate(matrix) {\n    // Write your code here\n    \n}',
          sol: 'function rotate(matrix) {\n    let n = matrix.length;\n    for(let i = 0; i < n; i++) {\n        for(let j = i + 1; j < n; j++) {\n            let temp = matrix[i][j];\n            matrix[i][j] = matrix[j][i];\n            matrix[j][i] = temp;\n        }\n    }\n    for(let i = 0; i < n; i++) matrix[i].reverse();\n    return matrix;\n}'
        }
      }
    },
    arr_cp16: {
      title: 'Spiral Matrix Traversal',
      subtitle: 'Traverse an MxN matrix in spiral clockwise order.',
      videoEmbedUrl: 'https://www.youtube.com/embed/3Zv-s9UUrFM?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Spiral Matrix Traversal',
          desc: 'Return elements of an MxN matrix in spiral order.',
          functionName: 'spiralOrder',
          constraints: '1 <= matrix.size(), matrix[0].size() <= 100',
          testCases: [
            { input: '[[1,2,3],[4,5,6],[7,8,9]]', expected: '1,2,3,6,9,8,7,4,5' },
            { input: '[[1,2,3,4],[5,6,7,8],[9,10,11,12]]', expected: '1,2,3,4,8,12,11,10,9,5,6,7' }
          ],
          hints: ['Define four pointers: top, bottom, left, right.', 'Loop and traverse top row, right column, bottom row, and left column. Shift boundaries.'],
          bp: '#include <vector>\nusing namespace std;\n\nvector<int> spiralOrder(vector<vector<int>>& matrix) {\n    // Write your code here\n    \n}',
          sol: 'vector<int> spiralOrder(vector<vector<int>>& matrix) {\n    vector<int> ans;\n    int top = 0, bottom = matrix.size() - 1;\n    int left = 0, right = matrix[0].size() - 1;\n    while(top <= bottom && left <= right) {\n        for(int i = left; i <= right; i++) ans.push_back(matrix[top][i]);\n        top++;\n        for(int i = top; i <= bottom; i++) ans.push_back(matrix[i][right]);\n        right--;\n        if(top <= bottom) {\n            for(int i = right; i >= left; i--) ans.push_back(matrix[bottom][i]);\n            bottom--;\n        }\n        if(left <= right) {\n            for(int i = bottom; i >= top; i--) ans.push_back(matrix[i][left]);\n            left++;\n        }\n    }\n    return ans;\n}'
        },
        java: {
          title: 'Spiral Matrix Traversal',
          desc: 'Return elements in spiral order.',
          functionName: 'spiralOrder',
          constraints: '1 <= matrix.size(), matrix[0].size() <= 100',
          testCases: [
            { input: 'java.util.Arrays.asList(java.util.Arrays.asList(1,2,3), java.util.Arrays.asList(4,5,6), java.util.Arrays.asList(7,8,9))', expected: '[1, 2, 3, 6, 9, 8, 7, 4, 5]' }
          ],
          hints: ['Use four boundaries: top, bottom, left, right.'],
          bp: 'import java.util.List;\nimport java.util.ArrayList;\n\npublic class Solution {\n    public static List<Integer> spiralOrder(List<List<Integer>> matrix) {\n        // Write your code here\n        return null;\n    }\n}',
          sol: 'public static List<Integer> spiralOrder(List<List<Integer>> matrix) {\n    java.util.List<Integer> ans = new java.util.ArrayList<>();\n    int top = 0, bottom = matrix.size() - 1;\n    int left = 0, right = matrix.get(0).size() - 1;\n    while(top <= bottom && left <= right) {\n        for(int i = left; i <= right; i++) ans.add(matrix.get(top).get(i));\n        top++;\n        for(int i = top; i <= bottom; i++) ans.add(matrix.get(i).get(right));\n        right--;\n        if(top <= bottom) {\n            for(int i = right; i >= left; i--) ans.add(matrix.get(bottom).get(i));\n            bottom--;\n        }\n        if(left <= right) {\n            for(int i = bottom; i >= top; i--) ans.add(matrix.get(i).get(left));\n            left++;\n        }\n    }\n    return ans;\n}'
        },
        python: {
          title: 'Spiral Matrix Traversal',
          desc: 'Return elements in spiral order.',
          functionName: 'spiral_order',
          constraints: '1 <= len(matrix), len(matrix[0]) <= 100',
          testCases: [
            { input: '[[1,2,3],[4,5,6],[7,8,9]]', expected: '[1, 2, 3, 6, 9, 8, 7, 4, 5]' }
          ],
          hints: ['Loop boundaries correctly.'],
          bp: 'def spiral_order(matrix: list) -> list:\n    # Write your code here\n    pass',
          sol: 'def spiral_order(matrix):\n    ans = []\n    top, bottom = 0, len(matrix) - 1\n    left, right = 0, len(matrix[0]) - 1\n    while top <= bottom and left <= right:\n        for i in range(left, right + 1): ans.append(matrix[top][i])\n        top += 1\n        for i in range(top, bottom + 1): ans.append(matrix[i][right])\n        right -= 1\n        if top <= bottom:\n            for i in range(right, left - 1, -1): ans.append(matrix[bottom][i])\n            bottom -= 1\n        if left <= right:\n            for i in range(bottom, top - 1, -1): ans.append(matrix[i][left])\n            left += 1\n    return ans'
        },
        javascript: {
          title: 'Spiral Matrix Traversal',
          desc: 'Return elements in spiral order.',
          functionName: 'spiralOrder',
          constraints: '1 <= matrix.length, matrix[0].length <= 100',
          testCases: [
            { input: '[[1,2,3],[4,5,6],[7,8,9]]', expected: '1,2,3,6,9,8,7,4,5' }
          ],
          hints: ['Standard Top/Bottom/Left/Right pointer movements.'],
          bp: 'function spiralOrder(matrix) {\n    // Write your code here\n    \n}',
          sol: 'function spiralOrder(matrix) {\n    let ans = [];\n    let top = 0, bottom = matrix.length - 1;\n    let left = 0, right = matrix[0].length - 1;\n    while(top <= bottom && left <= right) {\n        for(let i = left; i <= right; i++) ans.push(matrix[top][i]);\n        top++;\n        for(let i = top; i <= bottom; i++) ans.push(matrix[i][right]);\n        right--;\n        if(top <= bottom) {\n            for(let i = right; i >= left; i--) ans.push(matrix[bottom][i]);\n            bottom--;\n        }\n        if(left <= right) {\n            for(let i = bottom; i >= top; i--) ans.push(matrix[i][left]);\n            left++;\n        }\n    }\n    return ans;\n}'
        }
      }
    },
    arr_cp17: {
      title: 'Subarray Sum Equals K',
      subtitle: 'Find total number of subarrays whose sum equals K.',
      videoEmbedUrl: 'https://www.youtube.com/embed/xvNwoz-ufXA?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Subarray Sum Equals K',
          desc: 'Given an array of integers and an integer k, return the total number of subarrays whose sum equals k.',
          functionName: 'subarraySum',
          constraints: '1 <= arr.size() <= 2 * 10^4',
          testCases: [
            { input: '[1, 1, 1], 2', expected: '2' },
            { input: '[1, 2, 3], 3', expected: '2' }
          ],
          hints: ['Use prefix sum and hash map.', 'Store sum frequencies in a map and lookup prefixSum - k.'],
          bp: '#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nint subarraySum(vector<int>& arr, int k) {\n    // Write your code here\n    \n}',
          sol: '#include <unordered_map>\nint subarraySum(vector<int>& arr, int k) {\n    unordered_map<int, int> mp;\n    mp[0] = 1;\n    int sum = 0, count = 0;\n    for(int x : arr) {\n        sum += x;\n        if(mp.count(sum - k)) count += mp[sum - k];\n        mp[sum]++;\n    }\n    return count;\n}'
        },
        java: {
          title: 'Subarray Sum Equals K',
          desc: 'Return count of subarrays whose sum equals k.',
          functionName: 'subarraySum',
          constraints: '1 <= arr.size() <= 2 * 10^4',
          testCases: [
            { input: 'java.util.Arrays.asList(1, 1, 1), 2', expected: '2' },
            { input: 'java.util.Arrays.asList(1, 2, 3), 3', expected: '2' }
          ],
          hints: ['Map prefix sums to counts.'],
          bp: 'import java.util.List;\nimport java.util.HashMap;\n\npublic class Solution {\n    public static int subarraySum(List<Integer> arr, int k) {\n        // Write your code here\n        return 0;\n    }\n}',
          sol: 'public static int subarraySum(List<Integer> arr, int k) {\n    java.util.Map<Integer, Integer> map = new java.util.HashMap<>();\n    map.put(0, 1);\n    int sum = 0, count = 0;\n    for(int x : arr) {\n        sum += x;\n        if(map.containsKey(sum - k)) count += map.get(sum - k);\n        map.put(sum, map.getOrDefault(sum, 0) + 1);\n    }\n    return count;\n}'
        },
        python: {
          title: 'Subarray Sum Equals K',
          desc: 'Return count of subarrays whose sum equals k.',
          functionName: 'subarray_sum',
          constraints: '1 <= len(arr) <= 2 * 10^4',
          testCases: [
            { input: '[1, 1, 1], 2', expected: '2' },
            { input: '[1, 2, 3], 3', expected: '2' }
          ],
          hints: ['Use python dict for prefix sums count.'],
          bp: 'def subarray_sum(arr: list, k: int) -> int:\n    # Write your code here\n    pass',
          sol: 'def subarray_sum(arr, k):\n    mp = {0: 1}\n    sum_val = count = 0\n    for x in arr:\n        sum_val += x\n        if (sum_val - k) in mp:\n            count += mp[sum_val - k]\n        mp[sum_val] = mp.get(sum_val, 0) + 1\n    return count'
        },
        javascript: {
          title: 'Subarray Sum Equals K',
          desc: 'Return count of subarrays whose sum equals k.',
          functionName: 'subarraySum',
          constraints: '1 <= arr.length <= 2 * 10^4',
          testCases: [
            { input: '[1, 1, 1], 2', expected: '2' },
            { input: '[1, 2, 3], 3', expected: '2' }
          ],
          hints: ['Track running sums using an object.'],
          bp: 'function subarraySum(arr, k) {\n    // Write your code here\n    \n}',
          sol: 'function subarraySum(arr, k) {\n    let mp = {0: 1};\n    let sum = 0, count = 0;\n    for(let x of arr) {\n        sum += x;\n        if((sum - k) in mp) count += mp[sum - k];\n        mp[sum] = (mp[sum] || 0) + 1;\n    }\n    return count;\n}'
        }
      }
    },
    arr_cp18: {
      title: 'Pascal\'s Triangle',
      subtitle: 'Generate the first N rows of Pascal\'s Triangle.',
      videoEmbedUrl: 'https://www.youtube.com/embed/bR7mQgwQ_o8?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Pascal\'s Triangle',
          desc: 'Given N, generate the first N rows of Pascal\'s Triangle as flat sequence.',
          functionName: 'generate',
          constraints: '1 <= N <= 20',
          testCases: [
            { input: '5', expected: '1,1,1,1,2,1,1,3,3,1,1,4,6,4,1' },
            { input: '1', expected: '1' }
          ],
          hints: ['Pascal\'s Triangle is formed by row[i][j] = row[i-1][j-1] + row[i-1][j].'],
          bp: '#include <vector>\nusing namespace std;\n\nvector<int> generate(int numRows) {\n    // Write your code here\n    \n}',
          sol: 'vector<int> generate(int numRows) {\n    vector<int> flat;\n    vector<vector<int>> ans;\n    for(int i = 0; i < numRows; i++) {\n        vector<int> row(i + 1, 1);\n        for(int j = 1; j < i; j++) row[j] = ans[i - 1][j - 1] + ans[i - 1][j];\n        ans.push_back(row);\n        flat.insert(flat.end(), row.begin(), row.end());\n    }\n    return flat;\n}'
        },
        java: {
          title: 'Pascal\'s Triangle',
          desc: 'Generate first N rows of Pascal\'s Triangle.',
          functionName: 'generate',
          constraints: '1 <= N <= 20',
          testCases: [
            { input: '5', expected: '[[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]]' }
          ],
          hints: ['Create dynamic row arrays.'],
          bp: 'import java.util.List;\nimport java.util.ArrayList;\n\npublic class Solution {\n    public static List<List<Integer>> generate(int numRows) {\n        // Write your code here\n        return null;\n    }\n}',
          sol: 'public static List<List<Integer>> generate(int numRows) {\n    java.util.List<java.util.List<Integer>> ans = new java.util.ArrayList<>();\n    for(int i = 0; i < numRows; i++) {\n        java.util.List<Integer> row = new java.util.ArrayList<>();\n        for(int j = 0; j <= i; j++) {\n            if(j == 0 || j == i) row.add(1);\n            else row.add(ans.get(i-1).get(j-1) + ans.get(i-1).get(j));\n        }\n        ans.add(row);\n    }\n    return ans;\n}'
        },
        python: {
          title: 'Pascal\'s Triangle',
          desc: 'Generate first N rows of Pascal\'s Triangle.',
          functionName: 'generate_pascal',
          constraints: '1 <= N <= 20',
          testCases: [
            { input: '5', expected: '[[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]]' }
          ],
          hints: ['Compute each cell based on previous row.'],
          bp: 'def generate_pascal(numRows: int) -> list:\n    # Write your code here\n    pass',
          sol: 'def generate_pascal(numRows):\n    ans = []\n    for i in range(numRows):\n        row = [1] * (i + 1)\n        for j in range(1, i):\n            row[j] = ans[i - 1][j - 1] + ans[i - 1][j]\n        ans.append(row)\n    return ans'
        },
        javascript: {
          title: 'Pascal\'s Triangle',
          desc: 'Generate first N rows of Pascal\'s Triangle.',
          functionName: 'generate',
          constraints: '1 <= N <= 20',
          testCases: [
            { input: '5', expected: '1,1,1,1,2,1,1,3,3,1,1,4,6,4,1' }
          ],
          hints: ['Row generation algorithm.'],
          bp: 'function generate(numRows) {\n    // Write your code here\n    \n}',
          sol: 'function generate(numRows) {\n    let ans = [];\n    let flat = [];\n    for(let i = 0; i < numRows; i++) {\n        let row = new Array(i + 1).fill(1);\n        for(let j = 1; j < i; j++) row[j] = ans[i - 1][j - 1] + ans[i - 1][j];\n        ans.push(row);\n        flat.push(...row);\n    }\n    return flat;\n}'
        }
      }
    },
    arr_cp19: {
      title: 'Majority Element II',
      subtitle: 'Find all elements that appear more than n/3 times in the array (Boyer-Moore Extension).',
      videoEmbedUrl: 'https://www.youtube.com/embed/vwZj1K0e9U8?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Majority Element II',
          desc: 'Given an integer array, return all elements that appear more than n/3 times. Return output as sorted array.',
          functionName: 'majorityElementTwo',
          constraints: '1 <= arr.size() <= 5 * 10^4',
          testCases: [
            { input: '[3, 2, 3]', expected: '3' },
            { input: '[1, 2]', expected: '1,2' }
          ],
          hints: ['Use the Boyer-Moore Voting Algorithm extended to two candidates.', 'Verify the two candidate counts in a second pass.'],
          bp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvector<int> majorityElementTwo(vector<int>& arr) {\n    // Write your code here\n    \n}',
          sol: 'vector<int> majorityElementTwo(vector<int>& arr) {\n    int num1 = -1e9, num2 = -1e9, c1 = 0, c2 = 0;\n    for(int x : arr) {\n        if(x == num1) c1++;\n        else if(x == num2) c2++;\n        else if(c1 == 0) { num1 = x; c1 = 1; }\n        else if(c2 == 0) { num2 = x; c2 = 1; }\n        else { c1--; c2--; }\n    }\n    c1 = 0; c2 = 0;\n    for(int x : arr) {\n        if(x == num1) c1++;\n        else if(x == num2) c2++;\n    }\n    vector<int> ans;\n    int limit = arr.size() / 3;\n    if(c1 > limit) ans.push_back(num1);\n    if(c2 > limit) ans.push_back(num2);\n    sort(ans.begin(), ans.end());\n    return ans;\n}'
        },
        java: {
          title: 'Majority Element II',
          desc: 'Find all elements that appear more than n/3 times.',
          functionName: 'majorityElementTwo',
          constraints: '1 <= arr.size() <= 5 * 10^4',
          testCases: [
            { input: 'java.util.Arrays.asList(3, 2, 3)', expected: '[3]' },
            { input: 'java.util.Arrays.asList(1, 2)', expected: '[1, 2]' }
          ],
          hints: ['Verify candidates using count loops.'],
          bp: 'import java.util.List;\nimport java.util.ArrayList;\n\npublic class Solution {\n    public static List<Integer> majorityElementTwo(List<Integer> arr) {\n        // Write your code here\n        return null;\n    }\n}',
          sol: 'public static List<Integer> majorityElementTwo(List<Integer> arr) {\n    int num1 = Integer.MIN_VALUE, num2 = Integer.MIN_VALUE, c1 = 0, c2 = 0;\n    for(int x : arr) {\n        if(x == num1) c1++;\n        else if(x == num2) c2++;\n        else if(c1 == 0) { num1 = x; c1 = 1; }\n        else if(c2 == 0) { num2 = x; c2 = 1; }\n        else { c1--; c2--; }\n    }\n    c1 = 0; c2 = 0;\n    for(int x : arr) {\n        if(x == num1) c1++;\n        else if(x == num2) c2++;\n    }\n    java.util.List<Integer> ans = new java.util.ArrayList<>();\n    int limit = arr.size() / 3;\n    if(c1 > limit) ans.add(num1);\n    if(c2 > limit) ans.add(num2);\n    java.util.Collections.sort(ans);\n    return ans;\n}'
        },
        python: {
          title: 'Majority Element II',
          desc: 'Find all elements that appear more than n/3 times.',
          functionName: 'majority_element_two',
          constraints: '1 <= len(arr) <= 5 * 10^4',
          testCases: [
            { input: '[3, 2, 3]', expected: '[3]' },
            { input: '[1, 2]', expected: '[1, 2]' }
          ],
          hints: ['Use Boyer-Moore Voting with two items.'],
          bp: 'def majority_element_two(arr: list) -> list:\n    # Write your code here\n    pass',
          sol: 'def majority_element_two(arr):\n    num1 = num2 = float("-inf")\n    c1 = c2 = 0\n    for x in arr:\n        if x == num1: c1 += 1\n        elif x == num2: c2 += 1\n        elif c1 == 0: num1, c1 = x, 1\n        elif c2 == 0: num2, c2 = x, 1\n        else: c1 -= 1; c2 -= 1\n    c1 = arr.count(num1)\n    c2 = arr.count(num2)\n    ans = []\n    limit = len(arr) // 3\n    if c1 > limit: ans.append(num1)\n    if c2 > limit: ans.append(num2)\n    return sorted(ans)'
        },
        javascript: {
          title: 'Majority Element II',
          desc: 'Find all elements that appear more than n/3 times.',
          functionName: 'majorityElementTwo',
          constraints: '1 <= arr.length <= 5 * 10^4',
          testCases: [
            { input: '[3, 2, 3]', expected: '3' },
            { input: '[1, 2]', expected: '1,2' }
          ],
          hints: ['Maintain two candidates.'],
          bp: 'function majorityElementTwo(arr) {\n    // Write your code here\n    \n}',
          sol: 'function majorityElementTwo(arr) {\n    let num1 = -Infinity, num2 = -Infinity, c1 = 0, c2 = 0;\n    for(let x of arr) {\n        if(x === num1) c1++;\n        else if(x === num2) c2++;\n        else if(c1 === 0) { num1 = x; c1 = 1; }\n        else if(c2 === 0) { num2 = x; c2 = 1; }\n        else { c1--; c2--; }\n    }\n    c1 = 0; c2 = 0;\n    for(let x of arr) {\n        if(x === num1) c1++;\n        else if(x === num2) c2++;\n    }\n    let ans = [];\n    let limit = Math.floor(arr.length / 3);\n    if(c1 > limit) ans.push(num1);\n    if(c2 > limit) ans.push(num2);\n    return ans.sort((a,b)=>a-b);\n}'
        }
      }
    },
    arr_cp20: {
      title: '3Sum',
      subtitle: 'Find all unique triplets that sum to 0 in O(N^2) time and O(1) extra space.',
      videoEmbedUrl: 'https://www.youtube.com/embed/DhFh8Kw7ymk?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: '3Sum',
          desc: 'Given an array, return all unique triplets [arr[i], arr[j], arr[k]] such that i != j != k and their sum is 0. Return output as a flat sorted elements sequence.',
          functionName: 'threeSum',
          constraints: '3 <= arr.size() <= 3000',
          testCases: [
            { input: '[-1, 0, 1, 2, -1, -4]', expected: '-1,-1,2,-1,0,1' },
            { input: '[0, 1, 1]', expected: '' }
          ],
          hints: ['Sort the array first.', 'Fix i, and use two pointers (left and right) to find pairs that sum to -arr[i]. Skip duplicates.'],
          bp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvector<int> threeSum(vector<int>& arr) {\n    // Write your code here\n    \n}',
          sol: 'vector<int> threeSum(vector<int>& arr) {\n    sort(arr.begin(), arr.end());\n    vector<int> flat;\n    int n = arr.size();\n    for(int i = 0; i < n; i++) {\n        if(i > 0 && arr[i] == arr[i - 1]) continue;\n        int j = i + 1, k = n - 1;\n        while(j < k) {\n            int sum = arr[i] + arr[j] + arr[k];\n            if(sum < 0) j++;\n            else if(sum > 0) k--;\n            else {\n                flat.push_back(arr[i]); flat.push_back(arr[j]); flat.push_back(arr[k]);\n                j++; k--;\n                while(j < k && arr[j] == arr[j - 1]) j++;\n                while(j < k && arr[k] == arr[k + 1]) k--;\n            }\n        }\n    }\n    return flat;\n}'
        },
        java: {
          title: '3Sum',
          desc: 'Find all unique triplets that sum to 0.',
          functionName: 'threeSum',
          constraints: '3 <= arr.size() <= 3000',
          testCases: [
            { input: 'java.util.Arrays.asList(-1, 0, 1, 2, -1, -4)', expected: '[[-1, -1, 2], [-1, 0, 1]]' }
          ],
          hints: ['Sort and use two pointers.'],
          bp: 'import java.util.List;\nimport java.util.ArrayList;\nimport java.util.Arrays;\n\npublic class Solution {\n    public static List<List<Integer>> threeSum(List<Integer> arr) {\n        // Write your code here\n        return null;\n    }\n}',
          sol: 'public static List<List<Integer>> threeSum(List<Integer> arr) {\n    java.util.Collections.sort(arr);\n    java.util.List<java.util.List<Integer>> ans = new java.util.ArrayList<>();\n    int n = arr.size();\n    for(int i = 0; i < n; i++) {\n        if(i > 0 && arr.get(i).equals(arr.get(i - 1))) continue;\n        int j = i + 1, k = n - 1;\n        while(j < k) {\n            int sum = arr.get(i) + arr.get(j) + arr.get(k);\n            if(sum < 0) j++;\n            else if(sum > 0) k--;\n            else {\n                ans.add(java.util.Arrays.asList(arr.get(i), arr.get(j), arr.get(k)));\n                j++; k--;\n                while(j < k && arr.get(j).equals(arr.get(j - 1))) j++;\n                while(j < k && arr.get(k).equals(arr.get(k + 1))) k--;\n            }\n        }\n    }\n    return ans;\n}'
        },
        python: {
          title: '3Sum',
          desc: 'Find all unique triplets that sum to 0.',
          functionName: 'three_sum',
          constraints: '3 <= len(arr) <= 3000',
          testCases: [
            { input: '[-1, 0, 1, 2, -1, -4]', expected: '[[-1, -1, 2], [-1, 0, 1]]' }
          ],
          hints: ['Sort and binary search twin pairs.'],
          bp: 'def three_sum(arr: list) -> list:\n    # Write your code here\n    pass',
          sol: 'def three_sum(arr):\n    arr.sort()\n    ans = []\n    n = len(arr)\n    for i in range(n):\n        if i > 0 and arr[i] == arr[i - 1]: continue\n        j, k = i + 1, n - 1\n        while j < k:\n            s = arr[i] + arr[j] + arr[k]\n            if s < 0: j += 1\n            elif s > 0: k -= 1\n            else:\n                ans.append([arr[i], arr[j], arr[k]])\n                j += 1; k -= 1\n                while j < k and arr[j] == arr[j - 1]: j += 1\n                while j < k and arr[k] == arr[k + 1]: k -= 1\n    return ans'
        },
        javascript: {
          title: '3Sum',
          desc: 'Find all unique triplets that sum to 0.',
          functionName: 'threeSum',
          constraints: '3 <= arr.length <= 3000',
          testCases: [
            { input: '[-1, 0, 1, 2, -1, -4]', expected: '-1,-1,2,-1,0,1' }
          ],
          hints: ['Apply two pointers after sorting.'],
          bp: 'function threeSum(arr) {\n    // Write your code here\n    \n}',
          sol: 'function threeSum(arr) {\n    arr.sort((a,b)=>a-b);\n    let flat = [];\n    let n = arr.length;\n    for(let i = 0; i < n; i++) {\n        if(i > 0 && arr[i] === arr[i - 1]) continue;\n        let j = i + 1, k = n - 1;\n        while(j < k) {\n            let sum = arr[i] + arr[j] + arr[k];\n            if(sum < 0) j++;\n            else if(sum > 0) k--;\n            else {\n                flat.push(arr[i], arr[j], arr[k]);\n                j++; k--;\n                while(j < k && arr[j] === arr[j - 1]) j++;\n                while(j < k && arr[k] === arr[k + 1]) k--;\n            }\n        }\n    }\n    return flat;\n}'
        }
      }
    },
    arr_cp21: {
      title: '4Sum',
      subtitle: 'Find all unique quadruplets that sum to target.',
      videoEmbedUrl: 'https://www.youtube.com/embed/eD95WRfh81c?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: '4Sum',
          desc: 'Given an array, return all unique quadruplets [arr[a], arr[b], arr[c], arr[d]] such that their sum is target. Return output as a flat sorted elements sequence.',
          functionName: 'fourSum',
          constraints: '4 <= arr.size() <= 200',
          testCases: [
            { input: '[1, 0, -1, 0, -2, 2], 0', expected: '-2,-1,1,2,-2,0,0,2,-1,0,0,1' }
          ],
          hints: ['Sort the array and run nested loops for the first two elements.', 'Use two pointers for the remaining two elements.'],
          bp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvector<int> fourSum(vector<int>& arr, int target) {\n    // Write your code here\n    \n}',
          sol: 'vector<int> fourSum(vector<int>& arr, int target) {\n    sort(arr.begin(), arr.end());\n    vector<int> flat;\n    int n = arr.size();\n    for(int i = 0; i < n; i++) {\n        if(i > 0 && arr[i] == arr[i - 1]) continue;\n        for(int j = i + 1; j < n; j++) {\n            if(j > i + 1 && arr[j] == arr[j - 1]) continue;\n            int k = j + 1, l = n - 1;\n            while(k < l) {\n                long long sum = (long long)arr[i] + arr[j] + arr[k] + arr[l];\n                if(sum < target) k++;\n                else if(sum > target) l--;\n                else {\n                    flat.push_back(arr[i]); flat.push_back(arr[j]);\n                    flat.push_back(arr[k]); flat.push_back(arr[l]);\n                    k++; l--;\n                    while(k < l && arr[k] == arr[k - 1]) k++;\n                    while(k < l && arr[l] == arr[l + 1]) l--;\n                }\n            }\n        }\n    }\n    return flat;\n}'
        },
        java: {
          title: '4Sum',
          desc: 'Find all unique quadruplets that sum to target.',
          functionName: 'fourSum',
          constraints: '4 <= arr.size() <= 200',
          testCases: [
            { input: 'java.util.Arrays.asList(1, 0, -1, 0, -2, 2), 0', expected: '[[-2, -1, 1, 2], [-2, 0, 0, 2], [-1, 0, 0, 1]]' }
          ],
          hints: ['Use nested loops with pointers.'],
          bp: 'import java.util.List;\nimport java.util.ArrayList;\nimport java.util.Arrays;\n\npublic class Solution {\n    public static List<List<Integer>> fourSum(List<Integer> arr, int target) {\n        // Write your code here\n        return null;\n    }\n}',
          sol: 'public static List<List<Integer>> fourSum(List<Integer> arr, int target) {\n    java.util.Collections.sort(arr);\n    java.util.List<java.util.List<Integer>> ans = new java.util.ArrayList<>();\n    int n = arr.size();\n    for(int i = 0; i < n; i++) {\n        if(i > 0 && arr.get(i).equals(arr.get(i - 1))) continue;\n        for(int j = i + 1; j < n; j++) {\n            if(j > i + 1 && arr.get(j).equals(arr.get(j - 1))) continue;\n            int k = j + 1, l = n - 1;\n            while(k < l) {\n                long sum = (long)arr.get(i) + arr.get(j) + arr.get(k) + arr.get(l);\n                if(sum < target) k++;\n                else if(sum > target) l--;\n                else {\n                    ans.add(java.util.Arrays.asList(arr.get(i), arr.get(j), arr.get(k), arr.get(l)));\n                    k++; l--;\n                    while(k < l && arr.get(k).equals(arr.get(k - 1))) k++;\n                    while(k < l && arr.get(l).equals(arr.get(l + 1))) l--;\n                }\n            }\n        }\n    }\n    return ans;\n}'
        },
        python: {
          title: '4Sum',
          desc: 'Find all unique quadruplets that sum to target.',
          functionName: 'four_sum',
          constraints: '4 <= len(arr) <= 200',
          testCases: [
            { input: '[1, 0, -1, 0, -2, 2], 0', expected: '[[-2, -1, 1, 2], [-2, 0, 0, 2], [-1, 0, 0, 1]]' }
          ],
          hints: ['Apply two pointer checks in a double loop.'],
          bp: 'def four_sum(arr: list, target: int) -> list:\n    # Write your code here\n    pass',
          sol: 'def four_sum(arr, target):\n    arr.sort()\n    ans = []\n    n = len(arr)\n    for i in range(n):\n        if i > 0 and arr[i] == arr[i - 1]: continue\n        for j in range(i + 1, n):\n            if j > i + 1 and arr[j] == arr[j - 1]: continue\n            k, l = j + 1, n - 1\n            while k < l:\n                s = arr[i] + arr[j] + arr[k] + arr[l]\n                if s < target: k += 1\n                elif s > target: l -= 1\n                else:\n                    ans.append([arr[i], arr[j], arr[k], arr[l]])\n                    k += 1; l -= 1\n                    while k < l and arr[k] == arr[k - 1]: k += 1\n                    while k < l and arr[l] == arr[l + 1]: l -= 1\n    return ans'
        },
        javascript: {
          title: '4Sum',
          desc: 'Find all unique quadruplets that sum to target.',
          functionName: 'fourSum',
          constraints: '4 <= arr.length <= 200',
          testCases: [
            { input: '[1, 0, -1, 0, -2, 2], 0', expected: '-2,-1,1,2,-2,0,0,2,-1,0,0,1' }
          ],
          hints: ['Double loops with two pointers.'],
          bp: 'function fourSum(arr, target) {\n    // Write your code here\n    \n}',
          sol: 'function fourSum(arr, target) {\n    arr.sort((a,b)=>a-b);\n    let flat = [];\n    let n = arr.length;\n    for(let i = 0; i < n; i++) {\n        if(i > 0 && arr[i] === arr[i - 1]) continue;\n        for(let j = i + 1; j < n; j++) {\n            if(j > i + 1 && arr[j] === arr[j - 1]) continue;\n            let k = j + 1, l = n - 1;\n            while(k < l) {\n                let sum = arr[i] + arr[j] + arr[k] + arr[l];\n                if(sum < target) k++;\n                else if(sum > target) l--;\n                else {\n                    flat.push(arr[i], arr[j], arr[k], arr[l]);\n                    k++; l--;\n                    while(k < l && arr[k] === arr[k - 1]) k++;\n                    while(k < l && arr[l] === arr[l + 1]) l--;\n                }\n            }\n        }\n    }\n    return flat;\n}'
        }
      }
    },
    arr_cp22: {
      title: 'Subarrays with XOR K',
      subtitle: 'Find total number of subarrays whose bitwise XOR sum equals K.',
      videoEmbedUrl: 'https://www.youtube.com/embed/eZr-6p0B7ME?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Subarrays with XOR K',
          desc: 'Given an array and an integer k, return the total number of subarrays whose bitwise XOR sum equals k.',
          functionName: 'subarraysWithXorK',
          constraints: '1 <= arr.size() <= 5 * 10^4',
          testCases: [
            { input: '[4, 2, 2, 6, 4], 6', expected: '4' },
            { input: '[5, 6, 7, 8, 9], 5', expected: '2' }
          ],
          hints: ['Use running XOR sum and hash map.', 'XOR sum matching is: xr ^ k. Look up this value in the map.'],
          bp: '#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nint subarraysWithXorK(vector<int>& arr, int k) {\n    // Write your code here\n    \n}',
          sol: '#include <unordered_map>\nint subarraysWithXorK(vector<int>& arr, int k) {\n    unordered_map<int, int> mp;\n    mp[0] = 1;\n    int xr = 0, count = 0;\n    for(int x : arr) {\n        xr ^= x;\n        if(mp.count(xr ^ k)) count += mp[xr ^ k];\n        mp[xr]++;\n    }\n    return count;\n}'
        },
        java: {
          title: 'Subarrays with XOR K',
          desc: 'Count of subarrays whose XOR sum equals k.',
          functionName: 'subarraysWithXorK',
          constraints: '1 <= arr.size() <= 5 * 10^4',
          testCases: [
            { input: 'java.util.Arrays.asList(4, 2, 2, 6, 4), 6', expected: '4' },
            { input: 'java.util.Arrays.asList(5, 6, 7, 8, 9), 5', expected: '2' }
          ],
          hints: ['Use HashMap to track XOR frequencies.'],
          bp: 'import java.util.List;\nimport java.util.HashMap;\n\npublic class Solution {\n    public static int subarraysWithXorK(List<Integer> arr, int k) {\n        // Write your code here\n        return 0;\n    }\n}',
          sol: 'public static int subarraysWithXorK(List<Integer> arr, int k) {\n    java.util.Map<Integer, Integer> map = new java.util.HashMap<>();\n    map.put(0, 1);\n    int xr = 0, count = 0;\n    for(int x : arr) {\n        xr ^= x;\n        if(map.containsKey(xr ^ k)) count += map.get(xr ^ k);\n        map.put(xr, map.getOrDefault(xr, 0) + 1);\n    }\n    return count;\n}'
        },
        python: {
          title: 'Subarrays with XOR K',
          desc: 'Count of subarrays whose XOR sum equals k.',
          functionName: 'subarrays_with_xor_k',
          constraints: '1 <= len(arr) <= 5 * 10^4',
          testCases: [
            { input: '[4, 2, 2, 6, 4], 6', expected: '4' },
            { input: '[5, 6, 7, 8, 9], 5', expected: '2' }
          ],
          hints: ['dict storing prefix XOR value counts.'],
          bp: 'def subarrays_with_xor_k(arr: list, k: int) -> int:\n    # Write your code here\n    pass',
          sol: 'def subarrays_with_xor_k(arr, k):\n    mp = {0: 1}\n    xr = count = 0\n    for x in arr:\n        xr ^= x\n        if (xr ^ k) in mp: count += mp[xr ^ k]\n        mp[xr] = mp.get(xr, 0) + 1\n    return count'
        },
        javascript: {
          title: 'Subarrays with XOR K',
          desc: 'Count of subarrays whose XOR sum equals k.',
          functionName: 'subarraysWithXorK',
          constraints: '1 <= arr.length <= 5 * 10^4',
          testCases: [
            { input: '[4, 2, 2, 6, 4], 6', expected: '4' }
          ],
          hints: ['Prefix XOR counting using hashmap.'],
          bp: 'function subarraysWithXorK(arr, k) {\n    // Write your code here\n    \n}',
          sol: 'function subarraysWithXorK(arr, k) {\n    let mp = {0: 1};\n    let xr = 0, count = 0;\n    for(let x of arr) {\n        xr ^= x;\n        if((xr ^ k) in mp) count += mp[xr ^ k];\n        mp[xr] = (mp[xr] || 0) + 1;\n    }\n    return count;\n}'
        }
      }
    },
    arr_cp23: {
      title: 'Merge Overlapping Intervals',
      subtitle: 'Merge overlapping intervals in O(N log N) time.',
      videoEmbedUrl: 'https://www.youtube.com/embed/IexN60k62jo?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Merge Intervals',
          desc: 'Given intervals [start, end], merge overlapping intervals and return output as a flat sequence.',
          functionName: 'mergeIntervals',
          constraints: '1 <= intervals.size() <= 10^4',
          testCases: [
            { input: '[[1,3],[2,6],[8,10],[15,18]]', expected: '1,6,8,10,15,18' },
            { input: '[[1,4],[4,5]]', expected: '1,5' }
          ],
          hints: ['Sort intervals by start time first.', 'Traverse and merge if current start <= previous end.'],
          bp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvector<int> mergeIntervals(vector<vector<int>>& intervals) {\n    // Write your code here\n    \n}',
          sol: 'vector<int> mergeIntervals(vector<vector<int>>& intervals) {\n    if(intervals.empty()) return {};\n    sort(intervals.begin(), intervals.end());\n    vector<vector<int>> merged;\n    merged.push_back(intervals[0]);\n    for(int i = 1; i < intervals.size(); i++) {\n        if(intervals[i][0] <= merged.back()[1]) {\n            merged.back()[1] = max(merged.back()[1], intervals[i][1]);\n        } else {\n            merged.push_back(intervals[i]);\n        }\n    }\n    vector<int> flat;\n    for(auto& v : merged) { flat.push_back(v[0]); flat.push_back(v[1]); }\n    return flat;\n}'
        },
        java: {
          title: 'Merge Intervals',
          desc: 'Merge overlapping intervals.',
          functionName: 'mergeIntervals',
          constraints: '1 <= intervals.size() <= 10^4',
          testCases: [
            { input: 'java.util.Arrays.asList(java.util.Arrays.asList(1,3), java.util.Arrays.asList(2,6), java.util.Arrays.asList(8,10), java.util.Arrays.asList(15,18))', expected: '[[1, 6], [8, 10], [15, 18]]' }
          ],
          hints: ['Sort by starts, then process.'],
          bp: 'import java.util.List;\nimport java.util.ArrayList;\nimport java.util.Collections;\n\npublic class Solution {\n    public static List<List<Integer>> mergeIntervals(List<List<Integer>> intervals) {\n        // Write your code here\n        return null;\n    }\n}',
          sol: 'public static List<List<Integer>> mergeIntervals(List<List<Integer>> intervals) {\n    if(intervals.isEmpty()) return intervals;\n    java.util.List<java.util.List<Integer>> copy = new java.util.ArrayList<>(intervals);\n    copy.sort((a,b)->a.get(0)-b.get(0));\n    java.util.List<java.util.List<Integer>> merged = new java.util.ArrayList<>();\n    merged.add(copy.get(0));\n    for(int i = 1; i < copy.size(); i++) {\n        java.util.List<Integer> curr = copy.get(i);\n        java.util.List<Integer> last = merged.get(merged.size() - 1);\n        if(curr.get(0) <= last.get(1)) {\n            last.set(1, Math.max(last.get(1), curr.get(1)));\n        } else {\n            merged.add(curr);\n        }\n    }\n    return merged;\n}'
        },
        python: {
          title: 'Merge Intervals',
          desc: 'Merge overlapping intervals.',
          functionName: 'merge_intervals',
          constraints: '1 <= len(intervals) <= 10^4',
          testCases: [
            { input: '[[1,3],[2,6],[8,10],[15,18]]', expected: '[[1, 6], [8, 10], [15, 18]]' }
          ],
          hints: ['Sort then merge in-place.'],
          bp: 'def merge_intervals(intervals: list) -> list:\n    # Write your code here\n    pass',
          sol: 'def merge_intervals(intervals):\n    if not intervals: return []\n    intervals.sort(key=lambda x: x[0])\n    merged = [intervals[0]]\n    for current in intervals[1:]:\n        last = merged[-1]\n        if current[0] <= last[1]:\n            last[1] = max(last[1], current[1])\n        else:\n            merged.append(current)\n    return merged'
        },
        javascript: {
          title: 'Merge Intervals',
          desc: 'Merge overlapping intervals.',
          functionName: 'mergeIntervals',
          constraints: '1 <= intervals.length <= 10^4',
          testCases: [
            { input: '[[1,3],[2,6],[8,10],[15,18]]', expected: '1,6,8,10,15,18' }
          ],
          hints: ['Sort by starts and merge.'],
          bp: 'function mergeIntervals(intervals) {\n    // Write your code here\n    \n}',
          sol: 'function mergeIntervals(intervals) {\n    if(intervals.length === 0) return [];\n    intervals.sort((a,b)=>a[0]-b[0]);\n    let merged = [intervals[0]];\n    for(let i = 1; i < intervals.length; i++) {\n        let current = intervals[i];\n        let last = merged[merged.length - 1];\n        if(current[0] <= last[1]) {\n            last[1] = Math.max(last[1], current[1]);\n        } else {\n            merged.push(current);\n        }\n    }\n    let flat = [];\n    for(let interval of merged) flat.push(interval[0], interval[1]);\n    return flat;\n}'
        }
      }
    },
    arr_cp24: {
      title: 'Merge Arrays In-Place',
      subtitle: 'Merge two sorted arrays in-place using O(1) extra space.',
      videoEmbedUrl: 'https://www.youtube.com/embed/n7uwj04E0I4?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Merge Sorted Arrays',
          desc: 'Given sorted arrays nums1 of size m+n (padded with 0s at the end) and nums2 of size n, merge nums2 into nums1 in-place.',
          functionName: 'merge',
          constraints: 'nums1.size() == m + n',
          testCases: [
            { input: '[1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3', expected: '1,2,2,3,5,6' },
            { input: '[1], 1, [], 0', expected: '1' }
          ],
          hints: ['Start merging from the back (indices m-1, n-1, and m+n-1).', 'Compare elements and place the larger one at the end of nums1.'],
          bp: '#include <vector>\nusing namespace std;\n\nvector<int> merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {\n    // Write your code here\n    \n}',
          sol: 'vector<int> merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {\n    int i = m - 1, j = n - 1, k = m + n - 1;\n    while(i >= 0 && j >= 0) {\n        if(nums1[i] > nums2[j]) { nums1[k] = nums1[i]; i--; } \n        else { nums1[k] = nums2[j]; j--; }\n        k--;\n    }\n    while(j >= 0) { nums1[k] = nums2[j]; j--; k--; }\n    return nums1;\n}'
        },
        java: {
          title: 'Merge Sorted Arrays',
          desc: 'Merge nums2 into nums1 in-place.',
          functionName: 'merge',
          constraints: 'nums1.size() == m + n',
          testCases: [
            { input: 'new java.util.ArrayList<>(java.util.Arrays.asList(1, 2, 3, 0, 0, 0)), 3, new java.util.ArrayList<>(java.util.Arrays.asList(2, 5, 6)), 3', expected: '[1, 2, 2, 3, 5, 6]' }
          ],
          hints: ['Compare and insert elements starting from the end.'],
          bp: 'import java.util.List;\n\npublic class Solution {\n    public static List<Integer> merge(List<Integer> nums1, int m, List<Integer> nums2, int n) {\n        // Write your code here\n        return nums1;\n    }\n}',
          sol: 'public static List<Integer> merge(List<Integer> nums1, int m, List<Integer> nums2, int n) {\n    int i = m - 1, j = n - 1, k = m + n - 1;\n    while(i >= 0 && j >= 0) {\n        if(nums1.get(i) > nums2.get(j)) { nums1.set(k, nums1.get(i)); i--; } \n        else { nums1.set(k, nums2.get(j)); j--; }\n        k--;\n    }\n    while(j >= 0) { nums1.set(k, nums2.get(j)); j--; k--; }\n    return nums1;\n}'
        },
        python: {
          title: 'Merge Sorted Arrays',
          desc: 'Merge nums2 into nums1 in-place.',
          functionName: 'merge_arrays',
          constraints: 'len(nums1) == m + n',
          testCases: [
            { input: '[1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3', expected: '[1, 2, 2, 3, 5, 6]' }
          ],
          hints: ['Fill backwards.'],
          bp: 'def merge_arrays(nums1: list, m: int, nums2: list, n: int) -> list:\n    # Write your code here\n    pass',
          sol: 'def merge_arrays(nums1, m, nums2, n):\n    i, j, k = m - 1, n - 1, m + n - 1\n    while i >= 0 and j >= 0:\n        if nums1[i] > nums2[j]:\n            nums1[k] = nums1[i]; i -= 1\n        else:\n            nums1[k] = nums2[j]; j -= 1\n        k -= 1\n    while j >= 0: nums1[k] = nums2[j]; j -= 1; k -= 1\n    return nums1'
        },
        javascript: {
          title: 'Merge Sorted Arrays',
          desc: 'Merge nums2 into nums1 in-place.',
          functionName: 'merge',
          constraints: 'nums1.length === m + n',
          testCases: [
            { input: '[1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3', expected: '1,2,2,3,5,6' }
          ],
          hints: ['Perform backwards merge.'],
          bp: 'function merge(nums1, m, nums2, n) {\n    // Write your code here\n    \n}',
          sol: 'function merge(nums1, m, nums2, n) {\n    let i = m - 1, j = n - 1, k = m + n - 1;\n    while(i >= 0 && j >= 0) {\n        if(nums1[i] > nums2[j]) { nums1[k] = nums1[i]; i--; } \n        else { nums1[k] = nums2[j]; j--; }\n        k--;\n    }\n    while(j >= 0) { nums1[k] = nums2[j]; j--; k--; }\n    return nums1;\n}'
        }
      }
    },
    arr_cp25: {
      title: 'Missing and Repeating',
      subtitle: 'Find the missing and repeating numbers in an array from 1 to N.',
      videoEmbedUrl: 'https://www.youtube.com/embed/2D0D8HE6uak?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Missing & Repeating',
          desc: 'Given array of size N containing numbers from 1 to N, one number is missing and one is repeated. Return them.',
          functionName: 'findMissingAndRepeating',
          constraints: '2 <= arr.size() <= 10^5',
          testCases: [
            { input: '[3, 1, 2, 5, 3]', expected: '3,4' },
            { input: '[1, 3, 3]', expected: '3,2' }
          ],
          hints: ['Use sum or math equations.', 'Let S = sum of elements, Sn = sum of first N numbers. Write S - Sn and S2 - S2n to solve.'],
          bp: '#include <vector>\nusing namespace std;\n\nvector<int> findMissingAndRepeating(vector<int>& arr) {\n    // Write your code here\n    \n}',
          sol: 'vector<int> findMissingAndRepeating(vector<int>& arr) {\n    long long n = arr.size();\n    long long Sn = (n * (n + 1)) / 2;\n    long long S2n = (n * (n + 1) * (2 * n + 1)) / 6;\n    long long S = 0, S2 = 0;\n    for(int x : arr) { S += x; S2 += (long long)x * x; }\n    long long val1 = S - Sn; // X - Y\n    long long val2 = S2 - S2n; // X^2 - Y^2\n    val2 = val2 / val1; // X + Y\n    long long x = (val1 + val2) / 2;\n    long long y = x - val1;\n    return {(int)x, (int)y};\n}'
        },
        java: {
          title: 'Missing & Repeating',
          desc: 'Find missing and repeating numbers in array of 1 to N.',
          functionName: 'findMissingAndRepeating',
          constraints: '2 <= arr.size() <= 10^5',
          testCases: [
            { input: 'java.util.Arrays.asList(3, 1, 2, 5, 3)', expected: '[3, 4]' }
          ],
          hints: ['Solve via linear equations using sum and sum of squares.'],
          bp: 'import java.util.List;\nimport java.util.ArrayList;\n\npublic class Solution {\n    public static List<Integer> findMissingAndRepeating(List<Integer> arr) {\n        // Write your code here\n        return null;\n    }\n}',
          sol: 'public static List<Integer> findMissingAndRepeating(List<Integer> arr) {\n    long n = arr.size();\n    long Sn = (n * (n + 1)) / 2;\n    long S2n = (n * (n + 1) * (2 * n + 1)) / 6;\n    long S = 0, S2 = 0;\n    for(int x : arr) { S += x; S2 += (long)x * x; }\n    long val1 = S - Sn; \n    long val2 = S2 - S2n; \n    val2 = val2 / val1; \n    long x = (val1 + val2) / 2;\n    long y = x - val1;\n    java.util.List<Integer> ans = new java.util.ArrayList<>();\n    ans.add((int)x); ans.add((int)y);\n    return ans;\n}'
        },
        python: {
          title: 'Missing & Repeating',
          desc: 'Find missing and repeating numbers.',
          functionName: 'find_missing_and_repeating',
          constraints: '2 <= len(arr) <= 10^5',
          testCases: [
            { input: '[3, 1, 2, 5, 3]', expected: '[3, 4]' }
          ],
          hints: ['Use sum equations logic.'],
          bp: 'def find_missing_and_repeating(arr: list) -> list:\n    # Write your code here\n    pass',
          sol: 'def find_missing_and_repeating(arr):\n    n = len(arr)\n    Sn = (n * (n + 1)) // 2\n    S2n = (n * (n + 1) * (2 * n + 1)) // 6\n    S = sum(arr)\n    S2 = sum(x*x for x in arr)\n    val1 = S - Sn\n    val2 = S2 - S2n\n    val2 = val2 // val1\n    x = (val1 + val2) // 2\n    y = x - val1\n    return [x, y]'
        },
        javascript: {
          title: 'Missing & Repeating',
          desc: 'Find missing and repeating numbers.',
          functionName: 'findMissingAndRepeating',
          constraints: '2 <= arr.length <= 10^5',
          testCases: [
            { input: '[3, 1, 2, 5, 3]', expected: '3,4' }
          ],
          hints: ['Use equations of sum and squares sum.'],
          bp: 'function findMissingAndRepeating(arr) {\n    // Write your code here\n    \n}',
          sol: 'function findMissingAndRepeating(arr) {\n    let n = arr.length;\n    let Sn = (n * (n + 1)) / 2;\n    let S2n = (n * (n + 1) * (2 * n + 1)) / 6;\n    let S = 0, S2 = 0;\n    for(let x of arr) { S += x; S2 += x * x; }\n    let val1 = S - Sn;\n    let val2 = (S2 - S2n) / val1;\n    let x = (val1 + val2) / 2;\n    let y = x - val1;\n    return [x, y];\n}'
        }
      }
    },
    arr_cp26: {
      title: 'Count Inversions',
      subtitle: 'Count inversions in an array in O(N log N) using Merge Sort.',
      videoEmbedUrl: 'https://www.youtube.com/embed/AseUmwVNaoY?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Count Inversions',
          desc: 'Given an array, return the number of inversions. An inversion is a pair i < j where arr[i] > arr[j].',
          functionName: 'countInversions',
          constraints: '1 <= arr.size() <= 10^5',
          testCases: [
            { input: '[2, 4, 1, 3, 5]', expected: '3' },
            { input: '[2, 3, 4, 5, 6]', expected: '0' }
          ],
          hints: ['Modify Merge Sort algorithm.', 'In merge step, if arr[i] > arr[j], count += (mid - i + 1).'],
          bp: '#include <vector>\nusing namespace std;\n\nint countInversions(vector<int>& arr) {\n    // Write your code here\n    \n}',
          sol: 'int merge(vector<int>& arr, int low, int mid, int high) {\n    vector<int> temp;\n    int left = low, right = mid + 1, cnt = 0;\n    while(left <= mid && right <= high) {\n        if(arr[left] <= arr[right]) { temp.push_back(arr[left]); left++; }\n        else { temp.push_back(arr[right]); cnt += (mid - left + 1); right++; }\n    }\n    while(left <= mid) { temp.push_back(arr[left]); left++; }\n    while(right <= high) { temp.push_back(arr[right]); right++; }\n    for(int i = low; i <= high; i++) arr[i] = temp[i - low];\n    return cnt;\n}\nint mergeSort(vector<int>& arr, int low, int high) {\n    int cnt = 0;\n    if(low >= high) return cnt;\n    int mid = (low + high) / 2;\n    cnt += mergeSort(arr, low, mid);\n    cnt += mergeSort(arr, mid + 1, high);\n    cnt += merge(arr, low, mid, high);\n    return cnt;\n}\nint countInversions(vector<int>& arr) {\n    return mergeSort(arr, 0, arr.size() - 1);\n}'
        },
        java: {
          title: 'Count Inversions',
          desc: 'Count inversions inside array using merge sort.',
          functionName: 'countInversions',
          constraints: '1 <= arr.size() <= 10^5',
          testCases: [
            { input: 'java.util.Arrays.asList(2, 4, 1, 3, 5)', expected: '3' }
          ],
          hints: ['Implement merge sort tracking inversion count.'],
          bp: 'import java.util.List;\n\npublic class Solution {\n    public static int countInversions(List<Integer> arr) {\n        // Write your code here\n        return 0;\n    }\n}',
          sol: 'static int merge(java.util.List<Integer> arr, int low, int mid, int high) {\n    java.util.List<Integer> temp = new java.util.ArrayList<>();\n    int left = low, right = mid + 1, cnt = 0;\n    while(left <= mid && right <= high) {\n        if(arr.get(left) <= arr.get(right)) { temp.add(arr.get(left)); left++; }\n        else { temp.add(arr.get(right)); cnt += (mid - left + 1); right++; }\n    }\n    while(left <= mid) { temp.add(arr.get(left)); left++; }\n    while(right <= high) { temp.add(arr.get(right)); right++; }\n    for(int i = low; i <= high; i++) arr.set(i, temp.get(i - low));\n    return cnt;\n}\nstatic int mergeSort(java.util.List<Integer> arr, int low, int high) {\n    int cnt = 0;\n    if(low >= high) return cnt;\n    int mid = (low + high) / 2;\n    cnt += mergeSort(arr, low, mid);\n    cnt += mergeSort(arr, mid + 1, high);\n    cnt += merge(arr, low, mid, high);\n    return cnt;\n}\npublic static int countInversions(List<Integer> arr) {\n    return mergeSort(arr, 0, arr.size() - 1);\n}'
        },
        python: {
          title: 'Count Inversions',
          desc: 'Count inversions inside array.',
          functionName: 'count_inversions',
          constraints: '1 <= len(arr) <= 10^5',
          testCases: [
            { input: '[2, 4, 1, 3, 5]', expected: '3' }
          ],
          hints: ['Implement merge sort logic.'],
          bp: 'def count_inversions(arr: list) -> int:\n    # Write your code here\n    pass',
          sol: 'def merge(arr, temp, low, mid, high):\n    left, right, k, cnt = low, mid + 1, low, 0\n    while left <= mid and right <= high:\n        if arr[left] <= arr[right]: temp[k] = arr[left]; left += 1\n        else: temp[k] = arr[right]; cnt += (mid - left + 1); right += 1\n        k += 1\n    while left <= mid: temp[k] = arr[left]; left += 1; k += 1\n    while right <= high: temp[k] = arr[right]; right += 1; k += 1\n    for i in range(low, high + 1): arr[i] = temp[i]\n    return cnt\ndef mergeSort(arr, temp, low, high):\n    cnt = 0\n    if low < high:\n        mid = (low + high) // 2\n        cnt += mergeSort(arr, temp, low, mid)\n        cnt += mergeSort(arr, temp, mid + 1, high)\n        cnt += merge(arr, temp, low, mid, high)\n    return cnt\ndef count_inversions(arr):\n    return mergeSort(arr, [0]*len(arr), 0, len(arr)-1)'
        },
        javascript: {
          title: 'Count Inversions',
          desc: 'Count inversions inside array.',
          functionName: 'countInversions',
          constraints: '1 <= arr.length <= 10^5',
          testCases: [
            { input: '[2, 4, 1, 3, 5]', expected: '3' }
          ],
          hints: ['Incorporate inversion counters into standard merge sort.'],
          bp: 'function countInversions(arr) {\n    // Write your code here\n    \n}',
          sol: 'function merge(arr, low, mid, high) {\n    let temp = [];\n    let left = low, right = mid + 1, cnt = 0;\n    while(left <= mid && right <= high) {\n        if(arr[left] <= arr[right]) { temp.push(arr[left]); left++; }\n        else { temp.push(arr[right]); cnt += (mid - left + 1); right++; }\n    }\n    while(left <= mid) { temp.push(arr[left]); left++; }\n    while(right <= high) { temp.push(arr[right]); right++; }\n    for(let i = low; i <= high; i++) arr[i] = temp[i - low];\n    return cnt;\n}\nfunction mergeSort(arr, low, high) {\n    let cnt = 0;\n    if(low >= high) return cnt;\n    let mid = Math.floor((low + high) / 2);\n    cnt += mergeSort(arr, low, mid);\n    cnt += mergeSort(arr, mid + 1, high);\n    cnt += merge(arr, low, mid, high);\n    return cnt;\n}\nfunction countInversions(arr) {\n    return mergeSort(arr, 0, arr.length - 1);\n}'
        }
      }
    },
    arr_cp27: {
      title: 'Reverse Pairs',
      subtitle: 'Count reverse pairs (i < j where arr[i] > 2 * arr[j]) in O(N log N).',
      videoEmbedUrl: 'https://www.youtube.com/embed/0e4bZaP3MDI?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Reverse Pairs',
          desc: 'Count reverse pairs in the array. A reverse pair is a pair i < j where arr[i] > 2 * arr[j].',
          functionName: 'reversePairs',
          constraints: '1 <= arr.size() <= 5 * 10^4',
          testCases: [
            { input: '[1, 3, 2, 3, 1]', expected: '2' },
            { input: '[2, 4, 3, 5, 1]', expected: '3' }
          ],
          hints: ['Use Merge Sort framework.', 'Before merging, count pairs: traverse left pointer, increment right pointer while arr[left] > 2 * arr[right].'],
          bp: '#include <vector>\nusing namespace std;\n\nint reversePairs(vector<int>& arr) {\n    // Write your code here\n    \n}',
          sol: 'int merge(vector<int>& arr, int low, int mid, int high) {\n    int cnt = 0, j = mid + 1;\n    for(int i = low; i <= mid; i++) {\n        while(j <= high && arr[i] > 2LL * arr[j]) j++;\n        cnt += (j - (mid + 1));\n    }\n    vector<int> temp;\n    int left = low, right = mid + 1;\n    while(left <= mid && right <= high) {\n        if(arr[left] <= arr[right]) { temp.push_back(arr[left]); left++; }\n        else { temp.push_back(arr[right]); right++; }\n    }\n    while(left <= mid) { temp.push_back(arr[left]); left++; }\n    while(right <= high) { temp.push_back(arr[right]); right++; }\n    for(int i = low; i <= high; i++) arr[i] = temp[i - low];\n    return cnt;\n}\nint mergeSort(vector<int>& arr, int low, int high) {\n    if(low >= high) return 0;\n    int mid = (low + high) / 2;\n    int cnt = mergeSort(arr, low, mid);\n    cnt += mergeSort(arr, mid + 1, high);\n    cnt += merge(arr, low, mid, high);\n    return cnt;\n}\nint reversePairs(vector<int>& arr) {\n    return mergeSort(arr, 0, arr.size() - 1);\n}'
        },
        java: {
          title: 'Reverse Pairs',
          desc: 'Count reverse pairs in the array.',
          functionName: 'reversePairs',
          constraints: '1 <= arr.size() <= 5 * 10^4',
          testCases: [
            { input: 'java.util.Arrays.asList(1, 3, 2, 3, 1)', expected: '2' }
          ],
          hints: ['Implement countPairs then merge.'],
          bp: 'import java.util.List;\n\npublic class Solution {\n    public static int reversePairs(List<Integer> arr) {\n        // Write your code here\n        return 0;\n    }\n}',
          sol: 'static int merge(java.util.List<Integer> arr, int low, int mid, int high) {\n    int cnt = 0, j = mid + 1;\n    for(int i = low; i <= mid; i++) {\n        while(j <= high && arr.get(i) > 2L * arr.get(j)) j++;\n        cnt += (j - (mid + 1));\n    }\n    java.util.List<Integer> temp = new java.util.ArrayList<>();\n    int left = low, right = mid + 1;\n    while(left <= mid && right <= high) {\n        if(arr.get(left) <= arr.get(right)) { temp.add(arr.get(left)); left++; }\n        else { temp.add(arr.get(right)); right++; }\n    }\n    while(left <= mid) { temp.add(arr.get(left)); left++; }\n    while(right <= high) { temp.add(arr.get(right)); right++; }\n    for(int i = low; i <= high; i++) arr.set(i, temp.get(i - low));\n    return cnt;\n}\nstatic int mergeSort(java.util.List<Integer> arr, int low, int high) {\n    if(low >= high) return 0;\n    int mid = (low + high) / 2;\n    int cnt = mergeSort(arr, low, mid);\n    cnt += mergeSort(arr, mid + 1, high);\n    cnt += merge(arr, low, mid, high);\n    return cnt;\n}\npublic static int reversePairs(List<Integer> arr) {\n    return mergeSort(arr, 0, arr.size() - 1);\n}'
        },
        python: {
          title: 'Reverse Pairs',
          desc: 'Count reverse pairs.',
          functionName: 'reverse_pairs',
          constraints: '1 <= len(arr) <= 5 * 10^4',
          testCases: [
            { input: '[1, 3, 2, 3, 1]', expected: '2' }
          ],
          hints: ['Implement count pairs prior to standard merging.'],
          bp: 'def reverse_pairs(arr: list) -> int:\n    # Write your code here\n    pass',
          sol: 'def merge(arr, low, mid, high):\n    cnt, j = 0, mid + 1\n    for i in range(low, mid + 1):\n        while j <= high and arr[i] > 2 * arr[j]: j += 1\n        cnt += (j - (mid + 1))\n    temp = []\n    left, right = low, mid + 1\n    while left <= mid and right <= high:\n        if arr[left] <= arr[right]: temp.append(arr[left]); left += 1\n        else: temp.append(arr[right]); right += 1\n    while left <= mid: temp.append(arr[left]); left += 1\n    while right <= high: temp.append(arr[right]); right += 1\n    for i in range(low, high + 1): arr[i] = temp[i - low]\n    return cnt\ndef mergeSort(arr, low, high):\n    if low >= high: return 0\n    mid = (low + high) // 2\n    cnt = mergeSort(arr, low, mid)\n    cnt += mergeSort(arr, mid + 1, high)\n    cnt += merge(arr, low, mid, high)\n    return cnt\ndef reverse_pairs(arr):\n    return mergeSort(arr, 0, len(arr) - 1)'
        },
        javascript: {
          title: 'Reverse Pairs',
          desc: 'Count reverse pairs.',
          functionName: 'reversePairs',
          constraints: '1 <= arr.length <= 5 * 10^4',
          testCases: [
            { input: '[1, 3, 2, 3, 1]', expected: '2' }
          ],
          hints: ['Scan right pointer while conditional holds.'],
          bp: 'function reversePairs(arr) {\n    // Write your code here\n    \n}',
          sol: 'function merge(arr, low, mid, high) {\n    let cnt = 0, j = mid + 1;\n    for(let i = low; i <= mid; i++) {\n        while(j <= high && arr[i] > 2 * arr[j]) j++;\n        cnt += (j - (mid + 1));\n    }\n    let temp = [];\n    let left = low, right = mid + 1;\n    while(left <= mid && right <= high) {\n        if(arr[left] <= arr[right]) { temp.push(arr[left]); left++; }\n        else { temp.push(arr[right]); right++; }\n    }\n    while(left <= mid) { temp.push(arr[left]); left++; }\n    while(right <= high) { temp.push(arr[right]); right++; }\n    for(let i = low; i <= high; i++) arr[i] = temp[i - low];\n    return cnt;\n}\nfunction mergeSort(arr, low, high) {\n    if(low >= high) return 0;\n    let mid = Math.floor((low + high) / 2);\n    let cnt = mergeSort(arr, low, mid);\n    cnt += mergeSort(arr, mid + 1, high);\n    cnt += merge(arr, low, mid, high);\n    return cnt;\n}\nfunction reversePairs(arr) {\n    return mergeSort(arr, 0, arr.length - 1);\n}'
        }
      }
    },
    arr_cp28: {
      title: 'Maximum Product Subarray',
      subtitle: 'Find the contiguous subarray within an array that has the largest product.',
      videoEmbedUrl: 'https://www.youtube.com/embed/hnswaLJvr6g?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Maximum Product Subarray',
          desc: 'Given an integer array, find a contiguous subarray that has the largest product and return the product.',
          functionName: 'maxProduct',
          constraints: '1 <= arr.size() <= 2 * 10^4, -10 <= arr[i] <= 10',
          testCases: [
            { input: '[2, 3, -2, 4]', expected: '6' },
            { input: '[-2, 0, -1]', expected: '0' }
          ],
          hints: ['Use prefix and suffix product traversal.', 'Track maximum product from left (prefix) and right (suffix). Reset to 1 if zero is encountered.'],
          bp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint maxProduct(vector<int>& arr) {\n    // Write your code here\n    \n}',
          sol: 'int maxProduct(vector<int>& arr) {\n    int n = arr.size();\n    double pre = 1, suff = 1, ans = -1e9;\n    for(int i = 0; i < n; i++) {\n        if(pre == 0) pre = 1;\n        if(suff == 0) suff = 1;\n        pre *= arr[i];\n        suff *= arr[n - i - 1];\n        ans = max(ans, max(pre, suff));\n    }\n    return (int)ans;\n}'
        },
        java: {
          title: 'Maximum Product Subarray',
          desc: 'Find the contiguous subarray with the largest product.',
          functionName: 'maxProduct',
          constraints: '1 <= arr.size() <= 2 * 10^4',
          testCases: [
            { input: 'java.util.Arrays.asList(2, 3, -2, 4)', expected: '6' },
            { input: 'java.util.Arrays.asList(-2, 0, -1)', expected: '0' }
          ],
          hints: ['Iterate from left to right, and right to left tracking products.'],
          bp: 'import java.util.List;\n\npublic class Solution {\n    public static int maxProduct(List<Integer> arr) {\n        // Write your code here\n        return 0;\n    }\n}',
          sol: 'public static int maxProduct(List<Integer> arr) {\n    int n = arr.size();\n    double pre = 1, suff = 1, ans = Integer.MIN_VALUE;\n    for(int i = 0; i < n; i++) {\n        if(pre == 0) pre = 1;\n        if(suff == 0) suff = 1;\n        pre *= arr.get(i);\n        suff *= arr.get(n - i - 1);\n        ans = Math.max(ans, Math.max(pre, suff));\n    }\n    return (int)ans;\n}'
        },
        python: {
          title: 'Maximum Product Subarray',
          desc: 'Find the contiguous subarray with the largest product.',
          functionName: 'max_product',
          constraints: '1 <= len(arr) <= 2 * 10^4',
          testCases: [
            { input: '[2, 3, -2, 4]', expected: '6' },
            { input: '[-2, 0, -1]', expected: '0' }
          ],
          hints: ['Reset suffix and prefix to 1 if zero is hit.'],
          bp: 'def max_product(arr: list) -> int:\n    # Write your code here\n    pass',
          sol: 'def max_product(arr):\n    n = len(arr)\n    pre = suff = 1\n    ans = float("-inf")\n    for i in range(n):\n        if pre == 0: pre = 1\n        if suff == 0: suff = 1\n        pre *= arr[i]\n        suff *= arr[n - i - 1]\n        ans = max(ans, pre, suff)\n    return int(ans)'
        },
        javascript: {
          title: 'Maximum Product Subarray',
          desc: 'Find the contiguous subarray with the largest product.',
          functionName: 'maxProduct',
          constraints: '1 <= arr.length <= 2 * 10^4',
          testCases: [
            { input: '[2, 3, -2, 4]', expected: '6' },
            { input: '[-2, 0, -1]', expected: '0' }
          ],
          hints: ['Follow prefix/suffix multiplication pattern.'],
          bp: 'function maxProduct(arr) {\n    // Write your code here\n    \n}',
          sol: 'function maxProduct(arr) {\n    let n = arr.length;\n    let pre = 1, suff = 1, ans = -Infinity;\n    for(let i = 0; i < n; i++) {\n        if(pre === 0) pre = 1;\n        if(suff === 0) suff = 1;\n        pre *= arr[i];\n        suff *= arr[n - i - 1];\n        ans = Math.max(ans, Math.max(pre, suff));\n    }\n    return ans;\n}'
        }
      }
    }
  };

  const cp = checkpoints[checkpointId];
  if (!cp) return null;

  const langChallenge = cp.challenges[language] || cp.challenges.cpp;
  const isLastCheckpoint = checkpointId === 'arr_cp28';

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
