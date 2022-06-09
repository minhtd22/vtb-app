import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'https://vietinbank-server.herokuapp.com/api/products/';

const getAllProducts = (limit, offset, userId, customerName) => {
  return axios.get(
    API_URL,
    {
      headers: authHeader(),
      params: {
        size: limit,
        page: offset,
        userId,
        customerName,
      },
    });
};

const creatProduct = (data) => {
  return axios.post(
    API_URL,
    data, 
    {
      headers: authHeader(),
    },
  );
};

const ProductService = {
  getAllProducts,
  creatProduct,
};

export default ProductService;
