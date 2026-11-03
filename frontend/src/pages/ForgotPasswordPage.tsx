import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const found = email.includes('@') ? '' : 'Geçerli bir e-posta girin.'
    setError(found)
    setSent(found === '')
  }

  return (
    <>
      <h2>Şifremi Unuttum</h2>
      <p>Kayıtlı e-posta adresinizi yazın, şifre yenileme bağlantısı gönderelim.</p>
      <form noValidate onSubmit={handleSubmit}>
        {sent && <p className="form-mesaj form-mesaj--basari" role="status">Bağlantı {email} adresine gönderildi (demo).</p>}
        <p>
          <label htmlFor="email">E-posta</label>
          <input id="email" name="email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setSent(false) }}
            aria-invalid={error ? true : undefined} aria-describedby={error ? 'email-error' : undefined} />
          {error && <span id="email-error" className="form-hata">{error}</span>}
        </p>
        <button type="submit">Bağlantı gönder</button>
        <p><Link to="/login">← Girişe dön</Link></p>
      </form>
    </>
  )
}
