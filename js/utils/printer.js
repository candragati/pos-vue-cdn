export function printReceipt() {
  const receipt = document.getElementById("receipt");

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";

  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow.document;

  // Build HTML via DOM (NO document.write)
  const html = doc.createElement("html");
  const head = doc.createElement("head");
  const body = doc.createElement("body");

  const style = doc.createElement("style");
  style.textContent = `
    body {
      font-family: monospace;
      font-size: 12px;
      margin: 0;
      padding: 8px;
    }
    .receipt-row {
      display: flex;
      justify-content: space-between;
    }
    .center {
      text-align: center;
    }
    hr {
      border-top: 1px dashed #000;
    }
    button {
      display: none;
    }
  `;

  head.appendChild(style);

  // clone receipt content
  body.innerHTML = receipt.innerHTML;

  html.appendChild(head);
  html.appendChild(body);

  doc.open();
  doc.appendChild(html);
  doc.close();

  iframe.contentWindow.focus();
  iframe.contentWindow.print();

  setTimeout(() => {
    document.body.removeChild(iframe);
  }, 1000);
}
