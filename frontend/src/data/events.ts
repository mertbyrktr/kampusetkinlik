import type { CampusEvent } from '../types/campus-event'

export const events: CampusEvent[] = [
  {
    id: 'event-1', title: 'Kariyer Günleri 2026', category: 'Seminer',
    date: '2026-10-12', time: '14:00', location: 'A Blok Konferans Salonu', capacity: 120,
    description: 'Kariyer Günleri 2026’da öğrenciler ve mezunlar farklı meslek alanlarından konuşmacılarla buluşacak. Oturumlarda kariyer planlama, iş başvurusu ve sektördeki fırsatlar ele alınacak; katılımcılar konuşmacılara sorularını yöneltebilecek.',
    image: '/afis.svg',
  },
  {
    id: 'event-2', title: 'Robot Atölyesi', category: 'Atölye',
    date: '2026-10-20', time: '10:00', location: 'Lab 2', capacity: 20,
    description: 'Katılımcılar temel robotik uygulamalarını tanıyacak ve küçük bir robotik proje geliştirecek. Etkinlik, robotik alanına ilgi duyan öğrenciler için uygulamalı bir başlangıç sunuyor.',
  },
  {
    id: 'event-3', title: 'Siber Güvenlik ve Yapay Zekâ', category: 'Seminer',
    date: '2026-10-22', time: '13:30', location: 'B Blok Konferans Salonu', capacity: 80,
    description: 'Siber güvenlik seminerinde yapay zekâ destekli tehditler, kişisel verilerin korunması ve güvenli internet kullanımı konuşulacak.',
  },
  {
    id: 'event-4', title: 'Web Tasarım Atölyesi', category: 'Atölye',
    date: '2026-10-24', time: '11:00', location: 'Bilgisayar Laboratuvarı 1', capacity: 24,
    description: 'Katılımcılar HTML ve CSS kullanarak basit bir web sayfası tasarlayacak ve sayfa düzeninin temel ilkelerini uygulamalı olarak öğrenecek.',
  },
  {
    id: 'event-5', title: 'Bilim ve Teknoloji Söyleşisi', category: 'Söyleşi',
    date: '2026-10-27', time: '15:00', location: 'Merkez Konferans Salonu', capacity: 150,
    description: 'Söyleşide güncel bilim ve teknoloji çalışmaları, bu alanlardaki yeni gelişmeler ve öğrenciler için araştırma fırsatları konuşulacak.',
  },
  {
    id: 'event-6', title: 'Kampüste Bilgi Yarışması', category: 'Yarışma',
    date: '2026-10-29', time: '16:00', location: 'Kampüs Çim Alanı', capacity: 200,
    description: 'Öğrenciler takımlar halinde bilim, kültür ve kampüs yaşamıyla ilgili soruları yanıtlayacak. Yarışma sonunda katılımcılar kampüs topluluğuyla bir araya gelecek.',
  },
]
