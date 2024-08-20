const express = require('express');
const router = express.Router();
const Favorite = require('../models/favorite'); // 假设收藏模型在 models 文件夹中

router.post('/', async (req, res) => {
  const { animeId, username } = req.body;
  if (!username || !animeId) {
    return res.status(400).send('Username and Anime ID are required');
  }
  try {
    const exists1 = await Favorite.findOne({ username, animeId });
    if (exists1) {
      return res.status(200).send("你已经收藏过此动漫");
    }
    const newFavorite = new Favorite({ username, animeId });
    await newFavorite.save();
    res.status(200).send("收藏成功");
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).send("重复收藏");
    } else {
      res.status(500).send(`收藏失败，错误: ${error.message}`);
    }
  }
});

router.delete('/', async (req, res) => {
  const { animeId, username } = req.body;
  try {
    const result = await Favorite.findOneAndDelete({ username, animeId });
    if (result) {
      res.status(200).send("取消收藏成功");
    } else {
      res.status(404).send("未找到收藏记录");
    }
  } catch (error) {
    res.status(500).send("取消收藏失败，未知错误");
  }
});

router.get('/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const favorites = await Favorite.find({ username });
    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).send("获取收藏列表失败");
  }
});

module.exports = router;
