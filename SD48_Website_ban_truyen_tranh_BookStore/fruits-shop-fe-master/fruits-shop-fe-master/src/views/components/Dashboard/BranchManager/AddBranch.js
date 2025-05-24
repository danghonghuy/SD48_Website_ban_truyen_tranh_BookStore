import { Button, Col, Form, Input, Modal, Row, Select } from "antd";
import React, { useEffect, useState, useCallback } from "react";
import useCategory from "@api/useCategory";
import { useToast } from "@utils/toastContext";
import useCatalog from "@api/useCatalog";

const AddBranch = ({
  visible,
  onClose,
  onSuccess,
  fetchData,
  initialData,
}) => {
  const [form] = Form.useForm();
  const { generateCode, addOrChange } = useCategory();
  const { toastMsg } = useToast();
  const { getList: getCatalogList } = useCatalog();
  const [catalogs, setCatalogs] = useState([]);
  const [loadingCatalogs, setLoadingCatalogs] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const isEditing = initialData !== null && initialData !== undefined;

  const fetchGeneratedCodeInternal = useCallback(async () => {
    if (isEditing) return;
    try {
        const response = await generateCode();
        if (!response.success || (response.data && response.data.status === "Error")) {
          toastMsg(response.data?.message || "Lỗi khi tạo mã thể loại!", "error");
        } else if (response.data?.data) {
          form.setFieldsValue({ code: response.data.data });
        }
    } catch (error) {
        toastMsg("Lỗi khi tạo mã thể loại!", "error");
    }
  }, [isEditing, generateCode, form, toastMsg]);

  const fetchAllCatalogs = useCallback(async () => {
    setLoadingCatalogs(true);
    try {
      const response = await getCatalogList({
        pageIndex: 1, // Giữ nguyên như code gốc của bạn
        pageSize: 500,
        status: 1,
      });
      if (response.data?.data && response.success) {
        const dataResults = response.data.data.map((item) => ({
          value: item.id,
          label: item.name,
        }));
        setCatalogs(dataResults);
      } else {
        setCatalogs([]);
        if (response.data?.message) toastMsg(response.data.message, "error");
      }
    } catch (error) {
      setCatalogs([]);
      toastMsg("Lỗi khi tải danh mục.", "error");
    } finally {
      setLoadingCatalogs(false);
    }
  }, [getCatalogList, toastMsg]);

  useEffect(() => {
    if (visible) {
      fetchAllCatalogs();
      if (isEditing && initialData) {
        form.setFieldsValue({
          code: initialData.code,
          name: initialData.name,
          description: initialData.description,
          catalogId: initialData.catalogId,
        });
      } else {
        form.resetFields();
        fetchGeneratedCodeInternal();
      }
    } else {
      setCatalogs([]);
    }
  }, [visible, initialData, form, isEditing, fetchAllCatalogs, fetchGeneratedCodeInternal]);

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
        catalogId: values.catalogId,
      };

      if (isEditing) {
        model.id = initialData.id;
      }
      
      const response = await addOrChange(model);
      
      if (response && response.success && response.data && response.data.success !== false && response.data.status !== "Error") {
        toastMsg(response.data.message || (isEditing ? "Cập nhật thể loại thành công!" : "Thêm thể loại thành công!"), "success");
        if (onSuccess) {
          onSuccess();
        }
        handleCancel();
      } else {
         toastMsg(response?.data?.message || response?.message || (isEditing ? "Cập nhật thể loại thất bại!" : "Thêm thể loại thất bại!"), "error");
      }
    } catch (error) {
      toastMsg(error?.message || "Đã có lỗi xảy ra.", "error");
    } finally {
        setLoadingSubmit(false);
    }
  };

  return (
    <Modal
      title={isEditing ? "Cập nhật Thể loại truyện" : "Thêm mới Thể loại truyện"}
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
              label="Mã thể loại"
              name="code"
              rules={[
                { required: true, message: "Mã thể loại không được để trống!" },
              ]}
            >
              <Input
                placeholder={isEditing ? "Mã thể loại" : "Mã thể loại tự động tạo"}
                readOnly={true}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item
              label="Danh mục cha"
              name="catalogId"
              rules={[{ required: true, message: "Vui lòng chọn danh mục cha!" }]}
            >
              <Select
                placeholder="Chọn danh mục cha"
                options={catalogs}
                loading={loadingCatalogs}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                style={{ width: "100%" }}
                allowClear
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item
              label="Tên thể loại"
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập tên thể loại!" },
              ]}
            >
              <Input placeholder="Nhập tên thể loại" />
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

export default AddBranch;