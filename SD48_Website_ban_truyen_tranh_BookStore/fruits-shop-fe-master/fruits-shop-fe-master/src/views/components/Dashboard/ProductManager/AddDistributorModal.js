import React, { useState } from 'react';
import { Modal, Form, Input, Button, App } from 'antd';
import useDistributor from '@api/useDistributor';

const AddDistributorModal = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const { addDistributor } = useDistributor();
  const { message: antdMessage } = App.useApp();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      const distributorData = {
        name: values.name,
        description: values.description,
        contactInfo: values.contactInfo
      };
      const response = await addDistributor(distributorData);
      if (response && response.success && response.data) {
        antdMessage.success(`Thêm nhà phát hành "${response.data.name}" thành công!`);
        form.resetFields();
        if (onSuccess) {
          onSuccess(response.data);
        }
        onClose();
      } else {
        antdMessage.error(response.message || "Thêm nhà phát hành thất bại.");
      }
    } catch (error) {
      antdMessage.error(error.message || "Đã có lỗi xảy ra khi thêm nhà phát hành.");
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
      title="Thêm Nhà Phát Hành Mới"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
      centered
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ description: '', contactInfo: '' }}>
        <Form.Item
          name="name"
          label="Tên Nhà Phát Hành"
          rules={[{ required: true, message: 'Vui lòng nhập tên nhà phát hành!' }]}
        >
          <Input placeholder="Nhập tên nhà phát hành" />
        </Form.Item>
        <Form.Item name="contactInfo" label="Thông tin liên hệ">
          <Input placeholder="Nhập thông tin liên hệ (tùy chọn)" />
        </Form.Item>
        <Form.Item name="description" label="Mô tả">
          <Input.TextArea rows={3} placeholder="Nhập mô tả (tùy chọn)" />
        </Form.Item>
        <Form.Item style={{ textAlign: 'right', marginTop: 16 }}>
          <Button onClick={handleCancel} style={{ marginRight: 8 }} disabled={loading}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Thêm Nhà Phát Hành
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const AppWrappedAddDistributorModal = (props) => (
    <App><AddDistributorModal {...props} /></App>
);

export default AppWrappedAddDistributorModal;