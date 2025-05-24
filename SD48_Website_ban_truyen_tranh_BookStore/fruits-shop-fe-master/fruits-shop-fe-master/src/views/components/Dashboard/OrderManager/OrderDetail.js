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
  Select,
  InputNumber,
  Tag,
  Typography,
  Alert,
  Descriptions,
  Tooltip,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import useOrder from "@api/useOrder";
import useAddress from "@api/useAddress";
import { useParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import CustomPopup from "./../Common/CustomPopup";
import {
  ORDER_STATUS,
  ORDER_STATUS_OPTIONS,
  ORDER_STATUS_LABEL,
} from "@constants/orderStatusConstant";
import { getMediaUrl } from "@constants/commonFunctions";
import LogOrderPopup from "./LogOrderPopup";
import BillPopUp from "./BillPopup";
import {
  UserOutlined,
  ShoppingOutlined,
  DollarCircleOutlined,
  CarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  PrinterOutlined,
  HistoryOutlined,
  InfoCircleOutlined,
  DeliveredProcedureOutlined,
  SolutionOutlined,
  ScheduleOutlined,
  EditOutlined,
} from "@ant-design/icons";

const { Option } = Select;
const { Title, Text } = Typography;

const CANCEL_REASONS = [
  {
    value: "Khách hàng không muốn lấy hàng nữa",
    label: "Khách hàng không muốn lấy hàng nữa",
  },
  {
    value: "Khách hàng cần cập nhật thông tin (địa chỉ, SĐT, sản phẩm)",
    label: "Khách hàng cần cập nhật thông tin (địa chỉ, SĐT, sản phẩm)",
  },
  {
    value: "Không liên hệ được với khách hàng",
    label: "Không liên hệ được với khách hàng",
  },
  {
    value: "Sản phẩm hết hàng hoặc không đủ số lượng",
    label: "Sản phẩm hết hàng hoặc không đủ số lượng",
  },
  { value: "Lỗi hệ thống hoặc kỹ thuật", label: "Lỗi hệ thống hoặc kỹ thuật" },
  { value: "Khác (vui lòng ghi rõ)", label: "Khác (vui lòng ghi rõ)" },
];
const ALL_ORDER_STEPS_CONFIG = [
  {
    title: "Tạo đơn",
    status: ORDER_STATUS.ORDER_STATUS_WAITING_ACCEPT,
    icon: <ScheduleOutlined />,
    isCreationStep: true,
  },
  {
    title: "Đã xác nhận",
    status: ORDER_STATUS.ORDER_STATUS_ACCEPT,
    icon: <SolutionOutlined />,
  },
  {
    title: "Chờ giao ĐVVC",
    status: ORDER_STATUS.ORDER_STATUS_DELIVERY,
    icon: <CarOutlined />,
  },
  {
    title: "Đang vận chuyển",
    status: ORDER_STATUS.ORDER_STATUS_FINISH_DELIVERY,
    icon: <DeliveredProcedureOutlined />,
  },
  {
    title: "Hoàn thành",
    status: ORDER_STATUS.ORDER_STATUS_SUCCESS,
    icon: <CheckCircleOutlined />,
  },
];
const CANCELLATION_STEPS_INFO_CONFIG = {
  [ORDER_STATUS.ORDER_STATUS_CUSTOMER_CANCEL]: {
    title: "Khách hàng hủy đơn",
    icon: <CloseCircleOutlined />,
    isError: true,
  },
  [ORDER_STATUS.ORDER_STATUS_CUSTOMER_CANCEL_RECEIVE]: {
    title: "Không giao hàng thành công",
    icon: <CloseCircleOutlined />,
    isError: true,
  },
  [ORDER_STATUS.ORDER_STATUS_SHOP_CANCEL]: {
    title: "Shop hủy đơn",
    icon: <CloseCircleOutlined />,
    isError: true,
  },
};

const formatDateForDisplay = (d) => {
  if (!d) return "";
  try {
    return format(parseISO(d), "dd/MM/yyyy HH:mm:ss");
  } catch (err) {
    try {
      return format(new Date(d), "dd/MM/yyyy HH:mm:ss");
    } catch (e) {
      return "Ngày không hợp lệ";
    }
  }
};

const OrderDetail = () => {
  const [form] = Form.useForm();
  const [updateOrderForm] = Form.useForm();
  const [orderData, setOrderData] = useState({
    products: [],
    paymentHistory: [],
  });
  const { Step } = Steps;
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalProductPriceState, setTotalProductPriceState] = useState(0);
  const [feeDelivery, setFeeDelivery] = useState(0);
  const [payment, setPayment] = useState(null);
  const [discount, setDiscount] = useState(0);
  const {
    getOrderDetail,
    changeStatus,
    updateOrder: apiUpdateOrder,
  } = useOrder();
  const { getProvince, getDistrict, getWard } = useAddress();
  const [orderModel, setOrderModel] = useState(null);
  const [openModalBill, setOpenModalBill] = useState(false);
  const [logActions, setLogActions] = useState([]);
  const { id } = useParams();
  const [isModalRejectCustom, setIsModalRejectCustom] = useState(false);
  const [rejectReason, setRejectReason] = useState(CANCEL_REASONS[0].value);
  const [rejectNote, setRejectNote] = useState("");
  const [isUpdateOrderModalVisible, setIsUpdateOrderModalVisible] =
    useState(false);
  const [provincesState, setProvincesState] = useState([]);
  const [modalDistrictOptions, setModalDistrictOptions] = useState([]);
  const [modalWardOptions, setModalWardOptions] = useState([]);

  function formatCurrencyVND(a) {
    if (typeof a !== "number" || isNaN(a)) return "0 VND";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(a);
  }

  const calculateTotalPrice = (prods, coupon, feeDel) => {
    const sumProds = prods.reduce(
      (acc, item) => acc + (item.price || 0) * (item.quantity || 0),
      0
    );
    setTotalProductPriceState(sumProds);
    let potentialDisc = 0;
    if (coupon && sumProds >= (coupon.minValue || 0)) {
      if (coupon.type === 1 && coupon.percentValue != null) {
        potentialDisc = (sumProds * coupon.percentValue) / 100;
        if (coupon.maxValue != null && potentialDisc > coupon.maxValue)
          potentialDisc = coupon.maxValue;
      } else if (coupon.type === 2 && coupon.couponAmount != null)
        potentialDisc = coupon.couponAmount;
    }
    const fee = feeDel || 0;
    const totalBeforeDisc = sumProds + fee;
    let actualDisc = potentialDisc;
    if (actualDisc > totalBeforeDisc) actualDisc = totalBeforeDisc;
    setDiscount(actualDisc);
    const finalAmount = totalBeforeDisc - actualDisc;
    setTotalPrice(finalAmount < 0 ? 0 : finalAmount);
  };

  const fetchProvincesForModal = async () => {
    console.log("[OrderDetail EFFECT] Fetching provinces for modal...");
    const provinceDataResponse = await getProvince({ name: null });
    console.log(
      "[OrderDetail EFFECT] Provinces for modal RAW (Hook Response):",
      JSON.stringify(provinceDataResponse, null, 2)
    );

    // Giả định hook useRequest trả về { success: true, data: BE_RESPONSE }
    // và BE_RESPONSE có { success: true, data: [ARRAY_OF_PROVINCES] }
    if (
      provinceDataResponse &&
      provinceDataResponse.success &&
      provinceDataResponse.data &&
      provinceDataResponse.data.success && // Kiểm tra success của BE
      provinceDataResponse.data.data &&
      Array.isArray(provinceDataResponse.data.data)
    ) {
      console.log(
        "[OrderDetail EFFECT] Provinces array from BE:",
        provinceDataResponse.data.data
      );
      setProvincesState(
        provinceDataResponse.data.data.map((p) => ({
          value: p.code,
          label: p.name,
        }))
      );
    } else {
      console.error(
        "[OrderDetail EFFECT] Error fetching provinces or invalid format. Full Hook Response:",
        provinceDataResponse
      );
      setProvincesState([]);
      const beMessage = provinceDataResponse?.data?.message;
      const hookMessage = provinceDataResponse?.message;
      toast.error(
        beMessage ||
          hookMessage ||
          "Lỗi tải danh sách tỉnh/thành phố cho modal."
      );
    }
  };
  useEffect(() => {
    fetchProvincesForModal();
  }, []);

  const fetchOrderDetail = async () => {
    if (!id) return;
    const { success, data } = await getOrderDetail(id);
    if (!success || !data || data.status === "Error") {
      toast.error(data?.message || "Lỗi tải chi tiết đơn hàng");
      return;
    }
    const currentOrder = data.data;
    setOrderModel(currentOrder);
    setOrderData({
      products:
        currentOrder?.orderDetailModels?.map((item) => ({ ...item })) || [],
      paymentHistory: currentOrder?.logPaymentHistoryModels || [],
    });
    setPayment(currentOrder?.paymentModel);
    setFeeDelivery(currentOrder?.feeDelivery || 0);
    calculateTotalPrice(
      currentOrder?.orderDetailModels || [],
      currentOrder?.couponModel,
      currentOrder?.feeDelivery || 0
    );
    setLogActions(currentOrder?.logActionOrderModels || []);
  };
  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const productCols = [
    {
      title: "STT",
      key: "stt",
      render: (_, r, i) => i + 1,
      width: 60,
      align: "center",
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (imgPath, r) => (
        <img
          src={getMediaUrl(imgPath)}
          alt={r?.name || "product"}
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "8px",
            objectFit: "cover",
          }}
        />
      ),
      width: 80,
      align: "center",
    },
    { title: "Tên sản phẩm", dataIndex: "name", key: "name", width: 200 },
    {
      title: "Mã sản phẩm",
      dataIndex: "code",
      key: "code",
      width: 120,
      align: "center",
    },
    {
      title: "Giá sản phẩm",
      dataIndex: "price",
      key: "price",
      render: (t) => formatCurrencyVND(t),
      align: "right",
      width: 120,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      width: 80,
      render: (t) => <p style={{ margin: 0, textAlign: "center" }}>{t}</p>,
    },
    {
      title: "Tổng tiền",
      key: "total",
      render: (t, r) => formatCurrencyVND(r.price * r.quantity),
      align: "right",
      width: 130,
    },
  ].map((col) => ({
    ...col,
    onHeaderCell: () => ({
      style: { textAlign: col.align || "left", fontWeight: "bold" },
    }),
  }));
  const paymentHistCols = [
    {
      title: "STT",
      key: "stt",
      render: (_, r, i) => i + 1,
      align: "center",
      width: 60,
    },
    {
      title: "Thời gian",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (t) => formatDateForDisplay(t),
      align: "center",
      width: 150,
    },
    {
      title: "Khách hàng",
      key: "customerNamePayment",
      render: () => orderModel?.userModel?.fullName || "-",
      width: 150,
    },
    {
      title: "Số điện thoại",
      key: "customerPhonePayment",
      render: () => orderModel?.userModel?.phoneNumber || "-",
      width: 120,
      align: "center",
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      render: (t) => (
        <Text strong style={{ display: "block", textAlign: "right" }}>
          {formatCurrencyVND(t)}
        </Text>
      ),
      align: "right",
      width: 120,
    },
    {
      title: "Hình thức TT",
      key: "paymentType",
      render: () => payment?.name || orderModel?.paymentModel?.name || "N/A",
      align: "center",
      width: 120,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (t) => (
        <Tag
          color={t === 1 ? "success" : "warning"}
          style={{ fontWeight: 500 }}
        >
          {t === 1 ? "Đã thanh toán" : "Chờ xử lý"}
        </Tag>
      ),
      align: "center",
      width: 120,
    },
    {
      title: "Người tạo",
      dataIndex: "createdBy",
      key: "paymentLogCreator",
      align: "center",
      width: 120,
      render: (t) => (
        <Text type="secondary" style={{ fontSize: "12px" }}>
          {t || "-"}
        </Text>
      ),
    },
  ].map((col) => ({
    ...col,
    onHeaderCell: () => ({
      style: { textAlign: col.align || "left", fontWeight: "bold" },
    }),
  }));

  const [activeModal, setActiveModal] = useState(null);
  const [modalNote, setModalNote] = useState("");
  const openModal = (type) => {
    setModalNote("");
    setActiveModal(type);
  };
  const closeModal = () => setActiveModal(null);

  const updateStatus = async (orderId, statusVal, noteVal) => {
    const { success, data } = await changeStatus(orderId, statusVal, noteVal);
    if (success && data && data.success !== false && data.status !== "Error") {
      toast.success(data.message || "Cập nhật trạng thái thành công!");
      fetchOrderDetail();
    } else {
      toast.error(data?.message || "Cập nhật trạng thái thất bại.");
    }
    closeModal();
    setIsModalRejectCustom(false);
  };
  const handleModalOk = () => {
    if (!orderModel || !activeModal) return;
    let targetStatus = "";
    switch (activeModal) {
      case "accept":
        targetStatus = ORDER_STATUS.ORDER_STATUS_ACCEPT;
        break;
      case "acceptDelivery":
        targetStatus = ORDER_STATUS.ORDER_STATUS_DELIVERY;
        break;
      case "delivery":
        targetStatus = ORDER_STATUS.ORDER_STATUS_FINISH_DELIVERY;
        break;
      case "finish":
        targetStatus = ORDER_STATUS.ORDER_STATUS_SUCCESS;
        break;
      case "cancelReceive":
        targetStatus = ORDER_STATUS.ORDER_STATUS_CUSTOMER_CANCEL_RECEIVE;
        break;
      default:
        return;
    }
    updateStatus(orderModel.id, targetStatus, modalNote);
  };
  const handleModalReject = () => {
    if (!orderModel || activeModal !== "finish") return;
    updateStatus(
      orderModel.id,
      ORDER_STATUS.ORDER_STATUS_CUSTOMER_CANCEL_RECEIVE,
      modalNote
    );
  };
  const showRejectModelCustom = () => {
    setRejectReason(CANCEL_REASONS[0].value);
    setRejectNote("");
    setIsModalRejectCustom(true);
  };
  const handleCancelRejectCustom = () => setIsModalRejectCustom(false);
  const handleOkRejectCustom = () => {
    let finalReason = rejectReason;
    if (rejectReason === "Khác (vui lòng ghi rõ)") {
      if (rejectNote.trim()) {
        finalReason = rejectNote.trim();
      } else {
        toast.error("Vui lòng nhập lý do hủy chi tiết.");
        return;
      }
    }
    updateStatus(
      orderModel.id,
      ORDER_STATUS.ORDER_STATUS_SHOP_CANCEL,
      finalReason
    );
  };
  const latestLogAction =
    logActions && logActions.length > 0
      ? logActions[logActions.length - 1]
      : null;
  const getOrderStatusTag = (statusKey) => {
    const opt = ORDER_STATUS_OPTIONS.find((o) => o.value === statusKey);
    if (opt)
      return (
        <Tag
          color={opt.color || "default"}
          style={{ fontSize: "13px", fontWeight: "600" }}
        >
          {ORDER_STATUS_LABEL[opt.value] || statusKey}
        </Tag>
      );
    return <Tag>Không xác định</Tag>;
  };

  const handleOpenUpdateOrderModal = async () => {
    console.log("[OrderDetail MODAL_OPEN] Opening. OrderModel:", orderModel);
    if (!orderModel) return;
    let initProvId = null,
      initDistId = null,
      initWardId = null,
      initAddrDetail = "";
    let custName = orderModel.userModel?.fullName || "",
      custPhone = orderModel.userModel?.phoneNumber || "";
    const currShipAddr =
      orderModel.addressModel ||
      orderModel.userModel?.address?.find((a) => a.isDefault) ||
      orderModel.userModel?.address?.[0];
    console.log(
      "[OrderDetail MODAL_OPEN] Current Shipping Addr:",
      currShipAddr
    );
    if (currShipAddr) {
      initProvId = currShipAddr.provinceId;
      initDistId = currShipAddr.districtId;
      initWardId = currShipAddr.wardId;
      initAddrDetail = currShipAddr.addressDetail || "";
    }
    console.log(
      "[OrderDetail MODAL_OPEN] Initial IDs: Prov:",
      initProvId,
      "Dist:",
      initDistId,
      "Ward:",
      initWardId
    );
    setModalDistrictOptions([]);
    setModalWardOptions([]);

    if (initProvId) {
      console.log(
        "[OrderDetail MODAL_OPEN] Fetching initial districts for province:",
        initProvId
      );
      try {
        const distResp = await getDistrict({ code: initProvId, name: null });
        console.log(
          "[OrderDetail MODAL_OPEN] RAW API Resp for initial getDistrict:",
          JSON.stringify(distResp, null, 2)
        );
        if (distResp && distResp.success) {
          let distArr = null;
          if (distResp.data && Array.isArray(distResp.data))
            distArr = distResp.data;
          else if (
            distResp.data &&
            distResp.data.data &&
            Array.isArray(distResp.data.data)
          )
            distArr = distResp.data.data;
          if (distArr) {
            const opts = distArr.map((d) => ({ value: d.code, label: d.name }));
            setModalDistrictOptions(opts);
            console.log(
              "[OrderDetail MODAL_OPEN] Set initial district opts:",
              opts
            );
          } else {
            setModalDistrictOptions([]);
            console.log(
              "[OrderDetail MODAL_OPEN] No initial districts or invalid format."
            );
          }
        } else {
          setModalDistrictOptions([]);
          console.log(
            "[OrderDetail MODAL_OPEN] Initial getDistrict call failed."
          );
        }
      } catch (err) {
        console.error("[OrderDetail MODAL_OPEN] Error initial districts:", err);
        setModalDistrictOptions([]);
      }
    } else {
      console.log(
        "[OrderDetail MODAL_OPEN] No initProvId, skip initial district fetch."
      );
    }

    if (initDistId) {
      console.log(
        "[OrderDetail MODAL_OPEN] Fetching initial wards for district:",
        initDistId
      );
      try {
        const wardResp = await getWard({
          districtCode: initDistId,
          name: null,
        });
        console.log(
          "[OrderDetail MODAL_OPEN] RAW API Resp for initial getWard:",
          JSON.stringify(wardResp, null, 2)
        );
        if (wardResp && wardResp.success) {
          let wardArr = null;
          if (wardResp.data && Array.isArray(wardResp.data))
            wardArr = wardResp.data;
          else if (
            wardResp.data &&
            wardResp.data.data &&
            Array.isArray(wardResp.data.data)
          )
            wardArr = wardResp.data.data;
          if (wardArr) {
            const opts = wardArr.map((w) => ({ value: w.code, label: w.name }));
            setModalWardOptions(opts);
            console.log(
              "[OrderDetail MODAL_OPEN] Set initial ward opts:",
              opts
            );
          } else {
            setModalWardOptions([]);
            console.log(
              "[OrderDetail MODAL_OPEN] No initial wards or invalid format."
            );
          }
        } else {
          setModalWardOptions([]);
          console.log("[OrderDetail MODAL_OPEN] Initial getWard call failed.");
        }
      } catch (err) {
        console.error("[OrderDetail MODAL_OPEN] Error initial wards:", err);
        setModalWardOptions([]);
      }
    } else {
      console.log(
        "[OrderDetail MODAL_OPEN] No initDistId, skip initial ward fetch."
      );
    }

    const prodsForUpd = orderModel.orderDetailModels.map((p) => ({
      ...p,
      key: p.id || p.productId,
    }));
    updateOrderForm.setFieldsValue({
      customerName: custName,
      customerPhone: custPhone,
      provinceId: initProvId,
      districtId: initDistId,
      wardId: initWardId,
      addressDetail: initAddrDetail,
      products: prodsForUpd,
    });
    console.log("[OrderDetail MODAL_OPEN] Form values set.");
    setIsUpdateOrderModalVisible(true);
  };

  const handleUpdateOrder = async (vals) => {
    if (!orderModel || !apiUpdateOrder) {
      toast.error("Chức năng cập nhật chưa sẵn sàng.");
      return;
    }
    const {
      provinceId,
      districtId,
      wardId,
      addressDetail,
      customerName,
      customerPhone,
      products,
    } = vals;
    const provObj = provincesState.find((p) => p.value === provinceId);
    const distObj = modalDistrictOptions.find((d) => d.value === districtId);
    const wardObj = modalWardOptions.find((w) => w.value === wardId);
    const payload = {
      customerInfo: { fullName: customerName, phoneNumber: customerPhone },
      addressInfo: {
        provinceId,
        districtId,
        wardId,
        addressDetail,
        provinceName: provObj?.label || "",
        districtName: distObj?.label || "",
        wardName: wardObj?.label || "",
      },
      products: products.map((p) => ({
        productId: p.productId || p.id,
        quantity: p.quantity,
      })),
    };
    console.log(
      "[OrderDetail UPDATE_SUBMIT] Payload:",
      JSON.stringify(payload, null, 2)
    );
    const { success, data } = await apiUpdateOrder(orderModel.id, payload);
    if (success && data && data.success !== false && data.status !== "Error") {
      toast.success(data.message || "Cập nhật đơn hàng thành công!");
      setIsUpdateOrderModalVisible(false);
      fetchOrderDetail();
    } else {
      toast.error(data?.message || "Cập nhật đơn hàng thất bại.");
    }
  };

  const handleModalProvinceChange = async (val) => {
    console.log(
      "[OrderDetail MODAL_PROVINCE_CHANGE] Selected provinceCode:",
      val
    );
    updateOrderForm.setFieldsValue({ districtId: null, wardId: null });
    setModalDistrictOptions([]);
    setModalWardOptions([]);
    if (val) {
      try {
        const distResp = await getDistrict({ code: val, name: null });
        console.log(
          "[OrderDetail MODAL_PROVINCE_CHANGE] RAW API Resp for getDistrict:",
          JSON.stringify(distResp, null, 2)
        );
        if (distResp && distResp.success) {
          let distArr = null;
          if (distResp.data && Array.isArray(distResp.data))
            distArr = distResp.data;
          else if (
            distResp.data &&
            distResp.data.data &&
            Array.isArray(distResp.data.data)
          )
            distArr = distResp.data.data;
          if (distArr && distArr.length > 0) {
            const opts = distArr.map((d) => ({ value: d.code, label: d.name }));
            console.log(
              "[OrderDetail MODAL_PROVINCE_CHANGE] Generated District Opts:",
              opts
            );
            setModalDistrictOptions(opts);
          } else {
            console.log(
              "[OrderDetail MODAL_PROVINCE_CHANGE] District array empty/null."
            );
            setModalDistrictOptions([]);
            if (
              distArr &&
              distArr.length === 0 &&
              distResp.message &&
              distResp.message !== "Thành công" &&
              distResp.message !== "Danh sách quận/huyện trống"
            )
              toast.info(distResp.message);
          }
        } else {
          console.error(
            "[OrderDetail MODAL_PROVINCE_CHANGE] API getDistrict not successful:",
            distResp
          );
          setModalDistrictOptions([]);
          toast.error(distResp?.message || "Lỗi tải quận/huyện.");
        }
      } catch (err) {
        console.error(
          "[OrderDetail MODAL_PROVINCE_CHANGE] Exception getDistrict:",
          err
        );
        setModalDistrictOptions([]);
        toast.error("Lỗi xử lý.");
      }
    } else {
      console.log(
        "[OrderDetail MODAL_PROVINCE_CHANGE] Province val null/undefined."
      );
      setModalDistrictOptions([]);
    }
  };

  const handleModalDistrictChange = async (val) => {
    console.log(
      "[OrderDetail MODAL_DISTRICT_CHANGE] Selected districtCode:",
      val
    );
    updateOrderForm.setFieldsValue({ wardId: null });
    setModalWardOptions([]);
    if (val) {
      try {
        const wardResp = await getWard({ districtCode: val, name: null });
        console.log(
          "[OrderDetail MODAL_DISTRICT_CHANGE] RAW API Resp for getWard:",
          JSON.stringify(wardResp, null, 2)
        );
        if (wardResp && wardResp.success) {
          let wardArr = null;
          if (wardResp.data && Array.isArray(wardResp.data))
            wardArr = wardResp.data;
          else if (
            wardResp.data &&
            wardResp.data.data &&
            Array.isArray(wardResp.data.data)
          )
            wardArr = wardResp.data.data;
          if (wardArr && wardArr.length > 0) {
            const opts = wardArr.map((w) => ({ value: w.code, label: w.name }));
            console.log(
              "[OrderDetail MODAL_DISTRICT_CHANGE] Generated Ward Opts:",
              opts
            );
            setModalWardOptions(opts);
          } else {
            console.log(
              "[OrderDetail MODAL_DISTRICT_CHANGE] Ward array empty/null."
            );
            setModalWardOptions([]);
            if (
              wardArr &&
              wardArr.length === 0 &&
              wardResp.message &&
              wardResp.message !== "Thành công" &&
              wardResp.message !== "Danh sách xã/phường trống"
            )
              toast.info(wardResp.message);
          }
        } else {
          console.error(
            "[OrderDetail MODAL_DISTRICT_CHANGE] API getWard not successful:",
            wardResp
          );
          setModalWardOptions([]);
          toast.error(wardResp?.message || "Lỗi tải xã/phường.");
        }
      } catch (err) {
        console.error(
          "[OrderDetail MODAL_DISTRICT_CHANGE] Exception getWard:",
          err
        );
        setModalWardOptions([]);
        toast.error("Lỗi xử lý.");
      }
    } else {
      console.log(
        "[OrderDetail MODAL_DISTRICT_CHANGE] District val null/undefined."
      );
      setModalWardOptions([]);
    }
  };

  const renderActionButtons = () => {
    if (!orderModel) return null;
    const status = orderModel.status;
    let btns = [];
    if (status === ORDER_STATUS.ORDER_STATUS_WAITING_ACCEPT) {
      btns.push(
        <Button key="accept" type="primary" onClick={() => openModal("accept")}>
          Xác nhận
        </Button>
      );
    }
    if (status === ORDER_STATUS.ORDER_STATUS_ACCEPT) {
      btns.push(
        <Button
          key="acceptDelivery"
          type="primary"
          onClick={() => openModal("acceptDelivery")}
        >
          Xác nhận & Giao ĐVVC
        </Button>
      );
      btns.push(
        <Button
          key="updateOrder"
          icon={<EditOutlined />}
          onClick={handleOpenUpdateOrderModal}
        >
          Cập nhật đơn
        </Button>
      );
    }
    if (status === ORDER_STATUS.ORDER_STATUS_DELIVERY) {
      btns.push(
        <Button
          key="delivery"
          type="primary"
          onClick={() => openModal("delivery")}
        >
          Đã bàn giao ĐVVC
        </Button>
      );
      btns.push(
        <Button
          key="updateOrder"
          icon={<EditOutlined />}
          onClick={handleOpenUpdateOrderModal}
        >
          Cập nhật đơn
        </Button>
      );
    }
    if (status === ORDER_STATUS.ORDER_STATUS_FINISH_DELIVERY) {
      btns.push(
        <Button key="finish" type="primary" onClick={() => openModal("finish")}>
          Xác nhận hoàn thành
        </Button>
      );
      btns.push(
        <Button
          key="cancelReceive"
          danger
          onClick={() => openModal("cancelReceive")}
        >
          Vận chuyển thất bại
        </Button>
      );
    }
    if (
      ![
        ORDER_STATUS.ORDER_STATUS_SUCCESS,
        ORDER_STATUS.ORDER_STATUS_CUSTOMER_CANCEL,
        ORDER_STATUS.ORDER_STATUS_CUSTOMER_CANCEL_RECEIVE,
        ORDER_STATUS.ORDER_STATUS_SHOP_CANCEL,
      ].includes(status) &&
      status !== ORDER_STATUS.ORDER_STATUS_FINISH_DELIVERY
    ) {
      btns.push(
        <Button key="cancelOrder" onClick={showRejectModelCustom}>
          Huỷ đơn
        </Button>
      );
    }
    return <Space wrap>{btns}</Space>;
  };
  const modalContentMap = {
    accept: "Xác nhận đơn hàng?",
    acceptDelivery: "Xác nhận đơn hàng và giao cho đơn vị vận chuyển?",
    delivery: "Xác nhận đơn hàng đã bàn giao cho đơn vị vận chuyển?",
    finish: "Giao hàng thành công và hoàn thành đơn hàng?",
    cancelReceive: "Xác nhận đơn hàng vận chuyển không thành công?",
  };
  const getStepDate = (statusId, isCreation) => {
    if (isCreation && orderModel?.createdDate)
      return formatDateForDisplay(orderModel.createdDate);
    const log = logActions.find((l) => l.statusId === statusId);
    return log?.createdDate ? formatDateForDisplay(log.createdDate) : "";
  };
  const currOrdStatus = orderModel?.status;
  const currStepIdx = React.useMemo(() => {
    if (!currOrdStatus || !logActions) return 0;
    if (CANCELLATION_STEPS_INFO_CONFIG[currOrdStatus]) {
      const logsBeforeCancel = logActions.filter(
        (log) => !CANCELLATION_STEPS_INFO_CONFIG[log.statusId]
      );
      if (logsBeforeCancel.length > 0) {
        const lastNormalStatusId =
          logsBeforeCancel[logsBeforeCancel.length - 1].statusId;
        const idx = ALL_ORDER_STEPS_CONFIG.findIndex(
          (s) => s.status === lastNormalStatusId
        );
        return idx !== -1 ? idx : 0;
      }
      return 0;
    }
    const currIdxInAll = ALL_ORDER_STEPS_CONFIG.findIndex(
      (s) => s.status === currOrdStatus
    );
    if (currIdxInAll !== -1) return currIdxInAll;
    for (let i = logActions.length - 1; i >= 0; i--) {
      const logStatusId = logActions[i].statusId;
      const stepIdx = ALL_ORDER_STEPS_CONFIG.findIndex(
        (s) => s.status === logStatusId
      );
      if (stepIdx !== -1) return stepIdx;
    }
    return 0;
  }, [currOrdStatus, logActions, orderModel?.createdDate]);
  const isCancelled = CANCELLATION_STEPS_INFO_CONFIG[currOrdStatus];
  const totalPaid = React.useMemo(
    () =>
      orderData.paymentHistory
        .filter((p) => p.status === 1)
        .reduce((sum, p) => sum + (p.amount || 0), 0),
    [orderData.paymentHistory]
  );
  const amountDue = React.useMemo(
    () => Math.max(0, totalPrice - totalPaid),
    [totalPrice, totalPaid]
  );

  if (!orderModel)
    return (
      <Card style={{ margin: 20, padding: 20 }}>
        <Text>Đang tải dữ liệu đơn hàng...</Text>
      </Card>
    );
