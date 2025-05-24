import React, { useState } from 'react';
import { Modal, Form, Input, Button, App } from 'antd';
import usePublisher from '@api/usePublisher';

const AddPublisherModal = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const { addPublisher } = usePublisher();
  const { message: antdMessage } = App.useApp();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      const publisherData = {
        name: values.name,
        description: values.description,
        address: values.address,
        phoneNumber: values.phoneNumber,
        email: values.email
      };
      const response = await addPublisher(publisherData);
      if (response && response.success && response.data) {
        antdMessage.success(`Thêm nhà xuất bản "${response.data.name}" thành công!`);
        form.resetFields();
        if (onSuccess) {
          onSuccess(response.data);
        }
        onClose();
      } else {
        antdMessage.error(response.message || "Thêm nhà xuất bản thất bại.");
      }
    } catch (error) {
      antdMessage.error(error.message || "Đã có lỗi xảy ra khi thêm nhà xuất bản.");
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
      title="Thêm Nhà Xuất Bản Mới"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
      centered
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ description: '', address: '', phoneNumber: '', email: '' }}>
        <Form.Item
          name="name"
          label="Tên Nhà Xuất Bản"
          rules={[{ required: true, message: 'Vui lòng nhập tên nhà xuất bản!' }]}
        >
          <Input placeholder="Nhập tên nhà xuất bản" />
        </Form.Item>
        <Form.Item name="address" label="Địa chỉ">
          <Input placeholder="Nhập địa chỉ (tùy chọn)" />
        </Form.Item>
        <Form.Item name="phoneNumber" label="Số điện thoại">
          <Input placeholder="Nhập số điện thoại (tùy chọn)" />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ type: 'email', message: 'Email không hợp lệ!' }]}>
          <Input placeholder="Nhập email (tùy chọn)" />
        </Form.Item>
        <Form.Item name="description" label="Mô tả">
          <Input.TextArea rows={3} placeholder="Nhập mô tả (tùy chọn)" />
        </Form.Item>
        <Form.Item style={{ textAlign: 'right', marginTop: 16 }}>
          <Button onClick={handleCancel} style={{ marginRight: 8 }} disabled={loading}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Thêm Nhà Xuất Bản
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const AppWrappedAddPublisherModal = (props) => (
    <App><AddPublisherModal {...props} /></App>
);

export default AppWrappedAddPublisherModal;