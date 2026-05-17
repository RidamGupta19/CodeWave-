// Premium C++ Beginner Arcade Levels
// Structured to transition absolute beginners from printing to nested loop patterns with real C++ boilerplate and compilation checks.

export const zeroToCodingMonacoLevels = [
  {
    id: 1,
    title: "Print Hello World",
    difficulty: "Rookie",
    xpReward: 10,
    learningObjective: "Welcome coder! Today you'll learn how to print output in C++ using the 'cout' stream operator.",
    problemStatement: `TASK:
Print the text "Hello World!" exactly to the console.

In C++, the stream operator \`cout <<\` is used to print text on the screen. The text must be enclosed inside double quotation marks \`""\`.`,
    starterCode: `#include <iostream>
using namespace std;

int main() {
    // Write your code below
    
    
    return 0;
}`,
    expectedKeywords: ["cout", "Hello World!"],
    validationFn: (code) => {
      const cleaned = code.replace(/\s+/g, '');
      if (!cleaned.includes('cout<<"HelloWorld!";')) {
        if (!cleaned.includes(';')) return { success: false, error: "Compilation Error: You forgot a semicolon ';' at the end of your print statement." };
        if (!cleaned.includes('cout<<')) return { success: false, error: "Syntax Error: C++ uses 'cout <<' to direct outputs to the screen. Did you misspell 'cout' or forget the '<<' brackets?" };
        if (!code.includes('"Hello World!"')) return { success: false, error: "Value Error: The output text must match 'Hello World!' exactly inside double quotes." };
        return { success: false, error: "Structure Error: Make sure your statement reads: cout << \"Hello World!\";" };
      }
      return { success: true, output: "Hello World!" };
    },
    hints: [
      "Use cout << \"Hello World!\";",
      "Ensure the string text is enclosed in double quotes.",
      "Don't forget the semicolon (;) at the end of the statement!"
    ]
  },
  {
    id: 2,
    title: "Print Multiple Lines",
    difficulty: "Rookie",
    xpReward: 15,
    learningObjective: "Let's stack lines! Learn to use 'endl' (end line) to shift printing output to the next line.",
    problemStatement: `TASK:
Print "Hello" on the first line and "World" on the second line.

In C++, sending \`endl\` to cout behaves like pressing the 'Enter' key on your keyboard:
\`cout << "Line 1" << endl;\``,
    starterCode: `#include <iostream>
using namespace std;

int main() {
    // Write your code below
    
    
    return 0;
}`,
    expectedKeywords: ["cout", "endl"],
    validationFn: (code) => {
      const cleaned = code.replace(/\s+/g, '');
      if (cleaned.includes('cout<<"Hello"<<endl<<"World";') || cleaned.includes('cout<<"Hello"<<endl;cout<<"World";')) {
        return { success: true, output: "Hello\nWorld" };
      }
      if (!cleaned.includes('endl')) {
        return { success: false, error: "Syntax Error: To transition to the next line, you must output 'endl' (e.g. cout << ... << endl;)" };
      }
      return { success: false, error: "Structure Error: Ensure your output prints 'Hello', then 'endl', followed by 'World'." };
    },
    hints: [
      "Use: cout << \"Hello\" << endl;",
      "Next, print the second word: cout << \"World\";",
      "Ensure both lines are correctly terminated with semicolons."
    ]
  },
  {
    id: 3,
    title: "Understanding Variables",
    difficulty: "Explorer",
    xpReward: 20,
    learningObjective: "Learn about memory boxes! Declare an integer variable to store and output a specific age number.",
    problemStatement: `TASK:
Declare an integer variable named "age", store the value "20" inside it, and print it to the console.

In C++, we declare whole numbers using the \`int\` type:
\`int score = 100;\`
To print a variable, pass it directly to cout without double quotes:
\`cout << score;\``,
    starterCode: `#include <iostream>
using namespace std;

int main() {
    // Write your code below
    
    
    return 0;
}`,
    expectedKeywords: ["int", "age", "20", "cout"],
    validationFn: (code) => {
      const cleaned = code.replace(/\s+/g, '');
      if (cleaned.includes('intage=20;cout<<age;')) {
        return { success: true, output: "20" };
      }
      if (!cleaned.includes('intage')) {
        return { success: false, error: "Declaration Error: Did you declare the integer variable exactly as 'int age = 20;'?" };
      }
      if (!cleaned.includes('cout<<age')) {
        return { success: false, error: "Output Error: Remember to output the variable value using 'cout << age;'. Do not put quotes around 'age'!" };
      }
      return { success: false, error: "Syntax Error: Double check your declarations, assignments, and semicolons." };
    },
    hints: [
      "Write: int age = 20;",
      "Then print it: cout << age;",
      "Putting quotes around the variable name (like \"age\") prints the word rather than the number. Leave quotes off!"
    ]
  },
  {
    id: 4,
    title: "Input/Output Expedition",
    difficulty: "Explorer",
    xpReward: 25,
    learningObjective: "Teach your program to listen! Use 'cin' to accept user console inputs and print them out.",
    problemStatement: `TASK:
Declare an integer variable named "userCode", take input from the console into it using "cin", and print "Code is: " followed by that number.

In C++, the stream operator \`cin >>\` directs console inputs into a variable. Note that the arrows point RIGHT (\`>>\`) for input!`,
    starterCode: `#include <iostream>
using namespace std;

int main() {
    // Write your code below
    
    
    return 0;
}`,
    expectedKeywords: ["cin", "cout", "userCode"],
    validationFn: (code) => {
      const cleaned = code.replace(/\s+/g, '');
      if (cleaned.includes('intuserCode;cin>>userCode;cout<<"Codeis:"<<userCode;') || cleaned.includes('intuserCode;cin>>userCode;cout<<"Codeis:"<<userCode;')) {
        return { success: true, output: "Code is: 42" }; // simulates input 42
      }
      if (!cleaned.includes('userCode')) {
        return { success: false, error: "Naming Error: Declare the variable as 'int userCode;' first." };
      }
      if (!cleaned.includes('cin>>userCode')) {
        return { success: false, error: "Input Error: Use 'cin >> userCode;' to capture user inputs. (Arrows point right!)" };
      }
      if (!cleaned.includes('cout<<"Codeis:"<<userCode')) {
        return { success: false, error: "Output Error: Make sure your final line reads: cout << \"Code is: \" << userCode;" };
      }
      return { success: false, error: "Structure Error: Keep the logic clear. Declare -> Input -> Output." };
    },
    hints: [
      "Declare: int userCode;",
      "Input: cin >> userCode;",
      "Output: cout << \"Code is: \" << userCode;"
    ]
  },
  {
    id: 5,
    title: "Making Choices (If Else)",
    difficulty: "Builder",
    xpReward: 30,
    learningObjective: "Help your code make decisions! Complete an 'if/else' condition to check voting eligibility.",
    problemStatement: `TASK:
Declare an integer variable named "age" set to "19". If age is greater than or equal to 18, print "Can Vote". Otherwise, print "Cannot Vote".

In C++, conditional structures look like this:
\`if (age >= 18) { ... } else { ... }\``,
    starterCode: `#include <iostream>
using namespace std;

int main() {
    // Write your code below
    
    
    return 0;
}`,
    expectedKeywords: ["if", "else", "age", "Can Vote"],
    validationFn: (code) => {
      const cleaned = code.replace(/\s+/g, '');
      if (cleaned.includes('intage=19;') && cleaned.includes('if(age>=18)') && cleaned.includes('cout<<"CanVote";') && cleaned.includes('else') && cleaned.includes('cout<<"CannotVote";')) {
        return { success: true, output: "Can Vote" };
      }
      if (!cleaned.includes('age=19')) {
        return { success: false, error: "Variable Error: Declare age as: int age = 19;" };
      }
      if (!cleaned.includes('if(')) {
        return { success: false, error: "Logic Error: Create an 'if' condition block comparing age." };
      }
      return { success: false, error: "Condition Error: Make sure you match Can Vote and Cannot Vote print messages exactly." };
    },
    hints: [
      "Set age first: int age = 19;",
      "Conditional check: if (age >= 18) { cout << \"Can Vote\"; }",
      "Else case: else { cout << \"Cannot Vote\"; }"
    ]
  },
  {
    id: 6,
    title: "Repeating Work (Loops)",
    difficulty: "Coder",
    xpReward: 35,
    learningObjective: "Harness repetition power! Write a 'for' loop to print numbers from 1 to 3.",
    problemStatement: `TASK:
Write a 'for' loop that counts from 1 to 3, printing each number followed by a space.

In C++, a standard counting loop looks like this:
\`for (int i = 1; i <= 3; i++) { cout << i << " "; }\``,
    starterCode: `#include <iostream>
using namespace std;

int main() {
    // Write your code below
    
    
    return 0;
}`,
    expectedKeywords: ["for", "cout"],
    validationFn: (code) => {
      const cleaned = code.replace(/\s+/g, '');
      if (cleaned.includes('for(inti=1;i<=3;i++)') && (cleaned.includes('cout<<i<<"";') || cleaned.includes('cout<<i<<"";'))) {
        return { success: true, output: "1 2 3 " };
      }
      if (!cleaned.includes('for(')) {
        return { success: false, error: "Loop Error: Construct a 'for' loop starting with 'int i = 1'." };
      }
      return { success: false, error: "Loop Syntax: Ensure the loop counts up to 3 and outputs 'i' followed by a space: cout << i << \" \";" };
    },
    hints: [
      "Start loop: for (int i = 1; i <= 3; i++) { ... }",
      "Inside loop: cout << i << \" \";"
    ]
  },
  {
    id: 7,
    title: "Mastering Patterns",
    difficulty: "Architect",
    xpReward: 50,
    learningObjective: "The final trial! Use nested loops to print a custom staircase pattern of stars (*).",
    problemStatement: `TASK:
Using nested loops, print a two-line star staircase:
*
**

The outer loop should run 2 times. The inner loop should print stars based on the current row count!`,
    starterCode: `#include <iostream>
using namespace std;

int main() {
    // Write your code below
    
    
    return 0;
}`,
    expectedKeywords: ["for", "cout"],
    validationFn: (code) => {
      const cleaned = code.replace(/\s+/g, '');
      if (cleaned.includes('for(') && cleaned.includes('cout<<"*";') && cleaned.includes('cout<<endl;')) {
        return { success: true, output: "*\n**" };
      }
      return { success: false, error: "Pattern Error: Verify your outer loop structures, inner star print statements, and newlines." };
    },
    hints: [
      "Use an outer loop: for(int r=1; r<=2; r++)",
      "Inside outer loop, print stars: for(int c=1; c<=r; c++) { cout << \"*\"; }",
      "After the inner loop, transition to next line: cout << endl;"
    ]
  }
];
