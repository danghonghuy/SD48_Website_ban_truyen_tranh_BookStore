import React, { useEffect, useState } from "react";
import { Button, Select, Table, Col, Form, Input, Row, InputNumber, Upload, Typography, Pagination, Tooltip, Space, Modal, Tag } from "antd";
import { UploadOutlined, DownloadOutlined, ReloadOutlined, SearchOutlined, PlusOutlined } from "@ant-design/icons";
import useProduct from "@api/useProduct";
import { toast } from "react-toastify";
import AddProduct from "./AddProduct";
import useCategory from "@api/useCategory";
import useType from "@api/useType";
import CommonPopup from "./../Common/CommonPopup";
import { getMediaUrl } from "@constants/commonFunctions";
import useUser from "@store/useUser";
import ImageWithFallback from "./ImageWithFallback";

const { Option } = Select;
const { Title, Text } = Typography;

function ProductManager() {
  function formatCurrencyVND(amount) {
    if (amount === null || amount === undefined) return "";
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
  }

  const { getList, changeStatus, uploadExcelProduct, exportExcelProduct } = useProduct();
  const { getListType } = useType();
  const { getListCategory } = useCategory();
  const { roleCode } = useUser();

  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [total, setTotal] = useState(0);
  const [tableParams, setTableParams] = useState({
    pagination: { pageIndex: 1, pageSize: 10, status: null, categoryId: null, typeId: null, keySearch: "", minPrice: null, maxPrice: null },
  });
  const [category, setCategory] = useState([]);
  const [types, setType] = useState([]);
  const [idChangeStatus, setIdChangeStatus] = useState();
  const [statusPopup, setStatusPopupChange] = useState();
  const [isModalChangeStatusVisible, setIsModalChangeStatusVisible] = useState(false);
  const [isImportResultModalVisible, setIsImportResultModalVisible] = useState(false);
  const [importResult, setImportResult] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getList(tableParams.pagination);
      if (response && response.success && response.data && response.data.data !== undefined) {
        setProduct(response.data.data);
        setTotal(response.data.totalCount || 0);
      } else {
        if (response && response.data && response.data.status === "Error") {
          toast.error(response.data.message || "Có lỗi khi tải danh sách sản phẩm.");
        } else {
          toast.error("Dữ liệu trả về không hợp lệ hoặc có lỗi khi tải danh sách sản phẩm.");
        }
        setProduct([]);
        setTotal(0);
      }
    } catch (error) {
      setProduct([]);
      setTotal(0);
      toast.error("Lỗi kết nối hoặc lỗi không xác định khi tải danh sách.");
    }
    setLoading(false);
  };

  const fetchCategoryData = async () => {
    try {
      const response = await getListCategory({ pageIndex: 1, pageSize: 50 });
      if (response && response.success && response.data && response.data.data) {
        setCategory(response.data.data.map((item) => ({ value: item.id, label: item.name })));
      }
    } catch (error) { toast.error("Lỗi khi tải danh sách loại sản phẩm."); }
  };

  const fetchTypeData = async () => {
    try {
      const response = await getListType({ pageIndex: 1, pageSize: 50 });
      if (response && response.success && response.data && response.data.data) {
        setType(response.data.data.map((item) => ({ value: item.id, label: item.name })));
      }
    } catch (error) { toast.error("Lỗi khi tải danh sách gói sản phẩm."); }
  };

  useEffect(() => { fetchData(); }, [JSON.stringify(tableParams.pagination)]);
  useEffect(() => { fetchCategoryData(); fetchTypeData(); }, []);

  const handleTableChange = (pagination) => {
    setTableParams((prev) => ({ ...prev, pagination: { ...prev.pagination, pageIndex: pagination.current, pageSize: pagination.pageSize } }));
  };

  const onShowSizeChange = (current, pageSize) => {
    setTableParams((prev) => ({ ...prev, pagination: { ...prev.pagination, pageIndex: 1, pageSize } }));
  };

  const handleChangeStatus = async (id, newStatus) => {
    setLoading(true);
    const response = await changeStatus(id, newStatus);
    if (response && response.success) {
      toast.success("Cập nhật trạng thái thành công!");
      fetchData();
    } else {
      toast.error(response?.data?.message || "Có lỗi xảy ra khi cập nhật trạng thái.");
    }
    setLoading(false);
  };

  const handleOkChangeStatus = () => { handleChangeStatus(idChangeStatus, statusPopup); setIsModalChangeStatusVisible(false); };
  const handleCancelChangeStatus = () => { setIsModalChangeStatusVisible(false); };
  const showModalChangeStatus = (id, currentStatus) => { setIdChangeStatus(id); setStatusPopupChange(currentStatus); setIsModalChangeStatusVisible(true); };

  const columns = [
    { title: "STT", key: "stt", width: 60, align: "center", render: (_, __, index) => (<span>{index + 1 + (tableParams.pagination.pageIndex - 1) * tableParams.pagination.pageSize}</span>) },
    { title: "Hình ảnh", dataIndex: "images", key: "images", width: 90, align: "center", render: (_, record) => {
        const imageUrl = Array.isArray(record.images) && record.images.length > 0 ? getMediaUrl(record.images[0]?.imageUrl) : null;
        return (<ImageWithFallback src={imageUrl} alt={record.name || "Ảnh sản phẩm"} style={{ width: "64px", height: "64px", borderRadius: "10px", objectFit: "cover", border: "1px solid #eee" }} />);
    }},
    { title: "Mã sản phẩm", dataIndex: "code", key: "code", width: 120, render: (text) => (<Text style={{ fontSize: 13, color: "#0056b3", fontWeight: 500 }}>{text}</Text>) },
    { title: "Tên sản phẩm", dataIndex: "name", key: "name", width: 200, ellipsis: true, render: (text) => (<Tooltip title={text}><Text style={{ fontSize: 13 }}>{text}</Text></Tooltip>) },
    { title: "Tác giả", dataIndex: "authors", key: "authors", width: 150, ellipsis: true, render: (authors) => {
        const authorNames = Array.isArray(authors) && authors.length > 0 ? authors.map((author) => author.name).join(", ") : "N/A";
        return (<Tooltip title={authorNames}><Text style={{ fontSize: 13 }}>{authorNames}</Text></Tooltip>);
    }},
    { title: "Nhà XB", dataIndex: "publisherInfo", key: "publisherInfo", width: 150, ellipsis: true, render: (publisherInfo) => {
        const publisherName = publisherInfo && publisherInfo.name ? publisherInfo.name : "N/A";
        return (<Tooltip title={publisherName}><Text style={{ fontSize: 13 }}>{publisherName}</Text></Tooltip>);
    }},
    { title: "Nhà PH", dataIndex: "distributorInfo", key: "distributorInfo", width: 150, ellipsis: true, render: (distributorInfo) => {
        const distributorName = distributorInfo && distributorInfo.name ? distributorInfo.name : "N/A";
        return (<Tooltip title={distributorName}><Text style={{ fontSize: 13 }}>{distributorName}</Text></Tooltip>);
    }},
    { title: "Giá sản phẩm", dataIndex: "price", key: "price", width: 150, align: "right", render: (text, record) => {
        const hasDiscount = (record.discountDTO?.moneyDiscount && record.discountDTO.moneyDiscount > 0) || (record.discountDTO?.percent && record.discountDTO.percent > 0);
        let finalPrice = record.price;
        if (hasDiscount) {
          if (record.discountDTO?.percent) finalPrice = record.price - (record.price * record.discountDTO.percent) / 100;
          else if (record.discountDTO?.moneyDiscount) finalPrice = record.price - record.discountDTO.moneyDiscount;
        }
        return (<span style={{ fontSize: 13 }}>{hasDiscount ? (<><Text delete type="secondary" style={{ marginRight: 8 }}>{formatCurrencyVND(record.price)}</Text><br /><Text style={{ color: "#e74421", fontWeight: "bold" }}>{formatCurrencyVND(finalPrice)}</Text></>) : (<Text>{formatCurrencyVND(record.price)}</Text>)}</span>);
    }},
    { title: "Số lượng", dataIndex: "stock", key: "stock", width: 90, align: "center", render: (text) => <Text style={{ fontSize: 13 }}>{text}</Text> },
    { title: "Thể loại", dataIndex: "categoryName", key: "categoryName", width: 130, ellipsis: true, render: (text) => (<Tooltip title={text}><Text style={{ fontSize: 13 }}>{text}</Text></Tooltip>) },
    { title: "Gói", dataIndex: "typeName", key: "typeName", width: 110, ellipsis: true, render: (text) => (<Tooltip title={text}><Text style={{ fontSize: 13 }}>{text}</Text></Tooltip>) },
    { title: "Trạng thái", dataIndex: "status", key: "status", width: 120, align: "center", render: (status) => status === 1 ? (<Tag color="green">Hoạt động</Tag>) : (<Tag color="red">Không hoạt động</Tag>) },
    { title: "Thao tác", key: "action", width: 180, align: "center", fixed: "right", render: (_, record) => roleCode === "ADMIN" && (
        <Space>
          <Tooltip title="Sửa thông tin"><AddProduct fetchData={fetchData} modelItem={record} textButton="Sửa" isStyle={true} /></Tooltip>
          {record.status === 1 ? (
            <Tooltip title="Khoá sản phẩm"><Button type="primary" danger size="small" onClick={() => showModalChangeStatus(record.id, 0)}>Khoá</Button></Tooltip>
          ) : (
            <Tooltip title="Mở khoá sản phẩm"><Button size="small" style={{ background: "#52c41a", borderColor: "#52c41a", color: "#fff" }} onClick={() => showModalChangeStatus(record.id, 1)}>Mở khoá</Button></Tooltip>
          )}
        </Space>
    )},
  ];

  const handleSelectCategory = (value) => setTableParams((prev) => ({ ...prev, pagination: { ...prev.pagination, pageIndex: 1, categoryId: value } }));
  const handleSeletecType = (value) => setTableParams((prev) => ({ ...prev, pagination: { ...prev.pagination, pageIndex: 1, typeId: value } }));
  const handleSelectStatus = (value) => setTableParams((prev) => ({ ...prev, pagination: { ...prev.pagination, pageIndex: 1, status: value } }));
  const handleKeySearch = (e) => setTableParams((prev) => ({ ...prev, pagination: { ...prev.pagination, pageIndex: 1, keySearch: e.target.value } }));
  const onSearchMinValue = (value) => setTableParams((prev) => ({ ...prev, pagination: { ...prev.pagination, pageIndex: 1, minPrice: value } }));
  const onSearchMaxValue = (value) => setTableParams((prev) => ({ ...prev, pagination: { ...prev.pagination, pageIndex: 1, maxPrice: value } }));

  const handleShowImportResultModal = (result) => { setImportResult(result); setIsImportResultModalVisible(true); };
  const handleCloseImportResultModal = () => { setIsImportResultModalVisible(false); setImportResult(null); };

  const errorTableColumns = [
    { title: "Dòng số (Excel)", dataIndex: "rowNumber", key: "rowNumber", width: 120, align: "center" },
    { title: "Mã SP (Trong Excel)", dataIndex: "productCodeAttempted", key: "productCodeAttempted", width: 150, render: (text) => text || <Text type="secondary">(Không có)</Text> },
    { title: "Tên sản phẩm (Dự kiến)", dataIndex: "productNameAttempted", key: "productNameAttempted", render: (text) => text || <Text type="secondary">(Không có)</Text> },
    { title: "Lỗi chi tiết và Gợi ý", dataIndex: "errorMessages", key: "errorMessages", render: (messages) => Array.isArray(messages) && messages.length > 0 ? (<ul style={{ paddingLeft: 0, listStyleType: "none", margin: 0 }}>{messages.map((msg, index) => (<li key={index}><Text type="danger">- {msg}</Text></li>))}</ul>) : (<Text type="secondary">(Không có thông tin lỗi)</Text>) },
  ];

  const handleUploadExcel = ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    uploadExcelProduct(formData)
      .then((response) => {
        setLoading(false);
        if (response && response.success && response.data) {
          const resultData = response.data;
          if (resultData.successfullyImportedCount > 0 && resultData.failedImportCount === 0) {
            toast.success(`Nhập Excel thành công! Đã nhập ${resultData.successfullyImportedCount} sản phẩm.`);
          } else if (resultData.successfullyImportedCount > 0 && resultData.failedImportCount > 0) {
            toast.warn(`Nhập Excel hoàn tất. Thành công: ${resultData.successfullyImportedCount}, Thất bại: ${resultData.failedImportCount}. Xem chi tiết lỗi.`);
          } else if (resultData.successfullyImportedCount === 0 && resultData.failedImportCount > 0) {
            toast.error(`Nhập Excel thất bại. Tất cả ${resultData.failedImportCount} sản phẩm đều có lỗi. Xem chi tiết lỗi.`);
          } else {
            if (resultData.totalRowsProcessed === 0 && resultData.errors && resultData.errors.length > 0 && resultData.errors[0].errorMessages) {
              toast.error(`Nhập Excel thất bại: ${resultData.errors[0].errorMessages.join(", ")}`);
            } else {
              toast.info("Không có dữ liệu sản phẩm nào được xử lý từ file Excel hoặc file rỗng.");
            }
          }
          if (resultData && (resultData.totalRowsProcessed > 0 || (resultData.errors && resultData.errors.length > 0))) {
            handleShowImportResultModal(resultData);
          }
          fetchData();
          if (onSuccess) onSuccess("Ok", file);
        } else {
          const errorMessage = response?.data?.message || response?.data?.error || "Nhập file Excel thất bại do lỗi không xác định từ máy chủ.";
          toast.error(errorMessage);
          handleShowImportResultModal({ totalRowsProcessed: 0, successfullyImportedCount: 0, failedImportCount: 0, errors: [{ rowNumber: 0, productNameAttempted: file.name, productCodeAttempted: "N/A", errorMessages: [errorMessage] }] });
          if (onError) onError(new Error(errorMessage));
        }
      })
      .catch((error) => {
        setLoading(false);
        const errorMessage = error?.message || "Đã xảy ra lỗi kết nối hoặc lỗi không xác định khi nhập Excel.";
        toast.error(errorMessage);
        handleShowImportResultModal({ totalRowsProcessed: 0, successfullyImportedCount: 0, failedImportCount: 0, errors: [{ rowNumber: 0, productNameAttempted: file.name, productCodeAttempted: "N/A", errorMessages: [errorMessage] }] });
        if (onError) onError(error);
      });
  };

  const handleExportExcel = async () => {
    setLoading(true);
    try {
      const response = await exportExcelProduct(tableParams.pagination);
      if (response && response.data && response.status >= 200 && response.status < 300) {
        const blob = new Blob([response.data], { type: response.headers["content-type"] || "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        let filename = "Danh_sach_san_pham.xlsx";
        const contentDisposition = response.headers["content-disposition"];
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
          if (filenameMatch && filenameMatch.length > 1) {
            filename = decodeURIComponent(filenameMatch[1].replace(/\+/g, " "));
          }
        }
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success(`Đang tải xuống ${filename}...`);
      } else {
        const errorMessage = response?.data?.message || "Xuất file thất bại: Phản hồi từ máy chủ không hợp lệ.";
        toast.error(errorMessage);
      }
    } catch (error) {
      let message = "Xuất file thất bại!";
      if (error.response && error.response.data) {
        if (error.response.data instanceof Blob && error.response.data.type && error.response.data.type.includes("application/json")) {
          try {
            const errorJsonText = await error.response.data.text();
            const errorJson = JSON.parse(errorJsonText);
            message = errorJson.message || errorJson.error || "Lỗi không xác định từ máy chủ.";
          } catch (e) { message = "Không thể đọc thông báo lỗi từ máy chủ."; }
        } else if (typeof error.response.data === "object" && error.response.data.message) {
          message = error.response.data.message;
        } else if (typeof error.response.data === "string") {
          message = error.response.data;
        } else if (error.message) { message = error.message; }
      } else if (error.message) { message = error.message; }
      toast.error(message);
    } finally { setLoading(false); }
  };

  const handleResetFilter = () => {
    setTableParams((prev) => ({ ...prev, pagination: { pageIndex: 1, pageSize: 10, status: null, categoryId: null, typeId: null, keySearch: "", minPrice: null, maxPrice: null } }));
    form.resetFields();
  };

  return (
    <>
      <CommonPopup visible={isModalChangeStatusVisible} title="Xác nhận" content={<p>Bạn chắc chắn cập nhật trạng thái bản ghi này?</p>} onClose={handleCancelChangeStatus} onOk={handleOkChangeStatus} />
      {importResult && (
        <Modal title={<Title level={4} style={{ color: "#1890ff", marginBottom: 0 }}>Kết quả Nhập Excel</Title>} open={isImportResultModalVisible} onOk={handleCloseImportResultModal} onCancel={handleCloseImportResultModal} width={1000} footer={[<Button key="close" type="primary" onClick={handleCloseImportResultModal}>Đóng</Button>]} destroyOnClose>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Text>Tổng số dòng dữ liệu đã xử lý: <Text strong>{importResult.totalRowsProcessed}</Text></Text>
            <Text type="success">Số sản phẩm nhập thành công: <Text strong style={{ color: "green" }}>{importResult.successfullyImportedCount}</Text></Text>
            <Text type="danger">Số sản phẩm nhập thất bại: <Text strong style={{ color: "red" }}>{importResult.failedImportCount}</Text></Text>
            {importResult.errors && importResult.errors.length > 0 && (
              <><Title level={5} style={{ marginTop: 16 }}>Chi tiết các dòng lỗi:</Title>
              <Table dataSource={importResult.errors} columns={errorTableColumns} rowKey={(record, index) => `${record.rowNumber}-${record.productCodeAttempted || index}`} pagination={{ pageSize: 5, showSizeChanger: false }} scroll={{ y: 300 }} bordered size="small" /></>
            )}
          </Space>
        </Modal>
      )}
      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,.05)", padding: 24, marginBottom: 18 }}>
        <Title level={4} style={{ color: "#0056b3", marginBottom: 18, fontWeight: 700 }}>Quản lý sản phẩm</Title>
        <Form form={form} layout="vertical">
          <Row gutter={12} align="bottom" style={{ flexWrap: "nowrap" }}>
            <Col flex="210px"><Form.Item label="Tìm kiếm" name="keySearch" style={{ marginBottom: 8 }}><Input prefix={<SearchOutlined />} placeholder="Tên hoặc mã sản phẩm" allowClear onChange={handleKeySearch} style={{ height: 38 }} /></Form.Item></Col>
            <Col flex="125px"><Form.Item label="Loại" name="categoryId" style={{ marginBottom: 8 }}><Select showSearch allowClear placeholder="Chọn loại" value={tableParams.pagination.categoryId} onChange={handleSelectCategory} style={{ width: "100%", height: 38 }} options={category} filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())} /></Form.Item></Col>
            <Col flex="110px"><Form.Item label="Gói" name="typeId" style={{ marginBottom: 8 }}><Select showSearch allowClear placeholder="Chọn gói" value={tableParams.pagination.typeId} onChange={handleSeletecType} style={{ width: "100%", height: 38 }} options={types} filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())} /></Form.Item></Col>
            <Col flex="130px"><Form.Item label="Trạng thái" name="status" style={{ marginBottom: 8 }}><Select allowClear placeholder="Chọn trạng thái" value={tableParams.pagination.status} onChange={handleSelectStatus} style={{ width: "100%", height: 38 }}><Option value={1}>Hoạt động</Option><Option value={0}>Không hoạt động</Option></Select></Form.Item></Col>
            <Col flex="90px"><Form.Item label="Giá từ" name="minPrice" style={{ marginBottom: 8 }}><InputNumber style={{ width: "100%", height: 38 }} min={0} onChange={onSearchMinValue} placeholder="Từ" formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} parser={(value) => value.replace(/\$\s?|(,*)/g, "")} /></Form.Item></Col>
            <Col flex="90px"><Form.Item label="Đến" name="maxPrice" style={{ marginBottom: 8 }}><InputNumber style={{ width: "100%", height: 38 }} min={0} onChange={onSearchMaxValue} placeholder="Đến" formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} parser={(value) => value.replace(/\$\s?|(,*)/g, "")} /></Form.Item></Col>
            <Col flex="auto" style={{ display: "flex", justifyContent: "flex-end", gap: 8, minWidth: 360, paddingBottom: 8 }}>
              <Button icon={<ReloadOutlined />} onClick={handleResetFilter} style={{ background: "#f5f6fa", color: "#0056b3", border: "1px solid #e6eaf0", minWidth: 110, fontWeight: 500 }}>Thiết lập lại</Button>
              {roleCode === "ADMIN" && (
                <><AddProduct fetchData={fetchData} modelItem={null} textButton={<><PlusOutlined /> Thêm mới</>} isStyle={true} />
                <Upload customRequest={handleUploadExcel} showUploadList={false} accept=".xlsx,.xls" disabled={loading}><Button icon={<UploadOutlined />} style={{ background: "#2596be", color: "#fff", border: "none", minWidth: 110, fontWeight: 500 }}>Nhập Excel</Button></Upload>
                <Button icon={<DownloadOutlined />} loading={loading} style={{ background: "#10b981", color: "#fff", border: "none", minWidth: 110, fontWeight: 500 }} onClick={handleExportExcel}>Xuất Excel</Button></>
              )}
            </Col>
          </Row>
        </Form>
      </div>
      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 6px rgba(0,0,0,0.06)", padding: "20px 10px 10px 10px" }}>
        <Table dataSource={product} columns={columns} pagination={false} loading={loading} onChange={handleTableChange} rowKey="id" scroll={{ x: 1800 }} locale={{ emptyText: "Không có dữ liệu" }} />
        <Pagination showSizeChanger onShowSizeChange={onShowSizeChange} onChange={(page, pageSize) => handleTableChange({ current: page, pageSize: pageSize })} style={{ textAlign: "center", marginTop: 18 }} current={tableParams.pagination.pageIndex} total={total} pageSize={tableParams.pagination.pageSize} showTotal={(totalData) => `Tổng cộng ${totalData} sản phẩm`} pageSizeOptions={["10", "20", "50", "100"]} locale={{ items_per_page: " sản phẩm/trang", jump_to: "Đến trang", jump_to_confirm: "Xác nhận", page: "Trang" }} />
      </div>
    </>
  );
}

export default ProductManager;