import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import AdminStats from "../components/admin/AdminStats";
import AddTenantForm from "../components/admin/AddTenantForm";
import TenantList from "../components/admin/TenantList";
import Button from "../components/common/Button";

export default function AdminDashboard() {
  const [tenants, setTenants] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tenants"), (snap) => {
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTenants(data);
    });
    return unsubscribe;
  }, []);

  function handleSuccess() {
    setSuccessMsg("✅ Tenant added successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-300">
      {showAddForm && (
        <AddTenantForm
          onClose={() => setShowAddForm(false)}
          onSuccess={handleSuccess}
        />
      )}

      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col gap-10">
        <AdminStats tenants={tenants} />

        {successMsg && (
          <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-4 py-3 rounded-xl text-sm">
            {successMsg}
          </div>
        )}

        <div className="flex justify-between items-center">
          <div />
          <Button variant="primary" onClick={() => setShowAddForm(true)}>
            + Add Tenant
          </Button>
        </div>

        <TenantList />
      </div>
    </div>
  );
}
