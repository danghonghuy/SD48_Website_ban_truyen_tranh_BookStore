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
    if (!values.username) {
      errors.username = "Please enter your usename";
    } else if (values.username.length <= 3) {
      errors.username = "Username must be at least 3 characters";
    } else if (values.username.length >= 50) {
      errors.username = "Username must not exceed 50 characters";
    }

    if (!values.email) {
      errors.email = "Required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = "Invalid email address";
    }

    return errors;
  };

  const handleForgotPass = async () => {
    try {
      const { success, data } = await forgotPassword(formMilk.values);
      if (data.success) {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data != undefined ? data.message : "Error server");
      }
    } catch (err) {
      toast.error(err);
    }
  };

  const formMilk = useFormik({
    initialValues: {
      username: "",
      email: "",
    },
    validate,
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
                  <form>
                    <div class="mb-3">
                      <label htmlFor="username" class="form-label">
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
                      <label htmlFor="email" class="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        onChange={(e) => {
                          validateChangeAndBlurInput(e, "email", formMilk);
                        }}
                        class={`form-control ${
                          formMilk.touched.email
                            ? formMilk.errors.email
                              ? "is-invalid"
                              : "is-valid"
                            : ""
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

                    <a
                      type="submit"
                      onClick={() => handleForgotPass()}
                      class="btn btn-primary w-100 py-8 fs-6 mb-4 rounded-2"
                    >
                      Send Email
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
