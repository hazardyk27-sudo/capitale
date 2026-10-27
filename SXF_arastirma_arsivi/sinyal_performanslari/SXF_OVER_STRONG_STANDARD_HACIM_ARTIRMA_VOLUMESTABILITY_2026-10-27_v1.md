# SXF OVER 2.5 — STRONG'a ek hacim üreten STANDARD ve EXPANSION seçenekleri

**Tarih:** 27 Ekim 2026 | **Sadece SXF verileri** | **Research / shadow only**. Kullanıcının talebi: "strong dışında günlük sinyali arttıracağımız bir formül bulabilir miyiz?"

## Önce korunması gereken asıl motor
Mevcut `STABLE_OVER_2_5`: OVER money >=£1500, OVER share >=65%, OVER SXF odds 1.40–1.80.
Mevcut `PREMIUM_OVER_2_5`: OVER money >=£2500, OVER share >=75%, OVER SXF odds 1.40–1.80. Aynı maç/selection STABLE + PREMIUM çift sayılmaz.
T-6 geçmiş araştırma snapshotları gerçek AS_OF ile sınırlı; T8 kaydı decision'dan önce ve taze olmalı.

## Karşılaştırmalı adayların mekanizması
Bu, canlı asıl STABLE/PREMIUM motorun **üzerine gölge katmanlar** koyma araştırmasıdır, yeni takımların dinamik potansiyel havuzunun tüm taraması değildir.

**Ön şart:** STABLE veya PREMIUM seçimi, karar anına uygun, temiz T-6 SXF fixture snapshotı ve taze aynı fixture BTTS `YES` odds **>1.60** (C1). Bu piyasa, toplam gol ve çift takım gol davranışlarının farklı olduğu gerçeğine dayanan açıklayıcı bir inceleme hipotezidir; `>1.60` sonucu biliyor gibi bir fizik kanunu değildir.
- **Hacim teyidi (C2):** `OVER money >=£2500`.
- **Pay korunumu (C3):** `OVER share(T6)-OVER share(T8)>-2.00 puan`. Bu değer geriye dönük araştırmanın daha önce sonuçlarına bakılarak seçildiğinden geleceğe kör değildir.
- **STRONG:** C1+C2+C3 — mevcut not alınan güçlü motor.
- **STANDARD:** C1 ve [C2 **veya** C3], ancak ikisi aynı anda değil; STRONG dışındaki tekil maçlar.
- **EXPANSION / WATCH:** C1 var ama C2 ve C3 yok (zorla tavsiye verilmemeli); miktar £2500 altında ve pay T8→T6 en az 2pp düşmüş.
- C1 yoksa araştırma etiketlerinden biri yok. Kaynak farklıysa `UNVERIFIED`, canonical sinyalde değişiklik yok.
- Hem STRONG, hem STANDARD, hem EXPANSION **ayrık**: tek maç bir etiket.

## Tarihsel performans (9–25 Ekim; 17 takvim günü; 16:00–24:00 TSİ)
Temel arşiv 66 orijinal OVER STABLE/PREMIUM sinyali, 48 WIN (72.7%). Bir kaynak uyumsuzluğu (`Atalanta–Venezia`, BTTS T6 data stale ve OU25 T6 mismatch) çıkınca 65 temiz örnek, 47/65 (%72.31%).

| Ayrık grup | WIN / N | İsabet | 17 gün ortalama sinyal/gün |
|---|---:|---:|---:|
| **STRONG** | **16/17** | **94,12%** | **1,00** |
| **STANDARD, STRONG'a ek** | **12/15** | **80,00%** | **+0,88** |
| **İkisi birlikte — OR** | **28/32** | **87,50%** | **1,88** |
| **EXPANSION, ilave 5 maç** | **3/5** | **60,00%** | **+0,29** |
| **C1 hepsi (STRONG+STANDARD+EXPANSION)** | **31/37** | **83,78%** | **2,18** |
| Temiz temel v0.4 | 47/65 | 72,31% | 3,82 |

Sırf 2.00 sinyal/gün çıtasını aşmak için EXPANSION'u otomatik sinyal yapmak uygun değil: bu 5 adayın 2'si kayıp. Daha kaliteli standard ile **1.88/gün**, hepsini dahil eden C1 ile **2.18/gün**, ama ek son katman daha düşük kaliteye sahip.

