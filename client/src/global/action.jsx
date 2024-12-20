export const FORMDATA = "FORMDATA";
export const LOGIN_EMAIL = "LOGIN_EMAIL";
export const IS_LOGIN = "IS_LOGIN";
export const RESET_SIGNUP_FORM = "RESET_SIGNUP_FORM";
export const RESET_PASSWORD_FORM = "RESET_PASSWORD_FORM";
export const formData = (payload) => {
  return {
    type: FORMDATA,
    payload,
  };
};

export const resetPasswordForm = (payload) => {
  return {
    type: RESET_PASSWORD_FORM,
    payload,
  };
};

export const loginEmail = (payload) => {
  return {
    type: LOGIN_EMAIL,
    payload,
  };
};

export const resetSinupForm = () => {
  return {
    type: RESET_SIGNUP_FORM,
  };
};

export const isLogin = (payload) => {
  return {
    type: IS_LOGIN,
    payload,
  };
};
