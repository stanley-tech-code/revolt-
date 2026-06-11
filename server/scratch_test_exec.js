import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Testing exec from:', __dirname);
console.log('cwd will be:', path.join(__dirname, '..'));

exec('node backup_db.cjs manual', { cwd: path.join(__dirname, '..') }, (error, stdout, stderr) => {
  if (error) {
    console.error('ERROR:', error);
    console.error('STDERR:', stderr);
    console.error('STDOUT:', stdout);
  } else {
    console.log('SUCCESS!');
    console.log('STDOUT:', stdout);
  }
});
