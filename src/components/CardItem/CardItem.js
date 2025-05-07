import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProductToCart } from "../../services/redux/cartSlice/productSlice";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import { getMediaUrl } from "@constants/commonFunctions";
const CardItem = ({
  id,
  imgSrc,
  name,
  description,
  price,
  discount,
  stock,
}) => {
  const dispatch = useDispatch();

  function formatCurrencyVND(amount) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }

  const handleAddToCart = () => {
    dispatch(
      addProductToCart({
        id,
        imgSrc,
        name,
        description,
        price: discount ? price - discount : price,
        count: 1,
        stock,
      })
    );
  };
  return (
    <div className="col-md-6 col-lg-6 col-xl-3">
      <Link to={`/product/${id}`}>
        <div className="rounded position-relative frute-item">
          <div className="fruite-img">
            <img
              style={{
                borderTop: "1px solid #FFC75A",
                borderLeft: "1px solid #FFC75A",
                borderRight: "1px solid #FFC75A",
                width: "300px",
                height: "209.8px",
                objectFit: "contain",
                padding: "10px",
              }}
              src={getMediaUrl(imgSrc)}
              className="img-fluid w-100 rounded-top"
              alt=""
            />
          </div>
          <div className="p-4 border border-secondary border-top-0 rounded-bottom">
            <h4 style={{ color: "gray", fontSize: "20px" }}>{name}</h4>
            <br />
            {discount ? (
              <div className="d-flex gap-2 justify-content-start">
                <p className="text-dark fs-10 fw-bold mb-0 text-decoration-line-through">
                  {formatCurrencyVND(price)}
                </p>
                <p className="text-dark fs-10 fw-bold mb-0 fs-4">
                  {formatCurrencyVND(price - discount)}
                </p>
              </div>
            ) : (
              <p className="text-dark fs-10 fw-bold mb-0 fs-4">
                {formatCurrencyVND(price)}
              </p>
            )}
            <div className="d-flex justify-content-center mt-2">
              {stock > 0 ? (
                <div
                  className="btn border border-secondary rounded-pill px-3 text-primary"
                  onClick={handleAddToCart}
                >
                  <i className="fa fa-shopping-bag me-2 text-primary"></i> Thêm
                  vào giỏ hàng
                </div>
              ) : (
                <div className="btn border border-secondary rounded-pill px-3 text-primary">
                  Hết hàng
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CardItem;
