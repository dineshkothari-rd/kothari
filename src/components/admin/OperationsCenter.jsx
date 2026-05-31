import { useEffect, useMemo } from "react";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import {
  formatDate,
  formatINR,
  openPrintableReport,
  openWhatsAppReminder,
} from "../../utils/adminActions";
import { getBusinessType } from "../../utils/businessTypes";
import { getPaymentAmount, getPaymentTenantId } from "../../utils/helper";
import { getRoomInventory, parseRoomLabel } from "../../utils/rooms";
import Button from "../common/Button";
import { EmptyState, Panel, SimpleTable, StatusPill } from "./AdminFeatureUI";

const currentMonth = () => new Date().toISOString().slice(0, 7);

function paidForMonth(payments, tenantId) {
  return payments
    .filter(
      (payment) =>
        getPaymentTenantId(payment) === tenantId &&
        payment.month === currentMonth(),
    )
    .reduce((sum, payment) => sum + getPaymentAmount(payment), 0);
}

function roomStatus(room, customers) {
  const roomCustomers = customers.filter(
    (customer) => parseRoomLabel(customer.room).room === room,
  );
  const hasDouble = roomCustomers.some(
    (customer) => parseRoomLabel(customer.room).bed === "Full Room",
  );

  if (hasDouble) return { label: "Full room booked", tone: "red" };
  if (roomCustomers.length >= 2) return { label: "Both beds booked", tone: "red" };
  if (roomCustomers.length === 1) return { label: "One bed available", tone: "amber" };
  return { label: "Available", tone: "green" };
}

export default function OperationsCenter({ tenants }) {
  const { data: payments } = useFirestoreCollection("payments", {
    sortBy: "createdAt",
  });

  const hotelAndPgCustomers = tenants.filter((tenant) =>
    ["pg", "hotel", undefined].includes(tenant.businessType),
  );

  const dueCustomers = useMemo(
    () =>
      tenants
        .filter((tenant) => tenant.status !== "inactive")
        .map((tenant) => {
          const paid = paidForMonth(payments, tenant.id);
          const total = Number(tenant.rent) || 0;
          return {
            ...tenant,
            paid,
            balance: Math.max(0, total - paid),
            dueDay: Number(tenant.dueDay) || 5,
          };
        })
        .filter(
          (tenant) =>
            tenant.balance > 0 && new Date().getDate() >= tenant.dueDay,
        ),
    [payments, tenants],
  );

  useEffect(() => {
    async function createRentNotices() {
      await Promise.all(
        dueCustomers.map(async (customer) => {
          const reminderKey = `rent-${customer.id}-${currentMonth()}`;
          const existing = await getDocs(
            query(
              collection(db, "notices"),
              where("reminderKey", "==", reminderKey),
            ),
          );

          if (!existing.empty) return;

          await addDoc(collection(db, "notices"), {
            title: `Payment reminder: ${customer.name}`,
            message: `${formatINR(customer.balance)} is pending for ${currentMonth()}.`,
            type: "warning",
            reminderKey,
            createdAt: serverTimestamp(),
          });
        }),
      );
    }

    if (dueCustomers.length) createRentNotices();
  }, [dueCustomers]);

  function exportRevenue() {
    openPrintableReport("Monthly Revenue Report", [
      {
        title: currentMonth(),
        headers: ["Customer", "Type", "Charge", "Paid", "Balance"],
        rows: tenants.map((tenant) => {
          const paid = paidForMonth(payments, tenant.id);
          const charge = Number(tenant.rent) || 0;
          return [
            tenant.name,
            getBusinessType(tenant.businessType).label,
            formatINR(charge),
            formatINR(paid),
            formatINR(Math.max(0, charge - paid)),
          ];
        }),
      },
    ]);
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <Panel
        title="Rent Reminders"
        subtitle="Automatic notices are created after the due day. Use WhatsApp for a quick reminder."
        action={
          <Button variant="outline" onClick={exportRevenue}>
            Revenue PDF
          </Button>
        }
      >
        {dueCustomers.length === 0 ? (
          <EmptyState>No rent reminders due right now.</EmptyState>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {dueCustomers.map((customer) => (
              <div
                key={customer.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-gray-800 dark:bg-gray-950"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {customer.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {getBusinessType(customer.businessType).label} •{" "}
                      {customer.room || "No room"}
                    </p>
                  </div>
                  <StatusPill tone="amber">{formatINR(customer.balance)}</StatusPill>
                </div>
                <Button
                  className="mt-4 w-full"
                  onClick={() =>
                    openWhatsAppReminder(
                      customer.phone,
                      `Hi ${customer.name}, payment of ${formatINR(customer.balance)} is pending for ${currentMonth()}. Please clear it soon.`,
                    )
                  }
                >
                  Send WhatsApp Reminder
                </Button>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <Panel
        title="Room Availability"
        subtitle="15 rooms total. Each room has 2 beds, or can be booked as one double room."
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {getRoomInventory().map((item) => {
            const status = roomStatus(item.room, hotelAndPgCustomers);
            const roomCustomers = hotelAndPgCustomers.filter(
              (customer) => parseRoomLabel(customer.room).room === item.room,
            );

            return (
              <div
                key={item.room}
                className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-lg font-extrabold text-slate-900 dark:text-white">
                    Room {item.room}
                  </p>
                  <StatusPill tone={status.tone}>{status.label}</StatusPill>
                </div>
                <div className="mt-3 space-y-2 text-sm text-slate-500">
                  {roomCustomers.length === 0 ? (
                    <p>Bed A and Bed B available.</p>
                  ) : (
                    roomCustomers.map((customer) => (
                      <p key={customer.id}>
                        {parseRoomLabel(customer.room).bed}: {customer.name}
                      </p>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel title="Move In / Move Out" subtitle="A simple movement tracker for upcoming records.">
        <SimpleTable
          headers={["Customer", "Type", "Room / Seat", "Start", "End"]}
          emptyText="No movement dates found."
          rows={tenants
            .filter((tenant) => tenant.moveInDate || tenant.moveOutDate)
            .map((tenant) => ({
              key: tenant.id,
              cells: [
                tenant.name,
                getBusinessType(tenant.businessType).label,
                tenant.room || "-",
                formatDate(tenant.moveInDate),
                formatDate(tenant.moveOutDate),
              ],
            }))}
        />
      </Panel>
    </div>
  );
}
