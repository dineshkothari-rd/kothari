import { useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { AnimatePresence } from "framer-motion";
import { db } from "../../firebase/firebase";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import Button from "../common/Button";
import { fadeUp, staggerContainer } from "../common/motionConfig";
import {
  MotionArticle,
  MotionDiv,
  MotionP,
  MotionSection,
} from "../common/MotionPrimitives";

const statusStyles = {
  New: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  Contacted:
    "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  Scheduled:
    "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  Closed:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
};

function formatDate(createdAt) {
  if (!createdAt?.seconds) return "Just now";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(createdAt.seconds * 1000));
}

export default function EnquiryList() {
  const [actionError, setActionError] = useState("");
  const [busyId, setBusyId] = useState("");
  const {
    data: enquiries,
    loading,
    error,
  } = useFirestoreCollection("enquiries", {
    sortBy: "createdAt",
  });

  async function updateStatus(id, status) {
    setActionError("");
    setBusyId(id);
    try {
      await updateDoc(doc(db, "enquiries", id), { status });
    } catch (statusError) {
      setActionError(
        statusError?.code === "permission-denied"
          ? "You do not have permission to update enquiries. Check Firestore admin rules."
          : statusError?.message || "Could not update enquiry status.",
      );
    } finally {
      setBusyId("");
    }
  }

  async function handleDelete(id) {
    setActionError("");
    setBusyId(id);
    try {
      await deleteDoc(doc(db, "enquiries", id));
    } catch (deleteError) {
      setActionError(
        deleteError?.code === "permission-denied"
          ? "You do not have permission to delete enquiries. Check Firestore admin rules."
          : deleteError?.message || "Could not delete enquiry.",
      );
    } finally {
      setBusyId("");
    }
  }

  if (loading) {
    return (
      <MotionP
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-gray-400"
      >
        Loading enquiries...
      </MotionP>
    );
  }

  if (error) {
    return (
      <MotionDiv
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300"
      >
        <p>Could not load enquiries.</p>
        <p className="mt-1 text-xs opacity-80">
          {error.code === "permission-denied"
            ? "Firestore denied access. Allow admins to read the enquiries collection."
            : error.message}
        </p>
      </MotionDiv>
    );
  }

  return (
    <MotionSection
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="min-w-0"
    >
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Enquiries
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track contact form leads and visitor follow-ups.
          </p>
        </div>
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
          {enquiries.length} total
        </p>
      </div>

      <AnimatePresence>
        {actionError && (
          <MotionDiv
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300"
          >
            {actionError}
          </MotionDiv>
        )}
      </AnimatePresence>

      {enquiries.length === 0 ? (
        <MotionDiv
          variants={fadeUp}
          className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-gray-400 dark:border-gray-700 dark:bg-gray-900"
        >
          No enquiries yet.
        </MotionDiv>
      ) : (
        <MotionDiv
          variants={staggerContainer}
          className="grid grid-cols-1 gap-4 lg:grid-cols-2"
        >
          {enquiries.map((enquiry) => (
            <MotionArticle
              key={enquiry.id}
              variants={fadeUp}
              layout
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-bold text-slate-900 dark:text-white">
                    {enquiry.name}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {formatDate(enquiry.createdAt)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    statusStyles[enquiry.status] ?? statusStyles.New
                  }`}
                >
                  {enquiry.status || "New"}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
                <a className="truncate hover:text-blue-600" href={`tel:${enquiry.phone}`}>
                  {enquiry.phone}
                </a>
                <a className="truncate hover:text-blue-600" href={`mailto:${enquiry.email}`}>
                  {enquiry.email}
                </a>
                <p className="sm:col-span-2">
                  <span className="font-semibold text-slate-800 dark:text-white">
                    Room:
                  </span>{" "}
                  {enquiry.roomType || "Not selected"}
                </p>
              </div>

              {enquiry.message && (
                <p className="rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-600 dark:bg-gray-950 dark:text-slate-300">
                  {enquiry.message}
                </p>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <select
                  value={enquiry.status || "New"}
                  disabled={busyId === enquiry.id}
                  onChange={(event) =>
                    updateStatus(enquiry.id, event.target.value)
                  }
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Closed">Closed</option>
                </select>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(enquiry.id)}
                  disabled={busyId === enquiry.id}
                  className="sm:min-w-24"
                >
                  {busyId === enquiry.id ? "Saving..." : "Delete"}
                </Button>
              </div>
            </MotionArticle>
          ))}
        </MotionDiv>
      )}
    </MotionSection>
  );
}
