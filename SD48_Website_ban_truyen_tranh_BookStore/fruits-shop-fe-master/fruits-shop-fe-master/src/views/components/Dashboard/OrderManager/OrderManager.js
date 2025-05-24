import { Link } from "react-router-dom";
import DetailOrder from "./DetailOrder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import useOrder from "@api/useOrder";
import usePayment from "@api/usePayment";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Pagination, Table, Space, Button } from "antd";
import {
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  DatePicker,
  AutoComplete,
} from "antd";
import useUser from "@api/useUser";
import dayjs from "dayjs";
import OrderAddOrChange from "./OrderAddOrChange";
import { ORDER_STATUS_LABEL, ORDER_STATUS_OPTIONS } from "@constants/orderStatusConstant";

function formatCurrencyVND(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

function OrderManager() {
  const { RangePicker } = DatePicker;
  const [dates, setDates] = useState([]);
  const { getListOrder } = useOrder();
  const { getListUser } = useUser();
  const [orders, setOrder] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState();
  const { getListPayment } = usePayment();
  const [payments, setPayments] = useState([]);
  const [form] = Form.useForm();
  const [tableEmployeeParams, setTableEmployeeParams] = useState({
    pagination: {
      pageIndex: 1,
      pageSize: 10,
      keySearch: "",
      roleId: 6,
      status: null,
    },
  });
  const [tableUserParams, setTableUserParams] = useState({
    pagination: {
      pageIndex: 1,
      pageSize: 10,
      keySearch: "",
      roleId: 5,
      status: null,
    },
  });
  const [queryUser, setQueryUser] = useState("");
  const [user, setUsers] = useState([]);
  const [optionUser, setOptionsUser] = useState([]);
  const [queryEmployee, setQueryEmployee] = useState("");
  const [employee, setEmployee] = useState([]);
  const [optionEmployee, setOptionsEmployee] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: {
      pageIndex: 1,
      pageSize: 10,
      paymentId: null,
      userId: null,
      employeeId: null,
      status: null,
      type: null,
      startPrice: null,
      endPrice: null,
      startDate: null,
      endDate: null,
    },
  });

  const uniqueOrderStatusOptions = ORDER_STATUS_OPTIONS.reduce((acc, current) => {
    const x = acc.find(item => item.code === current.code);
    if (!x) {
      return acc.concat([current]);
    }
    return acc;
  }, []);

  const selectStatusOptions = uniqueOrderStatusOptions.map(item => ({
    value: item.code,
    label: ORDER_STATUS_LABEL[item.value]
  }));

  const fetchPayment = async () => {
    const { success, data } = await getListPayment(tableParams.pagination);
    if (!success || data.status == "Error") {
      toast.error("Có lỗi xảy ra");
    } else {
      const result = data.data?.map((e) => ({
        value: e.id,
        label: e.name,
      }));
      setPayments(result);
    }
  };

  const handleDateChange = (value) => {
    setDates(value);
  };

  const fetchData = async () => {
    const { success, data } = await getListOrder(tableParams.pagination);
    console.log(data);
    if (success && data.status != "Error") {
      setOrder(data.data);
      setLoading(false);
      setTotal(data.totalCount);
    } else {
      toast.error(data?.message);
    }
  };

  useEffect(() => {
    if (tableEmployeeParams.pagination && tableEmployeeParams.pagination.keySearch.length > 0) {
      fetchEmployee();
    }
    if (tableUserParams.pagination && tableUserParams.pagination.keySearch.length > 0) {
      fetchUser();
    }
    fetchData();
    fetchPayment();
  }, [
    JSON.stringify(tableParams),
    JSON.stringify(tableEmployeeParams),
    JSON.stringify(tableUserParams),
    loading,
  ]);

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({ pagination, filters, ...sorter });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setOrder([]);
    }
  };

  const onShowSizeChange = (current, pageSize) => {
    setTableParams({ pagination: { pageIndex: current, pageSize: pageSize } });
  };

  const handleSetStartDate = (date) => {
    setTableParams((prevParams) => ({
      ...prevParams,
      pagination: { ...prevParams.pagination, startDate: date && dayjs(date).format("YYYY-MM-DD HH:mm:ss") },
    }));
  };

  const handleSetEndDate = (date) => {
    setTableParams((prevParams) => ({
      ...prevParams,
      pagination: { ...prevParams.pagination, endDate: date && dayjs(date).format("YYYY-MM-DD HH:mm:ss") },
    }));
  };

  const handleChangeStatusSelect = (e) => {
    setTableParams((prevParams) => ({
      ...prevParams,
      pagination: { ...prevParams.pagination, status: e },
    }));
  };

  const onSearchByKey = (e) => {
    setTableParams((prevParams) => ({
      ...prevParams,
      pagination: { ...prevParams.pagination, keySearch: e.target.value },
    }));
  };

  const onSearchMinValue = (e) => {
    setTableParams((prevParams) => ({
      ...prevParams,
      pagination: { ...prevParams.pagination, startPrice: e.target.value },
    }));
  };

  const handleSelectPayment = (e) => {
    setTableParams((prevParams) => ({
      ...prevParams,
      pagination: { ...prevParams.pagination, paymentId: e },
    }));
  };

  const handleSelectStatus = (e) => {
    setTableParams((prevParams) => ({
      ...prevParams,
      pagination: { ...prevParams.pagination, status: e },
    }));
  };

  const onSearchMaxValue = (e) => {
    setTableParams((prevParams) => ({
      ...prevParams,
      pagination: { ...prevParams.pagination, endPrice: e.target.value },
    }));
  };

  const columns = [
    {
      title: "STT",
      render: (_, __, index) => <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{index + 1}</p>,
    },
    {
      title: "Mã đơn hàng",
      render: (data) => <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{data.orderCode}</p>,
    },
    {
      title: "Ngày tạo",
      render: (data) => <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{data.orderDate}</p>,
    },
    {
      title: "Tên khách hàng",
      render: (data) => <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{data.customerName}</p>,
    },
    {
      title: "Số điện thoại",
      render: (data) => <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{data.phoneNumber}</p>,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "addressDetail",
      render: (_, record) => <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{record.addressDetail}</p>,
    },
    {
      title: "Nhân viên",
      dataIndex: "employeeName",
      key: "employeeName",
      render: (_, record) => <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{record.employeeName}</p>,
    },
    {
      title: "Trạng thái",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (_, record) => {
        let statusLabel = "";
        let statusColor = "gray";
        const fontWeight = "500";

        if (record.orderStatus === 1) {
          statusLabel = ORDER_STATUS_LABEL.ORDER_STATUS_WAITING_ACCEPT;
          statusColor = "red";
        } else if (record.orderStatus === 2) {
          statusLabel = ORDER_STATUS_LABEL.ORDER_STATUS_ACCEPT;
          statusColor = "blue";
        } else if (record.orderStatus === 3) {
          statusLabel = ORDER_STATUS_LABEL.ORDER_STATUS_DELIVERY;
          statusColor = "blueviolet";
        } else if (record.orderStatus === 4) {
          statusLabel = ORDER_STATUS_LABEL.ORDER_STATUS_FINISH_DELIVERY;
          statusColor = "black";
        } else if (record.orderStatus === 5) {
          statusLabel = ORDER_STATUS_LABEL.ORDER_STATUS_SUCCESS;
          statusColor = "green";
        } else if (record.orderStatus === 8) {
          statusLabel = ORDER_STATUS_LABEL.ORDER_STATUS_FAIL;
          statusColor = "red";
        } else if (record.orderStatus === 6) {
          statusLabel = ORDER_STATUS_LABEL.ORDER_STATUS_CUSTOMER_CANCEL;
          statusColor = "red";
        } else if (record.orderStatus === 7) {
          statusLabel = ORDER_STATUS_LABEL.ORDER_STATUS_CUSTOMER_CANCEL_RECEIVE || "Giao hàng thất bại";
          statusColor = "red";
        } else if (record.orderStatus === 9) {
          statusLabel = ORDER_STATUS_LABEL.ORDER_STATUS_SHOP_CANCEL;
          statusColor = "red";
        } else {
          statusLabel = `Không xác định (${record.orderStatus})`;
        }
        return <p style={{ fontSize: "13px", color: statusColor, fontWeight: fontWeight }}>{statusLabel}</p>;
      },
    },
    {
      title: "Giá trị",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (_, data) => <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{formatCurrencyVND(data.totalPrice + (data.feeDelivery || 0))}</p>,
    },
    {
      title: "Loại thanh toán",
      dataIndex: "paymentId",
      key: "paymentId",
      render: (_, record) => {
        if (record.paymentId === 1) return <p style={{ fontSize: "13px", fontWeight: "300" }}>Tiền mặt</p>;
        if (record.paymentId === 2) return <p style={{ fontSize: "13px", fontWeight: "300" }}>Chuyển khoản ngân hàng</p>;
        if (record.paymentId === 3) return <p style={{ fontSize: "13px", fontWeight: "300" }}>Ship COD</p>;
        if (record.paymentId === 4) return <p style={{ fontSize: "13px", fontWeight: "300" }}>MoMo</p>;
        return null;
      },
    },
    {
      title: "Loại đơn hàng",
      dataIndex: "deliveryType",
      key: "deliveryType",
      render: (_, record) => {
        if (record.deliveryType === 1) return <p style={{ fontSize: "13px", fontWeight: "300" }}>Tại quầy</p>;
        return <p style={{ fontSize: "13px", fontWeight: "300" }}>Giao hàng</p>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Link to={`/dashboard/order-detail/${record.orderId}`}>
            <Button type="primary" title="Detail Order">
              <FontAwesomeIcon icon={faCircleInfo} />
            </Button>
          </Link>
        </Space>
      ),
    },
  ];

  const onSearchByKeyUser = (e) => {
    setTableUserParams((prevParams) => ({
      ...prevParams,
      pagination: { ...prevParams.pagination, keySearch: e },
    }));
  };

  const onSearchByKeyEmployee = (e) => {
    setTableEmployeeParams((prevParams) => ({
      ...prevParams,
      pagination: { ...prevParams.pagination, keySearch: e },
    }));
  };

  const handleSelectUser = (value, option) => {
    setQueryUser(option.fullName);
    setTableParams((prevParams) => ({
      ...prevParams,
      pagination: { ...prevParams.pagination, userId: value },
    }));
  };

  const handleSelectEmployee = (value, option) => {
    setQueryEmployee(option.fullName);
    setTableParams((prevParams) => ({
      ...prevParams,
      pagination: { ...prevParams.pagination, employeeId: value },
    }));
  };

  const fetchUser = async () => {
    const { success, data } = await getListUser(tableUserParams.pagination);
    console.log(data);
    if (success && data.status != "Error") {
      setUsers(data.data);
      setLoading(false);
      toast.success(data.message);
      const model = data.data.map((e) => ({
        value: e.id,
        label: `${e.code} - ${e.phoneNumber} - ${e.fullName}`,
        key: e.id,
        fullName: e.fullName,
      }));
      setOptionsUser(model);
    } else {
      toast.error(data.message);
    }
  };

  const fetchEmployee = async () => {
    const { success, data } = await getListUser(tableEmployeeParams.pagination);
    console.log(data);
    if (success && data.status != "Error") {
      setEmployee(data.data);
      setLoading(false);
      toast.success(data.message);
      const model = data.data.map((e) => ({
        value: e.id,
        label: `${e.code} - ${e.phoneNumber} - ${e.fullName}`,
        key: e.id,
        fullName: e.fullName,
      }));
      setOptionsEmployee(model);
    } else {
      toast.error(data.message);
    }
  };

  return (
    <>
      <Form form={form} initialValues={{ layout: "horizontal" }} layout="vertical">
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Form.Item label="Khách hàng" name="userId" layout="vertical">
              <AutoComplete
                options={optionUser}
                onSearch={onSearchByKeyUser}
                onSelect={handleSelectUser}
                value={queryUser}
                onChange={setQueryUser}
                style={{ width: "100%" }}
              >
                <Input placeholder="Nhập mã, số điện thoại, tên khách hàng..." />
              </AutoComplete>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Nhân viên" name="employeeId" layout="vertical">
              <AutoComplete
                options={optionEmployee}
                onSearch={onSearchByKeyEmployee}
                onSelect={handleSelectEmployee}
                value={queryEmployee}
                onChange={setQueryEmployee}
                style={{ width: "100%", height: "40px" }}
              >
                <Input placeholder="Nhập mã, số điện thoại, tên nhân viên..." />
              </AutoComplete>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Thanh toán" name="paymentId" layout="vertical">
              <Select
                placeholder="Chọn hình thức thanh toán"
                onChange={handleSelectPayment}
                style={{ width: "100%", height: "40px" }}
                options={payments}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Trạng thái" name="status" layout="vertical">
              <Select
                placeholder="Chọn trạng thái"
                onChange={handleChangeStatusSelect}
                style={{ width: "100%", height: "40px" }}
                options={selectStatusOptions}
                allowClear
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Form.Item label="Giá trị đơn hàng từ" name="startPrice" layout="vertical">
              <Input placeholder="Nhập giá bắt đầu" type="number" onChange={onSearchMinValue} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Giá trị đơn hàng đến" name="endPrice" layout="vertical">
              <Input placeholder="Nhập giá kết thúc" type="number" onChange={onSearchMaxValue} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Từ ngày" name="startDate" layout="vertical">
              <DatePicker onChange={handleSetStartDate} style={{ width: "100%", height: "40px" }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Đến ngày" name="endDate" layout="vertical">
              <DatePicker onChange={handleSetEndDate} style={{ width: "100%", height: "40px" }} />
            </Form.Item>
          </Col>
          <Col span={12}></Col>
          <Col span={12}>
            <Row justify={"end"}>
              <Button
                type="button"
                style={{
                  background: "#2596be",
                  marginBottom: "20px",
                  color: "white",
                  marginRight: "10px",
                }}
                onClick={() => {
                  form.resetFields();
                  setQueryUser("");
                  setQueryEmployee("");
                  setTableParams((prevParams) => ({
                    ...prevParams,
                    pagination: {
                      pageIndex: 1,
                      pageSize: 10,
                      paymentId: null,
                      userId: null,
                      employeeId: null,
                      status: null,
                      type: null,
                      startPrice: null,
                      endPrice: null,
                      startDate: null,
                      endDate: null,
                      keySearch: prevParams.pagination.keySearch, // Giữ lại keySearch nếu có
                    },
                  }));
                }}
              >
                Thiết lập lại
              </Button>
            </Row>
          </Col>
        </Row>
      </Form>
      <Table
        dataSource={orders}
        columns={columns}
        pagination={false}
        loading={loading}
        onChange={handleTableChange}
        rowKey="orderId"
      />
      <Pagination
        showSizeChanger
        onShowSizeChange={onShowSizeChange}
        onChange={onShowSizeChange}
        style={{ textAlign: "center", marginTop: "1.5rem" }}
        current={tableParams.pagination.pageIndex}
        pageSize={tableParams.pagination.pageSize}
        total={total}
      />
    </>
  );
}

export default OrderManager;