'use strict';

// Require 'passport-local' in the file and set the 'Strategy' property to a local variable named LocalStrategy using object deconstructing
const { Strategy: LocalStrategy } = require('passport-local');
const User = require('../models/user');

//===== DEFINE AND CREATE basicStrategy =====//
const localStrategy = new LocalStrategy((username, password, done) => {
  let user;

  User.findOne({ username })
    .then(results => {
      user = results;
      
      if (!user) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username',
          location: 'username'
        });
      }
      return user.validatePassword(password);
    })
    // const isValid = user.validatePassword(password);
    .then(isValid => {
      if (!isValid) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect password',
          location: 'password'
        });
      }
      return done(null, user);
    })
    .catch(err => {
      if (err.reason === 'LoginError') {
        return done(null, false);
      }
      return done(err);
    });
});

module.exports = localStrategy;