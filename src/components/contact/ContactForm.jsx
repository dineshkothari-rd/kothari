import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { AnimatePresence } from "framer-motion";
import { db } from "../../firebase/firebase";
import Button from "../common/Button";
import { fadeUp } from "../common/motionConfig";
import { MotionDiv, MotionForm } from "../common/MotionPrimitives";

const initialState = {
  name: "",
  phone: "",
  email: "",
  roomType: "",
  message: "",
};

function InputField({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
  pattern,
  inputMode,
}) {
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
        required={required}
        pattern={pattern}
        inputMode={inputMode}
        className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
      >
        <option value="">Select room type</option>
        <option value="Single">Single Occupancy — ₹8,000/mo</option>
        <option value="Double">Double Sharing — ₹7,500/mo</option>
        <option value="Triple">Triple Sharing — ₹6,000/mo</option>
        <option value="one-day">One Day Visit — ₹1,000</option>
      </select>
    </div>
  );
}

function TextAreaField({ label, name, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={4}
        className="resize-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
      />
    </div>
  );
}

export default function ContactForm() {
  const [searchParams] = useSearchParams();
  const selectedRoomType = searchParams.get("roomType") || "";
  const [form, setForm] = useState({
    ...initialState,
    roomType: selectedRoomType,
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedRoomType) return;
    setForm((current) => ({ ...current, roomType: selectedRoomType }));
  }, [selectedRoomType]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    const phoneDigits = form.phone.replace(/\D/g, "");

    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    if (phoneDigits.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    if (!emailIsValid) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "enquiries"), {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        roomType: form.roomType,
        message: form.message.trim(),
        status: "New",
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
      setForm(initialState);
    } catch (submitError) {
      setError("Could not send enquiry. Please try again.");
      console.error(submitError);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <MotionDiv
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="card-modern flex min-h-full flex-col items-center justify-center gap-4 rounded-xl p-8 text-center sm:p-10"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-4xl shadow-lg">
          🎉
        </div>
        <h3 className="text-2xl font-extrabold text-gray-800 dark:text-white">
          Enquiry Sent!
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-xs">
          We'll contact you within 24 hours to schedule your visit.
        </p>
        <Button onClick={() => setSubmitted(false)} className="mt-2 px-8">
          Send Another
        </Button>
      </MotionDiv>
    );
  }

  return (
    <MotionForm
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit}
      className="card-modern flex flex-col gap-5 rounded-xl p-5 sm:p-8"
    >
      <div>
        <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white mb-1">
          Book a Free Visit
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Fill in your details and we'll get back to you shortly.
        </p>
      </div>

      <AnimatePresence>
        {error && (
          <MotionDiv
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300"
          >
            {error}
          </MotionDiv>
        )}
      </AnimatePresence>

      <InputField
        label="Full Name *"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Rahul Sharma"
        required
      />
      <InputField
        label="Phone Number *"
        name="phone"
        type="tel"
        value={form.phone}
        onChange={handleChange}
        placeholder="+91 98765 43210"
        required
        inputMode="tel"
        pattern="[0-9+\-\s()]{10,}"
      />
      <InputField
        label="Email Address *"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="rahul@gmail.com"
        required
      />
      <SelectField
        label="Preferred Room Type"
        name="roomType"
        value={form.roomType}
        onChange={handleChange}
      />
      <TextAreaField
        label="Message"
        name="message"
        value={form.message}
        onChange={handleChange}
        placeholder="Any specific requirements or questions..."
      />

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Sending..." : "Send Enquiry"}
      </Button>
    </MotionForm>
  );
}
