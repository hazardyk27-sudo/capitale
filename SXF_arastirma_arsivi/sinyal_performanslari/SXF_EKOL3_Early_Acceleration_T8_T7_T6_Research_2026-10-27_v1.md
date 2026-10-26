# SXF 1X2 — EKOL 3 / ERKEN İVME + FİYAT TEYİDİ (MEKANİZMA TABANLI KEŞİF)

**Tarih:** 2026-10-27 (araştırma). **Statü:** EXPLORATORY SHADOW ONLY. **Canonical SXF değiştirilmedi**.

## Kritik dürüstlük / seçilim sınırı
Araştırmacı 9–25 Ekim toplam geçmiş skorlarını ve Ekol-1/Ekol-2 geçmiş performansını zaten biliyordu. Ekol-3 ilk saat ivmesi kuralı **bu aynı tarihsel 48 seçimin alternatif açıklamasını test ederken ortaya çıkarıldı.** Bu bir bağımsız gelecek testi, gerçek pre-registered blind holdout veya ≥%85 gelecek başarı garantisi DEĞİL. Birçok hipoteze bakıldığı için gözlenen %85,3 olduğundan iyi görünebilir. Yalnız yeni T-6 günlerinde dondurulmuş kuralla test edilecek.

## Gerekçe ve kesin tanım
- Para yoğunluğunun gerçekten güçlenmesi testinde son iki saat pozitif ivme + seçimin de-vig fiyatında gerilememe zaten Ekol-2 aday temeli; bu 48/184 settled V1 fırsatını verir.
- T-8 ile T-6 arasında tüm yeni para yalnız son saatte girebilir; bu kitle hamlesi / gecikmeli piyasa tepkisi olabilir. **Erken güçlenme** hipotezi T-8→T-7 ara periyodunda dahi seçilen takımın yeni paradan aldığı payın T-8'deki mevcut toplam payı geçmesini şart koşar.
- `Δ₁_i=V_i(T-7)-V_i(T-8)`; her i=1,X,2 için `Δ₁_i>=0`; `sum(Δ₁)>0`; `M₁=Δ₁_pick/sum(Δ₁)`; `S8=V_pick(T-8)/sum(V_i(T-8))`; **M₁>S8**.
- Ekol-2 kesin fiyat teyidi korunur: `P_pick^devig(T-6)>=P_pick^devig(T-8)` (1/X/2 üç oran marj arındırılmış). T-8→T-6 iki saat yeni para payı `M₂>S8` korunur, tüm Δ_i negatif olmamalı.
- T-8, T-7, T-6 ayrı kaynak snapshotlarından, her biri target anından <=10min eski, 1/X/2 aynı kaynak timestamp. T-6 seçilen oran arşivle ±0.02, para payı ±2 puan. Karar her maçta tam T-6; T-5/T-4 verisi yok. Eksik kayıt = no new tag.
- Yalnız SXF SmartXFlow para+odds, NEWS/ANALYST/POLY dışlandı. V1, V2, HEAVY eşikleri ve motorları değişmedi.
- Early Accel T-7 koşulu **7 saat önce sinyal verilmesini gerektirmez**: T-7 ve T-8 geçmiş iki referans noktasıdır, karar T-6.

## Tarihsel sonuç, 9–25 Ekim, 17 gün
| Sınıf | WIN/N | İsabet | Tekil/gün | Aktif gün |
|---|---:|---:|---:|---:|
| Ekol-2 mevcut iki saat ivme+fiyat | **36/48** | 75.00% | 2.82 | 13/17 |
| **Ekol-3 erken ivme** | **29/34** | **85.29%** | **2.00** | **13/17** |
| Erken ivme OLMAYAN kalan | **7/14** | 50.00% | 0.82 | 9/17 |
| Erken ivme + ayrıca son saat ivmesi | **19/22** | 86.36% | 1.29 | - |
| **SOFT / yüksek sinyal hacmi:** ilk saat ivmesi VAR VEYA son saatte fiyat gerilememiş | **36/47** | 76.60% | 2.76 | 13/17 |

Erken ivme grubu zaman parçaları: **9–16 Ekim 8/10; 17–25 Ekim 21/24**. Bu gün bölümü de araştırma sürecinden önce gizlenmiş holdout değildir.

