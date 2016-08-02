'use strict';

const Boom = require('boom');
const Bcrypt = require('bcrypt');
const Joi = require('joi');

exports.register = function(server, options, next) {

  const db = server.app.db;

  server.route({
    method: 'POST',
    path: '/login',
    handler: function (request, reply) {

      db.users.findOne({
        username: request.payload.username
      }, (err, user) => {

        if (err) {
          throw err;
        }

        if (!user) {
          return reply(Boom.unauthorized());
        }

        Bcrypt.compare(request.payload.password, user.password, (err, res) => {

          if (err) {
            throw err;
          }

          if (!res) {
            return reply(Boom.unauthorized());
          }

          return reply({
            token: user.token,
            username: user.username
          });
        });
      });
    },
    config: {
      validate: {
        payload: {
          username: Joi.string().min(1).max(50).required(),
          password: Joi.string().min(1).max(50).required()
        }
      }
    }

  });

  return next();
};

exports.register.attributes = {
  name: 'routes-auth',
  dependencies: ['db']
}
