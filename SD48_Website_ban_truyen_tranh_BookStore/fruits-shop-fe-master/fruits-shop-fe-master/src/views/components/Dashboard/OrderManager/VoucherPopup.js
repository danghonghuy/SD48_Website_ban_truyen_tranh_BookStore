import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Pagination,
  Space,
  Table,
  Typography,
} from "antd";
import React, { useEffect, useState, useCallback } from "react"; // useCallback có thể không cần thiết cho fetchData nữa
import useCoupon from "@api/useCoupons";
import { toast } from "react-toastify";
import { format, parseISO, fromUnixTime } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckDouble } from "@fortawesome/free-solid-svg-icons";

const { Text } = Typography;

const VoucherPopup = ({ handlePopupSelected }) => {
  const [openModal, setOpenModal] = useState(false);
  const { getListCoupon } = useCoupon(); // Giả sử getListCoupon là ổn định

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCoupons, setTotalCoupons] = useState(0);
  const [tableParams, setTableParams] = useState({
    pageIndex: 1,
    pageSize: 5,
    keySearch: "",
    status: 1,
  });

  // fetchData giờ là một hàm bình thường, nó sẽ sử dụng tableParams mới nhất từ state
  // khi được gọi bởi useEffect.
  const fetchData = async () => {
    console.log("VoucherPopup: fetchData called with tableParams:", JSON.stringify(tableParams));
    setLoading(true);
    try {
        const { success, data } = await getListCoupon(tableParams); // tableParams ở đây là state hiện tại
        if (success && data && data.status !== "Error" && data.data) {
            setCoupons(data.data);
            setTotalCoupons(data.totalCount || 0);
        } else {
            toast.error(data?.message || "Lỗi khi tải danh sách phiếu giảm giá!");
            setCoupons([]);
            setTotalCoupons(0);
        }
    } catch (error) {
        toast.error("Đã có lỗi xảy ra khi fetch coupon: " + error.message);
        setCoupons([]);
        setTotalCoupons(0);
    } finally {
        setLoading(false);
    }
  };

  // useEffect này sẽ chạy khi modal mở, hoặc khi các giá trị quan trọng của tableParams thay đổi
  useEffect(() => {
    if (openModal) {
      fetchData(); // Gọi fetchData
    }
  }, [
      openModal,
      tableParams.pageIndex,
      tableParams.pageSize,
      tableParams.keySearch,
      tableParams.status,
      // getListCoupon // Chỉ thêm nếu getListCoupon có thể thay đổi và bạn muốn fetch lại khi nó đổi
    ]);
  // Bằng cách liệt kê các thuộc tính của tableParams, useEffect sẽ chỉ chạy lại
  // khi một trong các giá trị này thực sự thay đổi.

  const showModalHandler = () => {
    // Khi mở modal, reset về trang đầu và xóa keySearch (nếu muốn)
    // để luôn load dữ liệu mới nhất của trang 1 không có filter cũ.
    setTableParams(prev => ({
        ...prev, // Giữ lại pageSize và status nếu muốn
        pageIndex: 1,
        keySearch: ""
    }));
    setOpenModal(true);
    // fetchData sẽ được trigger bởi useEffect ở trên do tableParams (pageIndex, keySearch) thay đổi
    // hoặc do openModal thay đổi.
  };

  const handleCancelModal = () => {
    setOpenModal(false);
    // Không cần reset tableParams ở đây nữa nếu showModalHandler đã làm khi mở lại
    // Hoặc nếu bạn muốn reset hoàn toàn khi đóng:
    // setTableParams({
    //     pageIndex: 1,
    //     pageSize: 5,
    //     keySearch: "",
    //     status: 1,
    // });
    // setCoupons([]);
    // setTotalCoupons(0);
  };

  const handleChangeKeySearch = (e) => {
    const newKeySearch = e.target.value;
    // Không gọi fetchData trực tiếp ở đây
    setTableParams((prevParams) => ({
      ...prevParams,
      pageIndex: 1, // Reset về trang đầu khi tìm kiếm
      keySearch: newKeySearch,
    }));
  };

  const handleSelectCoupon = (selectedCoupon) => {
    if (handlePopupSelected) {
      handlePopupSelected(selectedCoupon);
    }
    handleCancelModal();
  };

  function formatCurrencyVND(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) return 'N/A';
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }

  const columns = [
    {
      title: "Mã KM",
      dataIndex: "code",
      key: "code",
      width: 150,
      render: (text) => <Text style={{ fontSize: "13px" }}>{text}</Text>,
    },
    {
      title: "Tên khuyến mại",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      render: (text) => <Text style={{ fontSize: "13px" }}>{text}</Text>,
    },
    {
      title: "Loại KM",
      dataIndex: "type",
      key: "type",
      width: 180,
      render: (type) => {
        const typeText = type === 1 ? "Chiết khấu phần trăm" : "Chiết khấu tiền";
        return <Text style={{ fontSize: "13px" }}>{typeText}</Text>;
      },
    },
    {
      title: "Giá trị KM",
      key: "discountValue",
      width: 150,
      align: 'right',
      render: (_, record) => {
        const valueText = record.type === 1
          ? `${record.percentValue || 0}%`
          : formatCurrencyVND(record.couponAmount || 0);
        return <Text style={{ fontSize: "13px" }}>{valueText}</Text>;
      },
    },
    {
      title: "ĐH Tối thiểu",
      dataIndex: "minValue",
      key: "minValue",
      width: 150,
      align: 'right',
      render: (text) => <Text style={{ fontSize: "13px" }}>{formatCurrencyVND(text)}</Text>,
    },
    {
      title: "Hạn sử dụng",
      dataIndex: "dateEnd",
      key: "dateEnd",
      width: 170,
      align: 'center',
      render: (dateEndStringFromDataIndex, record) => {
        if (record.dateEndEpochTime && typeof record.dateEndEpochTime === 'number') {
          try {
            return <Text style={{ fontSize: "13px" }}>{format(new Date(record.dateEndEpochTime), "dd/MM/yyyy HH:mm")}</Text>;
          } catch (error) { /* Fallback */ }
        }
        if (dateEndStringFromDataIndex) {
          try {
            return <Text style={{ fontSize: "13px" }}>{format(parseISO(dateEndStringFromDataIndex), "dd/MM/yyyy HH:mm")}</Text>;
          } catch (error) {
            return <Text style={{ fontSize: "13px", color: "red" }}>Ngày lỗi</Text>;
          }
        }
        return <Text style={{ fontSize: "13px" }}>N/A</Text>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => handleSelectCoupon(record)}
            type="primary"
            size="small"
            icon={<FontAwesomeIcon icon={faCheckDouble} />}
            title="Chọn mã này"
          >
            Chọn
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        size="middle"
        style={{ alignItems: "center", width: "100%" }}
        onClick={showModalHandler}
      >
        Áp dụng mã
      </Button>

      <Modal
        width={"70%"}
        title="Chọn Mã Khuyến Mại"
        centered
        open={openModal}
        onCancel={handleCancelModal}
        footer={null}
        destroyOnClose
      >
        <Form layout="vertical" style={{ marginBottom: 16 }}>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={18}>
                    <Input
                        placeholder="Nhập mã hoặc tên phiếu để tìm kiếm..."
                        onChange={handleChangeKeySearch}
                        allowClear
                        // value không cần thiết nếu bạn muốn nó tự reset khi tableParams reset
                        // hoặc nếu bạn muốn giữ giá trị search thì value={tableParams.keySearch}
                    />
                </Col>
                <Col xs={24} sm={6}>
                    {/* Nút tìm kiếm này có thể không cần thiết nếu useEffect đã xử lý */}
                    {/* Nếu muốn có nút tìm kiếm tường minh: */}
                    <Button onClick={() => fetchData()} style={{width: '100%'}} type="primary">Tìm kiếm</Button>
                </Col>
            </Row>
        </Form>
        <Table
          dataSource={coupons}
          columns={columns}
          rowKey="id"
          pagination={false}
          loading={loading}
          scroll={{ x: 1000, y: 300 }}
          size="small"
        />
        {totalCoupons > 0 && (
          <Pagination
            current={tableParams.pageIndex}
            pageSize={tableParams.pageSize}
            total={totalCoupons}
            onChange={(page, pageSize) => {
                // Không gọi fetchData trực tiếp ở đây
                setTableParams(prev => ({...prev, pageIndex: page, pageSize: pageSize}));
            }}
            showSizeChanger
            onShowSizeChange={(current, size) => { // current ở đây là pageIndex hiện tại
                // Không gọi fetchData trực tiếp ở đây
                setTableParams(prev => ({...prev, pageIndex: 1, pageSize: size})); // Reset về trang 1
            }}
            style={{ textAlign: "center", marginTop: "24px" }}
            showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} mục`}
            pageSizeOptions={['5', '10', '20']}
          />
        )}
      </Modal>
    </div>
  );
};

export default VoucherPopup;