import { FormValues, FormErrors } from "../types/validationTypes";

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
  else if (values.password.length < 7) {
    errors.password = "Password must be at least 7 characters long.";
  }
  return errors;
};
