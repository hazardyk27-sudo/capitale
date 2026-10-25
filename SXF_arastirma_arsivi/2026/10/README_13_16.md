# CAPİTALE SXF — 13–16 Ekim 2026 Araştırma Partisi

**Maç saati:** 16:00–24:00 TSİ · **Mod:** `CHECKPOINT_RESEARCH_T6_FALLBACK_T8` · **SXF:** v0.4 DRAFT.

| Tarih | Maç | Veri bulunan | Sinyalli maç | Seçim | Motor etiketi | Rapor | JSON |
|---|---:|---:|---:|---:|---:|---|---|
| 13.10.2026 | 147 | 44 | 16 | 19 | 33 | [Rapor](/SXF_arastirma_arsivi/2026/10/13/sxf-research-2026-10-13-t6-fallback-t8-16to24-v1.md) | [JSON](/SXF_arastirma_arsivi/2026/10/13/sxf-research-2026-10-13-t6-fallback-t8-16to24-v1.json) |
| 14.10.2026 | 90 | 70 | 16 | 22 | 36 | [Rapor](/SXF_arastirma_arsivi/2026/10/14/sxf-research-2026-10-14-t6-fallback-t8-16to24-v1.md) | [JSON](/SXF_arastirma_arsivi/2026/10/14/sxf-research-2026-10-14-t6-fallback-t8-16to24-v1.json) |
| 15.10.2026 | 99 | 60 | 21 | 25 | 54 | [Rapor](/SXF_arastirma_arsivi/2026/10/15/sxf-research-2026-10-15-t6-fallback-t8-16to24-v1.md) | [JSON](/SXF_arastirma_arsivi/2026/10/15/sxf-research-2026-10-15-t6-fallback-t8-16to24-v1.json) |
| 16.10.2026 | 140 | 114 | 19 | 19 | 30 | [Rapor](/SXF_arastirma_arsivi/2026/10/16/sxf-research-2026-10-16-t6-fallback-t8-16to24-v1.md) | [JSON](/SXF_arastirma_arsivi/2026/10/16/sxf-research-2026-10-16-t6-fallback-t8-16to24-v1.json) |
| **TOPLAM** | **476** | **288** | **72** | **85** | **153** | — | — |

**Karar kuralı:** Her maç kendi başlama zamanına göre T-6'da değerlendirilir. 1X2, Üst/Alt 2.5, BTTS için tam T-6 piyasası yoksa T-8 fallback denenir. Dört günde yayımlanan seçimler için fallback gerekmedi. EARLY başlangıçları T-72/60/40/24/12; CORE Retention-55 ve V2'nin son 3 saatlik pay/oran geçmişi, mevcut ham araştırma snapshot'larıyla ayrıca denetlenmiştir.

**Kaynak:** `public.fixtures` + `research_archive.moneyway_snapshots` (Supabase sadece SELECT). 13 Ekim T-6 1X2 tam piyasa sayısı araştırma arşivinde 36, public canlı kaynakta 20; bu nedenle ham araştırma kaynağı kullanıldı. Günlerin tamamında henüz elde olmayan piyasa verisi var; `with_market_data` oranı tam fikstür/tüm piyasa bütünlüğü anlamına gelmez.

**Sınırlamalar:** Arşiv geri dönük araştırmadır, o gün canlı yayınlanan karar raporu değildir. Kaynakta saklanmamış tick bulunabilir; Retention ve V2 kontrolleri eldeki gözlem tarihçesi için geçerlidir. FT/skor bilgisi seçimlerde kullanılmadı, ROI/performans hesaplanmadı. Aynı piyasa seçiminin birden fazla motor etiketi bağımsız bahis sayılmaz; SURPRISE yenilmeme riskidir, 1X2 galibiyet fiyatı yenilmeme fiyatı değildir.

**Sıradaki parti:** 17–20 Ekim 2026.
