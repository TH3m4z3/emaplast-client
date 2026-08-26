const TOKEN_KEY = "emaplast_admin_token";

function resolveApiBase() {
  const fromEnv = String(import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (typeof window === "undefined") return "";
  const { hostname, protocol } = window.location;
  if (hostname === "localhost" || hostname === "127.0.0.1") return "";
  if (hostname.includes("-client.")) {
    return `${protocol}//${hostname.replace("-client.", "-server.")}`;
  }
  return "";
}

export const API_BASE = resolveApiBase();

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (!(options.body instanceof FormData)) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Request failed");
  }
  if (res.headers.get("content-type")?.includes("text/csv")) return res.text();
  return res.json();
}

export const http = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: "PUT", body: JSON.stringify(body) }),
  del: (path) => request(path, { method: "DELETE" }),
  upload: (path, file) => {
    const fd = new FormData();
    fd.append("file", file);
    return request(path, { method: "POST", body: fd });
  },
};

export function tField(row, lang, key) {
  return row?.[`${key}_${lang}`] || row?.[`${key}_fr`] || "";
}
