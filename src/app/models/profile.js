const mongoose = require('../../database');

/* Schema são mais ou menos os campos que vão ter dentro do bd */
const ProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  key: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//definindo o model
const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;
