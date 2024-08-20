const express = require('express');
const app = express();
const port = 3001;
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const favoriteRoutes = require('./routes/favorite');
const commentRoutes = require('./routes/comment');

mongoose.connect('mongodb://localhost:27018/myapp', {});

mongoose.connection.once('open', async () => {
  try {
    await mongoose.connection.db.collection('favorites').dropIndex('username_1_id_1');
    console.log('成功删除 username_1_id_1 索引');
  } catch (error) {
    console.log('删除 username_1_id_1 索引失败，可能不存在:', error.message);
  }
  
  try {
    await mongoose.connection.db.collection('favorites').dropIndex('id_1');
    console.log('成功删除 id_1 索引');
  } catch (error) {
    console.log('删除 id_1 索引失败，可能不存在:', error.message);
  }
});

app.use(express.json());
app.use(cors());

app.use('/auth', authRoutes);
app.use('/favorite', favoriteRoutes);
app.use('/comments', commentRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
