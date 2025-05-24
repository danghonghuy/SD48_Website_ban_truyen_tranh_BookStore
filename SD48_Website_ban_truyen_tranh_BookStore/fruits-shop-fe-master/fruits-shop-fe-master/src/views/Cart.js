import CardItemList from "@components/CartItemList/CardItemList";
import CartTotal from "@components/CartTotal/CartTotal";
import CouponInput from "@components/CouponInput/CouponInput";
import React from "react";

const Cart = () => {
  return (
    <>
      <div className="container-fluid page-header py-5">
        <h1 className="text-center text-white display-6">Giỏ Hàng</h1>
        <ol className="breadcrumb justify-content-center mb-0">
          <li className="breadcrumb-item">
            <a href="/">Trang Chủ</a>
          </li>
          <li className="breadcrumb-item">
            <a href="#">Trang</a>
          </li>
          <li className="breadcrumb-item active text-white">Giỏ Hàng</li>
        </ol>
      </div>

      <div className="container-fluid py-5">
        <div className="container py-5">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Sản Phẩm</th>
                  <th scope="col">Tên</th>
                  <th scope="col">Giá</th>
                  <th scope="col">Số Lượng</th>
                  <th scope="col">Tổng Cộng</th>
                  <th scope="col">Hành Động</th>
                </tr>
              </thead>
              <CardItemList />
            </table>
          </div>

          <CouponInput />

          <CartTotal />
        </div>
      </div>
    </>
  );
};

export default Cart;