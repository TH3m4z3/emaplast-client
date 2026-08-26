import { http } from "./http.js";

export const adminService = {
  login: (username, password) => http.post("/api/admin/login", { username, password }),
  me: () => http.get("/api/admin/me"),
  stats: () => http.get("/api/admin/stats"),
  list: (table) => http.get(`/api/admin/${table}`),
  get: (table, id) => http.get(`/api/admin/${table}/${id}`),
  create: (table, payload) => http.post(`/api/admin/${table}`, payload),
  update: (table, id, payload) => http.put(`/api/admin/${table}/${id}`, payload),
  remove: (table, id) => http.del(`/api/admin/${table}/${id}`),
  submissions: () => http.get("/api/admin/submissions"),
  markSubmission: (id, status) => http.put(`/api/admin/submissions/${id}`, { status }),
  settings: () => http.get("/api/admin/settings"),
  saveSettings: (rows) => http.put("/api/admin/settings", rows),
  media: () => http.get("/api/admin/media"),
  upload: (file) => http.upload("/api/admin/media", file),
  deleteMedia: (id) => http.del(`/api/admin/media/${id}`),
};
