export const formatINR = (value) =>
  `₹${(Number(value) || 0).toLocaleString("en-IN")}`;

export const formatDate = (value) => {
  if (!value) return "-";
  const date = value?.seconds ? new Date(value.seconds * 1000) : new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export function openWhatsAppReminder(phone, message) {
  const cleanPhone = String(phone || "").replace(/\D/g, "");
  const target = cleanPhone ? `91${cleanPhone.slice(-10)}` : "";
  const url = `https://wa.me/${target}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

export function openEmailReminder(email, subject, body) {
  window.location.href = `mailto:${email || ""}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function exportCsv(filename, rows) {
  const csv = rows
    .map((row) =>
      row
        .map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`)
        .join(","),
    )
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function openPrintableReport(title, sections) {
  const rows = sections
    .map(
      (section) => `
        <h2>${section.title}</h2>
        <table>
          <thead><tr>${section.headers.map((header) => `<th>${header}</th>`).join("")}</tr></thead>
          <tbody>
            ${section.rows
              .map(
                (row) =>
                  `<tr>${row.map((cell) => `<td>${cell ?? "-"}</td>`).join("")}</tr>`,
              )
              .join("")}
          </tbody>
        </table>`,
    )
    .join("");

  const reportWindow = window.open("", "_blank");

  if (!reportWindow) {
    alert("Please allow pop-ups to open the printable PDF report.");
    return;
  }

  reportWindow.document.write(`<!doctype html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { margin: 32px; color: #0f172a; font-family: Inter, system-ui, sans-serif; }
          h1 { margin: 0 0 8px; font-size: 28px; }
          h2 { margin: 28px 0 10px; font-size: 18px; }
          p { color: #64748b; margin: 0 0 24px; }
          table { width: 100%; border-collapse: collapse; font-size: 13px; }
          th { background: #f1f5f9; text-align: left; color: #475569; }
          th, td { border: 1px solid #e2e8f0; padding: 10px; }
          .actions { margin-bottom: 24px; }
          button { border: 0; border-radius: 999px; background: #2563eb; color: white; padding: 10px 16px; font-weight: 700; }
          @media print { .actions { display: none; } body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="actions"><button onclick="window.print()">Export PDF</button></div>
        <h1>${title}</h1>
        <p>Generated on ${new Date().toLocaleString("en-IN")}</p>
        ${rows}
      </body>
    </html>`);
  reportWindow.document.close();
}

export function startRazorpayPayment({ amount, name, description }) {
  const key = import.meta.env.VITE_RAZORPAY_KEY_ID;

  if (!key || !window.Razorpay) {
    alert(
      "Razorpay checkout is not configured. Add VITE_RAZORPAY_KEY_ID and include the Razorpay checkout script in index.html.",
    );
    return;
  }

  const checkout = new window.Razorpay({
    key,
    amount: Math.round((Number(amount) || 0) * 100),
    currency: "INR",
    name: "Kothari Spaces",
    description,
    prefill: { name },
    theme: { color: "#2563eb" },
  });

  checkout.open();
}
