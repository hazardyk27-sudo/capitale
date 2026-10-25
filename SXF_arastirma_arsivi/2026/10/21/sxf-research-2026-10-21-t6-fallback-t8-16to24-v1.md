# CAPİTALE SXF Araştırma — 21 Ekim 2026

> **Geriye dönük araştırma.** Bu kayıt, karşılaşma öncesinde yayımlanan orijinal tahmin değildir. Maç skorları sonuçları taramaya karıştırılmadı.

**Saat:** 16:00–24:00 TSİ · **Karar:** Her maçın T-6 noktası, eksikse T-8 fallback · **Mod:** `CHECKPOINT_RESEARCH_T6_FALLBACK_T8` · **SXF:** DRAFT v0.4
**Kapsam:** 60 maç · 46 veri bulunan · 9 sinyalli · 10 farklı seçim · 15 motor etiketi

## 1X2 — 3 seçim

| Saat / Maç → Tercih | Motorlar | SXF oranı | Para % | Para £ | Karar |
|---|---|---:|---:|---:|---|
| 20:00 Al Ahly Cairo – Olympic El Qanal → **Al Ahly Cairo** | EARLY_T12 | 1,32 | 92,9 | 4.193 | T-6 |
| 22:00 Club Brugge – Lens → **Club Brugge** | EARLY_CORE, EARLY_T12, V1, V2, HEAVY | 1,94 | 81,2 | 75.679 | T-6 |
| 22:00 Sporting Lisbon – Lask Linz → **Sporting Lisbon** | EARLY_CORE, EARLY_T12 | 1,30 | 89,7 | 234.756 | T-6 |

## Üst 2.5 — 4 seçim

| Saat / Maç → Tercih | Motorlar | SXF oranı | Para % | Para £ | Karar |
|---|---|---:|---:|---:|---|
| 19:45 Como – Man Utd → **Üst 2.5** | PREMIUM_OVER_2_5 | 1,59 | 86,3 | 38.722 | T-6 |
| 19:45 Lille – Galatasaray → **Üst 2.5** | PREMIUM_OVER_2_5 | 1,69 | 79,5 | 4.229 | T-6 |
| 22:00 Betis – Feyenoord → **Üst 2.5** | STABLE_OVER_2_5 | 1,40 | 88,4 | 1.884 | T-6 |
| 22:00 Sporting Lisbon – Lask Linz → **Üst 2.5** | STABLE_OVER_2_5 | 1,40 | 73,6 | 1.990 | T-6 |

## KG VAR / BTTS YES — 2 seçim

| Saat / Maç → Tercih | Motorlar | SXF oranı | Para % | Para £ | Karar |
|---|---|---:|---:|---:|---|
| 21:00 Levante – Athletic Bilbao → **KG VAR** | BTTS_YES | 1,84 | 82,4 | 916 | T-6 |
| 22:00 Inter – Shakhtar → **KG VAR** | BTTS_YES | 1,79 | 60,0 | 15.157 | T-6 |

## SURPRISE — yenilmeme riski — 1 seçim

| Saat / Maç → Tercih | Motorlar | SXF oranı | Para % | Para £ | Karar |
|---|---|---:|---:|---:|---|
| 17:45 Al Jeel – Al-Jndal → **Al Jeel** | SURPRISE_TEAM | 3,20 | 52,9 | 15 | T-6 |

## Motor denetim sonuçları

| Motor | Etiket |
|---|---:|
| SURPRISE_TEAM | 1 |
| PREMIUM_OVER_2_5 | 2 |
| EARLY_T12 | 3 |
| BTTS_YES | 2 |
| STABLE_OVER_2_5 | 2 |
| EARLY_CORE | 2 |
| V1 | 1 |
| V2 | 1 |
| HEAVY | 1 |
| **Toplam** | **15** |

## Retention-55 nedeniyle CORE iptali

| Maç → Taraf | Köken | Minimum para payı | Kırılma UTC |
|---|---|---:|---|
| Como – Man Utd → Como | T-24 | %53,6 | 2026-10-21 06:56:30+00 |
| Bayern Munich – Arsenal → Bayern Munich | T-72 | %52,7 | 2026-10-21 08:52:12+00 |

## SXF oranı 1,30 altı elenen sinyaller

- Aston Villa – Viking → Aston Villa: 1,28, EARLY_CORE
- Real Madrid – RB Leipzig → Real Madrid: 1,27, EARLY_CORE

## Kapsam ve verisiz piyasalar

| Market | T-6 tam | T-8 tam | Kararda kullanılabilir |
|---|---:|---:|---:|
| 1X2 | 45 | 34 | 45 |
| OU25 | 29 | 27 | 29 |
| BTTS | 20 | 18 | 20 |

**T-8 fallback:** 0 piyasa · **Tüm piyasalarda veri eksik:** 14 maç.

- 16:00 Bul FC – NEC FC
- 16:00 Club Brugge U19 – RC Lens U19
- 16:00 Gasogi United – Gorilla FC
- 16:00 Oxford United (Res) – Milton Keynes Dons FC (Res)
- 17:00 All Boys (Res) – Talleres Remedios (Res)
- 17:00 Bayern Munich U19 – Arsenal U19
- 19:30 MSK Senec – TJ Kovo Belusa
- 21:00 Burnley (W) – Aston Villa (W)
- 21:00 Ferro Carril (Res) – CA Col Santa Fe (Res)
- 21:00 Gimnasia Esgrima (Res) – Talleres (Res)
- 21:00 Liverpool (W) – Man Utd (W)
- 21:00 Norwich U21 – Bristol City U21
- 21:00 Rivadavia (Res) – San Martin-San Juan (Res)
- 21:30 St. Patrick F.C. – Sliema Wanderers FC

## Araştırma kuralları ve doğrulama

- Her maçın T-6 karar zamanı başlama anından altı saat geridir. Piyasa tam değilse T-8 fallback kullanılır; karar sonrası kayıt alınmaz.
- EARLY T-72/T-60/T-40/T-24/T-12 yalnızca tam 1X2 ve top-money takım eşikleriyle; CORE Retention-55 kökenden T-6'ya kadar mevcut ham pay geçmişiyle incelenir.
- V1: top-money, >=£1000, pay >=%80, oran 1.40–2.50. V2: son 3 saat için >=%70 minimum pay, <=%3 olumsuz oran hareketi, yeterli ham geçmiş kanıtı. HEAVY V1 üstünde premium etikettir.
- PREMIUM OVER, STABLE'ın yerini alır. BTTS YES bağımsız piyasadır. SURPRISE takımın kaybetmeme direnciyle ilgilidir; gösterilen SXF fiyatı galibiyet fiyatıdır.
- Ham arşivin tam ve kesintisiz tüm tick'leri içerdiği bağımsız doğrulanmadı. Bunlar sonradan oluşturulan araştırma sinyalleridir. Sonuç/FT değerlendirmesi yapılmadı.

**Tam fikstür ve sinyal kanıtı:** `sxf-research-2026-10-21-t6-fallback-t8-16to24-v1.json`.
