# SXF KG VAR (BTTS YES) — T-6 mekanizma ve cross-market fiyat araştırması (9–25 Ekim 2026)

**27 Ekim 2026 | Araştırma / gölge aday — üretim kriterleri DEĞİŞMEDİ**

## Kural dondurması ve doğruluk sınırı
Testten önce versiyonlanan [mekanizma hipotezleri](../hipotezler/SXF_BTTS_Mekanizma_On_Test_Kural_Dondurma_2026-10-27_v1.md) temel alınmıştır. Araştırmacı daha önceki maç sonuçlarından haberdar olduğundan bu, **gerçek blind holdout değildir**. Aynı gün/lig/market kaynakları ilişkili olabilir; çoklu hipotez karşılaştırması ve küçük örneklem sonucu olduğundan daha parlak gösterebilir.

Kaynaklar: `loss_features_2026-10-09_16_v1.json`, `loss_features_2026-10-17_25_v1.json`; `public.moneyway_snapshots` salt SELECT, 41 BTTS fixture'nin **T-8/T-7/T-6 anında** Y/N ve O/U fiyat/hacimleri; yalnız karar anında erişilebilir kaynak. Target'tan en fazla 10 dakika eski full BTTS Y/N + OU25 O/U, T-6 fiyat ±0.02 / share ±2 pp research record ile tutarlı. Gecikmiş / eksik = UNVERIFIED, pozitif kabul edilmez.

## Temel gözlem
41 mevcut kanonik BTTS YES sinyali (BTTS YES para >=£750, YES pay >=60%, odds 1.60–1.90): **29/41 =70,7%**, 17 gün ortalama **2,41 sinyal/gün**; ilk 8 gün 16/20 (80,0%), kalan 9 gün 13/21 (61,9%). 12 kaybın FT durumları: 0–0 iki; 1–0/0–1/2–0/0–2/3–0 vb. diğer on: yani *en az bir takım gol atmadı*. Bu, BTTS NO için tanım gereği geçerlidir; tek başına filtre kanıtı değil.

Crossmarket iki zaman noktası tam ve güvenilir olan **36/41**; 5 kaynak eksik/stale/uyumsuz, otomatik negatif veya pozitif yapılmadı. Geçerli grubun baseline isabeti **25/36**.

## Önceden tanımlanan kurallar ve çıktı
| Model | WIN/N | İsabet | 17 gün ortalama | Yorum |
|---|---:|---:|---:|---|
| Mevcut KG VAR v0.4 | 29/41 | 70,7% | 2,41 | Bütün settled sinyaller |
| Kaynak doğrulanmış alt evren | 25/36 | 69,4% | 2,12 | Veri kapısı |
| KG VAR yeni para payı mevcut payın üstünde | 9/13 | 69,2% | 0,76 | Tek başına ivme etkisiz |
| KG VAR YES normalize fiyatı T-6 >= T-8 | **14/16** | **87,5%** | **0,94** | BTTS PRICE ONLY |
| KG VAR YES akış ivmesi + fiyat teyidi (ana hipotez) | **8/10** | **80,0%** | **0,59** | Çok maç eksiltiyor |
| İlk saat T-8→T-7 para ivmesi tek başına | 10/17 | 58,8% | 1,00 | Erken ivme BTTS için iyi görünmüyor |
| ÜST 2.5 normalize fiyatı T-6 >= T-8 | 18/23 | 78,3% | 1,35 | OVER PRICE ONLY |
| **KG VAR fiyat teyidi + ÜST 2.5 fiyat teyidi** | **13/14** | **92,9%** | **0,82** | **KG_PRICE_OVER_ONLY**, gözlemde en yüksek tarihsel hit/hacim dengesi |
| Ana hipotez + ÜST fiyat teyidi | 7/8 | 87,5% | 0,47 | Ek para ivmesi çok katı |
| Ana hipotez + ÜST fiyat teyidi + ÜST para ivmesi | 3/3 | 100% | 0,18 | **Küçük örnekleme aşırı uyum / karar alınamaz** |

