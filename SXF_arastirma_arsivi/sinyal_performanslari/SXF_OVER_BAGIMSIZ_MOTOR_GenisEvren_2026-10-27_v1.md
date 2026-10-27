# SXF bağımsız Üst 2.5 motoru araştırması — T-6 price/flow/probability

**27 Ekim 2026.** Kullanıcının açık talebi: **STABLE veya PREMIUM Üst 2.5 motorundan bağımsız** yeni sinyal; önceki Üst motorundan seçim filtresi değil, tüm piyasa evreninden ayrı bir model.

**Araştırma statüsü:** Sonuç görülmeden önce 10 piyasa mantığı ailesi [ön-kayıt](../hipotezler/SXF_OVER_BAGIMSIZ_MOTOR_OnKayit_2026-10-27_v1.md) ile GitHub'a konuldu. Bağımsız, kör prospektif test YAPILMADI. Önceki 66 orijinal Üst sinyal sonuçları araştırmacı tarafından daha önce görüldü; aynı veri kümesine ilişkin öğrenilmiş bilgi sızması olabilir.

## Önemli kaynak/kapsam açıklaması
- 9–13 Ekim için önceki Supabase `research_archive.fixtures/results` artık bağlı projede yok (bağlantıdaki `to_regclass` null). `public.live_fixtures` FT kaynak eşleştirme 9–13 için büyük ölçüde yok; bu nedenle **bu rapor yalnız 14–25 Ekim 2026** içindir.
- Her gün 16:00–24:00 TSİ; 12 takvim günü; `public.fixtures` ve `public.moneyway_snapshots` aynı fixture T-6 kararı; her durumda OU25 O/U tam, geçerli oran ve ≤10 dk eski.
- FT `public.live_fixtures` yalnız tam `match_id_hash+home_team+away_team` eşleşmesi, status='ft', tekil `[0-9]+-[0-9]+` skor.
- Böylece **912** tam ve FT sonucu olan T-6 OU25 çiftine erişildi. Sonuçlar canlı FT kaynağından, tümü bağımsız haricî tek tek doğrulanmadı.
- Önceki 66 STABLE/PREMIUM orijinal UID kümesi ve 17 OVER_STRONG UID kümesi orijinal GitHub [crossmarket arşivinden](over25_crossmarket_features_2026-10-09_25_v1.json) kullanıldı. STABLE/PREMIUM motoru hiçbir bağımsız aday için `precondition` DEĞİL.
- Bir maç bir kez; toplama/çakışma kontrolü UID.

## Önceden tanımlanmış, tüm evrene uygulanmış 10 model
Marjdan arındırılmış SXF Over olasılığı `pO6 = (1/O6)/(1/O6+1/U6)`.

| Model | Kazanan/toplam | İsabet | Sinyal/gün (12 gün) | Ort. SXF Üst oranı | Önceki 66 sinyal DIŞINDA sayı/isabet |
|---|---:|---:|---:|---:|---|
| MARKET_65 / pO>=.65 | 150/207 | 72.46% | 17.25 | 1.421 | 192 maç, 140 WIN |
| PRICE_CONFIRM_65 / same price up | 94/132 | 71.21% | 11 | 1.423 | 119 maç, 85 WIN |
| PRICE_MONEY_62 | 37/53 | 69.81% | 4.42 | 1.446 | 35 maç, 24 WIN |
| PRICE_FLOW_62 | 67/99 | 67.68% | 8.25 | 1.465 | 84 maç, 57 WIN |
| CROSS_GOALS_60 | 103/152 | 67.76% | 12.67 | 1.491 | 134 maç, 90 WIN |
| 3MARKET_BALANCE_60 | 64/98 | 65.31% | 8.17 | 1.52 | 85 maç, 54 WIN |
| MARKET_70 / pO>=.70 | 67/91 | 73.63% | 7.58 | 1.348 | 87 maç, 66 WIN |
| PRICE_CONFIRM_70 | 42/59 | 71.19% | 4.92 | 1.355 | 55 maç, 41 WIN |
| STRONG_FLOW_65 | 20/30 | 66.67% | 2.5 | 1.403 | 20 maç, 14 WIN |
| FLOW_PLUS_BOTH_60 | 63/97 | 64.95% | 8.08 | 1.491 | 82 maç, 53 WIN |

