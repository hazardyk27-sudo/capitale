# PRATİK ARŞİV

Araştırma ajanlarının maç başına zaman içindeki para ve oran davranışını hızlı incelemesi için hazırlanmış, kompakt ve nokta örneklemeli arşiv. Bu arşiv ham akışın tamamı değildir; tanımlı T noktalarındaki gerçek kaynak kayıtlarını saklar.

## T noktaları

- T-72’den T-24’e: 3 saat aralıklarla (72, 69, …, 24).
- T-24’ten T-12’ye: 2 saat aralıklarla (22, 20, …, 12).
- T-12’den T-1’e: 1 saat aralıklarla (11, 10, …, 1).

Toplam 34 nokta. Her noktanın hedef zamanı kickoff UTC’den hesaplanır. O hedef zamandan önceki en son kaynak kaydı alınır; daha sonraki bir kayıt kullanılmaz ve veri uydurulmaz. Uygun kayıt yoksa pazar durumu MISSING olur. Gerçek kayıt zamanı ve hedefe gecikme dakikası saklanır.

## Dosyalar

Her gün klasöründe:

- checkpoints.jsonl.gz: satır başına bir maç; fikstür kimliği, lig, kickoff, sonuç ve 34 checkpoint. Her checkpoint altında 1X2, OU25, BTTS kayıtları bulunur.
- alarms.jsonl.gz: alarm_table ve orijinal alarm satırını taşıyan payload.
- manifest.json: kapsam, kapsama sayıları, byte boyutları, SHA-256 ve eksik veri politikası.

Orijinal tarihçe alanları (oran, yüzde, GBP miktarı, hacim, kayıt zamanı, kaynak satır kimliği ve fingerprint) korunur. Arşiv Supabase research_archive tablosundan salt okunur üretildi; kaynak dosyalar değiştirilmedi.

## Günler

9–14 Ekim 2026, iki parti halinde eklenmiştir. Üst düzey index.json dosyası her günün kapsamını ve gerçek dosya boyutlarını listeler.
