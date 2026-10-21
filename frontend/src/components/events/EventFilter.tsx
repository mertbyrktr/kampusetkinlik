
import type { Category } from '../../types/campus-event'

interface EventFilterProps {
  searchText: string
  category: Category | ''
  categories: Category[]
  onSearchChange: (value: string) => void
  onCategoryChange: (value: Category | '') => void
}

function EventFilter({
  searchText,
  category,
  categories,
  onSearchChange,
  onCategoryChange
}: EventFilterProps) {
  return (
    <form
      className="filtre"
      role="search"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="filtre-alan">
        <label htmlFor="arama">Etkinlik ara</label>
        <input
          id="arama"
          type="search"
          placeholder="Örn. atölye, kariyer"
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="filtre-alan">
        <label htmlFor="kategori-filtre">Kategori</label>
        <select
          id="kategori-filtre"
          value={category}
          onChange={(e) =>
            onCategoryChange(e.target.value as Category | '')
          }
        >
          <option value="">Tümü</option>
          {categories.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
    </form>
  )
}

export default EventFilter
