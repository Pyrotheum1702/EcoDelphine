const mongoose = require('mongoose');

exports.Profile = mongoose.model('Profile', new mongoose.Schema({
   uuid: { type: String, index: { unique: true } },
   username: { type: String, index: { unique: true } },
   password: { type: String },
}));