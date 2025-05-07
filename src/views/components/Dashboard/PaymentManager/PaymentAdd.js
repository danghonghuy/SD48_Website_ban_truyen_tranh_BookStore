import { PlusSquareOutlined } from "@ant-design/icons";
import usePayment from "@api/usePayment";
import { Button, Col, Form, Input, Modal, Row, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useToast } from "@utils/toastContext";

const PaymentAdd = ({ fetchData, modelItem, textButton, isStyle }) => {
  const [modal2Open, setModal2Open] = useState(false);
  const [form] = Form.useForm();
  const { generateCode, addOrChange } = usePayment();
  const { toastMsg } = useToast();

  const fetchGenerateCode = async () => {
    const { success, data } = await generateCode();
    if (!success || data.status == "Error") {
      toastMsg(data.message, "error");
    } else {
      form.setFieldsValue({ code: data.data });
    }
  };

  const onFinish = async (values) => {
    try {
      const branch = {
        name: values.name,
        code: values.code,
        id: modelItem != null ? modelItem.id : null,
        status: 1,
      };
      const { success, data } = await addOrChange(branch);
      console.log(success, data);

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

  const showModel = () => {
    if (modelItem) {
      form.setFieldsValue({
        code: modelItem.code,
        name: modelItem.name,
        description: modelItem.description,
      });
    } else {
      fetchGenerateCode();
    }
    setModal2Open(true);
  };
  const onFinishFailed = () => {};

  return (
    <>
      {" "}
      <div>
        <Button
          type={isStyle ? "primary" : "button"}
          value="large"
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
          {" "}
          {textButton}
        </Button>

        <Modal
          title={isStyle ? "Thêm mới" : "Cập nhật thông tin"}
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
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item
                  label="Mã"
                  name="code"
                  rules={[
                    { required: true, message: "Please input category code!" },
                  ]}
                >
                  <Input
                    placeholder="Type code auto generate"
                    readOnly="true"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item
                  label="Tên"
                  name="name"
                  rules={[
                    { required: true, message: "Please input role name!" },
                  ]}
                >
                  <Input placeholder="Please input role name" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default PaymentAdd;
