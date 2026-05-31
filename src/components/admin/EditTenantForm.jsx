import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import Button from "../common/Button";
import { businessTypeOptions, getBusinessType } from "../../utils/businessTypes";
import {
  idProofHelpText,
  openIdProof,
  readIdProofFile,
  validateIdProofFile,
} from "../../utils/idProof";
import { getAvailableRoomOptions } from "../../utils/rooms";

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

export default function EditTenantForm({
  tenant,
  tenants = [],
  onClose,
  onSuccess,
}) {
  const [form, setForm] = useState({
    businessType: tenant.businessType || "pg",
    name: tenant.name || "",
    phone: tenant.phone || "",
    email: tenant.email || "",
    roomType: tenant.roomType || "single",
    room: tenant.room || "",
    rent: tenant.rent || "",
    moveInDate: tenant.moveInDate || "",
    moveOutDate: tenant.moveOutDate || "",
    services: tenant.services || [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [idFile, setIdFile] = useState(null);
  const [idPreview, setIdPreview] = useState(null);
  const [idBase64, setIdBase64] = useState(tenant.idProof || null);
  const [existingIdName, setExistingIdName] = useState(
    tenant.idProofName || null,
  );
  const [idProofType, setIdProofType] = useState(tenant.idProofType || null);
  const activeType = getBusinessType(form.businessType);
  const usesRoomDropdown = ["pg", "hotel"].includes(form.businessType);
  const roomOptions = getAvailableRoomOptions(
    tenants,
    form.roomType,
    tenant.id,
  );

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function toggleService(service) {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  }

  async function handleIdFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const validationError = validateIdProofFile(file);
    if (validationError) {
      setError(validationError);
      e.target.value = "";
      return;
    }

    setError("");
    try {
      const base64 = await readIdProofFile(file);
      setIdFile(file);
      setIdProofType(file.type);
      setExistingIdName(file.name);
      setIdBase64(base64);
      if (file.type !== "application/pdf") {
        setIdPreview(base64);
      } else {
        setIdPreview("pdf");
      }
    } catch (readError) {
      setError(readError.message);
      e.target.value = "";
    }
  }

  function removeIdFile() {
    setIdFile(null);
    setIdPreview(null);
    setIdBase64(null);
    setExistingIdName(null);
    setIdProofType(null);
  }

  function viewExistingId() {
    openIdProof({
      dataUrl: idBase64,
      type: idProofType,
      name: existingIdName || "ID Proof",
    });
  }

  async function handleUpdate() {
    if (!form.name || !form.phone || !form.room || !form.rent) {
      setError(`Name, phone, ${activeType.unitLabel.toLowerCase()} and amount are required`);
      return;
    }
    setLoading(true);
    try {
      await updateDoc(doc(db, "tenants", tenant.id), {
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
        idProof: idBase64 || null,
        idProofName: existingIdName || null,
        idProofType: idProofType || null,
      });
      onSuccess?.();
      onClose?.();
    } catch (err) {
      setError("Error updating tenant: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-black/50 px-0 pt-8 sm:items-center sm:px-4 sm:py-8">
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col gap-4 overflow-y-auto rounded-t-xl bg-white p-4 shadow-xl dark:bg-gray-800 sm:max-h-[calc(100vh-4rem)] sm:rounded-xl sm:p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Edit Customer
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
                  {form.room &&
                    !roomOptions.some((option) => option.value === form.room) && (
                      <option value={form.room}>{form.room} (current)</option>
                    )}
                </select>
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
            label={activeType.dateInLabel}
            name="moveInDate"
            type="date"
            value={form.moveInDate}
            onChange={handleChange}
          />
          <InputField
            label={activeType.dateOutLabel}
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

        {/* Existing ID proof */}
        {idBase64 && !idFile && (
          <div className="flex items-center gap-4 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-700 dark:bg-green-900/10">
            {idProofType !== "application/pdf" ? (
              <img
                src={idBase64}
                alt="ID Proof"
                className="w-16 h-16 rounded-xl object-cover border border-gray-200 dark:border-gray-700 flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-3xl flex-shrink-0">
                📄
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                {existingIdName || "ID Proof"}
              </p>
              <span className="inline-block mt-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                ✓ Already uploaded
              </span>
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0">
              <button
                onClick={viewExistingId}
                className="text-blue-600 dark:text-blue-400 hover:underline text-xs font-medium"
              >
                👁 View
              </button>
              <button
                onClick={removeIdFile}
                className="text-red-400 hover:text-red-600 text-xs font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        {/* New file selected */}
        {idFile && (
          <div className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
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
              <span className="inline-block mt-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">
                ↑ New file selected
              </span>
            </div>
            <div className="flex flex-shrink-0 flex-col gap-2">
              <button
                type="button"
                onClick={() =>
                  openIdProof({
                    dataUrl: idBase64,
                    type: idProofType,
                    name: existingIdName || "ID Proof",
                  })
                }
                className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                View
              </button>
              <button
                onClick={removeIdFile}
                className="text-xs font-medium text-red-400 transition hover:text-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        {/* Upload new if no file selected */}
        {!idFile && (
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 p-4 transition hover:border-blue-400 dark:border-gray-700">
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-xl flex-shrink-0">
              🪪
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {idBase64 ? "Replace ID Proof" : "Upload ID Proof"}
              </p>
              <p className="text-xs text-gray-400">{idProofHelpText}</p>
            </div>
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg,application/pdf"
              onChange={handleIdFileChange}
              className="hidden"
            />
          </label>
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
          <Button variant="primary" onClick={handleUpdate} className="flex-1">
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
