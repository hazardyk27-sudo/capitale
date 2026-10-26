# CAPİTALE — SXF Araştırma Arşivi

**İlk parti: 9–12 Ekim 2026.** Tüm günlerde 16:00–24:00 TSİ maçları, her maça göre **T-6** as-of; T-6 tam veri yoksa **T-8** fallback. Bu veri serisi **CHECKPOINT_RESEARCH_T6_FALLBACK_T8** araştırma modudur; canlı `DYNAMIC_AS_OF_V04` değildir.

| Tarih (TSİ) | Taranan maç | Sinyalli maç | Farklı seçim | Motor etiketi | Ayrıntılı rapor | JSON kanıtı |
|---|---:|---:|---:|---:|---|---|
| 09.10.2026 | 183 | 20 | 24 | 36 | [Rapor](/SXF_arastirma_arsivi/2026/10/09/sxf-research-2026-10-09-t6-fallback-t8-16to24-v1.md) | [JSON](/SXF_arastirma_arsivi/2026/10/09/sxf-research-2026-10-09-t6-fallback-t8-16to24-v1.json) |
| 10.10.2026 | 294 | 47 | 52 | 75 | [Rapor](/SXF_arastirma_arsivi/2026/10/10/sxf-research-2026-10-10-t6-fallback-t8-16to24-v1.md) | [JSON](/SXF_arastirma_arsivi/2026/10/10/sxf-research-2026-10-10-t6-fallback-t8-16to24-v1.json) |
| 11.10.2026 | 176 | 24 | 26 | 46 | [Rapor](/SXF_arastirma_arsivi/2026/10/11/sxf-research-2026-10-11-t6-fallback-t8-16to24-v1.md) | [JSON](/SXF_arastirma_arsivi/2026/10/11/sxf-research-2026-10-11-t6-fallback-t8-16to24-v1.json) |
| 12.10.2026 | 109 | 9 | 11 | 21 | [Rapor](/SXF_arastirma_arsivi/2026/10/12/sxf-research-2026-10-12-t6-fallback-t8-16to24-v2.md) | [JSON](/SXF_arastirma_arsivi/2026/10/12/sxf-research-2026-10-12-t6-fallback-t8-16to24-v2.json) |
| **TOPLAM** | **762** | **100** | **113** | **178** | — | — |

## Veri ve kalite politikası

- SXF v0.4 onaylı EARLY CORE, T12, V1, V2, HEAVY, STABLE/PREMIUM OVER, BTTS YES ve SURPRISE motor eşikleri kullanıldı.
- Retention-55 ve V2 için karar anına kadarki **mevcut ham SmartXFlow gözlem geçmişi** incelendi. Sadece 9 noktalık grid ile tam doğrulama yapılmış gibi gösterilmedi.
- Tarihsel veri **sonradan yeniden hesaplanmıştır**; raporlar tarihlerinde canlı olarak yayımlanmış tahminler değildir.
- **Karar sonuçlardan önceki gözlemlere göre hesaplandı.** FT/maç sonuçları araştırma sinyal belgelerine dahil edilmedi.
- `SXF` oranları bahis sitesinden uygulanabilir fiyatlar olarak sunulmadı. 1,30 altında kalan etiketler reddedilerek denetim bölümünde tutuldu.
- Her JSON'un `all_fixtures` alanı, sinyal almayan maçlar dahil kapsam durumunu gösterir.
- **12 Ekim v1 sürümü kaynak kapsamı eksikliği nedeniyle SUPERSEDED**: esas alınacak sürüm [12 Ekim v2](/SXF_arastirma_arsivi/2026/10/12/sxf-research-2026-10-12-t6-fallback-t8-16to24-v2.md). Eski v1 silinmedi, tarihsellik korunur. 9–11 Ekim için public T-6 tam 1X2 kapsamı araştırma arşiviyle sayı bazında eşleşti; tüm ham payload eşitliği ayrıca sertifikalı değildir.
- Bu klasör, mevcut `archive/YYYY/MM/DD/` ham/konsantre arşivlerini değiştirmez veya onların tam aktarıldığını iddia etmez.

**Sıradaki dört günlük parti:** 13–16 Ekim 2026. Önce araştırma arşivi kaynak kapsamı kontrol edilir; düşük kapsama sahip canlı tablolar yerine kaynak ham arşiv kullanılır.

---

## 2. Parti: 13–16 Ekim 2026

[Detaylı dört günlük indeks](2026/10/README_13_16.md)

