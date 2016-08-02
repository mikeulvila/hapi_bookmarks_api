'use strict';

const Hapi = require('hapi');
const uuid = require('node-uuid');

// hapi server and connection
const server = new Hapi.Server();
server.connection({
  port: 3000
});

// register good plugin and start server
server.register([{
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
}, {
  register: require('hapi-auth-bearer-token')
}, {
  register: require('./plugins/db')
}, {
  register: require('./routes/auth')
}, {
  register: require('./routes/bookmarks')
}, {
  register: require('./routes/auth')
}], (err) => {
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
