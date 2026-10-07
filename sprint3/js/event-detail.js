import { events } from "./data.js";

function parseDate(dateValue) {
  const [day, month, year] = dateValue.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(dateValue) {
  return parseDate(dateValue).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function toIsoDate(dateValue) {
  const [day, month, year] = dateValue.split("-");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

const container = document.querySelector("#detay");
const eventId = new URLSearchParams(window.location.search).get("id");
const event = events.find((item) => item.id === eventId);

if (!event) {
  document.title = "Etkinlik bulunamadı | Kampüs Etkinlikleri";
  container.classList.add("hata-kutusu");
  container.innerHTML = `
    <h2>Etkinlik bulunamadı</h2>
    <p>Bağlantıdaki etkinlik kimliği geçersiz veya eksik.</p>
    <p><a href="etkinlikler.html">Listeye dön</a></p>`;
} else {
  document.title = `${event.title} | Kampüs Etkinlikleri`;

  const posters = {
    "event-1": { source: "afis.jpg", description: "Kariyer Günleri 2026 etkinlik afişi" },
    "event-2": { source: "robot.jpg", description: "Robot Atölyesi etkinlik görseli" }
  };
  const poster = posters[event.id];
  const posterMarkup = poster
    ? `<img src="${poster.source}" alt="${poster.description}">`
    : `<div class="afis-yok" aria-label="Etkinlik afişi bulunmuyor"><span>${event.category}</span></div>`;

  container.innerHTML = `
    <h2 class="detay-baslik"></h2>
    <figure class="etkinlik-afisi">${posterMarkup}</figure>
    <dl>
      <dt>Kategori</dt><dd class="detay-kategori"></dd>
      <dt>Tarih</dt><dd><time class="detay-tarih"></time></dd>
      <dt>Saat</dt><dd class="detay-saat"></dd>
      <dt>Yer</dt><dd class="detay-yer"></dd>
      <dt>Kontenjan</dt><dd class="detay-kontenjan"></dd>
    </dl>
    <section class="detay-aciklama" aria-labelledby="detay-aciklama-baslik">
      <h3 id="detay-aciklama-baslik">Etkinlik Hakkında</h3>
      <p></p>
    </section>
    <p class="detay-eylemler">
      <a class="guncelle-link" href="#">Bu etkinliği güncelle</a>
      <a href="etkinlikler.html">Etkinliklere dön</a>
    </p>`;

  container.querySelector(".detay-baslik").textContent = event.title;
  container.querySelector(".detay-kategori").textContent = event.category;
  const dateElement = container.querySelector(".detay-tarih");
  dateElement.dateTime = toIsoDate(event.date);
  dateElement.textContent = formatDate(event.date);
  container.querySelector(".detay-saat").textContent = event.time;
  container.querySelector(".detay-yer").textContent = event.location;
  container.querySelector(".detay-kontenjan").textContent = event.capacity
    ? `${event.capacity} kişi`
    : "Belirtilmedi";
  container.querySelector(".detay-aciklama p").textContent = event.description;
  container.querySelector(".guncelle-link").href = `etkinlik-guncelle.html?id=${encodeURIComponent(event.id)}`;
}
