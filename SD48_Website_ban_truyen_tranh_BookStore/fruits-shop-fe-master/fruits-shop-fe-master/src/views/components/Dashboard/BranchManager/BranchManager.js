import React, { useEffect, useState, useCallback, useRef } from "react";
import { Button, Select, Table, Space, App, Tooltip, Typography, Tag } from "antd";
import { Pagination } from "antd";
import useCategory from "@api/useCategory";
import AddBranch from "./AddBranch";
import { Col, Form, Input, Row, Modal as AntdModal } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import CommonPopup from "./../Common/CommonPopup";
import useUser from "@store/useUser";

const { Title } = Typography;
const { Option } = Select;
const { confirm } = AntdModal;

function BranchManager() {
  const { getListCategory: getListCategoryFromHook, changeStatus: changeCategoryStatusApiFromHook } = useCategory();
  const { roleCode } = useUser();
  const { message: antdMessageFromHook } = App.useApp();

  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterForm] = Form.useForm();
  const [total, setTotal] = useState(0);

  const [isAddEditModalVisible, setIsAddEditModalVisible] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [keySearch, setKeySearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);

  const getListCategoryRef = useRef(getListCategoryFromHook);
  const changeCategoryStatusApiRef = useRef(changeCategoryStatusApiFromHook);
  const antdMessageRef = useRef(antdMessageFromHook);

  useEffect(() => {
    getListCategoryRef.current = getListCategoryFromHook;
  }, [getListCategoryFromHook]);

  useEffect(() => {
    changeCategoryStatusApiRef.current = changeCategoryStatusApiFromHook;
  }, [changeCategoryStatusApiFromHook]);

  useEffect(() => {
    antdMessageRef.current = antdMessageFromHook;
  }, [antdMessageFromHook]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const paramsToApi = {
        pageIndex: pageIndex - 1,
        pageSize: pageSize,
        keySearch: keySearch,
        status: statusFilter,
      };
      const response = await getListCategoryRef.current(paramsToApi);
      if (response && response.success && response.data && response.data.data) {
        setBranches(response.data.data);
        setTotal(response.data.totalCount || 0);
      } else {
        antdMessageRef.current.error(response?.data?.message || response?.message || "Lỗi khi tải danh sách thể loại.");
        setBranches([]);
        setTotal(0);
      }
    } catch (error) {
      antdMessageRef.current.error(error?.message || "Lỗi kết nối khi tải danh sách thể loại.");
      setBranches([]);
      setTotal(0);
    }
    setLoading(false);
  }, [pageIndex, pageSize, keySearch, statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (changedValues, allValues) => {
    if (changedValues.hasOwnProperty('keySearch')) {
        setKeySearch(allValues.keySearch === undefined ? "" : allValues.keySearch);
    }
    if (changedValues.hasOwnProperty('status')) {
        setStatusFilter(allValues.status);
    }
    setPageIndex(1);
  };

  const handleResetFilter = () => {
    filterForm.resetFields();
    setKeySearch("");
    setStatusFilter(null);
    setPageIndex(1);
  };
  
  const handleTableAntdChange = (pagination, filters, sorter) => {
    // Placeholder for Ant Design Table's own sorting/filtering
  };

  const handlePageChange = (newPage, newPageSize) => {
    setPageIndex(newPage);
    // pageSize được xử lý bởi onShowSizeChangeAntd nếu nó thay đổi
    // Nếu pageSize không đổi, chỉ pageIndex thay đổi
    if (newPageSize && newPageSize !== pageSize) {
        setPageSize(newPageSize);
        // Nếu pageSize thay đổi, thường thì pageIndex cũng nên về 1
        // Tuy nhiên, onShowSizeChangeAntd đã xử lý việc này
    }
  };
  
  const onShowSizeChangeAntd = (current, newSize) => {
    setPageSize(newSize);
    setPageIndex(1);
  };

  const [idToChangeStatus, setIdToChangeStatus] = useState(null);
  const [statusValueToSet, setStatusValueToSet] = useState(null);
  const [isConfirmStatusModalVisible, setIsConfirmStatusModalVisible] = useState(false);

  const handleChangeStatus = useCallback(async () => {
    if (idToChangeStatus === null || statusValueToSet === null) return;
    try {
      const response = await changeCategoryStatusApiRef.current(idToChangeStatus, statusValueToSet);
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
    setStatusValueToSet(null);
  }, [idToChangeStatus, statusValueToSet, fetchData]);

  const showConfirmChangeStatusModal = (id, newStatus) => {
    setIdToChangeStatus(id);
    setStatusValueToSet(newStatus);
    setIsConfirmStatusModalVisible(true);
  };

  const handleAddOrEdit = (record = null) => {
    setEditingBranch(record);
    setIsAddEditModalVisible(true);
  };

  const handleModalSuccess = () => {
    setIsAddEditModalVisible(false);
    setEditingBranch(null);
    fetchData();
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      width: 60,
      align: 'center',
      render: (_, __, index) => (pageIndex - 1) * pageSize + index + 1,
    },
    { title: "Mã Thể loại", dataIndex: "code", key: "code", width: 120 },
    { title: "Tên Thể loại", dataIndex: "name", key: "name", ellipsis: true },
    { title: "Danh mục cha", dataIndex: "catalogName", key: "catalogName", ellipsis: true, render: (text) => text || <span style={{color: '#ccc'}}>N/A</span> },
    { title: "Mô tả", dataIndex: "description", key: "description", ellipsis: true, render: (text) => text || <span style={{color: '#ccc'}}>N/A</span> },
    {
      title: "Trạng thái", dataIndex: "status", key: "status", width: 120, align: 'center',
      render: (statusVal) => (statusVal === 1 ? <Tag color="green">Hoạt động</Tag> : <Tag color="red">Không hoạt động</Tag>),
    },
    {
      title: "Thao tác", key: "action", width: 180, align: 'center', fixed: 'right',
      render: (_, record) => (
        roleCode === "ADMIN" && (
          <Space>
            <Tooltip title="Sửa"><Button icon={<EditOutlined />} onClick={() => handleAddOrEdit(record)} size="small" /></Tooltip>
            {record.status === 1 ? (
              <Tooltip title="Khóa"><Button type="primary" danger icon={<DeleteOutlined />} onClick={() => showConfirmChangeStatusModal(record.id, 0)} size="small">Khóa</Button></Tooltip>
            ) : (
              <Tooltip title="Mở khóa"><Button icon={<PlusOutlined />} onClick={() => showConfirmChangeStatusModal(record.id, 1)} size="small" style={{borderColor: 'green', color: 'green'}}>Mở khóa</Button></Tooltip>
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
        content={<p>Bạn có chắc chắn muốn thay đổi trạng thái của thể loại này?</p>}
        onClose={() => setIsConfirmStatusModalVisible(false)}
        onOk={handleChangeStatus}
      />
      <AddBranch
        visible={isAddEditModalVisible}
        onClose={() => { setIsAddEditModalVisible(false); setEditingBranch(null); }}
        onSuccess={handleModalSuccess}
        initialData={editingBranch}
        fetchData={fetchData}
      />
      <Title level={4} style={{ marginBottom: 20, color: '#0056b3' }}>Quản lý Thể loại</Title>
      <Form
        form={filterForm}
        layout="inline"
        onValuesChange={handleFilterChange}
        style={{ marginBottom: 20 }}
        initialValues={{ status: null, keySearch: "" }}
      >
        <Form.Item name="keySearch" style={{ flexGrow: 1, marginRight: 8 }}>
          <Input prefix={<SearchOutlined />} placeholder="Tìm theo mã, tên thể loại..." allowClear />
        </Form.Item>
        <Form.Item name="status" style={{ width: 180, marginRight: 8 }}>
          <Select placeholder="Chọn trạng thái" allowClear>
            <Option value={1}>Hoạt động</Option>
            <Option value={0}>Không hoạt động</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button icon={<ReloadOutlined />} onClick={handleResetFilter}>Làm mới</Button>
        </Form.Item>
        {roleCode === "ADMIN" && (
          <Form.Item style={{ marginLeft: 'auto' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAddOrEdit(null)} style={{ background: '#1fbf39', borderColor: '#1fbf39' }}>Thêm Thể loại</Button>
          </Form.Item>
        )}
      </Form>
      <Table
        columns={columns}
        dataSource={branches}
        loading={loading}
        rowKey="id"
        pagination={false}
        onChange={handleTableAntdChange}
        bordered
        scroll={{ x: 'max-content' }}
        locale={{ emptyText: 'Không có dữ liệu' }}
      />
      <Pagination
        current={pageIndex}
        pageSize={pageSize}
        total={total}
        showSizeChanger
        showQuickJumper
        showTotal={(totalData) => `Tổng cộng ${totalData} thể loại`}
        onChange={handlePageChange}
        onShowSizeChange={onShowSizeChangeAntd}
        style={{ marginTop: 20, textAlign: 'right' }}
        pageSizeOptions={['10', '20', '50', '100']}
        locale={{items_per_page: " thể loại/trang"}}
      />
    </div>
  );
}

const BranchManagerWrapper = () => (<App><BranchManager /></App>);
export default BranchManagerWrapper;