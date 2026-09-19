import { useState } from "react";
import { Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import PageTransition from "../components/PageTransition";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) return <Navigate to="/account" replace />;

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const result = login(form);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    showToast("Welcome back!");
    navigate(location.state?.from?.pathname || "/account", { replace: true });
  }

  return (
    <PageTransition>
      <div className="max-w-md mx-auto px-5 py-20">
        <div className="text-center mb-10">
          <img src="/logo.png" alt="Artistry Avenue" className="w-16 h-16 rounded-full mx-auto mb-5" />
          <h1 className="font-display text-3xl text-plum mb-2">Welcome Back</h1>
          <p className="text-stone text-sm">Sign in to track orders, wishlist and more.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-stone">Email</span>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="bg-transparent border-b border-plum/30 focus:border-wine py-2 text-sm text-plum outline-none transition-colors"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-stone">Password</span>
            <div className="flex items-center border-b border-plum/30 focus-within:border-wine transition-colors">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                minLength={6}
                value={form.password}
                onChange={handleChange}
                className="bg-transparent py-2 text-sm text-plum outline-none flex-1"
              />
              <button type="button" onClick={() => setShowPassword((s) => !s)} className="text-stone">
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </label>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            className="bg-plum text-paper text-sm tracking-wide py-3.5 rounded-pill hover:bg-wine transition-colors duration-300 mt-2"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-stone mt-8">
          New to Artistry Avenue?{" "}
          <Link to="/signup" className="text-wine link-grow">Create an account</Link>
        </p>
      </div>
    </PageTransition>
  );
}
