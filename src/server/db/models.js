const mongoose = require('mongoose');

exports.Profile = mongoose.model('Profile', new mongoose.Schema({
   uuid: { type: String, index: { unique: true } },
   username: { type: String, index: { unique: true } },
   password: { type: String },
   point: { type: Number, default: 0, require: true },
   coin: { type: Number, default: 0, require: true },
   token: { type: Number, default: 0, require: true },
   score: { type: Number, default: 0, require: true },
   mapPieces: { type: Object, default: {}, require: true },
}));