import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bot,
  BrainCircuit,
  Check,
  Copy,
  Plus,
  RefreshCw,
  RotateCcw,
  Send,
  Sparkles,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';
import { Logo } from '../components/Avatar';
import { AiMarkdownRenderer } from '../components/AiMarkdownRenderer';
import { useGame } from '../context/GameContext';
import {
  generateSessionId,
  getStoredActiveSessionId,
  setStoredActiveSessionId,
  loadStoredMessages,
  saveStoredMessages,
  resolveUserId,
  sendAiLearningMessage,
  getAiWebhookUrl,
} from '../lib/aiLearningApi';
import type { ChatMessage } from '../types';

const SUGGESTIONS = [
  'Apa itu Artificial Intelligence?',
  'Belajar Python dari dasar.',
  'Jelaskan algoritma dan struktur data.',
  'Bagaimana cara membuat website?',
  'Apa perbedaan HTML, CSS, dan JavaScript?',
];

function createTimestamp(): string {
  return new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

function createMessageId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function AiLearningPage() {
  const { user } = useGame();
  const navigate = useNavigate();

  const [sessionId, setSessionId] = useState<string>(() => {
    const existing = getStoredActiveSessionId();
    if (existing) return existing;
    const fresh = generateSessionId();
    setStoredActiveSessionId(fresh);
    return fresh;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const active = getStoredActiveSessionId();
    return active ? loadStoredMessages(active) : [];
  });

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'error'>('online');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const userId = resolveUserId(user?.email);

  useEffect(() => {
    saveStoredMessages(sessionId, messages);
  }, [sessionId, messages]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollH = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(160, Math.max(50, scrollH))}px`;
    }
  }, [inputText]);

  const handleNewChat = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const fresh = generateSessionId();
    setSessionId(fresh);
    setStoredActiveSessionId(fresh);
    setMessages([]);
    setInputText('');
    setIsLoading(false);
    setConnectionStatus('online');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSendMessage = useCallback(
    async (textToSend?: string) => {
      const messageContent = (textToSend ?? inputText).trim();
      if (!messageContent || isLoading) return;

      if (!textToSend) {
        setInputText('');
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
      }

      const userMessage: ChatMessage = {
        id: createMessageId('usr'),
        role: 'user',
        content: messageContent,
        timestamp: createTimestamp(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setConnectionStatus('online');

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const response = await sendAiLearningMessage(
          {
            user_id: userId,
            session_id: sessionId,
            message: messageContent,
          },
          controller.signal,
        );

        if (response.success) {
          const assistantMessage: ChatMessage = {
            id: createMessageId('ai'),
            role: 'assistant',
            content: response.reply,
            timestamp: createTimestamp(),
          };
          setMessages((prev) => [...prev, assistantMessage]);
          setConnectionStatus('online');
        } else {
          const errorMessage: ChatMessage = {
            id: createMessageId('err'),
            role: 'error',
            content: response.reply,
            timestamp: createTimestamp(),
          };
          setMessages((prev) => [...prev, errorMessage]);
          setConnectionStatus('error');
        }
      } catch (err) {
        const errorMessage: ChatMessage = {
          id: createMessageId('err'),
          role: 'error',
          content:
            err instanceof Error
              ? err.message
              : 'Terjadi kesalahan sistem saat menghubungi FORA AI.',
          timestamp: createTimestamp(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        setConnectionStatus('error');
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [inputText, isLoading, sessionId, userId],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyMessage = async (msgId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(msgId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
    }
  };

  const handleRegenerate = () => {
    if (isLoading) return;
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMessage) {
      handleSendMessage(lastUserMessage.content);
    }
  };

  const webhookUrl = getAiWebhookUrl();
  const userName = user?.name ?? 'Pemain';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="ai-layout">
      <header className="ai-header">
        <div className="ai-header__left">
          <button
            type="button"
            className="ai-back-btn"
            onClick={() => navigate('/mainboard')}
            aria-label="Kembali ke Mainboard"
            title="Kembali ke Mainboard"
          >
            <ArrowLeft size={20} strokeWidth={2.6} />
            <span className="ai-back-btn__label">Mainboard</span>
          </button>

          <div className="ai-header__brand">
            <div className="ai-header__avatar" aria-hidden="true">
              <Bot size={22} strokeWidth={2.4} />
            </div>
            <div className="ai-header__meta">
              <div className="ai-header__title-row">
                <h1 className="ai-header__title">FORA AI</h1>
                <span className="ai-header__badge">AI Powered</span>
              </div>
              <div className="ai-header__status">
                <span
                  className={`ai-status-dot ${
                    !webhookUrl
                      ? 'is-warning'
                      : connectionStatus === 'online'
                      ? 'is-online'
                      : 'is-error'
                  }`}
                  aria-hidden="true"
                />
                <span className="ai-status-text">
                  {!webhookUrl
                    ? 'Belum Dikonfigurasi (URL Webhook Kosong)'
                    : connectionStatus === 'online'
                    ? import.meta.env.DEV && webhookUrl.includes('localhost')
                      ? 'Siap Membantu (n8n Lokal DEV)'
                      : 'Siap Membantu (n8n Webhook)'
                    : 'Koneksi Terganggu'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="ai-header__right">
          <button
            type="button"
            className="ai-newchat-btn"
            onClick={handleNewChat}
            title="Mulai percakapan baru dengan session_id baru"
            aria-label="Percakapan Baru"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span className="ai-newchat-btn__label">Chat Baru</span>
          </button>
          <Logo className="logo--mini ai-header__logo" />
        </div>
      </header>

      <div className="ai-chat-container">
        {messages.length === 0 ? (
          <div className="ai-welcome">
            <div className="ai-welcome__hero">
              <div className="ai-welcome__icon-halo">
                <BrainCircuit size={48} className="ai-welcome__icon" />
              </div>
              <span className="ai-welcome__tag">
                <Sparkles size={14} /> Asisten Pembelajaran Informatika Interaktif
              </span>
              <h2 className="ai-welcome__heading">Belajar Informatika, Tanpa Batas.</h2>
              <p className="ai-welcome__subheading">
                Temukan cara baru memahami Informatika bersama FORA AI. Tanyakan apa saja
                seputar teknologi, pemrograman, algoritma, Artificial Intelligence, dan dunia
                komputasi.
              </p>
            </div>

            {!webhookUrl && (
              <div className="ai-unconfigured-banner" role="status">
                <AlertCircle size={20} className="ai-unconfigured-banner__icon" />
                <div className="ai-unconfigured-banner__text">
                  <strong>Catatan Evaluasi / Pratinjau:</strong> Variabel lingkungan{' '}
                  <code>VITE_AI_LEARNING_WEBHOOK_URL</code> belum disetel. Antarmuka chat tetap dapat
                  dijelajahi, dan panduan konfigurasi akan ditampilkan secara aman saat pesan dikirim.
                </div>
              </div>
            )}

            <div className="ai-suggestions">
              <div className="ai-suggestions__header">
                <Lightbulb size={18} />
                <span>Pilih topik untuk memulai percakapan:</span>
              </div>
              <div className="ai-suggestions__grid">
                {SUGGESTIONS.map((prompt, index) => (
                  <button
                    key={index}
                    type="button"
                    className="ai-suggestion-card"
                    onClick={() => handleSendMessage(prompt)}
                  >
                    <span className="ai-suggestion-card__num">{index + 1}</span>
                    <span className="ai-suggestion-card__text">{prompt}</span>
                    <Sparkles size={16} className="ai-suggestion-card__spark" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="ai-messages">
            {messages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              const isError = msg.role === 'error';
              const isLastAssistant =
                msg.role === 'assistant' &&
                idx === messages.length - 1 &&
                !isLoading;

              return (
                <div
                  key={msg.id}
                  className={`ai-message-row ${
                    isUser
                      ? 'ai-message-row--user'
                      : isError
                      ? 'ai-message-row--error'
                      : 'ai-message-row--assistant'
                  }`}
                >
                  <div className="ai-avatar-wrap" aria-hidden="true">
                    {isUser ? (
                      <div className="ai-avatar ai-avatar--user">{userInitial}</div>
                    ) : isError ? (
                      <div className="ai-avatar ai-avatar--error">
                        <AlertCircle size={20} />
                      </div>
                    ) : (
                      <div className="ai-avatar ai-avatar--bot">
                        <Bot size={20} />
                      </div>
                    )}
                  </div>

                  <div className="ai-bubble-wrap">
                    <div className="ai-bubble__meta">
                      <strong className="ai-bubble__sender">
                        {isUser ? userName : isError ? 'Pemberitahuan Sistem' : 'FORA AI'}
                      </strong>
                      <span className="ai-bubble__time">{msg.timestamp}</span>
                    </div>

                    <div className="ai-bubble">
                      {isUser ? (
                        <p className="ai-user-text">{msg.content}</p>
                      ) : isError ? (
                        <div className="ai-error-content">
                          <p>{msg.content}</p>
                          <button
                            type="button"
                            className="ai-retry-btn"
                            onClick={handleRegenerate}
                          >
                            <RefreshCw size={14} /> Coba Kirim Ulang
                          </button>
                        </div>
                      ) : (
                        <AiMarkdownRenderer content={msg.content} />
                      )}
                    </div>

                    {msg.role === 'assistant' && (
                      <div className="ai-message-actions">
                        <button
                          type="button"
                          className={`ai-action-btn ${copiedId === msg.id ? 'is-copied' : ''}`}
                          onClick={() => handleCopyMessage(msg.id, msg.content)}
                          title="Salin seluruh jawaban"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check size={14} strokeWidth={2.5} />
                              <span>Tersalin!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={14} strokeWidth={2} />
                              <span>Salin Jawaban</span>
                            </>
                          )}
                        </button>

                        {isLastAssistant && (
                          <button
                            type="button"
                            className="ai-action-btn"
                            onClick={handleRegenerate}
                            title="Minta jawaban baru untuk pertanyaan sebelumnya"
                          >
                            <RefreshCw size={14} strokeWidth={2} />
                            <span>Regenerasi Respon</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="ai-message-row ai-message-row--assistant">
                <div className="ai-avatar-wrap" aria-hidden="true">
                  <div className="ai-avatar ai-avatar--bot ai-avatar--pulse">
                    <Bot size={20} />
                  </div>
                </div>
                <div className="ai-bubble-wrap">
                  <div className="ai-bubble__meta">
                    <strong className="ai-bubble__sender">FORA AI</strong>
                    <span className="ai-bubble__time">Sedang berpikir...</span>
                  </div>
                  <div className="ai-bubble ai-bubble--loading">
                    <div className="ai-typing-indicator" aria-label="AI sedang mengetik">
                      <span className="ai-dot" />
                      <span className="ai-dot" />
                      <span className="ai-dot" />
                    </div>
                    <span className="ai-loading-text">
                      AI sedang menganalisis materi &amp; merangkai jawaban...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <footer className="ai-input-dock">
        <div className="ai-input-dock__inner">
          <form
            className="ai-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <div className="ai-input-box">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tanyakan sesuatu tentang Informatika..."
                rows={1}
                className="ai-textarea"
                disabled={isLoading}
                aria-label="Tanyakan sesuatu tentang Informatika"
              />

              <div className="ai-input-actions">
                <button
                  type="button"
                  className="ai-input-action-btn"
                  onClick={handleNewChat}
                  title="Sesi Percakapan Baru"
                  aria-label="Sesi Baru"
                >
                  <RotateCcw size={16} />
                </button>

                <button
                  type="submit"
                  className="ai-send-btn"
                  disabled={!inputText.trim() || isLoading}
                  aria-label="Kirim pertanyaan"
                  title="Kirim (Enter)"
                >
                  <Send size={18} strokeWidth={2.4} />
                </button>
              </div>
            </div>
          </form>

          <div className="ai-dock-footer">
            <span className="ai-dock-hint">
              Tekan <kbd>Enter</kbd> untuk mengirim, <kbd>Shift + Enter</kbd> untuk baris baru
            </span>
            <span className="ai-dock-session">
              Sesi: <code title={sessionId}>{sessionId.slice(0, 15)}...</code> &bull; Target:{' '}
              <span
                className={`ai-dock-url ${!webhookUrl ? 'is-unconfigured' : ''}`}
                title={webhookUrl || 'Belum dikonfigurasi'}
              >
                {webhookUrl
                  ? webhookUrl.includes('localhost')
                    ? 'n8n Lokal DEV'
                    : 'n8n Webhook'
                  : 'Belum Dikonfigurasi'}
              </span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
