import { getArraysCheckpointContent } from './arraysContent';
import { getHashingCheckpointContent } from './hashingContent';
import { getRecursionCheckpointContent } from './recursionContent';
import { getLinkedListCheckpointContent } from './linkedListContent';
import { getStackQueueCheckpointContent } from './stackQueueContent';
import { getTreesCheckpointContent } from './treesContent';
import { getGraphCheckpointContent } from './graphContent';
import { getDpCheckpointContent } from './dpContent';
import { getGreedyCheckpointContent } from './greedyContent';

// DSA Content Engine - Striver A2Z Aligned with 4 Unlockable Difficulty Levels per Topic
// Boilerplates are strictly minimal starters (only imports + class/function signatures) - NO solutions/loops prefilled.

export const getDsaLanguageContent = (topicTitle, languageKey = 'cpp', difficulty = 'beginner', useStriverAdvanced = false, dbYoutubeLink = '') => {
  const t = (topicTitle || '').toLowerCase();
  const lang = (languageKey || 'cpp').toLowerCase() === 'js' ? 'javascript' : (languageKey || 'cpp').toLowerCase();
  const diff = (difficulty || 'beginner').toLowerCase();

  // â”€â”€â”€ LOVE BABBAR VIDEO MAPS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const babbarCppVideos = {
    overview:      'WQoB2z67hvY', // Course Overview
    basics:        'Pg3Z5Yps5pI', // Flowcharts
    first_program: 't_1RndyN6U8', // First Program
    conditionals:  'WR31y7559Pg', // Conditionals & Loops
    patterns:      'dr-pLfGBG60', // Patterns
    bitwise:       'y3GDIL83Sww', // Bitwise
    switch_case:   '83S5U2x2xFA', // Switch Case
    functions:     '83S5U2x2xFA', // Functions
    math:          '13W_wGClMlo', // Basic Maths
    stl:           '3wK530Vqi3Y', // C++ STL
    array:         'sEj993vN7gY', // Intro to Arrays
    array_easy:    'sEj993vN7gY',
    array_med:     'eQ5u5W4G_04',
    array_hard:    'eQ5u5W4G_04',
    hashing:       'KEs5UyBJ39g', // Hashmaps
    recursion:     'B34KqZ4uN6Q', // Recursion
    backtrack:     'nwjZ24S_ueM', // Backtracking
    ll:            'q8gipE-hy80', // Singly Linked List
    stack_q:       'gyPa_m8fW-w', // Stacks
    tree:          'l_7V5uYI2G0', // Binary Trees
    bst:           'fAfR_MstP00', // BST
    heap:          'HqPJF2L5h9U', // Heaps
    trie:          'dBGUmUQhjaM', // Tries
    graph:         'M3_pLsDdeuU', // Graphs
    dp:            'tyB0ztf0DNY', // DP
    greedy:        'n59vC9nJreU'  // Greedy
  };

  const babbarCppPlaylists = {
    default:     'PLDzeHZWIZsTryvtXdMr6rPh4IDexB5NIA' // Main C++ DSA Playlist
  };

  const babbarJavaVideos = {
    overview:      'yJDv59w5dSc', // Course Overview
    basics:        'yJDv59w5dSc', // Flowcharts Java
    first_program: 'eIrMbAQSU34', // First Program Java
    conditionals:  '52989b6-n8U', // Conditionals & Loops Java
    patterns:      'tNm_NNSB3_w', // Patterns (generic)
    bitwise:       'f0UNm_w4g2U', // Bitwise Java
    switch_case:   'b-71-33H89I', // Switch Statements Java
    functions:     'vT0f317iypc', // Functions Java
    math:          '13W_wGClMlo', // Basic Maths
    stl:           'RRVYpIET_RU', // Collections Framework
    array:         'sEj993vN7gY', // Intro to Arrays Java
    array_easy:    'sEj993vN7gY',
    array_med:     'eQ5u5W4G_04',
    array_hard:    'eQ5u5W4G_04',
    hashing:       'KEs5UyBJ39g',
    recursion:     'B34KqZ4uN6Q',
    backtrack:     'nwjZ24S_ueM',
    ll:            'q8gipE-hy80',
    stack_q:       'gyPa_m8fW-w',
    tree:          'l_7V5uYI2G0',
    bst:           'fAfR_MstP00',
    heap:          'HqPJF2L5h9U',
    trie:          'dBGUmUQhjaM',
    graph:         'M3_pLsDdeuU',
    dp:            'tyB0ztf0DNY',
    greedy:        'n59vC9nJreU'
  };

  const babbarJavaPlaylists = {
    default:     'PLDze6lLwgS7jG30yL76H3_K7v3qO-2v-3' // Main Java DSA Playlist
  };

  const getVideo = () => {
    // If it is a Level 0 Foundations topic, resolve video by selected language dynamically
    const normalizedTitle = t.trim();
    const isLevel0 = normalizedTitle.includes('introduction to programming') ||
                     normalizedTitle.includes('variables and data types') ||
                     normalizedTitle.includes('conditionals & decision making') ||
                     normalizedTitle.includes('loops & iteration') ||
                     normalizedTitle.includes('functions & modular scope') ||
                     normalizedTitle.includes('logical pattern printing');

    if (isLevel0) {
      const vids = {
        cpp: 'EAR7De6Goz4',       // Mike Dane C++
        java: 'A74TOX803D0',      // Mike Dane Java
        python: 'rfscVS0vtbw',    // FreeCodeCamp Python
        javascript: 'W6NZfCO5SIk' // Mosh JavaScript
      };
      return vids[lang] || vids.cpp;
    }

    if (languageKey === 'cpp' && dbYoutubeLink) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = dbYoutubeLink.match(regExp);
      if (match && match[2].length === 11) {
        return match[2];
      }
    }
    const videoMap = (languageKey === 'java') ? babbarJavaVideos : babbarCppVideos;
    if (t.includes('overview') || t.includes('setup') || t.includes('announcement') || t.includes('introductory')) return videoMap.overview;
    if (t.includes('flowchart') || t.includes('programming & flowcharts')) return videoMap.basics;
    if (t.includes('first program') || t.includes('variables') || t.includes('data type')) return videoMap.first_program;
    if (t.includes('conditional') || t.includes('loop')) return videoMap.conditionals;
    if (t.includes('bitwise')) return videoMap.bitwise;
    if (t.includes('switch')) return videoMap.switch_case;
    if (t.includes('function') || t.includes('method')) return videoMap.functions;
    if (t.includes('basics') || t.includes('foundation') || t.includes('thinking') || t.includes('print')) return videoMap.basics;
    if (t.includes('pattern')) return videoMap.patterns;
    if (t.includes('math')) return videoMap.math;
    if (t.includes('stl') || t.includes('collection')) return videoMap.stl;
    if (t.includes('easy array') || (t.includes('array') && t.includes('easy'))) return videoMap.array_easy;
    if (t.includes('medium array') || (t.includes('array') && t.includes('medium'))) return videoMap.array_med;
    if (t.includes('hard array') || (t.includes('array') && t.includes('hard'))) return videoMap.array_hard;
    if (t.includes('array')) return videoMap.array;
    if (t.includes('hash')) return videoMap.hashing;
    if (t.includes('backtrack')) return videoMap.backtrack;
    if (t.includes('recursion') || t.includes('fibonacci') || t.includes('subsequence')) return videoMap.recursion;
    if (t.includes('linked list') || t.includes('introduction to ll') || t.includes('singly') || t.includes('doubly') || t.includes('circular')) return videoMap.ll;
    if (t.includes('stack') || t.includes('queue')) return videoMap.stack_q;
    if (t.includes('binary tree') || t.includes('tree traversal')) return videoMap.tree;
    if (t.includes('bst') || t.includes('binary search tree')) return videoMap.bst;
    if (t.includes('heap')) return videoMap.heap;
    if (t.includes('trie')) return videoMap.trie;
    if (t.includes('graph') || t.includes('bfs') || t.includes('dfs') || t.includes('cycle') || t.includes('topo') || t.includes('shortest')) return videoMap.graph;
    if (t.includes('dp') || t.includes('dynamic') || t.includes('knapsack') || t.includes('coin')) return videoMap.dp;
    if (t.includes('greedy')) return videoMap.greedy;
    return videoMap.basics;
  };

  const getPlaylist = () => {
    return (languageKey === 'java') ? babbarJavaPlaylists.default : babbarCppPlaylists.default;
  };

  // â”€â”€â”€ MASTER CATALOG OF GRADUAL QUESTIONS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const catalog = {
    // 1. LEARN THE BASICS (Programming Foundations)
    basics: {
      beginner: {
        title: "Printing Basics",
        desc: "Write a function that returns the string 'Hello, World!'. This helps you verify your environment setup and basic syntax.",
        constraints: "None",
        functionName: "printHello",
        testCases: [{ input: "", expected: "Hello, World!" }],
        hints: ["Simply return the exact string 'Hello, World!' including the comma and exclamation mark.", "Do not print directly inside the function; return the value."],
        time: "O(1)", space: "O(1)",
        approach: "Hinglish: Is problem me aapko standard string 'Hello, World!' return karni hai. Return statement check karein aur spacing ka dhyan rakhein.",
        bp: {
          cpp: `#include <string>\nusing namespace std;\n\nstring printHello() {\n    // TODO: Return "Hello, World!"\n    \n}`,
          java: `public class Solution {\n    public static String printHello() {\n        // TODO: Return "Hello, World!"\n        return "";\n    }\n}`,
          python: `def printHello() -> str:\n    # TODO: Return "Hello, World!"\n    pass`,
          javascript: `function printHello() {\n    // TODO: Return "Hello, World!"\n    \n}`
        },
        sol: {
          cpp: `string printHello() { return "Hello, World!"; }`,
          java: `public static String printHello() { return "Hello, World!"; }`,
          python: `def printHello():\n    return "Hello, World!"`,
          javascript: `function printHello() { return "Hello, World!"; }`
        }
      },
      easy: {
        title: "Variables and Data Types",
        desc: "Given two integers a and b, return their product. This introduces variables and arithmetic operators.",
        constraints: "-10^4 <= a, b <= 10^4",
        functionName: "multiply",
        testCases: [
          { input: "5, 10", expected: "50" },
          { input: "-3, 4", expected: "-12" }
        ],
        hints: ["Declare a variable to store the result of a multiplied by b.", "Use the '*' operator."],
        time: "O(1)", space: "O(1)",
        approach: "Hinglish: Do inputs 'a' aur 'b' ko '*' operator se multiply karein aur result return karein.",
        bp: {
          cpp: `int multiply(int a, int b) {\n    // TODO: Write code here\n    \n}`,
          java: `public class Solution {\n    public static int multiply(int a, int b) {\n        // TODO: Write code here\n        return 0;\n    }\n}`,
          python: `def multiply(a: int, b: int) -> int:\n    # TODO: Write code here\n    pass`,
          javascript: `function multiply(a, b) {\n    // TODO: Write code here\n    \n}`
        },
        sol: {
          cpp: `int multiply(int a, int b) { return a * b; }`,
          java: `public static int multiply(int a, int b) { return a * b; }`,
          python: `def multiply(a, b):\n    return a * b`,
          javascript: `function multiply(a, b) { return a * b; }`
        }
      },
      medium: {
        title: "Input / Output and Operators",
        desc: "Convert Celsius to Fahrenheit. The formula is F = (C * 9/5) + 32. Return the temperature rounded to the nearest integer.",
        constraints: "-273 <= celsius <= 10^4",
        functionName: "convertTemp",
        testCases: [
          { input: "0", expected: "32" },
          { input: "37", expected: "99" }
        ],
        hints: ["Apply the formula: multiply celsius by 9, divide by 5, then add 32.", "Use Math.round() or standard integer casts to round off."],
        time: "O(1)", space: "O(1)",
        approach: "Hinglish: Formula apply karein: (celsius * 9/5) + 32 aur value ko nearest integer value pe round/cast karein.",
        bp: {
          cpp: `int convertTemp(int celsius) {\n    // TODO: Apply conversion formula\n    \n}`,
          java: `public class Solution {\n    public static int convertTemp(int celsius) {\n        // TODO: Apply conversion formula\n        return 0;\n    }\n}`,
          python: `def convertTemp(celsius: int) -> int:\n    # TODO: Apply conversion formula\n    pass`,
          javascript: `function convertTemp(celsius) {\n    // TODO: Apply conversion formula\n    \n}`
        },
        sol: {
          cpp: `int convertTemp(int celsius) { return (int)Math.round((celsius * 9.0 / 5.0) + 32); }`, // transpiler safe
          java: `public static int convertTemp(int celsius) { return (int)Math.round((celsius * 9.0 / 5.0) + 32); }`,
          python: `def convertTemp(celsius):\n    return int(round((celsius * 9 / 5) + 32))`,
          javascript: `function convertTemp(celsius) { return Math.round((celsius * 9 / 5) + 32); }`
        }
      },
      challenge: {
        title: "Decision Making (If-Else / Switch)",
        desc: "Write a function eligibleForVote(age) that returns 'Eligible' if age >= 18, and 'Not Eligible' otherwise.",
        constraints: "1 <= age <= 150",
        functionName: "eligibleForVote",
        testCases: [
          { input: "20", expected: "Eligible" },
          { input: "16", expected: "Not Eligible" }
        ],
        hints: ["Use an 'if' statement to check if the age is greater than or equal to 18.", "Return strings exactly: 'Eligible' or 'Not Eligible'."],
        time: "O(1)", space: "O(1)",
        approach: "Hinglish: Age condition check karein: age >= 18 hone par 'Eligible' else 'Not Eligible' return karein.",
        bp: {
          cpp: `#include <string>\nusing namespace std;\n\nstring eligibleForVote(int age) {\n    // TODO: Write conditional logic\n    \n}`,
          java: `public class Solution {\n    public static String eligibleForVote(int age) {\n        // TODO: Write conditional logic\n        return "";\n    }\n}`,
          python: `def eligibleForVote(age: int) -> str:\n    # TODO: Write conditional logic\n    pass`,
          javascript: `function eligibleForVote(age) {\n    // TODO: Write conditional logic\n    \n}`
        },
        sol: {
          cpp: `string eligibleForVote(int age) { return age >= 18 ? "Eligible" : "Not Eligible"; }`,
          java: `public static String eligibleForVote(int age) { return age >= 18 ? "Eligible" : "Not Eligible"; }`,
          python: `def eligibleForVote(age):\n    return "Eligible" if age >= 18 else "Not Eligible"`,
          javascript: `function eligibleForVote(age) { return age >= 18 ? "Eligible" : "Not Eligible"; }`
        }
      }
    },
    printing: {
      beginner: {
        title: "Printing Basics",
        desc: "Write a function that returns the string 'Hello, World!'. This helps you verify your environment setup and basic syntax.",
        constraints: "None",
        functionName: "printHello",
        testCases: [{ input: "", expected: "Hello, World!" }],
        hints: ["Simply return the exact string 'Hello, World!' including the comma and exclamation mark.", "Do not print directly inside the function; return the value."],
        time: "O(1)", space: "O(1)",
        approach: "Hinglish: Is problem me aapko standard string 'Hello, World!' return karni hai.",
        bp: {
          cpp: `#include <string>\nusing namespace std;\n\nstring printHello() {\n    // TODO: Return "Hello, World!"\n    \n}`,
          java: `public class Solution {\n    public static String printHello() {\n        // TODO: Return "Hello, World!"\n        return "";\n    }\n}`,
          python: `def printHello() -> str:\n    # TODO: Return "Hello, World!"\n    pass`,
          javascript: `function printHello() {\n    // TODO: Return "Hello, World!"\n    \n}`
        },
        sol: {
          cpp: `string printHello() { return "Hello, World!"; }`,
          java: `public static String printHello() { return "Hello, World!"; }`,
          python: `def printHello():\n    return "Hello, World!"`,
          javascript: `function printHello() { return "Hello, World!"; }`
        }
      },
      easy: {
        title: "Welcome User",
        desc: "Given a name string, return a welcome message like 'Hello, [name]!'. For example, if name is 'Alice', return 'Hello, Alice!'.",
        constraints: "1 <= name.length <= 100",
        functionName: "welcomeUser",
        testCases: [
          { input: '"Alice"', expected: "Hello, Alice!" },
          { input: '"Tarun"', expected: "Hello, Tarun!" }
        ],
        hints: ["Concatenate the prefix 'Hello, ' with the name and the suffix '!'.", "Return the combined string."],
        time: "O(1)", space: "O(1)",
        approach: "Hinglish: String concatenation use karein: 'Hello, ' + name + '!' aur result return karein.",
        bp: {
          cpp: `#include <string>\nusing namespace std;\n\nstring welcomeUser(string name) {\n    // TODO: Return welcome message\n    \n}`,
          java: `public class Solution {\n    public static String welcomeUser(String name) {\n        // TODO: Return welcome message\n        return "";\n    }\n}`,
          python: `def welcomeUser(name: str) -> str:\n    # TODO: Return welcome message\n    pass`,
          javascript: `function welcomeUser(name) {\n    // TODO: Return welcome message\n    \n}`
        },
        sol: {
          cpp: `string welcomeUser(string name) { return "Hello, " + name + "!"; }`,
          java: `public static String welcomeUser(String name) { return "Hello, " + name + "!"; }`,
          python: `def welcomeUser(name):\n    return "Hello, " + name + "!"`,
          javascript: `function welcomeUser(name) { return "Hello, " + name + "!"; }`
        }
      },
      medium: {
        title: "Format Output",
        desc: "Given two integers a and b, return a string in the format 'a = [a], b = [b]'. E.g. for a=5, b=10, return 'a = 5, b = 10'.",
        constraints: "-10^4 <= a, b <= 10^4",
        functionName: "formatOutput",
        testCases: [
          { input: "5, 10", expected: "a = 5, b = 10" },
          { input: "-1, 2", expected: "a = -1, b = 2" }
        ],
        hints: ["Convert a and b to strings and merge them with label strings.", "Make sure spaces match exactly."],
        time: "O(1)", space: "O(1)",
        approach: "Hinglish: String dynamic representation use karein aur variables a aur b ko format me merge karein.",
        bp: {
          cpp: `#include <string>\nusing namespace std;\n\nstring formatOutput(int a, int b) {\n    // TODO: Return formatted string\n    \n}`,
          java: `public class Solution {\n    public static String formatOutput(int a, int b) {\n        // TODO: Return formatted string\n        return "";\n    }\n}`,
          python: `def formatOutput(a: int, b: int) -> str:\n    # TODO: Return formatted string\n    pass`,
          javascript: `function formatOutput(a, b) {\n    // TODO: Return formatted string\n    \n}`
        },
        sol: {
          cpp: `string formatOutput(int a, int b) { return "a = " + to_string(a) + ", b = " + to_string(b); }`,
          java: `public static String formatOutput(int a, int b) { return "a = " + a + ", b = " + b; }`,
          python: `def formatOutput(a, b):\n    return f"a = {a}, b = {b}"`,
          javascript: `function formatOutput(a, b) { return "a = " + a + ", b = " + b; }`
        }
      },
      challenge: {
        title: "Round Value Output",
        desc: "Given a floating-point number double val, round it to the nearest integer and return as a formatted string: 'Result: [rounded_val]'. E.g. 5.67 returns 'Result: 6'.",
        constraints: "-10^4 <= val <= 10^4",
        functionName: "roundValue",
        testCases: [
          { input: "5.67", expected: "Result: 6" },
          { input: "3.21", expected: "Result: 3" }
        ],
        hints: ["Round the value first using round functions.", "Concatenate with prefix 'Result: '."],
        time: "O(1)", space: "O(1)",
        approach: "Hinglish: Math.round() se value ko round karein aur 'Result: ' string ke sath return karein.",
        bp: {
          cpp: `#include <string>\nusing namespace std;\n\nstring roundValue(double val) {\n    // TODO: Round and format\n    \n}`,
          java: `public class Solution {\n    public static String roundValue(double val) {\n        // TODO: Round and format\n        return "";\n    }\n}`,
          python: `def roundValue(val: float) -> str:\n    # TODO: Round and format\n    pass`,
          javascript: `function roundValue(val) {\n    // TODO: Round and format\n    \n}`
        },
        sol: {
          cpp: `string roundValue(double val) { return "Result: " + to_string((int)Math.round(val)); }`,
          java: `public static String roundValue(double val) { return "Result: " + (int)Math.round(val); }`,
          python: `def roundValue(val):\n    return f"Result: {int(round(val))}"`,
          javascript: `function roundValue(val) { return "Result: " + Math.round(val); }`
        }
      }
    },
    datatypes: {
      beginner: {
        title: "Multiply Two Numbers",
        desc: "Given two integers a and b, return their product. This introduces variables and arithmetic operators.",
        constraints: "-10^4 <= a, b <= 10^4",
        functionName: "multiply",
        testCases: [
          { input: "5, 10", expected: "50" },
          { input: "-3, 4", expected: "-12" }
        ],
        hints: ["Declare a variable to store the result of a multiplied by b.", "Use the '*' operator."],
        time: "O(1)", space: "O(1)",
        approach: "Hinglish: Do inputs 'a' aur 'b' ko '*' operator se multiply karein aur result return karein.",
        bp: {
          cpp: `int multiply(int a, int b) {\n    // TODO: Write code here\n    \n}`,
          java: `public class Solution {\n    public static int multiply(int a, int b) {\n        // TODO: Write code here\n        return 0;\n    }\n}`,
          python: `def multiply(a: int, b: int) -> int:\n    # TODO: Write code here\n    pass`,
          javascript: `function multiply(a, b) {\n    // TODO: Write code here\n    \n}`
        },
        sol: {
          cpp: `int multiply(int a, int b) { return a * b; }`,
          java: `public static int multiply(int a, int b) { return a * b; }`,
          python: `def multiply(a, b):\n    return a * b`,
          javascript: `function multiply(a, b) { return a * b; }`
        }
      },
      easy: {
        title: "Celsius to Fahrenheit",
        desc: "Convert Celsius to Fahrenheit. The formula is F = (C * 9/5) + 32. Return the temperature rounded to the nearest integer.",
        constraints: "-273 <= celsius <= 10^4",
        functionName: "convertTemp",
        testCases: [
          { input: "0", expected: "32" },
          { input: "37", expected: "99" }
        ],
        hints: ["Apply the formula: multiply celsius by 9, divide by 5, then add 32.", "Use Math.round() or standard integer casts to round off."],
        time: "O(1)", space: "O(1)",
        approach: "Hinglish: Formula apply karein: (celsius * 9/5) + 32 aur value ko nearest integer value pe round/cast karein.",
        bp: {
          cpp: `int convertTemp(int celsius) {\n    // TODO: Apply conversion formula\n    \n}`,
          java: `public class Solution {\n    public static int convertTemp(int celsius) {\n        // TODO: Apply conversion formula\n        return 0;\n    }\n}`,
          python: `def convertTemp(celsius: int) -> int:\n    # TODO: Apply conversion formula\n    pass`,
          javascript: `function convertTemp(celsius) {\n    // TODO: Apply conversion formula\n    \n}`
        },
        sol: {
          cpp: `int convertTemp(int celsius) { return (int)Math.round((celsius * 9.0 / 5.0) + 32); }`,
          java: `public static int convertTemp(int celsius) { return (int)Math.round((celsius * 9.0 / 5.0) + 32); }`,
          python: `def convertTemp(celsius):\n    return int(round((celsius * 9 / 5) + 32))`,
          javascript: `function convertTemp(celsius) { return Math.round((celsius * 9 / 5) + 32); }`
        }
      },
      medium: {
        title: "ASCII Value of Character",
        desc: "Given a character c, return its ASCII integer value. E.g. 'A' returns 65.",
        constraints: "Any valid character",
        functionName: "charToAscii",
        testCases: [
          { input: "'A'", expected: "65" },
          { input: "'a'", expected: "97" }
        ],
        hints: ["Cast the character to an integer directly in strongly-typed languages.", "Use charCodeAt(0) in Javascript/Python."],
        time: "O(1)", space: "O(1)",
        approach: "Hinglish: Character ko integer me cast karein ya charCodeAt(0) method/ord() function call karein.",
        bp: {
          cpp: `int charToAscii(char c) {\n    // TODO: Return ASCII code\n    \n}`,
          java: `public class Solution {\n    public static int charToAscii(char c) {\n        // TODO: Return ASCII code\n        return 0;\n    }\n}`,
          python: `def charToAscii(c: str) -> int:\n    # TODO: Return ASCII code\n    pass`,
          javascript: `function charToAscii(c) {\n    // TODO: Return ASCII code\n    \n}`
        },
        sol: {
          cpp: `int charToAscii(char c) { return (int)c; }`,
          java: `public static int charToAscii(char c) { return (int)c; }`,
          python: `def charToAscii(c):\n    return ord(c)`,
          javascript: `function charToAscii(c) { return c.charCodeAt(0); }`
        }
      },
      challenge: {
        title: "Size of Datatypes",
        desc: "Given a string indicating a datatype ('Integer', 'Float', 'Double', or 'Character'), return its size in bytes (C++ standard: Integer=4, Float=4, Double=8, Character=1).",
        constraints: "Type string matching one of the four types",
        functionName: "datatypeSize",
        testCases: [
          { input: '"Integer"', expected: "4" },
          { input: '"Double"', expected: "8" }
        ],
        hints: ["Use conditional statements (if-else or switch) to match the string name.", "Return standard sizes: Integer=4, Float=4, Double=8, Character=1."],
        time: "O(1)", space: "O(1)",
        approach: "Hinglish: String input match karein if-else structure me, aur default standard memory sizes return karein.",
        bp: {
          cpp: `#include <string>\nusing namespace std;\n\nint datatypeSize(string type) {\n    // TODO: Return byte size\n    \n}`,
          java: `public class Solution {\n    public static int datatypeSize(String type) {\n        // TODO: Return byte size\n        return 0;\n    }\n}`,
          python: `def datatypeSize(type: str) -> int:\n    # TODO: Return byte size\n    pass`,
          javascript: `function datatypeSize(type) {\n    // TODO: Return byte size\n    \n}`
        },
        sol: {
          cpp: `int datatypeSize(string type) { if(type == "Integer" || type == "Float") return 4; if(type == "Double") return 8; return 1; }`,
          java: `public static int datatypeSize(String type) { if(type.equals("Integer") || type.equals("Float")) return 4; if(type.equals("Double")) return 8; return 1; }`,
          python: `def datatypeSize(type):\n    return 8 if type == "Double" else 4 if type in ("Integer", "Float") else 1`,
          javascript: `function datatypeSize(type) { if(type === "Integer" || type === "Float") return 4; if(type === "Double") return 8; return 1; }`
        }
      }
    },
    conditions: {
      beginner: {
        title: "Decision Making (If-Else / Switch)",
        desc: "Write a function eligibleForVote(age) that returns 'Eligible' if age >= 18, and 'Not Eligible' otherwise.",
        constraints: "1 <= age <= 150",
        functionName: "eligibleForVote",
        testCases: [
          { input: "20", expected: "Eligible" },
          { input: "16", expected: "Not Eligible" }
        ],
        hints: ["Use an 'if' statement to check if the age is greater than or equal to 18.", "Return strings exactly: 'Eligible' or 'Not Eligible'."],
        time: "O(1)", space: "O(1)",
        approach: "Hinglish: Age condition check karein: age >= 18 hone par 'Eligible' else 'Not Eligible' return karein.",
        bp: {
          cpp: `#include <string>\nusing namespace std;\n\nstring eligibleForVote(int age) {\n    // TODO: Write conditional logic\n    \n}`,
          java: `public class Solution {\n    public static String eligibleForVote(int age) {\n        // TODO: Write conditional logic\n        return "";\n    }\n}`,
          python: `def eligibleForVote(age: int) -> str:\n    # TODO: Write conditional logic\n    pass`,
          javascript: `function eligibleForVote(age) {\n    // TODO: Write conditional logic\n    \n}`
        },
        sol: {
          cpp: `string eligibleForVote(int age) { return age >= 18 ? "Eligible" : "Not Eligible"; }`,
          java: `public static String eligibleForVote(int age) { return age >= 18 ? "Eligible" : "Not Eligible"; }`,
          python: `def eligibleForVote(age):\n    return "Eligible" if age >= 18 else "Not Eligible"`,
          javascript: `function eligibleForVote(age) { return age >= 18 ? "Eligible" : "Not Eligible"; }`
        }
      },
      easy: {
        title: "Even or Odd Check",
        desc: "Given an integer n, return 'Even' if it is even, and 'Odd' if it is odd.",
        constraints: "-10^5 <= n <= 10^5",
        functionName: "checkEvenOdd",
        testCases: [
          { input: "4", expected: "Even" },
          { input: "7", expected: "Odd" }
        ],
        hints: ["Use the remainder operator '%'. A number is even if n % 2 == 0."],
        time: "O(1)", space: "O(1)",
        approach: "Hinglish: Modulo operator % 2 check karein, agar zero hai to 'Even' else 'Odd'.",
        bp: {
          cpp: `#include <string>\nusing namespace std;\n\nstring checkEvenOdd(int n) {\n    // TODO: Even or odd\n    \n}`,
          java: `public class Solution {\n    public static String checkEvenOdd(int n) {\n        // TODO: Even or odd\n        return "";\n    }\n}`,
          python: `def checkEvenOdd(n: int) -> str:\n    # TODO: Even or odd\n    pass`,
          javascript: `function checkEvenOdd(n) {\n    // TODO: Even or odd\n    \n}`
        },
        sol: {
          cpp: `string checkEvenOdd(int n) { return n % 2 == 0 ? "Even" : "Odd"; }`,
          java: `public static String checkEvenOdd(int n) { return n % 2 == 0 ? "Even" : "Odd"; }`,
          python: `def checkEvenOdd(n):\n    return "Even" if n % 2 == 0 else "Odd"`,
          javascript: `function checkEvenOdd(n) { return n % 2 === 0 ? "Even" : "Odd"; }`
        }
      },
      medium: {
        title: "Max of Three Integers",
        desc: "Given three integers a, b, and c, return the maximum value.",
        constraints: "-10^5 <= a,b,c <= 10^5",
        functionName: "maxOfThree",
        testCases: [
          { input: "5, 12, 9", expected: "12" },
          { input: "-10, -5, -20", expected: "-5" }
        ],
        hints: ["Use compound relational operators like '&&' or nesting 'if' checks."],
        time: "O(1)", space: "O(1)",
        approach: "Hinglish: Conditions check karein: if a >= b and a >= c return a, else if b >= c return b, else return c.",
        bp: {
          cpp: `int maxOfThree(int a, int b, int c) {\n    // TODO: Find max\n    \n}`,
          java: `public class Solution {\n    public static int maxOfThree(int a, int b, int c) {\n        // TODO: Find max\n        return 0;\n    }\n}`,
          python: `def maxOfThree(a: int, b: int, c: int) -> int:\n    # TODO: Find max\n    pass`,
          javascript: `function maxOfThree(a, b, c) {\n    // TODO: Find max\n    \n}`
        },
        sol: {
          cpp: `int maxOfThree(int a, int b, int c) { return max(a, max(b, c)); }`,
          java: `public static int maxOfThree(int a, int b, int c) { return Math.max(a, Math.max(b, c)); }`,
          python: `def maxOfThree(a, b, c):\n    return max(a, b, c)`,
          javascript: `function maxOfThree(a, b, c) { return Math.max(a, b, c); }`
        }
      },
      challenge: {
        title: "Leap Year Checker",
        desc: "Given a year, return 'Leap' if it is a leap year, and 'Not Leap' otherwise. (Divisible by 400, or divisible by 4 but not by 100).",
        constraints: "1 <= year <= 9999",
        functionName: "checkLeapYear",
        testCases: [
          { input: "2000", expected: "Leap" },
          { input: "1900", expected: "Not Leap" }
        ],
        hints: ["Check divisible by 400 first: year % 400 == 0.", "Otherwise check if divisible by 4 AND NOT divisible by 100."],
        time: "O(1)", space: "O(1)",
        approach: "Hinglish: Condition apply karein: (year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0) ? 'Leap' : 'Not Leap'.",
        bp: {
          cpp: `#include <string>\nusing namespace std;\n\nstring checkLeapYear(int year) {\n    // TODO: Leap check\n    \n}`,
          java: `public class Solution {\n    public static String checkLeapYear(int year) {\n        // TODO: Leap check\n        return "";\n    }\n}`,
          python: `def checkLeapYear(year: int) -> str:\n    # TODO: Leap check\n    pass`,
          javascript: `function checkLeapYear(year) {\n    // TODO: Leap check\n    \n}`
        },
        sol: {
          cpp: `string checkLeapYear(int year) { return (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0)) ? "Leap" : "Not Leap"; }`,
          java: `public static String checkLeapYear(int year) { return (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0)) ? "Leap" : "Not Leap"; }`,
          python: `def checkLeapYear(year):\n    return "Leap" if (year % 400 == 0 or (year % 4 == 0 and year % 100 != 0)) else "Not Leap"`,
          javascript: `function checkLeapYear(year) { return (year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0)) ? "Leap" : "Not Leap"; }`
        }
      }
    },
    loops: {
      beginner: {
        title: "Sum from 1 to N",
        desc: "Given an integer n, calculate the sum of all integers from 1 to n.",
        constraints: "1 <= n <= 10^4",
        functionName: "sumToN",
        testCases: [
          { input: "5", expected: "15" },
          { input: "100", expected: "5050" }
        ],
        hints: ["Initialize a sum accumulator to 0.", "Use a 'for' loop to iterate from 1 to n and add each value to the sum."],
        time: "O(N)", space: "O(1)",
        approach: "Hinglish: Ek loop chalaein 1 se n tak aur ek running total sum store karein.",
        bp: {
          cpp: `int sumToN(int n) {\n    // TODO: Loop sum\n    \n}`,
          java: `public class Solution {\n    public static int sumToN(int n) {\n        // TODO: Loop sum\n        return 0;\n    }\n}`,
          python: `def sumToN(n: int) -> int:\n    # TODO: Loop sum\n    pass`,
          javascript: `function sumToN(n) {\n    // TODO: Loop sum\n    \n}`
        },
        sol: {
          cpp: `int sumToN(int n) { int s = 0; for(int i=1; i<=n; i++) s += i; return s; }`,
          java: `public static int sumToN(int n) { int s = 0; for(int i=1; i<=n; i++) s += i; return s; }`,
          python: `def sumToN(n):\n    return sum(range(1, n+1))`,
          javascript: `function sumToN(n) { let s = 0; for(let i=1; i<=n; i++) s += i; return s; }`
        }
      },
      easy: {
        title: "N-th Fibonacci Number",
        desc: "Given an integer n, return the n-th Fibonacci number. E.g. fib(0)=0, fib(1)=1, fib(2)=1, fib(3)=2, fib(4)=3, etc.",
        constraints: "0 <= n <= 30",
        functionName: "fibLoop",
        testCases: [
          { input: "4", expected: "3" },
          { input: "6", expected: "8" }
        ],
        hints: ["Initialize two variables for the first two Fibonacci values.", "Use a loop to compute the next term up to n."],
        time: "O(N)", space: "O(1)",
        approach: "Hinglish: Iterative approach (a = 0, b = 1) check karein. Loop chala kar numbers shift karein.",
        bp: {
          cpp: `int fibLoop(int n) {\n    // TODO: Loop Fibonacci\n    \n}`,
          java: `public class Solution {\n    public static int fibLoop(int n) {\n        // TODO: Loop Fibonacci\n        return 0;\n    }\n}`,
          python: `def fibLoop(n: int) -> int:\n    # TODO: Loop Fibonacci\n    pass`,
          javascript: `function fibLoop(n) {\n    // TODO: Loop Fibonacci\n    \n}`
        },
        sol: {
          cpp: `int fibLoop(int n) { if(n <= 1) return n; int a=0, b=1; for(int i=2; i<=n; i++) { int c=a+b; a=b; b=c; } return b; }`,
          java: `public static int fibLoop(int n) { if(n <= 1) return n; int a=0, b=1; for(int i=2; i<=n; i++) { int c=a+b; a=b; b=c; } return b; }`,
          python: `def fibLoop(n):\n    if n<=1: return n\n    a, b = 0, 1\n    for _ in range(2, n+1): a, b = b, a+b\n    return b`,
          javascript: `function fibLoop(n) { if(n <= 1) return n; let a=0, b=1; for(let i=2; i<=n; i++) { let c=a+b; a=b; b=c; } return b; }`
        }
      },
      medium: {
        title: "Print Multiples of Three",
        desc: "Given n, return a string containing all positive multiples of 3 up to n, separated by commas. E.g. for n=10, return '3,6,9'.",
        constraints: "1 <= n <= 100",
        functionName: "multiplesOfThree",
        testCases: [
          { input: "10", expected: "3,6,9" },
          { input: "15", expected: "3,6,9,12,15" }
        ],
        hints: ["Loop with steps of 3: i = 3, i += 3.", "Join the values with commas. Make sure there is no trailing comma at the end."],
        time: "O(N)", space: "O(N)",
        approach: "Hinglish: Multiples of 3 loop karein (3, 6, 9) aur unhe comma concat string me bind karein.",
        bp: {
          cpp: `#include <string>\nusing namespace std;\n\nstring multiplesOfThree(int n) {\n    // TODO: Multiples of 3\n    \n}`,
          java: `public class Solution {\n    public static String multiplesOfThree(int n) {\n        // TODO: Multiples of 3\n        return "";\n    }\n}`,
          python: `def multiplesOfThree(n: int) -> str:\n    # TODO: Multiples of 3\n    pass`,
          javascript: `function multiplesOfThree(n) {\n    // TODO: Multiples of 3\n    \n}`
        },
        sol: {
          cpp: `string multiplesOfThree(int n) { string s = ""; for(int i=3; i<=n; i+=3) { if(s!="") s+=","; s+=to_string(i); } return s; }`,
          java: `public static String multiplesOfThree(int n) { StringBuilder sb = new StringBuilder(); for(int i=3; i<=n; i+=3) { if(sb.length() > 0) sb.append(","); sb.append(i); } return sb.toString(); }`,
          python: `def multiplesOfThree(n):\n    return ",".join(str(i) for i in range(3, n+1, 3))`,
          javascript: `function multiplesOfThree(n) { let res = []; for(let i=3; i<=n; i+=3) res.push(i); return res.join(","); }`
        }
      },
      challenge: {
        title: "Check Prime Number",
        desc: "Given an integer n, return 'Prime' if n is a prime number, and 'Not Prime' otherwise.",
        constraints: "1 <= n <= 10^5",
        functionName: "checkPrime",
        testCases: [
          { input: "7", expected: "Prime" },
          { input: "12", expected: "Not Prime" }
        ],
        hints: ["Numbers <= 1 are not prime.", "Check divisibility from 2 to sqrt(n). If divisible, return 'Not Prime'."],
        time: "O(sqrt(N))", space: "O(1)",
        approach: "Hinglish: Prime checking limit loop `i * i <= n` tak chalaein. Agar divisible ho to directly return. Special case: <=1 invalid.",
        bp: {
          cpp: `#include <string>\nusing namespace std;\n\nstring checkPrime(int n) {\n    // TODO: Prime logic\n    \n}`,
          java: `public class Solution {\n    public static String checkPrime(int n) {\n        // TODO: Prime logic\n        return "";\n    }\n}`,
          python: `def checkPrime(n: int) -> str:\n    # TODO: Prime logic\n    pass`,
          javascript: `function checkPrime(n) {\n    // TODO: Prime logic\n    \n}`
        },
        sol: {
          cpp: `string checkPrime(int n) { if(n<=1) return "Not Prime"; for(int i=2; i*i<=n; i++) { if(n%i==0) return "Not Prime"; } return "Prime"; }`,
          java: `public static String checkPrime(int n) { if(n<=1) return "Not Prime"; for(int i=2; i*i<=n; i++) { if(n%i==0) return "Not Prime"; } return "Prime"; }`,
          python: `def checkPrime(n):\n    if n<=1: return "Not Prime"\n    for i in range(2, int(n**0.5)+1):\n        if n%i==0: return "Not Prime"\n    return "Prime"`,
          javascript: `function checkPrime(n) { if(n<=1) return "Not Prime"; for(let i=2; i*i<=n; i++) { if(n%i===0) return "Not Prime"; } return "Prime"; }`
        }
      }
    },
    functions: {
      beginner: {
        title: "Simple Addition Function",
        desc: "Implement a function that adds two numbers. The starter structure defines the parameters. Return their sum.",
        constraints: "-10^4 <= a, b <= 10^4",
        functionName: "addNumbers",
        testCases: [
          { input: "3, 5", expected: "8" },
          { input: "-10, 40", expected: "30" }
        ],
        hints: ["Simply use the '+' operator on a and b.", "Return the result."],
        time: "O(1)", space: "O(1)",
        approach: "Hinglish: Simple function declaration check karein aur argument input values sum return karein.",
        bp: {
          cpp: `int addNumbers(int a, int b) {\n    // TODO: Return sum\n    \n}`,
          java: `public class Solution {\n    public static int addNumbers(int a, int b) {\n        // TODO: Return sum\n        return 0;\n    }\n}`,
          python: `def addNumbers(a: int, b: int) -> int:\n    # TODO: Return sum\n    pass`,
          javascript: `function addNumbers(a, b) {\n    // TODO: Return sum\n    \n}`
        },
        sol: {
          cpp: `int addNumbers(int a, int b) { return a + b; }`,
          java: `public static int addNumbers(int a, int b) { return a + b; }`,
          python: `def addNumbers(a, b):\n    return a + b`,
          javascript: `function addNumbers(a, b) { return a + b; }`
        }
      },
      easy: {
        title: "Calculate Area of Rectangle",
        desc: "Implement a function rectangleArea(l, w) that returns the area of a rectangle. If length or width is <= 0, return -1.",
        constraints: "-100 <= l, w <= 10^4",
        functionName: "rectangleArea",
        testCases: [
          { input: "5, 10", expected: "50" },
          { input: "-2, 5", expected: "-1" }
        ],
        hints: ["Check if length <= 0 or width <= 0 first. If so, return -1.", "Otherwise, return l * w."],
        time: "O(1)", space: "O(1)",
        approach: "Hinglish: Conditions check parameters: if length <= 0 or width <= 0 return -1, otherwise length * width return karein.",
        bp: {
          cpp: `int rectangleArea(int l, int w) {\n    // TODO: Return area\n    \n}`,
          java: `public class Solution {\n    public static int rectangleArea(int l, int w) {\n        // TODO: Return area\n        return 0;\n    }\n}`,
          python: `def rectangleArea(l: int, w: int) -> int:\n    # TODO: Return area\n    pass`,
          javascript: `function rectangleArea(l, w) {\n    // TODO: Return area\n    \n}`
        },
        sol: {
          cpp: `int rectangleArea(int l, int w) { if(l<=0 || w<=0) return -1; return l * w; }`,
          java: `public static int rectangleArea(int l, int w) { if(l<=0 || w<=0) return -1; return l * w; }`,
          python: `def rectangleArea(l, w):\n    if l<=0 or w<=0: return -1\n    return l * w`,
          javascript: `function rectangleArea(l, w) { if(l<=0 || w<=0) return -1; return l * w; }`
        }
      },
      medium: {
        title: "Convert Hours to Minutes",
        desc: "Implement a function hoursToMinutes(hours) that converts hours to minutes.",
        constraints: "0 <= hours <= 1000",
        functionName: "hoursToMinutes",
        testCases: [
          { input: "2", expected: "120" },
          { input: "0.5", expected: "30" }
        ],
        hints: ["Multiply hours by 60.", "Return the result."],
        time: "O(1)", space: "O(1)",
        approach: "Hinglish: Input hours ko 60 float decimal se multiply karein aur minutes return check logic build karein.",
        bp: {
          cpp: `double hoursToMinutes(double hours) {\n    // TODO: Convert hours\n    \n}`,
          java: `public class Solution {\n    public static double hoursToMinutes(double hours) {\n        // TODO: Convert hours\n        return 0.0;\n    }\n}`,
          python: `def hoursToMinutes(hours: float) -> float:\n    # TODO: Convert hours\n    pass`,
          javascript: `function hoursToMinutes(hours) {\n    // TODO: Convert hours\n    \n}`
        },
        sol: {
          cpp: `double hoursToMinutes(double hours) { return hours * 60.0; }`,
          java: `public static double hoursToMinutes(double hours) { return hours * 60.0; }`,
          python: `def hoursToMinutes(hours):\n    return hours * 60.0`,
          javascript: `function hoursToMinutes(hours) { return hours * 60.0; }`
        }
      },
      challenge: {
        title: "Exponent Power Calculator",
        desc: "Implement a function power(base, exp) that calculates base raised to the power exp (base^exp). E.g. power(2,3) = 8.",
        constraints: "1 <= base <= 20, 0 <= exp <= 10",
        functionName: "powerCalc",
        testCases: [
          { input: "2, 3", expected: "8" },
          { input: "5, 0", expected: "1" }
        ],
        hints: ["Loop from 1 to exp and multiply base iteratively, or use language exponent functions.", "E.g. Math.pow in Java/JS, pow in C++, ** in Python."],
        time: "O(log(exp))", space: "O(1)",
        approach: "Hinglish: Math power operations return check: base ** exp in python or Math.pow(base, exp) in JS.",
        bp: {
          cpp: `int powerCalc(int base, int exp) {\n    // TODO: Power\n    \n}`,
          java: `public class Solution {\n    public static int powerCalc(int base, int exp) {\n        // TODO: Power\n        return 0;\n    }\n}`,
          python: `def powerCalc(base: int, exp: int) -> int:\n    # TODO: Power\n    pass`,
          javascript: `function powerCalc(base, exp) {\n    // TODO: Power\n    \n}`
        },
        sol: {
          cpp: `#include <cmath>\nint powerCalc(int base, int exp) { return (int)pow(base, exp); }`,
          java: `public static int powerCalc(int base, int exp) { return (int)Math.pow(base, exp); }`,
          python: `def powerCalc(base, exp):\n    return base ** exp`,
          javascript: `function powerCalc(base, exp) { return Math.pow(base, exp); }`
        }
      }
    },
    // 2. BUILD-UP LOGICAL THINKING (Patterns)
    patterns: {
      beginner: {
        title: "Star Sequence",
        desc: "Given an integer n, return a string containing n asterisks (*).",
        constraints: "1 <= n <= 50",
        functionName: "starSequence",
        testCases: [
          { input: "3", expected: "***" },
          { input: "5", expected: "*****" }
        ],
        hints: ["Use a simple loop to append '*' to a string n times.", "Return the constructed string."],
        time: "O(N)", space: "O(N)",
        approach: "Hinglish: Ek loop chalaein 0 se n tak, aur ek string accumulator me '*' characters append karte rahein.",
        bp: {
          cpp: `#include <string>\nusing namespace std;\n\nstring starSequence(int n) {\n    // TODO: Build star string\n    \n}`,
          java: `public class Solution {\n    public static String starSequence(int n) {\n        // TODO: Build star string\n        return "";\n    }\n}`,
          python: `def starSequence(n: int) -> str:\n    # TODO: Build star string\n    pass`,
          javascript: `function starSequence(n) {\n    // TODO: Build star string\n    \n}`
        },
        sol: {
          cpp: `string starSequence(int n) { string s = ""; for(int i=0; i<n; i++) s += "*"; return s; }`,
          java: `public static String starSequence(int n) { StringBuilder sb = new StringBuilder(); for(int i=0; i<n; i++) sb.append("*"); return sb.toString(); }`,
          python: `def starSequence(n):\n    return "*" * n`,
          javascript: `function starSequence(n) { return "*".repeat(n); }`
        }
      },
      easy: {
        title: "Square Star Pattern",
        desc: "Given n, return a square grid pattern of stars with dimension n x n. Rows should be separated by a newline (\\n). E.g. for n=2, return '**\\n**'.",
        constraints: "1 <= n <= 10",
        functionName: "squarePattern",
        testCases: [
          { input: "2", expected: "**\\n**" },
          { input: "3", expected: "***\\n***\\n***" }
        ],
        hints: ["Use nested loops. Outer loop for rows, inner loop for stars in each row.", "Join rows using '\\n' character. Ensure there is no trailing newline at the very end."],
        time: "O(N^2)", space: "O(N^2)",
        approach: "Hinglish: Nested loops use karein. Row count and column count same honi chahiye. Har row ke beech me '\\n' insert karein.",
        bp: {
          cpp: `#include <string>\nusing namespace std;\n\nstring squarePattern(int n) {\n    // TODO: Build grid pattern\n    \n}`,
          java: `public class Solution {\n    public static String squarePattern(int n) {\n        // TODO: Build grid pattern\n        return "";\n    }\n}`,
          python: `def squarePattern(n: int) -> str:\n    # TODO: Build grid pattern\n    pass`,
          javascript: `function squarePattern(n) {\n    // TODO: Build grid pattern\n    \n}`
        },
        sol: {
          cpp: `string squarePattern(int n) { string s = ""; for(int i=0; i<n; i++) { for(int j=0; j<n; j++) s += "*"; if(i < n-1) s += "\\n"; } return s; }`,
          java: `public static String squarePattern(int n) { StringBuilder sb = new StringBuilder(); for(int i=0; i<n; i++) { for(int j=0; j<n; j++) sb.append("*"); if(i < n-1) sb.append("\\n"); } return sb.toString(); }`,
          python: `def squarePattern(n):\n    return "\\n".join(["*" * n for _ in range(n)])`,
          javascript: `function squarePattern(n) { return Array(n).fill("*".repeat(n)).join("\\n"); }`
        }
      },
      medium: {
        title: "Right Triangle Pattern",
        desc: "Return a right-angled triangle star pattern of height n. Row i has i+1 stars. E.g. n=3: '*\\n**\\n***'.",
        constraints: "1 <= n <= 15",
        functionName: "rightTriangle",
        testCases: [
          { input: "2", expected: "*\\n**" },
          { input: "3", expected: "*\\n**\\n***" }
        ],
        hints: ["Inner loop runs up to index of outer loop.", "Rows joined by '\\n'."],
        time: "O(N^2)", space: "O(N^2)",
        approach: "Hinglish: Row 1 me 1 star, Row 2 me 2 stars... is tarah outer loop limit se inner loop limits coordinate karein.",
        bp: {
          cpp: `#include <string>\nusing namespace std;\n\nstring rightTriangle(int n) {\n    // TODO: Build triangle\n    \n}`,
          java: `public class Solution {\n    public static String rightTriangle(int n) {\n        // TODO: Build triangle\n        return "";\n    }\n}`,
          python: `def rightTriangle(n: int) -> str:\n    # TODO: Build triangle\n    pass`,
          javascript: `function rightTriangle(n) {\n    // TODO: Build triangle\n    \n}`
        },
        sol: {
          cpp: `string rightTriangle(int n) { string s = ""; for(int i=1; i<=n; i++) { for(int j=1; j<=i; j++) s += "*"; if(i < n) s += "\\n"; } return s; }`,
          java: `public static String rightTriangle(int n) { StringBuilder sb = new StringBuilder(); for(int i=1; i<=n; i++) { for(int j=1; j<=i; j++) sb.append("*"); if(i < n) sb.append("\\n"); } return sb.toString(); }`,
          python: `def rightTriangle(n):\n    return "\\n".join(["*" * i for i in range(1, n+1)])`,
          javascript: `function rightTriangle(n) { return Array.from({length: n}, (_, i) => "*".repeat(i+1)).join("\\n"); }`
        }
      },
      challenge: {
        title: "Number Pyramid",
        desc: "Return a number pyramid of height n. E.g. n=3: '1\\n12\\n123'.",
        constraints: "1 <= n <= 9",
        functionName: "numberPyramid",
        testCases: [
          { input: "2", expected: "1\\n12" },
          { input: "3", expected: "1\\n12\\n123" }
        ],
        hints: ["Inner loop appends loop index (1 to i) as strings instead of stars."],
        time: "O(N^2)", space: "O(N^2)",
        approach: "Hinglish: Inner loop numbers output karta hai. Har step pe string representation append karein.",
        bp: {
          cpp: `#include <string>\nusing namespace std;\n\nstring numberPyramid(int n) {\n    // TODO: Build pyramid\n    \n}`,
          java: `public class Solution {\n    public static String numberPyramid(int n) {\n        // TODO: Build pyramid\n        return "";\n    }\n}`,
          python: `def numberPyramid(n: int) -> str:\n    # TODO: Build pyramid\n    pass`,
          javascript: `function numberPyramid(n) {\n    // TODO: Build pyramid\n    \n}`
        },
        sol: {
          cpp: `string numberPyramid(int n) { string s = ""; for(int i=1; i<=n; i++) { for(int j=1; j<=i; j++) s += to_string(j); if(i < n) s += "\\n"; } return s; }`,
          java: `public static String numberPyramid(int n) { StringBuilder sb = new StringBuilder(); for(int i=1; i<=n; i++) { for(int j=1; j<=i; j++) sb.append(j); if(i < n) sb.append("\\n"); } return sb.toString(); }`,
          python: `def numberPyramid(n):\n    return "\\n".join(["".join(str(j) for j in range(1, i+1)) for i in range(1, n+1)])`,
          javascript: `function numberPyramid(n) { return Array.from({length: n}, (_, i) => Array.from({length: i+1}, (_, j) => j+1).join("")).join("\\n"); }`
        }
      }
    },

    // 3. BASIC MATH FOR DSA
    math: {
      beginner: {
        title: "Count Digits",
        desc: "Given an integer n, return the number of digits in it. Note: handle negative numbers properly by ignoring the negative sign.",
        constraints: "-2^31 <= n <= 2^31 - 1",
        functionName: "countDigits",
        testCases: [
          { input: "12345", expected: "5" },
          { input: "-987", expected: "3" },
          { input: "0", expected: "1" }
        ],
        hints: ["Take the absolute value first.", "Repeatedly divide by 10 until the number becomes 0, counting the steps."],
        time: "O(log10(N))", space: "O(1)",
        approach: "Hinglish: Absolute value nikalne ke baad recursive divide 10 se count increase karte rahein.",
        bp: {
          cpp: `int countDigits(int n) {\n    // TODO: Count digits\n    \n}`,
          java: `public class Solution {\n    public static int countDigits(int n) {\n        // TODO: Count digits\n        return 0;\n    }\n}`,
          python: `def countDigits(n: int) -> int:\n    # TODO: Count digits\n    pass`,
          javascript: `function countDigits(n) {\n    // TODO: Count digits\n    \n}`
        },
        sol: {
          cpp: `int countDigits(int n) { if(n==0) return 1; int c=0; long long temp=abs((long long)n); while(temp>0){ c++; temp/=10; } return c; }`,
          java: `public static int countDigits(int n) { if(n==0) return 1; int c=0; long temp=Math.abs((long)n); while(temp>0){ c++; temp/=10; } return c; }`,
          python: `def countDigits(n):\n    return len(str(abs(n)))`,
          javascript: `function countDigits(n) { return String(Math.abs(n)).length; }`
        }
      },
      easy: {
        title: "Reverse a Number",
        desc: "Reverse the digits of a 32-bit signed integer n. If reversing n causes overflow, return 0.",
        constraints: "-2^31 <= n <= 2^31 - 1",
        functionName: "reverseNumber",
        testCases: [
          { input: "123", expected: "321" },
          { input: "-456", expected: "-654" }
        ],
        hints: ["Extract digits from the right using modulo 10.", "Reconstruct reversed number by multiplying previous reversed result by 10 and adding new digit."],
        time: "O(log10(N))", space: "O(1)",
        approach: "Hinglish: Number ko step-by-step 10 se mod karke last digit extract karein aur outcome * 10 me add karein.",
        bp: {
          cpp: `int reverseNumber(int n) {\n    // TODO: Reverse number\n    \n}`,
          java: `public class Solution {\n    public static int reverseNumber(int n) {\n        // TODO: Reverse number\n        return 0;\n    }\n}`,
          python: `def reverseNumber(n: int) -> int:\n    # TODO: Reverse number\n    pass`,
          javascript: `function reverseNumber(n) {\n    // TODO: Reverse number\n    \n}`
        },
        sol: {
          cpp: `int reverseNumber(int n) { long long rev=0; long long temp = abs((long long)n); while(temp>0){ rev = rev*10 + temp%10; temp/=10; } if(rev > INT_MAX) return 0; return n<0 ? -rev : rev; }`,
          java: `public static int reverseNumber(int n) { long rev=0; long temp = Math.abs((long)n); while(temp>0){ rev = rev*10 + temp%10; temp/=10; } if(rev > Integer.MAX_VALUE) return 0; return n<0 ? (int)-rev : (int)rev; }`,
          python: `def reverseNumber(n):\n    s = str(abs(n))[::-1]\n    rev = int(s)\n    if rev > 2**31 - 1:\n        return 0\n    return -rev if n < 0 else rev`,
          javascript: `function reverseNumber(n) { const limit = 2**31 - 1; let rev = parseInt(String(Math.abs(n)).split("").reverse().join("")); if (rev > limit) return 0; return n < 0 ? -rev : rev; }`
        }
      },
      medium: {
        title: "Check Prime",
        desc: "Return true if integer n is a prime number, false otherwise. (n <= 1 is not prime).",
        constraints: "1 <= n <= 10^9",
        functionName: "isPrime",
        testCases: [
          { input: "7", expected: "true" },
          { input: "12", expected: "false" }
        ],
        hints: ["Check divisibility from 2 up to the square root of n.", "If divisible by any number, return false."],
        time: "O(sqrt(N))", space: "O(1)",
        approach: "Hinglish: Loop ko 2 se start karke sqrt(n) tak check karein. Agar koi divisor mile to false return karein.",
        bp: {
          cpp: `bool isPrime(int n) {\n    // TODO: Prime check\n    \n}`,
          java: `public class Solution {\n    public static boolean isPrime(int n) {\n        // TODO: Prime check\n        return false;\n    }\n}`,
          python: `def isPrime(n: int) -> bool:\n    # TODO: Prime check\n    pass`,
          javascript: `function isPrime(n) {\n    // TODO: Prime check\n    \n}`
        },
        sol: {
          cpp: `bool isPrime(int n) { if(n<=1) return false; for(int i=2; i*i<=n; i++) if(n%i==0) return false; return true; }`,
          java: `public static boolean isPrime(int n) { if(n<=1) return false; for(int i=2; i*i<=n; i++) if(n%i==0) return false; return true; }`,
          python: `def isPrime(n):\n    if n<=1: return False\n    for i in range(2, int(n**0.5)+1):\n        if n%i==0: return False\n    return True`,
          javascript: `function isPrime(n) { if(n<=1) return false; for(let i=2; i*i<=n; i++) if(n%i===0) return false; return true; }`
        }
      },
      challenge: {
        title: "Armstrong Number Check",
        desc: "An Armstrong number is a number that is the sum of its own digits each raised to the power of the number of digits. Return true if n is Armstrong, false otherwise.",
        constraints: "1 <= n <= 10^7",
        functionName: "isArmstrong",
        testCases: [
          { input: "153", expected: "true" },
          { input: "123", expected: "false" }
        ],
        hints: ["Count number of digits (say k).", "Sum each digit raised to power of k, then compare total with n."],
        time: "O(log10(N))", space: "O(1)",
        approach: "Hinglish: Digits count (k) nikalne ke baad, har single digit ki power k ka sum check karein original number ke sath.",
        bp: {
          cpp: `bool isArmstrong(int n) {\n    // TODO: Armstrong check\n    \n}`,
          java: `public class Solution {\n    public static boolean isArmstrong(int n) {\n        // TODO: Armstrong check\n        return false;\n    }\n}`,
          python: `def isArmstrong(n: int) -> bool:\n    # TODO: Armstrong check\n    pass`,
          javascript: `function isArmstrong(n) {\n    // TODO: Armstrong check\n    \n}`
        },
        sol: {
          cpp: `bool isArmstrong(int n) { int k = to_string(n).length(); int sum = 0, temp = n; while(temp>0){ sum += pow(temp%10, k); temp/=10; } return sum == n; }`,
          java: `public static boolean isArmstrong(int n) { int k = String.valueOf(n).length(); int sum = 0, temp = n; while(temp>0){ sum += Math.pow(temp%10, k); temp/=10; } return sum == n; }`,
          python: `def isArmstrong(n):\n    k = len(str(n))\n    return sum(int(x)**k for x in str(n)) == n`,
          javascript: `function isArmstrong(n) { const k = String(n).length; let sum = 0, temp = n; while(temp>0){ sum += Math.pow(temp%10, k); temp = Math.floor(temp/10); } return sum === n; }`
        }
      }
    },

    // 4. EASY ARRAY PROBLEMS (Arrays Explorer)
    array: {
      beginner: {
        title: "Array Access",
        desc: "Given an array of integers arr and an index k, return the element present at index k.",
        constraints: "1 <= arr.length <= 10^5, 0 <= k < arr.length",
        functionName: "getElement",
        testCases: [
          { input: "[10,20,30,40], 2", expected: "30" },
          { input: "[5], 0", expected: "5" }
        ],
        hints: ["Use brackets notation standard indexing: arr[k]."],
        time: "O(1)", space: "O(1)",
        approach: "Hinglish: Array ke kth element ko bracket selector arr[k] se direct retrieve karein.",
        bp: {
          cpp: `#include <vector>\nusing namespace std;\n\nint getElement(vector<int>& arr, int k) {\n    // TODO: Get element\n    \n}`,
          java: `public class Solution {\n    public static int getElement(int[] arr, int k) {\n        // TODO: Get element\n        return 0;\n    }\n}`,
          python: `def getElement(arr: list, k: int) -> int:\n    # TODO: Get element\n    pass`,
          javascript: `function getElement(arr, k) {\n    // TODO: Get element\n    \n}`
        },
        sol: {
          cpp: `int getElement(vector<int>& arr, int k) { return arr[k]; }`,
          java: `public static int getElement(int[] arr, int k) { return arr[k]; }`,
          python: `def getElement(arr, k):\n    return arr[k]`,
          javascript: `function getElement(arr, k) { return arr[k]; }`
        }
      },
      easy: {
        title: "Sum of Array",
        desc: "Given an array of integers arr, return the sum of all its elements.",
        constraints: "0 <= arr.length <= 10^5",
        functionName: "sumArray",
        testCases: [
          { input: "[1,2,3,4]", expected: "10" },
          { input: "[]", expected: "0" }
        ],
        hints: ["Use a loop to iterate through the array.", "Keep a running total sum variable."],
        time: "O(N)", space: "O(1)",
        approach: "Hinglish: Array elements ko basic for loop se linear traversal karke global sum variable add karein.",
        bp: {
          cpp: `#include <vector>\nusing namespace std;\n\nint sumArray(vector<int>& arr) {\n    // TODO: Calculate sum\n    \n}`,
          java: `public class Solution {\n    public static int sumArray(int[] arr) {\n        // TODO: Calculate sum\n        return 0;\n    }\n}`,
          python: `def sumArray(arr: list) -> int:\n    # TODO: Calculate sum\n    pass`,
          javascript: `function sumArray(arr) {\n    // TODO: Calculate sum\n    \n}`
        },
        sol: {
          cpp: `int sumArray(vector<int>& arr) { int sum=0; for(int x: arr) sum += x; return sum; }`,
          java: `public static int sumArray(int[] arr) { int sum=0; for(int x: arr) sum += x; return sum; }`,
          python: `def sumArray(arr):\n    return sum(arr)`,
          javascript: `function sumArray(arr) { return arr.reduce((a,b)=>a+b, 0); }`
        }
      },
      medium: {
        title: "Find Largest Element",
        desc: "Given an array of integers arr, return the largest element present.",
        constraints: "1 <= arr.length <= 10^5",
        functionName: "findLargest",
        testCases: [
          { input: "[1,5,3,9,2]", expected: "9" },
          { input: "[-5,-2,-10]", expected: "-2" }
        ],
        hints: ["Initialize max variable to the first element.", "Traverse the array and update max whenever a larger element is found."],
        time: "O(N)", space: "O(1)",
        approach: "Hinglish: Pehle element ko max maan kar pure array traversal karein, comparison se max update karein.",
        bp: {
          cpp: `#include <vector>\nusing namespace std;\n\nint findLargest(vector<int>& arr) {\n    // TODO: Find max\n    \n}`,
          java: `public class Solution {\n    public static int findLargest(int[] arr) {\n        // TODO: Find max\n        return 0;\n    }\n}`,
          python: `def findLargest(arr: list) -> int:\n    # TODO: Find max\n    pass`,
          javascript: `function findLargest(arr) {\n    // TODO: Find max\n    \n}`
        },
        sol: {
          cpp: `int findLargest(vector<int>& arr) { int mx = arr[0]; for(int x: arr) mx = max(mx, x); return mx; }`,
          java: `public static int findLargest(int[] arr) { int mx = arr[0]; for(int x: arr) mx = Math.max(mx, x); return mx; }`,
          python: `def findLargest(arr):\n    return max(arr)`,
          javascript: `function findLargest(arr) { return Math.max(...arr); }`
        }
      },
      challenge: {
        title: "Find Smallest Element",
        desc: "Given an array of integers arr, return the smallest element present.",
        constraints: "1 <= arr.length <= 10^5",
        functionName: "findSmallest",
        testCases: [
          { input: "[1,5,3,9,2]", expected: "1" },
          { input: "[-5,-2,-10]", expected: "-10" }
        ],
        hints: ["Similar to findLargest, but initialize min and look for smaller elements."],
        time: "O(N)", space: "O(1)",
        approach: "Hinglish: Pehle element ko min variable me save karke updates dynamic loop se ensure karein.",
        bp: {
          cpp: `#include <vector>\nusing namespace std;\n\nint findSmallest(vector<int>& arr) {\n    // TODO: Find min\n    \n}`,
          java: `public class Solution {\n    public static int findSmallest(int[] arr) {\n        // TODO: Find min\n        return 0;\n    }\n}`,
          python: `def findSmallest(arr: list) -> int:\n    # TODO: Find min\n    pass`,
          javascript: `function findSmallest(arr) {\n    // TODO: Find min\n    \n}`
        },
        sol: {
          cpp: `int findSmallest(vector<int>& arr) { int mn = arr[0]; for(int x: arr) mn = min(mn, x); return mn; }`,
          java: `public static int findSmallest(int[] arr) { int mn = arr[0]; for(int x: arr) mn = Math.min(mn, x); return mn; }`,
          python: `def findSmallest(arr):\n    return min(arr)`,
          javascript: `function findSmallest(arr) { return Math.min(...arr); }`
        }
      }
    },

    // 5. RECURSION BASICS
    recursion: {
      beginner: {
        title: "Sum of N Natural Numbers",
        desc: "Return the sum of first n natural numbers using recursion.",
        constraints: "1 <= n <= 1000",
        functionName: "sumN",
        testCases: [
          { input: "5", expected: "15" },
          { input: "10", expected: "55" }
        ],
        hints: ["Base case: if n == 1, return 1.", "Recursive case: return n + sumN(n - 1)."],
        time: "O(N)", space: "O(N)",
        approach: "Hinglish: Sum formula ya base recursive step: n + sumN(n-1) implement karein, n=1 pe return 1 karein.",
        bp: {
          cpp: `int sumN(int n) {\n    // TODO: Recursive sum\n    \n}`,
          java: `public class Solution {\n    public static int sumN(int n) {\n        // TODO: Recursive sum\n        return 0;\n    }\n}`,
          python: `def sumN(n: int) -> int:\n    # TODO: Recursive sum\n    pass`,
          javascript: `function sumN(n) {\n    // TODO: Recursive sum\n    \n}`
        },
        sol: {
          cpp: `int sumN(int n) { if(n<=1) return 1; return n + sumN(n-1); }`,
          java: `public static int sumN(int n) { if(n<=1) return 1; return n + sumN(n-1); }`,
          python: `def sumN(n):\n    if n<=1: return 1\n    return n + sumN(n-1)`,
          javascript: `function sumN(n) { if(n<=1) return 1; return n + sumN(n-1); }`
        }
      },
      easy: {
        title: "Fibonacci recursive",
        desc: "Return the N-th Fibonacci number. fib(0) = 0, fib(1) = 1.",
        constraints: "0 <= n <= 30",
        functionName: "fib",
        testCases: [
          { input: "5", expected: "5" },
          { input: "10", expected: "55" }
        ],
        hints: ["Base case: if n <= 0 return 0, if n == 1 return 1.", "Recursive case: return fib(n-1) + fib(n-2)."],
        time: "O(2^N)", space: "O(N)",
        approach: "Hinglish: Classical Fibonacci recursion path execute karein.",
        bp: {
          cpp: `int fib(int n) {\n    // TODO: Fibonacci\n    \n}`,
          java: `public class Solution {\n    public static int fib(int n) {\n        // TODO: Fibonacci\n        return 0;\n    }\n}`,
          python: `def fib(n: int) -> int:\n    # TODO: Fibonacci\n    pass`,
          javascript: `function fib(n) {\n    // TODO: Fibonacci\n    \n}`
        },
        sol: {
          cpp: `int fib(int n) { if(n<=0) return 0; if(n==1) return 1; return fib(n-1)+fib(n-2); }`,
          java: `public static int fib(int n) { if(n<=0) return 0; if(n==1) return 1; return fib(n-1)+fib(n-2); }`,
          python: `def fib(n):\n    if n<=0: return 0\n    if n==1: return 1\n    return fib(n-1)+fib(n-2)`,
          javascript: `function fib(n) { if(n<=0) return 0; if(n===1) return 1; return fib(n-1)+fib(n-2); }`
        }
      },
      medium: {
        title: "Factorial of N",
        desc: "Return the factorial of n recursively.",
        constraints: "0 <= n <= 12",
        functionName: "factorial",
        testCases: [
          { input: "5", expected: "120" },
          { input: "0", expected: "1" }
        ],
        hints: ["Base case: if n <= 1, return 1.", "Recursive case: return n * factorial(n - 1)."],
        time: "O(N)", space: "O(N)",
        bp: {
          cpp: `int factorial(int n) {\n    // TODO: Factorial\n    \n}`,
          java: `public class Solution {\n    public static int factorial(int n) {\n        // TODO: Factorial\n        return 1;\n    }\n}`,
          python: `def factorial(n: int) -> int:\n    # TODO: Factorial\n    pass`,
          javascript: `function factorial(n) {\n    // TODO: Factorial\n    \n}`
        },
        sol: {
          cpp: `int factorial(int n) { if(n<=1) return 1; return n * factorial(n-1); }`,
          java: `public static int factorial(int n) { if(n<=1) return 1; return n * factorial(n-1); }`,
          python: `def factorial(n):\n    if n<=1: return 1\n    return n * factorial(n-1)`,
          javascript: `function factorial(n) { if(n<=1) return 1; return n * factorial(n-1); }`
        }
      },
      challenge: {
        title: "String Palindrome Check",
        desc: "Check if a string is palindrome recursively.",
        constraints: "0 <= s.length <= 1000",
        functionName: "isPalindromeStr",
        testCases: [
          { input: "'radar'", expected: "true" },
          { input: "'hello'", expected: "false" }
        ],
        hints: ["Compare first and last characters.", "Recursively check substring excluding those ends."],
        time: "O(N)", space: "O(N)",
        bp: {
          cpp: `#include <string>\nusing namespace std;\n\nbool isPalindromeStr(string s) {\n    // TODO: Recursive check\n    \n}`,
          java: `public class Solution {\n    public static boolean isPalindromeStr(String s) {\n        // TODO: Recursive check\n        return false;\n    }\n}`,
          python: `def isPalindromeStr(s: str) -> bool:\n    # TODO: Recursive check\n    pass`,
          javascript: `function isPalindromeStr(s) {\n    // TODO: Recursive check\n    \n}`
        },
        sol: {
          cpp: `bool isPalindromeStr(string s) { if(s.length()<=1) return true; if(s[0]!=s[s.length()-1]) return false; return isPalindromeStr(s.substr(1, s.length()-2)); }`,
          java: `public static boolean isPalindromeStr(String s) { if(s.length()<=1) return true; if(s.charAt(0)!=s.charAt(s.length()-1)) return false; return isPalindromeStr(s.substring(1, s.length()-1)); }`,
          python: `def isPalindromeStr(s):\n    if len(s)<=1: return True\n    if s[0]!=s[-1]: return False\n    return isPalindromeStr(s[1:-1])`,
          javascript: `function isPalindromeStr(s) { if(s.length()<=1) return true; if(s[0]!==s[s.length-1]) return false; return isPalindromeStr(s.substring(1, s.length-1)); }`
        }
      }
    },

    // 6. BIT MANIPULATION
    bitmanip: {
      beginner: {
        title: "Power of Two",
        desc: "Return true if n is a power of two, false otherwise.",
        constraints: "-2^31 <= n <= 2^31 - 1",
        functionName: "isPowerOfTwo",
        testCases: [
          { input: "16", expected: "true" },
          { input: "14", expected: "false" }
        ],
        hints: ["If n <= 0, it cannot be power of two.", "Trick: n & (n - 1) removes the lowest set bit. If the result is 0, it was a power of two."],
        time: "O(1)", space: "O(1)",
        bp: {
          cpp: `bool isPowerOfTwo(int n) {\n    // TODO: Power of two check\n    \n}`,
          java: `public class Solution {\n    public static boolean isPowerOfTwo(int n) {\n        // TODO: Power of two check\n        return false;\n    }\n}`,
          python: `def isPowerOfTwo(n: int) -> bool:\n    # TODO: Power of two check\n    pass`,
          javascript: `function isPowerOfTwo(n) {\n    // TODO: Power of two check\n    \n}`
        },
        sol: {
          cpp: `bool isPowerOfTwo(int n) { return n > 0 && (n & (n - 1)) == 0; }`,
          java: `public static boolean isPowerOfTwo(int n) { return n > 0 && (n & (n - 1)) == 0; }`,
          python: `def isPowerOfTwo(n):\n    return n > 0 and (n & (n - 1)) == 0`,
          javascript: `function isPowerOfTwo(n) { return n > 0 && (n & (n - 1)) === 0; }`
        }
      },
      easy: {
        title: "Count Set Bits",
        desc: "Count number of set (1) bits in an integer n.",
        constraints: "0 <= n <= 2^31 - 1",
        functionName: "countSetBits",
        testCases: [
          { input: "11", expected: "3" },
          { input: "128", expected: "1" }
        ],
        hints: ["Loop while n is not zero.", "Increment count with 'n & 1', then shift n right: 'n >>= 1'."],
        time: "O(log N)", space: "O(1)",
        bp: {
          cpp: `int countSetBits(int n) {\n    // TODO: Count set bits\n    \n}`,
          java: `public class Solution {\n    public static int countSetBits(int n) {\n        // TODO: Count set bits\n        return 0;\n    }\n}`,
          python: `def countSetBits(n: int) -> int:\n    # TODO: Count set bits\n    pass`,
          javascript: `function countSetBits(n) {\n    // TODO: Count set bits\n    \n}`
        },
        sol: {
          cpp: `int countSetBits(int n) { int c=0; while(n){ c += n&1; n >>= 1; } return c; }`,
          java: `public static int countSetBits(int n) { return Integer.bitCount(n); }`,
          python: `def countSetBits(n):\n    return bin(n).count('1')`,
          javascript: `function countSetBits(n) { let c=0; while(n){ c+=n&1; n>>=1; } return c; }`
        }
      },
      medium: {
        title: "Single Number",
        desc: "In an array, every element appears twice except one. Find that single number.",
        constraints: "1 <= arr.length <= 10^5",
        functionName: "singleNumber",
        testCases: [
          { input: "[2,2,1]", expected: "1" },
          { input: "[4,1,2,1,2]", expected: "4" }
        ],
        hints: ["Use XOR operator '^'.", "XORing a number with itself gives 0, XORing with 0 gives the number itself."],
        time: "O(N)", space: "O(1)",
        bp: {
          cpp: `#include <vector>\nusing namespace std;\n\nint singleNumber(vector<int>& arr) {\n    // TODO: Find single\n    \n}`,
          java: `public class Solution {\n    public static int singleNumber(int[] arr) {\n        // TODO: Find single\n        return 0;\n    }\n}`,
          python: `def singleNumber(arr: list) -> int:\n    # TODO: Find single\n    pass`,
          javascript: `function singleNumber(arr) {\n    // TODO: Find single\n    \n}`
        },
        sol: {
          cpp: `int singleNumber(vector<int>& arr) { int res=0; for(int x: arr) res ^= x; return res; }`,
          java: `public static int singleNumber(int[] arr) { int res=0; for(int x: arr) res ^= x; return res; }`,
          python: `def singleNumber(arr):\n    res = 0\n    for x in arr: res ^= x\n    return res`,
          javascript: `function singleNumber(arr) { return arr.reduce((a,b)=>a^b, 0); }`
        }
      },
      challenge: {
        title: "Bit Swap Required",
        desc: "Return the number of bits needed to flip to convert integer A to B.",
        constraints: "0 <= A, B <= 2^31 - 1",
        functionName: "bitsFlipped",
        testCases: [
          { input: "10, 20", expected: "4" },
          { input: "7, 10", expected: "3" }
        ],
        hints: ["XOR A and B to find differing bits.", "Count the set bits in the result."],
        time: "O(log(A^B))", space: "O(1)",
        bp: {
          cpp: `int bitsFlipped(int a, int b) {\n    // TODO: Find bit difference\n    \n}`,
          java: `public class Solution {\n    public static int bitsFlipped(int a, int b) {\n        // TODO: Find bit difference\n        return 0;\n    }\n}`,
          python: `def bitsFlipped(a: int, b: int) -> int:\n    # TODO: Find bit difference\n    pass`,
          javascript: `function bitsFlipped(a, b) {\n    // TODO: Find bit difference\n    \n}`
        },
        sol: {
          cpp: `int bitsFlipped(int a, int b) { int diff=a^b; int c=0; while(diff){ c += diff&1; diff >>= 1; } return c; }`,
          java: `public static int bitsFlipped(int a, int b) { return Integer.bitCount(a ^ b); }`,
          python: `def bitsFlipped(a, b):\n    return bin(a^b).count('1')`,
          javascript: `function bitsFlipped(a, b) { let diff=a^b; let c=0; while(diff){ c+=diff&1; diff>>=1; } return c; }`
        }
      }
    },

    // 7. DYNAMIC PROGRAMMING
    dp: {
      beginner: {
        title: "Fibonacci DP",
        desc: "Solve Fibonacci using Dynamic Programming (Memoization or Tabulation) in O(N) time and O(1) space.",
        constraints: "0 <= n <= 45",
        functionName: "fibDP",
        testCases: [
          { input: "5", expected: "5" },
          { input: "10", expected: "55" }
        ],
        hints: ["Maintain two variables to keep track of the last two values.", "Loop up to n, updating variables at each step."],
        time: "O(N)", space: "O(1)",
        bp: {
          cpp: `int fibDP(int n) {\n    // TODO: DP Fibonacci\n    \n}`,
          java: `public class Solution {\n    public static int fibDP(int n) {\n        // TODO: DP Fibonacci\n        return 0;\n    }\n}`,
          python: `def fibDP(n: int) -> int:\n    # TODO: DP Fibonacci\n    pass`,
          javascript: `function fibDP(n) {\n    // TODO: DP Fibonacci\n    \n}`
        },
        sol: {
          cpp: `int fibDP(int n) { if(n<=0) return 0; if(n==1) return 1; int a=0, b=1; for(int i=2; i<=n; i++) { int c=a+b; a=b; b=c; } return b; }`,
          java: `public static int fibDP(int n) { if(n<=0) return 0; if(n==1) return 1; int a=0, b=1; for(int i=2; i<=n; i++) { int c=a+b; a=b; b=c; } return b; }`,
          python: `def fibDP(n):\n    if n<=0: return 0\n    if n==1: return 1\n    a, b = 0, 1\n    for _ in range(2, n+1):\n        a, b = b, a+b\n    return b`,
          javascript: `function fibDP(n) { if(n<=0) return 0; if(n===1) return 1; let a=0, b=1; for(let i=2; i<=n; i++) { let c=a+b; a=b; b=c; } return b; }`
        }
      },
      easy: {
        title: "Climbing Stairs",
        desc: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. Return total distinct ways.",
        constraints: "1 <= n <= 45",
        functionName: "climbStairs",
        testCases: [
          { input: "2", expected: "2" },
          { input: "3", expected: "3" }
        ],
        hints: ["Similar to Fibonacci. Ways to reach step n = ways(n - 1) + ways(n - 2).", "Base cases: 1 step = 1 way, 2 steps = 2 ways."],
        time: "O(N)", space: "O(1)",
        bp: {
          cpp: `int climbStairs(int n) {\n    // TODO: Climb stairs\n    \n}`,
          java: `public class Solution {\n    public static int climbStairs(int n) {\n        // TODO: Climb stairs\n        return 0;\n    }\n}`,
          python: `def climbStairs(n: int) -> int:\n    # TODO: Climb stairs\n    pass`,
          javascript: `function climbStairs(n) {\n    // TODO: Climb stairs\n    \n}`
        },
        sol: {
          cpp: `int climbStairs(int n) { if(n<=2) return n; int a=1, b=2; for(int i=3; i<=n; i++) { int c=a+b; a=b; b=c; } return b; }`,
          java: `public static int climbStairs(int n) { if(n<=2) return n; int a=1, b=2; for(int i=3; i<=n; i++) { int c=a+b; a=b; b=c; } return b; }`,
          python: `def climbStairs(n):\n    if n<=2: return n\n    a, b = 1, 2\n    for _ in range(3, n+1): a, b = b, a+b\n    return b`,
          javascript: `function climbStairs(n) { if(n<=2) return n; let a=1, b=2; for(let i=3; i<=n; i++) { let c=a+b; a=b; b=c; } return b; }`
        }
      },
      medium: {
        title: "Minimum Path Sum",
        desc: "Solve standard minimum grid path sum logic recursively or iteratively.",
        constraints: "N=1 case simulation. (climbStairs representation fallback)",
        functionName: "climbStairs", // Fallback simulation
        testCases: [{ input: "5", expected: "8" }],
        hints: ["Recursive DP base simulation."],
        time: "O(N)", space: "O(1)",
        bp: {
          cpp: `int climbStairs(int n) {\n    // TODO: Resolve sum\n    \n}`,
          java: `public class Solution {\n    public static int climbStairs(int n) {\n        return 0;\n    }\n}`,
          python: `def climbStairs(n):\n    pass`,
          javascript: `function climbStairs(n) {\n    \n}`
        },
        sol: {
          cpp: `int climbStairs(int n) { if(n<=2) return n; int a=1, b=2; for(int i=3; i<=n; i++) { int c=a+b; a=b; b=c; } return b; }`,
          java: `public static int climbStairs(int n) { if(n<=2) return n; int a=1, b=2; for(int i=3; i<=n; i++) { int c=a+b; a=b; b=c; } return b; }`,
          python: `def climbStairs(n):\n    if n<=2: return n\n    a, b = 1, 2\n    for _ in range(3, n+1): a, b = b, a+b\n    return b`,
          javascript: `function climbStairs(n) { if(n<=2) return n; let a=1, b=2; for(let i=3; i<=n; i++) { let c=a+b; a=b; b=c; } return b; }`
        }
      },
      challenge: {
        title: "Optimal Path DP",
        desc: "Advanced climbStairs representation for Placement level.",
        constraints: "N=1 case simulation.",
        functionName: "climbStairs", // Fallback simulation
        testCases: [{ input: "10", expected: "89" }],
        hints: ["Highly optimized DP step."],
        time: "O(N)", space: "O(1)",
        bp: {
          cpp: `int climbStairs(int n) {\n    \n}`,
          java: `public class Solution {\n    public static int climbStairs(int n) {\n        return 0;\n    }\n}`,
          python: `def climbStairs(n):\n    pass`,
          javascript: `function climbStairs(n) {\n    \n}`
        },
        sol: {
          cpp: `int climbStairs(int n) { if(n<=2) return n; int a=1, b=2; for(int i=3; i<=n; i++) { int c=a+b; a=b; b=c; } return b; }`,
          java: `public static int climbStairs(int n) { if(n<=2) return n; int a=1, b=2; for(int i=3; i<=n; i++) { int c=a+b; a=b; b=c; } return b; }`,
          python: `def climbStairs(n):\n    if n<=2: return n\n    a, b = 1, 2\n    for _ in range(3, n+1): a, b = b, a+b\n    return b`,
          javascript: `function climbStairs(n) { if(n<=2) return n; let a=1, b=2; for(let i=3; i<=n; i++) { let c=a+b; a=b; b=c; } return b; }`
        }
      }
    }
  };

  // â”€â”€â”€ CATEGORY MATCHING â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  let category = 'basics';
  if (t.includes('start coding')) {
    category = 'basics'; // "Start Coding" module uses basics catalog for its final challenge
  } else if (t.includes('printing') || t.includes('variable')) {
    category = 'printing';
  } else if (t.includes('data type') || t.includes('i/o') || t.includes('input') || t.includes('operator')) {
    category = 'datatypes';
  } else if (t.includes('condition') || t.includes('logic') || t.includes('decision') || t.includes('if')) {
    category = 'conditions';
  } else if (t.includes('loop') || t.includes('iteration') || t.includes('while') || t.includes('for')) {
    category = 'loops';
  } else if (t.includes('function')) {
    category = 'functions';
  } else if (t.includes('logical') || t.includes('pattern')) {
    category = 'patterns';
  } else if (t.includes('math')) {
    category = 'math';
  } else if (t.includes('array')) {
    category = 'array';
  } else if (t.includes('recursion')) {
    category = 'recursion';
  } else if (t.includes('bit')) {
    category = 'bitmanip';
  } else if (t.includes('dp') || t.includes('dynamic') || t.includes('grid') || t.includes('climb') || t.includes('greedy') || t.includes('shortest') || t.includes('topo')) {
    category = 'dp';
  }

  const q = catalog[category]?.[diff] || catalog.basics.beginner;

  return {
    youtubeVideoId: getVideo(),
    youtubePlaylistId: getPlaylist(),
    challengeDescription: q.desc,
    approach: q.approach,
    code: q.sol[lang] || '',
    editorBoilerplate: q.bp[lang] || '',
    timeComplexity: q.time,
    spaceComplexity: q.space,
    testCases: q.testCases,
    functionKey: category,
    functionName: q.functionName,
    hints: q.hints,
    constraints: q.constraints,
    notes: `Select the difficulity rank from the Progression Ladder above to gradually unlock challenges.`,
    recommendations: `Complete all 4 Progression Ladder steps to earn your Badge for this Level!`,
    resources: [
      { name: 'Striver A2Z DSA Sheet', url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/' },
      { name: 'CareerForge DSA Community Playground', url: 'https://leetcode.com' },
    ],
  };
};

