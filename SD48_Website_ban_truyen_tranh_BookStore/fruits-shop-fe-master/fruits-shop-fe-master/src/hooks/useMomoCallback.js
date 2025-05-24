import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useOrder from "@api/useOrder";
import { useSelector, useDispatch } from "react-redux";
import { deleteProductFromCart } from "../services/redux/cartSlice/productSlice";
import { DELIVERY_STATUS, ORDER_STATUS } from "@constants/orderStatusConstant";
const processedTransactions = {};
const useMomoCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { createOrder } = useOrder();
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(false);
  useEffect(() => {
    const handleMomoCallback = async () => {
      const queryParams = new URLSearchParams(location.search);
      const partnerCode = queryParams.get("partnerCode");
      const resultCode = queryParams.get("resultCode");
      const orderId = queryParams.get("orderId");
      const transId = queryParams.get("transId");
      console.log("[MoMo Callback] Tham số URL:", {
        partnerCode,
        resultCode,
        orderId,
        transId,
        fullUrl: window.location.href,
      });
      if (
        !partnerCode ||
        partnerCode !== "MOMOBKUN20180529" ||
        !resultCode ||
        !transId
      ) {
        return;
      }
      if (processedTransactions[transId]) {
        console.log(
          `[MoMo Callback] Giao dịch ${transId} đã được xử lý, bỏ qua`
        );
        return;
      }
      processedTransactions[transId] = true;
      if (isProcessing) {
        console.log("[MoMo Callback] Đang xử lý, bỏ qua");
        return;
      }
      setIsProcessing(true);
      console.log(
        "[MoMo Callback] Đang xử lý callback MoMo với resultCode:",
        resultCode
      );
      console.log(
        "[MoMo Callback] Các khóa localStorage:",
        Object.keys(localStorage)
      );
      const checkoutFormData = localStorage.getItem("checkoutFormData");
      console.log(
        "[MoMo Callback] Dữ liệu checkoutFormData thô:",
        checkoutFormData
      );
      if (!checkoutFormData) {
        console.error(
          "[MoMo Callback] Không tìm thấy dữ liệu checkout trong localStorage"
        );
        toast.error("Không tìm thấy thông tin đơn hàng");
        setIsProcessing(false);
        return;
      }
      try {
        const formData = JSON.parse(checkoutFormData);
        console.log("[MoMo Callback] Dữ liệu checkout đã phân tích:", formData);
        if (resultCode === "0") {
          formData.momoTransactionId = transId;
          formData.momoOrderId = orderId;
          const orderCreated = await processOrder(formData);
          if (orderCreated) {
            toast.success("Đặt hàng thành công!");
          }
        } else {
          toast.error("Thanh toán MoMo thất bại!");
          console.error(
            "[MoMo Callback] Thanh toán thất bại với mã:",
            resultCode
          );
        }
        localStorage.removeItem("checkoutFormData");
        console.log(
          "[MoMo Callback] Đã xóa checkoutFormData khỏi localStorage"
        );
        window.history.replaceState({}, document.title, "/shop");
      } catch (error) {
        console.error("[MoMo Callback] Lỗi xử lý callback MoMo:", error);
        toast.error("Lỗi xử lý callback từ MoMo");
      }
      setIsProcessing(false);
    };
    if (location.search.includes("partnerCode=MOMOBKUN20180529")) {
      setTimeout(handleMomoCallback, 300);
    }
  }, [location.search, isProcessing]);
  const processOrder = async (formData) => {
    console.log("[MoMo Callback] Đang tạo đơn hàng với dữ liệu:", formData);
    try {
      formData.paymentId = 4;
      formData.status = ORDER_STATUS.ORDER_STATUS_ACCEPT;
      const response = await createOrder(formData);
      console.log("[MoMo Callback] Phản hồi API đơn hàng:", response);
      if (!response || !response.success) {
        console.error("[MoMo Callback] Gọi API thất bại:", response);
        toast.error("Lỗi kết nối đến server");
        return false;
      }
      const { success, data } = response;
      if (success && data && data.status !== "Error") {
        console.log("[MoMo Callback] Đơn hàng được tạo thành công:", data);
        if (formData.orderDetailModels) {
          formData.orderDetailModels.forEach((item) => {
            dispatch(deleteProductFromCart({ id: item.ProductId }));
          });
        }
        return true;
      } else {
        console.error("[MoMo Callback] Tạo đơn hàng thất bại:", data);
        toast.error(data?.message || "Có lỗi xảy ra khi tạo đơn hàng");
        return false;
      }
    } catch (error) {
      console.error(
        "[MoMo Callback] Ngoại lệ trong quá trình tạo đơn hàng:",
        error
      );
      toast.error("Có lỗi xảy ra khi tạo đơn hàng");
      return false;
    }
  };
  return null;
};
export default useMomoCallback;
