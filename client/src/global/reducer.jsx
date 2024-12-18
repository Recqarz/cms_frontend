import { FORMDATA } from "./action";

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
    designation: "",
    password: "",
    confirmPassword: "",
    pinCode: "",
  },
};

export function Reducer(state = initState, action) {
  switch (action.type) {
    case FORMDATA:
      return { ...state, formData: { ...state.formData, ...action.payload } };
    default:
      return state;
  }
}
