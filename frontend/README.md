[Canlı site](https://kampusetkinlik.vercel.app)

# Kampüs Etkinlikleri · Sprint 4

Ahmet Mert Bayraktar · 2321032070

React, TypeScript ve Vite ile beş ekran: ana sayfa, etkinlik listesi, detay, ekleme ve güncelleme. Sayfa geçişleri React state ile yapılır; adres değişmez. Arama başlık ve açıklamada Türkçe büyük/küçük harf uyumuyla çalışır, kategori filtresiyle birlikte uygulanır. Formlar bu sprintte yalnızca görünüm sunar; veri kaydetmez ve gönderilince sayfayı yenilemez.

## Çalıştırma

```sh
cd frontend
npm ci
npm run dev
```

Üretim kontrolü: `npm run build`, ardından `npm run preview`. Kod kontrolü: `npm run lint`.

## Dosyaların görevleri

- `package.json`: Paketleri ve dev, build, lint, preview komutlarını tanımlar.
- `package-lock.json`: Bağımlılıkların tam sürümlerini sabitler.
- `node_modules/`: İndirilen bağımlılıkları içerir; Git'e dahil edilmez.
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`: TypeScript ayarlarıdır.
- `vite.config.ts`: Vite ve React eklentisini yapılandırır.
- `index.html`: React'in bağlandığı root elemanını ve uygulama girişini içerir.
- `src/main.tsx`: React'i başlatır ve App bileşenini root'a çizer.
- `src/App.tsx`: Beş ekranı, menüyü, kartları, filtre state'ini ve sekme başlığını yönetir.
- `src/App.css`: Sprint 3 tasarımını içerir; aktif menü ve telefon kart düzeni için küçük uyarlamalar yapılmıştır.
- `src/index.css`: Sprint gereği boştur.
- `src/types/campus-event.ts`: Dört kategori ve CampusEvent veri tipini tanımlar.
- `src/data/events.ts`: Altı etkinliği tipli bir dizi olarak saklar.
- `src/utils/filter-events.ts`: DOM'a dokunmadan arama, kategori filtreleme ve kimliğe göre bulma işlemlerini yapar.
- `public/`: Afiş ve favicon gibi doğrudan sunulan statik dosyaları içerir.
- `.gitignore`: node_modules, dist ve yerel dosyaları Git dışında tutar.
- `.oxlintrc.json`: Kod kontrol kurallarını yapılandırır.

## Veri uyarlaması

Sprint 3 arşivi değiştirilmemiştir. Sprint 4'te PDF'in altı kayıt şartı için ilk altı kayıt temel alınmıştır; son iki kayıt, izin verilen Söyleşi ve Yarışma kategorilerine uygun başlık ve açıklamalarla uyarlanmıştır. Tarihler sıralanabilir YYYY-MM-DD biçimindedir. Ana sayfa PDF'teki sort + slice örneği gibi tarihe göre ilk iki kaydı gösterir. İlk etkinlik /afis.svg kullanır; afişi olmayan etkinliklerde boş afiş kutusu çizilmez.

## Teslim

Canlı site bağlantısı mevcut projenin adresidir; bu yerel değişiklikler yayımlanana kadar önceki sprint görünebilir.

Vercel proje ayarları: Root Directory `frontend`, Framework Preset `Vite`, Build Command `npm run build`, Output Directory `dist`.

Yerel kontrol tamamlandıktan sonra yalnızca teslim edilecek dosyaları commit'e dahil edin, `sprint-04` etiketi oluşturun ve ilgili dal ile etiketi gönderin. node_modules ve dist gönderilmemelidir. Yayından sonra canlı adreste ana sayfa, altı kayıt, arama/filtre, detay ve iki form tekrar kontrol edilmelidir.
