
import { events } from '../../data/events'

interface EventFormProps {
  onSubmit: () => void
}

const categories = [...new Set(events.map((event) => event.category))]

function EventForm({ onSubmit }: EventFormProps) {
  return (
    <>
      <p id="form-bilgi">
        Bu sprintte form sadece görünüm; kayıt yapılmaz.
      </p>

      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
        aria-describedby="form-bilgi"
      >
        <p>
          <label htmlFor="title">Etkinlik Adı</label>
          <input
            id="title"
            name="title"
            maxLength={80}
            placeholder="Örn. Kariyer Günleri 2026"
          />
        </p>

        <p>
          <label htmlFor="category">Kategori</label>
          <select id="category" name="category" defaultValue="">
            <option value="" disabled>Seçiniz</option>
            {categories.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </p>

        <p>
          <label htmlFor="date">Tarih</label>
          <input id="date" name="date" type="date" />
        </p>

        <p>
          <label htmlFor="time">Saat</label>
          <input id="time" name="time" type="time" />
        </p>

        <p>
          <label htmlFor="location">Yer</label>
          <input
            id="location"
            name="location"
            placeholder="Örn. A Blok Konferans Salonu"
          />
        </p>

        <p>
          <label htmlFor="capacity">Kontenjan</label>
          <input
            id="capacity"
            name="capacity"
            type="number"
            min={1}
            max={1000}
            step={1}
          />
        </p>

        <p>
          <label htmlFor="description">Açıklama</label>
          <textarea
            id="description"
            name="description"
            rows={5}
          />
        </p>

        <button type="submit">Kaydet</button>
      </form>
    </>
  )
}

export default EventForm
