import React from 'react';
import jwt from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthVerify = (props) => {
  let navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.accessToken;

  if (user) {
    const { exp } = jwt(token);
    
    if (exp * 1000 < Date.now()) {
      navigate('/login'); 
      props.logOut();
    }
  }

  return <div></div>;
};

export default AuthVerify;