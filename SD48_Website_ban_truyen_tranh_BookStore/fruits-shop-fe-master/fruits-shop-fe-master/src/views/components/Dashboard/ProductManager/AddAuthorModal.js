import React, { useState } from 'react';
import { Modal, Form, Input, Button, App } from 'antd';
import useAuthor from '@api/useAuthor';

const AddAuthorModal = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const { addAuthor } = useAuthor();
  const { message: antdMessage } = App.useApp();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      const response = await addAuthor({ name: values.name, description: values.description });
      if (response && response.success && response.data) {
        antdMessage.success(`Thêm tác giả "${response.data.name}" thành công!`);
        form.resetFields();
        if (onSuccess) {
          onSuccess(response.data);
        }
        onClose();
      } else {
        antdMessage.error(response.message || "Thêm tác giả thất bại.");
      }
    } catch (error) {
      antdMessage.error(error.message || "Đã có lỗi xảy ra khi thêm tác giả.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Thêm Tác Giả Mới"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
      centered
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ description: '' }}>
        <Form.Item
          name="name"
          label="Tên Tác Giả"
          rules={[{ required: true, message: 'Vui lòng nhập tên tác giả!' }]}
        >
          <Input placeholder="Nhập tên tác giả" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Mô tả"
        >
          <Input.TextArea rows={3} placeholder="Nhập mô tả cho tác giả (tùy chọn)" />
        </Form.Item>
        <Form.Item style={{ textAlign: 'right', marginTop: 16 }}>
          <Button onClick={handleCancel} style={{ marginRight: 8 }} disabled={loading}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Thêm Tác Giả 
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const AppWrappedAddAuthorModal = (props) => (
    <App><AddAuthorModal {...props} /></App>
);

export default AppWrappedAddAuthorModal;