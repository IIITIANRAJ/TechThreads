const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  content: { type: String, required: true },
  blogId: { type: Schema.Types.ObjectId, ref: 'Blog', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Comment', CommentSchema);
