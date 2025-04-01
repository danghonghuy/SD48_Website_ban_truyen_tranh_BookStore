import { PlusSquareOutlined } from "@ant-design/icons";
import useDelivery from "@api/useDelivery";
import { Button, Col, Form, Input, Modal, Row, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { useToast } from "@utils/toastContext";

const DeliveryAddOrChange = ({ fetchData, modelItem, textButton, isStyle }) => {
  const [modal2Open, setModal2Open] = useState(false);
  const [form] = Form.useForm();

  const { addOrChange, generateCode } = useDelivery();
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
      const model = {
        code: values.code,
        name: values.name,
        description: values.description,
        status: 1,
        isDeleted: 0,
        id: modelItem ? modelItem.id : null,
        fee: values.fee,
        description: values.description,
      };
      const { success, data } = await addOrChange(model);
      if (data.status != "Error" && success) {
        setModal2Open(false);
        toastMsg(data.message, "success");
        fetchData();
      } else {
        toastMsg(data.message, "error");
      }
    } catch (error) {
      toastMsg(error, "error");
    }
  };

  const showModel = () => {
    if (modelItem) {
      form.setFieldsValue({
        code: modelItem.code,
        name: modelItem.name,
        description: modelItem.description,
        fee: modelItem.fee,
      });
    } else {
      fetchGenerateCode();
    }
    setModal2Open(true);
  };

  return (
    <>
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
          title={isStyle ? "Thêm mới" : "Cập nhật thông tin"}
          centered
          visible={modal2Open}
          onCancel={() => setModal2Open(false)}
          footer={null}
        >
          <Form
            form={form}
            onFinish={onFinish}
            onFinishFailed={null}
            initialValues={{ layout: "horizontal" }}
            layout="vertical"
          >
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item
                  label="Code"
                  name="code"
                  rules={[{ required: true, message: "" }]}
                >
                  <Input
                    placeholder="Delivery code auto generate"
                    readOnly={true}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item
                  label="Tên phương thức vận chuyển"
                  name="name"
                  rules={[{ required: true, message: "" }]}
                >
                  <Input placeholder="Please input type name" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item
                  label="Mô tả"
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "Please input type description!",
                    },
                  ]}
                >
                  <Input placeholder="Please input type description" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item
                  label="Cước"
                  name="fee"
                  rules={[
                    {
                      required: true,
                      message: "Please input type description!",
                    },
                  ]}
                >
                  <Input
                    type="number"
                    placeholder="Please input type description"
                  />
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

export default DeliveryAddOrChange;
