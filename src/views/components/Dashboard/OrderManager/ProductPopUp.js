import { PlusSquareOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Pagination,
  Checkbox,
  Table,
} from "antd";
import React, { useEffect, useState } from "react";
import useProduct from "@api/useProduct";
import { toast } from "react-toastify";
import { getMediaUrl } from "@constants/commonFunctions";

const ProductPopUp = ({ handleProductSelected, modelProduct, tabIndex }) => {
  const [modal2Open, setModal2Open] = useState(false);
  const { getList } = useProduct();

  const [product, setProduct] = useState([]);
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
  const [productSelecteds, setProductIdSelected] = useState([]);
  const [localModelProduct, setLocalModelProduct] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    const { success, data } = await getList(tableParams.pagination);
    if (!success || data.status == "Error") {
      toast.error("Có lỗi xảy ra");
      setLoading(false);
    } else {
      setProduct(data.data);
      setLoading(false);
      setTotal(data.totalCount);
    }
  };

  const showModel = () => {
    // Tạo bản sao của modelProduct để không thay đổi trực tiếp props
    const currentModelProduct = Array.isArray(modelProduct)
      ? [...modelProduct]
      : [];
    setLocalModelProduct(currentModelProduct);
    setModal2Open(true);
    fetchData();
    setProductIdSelected([]);
  };

  const onFinish = () => {
    if (!productSelecteds || productSelecteds.length === 0) {
      setModal2Open(false);
      return;
    }

    const updatedModelProduct = [...localModelProduct];

    // Xử lý các sản phẩm đã chọn
    productSelecteds.forEach((item) => {
      const index = updatedModelProduct.findIndex((m) => m.productId === item.id);
      if (index !== -1) {
        updatedModelProduct[index].quantity += item.quantity;
      } else {
        updatedModelProduct.push(item);
      }
    });

    // Cập nhật state và gọi callback
    setLocalModelProduct(updatedModelProduct);
    handleProductSelected(updatedModelProduct, tabIndex);
    setModal2Open(false);
  };

  useEffect(() => {
    if (modal2Open) {
      fetchData();
    }
  }, [JSON.stringify(tableParams), modal2Open]);

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

  const handleChangeSearchNameProd = (e) => {
    setTableParams((prevPrams) => ({
      ...prevPrams,
      pagination: {
        ...prevPrams.pagination,
        pageIndex: 1,
        pageSize: 5,
        keySearch: e.target.value,
      },
    }));
  };

  function formatCurrencyVND(amount) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }

  const handleSelectedAll = (event) => {
    if (event.target.checked) {
      // Kiểm tra trước khi chọn tất cả
      for (const item of product) {
        const quantityChosing =
          productSelecteds.find((p) => p.id === item.id)?.quantity || 0;
        const quantityChosed =
          localModelProduct.find((p) => p.id === item.id)?.quantity || 0;

        if (item.stock - quantityChosing - quantityChosed - 1 < 0) {
          toast.error(`Sản phẩm "${item.name}" đã hết hàng`);
          return;
        }
      }

      // Nếu tất cả sản phẩm đều có đủ số lượng, thêm vào danh sách đã chọn
      const result = product.map((item) => ({
        id: item.id,
        productId: item.id,
        image: item.images && item.images.length > 0 ? item.images[0] : null,
        name: item.name,
        price: item.discountDTO
          ? item.price -
          (item.discountDTO?.percent
            ? (item.price * item.discountDTO?.percent) / 100
            : item.discountDTO?.moneyDiscount)
          : item.price,
        code: item.code,
        priceDiscount:
          item.discountDTO?.moneyDiscount || item.discountDTO?.percent,
        quantity: 1,
        stock: item.stock,
      }));
      setProductIdSelected(result);
    } else {
      setProductIdSelected([]);
    }
  };

  const handleChangeSelected = (event, item) => {
    if (event.target.checked) {
      const quantityChosing =
        productSelecteds.find((p) => p.id === item.id)?.quantity || 0;
      const quantityChosed =
        localModelProduct.find((p) => p.id === item.id)?.quantity || 0;

      if (item.stock - quantityChosed - quantityChosing - 1 < 0) {
        toast.error(`Sản phẩm "${item.name}" đã hết hàng`);
        return;
      }

      // Nếu đã chọn sản phẩm này trước đó, xóa nó khỏi danh sách
      const filteredProducts = productSelecteds.filter((p) => p.productId !== item.id);

      // Thêm sản phẩm vào danh sách đã chọn
      setProductIdSelected([
        ...filteredProducts,
        {
          id: item.id,
          productId: item.id,
          image: item.images && item.images.length > 0 ? item.images[0] : null,
          name: item.name,
          price: item.discountDTO
            ? item.price -
            (item.discountDTO.percent
              ? (item.price * item.discountDTO.percent) / 100
              : item.discountDTO?.moneyDiscount)
            : item.price,
          code: item.code,
          priceDiscount:
            item.discountDTO?.moneyDiscount || item.discountDTO?.percent || 0,
          quantity: 1,
          stock: item.stock,
        },
      ]);
    } else {
      // Xóa sản phẩm khỏi danh sách đã chọn
      setProductIdSelected(productSelecteds.filter((p) => p.id !== item.id));
    }
  };

  const onShowSizeChange = (current, pageSize) => {
    setTableParams({
      pagination: {
        pageIndex: current,
        pageSize: pageSize,
        keySearch: tableParams.pagination.keySearch,
      },
    });
  };

  const columns = [
    {
      title: <Checkbox onClick={(e) => handleSelectedAll(e)}></Checkbox>,
      dataIndex: "number",
      key: "number",
      render: (_, record) => {
        return (
          <Checkbox
            checked={productSelecteds.some((p) => p.id === record.id)}
            onClick={(e) => handleChangeSelected(e, record)}
          ></Checkbox>
        );
      },
    },
    {
      title: "Hình ảnh",
      dataIndex: "code",
      key: "images",
      render: (_, record) => (
        <img
          src={
            Array.isArray(record.images)
              ? getMediaUrl(record.images[0]?.imageUrl)
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
      render: (text, record) => (
        <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {record.discountDTO?.moneyDiscount > 0 ||
            record.discountDTO?.percent > 0 ? (
            <>
              <span className="text-decoration-line-through">
                {formatCurrencyVND(record.price)}
              </span>{" "}
              <span>
                {formatCurrencyVND(
                  text -
                  (record.discountDTO?.percent
                    ? (record.price * record.discountDTO?.percent) / 100
                    : record.discountDTO?.moneyDiscount)
                )}
              </span>
            </>
          ) : (
            <>{formatCurrencyVND(text)}</>
          )}
        </p>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "stock",
      key: "stock",
      render: (_, record) => {
        const quantityChosing =
          productSelecteds.find((p) => p.id === record.id)?.quantity || 0;
        const quantityChosed =
          localModelProduct.find((p) => p.id === record.id)?.quantity || 0;
        return (
          <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
            {record.stock - quantityChosing - quantityChosed}
          </p>
        );
      },
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (_, record) => (
        <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {record.description}
        </p>
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
          marginBottom: "20px",
          color: "white",
        }}
        onClick={() => showModel()}
      >
        Chọn sản phẩm
      </Button>

      <Modal
        width={1000}
        title="Thêm sản phẩm đơn hàng"
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
                placeholder="Enter code, product name.."
                onChange={handleChangeSearchNameProd}
              />
            </Form.Item>
          </Col>
          <Col span={6} style={{ textAlign: "right" }}>
            <Button
              type="button"
              value="small"
              style={{
                alignItems: "center",
                background: "#2596be",
                marginBottom: "20px",
                color: "white",
                width: "100%",
              }}
              onClick={() => onFinish()}
            >
              Thêm giỏ hàng
            </Button>
          </Col>
        </Row>

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
          style={{ textAlign: "center", marginTop: "24px" }}
          defaultCurrent={tableParams.pagination.pageIndex}
          total={total}
        />
      </Modal>
    </div>
  );
};

export default ProductPopUp;
