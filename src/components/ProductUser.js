import { Input, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { appConst } from '../constants/app.const';
import ProductService from '../services/product.service';

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

  const onSearchCustomerName = value => {
    ProductService.getAllProducts(undefined, undefined, undefined, value)
      .then(response => {
        setProducts(response.data);
      })
  };

  return (
    <div>
      <div className='search-user'>
        <Input.Search
          placeholder="Nhập tìm kiếm khách hàng"
          onSearch={onSearchCustomerName}
          enterButton
        />
      </div>

      <div>
          <Table
              dataSource={products.data}
              columns={appConst.columnsAdmin}
              rowKey={obj => obj._id}
              loading={isLoading}
              bordered={true}
          >
          </Table>
      </div>
    </div>
  )
};


export default ProductUser;