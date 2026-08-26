import { http } from "./http.js";

export const productsService = {
  list: (query = "") => http.get(`/api/products${query}`),
  get: (slug) => http.get(`/api/products/${slug}`),
};
