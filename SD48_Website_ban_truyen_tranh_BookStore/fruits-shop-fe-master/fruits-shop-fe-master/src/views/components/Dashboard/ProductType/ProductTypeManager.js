import React, { useEffect, useState, useCallback, useRef } from "react";
import { Button, Select, Table, Space, App, Tooltip, Typography, Tag } from "antd";
import { toast } from "react-toastify";
import { Pagination } from "antd";
import useType from "@api/useType";
import ProductTypeAdd from "./ProductTypeAdd";
import { Col, Form, Input, Row, Modal as AntdModal } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import CommonPopup from "./../Common/CommonPopup";
import useUser from "@store/useUser";

const { Title } = Typography;
const { confirm } = AntdModal;

function ProductTypeManager() {
  const { getListType: getListTypeFromHook, changeStatus: changeTypeStatusApiFromHook } = useType();
  const { Option } = Select;
  const { roleCode } = useUser();
  const { message: antdMessageFromHook } = App.useApp();

  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterForm] = Form.useForm();
  const [total, setTotal] = useState(0);

  const [isAddEditModalVisible, setIsAddEditModalVisible] = useState(false);
  const [editingType, setEditingType] = useState(null);

  const [tableParams, setTableParams] = useState({
    pageIndex: 1,
    pageSize: 10,
    keySearch: "",
    status: null,
  });

  const getListTypeRef = useRef(getListTypeFromHook);
  const changeTypeStatusApiRef = useRef(changeTypeStatusApiFromHook);
  const antdMessageRef = useRef(antdMessageFromHook);

  useEffect(() => {
    getListTypeRef.current = getListTypeFromHook;
  }, [getListTypeFromHook]);

  useEffect(() => {
    changeTypeStatusApiRef.current = changeTypeStatusApiFromHook;
  }, [changeTypeStatusApiFromHook]);

  useEffect(() => {
    antdMessageRef.current = antdMessageFromHook;
  }, [antdMessageFromHook]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const paramsToApi = {
        pageIndex: tableParams.pageIndex - 1,
        pageSize: tableParams.pageSize,
        keySearch: tableParams.keySearch,
        status: tableParams.status,
      };
      const response = await getListTypeRef.current(paramsToApi);
      if (response && response.success && response.data && response.data.data) {
        setTypes(response.data.data);
        setTotal(response.data.totalCount || 0);
      } else {
        antdMessageRef.current.error(response?.data?.message || response?.message || "Lỗi khi tải danh sách gói bán.");
        setTypes([]);
        setTotal(0);
      }
    } catch (error) {
      antdMessageRef.current.error(error?.message || "Lỗi kết nối khi tải danh sách gói bán.");
      setTypes([]);
      setTotal(0);
    }
    setLoading(false);
  }, [tableParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (changedValues, allValues) => {
    setTableParams(prevParams => ({
      ...prevParams,
      ...allValues,
      pageIndex: 1,
    }));
  };

  const handleResetFilter = () => {
    filterForm.resetFields();
    setTableParams({
      pageIndex: 1,
      pageSize: 10,
      keySearch: "",
      status: null,
    });
  };
  
  const handleTableAntdChange = (pagination, filters, sorter) => {
    // Placeholder
  };

  const handlePageChange = (page, pageSize) => {
    setTableParams(prevParams => ({
        ...prevParams,
        pageIndex: page,
        pageSize: pageSize,
    }));
  };
  
  const onShowSizeChangeAntd = (current, size) => {
    setTableParams(prevParams => ({
        ...prevParams,
        pageIndex: 1,
        pageSize: size,
    }));
  };

  const [idToChangeStatus, setIdToChangeStatus] = useState(null);
  const [statusToSet, setStatusToSet] = useState(null);
  const [isConfirmStatusModalVisible, setIsConfirmStatusModalVisible] = useState(false);

  const handleChangeStatus = useCallback(async () => {
    if (idToChangeStatus === null || statusToSet === null) return;
    try {
      const response = await changeTypeStatusApiRef.current(idToChangeStatus, statusToSet);
      if (response && response.success && response.data?.success !== false) {
        antdMessageRef.current.success(response.data?.message || "Cập nhật trạng thái thành công!");
        fetchData();
      } else {
        antdMessageRef.current.error(response?.data?.message || response?.message || "Cập nhật trạng thái thất bại.");
      }
    } catch (error) {
      antdMessageRef.current.error(error?.message || "Lỗi khi cập nhật trạng thái.");
    }
    setIsConfirmStatusModalVisible(false);
    setIdToChangeStatus(null);
    setStatusToSet(null);
  }, [idToChangeStatus, statusToSet, fetchData]);

  const showConfirmChangeStatusModal = (id, newStatus) => {
    setIdToChangeStatus(id);
    setStatusToSet(newStatus);
    setIsConfirmStatusModalVisible(true);
  };

  const handleAddOrEdit = (record = null) => {
    setEditingType(record);
    setIsAddEditModalVisible(true);
  };

  const handleModalSuccess = () => {
    setIsAddEditModalVisible(false);
    setEditingType(null);
    fetchData();
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      width: 60,
      align: 'center',
      render: (_, __, index) => (tableParams.pageIndex - 1) * tableParams.pageSize + index + 1,
    },
    {
      title: "Mã Gói",
      dataIndex: "code",
      key: "code",
      width: 120,
    },
    {
      title: "Tên Gói bán",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (text) => text || <span style={{color: '#ccc'}}>N/A</span>
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: 'center',
      render: (status) => (
        status === 1 ? <Tag color="green">Hoạt động</Tag> : <Tag color="red">Không hoạt động</Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 180,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        roleCode === "ADMIN" && (
          <Space>
            <Tooltip title="Sửa">
              <Button icon={<EditOutlined />} onClick={() => handleAddOrEdit(record)} size="small" />
            </Tooltip>
            {record.status === 1 ? (
              <Tooltip title="Khóa">
                <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => showConfirmChangeStatusModal(record.id, 0)} size="small">
                  Khóa
                </Button>
              </Tooltip>
            ) : (
              <Tooltip title="Mở khóa">
                <Button icon={<PlusOutlined />} onClick={() => showConfirmChangeStatusModal(record.id, 1)} size="small" style={{borderColor: 'green', color: 'green'}}>
                  Mở khóa
                </Button>
              </Tooltip>
            )}
          </Space>
        )
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#fff', borderRadius: 8 }}>
      <CommonPopup
        visible={isConfirmStatusModalVisible}
        title="Xác nhận thay đổi trạng thái"
        content={<p>Bạn có chắc chắn muốn thay đổi trạng thái của gói bán này?</p>}
        onClose={() => setIsConfirmStatusModalVisible(false)}
        onOk={handleChangeStatus}
      />
      <ProductTypeAdd
        visible={isAddEditModalVisible}
        onClose={() => { setIsAddEditModalVisible(false); setEditingType(null); }}
        onSuccess={handleModalSuccess}
        initialData={editingType}
      />

      <Title level={4} style={{ marginBottom: 20, color: '#0056b3' }}>Quản lý Gói bán</Title>
      
      <Form
        form={filterForm}
        layout="inline"
        onValuesChange={handleFilterChange}
        style={{ marginBottom: 20 }}
        initialValues={{ status: null, keySearch: "" }}
      >
        <Form.Item name="keySearch" style={{ flexGrow: 1, marginRight: 8 }}>
          <Input prefix={<SearchOutlined />} placeholder="Tìm theo mã, tên gói bán..." allowClear />
        </Form.Item>
        <Form.Item name="status" style={{ width: 180, marginRight: 8 }}>
          <Select placeholder="Chọn trạng thái" allowClear>
            <Option value={1}>Hoạt động</Option>
            <Option value={0}>Không hoạt động</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button icon={<ReloadOutlined />} onClick={handleResetFilter}>
            Làm mới
          </Button>
        </Form.Item>
        {roleCode === "ADMIN" && (
          <Form.Item style={{ marginLeft: 'auto' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAddOrEdit(null)} style={{ background: '#1fbf39', borderColor: '#1fbf39' }}>
              Thêm Gói bán
            </Button>
          </Form.Item>
        )}
      </Form>

      <Table
        columns={columns}
        dataSource={types}
        loading={loading}
        rowKey="id"
        pagination={false}
        onChange={handleTableAntdChange}
        bordered
        scroll={{ x: 'max-content' }}
        locale={{ emptyText: 'Không có dữ liệu' }}
      />
      <Pagination
        current={tableParams.pageIndex}
        pageSize={tableParams.pageSize}
        total={total}
        showSizeChanger
        showQuickJumper
        showTotal={(totalData) => `Tổng cộng ${totalData} gói bán`}
        onChange={handlePageChange}
        onShowSizeChange={onShowSizeChangeAntd}
        style={{ marginTop: 20, textAlign: 'right' }}
        pageSizeOptions={['10', '20', '50', '100']}
        locale={{items_per_page: " gói/trang"}}
      />
    </div>
  );
}

const ProductTypeManagerWrapper = () => (
    <App>
        <ProductTypeManager />
    </App>
);

export default ProductTypeManagerWrapper;