import React from 'react';
import { Modal, Button } from 'antd';

// Reusable Popup Component
const CommonPopup = ({ visible, title, content, onClose, onOk, okText = "OK", cancelText = "Cancel" }) => {
  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={onClose}
      onOk={onOk}
      okText={okText}
      cancelText={cancelText}
    >
      <div>{content}</div>
    </Modal>
  );
};

export default CommonPopup;
