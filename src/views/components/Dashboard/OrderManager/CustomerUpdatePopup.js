import useAddress from "@api/useAddress";
import { Select } from "antd";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Pagination,
  Space,
  Table,
} from "antd";
import { Option } from "antd/es/mentions";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const CustomerUpdatePopup = ({
  user,
  addressModel,
  handlePopupSelected,
  index,
}) => {
  const { getProvince, getDistrict, getWard } = useAddress();
  const [modal2Open, setModal2Open] = useState(false);

  const [fullName, setFullName] = useState(user.fullName);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
  const [email, setEmail] = useState(user.email);
  const [province, setProvince] = useState([]);
  const [district, setDistrict] = useState([]);
  const [ward, setWard] = useState([]);
  const [provinceId, setProvinceId] = useState(addressModel.provinceId);
  const [districtId, setDistrictId] = useState(addressModel.districtId);
  const [wardId, setWardId] = useState(addressModel.wardId);
  const [address, setAddress] = useState(addressModel.addressDetail);

  const fetchData = async () => {
    fetchProvince();
  };

  const showModel = () => {
    setModal2Open(true);
    fetchData();
  };
  useEffect(() => {
    if (modal2Open) {
      fetchData();
    }
  }, []);

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

  const handleSelectProvince = async (e, index) => {
    setProvinceId(e);
    fetchDistrict(e);
  };
  const handleSelectDistrict = async (e, index) => {
    setDistrictId(e);
    fetchWard(e);
  };
  const handleSelectWard = async (e, index) => {
    setWardId(e);
  };

  const handleChangeAddress = (e) => {
    setAddress(e);
  };

  const handleUpdateCustomer = () => {
    handlePopupSelected({
      fullName,
      phoneNumber,
      email,
      provinceId,
      districtId,
      wardId,
      address,
    });
    setModal2Open(false);
  };

  return (
    <div>
      <Button
        type="button"
        value="small"
        style={{
          alignItems: "center",
          background: "#2596be",
          marginBottom: "20px",
          color: "white",
          width: "100%",
        }}
        onClick={() => showModel()}
      >
        Cập nhật
      </Button>

      <Modal
        width={"60%"}
        title="Thay đổi thông tin"
        centered
        visible={modal2Open}
        onCancel={() => setModal2Open(false)}
        footer={null}
      >
        <Row>
          <Col span={24}>
            <Row>
              <Col span={5}>
                <p style={{ fontWeight: "bold" }}>Họ tên khách hàng: </p>
              </Col>
              <Col span={24} style={{ textAlign: "left" }}>
                <Input
                  placeholder=""
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </Col>
            </Row>
            <Row>
              <Col span={5}>
                <p style={{ fontWeight: "bold" }}>Số điện thoại: </p>
              </Col>
              <Col span={24} style={{ textAlign: "left" }}>
                <Input
                  placeholder=""
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </Col>
            </Row>
            <Row>
              <Col span={5}>
                <p style={{ fontWeight: "bold" }}>Email: </p>
              </Col>
              <Col span={24} style={{ textAlign: "left" }}>
                <Input
                  placeholder=""
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <p style={{ fontWeight: "bold" }}>
                  Tỉnh/Thành phố: <span style={{ color: "red" }}>(*)</span>{" "}
                </p>
                <Select
                  value={provinceId}
                  placeholder="Please select"
                  onChange={(e) => handleSelectProvince(e, index)}
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
              </Col>
              <Col span={8}>
                <p style={{ fontWeight: "bold" }}>
                  Quận/Huyện:
                  <span style={{ color: "red" }}>(*)</span>{" "}
                </p>
                <Select
                  value={districtId}
                  placeholder="Please select"
                  onChange={(e) => handleSelectDistrict(e, index)}
                  style={{
                    width: "100%",
                    height: "40px",
                  }}
                >
                  <Option value={0}>Chọn Quận/Huyện</Option>
                  {district &&
                    district.map((e) => {
                      return <Option value={e.code}>{e.name}</Option>;
                    })}
                </Select>
              </Col>
              <Col span={8}>
                <p style={{ fontWeight: "bold" }}>
                  Xã/Phường:
                  <span style={{ color: "red" }}>(*)</span>
                </p>
                <Select
                  value={wardId}
                  placeholder="Please select"
                  onChange={(e) => handleSelectWard(e, index)}
                  style={{
                    width: "100%",
                    height: "40px",
                  }}
                >
                  <Option value={0}>Chọn Xã/Phường</Option>
                  {Array.isArray(ward) &&
                    ward.map((e) => {
                      return <Option value={e.code}>{e.name}</Option>;
                    })}
                </Select>
              </Col>
            </Row>
            <Row>
              <Col span={5}>
                <p style={{ fontWeight: "bold" }}>Địa chỉ: </p>
              </Col>
              <Col span={24} style={{ textAlign: "left" }}>
                <Input
                  placeholder=""
                  type="text"
                  value={address}
                  onChange={(e) => handleChangeAddress(e.target.value)}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <br />
        <Row gutter={[5, 5]}>
          <Col span={24} style={{ textAlign: "right" }}>
            <Button
              style={{ marginRight: "10px" }}
              onClick={() => {
                setModal2Open(false);
              }}
            >
              Huy
            </Button>
            <Button
              type="primary"
              onClick={() => {
                handleUpdateCustomer();
              }}
            >
              Thay đổi thông tin
            </Button>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};

export default CustomerUpdatePopup;
