import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Protected from './components/Protected';
import Home from './components/Home';
import AnimeList from './components/AnimeList';

const App = () => {
  
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element = {<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/protected" element={<Protected />} />
          <Route path="/AnimeList" element={<AnimeList/>}/>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
