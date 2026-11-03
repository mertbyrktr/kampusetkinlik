import type { CampusEvent } from '../../types/campus-event'
import { formatDate } from '../../utils/format-date'
import { Link } from 'react-router-dom'

interface EventCardProps {
  event: CampusEvent
}

function EventCard({ event }: EventCardProps) {
  return (
    <article className="kart">
      <h2>{event.title}</h2>
      <p>{event.category}</p>
      <p>Tarih: <time dateTime={`${event.date}T${event.time}`}>{formatDate(event.date)}, {event.time}</time></p>
      <p>Yer: {event.location}</p>
      <p>Kontenjan: {event.capacity} kişi</p>
      <p>{event.description}</p>
      <Link to={`/events/${event.id}`}>Detayları gör</Link>
    </article>
  )
}

export default EventCard
