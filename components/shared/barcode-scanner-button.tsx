"use client";

/**
 * BarcodeScannerButton
 * ─────────────────────────────────────────────────────────────────────────
 * Mobile-first barcode scanner. Prefers the native `BarcodeDetector` API
 * (Chrome Android) for best performance, and falls back to the
 * `html5-qrcode` library when unavailable (iOS Safari, Firefox, WebView)
 * so the button keeps working across every modern browser on HTTPS.
 *
 * Usage:
 *   <BarcodeScannerButton onDetect={(code) => searchProduct(code)} />
 *
 * Formats scanned: EAN-13, EAN-8, UPC-A, UPC-E, Code-128, Code-39, QR, ITF.
 */

import {
  useState,
  useEffect,
  useRef,
  useId,
  type ReactNode,
} from "react";
import { ScanLine, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type DetectedBarcode = { rawValue: string; format: string };
type BarcodeDetectorCtor = new (init?: { formats?: string[] }) => {
  detect: (source: CanvasImageSource) => Promise<DetectedBarcode[]>;
};

function getBarcodeDetector(): BarcodeDetectorCtor | null {
  if (typeof window === "undefined") return null;
  const maybe = (window as unknown as { BarcodeDetector?: BarcodeDetectorCtor }).BarcodeDetector;
  return maybe ?? null;
}

function hasCamera(): boolean {
  if (typeof window === "undefined") return false;
  if (typeof navigator === "undefined") return false;
  if (window.isSecureContext === false) return false;
  return !!navigator.mediaDevices?.getUserMedia;
}

const NATIVE_FORMATS = [
  "ean_13",
  "ean_8",
  "upc_a",
  "upc_e",
  "code_128",
  "code_39",
  "qr_code",
  "itf",
];

type Support = "native" | "html5" | "unsupported" | "pending";

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
  const [open, setOpen] = useState(false);
  const [support, setSupport] = useState<Support>("pending");

  useEffect(() => {
    if (!hasCamera()) {
      setSupport("unsupported");
      return;
    }
    setSupport(getBarcodeDetector() ? "native" : "html5");
  }, []);

  if (support === "unsupported" || support === "pending") return null;

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
              className="h-8 w-8 flex items-center justify-center rounded-md text-white/80 hover:bg-black/10"
            >
              <X className="h-4 w-4" />
            </button>
          </DialogHeader>
          {open && support === "native" && <NativeScannerSurface onDetected={handleDetected} />}
          {open && support === "html5" && <Html5ScannerSurface onDetected={handleDetected} />}
        </DialogContent>
      </Dialog>
    </>
  );
}

function NativeScannerSurface({ onDetected }: { onDetected: (code: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(true);

  useEffect(() => {
    const Detector = getBarcodeDetector();
    if (!Detector) {
      setError("Trình duyệt không hỗ trợ quét mã vạch.");
      return;
    }
    let stream: MediaStream | null = null;
    let rafId = 0;
    let cancelled = false;
    const detector = new Detector({ formats: NATIVE_FORMATS });

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
    <ScannerFrame starting={starting} error={error}>
      <video
        ref={videoRef}
        playsInline
        muted
        className="absolute inset-0 h-full w-full object-cover"
      />
    </ScannerFrame>
  );
}

function Html5ScannerSurface({ onDetected }: { onDetected: (code: string) => void }) {
  const regionId = useId().replace(/:/g, "_") + "-barcode-region";
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let scanner: import("html5-qrcode").Html5Qrcode | null = null;
    let running = false;

    (async () => {
      try {
        const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import("html5-qrcode");
        if (cancelled) return;

        const formats = [
          Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.ITF,
        ];

        scanner = new Html5Qrcode(regionId, { verbose: false, formatsToSupport: formats });
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 260, height: 180 }, aspectRatio: 4 / 3 },
          (decoded) => {
            if (cancelled) return;
            onDetected(decoded);
          },
          () => {
            // ignore per-frame "no code detected" errors
          },
        );
        running = true;
        if (!cancelled) setStarting(false);
      } catch (err) {
        if (cancelled) return;
        const name = err instanceof Error ? err.name : "";
        const msg = err instanceof Error ? err.message : String(err);
        if (name === "NotAllowedError" || msg.includes("Permission")) {
          setError("Vui lòng cấp quyền truy cập camera để quét.");
        } else if (name === "NotFoundError" || msg.includes("no camera")) {
          setError("Không tìm thấy camera trên thiết bị.");
        } else {
          setError("Không thể khởi động camera: " + msg);
        }
      }
    })();

    return () => {
      cancelled = true;
      if (scanner && running) {
        scanner.stop().then(() => scanner?.clear()).catch(() => {});
      }
    };
  }, [onDetected, regionId]);

  return (
    <ScannerFrame starting={starting} error={error}>
      <div id={regionId} className="absolute inset-0 [&>video]:h-full [&>video]:w-full [&>video]:object-cover" />
    </ScannerFrame>
  );
}

function ScannerFrame({
  children,
  starting,
  error,
}: {
  children: ReactNode;
  starting: boolean;
  error: string | null;
}) {
  return (
    <div className="relative bg-black w-full">
      <div className="relative aspect-3/4 md:aspect-video w-full overflow-hidden">
        {children}
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
