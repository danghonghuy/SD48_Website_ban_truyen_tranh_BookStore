import useOrder from "@api/useOrder";
import { validateChangeAndBlurInput } from "@utils/validateChangeAndBlurInput";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { CHOXACNHAN } from "../../../constants/orderStatusConstant";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import useUser from "@store/useUser";
import { deleteProductFromCart } from "../../../../src/services/redux/cartSlice/productSlice";
import useVnPay from "@api/useVnPay";

function formatCurrencyVND(amount) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);
}

const CheckoutForm = () => {
    const productList = useSelector((state) =>
        state.products.productList.map((items) => {
            return {
                price: items.price,
                imgSrc: items.imgSrc,
                count: items.count,
                ProductId: items.id,
                name: items.name,
            };
        }),
    );
    const dispatch = useDispatch();
    const totalCost = useSelector((state) => state.products.totalCost);

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
        // toast.success(data.message);
      }
    };

    const { create } = useOrder();
    const { token } = useUser();

    const [totalPriceAfterAddShipping, setTotalPriceAfterAddShipping] =
        useState(totalCost);
    const [formData, setFormData] = useState({
        firstName: "",
        address: "",
        mobile: "",
        email: "",
        createAccount: false,
        shipToDifferentAddress: false,
        totalPrice: totalCost,
        Carts: productList,
        Status: CHOXACNHAN,
        UserId: jwtDecode(token).user_id,
    });

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));
    };
    const navigate = useNavigate();

    const [shippingCost, setShippingCost] = useState(0);

    const handleDeleteProduct = (id) => {
        dispatch(
            deleteProductFromCart({
                id,
            }),
        );
    };
    const handleShippingChange = (event) => {
        const { id, checked } = event.target;
        let newShippingCost = shippingCost;

        switch (id) {
            case "Shipping-1":
                newShippingCost = checked ? newShippingCost : 0;
                break;
            case "Shipping-2":
                newShippingCost = checked
                    ? newShippingCost + 15
                    : newShippingCost - 15;
                break;
            case "Shipping-3":
                newShippingCost = checked
                    ? newShippingCost + 8
                    : newShippingCost - 8;
                break;
            default:
                break;
        }

        setShippingCost(newShippingCost);
    };

    useEffect(() => {
        setTotalPriceAfterAddShipping((+totalCost + shippingCost).toFixed(2));
        setFormData((prevData) => ({
            ...prevData,
            totalPrice: totalPriceAfterAddShipping,
        }));
    }, [shippingCost, totalPriceAfterAddShipping, totalCost]);

    //validate

    const validate = (values) => {
        const errors = {};

        if (!values.firstName) {
            errors.firstName = "Please enter your first name";
        } else if (values.firstName.length <= 3) {
            errors.firstName = "First name must be at least 3 characters";
        } else if (values.firstName.length >= 50) {
            errors.firstName = "First name must not exceed 50 characters";
        }

        if (!values.address) {
            errors.address = "Please enter your address";
        } else if (values.address.length <= 3) {
            errors.address = "Address must be at least 3 characters";
        } else if (values.address.length >= 200) {
            errors.address = "Address must not exceed 200 characters";
        }

        if (!values.email) {
            errors.email = "Please enter your email";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
            errors.email = "Invalid email address";
        }

        if (!values.mobile) {
            errors.mobile = "Please enter your phone number";
        } else if (!/^\d{10}$/.test(values.mobile)) {
            errors.mobile = "Invalid phone number";
        }

        return errors;
    };

    const formik = useFormik({
        initialValues: {
            firstName: "",
            address: "",
            email: "",
            mobile: "",
        },
        validate,
        onSubmit: () => {
            submitFormData();
        },
    });

    const submitFormData = async () => {
        const { success, data } = await create(formData);
        if (data.status !== "Error" && success) {
            toast.success("Đặt hàng thành công");
            productList.map((item) => {
                handleDeleteProduct(item.ProductId);
            });
            handleCallVnPay();
            // navigate("/shop");
        } else {
            toast.error("Có lỗi xảy ra");
        }
    };

    return (
        <div className="container-fluid py-5">
            <div className="container py-5">
                <h1 className="mb-4">Billing details</h1>
                <form onSubmit={formik.handleSubmit}>
                    <div className="row g-5">
                        <div className="col-md-12 col-lg-6 col-xl-7">
                            <div className="row">
                                <div className="col-md-12 col-lg-6">
                                    <div className="form-item w-100">
                                        <label className="form-label my-3">
                                            Full Name<sup>*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${
                                                formik.touched.firstName
                                                    ? formik.errors.firstName
                                                        ? "is-invalid"
                                                        : "is-valid"
                                                    : ""
                                            }`}
                                            name="firstName"
                                            value={formik.values.firstName}
                                            onChange={(e) => {
                                                handleInputChange(e);
                                                validateChangeAndBlurInput(
                                                    e,
                                                    "firstName",
                                                    formik,
                                                );
                                            }}
                                        />
                                        {formik.touched.firstName &&
                                        formik.errors.firstName ? (
                                            <div className="invalid-feedback">
                                                {formik.errors.firstName}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                            <div className="form-item">
                                <label className="form-label my-3">
                                    Address <sup>*</sup>
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${
                                        formik.touched.address
                                            ? formik.errors.address
                                                ? "is-invalid"
                                                : "is-valid"
                                            : ""
                                    }`}
                                    name="address"
                                    value={formik.values.address}
                                    onChange={(e) => {
                                        handleInputChange(e);

                                        validateChangeAndBlurInput(
                                            e,
                                            "address",
                                            formik,
                                        );
                                    }}
                                    placeholder="House Number Street Name"
                                />

                                {formik.touched.address &&
                                formik.errors.address ? (
                                    <div className="invalid-feedback">
                                        {formik.errors.address}
                                    </div>
                                ) : null}
                            </div>

                            <div className="form-item">
                                <label className="form-label my-3">
                                    Mobile<sup>*</sup>
                                </label>
                                <input
                                    type="tel"
                                    className={`form-control ${
                                        formik.touched.mobile
                                            ? formik.errors.mobile
                                                ? "is-invalid"
                                                : "is-valid"
                                            : ""
                                    }`}
                                    name="mobile"
                                    value={formik.values.mobile}
                                    onChange={(e) => {
                                        handleInputChange(e);
                                        validateChangeAndBlurInput(
                                            e,
                                            "mobile",
                                            formik,
                                        );
                                    }}
                                />

                                {formik.touched.mobile &&
                                formik.errors.mobile ? (
                                    <div className="invalid-feedback">
                                        {formik.errors.mobile}
                                    </div>
                                ) : null}
                            </div>
                            <div className="form-item">
                                <label className="form-label my-3">
                                    Email Address<sup>*</sup>
                                </label>
                                <input
                                    type="email"
                                    className={`form-control ${
                                        formik.touched.email
                                            ? formik.errors.email
                                                ? "is-invalid"
                                                : "is-valid"
                                            : ""
                                    }`}
                                    name="email"
                                    value={formik.values.email}
                                    onChange={(e) => {
                                        handleInputChange(e);
                                        validateChangeAndBlurInput(
                                            e,
                                            "email",
                                            formik,
                                        );
                                    }}
                                />

                                {formik.touched.email && formik.errors.email ? (
                                    <div className="invalid-feedback">
                                        {formik.errors.email}
                                    </div>
                                ) : null}
                            </div>
                            <hr />

                            <button
                                type="submit"
                                className="btn border-secondary py-3 px-4 text-uppercase w-100 text-primary mt-4"
                            >
                                Place Order
                            </button>
                        </div>

                        <div className="col-md-12 col-lg-6 col-xl-5">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Products</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Price</th>
                                            <th scope="col">Quantity</th>
                                            <th scope="col">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {productList.map((product) => (
                                            <tr key={product.ProductId}>
                                                <th scope="row">
                                                    <div className="d-flex align-items-center mt-2">
                                                        <img
                                                            src={product.imgSrc}
                                                            className="img-fluid rounded-circle"
                                                            style={{
                                                                width: "90px",
                                                                height: "90px",
                                                            }}
                                                            alt=""
                                                        />
                                                    </div>
                                                </th>
                                                <td className="py-5">
                                                    {product.name}
                                                </td>
                                                <td className="py-5">
                                                    {formatCurrencyVND(
                                                        product.price,
                                                    )}
                                                </td>
                                                <td className="py-5">
                                                    {product.count}
                                                </td>
                                                <td className="py-5">
                                                    {formatCurrencyVND(
                                                        product.count *
                                                            product.price,
                                                    )}
                                                </td>
                                            </tr>
                                        ))}

                                        <tr>
                                            <th scope="row"></th>
                                            <td className="py-5"></td>
                                            <td className="py-5"></td>
                                            <td className="py-5">
                                                <p className="mb-0 text-dark py-3">
                                                    TOTAL
                                                </p>
                                            </td>
                                            <td className="py-5">
                                                <div className="py-3 border-bottom border-top">
                                                    <p className="mb-0 text-dark">
                                                        {formatCurrencyVND(
                                                            totalCost,
                                                        )}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutForm;
