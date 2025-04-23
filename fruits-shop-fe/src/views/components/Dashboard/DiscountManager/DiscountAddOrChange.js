import { PlusSquareOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Table,
  DatePicker,
  Checkbox,
  Pagination,
} from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useDiscount from "@api/useDiscount";
import { Option } from "antd/es/mentions";
import TextArea from "antd/es/input/TextArea";
import useProduct from "@api/useProduct";
import useCategory from "@api/useCategory";
import { format } from "date-fns";
import dayjs from "dayjs";

const DiscountAddOrChange = ({ fetchData, modelItem, textButton, isStyle }) => {
  const { generateCode, addOrChange } = useDiscount();
  const { getListCategory } = useCategory();
  const [modal2Open, setModal2Open] = useState(false);
  const [form] = Form.useForm();
  const { getList } = useProduct();
  const [product, setProduct] = useState([]);
  const [total, setTotal] = useState();
  const [loading, setLoading] = useState(false);
  const [typeProductDiscount, setTypeProductDiscount] = useState(null);
  const [category, setCategory] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [productIdSelected, setProductIdSelected] = useState([]);
  const { RangePicker } = DatePicker;
  const [dates, setDates] = useState([]);

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const [tableParams, setTableParams] = useState({
    pagination: {
      pageIndex: 1,
      pageSize: 10,
      keySearch: "",
    },
  });
  const fetchGenerateCode = async () => {
    const { success, data } = await generateCode();
    if (data != null && success) {
      form.setFieldsValue({ code: data.data });
    }
  };
  const fetchProduct = async () => {
    const { success, data } = await getList(tableParams.pagination);
    if (!success || data.status == "Error") {
      toast.error("Có lỗi xảy ra");
    } else {
      setProduct(data.data);
      setLoading(false);
      setTotal(data.totalCount);
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
  const fetchCategory = async () => {
    const { success, data } = await getListCategory({
      pageIndex: 1,
      pageSize: 5,
    });
    if (data != null && success) {
      var dataCategory = data.data.map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
      setCategory(dataCategory);
    }
  };
  const showModel = () => {
    fetchCategory();
    if (modelItem) {
      form.setFieldsValue({
        code: modelItem.code,
        name: modelItem.name,
        description: modelItem.description,
        type: modelItem.type,
        moneyDiscount:
          modelItem.type === 1 ? modelItem.percent : modelItem.moneyDiscount,
        percent: modelItem.type === 1 ? modelItem.percent : null,
        startDate: modelItem.startDate
          ? dayjs(modelItem.startDate, "YYYY-MM-DD HH:mm:ss")
          : null,
        endDate: modelItem.endDate
          ? dayjs(modelItem.endDate, "YYYY-MM-DD HH:mm:ss")
          : null,
      });
      setStartDate(modelItem.startDate);
      setEndDate(modelItem.endDate);
      if (modelItem && modelItem.productIds) {
        setProductIdSelected(modelItem.productIds);
      }
    } else {
      fetchGenerateCode();
      setTypeProductDiscount(1);
      form.setFieldsValue({
        type: 1,
        status: 1,
        isDeleted: 0,
      });
    }
    fetchProduct();
    setModal2Open(true);
  };
  useEffect(() => {
    if (modal2Open) {
      fetchProduct();
    }
  }, [tableParams, typeProductDiscount]);

  const handleSetEndDate = (date, dateString) => {
    if (date) {
      // Sử dụng định dạng chuẩn ISO 8601
      const formattedDate = date.format("DD/MM/YYYY HH:mm:ss");
      setEndDate(formattedDate);
      console.log("End date set to:", formattedDate);
    } else {
      setEndDate(null);
    }
  };

  const handleSetStartDate = (date, dateString) => {
    if (date) {
      // Sử dụng định dạng chuẩn ISO 8601
      const formattedDate = date.format("DD/MM/YYYY HH:mm:ss");
      setStartDate(formattedDate);
      console.log("Start date set to:", formattedDate);
    } else {
      setStartDate(null);
    }
  };

  const checkStartDate = (_, value) => {
    if (dayjs(startDate).isAfter(dayjs(endDate))) {
      return Promise.reject(
        new Error("Ngày bắt đầu phải trước ngày kết thúc!")
      );
    }
    return Promise.resolve();
  };

  const checkEndDate = (_, value) => {
    if (dayjs(endDate).isBefore(dayjs(startDate))) {
      return Promise.reject(new Error("Ngày kết thúc phải sau ngày bắt đầu!"));
    }
    return Promise.resolve();
  };

  const onFinish = async (values) => {
    console.log("🚀 ~ onFinish ~ values:", values);
    try {
      if (productIdSelected === null || productIdSelected.length === 0) {
        toast.error("Vui lòng chọn sản phẩm cho trương chình khuyến mại");
        return;
      }

      if (!startDate || !endDate) {
        toast.error("Vui lòng chọn thời gian bắt đầu và kết thúc");
        return;
      }

      // Create the object to match backend entity fields
      var objectModel = {
        name: values.name,
        description: values.description,
        type: values.type,
        startDate: dayjs(values.startDate),
        endDate: dayjs(values.endDate),
        status: 1,
        isDeleted: 0,
        id: modelItem ? modelItem.id : null,
        code: values.code,
        productIds: productIdSelected,
      };

      // Set moneyDiscount or percent based on type
      if (values.type === 1) {
        objectModel.percent = parseInt(values.moneyDiscount);
        objectModel.moneyDiscount = 0;
      } else {
        objectModel.moneyDiscount = parseInt(values.moneyDiscount);
        objectModel.percent = 0;
      }

      console.log("Sending to server:", objectModel);

      const { success, data } = await addOrChange(objectModel);
      if (data.success) {
        setModal2Open(false);
        toast.success(data.message);
        fetchData();
      } else {
        toast.error(
          data.message || "Dữ liệu đầu vào không hợp lệ. Xin vui lòng thử lại"
        );
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(error.message || "Có lỗi xảy ra khi xử lý");
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const handleChange = (value) => {
    form.setFieldsValue({ type: value });
  };

  const handleSelectedAll = (event) => {
    if (event.target.checked) {
      setProductIdSelected(product.map(({ id }) => id));
    } else {
      setProductIdSelected([]);
    }
  };
  const handleChangeSelected = (event, id) => {
    var models = [...productIdSelected];
    if (event.target.checked) {
      models.push(id);
    } else {
      models = models.filter((e) => e != id);
    }
    setProductIdSelected(models);
  };
  const handleChangeSearchNameProd = (e) => {
    setTableParams((prevPrams) => ({
      ...prevPrams,
      pagination: {
        ...prevPrams.pagination,
        keySearch: e.target.value,
      },
    }));
  };
  const columns = [
    {
      title: <Checkbox onClick={(e) => handleSelectedAll(e)}></Checkbox>,
      dataIndex: "number",
      key: "number",
      render: (_, record) => {
        return (
          <Checkbox
            onChange={(e) => handleChangeSelected(e, record.id)}
            checked={
              productIdSelected &&
              productIdSelected.length > 0 &&
              productIdSelected.includes(record.id)
            }
          ></Checkbox>
        );
      },
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
  ];
  function formatCurrencyVND(amount) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }
  const handeSelectTypeDiscountProd = (e) => {
    setTypeProductDiscount(e);
  };
  const handeRangerPicker = (e) => {
    setDates(e);
  };
  return (
    <div>
      <Button
        type={isStyle ? "primary" : "button"}
        value="small"
        style={
          isStyle
            ? {
                alignItems: "center",
                background: "#1fbf39",
              }
            : null
        }
        onClick={() => showModel()}
      >
        {textButton}
      </Button>

      <Modal
        width={"60%"}
        title="Thêm mới"
        centered
        open={modal2Open}
        onCancel={() => setModal2Open(false)}
        footer={null}
        bodyStyle={{
          overflowY: "auto",
          maxHeight: "calc(100vh - 200px)",
          overflowX: "hidden",
        }}
      >
        <Form
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{ layout: "horizontal" }}
          layout="vertical"
        >
          <Row gutter={[5, 5]}>
            <Col span={12}>
              <Form.Item
                label="Mã khuyến mại"
                name="code"
                rules={[
                  { required: true, message: "Vui lòng nhập mã đợt giảm giá!" },
                ]}
              >
                <Input placeholder="" readOnly />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Tên đợt giảm giá"
                name="name"
                rules={[
                  { required: true, message: "Vui lòng nhập tên đợt giảm giá!" },
                ]}
              >
                <Input placeholder="" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Loại khuyến mại"
                name="type"
                rules={[{ required: true, message: "Vui lòng chọn đợt giảm giá!" }]}
              >
                <Select
                  placeholder=""
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    height: "40px",
                  }}
                >
                  <Option value={1}>Giảm phần trăm sản phẩm</Option>
                  <Option value={2}>Giảm tiền sản phẩm</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Giá trị"
                name="moneyDiscount"
                rules={[
                  { required: true, message: "Vui lòng nhập số tiền đợt giảm giá!" },
                ]}
              >
                <Input placeholder="" type="number" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Ngày bắt đầu"
                name="startDate"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày bắt đầu!" },
                  { validator: checkStartDate },
                ]}
              >
                <DatePicker
                  showTime
                  format="DD-MM-YYYY HH:mm:ss"
                  onChange={handleSetStartDate}
                  style={{ width: "100%", height: "40px" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Ngày kết thúc"
                name="endDate"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày kết thúc!" },
                  { validator: checkEndDate },
                ]}
              >
                <DatePicker
                  showTime
                  format="DD-MM-YYYY HH:mm:ss"
                  onChange={handleSetEndDate}
                  style={{ width: "100%", height: "40px" }}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Mô tả" name="description">
                <TextArea rows={3} placeholder="" type="text" />
              </Form.Item>
            </Col>
          </Row>
          <br />
          <Row gutter={[5, 5]}>
            <Col span={16}>
              <span
                className="hide-menu"
                style={{ fontSize: "13px", color: "black", fontWeight: "bold" }}
              >
                Thông tin sản phẩm khuyến mại
              </span>
            </Col>
          </Row>
          <br />

          <Row gutter={[5, 5]}>
            <Col span={24}>
              <Form.Item
                name="searchProduct"
                rules={[{ required: false, message: "" }]}
              >
                <Input
                  placeholder="Nhập mã, tên sản phẩm.."
                  onChange={(e) => handleChangeSearchNameProd(e)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Table
            dataSource={product}
            columns={columns}
            pagination={false}
            loading={loading}
            onChange={null}
          />
          <Pagination
            showSizeChanger
            onChange={onShowSizeChange}
            style={{ textAlign: "center", marginTop: "24px" }}
            defaultCurrent={tableParams.pagination.pageIndex}
            total={total}
          />

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginTop: "20px" }}
            >
              Lưu thông tin
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DiscountAddOrChange;