| Tarih | Maç | Veri bulunan | Sinyalli maç | Seçim | Motor etiketi | Rapor | JSON |
|---|---:|---:|---:|---:|---:|---|---|
| 13.10.2026 | 147 | 44 | 16 | 19 | 33 | [Rapor](/SXF_arastirma_arsivi/2026/10/13/sxf-research-2026-10-13-t6-fallback-t8-16to24-v1.md) | [JSON](/SXF_arastirma_arsivi/2026/10/13/sxf-research-2026-10-13-t6-fallback-t8-16to24-v1.json) |
| 14.10.2026 | 90 | 70 | 16 | 22 | 36 | [Rapor](/SXF_arastirma_arsivi/2026/10/14/sxf-research-2026-10-14-t6-fallback-t8-16to24-v1.md) | [JSON](/SXF_arastirma_arsivi/2026/10/14/sxf-research-2026-10-14-t6-fallback-t8-16to24-v1.json) |
| 15.10.2026 | 99 | 60 | 21 | 25 | 54 | [Rapor](/SXF_arastirma_arsivi/2026/10/15/sxf-research-2026-10-15-t6-fallback-t8-16to24-v1.md) | [JSON](/SXF_arastirma_arsivi/2026/10/15/sxf-research-2026-10-15-t6-fallback-t8-16to24-v1.json) |
| 16.10.2026 | 140 | 114 | 19 | 19 | 30 | [Rapor](/SXF_arastirma_arsivi/2026/10/16/sxf-research-2026-10-16-t6-fallback-t8-16to24-v1.md) | [JSON](/SXF_arastirma_arsivi/2026/10/16/sxf-research-2026-10-16-t6-fallback-t8-16to24-v1.json) |
| **TOPLAM** | **476** | **288** | **72** | **85** | **153** | — | — |

**Önemli:** 13 Ekim ham arşiv tam 1X2 T-6 kapsamı 36, canlı kaynaktaki sayı 20 olduğundan araştırma ham kaynağı kullanıldı. Bu raporlar orijinal dönemde dondurulmuş tahmin değil, sonradan oluşturulmuş T-6/T-8 araştırmalarıdır.

---

## 3. Parti: 17–20 Ekim 2026

[Detaylı dört günlük indeks](2026/10/README_17_20.md)

| Tarih | Taranan maç | Veri bulunan | Sinyalli maç | Seçim | Motor etiketi | Rapor | JSON |
|---|---:|---:|---:|---:|---:|---|---|
| 17.10.2026 | 259 | 171 | 36 | 38 | 78 | [Rapor](/SXF_arastirma_arsivi/2026/10/17/sxf-research-2026-10-17-t6-fallback-t8-16to24-v1.md) | [JSON](/SXF_arastirma_arsivi/2026/10/17/sxf-research-2026-10-17-t6-fallback-t8-16to24-v1.json) |
| 18.10.2026 | 210 | 156 | 32 | 36 | 69 | [Rapor](/SXF_arastirma_arsivi/2026/10/18/sxf-research-2026-10-18-t6-fallback-t8-16to24-v1.md) | [JSON](/SXF_arastirma_arsivi/2026/10/18/sxf-research-2026-10-18-t6-fallback-t8-16to24-v1.json) |
| 19.10.2026 | 118 | 75 | 10 | 12 | 18 | [Rapor](/SXF_arastirma_arsivi/2026/10/19/sxf-research-2026-10-19-t6-fallback-t8-16to24-v1.md) | [JSON](/SXF_arastirma_arsivi/2026/10/19/sxf-research-2026-10-19-t6-fallback-t8-16to24-v1.json) |
| 20.10.2026 | 94 | 68 | 22 | 26 | 57 | [Rapor](/SXF_arastirma_arsivi/2026/10/20/sxf-research-2026-10-20-t6-fallback-t8-16to24-v1.md) | [JSON](/SXF_arastirma_arsivi/2026/10/20/sxf-research-2026-10-20-t6-fallback-t8-16to24-v1.json) |
| **TOPLAM** | **681** | **470** | **100** | **112** | **222** | — | — |

**Bu raporlar T-6/T-8 tarihsel araştırma sürümleridir; canlı v0.4 taraması değildir.** Kaynak günlük sınırları ve ham geçmiş gözlem eksikleri ilgili JSON'larda ayrıca saklanmıştır.

---

## 4. Parti: 21–24 Ekim 2026

[Detaylı dört günlük indeks](2026/10/README_21_24.md)

