# Kampüs Etkinlikleri · Sprint 9

Ahmet Mert Bayraktar · 2321032070

[Canlı Vercel adresi](https://ahmetmertbayraktar-frontend.vercel.app)

React, TypeScript ve Vite uygulaması `frontend/` klasöründedir. Sprint 6 kapsamında React Router ile 10 route, ortak EventsContext, etkinlik yönetimi ve form doğrulama tamamlanmıştır.

## Sprint 9 · Tam CRUD ve sorgular

`backend/` altındaki Express API, etkinlikleri Mongoose ile MongoDB'nin `events` koleksiyonunda saklar. Şema başlık, kategori ve tarih alanlarını zorunlu tutar. Etkinlik yanıtlarında MongoDB `_id` değeri ile `createdAt` ve `updatedAt` zaman damgaları bulunur. POST ile eklenen kayıtlar sunucu yeniden başlatıldığında korunur.

### Backend kurulumu

Node.js 22 veya üzeriyle repo kökünden çalıştır.

```sh
cd backend
npm install
cp -n .env.example .env
```

`backend/.env` içindeki `MONGODB_URI` değerini Atlas bağlantı adresinle güncelle. Ödev veritabanı için adresin veritabanı yolu `/kampus` olmalıdır. Yerel MongoDB kullanıyorsan `.env.example` içindeki örnek adresi kullanabilirsin. Gerçek bağlantı bilgilerini Git’in yok saydığı `.env` dosyasında tut.

```sh
npm run dev
```

API varsayılan olarak `http://localhost:3000` adresinde çalışır.

### Seed ve Postman kontrolü

Örnek verilerle başlamak için test veritabanına bağlıyken `backend/` klasöründe `npm run seed` çalıştır. **Seed, hedef veritabanındaki etkinlikleri silip altı örnek kayıt ekler.** İkinci çalıştırmada da toplam altı kayıt kalır.

Postman’de [Sprint 9 koleksiyonunu](backend/requests/kampus-api.json) içe aktar ve **Run collection** ile çalıştır. 25 Kasım 2026 tarihli Newman çalıştırmasında 18 istek tamamlandı ve 45 doğrulamanın tamamı geçti. [Çalıştırma raporu](backend/requests/run-results.json)

| İstek | API sözleşmesi |
| --- | --- |
| `GET /health` | 200, öğrenci numarası ve sunucu zamanı |
| `GET /events` | 200, tarih sıralı liste |
| `GET /events?search=atölye&category=Atölye` | 200, başlık araması ve kategori filtresi |
| `GET /events/upcoming` | 200, UTC ile bugünden itibaren tarih ve saat sıralı liste |
| `GET /events/:id` | 200, etkinlik detayı veya 404 |
| `POST /events` | 201, yeni etkinlik veya doğrulama hatasında 400 |
| `PATCH /events/:id` | 200, güncel etkinlik. Geçersiz gövde için 400, bulunamayan etkinlik için 404 |
| `DELETE /events/:id` | 204, boş gövde veya bulunamayan etkinlik için 404 |

Etkinlik tarihleri `GG-AA-YYYY` biçimindedir. Otomatik testleri, Newman komutunu ve sonuç dosyasının konumunu [backend README](backend/README.md) dosyasında bulabilirsin.

## Frontend kurulumu

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

## Frontend davranışı

Etkinlikler EventsContext içinde tutulur. Ekleme, güncelleme ve silme sonuçları ana sayfa, liste, detay ve yönetimde ortaktır. Sayfa yenilenince başlangıç verisi geri gelir. Yönetim herkese açıktır. Giriş, kayıt ve şifre yenileme formları yalnızca doğrulama ve demo mesajı gösterir; sunucuya veri göndermez.

Etkinlik formu: ad en az 3 karakter, kategori seçili, tarih/saat/yer dolu, kontenjan 1–1000 arası tam sayı, açıklama en az 10 karakter. Giriş: e-postada @, şifre en az 6 karakter. Kayıt ayrıca en az 3 karakterlik ad soyad ve eşleşen şifreler ister. Şifre yenilemede e-postada @ aranır.

## Vercel

Root Directory: `frontend`, Framework Preset: `Vite`, Build Command: `npm run build`, Output Directory: `dist`. `frontend/vercel.json` alt adreslerin doğrudan açılması ve yenilenmesi için SPA yönlendirmesini içerir.

Vercel’de yayımlanan frontend, etkinlik listesini kendi başlangıç verisinden oluşturur. Sprint 9 kapsamındaki MongoDB ve Postman kontrolleri yerel backend adresinde yapılır.

Önceki sprintler `sprint1/`, `sprint2/` ve `sprint3/` klasörlerinde korunmuştur. Güncel dosya yapısı için [frontend README](frontend/README.md).
