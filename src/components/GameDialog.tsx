import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  persistent?: boolean
  tone?: 'cream' | 'gold'
  id?: string
}

export function GameDialog({ open, onClose, title, children, persistent = false, id }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      id={id}
      className="game-dialog"
      aria-labelledby={`${id ?? 'dlg'}-title`}
      onClose={() => {
        if (open) onClose()
      }}
      onCancel={(e) => {
        if (persistent) e.preventDefault()
      }}
      onClick={(e) => {
        if (!persistent && e.target === ref.current) onClose()
      }}
    >
      <div className="game-dialog__panel parchment">
        <header className="game-dialog__head">
          <h2 id={`${id ?? 'dlg'}-title`}>{title}</h2>
          {!persistent && (
            <button type="button" className="icon-btn" onClick={onClose} aria-label="Tutup">
              <X size={22} />
            </button>
          )}
        </header>
        <div className="game-dialog__body">{children}</div>
      </div>
    </dialog>
  )
}

