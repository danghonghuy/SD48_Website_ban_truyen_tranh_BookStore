import {
  PlusSquareOutlined,
  PlusOutlined,
  StarOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Image,
  Upload,
  DatePicker,
} from "antd";
import React, { useEffect, useState } from "react";
import useUser from "@api/useUser";
import { toast } from "react-toastify";
import useAddress from "@api/useAddress";
import { Option } from "antd/es/mentions";
import TextArea from "antd/es/input/TextArea";
import { EyeClosed, Trash2, Star, Eye } from "lucide-react";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const UserAddOrChange = ({ fetchData, modelItem, textButton, isStyle }) => {
  const [modal2Open, setModal2Open] = useState(false);
  const [form] = Form.useForm();
  const { addOrChange, generateCode, getUserById } = useUser();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [province, setProvince] = useState([]);
  const { getProvince, getDistrict, getWard } = useAddress();
  const [provinceId, setProvinceId] = useState(null);
  const [districtId, setDistrictId] = useState(null);
  const [wardId, setWardId] = useState(null);
  const [roles, setListRole] = useState([]);
  const [birthDate, setBirthDate] = useState();

  const handleRemove = () => {
    console.log("delete");
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
  const [address, setListAddress] = useState([
    {
      id: null,
      provinceId: null,
      districtId: null,
      wardId: null,
      addressDetail: null,
      provinceName: null,
      districtName: null,
      wardName: null,
      stage: 1,
      addressDetail: "",
      isDefault: 1,
      districts: [],
      wards: [],
    },
  ]);
  const addAddressModel = () => {
    setListAddress([
      ...address,
      {
        id: null,
        provinceId: null,
        districtId: null,
        wardId: null,
        addressDetail: null,
        provinceName: null,
        districtName: null,
        wardName: null,
        stage: 1,
        addressDetail: "",
        isDefault: 0,
        districts: [],
        wards: [],
      },
    ]);
  };

  const handleSelectedChange = (e, index, name) => {
    if (name == "provinceId") {
      fetchDistrict(e, index);
    } else if (name == "districtId") {
      fetchWard(e, index);
    } else {
      const updatedForms = [...address];
      var wardName =
        updatedForms[index].wards.find((item) => item.code === e).name ?? "";
      updatedForms[index] = {
        ...updatedForms[index],
        [name]: e,
        wardName: wardName,
      };
      setListAddress(updatedForms);
    }
  };

  const fetchGenerateCode = async () => {
    var request = {
      prefix: "CUS",
    };
    const { success, data } = await generateCode(request);
    if (!success || data.status === "Error") {
      toast.error(data.message);
    } else {
      form.setFieldsValue({ code: data.data });
    }
  };

  const fetchUserById = async () => {
    const { success, data } = await getUserById(modelItem.id);
    if (!success || data.status === "Error") {
      toast.error(data.message);
    } else {
      form.setFieldsValue({
        code: data.data.code,
        fullName: data.data.fullName,
        phoneNumber: data.data.phoneNumber,
        email: data.data.email,
        description: data.data.description,
        userName: data.data.userName,
        desciption: data.data.description,
        roleId: data.data.roleId,
        addressDetail: data.data.addressDetail,
        gender: data.data.gender,
      });
      if (data.data.dateBirth) {
        setBirthDate(new Date(data.data.dateBirth));
      }
      setGender(data.data.gender ? "male" : "female");
      if (data.data.address) {
        setListAddress([]);
        const updatedItems = (data.data.address ?? []).map((item) => ({
          ...item,
          visiable: true,
        }));
        setListAddress(updatedItems);
      }
      if (data.data.imageUrl) {
        handleConvert(data.data.imageUrl);
      }
    }
  };

  const fetchProvince = async () => {
    var request = {
      name: null,
    };
    const { success, data } = await getProvince(request);
    if (!success || data.status == "Error") {
      toast.error(data.message);
    } else {
      setProvince(data.data);
    }
  };

  const fetchDistrict = async (provinceId, index) => {
    var request = {
      code: provinceId,
      name: null,
    };
    const { success, data } = await getDistrict(request);
    if (!success || data.status == "Error") {
      toast.error(data.message);
    } else {
      const updatedForms = [...address];
      debugger;
      var name = province.find((e) => e.code === provinceId).name ?? "";
      updatedForms[index] = {
        ...updatedForms[index],
        districts: data.data,
        provinceId: provinceId,
        districtName: null,
        wardName: null,
        provinceName: name,
      };
      setListAddress(updatedForms);
    }
  };

  const fetchWard = async (districtId, index) => {
    var request = {
      code: districtId,
      name: null,
    };
    const { success, data } = await getWard(request);
    if (!success || data.status == "Error") {
      toast.error(data.message);
    } else {
      const updatedForms = [...address];
      var name =
        updatedForms[index].districts.find((e) => e.code === districtId).name ??
        "";
      updatedForms[index] = {
        ...updatedForms[index],
        wards: data.data,
        districtId: districtId,
        wardName: null,
        districtName: name,
        wardId: 0,
      };
      setListAddress(updatedForms);
    }
  };

  const handleSetBirthDate = (date) => {
    setBirthDate(date.format());
  };

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      const addressModel = address.map((e) => {
        return {
          provinceId: e.provinceId,
          districtId: e.districtId,
          wardId: e.wardId,
          addressDetail: e.addressDetail,
          stage: e.stage,
          provinceName: e.provinceName,
          districtName: e.districtName,
          wardName: e.wardName,
          id: e.id,
        };
      });
      const model = {
        code: values.code,
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        email: values.email,
        dateBirth: birthDate,
        userName: values.userName,
        gender: gender === "male" ? true : false,
        address: addressModel,
        roleId: 5,
        description: values.description,
        status: 1,
        id: modelItem ? modelItem.id : null,
      };
      formData.append("model", JSON.stringify(model));
      fileList.forEach((file) => {
        formData.append(`files`, file.originFileObj);
      });
      const { success, data } = await addOrChange(formData, {
        "Content-Type": "multipart/form-data",
      });
      if (data.status != "Error" && success) {
        setModal2Open(false);
        toast.success(data.message);
        fetchData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("loi");
    }
  };

  const [gender, setGender] = useState("");
  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const addressDefaultChange = (e, index) => {
    e.preventDefault();
    debugger;
    const addressModel = [...address];
    const addressUpdate = addressModel.map((model) =>
      model.isDefault === 1 ? { ...model, isDefault: 0 } : model
    );
    setListAddress(
      addressUpdate.map((model, i) => {
        if (i === index) {
          return { ...model, isDefault: 1 };
        }
        return model;
      })
    );
  };

  const onHandleDeleteAddress = (index) => {
    const addressChange = [...address];
    setListAddress(
      addressChange.map((model, i) => {
        if (i === index) {
          return { ...model, stage: -1 };
        }
        return model;
      })
    );
  };
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  const [fileList, setFileList] = useState([]);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
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
  const handleChangeFile = ({ fileList: newFileList }) => {
    newFileList.forEach((items) => (items.status = "done"));
    setFileList(newFileList);
  };
  const handleOpenModal = () => {
    if (modelItem) {
      fetchUserById();
    } else {
      fetchGenerateCode();
    }
    setModal2Open(true);
    fetchProvince();
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    // Update the form at the specific index
    const updatedForms = [...address];
    const addressModel = updatedForms.filter(
      (e) =>
        e.provinceId === updatedForms[index].provinceId &&
        updatedForms[index].provinceId.length > 0 &&
        e.districtId === updatedForms[index].districtId &&
        updatedForms[index].districtId.length > 0 &&
        e.wardId === updatedForms[index].wardId &&
        updatedForms[index].wardId > 0 &&
        e.addressDetail === value &&
        e.addressDetail.length > 0
    );
    if (addressModel && addressModel.length === 0) {
      updatedForms[index] = { ...updatedForms[index], addressDetail: value };
      setListAddress(updatedForms);
    } else {
      toast.error("Address already exist");
    }
  };

  return (
    <div>
      <Button
        type={"primary"}
        value="small"
        style={{
          alignItems: "center",
          background: "#1fbf39",
        }}
        onClick={() => handleOpenModal()}
      >
        {textButton}
      </Button>

      <Modal
        width={"65%"}
        title="Thêm mới người dùng"
        centered
        visible={modal2Open}
        onCancel={() => setModal2Open(false)}
        footer={null}
        style={{
          content: {
            width: "60%",
            height: "200px",
            overflowY: "auto",
            margin: "auto",
            padding: "20px",
          },
        }}
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
          <br />
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <span
                class="hide-menu"
                style={{ fontSize: "13px", color: "black", fontWeight: "bold" }}
              >
                Thông tin khách hàng
              </span>
            </Col>
          </Row>
          <br />

          <Row gutter={[16, 16]}>
            <Col span={12} style={{ textAlign: "center" }}>
              <Form.Item
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
                  {" "}
                  {fileList.length > 1 ? null : uploadButton}
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
            <Col span={12}>
              <Form.Item
                label="Mã người dùng"
                name="code"
                rules={[{ required: true, message: "" }]}
              >
                <Input
                  placeholder=""
                  type="text"
                  readOnly={true}
                  disabled={true}
                />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  {
                    type: "email",
                    message: "Vui lòng nhập đúng định dạng email",
                  },
                ]}
              >
                <Input placeholder="" type="text" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label="Họ tên khách hàng"
                name="fullName"
                rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
              >
                <Input placeholder="" type="text" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Số điện thoại khách hàng"
                name="phoneNumber"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại" },
                  {
                    type: "regexp",
                    pattern: new RegExp(/\d+/g),
                    message: "Vui lòng nhập đúng định dạng số điện thoại",
                  },
                ]}
              >
                <Input placeholder="" type="text" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label="Username"
                name="userName"
                rules={[{ required: true, message: "Vui lòng nhập username" }]}
              >
                <Input placeholder="" type="text" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Ngày sinh">
                <DatePicker
                  onChange={handleSetBirthDate}
                  style={{ width: "100%", height: "40px" }}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Mô tả"
                name="description"
                rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
              >
                <TextArea
                  rows={3}
                  placeholder="Enter description"
                  type="text"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item
                label="Giới tính"
                name="gender"
                rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
              >
                <div>
                  <label style={{ paddingRight: "40px" }}>
                    <input
                      type="radio"
                      value="male"
                      checked={gender === "male"}
                      onChange={handleGenderChange}
                      style={{ paddingRight: "15px" }}
                    />
                    Male
                  </label>
                  <label style={{ paddingRight: "40px" }}>
                    <input
                      type="radio"
                      value="female"
                      checked={gender === "female"}
                      onChange={handleGenderChange}
                      style={{ paddingRight: "15px" }}
                    />
                    Female
                  </label>
                  <label style={{ paddingRight: "40px" }}>
                    <input
                      type="radio"
                      value="other"
                      checked={gender === "other"}
                      onChange={handleGenderChange}
                      style={{ paddingRight: "15px" }}
                    />
                    Khác
                  </label>
                </div>
              </Form.Item>
            </Col>
          </Row>

          <br />
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <span
                class="hide-menu"
                style={{ fontSize: "13px", color: "black", fontWeight: "bold" }}
              >
                Địa chỉ khách hàng
              </span>
            </Col>
            <Col span={16} style={{ textAlign: "right" }}>
              <Button
                type="primary"
                value="small"
                style={{
                  alignItems: "center",
                  background: "#1fbf39",
                  marginBottom: "20px",
                }}
                onClick={() => addAddressModel()}
              >
                <PlusSquareOutlined /> Thêm địa chỉ
              </Button>
            </Col>
          </Row>
          <br />
          {address &&
            address.map(
              (item, index) =>
                item.stage === 1 && (
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <span
                        class="hide-menu"
                        style={{
                          fontSize: "13px",
                          color: "black",
                          fontWeight: "bold",
                        }}
                      >
                        Địa chỉ: {index + 1}
                      </span>
                    </Col>

                    <Col span={12} style={{ textAlign: "right" }}>
                      <Button
                        onClick={(e) => addressDefaultChange(e, index)}
                        style={{ border: "0px" }}
                      >
                        <Star
                          size={22}
                          stroke={"black"}
                          fill={item.isDefault === 1 ? "orange" : "transparent"}
                        />
                      </Button>
                      <Button
                        onClick={() => onHandleDeleteAddress(index)}
                        style={{ border: "0px" }}
                      >
                        <Trash2 size={22} />
                      </Button>
                    </Col>

                    <Col span={8}>
                      <Form.Item
                        label="Tỉnh/Thành phố"
                        rules={[
                          { required: true, message: "Please select province" },
                        ]}
                      >
                        <Select
                          placeholder={
                            item.provinceName
                              ? item.provinceName
                              : "Please select"
                          }
                          onChange={(e) =>
                            handleSelectedChange(e, index, "provinceId")
                          }
                          style={{
                            width: "100%",
                            height: "40px",
                          }}
                        >
                          <Option value={0}>Chọn Tỉnh/Thành phố</Option>
                          {province &&
                            province.map((e) => {
                              return <Option value={e.code}>{e.name}</Option>;
                            })}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item
                        label="Quận/Huyện"
                        rules={[
                          { required: true, message: "Please select district" },
                        ]}
                      >
                        <Select
                          placeholder={
                            item.districtName
                              ? item.districtName
                              : "Please select"
                          }
                          onChange={(e) =>
                            handleSelectedChange(e, index, "districtId")
                          }
                          style={{
                            width: "100%",
                            height: "40px",
                          }}
                        >
                          <Option value={0}>Chọn Tỉnh/Thành phố</Option>
                          {item.districts &&
                            item.districts.map((e) => {
                              return <Option value={e.code}>{e.name}</Option>;
                            })}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item
                        label="Xã/Phường"
                        rules={[
                          { required: true, message: "Please select wards" },
                        ]}
                      >
                        <Select
                          className=""
                          placeholder={
                            item.wardName ? item.wardName : "Please select"
                          }
                          onChange={(e) =>
                            handleSelectedChange(e, index, "wardId")
                          }
                          style={{
                            width: "100%",
                            color: "black",
                            height: "40px",
                          }}
                        >
                          <Option value={0}>Chọn Tỉnh/Thành phố</Option>
                          {item.wards &&
                            item.wards.map((e) => {
                              return <Option value={e.code}>{e.name}</Option>;
                            })}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Form.Item
                        label="Địa chỉ chi tiết"
                        rules={[{ required: true, message: "" }]}
                      >
                        <Input
                          placeholder=""
                          type="text"
                          onChange={(e) => handleInputChange(e, index)}
                          value={item.addressDetail}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                )
            )}
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

export default UserAddOrChange;
