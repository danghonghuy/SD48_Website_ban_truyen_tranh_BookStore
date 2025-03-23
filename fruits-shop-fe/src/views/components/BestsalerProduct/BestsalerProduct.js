import useProduct from "@api/useProduct";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import fruit from '../../../assets/img/best-product-6.jpg'

function formatCurrencyVND(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
} 

const BestsalerProduct = () => {
  const [bestSale, setBestSale] = useState([]);
  const { getBestSale} = useProduct();


  const fetchProduct = async () => {
    const {success,data} = await getBestSale({});
    if(success && data.message != "Error") {
      setBestSale(data.data)
    } else {
      toast.error(data.message)
    }
  }


  useEffect(() => {
   fetchProduct()
  }, [])
  return (
    <>
      <div class="container-fluid py-5">
        <div class="container py-5">
          <div class="text-center mx-auto mb-5" style={{ maxWidth: "43.75rem" }}>
            <h1 class="display-4">Bestseller Products</h1>
            <p>
              Latin words, combined with a handful of model sentence structures,
              to generate Lorem Ipsum which looks reasonable.
            </p>
          </div>
          <div class="row g-4">

            {
              bestSale.slice(0,6).map((items,index)=> {

                return (
                  <div class="col-lg-6 col-xl-4">
                  <div class="p-4 rounded bg-light">
                    <div class="row align-items-center">
                      <div class="col-6">
                        <img
                          src={items.listFile.length > 0 ? items.listFile[0].fileName : fruit}
                          class="img-fluid rounded-circle w-100"
                          alt=""
                        />
                      </div>
                      <div class="col-6">
                        <Link to={`/product/${items.id}`} class="h5">
                          {items.productName}
                        </Link>
                        <div class="d-flex my-3">
                          <i class="fas fa-star text-primary"></i>
                          <i class="fas fa-star text-primary"></i>
                          <i class="fas fa-star text-primary"></i>
                          <i class="fas fa-star text-primary"></i>
                          <i class="fas fa-star"></i>
                        </div>
                        <h4 class="mb-3">{formatCurrencyVND(items.prodcutPrice)}</h4>
                        <a
                          href="#"
                          class="btn border border-secondary rounded-pill px-3 text-primary"
                        >
                          <i class="fa fa-shopping-bag me-2 text-primary"></i> Add
                          to cart
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                )
              })
            }
           
            
            {
              bestSale.slice(6,10).map((items,index) => {
                return  (
                  <div class="col-md-6 col-lg-6 col-xl-3">
                  <div class="text-center">
                      <img
                        src={items.listFile.length > 0 ? items.listFile[0].fileName : fruit}
                      class="img-fluid rounded"
                      alt=""
                    />
                    <div class="py-4">
                      <a href="#" class="h5">
                        {items.productName}
                      </a>
                      <div class="d-flex my-3 justify-content-center">
                        <i class="fas fa-star text-primary"></i>
                        <i class="fas fa-star text-primary"></i>
                        <i class="fas fa-star text-primary"></i>
                        <i class="fas fa-star text-primary"></i>
                        <i class="fas fa-star"></i>
                      </div>
                      <h4 class="mb-3">  {items.prodcutPrice} $</h4>
                      <a
                        href="#"
                        class="btn border border-secondary rounded-pill px-3 text-primary"
                      >
                        <i class="fa fa-shopping-bag me-2 text-primary"></i> Add to
                        cart
                      </a>
                    </div>
                  </div>
                </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default BestsalerProduct;
