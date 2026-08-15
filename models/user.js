const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  FirstName: {
    type: String,
    required: [true, 'First name is required']
  },

  LastName: {
    type: String
  },

  Email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true
  },

  Password: {
    type: String,
    required: [true, 'Password is required']
  },

  UserType: {
    type: String,
    enum: ['Guest', 'Host'],
    default: 'Guest'
  },

  favourites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Home'
  }]
});

module.exports = mongoose.model('User', userSchema);