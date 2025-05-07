import { PlusSquareOutlined, PlusOutlined } from "@ant-design/icons";
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
import useRole from "@api/useRole";
import { format } from "date-fns";
import dayjs from "dayjs";
import { ROLE_OPTIONS } from "@constants/roleConstant";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const EmployeeAddOrChange = ({ fetchData, modelItem, textButton, isStyle }) => {
  const [modal2Open, setModal2Open] = useState(false);
  const [form] = Form.useForm();
  const { addOrChange, generateCode, getUserById } = useUser();
  const { getListRole } = useRole();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [province, setProvince] = useState([]);
  const [district, setDistrict] = useState([]);
  const [ward, setWard] = useState([]);
  const { getProvince, getDistrict, getWard } = useAddress();
  const [provinceId, setProvinceId] = useState(null);
  const [districtId, setDistrictId] = useState(null);
  const [wardId, setWardId] = useState(null);
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
      stage: 0,
      addressDetail: "",
    },
  ]);
  const [roles, setListRole] = useState([]);
  const [birthDate, setBirthDate] = useState();

  const fetchGenerateCode = async () => {
    var request = {
      prefix: "EMP",
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
        birthDate: dayjs(data.data.dateBirth),
      });
      if (data.data.dateBirth) {
        setBirthDate(new Date(data.data.dateBirth));
      }
      setGender(data.data.gender ? "Nam" : "Nữ");
      if (data.data.address) {
        setProvinceId(data.data.address[0].provinceId);
        fetchDistrict(data.data.address[0].provinceId);
        setDistrictId(data.data.address[0].districtId);
        fetchWard(data.data.address[0].districtId);
        setWard(data.data.address[0].wardId);
        form.setFieldsValue({
          wardId: data.data.address[0].wardId,
          districtId: data.data.address[0].districtId,
          provinceId: data.data.address[0].provinceId,
          addressDetail: data.data.address[0].addressDetail,
        });
      }
      if (data.data.imageUrl) {
        handleConvert(data.data.imageUrl);
      }
    }
  };

  const fetchGetListRole = async () => {
    // const { success, data } = await getListRole({ pageIndex: 1, pageSize: 10 });
    // if (!success || data.status == "Error") {
    //   toast.error(data.message);
    // } else {
    //   var result = data.data.map((item) => {
    //     return {
    //       value: item.id,
    //       label: item.name,
    //     };
    //   });
    // }
    setListRole(ROLE_OPTIONS);
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

  const fetchDistrict = async (provinceId) => {
    setDistrictId(0);
    var request = {
      code: provinceId,
      name: null,
    };
    const { success, data } = await getDistrict(request);
    if (!success || data.status == "Error") {
      toast.error(data.message);
    } else {
      setDistrict(data.data);
    }
  };

  const fetchWard = async (districtId) => {
    setWardId(0);
    var request = {
      code: districtId,
      name: null,
    };
    const { success, data } = await getWard(request);
    if (!success || data.status == "Error") {
      toast.error(data.message);
    } else {
      setWard(data.data);
    }
  };

  const handleSelectProvince = (e) => {
    setProvinceId(e);
    fetchDistrict(e);
    const addressModel = [...address];
    addressModel[0] = {
      ...addressModel[0],
      provinceId: e,
      districtId: 0,
      wardId: 0,
    };
    setListAddress(addressModel);
  };

  const handleSelectDistrict = (e) => {
    setDistrictId(e);
    fetchWard(e);
    const addressModel = [...address];
    addressModel[0] = { ...addressModel[0], districtId: e, wardId: 0 };
    setListAddress(addressModel);
  };

  const handleSelectWard = (e) => {
    setWardId(e);
    const addressModel = [...address];
    addressModel[0] = { ...addressModel[0], wardId: e };
    setListAddress(addressModel);
  };

  const handleRemove = () => {
    console.log("delete");
  };

  const handleSetBirthDate = (date) => {
    setBirthDate(date.format());
  };

  const checkBirthDate = (_, value) => {
    if (value && dayjs().diff(value, "years") < 18) {
      return Promise.reject("Bạn phải trên 18 tuổi");
    }
    return Promise.resolve();
  };

  const onFinish = async (values) => {
    try {
      const addressModel = address.map((e) => {
        return {
          provinceId: e.provinceId,
          districtId: e.districtId,
          wardId: e.wardId,
          addressDetail: e.addressDetail,
          stage: 1,
          provinceName: e.provinceName,
          districtName: e.districtName,
          wardName: e.wardName,
          id: e.id,
        };
      });
      const formData = new FormData();
      const model = {
        code: values.code,
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        email: values.email,
        dateBirth: birthDate,
        userName: values.userName,
        gender: gender === "Nam" ? true : false,
        address: addressModel,
        roleId: values.roleId,
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

  const handleChangeAddress = (e) => {
    const addressModel = [...address];
    addressModel[0] = { ...addressModel[0], addressDetail: e.target.value };
    setListAddress(addressModel);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const handleOpenModal = () => {
    if (modelItem) {
      fetchUserById();
    } else {
      fetchGenerateCode();
    }
    setModal2Open(true);
    fetchProvince();
    fetchGetListRole();
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
        title={modelItem ? "Cập nhật nhân viên" : "Thêm mới nhân viên"}
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
                Thông tin nhân viên
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
                label="Mã nhân viên"
                name="code"
                rules={[
                  { required: true, message: "Vui lòng nhập mã nhân viên" },
                ]}
              >
                <Input placeholder="" type="text" readOnly={true} />
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
                label="Họ tên nhân viên"
                name="fullName"
                rules={[
                  { required: true, message: "Vui lòng nhập họ tên nhân viên" },
                ]}
              >
                <Input placeholder="" type="text" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Số điện thoại nhân viên"
                name="phoneNumber"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số điện thoại nhân viên",
                  },
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
              <Form.Item
                label="Ngày sinh"
                name="birthDate"
                rules={[
                  { validator: checkBirthDate },
                  { required: true, message: "Vui lòng nhập ngày sinh" },
                ]}
              >
                <DatePicker
                  onChange={handleSetBirthDate}
                  placeholder={birthDate && format(birthDate, "dd-MM-yyyy")}
                  style={{ width: "100%", height: "40px" }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Col span={24}>
            <Form.Item
              label="Mô tả"
              name="description"
              rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
            >
              <TextArea rows={3} placeholder="Enter description" type="text" />
            </Form.Item>
          </Col>
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
                      value="Nam"
                      checked={gender === "Nam"}
                      onChange={handleGenderChange}
                      style={{ paddingRight: "15px" }}
                    />
                    Nam
                  </label>
                  <label style={{ paddingRight: "40px" }}>
                    <input
                      type="radio"
                      value="Nữ"
                      checked={gender === "Nữ"}
                      onChange={handleGenderChange}
                      style={{ paddingRight: "15px" }}
                    />
                    Nữ
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
            <Col span={24}>
              <span
                class="hide-menu"
                style={{ fontSize: "13px", color: "black", fontWeight: "bold" }}
              >
                Thông tin địa chỉ
              </span>
            </Col>
          </Row>
          <br />

          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Form.Item
                label="Tỉnh/Thành phố"
                name="provinceId"
                rules={[
                  { required: true, message: "Vui lòng chọn Tỉnh/Thành phố" },
                ]}
              >
                <Select
                  value={provinceId}
                  placeholder="Please select"
                  onChange={(e) => handleSelectProvince(e)}
                  style={{
                    width: "100%",
                    height: "40px",
                  }}
                >
                  {" "}
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
                name="districtId"
                rules={[
                  { required: true, message: "Vui lòng chọn Quận/Huyện" },
                ]}
              >
                <Select
                  value={districtId}
                  placeholder="Please select"
                  onChange={(e) => handleSelectDistrict(e)}
                  style={{
                    width: "100%",
                    height: "40px",
                  }}
                >
                  {" "}
                  <Option value={0}>Chọn Quận/Huyện</Option>
                  {district &&
                    district.map((e) => {
                      return <Option value={e.code}>{e.name}</Option>;
                    })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Xã/Phường"
                name="wardId"
                rules={[{ required: true, message: "Vui lòng chọn Xã/Phường" }]}
              >
                <Select
                  value={wardId}
                  placeholder="Please select"
                  onChange={(e) => handleSelectWard(e)}
                  style={{
                    width: "100%",
                    height: "40px",
                  }}
                >
                  {" "}
                  <Option value={0}>Chọn Xã/Phường</Option>
                  {Array.isArray(ward) &&
                    ward.map((e) => {
                      return <Option value={e.code}>{e.name}</Option>;
                    })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item
                label="Địa chỉ chi tiết"
                name="addressDetail"
                rules={[
                  { required: true, message: "Vui lòng nhập địa chỉ chi tiết" },
                ]}
              >
                <Input
                  placeholder="Nhập địa chỉ chi tiết"
                  type="text"
                  onChange={(e) => handleChangeAddress(e)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item
                label="Quyền"
                name="roleId"
                rules={[{ required: true, message: "Vui lòng chọn quyền" }]}
              >
                <Select
                  placeholder="Please select"
                  onChange={null}
                  style={{
                    width: "100%",
                  }}
                  options={roles}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {modelItem ? "Lưu" : "Thêm"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EmployeeAddOrChange;
