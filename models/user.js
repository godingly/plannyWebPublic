var mongoose = require('mongoose');

var Schema = mongoose.Schema;

const UserSchema = new Schema({
  googleId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", UserSchema);
