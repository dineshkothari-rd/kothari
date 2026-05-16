import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";

const authErrorMessages = {
  "auth/invalid-credential": "Invalid email or password. Please try again.",
  "auth/user-not-found": "Invalid email or password. Please try again.",
  "auth/wrong-password": "Invalid email or password. Please try again.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/too-many-requests": "Too many attempts. Please wait and try again.",
  "auth/network-request-failed": "Network error. Please check your connection.",
  "auth/unauthorized-domain":
    "This domain is not authorized in Firebase Authentication settings.",
  "auth/configuration-not-found":
    "Firebase Authentication is not configured for this project.",
};

function InputField({ label, type, name, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
      />
    </div>
  );
}

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleLogin() {
    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password,
      );
      if (result.user) {
        navigate("/admin");
      }
    } catch (err) {
      console.error(err);
      setError(
        authErrorMessages[err.code] ||
          "Firebase error. Please check the console for details.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="surface flex flex-col gap-6 p-6 sm:p-8">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">
          Welcome back
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Sign in to your admin account
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <InputField
        label="Email Address"
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="admin@gmail.com"
      />
      <InputField
        label="Password"
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="••••••••"
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full rounded-lg bg-teal-700 py-3 font-bold text-white shadow-sm transition hover:bg-teal-800 disabled:opacity-60 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </div>
  );
}
