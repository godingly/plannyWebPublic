var mongoose = require('mongoose');
const User = require('../models/user')

module.exports = function() {
    // mongoose
    const uri = process.env.MONGODB_URI;
    mongoose.connect(uri, { useNewUrlParser: true , useUnifiedTopology: true});
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
};