const IcecastSource = require('icecast-source');
const fs = require('fs');

const source = new IcecastSource({
  host: '192.248.70.132',
  port: 8000,
  mount: '/live',
  user: 'source',
  password: 'hackme',
  name: 'My Stream',
  genre: 'Silent',
  description: 'Silent loop',
  format: 'mp3',
  reconnect: true
});

const loopStream = () => {
  const stream = fs.createReadStream('silence.mp3');
  stream.pipe(source, { end: false });

  stream.on('end', () => {
    console.log('Restarting silent stream...');
    setTimeout(loopStream, 1000); // delay to avoid flooding
  });
};

source.on('connect', () => {
  console.log('Connected to Icecast!');
  loopStream();
});

source.on('error', (err) => {
  console.error('Error:', err.message);
});

source.on('disconnect', () => {
  console.log('Disconnected from Icecast');
});
