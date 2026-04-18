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

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tenants"), (snap) => {
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTenants(data);
    });
    return unsubscribe;
  }, []);

  function showSuccess(msg) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-950  transition-colors duration-300">
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
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-6">
        {/* Success message */}
        {successMsg && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl text-sm font-medium">
            {successMsg}
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
                + Add Tenant
              </Button>
            </div>
            <TenantList />
          </div>
        )}

        {activeTab === "payments" && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-end">
              <Button variant="primary" onClick={() => setShowAddPayment(true)}>
                + Add Payment
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
