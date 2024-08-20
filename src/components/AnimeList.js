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
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useDispatch, useSelector } from 'react-redux';
import {logout} from './action';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import './AnimeCard.css'; // 导入上面的CSS样式

const fetchAnimesWithRetry = async (url, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(url);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.status === 429) {
        // 如果是 429 错误，等待一段时间后重试
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
  throw new Error('Failed to fetch after multiple retries');
};

const AnimeList = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();
  const [animestop, setAnimesTop] = useState([]); //储存top的动漫信息，数组
  const [animesUpcoming, setAnimesUpcoming] = useState([]);//储存Upcoming的动漫信息，数组
  const [animesRecommand, setAnimesRecommand] = useState([]);
  const [pageTop, setPageTop] = useState(0);  // 定义Top的页码状态
  const [pageUpcoming, setPageUpcoming] = useState(0); //定义Upcoming的页码状态
  const [pageRecommand, setPageRecommand] = useState(0);
  const [anchorElLogin, setAnchorElLogin] = useState(null);

  const animesPerPage = 5;  // 每页显示的动漫数量

  const [openLogin, setOpenLogin] = useState(false);

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

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenu = (event) => {
    setAnchorElLogin(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorElLogin(null);
  };
  useEffect(() => {
    const fetchAnimes = async () => {
      try {
        const topAnimes = await fetchAnimesWithRetry('https://api.jikan.moe/v4/top/anime');
        const upcomingAnimes = await fetchAnimesWithRetry('https://api.jikan.moe/v4/seasons/now');
        const recommandAnimes = await fetchAnimesWithRetry('https://api.jikan.moe/v4/recommendations/anime');
        setAnimesTop(topAnimes);
        setAnimesUpcoming(upcomingAnimes);
        setAnimesRecommand(recommandAnimes);
      } catch (error) {
        console.error('Failed to fetch animes', error);
      }
    };
    fetchAnimes();
  }, []);

  const handleNextPageTop = () => {
    setPageTop((prevPage) => (prevPage + 1) % Math.ceil(animestop.length / animesPerPage));  // 切换到下一页
  };//top换页方法

  const handlePrevPageTop = () => {
    setPageTop((prevPage) => (prevPage - 1 + Math.ceil(animestop.length / animesPerPage)) % Math.ceil(animestop.length / animesPerPage));  // 切换到上一页
  };//top向前换页方法

  const handlePrevPageUpcoming = () => {
    setPageUpcoming((prevPage) => (prevPage - 1 + Math.ceil(animesUpcoming.length / animesPerPage)) % Math.ceil(animesUpcoming.length / animesPerPage));  // 切换到上一页
  };//Upcoming前换页方法

  const handleNextPageUpcoming = () => {
    setPageUpcoming((prevPage) => (prevPage + 1) % Math.ceil(animesUpcoming.length / animesPerPage));  // 切换到下一页
  };//Upcoming后换页方法

  const handlePrevPageRecommand = () => {
    setPageRecommand((prevPage) => (prevPage - 1 + Math.ceil(animesRecommand.length / animesPerPage)) % Math.ceil(animesRecommand.length / animesPerPage));  // 切换到上一页
  };//recommand前换页

  const handleNextPageRecommand = () => {
    setPageRecommand((prevPage) => (prevPage + 1) % Math.ceil(animesRecommand.length / animesPerPage));  // 切换到下一页
  };//recommend后换页
  
  const currentAnimestop = animestop.slice(pageTop * animesPerPage, (pageTop + 1) * animesPerPage);//Top当前四个动漫
  const currentAnimesUpcoming = animesUpcoming.slice(pageUpcoming * animesPerPage, (pageUpcoming + 1) * animesPerPage);//Upcoming当前四个动漫
  const currentAnimesRecommand = animesRecommand.slice(pageRecommand * animesPerPage, (pageRecommand+1) * animesPerPage); //Recommand的当前五个动漫

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
      <AppBar position="static" sx={{ backgroundColor: 'black' }}>
          <Toolbar>
          <LocalFireDepartmentIcon
           ></LocalFireDepartmentIcon>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Top 榜单
          </Typography>
          <ChevronRightIcon variant="contained" onClick={handlePrevPageTop} sx={{transform: 'rotate(180deg)',fontSize: '2rem', backgroundColor: 'black', color: 'white'}}>
        </ChevronRightIcon>
          <ChevronRightIcon variant="contained" onClick={handleNextPageTop} sx={{fontSize: '2rem', backgroundColor: 'black', color: 'white'}}>
        </ChevronRightIcon>
          </Toolbar>
          </AppBar>
    <Box sx={{ background:'black', display: 'flex', flexWrap: 'wrap', gap: 2, p: 2 }}>
      {currentAnimestop.map(anime => (
        <Card 
          className="anime-card"
          key={anime.id} 
          sx={{borderRadius: '15px', background:'black', maxWidth: 160, maxHeight: 310, flex: '1 1 calc(20% - 16px)', m: 1.2, transition: '0.3s', '&:hover': { boxShadow: 6 } }}
        >
          <CardActionArea component={Link} to={`/anime-detail/${anime.mal_id}`} sx={{ height: '100%' }}>
          <Box sx = {{display:"flex", flexDirection : "column", gap : 1}}>
            <CardMedia
              component="img"
              height="210"
              image={anime.images.jpg.image_url} 
              alt={anime.title}
              sx={{ objectFit: 'cover' ,borderRadius: '15px'}}
              
            />
            <Box className="play-button">
            <PlayCircleOutlineIcon sx={{ fontSize: 50, color: '#474144' }} />
            </Box>
            
            <Typography variant="body4" color="white">
               {anime.score}
             </Typography>
              <Typography variant="body4" color="white" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {anime.title}
              </Typography>
              </Box>
         </CardActionArea>
        </Card>
      ))}
      
      </Box>
      <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: 'black' }}>
          <Toolbar>
          <LocalFireDepartmentIcon
           ></LocalFireDepartmentIcon>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Upcoming 榜单
          </Typography>
          <ChevronRightIcon variant="contained" onClick={handlePrevPageUpcoming} sx={{transform: 'rotate(180deg)',fontSize: '2rem', backgroundColor: 'black', color: 'white'}}>
        </ChevronRightIcon>
          <ChevronRightIcon variant="contained" onClick={handleNextPageUpcoming} sx={{fontSize: '2rem', backgroundColor: 'black', color: 'white'}}>
        </ChevronRightIcon>
          </Toolbar>
          </AppBar>
    <Box sx={{ background:'black', display: 'flex', flexWrap: 'wrap', gap: 2, p: 2 }}>
      {currentAnimesUpcoming.map(anime => (
        <Card 
          key={anime.id} 
          sx={{borderRadius: '15px', background:'black', maxWidth: 160, maxHeight: 310, flex: '1 1 calc(20% - 16px)', m: 1.2, transition: '0.3s', '&:hover': { boxShadow: 6 } }}
        >
          <CardActionArea component={Link} to={`/anime-detail/${anime.mal_id}`} sx={{ height: '100%' }}>
          <CardMedia
              component="img"
              height="210"
              image={anime.images.jpg.image_url} 
              alt={anime.title}
            />
            <CardContent sx={{background:'black', flexGrow:1, height:'100%'}}>
              <Typography variant="body2" color="white"sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {anime.title}
              </Typography>
            </CardContent>
         </CardActionArea>
        </Card>
      ))}
      </Box>
    </Box>
    <Box sx={{ flexGrow: 1 }}>
    <AppBar position="static" sx={{ backgroundColor: 'black' }}>
          <Toolbar>
          <LocalFireDepartmentIcon
           ></LocalFireDepartmentIcon>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            推荐榜单
          </Typography>
          <ChevronRightIcon variant="contained" onClick={handlePrevPageRecommand} sx={{transform: 'rotate(180deg)',fontSize: '2rem', backgroundColor: 'black', color: 'white'}}>
        </ChevronRightIcon>
          <ChevronRightIcon variant="contained" onClick={handleNextPageRecommand} sx={{fontSize: '2rem', backgroundColor: 'black', color: 'white'}}>
        </ChevronRightIcon>
          </Toolbar>
          </AppBar>
    <Box sx={{ background:'black', display: 'flex', flexWrap: 'wrap', gap: 2, p: 2 }}>
      {currentAnimesRecommand.map(anime => (
          <Card
            key={anime.mal_id}
            sx={{ background: 'black', width: 160, height: 310, m: 1.2, transition: '0.3s', '&:hover': { boxShadow: 6 } }}
          >
          <CardActionArea component={Link} to={`/anime-detail/${anime.entry[0].mal_id}`} sx={{ height: '100%' }}>
          <CardMedia
              component="img"
              height="210"
              image={anime.entry[0].images.jpg.image_url} 
              alt={anime.entry[0].title}
            />
            <CardContent sx={{background:'black', flexGrow:1, height:'100%'}}>
              <Typography variant="body2" color="white"sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {anime.entry[0].title}
              </Typography>
            </CardContent>
         </CardActionArea>
        </Card>
        ))}
        
      
      </Box>
    </Box>
    </Box>
  );
};

export default AnimeList;
