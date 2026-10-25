# CAPİTALE SXF — 17–20 Ekim 2026 Araştırma Partisi

**Tüm maçlar:** 16:00–24:00 TSİ · **Karar:** maç bazlı T-6, eksik tam piyasada T-8 fallback · **Tarama:** `CHECKPOINT_RESEARCH_T6_FALLBACK_T8` · **SXF:** DRAFT v0.4.

| Tarih | Taranan maç | Veri bulunan | Sinyalli maç | Seçim | Motor etiketi | Rapor | JSON |
|---|---:|---:|---:|---:|---:|---|---|
| 17.10.2026 | 259 | 171 | 36 | 38 | 78 | [Rapor](/SXF_arastirma_arsivi/2026/10/17/sxf-research-2026-10-17-t6-fallback-t8-16to24-v1.md) | [JSON](/SXF_arastirma_arsivi/2026/10/17/sxf-research-2026-10-17-t6-fallback-t8-16to24-v1.json) |
| 18.10.2026 | 210 | 156 | 32 | 36 | 69 | [Rapor](/SXF_arastirma_arsivi/2026/10/18/sxf-research-2026-10-18-t6-fallback-t8-16to24-v1.md) | [JSON](/SXF_arastirma_arsivi/2026/10/18/sxf-research-2026-10-18-t6-fallback-t8-16to24-v1.json) |
| 19.10.2026 | 118 | 75 | 10 | 12 | 18 | [Rapor](/SXF_arastirma_arsivi/2026/10/19/sxf-research-2026-10-19-t6-fallback-t8-16to24-v1.md) | [JSON](/SXF_arastirma_arsivi/2026/10/19/sxf-research-2026-10-19-t6-fallback-t8-16to24-v1.json) |
| 20.10.2026 | 94 | 68 | 22 | 26 | 57 | [Rapor](/SXF_arastirma_arsivi/2026/10/20/sxf-research-2026-10-20-t6-fallback-t8-16to24-v1.md) | [JSON](/SXF_arastirma_arsivi/2026/10/20/sxf-research-2026-10-20-t6-fallback-t8-16to24-v1.json) |
| **TOPLAM** | **681** | **470** | **100** | **112** | **222** | — | — |

## Motor etiketleri

| Motor | Toplam |
|---|---:|
| BTTS_YES | 8 |
| EARLY_CORE | 17 |
| EARLY_T12 | 44 |
| HEAVY | 19 |
| PREMIUM_OVER_2_5 | 9 |
| STABLE_OVER_2_5 | 5 |
| SURPRISE_TEAM | 21 |
| V1 | 52 |
| V2 | 47 |
| **Toplam** | **222** |

## Doğrulama

- 17–20 Ekim tarihli araştırma veri seti, `public.fixtures` ile `research_archive.moneyway_snapshots` tablolarından **Supabase SELECT/salt okunur** alınmıştır. GitHub tek kayıt hedefidir.
- T-6 gözlemi mevcutsa T-8'e gerileme yapılmaz; bu dört günün uygun piyasalarda T-8 fallback sayısı sıfırdır.
- EARLY CORE T-72/T-60/T-40/T-24 kökeni ve Retention-55 iptalleri, ham geçmişte gözlenen kayıtlarla doğrulandı; T12 ayrı tetiklemeyi temsil eder.
- V1 ve HEAVY anlık eşiklerle; V2 son 3 saat erişilebilir kaynak gözlemlerinde para payı ve en yüksek olumsuz oran artışıyla değerlendirildi. Veri yetersizse V2 etiketi verilmedi.
- Maç sonuçları/FT/skorlar sinyal üretimi sırasında okunmadı, performans veya ROI değerlendirmesi yapılmadı.
- Tarihsel *yeniden oluşturma* olarak kayıtlıdır; maç gününde yayımlanmış orijinal canlı karar değildir. Ham kaynakta bütün tick'lerin eksiksiz yakalandığı sertifikalı değildir; `NO DATA` sinyal değildir.
- Her günlük JSON `all_fixtures` alanında sinyal bulunmayan tüm fikstürleri ve piyasa kapsamını içerir. Motor etiketleri örtüşebilir, birbirinden bağımsız bahis sayılmaz.
- SURPRISE yalnızca kaybetmeme riski göstergesidir; verilen SXF oranı 1X2 takım galibiyet fiyatıdır.

**Sıradaki parti:** 21–24 Ekim 2026.
