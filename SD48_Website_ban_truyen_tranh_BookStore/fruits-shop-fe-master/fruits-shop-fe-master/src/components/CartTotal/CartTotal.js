import useVnPay from "@api/useVnPay";
import useUser from "@store/useUser";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
// Giả sử bạn có Bootstrap Icons, hoặc một thư viện icon khác
// import 'bootstrap-icons/font/bootstrap-icons.css'; // Ví dụ nếu dùng Bootstrap Icons

function formatCurrencyVND(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

const CartTotal = () => {
  const totalCost = useSelector((state) => state.products.totalCost);
  const t = useUser();
  const { createPaymentUrl } = useVnPay();

  const handleCallVnPay = async () => {
    const { success, data } = await createPaymentUrl({
      orderType: "order",
      amount: totalCost,
      orderDescription: "Thanh toán đơn hàng", // Mô tả cụ thể hơn
      name: `KhachHang_${t.username || 'Guest'}_${Date.now()}` // Tên đơn hàng/giao dịch rõ ràng hơn
    });
    if (data.status === "Error") {
      toast.error(data.message || "Đã có lỗi xảy ra khi tạo yêu cầu thanh toán.");
    } else if (data.data) {
      window.location.href = data.data;
      // toast.success(data.message || "Đang chuyển đến trang thanh toán..."); // Cân nhắc
    } else {
      toast.error("Không nhận được URL thanh toán. Vui lòng thử lại.");
    }
  };

  return (
    <>
      <div className="row g-4 justify-content-end">
        <div className="col-8"></div> {/* Giữ nguyên theo yêu cầu */}
        <div className="col-sm-8 col-md-7 col-lg-6 col-xl-4">
          {/* Sử dụng Card của Bootstrap để trông chuyên nghiệp hơn */}
          <div className="card shadow border-0 rounded-3"> {/* Thêm border-0, rounded-3 */}
            <div className="card-body p-4"> {/* Tăng padding tổng thể */}
              <h2 className="card-title fw-bold mb-4 text-center">
                {/* <i className="bi bi-cart-check-fill me-2 text-primary"></i>  Ví dụ icon */}
                Thông tin Thanh Toán
              </h2>

              {/* Nếu muốn hiển thị lại Tạm tính */}
              {/*
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="text-muted mb-0">Tạm tính:</h6>
                <p className="mb-0 fw-medium">{formatCurrencyVND(totalCost)}</p>
              </div>
              <hr className="my-3" />
              */}

              <div className="d-flex justify-content-between align-items-center mb-4 pt-2">
                <h5 className="mb-0 fw-semibold">
                  {/* <i className="bi bi-cash-coin me-2"></i> Ví dụ icon */}
                  Tổng cộng:
                </h5>
                <p className="mb-0 fw-bold fs-4 text-primary">{formatCurrencyVND(totalCost)}</p>
              </div>

              {t.username ? (
                <Link to="/checkout" className="d-grid text-decoration-none"> {/* d-grid để button chiếm full width */}
                  <button
                    className="btn btn-primary btn-lg rounded-pill px-4 py-3 text-uppercase fw-bold shadow-sm"
                    // Nút to hơn (btn-lg), đổ bóng nhẹ (shadow-sm)
                    type="button"
                  >
                    {/* <i className="bi bi-credit-card-2-front-fill me-2"></i> Ví dụ icon */}
                    Tiến hành Thanh toán
                  </button>
                </Link>
              ) : (
                <Link to="/login" className="d-grid text-decoration-none">
                  <button
                    className="btn btn-success btn-lg rounded-pill px-4 py-3 text-uppercase fw-bold shadow-sm"
                    // Có thể dùng màu khác cho trường hợp này, ví dụ btn-success
                    type="button"
                  >
                    {/* <i className="bi bi-box-arrow-in-right me-2"></i> Ví dụ icon */}
                    Đăng nhập để Thanh toán
                  </button>
                </Link>
              )}
            </div>
            {/* Có thể thêm card-footer nếu cần */}
            {/* <div className="card-footer bg-transparent border-top-0 text-center py-3">
              <small className="text-muted">An toàn và Bảo mật</small>
            </div> */}
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
};

export default CartTotal;