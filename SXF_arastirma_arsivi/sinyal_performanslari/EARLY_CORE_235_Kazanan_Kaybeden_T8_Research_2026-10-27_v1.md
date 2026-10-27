# CAPİTALE SXF — EARLY CORE 2.35 tavanı ve kazanan/kaybeden T-8 denetimi

**Araştırma tarihi:** 2026-10-27  
**Durum:** OWNER-APPROVED ODDS CEILING IN GITHUB METHODOLOGY; RETROSPECTIVE FEATURE AUDIT; OTHER CANDIDATE FILTERS RESEARCH ONLY.  
**Kapsam:** 9–25 Ekim 2026; 16:00–24:00 TSİ; gerçek zamanlı prospektif üretim sonucu değil, tarihsel `CHECKPOINT_RESEARCH_T6_FALLBACK_T8` ve bağımsız sonuç arşivi. Yalnız 1X2 **EARLY_CORE** etiketleri.  
**As-of:** Karar anına kadarki veriler kullanılır; FT yalnız hedef değişkenidir.

## 1. Sahip kararı — EARLY CORE üst fiyat tavanı 2.35 (inclusive)

T-72/T-60/T-40/T-24'te ilk oluşan EARLY CORE sinyallerinde, **mevcut kararın exact `as_of_utc` zamanındaki** seçilen 1X2 takım fiyatı **<=2.35** olmalı. Daha yüksek/geçersiz/eksik karar fiyatında EARLY CORE önerisi çıkmaz. İlk origin checkpoint'inde 2.35 şartı aranmaz; T-12 EARLY_T12, 1X2 V1/V2/HEAVY/SURPRISE ve diğer piyasalar etkilenmez. Retention-55 aynen kalır. Tarihsel v0.4 arşivi **değiştirilmez**. Belgeler `roles/sxf.md` ve `methods/sxf_methodology.md` v0.4.1 olarak sürümlenmiştir; gerçek çalışan uygulama/Supabase konfigürasyonu değişmiş veya deploy edilmiş diye iddia edilmez.

9–25 Ekim sinyalleri: orijinal **55/83 = 66.27%**, ortalama seçilen SXF fiyatı ~1.797; <=2.35: **52/77 = 67.53%**, ortalama ~1.74; >2.35: **3/6 = 50.0%**, ortalama ~2.54. 17 günlük günlük hacim ~4.88'den ~4.53'e iner. **Bu sonuçtan tek başına anlamlı ileriye dönük kazanç çıkarılmaz.**

Tavana takılan altı seçim (9–25 Ekim):
- 10 Ekim Sunderland – Brighton / Brighton, SXF 2.40, FT 0-2, WIN
- 10 Ekim AD Ceuta – Sabadell / Sabadell, SXF 2.44, FT 1-2, WIN
- 15 Ekim Lugano – Crvena Zvezda / Crvena Zvezda, SXF 2.96, FT 3-2, LOSS
- 18 Ekim Le Havre – Auxerre / Le Havre, SXF 2.40, FT 1-3, LOSS
- 24 Ekim Samsunspor – Amed Sportif Faaliyetler / Amed, SXF 2.38, FT 1-2, WIN
- 25 Ekim Sunderland – Leeds / Leeds, SXF 2.68, FT 0-0, LOSS

## 2. Kazanan 52 ile kaybeden 25 arasındaki gözlemler

| Sadece cap'i geçen CORE seçimleri | Kazanan 52 | Kaybeden 25 |
| --- | ---: | ---: |
| İlk erken para ortalaması (GBP) | 17,094 | 12,174 |
| İlk erken para payı ortalaması (%) | 85.26 | 86.76 |
| T-6 seçilen tutar ortalaması (GBP) | 132,871 | 113,711 |
| T-6 para payı ortalaması (%) | 81.20 | 80.79 |
| CORE retention minimum pay (%) | 77.27 | 77.86 |
| T-6 SXF odds | 1.71 | 1.80 |

