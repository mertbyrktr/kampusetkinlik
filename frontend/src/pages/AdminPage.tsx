import { Link } from 'react-router-dom'
import { useEvents } from '../context/EventsContext'
import { formatDate } from '../utils/format-date'

export default function AdminPage() {
  const { events, deleteEvent } = useEvents()

  function handleDelete(id: string, title: string) {
    if (window.confirm(`"${title}" silinsin mi?`)) deleteEvent(id)
  }

  return (
    <>
      <h2>Etkinlik Yönetimi</h2>
      <p className="tum-etkinlikler"><Link to="/admin/new">+ Yeni etkinlik</Link></p>
      {events.length === 0 ? <p>Henüz etkinlik yok.</p> : (
        <table className="tablo">
          <thead><tr><th scope="col">Etkinlik</th><th scope="col">Tarih</th><th scope="col">Kategori</th><th scope="col">İşlemler</th></tr></thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td data-baslik="Etkinlik">{event.title}</td>
                <td data-baslik="Tarih"><time dateTime={event.date}>{formatDate(event.date)}</time></td>
                <td data-baslik="Kategori">{event.category}</td>
                <td className="islemler">
                  <Link className="buton" to={`/admin/${event.id}/edit`}>Düzenle</Link>
                  <button className="buton-sil" type="button" onClick={() => handleDelete(event.id, event.title)}>Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
