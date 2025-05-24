import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import {
  IconLayoutDashboard, IconLogout2, IconShoppingCart, IconArchive,
  IconListDetails, IconCategory, IconPackage, IconClipboardList, IconUsers,
  IconUser, IconUserShield, IconDiscount2, IconTicket, IconGift,
  IconTruckDelivery, IconClipboardText, IconSettings, IconKey,
  IconCreditCard, IconShip, IconUserEdit, IconBuildingStore, IconBuildingFactory2
} from "@tabler/icons-react";
import useAuth from "@api/useAuth";
import useUser from "@store/useUser";
import { toast } from "react-toastify";

// --- Constants for Theming ---
const PRIMARY_COLOR = '#4CAF50';
const PRIMARY_COLOR_DARK = '#388E3C';
const PRIMARY_COLOR_VERY_LIGHT = '#E8F5E9';

const TEXT_COLOR_SECONDARY = '#5A6A85';
const BACKGROUND_COLOR = '#FFFFFF';
const BORDER_COLOR = '#E5EAEF';

const SIDEBAR_WIDTH = '270px';
const LOGO_AREA_HEIGHT_VALUE = 70;
const LOGO_AREA_HEIGHT = `${LOGO_AREA_HEIGHT_VALUE}px`;

// --- Logo Component (Inline) & Styles ---
const bookstoreLogoContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  color: 'inherit',
  height: '40px',
};
const bookstoreLogoIconStyle = {
  width: '28px',
  height: '32px',
  marginRight: '10px',
  position: 'relative',
  transform: 'rotate(-5deg)',
};
const bookCoverStyle = {
  width: '100%',
  height: '100%',
  backgroundColor: PRIMARY_COLOR,
  borderRadius: '2px 4px 4px 2px',
  position: 'absolute',
  zIndex: 2,
  boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
};
const bookPagesStyle = {
  width: '90%',
  height: '92%',
  backgroundColor: '#F1F8E9',
  position: 'absolute',
  top: '4%',
  left: '8%',
  borderRadius: '0px 2px 2px 0px',
  zIndex: 1,
  boxShadow: 'inset 1px 0 1px rgba(0, 0, 0, 0.05)',
};
const bookSpineStyle = {
  width: '5px',
  height: '100%',
  backgroundColor: PRIMARY_COLOR_DARK,
  position: 'absolute',
  left: '-2px',
  top: 0,
  borderRadius: '1px 0 0 1px',
  zIndex: 3,
};
const bookstoreLogoTextStyle = {
  fontSize: '20px',
  fontWeight: 700,
  color: PRIMARY_COLOR_DARK,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  lineHeight: 1,
};

const BookstoreLogo = () => (
  <div style={bookstoreLogoContainerStyle}>
    <div style={bookstoreLogoIconStyle}>
      <div style={bookCoverStyle}></div>
      <div style={bookPagesStyle}></div>
      <div style={bookSpineStyle}></div>
    </div>
    <span style={bookstoreLogoTextStyle}>BOOKSTORE</span>
  </div>
);