## Potansiyel gölge aday: KG ÇİFT FİYAT TEYİDİ
1. Kanonik BTTS YES: seçilen 'YES' para >= £750, share >= %60, SXF odds 1.60–1.90.
2. T-8 ve T-6'daki BTTS YES/NO tam fiyatlarından `P_YES^devig=(1/oYES)/((1/oYES)+(1/oNO))`. T-6'da bu oran T-8'den **küçük olmayacak**.
3. Aynı maçın OU25 OVER/UNDER tam fiyatlarından `P_OVER^devig=(1/oOVER)/((1/oOVER)+(1/oUNDER))`. T-6'da bu oran T-8'den **küçük olmayacak**.
4. T-8/T-6 source age <=10min, BTTS Y/N ve OU25 O/U tam ve aynı source timestamp, current selected odds/share frozen record uyumu; gece/gün kaynak anomalisi veya eksik market = SHADOW_UNVERIFIED; eski BTTS sinyali korunur.
5. **Ek KG YES para ivmesi, ÜST para ivmesi, HEAVY, T-7 mecburiyeti yok.** İki fiyat hareketi ortak market modelinden beslenebileceği için bağımsız oy değildir.
6. Karar **T-6**; gelecek fiyat / maç başlangıcı sonrası yok. Eğer karar daha erken/geç canlı dinamik AS_OF ise T-8/T-6 tarihsel tanımını otomatik olarak ikame etmeyecek.

**Tarihsel:** 13/14=%92.9; nominal Wilson 95% CI 68.5–98.7%; 17 günlük ortalama 0.82/gün, sinyal olan gün 9/17; ortalama SXF YES oranı 1.746; gerçek executable bookmaker oranından doğrulanmış ROI YOK.

Dönem performansı 9–16 Ekim: 7/7; 17–25 Ekim: 6/7.

## 14 maç — fiyatları T-8 → T-6
`P_YES` ve `P_OVER` normalize/marjdan arındırılmış piyasa örtük yüzdeleridir; gerçek gol olasılıkları değildir.
| Tarih | Maç | FT sonuç | KG YES SXF odds T-8→T-6 | ÜST2.5 SXF odds T-8→T-6 | KG P% T-8→T-6 | ÜST P% T-8→T-6 | KG YES para T-6 (£) |
|---|---|---|---|---|---|---|---|
| 10-09 | Dortmund – Werder Bremen | 2-2 WIN | 1.69 → 1.67 | 1.42 → 1.41 | 59.3% → 59.8% | 70.5% → 71.0% | 9923 |
| 10-09 | West Ham – QPR | 1-1 WIN | 1.70 → 1.74 | 1.56 → 1.57 | 58.1% → 58.2% | 64.1% → 64.1% | 1876 |
| 10-09 | Braga – Sporting Lisbon | 1-3 WIN | 1.87 → 1.84 | 2.16 → 2.14 | 53.6% → 54.2% | 46.3% → 46.6% | 2935 |
| 10-10 | Monaco – Toulouse | 2-2 WIN | 1.67 → 1.67 | 1.62 → 1.63 | 59.6% → 59.6% | 61.2% → 61.5% | 996 |
| 10-11 | Sassuolo – AC Milan | 1-1 WIN | 1.70 → 1.69 | 1.77 → 1.72 | 58.7% → 59.1% | 56.7% → 57.6% | 2369 |
| 10-11 | Betis – Osasuna | 5-2 WIN | 1.90 → 1.86 | 1.76 → 1.71 | 52.5% → 53.5% | 56.7% → 58.4% | 1369 |
| 10-15 | CSKA Sofia – Monaco | 1-2 WIN | 1.75 → 1.78 | 1.70 → 1.65 | 56.1% → 56.6% | 58.7% → 60.4% | 3246 |
| 10-17 | Man City – Ipswich | 3-2 WIN | 1.78 → 1.77 | 1.37 → 1.35 | 55.9% → 56.5% | 73.0% → 73.5% | 30429 |
| 10-21 | Levante – Athletic Bilbao | 3-1 WIN | 1.87 → 1.84 | 2.10 → 2.06 | 53.6% → 54.2% | 47.2% → 48.2% | 916 |
| 10-22 | Sturm Graz – Marseille | 1-0 LOSS | 1.67 → 1.67 | 1.73 → 1.70 | 59.6% → 60.0% | 57.3% → 58.7% | 2362 |
| 10-22 | Plzen – PFC Levski Sofia | 1-2 WIN | 1.79 → 1.78 | 1.82 → 1.80 | 55.8% → 55.9% | 55.0% → 55.4% | 3277 |
| 10-23 | SCR Altach – Austria Wien | 2-1 WIN | 1.75 → 1.69 | 1.92 → 1.88 | 57.0% → 58.9% | 52.2% → 53.0% | 2481 |
| 10-23 | Ipswich – Nottm Forest | 1-1 WIN | 1.66 → 1.66 | 1.85 → 1.83 | 59.7% → 60.1% | 53.6% → 54.8% | 4315 |
| 10-24 | Lincoln – Burnley | 4-1 WIN | 1.79 → 1.78 | 1.93 → 1.93 | 56.0% → 56.2% | 51.6% → 51.6% | 789 |

