import './App.css'
import { useEffect, useState } from 'react'
import { events } from './data/events'
import type { Category } from './types/campus-event'
import { filterByCategory, findEventById, searchEvents } from './utils/filter-events'

import type { PageName } from './types/page'
import Footer from './components/layout/Footer'
import Header from './components/layout/Header'
import Navigation from './components/layout/Navigation'
import EventList from './components/events/EventList'
import EventFilter from './components/events/EventFilter'
import EventDetail from './components/events/EventDetail'
import EventForm from './components/forms/EventForm'



const categories = [...new Set(events.map((event) => event.category))]

function App() {
  const [page, setPage] = useState<PageName>('home')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [searchText, setSearchText] = useState('')
  const [category, setCategory] = useState<Category | ''>('')
  const selected = selectedId ? findEventById(events, selectedId) : undefined
  const upcoming = [...events].sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)).slice(0, 2)
  const filtered = filterByCategory(searchEvents(events, searchText), category)
  const title = page === 'home' ? 'Kampüs Etkinlikleri'
    : page === 'events' ? 'Tüm Etkinlikler'
      : page === 'add' ? 'Etkinlik Ekle'
        : page === 'update' ? 'Etkinlik Güncelle'
          : selected?.title ?? 'Etkinlik bulunamadı'

  useEffect(() => {
    document.title = `Kampüs Etkinlikleri — ${title}`
  }, [title])

  function go(next: PageName, id: string | null = null): void {
    setPage(next)
    setSelectedId(id)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }



  return (
    <>
      <Header
        title={title}
        text={
          page === 'home'
            ? 'Kampüsteki etkinlikleri keşfet, ayrıntılarını incele ve yeni etkinlikler ekle.'
            : page === 'events'
              ? 'Ekim ayında kampüste düzenlenen etkinlikler.'
              : undefined
        }
      />
      <Navigation current={page} onNavigate={go} />
      <main>
        {page === 'home' && (
          <>
            <section className="etkinlik-listesi" data-limit="2" aria-labelledby="yaklasan-baslik">
              <h2 id="yaklasan-baslik">Yaklaşan 2 Etkinlik</h2>

              <EventList
                events={upcoming}
                onShowDetail={(id) => go('detail', id)}
              />

            </section>
            <p className="tum-etkinlikler"><a href="#events" onClick={(e) => { e.preventDefault(); go('events') }}>Tüm etkinlikleri gör</a></p>
          </>
        )}
        {page === 'events' && (
          <>

            <EventFilter
              searchText={searchText}
              category={category}
              categories={categories}
              onSearchChange={setSearchText}
              onCategoryChange={setCategory}
            />


            {filtered.length > 0 && (
              <p className="sonuc" role="status">
                {filtered.length} etkinlik listeleniyor.
              </p>
            )}

            <section className="etkinlik-listesi" aria-label="Etkinlikler">

              <EventList
                events={filtered}
                onShowDetail={(id) => go('detail', id)}
                emptyText="Aramanıza uygun etkinlik bulunamadı."
              />

            </section>
          </>
        )}
        {page === 'detail' && !selected && (
          <article className="hata-kutusu">
            <h2>Etkinlik bulunamadı</h2>
            <p>Seçilen etkinlik mevcut değil.</p>
            <a href="#events" onClick={(e) => { e.preventDefault(); go('events') }}>Listeye dön</a>
          </article>
        )}

        {page === 'detail' && selected && (
          <EventDetail
            event={selected}
            onBack={() => go('events')}
            onEdit={(id) => go('update', id)}
          />
        )}


        {(page === 'add' || page === 'update') && (
          <EventForm
            key={page}
            onSubmit={() => window.scrollTo(0, 0)}
          />
        )}

      </main>
      <Footer />
    </>
  )
}

export default App
