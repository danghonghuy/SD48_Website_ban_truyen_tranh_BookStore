import { PlusSquareOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row, Select, Space, Table, AutoComplete } from "antd";
import React, { useEffect, useState } from "react";
import useProduct from "@api/useProduct";
import { toast } from "react-toastify";
import useUser from "@api/useUser";
import { EyeClosed, Trash2, CircleX, Eye } from "lucide-react";
import ProductPopUp from "./ProductPopUp";
import PaymentPage from "./PaymentPages";
import UserAddOrChange from "@views/components/ManagerUser/UserAddOrChange";

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const Tab = ({ label, activeTab, setActiveTab, closeTab }) => {
    return (
        <div
            onClick={() => setActiveTab(label)}
            style={{
                display: 'inline-block',
                padding: '10px 20px',
                cursor: 'pointer',
                backgroundColor: activeTab === label ? '#1fbf39' : '#fff',
                margin: '5px',
                borderRadius: 10,
            }}
        >
            <input
                type="text"
                value={label}
                onChange={(e) => null}
                style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '14px',
                    cursor: 'pointer',
                    color: activeTab === label ? '#fff' : '#000'
                }}
            />

            <CircleX size={25} onClick={(e) => {
                e.stopPropagation(); // Prevent tab switching on close button click
                closeTab(label);
            }}
                color={activeTab === label ? '#fff' : '#000'}
            />
        </div>
    );
};


