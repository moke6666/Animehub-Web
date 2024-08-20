const express = require('express');
const router = express.Router();
const Comment = require('../models/comments'); // 假设评论模型在 models 文件夹中

router.post('/', async (req, res) => {
  const { animeId, username, comment, rating } = req.body;
  try {
    const newComment = new Comment({
      animeId,
      username,
      comment,
      rating
    });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({ error: 'Unable to save comment and rating' });
  }
});

router.get('/:animeId', async (req, res) => {
  const { animeId } = req.params;
  try {
    const comments = await Comment.find({ animeId });
    res.status(200).json(comments);
  } catch (error) {
    res.status(400).json({ error: 'Unable to fetch comments' });
  }
});

router.post('/:commentId/reply', async (req, res) => {
  const { commentId } = req.params;
  const { username, comment } = req.body;

  try {
    const targetComment = await Comment.findById(commentId);
    if (!targetComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    // 创建回复对象
    const newReply = {
      username,
      comment,
      date: new Date(),
    };
    // 将新回复添加到评论的replies数组中
    targetComment.replies.push(newReply);

    // 保存更新后的评论
    await targetComment.save();

    res.status(201).json({ message: 'Reply added successfully', reply: newReply });
  } catch (error) {
    res.status(400).json({ error: 'Unable to add reply' });
  }
});
module.exports = router;
