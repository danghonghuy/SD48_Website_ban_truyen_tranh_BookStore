import React from "react";
import CheckoutForm from "../CheckoutForm/CheckoutForm";
import Link from "antd/es/typography/Link";

const Checkout = () => {
  return (
    <>
      <div class="container-fluid page-header py-5">
        <Link to={"/checkout"}>
          <h1 class="text-center text-white display-6">Checkout</h1>
        </Link>
        <ol class="breadcrumb justify-content-center mb-0">
          <li class="breadcrumb-item">
            <a href="/">Home</a>
          </li>
          <li class="breadcrumb-item">
            <a href="/shop">Pages</a>
          </li>
          <li class="breadcrumb-item active text-white">Checkout</li>
        </ol>
      </div>

      <CheckoutForm />
    </>
  );
};

export default Checkout;
