# CAPİTALE SXF EARLY CORE — T-24 → T-8 oran hareketi, PRATİK ARŞİV, 9–26 Ekim 2026
**Araştırma:** 27 Ekim 2026; **durum:** EXPLORATORY_NOT_VALIDATED / NO_PRODUCTION_CHANGE.
**Kapsam:** yalnız orijinal EARLY CORE 1X2, frozen seçimde SXF oranı ≤2,35. Early T12, diğer motorlar ayrı.
**Birincil kaynak:** GitHub `archive/2026/10/DD/05_pratik_arsiv/checkpoints.jsonl.gz`. Asıl arşivlere hiçbir değişiklik yapılmadı. Sonuç/orijinal motor etiketi donmuş `loss_features_2026-10-09_16_v1.json`, `loss_features_2026-10-17_25_v1.json`, 26 Ekim frozen signal dosyalarından.
**Tanım:** `change_pct = 100*(selected_odds_T8/selected_odds_T24-1)`. Pozitif odds yükselişi; negatif odds düşüşü. Mutlak eşikte `abs(change_pct)>threshold`, **eşitlikte sinyal tutulur**.

## Kapsama ve temel sonuç
**9–26 Ekim tüm uygun EARLY CORE:** 81 sinyal, 56 kazanan, 25 kaybeden (%69,14).
**PRATİK verisiyle iki kontrol noktası eşleşen:** 48 sinyal, 28 kazanan, 20 kaybeden (%58,33); **eksik 33** sinyalin 28 kazananı ve 5 kaybedeni var. **Eksik grupta kazanan oranı çok yüksek olduğundan örneklemde SEÇİLİM YANLILIĞI BÜYÜKTÜR**. Sonuçları 81 sinyale genelleme.
**Veri kalite ayrımı:** A = Pratik 1X2 native odds (38 sinyal); B = Pratik'te 12/14/15 Ekim sütunları kaydığı için bağımsız T24/orijinal scan ile teyit edilmiş seçili odds alanı yorumu (10 sinyal); B'de tam 3-yönlü de-vig doğrulanmadı. Hiçbir arşiv dosyası onarılmadı.

## Artış bazlı ve iki yönlü filtre kıyaslaması
Elenen sütununda sıralama **kayıp/kazanan**. Kalan isabet **WIN/toplam**.
| Eşik | Yalnız artışla elenen L/W | Yalnız artış filtresi kalan | Mutlak hareketle elenen L/W | Mutlak hareket filtresi kalan |
|---|---:|---:|---:|---:|
| 1% | 6L/12W | 16/30 (%53,33) | 17L/22W | 6/9 (%66,67) |
| 1,5% | 6L/10W | 18/32 (%56,25) | 16L/17W | 11/15 (%73,33) |
| 2% | 5L/8W | 20/35 (%57,14) | 13L/12W | 16/23 (%69,57) |
| 3% | 3L/5W | 23/40 (%57,50) | 8L/9W | 19/31 (%61,29) |
| 4% | 3L/4W | 24/41 (%58,54) | 8L/5W | 23/35 (%65,71) |
| 4,5% | 3L/3W | 25/42 (%59,52) | 7L/4W | 24/37 (%64,86) |
| 5% | 3L/2W | 26/43 (%60,47) | 6L/3W | 25/39 (%64,10) |
| 6% | 2L/1W | 27/45 (%60,00) | 4L/2W | 26/42 (%61,90) |
| 7% | 2L/0W | 28/46 (%60,87) | 3L/0W | 28/45 (%62,22) |
| 8% | 1L/0W | 28/47 (%59,57) | 2L/0W | 28/46 (%60,87) |

