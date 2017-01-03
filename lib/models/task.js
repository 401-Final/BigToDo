const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

const schema = new Schema({
  description: {
    type: String,
    required: true
  },
  animal: {
    type: String,
  },
  store: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  }
});

module.exports = mongoose.model('Task', schema);
