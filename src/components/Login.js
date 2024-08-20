import React, { useState , useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate} from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from './action';

const Login = ({ open, onClose}) => {

  const dispatch = useDispatch();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setUsername('');
      setPassword('');
      setMessage('');
    }
  }, [open]);

 

  const handleSubmit = async() => {
    try{
      const response = await axios.post('http://localhost:3001/auth/login',{username,password});
      setMessage("successful!");
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshtoken', response.data.refreshtoken);
      localStorage.setItem('username', username); 
      dispatch(login(username));
      onClose();
    }
    catch(error){
      if(error.response && error.response.data){
        setMessage(error.response.data);}
        else{
          setMessage(error.message); 
        }
    }  
  };


  return (

    <Dialog open={open} onClose={onClose} PaperProps={{sx: 
      {backgroundColor: '#5D8696', // 设置背景颜色
        color: 'white', // 设置文本颜色
      }
    }}>
      <DialogTitle sx={{textAlign: 'center'}}>登录</DialogTitle>
      <DialogContent>
          
        <TextField
          backgroundColor = '#5D8696'
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
        <Button sx = {{color:'#183A4F'}} onClick = {() => navigate('/register')}>Register</Button>
        <Button onClick={onClose} sx = {{color:'#183A4F'}}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} sx = {{color:'#183A4F'}}>
          Login
        </Button>
        
      </DialogActions>
    </Dialog>
  
  );
};

export default Login;
