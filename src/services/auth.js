import api from "./api";
import { DEMO_MODE } from "../config";

const demoUser = (name, email, role = "user") => ({
  _id: "demo-" + Date.now(),
  name: name || "Người dùng Demo",
  email: email || "demo@codefit.vn",
  level: "Beginner",
  xp: 0,
  role: role || "user",
  aiUsageLeft: 10,
});

export const authService = {
  async register(name, email, password) {
    if (DEMO_MODE) {
      const user = demoUser(name, email, "user");
      localStorage.setItem("token", "demo-token");
      localStorage.setItem("user", JSON.stringify(user));
      return { token: "demo-token", user };
    }
    const { data } = await api.post("/auth/register", { name, email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data;
  },

  async login(email, password) {
    if (DEMO_MODE) {
      const isAdmin = email === "admin@codefit.vn" || email === "admin@codefit.dev";
      const user = demoUser(
        isAdmin ? "Admin" : "Người dùng Demo",
        email,
        isAdmin ? "admin" : "user"
      );
      localStorage.setItem("token", "demo-token");
      localStorage.setItem("user", JSON.stringify(user));
      return { token: "demo-token", user };
    }
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data;
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  },

  getUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    return localStorage.getItem("token");
  },

  isLoggedIn() {
    return !!localStorage.getItem("token");
  },
};
