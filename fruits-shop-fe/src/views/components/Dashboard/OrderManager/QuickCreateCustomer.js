import { Button, Col, Form, Input, Modal, Row, Select, DatePicker } from "antd";
import React, { useState } from "react";
import useUser from "@api/useUser";
import { toast } from "react-toastify";
import useAddress from "@api/useAddress";
import { Option } from "antd/es/mentions";
import TextArea from "antd/es/input/TextArea";
import { format } from "date-fns";

const QuickCreateCustomer = ({ handlePopupSelected }) => {
  const [modal2Open, setModal2Open] = useState(false);
  const [form] = Form.useForm();
  const { createShortUser, generateCode } = useUser();
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
  const [birthDate, setBirthDate] = useState();

  const fetchGenerateCode = async () => {
    var request = {
      prefix: "CUSTOMER",
    };
    const { success, data } = await generateCode(request);
    if (!success || data.status === "Error") {
      toast.error(data.message);
    } else {
      form.setFieldsValue({ code: data.data });
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
  const handleSetBirthDate = (date) => {
    setBirthDate(date.format());
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
      const model = {
        code: values.code,
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        email: values.email,
        dateBirth: birthDate,
        userName: values.userName,
        gender: gender === "male" ? true : false,
        address: addressModel,
        roleId: values.roleId,
        description: values.description,
        status: 1,
        id: null,
      };
      const { success, data } = await createShortUser(model);
      if (data.status != "Error" && success) {
        setModal2Open(false);
        toast.success(data.message);
        handlePopupSelected(data.data);
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
    fetchGenerateCode();
    setModal2Open(true);
    fetchProvince();
  };
  return (
    <div>
      <Button
        type={"primary"}
        value="small"
        style={{
          alignItems: "center",
          background: "#2596be",
          width: "100%",
        }}
        onClick={() => handleOpenModal()}
      >
        Thêm mới khách hàng
      </Button>

      <Modal
        width={"65%"}
        title="Thêm mới khách hàng"
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
            <Col span={12}>
              <Form.Item
                label="Mã người dùng"
                name="code"
                rules={[{ required: true, message: "" }]}
              >
                <Input placeholder="" type="text" readOnly={true} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "" }]}
              >
                <Input placeholder="" type="text" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Họ tên khách hàng"
                name="fullName"
                rules={[{ required: true, message: "" }]}
              >
                <Input placeholder="" type="text" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Số điện thoại khách hàng"
                name="phoneNumber"
                rules={[{ required: true, message: "" }]}
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
                rules={[{ required: true, message: "" }]}
              >
                <Input placeholder="" type="text" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Ngày sinh">
                <DatePicker
                  onChange={handleSetBirthDate}
                  placeholder={birthDate && format(birthDate, "dd-MM-yyyy")}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Col span={24}>
            <Form.Item
              label="Desciption"
              name="description"
              rules={[{ required: true, message: "" }]}
            >
              <TextArea rows={3} placeholder="Enter description" type="text" />
            </Form.Item>
          </Col>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item
                label="Giới tính"
                name="gender"
                rules={[{ required: true }]}
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
                rules={[{ required: true, message: "Please select province" }]}
              >
                <Select
                  value={provinceId}
                  placeholder="Please select"
                  onChange={(e) => handleSelectProvince(e)}
                  style={{
                    width: "100%",
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
                rules={[{ required: true, message: "Please select district" }]}
              >
                <Select
                  value={districtId}
                  placeholder="Please select"
                  onChange={(e) => handleSelectDistrict(e)}
                  style={{
                    width: "100%",
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
                rules={[{ required: true, message: "Please select wards" }]}
              >
                <Select
                  value={wardId}
                  placeholder="Please select"
                  onChange={(e) => handleSelectWard(e)}
                  style={{
                    width: "100%",
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
                rules={[{ required: true, message: "" }]}
              >
                <Input
                  placeholder=""
                  type="text"
                  onChange={(e) => handleChangeAddress(e)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Row justify={"end"}>
              <Button
                type="primary"
                value="small"
                style={{
                  alignItems: "center",
                  background: "#2596be",
                }}
                htmlType="submit"
              >
                Lưu
              </Button>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuickCreateCustomer;
