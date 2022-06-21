import { Button, Input, Select } from 'antd';
import React, { useState } from 'react';

const CustomSearch = ({ filterProducts, isEdit }) => {
  const [ searchName, setSearchName ] = useState('');
  const [ searchResult, setSearchResult ] = useState('');
  const { Option } = Select;

  const onSearchCustomerName = e => {
    const name = e.target.value.toLowerCase().trim();

    setSearchName(name);
  };

  const onSearchResult = value => {
    setSearchResult(value);
  }

  const onSeach = () => {
    filterProducts(searchName, searchResult);
  };

  return (
    <div className='search-user'>
      <Input 
        placeholder="Nhập tìm kiếm khách hàng"
        onChange={onSearchCustomerName}
      />
      <Select
        placeholder="Chọn kết quả"
        optionFilterProp="children"
        onChange={onSearchResult}
        style={{ marginLeft: '20px', marginRight: '20px' }}
      >
        <Option value="">Tất cả</Option>
        <Option value="Hoàn thành">Hoàn thành</Option>
        <Option value="Chưa hoàn thành">Chưa hoàn thành</Option>
      </Select>

      <Button type="primary" htmlType="submit" onClick={onSeach} disabled={isEdit}>
        Tìm kiếm
      </Button>
    </div>
  )
};

export default CustomSearch;