import { Col, Form, Input, Button, Row, Dropdown, Select, Menu, Table, Pagination } from "antd";
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import UserAddOrChange from './UserAddOrChange'
import { Option } from "antd/es/mentions";
import useUser from "@api/useUser";
import { format } from 'date-fns';
import { DownOutlined } from '@ant-design/icons';

function ManagerUser() {

    const [user, setUsers] = useState([]);
    const { getListUser } = useUser();

    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)
    const [tableParams, setTableParams] = useState({
        pagination: {
            pageIndex: 1,
            pageSize: 10,
            keySearch: '', 
            roleId: 5, 
            status: null
        }
    })

    const fetchData = async () => {
        const { success, data } = await getListUser(tableParams.pagination);
        console.log(data);
        if (success && data.status != 'Error') {
            setUsers(data.data)
            setLoading(false)
            setTotal(data.data.totalCount)
            toast.success(data.message)
        } else {
            toast.error(data.message)
        }
    }
    useEffect(() => {
        fetchData()
    }, [JSON.stringify(tableParams), loading])

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setUsers([]);
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

    const onSearchByKey = (e) => {
        setTableParams((prevPrams) => ({
            ...prevPrams, 
            pagination: {
                ...prevPrams.pagination, 
                keySearch: e.target.value
            }
        }))
    }

    const onChangeStatus = (e) => {
        setTableParams((prevPrams) => ({
            ...prevPrams, 
            pagination: {
                ...prevPrams.pagination, 
                status: e
            }
        }))
    }

    const menu = (record) => (
        <Menu>
            <Menu.Item>
                <UserAddOrChange fetchData={fetchData} modelItem={record} textButton={"Edit"} isStyle={false} />
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
            dataIndex: 'orderNumber',
            key: 'orderNumber',
            render: (_, __, index) => <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{index + 1}</p>
        },
        {
            title: 'User code',
            dataIndex: 'code',
            key: 'code',
            render: (_, record) => <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{record.code}</p>
        },
        {
            title: 'Full name',
            dataIndex: 'fullName',
            key: 'fullName',
            render: (_, record) => <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{record.fullName}</p>
        },
        {
            title: 'PhoneNumber',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            render: (_, record) => <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{record.phoneNumber}</p>
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (_, record) => <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{record.email}</p>
        },
        {
            title: 'Date birth',
            dataIndex: 'dateBirth',
            key: 'dateBirth',
            render: (_, record) => <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{ record.dateBirth && format(record.dateBirth, 'dd-MM-yyyy')}</p>
        },
        {
            title: 'UserName',
            dataIndex: 'userName',
            key: 'userName',
            render: (_, record) => <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{record.userName}</p>
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            render: (_, record) => {
                if (record.gender) {
                    return <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>Male</p>
                } else {
                    return <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>Female</p>
                }
            }
        },
        {
            title: 'RoleCode',
            dataIndex: 'roleCode',
            key: 'roleCode',
            render: (_, record) => <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{record.roleCode}</p>
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

    ]
    return (

        <>
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <Form.Item
                        label="Key search"
                        name="keySearch"
                        rules={[{ required: false }]}><Input placeholder="Enter code, phone number, name customer..." onChange={onSearchByKey} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        label="Trạng thái"
                        name="statusId"
                    >
                        <Select
                            placeholder="Please select"
                            onChange={onChangeStatus}
                            style={{
                                width: '100%',
                            }}>
                            <Option value={1}>Hoạt động</Option>
                            <Option value={2}>Không hoạt động</Option>
                        </Select>

                    </Form.Item>
                </Col>
                <Col span={8} style={{ textAlign: 'right' }}>
                    <UserAddOrChange fetchData={fetchData} modelItem={null} textButton={"Thêm mới"} isStyle={true} />
                </Col>
            </Row>
            <Table
                dataSource={user}
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

export default ManagerUser;