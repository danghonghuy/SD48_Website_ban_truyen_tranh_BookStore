// src/configs/useRoutes.config.js
import React from "react";
import useTranslate from "@lang";
import Layout from "@views/layouts/Layout";
import Login from "@views/components/Login/Login";
import Home from "@views/Home";
import ProductDetail from "@views/components/ProductDetail/ProductDetail";
import LayoutClient from "@views/layouts/LayoutClient";
import Shop from "@views/Shop";
import Cart from "@views/Cart";
import Register from "@views/components/Login/Register";
import Contact from "@views/Contact";
import Dashboard from "@views/components/Dashboard/Dashboard";
import Checkout from "@views/components/Checkout/Checkout";
import ForgotPass from "@views/components/Login/ForgotPass";
import ResetPass from "@views/components/Login/ResetPass";
import LayoutUser from "@views/layouts/LayoutUser";
import ProfileUser from "@views/components/ProfileUser/ProfileUser";
import History from "@views/components/History/History";
import ProductManager from "@views/components/Dashboard/ProductManager/ProductManager";
import BranchManager from "@views/components/Dashboard/BranchManager/BranchManager";
import OrderManager from "@views/components/Dashboard/OrderManager/OrderManager";
import ManagerUser from "@views/components/ManagerUser/ManagerUser";
import ProductTypeManager from "@views/components/Dashboard/ProductType/ProductTypeManager";
import RoleManager from "@views/components/Dashboard/RoleManager/RoleManager";
import PaymentManager from "@views/components/Dashboard/PaymentManager/PaymentManager";
import CatalogManager from "@views/components/Dashboard/CatalogManager/CatalogManager";
import DiscountManager from "@views/components/Dashboard/DiscountManager/DiscountManager";
import CouponManager from "@views/components/Dashboard/CouponManager/CouponManager";
import EmployeeManager from "@views/components/Dashboard/EmployeeManager/EmployeeManager";
import RollbackOrderManager from "@views/components/Dashboard/RoleManager/RollbackOrderManager/RollbackOrderManager"; // Đã sửa đường dẫn
import DeliveryManager from "@views/components/Dashboard/DeliveryManager/DeliveryManager";
import OrderCounter from "@views/components/Dashboard/OrderManager/OrderCounter";
import OrderDetail from "@views/components/Dashboard/OrderManager/OrderDetail";
import ResetPassClient from "views/components/Login/ResetPassClient";
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermsOfUse from '../pages/TermsOfUse';
import SalesAndRefunds from '../pages/SalesAndRefunds';
import AuthorManager from "@views/components/Dashboard/AuthorManager/AuthorManager";
import PublisherManager from "@views/components/Dashboard/PublisherManager/PublisherManager";
import DistributorManager from "@views/components/Dashboard/DistributorManager/DistributorManager";

