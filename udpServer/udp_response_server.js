/**
 * UDP Server Example
 * Listens for incoming UDP messages and responds to the sender.
 */

const dgram = require('dgram');
const server = dgram.createSocket('udp4');

const PORT = 5002;
const HOST = '172.16.0.4';

// Event: When server starts listening
server.on('listening', () => {
    const address = server.address();
    console.log(`UDP Server listening on ${address.address}:${address.port}`);
});

// Event: When a message is received
server.on('message', (message, remote) => {
    console.log(`Received from ${remote.address}:${remote.port} - ${message}`);

    // Send a response back to the client
    const reply = `Hello Client, I got your message: "${message}"`;
    server.send(reply, remote.port, remote.address, (err) => {
        if (err) {
            console.error('Error sending response:', err);
        } else {
            console.log(`Sent reply to ${remote.address}:${remote.port}`);
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
