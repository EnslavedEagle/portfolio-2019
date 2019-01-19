const { spawn } = require('child_process');

let server;

const exitHandler = () => {
  server.kill();
}

exports.port = 8005;
exports.start = () => {
  console.log(`[PHP] Running server on port ${exports.port}...`);
  server = spawn('php', ['-S', `0.0.0.0:${exports.port}`, '-t', './website/dist/'], {
    detached: true
  });
  server.on('close', () => {
    console.log('[PHP] Server closed.');
  });
};