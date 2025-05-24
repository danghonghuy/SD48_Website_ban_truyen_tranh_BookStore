import { EditOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Select, message } from "antd";
import React, { useState, useEffect } from "react";
import useProductService from "../TableDataDashboard/useProductService";
import notify from "../../../utils/notification";
import {
  EDIT_ERROR,
  EDIT_SUCCESS,
} from "../../../constants/notificationMessages";

const EditProduct = ({ record }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { updateProduct } = useProductService();

  // Fill form with record data when modal is opened
  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        branchId: record.BranchId,
        categoryId: record.CategoryId,
        originId: record.OriginId,
        productName: record.ProductName,
        productPrice: record.ProductPrice,
        productQuantity: record.ProductQuantity,
        productDescription: record.ProductDescription,
        productMaterial: record.ProductMaterial,
        views: record.Views,
        comment: record.Comment,
        rate: record.Rate,
        productType: record.ProductType,
        productSold: record.ProductSold,
        listFileImg: record.ListFileImg,
      });
    }
  }, [record, form]);

  const handleEdit = async () => {
    try {
      const values = await form.validateFields();
      const updatedProduct = {
        ...record,
        ...values,
      };
      console.log(updatedProduct);
      const response = await updateProduct(record.id, updatedProduct);

      if (response.status === 200) {
        notify(EDIT_SUCCESS, "info", "bottom-right");
        message.success("Product updated successfully!");
        setModalOpen(false);
      } else {
        message.error(response.data.message);
        notify(EDIT_ERROR, "error", "bottom-right");
      }
    } catch (error) {
      notify(EDIT_ERROR, "error", "bottom-right");
      console.error("Error editing product:", error.message);
      message.error("Failed to edit product.");
    }
  };

  return (
    <div>
      <Button
        icon={<EditOutlined />}
        type="primary"
        onClick={() => setModalOpen(true)}
        ghost
      />

      <Modal
        title="Edit Product"
        centered
        visible={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleEdit}>
            Submit
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Branch ID" name="branchId">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Category ID" name="categoryId">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Origin ID" name="originId">
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Product Name"
            name="productName"
            rules={[{ required: true, message: "Please input product name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Product Price"
            name="productPrice"
            rules={[{ required: true, message: "Please input product price!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Product Quantity"
            name="productQuantity"
            rules={[
              { required: true, message: "Please input product quantity!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Product Description"
            name="productDescription"
            rules={[
              { required: true, message: "Please input product description!" },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="Product Material" name="productMaterial">
            <Input />
          </Form.Item>
          <Form.Item label="Views" name="views">
            <Input />
          </Form.Item>
          <Form.Item label="Comment" name="comment">
            <Input />
          </Form.Item>
          <Form.Item label="Rate" name="rate">
            <Input />
          </Form.Item>
          <Form.Item
            label="Product Type"
            name="productType"
            rules={[{ required: true, message: "Please input product type!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Product Sold" name="productSold">
            <Input />
          </Form.Item>
          <Form.Item
            label="List File Image"
            name="listFileImg"
            rules={[
              { required: true, message: "Please input list file image!" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EditProduct;
