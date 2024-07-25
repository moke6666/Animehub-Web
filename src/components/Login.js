import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Box from 'react';

const Login = ({ open, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async() => {
    try{
      const response = await axios.post('http://localhost:3001/login',{username,password});
      setMessage(response.data);
    }
    catch(error){
      if(error.response && error.response.data){
        setMessage(error.response.data);}
        else{
          setMessage("Some error happened, please try again"); 
        }
    }  
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{sx: 
      {backgroundColor: '#7d7373', // 设置背景颜色
        color: 'white', // 设置文本颜色
      }
    }}>
      <DialogTitle sx={{textAlign: 'center'}}>登录</DialogTitle>
      <DialogContent>
          
        <TextField
          autoFocus
          margin="dense"
          label="Username"
          type="text"
          fullWidth
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        
        
        <TextField
          margin="dense"
          label="Password"
          type="password"
          fullWidth
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Typography variant="body1" component="p" sx={{ mt: 2 }}>
          {message}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button sx = {{color:'#baabac'}} onClick = {() => navigate('/register')}>Register</Button>
        <Button onClick={onClose} sx = {{color:'#baabac'}}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} sx = {{color:'#baabac'}}>
          Login
        </Button>
        
      </DialogActions>
    </Dialog>
  );
};

export default Login;
