import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });

      // 🔥 mark user as new (for dashboard welcome)
      localStorage.setItem("isNewUser", "true");

      // 🔥 show success popup
      setShowSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  // auto redirect after popup
  useEffect(() => {
    if (!showSuccess) return;

    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [showSuccess, navigate]);

  return (
    <div className="min-h-screen flex font-sans relative">
      {/* 🎉 SUCCESS POPUP */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div
            className="
              bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600
              text-white rounded-3xl px-16 py-14
              shadow-[0_0_80px_rgba(99,102,241,0.7)]
              animate-scaleIn text-center
            "
          >
            <h2 className="text-4xl font-bold mb-4">
              🎉 Congratulations!
            </h2>
            <p className="text-xl opacity-95">
              You registered successfully 🎊
            </p>
          </div>
        </div>
      )}

      {/* LEFT PANEL */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white p-20">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-6 tracking-wide">
            SaveSmart
          </h1>

          <p className="text-lg text-white/90 mb-10 leading-relaxed">
            Join thousands of users who manage their money smarter every day.
          </p>

          <div className="space-y-5 text-base">
            <div className="flex items-center gap-3">
              <span className="text-xl">✔</span>
              Simple & secure tracking
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl">✔</span>
              Monthly budget insights
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl">✔</span>
              Visual expense breakdown
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl">✔</span>
              Works on all devices
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md px-10 py-14">
          <h2 className="text-3xl font-bold text-purple-600 mb-2 text-center">
            Create Account
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Start managing your finances today
          </p>

          {error && (
            <p className="text-red-500 text-center mb-4 text-sm">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full py-3 mt-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:shadow-xl hover:opacity-90 transition"
            >
              Register              
            </button>
            <p className="text-center text-sm text-gray-600 mt-4">
  Already have an account?{" "}
  <span
    onClick={() => navigate("/login")}
    className="text-purple-600 font-semibold cursor-pointer hover:underline"
  >
    Login
  </span>
</p>          </form>
        </div>
      </div>
    </div>
  );
}
