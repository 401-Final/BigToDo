const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

const schema = new Schema({
  description: {
    type: String,
    required: true
  },
  duedate: {
    type: Date
  },
  parent: {
    type: String,
    required: true

  },
});

module.exports = mongoose.model('Project', schema);
