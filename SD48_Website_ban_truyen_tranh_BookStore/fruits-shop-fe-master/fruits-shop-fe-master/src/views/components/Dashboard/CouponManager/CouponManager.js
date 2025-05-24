import React, { useEffect, useState } from "react";
import {
  Button,
  Select,
  Table,
  DatePicker,
  Space,
  Tag,
  Col,
  Form,
  Input,
  Row,
  Pagination,
} from "antd";
import { toast } from "react-toastify";
import CouponAddOrChange from "./CouponAddOrChange";
import useCoupon from "../../../../api/useCoupons";
import { format, parseISO } from "date-fns"; // Thêm parseISO
import CommonPopup from "./../Common/CommonPopup";
import dayjs from "dayjs";

const { Option } = Select;

function CouponManager() {
  const { getListCoupon, updateStatus } = useCoupon();
  const [coupon, setCoupon] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
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

  // State cho popup xác nhận
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRecordForChange, setCurrentRecordForChange] = useState(null);
  const [actionTypeForPopup, setActionTypeForPopup] = useState(""); // 'deactivate' or 'reactivate'
  const [popupTitle, setPopupTitle] = useState("");
  const [popupContent, setPopupContent] = useState("");


  const fetchData = async () => {
    setLoading(true);
    const { success, data } = await getListCoupon(tableParams.pagination);
    if (!success || (data && data.status === "Error")) {
      toast.error(data?.message || "Có lỗi xảy ra khi tải danh sách!");
      setCoupon([]);
      setTotal(0);
    } else if (data && data.data) {
      setCoupon(data.data);
      setTotal(data.totalCount);
    } else {
      setCoupon([]);
      setTotal(0);
    }
    setLoading(false);
  };

