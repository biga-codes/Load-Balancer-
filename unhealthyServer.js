const http = require('http');

// This server will simulate an unhealthy server (always returning 500)
const unhealthyServer = http.createServer((req, res) => {
    if (req.url === '/health') {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Unhealthy'); // Simulating an unhealthy server
    } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Server is running');
    }
});

// Start the unhealthy server on a specific port
unhealthyServer.listen(9001, () => {
    console.log('Unhealthy Server running on port 9001');
});
