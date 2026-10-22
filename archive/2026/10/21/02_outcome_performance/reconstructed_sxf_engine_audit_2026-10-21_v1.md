# SXF — 21 Ekim 2026 motor sonuçları (RETROSPEKTİF ARAŞTIRMA / KISMİ DOĞRULAMA)

> **Özgün maç öncesi tarama değildir.** 21 Ekim için GitHub'da dondurulmuş run/scan/AS_OF bulunmadığından bu dosya sonradan SmartXFlow motor olaylarından oluşturuldu. Resmî/sertifikalı settlement değildir. Maç skorları SmartXFlow iç FT kayıtlarından alındı; bağımsız olarak doğrulanmadı.

## Tekilleştirilmiş özet

- Kriterlere uyan ve maçtan önce kaydedilmiş **19 motor etiketi olayı**, **10 maç**, **11 piyasa seçimi**.
- **8/11 başarı (%72,73), 3 kayıp**; SURPRISE başarı metriği doğrudan galibiyet değil **kaybetmeme**.
- Retention 55 bozulan EARLY CORE, koşulları karşılamayan HEAVY, oran filtresinden geçenmeyen veya maçtan sonra kaydedilen olaylar performansta **yoktur**. Dışarıda kalan ham olaylar bu rapora bireysel satır olarak yazılmadı.
- PREMIUM OVER aynı seçimde STABLE'ın yerini alır; V2 ve HEAVY ayrı bağımsız sinyaller olarak sayılmaz.
- Başarı oranı üretim kalibrasyonu veya ileriye dönük başarı garantisi değildir.

## Motor performansı — etkin etiketler

| Motor | İsabet / etkin seçim | Değerlendirme |
|---|---:|---|
| V1 | 2/3 | Piyasa isabeti |
| V2 | 2/3 | Üst etiket, bağımsız oy değil |
| SURPRISE | 1/1 | Kaybetmeme |
| EARLY CORE | 2/2 | Piyasa isabeti |
| PREMIUM O2.5 | 2/2 | Piyasa isabeti |
| BTTS | 1/2 | Piyasa isabeti |
| STABLE O2.5 | 1/2 | Piyasa isabeti |
| EARLY T12 | 1/1 | Piyasa isabeti |
| HEAVY | 1/1 | Üst etiket, bağımsız oy değil |

*STABLE OVER'ın kaynakta PREMIUM ile ortak iki ek kaydı vardır; etkin STABLE hesabına katılmadılar.*

## Seçim sonuçları

| Maç | Piyasa / seçim | Etkin motorlar | Orijinal kaynaktaki FT | Sonuç |
|---|---|---|---|---|
| Cucuta Deportivo – Atletico Nacional Medellin | Deplasman kazanır | V1, V2 | 1-0 | KAYIP |
| FC Juarez – Atlante | Deplasman kazanır | V1, V2 | 0-1 | İSABET |
| Al Jeel – Al-Jndal | Ev sahibi kaybetmez | SURPRISE | 0-0 | İSABET |
| Como – Man Utd | Ev sahibi kazanır | EARLY CORE | 4-1 | İSABET |
| Como – Man Utd | Üst 2.5 | PREMIUM O2.5 | 4-1 | İSABET |
| Lille – Galatasaray | Üst 2.5 | PREMIUM O2.5 | 2-4 | İSABET |
| Levante – Athletic Bilbao | KG VAR | BTTS | 3-1 | İSABET |
| Betis – Feyenoord | Üst 2.5 | STABLE O2.5 | 1-0 | KAYIP |
| Club Brugge – Lens | Ev sahibi kazanır | V1, V2, EARLY CORE, EARLY T12, HEAVY | 3-0 | İSABET |
| Inter – Shakhtar | KG VAR | BTTS | 1-0 | KAYIP |
| Sporting Lisbon – Lask Linz | Üst 2.5 | STABLE O2.5 | 2-3 | İSABET |

## Kaynak ve bütünlük sınırlamaları

- Sinyaller: salt okunur `public.sxf_base_signal_events`; maç kimlikleri: `research_archive.fixtures`; FT: `public.live_fixtures` (`match_id_hash` eşleşmesi).
- Her seçimin orijinal motor olay kimlikleri, snapshot zamanı, olay kaydedilme zamanı, oran/para/para payı JSON dosyasında bulunmaktadır.
- Özgün yayın AS_OF ve `scan_id` mevcut değil. Dolayısıyla kesin retrospektif resmî ROI/PnL hesaplanmadı.
- V2'nin son üç saat sürekliliği bağımsız tam snapshot geçmişinden tekrar test edilmedi; bu sürüm motorun kaydettiği etikete dayanır.
- Tam ham piyasa arşivi ve konsantre dokuz kontrol noktası arşivi ayrıca beklemektedir.

## Dosyalar

- Makine okunur ayrıntılar: `archive/2026/10/21/02_outcome_performance/reconstructed_sxf_engine_audit_2026-10-21_v1.json`
- Bu özet: `archive/2026/10/21/02_outcome_performance/reconstructed_sxf_engine_audit_2026-10-21_v1.md`

Oluşturulma zamanı (UTC): 2026-10-22T11:59:49.153Z
