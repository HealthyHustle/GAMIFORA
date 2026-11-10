import { useState, useMemo } from 'react'
import { Check, Copy } from 'lucide-react'
import Prism from 'prismjs'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-java'

interface AiCodeBlockProps {
  language?: string
  code: string
}

export function AiCodeBlock({ language = 'text', code }: AiCodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const normalizedLang = (language || 'text').toLowerCase()

  const highlightedHtml = useMemo(() => {
    try {
      const grammar = Prism.languages[normalizedLang] || Prism.languages.text || Prism.languages.plain
      if (grammar) {
        return Prism.highlight(code, grammar, normalizedLang)
      }
    } catch {
      return code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
    }
    return code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  }, [code, normalizedLang])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = code
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="ai-code-block">
      <div className="ai-code-block__header">
        <span className="ai-code-block__lang">{normalizedLang}</span>
        <button
          type="button"
          onClick={handleCopy}
          className={`ai-copy-btn ${copied ? 'is-copied' : ''}`}
          aria-label={copied ? 'Kode tersalin' : 'Salin kode'}
          title="Salin kode"
        >
          {copied ? (
            <>
              <Check size={14} strokeWidth={2.5} />
              <span>Tersalin!</span>
            </>
          ) : (
            <>
              <Copy size={14} strokeWidth={2} />
              <span>Salin</span>
            </>
          )}
        </button>
      </div>
      <pre className="ai-code-block__pre">
        <code
          className={`language-${normalizedLang}`}
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      </pre>
    </div>
  )
}

