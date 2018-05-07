'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const User = require('../models/user');

router.post('/', (req, res, next) => {
  const { fullname, username, password } = req.body;

  User.create({ fullname, username, password })
    .then(user => {
      res
        .location(`${req.originalUrl}/${user.id}`)
        .status(201)
        .json(user);
    })
    .catch(err => {
      next(err);
    });
});


module.exports = router;