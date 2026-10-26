# CAPİTALE SXF — Üst 2.5 Motorunu Geliştirme Araştırması

**9–25 Ekim 2026 · T-6 karar anı · Kaynak: orijinal SXF sinyal JSON + 90 dakika FT + salt-okunur Moneyway T-8/T-6 geçmişi.**

> **ARAŞTIRMA / SHADOW-TEST ÖNERİSİDİR.** SXF v0.4 motor şartlarına dokunulmadı. Eşikler sonuçları görerek keşfedildi, ileriye dönük bir tahmin başarı garantisi değildir.

## 1. Örneklem ve veri bütünlüğü

- **Başlangıç:** 66 Üst 2.5 sinyali; 48 başarılı, 18 başarısız (%72,7). STABLE 24/33, PREMIUM 24/33.
- İlk eşleştirmede 66 maçın tamamında T-6'ya kadar 1X2, BTTS ve Over piyasaları vardı; 65 maçta T-8'in tam Over seti vardı.
- **Kaynak uyumsuzluğu — Atalanta–Venezia (12 Ekim):** Araştırma sinyal JSON'unda T-6 Over **1,57 / £2.528,26 / %72,4**, `public.moneyway_snapshots` aynı karar noktasında **1,60 / £1.101,35 / %77,9**. Ayrıca `public` BTTS en son gözlemi ~632,6 dakika önce. Bu **T-8/T-6 saat ihlali değil**; iki kaynağın uyumsuzluğu ve BTTS yaşlılığıdır. Bağımsız çapraz piyasa filtrelerinin başarı hesabından **1 kazanmış seçim çıkarıldı**.
- **Uyumlu karşılaştırma kümesi:** 65 seçim, 47 kazanan, 18 kaybeden (%72,3). Baseline 66 sinyal/orijinal FT raporu değişmedi.

## 2. Denenen aday filtrelerin toplam sonuçları

| Deneysel koşul | Tutulan maç | Başarı | Elenen maçtaki kayıp | 9–16 Ekim | 17–25 Ekim | Tutulan ort. SXF oranı |
|---|---:|---:|---:|---|---|---:|
| **C1** — BTTS YES odds >1.60 | 37 | 31/37 (%83,8) | 12 | 16/17 (%94,1) | 15/20 (%75,0) | 1,62 |
| **C2** — BTTS YES odds >1.60 and OVER money >=£2,500 | 22 | 20/22 (%90,9) | 16 | 10/11 (%90,9) | 10/11 (%90,9) | 1,61 |
| **C3** — BTTS YES odds >1.60 and OVER share T8→T6 decline <2pp | 27 | 24/27 (%88,9) | 15 | 15/16 (%93,8) | 9/11 (%81,8) | 1,63 |
| **C4** — OVER share T8→T6 decline <2pp | 49 | 38/49 (%77,6) | 7 | 21/26 (%80,8) | 17/23 (%73,9) | 1,60 |
| **C5** — UEFA competition | 24 | 21/24 (%87,5) | 15 | 11/12 (%91,7) | 10/12 (%83,3) | 1,58 |
| **C6** — PREMIUM OVER | 33 | 24/33 (%72,7) | 9 | 10/15 (%66,7) | 14/18 (%77,8) | 1,58 |
| **C7** — English Premier League (risk) | 12 | 6/12 (%50,0) | 12 | 3/4 (%75,0) | 3/8 (%37,5) | 1,64 |

**C2 (tercih edilen güçlü araştırma etiketi):** BTTS YES SXF oranı >1,60 **ve** Üst 2.5 seçimindeki para ≥£2.500. Mevcut Üst motorlarından yalnızca bu kombinasyonu geçenler deneysel `OVER_STRONG_RESEARCH` etiketi alır. Sonuç **20/22 = %90,9**, ortalama SXF 1,61. Dört değil yalnız **iki başarısız seçim** geride kalmıştır; 65 maçın 43'ü elenir. Elenenler içinde **27 kazanmış seçim de vardır**.

**C3 (alternatif ivme teyidi):** BTTS YES SXF oranı >1,60 ve T-8'den T-6'ya Üst para payı **2 yüzde puanından fazla düşmemiş**. Sonuç **24/27 = %88,9**, ortalama SXF 1,63. Mevcut C2'den biraz daha fazla sinyal tutar. Kararın T-6 olduğu şartıyla geçmiş T-8 verisi kullanılabilir.

**C1 (tek filtre):** Yalnız BTTS YES SXF oranı >1,60 ise **31/37 = %83,8**; 28 elenen maç içinde 12 kaybeden bulunur. Üst piyasasına gelen £ miktarıyla birleştirilmesi bu örneklemde ayrımı güçlendirdi.

## 3. Neden yalnız PREMIUM yeterli değil?

Mevcut STABLE: 24/33 (%72,7), PREMIUM: 24/33 (%72,7). Daha yüksek pay ve para aynı başarıya yol açtı. Buna karşılık PREMIUM motorunun **BTTS YES SXF fiyatı >1,60** olan 17 örneğinin 15'i (%88,2) kazandı. Bu, yeni bir premium fiyat eşiği uydurmadan farklı bir piyasanın karar anı bilgisini araştırmak için gerekçe sunuyor.

