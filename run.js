const express = require('express');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = 5500;

app.use(express.static(path.join(__dirname)));

// Start the server
app.listen(PORT, async () => {
  console.log(`页面运行在: http://127.0.0.1:${PORT}/page/index.html`);
  
  // Dynamically import the 'open' module and open the URL in the default browser
  const open = (await import('open')).default;
  open(`http://127.0.0.1:${PORT}/page/index.html`);
});

// Run the service/app.js file
const serviceAppPath = path.join(__dirname, 'service', 'app.js');
exec(`node ${serviceAppPath}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing app.js: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});
console.log(`后端运行在: http://127.0.0.1:3001`);
console.log(`接口运行在: http://127.0.0.1:3000`);
