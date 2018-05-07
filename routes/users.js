'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const User = require('../models/user');

// ===== GET ALL USERS fullname, username, id ====  = //
router.get('/', (req, res, next) => {
  User.find()
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      next(err);
    });
});


// ===== CREATE A NEW USER ===== //
router.post('/', (req, res, next) => {
  const { fullname, username, password } = req.body;

  // username/password missing?
  
  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    const err = new Error(`Missing ${missingField} in request body`);
    err.status(422);
    return next(err);
  }

  // leading/trailing whitespaces?
  const explicitlyTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicitlyTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with a whitespace',
      location: nonTrimmedField
    });
  }

  // Length check
  const sizedFields = {
    username: {
      min: 1
    },
    password: {
      min: 8,
      max: 72
    }
  };
  // Will return the value of the first element in the array 
  // is 'min' in sizedFields? true/false
  // and
  // With all the whitespaces trimmed, is req.body[field]'s length less than .min?
  const tooSmallField = Object.keys(sizedFields).find(
    field => 
      'min' in sizedFields[field] &&
        req.body[field].trim().length < sizedFields[field].min
  );

  const tooLargeField = Object.keys(sizedFields).find(
    field => 
      'max' in sizedFields[field] &&
        req.body[field].trim().length > sizedFields[field].max
  );

  // If either tooSmallField OR tooLargeField
  // return res.status 422, and a json object specifiying:
  // the code, the reason, and a message(ternary)
  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooLargeField].min} characters long`
        : `Must be at most ${sizedFields[tooLargeField].max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  return User.hashPassword(password)
    .then(digest => {
      const newUser = {
        username,
        password: digest,
        fullname
      };
      return User.create(newUser);
    })
    .then(result => {
      return res.status(201).location(`/api/users/${result.id}`)
        .json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The username already exists');
        err.status(400);
      }
      next(err);
    });
});

module.exports = router;