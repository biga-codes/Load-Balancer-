const axios = require('axios'); // Using axios for HTTP requests

let discoveredServers = [];

// Function to discover servers from an API or service registry
const discoverServers = async () => {
  try {
    const response = await axios.get('http://localhost:8000/servers'); 
    discoveredServers = response.data.servers;
    console.log('Discovered servers:', discoveredServers);
  } catch (error) {
    console.error('Error discovering servers:', error);
  }
};

// Function to check the health of a server
const checkServerHealth = async (server) => {
  try {
    const response = await axios.get(`http://${server.host}:${server.port}/health`); // Adjust endpoint if needed
    return response.status === 200;  // Healthy if status is 200
  } catch (error) {
    console.error(`Server ${server.host}:${server.port} is not healthy`);
    return false; // Server is unhealthy
  }
};

// Function to filter healthy servers
const filterHealthyServers = async (servers) => {
  const healthPromises = servers.map(server => checkServerHealth(server));
  const healthResults = await Promise.all(healthPromises);
  return servers.filter((server, index) => healthResults[index]);
};

// Function to periodically update the list of healthy servers
const updateServerList = async () => {
  await discoverServers(); // Discover servers first
  discoveredServers = await filterHealthyServers(discoveredServers); // Filter for healthy servers
  console.log('Updated server list:', discoveredServers);
};

// Set interval to periodically update server list every 10 seconds
setInterval(updateServerList, 10000); // Update every 10 seconds

module.exports = {
  getServers: () => discoveredServers,
  discoverServers,
  updateServerList,
};