25 kaybın 12'si DRAW, 13'ü seçilmeyen taraf galibiyetidir (90 dakika). İlk para **mutlak miktarı** kazananlarda daha yüksek görünür; ilk para **yüzdesi** ise kaybedenlerde hafif daha yüksek. Ancak veri dağınıklığı ve odds/lig/tarih farkları nedeniyle nedensellik yok. Retention minimum payı bu kohortta kazananı ayırmıyor.

Basit retrospektif ayrımlar:
- Origin selected money >=£15k: **23/29=79.3%**; <£15k: **29/48=60.4%**. Fakat daha da yüksek >=£20k: **9/14=64.3%**, yani düzgün artan/monoton bir ilişki yok. 9–16 Ekim'de >=£15k **11/15=73.3%** ve düşük tutar **14/19=73.7%**; 17–25 Ekim'de **12/14=85.7%** vs **15/29=51.7%**. Döneme bağımlı; **otomatik £15k sınırı önerilmez**.
- Origin selected share >=95%: **8/16=50%**; <95%: **44/61=72.1%**. 9–16 Ekim'de >=95% **4/4**, 17–25 Ekim'de **4/12**; yüksek değişkenlik, **otomatik veto önerilmez**.
- T-6 share >=80%: **35/52=67.3%**; <80%: **17/25=68.0%**. Güncel pay tek başına ayırmıyor.
- T-6 odds <2.00: **41/56=73.2%**; T-6 odds 2.00–2.35 dahil: **11/21=52.4%**. Odds daha düşük olduğunda doğal kazanma baz olasılığı zaten yüksektir; ROI avantajı veya paranın bilgi değeri kanıtlanmaz.
- CORE ile V1/HEAVY kesişimi 28/42=66.7%, HEAVY'siz kalan 24/35=68.6%; EARLY+HEAVY otomatik ikinci oy değildir.

## 3. T-8 kontrolü: tarihsel alt dönem ve tam 1X2 piyasa doğrulaması

20–25 Ekim'de cap'i karşılayan **31 CORE sinyali** için Supabase **salt okunur** `public.moneyway_snapshots` verisindeki **1/X/2 tam** snapshotları, her gerçek hedef `kickoff - 8h` ve `kickoff - 6h` anından **sonra olmayan**, 10 dakika içinde alınmış son ölçüm kullanılarak karşılaştırıldı. T-6 seçilen fiyat ±0.02 ve para payı ±2 yüzde puanı toleransında GitHub'ın sabit karar kaydıyla eşleşti: **31/31**. First EARLY origin ve T-8 ikisi birden uygun: **18/31**; diğer 13 için başlangıç→T8 testi **NO DATA**. Bu grubun toplam başarısı **17/31=54.8%**; rastgele kayıp üretmek gibi yorumlanamaz.

Normalized 1X2 implied market probability, de-vig: `p_selected(t)=(1/odds_selected(t)) / ((1/odds_1(t))+(1/odds_X(t))+(1/odds_2(t)))`.

| T-8 -> T-6 (seçilen takım) | Win/N | Hit | Ortalama SXF T-6 |
| --- | ---: | ---: | ---: |
| Normalized market p T6 >= T8 | 15/22 | 68.2% | 1.62 |
| Normalized market p T6 < T8 | 2/9 | 22.2% | 1.85 |
| Selected money share T6 >= T8 | 8/14 | 57.1% | 1.62 |
| Selected money share T6 < T8 | 9/17 | 52.9% | 1.74 |
| X share T6 <= T8 | 9/15 | 60.0% | 1.69 |
| X share T6 > T8 | 8/16 | 50.0% | 1.68 |
| T8->T6 marginal new money more concentrated on selection than at T8 | 8/14 | 57.1% | 1.62 |
| T8->T6 marginal new money not more concentrated | 9/17 | 52.9% | 1.74 |

Tarihsel alt dönemler, **önceden dondurulmuş dış test değil**:
- 20–22 Ekim: fiyat p korunan/artış **7/11**, düşen **1/4**.
- 23–25 Ekim: fiyat p korunan/artış **8/11**, düşen **1/5**.

