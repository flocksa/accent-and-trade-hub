const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

const hostname = 'localhost';
const port = 3000;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
}


const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  const filepath = path.join(__dirname, '..', 'public', parsedUrl.pathname);
  var stat;

  try {
    stat = fs.lstatSync(filepath);
  } catch (err) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
    return;
  }

  if (stat.isFile()) {
    const ext = path.extname(filepath);
    const mimeType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mimeType });
    const readStream = fs.createReadStream(filepath);
    readStream.pipe(res);
  } else if (stat.isDirectory()) {
    res.writeHead(302, { 'Location': '/index.html' });
    res.end();
  } else {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('500 Internal Server Error');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