**Dönem kontrolü:**
- STRONG 9–16: 10/11; 17–25: 6/6.
- STANDARD 9–16: 5/5; 17–25: 7/10.
- STRONG+STANDARD 9–16: 15/16; 17–25: 13/16.
- C1 all 9–16: 16/17; 17–25: 15/20.
- Sonradan seçilen gruplar olduğundan tarih ayrımı bağımsız/gerçek holdout DEĞİL.
- Gösterilen günlük oranlar takvim ortalamasıdır; günlerin hepsinde sinyal garantisi değildir (STRONG/ STANDARD birleşimi 13/17 günde en az bir sinyal, C1 tümü 14/17 gün).

## Günlük sinyal sayısı
| Tarih | STRONG | STANDARD (ek) | EXPANSION (opsiyonel) | Toplam C1 |
|---|---:|---:|---:|---:|
| 2026-10-09 | 3 | 0 | 0 | 3 |
| 2026-10-10 | 3 | 2 | 0 | 5 |
| 2026-10-11 | 1 | 0 | 0 | 1 |
| 2026-10-12 | 0 | 0 | 0 | 0 |
| 2026-10-13 | 1 | 0 | 1 | 2 |
| 2026-10-14 | 1 | 1 | 0 | 2 |
| 2026-10-15 | 2 | 2 | 0 | 4 |
| 2026-10-16 | 0 | 0 | 0 | 0 |
| 2026-10-17 | 0 | 2 | 0 | 2 |
| 2026-10-18 | 3 | 1 | 1 | 5 |
| 2026-10-19 | 1 | 0 | 0 | 1 |
| 2026-10-20 | 0 | 2 | 0 | 2 |
| 2026-10-21 | 0 | 0 | 1 | 1 |
| 2026-10-22 | 2 | 1 | 1 | 4 |
| 2026-10-23 | 0 | 0 | 0 | 0 |
| 2026-10-24 | 0 | 2 | 0 | 2 |
| 2026-10-25 | 0 | 2 | 1 | 3 |