## Her gün sinyal
| Tarih | WIN / N |
|---|---|
| 10-09 | 3/3 |
| 10-10 | 1/1 |
| 10-11 | 2/2 |
| 10-12 | 0/0 |
| 10-13 | 0/0 |
| 10-14 | 0/0 |
| 10-15 | 1/1 |
| 10-16 | 0/0 |
| 10-17 | 1/1 |
| 10-18 | 0/0 |
| 10-19 | 0/0 |
| 10-20 | 0/0 |
| 10-21 | 1/1 |
| 10-22 | 1/2 |
| 10-23 | 2/2 |
| 10-24 | 1/1 |
| 10-25 | 0/0 |
| **Toplam** | **13/14** |

## Diğer 16 KG VAR fiyat teyidi maçları (karşılaştırma)
| Tarih | Maç | FT | KG YES fiyatı T-8→T-6 | ÜST2.5 fiyatı T-8→T-6 | KG P% | ÜST P% | YES para |
|---|---|---|---|---|---|---|---|
| 10-09 | Dortmund – Werder Bremen | 2-2 WIN | 1.69 → 1.67 | 1.42 → 1.41 | 59.3% → 59.8% | 70.5% → 71.0% | 9923 |
| 10-09 | West Ham – QPR | 1-1 WIN | 1.70 → 1.74 | 1.56 → 1.57 | 58.1% → 58.2% | 64.1% → 64.1% | 1876 |
| 10-09 | Braga – Sporting Lisbon | 1-3 WIN | 1.87 → 1.84 | 2.16 → 2.14 | 53.6% → 54.2% | 46.3% → 46.6% | 2935 |
| 10-10 | Jagiellonia Bialystock – Gornik Zabrze | 1-3 WIN | 1.73 → 1.71 | 1.91 → 1.92 | 56.4% → 58.4% | 52.4% → 52.0% | 1959 |
| 10-10 | Monaco – Toulouse | 2-2 WIN | 1.67 → 1.67 | 1.62 → 1.63 | 59.6% → 59.6% | 61.2% → 61.5% | 996 |
| 10-10 | Napoli – Frosinone | 3-0 LOSS | 1.67 → 1.66 | 1.49 → 1.51 | 59.8% → 60.1% | 67.5% → 66.5% | 2796 |
| 10-11 | Sassuolo – AC Milan | 1-1 WIN | 1.70 → 1.69 | 1.77 → 1.72 | 58.7% → 59.1% | 56.7% → 57.6% | 2369 |
| 10-11 | Betis – Osasuna | 5-2 WIN | 1.90 → 1.86 | 1.76 → 1.71 | 52.5% → 53.5% | 56.7% → 58.4% | 1369 |
| 10-15 | CSKA Sofia – Monaco | 1-2 WIN | 1.75 → 1.78 | 1.70 → 1.65 | 56.1% → 56.6% | 58.7% → 60.4% | 3246 |
| 10-17 | Man City – Ipswich | 3-2 WIN | 1.78 → 1.77 | 1.37 → 1.35 | 55.9% → 56.5% | 73.0% → 73.5% | 30429 |
| 10-21 | Levante – Athletic Bilbao | 3-1 WIN | 1.87 → 1.84 | 2.10 → 2.06 | 53.6% → 54.2% | 47.2% → 48.2% | 916 |
| 10-22 | Sturm Graz – Marseille | 1-0 LOSS | 1.67 → 1.67 | 1.73 → 1.70 | 59.6% → 60.0% | 57.3% → 58.7% | 2362 |
| 10-22 | Plzen – PFC Levski Sofia | 1-2 WIN | 1.79 → 1.78 | 1.82 → 1.80 | 55.8% → 55.9% | 55.0% → 55.4% | 3277 |
| 10-23 | SCR Altach – Austria Wien | 2-1 WIN | 1.75 → 1.69 | 1.92 → 1.88 | 57.0% → 58.9% | 52.2% → 53.0% | 2481 |
| 10-23 | Ipswich – Nottm Forest | 1-1 WIN | 1.66 → 1.66 | 1.85 → 1.83 | 59.7% → 60.1% | 53.6% → 54.8% | 4315 |
| 10-24 | Lincoln – Burnley | 4-1 WIN | 1.79 → 1.78 | 1.93 → 1.93 | 56.0% → 56.2% | 51.6% → 51.6% | 789 |

