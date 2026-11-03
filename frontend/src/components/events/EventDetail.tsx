
import type { CampusEvent } from '../../types/campus-event'
import { formatDate } from '../../utils/format-date'
import { Link } from 'react-router-dom'

interface EventDetailProps {
  event: CampusEvent
}

function EventDetail({ event }: EventDetailProps) {
  return (
    <article className="detay">
      {event.image && (
        <figure>
          <img
            src={event.image}
            alt={`${event.title} afişi`}
          />
          <figcaption>{event.title} afişi</figcaption>
        </figure>
      )}

      <div>
        <h2>Etkinlik Künyesi</h2>
        <dl>
          <dt>Tarih</dt>
          <dd>
            <time dateTime={`${event.date}T${event.time}`}>
              {formatDate(event.date)}, {event.time}
            </time>
          </dd>

          <dt>Yer</dt>
          <dd>{event.location}</dd>

          <dt>Kategori</dt>
          <dd>{event.category}</dd>

          <dt>Kontenjan</dt>
          <dd>{event.capacity} kişi</dd>
        </dl>
      </div>

      <section className="detay-aciklama">
        <h2>Açıklama</h2>
        <p>{event.description}</p>
      </section>

      <p className="detay-eylemler">
        <Link to="/events">← Listeye dön</Link>
        <Link to={`/admin/${event.id}/edit`}>Bu etkinliği güncelle</Link>
      </p>
    </article>
  )
}

export default EventDetail
