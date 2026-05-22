const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'App.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const startKeyword = '        <span className="font-mono font-black tefunction';
const endKeyword = 'function generateProceduralNotes';

const startIndex = content.indexOf(startKeyword);
const endIndex = content.indexOf(endKeyword);

console.log("Start Index:", startIndex);
console.log("End Index:", endIndex);

if (startIndex !== -1) {
  console.log("Start text preview:\n", content.substring(startIndex, startIndex + 150));
}
if (endIndex !== -1) {
  console.log("End text preview:\n", content.substring(endIndex - 100, endIndex + 50));
}
