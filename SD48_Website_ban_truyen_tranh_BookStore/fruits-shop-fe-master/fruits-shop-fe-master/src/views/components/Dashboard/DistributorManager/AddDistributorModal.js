// src/pages/DistributorManager/AddDistributorModal.js
import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, App } from 'antd';
import useDistributor from '@api/useDistributor';

const AddDistributorModal = ({ visible, onClose, onSuccess, initialData }) => {
  const [form] = Form.useForm();
  const { message: antdMessage } = App.useApp();
  const { addOrChangeDistributor } = useDistributor();

  useEffect(() => {
    if (visible) {
      if (initialData) {
        form.setFieldsValue({
          id: initialData.id,
          name: initialData.name,
          description: initialData.description,
          contactInfo: initialData.contactInfo,
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
        contactInfo: values.contactInfo,
        id: initialData ? initialData.id : null,
      };
      
      const response = await addOrChangeDistributor(payload);

      if (response && response.success && response.data && response.data.success !== false) {
        antdMessage.success(response.data.message || (initialData ? 'Cập nhật NPH thành công!' : 'Thêm NPH thành công!'));
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
      title={initialData ? 'Cập nhật Nhà Phát Hành' : 'Thêm mới Nhà Phát Hành'}
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
      <Form form={form} layout="vertical" name="distributor_form">
        {initialData && (
            <Form.Item name="id" hidden>
                <Input />
            </Form.Item>
        )}
        <Form.Item
          name="name"
          label="Tên Nhà Phát Hành"
          rules={[
            { required: true, message: 'Vui lòng nhập tên nhà phát hành!' },
            { max: 250, message: 'Tên không được vượt quá 250 ký tự!' },
            { whitespace: true, message: 'Tên nhà phát hành không được chỉ chứa khoảng trắng!' }
          ]}
        >
          <Input placeholder="Nhập tên nhà phát hành" />
        </Form.Item>
        <Form.Item
          name="contactInfo"
          label="Thông tin liên hệ"
          rules={[
            { max: 500, message: 'Thông tin liên hệ không được vượt quá 500 ký tự!' }
          ]}
        >
          <Input.TextArea rows={3} placeholder="Nhập email, số điện thoại, địa chỉ..." />
        </Form.Item>
        <Form.Item
          name="description"
          label="Mô tả"
        >
          <Input.TextArea rows={4} placeholder="Nhập mô tả (nếu có)" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const AddDistributorModalWrapper = (props) => (
    <App>
        <AddDistributorModal {...props} />
    </App>
);
export default AddDistributorModalWrapper;