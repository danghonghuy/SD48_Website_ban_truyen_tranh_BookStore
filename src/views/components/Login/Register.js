import React, { useEffect, useState } from "react";
import "./assets/css/styles.min.css";
import { Link } from "react-router-dom";
import useAuth from "@api/useAuth";
import { toast } from "react-toastify";

import img1 from "./assets/images/logos/dark-logo.svg";
import { useFormik } from "formik";
import { validateChangeAndBlurInput } from "@utils/validateChangeAndBlurInput";

const Register = () => {
  const { register } = useAuth();
  const handleRegister = async () => {
    try {
      const { success, data } = await register(formik.values);
      if (!success || data.status == "Error") {
        toast.error(data.message);
      } else {
        toast.success(data.message);
      }
    } catch (err) {
      toast.error(err)
    }
    
  };

  // Validate
  const validate = (values) => {
    const errors = {};

    if (!values.Username) {
      errors.Username = "Please enter your usename";
    } else if (values.Username.length <= 3) {
      errors.Username = "Username must be at least 3 characters";
    } else if (values.Username.length >= 50) {
      errors.Username = "Username must not exceed 50 characters";
    }

    if (!values.FullName) {
      errors.FullName = "Please enter your fullname";
    } else if (values.FullName.length <= 3) {
      errors.FullName = "Fullname must be at least 3 characters";
    } else if (values.FullName.length >= 50) {
      errors.FullName = "Fullname must not exceed 50 characters";
    }
    if (!values.Email) {
      errors.Email = "Required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.Email)
    ) {
      errors.Email = "Invalid email address";
    }

    if (!values.Password) {
      errors.Password = "Please enter your password";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(
        values.Password
      )
    ) {
      errors.Password =
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character";
    }

    if (!values.PhoneNumber) {
      errors.PhoneNumber = "Please enter your phone number";
    } else if (!/^\d{10}$/i.test(values.PhoneNumber)) {
      errors.PhoneNumber =
        "Invalid phone number. Please enter a 10-digit phone number";
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      Username: "",
      FullName: "",
      PhoneNumber: "",
      Password: "",
      Email: "",
      RoleName: "User"
    },
    validate,
  });
  return (
    <>
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
              <div class="col-md-8 col-lg-6 col-xxl-8">
                <div class="card mb-0">
                  <div class="card-body">
                    <a class="text-nowrap logo-img text-center d-block py-3 w-100">
                      <img src={img1} width="180" alt="" />
                    </a>
                    <p class="text-center">Your Social Campaigns</p>
                    <form>
                      <div className="row">
                        <div class="mb-3 col-sm-6">
                          <label for="Username" class="form-label">
                            Name
                          </label>
                          <input
                            type="text"
                            class={`form-control ${
                              formik.touched.Username
                                ? formik.errors.Username
                                  ? "is-invalid"
                                  : "is-valid"
                                : ""
                            }`}
                            id="Username"
                            name="Username"
                            aria-describedby="textHelp"
                            value={formik.values.Username}
                            onChange={(e) =>
                              validateChangeAndBlurInput(e, "Username", formik)
                            }
                          />
                          {formik.touched.Username && formik.errors.Username ? (
                            <div className="invalid-feedback">
                              {formik.errors.Username}
                            </div>
                          ) : null}
                        </div>
                        <div class="mb-3 col-sm-6">
                          <label for="PhoneNumber" class="form-label">
                            PhoneNumber
                          </label>
                          <input
                            type="text"
                            class={`form-control ${
                              formik.touched.PhoneNumber
                                ? formik.errors.PhoneNumber
                                  ? "is-invalid"
                                  : "is-valid"
                                : ""
                            }`}
                            id="PhoneNumber"
                            aria-describedby="textHelp"
                            name="PhoneNumber"
                            value={formik.values.PhoneNumber}
                            onChange={(e) =>
                              validateChangeAndBlurInput(e, "PhoneNumber", formik)
                            }
                          />

                          {formik.touched.PhoneNumber && formik.errors.PhoneNumber ? (
                            <div className="invalid-feedback">
                              {formik.errors.PhoneNumber}
                            </div>
                          ) : null}
                        </div>
                        <div class="mb-3 col-sm-6">
                          <label for="FullName" class="form-label">
                            FullName
                          </label>
                          <input
                            type="text"
                            class={`form-control ${
                              formik.touched.FullName
                                ? formik.errors.FullName
                                  ? "is-invalid"
                                  : "is-valid"
                                : ""
                            }`}
                            id="FullName"
                            aria-describedby="textHelp"
                            value={formik.values.FullName}
                            onChange={(e) =>
                              validateChangeAndBlurInput(e, "FullName", formik)
                            }
                            name="FullName"
                          />
                          {formik.touched.FullName && formik.errors.FullName ? (
                            <div className="invalid-feedback">
                              {formik.errors.FullName}
                            </div>
                          ) : null}
                        </div>
                        <div class="mb-3 col-sm-6">
                          <label for="Email" class="form-label">
                            Email Address
                          </label>
                          <input
                            type="email"
                            class={`form-control ${
                              formik.touched.Email
                                ? formik.errors.Email
                                  ? "is-invalid"
                                  : "is-valid"
                                : ""
                            }`}
                            id="Email"
                            aria-describedby="emailHelp"
                            value={formik.values.Email}
                            onChange={(e) =>
                              validateChangeAndBlurInput(e, "Email", formik)
                            }
                            name="Email"
                          />
                          {formik.touched.Email && formik.errors.Email ? (
                            <div className="invalid-feedback">
                              {formik.errors.Email}
                            </div>
                          ) : null}
                        </div>
                        <div class="mb-3 col-sm-6">
                          <label for="Password" class="form-label">
                            Password
                          </label>
                          <input
                            type="text"
                            class={`form-control ${
                              formik.touched.Password
                                ? formik.errors.Password
                                  ? "is-invalid"
                                  : "is-valid"
                                : ""
                            }`}
                            id="Password"
                            value={formik.values.Password}
                            onChange={(e) =>
                              validateChangeAndBlurInput(e, "Password", formik)
                            }
                            name="Password"
                          />

                          {formik.touched.Password && formik.errors.Password ? (
                            <div className="invalid-feedback">
                              {formik.errors.Password}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <a
                        class="btn btn-primary w-100 py-8 fs-10 mb-4 rounded-2"
                        onClick={handleRegister}
                      >
                        Sign Up
                      </a>
                      <div class="d-flex align-items-center justify-content-center">
                        <Link class="text-primary fw-bold ms-2" to={"/login"}>
                          Sign In
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
