import { http } from "./http.js";

export const faqsService = {
  list: (category) => http.get(`/api/faqs${category ? `?category=${category}` : ""}`),
};