const getDisplayAddressString = (order) => {
  if (!order) return "Chưa có thông tin địa chỉ";

  // Ưu tiên addressModel của đơn hàng
  let addressData = order.addressModel;

  // Nếu không có addressModel, thử lấy địa chỉ mặc định của user, rồi đến địa chỉ đầu tiên
  if (!addressData && order.userModel && order.userModel.address && order.userModel.address.length > 0) {
    addressData = order.userModel.address.find(addr => addr.isDefault === 1) || order.userModel.address[0];
  }

  if (!addressData) return "Chưa có thông tin địa chỉ";

  // Ghép chuỗi, lọc bỏ các phần rỗng hoặc null
  const parts = [
    addressData.addressDetail, // Số nhà, tên đường
    addressData.wardName,      // Tên xã/phường
    addressData.districtName,  // Tên quận/huyện
    addressData.provinceName   // Tên tỉnh/thành phố
  ].filter(part => part && String(part).trim() !== ""); // Lọc bỏ các giá trị null, undefined, hoặc chuỗi rỗng

  if (parts.length === 0) return "Thông tin địa chỉ không đầy đủ";

  return parts.join(" - ");
};
  const updProdQtyInForm = (prodId, newQty) => {
    const prods = updateOrderForm.getFieldValue("products") || [];
    const updProds = prods.map((p) =>
      (p.id || p.productId) === prodId ? { ...p, quantity: newQty } : p
    );
    updateOrderForm.setFieldsValue({ products: updProds });
  };
  const updOrderModalCols = [
    { title: "Sản phẩm", dataIndex: "name", key: "name", width: "40%" },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      render: (p) => formatCurrencyVND(p),
      width: "25%",
      align: "right",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: "20%",
      align: "center",
      render: (t, r) => (
        <InputNumber
          min={1}
          value={t}
          onChange={(val) => updProdQtyInForm(r.id || r.productId, val)}
        />
      ),
    },
    {
      title: "Thành tiền",
      key: "itemTotal",
      align: "right",
      width: "25%",
      render: (_, r) => formatCurrencyVND(r.price * r.quantity),
    },
  ];

  return (
    <div style={{ padding: "16px", background: "#f7f9fa" }}>
      <CustomPopup
        visible={!!activeModal && activeModal !== "rejectCustom"}
        title="Xác nhận"
        content={<p>{modalContentMap[activeModal]}</p>}
        onClose={closeModal}
        onOk={handleModalOk}
        showRejectButton={activeModal === "finish"}
        onReject={handleModalReject}
        showNoteInput={true}
        note={modalNote}
        onNoteChange={setModalNote}
        okText="Xác nhận"
        cancelText="Hủy bỏ"
      />
      <Modal
        title="Xác nhận hủy đơn hàng"
        open={isModalRejectCustom}
        onOk={handleOkRejectCustom}
        onCancel={handleCancelRejectCustom}
        okText="Xác nhận hủy"
        cancelText="Không"
        destroyOnClose
      >
        <Form
          layout="vertical"
          form={form}
          initialValues={{ rejectReason: CANCEL_REASONS[0].value }}
        >
          <Form.Item label="Chọn lý do hủy:" name="rejectReason">
            <Select
              value={rejectReason}
              onChange={(v) => setRejectReason(v)}
              style={{ width: "100%" }}
            >
              {CANCEL_REASONS.map((r) => (
                <Option key={r.value} value={r.value}>
                  {r.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {rejectReason === "Khác (vui lòng ghi rõ)" && (
            <Form.Item
              label="Ghi chú chi tiết lý do hủy:"
              name="rejectNoteCustom"
            >
              <Input.TextArea
                rows={3}
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                placeholder="Nhập lý do chi tiết..."
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
      <Modal
        title="Cập nhật thông tin đơn hàng"
        open={isUpdateOrderModalVisible}
        onCancel={() => setIsUpdateOrderModalVisible(false)}
        onOk={() => updateOrderForm.submit()}
        width={800}
        okText="Lưu thay đổi"
        cancelText="Hủy"
        destroyOnClose
      >
        <Form
          form={updateOrderForm}
          layout="vertical"
          onFinish={handleUpdateOrder}
        >
          <Title level={5}>Thông tin khách hàng</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="customerName"
                label="Tên khách hàng"
                rules={[
                  { required: true, message: "Vui lòng nhập tên khách hàng!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="customerPhone"
                label="Số điện thoại"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Divider />
          <Title level={5}>Địa chỉ giao hàng</Title>
          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item
                name="provinceId"
                label="Tỉnh/Thành phố"
                rules={[
                  { required: true, message: "Vui lòng chọn tỉnh/thành phố!" },
                ]}
              >
                <Select
                  placeholder="Chọn Tỉnh/TP"
                  onChange={handleModalProvinceChange}
                  options={provincesState}
                  showSearch
                  filterOption={(inp, opt) =>
                    (opt?.label ?? "").toLowerCase().includes(inp.toLowerCase())
                  }
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="districtId"
                label="Quận/Huyện"
                rules={[
                  { required: true, message: "Vui lòng chọn quận/huyện!" },
                ]}
              >
                <Select
                  placeholder="Chọn Quận/Huyện"
                  onChange={handleModalDistrictChange}
                  options={modalDistrictOptions}
                  disabled={!updateOrderForm.getFieldValue("provinceId")}
                  showSearch
                  filterOption={(inp, opt) =>
                    (opt?.label ?? "").toLowerCase().includes(inp.toLowerCase())
                  }
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="wardId"
                label="Xã/Phường"
                rules={[
                  { required: true, message: "Vui lòng chọn xã/phường!" },
                ]}
              >
                <Select
                  placeholder="Chọn Xã/Phường"
                  options={modalWardOptions}
                  disabled={!updateOrderForm.getFieldValue("districtId")}
                  showSearch
                  filterOption={(inp, opt) =>
                    (opt?.label ?? "").toLowerCase().includes(inp.toLowerCase())
                  }
                  allowClear
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="addressDetail"
            label="Địa chỉ chi tiết (Số nhà, tên đường)"
            rules={[
              { required: true, message: "Vui lòng nhập địa chỉ chi tiết!" },
            ]}
          >
            <Input placeholder="Ví dụ: Số 123, Đường ABC" />
          </Form.Item>
          <Divider />
          <Title level={5}>Sản phẩm trong đơn</Title>
          <Form.List name="products">
            {(fields, { add, remove }) => (
              <Table
                dataSource={updateOrderForm.getFieldValue("products")}
                columns={updOrderModalCols}
                pagination={false}
                rowKey="key"
                size="small"
              />
            )}
          </Form.List>
        </Form>
      </Modal>
      <Card
        title={
          <Space>
            <HistoryOutlined /> Dòng thời gian đơn hàng
          </Space>
        }
        style={{ marginBottom: 16 }}
      >
        <Steps
          current={currStepIdx}
          size="small"
          status={isCancelled ? "error" : "process"}
        >
          {ALL_ORDER_STEPS_CONFIG.map((step, idx) => {
            const stepTime = getStepDate(step.status, step.isCreationStep);
            let stepAntdStatus = "wait";
            if (isCancelled) {
              if (idx < currStepIdx) stepAntdStatus = "finish";
              else if (idx === currStepIdx) stepAntdStatus = "finish";
            } else {
              if (idx < currStepIdx) stepAntdStatus = "finish";
              else if (idx === currStepIdx) stepAntdStatus = "process";
            }
            if (
              currOrdStatus === step.status &&
              currOrdStatus === ORDER_STATUS.ORDER_STATUS_SUCCESS
            )
              stepAntdStatus = "finish";
            if (
              currOrdStatus === ORDER_STATUS.ORDER_STATUS_SUCCESS &&
              idx === ALL_ORDER_STEPS_CONFIG.length - 1 &&
              logActions.some(
                (l) => l.statusId === ORDER_STATUS.ORDER_STATUS_SUCCESS
              )
            )
              stepAntdStatus = "finish";
            return (
              <Step
                key={step.status}
                title={step.title}
                icon={step.icon}
                status={stepAntdStatus}
                description={
                  stepTime ? (
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      {stepTime}
                    </Text>
                  ) : stepAntdStatus === "process" ? (
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      Đang xử lý...
                    </Text>
                  ) : (
                    ""
                  )
                }
              />
            );
          })}
          {isCancelled && CANCELLATION_STEPS_INFO_CONFIG[currOrdStatus] && (
            <Step
              key={currOrdStatus}
              title={CANCELLATION_STEPS_INFO_CONFIG[currOrdStatus].title}
              icon={CANCELLATION_STEPS_INFO_CONFIG[currOrdStatus].icon}
              status="error"
              description={
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  {getStepDate(currOrdStatus) ||
                    formatDateForDisplay(latestLogAction?.createdDate)}
                  {latestLogAction?.note && (
                    <Tooltip title={latestLogAction.note}>
                      <InfoCircleOutlined
                        style={{ marginLeft: 4, color: "rgba(0,0,0,0.45)" }}
                      />
                    </Tooltip>
                  )}
                </Text>
              }
            />
          )}
        </Steps>
      </Card>
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} justify="space-between" align="middle">
          <Col>{renderActionButtons()}</Col>
          <Col>
            <Space align="baseline">
              <LogOrderPopup
                logActionOrderModels={orderModel?.logActionOrderModels}
              />
              <Button
                type="primary"
                style={{ background: "#2596be" }}
                onClick={() => setOpenModalBill(true)}
              >
                In hóa đơn
              </Button>
            </Space>
            {orderModel && (
              <BillPopUp
                infoBill={orderModel}
                openModal={openModalBill}
                closeModal={() => setOpenModalBill(false)}
                discount={discount}
                totalProductPrice={totalProductPriceState}
                finalTotalPrice={totalPrice}
                totalPaid={totalPaid}
              />
            )}
          </Col>
        </Row>
      </Card>
      <div>
        <Form form={form} layout="vertical">
          <Card style={{ marginBottom: 16 }}>
            <Row gutter={[24, 16]}>
              <Col span={24} style={{ marginBottom: 8 }}>
                <span
                  style={{
                    fontSize: "16px",
                    color: "black",
                    fontWeight: "600",
                  }}
                >
                  Thông tin khách hàng & Đơn hàng
                </span>
              </Col>
              <Divider style={{ marginTop: 0, marginBottom: 16 }} />
              <Col xs={24} md={12}>
                <p>
                  <strong>Mã đơn hàng:</strong> {orderModel?.code}
                </p>
                <p>
                  <strong>Trạng thái:</strong>{" "}
                  {orderModel ? getOrderStatusTag(orderModel.status) : "-"}
                </p>
                <p>
                  <strong>Họ tên KH:</strong> {orderModel?.userModel?.fullName}
                </p>
                <p>
                  <strong>Số điện thoại:</strong>{" "}
                  {orderModel?.userModel?.phoneNumber}
                </p>
                <p>
                  <strong>Email:</strong> {orderModel?.userModel?.email || "-"}
                </p>
              </Col>
              <Col xs={24} md={12}>
               <p><strong>Địa chỉ giao hàng:</strong> {getDisplayAddressString(orderModel)}</p>
                <p>
                  <strong>Hình thức vận chuyển:</strong>{" "}
                  {orderModel?.deliveryModel?.name || "-"}
                </p>
                <p>
                  <strong>Ghi chú:</strong>
                  <span
                    style={{
                      fontWeight: "bold",
                      marginLeft: "5px",
                      color: latestLogAction?.note ? "orange" : "inherit",
                    }}
                  >
                    {latestLogAction?.note ||
                      (CANCELLATION_STEPS_INFO_CONFIG[orderModel?.status]
                        ? CANCELLATION_STEPS_INFO_CONFIG[orderModel?.status]
                            .title
                        : "Không có")}
                  </span>
                </p>
                <p>
                  <strong>Nhân viên tạo:</strong>{" "}
                  {orderModel?.employeeName || "-"}
                </p>
                <p>
                  <strong>Ngày tạo:</strong>{" "}
                  {orderModel?.createdDate
                    ? formatDateForDisplay(orderModel.createdDate)
                    : "-"}
                </p>
              </Col>
            </Row>
          </Card>
          <Card title="Thông tin sản phẩm" style={{ marginBottom: 16 }}>
            <Table
              dataSource={orderData.products}
              columns={productCols}
              pagination={false}
              size="small"
              rowKey={(r) => r.id || r.productId}
            />
          </Card>
          <Card title="Lịch sử thanh toán" style={{ marginBottom: 16 }}>
            {(orderData.paymentHistory?.length || 0) > 0 ? (
              <Table
                dataSource={orderData.paymentHistory}
                columns={paymentHistCols}
                pagination={{
                  pageSize: 5,
                  size: "small",
                  hideOnSinglePage: true,
                }}
                size="middle"
                rowKey={(r, idx) => r.id || `payment-hist-${idx}`}
                scroll={{ x: "max-content" }}
              />
            ) : (
              <Text italic type="secondary">
                Chưa có lịch sử thanh toán.
              </Text>
            )}
          </Card>
        </Form>
        <Card>
          <Row gutter={[16, 24]}>
            <Col xs={24} md={14}>
              {orderModel?.couponModel && (
                <>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "black",
                      fontWeight: "bold",
                    }}
                  >
                    Phiếu giảm giá áp dụng:
                  </p>
                  <p style={{ fontWeight: "500", marginBottom: 0 }}>
                    {orderModel.couponModel?.code} (Giảm{" "}
                    {orderModel.couponModel.type === 1
                      ? `${orderModel.couponModel.percentValue}%`
                      : formatCurrencyVND(orderModel.couponModel.couponAmount)}
                    )
                  </p>
                </>
              )}
            </Col>
            <Col xs={24} md={10}>
              <Space
                direction="vertical"
                style={{ width: "100%" }}
                size="small"
              >
                <Row justify="space-between" align="middle">
                  <Col>
                    <p style={{ fontWeight: "500", margin: 0 }}>
                      Tổng tiền hàng:
                    </p>
                  </Col>
                  <Col>
                    <p style={{ fontWeight: "700", margin: 0 }}>
                      {formatCurrencyVND(totalProductPriceState)}
                    </p>
                  </Col>
                </Row>
                {orderModel?.couponModel && discount > 0 && (
                  <Row justify="space-between" align="middle">
                    <Col>
                      <p style={{ fontWeight: "500", margin: 0 }}>Giảm giá:</p>
                    </Col>
                    <Col>
                      <p style={{ fontWeight: "700", color: "red", margin: 0 }}>
                        - {formatCurrencyVND(discount)}
                      </p>
                    </Col>
                  </Row>
                )}
                {orderModel && typeof feeDelivery === "number" && (
                  <Row justify="space-between" align="middle">
                    <Col>
                      <p style={{ fontWeight: "500", margin: 0 }}>
                        Phí vận chuyển:
                      </p>
                    </Col>
                    <Col>
                      <p style={{ fontWeight: "700", margin: 0 }}>
                        {formatCurrencyVND(feeDelivery)}
                      </p>
                    </Col>
                  </Row>
                )}
                <Divider style={{ margin: "8px 0" }} />
                <Row justify="space-between" align="middle">
                  <Col>
                    <p style={{ fontWeight: "bold", fontSize: 18, margin: 0 }}>
                      Tổng thanh toán:
                    </p>
                  </Col>
                  <Col>
                    <p
                      style={{
                        fontWeight: "bold",
                        fontSize: 18,
                        color: "#1fbf39",
                        margin: 0,
                      }}
                    >
                      {formatCurrencyVND(totalPrice)}
                    </p>
                  </Col>
                </Row>
                <Row justify="space-between" align="middle">
                  <Col>
                    <Text strong>Đã thanh toán:</Text>
                  </Col>
                  <Col>
                    <Text
                      strong
                      style={{
                        color:
                          totalPaid >= totalPrice && totalPrice > 0
                            ? "green"
                            : totalPaid > 0
                            ? "orange"
                            : "inherit",
                      }}
                    >
                      {formatCurrencyVND(totalPaid)}
                    </Text>
                  </Col>
                </Row>
                {amountDue > 0 && (
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Text strong type="danger">
                        Còn lại phải thu:
                      </Text>
                    </Col>
                    <Col>
                      <Text strong type="danger">
                        {formatCurrencyVND(amountDue)}
                      </Text>
                    </Col>
                  </Row>
                )}
                {amountDue < 0 && (
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Text strong style={{ color: "blue" }}>
                        Tiền thừa trả khách:
                      </Text>
                    </Col>
                    <Col>
                      <Text strong style={{ color: "blue" }}>
                        {formatCurrencyVND(Math.abs(amountDue))}
                      </Text>
                    </Col>
                  </Row>
                )}
              </Space>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};
export default OrderDetail;
