const mongoose = require( 'mongoose' );
mongoose.Promise = Promise;
const Schema = mongoose.Schema;

const schema = new Schema({
  description: {
    type: String,
    required: true
  },
  duedate: {
    type: String
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'Project'
    // required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  }
});

module.exports = mongoose.model('Project', schema);