**Örnek büyüklüğü sorunu:** 29/34 grubun nominal Wilson %95 başarı oranı güven aralığı yaklaşık **%69,9–93,5** (kümelenme ve çoklu tarama dahil edilmez). 34/17=2.0 **yalnız dönem ortalaması**; her gün >=2 garanti değil. Gerçek saha/oynanabilir bookmaker oranı doğrulanmadı; yüksek hit, gerçek pozitif ROI demek değildir.
- Early first-hour total money flow >0 group median first-hour total inflow: **£1,351**, minimum: **£8**. Küçük akışlarda ölçüm/scrape anomalileri araştırılmalıdır.
- Yeni filtrenin 48 sinyalden eledikleri: 14 (7 WIN + 7 LOSS). Filtre belirli günlere, favorilere ya da varyans koşullarına bağımlı olabilir. Odds seçilerek ezber yapılmadı; ancak mekanizma zaten sonuçlar bilinirken keşfedildi.
- Geçmiş SXF oranıyla model ortalama selected odds **1.732**. Gerçek bahis yürütme ve bookmakers book odds yok.

## 34 erken ivme sinyali, T-8 / T-7 / T-6 ham seçilen para ve oranı
Para üçlüsü sırasıyla T-8 → T-7 → T-6, quoted `odds` aynı sırada. 'İlk saat %' alanı eski T-8 selected pay → T-8/T-7 arasında gelen yeni paranın selected yüzde oranı. '2 saat %' T-8 eski baz → T-8/T-6 yeni para yüzde oranı. 'Δ Fiyat' marj arındırılmış selected probability T-6 eksi T-8 (yüzde puan).
| Gün | Maç → Seçim | FT / Hit | T-8 → T-7 → T-6 £ picked | T-8 → T-7 → T-6 SXF odds | İlk saat payı eski → yeni | İki saat payı eski → yeni | Δ seçilen fiyat (pp) |
|---|---|---|---|---|---|---|---|
| 10-09 | Al-Fateh (KSA) – Al Ahli → Al Ahli | 0-4 ✅ | £503 → £6,329 → £6,349 | 1.48 → 1.49 → 1.48 | 88.6% → **94.3%** | 88.6% → 94.3% | 0.3% |
| 10-10 | Rizespor – Fenerbahce → Fenerbahce | 0-3 ✅ | £3,413 → £3,486 → £9,698 | 1.78 → 1.77 → 1.74 | 75.6% → **82.4%** | 75.6% → 96.2% | 1.3% |
| 10-10 | RAAL La Louviere – Club Brugge → Club Brugge | 1-4 ✅ | £1,447 → £1,556 → £1,572 | 1.42 → 1.41 → 1.41 | 84.1% → **97.9%** | 84.1% → 93.8% | 0.3% |
| 10-11 | Betis – Osasuna → Betis | 5-2 ✅ | £100,031 → £115,675 → £126,546 | 1.55 → 1.53 → 1.55 | 86.2% → **93.9%** | 86.2% → 92.0% | 0.3% |
| 10-14 | Viktoria Koln – SG Sonnenhof → Viktoria Koln | 2-2 ❌ | £1,089 → £2,157 → £2,284 | 1.64 → 1.59 → 1.57 | 95.0% → **98.0%** | 95.0% → 97.5% | 2.0% |
| 10-15 | Lech Poznan – Leverkusen → Leverkusen | 0-4 ✅ | £43,635 → £68,397 → £71,631 | 1.65 → 1.65 → 1.63 | 85.6% → **90.6%** | 85.6% → 86.4% | 0.7% |
| 10-15 | Red Bull Salzburg – AC Milan → AC Milan | 0-4 ✅ | £115,500 → £158,777 → £174,311 | 2.08 → 2.12 → 2.04 | 83.5% → **95.7%** | 83.5% → 91.9% | 1.0% |
| 10-15 | Muglaspor – Bursaspor → Bursaspor | 0-3 ✅ | £2,382 → £2,394 → £2,400 | 1.70 → 1.67 → 1.67 | 97.9% → **99.5%** | 97.9% → 99.7% | 0.4% |
| 10-15 | Hoffenheim – Besiktas → Hoffenheim | 2-3 ❌ | £61,467 → £62,716 → £63,276 | 2.06 → 2.06 → 2.06 | 80.5% → **80.7%** | 80.5% → 83.8% | 0.1% |
| 10-16 | Bohemians – Waterford → Bohemians | 2-1 ✅ | £2,530 → £2,741 → £2,996 | 1.79 → 1.77 → 1.77 | 80.5% → **85.8%** | 80.5% → 91.0% | 0.5% |
| 10-17 | EIF – KaPa → KaPa | 3-2 ❌ | £843 → £1,297 → £1,331 | 2.28 → 2.18 → 2.08 | 79.4% → **90.1%** | 79.4% → 89.3% | 3.9% |
| 10-17 | Genclerbirligi – Galatasaray → Galatasaray | 0-1 ✅ | £3,763 → £4,072 → £4,936 | 1.44 → 1.42 → 1.42 | 80.3% → **100.0%** | 80.3% → 96.2% | 0.5% |
| 10-17 | Roma – Genoa → Roma | 2-0 ✅ | £195,189 → £202,666 → £210,123 | 1.64 → 1.62 → 1.62 | 84.6% → **90.8%** | 84.6% → 92.1% | 0.8% |
| 10-17 | Boyaca Chico – Atletico Nacional Medellin → Atletico Nacional Medellin | 1-4 ✅ | £1,556 → £1,709 → £2,501 | 1.55 → 1.50 → 1.51 | 83.0% → **100.0%** | 83.0% → 96.9% | 1.0% |
| 10-18 | Leverkusen – Freiburg → Leverkusen | 2-1 ✅ | £41,042 → £48,184 → £58,947 | 1.66 → 1.66 → 1.67 | 79.8% → **98.0%** | 79.8% → 92.7% | 0.1% |
| 10-18 | Valerenga – Brann → Valerenga | 3-1 ✅ | £913 → £1,853 → £2,252 | 2.44 → 2.42 → 2.38 | 73.0% → **88.9%** | 73.0% → 89.4% | 0.9% |
| 10-18 | AC Milan – Atalanta → AC Milan | 3-2 ✅ | £66,391 → £71,170 → £77,459 | 1.79 → 1.80 → 1.79 | 83.4% → **85.3%** | 83.4% → 88.6% | 0.0% |
| 10-20 | Oxford Utd – Wigan → Oxford Utd | 2-1 ✅ | £2,165 → £2,263 → £2,946 | 2.04 → 2.02 → 2.00 | 82.4% → **87.0%** | 82.4% → 94.4% | 0.5% |
| 10-20 | Liverpool – Villarreal → Liverpool | 4-3 ✅ | £233,082 → £255,949 → £266,160 | 1.55 → 1.54 → 1.54 | 85.3% → **92.3%** | 85.3% → 92.6% | 0.4% |
| 10-20 | Napoli – Bodo Glimt → Napoli | 4-3 ✅ | £78,313 → £130,988 → £138,210 | 1.80 → 1.79 → 1.80 | 82.5% → **97.4%** | 82.5% → 97.2% | 0.0% |
| 10-22 | Inter Club Escaldes – Universitatea Craiova → Universitatea Craiova | 1-3 ✅ | £6,640 → £7,392 → £7,891 | 1.62 → 1.63 → 1.62 | 92.9% → **99.7%** | 92.9% → 95.0% | 1.0% |
| 10-22 | Hoffenheim – Lyon → Hoffenheim | 3-0 ✅ | £121,617 → £175,961 → £186,774 | 2.14 → 2.12 → 2.12 | 83.4% → **95.1%** | 83.4% → 91.0% | 0.7% |
| 10-23 | First Vienna Fc 1894 – Floridsdorfer AC → First Vienna Fc 1894 | 2-0 ✅ | £1,095 → £1,652 → £4,996 | 1.75 → 1.77 → 1.65 | 82.8% → **93.0%** | 82.8% → 96.2% | 2.2% |
| 10-23 | Nancy – Laval → Nancy | 1-0 ✅ | £1,351 → £1,766 → £1,790 | 1.74 → 1.71 → 1.72 | 83.2% → **88.8%** | 83.2% → 86.8% | 0.4% |
| 10-23 | Derry City – Dundalk → Derry City | 2-1 ✅ | £372 → £2,436 → £2,452 | 1.94 → 1.83 → 1.82 | 71.1% → **96.0%** | 71.1% → 95.4% | 2.4% |
| 10-24 | Arsenal – Everton → Arsenal | 2-0 ✅ | £224,370 → £303,125 → £339,710 | 1.51 → 1.49 → 1.47 | 82.4% → **91.4%** | 82.4% → 86.0% | 2.0% |
| 10-24 | Chesterfield – Crewe → Chesterfield | 5-1 ✅ | £6,307 → £8,646 → £9,393 | 1.73 → 1.72 → 1.72 | 89.4% → **99.2%** | 89.4% → 98.6% | 0.1% |
| 10-24 | Lazio – Parma → Lazio | 2-1 ✅ | £52,448 → £126,378 → £130,197 | 1.52 → 1.52 → 1.52 | 76.8% → **98.5%** | 76.8% → 97.6% | 0.0% |
| 10-24 | Westerlo – Waasland-Beveren → Westerlo | 4-4 ❌ | £4,778 → £5,842 → £6,864 | 2.08 → 2.04 → 1.93 | 79.7% → **92.2%** | 79.7% → 89.8% | 3.5% |
| 10-24 | Quindio – Tigres FC Zipaquira → Quindio | 2-0 ✅ | £3,117 → £3,125 → £3,125 | 1.64 → 1.64 → 1.64 | 96.1% → **100.0%** | 96.1% → 100.0% | 0.0% |
| 10-25 | Midtjylland – Lyngby → Midtjylland | 3-2 ✅ | £845 → £887 → £1,304 | 1.46 → 1.45 → 1.46 | 84.9% → **93.9%** | 84.9% → 94.5% | 0.2% |
| 10-25 | Thun – Lugano → Lugano | 2-3 ✅ | £926 → £1,034 → £1,523 | 1.88 → 1.89 → 1.89 | 78.2% → **90.6%** | 78.2% → 96.3% | 0.3% |
| 10-25 | Hull – Brentford → Brentford | 1-1 ❌ | £157,387 → £168,860 → £181,147 | 1.72 → 1.70 → 1.70 | 84.2% → **86.3%** | 84.2% → 90.0% | 0.8% |
| 10-25 | Udinese – AC Milan → AC Milan | 0-2 ✅ | £141,108 → £194,411 → £235,660 | 1.89 → 1.89 → 1.89 | 83.9% → **97.1%** | 83.9% → 95.5% | 0.2% |
## Elenen 14 maç — kontrol grubu
| Gün | Maç → Seçim | FT / Hit | T-8 → T-7 → T-6 £ picked | T-8 → T-7 → T-6 SXF odds | İlk saat payı eski → yeni | İki saat payı eski → yeni | Δ seçilen fiyat (pp) |
|---|---|---|---|---|---|---|---|
| 10-10 | Wealdstone – Yeovil → Yeovil | 0-6 ✅ | £1,870 → £1,941 → £2,164 | 2.34 → 2.34 → 2.34 | 85.7% → **66.1%** | 85.7% → 86.3% | 0.2% |
| 10-11 | Mallorca – Las Palmas → Mallorca | 3-1 ✅ | £667 → £692 → £1,354 | 1.60 → 1.60 → 1.60 | 78.9% → **54.6%** | 78.9% → 96.5% | 0.3% |
| 10-16 | Galway Utd – Shamrock Rovers → Shamrock Rovers | 2-0 ❌ | £3,959 → £4,183 → £5,363 | 1.82 → 1.81 → 1.83 | 98.4% → **95.5%** | 98.4% → 98.5% | 0.5% |
| 10-17 | Birmingham – QPR → Birmingham | 3-0 ✅ | £8,451 → £9,035 → £11,342 | 2.10 → 2.08 → 2.08 | 81.1% → **76.9%** | 81.1% → 84.6% | 1.1% |
| 10-17 | Leyton Orient – Blackpool → Leyton Orient | 2-0 ✅ | £2,503 → £2,503 → £4,468 | 2.38 → 2.38 → 2.28 | 85.0% → **0.0%** | 85.0% → 86.6% | 1.8% |
| 10-18 | Brighton – Crystal Palace → Brighton | 5-0 ✅ | £135,482 → £138,585 → £152,915 | 1.53 → 1.53 → 1.51 | 85.7% → **72.2%** | 85.7% → 88.3% | 0.3% |
| 10-18 | Mafra – Santa Clara → Santa Clara | 2-2 ❌ | £1,149 → £1,149 → £1,162 | 1.66 → 1.66 → 1.65 | 95.2% → **NaN%** | 95.2% → 100.0% | 0.1% |
| 10-20 | Fenerbahce – Slavia Prague → Fenerbahce | 2-2 ❌ | £40,765 → £48,306 → £123,809 | 1.63 → 1.64 → 1.62 | 80.9% → **76.3%** | 80.9% → 95.0% | 0.1% |
| 10-22 | Dinamo Zagreb – NEC Nijmegen → Dinamo Zagreb | 2-4 ❌ | £45,266 → £46,728 → £55,554 | 1.56 → 1.56 → 1.53 | 89.0% → **88.0%** | 89.0% → 90.3% | 1.5% |
| 10-22 | Pafos FC – FK Riga → Pafos FC | 1-1 ❌ | £1,707 → £1,719 → £1,973 | 1.65 → 1.65 → 1.64 | 87.8% → **83.3%** | 87.8% → 89.2% | 0.1% |
| 10-24 | Barnet – Oldham → Barnet | 1-1 ❌ | £2,290 → £2,311 → £5,065 | 1.80 → 1.78 → 1.75 | 82.5% → **36.4%** | 82.5% → 92.8% | 1.4% |
| 10-25 | Marseille – Le Havre → Marseille | 4-3 ✅ | £37,478 → £38,855 → £44,120 | 1.55 → 1.53 → 1.52 | 79.4% → **75.7%** | 79.4% → 88.0% | 0.7% |
| 10-25 | Club Atletico Mitre – Godoy Cruz → Godoy Cruz | 0-3 ✅ | £3,903 → £3,949 → £4,238 | 1.97 → 1.96 → 1.91 | 85.6% → **77.5%** | 85.6% → 94.3% | 1.8% |
| 10-25 | Palestino – Colo Colo → Colo Colo | 1-1 ❌ | £5,720 → £5,720 → £5,726 | 1.90 → 1.90 → 1.90 | 98.0% → **NaN%** | 98.0% → 100.0% | 0.0% |

