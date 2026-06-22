import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { db } from "../../firebase/firebase";
import {
  businessTypeOptions,
  getBusinessType,
} from "../../utils/businessTypes";
import {
  compressImage,
  idProofHelpText,
  openIdProof,
} from "../../utils/idProof";
import { getAvailableRoomOptions } from "../../utils/rooms";
import Button from "../common/Button";

const initialForm = {
  businessType: "pg",
  name: "",
  phone: "",
  email: "",
  roomType: "single",
  room: "",
  rent: "",
  moveInDate: "",
  moveOutDate: "",
  services: [],
  idProof: "",
  idProofName: "",
  idProofSize: 0,
  moveInTime: "12:00",
  moveOutTime: "11:00",
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

export default function AddTenantForm({
  tenants = [],
  roomRecords = tenants,
  onClose,
  onSuccess,
}) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const activeType = getBusinessType(form.businessType);
  const usesRoomDropdown = ["pg", "hotel"].includes(form.businessType);
  const roomOptions = getAvailableRoomOptions(roomRecords, form.roomType);

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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const compressedBase64 = await compressImage(file);

    console.log(
      "Compressed Size KB:",
      Math.round(compressedBase64.length / 1024),
    );

    setForm((prev) => ({
      ...prev,
      idProof: compressedBase64,
      idProofName: file.name,
      idProofSize: file.size,
    }));
  };

  function removeIdFile() {
    setForm((prev) => ({
      ...prev,
      idProof: "",
      idProofName: "",
      idProofSize: 0,
    }));
  }

  async function handleSubmit() {
    if (!form.name || !form.phone || !form.room || !form.rent) {
      setError(
        `Name, phone, ${activeType.unitLabel.toLowerCase()} and amount are required`,
      );
      return;
    }

    setLoading(true);

    console.log("Base64 Size KB:", Math.round(form.idProof.length / 1024));
    try {
      await addDoc(collection(db, "tenants"), {
        businessType: form.businessType,
        name: form.name,
        phone: form.phone,
        email: form.email,
        roomType: form.roomType,
        room: form.room,
        rent: Number(form.rent),
        moveInDate: form.moveInDate,
        moveOutDate: form.moveOutDate,
        services: form.services,
        idProof: form.idProof || null,
        idProofName: form.idProofName || null,
        idProofSize: form.idProofSize || 0,
        status: "active",
        createdAt: serverTimestamp(),
        moveInTime: form.moveInTime,
        moveOutTime: form.moveOutTime,
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
    <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-black/50 px-0 pt-8 sm:items-center sm:px-4 sm:py-8">
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col gap-4 overflow-y-auto rounded-t-xl bg-white p-4 shadow-xl dark:bg-gray-800 sm:max-h-[calc(100vh-4rem)] sm:rounded-xl sm:p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Add Customer
          </h2>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-2xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
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
          Business Type
        </p>
        <div className="grid grid-cols-3 gap-2">
          {businessTypeOptions.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  businessType: type.id,
                  room: "",
                  roomType: "single",
                  services: prev.services.filter((service) =>
                    type.services.includes(service),
                  ),
                }))
              }
              className={`min-h-11 rounded-lg border px-2 text-sm font-bold transition ${
                form.businessType === type.id
                  ? "border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-500"
                  : "border-gray-200 bg-gray-50 text-gray-700 hover:border-blue-300 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {activeType.customerLabel} Details
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

        {/* Stay or Membership Details */}
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {activeType.label} Details
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {usesRoomDropdown ? (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Room Type *
                </label>
                <select
                  name="roomType"
                  value={form.roomType}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      roomType: event.target.value,
                      room: "",
                    })
                  }
                  className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                >
                  <option value="single">Single Bed</option>
                  <option value="double">Double Room</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Room *
                </label>
                <select
                  name="room"
                  value={form.room}
                  onChange={handleChange}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                >
                  <option value="">Select room</option>
                  {roomOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {roomOptions.length === 0 && (
                  <p className="text-xs text-red-500">
                    No rooms available for this room type.
                  </p>
                )}
              </div>
            </>
          ) : (
            <InputField
              label={`${activeType.unitLabel} *`}
              name="room"
              value={form.room}
              onChange={handleChange}
              placeholder="Seat A12"
            />
          )}
          <InputField
            label={`${activeType.feeLabel} (₹) *`}
            name="rent"
            type="number"
            value={form.rent}
            onChange={handleChange}
            placeholder="8000"
          />
          <InputField
            label={
              form.businessType === "hotel"
                ? "Check-In Date"
                : activeType.dateInLabel
            }
            name="moveInDate"
            type="date"
            value={form.moveInDate}
            onChange={handleChange}
          />

          {form.businessType === "hotel" && (
            <InputField
              label="Check-In Time"
              name="moveInTime"
              type="time"
              value={form.moveInTime}
              onChange={handleChange}
            />
          )}
          <InputField
            label={
              form.businessType === "hotel"
                ? "Check-Out Date"
                : activeType.dateOutLabel
            }
            name="moveOutDate"
            type="date"
            value={form.moveOutDate}
            onChange={handleChange}
          />

          {form.businessType === "hotel" && (
            <InputField
              label="Check-Out Time"
              name="moveOutTime"
              type="time"
              value={form.moveOutTime}
              onChange={handleChange}
            />
          )}
        </div>

        {/* ID Proof */}
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          ID Proof
        </p>

        {!form.idProof ? (
          <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-200 p-5 transition hover:border-blue-400 dark:border-gray-700 dark:hover:border-blue-500">
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
              <p className="text-xs text-gray-400">{idProofHelpText}</p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        ) : (
          <div className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
            {form.idProof ? (
              <img
                src={form.idProof}
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
                {form.idProofName}
              </p>

              <p className="text-xs text-gray-400 mt-0.5">
                {(form.idProofSize / 1024 / 1024).toFixed(2)} MB
              </p>

              <span className="inline-block mt-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                ✓ Ready to save
              </span>
            </div>
            <div className="flex flex-shrink-0 flex-col gap-2">
              {form.idProof && (
                <button
                  type="button"
                  onClick={() =>
                    openIdProof({
                      dataUrl: form.idProof,
                      name: form.idProofName,
                    })
                  }
                  className="text-xs font-medium text-blue-600 transition hover:text-blue-700 dark:text-blue-400"
                >
                  View
                </button>
              )}
              <button
                onClick={removeIdFile}
                className="text-xs font-medium text-red-400 transition hover:text-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        {/* Services */}
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Services Included
        </p>
        <div className="flex flex-wrap gap-2">
          {activeType.services.map((service) => (
            <button
              key={service}
              type="button"
              onClick={() => toggleService(service)}
              className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
                form.services.includes(service)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
              }`}
            >
              {service}
            </button>
          ))}
        </div>

        <div className="sticky bottom-0 -mx-4 mt-1 flex gap-3 border-t border-slate-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:static sm:mx-0 sm:border-t-0 sm:p-0 sm:pt-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} className="flex-1">
            {loading ? "Saving..." : `Add ${activeType.customerLabel}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
