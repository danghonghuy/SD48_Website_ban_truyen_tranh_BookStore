import { PlusSquareOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row, Select, Space, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { PlusOutlined } from '@ant-design/icons';
import useBranch from "@api/useBranch";
import useOrigin from "@api/useOrigin";
import useProduct from "@api/useProduct";
import { toast } from "react-toastify";
import { Pagination } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const OrderAddOrChange = () => {
    const [modal2Open, setModal2Open] = useState(false);
    const [form] = Form.useForm();
    const { createProduct } = useProduct();
    const { getAll } = useProduct()

    const [product, setProduct] = useState([])

    const [loading, setLoading] = useState(false);

    const [total, setTotal] = useState();
    const [tableParams, setTableParams] = useState({
      pagination: {
        pageIndex: 1,
        pageSize: 10,
      },
    }); 

    const onFinish = async (values) => {
        try {
            const formData = new FormData()
            formData.append('branchId', values.branchId);
            formData.append('originId', values.originId);
            formData.append('productName', values.productName);
            formData.append('ProdcutPrice', values.productPrice);
            formData.append('ProductQuanlity', values.productQuantity);
            formData.append('productDescription', values.productDescription);
            formData.append('productMaterial', values.productMaterial);
            formData.append('productType', values.productType);
            // fileList.forEach((file, index) => {
            //     formData.append(`ListFileImg`, file.originFileObj);
            // });
            const { success, data } = await createProduct(formData, { "Content-Type": "multipart/form-data" });
            if (data.status != 'Error' && success) {
                setModal2Open(false);
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error("loi")
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };
    const handleChange = (value) => {
        console.log(`Selected: ${value}`);
    };
    function formatCurrencyVND(amount) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
      } 
    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };
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
        setTableParams({pagination: {
            pageIndex: current,
            pageSize: pageSize
        }})
    };
    const columns = [
        {
            title: 'STT',
            dataIndex: 'number',
            key: 'number',
            render: (text) => <a style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{text}</a>,
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
            render: (_, record) => <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{record.productQuanlity + record.productSold >= 0 ? (record.productQuanlity + record.productSold) : 0}</p>,

        },
        {

            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space>
                    {/* <Delete id={record.id} state={loading} action={setLoading} /> */}
                    <Link to={record.id}>
                        <Button type='primary' title='Detail Product'>
                            <FontAwesomeIcon icon={faCircleInfo} />
                        </Button>
                    </Link>
                    <Link to={`/dashboard/product/edit/${record.id}`}>
                        <Button title='Edit Product' style={{
                            backgroundColor: 'brown'
                        }}>
                            <FontAwesomeIcon icon={faPenToSquare} style={{ color: "white" }} />
                        </Button>
                    </Link>
                </Space>
            ),
        },
    ];
    return (
        <div>
            <Button
                type="primary"
                value="large"
                style={{
                    alignItems: "center",
                    background: "#1fbf39",
                    marginRight: "10px"
                }}
                onClick={() => setModal2Open(true)}
            > <PlusSquareOutlined /> Tạo đơn hàng
            </Button>

            <Modal
                width={'65%'}
                title="Tạo đơn hàng"
                centered
                visible={modal2Open}
                onCancel={() => setModal2Open(false)}
                footer={null}
                style={{
                    content: {
                      width: '60%', // Width of the modal
                      height: '200px', // Set height for modal
                      overflowY: 'auto', // Enable scrolling for content
                      margin: 'auto', // Center the modal
                      padding: '20px', // Padding inside modal
                    },
                  }}>
                <Form
                    form={form}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    initialValues={{ layout: "horizontal" }}
                    layout="vertical"
                >
                    <br />
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <span class="hide-menu" style={{ fontSize: "13px", color: "black", fontWeight: "bold" }}>Thông tin khách hàng</span>
                        </Col>
                    </Row>
                    <br />
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Form.Item
                                name="productName"
                                rules={[{ required: false, message: "Please input product name!" }]}><Input placeholder="Enter code, phone number, name customer..." />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Form.Item
                                label="Họ tên khách hàng"
                                name="productPrice"
                            >
                                <Input placeholder="" type="text" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Số điện thoại khách hàng"
                                name="productQuantity"
                            >
                                <Input placeholder="" type="text" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Form.Item
                                label="Địa chỉ khách hàng"
                                name="productPrice"
                            >
                                <Input placeholder="" type="text" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Mã khuyến mại"
                                name="productPrice"
                            >
                                <Input placeholder="" type="text" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Form.Item
                                label="Hình thức thanh toán"
                                name="originId"
                                rules={[{ required: true, message: "Please input Origin" }]}
                            >
                                <Select
                                    placeholder="Please select"
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                    }}
                                    options={origin}
                                />

                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Hình thức vận chuyển"
                                name="originId"
                                rules={[{ required: true, message: "Please input Origin" }]}
                            >
                                <Select
                                    placeholder="Please select"
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                    }}
                                    options={origin}
                                />

                            </Form.Item>
                        </Col>
                    </Row>

                    <br />
                    <Row gutter={[16, 16]}>
                        <Col span={16}>
                            <span class="hide-menu" style={{ fontSize: "13px", color: "black", fontWeight: "bold" }}>Thông tin sản phẩm</span>
                        </Col>
                    </Row>
                    <br />
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Form.Item
                                name="searchProduct"
                                rules={[{ required: false, message: "" }]}><Input placeholder="Enter code, product name.." />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Table
                        dataSource={product} columns={columns}
                        pagination={false}
                        loading={false}
                        onChange={null}
                    />
                    <Pagination
                        showSizeChanger
                        onChange={onShowSizeChange}
                        style={{ textAlign: 'center', marginTop: '24px' }}
                        defaultCurrent={tableParams.pagination.pageIndex}
                        total={total}
                    />

                    <Form.Item>
                        <Button type="primary" htmlType="submit" >
                            Thêm
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default OrderAddOrChange;
