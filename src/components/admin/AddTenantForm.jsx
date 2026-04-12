import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import Button from "../common/Button";

const allServices = [
  "WiFi",
  "Meals",
  "Laundry",
  "Parking",
  "AC",
  "Power Backup",
];

const initialForm = {
  name: "",
  phone: "",
  email: "",
  room: "",
  rent: "",
  moveInDate: "",
  services: [],
};

function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
}) {
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

export default function AddTenantForm({ onClose, onSuccess }) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  function toggleService(service) {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  }

  async function handleSubmit() {
    if (!form.name || !form.phone || !form.room || !form.rent) {
      setError("Name, phone, room and rent are required");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "tenants"), {
        name: form.name,
        phone: form.phone,
        email: form.email,
        room: form.room,
        rent: Number(form.rent),
        moveInDate: form.moveInDate,
        services: form.services,
        status: "active",
        createdAt: serverTimestamp(),
      });
      onSuccess?.();
      onClose?.();
    } catch (err) {
      setError("Error adding tenant: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 py-8 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            ➕ Add New Tenant
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Personal Details
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Full Name *"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Rahul Sharma"
          />
          <InputField
            label="Phone *"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
          />
          <InputField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="rahul@gmail.com"
          />
        </div>

        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Room Details
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Room *"
            name="room"
            value={form.room}
            onChange={handleChange}
            placeholder="101 - Single"
          />
          <InputField
            label="Monthly Rent (₹) *"
            name="rent"
            type="number"
            value={form.rent}
            onChange={handleChange}
            placeholder="8000"
          />
          <InputField
            label="Move In Date"
            name="moveInDate"
            type="date"
            value={form.moveInDate}
            onChange={handleChange}
          />
        </div>

        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Services Included
        </p>
        <div className="flex flex-wrap gap-2">
          {allServices.map((service) => (
            <button
              key={service}
              type="button"
              onClick={() => toggleService(service)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                form.services.includes(service)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              }`}
            >
              {service}
            </button>
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} className="flex-1">
            {loading ? "Adding..." : "Add Tenant"}
          </Button>
        </div>
      </div>
    </div>
  );
}
