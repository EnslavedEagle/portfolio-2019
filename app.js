const path = require('path');
const fastify = require('fastify')();

fastify.register(require('point-of-view'), {
  engine: {
    mustache: require('mustache')
  }
});

fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'dist', 'static'),
  prefix: '/public/'
});

const port = process.env.PORT || 8005;

fastify.get('/', (req, reply) => {
  console.log('[App] Request / ');
  return reply.view('src/templates/index.mst', { text: 'Hello World!' });
});

fastify.listen(port, err => {
  if (err) throw err;
});