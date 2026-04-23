"use client";

/**
 * BarcodeScannerButton
 * ─────────────────────────────────────────────────────────────────────────
 * Mobile-first barcode scanner using the native `BarcodeDetector` API where
 * available (Chrome Android, Safari iOS 17+). Falls back to hiding on
 * unsupported browsers so the button never shows up as dead UI on desktop
 * Chrome or older devices.
 *
 * Usage:
 *   <BarcodeScannerButton onDetect={(code) => searchProduct(code)} />
 *
 * The component is entirely self-contained: it opens a full-screen camera
 * dialog (mobile-full-screen sheet on small screens) that continuously scans
 * frames and fires `onDetect` the first time a supported code is found, then
 * closes automatically. Formats scanned: EAN-13, EAN-8, UPC-A, Code-128,
 * QR codes.
 */

import * as React from "react";
import { ScanLine, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// Minimal typing for the experimental BarcodeDetector API. We don't depend on
// DOM lib updates so we declare what we need and fall back gracefully when the
// API is missing.
type DetectedBarcode = { rawValue: string; format: string };
type BarcodeDetectorCtor = new (init?: { formats?: string[] }) => {
  detect: (source: CanvasImageSource) => Promise<DetectedBarcode[]>;
};

function getBarcodeDetector(): BarcodeDetectorCtor | null {
  if (typeof window === "undefined") return null;
  const maybe = (window as unknown as { BarcodeDetector?: BarcodeDetectorCtor }).BarcodeDetector;
  return maybe ?? null;
}

const SUPPORTED_FORMATS = [
  "ean_13",
  "ean_8",
  "upc_a",
  "upc_e",
  "code_128",
  "code_39",
  "qr_code",
  "itf",
];

export interface BarcodeScannerButtonProps {
  /** Called with the detected code (rawValue) on successful scan. */
  onDetect: (code: string) => void;
  /** Render the button only on mobile (<md) — defaults to true. */
  mobileOnly?: boolean;
  /** Optional className forwarded to the trigger Button. */
  className?: string;
  /** Optional trigger label; defaults to an icon-only square button. */
  label?: string;
  /** Disabled state (e.g. while the form is submitting). */
  disabled?: boolean;
}

export function BarcodeScannerButton({
  onDetect,
  mobileOnly = true,
  className,
  label,
  disabled,
}: BarcodeScannerButtonProps) {
  const [open, setOpen] = React.useState(false);
  const [supported, setSupported] = React.useState<boolean | null>(null);

  // Feature-detect BarcodeDetector on mount. Hide the button entirely if the
  // browser has no camera API or no BarcodeDetector.
  React.useEffect(() => {
    const hasMedia = typeof navigator !== "undefined" && !!navigator.mediaDevices?.getUserMedia;
    const ctor = getBarcodeDetector();
    setSupported(hasMedia && !!ctor);
  }, []);

  if (supported === false) return null; // unsupported browser → no UI
  if (supported === null) return null; // still feature-detecting on SSR/initial

  const handleDetected = (code: string) => {
    setOpen(false);
    onDetect(code);
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size={label ? "sm" : "icon"}
        disabled={disabled}
        onClick={() => setOpen(true)}
        className={cn(
          mobileOnly && "md:hidden",
          "shrink-0",
          className,
        )}
        aria-label="Quét mã vạch"
      >
        <ScanLine className="h-4 w-4" />
        {label ? <span className="ml-1.5">{label}</span> : null}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          mobileFullScreen
          className="max-w-md p-0 overflow-hidden gap-0 bg-black text-white border-0"
        >
          <DialogHeader className="px-4 py-3 border-b border-white/10 flex-row items-center justify-between space-y-0">
            <DialogTitle className="text-base text-white">Quét mã vạch</DialogTitle>
            <DialogDescription className="sr-only">
              Đưa mã vạch vào khung để quét
            </DialogDescription>
            <button
              type="button"
              aria-label="Đóng"
              onClick={() => setOpen(false)}
              className="h-8 w-8 flex items-center justify-center rounded-md text-white/80 hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
          </DialogHeader>
          {open && <ScannerSurface onDetected={handleDetected} />}
        </DialogContent>
      </Dialog>
    </>
  );
}

function ScannerSurface({ onDetected }: { onDetected: (code: string) => void }) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [starting, setStarting] = React.useState(true);

  React.useEffect(() => {
    const Detector = getBarcodeDetector();
    if (!Detector) {
      setError("Trình duyệt không hỗ trợ quét mã vạch.");
      return;
    }
    let stream: MediaStream | null = null;
    let rafId = 0;
    let cancelled = false;
    const detector = new Detector({ formats: SUPPORTED_FORMATS });

    const stop = () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      stream?.getTracks().forEach((t) => t.stop());
    };

    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (!videoRef.current || cancelled) return;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStarting(false);

        const scan = async () => {
          if (cancelled || !videoRef.current) return;
          try {
            const results = await detector.detect(videoRef.current);
            const first = results?.[0];
            if (first?.rawValue) {
              onDetected(first.rawValue);
              stop();
              return;
            }
          } catch {
            // transient detect failures are OK, keep looping
          }
          rafId = requestAnimationFrame(scan);
        };
        rafId = requestAnimationFrame(scan);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Không truy cập được camera.");
      }
    })();

    return stop;
  }, [onDetected]);

  return (
    <div className="relative bg-black w-full">
      <div className="relative aspect-3/4 md:aspect-video w-full overflow-hidden">
        <video
          ref={videoRef}
          playsInline
          muted
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Targeting reticle */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative w-[78%] max-w-80 aspect-4/3">
            <div className="absolute inset-0 rounded-2xl border-2 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]" />
            <div className="absolute left-0 right-0 top-1/2 h-px bg-red-500 animate-pulse" />
          </div>
        </div>
      </div>
      <div className="px-4 py-3 text-center text-sm text-white/90">
        {error ? (
          <p className="text-red-300">{error}</p>
        ) : starting ? (
          <p>Đang mở camera…</p>
        ) : (
          <p>Đưa mã vạch vào giữa khung để quét tự động.</p>
        )}
      </div>
    </div>
  );
}
