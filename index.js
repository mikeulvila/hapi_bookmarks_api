'use strict';

const Hapi = require('hapi');
const uuid = require('node-uuid');
const Glue = require('glue');

const manifest = require('./config.json');

const options = {
  relativeTo: __dirname
};

// start server with Glue
Glue.compose(manifest, options, (err, server) => {

  if (err) {
    throw err;
  }

  // start the server
  server.start((err) => {
    if (err) {
      throw err;
    }

    console.log('server running on: ', server.info.uri);

  });
});
