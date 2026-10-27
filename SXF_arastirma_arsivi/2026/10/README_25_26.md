# CAPİTALE SXF Araştırma — 25–26 Ekim 2026

**Maç aralığı:** 16:00–24:00 TSİ · **T-6 esas, eksik T-6 piyasasında T-8 fallback** · **Metodoloji:** SXF DRAFT v0.4 `CHECKPOINT_RESEARCH_T6_FALLBACK_T8`.

| Tarih | Durum | Taranan maç | En az bir piyasada veri | Sinyalli maç | Seçim | Motor etiketi |
|---|---|---:|---:|---:|---:|---:|
| **25 Ekim** | RECONSTRUCTED_ARCHIVED | 188 | 152 | 38 | 39 | 78 |
| **26 Ekim** | RECONSTRUCTED_ARCHIVED | **87** | **64** | **15** | **18** | **23** |

## 25 Ekim raporları

- [25 Ekim ayrıntılı maç/motor raporu](25/sxf-research-2026-10-25-t6-fallback-t8-16to24-v1.md)
- [25 Ekim JSON: tüm maç kapsamı, sinyal ve motor kanıtları](25/sxf-research-2026-10-25-t6-fallback-t8-16to24-v1.json)

25 Ekim için veri kaynağı `public.moneyway_snapshots`: `research_archive.moneyway_snapshots` içinde 25 Ekim'e ait ham snapshot bulunmadığı tespit edilmiştir. T-6 tam piyasa kapsamı: 1X2 141, Üst/Alt 110, BTTS 72. CORE retention ve V2 üç saatlik kontrolü mevcut ham gözlemlerde denetlendi; kaynak yakalama bütünlüğü bağımsız sertifikalı değildir. Başarı/sonuç performansı hesaplanmadı.

## 26 Ekim — tamamlanan T-6/T-8 araştırması

- [26 Ekim ayrıntılı 1X2 / Üst 2.5 / BTTS / SURPRISE taraması](26/sxf-research-2026-10-26-t6-fallback-t8-16to24-v1.md)
- [26 Ekim tüm 87 fikstür, 18 seçim ve kalite denetimi JSON'u](26/sxf-research-2026-10-26-t6-fallback-t8-16to24-v1.json)
- [T-72/60/40/24/12/8/6 kaynak checkpoint kanıtı](26/sxf-research-2026-10-26-source-checkpoints-v1.json)
- [CORE Retention-55 ve V2 üç saatlik ham tick denetimi](26/sxf-research-2026-10-26-quality-audit-v1.json)

**Sonuç:** 87 fikstür, 83'ünde en az bir ham snapshot, 64'ünde en az bir tam piyasa; 15 sinyalli maç, 18 farklı seçim ve 23 motor etiketi. T-6 tam 1X2 62, OU25 34, BTTS 28; T-8 tam 1X2 52, OU25 26, BTTS 22. **T-8 fallback ile eklenen tam piyasa: 0.** 23 maçta hiçbir piyasa tam değil (19 yalnız kısmi, 4 ham kayıt yok). Kısmi kayıttaki eksik taraflar sıfır kabul edilmedi. Kaynak `public.moneyway_snapshots` salt-okunur; `research_archive.moneyway_snapshots` 26 Ekim için uygun kayıt içermiyor.

**Kalite:** 8 CORE kökeni ham tick'lerde Retention-55 ile denetlendi (0 kırılma); 4 V1 adayı üç saatlik V2 kontrolünden geçti (1 onay, 3 ret). Upstream kaynağın tüm gerçek SXF tick'lerini yakaladığı bağımsız olarak sertifikalı değildir. Maç sonucu/FT kullanılmadı; v0.4 eşikleri ve Üst 2.5 gölge filtreleri değiştirilmedi.

## 26 Ekim erken saat durum kaydı (tarihsel, SUPERSEDED)



**26 Ekim 03:03:15 TSİ** durumunda 16:00–24:00 aralığı için **66 aday fikstür** vardı; maç başına belirlenen ilk T-8 kararı saat **08:00 TSİ**, ilk T-6 kararı saat **10:00 TSİ**, son T-6 kararı saat **17:45 TSİ** idi. Bu kontrol anında **0 T-8 ve 0 T-6 checkpoint'i gerçekleşmişti**. Bu, 0 motor sinyali anlamına **gelmez**. Sinyal listesi henüz oluşturulamaz. [26 Ekim durum kanıtı](26/status-2026-10-26-pending-t6-asof-030315-tr.json).

Bu erken durum daha sonra tamamlanan 26 Ekim taramasıyla **SUPERSEDED** oldu; kanıt dosyası silinmedi. T-8 gözlemleri daima yalnız geçmişten kullanıldı.

## Araştırma notu

Bu raporlar, tarihsel/AS_OF araştırmalarıdır; canlı SXF `DYNAMIC_AS_OF_V04` taramasıyla aynı karar zamanı garantisini iddia etmez. Skor ve final maç sonuçları seçim oluştururken kullanılmaz. SURPRISE non-loss riskini gösterir, 1X2 galibiyet fiyatı değildir.

## 26 Ekim — sonradan tamamlanan sonuç/performans ek kaydı (28 Ekim)

- [26 Ekim tam 18 seçimin FT skorları ve motor istatistikleri](26/sxf-research-2026-10-26-t6-fallback-t8-16to24-v1-outcome-v1.md)
- [Makine okunur tüm seçimlerin outcome ve motor kanıtları](26/sxf-research-2026-10-26-t6-fallback-t8-16to24-v1-outcome-v1.json)
- Sonuç: 18/18 FT, 10 WIN, 8 LOSS; 1X2 7/8, OVER 1/2, KG VAR 0/1, SURPRISE yenilmeme 2/7. Kaynak SXF iç FT, `match_id_hash` ve fixture UID / ad eşleşmesi; tüm maçlarda dış kaynaktan bağımsız teyit iddia edilmez.
- Bu ek kayıt, yukarıdaki **"FT kullanılmadı" ifadesini sinyal üretimi açısından değiştirmez**: sonuçlar yalnız ayrı settlement dosyasına işlendi; T-6/T-8 as-of orijinal dosyaları korundu.
