import React, { useState } from "react";
import useTranslate from "@lang";
import useAuth from "@api/useAuth";
import { Link, useNavigate } from "react-router-dom";
import useUser from "@store/useUser";
import { ToastContainer, toast } from "react-toastify";
import { message, notification } from "antd";
import "react-toastify/dist/ReactToastify.css";
import img1 from "./assets/images/logos/dark-logo.svg";
import "@styles/scss/custom-input.scss";
import "./assets/css/styles.min.css";
import * as Yup from "yup";
import { useFormik } from "formik";
import { validateChangeAndBlurInput } from "@utils/validateChangeAndBlurInput";

const LoginValidateSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Please enter your email"),

  username: Yup.string()
    .required("Please enter your usename")
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must not exceed 50 characters"),
  password: Yup.string()
    .required("Please enter your password")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password requires 1 uppercase, 1 lowercase, 1 number, and 1 special character"
    ),
});

const Login = () => {
  const t = useTranslate();
  const { changeData } = useUser();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { success, data } = await login({
      userName: formik.values["username"],
      password: formik.values["password"],
    });
    if (!data.success) {
      toast.error(data.message);
    } else {
      toast.success(data.message);
      if(data.data.data.roleCode.includes('ADMIN') || data.data.data.roleCode.includes('EMPLOYEE')) {
        changeData({username: data.data.data.userName, token:  data.data.token})
        navigate('/dashboard')
      } else {
        changeData({username: data.data.data.userName, token:  data.data.token})
        navigate('/')
      }
    }
  };

  // Validate form login

  const validate = (values) => {
    const errors = {};

    if (!values.username) {
      errors.username = "Please enter your usename";
    } else if (values.username.length <= 3) {
      errors.username = "Username must be at least 3 characters";
    } else if (values.username.length >= 50) {
      errors.username = "Username must not exceed 50 characters";
    }

    // if (!values.lastName) {
    //   errors.lastName = "Required";
    // } else if (values.lastName.length > 20) {
    //   errors.lastName = "Must be 20 characters or less";
    // }

    if (!values.email) {
      errors.email = "Required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = "Invalid email address";
    }

    if (!values.password) {
      errors.password = "Please enter your password";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(
        values.password
      )
    ) {
      errors.password =
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character";
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validate,

    onSubmit: (values) => {
      console.log(JSON.stringify(values, null, 2));
    },
  });

  return (
    <div
      class="page-wrapper"
      id="main-wrapper"
      data-layout="vertical"
      data-navbarbg="skin6"
      data-sidebartype="full"
      data-sidebar-position="fixed"
      data-header-position="fixed"
    >
      <div class="position-relative overflow-hidden radial-gradient min-vh-100 d-flex align-items-center justify-content-center">
        <div
          class="d-flex align-items-center justify-content-center w-100"
          style={{ marginTop: "100px" }}
        >
          <div class="row justify-content-center w-100">
            <div class="col-md-12 col-lg-6 col-xxl-4">
              <div class="card mb-0">
                <div class="card-body">
                  <a class="text-nowrap logo-img text-center d-block py-3 w-100">
                    <img src={img1} width="180" alt="" />
                  </a>
                  <p class="text-center">Your Social Campaigns</p>
                  <form >
                    <div class="mb-3">
                      <label for="username" class="form-label">
                        Username
                      </label>
                      <input
                        type="text"
                        class={`form-control ${
                          formik.touched.username
                            ? formik.errors.username
                              ? "is-invalid"
                              : "is-valid"
                            : ""
                        }`}
                        id="username"
                        name="username"
                        onChange={(e) => {
                          validateChangeAndBlurInput(e, "username", formik);
                        }}
                        value={formik.values.username}
                        aria-describedby="emailHelp"
                      />
                      {formik.touched.username && formik.errors.username ? (
                        <div className="invalid-feedback">
                          {formik.errors.username}
                        </div>
                      ) : null}
                    </div>
                    <div class="mb-4">
                      <label for="passwordinput" class="form-label">
                        Password
                      </label>
                      <input
                        type="password"
                        onChange={(e) => {
                          validateChangeAndBlurInput(e, "password", formik);
                        }}
                        class={`form-control ${
                          formik.touched.password
                            ? formik.errors.password
                              ? "is-invalid"
                              : "is-valid"
                            : ""
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
                    {/* <div class="d-flex align-items-center justify-content-between mb-4">

                      <Link class="text-primary fw-bold ms-2" to={"/reset-pass"}>
                        Forgot Password ?
                      </Link>
                    </div> */}
                    <a
                      type="submit"
                       onClick={() => handleLogin()}
                      class="btn btn-primary w-100 py-8 fs-6 mb-4 rounded-2"
                    >
                      Sign In
                    </a>
                    <div class="d-flex align-items-center justify-content-center">
                      <Link class="text-primary fw-bold ms-2" to={"/register"}>
                        Create an account
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
