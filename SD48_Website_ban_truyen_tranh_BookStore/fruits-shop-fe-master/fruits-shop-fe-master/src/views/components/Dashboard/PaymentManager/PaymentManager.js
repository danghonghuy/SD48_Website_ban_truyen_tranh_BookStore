import React, { useEffect, useState } from "react";
import {
  Button,
  Menu,
  Select,
  Dropdown,
  Table,
  Form,
  Input,
  Row,
  Col,
  Space,
} from "antd";
import { toast } from "react-toastify";
import { Pagination } from "antd";
import PaymentAdd from "./PaymentAdd";
import usePayment from "@api/usePayment";
import { Option } from "antd/es/mentions";
import CommonPopup from "./../Common/CommonPopup";

function PaymentManager() {
  const { getListPayment, changeStatus } = usePayment();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [total, setTotal] = useState();
  const [form] = Form.useForm();
  const [tableParams, setTableParams] = useState({
    pagination: {
      pageIndex: 1,
      pageSize: 10,
      keySearch: "",
      status: null,
    },
  });

  const [idChangeStatus, setIdChangeStatus] = useState();
  const [status, setStatus] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleChangeStatus = async (id, status) => {
    const { success, data } = await changeStatus(id, status);
    if (!success || data.status == "Error") {
      toast.error("Có lỗi xảy ra");
    } else {
      fetchData();
    }
  };
  const handleOk = () => {
    handleChangeStatus(idChangeStatus, status);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const showModal = (id, status) => {
    setIdChangeStatus(id);
    setStatus(status);
    setIsModalVisible(true);
  };

  const fetchData = async () => {
    const { success, data } = await getListPayment(tableParams.pagination);
    if (!success || data.status == "Error") {
      toast.error("Có lỗi xảy ra");
    } else {
      setPayments(data.data);
      setLoading(false);
      setTotal(data.data.totalCount);
    }
  };
  useEffect(() => {
    fetchData();
  }, [JSON.stringify(tableParams), loading, searchName]);

  const handleChangeName = (e) => {
    setTableParams((prevPrams) => ({
      ...prevPrams,
      pagination: {
        ...prevPrams.pagination,
        keySearch: e.target.value,
      },
    }));
  };
  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setPayments([]);
    }
  };
  const onShowSizeChange = (current, pageSize) => {
    setTableParams({
      pagination: {
        pageIndex: current,
        pageSize: pageSize,
      },
    });
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "orderNumber",
      key: "orderNumber",
      render: (_, __, index) => (
        <a style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {index + 1}
        </a>
      ),
    },
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
      render: (text) => (
        <a style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {text}
        </a>
      ),
    },

    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {record.name}
        </p>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (value) => {
        if (value == 1) {
          return (
            <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
              Hoạt động
            </p>
          );
        } else {
          return (
            <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
              Không hoạt động
            </p>
          );
        }
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <PaymentAdd
            fetchData={fetchData}
            modelItem={record}
            textButton={"Sửa"}
            isStyle={true}
          />
          {record.status === 1 && (
            <Button
              type={"primary"}
              value="small"
              style={{
                alignItems: "center",
                background: "#e74421",
              }}
              onClick={() => showModal(record.id, 0)}
            >
              {" "}
              Khóa{" "}
            </Button>
          )}
          {record.status === 0 && (
            <Button
              type={"primary"}
              value="small"
              style={{
                alignItems: "center",
                background: "#e2ddd1",
                color: "#100d06",
              }}
              onClick={() => showModal(record.id, 1)}
            >
              {" "}
              Mở khóa{" "}
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleChangeSelect = (value) => {
    setTableParams((prevParms) => ({
      ...prevParms,
      pagination: {
        ...prevParms.pagination,
        status: value,
      },
    }));
  };

  return (
    <>
      <CommonPopup
        visible={isModalVisible}
        title="Xác nhận"
        content={<p>Bạn chắc chắn cập nhật trạng thái bản ghi này?</p>} // You can replace this with any content
        onClose={handleCancel}
        onOk={handleOk}
      />
      <Form
        form={form}
        initialValues={{ layout: "horizontal" }}
        layout="vertical"
      >
        <Row gutter={[12, 12]}>
          <Col span={8}>
            <Form.Item
              label="Key search"
              name="keySearch"
              rules={[
                { required: false, message: "Please input product name!" },
              ]}
            >
              <Input
                placeholder="Enter code, name category"
                onChange={(e) => handleChangeName(e)}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Trạng thái" name="status">
              <Select
                value={tableParams.pagination.status}
                placeholder="Please select"
                onChange={handleChangeSelect}
                style={{
                  width: "100%",
                  height: "40px",
                }}
              >
                <Option value={1}>Hoạt động</Option>
                <Option value={0}>Không hoạt động</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8} style={{ textAlign: "right" }}>
            <Row justify={"end"}>
              <Button
                type="button"
                value="small"
                style={{
                  alignItems: "center",
                  background: "#2596be",
                  marginBottom: "20px",
                  color: "white",
                  marginRight: "10px",
                }}
                onClick={() => {
                  setTableParams((prevPrams) => ({
                    ...prevPrams,
                    pagination: {
                      ...prevPrams.pagination,
                      pageIndex: 1,
                      status: null,
                      keySearch: null,
                    },
                  }));
                  form.setFieldsValue({ keySearch: null, status: null });
                }}
              >
                Thiết lập lại
              </Button>
              <PaymentAdd
                fetchData={fetchData}
                modelItem={null}
                textButton={"Thêm mới"}
                isStyle={true}
              />
            </Row>
          </Col>
        </Row>
      </Form>

      <Table
        dataSource={payments}
        columns={columns}
        pagination={false}
        loading={loading}
        onChange={handleTableChange}
      />
      <Pagination
        showSizeChanger
        onChange={onShowSizeChange}
        style={{ textAlign: "center", marginTop: "1.5rem" }}
        defaultCurrent={tableParams.pagination.pageIndex}
        total={total}
      />
    </>
  );
}

export default PaymentManager;
