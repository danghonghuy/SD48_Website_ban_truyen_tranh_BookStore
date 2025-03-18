export const validateChangeAndBlurInput = (e, fieldName, formik) => {
  formik.handleChange(e);
  formik.setFieldTouched(fieldName, true, false);
  formik.validateField(fieldName);
};
