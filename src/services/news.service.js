import { http } from "./http.js";

export const newsService = {
  list: () => http.get("/api/news"),
  get: (slug) => http.get(`/api/news/${slug}`),
};
