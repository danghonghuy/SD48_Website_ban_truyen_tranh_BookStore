import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Menu, Select, Table } from 'antd';
import { toast } from 'react-toastify';
import { Pagination } from 'antd';
import useCategory from '@api/useCategory';
import AddBranch from './AddBranch';
import { Col, Form, Input, Modal, Row } from "antd";
import { DownOutlined } from '@ant-design/icons';
import { Option } from 'antd/es/mentions';

function BranchManager() {
    const { getListCategory } = useCategory()

    const [branch, setBranch] = useState([])
    const [loading, setLoading] = useState(false);

    const [total, setTotal] = useState();
    const [tableParams, setTableParams] = useState({
        pagination: {
            pageIndex: 1,
            pageSize: 10,
            keySearch: "",
            status: -1
        },
    });

    const fetchData = async () => {
        const { success, data } = await getListCategory(tableParams.pagination);
        if (!success || data.status == 'Error') {
            toast.error('Có lỗi xảy ra')
        } else {
            setBranch(data.data)
            setLoading(false);
            setTotal(data.totalCount)
        }
    }

    useEffect(() => {
        fetchData()
    }, [JSON.stringify(tableParams), loading]);

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setBranch([]);
        }
    };
    const onShowSizeChange = (current, pageSize) => {
        setTableParams({
            pagination: {
                pageIndex: current,
                pageSize: pageSize
            }
        })
    };
    const columns = [
        {
            title: 'STT',
            dataIndex: 'orderNumber',
            key: 'orderNumber',
            render: (_, __, index) => <a style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{index + 1}</a>,
        },
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
            render: (text) => <a style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{text}</a>,
        },

        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => <a style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{record.name}</a>
        },
        {
            title: 'Danh mục',
            dataIndex: 'catalogName',
            key: 'catalogName',
            render: (_, record) => <a style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{record.catalogName}</a>
        },

        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            render: (text) => <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{text}</p>
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (value) => {
                if (value == 1) {
                    return <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>Hoạt động</p>
                } else {
                    return <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>Không hoạt động</p>
                }
            }
        },
        {

            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Dropdown overlay={menu(record)} trigger={['click']}>
                    <Button>
                        Actions <DownOutlined />
                    </Button>
                </Dropdown>
            ),
        },
    ];

    const handleChangeName = (e) => {
        setTableParams((prevParms) => ({
            ...prevParms,
            pagination: {
                ...prevParms.pagination,
                keySearch: e.target.value
            }
        }));
    }

    const handleChangeSelect = (value) => {
        setTableParams((prevParms) => ({
            ...prevParms,
            pagination: {
                ...prevParms.pagination,
                status: value
            }
        }));
    };

    const menu = (record) => (
        <Menu>
            <Menu.Item onClick={() => handleMenuClick('Edit', record)}>Edit</Menu.Item>
            <Menu.Item onClick={() => handleMenuClick('Delete', record)}>Delete</Menu.Item>
        </Menu>
    );

    const handleMenuClick = (action, record) => {
        console.log(`${action} action on row`, record);
    };

    return (
        <>
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <Form.Item
                        label="Key search"
                        name="productName"
                        rules={[{ required: false, message: "Please input product name!" }]}><Input placeholder="Enter code, name category" onChange={(e) => handleChangeName(e)} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        label="Trạng thái"
                        name="originId"
                    >
                        <Select
                            value={tableParams.pagination.status}
                            placeholder="Please select"
                            onChange={handleChangeSelect}
                            style={{
                                width: '100%',
                            }}
                        >
                            <Option value={-1}>Tất cả</Option>
                            <Option value={1}>Hoạt động</Option>
                            <Option value={2}>Không hoạt động</Option>
                        </Select>

                    </Form.Item>
                </Col>
                <Col span={8} style={{ textAlign: 'right' }}>
                    <AddBranch fechtList={fetchData}/>
                </Col>
            </Row>
            <Table
                dataSource={branch} columns={columns}
                pagination={false}
                loading={loading}
                onChange={handleTableChange}
            />
            <Pagination
                showSizeChanger
                onChange={onShowSizeChange}
                style={{ textAlign: 'center', marginTop: '1.5rem' }}
                defaultCurrent={tableParams.pagination.pageIndex}
                total={total}
            />
        </>
    );
}

export default BranchManager;