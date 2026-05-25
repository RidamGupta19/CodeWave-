// Recursion Explorer Checkpoint Data (3 Checkpoints)
export const getRecursionCheckpointContent = (checkpointId, lang = 'cpp') => {
  const language = (lang || 'cpp').toLowerCase() === 'js' ? 'javascript' : (lang || 'cpp').toLowerCase();

  const checkpoints = {
    rec_cp1: {
      title: 'Sum of N Numbers',
      subtitle: 'Calculate the sum of first N natural numbers recursively.',
      videoEmbedUrl: 'https://www.youtube.com/embed/yVdKa8dnKiE?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Recursive Sum',
          desc: 'Write a recursive function sumOfN(n) that returns the sum of first n natural numbers.',
          functionName: 'sumOfN',
          constraints: '1 <= n <= 100',
          testCases: [
            { input: '5', expected: '15' },
            { input: '10', expected: '55' }
          ],
          hints: ['Base case: if n == 1 return 1.', 'Recursive case: return n + sumOfN(n - 1).'],
          bp: 'int sumOfN(int n) {\n    // Write your recursive code here\n    \n}',
          sol: 'int sumOfN(int n) {\n    if(n <= 1) return n;\n    return n + sumOfN(n - 1);\n}'
        },
        java: {
          title: 'Recursive Sum',
          desc: 'Write a recursive function sumOfN(n) that returns the sum of first n natural numbers.',
          functionName: 'sumOfN',
          constraints: '1 <= n <= 100',
          testCases: [
            { input: '5', expected: '15' },
            { input: '10', expected: '55' }
          ],
          hints: ['Define base case n <= 1 return n.'],
          bp: 'public class Solution {\n    public static int sumOfN(int n) {\n        // Write your recursive code here\n        return 0;\n    }\n}',
          sol: 'public static int sumOfN(int n) {\n    if(n <= 1) return n;\n    return n + sumOfN(n - 1);\n}'
        },
        python: {
          title: 'Recursive Sum',
          desc: 'Write a recursive function sum_of_n(n) that returns the sum of first n natural numbers.',
          functionName: 'sum_of_n',
          constraints: '1 <= n <= 100',
          testCases: [
            { input: '5', expected: '15' },
            { input: '10', expected: '55' }
          ],
          hints: ['Use recursive accumulator.'],
          bp: 'def sum_of_n(n: int) -> int:\n    # Write your recursive code here\n    pass',
          sol: 'def sum_of_n(n):\n    if n <= 1: return n\n    return n + sum_of_n(n - 1)'
        },
        javascript: {
          title: 'Recursive Sum',
          desc: 'Write a recursive function sumOfN(n) that returns the sum of first n natural numbers.',
          functionName: 'sumOfN',
          constraints: '1 <= n <= 100',
          testCases: [
            { input: '5', expected: '15' },
            { input: '10', expected: '55' }
          ],
          hints: ['Implement the base case and recurrence relation.'],
          bp: 'function sumOfN(n) {\n    // Write your recursive code here\n    \n}',
          sol: 'function sumOfN(n) {\n    if(n <= 1) return n;\n    return n + sumOfN(n - 1);\n}'
        }
      }
    },
    rec_cp2: {
      title: 'Reverse String',
      subtitle: 'Reverse a string recursively.',
      videoEmbedUrl: 'https://www.youtube.com/embed/92Z4_N0Uew0?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Recursive Reverse',
          desc: 'Write a recursive function reverseString(s) that returns the reversed string.',
          functionName: 'reverseString',
          constraints: '1 <= s.length() <= 100',
          testCases: [
            { input: '"hello"', expected: 'olleh' },
            { input: '"dsa"', expected: 'asd' }
          ],
          hints: ['Base case: if string is empty or size 1, return it.', 'Recursive case: return last character + reverseString(substring).'],
          bp: '#include <string>\nusing namespace std;\n\nstring reverseString(string s) {\n    // Write your recursive code here\n    \n}',
          sol: 'string reverseString(string s) {\n    if(s.length() <= 1) return s;\n    return s.back() + reverseString(s.substr(0, s.length() - 1));\n}'
        },
        java: {
          title: 'Recursive Reverse',
          desc: 'Write a recursive function reverseString(s) that returns the reversed string.',
          functionName: 'reverseString',
          constraints: '1 <= s.length() <= 100',
          testCases: [
            { input: '"hello"', expected: 'olleh' },
            { input: '"dsa"', expected: 'asd' }
          ],
          hints: ['Use string slicing or charAt.'],
          bp: 'public class Solution {\n    public static String reverseString(String s) {\n        // Write your recursive code here\n        return "";\n    }\n}',
          sol: 'public static String reverseString(String s) {\n    if(s.length() <= 1) return s;\n    return s.substring(s.length() - 1) + reverseString(s.substring(0, s.length() - 1));\n}'
        },
        python: {
          title: 'Recursive Reverse',
          desc: 'Write a recursive function reverse_string(s) that returns the reversed string.',
          functionName: 'reverse_string',
          constraints: '1 <= len(s) <= 100',
          testCases: [
            { input: '"hello"', expected: 'olleh' },
            { input: '"dsa"', expected: 'asd' }
          ],
          hints: ['Slice the string dynamically.'],
          bp: 'def reverse_string(s: str) -> str:\n    # Write your recursive code here\n    pass',
          sol: 'def reverse_string(s):\n    if len(s) <= 1: return s\n    return s[-1] + reverse_string(s[:-1])'
        },
        javascript: {
          title: 'Recursive Reverse',
          desc: 'Write a recursive function reverseString(s) that returns the reversed string.',
          functionName: 'reverseString',
          constraints: '1 <= s.length <= 100',
          testCases: [
            { input: '"hello"', expected: 'olleh' },
            { input: '"dsa"', expected: 'asd' }
          ],
          hints: ['Use recursion with substring.'],
          bp: 'function reverseString(s) {\n    // Write your recursive code here\n    \n}',
          sol: 'function reverseString(s) {\n    if(s.length <= 1) return s;\n    return s[s.length - 1] + reverseString(s.substring(0, s.length - 1));\n}'
        }
      }
    },
    rec_cp3: {
      title: 'Power Recursive',
      subtitle: 'Calculate base raised to exponent power recursively.',
      videoEmbedUrl: 'https://www.youtube.com/embed/kvRjFhrYpiA?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Recursive Power',
          desc: 'Write a recursive function power(base, exp) that calculates base^exp.',
          functionName: 'power',
          constraints: '1 <= base <= 10, 0 <= exp <= 10',
          testCases: [
            { input: '2, 3', expected: '8' },
            { input: '5, 0', expected: '1' }
          ],
          hints: ['Base case: if exp == 0 return 1.', 'Recursive case: return base * power(base, exp - 1).'],
          bp: 'int power(int base, int exp) {\n    // Write your recursive code here\n    \n}',
          sol: 'int power(int base, int exp) {\n    if(exp == 0) return 1;\n    return base * power(base, exp - 1);\n}'
        },
        java: {
          title: 'Recursive Power',
          desc: 'Write a recursive function power(base, exp) that calculates base^exp.',
          functionName: 'power',
          constraints: '1 <= base <= 10, 0 <= exp <= 10',
          testCases: [
            { input: '2, 3', expected: '8' },
            { input: '5, 0', expected: '1' }
          ],
          hints: ['Implement exponent recursion.'],
          bp: 'public class Solution {\n    public static int power(int base, int exp) {\n        // Write your recursive code here\n        return 0;\n    }\n}',
          sol: 'public static int power(int base, int exp) {\n    if(exp == 0) return 1;\n    return base * power(base, exp - 1);\n}'
        },
        python: {
          title: 'Recursive Power',
          desc: 'Write a recursive function power(base, exp) that calculates base^exp.',
          functionName: 'power',
          constraints: '1 <= base <= 10, 0 <= exp <= 10',
          testCases: [
            { input: '2, 3', expected: '8' },
            { input: '5, 0', expected: '1' }
          ],
          hints: ['Return 1 when exponent is 0.'],
          bp: 'def power(base: int, exp: int) -> int:\n    # Write your recursive code here\n    pass',
          sol: 'def power(base, exp):\n    if exp == 0: return 1\n    return base * power(base, exp - 1)'
        },
        javascript: {
          title: 'Recursive Power',
          desc: 'Write a recursive function power(base, exp) that calculates base^exp.',
          functionName: 'power',
          constraints: '1 <= base <= 10, 0 <= exp <= 10',
          testCases: [
            { input: '2, 3', expected: '8' },
            { input: '5, 0', expected: '1' }
          ],
          hints: ['Multiply base with base^(exp-1).'],
          bp: 'function power(base, exp) {\n    // Write your recursive code here\n    \n}',
          sol: 'function power(base, exp) {\n    if(exp === 0) return 1;\n    return base * power(base, exp - 1);\n}'
        }
      }
    }
  };

  const cp = checkpoints[checkpointId];
  if (!cp) return null;

  const langChallenge = cp.challenges[language] || cp.challenges.cpp;
  const isLastCheckpoint = checkpointId === 'rec_cp3';

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
