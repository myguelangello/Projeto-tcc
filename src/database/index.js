const mongoose = require('mongoose');
/**
 * Database setup
 */
mongoose.connect('mongodb://localhost:27017/noderest', {
  useNewUrlParser: true,
});
module.exports = mongoose;
