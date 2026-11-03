import { Link } from 'react-router-dom'
import EventList from '../components/events/EventList'
import { useEvents } from '../context/EventsContext'

export default function HomePage() {
  const { events } = useEvents()
  const upcoming = [...events].sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)).slice(0, 2)
  return (
    <>
      <section className="etkinlik-listesi" data-limit="2" aria-labelledby="yaklasan-baslik">
        <h2 id="yaklasan-baslik">Yaklaşan 2 Etkinlik</h2>
        <EventList events={upcoming} />
      </section>
      <p className="tum-etkinlikler"><Link to="/events">Tüm etkinlikleri gör</Link></p>
    </>
  )
}
