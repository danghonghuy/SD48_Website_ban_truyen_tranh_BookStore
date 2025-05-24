import React from "react";
import CheckoutForm from "../CheckoutForm/CheckoutForm";
import { Typography } from "antd";
const { Link } = Typography;

const Checkout = () => {
  return (
    <>
      <div className="container-fluid page-header no-margin py-5">
        <Link href="/checkout">
          <h1 className="text-center text-white display-6">Thanh Toán</h1>
        </Link>
        <ol className="breadcrumb justify-content-center mb-0">
          <li className="breadcrumb-item">
            <a href="/">Trang Chủ</a>
          </li>
          <li className="breadcrumb-item">
            <a href="/shop">Cửa Hàng</a>
          </li>
          <li className="breadcrumb-item active text-white">Thanh Toán</li>
        </ol>
      </div>

      <CheckoutForm />
    </>
  );
};

export default Checkout;