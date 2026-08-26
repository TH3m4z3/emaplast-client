import { http } from "./http.js";

export const settingsService = {
  get: () => http.get("/api/settings"),
};
