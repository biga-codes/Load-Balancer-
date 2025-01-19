const axios = require('axios'); // Using axios for HTTP requests

let discoveredServers = [];

// discovers servers dynamically
const discoverServers = async () => {
  try {
    const response = await axios.get('http://localhost:8000/servers'); 
    discoveredServers = response.data.servers;
    console.log('Discovered servers:', discoveredServers);
  } catch (error) {
    console.error('Error discovering servers:', error);
  }
};

// checks the health of a server
const checkServerHealth = async (server) => {
  try {
    const response = await axios.get(`http://${server.host}:${server.port}/health`); // Adjust endpoint if needed
    return response.status === 200;  // Healthy if status is 200
  } catch (error) {
    console.error(`Server ${server.host}:${server.port} is not healthy`);
    return false; // Server is unhealthy
  }
};

// filters healthy servers
const filterHealthyServers = async (servers) => {
  const healthPromises = servers.map(server => checkServerHealth(server));
  const healthResults = await Promise.all(healthPromises);
  return servers.filter((server, index) => healthResults[index]);
};


const updateServerList = async () => {
  await discoverServers(); 
  discoveredServers = await filterHealthyServers(discoveredServers); 
  console.log('Updated server list:', discoveredServers);
};


setInterval(updateServerList, 10000); 

module.exports = {
  getServers: () => discoveredServers,
  discoverServers,
  updateServerList,
};
