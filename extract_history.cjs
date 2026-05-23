const fs = require('fs');
const readline = require('readline');
const path = require('path');

const transcriptPath = 'C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\287fe233-5915-4b93-8634-690770367c27\\.system_generated\\logs\\transcript.jsonl';
const restoreDir = path.join(__dirname, 'restored');

if (!fs.existsSync(restoreDir)) {
  fs.mkdirSync(restoreDir);
}

async function extractFiles() {
  const fileStream = fs.createReadStream(transcriptPath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let fileContents = {};

  for await (const line of rl) {
    try {
      const step = JSON.parse(line);
      if (step.type === 'VIEW_FILE' && step.content) {
         if (step.content.includes('File Path: `file:///c:/Users/user/OneDrive/Desktop/REVOLT/revolt-site/revolt-site/src/')) {
           const matchPath = step.content.match(/File Path: `file:\/\/\/(.*?)`/i);
           if (matchPath) {
             const fp = matchPath[1];
             const basename = path.basename(fp);
             
             // Extract lines: find lines starting with number and colon
             const lines = step.content.split(/\r?\n/);
             let restoredCode = [];
             for (let l of lines) {
                if (l.match(/^\d+:\s/)) {
                   restoredCode.push(l.replace(/^\d+:\s/, ''));
                }
             }
             if (restoredCode.length > 0) {
               fileContents[basename] = restoredCode.join('\n');
             }
           }
        }
      }
    } catch (err) {
      // ignore
    }
  }

  for (const [name, content] of Object.entries(fileContents)) {
    fs.writeFileSync(path.join(restoreDir, name), content);
    console.log(`Restored ${name} to restored/${name}`);
  }
}

extractFiles();
