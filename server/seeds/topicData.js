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
  ]
};

module.exports = topicData;
