'use strict';

exports.register = function (server, options, next) {

   return next();
};

exports.register.attributes = {
  name: 'auth',
  dependencies: ['db', 'hapi-auth-bearer-token']
};

