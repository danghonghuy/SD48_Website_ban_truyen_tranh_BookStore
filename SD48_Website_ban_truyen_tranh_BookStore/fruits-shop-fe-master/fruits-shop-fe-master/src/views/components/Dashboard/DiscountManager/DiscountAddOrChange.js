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
  InputNumber,
} from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useDiscount from "@api/useDiscount";
import { Option } from "antd/es/mentions";
import TextArea from "antd/es/input/TextArea";
import useProduct from "@api/useProduct";
import useCategory from "@api/useCategory";
import dayjs from "dayjs";

const DiscountAddOrChange = ({ fetchData, modelItem, textButton, isStyle }) => {
  const { generateCode, addOrChange } = useDiscount();
  const { getListCategory } = useCategory();
  const [modal2Open, setModal2Open] = useState(false);
  const [form] = Form.useForm();
  const { getList } = useProduct();
  const [product, setProduct] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [typeProductDiscount, setTypeProductDiscount] = useState(null);
  const [category, setCategory] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [productIdSelected, setProductIdSelected] = useState([]);
  const [type, setType] = useState(1);

  const [currentFormStartDate, setCurrentFormStartDate] = useState(null);
  const [currentFormEndDate, setCurrentFormEndDate] = useState(null);

  const [tableParams, setTableParams] = useState({
    pagination: {
      pageIndex: 1,
      pageSize: 10,
      keySearch: "",
    },
  });

  const fetchGenerateCode = async () => {
    const response = await generateCode();
    if (response && response.success && response.data && response.data.data) {
      form.setFieldsValue({ code: response.data.data });
    }
  };

  const fetchProduct = async () => {
    setLoading(true);
    const response = await getList(tableParams.pagination);
    if (response && response.success && response.data && response.data.data) {
      setProduct(response.data.data);
      setTotal(response.data.totalCount || 0);
    } else {
      toast.error(response?.data?.message || response?.message || "Có lỗi xảy ra khi tải sản phẩm");
      setProduct([]);
      setTotal(0);
    }
    setLoading(false);
  };

  const onShowSizeChange = (current, pageSize) => {
    setTableParams(prev => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        pageIndex: current,
        pageSize: pageSize,
      },
    }));
  };

  const fetchCategory = async () => {
    const response = await getListCategory({
      pageIndex: 1,
      pageSize: 50, // Tăng pageSize để lấy đủ category
    });
    if (response && response.success && response.data && response.data.data) {
      const dataCategory = response.data.data.map((item) => ({
        value: item.id,
        label: item.name,
      }));
      setCategory(dataCategory);
    }
  };

  const showModel = () => {
    fetchCategory();
    if (modelItem) {
      const initialStartDate = modelItem.startDate ? dayjs(modelItem.startDate) : null;
      const initialEndDate = modelItem.endDate ? dayjs(modelItem.endDate) : null;
      setCurrentFormStartDate(initialStartDate);
      setCurrentFormEndDate(initialEndDate);
      form.setFieldsValue({
        code: modelItem.code,
        name: modelItem.name,
        description: modelItem.description,
        type: modelItem.type,
        moneyDiscount: modelItem.type === 1 ? modelItem.percent : modelItem.moneyDiscount,
        startDate: initialStartDate,
        endDate: initialEndDate,
      });
      setType(modelItem.type);
      if (modelItem.productIds) {
        setProductIdSelected(modelItem.productIds);
      }
    } else {
      fetchGenerateCode();
      form.resetFields();
      setType(1);
      setCurrentFormStartDate(null);
      setCurrentFormEndDate(null);
      setProductIdSelected([]);
      setAllSelected(false);
      setTypeProductDiscount(1);
      form.setFieldsValue({
        type: 1,
        status: 1,
        isDeleted: 0,
      });
    }
    fetchProduct(); // Gọi fetchProduct sau khi set state
    setModal2Open(true);
  };

  useEffect(() => {
    if (modal2Open) {
      fetchProduct();
    }
  }, [tableParams.pagination.pageIndex, tableParams.pagination.pageSize, tableParams.pagination.keySearch, typeProductDiscount, modal2Open]);


  const handleSetEndDate = (date) => {
    setCurrentFormEndDate(date);
  };

  const handleSetStartDate = (date) => {
    setCurrentFormStartDate(date);
  };

  const onFinish = async (values) => {
    try {
      if (!productIdSelected || productIdSelected.length === 0) {
        toast.error("Vui lòng chọn ít nhất một sản phẩm cho chương trình khuyến mãi.");
        return;
      }

      if (!values.startDate || !values.endDate) {
        toast.error("Vui lòng chọn thời gian bắt đầu và kết thúc.");
        return;
      }
      
      setLoading(true);
      const objectModel = {
        name: values.name,
        description: values.description,
        type: values.type,
        startDate: dayjs(values.startDate).toISOString(),
        endDate: dayjs(values.endDate).toISOString(),
        status: 1,
        isDeleted: 0,
        id: modelItem ? modelItem.id : null,
        code: values.code,
        productIds: productIdSelected,
      };

      if (values.type === 1) {
        objectModel.percent = parseInt(String(values.moneyDiscount).replace(/,/g, ''), 10);
        objectModel.moneyDiscount = 0;
      } else {
        objectModel.moneyDiscount = parseInt(String(values.moneyDiscount).replace(/,/g, ''), 10);
        objectModel.percent = 0;
      }

      const response = await addOrChange(objectModel);
      setLoading(false);

      if (response && response.success) {
        setModal2Open(false);
        toast.success(response.data?.message || (modelItem ? "Cập nhật thành công!" : "Thêm mới thành công!"));
        if (fetchData) fetchData();
        form.resetFields();
        setProductIdSelected([]);
        setCurrentFormStartDate(null);
        setCurrentFormEndDate(null);
        setAllSelected(false);
        setType(1);
      } else {
        toast.error(response?.data?.message || response?.message || "Dữ liệu đầu vào không hợp lệ. Xin vui lòng thử lại.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Lỗi khi gửi form:", error);
      toast.error(error.message || "Có lỗi xảy ra khi xử lý.");
    }
  };

  const onFinishFailed = (errorInfo) => {
    errorInfo.errorFields.forEach(err => {
        toast.warn(err.errors[0]);
    });
  };

  const handleChange = (value) => {
    setType(value);
    form.setFieldsValue({ type: value, moneyDiscount: undefined });
  };

  const handleSelectedAll = (event) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      setProductIdSelected(product.map(({ id }) => id));
    } else {
      setProductIdSelected([]);
    }
    setAllSelected(isChecked);
  };

  const handleChangeSelected = (event, id) => {
    const isChecked = event.target.checked;
    let newSelectedIds = [...productIdSelected];
    if (isChecked) {
      if (!newSelectedIds.includes(id)) {
        newSelectedIds.push(id);
      }
    } else {
      newSelectedIds = newSelectedIds.filter((e) => e !== id);
    }
    setProductIdSelected(newSelectedIds);
    setAllSelected(newSelectedIds.length === product.length && product.length > 0);
  };

  const handleChangeSearchNameProd = (e) => {
    const { value } = e.target;
    setTableParams(prevParams => ({
      ...prevParams,
      pagination: {
        ...prevParams.pagination,
        pageIndex: 1,
        keySearch: value,
      },
    }));
  };

  const columns = [
    {
      title: <Checkbox onChange={handleSelectedAll} checked={allSelected && product.length > 0} indeterminate={productIdSelected.length > 0 && productIdSelected.length < product.length} />,
      dataIndex: "checkbox_col",
      key: "checkbox_col",
      width: 60,
      render: (_, record) => (
        <Checkbox
          onChange={(e) => handleChangeSelected(e, record.id)}
          checked={productIdSelected.includes(record.id)}
        />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name_col",
    },
    {
      title: "Mã sản phẩm",
      dataIndex: "code",
      key: "code_col",
    },
    {
      title: "Giá sản phẩm",
      dataIndex: "price",
      key: "price_col",
      render: (text) => formatCurrencyVND(text),
    },
    {
      title: "Số lượng",
      dataIndex: "stock",
      key: "stock_col",
    },
  ];

  function formatCurrencyVND(amount) {
    if (amount === null || amount === undefined) return "";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }

  const handleModalCancel = () => {
    setModal2Open(false);
    form.resetFields();
    setProductIdSelected([]);
    setCurrentFormStartDate(null);
    setCurrentFormEndDate(null);
    setType(1);
    setAllSelected(false);
    setTableParams(prev => ({
        ...prev,
        pagination: {
            ...prev.pagination,
            keySearch: "",
            pageIndex: 1,
        }
    }))
  };
  
  const commonInputNumberProps = {
    style: { width: "100%", height: "32px" },
    formatter: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    parser: (value) => String(value).replace(/,/g, ''),
  };


  return (
    <div>
      <Button
        type={isStyle ? "primary" : "default"}
        size="middle"
        style={
          isStyle
            ? {
                alignItems: "center",
                background: "#1fbf39",
                borderColor: "#1fbf39",
                color: "white"
              }
            : null
        }
        onClick={showModel}
        icon={isStyle ? <PlusSquareOutlined /> : null}
      >
        {textButton}
      </Button>

      <Modal
        width={"60%"}
        title={modelItem ? "Cập nhật chương trình khuyến mãi" : "Thêm mới chương trình khuyến mãi"}
        centered
        open={modal2Open}
        onCancel={handleModalCancel}
        footer={null}
        destroyOnClose
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
          layout="vertical"
          name="discount_form"
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Mã khuyến mãi"
                name="code"
                rules={[
                  { required: true, message: "Mã khuyến mãi không được để trống!" },
                ]}
              >
                <Input placeholder="Mã sẽ được tạo tự động" readOnly />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Tên chương trình"
                name="name"
                rules={[
                  { required: true, message: "Tên chương trình không được để trống!" },
                  { min: 5, message: "Tên chương trình phải có ít nhất 5 ký tự!" },
                  { max: 200, message: "Tên chương trình không được vượt quá 200 ký tự!"}
                ]}
              >
                <Input placeholder="VD: Khuyến mãi Black Friday" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Loại khuyến mãi"
                name="type"
                rules={[
                  { required: true, message: "Vui lòng chọn loại khuyến mãi!" },
                ]}
              >
                <Select
                  placeholder="Chọn loại khuyến mãi"
                  onChange={handleChange}
                  style={{ width: "100%"}}
                  disabled={!!modelItem}
                >
                  <Option value={1}>Giảm theo phần trăm (%)</Option>
                  <Option value={2}>Giảm theo số tiền (VNĐ)</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label={type === 1 ? "Phần trăm giảm (%)" : "Số tiền giảm (VNĐ)"}
                name="moneyDiscount" // Giữ nguyên name là moneyDiscount, logic xử lý trong onFinish
                rules={[
                  { required: true, message: "Giá trị khuyến mãi không được để trống!" },
                  {
                    validator: (_, value) => {
                      if (value === undefined || value === null || String(value).trim() === '') {
                        return Promise.resolve(); // Bỏ qua nếu rỗng, để required rule xử lý
                      }
                      const numValue = Number(String(value).replace(/,/g, ''));
                      if (isNaN(numValue)) {
                        return Promise.reject(new Error('Giá trị phải là một số hợp lệ!'));
                      }
                      if (numValue <= 0) {
                        return Promise.reject(new Error('Giá trị khuyến mãi phải lớn hơn 0!'));
                      }
                      if (form.getFieldValue('type') === 1) { // type lấy từ form
                        if (numValue > 100) {
                          return Promise.reject(new Error('Phần trăm giảm không được vượt quá 100%!'));
                        }
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                {type === 1 ? (
                  <InputNumber
                    placeholder="VD: 10 cho 10%"
                    min={0.01}
                    max={100}
                    step={0.01}
                    {...commonInputNumberProps}
                    formatter={(value) => `${value}`} // Bỏ formatter mặc định cho %
                    parser={(value) => value}       // Bỏ parser mặc định cho %
                  />
                ) : (
                  <InputNumber
                    placeholder="VD: 50.000"
                    min={1}
                    {...commonInputNumberProps}
                  />
                )}
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Ngày bắt đầu"
                name="startDate"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày bắt đầu!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const endDateValue = getFieldValue('endDate');
                      if (!value) return Promise.resolve();
                      if (endDateValue && value.isAfter(endDateValue)) {
                        return Promise.reject(new Error('Ngày bắt đầu phải trước hoặc bằng ngày kết thúc!'));
                      }
                      if (!modelItem && value.isBefore(dayjs().startOf('day'))) {
                         return Promise.reject(new Error('Ngày bắt đầu không được là một ngày trong quá khứ!'));
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <DatePicker
                  showTime={{ format: 'HH:mm:ss' }}
                  format="DD-MM-YYYY HH:mm:ss"
                  onChange={handleSetStartDate}
                  style={{ width: "100%", height: "32px" }}
                  placeholder="Chọn ngày giờ bắt đầu"
                  disabledDate={current => currentFormEndDate && current && current.isAfter(currentFormEndDate, 'day')}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Ngày kết thúc"
                name="endDate"
                dependencies={['startDate']}
                rules={[
                  { required: true, message: "Vui lòng chọn ngày kết thúc!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const startDateValue = getFieldValue('startDate');
                      if (!value) return Promise.resolve();
                      if (startDateValue && value.isBefore(startDateValue)) {
                        return Promise.reject(new Error('Ngày kết thúc phải sau hoặc bằng ngày bắt đầu!'));
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <DatePicker
                  showTime={{ format: 'HH:mm:ss' }}
                  format="DD-MM-YYYY HH:mm:ss"
                  onChange={handleSetEndDate}
                  style={{ width: "100%", height: "32px" }}
                  placeholder="Chọn ngày giờ kết thúc"
                  disabledDate={current => currentFormStartDate && current && current.isBefore(currentFormStartDate, 'day')}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Mô tả" name="description"
                rules={[
                    { max: 500, message: "Mô tả không được vượt quá 500 ký tự!"}
                ]}
              >
                <TextArea rows={3} placeholder="Nhập mô tả chi tiết cho chương trình (không bắt buộc)" />
              </Form.Item>
            </Col>
          </Row>
          <br />
          <Row gutter={[5, 5]}>
            <Col span={16}>
              <span
                style={{ fontSize: "1rem", color: "black", fontWeight: "500" }}
              >
                Sản phẩm áp dụng khuyến mãi
              </span>
            </Col>
          </Row>
          <br />

          <Row gutter={[5, 5]}>
            <Col span={24}>
              <Form.Item
                name="searchProduct"
              >
                <Input
                  placeholder="Tìm kiếm sản phẩm theo tên hoặc mã..."
                  onChange={handleChangeSearchNameProd}
                  allowClear
                />
              </Form.Item>
            </Col>
          </Row>
          <Table
            dataSource={product}
            columns={columns}
            pagination={false}
            loading={loading}
            rowKey="id"
            scroll={{ y: 240 }}
            size="small"
          />
          {total > 0 && (
            <Pagination
                current={tableParams.pagination.pageIndex}
                pageSize={tableParams.pagination.pageSize}
                total={total}
                showSizeChanger
                onChange={onShowSizeChange}
                onShowSizeChange={onShowSizeChange}
                style={{ textAlign: "center", marginTop: "20px" }}
                showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} sản phẩm`}
            />
          )}
          <Form.Item style={{ marginTop: "24px", textAlign: "right" }}>
            <Button onClick={handleModalCancel} style={{ marginRight: 8 }}>
              Hủy bỏ
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              {modelItem ? "Cập nhật" : "Lưu"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DiscountAddOrChange;