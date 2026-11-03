# Kampüs Etkinlikleri · Sprint 6

Ahmet Mert Bayraktar · 2321032070

[Mevcut canlı Vercel adresi](https://kampusetkinlik.vercel.app)

React, TypeScript ve Vite uygulaması `frontend/` klasöründedir. Sprint 6 kapsamında React Router ile 10 route, ortak EventsContext, etkinlik yönetimi ve form doğrulama tamamlanmıştır.

## Kurulum ve çalıştırma

```sh
cd frontend
npm install
npm run dev
```

Üretim derlemesi: `npm run build`. Derlemeyi yerelde açmak için `npm run preview`, kod kontrolü için `npm run lint`.

## Route listesi

| Adres | Sayfa |
| --- | --- |
| `/` | HomePage — Yaklaşan iki etkinlik |
| `/events` | EventsPage — Arama ve kategori filtresi |
| `/events/:id` | EventDetailPage — Etkinlik ayrıntısı |
| `/admin` | AdminPage — Liste, düzenleme ve onaylı silme |
| `/admin/new` | AddEventPage — Yeni etkinlik |
| `/admin/:id/edit` | EditEventPage — Etkinlik güncelleme |
| `/login` | LoginPage — Giriş formu |
| `/register` | RegisterPage — Kayıt formu |
| `/forgot-password` | ForgotPasswordPage — Şifre yenileme formu |
| `*` | NotFoundPage — Bilinmeyen adres veya etkinlik |

## Kapsam

Etkinlikler EventsContext içinde tutulur. Ekleme, güncelleme ve silme sonuçları ana sayfa, liste, detay ve yönetimde ortaktır. Sayfa yenilenince başlangıç verisi geri gelir. Yönetim herkese açıktır. Giriş, kayıt ve şifre yenileme formları yalnızca doğrulama ve demo mesajı gösterir; sunucuya veri göndermez.

Etkinlik formu: ad en az 3 karakter, kategori seçili, tarih/saat/yer dolu, kontenjan 1–1000 arası tam sayı, açıklama en az 10 karakter. Giriş: e-postada @, şifre en az 6 karakter. Kayıt ayrıca en az 3 karakterlik ad soyad ve eşleşen şifreler ister. Şifre yenilemede e-postada @ aranır.

## Vercel

Root Directory: `frontend`, Framework Preset: `Vite`, Build Command: `npm run build`, Output Directory: `dist`. `frontend/vercel.json` alt adreslerin doğrudan açılması ve yenilenmesi için SPA yönlendirmesini içerir.

Yukarıdaki bağlantı mevcut proje adresidir; bu çalışma sırasında yeni sürüm yayımlanmadı. PDF'teki `isimsoyisim-frontend.vercel.app` biçimindeki teslim adresi yayında oluşturulduğunda bu bağlantı güncellenmelidir. Git teslim işlemleri kullanıcıya bırakılmıştır.

Önceki sprintler `sprint1/`, `sprint2/` ve `sprint3/` klasörlerinde korunmuştur. Güncel dosya yapısı için [frontend README](frontend/README.md).
