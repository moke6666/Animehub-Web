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

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleRegister = async () => {
    try {
        const response = await axios.post('http://localhost:3001/register', { username, password });
        setMessage(response.data); 
      } catch (error) {
        if (error.response && error.response.data) {
          setMessage(error.response.data);
        } else {
          setMessage('Registration failed. Please try again.');
        }
    }
  };

  return (
    <Box sx={{ backgroundColor: 'black', flexGrow: 1 ,height: '100vh'}}>
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
      
    <div>
      <h2>Register</h2>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
      <p>{message}</p>
    </div>
    </Box>
  );
};

export default Register;