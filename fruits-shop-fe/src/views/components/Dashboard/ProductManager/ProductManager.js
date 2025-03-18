import React, { useEffect, useState } from 'react';
import { Button, Select, Dropdown, Table, Menu } from 'antd';
import useProduct from '@api/useProduct';
import { toast } from 'react-toastify';
import { Pagination } from 'antd';
import AddProduct from './AddProduct';
import { Col, Form, Input, Row } from "antd";
import { DownOutlined } from '@ant-design/icons';
import { Option } from 'antd/es/mentions';
import useCategory from '@api/useCategory';
import useType from '@api/useType';

function ProductManager() {
    function formatCurrencyVND(amount) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    }

    const { getList } = useProduct(); 
    const {getListType} = useType(); 
    const { getListCategory } = useCategory();

    const [product, setProduct] = useState([])
    const [loading, setLoading] = useState(false);

    const [total, setTotal] = useState();
    const [tableParams, setTableParams] = useState({
        pagination: {
            pageIndex: 1,
            pageSize: 10,
        },
    });
    const [category, setCategory] = useState([]); 
    const [types, setType] = useState([]);

    const fetchData = async () => {
        const { success, data } = await getList(tableParams.pagination);
        if (!success || data.status == 'Error') {
            toast.error('Có lỗi xảy ra')
        } else {
            setProduct(data.data)
            setLoading(false);
            setTotal(data.totalCount)
        }
    };

    const fetchCategory = async () => {
        const { success, data } = await getListCategory({ pageIndex: 1, pageSize: 20 });
        if (data != null && success) {
          var dataResults = data.data.map((item) => {
            return {
              value: item.id,
              label: item.name
            }
          });
          setCategory(dataResults)
        }
      };

      const fetchType = async () => {
        const { success, data } = await getListType({ pageIndex: 1, pageSize: 20 });
        if (data != null && success) {
          var dataResults = data.data.map((item) => {
            return {
              value: item.id,
              label: item.name
            }
          });
          setType(dataResults)
        }
      };

    useEffect(() => {
        fetchData();
        fetchCategory(); 
        fetchType();
    }, [JSON.stringify(tableParams), loading])


    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setProduct([]);
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
                <AddProduct fetchData={fetchData} modelItem={record} textButton={"Edit"} isStyle={false} />
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
            title: 'Hình ảnh',
            dataIndex: 'code',
            key: 'images',
            render: (_, record) => <img src={Array.isArray(record.images) ?  record.images[0] : "href"} style={{width: "65px", height: "auto", borderRadius: "10px"}} />,
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{text}</a>,
        },
        {
            title: 'Mã sản phẩm',
            dataIndex: 'code',
            key: 'code',
            render: (text) => <a style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{text}</a>,
        },
        {
            title: 'Giá sản phẩm',
            dataIndex: 'price',
            render: (text) => <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{formatCurrencyVND(text)}</p>,
        },
        {
            title: 'Số lượng',
            dataIndex: 'stock',
            key: 'stock',
            render: (_, record) => <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{record.stock}</p>,

        },
        {
            title: 'Loại sản phẩm',
            dataIndex: 'categoryName',
            key: 'categoryName',
            render: (_, record) => <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{record.categoryName}</p>
        },
        {
            title: 'Kiểu sản phẩm',
            dataIndex: 'typeName',
            key: 'typeName',
            render: (_, record) => <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{record.typeName}</p>
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            render: (_, record) => <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{record.description}</p>
        },
        {
            title: 'Số lượng đã bán',
            dataIndex: 'soldQuantity',
            key: 'soldQuantity',
            render: (_, record) => <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{record.soldQuantity ? record.soldQuantity : 0}</p>,

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
                <Col span={16}>
                    <Form.Item
                        label="Key search"
                        name="keySearch"
                        rules={[{ required: false, message: "Please input product name!" }]}><Input placeholder="Enter code, name category" />
                    </Form.Item>
                </Col>
                <Col span={8} style={{ textAlign: 'right' }}>
                <AddProduct fetchData={fetchData} modelItem={null} textButton={"Thêm mới"} isStyle={true} />
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
            <Col span={8}>
                    <Form.Item
                        label="Loại sản phẩm"
                        name="categoryId"
                    >
                        <Select
                            placeholder="Please select"
                            onChange={null}
                            style={{
                                width: '100%',
                            }}
                            options={category}
                        />

                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        label="Gói bán SP"
                        name="typeId"
                    >
                        <Select
                            placeholder="Please select"
                            onChange={null}
                            style={{
                                width: '100%',
                            }}
                            options={types}
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
                dataSource={product} columns={columns}
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
export default ProductManager;