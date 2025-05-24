import React from "react";
// import useTranslate from "@lang"; // Bỏ nếu không dùng
import useAuth from "@api/useAuth";
import { useNavigate } from "react-router-dom"; // Bỏ Link nếu không có link nào khác ngoài submit
import useUser from "@store/useUser";
import { toast } from "react-toastify"; // Bỏ ToastContainer, message, notification nếu đã có ở App.js
import "react-toastify/dist/ReactToastify.css";
import img1 from "./assets/images/logos/dark-logo.svg"; // Đảm bảo hình ảnh này phù hợp, hoặc bỏ đi nếu không cần
import "@styles/scss/custom-input.scss"; // Đảm bảo đường dẫn đúng
import "./assets/css/styles.min.css";   // Đảm bảo đường dẫn đúng
// import * as Yup from "yup"; // Bỏ nếu dùng hàm validate riêng
import { useFormik } from "formik";
// import { validateChangeAndBlurInput } from "@utils/validateChangeAndBlurInput"; // Cân nhắc bỏ

function ResetPassClient() {
  const { changpassWord } = useAuth(); // API để người dùng tự đổi mật khẩu
  const { username } = useUser(); // Lấy username của người dùng hiện tại
  const navigate = useNavigate();

  // Hàm validate (đã Việt hóa và chỉnh sửa cho 3 trường mật khẩu)
  const validate = (values) => {
    const errors = {};

    if (!values.OldPassword) { // Thêm trường mật khẩu cũ
      errors.OldPassword = "Vui lòng nhập mật khẩu hiện tại của bạn";
    }

    if (!values.Password) { // Đây là mật khẩu mới
      errors.Password = "Vui lòng nhập mật khẩu mới";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        values.Password
      )
    ) {
      errors.Password =
        "Mật khẩu mới cần ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt";
    }

    if (!values.newPassword) { // Đây là xác nhận mật khẩu mới
      errors.newPassword = "Vui lòng xác nhận mật khẩu mới";
    } else if (values.newPassword !== values.Password) {
      errors.newPassword = "Mật khẩu xác nhận không khớp với mật khẩu mới";
    }
    return errors;
  };

  const handleChangePass = async (formValues) => {
    try {
      const payload = {
        username: username, // Username của người dùng đang đăng nhập
        oldPassword: formValues.OldPassword,
        newPassword: formValues.Password, // Mật khẩu mới
      };
      const { success, data } = await changpassWord(payload);

      if (success && data?.success) { // Kiểm tra kỹ điều kiện thành công
        toast.success(data.message || "Đổi mật khẩu thành công!");
        // Có thể điều hướng người dùng ra trang profile hoặc trang chủ
        navigate("/profile"); // Ví dụ: điều hướng về trang profile
      } else {
        toast.error(data?.message || "Đổi mật khẩu không thành công. Vui lòng kiểm tra lại thông tin.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Đã có lỗi xảy ra.");
    }
  };

  const formik = useFormik({ // Đổi formMilk thành formik
    initialValues: {
      OldPassword: "", // Thêm mật khẩu cũ
      Password: "",    // Mật khẩu mới
      newPassword: "", // Xác nhận mật khẩu mới
    },
    validate,
    onSubmit: (values) => {
      handleChangePass(values);
    }
  });

  return (
    // Bỏ các class page-wrapper nếu component này được nhúng vào một layout khác
    // và chỉ giữ lại phần form card.
    // Nếu đây là một trang riêng, có thể giữ lại page-wrapper.
    // Ví dụ này giả sử nó là nội dung chính của một trang/tab.
    <div className="row justify-content-center overflow-hidden py-5"> {/* Thêm py-5 để có khoảng cách */}
      <div className="col-md-10 col-lg-8 col-xxl-6"> {/* Điều chỉnh độ rộng cho phù hợp */}
        <div className="card mb-0">
          <div className="card-body">
            {/* Bỏ logo nếu không cần thiết trong context này, hoặc thay bằng tiêu đề rõ ràng */}
            {/* <a className="text-nowrap logo-img text-center d-block py-3 w-100" href="/">
              <img src={img1} width="180" alt="Logo" />
            </a> */}
            <h3 className="text-center mb-4">Đổi Mật Khẩu</h3> {/* Tiêu đề rõ ràng */}
            {/* <p className="text-center">Your Social Campaigns</p>  Bỏ nếu không liên quan */}
            <form onSubmit={formik.handleSubmit}> {/* Sử dụng formik.handleSubmit */}
              <div className="mb-3"> {/* Sửa mb-4 thành mb-3 cho đồng nhất */}
                <label htmlFor="OldPassword" className="form-label">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  className={`form-control ${
                    formik.touched.OldPassword && formik.errors.OldPassword
                      ? "is-invalid"
                      : formik.touched.OldPassword ? "is-valid" : ""
                  }`}
                  id="OldPassword"
                  name="OldPassword"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.OldPassword}
                />
                {formik.touched.OldPassword && formik.errors.OldPassword ? (
                  <div className="invalid-feedback">
                    {formik.errors.OldPassword}
                  </div>
                ) : null}
              </div>

              <div className="mb-3">
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

              <div className="mb-4"> {/* Giữ mb-4 cho khoảng cách trước nút submit */}
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
                {formik.touched.newPassword && formik.errors.newPassword ? (
                  <div className="invalid-feedback">
                    {formik.errors.newPassword}
                  </div>
                ) : null}
              </div>

              <button // Đổi thẻ <a> thành <button type="submit">
                type="submit"
                className="btn btn-primary w-100 py-8 fs-6 mb-4 rounded-2" // py-8 có thể lớn, cân nhắc py-2 hoặc py-3
                disabled={formik.isSubmitting} // Vô hiệu hóa khi đang submit
              >
                Lưu Thay Đổi
              </button>
              {/* Có thể thêm nút Hủy nếu cần */}
              {/* <button type="button" className="btn btn-light w-100 py-2 fs-6 rounded-2" onClick={() => navigate(-1)}>
                Hủy
              </button> */}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassClient;