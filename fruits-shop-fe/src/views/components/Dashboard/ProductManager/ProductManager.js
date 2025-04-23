import React, { useCallback, useEffect, useState } from "react";
import { Button, Select, Space, Table, Menu } from "antd";
import useProduct from "@api/useProduct";
import { toast } from "react-toastify";
import { Pagination } from "antd";
import AddProduct from "./AddProduct";
import { Col, Form, Input, Row } from "antd";
import { Option } from "antd/es/mentions";
import useCategory from "@api/useCategory";
import useType from "@api/useType";

import CommonPopup from "./../Common/CommonPopup";
import { getMediaUrl } from "@constants/commonFunctions";
import { Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

function ProductManager() {
  function formatCurrencyVND(amount) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }

  const { getList, changeStatus, uploadExcelProduct } = useProduct();
  const { getListType } = useType();
  const { getListCategory } = useCategory();

  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [total, setTotal] = useState();
  const [tableParams, setTableParams] = useState({
    pagination: {
      pageIndex: 1,
      pageSize: 10,
      status: null,
      categoryId: null,
      typeId: null,
      keySearch: "",
    },
  });
  const [category, setCategory] = useState([]);
  const [types, setType] = useState([]);

  const fetchData = async () => {
    const { success, data } = await getList(tableParams.pagination);
    if (!success || data.status == "Error") {
      toast.error("Có lỗi xảy ra");
    } else {
      setProduct(data.data);
      setLoading(false);
      setTotal(data.totalCount);
    }
  };

  const fetchCategory = async () => {
    const { success, data } = await getListCategory({
      pageIndex: 1,
      pageSize: 20,
    });
    if (data != null && success) {
      var dataResults = data.data.map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
      setCategory(dataResults);
    }
  };

  const fetchType = async () => {
    const { success, data } = await getListType({ pageIndex: 1, pageSize: 20 });
    if (data != null && success) {
      var dataResults = data.data.map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
      setType(dataResults);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCategory();
    fetchType();
  }, [JSON.stringify(tableParams), loading]);

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setProduct([]);
    }
  };

  const onShowSizeChange = (current, pageSize) => {
    setTableParams({
      pagination: {
        pageIndex: current,
        pageSize: pageSize,
      },
    });
  };

  const menu = (record) => (
    <Menu>
      <Menu.Item>
        <AddProduct
          fetchData={fetchData}
          modelItem={record}
          textButton={"Sửa"}
          isStyle={false}
        />
      </Menu.Item>
      <Menu.Item>
        <Button
          type="button"
          value="small"
          onClick={(e) => showModal(record.id)}
        >
          Delete
        </Button>
      </Menu.Item>
    </Menu>
  );

  const [idChangeStatus, setIdChangeStatus] = useState();
  const [status, setStatusChange] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleChangeStatus = async (id, status) => {
    const { success, data } = await changeStatus(id, status);
    if (!success || data.status == "Error") {
      toast.error("Có lỗi xảy ra");
    } else {
      fetchData();
    }
  };
  const handleOk = () => {
    handleChangeStatus(idChangeStatus, status);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const showModal = (id, status) => {
    setIdChangeStatus(id);
    setStatusChange(status);
    setIsModalVisible(true);
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "number",
      key: "number",
      render: (_, __, index) => (
        <a style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {index + 1}
        </a>
      ),
    },
    {
      title: "Hình ảnh",
      dataIndex: "code",
      key: "images",
      render: (_, record) => (
        <img
          src={
            Array.isArray(record.images)
              ? getMediaUrl(record.images[0])
              : "href"
          }
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
      dataIndex: "stock",
      key: "stock",
      render: (_, record) => (
        <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {record.stock}
        </p>
      ),
    },
    {
      title: "Loại sản phẩm",
      dataIndex: "categoryName",
      key: "categoryName",
      render: (_, record) => (
        <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {record.categoryName}
        </p>
      ),
    },
    {
      title: "Gói bán SP",
      dataIndex: "typeName",
      key: "typeName",
      render: (_, record) => (
        <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {record.typeName}
        </p>
      ),
    },
    // {
    //     title: 'Số lượng đã bán',
    //     dataIndex: 'soldQuantity',
    //     key: 'soldQuantity',
    //     render: (_, record) => <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{record.soldQuantity ? record.soldQuantity : 0}</p>,

    // },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <AddProduct
            fetchData={fetchData}
            modelItem={record}
            textButton={"Sửa"}
            isStyle={true}
          />
          {record.status === 1 && (
            <Button
              type={"primary"}
              value="small"
              style={{
                alignItems: "center",
                background: "#e74421",
              }}
              onClick={() => showModal(record.id, 0)}
            >
              {" "}
              Khóa{" "}
            </Button>
          )}

          {record.status === 0 && (
            <Button
              type={"primary"}
              value="small"
              style={{
                alignItems: "center",
                background: "#e2ddd1",
                color: "#100d06",
              }}
              onClick={() => showModal(record.id, 1)}
            >
              {" "}
              Mở khóa{" "}
            </Button>
          )}
        </Space>
      ),
    },
  ];
  const handleSelectCategory = (e) => {
    setTableParams((prevPrams) => ({
      ...prevPrams,
      pagination: {
        ...prevPrams.pagination,
        pageIndex: 1,
        categoryId: e,
      },
    }));
  };

  const handleSeletecType = (e) => {
    setTableParams((prevPrams) => ({
      ...prevPrams,
      pagination: {
        ...prevPrams.pagination,
        pageIndex: 1,
        typeId: e,
      },
    }));
  };

  const handleSelectStatus = (e) => {
    setTableParams((prevPrams) => ({
      ...prevPrams,
      pagination: {
        ...prevPrams.pagination,
        pageIndex: 1,
        status: e,
      },
    }));
  };

  const handleKeySearch = (e) => {
    setTableParams((prevPrams) => ({
      ...prevPrams,
      pagination: {
        ...prevPrams.pagination,
        pageIndex: 1,
        keySearch: e.target.value,
      },
    }));
  };

  const handleUploadExcel = useCallback(({ file }) => {
    const formData = new FormData();
    formData.append("file", file);
    uploadExcelProduct(formData).then((res) => {
      if (res.success) {
        toast.success("Upload file success");
        fetchData();
      } else {
        toast.error(`${file.name} file upload failed.`);
      }
    });
  }, []);

  return (
    <>
      <CommonPopup
        visible={isModalVisible}
        title="Xác nhận"
        content={<p>Bạn chắc chắn cập nhật trạng thái bản ghi này?</p>} // You can replace this with any content
        onClose={handleCancel}
        onOk={handleOk}
      />
      <Form
        form={form}
        initialValues={{ layout: "horizontal" }}
        layout="vertical"
      >
        <Row gutter={[16, 16]} align={"bottom"}>
          <Col span={16}>
            <Form.Item
              label="Key search"
              name="keySearch"
              rules={[
                { required: false, message: "Please input product name!" },
              ]}
            >
              <Input
                placeholder="Enter code, name category"
                onChange={handleKeySearch}
              />
            </Form.Item>
          </Col>
          <Col span={8} style={{ textAlign: "right" }}>
            <Row justify="end" gutter={[16, 16]}>
              <Col span={8}>
                <Button
                  type="button"
                  value="small"
                  style={{
                    alignItems: "center",
                    background: "#2596be",
                    marginBottom: "24px",
                    color: "white",
                    width: "100%",
                  }}
                  onClick={() => {
                    setTableParams((prevPrams) => ({
                      ...prevPrams,
                      pagination: {
                        ...prevPrams.pagination,
                        pageIndex: 1,
                        keySearch: "",
                        categoryId: null,
                        typeId: null,
                        status: null,
                      },
                    }));
                    form.setFieldsValue({
                      keySearch: null,
                      typeId: null,
                      categoryId: null,
                      status: null,
                    });
                  }}
                >
                  Thiết lập lại
                </Button>
              </Col>
              <Col span={8}>
                <AddProduct
                  fetchData={fetchData}
                  modelItem={null}
                  textButton={"Thêm mới"}
                  isStyle={true}
                />
              </Col>
              <Col span={8}>
                <Upload
                  style={{ width: "100%" }}
                  customRequest={handleUploadExcel}
                  onRemove={false}
                  showUploadList={false}
                >
                  <Button
                    icon={<UploadOutlined />}
                    style={{
                      alignItems: "center",
                      background: "#2596be",
                      marginBottom: "24px",
                      color: "white",
                      width: "100%",
                    }}
                  >
                    Import excel
                  </Button>
                </Upload>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Form.Item label="Loại sản phẩm" name="categoryId">
              <Select
                placeholder="Please select"
                value={tableParams.pagination.categoryId}
                onChange={handleSelectCategory}
                style={{
                  width: "100%",
                  height: "40px",
                }}
                options={category}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Gói bán SP" name="typeId">
              <Select
                placeholder="Please select"
                value={tableParams.pagination.typeId}
                onChange={handleSeletecType}
                style={{
                  width: "100%",
                  height: "40px",
                }}
                options={types}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Trạng thái" name="status">
              <Select
                placeholder="Please select"
                value={tableParams.pagination.status}
                onChange={handleSelectStatus}
                style={{
                  width: "100%",
                  height: "40px",
                }}
              >
                <Option value={1}>Hoạt động</Option>
                <Option value={0}>Không hoạt động</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item label="Giá từ" name="price">
              <Input style={{ height: "40px" }} type="number" min={0} />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item label="Đến" name="price">
              <Input style={{ height: "40px" }} type="number" min={0} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table
        dataSource={product}
        columns={columns}
        pagination={false}
        loading={loading}
        onChange={handleTableChange}
      />
      <Pagination
        showSizeChanger
        onChange={onShowSizeChange}
        style={{ textAlign: "center", marginTop: "1.5rem" }}
        defaultCurrent={tableParams.pagination.pageIndex}
        total={total}
      />
    </>
  );
}
export default ProductManager;
