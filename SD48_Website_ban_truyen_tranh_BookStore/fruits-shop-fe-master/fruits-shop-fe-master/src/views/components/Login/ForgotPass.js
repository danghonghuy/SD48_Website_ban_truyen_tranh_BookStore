import React from "react";
import useAuth from "@api/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import img1 from "./assets/images/logos/dark-logo.svg";
import "@styles/scss/custom-input.scss";
import "./assets/css/styles.min.css";
import { useFormik } from "formik";
import { validateChangeAndBlurInput } from "@utils/validateChangeAndBlurInput";

function ForgotPass() {
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const validate = (values) => {
    const errors = {};
    if (!values.userName) {
      errors.userName = "Vui lòng nhập tên đăng nhập của bạn";
    } else if (values.userName.length <= 3) {
      errors.userName = "Tên đăng nhập phải có ít nhất 3 ký tự";
    } else if (values.userName.length >= 50) {
      errors.userName = "Tên đăng nhập không được vượt quá 50 ký tự";
    }

    if (!values.email) {
      errors.email = "Vui lòng nhập email";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = "Địa chỉ email không hợp lệ";
    }

    return errors;
  };

  const handleForgotPass = async (values) => { // Nhận values từ formik.handleSubmit
    try {
      // Sử dụng values từ formik thay vì formMilk.values trực tiếp
      // để đảm bảo dữ liệu mới nhất khi submit
      const { success, data } = await forgotPassword(values); 
      if (success && data?.status !== 'Error') { // Kiểm tra thêm data.status
        toast.success("Vui lòng kiểm tra email của bạn để đặt lại mật khẩu.");
        navigate("/login");
      } else {
        // Giả sử API trả về message lỗi trong data.message
        toast.error(data?.message || "Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } catch (err) {
      // Xử lý lỗi mạng hoặc lỗi không mong muốn từ API
      toast.error(err?.response?.data?.message || err?.message || "Có lỗi xảy ra khi gửi yêu cầu.");
    }
  };

  const formMilk = useFormik({ // Sửa tên biến formMilk thành formik cho dễ hiểu
    initialValues: {
      userName: "",
      email: "",
    },
    validate,
    onSubmit: (values) => { // Thêm onSubmit để gọi handleForgotPass
      handleForgotPass(values);
    }
  });
  return (
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
          style={{ marginTop: "6.25rem" }}
        >
          <div className="row justify-content-center w-100">
            <div className="col-md-12 col-lg-6 col-xxl-4">
              <div className="card mb-0">
                <div className="card-body">
                  <a className="text-nowrap logo-img text-center d-block py-3 w-100" href="/"> {/* Thêm href cho logo */}
                    <img src={img1} width="180" alt="Logo" /> {/* Thêm alt text */}
                  </a>
                  <p className="text-center">Khôi phục mật khẩu của bạn</p> {/* Việt hóa */}
                  {/* Sử dụng formik.handleSubmit */}
                  <form onSubmit={formMilk.handleSubmit}> 
                    <div className="mb-3">
                      <label htmlFor="userName" className="form-label">
                        Tên đăng nhập
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          formMilk.touched.userName && formMilk.errors.userName
                            ? "is-invalid"
                            : formMilk.touched.userName ? "is-valid" : "" // Thêm điều kiện is-valid
                        }`}
                        id="userName"
                        name="userName"
                        // Nên dùng formik.handleChange và formik.handleBlur
                        onChange={formMilk.handleChange}
                        onBlur={formMilk.handleBlur}
                        value={formMilk.values.userName}
                        aria-describedby="usernameHelp" // Sửa emailHelp thành usernameHelp
                      />
                      {formMilk.touched.userName && formMilk.errors.userName ? (
                        <div className="invalid-feedback">
                          {formMilk.errors.userName}
                        </div>
                      ) : null}
                    </div>
                    <div className="mb-4">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        onChange={formMilk.handleChange}
                        onBlur={formMilk.handleBlur}
                        className={`form-control ${
                            formMilk.touched.email && formMilk.errors.email
                            ? "is-invalid"
                            : formMilk.touched.email ? "is-valid" : "" // Thêm điều kiện is-valid
                        }`}
                        value={formMilk.values.email}
                        id="email"
                        name="email"
                      />
                      {formMilk.touched.email && formMilk.errors.email ? (
                        <div className="invalid-feedback">
                          {formMilk.errors.email}
                        </div>
                      ) : null}
                    </div>

                    <button // Đổi thẻ <a> thành <button type="submit">
                      type="submit"
                      className="btn btn-primary w-100 py-8 fs-6 mb-4 rounded-2"
                      disabled={formMilk.isSubmitting} // Vô hiệu hóa nút khi đang gửi
                    >
                      Gửi Email Khôi Phục
                    </button>

                    <div className="d-flex align-items-center justify-content-center">
                        <p className="fs-4 mb-0 fw-bold">Đã nhớ mật khẩu?</p>
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
  );
}

export default ForgotPass;