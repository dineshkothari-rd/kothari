const RAZORPAY_CHECKOUT_URL = "https://checkout.razorpay.com/v1/checkout.js";
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

let checkoutScriptPromise;

const loadRazorpayCheckout = () => {
  if (window.Razorpay) return Promise.resolve();

  if (!checkoutScriptPromise) {
    checkoutScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = RAZORPAY_CHECKOUT_URL;
      script.async = true;
      script.onload = resolve;
      script.onerror = () =>
        reject(new Error("Unable to load Razorpay checkout"));
      document.body.appendChild(script);
    });
  }

  return checkoutScriptPromise;
};

export const isRazorpayConfigured = () => Boolean(RAZORPAY_KEY_ID);

export const collectRazorpayPayment = async ({
  amount,
  tenant,
  month,
  description,
}) => {
  if (!RAZORPAY_KEY_ID) {
    throw new Error("Razorpay key is missing. Add VITE_RAZORPAY_KEY_ID.");
  }

  await loadRazorpayCheckout();

  return new Promise((resolve, reject) => {
    const checkout = new window.Razorpay({
      key: RAZORPAY_KEY_ID,
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      name: "PG Rent Payment",
      description: description || `Rent payment for ${month}`,
      prefill: {
        name: tenant?.name || "",
        contact: tenant?.phone || "",
        email: tenant?.email || "",
      },
      notes: {
        tenantId: tenant?.id || "",
        tenantName: tenant?.name || "",
        room: tenant?.room || "",
        month,
      },
      theme: {
        color: "#2563eb",
      },
      handler: resolve,
      modal: {
        ondismiss: () => reject(new Error("Payment cancelled")),
      },
    });

    checkout.open();
  });
};
