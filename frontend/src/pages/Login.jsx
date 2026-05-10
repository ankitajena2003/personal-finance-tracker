import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Code, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", res.data.user.name);
      localStorage.setItem("userEmail", email);

      if (!localStorage.getItem("isNewUser")) {
        localStorage.setItem("loginType", "returning");
      }

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 overflow-hidden">
      {/* LEFT PANEL - Decorative */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-indigo-700">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 opacity-90" />
        
        {/* Abstract Shapes */}
        <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" />

        <div className="relative z-10 flex flex-col justify-center p-20 text-white">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl font-extrabold mb-6 tracking-tight">
              Save<span className="text-indigo-200">Smart</span>
            </h1>
            <p className="text-xl text-indigo-50 mb-12 max-w-md leading-relaxed">
              Master your finances with our intuitive tracking and insightful analytics. Your journey to financial freedom starts here.
            </p>

            <div className="space-y-6">
              {[
                { icon: "💰", text: "Effortless Income Tracking" },
                { icon: "📉", text: "Smart Expense Categorization" },
                { icon: "📊", text: "Detailed Financial Reports" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 w-fit"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Floating Credit Card Mockup */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-[-10%] w-80 h-48 bg-gradient-to-tr from-white/20 to-white/5 backdrop-blur-2xl border border-white/30 rounded-3xl p-6 shadow-2xl rotate-[-12deg]"
        >
          <div className="w-12 h-10 bg-yellow-400/80 rounded-lg mb-8" />
          <div className="h-4 w-48 bg-white/20 rounded-full mb-3" />
          <div className="h-4 w-32 bg-white/20 rounded-full" />
        </motion.div>
      </div>

      {/* RIGHT PANEL - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-500">Please enter your details to sign in</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm flex items-center gap-3 border border-red-100"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                placeholder="Email Address"
                className="input-modern"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="input-modern"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                Remember me
              </label>
              <button type="button" className="text-sm font-semibold text-purple-600 hover:text-purple-700">
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Social Logins */}
          <div className="mt-8">
            <div className="relative mb-8 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <span className="relative px-4 text-sm text-gray-400 bg-gray-50">Or continue with</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors font-medium text-gray-700">
                <Globe className="w-5 h-5" /> Google
              </button>
              <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors font-medium text-gray-700">
                <Code className="w-5 h-5" /> Github
              </button>
            </div>
          </div>

          <p className="text-center text-gray-600 mt-10">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-purple-600 font-bold hover:underline underline-offset-4"
            >
              Create one for free
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
