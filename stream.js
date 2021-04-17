const fs = require('fs');
const readableStream = fs.createReadStream('config.js');
let content = '';
readableStream.on('data', (chunk) => {
  console.log('data', chunk);
  content += chunk;
});
readableStream.on('end', () => {
  console.log('end', content);
});
