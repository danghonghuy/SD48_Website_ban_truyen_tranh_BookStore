import useOrder from "@api/useOrder";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useUser from "@store/useUser";
import {
  Button,
  Pagination,
  Space,
  Table,
  Typography,
  Tag,
  Spin,
  Empty,
  Tooltip,
  Modal,
  List,
  Divider,
  Descriptions,
  Row,
  Col,
  Card,
  Select,
  Input as AntdInput,
} from "antd";
import {
  ORDER_STATUS_LABEL,
  ORDER_STATUS,
  ORDER_STATUS_OPTIONS,
} from "constants/orderStatusConstant"; // Sử dụng ORDER_STATUS và ORDER_STATUS_OPTIONS
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  EyeOutlined,
  ShoppingCartOutlined,
  InfoCircleOutlined,
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  TagOutlined,
  CreditCardOutlined,
  CarryOutOutlined,
  UnorderedListOutlined,
  MessageOutlined,
  FileTextOutlined,
  StopOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { format, isValid, parseISO } from "date-fns";
import { getMediaUrl } from "@constants/commonFunctions";

const getStringStatusFromCode = (statusCode) => {
  const option = ORDER_STATUS_OPTIONS.find(opt => opt.code === statusCode);
  return option ? option.value : undefined; // option.value là chuỗi key, ví dụ: "ORDER_STATUS_WAITING_ACCEPT"
};
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const CANCEL_REASONS = [
  { value: "Thay đổi ý định mua hàng", label: "Thay đổi ý định mua hàng" },
  {
    value: "Tìm thấy sản phẩm tốt hơn ở nơi khác",
    label: "Tìm thấy sản phẩm tốt hơn ở nơi khác",
  },
  {
    value: "Muốn thay đổi sản phẩm trong đơn (màu sắc, kích thước,...)",
    label: "Muốn thay đổi sản phẩm trong đơn (màu sắc, kích thước,...)",
  },
  {
    value: "Muốn thay đổi địa chỉ giao hàng",
    label: "Muốn thay đổi địa chỉ giao hàng",
  },
  {
    value: "Muốn thay đổi phương thức thanh toán",
    label: "Muốn thay đổi phương thức thanh toán",
  },
  {
    value: "Thời gian giao hàng dự kiến quá lâu",
    label: "Thời gian giao hàng dự kiến quá lâu",
  },
  { value: "Đặt nhầm đơn hàng", label: "Đặt nhầm đơn hàng" },
  {
    value: "Lý do khác (vui lòng ghi rõ)",
    label: "Lý do khác (vui lòng ghi rõ)",
  },
];

const getNumericStatusCode = (statusString) => {
  const option = ORDER_STATUS_OPTIONS.find((opt) => opt.value === statusString);
  return option ? option.code : undefined;
};

const getStatusColorAntd = (statusString) => {
  const numericCode = getNumericStatusCode(statusString);
  switch (numericCode) {
    case 1:
      return "warning"; // Chờ xác nhận
    case 2:
      return "processing"; // Đã xác nhận
    case 3:
      return "purple"; // Chờ vận chuyển
    case 4:
      return "cyan"; // Đang vận chuyển
    case 5:
      return "success"; // Hoàn thành
    case 8:
      return "error"; // Tạo đơn thất bại
    case 6:
      return "volcano"; // Hủy đơn (Khách hủy)
    case 7:
      return "magenta"; // Giao hàng thất bại
    default:
      return "default";
  }
};

const formatCurrencyVND = (value) => {
  const num = Number(value);
  if (value === null || value === undefined || isNaN(num)) return "0 đ";
  return `${num.toLocaleString("vi-VN")} đ`;
};

const safeFormatDate = (dateString, formatString = "dd/MM/yyyy HH:mm") => {
  if (!dateString) return "-";
  let dateObject = parseISO(dateString);
  if (!isValid(dateObject)) dateObject = new Date(dateString);
  if (isValid(dateObject)) {
    try {
      return format(dateObject, formatString);
    } catch (e) {
      return dateString;
    }
  }
  return dateString;
};

