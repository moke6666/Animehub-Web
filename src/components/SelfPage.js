import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import Bar from './Bar';

const SelfPage = () => {
  const [favorites, setFavorites] = useState([]); // 收藏的动漫
  const [commentedAnime, setCommentedAnime] = useState([]); // 评论过的动漫
  const [replies, setReplies] = useState([]); // 收到的回复

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 模拟 API 调用，获取用户数据
        const favoriteResponse = await fetch('/api/user/favorites');
        const favoriteData = await favoriteResponse.json();
        setFavorites(favoriteData);

        const commentedResponse = await fetch('/api/user/commentedAnime');
        const commentedData = await commentedResponse.json();
        setCommentedAnime(commentedData);

        const repliesResponse = await fetch('/api/user/replies');
        const repliesData = await repliesResponse.json();
        setReplies(repliesData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <Box sx={{ background: 'black', minHeight: '100vh', padding: 4 }}>
      <Bar></Bar>
      <Typography variant="h7" color="white" gutterBottom>
        username
      </Typography>

      {/* 收藏的动漫 */}
      <Typography variant="h5" color="white" gutterBottom>
        likes
      </Typography>
      <Grid container spacing={2}>
        {favorites.map((anime) => (
          <Grid item xs={12} sm={6} md={4} key={anime.animeId}>
            <Card sx={{ maxWidth: 345, backgroundColor: '#1c1c1c', color: 'white' }}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="140"
                  image={anime.image_url}
                  alt={anime.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {anime.title}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ backgroundColor: 'white', marginY: 4 }} />

      {/* 评论过的动漫 */}
      <Typography variant="h5" color="white" gutterBottom>
        评论过的动漫
      </Typography>
      <List>
        {commentedAnime.map((anime) => (
          <ListItem key={anime.id} sx={{ backgroundColor: '#1c1c1c', marginY: 1 }}>
            <ListItemText
              primary={anime.title}
              secondary={anime.comment}
              sx={{ color: 'white' }}
            />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ backgroundColor: 'white', marginY: 4 }} />

      {/* 收到的回复 */}
      <Typography variant="h5" color="white" gutterBottom>
        收到的回复
      </Typography>
      <List>
        {replies.map((reply) => (
          <ListItem key={reply.id} sx={{ backgroundColor: '#1c1c1c', marginY: 1 }}>
            <ListItemText
              primary={`来自: ${reply.fromUser}`}
              secondary={reply.content}
              sx={{ color: 'white' }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SelfPage;
