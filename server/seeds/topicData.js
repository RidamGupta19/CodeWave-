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
          label: 'Hashing Introduction',
          description: 'Understand the basics of Hashing',
          youtubeLink: 'https://www.youtube.com/embed/KEs5UyBJ39g?rel=0&modestbranding=1'
        },
        {
          id: 'hash_cp2',
          label: 'Count frequencies of elements',
          description: 'Learn how to count frequencies',
          youtubeLink: 'https://www.youtube.com/embed/KEs5UyBJ39g?start=850&rel=0&modestbranding=1'
        },
        {
          id: 'hash_cp3',
          label: 'Highest/Lowest Frequency Elements',
          description: 'Apply Hashing to find elements',
          youtubeLink: 'https://www.youtube.com/embed/KEs5UyBJ39g?start=1500&rel=0&modestbranding=1'
        }
      ],
      youtubeLink: 'https://www.youtube.com/watch?v=KEs5UyBJ39g'
    }
  ],
  'dsa:3': [
    {
      title: 'Recursion Survivor',
      description: 'Bootcamp for Recursion: Trace call stacks, understand base cases, and master backtracking techniques.',
      instructor: 'Striver',
      difficulty: 'beginner',
      estimatedTime: '6 hours',
      order: 1,
      isCheckpointModule: true,
            checkpoints: [
        {
          id: 'rec_cp1',
          label: 'Re 1. Introduction to Recursion | Recursion Tree | Stack Space | Strivers A2Z DSA Course',
          description: 'Checkpoint 1',
          youtubeLink: 'https://www.youtube.com/embed/yVdKa8dnKiE?rel=0&modestbranding=1'
        },
        {
          id: 'rec_cp2',
          label: 'Re 2. Problems on Recursion | Strivers A2Z DSA Course',
          description: 'Checkpoint 2',
          youtubeLink: 'https://www.youtube.com/embed/un6PLygfXrA?rel=0&modestbranding=1'
        },
        {
          id: 'rec_cp3',
          label: 'Re 3. Parameterised and Functional Recursion | Strivers A2Z DSA Course',
          description: 'Checkpoint 3',
          youtubeLink: 'https://www.youtube.com/embed/69ZCDFy-OUo?rel=0&modestbranding=1'
        },
        {
          id: 'rec_cp4',
          label: 'Re 4. Problems on Functional Recursion | Strivers A2Z DSA Course',
          description: 'Checkpoint 4',
          youtubeLink: 'https://www.youtube.com/embed/twuC1F6gLI8?rel=0&modestbranding=1'
        },
        {
          id: 'rec_cp5',
          label: 'Re 5. Multiple Recursion Calls | Problems | Strivers A2Z DSA Course',
          description: 'Checkpoint 5',
          youtubeLink: 'https://www.youtube.com/embed/kvRjNm4rVBE?rel=0&modestbranding=1'
        },
        {
          id: 'rec_cp6',
          label: 'L6. Recursion on Subsequences | Printing Subsequences',
          description: 'Checkpoint 6',
          youtubeLink: 'https://www.youtube.com/embed/AxNNVECce8c?rel=0&modestbranding=1'
        },
        {
          id: 'rec_cp7',
          label: 'L7. All Kind of Patterns in Recursion | Print All | Print one | Count',
          description: 'Checkpoint 7',
          youtubeLink: 'https://www.youtube.com/embed/eQCS_v3bw0Q?rel=0&modestbranding=1'
        },
        {
          id: 'rec_cp8',
          label: 'Merge Sort | Algorithm | Pseudocode | Dry Run | Code | Strivers A2Z DSA Course',
          description: 'Checkpoint 8',
          youtubeLink: 'https://www.youtube.com/embed/ogjf7ORKfd8?rel=0&modestbranding=1'
        },
        {
          id: 'rec_cp9',
          label: 'Quick Sort For Beginners | Strivers A2Z DSA Course',
          description: 'Checkpoint 9',
          youtubeLink: 'https://www.youtube.com/embed/WIrA4YexLRQ?rel=0&modestbranding=1'
        },
        {
          id: 'rec_cp10',
          label: 'L8. Combination Sum | Recursion | Leetcode | C++ | Java',
          description: 'Checkpoint 10',
          youtubeLink: 'https://www.youtube.com/embed/OyZFFqQtu98?rel=0&modestbranding=1'
        },
        {
          id: 'rec_cp11',
          label: 'L9. Combination Sum II | Leetcode | Recursion | Java | C++',
          description: 'Checkpoint 11',
          youtubeLink: 'https://www.youtube.com/embed/G1fRTGRxXU8?rel=0&modestbranding=1'
        },
        {
          id: 'rec_cp12',
          label: 'L10. Subset Sum I | Recursion | C++ | Java',
          description: 'Checkpoint 12',
          youtubeLink: 'https://www.youtube.com/embed/rYkfBRtMJr8?rel=0&modestbranding=1'
        },
        {
          id: 'rec_cp13',
          label: 'L11. Subset Sum II | Leetcode | Recursion',
          description: 'Checkpoint 13',
          youtubeLink: 'https://www.youtube.com/embed/RIn3gOkbhQE?rel=0&modestbranding=1'
        },
        {
          id: 'rec_cp14',
          label: 'L12. Print all Permutations of a String/Array | Recursion | Approach - 1',
          description: 'Checkpoint 14',
          youtubeLink: 'https://www.youtube.com/embed/YK78FU5Ffjw?rel=0&modestbranding=1'
        },
        {
          id: 'rec_cp15',
          label: 'L13. Print all Permutations of a String/Array | Recursion | Approach - 2',
          description: 'Checkpoint 15',
          youtubeLink: 'https://www.youtube.com/embed/f2ic2Rsc9pU?rel=0&modestbranding=1'
        },
        {
          id: 'rec_cp16',
          label: 'L14. N-Queens | Leetcode Hard | Backtracking',
          description: 'Checkpoint 16',
          youtubeLink: 'https://www.youtube.com/embed/i05Ju7AftcM?rel=0&modestbranding=1'
        },
        {
          id: 'rec_cp17',
          label: 'L15. Sudoko Solver | Backtracking',
          description: 'Checkpoint 17',
          youtubeLink: 'https://www.youtube.com/embed/FWAIf_EVUKE?rel=0&modestbranding=1'
        },
        {
          id: 'rec_cp18',
          label: 'L16. M-Coloring Problem | Backtracking',
          description: 'Checkpoint 18',
          youtubeLink: 'https://www.youtube.com/embed/wuVwUK25Rfc?rel=0&modestbranding=1'
        },
        {
          id: 'rec_cp19',
          label: 'L17. Palindrome Partitioning | Leetcode | Recursion | C++ | Java',
          description: 'Checkpoint 19',
          youtubeLink: 'https://www.youtube.com/embed/WBgsABoClE0?rel=0&modestbranding=1'
        },
        {
          id: 'rec_cp20',
          label: 'L19. Rat in A Maze | Backtracking',
          description: 'Checkpoint 20',
          youtubeLink: 'https://www.youtube.com/embed/bLGZhJlt4y0?rel=0&modestbranding=1'
        },
        {
          id: 'rec_cp21',
          label: 'L18. K-th Permutation Sequence | Leetcode',
          description: 'Checkpoint 21',
          youtubeLink: 'https://www.youtube.com/embed/wT7gcXLYoao?rel=0&modestbranding=1'
        },
        {
          id: 'rec_cp22',
          label: 'Count Inversions in an Array | Brute and Optimal',
          description: 'Checkpoint 22',
          youtubeLink: 'https://www.youtube.com/embed/AseUmwVNaoY?rel=0&modestbranding=1'
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
