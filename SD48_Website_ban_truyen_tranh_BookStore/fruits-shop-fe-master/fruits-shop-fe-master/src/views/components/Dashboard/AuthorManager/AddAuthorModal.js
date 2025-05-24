// src/pages/AuthorManager/AddAuthorModal.js
import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, App } from 'antd';
import useAuthor from '@api/useAuthor';

const AddAuthorModal = ({ visible, onClose, onSuccess, initialData }) => {
  const [form] = Form.useForm();
  const { message: antdMessage } = App.useApp();
  const { addOrChangeAuthor } = useAuthor();

  useEffect(() => {
    if (visible) {
      if (initialData) {
        form.setFieldsValue({
          id: initialData.id,
          name: initialData.name,
          description: initialData.description,
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
        name: values.name, // Chỉ gửi các trường có trong form và cần thiết
        description: values.description,
        id: initialData ? initialData.id : null,
      };
      
      const response = await addOrChangeAuthor(payload);

      // Kiểm tra response cẩn thận hơn, dựa trên cấu trúc thực tế API trả về
      // Ví dụ, nếu API luôn trả về object có success và data (data này lại chứa data con)
      if (response && response.success && response.data && response.data.success !== false) { // Kiểm tra thêm response.data.success nếu có
        antdMessage.success(response.data.message || (initialData ? 'Cập nhật tác giả thành công!' : 'Thêm tác giả thành công!'));
        if (onSuccess) {
          onSuccess(response.data.data); // Truyền object tác giả từ response.data.data
        }
        onClose();
      } else {
        // Nếu response.data là object lỗi từ backend (ví dụ: {success: false, message: "..."})
        antdMessage.error(response?.data?.message || response?.message || 'Thao tác thất bại.');
      }
    } catch (error) { // Lỗi này thường là lỗi từ API (đã được throw từ hook) hoặc lỗi validate của form
      console.error('Submit error:', error);
      // Nếu error là object lỗi từ API (ví dụ: {success: false, message: "..."})
      antdMessage.error(error?.message || 'Vui lòng kiểm tra lại thông tin đã nhập hoặc đã có lỗi xảy ra.');
    }
  };

  return (
    <Modal
      title={initialData ? 'Cập nhật Tác giả' : 'Thêm mới Tác giả'}
      open={visible}
      onCancel={onClose}
      destroyOnClose // Reset trạng thái của Modal khi đóng
      footer={[
        <Button key="back" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" loading={form.getFieldValue('submitting')} onClick={handleSubmit}>
          {initialData ? 'Lưu thay đổi' : 'Thêm mới'}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" name="author_form">
        {initialData && (
            <Form.Item name="id" hidden>
                <Input />
            </Form.Item>
        )}
        <Form.Item
          name="name"
          label="Tên Tác giả"
          rules={[
            { required: true, message: 'Vui lòng nhập tên tác giả!' },
            { max: 250, message: 'Tên tác giả không được vượt quá 250 ký tự!' },
            { whitespace: true, message: 'Tên tác giả không được chỉ chứa khoảng trắng!' }
          ]}
        >
          <Input placeholder="Nhập tên tác giả" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Mô tả"
        >
          <Input.TextArea rows={4} placeholder="Nhập mô tả về tác giả (nếu có)" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const AddAuthorModalWrapper = (props) => (
    <App>
        <AddAuthorModal {...props} />
    </App>
);
export default AddAuthorModalWrapper;