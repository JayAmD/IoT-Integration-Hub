/**
 * UDP Server Example
 * Listens for incoming UDP messages and saves them to a file.
 */

const dgram = require('dgram');
const fs = require('fs');
const path = require('path');

const server = dgram.createSocket('udp4');

const PORT = 12345;
const HOST = '0.0.0.0';
const LOG_FILE = path.join(__dirname, 'data.bin');

// Event: When server starts listening
server.on('listening', () => {
    const address = server.address();
    console.log(`UDP Server listening on ${address.address}:${address.port}`);
});

// Event: When a message is received
server.on('message', (message, remote) => {
     console.log(`Received from ${remote.address}:${remote.port}`);
    
    // const timestamp = new Date().toISOString();
    // const logEntry = `[${timestamp}] From ${remote.address}:${remote.port}\n${message}\n---\n`;
    
    // Write to file
    fs.writeFileSync(LOG_FILE, message, (err) => {
        if (err) {
            console.error(`Error writing to file: ${err}`);
        } else {
            console.log(`Message saved to ${LOG_FILE}`);
        }
    });
});

// Event: Error handling
server.on('error', (err) => {
    console.error(`Server error:\n${err.stack}`);
    server.close();
});

// Bind server to port and host
server.bind(PORT, HOST);
