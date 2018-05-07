'use strict';

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  fullname: String,
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});

userSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
  }
});

module.exports = mongoose.model('User', userSchema);