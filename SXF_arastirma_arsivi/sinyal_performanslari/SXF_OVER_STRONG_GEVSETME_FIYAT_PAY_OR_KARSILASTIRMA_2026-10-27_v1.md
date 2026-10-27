# SXF OVER_STRONG — Orijinal kuralları gevşeterek yeni maç hacmi ölçümü (9–25 Ekim T-6)

**Tarih 27 Ekim 2026 · Audit-only · Canonical STABLE/PREMIUM ve OVER_STRONG üretim olarak değiştirilmedi.** Kullanıcı sorusu: OVER_STRONG'u **hafif** gevşetip günlük hacmi artırırken en az %75 isabet düzeyi mümkün mü?

## Temel, kaynak ve denetim
- Kaynak GitHub `over25_crossmarket_features_2026-10-09_25_v1.json`, kaynak SXF/supabase T-6 snapshot ve FT kaynakları. Orijinal STABLE/PREMIUM 66 sinyalinden **Atalanta–Venezia** T-6 ÜST kaynağı 1.57/£2528.26/%72.4 ile aynı UID snapshot 1.60/£1101.35/%77.9 eşleşmediği için **1 WIN dışlandı**. Temiz 65 maçta 47 WIN / 18 LOSS. Bu dosya tam SXF evrenini değil **yalnız orijinal STABLE/PREMIUM çıkan maçları** tarar; bağımsız yeni ÜST motoru iddiası taşımaz.
- Baz şart: gerçek karar anında **STABLE_OVER_2_5 veya PREMIUM_OVER_2_5** (OVER fiyat 1.40–1.80; pay >=65%; OVER hacmi >=£1500).
- Çapraz piyasa şartı: aynı maç T-6 `BTTS YES SXF odds>1.60` ve taze/aynı kaynak.
- Korunum metriği: `delta = OVER_share(T-6) - OVER_share(T-8)`, yüzde puan cinsinden, **delta > -2.0** = %2 puandan az düşüş (tam −2.00 dışarıda). T8 aynı UID tamam/taze.
- STRONG = base + `OVER £ >=2500` **AND** `delta > -2`.
- Birleşik gevşek model: base + **(`OVER £ >=2500` OR `delta > -2`)**. Diğer bütün şartlar korunur. Birinci ilave seçenek sadece alt para eşiği, ikinci ilave seçenek yalnız momentum düşüşü eşiğini rahatlatır.

## Çoklu kıyaslama
Aynı 65 kaynak temizlenmiş maçın 9–25 Ekim sonuçlarını kullanır:

| Tanım | WIN/N | İsabet | Maç/gün (17 takvim günü) | Ort. SXF Üst fiyatı | STRONG'a ek yeni WIN/N | Yeni alt-küme isabeti | 9–16 | 17–25 |
|---|---|---:|---:|---:|---|---:|---|---|
| STRONG | 16/17 | 94.12% | 1.00 | 1.609 | 0/0 | —% | 10/11 | 6/6 |
| £2000, pay korunumu | 18/19 | 94.74% | 1.12 | 1.596 | 2/2 | 100% | 12/13 | 6/6 |
| £1500, pay korunumu | 24/27 | 88.89% | 1.59 | 1.630 | 8/10 | 80% | 15/16 | 9/11 |
| £2500, pay düşüşü >−10 | 20/22 | 90.91% | 1.29 | 1.611 | 4/5 | 80% | 10/11 | 10/11 |
| PARA VEYA PAY | 28/32 | 87.5% | 1.88 | 1.628 | 12/15 | 80% | 15/16 | 13/16 |
| Yalnız BTTS >1.60 | 31/37 | 83.78% | 2.18 | 1.622 | 15/20 | 75% | 16/17 | 15/20 |

