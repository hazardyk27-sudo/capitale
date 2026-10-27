# PRATİK ARŞİV

Araştırma ajanlarının maç başına zaman içindeki para ve oran davranışını hızlı incelemesi için hazırlanmış, kompakt ve nokta örneklemeli arşiv. Bu arşiv ham akışın tamamı değildir; tanımlı T noktalarındaki gerçek kaynak kayıtlarını saklar.

## T noktaları

- T-72’den T-24’e: 3 saat aralıklarla (72, 69, …, 24).
- T-24’ten T-12’ye: 2 saat aralıklarla (22, 20, …, 12).
- T-12’den T-1’e: 1 saat aralıklarla (11, 10, …, 1).

Toplam 34 nokta. Her hedef zaman kickoff UTC’den hesaplanır. Hedef zamandan önceki en son kaynak kaydı alınır; daha sonraki kayıt kullanılmaz ve veri uydurulmaz. Aynı zamandaki kaynak kayıtlarında birebir fixture_uid eşleşmesi, ardından source_fingerprint alfabetik artan sırası kullanılır. Hash ile eşleştirme yalnızca aynı gün için hash tekil olduğunda yapılır. Uygun kayıt yoksa pazar MISSING olur. Gerçek kayıt zamanı ve hedefe gecikme dakikası saklanır.

## Dosyalar

Her gün klasöründe checkpoints.jsonl.gz (maç ve checkpoint kayıtları), alarms.jsonl.gz (orijinal alarm satırları) ve manifest.json (kapsam, alanlar, boyutlar, kapsama ve SHA-256 (sıkıştırılmamış JSONL baytları üzerinde) bulunur.

Orijinal tarihçe alanları (oran, yüzde, GBP miktarı, hacim, kayıt zamanı, kaynak satır kimliği ve fingerprint) korunur. Pazar tarihçeleri ve fikstür verileri Supabase’den salt okunur üretildi; sonuç kaynağı gün bazında manifestte belirtilir. Kaynak arşiv dosyaları değiştirilmedi. Günlük ana kaynak arşivi kısmi ise durum ve kapsam farkı ilgili manifestte açıkça belirtilir. Sonuçlar fixture kimliğiyle; kimlik yoksa hash, takım adları ve kickoff zamanı birlikte doğrulanarak eşleştirilir. Canlı skorlar saklanır fakat kesin sonuç sayılmaz.

## Günler

9–26 Ekim 2026 arşivlendi. Üst düzey index.json her günün maç, sonuç, alarm, kapsama ve dosya boyutu özetini listeler.


24–26 Ekim 2026 için kaynak manifest farklılıkları ve kısmi koleksiyon durumu günlük manifestlerde açıklanır. 25 Ekimde 368 maçlık doğrulanmış arşiv rosterı korunmuştur; 26 Ekim için günlük kaynak manifesti bulunmadığından güncel Supabase fixture rosterı kullanılmıştır.


## Günlük otomatik arşiv

CAPİTALE deposundaki `.github/workflows/sxf-admin-archive.yml` her gün 23:00 UTC'de (02:00 Europe/Istanbul) önceki tamamlanmış günün PRATİK ARŞİVİNİ üretir. İş akışı, mevcut 02:17 UTC saklama temizliğinden önce çalışacak şekilde zamanlanmıştır. Admin ekranından aynı iş akışı elle geçmiş bir tarih için başlatılabilir.

Üretim girdisi yalnız okuma yetkili `PRATIK_ARCHIVE_DATABASE_URL` Actions sırrıdır. Kaynak `public.fixtures`, `public.live_fixtures`, üç para/oran tarihçe tablosu ve alarm tablolarıdır. Günlük dosyalar bu dizin yapısına eklenir; mevcut tarih tekrar çalıştırıldığında manifest, kayıt sayısı, 34 nokta çizelgesi, gelecek veri yasağı ve SHA-256 denetlenir. Doğrulanmış gün atlanır; eksik veya hatalı klasör üzerine yazılmaz ve iş başarısız olur.

Arşiv kaynak tablolarını değiştirmez. `SXF_arastirma_arsivi/` ve öğrenme arşivi ayrı kalır.
