import { http } from "./http.js";

export const sectorsService = {
  list: () => http.get("/api/sectors"),
  get: (slug) => http.get(`/api/sectors/${slug}`),
};