| Tarih | Taranan maç | Veri bulunan | Sinyalli maç | Seçim | Motor etiketi | Rapor | JSON |
|---|---:|---:|---:|---:|---:|---|---|
| 21.10.2026 | 60 | 46 | 9 | 10 | 15 | [Rapor](/SXF_arastirma_arsivi/2026/10/21/sxf-research-2026-10-21-t6-fallback-t8-16to24-v1.md) | [JSON](/SXF_arastirma_arsivi/2026/10/21/sxf-research-2026-10-21-t6-fallback-t8-16to24-v1.json) |
| 22.10.2026 | 76 | 61 | 32 | 35 | 81 | [Rapor](/SXF_arastirma_arsivi/2026/10/22/sxf-research-2026-10-22-t6-fallback-t8-16to24-v1.md) | [JSON](/SXF_arastirma_arsivi/2026/10/22/sxf-research-2026-10-22-t6-fallback-t8-16to24-v1.json) |
| 23.10.2026 | 170 | 123 | 16 | 16 | 28 | [Rapor](/SXF_arastirma_arsivi/2026/10/23/sxf-research-2026-10-23-t6-fallback-t8-16to24-v1.md) | [JSON](/SXF_arastirma_arsivi/2026/10/23/sxf-research-2026-10-23-t6-fallback-t8-16to24-v1.json) |
| 24.10.2026 | 290 | 226 | 51 | 54 | 92 | [Rapor](/SXF_arastirma_arsivi/2026/10/24/sxf-research-2026-10-24-t6-fallback-t8-16to24-v1.md) | [JSON](/SXF_arastirma_arsivi/2026/10/24/sxf-research-2026-10-24-t6-fallback-t8-16to24-v1.json) |
| **TOPLAM** | **596** | **456** | **108** | **115** | **216** | — | — |

**23–24 Ekim kaynak açıklaması:** 23 Ekim ham arşiv sorgusu zaman aşımına takıldığı, 24 Ekim araştırma arşivi yalnız 5 fikstürü kapsadığı için daha geniş `public.moneyway_snapshots` salt-okunur kaynağı kullanıldı. Canlı DYNAMIC_AS_OF_V04 ile aynı araştırma değildir.

---

## 5. Parti: 25–26 Ekim 2026

[25 Ekim tamamlandı / 26 Ekim T-6 zamanı bekleniyor](2026/10/README_25_26.md)

| Tarih | Durum | Maç | Sinyalli | Seçim | Motor etiketi |
|---|---|---:|---:|---:|---:|
| 25.10.2026 | `RECONSTRUCTED_ARCHIVED` | 188 | 38 | 39 | 78 |
| 26.10.2026 | `PENDING_ASOF_NOT_REACHED` (03:03 TSİ) | 66 aday fikstür | — | — | — |

**26 Ekim: 0 sinyal değil, karar noktaları henüz gelmedi.** İlk T-8 08:00, ilk T-6 10:00, son T-6 17:45 TSİ. Bugünün taramasının tamamlandığı iddia edilmez.

---

## SXF Sinyal Performansları — 9–25 Ekim 2026

[**Genel motor isabetleri, günlük başarı oranları, ortalama SXF oranları ve grafikler**](Sinyal_Performanslari.md)

**17 gün · 464 farklı seçim · 463 sonuçlanan · 1 doğrulanamayan.** Günlerin her birinde [ayrı günlük skor/performans raporu](Sinyal_Performanslari.md#6-günlük-skor-kanıtları-ve-seçime-özel-raporlar) bulunmaktadır. Orijinal araştırma sinyal dosyaları değişmemiştir. 26 Ekim gününün T-6 taraması henüz bu performansa dahil değildir.

### Kazanan / kaybeden karşılaştırması (EXPERIMENTAL)

[**Para payı, mutlak para, HEAVY, V2, beraberlik riski ve gölge filtre araştırması**](sinyal_performanslari/Kazanan_Kaybeden_Analizi_2026-10-09_25_v1.md)

> Bu analiz geçmiş sonuçları görerek yapılmış araştırmadır; mevcut SXF v0.4 motor eşikleri değişmedi.

---

## Üst 2.5 filtre iyileştirme araştırması (9–25 Ekim)

[**BTTS YES SXF fiyatı, mutlak £ hacmi ve T-8→T-6 para hareketi karşılaştırması**](sinyal_performanslari/SXF_OVER25_Filter_Research_2026-10-09_25_v1.md)

66 orijinal Üst sinyalinden 1'i farklı snapshot kaynakları uyuşmadığı için çapraz piyasa analizinden ayrıldı. Kalan 65 örnekte **BTTS YES SXF >1,60 + Üst £≥2.500** araştırma filtresi **20/22 (%90,9)** isabet gösterdi; sonuç geçmişe yönelik ve yalnızca gölge test hipotezidir. v0.4 motor kuralları değiştirilmedi.
