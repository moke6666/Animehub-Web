// action.js
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export const login = (username) => {
  localStorage.setItem('username', username);
  return {
    type: LOGIN,
    payload: { username },
  };
};

export const logout = () => {
  localStorage.removeItem('username');
  localStorage.removeItem('token');
  return {
    type: LOGOUT,
  };
};


