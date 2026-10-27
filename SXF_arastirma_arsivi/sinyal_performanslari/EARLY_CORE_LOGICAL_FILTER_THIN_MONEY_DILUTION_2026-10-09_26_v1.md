# EARLY CORE — mantıksal risk filtresi araştırması (9–26 Ekim 2026)
**Durum:** EXPLORATORY / SHADOW_ONLY; hiçbir Pratik Arşiv kaydı, kanonik metodoloji, Supabase konfigürasyonu veya canlı motor değiştirilmedi.
**Kapsam:** Owner-approved SXF v0.4.1 EARLY CORE 1X2, karar fiyatı ≤2,35, retrospective frozen araştırma sinyalleri. 81 sinyal: 56 WIN/25 LOSS (%69,14). 9–25 sinyalleri frozen loss_features; 26 Ekim dört frozen signal. Pratik Arşiv `archive/2026/10/DD/05_pratik_arsiv/checkpoints.jsonl.gz` origin/ara/T6 gerçek as-of snapshot destek kontrolünde kullanıldı. Büyük 10/11/17/18 Ekim .gz dosyalarının bütün satırları yeniden okunmuş DEĞİL; bu günler frozen sinyal bazında. FT yalnız etiket.
## Mekanizma hipotezi: İnce erken piyasa + sonradan dağılan para
EARLY CORE ilk T72/T60/T40/T24'te paranın takım tarafına yığılması nedeniyle geçiyor. Ancak başlangıçtaki %95–100 yoğunlaşma küçük toplam bahis hacminde (örneğin yalnızca £5k–£15k) oluşabilir. Daha kalabalık piyasa ortaya çıktığında seçilen takımın payı anlamlı düşebilir; Retention55 yine geçtiğinden sinyal devam eder. Fiyatın düşmesi bile bu para-dilüsyon riskini her zaman yakalamaz.
**Gölge risk bayrağı (4 koşul birlikte):** 
- frozen karar 1X2 seçilen fiyatı **<2,00**
- ilk EARLY origin selected money share **≥%95**
- ilk seçilen para **<£15.000**
- gerçek karar as-of selected money share **<%90**
Belirlenmiş eşikler sonuçlara bakıldıktan sonra seçilmiştir. Kanonik veto DEĞİL. Karar T8 ise T6 gözlemini kullanmak YASAK; dinamik gerçek as-of kullanılmalı.
## 81'de gözlenen sonuç
| Grup | Sinyal | Kazandı | Kaybetti | İsabet |
|---|---:|---:|---:|---:|
| EARLY CORE orijinal | 81 | 56 | 25 | %69,14 |
| Dört risk kriteri tamamı | 8 | 1 | 7 | %12,50 |
| Riskli çıkarılmış varsayımsal | 73 | 55 | 18 | %75,34 |
| <2,00 odds, risk olmadan | 52 | 44 | 8 | %84,62 |
Risk filtresi orijinal sinyallerin %9,9'unu eler; kayıpların 7/25=%28'ini yakalar; kazananların 1/56=%1,8'ini eler. Sadece geçmiş karşılaştırma; ileriye yönelik performans değil.
## 8 işaretli maçın tamamı
| Tarih | Maç → tercih | SXF karar odds | İlk GBP / pay | Karar payı | FT | Sonuç |
|---|---|---:|---|---|---|---|
| 20 Ekim | Porto – PSV → Porto | 1.59 | £10,168 / %97.9 | %84.5 | 0-1 | LOSS |
| 21 Ekim | Sporting Lisbon – Lask Linz → Sporting Lisbon | 1.30 | £10,900 / %97.0 | %89.7 | 2-3 | LOSS |
| 22 Ekim | Dinamo Zagreb – NEC Nijmegen → Dinamo Zagreb | 1.53 | £10,125 / %97.5 | %89.2 | 2-4 | LOSS |
| 22 Ekim | Juventus – Rennes → Juventus | 1.47 | £5,014 / %98.5 | %86.3 | 2-2 | LOSS |
| 22 Ekim | Lech Poznan – Sunderland → Sunderland | 1.78 | £12,656 / %96.7 | %78.1 | 1-1 | LOSS |
| 22 Ekim | NK Celje – Red Bull Salzburg → Red Bull Salzburg | 1.57 | £6,159 / %98.5 | %83.4 | 2-2 | LOSS |
| 23 Ekim | Alaves – Malaga → Alaves | 1.69 | £5,562 / %95.1 | %87.1 | 1-1 | LOSS |
| 25 Ekim | Real Sociedad – Levante → Real Sociedad | 1.62 | £10,241 / %95.6 | %82.6 | 2-1 | WIN |
**Risk grubundaki kayıplar:** 4 DRAW, 3 rakip galibiyetidir. Tek false-positive: Real Sociedad–Levante (2-1). Örneğin 22 Ekim Juventus–Rennes: origin £5014 / %98,5 -> T6 %86,3; 1X2 selected odds T8 1,51→T6 1,47 düşmesine rağmen 2-2. Bu nedenle salt olumsuz fiyat değişimi filtresi bunu yakalayamaz.
## Kontrol: düşük karar odds ve ilk yoğunlaşma ayrı düşünüldüğünde
- Karar SXF odds <2,00 tüm grup: 45/60 (%75,0), ortalama odds ~1,59.
- Odds <2 ve origin share <%95: **38/46 (%82,61)**. 9–16 Ekim **15/18 (%83,33)**; 17–26 Ekim **23/28 (%82,14)**.
- Odds <2 ve origin share ≥%95: **7/14 (%50,0)**, ortalama odds ~1,525 (diğer grubun ortalaması ~1,614). Bu fark düşük odds ile açıklanıyor görünmüyor fakat dönemsele göre çok değişiyor: 9–16 Ekim **4/4**, 17–26 Ekim **3/10**.
- 20–23 Ekim'de risk grubunda 7/7 kayıp bulunur; 24–26 Ekim'de yalnız 1 riskli sinyal vardır ve KAZANMIŞTIR. Dolayısıyla sahici ileriye dönük doğrulama YOK.
## £ erken limit stres testi (aynı diğer 3 kriter)
| İlk tutar üst sınırı | Elenen kayıp / kazanan | Kalan |
|---|---|---|
| £10,000 | 3L / 0W | 56/78 (%71.79) |
| £12,000 | 6L / 1W | 55/74 (%74.32) |
| £15,000 | 7L / 1W | 55/73 (%75.34) |
| £20,000 | 7L / 1W | 55/73 (%75.34) |
£ eşiği liga ve piyasaya normalize edilmemiştir. Farklı liglerin £ hacim dağılımları aynı değildir. Bu yüzden yalnızca gölge etiket uygundur.
## Mevcut T8→T6 fiyat filtresiyle tamamlayıcılık (aynı valid T8/T6 alt grubu)
- Fiyat +%1,5 üzeri: 5 (4L/1W).
- İnce-erken/payı-eriyen bayrağı: aynı alt grupta 8 (7L/1W); fiyat filtresiyle kesişim yalnız **Alaves–Malaga**.
- İkisinden herhangi biri: **12 elenen (10L/2W)**; bu 48 karşılaştırılabilir sinyalin kalanında **29/36 = %80,56** (filtresiz 31/48 = %64,58). **Bu kombinasyon sonuçlar görüldükten sonra kuruldu. 33 sinyal T8/T6 geçmişi eksik ve geniş örnekleme genellenemez.** Prospektif dış test olmadan motor veto ya da %80+ vaadi DEĞİLDİR.
## Negatif kontroller
- İlk yüksek para **tek başına** düzenli monoton başarı sağlamıyor: ≥£15k n30 24W/6L, ≥£20k n15 10W/5L.
- İlk pay %95 üstü tek başına zamansal olarak kararsız.
- Mevcut selected share≥%80, retention min≥75, T6 toplam para büyümesi≥4x/8x, HEAVY veya V2 etiketleri standalone kalite ayrımı göstermedi.
- Karar odds<2 seleksiyonu doğal favori kazanma oranı artışıdır; bu tek başına edge/ROI kanıtı değildir.
## Öneri / doğrulama
Yeni `EARLY_THIN_CONCENTRATION_DILUTION` adlı **shadow risk etiketi** fikri test edilebilir; ÜRETİM sinyali engellemesi ŞİMDİLİK YOK. Eşiklerin sabitlenip gelecekteki EARLY CORE maçları için exact-as-of T24→T12→T8→T6 kaynak doğruluğu, erken toplam para ve normalizasyonu, odds bandı, lig, sonuç ve yanlış elenmiş kazananlar toplansın; ileriye dönük doğrulanmadan kalıcı model kararı yok.
**Ham Pratik Arşiv dosyalarına hiç dokunulmadı.**
**Tüm 81 satırın donmuş risk alanları ve ayrı çapraz testler:** [JSON](EARLY_CORE_LOGICAL_FILTER_THIN_MONEY_DILUTION_2026-10-09_26_v1.json).
