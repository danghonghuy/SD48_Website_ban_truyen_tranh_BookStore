import CartItem from "@components/CartItem/CartItem";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";


const CardItemList = () => {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.products.productList);




  console.log(productList);
  return (
    <>
      <tbody>
        {productList.map((product) => (
          <CartItem
            key={product.id}
            id={product.id}
            imgSrc={product.imgSrc}
            name={product.name}
            price={product.price}
            count={product.count}
          />
        ))}
      </tbody>
    </>
  );
};

export default CardItemList;
