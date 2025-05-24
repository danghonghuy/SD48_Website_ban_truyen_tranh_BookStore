import React, { useState } from "react";
import { Button, Col, Image, Input, Modal, Row } from "antd";
import { toast } from "react-toastify";

function formatCurrencyVND(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

const PaymentType = ({
  callback,
  amount,
  deliveryId,
  paymentId,
  products,
  tabIds,
  phoneNumber,
  email,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [number, setNumber] = useState(0);

  // Function to show the modal
  const showModal = () => {
    if (phoneNumber && phoneNumber.match(/^[0-9]{10}$/) === null) {
      toast.error("Số điện thoại không hợp lệ");
      return;
    }
    if (
      email &&
      email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) === null
    ) {
      toast.error("Email không hợp lệ");
      return;
    }
    if (!paymentId) {
      toast.error("Vui lòng chọn phương thức thanh toán");
      return;
    }
    setIsModalVisible(true);
  };

  // Function to handle closing the modal
  const handleOk = () => {
    if (paymentId && paymentId === 1 && number < amount) {
      toast.error(
        "Số tiền khách đưa không được nhỏ hơn số tiền cần phải thanh toán"
      );
      return;
    }
    callback(products, tabIds);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Button
        type="button"
        value="small"
        style={{
          alignItems: "center",
          background: "#2596be",
          marginBottom: "20px",
          color: "white",
        }}
        onClick={showModal}
      >
        Thanh toán
      </Button>

      <Modal
        title="Payment"
        visible={isModalVisible}
        onOk={handleOk} // Button to confirm payment
        onCancel={handleCancel} // Button to close the modal
      >
        {paymentId && paymentId === 1 && (
          <>
            <p>Số tiền cần phải thanh toán: </p>
            <h2>{formatCurrencyVND(amount)}</h2>
            <br />
            <Row align={"middle"}>
              <Col span={12}>
                <p style={{ fontWeight: "500", marginBottom: 0 }}>
                  Số tiền khách đưa:{" "}
                </p>
              </Col>
              <Col span={12}>
                <Input
                  placeholder=""
                  type="number"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                />
              </Col>
            </Row>
          </>
        )}

        {paymentId && paymentId !== 1 && (
          <>
            <p>
              Quét QR Code để thanh toán: <h2>{formatCurrencyVND(amount)}</h2>
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "50vh", // Makes the parent container full height
                textAlign: "center", // Ensures text is also centered
              }}
            >
              <Image
                width={350} // Set the width of the image
                src="https://hexdocs.pm/qr_code/docs/qrcode.svg" // Image source (URL)
                alt="Example Image" // Alt text for the image
                preview={true} // Enable the lightbox preview feature
              />
            </div>
          </>
        )}
        {/* {deliveryId && deliveryId !== 1 && <>
                    <p>Xác nhận đơn hàng giao cho đơn vị vận chuyển: </p>
                    <h2>Giá trị: {formatCurrencyVND(amount)}</h2>
                </>
                } */}
      </Modal>
    </div>
  );
};

export default PaymentType;
