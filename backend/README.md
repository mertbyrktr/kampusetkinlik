# Kampüs Etkinlikleri API · Sprint 9

Ahmet Mert Bayraktar · **2321032070**

Express API etkinlikleri MongoDB'nin `events` koleksiyonunda saklar. Sunucu yeniden başlatıldığında POST ile eklenen kayıtlar korunur.

## Kurulum

Node.js 22 veya üzeri gerekir. Repo kökünden çalıştır:

```sh
cd backend
npm install
cp -n .env.example .env
```

`backend/.env` içindeki `MONGODB_URI` değerini kendi Atlas bağlantı adresinle değiştir ve adresin veritabanı yoluna `/kampus` ekle. Yerel MongoDB kullanıyorsan `.env.example` dosyasındaki örnek adresi kullanabilirsin. `.env` Git tarafından yok sayılır.

İlk kurulumda örnek veriyi yükle, ardından sunucuyu başlat:

```sh
npm run seed
npm run dev
```

**Seed, hedef veritabanındaki mevcut etkinlikleri silip altı örnek etkinlik yükler.** İkinci çalıştırmada da altı kayıt kalır. Normal sunucu başlangıcı seed çalıştırmaz.

API varsayılan olarak `http://localhost:3000` adresinde çalışır. `PORT` değeri `.env` üzerinden ayarlanabilir. Dosya izleme olmadan başlatmak için `npm start` kullan.

## API

| Yöntem | Adres | Beklenen yanıt |
| --- | --- | --- |
| GET | `/health` | 200, `status`, ISO zaman ve `student: "2321032070"` |
| GET | `/events` | 200, tarihe göre artan sırada etkinlik dizisi |
| GET | `/events?search=atölye&category=Atölye` | 200, başlıkta harf büyüklüğünden bağımsız arama ve tam kategori eşleşmesi. İki filtre ayrı ayrı da kullanılabilir |
| GET | `/events/upcoming` | 200, UTC ile bugün ve sonrasındaki etkinlikler, önce tarihe sonra saate göre artan sırada |
| GET | `/events/:id` | 200, etkinlik. Geçersiz ve bulunamayan `_id` için 404 |
| POST | `/events` | 201, MongoDB `_id` ve zaman damgalarıyla yeni etkinlik. Doğrulama hatasında 400 |
| PATCH | `/events/:id` | 200, güncellenmiş kayıt. Boş gövde, korunan alan veya doğrulama hatası için 400, bulunamayan etkinlik için 404 |
| DELETE | `/events/:id` | 204, boş gövde. Geçersiz veya silinmiş kimlik için 404 |

Etkinlik tarihi API'de `GG-AA-YYYY` biçimindedir ve MongoDB'de Date olarak saklanır. PATCH sadece gönderilen alanları günceller. `_id`, `createdAt`, `updatedAt` ve `__v` alanları korunur.

POST gövdesi örneği:

```json
{
  "title": "Git Atölyesi",
  "category": "Atölye",
  "capacity": 30,
  "date": "01-12-2026",
  "time": "14:00",
  "location": "Bilgisayar Laboratuvarı 1",
  "description": "Git ve GitHub ile ilk adımlar."
}
```

`title` (3–100 karakter), `category` ve `date` zorunludur. Kategoriler Seminer, Atölye, Söyleşi ve Yarışma'dır. `capacity` en az 0 olur ve varsayılanı 0'dır. Açıklama en fazla 500 karakter olabilir. Hatalar `{"error":{"message":"…"}}` biçiminde döner.

## Doğrulama

Yerel MongoDB çalışırken `npm test` komutunu kullan. MongoDB farklı bir yerel porttaysa örneğin `MONGODB_TEST_URI=mongodb://127.0.0.1:27018 npm test` komutunu çalıştır. Testler kendi geçici veritabanlarını oluşturup temizler.

Postman’de [koleksiyonu](requests/kampus-api.json) içe aktar. Seed yüklenmiş test veritabanıyla API çalışırken **Run collection** seçeneğiyle 18 isteği sırayla çalıştır. Koleksiyon oluşturduğu kaydı günceller ve siler. Beklenen sonuç 45 başarılı testtir.

Ders koleksiyonunu Newman ile çalıştırıp sonucu kaydetmek için `backend/` içinde:

```sh
npx newman run https://webdersi.vercel.app/test.json -r cli,json --reporter-json-export requests/run-results.json
```
