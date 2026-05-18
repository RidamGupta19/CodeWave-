// DSA Content Engine - Striver A2Z Aligned with 4 Unlockable Difficulty Levels per Topic
// Boilerplates are strictly minimal starters (only imports + class/function signatures) - NO solutions/loops prefilled.

export const getDsaLanguageContent = (topicTitle, languageKey = 'cpp', difficulty = 'beginner', useStriverAdvanced = false) => {
  const t = (topicTitle || '').toLowerCase();
  const lang = (languageKey || 'cpp').toLowerCase();
  const diff = (difficulty || 'beginner').toLowerCase();

  // ─── STRIVER A2Z VIDEO MAP ───────────────────────────────────────────────
  const striverVideos = {
    basics:     'EAR7De6Goz4',
    patterns:   'tNm_NNSB3_w',
    math:       '1xNbjMdrlGY',
    stl:        'RRVYpIET_RU',
    array_easy: '37E9ckMDdTk',
    array_med:  'tp8JIuCXBaU',
    array_hard: '9S_p4M7h9Dk',
    hashing:    'KEs5UyBJ39g',
    recursion:  'un6PybaEisA',
    backtrack:  'nwjZ24S_ueM',
    ll_intro:   'q8gipE-hy80',
    ll_med:     'D2vI2NwJgdU',
    stack_q:    'gyPa_m8fW-w',
    monotonic:  '7PrS72_jwAY',
    bintree:    'l_7V5uYI2G0',
    bst:        'fAfR_MstP00',
    graph:      'M3_pLsDdeuU',
    topo_dsu:   'V63W7p_p4uE',
    shortest:   'XpkfK_Mh6vA',
    dp_intro:   'tyB0ztf0DNY',
    dp_grid:    '7cELW7O_E9k',
    greedy:     'n59vC9nJreU',
    bitmanip:   '5rtVTYAk9KQ',
    heap:       'HqPJF2L5h9U',
    trie:       'dBGUmUQhjaM',
  };

  // ─── STRIVER A2Z TOPIC-SPECIFIC PLAYLIST MAP ──────────────────────────────
  const striverPlaylists = {
    basics:     'PLgUwDviBHe0oF1vOXpxS_5t8s_D3E9A9_', // Learn the Basics / Foundations
    patterns:   'PLgUwDviBHe0oF1vOXpxS_5t8s_D3E9A9_',
    math:       'PLgUwDviBHe0oF1vOXpxS_5t8s_D3E9A9_',
    stl:        'PLgUwDviBHe0oF1vOXpxS_5t8s_D3E9A9_',
    array:      'PLgUwDviBIf0rENwdL0nEH0uGom9no0nyB', // Dedicated Arrays Playlist
    hashing:    'PLgUwDviBHe0oF1vOXpxS_5t8s_D3E9A9_',
    recursion:  'PLgUwDviBHe0rGlzUA9SfOviYLgNgGdO9B', // Dedicated Recursion & Backtracking Playlist
    backtrack:  'PLgUwDviBHe0rGlzUA9SfOviYLgNgGdO9B',
    ll:         'PLgUwDviBHe0rAuz8tVcM0AymmTRyGpCYc', // Dedicated Linked List Playlist
    stack_q:    'PLgUwDviBHe0pOd51giiqQL1c08xHdyIM_', // Dedicated Stack & Queue Playlist
    tree:       'PLgUwDviBHe0qAstgDqgPT2WAHE5-Xlhly', // Dedicated Binary Trees / BST Playlist
    graph:      'PLgUwDviBHe0oE3gA41TKO2H5bUpdZwGrY', // Dedicated Graphs Playlist
    dp:         'PLgUwDviBHe0qGDkClgDcMbFV85fs-4iGP', // Dedicated DP Playlist
    greedy:     'PLgUwDviBHe0rFrFrA8HqYkQz24Q_l94vA', // Dedicated Greedy Algorithms Playlist
    bitmanip:   'PLgUwDviBHe0rV2mP7r4yIu46B708Gg5b2', // Dedicated Bit Manipulation Playlist
    heap:       'PLgUwDviBHe0oX5J_N-eJd85WvSnU-P4k4', // Dedicated Heap/Priority Queue/Trie Playlist
    trie:       'PLgUwDviBHe0oX5J_N-eJd85WvSnU-P4k4',
  };

  const getPlaylist = () => {
    if (t.includes('basics') || t.includes('foundation') || t.includes('thinking')) return striverPlaylists.basics;
    if (t.includes('pattern')) return striverPlaylists.patterns;
    if (t.includes('math')) return striverPlaylists.math;
    if (t.includes('stl') || t.includes('collection')) return striverPlaylists.stl;
    if (t.includes('array')) return striverPlaylists.array;
    if (t.includes('hash')) return striverPlaylists.hashing;
    if (t.includes('backtrack') || t.includes('recursion') || t.includes('fibonacci') || t.includes('subsequence')) return striverPlaylists.recursion;
    if (t.includes('linked list') || t.includes('introduction to ll') || t.includes('ll warrior') || t.includes('reverse ll')) return striverPlaylists.ll;
    if (t.includes('stack') || t.includes('queue') || t.includes('monotonic')) return striverPlaylists.stack_q;
    if (t.includes('binary tree') || t.includes('tree traversal') || t.includes('bst') || t.includes('tree master') || t.includes('tree prop')) return striverPlaylists.tree;
    if (t.includes('graph') || t.includes('bfs') || t.includes('dfs') || t.includes('topo') || t.includes('dsu') || t.includes('shortest') || t.includes('dijkstra')) return striverPlaylists.graph;
    if (t.includes('dp') || t.includes('dynamic') || t.includes('grid') || t.includes('knapsack')) return striverPlaylists.dp;
    if (t.includes('greedy')) return striverPlaylists.greedy;
    if (t.includes('bit')) return striverPlaylists.bitmanip;
    if (t.includes('heap')) return striverPlaylists.heap;
    if (t.includes('trie')) return striverPlaylists.trie;
    return striverPlaylists.basics;
  };

  const getVideo = () => {
    if (t.includes('basics') || t.includes('foundation') || t.includes('thinking')) return striverVideos.basics;
    if (t.includes('pattern')) return striverVideos.patterns;
    if (t.includes('math')) return striverVideos.math;
    if (t.includes('stl') || t.includes('collection')) return striverVideos.stl;
    if (t.includes('easy array') || (t.includes('array') && t.includes('easy'))) return striverVideos.array_easy;
    if (t.includes('medium array') || (t.includes('array') && t.includes('medium'))) return striverVideos.array_med;
    if (t.includes('hard array') || (t.includes('array') && t.includes('hard'))) return striverVideos.array_hard;
    if (t.includes('array')) return striverVideos.array_easy;
    if (t.includes('hash')) return striverVideos.hashing;
    if (t.includes('backtrack')) return striverVideos.backtrack;
    if (t.includes('recursion') || t.includes('fibonacci') || t.includes('subsequence')) return striverVideos.recursion;
    if (t.includes('linked list') || t.includes('introduction to ll')) return striverVideos.ll_intro;
    if (t.includes('ll warrior') || t.includes('reverse ll')) return striverVideos.ll_med;
    if (t.includes('stack') || t.includes('queue')) return striverVideos.stack_q;
    if (t.includes('monotonic')) return striverVideos.monotonic;
    if (t.includes('binary tree') || t.includes('tree traversal')) return striverVideos.bintree;
    if (t.includes('bst') || t.includes('tree master') || t.includes('tree prop')) return striverVideos.bst;
    if (t.includes('graph') || t.includes('bfs') || t.includes('dfs')) return striverVideos.graph;
    if (t.includes('topo') || t.includes('dsu')) return striverVideos.topo_dsu;
    if (t.includes('shortest') || t.includes('dijkstra')) return striverVideos.shortest;
    if (t.includes('dp') || t.includes('dynamic')) return striverVideos.dp_intro;
    if (t.includes('grid') || t.includes('knapsack')) return striverVideos.dp_grid;
    if (t.includes('greedy')) return striverVideos.greedy;
    if (t.includes('bit')) return striverVideos.bitmanip;
    if (t.includes('heap')) return striverVideos.heap;
    if (t.includes('trie')) return striverVideos.trie;
    return striverVideos.basics;
  };

  // ─── MASTER CATALOG OF GRADUAL QUESTIONS ──────────────────────────────────
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

  // ─── CATEGORY MATCHING ────────────────────────────────────────────────────
  let category = 'basics';
  if (t.includes('logical') || t.includes('pattern')) {
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
