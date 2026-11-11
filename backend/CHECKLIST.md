# Sprint 7 - 12 maddelik teslim checklist'i

Doğrulama tarihi: 11 Kasım 2026. Öğrenci: Ahmet Mert Bayraktar, 2321032070.

PDF'nin 18. sayfasındaki sırayla:

- [x] **1. Backend ayrı `backend/` klasöründe.** Express uygulaması `src/app.js`, başlatıcı `src/server.js` dosyasındadır.
- [x] **2. `npm install` ve `npm run dev` hatasız çalışıyor.** Bağımlılıklar kuruldu; geliştirme sunucusu `http://localhost:3000` adresinde başlatılıp altı gerçek HTTP isteğiyle doğrulandı.
- [x] **3. Port `.env` dosyasından okunuyor; `.env.example` var.** `dotenv/config` ilk import; `PORT=3000` örneği mevcut. Ayrı `.env` dosyasıyla port okuma testi geçti.
- [x] **4. `.env` ve `node_modules` Git'e dahil değil.** `backend/.gitignore` ikisini dışlıyor; `git check-ignore` doğrulandı ve `git ls-files` içinde bulunmadıkları kontrol edildi.
- [x] **5. Route ve controller ayrı dosyalarda.** `src/routes/event-routes.js` ve `src/controllers/event-controller.js`.
- [x] **6. En az 5 adım adım commit.** Sunucu/health, özgün veri/GET, POST, Postman/API testleri ve son dokümantasyon ayrı commit'lerde kaydedildi. `git log --oneline 687e1c6..HEAD` ile incelenebilir.
- [x] **7. `GET /health` yanıtında doğru öğrenci numarası.** `student: "2321032070"`, `status: "ok"` ve güncel ISO `time`; 200 doğrulandı.
- [x] **8. `data/events.js` içinde 6 özgün etkinlik.** Başlık, yer ve açıklamalar özelleştirildi; kimlikler `event-1` ... `event-6`; `image` alanı yok.
- [x] **9. GET liste ve detay çalışıyor; bulunamayan id 404.** İlk listede 6 kayıt; `event-2` detayı 200; `/events/yok` 404 ve `error.message` döndürüyor.
- [x] **10. POST başarılıysa 201, eksik veride 400.** Tam gövdeyle yeni benzersiz kimlik oluşuyor; kayıt GET ile okunuyor ve liste 7 oluyor. Yalnızca title gönderimi 400.
- [x] **11. `backend/README.md` içinde REST sözleşmesi.** Kurulum, PORT, hata biçimi ve uçların yöntem/başarı/hata tablosu mevcut; PATCH/DELETE ileriki sprint olarak işaretli.
- [x] **12. Altı istek `backend/requests/kampus-api.json` koleksiyonunda.** Kampüs API, Postman Collection v2.1; gerçek Postman CLI çalıştırmasında **6/6 istek, 18/18 doğrulama** başarılı.

## Doğrulama sonuçları

- `npm test`: **10 test, 10 başarılı, 0 başarısız**.
- Postman CLI: **6 istek, 18 doğrulama, 0 başarısız**.
- Postman durum kodları sırasıyla: **200, 200, 200, 404, 201, 400**.
- `git diff --check`: boşluk/satır hatası yok.
- Sprint başlangıcına göre `frontend/` değişmedi.
- Veriler bellekte; yeniden başlatmada altı başlangıç kaydı geri geliyor (test edildi).

## Teslim durumu

Kod ve Git commit'leri yerelde hazırdır. `sprint-07` etiketi teslim sürümünü işaretler. GitHub'a push ve ders sitesine bağlantı gönderimi bu çalışma kapsamında yapılmadı; bu dosyadaki tamamlanma işaretleri yerel proje gereksinimleri ve test sonuçları içindir.
