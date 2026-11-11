# Kampüs Etkinlikleri API - Sprint 7

Ahmet Mert Bayraktar · **2321032070**

Node.js + Express REST API. Frontend ayrı uygulama olarak korunur; bu sprintte API'ye bağlanmaz. Veriler bellekte tutulur: sunucu yeniden başlatıldığında POST ile eklenen kayıtlar kaybolur ve altı başlangıç etkinliği geri gelir.

## Kurulum ve çalıştırma

Node.js 22 veya üzeri gerekir. Repo kökünden:

```sh
cd backend
npm install
cp .env.example .env
npm run dev
```

`npm run dev` dosya değişikliklerini izler. İzleme olmadan çalıştırmak için `npm start` kullanılır. Varsayılan adres: `http://localhost:3000`.

`.env` içindeki `PORT=3000`, `dotenv` ile okunur; değer yoksa 3000 kullanılır. `.env.example` paylaşılır, `.env` ve `node_modules/` Git tarafından yok sayılır. Backend bu sprintte canlıya alınmaz; Vercel ayarları değişmez.

## Dosya yapısı

```text
backend/
  src/
    app.js                       # Middleware, health, route bağlantısı ve JSON hataları
    server.js                    # .env ve port dinleme
    routes/event-routes.js        # URL -> controller eşlemesi
    controllers/event-controller.js
    data/events.js               # event-1 ... event-6, özgün başlangıç verisi
  requests/kampus-api.json        # Postman Collection v2.1, altı istek
  test/                          # HTTP ve sunucu yaşam döngüsü testleri
  .env.example
  .gitignore
  package.json
  package-lock.json
  README.md
  CHECKLIST.md
```

## REST sözleşmesi

Tüm yanıtlar JSON'dur. Başarılı liste yanıtı doğrudan dizi, detay ve POST yanıtı doğrudan etkinlik nesnesidir.

| Method | Endpoint | Amaç | Başarılı | Hata | Durum |
| --- | --- | --- | --- | --- | --- |
| GET | `/health` | Sunucu durumu, ISO zaman ve öğrenci numarası | 200 | - | Sprint 7 |
| GET | `/events` | Etkinlik listesi | 200 | - | Sprint 7 |
| GET | `/events/:id` | Tek etkinlik | 200 | 404 | Sprint 7 |
| POST | `/events` | Yeni etkinlik | 201 | 400 | Sprint 7 |
| PATCH | `/events/:id` | Güncelleme | 200 | 400, 404 | Sprint 9, henüz uygulanmadı |
| DELETE | `/events/:id` | Silme | 204 | 404 | Sprint 9, henüz uygulanmadı |

İsteğe bağlı kategori filtresi: `/events?category=At%C3%B6lye`. Eşleşme yoksa `200` ve boş dizi döner. Bilinmeyen yollar `404` döner.

Health örneği (`time` her istekte güncellenir):

```json
{"status":"ok","time":"2026-11-11T09:00:00.000Z","student":"2321032070"}
```

POST gövdesi:

```json
{
  "title": "Git Atölyesi",
  "category": "Atölye",
  "capacity": 30,
  "date": "2026-12-01",
  "time": "14:00",
  "location": "Bilgisayar Laboratuvarı 1",
  "description": "Git ve GitHub ile ilk adımlar."
}
```

`title`, `category`, `date` boş olmayan metin olarak zorunludur. Başarılı yanıtta bu alanlarla birlikte sunucunun ürettiği benzersiz `event-<UUID>` kimliği bulunur. İstemcinin gönderdiği `id` kullanılmaz. `capacity` sayıya çevrilir; yoksa/geçersizse 0 olur. `time`, `location`, `description` verilmezse boş metindir. Ayrıntılı tarih/kategori/kapasite doğrulaması sonraki sprintin kapsamıdır.

Bütün hatalarda ortak biçim:

```json
{"error":{"message":"Event not found"}}
```

Eksik zorunlu alan: `400`, mesaj `title, category and date are required`. Bilinmeyen yol: `404`, mesaj `Route not found`. Bozuk JSON: `400`, mesaj `Invalid JSON body`.

## Testler

```sh
npm test
```

Testler ayrı geçici portlarda çalışır; açık geliştirme sunucusunun verisini değiştirmez. Health, altı kayıt, detay/404, filtre, POST/201, eksik veri/400, benzersiz kimlik, JSON hataları, CORS, .env okuma ve yeniden başlatmada verinin sıfırlanması doğrulanır.

Postman'de `requests/kampus-api.json` dosyasını **Import** ile aç. Koleksiyon adı **Kampüs API**, formatı **Collection v2.1**'dir. Altı kayıt beklendiği için koleksiyonu her çalıştırmadan önce sunucuyu yeniden başlat; istekleri sırayla çalıştır.

Postman CLI kuruluysa (sunucu ayrı terminalde açıkken):

```sh
postman collection run requests/kampus-api.json
```

[Resmi Postman CLI kurulumu](https://learning.postman.com/docs/postman-cli/postman-cli-installation/): `npm install -g postman-cli`. Bu çalışmada araç sistem geneline kurmak yerine `/tmp/kampus-postman-cli` altında kullanıldı.

| İstek | Beklenen sonuç |
| --- | --- |
| GET `/health` | 200, status=ok, student=2321032070 |
| GET `/events` | 200, başlangıçta 6 kayıt |
| GET `/events/event-2` | 200, id=event-2 |
| GET `/events/yok` | 404, error.message |
| POST `/events`, tam gövde | 201, yeni id |
| POST `/events`, yalnızca title | 400, error.message |

Doğrulama ve teslim listesi: [CHECKLIST.md](CHECKLIST.md).
