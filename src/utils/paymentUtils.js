export const PAYMENT_STATUS = {
  PAID: "Paid",
  PARTIAL: "Partial",
  PENDING: "Pending",
  OVERDUE: "Overdue",
};

export const PAYMENT_STATUS_STYLES = {
  [PAYMENT_STATUS.PAID]:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  [PAYMENT_STATUS.PARTIAL]:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  [PAYMENT_STATUS.PENDING]:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  [PAYMENT_STATUS.OVERDUE]:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUS.PAID]: "✅ Paid",
  [PAYMENT_STATUS.PARTIAL]: "🔶 Partial",
  [PAYMENT_STATUS.PENDING]: "⏳ Pending",
  [PAYMENT_STATUS.OVERDUE]: "🚨 Overdue",
};

export const toNumber = (value) => Number(value) || 0;

export const getPaymentTenantId = (payment) =>
  payment.tenantId || payment.userId || "";

export const getPaymentAmount = (payment) =>
  toNumber(payment.amountPaid ?? payment.amount ?? 0);

export const calculatePaymentStatus = (paid, total) => {
  if (paid <= 0) return PAYMENT_STATUS.PENDING;
  if (total > 0 && paid >= total) return PAYMENT_STATUS.PAID;
  return PAYMENT_STATUS.PARTIAL;
};

export const calculatePaymentBreakdown = (totalRent, paidToDate) => {
  const total = toNumber(totalRent);
  const paid = toNumber(paidToDate);
  const balance = Math.max(0, total - paid);

  return {
    amountPaid: paid,
    balance,
    status: calculatePaymentStatus(paid, total),
  };
};

export const getProgressPercent = (paid, total) => {
  const totalAmount = toNumber(total);
  if (totalAmount <= 0) return 0;

  return Math.min(100, Math.round((toNumber(paid) / totalAmount) * 100));
};

const getTenantRentMap = (tenants = []) =>
  tenants.reduce((map, tenant) => {
    map[tenant.id] = toNumber(tenant.rent);
    return map;
  }, {});

const getMonthEndDate = (month) => {
  const [year, monthNumber] = month.split("-").map(Number);
  return new Date(year, monthNumber, 0, 23, 59, 59, 999);
};

const isTenantActiveForMonth = (tenant, month) => {
  if (tenant.status && tenant.status !== "active") return false;
  if (!tenant.moveInDate) return true;

  const moveInDate = new Date(tenant.moveInDate);
  if (Number.isNaN(moveInDate.getTime())) return true;

  return moveInDate <= getMonthEndDate(month);
};

export const normalizePayments = (data, tenants = []) => {
  const map = {};
  const tenantRentById = getTenantRentMap(tenants);

  data.forEach((payment) => {
    const tenantId = getPaymentTenantId(payment);
    const month = payment.month || "";

    if (!tenantId || !month) return;

    const key = `${tenantId}-${month}`;
    const amountPaid = getPaymentAmount(payment);
    const totalRent =
      toNumber(payment.totalRent) || tenantRentById[tenantId] || 0;

    if (!map[key]) {
      map[key] = {
        ...payment,
        tenantId,
        month,
        amountPaid,
        totalRent,
      };
    } else {
      map[key].amountPaid += amountPaid;
      map[key].totalRent = Math.max(map[key].totalRent || 0, totalRent);
    }

    const breakdown = calculatePaymentBreakdown(
      map[key].totalRent,
      map[key].amountPaid,
    );

    map[key].balance = breakdown.balance;
    map[key].status = breakdown.status;
  });

  return Object.values(map);
};

export const getMonthKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

export const calculateTenantDues = (
  tenants,
  payments,
  month = getMonthKey(),
) => {
  const normalized = normalizePayments(payments, tenants);
  const paymentsByTenant = normalized.reduce((map, payment) => {
    if (payment.month === month) {
      map[payment.tenantId] = payment;
    }

    return map;
  }, {});

  return tenants.reduce(
    (summary, tenant) => {
      if (!isTenantActiveForMonth(tenant, month)) return summary;

      const rent = toNumber(tenant.rent);
      const paid = paymentsByTenant[tenant.id]?.amountPaid || 0;
      const balance = Math.max(0, rent - paid);

      if (balance > 0) {
        summary.pendingCount += 1;
        summary.pendingAmount += balance;
        summary.pendingTenants.push({
          id: tenant.id,
          name: tenant.name,
          room: tenant.room,
          rent,
          paid,
          balance,
        });
      }

      return summary;
    },
    { pendingCount: 0, pendingAmount: 0, pendingTenants: [], month },
  );
};

export const calculateSummary = (filtered, tenants = []) => {
  const normalized = normalizePayments(filtered, tenants);

  let totalPaid = 0;
  let totalPartial = 0;
  let totalOverdue = 0;
  let totalBalance = 0;

  const today = new Date();

  normalized.forEach((payment) => {
    const total = payment.totalRent || 0;
    const paid = payment.amountPaid || 0;
    const balance = Math.max(0, total - paid);

    if (paid >= total) {
      totalPaid += total;
    } else if (paid > 0) {
      totalPartial += paid;
      totalBalance += balance;
    } else if (payment.paidOn && new Date(payment.paidOn) < today) {
      totalOverdue += total;
    }
  });

  return {
    totalPaid,
    totalPartial,
    totalOverdue,
    totalBalance,
    normalized,
  };
};
