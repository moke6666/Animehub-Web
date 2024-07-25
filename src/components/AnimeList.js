import * as React from 'react';  // 导入 React 库
import AppBar from '@mui/material/AppBar';  // 导入 Material-UI 的 AppBar 组件
import Box from '@mui/material/Box';  // 导入 Material-UI 的 Box 组件
import Toolbar from '@mui/material/Toolbar';  // 导入 Material-UI 的 Toolbar 组件
import Typography from '@mui/material/Typography';  // 导入 Material-UI 的 Typography 组件
import Button from '@mui/material/Button';  // 导入 Material-UI 的 Button 组件
import MenuIcon from '@mui/icons-material/Menu';  // 导入 Material-UI 的 Menu 图标
import TextField from '@mui/material/TextField';  // 导入 Material-UI 的 TextField 组件（用于搜索栏）
import { useNavigate, Link } from 'react-router-dom';  // 导入 React Router 的 useNavigate 钩子
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Login from './Login';  // 导入 Login 组件
import axios from 'axios';
import { useEffect, useState} from 'react';  // 导入 React 库及相关钩子
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';





const AnimeList = () => {
  const navigate = useNavigate();
  const [animes, setAnimes] = useState([]);
  const [page, setPage] = useState(0);  // 定义当前页码状态
  const animesPerPage = 4;  // 每页显示的动漫数量

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
  useEffect(() => {
    // 调用API获取动漫列表
    const fetchAnimes = async () => {
      const response = await axios.get('https://api.jikan.moe/v4/top/anime'); // 替换为实际的API端点
      setAnimes(response.data.data); // 根据实际API的返回数据格式进行调整
    };
    fetchAnimes();
  }, []);

  const handleNextPage = () => {
    setPage((prevPage) => (prevPage + 1) % Math.ceil(animes.length / animesPerPage));  // 切换到下一页
  };

  const handlePrevPage = () => {
    setPage((prevPage) => (prevPage - 1 + Math.ceil(animes.length / animesPerPage)) % Math.ceil(animes.length / animesPerPage));  // 切换到上一页
  };

  const currentAnimes = animes.slice(page * animesPerPage, (page + 1) * animesPerPage);


  return (
    <Box sx={{ backgroundColor: 'black', flexGrow: 1}}>
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
          <Login open={openLogin} onClose={handleCloseLogin} />
        </Toolbar>
      </AppBar>
      <AppBar position="static" sx={{ backgroundColor: 'black' }}>
          <Toolbar>
          <LocalFireDepartmentIcon
           ></LocalFireDepartmentIcon>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Top 榜单
          </Typography>
          </Toolbar>
          </AppBar>
    <Box sx={{ background:'black', display: 'flex', flexWrap: 'wrap', gap: 2, p: 2 }}>
      {currentAnimes.map(anime => (
        <Card 
          key={anime.id} 
          sx={{background:'black', maxWidth: 200, flex: '1 1 calc(20% - 16px)', m: 1, transition: '0.3s', '&:hover': { boxShadow: 6 } }}
        >
          <CardActionArea component={Link} to={`/anime-detail/${anime.id}`}>
            <CardMedia
              component="img"
              height="300"
              image={anime.images.jpg.image_url} // 替换为实际的图像URL字段
              alt={anime.title}
            />

            <CardContent sx={{background:'black', flexGrow:1, height:'100%'}}>
            <Typography variant="body2" color="white">
              {anime.mal_id}</Typography>

            
            <Typography variant="body2" color="white">
               
                {anime.score}
              </Typography>
              <Typography variant="body2" color="white">
                {anime.title}
              </Typography>
            </CardContent>
         </CardActionArea>
        </Card>
      ))}
    </Box>
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2, gap: 2 }}>
        <Button variant="contained" onClick={handlePrevPage} sx={{backgroundColor: 'white', color: 'black'}}>
          上一页
        </Button>
        <Button variant="contained" onClick={handleNextPage} sx={{backgroundColor: 'white', color: 'black'}}>
          下一页
        </Button>
      </Box>
    </Box>
  );
};

export default AnimeList;
