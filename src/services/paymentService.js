import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import {
  PAYMENT_STATUS,
  calculatePaymentBreakdown,
  toNumber,
} from "../utils/paymentUtils";

const paymentsCollection = () => collection(db, "payments");
const paymentDocument = (id) => doc(db, "payments", id);

export const getTenantMonthPayments = async (tenantId, month) => {
  const paymentsQuery = query(
    paymentsCollection(),
    where("tenantId", "==", tenantId),
    where("month", "==", month),
  );
  const snapshot = await getDocs(paymentsQuery);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));
};

export const getPaidAmountForTenantMonth = async (tenantId, month) => {
  const payments = await getTenantMonthPayments(tenantId, month);

  return payments.reduce(
    (total, payment) => total + toNumber(payment.amountPaid),
    0,
  );
};

export const createPaymentRecord = async ({
  tenant,
  month,
  amountPaid,
  note = "",
  paidOn = "",
  alreadyPaid = 0,
  paymentMode = "manual",
  paymentProvider = "",
  providerPaymentId = "",
}) => {
  const totalRent = toNumber(tenant?.rent);
  const paidNow = toNumber(amountPaid);
  const newTotalPaid = toNumber(alreadyPaid) + paidNow;
  const { balance, status } = calculatePaymentBreakdown(
    totalRent,
    newTotalPaid,
  );

  return addDoc(paymentsCollection(), {
    tenantId: tenant?.id || "",
    tenantName: tenant?.name || "",
    tenantRoom: tenant?.room || "",
    month,
    totalRent,
    amountPaid: paidNow,
    balance,
    status,
    paidOn: paidNow > 0 ? paidOn || new Date().toLocaleDateString("en-IN") : "",
    note,
    paymentMode,
    paymentProvider,
    providerPaymentId,
    razorpayId: paymentProvider === "razorpay" ? providerPaymentId : "",
    createdAt: serverTimestamp(),
  });
};

export const createLegacyPaymentRecord = async ({ tenant, month, amount }) =>
  addDoc(paymentsCollection(), {
    userId: tenant?.id || "",
    tenantName: tenant?.name || "",
    amount: toNumber(amount),
    month,
    status: PAYMENT_STATUS.PENDING,
    paidOn: "",
    razorpayId: "",
    createdAt: serverTimestamp(),
  });

export const applyBalancePayment = async (payment, amount) => {
  const newAmountPaid = toNumber(payment.amountPaid) + toNumber(amount);
  const { balance, status } = calculatePaymentBreakdown(
    payment.totalRent,
    newAmountPaid,
  );

  return updateDoc(paymentDocument(payment.id), {
    amountPaid: newAmountPaid,
    balance,
    status,
    paidOn: new Date().toLocaleDateString("en-IN"),
  });
};

export const updatePaymentStatus = async (id, status) =>
  updateDoc(paymentDocument(id), {
    status,
    paidOn:
      status === PAYMENT_STATUS.PAID
        ? new Date().toLocaleDateString("en-IN")
        : "",
  });

export const deletePaymentRecord = (id) => deleteDoc(paymentDocument(id));
