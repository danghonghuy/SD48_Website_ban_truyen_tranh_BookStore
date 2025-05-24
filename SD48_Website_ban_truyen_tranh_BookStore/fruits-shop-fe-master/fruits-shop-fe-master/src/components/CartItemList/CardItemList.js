import CartItem from "@components/CartItem/CartItem";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useProduct from "@api/useProduct";

const CardItemList = () => {
  const { getById } = useProduct();
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const productList = useSelector((state) => state.products.productList);

  useEffect(() => {
    const fetchProducts = async () => {
      const responses = await Promise.all(
        productList.map((item) => getById(item.id))
      );

      const clean = responses
        .filter((res) => res.success && res.data?.success)
        .map((res) => res.data.data);

      setProducts(clean);
    };

    if (productList.length >= 0) {
      fetchProducts();
    }
  }, [productList]);
  return (
    <>
      <tbody>
        {products.map((product, index) => (
          <CartItem
            key={product.id}
            id={product.id}
            imgSrc={product?.images?.[0]?.imageUrl}
            name={product.name}
            price={
              product.discountDTO
                ? product.price -
                  (product.discountDTO.percent
                    ? (product.price * product.discountDTO.percent) / 100
                    : product.discountDTO.moneyDiscount)
                : product.price
            }
            count={productList?.[index]?.count}
            stock={product.stock}
          />
        ))}
      </tbody>
    </>
  );
};

export default CardItemList;
