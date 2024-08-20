const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  animeId: { type: String, required: true },
  username: { type: String, required: true },
  comment: { type: String, required: true },
  rating: { type: Number, required: true },
  replies: [{
    username: { type: String, required: true },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
