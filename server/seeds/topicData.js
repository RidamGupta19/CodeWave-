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
    {
      title: 'Start Coding',
      description: 'Your first programming journey — from Hello World to writing real functions. This interactive module walks you through 4 progressive checkpoints covering syntax, variables, conditionals, loops, functions, patterns, and STL collections. Watch & code simultaneously!',
      instructor: 'Mike Dane / Striver',
      difficulty: 'beginner',
      estimatedTime: '4 hours',
      order: 1,
      isCheckpointModule: true,
      checkpoints: [
        {
          id: 'cp1',
          label: 'Intro to Programming',
          description: 'Learn basic programming syntax and write your first Hello World program.',
          youtubeLink: 'https://www.youtube.com/watch?v=EAR7De6Goz4&t=4s'
        },
        {
          id: 'cp2',
          label: 'Variables & Conditions',
          description: 'Understand variables, memory allocation, and if-else conditions.',
          youtubeLink: 'https://www.youtube.com/watch?v=FPu9Uld7W-E&list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz&index=4'
        },
        {
          id: 'cp3',
          label: 'Loops & Logic',
          description: 'Iterative processes, loops, accumulation, and logic building.',
          youtubeLink: 'https://www.youtube.com/watch?v=tNm_NNSB3_w&list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz&index=5'
        },
        {
          id: 'cp4',
          label: 'STL & Collections',
          description: 'Master dynamic collections, vectors, lists, sets, and maps.',
          youtubeLink: 'https://www.youtube.com/watch?v=RRVYpIET_RU&list=PLgUwDviBIf0p-INQC6rMuzsSmdZ77EcrH'
        }
      ],
      youtubeLink: 'https://www.youtube.com/watch?v=EAR7De6Goz4&t=4s'
    }
  ],
  'dsa:1': [
    {
      title: 'Arrays Explorer',
      description: 'Master arrays from beginner to advanced level through 28 checkpoints using Striver\'s Arrays Playlist. Watch tutorials, solve coding challenges, and track your progress in real-time!',
      instructor: 'Striver',
      difficulty: 'beginner',
      estimatedTime: '25 hours',
      order: 1,
      isCheckpointModule: true,
      checkpoints: [
        {
          id: 'arr_cp1',
          label: 'Second Largest Element',
          description: 'Identify the second largest element in an array in a single O(N) pass.',
          youtubeLink: 'https://www.youtube.com/embed/37E9ckMDdTk?rel=0&modestbranding=1'
        },
        {
          id: 'arr_cp2',
          label: 'Rotate Array by K Places',
          description: 'Left rotate an array by K places in-place or with minimal space.',
          youtubeLink: 'https://www.youtube.com/embed/wvcQg43_V8U?rel=0&modestbranding=1'
        },
        {
          id: 'arr_cp3',
          label: 'Find Single Element',
          description: 'Find the element that appears once while all other elements appear twice.',
          youtubeLink: 'https://www.youtube.com/embed/bYWLJb3vCWY?rel=0&modestbranding=1'
        },
        {
          id: 'arr_cp4',
          label: 'Longest Subarray with Sum K',
          description: 'Find the length of the longest contiguous subarray whose sum equals K.',
          youtubeLink: 'https://www.youtube.com/embed/frf7qxiN2qU?rel=0&modestbranding=1'
        },
        {
          id: 'arr_cp5',
          label: 'Two Sum',
          description: 'Find two indices in the array that add up to target K.',
          youtubeLink: 'https://www.youtube.com/embed/UXDSeD9mN-k?rel=0&modestbranding=1'
        },
        {
          id: 'arr_cp6',
          label: 'Sort Array of 0s, 1s, and 2s',
          description: 'Sort the array in-place without library sort functions (Dutch National Flag Algorithm).',
          youtubeLink: 'https://www.youtube.com/embed/tp8JIuCXBaU?rel=0&modestbranding=1'
        },
        {
          id: 'arr_cp7',
          label: 'Majority Element I',
          description: 'Find the element that appears more than n/2 times in the array (Boyer-Moore Voting Algorithm).',
          youtubeLink: 'https://www.youtube.com/embed/nP_ns3uSh80?rel=0&modestbranding=1'
        },
        {
          id: 'arr_cp8',
          label: 'Maximum Subarray Sum',
          description: 'Find the maximum sum of a contiguous subarray (Kadane\'s Algorithm).',
          youtubeLink: 'https://www.youtube.com/embed/AHZpyENo7k4?rel=0&modestbranding=1'
        },
        {
          id: 'arr_cp9',
          label: 'Rearrange Array by Sign',
          description: 'Rearrange elements in-place or out-of-place alternately by their sign.',
          youtubeLink: 'https://www.youtube.com/embed/h4aBagy4Uok?rel=0&modestbranding=1'
        },
        {
          id: 'arr_cp10',
          label: 'Buy and Sell Stock',
          description: 'Maximize profit by buying and selling a stock once.',
          youtubeLink: 'https://www.youtube.com/embed/excAOvwF_Wk?rel=0&modestbranding=1'
        },
        {
          id: 'arr_cp11',
          label: 'Next Permutation',
          description: 'Rearrange numbers into the lexicographically next greater permutation.',
          youtubeLink: 'https://www.youtube.com/embed/JDOXKqF60RQ?rel=0&modestbranding=1'
        },
        {
          id: 'arr_cp12',
          label: 'Leaders in an Array',
          description: 'Identify all elements which are greater than all elements to their right.',
          youtubeLink: 'https://www.youtube.com/embed/cHrH9CQ8pmY?rel=0&modestbranding=1'
        },
        {
          id: 'arr_cp13',
          label: 'Longest Consecutive Sequence',
          description: 'Find the length of the longest consecutive elements sequence in O(N).',
          youtubeLink: 'https://www.youtube.com/embed/oO5uLE7EUlM?rel=0&modestbranding=1'
        },
        {
          id: 'arr_cp14',
          label: 'Set Matrix Zeroes',
          description: 'Zero rows and columns containing zeros in-place with minimal space complexity.',
          youtubeLink: 'https://www.youtube.com/embed/N0MgLvceX7M?rel=0&modestbranding=1'
        },
        {
          id: 'arr_cp15',
          label: 'Rotate Matrix 90 Degrees',
          description: 'Rotate an NxN matrix by 90 degrees clockwise in-place.',
          youtubeLink: 'https://www.youtube.com/embed/Z0R2u6gd3GU?rel=0&modestbranding=1'
        },
        {
          id: 'arr_cp16',
          label: 'Spiral Matrix Traversal',
          description: 'Traverse an MxN matrix in spiral clockwise order.',
          youtubeLink: 'https://www.youtube.com/embed/3Zv-s9UUrFM?rel=0&modestbranding=1'
        },
        {
          id: 'arr_cp17',
          label: 'Subarray Sum Equals K',
          description: 'Find total number of subarrays whose sum equals K.',
          youtubeLink: 'https://www.youtube.com/embed/xvNwoz-ufXA?rel=0&modestbranding=1'
        },
        {
          id: 'arr_cp18',
          label: 'Pascal\'s Triangle',
          description: 'Generate the first N rows of Pascal\'s Triangle.',
          youtubeLink: 'https://www.youtube.com/embed/bR7mQgwQ_o8?rel=0&modestbranding=1'
        },
        {
          id: 'arr_cp19',
          label: 'Majority Element II',
          description: 'Find all elements that appear more than n/3 times in the array (Boyer-Moore Extension).',
          youtubeLink: 'https://www.youtube.com/embed/vwZj1K0e9U8?rel=0&modestbranding=1'
        },
        {
          id: 'arr_cp20',
          label: '3Sum',
          description: 'Find all unique triplets that sum to 0 in O(N^2) time and O(1) extra space.',
          youtubeLink: 'https://www.youtube.com/embed/DhFh8Kw7ymk?rel=0&modestbranding=1'
        },
        {
          id: 'arr_cp21',
          label: '4Sum',
          description: 'Find all unique quadruplets that sum to target.',
          youtubeLink: 'https://www.youtube.com/embed/eD95WRfh81c?rel=0&modestbranding=1'
        },
        {
          id: 'arr_cp22',
          label: 'Subarrays with XOR K',
          description: 'Find total number of subarrays whose bitwise XOR sum equals K.',
          youtubeLink: 'https://www.youtube.com/embed/eZr-6p0B7ME?rel=0&modestbranding=1'
        },
        {
          id: 'arr_cp23',
          label: 'Merge Overlapping Intervals',
          description: 'Merge overlapping intervals in O(N log N) time.',
          youtubeLink: 'https://www.youtube.com/embed/IexN60k62jo?rel=0&modestbranding=1'
        },
        {
          id: 'arr_cp24',
          label: 'Merge Arrays In-Place',
          description: 'Merge two sorted arrays in-place using O(1) extra space.',
          youtubeLink: 'https://www.youtube.com/embed/n7uwj04E0I4?rel=0&modestbranding=1'
        },
        {
          id: 'arr_cp25',
          label: 'Missing and Repeating',
          description: 'Find the missing and repeating numbers in an array from 1 to N.',
          youtubeLink: 'https://www.youtube.com/embed/2D0D8HE6uak?rel=0&modestbranding=1'
        },
        {
          id: 'arr_cp26',
          label: 'Count Inversions',
          description: 'Count inversions in an array in O(N log N) using Merge Sort.',
          youtubeLink: 'https://www.youtube.com/embed/AseUmwVNaoY?rel=0&modestbranding=1'
        },
        {
          id: 'arr_cp27',
          label: 'Reverse Pairs',
          description: 'Count reverse pairs (i < j where arr[i] > 2 * arr[j]) in O(N log N).',
          youtubeLink: 'https://www.youtube.com/embed/0e4bZaP3MDI?rel=0&modestbranding=1'
        },
        {
          id: 'arr_cp28',
          label: 'Maximum Product Subarray',
          description: 'Find the contiguous subarray within an array that has the largest product.',
          youtubeLink: 'https://www.youtube.com/embed/hnswaLJvr6g?rel=0&modestbranding=1'
        }
      ],
      youtubeLink: 'https://www.youtube.com/watch?v=37E9ckMDdTk&list=PLgUwDviBIf0rENwdL0nEH0uGom9no0nyB'
    }
  ],
  'dsa:2': [
    {
      title: 'Hashing Explorer',
      description: 'Master frequency tracking, detecting duplicates, and finding unique elements using Hash Maps. Watch tutorials, solve coding challenges, and track your progress in real-time!',
      instructor: 'Striver',
      difficulty: 'beginner',
      estimatedTime: '4 hours',
      order: 1,
      isCheckpointModule: true,
      checkpoints: [
        {
          id: 'hash_cp1',
          label: 'Frequency Tracker',
          description: 'Identify the maximum frequency of elements in an array using hashing.',
          youtubeLink: 'https://www.youtube.com/embed/KEs5UyBJ39g?rel=0&modestbranding=1'
        },
        {
          id: 'hash_cp2',
          label: 'Find Duplicates',
          description: 'Find the count of elements that appear more than once using hashing.',
          youtubeLink: 'https://www.youtube.com/embed/KEs5UyBJ39g?rel=0&modestbranding=1'
        },
        {
          id: 'hash_cp3',
          label: 'First Unique Element',
          description: 'Identify the first element that appears exactly once in the array.',
          youtubeLink: 'https://www.youtube.com/embed/KEs5UyBJ39g?rel=0&modestbranding=1'
        }
      ],
      youtubeLink: 'https://www.youtube.com/watch?v=KEs5UyBJ39g'
    }
  ],
  'dsa:3': [
    {
      title: 'Recursion Explorer',
      description: 'Master the core concepts of recursion from base cases to recurrence relations. Watch tutorials, solve coding challenges, and track your progress in real-time!',
      instructor: 'Striver',
      difficulty: 'beginner',
      estimatedTime: '6 hours',
      order: 1,
      isCheckpointModule: true,
      checkpoints: [
        {
          id: 'rec_cp1',
          label: 'Sum of N Numbers',
          description: 'Calculate the sum of first N natural numbers recursively.',
          youtubeLink: 'https://www.youtube.com/embed/yVdKa8dnKiE?rel=0&modestbranding=1'
        },
        {
          id: 'rec_cp2',
          label: 'Reverse String',
          description: 'Reverse a string recursively.',
          youtubeLink: 'https://www.youtube.com/embed/92Z4_N0Uew0?rel=0&modestbranding=1'
        },
        {
          id: 'rec_cp3',
          label: 'Power Recursive',
          description: 'Calculate base raised to exponent power recursively.',
          youtubeLink: 'https://www.youtube.com/embed/kvRjFhrYpiA?rel=0&modestbranding=1'
        }
      ],
      youtubeLink: 'https://www.youtube.com/watch?v=yVdKa8dnKiE&list=PLgUwDviBIf0rGlzIn_7rsaR2FQ5e6ZOL9'
    }
  ],
  'dsa:4': [
    {
      title: 'Linked List Explorer',
      description: 'Understand singly linked lists, traverse nodes, find the middle node, and search elements. Watch tutorials, solve coding challenges, and track your progress in real-time!',
      instructor: 'Striver',
      difficulty: 'beginner',
      estimatedTime: '8 hours',
      order: 1,
      isCheckpointModule: true,
      checkpoints: [
        {
          id: 'll_cp1',
          label: 'Linked List Length',
          description: 'Find the total number of nodes in a singly linked list.',
          youtubeLink: 'https://www.youtube.com/embed/cg6JGiXhQ9c?rel=0&modestbranding=1'
        },
        {
          id: 'll_cp2',
          label: 'Find Middle Value',
          description: 'Identify the value of the middle node of the linked list in one pass.',
          youtubeLink: 'https://www.youtube.com/embed/83bB4P0L6W4?rel=0&modestbranding=1'
        },
        {
          id: 'll_cp3',
          label: 'Search List',
          description: 'Determine if a specific element exists in the linked list.',
          youtubeLink: 'https://www.youtube.com/embed/MRe4UsRad5k?rel=0&modestbranding=1'
        }
      ],
      youtubeLink: 'https://www.youtube.com/watch?v=cg6JGiXhQ9c&list=PLgUwDviBIf0rAuz8tVcM0AymmhTRsfaLU'
    }
  ],
  'dsa:5': [
    {
      title: 'Stack & Queue Explorer',
      description: 'Master linear data structures, LIFO/FIFO patterns, bracket balancing, next greater element search, and queue summaries. Watch tutorials, solve coding challenges, and track your progress in real-time!',
      instructor: 'Striver',
      difficulty: 'intermediate',
      estimatedTime: '8 hours',
      order: 1,
      isCheckpointModule: true,
      checkpoints: [
        {
          id: 'sq_cp1',
          label: 'Valid Parentheses',
          description: 'Use a stack to validate parenthesis balance in a string.',
          youtubeLink: 'https://www.youtube.com/embed/tqQ5fTamIN4?rel=0&modestbranding=1'
        },
        {
          id: 'sq_cp2',
          label: 'Next Greater Element',
          description: 'Use a stack to find the next greater element in O(N).',
          youtubeLink: 'https://www.youtube.com/embed/N7m7yP8r8pY?rel=0&modestbranding=1'
        },
        {
          id: 'sq_cp3',
          label: 'Queue Sum',
          description: 'Calculate the total sum of elements in a dynamic FIFO queue.',
          youtubeLink: 'https://www.youtube.com/embed/m4N0e_fKxZc?rel=0&modestbranding=1'
        }
      ],
      youtubeLink: 'https://www.youtube.com/watch?v=tqQ5fTamIN4&list=PLgUwDviBIf0pOd5zvVVSzgpo6BaCpHT9c'
    }
  ],
  'dsa:6': [
    {
      title: 'Trees Explorer',
      description: 'Learn binary tree representations, node traversal sums, calculating max depth, and leaf node counts. Watch tutorials, solve coding challenges, and track your progress in real-time!',
      instructor: 'Striver',
      difficulty: 'intermediate',
      estimatedTime: '12 hours',
      order: 1,
      isCheckpointModule: true,
      checkpoints: [
        {
          id: 'tree_cp1',
          label: 'Tree Node Sum',
          description: 'Perform a depth-first traversal to sum all values in a binary tree.',
          youtubeLink: 'https://www.youtube.com/embed/OYqYEM1bMK8?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp2',
          label: 'Max Depth',
          description: 'Calculate the maximum height/depth of the binary tree recursively.',
          youtubeLink: 'https://www.youtube.com/embed/eD4w3H1n8u4?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp3',
          label: 'Leaf Node Count',
          description: 'Identify and count leaf nodes (nodes without children) in a binary tree.',
          youtubeLink: 'https://www.youtube.com/embed/x1C0nU2sP9Y?rel=0&modestbranding=1'
        }
      ],
      youtubeLink: 'https://www.youtube.com/watch?v=OYqYEM1bMK8&list=PLgUwDviBIf0q8Hkd7bK2Bpryj2xVJk8Vk'
    }
  ],
  'dsa:7': [
    {
      title: 'Graph Explorer',
      description: 'Learn graph representations, path existence checks via BFS, and counting connected components via DFS. Watch tutorials, solve coding challenges, and track your progress in real-time!',
      instructor: 'Striver',
      difficulty: 'intermediate',
      estimatedTime: '12 hours',
      order: 1,
      isCheckpointModule: true,
      checkpoints: [
        {
          id: 'graph_cp1',
          label: 'Find Node Degree',
          description: 'Calculate the degree of a given node from the graph adjacency list.',
          youtubeLink: 'https://www.youtube.com/embed/M3_pLsDdeuU?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp2',
          label: 'Find Path',
          description: 'Use Breadth-First Search (BFS) to check if a path exists between two nodes.',
          youtubeLink: 'https://www.youtube.com/embed/V63W7p_p4uE?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp3',
          label: 'Count Connected Components',
          description: 'Identify and count disjoint subgraphs in an undirected graph.',
          youtubeLink: 'https://www.youtube.com/embed/XpkfK_Mh6vA?rel=0&modestbranding=1'
        }
      ],
      youtubeLink: 'https://www.youtube.com/watch?v=M3_pLsDdeuU&list=PLgUwDviBIf0oE3gA41TKO2H5bHpPd7fzn'
    }
  ],
  'dsa:8': [
    {
      title: 'Dynamic Programming Explorer',
      description: 'Master memoization and bottom-up tabulation to optimize recursive algorithms. Watch tutorials, solve coding challenges, and track your progress in real-time!',
      instructor: 'Striver',
      difficulty: 'advanced',
      estimatedTime: '15 hours',
      order: 1,
      isCheckpointModule: true,
      checkpoints: [
        {
          id: 'dp_cp1',
          label: 'Climbing Stairs',
          description: 'Use Dynamic Programming to count distinct ways to climb stairs.',
          youtubeLink: 'https://www.youtube.com/embed/tyB0ztf0DNY?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp2',
          label: 'House Robber',
          description: 'Find the maximum amount of money you can rob without alerting police.',
          youtubeLink: 'https://www.youtube.com/embed/7cELW7O_E9k?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp3',
          label: 'Min Path Sum',
          description: 'Find the minimum sum path from top-left to bottom-right in a grid.',
          youtubeLink: 'https://www.youtube.com/embed/NPZn9jBrX8U?rel=0&modestbranding=1'
        }
      ],
      youtubeLink: 'https://www.youtube.com/watch?v=tyB0ztf0DNY&list=PLgUwDviBIf0pwFf-BnpkXxs0Ra0eU2sJY'
    }
  ],
  'dsa:9': [
    {
      title: 'Greedy Explorer',
      description: 'Master greedy choice properties and local optimization strategies. Watch tutorials, solve coding challenges, and track your progress in real-time!',
      instructor: 'Striver',
      difficulty: 'intermediate',
      estimatedTime: '10 hours',
      order: 1,
      isCheckpointModule: true,
      checkpoints: [
        {
          id: 'greedy_cp1',
          label: 'Lemonade Change',
          description: 'Use a greedy strategy to count bills and decide if change can be provided.',
          youtubeLink: 'https://www.youtube.com/embed/Fqd5aB8S624?rel=0&modestbranding=1'
        },
        {
          id: 'greedy_cp2',
          label: 'Assign Cookies',
          description: 'Greedily satisfy maximum children matching cookie sizes.',
          youtubeLink: 'https://www.youtube.com/embed/HZOUwK5El5U?rel=0&modestbranding=1'
        },
        {
          id: 'greedy_cp3',
          label: 'Fractional Knapsack',
          description: 'Greedily sort items by density value to maximize total value.',
          youtubeLink: 'https://www.youtube.com/embed/n59vC9nJreU?rel=0&modestbranding=1'
        }
      ],
      youtubeLink: 'https://www.youtube.com/watch?v=tyB0ztf0DNY&list=PLgUwDviBIf0pwFf-BnpkXxs0Ra0eU2sJY'
    }
  ],
  'dsa:10': [
    { title: 'Heaps & Heapify', description: 'Max/Min Heap representations, insertion/deletion, Heapify, and HeapSort.', instructor: 'Love Babbar', difficulty: 'intermediate', estimatedTime: '4 hours', order: 1, youtubeLink: 'https://www.youtube.com/watch?v=HqPJF2L5h9U', theoryLink: 'https://www.geeksforgeeks.org/heap-data-structure/', practiceLink: 'https://leetcode.com/tag/heap-priority-queue/' },
    { title: 'Heap Interview Questions', description: 'Kth smallest element, merge heaps, median in a stream.', instructor: 'Love Babbar', difficulty: 'advanced', estimatedTime: '5 hours', order: 2, youtubeLink: 'https://www.youtube.com/watch?v=HqPJF2L5h9U', theoryLink: 'https://www.geeksforgeeks.org/heap-data-structure/', practiceLink: 'https://leetcode.com/problems/find-median-from-data-stream/' },
    { title: 'Tries & Implementation', description: 'Prefix trees, insertion, search, and prefix matching algorithms.', instructor: 'Love Babbar', difficulty: 'intermediate', estimatedTime: '4 hours', order: 3, youtubeLink: 'https://www.youtube.com/watch?v=dBGUmUQhjaM', theoryLink: 'https://www.geeksforgeeks.org/trie-insert-and-search/', practiceLink: 'https://leetcode.com/problems/implement-trie-prefix-tree/' }
  ]

};

module.exports = topicData;
