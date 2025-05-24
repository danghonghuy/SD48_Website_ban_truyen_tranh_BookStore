import React, { useState } from "react";
import useTranslate from "@lang";
import useAuth from "@api/useAuth";
import { Link, useNavigate } from "react-router-dom";
import useUser from "@store/useUser";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import img1 from "./assets/images/logos/dark-logo.svg";
import "@styles/scss/custom-input.scss";
import "./assets/css/styles.min.css";
import { useFormik } from "formik";

const Login = () => {
  const t = useTranslate();
  const { changeData } = useUser();
  const { login } = useAuth();
  const navigate = useNavigate();

  console.log("Login component đã render");

  const handleLogin = async () => {
    console.log("Hàm handleLogin đã được kích hoạt");
    if (!formik.isValid || Object.keys(formik.errors).length > 0) {
        console.log("Lỗi validate của Formik:", formik.errors);
        Object.values(formik.errors).forEach(errorMsg => {
            if (typeof errorMsg === 'string') toast.error(errorMsg);
        });
        formik.setTouched({
            username: true,
            password: true,
        });
        return;
    }

    console.log("Giá trị Formik sẽ gửi đi:", {
      userName: formik.values["username"],
      password: formik.values["password"],
    });

    try {
      const responseFromHook = await login({
        userName: formik.values["username"],
        password: formik.values["password"],
      });

      console.log("Phản hồi từ hook login:", JSON.stringify(responseFromHook, null, 2));

      if (responseFromHook && typeof responseFromHook.success === 'boolean') {
        if (!responseFromHook.success) {
          console.log("API đăng nhập báo thất bại:", responseFromHook.message);
          toast.error(responseFromHook.message || "Đăng nhập thất bại từ API.");
        } else {
          console.log("API đăng nhập báo thành công:", responseFromHook.message);
          toast.success(responseFromHook.message || "Đăng nhập thành công!");

          const apiResponseData = responseFromHook.data;
          console.log("Dữ liệu phản hồi API (chứa token và đối tượng người dùng):", JSON.stringify(apiResponseData, null, 2));

          if (apiResponseData && apiResponseData.token && apiResponseData.data && apiResponseData.data.roleCode) {
            const userInfo = apiResponseData.data;
            const token = apiResponseData.token;

            console.log("Thông tin người dùng:", JSON.stringify(userInfo, null, 2));
            console.log("Token:", token);

            localStorage.setItem('authToken', token);
            
            changeData({
              username: userInfo.userName,
              token: token,
              roleCode: userInfo.roleCode,
              id: userInfo.id,
            });
            console.log("Trạng thái người dùng toàn cục đã được cập nhật qua changeData");

            if (
              userInfo.roleCode.includes("ADMIN") ||
              userInfo.roleCode.includes("EMPLOYEE")
            ) {
              console.log("Đang điều hướng đến /dashboard cho ADMIN/EMPLOYEE");
              navigate("/dashboard");
            } else {
              console.log("Đang điều hướng đến / cho các vai trò khác");
              navigate("/");
            }
          } else {
            console.error("Thiếu token hoặc thông tin người dùng trong đối tượng data của phản hồi API", apiResponseData);
            toast.error("Dữ liệu trả về từ server không hợp lệ (thiếu token hoặc thông tin người dùng).");
          }
        }
      } else {
        console.error("Cấu trúc phản hồi không mong đợi từ hook login (thiếu cờ success hoặc bản thân response là null/undefined):", responseFromHook);
        toast.error("Phản hồi từ server không như mong đợi hoặc có lỗi kết nối.");
      }
    } catch (error) {
      console.error("Lỗi trong quá trình handleLogin:", error);
      toast.error("Đã có lỗi xảy ra trong quá trình đăng nhập.");
    }
  };

  const validate = (values) => {
    const errors = {};
    if (!values.username) {
      errors.username = "Vui lòng nhập tên đăng nhập";
    } else if (values.username.length < 3) {
      errors.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
    } else if (values.username.length > 50) {
      errors.username = "Tên đăng nhập không được vượt quá 50 ký tự";
    }
    if (!values.password) {
      errors.password = "Vui lòng nhập mật khẩu";
    } else if (
      // Regex đã được cập nhật để bao gồm ký tự '^'
      // Cụ thể, [@$!%*?&] đã được đổi thành [@$!%*?&^]
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^])[A-Za-z\d@$!%*?&^]{8,}$/.test(
        values.password
      )
    ) {
      errors.password =
        "Mật khẩu yêu cầu 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt (ví dụ: @, $, !, %, *, ?, &, ^) và ít nhất 8 ký tự";
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: { username: "", password: "" },
    validate,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      console.log("Formik onSubmit (hiện không được dùng bởi nút bấm):", JSON.stringify(values, null, 2));
    },
  });

  return (
    <div
      className="page-wrapper"
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
          style={{ marginTop: "100px" }}
        >
          <div className="row justify-content-center w-100">
            <div className="col-md-12 col-lg-6 col-xxl-4">
              <div className="card mb-0">
                <div className="card-body">
                  <a href="#" className="text-nowrap logo-img text-center d-block py-3 w-100">
                    <img src={img1} width="180" alt="" />
                  </a>
                  <p className="text-center">Nền tảng quản lý của bạn</p>
                  <form>
                    <div className="mb-3">
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
                      />
                      {formik.touched.username && formik.errors.username ? (
                        <div className="invalid-feedback">
                          {formik.errors.username}
                        </div>
                      ) : null}
                    </div>
                    <div className="mb-4">
                      <label htmlFor="passwordinput" className="form-label">
                        Mật khẩu
                      </label>
                      <input
                        type="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`form-control ${
                          formik.touched.password && formik.errors.password
                            ? "is-invalid"
                            : formik.touched.password ? "is-valid" : ""
                        }`}
                        value={formik.values.password}
                        id="passwordinput"
                        name="password"
                      />
                      {formik.touched.password && formik.errors.password ? (
                        <div className="invalid-feedback">
                          {formik.errors.password}
                        </div>
                      ) : null}
                    </div>
                    <div className="d-flex align-items-center justify-content-between mb-4">
                      <Link
                        className="text-primary fw-bold ms-2"
                        to={"/forgot-pass"}
                      >
                        Quên mật khẩu?
                      </Link>
                    </div>
                    <button
                      type="button"
                      onClick={handleLogin}
                      className="btn btn-primary w-100 py-8 fs-6 mb-4 rounded-2"
                    >
                      Đăng Nhập
                    </button>
                    <div className="d-flex align-items-center justify-content-center">
                      <Link className="text-primary fw-bold ms-2" to={"/register"}>
                        Tạo tài khoản mới
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
};
export default Login;