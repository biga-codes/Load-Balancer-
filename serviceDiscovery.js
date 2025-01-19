const axios = require('axios');

let discoveredServers = [];

// Discover available servers (in this case, hardcoded to localhost ports)
const discoverServers = async () => {
    const servers = [
        { host: '127.0.0.1', port: 8001, connections: 1, healthy: false },
        { host: '127.0.0.1', port: 8002, connections: 1, healthy: false },
        { host: '127.0.0.1', port: 8003, connections: 0, healthy: false },
    ];

    discoveredServers = servers;
    console.log('Discovered servers:', discoveredServers);
};


const checkServerHealth = async (server) => {
    try {
        const response = await axios.get(`http://${server.host}:${server.port}/health`);
        return response.status === 200;  // Healthy 
    } catch (error) {
        console.error(`Health check failed for ${server.host}:${server.port}`);
        return false;  // unhealthy
    }
};


const updateServerList = async () => {
    await discoverServers();  
    const healthPromises = discoveredServers.map(async (server) => {
        server.healthy = await checkServerHealth(server);
        return server;
    });
    discoveredServers = await Promise.all(healthPromises);
    console.log('Updated server list with health status:', discoveredServers);
};

// get all the healthy servers
const getServers = () => discoveredServers.filter(server => server.healthy);

module.exports = {
    getServers,
    updateServerList,
};
