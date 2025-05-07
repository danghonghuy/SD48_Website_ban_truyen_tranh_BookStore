import useVnPay from "@api/useVnPay";
import useUser from "@store/useUser";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

function formatCurrencyVND(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
} 
const CartTotal = () => {
  const totalCost = useSelector((state) => state.products.totalCost);
  const t = useUser();


  const { createPaymentUrl } = useVnPay();

  const handleCallVnPay = async () => {
    const { success, data } = await createPaymentUrl({
      orderType: "order", 
      amount: totalCost, 
      orderDescription: "order", 
      name: "order"
    });
    if (data.status == "Error") {
         toast.error(data.message);
    } else {
      window.location.href = data.data; 
      toast.success(data.message);
    }
  };

  return (
    <>
      <div class="row g-4 justify-content-end">
        <div class="col-8"></div>
        <div class="col-sm-8 col-md-7 col-lg-6 col-xl-4">
          <div class="bg-light rounded">
            <div class="p-4">
              <h1 class="display-6 mb-4">
                Cart <span class="fw-normal">Total</span>
              </h1>
              {/* <div class="d-flex justify-content-between mb-4">
                <h5 class="mb-0 me-4">Subtotal:</h5>
                <p class="mb-0">{formatCurrencyVND(totalCost)}</p>
              </div> */}
            </div>
            <div class="py-4 mb-4 border-top border-bottom d-flex justify-content-between">
              <h5 class="mb-0 ps-4 me-4">Total</h5>
              <p class="mb-0 pe-4">{formatCurrencyVND(totalCost)}</p>
            </div>

            {/* <button
                class="btn border-secondary rounded-pill px-4 py-3 text-primary text-uppercase mb-4 ms-4"
                type="button"
                onClick={() => handleCallVnPay()}
              >
                Proceed Checkout
              </button> */}

            {t.username ? (
            <Link to="/checkout">
              <button
                class="btn border-secondary rounded-pill px-4 py-3 text-primary text-uppercase mb-4 ms-4"
                type="button"
              >
                Proceed Checkout
              </button>
            </Link>
              ) : (
                <Link to="/login">
              <button
                class="btn border-secondary rounded-pill px-4 py-3 text-primary text-uppercase mb-4 ms-4"
                type="button"
              >
                Proceed Checkout
              </button>
            </Link>
              )}


            
          </div>
        </div>
      </div>
    </>
  );
};

export default CartTotal;
