import { http } from "./http.js";

export const pagesService = {
  list: (section) => http.get(`/api/pages${section ? `?section=${section}` : ""}`),
  get: (section, slug) => http.get(`/api/pages/${section}/${slug}`),
};
