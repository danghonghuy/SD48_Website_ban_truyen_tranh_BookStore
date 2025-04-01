import React, { useEffect, useState } from "react";
import useProduct from "@api/useProduct";

import ShopList from "./components/ShopList/ShopList";


const Home = () => {
  const [productbestSale, setProductSale] = useState([]);

  const {geta} = useProduct();
  return (
    <>
      <ShopList />
    </>
  );
};

export default Home;
