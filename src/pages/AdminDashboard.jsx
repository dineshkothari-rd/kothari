import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import AddPaymentForm from "../components/admin/AddPaymentForm";
import AddTenantForm from "../components/admin/AddTenantForm";
import AdminTabs from "../components/admin/AdminTabs";
import EnquiryList from "../components/admin/EnquiryList";
import LibraryCenter from "../components/admin/LibraryCenter";
import MeterReadingForm from "../components/admin/MeterReadingForm";
import MeterReadingList from "../components/admin/MeterReadingList";
import NoticeBoard from "../components/admin/NoticeBoard";
import OperationsCenter from "../components/admin/OperationsCenter";
import OverviewTab from "../components/admin/OverviewTab";
import PaymentList from "../components/admin/PaymentList";
import TenantList from "../components/admin/TenantList";
import Button from "../components/common/Button";
import { MotionDiv } from "../components/common/MotionPrimitives";
import { useFirestoreCollection } from "../hooks/useFirestoreCollection";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddTenant, setShowAddTenant] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [showMeterForm, setShowMeterForm] = useState(false);
  const { data: tenants } = useFirestoreCollection("tenants", {
    sortBy: "createdAt",
  });
  const { data: hotelBookings } = useFirestoreCollection("hotelBookings", {
    sortBy: "createdAt",
  });
  const roomRecords = [
    ...tenants,
    ...hotelBookings.map((booking) => ({
      ...booking,
      businessType: "hotel",
      name: booking.guestName,
      status: booking.status || "Booked",
    })),
  ];

  useEffect(() => {
    if (!successMsg) return undefined;

    const timeoutId = setTimeout(() => setSuccessMsg(""), 3000);
    return () => clearTimeout(timeoutId);
  }, [successMsg]);

  function showSuccess(msg) {
    setSuccessMsg(msg);
  }

  return (
    <div className="app-surface min-h-screen transition-colors duration-300">
      {/* Modals */}
      {showAddTenant && (
        <AddTenantForm
          tenants={tenants}
          roomRecords={roomRecords}
          onClose={() => setShowAddTenant(false)}
          onSuccess={() => {
            showSuccess("Customer added successfully!");
            setActiveTab("tenants");
          }}
        />
      )}
      {showAddPayment && (
        <AddPaymentForm
          tenants={tenants}
          onClose={() => setShowAddPayment(false)}
          onSuccess={() => {
            showSuccess("Payment recorded. Receipt is available in payments.");
            setActiveTab("payments");
          }}
        />
      )}

      {/* Content */}
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-5 sm:px-6 sm:py-8">
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
              <Button
                variant="primary"
                onClick={() => setShowAddTenant(true)}
                className="w-full sm:w-auto"
              >
                + Add Customer
              </Button>
            </div>
            <TenantList roomRecords={roomRecords} />
          </div>
        )}

        {activeTab === "payments" && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-start sm:justify-end">
              <Button
                variant="primary"
                onClick={() => setShowAddPayment(true)}
                className="w-full sm:w-auto"
              >
                + Add Payment
              </Button>
            </div>
            <PaymentList tenants={tenants} />
          </div>
        )}

        {activeTab === "operations" && <OperationsCenter tenants={tenants} />}

        {activeTab === "library" && <LibraryCenter tenants={tenants} />}

        {activeTab === "enquiries" && <EnquiryList />}

        {activeTab === "notices" && <NoticeBoard />}
        {activeTab === "meter" && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-end">
              <Button
                variant="primary"
                onClick={() => setShowMeterForm(true)}
                className="w-full sm:w-auto"
              >
                + Add Reading
              </Button>
            </div>
            <MeterReadingList tenants={tenants} />
          </div>
        )}
      </div>
      {showMeterForm && (
        <MeterReadingForm
          tenants={tenants}
          onClose={() => setShowMeterForm(false)}
          onSuccess={() => showSuccess("Meter reading saved!")}
        />
      )}
    </div>
  );
}
