import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { totalQuanlity } from "../../../services/redux/cartSlice/productSlice";
import useUser from "@store/useUser";
import { toast } from "react-toastify";

function Navbar() {
  // const [isShowModalSearch, setIsShowModalSearch] = useState(false);

  // const toggleShowModal = () => {
  //   setIsShowModalSearch(!isShowModalSearch);
  // };

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
    <div
      className="container-fluid fixed-top"
      style={{ backgroundColor: "#F4F6F8 " }}
    >
      <div className="container topbar bg-primary d-none d-lg-block">
        <div className="d-flex justify-content-between">
          <div className="top-info ps-2">
            <small className="me-3">
              <i className="fas fa-map-marker-alt me-2 text-secondary"></i>{" "}
              <a
                href="#"
                className="text-white link-underline link-underline-opacity-0"
              >
                Cau Giay, Ha Noi
              </a>
            </small>
            <small className="me-3">
              <i className="fas fa-envelope me-2 text-secondary"></i>
              <a href="#" className="text-white">
                demo@gmail.com
              </a>
            </small>
          </div>
          <div className="top-link pe-2">
            <a href="#" className="text-white">
              <small className="text-white mx-2">Privacy Policy</small>/
            </a>
            <a href="#" className="text-white">
              <small className="text-white mx-2">Terms of Use</small>/
            </a>
            <a href="#" className="text-white">
              <small className="text-white ms-2">Sales and Refunds</small>
            </a>
          </div>
        </div>
      </div>

      <div className="container px-0">
        <nav
          className="navbar navbar-light  navbar-expand-xl"
          style={{ backgroundColor: "#F4F6F8 " }}
        >
          <Link to="/" className="navbar-brand">
            <h1 className="text-primary display-6">Book Store</h1>
          </Link>
          <button
            className="navbar-toggler py-2 px-3"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
          >
            <span className="fa fa-bars text-primary"></span>
          </button>
          <div
            className="collapse navbar-collapse " //bg-white
            id="navbarCollapse"
            style={{ backgroundColor: "#F4F6F8 " }}
          >
            <div
              className="navbar-nav mx-auto"
              style={{ backgroundColor: "#F4F6F8 " }}
            >
              <Link to="/" className="nav-item nav-link active">
                Home
              </Link>
              {/* <Link to="/shop" className="nav-item nav-link">
                Shop
              </Link> */}

              <Link to="/contact" className="nav-item nav-link">
                Contact
              </Link>
            </div>
            <div className="d-flex m-3 me-0">
              <Link to={"/cart"} className="position-relative me-4 my-auto">
                <i className="fa fa-shopping-bag fa-2x"></i>
                <span
                  className="position-absolute bg-secondary rounded-circle d-flex align-items-center justify-content-center text-dark px-1"
                  style={{
                    top: "-5px",
                    left: "15px",
                    height: "20px",
                    minWidth: "20px",
                  }}
                >
                  {totalQuantity ?? "0"}
                </span>
              </Link>

              {t.username ? (
                <div class="navbar-collapse px-0" id="navbarNav">
                  <ul class="navbar-nav flex-row ms-auto align-items-center">
                    <li class="nav-item dropdown">
                      <a
                        class="nav-link nav-icon-hover"
                        href="javascript:void(0)"
                        id="drop2"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="fas fa-user fa-2x rounded-circle"></i>
                      </a>
                      <div
                        class="dropdown-menu dropdown-menu-end dropdown-menu-animate-up"
                        aria-labelledby="drop2"
                      >
                        <div class="message-body">
                          <a
                            href="/user-profile"
                            class="d-flex align-items-center gap-2 dropdown-item justify-content-center"
                          >
                            <i class="ti ti-user fs-6"></i>
                            <p class="mb-0">My Profile</p>
                          </a>
                          <a
                            onClick={handleLogout}
                            class="btn btn-outline-primary mx-3 mt-2 d-block"
                          >
                            Logout
                          </a>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              ) : (
                <Link to={"/login"} className="my-auto">
                  <i className="fas fa-user fa-2x"></i>
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
