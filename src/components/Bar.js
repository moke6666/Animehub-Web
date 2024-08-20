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
import Slider from 'react-slick';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Login from './Login';  // 导入 Login 组件
import {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {logout} from './action';

const Bar = () => {

  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);


  const [openLogin, setOpenLogin] = useState(false);
  const [anchorElLogin, setAnchorElLogin] = useState(null);

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

  const navigate = useNavigate();

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