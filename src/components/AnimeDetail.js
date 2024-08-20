import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import Bar from "./Bar";
import {
  Box,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import Login from "./Login";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar"; // 导入 Material-UI 的 AppBar 组件
import Toolbar from "@mui/material/Toolbar"; // 导入 Material-UI 的 Toolbar 组件
import MenuIcon from "@mui/icons-material/Menu"; // 导入 Material-UI 的 Menu 图标
import { Link } from "react-router-dom"; // 导入 React Router 的 useNavigate 钩子
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const CustomTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "white", // 聚焦时标签颜色
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "white", // 聚焦时下划线颜色
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "gray", // 初始边框颜色
    },
    "&:hover fieldset": {
      borderColor: "white", // 鼠标悬停时边框颜色
    },
    "&.Mui-focused fieldset": {
      borderColor: "white", // 聚焦时边框颜色
    },
  },
});

const AnimeDetail = () => {
  const [animeDetail, setAnimeDetail] = useState(null);
  const [charactersDetail, setCharactersDetail] = useState([]);
  const [comment, setComment] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [message, setMessage] = useState("");
  const [animeId, setAnimeId] = useState("");
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const username = useSelector((state) => state.auth.username);
  const { id } = useParams();
  const [rating, setRating] = useState(2.5);
  const [mainGenreId, setmainGenreId] = useState(0);
  const [comments, setComments] = useState([]);
  const [pageRecommand, setPageRecommand] = useState(0);
  const [Id, setId] = useState([]);
  const [similarAnime, setsimilarAnime] = useState([]);
  const [isloading, setisloading] = useState(true);
  const [activeReply, setActiveReply] = useState(null);
  const [replyText, setReplyText] = useState("");

  const animesPerPage = 5;

  useEffect(() => {
    setAnimeId(id);
  }, [id]);


    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/comments/${animeId}`
        );
        setComments(response.data);
        console.log("评论如下：", response.data);
      } catch (error) {
        console.error("获取评论时出错:", error);
      }
    };

    

  useEffect(() => {
    fetchComments();
  }, [animeId]);

  useEffect(() => {
    console.log("Updated comments:", comments);
  }, [comments]);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (isLoggedIn && username) {
        try {
          const response = await axios.get(
            `http://localhost:3001/favorites/${username}`
          );
          setFavorites(response.data.map((fav) => fav.animeId));
        } catch (error) {
          console.error("Error fetching favorite status:", error);
        }
      }
    };
    checkFavoriteStatus();
  }, [isLoggedIn, username]);

  const [openLogin, setOpenLogin] = useState(false);

  const handleOpenLogin = () => {
    setOpenLogin(true);
  };

  const handleCloseLogin = () => {
    setOpenLogin(false);
  };

  const handleFavorite = async () => {
    if (!isLoggedIn) {
      handleOpenLogin();
      return;
    }
    try {
      const response = await axios.post("http://localhost:3001/favorite", {
        animeId,
        username,
      });
      setFavorites((prev) => [...prev, animeId]);
      setMessage("收藏成功");
    } catch (error) {
      setMessage(error.response?.data || "收藏失败");
    }
  };

  const handleCancelFavorite = async () => {
    try {
      await axios.delete("http://localhost:3001/favorite", {
        data: { animeId, username },
      });
      setFavorites((prev) => prev.filter((favId) => favId !== animeId));
      setMessage("取消收藏成功");
    } catch (error) {
      setMessage(error.response?.data || "取消收藏失败");
    }
  };

  const handleAddCommentAndRating = async () => {
    if (!isLoggedIn) {
      handleOpenLogin();
      return;
    }
    if (comment.length < 10) {
      setMessage("评论必须至少十个字");
      return;
    }
    try {
      const response = await axios.post("http://localhost:3001/comments", {
        animeId: id,
        username,
        comment,
        rating,
      });
      setComments((prev) => [...prev, response.data]);
      setComment("");
      setMessage("评论和评分提交成功");
    } catch (error) {
      setMessage(error.response?.data || "评论和评分提交失败");
    }
  };

  const handleReplyOpen = (commentId) => {
    setActiveReply(commentId);
  };

  const handleReplyClose = () => {
    setActiveReply(null);
    setReplyText("");
  };

  const handleAddReply = async (commentId) => {
    const comment = replyText;
    await axios.post(`http://localhost:3001/comments/${commentId}/reply`, {
      comment,
      username,
    });
    console.log(`Reply to comment ID: ${commentId}, text: ${replyText}`);
    fetchComments();
    handleReplyClose();
  };

  useEffect(() => {
    setPageRecommand(0);
    setsimilarAnime([]);
  }, [animeId]);

  useEffect(() => {
    console.log("Updated similarAnime:", similarAnime);
    // 你可以在这里处理 similarAnime 的数据，比如分页展示等
  }, [similarAnime]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取动漫详情
        const response = await axios.get(
          `https://api.jikan.moe/v4/anime/${animeId}`
        );
        const animeData = response.data.data;
        setAnimeDetail(animeData);

        // 获取角色信息
        const response2 = await axios.get(
          `https://api.jikan.moe/v4/anime/${animeId}/characters`
        );
        setCharactersDetail(response2.data.data);
        const searchTerm = "Too Many Losing Heroines";
        const encodedSearchTerm = encodeURIComponent(searchTerm);
        const response3 = await axios.get(
          `https://api.jikan.moe/v4/anime?q=${encodedSearchTerm}&limit=1`
        );
        console.log("请求结果：", response3.data);

        // 提取动漫类型
        if (animeData && animeData.genres && animeData.genres.length > 0) {
          console.log("genres:", animeData.genres[0]);
          console.log("rating", animeData.rating);
          const mainGenres = animeData.genres
            .slice(0, 2)
            .map((genre) => genre.mal_id);
          const rating = animeData.rating;
          const year = animeData.year == 0 ? 2010 : animeData.year;
          const yearRange =
            year <= 2018
              ? { start: year - 5, end: year + 5 }
              : { start: year - 5, end: 2024 };

          if (mainGenres) {
            const similarAnimeIds = await fetchAnimeIdsByGenres(
              mainGenres,
              rating,
              yearRange
            );
            const similarAnimeDetails = await fetchAnimeDetailsByIdsInBatches(
              similarAnimeIds
            );
            console.log("Similar Anime Details:", similarAnimeDetails);
            if (
              Array.isArray(similarAnimeDetails) &&
              similarAnimeDetails.length > 0
            ) {
              console.log(
                "Final similarAnimeDetails before setting state:",
                similarAnimeDetails
              );
              setsimilarAnime(similarAnimeDetails);
            } else {
              console.error(
                "Failed to set similarAnime, similarAnimeDetails is empty or not an array."
              );
            }
          }
        } else {
          console.error("No genres found for this anime");
        }
      } catch (error) {
        console.error("Error fetching anime details:", error);
      }
    };

    fetchData();
  }, [animeId]);

  const fetchAnimeIdsByGenres = async (genreIds, rating, yearRange) => {
    try {
      const allAnimeIds = new Set(); // 使用 Set 来避免重复

      // 尝试用不同数量的类型来查询
      for (let i = genreIds.length; i > 0; i--) {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Increase delay to 2 seconds
        const genreQuery = genreIds
          .slice(0, i)
          .map((id) => `${id}`)
          .join(",");

        const response = await axios.get(
          `https://api.jikan.moe/v4/anime?genres=${genreQuery}&start_date=${yearRange.start}-01-01&end_date=${yearRange.end}-12-31&limit=20`
        );

        // 将新获取到的动漫 ID 添加到 Set 中
        const filteredAnime = response.data.data.filter(
          (anime) => anime.rating === rating
        );

        filteredAnime.forEach((anime) => allAnimeIds.add(anime.mal_id));

        // 如果已经获取到 10 个或更多的动漫，则停止查询
        if (allAnimeIds.size >= 10) {
          break;
        }
      }

      // 返回前 10 个动漫 ID，如果不足 10 个则返回所有找到的
      return Array.from(allAnimeIds).slice(0, 10);
    } catch (error) {
      console.error("Error fetching anime by genres:", error);
      return [];
    }
  };

  const fetchAnimeDetailsByIdsInBatches = async (animeIds) => {
    const batchSize = 5; // 每次加载的数量
    const allAnimeDetails = [];
    setisloading(true);
    for (let i = 0; i < animeIds.length; i += batchSize) {
      const batchIds = animeIds.slice(i, i + batchSize); // 分批获取 ID
      try {
        const animeDetails = await Promise.all(
          batchIds.map(async (id) => {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // 延迟请求，防止 API 速率限制
            const response = await axios.get(
              `https://api.jikan.moe/v4/anime/${id}`
            );
            return response.data.data;
          })
        );
        setisloading(false);
        allAnimeDetails.push(...animeDetails); // 将获取到的数据添加到总数组中

        // 在这里可以选择更新前端状态，渲染已加载的数据
        setsimilarAnime((prev) => [...prev, ...animeDetails]); // 假设你有一个 similarAnime 状态来存储结果

        // 如果需要等待用户操作或其他事件，可以在这里等待
        console.log(`Loaded batch ${i / batchSize + 1}:`, animeDetails);
      } catch (error) {
        console.error("Error fetching anime details by IDs:", error);
      }
    }

    return allAnimeDetails; // 返回所有获取到的动漫详情
  };

  const currentSimilarAnime = similarAnime.slice(
    pageRecommand * animesPerPage,
    (pageRecommand + 1) * animesPerPage
  );

  if (!animeDetail) {
    return <Typography>Loading...</Typography>;
  }

  const handlePrevPageRecommand = () => {
    setPageRecommand(
      (prevPage) =>
        (prevPage - 1 + Math.ceil(similarAnime.length / animesPerPage)) %
        Math.ceil(similarAnime.length / animesPerPage)
    ); // 切换到上一页
  }; //recommand前换页

  const handleNextPageRecommand = () => {
    setPageRecommand(
      (prevPage) =>
        (prevPage + 1) % Math.ceil(similarAnime.length / animesPerPage)
    ); // 切换到下一页
  }; //recommend后换页

  // 总是执行 useEffect 钩子

  //Recommand的当前五个动漫

  return (
    <Box sx={{ background: "black" }}>
      <Bar></Bar>
      <Box
        sx={{
          background: "black",
          display: "flex",
          flexWrap: "nowwrap",
          gap: 5,
          p: 5,
        }}
      >
        <img
          src={animeDetail.images.jpg.image_url}
          alt={animeDetail.title}
          style={{ maxWidth: "160", maxHeight: "210", borderRadius: "15px" }}
          sx={{ mt: 2 }}
        />
        <Box
          sx={{
            maxWidth: "400px",
            display: "flex",
            flexDirection: "column",
            gap: 1,
            maxHeight: "210",
          }}
        >
          <Typography variant="h4" component="h1" color={"white"}>
            {animeDetail.title} {Id[0]}
          </Typography>
          <Typography variant="body1" color={"white"}>
            总集数 : {animeDetail.episodes}
          </Typography>
          <Typography
            variant="body1"
            color={"white"}
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              WebkitLineClamp: 3, // 控制显示的行数
              lineClamp: 3,
            }}
          >
            简介 : {animeDetail.synopsis}
          </Typography>

          <Box sx={{ background: "black", display: "flex", flexWrap: "wrap" }}>
            <Typography variant="body1" color={"white"}>
              声优 :
            </Typography>
            {charactersDetail.slice(0, 5).map((characterData) =>
              characterData.voice_actors.slice(0, 1).map((voiceActor) => (
                <Typography
                  key={voiceActor.person.mal_id}
                  sx={{ color: "white" }}
                >
                  {voiceActor.person.name}
                </Typography>
              ))
            )}
            <Typography variant="body1" color={"white"}>
              ......
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }}></Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            {isLoggedIn ? (
              favorites.includes(animeId) ? (
                <FavoriteIcon
                  variant="contained"
                  onClick={handleCancelFavorite}
                  sx={{ maxWidth: "150px", color: "pink" }}
                />
              ) : (
                <FavoriteBorderIcon
                  variant="contained"
                  onClick={handleFavorite}
                  sx={{ maxWidth: "150px", color: "pink" }}
                />
              )
            ) : (
              <FavoriteBorderIcon
                variant="contained"
                onClick={handleOpenLogin}
                sx={{ maxWidth: "150px", color: "pink" }}
              />
            )}
            <Login open={openLogin} onClose={handleCloseLogin} />
            <ThumbUpOffAltIcon
              variant="contained"
              sx={{ color: "pink" }}
            ></ThumbUpOffAltIcon>
          </Box>
        </Box>
        <Box
          sx={{
            maxWidth: "400px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center", // 居中对齐
            justifyContent: "center", // 居中对齐
            gap: 2,
            maxHeight: "210",
            background: "#242023",
            borderRadius: "15px", // 圆角
            padding: 3, // 内边距
          }}
        >
          <Stack spacing={1}>
            <Rating
              name="half-rating"
              defaultValue={2.5}
              precision={0.5}
              onChange={(event, newValue) => {
                if (!isLoggedIn) {
                  handleOpenLogin();
                  return;
                }
                setRating(newValue);
              }}
            />
          </Stack>
          <CustomTextField
            fullWidth
            variant="outlined"
            placeholder="Add a comment"
            value={comment}
            multiline
            rows={4}
            onChange={(e) => setComment(e.target.value)}
            sx={{ mt: 2, background: "#425D5F" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddCommentAndRating}
            sx={{ mt: 2, maxWidth: "200px" }}
          >
            Rating
          </Button>
        </Box>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: "black" }}>
          <Toolbar>
            <LocalFireDepartmentIcon></LocalFireDepartmentIcon>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              相似动漫
            </Typography>
            <ChevronRightIcon
              variant="contained"
              onClick={handlePrevPageRecommand}
              sx={{
                transform: "rotate(180deg)",
                fontSize: "2rem",
                backgroundColor: "black",
                color: "white",
              }}
            ></ChevronRightIcon>
            <ChevronRightIcon
              variant="contained"
              onClick={handleNextPageRecommand}
              sx={{
                fontSize: "2rem",
                backgroundColor: "black",
                color: "white",
              }}
            ></ChevronRightIcon>
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            background: "black",
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            p: 2,
          }}
        >
          {isloading ? (
            <Typography sx={{ color: "white" }}>Loading...</Typography>
          ) : (
            currentSimilarAnime.map((anime) => (
              <Card
                key={anime.mal_id}
                sx={{
                  background: "black",
                  width: 160,
                  height: 260,
                  m: 1.2,
                  transition: "0.3s",
                  "&:hover": { boxShadow: 6 },
                }}
              >
                <CardActionArea
                  component={Link}
                  to={`/anime-detail/${anime.mal_id}`}
                  sx={{ height: "100%" }}
                >
                  <CardMedia
                    component="img"
                    height="210"
                    image={anime.images.jpg.image_url}
                    alt={anime.title}
                  />
                  <CardContent
                    sx={{ background: "black", flexGrow: 1, height: "100%" }}
                  >
                    <Typography
                      variant="body2"
                      color="white"
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {anime.title}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))
          )}
        </Box>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: "black" }}>
          <Toolbar>
            <LocalFireDepartmentIcon></LocalFireDepartmentIcon>
            <Typography variant="h6" component="div">
              评论区
            </Typography>
            <Typography
              variant="body1"
              component="div"
              sx={{ flexGrow: 1, paddingLeft: 2 }}
            >
              共有{comments.length}条评论
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      {comments.length > 0 ? (
        <List sx={{ maxHeight: "300px", overflow: "auto" }}>
          {comments.map((comment) => (
            <React.Fragment key={comment._id}>
              <ListItem alignItems="flex-start" sx={{ color: "white" }}>
                <ListItemText
                  sx={{ paddingLeft: 4 }}
                  primary={`用户名: ${comment.username}`}
                  secondary={
                    <Box
                      sx={{
                        maxWidth: "400px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        maxHeight: "210",
                      }}
                    >
                      <Box sx={{ marginTop: "8px" }}>
                        <Rating
                          value={comment.rating}
                          readOnly
                          size="small"
                          sx={{ paddingTop: 2 }}
                        />
                      </Box>
                      <Box>
                        <Typography
                          sx={{ display: "inline" }}
                          component="span"
                          variant="body2"
                          color="white"
                        >
                          {comment.comment}
                        </Typography>
                        <Button
                          sx={{ paddingLeft: 4}}
                          onClick={() => handleReplyOpen(comment._id)}
                        >
                          回复
                        </Button>
                        {activeReply === comment._id && (
                          <Box>
                            <TextField
                              fullWidth
                              variant="outlined"
                              placeholder="Add a comment"
                              value={replyText}
                              multiline
                              rows={4}
                              onChange={(e) => setReplyText(e.target.value)}
                              sx={{ mt: 2, background: "#425D5F" }}
                            />
                            <Box sx = {{display:"flex", gap : 2}}>
                            <Button
                              variant="contained"
                              onClick={() => handleAddReply(comment._id)}
                              sx={{ backgroundColor: '#cf63ae', mt: 2, maxWidth: "200px"  }}
                            >
                              回复
                            </Button>
                            <Button
                              variant="contained"
                              onClick={handleReplyClose}
                              sx={{ mt: 2, backgroundColor: '#cf63ae', maxWidth: "200px" }}
                            >
                              取消
                            </Button>
                            </Box>
                          </Box>
                        )}
                        {comment.replies.length > 0 && (
                          <Box
                            sx={{
                              paddingLeft: 4,
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            {comment.replies.map((reply, index) => (
                              <Box key={index} sx = {{padding : 2}}>
                                <Typography color="white" sx = {{paddingTop : 1}}>
                                  {`用户名: ${reply.username}`}
                                </Typography>
                                <Typography color="white" sx = {{paddingTop : 1}}>
                                  {reply.comment}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        )}
                      </Box>

                      <Typography
                        color="white"
                        component="span"
                        variant="body2"
                      >
                        ————————————————————————————————————————————
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Typography
          variant="body4"
          component="div"
          sx={{ color: "white", padding: 5 }}
        >
          暂无评论，来抢沙发
        </Typography>
      )}
    </Box>
  );
};

export default AnimeDetail;
