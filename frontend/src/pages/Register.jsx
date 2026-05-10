import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!name.trim() || !email.trim() || !password) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }

    try {
      const payload = { name: name.trim(), email: email.trim(), password };
      await api.post("/auth/register", payload);
      localStorage.setItem("isNewUser", "true");
      setShowSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!showSuccess) return;
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);
    return () => clearTimeout(timer);
  }, [showSuccess, navigate]);

  return (
    <div className="min-h-screen flex bg-gray-50 overflow-hidden relative">
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-900/40 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-12 shadow-2xl text-center max-w-sm mx-4"
            >
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Success!</h2>
              <p className="text-gray-500 mb-8">Your account has been created. Redirecting to login...</p>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3 }}
                  className="bg-green-500 h-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT PANEL - Decorative */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-indigo-700">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500 opacity-90" />
        
        {/* Animated Background Elements */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-white/5 rounded-[100px] blur-3xl"
        />
        
        <div className="relative z-10 flex flex-col justify-center p-20 text-white">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl font-extrabold mb-6 tracking-tight">
              Save<span className="text-purple-200">Smart</span>
            </h1>
            <p className="text-xl text-purple-50 mb-12 max-w-md leading-relaxed">
              Join our community and start your journey towards financial excellence. Take control of your money today.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "10k+", sub: "Active Users" },
                { label: "100%", sub: "Secure" },
                { label: "24/7", sub: "Support" },
                { label: "Free", sub: "Forever" },
              ].map((stat, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center">
                  <div className="text-2xl font-bold">{stat.label}</div>
                  <div className="text-xs text-purple-200 uppercase tracking-widest mt-1">{stat.sub}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* RIGHT PANEL - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-500">Sign up to get started with SaveSmart</p>
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
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Full Name"
                className="input-modern"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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
                placeholder="Create Password"
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

            <div className="px-1">
              <p className="text-xs text-gray-500 leading-relaxed">
                By signing up, you agree to our <span className="text-purple-600 cursor-pointer font-medium hover:underline">Terms of Service</span> and <span className="text-purple-600 cursor-pointer font-medium hover:underline">Privacy Policy</span>.
              </p>
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
                  Create Account
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-10">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-purple-600 font-bold hover:underline underline-offset-4"
            >
              Sign In here
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
