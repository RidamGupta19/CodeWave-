// Topic data per phase - representative topics with real resource links
// Key format: "domain-slug:phaseNumber"
const topicData = {
  'web-development:1': [
    { title: 'How the Internet Works', description: 'DNS, IP, HTTP/HTTPS basics', difficulty: 'beginner', estimatedTime: '2 hours', order: 1, gfgLink: 'https://www.geeksforgeeks.org/web-tech/web-technology/', youtubeLink: 'https://www.youtube.com/results?search_query=how+internet+works', theoryLink: 'https://www.geeksforgeeks.org/web-tech/web-technology/' },
    { title: 'Browsers & How They Work', description: 'Rendering, DOM, CSSOM', difficulty: 'beginner', estimatedTime: '1 hour', order: 2, gfgLink: 'https://www.geeksforgeeks.org/web-tech/web-technology/', youtubeLink: 'https://www.youtube.com/results?search_query=how+browsers+work' },
    { title: 'HTTP Methods & Status Codes', description: 'GET, POST, PUT, DELETE, status codes', difficulty: 'beginner', estimatedTime: '1 hour', order: 3, gfgLink: 'https://www.geeksforgeeks.org/web-tech/web-technology/', youtubeLink: 'https://www.youtube.com/results?search_query=http+methods+explained' }
  ],
  'web-development:2': [
    { title: 'HTML Basics & Structure', description: 'DOCTYPE, tags, attributes', difficulty: 'beginner', estimatedTime: '3 hours', order: 1, gfgLink: 'https://www.geeksforgeeks.org/html/html-tutorial/', youtubeLink: 'https://www.youtube.com/results?search_query=html+full+course+for+beginners', documentationLink: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
    { title: 'Semantic HTML', description: 'header, footer, nav, section, article', difficulty: 'beginner', estimatedTime: '2 hours', order: 2, gfgLink: 'https://www.geeksforgeeks.org/html/html-tutorial/', youtubeLink: 'https://www.youtube.com/results?search_query=semantic+html+tutorial' },
    { title: 'HTML Forms', description: 'Input types, validation, form submission', difficulty: 'beginner', estimatedTime: '2 hours', order: 3, gfgLink: 'https://www.geeksforgeeks.org/html/html-tutorial/', practiceLink: 'https://www.hackerrank.com/domains/html' }
  ],
  'web-development:3': [
    { title: 'CSS Selectors & Specificity', description: 'Class, ID, attribute selectors', difficulty: 'beginner', estimatedTime: '3 hours', order: 1, gfgLink: 'https://www.geeksforgeeks.org/css/css-tutorial/', youtubeLink: 'https://www.youtube.com/results?search_query=css+full+course+for+beginners', documentationLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS' },
    { title: 'Flexbox', description: 'Flex container, flex items, alignment', difficulty: 'beginner', estimatedTime: '3 hours', order: 2, gfgLink: 'https://www.geeksforgeeks.org/css/css-tutorial/', practiceLink: 'https://flexboxfroggy.com/' },
    { title: 'CSS Grid', description: 'Grid layout, template areas, responsive', difficulty: 'intermediate', estimatedTime: '3 hours', order: 3, gfgLink: 'https://www.geeksforgeeks.org/css/css-tutorial/', practiceLink: 'https://cssgridgarden.com/' },
    { title: 'Responsive Design', description: 'Media queries, mobile-first', difficulty: 'intermediate', estimatedTime: '3 hours', order: 4, gfgLink: 'https://www.geeksforgeeks.org/css/css-tutorial/', youtubeLink: 'https://www.youtube.com/results?search_query=css+responsive+design+tutorial' }
  ],
  'web-development:4': [
    { title: 'JavaScript Fundamentals', description: 'Variables, data types, operators', difficulty: 'beginner', estimatedTime: '4 hours', order: 1, gfgLink: 'https://www.geeksforgeeks.org/javascript/javascript-tutorial/', youtubeLink: 'https://www.youtube.com/results?search_query=javascript+full+course+for+beginners', documentationLink: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
    { title: 'ES6+ Features', description: 'Arrow functions, destructuring, spread, template literals', difficulty: 'intermediate', estimatedTime: '4 hours', order: 2, gfgLink: 'https://www.geeksforgeeks.org/javascript/javascript-tutorial/', youtubeLink: 'https://www.youtube.com/results?search_query=es6+javascript+tutorial' },
    { title: 'DOM Manipulation', description: 'querySelector, events, innerHTML', difficulty: 'intermediate', estimatedTime: '4 hours', order: 3, gfgLink: 'https://www.geeksforgeeks.org/javascript/javascript-tutorial/', practiceLink: 'https://www.hackerrank.com/skills-verification/javascript_basic' },
    { title: 'Async JS - Promises & Async/Await', description: 'Callbacks, Promises, async/await, fetch', difficulty: 'intermediate', estimatedTime: '4 hours', order: 4, gfgLink: 'https://www.geeksforgeeks.org/javascript/javascript-tutorial/', youtubeLink: 'https://www.youtube.com/results?search_query=javascript+async+await+tutorial' }
  ],
  'web-development:5': [
    { title: 'Git Basics', description: 'init, add, commit, push, pull', difficulty: 'beginner', estimatedTime: '3 hours', order: 1, gfgLink: 'https://www.geeksforgeeks.org/git/git-tutorial/', youtubeLink: 'https://www.youtube.com/results?search_query=git+github+tutorial+for+beginners', documentationLink: 'https://git-scm.com/docs' },
    { title: 'GitHub Workflow', description: 'Fork, branch, PR, merge', difficulty: 'beginner', estimatedTime: '2 hours', order: 2, gfgLink: 'https://www.geeksforgeeks.org/git/what-is-github-and-how-to-use-it/', practiceLink: 'https://github.com/' }
  ],
  'web-development:6': [
    { title: 'React Basics & JSX', description: 'Components, JSX, rendering', difficulty: 'intermediate', estimatedTime: '4 hours', order: 1, gfgLink: 'https://www.geeksforgeeks.org/react/react-tutorial/', youtubeLink: 'https://www.youtube.com/results?search_query=react+js+full+course+for+beginners', documentationLink: 'https://react.dev' },
    { title: 'React Hooks', description: 'useState, useEffect, useContext', difficulty: 'intermediate', estimatedTime: '4 hours', order: 2, gfgLink: 'https://www.geeksforgeeks.org/react/react-tutorial/', practiceLink: 'https://www.hackerrank.com/skills-verification/react_basic' },
    { title: 'React Router', description: 'Client-side routing, navigation', difficulty: 'intermediate', estimatedTime: '3 hours', order: 3, gfgLink: 'https://www.geeksforgeeks.org/react/react-tutorial/', documentationLink: 'https://reactrouter.com' },
    { title: 'State Management', description: 'Context API, Redux basics', difficulty: 'advanced', estimatedTime: '4 hours', order: 4, gfgLink: 'https://www.geeksforgeeks.org/react/react-tutorial/', youtubeLink: 'https://www.youtube.com/results?search_query=react+redux+tutorial+for+beginners' }
  ],
  'web-development:7': [
    { title: 'Node.js Basics', description: 'Event loop, modules, npm', difficulty: 'intermediate', estimatedTime: '3 hours', order: 1, gfgLink: 'https://www.geeksforgeeks.org/node-js/nodejs/', youtubeLink: 'https://www.youtube.com/results?search_query=node+js+express+mongodb+full+course', documentationLink: 'https://nodejs.org/docs' },
    { title: 'Express.js', description: 'Routes, middleware, error handling', difficulty: 'intermediate', estimatedTime: '4 hours', order: 2, gfgLink: 'https://www.geeksforgeeks.org/node-js/express-js/', practiceLink: 'https://www.hackerrank.com/skills-verification/node_basic' },
    { title: 'REST API Design', description: 'RESTful principles, HTTP methods', difficulty: 'intermediate', estimatedTime: '3 hours', order: 3, gfgLink: 'https://www.geeksforgeeks.org/node-js/express-js/', practiceLink: 'https://www.hackerrank.com/skills-verification/rest_api_intermediate' }
  ],
  'web-development:8': [
    { title: 'MongoDB Basics', description: 'Collections, documents, CRUD', difficulty: 'intermediate', estimatedTime: '3 hours', order: 1, gfgLink: 'https://www.geeksforgeeks.org/dbms/dbms/', youtubeLink: 'https://www.youtube.com/results?search_query=mongodb+mongoose+tutorial', documentationLink: 'https://www.mongodb.com/docs' },
    { title: 'Mongoose ODM', description: 'Schemas, models, queries, population', difficulty: 'intermediate', estimatedTime: '4 hours', order: 2, gfgLink: 'https://www.geeksforgeeks.org/dbms/dbms/', documentationLink: 'https://mongoosejs.com/docs' },
    { title: 'SQL Basics', description: 'SELECT, INSERT, UPDATE, DELETE, JOINs', difficulty: 'beginner', estimatedTime: '4 hours', order: 3, gfgLink: 'https://www.geeksforgeeks.org/sql/sql-tutorial/', practiceLink: 'https://www.hackerrank.com/skills-verification/sql_basic' }
  ],
  'data-science:1': [
    { title: 'Python Basics', description: 'Variables, loops, functions, OOP', difficulty: 'beginner', estimatedTime: '5 hours', order: 1, gfgLink: 'https://www.geeksforgeeks.org/python/python-programming-language-tutorial/', youtubeLink: 'https://www.youtube.com/results?search_query=python+full+course+for+beginners', practiceLink: 'https://www.hackerrank.com/skills-verification/python_basic' },
    { title: 'Python Data Structures', description: 'Lists, dicts, tuples, sets', difficulty: 'beginner', estimatedTime: '3 hours', order: 2, gfgLink: 'https://www.geeksforgeeks.org/python/python-programming-language-tutorial/', practiceLink: 'https://www.hackerrank.com/domains/python' }
  ],
  'data-science:4': [
    { title: 'NumPy Arrays', description: 'ndarray, indexing, broadcasting', difficulty: 'beginner', estimatedTime: '3 hours', order: 1, gfgLink: 'https://www.geeksforgeeks.org/python/numpy-tutorial/', youtubeLink: 'https://www.youtube.com/results?search_query=numpy+tutorial+for+beginners', documentationLink: 'https://numpy.org/doc' }
  ],
  'data-science:5': [
    { title: 'Pandas DataFrames', description: 'Series, DataFrame, read_csv, operations', difficulty: 'intermediate', estimatedTime: '4 hours', order: 1, gfgLink: 'https://www.geeksforgeeks.org/python/pandas-tutorial/', youtubeLink: 'https://www.youtube.com/results?search_query=pandas+tutorial+for+beginners', documentationLink: 'https://pandas.pydata.org/docs' }
  ],
  'competitive-programming-dsa:1': [
    { title: 'Choose Your Language', description: 'C++, Java, or Python for CP', difficulty: 'beginner', estimatedTime: '1 hour', order: 1, gfgLink: 'https://www.geeksforgeeks.org/dsa/dsa-tutorial-learn-data-structures-and-algorithms/', youtubeLink: 'https://www.youtube.com/results?search_query=data+structures+and+algorithms+full+course' },
    { title: 'Basic I/O & Syntax', description: 'Fast I/O, STL/Collections basics', difficulty: 'beginner', estimatedTime: '2 hours', order: 2, gfgLink: 'https://www.geeksforgeeks.org/dsa/dsa-tutorial-learn-data-structures-and-algorithms/', practiceLink: 'https://www.hackerrank.com/domains/data-structures' }
  ],
  'competitive-programming-dsa:3': [
    { title: 'Array Techniques', description: 'Prefix sums, two pointers, sliding window', difficulty: 'intermediate', estimatedTime: '5 hours', order: 1, gfgLink: 'https://www.geeksforgeeks.org/dsa/dsa-tutorial-learn-data-structures-and-algorithms/', practiceLink: 'https://www.hackerrank.com/domains/data-structures' },
    { title: 'Kadane\'s Algorithm & Variants', description: 'Maximum subarray and problems', difficulty: 'intermediate', estimatedTime: '3 hours', order: 2, gfgLink: 'https://www.geeksforgeeks.org/dsa/dsa-tutorial-learn-data-structures-and-algorithms/', practiceLink: 'https://www.hackerrank.com/domains/algorithms' }
  ],
  'dsa:0': [
    { title: 'Learn the Basics', description: 'User input, Data types, If Else, Switch, For Loops, While Loops', instructor: 'Striver', difficulty: 'beginner', estimatedTime: '3 hours', order: 1, youtubeLink: 'https://www.youtube.com/watch?v=EAR7De6Goz4', theoryLink: 'https://takeuforward.org/c-plus-plus/cpp-basics-for-dsa-sheet/', practiceLink: 'https://www.geeksforgeeks.org/c-plus-plus/' },
    { title: 'Build-up Logical Thinking', description: 'Solve 20+ patterns to build logic', instructor: 'Striver', difficulty: 'beginner', estimatedTime: '2 hours', order: 2, youtubeLink: 'https://www.youtube.com/watch?v=tNm_NNSB3_w', theoryLink: 'https://takeuforward.org/strivers-a2z-dsa-course/must-do-pattern-problems-before-starting-dsa/', practiceLink: 'https://www.geeksforgeeks.org/problems/patterns/' },
    { title: 'STL & Collections', description: 'Master C++ STL (Vector, List, Set, Map) or Java Collections', instructor: 'Striver', difficulty: 'beginner', estimatedTime: '4 hours', order: 3, youtubeLink: 'https://www.youtube.com/watch?v=RRVYpIET_RU', theoryLink: 'https://takeuforward.org/c-plus-plus/stl-containers-in-c-plus-plus/', practiceLink: 'https://www.geeksforgeeks.org/the-c-standard-template-library-stl/' },
    { title: 'Basic Math for DSA', description: 'Count digits, Reverse number, Palindrome, GCD, Armstrong', instructor: 'Striver', difficulty: 'beginner', estimatedTime: '2 hours', order: 4, youtubeLink: 'https://www.youtube.com/watch?v=1xNbjMdrlGY', theoryLink: 'https://takeuforward.org/data-structure/count-digits-in-a-number/', practiceLink: 'https://leetcode.com/problemset/all/?search=basic+math' }
  ],
  'dsa:1': [
    { title: 'Easy Array Problems', description: 'Largest, Second Largest, Check Sorted, Remove Duplicates, Rotate Array', instructor: 'Striver', difficulty: 'beginner', estimatedTime: '4 hours', order: 1, youtubeLink: 'https://www.youtube.com/watch?v=37E9ckMDdTk', theoryLink: 'https://takeuforward.org/data-structure/arrays-easy-problems/', practiceLink: 'https://leetcode.com/tag/array/' },
    { title: 'Medium Array Problems', description: 'Two Sum, Sort 0s 1s 2s, Kadane\'s Algorithm, Stock Buy & Sell', instructor: 'Striver', difficulty: 'intermediate', estimatedTime: '6 hours', order: 2, youtubeLink: 'https://www.youtube.com/watch?v=tp8JIuCXBaU', theoryLink: 'https://takeuforward.org/data-structure/arrays-medium-problems/', practiceLink: 'https://leetcode.com/tag/array/' },
    { title: 'Hard Array Problems', description: 'Pascal\'s Triangle, 3 Sum, 4 Sum, Majority Element II, Merge Intervals', instructor: 'Striver', difficulty: 'advanced', estimatedTime: '8 hours', order: 3, youtubeLink: 'https://www.youtube.com/watch?v=9S_p4M7h9Dk', theoryLink: 'https://takeuforward.org/data-structure/arrays-hard-problems/', practiceLink: 'https://leetcode.com/tag/array/' }
  ],
  'dsa:2': [
    { title: 'Hashing Basics', description: 'Introduction to Hashing, Number and Character hashing', instructor: 'Striver', difficulty: 'beginner', estimatedTime: '3 hours', order: 1, youtubeLink: 'https://www.youtube.com/watch?v=KEs5UyBJ39g', theoryLink: 'https://takeuforward.org/data-structure/hashing-basics-for-dsa/', practiceLink: 'https://www.geeksforgeeks.org/hashing-data-structure/' },
    { title: 'Hashing Hunter Challenges', description: 'Count frequencies, find pairs, handle collisions', instructor: 'Striver', difficulty: 'intermediate', estimatedTime: '4 hours', order: 2, youtubeLink: 'https://www.youtube.com/watch?v=KEs5UyBJ39g', theoryLink: 'https://takeuforward.org/data-structure/hashing-basics-for-dsa/', practiceLink: 'https://leetcode.com/tag/hash-table/' }
  ],
  'dsa:3': [
    { title: 'Recursion Basics', description: 'Printing 1 to N, Fibonacci, String palindrome, Reverse Array', instructor: 'Striver', difficulty: 'beginner', estimatedTime: '4 hours', order: 1, youtubeLink: 'https://www.youtube.com/watch?v=un6PybaEisA', theoryLink: 'https://takeuforward.org/recursion/recursion-introduction/', practiceLink: 'https://www.geeksforgeeks.org/recursion/' },
    { title: 'Subsequences Patterns', description: 'Print all subsequences, Sum of subsequences, Combination Sum', instructor: 'Striver', difficulty: 'intermediate', estimatedTime: '5 hours', order: 2, youtubeLink: 'https://www.youtube.com/watch?v=AxNNVECce8c', theoryLink: 'https://takeuforward.org/recursion/print-all-subsequences-power-set/', practiceLink: 'https://leetcode.com/tag/recursion/' },
    { title: 'Backtracking Hero', description: 'N-Queens, Sudoku Solver, M-Coloring, Rat in a Maze', instructor: 'Striver', difficulty: 'advanced', estimatedTime: '6 hours', order: 3, youtubeLink: 'https://www.youtube.com/watch?v=nwjZ24S_ueM', theoryLink: 'https://takeuforward.org/data-structure/n-queen-problem-backtracking/', practiceLink: 'https://leetcode.com/tag/backtracking/' }
  ],
  'dsa:4': [
    { title: 'Introduction to LL', description: 'Singly Linked List, Doubly Linked List operations', instructor: 'Striver', difficulty: 'beginner', estimatedTime: '3 hours', order: 1, youtubeLink: 'https://www.youtube.com/watch?v=q8gipE-hy80', theoryLink: 'https://takeuforward.org/data-structure/linked-list-introduction/', practiceLink: 'https://leetcode.com/tag/linked-list/' },
    { title: 'LL Warrior Techniques', description: 'Reverse LL, Middle of LL, Detect cycle, Find starting point', instructor: 'Striver', difficulty: 'intermediate', estimatedTime: '5 hours', order: 2, youtubeLink: 'https://www.youtube.com/watch?v=D2vI2NwJgdU', theoryLink: 'https://takeuforward.org/data-structure/reverse-a-linked-list/', practiceLink: 'https://leetcode.com/tag/linked-list/' }
  ],
  'dsa:5': [
    { title: 'Stack & Queue Implementation', description: 'Implement using Arrays, Linked Lists', instructor: 'Striver', difficulty: 'beginner', estimatedTime: '3 hours', order: 1, youtubeLink: 'https://www.youtube.com/watch?v=gyPa_m8fW-w', theoryLink: 'https://takeuforward.org/data-structure/stack-and-queue-implementation/', practiceLink: 'https://www.geeksforgeeks.org/stack-data-structure/' },
    { title: 'Monotonic Stack Master', description: 'Next Greater Element, Largest Rectangle, Trapping Rainwater', instructor: 'Striver', difficulty: 'advanced', estimatedTime: '6 hours', order: 2, youtubeLink: 'https://www.youtube.com/watch?v=7PrS72_jwAY', theoryLink: 'https://takeuforward.org/data-structure/next-greater-element-using-stack/', practiceLink: 'https://leetcode.com/tag/monotonic-stack/' }
  ],
  'dsa:6': [
    { title: 'Binary Tree Traversal', description: 'Preorder, Inorder, Postorder, Level order, Iterative Traversal', instructor: 'Striver', difficulty: 'beginner', estimatedTime: '5 hours', order: 1, youtubeLink: 'https://www.youtube.com/watch?v=l_7V5uYI2G0', theoryLink: 'https://takeuforward.org/binary-tree/binary-tree-traversal/', practiceLink: 'https://leetcode.com/tag/tree/' },
    { title: 'Tree Master: Properties', description: 'Height, Diameter, Balanced, Identical, Boundary traversal', instructor: 'Striver', difficulty: 'intermediate', estimatedTime: '6 hours', order: 2, youtubeLink: 'https://www.youtube.com/watch?v=fAfR_MstP00', theoryLink: 'https://takeuforward.org/data-structure/maximum-depth-in-a-binary-tree/', practiceLink: 'https://leetcode.com/tag/tree/' }
  ],
  'dsa:7': [
    { title: 'Graph Introduction', description: 'Representation, BFS, DFS', instructor: 'Striver', difficulty: 'beginner', estimatedTime: '5 hours', order: 1, youtubeLink: 'https://www.youtube.com/watch?v=M3_pLsDdeuU', theoryLink: 'https://takeuforward.org/graph/graph-introduction/', practiceLink: 'https://www.geeksforgeeks.org/graph-data-structure/' },
    { title: 'Topo Sort & DSU', description: 'Directed/Undirected Graphs, Kahn\'s Algorithm, Path Compression', instructor: 'Striver', difficulty: 'intermediate', estimatedTime: '5 hours', order: 2, youtubeLink: 'https://www.youtube.com/watch?v=V63W7p_p4uE', theoryLink: 'https://takeuforward.org/data-structure/topological-sort-bfs/', practiceLink: 'https://leetcode.com/tag/graph/' },
    { title: 'Shortest Path Algorithms', description: 'Dijkstra, Bellman Ford, Floyd Warshall', instructor: 'Striver', difficulty: 'advanced', estimatedTime: '6 hours', order: 3, youtubeLink: 'https://www.youtube.com/watch?v=XpkfK_Mh6vA', theoryLink: 'https://takeuforward.org/graph/dijkstra-algorithm-shortest-path/', practiceLink: 'https://leetcode.com/tag/graph/' }
  ],
  'dsa:8': [
    { title: 'Introduction to DP', description: 'Memoization vs Tabulation, Fibonacci, Frog Jump', instructor: 'Striver', difficulty: 'intermediate', estimatedTime: '4 hours', order: 1, youtubeLink: 'https://www.youtube.com/watch?v=tyB0ztf0DNY', theoryLink: 'https://takeuforward.org/dynamic-programming/introduction-to-dynamic-programming/', practiceLink: 'https://leetcode.com/tag/dynamic-programming/' },
    { title: 'DP on Grids & Subsequences', description: 'Unique Paths, Knapsack, Subset Sum, Target Sum', instructor: 'Striver', difficulty: 'advanced', estimatedTime: '8 hours', order: 2, youtubeLink: 'https://www.youtube.com/watch?v=7cELW7O_E9k', theoryLink: 'https://takeuforward.org/dynamic-programming/striver-dp-series-dynamic-programming-problems/', practiceLink: 'https://leetcode.com/tag/dynamic-programming/' },
    { title: 'DP on Strings & Stocks', description: 'LCS, Edit Distance, Stock Buy Sell (Multiple variants)', instructor: 'Striver', difficulty: 'advanced', estimatedTime: '7 hours', order: 3, youtubeLink: 'https://www.youtube.com/watch?v=NPZn9jBrX8U', theoryLink: 'https://takeuforward.org/dynamic-programming/longest-common-subsequence/', practiceLink: 'https://leetcode.com/tag/dynamic-programming/' }
  ],
  'dsa:9': [
    { title: 'Greedy Algorithms Basics', description: 'Assign Cookies, Fractional Knapsack, Activity Selection, Job Sequencing', instructor: 'Striver', difficulty: 'intermediate', estimatedTime: '4 hours', order: 1, youtubeLink: 'https://www.youtube.com/watch?v=n59vC9nJreU', theoryLink: 'https://takeuforward.org/greedy-algorithm/greedy-algorithm-introduction/', practiceLink: 'https://www.geeksforgeeks.org/greedy-algorithms/' }
  ],
  'dsa:10': [
    { title: 'Bit Manipulation Master', description: 'Power of 2, Count set bits, Single Number, Subsets', instructor: 'Striver', difficulty: 'intermediate', estimatedTime: '3 hours', order: 1, youtubeLink: 'https://www.youtube.com/watch?v=5rtVTYAk9KQ', theoryLink: 'https://takeuforward.org/bit-manipulation/bit-manipulation-introduction/', practiceLink: 'https://leetcode.com/tag/bit-manipulation/' },
    { title: 'Heaps & Priority Queues', description: 'Implementation, K-th largest, Merge M sorted lists', instructor: 'Striver', difficulty: 'intermediate', estimatedTime: '4 hours', order: 2, youtubeLink: 'https://www.youtube.com/watch?v=HqPJF2L5h9U', theoryLink: 'https://takeuforward.org/data-structure/heap-data-structure/', practiceLink: 'https://leetcode.com/tag/heap-priority-queue/' },
    { title: 'Advanced Topics & Tries', description: 'Trie implementation, Search, Insert, Count words', instructor: 'Striver', difficulty: 'advanced', estimatedTime: '4 hours', order: 3, youtubeLink: 'https://www.youtube.com/watch?v=dBGUmUQhjaM', theoryLink: 'https://takeuforward.org/trie/trie-introduction/', practiceLink: 'https://leetcode.com/tag/trie/' }
  ]

};

module.exports = topicData;
