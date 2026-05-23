import { getBusinessType } from "./businessTypes";

const formatCurrency = (value) => `₹${(Number(value) || 0).toLocaleString("en-IN")}`;

const safeText = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

export function getReceiptNumber(payment) {
  return `RCPT-${payment.month || "NA"}-${String(payment.id || Date.now()).slice(0, 8).toUpperCase()}`;
}

export function buildReceiptText(payment) {
  const type = getBusinessType(payment.businessType);
  const receiptNo = getReceiptNumber(payment);

  return [
    "Payment Receipt",
    `Receipt: ${receiptNo}`,
    `Business: ${type.label}`,
    `${type.customerLabel}: ${payment.tenantName || "Customer"}`,
    `${type.unitLabel}: ${payment.tenantRoom || "-"}`,
    `Billing Month: ${payment.month || "-"}`,
    `Paid On: ${payment.paidOn || "-"}`,
    `${type.feeLabel}: ${formatCurrency(payment.totalRent)}`,
    `Paid: ${formatCurrency(payment.amountPaid)}`,
    `Balance: ${formatCurrency(payment.balance)}`,
    `Status: ${payment.status || "-"}`,
  ].join("\n");
}

export function buildReceiptHtml(payment) {
  const type = getBusinessType(payment.businessType);
  const receiptNo = getReceiptNumber(payment);

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${safeText(receiptNo)}</title>
    <style>
      body { margin: 0; background: #f8fafc; color: #0f172a; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
      .page { max-width: 720px; margin: 32px auto; background: white; border: 1px solid #e2e8f0; border-radius: 18px; overflow: hidden; box-shadow: 0 18px 50px rgba(15, 23, 42, 0.10); }
      .hero { padding: 28px; background: #0f172a; color: white; display: flex; justify-content: space-between; gap: 24px; }
      .hero p, .hero h1 { margin: 0; }
      .hero h1 { font-size: 26px; }
      .badge { align-self: start; border-radius: 999px; background: rgba(255,255,255,0.12); padding: 8px 12px; font-size: 13px; font-weight: 700; }
      .content { padding: 28px; }
      .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
      .item { border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; }
      .label { color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; }
      .value { margin-top: 5px; font-size: 16px; font-weight: 800; }
      .total { margin-top: 18px; border-radius: 14px; background: #f1f5f9; padding: 18px; display: grid; gap: 10px; }
      .row { display: flex; justify-content: space-between; gap: 16px; }
      .paid { color: #047857; }
      .due { color: #dc2626; }
      .footer { padding: 18px 28px 28px; color: #64748b; font-size: 13px; }
      @media print { body { background: white; } .page { margin: 0; border: 0; box-shadow: none; } }
      @media (max-width: 640px) { .page { margin: 0; min-height: 100vh; border-radius: 0; } .hero, .grid { display: block; } .badge { display: inline-block; margin-top: 16px; } .item { margin-top: 12px; } }
    </style>
  </head>
  <body>
    <main class="page">
      <section class="hero">
        <div>
          <p class="label">Payment Receipt</p>
          <h1>${safeText(payment.tenantName || "Customer")}</h1>
          <p style="margin-top:8px;color:#cbd5e1">${safeText(type.label)} • ${safeText(receiptNo)}</p>
        </div>
        <div class="badge">${safeText(payment.status || "Recorded")}</div>
      </section>
      <section class="content">
        <div class="grid">
          <div class="item"><div class="label">${safeText(type.customerLabel)}</div><div class="value">${safeText(payment.tenantName || "-")}</div></div>
          <div class="item"><div class="label">${safeText(type.unitLabel)}</div><div class="value">${safeText(payment.tenantRoom || "-")}</div></div>
          <div class="item"><div class="label">Billing Month</div><div class="value">${safeText(payment.month || "-")}</div></div>
          <div class="item"><div class="label">Paid On</div><div class="value">${safeText(payment.paidOn || "-")}</div></div>
        </div>
        <div class="total">
          <div class="row"><span>${safeText(type.feeLabel)}</span><strong>${formatCurrency(payment.totalRent)}</strong></div>
          <div class="row paid"><span>Amount Paid</span><strong>${formatCurrency(payment.amountPaid)}</strong></div>
          <div class="row due"><span>Balance</span><strong>${formatCurrency(payment.balance)}</strong></div>
        </div>
      </section>
      <footer class="footer">Generated from the unified Hotel, PG and Library management dashboard.</footer>
    </main>
  </body>
</html>`;
}

export function downloadReceipt(payment) {
  const blob = new Blob([buildReceiptHtml(payment)], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${getReceiptNumber(payment)}.html`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function shareReceipt(payment) {
  const text = buildReceiptText(payment);
  const title = getReceiptNumber(payment);

  if (navigator.share) {
    await navigator.share({ title, text });
    return;
  }

  await navigator.clipboard.writeText(text);
  alert("Receipt details copied. You can paste and share it anywhere.");
}
