import { RegisterFormValues, RegisterFormErrors, LoginFormErrors, LoginFormValues } from "../models/AuthFormType";
import { VideoFormErrors, VideoFormValues } from "../models/VideoFormType";

export const validateRegisterForm = (values: RegisterFormValues): RegisterFormErrors => {
  let errors: RegisterFormErrors = {};

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

  if (!values.firstName) {
    errors.firstName = "First name is required.";
  }
  else if (values.firstName.length < 2) {
    errors.firstName = "First name must be at least 2 characters long.";
  }

  if (!values.lastName) {
    errors.lastName = "Last name is required.";
  }
  else if (values.lastName.length < 2) {
    errors.lastName = "Last name must be at least 2 characters long.";
  }
  return errors;
};

export const validateLoginForm = (values: LoginFormValues): LoginFormErrors => {
  let errors: LoginFormErrors = {};

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
}

export const validateVideoForm = (values: VideoFormValues): VideoFormErrors => {
  let errors: VideoFormErrors = {};

  if (!values.title) {
    errors.title = "Title is required";
  }

  if (!values.url) {
    errors.url = "URL is required";
  }

  return errors;
}