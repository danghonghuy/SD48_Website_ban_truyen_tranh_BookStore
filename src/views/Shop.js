import React from "react";
import ShopList from "./components/ShopList/ShopList";

const Shop = () => {
  return (
    <>
      <div class="container-fluid page-header py-5">
        <h1 class="text-center text-white display-6">Cửa hàng</h1>
        <ol class="breadcrumb justify-content-center mb-0">
          <li class="breadcrumb-item">
            <a href="#">Trang chủ</a>
          </li>
          <li class="breadcrumb-item active text-white">Cửa hàng</li>
        </ol>
      </div>

      <ShopList />
    </>
  );
};

export default Shop;
