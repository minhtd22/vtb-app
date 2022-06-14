import { DatePicker, Form, Input, Select } from 'antd';

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const { Option } = Select;
  const dateFormat = 'DD-MM-YYYY';

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: dataIndex === 'note' || dataIndex === 'cif' ? false : true,
              message: `Vui lòng nhập ${title}!`,
            },
          ]}
        >
          {dataIndex === 'result' ? 
            <Select
              optionFilterProp="children"
            >
              <Option value='Hoàn thành'>Hoàn thành</Option>
              <Option value='Chưa hoàn thành'>Chưa hoàn thành</Option>
            </Select> : 
            dataIndex === 'dayAction' ? 
            <DatePicker format={dateFormat} allowClear={false} style={{ width: 'max-content' }} /> :
            <Input style={{ width: 150 }}/>
          }
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default EditableCell;