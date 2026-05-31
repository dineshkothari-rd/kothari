const MAX_ID_PROOF_BYTES = 650 * 1024;

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "application/pdf",
];

export const idProofHelpText = "JPG, PNG or PDF - Max 650KB";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function validateIdProofFile(file) {
  if (!file) return "Please choose a file.";

  if (!allowedTypes.includes(file.type)) {
    return "Only JPG, PNG or PDF files are allowed.";
  }

  if (file.size > MAX_ID_PROOF_BYTES) {
    return "ID proof must be 650KB or smaller. Please compress the file and try again.";
  }

  return "";
}

export function readIdProofFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = () => reject(new Error("Could not read ID proof file."));
    reader.readAsDataURL(file);
  });
}

export function openIdProof({ dataUrl, name = "ID Proof" }) {
  if (!dataUrl) return false;

  const proofWindow = window.open("", "_blank");
  if (!proofWindow) {
    alert("Please allow pop-ups to view the ID proof.");
    return false;
  }
  proofWindow.opener = null;

  const safeName = escapeHtml(name);
  const safeUrl = escapeHtml(dataUrl);
  const content = `<img src="${safeUrl}" alt="${safeName}" />`;

  proofWindow.document.write(`<!doctype html>
    <html>
      <head>
        <title>${safeName}</title>
        <style>
          html, body { height: 100%; margin: 0; background: #0f172a; color: white; font-family: system-ui, sans-serif; }
          header { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 12px 16px; background: #020617; }
          a { color: white; font-weight: 700; text-decoration: none; }
          main { height: calc(100% - 52px); display: grid; place-items: center; overflow: auto; }
          iframe { width: 100%; height: 100%; border: 0; background: white; }
          img { max-width: 100%; max-height: 100%; object-fit: contain; }
        </style>
      </head>
      <body>
        <header>
          <strong>${safeName}</strong>
          <a href="${safeUrl}" download="${safeName}">Download</a>
        </header>
        <main>${content}</main>
      </body>
    </html>`);
  proofWindow.document.close();
  return true;
}

export const compressImage = (file, quality = 0.6, maxWidth = 1200) => {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");

      let { width, height } = img;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      resolve(canvas.toDataURL("image/jpeg", quality));
    };

    reader.readAsDataURL(file);
  });
};
