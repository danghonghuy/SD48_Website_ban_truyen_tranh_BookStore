import {
  Col,
  Form,
  Input,
  Button,
  Row,
  Dropdown,
  Select,
  Menu,
  Table,
  Pagination,
  Space,
} from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import EmployeeAddOrChange from "./EmployeeAddOrChange";
import { Option } from "antd/es/mentions";
import useUser from "@api/useUser";
import { format } from "date-fns";
import { DownOutlined } from "@ant-design/icons";
import CommonPopup from "./../Common/CommonPopup";

function EmployeeManager() {
  const [user, setUsers] = useState([]);
  const { getListUser, changeStatus } = useUser();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [tableParams, setTableParams] = useState({
    pagination: {
      pageIndex: 1,
      pageSize: 10,
      keySearch: "",
      roleId: 6,
      status: null,
    },
  });

  const fetchData = async () => {
    const { success, data } = await getListUser(tableParams.pagination);
    console.log(data);
    if (success && data.status != "Error") {
      setUsers(data.data);
      setLoading(false);
      setTotal(data.data.totalCount);
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
  };
  useEffect(() => {
    fetchData();
  }, [JSON.stringify(tableParams), loading]);

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setUsers([]);
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

  const onSearchByKey = (e) => {
    setTableParams((prevPrams) => ({
      ...prevPrams,
      pagination: {
        ...prevPrams.pagination,
        keySearch: e.target.value,
      },
    }));
  };

  const onChangeStatus = (e) => {
    setTableParams((prevPrams) => ({
      ...prevPrams,
      pagination: {
        ...prevPrams.pagination,
        status: e,
      },
    }));
  };

  const menu = (record) => (
    <Menu>
      <Menu.Item>
        <EmployeeAddOrChange
          fetchData={fetchData}
          modelItem={record}
          textButton={"Edit"}
          isStyle={false}
        />
      </Menu.Item>
      <Menu.Item>
        <Button
          type="button"
          value="small"
          onClick={(e) => showModal(record.id)}
        >
          Delete
        </Button>
      </Menu.Item>
    </Menu>
  );
  const columns = [
    {
      title: "STT",
      dataIndex: "orderNumber",
      key: "orderNumber",
      render: (_, __, index) => (
        <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {index + 1}
        </p>
      ),
    },
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
      render: (_, record) => (
        <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {record.code}
        </p>
      ),
    },
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
      render: (_, record) => (
        <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {record.fullName}
        </p>
      ),
    },
    {
      title: "SĐT",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (_, record) => (
        <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {record.phoneNumber}
        </p>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (_, record) => (
        <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {record.email}
        </p>
      ),
    },
    {
      title: "Ngày sinh",
      dataIndex: "dateBirth",
      key: "dateBirth",
      render: (_, record) => (
        <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {record.dateBirth && format(record.dateBirth, "dd-MM-yyyy")}
        </p>
      ),
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "userName",
      key: "userName",
      render: (_, record) => (
        <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {record.userName}
        </p>
      ),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (_, record) => {
        if (record.gender) {
          return (
            <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
              Male
            </p>
          );
        } else {
          return (
            <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
              Female
            </p>
          );
        }
      },
    },
    {
      title: "Vai trò",
      dataIndex: "roleCode",
      key: "roleCode",
      render: (_, record) => (
        <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {record.roleCode}
        </p>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "roleCode",
      key: "status",
      render: (_, record) => {
        if (record.status === 1) {
          return (
            <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
              Hoạt động
            </p>
          );
        }
        if (record.status === 0) {
          return (
            <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
              Không hoạt động
            </p>
          );
        }
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <EmployeeAddOrChange
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
  const [idChangeStatus, setIdChangeStatus] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [status, setStatus] = useState();

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
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Form.Item
              label="Key search"
              name="keySearch"
              rules={[{ required: false }]}
            >
              <Input
                placeholder="Enter code, phone number, name customer..."
                onChange={onSearchByKey}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Trạng thái" name="status">
              <Select
                placeholder="Please select"
                onChange={onChangeStatus}
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

              <EmployeeAddOrChange
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
        dataSource={user}
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

export default EmployeeManager;
