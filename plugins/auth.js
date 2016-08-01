'use strict';

exports.register = function (server, options, next) {

  const db = server.plugins['db'].db;

  const validateFunction = (token, callback) {

    db.users.findOne({token: token}, (err, user) => {

      if (err) {
        return callback(err, false);
      }

      if (!user) {
        return callback(null, false);
      }

      return callback(null, true, user);
    });
  };

  server.auth.strategy('bearer', 'bearer-access-token', {
    validateFunc: validateFunction
  })

   return next();
  }
};

exports.register.attributes = {
  name: 'auth',
  dependencies: ['db', 'hapi-auth-bearer-token']
};

