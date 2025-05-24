import useProduct from "@api/useProduct";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CardItem from "components/CardItem/CardItem"; // Giả sử đây là CardItem hiển thị sản phẩm dạng card

const BestSaleProduct = () => {
  const [bestSale, setBestSale] = useState([]);
  const { getBestSale } = useProduct();

  const fetchProduct = async () => {
    const { success, data: apiResponse } = await getBestSale({ status: 1 });

    // console.log("BestSaleProduct - API Response:", apiResponse); // Bật lại nếu cần debug API

    if (apiResponse && apiResponse.data) {
      // console.log("BestSaleProduct - Products to set (apiResponse.data):", apiResponse.data); // Bật lại nếu cần debug
      setBestSale(apiResponse.data);
    } else if (apiResponse && apiResponse.message) {
      toast.error(apiResponse.message);
    } else if (!success) {
      toast.error("Có lỗi xảy ra khi tải sản phẩm bán chạy.");
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []); // Nên thêm fetchProduct vào dependency array nếu ESLint báo warning, nhưng vì nó không thay đổi, có thể bỏ qua.

  return (
    <>
      <div className="container-fluid">
        <div className="container py-5">
          <div className="text-left mb-5" style={{ maxWidth: "43.75rem" }}>
            <h3 className="display-6">Top 5 truyện bán chạy nhất</h3>
          </div>
          <div className="row g-4 justify-content-center">
           {bestSale.slice(0, 5).map((item) => {
  const originalPrice = parseFloat(item.price) || 0;
  let amountSaved = 0;
  let finalPrice = originalPrice;
  let percentDiscount = 0;

  if (item.discountDTO) {
    percentDiscount = parseFloat(item.discountDTO.percent) || 0;
    const moneyDiscount = parseFloat(item.discountDTO.moneyDiscount) || 0;

    if (percentDiscount > 0) {
      amountSaved = (originalPrice * percentDiscount) / 100;
    } else if (moneyDiscount > 0) {
      amountSaved = moneyDiscount;
    }

    // Không cho giảm quá giá gốc
    if (amountSaved > originalPrice) amountSaved = originalPrice;
    if (amountSaved < 0.01) amountSaved = 0;

    finalPrice = originalPrice - amountSaved;
  }

  return (
    <CardItem
      imgSrc={item.images && item.images[0]?.imageUrl}
      key={item.id}
      id={item.id}
      name={item.name}
      description={item.description}
      price={originalPrice}        // Giá gốc
      discount={amountSaved}       // Số tiền giảm
      finalPrice={finalPrice}      // Giá sau giảm
      percentDiscount={percentDiscount} // Phần trăm giảm giá (nếu có)
      stock={item.stock}
    />
  );
})}
          </div>
        </div>
      </div>
    </>
  );
};

export default BestSaleProduct;