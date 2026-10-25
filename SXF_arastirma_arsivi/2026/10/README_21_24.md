# CAPİTALE SXF — 21–24 Ekim 2026 Araştırma Partisi

**Aralık:** Her gün 16:00–24:00 TSİ · **T-6** maç başına karar, piyasa eksikse **T-8** fallback · **SXF:** DRAFT v0.4 · **Mod:** `CHECKPOINT_RESEARCH_T6_FALLBACK_T8`.

| Tarih | Taranan maç | Veri bulunan | Sinyalli maç | Seçim | Motor etiketi | Rapor | JSON |
|---|---:|---:|---:|---:|---:|---|---|
| 21.10.2026 | 60 | 46 | 9 | 10 | 15 | [Rapor](/SXF_arastirma_arsivi/2026/10/21/sxf-research-2026-10-21-t6-fallback-t8-16to24-v1.md) | [JSON](/SXF_arastirma_arsivi/2026/10/21/sxf-research-2026-10-21-t6-fallback-t8-16to24-v1.json) |
| 22.10.2026 | 76 | 61 | 32 | 35 | 81 | [Rapor](/SXF_arastirma_arsivi/2026/10/22/sxf-research-2026-10-22-t6-fallback-t8-16to24-v1.md) | [JSON](/SXF_arastirma_arsivi/2026/10/22/sxf-research-2026-10-22-t6-fallback-t8-16to24-v1.json) |
| 23.10.2026 | 170 | 123 | 16 | 16 | 28 | [Rapor](/SXF_arastirma_arsivi/2026/10/23/sxf-research-2026-10-23-t6-fallback-t8-16to24-v1.md) | [JSON](/SXF_arastirma_arsivi/2026/10/23/sxf-research-2026-10-23-t6-fallback-t8-16to24-v1.json) |
| 24.10.2026 | 290 | 226 | 51 | 54 | 92 | [Rapor](/SXF_arastirma_arsivi/2026/10/24/sxf-research-2026-10-24-t6-fallback-t8-16to24-v1.md) | [JSON](/SXF_arastirma_arsivi/2026/10/24/sxf-research-2026-10-24-t6-fallback-t8-16to24-v1.json) |
| **TOPLAM** | **596** | **456** | **108** | **115** | **216** | — | — |

## Günlük motor etiketleri

| Motor | 21 Eki | 22 Eki | 23 Eki | 24 Eki | Toplam |
|---|---:|---:|---:|---:|---:|
| BTTS_YES | 2 | 3 | 2 | 5 | 12 |
| EARLY_CORE | 2 | 9 | 2 | 6 | 19 |
| EARLY_T12 | 3 | 17 | 4 | 17 | 41 |
| HEAVY | 1 | 9 | 3 | 5 | 18 |
| PREMIUM_OVER_2_5 | 2 | 2 | 0 | 5 | 9 |
| STABLE_OVER_2_5 | 2 | 4 | 0 | 1 | 7 |
| SURPRISE_TEAM | 1 | 5 | 2 | 19 | 27 |
| V1 | 1 | 17 | 10 | 19 | 47 |
| V2 | 1 | 15 | 5 | 15 | 36 |
| **TOPLAM** | 15 | 81 | 28 | 92 | **216** |

## Veri kaynağı ve denetim

- **21–22 Ekim:** `research_archive.moneyway_snapshots` içinden salt-okunur tarama.
- **23 Ekim:** `research_archive` büyük sorguda zaman aşımına takıldı. `public.moneyway_snapshots` kaynaklı tam T-6 1X2 sayısı **112**, araştırma arşivinde de **112**. Diğer piyasalarda satır satır tam eşitlik sertifikalı değil.
- **24 Ekim:** `research_archive.moneyway_snapshots` sadece **5 farklı maç kimliği** içeriyordu, bu nedenle `public.moneyway_snapshots` kullanıldı. T-6 1X2'de **203 tam piyasa** bulundu; eksik veri tespit edildi ve eksik maçlar sinyalli sayılmadı.
- CORE Retention-55 ve V2'nin önceki 3 saatlik pay/oran geçmişi **erişilebilir ham gözlemler** üzerinden denetlendi. Kaydedilmeyen gözlemler bulunmayacağını iddia etmiyoruz.
- Her günün JSON'u tüm fikstürleri, sinyalsiz maçları, kaynak zamanlarını, reddedilen V2 ve retention kırılmalarını kapsar. PREMIUM, STABLE'ın yerine geçer; V2 ve HEAVY, V1'e bağlı etiketlerdir.
- **Tarihsel yeniden oluşturma:** Orijinal canlı DYNAMIC_AS_OF tarama değildir. Skorlar/FT/maç sonrası veriler sinyal seçimine dahil edilmedi.
- SURPRISE yenilmeme direnci göstergesidir; fiyat takım kazanır 1X2 SXF oranıdır.
- **Bu partide maç sonuçları/performance değerlendirmesi yapılmadı.**

**Sıradaki tarihler:** 25 Ekim; 26 Ekim'in maçları henüz oynanmamış olduğundan bunlar geçmişe dönük araştırma olarak ancak ilgili karar zamanı geldikten sonra ele alınabilir.
