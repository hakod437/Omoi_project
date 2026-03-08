
const net = require('net');
const client = net.createConnection({ port: 51214, host: 'localhost' }, () => {
    console.log('Connected to port 51214');
    process.exit(0);
});
client.on('error', (err) => {
    console.error('Failed to connect:', err.message);
    process.exit(1);
});
setTimeout(() => {
    console.error('Connection timed out');
    process.exit(1);
}, 2000);
