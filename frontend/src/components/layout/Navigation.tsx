import type { PageName } from '../../types/page'

interface NavigationProps {
  current: PageName
  onNavigate: (page: PageName) => void
}

const menu: { page: PageName; label: string }[] = [
  { page: 'home', label: 'Ana Sayfa' },
  { page: 'events', label: 'Etkinlikler' },
  { page: 'add', label: 'Ekle' },
]

export default function Navigation({ current, onNavigate }: NavigationProps) {
  return (
    <nav>
      {menu.map((item) => (
        <a
          key={item.page}
          href={`#${item.page}`}
          className={current === item.page ? 'active' : ''}
          aria-current={current === item.page ? 'page' : undefined}
          onClick={(e) => {
            e.preventDefault()
            onNavigate(item.page)
          }}
        >
          {item.label}
        </a>
      ))}
    </nav>
  )
}