import { http } from "./http.js";

export const resourcesService = {
  list: (type = "") => http.get(`/api/resources${type ? `?type=${type}` : ""}`),
  get: (slug) => http.get(`/api/resources/${slug}`),
};
