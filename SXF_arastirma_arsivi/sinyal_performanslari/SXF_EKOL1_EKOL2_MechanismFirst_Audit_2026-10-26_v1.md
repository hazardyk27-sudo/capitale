# CAPİTALE SXF — Mantık önce, performans sonra: Ekol-1 / Ekol-2 audit

**26 Ekim 2026** | **ENGINEER / EXPERIMENTAL / NO PRODUCTION RULE CHANGE**

## Model tanımlarının karar-sonucu görülmeden önce saklandığı dosyalar
- [Ekol 1 — taze para > karşı para + seçilen fiyat onayı + X fiyat veto](../hipotezler/SXF_EKOL_1_CIFT_TARAFLI_FIYAT_VE_TAZE_PARA_TANIMI_2026-10-26_v1.md); bu hipotez yeni birleşik testi çalıştırılmadan önce GitHub'a kaydedildi.
- [Ekol 2 — eski kümülatif para payını geçen yeni para ivmesi + normalleştirilmiş fiyat onayı](../hipotezler/SXF_EKOL_2_MARJINAL_AKIS_IVMESI_KURAL_DONDURMA_2026-10-26_v1.md); Ekol-1 sonuçlarında **tanımsal zayıflık** görüldükten sonra, Ekol-2 sonucu hesaplanmadan önce GitHub'a kaydedildi.
- **Dürüst sınır:** Araştırmacı eski 9–25 Ekim sonuçlarını ve çok sayıda önceki filtre kesitini görmüştür. Bu tarihsel örneklem 'gerçek kör gelecek örneklem' veya yepyeni dış veri değildir. İkinci modelin teorisi önce belgelenmiş olsa da geçmiş bütün veri hakkında bilgi bulunması seçilim bias'ını ortadan kaldırmaz.

## Ekonomik hipotez (neden gelecek için daha anlamlı?)
Eski V1 yalnız seçilen tarafa yığılmış **stok (kümülatif)** para payını ≥%80 olarak yakalar. Ancak %85 tarihsel payı olan seçime son iki saatte yeni akışın %60'ının gitmesi, toplam ağırlığın **erimesi** anlamına gelir. Bu nedenle `marginal_pick_share > previous_cumulative_pick_share` koşulu gerçek ivme (acceleration) matematiğidir; tarihsel isabete göre bulunmuş rastgele %82–90 aralığı değildir.

Fiyat boyutu: 1X2 aynı timestampte 1/X/2 SXF odds `p_pick=(1/odds_pick)/sum(1/odds_1,1/odds_X,1/odds_2)` ile normalize edilir. İki saat içinde `p_pick(t0) >= p_pick(t-2h)` olduğunda, akışın fiyat tarafından **reddedilmediği** görülür. `p` kesin gerçek olasılık değildir; book overround ve verimsizlik riskleri devam eder; odds ve money mekanik/ortak kaynak bağımsız kanıt değildir.

Kaynak bütünlüğü: t0 ve t0-2h için aynı fixture UID + 1X2 market + aynı timestampte 1/X/2 + her hedefe en fazla 10 dakika kadar eski kaynak; t0 selected odds arşive ±0,02, share ±2 yüzde puanı. Önceki/kapanış sonrası yeni kaynak yok. Hacim azalışı/reset/negatif akış veya eksik gözlem `UNKNOWN`; mevcut V1 sinyali yok sayılmaz, yeni research tag verilmez.

## Frozen mekanizma testleri ve gerçekleşen skorlar

### Ekol 1
| Önce kodlanan test | WIN/N | Hit% | N/17 gün | Ort. SXF |
|---|---:|---:|---:|---:|
| Orijinal V1 | 117/184 | 63,6% | 10,82 | 1,764 |
| Aynı kaynaktan iki nokta ve üç tarafı doğrulanmış V1 | 108/171 | 63,2% | 10,06 | 1,757 |
| Flow only: son 2 saatte yeni cash çoğunluğu seçilende | 99/156 | 63,5% | 9,18 | 1,757 |
| Flow + selected de-vig price not worse | 60/90 | 66,7% | 5,29 | 1,755 |
| **Ekol-1 PRIMARY: Flow + price + X-price not rising** | **46/70** | **65,7%** | **4,12** | 1,749 |
| Ekol-1 PRIMARY + V2 | 38/61 | 62,3% | 3,59 | 1,751 |
| Price + X (cash requirement absent) | 53/79 | 67,1% | 4,65 | 1,741 |
| Negative control, selection loses price and X strengthens | 33/55 | 60,0% | 3,24 | 1,776 |

**Ekol-1 ana hipotezi user'ın ≥75% hit hedefini TUTTURMADI.** Tanımsal sebep: V1'in toplam para payı ≥80% iken yeni akışın yalnızca >50% seçili tarafa gitmesi hemen hemen otomatik, 'ivme'yi ispatlamıyor. 171 temiz kaydın 156'sında bu koşul sağlandı; ayırt edicilik zayıf.

### Ekol 2 (ilk testten sonra hipotezi ayrı donduruldu, sonuçları daha sonra incelendi)
| Önce tanımlanan aşama | WIN/N | Hit% | N/17 gün | Aktif gün | Ort. SXF |
|---|---:|---:|---:|---:|---:|
| Sadece paranın **gerçekten ivmelenmesi** (`marginal > prior share`) | 54/79 | 68,4% | 4,65 | 14/17 | 1,773 |
| **İvme + piyasa fiyat teyidi (tanısal, önceden tanımlanmış)** | **36/48** | **75,0%** | **2,82** | **13/17** | **1,751** |
| Ekol-2 **PRIMARY**: Yukarıdaki + birleşik X fiyat/para itirazını eleme | **35/47** | **74,5%** | **2,76** | **13/17** | **1,738** |
| Ekol-2 PRIMARY + mevcut V2 | 30/42 | 71,4% | 2,47 | 13/17 | 1,717 |
| Negatif kontrol: Yeni para payı eski bazın altında | 53/91 | 58,2% | 5,35 | 15/17 | 1,744 |

