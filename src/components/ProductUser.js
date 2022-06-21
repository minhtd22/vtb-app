import { Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { appConst } from '../constants/app.const';
import ProductService from '../services/product.service';
import CustomSearch from './CustomSearch';

const ProductUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    setIsLoading(true);

    ProductService.getAllProducts(10000, 0, id).then(
      (response) => {
        setProducts(response.data);
        setIsLoading(false);
      },
      (error) => {
        const _content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();

        setProducts(_content);
      }
    );
  }, [id]);

  const filterProducts = (searchName, searchValue) => {
    ProductService.getAllProducts(undefined, undefined, undefined, searchName, searchValue)
      .then(response => {
        setProducts(response.data);
      });
  };

  return (
    <div>
      <CustomSearch filterProducts={filterProducts} />

      <div>
          <Table
              dataSource={products.data}
              columns={appConst.columnsAdmin}
              rowKey={obj => obj._id}
              loading={isLoading}
              bordered={true}
              size='small'
          >
          </Table>
      </div>
    </div>
  )
};


export default ProductUser;