## 2 grup ilişkisi ve yenilgi türleri
- Çift fiyat teyidi modeli KG fiyat teyidinin **14/16** grubunun altıdır; ikisi bağımsız sinyal / oy değildir. ÜST fiyat teyidi iki seçim eleyerek 1 kazanıp 1 kaybeden çıkarır (14/16 → 13/14). Güçlü ek bağımsız tahmin gücü gösterilmiş değildir.
- Çift fiyat teyidi grubunda tek kayıp: **Sturm Graz – Marseille 1-0**.
- Yaygın KG YES para yoğunlaşması veya ivmesi golün her iki takımdan geleceği garantisi değildir. ÜST piyasa fiyatı yükselse de 2-0 gibi tek takım gol senaryoları mümkün; 1-1 BTTS YES olurken ÜST 2.5 kaybeder. Bu nedenle yalnız piyasa tutarlılığı, nedensel teorem değil.

## Ne yapılmalı
- **Kural dondur:** KG ÇİFT FİYAT TEYİDİ'ni sadece gölge araştırma adayı olarak kaydet; kanonik BTTS YES motoruna dokunma.
- **Hacim yetersiz:** 0,82/gün önceki hedef ≥2/gün'e uzak. KG baz 2,41/gün, en küçük kalite kapısında 2,12/gün. Yalnız bu 41 satır içinden filtreleme yaparak hem çok yüksek hit hem günlük 2 üzeri performansı ispatlamak mümkün olmadı.
- BTTS isabetini hacim düşmeden artırmak için mekanizma gerektiren ek aday **genişletilmiş keşif evreni**: mevcut BTTS YES etiketine girmeyen ancak fiyat tutarlılığı olan tüm müsabakalar, *sonuçları kullanmadan tanımlanacak* ön araştırma filtresiyle prospektif olarak ölçülmeli. Canonical kural değiştirilmeden önce LIVE shadow takip, minimum 50 tercihen ≥100 yeni tekil sinyal ve >17 gün.
- ROI hesapları SXF odds ile teorik kağıt-üstü olup bookmaker executable odds ve spread teyit edilmedi.
- Bu dosyayı daha eski ÜST 2.5 **OVER_STRONG** ve 1X2 **EKOL 3** kayıtlarıyla karıştırıp 'kanıtlanmış motor' olarak sunma; kullanıcı isterse ayrı BTTS araştırma adayı olarak yanına eklenebilir.

**Status: EXPERIMENTAL ONLY / NO CANONICAL CHANGE.**


## Ek takvim kontrolü — 26 Ekim 2026 T-6, FT sonucu doğrulanmadı
9–25 Ekim araştırma döneminin dışındaki 26 Ekim 2026 günlük SXF T-6 taramasında **Paris St-G – Lyon KG VAR YES** sinyali bulunuyor (`fixture_uid=ca3254d9-ada6-4ed6-a8f2-8462e0cf1803`, T-6 **2026-10-26 13:30 UTC**, KG YES 1,67 / £6.329,43 / %70,7). Supabase salt SELECT orijinal aynı-fixture tarihsel snapshotları:
- T-8: 2026-10-26 11:29:36 UTC, KG YES/NO odds **1,61/2,50**, OU25 O/U odds **1,39/3,45**.
- T-6: 2026-10-26 13:29:44 UTC, KG YES/NO odds **1,67/2,50**, OU25 O/U odds **1,41/3,40**.
- KG YES normalize piyasa yüzdesi **azalmış**, OVER2.5 normalize piyasa yüzdesi de **azalmış**; hem KG PRICE ONLY hem KG ÇİFT FİYAT TEYİDİ bu maça **YENİ ARAŞTIRMA ETİKETİ ÜRETMEZ**. Canonical KG VAR YES sinyali silinmez.
- 26 Ekim FT sonuç dosyası burada **bulunmadı**, bu olay için WIN/LOSS iddiası yok. Sonuçsuz bir adet dış dönem olayının gözlenmesi başarı veya dış örneklem performansı sayılmaz. Sonradan skor öğrenilip eşik değiştirilmeyecek.
