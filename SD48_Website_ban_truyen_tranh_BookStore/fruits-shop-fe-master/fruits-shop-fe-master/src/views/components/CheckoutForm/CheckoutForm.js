import useOrder from "@api/useOrder";
import { validateChangeAndBlurInput } from "@utils/validateChangeAndBlurInput";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useUser from "@store/useUser";
import { deleteProductFromCart } from "../../../../src/services/redux/cartSlice/productSlice";
import useVnPay from "@api/useVnPay";
import useMoMo from "@api/useMoMo";
import useAddress from "@api/useAddress";
import { getMediaUrl } from "@constants/commonFunctions";
import { DELIVERY_STATUS, ORDER_STATUS } from "@constants/orderStatusConstant";
import useCoupon from "@api/useCoupons";
import useShippingFee from "@api/useShippingFee";
import VoucherPopup from "../Dashboard/OrderManager/VoucherPopup";
import useUserApi from "api/useUser";
import useProduct from "@api/useProduct";
import { Modal } from "antd";

function formatCurrencyVND(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

const CheckoutForm = () => {
  const [province, setProvince] = useState([]);
  const [district, setDistrict] = useState([]);
  const [ward, setWard] = useState([]);
  const [couponModel, setCouponModel] = useState(null);
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);

  const { getUserById } = useUserApi();

  const productList = useSelector((state) => state.products.productList);
  const dispatch = useDispatch();
  const totalCost = useSelector((state) => state.products.totalCost);
  const [feeShipping, setFeeShipping] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [user, setUser] = useState({});

  const { createPaymentUrl } = useVnPay();
  const { getUrlPayment } = useMoMo();
  const { getFee } = useShippingFee();

  const handleCallVnPay = async () => {
    const { success, data } = await createPaymentUrl({
      orderType: "order",
      amount: totalCost,
      orderDescription: "order",
      name: "order",
    });
    if (data.status == "Error") {
      toast.error(data.message);
    } else {
      window.location.href = data.data;
    }
  };

  const handleCallMoMo = async () => {
    const requestData = {
      orderId: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      amount: totalPriceAfterAddShipping,
    };

    try {
      const { success, data } = await getUrlPayment(requestData);

      if (!success || data.status === "Error") {
        toast.error(data.message || "Có lỗi xảy ra khi tạo thanh toán MoMo");
        localStorage.removeItem("checkoutFormData");
      } else {
        window.location.href = data.message;
      }
    } catch (error) {
      toast.error("Lỗi kết nối đến MoMo");
      localStorage.removeItem("checkoutFormData");
    }
  };

  const { createOrder } = useOrder();
  const { id } = useUser();
  const { getProvince, getDistrict, getWard } = useAddress();
  const { getDetailCouponByCode } = useCoupon();
  const { getById } = useProduct();

  const [totalPriceAfterAddShipping, setTotalPriceAfterAddShipping] =
    useState(totalCost);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    province: "",
    district: "",
    ward: "",
    address: "",
    paymentId: "",
    stage: 1,
    type: 2,
    createAccount: false,
    shipToDifferentAddress: false,
    price: parseFloat(totalCost),
    realPrice: parseFloat(totalPriceAfterAddShipping),
    deliveryType: 1,
    orderDetailModels: products,
    status: ORDER_STATUS.ORDER_STATUS_WAITING_ACCEPT,
    userId: id,
    userType: 1,
  });

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const navigate = useNavigate();

  const handleDeleteProduct = (id) => {
    dispatch(
      deleteProductFromCart({
        id,
      })
    );
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const responses = await Promise.all(
        productList.map((item) => getById(item.id))
      );

      const clean = responses
        .filter((res) => res.success && res.data?.success)
        .map((res) => ({
          price: res.data.data.discountDTO
            ? res.data.data.price -
              (res.data.data.discountDTO.percent
                ? (res.data.data.price * res.data.data.discountDTO.percent) /
                  100
                : res.data.data.discountDTO.moneyDiscount)
            : res.data.data.price,
          imgSrc: res.data.data?.images?.[0]?.imageUrl,
          count: productList?.find((p) => p.id == res.data.data.id)?.count,
          ProductId: res.data.data.id,
          name: res.data.data.name,
        }));

      setProducts(clean);
      setFormData((prevData) => ({
        ...prevData,
        orderDetailModels: clean,
      }));
    };

    if (productList.length > 0) {
      fetchProducts();
    }
  }, [productList]);

  useEffect(() => {
    setTotalPriceAfterAddShipping(
      (parseFloat(totalCost) + feeShipping - discount).toFixed(2)
    );
    setFormData((prevData) => ({
      ...prevData,
      realPrice: parseFloat(totalPriceAfterAddShipping),
      totalPrice: parseFloat(totalPriceAfterAddShipping),
    }));
  }, [feeShipping, discount, totalPriceAfterAddShipping, totalCost]);

  const fetchDataUser = async () => {
    try {
      const { success, data } = await getUserById(id);
      if (data) {
        setUser(data.data);
        formik.setValues({
          fullName: data.data.fullName,
          phoneNumber: data.data.phoneNumber,
          email: data.data.email,
          province: data.data?.address?.[0]?.provinceId,
          district: data.data?.address?.[0]?.districtId,
          ward: data.data?.address?.[0]?.wardId,
          address: data.data?.address?.[0]?.fullInfo,
          paymentId: "",
        });
        setFormData((prevData) => ({
          ...prevData,
          fullName: data.data.fullName,
          phoneNumber: data.data.phoneNumber,
          email: data.data.email,
          province: data.data?.address?.[0]?.provinceId,
          district: data.data?.address?.[0]?.districtId,
          ward: data.data?.address?.[0]?.wardId,
          address: data.data?.address?.[0]?.fullInfo,
          paymentId: "",
        }));
        handleChangeProvince(data.data?.address?.[0]?.provinceId);
        handleChangeDistrict(data.data?.address?.[0]?.districtId);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err);
    }
  };

  useEffect(() => {
    fetchDataUser();
    fetchProvince();
  }, []);

  const fetchProvince = async () => {
    var request = {
      name: null,
    };
    const { success, data } = await getProvince(request);
    if (!success || data.status == "Error") {
      toast.error(data.message);
    } else {
      setProvince([{ code: "", name: "Chọn tỉnh thành" }, ...data.data]);
    }
  };
  const fetchDistrict = async (provinceId) => {
    var request = {
      code: provinceId,
      name: null,
    };
    const { success, data } = await getDistrict(request);
    if (!success || data.status == "Error") {
      toast.error(data.message);
    } else {
      setDistrict(data.data);
    }
  };
  const fetchWard = async (districtId) => {
    var request = {
      code: districtId,
      name: null,
    };
    const { success, data } = await getWard(request);
    if (!success || data.status == "Error") {
      toast.error(data.message);
    } else {
      setWard(data.data);
    }
  };

  const handleChangeProvince = async (value) => {
    fetchDistrict(value);
    const fee = await fetchShippingFee(value);
    setFeeShipping(fee);
  };

  const handleChangeDistrict = (value) => {
    fetchWard(value);
  };

  const fetchShippingFee = async (provinceId) => {
    var request = {
      pointSource: "01",
      pointDestination: provinceId,
    };
    const { success, data } = await getFee(request);
    if (!success || data.status == "Error") {
      toast.error(data.message);
    } else {
      return data.data;
    }
  };

  const handleSelectCoupon = async () => {
    if (couponCode === "") {
      setDiscount(0);
      return;
    }
    const { success, data } = await getDetailCouponByCode(couponCode);
    if (data.status !== "Error" && success) {
      if (data.data.minValue <= totalCost) {
        var discountNumber = 0;
        if (data.data.type === 1) {
          const discount = (totalCost * data.data.couponAmount) / 100;
          discountNumber =
            discount > data.data.maxValue ? data.data.maxValue : discount;
        } else {
          discountNumber = data.data.couponAmount;
        }
        setDiscount(discountNumber);
      } else {
        toast.warning("Giá trị đơn hàng không đủ để sử dụng khuyến mại");
      }
    } else {
      toast.error("Có lỗi xảy ra");
    }
  };

  const handleSelectCounpon = (e) => {
    if (e.minValue <= totalCost) {
      var discountNumber = 0;
      if (e.type === 1) {
        const discount = (totalCost * e.couponAmount) / 100;
        discountNumber = discount > e.maxValue ? e.maxValue : discount;
      } else {
        discountNumber = e.couponAmount;
      }
      setDiscount(discountNumber);
      setCouponModel(e);
      setCouponCode(e.code);
    } else {
      toast.warning("Giá trị đơn hàng không đủ để sử dụng khuyến mại");
    }
  };

  const validate = (values) => {
    const errors = {};

    if (!values.fullName) {
      errors.fullName = "Vui lòng nhập tên của bạn";
    } else if (values.fullName.length <= 3) {
      errors.fullName = "Tên phải có ít nhất 3 ký tự";
    } else if (values.fullName.length >= 50) {
      errors.fullName = "Tên không được vượt quá 50 ký tự";
    }

    if (!values.address) {
      errors.address = "Vui lòng nhập địa chỉ của bạn";
    } else if (values.address.length <= 3) {
      errors.address = "Địa chỉ phải có ít nhất 3 ký tự";
    } else if (values.address.length >= 200) {
      errors.address = "Địa chỉ không được vượt quá 200 ký tự";
    }

    if (!values.email) {
      errors.email = "Vui lòng nhập email của bạn";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = "Định dạng email không hợp lệ";
    }

    if (!values.phoneNumber) {
      errors.phoneNumber = "Vui lòng nhập số điện thoại của bạn";
    } else if (!/^\d{10}$/.test(values.phoneNumber)) {
      errors.phoneNumber = "Số điện thoại phải gồm 10 chữ số.";
    }

    if (!values.province) {
      errors.province = "Vui lòng nhập tỉnh của bạn";
    }

    if (!values.district) {
      errors.district = "Vui lòng nhập huyện của bạn";
    }

    if (!values.ward) {
      errors.ward = "Vui lòng nhập xã của bạn";
    }

    if (!values.paymentId) {
      errors.paymentId = "Vui lòng nhập phương thức thanh toán của bạn";
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      fullName: "",
      address: "",
      email: "",
      phoneNumber: "",
      province: "",
      district: "",
      ward: "",
      paymentId: "",
    },
    validate,
    onSubmit: () => {
      showModal();
    },
  });

  const showModal = () => {
    setOpen(true);
  };

  const handleOkCheckout = () => {
    setOpen(false);
    submitFormData();
  };

  const handleCancelCheckout = () => {
    setOpen(false);
  };

  const submitFormData = async () => {
    const addressModel = {
      provinceId: formData.province,
      districtId: formData.district,
      wardId: formData.ward,
      addressDetail: formData.address,
      provinceName: province.find((item) => item.code === formData.province)
        ?.name,
      districtName: district.find((item) => item.code === formData.district)
        ?.name,
      wardName: ward.find((item) => item.code === formData.ward)?.name,
      stage: 1,
    };

    const formDataSubmit = {
      ...formData,
      userModel: {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        address: [addressModel],
        roleId: 8,
      },
      orderDetailModels: formData.orderDetailModels.map((item) => ({
        productId: item.ProductId,
        quantity: item.count,
        price: item.price,
        total: item.price * item.count,
        status: 1,
        originPrice: item.price,
      })),
      isDeliver: DELIVERY_STATUS.YES,
      paymentId: parseInt(formData.paymentId),
    };

    if (formData.paymentId === "4") {
      try {
        localStorage.setItem(
          "checkoutFormData",
          JSON.stringify(formDataSubmit)
        );
        handleCallMoMo();
      } catch (error) {
        toast.error("Lỗi khi lưu thông tin đơn hàng");
      }
      return;
    }

    const { success, data } = await createOrder(formDataSubmit);
    if (data.status !== "Error" && success) {
      toast.success("Đặt hàng thành công");
      products.forEach((item) => {
        handleDeleteProduct(item.ProductId);
      });

      if (formData.paymentId === "2") {
        handleCallVnPay();
      } else {
        navigate("/shop");
      }
    } else {
      toast.error("Có lỗi xảy ra");
    }
  };

  return (
    <div className="container-fluid py-5">
      <div className="container py-5">
        <h1 className="mb-4">Chi tiết đơn hàng</h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="row g-5">
            <div className="col-md-12 col-lg-6 col-xl-7">
              <div className="row">
                <div className="col-md-12">
                  <div className="form-item w-100">
                    <label className="form-label my-3">
                      Họ và tên<sup>*</sup>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        formik.touched.fullName
                          ? formik.errors.fullName
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                      name="fullName"
                      value={formik.values.fullName}
                      onChange={(e) => {
                        handleInputChange(e);
                        validateChangeAndBlurInput(e, "fullName", formik);
                      }}
                    />
                    {formik.touched.fullName && formik.errors.fullName ? (
                      <div className="invalid-feedback">
                        {formik.errors.fullName}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="form-item">
                <label className="form-label my-3">
                  Số điện thoại<sup>*</sup>
                </label>
                <input
                  type="tel"
                  className={`form-control ${
                    formik.touched.phoneNumber
                      ? formik.errors.phoneNumber
                        ? "is-invalid"
                        : "is-valid"
                      : ""
                  }`}
                  name="phoneNumber"
                  value={formik.values.phoneNumber}
                  onChange={(e) => {
                    handleInputChange(e);
                    validateChangeAndBlurInput(e, "phoneNumber", formik);
                  }}
                />

                {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                  <div className="invalid-feedback">
                    {formik.errors.phoneNumber}
                  </div>
                ) : null}
              </div>
              <div className="form-item">
                <label className="form-label my-3">
                  Email<sup>*</sup>
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
                    validateChangeAndBlurInput(e, "email", formik);
                  }}
                />

                {formik.touched.email && formik.errors.email ? (
                  <div className="invalid-feedback">{formik.errors.email}</div>
                ) : null}
              </div>

              <div className="row">
                <div className="form-item col-xl-4">
                  <label className="form-label my-3">
                    Tỉnh/Thành phố<sup>*</sup>
                  </label>
                  <select
                    className={`form-select ${
                      formik.touched.province
                        ? formik.errors.province
                          ? "is-invalid"
                          : "is-valid"
                        : ""
                    }`}
                    name="province"
                    value={formik.values.province}
                    onChange={(e) => {
                      handleChangeProvince(e.target.value);
                      handleInputChange(e);
                      validateChangeAndBlurInput(e, "province", formik);
                    }}
                  >
                    {province &&
                      province.map((item) => (
                        <option value={item.code} key={item.code}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                  {formik.touched.province && formik.errors.province ? (
                    <div className="invalid-feedback">
                      {formik.errors.province}
                    </div>
                  ) : null}
                </div>

                <div className="form-item col-xl-4">
                  <label className="form-label my-3">
                    Quận/Huyện<sup>*</sup>
                  </label>
                  <select
                    className={`form-select ${
                      formik.touched.district
                        ? formik.errors.district
                          ? "is-invalid"
                          : "is-valid"
                        : ""
                    }`}
                    name="district"
                    value={formik.values.district}
                    onChange={(e) => {
                      handleChangeDistrict(e.target.value);
                      handleInputChange(e);
                      validateChangeAndBlurInput(e, "district", formik);
                    }}
                  >
                    {district &&
                      district.map((item) => (
                        <option value={item.code} key={item.code}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                  {formik.touched.district && formik.errors.district ? (
                    <div className="invalid-feedback">
                      {formik.errors.district}
                    </div>
                  ) : null}
                </div>

                <div className="form-item col-xl-4">
                  <label className="form-label my-3">
                    Xã/Phường<sup>*</sup>
                  </label>
                  <select
                    className={`form-select ${
                      formik.touched.ward
                        ? formik.errors.ward
                          ? "is-invalid"
                          : "is-valid"
                        : ""
                    }`}
                    name="ward"
                    value={formik.values.ward}
                    onChange={(e) => {
                      handleInputChange(e);
                      validateChangeAndBlurInput(e, "ward", formik);
                    }}
                  >
                    {ward &&
                      ward.map((item) => (
                        <option value={item.code} key={item.code}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                  {formik.touched.ward && formik.errors.ward ? (
                    <div className="invalid-feedback">{formik.errors.ward}</div>
                  ) : null}
                </div>
              </div>

              <div className="form-item">
                <label className="form-label my-3">
                  Địa chỉ <sup>*</sup>
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
                    validateChangeAndBlurInput(e, "address", formik);
                  }}
                />

                {formik.touched.address && formik.errors.address ? (
                  <div className="invalid-feedback">
                    {formik.errors.address}
                  </div>
                ) : null}
              </div>
              <div className="form-item">
                <label className="form-label my-3">Ghi chú</label>
                <textarea
                  className={`form-control`}
                  name="note"
                  value={formik.values.note}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                />
              </div>
              <br />
     

              <div className="form-check">
                <input
                  className={`form-check-input ${
                    formik.touched.paymentId
                      ? formik.errors.paymentId
                        ? "is-invalid"
                        : "is-valid"
                      : ""
                  }`}
                  type="radio"
                  name="paymentId"
                  id="paymentId3"
                  value="3"
                  onClick={(e) => {
                    handleInputChange(e);
                    validateChangeAndBlurInput(e, "paymentId", formik);
                  }}
                />
                <label className="form-check-label" htmlFor="paymentId3">
                  Ship COD
                </label>
              </div>

              <div className="form-check">
                <input
                  className={`form-check-input ${
                    formik.touched.paymentId
                      ? formik.errors.paymentId
                        ? "is-invalid"
                        : "is-valid"
                      : ""
                  }`}
                  type="radio"
                  name="paymentId"
                  id="paymentId4"
                  value="4"
                  onClick={(e) => {
                    handleInputChange(e);
                    validateChangeAndBlurInput(e, "paymentId", formik);
                  }}
                />
                <label className="form-check-label" htmlFor="paymentId4">
                  Thanh toán MoMo
                </label>
                {formik.touched.paymentId && formik.errors.paymentId ? (
                  <div className="invalid-feedback">
                    {formik.errors.paymentId}
                  </div>
                ) : null}
              </div>
              <hr />

              <button
                type="submit"
                className="btn border-secondary py-3 px-4 text-uppercase w-100 text-primary mt-4"
              >
                Đặt Hàng
              </button>
            </div>

            <div className="col-md-12 col-lg-6 col-xl-5">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Sản phẩm</th>
                      <th scope="col">Tên</th>
                      <th scope="col">Giá</th>
                      <th scope="col">Số lượng</th>
                      <th scope="col">Tổng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.ProductId}>
                        <th scope="row">
                          <div className="d-flex align-items-center mt-2">
                            <img
                              src={getMediaUrl(product.imgSrc)}
                              className="img-fluid rounded-circle"
                              style={{
                                width: "90px",
                                height: "90px",
                              }}
                              alt=""
                            />
                          </div>
                        </th>
                        <td className="py-5">{product.name}</td>
                        <td className="py-5">
                          {formatCurrencyVND(product.price)}
                        </td>
                        <td className="py-5">{product.count}</td>
                        <td className="py-5">
                          {formatCurrencyVND(product.count * product.price)}
                        </td>
                      </tr>
                    ))}

                    <tr>
                      <td colSpan={4}>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Nhập mã khuyến mãi"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                        />
                      </td>
                      <td>
                        <VoucherPopup
                          handlePopupSelected={(e) => handleSelectCounpon(e)}
                          model={couponModel}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={4}>
                        <p className="mb-0 text-dark py-3">Khuyến mãi</p>
                      </td>
                      <td>
                        <div className="py-3 border-bottom border-top">
                          <p className="mb-0 text-dark">
                            {formatCurrencyVND(discount || 0)}
                          </p>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={4}>
                        <p className="mb-0 text-dark py-3">Phí vận chuyển</p>
                      </td>
                      <td>
                        <div className="py-3 border-bottom border-top">
                          <p className="mb-0 text-dark">
                            {formatCurrencyVND(feeShipping || 0)}
                          </p>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-5" colSpan={4}>
                        <p className="mb-0 text-dark py-3 fs-4 fw-bold">Tổng</p>
                      </td>
                      <td className="py-5">
                        <div className="py-3 border-bottom border-top">
                          <p className="mb-0 text-dark fs-4 fw-bold">
                            {formatCurrencyVND(totalPriceAfterAddShipping)}
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
        <Modal
          title="Xác nhận"
          open={open}
          onOk={handleOkCheckout}
          onCancel={handleCancelCheckout}
          okText="Xác nhận"
          cancelText="Hủy"
        >
          <p>Bạn xác nhận đặt đơn hàng này?</p>
        </Modal>
      </div>
    </div>
  );
};

export default CheckoutForm;