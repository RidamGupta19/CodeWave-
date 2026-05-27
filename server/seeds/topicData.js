// Topic data per phase - representative topics with real resource links
// Key format: "domain-slug:phaseNumber"
const topicData = {
  'web-development:0': [
    {
      title: 'HTML Complete Course',
      description: 'Master HTML5 from scratch with the Apna College HTML tutorial. Build the skeleton of pages, learn semantic layout, and construct forms in this one-shot complete course.',
      instructor: 'Apna College',
      difficulty: 'beginner',
      estimatedTime: '3 hours',
      order: 1,
      youtubeLink: 'https://www.youtube.com/watch?v=HcOc7P5BMi4'
    }
  ],
  'web-development:1': [
    {
      title: 'CSS Complete Course',
      description: 'Master CSS from scratch with the Apna College CSS tutorial. Learn selectors, box model, layout design, Flexbox, and Grid in this one-shot complete course.',
      instructor: 'Apna College',
      difficulty: 'beginner',
      estimatedTime: '4 hours',
      order: 1,
      youtubeLink: 'https://www.youtube.com/watch?v=ESnrn1kAD4E'
    }
  ],
  'web-development:2': [
    { title: 'Intro to JavaScript', description: 'Starting JavaScript Series: Learn history, environment setup, and basic syntax.', difficulty: 'beginner', estimatedTime: '1 hour', order: 1, youtubeLink: 'https://www.youtube.com/watch?v=1dFqthtouqU' },
    { title: 'Variables and DataTypes', description: 'Understand variable declarations, scoping rules, and JavaScript primitives.', difficulty: 'beginner', estimatedTime: '1 hour', order: 2, youtubeLink: 'https://www.youtube.com/watch?v=u3v2H5mwixY' },
    { title: 'Operators & Conditionals', description: 'Master arithmetic, logical, assignment operators and if-else decision statements.', difficulty: 'beginner', estimatedTime: '1 hour', order: 3, youtubeLink: 'https://www.youtube.com/watch?v=7k6oEConqLA' },
    { title: 'Loops and Strings', description: 'Iterative execution using for, while, do-while loops and basic string operations.', difficulty: 'beginner', estimatedTime: '1 hour', order: 4, youtubeLink: 'https://www.youtube.com/watch?v=UXxwO_U_gXI' },
    { title: 'Objects & Arrays', description: 'Learn reference types: arrays declaration, key-value object structures and properties.', difficulty: 'beginner', estimatedTime: '1 hour', order: 5, youtubeLink: 'https://www.youtube.com/watch?v=XK8loB2jYDE' },
    { title: 'Functions & Arrow Functions', description: 'Master functional programming: plain function declarations, parameters, and ES6 arrow functions.', difficulty: 'beginner', estimatedTime: '1 hour', order: 6, youtubeLink: 'https://www.youtube.com/watch?v=nqC-UlGTssg' },
    { title: 'Hoisting and Function Calls', description: 'Understand Javascript hoisting rules, execution context, and call stacks.', difficulty: 'beginner', estimatedTime: '1 hour', order: 7, youtubeLink: 'https://www.youtube.com/watch?v=eK4gqHb7P7w' },
    { title: 'Temporal Dead Zone', description: 'Understand the Temporal Dead Zone (TDZ), let/const initialization boundaries.', difficulty: 'beginner', estimatedTime: '1 hour', order: 8, youtubeLink: 'https://www.youtube.com/watch?v=7NA3hX3IfVg' },
    { title: 'Classes & Default Parameters', description: 'Learn OOP in JavaScript using ES6 classes, constructor logic, and default parameters.', difficulty: 'beginner', estimatedTime: '1 hour', order: 9, youtubeLink: 'https://www.youtube.com/watch?v=SslpdF_HlFc' },
    { title: 'Common In-Built Objects', description: 'Learn standard library math functions, date formatting, and essential utility wrappers.', difficulty: 'beginner', estimatedTime: '1 hour', order: 10, youtubeLink: 'https://www.youtube.com/watch?v=cmgpJxt1q6k' },
    { title: 'Object Cloning & Garbage Collection', description: 'Deep copy vs shallow copy, object cloning techniques, and memory management.', difficulty: 'intermediate', estimatedTime: '1 hour', order: 11, youtubeLink: 'https://www.youtube.com/watch?v=9KBadAcKVrU' },
    { title: 'Error Handling', description: 'Prevent crashes using try-catch blocks and throwing custom error objects.', difficulty: 'intermediate', estimatedTime: '1 hour', order: 12, youtubeLink: 'https://www.youtube.com/watch?v=u2xLcx3sC_k' },
    { title: 'DOM Manipulation Basics', description: 'Selecting elements, inserting, updating, and removing nodes dynamically.', difficulty: 'intermediate', estimatedTime: '1 hour', order: 13, youtubeLink: 'https://www.youtube.com/watch?v=uoII7VSDF3k' },
    { title: 'DOM Manipulation Styling', description: 'Change visual styling of HTML elements using classList, style property, and CSSOM rules.', difficulty: 'intermediate', estimatedTime: '1 hour', order: 14, youtubeLink: 'https://www.youtube.com/watch?v=5Udw0F6DIhA' },
    { title: 'Events & Listeners', description: 'Handling user interactions with addEventListener, event bubbling, and delegation.', difficulty: 'intermediate', estimatedTime: '1 hour', order: 15, youtubeLink: 'https://www.youtube.com/watch?v=x2gl4KwUIV8' },
    { title: 'Reflow & Repaint', description: 'Understand browser rendering engine performance optimizations: avoiding layout thrashing.', difficulty: 'intermediate', estimatedTime: '1 hour', order: 16, youtubeLink: 'https://www.youtube.com/watch?v=kqFauVbe-1M' },
    { title: 'The Event Loop', description: 'Deep dive into JS concurrency model: call stack, web APIs, callback queue, and microtask queue.', difficulty: 'advanced', estimatedTime: '1 hour', order: 17, youtubeLink: 'https://www.youtube.com/watch?v=FqaCRrxiS_A' },
    { title: 'Promises in JavaScript', description: 'Manage asynchronous flows, promise resolution, rejection, and chaining handlers.', difficulty: 'advanced', estimatedTime: '1 hour', order: 18, youtubeLink: 'https://www.youtube.com/watch?v=Bgf2bXr6psI' },
    { title: 'Async/Await & Fetch API', description: 'Write synchronous-looking asynchronous code and fetch remote APIs using HTTP requests.', difficulty: 'advanced', estimatedTime: '1 hour', order: 19, youtubeLink: 'https://www.youtube.com/watch?v=EL3PKEHggrE' },
    { title: 'Closures', description: 'Master nested scopes: lexical scoping, closed variables, and functional state preservation.', difficulty: 'advanced', estimatedTime: '1 hour', order: 20, youtubeLink: 'https://www.youtube.com/watch?v=ThJOl1gqIjs' },
    { title: 'LeetCode Metrics App Project', description: 'Assemble everything together to build a fully functional LeetCode Metrics tracker application.', difficulty: 'advanced', estimatedTime: '2 hours', order: 21, youtubeLink: 'https://www.youtube.com/watch?v=5dDkw_yCSgw' }
  ],
  'web-development:3': [
    {
      title: 'Git & GitHub Complete Course',
      description: 'Master version control, repository creation, branching, commits, and pull requests in this one-shot complete course.',
      instructor: 'Apna College',
      difficulty: 'beginner',
      estimatedTime: '2 hours',
      order: 1,
      youtubeLink: 'https://www.youtube.com/watch?v=q8EevlEpQ2A'
    }
  ],
  'web-development:4': [
    {
      title: 'React JS Roadmap',
      description: 'Learn the layout of the series, pre-requisites, and a complete roadmap to master React JS.',
      instructor: 'Chai aur Code',
      difficulty: 'beginner',
      estimatedTime: '1 hour',
      order: 1,
      youtubeLink: 'https://www.youtube.com/watch?v=vz1RlUyrc3w'
    },
    {
      title: 'Create React Projects',
      description: 'Understand how to create a React project using create-react-app and modern build tools like Vite.',
      instructor: 'Chai aur Code',
      difficulty: 'beginner',
      estimatedTime: '1 hour',
      order: 2,
      youtubeLink: 'https://www.youtube.com/watch?v=k3KqQvywToE'
    },
    {
      title: 'Understand the React Flow and Structure',
      description: 'Deep dive into the folder structure, package.json, and execution flow of a React application.',
      instructor: 'Chai aur Code',
      difficulty: 'beginner',
      estimatedTime: '1 hour',
      order: 3,
      youtubeLink: 'https://www.youtube.com/watch?v=yNbnA5pryMg'
    },
    {
      title: 'Create Your Own React Library and JSX',
      description: 'Learn the inner workings of JSX and build a custom miniature React render engine from scratch.',
      instructor: 'Chai aur Code',
      difficulty: 'beginner',
      estimatedTime: '1 hour',
      order: 4,
      youtubeLink: 'https://www.youtube.com/watch?v=kAOuj6o7Kxs'
    },
    {
      title: 'Why You Need Hooks and Project',
      description: 'Understand state synchronization, React\'s reactive UI updates, and building a counter project using hooks.',
      instructor: 'Chai aur Code',
      difficulty: 'beginner',
      estimatedTime: '1 hour',
      order: 5,
      youtubeLink: 'https://www.youtube.com/watch?v=lI7IIOWM0Mo'
    },
    {
      title: 'Virtual DOM, Fibre and Reconciliation',
      description: 'Understand the React Virtual DOM, fiber architecture, and reconciliation algorithm.',
      instructor: 'Chai aur Code',
      difficulty: 'beginner',
      estimatedTime: '1 hour',
      order: 6,
      youtubeLink: 'https://www.youtube.com/watch?v=MPCVGFvgVEQ'
    },
    {
      title: 'Tailwind and Props in ReactJS',
      description: 'Learn how to use Tailwind CSS in React and pass data to components using props.',
      instructor: 'Chai aur Code',
      difficulty: 'beginner',
      estimatedTime: '1 hour',
      order: 7,
      youtubeLink: 'https://www.youtube.com/watch?v=bB6707XzCNc'
    },
    {
      title: 'React Interview Question on Counter',
      description: 'Solve a classic React interview question regarding state updates and queueing batch updates.',
      instructor: 'Chai aur Code',
      difficulty: 'beginner',
      estimatedTime: '1 hour',
      order: 8,
      youtubeLink: 'https://www.youtube.com/watch?v=tOYkV6Yhrhs'
    },
    {
      title: 'Building a React Project: bgChanger',
      description: 'Build a background color changer app to practice state management and event handling.',
      instructor: 'Chai aur Code',
      difficulty: 'beginner',
      estimatedTime: '1 hour',
      order: 9,
      youtubeLink: 'https://www.youtube.com/watch?v=_lJ3KNMue3w'
    },
    {
      title: 'useEffect, useRef and useCallback with Project',
      description: 'Master side effects, mutable references, and performance memoization by building a password generator.',
      instructor: 'Chai aur Code',
      difficulty: 'beginner',
      estimatedTime: '1 hour',
      order: 10,
      youtubeLink: 'https://www.youtube.com/watch?v=Lt4vy8hfc-s'
    },
    {
      title: 'Custom Hooks in React: Currency Project',
      description: 'Learn how to write clean, reusable custom hooks by building a dynamic currency converter app.',
      instructor: 'Chai aur Code',
      difficulty: 'intermediate',
      estimatedTime: '1.5 hours',
      order: 11,
      youtubeLink: 'https://www.youtube.com/watch?v=AFDYnd-XPa8'
    },
    {
      title: 'React Router Crash Course',
      description: 'Implement client-side routing, nested routes, route loaders, and parameters using React Router.',
      instructor: 'Chai aur Code',
      difficulty: 'intermediate',
      estimatedTime: '1.5 hours',
      order: 12,
      youtubeLink: 'https://www.youtube.com/watch?v=VJov5QWEKE4'
    },
    {
      title: 'Context API Crash Course with 2 Projects',
      description: 'Master React Context API for global state management and build two practical applications.',
      instructor: 'Chai aur Code',
      difficulty: 'intermediate',
      estimatedTime: '1.5 hours',
      order: 13,
      youtubeLink: 'https://www.youtube.com/watch?v=JQVBGtZMqgU'
    },
    {
      title: 'Context API with Local Storage Project',
      description: 'Build a todo application that persists state across reloads using Context API and Local Storage.',
      instructor: 'Chai aur Code',
      difficulty: 'intermediate',
      estimatedTime: '1.5 hours',
      order: 14,
      youtubeLink: 'https://www.youtube.com/watch?v=6KQeopPE36I'
    },
    {
      title: 'Redux Toolkit Crash Course',
      description: 'Learn state management with Redux Toolkit (RTK) using stores, reducers, and selectors.',
      instructor: 'Chai aur Code',
      difficulty: 'intermediate',
      estimatedTime: '1.5 hours',
      order: 15,
      youtubeLink: 'https://www.youtube.com/watch?v=1i04-A7kfFI'
    },
    {
      title: 'Mega Project in React Choice',
      description: 'Introduction and planning phase for our end-to-end production-grade React application.',
      instructor: 'Chai aur Code',
      difficulty: 'intermediate',
      estimatedTime: '1 hour',
      order: 16,
      youtubeLink: 'https://www.youtube.com/watch?v=CqNSTD9ENb0'
    },
    {
      title: 'Mega Project in React: The Hard Way',
      description: 'Start building a full-featured blog application using modern frontend and backend integration.',
      instructor: 'Chai aur Code',
      difficulty: 'intermediate',
      estimatedTime: '1.5 hours',
      order: 17,
      youtubeLink: 'https://www.youtube.com/watch?v=P-WHzz2M5aU'
    },
    {
      title: 'Appwrite Backend for React Project',
      description: 'Configure and set up Appwrite as the backend service provider for authentication and database.',
      instructor: 'Chai aur Code',
      difficulty: 'intermediate',
      estimatedTime: '1.5 hours',
      order: 18,
      youtubeLink: 'https://www.youtube.com/watch?v=zLWif1pFYJg'
    },
    {
      title: 'ENV and Appwrite in React Project',
      description: 'Securely manage environment variables in React and instantiate the Appwrite client.',
      instructor: 'Chai aur Code',
      difficulty: 'intermediate',
      estimatedTime: '1 hour',
      order: 19,
      youtubeLink: 'https://www.youtube.com/watch?v=4_JlIr8yry0'
    },
    {
      title: 'Build Authentication Service with Appwrite',
      description: 'Create a professional auth service wrapper class for user login, signup, and logout flow.',
      instructor: 'Chai aur Code',
      difficulty: 'intermediate',
      estimatedTime: '1.5 hours',
      order: 20,
      youtubeLink: 'https://www.youtube.com/watch?v=0Py5cGGW2lE'
    },
    {
      title: 'Appwrite Database, File Upload and Custom Queries',
      description: 'Implement database operations, document creation, image uploads, and queries in Appwrite.',
      instructor: 'Chai aur Code',
      difficulty: 'intermediate',
      estimatedTime: '1.5 hours',
      order: 21,
      youtubeLink: 'https://www.youtube.com/watch?v=lzx52HnWh4Y'
    },
    {
      title: 'Configure Redux Toolkit in Big Projects',
      description: 'Integrate Redux Toolkit to track authentication state globally across the mega blog app.',
      instructor: 'Chai aur Code',
      difficulty: 'intermediate',
      estimatedTime: '1.5 hours',
      order: 22,
      youtubeLink: 'https://www.youtube.com/watch?v=8QGKg_W5sDQ'
    },
    {
      title: 'Production Grade React Components',
      description: 'Build reusable, highly styled UI elements like inputs, buttons, containers, and select fields.',
      instructor: 'Chai aur Code',
      difficulty: 'intermediate',
      estimatedTime: '2 hours',
      order: 23,
      youtubeLink: 'https://www.youtube.com/watch?v=BSaYsHVpaK0'
    },
    {
      title: 'Use React Hook Form in Production',
      description: 'Manage form validation, submission, and state cleanly using React Hook Form.',
      instructor: 'Chai aur Code',
      difficulty: 'intermediate',
      estimatedTime: '2 hours',
      order: 24,
      youtubeLink: 'https://www.youtube.com/watch?v=lfMyCuB6xfc'
    },
    {
      title: 'Adding Form and Slug Values',
      description: 'Develop the blog post creation form with automated slug generation based on the title.',
      instructor: 'Chai aur Code',
      difficulty: 'intermediate',
      estimatedTime: '1.5 hours',
      order: 25,
      youtubeLink: 'https://www.youtube.com/watch?v=-6LvNku2nJE'
    },
    {
      title: 'Building Pages: Mega Project',
      description: 'Implement routing pages for home, posts, authentication screens, and edit-post workflows.',
      instructor: 'Chai aur Code',
      difficulty: 'advanced',
      estimatedTime: '2 hours',
      order: 26,
      youtubeLink: 'https://www.youtube.com/watch?v=rC644qOZUro'
    },
    {
      title: 'CORS and Debugging in React Project',
      description: 'Resolve cross-origin resource sharing (CORS) issues and debug API calls in production.',
      instructor: 'Chai aur Code',
      difficulty: 'advanced',
      estimatedTime: '1.5 hours',
      order: 27,
      youtubeLink: 'https://www.youtube.com/watch?v=Od4rQCU41s4'
    },
    {
      title: 'Deploy React App to Production',
      description: 'Learn how to build, optimize, and deploy your production-ready React app to hosting services.',
      instructor: 'Chai aur Code',
      difficulty: 'advanced',
      estimatedTime: '1.5 hours',
      order: 28,
      youtubeLink: 'https://www.youtube.com/watch?v=dg2Gw1HSlpQ'
    },
    {
      title: 'Assignments for React Course',
      description: 'Check out assignments and challenges to practice and solidify your React skills.',
      instructor: 'Chai aur Code',
      difficulty: 'advanced',
      estimatedTime: '2 hours',
      order: 29,
      youtubeLink: 'https://www.youtube.com/watch?v=KqGze7HCTIA'
    },
    {
      title: 'React Series Conclusion',
      description: 'Conclusion of the core series, summarizing your learning path and next steps.',
      instructor: 'Chai aur Code',
      difficulty: 'advanced',
      estimatedTime: '1 hour',
      order: 30,
      youtubeLink: 'https://www.youtube.com/watch?v=3o4qc9WRtWE'
    },
    {
      title: 'Connecting Frontend and Backend in JS',
      description: 'Configure a development server proxy to seamlessly handle CORS and connect frontend to backend.',
      instructor: 'Chai aur Code',
      difficulty: 'advanced',
      estimatedTime: '1.5 hours',
      order: 31,
      youtubeLink: 'https://www.youtube.com/watch?v=fFHyqhmnVfs'
    },
    {
      title: 'State Optimization in React Interviews',
      description: 'Explore a common React interview challenge on optimizing renders by avoiding unnecessary state.',
      instructor: 'Chai aur Code',
      difficulty: 'advanced',
      estimatedTime: '1 hour',
      order: 32,
      youtubeLink: 'https://www.youtube.com/watch?v=P4X0vPTQX4A'
    },
    {
      title: 'Testing Datatype Skills in React Interviews',
      description: 'Learn how state references, objects, arrays, and primitive values behave during React updates.',
      instructor: 'Chai aur Code',
      difficulty: 'advanced',
      estimatedTime: '1 hour',
      order: 33,
      youtubeLink: 'https://www.youtube.com/watch?v=M3AxZX3g00w'
    },
    {
      title: 'Handle APIs like a Pro in React',
      description: 'Handle APIs efficiently using Axios, abort controllers, race condition protection, and custom state hooks.',
      instructor: 'Chai aur Code',
      difficulty: 'advanced',
      estimatedTime: '2 hours',
      order: 34,
      youtubeLink: 'https://www.youtube.com/watch?v=NxAwOjb_NlA'
    },
    {
      title: 'Common Production Mistake in React',
      description: 'Analyze common architectural and performance mistakes in React production projects and how to fix them.',
      instructor: 'Chai aur Code',
      difficulty: 'advanced',
      estimatedTime: '1.5 hours',
      order: 35,
      youtubeLink: 'https://www.youtube.com/watch?v=UsNdgJY6tCY'
    }
  ],
  'web-development:5': [
    {
      title: 'Javascript Backend Roadmap',
      description: 'A comprehensive roadmap outlining how to master Node.js, Express, databases, and general server-side development.',
      instructor: 'Chai aur Code',
      difficulty: 'beginner',
      estimatedTime: '1 hour',
      order: 1,
      youtubeLink: 'https://www.youtube.com/watch?v=EH3vGeqeIAo'
    },
    {
      title: 'Deploy Backend Code in Production',
      description: 'Learn the deployment process, cloud server setup, and hosting a Node.js backend in production.',
      instructor: 'Chai aur Code',
      difficulty: 'beginner',
      estimatedTime: '1 hour',
      order: 2,
      youtubeLink: 'https://www.youtube.com/watch?v=pOV4EjUtl70'
    },
    {
      title: 'Connect Frontend and Backend in JS',
      description: 'Understand full-stack connections, cross-origin resource sharing, and setting up development proxies.',
      instructor: 'Chai aur Code',
      difficulty: 'beginner',
      estimatedTime: '1 hour',
      order: 3,
      youtubeLink: 'https://www.youtube.com/watch?v=fFHyqhmnVfs'
    },
    {
      title: 'Taking Backend to the Next Level',
      description: 'Learn the advanced standards, practices, and tooling needed to build robust, scalable backends.',
      instructor: 'Chai aur Code',
      difficulty: 'beginner',
      estimatedTime: '1 hour',
      order: 4,
      youtubeLink: 'https://www.youtube.com/watch?v=10hRlpUNeNA'
    },
    {
      title: 'Data Modelling for Backend with Mongoose',
      description: 'Master database schemas and data relationships in MongoDB using Mongoose.',
      instructor: 'Chai aur Code',
      difficulty: 'beginner',
      estimatedTime: '1 hour',
      order: 5,
      youtubeLink: 'https://www.youtube.com/watch?v=VbGl3msgce8'
    },
    {
      title: 'Ecommerce and Hospital Management Modelling',
      description: 'Hands-on data modeling exercise representing complex relations like products, orders, patients, and staff.',
      instructor: 'Chai aur Code',
      difficulty: 'beginner',
      estimatedTime: '1.5 hours',
      order: 6,
      youtubeLink: 'https://www.youtube.com/watch?v=lA_mNpddN5U'
    },
    {
      title: 'Setup a Professional Backend Project',
      description: 'Learn professional project setups: config folders, environment variables, express configuration, and source structure.',
      instructor: 'Chai aur Code',
      difficulty: 'beginner',
      estimatedTime: '1.5 hours',
      order: 7,
      youtubeLink: 'https://www.youtube.com/watch?v=9B4CvtzXRpc'
    },
    {
      title: 'Connect Database in MERN with Debugging',
      description: 'Implement MongoDB connection helpers with try-catch blocks and debug common network issues.',
      instructor: 'Chai aur Code',
      difficulty: 'beginner',
      estimatedTime: '1 hour',
      order: 8,
      youtubeLink: 'https://www.youtube.com/watch?v=w4z8Py-UoNk'
    },
    {
      title: 'Custom API Response and Error Handling',
      description: 'Develop standardized middleware for handling server exceptions, client errors, and formatted JSON responses.',
      instructor: 'Chai aur Code',
      difficulty: 'intermediate',
      estimatedTime: '1.5 hours',
      order: 9,
      youtubeLink: 'https://www.youtube.com/watch?v=S5EpsMjel-M'
    },
    {
      title: 'User and Video Model with Hooks and JWT',
      description: 'Define mongoose schemas, leverage model pre-save hooks for password hashing, and sign JWT tokens.',
      instructor: 'Chai aur Code',
      difficulty: 'intermediate',
      estimatedTime: '1.5 hours',
      order: 10,
      youtubeLink: 'https://www.youtube.com/watch?v=eWnZVUXMq8k'
    },
    {
      title: 'File Upload in Backend using Multer',
      description: 'Configure Multer middleware for handling multiform file uploads and saving them to local disks or cloud storage.',
      instructor: 'Chai aur Code',
      difficulty: 'intermediate',
      estimatedTime: '1.5 hours',
      order: 11,
      youtubeLink: 'https://www.youtube.com/watch?v=6KPXn2Ha0cM'
    },
    {
      title: 'HTTP Crash Course',
      description: 'Understand the web\'s backbone: HTTP headers, status codes, standard methods, and request bodies.',
      instructor: 'Chai aur Code',
      difficulty: 'intermediate',
      estimatedTime: '1 hour',
      order: 12,
      youtubeLink: 'https://www.youtube.com/watch?v=qgZiUvV41TI'
    },
    {
      title: 'Router and Controller Setup with Debugging',
      description: 'Map Express routes to controller logic to achieve clean separation of concerns.',
      instructor: 'Chai aur Code',
      difficulty: 'intermediate',
      estimatedTime: '1.5 hours',
      order: 13,
      youtubeLink: 'https://www.youtube.com/watch?v=HqcGLJSORaA'
    },
    {
      title: 'Logic Building: User Register Controller',
      description: 'Implement step-by-step logic for user signup: field validation, duplicate checks, image uploads, and db creation.',
      instructor: 'Chai aur Code',
      difficulty: 'intermediate',
      estimatedTime: '2 hours',
      order: 14,
      youtubeLink: 'https://www.youtube.com/watch?v=VKXnSwNm_lE'
    },
    {
      title: 'How to Use Postman for Backend',
      description: 'Test and document HTTP APIs using Postman collections, environments, headers, and request variables.',
      instructor: 'Chai aur Code',
      difficulty: 'intermediate',
      estimatedTime: '1 hour',
      order: 15,
      youtubeLink: 'https://www.youtube.com/watch?v=_u-WgSN5ymU'
    },
    {
      title: 'Access & Refresh Token, Middleware and Cookies',
      description: 'Secure routes using token authentication. Read and write JWTs using cookies.',
      instructor: 'Chai aur Code',
      difficulty: 'intermediate',
      estimatedTime: '1.5 hours',
      order: 16,
      youtubeLink: 'https://www.youtube.com/watch?v=7DVpag3cO0g'
    },
    {
      title: 'Access Token and Refresh Token in Practice',
      description: 'Understand how client tokens are updated using rotation algorithms and db validations.',
      instructor: 'Chai aur Code',
      difficulty: 'intermediate',
      estimatedTime: '1.5 hours',
      order: 17,
      youtubeLink: 'https://www.youtube.com/watch?v=L2_gIrDxCes'
    },
    {
      title: 'Writing Update Controllers for User',
      description: 'Implement profile update logic: changing avatars, email edits, and password updates.',
      instructor: 'Chai aur Code',
      difficulty: 'advanced',
      estimatedTime: '1.5 hours',
      order: 18,
      youtubeLink: 'https://www.youtube.com/watch?v=9azRerL6CZc'
    },
    {
      title: 'Understand the Subscription Schema',
      description: 'Design and implement database relationships for follower-following systems and channel subscriptions.',
      instructor: 'Chai aur Code',
      difficulty: 'advanced',
      estimatedTime: '1.5 hours',
      order: 19,
      youtubeLink: 'https://www.youtube.com/watch?v=4_Ge2QEcT8k'
    },
    {
      title: 'Learn MongoDB Aggregation Pipelines',
      description: 'Deep dive into MongoDB aggregations: match, group, lookup, and project operators.',
      instructor: 'Chai aur Code',
      difficulty: 'advanced',
      estimatedTime: '2 hours',
      order: 20,
      youtubeLink: 'https://www.youtube.com/watch?v=fDTf1mk-jQg'
    },
    {
      title: 'Sub-pipelines and Dynamic Routes',
      description: 'Create complex nested aggregation lookups for user profiles, history tracking, and dynamic routers.',
      instructor: 'Chai aur Code',
      difficulty: 'advanced',
      estimatedTime: '2 hours',
      order: 21,
      youtubeLink: 'https://www.youtube.com/watch?v=qNnR7cuVliI'
    },
    {
      title: 'Summary of Backend Series',
      description: 'A comprehensive review of what has been built, patterns covered, and project architecture.',
      instructor: 'Chai aur Code',
      difficulty: 'advanced',
      estimatedTime: '1 hour',
      order: 22,
      youtubeLink: 'https://www.youtube.com/watch?v=VUgl3i8DdW4'
    },
    {
      title: 'MongoDB Models for Likes, Playlists & Tweets',
      description: 'Create schemas representing user interactions, post likes, custom playlists, and tweets.',
      instructor: 'Chai aur Code',
      difficulty: 'advanced',
      estimatedTime: '1.5 hours',
      order: 23,
      youtubeLink: 'https://www.youtube.com/watch?v=-5yWyE4AiVk'
    },
    {
      title: 'Build in Public and Open Source',
      description: 'Learn how to document your progress, push clean code, contribute to open source, and display your backend projects.',
      instructor: 'Chai aur Code',
      difficulty: 'advanced',
      estimatedTime: '1.5 hours',
      order: 24,
      youtubeLink: 'https://www.youtube.com/watch?v=3ouqT3lfiUE'
    },
    {
      title: 'Backend Series Final Wrapup',
      description: 'Wrap up the backend curriculum, test the final system, and explore next learning paths.',
      instructor: 'Chai aur Code',
      difficulty: 'advanced',
      estimatedTime: '1.5 hours',
      order: 25,
      youtubeLink: 'https://www.youtube.com/watch?v=Uc3Iq41npyI'
    }
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
        {
          id: 'll_cp1',
          label: 'Paid LinkedList Bootcamp - Launch Video',
          description: 'Checkpoint 1',
          youtubeLink: 'https://www.youtube.com/embed/cg6JGiXhQ9c?rel=0&modestbranding=1'
        },
        {
          id: 'll_cp2',
          label: 'L1. Introduction to LinkedList | Traversal | Length | Search an Element',
          description: 'Checkpoint 2',
          youtubeLink: 'https://www.youtube.com/embed/Nq7ok-OyEpg?rel=0&modestbranding=1'
        },
        {
          id: 'll_cp3',
          label: 'L2. Deletion and Insertion in LL | 8 Problems',
          description: 'Checkpoint 3',
          youtubeLink: 'https://www.youtube.com/embed/VaECK03Dz-g?rel=0&modestbranding=1'
        },
        {
          id: 'll_cp4',
          label: 'L3. Introduction to Doubly LinkedList | Insertions and Deletions',
          description: 'Checkpoint 4',
          youtubeLink: 'https://www.youtube.com/embed/0eKMU10uEDI?rel=0&modestbranding=1'
        },
        {
          id: 'll_cp5',
          label: 'L4. Reverse a DLL | Multiple Approaches',
          description: 'Checkpoint 5',
          youtubeLink: 'https://www.youtube.com/embed/u3WUW2qe6ww?rel=0&modestbranding=1'
        },
        {
          id: 'll_cp6',
          label: 'L5. Add 2 numbers in LinkedList | Dummy Node Approach',
          description: 'Checkpoint 6',
          youtubeLink: 'https://www.youtube.com/embed/XmRrGzR6udg?rel=0&modestbranding=1'
        },
        {
          id: 'll_cp7',
          label: 'L6. Odd Even Linked List | Multiple Approaches',
          description: 'Checkpoint 7',
          youtubeLink: 'https://www.youtube.com/embed/qf6qp7GzD5Q?rel=0&modestbranding=1'
        },
        {
          id: 'll_cp8',
          label: "L7. Sort a LinkedList of 0's, 1's and 2's | Multiple Approaches",
          description: 'Checkpoint 8',
          youtubeLink: 'https://www.youtube.com/embed/gRII7LhdJWc?rel=0&modestbranding=1'
        },
        {
          id: 'll_cp9',
          label: 'L8. Remove Nth Node from the end of the LinkedList | Multiple Approaches',
          description: 'Checkpoint 9',
          youtubeLink: 'https://www.youtube.com/embed/3kMKYQ2wNIU?rel=0&modestbranding=1'
        },
        {
          id: 'll_cp10',
          label: 'L9. Reverse a LinkedList | Iterative and Recursive',
          description: 'Checkpoint 10',
          youtubeLink: 'https://www.youtube.com/embed/D2vI2DNJGd8?rel=0&modestbranding=1'
        },
        {
          id: 'll_cp11',
          label: 'L10. Check if a LinkedList is Palindrome or Not | Multiple Approaches',
          description: 'Checkpoint 11',
          youtubeLink: 'https://www.youtube.com/embed/lRY_G-u_8jk?rel=0&modestbranding=1'
        },
        {
          id: 'll_cp12',
          label: 'L11. Add 1 to a number represented by LinkedList',
          description: 'Checkpoint 12',
          youtubeLink: 'https://www.youtube.com/embed/aXQWhbvT3w0?rel=0&modestbranding=1'
        },
        {
          id: 'll_cp13',
          label: 'L12. Find the intersection point of Y LinkedList',
          description: 'Checkpoint 13',
          youtubeLink: 'https://www.youtube.com/embed/0DYoPz2Tpt4?rel=0&modestbranding=1'
        },
        {
          id: 'll_cp14',
          label: 'L13. Find the middle element of the LinkedList | Multiple Approaches',
          description: 'Checkpoint 14',
          youtubeLink: 'https://www.youtube.com/embed/7LjQ57RqgEc?rel=0&modestbranding=1'
        },
        {
          id: 'll_cp15',
          label: 'L14. Detect a loop or cycle in LinkedList | With proof and Intuition',
          description: 'Checkpoint 15',
          youtubeLink: 'https://www.youtube.com/embed/wiOo4DC5GGA?rel=0&modestbranding=1'
        },
        {
          id: 'll_cp16',
          label: 'L15. Find the length of the Loop in LinkedList',
          description: 'Checkpoint 16',
          youtubeLink: 'https://www.youtube.com/embed/I4g1qbkTPus?rel=0&modestbranding=1'
        },
        {
          id: 'll_cp17',
          label: 'L16. Delete the middle node of the LinkedList',
          description: 'Checkpoint 17',
          youtubeLink: 'https://www.youtube.com/embed/ePpV-_pfOeI?rel=0&modestbranding=1'
        },
        {
          id: 'll_cp18',
          label: 'L17. Find the starting point of the Loop/Cycle in LinkedList | Multiple Approaches',
          description: 'Checkpoint 18',
          youtubeLink: 'https://www.youtube.com/embed/2Kd0KKmmHFc?rel=0&modestbranding=1'
        },
        {
          id: 'll_cp19',
          label: 'L18. Delete all occurrences of a Key in DLL',
          description: 'Checkpoint 19',
          youtubeLink: 'https://www.youtube.com/embed/Mh0NH_SD92k?rel=0&modestbranding=1'
        },
        {
          id: 'll_cp20',
          label: 'L19. Find all Pairs with given Sum in DLL',
          description: 'Checkpoint 20',
          youtubeLink: 'https://www.youtube.com/embed/YitR4dQsddE?rel=0&modestbranding=1'
        },
        {
          id: 'll_cp21',
          label: 'L20. Remove duplicates from sorted DLL',
          description: 'Checkpoint 21',
          youtubeLink: 'https://www.youtube.com/embed/YJKVTnOJXSY?rel=0&modestbranding=1'
        },
        {
          id: 'll_cp22',
          label: 'L21. Reverse Nodes in K Group Size of LinkedList',
          description: 'Checkpoint 22',
          youtubeLink: 'https://www.youtube.com/embed/lIar1skcQYI?rel=0&modestbranding=1'
        },
        {
          id: 'll_cp23',
          label: 'L22. Rotate a LinkedList',
          description: 'Checkpoint 23',
          youtubeLink: 'https://www.youtube.com/embed/uT7YI7XbTY8?rel=0&modestbranding=1'
        },
        {
          id: 'll_cp24',
          label: 'L23. Merge two sorted Linked Lists',
          description: 'Checkpoint 24',
          youtubeLink: 'https://www.youtube.com/embed/jXu-H7XuClE?rel=0&modestbranding=1'
        },
        {
          id: 'll_cp25',
          label: 'L24. Flattening a LinkedList | Multiple Approaches with Dry Run',
          description: 'Checkpoint 25',
          youtubeLink: 'https://www.youtube.com/embed/ykelywHJWLg?rel=0&modestbranding=1'
        },
        {
          id: 'll_cp26',
          label: 'L25. Merge K Sorted Lists | Multiple Approaches',
          description: 'Checkpoint 26',
          youtubeLink: 'https://www.youtube.com/embed/1zktEppsdig?rel=0&modestbranding=1'
        },
        {
          id: 'll_cp27',
          label: 'L26. Sort a Linked List | Merge Sort and Brute Force',
          description: 'Checkpoint 27',
          youtubeLink: 'https://www.youtube.com/embed/8ocB7a_c-Cc?rel=0&modestbranding=1'
        },
        {
          id: 'll_cp28',
          label: 'L27. Clone a LinkedList with Next and Random Pointers | Copy List with Random Pointers',
          description: 'Checkpoint 28',
          youtubeLink: 'https://www.youtube.com/embed/q570bKdrnlw?rel=0&modestbranding=1'
        },
        {
          id: 'll_cp29',
          label: 'L28. Design a Browser History | LinkedList Implementation',
          description: 'Checkpoint 29',
          youtubeLink: 'https://www.youtube.com/embed/mG3KLugbOdc?rel=0&modestbranding=1'
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
          label: 'L1. Introduction to Stack and Queue | Implementation using Data Structures',
          description: 'Checkpoint 1',
          youtubeLink: 'https://www.youtube.com/embed/tqQ5fTamIN4?rel=0&modestbranding=1'
        },
        {
          id: 'sq_cp2',
          label: 'L2. Check for Balanced Parentheses | Stack and Queue',
          description: 'Checkpoint 2',
          youtubeLink: 'https://www.youtube.com/embed/xwjS0iZhw4I?rel=0&modestbranding=1'
        },
        {
          id: 'sq_cp3',
          label: 'L3. Prefix, Infix, and Postfix Conversion | Stack and Queue Playlist',
          description: 'Checkpoint 3',
          youtubeLink: 'https://www.youtube.com/embed/4pIc9UBHJtk?rel=0&modestbranding=1'
        },
        {
          id: 'sq_cp4',
          label: 'L4. Implement Min Stack | Stack and Queue Playlist',
          description: 'Checkpoint 4',
          youtubeLink: 'https://www.youtube.com/embed/NdDIaH91P0g?rel=0&modestbranding=1'
        },
        {
          id: 'sq_cp5',
          label: 'L5. Next Greater Element | Stack and Queue Playlist',
          description: 'Checkpoint 5',
          youtubeLink: 'https://www.youtube.com/embed/e7XQLtOQM3I?rel=0&modestbranding=1'
        },
        {
          id: 'sq_cp6',
          label: 'L6. Next Greater Element - II | Stack and Queue Playlist',
          description: 'Checkpoint 6',
          youtubeLink: 'https://www.youtube.com/embed/7PrncD7v9YQ?rel=0&modestbranding=1'
        },
        {
          id: 'sq_cp7',
          label: 'L7. Previous Smaller Element | Stack and Queue Playlist',
          description: 'Checkpoint 7',
          youtubeLink: 'https://www.youtube.com/embed/zMdbdGJNlh4?rel=0&modestbranding=1'
        },
        {
          id: 'sq_cp8',
          label: 'L8. Trapping Rainwater | 2 Approaches | Stack and Queue Playlist',
          description: 'Checkpoint 8',
          youtubeLink: 'https://www.youtube.com/embed/1_5VuquLbXg?rel=0&modestbranding=1'
        },
        {
          id: 'sq_cp9',
          label: 'L9. Sum of Subarray Minimum | Stack and Queue Playlist',
          description: 'Checkpoint 9',
          youtubeLink: 'https://www.youtube.com/embed/v0e8p9JCgRc?rel=0&modestbranding=1'
        },
        {
          id: 'sq_cp10',
          label: 'L10. Sum of subarray ranges | Stack and Queue Playlist',
          description: 'Checkpoint 10',
          youtubeLink: 'https://www.youtube.com/embed/gIrMptNPf5M?rel=0&modestbranding=1'
        },
        {
          id: 'sq_cp11',
          label: 'L11. Aestroid Collisions | Stack and Queue Playlist',
          description: 'Checkpoint 11',
          youtubeLink: 'https://www.youtube.com/embed/_eYGqw_VDR4?rel=0&modestbranding=1'
        },
        {
          id: 'sq_cp12',
          label: 'L12. Largest Rectangle in Histogram | Stack and Queue Playlist',
          description: 'Checkpoint 12',
          youtubeLink: 'https://www.youtube.com/embed/Bzat9vgD0fs?rel=0&modestbranding=1'
        },
        {
          id: 'sq_cp13',
          label: 'L13. Maximal Rectangle | Stack and Queue Playlist',
          description: 'Checkpoint 13',
          youtubeLink: 'https://www.youtube.com/embed/ttVu6G7Ayik?rel=0&modestbranding=1'
        },
        {
          id: 'sq_cp14',
          label: 'L14. Remove K Digits | Stack and Queue Playlist',
          description: 'Checkpoint 14',
          youtubeLink: 'https://www.youtube.com/embed/jmbuRzYPGrg?rel=0&modestbranding=1'
        },
        {
          id: 'sq_cp15',
          label: 'L15. Stock Span Problem | Stack and Queue Playlist',
          description: 'Checkpoint 15',
          youtubeLink: 'https://www.youtube.com/embed/eay-zoSRkVc?rel=0&modestbranding=1'
        },
        {
          id: 'sq_cp16',
          label: 'L16. Sliding Window Maximum | Stack and Queue Playlist',
          description: 'Checkpoint 16',
          youtubeLink: 'https://www.youtube.com/embed/NwBvene4Imo?rel=0&modestbranding=1'
        },
        {
          id: 'sq_cp17',
          label: 'L17. The Celebrity Problem | Stack and Queue Playlist',
          description: 'Checkpoint 17',
          youtubeLink: 'https://www.youtube.com/embed/cEadsbTeze4?rel=0&modestbranding=1'
        },
        {
          id: 'sq_cp18',
          label: 'L18. Implement LRU Cache',
          description: 'Checkpoint 18',
          youtubeLink: 'https://www.youtube.com/embed/z9bJUPxzFOw?rel=0&modestbranding=1'
        },
        {
          id: 'sq_cp19',
          label: 'L19. Implement LFU Cache',
          description: 'Checkpoint 19',
          youtubeLink: 'https://www.youtube.com/embed/mzqHlAW7jeE?rel=0&modestbranding=1'
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
          label: 'Announcing the FREE ka TREE SERIES #shorts',
          description: 'Checkpoint 1',
          youtubeLink: 'https://www.youtube.com/embed/OYqYEM1bMK8?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp2',
          label: 'L1. Introduction to Trees | Types of Trees',
          description: 'Checkpoint 2',
          youtubeLink: 'https://www.youtube.com/embed/_ANrF3FJm7I?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp3',
          label: 'L2. Binary Tree Representation in C++',
          description: 'Checkpoint 3',
          youtubeLink: 'https://www.youtube.com/embed/ctCpP0RFDFc?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp4',
          label: 'L3. Binary Tree Representation in Java',
          description: 'Checkpoint 4',
          youtubeLink: 'https://www.youtube.com/embed/hyLyW7rP24I?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp5',
          label: 'L4. Binary Tree Traversals in Binary Tree | BFS | DFS',
          description: 'Checkpoint 5',
          youtubeLink: 'https://www.youtube.com/embed/jmy0LaGET1I?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp6',
          label: 'L5. Preorder Traversal of Binary Tree | C++ | Java | Code Explanation',
          description: 'Checkpoint 6',
          youtubeLink: 'https://www.youtube.com/embed/RlUu72JrOCQ?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp7',
          label: 'L6. Inorder Traversal of Binary Tree | C++ | Java | Code Explanation',
          description: 'Checkpoint 7',
          youtubeLink: 'https://www.youtube.com/embed/Z_NEgBgbRVI?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp8',
          label: 'L7. Postorder Traversal of Binary Tree | C++ | Java | Code Explanation',
          description: 'Checkpoint 8',
          youtubeLink: 'https://www.youtube.com/embed/COQOU6klsBg?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp9',
          label: 'L8. Level Order Traversal of Binary Tree | BFS | C++ | Java',
          description: 'Checkpoint 9',
          youtubeLink: 'https://www.youtube.com/embed/EoAsWbO7sqg?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp10',
          label: 'L9. Iterative Preorder Traversal in Binary Tree | C++ | Java | Stack',
          description: 'Checkpoint 10',
          youtubeLink: 'https://www.youtube.com/embed/Bfqd8BsPVuw?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp11',
          label: 'L10. iterative Inorder Traversal in Binary Tree | C++ | Java | Stack',
          description: 'Checkpoint 11',
          youtubeLink: 'https://www.youtube.com/embed/lxTGsVXjwvM?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp12',
          label: 'L11. Iterative Postorder Traversal using 2 Stack | C++ | Java | Binary Tree',
          description: 'Checkpoint 12',
          youtubeLink: 'https://www.youtube.com/embed/2YBhNLodD8Q?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp13',
          label: 'L12. Iterative Postorder Traversal using 1 Stack | C++ | Java | Binary Trees',
          description: 'Checkpoint 13',
          youtubeLink: 'https://www.youtube.com/embed/NzIGLLwZBS8?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp14',
          label: 'L13. Preorder Inorder Postorder Traversals in One Traversal | C++ | Java | Stack | Binary Trees',
          description: 'Checkpoint 14',
          youtubeLink: 'https://www.youtube.com/embed/ySp2epYvgTE?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp15',
          label: 'L14. Maximum Depth in Binary Tree | Height of Binary Tree | C++ | Java',
          description: 'Checkpoint 15',
          youtubeLink: 'https://www.youtube.com/embed/eD3tmO66aBA?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp16',
          label: 'L15. Check for Balanced Binary Tree | C++ | Java',
          description: 'Checkpoint 16',
          youtubeLink: 'https://www.youtube.com/embed/Yt50Jfbd8Po?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp17',
          label: 'L16. Diameter of Binary Tree | C++ | Java',
          description: 'Checkpoint 17',
          youtubeLink: 'https://www.youtube.com/embed/Rezetez59Nk?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp18',
          label: 'L17. Maximum Path Sum in Binary Tree | C++ | Java',
          description: 'Checkpoint 18',
          youtubeLink: 'https://www.youtube.com/embed/WszrfSwMz58?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp19',
          label: 'L18. Check it two trees are Identical or Not | C++ | Java',
          description: 'Checkpoint 19',
          youtubeLink: 'https://www.youtube.com/embed/BhuvF_-PWS0?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp20',
          label: 'L19. Zig-Zag or Spiral Traversal in Binary Tree | C++ | Java',
          description: 'Checkpoint 20',
          youtubeLink: 'https://www.youtube.com/embed/3OXWEdlIGl4?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp21',
          label: 'L20. Boundary Traversal in Binary Tree | C++ | Java',
          description: 'Checkpoint 21',
          youtubeLink: 'https://www.youtube.com/embed/0ca1nvR0be4?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp22',
          label: 'L21. Vertical Order Traversal of Binary Tree | C++ | Java',
          description: 'Checkpoint 22',
          youtubeLink: 'https://www.youtube.com/embed/q_a6lpbKJdw?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp23',
          label: 'L22. Top View of Binary Tree | C++ | Java',
          description: 'Checkpoint 23',
          youtubeLink: 'https://www.youtube.com/embed/Et9OCDNvJ78?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp24',
          label: 'L23. Bottom View of Binary Tree | C++ | Java',
          description: 'Checkpoint 24',
          youtubeLink: 'https://www.youtube.com/embed/0FtVY6I4pB8?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp25',
          label: 'L24. Right/Left View of Binary Tree | C++ | Java',
          description: 'Checkpoint 25',
          youtubeLink: 'https://www.youtube.com/embed/KV4mRzTjlAk?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp26',
          label: 'L25. Check for Symmetrical Binary Trees | C++ | Java',
          description: 'Checkpoint 26',
          youtubeLink: 'https://www.youtube.com/embed/nKggNAiEpBE?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp27',
          label: 'L26. Print Root to Node Path in Binary Tree | C++ | Java',
          description: 'Checkpoint 27',
          youtubeLink: 'https://www.youtube.com/embed/fmflMqVOC7k?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp28',
          label: 'L27. Lowest Common Ancestor in Binary Tree | LCA | C++ | Java',
          description: 'Checkpoint 28',
          youtubeLink: 'https://www.youtube.com/embed/_-QHfMDde90?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp29',
          label: 'L28. Maximum Width of Binary Tree | C++ | Java',
          description: 'Checkpoint 29',
          youtubeLink: 'https://www.youtube.com/embed/ZbybYvcVLks?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp30',
          label: 'L29. Children Sum Property in Binary Tree | O(N) Approach | C++ | Java',
          description: 'Checkpoint 30',
          youtubeLink: 'https://www.youtube.com/embed/fnmisPM6cVo?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp31',
          label: 'L30. Print all the Nodes at a distance of K in Binary Tree | C++ | Java',
          description: 'Checkpoint 31',
          youtubeLink: 'https://www.youtube.com/embed/i9ORlEy6EsI?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp32',
          label: 'L31. Minimum time taken to BURN the Binary Tree from a Node | C++ | Java',
          description: 'Checkpoint 32',
          youtubeLink: 'https://www.youtube.com/embed/2r5wLmQfD6g?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp33',
          label: 'L32. Count total Nodes in a COMPLETE Binary Tree | O(Log^2 N) Approach | C++ | Java',
          description: 'Checkpoint 33',
          youtubeLink: 'https://www.youtube.com/embed/u-yWemKGWO0?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp34',
          label: 'L33. Requirements needed to construct a Unique Binary Tree | Theory',
          description: 'Checkpoint 34',
          youtubeLink: 'https://www.youtube.com/embed/9GMECGQgWrQ?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp35',
          label: 'L34. Construct a Binary Tree from Preorder and Inorder Traversal | C++ | Java',
          description: 'Checkpoint 35',
          youtubeLink: 'https://www.youtube.com/embed/aZNaLrVebKQ?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp36',
          label: 'L35. Construct the Binary Tree from Postorder and Inorder Traversal | C++ | Java',
          description: 'Checkpoint 36',
          youtubeLink: 'https://www.youtube.com/embed/LgLRTaEMRVc?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp37',
          label: 'L36. Serialize and De-serialize Binary Tree | C++ | Java',
          description: 'Checkpoint 37',
          youtubeLink: 'https://www.youtube.com/embed/-YbXySKJsX8?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp38',
          label: 'L37. Morris Traversal | Preorder | Inorder | C++ | Java',
          description: 'Checkpoint 38',
          youtubeLink: 'https://www.youtube.com/embed/80Zug6D1_r4?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp39',
          label: 'L38. Flatten a Binary Tree to Linked List | 3 Approaches | C++ | Java',
          description: 'Checkpoint 39',
          youtubeLink: 'https://www.youtube.com/embed/sWf7k1x9XR4?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp40',
          label: 'L39. Introduction to Binary Search Tree | BST',
          description: 'Checkpoint 40',
          youtubeLink: 'https://www.youtube.com/embed/p7-9UvDQZ3w?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp41',
          label: 'L40. Search in a Binary Search Tree | BST | C++ | Java',
          description: 'Checkpoint 41',
          youtubeLink: 'https://www.youtube.com/embed/KcNt6v_56cc?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp42',
          label: 'L41. Ceil in a Binary Search Tree | BST | C++ | Java',
          description: 'Checkpoint 42',
          youtubeLink: 'https://www.youtube.com/embed/KSsk8AhdOZA?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp43',
          label: 'L42. Floor in a Binary Search Tree | BST | C++ | Java',
          description: 'Checkpoint 43',
          youtubeLink: 'https://www.youtube.com/embed/xm_W1ub-K-w?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp44',
          label: 'L43. Insert a given Node in Binary Search Tree | BST | C++ | Java',
          description: 'Checkpoint 44',
          youtubeLink: 'https://www.youtube.com/embed/FiFiNvM29ps?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp45',
          label: 'L44. Delete a Node in Binary Search Tree | BST | C++ | Java',
          description: 'Checkpoint 45',
          youtubeLink: 'https://www.youtube.com/embed/kouxiP_H5WE?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp46',
          label: 'L45. K-th Smallest/Largest Element in BST',
          description: 'Checkpoint 46',
          youtubeLink: 'https://www.youtube.com/embed/9TJYWh0adfk?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp47',
          label: 'L46. Check if a tree is a BST or BT | Validate a BST',
          description: 'Checkpoint 47',
          youtubeLink: 'https://www.youtube.com/embed/f-sj7I5oXEI?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp48',
          label: 'L47. LCA in Binary Search Tree',
          description: 'Checkpoint 48',
          youtubeLink: 'https://www.youtube.com/embed/cX_kPV_foZc?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp49',
          label: 'L48. Construct a BST from a preorder traversal | 3 Methods',
          description: 'Checkpoint 49',
          youtubeLink: 'https://www.youtube.com/embed/UmJT3j26t1I?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp50',
          label: 'L49. Inorder Successor/Predecessor in BST | 3 Methods',
          description: 'Checkpoint 50',
          youtubeLink: 'https://www.youtube.com/embed/SXKAD2svfmI?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp51',
          label: 'L50. Binary Search Tree Iterator | BST | O(H) Space',
          description: 'Checkpoint 51',
          youtubeLink: 'https://www.youtube.com/embed/D2jMcmxU4bs?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp52',
          label: 'L51. Two Sum In BST | Check if there exists a pair with Sum K',
          description: 'Checkpoint 52',
          youtubeLink: 'https://www.youtube.com/embed/ssL3sHwPeb4?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp53',
          label: 'L52. Recover BST | Correct BST with two nodes swapped',
          description: 'Checkpoint 53',
          youtubeLink: 'https://www.youtube.com/embed/ZWGW7FminDM?rel=0&modestbranding=1'
        },
        {
          id: 'tree_cp54',
          label: 'L53. Largest BST in Binary Tree',
          description: 'Checkpoint 54',
          youtubeLink: 'https://www.youtube.com/embed/X0oXMdtUDwo?rel=0&modestbranding=1'
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
          label: 'G-1. Introduction to Graph | Types | Different Conventions Used',
          description: 'Checkpoint 1',
          youtubeLink: 'https://www.youtube.com/embed/M3_pLsDdeuU?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp2',
          label: 'G-2. Graph Representation in C++ | Two Ways to Represent',
          description: 'Checkpoint 2',
          youtubeLink: 'https://www.youtube.com/embed/3oI-34aPMWM?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp3',
          label: 'G-3. Graph Representation in Java | Two Ways to Represent',
          description: 'Checkpoint 3',
          youtubeLink: 'https://www.youtube.com/embed/OsNklbh9gYI?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp4',
          label: 'G-4. What are Connected Components ?',
          description: 'Checkpoint 4',
          youtubeLink: 'https://www.youtube.com/embed/lea-Wl_uWXY?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp5',
          label: 'G-5. Breadth-First Search (BFS) | C++ and Java | Traversal Technique in Graphs',
          description: 'Checkpoint 5',
          youtubeLink: 'https://www.youtube.com/embed/-tgVpUgsQ5k?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp6',
          label: 'G-6. Depth-First Search (DFS) | C++ and Java | Traversal Technique in Graphs',
          description: 'Checkpoint 6',
          youtubeLink: 'https://www.youtube.com/embed/Qzf1a--rhp8?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp7',
          label: 'G-7. Number of Provinces | C++ | Java | Connected Components',
          description: 'Checkpoint 7',
          youtubeLink: 'https://www.youtube.com/embed/ACzkVtewUYA?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp8',
          label: 'G-8. Number of Islands | Number of Connected Components in Matrix | C++ | Java',
          description: 'Checkpoint 8',
          youtubeLink: 'https://www.youtube.com/embed/muncqlKJrH0?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp9',
          label: 'G-9. Flood Fill Algorithm | C++ | Java',
          description: 'Checkpoint 9',
          youtubeLink: 'https://www.youtube.com/embed/C-2_uSRli8o?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp10',
          label: 'G-10. Rotten Oranges | C++ | Java',
          description: 'Checkpoint 10',
          youtubeLink: 'https://www.youtube.com/embed/yf3oUhkvqA0?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp11',
          label: 'G-11. Detect a Cycle in an Undirected Graph using BFS | C++ | Java',
          description: 'Checkpoint 11',
          youtubeLink: 'https://www.youtube.com/embed/BPlrALf1LDU?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp12',
          label: 'G-12. Detect a Cycle in an Undirected Graph using DFS | C++ | Java',
          description: 'Checkpoint 12',
          youtubeLink: 'https://www.youtube.com/embed/zQ3zgFypzX4?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp13',
          label: 'G-13. Distance of nearest cell having 1 | 0/1 Matrix | C++ | Java',
          description: 'Checkpoint 13',
          youtubeLink: 'https://www.youtube.com/embed/edXdVwkYHF8?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp14',
          label: "G-14. Surrounded Regions | Replace O's with X's | C++ | Java",
          description: 'Checkpoint 14',
          youtubeLink: 'https://www.youtube.com/embed/BtdgAys4yMk?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp15',
          label: 'G-15. Number of Enclaves | Multi-source BFS | C++ | Java',
          description: 'Checkpoint 15',
          youtubeLink: 'https://www.youtube.com/embed/rxKcepXQgU4?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp16',
          label: 'G-16. Number of Distinct Islands | Constructive Thinking + DFS | C++ | Java',
          description: 'Checkpoint 16',
          youtubeLink: 'https://www.youtube.com/embed/7zmgQSJghpo?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp17',
          label: 'G-17. Bipartite Graph | BFS | C++ | Java',
          description: 'Checkpoint 17',
          youtubeLink: 'https://www.youtube.com/embed/-vu34sct1g8?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp18',
          label: 'G-18. Bipartite Graph | DFS | C++ | Java',
          description: 'Checkpoint 18',
          youtubeLink: 'https://www.youtube.com/embed/KG5YFfR0j8A?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp19',
          label: 'G-19. Detect cycle in a directed graph using DFS | Java | C++',
          description: 'Checkpoint 19',
          youtubeLink: 'https://www.youtube.com/embed/9twcmtQj4DU?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp20',
          label: 'G-20. Find Eventual Safe States - DFS',
          description: 'Checkpoint 20',
          youtubeLink: 'https://www.youtube.com/embed/uRbJ1OF9aYM?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp21',
          label: 'G-21. Topological Sort Algorithm | DFS',
          description: 'Checkpoint 21',
          youtubeLink: 'https://www.youtube.com/embed/5lZ0iJMrUMk?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp22',
          label: "G-22. Kahn's Algorithm | Topological Sort Algorithm | BFS",
          description: 'Checkpoint 22',
          youtubeLink: 'https://www.youtube.com/embed/73sneFXuTEg?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp23',
          label: "G-23. Detect a Cycle in Directed Graph | Topological Sort | Kahn's Algorithm | BFS",
          description: 'Checkpoint 23',
          youtubeLink: 'https://www.youtube.com/embed/iTBaI90lpDQ?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp24',
          label: 'G-24. Course Schedule I and II | Pre-requisite Tasks | Topological Sort',
          description: 'Checkpoint 24',
          youtubeLink: 'https://www.youtube.com/embed/WAOfKpxYHR8?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp25',
          label: 'G-25. Find Eventual Safe States - BFS - Topological Sort',
          description: 'Checkpoint 25',
          youtubeLink: 'https://www.youtube.com/embed/2gtg3VsDGyc?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp26',
          label: 'G-26. Alien Dictionary - Topological Sort',
          description: 'Checkpoint 26',
          youtubeLink: 'https://www.youtube.com/embed/U3N_je7tWAs?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp27',
          label: 'G-27. Shortest Path in Directed Acyclic Graph - Topological Sort',
          description: 'Checkpoint 27',
          youtubeLink: 'https://www.youtube.com/embed/ZUFQfFaU-8U?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp28',
          label: 'G-28. Shortest Path in Undirected Graph with Unit Weights',
          description: 'Checkpoint 28',
          youtubeLink: 'https://www.youtube.com/embed/C4gxoTaI71U?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp29',
          label: 'G-29. Word Ladder - I | Shortest Paths',
          description: 'Checkpoint 29',
          youtubeLink: 'https://www.youtube.com/embed/tRPda0rcf8E?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp30',
          label: 'G-30. Word Ladder - 2 | Shortest Paths',
          description: 'Checkpoint 30',
          youtubeLink: 'https://www.youtube.com/embed/DREutrv2XD0?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp31',
          label: 'G-31. Word Ladder - 2 | Optimised Approach for Leetcode',
          description: 'Checkpoint 31',
          youtubeLink: 'https://www.youtube.com/embed/AD4SFl7tu7I?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp32',
          label: "G-32. Dijkstra's Algorithm - Using Priority Queue - C++ and Java - Part 1",
          description: 'Checkpoint 32',
          youtubeLink: 'https://www.youtube.com/embed/V6H1qAeB-l4?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp33',
          label: "G-33. Dijkstra's Algorithm - Using Set - Part 2",
          description: 'Checkpoint 33',
          youtubeLink: 'https://www.youtube.com/embed/PATgNiuTP20?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp34',
          label: "G-34. Dijkstra's Algorithm - Why PQ and not Q, Intuition, Time Complexity Derivation - Part 3",
          description: 'Checkpoint 34',
          youtubeLink: 'https://www.youtube.com/embed/3dINsjyfooY?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp35',
          label: "G-35. Print Shortest Path - Dijkstra's Algorithm",
          description: 'Checkpoint 35',
          youtubeLink: 'https://www.youtube.com/embed/rp1SMw7HSO8?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp36',
          label: 'G-36. Shortest Distance in a Binary Maze',
          description: 'Checkpoint 36',
          youtubeLink: 'https://www.youtube.com/embed/U5Mw4eyUmw4?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp37',
          label: 'G-37. Path With Minimum Effort',
          description: 'Checkpoint 37',
          youtubeLink: 'https://www.youtube.com/embed/0ytpZyiZFhA?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp38',
          label: 'G-38. Cheapest Flights Within K Stops',
          description: 'Checkpoint 38',
          youtubeLink: 'https://www.youtube.com/embed/9XybHVqTHcQ?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp39',
          label: 'G-39. Minimum Multiplications to Reach End',
          description: 'Checkpoint 39',
          youtubeLink: 'https://www.youtube.com/embed/_BvEJ3VIDWw?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp40',
          label: 'G-40. Number of Ways to Arrive at Destination',
          description: 'Checkpoint 40',
          youtubeLink: 'https://www.youtube.com/embed/_-0mx0SmYxA?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp41',
          label: 'G-41. Bellman Ford Algorithm',
          description: 'Checkpoint 41',
          youtubeLink: 'https://www.youtube.com/embed/0vVofAhAYjc?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp42',
          label: 'G-42. Floyd Warshall Algorithm',
          description: 'Checkpoint 42',
          youtubeLink: 'https://www.youtube.com/embed/YbY8cVwWAvw?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp43',
          label: 'G-43. Find the City With the Smallest Number of Neighbours at a Threshold Distance',
          description: 'Checkpoint 43',
          youtubeLink: 'https://www.youtube.com/embed/PwMVNSJ5SLI?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp44',
          label: 'G-44. Minimum Spanning Tree - Theory',
          description: 'Checkpoint 44',
          youtubeLink: 'https://www.youtube.com/embed/ZSPjZuZWCME?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp45',
          label: "G-45. Prim's Algorithm - Minimum Spanning Tree - C++ and Java",
          description: 'Checkpoint 45',
          youtubeLink: 'https://www.youtube.com/embed/mJcZjjKzeqk?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp46',
          label: 'G-46. Disjoint Set | Union by Rank | Union by Size | Path Compression',
          description: 'Checkpoint 46',
          youtubeLink: 'https://www.youtube.com/embed/aBxjDBC4M1U?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp47',
          label: "G-47. Kruskal's Algorithm - Minimum Spanning Tree - C++ and Java",
          description: 'Checkpoint 47',
          youtubeLink: 'https://www.youtube.com/embed/DMnDM_sxVig?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp48',
          label: 'G-48. Number of Provinces - Disjoint Set',
          description: 'Checkpoint 48',
          youtubeLink: 'https://www.youtube.com/embed/ZGr5nX-Gi6Y?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp49',
          label: 'G-49. Number of Operations to Make Network Connected - DSU',
          description: 'Checkpoint 49',
          youtubeLink: 'https://www.youtube.com/embed/FYrl7iz9_ZU?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp50',
          label: 'G-50. Accounts Merge - DSU',
          description: 'Checkpoint 50',
          youtubeLink: 'https://www.youtube.com/embed/FMwpt_aQOGw?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp51',
          label: 'G-51. Number of Islands - II - Online Queries - DSU',
          description: 'Checkpoint 51',
          youtubeLink: 'https://www.youtube.com/embed/Rn6B-Q4SNyA?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp52',
          label: 'G-52. Making a Large Island - DSU',
          description: 'Checkpoint 52',
          youtubeLink: 'https://www.youtube.com/embed/lgiz0Oup6gM?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp53',
          label: 'G-53. Most Stones Removed with Same Row or Column - DSU',
          description: 'Checkpoint 53',
          youtubeLink: 'https://www.youtube.com/embed/OwMNX8SPavM?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp54',
          label: "G-54. Strongly Connected Components - Kosaraju's Algorithm",
          description: 'Checkpoint 54',
          youtubeLink: 'https://www.youtube.com/embed/R6uoSjZ2imo?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp55',
          label: "G-55. Bridges in Graph - Using Tarjan's Algorithm of time in and low time",
          description: 'Checkpoint 55',
          youtubeLink: 'https://www.youtube.com/embed/qrAub5z8FeA?rel=0&modestbranding=1'
        },
        {
          id: 'graph_cp56',
          label: 'G-56. Articulation Point in Graph',
          description: 'Checkpoint 56',
          youtubeLink: 'https://www.youtube.com/embed/j1QDfU21iZk?rel=0&modestbranding=1'
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
          label: 'DP 1. Introduction to Dynamic Programming  Memoization  Tabulation  Space Optimization Techniques',
          description: 'Checkpoint 1',
          youtubeLink: 'https://www.youtube.com/embed/tyB0ztf0DNY?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp2',
          label: 'DP 2. Climbing Stairs  Learn How to Write 1D Recurrence Relations',
          description: 'Checkpoint 2',
          youtubeLink: 'https://www.youtube.com/embed/mLfjzJsN8us?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp3',
          label: 'DP 3. Frog Jump  Dynamic Programming  Learn to write 1D DP',
          description: 'Checkpoint 3',
          youtubeLink: 'https://www.youtube.com/embed/EgG3jsGoPvQ?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp4',
          label: 'DP 4. Frog Jump with K Distance  Lecture 3 Follow Up Question',
          description: 'Checkpoint 4',
          youtubeLink: 'https://www.youtube.com/embed/Kmh3rhyEtB8?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp5',
          label: 'DP 5. Maximum Sum of Non-Adjacent Elements  House Robber  1-D  DP on Subsequences',
          description: 'Checkpoint 5',
          youtubeLink: 'https://www.youtube.com/embed/GrMBfJNk_NY?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp6',
          label: 'DP 6. House Robber 2  1D DP  DP on Subsequences',
          description: 'Checkpoint 6',
          youtubeLink: 'https://www.youtube.com/embed/3WaxQMELSkw?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp7',
          label: 'DP 7. Ninjas Training  MUST WATCH for 2D CONCEPTS 🔥  Vacation  Atcoder  2D DP',
          description: 'Checkpoint 7',
          youtubeLink: 'https://www.youtube.com/embed/AE39gJYuRog?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp8',
          label: 'DP 8. Grid Unique Paths  Learn Everything about DP on Grids  ALL TECHNIQUES 🔥',
          description: 'Checkpoint 8',
          youtubeLink: 'https://www.youtube.com/embed/sdE0A2Oxofw?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp9',
          label: 'DP 9. Unique Paths 2  DP on Grid with Maze Obstacles',
          description: 'Checkpoint 9',
          youtubeLink: 'https://www.youtube.com/embed/TmhpgXScLyY?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp10',
          label: 'DP 10. Minimum Path Sum in Grid  Asked to me In Microsoft Internship Interview  DP on GRIDS',
          description: 'Checkpoint 10',
          youtubeLink: 'https://www.youtube.com/embed/_rgTlyky1uQ?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp11',
          label: 'DP 11. Triangle  Fixed Starting Point and Variable Ending Point  DP on GRIDS',
          description: 'Checkpoint 11',
          youtubeLink: 'https://www.youtube.com/embed/SrP-PiLSYC0?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp12',
          label: 'DP 12. Minimum/Maximum Falling Path Sum  Variable Starting and Ending Points  DP on Grids',
          description: 'Checkpoint 12',
          youtubeLink: 'https://www.youtube.com/embed/N_aJ5qQbYA0?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp13',
          label: 'DP 13. Cherry Pickup II  3D DP Made Easy  DP On Grids',
          description: 'Checkpoint 13',
          youtubeLink: 'https://www.youtube.com/embed/QGfn7JeXK54?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp14',
          label: 'DP 14. Subset Sum Equals to Target  Identify DP on Subsequences and Ways to Solve them',
          description: 'Checkpoint 14',
          youtubeLink: 'https://www.youtube.com/embed/fWX9xDmIzRI?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp15',
          label: 'DP 15. Partition Equal Subset Sum  DP on Subsequences',
          description: 'Checkpoint 15',
          youtubeLink: 'https://www.youtube.com/embed/7win3dcgo3k?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp16',
          label: 'Dp 16. Partition A Set Into Two Subsets With Minimum Absolute Sum Difference  DP on Subsequences',
          description: 'Checkpoint 16',
          youtubeLink: 'https://www.youtube.com/embed/GS_OqZb2CWc?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp17',
          label: 'DP 17. Counts Subsets with Sum K  Dp on Subsequences',
          description: 'Checkpoint 17',
          youtubeLink: 'https://www.youtube.com/embed/ZHyb-A2Mte4?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp18',
          label: 'DP 18. Count Partitions With Given Difference  Dp on Subsequences',
          description: 'Checkpoint 18',
          youtubeLink: 'https://www.youtube.com/embed/zoilQD1kYSg?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp19',
          label: 'DP 19. 0/1 Knapsack  Recursion to Single Array Space Optimised Approach  DP on Subsequences',
          description: 'Checkpoint 19',
          youtubeLink: 'https://www.youtube.com/embed/GqOmJHQZivw?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp20',
          label: 'DP 20. Minimum Coins  DP on Subsequences  Infinite Supplies Pattern',
          description: 'Checkpoint 20',
          youtubeLink: 'https://www.youtube.com/embed/myPeWb3Y68A?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp21',
          label: 'DP 21. Target Sum  DP on Subsequences',
          description: 'Checkpoint 21',
          youtubeLink: 'https://www.youtube.com/embed/b3GD8263-PQ?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp22',
          label: 'DP 22. Coin Change 2  Infinite Supply Problems   DP on Subsequences',
          description: 'Checkpoint 22',
          youtubeLink: 'https://www.youtube.com/embed/HgyouUi11zk?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp23',
          label: 'DP 23. Unbounded Knapsack  1-D Array Space Optimised Approach',
          description: 'Checkpoint 23',
          youtubeLink: 'https://www.youtube.com/embed/OgvOZ6OrJoY?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp24',
          label: 'DP 24. Rod Cutting Problem  1D Array Space Optimised Approach',
          description: 'Checkpoint 24',
          youtubeLink: 'https://www.youtube.com/embed/mO8XpGoJwuo?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp25',
          label: 'Dp 25. Longest Common Subsequence  Top Down  Bottom-Up  Space Optimised  DP on Strings',
          description: 'Checkpoint 25',
          youtubeLink: 'https://www.youtube.com/embed/NPZn9jBrX8U?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp26',
          label: 'DP 26. Print Longest Common Subsequence  Dp on Strings',
          description: 'Checkpoint 26',
          youtubeLink: 'https://www.youtube.com/embed/-zI4mrF2Pb4?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp27',
          label: 'DP 27. Longest Common Substring  DP on Strings 🔥',
          description: 'Checkpoint 27',
          youtubeLink: 'https://www.youtube.com/embed/_wP9mWNPL5w?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp28',
          label: 'DP 28. Longest Palindromic Subsequence',
          description: 'Checkpoint 28',
          youtubeLink: 'https://www.youtube.com/embed/6i_T5kkfv4A?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp29',
          label: 'DP 29. Minimum Insertions to Make String Palindrome',
          description: 'Checkpoint 29',
          youtubeLink: 'https://www.youtube.com/embed/xPBLEj41rFU?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp30',
          label: 'DP 30. Minimum Insertions/Deletions to Convert String A to String B',
          description: 'Checkpoint 30',
          youtubeLink: 'https://www.youtube.com/embed/yMnH0jrir0Q?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp31',
          label: 'DP 31. Shortest Common Supersequence  DP on Strings',
          description: 'Checkpoint 31',
          youtubeLink: 'https://www.youtube.com/embed/xElxAuBcvsU?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp32',
          label: 'DP 32. Distinct Subsequences  1D Array Optimisation Technique 🔥',
          description: 'Checkpoint 32',
          youtubeLink: 'https://www.youtube.com/embed/nVG7eTiD2bY?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp33',
          label: 'DP 33. Edit Distance  Recursive to 1D Array Optimised Solution 🔥',
          description: 'Checkpoint 33',
          youtubeLink: 'https://www.youtube.com/embed/fJaKO8FbDdo?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp34',
          label: 'DP 34. Wildcard Matching  Recursive to 1D Array Optimisation 🔥',
          description: 'Checkpoint 34',
          youtubeLink: 'https://www.youtube.com/embed/ZmlQ3vgAOMo?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp35',
          label: 'DP 35. Best Time to Buy and Sell Stock  DP on Stocks 🔥',
          description: 'Checkpoint 35',
          youtubeLink: 'https://www.youtube.com/embed/excAOvwF_Wk?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp36',
          label: 'DP 36. Buy and Sell Stock - II  Recursion to Space Optimisation',
          description: 'Checkpoint 36',
          youtubeLink: 'https://www.youtube.com/embed/nGJmxkUJQGs?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp37',
          label: 'DP 37. Buy and Sell Stocks III  Recursion to Space Optimisation',
          description: 'Checkpoint 37',
          youtubeLink: 'https://www.youtube.com/embed/-uQGzhYj8BQ?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp38',
          label: 'DP 38. Buy and Stock Sell IV  Recursion to Space Optimisation',
          description: 'Checkpoint 38',
          youtubeLink: 'https://www.youtube.com/embed/IV1dHbk5CDc?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp39',
          label: 'DP 39. Buy and Sell Stocks With Cooldown  Recursion to Space Optimisation',
          description: 'Checkpoint 39',
          youtubeLink: 'https://www.youtube.com/embed/IGIe46xw3YY?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp40',
          label: 'DP 40. Buy and Sell Stocks With Transaction Fee  Recursion to Space Optimisation',
          description: 'Checkpoint 40',
          youtubeLink: 'https://www.youtube.com/embed/k4eK-vEmnKg?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp41',
          label: 'DP 41. Longest Increasing Subsequence  Memoization',
          description: 'Checkpoint 41',
          youtubeLink: 'https://www.youtube.com/embed/ekcwMsSIzVc?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp42',
          label: 'DP 42. Printing Longest Increasing Subsequence  Tabulation  Algorithm',
          description: 'Checkpoint 42',
          youtubeLink: 'https://www.youtube.com/embed/IFfYfonAFGc?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp43',
          label: 'DP 43. Longest Increasing Subsequence  Binary Search  Intuition',
          description: 'Checkpoint 43',
          youtubeLink: 'https://www.youtube.com/embed/on2hvxBXJH4?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp44',
          label: 'DP 44. Largest Divisible Subset  Longest Increasing Subsequence',
          description: 'Checkpoint 44',
          youtubeLink: 'https://www.youtube.com/embed/gDuZwBW9VvM?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp45',
          label: 'DP 45. Longest String Chain  Longest Increasing Subsequence  LIS',
          description: 'Checkpoint 45',
          youtubeLink: 'https://www.youtube.com/embed/YY8iBaYcc4g?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp46',
          label: 'DP 46. Longest Bitonic Subsequence  LIS',
          description: 'Checkpoint 46',
          youtubeLink: 'https://www.youtube.com/embed/y4vN0WNdrlg?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp47',
          label: 'DP 47. Number of Longest Increasing Subsequences',
          description: 'Checkpoint 47',
          youtubeLink: 'https://www.youtube.com/embed/cKVl1TFdNXg?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp48',
          label: 'DP 48. Matrix Chain Multiplication  MCM  Partition DP Starts 🔥',
          description: 'Checkpoint 48',
          youtubeLink: 'https://www.youtube.com/embed/vRVfmbCFW7Y?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp49',
          label: 'DP 49. Matrix Chain Multiplication  Bottom-Up  Tabulation',
          description: 'Checkpoint 49',
          youtubeLink: 'https://www.youtube.com/embed/pDCXsbAw5Cg?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp50',
          label: 'DP 50. Minimum Cost to Cut the Stick',
          description: 'Checkpoint 50',
          youtubeLink: 'https://www.youtube.com/embed/xwomavsC86c?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp51',
          label: 'DP 51. Burst Balloons  Partition DP  Interactive G-Meet Session Update',
          description: 'Checkpoint 51',
          youtubeLink: 'https://www.youtube.com/embed/Yz4LlDSlkns?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp52',
          label: 'DP 52. Evaluate Boolean Expression to True  Partition DP',
          description: 'Checkpoint 52',
          youtubeLink: 'https://www.youtube.com/embed/MM7fXopgyjw?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp53',
          label: 'DP 53. Palindrome Partitioning - II  Front Partition 🔥',
          description: 'Checkpoint 53',
          youtubeLink: 'https://www.youtube.com/embed/_H8V5hJUGd0?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp54',
          label: 'DP 54. Partition Array for Maximum Sum  Front Partition 🔥',
          description: 'Checkpoint 54',
          youtubeLink: 'https://www.youtube.com/embed/PhWWJmaKfMc?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp55',
          label: 'DP 55. Maximum Rectangle Area with all 1s  DP on Rectangles',
          description: 'Checkpoint 55',
          youtubeLink: 'https://www.youtube.com/embed/tOylVCugy9k?rel=0&modestbranding=1'
        },
        {
          id: 'dp_cp56',
          label: 'DP 56. Count Square Submatrices with All Ones  DP on Rectangles 🔥',
          description: 'Checkpoint 56',
          youtubeLink: 'https://www.youtube.com/embed/auS1fynpnjo?rel=0&modestbranding=1'
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
          label: 'L1. Assign Cookies  Greedy Algorithm Playlist',
          description: 'Checkpoint 1',
          youtubeLink: 'https://www.youtube.com/embed/DIX2p7vb9co?rel=0&modestbranding=1'
        },
        {
          id: 'greedy_cp2',
          label: 'L2. Lemonade Change  Greedy Algorithm Playlist',
          description: 'Checkpoint 2',
          youtubeLink: 'https://www.youtube.com/embed/n_tmibEhO6Q?rel=0&modestbranding=1'
        },
        {
          id: 'greedy_cp3',
          label: 'L3. Shortest Job First (or SJF) CPU Scheduling',
          description: 'Checkpoint 3',
          youtubeLink: 'https://www.youtube.com/embed/3-QbX1iDbXs?rel=0&modestbranding=1'
        },
        {
          id: 'greedy_cp4',
          label: 'L4. Jump Game - I  Greedy Algorithm Playlist',
          description: 'Checkpoint 4',
          youtubeLink: 'https://www.youtube.com/embed/tZAa_jJ3SwQ?rel=0&modestbranding=1'
        },
        {
          id: 'greedy_cp5',
          label: 'L5. Jump Game - II  Greedy Algorithm Playlist',
          description: 'Checkpoint 5',
          youtubeLink: 'https://www.youtube.com/embed/7SBVnw7GSTk?rel=0&modestbranding=1'
        },
        {
          id: 'greedy_cp6',
          label: 'L6. Job Sequencing Problem  Greedy Algorithm Playlist',
          description: 'Checkpoint 6',
          youtubeLink: 'https://www.youtube.com/embed/QbwltemZbRg?rel=0&modestbranding=1'
        },
        {
          id: 'greedy_cp7',
          label: 'L7. N Meeting in One Room  Greedy Algorithms Playlist',
          description: 'Checkpoint 7',
          youtubeLink: 'https://www.youtube.com/embed/mKfhTotEguk?rel=0&modestbranding=1'
        },
        {
          id: 'greedy_cp8',
          label: 'L8. Non Overlapping Intervals  Greedy Algorithms Playlist',
          description: 'Checkpoint 8',
          youtubeLink: 'https://www.youtube.com/embed/HDHQ8lAWakY?rel=0&modestbranding=1'
        },
        {
          id: 'greedy_cp9',
          label: 'L9. Insert Intervals  Greedy Algorithms Playlist',
          description: 'Checkpoint 9',
          youtubeLink: 'https://www.youtube.com/embed/xxRE-46OCC8?rel=0&modestbranding=1'
        },
        {
          id: 'greedy_cp10',
          label: 'L10. Minimum number of platforms required in a railway station',
          description: 'Checkpoint 10',
          youtubeLink: 'https://www.youtube.com/embed/AsGzwR_FWok?rel=0&modestbranding=1'
        },
        {
          id: 'greedy_cp11',
          label: 'L11. Valid Parenthesis String  Multiple Approaches',
          description: 'Checkpoint 11',
          youtubeLink: 'https://www.youtube.com/embed/cHT6sG_hUZI?rel=0&modestbranding=1'
        },
        {
          id: 'greedy_cp12',
          label: 'L12. Candy  Slope Approach Intuition Based',
          description: 'Checkpoint 12',
          youtubeLink: 'https://www.youtube.com/embed/IIqVFvKE6RY?rel=0&modestbranding=1'
        },
        {
          id: 'greedy_cp13',
          label: 'L13. Fractional Knapsack Algorithm',
          description: 'Checkpoint 13',
          youtubeLink: 'https://www.youtube.com/embed/1ibsQrnuEEg?rel=0&modestbranding=1'
        }
      ],
      youtubeLink: 'https://www.youtube.com/watch?v=DIX2p7vb9co&list=PLgUwDviBIf0rF1w2Koyh78zafB0cz7tea'
    }
  ],
  'dsa:10': [
    { title: 'Heaps & Heapify', description: 'Max/Min Heap representations, insertion/deletion, Heapify, and HeapSort.', instructor: 'Love Babbar', difficulty: 'intermediate', estimatedTime: '4 hours', order: 1, youtubeLink: 'https://www.youtube.com/watch?v=HqPJF2L5h9U', theoryLink: 'https://www.geeksforgeeks.org/heap-data-structure/', practiceLink: 'https://leetcode.com/tag/heap-priority-queue/' },
    { title: 'Heap Interview Questions', description: 'Kth smallest element, merge heaps, median in a stream.', instructor: 'Love Babbar', difficulty: 'advanced', estimatedTime: '5 hours', order: 2, youtubeLink: 'https://www.youtube.com/watch?v=HqPJF2L5h9U', theoryLink: 'https://www.geeksforgeeks.org/heap-data-structure/', practiceLink: 'https://leetcode.com/problems/find-median-from-data-stream/' },
    { title: 'Tries & Implementation', description: 'Prefix trees, insertion, search, and prefix matching algorithms.', instructor: 'Love Babbar', difficulty: 'intermediate', estimatedTime: '4 hours', order: 3, youtubeLink: 'https://www.youtube.com/watch?v=dBGUmUQhjaM', theoryLink: 'https://www.geeksforgeeks.org/trie-insert-and-search/', practiceLink: 'https://leetcode.com/problems/implement-trie-prefix-tree/' }
  ]

