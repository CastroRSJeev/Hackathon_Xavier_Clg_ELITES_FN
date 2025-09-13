// lib/authService.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function login(email, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("user", JSON.stringify(data));
      return { success: true, user: data };
    } else {
      return { success: false, error: data.message || "Login failed" };
    }
  } catch (err) {
    return { success: false, error: "Network error" };
  }
}

export async function register(userData) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("user", JSON.stringify(data));
      return { success: true, user: data };
    } else {
      return { success: false, error: data.message || "Registration failed" };
    }
  } catch (err) {
    return { success: false, error: "Network error" };
  }
}

export function logout() {
  localStorage.removeItem("user");
}
