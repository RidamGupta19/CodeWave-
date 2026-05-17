// Premium C++, Java, Python, and JavaScript Beginner Arcade Levels
// Structured to transition absolute beginners from printing to nested loop patterns with multi-language boilerplates and validation.

export const zeroToCodingMonacoLevels = [
  {
    id: 1,
    title: "Print Hello World",
    difficulty: "Rookie",
    xpReward: 10,
    learningObjective: "Welcome coder! Today you'll learn how to print output to the screen using the console stream or printing functions.",
    problemStatement: `Print the text "Hello World!" exactly to the console.

In programming, we output text to the console so users can read it. Let's see how different languages do this:
- **C++**: Uses \`cout << "Hello World!";\`
- **Java**: Uses \`System.out.println("Hello World!");\`
- **Python**: Uses \`print("Hello World!")\`
- **JavaScript**: Uses \`console.log("Hello World!");\``,
    constraints: "Output must match the casing, spelling, and spacing exactly.",
    examples: [
      {
        input: "None",
        output: "Hello World!"
      }
    ],
    starterCodes: {
      cpp: `#include <iostream>
using namespace std;

int main() {
    // Write your code below
    cout << "Hello World!";
    
    return 0;
}`,
      java: `public class Main {
    public static void main(String[] args) {
        // Write your code below
        System.out.println("Hello World!");
    }
}`,
      python: `# Write your code below
print("Hello World!")
`,
      javascript: `// Write your code below
console.log("Hello World!");
`
    },
    testCases: [
      { id: 1, input: "", expected: "Hello World!" }
    ],
    validationFn: (code, lang) => {
      const clean = code.replace(/\s+/g, '');
      if (lang === 'cpp') {
        if (!code.includes('cout')) return { success: false, error: "Syntax Error: C++ uses 'cout <<' to direct outputs. Did you miss 'cout'?" };
        if (!code.includes('<<')) return { success: false, error: "Syntax Error: Did you forget the '<<' insertion operator after 'cout'?" };
        if (!code.includes(';')) return { success: false, error: "Compilation Error: Semicolon ';' expected at the end of the statement." };
        if (!code.includes('"Hello World!"') && !code.includes("'Hello World!'")) return { success: false, error: "Output Error: Make sure your text matches 'Hello World!' exactly." };
      } else if (lang === 'java') {
        if (!code.includes('System.out.print')) return { success: false, error: "Syntax Error: Java uses 'System.out.println()' to print. Did you miss it?" };
        if (!code.includes(';')) return { success: false, error: "Compilation Error: Semicolon ';' expected at the end of the statement." };
        if (!code.includes('"Hello World!"')) return { success: false, error: "Output Error: Make sure your text matches 'Hello World!' inside double quotes." };
      } else if (lang === 'python') {
        if (!code.includes('print(')) return { success: false, error: "Syntax Error: Python uses the print() function. Did you misspell or miss parentheses?" };
        if (!code.includes('Hello World!')) return { success: false, error: "Output Error: Make sure your text matches 'Hello World!' inside print()." };
      } else if (lang === 'javascript') {
        if (!code.includes('console.log')) return { success: false, error: "Syntax Error: JavaScript uses 'console.log()' to output to console. Did you miss it?" };
        if (!code.includes('Hello World!')) return { success: false, error: "Output Error: Make sure your text matches 'Hello World!' exactly." };
      }
      return { success: true, output: "Hello World!" };
    },
    hints: [
      "Ensure spelling and punctuation matches 'Hello World!' exactly.",
      "Check your parentheses () or stream operators << depending on the language.",
      "For C++ and Java, don't forget the terminating semicolon (;)!"
    ]
  },
  {
    id: 2,
    title: "Print Multiple Lines",
    difficulty: "Rookie",
    xpReward: 15,
    learningObjective: "Let's stack lines! Learn how to shift printing output to the next line using newline characters.",
    problemStatement: `Print the word "Hello" on the first line and "World" on the second line.

To transition to a new line:
- **C++**: Use the \`endl\` stream manipulator or the newline character \`"\\n"\`.
- **Java**: Use \`System.out.println()\` (which appends a newline automatically).
- **Python**: Multiple \`print()\` statements automatically output on separate lines.
- **JavaScript**: Multiple \`console.log()\` statements output on separate lines, or use \`"\\n"\`.`,
    constraints: "Must output exactly two lines.",
    examples: [
      {
        input: "None",
        output: "Hello\nWorld"
      }
    ],
    starterCodes: {
      cpp: `#include <iostream>
using namespace std;

int main() {
    // Write your code below
    cout << "Hello" << endl;
    cout << "World";
    
    return 0;
}`,
      java: `public class Main {
    public static void main(String[] args) {
        // Write your code below
        System.out.println("Hello");
        System.out.println("World");
    }
}`,
      python: `# Write your code below
print("Hello")
print("World")
`,
      javascript: `// Write your code below
console.log("Hello");
console.log("World");
`
    },
    testCases: [
      { id: 1, input: "", expected: "Hello\nWorld" }
    ],
    validationFn: (code, lang) => {
      const clean = code.replace(/\s+/g, '');
      if (lang === 'cpp') {
        if (!code.includes('endl') && !code.includes('\\n')) return { success: false, error: "Syntax Error: To transition to the next line, you must output 'endl' or '\\n'." };
        if (!code.includes('Hello') || !code.includes('World')) return { success: false, error: "Structure Error: Ensure 'Hello' and 'World' are printed in sequence." };
      } else if (lang === 'java') {
        if (!code.includes('println')) return { success: false, error: "Syntax Error: Use 'println' instead of 'print' to automatically add a new line after Hello." };
      } else if (lang === 'python') {
        const occurrences = (code.match(/print/g) || []).length;
        if (occurrences < 2 && !code.includes('\\n')) return { success: false, error: "Logic Error: Use two print statements, or a newline character '\\n' to separate lines." };
      } else if (lang === 'javascript') {
        const occurrences = (code.match(/console.log/g) || []).length;
        if (occurrences < 2 && !code.includes('\\n')) return { success: false, error: "Logic Error: Use multiple console.log calls or newline '\\n'." };
      }
      return { success: true, output: "Hello\nWorld" };
    },
    hints: [
      "For C++, you can stack output: cout << \"Hello\" << endl << \"World\";",
      "For Java & Python, calling the printing statement twice automatically inserts a newline.",
      "Check your capitalization. 'Hello' and 'World' must have capital H and W."
    ]
  },
  {
    id: 3,
    title: "Understanding Variables",
    difficulty: "Explorer",
    xpReward: 20,
    learningObjective: "Learn about memory boxes! Declare a variable to store and print a specific age.",
    problemStatement: `Declare an integer variable named "age", store the value "20" inside it, and print it to the console.

Variables store information that your code can use later.
- In statically typed languages like **C++** and **Java**, you must state the data type (like \`int\` for integers):
  \`int age = 20;\`
- In dynamically typed languages like **Python** and **JavaScript**, you don't declare the exact type:
  - **Python**: \`age = 20\`
  - **JavaScript**: \`let age = 20;\``,
    constraints: "Variable name must be exactly 'age' and initialized to 20.",
    examples: [
      {
        input: "None",
        output: "20"
      }
    ],
    starterCodes: {
      cpp: `#include <iostream>
using namespace std;

int main() {
    // Write your code below
    int age = 20;
    cout << age;
    
    return 0;
}`,
      java: `public class Main {
    public static void main(String[] args) {
        // Write your code below
        int age = 20;
        System.out.println(age);
    }
}`,
      python: `# Write your code below
age = 20
print(age)
`,
      javascript: `// Write your code below
let age = 20;
console.log(age);
`
    },
    testCases: [
      { id: 1, input: "", expected: "20" }
    ],
    validationFn: (code, lang) => {
      const clean = code.replace(/\s+/g, '');
      if (lang === 'cpp' || lang === 'java') {
        if (!clean.includes('intage=20') && !clean.includes('intage;age=20')) return { success: false, error: "Declaration Error: Declare 'int age = 20;' exactly." };
        if (clean.includes('"age"') || clean.includes("'age'")) return { success: false, error: "Output Error: Print the variable 'age' directly without quotes, otherwise it prints the word 'age' instead of its value." };
        if (!clean.includes('age')) return { success: false, error: "Syntax Error: Did you print the 'age' variable?" };
      } else if (lang === 'python') {
        if (!clean.includes('age=20')) return { success: false, error: "Variable Error: Declare 'age = 20' exactly." };
        if (clean.includes('"age"') || clean.includes("'age'")) return { success: false, error: "Output Error: Do not wrap the variable name in quotes in your print function." };
      } else if (lang === 'javascript') {
        if (!clean.includes('age=20')) return { success: false, error: "Variable Error: Declare and assign 'age = 20' using let or const." };
        if (clean.includes('"age"') || clean.includes("'age'")) return { success: false, error: "Output Error: Print the variable directly without quotes." };
      }
      return { success: true, output: "20" };
    },
    hints: [
      "To print a variable, do NOT wrap its name in quotation marks. Write cout << age; or print(age).",
      "Ensure you assign the value 20 with the '=' operator.",
      "Check your semicolon placements in C++, Java, and JavaScript."
    ]
  },
  {
    id: 4,
    title: "Input/Output Expedition",
    difficulty: "Explorer",
    xpReward: 25,
    learningObjective: "Teach your program to listen! Learn how to capture console input into a variable.",
    problemStatement: `Declare an integer variable named "userCode". Read an input value from the console into "userCode", and print "Code is: " followed by that number.

In code, we often process user input:
- **C++**: Use \`cin >> userCode;\` (arrows point right for input!)
- **Java**: Use a Scanner, e.g. \`Scanner sc = new Scanner(System.in); int userCode = sc.nextInt();\`
- **Python**: Use \`userCode = int(input())\`
- **JavaScript**: Use a mock prompt or reader, e.g. \`let userCode = Number(readline());\``,
    constraints: "Output must match the input dynamically.",
    examples: [
      {
        input: "42",
        output: "Code is: 42"
      },
      {
        input: "100",
        output: "Code is: 100"
      }
    ],
    starterCodes: {
      cpp: `#include <iostream>
using namespace std;

int main() {
    int userCode;
    // Write your code below to read from 'cin'
    cin >> userCode;
    cout << "Code is: " << userCode;
    
    return 0;
}`,
      java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // Write your code below to read next integer
        int userCode = scanner.nextInt();
        System.out.println("Code is: " + userCode);
    }
}`,
      python: `# Write your code below to read input
userCode = int(input())
print("Code is:", userCode)
`,
      javascript: `// Write your code below (uses a global readline() function for tests)
let userCode = Number(readline());
console.log("Code is: " + userCode);
`
    },
    testCases: [
      { id: 1, input: "42", expected: "Code is: 42" },
      { id: 2, input: "100", expected: "Code is: 100" }
    ],
    validationFn: (code, lang, inputVal) => {
      const clean = code.replace(/\s+/g, '');
      const numInput = inputVal || "42";
      if (lang === 'cpp') {
        if (!clean.includes('cin>>userCode')) return { success: false, error: "Input Error: Use 'cin >> userCode;' to read the console input." };
        if (!clean.includes('Codeis:')) return { success: false, error: "Output Error: Make sure you print 'Code is: ' before the variable." };
      } else if (lang === 'java') {
        if (!code.includes('scanner.next') && !code.includes('sc.next')) return { success: false, error: "Input Error: Use the scanner object to read the integer." };
      } else if (lang === 'python') {
        if (!code.includes('input(')) return { success: false, error: "Input Error: Use the input() function to read inputs in Python." };
      } else if (lang === 'javascript') {
        if (!code.includes('readline')) return { success: false, error: "Input Error: Use the readline() function to capture inputs in JavaScript." };
      }
      return { success: true, output: `Code is: ${numInput}` };
    },
    hints: [
      "In C++, cin arrows point right (>>), while cout arrows point left (<<).",
      "Make sure there is a space after 'Code is:' inside the double quotes.",
      "Convert inputs to numbers where appropriate (like in Python or JS)."
    ]
  },
  {
    id: 5,
    title: "Making Choices (If Else)",
    difficulty: "Builder",
    xpReward: 30,
    learningObjective: "Help your code make decisions! Write an 'if/else' block to check if a user is eligible to vote.",
    problemStatement: `Declare an integer variable named "age" set to "19". 

If "age" is greater than or equal to 18, print "Can Vote". Otherwise, print "Cannot Vote".

Decision structures allow programs to run different blocks of code depending on conditions:
\`\`\`
if (condition) {
    // runs if true
} else {
    // runs if false
}
\`\`\``,
    constraints: "Output must match 'Can Vote' exactly for age 19.",
    examples: [
      {
        input: "None",
        output: "Can Vote"
      }
    ],
    starterCodes: {
      cpp: `#include <iostream>
using namespace std;

int main() {
    // Write your code below
    int age = 19;
    if (age >= 18) {
        cout << "Can Vote";
    } else {
        cout << "Cannot Vote";
    }
    
    return 0;
}`,
      java: `public class Main {
    public static void main(String[] args) {
        // Write your code below
        int age = 19;
        if (age >= 18) {
            System.out.println("Can Vote");
        } else {
            System.out.println("Cannot Vote");
        }
    }
}`,
      python: `# Write your code below
age = 19
if age >= 18:
    print("Can Vote")
else:
    print("Cannot Vote")
`,
      javascript: `// Write your code below
let age = 19;
if (age >= 18) {
    console.log("Can Vote");
} else {
    console.log("Cannot Vote");
}
`
    },
    testCases: [
      { id: 1, input: "", expected: "Can Vote" }
    ],
    validationFn: (code, lang) => {
      const clean = code.replace(/\s+/g, '');
      if (!clean.includes('age=19')) return { success: false, error: "Variable Error: Set 'age' to 19 first." };
      if (!code.includes('if') || !code.includes('else')) return { success: false, error: "Logic Error: You must include both 'if' and 'else' branches." };
      if (!code.includes('Can Vote') || !code.includes('Cannot Vote')) return { success: false, error: "Value Error: Double check spelling and capitalization for 'Can Vote' and 'Cannot Vote'." };
      return { success: true, output: "Can Vote" };
    },
    hints: [
      "Be careful: '>=' is the operator for 'greater than or equal to'.",
      "In Python, don't forget the colons (:) and proper indentations.",
      "Check your brace alignments in C++, Java, and JavaScript."
    ]
  },
  {
    id: 6,
    title: "Repeating Work (Loops)",
    difficulty: "Coder",
    xpReward: 35,
    learningObjective: "Harness repetition power! Write a 'for' loop to repeat code statements a specific number of times.",
    problemStatement: `Write a 'for' loop that counts from 1 to 3, printing each number followed by a single space.

Loops repeat commands automatically so you don't have to copy-paste.
- **C++ / Java / JS**:
  \`for (int i = 1; i <= 3; i++) { ... }\`
- **Python**:
  \`for i in range(1, 4):\` (Python ranges exclude the end number, so 1 to 4 counts 1, 2, 3)`,
    constraints: "Output must be exactly '1 2 3 ' with a trailing space.",
    examples: [
      {
        input: "None",
        output: "1 2 3 "
      }
    ],
    starterCodes: {
      cpp: `#include <iostream>
using namespace std;

int main() {
    // Write your code below
    for (int i = 1; i <= 3; i++) {
        cout << i << " ";
    }
    
    return 0;
}`,
      java: `public class Main {
    public static void main(String[] args) {
        // Write your code below
        for (int i = 1; i <= 3; i++) {
            System.out.print(i + " ");
        }
    }
}`,
      python: `# Write your code below
for i in range(1, 4):
    print(i, end=" ")
`,
      javascript: `// Write your code below
for (let i = 1; i <= 3; i++) {
    process.stdout.write(i + " ");
}
`
    },
    testCases: [
      { id: 1, input: "", expected: "1 2 3 " }
    ],
    validationFn: (code, lang) => {
      const clean = code.replace(/\s+/g, '');
      if (lang === 'python') {
        if (!code.includes('range(1, 4)') && !code.includes('range(1,4)')) {
          if (code.includes('range(1, 3)') || code.includes('range(1,3)')) {
            return { success: false, error: "Range Error: range(1, 3) only goes from 1 to 2! Use range(1, 4) to include 3." };
          }
        }
        if (!code.includes('end=')) return { success: false, error: "Syntax Hint: In Python, use print(i, end=' ') to print numbers on the same line with a space." };
      } else {
        if (!code.includes('i <= 3') && !code.includes('i < 4') && !clean.includes('i<=3')) return { success: false, error: "Loop Error: Make sure your loop continues while 'i <= 3' or 'i < 4'." };
      }
      return { success: true, output: "1 2 3 " };
    },
    hints: [
      "Verify the loop starts at 1, not 0.",
      "Check the terminating condition: it should include the number 3.",
      "Ensure you append a space character ' ' after each number."
    ]
  },
  {
    id: 7,
    title: "Mastering Patterns",
    difficulty: "Architect",
    xpReward: 50,
    learningObjective: "The final trial! Use nested loops (a loop inside a loop) to print a stair pattern of stars.",
    problemStatement: `Using nested loops, print a two-line star staircase pattern:
\`\`\`
*
**
\`\`\`

The outer loop should run 2 times. The inner loop should print stars based on the current row count!`,
    constraints: "Output must match the star pattern exactly with a newline.",
    examples: [
      {
        input: "None",
        output: "*\n**"
      }
    ],
    starterCodes: {
      cpp: `#include <iostream>
using namespace std;

int main() {
    // Write your code below
    for (int r = 1; r <= 2; r++) {
        for (int c = 1; c <= r; c++) {
            cout << "*";
        }
        cout << endl;
    }
    
    return 0;
}`,
      java: `public class Main {
    public static void main(String[] args) {
        // Write your code below
        for (int r = 1; r <= 2; r++) {
            for (int c = 1; c <= r; c++) {
                System.out.print("*");
            }
            System.out.println();
        }
    }
}`,
      python: `# Write your code below
for r in range(1, 3):
    for c in range(1, r + 1):
        print("*", end="")
    print()
`,
      javascript: `// Write your code below
for (let r = 1; r <= 2; r++) {
    let rowStr = "";
    for (let c = 1; c <= r; c++) {
        rowStr += "*";
    }
    console.log(rowStr);
}
`
    },
    testCases: [
      { id: 1, input: "", expected: "*\n**" }
    ],
    validationFn: (code, lang) => {
      if (!code.includes('for')) return { success: false, error: "Structure Error: You must use loops to construct this pattern dynamically." };
      if (!code.includes('*')) return { success: false, error: "Output Error: Make sure your print outputs star characters '*'." };
      return { success: true, output: "*\n**" };
    },
    hints: [
      "Use an outer loop to track rows: r from 1 to 2.",
      "Use an inner loop to print stars: c from 1 to r.",
      "Add a newline after the inner loop finishes to start the next row."
    ]
  }
];
