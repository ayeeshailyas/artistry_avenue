const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const TOKEN_KEY = "aa_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      "Can't reach the Artistry Avenue server. Make sure the backend is running.",
      0
    );
  }

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    throw new ApiError(data?.error || "Something went wrong. Please try again.", res.status);
  }
  return data;
}

export const api = {
  // auth
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  me: () => request("/auth/me", { auth: true }),
  updateProfile: (payload) => request("/auth/me", { method: "PATCH", body: payload, auth: true }),

  // products
  getProducts: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/products${qs ? `?${qs}` : ""}`);
  },
  getProduct: (id) => request(`/products/${id}`),
  getRelated: (id) => request(`/products/${id}/related`),
  getCategories: () => request("/categories"),

  // wishlist
  getWishlist: () => request("/wishlist", { auth: true }),
  addToWishlist: (productId) => request(`/wishlist/${productId}`, { method: "POST", auth: true }),
  removeFromWishlist: (productId) => request(`/wishlist/${productId}`, { method: "DELETE", auth: true }),

  // orders
  createOrder: (payload) => request("/orders", { method: "POST", body: payload, auth: true }),
  getOrders: () => request("/orders", { auth: true }),
  getOrder: (id) => request(`/orders/${id}`, { auth: true }),
};

export { ApiError };
