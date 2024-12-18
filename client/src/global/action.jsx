export const FORMDATA = "FORMDATA";

export const formData = (payload) => {
  return {
    type: FORMDATA,
    payload,
  };
};
