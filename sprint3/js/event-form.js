import { events } from "./data.js";

function initializeForm() {
  const form = document.querySelector("#etkinlik-formu");
  const isUpdateMode = form.dataset.mode === "guncelle";
  let eventToUpdate = null;

  if (isUpdateMode) {
    const eventId = new URLSearchParams(window.location.search).get("id");
    eventToUpdate = events.find((event) => event.id === eventId);

    if (!eventToUpdate) {
      document.title = "Etkinlik bulunamadı | Kampüs Etkinlikleri";
      form.outerHTML = `
        <section class="hata-kutusu" aria-live="polite">
          <h2>Etkinlik bulunamadı</h2>
          <p>Güncellenecek etkinlik kimliği geçersiz veya eksik.</p>
          <p><a href="etkinlikler.html">Etkinliklere git</a></p>
        </section>`;
      return;
    }

    const [day, month, year] = eventToUpdate.date.split("-");
    form.elements.ad.value = eventToUpdate.title;
    form.elements.kategori.value = eventToUpdate.category;
    form.elements.tarih.value = `${year}-${month}-${day}`;
    form.elements.saat.value = eventToUpdate.time;
    form.elements.yer.value = eventToUpdate.location;
    form.elements.aciklama.value = eventToUpdate.description;
    form.elements.kontenjan.value = eventToUpdate.capacity ?? "";
    document.querySelector("header h1").textContent = `${eventToUpdate.title} etkinliğini güncelle`;
    document.querySelector("header p").textContent = "Etkinlik bilgilerini düzenle.";
    document.title = `${eventToUpdate.title} etkinliğini güncelle | Kampüs Etkinlikleri`;
  }

  const errorTargets = {
    ad: { field: form.elements.ad, message: document.querySelector("#ad-hata") },
    kategori: { field: form.elements.kategori, message: document.querySelector("#kategori-hata") },
    tarih: { field: form.elements.tarih, message: document.querySelector("#tarih-hata") },
    saat: { field: form.elements.saat, message: document.querySelector("#saat-hata") },
    yer: { field: form.elements.yer, message: document.querySelector("#yer-hata") },
    kontenjan: { field: form.elements.kontenjan, message: document.querySelector("#kontenjan-hata") }
  };

  function clearError(key) {
    const target = errorTargets[key];
    if (!target) return;
    target.message.textContent = "";
    target.field.removeAttribute("aria-invalid");
  }

  for (const [key, target] of Object.entries(errorTargets)) {
    target.field.addEventListener("input", () => clearError(key));
    target.field.addEventListener("change", () => clearError(key));
  }

  function setError(key, message) {
    const target = errorTargets[key];
    target.message.textContent = message;
    target.field.setAttribute("aria-invalid", "true");
  }

  function showMessage(kind, title, data) {
    const message = form.querySelector("#form-mesaj");
    message.className = `form-mesaj form-mesaj--${kind}`;
    message.replaceChildren();

    const heading = document.createElement("p");
    heading.textContent = title;
    message.append(heading);
    if (data !== undefined) {
      const preview = document.createElement("pre");
      preview.textContent = JSON.stringify(data, null, 2);
      message.append(preview);
    }
  }

  form.addEventListener("submit", (submission) => {
    submission.preventDefault();
    for (const key of Object.keys(errorTargets)) clearError(key);
    form.querySelector("#form-mesaj").replaceChildren();
    form.querySelector("#form-mesaj").className = "form-mesaj";

    const formData = new FormData(form);
    const title = formData.get("ad").trim();
    const category = formData.get("kategori");
    const date = formData.get("tarih");
    const time = formData.get("saat");
    const location = formData.get("yer").trim();
    const capacityValue = formData.get("kontenjan").trim();
    const errors = {};

    if (title.length < 3) errors.ad = "En az 3 karakter olmalı.";
    if (!category) errors.kategori = "Bir kategori seçin.";
    if (!date) errors.tarih = "Tarih girin.";
    if (!time) errors.saat = "Saat girin.";
    if (!location) errors.yer = "Yer girin.";
    if (capacityValue) {
      const capacity = Number(capacityValue);
      if (!Number.isInteger(capacity) || capacity < 1 || capacity > 1000) {
        errors.kontenjan = "1 ile 1000 arasında tam sayı girin.";
      }
    }

    for (const [key, message] of Object.entries(errors)) setError(key, message);

    if (Object.keys(errors).length > 0) {
      showMessage("hata", "Formda hatalı alanlar var.");
      return;
    }

    const [year, month, day] = date.split("-");
    const data = {
      title,
      category,
      date: `${day}-${month}-${year}`,
      time,
      location,
      description: formData.get("aciklama").trim(),
      capacity: capacityValue ? Number(capacityValue) : null
    };

    if (isUpdateMode && eventToUpdate) data.id = eventToUpdate.id;

    showMessage(
      "basari",
      isUpdateMode ? "Etkinlik güncellendi." : "Etkinlik bilgileri hazır.",
      data
    );
  });
}

initializeForm();