const OrderCounter = () => {
    const [form] = Form.useForm();
    const { createProduct } = useProduct();
    const [loading, setLoading] = useState(false);
    const [tabs, setTabs] = useState([{ id: 'Đơn hàng 1', active: true, user: null, products: [] }]);
    const [activeTab, setActiveTab] = useState('Đơn hàng 1');
    const [query, setQuery] = useState("");
    const [user, setUsers] = useState([]);
    const [option, setOptions] = useState([]);
    const { getListUser } = useUser();
    const [tableParams, setTableParams] = useState({
        pagination: {
            pageIndex: 1,
            pageSize: 10,
            keySearch: '',
            roleId: 5,
            status: null
        }
    })
    const handleProductSelected = (products, index) => {
        const modelTabs = [...tabs];
        modelTabs[index] = { ...modelTabs[index], products: products };
        setTabs(modelTabs);
    }
    const addTab = () => {
        if (tabs.length < 5) {
            const newTabId = `Đơn hàng ${tabs.length + 1}`;
            setTabs([...tabs, { id: newTabId, active: false, user: null, products: [] }]);
            setActiveTab(newTabId);
        } else {
            toast.error("Only can create 5 order in one time!");
        }
    };

    // Function to handle closing a tab
    const closeTab = (tabId) => {
        debugger;
        const newTabs = tabs.filter((tab) => tab.id !== tabId);
        setTabs(newTabs);
        if (activeTab === tabId && newTabs.length > 0) {
            setActiveTab(newTabs[newTabs.length - 1].id);
        }
    };

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
            const { success, data } = await createProduct(formData, { "Content-Type": "multipart/form-data" });
            if (data.status != 'Error' && success) {
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

    const fetchData = async () => {
        const { success, data } = await getListUser(tableParams.pagination);
        console.log(data);
        if (success && data.status != 'Error') {
            setUsers(data.data);
            setLoading(false)
            toast.success(data.message);
            const model = data.data.map((e) => {
                return {
                    value: e.id,
                    label: e.code + " - " + e.phoneNumber + " - " + e.fullName,
                    key: e.id,
                    fullName: e.fullName
                }
            });
            setOptions(model);
        } else {
            toast.error(data.message)
        }
    }
    const onSearchByKey = (e) => {
        setQuery(e);
        setTableParams((prevPrams) => ({
            ...prevPrams,
            pagination: {
                ...prevPrams.pagination,
                keySearch: e
            }
        }))
    }
    useEffect(() => {
        if (tableParams.pagination && tableParams.pagination.keySearch.length > 0) {
            fetchData();
        }
    }, [JSON.stringify(tableParams), loading])
    const handleInputQuantity = (index, value) => {
        const tabIndex = tabs.findIndex((e) => e.id === activeTab);
        const modelTabs = [...tabs];
        const models = [...modelTabs[tabIndex].products];
        models[index] = { ...models[index], quantity: parseInt(value) };
        modelTabs[tabIndex] = { ...modelTabs[tabIndex], products: models }
        setTabs(modelTabs);
    }
    const handleRemoveProd = (index) => {
        const tabIndex = tabs.findIndex((e) => e.id === activeTab);
        const modelTabs = [...tabs];
        const models = [...modelTabs[tabIndex].products];
        models.splice(index, 1);
        modelTabs[tabIndex] = { ...modelTabs[tabIndex], products: models }
        setTabs(modelTabs);
    }
    const handleSelect = (value, option, index) => {
        const tabIndex = tabs.findIndex((e) => e.id === activeTab);
        var userInfo = user.find((e) => e.id === value);
        const modelTabs = [...tabs];
        modelTabs[tabIndex] = { ...modelTabs[tabIndex], user: userInfo };
        setTabs(modelTabs);
        form.setFieldsValue({ customerName: userInfo.fullName, phoneNumber: userInfo.phoneNumber, addressDetail: userInfo.address && userInfo.address.length > 0 && userInfo.address[0].fullInfo });
        setQuery(option.fullName);
    };
    const columns = [
        {
            title: 'Hình ảnh',
            dataIndex: 'code',
            key: 'images',
            render: (_, record) => <img src={record.image} style={{ width: "65px", height: "auto", borderRadius: "10px" }} />,
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
            width: 150,
            render: (_, record, index) => {
                return <Input style={{ textAlign: 'center' }} type="number" value={record.quantity}
                    onChange={(e) => handleInputQuantity(index, e.target.value)}
                >
                </Input>
            },

        },
        {

            title: 'Action',
            key: 'action',
            render: (_, record, index) => (
                <Space style={{ textAlign: 'center' }}>
                    <Trash2 style={{ color: "gray" }} onClick={(e) => handleRemoveProd(index)} />
                </Space>
            ),
        },
    ];
    return (
        <div>
            <Row>

                <Col span={24} style={{ textAlign: 'right' }}>
                    <Button
                        type="primary"
                        value="large"
                        style={{
                            alignItems: "center",
                            background: "#1fbf39",
                            marginRight: "10px"
                        }}
                        onClick={() => addTab()}
                    > <PlusSquareOutlined /> Thêm đơn hàng
                    </Button>
                </Col>
            </Row>

            <div style={{ marginBottom: '10px' }}>
                {/* Render Tab Buttons */}
                {tabs.map((tab) => (
                    <Tab
                        key={tab.id}
                        label={tab.id}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        closeTab={closeTab}
                    />
                ))}
            </div>

            {tabs.map(
                (tab, index) =>
                    activeTab === tab.id && (

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
                                <Col span={18}>
                                    <AutoComplete
                                        options={option}
                                        onSearch={onSearchByKey}
                                        onSelect={handleSelect}
                                        value={query}
                                        onChange={setQuery}
                                        style={{ width: '100%' }}
                                    >
                                        <Input placeholder="Enter code, phone number, name customer..." />
                                    </AutoComplete>

                                </Col>
                                <Col span={6} style={{ textAlign: 'right' }}>
                                    <UserAddOrChange fetchData={null} modelItem={null} textButton={"Thêm mới"} isStyle={true} />
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Họ tên khách hàng"
                                        name="customerName"
                                    >
                                        <Input placeholder="" type="text" />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item
                                        label="Số điện thoại khách hàng"
                                        name="phoneNumber"
                                    >
                                        <Input placeholder="" type="text" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={[16, 16]}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Địa chỉ khách hàng"
                                        name="addressDetail"
                                    >
                                        <Input placeholder="" type="text" />
                                    </Form.Item>
                                </Col>

                                {/* <Col span={12}>
                                    <Form.Item
                                        label="Mã khuyến mại"
                                        name="productPrice"
                                    >
                                        <Input placeholder="" type="text" />
                                    </Form.Item>
                                </Col> */}
                            </Row>

                            {/* <Row gutter={[16, 16]}>
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
                            </Row> */}

                            <br />
                            <Row gutter={[16, 16]}>
                                <Col span={16}>
                                    <span class="hide-menu" style={{ fontSize: "13px", color: "black", fontWeight: "bold" }}>Thông tin sản phẩm</span>
                                </Col>
                                <Col span={8} style={{ textAlign: 'right' }}>
                                    <ProductPopUp handleProductSelected={handleProductSelected} modelProduct={tab.products} tabIndex={index} />
                                </Col>
                            </Row>
                            {/* <br />
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <Form.Item
                                        name="searchProduct"
                                        rules={[{ required: false, message: "" }]}><Input placeholder="Enter code, product name.." />
                                    </Form.Item>
                                </Col>
                            </Row> */}

                            <Table
                                dataSource={tab.products} columns={columns}
                                pagination={false}
                                loading={false}
                                onChange={null}
                            />
                            {/* <Pagination
                                showSizeChanger
                                onChange={onShowSizeChange}
                                style={{ textAlign: 'center', marginTop: '24px' }}
                                defaultCurrent={tableParams.pagination.pageIndex}
                                total={total}
                            /> */}

                            <br />
                             <Col span={6} style={{ textAlign: 'left' }}>
                                <PaymentPage callback={closeTab} userInfo={tab.user} producs={tab.products} tabId={tab.id} />
                            </Col>
                        </Form>
                    )
            )}
        </div>
    );
};

export default OrderCounter;
