import React from "react";
// import useTranslate from "@lang"; // Bỏ nếu không dùng
import useAuth from "@api/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Thêm useLocation
// import useUser from "@store/useUser"; // Bỏ nếu không dùng
import { toast } from "react-toastify"; // Bỏ ToastContainer, message, notification nếu đã có ở App.js
import "react-toastify/dist/ReactToastify.css";
import img1 from "./assets/images/logos/dark-logo.svg";
import "@styles/scss/custom-input.scss"; // Đảm bảo đường dẫn đúng
import "./assets/css/styles.min.css";   // Đảm bảo đường dẫn đúng
// import * as Yup from "yup"; // Bỏ nếu dùng hàm validate riêng
import { useFormik } from "formik";
// import { validateChangeAndBlurInput } from "@utils/validateChangeAndBlurInput"; // Cân nhắc bỏ

function ResetPass() {
  const { changpassWord } = useAuth(); // API đổi mật khẩu
  const navigate = useNavigate();
  const location = useLocation(); // Để lấy token từ URL

  // Hàm lấy token từ query params của URL
  const getTokenFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return params.get("token"); // Giả sử token nằm trong query param 'token'
  };
  
  // Hàm validate (đã Việt hóa và chỉnh sửa)
  const validate = (values) => {
    const errors = {};
    // Trường username có thể không cần thiết nếu việc reset pass dựa trên token
    // Nếu API yêu cầu username, giữ lại. Nếu không, có thể bỏ.
    // if (!values.username) {
    //   errors.username = "Vui lòng nhập tên đăng nhập";
    // } else if (values.username.length <= 3) {
    //   errors.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
    // } else if (values.username.length >= 50) {
    //   errors.username = "Tên đăng nhập không được vượt quá 50 ký tự";
    // }

    if (!values.Password) {
      errors.Password = "Vui lòng nhập mật khẩu mới";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        values.Password
      )
    ) {
      errors.Password =
        "Mật khẩu cần ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt";
    }

    if (!values.newPassword) {
      errors.newPassword = "Vui lòng xác nhận mật khẩu mới";
    } else if (values.newPassword !== values.Password) {
      errors.newPassword = "Mật khẩu xác nhận không khớp với mật khẩu mới";
    }
    // Bỏ validate cho newPassword theo regex vì nó chỉ cần khớp với Password
    // else if (
    //   !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
    //     values.newPassword
    //   )
    // ) {
    //   errors.newPassword =
    //     "Mật khẩu xác nhận cần ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt";
    // }
    return errors;
  };

  const handleChangePass = async (formValues) => {
    const token = getTokenFromUrl();
    if (!token) {
      toast.error("Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.");
      navigate("/login"); // Hoặc trang forgot-password
      return;
    }

    try {
      // API call có thể cần cả token và mật khẩu mới
      // Cấu trúc body request phụ thuộc vào API của bạn
      const payload = {
        token: token,
        newPassword: formValues.Password, // Gửi mật khẩu mới
        // API có thể yêu cầu username hoặc email, tùy thiết kế
        // username: formValues.username 
      };
      const { success, data } = await changpassWord(payload); 

      if (success && data?.success) { // Kiểm tra kỹ điều kiện thành công
        toast.success(data.message || "Đặt lại mật khẩu thành công!");
        navigate("/login");
      } else {
        toast.error(data?.message || "Không thể đặt lại mật khẩu. Vui lòng thử lại.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Đã có lỗi xảy ra.");
    }
  };

  const formik = useFormik({ // Đổi formMilk thành formik
    initialValues: {
      // username: "", // Bỏ nếu không cần username cho API
      Password: "",    // Mật khẩu mới
      newPassword: "", // Xác nhận mật khẩu mới
    },
    validate,
    onSubmit: (values) => {
      handleChangePass(values);
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
                  <a className="text-nowrap logo-img text-center d-block py-3 w-100" href="/"> {/* Thêm href */}
                    <img src={img1} width="180" alt="Logo" /> {/* Thêm alt */}
                  </a>
                  <p className="text-center">Đặt Lại Mật Khẩu Của Bạn</p> {/* Việt hóa */}
                  <form onSubmit={formik.handleSubmit}> {/* Sử dụng formik.handleSubmit */}
                    {/* Trường Username có thể không cần thiết nếu dùng token */}
                    {/* <div className="mb-3">
                      <label htmlFor="username" className="form-label">
                        Tên đăng nhập
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          formik.touched.username && formik.errors.username
                            ? "is-invalid"
                            : formik.touched.username ? "is-valid" : ""
                        }`}
                        id="username"
                        name="username"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                        aria-describedby="usernameHelp"
                      />
                      {formik.touched.username && formik.errors.username ? (
                        <div className="invalid-feedback">
                          {formik.errors.username}
                        </div>
                      ) : null}
                    </div> */}
                    <div className="mb-4">
                      <label htmlFor="Password" className="form-label">
                        Mật khẩu mới
                      </label>
                      <input
                        type="password"
                        className={`form-control ${
                          formik.touched.Password && formik.errors.Password
                            ? "is-invalid"
                            : formik.touched.Password ? "is-valid" : ""
                        }`}
                        id="Password"
                        name="Password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.Password}
                      />
                      {formik.touched.Password && formik.errors.Password ? (
                        <div className="invalid-feedback">
                          {formik.errors.Password}
                        </div>
                      ) : null}
                    </div>

                    <div className="mb-4">
                      <label htmlFor="newPassword" className="form-label">
                        Xác nhận mật khẩu mới
                      </label>
                      <input
                        type="password"
                        className={`form-control ${
                          formik.touched.newPassword && formik.errors.newPassword
                            ? "is-invalid"
                            : formik.touched.newPassword ? "is-valid" : ""
                        }`}
                        id="newPassword"
                        name="newPassword"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.newPassword}
                      />
                      {formik.touched.newPassword &&
                      formik.errors.newPassword ? (
                        <div className="invalid-feedback">
                          {formik.errors.newPassword}
                        </div>
                      ) : null}
                    </div>

                    <button // Đổi thẻ <a> thành <button type="submit">
                      type="submit"
                      className="btn btn-primary w-100 py-8 fs-6 mb-4 rounded-2"
                      disabled={formik.isSubmitting} // Vô hiệu hóa khi đang submit
                    >
                      Đặt Lại Mật Khẩu
                    </button>
                    
                    <div className="d-flex align-items-center justify-content-center"> {/* Thêm div bao ngoài */}
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

export default ResetPass;