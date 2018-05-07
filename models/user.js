'use strict';

const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const userSchema = mongoose.Schema({
  fullname: String,
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});

userSchema.methods.validatePassword = function(password) {
  return password === this.password;
};

userSchema.methods.validatePassword = function(password) {
  return bcryptjs.compare(password, this.password);
};

userSchema.statics.hashPassword = function(password) {
  return bcryptjs.hash(password, 10);
};

userSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
  }
});

module.exports = mongoose.model('User', userSchema);