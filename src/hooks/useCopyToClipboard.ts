import { useState } from "react";
import { copyToClipboard } from "@/utils/download.utils";

/**
 * Copies text to the clipboard and exposes transient "copied"/"error" flags
 * that reset after 2 seconds, for use as button feedback.
 */
export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  const copy = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
    return success;
  };

  return { copied, error, copy };
}
