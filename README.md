# Kampüs Etkinlikleri · Sprint 8

Ahmet Mert Bayraktar · 2321032070

[Canlı Vercel adresi](https://ahmetmertbayraktar-frontend.vercel.app)

React, TypeScript ve Vite uygulaması `frontend/` klasöründedir. Sprint 6 kapsamında React Router ile 10 route, ortak EventsContext, etkinlik yönetimi ve form doğrulama tamamlanmıştır.

## Sprint 8 · MongoDB ve Mongoose

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

Postman’de [Kampüs API koleksiyonunu](backend/requests/kampus-api.json) içe aktar ve istekleri tablodaki sırayla gönder. Liste isteği, detay isteğinde kullanılacak `_id` değerini otomatik ayarlar.

| İstek | Beklenen sonuç |
| --- | --- |
| `GET /health` | 200, öğrenci numarası `2321032070` |
| `GET /events` | 200, seed’in hemen ardından 6 etkinlik |
| `GET /events/:id` | 200, listeden alınan `_id` ile etkinlik detayı |
| `GET /events/yok` | 404. Biçimi geçerli olup bulunamayan bir `_id` de 404 döner. |
| `POST /events` · Geçerli gövde | 201, yeni etkinlik ve MongoDB `_id` değeri |
| `POST /events` · Yalnızca başlık | 400. Bu isteğin ardından `GET /health` 200 dönmeye devam eder. |

Kalıcılığı kontrol etmek için başarılı POST yanıtındaki `_id` değerini al. Backend’i yeniden başlat ve aynı kimlikle detay isteğinin 200 döndüğünü doğrula. Otomatik testler `backend/` klasöründe `npm test` ile çalışır. Kurulum ayrıntıları ve API sözleşmesi [backend README](backend/README.md) dosyasında.

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

Vercel’de yayımlanan frontend, etkinlik listesini kendi başlangıç verisinden oluşturur. Sprint 8’in MongoDB ve Postman kontrolleri yerel backend adresinde yapılır.

Önceki sprintler `sprint1/`, `sprint2/` ve `sprint3/` klasörlerinde korunmuştur. Güncel dosya yapısı için [frontend README](frontend/README.md).
