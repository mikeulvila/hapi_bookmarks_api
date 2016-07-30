'use strict';

const mongojs = require('mongojs');
const Bcrypt = require('bcrypt');

exports.register = function (server, options, next) {

  const db = mongojs('social-bookmarks', ['bookmarks', 'users']);

  // make db accessible application wide
  server.expose('db', db);

  // insert fake users into db on startup
  const users = [{
      _id: '0a44ce1a-2cb9-11e6-b67b-9e71128cae77',
      username: 'john',
      password: Bcrypt.hashSync('doe', Bcrypt.genSaltSync()),
      token: '450ca305d7042c0a0f19'
  }, {
      _id: '0c45d7b4-5881-4e64-8fd3-2057325e2afe',
      username: 'jane',
      password: Bcrypt.hashSync('doe', Bcrypt.genSaltSync()),
      token: '11e6b67b9e71128cae77'
  }];

  db.users.remove({}, (err, result) => {

    if (err) {
      return next(err);
    }

    db.users.insert(users, (err, result) => {

      if (err) {
        return next(err);
      }

      return next();
    });

  });

};

exports.register.attributes = {
  name: 'db'
};
