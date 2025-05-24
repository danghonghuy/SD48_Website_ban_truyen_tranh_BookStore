import useType from "@api/useType";
import { Button, Col, Form, Input, Modal, Row } from "antd";
import React, { useEffect, useState, useCallback } from "react";
import { useToast } from "@utils/toastContext";

const ProductTypeAdd = ({
  visible,
  onClose,
  onSuccess,
  fetchData,
  initialData, // Thêm prop initialData
}) => {
  const [form] = Form.useForm();
  const { addOrChange, generateCode } = useType();
  const { toastMsg } = useToast();
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const isEditing = initialData !== null && initialData !== undefined;

  const fetchGeneratedCodeInternal = useCallback(async () => {
    if (isEditing) return; // Chỉ fetch code nếu là thêm mới
    try {
      const response = await generateCode();
      if (!response.success || (response.data && response.data.status === "Error")) {
        toastMsg(response.data?.message || "Lỗi khi tạo mã gói bán!", "error");
      } else if (response.data?.data) {
        form.setFieldsValue({ code: response.data.data });
      }
    } catch (error) {
      toastMsg("Lỗi khi tạo mã gói bán!", "error");
    }
  }, [isEditing, generateCode, form, toastMsg]);

  useEffect(() => {
    if (visible) {
      if (isEditing && initialData) {
        // Chế độ Sửa: điền dữ liệu từ initialData
        form.setFieldsValue({
          code: initialData.code,
          name: initialData.name,
          description: initialData.description,
        });
      } else {
        // Chế độ Thêm mới: reset form và fetch code
        form.resetFields();
        fetchGeneratedCodeInternal();
      }
    }
  }, [visible, initialData, form, isEditing, fetchGeneratedCodeInternal]);

  const handleCancel = () => {
    if (onClose) {
      onClose();
    }
  };

  const onFinish = async (values) => {
    setLoadingSubmit(true);
    try {
      const model = {
        code: values.code,
        name: values.name,
        description: values.description,
        status: initialData?.status !== undefined ? initialData.status : 1,
        isDeleted: initialData?.isDeleted !== undefined ? initialData.isDeleted : 0,
      };

      if (isEditing) {
        model.id = initialData.id; // Quan trọng: Thêm ID cho trường hợp sửa
      }

      const response = await addOrChange(model);

      if (response && response.success && response.data && response.data.success !== false && response.data.status !== "Error") {
        toastMsg(response.data.message || (isEditing ? "Cập nhật gói bán thành công!" : "Thêm gói bán thành công!"), "success");
        if (onSuccess) {
          onSuccess();
        }
        handleCancel();
      } else {
        toastMsg(response?.data?.message || response?.message || (isEditing ? "Cập nhật gói bán thất bại!" : "Thêm gói bán thất bại!"), "error");
      }
    } catch (error) {
      toastMsg(error?.message || "Đã có lỗi xảy ra.", "error");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <Modal
      title={isEditing ? "Cập nhật Gói bán" : "Thêm mới Gói bán"}
      centered
      open={visible}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item
              label="Mã gói bán"
              name="code"
              rules={[
                { required: true, message: "Mã gói bán không được để trống!" },
              ]}
            >
              <Input
                placeholder={isEditing ? "Mã gói bán" : "Mã gói bán tự động tạo"}
                readOnly={true}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item
              label="Tên gói bán"
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập tên gói bán!" },
              ]}
            >
              <Input placeholder="Nhập tên gói bán" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item
              label="Mô tả"
              name="description"
            >
              <Input.TextArea rows={3} placeholder="Nhập mô tả (nếu có)" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ textAlign: 'right', marginTop: 16 }}>
          <Button onClick={handleCancel} style={{ marginRight: 8 }} disabled={loadingSubmit}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit" loading={loadingSubmit}>
            {isEditing ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductTypeAdd;