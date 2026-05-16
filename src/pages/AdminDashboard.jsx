import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import AdminTabs from "../components/admin/AdminTabs";
import OverviewTab from "../components/admin/OverviewTab";
import TenantList from "../components/admin/TenantList";
import AddTenantForm from "../components/admin/AddTenantForm";
import PaymentList from "../components/admin/PaymentList";
import AddPaymentForm from "../components/admin/AddPaymentForm";
import NoticeBoard from "../components/admin/NoticeBoard";
import Button from "../components/common/Button";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [tenants, setTenants] = useState([]);
  const [showAddTenant, setShowAddTenant] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "tenants"),
      (snap) => {
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTenants(data);
        setErrorMsg("");
      },
      (err) => {
        setErrorMsg("Unable to load tenants: " + err.message);
      },
    );
    return unsubscribe;
  }, []);

  function showSuccess(msg) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Modals */}
      {showAddTenant && (
        <AddTenantForm
          onClose={() => setShowAddTenant(false)}
          onSuccess={() => {
            showSuccess("✅ Tenant added successfully!");
            setActiveTab("tenants");
          }}
        />
      )}
      {showAddPayment && (
        <AddPaymentForm
          tenants={tenants}
          onClose={() => setShowAddPayment(false)}
          onSuccess={() => {
            showSuccess("✅ Payment record added!");
            setActiveTab("payments");
          }}
        />
      )}

      {/* Content */}
      <div className="container-shell flex flex-col gap-6 py-6 sm:py-8 lg:py-10">
        <section className="rounded-lg bg-slate-950 px-5 py-6 text-white shadow-sm dark:bg-slate-900 sm:px-8">
          <p className="text-sm font-semibold text-teal-200">Admin Dashboard</p>
          <div className="mt-2 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                PG operations at a glance
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Manage tenants, payments, and notices from a responsive control
                center built for daily work.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="white" onClick={() => setShowAddTenant(true)}>
                Add Tenant
              </Button>
              <Button variant="white" onClick={() => setShowAddPayment(true)}>
                Add Payment
              </Button>
            </div>
          </div>
        </section>

        {/* Success message */}
        {successMsg && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl text-sm font-medium">
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-medium">
            {errorMsg}
          </div>
        )}

        {/* Tabs */}
        <AdminTabs active={activeTab} onChange={setActiveTab} />

        {/* Tab Content */}
        {activeTab === "overview" && <OverviewTab tenants={tenants} />}

        {activeTab === "tenants" && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-end">
              <Button variant="primary" onClick={() => setShowAddTenant(true)}>
                Add Tenant
              </Button>
            </div>
            <TenantList />
          </div>
        )}

        {activeTab === "payments" && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-end">
              <Button variant="primary" onClick={() => setShowAddPayment(true)}>
                Add Payment
              </Button>
            </div>
            <PaymentList tenants={tenants} />
          </div>
        )}

        {activeTab === "notices" && <NoticeBoard />}
      </div>
    </div>
  );
}