## Tekil 37 maç için kanıt/denetim
| # | Tarih | Maç | Ayrık seviye | SXF BTTS YES odds T6 | OVER £ T6 | OVER pay değişimi T8→T6 pp | SXF OVER odds T6 | FT | Hit | UID |
|---|---|---|---|---:|---:|---:|---:|---|---|---|
| 1 | 2026-10-09 | Dortmund – Werder Bremen | STRONG | 1.67 | 2924.77 | 0.10 | 1.41 | 2-2 | WIN | `e0a7aff4-1ce3-4404-a7dc-e8f9e57d0a6d` |
| 2 | 2026-10-09 | Shelbourne – Sligo Rovers | STRONG | 1.87 | 6003.52 | -0.20 | 1.47 | 5-1 | WIN | `2f322d41-ba84-4b67-b540-c42c20d73c87` |
| 3 | 2026-10-09 | West Ham – QPR | STRONG | 1.74 | 5242.42 | -0.20 | 1.57 | 1-1 | LOSS | `a0dc59f0-eb1e-4061-bf6b-4757ecfee3ff` |
| 4 | 2026-10-10 | Hoffenheim – Hamburger SV | STANDARD | 1.64 | 2386.89 | 19.70 | 1.42 | 2-3 | WIN | `d97818bd-9dd4-4de5-bdbd-35ad8764152a` |
| 5 | 2026-10-10 | Aston Villa – Brentford | STRONG | 1.61 | 3146.20 | 3.80 | 1.70 | 2-2 | WIN | `b17f3a06-eb8b-4b99-99d6-5692b08a2885` |
| 6 | 2026-10-10 | WSG Wattens – SV Ried | STRONG | 1.68 | 4415.95 | 11.10 | 1.73 | 1-2 | WIN | `54a4fe73-5380-4fe3-8f2e-35009932c66a` |
| 7 | 2026-10-10 | Brest – Angers | STANDARD | 1.66 | 1591.96 | 1.10 | 1.73 | 5-1 | WIN | `4dd64c78-e0a0-4ca8-85a6-bcd3843d5df3` |
| 8 | 2026-10-10 | Napoli – Frosinone | STRONG | 1.66 | 14126.14 | 0.20 | 1.51 | 3-0 | WIN | `3f6ce57f-a20a-4001-acc3-da2a0fc3ad98` |
| 9 | 2026-10-11 | Racing Santander – Valencia | STRONG | 1.61 | 2613.24 | 0.30 | 1.72 | 2-2 | WIN | `bcbbddd2-1d63-49a7-bf61-45e422092720` |
| 10 | 2026-10-13 | Arsenal – Lille | EXPANSION | 2.26 | 2241.26 | -26.10 | 1.57 | 3-0 | WIN | `6938d0bc-5d5c-4cf9-a4ac-a59b3095a6a3` |
| 11 | 2026-10-13 | Villarreal – Napoli | STRONG | 1.66 | 3237.45 | 5.30 | 1.75 | 3-1 | WIN | `58c4adac-8c3d-43ee-96e4-d01a2e920174` |
| 12 | 2026-10-14 | Lask Linz – Liverpool | STRONG | 1.80 | 11626.21 | 9.10 | 1.59 | 3-6 | WIN | `70ca1d12-a91a-4fc2-9366-ec6cb7094a1c` |
| 13 | 2026-10-14 | Betis – Porto | STANDARD | 1.64 | 1608.34 | -0.80 | 1.78 | 3-2 | WIN | `f38db51f-d649-4dc8-9dbb-531935cf4e68` |
| 14 | 2026-10-15 | Hajduk Split – Ajax | STANDARD | 1.66 | 2447.07 | 16.70 | 1.56 | 2-1 | WIN | `57b0d0e0-0f1c-42c0-b085-909f0e1faa64` |
| 15 | 2026-10-15 | Lugano – Crvena Zvezda | STANDARD | 1.63 | 1685.81 | 0.10 | 1.77 | 3-2 | WIN | `e9d49a3c-e1b4-479f-9d5f-1cab7894c862` |
| 16 | 2026-10-15 | Torreense – Sunderland | STRONG | 2.10 | 8919.32 | 0.20 | 1.68 | 1-2 | WIN | `39ba662f-ed11-46e5-b5f7-3d28134a4f15` |
| 17 | 2026-10-15 | Freiburg – FK Jablonec | STRONG | 2.32 | 4512.68 | 8.30 | 1.52 | 3-2 | WIN | `1d17c896-6b8b-4038-999e-6b991b854460` |
| 18 | 2026-10-17 | Fulham – Hull | STANDARD | 1.84 | 1978.22 | 6.90 | 1.80 | 1-0 | LOSS | `489aba3a-5f19-4a47-b9e1-ccce4ae9c491` |
| 19 | 2026-10-17 | Bologna – Inter | STANDARD | 1.74 | 11428.72 | -7.90 | 1.70 | 1-3 | WIN | `b25a5bac-bdec-49bd-809d-133d753dea90` |
| 20 | 2026-10-18 | Brighton – Crystal Palace | STANDARD | 1.76 | 1659.44 | 0.30 | 1.59 | 5-0 | WIN | `bb10d807-2def-48d5-a192-a2e6fe4baa75` |
| 21 | 2026-10-18 | Celtic – Hearts | STRONG | 1.64 | 3631.47 | -0.90 | 1.54 | 7-1 | WIN | `0cfb0207-501e-43bc-a9ef-bd48036b3dbe` |
| 22 | 2026-10-18 | Basaksehir – Gaziantep FK | STRONG | 1.63 | 6166.19 | 3.60 | 1.56 | 2-1 | WIN | `cf191596-ecb5-4d94-824f-8428de792f31` |
| 23 | 2026-10-18 | Malaga – Real Sociedad | STRONG | 1.62 | 4739.20 | 13.20 | 1.73 | 2-5 | WIN | `ee815cd8-121a-4c00-b315-e030c8d2511b` |
| 24 | 2026-10-18 | Tromso – Kfum Oslo | EXPANSION | 1.95 | 2074.13 | -2.60 | 1.76 | 1-1 | LOSS | `77a4df15-2c97-4178-a156-644a5d3f0d2f` |
| 25 | 2026-10-19 | Tottenham – Coventry | STRONG | 1.76 | 6342.50 | 1.80 | 1.64 | 3-1 | WIN | `bfb4298f-b05f-4428-a490-f72062f22161` |
| 26 | 2026-10-20 | Fenerbahce – Slavia Prague | STANDARD | 1.64 | 5136.05 | -2.40 | 1.53 | 2-2 | WIN | `b4edec4f-7a53-4643-ad5b-510b12472f7d` |
| 27 | 2026-10-20 | Liverpool – Villarreal | STANDARD | 1.66 | 6571.91 | -3.90 | 1.50 | 4-3 | WIN | `a1a05138-aa61-433d-94bb-2f05a17a7768` |
| 28 | 2026-10-21 | Sporting Lisbon – Lask Linz | EXPANSION | 1.76 | 1990.32 | -5.40 | 1.40 | 2-3 | WIN | `5850f993-1227-49f0-882c-7ce2826b655d` |
| 29 | 2026-10-22 | FK Jablonec – Brighton | EXPANSION | 2.16 | 1547.10 | -4.30 | 1.46 | 0-0 | LOSS | `88a8a53c-8f66-4898-b885-bd4b19a8d4d2` |
| 30 | 2026-10-22 | Celtic – Celta Vigo | STRONG | 1.61 | 6915.76 | 13.30 | 1.73 | 1-2 | WIN | `7684c20a-0735-456c-a36d-94788793e898` |
| 31 | 2026-10-22 | Lillestrom – Real Sociedad | STRONG | 1.71 | 7866.06 | -1.80 | 1.50 | 0-6 | WIN | `489cf219-1a02-4bcb-abad-4077c0cbc5ac` |
| 32 | 2026-10-22 | Plzen – PFC Levski Sofia | STANDARD | 1.78 | 1597.67 | -0.30 | 1.80 | 1-2 | WIN | `1605478d-9523-4e0a-b9ed-84af28d3c6da` |
| 33 | 2026-10-24 | FC Utrecht – PEC Zwolle | STANDARD | 1.62 | 4013.04 | -2.20 | 1.58 | 1-1 | LOSS | `b71b32da-f9e9-40c4-adb3-bca932d0cb5b` |
| 34 | 2026-10-24 | Valencia – Villarreal | STANDARD | 1.66 | 3087.73 | -6.30 | 1.78 | 1-2 | WIN | `79359648-69f6-44ec-bc8d-15b00c8565b0` |
| 35 | 2026-10-25 | Auxerre – Le Mans | STANDARD | 1.66 | 1547.32 | 1.50 | 1.75 | 1-1 | LOSS | `20f7bba9-face-455e-9e6f-6e7de1de5cfd` |
| 36 | 2026-10-25 | CD Castellon – Sporting Gijon | EXPANSION | 1.94 | 2267.75 | -7.50 | 1.73 | 4-0 | WIN | `58151f71-3e0f-4302-97a2-aa7ef773fa75` |
| 37 | 2026-10-25 | Molde – Fredrikstad | STANDARD | 1.67 | 1606.53 | 10.20 | 1.46 | 5-1 | WIN | `74d5470d-d98c-4aba-b440-d32b42dc7b48` |

