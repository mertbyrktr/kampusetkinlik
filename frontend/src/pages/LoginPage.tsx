import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [sent, setSent] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const found: typeof errors = {}
    if (!email.includes('@')) found.email = 'Geçerli bir e-posta girin.'
    if (password.length < 6) found.password = 'Şifre en az 6 karakter olmalı.'
    setErrors(found)
    setSent(Object.keys(found).length === 0)
  }

  return (
    <>
      <h2>Giriş Yap</h2>
      <form noValidate onSubmit={handleSubmit}>
        {sent && <p className="form-mesaj form-mesaj--basari" role="status">Gerçek giriş Sprint 10’da.</p>}
        <p>
          <label htmlFor="email">E-posta</label>
          <input id="email" name="email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setSent(false) }}
            aria-invalid={errors.email ? true : undefined} aria-describedby={errors.email ? 'email-error' : undefined} />
          {errors.email && <span id="email-error" className="form-hata">{errors.email}</span>}
        </p>
        <p>
          <label htmlFor="password">Şifre</label>
          <input id="password" name="password" type="password" value={password} onChange={(e) => { setPassword(e.target.value); setSent(false) }}
            aria-invalid={errors.password ? true : undefined} aria-describedby={errors.password ? 'password-error' : undefined} />
          {errors.password && <span id="password-error" className="form-hata">{errors.password}</span>}
        </p>
        <button type="submit">Giriş yap</button>
        <p><Link to="/forgot-password">Şifremi unuttum</Link>{' · '}<Link to="/register">Hesabın yok mu? Kayıt ol</Link></p>
      </form>
    </>
  )
}
