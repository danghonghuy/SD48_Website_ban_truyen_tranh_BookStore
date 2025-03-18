import { PlusSquareOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useToast } from "@utils/toastContext";
import useCatalog from "../../../../api/useCatalog";

const CatalogAddOrChange = ({fechtList}) =>  {

    const [modal2Open, setModal2Open] = useState(false);
    const [form] = Form.useForm()
    const {generateCode, addOrChange} = useCatalog()
    const { toastMsg } = useToast();

    const fetchGenerateCode = async () => {
      const { success, data } = await generateCode();
      if (!success || data.status == 'Error') {
        toastMsg(data.message, "error");
      } else {
        form.setFieldsValue({ code: data.data })
      }
    };
    const onFinish = async (values) => {
        try {
            const models = {
              code: values.code,
              name: values.name, 
              description: values.description, 
              status: 1, 
              isDeleted: 0
            }
           const {success,data}  = await addOrChange(models)
            console.log(success,data);
           
            if (data.status != 'Error' && success) {
                setModal2Open(false);
                toast.success(data.message);
                fechtList();
            } else {
                toast.error(data.message)
            }
        } catch (error) {
          toast.error(error)
        }
      };
      const showModel = () => {
        setModal2Open(true); 
        fetchGenerateCode();
      };
      const onFinishFailed = () => {};
    return ( <>  <div>
        <Button
          type="primary"
          value="large"
          style={{
            alignItems: "center",
            background: "#1fbf39",
            marginBottom: "20px",
          }}
          onClick={() => showModel()}
        >
          <PlusSquareOutlined /> Thêm mới
        </Button>
  
        <Modal
          width={'50%'}
          title="Thêm mới danh mục"
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
              <Col span={16}>
                <Form.Item
                  label="Code"
                  name="code"
                  rules={[{ required: true, message: "Please input category code!" }]}
                >
                  <Input placeholder="Category code auto generate" readOnly="true" />
                </Form.Item>
              </Col>      
            </Row>

            <Row gutter={[16, 16]}>
            <Col span={16}>
                <Form.Item
                  label="Tên danh mục"
                  name="name"
                  rules={[{ required: true, message: "Please input category name!" }]}
                >
                  <Input placeholder="Please input category name" />
                </Form.Item>
              </Col>      
            </Row>

            <Row gutter={[16, 16]}>
            <Col span={16}>
                <Form.Item
                  label="Mô tả"
                  name="description"
                  rules={[{ required: true, message: "Please input category description!" }]}
                >
                  <Input placeholder="Please input category description" />
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
      </div></>  );
}

export default CatalogAddOrChange;
