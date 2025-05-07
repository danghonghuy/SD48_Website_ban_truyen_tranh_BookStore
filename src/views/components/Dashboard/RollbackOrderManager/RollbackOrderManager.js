import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons"
import useOrder from '@api/useOrder';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Pagination, Table, Space, Button } from 'antd';
import { Col, Form, Input, Modal, Row, Select, DatePicker } from "antd";

function formatCurrencyVND(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function RollbackOrderManager() {

    const { RangePicker } = DatePicker;

    const [dates, setDates] = useState([]);
    const { getAll } = useOrder()
    const [orders, setOrder] = useState([])
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState()
    const [tableParams, setTableParams] = useState({
        pagination: {
            pageIndex: 1,
            pageSize: 10
        }
    });

    const handleDateChange = (value) => {
        setDates(value); // value is an array of two moment objects (startDate, endDate)
    };

    const fetchData = async () => {
        const { success, data } = await getAll(tableParams.pagination);
        console.log(data);
        if (success && data.status != 'Error') {
            setOrder(data.data.items)
            setLoading(false)
            setTotal(data.data.totalCount)
        } else {
            toast.error(data.message)
        }
    }
    // useEffect(() => {
    //     fetchData()    
    // }, [JSON.stringify(tableParams), loading])

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setOrder([]);
        }
    }

    const onShowSizeChange = (current, pageSize) => {
        setTableParams({
            pagination: {
                pageIndex: current,
                pageSize: pageSize
            }
        })
    }
    const columns = [
        {
            title: 'STT',
            render: (data) => {
                return (<p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{`${data.orderNumber}`}</p>)
            }
        },
        {
            title: 'Order code',
            render: (data) => {
                return (<p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{`${data.orderCode}`}</p>)
            }
        },
        {
            title: 'Customer name',
            render: (data) => {
                return (<p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{`${data.customerName}`}</p>)
            }
        },
        {
            title: 'Phone number',
            render: (data) => {
                return (<p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{`${data.phoneNumber}`}</p>)
            }
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'addressDetail',
            render: (_, record) => <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{record.addressDetail}</p>
        },
        {
            title: 'Employee name',
            dataIndex: 'employeeName',
            key: 'employeeName',
            render: (_, record) => <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{record.employeeName}</p>
        },
        {
            title: 'Order status',
            dataIndex: 'orderStatus',
            key: 'orderStatus',
            render: (_, record) => <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{record.orderStatus}</p>
        },
        {
            title: 'Price',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (_, data) => {
                return (<p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{formatCurrencyVND(data.totalPrice)}</p>)
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Link to={record.id}>
                        <Button type='primary' title='Detail Order'>
                            <FontAwesomeIcon icon={faCircleInfo} />
                        </Button>
                    </Link>

                </Space>
            ),
        },

    ]
    return (
        <>
            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <Form.Item
                        label="Key search"
                        name="productName"
                        rules={[{ required: false, message: "Please input product name!" }]}><Input placeholder="Enter code, name order..." />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item
                        label="Khách hàng"
                        name="productName"
                        rules={[{ required: false, message: "Please input product name!" }]}><Input placeholder="Enter code, phone number, name customer..." />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item
                        label="Thanh toán"
                        name="originId"
                    >
                        <Select
                            placeholder="Please select"
                            onChange={null}
                            style={{
                                width: '100%',
                            }}
                            options={origin}
                        />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item
                        label="Nhân viên"
                        name="productName"
                        rules={[{ required: false, message: "Please input product name!" }]}><Input placeholder="Enter code, phone number, name employee..." />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                <Col span={10}>
                    <Form.Item
                        label="Giá trị đơn hàng"
                        name="productName"
                        rules={[{ required: false, message: "Please input product name!" }]}>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Input placeholder="Enter start price" type="number" /></Col>
                            <Col span={12}>
                                <Input placeholder="Enter end price" type="number" /></Col>

                        </Row>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        label="Thời gian"
                        name="productName"
                        rules={[{ required: false, message: "Please input product name!" }]}>
                        <RangePicker
                            value={dates}
                            onChange={null}
                            format="YYYY-MM-DD" // Format the date as YYYY-MM-DD
                            placeholder={['Start Date', 'End Date']}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                </Col>
                 <Col span={6}>
                                    <Form.Item
                                        label="Trạng thái"
                                        name="originId"
                                    >
                                        <Select
                                            placeholder="Please select"
                                            onChange={null}
                                            style={{
                                                width: '100%',
                                            }}
                                            options={origin}
                                        />
                
                                    </Form.Item>
                                </Col>
            </Row>
            <Table
                dataSource={orders}
                columns={columns}
                pagination={false}
                loading={loading}
                onChange={handleTableChange}
            />
            <Pagination showSizeChanger
                onChange={onShowSizeChange}
                style={{ textAlign: 'center', marginTop: '1.5rem' }}
                defaultCurrent={tableParams.pagination.pageIndex}
                total={total} />
        </>
    )
}

export default RollbackOrderManager