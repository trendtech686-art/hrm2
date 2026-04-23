"use client";

import * as React from "react";
import { Share2, Check, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type ShareButtonProps = {
  /** Title for the native share sheet. */
  title: string;
  /** Short text / description shown alongside the URL. */
  text?: string;
  /**
   * URL to share. Defaults to `window.location.href`, so most call-sites
   * can simply pass title + text.
   */
  url?: string;
  /** Optional files to share (images, PDF…). Only honored if the browser
   * advertises `canShare({files})`. */
  files?: File[];
  size?: "sm" | "icon" | "default";
  variant?: "outline" | "ghost" | "default" | "secondary";
  className?: string;
  /** Custom label. Defaults to "Chia sẻ". Hidden when size === "icon". */
  label?: string;
  disabled?: boolean;
};

/**
 * Invokes `navigator.share()` when available (mobile + most modern browsers),
 * falling back to clipboard copy with a toast. Gracefully ignores user-aborted
 * share attempts (`AbortError`). Never throws — share should always feel safe
 * from the caller's perspective.
 */
export function ShareButton({
  title,
  text,
  url,
  files,
  size = "sm",
  variant = "outline",
  className,
  label = "Chia sẻ",
  disabled,
}: ShareButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const handleShare = React.useCallback(async () => {
    const resolvedUrl = url ?? (typeof window !== "undefined" ? window.location.href : "");
    const sharePayload: ShareData = { title, url: resolvedUrl };
    if (text) sharePayload.text = text;
    if (files && files.length > 0) sharePayload.files = files;

    const canShareFiles =
      typeof navigator !== "undefined" &&
      typeof navigator.canShare === "function" &&
      files && files.length > 0
        ? navigator.canShare({ files })
        : true;

    if (typeof navigator !== "undefined" && typeof navigator.share === "function" && canShareFiles) {
      try {
        await navigator.share(sharePayload);
        return;
      } catch (err) {
        // User dismissed the share sheet — not an error worth surfacing.
        if (err instanceof Error && err.name === "AbortError") return;
        // Any other share failure falls through to clipboard copy.
      }
    }

    // Fallback: copy link to clipboard.
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(resolvedUrl);
        setCopied(true);
        toast.success("Đã sao chép liên kết");
        window.setTimeout(() => setCopied(false), 2000);
      } else {
        toast.info("Liên kết:", { description: resolvedUrl });
      }
    } catch {
      toast.error("Không thể sao chép liên kết");
    }
  }, [title, text, url, files]);

  const isIcon = size === "icon";
  const Icon = copied ? Check : files && files.length > 0 ? Share2 : Link2;

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      onClick={handleShare}
      disabled={disabled}
      className={className}
      aria-label={isIcon ? label : undefined}
    >
      <Icon className={cn("h-4 w-4", !isIcon && "mr-1.5")} />
      {!isIcon && <span>{copied ? "Đã copy" : label}</span>}
    </Button>
  );
}