**Birincil hipotez, iki hedefi birlikte sağlayamadı** (35/47 = %74,5). **Önceden tarif edilmiş iki koşullu tanısal/ablasyon modeli** (36/48 = %75,0; 48/17 = 2,82) tarihsel hedefe *tam eşikte* ulaştı. Ancak PRIMARY seçiminin sonuçtan sonra tanısal modele çevrilmesi araştırma tercihi, prospective başarı kanıtı değil. Bu nedenle production'a yükseltilmez.

Ekol-2 ACCEL + PRICE 36/48:
- İlk sekiz gün (9–16 Ekim): **10/13 = 76,9%**.
- Son dokuz gün (17–25 Ekim): **26/35 = 74,3%**.
- 13/17 gün en az 1, yalnız 11/17 gün en az 2 sinyal. 12, 13, 19 ve 21 Ekim'de 0 sinyal. Bu nedenle "her gün 2" iddiası yapılamaz.
- Seçimlerin 29/48'i **£10.000'den az**; HEAVY zorunlu değil.
- Kazanç yüzdesi için naif Wilson %95 aralığı **61.2–85.1%**. Bu aralık bile ≥75 tabanını garanti etmiyor; araştırmada çoklu model denemesi ve FT/kümelenme nedeniyle gerçek belirsizlik daha geniş.
- Tüm V1 arşiv kararı 184 olup 171 (92,9%) tam kaynak kontrolünü geçti. İki saat akış karşılaştırmasında 170 kaydın pozitif/monoton hacim güncellemesi vardı.
- Aynı temiz 171 seçim içinde tanısal ivme+fiyat grubunun dışında 123 seçim kalır: 72 WIN, 51 LOSS, isabet %58,5. Bu tarihsel ayrışma yönsel bir hipotez lehinedir ama genel geçer nedensellik kanıtı değildir.
- Ekol-2 PRIMARY'de X birlikte itiraz vetosu **1 kazananı** çıkarıp hiç kaybeden çıkaramadı (36/48 → 35/47); X veto bileşenini 'güçlü filtre' saymak için dayanak YOK.
- V2 zorunlu kılmak, bu kohortta ayrışmayı arttırmadı.

**Gün gün ivme+fiyat (WIN / sinyal):**

| Tarih (Ekim) | Ekol-2 ivme + fiyat |
|---|---:|
| 09 | 1/1 |
| 10 | 3/3 |
| 11 | 2/2 |
| 12 | 0/0 |
| 13 | 0/0 |
| 14 | 0/1 |
| 15 | 3/4 |
| 16 | 1/2 |
| 17 | 5/6 |
| 18 | 4/5 |
| 19 | 0/0 |
| 20 | 3/4 |
| 21 | 0/0 |
| 22 | 2/4 |
| 23 | 3/3 |
| 24 | 4/6 |
| 25 | 5/7 |
| **Toplam** | **36/48** |

## Sorulması gereken asıl gelecek testi
Bu araştırmalar **bir mantık hipotezini** mekanik olarak test etti; oyun sonucunun yakın gelecekte üretim sisteminde ≥75% olacağını kanıtlamadı. Fiyat, kendi bilgisi olan bir piyasa referansıdır ve SmartXFlow para akışı kaynak bağımsızlığı garanti değildir. %75 kadar yüksek kazanma yüzdesi 1.75 SXF ortalama oranda güvenilir, geniş örneklemli gerçek world edge olarak kabul edilmemelidir.

**Önerilen kör/ileri tarih testi:**
1. Ekol-2'nin ayrı ayrı belgelenmiş ACCEL+PRICE ve PRIMARY bayraklarını **karar anında**, AS_OF bazında kaydet. V1/V2 eski sinyal üretmeye devam etsin.
2. Eski veri ve mevcut filtre sonuçlarıyla **yeni eşik icat etme**. Hedef ≥75% + ortalama ≥2/gün; en az **100–150 yeni bağımsız** sinyal ve birkaç hafta/lig / gün, odds, taraf, hacim tabakaları ölçülmeli. Gözlem penceresi yeterince kısa ve sinyal sıklığı takvim günlerine bağlı olarak hesaplanmalı.
3. Her sinyalin kendi as-of market match UID, FT tarih/doğrulama ve source lag kayıtları dondurulmalı; aynı maçın farklı motor etiketlerini ayrı bahis sayma.
4. SXF odds ile hipotetik eşit bahis birim-kârlılığı, Ekol-2 ACCEL+PRICE için yaklaşık **+%30,8**; **gerçek bookmaker odds ve market bet execution verisi YOK**, bu kazanç geçmiş kaynak SXF fiyatından yapılan kâğıt üstü bir hesap. Gerçek net ROI bilinmiyor. 
5. Sonuçlar doğrulanana kadar `SXF v0.4` canonical dosyaları/production motorları **DEĞİŞTİRİLMEYECEK**.

**Audit outcome:** Ekol1 FAIL; Ekol2 PRIMARY fails 75% narrowly; Ekol2 previously-defined ACCEL+PRICE diagnostic passes in-sample at boundary, future not validated.
