# CAPİTALE SXF — 09–12 Ekim araştırma parti özeti

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
