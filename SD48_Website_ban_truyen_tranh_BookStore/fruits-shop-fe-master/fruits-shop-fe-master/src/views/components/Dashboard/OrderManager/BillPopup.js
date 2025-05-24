// BillPopUp.js
import { getMediaUrl } from "@constants/commonFunctions";
import { Layout, Table, Card, Divider, Button, Col, Modal, Row, Typography, Space } from "antd";
import dayjs from "dayjs";
import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { PrinterOutlined, UserOutlined, PhoneOutlined, ShopOutlined, MailOutlined, EnvironmentOutlined, CalendarOutlined, FileTextOutlined } from '@ant-design/icons';
import { toast } from "react-toastify";

const { Title, Text } = Typography;

const BillPopUp = ({ infoBill, openModal, closeModal, discount }) => {
  const refBill = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [renderTrigger, setRenderTrigger] = useState(0);

  const [staffToDisplay, setStaffToDisplay] = useState({
    name: "Nhân viên BookStore",
    phone: "Đang cập nhật"
  });

  useEffect(() => {
    if (openModal && infoBill) {
      if (infoBill.employeeName) {
        setStaffToDisplay({ name: infoBill.employeeName, phone: infoBill.employeePhoneNumber || "Đang cập nhật" });
      } else if (infoBill.staffUserModel && infoBill.staffUserModel.fullName) {
        setStaffToDisplay({ name: infoBill.staffUserModel.fullName, phone: infoBill.staffUserModel.phoneNumber || "Đang cập nhật" });
      } else {
        setStaffToDisplay({ name: "Nhân viên BookStore", phone: "Đang cập nhật" });
      }
      setRenderTrigger(prev => prev + 1);
    } else if (!openModal) {
      setIsReady(false);
      setStaffToDisplay({ name: "Nhân viên BookStore", phone: "Đang cập nhật" });
    }
  }, [infoBill, openModal]);

  useLayoutEffect(() => {
    if (openModal && infoBill && refBill.current && refBill.current.innerHTML.trim() !== '') {
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 150); 
      return () => clearTimeout(timer);
    } else {
      if (isReady) {
        // console.log("useLayoutEffect: Conditions NOT met or modal closed. Setting isReady to false.");
      }
      setIsReady(false);
    }
  }, [openModal, infoBill, renderTrigger, isReady]);


  const triggerPrint = useReactToPrint({
    contentRef: refBill, 
    documentTitle: `HoaDon_${infoBill?.code || 'Moi'}`,
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        setTimeout(() => { 
          resolve();
        }, 50);
      });
    },
    onBeforePrint: () => {
      return Promise.resolve(); 
    },
    onAfterPrint: () => {
      toast.success("Thao tác in/hủy thành công!");
    },
    onPrintError: (errorLocation, error) => {
      console.error(`Lỗi khi in (${errorLocation}):`, error, error.message);
      toast.error(`Lỗi khi in: ${error && error.message ? error.message : 'Lỗi không xác định'}`);
    },
    pageStyle: `
      @page { 
        size: A4 portrait; 
        margin: 10mm; /* Giảm margin cho vừa A4 hơn */
      } 
      @media print { 
        html, body { 
          height: initial !important; 
          overflow: initial !important; 
          -webkit-print-color-adjust: exact !important; 
          print-color-adjust: exact !important;
          background-color: #ffffff !important;
          font-family: 'Arial', sans-serif !important; /* Font chữ dễ đọc hơn */
          font-size: 10pt !important; /* Cỡ chữ cơ bản cho bản in */
        }
        .bill-print-area-wrapper { 
            visibility: visible !important; 
            position: static !important; 
            left: 0 !important;
            top: 0 !important;
        }
        .bill-print-content { 
          margin: 0 auto; /* Căn giữa nội dung bill */
          padding: 0;
          background-color: #ffffff !important;
          visibility: visible !important;
          display: block !important;
          width: 100% !important; /* Đảm bảo bill chiếm toàn bộ chiều rộng trang in */
        }
        .bill-print-content * {
          visibility: visible !important;
          box-shadow: none !important;
          border-color: #ccc !important; /* Màu border nhẹ nhàng hơn */
        }
        .bill-print-content .ant-card {
            border: none !important;
            box-shadow: none !important;
        }
        .bill-print-content .ant-card-body {
            padding: 0 !important;
        }
        .bill-print-content .ant-table-bordered .ant-table-container {
            border: 1px solid #e8e8e8 !important;
        }
        .bill-print-content .ant-table-thead > tr > th, 
        .bill-print-content .ant-table-tbody > tr > td,
        .bill-print-content .ant-table-summary > tr > td {
            padding: 6px 8px !important; /* Giảm padding cho table */
            font-size: 9pt !important;
        }
        .bill-print-content .ant-divider-horizontal {
            margin: 12px 0 !important; /* Giảm margin cho Divider */
        }
        .bill-print-content h1, .bill-print-content h2, .bill-print-content h3, .bill-print-content h4, .bill-print-content h5 {
            margin-bottom: 8px !important; /* Giảm margin cho tiêu đề */
            font-size: 11pt !important;
        }
        .bill-print-content .store-header-title {
            font-size: 14pt !important;
            font-weight: bold;
        }
         .bill-print-content .invoice-main-title {
            font-size: 16pt !important;
            font-weight: bold;
            margin-bottom: 5px !important;
        }
        .no-print-in-bill {
            display: none !important;
        }
      }
    `,
    preserveAfterPrint: false, // Tắt sau khi debug xong
  });

  const printBill = () => {
    if (!isReady) {
      toast.info("Hóa đơn đang được chuẩn bị, vui lòng đợi...");
      return;
    }
    
    if (!refBill.current || refBill.current.innerHTML.trim() === '') {
      toast.error("Không thể tải nội dung hóa đơn hoặc nội dung rỗng. Vui lòng thử lại.");
      return;
    }
    
    if (typeof triggerPrint === 'function') {
        try {
            triggerPrint(); 
        } catch (e) {
            console.error("Lỗi đồng bộ khi gọi hàm trigger in:", e);
            toast.error("Có lỗi xảy ra khi bắt đầu quá trình in.");
        }
    } else {
        console.error("printBill: Print trigger function (triggerPrint) is not a function!");
        toast.error("Lỗi chức năng in, vui lòng thử lại.");
    }
  };

  const columns = [
    { title: "STT", dataIndex: "index", key: "index", width: '5%', align: 'center', render: (_, record, index) => <Text style={{ fontSize: "12px" }}>{index + 1}</Text> },
    { title: "Tên sản phẩm", dataIndex: "name", key: "name", width: '35%', render: (text) => <Text style={{ fontSize: "12px" }}>{text}</Text> },
    { title: "Mã SP", dataIndex: "code", key: "code", width: '15%', render: (text) => <Text style={{ fontSize: "12px" }}>{text}</Text> },
    { title: "Đơn giá", dataIndex: "price", key: "price", width: '15%', align: 'right', render: (text) => <Text style={{ fontSize: "12px" }}>{formatCurrencyVND(text)}</Text> },
    { title: "SL", dataIndex: "quantity", key: "quantity", width: '10%', align: 'center', render: (text) => <Text style={{ fontSize: "12px" }}>{text}</Text> },
    { title: "Thành tiền", dataIndex: "subtotal", key: "subtotal", width: '20%', align: 'right', render: (_, record) => <Text style={{ fontSize: "12px", fontWeight: "bold" }}>{formatCurrencyVND(record.quantity * record.price)}</Text> },
  ];

  function formatCurrencyVND(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) return 'N/A';
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
  }

  const renderInfoItem = (icon, label, value, boldValue = false) => (
    <Row gutter={8} style={{ marginBottom: '5px' }} align="top">
      <Col style={{paddingTop: '2px'}}>{React.cloneElement(icon, { style: { fontSize: '14px', color: '#555' } })}</Col>
      <Col><Text style={{ fontSize: '12px', color: '#333' }}>{label}:</Text></Col>
      <Col flex="auto" style={{ textAlign: 'left' }}>
        <Text style={{ fontSize: '12px', color: '#000', fontWeight: boldValue ? '600' : 'normal' }}>{value || 'N/A'}</Text>
      </Col>
    </Row>
  );
  
  const actualBillToRender = () => {
    if (!infoBill) {
      return <div style={{padding: 20, textAlign: 'center'}}>Đang tải thông tin hóa đơn...</div>;
    }
    const totalAmountBeforeDiscount = infoBill?.orderDetailModels?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
    const finalDiscount = infoBill?.discount ?? discount ?? 0;
    const finalFeeDelivery = infoBill?.feeDelivery ?? 0;
    const finalPayment = totalAmountBeforeDiscount - finalDiscount + finalFeeDelivery;


    return (
      <div className="bill-print-content" style={{ padding: '20px', margin: '0 auto', width: '100%', backgroundColor: '#ffffff', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
        <Card variant="borderless" style={{ width: '100%'}}>
          <Row gutter={[16, 0]} align="middle" style={{ marginBottom: '15px' }}>
            <Col xs={24} sm={8} style={{ textAlign: 'center', marginBottom: '10px' }}>
              <ShopOutlined style={{ fontSize: '52px', color: '#007bff' }} />
              <Title level={4} className="store-header-title" style={{ color: '#007bff', marginTop: '5px', marginBottom: '0' }}>BOOK STORE</Title>
            </Col>
            <Col xs={24} sm={16} style={{ textAlign: 'center' }}>
              <Title level={3} className="invoice-main-title" style={{color: '#333'}}>HÓA ĐƠN BÁN HÀNG</Title>
              <div style={{fontSize: '12px', color: '#555'}}>
                <Text>Mã HĐ: <Text strong>{infoBill?.code || "Đang cập nhật"}</Text></Text><br />
                <Text>Ngày: {infoBill?.createdDate ? dayjs(infoBill.createdDate).format("DD/MM/YYYY HH:mm") : "Đang cập nhật"}</Text>
              </div>
            </Col>
          </Row>
          <Divider style={{ margin: '10px 0', borderTop: '1px solid #ddd' }} />

          <Row gutter={[24,10]} style={{ marginBottom: '15px', fontSize: '12px' }}>
            <Col xs={24} md={12}>
              <Title level={5} style={{ marginBottom: '8px', color: '#007bff' }}>Thông tin cửa hàng</Title>
              {renderInfoItem(<PhoneOutlined />, "Điện thoại", "0963543955")}
              {renderInfoItem(<MailOutlined />, "Email", "huydhph45901@fpt.edu.vn")}
              {renderInfoItem(<EnvironmentOutlined />, "Địa chỉ", "123 Cầu Giấy, quận Cầu Giấy, Hà Nội")}
            </Col>
            <Col xs={24} md={12}>
              <Title level={5} style={{ marginBottom: '8px', color: '#007bff' }}>Nhân viên bán hàng</Title>
              {renderInfoItem(<UserOutlined />, "Họ tên", staffToDisplay.name)}
              {renderInfoItem(<PhoneOutlined />, "SĐT", staffToDisplay.phone)}
            </Col>
          </Row>
          <Divider style={{ margin: '10px 0', borderTop: '1px solid #ddd' }} />

          <Title level={5} style={{ marginBottom: '8px', color: '#007bff' }}>Thông tin khách hàng</Title>
          <Row gutter={[16, 0]} style={{fontSize: '12px'}}>
            <Col xs={24} sm={12}>
              {renderInfoItem(<FileTextOutlined />, "Mã KH", infoBill?.userModel?.code, true)}
              {renderInfoItem(<UserOutlined />, "Họ tên", infoBill?.userModel?.fullName, true)}
            </Col>
            <Col xs={24} sm={12}>
              {renderInfoItem(<PhoneOutlined />, "Điện thoại", infoBill?.userModel?.phoneNumber)}
              {renderInfoItem(<MailOutlined />, "Email", infoBill?.userModel?.email)}
            </Col>
            <Col span={24}>
             {renderInfoItem(<EnvironmentOutlined />, "Địa chỉ", infoBill?.addressModel?.fullInfo || infoBill?.userModel?.address?.[0]?.fullInfo)}
            </Col>
          </Row>

          <Divider style={{ margin: '15px 0', borderTop: '1px solid #ddd' }} />

          <Title level={5} style={{ marginBottom: '10px', textAlign: 'center', color: '#333' }}>Chi tiết sản phẩm</Title>
          <Table
            dataSource={infoBill?.orderDetailModels || []}
            columns={columns}
            pagination={false}
            bordered
            size="small"
            rowKey={(record) => record.id || record.productId || `product-${record.code}-${Math.random()}`}
            summary={() => {
              return (
                <Table.Summary.Row style={{ backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>
                  <Table.Summary.Cell index={0} colSpan={4} align="right"><Text strong style={{fontSize: '12px'}}>Tổng cộng</Text></Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align="center"><Text strong style={{fontSize: '12px'}}>{totalAmountBeforeDiscount > 0 ? infoBill?.orderDetailModels?.reduce((sum, item) => sum + item.quantity, 0) : 0}</Text></Table.Summary.Cell>
                  <Table.Summary.Cell index={2} align="right"><Text strong style={{fontSize: '12px'}}>{formatCurrencyVND(totalAmountBeforeDiscount)}</Text></Table.Summary.Cell>
                </Table.Summary.Row>
              );
            }}
          />

          <Row justify="end" style={{ marginTop: '20px' }}>
            <Col xs={24} sm={14} md={12} lg={10} style={{fontSize: '12px'}}>
              <Space direction="vertical" style={{ width: '100%' }} size={2}>
                <Row justify="space-between">
                  <Text>Tổng tiền hàng:</Text>
                  <Text strong>{formatCurrencyVND(totalAmountBeforeDiscount)}</Text>
                </Row>
                {infoBill?.couponModel?.code && (
                  <Row justify="space-between">
                    <Text>Giảm giá ({infoBill.couponModel.code}):</Text>
                    <Text strong style={{ color: 'red' }}>-{formatCurrencyVND(finalDiscount)}</Text>
                  </Row>
                )}
             {finalFeeDelivery > 0 && ( // <<<< SỬA ĐIỀU KIỆN Ở ĐÂY
                    <Row justify="space-between">
                        <Text>Phí vận chuyển:</Text>
                        <Text strong>{formatCurrencyVND(finalFeeDelivery)}</Text>
                    </Row>
                 )}

                <Divider style={{ margin: '6px 0' }}/>
                <Row justify="space-between" align="middle">
                  <Text strong style={{ fontSize: '14px' }}>Tổng thanh toán:</Text>
                  <Text strong style={{ fontSize: '16px', color: '#007bff' }}>
                    {formatCurrencyVND(finalPayment)} 
                    {/* finalPayment đã bao gồm finalFeeDelivery trong tính toán của bạn rồi:
                        const finalPayment = totalAmountBeforeDiscount - finalDiscount + finalFeeDelivery;
                        Nên không cần cộng lại ở đây.
                    */}
                  </Text>
                </Row>
              </Space>
            </Col>
          </Row>

          <Row justify="space-around" style={{ marginTop: '30px', paddingTop: '15px', borderTop: '1px dashed #ccc', fontSize: '12px' }}>
            <Col span={10} style={{ textAlign: 'center' }}>
              <Text strong>Khách hàng</Text><br/>
              <Text type="secondary" style={{fontSize: '11px'}}>(Ký, ghi rõ họ tên)</Text>
              <div style={{height: '40px'}}></div>
            </Col>
            <Col span={10} style={{ textAlign: 'center' }}>
              <Text strong>Người bán hàng</Text><br/>
              <Text type="secondary" style={{fontSize: '11px'}}>(Ký, ghi rõ họ tên)</Text>
              <div style={{height: '40px'}}></div>
            </Col>
          </Row>
          <Typography.Paragraph style={{ textAlign: 'center', marginTop: '20px', fontSize: '11px', fontStyle: 'italic', color: '#555' }}>
            Cảm ơn quý khách đã tin tưởng và mua hàng tại BOOK STORE! Rất hân hạnh được phục vụ quý khách!
          </Typography.Paragraph>
        </Card>
      </div>
    );
  };
  
  return (
    <Modal
      width="95vw" 
      style={{ top: 20, maxWidth: '840px' }} // Tăng chiều rộng modal một chút
      styles={{ body: { padding: 0, backgroundColor: '#f0f2f5' } }}
      centered={false} 
      open={openModal}
      onCancel={closeModal}
      footer={[
        <Button key="back" onClick={closeModal}>Đóng</Button>,
        <Button 
          key="print" 
          type="primary" 
          icon={<PrinterOutlined />} 
          onClick={printBill}
          disabled={!isReady}
          loading={!isReady && openModal && infoBill} // Hiển thị loading khi đang chuẩn bị
        >
          {isReady ? "In hóa đơn" : "Đang chuẩn bị..."}
        </Button>,
      ]}
      title={<Title level={4} style={{ textAlign: 'center', color: '#007bff', marginBottom: 0, padding: '16px 24px', borderBottom: '1px solid #e8e8e8', backgroundColor: '#fff' }}>CHI TIẾT HÓA ĐƠN</Title>}
      destroyOnClose 
    >
      <div className="bill-print-area-wrapper" style={{ position: 'absolute', left: '-9999px', top: '-9999px', visibility: 'hidden', width: '210mm' }} aria-hidden="true">
        <div ref={refBill} key={renderTrigger}>
          {openModal && infoBill && actualBillToRender()}
        </div>
      </div>
      
      <div style={{maxHeight: 'calc(100vh - 150px)', overflowY: 'auto', padding: '16px', backgroundColor: '#f0f2f5'}}>
        {openModal && infoBill ? actualBillToRender() : <div style={{textAlign: 'center', padding: '50px'}}>Đang tải thông tin hóa đơn...</div>}
      </div>
    </Modal>
  );
};

export default BillPopUp;