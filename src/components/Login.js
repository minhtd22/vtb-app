import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Alert } from 'antd';

import AuthService from '../services/auth.service';

const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const Login = () => {
  let navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const onChangeUsername = (e) => {
    const username = e.target.value.toLowerCase();
    setUsername(username);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  return (
    <div>
      <h3>Đăng nhập</h3>
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={(data) => {
          AuthService.login(username, password).then(
            () => {
              navigate('/products');
            },
            (error) => {
              const resMessage =
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                error.message ||
                error.toString();

              // setLoading(false);
              setMessage(resMessage);
            }
          );
        }}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tài khoản",
            },
          ]}
          
        >
          <Input onChange={onChangeUsername} placeholder="Tài khoản" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mật khẩu",
            },
          ]}
        >
          <Input.Password onChange={onChangePassword} placeholder='Mật khẩu' />
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
        <div className="error-message">
          {message && (
            <Alert
              description={message}
              type="error"
              showIcon
              style={{ padding: '8px 15px' }}
            />
          )}
        </div>
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>

      <div className="forgot-password text-right">
        <Link className="nav-link" to={'/forgot-password'}>
          Quên mật khẩu?
        </Link>
      </div>
    </div>
  );
};

export default Login;
