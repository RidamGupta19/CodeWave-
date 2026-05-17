// Language-adapted DSA content helper
// Provides syntax-highlighted code examples, practice recommendations, resources, and roadmap notes
// adapted for C++, Java, Python, and JavaScript based on Take U Forward (Striver) series.

export const getDsaLanguageContent = (topicTitle, languageKey = 'cpp') => {
  const normalizedTitle = (topicTitle || '').toLowerCase();
  const lang = (languageKey || 'cpp').toLowerCase();

  // Map keys: 'cpp', 'java', 'python', 'js'
  const langNames = {
    cpp: 'C++',
    java: 'Java',
    python: 'Python',
    js: 'JavaScript'
  };

  const currentLangName = langNames[lang] || 'C++';

  // DEFAULT FALLBACKS
  let code = '';
  let recommendations = '';
  let resources = [];
  let notes = '';

  // 1. LEVEL 0: PROGRAMMING FOUNDATIONS
  if (normalizedTitle.includes('basics') || normalizedTitle.includes('foundation') || normalizedTitle.includes('math')) {
    if (lang === 'cpp') {
      code = `// C++ Fast I/O and Standard Template
#include <iostream>
using namespace std;

int main() {
    // Fast I/O
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
        { name: "GFG: Fast I/O in C++", url: "https://www.geeksforgeeks.org/fast-io-in-c/" },
        { name: "LeetCode: Practice C++ Basics", url: "https://leetcode.com/problemset/all/" }
      ];
      notes = "For CP/DSA, C++ is exceptionally fast, but standard streams `cin`/`cout` can be slow unless synced is disabled. Always use pre-increment (`++i`) instead of post-increment (`i++`) when possible for a minor performance bump.";
    } else if (lang === 'java') {
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
        { name: "GFG: Fast I/O in Java", url: "https://www.geeksforgeeks.org/fast-io-in-java-in-competitive-programming/" },
        { name: "LeetCode: Java Collections Guide", url: "https://leetcode.com/explore/learn/" }
      ];
      notes = "Keep garbage collection in mind. Avoid creating excessive short-lived objects inside hot loops. Use primitive types (`int`, `long`) instead of wrapper objects (`Integer`, `Long`) to save memory overhead.";
    } else if (lang === 'python') {
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
        { name: "GFG: Fast I/O in Python", url: "https://www.geeksforgeeks.org/input-and-output-in-python-competitive-programming/" },
        { name: "LeetCode: Python Basics Guide", url: "https://leetcode.com/problemset/all/" }
      ];
      notes = "Python is slower than C++ and Java, so optimizing built-ins is crucial. Use list comprehensions instead of standard loops. Avoid dynamic resizing of list inside deep loops if the size is known in advance.";
    } else {
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
        { name: "NodeJS Readline Documentation", url: "https://nodejs.org/api/readline.html" }
      ];
      notes = "JavaScript uses V8 engine optimization. Declare arrays with initial sizes if possible to avoid reallocation. Use binary bitwise operators carefully as all JS numbers are 64-bit floats.";
    }
  }

  // 2. LEVEL 1: ARRAYS EXPLORER
  else if (normalizedTitle.includes('array')) {
    if (lang === 'cpp') {
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
      recommendations = "Practice using `std::vector` for dynamic arrays and `std::unordered_map` (O(1) average lookup) instead of `std::map` (O(log n) tree lookup). Pass vectors by reference (`vector<int>& nums`) to avoid copying memory overhead.";
      resources = [
        { name: "Take U Forward: Arrays Series Playlist", url: "https://www.youtube.com/watch?v=37E9ckMDdTk&list=PLgUwDviBIf0rENwdL0nEH0uGom9no0nyB" },
        { name: "LeetCode: 2D Array / Matrix Problems", url: "https://leetcode.com/tag/array/" }
      ];
      notes = "For array challenges, watch out for integer overflow when calculating midpoints in binary search: use `low + (high - low) / 2` instead of `(low + high) / 2`.";
    } else if (lang === 'java') {
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
        { name: "Take U Forward: Java Array Roadmap", url: "https://takeuforward.org/data-structure/arrays-easy-problems/" },
        { name: "LeetCode: Array Practice Set", url: "https://leetcode.com/tag/array/" }
      ];
      notes = "Array indices are 32-bit signed integers. When sorting, Java's `Arrays.sort()` uses Dual-Pivot Quicksort for primitives (O(n log n) but O(n²) worst-case) and Timsort for objects.";
    } else if (lang === 'python') {
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
        { name: "Take U Forward: Arrays Video Lectures", url: "https://www.youtube.com/watch?v=37E9ckMDdTk&list=PLgUwDviBIf0rENwdL0nEH0uGom9no0nyB" },
        { name: "LeetCode: Python Arrays Practice", url: "https://leetcode.com/tag/array/" }
      ];
      notes = "Python lists are dynamic arrays. List indexing is fast, but adding/removing from the beginning of a list is O(n) due to shifting elements. Use `collections.deque` for O(1) start modifications.";
    } else {
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
  }

  // 3. LEVEL 2-3: HASHING & RECURSION
  else if (normalizedTitle.includes('hash') || normalizedTitle.includes('recursion') || normalizedTitle.includes('backtracking') || normalizedTitle.includes('subsequence')) {
    if (lang === 'cpp') {
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
        { name: "Take U Forward: Recursion Playlist", url: "https://www.youtube.com/watch?v=un6PybaEisA" },
        { name: "LeetCode: Backtracking Practice Problems", url: "https://leetcode.com/tag/backtracking/" }
      ];
      notes = "Watch out for deep recursion. The default stack limit on Windows/Linux is limited. Pass accumulators and collections by reference to conserve recursive stack frame memory.";
    } else if (lang === 'java') {
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
        { name: "Take U Forward: Striver's Hashing Sheet", url: "https://takeuforward.org/data-structure/hashing-basics-for-dsa/" },
        { name: "LeetCode: Backtracking Questions", url: "https://leetcode.com/tag/backtracking/" }
      ];
      notes = "Java allocates objects on the heap. Frequent allocations inside recursion (like creating new arrays) will trigger garbage collection, causing timing issues. Modify arrays in-place whenever possible.";
    } else if (lang === 'python') {
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
        { name: "Striver's Recursion Playlist (Take U Forward)", url: "https://www.youtube.com/watch?v=un6PybaEisA" },
        { name: "LeetCode: Python Backtracking Tag", url: "https://leetcode.com/tag/backtracking/" }
      ];
      notes = "Python's call stack is bounded at 1000 frames by default. When storing recursive results, make sure you append copies of arrays (`ans.append(path[:])`) rather than the original reference.";
    } else {
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
  }

  // 4. LEVEL 4-5: LINKED LIST, STACKS & QUEUES
  else if (normalizedTitle.includes('linked list') || normalizedTitle.includes('stack') || normalizedTitle.includes('queue') || normalizedTitle.includes('ll')) {
    if (lang === 'cpp') {
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
        { name: "Take U Forward: Linked Lists Tutorials", url: "https://www.youtube.com/watch?v=q8gipE-hy80" },
        { name: "LeetCode: Monotonic Stack Problems", url: "https://leetcode.com/tag/monotonic-stack/" }
      ];
      notes = "Avoid memory leaks. If you dynamically allocate nodes, ensure they are deallocated. In competitive setups, you don't need manual delete as the program terminates, but it is a vital industrial skill.";
    } else if (lang === 'java') {
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
        { name: "Take U Forward: LL Sheet", url: "https://takeuforward.org/data-structure/reverse-a-linked-list/" },
        { name: "LeetCode: Stack & Queue Tag", url: "https://leetcode.com/tag/stack/" }
      ];
      notes = "Java GC handles node cleanup. When dealing with stack and queue inputs, remember that `Stack` is thread-safe (synchronized), meaning `ArrayDeque` provides better raw single-threaded speed.";
    } else if (lang === 'python') {
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
        { name: "Take U Forward: Striver LL Guide", url: "https://www.youtube.com/watch?v=q8gipE-hy80" },
        { name: "LeetCode: Python Stacks/Queues", url: "https://leetcode.com/tag/stack/" }
      ];
      notes = "Watch out for cyclic references in node connections. Cyclic graphs inside structures can cause massive memory consumption in GC systems if not properly severed.";
    } else {
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
  }

  // 5. LEVEL 6-7: TREES & GRAPHS
  else if (normalizedTitle.includes('tree') || normalizedTitle.includes('graph') || normalizedTitle.includes('dfs') || normalizedTitle.includes('bfs') || normalizedTitle.includes('dijkstra') || normalizedTitle.includes('topo')) {
    if (lang === 'cpp') {
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
        { name: "Take U Forward: Tree Series Playlist", url: "https://www.youtube.com/watch?v=l_7V5uYI2G0" },
        { name: "Take U Forward: Graph Theory Playlist", url: "https://www.youtube.com/watch?v=M3_pLsDdeuU" }
      ];
      notes = "Tree and Graph logic is heavy on nested operations. Initialize visited arrays using `vector<int> vis(V, 0)` rather than map to maintain fast lookup. Make sure to define standard undirected edges correctly by inserting both pairs.";
    } else if (lang === 'java') {
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
        { name: "Take U Forward: Striver's Tree Sheet", url: "https://takeuforward.org/binary-tree/binary-tree-traversal/" },
        { name: "Take U Forward: Striver's Graph Sheet", url: "https://takeuforward.org/graph/graph-introduction/" }
      ];
      notes = "When building min-heaps/max-heaps using `PriorityQueue`, custom comparators are crucial: `PriorityQueue<Pair> pq = new PriorityQueue<>((a, b) -> a.dist - b.dist);` is extremely clean.";
    } else if (lang === 'python') {
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
        { name: "Take U Forward: Striver Graph Lectures", url: "https://www.youtube.com/watch?v=M3_pLsDdeuU" },
        { name: "LeetCode: Tree & Graph Tag", url: "https://leetcode.com/tag/graph/" }
      ];
      notes = "For recursion algorithms in deep graphs/trees (DFS/Postorder), always adjust Python recursion depth limits. For nodes representation, simple lists of lists are fast and compact.";
    } else {
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
        { name: "MDN: JavaScript TypedArray", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray" }
      ];
      notes = "Graph layers can grow quickly. Use `Uint8Array` or `Int32Array` for vis arrays to keep RAM footprints tight. Trees and graphs require pristine reference passing.";
    }
  }

  // 6. LEVEL 8: DYNAMIC PROGRAMMING
  else if (normalizedTitle.includes('dynamic programming') || normalizedTitle.includes('dp') || normalizedTitle.includes('knapsack') || normalizedTitle.includes('longest common')) {
    if (lang === 'cpp') {
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
        { name: "Take U Forward: Dynamic Programming Series", url: "https://www.youtube.com/watch?v=tyB0ztf0DNY" },
        { name: "LeetCode: Dynamic Programming Exercises", url: "https://leetcode.com/tag/dynamic-programming/" }
      ];
      notes = "For dynamic programming, always try: (1) Recursive Brute Force -> (2) Memoization (Top-down) -> (3) Tabulation (Bottom-up) -> (4) Space Optimization. C++ vectors can be initialized easily with defaults: `vector<int> dp(n, -1)`.";
    } else if (lang === 'java') {
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
        { name: "Take U Forward: Striver's DP Playlist", url: "https://takeuforward.org/dynamic-programming/striver-dp-series-dynamic-programming-problems/" },
        { name: "LeetCode: Dynamic Programming Category", url: "https://leetcode.com/tag/dynamic-programming/" }
      ];
      notes = "Java Virtual Machine optimization speeds up standard `for` loops. Dynamic allocation inside DP loops (like creating row arrays in each step) is bad practice. Declare single global tables or `prev` arrays.";
    } else if (lang === 'python') {
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
        { name: "Take U Forward: Striver DP Video Playlist", url: "https://www.youtube.com/watch?v=tyB0ztf0DNY" },
        { name: "LeetCode: Python DP Problems", url: "https://leetcode.com/tag/dynamic-programming/" }
      ];
      notes = "Python's function overhead is slightly heavy, so bottom-up tabulation is usually faster than recursive memoization. When writing backwards ranges, always verify the bounds carefully: `range(W, -1, -1)`.";
    } else {
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
      notes = "Avoid dynamic key lookups inside DP loops. Plain object hashing is slow, so 1D and 2D arrays are ideal. For memo keys, compound strings like `\`\${i},\${j}\`` are much slower than array indexes.";
    }
  }

  // 7. LEVEL 9-10: GREEDY & PLACEMENT SPECIAL
  else {
    if (lang === 'cpp') {
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
        { name: "Take U Forward: Greedy Playlist", url: "https://www.youtube.com/watch?v=n59vC9nJreU" },
        { name: "LeetCode: Greedy Tag Practice", url: "https://leetcode.com/tag/greedy/" }
      ];
      notes = "For custom sorts, your sorting comparator must enforce Strict Weak Ordering (return `false` if elements are equal), otherwise `std::sort` can trigger segmented faults.";
    } else if (lang === 'java') {
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
      recommendations = "Leverage Lambda comparators: `Arrays.sort(arr, (a, b) -> Double.compare(b.ratio, a.ratio))`. Avoid standard casting of double values inside division without explicit double conversion.";
      resources = [
        { name: "Take U Forward: Striver's Greedy Sheet", url: "https://takeuforward.org/greedy-algorithm/greedy-algorithm-introduction/" },
        { name: "LeetCode: Greedy Algorithms", url: "https://leetcode.com/tag/greedy/" }
      ];
      notes = "When solving placement challenges on trees and binary operations, utilize shift operations `1 << n` for power calculations. Java's `>>>` is an unsigned right-shift operator.";
    } else if (lang === 'python') {
      code = `# Fractional Knapsack Problem (Python)
class Item:
    def __init__(self, value, weight):
        self.value = value
        self.weight = weight

class Solution:
    def fractionalKnapsack(self, W: int, arr: list[Item], n: int) -> float:
        # Sort by value/weight ratio descending
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
      recommendations = "Use sorting lambda keys: `arr.sort(key=lambda x: x.ratio, reverse=True)` or `sorted()`. Utilize bit manipulations natively; Python integers have arbitrary precision.";
      resources = [
        { name: "Take U Forward: Greedy Striver Playlist", url: "https://www.youtube.com/watch?v=n59vC9nJreU" },
        { name: "LeetCode: Python Greedy Practice", url: "https://leetcode.com/tag/greedy/" }
      ];
      notes = "Python integers automatically scale up to infinite bounds, meaning you never have integer overflow in bitwise actions. Sorting is extremely fast via Timsort.";
    } else {
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
      recommendations = "Use standard JS `Array.prototype.sort()` but always supply a custom sorting callback: `arr.sort((a,b) => b.ratio - a.ratio)`. Without this, JS sorts alphabetically.";
      resources = [
        { name: "LeetCode: JS Greedy Challenges", url: "https://leetcode.com/tag/greedy/" }
      ];
      notes = "JavaScript performs numbers floating-point computation, meaning checking division limits requires caution. Use bit operations (`| 0`, `^`, `<<`) to perform quick integer casting.";
    }
  }

  return {
    langName: currentLangName,
    code,
    recommendations,
    resources,
    notes
  };
};
