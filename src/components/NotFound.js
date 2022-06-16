import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div>
    <h2>This page isn't available!</h2>
    <Link to="/">Go Home</Link>
  </div>
);

export default NotFound;