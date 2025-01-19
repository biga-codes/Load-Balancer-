
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({});

let current = 0;
const roundRobin = (servers, req, res) => {
    let server = servers[current];
    server.connections++;

    console.log(`Forwarding request to: http://${server.host}:${server.port}`);

    current = (current + 1) % servers.length;
    proxy.web(req, res, { target: `http://${server.host}:${server.port}` });

    
    res.on('finish', () => {
        server.connections--;
    });
};

module.exports = roundRobin;
