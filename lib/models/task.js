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
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Projects'
  },
  context: {
    type: Schema.Types.ObjectId,
    ref: 'Context'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Task', schema);
