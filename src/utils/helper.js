const normalizePayments = (data) => {
  const map = {};

  data.forEach((p) => {
    const key = `${p.tenantId}-${p.month}`;

    if (!map[key]) {
      map[key] = {
        ...p,
        amountPaid: p.amountPaid || 0,
      };
    } else {
      map[key].amountPaid += p.amountPaid || 0;
    }
  });

  return Object.values(map).map((p) => {
    const total = p.totalRent || 0;
    const paid = p.amountPaid || 0;
    const balance = Math.max(0, total - paid);

    return {
      ...p,
      balance,
      status: paid >= total ? "Paid" : paid > 0 ? "Partial" : p.status,
    };
  });
};

export const calculateSummary = (filtered) => {
  const normalized = normalizePayments(filtered);

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
      totalBalance += balance;
      if (p.status === "Overdue" || (p.dueDate && new Date(p.dueDate) < today)) {
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
