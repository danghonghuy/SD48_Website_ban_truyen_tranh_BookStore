import React, { useEffect, useState } from "react";
import { Button, Select, Dropdown, Table, Menu, DatePicker, Space } from "antd";
import { toast } from "react-toastify";
import { Pagination } from "antd";
import CouponAddOrChange from "./CouponAddOrChange";
import { Col, Form, Input, Row } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Option } from "antd/es/mentions";
import useCoupon from "../../../../api/useCoupons";
import { format } from "date-fns";
import CommonPopup from "./../Common/CommonPopup";
import dayjs from "dayjs";

function CouponManager() {
  const { getListCoupon, updateStatus } = useCoupon();
  const [coupon, setCoupon] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState();
  const [form] = Form.useForm();
  const [tableParams, setTableParams] = useState({
    pagination: {
      pageIndex: 1,
      pageSize: 10,
      startDate: null,
      endDate: null,
      minValue: null,
      maxValue: null,
      keySearch: null,
      status: null,
    },
  });
  const { RangePicker } = DatePicker;
  const [dates, setDates] = useState([]);
  const fetchData = async () => {
    const { success, data } = await getListCoupon(tableParams.pagination);
    if (!success || data.status === "Error") {
      toast.error("Có lỗi xảy ra");
    } else {
      setCoupon(data.data);
      setLoading(false);
      setTotal(data.totalCount);
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
      setCoupon([]);
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

  const handleSetEndDate = (date) => {
    setTableParams((prevPrams) => ({
      ...prevPrams,
      pagination: {
        ...prevPrams.pagination,
        endDate: date && dayjs(date).format("YYYY-MM-DD HH:mm:ss"),
      },
    }));
  };

  const handleSetStartDate = (date) => {
    setTableParams((prevPrams) => ({
      ...prevPrams,
      pagination: {
        ...prevPrams.pagination,
        startDate: date && dayjs(date).format("YYYY-MM-DD HH:mm:ss"),
      },
    }));
  };

  const handleChangeStatusSelect = (e) => {
    setTableParams((prevPrams) => ({
      ...prevPrams,
      pagination: {
        ...prevPrams.pagination,
        status: e,
      },
    }));
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

  const onSearchMinValue = (e) => {
    setTableParams((prevPrams) => ({
      ...prevPrams,
      pagination: {
        ...prevPrams.pagination,
        minValue: e.target.value,
      },
    }));
  };

  const onSearchMaxValue = (e) => {
    setTableParams((prevPrams) => ({
      ...prevPrams,
      pagination: {
        ...prevPrams.pagination,
        maxValue: e.target.value,
      },
    }));
  };

  const [idChangeStatus, setIdChangeStatus] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [status, setStatus] = useState();
  const handleChangeStatus = async (id, status) => {
    const { success, data } = await updateStatus(id, status);
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

  const menu = (record) => (
    <Menu>
      <Menu.Item>
        <CouponAddOrChange
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
      dataIndex: "number",
      key: "number",
      render: (_, __, index) => (
        <a style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {index + 1}
        </a>
      ),
    },
    {
      title: "Mã phiếu giảm giá",
      dataIndex: "code",
      key: "code",
      render: (text) => (
        <a style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {text}
        </a>
      ),
    },
    {
      title: "Tên phiếu giảm giá",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <a style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {text}
        </a>
      ),
    },
    {
      title: "Kiểu phiếu giảm giá",
      dataIndex: "type",
      render: (value) => {
        if (value === 1) {
          return (
            <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
              Chiết khấu phần trăm đơn hàng{" "}
            </p>
          );
        } else {
          return (
            <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
              Chiết khấu giá trị đơn hàng{" "}
            </p>
          );
        }
      },
    },
    {
      title: "Số lượng còn lại",
      dataIndex: "remainingQuantity",
      key: "remainingQuantity",
      render: (_, record) => {
        const remaining = record.quantity - record.quantityUsed;
        return (
          <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
            {remaining}
          </p>
        );
      },
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "dateStart",
      key: "dateStart",
      render: (_, record) => (
        <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {} {format(record.dateStartEpochTime, "dd-MM-yyyy HH:mm:ss")}
        </p>
      ),
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "dateEnd",
      key: "dateEnd",
      render: (_, record) => (
        <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {format(record.dateEndEpochTime, "dd-MM-yyyy HH:mm:ss")}
        </p>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (value) => {
        if (value === 0) {
          return (
            <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
              Đã kết thúc
            </p>
          );
        }
        if (value === 1) {
          return (
            <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
              Đang diễn ra
            </p>
          );
        }
        if (value === 2) {
          return (
            <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
              Sắp diễn ra
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
          <CouponAddOrChange
            fetchData={fetchData}
            modelItem={record}
            textButton={"Sửa"}
            isStyle={true}
          />
          {/* {record.status === 1 && (
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
          )} */}
          {/* {record.status === 0 && (
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
          )} */}
        </Space>
      ),
    },
  ];
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
          <Col span={6}>
            <Form.Item label="Key search" name="keySearch">
              <Input placeholder="" onChange={onSearchByKey} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Trạng thái" name="status">
              <Select
                placeholder="Chọn trạng thái"
                onChange={handleChangeStatusSelect}
                style={{
                  width: "100%",
                  height: "40px",
                }}
              >
                <Option value={0}>Đã kết thúc</Option>
                <Option value={1}>Đang diễn ra</Option>
                <Option value={2}>Sắp diễn ra</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
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
                      minValue: null,
                      maxValue: null,
                      startDate: null,
                      endDate: null,
                    },
                  }));
                  form.setFieldsValue({ keySearch: null, status: null });
                }}
              >
                Thiết lập lại
              </Button>
              <CouponAddOrChange
                fetchData={fetchData}
                modelItem={null}
                textButton={"Thêm mới"}
                isStyle={true}
              />
            </Row>
          </Col>
          <Col span={6}>
            <Form.Item label="Giá trị bắt đầu" name="minValue">
              <Input placeholder="" type="number" onChange={onSearchMinValue} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Giá trị kết thúc" name="maxValue">
              <Input placeholder="" type="number" onChange={onSearchMaxValue} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Start date" name="startDate">
              <DatePicker
                onChange={handleSetStartDate}
                style={{ width: "100%", height: "40px" }}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="End date" name="endDate">
              <DatePicker
                onChange={handleSetEndDate}
                style={{ width: "100%", height: "40px" }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table
        dataSource={coupon}
        columns={columns}
        pagination={false}
        loading={loading}
        onChange={handleTableChange}
      />
      <Pagination
        showSizeChanger
        onChange={onShowSizeChange}
        style={{ textAlign: "center", marginTop: "24px" }}
        defaultCurrent={tableParams.pagination.pageIndex}
        total={total}
      />
    </>
  );
}
export default CouponManager;
