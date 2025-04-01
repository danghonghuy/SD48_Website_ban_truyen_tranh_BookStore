import { DeleteOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import React, { useState } from "react";
import useProductService from "../TableDataDashboard/useProductService";
import notify from "../../../utils/notification";
import {
  DELETE_ERROR,
  DELETE_SUCCESS,
} from "../../../constants/notificationMessages";

const DeleteProduct = ({ record }) => {
  const [modal2Open, setModal2Open] = useState(false);

  const { deleteProduct } = useProductService();

  const handleDelete = async () => {
    try {
      console.log(record.id);
      await deleteProduct(record.id);
      setModal2Open(false);

      notify(DELETE_SUCCESS, "warning", "bottom-right");
      console.log("Product deleted successfully!");
    } catch (error) {
      notify(DELETE_ERROR, "error", "bottom-right");
      console.error("Error deleting product:", error.message);
    }
  };
  return (
    <div>
      <Button
        icon={<DeleteOutlined />}
        type={"primary"}
        onClick={() => {
          setModal2Open(true);
          console.log(record);
          console.log("click!");
        }}
        danger
        ghost
      />

      <Modal
        title="Confirm Delete Product"
        centered
        open={modal2Open}
        onOk={() => {
          handleDelete();
          setModal2Open(false);
        }}
        onCancel={() => setModal2Open(false)}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ style: { background: "red", borderColor: "red" } }}
      >
        <p>Are you sure you want to delete this product?</p>
      </Modal>
    </div>
  );
};

export default DeleteProduct;
