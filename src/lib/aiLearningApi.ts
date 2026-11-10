import type { AiLearningRequest, AiLearningResponse, ChatMessage } from '../types.ts'

export function getAiWebhookUrl(): string {
  const envUrl = import.meta.env.VITE_AI_LEARNING_WEBHOOK_URL
  if (typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.trim()
  }
  return ''
}

export function generateSessionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `session-${crypto.randomUUID()}`
  }
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function resolveUserId(email?: string | null): string {
  if (email && email.trim()) {
    return email.trim().toLowerCase()
  }
  const key = 'gamifora_ai_guest_id'
  let guest = localStorage.getItem(key)
  if (!guest) {
    guest = `user-guest-${Math.random().toString(36).slice(2, 9)}`
    localStorage.setItem(key, guest)
  }
  return guest
}

const SESSION_STORAGE_PREFIX = 'gamifora_ai_chat_'
const ACTIVE_SESSION_KEY = 'gamifora_ai_active_session'

export function getStoredActiveSessionId(): string | null {
  try {
    return sessionStorage.getItem(ACTIVE_SESSION_KEY)
  } catch {
    return null
  }
}

export function setStoredActiveSessionId(sessionId: string): void {
  try {
    sessionStorage.setItem(ACTIVE_SESSION_KEY, sessionId)
  } catch {
  }
}

export function loadStoredMessages(sessionId: string): ChatMessage[] {
  try {
    const raw = sessionStorage.getItem(`${SESSION_STORAGE_PREFIX}${sessionId}`)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveStoredMessages(sessionId: string, messages: ChatMessage[]): void {
  try {
    sessionStorage.setItem(`${SESSION_STORAGE_PREFIX}${sessionId}`, JSON.stringify(messages))
  } catch {
  }
}

export async function sendAiLearningMessage(
  payload: AiLearningRequest,
  signal?: AbortSignal
): Promise<AiLearningResponse> {
  const url = getAiWebhookUrl()

  if (!url) {
    return {
      success: false,
      reply: 'Layanan AI belum dikonfigurasi. Hubungi guru atau admin.',
    }
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: payload.user_id,
        session_id: payload.session_id,
        message: payload.message,
      }),
      signal,
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      let parsedError = ''
      try {
        const json = JSON.parse(errorText)
        parsedError = json.message || json.error || ''
      } catch {
      }
      return {
        success: false,
        reply:
          parsedError ||
          `Server mengembalikan status HTTP ${response.status} (${response.statusText || 'Error'}). Silakan periksa alur kerja n8n.`,
      }
    }

    const data = await response.json()

    if (typeof data === 'object' && data !== null) {
      const textContent =
        typeof data.reply === 'string'
          ? data.reply
          : typeof data.response === 'string'
          ? data.response
          : typeof data.message === 'string'
          ? data.message
          : typeof data.output === 'string'
          ? data.output
          : typeof data.text === 'string'
          ? data.text
          : ''

      if (textContent) {
        return {
          success: data.success !== false,
          reply: textContent,
        }
      }
    }

    return {
      success: false,
      reply: 'Format respon dari backend n8n tidak sesuai. Respon tidak memuat teks balasan.',
    }
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return {
        success: false,
        reply: 'Pengiriman pesan dibatalkan.',
      }
    }

    const message = err instanceof Error ? err.message : String(err)
    return {
      success: false,
      reply: `Tidak dapat terhubung ke server n8n (${url}). Pastikan backend n8n aktif dan siap menerima webhook POST. Detail: ${message}`,
    }
  }
}
