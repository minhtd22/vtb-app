import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL_DEV ?
  `${process.env.REACT_APP_API_URL_DEV}/password-reset/` :
  'https://vietinbank-server.herokuapp.com/api/password-reset/';

const sendEmail = (data) => {

  console.log('data', data);
  return axios.post(
    API_URL,
    data,
  );
};

const resetPassword = (userId, token, password) => {
  console.log('password', password);
  return axios.post(
    API_URL + `${userId}/${token}`,
    {
      password
    }, 
  );
};

const ForgotPasswordService = {
  sendEmail,
  resetPassword
};

export default ForgotPasswordService;