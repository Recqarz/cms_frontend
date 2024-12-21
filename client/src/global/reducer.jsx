import {
  DETAIL_PAGE_DATA,
  FORMDATA,
  IS_LOGIN,
  LOGIN_EMAIL,
  RESET_PASSWORD_FORM,
  RESET_SIGNUP_FORM,
  ROLE_UPDATER,
} from "./action";

const initState = {
  formData: {
    name: "",
    email: "",
    mobile: "",
    role: "",
    address: "",
    state: "",
    district: "",
    companyName: "",
    companyAddress: "",
    bankName: "",
    bankAddress: "",
    userDegisnation: "",
    password: "",
    confirmPassword: "",
    pinCode: "",
  },
  resetPasswordForm: {
    email: "",
    mobile: "",
  },
  detailPageData: "",
  loginEmail: "",
  isLogin: localStorage.getItem("cmstoken") ? true : false,
  role: localStorage.getItem("cmstoken")
    ? JSON.parse(localStorage.getItem("cmsrole"))
    : "",
};

export function Reducer(state = initState, action) {
  switch (action.type) {
    case FORMDATA:
      return { ...state, formData: { ...state.formData, ...action.payload } };
    case LOGIN_EMAIL:
      return { ...state, loginEmail: action.payload };
    case IS_LOGIN:
      return { ...state, isLogin: action.payload };
    case RESET_SIGNUP_FORM:
      return { ...state, formData: initState.formData };
    case RESET_PASSWORD_FORM:
      return { ...state, resetPasswordForm: action.payload };
    case DETAIL_PAGE_DATA:
      return { ...state, detailPageData: action.payload };
    case ROLE_UPDATER:
      return { ...state, role: action.payload };
    default:
      return state;
  }
}
