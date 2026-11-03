import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'

interface RegisterErrors {
  name?: string
  email?: string
  password?: string
  password2?: string
}

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [errors, setErrors] = useState<RegisterErrors>({})
  const [sent, setSent] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const found: RegisterErrors = {}
    if (name.trim().length < 3) found.name = 'Ad soyad en az 3 karakter olmalı.'
    if (!email.includes('@')) found.email = 'Geçerli bir e-posta girin.'
    if (password.length < 6) found.password = 'Şifre en az 6 karakter olmalı.'
    if (password2 !== password) found.password2 = 'Şifreler aynı değil.'
    setErrors(found)
    setSent(Object.keys(found).length === 0)
  }

  return (
    <>
      <h2>Kayıt Ol</h2>
      <form noValidate onSubmit={handleSubmit}>
        {sent && <p className="form-mesaj form-mesaj--basari" role="status">Kayıt formu geçerli (demo).</p>}
        <p>
          <label htmlFor="name">Ad Soyad</label>
          <input id="name" name="name" value={name} onChange={(e) => { setName(e.target.value); setSent(false) }}
            aria-invalid={errors.name ? true : undefined} aria-describedby={errors.name ? 'name-error' : undefined} />
          {errors.name && <span id="name-error" className="form-hata">{errors.name}</span>}
        </p>
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
        <p>
          <label htmlFor="password2">Şifre (tekrar)</label>
          <input id="password2" name="password2" type="password" value={password2} onChange={(e) => { setPassword2(e.target.value); setSent(false) }}
            aria-invalid={errors.password2 ? true : undefined} aria-describedby={errors.password2 ? 'password2-error' : undefined} />
          {errors.password2 && <span id="password2-error" className="form-hata">{errors.password2}</span>}
        </p>
        <button type="submit">Kayıt ol</button>
        <p><Link to="/login">Zaten hesabın var mı? Giriş yap</Link></p>
      </form>
    </>
  )
}
