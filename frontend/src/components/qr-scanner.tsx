"use client";
type QrScannerProps = {
  onScanSuccess: (scannedId: string) => void;
};
import { useState } from "react";
import { useRouter } from "next/navigation";

export function QrScanner({ onScanSuccess }: QrScannerProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  if (!open) {
    return (
      <button
        type="button"
        className="mt-4 text-sm text-slate-500 underline"
        onClick={() => setOpen(true)}
      >
        Scan QR Code
      </button>
    );
  }

  return (
    <div className="mx-auto mt-4 max-w-sm rounded-xl border border-[var(--border-soft)] bg-white p-4">
      <p className="mb-2 text-sm text-slate-600">
        Upload a QR image to verify (camera scanner optional by browser support).
      </p>
      <input
        type="file"
        accept="image/*"
        className="block w-full text-sm"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          setError("");
          try {
            // BarcodeDetector is supported in Chromium-based browsers.
            // This keeps the build dependency-free when QR libraries are unavailable.
            const BarcodeDetectorCtor = (window as Window & { BarcodeDetector?: any }).BarcodeDetector;
            if (!BarcodeDetectorCtor) {
              setError("QR scanning is not supported in this browser yet.");
              return;
            }
            const detector = new BarcodeDetectorCtor({ formats: ["qr_code"] });
            const bitmap = await createImageBitmap(file);
            const results = await detector.detect(bitmap);
            const text = results?.[0]?.rawValue;
            if (!text) {
              setError("No QR code detected in this image.");
              return;
            }
            const parsed = new URL(text);
            const parts = parsed.pathname.split("/").filter(Boolean);
            const certId = parts[parts.length - 1];
            if (certId) {
              router.push(`/info/${encodeURIComponent(certId)}`);
              return;
            }
            setError("QR code does not contain a valid certificate link.");
          } catch {
            setError("Could not read this QR code image.");
          }
        }}
      />
      {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
