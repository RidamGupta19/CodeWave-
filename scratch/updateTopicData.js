const fs = require('fs');
const path = require('path');

const generateCheckpoints = (prefix, jsonFile) => {
    const jsonPath = path.join(__dirname, jsonFile);
    if (!fs.existsSync(jsonPath)) return [];
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    return data.map((video, index) => ({
        id: `${prefix}_cp${index + 1}`,
        label: video.title.substring(0, 50).replace(/'/g, "\\'"),
        description: video.title.replace(/'/g, "\\'"),
        youtubeLink: `https://www.youtube.com/embed/${video.videoId}?rel=0&modestbranding=1`
    }));
};

const hashCheckpoints = [
    { id: 'hash_cp1', label: 'Hashing Introduction', description: 'Understand the basics of Hashing', youtubeLink: 'https://www.youtube.com/embed/KEs5UyBJ39g?rel=0&modestbranding=1' },
    { id: 'hash_cp2', label: 'Count frequencies of elements', description: 'Learn how to count frequencies', youtubeLink: 'https://www.youtube.com/embed/KEs5UyBJ39g?start=850&rel=0&modestbranding=1' },
    { id: 'hash_cp3', label: 'Highest/Lowest Frequency Elements', description: 'Apply Hashing to find elements', youtubeLink: 'https://www.youtube.com/embed/KEs5UyBJ39g?start=1500&rel=0&modestbranding=1' }
];

let topicDataContent = fs.readFileSync(path.join(__dirname, '..', 'server', 'seeds', 'topicData.js'), 'utf8');

// Function to replace a specific checkpoints array in the string
function replaceCheckpoints(content, topicTitle, checkpoints) {
    const regex = new RegExp(`(title:\\s*['"]${topicTitle}['"][\\s\\S]*?checkpoints:\\s*\\[)([\\s\\S]*?)(\\]\\s*,\\s*youtubeLink)`, 'g');
    
    // Create the JSON string for checkpoints, but format it for JS code
    let checkpointsStr = checkpoints.map(cp => {
        return `\n        {\n          id: '${cp.id}',\n          label: '${cp.label}',\n          description: '${cp.description}',\n          youtubeLink: '${cp.youtubeLink}'\n        }`;
    }).join(',');

    return content.replace(regex, `$1${checkpointsStr}\n      $3`);
}

topicDataContent = replaceCheckpoints(topicDataContent, 'Hashing Explorer', hashCheckpoints);
topicDataContent = replaceCheckpoints(topicDataContent, 'Recursion Explorer', generateCheckpoints('rec', 'recursion_playlist.json'));
topicDataContent = replaceCheckpoints(topicDataContent, 'Linked List Explorer', generateCheckpoints('ll', 'linkedlist_playlist.json'));
topicDataContent = replaceCheckpoints(topicDataContent, 'Stack & Queue Explorer', generateCheckpoints('sq', 'stackqueue_playlist.json'));
topicDataContent = replaceCheckpoints(topicDataContent, 'Trees Explorer', generateCheckpoints('tree', 'trees_playlist.json'));
topicDataContent = replaceCheckpoints(topicDataContent, 'Graph Explorer', generateCheckpoints('graph', 'graph_playlist.json'));
topicDataContent = replaceCheckpoints(topicDataContent, 'Dynamic Programming Explorer', generateCheckpoints('dp', 'dp_playlist.json'));
topicDataContent = replaceCheckpoints(topicDataContent, 'Greedy Explorer', generateCheckpoints('greedy', 'greedy_playlist.json'));

fs.writeFileSync(path.join(__dirname, '..', 'server', 'seeds', 'topicData.js'), topicDataContent);
console.log('topicData.js updated successfully.');
