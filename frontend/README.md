# Kampüs Etkinlikleri · Sprint 6

Ahmet Mert Bayraktar · 2321032070

[Canlı Vercel adresi](https://ahmetmertbayraktar-frontend.vercel.app)

## Çalıştırma

Bu klasörde:

```sh
npm install
npm run dev
```

`npm run build` TypeScript kontrolünü ve üretim derlemesini yapar. `npm run preview` derlemeyi açar. `npm run lint` kod kontrolünü yapar.

## Dosya yapısı

- `src/main.tsx`: BrowserRouter ve EventsProvider ile uygulamayı başlatır.
- `src/App.tsx`: Header, Navigation, 10 route ve Footer içerir; state tutmaz.
- `src/context/EventsContext.tsx`: Ortak etkinlik listesi, ekleme, güncelleme, silme ve useEvents hook'u.
- `src/pages/`: HomePage, EventsPage, EventDetailPage, AdminPage, AddEventPage, EditEventPage, LoginPage, RegisterPage, ForgotPasswordPage, NotFoundPage.
- `src/components/layout/`: Header, Navigation (NavLink), Footer.
- `src/components/events/`: EventCard, EventList, EventFilter, EventDetail.
- `src/components/forms/EventForm.tsx`: Ekleme ve güncellemede kullanılan kontrollü form.
- `src/types/campus-event.ts`: CampusEvent, Category, EventFormData ve EventFormErrors tipleri.
- `src/utils/`: filter-events, format-date ve validate-event.
- `src/data/events.ts`: Başlangıç etkinlikleri.
- `src/App.css`: Mevcut tasarım ve yönetim tablosunun mobil kart düzeni.
- `public/`: Afiş ve favicon.
- `vercel.json`: SPA adreslerini index.html'e yönlendirir.

## Route listesi

| Adres | Bileşen |
| --- | --- |
| `/` | HomePage |
| `/events` | EventsPage |
| `/events/:id` | EventDetailPage |
| `/admin` | AdminPage |
| `/admin/new` | AddEventPage |
| `/admin/:id/edit` | EditEventPage |
| `/login` | LoginPage |
| `/register` | RegisterPage |
| `/forgot-password` | ForgotPasswordPage |
| `*` | NotFoundPage |

## Davranış

Veriler Context state'inde tutulur; sayfalar arası geçişte korunur, yenilemede başlangıç listesine döner. Silme öncesinde onay sorulur. Ana sayfa tarihe göre ilk iki etkinliği gösterir. Arama başlık ve açıklamada Türkçe büyük/küçük harf uyumuyla çalışır ve kategori filtresiyle birlikte uygulanır.

Etkinlik doğrulaması: ad en az 3 karakter, kategori seçili, tarih/saat/yer dolu, kontenjan 1–1000 arası tam sayı, açıklama en az 10 karakter. Girişte e-postada @ ve en az 6 karakterlik şifre gerekir. Kayıtta ayrıca ad soyad en az 3 karakter olmalı ve şifreler eşleşmelidir. Şifre yenilemede e-postada @ aranır. Hatalar alanların altında gösterilir.

Yönetim için giriş kontrolü yoktur. Üç hesap formu yalnızca frontend demosudur; gerçek kullanıcı hesabı oluşturulmaz, giriş yapılmaz, e-posta gönderilmez.

## Yayın ayarları

Vercel: Root Directory `frontend`, Framework Preset `Vite`, Build Command `npm run build`, Output Directory `dist`.

Projenin son sürümü Vercel üzerinde yayındadır. Canlı adres: [ahmetmertbayraktar-frontend.vercel.app](https://ahmetmertbayraktar-frontend.vercel.app).
