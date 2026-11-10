import { useId, useState } from 'react'
import type { FormEvent, ChangeEvent, ReactNode, InputHTMLAttributes } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, LogIn, Mail, User as UserIcon, TriangleAlert } from 'lucide-react'
import { Logo } from '../components/Avatar.tsx'
import { GameButton } from '../components/GameButton.tsx'
import { Parchment } from '../components/Panels.tsx'
import { useGame } from '../context/GameContext.tsx'
import type { FieldErrors } from '../lib/auth.ts'
import { validateLogin } from '../lib/auth.ts'

export default function LoginPage() {
  const { user, login } = useGame()
  const navigate = useNavigate()
  const uid = useId()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [busy, setBusy] = useState(false)

  if (user) return <Navigate to="/selamat-datang" replace />

  const set = (k: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }))
    setFormError('')
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (busy) return
    const v = validateLogin(form)
    if (Object.keys(v).length) {
      setErrors(v)
      setFormError('Data belum lengkap atau belum valid. Periksa kolom yang ditandai.')
      return
    }
    setBusy(true)
    const res = await login(form)
    setBusy(false)
    if (!res.ok) {
      setErrors(res.errors)
      setFormError(res.message)
      return
    }
    navigate('/selamat-datang', { replace: true })
  }

  const field = (
    k: keyof typeof form,
    label: string,
    icon: ReactNode,
    props: InputHTMLAttributes<HTMLInputElement>,
    extra?: ReactNode
  ) => (
    <div className={`field ${errors[k] ? 'field--error' : ''}`}>
      <label htmlFor={`${uid}-${k}`}>{label}</label>
      <div className="field__box">
        <span className="field__icon">{icon}</span>
        <input
          id={`${uid}-${k}`}
          name={k}
          value={form[k]}
          onChange={set(k)}
          aria-invalid={!!errors[k]}
          aria-describedby={errors[k] ? `${uid}-${k}-err` : undefined}
          {...props}
        />
        {extra}
      </div>
      {errors[k] && (
        <p className="field__error" id={`${uid}-${k}-err`} role="alert">
          {errors[k]}
        </p>
      )}
    </div>
  )

  return (
    <main className="screen screen--login">
      <div className="login__hero">
        <Logo className="logo--hero" />
      </div>

      <Parchment className="login__panel">
        <h1 className="display">GAMIFORA</h1>
        <p className="login__sub">Mulai Petualangan Belajarmu!</p>

        <form onSubmit={onSubmit} noValidate aria-label="Formulir masuk atau daftar">
          {field('name', 'Nama Lengkap', <UserIcon size={20} />, {
            type: 'text',
            placeholder: 'Nama lengkap',
            autoComplete: 'name',
            maxLength: 40,
          })}
          {field('email', 'Email', <Mail size={20} />, {
            type: 'email',
            placeholder: 'nama@email.com',
            autoComplete: 'email',
            inputMode: 'email',
          })}
          {field(
            'password',
            'Password',
            <Lock size={20} />,
            {
              type: showPw ? 'text' : 'password',
              placeholder: 'Minimal 6 karakter',
              autoComplete: 'current-password',
            },
            <button
              type="button"
              className="field__toggle"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? 'Sembunyikan password' : 'Tampilkan password'}
              aria-pressed={showPw}
            >
              {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}

          {formError && (
            <div className="alert alert--error" role="alert">
              <TriangleAlert size={18} /> {formError}
            </div>
          )}

          <GameButton type="submit" size="lg" block iconRight={<LogIn size={20} />} disabled={busy} id="btn-masuk">
            {busy ? 'Memproses…' : 'Masuk'}
          </GameButton>
        </form>

        <p className="login__hint">
          Belum punya akun? Isi data lalu tekan <strong>Masuk</strong>, akun baru dibuat otomatis.
        </p>
        <p className="login__note">
          Prototipe: akun dan progres disimpan di peramban ini (LocalStorage), bukan di server. Jangan memakai password yang sama dengan akun pentingmu.
        </p>
      </Parchment>
    </main>
  )
}

