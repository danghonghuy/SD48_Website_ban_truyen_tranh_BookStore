import React from "react";
import "./assets/css/styles.min.css"; // Đảm bảo đường dẫn đúng
import "@styles/scss/custom-input.scss"; // Đảm bảo đường dẫn đúng
import { Link, useNavigate } from "react-router-dom";
import useAuth from "@api/useAuth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS cho react-toastify

import img1 from "./assets/images/logos/dark-logo.svg";
import { useFormik } from "formik";
// import { validateChangeAndBlurInput } from "@utils/validateChangeAndBlurInput"; // Cân nhắc bỏ nếu dùng Formik handleChange/handleBlur

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  // Validate function (đã Việt hóa)
  const validate = (values) => {
    const errors = {};

    if (!values.Username) {
      errors.Username = "Vui lòng nhập tên đăng nhập";
    } else if (values.Username.length <= 3) {
      errors.Username = "Tên đăng nhập phải có ít nhất 3 ký tự";
    } else if (values.Username.length >= 50) {
      errors.Username = "Tên đăng nhập không được vượt quá 50 ký tự";
    }

    if (!values.FullName) {
      errors.FullName = "Vui lòng nhập họ và tên";
    } else if (values.FullName.length <= 3) {
      errors.FullName = "Họ và tên phải có ít nhất 3 ký tự";
    } else if (values.FullName.length >= 50) {
      errors.FullName = "Họ và tên không được vượt quá 50 ký tự";
    }

    if (!values.Email) {
      errors.Email = "Vui lòng nhập email";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.Email)
    ) {
      errors.Email = "Địa chỉ email không hợp lệ";
    }

    if (!values.Password) {
      errors.Password = "Vui lòng nhập mật khẩu";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        values.Password
      )
    ) {
      errors.Password =
        "Mật khẩu cần ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt";
    }

    if (!values.PhoneNumber) {
      errors.PhoneNumber = "Vui lòng nhập số điện thoại";
    } else if (!/^\d{10}$/i.test(values.PhoneNumber)) {
      errors.PhoneNumber =
        "Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại gồm 10 chữ số";
    }

    return errors;
  };
  
  const handleRegister = async (formValues) => {
    try {
      const formData = new FormData();
      const dataPost = {
        fullName: formValues.FullName,
        userName: formValues.Username,
        phoneNumber: formValues.PhoneNumber,
        email: formValues.Email,
        password: formValues.Password,
        roleId: 5, // Giữ nguyên roleId là 5 nếu đây là role cho user mới
      };
      formData.append("model", JSON.stringify(dataPost));
      
      const { success, data } = await register(formData, {
        "Content-Type": "multipart/form-data",
      });

      // Kiểm tra kỹ điều kiện thành công từ API
      if (success && data?.success) { // Giả sử API trả về data.success
        toast.success(data.message || "Đăng ký thành công!");
        navigate("/login");
      } else {
        toast.error(data?.message || "Đăng ký không thành công. Vui lòng thử lại.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Đã có lỗi xảy ra khi đăng ký.");
    }
  };

  const formik = useFormik({
    initialValues: {
      Username: "",
      FullName: "",
      PhoneNumber: "",
      Password: "",
      Email: "",
      // RoleName: "User", // RoleName không cần thiết nếu roleId được set cứng
    },
    validate,
    onSubmit: (values) => {
      // Gọi handleRegister khi form hợp lệ
      handleRegister(values);
    },
  });

  return (
    <>
      <div
        className="page-wrapper" // Sửa class thành className
        id="main-wrapper"
        data-layout="vertical"
        data-navbarbg="skin6"
        data-sidebartype="full"
        data-sidebar-position="fixed"
        data-header-position="fixed"
      >
        <div className="position-relative overflow-hidden radial-gradient min-vh-100 d-flex align-items-center justify-content-center">
          <div
            className="d-flex align-items-center justify-content-center w-100"
            style={{ marginTop: "100px" }} // Cân nhắc giảm marginTop nếu quá cao
          >
            <div className="row justify-content-center w-100">
              <div className="col-md-10 col-lg-8 col-xxl-6"> {/* Điều chỉnh độ rộng cột cho phù hợp hơn */}
                <div className="card mb-0">
                  <div className="card-body">
                    <a className="text-nowrap logo-img text-center d-block py-3 w-100" href="/"> {/* Thêm href cho logo */}
                      <img src={img1} width="180" alt="Logo" /> {/* Thêm alt text */}
                    </a>
                    <p className="text-center">Tạo tài khoản mới</p> {/* Việt hóa */}
                    <form onSubmit={formik.handleSubmit}> {/* Sử dụng formik.handleSubmit */}
                      <div className="row">
                        <div className="mb-3 col-md-6"> {/* Sửa col-sm-6 thành col-md-6 cho màn hình lớn hơn */}
                          <label htmlFor="Username" className="form-label">
                            Tên đăng nhập
                          </label>
                          <input
                            type="text"
                            className={`form-control ${
                              formik.touched.Username && formik.errors.Username
                                ? "is-invalid"
                                : formik.touched.Username ? "is-valid" : ""
                            }`}
                            id="Username"
                            name="Username"
                            aria-describedby="usernameHelp" // Sửa textHelp
                            value={formik.values.Username}
                            onChange={formik.handleChange} // Sử dụng Formik handleChange
                            onBlur={formik.handleBlur}     // Sử dụng Formik handleBlur
                          />
                          {formik.touched.Username && formik.errors.Username ? (
                            <div className="invalid-feedback">
                              {formik.errors.Username}
                            </div>
                          ) : null}
                        </div>
                        <div className="mb-3 col-md-6">
                          <label htmlFor="FullName" className="form-label">
                            Họ và tên
                          </label>
                          <input
                            type="text"
                            className={`form-control ${
                              formik.touched.FullName && formik.errors.FullName
                                ? "is-invalid"
                                : formik.touched.FullName ? "is-valid" : ""
                            }`}
                            id="FullName"
                            aria-describedby="fullnameHelp" // Sửa textHelp
                            value={formik.values.FullName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            name="FullName"
                          />
                          {formik.touched.FullName && formik.errors.FullName ? (
                            <div className="invalid-feedback">
                              {formik.errors.FullName}
                            </div>
                          ) : null}
                        </div>
                        <div className="mb-3 col-md-6">
                          <label htmlFor="Email" className="form-label">
                            Địa chỉ Email
                          </label>
                          <input
                            type="email"
                            className={`form-control ${
                              formik.touched.Email && formik.errors.Email
                                ? "is-invalid"
                                : formik.touched.Email ? "is-valid" : ""
                            }`}
                            id="Email"
                            aria-describedby="emailHelp"
                            value={formik.values.Email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            name="Email"
                          />
                          {formik.touched.Email && formik.errors.Email ? (
                            <div className="invalid-feedback">
                              {formik.errors.Email}
                            </div>
                          ) : null}
                        </div>
                        <div className="mb-3 col-md-6">
                          <label htmlFor="PhoneNumber" className="form-label">
                            Số điện thoại
                          </label>
                          <input
                            type="text" // Có thể dùng type="tel"
                            className={`form-control ${
                              formik.touched.PhoneNumber && formik.errors.PhoneNumber
                                ? "is-invalid"
                                : formik.touched.PhoneNumber ? "is-valid" : ""
                            }`}
                            id="PhoneNumber"
                            aria-describedby="phoneHelp" // Sửa textHelp
                            name="PhoneNumber"
                            value={formik.values.PhoneNumber}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.PhoneNumber &&
                          formik.errors.PhoneNumber ? (
                            <div className="invalid-feedback">
                              {formik.errors.PhoneNumber}
                            </div>
                          ) : null}
                        </div>
                        <div className="mb-3 col-md-6"> {/* Mật khẩu nên chiếm full width hoặc có input xác nhận */}
                          <label htmlFor="Password" className="form-label">
                            Mật khẩu
                          </label>
                          <input
                            type="password" // Đổi type thành password
                            className={`form-control ${
                              formik.touched.Password && formik.errors.Password
                                ? "is-invalid"
                                : formik.touched.Password ? "is-valid" : ""
                            }`}
                            id="Password"
                            value={formik.values.Password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            name="Password"
                          />
                          {formik.touched.Password && formik.errors.Password ? (
                            <div className="invalid-feedback">
                              {formik.errors.Password}
                            </div>
                          ) : null}
                        </div>
                        {/* Cân nhắc thêm trường "Xác nhận mật khẩu" */}
                        {/* <div className="mb-3 col-md-6">
                          <label htmlFor="ConfirmPassword" className="form-label">
                            Xác nhận Mật khẩu
                          </label>
                          <input
                            type="password"
                            className={`form-control ${
                              formik.touched.ConfirmPassword && formik.errors.ConfirmPassword
                                ? "is-invalid"
                                : formik.touched.ConfirmPassword ? "is-valid" : ""
                            }`}
                            id="ConfirmPassword"
                            name="ConfirmPassword"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.ConfirmPassword}
                          />
                          {formik.touched.ConfirmPassword && formik.errors.ConfirmPassword ? (
                            <div className="invalid-feedback">
                              {formik.errors.ConfirmPassword}
                            </div>
                          ) : null}
                        </div> */}
                      </div>

                      <button // Đổi thẻ <a> thành <button type="submit">
                        type="submit"
                        className="btn btn-primary w-100 py-8 fs-6 mb-4 rounded-2" // Sửa fs-10 thành fs-6 cho dễ đọc
                        disabled={formik.isSubmitting} // Vô hiệu hóa khi đang submit
                      >
                        Đăng Ký
                      </button>
                      <div className="d-flex align-items-center justify-content-center">
                        <p className="fs-4 mb-0 fw-bold">Đã có tài khoản?</p> {/* Thêm text */}
                        <Link className="text-primary fw-bold ms-2" to={"/login"}>
                          Đăng nhập
                        </Link>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;