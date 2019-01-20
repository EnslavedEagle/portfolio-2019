const express = require('express');
const { resolve, join } = require('path');
const port = process.env.PORT || 8005;
const mustacheExpress = require('mustache-express');

const app = express();

app.engine('mst', mustacheExpress());
app.set('view engine', 'mst');
app.set('views', resolve('src/templates'));

app.use('/static', express.static(resolve('src/assets')));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/mail', (req, res) => {
  res.status(404).json({ message: 'Not found!' });
});

app.listen(port, () => {
  console.log('[App] Listening on port ' + port);
});