const fs = require('fs');
const path = require('path');

const generateContentFile = (topic, prefix, jsonFile, titleName) => {
    // Look in artifact scratch folder since the JSONs were saved there
    const jsonPath = path.join('C:\\Users\\Tarun Shivhare\\.gemini\\antigravity\\brain\\fcf3e3ca-a8b3-4e50-87d0-b09d5d959eb2\\scratch', jsonFile);
    if (!fs.existsSync(jsonPath)) {
        console.log(`Skipping ${topic}, no JSON file found at ${jsonPath}`);
        return;
    }

    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    let checkpointsCode = '';
    
    data.forEach((video, index) => {
        const cpId = `${prefix}_cp${index + 1}`;
        const cleanTitle = video.title.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, ' ');
        
        checkpointsCode += `
    ${cpId}: {
      title: '${cleanTitle.substring(0, 80).replace(/'/g, "\\'")}',
      subtitle: '${cleanTitle.replace(/'/g, "\\'")}',
      videoEmbedUrl: 'https://www.youtube.com/embed/${video.videoId}?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Follow the approach discussed in the video.'],
          bp: 'int solve() {\\n    // Write your logic here\\n    return 1;\\n}',
          sol: 'int solve() {\\n    return 1;\\n}'
        },
        java: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the logic from the tutorial.'],
          bp: 'public class Solution {\\n    public static int solve() {\\n        // Write your logic here\\n        return 1;\\n    }\\n}',
          sol: 'public static int solve() {\\n    return 1;\\n}'
        },
        python: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Python implementation of the algorithm.'],
          bp: 'def solve():\\n    # Write your logic here\\n    return 1',
          sol: 'def solve():\\n    return 1'
        },
        javascript: {
          title: 'Implement Concept',
          desc: 'Watch the video tutorial and write your implementation in the editor below.',
          functionName: 'solve',
          constraints: 'Depends on the specific problem.',
          testCases: [
            { input: '"test"', expected: '1' }
          ],
          hints: ['Implement the approach step-by-step.'],
          bp: 'function solve() {\\n    // Write your logic here\\n    return 1;\\n}',
          sol: 'function solve() {\\n    return 1;\\n}'
        }
      }
    },`;
    });

    const fileContent = `// ${titleName} Explorer Checkpoint Data (${data.length} Checkpoints)
export const get${titleName}CheckpointContent = (checkpointId, lang = 'cpp') => {
  const language = (lang || 'cpp').toLowerCase() === 'js' ? 'javascript' : (lang || 'cpp').toLowerCase();

  const checkpoints = {${checkpointsCode}
  };

  const cp = checkpoints[checkpointId];
  if (!cp) return null;

  const langChallenge = cp.challenges[language] || cp.challenges.cpp;
  const isLastCheckpoint = checkpointId === '${prefix}_cp${data.length}';

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
`;

    const outputPath = path.join(__dirname, '..', 'client', 'src', 'utils', `${topic}Content.js`);
    fs.writeFileSync(outputPath, fileContent);
    console.log(`Generated ${outputPath} with ${data.length} checkpoints.`);
};

// Generate for all required topics
generateContentFile('recursion', 'rec', 'recursion_playlist.json', 'Recursion');
generateContentFile('linkedList', 'll', 'linkedlist_playlist.json', 'LinkedList');
generateContentFile('stackQueue', 'sq', 'stackqueue_playlist.json', 'StackQueue');
generateContentFile('trees', 'tree', 'trees_playlist.json', 'Trees');
generateContentFile('graph', 'graph', 'graph_playlist.json', 'Graph');
generateContentFile('dp', 'dp', 'dp_playlist.json', 'DP');
generateContentFile('greedy', 'greedy', 'greedy_playlist.json', 'Greedy');

// Hashing is a special case: Single video broken into 3 checkpoints
const hashingContent = `// Hashing Explorer Checkpoint Data
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
`;

fs.writeFileSync(path.join(__dirname, '..', 'client', 'src', 'utils', 'hashingContent.js'), hashingContent);
console.log('Generated hashingContent.js');
