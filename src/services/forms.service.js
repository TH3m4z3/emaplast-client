import { http } from "./http.js";

export const formsService = {
  submit: (type, payload) => http.post(`/api/forms/${type}`, payload),
};
