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
  const [reason, setReason] = useState(0);
  const [form] = Form.useForm();
  const { TextArea } = Input;

  const handleCancel = () => {
    setCancel(1);
  };
  const handleReject = () => {
    setCancel(0);
    onReject(reason);
    onClose();
  };
  const handleCloseReject = () => {
    setCancel(0);
    onClose();
  };
  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={handleCloseReject}
      footer={null}
    >
      <div>{content}</div>
      {cancel === 0 && (
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
      )}
      {cancel === 1 && (
        <Form
          form={form}
          initialValues={{ layout: "horizontal" }}
          layout="vertical"
        >
          {" "}
          <Form.Item
            label="Lý do hủy đơn"
            name="reason"
            rules={[{ required: true }]}
          >
            <TextArea
              rows={4}
              placeholder=""
              onChange={(e) => setReason(e.target.value)}
            />
          </Form.Item>
          <div
            style={{ display: "flex", justifyContent: "right", gap: "10px" }}
          >
            <Button type="primary" danger onClick={handleReject}>
              {cancelText}
            </Button>
            <Button type="primary" onClick={handleCloseReject}>
              {closeText}
            </Button>
          </div>
        </Form>
      )}
    </Modal>
  );
};

export default CustomPopup;
