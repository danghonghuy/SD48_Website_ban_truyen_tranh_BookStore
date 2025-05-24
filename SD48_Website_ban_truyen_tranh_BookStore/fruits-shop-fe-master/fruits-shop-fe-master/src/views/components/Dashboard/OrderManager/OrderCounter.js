import {
  Button, Col, Form, Input, Modal, Row, Select, Space, Table, Card, Radio, Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Trash2, CircleX, UserRoundX, ListX, XCircle } from "lucide-react";
import ProductPopUp from "./ProductPopUp";
import VoucherPopup from "./VoucherPopup";
import PaymentType from "./PaymentType";
import CustomerPopup from "./CustomerPopup";
// import { Option } from "antd/es/mentions"; // Option có thể import trực tiếp từ 'antd/es/select' hoặc dùng Select.Option
 // Hoặc dùng trực tiếp <Select.Option>
import useAddress from "@api/useAddress";
import useOrder from "@api/useOrder";
import useShippingFee from "@api/useShippingFee";
import { DELIVERY_STATUS } from "@constants/orderStatusConstant";
import { getMediaUrl } from "@constants/commonFunctions";
import { useNavigate } from "react-router-dom";
// import { format, parseISO } from "date-fns"; // Không thấy dùng, có thể bỏ
// import dayjs from "dayjs"; // Không thấy dùng, có thể bỏ
const { Option } = Select;
const Tab = ({ label, activeTab, setActiveTab, closeTab }) => {
  return (
    <div
      onClick={() => setActiveTab(label)}
      style={{
        display: "inline-block", padding: "5px 10px", cursor: "pointer",
        backgroundColor: activeTab === label ? "#2596be" : "#f0f0f0",
        margin: "5px", borderRadius: "8px 8px 0 0", border: "1px solid #d9d9d9",
        borderBottom: activeTab === label ? "none" : "1px solid #d9d9d9",
      }}
    >
      <span style={{ fontSize: "14px", fontWeight: activeTab === label ? "bold" : "normal", color: activeTab === label ? "#fff" : "#000", marginRight: "8px" }}>
        {label}
      </span>
      <CircleX size={18} onClick={(e) => { e.stopPropagation(); closeTab(label); }} color={activeTab === label ? "#fff" : "#888"} style={{ verticalAlign: "middle", cursor: "pointer" }} />
    </div>
  );
};

