import { PlusSquareOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import useCategory from "@api/useCategory";
import useType from "@api/useType";
import { toast } from "react-toastify";
import useCoupon from "@api/useCoupons";
import { Option } from 'antd/es/mentions';
import TextArea from "antd/es/input/TextArea";

const CouponAddOrChange = ({ fetchData, modelItem, textButton, isStyle }) => {

  const { generateCode, addOrChange } = useCoupon();

  const [modal2Open, setModal2Open] = useState(false);
  const [form] = Form.useForm();


  const { getListCategory } = useCategory()
  const { getListType } = useType()
  const [category, setCategory] = useState([])
  const [types, setType] = useState([])

  const fetchGenerateCode = async () => {
    const { success, data } = await generateCode();
    if (data != null && success) {
      form.setFieldsValue({ code: data.data });
    }
  }

  const fetchCategory = async () => {
    const { success, data } = await getListCategory({ pageIndex: 1, pageSize: 20 });
    if (data != null && success) {
      var dataCategory = data.data.map((item) => {
        return {
          value: item.id,
          label: item.name
        }
      });
      setCategory(dataCategory)
    }
  }

  const fetchTypes = async () => {
    const { success, data } = await getListType({ pageIndex: 1, pageSize: 20 });
    if (data != null && success) {
      var dataOrigin = data.data.map((item) => {
        return {
          value: item.id,
          label: item.name
        }
      });
      setType(dataOrigin)
    }
  }


  const showModel = () => {
    
    if(modelItem){
      form.setFieldsValue({code: modelItem.code, name: modelItem.name, description: modelItem.description });
    }else{
    fetchGenerateCode();
    }
    setModal2Open(true);
    fetchCategory();
    fetchTypes();
  }

  const onFinish = async (values) => {
    try {
      var objectModel = {
        name: values.name,
        price: values.price,
        description: values.description,
        type: values.typeId,
        minValue: values.minValue,
        maxValue: values.maxValue,
        dateStart: values.dateStart,
        dateEnd: values.dateEnd ,
        quantity: values.quantity,
        couponAmount: values.couponAmount, 
        status: 1, 
        isDelete: 0, 
        id: modelItem ? modelItem.id : null, 
        code: values.code
      }
      const { success, data } = await addOrChange(objectModel);
      if (data.status != 'Error' && success) {
        setModal2Open(false);
        toast.success(data.message);
        fetchData();
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error)
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const handleChange = (value) => {
    console.log(`Selected: ${value}`);
  };
  return (
    <div>
      <Button
        type={isStyle ? "primary" : "button"}
        value="small"
        style={isStyle ? {
          alignItems: "center",
          background: "#1fbf39",
          marginBottom: "20px",
        } : null}
        onClick={() => showModel()}
      >
        {isStyle && <PlusSquareOutlined />} {textButton}
      </Button>

      <Modal
        width={'60%'}
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
          <Row gutter={[16, 10]} >

            <Col span={12}>
              <Form.Item
                label="Mã khuyến mại"
                name="code"
                rules={[{ required: true, message: "Please input Coupon code!" }]}
              >
                <Input placeholder="" readOnly={true} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Tên khuyến mại"
                name="name"
                rules={[{ required: true, message: "Please input Coupon name!" }]}
              >
                <Input placeholder="" />
              </Form.Item>
            </Col>


            <Col span={12}>
              <Form.Item
                label="Loại khuyến mại"
                name="typeId"
                rules={[{ required: true, message: "Please select coupon!" }]}
              >
                <Select
                  placeholder=""
                  onChange={handleChange}
                  style={{
                    width: '100%'
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
                rules={[{ required: true, message: "Please input Coupon amount!" }]}
              >
                <Input placeholder="" type="number" />
              </Form.Item>
            </Col>


            <Col span={12}>
              <Form.Item
                label="Giá trị tối thiểu"
                name="minValue"
                rules={[{ required: true, message: "Please input min value!" }]}
              >
                <Input placeholder="" type="number" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Giá trị tối đa"
                name="maxValue"
                rules={[
                  { required: true, message: "Please input max value!" },
                ]}
              >
                <Input placeholder="" type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Ngày bắt đầu"
                name="dateStart"
                rules={[{ required: true, message: "Please input start date!" }]}
              >
                <Input placeholder="" type="date" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Ngày kết thúc"
                name="dateEnd"
                rules={[
                  { required: true, message: "Please input end date!" },
                ]}
              >
                <Input placeholder="" type="date" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Số lượng"
                name="quantity"
                rules={[{ required: true, message: "Please input quantity!" }]}
              >
                <Input placeholder="" type="number" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Mô tả"
                name="description"
              >
                <TextArea rows={5} placeholder="" type="text" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit" >
              Lưu thông tin
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CouponAddOrChange;
