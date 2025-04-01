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

function ForgotPass() {
    const {changpassWord} = useAuth();
    const navigate = useNavigate();

    const validate = (values) => {
        const errors  = {};
        if (!values.username) {
            errors.username = "Please enter your usename";
        } else if (values.username.length <= 3) {
        errors.username = "Username must be at least 3 characters";
        } else if (values.username.length >= 50) {
        errors.username = "Username must not exceed 50 characters";
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


          if (!values.newPassword) {
            errors.newPassword = "Please enter your password";
          } else if (
            !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(
              values.newPassword
            )
          ) {
            errors.newPassword =
              "Confirm Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character";
          } else if(values.newPassword !== values.Password) {
            errors.newPassword = "Confirm password not same password"
          }
        return errors;
    }

    const handleChangePass = async () => {
        try {
            const {success,data} = await changpassWord(formMilk.values);
            console.log(success,data)
            if(success) {
                toast.success(data.message);
                navigate('/login')
            } else {
                toast.error(data != undefined ? data.message : "Error server" );
            }
        } catch (err) {
            toast.error(err)
        }
        
    }

    const formMilk = useFormik({
        initialValues: {
            username: '',
            Password: '',
            newPassword: '',
        },
        validate
    })
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
              style={{ marginTop: "6.25rem" }}
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
                              formMilk.touched.username
                                ? formMilk.errors.username
                                  ? "is-invalid"
                                  : "is-valid"
                                : ""
                            }`}
                            id="username"
                            name="username"
                            onChange={(e) => {
                              validateChangeAndBlurInput(e, "username", formMilk);
                            }}
                            value={formMilk.values.username}
                            aria-describedby="emailHelp"
                          />
                          {formMilk.touched.username && formMilk.errors.username ? (
                            <div className="invalid-feedback">
                              {formMilk.errors.username}
                            </div>
                          ) : null}
                        </div>
                        <div class="mb-4">
                          <label for="Password" class="form-label">
                            Password
                          </label>
                          <input
                            type="password"
                            onChange={(e) => {
                              validateChangeAndBlurInput(e, "Password", formMilk);
                            }}
                            class={`form-control ${
                                formMilk.touched.Password
                                ? formMilk.errors.Password
                                  ? "is-invalid"
                                  : "is-valid"
                                : ""
                            }`}
                            value={formMilk.values.Password}
                            id="Password"
                            name="Password"
                          />
    
                          {formMilk.touched.Password && formMilk.errors.Password ? (
                            <div className="invalid-feedback">
                              {formMilk.errors.Password}
                            </div>
                          ) : null}
                        </div>


                        <div class="mb-4">
                          <label for="newPassword" class="form-label">
                            Confirm Password
                          </label>
                          <input
                            type="password"
                            onChange={(e) => {
                              validateChangeAndBlurInput(e, "newPassword", formMilk);
                            }}
                            class={`form-control ${
                                formMilk.touched.newPassword
                                ? formMilk.errors.newPassword
                                  ? "is-invalid"
                                  : "is-valid"
                                : ""
                            }`}
                            value={formMilk.values.newPassword}
                            id="newPassword"
                            name="newPassword"
                          />
    
                          {formMilk.touched.newPassword && formMilk.errors.newPassword ? (
                            <div className="invalid-feedback">
                              {formMilk.errors.newPassword}
                            </div>
                          ) : null}
                        </div>


                        <a
                        type="submit"
                        onClick={() => handleChangePass()}
                        class="btn btn-primary w-100 py-8 fs-6 mb-4 rounded-2"
                        >
                            Change Pass
                        </a>

                        <Link class="text-primary fw-bold ms-2" to={"/login"}>
                            Sign In
                          </Link>
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