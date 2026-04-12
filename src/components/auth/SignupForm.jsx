import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase/firebase";
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

export default function SignupForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleSignup() {
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError("Please fill in all fields");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password,
      );
      await updateProfile(result.user, { displayName: form.name });
      navigate("/tenant");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please login.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 w-full max-w-md mx-auto flex flex-col gap-5">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Create Account 🏠
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Join Kothari PG today
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <InputField
        label="Full Name"
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Rahul Sharma"
      />
      <InputField
        label="Email Address"
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="rahul@gmail.com"
      />
      <InputField
        label="Password"
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Min 6 characters"
      />
      <InputField
        label="Confirm Password"
        type="password"
        name="confirm"
        value={form.confirm}
        onChange={handleChange}
        placeholder="Repeat password"
      />

      <Button variant="primary" onClick={handleSignup} className="w-full">
        {loading ? "Creating account..." : "Create Account"}
      </Button>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
