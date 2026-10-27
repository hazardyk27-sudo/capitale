# SXF 26 Ekim 2026 — Sonuçlar ve Motor İstatistikleri

> 26 Ekim 16:00–24:00 TSİ T-6/T-8 **tarihsel araştırma** taramasının sonuçlandırılmasıdır. Özgün sinyal dosyası değiştirilmedi. 90 dakika FT sonuçları SXF `public.live_fixtures` içinden `match_id_hash`, fixture UID ve takım eşleşmesiyle doğrulandı; **dış kaynaklardan tamamı bağımsız doğrulanmış değildir**.

**18/18 FT sonuçlandı; 10 isabet, 8 kayıp. SURPRISE non-loss metriğidir.**

## Motor başarı oranları

| Motor | Kazanan / FT | Başarı | Ort. SXF oranı |
|---|---:|---:|---:|
| EARLY_CORE | 4/4 | %100,0 | 1,65 |
| EARLY_T12 | 4/4 | %100,0 | 1,63 |
| V1 | 3/4 | %75,0 | 1,76 |
| V2 | 1/1 | %100,0 | 1,54 |
| HEAVY | 0/0 | — | — |
| STABLE_OVER_2_5 | 0/1 | %0,0 | 1,41 |
| PREMIUM_OVER_2_5 | 1/1 | %100,0 | 1,70 |
| BTTS_YES | 0/1 | %0,0 | 1,67 |
| SURPRISE_TEAM | 2/7 | %28,6 | 3,49 |

## Piyasa bazında

| Piyasa | Kazanan / FT | Başarı |
|---|---:|---:|
| 1X2 | 7/8 | %87,5 |
| OVER_2_5 | 1/2 | %50,0 |
| BTTS | 0/1 | %0,0 |
| SURPRISE_NONLOSS_RISK | 2/7 | %28,6 |

## Seçimlerin tüm 90 dakika sonuçları

| Saat / Maç | Seçim | Motorlar | SXF oranı | FT | Sonuç |
|---|---|---|---:|---|---|
| 16:00 Mladost Zdralovi – Jadran Luka Ploce | SURPRISE → Jadran Luka Ploce | SURPRISE_TEAM | 3,20 | 1-0 | ❌ |
| 16:30 Sporting Ben Arous – AS Megrine | SURPRISE → AS Megrine | SURPRISE_TEAM | 4,10 | 1-0 | ❌ |
| 16:45 Neftchi Fargona – Al-Ittihad | Al-Ittihad | EARLY_T12, V1 | 1,83 | 1-2 | ✅ |
| 18:00 Lokomotiv Plovdiv – Slavia Sofia | Lokomotiv Plovdiv | V1 | 2,24 | 0-0 | ❌ |
| 18:00 Al Bukayriyah – Hajer Club | SURPRISE → Hajer Club | SURPRISE_TEAM | 3,25 | 2-1 | ❌ |
| 18:30 SC Dimona – Hapoel Rishon Lezion | SURPRISE → SC Dimona | SURPRISE_TEAM | 3,85 | 2-3 | ❌ |
| 19:00 Rizespor – Trabzonspor | Trabzonspor | EARLY_CORE, EARLY_T12 | 1,95 | 3-4 | ✅ |
| 19:00 Pirata FC – Union Comercio | SURPRISE → Pirata FC | SURPRISE_TEAM | 3,20 | 1-0 | ✅ |
| 19:00 Nueva Chicago – San Martin de San Juan | SURPRISE → San Martin de San Juan | SURPRISE_TEAM | 3,70 | 1-1 | ✅ |
| 20:00 Oppsal – Lyn 2 | Oppsal | V1 | 1,44 | 3-0 | ✅ |
| 20:00 Våg – Odd II | SURPRISE → Odd II | SURPRISE_TEAM | 3,10 | 4-2 | ❌ |
| 21:00 ACS Sepsi OSK – Universitatea Craiova | Universitatea Craiova | V1, V2 | 1,54 | 0-5 | ✅ |
| 21:45 Santa Clara – Benfica | Benfica | EARLY_CORE, EARLY_T12 | 1,35 | 1-2 | ✅ |
| 21:45 Santa Clara – Benfica | Üst 2.5 | PREMIUM_OVER_2_5 | 1,70 | 1-2 | ✅ |
| 22:30 Paris St-G – Lyon | Paris St-G | EARLY_CORE, EARLY_T12 | 1,38 | 2-0 | ✅ |
| 22:30 Paris St-G – Lyon | KG VAR | BTTS_YES | 1,67 | 2-0 | ❌ |
| 22:30 Paris St-G – Lyon | Üst 2.5 | STABLE_OVER_2_5 | 1,41 | 2-0 | ❌ |
| 23:00 Sevilla – Osasuna | Sevilla | EARLY_CORE | 1,90 | 2-0 | ✅ |

## Kaynak ve kayıt bütünlüğü

- [26 Ekim önceden arşivlenmiş tarama](sxf-research-2026-10-26-t6-fallback-t8-16to24-v1.md) değiştirilmedi.
- Sonuçların tamamı `public.fixtures` → `match_id_hash` → `public.live_fixtures` FT eşleşmesine dayalıdır; ilk `live_fixtures.fixture_uid` alanı her kayıtta dolu olmayabilir.
- Snapshot / AS_OF sonradan kazanılan sonuçlardan etkilenmedi. GitHub kaydının 26 Ekim'de maç öncesi yayımlandığı iddia edilmez.
- SURPRISE'da takım kazanır SXF fiyatı, **yenilmeme bahis fiyatı değildir**; SURPRISE için bahis ROI'si üretilmemiştir.

