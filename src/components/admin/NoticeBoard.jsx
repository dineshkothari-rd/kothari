import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import Button from "../common/Button";

const typeOptions = [
  {
    value: "info",
    label: "ℹ️ Info",
    style: "border-l-4 border-blue-400 bg-blue-50 dark:bg-blue-900/10",
  },
  {
    value: "success",
    label: "✅ Good News",
    style: "border-l-4 border-green-400 bg-green-50 dark:bg-green-900/10",
  },
  {
    value: "warning",
    label: "⚠️ Warning",
    style: "border-l-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/10",
  },
  {
    value: "danger",
    label: "🚨 Urgent",
    style: "border-l-4 border-red-400 bg-red-50 dark:bg-red-900/10",
  },
];

const typeIcons = {
  info: "ℹ️",
  success: "✅",
  warning: "⚠️",
  danger: "🚨",
};

const typeStyleMap = {
  info: "border-l-4 border-blue-400 bg-blue-50 dark:bg-blue-900/10",
  success: "border-l-4 border-green-400 bg-green-50 dark:bg-green-900/10",
  warning: "border-l-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/10",
  danger: "border-l-4 border-red-400 bg-red-50 dark:bg-red-900/10",
};

function AddNoticeModal({ onClose }) {
  const [form, setForm] = useState({ title: "", message: "", type: "info" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleSubmit() {
    if (!form.title || !form.message) {
      setError("Title and message are required");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "notices"), {
        title: form.title,
        message: form.message,
        type: form.type,
        createdAt: serverTimestamp(),
      });
      onClose();
    } catch (err) {
      setError("Error adding notice: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-black/50 px-0 pt-8 sm:items-center sm:px-4 sm:py-8">
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col gap-4 overflow-y-auto rounded-t-xl bg-white p-4 shadow-xl dark:bg-gray-800 sm:max-h-[calc(100vh-4rem)] sm:rounded-xl sm:p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Add Notice
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

        {/* Type Selector */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Notice Type
          </label>
          <div className="flex flex-wrap gap-2">
            {typeOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm({ ...form, type: opt.value })}
                  className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
                  form.type === opt.value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Water Supply Interruption"
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
          />
        </div>

        {/* Message */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Message *
          </label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Write the notice details here..."
            rows={4}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm resize-none"
          />
        </div>

        {/* Preview */}
        {form.title && (
          <div className={`rounded-xl p-4 ${typeStyleMap[form.type]}`}>
            <div className="flex items-center gap-2 mb-1">
              <span>{typeIcons[form.type]}</span>
              <p className="font-semibold text-gray-800 dark:text-white text-sm">
                {form.title}
              </p>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {form.message}
            </p>
          </div>
        )}

        <div className="sticky bottom-0 -mx-4 mt-1 flex gap-3 border-t border-slate-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:static sm:mx-0 sm:border-t-0 sm:p-0 sm:pt-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} className="flex-1">
            {loading ? "Adding..." : "Add Notice"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function NoticeCard({ notice, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className={`relative rounded-xl p-4 ${typeStyleMap[notice.type]}`}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="mb-1 flex min-w-0 items-center gap-2">
          <span>{typeIcons[notice.type]}</span>
          <p className="break-words text-sm font-semibold text-gray-800 dark:text-white">
            {notice.title}
          </p>
        </div>
        <div className="flex flex-shrink-0 items-center justify-between gap-2 sm:justify-end">
          <span className="text-xs text-gray-400">
            {notice.createdAt?.toDate().toLocaleDateString("en-IN") || ""}
          </span>
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-red-400 hover:text-red-600 text-xs font-medium"
            >
              Delete
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Sure?</span>
              <button
                onClick={() => onDelete(notice.id)}
                className="text-red-600 text-xs font-semibold hover:underline"
              >
                Yes
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-gray-500 text-xs hover:underline"
              >
                No
              </button>
            </div>
          )}
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
        {notice.message}
      </p>
    </div>
  );
}

export default function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "notices"), (snap) => {
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
      setNotices(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function handleDelete(id) {
    await deleteDoc(doc(db, "notices", id));
  }

  if (loading) return <p className="text-gray-400">Loading notices...</p>;

  return (
    <div className="min-w-0">
      {showModal && <AddNoticeModal onClose={() => setShowModal(false)} />}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-950 dark:text-white">
            Notice Board
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Publish updates and reminders for customers.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto"
        >
          + Add Notice
        </Button>
      </div>

      {notices.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 text-center text-gray-400">
          No notices yet. Add your first notice!
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {notices.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
