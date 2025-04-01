import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Card,
  Space,
  Table,
  Divider,
  Steps,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import useProduct from "@api/useProduct";
import { toast } from "react-toastify";
import useUser from "@api/useUser";
import { EyeClosed, Trash2, CircleX, Eye } from "lucide-react";
import ProductPopUp from "./ProductPopUp";
import usePayment from "@api/usePayment";
import useDelivery from "@api/useDelivery";
import useCoupon from "@api/useCoupons";
import useAddress from "@api/useAddress";
import useOrder from "@api/useOrder";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import CustomPopup from "./../Common/CustomPopup";
import {
  DELIVERY_STATUS,
  ORDER_STATUS,
  ORDER_STATUS_ARRAY,
  ORDER_STATUS_LABEL,
} from "@constants/orderStatusConstant";
import { useReactToPrint } from "react-to-print";
const Tab = ({ label, activeTab, setActiveTab, closeTab }) => {
  return <></>;
};

const OrderDetail = () => {
  const [form] = Form.useForm();
  const { createProduct } = useProduct();
  const [loading, setLoading] = useState(false);
  const [tabs, setTabs] = useState([
    {
      id: "Đơn hàng 1",
      active: true,
      user: null,
      products: [],
      paymentHistory: [],
    },
  ]);
  const [activeTab, setActiveTab] = useState("Đơn hàng 1");
  const [query, setQuery] = useState("");
  const [user, setUsers] = useState([]);
  const [option, setOptions] = useState([]);
  const { getListUser } = useUser();
  const [payments, setPayments] = useState([]);
  const [delivery, setDelivery] = useState([]);
  const { Step } = Steps;
  const [optionDelivery, setOptionDelivery] = useState([]);
  const { getListPayment } = usePayment();
  const { getListDelivery } = useDelivery();
  const { getCouponCode } = useCoupon();
  const [totalPrice, setTotalPrice] = useState(0);
  const [feeDelivery, setFeeDelivery] = useState(0);
  const [paymentId, setPaymentId] = useState(0);
  const [deleveryId, setDeleveryId] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [couponModel, setCouponModel] = useState(null);
  const [userModel, setUserModel] = useState(null);
  const { createOrder, getOrderDetail, changeStatus } = useOrder();
  const [orderModel, setOrderModel] = useState(null);
  const [tableParams, setTableParams] = useState({
    pagination: {
      pageIndex: 1,
      pageSize: 10,
      keySearch: "",
      roleId: 5,
      status: null,
    },
  });
  const [fullName, setFullName] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState(0);
  const [email, setEmail] = useState(null);

  const { getProvince, getDistrict, getWard } = useAddress();
  const [address, setListAddress] = useState([
    {
      id: null,
      provinceId: null,
      districtId: null,
      wardId: null,
      addressDetail: null,
      provinceName: null,
      districtName: null,
      wardName: null,
      stage: 0,
      addressDetail: "",
    },
  ]);
  const [province, setProvince] = useState([]);
  const [district, setDistrict] = useState([]);
  const [ward, setWard] = useState([]);
  const [provinceId, setProvinceId] = useState(null);
  const [districtId, setDistrictId] = useState(null);
  const [wardId, setWardId] = useState(null);

  const [steps, setSteps] = useState([]);
  const [actions, setLogActions] = useState([]);

  const refOrderInfo = useRef(null);

  const { id } = useParams();

  const reactToPrintFn = useReactToPrint({ contentRef: refOrderInfo });

  const handleProductSelected = (products, index) => {
    const modelTabs = [...tabs];
    modelTabs[index] = { ...modelTabs[index], products: products };
    const sum = products.reduce(
      (accumulator, currentItem) =>
        accumulator + currentItem.price * currentItem.quantity,
      0
    );
    if (couponModel !== undefined && couponModel !== null) {
      if (
        couponModel.minValue <= totalPrice &&
        couponModel.maxValue >= totalPrice
      ) {
        var discountNumber = 0;
        if (couponModel.type === 1) {
          discountNumber = (sum * couponModel.couponAmount) / 100;
        } else {
          discountNumber = couponModel.couponAmount;
        }
        setDiscount(discountNumber);
      } else {
        toast.warning("Giá trị đơn hàng không đủ để sử dụng khuyến mại");
      }
    }
    setTotalPrice(sum);
    setTabs(modelTabs);
  };
  const addTab = () => {
    if (tabs.length < 5) {
      const newTabId = `Đơn hàng ${tabs.length + 1}`;
      setTabs([
        ...tabs,
        { id: newTabId, active: false, user: null, products: [] },
      ]);
      setActiveTab(newTabId);
    } else {
      toast.error("Only can create 5 order in one time!");
    }
  };

  const fetchOrderDetail = async () => {
    const { success, data } = await getOrderDetail(id);
    if (!success || data.status == "Error") {
      toast.error("Có lỗi xảy ra");
    } else {
      setOrderModel(data.data);
      const modelTabs = [...tabs];
      modelTabs[0] = {
        ...modelTabs[0],
        products: data.data?.orderDetailModels,
        paymentHistory: data.data?.logPaymentHistoryModels,
        isDeliver: data.data?.isDeliver,
      };
      const sum = data.data?.orderDetailModels.reduce(
        (accumulator, currentItem) =>
          accumulator + currentItem.price * currentItem.quantity,
        0
      );
      form.setFieldsValue({
        addressDetail: data.data?.addressModel.fullInfo,
        customerName: data.data?.userModel.fullName,
        email: data.data?.userModel.email,
        phoneNumber: data.data?.userModel.phoneNumber,
      });
      setCouponModel(data.data?.couponModel);
      setPaymentId(data.data?.paymentModel.id);
      setDeleveryId(data.data?.deliveryModel.id);
      setTabs(modelTabs);
      setTotalPrice(sum);
      setFeeDelivery(data.data?.deliveryModel && data.data?.deliveryModel.fee);
      setFeeDelivery(data.data?.deliveryModel && data.data?.deliveryModel.fee);
      if (
        data.data?.couponModel !== undefined &&
        data.data?.couponModel !== null
      ) {
        if (
          data.data?.couponModel.minValue <= sum &&
          data.data?.couponModel.maxValue >= sum
        ) {
          var discountNumber = 0;
          if (data.data?.couponModel.type === 1) {
            discountNumber = (sum * data.data?.couponModel.couponAmount) / 100;
          } else {
            discountNumber = data.data?.couponModel.couponAmount;
          }
          setDiscount(discountNumber);
        }
      }
      setLogActions(data.data?.logActionOrderModels);
      if (data.data?.status === ORDER_STATUS.ORDER_STATUS_CUSTOMER_CANCEL) {
        const apiSteps = [
          {
            name: "Tạo đơn hàng",
            createdDate: null,
            status: ORDER_STATUS.ORDER_STATUS_WAITING_ACCEPT,
          },
          {
            name: "Xác nhận",
            createdDate: null,
            status: ORDER_STATUS.ORDER_STATUS_ACCEPT,
          },
          {
            name: "Khách hàng hủy đơn",
            createdDate: null,
            status: ORDER_STATUS.ORDER_STATUS_CUSTOMER_CANCEL,
          },
        ];

        setSteps(apiSteps);
      } else if (
        data.data?.status === ORDER_STATUS.ORDER_STATUS_CUSTOMER_CANCEL_RECEIVE
      ) {
        const apiSteps = [
          {
            name: "Tạo đơn hàng",
            createdDate: null,
            status: ORDER_STATUS.ORDER_STATUS_WAITING_ACCEPT,
          },
          {
            name: "Xác nhận",
            createdDate: null,
            status: ORDER_STATUS.ORDER_STATUS_ACCEPT,
          },
          {
            name: "Đang giao hàng",
            createdDate: null,
            status: ORDER_STATUS.ORDER_STATUS_DELIVERY,
          },
          {
            name: "Không giao hàng thành công",
            createdDate: null,
            status: ORDER_STATUS.ORDER_STATUS_CUSTOMER_CANCEL_RECEIVE,
          },
        ];

        setSteps(apiSteps);
      } else {
        const apiSteps = [
          {
            name: "Chờ xác nhận",
            createdDate: null,
            status: ORDER_STATUS.ORDER_STATUS_WAITING_ACCEPT,
          },
          {
            name: "Đã xác nhận",
            createdDate: null,
            status: ORDER_STATUS.ORDER_STATUS_ACCEPT,
          },
          {
            name: "Chờ vận chuyển",
            createdDate: null,
            status: ORDER_STATUS.ORDER_STATUS_DELIVERY,
          },
          {
            name: "Đang vận chuyển",
            createdDate: null,
            status: ORDER_STATUS.ORDER_STATUS_FINISH_DELIVERY,
          },
          {
            name: "Hoàn thành",
            createdDate: null,
            status: ORDER_STATUS.ORDER_STATUS_SUCCESS,
          },
        ];
        setSteps(apiSteps);
      }
    }
  };

  const fetchPayment = async () => {
    const { success, data } = await getListPayment(tableParams.pagination);
    if (!success || data.status == "Error") {
      toast.error("Có lỗi xảy ra");
    } else {
      const result = data.data?.map((e) => {
        return {
          value: e.id,
          label: e.name,
        };
      });
      setPayments(result);
    }
  };
  const fetchDelivery = async () => {
    const { success, data } = await getListDelivery(tableParams.pagination);
    if (!success || data.status == "Error") {
      toast.error("Có lỗi xảy ra");
    } else {
      setDelivery(data.data);
      const result = data.data?.map((e) => {
        return {
          value: e.id,
          label: e.name,
        };
      });
      setOptionDelivery(result);
    }
  };
  const closeTab = (tabId) => {
    const newTabs = tabs.filter((tab) => tab.id !== tabId);
    setTabs(newTabs);
    if (activeTab === tabId && newTabs.length > 0) {
      setActiveTab(newTabs[newTabs.length - 1].id);
    }
  };
  const onCreateOrder = async (modelProducts, tabIds) => {
    try {
      const addressModel = address.map((e) => {
        return {
          provinceId: e.provinceId,
          districtId: e.districtId,
          wardId: e.wardId,
          addressDetail: e.addressDetail,
          stage: 1,
          provinceName: e.provinceName,
          districtName: e.districtName,
          wardName: e.wardName,
          id: e.id,
        };
      });
      const model = {
        code: null,
        fullName: fullName,
        phoneNumber: phoneNumber,
        email: email,
        dateBirth: null,
        userName: phoneNumber,
        gender: false,
        address: addressModel,
        roleId: 8,
        description: "Customer visitor",
        status: 1,
        id: null,
      };
      var product = modelProducts.map((e) => {
        return {
          productId: e.id,
          quantity: e.quantity,
          total: e.quantity * e.price,
          status: 1,
          price: e.price,
          originPrice: e.price,
        };
      });
      var objectModel = {
        userId: userModel ? userModel.id : null,
        price: totalPrice,
        paymentId: paymentId,
        feeDelivery: feeDelivery,
        deliveryType: deleveryId,
        description: null,
        status: deleveryId === 1 ? 8 : 4,
        stage: 1,
        type: 1,
        realPrice: totalPrice,
        addressId: userModel
          ? userModel.address && userModel.address[0].id
          : null,
        orderDetailModels: product,
        couponCode: couponModel && couponModel.code,
        userModel: model,
        userType: userModel ? 2 : 1,
      };
      const { success, data } = await createOrder(objectModel);
      if (data.status != "Error" && success) {
        closeTab(tabIds);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };
  const onFinish = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const handleChange = (value) => {
    console.log(`Selected: ${value}`);
  };
  function formatCurrencyVND(amount) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }

  const fetchData = async () => {
    const { success, data } = await getListUser(tableParams.pagination);
    console.log(data);
    if (success && data.status != "Error") {
      setUsers(data.data);
      setLoading(false);
      toast.success(data.message);
      const model = data.data?.map((e) => {
        return {
          value: e.id,
          label: e.code + " - " + e.phoneNumber + " - " + e.fullName,
          key: e.id,
          fullName: e.fullName,
        };
      });
      setOptions(model);
    } else {
      toast.error(data.message);
    }
  };

  const updateStatus = async (id, status, description) => {
    const { success, data } = await changeStatus(id, status, description);
    if (success && data.status != "Error") {
      toast.success(data.message);
      fetchOrderDetail();
    } else {
      toast.error(data.message);
    }
  };

  useEffect(() => {
    // if (tableParams.pagination && tableParams.pagination.keySearch.length > 0) {
    //     fetchData();
    // }
    fetchOrderDetail();
    // fetchDelivery();
    // fetchPayment();
    // fetchProvince();
  }, [JSON.stringify(tableParams), loading]);
  const handleInputQuantity = (index, value) => {
    const tabIndex = tabs.findIndex((e) => e.id === activeTab);
    const modelTabs = [...tabs];
    const models = [...modelTabs[tabIndex].products];
    models[index] = { ...models[index], quantity: parseInt(value) };
    modelTabs[tabIndex] = { ...modelTabs[tabIndex], products: models };

    const sum = modelTabs[tabIndex].products.reduce(
      (accumulator, currentItem) =>
        accumulator + currentItem.price * currentItem.quantity,
      0
    );
    setTotalPrice(sum);
    setTabs(modelTabs);
  };
  const handleRemoveProd = (index) => {
    const tabIndex = tabs.findIndex((e) => e.id === activeTab);
    const modelTabs = [...tabs];
    const models = [...modelTabs[tabIndex].products];
    models.splice(index, 1);
    modelTabs[tabIndex] = { ...modelTabs[tabIndex], products: models };
    setTabs(modelTabs);
  };
  const handleChangeAddress = (e) => {
    const addressModel = [...address];
    addressModel[0] = { ...addressModel[0], addressDetail: e.target.value };
    setListAddress(addressModel);
  };
  const handleSelect = (value, option, index) => {
    const tabIndex = tabs.findIndex((e) => e.id === activeTab);
    var userInfo = user.find((e) => e.id === value);
    const modelTabs = [...tabs];
    modelTabs[tabIndex] = { ...modelTabs[tabIndex], user: userInfo };
    setTabs(modelTabs);
    form.setFieldsValue({
      customerName: userInfo.fullName,
      phoneNumber: userInfo.phoneNumber,
      addressDetail:
        userInfo.address &&
        userInfo.address.length > 0 &&
        userInfo.address[0].fullInfo,
    });
    setQuery(option.fullName);
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
      render: (_, record, index) => (
        <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {index + 1}
        </p>
      ),
    },
    {
      title: "Hình ảnh",
      dataIndex: "code",
      key: "images",
      render: (_, record) => (
        <img
          src={record.image}
          style={{ width: "65px", height: "auto", borderRadius: "10px" }}
        />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <a style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {text}
        </a>
      ),
    },
    {
      title: "Mã sản phẩm",
      dataIndex: "code",
      key: "code",
      render: (text) => (
        <a style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {text}
        </a>
      ),
    },
    {
      title: "Giá sản phẩm",
      dataIndex: "price",
      render: (text) => (
        <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {formatCurrencyVND(text)}
        </p>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "stock",
      key: "stock",
      width: 150,
      render: (_, record, index) => {
        return (
          <Input
            style={{ textAlign: "center" }}
            type="number"
            value={record.quantity}
            readOnly={orderModel && orderModel.status !== 1}
            onChange={(e) => handleInputQuantity(index, e.target.value)}
          ></Input>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      hidden: orderModel && orderModel.status !== 1,
      render: (_, record, index) => (
        <Space style={{ textAlign: "center" }}>
          <Trash2
            style={{ color: "gray" }}
            onClick={(e) => handleRemoveProd(index)}
          />
        </Space>
      ),
    },
  ];

  const columnsPayment = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
      render: (_, record, index) => (
        <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {index + 1}
        </p>
      ),
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      render: (text) => (
        <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {formatCurrencyVND(text)}
        </p>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text) => (
        <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {text.split(" ")[0]}
        </p>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {text === 1 ? "Thanh toán" : "Chưa thanh toán"}
        </p>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {text}
        </p>
      ),
    },

    {
      title: "Nhân viên xác nhận",
      dataIndex: "createdBy",
      key: "createdBy",
      render: (text) => (
        <p style={{ fontSize: "13px", color: "black", fontWeight: "300" }}>
          {text}
        </p>
      ),
    },
  ];
  function formatCurrencyVND(amount) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }
  const fetchDistrict = async (provinceId) => {
    setDistrictId(0);
    var request = {
      code: provinceId,
      name: null,
    };
    const { success, data } = await getDistrict(request);
    if (!success || data.status == "Error") {
      toast.error(data.message);
    } else {
      setDistrict(data.data);
    }
  };

  const fetchWard = async (districtId) => {
    setWardId(0);
    var request = {
      code: districtId,
      name: null,
    };
    const { success, data } = await getWard(request);
    if (!success || data.status == "Error") {
      toast.error(data.message);
    } else {
      setWard(data.data);
    }
  };

  const [isModalAccept, setIsModalAccept] = useState(false);
  const [isModalDelivery, setIsModalDelivery] = useState(false);
  const [isModalFinish, setIsModalFinish] = useState(false);
  const [isModalReject, setIsModalReject] = useState(false);

  const handleOkAccept = () => {
    updateStatus(orderModel.id, ORDER_STATUS.ORDER_STATUS_DELIVERY, "");
    setIsModalAccept(false);
  };

  const handleCancelAccept = (e) => {
    setIsModalAccept(false);
  };

  const handleRejectAccept = (e) => {
    updateStatus(orderModel.id, ORDER_STATUS.ORDER_STATUS_CUSTOMER_CANCEL, "");
    setIsModalReject(false);
  };

  const handleCancelReject = (e) => {
    setIsModalReject(false);
  };

  const showRejectModel = () => {
    setIsModalReject(true);
  };

  const showAcceptModel = () => {
    setIsModalAccept(true);
  };

  const showDeliveryModel = () => {
    setIsModalDelivery(true);
  };

  const handleOkDelivery = (e) => {
    updateStatus(orderModel.id, ORDER_STATUS.ORDER_STATUS_FINISH_DELIVERY, "");
    setIsModalDelivery(false);
  };

  const handleCancelDelivery = (e) => {
    setIsModalDelivery(false);
  };

  const handleOkFinish = () => {
    updateStatus(orderModel.id, ORDER_STATUS.ORDER_STATUS_SUCCESS, "");
    setIsModalFinish(false);
  };

  const handleCancelFinish = (e) => {
    setIsModalFinish(false);
  };

  const handleRejectFinish = (e) => {
    updateStatus(
      orderModel.id,
      ORDER_STATUS.ORDER_STATUS_CUSTOMER_CANCEL_RECEIVE,
      e
    );
    setIsModalFinish(false);
  };

  const showAcceptFinish = () => {
    setIsModalFinish(true);
  };
  return (
    <div>
      <CustomPopup
        visible={isModalAccept}
        title="Xác nhận"
        content={<p>Xác nhận đơn hàng và giao cho đơn vị vận chuyển?</p>} // You can replace this with any content
        onClose={handleCancelAccept}
        onOk={handleOkAccept}
        showReject={true}
      />
      <CustomPopup
        visible={isModalFinish}
        title="Xác nhận"
        content={<p>Giao hàng thành công và hoàn thành đơn hàng?</p>} // You can replace this with any content
        onClose={handleCancelFinish}
        onOk={handleOkFinish}
        onReject={handleRejectFinish}
      />
      <CustomPopup
        visible={isModalDelivery}
        title="Xác nhận"
        content={<p>Xác nhận đơn hàng đã bàn giao cho đơn vị vận chuyển?</p>} // You can replace this with any content
        onClose={handleCancelDelivery}
        onOk={handleOkDelivery}
        showReject={true}
      />
      <CustomPopup
        visible={isModalReject}
        title="Xác nhận"
        content={<p>Bạn xác nhận là hủy đơn hàng này?</p>} // You can replace this with any content
        onClose={handleCancelReject}
        onOk={handleRejectAccept}
        showReject={true}
      />
      {steps && (
        <Card title="Lịch sử đơn hàng">
          <Steps
            current={
              steps.findIndex(
                (step) =>
                  actions &&
                  actions[actions.length - 1] &&
                  step.status === actions[actions.length - 1].statusId
              ) >= 0
                ? steps.findIndex(
                    (step) =>
                      actions &&
                      actions[actions.length - 1] &&
                      step.status === actions[actions.length - 1].statusId
                  )
                : ORDER_STATUS_ARRAY.indexOf(orderModel?.status)
            }
          >
            {steps.map((step, index) => (
              <Step
                key={index}
                title={step.name}
                description={
                  actions &&
                  actions.find((e) => e.statusId === step.status) &&
                  actions.find((e) => e.statusId === step.status).createdDate
                }
              />
            ))}
          </Steps>
        </Card>
      )}
      {/* <div style={{ marginBottom: "10px", marginTop: "60px" }}>
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            label={tab.id}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            closeTab={closeTab}
          />
        ))}
      </div> */}
      <Card>
        <Row gutter={[25, 25]} style={{ justifyContent: "space-between" }}>
          <Col span={12}>
            <Row gutter={[16, 16]}>
              <Col>
                {orderModel &&
                  orderModel.status ===
                    ORDER_STATUS.ORDER_STATUS_WAITING_ACCEPT && (
                    <Button
                      style={{ background: "#1fbf39", color: "white" }}
                      onClick={() => showAcceptModel()}
                    >
                      Xác nhận
                    </Button>
                  )}
                {orderModel &&
                  orderModel.status === ORDER_STATUS.ORDER_STATUS_ACCEPT && (
                    <Button
                      style={{ background: "#1fbf39", color: "white" }}
                      onClick={() => showAcceptModel()}
                    >
                      Xác nhận
                    </Button>
                  )}
                {orderModel &&
                  orderModel.status === ORDER_STATUS.ORDER_STATUS_DELIVERY && (
                    <Button
                      style={{ background: "#1fbf39", color: "white" }}
                      onClick={() => showDeliveryModel()}
                    >
                      Xác nhận bàn giao cho đơn vị vận chuyển
                    </Button>
                  )}
                {orderModel &&
                  orderModel.status ===
                    ORDER_STATUS.ORDER_STATUS_FINISH_DELIVERY && (
                    <Button
                      style={{ background: "#1fbf39", color: "white" }}
                      onClick={() => showAcceptFinish()}
                    >
                      Xác nhận hoàn thành
                    </Button>
                  )}
              </Col>
              {orderModel &&
                !(
                  orderModel.status === ORDER_STATUS.ORDER_STATUS_SUCCESS ||
                  orderModel.status ===
                    ORDER_STATUS.ORDER_STATUS_CUSTOMER_CANCEL
                ) && (
                  <Col>
                    <Button onClick={() => showRejectModel()}>Huỷ đơn</Button>
                  </Col>
                )}
            </Row>
          </Col>
          <Col span={12}>
            <Row gutter={[16, 16]} justify={"end"}>
              {/* <Col>
                <Button>Chi tiết</Button>
              </Col> */}
              <Col>
                <Button
                  type="primary"
                  value="large"
                  style={{
                    background: "#2596be",
                  }}
                  onClick={() => reactToPrintFn()}
                >
                  In hóa đơn
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
      <br />

      <div ref={refOrderInfo}>
        {tabs.map(
          (tab, index) =>
            activeTab === tab.id && (
              <Form
                form={form}
                onFinish={null}
                onFinishFailed={onFinishFailed}
                initialValues={{ layout: "horizontal" }}
                layout="vertical"
              >
                <Card>
                  <Row
                    gutter={[25, 25]}
                    style={{ justifyContent: "space-between" }}
                  >
                    <Col span={24}>
                      <Row gutter={[16, 16]} justify={"space-between"}>
                        <Col span={24}>
                          <span
                            className="hide-menu"
                            style={{
                              fontSize: "13px",
                              color: "black",
                              fontWeight: "bold",
                            }}
                          >
                            Thông tin khách hàng
                          </span>
                        </Col>
                        <Divider orientation="left" plain />
                        <br />
                        <Col span={12}>
                          <Row>
                            <Col span={5}>
                              <p style={{ fontWeight: "bold" }}>
                                Họ tên khách hàng:{" "}
                              </p>
                            </Col>
                            <Col span={12} style={{ textAlign: "left" }}>
                              <p style={{ fontWeight: "500" }}>
                                {orderModel &&
                                  orderModel.userModel &&
                                  orderModel.userModel.fullName}
                              </p>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={5}>
                              <p style={{ fontWeight: "bold" }}>
                                Số điện thoại:{" "}
                              </p>
                            </Col>
                            <Col span={12} style={{ textAlign: "left" }}>
                              <p style={{ fontWeight: "500" }}>
                                {orderModel &&
                                  orderModel.userModel &&
                                  orderModel.userModel.phoneNumber}
                              </p>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={5}>
                              <p style={{ fontWeight: "bold" }}>Email: </p>
                            </Col>
                            <Col span={12} style={{ textAlign: "left" }}>
                              <p style={{ fontWeight: "500" }}>
                                {orderModel &&
                                  orderModel.userModel &&
                                  orderModel.userModel.email}
                              </p>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={5}>
                              <p style={{ fontWeight: "bold" }}>Địa chỉ: </p>
                            </Col>
                            <Col span={12} style={{ textAlign: "left" }}>
                              <p style={{ fontWeight: "500" }}>
                                {orderModel &&
                                  orderModel.addressModel &&
                                  orderModel.addressModel.fullInfo}
                              </p>
                            </Col>
                          </Row>
                        </Col>
                        <Col span={12}>
                          <Row>
                            <Col span={5}>
                              <p style={{ fontWeight: "bold" }}>
                                Mã đơn hàng:{" "}
                              </p>
                            </Col>
                            <Col span={12} style={{ textAlign: "left" }}>
                              <p style={{ fontWeight: "500" }}>
                                {orderModel && orderModel.code}
                              </p>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={5}>
                              <p style={{ fontWeight: "bold" }}>Trạng thái: </p>
                            </Col>
                            <Col span={12} style={{ textAlign: "left" }}>
                              <p style={{ fontWeight: "500" }}>
                                {orderModel &&
                                  ORDER_STATUS_LABEL?.[orderModel.status]}
                              </p>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={5}>
                              <p style={{ fontWeight: "bold" }}>
                                Loại đơn hàng:{" "}
                              </p>
                            </Col>
                            <Col span={12} style={{ textAlign: "left" }}>
                              <p style={{ fontWeight: "500" }}>
                                {orderModel && orderModel.typeString}
                              </p>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card>
                <br />
                <Card>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <span
                        className="hide-menu"
                        style={{
                          fontSize: "13px",
                          color: "black",
                          fontWeight: "bold",
                        }}
                      >
                        Lịch sử thanh toán
                      </span>
                    </Col>

                    {orderModel && orderModel.status === 1 && (
                      <Col span={12} style={{ textAlign: "right" }}>
                        <ProductPopUp
                          handleProductSelected={handleProductSelected}
                          modelProduct={tab.products}
                          tabIndex={index}
                        />
                      </Col>
                    )}
                  </Row>
                  <Divider orientation="left" plain />
                  <Table
                    dataSource={tab.paymentHistory}
                    columns={columnsPayment}
                    pagination={false}
                    loading={false}
                    onChange={null}
                  />
                </Card>
                <br />
                <Card>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <span
                        className="hide-menu"
                        style={{
                          fontSize: "13px",
                          color: "black",
                          fontWeight: "bold",
                        }}
                      >
                        Thông tin sản phẩm đã mua
                      </span>
                    </Col>

                    {orderModel && orderModel.status === 1 && (
                      <Col span={12} style={{ textAlign: "right" }}>
                        <ProductPopUp
                          handleProductSelected={handleProductSelected}
                          modelProduct={tab.products}
                          tabIndex={index}
                        />
                      </Col>
                    )}
                  </Row>
                  <Divider orientation="left" plain />
                  <Table
                    dataSource={tab.products}
                    columns={columns}
                    pagination={false}
                    loading={false}
                    onChange={null}
                  />
                </Card>
              </Form>
            )
        )}
        <br />
        <Card>
          <Row>
            <Col span={12}>
              <span
                className="hide-menu"
                style={{
                  fontSize: "13px",
                  color: "black",
                  fontWeight: "bold",
                }}
              >
                Phiếu giảm giá
              </span>

              <p style={{ fontWeight: "500", marginBottom: 0 }}>
                {orderModel && orderModel.couponModel.code}
              </p>
            </Col>
            <Col span={12}>
              <Col span={24}>
                <Row align={"middle"} gutter={[16, 16]}>
                  <Col span={6}>
                    <p style={{ fontWeight: "500", marginBottom: 0 }}>
                      Tổng tiền hàng:
                    </p>
                  </Col>
                  <Col span={18} style={{ textAlign: "right" }}>
                    <p style={{ fontWeight: "700", marginBottom: 0 }}>
                      {formatCurrencyVND(orderModel ? orderModel.realPrice : 0)}
                    </p>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row align={"middle"} gutter={[16, 16]}>
                  <Col span={6}>
                    <p style={{ fontWeight: "500", marginBottom: 0 }}>
                      Giảm giá:
                    </p>
                  </Col>
                  <Col span={18} style={{ textAlign: "right" }}>
                    <p style={{ fontWeight: "700", marginBottom: 0 }}>
                      {formatCurrencyVND(discount)}
                    </p>
                  </Col>
                </Row>
              </Col>
              {orderModel && orderModel.isDeliver === DELIVERY_STATUS.YES && (
                <Col span={24}>
                  <Row align={"middle"} gutter={[16, 16]}>
                    <Col span={6}>
                      <p style={{ fontWeight: "500", marginBottom: 0 }}>
                        Phí vận chuyển:
                      </p>
                    </Col>
                    <Col span={18} style={{ textAlign: "right" }}>
                      <p style={{ fontWeight: "700", marginBottom: 0 }}>
                        {formatCurrencyVND(
                          orderModel ? orderModel.feeDelivery : 0
                        )}
                      </p>
                    </Col>
                  </Row>
                </Col>
              )}
              <Col span={24}>
                <Row align={"middle"} gutter={[16, 16]}>
                  <Col span={6}>
                    <p
                      style={{
                        fontWeight: "500",
                        marginBottom: 0,
                        fontSize: 20,
                      }}
                    >
                      Tổng tiền:
                    </p>
                  </Col>
                  <Col span={18} style={{ textAlign: "right" }}>
                    <p
                      style={{
                        fontWeight: "700",
                        marginBottom: 0,
                        fontSize: 20,
                      }}
                    >
                      {formatCurrencyVND(
                        orderModel ? orderModel.totalPrice : 0
                      )}
                    </p>
                  </Col>
                </Row>
              </Col>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetail;
