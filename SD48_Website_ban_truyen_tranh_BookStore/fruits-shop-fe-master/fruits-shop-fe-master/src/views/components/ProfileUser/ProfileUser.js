import useUserApi from "api/useUser";
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Col,
  Row,
  Form,
  Select,
  Input,
  Card,
  Typography,
  Divider,
  Spin,
  Empty,
  Tag,
  Modal as AntdModal,
  Space,
  Statistic,
  Checkbox,
  Descriptions,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  StarFilled,
  StarOutlined,
  DeleteOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  SaveOutlined,
  HomeOutlined,
  EditOutlined,
  IdcardOutlined,
  CalendarOutlined,
  WomanOutlined,
  ManOutlined,
  GiftOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import useAddress from "api/useAddress";
import useUser from "@store/useUser";
import { format, isValid, parseISO } from "date-fns";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const AddressFormModal = ({
  visible,
  onCancel,
  onFinish,
  initialValues,
  provinces,
  loading,
}) => {
  const [form] = Form.useForm();
  const { getDistrict, getWard } = useAddress();
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  useEffect(() => {
    if (visible) {
      form.resetFields();
      setDistricts([]);
      setWards([]);
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          provinceId: initialValues.provinceId
            ? String(initialValues.provinceId)
            : null,
          districtId: initialValues.districtId
            ? String(initialValues.districtId)
            : null,
          wardId: initialValues.wardId ? String(initialValues.wardId) : null,
        });
        if (initialValues.provinceId) {
          fetchDistrictsForForm(
            String(initialValues.provinceId),
            String(initialValues.districtId)
          );
        }
      }
    }
  }, [visible, initialValues, form]);

  const fetchDistrictsForForm = async (
    provinceCode,
    currentDistrictId = null
  ) => {
    if (!provinceCode) {
      setDistricts([]);
      setWards([]);
      return;
    }
    setLoadingDistricts(true);
    const { success, data } = await getDistrict({
      code: provinceCode,
      name: null,
    });
    if (success && data.status !== "Error") setDistricts(data.data || []);
    else toast.error(data.message || "Lỗi tải quận/huyện.");
    setLoadingDistricts(false);
    if (currentDistrictId) fetchWardsForForm(currentDistrictId);
  };

  const fetchWardsForForm = async (districtCode) => {
    if (!districtCode) {
      setWards([]);
      return;
    }
    setLoadingWards(true);
    const { success, data } = await getWard({ code: districtCode, name: null });
    if (success && data.status !== "Error") setWards(data.data || []);
    else toast.error(data.message || "Lỗi tải xã/phường.");
    setLoadingWards(false);
  };

  const handleProvinceChange = (value) => {
    form.setFieldsValue({ districtId: null, wardId: null });
    setWards([]);
    fetchDistrictsForForm(value);
  };

  const handleDistrictChange = (value) => {
    form.setFieldsValue({ wardId: null });
    fetchWardsForForm(value);
  };

  const handleFormFinish = (values) => {
    const selectedProvince = provinces.find(
      (p) => p.code === values.provinceId
    );
    const selectedDistrict = districts.find(
      (d) => d.code === values.districtId
    );
    const selectedWard = wards.find((w) => w.code === values.wardId);
    onFinish({
      ...initialValues,
      ...values,
      provinceName: selectedProvince?.name,
      districtName: selectedDistrict?.name,
      wardName: selectedWard?.name,
    });
  };

  return (
    <AntdModal
      title={initialValues?.id ? "Chỉnh Sửa Địa Chỉ" : "Thêm Địa Chỉ Mới"}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={() => form.submit()}
          icon={<SaveOutlined />}
          style={{ background: "#4CAF50", borderColor: "#4CAF50" }}
        >
          {initialValues?.id ? "Lưu Địa Chỉ" : "Thêm Mới"}
        </Button>,
      ]}
      destroyOnClose
      maskClosable={false}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormFinish}
        initialValues={{
          isDefault: initialValues ? initialValues.isDefault : false,
        }}
      >
        <Form.Item
          name="provinceId"
          label="Tỉnh/Thành phố"
          rules={[{ required: true, message: "Vui lòng chọn Tỉnh/Thành phố!" }]}
        >
          <Select
            placeholder="Chọn Tỉnh/Thành phố"
            onChange={handleProvinceChange}
            showSearch
            filterOption={(input, option) =>
              (option?.children ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            allowClear
          >
            {provinces.map((p) => (
              <Option key={p.code} value={String(p.code)}>
                {p.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="districtId"
              label="Quận/Huyện"
              rules={[{ required: true, message: "Vui lòng chọn Quận/Huyện!" }]}
            >
              <Select
                placeholder="Chọn Quận/Huyện"
                onChange={handleDistrictChange}
                loading={loadingDistricts}
                disabled={!form.getFieldValue("provinceId")}
                showSearch
                filterOption={(input, option) =>
                  (option?.children ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                allowClear
              >
                {districts.map((d) => (
                  <Option key={d.code} value={String(d.code)}>
                    {d.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="wardId"
              label="Xã/Phường"
              rules={[{ required: true, message: "Vui lòng chọn Xã/Phường!" }]}
            >
              <Select
                placeholder="Chọn Xã/Phường"
                loading={loadingWards}
                disabled={!form.getFieldValue("districtId")}
                showSearch
                filterOption={(input, option) =>
                  (option?.children ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                allowClear
              >
                {wards.map((w) => (
                  <Option key={w.code} value={String(w.code)}>
                    {w.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="addressDetail"
          label="Địa chỉ chi tiết (Số nhà, tên đường...)"
          rules={[
            { required: true, message: "Vui lòng nhập địa chỉ chi tiết!" },
          ]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Ví dụ: Số 123, Đường ABC, Khu Phố XYZ"
          />
        </Form.Item>
        <Form.Item name="isDefault" valuePropName="checked">
          <Checkbox>Đặt làm địa chỉ mặc định</Checkbox>
        </Form.Item>
      </Form>
    </AntdModal>
  );
};

function ProfileUser() {
  const { getUserById, addOrChange } = useUserApi();
  const [user, setUser] = useState({});
  const { token, id: userIdFromStore } = useUser();
  const [loadingPage, setLoadingPage] = useState(true);
  const [saving, setSaving] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [addressList, setAddressList] = useState([]);
  const { getProvince } = useAddress();

  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const fetchInitialProvinces = async () => {
    const { success, data } = await getProvince({ name: null });
    if (success && data.status !== "Error") setProvinces(data.data || []);
    else toast.error(data.message || "Lỗi tải danh sách tỉnh thành!");
  };

  const fetchDataUser = async () => {
    setLoadingPage(true);
    if (!userIdFromStore) {
      toast.info("Vui lòng đăng nhập để xem thông tin tài khoản.");
      setLoadingPage(false);
      return;
    }
    try {
      const { success, data } = await getUserById(userIdFromStore);
      if (data.status !== "Error" && success && data.data) {
        setUser(data.data);
        const initialAddresses =
          data.data.address?.map((addr) => ({
            ...addr,
            key: addr.id || `temp_${Date.now()}_${Math.random()}`,
            stage: 1,
            provinceId: addr.provinceId ? String(addr.provinceId) : null,
            districtId: addr.districtId ? String(addr.districtId) : null,
            wardId: addr.wardId ? String(addr.wardId) : null,
          })) || [];
        setAddressList(initialAddresses);
      } else {
        toast.error(data.message || "Lỗi tải thông tin người dùng!");
      }
    } catch (err) {
      toast.error("Đã có lỗi xảy ra khi tải thông tin người dùng.");
    } finally {
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    fetchInitialProvinces();
    if (userIdFromStore) fetchDataUser();
    else setLoadingPage(false);
  }, [userIdFromStore]);

  const handleOpenAddAddressModal = () => {
    setEditingAddress(null);
    setIsAddressModalVisible(true);
  };

  const handleOpenEditAddressModal = (addressToEdit) => {
    setEditingAddress(addressToEdit);
    setIsAddressModalVisible(true);
  };

  const handleAddressModalCancel = () => {
    setIsAddressModalVisible(false);
    setEditingAddress(null);
  };

  const handleAddressFormFinish = (values) => {
    const isEditing = !!editingAddress;
    let updatedList;

    if (isEditing) {
      updatedList = addressList.map((addr) =>
        addr.key === editingAddress.key
          ? { ...editingAddress, ...values, stage: 1 }
          : addr
      );
    } else {
      const newAddress = {
        ...values,
        id: null,
        key: `new_${Date.now()}_${Math.random()}`,
        stage: 1,
        isDefault: values.isDefault ? 1 : 0,
      };
      updatedList = [...addressList, newAddress];
    }
    if (values.isDefault) {
      updatedList = updatedList.map((addr) => ({
        ...addr,
        isDefault: (
          isEditing
            ? addr.key === editingAddress.key
            : addr.key === updatedList[updatedList.length - 1].key
        )
          ? 1
          : 0,
      }));
    }

    setAddressList(updatedList);
    setIsAddressModalVisible(false);
    setEditingAddress(null);
    toast.info(
      isEditing
        ? "Địa chỉ đã được cập nhật trong danh sách. Nhấn 'Lưu Tất Cả' để lưu."
        : "Địa chỉ mới đã được thêm. Nhấn 'Lưu Tất Cả' để lưu."
    );
  };

  const handleSetDefaultAddress = (keyToSetDefault) => {
    setAddressList((prevList) =>
      prevList.map((addr) => ({
        ...addr,
        isDefault: addr.key === keyToSetDefault ? 1 : 0,
      }))
    );
    toast.info(
      "Đã đặt địa chỉ làm mặc định. Nhấn 'Lưu Tất Cả Thay Đổi' để hoàn tất."
    );
  };

  const handleDeleteAddress = (keyToDelete) => {
    AntdModal.confirm({
      title: "Xác nhận xóa địa chỉ",
      content: "Bạn có chắc chắn muốn xóa địa chỉ này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        const addressToDelete = addressList.find(
          (addr) => addr.key === keyToDelete
        );
        if (addressToDelete?.id) {
          setAddressList((prevList) =>
            prevList.map((addr) =>
              addr.key === keyToDelete ? { ...addr, stage: -1 } : addr
            )
          );
        } else {
          setAddressList((prevList) =>
            prevList.filter((addr) => addr.key !== keyToDelete)
          );
        }
        toast.info(
          "Địa chỉ đã được đánh dấu xóa. Nhấn 'Lưu Tất Cả Thay Đổi' để hoàn tất."
        );
      },
    });
  };

  const onGlobalSave = async () => {
    setSaving(true);
    const activeAddresses = addressList.filter((addr) => addr.stage === 1);
    for (const addr of activeAddresses) {
      if (
        !addr.provinceId ||
        !addr.districtId ||
        !addr.wardId ||
        !addr.addressDetail?.trim()
      ) {
        toast.error(
          `Vui lòng điền đầy đủ Tỉnh/Huyện/Xã và chi tiết cho địa chỉ: "${
            addr.addressDetail || "Địa chỉ mới chưa có chi tiết"
          }"`
        );
        setSaving(false);
        return;
      }
    }
    try {
      const formData = new FormData();
      const addressesToSubmit = addressList
        .filter((addr) => addr.stage !== 0)
        .map((e) => ({
          id: e.id,
          provinceId: e.provinceId,
          districtId: e.districtId,
          wardId: e.wardId,
          addressDetail: e.addressDetail,
          provinceName: e.provinceName,
          districtName: e.districtName,
          wardName: e.wardName,
          isDefault: e.isDefault ? 1 : 0,
          stage: e.stage,
        }));
 const modelPayload = {
  id: user.id, // Chỉ gửi ID của user để backend biết user nào cần cập nhật địa chỉ
  // Không gửi các trường khác của user như fullName, email, phoneNumber nếu bạn không cho phép sửa chúng ở đây
  address: addressesToSubmit,
};
formData.append("model", JSON.stringify(modelPayload));

// Gọi API addOrChange
const { data: responseData } = await addOrChange(formData, { "Content-Type": "multipart/form-data" });

if (responseData && responseData.success) {
    toast.success(responseData.message || "Cập nhật địa chỉ thành công!");
    fetchDataUser(); // Tải lại dữ liệu user để cập nhật danh sách địa chỉ mới
} else {
    toast.error(responseData?.message || "Cập nhật địa chỉ thất bại!");
}
    } catch (error) {
      toast.error("Đã có lỗi xảy ra khi lưu thông tin.");
    } finally {
      setSaving(false);
    }
  };

  if (loadingPage) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 200px)",
        }}
      >
        <Spin size="large" tip="Đang tải thông tin tài khoản..." />
      </div>
    );
  }

  const safeFormatDob = (dobString) => {
    if (!dobString) return "-";
    try {
      return format(parseISO(dobString), "dd/MM/yyyy");
    } catch {
      try {
        return format(new Date(dobString), "dd/MM/yyyy");
      } catch {
        return dobString;
      }
    }
  };

  return (
    <div
      className="profile-user-container"
      style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}
    >
      <Title
        level={2}
        style={{
          color: "#4CAF50",
          marginBottom: "30px",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        <UserOutlined style={{ marginRight: "10px" }} />
        Thông Tin Tài Khoản
      </Title>

      <Row gutter={[32, 32]}>
        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <IdcardOutlined style={{ color: "#4CAF50" }} />
                Thông Tin Cá Nhân
              </Space>
            }
            bordered={false}
            style={{
              borderRadius: "12px",
              boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
            }}
            headStyle={{
              borderBottom: "1px solid #f0f0f0",
              fontWeight: "bold",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt="avatar"
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    border: "3px solid #4CAF50",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <UserOutlined
                  style={{
                    fontSize: "64px",
                    color: "#4CAF50",
                    background: "#e6f7ff",
                    padding: "20px",
                    borderRadius: "50%",
                  }}
                />
              )}
              <Title
                level={4}
                style={{
                  marginTop: "15px",
                  marginBottom: "5px",
                  color: "#388e3c",
                }}
              >
                {user.fullName || user.userName || "Người dùng"}
              </Title>
              <Tag color="blue">{user.roleCode || "Khách hàng"}</Tag>
            </div>
            <Divider style={{ margin: "15px 0" }} />
            <Descriptions
              column={1}
              size="middle"
              layout="horizontal"
              colon={false}
              styles={{
                label: { fontWeight: 500, minWidth: "110px", color: "#595959" },
              }}
            >
              <Descriptions.Item
                label={
                  <Space>
                    <UserOutlined />
                    Tên ĐN:
                  </Space>
                }
              >
                <Text strong>{user.userName || "-"}</Text>
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <Space>
                    <MailOutlined />
                    Email:
                  </Space>
                }
              >
                <Text>{user.email || "-"}</Text>
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <Space>
                    <PhoneOutlined />
                    Điện thoại:
                  </Space>
                }
              >
                <Text>{user.phoneNumber || "-"}</Text>
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <Space>
                    <CalendarOutlined />
                    Ngày sinh:
                  </Space>
                }
              >
                <Text>{safeFormatDob(user.dateBirth)}</Text>
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <Space>
                    {user.gender ? <ManOutlined /> : <WomanOutlined />}Giới
                    tính:
                  </Space>
                }
              >
                <Text>
                  {user.gender === null ? "-" : user.gender ? "Nam" : "Nữ"}
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <EnvironmentOutlined style={{ color: "#388e3c" }} />
                Sổ Địa Chỉ Của Tôi
              </Space>
            }
            bordered={false}
            style={{
              borderRadius: "12px",
              boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
            }}
            headStyle={{
              borderBottom: "1px solid #f0f0f0",
              fontWeight: "bold",
            }}
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleOpenAddAddressModal}
                style={{ background: "#4CAF50", borderColor: "#4CAF50" }}
                shape="round"
              >
                Thêm Địa Chỉ
              </Button>
            }
          >
            {addressList.filter((addr) => addr.stage === 1).length === 0 &&
              !loadingPage && (
                <Empty
                  description={
                    <Text type="secondary">
                      Bạn chưa có địa chỉ nào được lưu. Hãy thêm địa chỉ mới để
                      thuận tiện cho việc mua sắm nhé!
                    </Text>
                  }
                  style={{ padding: "40px 0" }}
                />
              )}
            <Row gutter={[16, 16]}>
              {addressList
                .filter((addr) => addr.stage === 1)
                .map((item) => (
                  <Col xs={24} sm={12} key={item.key}>
                    <Card
                      hoverable
                      className="address-display-card"
                      style={{
                        borderRadius: "8px",
                        border: item.isDefault
                          ? "2px solid #4CAF50"
                          : "1px solid #e8e8e8",
                        transition: "all 0.3s",
                      }}
                      bodyStyle={{ padding: "16px" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "12px",
                        }}
                      >
                        <Text
                          strong
                          style={{
                            fontSize: "15px",
                            color: item.isDefault ? "#388e3c" : "#333",
                          }}
                        >
                          {item.provinceName ||
                            provinces.find((p) => p.code === item.provinceId)
                              ?.name ||
                            "Địa chỉ"}
                        </Text>
                        <Space size="small">
                          <Tooltip title="Chỉnh sửa địa chỉ">
                            <Button
                              shape="circle"
                              type="text"
                              icon={
                                <EditOutlined style={{ color: "#1677ff" }} />
                              }
                              onClick={() => handleOpenEditAddressModal(item)}
                            />
                          </Tooltip>
                          <Tooltip title="Xóa địa chỉ">
                            <Button
                              shape="circle"
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => handleDeleteAddress(item.key)}
                            />
                          </Tooltip>
                        </Space>
                      </div>
                      <Paragraph
                        style={{
                          fontSize: "14px",
                          color: "#595959",
                          marginBottom: "12px",
                          minHeight: "42px",
                        }}
                      >
                        {item.addressDetail || "Chưa có chi tiết"}
                        <br />
                        <Text type="secondary" style={{ fontSize: "13px" }}>
                          {item.wardName ||
                            item.wards?.find((w) => w.code === item.wardId)
                              ?.name ||
                            ""}
                          {item.wardName ||
                          item.wards?.find((w) => w.code === item.wardId)?.name
                            ? ", "
                            : ""}
                          {item.districtName ||
                            item.districts?.find(
                              (d) => d.code === item.districtId
                            )?.name ||
                            ""}
                          {item.districtName ||
                          item.districts?.find(
                            (d) => d.code === item.districtId
                          )?.name
                            ? ", "
                            : ""}
                          {item.provinceName ||
                            provinces.find((p) => p.code === item.provinceId)
                              ?.name ||
                            ""}
                        </Text>
                      </Paragraph>
                      <Row justify="space-between" align="middle">
                        <Col>
                          {item.isDefault === 1 ? (
                            <Tag
                              icon={<HomeOutlined />}
                              color="success"
                              style={{ cursor: "default" }}
                            >
                              Địa chỉ mặc định
                            </Tag>
                          ) : (
                            <Button
                              type="link"
                              icon={<StarOutlined />}
                              onClick={() => handleSetDefaultAddress(item.key)}
                              style={{
                                padding: 0,
                                color: "#faad14",
                                fontWeight: 500,
                              }}
                            >
                              Đặt làm mặc định
                            </Button>
                          )}
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                ))}
            </Row>
          </Card>
        </Col>
      </Row>

      <div
        style={{
          textAlign: "center",
          marginTop: "40px",
          paddingBottom: "20px",
        }}
      >
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={onGlobalSave}
          loading={saving}
          style={{ background: "#4CAF50", borderColor: "#4CAF50" }}
          size="large"
          shape="round"
        >
          Lưu Tất Cả Thay Đổi
        </Button>
      </div>

      <AddressFormModal
        visible={isAddressModalVisible}
        onCancel={handleAddressModalCancel}
        onFinish={handleAddressFormFinish}
        initialValues={editingAddress}
        provinces={provinces}
        loading={saving}
      />
      <style jsx global>{`
        .profile-user-container .ant-card-head-title {
          font-weight: bold;
          color: #333;
        }
        .profile-user-container .ant-select-disabled .ant-select-selector {
          background-color: #f5f5f5 !important;
          cursor: not-allowed;
        }
        .address-display-card:hover {
          box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
          border-color: #4caf50 !important;
        }
        .ant-statistic-title {
          font-size: 14px !important;
          color: #8c8c8c !important;
          margin-bottom: 4px !important;
        }
        .ant-statistic-content {
          font-size: 20px !important;
        }
        .ant-descriptions-item-label {
          color: #555 !important;
        }
      `}</style>
    </div>
  );
}
export default ProfileUser;
