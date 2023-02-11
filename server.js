const log = console.log;
const http = require('http');
const fs = require('fs');
const path = require('path');
const server = http.createServer;
const HOST = "http://localhost";
const PORT = 8000;
const directoryName = './public';
const types = {
    html: 'text/html',
    css: 'text/css',
    js: 'application/javascript',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    json: 'application/json',
    xml: 'application/xml',
    ttf: 'application/x-font-ttf'
};
  
const root = path.normalize(path.resolve(directoryName));
server((req, res) => {
    log(`${req.method} ${req.url}`);
    const extension = path.extname(req.url).slice(1);
    const type = extension ? types[extension] : types.html;
    const supportedExtension = Boolean(type);
    if (!supportedExtension) {
        res.writeHead(404, { 'Content-type' : 'text/html' });
        res.end('404: File Note Found');
        return;
    }

    let fileName = req.url;
    if (req.url === '/') fileName = 'index.html';
    else if (!extension) {
        try {
            fs.accessSync(path.join(root, req.url + '.html'), fs.constants.F_OK);
            fileName = req.url + '.html';
        } catch (e) {
            fileName = path.join(req.url, 'index.html');
        }
    }

    const filePath = path.join(root, fileName);
    const isPathUnderRoot = path
    .normalize(path.resolve(filePath))
    .startsWith(root);

    if (!isPathUnderRoot) {
        res.writeHead(404, { 'Content-type' : 'text/html' });
        res.end('404: File Note Found');
        return;
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-type' : 'text/html' });
            res.end('404: File Note Found');
        } else {
            res.writeHead(200, { 'Content-type' : type });
        res.end(data);
        }
    });
}).listen(PORT, () => {
    log(`Server is running on host: ${HOST}:${PORT}`);
});

