import { PlusSquareOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row, Select, DatePicker } from "antd";
import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Image, Upload } from "antd";
import useCategory from "@api/useCategory";
import useType from "@api/useType";
import useProduct from "@api/useProduct";
import { toast } from "react-toastify";
import { format } from "date-fns";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const AddProduct = ({ fetchData, modelItem, textButton, isStyle }) => {
  const { generateCode, addOrChange, getById } = useProduct();

  const [modal2Open, setModal2Open] = useState(false);
  const [form] = Form.useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const { getListCategory } = useCategory();
  const { getListType } = useType();
  const [category, setCategory] = useState([]);
  const [types, setType] = useState([]);
  const [datePublish, setDatePublish] = useState();
  const [datePublic, setDatePublic] = useState();

  const handleRemove = () => {
    console.log("delete");
  };

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
      status: 1,
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
    const { success, data } = await getListType({
      pageIndex: 1,
      pageSize: 20,
      status: 1,
    });
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

  const fetchById = async () => {
    const { success, data } = await getById(modelItem.id);
    if (data != null && success) {
      if (data.code === 200) {
        form.setFieldsValue({
          code: data.data.code,
          name: data.data.name,
          price: data.data.price,
          stock: data.data.stock,
          description: data.data.description,
          categoryId: data.data.categoryId,
          typeId: data.data.typeId,
          authorPublish: data.data.publisher,
          series: data.data.series,
          authorPublic: data.data.authorPublish,
          author: data.data.author,
        });
        setDatePublish(
          data.data.datePublish && new Date(data.data.datePublish)
        );
        setDatePublic(data.data.datePublic && new Date(data.data.datePublic));
        if (data.data.images && data.data.images.length > 0) {
          data.data.images.map((item) => {
            return handleConvert(item);
          });
        }
      } else {
        toast.error(data.message);
      }
    } else {
      toast.error(data.message);
    }
  };

  const handleConvert = async (url) => {
    try {
      setFileList([]);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch the file");
      }
      const blob = await response.blob();
      const fileName = url.split("/").pop(); // Extract the file name from the URL
      const fileType = blob.type; // Mime type of the file
      const file = new File([blob], "image.jpg", { type: fileType });
      setFileList((previewItems) => [
        ...previewItems,
        {
          uid: "-1", // Required: unique id for each file
          name: fileName,
          status: "done",
          url: URL.createObjectURL(file), // You can also use the object URL
          originFileObj: file, // Store the file object itself
        },
      ]);
    } catch (error) {
      console.error("Error converting URL to file:", error);
    }
  };

  const showModel = () => {
    setModal2Open(true);
    fetchCategory();
    fetchTypes();
    if (modelItem) {
      fetchById();
    } else {
      fetchGenerateCode();
    }
  };

  const [fileList, setFileList] = useState([]);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChangeFile = ({ fileList: newFileList }) => {
    newFileList.forEach((items) => (items.status = "done"));
    setFileList(newFileList);
  };

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  const onFinish = async (values) => {
    try {
      const formData = new FormData();

      var product = {
        typeId: values.typeId,
        categoryId: values.categoryId,
        name: values.name,
        price: values.price,
        stock: values.stock,
        description: values.description,
        code: values.code,
        datePublic: datePublic,
        authorPublish: values.authorPublic,
        publisher: values.authorPublish,
        author: values.author,
        series: values.series,
        datePublish: datePublish,
        id: modelItem && modelItem.id,
        status: 1,
      };
      var jsonObject = JSON.stringify(product);

      formData.append("productModel", JSON.stringify(product));
      fileList.forEach((file) => {
        formData.append(`files`, file.originFileObj);
      });
      const { success, data } = await addOrChange(formData, {
        "Content-Type": "multipart/form-data;",
      });
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
  const handleSetDatePublish = (date) => {
    setDatePublish(date.format());
  };
  const handleSetDatePublic = (date) => {
    setDatePublic(date.format());
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
                width: "100%",
              }
            : null
        }
        onClick={() => showModel()}
      >
        {textButton}
      </Button>

      <Modal
        width={"60%"}
        title="Thêm mới sản phẩm"
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
          <Row gutter={[5, 5]}>
            <Col span={12}>
              <Form.Item
                label="Mã sản phẩm"
                name="code"
                rules={[
                  { required: true, message: "Please input product code!" },
                ]}
              >
                <Input placeholder="" readOnly={true} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Tên truyện"
                name="name"
                rules={[
                  { required: true, message: "Please input product name!" },
                ]}
              >
                <Input placeholder="" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Danh mục"
                name="categoryId"
                rules={[{ required: true, message: "Please input category!" }]}
              >
                <Select
                  placeholder=""
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    height: "40px",
                  }}
                  options={category}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Loại sách"
                name="typeId"
                rules={[{ required: true, message: "Please input Origin" }]}
              >
                <Select
                  placeholder=""
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    height: "40px",
                  }}
                  options={types}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Tác giả"
                name="author"
                rules={[
                  { required: true, message: "Please input product price!" },
                ]}
              >
                <Input placeholder="" type="text" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Nhà xuất bản"
                name="authorPublish"
                rules={[
                  { required: true, message: "Please input product quantity!" },
                ]}
              >
                <Input placeholder="" type="text" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Series"
                name="series"
                rules={[
                  { required: true, message: "Please input product price!" },
                ]}
              >
                <Input placeholder="" type="text" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Nhà phát hành"
                name="authorPublic"
                rules={[
                  { required: true, message: "Please input product quantity!" },
                ]}
              >
                <Input placeholder="" type="text" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Ngày xuất bản" name="datePublish">
                <DatePicker
                  onChange={handleSetDatePublish}
                  placeholder={datePublish && format(datePublish, "dd-MM-yyyy")}
                  style={{ width: "100%", height: "40px" }}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Ngày phát hành"
                name="datePublic"
                rules={[
                  { required: true, message: "Please input product quantity!" },
                ]}
              >
                <DatePicker
                  onChange={handleSetDatePublic}
                  placeholder={datePublic && format(datePublic, "dd-MM-yyyy")}
                  style={{ width: "100%", height: "40px" }}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Giá sản phẩm"
                name="price"
                rules={[
                  { required: true, message: "Please input product price!" },
                ]}
              >
                <Input placeholder="Price" type="text" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Số lượng"
                name="stock"
                rules={[
                  { required: true, message: "Please input product quantity!" },
                ]}
              >
                <Input placeholder="Quantity" type="text" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label="Mô tả"
                name="description"
                rules={[
                  {
                    required: false,
                    message: "Please input product description!",
                  },
                ]}
              >
                <Input.TextArea placeholder="Description" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Hình ảnh"
                name="listFileImg"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) {
                    var elist = [];
                    console.log(e.fileList);
                    e.fileList.forEach((element) => {
                      elist.push(element.originFileObj);
                    });
                  }
                  return elist;
                }}
              >
                <Upload
                  listType="picture-card"
                  name="listFileImg"
                  fileList={fileList}
                  onRemove={() => {
                    handleRemove();
                  }}
                  onPreview={handlePreview}
                  onChange={handleChangeFile}
                >
                  {fileList.length < 0 ? null : uploadButton}
                </Upload>
                {previewImage && (
                  <Image
                    wrapperStyle={{
                      display: "none",
                    }}
                    preview={{
                      visible: previewOpen,
                      onVisibleChange: (visible) => setPreviewOpen(visible),
                      afterOpenChange: (visible) =>
                        !visible && setPreviewImage(""),
                    }}
                    src={previewImage}
                  />
                )}
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

export default AddProduct;
