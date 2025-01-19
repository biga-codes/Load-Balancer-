const http = require('http');

/**
 * Create an HTTP server that listens on the given host and port.
 * It responds to health checks on `/health` with status 200.
 */
const createServer = (host, port, timeout) => {
    http.createServer((req, res) => {
        if (req.url === '/health') {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('OK'); 
        } else {
            setTimeout(() => {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(`Server Response from port ${port}`);
            }, timeout); 
        }
    }).listen(port, host, () => {
        console.log(`Server running at http://${host}:${port}`);
    });
};


createServer('127.0.0.1', 8001, 1000); 
createServer('127.0.0.1', 8002, 500);  
createServer('127.0.0.1', 8003, 2000); 
createServer('127.0.0.1', 8004, 100);
createServer('127.0.0.1', 8005, 20000);
