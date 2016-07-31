'use strict';

const uuid = require('node-uuid');
const Joi = require('joi');

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
    },
    config: {
      validate: {
        query: {
          sort: Joi.string().valid('top', 'new').default('top')
        }
      }
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

        doc.upvotes = doc.upvoters.length;

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
      bookmark.creator = '';
      bookmark.upvoters = [];
      bookmark.upvotes = 0;

      db.bookmarks.save(bookmark, (err, result) => {

        if (err) {
          throw err;
        }

        renameAndClearFields(bookmark);

        return reply(bookmark).code(201);
      });
    },
    config: {
      validate: {
        payload: {
          title: Joi.string().min(1).max(100).required(),
          url: Joi.string().uri().required()
        }
      }
    }
  });

  // PATCH /bookmarks/:id
  server.route({
    method: 'PATCH',
    path: '/bookmarks/{id}',
    handler: (request, reply) => {

      db.bookmarks.update({
        _id: request.params.id
      }, {
        $set: request.payload
      }, (err, result) => {

        if (err) {
          throw err;
        }

        if (result.n === 0) {
          return reply().code(404);
        }

        return reply().code(204);

      });
    },
    config: {
      validate: {
        payload: Joi.object({
          title: Joi.string().min(1).max(100).optional(),
          url: Joi.string().uri().optional()
        }).required().min(1)
      }
    }
  });

  // DELETE /bookmarks/:id
  server.route({
    method: 'DELETE',
    path: '/bookmarks/{id}',
    handler: (request, reply) => {

      db.bookmarks.remove({
          _id: request.params.id
      }, (err, result) => {

          if (err) {
              throw err;
          }

          if (result.n === 0) {
              return reply().code(404);
          }

          return reply().code(204);

      });
    }
  });

  // POST /bookmarks/:id/upvote
  server.route({
    method: 'POST',
    path: '/bookmarks/{id}/upvote',
    handler: (request, reply) => {

      db.bookmarks.update({
          _id: request.params.id
      }, {
          $addToSet: {
              upvoters: ''
          }
      }, (err, result) => {

          if (err) {
              throw err;
          }

          if (result.n === 0) {
              return reply().code(404);
          }

          return reply().code(204);

      });
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'routes-bookmarks',
  dependencies: ['db']
};
