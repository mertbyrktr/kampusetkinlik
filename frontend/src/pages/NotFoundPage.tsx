import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <>
      <h2>Sayfa bulunamadı</h2>
      <p>Aradığınız sayfa ya da etkinlik yok.</p>
      <p className="tum-etkinlikler"><Link to="/">Ana sayfaya dön</Link></p>
    </>
  )
}
