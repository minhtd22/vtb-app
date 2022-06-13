import axios from 'axios';
import authHeader from './auth-header';

const API_URL = process.env.REACT_APP_API_URL_DEV ? 
  `${process.env.REACT_APP_API_URL_DEV}/products/` :
  'https://vietinbank-server.herokuapp.com/api/products/';

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

const createProduct = (data) => {
  return axios.post(
    API_URL,
    data, 
    {
      headers: authHeader(),
    },
  );
};

const updateProduct = (id, data) => {
  return axios.put(
    API_URL + `${id}`,
    data,
    {
      headers: authHeader(),
    },
  )
}

const ProductService = {
  getAllProducts,
  createProduct,
  updateProduct,
};

export default ProductService;
