const express = require('express');
const app = express();
const port = 3001;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const secretKey = 'your-256-bit-secret'; // 定义一个密钥用于JWT签名
const refreshTokenSecret = 'your-refresh-token-secret'; // 定义一个密钥用于刷新JWT签名
let refreshTokens = []; // 存储刷新令牌

//连接数据库，确保使用的是最新的解析器
mongoose.connect('mongodb://localhost:27018/myapp', {});

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

// 在您的服务器启动代码中添加这段
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

//确认数据库的用户数据格式
const UserData = mongoose.model('UserData', new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}));

// 收藏数据模式和模型
const favoriteSchema = new mongoose.Schema({
  username: { type: String, required: true },
  animeId: { type: String, required: true }
}, { 
  _id: true,  // 使用默认的 _id
  versionKey: false  // 不使用 __v 字段
});

// 修改索引定义
favoriteSchema.index({ username: 1, animeId: 1 }, { unique: true });

const Favorite = mongoose.model('Favorite', favoriteSchema);

//将前端传送给app的信息全部变成json形式
app.use(express.json());
app.use(cors());

//注册路由
app.post('/register', async (req, res) => {
  //将前端传送给后端的数据赋予username和password
  const { username, password } = req.body;
  try {//确保异步操作中不会出问题
    const exists = await UserData.findOne({ username });//找寻数据库中是否有这个username
    //如果有，返回错误，“用户名已被使用”
    if (exists) {
      return res.status(400).send('Username already exists');
    }
    //加密密码，增加安全性
    const passwordHash = await bcrypt.hash(password, 10);
    //定义user，将信息赋予给user
    const user = new UserData({ username, password: passwordHash });
    //储存新用户进入数据库
    await user.save();
    //成功！
    return res.status(200).send('Registration successful!');
  } catch (error) {
    //异步操作出现问题
    return res.status(400).send('Registration failed!');
  }
});

//登录路由
app.post('/login', async (req, res) => {
  //将前端的数据传输给username和password
  const { username, password } = req.body;
  //防错误
  try {
    //数据库中是否有user，如果有赋予user
    const user = await UserData.findOne({ username });
    //user没有值，返回错误
    if (!user) {
      return res.status(400).send('Login failed1!');
    }
    //测试密码是否正确，将前端password和user(数据库中的信息)中的password对比
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    //密码错误返回错误
    if (!isPasswordCorrect) {
      return res.status(400).send('Login failed2!');
    }
    //密码正确将jwt定义然后传输给前端
    const token = jwt.sign({username}, secretKey, {expiresIn:'1h'});
    //将刷新令牌同时定义发送给前端
    const refreshtoken = jwt.sign({username}, refreshTokenSecret, {expiresIn:'1d'});
    //将刷新令牌记录下来，后续会根据刷新令牌给前端定义新的令牌
    refreshTokens.push(refreshtoken);
    //将一小时令牌和刷新令牌发给前端
    return res.status(200).json({ token, refreshtoken });
  } catch (error) {
    return res.status(400).send('Login failed3!');
  }
});

//刷新令牌的路由
app.post('/token', (req,res)=>{
  //获取令牌
  const {token} = req.body;
  //如果没有令牌
  if(token == null){
    return res.status(401).send('failed!');
  }
  //如果数组里没有令牌
  if(!refreshTokens.includes(token)){
    return res.status(401).send('failed!');
  }
  //测试令牌正确性
  jwt.verify(token, refreshTokenSecret, (err, user)=>{
    //令牌错误
    if(err){
      //删除过期令牌（如果令牌存在并且在数组里，无法通过的必是过期令牌）
      refreshTokens = refreshTokens.filter(t => t !== token);
      return res.status(403).send('failed!');
    }
    //令牌正确，发送新一小时令牌给用户
    else{
      newToken = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });
    return res.json({ token: newToken });
    }  
  })
})
//受令牌保护的路由
app.get('/protected', authJwt, (req, res)=>{
  res.send('protected route is running!');
})

//中间件，测验jwt是否正确
function authJwt(req, res, next){
  //从前端获取authheader，格式为bear token
  const authorization = req.header('authheader');
  //从bear token中继承token
  const token = authorization && authorization.split(' ')[1];  //如果没有令牌
  if(token == null){
    return res.status(404).send('fail!');
  }
  //测试令牌正确性
  jwt.verify(token, secretKey, (err,user)=>{
    if(err){
      return res.status(405).send('fail!');
    }
    req.user = user;
    next();
  })
}

app.post('/favorite', async (req, res) => {
  try {
    const { animeId, username } = req.body;
    if (!username) {
      return res.status(400).send('Username is required');
    }
    if (!animeId) {
      return res.status(400).send('Anime ID is required');
    }
    const exists1 = await Favorite.findOne({ username, animeId });
    if (exists1) {
      return res.status(200).send("你已经收藏过此动漫");
    }
    console.log(`exists1没有找到，正在进行newFavorite: ${username}, ${animeId}`);
    const newFavorite = new Favorite({ username, animeId });
    console.log(`newFavorite正确，正在进行save: ${username}, ${animeId}`);
    const savedFavorite = await newFavorite.save();
    console.log("save正确", savedFavorite);
    res.status(200).send("收藏成功");
  } catch (error) {
    console.error('收藏操作错误:', error);
    if (error.code === 11000) {
      res.status(400).send("重复收藏");
    } else {
      res.status(500).send(`收藏失败，错误: ${error.message}`);
    }
  }
});

app.delete('/favorite', async (req, res) => {
  try {
    const { animeId, username } = req.body;
    const result = await Favorite.findOneAndDelete({ username, animeId });
    
    if (result) {
      res.status(200).send("取消收藏成功");
    } else {
      res.status(404).send("未找到收藏记录");
    }
  } catch (error) {
    console.error('取消收藏操作错误:', error);
    res.status(500).send("取消收藏失败，未知错误");
  }
});

app.get('/favorites/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const favorites = await Favorite.find({ username });
    res.status(200).json(favorites);
  } catch (error) {
    console.error('获取收藏列表错误:', error);
    res.status(500).send("获取收藏列表失败");
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