,
  'devops:1': [
    {
        "title": "Linux Basics",
        "description": "File system, commands, permissions",
        "difficulty": "beginner",
        "estimatedTime": "4 hours",
        "order": 1,
        "youtubeLink": "https://www.youtube.com/watch?v=ROjZy1WbCIA"
    },
    {
        "title": "User Management",
        "description": "Users, groups, sudo",
        "difficulty": "beginner",
        "estimatedTime": "2 hours",
        "order": 2,
        "youtubeLink": "https://www.youtube.com/watch?v=ROjZy1WbCIA"
    }
],
  'devops:2': [
    {
        "title": "Networking Fundamentals",
        "description": "OSI Model, TCP/IP, IP Addressing",
        "difficulty": "intermediate",
        "estimatedTime": "5 hours",
        "order": 1,
        "youtubeLink": "https://www.youtube.com/watch?v=Wvf0mBNGjXY"
    },
    {
        "title": "DNS & HTTP",
        "description": "How domain names and web requests work",
        "difficulty": "beginner",
        "estimatedTime": "3 hours",
        "order": 2,
        "youtubeLink": "https://www.youtube.com/watch?v=Wvf0mBNGjXY"
    }
],
  'devops:3': [
    {
        "title": "Git Fundamentals",
        "description": "Commits, branching, merging",
        "difficulty": "beginner",
        "estimatedTime": "3 hours",
        "order": 1,
        "youtubeLink": "https://www.youtube.com/watch?v=RGOj5yH7evk"
    },
    {
        "title": "GitHub Workflows",
        "description": "Pull requests, code reviews, actions basics",
        "difficulty": "intermediate",
        "estimatedTime": "3 hours",
        "order": 2,
        "youtubeLink": "https://www.youtube.com/watch?v=RGOj5yH7evk"
    }
],
  'devops:4': [
    {
        "title": "Bash Scripting Basics",
        "description": "Variables, loops, conditions",
        "difficulty": "intermediate",
        "estimatedTime": "4 hours",
        "order": 1,
        "youtubeLink": "https://www.youtube.com/watch?v=v-F3YLd6oMw"
    },
    {
        "title": "Automating Tasks",
        "description": "Cron jobs, script execution",
        "difficulty": "intermediate",
        "estimatedTime": "3 hours",
        "order": 2,
        "youtubeLink": "https://www.youtube.com/watch?v=v-F3YLd6oMw"
    }
],
  'devops:5': [
    {
        "title": "Docker Containers",
        "description": "Images, Containers, Dockerfile",
        "difficulty": "intermediate",
        "estimatedTime": "5 hours",
        "order": 1,
        "youtubeLink": "https://www.youtube.com/watch?v=3c-iBn73dDE"
    },
    {
        "title": "Docker Compose",
        "description": "Multi-container applications",
        "difficulty": "intermediate",
        "estimatedTime": "3 hours",
        "order": 2,
        "youtubeLink": "https://www.youtube.com/watch?v=3c-iBn73dDE"
    }
],
  'devops:6': [
    {
        "title": "Kubernetes Architecture",
        "description": "Nodes, Pods, Services, Deployments",
        "difficulty": "advanced",
        "estimatedTime": "6 hours",
        "order": 1,
        "youtubeLink": "https://www.youtube.com/watch?v=X48VuDVv0do"
    },
    {
        "title": "Managing K8s Clusters",
        "description": "kubectl, scaling, updates",
        "difficulty": "advanced",
        "estimatedTime": "5 hours",
        "order": 2,
        "youtubeLink": "https://www.youtube.com/watch?v=X48VuDVv0do"
    }
],
  'devops:7': [
    {
        "title": "CI/CD Concepts",
        "description": "Continuous Integration & Deployment",
        "difficulty": "intermediate",
        "estimatedTime": "3 hours",
        "order": 1,
        "youtubeLink": "https://www.youtube.com/watch?v=j5Zsa_eOXeY"
    },
    {
        "title": "GitHub Actions",
        "description": "Automating workflows with GitHub",
        "difficulty": "intermediate",
        "estimatedTime": "4 hours",
        "order": 2,
        "youtubeLink": "https://www.youtube.com/watch?v=RGOj5yH7evk"
    }
],
  'devops:8': [
    {
        "title": "Infrastructure as Code",
        "description": "Introduction to IaC",
        "difficulty": "intermediate",
        "estimatedTime": "2 hours",
        "order": 1,
        "youtubeLink": "https://www.youtube.com/watch?v=l5k1aiIGfSc"
    },
    {
        "title": "Terraform Basics",
        "description": "Providers, resources, state",
        "difficulty": "advanced",
        "estimatedTime": "5 hours",
        "order": 2,
        "youtubeLink": "https://www.youtube.com/watch?v=l5k1aiIGfSc"
    }
],
  'devops:9': [
    {
        "title": "Configuration Management",
        "description": "Ansible architecture, playbooks",
        "difficulty": "advanced",
        "estimatedTime": "5 hours",
        "order": 1,
        "youtubeLink": "https://www.youtube.com/watch?v=1id6IGB4nPU"
    }
],
  'devops:10': [
    {
        "title": "Monitoring with Prometheus",
        "description": "Metrics, scraping, alerts",
        "difficulty": "advanced",
        "estimatedTime": "4 hours",
        "order": 1,
        "youtubeLink": "https://www.youtube.com/watch?v=h4Sl21AKiDg"
    },
    {
        "title": "Visualization with Grafana",
        "description": "Dashboards, data sources",
        "difficulty": "advanced",
        "estimatedTime": "3 hours",
        "order": 2,
        "youtubeLink": "https://www.youtube.com/watch?v=h4Sl21AKiDg"
    }
],
  'devops:11': [
    {
        "title": "AWS Cloud Basics",
        "description": "EC2, S3, IAM, VPC",
        "difficulty": "intermediate",
        "estimatedTime": "6 hours",
        "order": 1,
        "youtubeLink": "https://www.youtube.com/watch?v=k1RI5locZE4"
    }
],
  'devops:12': [
    {
        "title": "Full CI/CD Pipeline Project",
        "description": "Deploy a microservices app using Docker, K8s, and Terraform",
        "difficulty": "advanced",
        "estimatedTime": "10 hours",
        "order": 1,
        "youtubeLink": "https://www.youtube.com/watch?v=3c-iBn73dDE"
    }
]
};

module.exports = topicData;