Ön kayıtlı 10 aileden **hiçbiri 12 gün genelinde %75 isabeti bulmadı**. En yakın: MARKET_70 (pO≥%70) **67/91=%73,63**, 7,58/gün; orijinal kanonik 66 dışında 66/87=%75,86 fakat **alt grubun sonucu** olup tüm motorun gelecekteki isabetinin kanıtı değil.

## En yalın BAĞIMSIZ fiyat-olasılık modeli (ek, açıklayıcı kontrol)
Bu, üstteki 10 aileye ek olarak **mekanik bir %75 piyasa olasılığı eşiğidir**: SXF T-6 OU25 O/U de-vig olasılığı pO≥%75.

**25/33=75.76%**, günlük **2.75** ayrı maç, ortalama SXF Üst fiyatı **1.283**.

Kritik: **Bu 33 maçın tamamı** daha önceki STABLE/PREMIUM 66 sinyal kümesinin ve OVER_STRONG 17 sinyal kümesinin **dışında**; yani STRONG'a eklenebilirler. Bu, farklı odds bandı ile ortaya çıkar; orijinal STABLE/PREMIUM odds 1.40–1.80 ve bu maçlar daha yüksek market ima edilen gol ihtimaline sahip.

**Kazanç testi: -1.37 birim (12 günde 33 ayrı seçim; her seçime 1 birim, ödeme oranı=SXF odds gibi varsayılsaydı).** SXF odds *gerçek bookmaker executable oran* değildir; bu **gerçek ROI değil**, sadece isabet-ödeme oranının birbiriyle uyumunu kontrol eden bir uyarıdır. Bu fiyat seviyesinde %75 başarı otomatik bahis değeri yaratmaz ve hipotetik sonuç negatiftir.

Sadece 17–25 Ekim: 21/27 = %77,78. İlk 14–16 Ekim: 4/6=%66,67. Her iki dönem de aynı araştırmanın parçasıdır, gerçek dış örneklem değildir. Bu 33 örneklemde %95 Wilson yaklaşık %59–87 arası geniştir; %75 üzerinde kalıcı isabet doğrulanmadı.

**Diğer açık fiyat-bazlı kontrol**: SXF Üst odds ≤1,40 şeklinde basit bir kural: 55/73=%75,34, 6,08/gün, ort. SXF odds1,321. Bu grupta STRONG ile çakışma 0, hipotetik 1-unit SXF settlement -0,44 unit (gerçek ROI değil). Alt oranlı yüksek tahmin güveni, pozitif beklenen değer kanıtı değildir; önceki STRONG ile aynı risk/getiri segmentinde değildir.

## Gün gün bağımsız pO≥%75
| Tarih | Sinyal | Üst 2.5 geldi |
|---|---:|---:|
| 2026-10-14 | 3 | 2 |
| 2026-10-15 | 3 | 2 |
| 2026-10-16 | 0 | 0 |
| 2026-10-17 | 4 | 3 |
| 2026-10-18 | 2 | 1 |
| 2026-10-19 | 5 | 3 |
| 2026-10-20 | 2 | 2 |
| 2026-10-21 | 1 | 1 |
| 2026-10-22 | 2 | 2 |
| 2026-10-23 | 1 | 1 |
| 2026-10-24 | 7 | 5 |
| 2026-10-25 | 3 | 3 |
| TOPLAM | 33 | 25 |

