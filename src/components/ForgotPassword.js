import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Alert } from 'antd';

import ForgotPasswordService from '../services/forgotPassword.service';
import UserModal from './UserModal';


const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const ForgotPassword = () => {
  let navigate = useNavigate();

  const [, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const onChangeEmail = (e) => {
    setMessage('');

    const email = e.target.value.toLowerCase();
    setEmail(email);
  };

  return (
    <div>
      <h3>Quên mật khẩu</h3>
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        onFinish={(data) => {
          ForgotPasswordService.sendEmail(data).then(
            () => {
              setMessage('');
              setIsOpen(true);
            }, 
            (error) => {
              const resMessage =
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                error.message ||
                error.toString();

              setMessage(resMessage);
            }
          )
        }}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập email",
            },
            {
              pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
              message: "Định dạng email không hợp lệ.",
            },
          ]}
        >
          <Input onChange={onChangeEmail} placeholder="Email" />
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
            Lấy mật khẩu
          </Button>
        </Form.Item>
      </Form>

      {isOpen &&
        <UserModal
          handleOk={() => navigate('/login')}
          content={'Mật khẩu của bạn đã được thiết lập lại. Xin vui lòng kiểm tra email!'}
          okText={'Đóng'}
        />
      }
    </div>
  );
};

export default ForgotPassword;
