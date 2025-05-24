import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { applyCoupon } from "../../services/redux/cartSlice/productSlice";

const CouponInput = () => {
  const coupon_old = useSelector((state) => state.products.coupon);
  const [coupon, setCoupon] = useState(coupon_old);
  const dispatch = useDispatch();

  const handleApplyCouponClick = () => {
    if (coupon.length === 0) {
      return;
    }
    dispatch(applyCoupon({ coupon }));
  };
  return (
    <>
      <div class="mt-5">
        {/* <input
          type="text"
          class="border-0 border-bottom rounded me-5 py-3 mb-4"
          placeholder="Coupon Code"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
        />
        <button
          class="btn border-secondary rounded-pill px-4 py-3 text-primary"
          type="button"
          onClick={handleApplyCouponClick}
        >
          Apply Coupon
        </button> */}
      </div>
    </>
  );
};

export default CouponInput;
