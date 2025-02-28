const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  coverImageURL: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Blog', BlogSchema);
