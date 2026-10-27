# CAPİTALE SXF — EARLY CORE T-8 → T-6 seçilen SXF oran artışının büyüklüğü (v2)
**Tarih:** 2026-10-27. **Durum:** EXPLORATORY / PRICE-RISE CRITICAL THRESHOLD **NOT PROVEN**. **Kanonik filtre değişmedi.**

## Ana sonuç
9–26 Ekim EARLY CORE ≤2,35 uygun toplam **81 sinyal** (9–25: 77; 26: 4); güvenilir/izlenebilir iki noktalı fiyatı olan **48** (35 tam tarihli A-seviye + 13 eski t8 scalar B-seviye); **33** tarihli fiyat güveni bulunamadığından hariç. 48'in **31'i kazandı, 17'si kaybetti**.
**%1,5 üstü fiyat artışı:** **4/5 kayıp (%80)**, ortalama karar SXF **1,83**. **≤%1,5:** **13/43 kayıp (%30,2)**, ortalama karar SXF **1,677**. Fark dikkat çekici ama **tek bir filtre eşiği olarak kanıtlanmadı**: yalnız 5 vaka, skorlar görülerek eşik tarandı, fiyat seviyesi farklı ve 12–19 Ekim 33 vaka eksik.
**Daha sıkı A kaynaklarıyla:** >%1,5 **3/4 kayıp**, ≤%1,5 **11/31 kayıp**; B kaynağında >%1,5 **1/1 kayıp**. Kontrol sinyali ayrı kaynak dönemlerinde aynı yönde ancak örnekler küçük.

## Sabit artış aralıkları (ham SXF odds relatif %)
| Artış aralığı | Kazanan | Kaybeden | Ortalama karar oranı |
|---|---:|---:|---:|
| ≤0 | 24/35 | 11/35 (%31.4) | 1.673 |
| 0–0.5 | 0/0 | 0/0 | — |
| 0.5–1 | 4/6 | 2/6 (%33.3) | 1.658 |
| 1–1.5 | 2/2 | 0/2 (%0.0) | 1.8 |
| 1.5–2 | 1/4 | 3/4 (%75.0) | 1.865 |
| 2–3 | 0/1 | 1/1 (%100.0) | 1.69 |
| >3 | 0/0 | 0/0 | — |

## Test edilen kümülatif eşikler
| Artış eşiği | Eşik üstü kayıp | Eşik altı veya eşit kayıp |
|---|---:|---:|
| >%0 | 6/13 (%46.1) | 11/35 (%31.4) |
| >%0.5 | 6/13 (%46.1) | 11/35 (%31.4) |
| >%1 | 4/7 (%57.1) | 13/41 (%31.7) |
| >%1.5 | 4/5 (%80.0) | 13/43 (%30.2) |
| >%1.6 | 3/4 (%75.0) | 14/44 (%31.8) |
| >%2 | 1/1 (%100.0) | 16/47 (%34.0) |
| >%3 | — | 17/48 (%35.4) |

## Karar odds bandı kontrolü (%1,5 sınırı)
| Karar SXF odds | >%1,5 artan kayıp | ≤%1,5 artan kayıp |
|---|---:|---:|
| 1.30–1.59 | 0/1 (%0.0) | 9/24 (%37.5) |
| 1.60–1.99 | 2/2 (%100.0) | 2/12 (%16.7) |
| 2.00–2.35 | 2/2 (%100.0) | 2/7 (%28.6) |

## Erken/geç dönem kontrolü
| Tarih | >%1,5 artan kayıp | ≤%1,5 artan kayıp |
|---|---:|---:|
| 09–11 Ekim | 1/1 (%100.0) | 2/12 (%16.7) |
| 20–26 Ekim | 3/4 (%75.0) | 11/31 (%35.5) |

## >%1,5 hareketli tüm 5 sinyal, FT çapraz kontrolü
| Tarih | Seçim | T-8→T-6 | Artış | FT | Sonuç |
|---|---|---|---:|---|---|
| 2026-10-23 | Alaves (Alaves – Malaga) | 1.65→1.69 | %2.424 | 1-1 | LOSS |
| 2026-10-25 | Bayern Munich (Freiburg – Bayern Munich) | 1.51→1.54 | %1.987 | 1-3 | WIN |
| 2026-10-24 | Stevenage (Stevenage – MK Dons) | 2.06→2.10 | %1.942 | 0-1 | LOSS |
| 2026-10-10 | Man Utd (Man Utd – Tottenham) | 1.77→1.80 | %1.695 | 1-1 | LOSS |
| 2026-10-24 | Chelsea (Chelsea – Tottenham) | 1.99→2.02 | %1.508 | 0-2 | LOSS |

