import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      // ✅ SAVE TOKEN
      localStorage.setItem("token", res.data.token);

      // ✅ SAVE USER NAME (for sidebar)
      localStorage.setItem("userName", res.data.user.name);

      // ✅ WELCOME POPUP FLAG
      if (!localStorage.getItem("isNewUser")) {
        localStorage.setItem("loginType", "returning");
      }

      navigate("/");
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      {/* LEFT PANEL */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white p-16">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-10 tracking-wide">
            SaveSmart
          </h1>

          <ul className="space-y-6 text-lg">
            <li className="flex items-center gap-3">
              <span className="text-2xl">💰</span> Income Tracking
            </li>
            <li className="flex items-center gap-3">
              <span className="text-2xl">🧾</span> Expense Tracking
            </li>
            <li className="flex items-center gap-3">
              <span className="text-2xl">📊</span> Budget Customization
            </li>
            <li className="flex items-center gap-3">
              <span className="text-2xl">🎯</span> Goal Setting
            </li>
            <li className="flex items-center gap-3">
              <span className="text-2xl">🏦</span> Bill Management
            </li>
          </ul>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-sm px-8 py-12">
          <h2 className="text-3xl font-bold text-purple-600 mb-6 text-center">
            Login
          </h2>

          {error && (
            <p className="text-red-500 text-center mb-4 text-sm">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="
                w-full px-4 py-3 rounded-lg border
                focus:outline-none focus:ring-2 focus:ring-purple-500
                transition
              "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="
                w-full px-4 py-3 rounded-lg border
                focus:outline-none focus:ring-2 focus:ring-purple-500
                transition
              "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />


            <button
              type="submit"
              className="
                w-full py-3 mt-2 rounded-full
                bg-gradient-to-r from-purple-600 to-indigo-600
                text-white font-semibold
                hover:opacity-90 hover:shadow-lg
                transition
              "
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-5">
            New user?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-purple-600 font-semibold cursor-pointer hover:underline"
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
