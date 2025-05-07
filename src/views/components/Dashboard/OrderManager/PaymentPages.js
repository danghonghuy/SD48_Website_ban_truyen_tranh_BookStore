import { PlusSquareOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Divider,
  Table,
} from "antd";
import React, { useEffect, useState } from "react";
import usePayment from "@api/usePayment";
import useDelivery from "@api/useDelivery";
import { toast } from "react-toastify";
import useCoupon from "@api/useCoupons";
import PaymentType from "./PaymentType";
import useOrder from "@api/useOrder";
import { useNavigate } from "react-router-dom";
import { getMediaUrl } from "@constants/commonFunctions";

function formatCurrencyVND(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

const PaymentPage = ({ userInfo, producs, callback, tabId }) => {
  const [modal2Open, setModal2Open] = useState(false);
  const [payments, setPayments] = useState([]);
  const [delivery, setDelivery] = useState([]);
  const [optionDelivery, setOptionDelivery] = useState([]);
  const { getListPayment } = usePayment();
  const { getListDelivery } = useDelivery();
  const { getCouponCode } = useCoupon();
  const { createOrder } = useOrder();
  const [form] = Form.useForm();
  const [totalPrice, setTotalPrice] = useState(0);
  const [feeDelivery, setFeeDelivery] = useState(0);
  const [paymentId, setPaymentId] = useState(0);
  const [deleveryId, setDeleveryId] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const navigate = useNavigate();
  const [tableParams, setTableParams] = useState({
    pagination: {
      pageIndex: 1,
      pageSize: 10,
      keySearch: "",
    },
  });
  const showModel = () => {
    setModal2Open(true);
    fetchPayment();
    fetchDelivery();
    form.setFieldsValue({
      name: userInfo.fullName,
      phone: userInfo.phoneNumber,
      address: userInfo.address && userInfo.address[0]?.fullInfo,
    });
    const sum = producs.reduce(
      (accumulator, currentItem) =>
        accumulator + currentItem.price * currentItem.quantity,
      0
    );
    setTotalPrice(sum);
  };
  const fetchPayment = async () => {
    const { success, data } = await getListPayment(tableParams.pagination);
    if (!success || data.status == "Error") {
      toast.error("Có lỗi xảy ra");
    } else {
      const result = data.data.map((e) => {
        return {
          value: e.id,
          label: e.name,
        };
      });
      setPayments(result);
    }
  };
  const fetchDelivery = async () => {
    const { success, data } = await getListDelivery(tableParams.pagination);
    if (!success || data.status == "Error") {
      toast.error("Có lỗi xảy ra");
    } else {
      setDelivery(data.data);
      const result = data.data.map((e) => {
        return {
          value: e.id,
          label: e.name,
        };
      });
      setOptionDelivery(result);
    }
  };
  const fetchGetCouponCode = async (code) => {
    const request = {
      code: code,
      sumPrice: totalPrice,
    };
    const { success, data } = await getCouponCode(request);
    if (!success || data.status == "Error") {
      toast.error("Có lỗi xảy ra");
    } else {
      setDiscount(data.data);
    }
  };
  const handleChange = (e) => {
    setCouponCode(e.target.value);
    fetchGetCouponCode(e.target.value);
  };
  const onFinish = () => {
    setModal2Open(false);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  function formatCurrencyVND(amount) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }
  const handlePaymentId = (e) => {
    setPaymentId(e);
    if (delivery && delivery.length > 0) {
      const deliveryModel = delivery.find((m) => m.id === e);
      setFeeDelivery(deliveryModel ? deliveryModel.fee : 0);
    }
  };
  const handleSelectDelivery = (e) => {
    setDeleveryId(e);
    if (delivery && delivery.length > 0) {
      const deliveryModel = delivery.find((m) => m.id === e);
      setFeeDelivery(deliveryModel ? deliveryModel.fee : 0);
    }
  };
  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "code",
      key: "images",
      render: (_, record) => (
        <img
          src={getMediaUrl(record.image?.imageUrl)}
          style={{ width: "65px", height: "auto", borderRadius: "10px" }}
        />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <a style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {text}
        </a>
      ),
    },
    {
      title: "Giá sản phẩm",
      dataIndex: "price",
      render: (text) => (
        <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {formatCurrencyVND(text)}
        </p>
      ),
    },
    {
      title: "Giá khuyến mại",
      dataIndex: "priceDiscount",
      render: (text) => (
        <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {formatCurrencyVND(text)}
        </p>
      ),
    },
  ];
  const onCreateOrder = async (values) => {
    try {
      debugger;
      var product = producs.map((e) => {
        return {
          productId: e.id,
          quantity: e.quantity,
          total: e.quantity * e.price,
          status: 1,
          price: e.price,
          originPrice: e.price,
        };
      });
      var objectModel = {
        userId: userInfo.id,
        price: totalPrice,
        paymentId: paymentId,
        feeDelivery: feeDelivery,
        deliveryType: deleveryId,
        description: null,
        status: deleveryId === 1 ? 8 : 4,
        stage: 1,
        type: 1,
        realPrice: totalPrice,
        addressId: userInfo.address && userInfo.address[0].id,
        orderDetailModels: product,
        couponCode: couponCode,
      };
      const { success, data } = await createOrder(objectModel);
      if (data.status != "Error" && success) {
        setModal2Open(false);
        callback(tabId);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

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
        {" "}
        Thanh toán
      </Button>

      <Modal
        width={"60%"}
        title="Thanh toán"
        centered
        visible={modal2Open}
        onCancel={() => setModal2Open(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{ layout: "horizontal" }}
          layout="vertical"
        >
          <Row gutter={[5, 5]}>
            <Col span={16}>
              <span
                class="hide-menu"
                style={{ fontSize: "13px", color: "black", fontWeight: "bold" }}
              >
                Thông tin khách hàng
              </span>
            </Col>
          </Row>
          <br />

          <Row gutter={[12, 12]}>
            <Col span={12}>
              <Form.Item label="Họ tên khách hàng" name="name">
                <Input placeholder="" type="text" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Số điện thoại" name="phone">
                <Input placeholder="" type="text" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Địa chỉ" name="address">
                <Input placeholder="" type="text" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Mã khuyến mại" name="couponCode">
                <Input placeholder="" type="text" onBlur={handleChange} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Hình thức thanh toán" name="paymentId">
                <Select
                  placeholder="Please select"
                  onChange={handlePaymentId}
                  style={{
                    width: "100%",
                  }}
                  options={payments}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Hình thức vận chuyện" name="deliveryId">
                <Select
                  placeholder="Please select"
                  onChange={(e) => handleSelectDelivery(e)}
                  style={{
                    width: "100%",
                  }}
                  options={optionDelivery}
                />
              </Form.Item>
            </Col>
          </Row>

          <br />
          <Row gutter={[5, 5]}>
            <Col span={16}>
              <span
                class="hide-menu"
                style={{ fontSize: "13px", color: "black", fontWeight: "bold" }}
              >
                Thông tin sản phẩm
              </span>
            </Col>
          </Row>
          <Table
            dataSource={producs}
            columns={columns}
            pagination={false}
            // loading={loading}
            onChange={null}
          />
          <br />
          <Row gutter={[5, 5]} style={{ textAlign: "left" }}>
            <Col span={20}>
              <span
                class="hide-menu"
                style={{ fontSize: "15px", color: "black", fontWeight: "500" }}
              >
                Tổng đơn hàng: {formatCurrencyVND(totalPrice)}
              </span>
            </Col>
            <Col span={20}>
              <span
                class="hide-menu"
                style={{ fontSize: "15x", color: "black", fontWeight: "500" }}
              >
                Phí vận chuyển: {formatCurrencyVND(feeDelivery)}
              </span>
            </Col>
            <Col span={20}>
              <span
                class="hide-menu"
                style={{ fontSize: "15px", color: "black", fontWeight: "500" }}
              >
                Chiết khấu: {formatCurrencyVND(discount)}
              </span>
            </Col>
            <Col span={5}>
              <Divider style={{ width: "50%" }} />
            </Col>
            <Col span={20}>
              <span
                class="hide-menu"
                style={{ fontSize: "15px", color: "black", fontWeight: "500" }}
              >
                Thành tiền:{" "}
                {formatCurrencyVND(totalPrice + feeDelivery - discount)}
              </span>
            </Col>
          </Row>
          <Row gutter={[5, 5]} style={{ textAlign: "right" }}>
            <Col span={24}>
              <PaymentType
                callback={onCreateOrder}
                amount={totalPrice + feeDelivery - discount}
                paymentId={paymentId}
                deliveryId={deleveryId}
              />
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default PaymentPage;
