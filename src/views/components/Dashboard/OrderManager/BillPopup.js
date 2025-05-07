import { getMediaUrl } from "@constants/commonFunctions";
import { Layout, Table } from "antd";
import { Card } from "antd";
import { Divider } from "antd";
import { Form } from "antd";
import { Button, Col, Modal, Row, Typography } from "antd";
import dayjs from "dayjs";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const BillPopUp = ({ infoBill, openModal, closeModal }) => {
  const refBill = useRef(null);

  const reactToPrintFn = useReactToPrint({ contentRef: refBill });

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_, record, index) => (
        <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {index + 1}
        </p>
      ),
    },
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
      title: "Mã sản phẩm",
      dataIndex: "code",
      key: "code",
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
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 150,
      render: (text) => (
        <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {text}
        </p>
      ),
    },
    {
      title: "Thành tiền",
      dataIndex: "price",
      render: (text, record) => (
        <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {formatCurrencyVND(record.quantity * text)}
        </p>
      ),
    },
  ];

  function formatCurrencyVND(amount) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }

  return (
    <Modal
      width={1000}
      centered
      visible={openModal}
      onCancel={closeModal}
      footer={null}
    >
      <div
        ref={refBill}
        style={{ width: "100%", maxHeight: "80vh", overflowY: "auto" }}
      >
        <Layout className="min-h-screen bg-gray-100">
          <Content className="p-6">
            <Card className="w-full max-w-4xl mx-auto bg-white shadow">
              <Row className="mb-4" gutter={24}>
                <Col span={24} className="mb-2">
                  <Title level={4} className="text-blue-700 text-center">
                    BOOK STORE
                  </Title>
                  <Typography level={5} className="text-blue-700 text-center">
                    Số điện thoại: 0963543955
                  </Typography>
                  <Typography level={5} className="text-blue-700 text-center">
                    Email: vanthanh26122@gmail.com
                  </Typography>
                  <Typography level={5} className="text-blue-700 text-center">
                    Địa chỉ: 123 Cầu Giấy, quận Cầu Giấy, Hà Nội
                  </Typography>
                </Col>
                <Col span={24}>
                  <Title level={4} className="text-blue-700 text-center">
                    HÓA ĐƠN BÁN HÀNG
                  </Title>
                </Col>
              </Row>

              <Divider />

              <Row
                gutter={[25, 25]}
                style={{ justifyContent: "space-between" }}
              >
                <Col span={12}>
                  <Row gutter={[16, 16]}>
                    <Col span={24}>
                      <Row>
                        <Col span={12}>
                          <p style={{ fontWeight: "bold" }}>
                            Họ tên khách hàng:{" "}
                          </p>
                        </Col>
                        <Col span={12} style={{ textAlign: "left" }}>
                          <p style={{ fontWeight: "500" }}>
                            {infoBill.userModel?.fullName}
                          </p>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <p style={{ fontWeight: "bold" }}>Số điện thoại: </p>
                        </Col>
                        <Col span={12} style={{ textAlign: "left" }}>
                          <p style={{ fontWeight: "500" }}>
                            {infoBill.userModel?.phoneNumber}
                          </p>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <p style={{ fontWeight: "bold" }}>Email: </p>
                        </Col>
                        <Col span={12} style={{ textAlign: "left" }}>
                          <p style={{ fontWeight: "500" }}>
                            {infoBill.userModel?.email}
                          </p>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <p style={{ fontWeight: "bold" }}>Địa chỉ: </p>
                        </Col>
                        <Col span={12} style={{ textAlign: "left" }}>
                          <p style={{ fontWeight: "500" }}>
                            {infoBill?.addressDetail}
                          </p>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
                <Col span={12} className="text-right">
                  <Row>
                    <Col span={12}>
                      <p style={{ fontWeight: "bold" }}>Mã hóa đơn: </p>
                    </Col>
                    <Col span={12} style={{ textAlign: "right" }}>
                      <p style={{ fontWeight: "500" }}>
                        {infoBill?.orderId || "ODR2xx"}
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <p style={{ fontWeight: "bold" }}>Ngày tạo: </p>
                    </Col>
                    <Col span={12} style={{ textAlign: "right" }}>
                      <p style={{ fontWeight: "500" }}>
                        {dayjs().format("DD/MM/YYYY HH:mm")}
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <p style={{ fontWeight: "bold" }}>Trạng thái: </p>
                    </Col>
                    <Col span={12} style={{ textAlign: "right" }}>
                      <p style={{ fontWeight: "500" }}>
                        {infoBill?.isDeliver === "NO"
                          ? "Hoàn thành"
                          : "Đã xác nhận"}
                      </p>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Divider />

              <Title level={4} className="text-blue-700 text-center">
                Danh sách sản phẩm
              </Title>

              <div className="mb-4">
                <Table
                  dataSource={infoBill.products}
                  columns={columns}
                  pagination={false}
                  loading={false}
                  onChange={null}
                />
              </div>
              <Row>
                <Col span={24}>
                  <Col span={24}>
                    <span
                      className="hide-menu"
                      style={{
                        fontSize: "13px",
                        color: "black",
                        fontWeight: "bold",
                      }}
                    >
                      Phiếu giảm giá
                    </span>

                    <p style={{ fontWeight: "500", marginBottom: 0 }}>
                      {infoBill && infoBill.couponModel?.code}
                    </p>
                  </Col>
                  <Col span={24}>
                    <Row align={"middle"} gutter={[16, 16]}>
                      <Col span={6}>
                        <p style={{ fontWeight: "500", marginBottom: 0 }}>
                          Tổng tiền hàng:
                        </p>
                      </Col>
                      <Col span={18} style={{ textAlign: "right" }}>
                        <p style={{ fontWeight: "700", marginBottom: 0 }}>
                          {formatCurrencyVND(
                            infoBill && infoBill.totalPrice
                              ? infoBill.totalPrice
                              : 0
                          )}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row align={"middle"} gutter={[16, 16]}>
                      <Col span={6}>
                        <p style={{ fontWeight: "500", marginBottom: 0 }}>
                          Giảm giá:
                        </p>
                      </Col>
                      <Col span={18} style={{ textAlign: "right" }}>
                        <p style={{ fontWeight: "700", marginBottom: 0 }}>
                          {formatCurrencyVND(
                            infoBill && infoBill.discount
                              ? infoBill.discount
                              : 0
                          )}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row align={"middle"} gutter={[16, 16]}>
                      <Col span={6}>
                        <p style={{ fontWeight: "500", marginBottom: 0 }}>
                          Phí vận chuyển:
                        </p>
                      </Col>
                      <Col span={18} style={{ textAlign: "right" }}>
                        <p style={{ fontWeight: "700", marginBottom: 0 }}>
                          {formatCurrencyVND(
                            infoBill && infoBill.feeDelivery
                              ? infoBill.feeDelivery
                              : 0
                          )}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row align={"middle"} gutter={[16, 16]}>
                      <Col span={6}>
                        <p
                          style={{
                            fontWeight: "500",
                            marginBottom: 0,
                            fontSize: 20,
                          }}
                        >
                          Tổng tiền:
                        </p>
                      </Col>
                      <Col span={18} style={{ textAlign: "right" }}>
                        <p
                          style={{
                            fontWeight: "700",
                            marginBottom: 0,
                            fontSize: 20,
                          }}
                        >
                          {formatCurrencyVND(
                            infoBill.totalPrice +
                              (infoBill.feeDelivery || 0) -
                              (infoBill.discount || 0)
                          )}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                </Col>
              </Row>
            </Card>
          </Content>

          <Footer className="text-center">
            Hệ thống quản lý hóa đơn bán hàng © {new Date().getFullYear()}
          </Footer>
        </Layout>
      </div>
      <Button
        type="button"
        value="small"
        style={{
          alignItems: "center",
          background: "#2596be",
          marginTop: "20px",
          color: "white",
        }}
        onClick={() => reactToPrintFn()}
      >
        In hóa đơn
      </Button>
    </Modal>
  );
};

export default BillPopUp;
