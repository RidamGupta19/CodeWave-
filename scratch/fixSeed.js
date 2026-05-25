const fs = require('fs');
const path = require('path');

const playlistData = require('C:\\\\Users\\\\Tarun Shivhare\\\\.gemini\\\\antigravity\\\\brain\\\\fcf3e3ca-a8b3-4e50-87d0-b09d5d959eb2\\\\scratch\\\\recursion_playlist.json');

const checkpointsArray = playlistData.map((v, i) => {
  return `        {
          id: 'rec_cp${i + 1}',
          label: '${v.title.replace(/'/g, "\\'")}',
          description: 'Checkpoint ${i + 1}',
          youtubeLink: 'https://www.youtube.com/embed/${v.videoId}?rel=0&modestbranding=1'
        }`;
});

const cpString = `      checkpoints: [\n${checkpointsArray.join(',\n')}\n      ],`;

const topicDataPath = path.join(__dirname, '..', 'server', 'seeds', 'topicData.js');
let topicData = fs.readFileSync(topicDataPath, 'utf8');

topicData = topicData.replace(/checkpoints:\s*\[\s*\],/, cpString);

fs.writeFileSync(topicDataPath, topicData);
console.log('Successfully injected 22 checkpoints into topicData.js');
