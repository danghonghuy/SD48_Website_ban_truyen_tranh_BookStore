// src/pages/PublisherManager/AddPublisherModal.js
import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, App } from 'antd';
import usePublisher from '@api/usePublisher';

const AddPublisherModal = ({ visible, onClose, onSuccess, initialData }) => {
  const [form] = Form.useForm();
  const { message: antdMessage } = App.useApp();
  const { addOrChangePublisher } = usePublisher();

  useEffect(() => {
    if (visible) {
      if (initialData) {
        form.setFieldsValue({
          id: initialData.id,
          name: initialData.name,
          description: initialData.description,
          address: initialData.address,
          phoneNumber: initialData.phoneNumber,
          email: initialData.email,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialData, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        name: values.name,
        description: values.description,
        address: values.address,
        phoneNumber: values.phoneNumber,
        email: values.email,
        id: initialData ? initialData.id : null,
      };
      
      const response = await addOrChangePublisher(payload);

      if (response && response.success && response.data && response.data.success !== false) {
        antdMessage.success(response.data.message || (initialData ? 'Cập nhật NXB thành công!' : 'Thêm NXB thành công!'));
        if (onSuccess) {
          onSuccess(response.data.data);
        }
        onClose();
      } else {
        antdMessage.error(response?.data?.message || response?.message || 'Thao tác thất bại.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      antdMessage.error(error?.message || 'Vui lòng kiểm tra lại thông tin đã nhập hoặc đã có lỗi xảy ra.');
    }
  };

  return (
    <Modal
      title={initialData ? 'Cập nhật Nhà Xuất Bản' : 'Thêm mới Nhà Xuất Bản'}
      open={visible}
      onCancel={onClose}
      destroyOnClose
      footer={[
        <Button key="back" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {initialData ? 'Lưu thay đổi' : 'Thêm mới'}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" name="publisher_form">
        {initialData && (
            <Form.Item name="id" hidden>
                <Input />
            </Form.Item>
        )}
        <Form.Item
          name="name"
          label="Tên Nhà Xuất Bản"
          rules={[
            { required: true, message: 'Vui lòng nhập tên nhà xuất bản!' },
            { max: 250, message: 'Tên không được vượt quá 250 ký tự!' },
            { whitespace: true, message: 'Tên nhà xuất bản không được chỉ chứa khoảng trắng!' }
          ]}
        >
          <Input placeholder="Nhập tên nhà xuất bản" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { type: 'email', message: 'Email không hợp lệ!' },
            { max: 250, message: 'Email không được vượt quá 250 ký tự!' }
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          label="Số điện thoại"
          rules={[
            { max: 50, message: 'Số điện thoại không được vượt quá 50 ký tự!' },
            // Thêm regex nếu cần validate định dạng SĐT chặt chẽ hơn
            // { pattern: /^[0-9]+$/, message: 'Số điện thoại chỉ được chứa số!' } 
          ]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>
        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[
            { max: 500, message: 'Địa chỉ không được vượt quá 500 ký tự!' }
          ]}
        >
          <Input.TextArea rows={3} placeholder="Nhập địa chỉ" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Mô tả"
        >
          <Input.TextArea rows={3} placeholder="Nhập mô tả (nếu có)" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const AddPublisherModalWrapper = (props) => (
    <App>
        <AddPublisherModal {...props} />
    </App>
);
export default AddPublisherModalWrapper;