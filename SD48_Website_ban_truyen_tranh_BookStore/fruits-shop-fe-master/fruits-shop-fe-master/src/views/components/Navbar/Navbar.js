import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import useUser from "@store/useUser";
import { toast } from "react-toastify";

function Navbar() {
  const t = useUser();
  const navigate = useNavigate();
  const { resetData } = useUser();

  const handleLogout = () => {
    resetData();
    toast.success("Đăng xuất thành công");
    navigate("/");
  };

  const totalQuantity = useSelector((state) => state.products.totalQuantity);

  return (
    <div className="container-fluid fixed-top" style={{ backgroundColor: "#F4F6F8", boxShadow: "0 2px 4px rgba(0,0,0,.1)" }}>
      {/* Topbar */}
      <div className="container topbar bg-primary d-none d-lg-block">
        <div className="d-flex justify-content-between">
          <div className="top-info ps-2">
            <small className="me-3">
              <i className="fas fa-map-marker-alt me-2 text-secondary"></i>
              <a href="#" className="text-white link-underline link-underline-opacity-0">Cầu Giấy, Hà Nội</a>
            </small>
            <small className="me-3">
              <i className="fas fa-envelope me-2 text-secondary"></i>
              <a href="mailto:huydhph45901@fpt.edu.vn" className="text-white">huydhph45901@fpt.edu.vn</a>
            </small>
          </div>
          <div className="top-link pe-2">
            <Link to="/chinh-sach-bao-mat" className="text-white"><small className="text-white mx-2">Chính sách bảo mật</small></Link>/
            <Link to="/dieu-khoan-su-dung" className="text-white"><small className="text-white mx-2">Điều khoản sử dụng</small></Link>/
            <Link to="/ban-hang-va-hoan-tien" className="text-white"><small className="text-white ms-2">Bán hàng và Hoàn tiền</small></Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container bg-white"> {/* Nền trắng cho main navbar để nổi bật hơn */}
        <nav className="navbar navbar-expand-xl navbar-light py-3"> {/* Tăng padding cho navbar */}
          <Link to="/" className="navbar-brand">
            <h1 className="text-primary display-5 fw-bolder mb-0">BOOK STORE</h1> {/* Logo to và đậm hơn */}
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
            aria-controls="navbarCollapse"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="fa fa-bars text-primary"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarCollapse">
            {/* Menu chính - căn giữa nếu không có search bar, hoặc căn trái nếu có */}
            <ul className="navbar-nav mx-xl-auto mb-2 mb-xl-0"> {/* mx-xl-auto để căn giữa trên màn hình lớn */}
              <li className="nav-item">
                <Link to="/" className="nav-link px-3 fs-5 fw-medium">Trang chủ</Link>
              </li>
              <li className="nav-item">
                <Link to="/shop" className="nav-link px-3 fs-5 fw-medium">Cửa hàng</Link>
              </li>
              <li className="nav-item">
                <Link to="/contact" className="nav-link px-3 fs-5 fw-medium">Liên hệ</Link>
              </li>
            </ul>

            {/* Thanh tìm kiếm - Chỉ hiển thị trên màn hình lớn (lg và trên)
            <form className="d-none d-lg-flex ms-xl-3 me-xl-auto my-2 my-xl-0" style={{width: "100%", maxWidth: "320px"}} role="search">
              <input className="form-control" type="search" placeholder="Tìm kiếm sách..." aria-label="Search"/>
              <button className="btn btn-primary ms-2 px-3" type="submit" aria-label="Tìm kiếm"><i className="fas fa-search"></i></button>
            </form> */}
             {/* Form tìm kiếm cho mobile - bên trong menu collapse */}
            <form className="d-flex d-lg-none p-3 border-top mt-2" role="search">
                <input className="form-control me-2" type="search" placeholder="Tìm kiếm..." aria-label="Search Mobile"/>
                <button className="btn btn-outline-primary" type="submit"><i className="fas fa-search"></i></button>
            </form>


            {/* Icons tiện ích */}
            <div className="d-flex align-items-center ms-xl-4 mt-3 mt-xl-0">
              <Link to={"/cart"} className="position-relative me-4 my-auto">
                <i className="fa fa-shopping-bag fa-2x text-primary"></i>
                <span
                  className="position-absolute bg-danger text-white rounded-circle d-flex align-items-center justify-content-center px-1"
                  style={{ top: "-8px", left: "18px", height: "22px", minWidth: "22px", fontSize: "0.8rem" }}
                >
                  {totalQuantity ?? "0"}
                </span>
              </Link>

              {t.username ? (
                <div className="nav-item dropdown">
                  <a
                    className="nav-link nav-icon-hover"
                    href="#" // Thay vì javascript:void(0)
                    id="drop2"
                    role="button" // Thêm role button
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="fas fa-user fa-2x text-primary rounded-circle"></i>
                  </a>
                  <div className="dropdown-menu dropdown-menu-end dropdown-menu-animate-up shadow-sm" aria-labelledby="drop2"> {/* Thêm shadow nhẹ */}
                    <div className="message-body p-2"> {/* Thêm padding cho message-body */}
                      <Link to="/user-profile" className="d-flex align-items-center gap-2 dropdown-item py-2 justify-content-center">
                        <i className="ti ti-user fs-6"></i><p className="mb-0">Hồ sơ của tôi</p>
                      </Link>
                      <div className="px-2 pt-1"> {/* Wrapper cho nút logout để có padding */}
                        <button onClick={handleLogout} className="btn btn-outline-primary d-block w-100">Đăng xuất</button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to={"/login"} className="my-auto">
                  <i className="fas fa-user fa-2x text-primary"></i>
                </Link>
              )}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
export default Navbar;