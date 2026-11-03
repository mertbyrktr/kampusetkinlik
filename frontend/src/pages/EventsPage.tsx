import { useState } from 'react'
import EventFilter from '../components/events/EventFilter'
import EventList from '../components/events/EventList'
import { useEvents } from '../context/EventsContext'
import type { Category } from '../types/campus-event'
import { filterByCategory, searchEvents } from '../utils/filter-events'

export default function EventsPage() {
  const { events } = useEvents()
  const [searchText, setSearchText] = useState('')
  const [category, setCategory] = useState<Category | ''>('')
  const categories = [...new Set(events.map((event) => event.category))]
  const filtered = filterByCategory(searchEvents(events, searchText), category)
  return (
    <>
      <h2>Tüm Etkinlikler</h2>
      <EventFilter searchText={searchText} category={category} categories={categories}
        onSearchChange={setSearchText} onCategoryChange={setCategory} />
      <p className="sonuc" role="status">{filtered.length} etkinlik listeleniyor.</p>
      <section className="etkinlik-listesi" aria-label="Etkinlikler">
        <EventList events={filtered} emptyText="Aramanıza uygun etkinlik bulunamadı." />
      </section>
    </>
  )
}
