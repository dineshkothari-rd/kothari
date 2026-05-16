import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import AdminTabs from "../components/admin/AdminTabs";
import OverviewTab from "../components/admin/OverviewTab";
import TenantList from "../components/admin/TenantList";
import AddTenantForm from "../components/admin/AddTenantForm";
import PaymentList from "../components/admin/PaymentList";
import AddPaymentForm from "../components/admin/AddPaymentForm";
import NoticeBoard from "../components/admin/NoticeBoard";
import EnquiryList from "../components/admin/EnquiryList";
import Button from "../components/common/Button";
import { useFirestoreCollection } from "../hooks/useFirestoreCollection";
import { MotionDiv } from "../components/common/MotionPrimitives";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddTenant, setShowAddTenant] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const { data: tenants } = useFirestoreCollection("tenants", {
    sortBy: "createdAt",
  });

  useEffect(() => {
    if (!successMsg) return undefined;

    const timeoutId = setTimeout(() => setSuccessMsg(""), 3000);
    return () => clearTimeout(timeoutId);
  }, [successMsg]);

  function showSuccess(msg) {
    setSuccessMsg(msg);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
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
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
        {/* Success message */}
        <AnimatePresence>
          {successMsg && (
            <MotionDiv
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
            >
              {successMsg}
            </MotionDiv>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <AdminTabs active={activeTab} onChange={setActiveTab} />

        {/* Tab Content */}
        {activeTab === "overview" && <OverviewTab tenants={tenants} />}

        {activeTab === "tenants" && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-start sm:justify-end">
              <Button variant="primary" onClick={() => setShowAddTenant(true)}>
                + Add Tenant
              </Button>
            </div>
            <TenantList />
          </div>
        )}

        {activeTab === "payments" && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-start sm:justify-end">
              <Button variant="primary" onClick={() => setShowAddPayment(true)}>
                + Add Payment
              </Button>
            </div>
            <PaymentList tenants={tenants} />
          </div>
        )}

        {activeTab === "enquiries" && <EnquiryList />}

        {activeTab === "notices" && <NoticeBoard />}
      </div>
    </div>
  );
}
