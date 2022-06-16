import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Alert, Select } from 'antd';

import AuthService from '../services/auth.service';
import UserModal from './UserModal';

const SignUp = () => {
  let navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [userCode, setUserCode] = useState('');
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { Option } = Select;

  const onChangeUsername = (e) => {
    const username = e.target.value.toLowerCase();
    setUsername(username);
  };

  const onChangeFullname = (e) => {
    const fullName = e.target.value;
    setFullName(fullName);
  };

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  const onChangeUsercode = (e) => {
    const userCode = e.target.value;
    setUserCode(userCode);
  };

  const onChangeDepartment = (value) => {
    setDepartment(value);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div>
      <h3>Đăng ký</h3>
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        onFinish={(data) => {
          AuthService.signup(
            username,
            fullName,
            email,
            userCode,
            department,
            password,
          ).then(() => {
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

            // setLoading(false);
            setMessage(resMessage);
          });
        }}
        onFinishFailed={onFinishFailed}
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
          label="Họ và tên"
          name="fullName"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập họ và tên",
            },
          ]}
        >
          <Input onChange={onChangeFullname} placeholder="Họ và tên" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập email.",
            },
            {
              pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
              message: "Định dạng email không hợp lệ.",
            },
          ]}
        >
          <Input onChange={onChangeEmail} placeholder="Email" />
        </Form.Item>

        <Form.Item
          label="Mã cán bộ"
          name="userCode"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mã cán bộ",
            },
          ]}
        >
          <Input onChange={onChangeUsercode} placeholder="Mã cán bộ" />
        </Form.Item>

        <Form.Item
          label="Phòng ban"
          name="department"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập phòng ban",
            },
          ]}
        >
          <Select
            placeholder="Chọn phòng ban"
            optionFilterProp="children"
            onChange={onChangeDepartment}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            <Option value="DVKH">DVKH</Option>
            <Option value="Bán lẻ">Bán lẻ</Option>
            <Option value="KHDN">KHDN</Option>
            <Option value="PGD Ông Ích Khiêm">PGD Ông Ích Khiêm</Option>
            <Option value="PGD Tây Hồ">PGD Tây Hồ</Option>
            <Option value="PGD Nam Đà Nẵng">PGD Nam Đà Nẵng</Option>
            <Option value="Phòng HTTD">Phòng HTTD</Option>
            <Option value="Phòng Tổng hợp">Phòng Tổng hợp</Option>
            <Option value="Phòng TCHC">Phòng TCHC</Option>
          </Select>
        </Form.Item>

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
        hasFeedback
      >
        <Input.Password onChange={onChangePassword} placeholder="Mật khẩu" />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Xác nhận mật khẩu"
        dependencies={['password']}
        hasFeedback
        allowclear="false"
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập lại mật khẩu!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }

              return Promise.reject(new Error('Vui lòng kiểm tra lại mật khẩu!'));
            },
          }),
        ]}
      >
        <Input.Password />
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
          Đăng ký
        </Button>
      </Form.Item>
    </Form>

    {isOpen && 
      <UserModal
        handleOk={() => navigate("/login")}
        content={'Chúc mừng bạn đã đăng ký tài khoản thành công. Xin vui lòng đăng nhập!'}
        okText={'Đăng nhập'}
      />
    }

    <p className="forgot-password text-right">
      Đã có tài khoản <a href="/login">Đăng nhập?</a>
    </p>
  </div>
)};

export default SignUp;
