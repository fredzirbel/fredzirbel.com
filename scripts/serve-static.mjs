import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const root = path.resolve(process.cwd(), 'out');
const types = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.xml', 'application/xml; charset=utf-8'],
  ['.woff2', 'font/woff2'],
]);

http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
  const relative = pathname.endsWith('/') ? `${pathname}index.html` : pathname;
  let file = path.resolve(root, `.${relative}`);
  if (!file.startsWith(root + path.sep)) {
    response.writeHead(400).end('Bad request');
    return;
  }
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    const html = `${file}.html`;
    file = fs.existsSync(html) ? html : path.join(root, '404.html');
  }
  const extension = path.extname(file);
  const type = types.get(extension) ?? (path.basename(file) === 'opengraph-image' ? 'image/png' : 'application/octet-stream');
  response.writeHead(file.endsWith('404.html') ? 404 : 200, { 'Content-Type': type });
  fs.createReadStream(file).pipe(response);
}).listen(3000, '127.0.0.1', () => console.log('Static export available at http://127.0.0.1:3000'));
