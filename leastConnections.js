
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({});

const leastConnections = (servers, req, res) => {
    const healthyServers = servers.filter(server => server.healthy);

    if (healthyServers.length === 0) {
        res.writeHead(503, { 'Content-Type': 'text/plain' });
        res.end('No healthy servers available.');
        return;
    }

    // choosing the server with the least connections
    const server = healthyServers.reduce((minServer, currentServer) => {
        return currentServer.connections < minServer.connections ? currentServer : minServer;
    });

    console.log(`Forwarding request to: http://${server.host}:${server.port}`);

    server.connections++; 

    proxy.web(req, res, { target: `http://${server.host}:${server.port}` });

    
    res.on('finish', () => {
        server.connections--;
    });
};

module.exports = leastConnections;

