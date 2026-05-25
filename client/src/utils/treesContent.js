// Trees Explorer Checkpoint Data (3 Checkpoints)
export const getTreesCheckpointContent = (checkpointId, lang = 'cpp') => {
  const language = (lang || 'cpp').toLowerCase() === 'js' ? 'javascript' : (lang || 'cpp').toLowerCase();

  const checkpoints = {
    tree_cp1: {
      title: 'Tree Node Sum',
      subtitle: 'Perform a depth-first traversal to sum all values in a binary tree.',
      videoEmbedUrl: 'https://www.youtube.com/embed/OYqYEM1bMK8?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Sum Node Values',
          desc: 'Given the root of a binary tree, return the sum of all node values.',
          functionName: 'sumTree',
          constraints: '0 <= number of nodes <= 10^4',
          testCases: [
            { input: 'createTree([1, 2, 3])', expected: '6' },
            { input: 'createTree([10, null, 20])', expected: '30' }
          ],
          hints: ['If root is null, return 0.', 'Otherwise, return root->val + sumTree(root->left) + sumTree(root->right).'],
          bp: '/**\n * struct TreeNode {\n *     int val;\n *     TreeNode* left;\n *     TreeNode* right;\n * };\n */\nint sumTree(TreeNode* root) {\n    // Write your code here\n    \n}',
          sol: 'int sumTree(TreeNode* root) {\n    if(root == nullptr) return 0;\n    return root->val + sumTree(root->left) + sumTree(root->right);\n}'
        },
        java: {
          title: 'Sum Node Values',
          desc: 'Given the root of a binary tree, return the sum of all node values.',
          functionName: 'sumTree',
          constraints: '0 <= number of nodes <= 10^4',
          testCases: [
            { input: 'createTree(java.util.Arrays.asList(1, 2, 3))', expected: '6' },
            { input: 'createTree(java.util.Arrays.asList(10, null, 20))', expected: '30' }
          ],
          hints: ['Sum the current node value and recurse on children.'],
          bp: '/**\n * class TreeNode {\n *     int val;\n *     TreeNode left;\n *     TreeNode right;\n * }\n */\npublic class Solution {\n    public static int sumTree(TreeNode root) {\n        // Write your code here\n        return 0;\n    }\n}',
          sol: 'public static int sumTree(TreeNode root) {\n    if(root == null) return 0;\n    return root.val + sumTree(root.left) + sumTree(root.right);\n}'
        },
        python: {
          title: 'Sum Node Values',
          desc: 'Given the root of a binary tree, return the sum of all node values.',
          functionName: 'sum_tree',
          constraints: '0 <= number of nodes <= 10^4',
          testCases: [
            { input: 'createTree([1, 2, 3])', expected: '6' },
            { input: 'createTree([10, None, 20])', expected: '30' }
          ],
          hints: ['Sum root.val and child sums recursively.'],
          bp: '# class TreeNode:\n#     def __init__(self, val=0, left=None, right=None):\n#         self.val = val\n#         self.left = left\n#         self.right = right\ndef sum_tree(root) -> int:\n    # Write your code here\n    pass',
          sol: 'def sum_tree(root):\n    if not root: return 0\n    return root.val + sum_tree(root.left) + sum_tree(root.right)'
        },
        javascript: {
          title: 'Sum Node Values',
          desc: 'Given the root of a binary tree, return the sum of all node values.',
          functionName: 'sumTree',
          constraints: '0 <= number of nodes <= 10^4',
          testCases: [
            { input: 'createTree([1, 2, 3])', expected: '6' },
            { input: 'createTree([10, null, 20])', expected: '30' }
          ],
          hints: ['Evaluate base condition then recurse.'],
          bp: '/*\n * class TreeNode {\n *     constructor(val, left = null, right = null) {\n *         this.val = val;\n *         this.left = left;\n *         this.right = right;\n *     }\n * }\n */\nfunction sumTree(root) {\n    // Write your code here\n    \n}',
          sol: 'function sumTree(root) {\n    if(!root) return 0;\n    return root.val + sumTree(root.left) + sumTree(root.right);\n}'
        }
      }
    },
    tree_cp2: {
      title: 'Max Depth',
      subtitle: 'Calculate the maximum height/depth of the binary tree recursively.',
      videoEmbedUrl: 'https://www.youtube.com/embed/eD4w3H1n8u4?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Maximum Depth',
          desc: 'Given the root of a binary tree, return its maximum depth. The maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.',
          functionName: 'maxDepth',
          constraints: '0 <= number of nodes <= 10^4',
          testCases: [
            { input: 'createTree([3, 9, 20, null, null, 15, 7])', expected: '3' },
            { input: 'createTree([1, null, 2])', expected: '2' }
          ],
          hints: ['If root is null, return 0.', 'Otherwise, return 1 + max(maxDepth(root->left), maxDepth(root->right)).'],
          bp: 'int maxDepth(TreeNode* root) {\n    // Write your code here\n    \n}',
          sol: '#include <algorithm>\nint maxDepth(TreeNode* root) {\n    if(root == nullptr) return 0;\n    return 1 + std::max(maxDepth(root->left), maxDepth(root->right));\n}'
        },
        java: {
          title: 'Maximum Depth',
          desc: 'Given the root of a binary tree, return its maximum depth.',
          functionName: 'maxDepth',
          constraints: '0 <= number of nodes <= 10^4',
          testCases: [
            { input: 'createTree(java.util.Arrays.asList(3, 9, 20, null, null, 15, 7))', expected: '3' },
            { input: 'createTree(java.util.Arrays.asList(1, null, 2))', expected: '2' }
          ],
          hints: ['Use Math.max to compare depths.'],
          bp: 'public class Solution {\n    public static int maxDepth(TreeNode root) {\n        // Write your code here\n        return 0;\n    }\n}',
          sol: 'public static int maxDepth(TreeNode root) {\n    if(root == null) return 0;\n    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n}'
        },
        python: {
          title: 'Maximum Depth',
          desc: 'Given the root of a binary tree, return its maximum depth.',
          functionName: 'max_depth',
          constraints: '0 <= number of nodes <= 10^4',
          testCases: [
            { input: 'createTree([3, 9, 20, None, None, 15, 7])', expected: '3' },
            { input: 'createTree([1, None, 2])', expected: '2' }
          ],
          hints: ['Return 1 + max of left and right child depth.'],
          bp: 'def max_depth(root) -> int:\n    # Write your code here\n    pass',
          sol: 'def max_depth(root):\n    if not root: return 0\n    return 1 + max(max_depth(root.left), max_depth(root.right))'
        },
        javascript: {
          title: 'Maximum Depth',
          desc: 'Given the root of a binary tree, return its maximum depth.',
          functionName: 'maxDepth',
          constraints: '0 <= number of nodes <= 10^4',
          testCases: [
            { input: 'createTree([3, 9, 20, null, null, 15, 7])', expected: '3' },
            { input: 'createTree([1, null, 2])', expected: '2' }
          ],
          hints: ['Use Math.max recursion.'],
          bp: 'function maxDepth(root) {\n    // Write your code here\n    \n}',
          sol: 'function maxDepth(root) {\n    if(!root) return 0;\n    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n}'
        }
      }
    },
    tree_cp3: {
      title: 'Leaf Node Count',
      subtitle: 'Identify and count leaf nodes (nodes without children) in a binary tree.',
      videoEmbedUrl: 'https://www.youtube.com/embed/x1C0nU2sP9Y?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Count Leaf Nodes',
          desc: 'Given the root of a binary tree, return the count of all leaf nodes.',
          functionName: 'countLeaves',
          constraints: '0 <= number of nodes <= 10^4',
          testCases: [
            { input: 'createTree([1, 2, 3, null, null, 4, 5])', expected: '3' },
            { input: 'createTree([10])', expected: '1' }
          ],
          hints: ['If root is null, return 0.', 'If both left and right children are null, it is a leaf node, return 1.', 'Otherwise, return countLeaves(left) + countLeaves(right).'],
          bp: 'int countLeaves(TreeNode* root) {\n    // Write your code here\n    \n}',
          sol: 'int countLeaves(TreeNode* root) {\n    if(root == nullptr) return 0;\n    if(root->left == nullptr && root->right == nullptr) return 1;\n    return countLeaves(root->left) + countLeaves(root->right);\n}'
        },
        java: {
          title: 'Count Leaf Nodes',
          desc: 'Given the root of a binary tree, return the count of all leaf nodes.',
          functionName: 'countLeaves',
          constraints: '0 <= number of nodes <= 10^4',
          testCases: [
            { input: 'createTree(java.util.Arrays.asList(1, 2, 3, null, null, 4, 5))', expected: '3' },
            { input: 'createTree(java.util.Arrays.asList(10))', expected: '1' }
          ],
          hints: ['Accumulate leaf counts recursively.'],
          bp: 'public class Solution {\n    public static int countLeaves(TreeNode root) {\n        // Write your code here\n        return 0;\n    }\n}',
          sol: 'public static int countLeaves(TreeNode root) {\n    if(root == null) return 0;\n    if(root.left == null && root.right == null) return 1;\n    return countLeaves(root.left) + countLeaves(root.right);\n}'
        },
        python: {
          title: 'Count Leaf Nodes',
          desc: 'Given the root of a binary tree, return the count of all leaf nodes.',
          functionName: 'count_leaves',
          constraints: '0 <= number of nodes <= 10^4',
          testCases: [
            { input: 'createTree([1, 2, 3, None, None, 4, 5])', expected: '3' },
            { input: 'createTree([10])', expected: '1' }
          ],
          hints: ['Check if left and right are None.'],
          bp: 'def count_leaves(root) -> int:\n    # Write your code here\n    pass',
          sol: 'def count_leaves(root):\n    if not root: return 0\n    if not root.left and not root.right: return 1\n    return count_leaves(root.left) + count_leaves(root.right)'
        },
        javascript: {
          title: 'Count Leaf Nodes',
          desc: 'Given the root of a binary tree, return the count of all leaf nodes.',
          functionName: 'countLeaves',
          constraints: '0 <= number of nodes <= 10^4',
          testCases: [
            { input: 'createTree([1, 2, 3, null, null, 4, 5])', expected: '3' },
            { input: 'createTree([10])', expected: '1' }
          ],
          hints: ['Match left === null && right === null.'],
          bp: 'function countLeaves(root) {\n    // Write your code here\n    \n}',
          sol: 'function countLeaves(root) {\n    if(!root) return 0;\n    if(!root.left && !root.right) return 1;\n    return countLeaves(root.left) + countLeaves(root.right);\n}'
        }
      }
    }
  };

  const cp = checkpoints[checkpointId];
  if (!cp) return null;

  const langChallenge = cp.challenges[language] || cp.challenges.cpp;
  const isLastCheckpoint = checkpointId === 'tree_cp3';

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
