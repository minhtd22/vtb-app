import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.min.css';
import {
  Form,
  Input,
  Table,
  Typography,
  Select,
  Alert,
  DatePicker,
  Button,
  Modal
} from 'antd';
import moment from 'moment';

import AuthService from '../services/auth.service';
import ProductService from '../services/product.service';
import { appConst } from '../constants/app.const';
import EditableCell from './EditableCell';
import CustomSearch from './CustomSearch';

const Product = ({ getCurrentUser }) => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const [formEdit] = Form.useForm();
  const [formRegister] = Form.useForm();
  const [customerName, setCustomerName] = useState('');
  const [cif, setCif] = useState('');
  const [customerInformation, setCustomerInformation] = useState('');
  const [customerType, setCustomerType] = useState('');
  const [productName, setProductName] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState('');
  const [editingKey, setEditingKey] = useState('');
  const { Option } = Select;
  const dateFormat = 'DD-MM-YYYY';

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

  const isEditing = (record) => record._id === editingKey;

  const edit = (record) => {
    formEdit.setFieldsValue({
      customerName: '',
      cif: '',
      customerInformation: '',
      note: '',
      ...record,
      dayAction: moment(record.dayAction, dateFormat),
    });

    setEditingKey(record._id);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      let row = await formEdit.validateFields();
      row = {
        ...row,
        dayAction: moment(row.dayAction).format(dateFormat),
      };

      const newData = [...products.data];
      const index = newData.findIndex((item) => key === item._id);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        const id = newData[index]._id;
        
        // Update product
        await ProductService.updateProduct(id, newData[index]).then(() => {
          fetchProducts();
          setEditingKey('');
        });
      } else {
        newData.push(row);
        fetchProducts();
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const editAction = [
    {
      title: 'Action',
      dataIndex: 'Action',
      render: (_, record) => {
        const editable = isEditing(record);

        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record._id)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Typography.Link onClick={cancel}>
              Cancel
            </Typography.Link>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== '' || record.result === 'Ho??n th??nh'} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        );
      },
    },
  ];

  const columnsWithActions = appConst.columns.concat(editAction);

  const fetchProducts = () => {
    setIsLoading(true);

    ProductService.getAllProducts(10000, 0).then(
      (response) => {
        setProducts(response.data);
        setIsLoading(false);
        setEditingKey('');
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


  const mergedColumns = columnsWithActions.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

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
    setDate(moment(date).format(dateFormat));
  };

  const filterProducts = (searchName, searchValue) => {
    ProductService.getAllProducts(undefined, undefined, undefined, searchName, searchValue)
      .then(response => {
        setProducts(response.data);
      });
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleSubmit = () => {
    const dayAction = date;
    const data = {
      customerName,
      cif,
      customerInformation,
      customerType,
      productName,
      note,
      dayAction,
    }

    ProductService.createProduct(data).then(() => {
      setVisible(false);
      formRegister.resetFields();
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
    formRegister.resetFields();
  };

  return (
    <div>
      <CustomSearch filterProducts={filterProducts} isEdit={editingKey !== ''}/>

      <div>
        {
          // Render all products admin page
          currentUser && isAdmin && 
          <Table
              dataSource={products.data}
              columns={appConst.columnsAdmin}
              rowKey={obj => obj._id}
              loading={isLoading}
              size='small'
              bordered={true}
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
              disabled={editingKey !== ''}
            >
              ????ng k?? s???n ph???m
            </Button>
            <Modal
              title="Th??ng tin ????ng k??"
              visible={visible}
              onOk={formRegister.submit}
              onCancel={handleCancel}
              okText="????ng k??"
              cancelText="Hu???"
            >
              <Form
                form={formRegister}
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
                  label="T??n kh??ch h??ng"
                  name="customerName"
                  rules={[
                    {
                      required: true,
                      message: "Vui l??ng nh???p t??n kh??ch h??ng",
                    },
                  ]}
                >
                  <Input onChange={onChangeCustomerName} placeholder="T??n kh??ch h??ng" />
                </Form.Item>

                <Form.Item
                  label="CIF"
                  name="cif"
                >
                  <Input onChange={onChangeCif} placeholder="S??? CIF" />
                </Form.Item>

                <Form.Item
                  label="Th??ng tin kh??ch h??ng"
                  name="customerInformation"
                >
                  <Input onChange={onChangeCustomerInformation} placeholder="Gi???y t??? tu??? th??n c???a KHCN/ MST c???a KHDN" />
                </Form.Item>

                <Form.Item
                  label="Lo???i kh??ch h??ng"
                  name="customerType"
                  rules={[
                    {
                      required: true,
                      message: "Vui l??ng ch???n lo???i kh??ch h??ng",
                    },
                  ]}
                >
                  <Select
                    placeholder="Ch???n lo???i kh??ch h??ng"
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
                  label="S???n ph???m d???ch v???"
                  name="productName"
                  rules={[
                    {
                      required: true,
                      message: "Vui l??ng ch???n s???n ph???m",
                    },
                  ]}
                >
                  <Select
                    placeholder="Ch???n lo???i s???n ph???m"
                    optionFilterProp="children"
                    onChange={onChangeProductName}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Option value="Cho vay v???n SXKD">Cho vay v???n SXKD</Option>
                    <Option value="Cho vay v???n ?????u t?? d??? ??n">Cho vay v???n ?????u t?? d??? ??n</Option>
                    <Option value="Giao d???ch MBNT">Giao d???ch MBNT</Option>
                    <Option value="DV chuy???n ti???n ngo???i t??? ?????n/??i">DV chuy???n ti???n ngo???i t??? ?????n/??i</Option>
                    <Option value="POS">POS</Option>
                    <Option value="QR">QR</Option>
                    <Option value="Chi l????ng">Chi l????ng</Option>
                    <Option value="Ti???n g???i c?? k??? h???n">Ti???n g???i c?? k??? h???n</Option>
                    <Option value="T??i kho???n thanh to??n">T??i kho???n thanh to??n</Option>
                    <Option value="Tr??i phi???u NHCT ph??t h??nh">Tr??i phi???u NHCT ph??t h??nh</Option>
                    <Option value="T??i kho???n k?? qu???">T??i kho???n k?? qu???</Option>
                    <Option value="Th???u chi">Th???u chi</Option>
                    <Option value="TTTM v?? B???o l??nh">TTTM v?? B???o l??nh</Option>
                    <Option value="Efast">Efast</Option>
                    <Option value="B???o hi???m phi nh??n th???">B???o hi???m phi nh??n th???</Option>
                    <Option value="B???o hi???m nh??n th???">B???o hi???m nh??n th???</Option>
                    <Option value="Cho vay ti??u d??ng">Cho vay ti??u d??ng</Option>
                    <Option value="Ipay">Ipay</Option>
                    <Option value="Th??? GNQT">Th??? GNQT</Option>
                    <Option value="Th??? TDQT">Th??? TDQT</Option>
                    <Option value="TK s??? ?????p/Alias">TK s??? ?????p/Alias</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Ng??y th???c hi???n"
                  name="dayAction"
                  rules={[
                    {
                      required: true,
                      message: "Vui l??ng ch???n ng??y th???c hi???n",
                    },
                  ]}
                >
                  <DatePicker onChange={onChangeDate} format={dateFormat} placeholder="Ch???n ng??y" />
                </Form.Item>

                <Form.Item
                  label="Ghi ch??"
                  name="note"
                >
                  <Input onChange={onChangeNote} placeholder="Ghi ch??" />
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
              </Form>
            </Modal>
            <Form form={formEdit} component={false}>
              <Table
                components={{
                  body: {
                    cell: EditableCell,
                  },
                }}
                rowKey={obj => obj._id}
                bordered
                dataSource={products.data}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={{
                  onChange: cancel,
                }}
                size='small'
                loading={isLoading}
              />
            </Form>
          </>
        }
      </div>
    </div>
  );
};

export default Product;