const useRoutes = () => {
  const t = useTranslate();
  const publicRoutes = [
    {
      key: "home-client",
      label: t("home").toCapitalize(),
      path: "/",
      index: true,
      element: (
        <LayoutClient>
          <Home />
        </LayoutClient>
      ),
    },
    {
      key: "shop-client",
      label: t("product").toCapitalize(),
      path: "/shop",
      element: (
        <LayoutClient>
          <Shop />
        </LayoutClient>
      ),
    },
    {
      key: "product-detail-client",
      label: t("product").toCapitalize(),
      path: "/product/:id",
      element: (
        <LayoutClient>
          <ProductDetail />
        </LayoutClient>
      ),
    },
    {
      key: "cart-client",
      label: t("cart").toCapitalize(),
      path: "/cart",
      element: (
        <LayoutClient>
          <Cart />
        </LayoutClient>
      ),
    },
    {
      key: "login-client",
      label: t("login").toCapitalize(),
      path: "/login",
      element: (
        <LayoutClient>
          <Login />
        </LayoutClient>
      ),
    },
    {
      key: "register-client",
      label: t("register").toCapitalize(),
      path: "/register",
      element: (
        <LayoutClient>
          <Register />
        </LayoutClient>
      ),
    },
    {
      key: "contact-client",
      label: t("contact").toCapitalize(),
      path: "/contact",
      element: (
        <LayoutClient>
          <Contact />
        </LayoutClient>
      ),
    },
    {
      key: "forgot-pass-client",
      label: "ForgotPass",
      path: "/forgot-pass",
      element: (
        <LayoutClient>
          <ForgotPass />
        </LayoutClient>
      ),
    },
    {
      key: "privacy-policy-page",
      label: "Chính sách bảo mật",
      path: "/chinh-sach-bao-mat",
      element: (
        <LayoutClient>
          <PrivacyPolicy />
        </LayoutClient>
      ),
    },
    {
      key: "terms-of-use-page",
      label: "Điều khoản sử dụng",
      path: "/dieu-khoan-su-dung",
      element: (
        <LayoutClient>
          <TermsOfUse />
        </LayoutClient>
      ),
    },
    {
      key: "sales-and-refunds-page",
      label: "Bán hàng và Hoàn tiền",
      path: "/ban-hang-va-hoan-tien",
      element: (
        <LayoutClient>
          <SalesAndRefunds />
        </LayoutClient>
      ),
    },
    {
      key: "reset-pass-client-token",
      label: "ResetPass",
      path: "/reset-pass",
      element: (
        <LayoutClient>
          <ResetPass />
        </LayoutClient>
      ),
    },
    {
      key: "checkout-client",
      label: t("checkout").toCapitalize(),
      path: "/checkout",
      element: (
        <LayoutClient>
          <Checkout />
        </LayoutClient>
      ),
    },
  ];

  const privateRoutes = [
    {
      key: "admin-dashboard-home",
      label: "Dashboard Admin",
      path: "/dashboard",
      index: true, 
      element: (
        <Layout>
          <Dashboard />
        </Layout>
      ),
    },
    {
      key: "admin-product-list",
      label: "Product Manager",
      path: "/dashboard/product",
      element: (
        <Layout>
          <ProductManager />
        </Layout>
      ),
    },
    {
      key: "admin-author-manager",
      label: "Author Manager",
      path: "/dashboard/author",
      element: (
        <Layout>
          <AuthorManager />
        </Layout>
      ),
    },
    {
      key: "admin-publisher-manager",
      label: "Publisher Manager",
      path: "/dashboard/publisher",
      element: (
        <Layout>
          <PublisherManager />
        </Layout>
      ),
    },
    {
      key: "admin-distributor-manager",
      label: "Distributor Manager",
      path: "/dashboard/distributor",
      element: (
        <Layout>
          <DistributorManager />
        </Layout>
      ),
    },
    {
      key: "admin-branch-manager",
      label: "Branch Manager",
      path: "/dashboard/branch",
      element: (
        <Layout>
          <BranchManager />
        </Layout>
      ),
    },
    {
      key: "admin-catalog-manager",
      label: "Catalog Manager",
      path: "/dashboard/catalog",
      element: (
        <Layout>
          <CatalogManager />
        </Layout>
      ),
    },
    {
      key: "admin-product-type-manager",
      label: "Product Type Manager",
      path: "/dashboard/type",
      element: (
        <Layout>
          <ProductTypeManager />
        </Layout>
      ),
    },
    {
      key: "admin-accounts-manager",
      label: "Accounts Manager",
      path: "/dashboard/accounts",
      element: (
        <Layout>
          <ManagerUser />
        </Layout>
      ),
    },
    {
      key: "admin-employee-manager",
      label: "Employee Manager",
      path: "/dashboard/employee",
      element: (
        <Layout>
          <EmployeeManager />
        </Layout>
      ),
    },
    {
      key: "admin-order-manager",
      label: "Order Manager",
      path: "/dashboard/order",
      element: (
        <Layout>
          <OrderManager />
        </Layout>
      ),
    },
    {
      key: "admin-order-counter",
      label: "OrderCounter",
      path: "/dashboard/order-counter",
      element: (
        <Layout>
          <OrderCounter />
        </Layout>
      ),
    },
    {
      key: "admin-order-detail-page",
      label: "Order Detail Page",
      path: "/dashboard/order-detail/:id",
      element: (
        <Layout>
          <OrderDetail />
        </Layout>
      ),
    },
    {
      key: "admin-rollback-order",
      label: "Rollback Order",
      path: "/dashboard/rollback-order",
      element: (
        <Layout>
          <RollbackOrderManager />
        </Layout>
      ),
    },
    {
      key: "admin-discount-manager",
      label: "Discount Manager",
      path: "/dashboard/discount",
      element: (
        <Layout>
          <DiscountManager />
        </Layout>
      ),
    },
    {
      key: "admin-coupon-manager",
      label: "Coupon Manager",
      path: "/dashboard/coupon",
      element: (
        <Layout>
          <CouponManager />
        </Layout>
      ),
    },
    {
      key: "admin-role-manager",
      label: "Role Manager",
      path: "/dashboard/role",
      element: (
        <Layout>
          <RoleManager />
        </Layout>
      ),
    },
    {
      key: "admin-payment-manager",
      label: "Payment Manager",
      path: "/dashboard/payment",
      element: (
        <Layout>
          <PaymentManager />
        </Layout>
      ),
    },
    {
      key: "admin-delivery-manager",
      label: "Delivery Manager",
      path: "/dashboard/delivery",
      element: (
        <Layout>
          <DeliveryManager />
        </Layout>
      ),
    },
    {
      key: "user-profile-dashboard",
      label: "User Profile",
      path: "/dashboard/user-profile",
      element: (
        <LayoutUser>
          <ProfileUser />
        </LayoutUser>
      ),
    },
    {
      key: "user-history-cart-dashboard",
      label: "History Cart",
      path: "/dashboard/history-cart",
      element: (
        <LayoutUser>
          <History />
        </LayoutUser>
      ),
    },
    {
      key: "user-reset-pass-dashboard",
      label: "Reset Password (User)",
      path: "/dashboard/reset-password",
      element: (
        <LayoutUser>
          <ResetPassClient />
        </LayoutUser>
      ),
    },
  ];

  return {
    publicRoutes,
    privateRoutes,
  };
};

export default useRoutes;