const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserData = require('../models/user'); // 假设用户模型在 models 文件夹中

const secretKey = 'your-256-bit-secret'; 
const refreshTokenSecret = 'your-refresh-token-secret';
let refreshTokens = [];

// 注册路由
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const exists = await UserData.findOne({ username });
    if (exists) {
      return res.status(400).send('Username already exists');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new UserData({ username, password: passwordHash });
    await user.save();
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
    const refreshtoken = jwt.sign({ username }, refreshTokenSecret, { expiresIn: '1d' });
    refreshTokens.push(refreshtoken);
    return res.status(200).json({ token, refreshtoken });
  } catch (error) {
    return res.status(400).send('Registration failed!');
  }
});

// 登录路由
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserData.findOne({ username });
    if (!user) {
      return res.status(400).send('用户名或密码有误');
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).send('用户名或密码有误');
    }
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
    const refreshtoken = jwt.sign({ username }, refreshTokenSecret, { expiresIn: '1d' });
    refreshTokens.push(refreshtoken);
    return res.status(200).json({ token, refreshtoken });
  } catch (error) {
    return res.status(400).send('Login failed!');
  }
});

// 刷新令牌的路由
router.post('/token', (req, res) => {
  const { token } = req.body;
  if (token == null) {
    return res.status(401).send('failed!');
  }
  if (!refreshTokens.includes(token)) {
    return res.status(401).send('failed!');
  }
  jwt.verify(token, authJwt, (err, user) => {
    if (err) {
      refreshTokens = refreshTokens.filter(t => t !== token);
      return res.status(403).send('failed!');
    } else {
      const newToken = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });
      return res.json({ token: newToken });
    }
  })
});

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

module.exports = router;