const OrderCounter = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  const createNewTabData = (id, isActive = false) => ({
    id: id, active: isActive, products: [], userModel: null, provinceId: null, districtId: null,
    wardId: null, addressDetail: "", totalPrice: 0, paymentId: null,
    isDeliver: DELIVERY_STATUS.NO, couponModel: null, discount: 0, feeDelivery: 0,
    address: [], provinces: [], wards: [], districts: [], productSeletedIds: [],
  });

  const [tabs, setTabs] = useState(() => {
    var models = localStorage.getItem("orderForms");
    setIsLoaded(true);
    if (models) {
      const parsedModels = JSON.parse(models);
      if (parsedModels.length === 0) return [createNewTabData("Đơn hàng 1", true)];
      const activeExists = parsedModels.some((t) => t.active);
      if (!activeExists && parsedModels.length > 0) parsedModels[0].active = true;
      return parsedModels.map((tab) => ({
        ...createNewTabData(tab.id, tab.active), ...tab,
        totalPrice: tab.totalPrice || 0, discount: tab.discount || 0, feeDelivery: tab.feeDelivery || 0,
        isDeliver: tab.isDeliver === undefined ? DELIVERY_STATUS.NO : tab.isDeliver,
      }));
    }
    return [createNewTabData("Đơn hàng 1", true)];
  });

  const [activeTab, setActiveTab] = useState(() => {
    const modelsString = localStorage.getItem("orderForms");
    if (modelsString) {
      const loadedTabs = JSON.parse(modelsString);
      if (loadedTabs.length > 0) {
        const activeInStorage = loadedTabs.find((t) => t.active);
        if (activeInStorage) return activeInStorage.id;
        return loadedTabs.length > 0 ? loadedTabs[0].id : "Đơn hàng 1";
      }
    }
    return "Đơn hàng 1";
  });

  const [payments, setPayments] = useState([]);
  const { createOrder } = useOrder();
  const { getProvince, getDistrict, getWard } = useAddress();
  const { getFee } = useShippingFee();
  const [province, setProvinceState] = useState([]);
  const [district, setDistrictState] = useState([]);
  const [ward, setWardState] = useState([]);
  const [isLoadingOrderCreation, setIsLoadingOrderCreation] = useState(false);

  const switchTabHandler = (tabId) => {
    setTabs((prevTabs) => prevTabs.map((t) => ({ ...t, active: t.id === tabId })));
    setActiveTab(tabId);
  };

  const addTab = () => {
    if (tabs.length < 5) {
      let maxNum = 0;
      tabs.forEach((tab) => {
        const match = tab.id.match(/^Đơn hàng (\d+)$/);
        if (match && parseInt(match[1]) > maxNum) maxNum = parseInt(match[1]);
      });
      const newTabId = `Đơn hàng ${maxNum + 1}`;
      const newTab = createNewTabData(newTabId, true);
      const updatedOldTabs = tabs.map((tab) => ({ ...tab, active: false }));
      setTabs([...updatedOldTabs, newTab]);
      setActiveTab(newTabId);
    } else toast.error("Chỉ có thể tạo tối đa 5 đơn hàng cùng lúc!");
  };

  const closeTab = (tabIdToClose) => {
    let newTabsArray = tabs.filter((tab) => tab.id !== tabIdToClose);
    if (newTabsArray.length === 0) {
      const defaultTab = createNewTabData("Đơn hàng 1", true);
      setTabs([defaultTab]);
      setActiveTab(defaultTab.id);
    } else {
      if (activeTab === tabIdToClose) {
        const newActiveTab = newTabsArray[newTabsArray.length - 1];
        newTabsArray = newTabsArray.map((tab) => tab.id === newActiveTab.id ? { ...tab, active: true } : { ...tab, active: false });
        setActiveTab(newActiveTab.id);
      } else {
        newTabsArray = newTabsArray.map((tab) => tab.id === activeTab ? { ...tab, active: true } : { ...tab, active: false });
      }
      setTabs(newTabsArray);
    }
  };

  const deleteAllTabs = () => {
    const defaultTab = createNewTabData("Đơn hàng 1", true);
    setTabs([defaultTab]);
    setActiveTab(defaultTab.id);
    toast.info("Đã xóa tất cả hóa đơn và tạo lại hóa đơn mặc định.");
  };

  const resetToGuestCustomer = (activeTabId) => {
    const tabIndex = tabs.findIndex((t) => t.id === activeTabId);
    if (tabIndex === -1) return;
    const modelTabs = [...tabs];
    modelTabs[tabIndex] = {
      ...modelTabs[tabIndex], userModel: null, address: [], provinceId: null, districtId: null,
      wardId: null, addressDetail: "", isDeliver: DELIVERY_STATUS.NO, feeDelivery: 0,
    };
    setTabs(modelTabs);
    setDistrictState([]);
    setWardState([]);
    toast.info(`Đã reset khách hàng cho ${activeTabId} về khách hàng vãng lai.`);
  };

  const fetchPaymentOptions = async () => setPayments([{ value: 2, label: "Chuyển khoản ngân hàng" }, { value: 1, label: "Tiền mặt" }]);

  const showOrderCreatedConfirm = (orderId, tabIdToClose) => {
    Modal.confirm({
      title: "Tạo đơn hàng thành công!",
      content: `Đơn hàng với ID ${orderId} đã được tạo. Bạn có muốn đến trang danh sách đơn hàng không?`,
      okText: "Đến danh sách", cancelText: "Ở lại",
      onOk() {
        closeTab(tabIdToClose);
        setTimeout(() => { navigate("/dashboard/order"); }, 100);
      },
      onCancel() { closeTab(tabIdToClose); console.log("Người dùng chọn ở lại."); },
    });
  };

  const onCreateOrder = async (modelProducts, tabIds) => {
    setIsLoadingOrderCreation(true);
    try {
      const tabInfo = tabs.find((e) => e.id === tabIds);
      if (!tabInfo) {
        toast.error("Không tìm thấy thông tin tab đơn hàng.");
        setIsLoadingOrderCreation(false);
        return;
      }
      let finalFullName = "Khách hàng vãng lai";
      let finalPhoneNumber = "N/A";
      let finalEmail = "";
      let customerPayloadId = null;
      if (tabInfo.userModel?.id) {
        finalFullName = tabInfo.userModel.fullName;
        finalPhoneNumber = tabInfo.userModel.phoneNumber;
        finalEmail = tabInfo.userModel.email;
        customerPayloadId = tabInfo.userModel.id;
      } else if (tabInfo.isDeliver === DELIVERY_STATUS.YES) {
        finalFullName = tabInfo.userModel?.fullName || "Khách giao hàng";
        finalPhoneNumber = tabInfo.userModel?.phoneNumber || "N/A";
        finalEmail = tabInfo.userModel?.email || "";
        if (!finalFullName || finalFullName === "Khách giao hàng" || !finalPhoneNumber || finalPhoneNumber === "N/A" || !tabInfo.provinceId || !tabInfo.districtId || !tabInfo.wardId || !tabInfo.addressDetail) {
          toast.error("Vui lòng nhập đầy đủ thông tin giao hàng (Họ tên, SĐT, Địa chỉ).");
          setIsLoadingOrderCreation(false);
          return;
        }
      }
      const addressForOrder = [];
      if (tabInfo.isDeliver === DELIVERY_STATUS.YES) {
        let currentProvinceName = province.find((p) => String(p.code) === String(tabInfo.provinceId))?.name;
        let currentDistrictName = district.find((d) => String(d.code) === String(tabInfo.districtId))?.name;
        let currentWardName = ward.find((w) => String(w.code) === String(tabInfo.wardId))?.name;
        if (tabInfo.userModel?.id && tabInfo.address?.length > 0) {
          const selectedUserAddress = tabInfo.address.find((a) => String(a.provinceId) === String(tabInfo.provinceId) && String(a.districtId) === String(tabInfo.districtId) && String(a.wardId) === String(tabInfo.wardId) && a.addressDetail === tabInfo.addressDetail) || tabInfo.address[0];
          addressForOrder.push({
            provinceId: selectedUserAddress.provinceId, districtId: selectedUserAddress.districtId, wardId: selectedUserAddress.wardId,
            addressDetail: selectedUserAddress.addressDetail, stage: 1, provinceName: selectedUserAddress.provinceName || currentProvinceName,
            districtName: selectedUserAddress.districtName || currentDistrictName, wardName: selectedUserAddress.wardName || currentWardName, id: selectedUserAddress.id,
          });
        } else {
          addressForOrder.push({
            provinceId: tabInfo.provinceId, districtId: tabInfo.districtId, wardId: tabInfo.wardId,
            addressDetail: tabInfo.addressDetail, stage: 1, provinceName: currentProvinceName,
            districtName: currentDistrictName, wardName: currentWardName,
          });
        }
      }
      const customerPayload = {
        code: tabInfo.userModel?.code || null, fullName: finalFullName, phoneNumber: finalPhoneNumber, email: finalEmail,
        address: addressForOrder, roleId: 8, description: "Khách hàng từ POS", status: 1, id: customerPayloadId,
      };
      var productDetails = modelProducts.map((e) => ({
        productId: e.id, quantity: e.quantity, total: e.quantity * e.price, status: 1, price: e.price, originPrice: e.price,
      }));
      var orderPayload = {
        userId: customerPayloadId, price: tabInfo.totalPrice, paymentId: tabInfo.paymentId,
        feeDelivery: tabInfo.isDeliver === DELIVERY_STATUS.YES ? tabInfo.feeDelivery : 0,
        deliveryType: tabInfo.isDeliver === DELIVERY_STATUS.YES ? 2 : 1, description: null,
        status: tabInfo.isDeliver === DELIVERY_STATUS.NO && tabInfo.paymentId === 1 ? 5 : 2, // Sửa lại logic status ở đây nếu cần
        stage: 1, type: 1, realPrice: modelProducts.reduce((sum, p) => sum + p.price * p.quantity, 0),
        addressId: customerPayloadId && addressForOrder.length > 0 && addressForOrder[0].id ? addressForOrder[0].id : null,
        orderDetailModels: productDetails, couponCode: tabInfo.couponModel?.code || null,
        userModel: customerPayload, userType: customerPayloadId ? 2 : 1, isDeliver: tabInfo.isDeliver, isChangeOrder: 0,
      };
      if (!tabInfo.paymentId) {
        toast.error("Vui lòng chọn hình thức thanh toán.");
        setIsLoadingOrderCreation(false);
        return;
      }
      
      console.log("[FE] Order Payload GỬI ĐI:", JSON.stringify(orderPayload, null, 2));
      const apiResponse = await createOrder(orderPayload); 
      console.log("[FE] Phản hồi THÔ từ API createOrder:", JSON.stringify(apiResponse, null, 2));

      // Kiểm tra kỹ cấu trúc apiResponse trước khi truy cập
      if (apiResponse && apiResponse.success && apiResponse.data) { // Giả sử BE trả về { success: true, data: { id: ..., message: ... } }
        // Hoặc nếu BE trả về { code: 200, message: ..., data: ... } thì điều kiện là:
        // if (apiResponse && apiResponse.code === 200 && apiResponse.data) {
        toast.success(apiResponse.message || apiResponse.data.message || "Tạo đơn hàng thành công!");
        showOrderCreatedConfirm(apiResponse.data.id || apiResponse.data, tabIds); // Giả sử data chứa ID hoặc là ID
      } else if (apiResponse && apiResponse.message) { // Trường hợp BE trả về lỗi có message
        toast.error(apiResponse.message);
      }
      else {
        // Lỗi chung nếu response không như mong đợi
        toast.error("Có lỗi xảy ra khi tạo đơn hàng hoặc phản hồi không hợp lệ.");
        console.error("Phản hồi không mong đợi từ BE:", apiResponse);
      }

    } catch (error) {
      console.error("Lỗi trong hàm onCreateOrder (FE Catch Block):", error);
      let errorMessage = "Lỗi không xác định khi tạo đơn hàng.";
      if (error.response && error.response.data && error.response.data.message) { // Lỗi từ Axios response
        errorMessage = error.response.data.message;
      } else if (error.message) { // Lỗi JS thông thường
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoadingOrderCreation(false);
    }
  };

  useEffect(() => { if (isLoaded) localStorage.setItem("orderForms", JSON.stringify(tabs)); }, [tabs, isLoaded]);
  const fetchProvinces = async () => {
    const { success, data } = await getProvince({ name: null });
    if (!success || data.status === "Error") toast.error(data.message);
    else setProvinceState(data.data);
  };
  useEffect(() => { fetchPaymentOptions(); fetchProvinces(); }, []);

  const calculateFinalPayableAmount = (tabData) => {
    const subTotal = tabData.totalPrice || 0;
    const shippingFee = tabData.isDeliver === DELIVERY_STATUS.YES ? tabData.feeDelivery || 0 : 0;
    let discountAmount = tabData.discount || 0;
    const totalBeforeDiscount = subTotal + shippingFee;
    if (discountAmount > totalBeforeDiscount) discountAmount = totalBeforeDiscount;
    const finalAmount = totalBeforeDiscount - discountAmount;
    return finalAmount < 0 ? 0 : finalAmount;
  };

  const handleResetVoucher = (tabIndex) => {
    const modelTabs = [...tabs];
    const currentTab = modelTabs[tabIndex];
    if (currentTab) {
      currentTab.couponModel = null;
      currentTab.discount = 0;
      setTabs(modelTabs);
      toast.info("Đã bỏ chọn phiếu giảm giá.");
    }
  };

  const updateTabDataAndDiscount = (tabIndex, updatedProducts, newTotalPrice) => {
    const modelTabs = [...tabs];
    const currentTab = modelTabs[tabIndex];
    currentTab.products = updatedProducts;
    currentTab.totalPrice = newTotalPrice;
    let discountNumber = 0;
    let currentCoupon = currentTab.couponModel;
    if (currentCoupon) {
      if (currentCoupon.minValue <= newTotalPrice) {
        if (currentCoupon.type === 1) {
          const discCalc = (newTotalPrice * currentCoupon.percentValue) / 100;
          discountNumber = discCalc > currentCoupon.maxValue ? currentCoupon.maxValue : discCalc;
        } else { discountNumber = currentCoupon.couponAmount; }
      } else {
        currentCoupon = null; discountNumber = 0;
        toast.warning("Giá trị đơn hàng không đủ để sử dụng khuyến mãi này, khuyến mãi đã được bỏ.");
      }
    }
    currentTab.discount = discountNumber;
    currentTab.couponModel = currentCoupon;
    setTabs(modelTabs);
  };

  const handleProductSelected = (products, index) => {
    const sum = products.reduce((acc, item) => acc + item.price * item.quantity, 0);
    updateTabDataAndDiscount(index, products, sum);
  };

  const handleInputQuantity = (prodIndex, value, stock) => {
    const tabDataIndex = tabs.findIndex((e) => e.id === activeTab);
    if (tabDataIndex === -1) return;
    const parsedValue = parseInt(value);
    if (parsedValue > stock) { toast.warning(`Số lượng không được vượt quá ${stock}`); return; }
    const modelTabs = [...tabs];
    const currentTab = modelTabs[tabDataIndex];
    if (!currentTab.products[prodIndex]) return;
    currentTab.products[prodIndex].quantity = isNaN(parsedValue) || parsedValue < 1 ? 1 : parsedValue;
    const sum = currentTab.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
    updateTabDataAndDiscount(tabDataIndex, currentTab.products, sum);
  };

  const handleRemoveProd = (prodListIndex) => {
    const tabDataIndex = tabs.findIndex((e) => e.id === activeTab);
    if (tabDataIndex === -1) return;
    const modelTabs = [...tabs];
    const currentTab = modelTabs[tabDataIndex];
    if (!currentTab.products[prodListIndex]) return;
    currentTab.products.splice(prodListIndex, 1);
    const sum = currentTab.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
    if (currentTab.products.length === 0) { currentTab.couponModel = null; currentTab.discount = 0; }
    updateTabDataAndDiscount(tabDataIndex, currentTab.products, sum);
  };

  const handleChangeAddressDetail = (e, index) => {
    const tabModel = [...tabs];
    tabModel[index].addressDetail = e.target.value;
    setTabs(tabModel);
  };
  function formatCurrencyVND(amount) { return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount || 0); }
  const handlePaymentId = (paymentValue, index) => {
    const modelTabs = [...tabs];
    modelTabs[index].paymentId = paymentValue;
    setTabs(modelTabs);
  };
  const fetchDistrictsForProvince = async (provinceId) => {
    setDistrictState([]); setWardState([]);
    if (!provinceId) return;
    const { success, data } = await getDistrict({ code: provinceId, name: null });
    if (!success || data.status === "Error") toast.error(data.message);
    else setDistrictState(data.data);
  };
