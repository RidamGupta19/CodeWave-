// Zero to Coding Game Questions Database
// Fully structured to offer a gradual, Duolingo-like progression from zero to printing, input, math, types, conditions, and loops.

export const zeroToCodingModules = [
  { id: 1, name: "Printing Output", description: "Learn to command your computer to speak!", icon: "💬" },
  { id: 2, name: "Taking Input", description: "Teach your program to listen and remember!", icon: "📥" },
  { id: 3, name: "Basic Operations", description: "Harness the calculator inside your CPU!", icon: "➕" },
  { id: 4, name: "Variables & Data Types", description: "Learn about labels, memory boxes, and containers!", icon: "📦" },
  { id: 5, name: "Conditions", description: "Help your code make smart decisions!", icon: "🧠" },
  { id: 6, name: "Loops", description: "Unleash infinite repetition power!", icon: "🔄" }
];

export const zeroToCodingQuestions = [
  // ==========================================
  // MODULE 1: PRINTING OUTPUT
  // ==========================================
  {
    id: "q1",
    moduleId: 1,
    difficulty: "easy",
    xp: 5,
    title: "Your First Words",
    statement: "In coding, we use a special print command to display text on the screen. Let's start our journey by saying 'Hello World'!",
    examples: [
      { input: "No Input Needed", output: "Hello World" }
    ],
    hints: [
      "Use the print statement exactly as written in the options.",
      "Check that your capitalization matches 'Hello World' perfectly."
    ],
    explanation: "Computers need precise commands. The print command takes whatever text is inside the quotation marks and prints it out word-for-word.",
    dryRun: "Code starts -> Finds print statement -> Grabs 'Hello World' -> Outputs to screen -> Code ends.",
    commonMistakes: "Forgetting the quotation marks, writing 'hello world' in all lowercase, or forgetting parentheses.",
    type: "mcq",
    questionData: {
      code: `// Which of the following correctly prints 'Hello World'?`,
      options: [
        `print(Hello World);`,
        `print("Hello World");`,
        `say "Hello World"`,
        `display[Hello World]`
      ],
      correctIndex: 1
    },
    nextQuestionId: "q2"
  },
  {
    id: "q2",
    moduleId: 1,
    difficulty: "easy",
    xp: 5,
    title: "Line Breaking Magic",
    statement: "Printing on next lines is super easy. Let's output 'Hello' on the first line and 'World' on the second line! In python or JavaScript, each print statement automatically starts a new line.",
    examples: [
      { input: "No Input Needed", output: "Hello\nWorld" }
    ],
    hints: [
      "Arrange the print statements in the order they should execute.",
      "The first print statement should output 'Hello', and the second one should output 'World'."
    ],
    explanation: "The computer executes code line-by-line. The first line runs first, printing 'Hello' and moving the cursor down. Then the second line runs, printing 'World'.",
    dryRun: "Line 1: print('Hello') -> Outputs 'Hello' -> Cursor moves to next line. Line 2: print('World') -> Outputs 'World'.",
    commonMistakes: "Writing both words inside a single print statement without any line break characters.",
    type: "drag",
    questionData: {
      lines: [
        { id: "line1", content: `print("Hello");` },
        { id: "line2", content: `print("World");` }
      ],
      correctOrder: ["line1", "line2"]
    },
    nextQuestionId: "q3"
  },
  {
    id: "q3",
    moduleId: 1,
    difficulty: "medium",
    xp: 10,
    title: "Pattern Architect",
    statement: "Let's build a simple custom staircase pattern using print commands! We want to print:\n*\n**\n***",
    examples: [
      { input: "No Input Needed", output: "*\n**\n***" }
    ],
    hints: [
      "The first line has 1 star: '*'",
      "The second line has 2 stars: '**'",
      "The third line has 3 stars: '***'"
    ],
    explanation: "By combining multiple print statements with increasing amounts of stars, we can draw shapes directly in our output terminal!",
    dryRun: "Line 1 prints 1 star. Line 2 prints 2 stars. Line 3 prints 3 stars.",
    commonMistakes: "Putting spaces between the stars, or putting them all on the same line.",
    type: "fill",
    questionData: {
      template: `print("___");\nprint("**");\nprint("___");`,
      blanks: ["*", "***"]
    },
    nextQuestionId: "q4"
  },

  // ==========================================
  // MODULE 2: TAKING INPUT
  // ==========================================
  {
    id: "q4",
    moduleId: 2,
    difficulty: "easy",
    xp: 5,
    title: "The Listening Machine",
    statement: "To make our code dynamic, we must take input from the user. Fill in the blank to take an input name and print 'Hello ' followed by that name!",
    examples: [
      { input: "Om", output: "Hello Om" }
    ],
    hints: [
      "We use the 'input()' command to listen to what the user writes.",
      "The input is saved in a variable called 'name' so we can reuse it."
    ],
    explanation: "The variable 'name' acts like a labelled memory box. The 'input()' command waits for the user to type, then places that value inside the memory box.",
    dryRun: "User types 'Om' -> input() grabs it -> name box gets 'Om' -> print('Hello ' + name) -> prints 'Hello Om'.",
    commonMistakes: "Typing 'input' without parentheses, or using a capital I.",
    type: "fill",
    questionData: {
      template: `name = ______();\nprint("Hello " + name);`,
      blanks: ["input"]
    },
    nextQuestionId: "q5"
  },
  {
    id: "q5",
    moduleId: 2,
    difficulty: "medium",
    xp: 10,
    title: "Interactive Greeting",
    statement: "Look at the following code snippet. If the user inputs the value 'Alice', what will the program output to the screen?",
    examples: [
      { input: "Alice", output: "Welcome Agent: Alice" }
    ],
    hints: [
      "Read the code closely. It prints 'Welcome Agent: ' and then appends the variable.",
      "Combine the greeting string with the input name exactly."
    ],
    explanation: "String concatenation (+) merges two pieces of text into a single cohesive message.",
    dryRun: "user_id is assigned input -> user enters 'Alice' -> prints 'Welcome Agent: ' + 'Alice'.",
    commonMistakes: "Predicting just 'Alice' or forgetting the prefix 'Welcome Agent: '.",
    type: "predict",
    questionData: {
      code: `user_id = input();\nprint("Welcome Agent: " + user_id);`,
      correctOutput: "Welcome Agent: Alice"
    },
    nextQuestionId: "q6"
  },

  // ==========================================
  // MODULE 3: BASIC OPERATIONS
  // ==========================================
  {
    id: "q6",
    moduleId: 3,
    difficulty: "easy",
    xp: 5,
    title: "The Digital Calculator",
    statement: "Let's perform simple arithmetic operations! Add these two numbers together by completing the code snippet.",
    examples: [
      { input: "No Input Needed", output: "12" }
    ],
    hints: [
      "The plus operator '+' is used to perform addition between two numbers."
    ],
    explanation: "When the computer sees a mathematical operator (+, -, *, /) between numbers, it resolves the equation instantly.",
    dryRun: "a is 7 -> b is 5 -> result is a + b -> 7 + 5 is 12 -> prints 12.",
    commonMistakes: "Using '=' instead of '+' to add.",
    type: "fill",
    questionData: {
      template: `a = 7;\nb = 5;\nresult = a ___ b;\nprint(result);`,
      blanks: ["+"]
    },
    nextQuestionId: "q7"
  },
  {
    id: "q7",
    moduleId: 3,
    difficulty: "medium",
    xp: 10,
    title: "The Remainder Detective",
    statement: "In coding, we have a special operation called 'Modulo' written as the percent sign '%'. Modulo returns the REMAINDER of a division. What will this program output?",
    examples: [
      { input: "No Input Needed", output: "1" }
    ],
    hints: [
      "Divide 7 by 2: 7 divided by 2 is 3, with a remainder of 1.",
      "The modulo operator '%' isolates only the remaining part."
    ],
    explanation: "Modulo (%) is extremely useful in coding, especially for checking if a number is even (modulo 2 equals 0) or odd (modulo 2 equals 1).",
    dryRun: "number is 7 -> remainder = 7 % 2 -> 2 goes into 7 three times, leaving a remainder of 1 -> prints 1.",
    commonMistakes: "Thinking modulo performs division and returns the quotient (3.5 or 3). Modulo ONLY returns the remainder.",
    type: "predict",
    questionData: {
      code: `number = 7;\nremainder = number % 2;\nprint(remainder);`,
      correctOutput: "1"
    },
    nextQuestionId: "q8"
  },

  // ==========================================
  // MODULE 4: VARIABLES & DATA TYPES
  // ==========================================
  {
    id: "q8",
    moduleId: 4,
    difficulty: "easy",
    xp: 5,
    title: "Container Matching",
    statement: "Different containers store different types of data. Let's match the descriptions to their respective variable types!",
    examples: [
      { input: "No Input Needed", output: "Data types matched correctly." }
    ],
    hints: [
      "int stores whole numbers (e.g. 5, 23).",
      "float stores decimals (e.g. 3.14).",
      "string stores text (e.g. 'Hello').",
      "bool stores True or False."
    ],
    explanation: "By defining data types, the computer allocates the right amount of memory and understands how to interact with the stored values.",
    dryRun: "No variable manipulation; static conceptual check.",
    commonMistakes: "Confusing float (decimal) with int (whole number).",
    type: "mcq",
    questionData: {
      code: `// Which data type would you use to store a decimal number like 98.6?`,
      options: [
        "int (Integer)",
        "float (Floating Point)",
        "string (Text String)",
        "bool (Boolean)"
      ],
      correctIndex: 1
    },
    nextQuestionId: "q9"
  },
  {
    id: "q9",
    moduleId: 4,
    difficulty: "hard",
    xp: 20,
    title: "The Ultimate Swap",
    statement: "A classic puzzle: Swap the values of two variables! If x is 5 and y is 10, how can we swap them? We use a temporary container 'temp' as a middleman! Rearrange the steps to swap x and y successfully.",
    examples: [
      { input: "No Input Needed", output: "x becomes 10, y becomes 5" }
    ],
    hints: [
      "First, back up the value of x into the 'temp' box.",
      "Second, copy the value of y into x safely (since x is backed up).",
      "Third, pull the original value of x from 'temp' and put it into y."
    ],
    explanation: "If you do 'x = y' first, you overwrite the value of x, and its original number is lost forever. That's why we need a temporary middleman variable!",
    dryRun: "temp = x (temp gets 5) -> x = y (x gets 10) -> y = temp (y gets 5). Swap complete!",
    commonMistakes: "Doing 'x = y' followed by 'y = x', which makes both variables equal to y's original value (10).",
    type: "drag",
    questionData: {
      lines: [
        { id: "line1", content: `temp = x;` },
        { id: "line2", content: `x = y;` },
        { id: "line3", content: `y = temp;` }
      ],
      correctOrder: ["line1", "line2", "line3"]
    },
    nextQuestionId: "q10"
  },

  // ==========================================
  // MODULE 5: CONDITIONS
  // ==========================================
  {
    id: "q10",
    moduleId: 5,
    difficulty: "medium",
    xp: 10,
    title: "Eligible to Vote?",
    statement: "We use 'if' statements to make choices. Let's complete the code to check if a user is eligible to vote! (Age must be 18 or older).",
    examples: [
      { input: "No Input Needed", output: "Prints 'Can Vote' if age >= 18" }
    ],
    hints: [
      "We want to check if age is 'greater than or equal to' 18.",
      "The operator for greater than or equal to is '>='."
    ],
    explanation: "If conditions evaluate to True, the computer runs the indented block of code. If False, it skips it or runs the 'else' block.",
    dryRun: "age is 20 -> checks 20 >= 18 -> True -> enters 'if' block -> prints 'Can Vote'.",
    commonMistakes: "Using '<=' which checks if they are younger, or using '=' which sets the variable.",
    type: "fill",
    questionData: {
      template: `age = 20;\nif (age ___ 18) {\n  print("Can Vote");\n} else {\n  print("Cannot Vote");\n}`,
      blanks: [">="]
    },
    nextQuestionId: "q11"
  },
  {
    id: "q11",
    moduleId: 5,
    difficulty: "easy",
    xp: 5,
    title: "Odd or Even?",
    statement: "Let's check if a number is even or odd! An even number leaves a remainder of 0 when divided by 2. Fill in the blank to verify if the number is even.",
    examples: [
      { input: "No Input Needed", output: "Prints 'Even'" }
    ],
    hints: [
      "To check for equivalence in coding, we use the double equals '==' operator.",
      "We want to check if the remainder of division by 2 is equal to 0."
    ],
    explanation: "The modulo operator (%) finds the remainder. If 'number % 2' is 0, the number divides cleanly by 2, making it even.",
    dryRun: "number is 8 -> 8 % 2 is 0 -> checks 0 == 0 -> True -> prints 'Even'.",
    commonMistakes: "Using a single '=' which is for assigning values, rather than '==' which is for comparison.",
    type: "fill",
    questionData: {
      template: `number = 8;\nif (number % 2 ___ 0) {\n  print("Even");\n} else {\n  print("Odd");\n}`,
      blanks: ["=="]
    },
    nextQuestionId: "q12"
  },

  // ==========================================
  // MODULE 6: LOOPS
  // ==========================================
  {
    id: "q12",
    moduleId: 6,
    difficulty: "medium",
    xp: 10,
    title: "The Counting Machine",
    statement: "Loops allow us to repeat code. Look at this loop. It starts counting from 1 and keeps going while the count is less than or equal to 3. What will it print?",
    examples: [
      { input: "No Input Needed", output: "1\n2\n3" }
    ],
    hints: [
      "At first, count is 1. It prints 1, then adds 1 to count (making it 2).",
      "Then it checks if 2 <= 3 (True). It prints 2, then adds 1 (making it 3).",
      "Then it checks if 3 <= 3 (True). It prints 3, then adds 1 (making it 4).",
      "Then it checks if 4 <= 3 (False). The loop terminates!"
    ],
    explanation: "Loops run repeatedly until their condition turns False. Always make sure to update your counter variable, otherwise the loop will repeat forever in an infinite loop!",
    dryRun: "Initial: count = 1. Iteration 1: prints 1, count -> 2. Iteration 2: prints 2, count -> 3. Iteration 3: prints 3, count -> 4. Loop exits.",
    commonMistakes: "Thinking the loop will print 4, or forgetting that the count increments each time.",
    type: "predict",
    questionData: {
      code: `count = 1;\nwhile (count <= 3) {\n  print(count);\n  count = count + 1;\n}`,
      correctOutput: "1\n2\n3"
    },
    nextQuestionId: "q13"
  },
  {
    id: "q13",
    moduleId: 6,
    difficulty: "hard",
    xp: 20,
    title: "Broken Loop Rescue",
    statement: "This loop was meant to print numbers from 1 to 5, but the programmer forgot to increment the counter, causing a dangerous infinite loop! Fix the bug by putting the increment statement inside the loop.",
    examples: [
      { input: "No Input Needed", output: "1\n2\n3\n4\n5" }
    ],
    hints: [
      "Inside a while loop, we must increment the counter on every iteration.",
      "The statement 'i = i + 1;' adds 1 to our loop variable 'i' so it eventually reaches 6 and stops."
    ],
    explanation: "Without incrementing 'i', 'i' remains 1 forever. Since 1 is always <= 5, the condition is always True, and the computer spins in a circle forever.",
    dryRun: "i is 1 -> checks 1 <= 5 -> True -> prints 1 -> i becomes 2 -> checks 2 <= 5 -> True -> ... -> i becomes 6 -> exits.",
    commonMistakes: "Putting the increment outside the loop body or subtracting from 'i'.",
    type: "bug",
    questionData: {
      buggyCode: `i = 1;\nwhile (i <= 5) {\n  print(i);\n  // Bug: infinite loop! i never changes.\n}`,
      correctCode: `i = 1;\nwhile (i <= 5) {\n  print(i);\n  i = i + 1;\n}`
    },
    nextQuestionId: null
  }
];
