import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'https://vietinbank-server.herokuapp.com/api/users/';

const getAllUsers = (username) => {
  return axios.get(API_URL,
    {
      headers: authHeader(),
      params: {
        username,
      },
    },
  );
};

const getDetailUser = (id) => {
  return axios.get(API_URL + `${id}`,
    {
      headers: authHeader(),
    },
  );
};

const updateUser = (id, data) => {
  return axios.put(
    API_URL + `${id}`,
    data,
    {
      headers: authHeader(),
    },
  );
}

const UserService = {
  getAllUsers,
  getDetailUser,
  updateUser,
};

export default UserService;