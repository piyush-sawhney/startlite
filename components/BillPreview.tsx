"use client";

import { useState } from "react";
import { renderSVG } from "uqr";
import { primaryButton, quietButton } from "@/components/ui";

export type ReceiptData = {
  shopName: string;
  billNo: string;
  date: string;
  customerName: string | null;
  lines: Array<{ quantity: string; label: string; amount: string }>;
  total: string;
  paid: string;
  due: string;
  upiUri: string | null;
  phone: string;
  referral: string;
};

export function BillPreview({
  billText,
  reminderText,
  billWhatsappUrl,
  reminderWhatsappUrl,
  receipt,
}: {
  billText: string;
  reminderText: string;
  billWhatsappUrl: string | null;
  reminderWhatsappUrl: string | null;
  receipt: ReceiptData;
}) {
  const [tab, setTab] = useState<"bill" | "reminder">("bill");
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  const text = tab === "bill" ? billText : reminderText;
  const whatsappUrl = tab === "bill" ? billWhatsappUrl : reminderWhatsappUrl;

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  async function downloadReceipt() {
    setBusy(true);
    try {
      const blob = await renderReceipt(receipt);
      const file = new File([blob], `bill-${receipt.billNo}.png`, {
        type: "image/png",
      });
      const nav = navigator as Navigator & {
        canShare?: (data: { files: File[] }) => boolean;
      };
      if (nav.canShare?.({ files: [file] })) {
        await nav.share({ files: [file], title: `Bill ${receipt.billNo}` });
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `bill-${receipt.billNo}.png`;
        link.click();
        URL.revokeObjectURL(url);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2 rounded-md bg-muted p-1">
        <button
          type="button"
          onClick={() => setTab("bill")}
          className={
            tab === "bill"
              ? "min-h-10 rounded-[9px] bg-surface text-sm font-medium shadow-sm"
              : "min-h-10 rounded-[9px] text-sm font-medium text-ink-muted"
          }
        >
          Bill
        </button>
        <button
          type="button"
          onClick={() => setTab("reminder")}
          className={
            tab === "reminder"
              ? "min-h-10 rounded-[9px] bg-surface text-sm font-medium shadow-sm"
              : "min-h-10 rounded-[9px] text-sm font-medium text-ink-muted"
          }
        >
          Reminder
        </button>
      </div>

      <pre className="overflow-x-auto whitespace-pre-wrap rounded-2xl border border-line bg-surface p-4 font-sans text-[14px] leading-6">
        {text}
      </pre>

      <div className="flex flex-col gap-2">
        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className={primaryButton("w-full min-h-12")}
          >
            Send on WhatsApp
          </a>
        ) : (
          <p className="rounded-md bg-muted px-3 py-2 text-sm text-ink-muted">
            Add the customer’s phone number to send this on WhatsApp.
          </p>
        )}
        <div className="flex gap-2">
          <button type="button" className={quietButton("flex-1")} onClick={copy}>
            {copied ? "Copied" : "Copy text"}
          </button>
          <button
            type="button"
            className={quietButton("flex-1")}
            onClick={downloadReceipt}
            disabled={busy}
          >
            {busy ? "Making…" : "Generate image"}
          </button>
        </div>
      </div>
    </div>
  );
}

async function renderReceipt(data: ReceiptData): Promise<Blob> {
  const width = 720;
  const margin = 48;
  const rowHeight = 34;
  const headerHeight = 250;
  const qrSize = 200;
  const footerHeight = 210;
  const linesHeight = Math.max(data.lines.length, 1) * rowHeight + 40;
  const height =
    headerHeight +
    linesHeight +
    150 +
    (data.upiUri ? qrSize + 80 : 20) +
    footerHeight;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.textBaseline = "top";
  ctx.fillStyle = "#2A2724";

  let y = margin;

  ctx.font = "600 38px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText(data.shopName, margin, y);
  y += 54;

  ctx.font = "400 20px ui-sans-serif, system-ui, sans-serif";
  ctx.fillStyle = "#75706A";
  ctx.fillText(`Bill ${data.billNo} · ${data.date}`, margin, y);
  y += 34;

  if (data.customerName) {
    ctx.fillStyle = "#2A2724";
    ctx.fillText(data.customerName, margin, y);
    y += 34;
  }

  y += 16;
  ctx.strokeStyle = "#E4E1D9";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(margin, y);
  ctx.lineTo(width - margin, y);
  ctx.stroke();
  y += 20;

  ctx.font = "400 20px ui-sans-serif, system-ui, sans-serif";
  for (const line of data.lines) {
    ctx.fillStyle = "#2A2724";
    ctx.textAlign = "left";
    ctx.fillText(line.quantity, margin, y);
    ctx.textAlign = "right";
    ctx.fillText(line.amount, width - margin, y);
    ctx.textAlign = "left";
    ctx.fillText(line.label, margin + 56, y, width - margin * 2 - 180);
    y += rowHeight;
  }

  y += 8;
  ctx.beginPath();
  ctx.moveTo(margin, y);
  ctx.lineTo(width - margin, y);
  ctx.stroke();
  y += 22;

  for (const [label, value, strong] of [
    ["Total", data.total, false],
    ["Paid", data.paid, false],
    ["Due", data.due, true],
  ] as const) {
    ctx.font = strong
      ? "600 24px ui-sans-serif, system-ui, sans-serif"
      : "400 22px ui-sans-serif, system-ui, sans-serif";
    ctx.fillStyle = "#2A2724";
    ctx.textAlign = "left";
    ctx.fillText(label, margin, y);
    ctx.textAlign = "right";
    ctx.fillText(value, width - margin, y);
    ctx.textAlign = "left";
    y += strong ? 38 : 32;
  }

  if (data.upiUri) {
    y += 24;
    const svg = renderSVG(data.upiUri, { border: 2, ecc: "M" });
    const qr = await svgToImage(
      `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
    );
    const qrX = (width - qrSize) / 2;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(qr, qrX, y, qrSize, qrSize);
    y += qrSize + 16;
    ctx.font = "500 18px ui-sans-serif, system-ui, sans-serif";
    ctx.fillStyle = "#75706A";
    ctx.textAlign = "center";
    ctx.fillText("Scan to pay the due amount", width / 2, y);
    ctx.textAlign = "left";
    y += 32;
  }

  y = height - footerHeight + 24;
  ctx.strokeStyle = "#E4E1D9";
  ctx.beginPath();
  ctx.moveTo(margin, y);
  ctx.lineTo(width - margin, y);
  ctx.stroke();
  y += 26;

  ctx.font = "500 18px ui-sans-serif, system-ui, sans-serif";
  ctx.fillStyle = "#75706A";
  ctx.textAlign = "center";
  ctx.fillText(data.phone, width / 2, y);
  y += 34;
  ctx.font = "500 18px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText(data.referral, width / 2, y);
  ctx.textAlign = "left";

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Could not render the image"));
    }, "image/png");
  });
}

function svgToImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not render the QR"));
    image.src = source;
  });
}
