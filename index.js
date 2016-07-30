'use strict';

const Hapi = require('hapi');
const uuid = require('node-uuid');

// hapi server and connection
const server = new Hapi.Server();
server.connection({
  port: 3000
});

// sample data
const bookmarks = [{
    "_id": "534de420-2d86-11e6-b18e-4b692101e6d2",
    "title": "CNN",
    "url": "http://cnn.com/",
    "created": new Date(),
    "creator": "0a44ce1a-2cb9-11e6-b67b-9e71128cae77",
    "upvoters": [

    ]
}, {
    "_id": "86ed6030-2d86-11e6-b18e-4b692101e6d2",
    "title": "Huffington Post",
    "url": "http://www.huffingtonpost.com",
    "created": new Date(),
    "creator": "0a44ce1a-2cb9-11e6-b67b-9e71128cae77",
    "upvoters": [

    ]
}];

// routes needed
// GET /bookmarks
server.route({
  method: 'GET',
  path: '/bookmarks',
  handler: (request, reply) => {
    return reply(bookmarks);
  }
});

// GET /bookmarks/:id
server.route({
  method: 'GET',
  path: '/bookmarks/{id}',
  handler: (request, reply) => {
    return reply(bookmarks[0]);
  }
});

// POST /bookmarks
server.route({
  method: 'POST',
  path: '/bookmarks',
  handler: (request, reply) => {

    const bookmark = request.payload;

    bookmark._id = uuid.v1();
    bookmark.created = new Date();

    return reply(bookmark).code(201);
  }
});

// PATCH /bookmarks/:id
// DELETE /bookmarks/:id
// POST /bookmarks/:id/upvote


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
