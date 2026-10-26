# CAPİTALE SXF Araştırma — 25–26 Ekim 2026

**Maç aralığı:** 16:00–24:00 TSİ · **T-6 esas, eksik T-6 piyasasında T-8 fallback** · **Metodoloji:** SXF DRAFT v0.4 `CHECKPOINT_RESEARCH_T6_FALLBACK_T8`.

| Tarih | Durum | Taranan maç | En az bir piyasada veri | Sinyalli maç | Seçim | Motor etiketi |
|---|---|---:|---:|---:|---:|---:|
| **25 Ekim** | RECONSTRUCTED_ARCHIVED | 188 | 152 | 38 | 39 | 78 |
| **26 Ekim** | PENDING_ASOF_NOT_REACHED | **66 fikstür adayı** | — | — | — | — |

## 25 Ekim raporları

- [25 Ekim ayrıntılı maç/motor raporu](25/sxf-research-2026-10-25-t6-fallback-t8-16to24-v1.md)
- [25 Ekim JSON: tüm maç kapsamı, sinyal ve motor kanıtları](25/sxf-research-2026-10-25-t6-fallback-t8-16to24-v1.json)

25 Ekim için veri kaynağı `public.moneyway_snapshots`: `research_archive.moneyway_snapshots` içinde 25 Ekim'e ait ham snapshot bulunmadığı tespit edilmiştir. T-6 tam piyasa kapsamı: 1X2 141, Üst/Alt 110, BTTS 72. CORE retention ve V2 üç saatlik kontrolü mevcut ham gözlemlerde denetlendi; kaynak yakalama bütünlüğü bağımsız sertifikalı değildir. Başarı/sonuç performansı hesaplanmadı.

## 26 Ekim neden tamamlanmadı?

**26 Ekim 03:03:15 TSİ** durumunda 16:00–24:00 aralığı için **66 aday fikstür** vardı; maç başına belirlenen ilk T-8 kararı saat **08:00 TSİ**, ilk T-6 kararı saat **10:00 TSİ**, son T-6 kararı saat **17:45 TSİ** idi. Bu kontrol anında **0 T-8 ve 0 T-6 checkpoint'i gerçekleşmişti**. Bu, 0 motor sinyali anlamına **gelmez**. Sinyal listesi henüz oluşturulamaz. [26 Ekim durum kanıtı](26/status-2026-10-26-pending-t6-asof-030315-tr.json).

26 Ekim taraması, uygun karar zamanı geldikten sonra ayrıca üretilecek. Bir T-6 penceresini doğrulamak için T-8 gözlem bilgisi daima yalnız geçmişten kullanılmalıdır.

## Araştırma notu

Bu raporlar, tarihsel/AS_OF araştırmalarıdır; canlı SXF `DYNAMIC_AS_OF_V04` taramasıyla aynı karar zamanı garantisini iddia etmez. Skor ve final maç sonuçları seçim oluştururken kullanılmaz. SURPRISE non-loss riskini gösterir, 1X2 galibiyet fiyatı değildir.
