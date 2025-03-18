import React, { useEffect, useState } from 'react';
import { Button, Menu, Select, Dropdown, Table, Form, Input,    Row, Col } from 'antd';
import { toast } from 'react-toastify';
import { Pagination } from 'antd';
import PaymentAdd from './PaymentAdd';
import usePayment from '@api/usePayment';
import DownOutlined from '@ant-design/icons';

function PaymentManager() {
    const { getListPayment } = usePayment()
    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(false);
    const [searchName, setSearchName] = useState('')
    const [total, setTotal] = useState();
    const [tableParams, setTableParams] = useState({
        pagination: {
            pageIndex: 1,
            pageSize: 10,
            keySearch: ''
        },
    });

    const fetchData = async () => {
        const { success, data } = await getListPayment(tableParams.pagination);
        if (!success || data.status == 'Error') {
            toast.error('Có lỗi xảy ra')
        } else {
            setPayments(data.data)
            setLoading(false);
            setTotal(data.data.totalCount)
        }
    }
    useEffect(() => {
        fetchData()
    }, [JSON.stringify(tableParams), loading, searchName])

    const handleChangeName = (e) => {
        setTableParams((prevPrams) => ({
            ...prevPrams,
            pagination: {
                ...prevPrams.pagination,
                keySearch: e.target.value
            }
        }));
    }
    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setPayments([]);
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
            render: (_, record) => <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{record.name}</p>
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

    const menu = (record) => (
        <Menu>
            <Menu.Item>
                <PaymentAdd fetchData={fetchData} modelItem={record} textButton={"Edit"} isStyle={false} />
            </Menu.Item>
            <Menu.Item>
                <Button
                    type="button"
                    value="small"
                    onClick={null}
                >
                    Delete
                </Button>
            </Menu.Item>
        </Menu >
    );
    return (
        <>
            <Row gutter={[12, 12]}>
                <Col span={16}>
                <Form.Item
                        label="Key search"
                        name="keySearch"
                        rules={[{ required: false, message: "Please input product name!" }]}>
                        <Input placeholder="Enter code, name category" onChange={(e) => handleChangeName(e)} />
                    </Form.Item>
                </Col>
                <Col span={8} style={{ textAlign: 'right' }}>
                    <PaymentAdd fetchData={fetchData} modelItem={null} textButton={"Thêm mới"} isStyle={true} />
                </Col>
            </Row>
            <Table
                dataSource={payments} columns={columns}
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

export default PaymentManager;