import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import AdminStats from "../components/admin/AdminStats";
import AddTenantForm from "../components/admin/AddTenantForm";
import TenantList from "../components/admin/TenantList";
import AddPaymentForm from "../components/admin/AddPaymentForm";
import PaymentList from "../components/admin/PaymentList";
import NoticeBoard from "../components/admin/NoticeBoard";
import Button from "../components/common/Button";

export default function AdminDashboard() {
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
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-300">
      {showAddTenant && (
        <AddTenantForm
          onClose={() => setShowAddTenant(false)}
          onSuccess={() => showSuccess("✅ Tenant added successfully!")}
        />
      )}

      {showAddPayment && (
        <AddPaymentForm
          tenants={tenants}
          onClose={() => setShowAddPayment(false)}
          onSuccess={() => showSuccess("✅ Payment record added!")}
        />
      )}

      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col gap-10">
        <AdminStats tenants={tenants} />

        {successMsg && (
          <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-4 py-3 rounded-xl text-sm">
            {successMsg}
          </div>
        )}

        {/* Tenant Section */}
        <div className="flex justify-end">
          <Button variant="primary" onClick={() => setShowAddTenant(true)}>
            + Add Tenant
          </Button>
        </div>
        <TenantList />

        {/* Payment Section */}
        <div className="flex justify-end">
          <Button variant="primary" onClick={() => setShowAddPayment(true)}>
            + Add Payment
          </Button>
        </div>
        <PaymentList tenants={tenants} />

        {/* Notice Board */}
        <NoticeBoard />
      </div>
    </div>
  );
}
