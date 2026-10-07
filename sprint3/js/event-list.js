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

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[character]);
}

function createCard(event) {
  return `
    <article class="kart">
      <h2>${escapeHtml(event.title)}</h2>
      <p><strong>Kategori:</strong> ${escapeHtml(event.category)}</p>
      <p><strong>Tarih:</strong> <time datetime="${toIsoDate(event.date)}">${formatDate(event.date)}</time>, ${escapeHtml(event.time)}</p>
      <p><strong>Yer:</strong> ${escapeHtml(event.location)}</p>
      <p>${escapeHtml(event.description)}</p>
      <p class="kart-kontenjan"><strong>Kontenjan:</strong> ${escapeHtml(event.capacity)} kişi</p>
      <a class="kart-detay" href="etkinlik-detay.html?id=${encodeURIComponent(event.id)}">Detayları gör →</a>
    </article>`;
}

const list = document.querySelector("#etkinlik-listesi");
const filterForm = document.querySelector("#filtre-formu");
const searchInput = document.querySelector("#arama");
const categorySelect = document.querySelector("#kategori-filtre");
const resultLine = document.querySelector("#sonuc");

if (list) {
  const heading = list.querySelector(":scope > h2")?.outerHTML ?? "";

  function render(eventList) {
    list.innerHTML = `${heading}<div class="kartlar">${eventList.map(createCard).join("")}</div>`;
  }

  if (list.dataset.limit) {
    const nearestEvents = [...events]
      .sort((first, second) => parseDate(first.date) - parseDate(second.date))
      .slice(0, Number(list.dataset.limit));
    render(nearestEvents);
  } else {
    render(events);
  }

  if (filterForm && searchInput && categorySelect && resultLine) {
    const categories = [...new Set(events.map((event) => event.category))]
      .sort((first, second) => first.localeCompare(second, "tr-TR"));

    for (const category of categories) {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categorySelect.append(option);
    }

    function updateResults(eventList) {
      render(eventList);
      resultLine.textContent = eventList.length === 0
        ? "Etkinlik bulunamadı."
        : `${eventList.length} etkinlik listeleniyor.`;
      resultLine.classList.toggle("sonuc-yok", eventList.length === 0);
    }

    function filterEvents() {
      const searchTerm = searchInput.value.trim().toLocaleLowerCase("tr-TR");
      const selectedCategory = categorySelect.value;
      const filteredEvents = events.filter((event) => {
        const searchableText = `${event.title} ${event.category} ${event.description} ${event.location}`
          .toLocaleLowerCase("tr-TR");
        const matchesSearch = searchableText.includes(searchTerm);
        const matchesCategory = !selectedCategory || event.category === selectedCategory;
        return matchesSearch && matchesCategory;
      });

      updateResults(filteredEvents);
    }

    filterForm.addEventListener("submit", (event) => event.preventDefault());
    searchInput.addEventListener("input", filterEvents);
    categorySelect.addEventListener("change", filterEvents);
    updateResults(events);
  }
}
