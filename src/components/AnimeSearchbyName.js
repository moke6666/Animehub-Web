
import React, { useEffect, useState } from 'react';
import { useParams,Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  CircularProgress,
  Alert
} from '@mui/material';
import Bar from "./Bar";


const AnimeSearchByName = () => {
  const { name } = useParams(); // 获取 URL 参数中的动漫名称
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchAnime = async () => {
      try {
        console.log("Fetching anime for:", name);
        setLoading(true);
        setError(null);
  
        const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(name)}`);
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
  
        const data = await response.json();
        console.log("API response:", data);
        setAnimeList(data.data || []); // 确保 data.data 存在
      } catch (error) {
        console.error("Fetch error:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    if (name) {
      fetchAnime();
    }
  }, [name]);
  
  return (
    <Box sx={{ backgroundColor: 'black', flexGrow: 1}}> 
    <Bar></Bar>
    <Box sx={{ background: 'black', minHeight: '100vh', padding: 4 }}>
      <Typography variant="h4" gutterBottom color="white" align="center">
        搜索结果: “{name}”
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress color="primary" />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ margin: 2 }}>
          无法加载数据: {error}
        </Alert>
      )}

      {!loading && !error && animeList.length === 0 && (
        <Typography variant="h6" color="white" align="center">
          未找到与 “{name}” 匹配的动画。
        </Typography>
      )}

      <Grid container spacing={3}>
        {animeList.map((anime) => (
          <Grid item xs={12} sm={6} md={4} key={anime.mal_id}>
            <Card sx={{ maxWidth: 345, backgroundColor: '#1c1c1c', color: 'white' }}>
              <CardActionArea  component={Link} to={`/anime-detail/${anime.mal_id}`} sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={anime.images?.jpg?.image_url || ''}
                  alt={anime.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {anime.title}
                  </Typography>
                  <Typography variant="body2" color="white">
                    {anime.synopsis ? anime.synopsis.slice(0, 100) + '...' : '暂无简介'}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
    </Box>
  );
};

export default AnimeSearchByName;