İlk EARLY origin→T8 arası doğrulanabilen 18 örnekte:
- Selected money share T8 >= origin: **3/5=60.0%**, düşen: **7/13=53.8%**.
- Market p T8 >= origin: **5/11=45.5%**, düşen: **5/7=71.4%**.
Başlangıç→T8 iyileşmesi yeterince ayırt edici değil. Daha eski 9–11 Ekim döneminde yalnız seçilen takım ham SXF oranının T8/T6 davranışını karşılaştıran 15 örnekte aynı olumlu ayrım bulunmadı (fiyat sabit/düşen 8/10, yükselen 4/5). Bu farklı ölçümleri aynı teste indirgemek doğru değildir.

## 4. Hipotez / uyarı

**Birincil gölge risk hipotezi:** EARLY CORE uygunsa ve T-8/T-6 üçlü piyasa snapshotları gerçekten mevcutsa, **T-6 de-vig seçilen p < T-8 de-vig seçilen p** durumunu `EARLY_T8_T6_PRICE_CONFLICT` araştırma bayrağı olarak kaydet. T-8 veya T-6 verileri eksikse UNKNOWN; anlık karar T-8'deyse **T-6 verisini kullanmak yasak**. Bu bayrak **kanonik veto değildir** ve kullanıcı bu ikinci filtreyi onaylamamıştır. Rakamların bir bölümü farkın yüksek odds (gruplarda ortalama 1.85 vs1.62) ile açıklanabilir; fiyat grupları aynı odds bandında ve ileriye dönük karşılaştırılmalıdır. Ayrıca sıfıra çok yakın olasılık değişimlerinde veri/yuvarlama gürültüsü kontrol edilmeli.

Mevcut 2.35 tavanı bir **owner-approved selection constraint**, %75 hedefini sağlamış optimize edilmiş motor değil. İleriye dönük testte fiyat bandını, maçın kıta/ligini, as-of, seçilen taraftaki para hacmini ve günleri eşleştir; orijinal kararları gerçek zamanda kilitle, FT'leri sonradan bağımsız doğrula; sahte çoklu eşik taramasıyla %75 başarı vaadi verme.

## 5. Veri kaynakları ve kimlik

- `SXF_arastirma_arsivi/sinyal_performanslari/loss_features_2026-10-09_16_v1.json`
- `SXF_arastirma_arsivi/sinyal_performanslari/loss_features_2026-10-17_25_v1.json`
- `SXF_arastirma_arsivi/sinyal_performanslari/Sinyal_Performanslari.json`
- Günlük 9–25 Ekim `SXF_arastirma_arsivi/2026/10/<DD>/...outcome...` sonuç dosyaları (orijinal sinyalden ayrı settlement)
- Salt-okunur, exact fixture UID ve tarih ile `public.moneyway_snapshots`
- 26 Ekim için dört ayrı sonuçlanan CORE seçimi (Rizespor–Trabzonspor 3-4, Santa Clara–Benfica 1-2, PSG–Lyon 2-0, Sevilla–Osasuna 2-0) tarihli resmi/bağımsız kaynaklarda doğrulanmıştır; dördü de 2.35 altında ve kazanmıştır. Bu dört seçim **9–25 Ekim tablo örneklemine dahil değildir**. Kaynaklar: https://www.trabzonspor.org.tr/tr/haberler/caykur-rizespor-3-4-trabzonspor-26-10-2026 ; https://www.slbenfica.pt/pt-pt/agora/noticias/2026/10/26/futebol-cronica-santa-clara-benfica-9-jornada-liga-betclic ; https://www.laliga.com/en-ES/match/temporada-2026-2027-ligue-1-psg-lyon-8 ; https://www.soccerbase.com/matches/results.sd?date=2026-10-26

**No canonical Retention, T12, Concentration, Heavy, Surprise, Over or BTTS rule changed. No live deployment verified.**
