import { Alert, Button, Form, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ForgotPasswordService from '../services/forgotPassword.service';
import UserModal from './UserModal';

const PasswordReset = () => {
  const search = useLocation();
  const navigate = useNavigate();
  const queryParams = search.pathname.split('/');
  const [resetPassword, setResetPassword] = useState({
    newPassword: '',
    token: null,
    userId: null,
  });
  const [message, setMessage] = useState('');
  const [isUpdated, setIsUpdated] = useState(false);

  const getData = () => {
    const userId = queryParams[2];
    const token = queryParams[3];

    setResetPassword({ ...resetPassword, userId, token });
  };

  const handleChange = (e) => {
    setResetPassword({
      ...resetPassword,
      newPassword: e.target.value,
    });
  };

  useEffect(() => {
    getData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return(
    <div>
      <h3>Đặt lại mật khẩu</h3>
      <Form
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        onFinish={() => {
          const { userId, token, newPassword } = resetPassword;

          ForgotPasswordService.resetPassword(userId, token, newPassword).then(
            () => {
              setIsUpdated(true);
              setMessage('');
            }, 
            (error) => {
              const resMessage = error.response.data;
              setMessage(resMessage);
            }
          )
        }}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
        name="password"
        label="Mật khẩu"
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập mật khẩu',
          },
          () => ({
            validator(_, value) {
              if (value.length >= 6) {
                return Promise.resolve();
              }
              
              return Promise.reject(new Error('Mật khẩu tối thiểu 6 ký tự!'));
            }
          })
        ]}
        >
          <Input.Password onChange={handleChange} placeholder="Mật khẩu" />
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
            Xác nhận
          </Button>
        </Form.Item>
      </Form>

      {isUpdated &&
        <UserModal
          handleOk={() => navigate('/login')}
          content={'Mật khẩu của bạn đã được thay đổi. Xin vui lòng đăng nhập!'}
          okText={'Đăng nhập'}
        />
      }
    </div>
  )
};

export default PasswordReset;
