import { FormValues, FormErrors } from "../models/validationTypes";

export const validateForm = (values: FormValues): FormErrors => {
  let errors: FormErrors = {};

  if (!values.email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = "Email address is invalid.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  }
  else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters long.";
  }
  return errors;
};
