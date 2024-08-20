import React, { useState } from 'react';
import axios from 'axios';
import AppBar from '@mui/material/AppBar';  // 导入 Material-UI 的 AppBar 组件
import Box from '@mui/material/Box';  // 导入 Material-UI 的 Box 组件
import Toolbar from '@mui/material/Toolbar';  // 导入 Material-UI 的 Toolbar 组件
import Typography from '@mui/material/Typography';  // 导入 Material-UI 的 Typography 组件
import Button from '@mui/material/Button';  // 导入 Material-UI 的 Button 组件
import MenuIcon from '@mui/icons-material/Menu';  // 导入 Material-UI 的 Menu 图标
import TextField from '@mui/material/TextField';  // 导入 Material-UI 的 TextField 组件（用于搜索栏）
import { useNavigate } from 'react-router-dom';  
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import Container from '@mui/material/Container';
import { useDispatch } from 'react-redux';
import { login } from './action';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  

  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handleRegister = async () => {
    try {
        if(password == confirmPassword){
        const response = await axios.post('http://localhost:3001/auth/register', {username, password});
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('refreshtoken', response.data.refreshtoken);
        localStorage.setItem('username', username); 
        dispatch(login(username));
        navigate('/');
      }
        else{
          setMessage("Password and ConfirmPassword do not match");
    }
      } catch (error) {
        if (error.response && error.response.data) {
          setMessage(error.response.data);
        } else {
          setMessage('Registration failed. Please try again.');
        }
    }
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ backgroundColor: 'black', flexGrow: 1 ,height: '120vh'}}>
      <AppBar position="static" sx={{ backgroundColor: 'black' }}>
        <Toolbar>
        <Button
        id="fade-button"
        aria-controls={open ? 'fade-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MenuIcon/>
      </Button>
      <Menu
        id="fade-menu"
        MenuListProps={{
          'aria-labelledby': 'fade-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={handleClose}>动漫列表</MenuItem>
        <MenuItem onClick={handleClose}>动漫论坛</MenuItem>
        <MenuItem onClick={handleClose}>个人主页</MenuItem>
      </Menu>
      <Box sx={{ flexGrow: 1 }}>
          <Button onClick = {() => navigate('/')}>
            <Typography variant="h7" component="div" sx={{ flexGrow: 1, color: 'white' }}>Anime Hub</Typography>
          </Button></Box>
          
          <TextField
            variant="outlined"
            placeholder="Search…"
            size="small"
            sx={{ backgroundColor: 'white', borderRadius: 5, mr: 2 }}
          />
        </Toolbar>
      </AppBar>
      
      <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#27292e',
          padding: 3,
          borderRadius: 1,
        }}
      >
        <Typography component="h1" variant="h5" style={{ color: 'white' }}>
          用户注册
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="账号"
            name="username"
            autoComplete="username"
            autoFocus
            InputLabelProps={{ style: { color: 'white' } }}
            InputProps={{ style: { color: 'white' } }}
            onChange={(e)=>setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="密码"
            type="password"
            id="password"
            autoComplete="current-password"
            InputLabelProps={{ style: { color: 'white' } }}
            InputProps={{ style: { color: 'white' } }}
            onChange={(e)=>setPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="确认密码"
            type="password"
            id="confirmPassword"
            autoComplete="confirm-password"
            InputLabelProps={{ style: { color: 'white' } }}
            InputProps={{ style: { color: 'white' } }}
            onChange={(e)=>setConfirmPassword(e.target.value)}
          />
          <Box sx={{ display: 'flex', justifyContent: 'center'}}>
          <Button
            onClick={handleRegister}
            type="Button"
            variant="contained"
            sx={{ mt: 3, mb: 2 , width:'80%'}}
            style={{ backgroundColor: '#eb3e17' }}
          >
            立即注册
          </Button>
          </Box>
          <Typography component="h5" style={{ color: 'white' }}>{message}</Typography>
          </Box>
      </Box>
    </Container>
    </Box>
  );
};

export default Register;