import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import _ from 'lodash';

export const PrivateRoute = () => {
  const auth = !_.isEmpty(JSON.parse(localStorage.getItem('user')));

  // If authorized, return an outlet that will render child elements
  // If not, return element that will navigate to login page
  return auth ? <Outlet /> : <Navigate to="/login" />;
}