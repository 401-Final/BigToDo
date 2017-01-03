const mongoose = require( 'mongoose' );
mongoose.Promise = Promise;
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
  user: {
    type: Schema.Types.ObjectId,
    required: true
  }
});

module.exports = mongoose.model('Project', schema);
