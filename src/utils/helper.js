const toNumber = (value) => Number(value) || 0;

const getPaymentTenantId = (payment) => payment.tenantId || payment.userId || "";

const getPaymentAmount = (payment) =>
  toNumber(payment.amountPaid ?? payment.amount ?? 0);

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

  data.forEach((p) => {
    const tenantId = getPaymentTenantId(p);
    const month = p.month || "";

    if (!tenantId || !month) return;

    const key = `${tenantId}-${month}`;
    const amountPaid = getPaymentAmount(p);
    const totalRent = toNumber(p.totalRent) || tenantRentById[tenantId] || 0;

    if (!map[key]) {
      map[key] = {
        ...p,
        tenantId,
        month,
        amountPaid,
        totalRent,
      };
    } else {
      map[key].amountPaid += amountPaid;
      map[key].totalRent = Math.max(map[key].totalRent || 0, totalRent);
    }

    const paid = map[key].amountPaid || 0;
    const total = map[key].totalRent || 0;
    const balance = Math.max(0, total - paid);

    map[key].balance = balance;
    map[key].status =
      total > 0 && paid >= total ? "Paid" : paid > 0 ? "Partial" : "Pending";
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

  normalized.forEach((p) => {
    const total = p.totalRent || 0;
    const paid = p.amountPaid || 0;
    const balance = Math.max(0, total - paid);

    if (paid >= total) {
      totalPaid += total;
    } else if (paid > 0) {
      totalPartial += paid;
      totalBalance += balance;
    } else {
      if (p.paidOn && new Date(p.paidOn) < today) {
        totalOverdue += total;
      }
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
