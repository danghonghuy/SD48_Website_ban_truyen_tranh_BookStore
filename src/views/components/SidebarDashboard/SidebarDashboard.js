import React, { useEffect, useState } from "react";
import logdark from "../Dashboard/assets/images/logos/dark-logo.svg";
import { Link, useLocation } from "react-router-dom";
import product from "../Dashboard/assets/images/logos/product.png";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import {
  IconLayoutDashboard,
  IconBookUpload,
  IconLogout2,
  IconDeviceDesktopCog,
} from "@tabler/icons-react";
import useAuth from "@api/useAuth";
import useUser from "@store/useUser";
import { jwtDecode } from "jwt-decode";
const SidebarDashboard = () => {
  const [activeMenu, setActiveMenu] = useState("");
  const location = useLocation();

  const { roleCode } = useUser();

  const handleMenuClick = (menuName) => {
    setActiveMenu(menuName);
  };
  const isActiveMenu = (menuName) => {
    return activeMenu == menuName;
  };
  return (
    <>
      <aside class="left-sidebar">
        <div>
          <div class="brand-logo d-flex align-items-center justify-content-between">
            <a href="./index.html" class="text-nowrap logo-img">
              <img src={logdark} width="180" alt="" />
            </a>
            <div
              class="close-btn d-xl-none d-block sidebartoggler cursor-pointer"
              id="sidebarCollapse"
            >
              <i class="ti ti-x fs-8"></i>
            </div>
          </div>
          <nav class="sidebar-nav" data-simplebar="">
            <Sidebar style={{ position: "fixed", height: "100vh" }}>
              <Menu
                style={{
                  height: "calc(100vh - 100px)",
                  overflowY: "auto",
                }}
              >
                {roleCode === "ADMIN" && (
                  <MenuItem
                    component={
                      <Link
                        to={"/dashboard"}
                        className="sidebar-link"
                        aria-expanded="false"
                      ></Link>
                    }
                    onClick={() => handleMenuClick("dashboard")}
                    className={isActiveMenu("dashboard") ? "selected-item" : ""}
                    active={isActiveMenu("dashboard")}
                    style={{ fontSize: "15px", fontWeight: "bold" }}
                  >
                    {" "}
                    Trang chủ{" "}
                  </MenuItem>
                )}
                {/*icon={<IconBookUpload stroke={2}/>}*/}
                <MenuItem
                  component={
                    <Link
                      to={"/dashboard/order-counter"}
                      className="sidebar-link"
                      aria-expanded="false"
                    ></Link>
                  }
                  onClick={() => handleMenuClick("order-counter")}
                  className={
                    isActiveMenu("order-counter") ? "selected-item" : ""
                  }
                  style={{ fontSize: "15px", fontWeight: "bold" }}
                  active={isActiveMenu("order-counter")}
                >
                  {" "}
                  Bán hàng tại quầy{" "}
                </MenuItem>
                {/* <SubMenu label="Thống kê" style={{ fontSize: "15px", fontWeight: "bold" }} >
                  <MenuItem
                    // component={<Link to={'/dashboard/order'} className="sidebar-link" aria-expanded="false" ></Link>}
                    onClick={() => handleMenuClick('order')}
                    className={isActiveMenu('order') ? 'selected-item' : ''}
                    style={{ fontSize: "15px" }}
                    active={isActiveMenu('order')}> Đơn hàng </MenuItem>
                  <MenuItem
                    // component={<Link to={'/dashboard/rollback-order'} className="sidebar-link" aria-expanded="false" ></Link>}
                    onClick={() => handleMenuClick('rollback-order')}
                    className={isActiveMenu('rollback-order') ? 'selected-item' : ''}
                    style={{ fontSize: "15px" }}
                    active={isActiveMenu('rollback-order')}> Đánh giá sản phẩm </MenuItem>
                </SubMenu> */}
                <SubMenu
                  label="Quản lý sản phẩm"
                  style={{ fontSize: "15px", fontWeight: "bold" }}
                >
                  <MenuItem
                    component={
                      <Link
                        to={"/dashboard/product"}
                        className="sidebar-link"
                        aria-expanded="false"
                      ></Link>
                    }
                    onClick={() => handleMenuClick("product")}
                    className={isActiveMenu("product") ? "selected-item" : ""}
                    style={{ fontSize: "15px" }}
                    active={isActiveMenu("product")}
                  >
                    {" "}
                    Danh sách sản phẩm{" "}
                  </MenuItem>
                  <MenuItem
                    component={
                      <Link
                        to={"/dashboard/branch"}
                        className="sidebar-link"
                        aria-expanded="false"
                      ></Link>
                    }
                    onClick={() => handleMenuClick("branch")}
                    className={isActiveMenu("branch") ? "selected-item" : ""}
                    style={{ fontSize: "15px" }}
                    active={isActiveMenu("branch")}
                  >
                    {" "}
                    Danh sách loại{" "}
                  </MenuItem>
                  <MenuItem
                    component={
                      <Link
                        to={"/dashboard/type"}
                        className="sidebar-link"
                        aria-expanded="false"
                      ></Link>
                    }
                    onClick={() => handleMenuClick("type")}
                    className={isActiveMenu("type") ? "selected-item" : ""}
                    style={{ fontSize: "15px" }}
                    active={isActiveMenu("type")}
                  >
                    {" "}
                    Danh sách gói{" "}
                  </MenuItem>
                  <MenuItem
                    component={
                      <Link
                        to={"/dashboard/catalog"}
                        className="sidebar-link"
                        aria-expanded="false"
                      ></Link>
                    }
                    onClick={() => handleMenuClick("catalog")}
                    className={isActiveMenu("catalog") ? "selected-item" : ""}
                    active={isActiveMenu("catalog")}
                    style={{ fontSize: "15px" }}
                  >
                    {" "}
                    Danh mục{" "}
                  </MenuItem>
                </SubMenu>
                <SubMenu
                  label="Quản lý tài khoản"
                  style={{ fontSize: "15px", fontWeight: "bold" }}
                >
                  <MenuItem
                    component={
                      <Link
                        to={"/dashboard/accounts"}
                        className="sidebar-link"
                        aria-expanded="false"
                      ></Link>
                    }
                    onClick={() => handleMenuClick("accounts")}
                    className={isActiveMenu("accounts") ? "selected-item" : ""}
                    style={{ fontSize: "15px" }}
                    active={isActiveMenu("accounts")}
                  >
                    {" "}
                    Khách hàng{" "}
                  </MenuItem>
                  {roleCode === "ADMIN" && (
                    <MenuItem
                      component={
                        <Link
                          to={"/dashboard/employee"}
                          className="sidebar-link"
                          aria-expanded="false"
                        ></Link>
                      }
                      onClick={() => handleMenuClick("employee")}
                      className={
                        isActiveMenu("employee") ? "selected-item" : ""
                      }
                      style={{ fontSize: "15px" }}
                      active={isActiveMenu("employee")}
                    >
                      {" "}
                      Nhân viên{" "}
                    </MenuItem>
                  )}
                </SubMenu>
                {roleCode === "ADMIN" && (
                  <SubMenu
                    label="Quản lý khuyến mại"
                    style={{ fontSize: "15px", fontWeight: "bold" }}
                  >
                    <MenuItem
                      component={
                        <Link
                          to={"/dashboard/coupon"}
                          className="sidebar-link"
                          aria-expanded="false"
                        ></Link>
                      }
                      onClick={() => handleMenuClick("coupon")}
                      className={isActiveMenu("coupon") ? "selected-item" : ""}
                      style={{ fontSize: "15px" }}
                      active={isActiveMenu("coupon")}
                    >
                      {" "}
                      Coupon{" "}
                    </MenuItem>
                    <MenuItem
                      component={
                        <Link
                          to={"/dashboard/discount"}
                          className="sidebar-link"
                          aria-expanded="false"
                        ></Link>
                      }
                      onClick={() => handleMenuClick("discount")}
                      className={
                        isActiveMenu("discount") ? "selected-item" : ""
                      }
                      style={{ fontSize: "15px" }}
                      active={isActiveMenu("discount")}
                    >
                      {" "}
                      Discount{" "}
                    </MenuItem>
                  </SubMenu>
                )}
                <SubMenu
                  label="Quản lý đơn hàng"
                  style={{ fontSize: "15px", fontWeight: "bold" }}
                >
                  <MenuItem
                    component={
                      <Link
                        to={"/dashboard/order"}
                        className="sidebar-link"
                        aria-expanded="false"
                      ></Link>
                    }
                    onClick={() => handleMenuClick("order")}
                    className={isActiveMenu("order") ? "selected-item" : ""}
                    style={{ fontSize: "15px" }}
                    active={isActiveMenu("order")}
                  >
                    {" "}
                    Đơn hàng{" "}
                  </MenuItem>
                  {/* <MenuItem
                    component={<Link to={'/dashboard/rollback-order'} className="sidebar-link" aria-expanded="false" ></Link>}
                    onClick={() => handleMenuClick('rollback-order')}
                    className={isActiveMenu('rollback-order') ? 'selected-item' : ''}
                    style={{ fontSize: "15px" }}
                    active={isActiveMenu('rollback-order')}> Danh sách hoàn đơn </MenuItem> */}
                </SubMenu>
                {roleCode === "ADMIN" && (
                  <SubMenu
                    label="Quản lý cấu hình"
                    style={{ fontSize: "15px", fontWeight: "bold" }}
                  >
                    <MenuItem
                      component={
                        <Link
                          to={"/dashboard/role"}
                          className="sidebar-link"
                          aria-expanded="false"
                        ></Link>
                      }
                      onClick={() => handleMenuClick("role")}
                      className={isActiveMenu("role") ? "selected-item" : ""}
                      style={{ fontSize: "15px" }}
                      active={isActiveMenu("role")}
                    >
                      {" "}
                      Phân quyền{" "}
                    </MenuItem>
                    <MenuItem
                      component={
                        <Link
                          to={"/dashboard/payment"}
                          className="sidebar-link"
                          aria-expanded="false"
                        ></Link>
                      }
                      onClick={() => handleMenuClick("payment")}
                      className={isActiveMenu("payment") ? "selected-item" : ""}
                      active={isActiveMenu("payment")}
                    >
                      {" "}
                      Thanh toán{" "}
                    </MenuItem>
                    <MenuItem
                      component={
                        <Link
                          to={"/dashboard/delivery"}
                          className="sidebar-link"
                          aria-expanded="false"
                        ></Link>
                      }
                      onClick={() => handleMenuClick("delivery")}
                      className={
                        isActiveMenu("delivery") ? "selected-item" : ""
                      }
                      style={{ fontSize: "15px" }}
                      active={isActiveMenu("delivery")}
                    >
                      {" "}
                      Vận chuyển{" "}
                    </MenuItem>
                  </SubMenu>
                )}
                <MenuItem
                  component={
                    <Link
                      to={"/dashboard/product"}
                      className="sidebar-link"
                      aria-expanded="false"
                    ></Link>
                  }
                  onClick={() => handleMenuClick("dashboard")}
                  className={isActiveMenu("dashboard") ? "selected-item" : ""}
                  active={isActiveMenu("dashboard")}
                  style={{ fontSize: "15px", fontWeight: "bold" }}
                >
                  {" "}
                  Đăng xuất{" "}
                </MenuItem>
              </Menu>
            </Sidebar>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default SidebarDashboard;
