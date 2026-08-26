import { http } from "./http.js";

export const jobsService = {
  list: () => http.get("/api/jobs"),
};
