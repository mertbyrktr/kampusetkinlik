import './App.css'
import { useEffect, useState } from 'react'
import { events } from './data/events'
import type { CampusEvent, Category } from './types/campus-event'
import { filterByCategory, findEventById, searchEvents } from './utils/filter-events'

type PageName = 'home' | 'events' | 'detail' | 'add' | 'update'

const menu: { page: PageName; label: string }[] = [
  { page: 'home', label: 'Ana Sayfa' },
  { page: 'events', label: 'Etkinlikler' },
  { page: 'add', label: 'Ekle' },
]
const categories = [...new Set(events.map((event) => event.category))]
const formatDate = (date: string): string => new Date(`${date}T12:00:00`).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })

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

  function renderCard(event: CampusEvent) {
    return (
      <article className="kart" key={event.id}>
        <h2>{event.title}</h2>
        <p>{event.category}</p>
        <p>Tarih: <time dateTime={`${event.date}T${event.time}`}>{formatDate(event.date)}, {event.time}</time></p>
        <p>Yer: {event.location}</p>
        <p>Kontenjan: {event.capacity} kişi</p>
        <p>{event.description}</p>
        <a href="#detail" onClick={(e) => { e.preventDefault(); go('detail', event.id) }}>Detayları gör</a>
      </article>
    )
  }

  return (
    <>
      <header>
        <h1>{title}</h1>
        {page === 'home' && <p>Kampüsteki etkinlikleri keşfet, ayrıntılarını incele ve yeni etkinlikler ekle.</p>}
        {page === 'events' && <p>Ekim ayında kampüste düzenlenen etkinlikler.</p>}
      </header>
      <nav aria-label="Ana menü">
        {menu.map((item) => (
          <a key={item.page} href={`#${item.page}`} aria-current={page === item.page ? 'page' : undefined}
            onClick={(e) => { e.preventDefault(); go(item.page) }}>{item.label}</a>
        ))}
      </nav>
      <main>
        {page === 'home' && (
          <>
            <section className="etkinlik-listesi" data-limit="2" aria-labelledby="yaklasan-baslik">
              <h2 id="yaklasan-baslik">Yaklaşan 2 Etkinlik</h2>
              <div className="kartlar">{upcoming.map(renderCard)}</div>
            </section>
            <p className="tum-etkinlikler"><a href="#events" onClick={(e) => { e.preventDefault(); go('events') }}>Tüm etkinlikleri gör</a></p>
          </>
        )}
        {page === 'events' && (
          <>
            <form className="filtre" role="search" onSubmit={(e) => e.preventDefault()}>
              <div className="filtre-alan">
                <label htmlFor="arama">Etkinlik ara</label>
                <input id="arama" type="search" placeholder="Örn. atölye, kariyer" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
              </div>
              <div className="filtre-alan">
                <label htmlFor="kategori-filtre">Kategori</label>
                <select id="kategori-filtre" value={category} onChange={(e) => setCategory(e.target.value as Category | '')}>
                  <option value="">Tümü</option>
                  {categories.map((value) => <option key={value} value={value}>{value}</option>)}
                </select>
              </div>
            </form>
            <p className={`sonuc${filtered.length === 0 ? ' sonuc-yok' : ''}`} role="status">
              {filtered.length === 0 ? 'Etkinlik bulunamadı.' : `${filtered.length} etkinlik listeleniyor.`}
            </p>
            <section className="etkinlik-listesi" aria-label="Etkinlikler">
              <div className="kartlar">{filtered.map(renderCard)}</div>
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
          <article className="detay">
            {selected.image && (
              <figure>
                <img src={selected.image} alt={`${selected.title} afişi`} />
                <figcaption>{selected.title} afişi</figcaption>
              </figure>
            )}
            <div>
              <h2>Etkinlik Künyesi</h2>
              <dl>
                <dt>Tarih</dt><dd><time dateTime={`${selected.date}T${selected.time}`}>{formatDate(selected.date)}, {selected.time}</time></dd>
                <dt>Yer</dt><dd>{selected.location}</dd>
                <dt>Kategori</dt><dd>{selected.category}</dd>
                <dt>Kontenjan</dt><dd>{selected.capacity} kişi</dd>
              </dl>
            </div>
            <section className="detay-aciklama">
              <h2>Açıklama</h2><p>{selected.description}</p>
            </section>
            <p className="detay-eylemler">
              <a href="#events" onClick={(e) => { e.preventDefault(); go('events') }}>← Listeye dön</a>{' '}
              <a href="#update" onClick={(e) => { e.preventDefault(); go('update', selected.id) }}>Bu etkinliği güncelle</a>
            </p>
          </article>
        )}
        {(page === 'add' || page === 'update') && (
          <form key={page} className="form" onSubmit={(e) => e.preventDefault()} aria-describedby="form-bilgi">
            <p id="form-bilgi">Bu sprintte form sadece görünüm; kayıt yapılmaz.</p>
            <p><label htmlFor="title">Etkinlik Adı</label><input id="title" name="title" maxLength={80} placeholder="Örn. Kariyer Günleri 2026" /></p>
            <p><label htmlFor="category">Kategori</label><select id="category" name="category" defaultValue="">
              <option value="" disabled>Seçiniz</option>
              {categories.map((value) => <option key={value} value={value}>{value}</option>)}
            </select></p>
            <p><label htmlFor="date">Tarih</label><input id="date" name="date" type="date" /></p>
            <p><label htmlFor="time">Saat</label><input id="time" name="time" type="time" /></p>
            <p><label htmlFor="location">Yer</label><input id="location" name="location" placeholder="Örn. A Blok Konferans Salonu" /></p>
            <p><label htmlFor="capacity">Kontenjan</label><input id="capacity" name="capacity" type="number" min={1} max={1000} step={1} /></p>
            <p><label htmlFor="description">Açıklama</label><textarea id="description" name="description" rows={5} /></p>
            <button type="submit">{page === 'add' ? 'Kaydet' : 'Güncelle'}</button>
          </form>
        )}
      </main>
      <footer><p>Ahmet Mert Bayraktar · 2321032070 · 2026</p></footer>
    </>
  )
}

export default App
