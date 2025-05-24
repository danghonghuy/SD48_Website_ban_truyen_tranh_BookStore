import React from "react";

const Footer = () => {
  return (
    <div>
      <div className="container-fluid bg-dark text-white-50 footer pt-5 mt-5">
        <div className="container py-5">
          <div
            className="pb-4 mb-4"
            style={{ borderBottom: "1px solid rgba(226, 175, 24, 0.5)" }}
          >
            <div className="row g-4">
              <div className="col-lg-3">
                <a href="#">
                  <h1 className="text-primary mb-0">TruyệnHay</h1>
                  <p className="text-secondary mb-0">Thế giới truyện tranh</p>
                </a>
              </div>
              <div className="col-lg-6">
                <div className="position-relative mx-auto">
                  <input
                    className="form-control border-0 w-100 py-3 px-4 rounded-pill"
                    type="email" // Changed type to email for "Your Email"
                    placeholder="Email của bạn"
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
                <div className="d-flex justify-content-end pt-3">
                  <a
                    className="btn btn-outline-secondary me-2 btn-md-square rounded-circle"
                    href="#" // Added # for placeholder links
                  >
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a
                    className="btn btn-outline-secondary me-2 btn-md-square rounded-circle"
                    href="#"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a
                    className="btn btn-outline-secondary me-2 btn-md-square rounded-circle"
                    href="#"
                  >
                    <i className="fab fa-youtube"></i>
                  </a>
                  <a
                    className="btn btn-outline-secondary btn-md-square rounded-circle"
                    href="#"
                  >
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="row g-5">
            <div className="col-lg-3 col-md-6">
              <div className="footer-item">
                <h4 className="text-light mb-3">Tại Sao Chọn Chúng Tôi!</h4>
                <p className="mb-4">
                  Chúng tôi cung cấp đa dạng các thể loại truyện tranh, từ kinh điển đến mới nhất, đảm bảo chất lượng và trải nghiệm đọc tốt nhất cho bạn.
                </p>
                <a
                  href="#"
                  className="btn border-secondary py-2 px-4 rounded-pill text-primary"
                >
                  Xem Thêm
                </a>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="d-flex flex-column text-start footer-item">
                <h4 className="text-light mb-3">Thông Tin Cửa Hàng</h4>
                <a className="btn-link" href="#">
                  Về Chúng Tôi
                </a>
                <a className="btn-link" href="#">
                  Liên Hệ
                </a>
                <a className="btn-link" href="#">
                  Chính Sách Bảo Mật
                </a>
                <a className="btn-link" href="#">
                  Điều Khoản & Điều Kiện
                </a>
                <a className="btn-link" href="#">
                  Chính Sách Đổi Trả
                </a>
                <a className="btn-link" href="#">
                  Câu Hỏi Thường Gặp
                </a>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="d-flex flex-column text-start footer-item">
                <h4 className="text-light mb-3">Tài Khoản</h4>
                <a className="btn-link" href="#">
                  Tài Khoản Của Tôi
                </a>
                <a className="btn-link" href="#">
                  Chi Tiết Cửa Hàng
                </a>
                <a className="btn-link" href="#">
                  Giỏ Hàng
                </a>
                <a className="btn-link" href="#">
                  Danh Sách Yêu Thích
                </a>
                <a className="btn-link" href="#">
                  Lịch Sử Đặt Hàng
                </a>
                <a className="btn-link" href="#">
                  Đơn Hàng Quốc Tế
                </a>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="footer-item">
                <h4 className="text-light mb-3">Liên Hệ</h4>
                <p>Địa chỉ: 123 Đường Sách, Quận Truyện, TP.HCM</p>
                <p>Email: lienhe@truyenhay.com</p>
                <p>Điện thoại: +84 123 456 789</p>
                <p>Chấp Nhận Thanh Toán</p>
                <img src="img/payment.png" className="img-fluid" alt="Phương thức thanh toán" />
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
                <a href="#">
                  <i className="fas fa-copyright text-light me-2"></i>TruyệnHay
                </a>
                , Mọi quyền được bảo lưu.
              </span>
            </div>
            <div className="col-md-6 my-auto text-center text-md-end text-white">
              {/* This part can be removed if not relevant */}
              Thiết kế bởi
              <a className="border-bottom" href="https://htmlcodex.com" target="_blank" rel="noopener noreferrer">
                HTML Codex
              </a>
              <br />Phân phối bởi
              <a className="border-bottom" href="https://themewagon.com" target="_blank" rel="noopener noreferrer">
                ThemeWagon
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;