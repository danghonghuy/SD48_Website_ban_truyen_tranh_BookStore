import React, { useState, useEffect } from "react";
import { Button, Col, Form, Input, Modal, Row, Select, message } from "antd";

const CustomPopup = ({
  visible,
  title,
  content,
  onClose,
  onOk,
  okText = "Xác nhận",
  cancelText = "Hủy",
  closeText = "Đóng",
  onReject,
  showReject = true,
}) => {
  const [cancel, setCancel] = useState(0);
  const [note, setNote] = useState(0);
  const [form] = Form.useForm();
  const { TextArea } = Input;

  const handleCancel = () => {
    setCancel(1);
  };
  const handleReject = () => {
    setCancel(0);
    onReject(note);
    onClose();
  };
  const handleCloseReject = () => {
    setCancel(0);
    onClose();
  };
  const handleOk = () => {
    onOk(note)
    onClose()
  }
  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={handleCloseReject}
      footer={null}
    >
      <div>{content}</div>
      {/* {cancel === 0 && (
        <div style={{ display: "flex", justifyContent: "right", gap: "10px" }}>
          <Button type="primary" success onClick={onOk}>
            {okText}
          </Button>
          {!showReject && (
            <Button type="primary" danger onClick={handleCancel}>
              {cancelText}
            </Button>
          )}
          <Button type="primary" onClick={onClose}>
            {closeText}
          </Button>
        </div>
      )} */}
      <Form
        form={form}
        initialValues={{ layout: "horizontal" }}
        layout="vertical"
        onFinish={() => { showReject ? handleOk() : handleCancel() }}
      >
        <Form.Item
          label="Ghi chú"
          name="note"
          rules={[{ required: true }, { min: showReject ? 0 : 20, message: 'Nhập ít nhất 20 kí tự' }]}
        >
          <TextArea
            rows={4}
            placeholder=""
            onChange={(e) => setNote(e.target.value)}
          />
        </Form.Item>
        <div
          style={{ display: "flex", justifyContent: "right", gap: "10px" }}
        >
          <Button type="primary" success htmlType='submit'>
            {okText}
          </Button>
          {!showReject && (
            <Button type='primary' danger htmlType="submit">
              {cancelText}
            </Button>
          )}
          <Button type='dashed' onClick={onClose} htmlType="button">
            {closeText}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CustomPopup;
