import { PlusOutlined } from "@ant-design/icons";
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
import TextArea from "antd/es/input/TextArea";
import useRole from "@api/useRole";
import dayjs from "dayjs";
import { ROLE_OPTIONS } from "@constants/roleConstant"; // Giả sử bạn có file này

const { Option } = Select;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const EmployeeAddOrChange = ({ fetchData, modelItem, textButton, isStyle }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { addOrChange, generateCode, getUserById } = useUser();
  const { getListRole } = useRole(); // Giả sử getListRole trả về cấu trúc {value, label}
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const { getProvince, getDistrict, getWard } = useAddress();

  const [roles, setRoles] = useState([]);
  const [fileList, setFileList] = useState([]);

  const initialAddressState = {
    id: null,
    provinceId: null,
    districtId: null,
    wardId: null,
    addressDetail: "",
    provinceName: null,
    districtName: null,
    wardName: null,
    stage: 1, // Mặc định là active
  };
  const [currentAddress, setCurrentAddress] = useState(initialAddressState);

  const fetchGenerateCode = async () => {
    const { success, data } = await generateCode({ prefix: "NV" });
    if (!success || data?.status === "Error") {
      toast.error(data?.message || "Lỗi tạo mã nhân viên!");
    } else {
      form.setFieldsValue({ code: data.data });
    }
  };

  const fetchRoles = async () => {
    // Nếu ROLE_OPTIONS là mảng [{value, label}] thì dùng trực tiếp
    // Nếu getListRole là API call:
    // const { success, data } = await getListRole();
    // if (success && data?.data) {
    //   setRoles(data.data.map(r => ({ value: r.id, label: r.name })));
    // } else {
    //   toast.error(data?.message || "Lỗi tải danh sách quyền!");
    //   setRoles(ROLE_OPTIONS); // Fallback to constant if API fails
    // }
    setRoles(ROLE_OPTIONS); // Sử dụng hằng số trực tiếp
  };

  const fetchProvincesForModal = async () => {
    const response = await getProvince({ name: null });
    if (
      response?.success &&
      response.data?.success &&
      Array.isArray(response.data.data)
    ) {
      setProvinces(
        response.data.data.map((p) => ({ value: p.code, label: p.name }))
      );
    } else {
      toast.error(
        response?.data?.message ||
          response?.message ||
          "Lỗi tải danh sách tỉnh/thành phố!"
      );
      setProvinces([]);
    }
  };

  const fetchDistrictsForModal = async (provinceCode, callback) => {
    form.setFieldsValue({ districtId: null, wardId: null });
    setCurrentAddress((prev) => ({
      ...prev,
      districtId: null,
      wardId: null,
      districtName: null,
      wardName: null,
    }));
    setDistricts([]);
    setWards([]);
    if (!provinceCode) {
      if (callback) callback();
      return;
    }
    const response = await getDistrict({ code: provinceCode, name: null });
    if (
      response?.success &&
      response.data?.success &&
      Array.isArray(response.data.data)
    ) {
      setDistricts(
        response.data.data.map((d) => ({ value: d.code, label: d.name }))
      );
    } else {
      toast.error(
        response?.data?.message ||
          response?.message ||
          "Lỗi tải danh sách quận/huyện!"
      );
      setDistricts([]);
    }
    if (callback) callback();
  };

  const fetchWardsForModal = async (districtCode, callback) => {
    form.setFieldsValue({ wardId: null });
    setCurrentAddress((prev) => ({ ...prev, wardId: null, wardName: null }));
    setWards([]);
    if (!districtCode) {
      if (callback) callback();
      return;
    }
    const response = await getWard({ districtCode: districtCode, name: null });
    if (
      response?.success &&
      response.data?.success &&
      Array.isArray(response.data.data)
    ) {
      setWards(
        response.data.data.map((w) => ({ value: w.code, label: w.name }))
      );
    } else {
      toast.error(
        response?.data?.message ||
          response?.message ||
          "Lỗi tải danh sách xã/phường!"
      );
      setWards([]);
    }
    if (callback) callback();
  };

  const fetchUserByIdData = async () => {
    if (!modelItem?.id) return;
    const { success, data: userDataResponse } = await getUserById(modelItem.id);
    if (
      !success ||
      !userDataResponse?.data ||
      userDataResponse.status === "Error"
    ) {
      toast.error(userDataResponse?.message || "Lỗi tải thông tin nhân viên!");
      return;
    }
    const userData = userDataResponse.data;
    form.setFieldsValue({
      code: userData.code,
      fullName: userData.fullName,
      phoneNumber: userData.phoneNumber,
      email: userData.email,
      description: userData.description,
      userName: userData.userName,
      roleId: userData.roleId,
      gender:
        userData.gender === true
          ? "male"
          : userData.gender === false
          ? "female"
          : "other",
      birthDate: userData.dateBirth
        ? dayjs(userData.dateBirth, "YYYY-MM-DD HH:mm:ss")
        : null,
    });

    if (userData.address && userData.address.length > 0) {
      const userAddr = userData.address[0]; // Giả sử nhân viên chỉ có 1 địa chỉ
      setCurrentAddress({
        id: userAddr.id || null,
        provinceId: userAddr.provinceId,
        districtId: userAddr.districtId,
        wardId: userAddr.wardId,
        addressDetail: userAddr.addressDetail || "",
        provinceName: userAddr.provinceName,
        districtName: userAddr.districtName,
        wardName: userAddr.wardName,
        stage: 1,
      });
      form.setFieldsValue({
        provinceId: userAddr.provinceId,
        addressDetail: userAddr.addressDetail,
      });
      if (userAddr.provinceId) {
        await fetchDistrictsForModal(userAddr.provinceId, async () => {
          form.setFieldsValue({ districtId: userAddr.districtId });
          if (userAddr.districtId) {
            await fetchWardsForModal(userAddr.districtId, () => {
              form.setFieldsValue({ wardId: userAddr.wardId });
            });
          }
        });
      }
    } else {
      setCurrentAddress(initialAddressState);
      form.setFieldsValue({
        provinceId: null,
        districtId: null,
        wardId: null,
        addressDetail: "",
      });
    }

    if (userData.imageUrl) {
      handleConvert(userData.imageUrl);
    } else {
      setFileList([]);
    }
  };

  const handleSelectProvince = (value) => {
    const selectedProv = provinces.find((p) => p.value === value);
    setCurrentAddress((prev) => ({
      ...prev,
      provinceId: value,
      provinceName: selectedProv ? selectedProv.label : null,
      districtId: null,
      districtName: null,
      wardId: null,
      wardName: null,
    }));
    fetchDistrictsForModal(value);
  };

  const handleSelectDistrict = (value) => {
    const selectedDist = districts.find((d) => d.value === value);
    setCurrentAddress((prev) => ({
      ...prev,
      districtId: value,
      districtName: selectedDist ? selectedDist.label : null,
      wardId: null,
      wardName: null,
    }));
    fetchWardsForModal(value);
  };

  const handleSelectWard = (value) => {
    const selectedWard = wards.find((w) => w.value === value);
    setCurrentAddress((prev) => ({
      ...prev,
      wardId: value,
      wardName: selectedWard ? selectedWard.label : null,
    }));
  };

  const handleChangeAddressDetail = (e) => {
    setCurrentAddress((prev) => ({ ...prev, addressDetail: e.target.value }));
  };

  const disabledFutureDate = (current) =>
    current && current > dayjs().endOf("day");
  const checkBirthDate = (_, value) => {
    if (!value) return Promise.resolve();
    if (dayjs(value).isAfter(dayjs()))
      return Promise.reject(
        new Error("Ngày sinh không được là ngày trong tương lai.")
      );
    if (dayjs().diff(value, "years") < 18)
      return Promise.reject(new Error("Nhân viên phải đủ 18 tuổi trở lên."));
    return Promise.resolve();
  };

  const onFinish = async (values) => {
    try {
      let addressPayload = null;
      if (
        currentAddress.provinceId &&
        currentAddress.districtId &&
        currentAddress.wardId &&
        currentAddress.addressDetail?.trim()
      ) {
        addressPayload = [
          {
            id: currentAddress.id,
            provinceId: currentAddress.provinceId,
            districtId: currentAddress.districtId,
            wardId: currentAddress.wardId,
            addressDetail: currentAddress.addressDetail,
            stage: 1,
            provinceName:
              provinces.find((p) => p.value === currentAddress.provinceId)
                ?.label || currentAddress.provinceName,
            districtName:
              districts.find((d) => d.value === currentAddress.districtId)
                ?.label || currentAddress.districtName,
            wardName:
              wards.find((w) => w.value === currentAddress.wardId)?.label ||
              currentAddress.wardName,
            isDefault: 1, // Nhân viên chỉ có 1 địa chỉ, mặc định là default
          },
        ];
      } else if (
        currentAddress.addressDetail?.trim() ||
        currentAddress.provinceId ||
        currentAddress.districtId ||
        currentAddress.wardId
      ) {
        // Nếu có bất kỳ thông tin địa chỉ nào được nhập nhưng không đầy đủ
        toast.error(
          "Vui lòng điền đầy đủ thông tin Tỉnh/Thành, Quận/Huyện, Phường/Xã và Địa chỉ chi tiết nếu bạn muốn cung cấp địa chỉ."
        );
        return;
      }

      const model = {
        code: values.code,
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        email: values.email,
        dateBirth: values.birthDate
          ? values.birthDate.format("YYYY-MM-DD HH:mm:ss")
          : null,
        userName: values.userName,
        gender:
          values.gender === "male"
            ? true
            : values.gender === "female"
            ? false
            : null, // "other" sẽ là null
        address: addressPayload, // Có thể là null nếu không nhập địa chỉ
        roleId: values.roleId,
        description: values.description,
        status: 1, // Mặc định là active khi thêm/sửa
        id: modelItem ? modelItem.id : null,
      };

      const formData = new FormData();
      formData.append("model", JSON.stringify(model));
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append(`files`, fileList[0].originFileObj);
      }

      const apiResponse = await addOrChange(
        formData,
        { "Content-Type": "multipart/form-data" },
        modelItem?.id
      );

      if (apiResponse?.success) {
        setModalOpen(false);
        toast.success(
          apiResponse.message ||
            (modelItem ? "Cập nhật thành công!" : "Thêm mới thành công!")
        );
        if (fetchData) fetchData();
        resetModalState();
      } else {
        toast.error(apiResponse?.message || "Thao tác thất bại!");
      }
    } catch (error) {
      console.error("Lỗi chi tiết onFinish:", error);
      toast.error("Đã có lỗi hệ thống xảy ra, vui lòng thử lại.");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Thất bại:", errorInfo);
    toast.error("Vui lòng kiểm tra lại các trường thông tin bắt buộc!");
  };

  const resetModalState = () => {
    form.resetFields();
    setFileList([]);
    setCurrentAddress(initialAddressState);
    setProvinces([]);
    setDistricts([]);
    setWards([]);
  };

  const handleOpenModal = async () => {
    resetModalState();
    await fetchProvincesForModal(); // Chờ fetch tỉnh xong
    await fetchRoles(); // Chờ fetch role xong
    if (modelItem?.id) {
      await fetchUserByIdData(); // Chờ fetch user data xong, bao gồm cả fetch địa chỉ liên quan
    } else {
      fetchGenerateCode();
    }
    setModalOpen(true);
  };

  const handleModalCancel = () => {
    setModalOpen(false);
    resetModalState();
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </button>
  );
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleConvert = async (url) => {
    if (!url) return;
    try {
      setFileList([]);
      const resp = await fetch(url);
      if (!resp.ok) throw new Error("Không thể tải tệp");
      const blob = await resp.blob();
      const fName = url.split("/").pop() || `image_${Date.now()}.jpg`;
      const file = new File([blob], fName, { type: blob.type });
      setFileList([
        {
          uid: Date.now().toString(),
          name: fName,
          status: "done",
          url: URL.createObjectURL(file),
          originFileObj: file,
        },
      ]);
    } catch (err) {
      console.error("Lỗi chuyển đổi URL thành tệp:", err);
      setFileList([]);
      toast.error("Không thể tải ảnh từ URL.");
    }
  };
  const handleChangeFile = ({ fileList: newFiles }) => {
    const latestFile = newFiles.slice(-1);
    if (latestFile.length > 0) latestFile[0].status = "done";
    setFileList(latestFile);
  };
  const handleRemoveFile = () => {
    setFileList([]);
    return true;
  };

  return (
    <div>
      <Button
        type={"primary"}
        style={{
          alignItems: "center",
          background: isStyle ? (modelItem ? "#1890ff" : "#1fbf39") : undefined,
          color: "white",
          borderColor: isStyle
            ? modelItem
              ? "#1890ff"
              : "#1fbf39"
            : undefined,
        }}
        onClick={handleOpenModal}
      >
        {textButton}
      </Button>

      <Modal
        width={"65%"}
        title={modelItem ? "Cập nhật nhân viên" : "Thêm mới nhân viên"}
        centered
        open={modalOpen}
        onCancel={handleModalCancel}
        footer={null}
        destroyOnClose
        styles={{
          body: {
            overflowY: "auto",
            maxHeight: "calc(100vh - 200px)",
            overflowX: "hidden",
          },
        }}
      >
        <Form
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
          scrollToFirstError
        >
          <br />
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <span
                style={{ fontSize: "15px", color: "black", fontWeight: "bold" }}
              >
                Thông tin nhân viên
              </span>
            </Col>
          </Row>
          <br />
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8} style={{ textAlign: "center" }}>
              <Form.Item label="Ảnh đại diện" name="listFileImg">
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChangeFile}
                  onRemove={handleRemoveFile}
                  beforeUpload={() => false}
                  maxCount={1}
                >
                  {fileList.length >= 1 ? null : uploadButton}
                </Upload>
                {previewImage && (
                  <Image
                    wrapperStyle={{ display: "none" }}
                    preview={{
                      visible: previewOpen,
                      onVisibleChange: setPreviewOpen,
                      afterOpenChange: (visible) =>
                        !visible && setPreviewImage(""),
                    }}
                    src={previewImage}
                  />
                )}
              </Form.Item>
            </Col>
            <Col xs={24} md={16}>
              <Row gutter={[16, 0]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Mã nhân viên"
                    name="code"
                    rules={[
                      { required: true, message: "Vui lòng nhập mã nhân viên" },
                    ]}
                  >
                    <Input
                      placeholder="Mã nhân viên tự động"
                      readOnly
                      disabled
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Vui lòng nhập email" },
                      { type: "email", message: "Email không đúng định dạng" },
                    ]}
                  >
                    <Input placeholder="Nhập email" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Họ và tên"
                    name="fullName"
                    rules={[
                      { required: true, message: "Vui lòng nhập họ và tên" },
                    ]}
                  >
                    <Input placeholder="Nhập họ và tên" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Số điện thoại"
                    name="phoneNumber"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số điện thoại",
                      },
                      {
                        pattern: /^(0[3|5|7|8|9])+([0-9]{8})\b$/,
                        message:
                          "Số điện thoại không hợp lệ. Ví dụ: 09XXXXXXXX",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập số điện thoại" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Tên đăng nhập"
                    name="userName"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tên đăng nhập",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập tên đăng nhập" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Ngày sinh"
                    name="birthDate"
                    rules={[
                      { required: true, message: "Vui lòng chọn ngày sinh" },
                      { validator: checkBirthDate },
                    ]}
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      placeholder="Chọn ngày sinh"
                      format="DD/MM/YYYY"
                      disabledDate={disabledFutureDate}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Giới tính"
                    name="gender"
                    rules={[
                      { required: true, message: "Vui lòng chọn giới tính" },
                    ]}
                  >
                    <Select
                      placeholder="Chọn giới tính"
                      style={{ width: "100%" }}
                    >
                      <Option value="male">Nam</Option>
                      <Option value="female">Nữ</Option>
                      <Option value="other">Khác</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Quyền"
                    name="roleId"
                    rules={[{ required: true, message: "Vui lòng chọn quyền" }]}
                  >
                    <Select
                      placeholder="Chọn quyền"
                      style={{ width: "100%" }}
                      options={roles}
                      allowClear
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item label="Mô tả" name="description">
                <TextArea rows={3} placeholder="Nhập mô tả (nếu có)" />
              </Form.Item>
            </Col>
          </Row>
          <br />
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <span
                style={{ fontSize: "15px", color: "black", fontWeight: "bold" }}
              >
                Thông tin địa chỉ
              </span>
            </Col>
          </Row>
          <br />
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Form.Item
                label="Tỉnh/Thành phố"
                name="provinceId"
                rules={[
                  {
                    required:
                      currentAddress.addressDetail?.trim() ||
                      currentAddress.districtId ||
                      currentAddress.wardId
                        ? true
                        : false,
                    message: "Vui lòng chọn Tỉnh/Thành phố",
                  },
                ]}
              >
                <Select
                  value={form.getFieldValue("provinceId")}
                  placeholder="Chọn Tỉnh/Thành phố"
                  onChange={handleSelectProvince}
                  style={{ width: "100%" }}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={provinces}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                label="Quận/Huyện"
                name="districtId"
                rules={[
                  {
                    required:
                      currentAddress.addressDetail?.trim() ||
                      currentAddress.wardId
                        ? true
                        : false,
                    message: "Vui lòng chọn Quận/Huyện",
                  },
                ]}
              >
                <Select
                  value={form.getFieldValue("districtId")}
                  placeholder="Chọn Quận/Huyện"
                  onChange={handleSelectDistrict}
                  style={{ width: "100%" }}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={districts}
                  disabled={!form.getFieldValue("provinceId")}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                label="Xã/Phường"
                name="wardId"
                rules={[
                  {
                    required: currentAddress.addressDetail?.trim()
                      ? true
                      : false,
                    message: "Vui lòng chọn Xã/Phường",
                  },
                ]}
              >
                <Select
                  value={form.getFieldValue("wardId")}
                  placeholder="Chọn Xã/Phường"
                  onChange={handleSelectWard}
                  style={{ width: "100%" }}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={wards}
                  disabled={!form.getFieldValue("districtId")}
                  allowClear
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item
                label="Địa chỉ chi tiết"
                name="addressDetail"
                rules={[
                  {
                    required:
                      form.getFieldValue("provinceId") ||
                      form.getFieldValue("districtId") ||
                      form.getFieldValue("wardId")
                        ? true
                        : false,
                    message: "Vui lòng nhập địa chỉ chi tiết",
                  },
                ]}
              >
                <Input
                  placeholder="Nhập địa chỉ chi tiết (số nhà, tên đường,...)"
                  onChange={handleChangeAddressDetail}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item style={{ textAlign: "right", marginTop: "20px" }}>
            <Button style={{ marginRight: "10px" }} onClick={handleModalCancel}>
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={form.isSubmitting}
            >
              {modelItem ? "Lưu thay đổi" : "Thêm mới"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EmployeeAddOrChange;
