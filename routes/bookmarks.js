'use strict';

exports.register = function (server, options, next) {

  const db = server.plugins['db'].db;

  const renameAndClearFields = (doc) => {
    doc.id = doc._id;
    delete doc._id;

    delete doc.creator;
    delete doc.upvoters;
  };

  // routes needed
  // GET /bookmarks
  server.route({
    method: 'GET',
    path: '/bookmarks',
    handler: (request, reply) => {

      let sort;

      if (request.query.sort === 'top') {
        sort = {
          $sort: {
            upvotes: -1
          }
        };
      } else {
        sort = {
          $sort: {
            created: -1
          }
        };
      }

      db.bookmarks.aggregate({
        $project: {
          title: 1,
          url: 1,
          created: 1,
          upvotes: {
            $size: "$upvoters"
          }
        }
      }, sort, (err, docs) => {

        if (err) {
          throw err;
        }
        // rename _id to id
        docs.forEach(renameAndClearFields);

        return reply(docs);

      });
    }
  });

  // GET /bookmarks/:id
  server.route({
    method: 'GET',
    path: '/bookmarks/{id}',
    handler: (request, reply) => {

      db.bookmarks.findOne({
        _id: request.params.id
      }, (err, doc) => {

        if (err) {
          throw err;
        }

        if (!doc) {
          return reply('Not found').code(404);
        }

        // rename _id to id
        renameAndClearFields(doc);

        return reply(doc);
      });

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
  server.route({
    method: 'PATCH',
    path: '/bookmarks/{id}',
    handler: (request, reply) => {
      return reply().code(204);
    }
  });

  // DELETE /bookmarks/:id
  server.route({
    method: 'DELETE',
    path: '/bookmarks/{id}',
    handler: (request, reply) => {
      return reply().code(204);
    }
  });

  // POST /bookmarks/:id/upvote
  server.route({
    method: 'POST',
    path: '/bookmarks/{id}/upvote',
    handler: (request, reply) => {
      return reply().code(204);
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'routes-bookmarks',
  dependencies: ['db']
};
