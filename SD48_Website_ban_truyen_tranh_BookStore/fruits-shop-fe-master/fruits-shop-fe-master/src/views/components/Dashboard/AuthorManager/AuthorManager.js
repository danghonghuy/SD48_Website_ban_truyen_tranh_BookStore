// src/pages/AuthorManager/AuthorManager.js
import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Input, Space, Modal, Form, App, Typography, Tooltip, Pagination } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import useAuthor from '@api/useAuthor';
import AddAuthorModal from './AddAuthorModal';
import dayjs from 'dayjs';

const { Title } = Typography;
const { confirm } = Modal;

function AuthorManager() {
  const { message: antdMessage } = App.useApp();
  const { getListAuthors, deleteAuthorById } = useAuthor();

  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);
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
        pageIndex: tableParams.pagination.pageIndex -1,
        pageSize: tableParams.pagination.pageSize,
        keySearch: tableParams.keySearch,
      };
      const response = await getListAuthors(params);
      if (response && response.success && response.data && response.data.data) {
        setAuthors(response.data.data);
        setTotal(response.data.totalCount || 0);
      } else {
        antdMessage.error(response?.data?.message || 'Lỗi khi tải danh sách tác giả.');
        setAuthors([]);
        setTotal(0);
      }
    } catch (error) {
      antdMessage.error('Lỗi kết nối khi tải danh sách tác giả.');
      setAuthors([]);
      setTotal(0);
    }
    setLoading(false);
  }, [getListAuthors, tableParams, antdMessage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdd = () => {
    setEditingAuthor(null);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingAuthor(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa tác giả này?',
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const response = await deleteAuthorById(id);
          if (response && response.success) {
            antdMessage.success('Xóa tác giả thành công!');
            fetchData();
          } else {
            antdMessage.error(response?.data?.message || 'Xóa tác giả thất bại.');
          }
        } catch (error) {
          antdMessage.error('Lỗi khi xóa tác giả.');
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
      title: 'Tên Tác giả',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
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
      <Title level={4} style={{ marginBottom: 20, color: '#0056b3' }}>Quản lý Tác giả</Title>

      <Form
        form={filterForm}
        layout="inline"
        onFinish={handleFilterSearch}
        style={{ marginBottom: 20 }}
      >
        <Form.Item name="keySearch">
          <Input prefix={<SearchOutlined />} placeholder="Tìm theo tên tác giả..." allowClear style={{width: 250}}/>
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
            Thêm Tác giả
          </Button>
        </Form.Item>
      </Form>

      <Table
        columns={columns}
        dataSource={authors}
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
          showTotal={(totalData) => `Tổng cộng ${totalData} tác giả`}
          onChange={(page, pageSize) => handleTableChange({ current: page, pageSize })}
          onShowSizeChange={onShowSizeChange}
          style={{ marginTop: 20, textAlign: 'right' }}
          pageSizeOptions={['10', '20', '50', '100']}
          locale={{items_per_page: " tác giả/trang"}}
        />

      <AddAuthorModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSuccess={handleModalSuccess}
        initialData={editingAuthor}
      />
    </div>
  );
}

const AuthorManagerWrapper = () => (
    <App>
        <AuthorManager />
    </App>
);

export default AuthorManagerWrapper;