// --- Main Sidebar Component ---
const SidebarDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { roleCode, resetData } = useUser();

  // State to manage open submenus for hover effect
  const [openSubMenu, setOpenSubMenu] = useState(null);
  let hoverTimeout = null;

  const handleLogout = async () => {
    try {
      if (typeof logout === 'function') await logout();
      else console.warn("SidebarDashboard: logout function from useAuth is not defined.");
      if (typeof resetData === 'function') resetData();
      else console.warn("SidebarDashboard: resetData function from useUser is not defined.");
      toast.success("Đăng xuất thành công!");
      navigate("/");
    } catch (error) {
      console.error("SidebarDashboard: Logout error:", error);
      toast.error("Đăng xuất thất bại. Vui lòng thử lại.");
    }
  };

  const isSubMenuActive = (parentPath) => location.pathname.startsWith(parentPath);

  const handleMouseEnter = (label) => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setOpenSubMenu(label);
  };

  const handleMouseLeave = () => {
    hoverTimeout = setTimeout(() => {
      setOpenSubMenu(null);
    }, 200); // Delay to prevent closing if mouse briefly leaves and re-enters
  };

  const brandLogoAreaStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: SIDEBAR_WIDTH,
    height: LOGO_AREA_HEIGHT,
    padding: '0 24px',
    backgroundColor: BACKGROUND_COLOR,
    borderBottom: `1px solid ${BORDER_COLOR}`,
    zIndex: 1050,
    boxSizing: 'border-box',
  };

  const proSidebarStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    width: SIDEBAR_WIDTH,
    borderRight: 'none',
    backgroundColor: BACKGROUND_COLOR,
    zIndex: 1040,
    boxShadow: '0px 0px 30px 0px rgba(82,63,105,0.05)',
    boxSizing: 'border-box',
  };

  const menuWrapperStyle = {
    paddingTop: LOGO_AREA_HEIGHT,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
  };

  const scrollableMenuAreaStyle = {
    flexGrow: 1,
    overflowY: 'auto',
    padding: '10px 0',
  };

  const menuItemStylesConfig = {
    button: ({ level, active }) => {
      const isActive = active;
      const baseStyle = {
        margin: '4px 12px',
        borderRadius: '8px',
        transition: 'background-color 0.2s ease, color 0.2s ease',
        padding: '10px 15px',
      };

      if (level === 0) {
        return {
          ...baseStyle,
          color: isActive ? PRIMARY_COLOR_DARK : TEXT_COLOR_SECONDARY,
          backgroundColor: isActive ? PRIMARY_COLOR_VERY_LIGHT : 'transparent',
          fontWeight: isActive ? 600 : 500,
          '&:hover': {
            backgroundColor: PRIMARY_COLOR_VERY_LIGHT,
            color: PRIMARY_COLOR_DARK,
          },
        };
      }
      if (level > 0) {
        return {
          ...baseStyle,
          margin: '2px 12px 2px 25px',
          padding: '8px 15px',
          fontSize: '0.9rem',
          color: isActive ? PRIMARY_COLOR : TEXT_COLOR_SECONDARY,
          backgroundColor: isActive ? PRIMARY_COLOR_VERY_LIGHT : 'transparent',
          fontWeight: isActive ? 500 : 400,
          '&:hover': {
            backgroundColor: PRIMARY_COLOR_VERY_LIGHT,
            color: PRIMARY_COLOR,
          },
        };
      }
    },
    SubMenuExpandIcon: {
      color: TEXT_COLOR_SECONDARY,
    },
  };
  
  const logoutMenuItemStyle = {
    margin: '10px 12px',
    borderRadius: '8px',
    padding: '10px 15px',
    borderTop: `1px solid ${BORDER_COLOR}`,
    marginTop: 'auto',
  };

  const renderSubMenu = (label, icon, items, defaultOpenPath) => {
    const subMenuId = label.replace(/\s+/g, '-').toLowerCase(); // Unique ID for state
    return (
      <div
        onMouseEnter={() => handleMouseEnter(subMenuId)}
        onMouseLeave={handleMouseLeave}
      >
        <SubMenu
          label={label}
          icon={icon}
          open={openSubMenu === subMenuId || isSubMenuActive(defaultOpenPath)}
          // onOpenChange={(isOpen) => !isOpen && openSubMenu === subMenuId && setOpenSubMenu(null)} // Optional: handle click to close
        >
          {items.map(item => (
            <MenuItem
              key={item.to}
              icon={item.icon}
              component={<Link to={item.to} />}
              active={location.pathname === item.to}
            >
              {item.label}
            </MenuItem>
          ))}
        </SubMenu>
      </div>
    );
  };


  return (
    <aside className="left-sidebar">
      <div
        className="d-flex align-items-center justify-content-between"
        style={brandLogoAreaStyle}
      >
        <Link to="/dashboard" className="text-nowrap logo-img">
          <BookstoreLogo />
        </Link>
        <div className="close-btn d-xl-none d-block sidebartoggler cursor-pointer" id="sidebarCollapse">
          <i className="ti ti-x fs-8"></i>
        </div>
      </div>

      <nav className="sidebar-nav">
        <Sidebar
          style={proSidebarStyle}
          breakPoint="lg"
        >
          <Menu
            style={menuWrapperStyle}
            menuItemStyles={menuItemStylesConfig}
          >
            <div style={scrollableMenuAreaStyle}>
              {roleCode === "ADMIN" && (
                <MenuItem
                  icon={<IconLayoutDashboard size={20} stroke={1.5} />}
                  component={<Link to="/dashboard" />}
                  active={location.pathname === "/dashboard"}
                >
                  Trang chủ
                </MenuItem>
              )}
              <MenuItem
                icon={<IconShoppingCart size={20} stroke={1.5} />}
                component={<Link to="/dashboard/order-counter" />}
                active={location.pathname === "/dashboard/order-counter"}
              >
                Bán hàng tại quầy
              </MenuItem>

              {renderSubMenu("Quản lý sản phẩm", <IconArchive size={20} stroke={1.5} />, [
                { to: "/dashboard/product", label: "Danh sách sản phẩm", icon: <IconListDetails size={18} stroke={1.5} /> },
                { to: "/dashboard/author", label: "Tác giả", icon: <IconUserEdit size={18} stroke={1.5} /> },
                { to: "/dashboard/publisher", label: "Nhà xuất bản", icon: <IconBuildingStore size={18} stroke={1.5} /> },
                { to: "/dashboard/distributor", label: "Nhà phát hành", icon: <IconBuildingFactory2 size={18} stroke={1.5} /> },
                { to: "/dashboard/branch", label: "Thể loại", icon: <IconCategory size={18} stroke={1.5} /> },
                { to: "/dashboard/type", label: "Gói", icon: <IconPackage size={18} stroke={1.5} /> },
                { to: "/dashboard/catalog", label: "Danh mục", icon: <IconClipboardList size={18} stroke={1.5} /> },
              ], "/dashboard/product")}


              {renderSubMenu("Quản lý tài khoản", <IconUsers size={20} stroke={1.5} />, [
                { to: "/dashboard/accounts", label: "Khách hàng", icon: <IconUser size={18} stroke={1.5} /> },
                ...(roleCode === "ADMIN" ? [{ to: "/dashboard/employee", label: "Nhân viên", icon: <IconUserShield size={18} stroke={1.5} /> }] : [])
              ], "/dashboard/accounts")}


              {roleCode === "ADMIN" && renderSubMenu("Quản lý khuyến mại", <IconDiscount2 size={20} stroke={1.5} />, [
                { to: "/dashboard/coupon", label: "Phiếu giảm giá", icon: <IconTicket size={18} stroke={1.5} /> },
                { to: "/dashboard/discount", label: "Chương trình khuyến mãi", icon: <IconGift size={18} stroke={1.5} /> },
              ], "/dashboard/coupon")}

              {renderSubMenu("Quản lý đơn hàng", <IconTruckDelivery size={20} stroke={1.5} />, [
                { to: "/dashboard/order", label: "Đơn hàng", icon: <IconClipboardText size={18} stroke={1.5} /> },
              ], "/dashboard/order")}


              {roleCode === "ADMIN" && renderSubMenu("Quản lý cấu hình", <IconSettings size={20} stroke={1.5} />, [
                { to: "/dashboard/role", label: "Phân quyền", icon: <IconKey size={18} stroke={1.5} /> },
                { to: "/dashboard/payment", label: "Thanh toán", icon: <IconCreditCard size={18} stroke={1.5} /> },
                { to: "/dashboard/delivery", label: "Vận chuyển", icon: <IconShip size={18} stroke={1.5} /> },
              ], "/dashboard/role")}
            </div>

            <MenuItem
              icon={<IconLogout2 size={20} stroke={1.5} />}
              onClick={handleLogout}
              style={{
                ...logoutMenuItemStyle,
                color: TEXT_COLOR_SECONDARY,
              }}
            >
              Đăng xuất
            </MenuItem>
          </Menu>
        </Sidebar>
      </nav>
    </aside>
  );
};

export default SidebarDashboard;