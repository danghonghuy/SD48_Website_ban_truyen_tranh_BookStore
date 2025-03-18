import { PlusSquareOutlined } from "@ant-design/icons";
import useType from "@api/useType";
import { Button, Col, Form, Input, Modal, Row, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { useToast } from "@utils/toastContext";


const ProductTypeAdd = ({fetchData, modelItem, textButton, isStyle}) => {

  const [modal2Open, setModal2Open] = useState(false);
  const [form] = Form.useForm()

  const { addOrChange, generateCode } = useType()
  const { toastMsg } = useToast();

  const fetchGenerateCode = async () => {
    const { success, data } = await generateCode();
    if (!success || data.status == 'Error') {
      toastMsg(data.message, "error");
    } else {
      form.setFieldsValue({ code: data.data })
    }
  }
  
  const onFinish = async (values) => {
    try {
      const model = {
        code: values.code, 
        name: values.name, 
        description: values.description, 
        status: 1, 
        isDeleted: 0, 
        id: modelItem ? modelItem.id : null
      }
      const { success, data } = await addOrChange(model)
      if (data.status != 'Error' && success) {
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
    if(modelItem){
      form.setFieldsValue({ code: modelItem.code, name: modelItem.name, description: modelItem.description });
    }else{
      fetchGenerateCode();
    }
    setModal2Open(true); 
  }

  return (<>
    <div>
      <Button
        type= {isStyle ? "primary" : "button"}
        value="small"
        style={ isStyle ? {
          alignItems: "center",
          background: "#1fbf39",
          marginBottom: "20px",
        } : null}
        onClick={() => showModel()}
      >
        {isStyle &&  <PlusSquareOutlined />} {textButton}
      </Button>

      <Modal
        width={'50%'}
        title= {isStyle ?  "Thêm mới kiểu sản phẩm" : "Cập nhật thông tin"}
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
            <Col span={16}>
              <Form.Item
                label="Code"
                name="code"
                rules={[{ required: true, message: "Please input category code!" }]}
              >
                <Input placeholder="Type code auto generate" readOnly={true} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={16}>
              <Form.Item
                label="Kiểu sản phẩm"
                name="name"
                rules={[{ required: true, message: "Please input type name!" }]}
              >
                <Input placeholder="Please input type name"/>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={16}>
              <Form.Item
                label="Mô tả"
                name="description"
                rules={[{ required: true, message: "Please input type description!" }]}
              >
                <Input placeholder="Please input type description" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div></>);
}

export default ProductTypeAdd;
