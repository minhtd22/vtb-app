import moment from 'moment';

const columns = [
  {
    key: 'customerName',
    title: 'Tên khách hàng',
    dataIndex: 'customerName',
    editable: true,
    width: '10%',
  },
  {
    key: 'cif',
    title: 'CIF',
    dataIndex: 'cif',
    editable: true,
    width: '10%',
  },
  {
    title: 'Thông tin KH',
    dataIndex: 'customerInformation',
    key: 'customerInformation',
    editable: true,
    width: '10%',
  },
  {
    title: 'Loại KH',
    dataIndex: 'customerType',
    key: 'customerType',
    width: '10%',
  },
  {
    title: 'Sản phẩm DV',
    dataIndex: 'productName',
    key: 'productName',
    width: '10%',
  },
  {
    title: 'Ngày đăng ký',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (value) => {
      const date = moment.utc(value).local().format('DD-MM-YYYY');
      return date;
    },
    width: '10%',
  },
  {
    title: 'Ngày thực hiện',
    dataIndex: 'dayAction',
    key: 'dayAction',
    editable: true,
    width: '10%',
  },
  {
    title: 'Ghi chú',
    dataIndex: 'note',
    key: 'note',
    editable: true,
    width: '10%',
  },
  {
    title: 'Kết quả',
    dataIndex: 'result',
    key: 'result',
    render: (value) => {
      if (value === 'Hoàn thành') {
        return <div style={{ color: 'green', fontWeight: '500' }}>Hoàn thành</div>
      } else {
        return <div style={{ color: 'red', fontWeight: '500' }}>Chưa hoàn thành</div>
      }
    },
    editable: true,
    width: '10%',
  },
];

const columnsAdmin = [
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
  ...columns,
];

export const appConst = {
  columns,
  columnsAdmin,
};
