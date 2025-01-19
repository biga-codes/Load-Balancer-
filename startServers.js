const createServer = require('./createServer');

// these are the servers I created and their delays, you can add your own
createServer('127.0.0.1', 8001, 1000); 
createServer('127.0.0.1', 8002, 500);  
createServer('127.0.0.1', 8003, 2000); 
createServer('127.0.0.1', 8004, 1500); 