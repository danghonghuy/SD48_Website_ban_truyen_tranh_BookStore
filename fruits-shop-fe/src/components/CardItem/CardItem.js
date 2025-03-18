import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProductToCart } from "../../services/redux/cartSlice/productSlice";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
const CardItem = ({ id, imgSrc, name, description, price }) => {
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
                price,
                count: 1,
            }),
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
                            }}
                            src={imgSrc}
                            className="img-fluid w-100 rounded-top"
                            alt=""
                        />
                    </div>
                    {/* <div
          className="text-white bg-secondary px-3 py-1 rounded position-absolute"
          style={{ top: "10px", left: "10px" }}
        >
          Fruits
        </div> */}
                    <div className="p-4 border border-secondary border-top-0 rounded-bottom">
                        {/* <h4 style={{lineHeight:"48px"}}>{name}</h4> */}
                        <h4 style={{ height: "72px", color: "black" }}>
                            {name}
                        </h4>

                        {/* <p>{description}</p> */}
                        <div className="d-flex justify-content-between flex-lg-wrap">
                            <p className="text-dark fs-5 fw-bold mb-0">
                                {formatCurrencyVND(price)}
                            </p>
                            <div
                                className="btn border border-secondary rounded-pill px-3 text-primary"
                                onClick={handleAddToCart}
                            >
                                <i className="fa fa-shopping-bag me-2 text-primary"></i>{" "}
                                Add to cart
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default CardItem;
