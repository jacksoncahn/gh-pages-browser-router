import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useState } from "react";
import { copyToClipboard } from "@/utils/download.utils";

interface CodeBlockProps {
  code: string;
  onCopy?: () => void;
}

/**
 * A code display component with copy-to-clipboard functionality.
 * Manages "Copied" state internally and provides visual feedback.
 */
export function CodeBlock({ code, onCopy }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(code);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onCopy?.();
    }
  };

  return (
    <div className="mt-6 relative flex flex-row items-center gap-4">
      <pre className="bg-card p-4 rounded-lg max-w-full w-full whitespace-pre-wrap wrap-break-word">
        <code className="text-sm">{code}</code>
      </pre>
      <Button size="sm" variant="outline" onClick={handleCopy}>
        <Copy className="mr-2 h-4 w-4" />
        {copied ? "Copied!" : "Copy"}
      </Button>
    </div>
  );
}