## Verinin güvenilirliği ve AS_OF
- 20–25 Ekim 31 sinyalde Supabase `public.moneyway_snapshots`, aynı fixture UID ve `1X2` tam 1/X/2 fiyat, en yakın fakat cutoff sonrası olmayan ve 10 dakika penceresindeki T-8/T-6. T-6 seçili odds ve pay frozen archive ile tolerans sınırı içinde; veri kapsamı 31/31.
- 26 Ekim 4 sinyalde immutable GitHub checkpoint JSON, iki tarihli üçlü 1X2 kayıt ve frozen T-6 seçili odds eşleşti. Dört skor dış kaynaklarda doğrulandı.
- 9–11 Ekim 13 sinyalde frozen archive `t8.o` ile feature JSON tam eşleşti, fakat kaynak T-8 gözleminin bağımsız timestamp'i arşivde saklanmadığından **B-tier**; bu 13 kaydı exact 10-minute evidence sanma.
- 12–19 Ekim 33 sinyal için T-8 tam ve güvenilir fiyat bulunamadı; modern `public` ön tarih kayıt içermiyor, aktif Supabase projesinde `research_archive` şeması yok. 14 Ekim `archive/2026/10/14/05_pratik_arsiv` compact payload'da `oddsx` fingerprint kayması saptandığından içeriği doğrudan fiyat kabul etmek yasak.
- İç skor arşivindeki 77/77 CORE seçim daha önce tutarlı olarak denetlenmiştir; dış kaynakla bu çalışmada 5 kritik maçın tümü ve 26 Ekim 4 maç yeniden teyit edilmiştir. Her 81 seçimin harici teyit edildiği iddia edilmez.
- 9–25 eski frozen orijinal taramalar korunur, yeni cap gölge kohort hesaplamasıdır, canlı dağıtım henüz teyitli değildir.
- `%artış = 100 × (T6 seçilen oran / T8 seçilen oran − 1)`; 3-taraf de-vig Δp ayrı ölçüdür ve ikame edilemez.
- Eşik >%1,5 görünür ama >%1,6 grubu 3/4 kayıp, >%2 yalnız 1/1 kayıp, >%3 hiç örnek yok. 0,01 odds yuvarlaması/çoklu eşik tarama nedeniyle **kalıcı veto için istatistiksel ispat yok**.

## Kanonik karara etkisi
**HİÇBİR YENİ VETO YOK.** 2,35 dahil tavanı ve v0.4.1 devam; `%1,5` yalnız test edilecek gölge alarm hipotezi. Eksik veride `UNKNOWN`.

## Bağımsız skor kanıt linkleri
- https://www.manutd.com/en/matches/mens-team/manchester-united-v-tottenham-hotspur-fc-premier-league-20261010?tab=post-match
- https://www.laliga.com/en-US/match/temporada-2026-2027-laliga-ea-sports-deportivo-alaves-malaga-cf-10
- https://www.skysports.com/football/stevenage-vs-mk-dons/report/561757
- https://www.chelseafc.com/en/news/article/match-report-chelsea-0-2-tottenham-hotspur
- https://www.bundesliga.com/en/bundesliga/news/sport-club-freiburg-bayern-munich-match-report-highlights-matchday-7-gnabry-kane-olise-39729
- https://www.trabzonspor.org.tr/tr/haberler/caykur-rizespor-3-4-trabzonspor-26-10-2026
- https://www.slbenfica.pt/pt-pt/agora/noticias/2026/10/26/futebol-cronica-santa-clara-benfica-9-jornada-liga-betclic
- https://www.laliga.com/en-ES/match/temporada-2026-2027-ligue-1-psg-lyon-8
- https://www.laliga.com/en-IN/match/temporada-2026-2027-laliga-ea-sports-sevilla-fc-ca-osasuna-10

## Makine-okunur eş rapor
`SXF_arastirma_arsivi/sinyal_performanslari/EARLY_CORE_235_T8_T6_Odds_Rise_Magnitude_2026-10-09_26_v2.json` — 48 kaynak sınıflı kayıt, timestamp, odds, çıktı ve tüm eşik tabloları.