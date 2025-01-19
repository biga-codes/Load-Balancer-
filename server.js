const http = require('http');
const roundRobin = require('./roundRobin');
const leastConnections = require('./leastConnections');
const { getServers, updateServerList } = require('./serviceDiscovery');
const readline = require('readline');
//interaction part cli->
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
           });

let loadBalancingAlgorithm = 'leastConnections'; 
const logServerStatus = async () => {
    const servers = await getServers();
    if (servers.length === 0) {
        console.log('No servers available. Waiting for updates...');
} else {
        console.table(servers.map(server => ({
            Host: server.host,
            Port: server.port,
            Connections: server.connections,
            Health: server.healthy ? 'Healthy' : 'Unhealthy',
 })));
    }
};


setInterval(async () => {
    await updateServerList();  
    await logServerStatus();  
}, 10000); 

// this is the HTTP server that will act as the load balancer
const server = http.createServer(async (req, res) => {
    if (req.url === '/servers' && req.method === 'GET') {
        const servers = await getServers();  // Get the list of servers
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ servers }));  
        return;
    }

    const servers = await getServers();
    if (servers.length === 0) {
        res.writeHead(503, { 'Content-Type': 'text/plain' });
        res.end('No servers available');
        return;
    }

    if (loadBalancingAlgorithm === 'roundRobin') {
        roundRobin(servers, req, res);
    } else if (loadBalancingAlgorithm === 'leastConnections') {
        leastConnections(servers, req, res);
    } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Load Balancing Algorithm is not supported');
    }
});

// note: starting the load balancer 
server.listen(8000, () => {
    console.log('Load Balancer running on port 8000');

    
    rl.question(
        'Choose a load balancing algorithm (roundRobin or leastConnections): ',
        (algorithm) => {
            if (['roundRobin', 'leastConnections'].includes(algorithm)) {
                loadBalancingAlgorithm = algorithm;
                console.log(`Selected Algorithm: ${algorithm}`);
            } else {
                console.log('Invalid input. Using default: leastConnections');
            }
            rl.close();
        }
    );
});


server.on('error', (err) => {
    console.error('Server encountered an error:', err);
});
