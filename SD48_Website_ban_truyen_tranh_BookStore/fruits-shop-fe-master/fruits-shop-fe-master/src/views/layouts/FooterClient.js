import React from "react";
import { Link } from "react-router-dom"; // Import Link

function FooterClient() {
  return (
    <>
      <div className="container-fluid bg-dark text-white-50 footer pt-5 mt-5">
        <div className="container py-5">
          <div
            className="pb-4 mb-4"
            style={{ borderBottom: "1px solid rgba(226, 175, 24, 0.5)" }}
          >
            <div className="row g-4">
              <div className="col-lg-6 offset-lg-3">
                <div className="position-relative mx-auto">
                  <input
                    className="form-control border-0 w-100 py-3 px-4 rounded-pill"
                    type="email"
                    placeholder="Nhập email của bạn để nhận thông báo"
                  />
                  <button
                    type="submit"
                    className="btn btn-primary border-0 border-secondary py-3 px-4 position-absolute rounded-pill text-white"
                    style={{ top: 0, right: 0 }}
                  >
                    Đăng Ký Ngay
                  </button>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="d-flex justify-content-center justify-content-lg-end pt-3 pt-lg-0">
                  <a className="btn btn-outline-secondary me-2 btn-md-square rounded-circle" href="#">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a className="btn btn-outline-secondary me-2 btn-md-square rounded-circle" href="#">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a className="btn btn-outline-secondary me-2 btn-md-square rounded-circle" href="#">
                    <i className="fab fa-youtube"></i>
                  </a>
                  <a className="btn btn-outline-secondary btn-md-square rounded-circle" href="#">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="row g-5">
            <div className="col-lg-3 col-md-6">
              <div className="footer-item">
                <h4 className="text-light mb-3">BOOK STORE</h4>
                <p className="mb-4">
                  Chúng tôi mang đến thế giới truyện tranh và sách phong phú, cập nhật liên tục với chất lượng dịch vụ tốt nhất cho các độc giả.
                </p>
                {/* <Link to="/about-us" className="btn border-secondary py-2 px-4 rounded-pill text-primary">Xem Thêm</Link> */}
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="d-flex flex-column text-start footer-item">
                <h4 className="text-light mb-3">Thông Tin Chung</h4>
                <Link className="btn-link" to="/about-us">Về BOOK STORE</Link> {/* Giả sử có trang /about-us */}
                <Link className="btn-link" to="/contact">Liên Hệ</Link>
                <Link className="btn-link" to="/chinh-sach-bao-mat">Chính Sách Bảo Mật</Link>
                <Link className="btn-link" to="/dieu-khoan-su-dung">Điều Khoản Sử Dụng</Link>
                <Link className="btn-link" to="/ban-hang-va-hoan-tien">Bán Hàng, Đổi Trả & Hoàn Tiền</Link>
                <Link className="btn-link" to="/faq">Câu Hỏi Thường Gặp (FAQ)</Link> {/* Giả sử có trang /faq */}
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="d-flex flex-column text-start footer-item">
                <h4 className="text-light mb-3">Tài Khoản</h4>
                <Link className="btn-link" to="/user-profile">Tài Khoản Của Tôi</Link>
                <Link className="btn-link" to="/cart">Giỏ Hàng</Link>
                <Link className="btn-link" to="/dashboard/history-cart">Lịch Sử Đặt Hàng</Link>
                {/* Các link dưới đây có thể chưa có trang tương ứng */}
                {/* <Link className="btn-link" to="/wishlist">Danh Sách Yêu Thích</Link> */}
                {/* <Link className="btn-link" to="/shop-details">Chi Tiết Cửa Hàng</Link> */}
                {/* <Link className="btn-link" to="/international-orders">Đơn Hàng Quốc Tế</Link> */}
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="footer-item">
                <h4 className="text-light mb-3">Liên Hệ Với Chúng Tôi</h4>
                <p><i className="fas fa-map-marker-alt me-2"></i>Địa chỉ: Cầu Giấy, Hà Nội</p>
                <p><i className="fas fa-envelope me-2"></i>Email: huydhph45901@fpt.edu.vn</p> {/* Cập nhật email */}
                <p><i className="fas fa-phone me-2"></i>Điện thoại: 0337233555</p>
                <p className="mt-3">Chấp Nhận Thanh Toán</p>
                <img src="/img/payment.png" className="img-fluid" alt="Phương thức thanh toán" style={{ maxWidth: '200px' }} /> {/* Đảm bảo đường dẫn ảnh đúng, ví dụ /img/payment.png nếu ảnh trong public/img */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid copyright bg-dark py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
              <span className="text-light">
                <Link to="/" className="text-light"><i className="fas fa-copyright text-light me-2"></i>BOOK STORE</Link>, Mọi quyền được bảo lưu.
              </span>
            </div>
            <div className="col-md-6 my-auto text-center text-md-end text-white">
                {/* Bạn có thể giữ lại hoặc bỏ đi phần này */}
                {/* Thiết kế bởi <a className="border-bottom" href="https://htmlcodex.com">HTML Codex</a> | Phân phối bởi <a className="border-bottom" href="https://themewagon.com">ThemeWagon</a> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FooterClient;