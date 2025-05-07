import useProduct from "@api/useProduct";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CardItem from "components/CardItem/CardItem";

const RunningOutProduct = () => {
  const [runningOut, setRunningOut] = useState([]);
  const { getRunningOut } = useProduct();

  const fetchProduct = async () => {
    const { success, data } = await getRunningOut({});
    if (data) {
      setRunningOut(data.data);
    } else {
      toast.error(data?.message);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);
  return (
    <>
      <div class="container-fluid">
        <div class="container py-5">
          <div class="text-left mb-5" style={{ maxWidth: "43.75rem" }}>
            <h3 class="display-6">Top 5 sản phẩm sắp hết hàng</h3>
          </div>
          <div class="row g-4 justify-content-center">
            {runningOut.slice(0, 6).map((items, index) => {
              return (
                <CardItem
                  imgSrc={items.images && items.images[0]?.imageUrl}
                  key={items.id}
                  id={items.id}
                  name={items.name}
                  description={items.description}
                  price={items.price}
                  discount={
                    items.discountDTO &&
                    (items.discountDTO.percent
                      ? (items.price * items.discountDTO.percent) / 100
                      : items.discountDTO.moneyDiscount)
                  }
                  stock={items.stock}
                />
              );
            })}

            {runningOut.slice(6, 10).map((items, index) => {
              return (
                <CardItem
                  imgSrc={items.images && items.images[0]?.imageUrl}
                  key={items.id}
                  id={items.id}
                  name={items.name}
                  description={items.description}
                  price={items.price}
                  discount={
                    items.discountDTO &&
                    (items.discountDTO.percent
                      ? (items.price * items.discountDTO.percent) / 100
                      : items.discountDTO.moneyDiscount)
                  }
                  stock={items.stock}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default RunningOutProduct;