// CouponManager.js
useEffect(() => {
    fetchData(); // Fetch lần đầu

    // Thiết lập interval để fetch lại dữ liệu mỗi X phút/giây
    const intervalId = setInterval(() => {
        console.log("Polling for new coupon data...");
        fetchData();
    }, 30000); // Ví dụ: fetch lại mỗi 60 giây (60000 ms)

    // Cleanup interval khi component unmount
    return () => clearInterval(intervalId);
}, [JSON.stringify(tableParams.pagination)]); // Vẫn giữ dependency này để fetch khi filter thay đổi

  const handleTableChange = (pagination) => {
    setTableParams((prev) => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        pageIndex: pagination.current,
        pageSize: pagination.pageSize,
      },
    }));
  };

  const onShowSizeChange = (current, pageSize) => {
    setTableParams((prevParams) => ({
      ...prevParams,
      pagination: {
        ...prevParams.pagination,
        pageIndex: 1,
        pageSize: pageSize,
      },
    }));
  };

  const handleSetEndDate = (date) => {
    setTableParams((prevParams) => ({
      ...prevParams,
      pagination: {
        ...prevParams.pagination,
        endDate: date ? dayjs(date).format("YYYY-MM-DD HH:mm:ss") : null,
        pageIndex: 1,
      },
    }));
  };

  const handleSetStartDate = (date) => {
    setTableParams((prevParams) => ({
      ...prevParams,
      pagination: {
        ...prevParams.pagination,
        startDate: date ? dayjs(date).format("YYYY-MM-DD HH:mm:ss") : null,
        pageIndex: 1,
      },
    }));
  };

  const handleChangeStatusSelect = (value) => {
    setTableParams((prevParams) => ({
      ...prevParams,
      pagination: {
        ...prevParams.pagination,
        status: value,
        pageIndex: 1,
      },
    }));
  };

  const onSearchByKey = (e) => {
    setTableParams((prevParams) => ({
      ...prevParams,
      pagination: {
        ...prevParams.pagination,
        keySearch: e.target.value,
        pageIndex: 1,
      },
    }));
  };

  const onSearchMinValue = (e) => {
    setTableParams((prevParams) => ({
      ...prevParams,
      pagination: {
        ...prevParams.pagination,
        minValue: e.target.value,
        pageIndex: 1,
      },
    }));
  };

  const onSearchMaxValue = (e) => {
    setTableParams((prevParams) => ({
      ...prevParams,
      pagination: {
        ...prevParams.pagination,
        maxValue: e.target.value,
        pageIndex: 1,
      },
    }));
  };

  const handleApiChangeStatus = async (id, newStatus) => {
    const { success, data } = await updateStatus(id, newStatus);
    if (!success || (data && data.status === "Error")) {
      toast.error(data?.message || "Cập nhật trạng thái thất bại!");
    } else {
      toast.success("Cập nhật trạng thái thành công!");
      fetchData();
    }
  };

  const handleOkPopup = () => {
    if (!currentRecordForChange) return;

    const record = currentRecordForChange;
    if (actionTypeForPopup === 'deactivate') {
      handleApiChangeStatus(record.id, 0); // Vô hiệu hóa (status = 0)
    } else if (actionTypeForPopup === 'reactivate') {
      const now = new Date();
      // Giả sử dateStart và dateEnd từ API là chuỗi ISO hoặc có thể parse bằng new Date()
      const dateStart = record.dateStart ? parseISO(record.dateStart) : null;
      const dateEnd = record.dateEnd ? parseISO(record.dateEnd) : null;

      if (!dateStart || !dateEnd) {
        toast.warn("Không thể kích hoạt: Phiếu không có ngày bắt đầu hoặc kết thúc hợp lệ.");
        setIsModalVisible(false);
        return;
      }
      if (dateEnd < dateStart) {
        toast.warn("Không thể kích hoạt: Ngày kết thúc không thể nhỏ hơn ngày bắt đầu.");
        setIsModalVisible(false);
        return;
      }

      if (now > dateEnd) {
        toast.warn("Phiếu này đã quá hạn. Vui lòng 'Sửa' để cập nhật ngày nếu muốn sử dụng lại.");
      } else if (now < dateStart) {
        handleApiChangeStatus(record.id, 2); // Sắp diễn ra
      } else { // dateStart <= now <= dateEnd
        handleApiChangeStatus(record.id, 1); // Đang diễn ra
      }
    }
    setIsModalVisible(false);
    setCurrentRecordForChange(null);
    setActionTypeForPopup("");
  };

  const handleCancelPopup = () => {
    setIsModalVisible(false);
    setCurrentRecordForChange(null);
    setActionTypeForPopup("");
  };

  const showConfirmationModal = (record, actionType) => {
    setCurrentRecordForChange(record);
    setActionTypeForPopup(actionType);
    if (actionType === 'deactivate') {
      setPopupTitle("Xác nhận vô hiệu hóa");
      setPopupContent(<p>Bạn có chắc chắn muốn vô hiệu hóa phiếu giảm giá <strong>{record.name}</strong> không?</p>);
    } else if (actionType === 'reactivate') {
      setPopupTitle("Xác nhận kích hoạt lại");
      setPopupContent(<p>Bạn có chắc chắn muốn kích hoạt lại phiếu giảm giá <strong>{record.name}</strong>? Trạng thái sẽ được cập nhật dựa trên thời gian hiệu lực của phiếu.</p>);
    }
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      align: "center",
      render: (_, __, index) => (
        <span>
          {(tableParams.pagination.pageIndex - 1) *
            tableParams.pagination.pageSize +
            index +
            1}
        </span>
      ),
    },
    {
      title: "Mã phiếu",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Tên phiếu",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
    },
    {
      title: "Kiểu phiếu",
      dataIndex: "type",
      key: "type",
      render: (value) => (
        <span>
          {value === 1
            ? "Chiết khấu phần trăm"
            : "Chiết khấu giá trị"}
        </span>
      ),
    },
    {
      title: "Còn lại",
      dataIndex: "remainingQuantity",
      key: "remainingQuantity",
      align: "center",
      render: (_, record) => <span>{record.quantity - record.quantityUsed}</span>,
    },
    {
      title: "Bắt đầu",
      dataIndex: "dateStart",
      key: "dateStart",
      render: (_, record) => (
        <span>
          {record.dateStart
            ? format(parseISO(record.dateStart), "dd-MM-yyyy HH:mm:ss")
            : "N/A"}
        </span>
      ),
    },
    {
      title: "Kết thúc",
      dataIndex: "dateEnd",
      key: "dateEnd",
      render: (_, record) => (
        <span>
          {record.dateEnd
            ? format(parseISO(record.dateEnd), "dd-MM-yyyy HH:mm:ss")
            : "N/A"}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (value) => {
        if (value === 0) return <Tag color="red">Đã kết thúc</Tag>;
        if (value === 1) return <Tag color="green">Đang diễn ra</Tag>;
        if (value === 2) return <Tag color="blue">Sắp diễn ra</Tag>;
        return <Tag>Không xác định</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <CouponAddOrChange
            fetchData={fetchData}
            modelItem={record}
            textButton={"Sửa"}
            isStyle={true}
          />
          {record.status === 1 && ( // Đang diễn ra
            <Button
              danger
              size="small"
              onClick={() => showConfirmationModal(record, 'deactivate')}
            >
              Vô hiệu hóa
            </Button>
          )}
          {record.status === 0 && ( // Đã kết thúc
            <Button
              type="primary"
              ghost
              size="small"
              onClick={() => showConfirmationModal(record, 'reactivate')}
            >
              Kích hoạt lại
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleResetFilters = () => {
    form.resetFields();
    setTableParams((prevParams) => ({
      ...prevParams,
      pagination: {
        pageIndex: 1,
        pageSize: prevParams.pagination.pageSize,
        startDate: null,
        endDate: null,
        minValue: null,
        maxValue: null,
        keySearch: null,
        status: null,
      },
    }));
  };

  return (
    <>
      <CommonPopup
        visible={isModalVisible}
        title={popupTitle}
        content={popupContent}
        onClose={handleCancelPopup}
        onOk={handleOkPopup}
        okText="Đồng ý"
        cancelText="Hủy bỏ"
      />
      <Form form={form} layout="vertical">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Từ khóa tìm kiếm" name="keySearch">
              <Input
                placeholder="Nhập mã, tên phiếu..."
                onChange={onSearchByKey}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Trạng thái" name="status">
              <Select
                placeholder="Chọn trạng thái"
                onChange={handleChangeStatusSelect}
                allowClear
              >
                <Option value={0}>Đã kết thúc</Option>
                <Option value={1}>Đang diễn ra</Option>
                <Option value={2}>Sắp diễn ra</Option>
              </Select>
            </Form.Item>
          </Col>
         
          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Ngày bắt đầu từ" name="startDate">
              <DatePicker
                style={{ width: "100%" }}
                onChange={handleSetStartDate}
                placeholder="Chọn ngày"
                format="DD-MM-YYYY"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Ngày kết thúc đến" name="endDate">
              <DatePicker
                style={{ width: "100%" }}
                onChange={handleSetEndDate}
                placeholder="Chọn ngày"
                format="DD-MM-YYYY"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Form.Item label=" ">
              <Space>
                <Button onClick={handleResetFilters}>Thiết lập lại</Button>
                <CouponAddOrChange
                  fetchData={fetchData}
                  modelItem={null}
                  textButton={"Thêm mới phiếu"}
                  isStyle={true}
                />
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table
        dataSource={coupon}
        columns={columns}
        rowKey="id"
        pagination={false}
        loading={loading}
        onChange={handleTableChange}
        style={{ marginTop: 20 }}
        scroll={{ x: "max-content" }}
      />
      {total > 0 && (
        <Pagination
          showSizeChanger
          onShowSizeChange={onShowSizeChange}
          onChange={(page, pageSize) =>
            setTableParams((prev) => ({
              ...prev,
              pagination: { ...prev.pagination, pageIndex: page, pageSize },
            }))
          }
          current={tableParams.pagination.pageIndex}
          pageSize={tableParams.pagination.pageSize}
          total={total}
          style={{ textAlign: "center", marginTop: "24px" }}
          showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} mục`}
        />
      )}
    </>
  );
}
export default CouponManager;