## Kaynak ve replikasyon
- `SXF_arastirma_arsivi/sinyal_performanslari/loss_features_2026-10-09_16_v1.json`
- `SXF_arastirma_arsivi/sinyal_performanslari/loss_features_2026-10-17_25_v1.json`
- `public.moneyway_snapshots Supabase SELECT read-only (fixture UID + T-8,T-7,T-6 latest eligible three-side snapshot)`

## Önerilen karar
- **Ekol-3 EARLY_ACCEL = gelecekte gölge takiple değerlendirilecek ARAŞTIRMA HİPOTEZİ**. Mevcut 48 sinyal içinden 34 seçer; kaynak ve sonuç bazlı ayrımlar yeniden arşivlenebilir.
- **Gelecekte performans**: en az 100 yeni tekil sinyal, yeni T-6 karar anında dondurulmuş 8/7/6 snapshotları, maç/lig/odds dengesi, gerçek oynanabilir oran ve ROI. Hit ≥75–80 sınırı ve ≥2/gün **prospektif** olarak ölçülmeli.
- Yeni Ekol-3 kuralını geçmiş sonuçlara göre tekrar optimize etmek YOK. SOFT 47/36 sürümü yalnız hacim referansıdır, bir kaybedeni elemesi sağlam iyileşme kanıtı değildir.


## Birlikte not alınan SXF geliştirme adayları (2026-10-27)

Kullanıcının isteğiyle bu araştırma adayı, diğer motor adayıyla aynı listede tutuluyor: [OVER_STRONG + EKOL 3 geliştirme adayları](SXF_GELISTIRME_ADAYLARI_OVER25_EKOL3_2026-10-27.md). Bu çapraz referans **aktif motora alma veya kanonik kural değişikliği değildir**.
