import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL_DEV}/auth/` || 'https://vietinbank-server.herokuapp.com/api/auth/';
const signup = (username, fullName, email, userCode, department, password) => {
  const data = {
    username,
    fullName,
    email,
    userCode,
    department,
    password,
  };

  return axios.post(API_URL + 'signup', data);
};

const login = (username, password) => {
  return axios
    .post(API_URL + 'signin', {
      username,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const AuthService = {
  signup,
  login,
  logout,
  getCurrentUser,
};

export default AuthService;
