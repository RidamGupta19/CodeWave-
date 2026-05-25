// Hashing Explorer Checkpoint Data
export const getHashingCheckpointContent = (checkpointId, lang = 'cpp') => {
  const language = (lang || 'cpp').toLowerCase() === 'js' ? 'javascript' : (lang || 'cpp').toLowerCase();

  const checkpoints = {
    hash_cp1: {
      title: 'Hashing Introduction',
      subtitle: 'Understand the basics of Hashing, HashMaps, and unordered maps.',
      videoEmbedUrl: 'https://www.youtube.com/embed/KEs5UyBJ39g?rel=0&modestbranding=1',
      challenges: {
        cpp: { title: 'Implement Concept', desc: 'Sandbox for Hashing', functionName: 'solve', testCases: [{input: '"test"', expected: '1'}], bp: 'int solve() { return 1; }', sol: 'int solve() { return 1; }', hints: [] },
        java: { title: 'Implement Concept', desc: 'Sandbox for Hashing', functionName: 'solve', testCases: [{input: '"test"', expected: '1'}], bp: 'public class Solution { public static int solve() { return 1; } }', sol: 'public static int solve() { return 1; }', hints: [] },
        python: { title: 'Implement Concept', desc: 'Sandbox for Hashing', functionName: 'solve', testCases: [{input: '"test"', expected: '1'}], bp: 'def solve(): return 1', sol: 'def solve(): return 1', hints: [] },
        javascript: { title: 'Implement Concept', desc: 'Sandbox for Hashing', functionName: 'solve', testCases: [{input: '"test"', expected: '1'}], bp: 'function solve() { return 1; }', sol: 'function solve() { return 1; }', hints: [] }
      }
    },
    hash_cp2: {
      title: 'Count frequencies of elements',
      subtitle: 'Learn how to count frequencies of array elements efficiently using Maps.',
      videoEmbedUrl: 'https://www.youtube.com/embed/KEs5UyBJ39g?start=850&rel=0&modestbranding=1',
      challenges: {
        cpp: { title: 'Implement Concept', desc: 'Sandbox for Hashing', functionName: 'solve', testCases: [{input: '"test"', expected: '1'}], bp: 'int solve() { return 1; }', sol: 'int solve() { return 1; }', hints: [] },
        java: { title: 'Implement Concept', desc: 'Sandbox for Hashing', functionName: 'solve', testCases: [{input: '"test"', expected: '1'}], bp: 'public class Solution { public static int solve() { return 1; } }', sol: 'public static int solve() { return 1; }', hints: [] },
        python: { title: 'Implement Concept', desc: 'Sandbox for Hashing', functionName: 'solve', testCases: [{input: '"test"', expected: '1'}], bp: 'def solve(): return 1', sol: 'def solve(): return 1', hints: [] },
        javascript: { title: 'Implement Concept', desc: 'Sandbox for Hashing', functionName: 'solve', testCases: [{input: '"test"', expected: '1'}], bp: 'function solve() { return 1; }', sol: 'function solve() { return 1; }', hints: [] }
      }
    },
    hash_cp3: {
      title: 'Highest/Lowest Frequency Elements',
      subtitle: 'Apply Hashing to find the elements with highest and lowest frequency.',
      videoEmbedUrl: 'https://www.youtube.com/embed/KEs5UyBJ39g?start=1500&rel=0&modestbranding=1',
      challenges: {
        cpp: { title: 'Implement Concept', desc: 'Sandbox for Hashing', functionName: 'solve', testCases: [{input: '"test"', expected: '1'}], bp: 'int solve() { return 1; }', sol: 'int solve() { return 1; }', hints: [] },
        java: { title: 'Implement Concept', desc: 'Sandbox for Hashing', functionName: 'solve', testCases: [{input: '"test"', expected: '1'}], bp: 'public class Solution { public static int solve() { return 1; } }', sol: 'public static int solve() { return 1; }', hints: [] },
        python: { title: 'Implement Concept', desc: 'Sandbox for Hashing', functionName: 'solve', testCases: [{input: '"test"', expected: '1'}], bp: 'def solve(): return 1', sol: 'def solve(): return 1', hints: [] },
        javascript: { title: 'Implement Concept', desc: 'Sandbox for Hashing', functionName: 'solve', testCases: [{input: '"test"', expected: '1'}], bp: 'function solve() { return 1; }', sol: 'function solve() { return 1; }', hints: [] }
      }
    }
  };

  const cp = checkpoints[checkpointId];
  if (!cp) return null;

  const langChallenge = cp.challenges[language] || cp.challenges.cpp;
  const isLastCheckpoint = checkpointId === 'hash_cp3';

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