## 33 ek bağımsız sinyalin tam denetim listesi
| # | TSİ tarih-saat | Maç | SXF Üst oranı | SXF Alt oranı | Marj-arındırılmış pO | FT | Durum | Fixture UID |
|---|---|---|---:|---:|---:|---|---|---|
| 1 | 2026-10-14 20:00 | Haugesund – Lyn | 1.25 | 4.80 | 79.34% | 3-0 | WIN | `c3ad9632-0bae-4b7f-84a6-d8d409ad7426` |
| 2 | 2026-10-14 20:00 | Omonia 29th May – AEP Polemidion | 1.27 | 4.80 | 79.08% | 0-0 | LOSS | `e1c6ae78-778f-4105-8db9-cb351c795c0b` |
| 3 | 2026-10-14 20:00 | Stromsgodset – Kongsvinger | 1.30 | 4.40 | 77.19% | 5-1 | WIN | `9be1ff79-0e27-4af6-bf3d-e34c9bd2b4f0` |
| 4 | 2026-10-15 19:00 | FC Tallinn – JK Welco Elekter | 1.35 | 4.10 | 75.23% | 0-7 | WIN | `eac1684d-d07f-475a-a64a-c6d72823dd5c` |
| 5 | 2026-10-15 22:00 | Brighton – FK Kauno Zalgiris | 1.20 | 6.00 | 83.33% | 4-0 | WIN | `594d9bcb-8b00-4c3e-9d27-f2a6002b094f` |
| 6 | 2026-10-15 22:00 | FC Twente – Thun | 1.30 | 4.20 | 76.36% | 1-0 | LOSS | `bbfe3a67-aedc-4750-b100-2184f1c513b6` |
| 7 | 2026-10-17 17:00 | Wigan – Reading | 1.75 | 29.00 | 94.31% | 1-0 | LOSS | `9e2f98d3-2dce-4508-8360-f7570a4cf107` |
| 8 | 2026-10-17 17:30 | ADO Den Haag – PSV | 1.29 | 4.40 | 77.33% | 2-1 | WIN | `24b1a80b-82c8-457a-bcff-28c8ac6dcf2d` |
| 9 | 2026-10-17 19:30 | Bayern Munich – RB Leipzig | 1.14 | 8.00 | 87.53% | 6-1 | WIN | `4ad2d704-7508-462c-8c25-2d6cc8757379` |
| 10 | 2026-10-17 19:30 | Betis – Barcelona | 1.25 | 4.90 | 79.67% | 2-5 | WIN | `a018ae91-45ce-41f8-9b57-88bee712154a` |
| 11 | 2026-10-18 18:00 | Kongsvinger – Sandnes Ulf | 1.28 | 4.30 | 77.06% | 4-0 | WIN | `a02bbefb-8d4c-4edc-9bf0-44f58abc8ca4` |
| 12 | 2026-10-18 18:00 | Spartak Pleven – PFC Levski Sofia | 1.32 | 4.00 | 75.19% | 0-2 | LOSS | `2fd00d78-86eb-4cb9-8a9b-d74f4e938ccd` |
| 13 | 2026-10-19 18:00 | Tallinna Kalev – Levadia Tallinn II | 1.26 | 4.80 | 79.21% | 1-2 | WIN | `25bec7ea-91b0-41f7-896e-69cb79e1c6b8` |
| 14 | 2026-10-19 19:00 | Rigas Futbola Skola – FK Tukums 2000 | 1.27 | 4.30 | 77.20% | 2-0 | LOSS | `4a6ef2c5-2012-44d3-bb78-78fbbf9a1cf2` |
| 15 | 2026-10-19 21:00 | Al-Hilal – Al-Hazm (KSA) | 1.29 | 4.60 | 78.10% | 1-0 | LOSS | `2463bbb5-95ac-473c-b2a3-fc451de44bf0` |
| 16 | 2026-10-19 21:00 | Jong Ajax Amsterdam – De Graafschap | 1.33 | 4.20 | 75.95% | 2-1 | WIN | `3a7149a3-93d2-4efe-9b6d-e0bce1036471` |
| 17 | 2026-10-19 22:15 | Fram – IA Akranes | 1.28 | 4.50 | 77.85% | 2-4 | WIN | `7d7cabd9-0740-4058-a5f3-6d9b645dce56` |
| 18 | 2026-10-20 22:00 | Paris St-G – Barcelona | 1.23 | 5.30 | 81.16% | 4-2 | WIN | `c833dde9-6599-47ff-9588-d06a0dbeb812` |
| 19 | 2026-10-20 22:00 | Roma – Slovan Bratislava | 1.29 | 4.50 | 77.72% | 4-0 | WIN | `7671254a-74f3-4bdd-b296-9d27065c5148` |
| 20 | 2026-10-21 22:00 | Real Madrid – RB Leipzig | 1.20 | 5.90 | 83.10% | 4-1 | WIN | `8c6e1b89-de7b-47e5-a4a9-d2e9e0e68592` |
| 21 | 2026-10-22 17:30 | Al Shahaniya – Al-Sadd | 1.29 | 4.70 | 78.46% | 0-4 | WIN | `ef044d7f-6590-4649-b323-eb1828455bbe` |
| 22 | 2026-10-22 19:00 | Flora Tallinn II – FC Nõmme United U21 | 1.27 | 4.70 | 78.73% | 3-2 | WIN | `daf468c0-0fcd-4a47-93e0-aa17ee623d98` |
| 23 | 2026-10-23 21:30 | Stuttgart – Mgladbach | 1.31 | 4.30 | 76.65% | 2-3 | WIN | `67bec279-b5c7-4443-b639-d073ebe103bf` |
| 24 | 2026-10-24 16:30 | RB Leipzig – Elversberg | 1.30 | 4.10 | 75.93% | 4-0 | WIN | `de6acc4e-2451-4f72-85fe-5e8a1289e87d` |
| 25 | 2026-10-24 17:00 | Bodo Glimt – Valerenga | 1.19 | 6.40 | 84.32% | 0-1 | LOSS | `71c4a717-2cd6-43e8-86ce-d5ffa88f40d2` |
| 26 | 2026-10-24 17:00 | KR Reykjavik – Breidablik | 1.17 | 7.00 | 85.68% | 8-3 | WIN | `6a16fa94-ff1c-4559-a419-21223fc33ad9` |
| 27 | 2026-10-24 17:00 | Stjarnan – Valur | 1.21 | 5.10 | 80.82% | 6-0 | WIN | `775b7022-e35c-447e-b5b8-eb14b60f5743` |
| 28 | 2026-10-24 19:15 | Vikingur Reykjavik – Fram | 1.33 | 4.00 | 75.05% | 2-2 | WIN | `ef61bf1b-ca94-4e92-b4e9-387a9f8a077b` |
| 29 | 2026-10-24 20:30 | Rapid Vienna – SC Austria Lustenau | 1.33 | 4.00 | 75.05% | 5-1 | WIN | `dec8e0ba-4c57-4112-a915-d23ff010de53` |
| 30 | 2026-10-24 21:30 | Young Boys – St Gallen | 1.33 | 4.20 | 75.95% | 2-0 | LOSS | `45e48c74-ca1e-4458-b0d7-a764376e577d` |
| 31 | 2026-10-25 19:00 | Sogndal – Kongsvinger | 1.23 | 5.00 | 80.26% | 3-1 | WIN | `b3479d41-431c-4cfe-985a-1f467c89e3c4` |
| 32 | 2026-10-25 22:00 | Always Ready – CDT Real Oruro | 1.31 | 4.40 | 77.06% | 5-1 | WIN | `c7a9c32c-6ae2-4e3b-b93f-17a1d7c6ae69` |
| 33 | 2026-10-25 23:00 | Barcelona – Real Madrid | 1.23 | 5.20 | 80.87% | 1-2 | WIN | `cd60b109-58be-417c-b970-4f5c8de22c76` |

## Üretim ve araştırma kararı
1. **Sinyal bağımsızlığı sağlandı:** direkt bütün maçlardan seçim, hiçbir `STABLE`/`PREMIUM` trigger şartı yok.
2. **Günlük hacim bulundu ama fiyat değeri bulunmadı:** yaklaşık 2,75 maç/gün ekleniyor, %75,76 isabetin bile varsayımsal ödül hesabı negatif. Oran 1,28 seviyesi STRONG'un ~1,61 fiyatına denk değil.
3. Daha yüksek ödül oranında pozitif edge gösterecek bağımsız model hâlâ geliştirilmedi. Ön kayıtlı piyasa-para akış modellerinde daha seçici fiyat/momentum koşulları tüm evrende %75'i aşmadı. Geriye dönük rastgele eşikler optimize edilmedi.
4. **SXF v0.4 ve mevcut STRONG araştırma adayı DEĞİŞMEDİ.** Kaynak arşiv yokluğundan 9–13 Ekim'e bir başarı oranı uydurulmadı. İleriye dönük sonuca bakmadan kayıtlı shadow test şart.
