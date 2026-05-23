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
  moveOutDate: "",
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
        className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm scheme-light-dark"
      />
    </div>
  );
}

export default function AddTenantForm({ onClose, onSuccess }) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [idFile, setIdFile] = useState(null);
  const [idPreview, setIdPreview] = useState(null);
  const [idBase64, setIdBase64] = useState(null);

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

  function handleIdFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
    ];
    if (!validTypes.includes(file.type)) {
      setError("Only JPG, PNG or PDF files are allowed");
      return;
    }

    // Max 2MB for base64 (Firestore document limit)
    if (file.size > 2 * 1024 * 1024) {
      setError("File size must be less than 2MB for ID proof");
      return;
    }

    setError("");
    setIdFile(file);

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      setIdBase64(base64);

      // Preview for images
      if (file.type !== "application/pdf") {
        setIdPreview(base64);
      } else {
        setIdPreview("pdf");
      }
    };
    reader.readAsDataURL(file);
  }

  function removeIdFile() {
    setIdFile(null);
    setIdPreview(null);
    setIdBase64(null);
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
        moveOutDate: form.moveOutDate,
        services: form.services,
        idProof: idBase64 || null,
        idProofName: idFile?.name || null,
        idProofType: idFile?.type || null,
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
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 px-4 py-8  overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg flex flex-col h-full overflow-auto gap-5 my-auto">
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

        {/* Personal Details */}
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

        {/* Room Details */}
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
          <InputField
            label="Move Out Date"
            name="moveOutDate"
            type="date"
            value={form.moveOutDate}
            onChange={handleChange}
          />
        </div>

        {/* ID Proof */}
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          ID Proof
        </p>

        {!idFile ? (
          <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-6 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-2xl">
              🪪
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Upload ID Proof
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Aadhar, PAN, Passport, Driving License
              </p>
              <p className="text-xs text-gray-400">JPG, PNG or PDF • Max 2MB</p>
            </div>
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg,application/pdf"
              onChange={handleIdFileChange}
              className="hidden"
            />
          </label>
        ) : (
          <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-4 flex items-center gap-4">
            {idPreview && idPreview !== "pdf" ? (
              <img
                src={idPreview}
                alt="ID Preview"
                className="w-16 h-16 rounded-xl object-cover border border-gray-200 dark:border-gray-700 flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-3xl flex-shrink-0">
                📄
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                {idFile.name}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {(idFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <span className="inline-block mt-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                ✓ Ready to save
              </span>
            </div>
            <button
              onClick={removeIdFile}
              className="text-red-400 hover:text-red-600 transition text-sm font-medium flex-shrink-0"
            >
              Remove
            </button>
          </div>
        )}

        {/* Services */}
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
            {loading ? "Saving..." : "Add Tenant"}
          </Button>
        </div>
      </div>
    </div>
  );
}
