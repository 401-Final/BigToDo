const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

const schema = new Schema({
  name: {
    type: String,
    required: true
  },
  animal: {
    type: String,
    enum: ['cat', 'lizard', 'bird', 'dog', 'fish']
  },
  store: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  }
});

module.exports = mongoose.model('Pet', schema);
