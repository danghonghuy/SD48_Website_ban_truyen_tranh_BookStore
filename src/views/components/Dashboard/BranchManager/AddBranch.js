import { PlusSquareOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useCategory from "@api/useCategory";
import { useToast } from "@utils/toastContext";
import useCatalog from "@api/useCatalog";

const AddBranch = ({ fechtList, modelItem, textButton }) => {
  const [modal2Open, setModal2Open] = useState(false);
  const [form] = Form.useForm();
  const { generateCode, addOrChange } = useCategory();
  const { toastMsg } = useToast();
  const { getList } = useCatalog();
  const [catelogs, setCatalog] = useState([]);

  const fetchGenerateCode = async () => {
    const { success, data } = await generateCode();
    if (!success || data.status == "Error") {
      toastMsg(data.message, "error");
    } else {
      form.setFieldsValue({ code: data.data });
    }
  };

  const fetchCatalog = async () => {
    const { success, data } = await getList({
      pageIndex: 1,
      pageSize: 20,
      status: 1,
    });
    if (data != null && success) {
      var dataResults = data.data.map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
      setCatalog(dataResults);
    }
  };

  const onFinish = async (values) => {
    try {
      const models = {
        code: values.code,
        name: values.name,
        description: values.description,
        status: 1,
        isDeleted: 0,
        catalogId: values.catalogId,
        id: modelItem && modelItem.id,
      };
      const { success, data } = await addOrChange(models);
      console.log(success, data);

      if (data.status != "Error" && success) {
        setModal2Open(false);
        toast.success(data.message);
        fechtList();
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
        catalogId: modelItem.catalogId,
        name: modelItem.name,
        description: modelItem.description,
      });
    } else {
      fetchGenerateCode();
    }
    setModal2Open(true);
    fetchCatalog();
  };
  const onFinishFailed = () => {};
  return (
    <>
      {" "}
      <div style={{ display: "inline-block" }}>
        <Button
          type="primary"
          value="large"
          style={{
            alignItems: "center",
            background: "#1fbf39",
          }}
          onClick={() => showModel()}
        >
          {textButton}
        </Button>

        <Modal
          title="Thêm mới thể loại truyện"
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
                  label="Mã thể loại"
                  name="code"
                  rules={[
                    { required: true, message: "Vui lòng nhập mã thể loại!" },
                  ]}
                >
                  <Input
                    placeholder="Category code auto generate"
                    readOnly="true"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item
                  label="Danh mục"
                  name="catalogId"
                  rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
                >
                  <Select
                    placeholder="Chọn danh mục"
                    onChange={null}
                    style={{
                      width: "100%",
                    }}
                    options={catelogs}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item
                  label="Tên thể loại"
                  name="name"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên thể loại!" },
                  ]}
                >
                  <Input placeholder="Nhập tên thể loại" />
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
                      message: "Vui lòng nhập mô tả thể loại!",
                    },
                  ]}
                >
                  <Input placeholder="Nhập mô tả thể loại" />
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
    </>
  );
};

export default AddBranch;
