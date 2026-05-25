// Stack & Queue Explorer Checkpoint Data (3 Checkpoints)
export const getStackQueueCheckpointContent = (checkpointId, lang = 'cpp') => {
  const language = (lang || 'cpp').toLowerCase() === 'js' ? 'javascript' : (lang || 'cpp').toLowerCase();

  const checkpoints = {
    sq_cp1: {
      title: 'Valid Parentheses',
      subtitle: 'Use a stack to validate parenthesis balance in a string.',
      videoEmbedUrl: 'https://www.youtube.com/embed/tqQ5fTamIN4?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Validate Bracket Balance',
          desc: 'Given a string s containing just the characters (, ), {, }, [ and ], determine if the input string is valid.',
          functionName: 'isValid',
          constraints: '1 <= s.length() <= 10^4',
          testCases: [
            { input: '"()[]{}"', expected: 'true' },
            { input: '"(]"', expected: 'false' }
          ],
          hints: ['Push opening brackets to stack.', 'For closing brackets, pop and verify if they match.'],
          bp: '#include <string>\n#include <stack>\nusing namespace std;\n\nbool isValid(string s) {\n    // Write your code here\n    \n}',
          sol: '#include <stack>\nbool isValid(string s) {\n    stack<char> st;\n    for(char c : s) {\n        if(c == \'(\' || c == \'{\' || c == \'[\') st.push(c);\n        else {\n            if(st.empty()) return false;\n            if(c == \')\' && st.top() != \'(\') return false;\n            if(c == \'}\' && st.top() != \'{\') return false;\n            if(c == \']\' && st.top() != \'[\') return false;\n            st.pop();\n        }\n    }\n    return st.empty();\n}'
        },
        java: {
          title: 'Validate Bracket Balance',
          desc: 'Given a string s containing just the characters (, ), {, }, [ and ], determine if the input string is valid.',
          functionName: 'isValid',
          constraints: '1 <= s.length() <= 10^4',
          testCases: [
            { input: '"()[]{}"', expected: 'true' },
            { input: '"(]"', expected: 'false' }
          ],
          hints: ['Use java.util.Stack.'],
          bp: 'import java.util.Stack;\n\npublic class Solution {\n    public static boolean isValid(String s) {\n        // Write your code here\n        return false;\n    }\n}',
          sol: 'public static boolean isValid(String s) {\n    java.util.Stack<Character> st = new java.util.Stack<>();\n    for(char c : s.toCharArray()) {\n        if(c == \'(\' || c == \'{\' || c == \'[\') st.push(c);\n        else {\n            if(st.isEmpty()) return false;\n            if(c == \')\' && st.peek() != \'(\') return false;\n            if(c == \'}\' && st.peek() != \'{\') return false;\n            if(c == \']\' && st.peek() != \'[\') return false;\n            st.pop();\n        }\n    }\n    return st.isEmpty();\n}'
        },
        python: {
          title: 'Validate Bracket Balance',
          desc: 'Given a string s containing just the characters (, ), {, }, [ and ], determine if the input string is valid.',
          functionName: 'is_valid',
          constraints: '1 <= len(s) <= 10^4',
          testCases: [
            { input: '"()[]{}"', expected: 'True' },
            { input: '"(]"', expected: 'False' }
          ],
          hints: ['Use list as stack.'],
          bp: 'def is_valid(s: str) -> bool:\n    # Write your code here\n    pass',
          sol: 'def is_valid(s):\n    st = []\n    mapping = {")": "(", "}": "{", "]": "["}\n    for c in s:\n        if c in mapping.values(): st.append(c)\n        elif c in mapping:\n            if not st or st.pop() != mapping[c]: return False\n    return len(st) == 0'
        },
        javascript: {
          title: 'Validate Bracket Balance',
          desc: 'Given a string s containing just the characters (, ), {, }, [ and ], determine if the input string is valid.',
          functionName: 'isValid',
          constraints: '1 <= s.length <= 10^4',
          testCases: [
            { input: '"()[]{}"', expected: 'true' },
            { input: '"(]"', expected: 'false' }
          ],
          hints: ['Push opening keys and match pops.'],
          bp: 'function isValid(s) {\n    // Write your code here\n    \n}',
          sol: 'function isValid(s) {\n    let st = [];\n    for(let c of s) {\n        if(c === \'(\' || c === \'{\' || c === \'[\') st.push(c);\n        else {\n            if(st.length === 0) return false;\n            let top = st.pop();\n            if(c === \')\' && top !== \'(\') return false;\n            if(c === \'}\' && top !== \'{\') return false;\n            if(c === \']\' && top !== \'[\') return false;\n        }\n    }\n    return st.length === 0;\n}'
        }
      }
    },
    sq_cp2: {
      title: 'Next Greater Element',
      subtitle: 'Use a stack to find the next greater element in O(N).',
      videoEmbedUrl: 'https://www.youtube.com/embed/N7m7yP8r8pY?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Next Greater Element',
          desc: 'Given an array, find the next greater element for each index. If none, return -1.',
          functionName: 'nextGreaterElement',
          constraints: '1 <= arr.size() <= 10^5',
          testCases: [
            { input: '[4, 5, 2, 25]', expected: '5,25,25,-1' },
            { input: '[13, 7, 6, 12]', expected: '-1,12,12,-1' }
          ],
          hints: ['Traverse from right to left.', 'Keep elements in stack. Pop elements <= current, stack top is next greater.'],
          bp: '#include <vector>\n#include <stack>\nusing namespace std;\n\nvector<int> nextGreaterElement(vector<int>& arr) {\n    // Write your code here\n    \n}',
          sol: '#include <stack>\nvector<int> nextGreaterElement(vector<int>& arr) {\n    int n = arr.size();\n    vector<int> ans(n, -1);\n    stack<int> st;\n    for(int i = n - 1; i >= 0; i--) {\n        while(!st.empty() && st.top() <= arr[i]) st.pop();\n        if(!st.empty()) ans[i] = st.top();\n        st.push(arr[i]);\n    }\n    return ans;\n}'
        },
        java: {
          title: 'Next Greater Element',
          desc: 'Given a list, find the next greater element for each index.',
          functionName: 'nextGreaterElement',
          constraints: '1 <= arr.size() <= 10^5',
          testCases: [
            { input: 'java.util.Arrays.asList(4, 5, 2, 25)', expected: '[5, 25, 25, -1]' },
            { input: 'java.util.Arrays.asList(13, 7, 6, 12)', expected: '[-1, 12, 12, -1]' }
          ],
          hints: ['Use a stack traversing backwards.'],
          bp: 'import java.util.List;\nimport java.util.ArrayList;\nimport java.util.Stack;\n\npublic class Solution {\n    public static List<Integer> nextGreaterElement(List<Integer> arr) {\n        // Write your code here\n        return null;\n    }\n}',
          sol: 'public static List<Integer> nextGreaterElement(List<Integer> arr) {\n    int n = arr.size();\n    java.util.List<Integer> ans = new java.util.ArrayList<>(java.util.Collections.nCopies(n, -1));\n    java.util.Stack<Integer> st = new java.util.Stack<>();\n    for(int i = n - 1; i >= 0; i--) {\n        while(!st.isEmpty() && st.peek() <= arr.get(i)) st.pop();\n        if(!st.isEmpty()) ans.set(i, st.peek());\n        st.push(arr.get(i));\n    }\n    return ans;\n}'
        },
        python: {
          title: 'Next Greater Element',
          desc: 'Given a list, find the next greater element for each index.',
          functionName: 'next_greater_element',
          constraints: '1 <= len(arr) <= 10^5',
          testCases: [
            { input: '[4, 5, 2, 25]', expected: '5,25,25,-1' },
            { input: '[13, 7, 6, 12]', expected: '-1,12,12,-1' }
          ],
          hints: ['Traverse backwards maintaining monotonic stack.'],
          bp: 'def next_greater_element(arr: list) -> list:\n    # Write your code here\n    pass',
          sol: 'def next_greater_element(arr):\n    n = len(arr)\n    ans = [-1] * n\n    st = []\n    for i in range(n - 1, -1, -1):\n        while st and st[-1] <= arr[i]: st.pop()\n        if st: ans[i] = st[-1]\n        st.append(arr[i])\n    return ans'
        },
        javascript: {
          title: 'Next Greater Element',
          desc: 'Given a list, find the next greater element for each index.',
          functionName: 'nextGreaterElement',
          constraints: '1 <= arr.length <= 10^5',
          testCases: [
            { input: '[4, 5, 2, 25]', expected: '5,25,25,-1' },
            { input: '[13, 7, 6, 12]', expected: '-1,12,12,-1' }
          ],
          hints: ['Build stack from right to left.'],
          bp: 'function nextGreaterElement(arr) {\n    // Write your code here\n    \n}',
          sol: 'function nextGreaterElement(arr) {\n    let n = arr.length;\n    let ans = new Array(n).fill(-1);\n    let st = [];\n    for(let i = n - 1; i >= 0; i--) {\n        while(st.length > 0 && st[st.length - 1] <= arr[i]) st.pop();\n        if(st.length > 0) ans[i] = st[st.length - 1];\n        st.push(arr[i]);\n    }\n    return ans;\n}'
        }
      }
    },
    sq_cp3: {
      title: 'Queue Sum',
      subtitle: 'Calculate the total sum of elements in a dynamic FIFO queue.',
      videoEmbedUrl: 'https://www.youtube.com/embed/m4N0e_fKxZc?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Queue Sum',
          desc: 'Given list elements, push them into a queue, dequeue them and return the sum.',
          functionName: 'queueSum',
          constraints: '1 <= arr.size() <= 10^4',
          testCases: [
            { input: '[1, 2, 3, 4]', expected: '10' },
            { input: '[100, 200]', expected: '300' }
          ],
          hints: ['Push elements into std::queue.', 'Iterate dequeuing and sum values.'],
          bp: '#include <vector>\n#include <queue>\nusing namespace std;\n\nint queueSum(vector<int>& arr) {\n    // Write your code here\n    \n}',
          sol: '#include <queue>\nint queueSum(vector<int>& arr) {\n    queue<int> q;\n    for(int x : arr) q.push(x);\n    int sum = 0;\n    while(!q.empty()) {\n        sum += q.front();\n        q.pop();\n    }\n    return sum;\n}'
        },
        java: {
          title: 'Queue Sum',
          desc: 'Given list elements, push them into a queue, dequeue them and return the sum.',
          functionName: 'queueSum',
          constraints: '1 <= arr.size() <= 10^4',
          testCases: [
            { input: 'java.util.Arrays.asList(1, 2, 3, 4)', expected: '10' },
            { input: 'java.util.Arrays.asList(100, 200)', expected: '300' }
          ],
          hints: ['Use java.util.LinkedList as Queue.'],
          bp: 'import java.util.List;\nimport java.util.Queue;\nimport java.util.LinkedList;\n\npublic class Solution {\n    public static int queueSum(List<Integer> arr) {\n        // Write your code here\n        return 0;\n    }\n}',
          sol: 'public static int queueSum(List<Integer> arr) {\n    java.util.Queue<Integer> q = new java.util.LinkedList<>();\n    for(int x : arr) q.add(x);\n    int sum = 0;\n    while(!q.isEmpty()) {\n        sum += q.poll();\n    }\n    return sum;\n}'
        },
        python: {
          title: 'Queue Sum',
          desc: 'Given list elements, push them into a queue, dequeue them and return the sum.',
          functionName: 'queue_sum',
          constraints: '1 <= len(arr) <= 10^4',
          testCases: [
            { input: '[1, 2, 3, 4]', expected: '10' },
            { input: '[100, 200]', expected: '300' }
          ],
          hints: ['Use collections.deque as queue.'],
          bp: 'def queue_sum(arr: list) -> int:\n    # Write your code here\n    pass',
          sol: 'from collections import deque\ndef queue_sum(arr):\n    q = deque(arr)\n    s = 0\n    while q:\n        s += q.popleft()\n    return s'
        },
        javascript: {
          title: 'Queue Sum',
          desc: 'Given list elements, push them into a queue, dequeue them and return the sum.',
          functionName: 'queueSum',
          constraints: '1 <= arr.length <= 10^4',
          testCases: [
            { input: '[1, 2, 3, 4]', expected: '10' },
            { input: '[100, 200]', expected: '300' }
          ],
          hints: ['Use array shift() for FIFO dequeue.'],
          bp: 'function queueSum(arr) {\n    // Write your code here\n    \n}',
          sol: 'function queueSum(arr) {\n    let q = [...arr];\n    let sum = 0;\n    while(q.length > 0) {\n        sum += q.shift();\n    }\n    return sum;\n}'
        }
      }
    }
  };

  const cp = checkpoints[checkpointId];
  if (!cp) return null;

  const langChallenge = cp.challenges[language] || cp.challenges.cpp;
  const isLastCheckpoint = checkpointId === 'sq_cp3';

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
