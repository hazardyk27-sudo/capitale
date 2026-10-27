# CAPİTALE SXF — EARLY CORE T-72 → T-24 oran değişimi araştırması

**Dönem:** 9–26 Ekim 2026 (TSİ). **Çalışma:** 27 Ekim 2026. **Durum:** sadece araştırma; canlı motor ve kaynak arşivler DEĞİŞMEDİ.

**Kaynak:** GitHub `archive/2026/10/DD/05_pratik_arsiv/checkpoints.jsonl.gz`. Frozen EARLY CORE sinyalleri: `loss_features_2026-10-09_16_v1.json`, `loss_features_2026-10-17_25_v1.json`, 26 Ekim frozen signal. EARLY CORE 1X2 karar oranı ≤2,35 dahil. T-72 ve T-24 checkpoint'teki *seçilen taraf* odds. Kaynak gözlemi gecikmesi en fazla 10 dakika. `100*(T24/T72-1)` (+ fiyat yükseldi, − fiyat düştü).

## Kapsam

- 81 uygun EARLY CORE sinyali toplam 56W/25L (%69,14).
- İki nokta karşılaştırılabilen **53** sinyal: **32W/21L, %60,38**. 36 adet doğal alanlı A sınıfı; 17 eski kolon kaymasıyla bağımsız T24 ölçümleriyle kontrol edilmiş B sınıfı.
- **28 eksik sinyalin 24'ü kazandı, 4'ü kaybetti**. Bu çok yüksek kaynak erişim yanlılığı demektir; bu nedenle 53'teki sonucun tüm 81'e genellenmesi hatalı olur.

## Eşik taraması

| Eleme varsayımı | Elenen kayıp | Elenen kazanan | Kalan kazanma/toplam | Kalan başarı |
|---|---:|---:|---:|---:|
| Filtre yok | – | – | 32/53 | %60.38 |
| Sadece artış >%1 | 7 | 10 | 22/36 | %61.11 |
| Sadece artış >%1.5 | 7 | 7 | 25/39 | %64.10 |
| Sadece artış >%2 | 6 | 7 | 25/40 | %62.50 |
| Sadece artış >%3 | 4 | 3 | 29/46 | %63.04 |
| Sadece artış >%3.5 | 3 | 3 | 29/47 | %61.70 |
| Sadece artış >%4 | 1 | 2 | 30/50 | %60.00 |
| Sadece artış >%4.5 | 0 | 0 | 32/53 | %60.38 |

**Artış >%3**: 7 elenen = **4 kayıp, 3 kazanan**. Kalan **29W/46 = %63,04** (+2,66 yüzde puan vs 53 maç filtresiz). >%1,5: 7L/7W eleniyor; kalan 25/39 (%64,10) fakat çok kazanan kaybı var. >%4: 2L/2W; kalan 30/49 (%61,22). **>%4,5 hiçbir sinyal yok (10 dk kaynak filtresinden sonra).**

## %3'ten fazla yükselen bütün sinyaller

| Tarih | Maç → seçilen | T72→T24 | Yükseliş | Sonuç |
|---|---|---|---:|---|
| 2026-10-22 | Lech Poznan – Sunderland → **Sunderland** | 1.70→1.77 | %4.12 | LOSS |
| 2026-10-25 | Udinese – AC Milan → **AC Milan** | 1.73→1.80 | %4.05 | WIN |
| 2026-10-25 | Lecce – Juventus → **Juventus** | 1.49→1.55 | %4.03 | WIN |
| 2026-10-24 | Stevenage – MK Dons → **Stevenage** | 2.00→2.08 | %4.00 | LOSS |
| 2026-10-13 | Bristol City – Blackburn → **Bristol City** | 2.10→2.18 | %3.81 | LOSS |
| 2026-10-25 | Freiburg – Bayern Munich → **Bayern Munich** | 1.41→1.46 | %3.55 | WIN |
| 2026-10-24 | Chelsea – Tottenham → **Chelsea** | 1.76→1.82 | %3.41 | LOSS |

## Düşüşün ve iki yönlü sert hareketin testi

| Mutlak değişim eşiği | Elenen kayıp | Elenen kazanan | Kalan başarı |
|---|---:|---:|---:|
| ±%1.5 üstü | 15 | 17 | 15/21 = %71.43 |
| ±%2 üstü | 12 | 16 | 16/25 = %64.00 |
| ±%3 üstü | 9 | 10 | 22/34 = %64.71 |
| ±%4 üstü | 5 | 7 | 25/41 = %60.98 |
| ±%5 üstü | 2 | 2 | 30/49 = %61.22 |

**Ekonomik/mechanistic yorum:** 48 saatlik ilk yönlü hareket güçlü tekil fiyat-veto sinyali değil. Oranı yükselen maçların içinde çok kazanan var. Çok sert düşüşlerde de hem kazanan hem kaybeden görülüyor. Kayıpları düşüren eşikler, tarihi sonuçlara bakılarak seçildiğinden üretim garantisi değil.

## Kapsam eksikleri

- 10,11,17,18 Ekim GitHub Contents API büyük .gz dosyalarında içerik döndürmedi (22 sinyal)
- 15 Ekim kayıtlarda eksik/UID uyuşmazlığı veya T24 13.05 dk gecikme (4 sinyal)
- 22 Ekim Bournemouth–AC Milan T72 seçilen taraf odds boş (1 sinyal)
- 23 Ekim Stuttgart–Mgladbach T72 kaynak noktası 21.33 dakika gecikmeli (1 sinyal)

13–15 Ekim eski Pratik Arşiv dosyalarında tarihsel saklama sütun sırası kayması mevcuttur. Kaynak dosyaları düzeltilmedi/değiştirilmedi; yalnız fiyat karşılaştırması için doğrulanabilir seçilen taraf alanı okundu. Tam 3-yollu odds doğrulaması B sınıfında yok.

**Karar:** T-72→T-24 için yeni veto motoruna alınmamalı; >%3 yükseliş yalnız **shadow / ileriye dönük gözlem adayı** olabilir. Mevcut EARLY CORE v0.4.1 üst fiyat tavanı 2.35 değişmedi.

**Tüm 53 satır, kaynak yolları, eşik grupları:** [JSON araştırma dosyası](EARLY_CORE_T72_T24_PRACTICAL_2026-10-09_26_RESEARCH_v1.json).