# **LOAD BALANCER**

## **Project-Overview**

A load balancer is a system or device that distributes incoming network traffic across multiple servers. This ensures that no single server gets overwhelmed with too many requests, thereby improving the performance, availability, and reliability of your web applications, to ensure that no server becomes overloaded.
This project is designed to provide flexible load balancing for backend servers with an easy-to-use CLI and real-time monitoring.

Built using: node.js , shell script

### **Features of the Load Balancer Project**

- Load Balancer: Distributes requests using Round Robin or Least Connections.
- Server Discovery & Health Check: Monitors and filters out unhealthy servers.
- Configurable Backend Servers: Create servers dynamically with ports and optional delays.
- Testing with `curl` or `test_load_balancer.sh` to send multiple requests to test the distribution.
- Multiple Methods for Request Testing:
   - Automated Testing: Using the `test_load_balancer.sh` script to send multiple requests to the load balancer.
   - Manual Testing: Using `curl` to send individual requests to the load balancer and view load distribution.
     
#### This project is designed to provide flexible load balancing for backend servers with an easy-to-use CLI and real-time monitoring.
---

# **Project Structure**

```

.
├── createServer.js            # Create a single backend server
├── createServers.sh           # Create multiple backend servers
├── roundRobin.js              # Round Robin load balancing algorithm
├── leastConnections.js        # Least Connections load balancing algorithm
├── serviceDiscovery.js        # Server discovery and health checking
├── server.js                  # Main load balancer server
├── test_load_balancer.sh      # Send test requests to the load balancer
├── package.json               # Project dependencies

```


## **IMPLEMENTATION**
![Screenshot 2025-01-20 013840](https://github.com/user-attachments/assets/68744a55-9228-4bb4-ba4e-9a731c20a637)
![Screenshot 2025-01-20 013709](https://github.com/user-attachments/assets/9f4fb6e9-900d-4539-974d-bc1ae368db68)
![Screenshot 2025-01-20 013419](https://github.com/user-attachments/assets/c0adecb9-8736-4202-b1f9-f04555d37d51)
![Screenshot 2025-01-16 182612](https://github.com/user-attachments/assets/c729dbd2-ebfb-4990-8125-9f98ef4c9572)


---

## **Implemented Load Balancing Algorithms**

- **Round Robin**: Distributes requests evenly across servers.
- **Least Connections**: Routes requests to the server with the least number of active connections.

---
## File Descriptions:

- server.js: Main entry point for the load balancer. It starts an HTTP server, accepts incoming requests, and uses a selected load balancing algorithm (round-robin or least 
           connections) to route requests to healthy backend servers.
-roundRobin.js: Implements the Round-Robin algorithm. It forwards requests to servers in a circular manner. Each server gets an equal number of requests.
-leastConnections.js: Implements the Least Connections algorithm. It forwards requests to the server with the fewest active connections to balance the load better.
-serviceDiscovery.js: Discovers and manages backend servers. It checks their health (whether they're up or down), tracks their connection count, and provides the list of 
                      available healthy servers to the load balancer.
---



## **How to Test and Use the Load Balancer**

1. **Create Backend Servers:**

   - **Option 1 (Multiple Servers with `createServers.sh`):**
     ```bash
     ./createServers.sh 3001 3002 3003  # Creates backend servers on ports 3001, 3002, 3003
     ```

   - **Option 2 (Single Server with Delay via `createServer.js`):**
     ```bash
     node createServer.js 127.0.0.1 3001 1000  # Creates a server on port 3001 with 1000ms delay
     ```

2. **Start the Load Balancer:**
   ```bash
   node server.js
   ```

3. **Choose the Load Balancing Algorithm:**
   The interactive CLI will prompt you to choose between **Round Robin** or **Least Connections**. Choose one for load distribution.

4. **Send Requests:**
   - Use `curl` to manually send requests to the load balancer.
   - Or use the `test_load_balancer.sh` script to automate the process.

---

# **How to Run the Project**

## **1. Install Dependencies**

Make sure you have **Node.js** installed, then run:

```bash
npm install http-proxy http axios
```

---

## **2. Create Backend Servers**

You can create backend servers using two methods:

  **Option 1: `createServers.sh` Script**
This script creates multiple backend servers:

```bash
chmod +x createServers.sh   # Make executable
./createServers.sh 3001 3002 3003   # Create servers on ports 3001, 3002, 3003
```

  **Option 2: `createServer.js` Script**
You can create a single server with a custom IP, port, and optional delay:

```bash
node createServer.js 127.0.0.1 3001 1000   # Creates a backend server on port 3001 with a 1000ms delay
```

- **IP**: The IP address where the server will run.
- **Port**: The port where the server will listen.
- **Delay (optional)**: The delay (in milliseconds) to simulate server latency. (e.g., `1000` for 1 second delay)

---

## **3. Start the Load Balancer**

Once the backend servers are created, start the load balancer:

```bash
node server.js
```

This will start the load balancer on port `8000`.

---

## **4. Choose Load Balancing Algorithm**

When prompted, choose one of the following algorithms:

- **roundRobin**: Distributes requests evenly across all servers.
- **leastConnections**: Sends requests to the server with the least active connections.

---

## **5. Send Test Requests**

## **Curl Commands for Testing**

5.1. **Send a single test request to the load balancer:**
   ```bash
   curl http://localhost:8000
   ```

5.2. **Get a list of servers registered with the load balancer:**
   ```bash
   curl http://localhost:8000/servers
   ```
   This command returns the list of backend servers, including their health status and port.

5.3. **Send multiple requests using the `test_load_balancer.sh` script:**
   This sends multiple requests to the load balancer and simulates traffic to test how the load balancer distributes them.
   ```bash
   ./test_load_balancer.sh
   ```


# **Health Check**

- The load balancer periodically checks the health of backend servers via their `/health` endpoint.
- Servers that return a `200 OK` response are considered healthy, and the load balancer will forward traffic to them.
- Servers that return an error (e.g., `503`) are marked as unhealthy and excluded from the list of available servers.

## **Health Check Command**

1. **Checking Server Health:**
   To manually check if a backend server is healthy, use the following `curl` command:
   ```bash
   curl http://localhost:<server-port>/health
   ```

2. **Checking Health via Load Balancer:**
   The load balancer periodically checks the health of all registered servers. You can check which servers are available for routing by querying the `/servers` endpoint:
   ```bash
   curl http://localhost:8000/servers
   ```
