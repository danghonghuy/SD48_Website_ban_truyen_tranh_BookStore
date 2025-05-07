import { PlusSquareOutlined } from "@ant-design/icons";
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
} from "antd";
import React, { useEffect, useState } from "react";
import useCoupon from "@api/useCoupons";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faCheckDouble } from "@fortawesome/free-solid-svg-icons";

const VoucherPopup = ({ handlePopupSelected, model }) => {
  const [modal2Open, setModal2Open] = useState(false);
  const { getListCoupon } = useCoupon();

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState();
  const [tableParams, setTableParams] = useState({
    pagination: {
      pageIndex: 1,
      pageSize: 5,
      keySearch: "",
      status: 1,
    },
  });

  const fetchData = async () => {
    const { success, data } = await getListCoupon(tableParams.pagination);
    if (!success || data.status == "Error") {
      toast.error("Có lỗi xảy ra");
    } else {
      setCoupons(data.data);
      setLoading(false);
      setTotal(data.totalCount);
    }
  };

  const showModel = () => {
    setModal2Open(true);
    fetchData();
  };

  const onFinish = () => {
    setModal2Open(false);
  };

  useEffect(() => {
    if (modal2Open && coupons && coupons.length === 0) {
      fetchData();
    }
  }, [JSON.stringify(tableParams), loading]);

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setCoupons([]);
    }
  };

  const handleChangeKeySearch = (e) => {
    setTableParams((prevPrams) => ({
      ...prevPrams,
      pagination: {
        ...prevPrams.pagination,
        pageIndex: 1,
        pageSize: 5,
        keySearch: e.target.value,
      },
    }));
    setCoupons([]);
  };
  const handleSelectCoupon = (model) => {
    handlePopupSelected(model);
    setModal2Open(false);
  };

  function formatCurrencyVND(amount) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }

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
      title: "Mã khuyến mại",
      dataIndex: "code",
      key: "code",
      render: (text) => (
        <a style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {text}
        </a>
      ),
    },
    {
      title: "Tên khuyến mại",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <a style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {text}
        </a>
      ),
    },
    {
      title: "Loại khuyến mại",
      dataIndex: "price",
      render: (_, record) => {
        if (record.type === 1) {
          return (
            <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
              Chiết khấu phần trăm
            </p>
          );
        } else {
          return (
            <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
              Chiết khấu tiền
            </p>
          );
        }
      },
    },
    {
      title: "Giá trị khuyến mại",
      dataIndex: "stock",
      key: "stock",
      render: (_, record) => {
        if (record.type === 1) {
          return (
            <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
              {record.percentValue}%
            </p>
          );
        } else {
          return (
            <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
              {formatCurrencyVND(record.couponAmount)}
            </p>
          );
        }
      },
    },
    {
      title: "Hạn sử dụng",
      dataIndex: "date",
      key: "date",
      render: (_, record) => (
        <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {format(record.dateEndEpochTime, "dd-MM-yyyy HH:mm:ss")}
        </p>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            onClick={(e) => handleSelectCoupon(record)}
            type="primary"
            title="Select"
          >
            <FontAwesomeIcon icon={faCheckDouble} />
          </Button>
        </Space>
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
          color: "white",
          width: "100%",
        }}
        onClick={() => showModel()}
      >
        Áp dụng mã
      </Button>

      <Modal
        width={"60%"}
        title="Mã khuyến mại"
        centered
        visible={modal2Open}
        onCancel={() => setModal2Open(false)}
        footer={null}
      >
        <br />
        <Row gutter={[5, 5]}>
          <Col span={18}>
            <Form.Item
              name="searchProduct"
              rules={[{ required: false, message: "" }]}
            >
              <Input
                placeholder="Enter code, name to search"
                onChange={handleChangeKeySearch}
              />
            </Form.Item>
          </Col>
        </Row>
        <Table
          dataSource={coupons}
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
      </Modal>
    </div>
  );
};

export default VoucherPopup;
