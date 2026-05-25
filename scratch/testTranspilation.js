const fs = require('fs');
const path = require('path');

// Mock of transpileToJS from TopicDetail.jsx
const transpileToJS = (code, language) => {
  let js = code;
  const lang = (language || 'cpp').toLowerCase();
  
  if (lang === 'javascript' || lang === 'js') {
    return js;
  }

  if (lang === 'python') {
    js = js.replace(/#\s*(.*)$/gm, '// $1');
    js = js.replace(/\bpass\b/g, '');
    js = js.replace(/import\s+\w+/g, '');
    js = js.replace(/from\s+\w+\s+import\s+\w+/g, '');
    js = js.replace(/class\s+(\w+):/g, 'class $1 {');
    js = js.replace(/\bif\s+(.+?):/g, 'if ($1):');
    js = js.replace(/\belif\s+(.+?):/g, 'elif ($1):');
    js = js.replace(/\bwhile\s+(.+?):/g, 'while ($1):');
    
    js = js.replace(/^(\s*)def\s+(\w+)\(([^)]*)\)\s*(->\s*[\w[\]]+)?:/gm, (match, indent, name, params) => {
      const cleanParams = params.split(',').map(p => {
        const parts = p.split(':');
        return parts[0].replace('self', '').trim();
      }).filter(Boolean).join(', ');
      
      const isStandalone = indent.length === 0;
      if (name === '__init__') {
        return `${indent}constructor(${cleanParams}) {`;
      }
      return isStandalone ? `${indent}function ${name}(${cleanParams}) {` : `${indent}${name}(${cleanParams}) {`;
    });

    js = js.replace(/\bself\./g, 'this.');
    js = js.replace(/\bTrue\b/g, 'true');
    js = js.replace(/\bFalse\b/g, 'false');
    js = js.replace(/\bNone\b/g, 'null');
    js = js.replace(/\band\b/g, '&&');
    js = js.replace(/\bor\b/g, '||');
    js = js.replace(/\bnot\b/g, '!');
    js = js.replace(/\belif\b/g, 'else if');

    const lines = js.split('\n');
    let output = [];
    let indentStack = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) {
        output.push(line);
        continue;
      }
      
      const match = line.match(/^(\s*)/);
      const indent = match ? match[1].length : 0;
      
      while (indentStack.length > 0 && indent < indentStack[indentStack.length - 1]) {
        indentStack.pop();
        output.push(' '.repeat(indentStack.length) + '}');
      }
      
      output.push(line);
      
      if (line.trim().endsWith('{') || line.trim().endsWith('(') || line.trim().endsWith(':')) {
        if (output[output.length - 1].trim().endsWith(':')) {
          output[output.length - 1] = output[output.length - 1].replace(/:$/, ' {');
        }
        indentStack.push(indent + 4);
      }
    }
    
    while (indentStack.length > 0) {
      indentStack.pop();
      output.push(' '.repeat(indentStack.length) + '}');
    }
    
    js = output.join('\n');
    js = js.replace(/(\w+)\s*\/\/\s*(\w+)/g, 'Math.floor($1 / $2)');
    js = js.replace(/(\w+)\s*\/\/=\s*(\w+)/g, '$1 = Math.floor($1 / $2)');

    if (js.includes('class Solution')) {
      js = js.replace(/class\s+Solution\s*\{/, '');
      const lastBraceIdx = js.lastIndexOf('}');
      if (lastBraceIdx !== -1) {
        js = js.slice(0, lastBraceIdx) + js.slice(lastBraceIdx + 1);
      }
    }
  }

  if (lang === 'cpp' || lang === 'java') {
    if (js.includes('class Solution')) {
      js = js.replace(/(?:public\s+)?class\s+Solution\s*\{/, '');
      const lastBraceIdx = js.lastIndexOf('}');
      if (lastBraceIdx !== -1) {
        js = js.slice(0, lastBraceIdx) + js.slice(lastBraceIdx + 1);
      }
    }

    js = js.replace(/#include\s+[<"][\w\/\.\+]+[>"]/g, '');
    js = js.replace(/import\s+java\..*;/g, '');
    js = js.replace(/package\s+[\w\.]+;/g, '');
    js = js.replace(/using\s+namespace\s+\w+;/g, '');
    js = js.replace(/\bstd::/g, '');
    js = js.replace(/(?:public\s+)?class\s+\w+\s*\{/g, '');
    js = js.replace(/public\s+static\s+/g, '');
    js = js.replace(/private\s+/g, '');
    js = js.replace(/\b(public|private|protected)\s*:/g, '');
    
    js = js.replace(/\b(vector<int>&|vector<string>&|vector<double>&|vector<int>|vector<string>|vector<double>|TreeNode\*|ListNode\*|int\*|char\*|double\*|int\[\]|string\[\]|double\[\]|float\[\]|const)(?:\b)?/g, '');
    js = js.replace(/\b(int|bool|double|void|float|long|long\s+long|string|char|TreeNode|ListNode)\b/g, '');
    js = js.replace(/([,\(]\s*)[&*]/g, '$1');
    js = js.replace(/->/g, '.');
    js = js.replace(/\bnullptr\b/g, 'null');
    
    js = js.replace(/\bpush_back\b/g, 'push');
    js = js.replace(/\bback\b\(\)/g, 'back');
    js = js.replace(/\bpop_back\b\(\)/g, 'pop()');
    js = js.replace(/\bsize\b\(\)/g, 'length');
    js = js.replace(/\bempty\b\(\)/g, 'length === 0');

    js = js.replace(/^(\s*)([a-zA-Z_]\w*)\s*\(([^)]*)\)\s*\{/gm, (match, indent, name, params) => {
      const reserved = ['if', 'for', 'while', 'switch', 'catch', 'else', 'return'];
      if (reserved.includes(name)) {
        return match;
      }
      return `${indent}function ${name}(${params}) {`;
    });
  }

  return js;
};

// Polyfills
const polyfills = `
  class TreeNode {
    constructor(val, left = null, right = null) {
      this.val = val;
      this.left = left;
      this.right = right;
    }
  }
  class ListNode {
    constructor(val, next = null) {
      this.val = val;
      this.next = next;
    }
  }
  Array.prototype.back = function() { return this[this.length - 1]; };
  Array.prototype.empty = function() { return this.length === 0; };
  Array.prototype.push_back = function(x) { this.push(x); };
  Array.prototype.pop_back = function() { return this.pop(); };
`;

// Test runner function
const runTest = (boilerplate, lang, input, expected, fnName) => {
  const transpiled = transpileToJS(boilerplate, lang);
  const getCallExpr = `return String(${fnName}(${input}));`;
  const runnerBody = polyfills + '\n' + transpiled + '\n' + getCallExpr;

  try {
    const evalFn = new Function(runnerBody);
    const result = evalFn();
    console.log(`[${lang}] Transpilation: OK | Input: ${input} | Got: ${result} | Expected: ${expected}`);
  } catch (err) {
    console.error(`[${lang}] Error running transpiled code:`, err.message);
    console.log('Transpiled code was:\n', transpiled);
  }
};

// Load recursion content
const recursionContentText = fs.readFileSync(path.join(__dirname, '..', 'client', 'src', 'utils', 'recursionContent.js'), 'utf8');
const getRecursionCheckpointContent = (checkpointId, lang = 'cpp') => {
  const startStr = 'const checkpoints = ';
  const startIdx = recursionContentText.indexOf(startStr);
  if (startIdx === -1) throw new Error("Could not find checkpoints start");
  const jsonStart = startIdx + startStr.length;
  const endIdx = recursionContentText.indexOf(';\n  const cp = ', jsonStart);
  if (endIdx === -1) throw new Error("Could not find checkpoints end");
  const checkpointsJson = recursionContentText.slice(jsonStart, endIdx);
  const checkpoints = JSON.parse(checkpointsJson);
  const cp = checkpoints[checkpointId] || checkpoints['rec_cp1'];
  return {
    title: cp.title,
    subtitle: cp.subtitle || '',
    videoEmbedUrl: cp.videoEmbedUrl,
    assessmentType: cp.assessmentType,
    visualizationData: cp.visualizationData,
    challengeTitle: cp.challenge.title,
    challengeDescription: cp.challenge.description,
    approach: cp.challenge.approach || '',
    code: cp.challenge.solution || '',
    editorBoilerplate: cp.challenge.boilerplates[lang] || cp.challenge.boilerplates['cpp'] || '',
    testCases: cp.challenge.testCases,
    functionName: cp.challenge.functionName || 'solve',
    hints: cp.challenge.hints,
    constraints: cp.challenge.constraints || 'None',
    hasVideo: true
  };
};

const langs = ['cpp', 'java', 'python', 'javascript'];
const checkpoint = 'rec_cp1';

const correctSolutions = {
  cpp: `#include <iostream>
#include <vector>
using namespace std;

int solve(int n) {
    if (n <= 1) return 1;
    return n * solve(n - 1);
}`,
  java: `import java.util.*;

public class Solution {
    public static int solve(int n) {
        if (n <= 1) return 1;
        return n * solve(n - 1);
    }
}`,
  python: `def solve(n: int) -> int:
    if n <= 1:
        return 1
    return n * solve(n - 1)`,
  javascript: `function solve(n) {
    if (n <= 1) return 1;
    return n * solve(n - 1);
}`
};

console.log('Testing recursion checkpoint:', checkpoint);

langs.forEach(lang => {
  const content = getRecursionCheckpointContent(checkpoint, lang);
  const boilerplate = content.editorBoilerplate;
  const correctSol = correctSolutions[lang];
  const testCase = content.testCases[0];
  const fnName = content.functionName || 'solve';
  
  console.log(`\n--- Running boilerplate test for ${lang.toUpperCase()} ---`);
  runTest(boilerplate, lang, testCase.input, testCase.expected, fnName);

  console.log(`--- Running correct solution test for ${lang.toUpperCase()} ---`);
  runTest(correctSol, lang, testCase.input, testCase.expected, fnName);
});
