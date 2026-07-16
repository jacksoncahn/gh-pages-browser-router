import { Button } from '@/components/ui/button'
import { Copy } from 'lucide-react'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'

interface CodeBlockProps {
  code: string
  onCopy?: () => void
}

/**
 * A code display component with copy-to-clipboard functionality.
 * Manages "Copied" state internally and provides visual feedback.
 */
export function CodeBlock({ code, onCopy }: CodeBlockProps) {
  const { copied, error, copy } = useCopyToClipboard()

  const handleCopy = async () => {
    const success = await copy(code)
    if (success) {
      onCopy?.()
    }
  }

  return (
    <div className="mt-6 relative flex flex-row items-center gap-4">
      <pre className="bg-card p-4 rounded-lg max-w-full w-full whitespace-pre-wrap wrap-break-word">
        <code className="text-sm">{code}</code>
      </pre>
      <Button size="sm" variant="outline" onClick={handleCopy}>
        <Copy className="mr-2 h-4 w-4" />
        {copied ? 'Copied!' : error ? 'Failed to copy' : 'Copy'}
      </Button>
    </div>
  )
}
