import { Input, Table, Button, Form, Modal, Select, DatePicker } from 'antd';
import { Alert } from 'bootstrap';
import moment from 'moment';
import React, { useState, useEffect } from 'react';

import AuthService from '../services/auth.service';
import ProductService from '../services/product.service';

const Product = ({ getCurrentUser }) => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [customerName, setCustomerName] = useState('');
  const [cif, setCif] = useState('');
  const [customerInformation, setCustomerInformation] = useState('');
  const [customerType, setCustomerType] = useState('');
  const [productName, setProductName] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState('');
  const { Option } = Select;
  const dateFormat = 'DD-MM-YYYY';

  const onChangeCustomerName = (e) => {
    const customerName = e.target.value;
    setCustomerName(customerName);
  };

  const onChangeCif = (e) => {
    const cif = e.target.value;
    setCif(cif);
  };

  const onChangeCustomerInformation = (e) => {
    const customerInformation = e.target.value;
    setCustomerInformation(customerInformation);
  };

  const onChangeDepartment = (value) => {
    setCustomerType(value);
  };

  const onChangeProductName = (value) => {
    setProductName(value);
  };

  const onChangeNote = (e) => {
    const note = e.target.value;
    setNote(note);
  };

  const onChangeDate = (date) => {
    setDate(date);
  };

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleSubmit = () => {
    const dayAction = moment(date).format('DD-MM-YYYY');
    const data = {
      customerName,
      cif,
      customerInformation,
      customerType,
      productName,
      note,
      dayAction,
    }

    ProductService.creatProduct(data).then(() => {
      setVisible(false);
      form.resetFields();
      fetchProducts();
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

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  const fetchProducts = async () => {
    setIsLoading(true);

    ProductService.getAllProducts(10000, 0).then(
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
  };

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    getCurrentUser(user);

    if (user) {
      setCurrentUser(user);
      setIsAdmin(user.roles.includes('ROLE_ADMIN'));
    }

    fetchProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearchCustomerName = value => {
    ProductService.getAllProducts(undefined, undefined, undefined, value)
      .then(response => {
        setProducts(response.data);
      })
  };

  const columns = [
    {
      title: 'Cán bộ',
      dataIndex: ['user', 'fullName'],
      key: 'fullName',
      render: (value) => <div style={{ fontWeight: 'bold' }}>{value}</div>
    },
    {
      title: 'Mã Cán bộ',
      dataIndex: ['user', 'userCode'],
      key: 'userCode',
    },
    {
      title: 'Phòng',
      dataIndex: ['user', 'department'],
      key: 'department',
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'CIF',
      dataIndex: 'cif',
      key: 'cif',
    },
    {
      title: 'Thông tin KH',
      dataIndex: 'customerInformation',
      key: 'customerInformation',
    },
    {
      title: 'Loại KH',
      dataIndex: 'customerType',
      key: 'customerType',
    },
    {
      title: 'Sản phẩm DV',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Ngày đăng ký',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value) => {
        const date = moment.utc(value).local().format('DD-MM-YYYY');
        return date;
      }
    },
    {
      title: 'Ngày thực hiện',
      dataIndex: 'dayAction',
      key: 'dayAction',
    },
    {
      title: 'Kết quả',
      dataIndex: 'result',
      key: 'result',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
    },
  ];

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
        {
          // Render all products admin page
          currentUser && isAdmin && 
          <Table
              dataSource={products.data}
              columns={columns}
              rowKey={obj => obj._id}
              loading={isLoading}
          >
          </Table>
        }
        {
          // Render products of user
          currentUser && !isAdmin && 
          <>
            <Button
              className="register-button"
              type="primary"
              onClick={showModal}
            >
              Đăng ký sản phẩm
            </Button>
            <Modal
              title="Thông tin đăng ký"
              visible={visible}
              onOk={form.submit}
              onCancel={handleCancel}
              okText="Đăng ký"
              cancelText="Huỷ"
            >
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
              >
                <Form.Item
                  label="Tên khách hàng"
                  name="customerName"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên khách hàng",
                    },
                  ]}
                >
                  <Input onChange={onChangeCustomerName} placeholder="Tên khách hàng" />
                </Form.Item>

                <Form.Item
                  label="CIF"
                  name="cif"
                >
                  <Input onChange={onChangeCif} placeholder="Số CIF" />
                </Form.Item>

                <Form.Item
                  label="Thông tin khách hàng"
                  name="customerInformation"
                >
                  <Input onChange={onChangeCustomerInformation} placeholder="Giấy tờ tuỳ thân của KHCN/ MST của KHDN" />
                </Form.Item>

                <Form.Item
                  label="Loại khách hàng"
                  name="customerType"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn loại khách hàng",
                    },
                  ]}
                >
                  <Select
                    placeholder="Chọn loại khách hàng"
                    optionFilterProp="children"
                    onChange={onChangeDepartment}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Option value="KHCN">KHCN</Option>
                    <Option value="KHDN">KHDN</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Sản phẩm dịch vụ"
                  name="productName"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn sản phẩm",
                    },
                  ]}
                >
                  <Select
                    placeholder="Chọn loại sản phẩm"
                    optionFilterProp="children"
                    onChange={onChangeProductName}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Option value="Cho vay vốn SXKD">Cho vay vốn SXKD</Option>
                    <Option value="Cho vay vốn đầu tư dự án">Cho vay vốn đầu tư dự án</Option>
                    <Option value="Giao dịch MBNT">Giao dịch MBNT</Option>
                    <Option value="DV chuyển tiền ngoại tệ đến/đi">DV chuyển tiền ngoại tệ đến/đi</Option>
                    <Option value="POS">POS</Option>
                    <Option value="QR">QR</Option>
                    <Option value="Chi lương">Chi lương</Option>
                    <Option value="Tiền gửi có kỳ hạn">Tiền gửi có kỳ hạn</Option>
                    <Option value="Tài khoản thanh toán">Tài khoản thanh toán</Option>
                    <Option value="Trái phiếu NHCT phát hành">Trái phiếu NHCT phát hành</Option>
                    <Option value="Tài khoản ký quỹ">Tài khoản ký quỹ</Option>
                    <Option value="Thấu chi">Thấu chi</Option>
                    <Option value="TTTM và Bảo lãnh">TTTM và Bảo lãnh</Option>
                    <Option value="Efast">Efast</Option>
                    <Option value="Bảo hiểm phi nhân thọ">Bảo hiểm phi nhân thọ</Option>
                    <Option value="Bảo hiểm nhân thọ">Bảo hiểm nhân thọ</Option>
                    <Option value="Cho vay tiêu dùng">Cho vay tiêu dùng</Option>
                    <Option value="Ipay">Ipay</Option>
                    <Option value="Thẻ GNQT">Thẻ GNQT</Option>
                    <Option value="Thẻ TDQT">Thẻ TDQT</Option>
                    <Option value="TK số đẹp/Alias">TK số đẹp/Alias</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Ngày thực hiện"
                  name="dayAction"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn ngày thực hiện",
                    },
                  ]}
                >
                  <DatePicker onChange={onChangeDate} format={dateFormat} placeholder="Chọn ngày" disabledDate={disabledDate} />
                </Form.Item>

                <Form.Item
                  label="Ghi chú"
                  name="note"
                >
                  <Input onChange={onChangeNote} placeholder="Ghi chú" />
                </Form.Item>

                <div className="error-message">
                  {message && (
                    <Alert
                      description={message}
                      type="error"
                      showIcon
                    />
                  )}
                </div>
              </Form>
            </Modal>
            <Table
                dataSource={products.data}
                columns={columns}
                rowKey={obj => obj._id}
                loading={isLoading}
            >
            </Table>
          </>
        }
      </div>
    </div>
  )
};

export default Product;
