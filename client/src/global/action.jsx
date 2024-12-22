export const FORMDATA = "FORMDATA";
export const LOGIN_EMAIL = "LOGIN_EMAIL";
export const IS_LOGIN = "IS_LOGIN";
export const ROLE_UPDATER = "ROLE_UPDATER";
export const RESET_SIGNUP_FORM = "RESET_SIGNUP_FORM";
export const RESET_PASSWORD_FORM = "RESET_PASSWORD_FORM";
export const DETAIL_PAGE_DATA = "DETAIL_PAGE_DATA";
export const formData = (payload) => {
  return {
    type: FORMDATA,
    payload,
  };
};

export const detailPageData = (payload) => {
  return {
    type: DETAIL_PAGE_DATA,
    payload,
  };
};

export const resetPasswordForm = (payload) => {
  return {
    type: RESET_PASSWORD_FORM,
    payload,
  };
};

export const roleUpdater = (payload) => {
  return {
    type: ROLE_UPDATER,
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
