import { Button, Modal, Form, Upload, Input } from 'antd';
import { InboxOutlined, UploadOutlined } from '@ant-design/icons'; // InboxOutlined không được sử dụng, có thể bỏ
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import classNames from 'classnames/bind';
import Styles from './UploadFile.module.scss';
import useFirmware from '@api/useFirmwares'; // Giả sử hook này dùng để tải lên firmware
import React from 'react';

const cx = classNames.bind(Styles);

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

// tailLayout không được sử dụng trong Form.Item cuối cùng, có thể bỏ hoặc sửa lại
// const tailLayout = {
// 	wrapperCol: { offset: 8, span: 16 },
// };

const UploadFile = ({ ID, onchange }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [name, setName] = useState(''); // Tên file do người dùng nhập
  const { uploadFile } = useFirmware(); // Đổi tên hook cho phù hợp nếu cần

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    try {
      // Validate form trước khi submit
      await form.validateFields();

      const formData = new FormData();
      formData.set('ID', ID); // Giữ nguyên ID nếu đây là ID của firmware/thiết bị
      formData.set('name', name); // Tên file người dùng đặt

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('file', fileList[0].originFileObj); // File thực tế để upload
      } else {
        // Có thể thêm thông báo lỗi nếu chưa chọn file
        // form.setFields([{ name: 'file', errors: ['Vui lòng chọn một tệp!'] }]);
        alert('Vui lòng chọn một tệp để tải lên.'); // Hoặc dùng toast
        return;
      }

      setConfirmLoading(true); // Bắt đầu loading
      const { success, data } = await uploadFile(formData); // Gọi API

      if (success) {
        // Giả sử API trả về message thành công
        // toast.success(data?.message || "Tải tệp lên thành công!"); // Sử dụng toast nếu có
        alert(data?.message || "Tải tệp lên thành công!");

        setTimeout(() => {
          setOpen(false);
          setConfirmLoading(false);
          onchange(); // Gọi callback sau khi thành công
          onReset(); // Reset form
        }, 1500); // Giảm thời gian chờ một chút
      } else {
        // Xử lý lỗi từ API
        // toast.error(data?.message || "Tải tệp lên thất bại. Vui lòng thử lại.");
        alert(data?.message || "Tải tệp lên thất bại. Vui lòng thử lại.");
        setConfirmLoading(false); // Dừng loading nếu lỗi
      }
    } catch (errorInfo) {
      console.log('Lỗi xác thực form:', errorInfo);
      setConfirmLoading(false); // Dừng loading nếu form không hợp lệ
    }
  };

  const handleCancel = () => {
    if (confirmLoading) return; // Không cho cancel khi đang loading
    setOpen(false);
    onReset(); // Reset form khi hủy
  };

  const onReset = () => {
    form.resetFields();
    setFileList([]);
    setName(''); // Reset cả state name
  };

  // Xử lý khi file thay đổi trong Upload component
  const handleFileChange = (info) => {
    // info.fileList là mảng các file đã chọn
    // Chỉ giữ lại file cuối cùng nếu chỉ cho phép upload 1 file
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-1); // Giữ lại file cuối cùng

    // Bạn có thể thêm logic kiểm tra loại file, kích thước file ở đây
    // Ví dụ:
    // const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    // if (!isJpgOrPng) {
    //   message.error('Bạn chỉ có thể tải lên file JPG/PNG!');
    // }
    // const isLt2M = file.size / 1024 / 1024 < 2;
    // if (!isLt2M) {
    //   message.error('Hình ảnh phải nhỏ hơn 2MB!');
    // }
    // if (isJpgOrPng && isLt2M) {
    //    setFileList(newFileList);
    // } else {
    //    setFileList([]); // Xóa file nếu không hợp lệ
    // }

    setFileList(newFileList);

    // Tự động điền tên file vào input "Tên tệp" nếu chưa có tên và người dùng chọn file
    if (newFileList.length > 0 && newFileList[0].name && !form.getFieldValue('name')) {
        const fileNameWithoutExtension = newFileList[0].name.substring(0, newFileList[0].name.lastIndexOf('.')) || newFileList[0].name;
        form.setFieldsValue({ name: fileNameWithoutExtension });
        setName(fileNameWithoutExtension);
    }
  };

  // Props cho Upload component
  const uploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
      if (newFileList.length === 0) {
        // Nếu xóa hết file, có thể xóa luôn tên file đã tự điền
        // form.setFieldsValue({ name: '' });
        // setName('');
      }
    },
    beforeUpload: (file) => {
      // Không tự động upload, chỉ thêm vào danh sách
      // setFileList([...fileList, file]); // Logic này đã được xử lý trong onChange
      return false; // Ngăn chặn upload tự động của Ant Design
    },
    fileList, // Danh sách file hiện tại
    onChange: handleFileChange, // Hàm xử lý khi file thay đổi
    maxCount: 1, // Chỉ cho phép chọn 1 file
  };

  return (
    <>
      <div className={cx('upload__btn')} onClick={showModal}>
        <Button type='primary' style={{ borderRadius: '20px', backgroundColor: 'rgb(39 183 236)' }}>
          <FontAwesomeIcon icon={faUpload} style={{ marginRight: '5px' }} />
          Tải lên {/* Việt hóa text */}
        </Button>
      </div>
      <Modal
        title='Tải Tệp Lên' // Việt hóa title
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText='Tải lên' // Việt hóa
        cancelText='Hủy' // Việt hóa
        className='upload__form' // Class này có thể không cần thiết nếu không có style riêng
        okButtonProps={{ style: { backgroundColor: 'rgb(39 183 236)' } }}
        destroyOnClose // Thêm prop này để reset state của form khi modal đóng hẳn
      >
        <Form {...layout} form={form} name='upload-form' initialValues={{ name: '' }}>
          <Form.Item
            name='name'
            label='Tên tệp' // Việt hóa
            rules={[{ required: true, message: 'Vui lòng nhập tên tệp!' }]} // Việt hóa message
          >
            <Input
              placeholder='Nhập tên cho tệp tải lên' // Việt hóa
              value={name} // Liên kết với state name
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </Form.Item>
          <Form.Item
            name='file'
            label='Chọn tệp' // Việt hóa
            rules={[{
                required: true,
                // Kiểm tra fileList trong rules để đảm bảo người dùng đã chọn file
                validator: async (_, value) => {
                    if (!fileList || fileList.length === 0) {
                        return Promise.reject(new Error('Vui lòng chọn một tệp!'));
                    }
                    return Promise.resolve();
                }
            }]}
            // valuePropName="fileList" // Không cần thiết nếu bạn quản lý fileList qua state riêng
          >
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Chọn Tệp</Button> {/* Việt hóa */}
            </Upload>
          </Form.Item>
          {/* Form.Item cho nút Reset không cần thiết, nút reset có thể đặt ngoài Form hoặc là 1 nút bình thường */}
          {/* <Form.Item {...tailLayout}> */}
          <div style={{ textAlign: 'right', marginTop: '20px' }}> {/* Căn phải nút Reset */}
            <Button htmlType='button' onClick={onReset} style={{ marginRight: '8px' }}>
              Làm lại {/* Việt hóa */}
            </Button>
             {/* Nút OK và Cancel đã được Modal quản lý */}
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default UploadFile;