## Mutlak %4 üzerinde elenen 13 maç
| Tarih | Maç → seçilen | T24 → T8 | Değişim | Sonuç |
|---|---|---|---:|---|
| 2026-10-24 | Chelsea – Tottenham → **Chelsea** | 1,82 → 1,99 | +9,34% | KAYBETTİ |
| 2026-10-22 | Dinamo Zagreb – NEC Nijmegen → **Dinamo Zagreb** | 1,70 → 1,56 | -8,24% | KAYBETTİ |
| 2026-10-14 | Feyenoord – Como → **Como** | 1,96 → 2,10 | +7,14% | KAYBETTİ |
| 2026-10-14 | Lask Linz – Liverpool → **Liverpool** | 1,34 → 1,43 | +6,72% | KAZANDI |
| 2026-10-22 | Juventus – Rennes → **Juventus** | 1,61 → 1,51 | -6,21% | KAYBETTİ |
| 2026-10-21 | Club Brugge – Lens → **Club Brugge** | 2,10 → 1,97 | -6,19% | KAZANDI |
| 2026-10-23 | Alaves – Malaga → **Alaves** | 1,75 → 1,65 | -5,71% | KAYBETTİ |
| 2026-10-21 | Sporting Lisbon – Lask Linz → **Sporting Lisbon** | 1,23 → 1,30 | +5,69% | KAYBETTİ |
| 2026-10-14 | Aston Villa – Fenerbahce → **Aston Villa** | 1,65 → 1,74 | +5,45% | KAZANDI |
| 2026-10-25 | Udinese – AC Milan → **AC Milan** | 1,80 → 1,89 | +5,00% | KAZANDI |
| 2026-10-14 | Man City – Paris St-G → **Man City** | 2,20 → 2,10 | -4,55% | KAYBETTİ |
| 2026-10-25 | Toulouse – ESTAC Troyes → **Toulouse** | 1,64 → 1,57 | -4,27% | KAYBETTİ |
| 2026-10-24 | Lazio – Parma → **Lazio** | 1,46 → 1,52 | +4,11% | KAZANDI |

**Bulgular:** Yalnız artışta >5% eleme **3 kayıp/2 kazanan** götürüyor; kalan 26/43 (%60,47). Çift yönlü >4% eleme **8 kayıp/5 kazanan** götürüyor; kalan 23/35 (%65,71), ilk %58,33'e kıyasla +7,38 yüzde puan. Çift yönlü >5% eleme 6 kayıp/3 kazanan; kalan 25/39 (%64,10). >7% mutlak yalnız 3 kayıp eliyor ama n=3. Bu rakamlar **eşik görerek seçildi, ileriye yönelik kural kanıtı değildir**.

## Tarih ve kaynak kalitesi
- 9–19 Ekim karşılaştırılabilir 13: 7 win/6 loss. 20–26 Ekim karşılaştırılabilir 35: 21 win/14 loss. 11 Ekim'de legacy origin CSV+frozen T8 üzerinden ek 2 win kaydı bulunuyor, fakat PRATİK çift kaynak çalışmasına katılmadı. İkisi eklenirse 50 içinde 30W/20L, mutlak >4 kalan 25W/37 (%67,57), fakat ana metrik **48** kalmalıdır.
- 10 ve 11 Ekim ile 17 ve 18 Ekim Pratik gzip dosyaları GitHub Contents API’nin 1 MB limitini aşıp içeriksiz döndü; ilgili fiyat kayıtlarını **varsaymadık**. 13 Ekim yedi sinyalde Pratik T8 missing. 15 Ekim dört diğer eşleşme eksik veya T24 tazelik sınırı aşılıyor.
- Pratik checkpoint çiftleri AS_OF öncesi kaynak gözlemlerinden. T-24/T-8 fiyatları kaynak saatine göre uygun; **T8'den sonraki fiyat kullanılmadı**. A statüsü source price coherence anlamına gelir, bağımsız FT doğrulama anlamına gelmez.
- Veriler tarihsel gözlemseldir; rakip kalitesi, favori fiyatı, lig etkisi ve motorun ilk oluşma horizonları kontrol edilmemiştir. Sert fiyat hareketini tek başına veto etmek gelecekte zarar verebilir.
- **T-8 → T-6 için önceki >%1,5 araştırması bambaşka bir zaman aralığıdır**; bu raporun eşikleriyle karıştırılmamalı.
- **Kanonik SXF v0.4.1 EARLY CORE ≤2,35 fiyat tavanı değişmedi; yeni veto motorlara, Supabase'e veya deploy'a uygulanmadı.**

## Eksik örneklemin gün dağılımı
| Tarih | Eksik | Kazandı | Kaybetti |
|---|---:|---:|---:|
| 2026-10-10 | 5 | 4 | 1 |
| 2026-10-11 | 6 | 6 | 0 |
| 2026-10-13 | 7 | 5 | 2 |
| 2026-10-15 | 4 | 4 | 0 |
| 2026-10-17 | 7 | 5 | 2 |
| 2026-10-18 | 4 | 4 | 0 |

**Sinyal kayıtlarının tamamı ve eşik sweep'i:** eşlik eden [JSON raporu](EARLY_CORE_T24_T8_PRACTICAL_2026-10-09_26_RESEARCH_v1.json).
