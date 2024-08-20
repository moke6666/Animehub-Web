// reducers.js
import { LOGIN, LOGOUT} from './action';

const initialState = {
  isLoggedIn : localStorage.getItem('token') ? true: false,
  username: localStorage.getItem('username') || '',
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return { ...state, isLoggedIn: true, username: action.payload.username};
    case LOGOUT:
      return { ...state, isLoggedIn: false, username: ''};
    default:
      return state;
  }
};

export default authReducer;