**Öne çıkan OR adayı**: 28/32 = 87.5% ve 1.88 maç/gün, ort SXF odds 1.628; bunların 17'si asıl STRONG, diğer 15 maçın **12** tanesi WIN (80.00%). 9–16 **15/16**, 17–25 **13/16**. STRONG 17 maçın tümü OR içinde, ek maçlar STRONG UID dışından, hiçbir çift sayım yok.
- Daha gevşek yalnız BTTS odds>1.60 ile 31/37 (83.78%); yeni 20 maçın 15'i WIN, 5'i LOSS (75%). Bu geçmişte >=%75 hedefi sağlasa da bir gevşetme daha ve ilave alt grubun isabeti hassas; OR daha dengeli öneri.
- £2500→£1500 tek değişim: **24/27, %88.89**, +10 ek maçta 8 WIN. Bu da teorik yumuşak genişleme seçeneği.

## Günlük seçim sayıları, birleşik OR
| Gün | STRONG | Ek | Toplam | Kazanan |
|---|---:|---:|---:|---:|
| 2026-10-09 | 3 | 0 | 3 | 2 |
| 2026-10-10 | 3 | 2 | 5 | 5 |
| 2026-10-11 | 1 | 0 | 1 | 1 |
| 2026-10-12 | 0 | 0 | 0 | 0 |
| 2026-10-13 | 1 | 0 | 1 | 1 |
| 2026-10-14 | 1 | 1 | 2 | 2 |
| 2026-10-15 | 2 | 2 | 4 | 4 |
| 2026-10-16 | 0 | 0 | 0 | 0 |
| 2026-10-17 | 0 | 2 | 2 | 1 |
| 2026-10-18 | 3 | 1 | 4 | 4 |
| 2026-10-19 | 1 | 0 | 1 | 1 |
| 2026-10-20 | 0 | 2 | 2 | 2 |
| 2026-10-21 | 0 | 0 | 0 | 0 |
| 2026-10-22 | 2 | 1 | 3 | 3 |
| 2026-10-23 | 0 | 0 | 0 | 0 |
| 2026-10-24 | 0 | 2 | 2 | 1 |
| 2026-10-25 | 0 | 2 | 2 | 1 |

