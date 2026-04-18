import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";

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
      const adminRef = doc(db, "admins", result.user.email);
      const adminSnap = await getDoc(adminRef);
      if (adminSnap.exists()) {
        navigate("/admin");
      } else {
        await auth.signOut();
        setError("Access denied. You are not an admin.");
      }
    } catch (err) {
      console.error(err);
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white mb-1">
          Welcome back 👋
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
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
        className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-full font-bold hover:opacity-90 transition shadow-md disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </div>
  );
}
