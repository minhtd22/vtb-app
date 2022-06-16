import { Modal } from 'antd';

const UserModal = ({ handleOk, content, okText }) => {
  Modal.success({
    content,
    onOk: handleOk,
    okText,
  });
};

export default UserModal;