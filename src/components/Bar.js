import * as React from 'react';  // 导入 React 库
import AppBar from '@mui/material/AppBar';  // 导入 Material-UI 的 AppBar 组件
import Box from '@mui/material/Box';  // 导入 Material-UI 的 Box 组件
import Toolbar from '@mui/material/Toolbar';  // 导入 Material-UI 的 Toolbar 组件
import Typography from '@mui/material/Typography';  // 导入 Material-UI 的 Typography 组件
import Button from '@mui/material/Button';  // 导入 Material-UI 的 Button 组件
import MenuIcon from '@mui/icons-material/Menu';  // 导入 Material-UI 的 Menu 图标
import TextField from '@mui/material/TextField';  // 导入 Material-UI 的 TextField 组件（用于搜索栏）
import { useNavigate } from 'react-router-dom';  // 导入 React Router 的 useNavigate 钩子
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Login from './Login';  // 导入 Login 组件
import {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {logout} from './action';
import axios from 'axios';

const Bar = () => {

  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();

  const [openLogin, setOpenLogin] = useState(false);
  const [anchorElLogin, setAnchorElLogin] = useState(null);
  const [value, setValue] = useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  }

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      try {
        navigate(`/AnimeSearchbyName/${value}`);
      } catch (error) {
        console.error('Error fetching anime data:', error);
      }
    }
  };

  const handleClickOpen = () => {
    setOpenLogin(true);
  };

  const handleCloseLogin = () => {
    setOpenLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshtoken');
    dispatch(logout());
    setAnchorElLogin(null);
  };

  const handleMenu = (event) => {
    setAnchorElLogin(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorElLogin(null);
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
        <MenuItem onClick={() => navigate('/AnimeList')}>动漫列表</MenuItem>
        <MenuItem onClick={handleClose}>动漫论坛</MenuItem>
        <MenuItem onClick={() => navigate('/SelfPage')}>个人主页</MenuItem>
      </Menu>
      <Box sx={{ flexGrow: 1 }}>
          <Button onClick = {() => navigate('/')}>
            <Typography variant="h7" component="div" sx={{ flexGrow: 1, color: 'white' }}>Anime Hub</Typography>
          </Button></Box>
          <TextField
            variant="outlined"
            placeholder="Search…"
            size="small"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            sx={{ backgroundColor: 'white', borderRadius: 5, mr: 7 }}
          />
          {isLoggedIn ? (
        <div>
          <AccountCircleIcon onClick={handleMenu} sx={{ color: '#183A4F' }}>Menu</AccountCircleIcon>
          <Menu
            anchorEl={anchorElLogin}
            open={Boolean(anchorElLogin)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      ) :(
          <AccountCircleIcon onClick = {handleClickOpen}></AccountCircleIcon>)}
          <Login open={openLogin} onClose={handleCloseLogin} />
        </Toolbar>
      </AppBar>
  )
}

export default Bar;