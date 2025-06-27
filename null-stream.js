const fs = require('fs');
const net = require('net');
const path = require('path');
const silence = fs.readFileSync(path.join(__dirname, 'silence.mp3'));

const HOST = '192.248.70.132';
const PORT = 8000;
const MOUNT = '/souce';
const USER = 'source';
const PASS = 'hackme';

function connectAndStream() {
  const client = net.createConnection(PORT, HOST, () => {
    console.log('Connected to Icecast server.');

    const headers =
      `SOURCE ${MOUNT} HTTP/1.0\r\n` +
      `Authorization: Basic ${Buffer.from(`${USER}:${PASS}`).toString('base64')}\r\n` +
      `Content-Type: audio/mpeg\r\n\r\n`;

    client.write(headers);

    const streamSilence = () => {
      if (client.writable) {
        client.write(silence);
        setTimeout(streamSilence, 1000); // 1s of silence
      }
    };

    streamSilence();
  });

  client.on('error', (err) => {
    console.error('Connection error:', err.message);
    setTimeout(connectAndStream, 5000); // Reconnect on error
  });

  client.on('end', () => {
    console.log('Disconnected from Icecast. Reconnecting...');
    setTimeout(connectAndStream, 5000);
  });
}

try {
  connectAndStream();
} catch (error) {
  console.error('An error occurred:', error.message);

}
