import { Alert, Button, Form, Input, Select } from 'antd';
import React, { useEffect, useState } from 'react';

import AuthService from '../services/auth.service';
import UserService from '../services/user.service';

const Profile = () => {
  const [user, setUser] = useState({});
  const [form] = Form.useForm();
  const [, setFullName] = useState('');
  const [, setEmail] = useState('');
  const [, setDepartment] = useState('');
  const [message, setMessage] = useState('');
  const [isUpdated, setIsUpdated] = useState(false);
  const { Option } = Select;

  const onChangeFullname = (e) => {
    const fullName = e.target.value;
    setFullName(fullName);
  };

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  const onChangeDepartment = (value) => {
    setDepartment(value);
  };

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    const userId = currentUser.id;

    if (currentUser) {
      UserService.getDetailUser(userId).then((response) => {
        const data = response.data;

        form.setFieldsValue(data);
        setUser(data);
      });
    }
  }, [form]);

  const handleSubmit = (values) => {
    const userId = user._id;
    const data = {
      fullName: values.fullName,
      email: values.email,
      department: values.department,
    };

    UserService.updateUser(
      userId,
      data
    ).then(() => {
      setMessage('');
      setIsUpdated(true);
    },
    (error) => {
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      setMessage(resMessage);
    });
  };

  return (
    <div>
      <h3 style={{ marginBottom: '20px' }}>Cập nhật thông tin</h3>
      <Form
        form={form}
        onFinish={handleSubmit}
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{ marginRight: '15px' }}
        initialValues={form.getFieldsValue()}
      >
        <Form.Item
          label="Username"
          name="username"
        >
          <Input disabled />
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
              required: false,
              message: "Vui lòng nhập email",
            },
            {
              pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
              message: "Invalid email format",
            },
          ]}
        >
          <Input onChange={onChangeEmail} placeholder="Email" />
        </Form.Item>

        <Form.Item
          label="Mã cán bộ"
          name="userCode"
        >
          <Input disabled />
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

        {isUpdated && (
          <Alert
            description={'Bạn đã cập nhật thành công!'}
            type='success'
            showIcon
            style={{ marginBottom: '20px', padding: '8px 15px' }}
          />
        )}

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
      
    </div>
  );
};

export default Profile;
