// Language-adapted DSA content helper
// Provides language-adaptive videos, Hinglish/beginner-friendly explanations, optimal code solutions, 
// notes, practice recommendations, and interactive coding playground boilerplates with validation tests.

export const getDsaLanguageContent = (topicTitle, languageKey = 'cpp', useStriverAdvanced = false) => {
  const normalizedTitle = (topicTitle || '').toLowerCase();
  const lang = (languageKey || 'cpp').toLowerCase();

  const langNames = {
    cpp: 'C++',
    java: 'Java',
    python: 'Python',
    js: 'JavaScript'
  };

  const currentLangName = langNames[lang] || 'C++';

  // 1. SELECT LANGUAGE-SPECIFIC AND ROADMAP-ADAPTED YOUTUBE VIDEO
  let youtubeVideoId = 'EAR7De6Goz4'; // Default fallback
  
  if (useStriverAdvanced && (lang === 'cpp' || lang === 'java')) {
    // Striver Advanced Mode
    if (normalizedTitle.includes('basics') || normalizedTitle.includes('foundation')) youtubeVideoId = 'EAR7De6Goz4';
    else if (normalizedTitle.includes('pattern') || normalizedTitle.includes('thinking')) youtubeVideoId = 'tNm_NNSB3_w';
    else if (normalizedTitle.includes('stl') || normalizedTitle.includes('collections')) youtubeVideoId = 'RRVYpIET_RU';
    else if (normalizedTitle.includes('math')) youtubeVideoId = '1xNbjMdrlGY';
    else if (normalizedTitle.includes('easy array')) youtubeVideoId = '37E9ckMDdTk';
    else if (normalizedTitle.includes('medium array')) youtubeVideoId = 'tp8JIuCXBaU';
    else if (normalizedTitle.includes('hard array')) youtubeVideoId = '9S_p4M7h9Dk';
    else if (normalizedTitle.includes('hashing basics')) youtubeVideoId = 'KEs5UyBJ39g';
    else if (normalizedTitle.includes('hashing hunter') || normalizedTitle.includes('collision')) youtubeVideoId = 'KEs5UyBJ39g';
    else if (normalizedTitle.includes('recursion basics')) youtubeVideoId = 'un6PybaEisA';
    else if (normalizedTitle.includes('subsequence')) youtubeVideoId = 'AxNNVECce8c';
    else if (normalizedTitle.includes('backtracking')) youtubeVideoId = 'nwjZ24S_ueM';
    else if (normalizedTitle.includes('linked list') || normalizedTitle.includes('introduction to ll')) youtubeVideoId = 'q8gipE-hy80';
    else if (normalizedTitle.includes('ll warrior') || normalizedTitle.includes('reverse ll')) youtubeVideoId = 'D2vI2NwJgdU';
    else if (normalizedTitle.includes('stack & queue implementation')) youtubeVideoId = 'gyPa_m8fW-w';
    else if (normalizedTitle.includes('monotonic stack')) youtubeVideoId = '7PrS72_jwAY';
    else if (normalizedTitle.includes('tree traversal') || normalizedTitle.includes('binary tree')) youtubeVideoId = 'l_7V5uYI2G0';
    else if (normalizedTitle.includes('tree master') || normalizedTitle.includes('properties')) youtubeVideoId = 'fAfR_MstP00';
    else if (normalizedTitle.includes('graph introduction')) youtubeVideoId = 'M3_pLsDdeuU';
    else if (normalizedTitle.includes('topo') || normalizedTitle.includes('dsu')) youtubeVideoId = 'V63W7p_p4uE';
    else if (normalizedTitle.includes('shortest path')) youtubeVideoId = 'XpkfK_Mh6vA';
    else if (normalizedTitle.includes('introduction to dp')) youtubeVideoId = 'tyB0ztf0DNY';
    else if (normalizedTitle.includes('grids') || normalizedTitle.includes('subsequences') || normalizedTitle.includes('knapsack')) youtubeVideoId = '7cELW7O_E9k';
    else if (normalizedTitle.includes('strings') || normalizedTitle.includes('stocks') || normalizedTitle.includes('lcs')) youtubeVideoId = 'NPZn9jBrX8U';
    else if (normalizedTitle.includes('greedy')) youtubeVideoId = 'n59vC9nJreU';
    else if (normalizedTitle.includes('bit manipulation')) youtubeVideoId = '5rtVTYAk9KQ';
    else if (normalizedTitle.includes('heap')) youtubeVideoId = 'HqPJF2L5h9U';
    else if (normalizedTitle.includes('trie')) youtubeVideoId = 'dBGUmUQhjaM';
  } else {
    // Standard Roadmap
    if (lang === 'cpp') {
      // Love Babbar C++ DSA Playlist
      if (normalizedTitle.includes('basics') || normalizedTitle.includes('foundation')) youtubeVideoId = 'WQoB2z67hvY';
      else if (normalizedTitle.includes('pattern') || normalizedTitle.includes('thinking')) youtubeVideoId = 'dr-p8DxM8vs';
      else if (normalizedTitle.includes('stl') || normalizedTitle.includes('collections')) youtubeVideoId = '3sLTisPfMDU';
      else if (normalizedTitle.includes('math')) youtubeVideoId = 'sEZf4G6UcoY';
      else if (normalizedTitle.includes('easy array')) youtubeVideoId = 'oBt53YbR9K0';
      else if (normalizedTitle.includes('medium array')) youtubeVideoId = 'y3Z-T9wK2bQ';
      else if (normalizedTitle.includes('hard array')) youtubeVideoId = '9S_p4M7h9Dk';
      else if (normalizedTitle.includes('hashing basics')) youtubeVideoId = '7m1l58FyiQA';
      else if (normalizedTitle.includes('hashing hunter') || normalizedTitle.includes('collision')) youtubeVideoId = '7m1l58FyiQA';
      else if (normalizedTitle.includes('recursion basics')) youtubeVideoId = '5_6qaqcoUX4';
      else if (normalizedTitle.includes('subsequence')) youtubeVideoId = '3_1sNirZ7n4';
      else if (normalizedTitle.includes('backtracking')) youtubeVideoId = 'nwjZ24S_ueM';
      else if (normalizedTitle.includes('linked list') || normalizedTitle.includes('introduction to ll')) youtubeVideoId = 'vqS1nvKxyTM';
      else if (normalizedTitle.includes('ll warrior') || normalizedTitle.includes('reverse ll')) youtubeVideoId = 'vqS1nvKxyTM';
      else if (normalizedTitle.includes('stack & queue implementation')) youtubeVideoId = 'vqS1nvKxyTM';
      else if (normalizedTitle.includes('monotonic stack')) youtubeVideoId = 'vqS1nvKxyTM';
      else if (normalizedTitle.includes('tree traversal') || normalizedTitle.includes('binary tree')) youtubeVideoId = '5_6qaqcoUX4';
      else if (normalizedTitle.includes('tree master') || normalizedTitle.includes('properties')) youtubeVideoId = '5_6qaqcoUX4';
      else if (normalizedTitle.includes('graph introduction')) youtubeVideoId = 'EaK6F_2E0d4';
      else if (normalizedTitle.includes('topo') || normalizedTitle.includes('dsu')) youtubeVideoId = 'EaK6F_2E0d4';
      else if (normalizedTitle.includes('shortest path')) youtubeVideoId = 'EaK6F_2E0d4';
      else if (normalizedTitle.includes('introduction to dp')) youtubeVideoId = 'vqS1nvKxyTM';
      else if (normalizedTitle.includes('grids') || normalizedTitle.includes('subsequences') || normalizedTitle.includes('knapsack')) youtubeVideoId = 'vqS1nvKxyTM';
      else if (normalizedTitle.includes('strings') || normalizedTitle.includes('stocks') || normalizedTitle.includes('lcs')) youtubeVideoId = 'vqS1nvKxyTM';
      else if (normalizedTitle.includes('greedy')) youtubeVideoId = 'n59vC9nJreU';
      else if (normalizedTitle.includes('bit manipulation')) youtubeVideoId = '5rtVTYAk9KQ';
      else if (normalizedTitle.includes('heap')) youtubeVideoId = 'HqPJF2L5h9U';
      else if (normalizedTitle.includes('trie')) youtubeVideoId = 'dBGUmUQhjaM';
    } else if (lang === 'java') {
      // Love Babbar Java DSA Playlist
      if (normalizedTitle.includes('basics') || normalizedTitle.includes('foundation')) youtubeVideoId = 'V_q4O9WofDL';
      else if (normalizedTitle.includes('pattern') || normalizedTitle.includes('thinking')) youtubeVideoId = 'lsOOs5J8ycw';
      else if (normalizedTitle.includes('stl') || normalizedTitle.includes('collections')) youtubeVideoId = 'oBt53YbR9K0';
      else if (normalizedTitle.includes('math')) youtubeVideoId = 'sEZf4G6UcoY';
      else if (normalizedTitle.includes('easy array')) youtubeVideoId = 'oBt53YbR9K0';
      else if (normalizedTitle.includes('medium array')) youtubeVideoId = 'tp8JIuCXBaU';
      else if (normalizedTitle.includes('hard array')) youtubeVideoId = '9S_p4M7h9Dk';
      else if (normalizedTitle.includes('hashing basics')) youtubeVideoId = '7m1l58FyiQA';
      else if (normalizedTitle.includes('hashing hunter') || normalizedTitle.includes('collision')) youtubeVideoId = '7m1l58FyiQA';
      else if (normalizedTitle.includes('recursion basics')) youtubeVideoId = '3_1sNirZ7n4';
      else if (normalizedTitle.includes('subsequence')) youtubeVideoId = '3_1sNirZ7n4';
      else if (normalizedTitle.includes('backtracking')) youtubeVideoId = 'nwjZ24S_ueM';
      else if (normalizedTitle.includes('linked list') || normalizedTitle.includes('introduction to ll')) youtubeVideoId = 'vqS1nvKxyTM';
      else if (normalizedTitle.includes('ll warrior') || normalizedTitle.includes('reverse ll')) youtubeVideoId = 'vqS1nvKxyTM';
      else if (normalizedTitle.includes('stack & queue implementation')) youtubeVideoId = 'gyPa_m8fW-w';
      else if (normalizedTitle.includes('monotonic stack')) youtubeVideoId = '7PrS72_jwAY';
      else if (normalizedTitle.includes('tree traversal') || normalizedTitle.includes('binary tree')) youtubeVideoId = 'l_7V5uYI2G0';
      else if (normalizedTitle.includes('tree master') || normalizedTitle.includes('properties')) youtubeVideoId = 'fAfR_MstP00';
      else if (normalizedTitle.includes('graph introduction')) youtubeVideoId = 'M3_pLsDdeuU';
      else if (normalizedTitle.includes('topo') || normalizedTitle.includes('dsu')) youtubeVideoId = 'V63W7p_p4uE';
      else if (normalizedTitle.includes('shortest path')) youtubeVideoId = 'XpkfK_Mh6vA';
      else if (normalizedTitle.includes('introduction to dp')) youtubeVideoId = 'tyB0ztf0DNY';
      else if (normalizedTitle.includes('grids') || normalizedTitle.includes('subsequences') || normalizedTitle.includes('knapsack')) youtubeVideoId = '7cELW7O_E9k';
      else if (normalizedTitle.includes('strings') || normalizedTitle.includes('stocks') || normalizedTitle.includes('lcs')) youtubeVideoId = 'NPZn9jBrX8U';
      else if (normalizedTitle.includes('greedy')) youtubeVideoId = 'n59vC9nJreU';
      else if (normalizedTitle.includes('bit manipulation')) youtubeVideoId = '5rtVTYAk9KQ';
      else if (normalizedTitle.includes('heap')) youtubeVideoId = 'HqPJF2L5h9U';
      else if (normalizedTitle.includes('trie')) youtubeVideoId = 'dBGUmUQhjaM';
    } else if (lang === 'python') {
      // CodeWithHarry Python + DSA
      if (normalizedTitle.includes('basics') || normalizedTitle.includes('foundation')) youtubeVideoId = 't2_Q2yftK';
      else if (normalizedTitle.includes('pattern') || normalizedTitle.includes('thinking')) youtubeVideoId = 'ZspL3eKk';
      else if (normalizedTitle.includes('stl') || normalizedTitle.includes('collections')) youtubeVideoId = 'y3Z-T9wK2bQ';
      else if (normalizedTitle.includes('math')) youtubeVideoId = 't2_Q2yftK';
      else if (normalizedTitle.includes('easy array')) youtubeVideoId = 'y3Z-T9wK2bQ';
      else if (normalizedTitle.includes('medium array')) youtubeVideoId = 'tp8JIuCXBaU';
      else if (normalizedTitle.includes('hard array')) youtubeVideoId = '9S_p4M7h9Dk';
      else if (normalizedTitle.includes('hashing basics')) youtubeVideoId = 'KEs5UyBJ39g';
      else if (normalizedTitle.includes('hashing hunter') || normalizedTitle.includes('collision')) youtubeVideoId = 'KEs5UyBJ39g';
      else if (normalizedTitle.includes('recursion basics')) youtubeVideoId = 'un6PybaEisA';
      else if (normalizedTitle.includes('subsequence')) youtubeVideoId = 'AxNNVECce8c';
      else if (normalizedTitle.includes('backtracking')) youtubeVideoId = 'nwjZ24S_ueM';
      else if (normalizedTitle.includes('linked list') || normalizedTitle.includes('introduction to ll')) youtubeVideoId = 'q8gipE-hy80';
      else if (normalizedTitle.includes('ll warrior') || normalizedTitle.includes('reverse ll')) youtubeVideoId = 'D2vI2NwJgdU';
      else if (normalizedTitle.includes('stack & queue implementation')) youtubeVideoId = 'gyPa_m8fW-w';
      else if (normalizedTitle.includes('monotonic stack')) youtubeVideoId = '7PrS72_jwAY';
      else if (normalizedTitle.includes('tree traversal') || normalizedTitle.includes('binary tree')) youtubeVideoId = 'l_7V5uYI2G0';
      else if (normalizedTitle.includes('tree master') || normalizedTitle.includes('properties')) youtubeVideoId = 'fAfR_MstP00';
      else if (normalizedTitle.includes('graph introduction')) youtubeVideoId = 'M3_pLsDdeuU';
      else if (normalizedTitle.includes('topo') || normalizedTitle.includes('dsu')) youtubeVideoId = 'V63W7p_p4uE';
      else if (normalizedTitle.includes('shortest path')) youtubeVideoId = 'XpkfK_Mh6vA';
      else if (normalizedTitle.includes('introduction to dp')) youtubeVideoId = 'tyB0ztf0DNY';
      else if (normalizedTitle.includes('grids') || normalizedTitle.includes('subsequences') || normalizedTitle.includes('knapsack')) youtubeVideoId = '7cELW7O_E9k';
      else if (normalizedTitle.includes('strings') || normalizedTitle.includes('stocks') || normalizedTitle.includes('lcs')) youtubeVideoId = 'NPZn9jBrX8U';
      else if (normalizedTitle.includes('greedy')) youtubeVideoId = 'n59vC9nJreU';
      else if (normalizedTitle.includes('bit manipulation')) youtubeVideoId = '5rtVTYAk9KQ';
      else if (normalizedTitle.includes('heap')) youtubeVideoId = 'HqPJF2L5h9U';
      else if (normalizedTitle.includes('trie')) youtubeVideoId = 'dBGUmUQhjaM';
    } else {
      // JavaScript (Striver Sheet + selected JS resources)
      if (normalizedTitle.includes('basics') || normalizedTitle.includes('foundation')) youtubeVideoId = 'EAR7De6Goz4';
      else if (normalizedTitle.includes('pattern') || normalizedTitle.includes('thinking')) youtubeVideoId = 'tNm_NNSB3_w';
      else if (normalizedTitle.includes('stl') || normalizedTitle.includes('collections')) youtubeVideoId = 'RRVYpIET_RU';
      else if (normalizedTitle.includes('math')) youtubeVideoId = '1xNbjMdrlGY';
      else if (normalizedTitle.includes('easy array')) youtubeVideoId = '37E9ckMDdTk';
      else if (normalizedTitle.includes('medium array')) youtubeVideoId = 'tp8JIuCXBaU';
      else if (normalizedTitle.includes('hard array')) youtubeVideoId = '9S_p4M7h9Dk';
      else if (normalizedTitle.includes('hashing basics')) youtubeVideoId = 'KEs5UyBJ39g';
      else if (normalizedTitle.includes('hashing hunter') || normalizedTitle.includes('collision')) youtubeVideoId = 'KEs5UyBJ39g';
      else if (normalizedTitle.includes('recursion basics')) youtubeVideoId = 'un6PybaEisA';
      else if (normalizedTitle.includes('subsequence')) youtubeVideoId = 'AxNNVECce8c';
      else if (normalizedTitle.includes('backtracking')) youtubeVideoId = 'nwjZ24S_ueM';
      else if (normalizedTitle.includes('linked list') || normalizedTitle.includes('introduction to ll')) youtubeVideoId = 'q8gipE-hy80';
      else if (normalizedTitle.includes('ll warrior') || normalizedTitle.includes('reverse ll')) youtubeVideoId = 'D2vI2NwJgdU';
      else if (normalizedTitle.includes('stack & queue implementation')) youtubeVideoId = 'gyPa_m8fW-w';
      else if (normalizedTitle.includes('monotonic stack')) youtubeVideoId = '7PrS72_jwAY';
      else if (normalizedTitle.includes('tree traversal') || normalizedTitle.includes('binary tree')) youtubeVideoId = 'l_7V5uYI2G0';
      else if (normalizedTitle.includes('tree master') || normalizedTitle.includes('properties')) youtubeVideoId = 'fAfR_MstP00';
      else if (normalizedTitle.includes('graph introduction')) youtubeVideoId = 'M3_pLsDdeuU';
      else if (normalizedTitle.includes('topo') || normalizedTitle.includes('dsu')) youtubeVideoId = 'V63W7p_p4uE';
      else if (normalizedTitle.includes('shortest path')) youtubeVideoId = 'XpkfK_Mh6vA';
      else if (normalizedTitle.includes('introduction to dp')) youtubeVideoId = 'tyB0ztf0DNY';
      else if (normalizedTitle.includes('grids') || normalizedTitle.includes('subsequences') || normalizedTitle.includes('knapsack')) youtubeVideoId = '7cELW7O_E9k';
      else if (normalizedTitle.includes('strings') || normalizedTitle.includes('stocks') || normalizedTitle.includes('lcs')) youtubeVideoId = 'NPZn9jBrX8U';
      else if (normalizedTitle.includes('greedy')) youtubeVideoId = 'n59vC9nJreU';
      else if (normalizedTitle.includes('bit manipulation')) youtubeVideoId = '5rtVTYAk9KQ';
      else if (normalizedTitle.includes('heap')) youtubeVideoId = 'HqPJF2L5h9U';
      else if (normalizedTitle.includes('trie')) youtubeVideoId = 'dBGUmUQhjaM';
    }
  }

  // DEFAULT FALLBACKS
  let approach = '';
  let code = '';
  let recommendations = '';
  let resources = [];
  let notes = '';
  let challengeDescription = '';
  let editorBoilerplate = '';
  let timeComplexity = 'O(N)';
  let spaceComplexity = 'O(1)';
  let testCases = [];
  
  // 2. BUILD THE ROADMAP CONTENT CORRESPONDING TO THE LEVEL

  // LEVEL 0: PROGRAMMING FOUNDATIONS
  if (normalizedTitle.includes('basics') || normalizedTitle.includes('foundation') || normalizedTitle.includes('math') || normalizedTitle.includes('stl') || normalizedTitle.includes('collections') || normalizedTitle.includes('thinking')) {
    
    challengeDescription = `Write a program that takes an integer 'n' as input and returns true if it is a Palindrome number (equal when read forwards or backwards), and false otherwise.\n\nInput Format:\nAn integer n.\n\nOutput Format:\ntrue or false.`;
    
    if (lang === 'cpp') {
      editorBoilerplate = `// Write your C++ Palindrome Solution here
#include <iostream>
using namespace std;

bool isPalindrome(int n) {
    if (n < 0) return false;
    int temp = n;
    long long rev = 0;
    while (temp > 0) {
        rev = rev * 10 + (temp % 10);
        temp /= 10;
    }
    return rev == n;
}`;
      approach = `Pehle number ko preserve karne ke liye temp variable me store karein. Fir ek while loop chalayein jab tak temp > 0 ho. Loop ke andar last digit extract karein (temp % 10) aur use reverse integer 'rev' me add karte rahein (rev * 10 + lastDigit). Finally check karein agar 'rev' and original 'n' same hain!`;
      code = `// C++ Fast I/O and Standard Template
#include <iostream>
using namespace std;

int main() {
    // Fast I/O setup
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    int n;
    if (cin >> n) {
        cout << "Number: " << n << "\\n";
    }
    return 0;
}`;
      recommendations = "Master fast I/O using `ios_base::sync_with_stdio(false); cin.tie(NULL);`. Avoid `endl` in loops as it forces a flush; use `\\n` instead.";
      resources = [
        { name: "Love Babbar: Basics & Flowcharts", url: "https://www.youtube.com/watch?v=WQoB2z67hvY" },
        { name: "GeeksforGeeks: Fast I/O in C++", url: "https://www.geeksforgeeks.org/fast-io-in-c/" }
      ];
      notes = "C++ is exceptionally fast, but standard streams `cin`/`cout` can be slow unless synced is disabled. Always use pre-increment (`++i`) instead of post-increment (`i++`) when possible for minor performance bumps.";
    } else if (lang === 'java') {
      editorBoilerplate = `// Write your Java Palindrome Solution here
public class Solution {
    public static boolean isPalindrome(int n) {
        if (n < 0) return false;
        int temp = n;
        int rev = 0;
        while (temp > 0) {
            rev = rev * 10 + (temp % 10);
            temp /= 10;
        }
        return rev == n;
    }
}`;
      approach = `Java me integer range overflow se bachne ke liye standard check lagayein. Ek variable 'temp' me input store karke, modulus (%) operator ki help se one by one last digit nikalein aur ek 'rev' variable me append karein. Loop end hone par verify karein.`;
      code = `// Java Fast I/O Template
import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        
        int n = Integer.parseInt(st.nextToken());
        System.out.println("Number: " + n);
    }
}`;
      recommendations = "Use `BufferedReader` and `StringTokenizer` instead of `Scanner` for much faster input reading in competitive environments.";
      resources = [
        { name: "Love Babbar: Java Variables & Inputs", url: "https://www.youtube.com/watch?v=V_q4O9WofDL" },
        { name: "GeeksforGeeks: Java Collections Guide", url: "https://www.geeksforgeeks.org/collections-in-java/" }
      ];
      notes = "Keep garbage collection in mind. Avoid creating excessive short-lived objects inside hot loops. Use primitive types (`int`, `long`) instead of wrapper objects (`Integer`, `Long`) to save memory overhead.";
    } else if (lang === 'python') {
      editorBoilerplate = `# Write your Python Palindrome Solution here
def isPalindrome(n: int) -> bool:
    if n < 0:
        return False
    temp = n
    rev = 0
    while temp > 0:
        rev = rev * 10 + (temp % 10)
        temp //= 10
    return rev == n`;
      approach = `Python me division standard float output deta hai, isliye integer floor division '//' operator ka use karein. Modulo (%) se remainder extract karke digits ko multiply aur add karke sum nikalein aur compare karein.`;
      code = `# Python Fast I/O Template
import sys

def main():
    # Fast I/O
    input = sys.stdin.read
    data = input().split()
    
    if data:
        n = int(data[0])
        print(f"Number: {n}")

if __name__ == "__main__":
    main()`;
      recommendations = "Use `sys.stdin.read` to swallow all inputs at once and parse them. It is exponentially faster than standard `input()`.";
      resources = [
        { name: "CodeWithHarry: Python Full Basics Course", url: "https://www.youtube.com/watch?v=t2_Q2yftK" },
        { name: "LeetCode: Python Basics Guide", url: "https://leetcode.com/problemset/all/" }
      ];
      notes = "Python is slower than C++ and Java, so optimizing built-ins is crucial. Use list comprehensions instead of standard loops. Avoid dynamic resizing of list inside deep loops if the size is known in advance.";
    } else {
      editorBoilerplate = `// Write your JavaScript Palindrome Solution here
function isPalindrome(n) {
    if (n < 0) return false;
    let temp = n;
    let rev = 0;
    while (temp > 0) {
        rev = rev * 10 + (temp % 10);
        temp = Math.floor(temp / 10);
    }
    return rev === n;
}`;
      approach = `JavaScript me division real float result return karta hai, isliye decimal numbers ko strip karne ke liye \`Math.floor()\` ya bitwise OR \`| 0\` use karna mandatory hai. Loop chalakar digits add karein aur value true/false check karein.`;
      code = `// JavaScript Fast I/O Template (NodeJS)
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (line) => {
    const n = parseInt(line.trim(), 10);
    console.log(\`Number: \${n}\`);
    process.exit(0);
});`;
      recommendations = "Use the `readline` module in NodeJS. Avoid using `console.log` inside loops; collect outputs in an array and join them at the end.";
      resources = [
        { name: "MDN: JavaScript Readline API Guide", url: "https://nodejs.org/api/readline.html" }
      ];
      notes = "JavaScript uses V8 engine optimization. Declare arrays with initial sizes if possible to avoid reallocation. Use binary bitwise operators carefully as all JS numbers are 64-bit floats.";
    }
    timeComplexity = 'O(log10(N))';
    spaceComplexity = 'O(1)';
    testCases = [
      { input: '121', expected: 'true' },
      { input: '123', expected: 'false' },
      { input: '0', expected: 'true' }
    ];
  }

  // LEVEL 1: ARRAYS EXPLORER
  else if (normalizedTitle.includes('array')) {
    
    challengeDescription = `Given an array of integers, return the largest element in the array.\n\nInput Format:\nAn array of integers.\n\nOutput Format:\nThe largest integer value inside the array.`;
    
    if (lang === 'cpp') {
      editorBoilerplate = `// Write your C++ Largest Array Element solution here
#include <vector>
using namespace std;

int findLargest(vector<int>& arr) {
    if (arr.empty()) return -1;
    int maxVal = arr[0];
    for (int num : arr) {
        if (num > maxVal) {
            maxVal = num;
        }
    }
    return maxVal;
}`;
      approach = `Array ka pehla element ko 'maxVal' maan lein. Fir pure array me linear loop lagakar har element ko compare karein. Agar koi bada value mil jaye, to 'maxVal' ko update kar dein. Isse O(N) time complexity me max mil jayega.`;
      code = `// Two Sum Solution using C++ std::unordered_map
#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> mp;
        for (int i = 0; i < nums.size(); ++i) {
            int complement = target - nums[i];
            if (mp.count(complement)) {
                return {mp[complement], i};
            }
            mp[nums[i]] = i;
        }
        return {};
    }
};`;
      recommendations = "Practice using `std::vector` for dynamic arrays and `std::unordered_map` (O(1) average lookup) instead of `std::map` (O(log n) tree lookup). Pass vectors by reference to avoid copying memory overhead.";
      resources = [
        { name: "Love Babbar: Lecture 9 (Arrays Introduction)", url: "https://www.youtube.com/watch?v=oBt53YbR9K0" },
        { name: "LeetCode: 2D Array / Matrix Problems", url: "https://leetcode.com/tag/array/" }
      ];
      notes = "For array challenges, watch out for integer overflow when calculating midpoints in binary search: use `low + (high - low) / 2` instead of `(low + high) / 2`.";
    } else if (lang === 'java') {
      editorBoilerplate = `// Write your Java Largest Array Element solution here
public class Solution {
    public static int findLargest(int[] arr) {
        if (arr == null || arr.length == 0) return -1;
        int maxVal = arr[0];
        for (int num : arr) {
            if (num > maxVal) {
                maxVal = num;
            }
        }
        return maxVal;
    }
}`;
      approach = `Java arrays fast raw access provide karte hain. Ek loop lagayein jo zero index se length tak search kare, and dynamic checks se largest number return karein. Wrapper class use karne ke bajaye static functions and primitives select karein performance optimize karne ke liye.`;
      code = `// Two Sum Solution using Java HashMap
import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }
}`;
      recommendations = "Utilize primitive arrays (`int[]`) for raw performance rather than `ArrayList<Integer>` when dimensions are static. For dynamic tracking, `ArrayList` is optimal.";
      resources = [
        { name: "Love Babbar: Java Arrays Playlists", url: "https://www.youtube.com/watch?v=oBt53YbR9K0" },
        { name: "LeetCode: Array Practice Set", url: "https://leetcode.com/tag/array/" }
      ];
      notes = "Array indices are 32-bit signed integers. When sorting, Java's `Arrays.sort()` uses Dual-Pivot Quicksort for primitives (O(n log n) but O(n²) worst-case) and Timsort for objects.";
    } else if (lang === 'python') {
      editorBoilerplate = `# Write your Python Largest Array Element solution here
def findLargest(arr: list[int]) -> int:
    if not arr:
        return -1
    max_val = arr[0]
    for num in arr:
        if num > max_val:
            max_val = num
    return max_val`;
      approach = `Python arrays ya dynamic lists me direct iteration speed optimize karti hai. 'for num in arr' loop use karke variable update karein, ya space optimize karne ke liye standard indexing use karein. Builtin \`max()\` function background me raw logic execute karta hai.`;
      code = `# Two Sum Solution using Python Dictionary
class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        seen = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in seen:
                return [seen[complement], i]
            seen[num] = i
        return []`;
      recommendations = "Use Python's highly optimized list slicing (`nums[::-1]`) and built-in `enumerate()` for indexing. Utilize the `collections.deque` if operations require pop/insert from both ends.";
      resources = [
        { name: "CodeWithHarry: Python Lists & Arrays", url: "https://www.youtube.com/watch?v=y3Z-T9wK2bQ" },
        { name: "LeetCode: Python Arrays Practice", url: "https://leetcode.com/tag/array/" }
      ];
      notes = "Python lists are dynamic arrays. List indexing is fast, but adding/removing from the beginning of a list is O(n) due to shifting elements. Use `collections.deque` for O(1) start modifications.";
    } else {
      editorBoilerplate = `// Write your JavaScript Largest Array Element solution here
function findLargest(arr) {
    if (!arr || arr.length === 0) return -1;
    let maxVal = arr[0];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > maxVal) {
            maxVal = arr[i];
        }
    }
    return maxVal;
}`;
      approach = `JavaScript dense arrays use karta hai. Normal 'for' ya 'forEach' loop se element retrieve karein aur maximum element track karein. JS builtins \`Math.max(...arr)\` call stacks me error throw kar sakte hain high elements count hone pe, isliye linear loop safe and optimal hai.`;
      code = `// Two Sum Solution using JavaScript Map
function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`;
      recommendations = "Use modern `Map` for key-value pairings rather than plain objects (`{}`) to avoid prototype lookup chain issues and preserve numeric keys.";
      resources = [
        { name: "MDN: JavaScript Array Methods Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array" }
      ];
      notes = "JavaScript arrays are objects under the hood, meaning they are sparse arrays. For high performance, initialize contiguous arrays using `new Int32Array(length)` when handling integer computations.";
    }
    timeComplexity = 'O(N)';
    spaceComplexity = 'O(1)';
    testCases = [
      { input: '[1,5,3,9,2]', expected: '9' },
      { input: '[-1,-5,-3]', expected: '-1' },
      { input: '[4]', expected: '4' }
    ];
  }

  // LEVEL 2-3: HASHING & RECURSION
  else if (normalizedTitle.includes('hash') || normalizedTitle.includes('recursion') || normalizedTitle.includes('backtracking') || normalizedTitle.includes('subsequence')) {
    
    challengeDescription = `Write a recursive function that calculates the N-th Fibonacci number. Fibonacci sequence is: 0, 1, 1, 2, 3, 5, 8...\n\nInput Format:\nAn integer N.\n\nOutput Format:\nThe N-th Fibonacci integer.`;
    
    if (lang === 'cpp') {
      editorBoilerplate = `// Write your C++ Recursive Fibonacci solution here
int fib(int n) {
    if (n <= 0) return 0;
    if (n == 1) return 1;
    return fib(n - 1) + fib(n - 2);
}`;
      approach = `Recursion ke liye hume minimum base cases handle karne padte hain taaki call stack crash na ho. Fibonacci me base case \`n <= 0\` return 0 and \`n == 1\` return 1 define karein. Fir dynamic execution logic se \`fib(n-1) + fib(n-2)\` call back karein.`;
      code = `// Backtracking Example: Permutations (C++)
#include <vector>
#include <iostream>
using namespace std;

class Solution {
private:
    void solve(vector<int>& nums, vector<vector<int>>& ans, int index) {
        if (index >= nums.size()) {
            ans.push_back(nums);
            return;
        }
        for (int i = index; i < nums.size(); ++i) {
            swap(nums[index], nums[i]);
            solve(nums, ans, index + 1);
            swap(nums[index], nums[i]); // Backtrack
        }
    }
public:
    vector<vector<int>> permute(vector<int>& nums) {
        vector<vector<int>> ans;
        solve(nums, ans, 0);
        return ans;
    }
};`;
      recommendations = "Use `std::unordered_set` or `std::unordered_map` for hashing. For recursion, always define the base cases at the very beginning of the function to prevent segmentation faults (Stack Overflow).";
      resources = [
        { name: "Love Babbar: Recursion & Memory Heap", url: "https://www.youtube.com/watch?v=5_6qaqcoUX4" },
        { name: "LeetCode: Backtracking Practice Problems", url: "https://leetcode.com/tag/backtracking/" }
      ];
      notes = "Watch out for deep recursion. The default stack limit on Windows/Linux is limited. Pass accumulators and collections by reference to conserve recursive stack frame memory.";
    } else if (lang === 'java') {
      editorBoilerplate = `// Write your Java Recursive Fibonacci solution here
public class Solution {
    public static int fib(int n) {
        if (n <= 0) return 0;
        if (n == 1) return 1;
        return fib(n - 1) + fib(n - 2);
    }
}`;
      approach = `Java me recursive call parameters local JVM call stack me store hote hain. Base conditions define karein and small subsets me transition karein. Standard stack values optimization ke liye deep recursive actions se bachein.`;
      code = `// Backtracking Example: Permutations (Java)
import java.util.*;

class Solution {
    private void solve(int[] nums, List<List<Integer>> ans, int index) {
        if (index >= nums.length) {
            List<Integer> list = new ArrayList<>();
            for (int x : nums) list.add(x);
            ans.add(list);
            return;
        }
        for (int i = index; i < nums.length; i++) {
            swap(nums, index, i);
            solve(nums, ans, index + 1);
            swap(nums, index, i); // Backtrack
        }
    }
    private void swap(int[] nums, int i, int j) {
        int temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
    }
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> ans = new ArrayList<>();
        solve(nums, ans, 0);
        return ans;
    }
}`;
      recommendations = "Use `HashSet` and `HashMap` for hashing. When doing backtracking, always copy stateful objects (e.g. `new ArrayList<>(currentList)`) before adding them to the final results list.";
      resources = [
        { name: "Love Babbar: Java Hashing Intro", url: "https://www.youtube.com/watch?v=7m1l58FyiQA" },
        { name: "LeetCode: Backtracking Questions", url: "https://leetcode.com/tag/backtracking/" }
      ];
      notes = "Java allocates objects on the heap. Frequent allocations inside recursion (like creating new arrays) will trigger garbage collection, causing timing issues. Modify arrays in-place whenever possible.";
    } else if (lang === 'python') {
      editorBoilerplate = `# Write your Python Recursive Fibonacci solution here
def fib(n: int) -> int:
    if n <= 0:
        return 0
    if n == 1:
        return 1
    return fib(n - 1) + fib(n - 2)`;
      approach = `Python me basic call stack frames nested bounds set karta hai. Recursion limit cross hone pe warning trigger hoti hai. Fibonacci value extract karne ke liye optimal return paths execute karein.`;
      code = `# Backtracking Example: Permutations (Python)
class Solution:
    def permute(self, nums: list[int]) -> list[list[int]]:
        ans = []
        def solve(index):
            if index >= len(nums):
                ans.append(nums[:]) # Deep copy slice
                return
            for i in range(index, len(nums)):
                nums[index], nums[i] = nums[i], nums[index]
                solve(index + 1)
                nums[index], nums[i] = nums[i], nums[index] # Backtrack
        solve(0)
        return ans`;
      recommendations = "Use `set()` and `{}` (dicts) for hashing. For deep recursion, import `sys` and adjust stack bounds if necessary: `sys.setrecursionlimit(2000)`.";
      resources = [
        { name: "CodeWithHarry: Recursion & DP Concept", url: "https://www.youtube.com/watch?v=un6PybaEisA" },
        { name: "LeetCode: Python Backtracking Tag", url: "https://leetcode.com/tag/backtracking/" }
      ];
      notes = "Python's call stack is bounded at 1000 frames by default. When storing recursive results, make sure you append copies of arrays (`ans.append(path[:])`) rather than the original reference.";
    } else {
      editorBoilerplate = `// Write your JavaScript Recursive Fibonacci solution here
function fib(n) {
    if (n <= 0) return 0;
    if (n === 1) return 1;
    return fib(n - 1) + fib(n - 2);
}`;
      approach = `JavaScript handles call limits locally. Base bounds verify karke, recursion return nodes perform karein. JS me closure parameters update karte waqt extra heap pointers consume hote hain.`;
      code = `// Backtracking Example: Permutations (JavaScript)
function permute(nums) {
    const ans = [];
    function solve(index) {
        if (index >= nums.length) {
            ans.push([...nums]); // Spread copy
            return;
        }
        for (let i = index; i < nums.length; i++) {
            [nums[index], nums[i]] = [nums[i], nums[index]];
            solve(index + 1);
            [nums[index], nums[i]] = [nums[i], nums[index]]; // Backtrack
        }
    }
    solve(0);
    return ans;
}`;
      recommendations = "Use standard ES6 `Set` and `Map`. In backtracking, leverage ES6 spread operators `[...currentArray]` to quickly copy states.";
      resources = [
        { name: "MDN: JavaScript Set documentation", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set" }
      ];
      notes = "Recursion in JavaScript can block the main execution loop if not yielding. Keep functions compact and avoid massive closure scopes inside high-depth recursive calls.";
    }
    timeComplexity = 'O(2^N)';
    spaceComplexity = 'O(N)';
    testCases = [
      { input: '5', expected: '5' },
      { input: '8', expected: '21' },
      { input: '0', expected: '0' }
    ];
  }

  // LEVEL 4-5: LINKED LIST, STACKS & QUEUES
  else if (normalizedTitle.includes('linked list') || normalizedTitle.includes('stack') || normalizedTitle.includes('queue') || normalizedTitle.includes('ll')) {
    
    challengeDescription = `Implement a simple Stack structure using list elements. Build a class/constructor that features push(x), pop(), and top() functions.\n\nInput Format:\nOperations push, pop, top.\n\nOutput Format:\nThe pop values or current top values.`;
    
    if (lang === 'cpp') {
      editorBoilerplate = `// Write your C++ Stack Implementation here
#include <vector>
using namespace std;

class MyStack {
private:
    vector<int> v;
public:
    void push(int x) {
        v.push_back(x);
    }
    int pop() {
        if (v.empty()) return -1;
        int topVal = v.back();
        v.pop_back();
        return topVal;
    }
    int top() {
        if (v.empty()) return -1;
        return v.back();
    }
};`;
      approach = `C++ vector dynamic memory automatic manage karta hai. \`push_back()\` se stack ke end me elements insert karein. \`pop_back()\` aur \`back()\` functions ki help se top values retrieve karein in O(1) time complexity.`;
      code = `// Reverse Linked List (C++)
#include <iostream>

struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(NULL) {}
};

class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode* prev = NULL;
        ListNode* curr = head;
        while (curr != NULL) {
            ListNode* nextNode = curr->next;
            curr->next = prev;
            prev = curr;
            curr = nextNode;
        }
        return prev;
    }
};`;
      recommendations = "Utilize `std::stack` or `std::queue`. Be mindful of null pointers! Always verify pointer bounds: `if (head == nullptr || head->next == nullptr)`.";
      resources = [
        { name: "Love Babbar: Lecture 44 (Linked List Introduction)", url: "https://www.youtube.com/watch?v=vqS1nvKxyTM" },
        { name: "LeetCode: Monotonic Stack Problems", url: "https://leetcode.com/tag/monotonic-stack/" }
      ];
      notes = "Avoid memory leaks. If you dynamically allocate nodes, ensure they are deallocated. In competitive setups, you don't need manual delete as the program terminates, but it is a vital industrial skill.";
    } else if (lang === 'java') {
      editorBoilerplate = `// Write your Java Stack Implementation here
import java.util.ArrayList;

class MyStack {
    private ArrayList<Integer> list = new ArrayList<>();
    
    public void push(int x) {
        list.add(x);
    }
    public int pop() {
        if (list.isEmpty()) return -1;
        return list.remove(list.size() - 1);
    }
    public int top() {
        if (list.isEmpty()) return -1;
        return list.get(list.size() - 1);
    }
}`;
      approach = `Java ArrayList dynamic array capability support karta hai. ArrayList ke active indices calculate karein, push pe values array list ke boundary index me append karein aur pop operations me remove method triggers apply karein.`;
      code = `// Reverse Linked List (Java)
class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; }
}

class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode curr = head;
        while (curr != null) {
            ListNode nextNode = curr.next;
            curr.next = prev;
            prev = curr;
            curr = nextNode;
        }
        return prev;
    }
}`;
      recommendations = "Use `java.util.Stack` or `java.util.ArrayDeque` for Stack operations, and `LinkedList` or `ArrayDeque` for Queue structures. `ArrayDeque` is consistently faster.";
      resources = [
        { name: "Love Babbar: Java Stacks and Queues Basics", url: "https://www.youtube.com/watch?v=gyPa_m8fW-w" },
        { name: "LeetCode: Stack & Queue Tag", url: "https://leetcode.com/tag/stack/" }
      ];
      notes = "Java GC handles node cleanup. When dealing with stack and queue inputs, remember that `Stack` is thread-safe (synchronized), meaning `ArrayDeque` provides better raw single-threaded speed.";
    } else if (lang === 'python') {
      editorBoilerplate = `# Write your Python Stack Implementation here
class MyStack:
    def __init__(self):
        self.stack = []
        
    def push(self, x: int):
        self.stack.append(x)
        
    def pop(self) -> int:
        if not self.stack:
            return -1
        return self.stack.pop()
        
    def top(self) -> int:
        if not self.stack:
            return -1
        return self.stack[-1]`;
      approach = `Python standard list internally stack properties satisfy karta hai. Elements ko end me include karne ke liye \`append()\` and extract karne ke liye \`pop()\` native method ka call karein. Last element retrieve karne ke liye list slicing syntax \`[-1]\` efficient lookup provide karta hai.`;
      code = `# Reverse Linked List (Python)
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def reverseList(self, head: ListNode) -> ListNode:
        prev = None
        curr = head
        while curr:
            next_node = curr.next
            curr.next = prev
            prev = curr
            curr = next_node
        return prev`;
      recommendations = "Use `collections.deque` for stacks and queues. Do NOT use Python lists for queues: `list.pop(0)` is an O(n) operation whereas `deque.popleft()` is O(1).";
      resources = [
        { name: "CodeWithHarry: Stacks & Queues via Python", url: "https://www.youtube.com/watch?v=gyPa_m8fW-w" },
        { name: "LeetCode: Python Stacks/Queues", url: "https://leetcode.com/tag/stack/" }
      ];
      notes = "Watch out for cyclic references in node connections. Cyclic graphs inside structures can cause massive memory consumption in GC systems if not properly severed.";
    } else {
      editorBoilerplate = `// Write your JavaScript Stack Implementation here
class MyStack {
    constructor() {
        this.arr = [];
    }
    push(x) {
        this.arr.push(x);
    }
    pop() {
        if (this.arr.length === 0) return -1;
        return this.arr.pop();
    }
    top() {
        if (this.arr.length === 0) return -1;
        return this.arr[this.arr.length - 1];
    }
}`;
      approach = `JavaScript standard array standard stack algorithms implement karta hai. \`push()\` and \`pop()\` both native array methods internally amortized O(1) complexity execute karte hain, isliye customize wrappers easily perform ho jate hain.`;
      code = `// Reverse Linked List (JavaScript)
function ListNode(val, next) {
    this.val = (val===undefined ? 0 : val)
    this.next = (next===undefined ? null : next)
}

function reverseList(head) {
    let prev = null;
    let curr = head;
    while (curr !== null) {
        let nextNode = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nextNode;
    }
    return prev;
}`;
      recommendations = "Implement custom stack/queue wrappers or use standard arrays. Use `push()` and `pop()` for stack operations (O(1)). Use link nodes for queue, as array `shift()` is O(n).";
      resources = [
        { name: "LeetCode: JS Linked Lists Practice", url: "https://leetcode.com/tag/linked-list/" }
      ];
      notes = "JavaScript references variables by reference. Changing node structures dynamically updates references globally. Always create dummy nodes `const dummy = new ListNode(-1)` for LL manipulation.";
    }
    timeComplexity = 'O(1)';
    spaceComplexity = 'O(N)';
    testCases = [
      { input: 'push(5), top()', expected: '5' },
      { input: 'push(1), push(2), pop()', expected: '2' },
      { input: 'pop()', expected: '-1' }
    ];
  }

  // LEVEL 6-7: TREES & GRAPHS
  else if (normalizedTitle.includes('tree') || normalizedTitle.includes('graph') || normalizedTitle.includes('dfs') || normalizedTitle.includes('bfs') || normalizedTitle.includes('dijkstra') || normalizedTitle.includes('topo')) {
    
    challengeDescription = `Write a function that counts the total number of nodes in a Binary Tree.\n\nInput Format:\nBinary Tree representation.\n\nOutput Format:\nTotal count of nodes (integer).`;
    
    if (lang === 'cpp') {
      editorBoilerplate = `// Write your C++ Binary Tree Node Count solution here
struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
};

int countNodes(TreeNode* root) {
    if (root == nullptr) return 0;
    return 1 + countNodes(root->left) + countNodes(root->right);
}`;
      approach = `Agar root node NULL hai, to nodes count zero hoga. Recursion ki help se left subtree aur right subtree ke nodes count calculate karein, aur unme current root node (1) add karke return karein.`;
      code = `// BFS Traversal of Graph using Adjacency List (C++)
#include <vector>
#include <queue>
using namespace std;

class Solution {
public:
    vector<int> bfsOfGraph(int V, vector<int> adj[]) {
        vector<int> bfs;
        vector<int> vis(V, 0);
        queue<int> q;
        
        q.push(0);
        vis[0] = 1;
        while (!q.empty()) {
            int node = q.front();
            q.pop();
            bfs.push_back(node);
            
            for (auto it : adj[node]) {
                if (!vis[it]) {
                    vis[it] = 1;
                    q.push(it);
                }
            }
        }
        return bfs;
    }
};`;
      recommendations = "Use `std::vector<vector<int>>` or dynamic arrays for Adjacency Lists. Leverage `std::priority_queue` (min-heap) for Dijkstra's Shortest Path.";
      resources = [
        { name: "Love Babbar: Tree Traversals & DFS Structures", url: "https://www.youtube.com/watch?v=5_6qaqcoUX4" },
        { name: "Love Babbar: Graph Breadth First Search (BFS)", url: "https://www.youtube.com/watch?v=EaK6F_2E0d4" }
      ];
      notes = "Tree and Graph logic is heavy on nested operations. Initialize visited arrays using `vector<int> vis(V, 0)` rather than map to maintain fast lookup. Make sure to define standard undirected edges correctly by inserting both pairs.";
    } else if (lang === 'java') {
      editorBoilerplate = `// Write your Java Binary Tree Node Count solution here
class TreeNode {
    int val;
    TreeNode left, right;
}

public class Solution {
    public static int countNodes(TreeNode root) {
        if (root == null) return 0;
        return 1 + countNodes(root.left) + countNodes(root.right);
    }
}`;
      approach = `Java me Tree nodes heap me dynamic memory refer karte hain. Base condition check lagayein ki jab root null ho to return 0. Uske bad recursive transitions se node addition perform karein.`;
      code = `// BFS Traversal of Graph (Java)
import java.util.*;

class Solution {
    public ArrayList<Integer> bfsOfGraph(int V, ArrayList<ArrayList<Integer>> adj) {
        ArrayList<Integer> bfs = new ArrayList<>();
        boolean[] vis = new boolean[V];
        Queue<Integer> q = new LinkedList<>();
        
        q.add(0);
        vis[0] = true;
        while (!q.isEmpty()) {
            int node = q.poll();
            bfs.add(node);
            
            for (Integer it : adj.get(node)) {
                if (!vis[it]) {
                    vis[it] = true;
                    q.add(it);
                }
            }
        }
        return bfs;
    }
}`;
      recommendations = "Use boolean primitive arrays (`boolean[] vis`) instead of `ArrayList<Boolean>` to optimize cache locality. Use `PriorityQueue` for Prim's and Dijkstra's.";
      resources = [
        { name: "Love Babbar: Java Tree Construction", url: "https://www.youtube.com/watch?v=l_7V5uYI2G0" },
        { name: "Love Babbar: Java Graph Algorithms", url: "https://www.youtube.com/watch?v=M3_pLsDdeuU" }
      ];
      notes = "When building min-heaps/max-heaps using `PriorityQueue`, custom comparators are crucial: `PriorityQueue<Pair> pq = new PriorityQueue<>((a, b) -> a.dist - b.dist);` is extremely clean.";
    } else if (lang === 'python') {
      editorBoilerplate = `# Write your Python Binary Tree Node Count solution here
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def countNodes(root: TreeNode) -> int:
    if not root:
        return 0
    return 1 + countNodes(root.left) + countNodes(root.right)`;
      approach = `Python objects pointer references use karte hain. Recursion trees depth limits adjust karte hue nodes validation process execute karein base stack counts optimization ke sath.`;
      code = `# BFS Traversal of Graph (Python)
from collections import deque

class Solution:
    def bfsOfGraph(self, V: int, adj: list[list[int]]) -> list[int]:
        bfs = []
        vis = [0] * V
        q = deque([0])
        
        vis[0] = 1
        while q:
            node = q.popleft()
            bfs.append(node)
            
            for it in adj[node]:
                if not vis[it]:
                    vis[it] = 1
                    q.append(it)
        return bfs`;
      recommendations = "Use `collections.deque` for graph queue traversals (BFS). Utilize the `heapq` module for min-heap operations (Dijkstra). Python lists act natively as stacks (for DFS).";
      resources = [
        { name: "CodeWithHarry: Trees Traversals & Graphs", url: "https://www.youtube.com/watch?v=l_7V5uYI2G0" },
        { name: "LeetCode: Tree & Graph Tag", url: "https://leetcode.com/tag/graph/" }
      ];
      notes = "For recursion algorithms in deep graphs/trees (DFS/Postorder), always adjust Python recursion depth limits. For nodes representation, simple lists of lists are fast and compact.";
    } else {
      editorBoilerplate = `// Write your JavaScript Binary Tree Node Count solution here
function TreeNode(val, left, right) {
    this.val = (val===undefined ? 0 : val)
    this.left = (left===undefined ? null : left)
    this.right = (right===undefined ? null : right)
}

function countNodes(root) {
    if (root === null) return 0;
    return 1 + countNodes(root.left) + countNodes(root.right);
}`;
      approach = `JavaScript object constructor dynamic tree variables populate karta hai. Binary tree traversal calculations run karein simple left, right check triggers apply karke.`;
      code = `// BFS Traversal of Graph (JavaScript)
function bfsOfGraph(V, adj) {
    const bfs = [];
    const vis = new Uint8Array(V);
    const q = [0];
    
    vis[0] = 1;
    let head = 0; // Manual queue pointer to avoid shift() O(n)
    while (head < q.length) {
        const node = q[head++];
        bfs.push(node);
        
        for (const it of adj[node]) {
            if (!vis[it]) {
                vis[it] = 1;
                q.push(it);
            }
        }
    }
    return bfs;
}`;
      recommendations = "Create a custom queue tracker (`let head = 0` and pointer incremental index) in JS arrays instead of using `shift()` which is an O(n) operation.";
      resources = [
        { name: "MDN: JavaScript Tree structures tutorial", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" }
      ];
      notes = "Graph layers can grow quickly. Use `Uint8Array` or `Int32Array` for vis arrays to keep RAM footprints tight. Trees and graphs require pristine reference passing.";
    }
    timeComplexity = 'O(N)';
    spaceComplexity = 'O(Height of Tree)';
    testCases = [
      { input: '[1, 2, 3]', expected: '3' },
      { input: '[1, null, 2]', expected: '2' },
      { input: '[]', expected: '0' }
    ];
  }

  // LEVEL 8: DYNAMIC PROGRAMMING
  else if (normalizedTitle.includes('dynamic programming') || normalizedTitle.includes('dp') || normalizedTitle.includes('knapsack') || normalizedTitle.includes('longest common') || normalizedTitle.includes('grids')) {
    
    challengeDescription = `Solve the Climbing Stairs problem. You can climb 1 or 2 steps to reach the top. Given 'n' steps, return the number of distinct ways to climb to the top.\n\nInput Format:\nAn integer n.\n\nOutput Format:\nNumber of distinct ways (integer).`;
    
    if (lang === 'cpp') {
      editorBoilerplate = `// Write your C++ Climbing Stairs DP solution here
#include <vector>
using namespace std;

int climbStairs(int n) {
    if (n <= 2) return n;
    vector<int> dp(n + 1, 0);
    dp[1] = 1;
    dp[2] = 2;
    for (int i = 3; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];
    }
    return dp[n];
}`;
      approach = `Aap 1 ya 2 steps le sakte hain. \`n\` step tak pahunchne ke total ways \`(n-1)\` aur \`(n-2)\` levels ke ways ka summation hoga! \`dp[i] = dp[i-1] + dp[i-2]\`. Tabulation use karke hum pure values vector me store kar sakte hain.`;
      code = `// 0-1 Knapsack: Memoized and Space Optimized (C++)
#include <vector>
#include <iostream>
using namespace std;

class Solution {
public:
    int knapsack(vector<int>& wt, vector<int>& val, int n, int W) {
        vector<int> prev(W + 1, 0);
        for (int i = wt[0]; i <= W; ++i) prev[i] = val[0];
        
        for (int ind = 1; ind < n; ++ind) {
            for (int cap = W; cap >= 0; --cap) {
                int notTake = prev[cap];
                int take = -1e9;
                if (wt[ind] <= cap) take = val[ind] + prev[cap - wt[ind]];
                prev[cap] = max(take, notTake);
            }
        }
        return prev[W];
    }
};`;
      recommendations = "Implement dynamic programming using a 1D vector (space optimization) instead of a 2D table when calculations only depend on previous rows (`prev` and `curr`).";
      resources = [
        { name: "Love Babbar: Lecture 102 (Dynamic Programming Introduction)", url: "https://www.youtube.com/watch?v=vqS1nvKxyTM" },
        { name: "LeetCode: Dynamic Programming Exercises", url: "https://leetcode.com/tag/dynamic-programming/" }
      ];
      notes = "For dynamic programming, always try: (1) Recursive Brute Force -> (2) Memoization (Top-down) -> (3) Tabulation (Bottom-up) -> (4) Space Optimization. C++ vectors can be initialized easily with defaults: `vector<int> dp(n, -1)`.";
    } else if (lang === 'java') {
      editorBoilerplate = `// Write your Java Climbing Stairs DP solution here
public class Solution {
    public static int climbStairs(int n) {
        if (n <= 2) return n;
        int[] dp = new int[n + 1];
        dp[1] = 1;
        dp[2] = 2;
        for (int i = 3; i <= n; i++) {
            dp[i] = dp[i-1] + dp[i-2];
        }
        return dp[n];
    }
}`;
      approach = `Java me 1D array \`int[] dp\` declare karke space aur GC performance optimize karein. Fibonacci sequence follow karte hue loop values update karein and solution return karein.`;
      code = `// 0-1 Knapsack: Bottom-Up & Space Optimized (Java)
class Solution {
    public int knapsack(int[] wt, int[] val, int n, int W) {
        int[] prev = new int[W + 1];
        for (int i = wt[0]; i <= W; i++) prev[i] = val[0];
        
        for (int ind = 1; ind < n; ind++) {
            for (int cap = W; cap >= 0; cap--) {
                int notTake = prev[cap];
                int take = Integer.MIN_VALUE;
                if (wt[ind] <= cap) {
                    take = val[ind] + prev[cap - wt[ind]];
                }
                prev[cap] = Math.max(take, notTake);
            }
        }
        return prev[W];
    }
}`;
      recommendations = "Use simple primitive arrays (`int[] dp`) rather than multidimensional arrays or boxed types for maximum memory bandwidth and lightning execution speeds.";
      resources = [
        { name: "Love Babbar: Java DP Concepts Playlist", url: "https://www.youtube.com/watch?v=tyB0ztf0DNY" },
        { name: "LeetCode: Dynamic Programming Category", url: "https://leetcode.com/tag/dynamic-programming/" }
      ];
      notes = "Java Virtual Machine optimization speeds up standard `for` loops. Dynamic allocation inside DP loops (like creating row arrays in each step) is bad practice. Declare single global tables or `prev` arrays.";
    } else if (lang === 'python') {
      editorBoilerplate = `# Write your Python Climbing Stairs DP solution here
def climbStairs(n: int) -> int:
    if n <= 2:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    dp[2] = 2
    for i in range(3, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]`;
      approach = `Python dicts or caching parameters check lagakar recursive memoization select karein. '@lru_cache' decorator top down approaches me code boiletplates clean and lightweight design karta hai.`;
      code = `# 0-1 Knapsack: Bottom-Up & Space Optimized (Python)
class Solution:
    def knapsack(self, wt: list[int], val: list[int], n: int, W: int) -> int:
        prev = [0] * (W + 1)
        for i in range(wt[0], W + 1):
            prev[i] = val[0]
            
        for ind in range(1, n):
            for cap in range(W, -1, -1):
                not_take = prev[cap]
                take = -float('inf')
                if wt[ind] <= cap:
                    take = val[ind] + prev[cap - wt[ind]]
                prev[cap] = max(take, not_take)
        return prev[W]`;
      recommendations = "Use memoization decorators like `@functools.lru_cache(None)` on simple recursive helper functions to implement seamless top-down memoization without manual tables.";
      resources = [
        { name: "CodeWithHarry: Python Dynamic Programming tutorial", url: "https://www.youtube.com/watch?v=tyB0ztf0DNY" },
        { name: "LeetCode: Python DP Problems", url: "https://leetcode.com/tag/dynamic-programming/" }
      ];
      notes = "Python's function overhead is slightly heavy, so bottom-up tabulation is usually faster than recursive memoization. When writing backwards ranges, always verify the bounds carefully.";
    } else {
      editorBoilerplate = `// Write your JavaScript Climbing Stairs DP solution here
function climbStairs(n) {
    if (n <= 2) return n;
    const dp = new Int32Array(n + 1);
    dp[1] = 1;
    dp[2] = 2;
    for (let i = 3; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];
    }
    return dp[n];
}`;
      approach = `JavaScript TypedArray \`Int32Array\` memory footprint standard raw values me execute karta hai. Dynamic key allocation replace karke faster computations access karein loop execution speed badhane ke liye.`;
      code = `// 0-1 Knapsack: Space Optimized (JavaScript)
function knapsack(wt, val, n, W) {
    const prev = new Int32Array(W + 1);
    for (let i = wt[0]; i <= W; i++) prev[i] = val[0];
    
    for (let ind = 1; ind < n; ind++) {
        for (let cap = W; cap >= 0; cap--) {
            const notTake = prev[cap];
            let take = -Infinity;
            if (wt[ind] <= cap) {
                take = val[ind] + prev[cap - wt[ind]];
            }
            prev[cap] = Math.max(take, notTake);
        }
    }
    return prev[W];
}`;
      recommendations = "Leverage TypedArrays (`Int32Array` or `Float64Array`) for creating dynamic tables to bypass sparse array allocation and get C-like speed.";
      resources = [
        { name: "LeetCode: JS Dynamic Programming", url: "https://leetcode.com/tag/dynamic-programming/" }
      ];
      notes = "Avoid dynamic key lookups inside DP loops. Plain object hashing is slow, so 1D and 2D arrays are ideal. For memo keys, compound strings are much slower than array indexes.";
    }
    timeComplexity = 'O(N)';
    spaceComplexity = 'O(N)';
    testCases = [
      { input: '3', expected: '3' },
      { input: '5', expected: '8' },
      { input: '2', expected: '2' }
    ];
  }

  // LEVEL 9-10: GREEDY & PLACEMENT SPECIAL
  else {
    
    challengeDescription = `Write a program to count set bits of an integer. E.g., for 5 (binary 101), return 2.\n\nInput Format:\nAn integer N.\n\nOutput Format:\nNumber of set bits (integer).`;
    
    if (lang === 'cpp') {
      editorBoilerplate = `// Write your C++ Bit Counting solution here
int countSetBits(int n) {
    int count = 0;
    while (n > 0) {
        count += (n & 1);
        n >>= 1;
    }
    return count;
}`;
      approach = `C++ me bitwise operators bohot fast hote hain. Jab tak n > 0 hai, tab tak 'n & 1' (check rightmost bit) count me add karein aur n ko 1 bit right shift (n >>= 1) karein. Ye optimal check process hai!`;
      code = `// Fractional Knapsack Problem (C++)
#include <vector>
#include <algorithm>
using namespace std;

struct Item {
    int value;
    int weight;
};

class Solution {
private:
    static bool comp(Item a, Item b) {
        double r1 = (double)a.value / (double)a.weight;
        double r2 = (double)b.value / (double)b.weight;
        return r1 > r2;
    }
public:
    double fractionalKnapsack(int W, Item arr[], int n) {
        sort(arr, arr + n, comp);
        double finalVal = 0.0;
        for (int i = 0; i < n; i++) {
            if (arr[i].weight <= W) {
                W -= arr[i].weight;
                finalVal += arr[i].value;
            } else {
                finalVal += arr[i].value * ((double)W / arr[i].weight);
                break;
            }
        }
        return finalVal;
    }
};`;
      recommendations = "Use `std::sort` with standard static comparator lambdas for quick intervals and ratios sorting. Leverage Bitwise operators (`&`, `|`, `^`, `<<`, `>>`) for fast bit manipulation.";
      resources = [
        { name: "Love Babbar: Lecture 84 (Greedy Algorithms)", url: "https://www.youtube.com/watch?v=n59vC9nJreU" },
        { name: "LeetCode: Greedy Tag Practice", url: "https://leetcode.com/tag/greedy/" }
      ];
      notes = "For custom sorts, your sorting comparator must enforce Strict Weak Ordering (return `false` if elements are equal), otherwise `std::sort` can trigger segmented faults.";
    } else if (lang === 'java') {
      editorBoilerplate = `// Write your Java Bit Counting solution here
public class Solution {
    public static int countSetBits(int n) {
        int count = 0;
        while (n > 0) {
            count += (n & 1);
            n >>= 1;
        }
        return count;
    }
}`;
      approach = `Java bitwise unsigned check shift \`>>>\` support karta hai. Bit mask operator \`&\` se compare karein and output evaluate karein.`;
      code = `// Fractional Knapsack Problem (Java)
import java.util.*;

class Item {
    int value, weight;
    Item(int x, int y) { this.value = x; this.weight = y; }
}

class Solution {
    public double fractionalKnapsack(int W, Item arr[], int n) {
        Arrays.sort(arr, (a, b) -> {
            double r1 = (double)a.value / a.weight;
            double r2 = (double)b.value / b.weight;
            return Double.compare(r2, r1); // Descending order
        });
        
        double finalVal = 0.0;
        for (int i = 0; i < n; i++) {
            if (arr[i].weight <= W) {
                W -= arr[i].weight;
                finalVal += arr[i].value;
            } else {
                finalVal += arr[i].value * ((double)W / arr[i].weight);
                break;
            }
        }
        return finalVal;
    }
}`;
      recommendations = "Leverage Lambda comparators. Avoid standard casting of double values inside division without explicit double conversion.";
      resources = [
        { name: "Love Babbar: Java Bitwise Placements Basics", url: "https://www.youtube.com/watch?v=5rtVTYAk9KQ" },
        { name: "LeetCode: Greedy Algorithms", url: "https://leetcode.com/tag/greedy/" }
      ];
      notes = "When solving placement challenges on trees and binary operations, utilize shift operations `1 << n` for power calculations. Java's `>>>` is an unsigned right-shift operator.";
    } else if (lang === 'python') {
      editorBoilerplate = `# Write your Python Bit Counting solution here
def countSetBits(n: int) -> int:
    count = 0
    while n > 0:
        count += (n & 1)
        n >>= 1
    return count`;
      approach = `Python integers infinite scale control satisfy karte hain. Modulo and shift operator use karke counts return karein.`;
      code = `# Fractional Knapsack Problem (Python)
class Item:
    def __init__(self, value, weight):
        self.value = value
        self.weight = weight

class Solution:
    def fractionalKnapsack(self, W: int, arr: list[Item], n: int) -> float:
        arr.sort(key=lambda x: x.value / x.weight, reverse=True)
        final_val = 0.0
        for item in arr:
            if item.weight <= W:
                W -= item.weight;
                final_val += item.value
            else:
                final_val += item.value * (W / item.weight)
                break
        return final_val`;
      recommendations = "Use sorting lambda keys. Utilize bit manipulations natively; Python integers have arbitrary precision.";
      resources = [
        { name: "CodeWithHarry: Python Bit Manipulation tricks", url: "https://www.youtube.com/watch?v=5rtVTYAk9KQ" },
        { name: "LeetCode: Python Greedy Practice", url: "https://leetcode.com/tag/greedy/" }
      ];
      notes = "Python integers automatically scale up to infinite bounds, meaning you never have integer overflow in bitwise actions. Sorting is extremely fast via Timsort.";
    } else {
      editorBoilerplate = `// Write your JavaScript Bit Counting solution here
function countSetBits(n) {
    let count = 0;
    while (n > 0) {
        count += (n & 1);
        n >>= 1;
    }
    return count;
}`;
      approach = `JavaScript values bit mask binary operators use kar sakti hain float floating logic bypass karke. Mod values compare karein aur shift calculate karein O(1) space me.`;
      code = `// Fractional Knapsack Problem (JavaScript)
function fractionalKnapsack(W, arr, n) {
    arr.sort((a, b) => (b.value / b.weight) - (a.value / a.weight));
    let finalVal = 0.0;
    for (let i = 0; i < n; i++) {
        if (arr[i].weight <= W) {
            W -= arr[i].weight;
            finalVal += arr[i].value;
        } else {
            finalVal += arr[i].value * (W / arr[i].weight);
            break;
        }
    }
    return finalVal;
}`;
      recommendations = "Use standard JS sorting callback to avoid alphabetic sorts. Use bitwise operations to cast values quickly.";
      resources = [
        { name: "LeetCode: JS Greedy Challenges", url: "https://leetcode.com/tag/greedy/" }
      ];
      notes = "JavaScript performs numbers floating-point computation, meaning checking division limits requires caution. Use bit operations to perform quick integer casting.";
    }
    timeComplexity = 'O(log(N))';
    spaceComplexity = 'O(1)';
    testCases = [
      { input: '5', expected: '2' },
      { input: '15', expected: '4' },
      { input: '0', expected: '0' }
    ];
  }

  return {
    langName: currentLangName,
    youtubeVideoId,
    approach,
    code,
    recommendations,
    resources,
    notes,
    challengeDescription,
    editorBoilerplate,
    timeComplexity,
    spaceComplexity,
    testCases
  };
};
