// Greedy Explorer Checkpoint Data (3 Checkpoints)
export const getGreedyCheckpointContent = (checkpointId, lang = 'cpp') => {
  const language = (lang || 'cpp').toLowerCase() === 'js' ? 'javascript' : (lang || 'cpp').toLowerCase();

  const checkpoints = {
    greedy_cp1: {
      title: 'Lemonade Change',
      subtitle: 'Use a greedy strategy to count bills and decide if change can be provided.',
      videoEmbedUrl: 'https://www.youtube.com/embed/Fqd5aB8S624?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Lemonade Change',
          desc: 'Given an array of bills where bills[i] is 5, 10, or 20, return true if you can provide every customer with correct change, else false. Initial changes count is 0. Lemonade price is 5.',
          functionName: 'lemonadeChange',
          constraints: '1 <= bills.size() <= 10^5',
          testCases: [
            { input: '[5, 5, 5, 10, 20]', expected: 'true' },
            { input: '[5, 5, 10, 10, 20]', expected: 'false' }
          ],
          hints: ['Store counts of $5 and $10 bills.', 'For $10, check if you have a $5 bill.', 'For $20, greedily give one $10 and one $5 bill first, otherwise check if you have three $5 bills.'],
          bp: '#include <vector>\nusing namespace std;\n\nbool lemonadeChange(vector<int>& bills) {\n    // Write your code here\n    \n}',
          sol: 'bool lemonadeChange(vector<int>& bills) {\n    int five = 0, ten = 0;\n    for(int b : bills) {\n        if(b == 5) five++;\n        else if(b == 10) {\n            if(five == 0) return false;\n            five--; ten++;\n        } else {\n            if(ten > 0 && five > 0) { ten--; five--; }\n            else if(five >= 3) { five -= 3; }\n            else return false;\n        }\n    }\n    return true;\n}'
        },
        java: {
          title: 'Lemonade Change',
          desc: 'Decide if you can provide correct change to every customer buying lemonade for $5.',
          functionName: 'lemonadeChange',
          constraints: '1 <= bills.size() <= 10^5',
          testCases: [
            { input: 'java.util.Arrays.asList(5, 5, 5, 10, 20)', expected: 'true' },
            { input: 'java.util.Arrays.asList(5, 5, 10, 10, 20)', expected: 'false' }
          ],
          hints: ['Greedily exchange highest bills.'],
          bp: 'import java.util.List;\n\npublic class Solution {\n    public static boolean lemonadeChange(List<Integer> bills) {\n        // Write your code here\n        return false;\n    }\n}',
          sol: 'public static boolean lemonadeChange(List<Integer> bills) {\n    int five = 0, ten = 0;\n    for(int b : bills) {\n        if(b == 5) five++;\n        else if(b == 10) {\n            if(five == 0) return false;\n            five--; ten++;\n        } else {\n            if(ten > 0 && five > 0) { ten--; five--; }\n            else if(five >= 3) { five -= 3; }\n            else return false;\n        }\n    }\n    return true;\n}'
        },
        python: {
          title: 'Lemonade Change',
          desc: 'Decide if you can provide correct change to every customer buying lemonade for $5.',
          functionName: 'lemonade_change',
          constraints: '1 <= len(bills) <= 10^5',
          testCases: [
            { input: '[5, 5, 5, 10, 20]', expected: 'True' },
            { input: '[5, 5, 10, 10, 20]', expected: 'False' }
          ],
          hints: ['Keep counts of 5s and 10s.'],
          bp: 'def lemonade_change(bills: list) -> bool:\n    # Write your code here\n    pass',
          sol: 'def lemonade_change(bills):\n    five = ten = 0\n    for b in bills:\n        if b == 5: five += 1\n        elif b == 10:\n            if not five: return False\n            five -= 1; ten += 1\n        else:\n            if ten > 0 and five > 0:\n                ten -= 1; five -= 1\n            elif five >= 3:\n                five -= 3\n            else: return False\n    return True'
        },
        javascript: {
          title: 'Lemonade Change',
          desc: 'Decide if you can provide correct change to every customer buying lemonade for $5.',
          functionName: 'lemonadeChange',
          constraints: '1 <= bills.length <= 10^5',
          testCases: [
            { input: '[5, 5, 5, 10, 20]', expected: 'true' },
            { input: '[5, 5, 10, 10, 20]', expected: 'false' }
          ],
          hints: ['Apply greedy change logic.'],
          bp: 'function lemonadeChange(bills) {\n    // Write your code here\n    \n}',
          sol: 'function lemonadeChange(bills) {\n    let five = 0, ten = 0;\n    for(let b of bills) {\n        if(b === 5) five++;\n        else if(b === 10) {\n            if(five === 0) return false;\n            five--; ten++;\n        } else {\n            if(ten > 0 && five > 0) { ten--; five--; }\n            else if(five >= 3) { five -= 3; }\n            else return false;\n        }\n    }\n    return true;\n}'
        }
      }
    },
    greedy_cp2: {
      title: 'Assign Cookies',
      subtitle: 'Greedily satisfy maximum children matching cookie sizes.',
      videoEmbedUrl: 'https://www.youtube.com/embed/HZOUwK5El5U?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Assign Cookies',
          desc: 'Given g (greed factors) and s (cookie sizes), return the maximum number of children you can satisfy.',
          functionName: 'findContentChildren',
          constraints: '1 <= g.size(), s.size() <= 10^4',
          testCases: [
            { input: '[1, 2, 3], [1, 1]', expected: '1' },
            { input: '[1, 2], [1, 2, 3]', expected: '2' }
          ],
          hints: ['Sort both arrays first.', 'Use two pointers to allocate the smallest cookie that satisfies each child.'],
          bp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint findContentChildren(vector<int>& g, vector<int>& s) {\n    // Write your code here\n    \n}',
          sol: '#include <algorithm>\nint findContentChildren(vector<int>& g, vector<int>& s) {\n    sort(g.begin(), g.end());\n    sort(s.begin(), s.end());\n    int i = 0, j = 0;\n    while(i < g.size() && j < s.size()) {\n        if(s[j] >= g[i]) i++;\n        j++;\n    }\n    return i;\n}'
        },
        java: {
          title: 'Assign Cookies',
          desc: 'Return the maximum number of children you can satisfy with cookie sizes.',
          functionName: 'findContentChildren',
          constraints: '1 <= g.size(), s.size() <= 10^4',
          testCases: [
            { input: 'java.util.Arrays.asList(1, 2, 3), java.util.Arrays.asList(1, 1)', expected: '1' },
            { input: 'java.util.Arrays.asList(1, 2), java.util.Arrays.asList(1, 2, 3)', expected: '2' }
          ],
          hints: ['Sort using java.util.Collections.sort().'],
          bp: 'import java.util.List;\nimport java.util.Collections;\n\npublic class Solution {\n    public static int findContentChildren(List<Integer> g, List<Integer> s) {\n        // Write your code here\n        return 0;\n    }\n}',
          sol: 'public static int findContentChildren(List<Integer> g, List<Integer> s) {\n    java.util.Collections.sort(g);\n    java.util.Collections.sort(s);\n    int i = 0, j = 0;\n    while(i < g.size() && j < s.size()) {\n        if(s.get(j) >= g.get(i)) i++;\n        j++;\n    }\n    return i;\n}'
        },
        python: {
          title: 'Assign Cookies',
          desc: 'Return the maximum number of children you can satisfy.',
          functionName: 'find_content_children',
          constraints: '1 <= len(g), len(s) <= 10^4',
          testCases: [
            { input: '[1, 2, 3], [1, 1]', expected: '1' },
            { input: '[1, 2], [1, 2, 3]', expected: '2' }
          ],
          hints: ['Sort lists and run two-pointer match.'],
          bp: 'def find_content_children(g: list, s: list) -> int:\n    # Write your code here\n    pass',
          sol: 'def find_content_children(g, s):\n    g.sort(); s.sort()\n    i = j = 0\n    while i < len(g) and j < len(s):\n        if s[j] >= g[i]: i += 1\n        j += 1\n    return i'
        },
        javascript: {
          title: 'Assign Cookies',
          desc: 'Return the maximum number of children you can satisfy.',
          functionName: 'findContentChildren',
          constraints: '1 <= g.length, s.length <= 10^4',
          testCases: [
            { input: '[1, 2, 3], [1, 1]', expected: '1' },
            { input: '[1, 2], [1, 2, 3]', expected: '2' }
          ],
          hints: ['Sort array using standard numeric sorting comparator.'],
          bp: 'function findContentChildren(g, s) {\n    // Write your code here\n    \n}',
          sol: 'function findContentChildren(g, s) {\n    g.sort((x, y) => x - y);\n    s.sort((x, y) => x - y);\n    let i = 0, j = 0;\n    while(i < g.length && j < s.length) {\n        if(s[j] >= g[i]) i++;\n        j++;\n    }\n    return i;\n}'
        }
      }
    },
    greedy_cp3: {
      title: 'Fractional Knapsack',
      subtitle: 'Greedily sort items by density value to maximize total value.',
      videoEmbedUrl: 'https://www.youtube.com/embed/n59vC9nJreU?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Fractional Knapsack',
          desc: 'Given capacity W, values val, and weights wt, maximize knapsack value by taking fractions of items if needed. Return value rounded to 2 decimal places.',
          functionName: 'maxKnapsackValue',
          constraints: '1 <= W <= 10^4',
          testCases: [
            { input: '50, [60, 100, 120], [10, 20, 30]', expected: '240' },
            { input: '10, [500], [30]', expected: '166.67' }
          ],
          hints: ['Calculate value/weight ratio for each item.', 'Sort items descending by ratio.', 'Greedily add full items, then take fractional part of last item.'],
          bp: '#include <vector>\n#include <algorithm>\n#include <cmath>\nusing namespace std;\n\ndouble maxKnapsackValue(int W, vector<int>& val, vector<int>& wt) {\n    // Write your code here\n    \n}',
          sol: '#include <algorithm>\n#include <cmath>\nstruct Item { int val, wt; double ratio; };\nbool comp(Item a, Item b) { return a.ratio > b.ratio; }\ndouble maxKnapsackValue(int W, vector<int>& val, vector<int>& wt) {\n    int n = val.size();\n    vector<Item> items(n);\n    for(int i = 0; i < n; i++) {\n        items[i] = { val[i], wt[i], (double)val[i] / wt[i] };\n    }\n    sort(items.begin(), items.end(), comp);\n    double ans = 0.0;\n    int currW = 0;\n    for(int i = 0; i < n; i++) {\n        if(currW + items[i].wt <= W) {\n            currW += items[i].wt;\n            ans += items[i].val;\n        } else {\n            int rem = W - currW;\n            ans += items[i].ratio * rem;\n            break;\n        }\n    }\n    return round(ans * 100.0) / 100.0;\n}'
        },
        java: {
          title: 'Fractional Knapsack',
          desc: 'Maximize total value inside fractional knapsack with capacity W.',
          functionName: 'maxKnapsackValue',
          constraints: '1 <= W <= 10^4',
          testCases: [
            { input: '50, java.util.Arrays.asList(60, 100, 120), java.util.Arrays.asList(10, 20, 30)', expected: '240.0' },
            { input: '10, java.util.Arrays.asList(500), java.util.Arrays.asList(30)', expected: '166.67' }
          ],
          hints: ['Define a class for sorting items by ratio.'],
          bp: 'import java.util.List;\nimport java.util.Collections;\nimport java.util.ArrayList;\n\npublic class Solution {\n    public static double maxKnapsackValue(int W, List<Integer> val, List<Integer> wt) {\n        // Write your code here\n        return 0.0;\n    }\n}',
          sol: 'static class Item implements Comparable<Item> {\n    int val, wt; double ratio;\n    Item(int v, int w) { val = v; wt = w; ratio = (double)v/w; }\n    public int compareTo(Item other) { return Double.compare(other.ratio, this.ratio); }\n}\npublic static double maxKnapsackValue(int W, java.util.List<Integer> val, java.util.List<Integer> wt) {\n    int n = val.size();\n    java.util.List<Item> items = new java.util.ArrayList<>();\n    for(int i = 0; i < n; i++) items.add(new Item(val.get(i), wt.get(i)));\n    java.util.Collections.sort(items);\n    double ans = 0.0;\n    int currW = 0;\n    for(Item item : items) {\n        if(currW + item.wt <= W) {\n            currW += item.wt;\n            ans += item.val;\n        } else {\n            int rem = W - currW;\n            ans += item.ratio * rem;\n            break;\n        }\n    }\n    return Math.round(ans * 100.0) / 100.0;\n}'
        },
        python: {
          title: 'Fractional Knapsack',
          desc: 'Maximize total value inside fractional knapsack with capacity W.',
          functionName: 'max_knapsack_value',
          constraints: '1 <= W <= 10^4',
          testCases: [
            { input: '50, [60, 100, 120], [10, 20, 30]', expected: '240.0' },
            { input: '10, [500], [30]', expected: '166.67' }
          ],
          hints: ['Sort indices or objects based on val/wt.'],
          bp: 'def max_knapsack_value(W: int, val: list, wt: list) -> float:\n    # Write your code here\n    pass',
          sol: 'def max_knapsack_value(W, val, wt):\n    items = []\n    for i in range(len(val)):\n        items.append((val[i], wt[i], val[i]/wt[i]))\n    items.sort(key=lambda x: x[2], reverse=True)\n    ans = 0.0\n    currW = 0\n    for v, w, ratio in items:\n        if currW + w <= W:\n            currW += w\n            ans += v\n        else:\n            rem = W - currW\n            ans += ratio * rem\n            break\n    return round(ans, 2)'
        },
        javascript: {
          title: 'Fractional Knapsack',
          desc: 'Maximize total value inside fractional knapsack with capacity W.',
          functionName: 'maxKnapsackValue',
          constraints: '1 <= W <= 10^4',
          testCases: [
            { input: '50, [60, 100, 120], [10, 20, 30]', expected: '240' },
            { input: '10, [500], [30]', expected: '166.67' }
          ],
          hints: ['Sort elements mapping items array descending.'],
          bp: 'function maxKnapsackValue(W, val, wt) {\n    // Write your code here\n    \n}',
          sol: 'function maxKnapsackValue(W, val, wt) {\n    let items = [];\n    for(let i = 0; i < val.length; i++) {\n        items.push({ val: val[i], wt: wt[i], ratio: val[i]/wt[i] });\n    }\n    items.sort((x, y) => y.ratio - x.ratio);\n    let ans = 0.0;\n    let currW = 0;\n    for(let item of items) {\n        if(currW + item.wt <= W) {\n            currW += item.wt;\n            ans += item.val;\n        } else {\n            let rem = W - currW;\n            ans += item.ratio * rem;\n            break;\n        }\n    }\n    return Math.round(ans * 100) / 100;\n}'
        }
      }
    }
  };

  const cp = checkpoints[checkpointId];
  if (!cp) return null;

  const langChallenge = cp.challenges[language] || cp.challenges.cpp;
  const isLastCheckpoint = checkpointId === 'greedy_cp3';

  return {
    title: cp.title,
    subtitle: cp.subtitle,
    videoEmbedUrl: cp.videoEmbedUrl,
    challengeTitle: langChallenge.title,
    challengeDescription: langChallenge.desc,
    approach: langChallenge.approach || '',
    code: langChallenge.sol || '',
    editorBoilerplate: langChallenge.bp || '',
    testCases: langChallenge.testCases,
    functionName: langChallenge.functionName,
    hints: langChallenge.hints,
    constraints: langChallenge.constraints,
    hasVideo: true,
    isLastCheckpoint
  };
};
