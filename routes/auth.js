'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const passport = require('passport'); // library
const localStrategy = require('../passport/local'); // picks up localstrategy from /passport/local.js

const options = { session: false, failWithError: true };
const localAuth = passport.authenticate('local', options);

router.post('/', localAuth, function(req, res) {
  return res.json(req.user);
});

module.exports = router;