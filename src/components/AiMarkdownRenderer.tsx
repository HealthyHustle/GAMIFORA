import type { ComponentPropsWithoutRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { AiCodeBlock } from './AiCodeBlock'

interface AiMarkdownRendererProps {
  content: string
}

export function AiMarkdownRenderer({ content }: AiMarkdownRendererProps) {
  return (
    <div className="ai-markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }: ComponentPropsWithoutRef<'code'>) {
            const match = /language-(\w+)/.exec(className || '')
            const raw = String(children).replace(/\n$/, '')
            const isMultiline = String(children).includes('\n')

            if (!match && !isMultiline) {
              return (
                <code className="ai-inline-code" {...props}>
                  {children}
                </code>
              )
            }

            return <AiCodeBlock language={match ? match[1] : 'text'} code={raw} />
          },
          table({ children, ...props }: ComponentPropsWithoutRef<'table'>) {
            return (
              <div className="ai-table-wrap">
                <table className="ai-table" {...props}>
                  {children}
                </table>
              </div>
            )
          },
          blockquote({ children, ...props }: ComponentPropsWithoutRef<'blockquote'>) {
            return (
              <blockquote className="ai-blockquote" {...props}>
                {children}
              </blockquote>
            )
          },
          a({ href, children, ...props }: ComponentPropsWithoutRef<'a'>) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="ai-link"
                {...props}
              >
                {children}
              </a>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

