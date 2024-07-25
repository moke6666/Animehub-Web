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

export default function ButtonAppBar() {
  const [openLogin, setOpenLogin] = useState(false);

  const handleClickOpen = () => {
    setOpenLogin(true);
  };

  const handleCloseLogin = () => {
    setOpenLogin(false);
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

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true
  };

  const images = [
    './wallhaven-83v6o1.jpg', // 确保正确导入本地图片
    './wallhaven-mpxoxy.jpg',
    './wallhaven-rrdgp1.jpg'
  ];

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
          <AccountCircleIcon onClick = {handleClickOpen}></AccountCircleIcon>
        </Toolbar>
      </AppBar>
      <Box sx={{flexGrow:1, background:'black'}}>
      <Box sx={{ width: '80%', margin: 'auto', mt:2}}>
        <Slider {...settings}>
          {images.map((image, index) => (
            <div key={index} style={{ textAlign: 'center' }}>
              <div style={{ position: 'relative', width: '100%', paddingTop: '50%' }}>
              {/* 16:9 ratio */}
                <img
                  src={image}
                  alt={`Slide ${index + 1}`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: '15px',
                    objectFit: 'cover'
                  }}
                />
              </div>
            </div>
          ))}
        </Slider>
        </Box>
        <Login open={openLogin} onClose={handleCloseLogin} />
   </Box>
      <Box sx={{ width: '100%', margin: 'auto' }}>
          <AppBar position="static" sx={{ backgroundColor: 'black' }}>
          <Toolbar>
          <LocalFireDepartmentIcon
           ></LocalFireDepartmentIcon>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            热门推荐
          </Typography>
          </Toolbar>
          </AppBar>
          <Box sx={{ background:'black', flexGrow : 1}}>
            <Box sx={{background:'black', width: '85%', margin: '0 auto',display: 'flex', gap: 4}}>
            <CardActionArea sx={{ maxWidth: 250}}>
          <Card sx={{ maxWidth: 250, height: '100%', background: "black" }}>
          <CardMedia
            sx={{ height: 120 }}
            image='./wallhaven-6do1vw.jpg'
            title="green iguana"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div" sx={{color: 'white'}}>
              孤独摇滚！
            </Typography>
            <Typography variant="body2" color='white'>
            “孤独的 孤独的我就存在于此啊
            好似杂乱无章的音律 不成声地呐喊着“
            </Typography>
          </CardContent>
          </Card>
          </CardActionArea>
          <CardActionArea sx={{ maxWidth: 250}}>
          <Card sx={{ maxWidth: 250, height: '100%', background: "black" }}>
          <CardMedia
            sx={{ height: 120 }}
            image="./wallhaven-jxv9lp.png"
            title="green iguana"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div" sx={{color: 'white'}}>
              我推的孩子
            </Typography>
            <Typography variant="body2" color='white'>
              “什么，妈妈死了？没关系，我和妹妹把妈妈造出来不就好了”
            </Typography>
          </CardContent>
          
          </Card>
          </CardActionArea>
          <CardActionArea sx={{ maxWidth: 250}}>
          <Card sx={{ maxWidth: 250, height: '100%', background: "black" }}>
          <CardMedia
            sx={{ height: 120 }}
            image="./wallhaven-j355oy.jpg"
            title="green iguana"
          />
          <CardContent>  
            <Typography gutterBottom variant="h5" component="div" sx={{color: 'white'}}>
              咒术回战
            </Typography>
            <Typography variant="body2" color='white'>
              “呆交夫，我是无敌的”
              “会赢的”
              “抱歉宿傩大人，没能让你使出全力”
            </Typography>
          </CardContent>
          </Card>
          </CardActionArea>
          </Box>
        </Box>
      </Box>
      <Box sx={{ width: '100%', margin: 'auto'}}>
          <AppBar position="static" sx={{ backgroundColor: 'black' }}>
            <Toolbar>
              <FiberNewIcon></FiberNewIcon>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                新番推荐
              </Typography>
            </Toolbar>
          </AppBar>
          <Box sx={{ background:'black', flexGrow : 1}}>
            <Box sx={{background:'black', width: '85%', margin: '0 auto',display: 'flex', gap: 4}}>
            <CardActionArea sx={{ maxWidth: 250}}>
          <Card sx={{ maxWidth: 250, height: '100%', background: "black" }}>
          <CardMedia
            sx={{ height: 120 }}
            image="./p2910538464.webp"
            title="green iguana"
          />
          <CardContent>  
            <Typography gutterBottom variant="h6" component="div" sx={{color: 'white'}}>
              不时用俄语小声说真心话的邻桌艾莉同学
            </Typography>
            <Typography variant="body2" color='white'>
            ”「И наменятоже обрати внимание」“
            </Typography>
          </CardContent>
          
          </Card>
          </CardActionArea>
          <CardActionArea sx={{ maxWidth: 250}}>
          <Card sx={{ maxWidth: 250, height: '100%', background: "black" }}>
          <CardMedia
            sx={{ height: 120 }}
            image="./120721502_p0_master1200.jpg"
            title="green iguana"
          />
          <CardContent>  
            <Typography gutterBottom variant="h5" component="div" sx={{color: 'white'}}>
              小市民
            </Typography>
            <Typography variant="body2" color='white'>
              “你是狼”
              “你是狐狸”
              “即便如此，我们也要作为小市民活着”
            </Typography>
          </CardContent>
          
          </Card>
          </CardActionArea>
          <CardActionArea sx={{ maxWidth: 250}}>
          <Card sx={{ maxWidth: 250, height: '100%', background: "black" }}>
          <CardMedia
            sx={{ height: 120 }}
            image="./wallhaven-r7g7eq.jpg"
            title="green iguana"
          />
          <CardContent>  
            <Typography gutterBottom variant="h5" component="div" sx={{color: 'white'}}>
              哭泣少女乐队
            </Typography>
            <Typography variant="body2" color='white'>
              “我希望桃香小姐也不要认输！！”
              “和我一起竖起中指吧！！！”
            </Typography>
          </CardContent>
          
          </Card>
          </CardActionArea>

            </Box>
          </Box>
      </Box>
      
    </Box>
  );
}
