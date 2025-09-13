"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, IdCard, Building } from "lucide-react";
import { login as loginService, register as registerService } from "./Services/AuthService";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    id: "",
    department: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const router = useRouter();

  // Load saved user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let response;

    if (isLogin) {
      response = await loginService(formData.email, formData.password);
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        setLoading(false);
        return;
      }
      response = await registerService({
        name: formData.name,
        id: formData.id,
        department: formData.department,
        email: formData.email,
        password: formData.password,
      });
    }

    setLoading(false);

    if (!response) {
      alert("Authentication failed: no response from server");
      return;
    }

    if (response.success) {
      setUser(response.user);
      router.push("/dashboard");
    } else {
      alert(response.error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-green-100 to-yellow-100 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-blue-600 via-green-600 to-yellow-500 bg-clip-text text-transparent">
          {isLogin ? "Welcome Back 👋" : "Create Your Account 🚀"}
        </h1>
        <p className="text-center text-gray-500 mt-2">
          {isLogin
            ? "Sign in to continue to your dashboard"
            : "Join now and explore your dashboard"}
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                <User className="text-gray-400 w-5 h-5 mr-2" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full outline-none"
                  required
                />
              </div>

              <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                <IdCard className="text-gray-400 w-5 h-5 mr-2" />
                <input
                  type="text"
                  name="id"
                  placeholder="Student / Employee ID"
                  value={formData.id}
                  onChange={handleChange}
                  className="w-full outline-none"
                  required
                />
              </div>

              <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                <Building className="text-gray-400 w-5 h-5 mr-2" />
                <input
                  type="text"
                  name="department"
                  placeholder="Department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full outline-none"
                  required
                />
              </div>
            </>
          )}

          <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
            <Mail className="text-gray-400 w-5 h-5 mr-2" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full outline-none"
              required
            />
          </div>

          <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
            <Lock className="text-gray-400 w-5 h-5 mr-2" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full outline-none"
              required
            />
          </div>

          {!isLogin && (
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <Lock className="text-gray-400 w-5 h-5 mr-2" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full outline-none"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50"
            disabled={loading}
          >
            {loading
              ? isLogin
                ? "Signing In..."
                : "Signing Up..."
              : isLogin
              ? "Sign In"
              : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            className="text-green-600 font-semibold hover:underline"
            onClick={() => setIsLogin(!isLogin)}
            type="button"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}
