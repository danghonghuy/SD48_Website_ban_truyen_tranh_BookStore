import React, { useEffect, useState } from "react";
import {
  Button,
  Select,
  Table,
  DatePicker,
  Space,
  Tag, // Added Tag
  Col,
  Form,
  Input,
  Row,
  Pagination,
} from "antd";
import { toast } from "react-toastify";
import DiscountAddOrChange from "./DiscountAddOrChange";
import useDiscount from "../../../../api/useDiscount";
import { format, parseISO } from "date-fns"; // Added parseISO
import CommonPopup from "./../Common/CommonPopup";
import dayjs from "dayjs";

const { Option } = Select;

function DiscountManager() {
  const { getListDiscount, changeStatus } = useDiscount(); // Renamed updateStatus to changeStatus from hook
  const [discountList, setDiscountList] = useState([]); // Renamed coupon to discountList for clarity
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [form] = Form.useForm();
  const [tableParams, setTableParams] = useState({
    pagination: {
      pageIndex: 1,
      pageSize: 10,
      startDate: null,
      endDate: null,
      // minValue: null, // DiscountManager might not need these, remove if not used by API
      // maxValue: null,
      keySearch: null,
      status: null, // Default to null to show all, or 1 if 'Đang diễn ra' is default
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
    const { success, data } = await getListDiscount(tableParams.pagination);
    if (!success || (data && data.status === "Error")) {
      toast.error(data?.message || "Có lỗi xảy ra khi tải danh sách!");
      setDiscountList([]);
      setTotal(0);
    } else if (data && data.data) {
      setDiscountList(data.data);
      setTotal(data.totalCount);
    } else {
      setDiscountList([]);
      setTotal(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(tableParams.pagination)]); // Trigger fetch when pagination/filters change

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
        pageIndex: 1, // Reset to page 1 on size change
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
        pageIndex: 1, // Reset to page 1 on filter change
      },
    }));
  };

  const handleSetStartDate = (date) => {
    setTableParams((prevParams) => ({
      ...prevParams,
      pagination: {
        ...prevParams.pagination,
        startDate: date ? dayjs(date).format("YYYY-MM-DD HH:mm:ss") : null,
        pageIndex: 1, // Reset to page 1 on filter change
      },
    }));
  };

  const handleChangeStatusSelect = (value) => {
    setTableParams((prevParams) => ({
      ...prevParams,
      pagination: {
        ...prevParams.pagination,
        status: value,
        pageIndex: 1, // Reset to page 1 on filter change
      },
    }));
  };

  const onSearchByKey = (e) => {
    const value = e.target.value.trim() === "" ? null : e.target.value.trim();
    setTableParams((prevParams) => ({
      ...prevParams,
      pagination: {
        ...prevParams.pagination,
        keySearch: value,
        pageIndex: 1, // Reset to page 1 on filter change
      },
    }));
  };

  // If DiscountManager has min/max value filters, add handlers similar to CouponManager
  // const onSearchMinValue = (e) => { ... };
  // const onSearchMaxValue = (e) => { ... };

  const handleApiChangeStatus = async (id, newStatus) => {
    // Assuming useDiscount's changeStatus takes (id, status)
    const { success, data } = await changeStatus(id, newStatus);
    if (!success || (data && data.status === "Error")) {
      toast.error(data?.message || "Cập nhật trạng thái thất bại!");
    } else {
      toast.success("Cập nhật trạng thái thành công!");
      fetchData(); // Refresh data
    }
  };

  const handleOkPopup = () => {
    if (!currentRecordForChange) return;

    const record = currentRecordForChange;
    // API returns startDate, endDate for discounts. CouponManager uses dateStart, dateEnd.
    // Adjust here if your Discount API returns different field names.
    // For consistency, let's assume your API for discount returns `startDate` and `endDate`
    const recordStartDateField = record.startDate; // Or record.dateStart if API uses that
    const recordEndDateField = record.endDate;     // Or record.dateEnd if API uses that


    if (actionTypeForPopup === 'deactivate') {
      handleApiChangeStatus(record.id, 0); // Vô hiệu hóa (status = 0)
    } else if (actionTypeForPopup === 'reactivate') {
      const now = new Date();
      const dateStart = recordStartDateField ? parseISO(recordStartDateField) : null;
      const dateEnd = recordEndDateField ? parseISO(recordEndDateField) : null;

      if (!dateStart || !dateEnd) {
        toast.warn("Không thể kích hoạt: Chương trình không có ngày bắt đầu hoặc kết thúc hợp lệ.");
        setIsModalVisible(false);
        return;
      }
      if (dateEnd < dateStart) {
        toast.warn("Không thể kích hoạt: Ngày kết thúc không thể nhỏ hơn ngày bắt đầu.");
        setIsModalVisible(false);
        return;
      }

      if (now > dateEnd) {
        toast.warn("Chương trình này đã quá hạn. Vui lòng 'Sửa' để cập nhật ngày nếu muốn sử dụng lại.");
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
      setPopupContent(<p>Bạn có chắc chắn muốn vô hiệu hóa chương trình khuyến mãi <strong>{record.name}</strong> không?</p>);
    } else if (actionType === 'reactivate') {
      setPopupTitle("Xác nhận kích hoạt lại");
      setPopupContent(<p>Bạn có chắc chắn muốn kích hoạt lại chương trình khuyến mãi <strong>{record.name}</strong>? Trạng thái sẽ được cập nhật dựa trên thời gian hiệu lực.</p>);
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
      title: "Tên chương trình", // Adjusted title
      dataIndex: "name",
      key: "name",
      ellipsis: true,
    },
    {
      title: "Kiểu khuyến mãi", // Adjusted title
      dataIndex: "type",
      key: "type",
      render: (value) => (
        <span>
          {value === 1
            ? "Chiết khấu phần trăm" // Keep your existing logic
            : "Chiết khấu giá trị"}
        </span>
      ),
    },
    // If 'Còn lại' (Remaining Quantity) is applicable to discounts, add it here
    // {
    //   title: "Còn lại",
    //   dataIndex: "remainingQuantity", // Or relevant field
    //   key: "remainingQuantity",
    //   align: "center",
    //   render: (_, record) => <span>{record.quantity - record.quantityUsed}</span>, // Adjust logic as needed
    // },
    {
      title: "Bắt đầu",
      dataIndex: "startDate", // Assuming API returns startDate
      key: "startDate",
      render: (_, record) => (
        <span>
          {record.startDate // Or record.dateStart
            ? format(parseISO(record.startDate), "dd-MM-yyyy HH:mm:ss")
            : "N/A"}
        </span>
      ),
    },
    {
      title: "Kết thúc",
      dataIndex: "endDate", // Assuming API returns endDate
      key: "endDate",
      render: (_, record) => (
        <span>
          {record.endDate // Or record.dateEnd
            ? format(parseISO(record.endDate), "dd-MM-yyyy HH:mm:ss")
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
          <DiscountAddOrChange
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
    form.resetFields(); // Clears Form.Item inputs
    setTableParams((prevParams) => ({
      ...prevParams,
      pagination: {
        pageIndex: 1,
        pageSize: prevParams.pagination.pageSize, // Keep current page size
        startDate: null,
        endDate: null,
        // minValue: null, // Reset if used
        // maxValue: null, // Reset if used
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
                placeholder="Nhập tên chương trình..."
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
          {/* If DiscountManager needs Min/Max Value filters, add them here like CouponManager */}
          {/* <Col xs={24} sm={12} md={4}>...</Col> */}
          {/* <Col xs={24} sm={12} md={4}>...</Col> */}
          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Ngày bắt đầu từ" name="form_startDate"> {/* Changed name to avoid conflict with tableParams state */}
              <DatePicker
                style={{ width: "100%" }}
                onChange={handleSetStartDate}
                placeholder="Chọn ngày"
                format="DD-MM-YYYY"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Ngày kết thúc đến" name="form_endDate"> {/* Changed name */}
              <DatePicker
                style={{ width: "100%" }}
                onChange={handleSetEndDate}
                placeholder="Chọn ngày"
                format="DD-MM-YYYY"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={8}> {/* Adjusted Col span for buttons */}
            <Form.Item label=" "> {/* Keep empty label for alignment */}
              <Space>
                <Button onClick={handleResetFilters}>Thiết lập lại</Button>
                <DiscountAddOrChange
                  fetchData={fetchData}
                  modelItem={null}
                  textButton={"Thêm mới CTKM"} // CTKM: Chương trình khuyến mãi
                  isStyle={true} // To make it a styled button
                />
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table
        dataSource={discountList}
        columns={columns}
        rowKey="id"
        pagination={false} // Use custom Pagination component below
        loading={loading}
        onChange={handleTableChange} // For sorting if needed, not strictly for pagination here
        style={{ marginTop: 20 }}
        scroll={{ x: "max-content" }} // Good for responsiveness
      />
      {total > 0 && (
        <Pagination
          showSizeChanger
          onShowSizeChange={onShowSizeChange}
          onChange={(page, pageSize) => // Combined page and pageSize change handler
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
export default DiscountManager;