// â”€â”€â”€ CHECKPOINT CONTENT: One content block per checkpoint per language â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// CHECKPOINT CONTENT ENGINE
// 3 unique checkpoints â†’ 3 unique videos â†’ 3 progressive challenges
// Video 1: EAR7De6Goz4  (Checkpoint 1 - Intro)
// Video 2: FPu9Uld7W-E  (Checkpoint 2 - Variables, Conditions)
// Video 3: tNm_NNSB3_w  (Checkpoint 3 - Loops, Logic)
// Each video is used EXACTLY ONCE. No repetition.
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const getCheckpointContent = (checkpointId, lang = 'cpp') => {
  if (checkpointId && checkpointId.startsWith('arr_cp')) {
    return getArraysCheckpointContent(checkpointId, lang);
  }
  if (checkpointId && checkpointId.startsWith('hash_cp')) {
    return getHashingCheckpointContent(checkpointId, lang);
  }
  if (checkpointId && checkpointId.startsWith('rec_cp')) {
    return getRecursionCheckpointContent(checkpointId, lang);
  }
  if (checkpointId && checkpointId.startsWith('ll_cp')) {
    return getLinkedListCheckpointContent(checkpointId, lang);
  }
  if (checkpointId && checkpointId.startsWith('sq_cp')) {
    return getStackQueueCheckpointContent(checkpointId, lang);
  }
  if (checkpointId && checkpointId.startsWith('tree_cp')) {
    return getTreesCheckpointContent(checkpointId, lang);
  }
  if (checkpointId && checkpointId.startsWith('graph_cp')) {
    return getGraphCheckpointContent(checkpointId, lang);
  }
  if (checkpointId && checkpointId.startsWith('dp_cp')) {
    return getDpCheckpointContent(checkpointId, lang);
  }
  if (checkpointId && checkpointId.startsWith('greedy_cp')) {
    return getGreedyCheckpointContent(checkpointId, lang);
  }
  const language = (lang || 'cpp').toLowerCase();



  // â”€â”€â”€ THE 3 CHECKPOINTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Each checkpoint has ONE unique video + ONE coding challenge
  // Videos are NEVER repeated across checkpoints
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const checkpoints = {

    // â”€â”€â”€ CHECKPOINT 1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // VIDEO: https://www.youtube.com/watch?v=EAR7De6Goz4&t=4s
    // TOPIC: Intro to Programming â€” first program, basic output, syntax
    // CHALLENGE: Very basic â†’ print, I/O, simple output
    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    cp1: {
      title: 'Intro to Programming',
      subtitle: 'Your first program â€” syntax, output, and the Hello World ritual.',
      videoEmbedUrl: 'https://www.youtube.com/embed/EAR7De6Goz4?start=4&rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Print Your Name',
          desc: `You just watched how to set up a program and write your first line of code.\n\nNow it's your turn!\n\nWrite a function called greetCoder() that returns the string "I am a Coder!" exactly as shown.\n\nðŸŽ¯ Think of this as writing your first real program. Make the compiler smile.`,
          functionName: 'greetCoder',
          constraints: 'None â€” just return the exact string.',
          testCases: [
            { input: '', expected: 'I am a Coder!' }
          ],
          hints: [
            'Return the string exactly â€” check capitalization and punctuation.',
            'In C++, a string function needs #include <string> and return type string.',
            'The function takes no parameters â€” just return the fixed string.'
          ],
          bp: `#include <string>\nusing namespace std;\n\nstring greetCoder() {\n    // Your first line of code!\n    // Return the string: "I am a Coder!"\n    \n}`,
          sol: `string greetCoder() { return "I am a Coder!"; }`
        },
        java: {
          title: 'Print Your Name',
          desc: `You just watched how to set up a Java program.\n\nNow write a function greetCoder() that returns "I am a Coder!"\n\nðŸŽ¯ This is your first Java function. Make the JVM happy!`,
          functionName: 'greetCoder',
          constraints: 'None',
          testCases: [{ input: '', expected: 'I am a Coder!' }],
          hints: ['Return the string exactly as shown.', 'The return type is String.'],
          bp: `public class Solution {\n    public static String greetCoder() {\n        // Return: "I am a Coder!"\n        return "";\n    }\n}`,
          sol: `public static String greetCoder() { return "I am a Coder!"; }`
        },
        python: {
          title: 'Print Your Name',
          desc: `You just saw your first Python program.\n\nWrite a function greet_coder() that returns "I am a Coder!"\n\nðŸŽ¯ Clean, simple, powerful â€” that's Python!`,
          functionName: 'greet_coder',
          constraints: 'None',
          testCases: [{ input: '', expected: 'I am a Coder!' }],
          hints: ['Use return to send back a value.', 'String is in double quotes.'],
          bp: `def greet_coder() -> str:\n    # Return: "I am a Coder!"\n    pass`,
          sol: `def greet_coder():\n    return "I am a Coder!"`
        },
        javascript: {
          title: 'Print Your Name',
          desc: `You just learned your first JavaScript syntax!\n\nWrite a function greetCoder() that returns "I am a Coder!"\n\nðŸŽ¯ The browser is your playground. Let's code!`,
          functionName: 'greetCoder',
          constraints: 'None',
          testCases: [{ input: '', expected: 'I am a Coder!' }],
          hints: ['Use the return keyword.', 'Strings can use single or double quotes.'],
          bp: `function greetCoder() {\n    // Return: "I am a Coder!"\n    \n}`,
          sol: `function greetCoder() { return "I am a Coder!"; }`
        }
      }
    },

    // â”€â”€â”€ CHECKPOINT 2 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // VIDEO: https://www.youtube.com/watch?v=FPu9Uld7W-E&list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz&index=4
    // TOPIC: Variables, Data Types, Conditions â€” store data and make decisions
    // CHALLENGE: Beginner logic â†’ variables, conditions, if-else
    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    cp2: {
      title: 'Variables & Conditions',
      subtitle: 'Store data in variables, compare values, make your code decide.',
      videoEmbedUrl: 'https://www.youtube.com/embed/FPu9Uld7W-E?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Even or Odd?',
          desc: `You just learned variables, data types, and if-else conditions.\n\nNow apply that knowledge!\n\nWrite a function checkEvenOdd(n) that:\nâ€¢ Returns "Even" if n is divisible by 2\nâ€¢ Returns "Odd" if n is not divisible by 2\n\nðŸŽ¯ Use the modulo operator % â€” if n % 2 equals 0, the number is Even.`,
          functionName: 'checkEvenOdd',
          constraints: '-10^5 <= n <= 10^5',
          testCases: [
            { input: '4', expected: 'Even' },
            { input: '7', expected: 'Odd' },
            { input: '0', expected: 'Even' }
          ],
          hints: [
            'Use the % (modulo) operator: n % 2 gives the remainder when n is divided by 2.',
            'If the remainder is 0, the number is Even. Otherwise it is Odd.',
            'Use an if-else statement to return the correct string.'
          ],
          bp: `#include <string>\nusing namespace std;\n\nstring checkEvenOdd(int n) {\n    // Use % to check divisibility\n    // Return "Even" or "Odd"\n    \n}`,
          sol: `string checkEvenOdd(int n) { return n % 2 == 0 ? "Even" : "Odd"; }`
        },
        java: {
          title: 'Even or Odd?',
          desc: `You learned about variables and conditions in Java.\n\nWrite a function checkEvenOdd(n) that returns "Even" if n % 2 == 0, else returns "Odd".\n\nðŸŽ¯ Use an if-else statement â€” the core of decision making!`,
          functionName: 'checkEvenOdd',
          constraints: '-10^5 <= n <= 10^5',
          testCases: [
            { input: '4', expected: 'Even' },
            { input: '7', expected: 'Odd' },
            { input: '0', expected: 'Even' }
          ],
          hints: ['n % 2 == 0 means Even.', 'Use if-else to return "Even" or "Odd".'],
          bp: `public class Solution {\n    public static String checkEvenOdd(int n) {\n        // Check if even or odd\n        return "";\n    }\n}`,
          sol: `public static String checkEvenOdd(int n) { return n % 2 == 0 ? "Even" : "Odd"; }`
        },
        python: {
          title: 'Even or Odd?',
          desc: `Great â€” you now know Python variables and conditions!\n\nWrite check_even_odd(n) that returns "Even" or "Odd".\n\nðŸŽ¯ Python's if-else is clean and readable â€” enjoy!`,
          functionName: 'check_even_odd',
          constraints: '-10^5 <= n <= 10^5',
          testCases: [
            { input: '4', expected: 'Even' },
            { input: '7', expected: 'Odd' },
            { input: '0', expected: 'Even' }
          ],
          hints: ['n % 2 == 0 â†’ Even.', 'Use a simple if-else.'],
          bp: `def check_even_odd(n: int) -> str:\n    # Return "Even" or "Odd"\n    pass`,
          sol: `def check_even_odd(n):\n    return "Even" if n % 2 == 0 else "Odd"`
        },
        javascript: {
          title: 'Even or Odd?',
          desc: `You now understand variables and conditionals in JavaScript!\n\nWrite checkEvenOdd(n) that returns "Even" or "Odd".\n\nðŸŽ¯ Use ternary operator or if-else â€” your choice!`,
          functionName: 'checkEvenOdd',
          constraints: '-10^5 <= n <= 10^5',
          testCases: [
            { input: '4', expected: 'Even' },
            { input: '7', expected: 'Odd' },
            { input: '0', expected: 'Even' }
          ],
          hints: ['n % 2 === 0 â†’ Even.', 'Return strings "Even" or "Odd".'],
          bp: `function checkEvenOdd(n) {\n    // Return "Even" or "Odd"\n    \n}`,
          sol: `function checkEvenOdd(n) { return n % 2 === 0 ? "Even" : "Odd"; }`
        }
      }
    },

    // â”€â”€â”€ CHECKPOINT 3 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // VIDEO: https://www.youtube.com/watch?v=tNm_NNSB3_w&list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz&index=5
    // TOPIC: Loops, Patterns, Iteration â€” repeat actions and build logic
    // CHALLENGE: Stronger logic â†’ loops, accumulation, iteration
    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    cp3: {
      title: 'Loops & Logic Building',
      subtitle: 'Make your code repeat, accumulate, and iterate â€” the real power of programming.',
      videoEmbedUrl: 'https://www.youtube.com/embed/tNm_NNSB3_w?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Sum from 1 to N',
          desc: `You just learned about loops â€” the engine that makes code repeat!\n\nNow put that power to work:\n\nWrite a function sumToN(n) that calculates the sum of all integers from 1 to n.\n\nExample: sumToN(5) = 1 + 2 + 3 + 4 + 5 = 15\n\nðŸŽ¯ Use a for loop. Start at 1, go up to n, and keep adding to a running total.`,
          functionName: 'sumToN',
          constraints: '1 <= n <= 10000',
          testCases: [
            { input: '5', expected: '15' },
            { input: '10', expected: '55' },
            { input: '100', expected: '5050' }
          ],
          hints: [
            'Create a variable called sum and set it to 0.',
            'Use a for loop: for(int i = 1; i <= n; i++)',
            'Inside the loop, add i to sum each iteration.',
            'After the loop, return sum.'
          ],
          bp: `int sumToN(int n) {\n    // Build a loop from 1 to n\n    // Keep adding each number to a total\n    // Return the total\n    \n}`,
          sol: `int sumToN(int n) { int s = 0; for(int i = 1; i <= n; i++) s += i; return s; }`
        },
        java: {
          title: 'Sum from 1 to N',
          desc: `Loops are your superpower!\n\nWrite sumToN(n) that returns 1+2+3+...+n.\n\nExample: sumToN(5) = 15\n\nðŸŽ¯ Use a for loop and a running total variable.`,
          functionName: 'sumToN',
          constraints: '1 <= n <= 10000',
          testCases: [
            { input: '5', expected: '15' },
            { input: '10', expected: '55' },
            { input: '100', expected: '5050' }
          ],
          hints: ['int sum = 0; then loop from 1 to n.', 'sum += i inside the loop.', 'return sum at the end.'],
          bp: `public class Solution {\n    public static int sumToN(int n) {\n        // Loop from 1 to n, accumulate sum\n        return 0;\n    }\n}`,
          sol: `public static int sumToN(int n) { int s = 0; for(int i = 1; i <= n; i++) s += i; return s; }`
        },
        python: {
          title: 'Sum from 1 to N',
          desc: `You now know Python loops!\n\nWrite sum_to_n(n) that returns the sum of 1 through n.\n\nExample: sum_to_n(5) = 15\n\nðŸŽ¯ Use a for loop or Python's built-in sum/range.`,
          functionName: 'sum_to_n',
          constraints: '1 <= n <= 10000',
          testCases: [
            { input: '5', expected: '15' },
            { input: '10', expected: '55' },
            { input: '100', expected: '5050' }
          ],
          hints: ['Use range(1, n+1) in a for loop.', 'Or use sum(range(1, n+1)) directly.'],
          bp: `def sum_to_n(n: int) -> int:\n    # Sum all integers from 1 to n\n    pass`,
          sol: `def sum_to_n(n):\n    return sum(range(1, n + 1))`
        },
        javascript: {
          title: 'Sum from 1 to N',
          desc: `JavaScript loops are your new tool!\n\nWrite sumToN(n) that returns 1+2+...+n.\n\nExample: sumToN(5) = 15\n\nðŸŽ¯ Use a for loop and a counter variable.`,
          functionName: 'sumToN',
          constraints: '1 <= n <= 10000',
          testCases: [
            { input: '5', expected: '15' },
            { input: '10', expected: '55' },
            { input: '100', expected: '5050' }
          ],
          hints: ['let sum = 0; then loop i from 1 to n.', 'sum += i inside the loop.', 'return sum.'],
          bp: `function sumToN(n) {\n    // Loop and accumulate\n    \n}`,
          sol: `function sumToN(n) { let s = 0; for(let i = 1; i <= n; i++) s += i; return s; }`
        }
      }
    },
    cp4: {
      title: 'STL & Collections',
      subtitle: 'Learn vectors, lists, sets, maps, and dynamic containers.',
      videoEmbedUrl: 'https://www.youtube.com/embed/RRVYpIET_RU?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Collection Sum',
          desc: `Standard Template Library (STL) allows you to use dynamic containers like vector instead of raw arrays.\n\nWrite a function sumOfCollection(vec) that returns the sum of all elements in a C++ vector.`,
          functionName: 'sumOfCollection',
          constraints: '1 <= vec.size() <= 10^4',
          testCases: [
            { input: '[1, 2, 3, 4, 5]', expected: '15' },
            { input: '[10, -2, 5]', expected: '13' }
          ],
          hints: [
            'Use a range-based for loop: for(int x : vec)',
            'Or use std::accumulate(vec.begin(), vec.end(), 0).'
          ],
          bp: `#include <vector>\nusing namespace std;\n\nint sumOfCollection(vector<int>& vec) {\n    // Accumulate sum of vector elements\n    \n}`,
          sol: `int sumOfCollection(vector<int>& vec) {\n    int sum = 0;\n    for(int x : vec) sum += x;\n    return sum;\n}`
        },
        java: {
          title: 'Collection Sum',
          desc: `In Java, the Collections Framework provides dynamic lists like List and ArrayList.\n\nWrite a function sumOfCollection(list) that returns the sum of all elements in a List.`,
          functionName: 'sumOfCollection',
          constraints: '1 <= list.size() <= 10^4',
          testCases: [
            { input: 'java.util.Arrays.asList(1, 2, 3, 4, 5)', expected: '15' },
            { input: 'java.util.Arrays.asList(10, -2, 5)', expected: '13' }
          ],
          hints: [
            'Use a standard enhanced for-loop: for(int x : list)',
            'Accumulate the values and return.'
          ],
          bp: `import java.util.List;\n\npublic class Solution {\n    public static int sumOfCollection(List<Integer> list) {\n        // Sum the list elements\n        return 0;\n    }\n}`,
          sol: `public static int sumOfCollection(List<Integer> list) {\n    int sum = 0;\n    for(int x : list) sum += x;\n    return sum;\n}`
        },
        python: {
          title: 'Collection Sum',
          desc: `Python has built-in lists which act as dynamic collections.\n\nWrite a function sum_of_collection(lst) that returns the sum of all elements in the list.`,
          functionName: 'sum_of_collection',
          constraints: '1 <= len(lst) <= 10^4',
          testCases: [
            { input: '[1, 2, 3, 4, 5]', expected: '15' },
            { input: '[10, -2, 5]', expected: '13' }
          ],
          hints: [
            'You can use the built-in sum() function directly.',
            'Or iterate through the list and sum elements.'
          ],
          bp: `def sum_of_collection(lst: list) -> int:\n    # Return the sum of list elements\n    pass`,
          sol: `def sum_of_collection(lst):\n    return sum(lst)`
        },
        javascript: {
          title: 'Collection Sum',
          desc: `In JavaScript, arrays are dynamic collections by default.\n\nWrite a function sumOfCollection(arr) that returns the sum of all elements in the array.`,
          functionName: 'sumOfCollection',
          constraints: '1 <= arr.length <= 10^4',
          testCases: [
            { input: '[1, 2, 3, 4, 5]', expected: '15' },
            { input: '[10, -2, 5]', expected: '13' }
          ],
          hints: [
            'Iterate using a for...of loop.',
            'Or use the reduce() method.'
          ],
          bp: `function sumOfCollection(arr) {\n    // Return the sum of array elements\n    \n}`,
          sol: `function sumOfCollection(arr) {\n    return arr.reduce((acc, curr) => acc + curr, 0);\n}`
        }
      }
    }
  };

  const cp = checkpoints[checkpointId];
  if (!cp) return null;

  // Pick language-specific challenge (fallback to cpp)
  const langChallenge = cp.challenges[language] || cp.challenges.cpp;
  const isLastCheckpoint = checkpointId === 'cp4';

  return {
    title: cp.title,
    subtitle: cp.subtitle,
    // Each checkpoint has its own unique embed URL â€” NEVER repeated
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
