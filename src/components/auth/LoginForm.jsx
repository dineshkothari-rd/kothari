import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";
import { useNavigate, Link } from "react-router-dom";
import Button from "../common/Button";

function InputField({ label, type, name, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
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

      // Login ke turant baad Firestore check karo
      const adminRef = doc(db, "admins", result.user.email);
      const adminSnap = await getDoc(adminRef);

      if (adminSnap.exists()) {
        navigate("/admin");
      } else {
        // Admin nahi hai — logout karo aur error dikhao
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
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 w-full max-w-md mx-auto flex flex-col gap-5">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Welcome Back 👋
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Admin login only
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
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

      <Button variant="primary" onClick={handleLogin} className="w-full">
        {loading ? "Logging in..." : "Login"}
      </Button>
    </div>
  );
}
