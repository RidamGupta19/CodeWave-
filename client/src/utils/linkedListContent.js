// Linked List Explorer Checkpoint Data (3 Checkpoints)
export const getLinkedListCheckpointContent = (checkpointId, lang = 'cpp') => {
  const language = (lang || 'cpp').toLowerCase() === 'js' ? 'javascript' : (lang || 'cpp').toLowerCase();

  const checkpoints = {
    ll_cp1: {
      title: 'Linked List Length',
      subtitle: 'Find the total number of nodes in a singly linked list.',
      videoEmbedUrl: 'https://www.youtube.com/embed/cg6JGiXhQ9c?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Find Length',
          desc: 'Given the head of a singly linked list, return the total count of nodes.',
          functionName: 'getLength',
          constraints: '0 <= number of nodes <= 10^4',
          testCases: [
            { input: 'createList([1, 2, 3, 4])', expected: '4' },
            { input: 'createList([10])', expected: '1' }
          ],
          hints: ['Initialize a count to 0 and a current pointer to head.', 'Traverse the list: current = current->next, increment count.', 'Return the count.'],
          bp: '/**\n * struct ListNode {\n *     int val;\n *     ListNode* next;\n * };\n */\nint getLength(ListNode* head) {\n    // Write your code here\n    \n}',
          sol: 'int getLength(ListNode* head) {\n    int cnt = 0;\n    ListNode* curr = head;\n    while(curr != nullptr) {\n        cnt++;\n        curr = curr->next;\n    }\n    return cnt;\n}'
        },
        java: {
          title: 'Find Length',
          desc: 'Given the head of a singly linked list, return the total count of nodes.',
          functionName: 'getLength',
          constraints: '0 <= number of nodes <= 10^4',
          testCases: [
            { input: 'createList(java.util.Arrays.asList(1, 2, 3, 4))', expected: '4' },
            { input: 'createList(java.util.Arrays.asList(10))', expected: '1' }
          ],
          hints: ['Traverse the list node by node.'],
          bp: '/**\n * class ListNode {\n *     int val;\n *     ListNode next;\n * }\n */\npublic class Solution {\n    public static int getLength(ListNode head) {\n        // Write your code here\n        return 0;\n    }\n}',
          sol: 'public static int getLength(ListNode head) {\n    int cnt = 0;\n    ListNode curr = head;\n    while(curr != null) {\n        cnt++;\n        curr = curr.next;\n    }\n    return cnt;\n}'
        },
        python: {
          title: 'Find Length',
          desc: 'Given the head of a singly linked list, return the total count of nodes.',
          functionName: 'get_length',
          constraints: '0 <= number of nodes <= 10^4',
          testCases: [
            { input: 'createList([1, 2, 3, 4])', expected: '4' },
            { input: 'createList([10])', expected: '1' }
          ],
          hints: ['Iterate through head until node is None.'],
          bp: '# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\ndef get_length(head) -> int:\n    # Write your code here\n    pass',
          sol: 'def get_length(head):\n    cnt = 0\n    curr = head\n    while curr:\n        cnt += 1\n        curr = curr.next\n    return cnt'
        },
        javascript: {
          title: 'Find Length',
          desc: 'Given the head of a singly linked list, return the total count of nodes.',
          functionName: 'getLength',
          constraints: '0 <= number of nodes <= 10^4',
          testCases: [
            { input: 'createList([1, 2, 3, 4])', expected: '4' },
            { input: 'createList([10])', expected: '1' }
          ],
          hints: ['Loop while head is not null.'],
          bp: '/*\n * class ListNode {\n *     constructor(val, next = null) {\n *         this.val = val;\n *         this.next = next;\n *     }\n * }\n */\nfunction getLength(head) {\n    // Write your code here\n    \n}',
          sol: 'function getLength(head) {\n    let cnt = 0;\n    let curr = head;\n    while(curr) {\n        cnt++;\n        curr = curr.next;\n    }\n    return cnt;\n}'
        }
      }
    },
    ll_cp2: {
      title: 'Find Middle Value',
      subtitle: 'Identify the value of the middle node of the linked list in one pass.',
      videoEmbedUrl: 'https://www.youtube.com/embed/83bB4P0L6W4?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Get Middle Value',
          desc: 'Given the head of a singly linked list, return the value of the middle node. If even, return the second middle node.',
          functionName: 'getMiddleVal',
          constraints: '1 <= number of nodes <= 10^4',
          testCases: [
            { input: 'createList([1, 2, 3, 4, 5])', expected: '3' },
            { input: 'createList([10, 20])', expected: '20' }
          ],
          hints: ['Use tortoise and hare approach (slow and fast pointers).', 'When fast reaches the end, slow will be at the middle.'],
          bp: 'int getMiddleVal(ListNode* head) {\n    // Write your code here\n    \n}',
          sol: 'int getMiddleVal(ListNode* head) {\n    ListNode* slow = head;\n    ListNode* fast = head;\n    while(fast != nullptr && fast->next != nullptr) {\n        slow = slow->next;\n        fast = fast->next->next;\n    }\n    return slow->val;\n}'
        },
        java: {
          title: 'Get Middle Value',
          desc: 'Given the head of a singly linked list, return the value of the middle node.',
          functionName: 'getMiddleVal',
          constraints: '1 <= number of nodes <= 10^4',
          testCases: [
            { input: 'createList(java.util.Arrays.asList(1, 2, 3, 4, 5))', expected: '3' },
            { input: 'createList(java.util.Arrays.asList(10, 20))', expected: '20' }
          ],
          hints: ['Use slow and fast pointers.'],
          bp: 'public class Solution {\n    public static int getMiddleVal(ListNode head) {\n        // Write your code here\n        return 0;\n    }\n}',
          sol: 'public static int getMiddleVal(ListNode head) {\n    ListNode slow = head;\n    ListNode fast = head;\n    while(fast != null && fast.next != null) {\n        slow = slow.next;\n        fast = fast.next.next;\n    }\n    return slow.val;\n}'
        },
        python: {
          title: 'Get Middle Value',
          desc: 'Given the head of a singly linked list, return the value of the middle node.',
          functionName: 'get_middle_val',
          constraints: '1 <= len(list) <= 10^4',
          testCases: [
            { input: 'createList([1, 2, 3, 4, 5])', expected: '3' },
            { input: 'createList([10, 20])', expected: '20' }
          ],
          hints: ['Set slow and fast pointers.'],
          bp: 'def get_middle_val(head) -> int:\n    # Write your code here\n    pass',
          sol: 'def get_middle_val(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n    return slow.val'
        },
        javascript: {
          title: 'Get Middle Value',
          desc: 'Given the head of a singly linked list, return the value of the middle node.',
          functionName: 'getMiddleVal',
          constraints: '1 <= len(list) <= 10^4',
          testCases: [
            { input: 'createList([1, 2, 3, 4, 5])', expected: '3' },
            { input: 'createList([10, 20])', expected: '20' }
          ],
          hints: ['Move fast twice as fast as slow.'],
          bp: 'function getMiddleVal(head) {\n    // Write your code here\n    \n}',
          sol: 'function getMiddleVal(head) {\n    let slow = head;\n    let fast = head;\n    while(fast && fast.next) {\n        slow = slow.next;\n        fast = fast.next.next;\n    }\n    return slow.val;\n}'
        }
      }
    },
    ll_cp3: {
      title: 'Search List',
      subtitle: 'Determine if a specific element exists in the linked list.',
      videoEmbedUrl: 'https://www.youtube.com/embed/MRe4UsRad5k?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Search List',
          desc: 'Given the head of a singly linked list and a target value, return 1 if the target exists in the list, else 0.',
          functionName: 'searchList',
          constraints: '1 <= number of nodes <= 10^4',
          testCases: [
            { input: 'createList([1, 2, 3, 4]), 3', expected: '1' },
            { input: 'createList([10, 20]), 5', expected: '0' }
          ],
          hints: ['Traverse the list from head.', 'If current node value matches target, return 1.', 'If traversal finishes, return 0.'],
          bp: 'int searchList(ListNode* head, int target) {\n    // Write your code here\n    \n}',
          sol: 'int searchList(ListNode* head, int target) {\n    ListNode* curr = head;\n    while(curr != nullptr) {\n        if(curr->val == target) return 1;\n        curr = curr->next;\n    }\n    return 0;\n}'
        },
        java: {
          title: 'Search List',
          desc: 'Given the head of a singly linked list and a target value, return 1 if the target exists, else 0.',
          functionName: 'searchList',
          constraints: '1 <= number of nodes <= 10^4',
          testCases: [
            { input: 'createList(java.util.Arrays.asList(1, 2, 3, 4)), 3', expected: '1' },
            { input: 'createList(java.util.Arrays.asList(10, 20)), 5', expected: '0' }
          ],
          hints: ['Iterate and match node.val.'],
          bp: 'public class Solution {\n    public static int searchList(ListNode head, int target) {\n        // Write your code here\n        return 0;\n    }\n}',
          sol: 'public static int searchList(ListNode head, int target) {\n    ListNode curr = head;\n    while(curr != null) {\n        if(curr.val == target) return 1;\n        curr = curr.next;\n    }\n    return 0;\n}'
        },
        python: {
          title: 'Search List',
          desc: 'Given the head of a singly linked list and a target value, return 1 if target exists, else 0.',
          functionName: 'search_list',
          constraints: '1 <= len(list) <= 10^4',
          testCases: [
            { input: 'createList([1, 2, 3, 4]), 3', expected: '1' },
            { input: 'createList([10, 20]), 5', expected: '0' }
          ],
          hints: ['Traverse checking node.val == target.'],
          bp: 'def search_list(head, target: int) -> int:\n    # Write your code here\n    pass',
          sol: 'def search_list(head, target):\n    curr = head\n    while curr:\n        if curr.val == target: return 1\n        curr = curr.next\n    return 0'
        },
        javascript: {
          title: 'Search List',
          desc: 'Given the head of a singly linked list and a target value, return 1 if target exists, else 0.',
          functionName: 'searchList',
          constraints: '1 <= len(list) <= 10^4',
          testCases: [
            { input: 'createList([1, 2, 3, 4]), 3', expected: '1' },
            { input: 'createList([10, 20]), 5', expected: '0' }
          ],
          hints: ['Walk list and compare values.'],
          bp: 'function searchList(head, target) {\n    // Write your code here\n    \n}',
          sol: 'function searchList(head, target) {\n    let curr = head;\n    while(curr) {\n        if(curr.val === target) return 1;\n        curr = curr.next;\n    }\n    return 0;\n}'
        }
      }
    }
  };

  const cp = checkpoints[checkpointId];
  if (!cp) return null;

  const langChallenge = cp.challenges[language] || cp.challenges.cpp;
  const isLastCheckpoint = checkpointId === 'll_cp3';

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
