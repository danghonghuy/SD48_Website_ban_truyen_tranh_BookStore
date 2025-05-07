import { PlusSquareOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Pagination,
  Checkbox,
  Table,
} from "antd";
import React, { useEffect, useState } from "react";

const LogOrderPopup = ({ logActionOrderModels }) => {
  const [modal2Open, setModal2Open] = useState(false);

  const showModel = () => {
    setModal2Open(true);
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
      render: (text, record, index) => (
        <a style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {index + 1}
        </a>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <a style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {text}
        </a>
      ),
    },
    {
      title: "Ngày",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text, record) => (
        <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {text}
        </p>
      ),
    },
    {
      title: "Người xác nhận",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {text}
        </p>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (text, record) => (
        <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {text}
        </p>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="button"
        value="small"
        style={{
          alignItems: "center",
          background: "#2596be",
          marginBottom: "20px",
          color: "white",
        }}
        onClick={() => showModel()}
      >
        Chi tiết
      </Button>

      <Modal
        width={1000}
        title="Lịch sử"
        centered
        visible={modal2Open}
        onCancel={() => setModal2Open(false)}
        footer={null}
      >

        <Table
          dataSource={logActionOrderModels}
          columns={columns}
          pagination={false}
        />
      </Modal>
    </div>
  );
};

export default LogOrderPopup;