## İleriye dönük gerçek model planı — geçmiş seçim değil, karar anı teyidi
1. Bu sınıflandırmayı **29 Ekim ve sonrası ilk gelecek uygun tarihte** mutlak T-6 snapshotlarıyla **sonuçtan önce** kaydet; 26 Ekim mevcut research_archive.fixtures kaydında 16:00–24:00 fixture bulunmadığından bağımsız test bu gün için yapılamadı.
2. Kaynak snapshot zamanlarını ve `actual kickoff` ayrı sakla; karşılaşma yeni arşivde varsa sonradan skor ve takvim günleriyle denetle.
3. Minimum 50 **yeni ve ayrı** maçta STANDARD, tercihen 100+ ile temel ile ek hacmin isabeti, günlük hacmi, olasılık kalibrasyonunu ve gerçek bahis şirketi net fiyatlarında ROI'yi ölç; ayrıca tüm seçimlere ilişkin epistemik eksikliği raporla.
4. Bu çalışmada C1/C2/C3 ve oran eşikleri **aynı 9–25 sonuçlarını görerek** tespit edildi; retrospectif %87.5 ve %83.8 sonuçları future guarantee değildir. Diğer marketlerinden aynı veri geldiği için bağımsız kanıt gibi çifte sayma yok.
5. SXF kanonik v0.4 STABLE/PREMIUM eşikleri değişmedi, üretim için kullanıcı onayı gerekir.

**Referanslar:** [Mevcut STRONG araştırma notu](OVER_STRONG_Shadow_Research_Note_2026-10-26.md), [Tüm crossmarket kaynak kayıtları](over25_crossmarket_features_2026-10-09_25_v1.json), [Orijinal Üst filtre analiz raporu](SXF_OVER25_Filter_Research_2026-10-09_25_v1.md).
