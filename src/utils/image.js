import { API_BASE } from "../services/http.js";

export function mediaUrl(url, fallback = "/brand/pallets.jpg") {
  if (!url) return fallback;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/uploads") || url.startsWith("/images")) return `${API_BASE}${url}`;
  return url;
}
