import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  UserOutlined,
  ShoppingCartOutlined,
  LockOutlined,
  HomeOutlined,       // Trang chủ
  GiftOutlined,       // Ưu đãi / Mã giảm giá (nếu có)
  QuestionCircleOutlined, // Hỗ trợ (link tới trang liên hệ/FAQ)
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SmileOutlined, // Thay cho avatar nếu không có
} from "@ant-design/icons";

// import './SidebarDashboardUser.css'; // Tạo file CSS riêng để quản lý tốt hơn

const SidebarDashboardUser = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Thông tin user giả định, bạn sẽ lấy từ context hoặc props
  // Nếu không có avatar, có thể dùng icon mặc định hoặc chỉ hiển thị tên
  const userName = "MangaFan2024";
  // const userAvatar = "https://via.placeholder.com/100/A6E7C3/2F8C5A?text=MF";
  const userPoints = 1250; // Ví dụ điểm thành viên
  const pendingOrders = 2;   // Ví dụ số đơn hàng đang chờ

  return (
    <>
      <aside className={`left-sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <button onClick={toggleSidebar} className="sidebar-toggle-btn">
            {isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
          {!isCollapsed && (
            <Link to="/" className="brand-title">
              BOOKSTORE
            </Link>
          )}
        </div>

        {!isCollapsed && (
          <div className="user-profile-section">
            <div className="user-avatar-wrapper">
              {/* Nếu có userAvatar thì dùng img, không thì dùng icon */}
              {/* <img src={userAvatar} alt="Avatar" className="user-avatar" /> */}
              <SmileOutlined className="user-avatar-icon" />
            </div>
            <div className="user-info">
              <span className="user-name">{userName}</span>
              <span className="user-greeting">Chào mừng trở lại!</span>
            </div>
            <div className="user-stats">
              <div className="stat-item">
                <span className="stat-value">{userPoints}</span>
                <span className="stat-label">Điểm thưởng</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{pendingOrders}</span>
                <span className="stat-label">Đơn chờ xử lý</span>
              </div>
            </div>
          </div>
        )}
        {isCollapsed && (
             <div className="user-profile-section-collapsed">
                <SmileOutlined className="user-avatar-icon-collapsed" />
             </div>
        )}


        <nav className="sidebar-nav scroll-sidebar" data-simplebar="">
          <ul id="sidebarnav">
            <li className="nav-section-title">
              <span className="hide-menu">Tài Khoản Của Tôi</span>
            </li>
            <NavItem
              to="/user-profile"
              icon={<UserOutlined />}
              text="Thông tin cá nhân"
              isCollapsed={isCollapsed}
            />
            <NavItem
              to="/dashboard/history-cart"
              icon={<ShoppingCartOutlined />}
              text="Lịch sử đơn hàng"
              isCollapsed={isCollapsed}
            />
            <NavItem
              to="/dashboard/reset-pass"
              icon={<LockOutlined />}
              text="Đổi mật khẩu"
              isCollapsed={isCollapsed}
            />

            {/* Các link hữu ích khác không cần trang riêng trong dashboard */}
            <li className="nav-section-title">
              <span className="hide-menu">Khám Phá Thêm</span>
            </li>
            <NavItem
              to="/" // Link về trang chủ
              icon={<HomeOutlined />}
              text="Trang chủ BOOKSTORE"
              isCollapsed={isCollapsed}
              isExternalLink={false} // Đánh dấu không phải link dashboard
            />
            <NavItem
              to="/promotions" // Link tới trang ưu đãi/khuyến mãi chung của web
              icon={<GiftOutlined />}
              text="Ưu đãi & Khuyến mãi"
              isCollapsed={isCollapsed}
              isExternalLink={false}
            />
            <NavItem
              to="/contact" // Link tới trang liên hệ hoặc FAQ
              icon={<QuestionCircleOutlined />}
              text="Trợ giúp & Liên hệ"
              isCollapsed={isCollapsed}
              isExternalLink={false}
            />
          </ul>
        </nav>

        <div className="sidebar-footer">
          <NavLink
            to="/logout"
            className={({ isActive }) =>
              `sidebar-link logout-link ${isActive ? "active-link" : ""} ${
                isCollapsed ? "collapsed" : ""
              }`
            }
          >
            <LogoutOutlined className="nav-icon" />
            {!isCollapsed && <span className="hide-menu">Đăng xuất</span>}
          </NavLink>
        </div>
      </aside>

      {/* CSS - Nên đặt trong file .css riêng */}
      <style jsx global>{`
        :root {
          --primary-green: #4CAF50; /* Xanh lá cây chủ đạo */
          --dark-green: #388e3c;
          --light-green: #c8e6c9; /* Light green nhạt hơn */
          --text-color: #212529;
          --sidebar-bg: #fdfdfd; /* Nền trắng hơn một chút */
          --sidebar-width: 270px; /* Rộng hơn một chút */
          --sidebar-width-collapsed: 80px;
          --sidebar-header-height: 65px;
          --border-color: #e9ecef;
          --hover-bg-color: #e0f2f1; /* Màu hover xanh ngọc nhẹ */
        }

        .left-sidebar {
          width: var(--sidebar-width);
          background-color: var(--sidebar-bg);
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 100;
          transition: width 0.3s ease;
          box-shadow: 3px 0 8px rgba(0,0,0,0.04);
        }

        .left-sidebar.collapsed {
          width: var(--sidebar-width-collapsed);
        }

        .sidebar-header {
          height: var(--sidebar-header-height);
          display: flex;
          align-items: center;
          padding: 0 20px; /* Tăng padding */
          border-bottom: 1px solid var(--border-color);
          background-color: #fff;
        }
        
        .left-sidebar.collapsed .sidebar-header {
            justify-content: center;
            padding: 0 10px;
        }

        .sidebar-toggle-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 22px; /* Icon to hơn */
          color: #555;
          margin-right: 18px; /* Tăng margin */
          padding: 5px;
          transition: color 0.2s;
        }
        .sidebar-toggle-btn:hover {
            color: var(--primary-green);
        }
        .left-sidebar.collapsed .sidebar-toggle-btn {
            margin-right: 0;
        }

        .brand-title {
          font-size: 24px; /* To hơn */
          font-weight: 700;
          color: var(--primary-green);
          text-decoration: none;
          letter-spacing: 0.5px;
          transition: opacity 0.2s;
        }
        .left-sidebar.collapsed .brand-title {
            display: none;
        }

        .user-profile-section {
          padding: 25px 20px; /* Tăng padding */
          text-align: center;
          border-bottom: 1px solid var(--border-color);
        }
        .user-profile-section-collapsed {
          padding: 20px 0;
          text-align: center;
          border-bottom: 1px solid var(--border-color);
        }

        .user-avatar-wrapper {
          margin-bottom: 15px; /* Tăng margin */
        }
        .user-avatar-icon {
          font-size: 60px; /* Icon to hơn */
          color: var(--primary-green);
          padding: 10px;
          background-color: var(--light-green);
          border-radius: 50%;
          border: 3px solid var(--primary-green);
        }
         .user-avatar-icon-collapsed {
          font-size: 32px; /* Icon to hơn */
          color: var(--primary-green);
          padding: 8px;
          background-color: var(--light-green);
          border-radius: 50%;
        }


        .user-info .user-name {
          display: block;
          font-weight: 600;
          color: var(--text-color);
          font-size: 18px; /* To hơn */
          margin-bottom: 4px;
        }
        .user-info .user-greeting {
          display: block;
          font-size: 14px;
          color: #6c757d;
        }
        
        .user-stats {
            display: flex;
            justify-content: space-around;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px dashed var(--border-color);
        }
        .stat-item {
            text-align: center;
        }
        .stat-value {
            display: block;
            font-size: 18px;
            font-weight: 600;
            color: var(--primary-green);
        }
        .stat-label {
            font-size: 12px;
            color: #6c757d;
        }


        .sidebar-nav {
          flex-grow: 1;
          overflow-y: auto;
        }
        .scroll-sidebar::-webkit-scrollbar { width: 6px; }
        .scroll-sidebar::-webkit-scrollbar-track { background: #f1f1f1; }
        .scroll-sidebar::-webkit-scrollbar-thumb { background: var(--light-green); border-radius: 3px; }
        .scroll-sidebar::-webkit-scrollbar-thumb:hover { background: var(--dark-green); }

        #sidebarnav {
          list-style: none;
          padding: 10px 0; /* Giảm padding */
          margin: 0;
        }

        .nav-section-title {
          padding: 15px 25px 8px 25px; /* Tăng padding */
          font-size: 11px; /* Nhỏ hơn */
          font-weight: 700; /* Đậm hơn */
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.8px; /* Tăng letter spacing */
        }
        .left-sidebar.collapsed .nav-section-title {
            padding: 15px 0 8px 0;
            text-align: center;
        }
        .left-sidebar.collapsed .nav-section-title .hide-menu {
            display: none;
        }
         .left-sidebar.collapsed .nav-section-title::before {
            content: "•"; /* Chấm tròn nhỏ */
            font-size: 18px;
            color: var(--primary-green);
            display: block;
        }

        .sidebar-item .sidebar-link {
          display: flex;
          align-items: center;
          padding: 14px 25px; /* Tăng padding */
          margin: 2px 10px; /* Thêm margin ngang */
          color: #495057; /* Màu text trầm hơn */
          text-decoration: none;
          transition: background-color 0.2s ease, color 0.2s ease, border-radius 0.2s ease, transform 0.1s ease;
          font-size: 15px;
          border-radius: 6px; /* Bo góc */
        }
        .left-sidebar.collapsed .sidebar-item .sidebar-link {
            padding: 14px 0;
            margin: 2px 5px;
            justify-content: center;
        }

        .sidebar-item .sidebar-link:hover {
          background-color: var(--hover-bg-color);
          color: var(--dark-green);
          transform: translateX(3px); /* Hiệu ứng nhích nhẹ */
        }

        .sidebar-item .sidebar-link.active-link {
          background-color: var(--primary-green);
          color: white !important; /* Quan trọng để ghi đè */
          font-weight: 500;
          box-shadow: 0 2px 5px rgba(76, 175, 80, 0.4);
        }
        .sidebar-item .sidebar-link.active-link .nav-icon,
        .sidebar-item .sidebar-link.active-link .hide-menu {
          color: white !important;
        }

        .nav-icon {
          font-size: 19px; /* To hơn */
          margin-right: 15px; /* Tăng margin */
          width: 22px;
          text-align: center;
          transition: color 0.2s ease;
          color: #777; /* Màu icon mặc định */
        }
        .sidebar-item .sidebar-link:hover .nav-icon {
            color: var(--dark-green);
        }
        .left-sidebar.collapsed .nav-icon {
            margin-right: 0;
            font-size: 22px;
        }

        .left-sidebar.collapsed .hide-menu {
          display: none;
        }
        
        .sidebar-footer {
          padding: 20px; /* Tăng padding */
          border-top: 1px solid var(--border-color);
          background-color: #fff;
        }
        .left-sidebar.collapsed .sidebar-footer {
            padding: 15px 0;
            text-align: center;
        }

        .logout-link {
            display: flex;
            align-items: center;
            color: #dc3545;
            text-decoration: none;
            padding: 12px 15px; /* Tăng padding */
            border-radius: 6px;
            transition: background-color 0.2s ease, color 0.2s ease;
            font-weight: 500;
        }
         .left-sidebar.collapsed .logout-link {
            justify-content: center;
            padding: 12px 0;
        }

        .logout-link:hover {
            background-color: #f8d7da;
            color: #721c24;
        }
        .logout-link .nav-icon {
            color: #dc3545;
             transition: color 0.2s ease;
        }
         .logout-link:hover .nav-icon {
            color: #721c24;
        }
      `}</style>
    </>
  );
};

const NavItem = ({ to, icon, text, isCollapsed, isExternalLink = true }) => (
  <li className="sidebar-item">
    <NavLink
      to={to}
      className={({ isActive }) =>
        `sidebar-link ${isActive && isExternalLink ? "active-link" : ""} ${ // Chỉ active cho link dashboard
          isCollapsed ? "collapsed" : ""
        }`
      }
      // Nếu là link ngoài (không phải dashboard), không cần exact hoặc style active đặc biệt
      end={isExternalLink} // Dùng `end` cho NavLink v6+ thay cho `exact`
    >
      {React.cloneElement(icon, { className: "nav-icon" })}
      {!isCollapsed && <span className="hide-menu">{text}</span>}
    </NavLink>
  </li>
);

export default SidebarDashboardUser;