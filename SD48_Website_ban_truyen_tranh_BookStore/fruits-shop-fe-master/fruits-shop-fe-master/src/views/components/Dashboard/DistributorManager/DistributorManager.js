// src/pages/DistributorManager/DistributorManager.js
import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Input, Space, Modal, Form, App, Typography, Tooltip, Pagination } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import useDistributor from '@api/useDistributor'; // Bạn đã có hook này
import AddDistributorModal from './AddDistributorModal';
import dayjs from 'dayjs';

const { Title } = Typography;
const { confirm } = Modal;

function DistributorManager() {
  const { message: antdMessage } = App.useApp();
  const { getListDistributors, deleteDistributorById } = useDistributor(); // Giả sử tên hàm là vậy

  const [distributors, setDistributors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDistributor, setEditingDistributor] = useState(null);
  const [filterForm] = Form.useForm();

  const [tableParams, setTableParams] = useState({
    pagination: {
      pageIndex: 1,
      pageSize: 10,
    },
    keySearch: '',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        pageIndex: tableParams.pagination.pageIndex -1 ,
        pageSize: tableParams.pagination.pageSize,
        keySearch: tableParams.keySearch,
      };
      const response = await getListDistributors(params);
      if (response && response.success && response.data && response.data.data) {
        setDistributors(response.data.data);
        setTotal(response.data.totalCount || 0);
      } else {
        antdMessage.error(response?.data?.message || 'Lỗi khi tải danh sách NPH.');
        setDistributors([]);
        setTotal(0);
      }
    } catch (error) {
      antdMessage.error('Lỗi kết nối khi tải danh sách NPH.');
      setDistributors([]);
      setTotal(0);
    }
    setLoading(false);
  }, [getListDistributors, tableParams, antdMessage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdd = () => {
    setEditingDistributor(null);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingDistributor(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa Nhà Phát Hành này?',
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const response = await deleteDistributorById(id);
          if (response && response.success) {
            antdMessage.success('Xóa NPH thành công!');
            fetchData();
          } else {
            antdMessage.error(response?.data?.message || 'Xóa NPH thất bại.');
          }
        } catch (error) {
          antdMessage.error('Lỗi khi xóa NPH.');
        }
      },
    });
  };

  const handleModalSuccess = () => {
    setIsModalVisible(false);
    fetchData();
  };

  const handleTableChange = (pagination) => {
    setTableParams(prev => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        pageIndex: pagination.current,
        pageSize: pagination.pageSize,
      },
    }));
  };
  
  const onShowSizeChange = (current, pageSize) => {
    setTableParams(prev => ({
        ...prev,
        pagination: {
            ...prev.pagination,
            pageIndex: 1,
            pageSize,
        },
    }));
  };

  const handleFilterSearch = (values) => {
    setTableParams(prev => ({
        ...prev,
        pagination: {
            ...prev.pagination,
            pageIndex: 1,
        },
        keySearch: values.keySearch || '',
    }));
  };

  const handleResetFilter = () => {
    filterForm.resetFields();
    setTableParams({
        pagination: { pageIndex: 1, pageSize: 10 },
        keySearch: '',
    });
  };

  const columns = [
    {
      title: 'STT',
      key: 'stt',
      width: 60,
      align: 'center',
      render: (_, __, index) => (tableParams.pagination.pageIndex - 1) * tableParams.pagination.pageSize + index + 1,
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      align: 'center',
    },
    {
      title: 'Tên Nhà Phát Hành',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: 'Thông tin liên hệ',
      dataIndex: 'contactInfo',
      key: 'contactInfo',
      ellipsis: true,
      render: (text) => text || <span style={{color: '#ccc'}}>N/A</span>
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text) => text || <span style={{color: '#ccc'}}>N/A</span>
    },
 
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Sửa">
            <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} size="small" />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} size="small" danger />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#fff', borderRadius: 8 }}>
      <Title level={4} style={{ marginBottom: 20, color: '#0056b3' }}>Quản lý Nhà Phát Hành</Title>

      <Form
        form={filterForm}
        layout="inline"
        onFinish={handleFilterSearch}
        style={{ marginBottom: 20 }}
      >
        <Form.Item name="keySearch">
          <Input prefix={<SearchOutlined />} placeholder="Tìm theo tên NPH..." allowClear style={{width: 250}}/>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
            Tìm kiếm
          </Button>
        </Form.Item>
        <Form.Item>
          <Button icon={<ReloadOutlined />} onClick={handleResetFilter}>
            Làm mới
          </Button>
        </Form.Item>
        <Form.Item style={{ marginLeft: 'auto' }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ background: '#1fbf39', borderColor: '#1fbf39' }}>
            Thêm NPH
          </Button>
        </Form.Item>
      </Form>

      <Table
        columns={columns}
        dataSource={distributors}
        loading={loading}
        rowKey="id"
        pagination={false}
        bordered
        scroll={{ x: 'max-content' }}
        locale={{ emptyText: 'Không có dữ liệu' }}
      />
       <Pagination
          current={tableParams.pagination.pageIndex}
          pageSize={tableParams.pagination.pageSize}
          total={total}
          showSizeChanger
          showQuickJumper
          showTotal={(totalData) => `Tổng cộng ${totalData} NPH`}
          onChange={(page, pageSize) => handleTableChange({ current: page, pageSize })}
          onShowSizeChange={onShowSizeChange}
          style={{ marginTop: 20, textAlign: 'right' }}
          pageSizeOptions={['10', '20', '50', '100']}
          locale={{items_per_page: " NPH/trang"}}
        />

      <AddDistributorModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSuccess={handleModalSuccess}
        initialData={editingDistributor}
      />
    </div>
  );
}

const DistributorManagerWrapper = () => (
    <App>
        <DistributorManager />
    </App>
);

export default DistributorManagerWrapper;