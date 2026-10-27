# CAPİTALE SXF — EARLY T-12 performans denetimi (9–26 Ekim 2026)

**Araştırma:** 28 Ekim 2026. **Durum:** araştırma; mevcut SXF motoru, Retention ve Pratik Arşiv kaynakları değiştirilmedi.

## Kapsam, sinyal tanımı ve denetim
EARLY T-12, maçtan ~12 saat önce ev/deplasman takımında top-money, seçilen para >= £1.000 ve seçilen 1X2 para payı >=%80 durumunda tetiklenir. EARLY CORE Retention-55 ilk-oluşum kuralını miras almaz. Kaydedilmiş tarihsel sinyalin karar anı T6 fallback T8 checkpoint; **karar anındaki share ile T12 ilk sinyal share birbirine karıştırılmamalıdır**. Bir maçtaki birden çok eşzamanlı motor etiketi **bir** 1X2 tercihidir.

9–25 Ekim donmuş seçimi: **163 kayıt / 162 sonucu bilinen / 102W-60L = %62,96**, **1 UNVERIFIED**. 26 Ekim: **4 kayıt / 4W-0L** (3 frozen CORE confirmed, Neftchi Fargona–Al-Ittihad deplasman 1–2 sonucu bağımsız doğrulandı).

**Toplam 9–26 Ekim: 106/166 (%63.86)**; 1 doğrulanmamış maç ayrıca bekliyor. Ortalama karar SXF oranı 1.788. Teorik eşit birimli SXF-oran ROI %10.39; bahislerin gerçekten bu oranlardan uygulanabildiği kanıtı değildir.

## Tarih ve motor karşılaştırması

| Grup | Kazanan / Sonuçlanan | İsabet | Ortalama karar oranı | Teorik ROI |
|---|---:|---:|---:|---:|
| 9–16 Ekim | 44/63 (%69.84) | 69.84% | 1.825 | 20.84% |
| 17–26 Ekim | 62/103 (%60.19) | 60.19% | 1.765 | 4% |
| T12 etiketi tek başına | 24/35 (%68.57) | 68.57% | 1.911 | 23.89% |
| T12 + EARLY CORE (başka motorlar da olabilir) | 41/59 (%69.49) | 69.49% | 1.705 | 14.98% |
| T12, CORE olmadan | 65/107 (%60.75) | 60.75% | 1.834 | 7.86% |
| T12 + HEAVY (CORE olsun/olmasın) | 42/58 (%72.41) | 72.41% | 1.73 | 24.28% |
| T12, HEAVY olmadan | 64/108 (%59.26) | 59.26% | 1.819 | 2.94% |
| T12 + HEAVY, CORE olmadan | 15/19 (%78.95) | 78.95% | 1.736 | 36% |
| T12+V1+V2, CORE/HEAVY olmadan | 21/44 (%47.73) | 47.73% | 1.824 | -15.57% |
| Karar oranı <2,00 | 83/122 (%68.03) | 68.03% | 1.612 | 7.88% |

*Başarı sütunu, yüzdeli Kazanan/Sonuçlanan sütununu tekrar eder; ROI, yalnız tarihsel SXF fiyatı üzerinden hipotetiktir. Diğer motor etiketleri bağımsız oy veya bahis değildir.*

## GÜNLÜK T12 performansı

| Tarih | W / sonuçlanan | İsabet |
|---|---:|---:|
| 2026-10-09 | 1/4 | %25 |
| 2026-10-10 | 12/17 | %70.59 |
| 2026-10-11 | 7/7 | %100 |
| 2026-10-12 | 4/4 | %100 |
| 2026-10-13 | 3/7 | %42.86 |
| 2026-10-14 | 4/5 | %80 |
| 2026-10-15 | 10/15 (+1 bilinmeyen) | %66.67 |
| 2026-10-16 | 3/4 | %75 |
| 2026-10-17 | 12/17 | %70.59 |
| 2026-10-18 | 7/11 | %63.64 |
| 2026-10-19 | 2/3 | %66.67 |
| 2026-10-20 | 6/13 | %46.15 |
| 2026-10-21 | 1/3 | %33.33 |
| 2026-10-22 | 12/17 | %70.59 |
| 2026-10-23 | 0/4 | %0 |
| 2026-10-24 | 8/17 | %47.06 |
| 2026-10-25 | 10/14 | %71.43 |
| 2026-10-26 | 4/4 | %100 |

## Çıkarım ve temkin

- T12 tek başına bile 24/35 %68,6; fakat bu 35 maç, 163'ün küçük ve seçimle farklılaşan alt grubudur.
- T12 + HEAVY, birlikte kullanılan 58 örnekte 42/58 %72,4, **HEAVY yokken** 64/108 %59,3. Bu 58'in 39'u CORE'la da örtüşür; HEAVY'ye nedensellik atfedilemez.
- En dikkat çekici zayıf nokta: T12 + V1 + V2 **ancak HEAVY ve CORE yoksa** 21/44 %47,7. Karar oranı ortalaması ~1,82; çoklu etiket sayısı kalite değildir.
- Karar oranı <2.0, 83/122 (%68.03); kazanma doğası gereği düşük favori oranlarıyla artar ve fiyat başına kârlılığı garanti etmez.
- 15 Ekim Sportivo Luqueño–Cerro Porteño seçimi UNVERIFIED kalır. Birbirine benzeyen **10 Ekim** resmi maçının sonucunu 15 Ekim kaydına taşımamak gerekir. Sinyal geçmişi düzeltilemez.
- Yeni EARLY T-12 eşik/filtre ve canlı motor kararı verilmemiştir. Gerekirse HEAVY kesişimi yalnız **shadow hipotezi** olarak ileriye dönük kontrol edilir.

Kaynak seçimi, veri ayrımı ve tüm 167 seçim satırı JSON'da saklıdır: [EARLY T12 9–26 Ekim JSON](EARLY_T12_PERFORMANCE_2026-10-09_26_RESEARCH_v1.json).