function History() {
  const { token, id } = useUser();
  const { getListOrder, getOrderDetail, changeStatus } = useOrder();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [tableParams, setTableParams] = useState({
    pagination: { pageIndex: 1, pageSize: 10 },
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingModal, setLoadingModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [otherReason, setOtherReason] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const apiParams = { ...tableParams.pagination, userId: id };
      const { success, data } = await getListOrder(apiParams);
      if (success && data.status !== "Error") {
        if (data.data && Array.isArray(data.data)) {
          setOrders(data.data);
          setTotal(
            data.totalCount !== undefined
              ? data.totalCount
              : data.data.length > 0 && data.data[0]?.totalCount !== undefined
              ? data.data[0].totalCount
              : data.data.length
          );
        } else if (
          data.data &&
          Array.isArray(data.data.items) &&
          data.data.totalCount !== undefined
        ) {
          setOrders(data.data.items);
          setTotal(data.data.totalCount);
        } else {
          setOrders([]);
          setTotal(0);
        }
      } else {
        toast.error(data.message || "Lỗi tải lịch sử đơn hàng!");
        setOrders([]);
        setTotal(0);
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra khi tải dữ liệu.");
      setOrders([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
    else {
      setLoading(false);
      setOrders([]);
      setTotal(0);
    }
  }, [JSON.stringify(tableParams), id]);

  const handleTableChange = (paginationAntd, filters, sorter) => {
    setTableParams({
      pagination: {
        pageIndex: paginationAntd.current,
        pageSize: paginationAntd.pageSize,
      },
      filters,
      ...sorter,
    });
  };

  const onShowSizeChangeApp = (current, pageSize) => {
    setTableParams((prev) => ({
      ...prev,
      pagination: { pageIndex: current, pageSize: pageSize },
    }));
  };

  const showOrderDetailModal = async (orderRecord) => {
    setLoadingModal(true);
    setIsModalVisible(true);
    setCancelReason("");
    setOtherReason("");
    const orderIdForDetail = orderRecord.orderId;
    // console.log(">>> [showOrderDetailModal] orderRecord:", orderRecord);
    // console.log(">>> [showOrderDetailModal] ID to use for detail API:", orderIdForDetail);
    // console.log(">>> [showOrderDetailModal] Type of ID:", typeof orderIdForDetail);

    if (!orderIdForDetail || typeof orderIdForDetail !== "number") {
      toast.error(
        "ID đơn hàng không hợp lệ (cần là số) hoặc không tìm thấy để xem chi tiết."
      );
      setSelectedOrder({ ...orderRecord, orderDetailModels: [] });
      setLoadingModal(false);
      return;
    }
    try {
      // console.log(">>> [showOrderDetailModal] Calling getOrderDetail with ID:", orderIdForDetail);
      const response = await getOrderDetail(orderIdForDetail);
      // console.log(">>> [showOrderDetailModal] API Detail Response:", response);
      if (
        response.success &&
        response.data?.status !== "Error" &&
        response.data?.data
      ) {
        setSelectedOrder(response.data.data);
      } else {
        toast.error(
          response.data?.message ||
            response.message ||
            "Không thể tải chi tiết đơn hàng."
        );
        setSelectedOrder({ ...orderRecord, orderDetailModels: [] });
      }
    } catch (error) {
      // console.error(">>> [showOrderDetailModal] Error calling getOrderDetail:", error);
      toast.error("Lỗi nghiêm trọng khi tải chi tiết đơn hàng.");
      setSelectedOrder({ ...orderRecord, orderDetailModels: [] });
    } finally {
      setLoadingModal(false);
    }
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
    setCancelReason("");
    setOtherReason("");
  };

  const getDisplayOrderStatusLabel = (statusString) => {
    return ORDER_STATUS_LABEL[statusString] || "Không rõ";
  };

  const getPaymentTypeLabel = (paymentId) => {
    if (paymentId === 1) return "Tiền mặt";
    if (paymentId === 2) return "Chuyển khoản ngân hàng";
    if (paymentId === 3) return "Ship COD";
    return "Chưa rõ";
  };

  const getDeliveryTypeLabel = (deliveryType) => {
    if (deliveryType === 1) return "Tại quầy";
    return "Giao hàng";
  };

  const handleConfirmCancelOrder = async () => {
    if (!selectedOrder || !selectedOrder.id) {
      toast.error("Không có thông tin đơn hàng để hủy.");
      return;
    }
    if (!cancelReason) {
      toast.warn("Vui lòng chọn lý do hủy đơn hàng.");
      return;
    }
    let finalReason = cancelReason;
    if (
      cancelReason === "Lý do khác (vui lòng ghi rõ)" &&
      !otherReason.trim()
    ) {
      toast.warn("Vui lòng nhập lý do cụ thể.");
      return;
    }
    if (cancelReason === "Lý do khác (vui lòng ghi rõ)")
      finalReason = otherReason.trim();

    setLoadingModal(true);
    try {
      const statusStringToSent = ORDER_STATUS.ORDER_STATUS_CUSTOMER_CANCEL; // Gửi chuỗi tên Enum
      const response = await changeStatus(
        selectedOrder.id,
        statusStringToSent,
        finalReason
      );
      if (response.success && response.data?.status !== "Error") {
        toast.success("Đơn hàng đã được yêu cầu hủy thành công.");
        setIsModalVisible(false);
        fetchData();
      } else {
        toast.error(
          response.data?.message ||
            response.message ||
            "Không thể hủy đơn hàng. Vui lòng thử lại."
        );
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra trong quá trình hủy đơn hàng.");
    } finally {
      setLoadingModal(false);
    }
  };

  const canCancelOrder =
    selectedOrder &&
    selectedOrder.status === ORDER_STATUS.ORDER_STATUS_WAITING_ACCEPT;

  const columns = [
    {
      title: "STT",
      key: "stt",
      width: 60,
      align: "center",
      render: (_, __, index) => (
        <Text>
          {(tableParams.pagination.pageIndex - 1) *
            tableParams.pagination.pageSize +
            index +
            1}
        </Text>
      ),
    },
    {
      title: "Mã Đơn Hàng",
      dataIndex: "orderCode",
      key: "orderCode",
      render: (text) => (
        <Text strong style={{ color: "#4CAF50" }}>
          {text || "-"}
        </Text>
      ),
    },
    {
      title: "Ngày Đặt Hàng",
      dataIndex: "orderDate",
      key: "orderDate",
      width: 160,
      render: (text) => safeFormatDate(text),
    },
    {
      title: "Người Nhận",
      dataIndex: "customerName",
      key: "customerName",
      render: (text) => text || "-",
    },
 {
  title: "Trạng Thái",
  dataIndex: "orderStatus", // Giả sử đây là SỐ từ API getListOrder
  key: "orderStatus",
  width: 160,
  align: 'center',
  render: (statusCodeFromRecord, record) => { // statusCodeFromRecord là giá trị số từ record.orderStatus
    const statusStringKey = getStringStatusFromCode(statusCodeFromRecord); // Chuyển số thành chuỗi key

    if (!statusStringKey) { // Nếu không tìm thấy chuỗi key tương ứng (ví dụ: số trạng thái không hợp lệ)
      return <Tag color="default">Không rõ</Tag>;
    }

    // Bây giờ statusStringKey đã là chuỗi key chuẩn, giống như selectedOrder.status trong Modal
    return (
      <Tag
        icon={(statusStringKey === ORDER_STATUS.ORDER_STATUS_DELIVERY || statusStringKey === ORDER_STATUS.ORDER_STATUS_FINISH_DELIVERY) ? <SyncOutlined spin /> : null}
        color={getStatusColorAntd(statusStringKey)} // Truyền chuỗi key
        style={{minWidth: '110px', textAlign: 'center'}}
      >
        {ORDER_STATUS_LABEL[statusStringKey] || "Không rõ"} {/* Dùng chuỗi key với ORDER_STATUS_LABEL */}
        {/* Hoặc nếu getDisplayOrderStatusLabel(statusStringKey) của bạn hoạt động tốt với chuỗi key thì dùng nó */}
        {/* {getDisplayOrderStatusLabel(statusStringKey)} */}
      </Tag>
    );
  },
},
    {
      title: "Thành Tiền",
      key: "finalAmount",
      align: "right",
      width: 140,
      render: (_, record) => (
        <Text strong style={{ color: "#d32f2f" }}>
          {formatCurrencyVND(
            Number(record.feeDelivery || 0) + Number(record.totalPrice || 0)
          )}
        </Text>
      ),
    },
    {
      title: "Xem",
      key: "action",
      width: 80,
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Tooltip title="Xem chi tiết đơn hàng">
          <Button
            type="text"
            icon={
              <EyeOutlined style={{ color: "#4CAF50", fontSize: "16px" }} />
            }
            onClick={() => showOrderDetailModal(record)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px", background: "#f9f9f9" }}>
      <Title level={2} style={{ color: "#4CAF50", marginBottom: "25px" }}>
        <ShoppingCartOutlined style={{ marginRight: "10px" }} /> Lịch Sử Đơn
        Hàng
      </Title>
      <Spin spinning={loading} tip="Đang tải danh sách đơn hàng...">
        <Table
          dataSource={orders}
          columns={columns}
          pagination={false}
          rowKey={(record) =>
            record.orderId ||
            record.id ||
            record.orderCode ||
            `fallback-${Math.random()}`
          }
          onChange={handleTableChange}
          scroll={{ x: "max-content" }}
          style={{
            boxShadow: "0 2px 8px rgba(0,0,0,0.09)",
            borderRadius: "8px",
            background: "#fff",
          }}
          locale={{
            emptyText: (
              <Empty
                description="Bạn chưa có đơn hàng nào."
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
        />
      </Spin>
      {total > 0 && (
        <Pagination
          current={tableParams.pagination.pageIndex}
          pageSize={tableParams.pagination.pageSize}
          total={total}
          onChange={onShowSizeChangeApp}
          onShowSizeChange={onShowSizeChangeApp}
          showSizeChanger
          pageSizeOptions={["10", "20", "50", "100"]}
          style={{
            textAlign: "center",
            marginTop: "25px",
            paddingBottom: "10px",
          }}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} của ${total} đơn hàng`
          }
        />
      )}
      {selectedOrder && (
        <Modal
          title={
            <Space align="center">
              <InfoCircleOutlined
                style={{ color: "#4CAF50", fontSize: "24px" }}
              />
              <Text
                strong
                style={{
                  color: "#4CAF50",
                  fontSize: "20px",
                  lineHeight: "24px",
                }}
              >
                Chi Tiết Đơn Hàng:{" "}
                {selectedOrder.code || selectedOrder.orderCode}
              </Text>
            </Space>
          }
          open={isModalVisible}
          onCancel={handleCancelModal}
          footer={
            canCancelOrder
              ? [
                  <Button key="close" onClick={handleCancelModal}>
                    Đóng
                  </Button>,
                  <Button
                    key="submitCancel"
                    type="primary"
                    danger
                    icon={<StopOutlined />}
                    onClick={() => {
                      Modal.confirm({
                        title: "Xác nhận hủy đơn hàng",
                        icon: <StopOutlined style={{ color: "red" }} />,
                        content: (
                          <Space
                            direction="vertical"
                            style={{ width: "100%", marginTop: "20px" }}
                          >
                            {" "}
                            <Text>
                              Bạn có chắc chắn muốn hủy đơn hàng "
                              {selectedOrder.code || selectedOrder.orderCode}"?
                            </Text>{" "}
                            <Select
                              placeholder="Chọn lý do hủy đơn"
                              style={{ width: "100%" }}
                              onChange={(value) => setCancelReason(value)}
                              value={cancelReason}
                              options={CANCEL_REASONS}
                            />{" "}
                            {cancelReason ===
                              "Lý do khác (vui lòng ghi rõ)" && (
                              <AntdInput.TextArea
                                rows={2}
                                placeholder="Nhập lý do cụ thể của bạn..."
                                value={otherReason}
                                onChange={(e) => setOtherReason(e.target.value)}
                              />
                            )}{" "}
                          </Space>
                        ),
                        okText: "Xác nhận hủy",
                        okType: "danger",
                        cancelText: "Không",
                        onOk: handleConfirmCancelOrder,
                        onCancel: () => {
                          setCancelReason("");
                          setOtherReason("");
                        },
                        width: 500,
                      });
                    }}
                  >
                    {" "}
                    Yêu Cầu Hủy Đơn{" "}
                  </Button>,
                ]
              : [
                  <Button
                    key="close"
                    onClick={handleCancelModal}
                    style={{ borderColor: "#4CAF50", color: "#4CAF50" }}
                  >
                    Đóng
                  </Button>,
                ]
          }
          width={950}
          destroyOnClose
        >
          <Spin spinning={loadingModal} tip="Đang tải chi tiết...">
            {selectedOrder && (
              <Row gutter={[24, 24]}>
                <Col xs={24} md={12} lg={13}>
                  <Space
                    direction="vertical"
                    style={{ width: "100%" }}
                    size="middle"
                  >
                    <Card
                      title={
                        <Space>
                          <InfoCircleOutlined /> Thông Tin Chung
                        </Space>
                      }
                      bordered={false}
                      size="small"
                      headStyle={{
                        background: "#f0f8ff",
                        borderBottom: "1px solid #d9e8ff",
                      }}
                    >
                      <Descriptions
                        column={1}
                        size="small"
                        layout="horizontal"
                        styles={{ label: { fontWeight: 500, width: "140px" } }}
                      >
                        <Descriptions.Item label="Mã Đơn Hàng">
                          {selectedOrder.code || selectedOrder.orderCode}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày Đặt">
                          {safeFormatDate(selectedOrder.orderDate)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng Thái">
                          <Tag
                            icon={
                              selectedOrder.status ===
                                ORDER_STATUS.ORDER_STATUS_DELIVERY ||
                              selectedOrder.status ===
                                ORDER_STATUS.ORDER_STATUS_FINISH_DELIVERY ? (
                                <SyncOutlined spin />
                              ) : null
                            }
                            color={getStatusColorAntd(selectedOrder.status)}
                          >
                            {getDisplayOrderStatusLabel(selectedOrder.status)}
                          </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Loại Đơn Hàng">
                          {getDeliveryTypeLabel(
                            selectedOrder.deliveryType === null &&
                              selectedOrder.deliveryModel
                              ? selectedOrder.deliveryModel.id
                              : selectedOrder.deliveryType
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item label="Thanh Toán">
                          {getPaymentTypeLabel(
                            selectedOrder.paymentId === null &&
                              selectedOrder.paymentModel
                              ? selectedOrder.paymentModel.id
                              : selectedOrder.paymentId
                          )}
                        </Descriptions.Item>
                        {selectedOrder.employeeName && (
                          <Descriptions.Item label="NV Xử Lý">
                            {selectedOrder.employeeName}
                          </Descriptions.Item>
                        )}
                      </Descriptions>
                    </Card>
                    <Card
                      title={
                        <Space>
                          <UserOutlined /> Thông Tin Người Nhận
                        </Space>
                      }
                      bordered={false}
                      size="small"
                      headStyle={{
                        background: "#f0f8ff",
                        borderBottom: "1px solid #d9e8ff",
                      }}
                    >
                      <Descriptions
                        column={1}
                        size="small"
                        layout="horizontal"
                        styles={{ label: { fontWeight: 500, width: "140px" } }}
                      >
                        <Descriptions.Item label="Họ Tên">
                          {selectedOrder.userModel?.fullName ||
                            selectedOrder.customerName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Số Điện Thoại">
                          {selectedOrder.userModel?.phoneNumber ||
                            selectedOrder.phoneNumber}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                          {selectedOrder.userModel?.email || "Không có"}
                        </Descriptions.Item>
                        {(selectedOrder.deliveryType !== 1 ||
                          selectedOrder.deliveryModel?.id !== 1) && (
                          <Descriptions.Item label="Địa Chỉ Giao Hàng">
                            {selectedOrder.addressModel?.fullInfo ||
                              selectedOrder.userModel?.address?.[0]?.fullInfo ||
                              selectedOrder.addressDetail ||
                              "Không có"}
                          </Descriptions.Item>
                        )}
                      </Descriptions>
                    </Card>
                    {selectedOrder.logActionOrderModels?.length > 0 && (
                      <Card
                        title={
                          <Space>
                            <FileTextOutlined /> Lịch Sử Trạng Thái
                          </Space>
                        }
                        bordered={false}
                        size="small"
                        headStyle={{
                          background: "#f0f8ff",
                          borderBottom: "1px solid #d9e8ff",
                        }}
                        bodyStyle={{ padding: "0" }}
                      >
                        <List
                          size="small"
                          dataSource={selectedOrder.logActionOrderModels.sort(
                            (a, b) =>
                              new Date(b.createdDate).getTime() -
                              new Date(a.createdDate).getTime()
                          )}
                          renderItem={(item) => (
                            <List.Item
                              style={{
                                padding: "8px 16px",
                                borderBottom: "1px solid #f0f0f0",
                              }}
                            >
                              <List.Item.Meta
                                title={
                                  <Text strong style={{ fontSize: "13px" }}>
                                    {item.description ||
                                      getDisplayOrderStatusLabel(item.statusId)}
                                  </Text>
                                }
                                description={
                                  <>
                                    <Text
                                      type="secondary"
                                      style={{ fontSize: "12px" }}
                                    >
                                      {safeFormatDate(item.createdDate)}
                                    </Text>
                                    {item.note && (
                                      <Paragraph
                                        style={{
                                          fontSize: "12px",
                                          margin: "4px 0 0",
                                          fontStyle: "italic",
                                        }}
                                      >
                                        Ghi chú: {item.note}
                                      </Paragraph>
                                    )}
                                    {item.name && (
                                      <Text
                                        type="secondary"
                                        style={{
                                          fontSize: "12px",
                                          display: "block",
                                        }}
                                      >
                                        Bởi: {item.name}
                                      </Text>
                                    )}
                                  </>
                                }
                              />
                            </List.Item>
                          )}
                        />
                      </Card>
                    )}
                    {selectedOrder.description && (
                      <Card
                        title={
                          <Space>
                            <MessageOutlined /> Ghi Chú Đơn Hàng
                          </Space>
                        }
                        bordered={false}
                        size="small"
                        headStyle={{
                          background: "#f0f8ff",
                          borderBottom: "1px solid #d9e8ff",
                        }}
                      >
                        <Paragraph italic style={{ margin: 0 }}>
                          {selectedOrder.description}
                        </Paragraph>
                      </Card>
                    )}
                  </Space>
                </Col>
                <Col xs={24} md={12} lg={11}>
                  <Space
                    direction="vertical"
                    style={{ width: "100%" }}
                    size="large"
                  >
                    <Card
                      title={
                        <Space>
                          <UnorderedListOutlined /> Danh Sách Sản Phẩm
                        </Space>
                      }
                      bordered={false}
                      size="small"
                      headStyle={{
                        background: "#f0f8ff",
                        borderBottom: "1px solid #d9e8ff",
                      }}
                      bodyStyle={{ padding: 0 }}
                    >
                      {selectedOrder.orderDetailModels?.length > 0 ? (
                        <List
                          itemLayout="horizontal"
                          dataSource={selectedOrder.orderDetailModels}
                          renderItem={(item, index) => (
                            <List.Item
                              key={
                                item.id || item.productId || `product-${index}`
                              }
                              style={{ padding: "12px 16px" }}
                            >
                              <List.Item.Meta
                                avatar={
                                  <img
                                    width={60}
                                    height={60}
                                    alt={item.name || "Sản phẩm"}
                                    src={
                                      getMediaUrl(item.image) ||
                                      "https://via.placeholder.com/60?text=Book"
                                    }
                                    style={{
                                      objectFit: "cover",
                                      borderRadius: "4px",
                                      border: "1px solid #eee",
                                    }}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src =
                                        "https://via.placeholder.com/60?text=Error";
                                    }}
                                  />
                                }
                                title={
                                  <Text strong>
                                    {item.name || "Tên sản phẩm"}
                                  </Text>
                                }
                                description={
                                  <>
                                    <Text
                                      type="secondary"
                                      style={{ fontSize: "12px" }}
                                    >
                                      Mã SP: {item.code || "-"}
                                    </Text>
                                    <br />
                                    <Text style={{ fontSize: "13px" }}>
                                      SL: {item.quantity || 0} ×{" "}
                                      {formatCurrencyVND(item.price || 0)}
                                    </Text>
                                  </>
                                }
                              />
                              <div
                                style={{ textAlign: "right", minWidth: "80px" }}
                              >
                                <Text strong>
                                  {formatCurrencyVND(
                                    item.total ||
                                      (item.quantity || 0) * (item.price || 0)
                                  )}
                                </Text>
                              </div>
                            </List.Item>
                          )}
                        />
                      ) : (
                        <div style={{ padding: "20px" }}>
                          <Empty
                            description="Không có sản phẩm trong đơn hàng này."
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                          />
                        </div>
                      )}
                    </Card>
                    <Card
                      title={
                        <Space>
                          <CreditCardOutlined /> Chi Tiết Thanh Toán
                        </Space>
                      }
                      bordered={false}
                      size="small"
                      headStyle={{
                        background: "#f0f8ff",
                        borderBottom: "1px solid #d9e8ff",
                      }}
                    >
                      <Descriptions
                        column={1}
                        size="small"
                        layout="horizontal"
                        styles={{
                          label: { fontWeight: 500, width: "150px" },
                          content: { textAlign: "right" },
                        }}
                      >
                        <Descriptions.Item label="Tổng Tiền Hàng">
                          {formatCurrencyVND(selectedOrder.totalPrice)}
                        </Descriptions.Item>
                        {selectedOrder.couponModel && (
                          <Descriptions.Item
                            label={
                              <Space>
                                <TagOutlined /> Voucher
                                {selectedOrder.couponModel.code && (
                                  <Tag color="geekblue">
                                    {selectedOrder.couponModel.code}
                                  </Tag>
                                )}
                              </Space>
                            }
                          >
                            <Text type="danger">
                              -
                              {formatCurrencyVND(
                                selectedOrder.discountAmount ||
                                  selectedOrder.discount ||
                                  0
                              )}
                            </Text>
                          </Descriptions.Item>
                        )}
                        <Descriptions.Item label="Phí Vận Chuyển">
                          {formatCurrencyVND(selectedOrder.feeDelivery)}
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={
                            <Text strong style={{ fontSize: "16px" }}>
                              Thành Tiền
                            </Text>
                          }
                        >
                          <Text
                            strong
                            style={{ fontSize: "18px", color: "#d32f2f" }}
                          >
                            {formatCurrencyVND(
                              Number(selectedOrder.totalPrice || 0) +
                                Number(selectedOrder.feeDelivery || 0) -
                                Number(
                                  selectedOrder.discountAmount ||
                                    selectedOrder.discount ||
                                    0
                                )
                            )}
                          </Text>
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>
                  </Space>
                </Col>
              </Row>
            )}
          </Spin>
        </Modal>
      )}
      <style jsx global>{`
        .ant-table-thead > tr > th {
          background-color: #e6f7ff !important;
          color: #005080 !important;
          font-weight: 600 !important;
        }
        .ant-tag {
          font-size: 12px;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .ant-pagination-item-active {
          border-color: #4caf50;
          background-color: #4caf50;
        }
        .ant-pagination-item-active a {
          color: white !important;
        }
        .ant-pagination-item:hover {
          border-color: #388e3c;
        }
        .ant-pagination-item:hover a {
          color: #388e3c !important;
        }
        .ant-pagination-prev:hover .ant-pagination-item-link,
        .ant-pagination-next:hover .ant-pagination-item-link {
          border-color: #388e3c;
          color: #388e3c !important;
        }
        .ant-table-cell-fix-right {
          background: #fff !important;
        }
        .ant-modal-header {
          border-bottom: 1px solid #f0f0f0;
          padding: 16px 24px;
        }
        .ant-descriptions-item-label {
          color: #555 !important;
        }
        .ant-descriptions-bordered .ant-descriptions-item-label,
        .ant-descriptions-bordered .ant-descriptions-item-content {
          padding: 10px 16px !important;
        }
        .ant-list-item-meta-avatar {
          margin-right: 12px !important;
        }
        .ant-list-item-meta-title {
          margin-bottom: 2px !important;
        }
        .ant-card-head {
          padding: 0 16px !important;
          min-height: 40px !important;
        }
        .ant-card-head-title {
          padding: 10px 0 !important;
          font-size: 15px !important;
        }
      `}</style>
    </div>
  );
}

export default History;
