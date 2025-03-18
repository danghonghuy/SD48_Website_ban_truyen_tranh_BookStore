import { PlusSquareOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row, Pagination, Checkbox, Table } from "antd";
import React, { useEffect, useState } from "react";
import useProduct from '@api/useProduct';
import { toast } from 'react-toastify';

const ProductPopUp = ({ handleProductSelected, modelProduct, tabIndex }) => {

    const [modal2Open, setModal2Open] = useState(false);
    const { getList } = useProduct();

    const [product, setProduct] = useState([])
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState();
    const [tableParams, setTableParams] = useState({
        pagination: {
            pageIndex: 1,
            pageSize: 5,
            keySearch: ""
        },
    });
    const [productSelecteds, setProductIdSelected] = useState([]);

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

    const showModel = () => {
        if(!modelProduct || modelProduct.length === 0){
            modelProduct = [];
            setProductIdSelected([]);
        }else{
            setProductIdSelected(modelProduct);
        }
        setModal2Open(true);
        fetchData();
    }

    const onFinish = () => {
        handleProductSelected(productSelecteds, tabIndex);    
        setModal2Open(false);
    }

    useEffect(() => {
        if (modal2Open) {
            fetchData();
        }
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

    const handleChangeSearchNameProd = (e) => {
        setTableParams((prevPrams) => ({
            ...prevPrams,
            pagination: {
                ...prevPrams.pagination,
                pageIndex: 1,
                pageSize: 5,
                keySearch: e.target.value
            }
        }));
    }

    function formatCurrencyVND(amount) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    }
    const handleSelectedAll = (event) => {
        if (event.target.checked) {
            setProductIdSelected(product);
        } else {
            setProductIdSelected([]);
        }
    };
    const handleChangeSelected = (event, item) => {
        if (event.target.checked) {
            setProductIdSelected([...productSelecteds, { id: item.id, image: item.images && item.images.length > 0 ? item.images[0] : null, name: item.name, price: item.price, code: item.code, priceDiscount: item.priceDiscount, quantity: 1 }]);
        } else {
            setProductIdSelected([...productSelecteds].filter((e) => e.id != item.id));
        }
    }
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
            title: (<Checkbox onClick={(e) => handleSelectedAll(e)} checked={productSelecteds.length === product.length}></Checkbox>),
            dataIndex: 'number',
            key: 'number',
            render: (_, record) => {
                return <Checkbox checked={productSelecteds && productSelecteds.find(e => e.id === record.id)} onClick={(e) => handleChangeSelected(e, record)}></Checkbox>
            },
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'code',
            key: 'images',
            render: (_, record) => <img src={Array.isArray(record.images) ? record.images[0] : "href"} style={{ width: "65px", height: "auto", borderRadius: "10px" }} />,
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
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            render: (_, record) => <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>{record.description}</p>
        }
    ];
    return (
        <div>
            <Button
                type="button"
                value="small"
                style={{
                    alignItems: "center",
                    background: "#1fbf39",
                    marginBottom: "20px",
                    color: 'white'
                }}
                onClick={() => showModel()}
            >
                <PlusSquareOutlined /> Thêm sản phẩm
            </Button>

            <Modal
                width={'60%'}
                title="Thêm sản phẩm đơn hàng"
                centered
                visible={modal2Open}
                onCancel={() => setModal2Open(false)}
                footer={null}
            >
                <br />
                <Row gutter={[5, 5]}>
                    <Col span={18}>
                        <Form.Item
                            name="searchProduct"
                            rules={[{ required: false, message: "" }]}>
                            <Input placeholder="Enter code, product name.." onChange={handleChangeSearchNameProd} />
                        </Form.Item>
                    </Col>
                    <Col span={6} style={{textAlign: 'right'}}>
                        <Button
                            type="button"
                            value="small"
                            style={{
                                alignItems: "center",
                                background: "#1fbf39",
                                marginBottom: "20px",
                                color: "white"
                            }}
                            onClick={() => onFinish()}
                        >
                            <PlusSquareOutlined /> Hoàn thành
                        </Button>
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
            </Modal>
        </div>
    );
};

export default ProductPopUp;
