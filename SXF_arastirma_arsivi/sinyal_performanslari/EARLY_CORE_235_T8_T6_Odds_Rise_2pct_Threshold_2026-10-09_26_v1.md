# CAPİTALE SXF — EARLY CORE +%2 T-8→T-6 fiyat artışı eşiği gölge araştırması

**Tarih:** 2026-10-27. **Durum:** EXPLORATORY — NOT PRODUCTION. GitHub SXF v0.4.1 `<=2.35` mevcut kuraldır, başka bir fiyat hareketi veto eşiği yürürlüğe alınmadı.

**Kaynak:** [48 sinyallik kaynak, zaman ve skor denetimli v2](EARLY_CORE_235_T8_T6_Odds_Rise_Magnitude_2026-10-09_26_v2.md). Uygun 9–26 Ekim 81 cap CORE vakasının 48'inde iki nokta karşılaştırılabildi; 33'ü T-8 doğrulama eksikliğinden çıkarıldı. Eski 14 Ekim compact kaynağındaki olası alan kayması nedeniyle doğrulanmamış odds alınmadı.

Ölçüm `100*(selected_odds_T6 / selected_odds_T8 - 1)`; koşul **artış >%2** olunca sinyal veto varsayılır; **=%2 dahil** tutulur. Bu yalnız tarihsel hipotetik yeniden hesaplamadır.

## Özet

| Durum | Kazanan | Kaybeden | İsabet | Ortalama karar SXF oranı |
|---|---:|---:|---:|---:|
| Filtre yok | 31/48 | 17 | %64.6 | 1.693 |
| +%2 tavan uygulanınca kalan | 31/47 | 16 | %66.0 | 1.693 |
| +%2 üstü elenen | 0/1 | 1 | %0.0 | 1.69 |
| +%1,5 tavan uygulanınca kalan | 30/43 | 13 | %69.8 | 1.677 |

## Oranı yükselen bütün 13 maç (%0'dan fazla artış)

| Tarih | Maç → tercih | T8→T6 | Yükseliş | FT | Sonuç | +%2 ile |
|---|---|---|---:|---|---|---|
| 2026-10-23 | Alaves – Malaga → **Alaves** | 1.65→1.69 | %2.424 | 1-1 | LOSS | ELENİR |
| 2026-10-25 | Freiburg – Bayern Munich → **Bayern Munich** | 1.51→1.54 | %1.987 | 1-3 | WIN | KALIR |
| 2026-10-24 | Stevenage – MK Dons → **Stevenage** | 2.06→2.10 | %1.942 | 0-1 | LOSS | KALIR |
| 2026-10-10 | Man Utd – Tottenham → **Man Utd** | 1.77→1.80 | %1.695 | 1-1 | LOSS | KALIR |
| 2026-10-24 | Chelsea – Tottenham → **Chelsea** | 1.99→2.02 | %1.508 | 0-2 | LOSS | KALIR |
| 2026-10-11 | Freiburg – Schalke 04 → **Freiburg** | 1.71→1.73 | %1.170 | 2-1 | WIN | KALIR |
| 2026-10-10 | Chelsea – Bournemouth → **Chelsea** | 1.85→1.87 | %1.081 | 5-1 | WIN | KALIR |
| 2026-10-20 | Stuttgart – Atletico Madrid → **Atletico Madrid** | 2.14→2.16 | %0.935 | 1-1 | LOSS | KALIR |
| 2026-10-26 | Paris St-G – Lyon → **Paris St-G** | 1.37→1.38 | %0.730 | 2-0 | WIN | KALIR |
| 2026-10-10 | Napoli – Frosinone → **Napoli** | 1.50→1.51 | %0.667 | 3-0 | WIN | KALIR |
| 2026-10-22 | Olympiakos – Sparta Prague → **Olympiakos** | 1.55→1.56 | %0.645 | 1-0 | WIN | KALIR |
| 2026-10-20 | Porto – PSV → **Porto** | 1.58→1.59 | %0.633 | 0-1 | LOSS | KALIR |
| 2026-10-11 | Lazio – AC Monza → **Lazio** | 1.74→1.75 | %0.575 | 3-1 | WIN | KALIR |

## Kapsama ve istatistik uyarıları

- Yalnız 1/48 eleniyor; güçlü istatistiksel eşik kanıtı yok.
- +%1,5 ile +%2 arasında 4 ek maç var: Manchester United–Tottenham (L), Stevenage–MK Dons (L), Chelsea–Tottenham (L), Freiburg–Bayern (W). Bunların 3'ü kayıp ve 1'i kazanmış.
- 12–19 Ekim 33 sinyalde doğrulanmış karşılaştırılabilir T-8 bulunmadı; 9–11 Ekim 13 satırda kaynak T-8 timestamp'i tam kanıtlı değil (tier B). 20–26 Ekim 35 satır tam tarihli ve üçlü piyasası kontrol edildi (tier A).
- İstatistik sonuçlar görülerek türetilen post-hoc keşiftir, prospektif filtre performansı kanıtlanamaz.
- Yalnız SXF metodu kullandık, 2,35 mevcut cap sabit ve ham tarihsel arşiv değişmedi.