const fetchWardsForDistrict = async (districtId) => {
  setWardState([]);
  if (!districtId) return;
  // Sửa key từ 'code' thành 'districtCode' để khớp với backend
  const { success, data } = await getWard({ districtCode: districtId, name: null });
  //                                         ^^^^^^^^^^^^
  if (!success || data.status === "Error") {
    toast.error(data.message);
  } else {
    setWardState(data.data);
  }
};
  const calculateShippingFee = async (provinceId) => {
    if (!provinceId) return 0;
    const { success, data } = await getFee({ pointSource: "22", pointDestination: provinceId });
    if (!success || data.status === "Error") { toast.error(data.message || "Lỗi tính phí vận chuyển."); return 0; }
    else return data.data || 0;
  };
  const handleSelectProvince = async (provinceCode, index) => {
    const modelTabs = [...tabs];
    const currentTab = modelTabs[index];
    currentTab.provinceId = provinceCode; currentTab.districtId = null; currentTab.wardId = null;
    setDistrictState([]); setWardState([]);
    await fetchDistrictsForProvince(provinceCode);
    const fee = currentTab.isDeliver === DELIVERY_STATUS.YES && provinceCode ? await calculateShippingFee(provinceCode) : 0;
    currentTab.feeDelivery = fee;
    setTabs(modelTabs);
  };
  const handleSelectDistrict = async (districtCode, index) => {
     console.log("Selected districtCode in handleSelectDistrict:", districtCode); 
    const modelTabs = [...tabs];
    modelTabs[index].districtId = districtCode; modelTabs[index].wardId = null;
    setWardState([]);
    await fetchWardsForDistrict(districtCode);
    setTabs(modelTabs);
  };
  const handleSelectWard = (wardCode, index) => {
    const modelTabs = [...tabs];
    modelTabs[index].wardId = wardCode;
    setTabs(modelTabs);
  };
  const handleSelectUser = async (selectedUser, index) => {
    const modelTabs = [...tabs];
    const currentTab = modelTabs[index];
    let fee = 0;
    currentTab.userModel = { ...selectedUser }; currentTab.address = selectedUser.address || [];
    currentTab.provinceId = null; currentTab.districtId = null; currentTab.wardId = null; currentTab.addressDetail = "";
    setDistrictState([]); setWardState([]);
    if (currentTab.isDeliver === DELIVERY_STATUS.YES) {
      const userAddress = selectedUser.address?.find((addr) => addr.isDefault) || selectedUser.address?.[0];
      if (userAddress?.provinceId) {
        currentTab.provinceId = userAddress.provinceId; currentTab.districtId = userAddress.districtId;
        currentTab.wardId = userAddress.wardId; currentTab.addressDetail = userAddress.addressDetail || "";
        await fetchDistrictsForProvince(userAddress.provinceId);
        await fetchWardsForDistrict(userAddress.districtId);
        fee = await calculateShippingFee(userAddress.provinceId);
      }
    }
    currentTab.feeDelivery = fee;
    setTabs(modelTabs);
  };
  const handleSelectCounpon = (coupon, index) => {
    const modelTabs = [...tabs];
    const currentTab = modelTabs[index];
    const currentTotalPrice = currentTab.totalPrice || 0;
    const currentShippingFee = currentTab.isDeliver === DELIVERY_STATUS.YES ? currentTab.feeDelivery || 0 : 0;
    if (coupon.minValue > currentTotalPrice) {
      toast.warning("Giá trị đơn hàng chưa đạt mức tối thiểu để áp dụng phiếu giảm giá này.");
      return;
    }
    let potentialDiscount = 0;
    if (coupon.type === 1) {
      const discCalc = (currentTotalPrice * coupon.percentValue) / 100;
      potentialDiscount = discCalc > coupon.maxValue ? coupon.maxValue : discCalc;
    } else { potentialDiscount = coupon.couponAmount; }
    const finalAmountIfApplied = (currentTotalPrice + currentShippingFee) - potentialDiscount;
    if (finalAmountIfApplied < 0) {
      toast.error("Không thể áp dụng mã giảm giá này vì sẽ làm giá trị đơn hàng âm. Vui lòng chọn mã khác.");
      return;
    }
    currentTab.discount = potentialDiscount;
    currentTab.couponModel = coupon;
    setTabs(modelTabs);
    toast.success(`Đã áp dụng phiếu giảm giá: ${coupon.name}`);
  };
  const handleSetGuestDeliveryDetail = (field, value, index) => {
    const modelTabs = [...tabs];
    if (!modelTabs[index].userModel) modelTabs[index].userModel = {};
    modelTabs[index].userModel[field] = value;
    setTabs(modelTabs);
  };
  const handleSetIsDeliver = async (deliveryStatus, index) => {
    const modelTabs = [...tabs];
    const currentTab = modelTabs[index];
    currentTab.isDeliver = deliveryStatus;
    let fee = 0;
    if (deliveryStatus === DELIVERY_STATUS.YES) {
      const currentUserModel = currentTab.userModel;
      const userAddress = currentUserModel?.address?.find((addr) => addr.isDefault) || currentUserModel?.address?.[0];
      if (currentUserModel?.id && userAddress?.provinceId) {
        currentTab.provinceId = userAddress.provinceId; currentTab.districtId = userAddress.districtId;
        currentTab.wardId = userAddress.wardId; currentTab.addressDetail = userAddress.addressDetail || "";
        await fetchDistrictsForProvince(userAddress.provinceId);
        await fetchWardsForDistrict(userAddress.districtId);
        fee = await calculateShippingFee(userAddress.provinceId);
      } else if (currentTab.provinceId) { fee = await calculateShippingFee(currentTab.provinceId); }
    } else {
      fee = 0;
      if (!currentTab.userModel?.id) {
        currentTab.provinceId = null; currentTab.districtId = null; currentTab.wardId = null;
        currentTab.addressDetail = ""; setDistrictState([]); setWardState([]);
      }
    }
    currentTab.feeDelivery = fee;
    setTabs(modelTabs);
  };

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 10 }}>
        <Col xs={24} sm={12} style={{ textAlign: "left" }}><Button icon={<ListX size={18} />} danger onClick={deleteAllTabs}>Xóa hết HĐ</Button></Col>
        <Col xs={24} sm={12} style={{ textAlign: "right" }}><Button type="primary" style={{ background: "#2596be" }} onClick={addTab}>Thêm HĐ</Button></Col>
      </Row>
      <div style={{ marginBottom: "10px", whiteSpace: "nowrap", overflowX: "auto", borderBottom: "1px solid #d9d9d9" }}>
        {tabs.map((tab) => (<Tab key={tab.id} label={tab.id} activeTab={activeTab} setActiveTab={switchTabHandler} closeTab={closeTab} />))}
      </div>
      {tabs.map((tab, tabIndex) => {
        const isRegisteredUser = !!tab.userModel?.id;
        const showNamePhoneEmailInputs = isRegisteredUser || (tab.isDeliver === DELIVERY_STATUS.YES && !isRegisteredUser);
        const showDeliveryAddressBlock = tab.isDeliver === DELIVERY_STATUS.YES;
        const currentTableProducts = tab.products;
        const columns = [
          { title: "Hình ảnh", dataIndex: "image", key: "images", width: 80, render: (_, record) => (<img src={getMediaUrl(record.image?.imageUrl)} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }} alt={record.name} />) },
          { title: "Tên sản phẩm", dataIndex: "name", key: "name", width: 100, render: (text) => (<Typography.Text style={{ fontSize: "13px" }}>{text}</Typography.Text>) },
          { title: "Mã SP", dataIndex: "code", key: "code", width: 100, render: (text) => (<Typography.Text style={{ fontSize: "13px" }}>{text}</Typography.Text>) },
          { title: "Giá", dataIndex: "price", width: 100, render: (text) => (<p style={{ fontSize: "13px", margin: 0 }}>{formatCurrencyVND(text)}</p>) },
          { title: "Số lượng", dataIndex: "quantity", key: "quantity", width: 90, align: "center", render: (text, record) => {
              const originalIndex = currentTableProducts.findIndex((p) => p.id === record.id);
              if (originalIndex === -1) return (<Input type="number" value={record.quantity} disabled style={{ width: "100%", textAlign: "center" }} />);
              return (<Input style={{ width: "100%", textAlign: "center" }} type="number" value={record.quantity} onChange={(e) => handleInputQuantity(originalIndex, e.target.value, record.stock)} min={1} max={record.stock} />);
          }},
          { title: "Thao tác", key: "action", width: 80, align: "center", render: (_, record) => {
              const originalIndex = currentTableProducts.findIndex((p) => p.id === record.id);
              if (originalIndex === -1) return null;
              return (<Space><Trash2 style={{ color: "gray", cursor: "pointer" }} onClick={() => handleRemoveProd(originalIndex)} /></Space>);
          }},
        ];
        return (
          activeTab === tab.id && (
            <div key={tab.id}>
              <Card style={{ marginBottom: 15 }}>
                <Row gutter={[16, 16]} style={{ marginBottom: 10 }}><Col span={24} style={{ textAlign: "right" }}><ProductPopUp handleProductSelected={handleProductSelected} modelProduct={tab.products} tabIndex={tabIndex} /></Col></Row>
                <Table dataSource={tab.products} columns={columns} pagination={{ pageSize: 5, hideOnSinglePage: true }} rowKey="id" size="small" scroll={{ x: "max-content" }} />
              </Card>
              <Row gutter={[20, 20]} style={{ justifyContent: "space-between" }}>
                <Col xs={24} lg={12}>
                  <Card size="small">
                    <Row gutter={[16, 16]}>
                      <Col span={24}><Space style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: "14px", color: "black", fontWeight: "bold" }}>Thông tin khách hàng</span><Button icon={<UserRoundX size={16} />} size="small" onClick={() => resetToGuestCustomer(tab.id)}>Khách vãng lai</Button></Space></Col>
                      <Col span={18}><Input readOnly value={isRegisteredUser ? `${tab.userModel.fullName} (${tab.userModel.phoneNumber})` : "Khách hàng vãng lai"} /></Col>
                      <Col span={6} style={{ textAlign: "right" }}><CustomerPopup handlePopupSelected={(user) => handleSelectUser(user, tabIndex)} /></Col>
                      {showNamePhoneEmailInputs && !isRegisteredUser && (
                        <><Col xs={24} sm={12}><p style={{ fontWeight: "500", marginBottom: 2 }}>Họ tên: <span style={{ color: "red" }}>(*)</span></p><Input placeholder="Nhập họ tên" value={tab.userModel?.fullName || ""} onChange={(e) => handleSetGuestDeliveryDetail("fullName", e.target.value, tabIndex)} /></Col>
                        <Col xs={24} sm={12}><p style={{ fontWeight: "500", marginBottom: 2 }}>SĐT: <span style={{ color: "red" }}>(*)</span></p><Input placeholder="Nhập số điện thoại" value={tab.userModel?.phoneNumber || ""} onChange={(e) => handleSetGuestDeliveryDetail("phoneNumber", e.target.value, tabIndex)} /></Col>
                        <Col span={24}><p style={{ fontWeight: "500", marginBottom: 2 }}>Email:</p><Input placeholder="Nhập email" value={tab.userModel?.email || ""} onChange={(e) => handleSetGuestDeliveryDetail("email", e.target.value, tabIndex)} /></Col></>
                      )}
                      <Col span={24}><Radio.Group onChange={(e) => handleSetIsDeliver(e.target.value, tabIndex)} value={tab.isDeliver}><Radio value={DELIVERY_STATUS.NO}>Lấy tại quầy</Radio>{isRegisteredUser && (<Radio value={DELIVERY_STATUS.YES}>Giao hàng</Radio>)}</Radio.Group></Col>
                      {showDeliveryAddressBlock && (
                        <><Col xs={24} sm={8}><p style={{ fontWeight: "500", marginBottom: 2 }}>Tỉnh/Thành phố: <span style={{ color: "red" }}>(*)</span></p><Select value={tab.provinceId} placeholder="Chọn Tỉnh/TP" onChange={(value) => handleSelectProvince(value, tabIndex)} style={{ width: "100%" }} options={province.map((p) => ({ value: p.code, label: p.name }))} showSearch filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())} allowClear /></Col>
                        <Col xs={24} sm={8}><p style={{ fontWeight: "500", marginBottom: 2 }}>Quận/Huyện: <span style={{ color: "red" }}>(*)</span></p><Select value={tab.districtId} placeholder="Chọn Quận/Huyện" onChange={(value) => handleSelectDistrict(value, tabIndex)} style={{ width: "100%" }} disabled={!tab.provinceId} options={district.map((d) => ({ value: d.code, label: d.name }))} showSearch filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())} allowClear /></Col>
                        <Col xs={24} sm={8}><p style={{ fontWeight: "500", marginBottom: 2 }}>Xã/Phường: <span style={{ color: "red" }}>(*)</span></p><Select value={tab.wardId} placeholder="Chọn Xã/Phường" onChange={(value) => handleSelectWard(value, tabIndex)} style={{ width: "100%" }} disabled={!tab.districtId} options={ward.map((w) => ({ value: w.code, label: w.name }))} showSearch filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())} allowClear /></Col>
                        <Col span={24}><p style={{ fontWeight: "500", marginBottom: 2 }}>Địa chỉ chi tiết: <span style={{ color: "red" }}>(*)</span></p><Input placeholder="Số nhà, tên đường,..." value={tab.addressDetail} onChange={(e) => handleChangeAddressDetail(e, tabIndex)} /></Col></>
                      )}
                    </Row>
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card size="small">
                    <Row gutter={[16, 16]}>
                      <Col span={24}><span style={{ fontSize: "14px", color: "black", fontWeight: "bold" }}>Thông tin thanh toán</span></Col>
                      <Col span={24}><Row align={"middle"} gutter={[8, 8]}><Col xs={5} sm={4}><p style={{ fontWeight: "500", marginBottom: 0 }}>Mã KM:</p></Col><Col xs={13} sm={15}><Input placeholder="Chọn mã khuyến mãi" value={tab.couponModel?.name || (tab.couponModel?.code ? `Mã: ${tab.couponModel.code}` : "")} readOnly suffix={tab.couponModel && (<XCircle size={16} color="#888" style={{ cursor: "pointer" }} onClick={() => handleResetVoucher(tabIndex)} title="Bỏ chọn phiếu giảm giá" />)} /></Col><Col xs={6} sm={5} style={{ textAlign: "right" }}><VoucherPopup handlePopupSelected={(coupon) => handleSelectCounpon(coupon, tabIndex)} /></Col></Row></Col>
                      <Col span={24}><Row align={"middle"} gutter={[8, 8]}><Col xs={6} sm={5}><p style={{ fontWeight: "500", marginBottom: 0 }}>Thanh toán:<span style={{ color: "red" }}>(*)</span></p></Col><Col xs={18} sm={19}><Select value={tab.paymentId} placeholder="Chọn hình thức" onChange={(value) => handlePaymentId(value, tabIndex)} style={{ width: "100%" }} options={payments} /></Col></Row></Col>
                      <Col span={24}><Row align={"middle"}><Col span={10}><p style={{ fontWeight: "500", marginBottom: 0 }}>Tiền hàng:</p></Col><Col span={14} style={{ textAlign: "right" }}><p style={{ fontWeight: "500", marginBottom: 0 }}>{formatCurrencyVND(tab.totalPrice)}</p></Col></Row></Col>
                      {tab.isDeliver === DELIVERY_STATUS.YES && (<Col span={24}><Row align={"middle"}><Col span={10}><p style={{ fontWeight: "500", marginBottom: 0 }}>Phí vận chuyển:</p></Col><Col span={14} style={{ textAlign: "right" }}><p style={{ fontWeight: "500", marginBottom: 0 }}>{formatCurrencyVND(tab.feeDelivery)}</p></Col></Row></Col>)}
                      <Col span={24}><Row align={"middle"}><Col span={10}><p style={{ fontWeight: "500", marginBottom: 0 }}>Giảm giá voucher:</p></Col><Col span={14} style={{ textAlign: "right" }}><p style={{ fontWeight: "500", marginBottom: 0, color: tab.discount > 0 ? "red" : "inherit" }}>-{formatCurrencyVND(tab.discount)}</p></Col></Row></Col>
                      <Col span={24}><Row align={"middle"}><Col span={10}><p style={{ fontWeight: "bold", marginBottom: 0, fontSize: "18px" }}>Tổng thanh toán:</p></Col><Col span={14} style={{ textAlign: "right" }}><p style={{ fontWeight: "bold", color: "#2596be", fontSize: "22px", margin: 0 }}>{formatCurrencyVND(calculateFinalPayableAmount(tab))}</p></Col></Row></Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
              <Col span={24} style={{ textAlign: "right", marginTop: 15, marginBottom: 15 }}><PaymentType callback={onCreateOrder} amount={calculateFinalPayableAmount(tab)} paymentId={tab.paymentId} products={tab.products} tabIds={tab.id} customerInfo={tab.userModel} isDeliver={tab.isDeliver} isLoading={isLoadingOrderCreation && activeTab === tab.id} /></Col>
            </div>
          )
        );
      })}
    </div>
  );
};
export default OrderCounter;