## Birleşik 32 tekil sinyal, tarihsel izleme defteri
| # | Tarih | Maç | Seviye | SXF OVER para £ | OVER pay değişimi (T6−T8) pp | KG YES SXF odds | OVER SXF odds | FT | Sonuç | UID |
|---|---|---|---|---:|---:|---:|---:|---|---|---|
| 1 | 2026-10-09 | Dortmund – Werder Bremen | STRONG | 2924.77 | 0.10 | 1.67 | 1.41 | 2-2 | WIN | `e0a7aff4-1ce3-4404-a7dc-e8f9e57d0a6d` |
| 2 | 2026-10-09 | Shelbourne – Sligo Rovers | STRONG | 6003.52 | -0.20 | 1.87 | 1.47 | 5-1 | WIN | `2f322d41-ba84-4b67-b540-c42c20d73c87` |
| 3 | 2026-10-09 | West Ham – QPR | STRONG | 5242.42 | -0.20 | 1.74 | 1.57 | 1-1 | LOSS | `a0dc59f0-eb1e-4061-bf6b-4757ecfee3ff` |
| 4 | 2026-10-10 | Hoffenheim – Hamburger SV | EK | 2386.89 | 19.70 | 1.64 | 1.42 | 2-3 | WIN | `d97818bd-9dd4-4de5-bdbd-35ad8764152a` |
| 5 | 2026-10-10 | Aston Villa – Brentford | STRONG | 3146.20 | 3.80 | 1.61 | 1.70 | 2-2 | WIN | `b17f3a06-eb8b-4b99-99d6-5692b08a2885` |
| 6 | 2026-10-10 | WSG Wattens – SV Ried | STRONG | 4415.95 | 11.10 | 1.68 | 1.73 | 1-2 | WIN | `54a4fe73-5380-4fe3-8f2e-35009932c66a` |
| 7 | 2026-10-10 | Brest – Angers | EK | 1591.96 | 1.10 | 1.66 | 1.73 | 5-1 | WIN | `4dd64c78-e0a0-4ca8-85a6-bcd3843d5df3` |
| 8 | 2026-10-10 | Napoli – Frosinone | STRONG | 14126.14 | 0.20 | 1.66 | 1.51 | 3-0 | WIN | `3f6ce57f-a20a-4001-acc3-da2a0fc3ad98` |
| 9 | 2026-10-11 | Racing Santander – Valencia | STRONG | 2613.24 | 0.30 | 1.61 | 1.72 | 2-2 | WIN | `bcbbddd2-1d63-49a7-bf61-45e422092720` |
| 10 | 2026-10-13 | Villarreal – Napoli | STRONG | 3237.45 | 5.30 | 1.66 | 1.75 | 3-1 | WIN | `58c4adac-8c3d-43ee-96e4-d01a2e920174` |
| 11 | 2026-10-14 | Lask Linz – Liverpool | STRONG | 11626.21 | 9.10 | 1.80 | 1.59 | 3-6 | WIN | `70ca1d12-a91a-4fc2-9366-ec6cb7094a1c` |
| 12 | 2026-10-14 | Betis – Porto | EK | 1608.34 | -0.80 | 1.64 | 1.78 | 3-2 | WIN | `f38db51f-d649-4dc8-9dbb-531935cf4e68` |
| 13 | 2026-10-15 | Hajduk Split – Ajax | EK | 2447.07 | 16.70 | 1.66 | 1.56 | 2-1 | WIN | `57b0d0e0-0f1c-42c0-b085-909f0e1faa64` |
| 14 | 2026-10-15 | Lugano – Crvena Zvezda | EK | 1685.81 | 0.10 | 1.63 | 1.77 | 3-2 | WIN | `e9d49a3c-e1b4-479f-9d5f-1cab7894c862` |
| 15 | 2026-10-15 | Torreense – Sunderland | STRONG | 8919.32 | 0.20 | 2.10 | 1.68 | 1-2 | WIN | `39ba662f-ed11-46e5-b5f7-3d28134a4f15` |
| 16 | 2026-10-15 | Freiburg – FK Jablonec | STRONG | 4512.68 | 8.30 | 2.32 | 1.52 | 3-2 | WIN | `1d17c896-6b8b-4038-999e-6b991b854460` |
| 17 | 2026-10-17 | Fulham – Hull | EK | 1978.22 | 6.90 | 1.84 | 1.80 | 1-0 | LOSS | `489aba3a-5f19-4a47-b9e1-ccce4ae9c491` |
| 18 | 2026-10-17 | Bologna – Inter | EK | 11428.72 | -7.90 | 1.74 | 1.70 | 1-3 | WIN | `b25a5bac-bdec-49bd-809d-133d753dea90` |
| 19 | 2026-10-18 | Brighton – Crystal Palace | EK | 1659.44 | 0.30 | 1.76 | 1.59 | 5-0 | WIN | `bb10d807-2def-48d5-a192-a2e6fe4baa75` |
| 20 | 2026-10-18 | Celtic – Hearts | STRONG | 3631.47 | -0.90 | 1.64 | 1.54 | 7-1 | WIN | `0cfb0207-501e-43bc-a9ef-bd48036b3dbe` |
| 21 | 2026-10-18 | Basaksehir – Gaziantep FK | STRONG | 6166.19 | 3.60 | 1.63 | 1.56 | 2-1 | WIN | `cf191596-ecb5-4d94-824f-8428de792f31` |
| 22 | 2026-10-18 | Malaga – Real Sociedad | STRONG | 4739.20 | 13.20 | 1.62 | 1.73 | 2-5 | WIN | `ee815cd8-121a-4c00-b315-e030c8d2511b` |
| 23 | 2026-10-19 | Tottenham – Coventry | STRONG | 6342.50 | 1.80 | 1.76 | 1.64 | 3-1 | WIN | `bfb4298f-b05f-4428-a490-f72062f22161` |
| 24 | 2026-10-20 | Fenerbahce – Slavia Prague | EK | 5136.05 | -2.40 | 1.64 | 1.53 | 2-2 | WIN | `b4edec4f-7a53-4643-ad5b-510b12472f7d` |
| 25 | 2026-10-20 | Liverpool – Villarreal | EK | 6571.91 | -3.90 | 1.66 | 1.50 | 4-3 | WIN | `a1a05138-aa61-433d-94bb-2f05a17a7768` |
| 26 | 2026-10-22 | Celtic – Celta Vigo | STRONG | 6915.76 | 13.30 | 1.61 | 1.73 | 1-2 | WIN | `7684c20a-0735-456c-a36d-94788793e898` |
| 27 | 2026-10-22 | Lillestrom – Real Sociedad | STRONG | 7866.06 | -1.80 | 1.71 | 1.50 | 0-6 | WIN | `489cf219-1a02-4bcb-abad-4077c0cbc5ac` |
| 28 | 2026-10-22 | Plzen – PFC Levski Sofia | EK | 1597.67 | -0.30 | 1.78 | 1.80 | 1-2 | WIN | `1605478d-9523-4e0a-b9ed-84af28d3c6da` |
| 29 | 2026-10-24 | FC Utrecht – PEC Zwolle | EK | 4013.04 | -2.20 | 1.62 | 1.58 | 1-1 | LOSS | `b71b32da-f9e9-40c4-adb3-bca932d0cb5b` |
| 30 | 2026-10-24 | Valencia – Villarreal | EK | 3087.73 | -6.30 | 1.66 | 1.78 | 1-2 | WIN | `79359648-69f6-44ec-bc8d-15b00c8565b0` |
| 31 | 2026-10-25 | Auxerre – Le Mans | EK | 1547.32 | 1.50 | 1.66 | 1.75 | 1-1 | LOSS | `20f7bba9-face-455e-9e6f-6e7de1de5cfd` |
| 32 | 2026-10-25 | Molde – Fredrikstad | EK | 1606.53 | 10.20 | 1.67 | 1.46 | 5-1 | WIN | `74d5470d-d98c-4aba-b440-d32b42dc7b48` |

