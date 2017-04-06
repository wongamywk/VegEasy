var Mongoose = require('mongoose');
var Config = require('./config');

Mongoose.Promise = global.Promise;
Mongoose.connect('mongodb://' + Config.mongo.host + '/' + Config.mongo.db);
//Mongoose.connect('mongodb://' + config.database.host + '/' + config.database.db);
var db = Mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
  console.log("Connection with database succeeded.");
});

exports.Mongoose = Mongoose;
exports.db = db;
