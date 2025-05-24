import {
  Col,
  Form,
  Input,
  Button,
  Row,
  Table,
  Pagination,
  Space,
  Image,
  Select, // Import Select trực tiếp
} from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import UserAddOrChange from "./UserAddOrChange";
import useUser from "@api/useUser";
import { format, isValid, parseISO } from "date-fns";
import CommonPopup from "./../../components/Dashboard/Common/CommonPopup";

const { Option } = Select; // Lấy Option từ Select

function ManagerUser() {
  const [user, setUsers] = useState([]);
  const { getListUser, changeStatus } = useUser();

  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [form] = Form.useForm();
  const [tableParams, setTableParams] = useState({
    pagination: {
      pageIndex: 1,
      pageSize: 10,
      keySearch: "",
      roleId: 5,
      status: null,
      gender: null,
    },
  });

  const fetchData = async () => {
    setLoading(true);
    const paramsToFetch = { ...tableParams.pagination };
    if (paramsToFetch.keySearch === "" || paramsToFetch.keySearch === null || paramsToFetch.keySearch === undefined) {
        delete paramsToFetch.keySearch;
    }
    if (paramsToFetch.status === null || paramsToFetch.status === undefined) {
        delete paramsToFetch.status;
    }
    if (paramsToFetch.gender === null || paramsToFetch.gender === undefined) {
        delete paramsToFetch.gender;
    }

    const response = await getListUser(paramsToFetch);
    if (response && response.success && response.data && response.data.data) {
      setUsers(response.data.data);
      setTotal(response.data.totalCount);
    } else {
      toast.error(response?.message || "Lỗi tải danh sách người dùng.");
      setUsers([]);
      setTotal(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(tableParams.pagination)]);

  const handleTableAntdChange = (paginationConfig, filters, sorter) => {
    setTableParams(prev => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        pageIndex: paginationConfig.current,
        pageSize: paginationConfig.pageSize,
      },
      filters,
      sorter,
    }));
  };

  const onPaginationChange = (page, pageSize) => {
    setTableParams(prev => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        pageIndex: page,
        pageSize: pageSize,
      },
    }));
  };

  const onSearchByKey = (e) => {
    const value = e.target.value;
    setTableParams((prevParams) => ({
      ...prevParams,
      pagination: {
        ...prevParams.pagination,
        pageIndex: 1,
        keySearch: value,
      },
    }));
  };

  const onChangeStatus = (value) => {
    setTableParams((prevParams) => ({
      ...prevParams,
      pagination: {
        ...prevParams.pagination,
        pageIndex: 1,
        status: value,
      },
    }));
  };

  const onChangeGender = (value) => {
    setTableParams((prevParams) => ({
      ...prevParams,
      pagination: {
        ...prevParams.pagination,
        pageIndex: 1,
        gender: value,
      },
    }));
  };

  const [idChangeStatus, setIdChangeStatus] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [statusToChange, setStatusToChange] = useState(null);

  const handleChangeStatus = async (id, newStatus) => {
    const response = await changeStatus(id, newStatus);
    if (response && response.success) {
      toast.success(response.message || "Cập nhật trạng thái thành công!");
      fetchData();
    } else {
      toast.error(response?.message || "Có lỗi xảy ra khi cập nhật trạng thái.");
    }
  };

  const handleOk = () => {
    if (idChangeStatus !== null && statusToChange !== null) {
      handleChangeStatus(idChangeStatus, statusToChange);
    }
    setIsModalVisible(false);
    setIdChangeStatus(null);
    setStatusToChange(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIdChangeStatus(null);
    setStatusToChange(null);
  };

  const showModal = (id, currentStatus) => {
    setIdChangeStatus(id);
    setStatusToChange(currentStatus === 1 ? 0 : 1);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      width: 70,
      align: "center",
      render: (_, __, index) => (
        (tableParams.pagination.pageIndex - 1) * tableParams.pagination.pageSize + index + 1
      ),
    },
   {
  title: "Ảnh",
  dataIndex: "imageUrl",
  key: "imageUrl",
  width: 80,
  align: "center",
  render: (imageUrl) => {
    if (imageUrl) {
      // Nối REACT_APP_API_KEY với imageUrl
      // Quan trọng: imageUrl từ BE có thể đã có dấu '/' ở đầu hoặc không.
      // Cần đảm bảo không có dấu // kép.
      let fullImageUrl = imageUrl;
      const backendBaseUrl = process.env.REACT_APP_API_KEY; // Ví dụ: http://localhost:8080

      if (backendBaseUrl) {
        // Xóa dấu / ở cuối backendBaseUrl nếu có
        const cleanBackendBaseUrl = backendBaseUrl.endsWith('/') ? backendBaseUrl.slice(0, -1) : backendBaseUrl;
        // Xóa dấu / ở đầu imageUrl nếu có
        const cleanImageUrl = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl;
        fullImageUrl = `${cleanBackendBaseUrl}/${cleanImageUrl}`;
      }

      return <Image width={50} height={50} src={fullImageUrl} style={{ objectFit: 'cover' }} preview={{ mask: <div style={{ background: 'rgba(0, 0, 0, 0.5)', color: 'white', padding: '2px 5px', fontSize: '12px' }}>Xem</div> }} />;
    }
    return 'N/A';
  },
},
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
      width: 130,
    },
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
      width: 200,
    },
    {
      title: "SĐT",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 120,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 220,
    },
    {
      title: "Ngày sinh",
      dataIndex: "dateBirth",
      key: "dateBirth",
      width: 120,
      align: "center",
      render: (dateBirth) => {
        if (!dateBirth) return 'N/A';
        const date = parseISO(dateBirth);
        return isValid(date) ? format(date, "dd-MM-yyyy") : 'N/A';
      }
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "userName",
      key: "userName",
      width: 150,
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      width: 100,
      align: "center",
      render: (gender) => {
        if (gender === true) return "Nam";
        if (gender === false) return "Nữ";
        return "Khác";
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 130,
      align: "center",
      render: (status) => {
        if (status === 1) return "Hoạt động";
        if (status === 0) return "Không hoạt động";
        return "N/A";
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 180,
      align: "center",
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <UserAddOrChange
            fetchData={fetchData}
            modelItem={record}
            textButton={"Sửa"}
            isStyle={false}
          />
          {record.status === 1 && (
            <Button
              type="primary"
              danger
              onClick={() => showModal(record.id, record.status)}
            >
              Khóa
            </Button>
          )}
          {record.status === 0 && (
            <Button
              onClick={() => showModal(record.id, record.status)}
              style={{ backgroundColor: '#52c41a', color: 'white', borderColor: '#52c41a' }}
            >
              Mở khóa
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <CommonPopup
        visible={isModalVisible}
        title="Xác nhận"
        content={<p>Bạn có chắc chắn muốn {statusToChange === 1 ? 'mở khóa' : 'khóa'} người dùng này không?</p>}
        onClose={handleCancel}
        onOk={handleOk}
        okText="Đồng ý"
        cancelText="Hủy"
      />
      <Form
        form={form}
        layout="vertical"
        style={{ marginBottom: 20 }}
      >
        <Row gutter={[16, 8]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item
              label="Tìm kiếm"
              name="keySearch"
            >
              <Input
                placeholder="Mã, tên, SĐT, email..."
                onChange={onSearchByKey}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={5}>
            <Form.Item label="Trạng thái" name="status">
              <Select
                placeholder="Chọn trạng thái"
                onChange={onChangeStatus}
                allowClear
                style={{ width: "100%" }}
              >
                <Option value={1}>Hoạt động</Option>
                <Option value={0}>Không hoạt động</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={5}>
            <Form.Item label="Giới tính" name="gender">
              <Select
                placeholder="Chọn giới tính"
                onChange={onChangeGender}
                allowClear
                style={{ width: "100%" }}
              >
                <Option value={true}>Nam</Option>
                <Option value={false}>Nữ</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={8} style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
             <Button
                type="default"
                onClick={() => {
                  form.resetFields(['keySearch', 'status', 'gender']);
                  setTableParams(prev => ({
                    ...prev,
                    pagination: {
                      ...prev.pagination,
                      pageIndex: 1,
                      keySearch: "",
                      status: null,
                      gender: null,
                    },
                  }));
                }}
                style={{ marginBottom: '8px' }}
              >
                Thiết lập lại
              </Button>
            <UserAddOrChange
              fetchData={fetchData}
              modelItem={null}
              textButton={"Thêm mới người dùng"}
              isStyle={true}
            />
          </Col>
        </Row>
      </Form>
      <Table
        dataSource={user}
        columns={columns}
        rowKey="id"
        pagination={false}
        loading={loading}
        onChange={handleTableAntdChange}
        scroll={{ x: 1500 }}
        bordered
        size="middle"
      />
      <Pagination
        current={tableParams.pagination.pageIndex}
        pageSize={tableParams.pagination.pageSize}
        total={total}
        showSizeChanger
        showQuickJumper
        onChange={onPaginationChange}
        onShowSizeChange={onPaginationChange}
        style={{ textAlign: "center", marginTop: "20px" }}
        pageSizeOptions={['10', '20', '50', '100']}
        showTotal={(totalRecords, range) => `${range[0]}-${range[1]} của ${totalRecords} mục`}
      />
    </>
  );
}

export default ManagerUser;