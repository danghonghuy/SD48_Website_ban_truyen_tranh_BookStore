import { PlusSquareOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row, Select, DatePicker } from "antd";
import React, { useEffect, useState } from "react";
import useCategory from "@api/useCategory";
import useType from "@api/useType";
import { toast } from "react-toastify";
import useCoupon from "@api/useCoupons";
import { Option } from "antd/es/mentions";
import TextArea from "antd/es/input/TextArea";
import { format } from "date-fns";
import dayjs from "dayjs";
import { InputNumber } from "antd";

const CouponAddOrChange = ({ fetchData, modelItem, textButton, isStyle }) => {
  const { generateCode, addOrChange } = useCoupon();

  const [modal2Open, setModal2Open] = useState(false);
  const [form] = Form.useForm();

  const { getListCategory } = useCategory();
  const { getListType } = useType();
  const [category, setCategory] = useState([]);
  const [types, setType] = useState([]);

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const fetchGenerateCode = async () => {
    const { success, data } = await generateCode();
    if (data != null && success) {
      form.setFieldsValue({ code: data.data });
    }
  };

  const fetchCategory = async () => {
    const { success, data } = await getListCategory({
      pageIndex: 1,
      pageSize: 20,
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

  const fetchTypes = async () => {
    const { success, data } = await getListType({ pageIndex: 1, pageSize: 20 });
    if (data != null && success) {
      var dataOrigin = data.data.map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
      setType(dataOrigin);
    }
  };
  const handleSetEndDate = (date) => {
    setEndDate(date.format());
  };

  const handleSetStartDate = (date) => {
    setStartDate(date.format());
  };

  const showModel = () => {
    fetchCategory();
    fetchTypes();
    if (modelItem) {
      form.setFieldsValue({
        code: modelItem.code,
        name: modelItem.name,
        description: modelItem.description,
        typeId: modelItem.type,
        couponAmount: modelItem.couponAmount,
        percentValue: modelItem.percentValue,
        maxValue: modelItem.maxValue,
        quantity: modelItem.quantity,
        dateStart: modelItem.dateStartEpochTime
          ? dayjs(modelItem.dateStartEpochTime)
          : undefined,
        dateEnd: modelItem.dateEndEpochTime
          ? dayjs(modelItem.dateEndEpochTime)
          : undefined,
      });
      setStartDate(new Date(modelItem.dateStartEpochTime));
      setEndDate(new Date(modelItem.dateEndEpochTime));
    } else {
      fetchGenerateCode();
    }
    setModal2Open(true);
  };

  const onFinish = async (values) => {
    try {
      debugger;
      var objectModel = {
        name: values.name,
        price: values.price,
        description: values.description,
        type: values.typeId,
        percentValue: values.percentValue,
        maxValue: values.maxValue,
        dateStart: dayjs(startDate).toISOString(),
        dateEnd: dayjs(endDate).toISOString(),
        quantity: values.quantity,
        couponAmount: values.couponAmount,
        status: 1,
        isDelete: 0,
        id: modelItem ? modelItem.id : null,
        code: values.code,
      };
      const { success, data } = await addOrChange(objectModel);
      if (data.status != "Error" && success) {
        setModal2Open(false);
        toast.success(data.message);
        fetchData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const handleChange = (value) => {
    console.log(`Selected: ${value}`);
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
          <Row gutter={[16, 10]}>
            <Col span={12}>
              <Form.Item
                label="Mã khuyến mại"
                name="code"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mã phiếu giảm giá!",
                  },
                ]}
              >
                <Input placeholder="" readOnly={true} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Tên phiếu giảm giá"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên phiếu giảm giá!",
                  },
                ]}
              >
                <Input placeholder="" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Loại khuyến mại"
                name="typeId"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn loại phiếu giảm giá!",
                  },
                ]}
              >
                <Select
                  placeholder=""
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    height: "40px",
                  }}
                >
                  <Option value={1}>Giảm phần trăm đơn hàng</Option>
                  <Option value={2}>Giảm tiền đơn hàng</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Giá trị"
                name="couponAmount"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số tiền phiếu giảm giá!",
                  },
                ]}
              >
                <Input placeholder="" type="number" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Giá trị tối thiểu"
                name="percentValue"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập giá trị tối thiểu!",
                  },
                ]}
              >
                <InputNumber
                  placeholder=""
                  type="number"
                  min={0}
                  style={{ width: "100%", height: "40px" }}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Giá trị tối đa"
                name="maxValue"
                rules={[
                  { required: true, message: "Vui lòng nhập giá trị tối đa!" },
                ]}
              >
                <InputNumber
                  placeholder=""
                  type="number"
                  min={0}
                  style={{ width: "100%", height: "40px" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Ngày bắt đầu"
                name="dateStart"
                rules={[
                  { required: true, message: "Please input date start!" },
                  { validator: checkStartDate },
                ]}
              >
                <DatePicker
                  showTime={{ format: "HH:mm:ss" }} // Enables time selection
                  onChange={handleSetStartDate}
                  placeholder={
                    startDate && format(startDate, "dd-MM-yyyy HH:mm:ss")
                  }
                  format={"DD-MM-YYYY HH:mm:ss"}
                  style={{ width: "100%", height: "40px" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Ngày kết thúc"
                name="dateEnd"
                rules={[
                  { validator: checkEndDate },
                  { required: true, message: "Please input date end!" },
                ]}
              >
                <DatePicker
                  showTime={{ format: "HH:mm:ss" }} // Enables time selection
                  onChange={handleSetEndDate}
                  placeholder={
                    endDate && format(endDate, "dd-MM-yyyy HH:mm:ss")
                  }
                  format={"DD-MM-YYYY HH:mm:ss"}
                  style={{ width: "100%", height: "40px" }}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Số lượng"
                name="quantity"
                rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
              >
                <InputNumber
                  placeholder=""
                  type="number"
                  min={0}
                  style={{ width: "100%", height: "40px" }}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Mô tả" name="description">
                <TextArea rows={5} placeholder="" type="text" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Thêm
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CouponAddOrChange;