## 4. Kayıplar nasıl gerçekleşmiş?

18 başarısız seçimin **10'unda toplam iki gol**, **7'sinde tek gol**, **1'inde gol olmadı**. Bu, zaten Üst 2.5'in kayıp koşuludur; tek başına öngörücü bir özellik değildir. Sinyal seçimine karar anında gözlenebilen oran, pay, hacim ve hareket değişkenleri bağlanmalıdır.

**C2 filtresinden kaçan iki mağlubiyet:**

- **9 Ekim, West Ham – QPR, 1–1.** Üst SXF 1,57, £5.242,42; BTTS YES SXF 1,74. [West Ham resmî maç raporu](https://www.whufc.com/en/news/match-report-or-qpr-draw-a-tale-of-two-penalties).
- **24 Ekim, FC Utrecht – PEC Zwolle, 1–1.** Üst SXF 1,58, £4.013,04; BTTS YES SXF 1,62. [Utrecht sezon maç kaydı](https://en.wikipedia.org/wiki/2026%E2%80%9327_FC_Utrecht_season).

Üst sinyali doğru çıksa bile iki takımın beraberliğe veya 1-0/2-0 gibi skorlara gitme eğilimi yalnız KG VAR fiyatından türetilemez. Yeni bir kural tasarlanacaksa BTTS YES'in **orandan ziyade T-8/T-6 para tutarlılığı ve seçiminin tamlığı** da takip edilmelidir.

## 5. Lig etkisi (şimdilik üretim filtresi yapılmamalı)

UEFA müsabakaları **21/24 (%87,5)**; diğer ligler **26/41 (%63,4)** (kaynak uyumu olmayan Atalanta dışarıda). İngiltere Premier Lig **6/12 (%50)**. Ligler arası bilet yoğunluğu ve tarih/turnuva farklılıkları kaynaklı yanlılık olabilir. Her ligde yeterli örneklem olmadan EPL'yi yasaklamak veya UEFA'ya otomatik ek güven vermek doğru olmaz.

## 6. Önerilen gölge denetim mimarisi (v0.4 korunur)

1. **ORIGINAL:** STABLE veya PREMIUM sinyal mevcut kurallarıyla eksiksiz yayımlanır.
2. **CROSSMARKET_VALID:** BTTS YES ve Üst 2.5 snap'leri aynı fikstür, doğru kaynak, gerçek karar saati ve tazelik kriterinden geçer. Kaynak uyuşmazlığı varsa C2/C3 verilemez.
3. **STRONG_RESEARCH_C2:** BTTS YES karar-anı SXF oranı **>1,60** ve Üst 2.5 üzerindeki para **≥£2.500**.
4. **MOMENTUM_RESEARCH_C3:** BTTS YES SXF oranı **>1,60** ve Üst T-6 para payı **T-8'e göre 2,00 puandan fazla düşmemiş**.
5. **FLAG yalnızca araştırma içindir:** Bu etiketler diğer sinyalleri silmez, değiştirmez ve production motoruna yeni eşik eklemez. Karar anında kaydedilerek yeni günlerin sonuçlarıyla test edilir.

## 7. Ölçüm ve yanlış sonuca varma riski

- Uyumlu temel karşılaştırma başarısı **47/65 (%72,3)**. C2 **20/22**, %95 Wilson isabet aralığı yaklaşık **%72–98**. Bu genişlik, 22 maçla gerçek başarıyı kesin bilmediğimizi gösterir.
- Çok sayıda oran, yüzde, £ ve lig alt grubu denendi. Görünen fark **çoklu sınama ve geçmişe aşırı uyum** içerir. 9–16 ve 17–25 ayrımı, eşikleri seçtikten sonra yapıldığı için gerçek prospektif kör test değildir.
- Sinyal hacmi ciddi düşüyor: C2 yalnız 22/65 seçimi tutuyor; **16 kaybı elemeye karşılık 27 kazananı da elemiş**. Kullanıcının istediği isabet metriğini artırıyor gibi görünür, ama tüm olası sinyalleri kapsamıyor.
- Oranlar **SXF Moneyway karar fiyatlarıdır**; otomatik gerçek bahis/kapanış fiyatı kabul edilmez. ROI veya unit analizi yapılmadı.
- FT sonuçları SXF iç kaynaklarına dayanıyor; bütün 66 maç bağımsız internette tek tek tekrar doğrulanmış değildir. Sıkı C2'deki iki kayıp örneği ayrıca dışarıdan kontrol edildi.

**Genel sonuç:** İleriye dönük test için en verimli ilk aday mevcut Üst motoruna **BTTS YES SXF oranı >1,60 + Üst seçimi ≥£2.500** gölge teyididir. İkinci aday, T-8→T-6 para payı düşüşü sınırıdır. Sonuçlar yeterli yeni maçta doğrulanana kadar v0.4 değiştirilmemelidir.

**Kaynak/denetim:** [Ham çapraz piyasa verisi](over25_crossmarket_features_2026-10-09_25_v1.json) · [Bu araştırmanın JSON verisi](SXF_OVER25_Filter_Research_2026-10-09_25_v1.json).
