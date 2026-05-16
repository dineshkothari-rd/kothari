import { useState } from "react";
import Button from "../common/Button";

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
        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
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
        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
      >
        <option value="">Select room type</option>
        <option value="Single">Single Occupancy — ₹8,000/mo</option>
        <option value="Double">Double Sharing — ₹5,500/mo</option>
        <option value="Triple">Triple Sharing — ₹4,000/mo</option>
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
        className="resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
      />
    </div>
  );
}

export default function ContactForm() {
  const [form, setForm] = useState(initialState);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.name || !form.phone || !form.email) {
      alert("Please fill in all required fields");
      return;
    }
    setSubmitted(true);
    setForm(initialState);
  }

  if (submitted) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-10">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-4xl shadow-lg">
          🎉
        </div>
        <h3 className="text-2xl font-extrabold text-gray-800 dark:text-white">
          Enquiry Sent!
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-xs">
          We'll contact you within 24 hours to schedule your visit.
        </p>
        <Button
          onClick={() => setSubmitted(false)}
          className="mt-2 px-8"
        >
          Send Another
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8"
    >
      <div>
        <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white mb-1">
          Book a Free Visit 🏠
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Fill in your details and we'll get back to you shortly.
        </p>
      </div>

      <InputField
        label="Full Name *"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Rahul Sharma"
      />
      <InputField
        label="Phone Number *"
        name="phone"
        type="tel"
        value={form.phone}
        onChange={handleChange}
        placeholder="+91 98765 43210"
      />
      <InputField
        label="Email Address *"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="rahul@gmail.com"
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

      <Button type="submit" className="w-full">
        Send Enquiry
      </Button>
    </form>
  );
}
