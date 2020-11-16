// server.js
// where your node app starts

/*
 * Init/watch the dev build
 */
const Bundler = require('parcel-bundler');
const Path = require('path');

(async function() {

  // Add files to the dev build here as needed
  const paths = [
    'src/MapboxPlaces.js',
    'src/index.html',
  ];

  const bundler = new Bundler(paths, {});
  const bundle = await bundler.bundle();
})();

/*
 * Start an HTTP server to serve the docsite locally
 */
const express = require('express');
const app = express();

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('dist'));

app.get('/*', function(request, response) {
  response.sendFile(__dirname + '/dist/index.html');
});

// listen for requests :)
const listener = app.listen(9000, function() {
  console.log(`⚙  SUCESS! Go to http://localhost:${listener.address().port} and start hacking!`);
});
