import { Table, Input } from 'antd';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import AuthService from '../services/auth.service';
import UserService from '../services/user.service';

const User = ({ getCurrentUser }) => {
  const [content, setContent] = useState('');
  const [currentUser, setCurrentUser] = useState(undefined);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    const isAdmin = user?.roles.includes('ROLE_ADMIN');

    setIsLoading(true);
    getCurrentUser(user);

    if (user) {
      setCurrentUser(user);
      setShowAdminBoard(isAdmin);
    }

    // if (isAdmin) {
      UserService.getAllUsers().then(
        (response) => {
          setContent(response.data);
          setIsLoading(false);
        },
        (error) => {
          const _content =
            (error.response && error.response.data) ||
            error.message ||
            error.toString();
  
          setContent(_content);
        }
      );
    // }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearchUserName = value => {
    UserService.getAllUsers(value)
      .then(response => {
        setContent(response.data);
      })
  };
  
  const columns = [
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Mã cán bộ',
      dataIndex: 'userCode',
      key: 'userCode',
    },
    {
      title: 'Phòng Ban',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => {
        const userId = record._id;

        return (
          <div>
            <Link className="nav-link" to={`/products/${userId}`} style={{ padding: 0 }}>
              Chi tiết
            </Link>
          </div>
        )
      }
    },
  ];

  return (
    <div>
      <div className='search-user'>
        <Input.Search
          placeholder="Nhập tìm kiếm username"
          onSearch={onSearchUserName}
          enterButton
        />
      </div>

      <div>
        {
          // Render admin page
          currentUser && showAdminBoard && 
          <Table
              dataSource={content.users}
              columns={columns}
              rowKey={obj => obj._id}
              loading={isLoading}
              size='small'
          >
          </Table>
        }
        {
          // Render user page
          currentUser && !showAdminBoard && 
          <h3>User page</h3>
        }
      </div>
    </div>
  );
};

export default User;