## Önemli analiz sınırı / kullanıcının ileriye dönük hedefi
- Farklı % ve £ eşiklerinin denendiği 9–25 Ekim veri evreni, sonuçları daha önce görülen keşif setidir: buradaki %87.50 **gelecek için minimum %75 garantisi DEĞİLDİR**. 28/32 için yaklaşık %95 Wilson alt sınırı %71.9 civarıdır.
- 9–16 / 17–25 satırları gerçek dış-örneklem test değildir; eşikler geçmiş kazanan/kaybedenleri gördükten sonra tarandı. Üretim aktivasyonu için gelecekteki maçlarda T-6 karar anında sonuçsuz shadow sinyalini sabitlemek ve en az 50–100 yeni örnekte doğrulamak gerekir.
- Tüm maç sayıları **17 takvim günü ortalaması**, her takvim gününde 2 maç garantisi yok. Gerçek yürütülebilir bahis oranı ve ROI bağımsız doğrulanmadı.
- Bu kaynak `STABLE/PREMIUM` başlangıç sinyallerine BAĞLIDIR; kullanıcı ayrıca mevcut sinyallerden tamamen bağımsız motor istiyorsa ayrı geniş evren taranması gerekir. `SXF v0.4` aktif motorları değişmedi.

**Source:** [SXF Crossmarket archive](over25_crossmarket_features_2026-10-09_25_v1.json), [original strong hypothesis](OVER_STRONG_Shadow_Research_Note_2026-10-26.md).
