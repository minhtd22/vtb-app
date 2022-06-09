import moment from 'moment';

export const columns = [
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