import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import PageTransition from "../components/PageTransition";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Signup() {
  const { signup, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) return <Navigate to="/account" replace />;

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }
    const result = signup(form);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    showToast("Account created — welcome to the Avenue!");
    navigate("/account", { replace: true });
  }

  return (
    <PageTransition>
      <div className="max-w-md mx-auto px-5 py-20">
        <div className="text-center mb-10">
          <img src="/logo.png" alt="Artistry Avenue" className="w-16 h-16 rounded-full mx-auto mb-5" />
          <h1 className="font-display text-3xl text-plum mb-2">Create Your Account</h1>
          <p className="text-stone text-sm">Join for faster checkout, order history and a saved wishlist.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-stone">Full Name</span>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="bg-transparent border-b border-plum/30 focus:border-wine py-2 text-sm text-plum outline-none transition-colors"
            />
          </label>
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
            Create Account
          </button>
        </form>

        <p className="text-center text-sm text-stone mt-8">
          Already have an account?{" "}
          <Link to="/login" className="text-wine link-grow">Sign in</Link>
        </p>
      </div>
    </PageTransition>
  );
}
