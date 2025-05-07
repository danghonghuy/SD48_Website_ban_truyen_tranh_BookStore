import React from "react";

import BestSaleProduct from "./components/BestSaleProduct/BestSaleProduct";
import RunningOutProduct from "./components/RunningOutProduct/RunningOutProduct";

const Home = () => {
  return (
    <>
      <div class="container-fluid page-header py-5">
        <h1 class="text-center text-white display-6">Book Store</h1>
      </div>
      <BestSaleProduct />
      <RunningOutProduct />
    </>
  );
};

export default Home;
