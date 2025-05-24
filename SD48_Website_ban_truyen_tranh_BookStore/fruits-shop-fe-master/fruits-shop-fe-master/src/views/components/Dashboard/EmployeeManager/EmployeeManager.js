import {
  Col,
  Form,
  Input,
  Button,
  Row,
  Select,
  Table,
  Pagination,
  Space,
  Image, // Thêm Image để hiển thị ảnh
} from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import EmployeeAddOrChange from "./EmployeeAddOrChange";
import useUser from "@api/useUser";
import { format, isValid, parseISO } from "date-fns"; // Thêm isValid, parseISO
import CommonPopup from "./../Common/CommonPopup"; // Giả sử đường dẫn đúng

const { Option } = Select; // Lấy Option từ Select đã import

function EmployeeManager() {
  const [users, setUsers] = useState([]); // Đổi tên user thành users cho rõ ràng là mảng
  const { getListUser, changeStatus } = useUser();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [tableParams, setTableParams] = useState({
    pagination: {
      pageIndex: 1,
      pageSize: 10,
      keySearch: "",
      roleId: 6, // Giữ nguyên vai trò nhân viên
      status: null,
      gender: null,
    },
  });

  const fetchData = async () => {
    setLoading(true);
    const paramsToFetch = { ...tableParams.pagination };
    if (!paramsToFetch.keySearch) delete paramsToFetch.keySearch;
    if (paramsToFetch.status === null || paramsToFetch.status === undefined) delete paramsToFetch.status;
    if (paramsToFetch.gender === null || paramsToFetch.gender === undefined) delete paramsToFetch.gender;
    
    const response = await getListUser(paramsToFetch);
    if (response && response.success && response.data && response.data.data) {
      setUsers(response.data.data);
      setTotal(response.data.totalCount || 0);
      // Bỏ toast success khi fetch list
    } else {
      toast.error(response?.message || "Lỗi tải danh sách nhân viên.");
      setUsers([]);
      setTotal(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableParams.pagination.pageIndex, tableParams.pagination.pageSize, tableParams.pagination.keySearch, tableParams.pagination.roleId, tableParams.pagination.status, tableParams.pagination.gender]);


  const handleTableAntdChange = (paginationConfig, filters, sorter) => {
    setTableParams(prev => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        pageIndex: paginationConfig.current,
        pageSize: paginationConfig.pageSize,
      },
      // Xử lý filters, sorter nếu cần
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
    setStatusToChange(currentStatus === 1 ? 0 : 1); // 0 là khóa, 1 là mở
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
          let fullImageUrl = imageUrl;
          const backendBaseUrl = process.env.REACT_APP_API_KEY;
          if (backendBaseUrl) {
            const cleanBackendBaseUrl = backendBaseUrl.endsWith('/') ? backendBaseUrl.slice(0, -1) : backendBaseUrl;
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
        return "Khác"; // Hoặc N/A nếu backend không có giá trị "Khác"
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
          <EmployeeAddOrChange
            fetchData={fetchData}
            modelItem={record}
            textButton={"Sửa"}
            isStyle={false} // Giả sử nút sửa không cần style đặc biệt như nút thêm
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
        content={<p>Bạn có chắc chắn muốn {statusToChange === 1 ? 'mở khóa' : 'khóa'} nhân viên này không?</p>}
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
                {/* <Option value={null}>Khác</Option>  // Nếu backend hỗ trợ null cho "Khác" */}
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
            <EmployeeAddOrChange
              fetchData={fetchData}
              modelItem={null}
              textButton={"Thêm mới nhân viên"}
              isStyle={true} // Giữ style cho nút thêm mới
            />
          </Col>
        </Row>
      </Form>
      <Table
        dataSource={users} // Đổi user thành users
        columns={columns}
        rowKey="id"
        pagination={false}
        loading={loading}
        onChange={handleTableAntdChange}
        scroll={{ x: 1600 }} // Tăng scroll x vì thêm cột ảnh
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
        onShowSizeChange={onPaginationChange} // onShowSizeChange của Antd cũng trả về (current, size)
        style={{ textAlign: "center", marginTop: "20px" }}
        pageSizeOptions={['10', '20', '50', '100']}
        showTotal={(totalRecords, range) => `${range[0]}-${range[1]} của ${totalRecords} mục`}
      />
    </>
  );
}

export default EmployeeManager;