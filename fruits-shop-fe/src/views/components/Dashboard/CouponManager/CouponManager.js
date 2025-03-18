import React, { useEffect, useState } from 'react';
import { Button, Select, Dropdown, Table, Menu,DatePicker } from 'antd';
import { toast } from 'react-toastify';
import { Pagination } from 'antd';
import CouponAddOrChange from './CouponAddOrChange';
import { Col, Form, Input, Row } from "antd";
import { DownOutlined } from '@ant-design/icons';
import { Option } from 'antd/es/mentions';
import useCoupon from '../../../../api/useCoupons';
import { format } from 'date-fns';
function CouponManager() {
    const { getListCoupon } = useCoupon();
    const [coupon, setCoupon] = useState([])
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState();
    const [tableParams, setTableParams] = useState({
        pagination: {
            pageIndex: 1,
            pageSize: 10,
            startDate: null, 
            endDate: null, 
            minValue: null, 
            maxValue: null, 
            keySearch: null, 
            status: null
        },
    });
    const { RangePicker } = DatePicker;
        const [dates, setDates] = useState([]);
    const fetchData = async () => {
        const { success, data } = await getListCoupon(tableParams.pagination);
        if (!success || data.status === 'Error') {
            toast.error('Có lỗi xảy ra')
        } else {
            setCoupon(data.data)
            setLoading(false);
            setTotal(data.totalCount)
        }
    };
    useEffect(() => {
        fetchData();
    }, [JSON.stringify(tableParams), loading])
    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setCoupon([]);
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
    const menu = (record) => (
        <Menu>
            <Menu.Item>
                <CouponAddOrChange fetchData={fetchData} modelItem={record} textButton={"Edit"} isStyle={false} />
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
    const columns = [
        {
            title: 'STT',
            dataIndex: 'number',
            key: 'number',
            render: (_, __, index) => <a style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{index + 1}</a>,
        },
        {
            title: 'Mã khuyến mại',
            dataIndex: 'code',
            key: 'code',
            render: (text) => <a style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{text}</a>,
        },
        {
            title: 'Tên khuyến mại',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{text}</a>,
        },
        {
            title: 'Kiểu khuyến mại',
            dataIndex: 'type',
            render: (value) => {
                if (value === 1) {
                    return <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>Chiết khấu phần trăm đơn hàng </p>
                } else {
                    return <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>Chiết khấu giá trị đơn hàng </p>
                }
            }
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (_, record) => <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{record.quantity}</p>,

        },
        {
            title: 'Số lượng đã sử dụng',
            dataIndex: 'quantityUsed',
            key: 'quantityUsed',
            render: (_, record) => <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{record.quantityUsed}</p>
        },
        {
            title: 'Thời gian bắt đầu',
            dataIndex: 'dateStart',
            key: 'dateStart',
            render: (_, record) => <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{format(record.dateStart, 'dd-MM-yyyy')}</p>
        },
        {
            title: 'Thời gian kết thúc',
            dataIndex: 'dateEnd',
            key: 'dateEnd',
            render: (_, record) => <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{format(record.dateEnd, 'dd-MM-yyyy')}</p>
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (value) => {
                if (value === 1) {
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
    return (
        <>
            <Row gutter={[16, 16]}>
                <Col span={24} style={{ textAlign: 'right' }}>
                    <CouponAddOrChange fetchData={fetchData} modelItem={null} textButton={"Thêm mới"} isStyle={true} />
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
            <Col span={8}>
                    <Form.Item
                        label="Key search"
                        name="keySearch"><Input placeholder="" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        label="Giá trị bắt đầu"
                        name="minValue"
                    >
                       <Input placeholder="" type='number' />

                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        label="Giá trị bắt đầu"
                        name="typeId"
                    >
                       <Input placeholder="" type='number' />

                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
            <Col span={16}>
                    <Form.Item
                        label="Thời gian"
                        name="minValue"
                    >
                       <RangePicker
                            value={dates}
                            onChange={null}
                            format="YYYY-MM-DD" // Format the date as YYYY-MM-DD
                            placeholder={['Start Date', 'End Date']}
                            style={{ width: '100%' }}
                        />

                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        label="Trạng thái"
                        name="status"
                    >
                        <Select
                            placeholder="Please select"
                            onChange={null}
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
            </Row>
            <Table
                dataSource={coupon} columns={columns}
                pagination={false}
                loading={loading}
                onChange={handleTableChange}
            />
            <Pagination
                showSizeChanger
                onChange={onShowSizeChange}
                style={{ textAlign: 'center', marginTop: '24px' }}
                defaultCurrent={tableParams.pagination.pageIndex}
                total={total}
            />
        </>
    );
}
export default CouponManager;