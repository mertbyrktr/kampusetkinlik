// Sprint 7 stores data in memory; restarting restores these six seed events.
export const events = [
  {
    id: 'event-1', title: 'Kampüsün Dijital Hafızası', category: 'Seminer',
    capacity: 120, date: '2026-11-20', time: '14:00', location: 'Kütüphane Medya Salonu',
    description: 'Öğrenciler kampüsteki eski fotoğrafları ve sözlü anlatıları dijital bir arşive dönüştürmenin yöntemlerini tartışacak. Oturum sonunda ortak arşivin ilk konu başlıkları belirlenecek.',
  },
  {
    id: 'event-2', title: 'Sensörlerle Akıllı Saksı Atölyesi', category: 'Atölye',
    capacity: 20, date: '2026-11-24', time: '10:00', location: 'Mühendislik Binası Üretim Odası',
    description: 'Katılımcılar toprak nemini ölçen bir sensörü mikrodenetleyiciye bağlayacak ve sulama uyarısı veren küçük bir prototip kuracak. Çalışma ikişer kişilik ekiplerle yürütülecek.',
  },
  {
    id: 'event-3', title: 'Açık Veriden Kampüs Haritasına', category: 'Seminer',
    capacity: 80, date: '2026-11-26', time: '13:30', location: 'Derslik C204',
    description: 'Kampüsteki erişilebilir yolları görünür kılmak için açık harita verileri incelenecek. Öğrenciler veri toplama, konum doğrulama ve haritaya işaret ekleme adımlarını örneklerle öğrenecek.',
  },
  {
    id: 'event-4', title: 'Bir Akşamda Piksel Oyunu', category: 'Atölye',
    capacity: 24, date: '2026-11-28', time: '17:00', location: 'Öğrenci Merkezi Kodlama Stüdyosu',
    description: 'Basit bir tarayıcı oyunu için karakter hareketi, puan sayacı ve çarpışma kuralları hazırlanacak. Her ekip kendi kampüs macerasını tasarlayıp oturum sonunda kısa bir oynanış gösterimi yapacak.',
  },
  {
    id: 'event-5', title: 'Mezunlarla İlk Açık Kaynak Katkısı', category: 'Söyleşi',
    capacity: 150, date: '2026-12-02', time: '15:00', location: 'Mezunlar Evi Buluşma Salonu',
    description: 'Açık kaynak projelere katkı sunan mezunlar ilk hata bildirimlerini ve kod inceleme deneyimlerini paylaşacak. Katılımcılar birlikte başlangıç düzeyindeki bir görev için katkı planı hazırlayacak.',
  },
  {
    id: 'event-6', title: 'Kampüs Rotaları Şifre Avı', category: 'Yarışma',
    capacity: 200, date: '2026-12-05', time: '16:00', location: 'Saat Kulesi Önü Buluşma Noktası',
    description: 'Takımlar kampüsün farklı noktalarındaki mantık bulmacalarını çözerek son şifreye ulaşacak. Her durakta farklı bir öğrenci kulübünün hazırladığı kısa bir görev ve ipucu bulunacak.',
  },
];
