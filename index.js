'use strict';

const Hapi = require('hapi');

// hapi server and connection
const server = new Hapi.Server();
server.connection({
  port: 3000
});

// creating routes
server.route({
  method: 'GET',
  path: '/',
  handler: (request, reply) => {
    return reply('Hello Hapi!');
  }
});

// register good plugin and start server
server.register({
  register: require('good'),
  options: {
    reporters: {
      console: [{
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{
          log: '*',
          response: '*'
        }]
      }, {
        module: 'good-console'
      }, 'stdout']
    }
  }
}, (err) => {
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
