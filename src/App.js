import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Protected from './components/Protected';
import Home from './components/Home';
import AnimeList from './components/AnimeList';
import AnimeDetail from './components/AnimeDetail';
import { Provider, useDispatch } from 'react-redux';
import store from './components/store';
import { login } from './components/action';
import { useEffect } from 'react';

const App = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    if (username && token) {
      dispatch(login(username));
    }
  }, [dispatch]);
  
  return (
    <Provider store={store}>

    <Router>
      <div>
        <Routes>
          <Route path="/" element = {<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/protected" element={<Protected />} />
          <Route path="/AnimeList" element={<AnimeList/>}/>
          <Route path="/anime-detail/:id" element={<AnimeDetail />} />
        </Routes>
      </div>
    </Router>
    </Provider>

  );
};

export default App;
