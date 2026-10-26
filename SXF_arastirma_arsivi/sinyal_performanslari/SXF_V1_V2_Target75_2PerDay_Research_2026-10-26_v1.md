# CAPİTALE SXF — V1/V2 ile ≥%75 isabet ve günlük ortalama ≥2 tekil 1X2 sinyali

**Tarih:** 2026-10-26  
**Araştırma/karar:** EXPERIMENTAL SHADOW ONLY. Kullanıcı kriteri: **tarihsel toplam isabet ≥%75**, **9–25 Ekim 17 gün üzerinden toplam ≥34 sinyal (=ortalama ≥2/gün)**. "Her takvim günü en az 2" anlamına GELMİYOR; boş günler ayrıca raporlanır.  
**Kaynak:** `loss_features_2026-10-09_16_v1.json`, `loss_features_2026-10-17_25_v1.json` (GitHub freeze research sinyal özellikleri ve FT bağlantıları); SXF `roles/sxf.md`, `methods/sxf_methodology.md`. X-market teyidi `public.moneyway_snapshots` Supabase salt SELECT üzerinden yalnız aynı fixture UID'nin AS_OF öncesi kaydıyla yapıldı.  
**Karar:** Canonical metodoloji, üretimde V1/V2/HEAVY, source records, aktif sinyaller DEĞİŞMEDİ. Veri geleceğe sızdırılmadı, fakat **eşikler tüm 9–25 Ekim sonuçları görüldükten sonra seçildi** — geçmişe uyum/çoklu karşılaştırma riski çok yüksek. Dönem testi gerçek bağımsız holdout değildir.

## Veri evreni

- 9–25 Ekim (17 gün), 16:00–24:00 TSİ, retrospektif T-6 / gerekirse T-8 kontrol noktası araştırması, **canlı her-maç dynamic-AS_OF testi değil**.
- 1X2 tekil settled sinyaller: 259, 167 WIN 92 LOSS; unverified 15 Ekim Sportivo Luqueño–Cerro Porteño hariç.
- V1 alt evren: 184 tekil settled sinyal, **117/184 = %63,6**, 10,82/gün, ort. SXF **1,764**.
- V2, V1'in alt grubudur: 144, **90/144=%62,5**, 8,47/gün; V2 artı bir bağımsız sinyal veya ilave oy değildir.
- V1 canonical: 1X2 top-money seçimi, en az £1.000, pay ≥%80. V2 canonical: V1 + önceki 3 saatte selected share hiçbir zaman %70'in altına düşmüyor + adverse odds increase ≤%3. HEAVY canonical V1 + ≥£10.000 + ≥%80 share; HEAVY **gerekli olmayacak** yeni adaylar hedeflendi.
- Güvenlik kapısı: AS_OF'tan sonra oluşan snapshot yok; `source_lag_mins <= 10` pre-decision freshness. AS_OF/snapshot eksikliği positive sayılmaz.

## Önerilen üç ayrı gölge alternatif

| ID | Mevcut V1/V2 koşullarına eklenen yeni koşullar | WIN / N | İsabet | Sinyal/gün (17 güne) | Sinyal olan gün | Günlük ≥2 sinyal olan gün | Ort. SXF 1X2 oranı | ≥£10k altında sinyal |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| **A V1_RANGE** | V1; SXF odds **1.40 ≤ odds <1.90**; money share **82% ≤ share <90%**; latest source age ≤10m | **56/74** | **75,68%** | **4,35** | 15/17 | 12/17 | **1,608** | 38/74 |
| **B V2_FLOW_2PCT** | V1 + V2; aynı 1.40–<1.90 ve %82–<90 bandı; V2 3h adverse odds movement **<2,0%** (mevcut V2 ≤3% yerine shadow karşılaştırması); age ≤10m | **46/60** | **76,67%** | **3,53** | 15/17 | 11/17 | **1,594** | 29/60 |
| **C V1_DRAW_ODDS** | A + aynı fixture'nin AS_OF anında **X SXF odds ≥4,50**, X snapshot ≤15m, seçilen taraftaki SXF odds/share arşivle eşleşmeli (±0,02 odds / ±2 pp) | **38/47** | **80,85%** | **2,76** | 14/17 | 11/17 | **1,545** | 21/47 |

**Seçili farklar:** A, 74 sinyalin **38** tanesinde £10k altı V1 seçimini korur; HEAVY şartı yoktur. B'deki 60 sinyalin **29** tanesi £10k altında. C'de de **21** sinyal £10k altında: HEAVY'nin yalnızca adını değiştirmek değildir.

**A'nın basitliği:** Odds ve güncel share alt/üst bandı dışında V1'in £1.000 eşiği değişmez. Tazelik ≤10m koşulu bu geçmiş A seçiminin örneklem boyutunu değiştirmemiştir (aynı 56/74), fakat canlı veri kalitesini korumak için şarttır.

**V2 katmanının ayırt ediciliği:**
- A içindeki eski V2'yi ayrıca zorunlu kılınca **47/64 (%73,44)** — A'nın başarısından daha düşük; bu yüzden V1'i tamamen "V2 şartıyla" daraltmak tek başına iyileştirme değil.
- B'de V2 3s advers fiyat hareketi <2% seçince **46/60 = %76,67** (eski %3 kuralı + bant: 47/64); 4 sinyal elenir, 3 LOSS, 1 WIN. Mucize değil: küçük örneklem. V2 beyanı orijinal sinyalde zamanında kaydedilen `v2_adverse` özelliğine dayanır; new postmatch price yok.
- V2'nin para-payı minimumunu %90'a artırmak ters etki yapabiliyor; genel 144 V2'de min-share ≥90 grubu 12/28 (%42,9) idi. "Daha yüksek share daima daha güvenilir" yanlış.

## Tarih bölümleri

| Aday | 09–16 Ekim (8 gün) | 17–25 Ekim (9 gün) | Yaklaşık Wilson %95 isabet güven aralığı |
|---|---|---|---|
| A | **17/21 = 81,0%** | **39/53 = 73,6%** | **%64,8–84,0** |
| B | **13/17 = 76,5%** | **33/43 = 76,7%** | **%64,6–85,6** |
| C | **10/12 = 83,3%** | **28/35 = 80,0%** | **%67,5–89,6** |

Bu güven aralıkları idealize binom varsayımı içindir, gün/lig kümelenmesi ve çoklu eşik seçimi nedeniyle gerçek belirsizlik daha büyüktür. %75 ileriye dönük başarı **kanıtlanmadı**.

## Gün gün seçilen toplam sinyal sayısı (WIN / tüm)

| Tarih Ekim 2026 | A V1_RANGE | B V2_FLOW_2PCT | C V1_DRAW_ODDS |
|---|---:|---:|---:|
| 09 | 0/0 | 0/0 | 0/0 |
| 10 | 2/5 | 1/4 | 1/2 |
| 11 | 8/8 | 6/6 | 4/4 |
| 12 | 1/1 | 1/1 | 0/0 |
| 13 | 1/1 | 1/1 | 1/1 |
| 14 | 1/1 | 1/1 | 1/1 |
| 15 | 1/2 | 1/2 | 1/2 |
| 16 | 3/3 | 2/2 | 2/2 |
| 17 | 6/8 | 5/6 | 4/5 |
| 18 | 5/5 | 5/5 | 2/2 |
| 19 | 3/3 | 2/2 | 3/3 |
| 20 | 4/8 | 4/8 | 3/6 |
| 21 | 0/0 | 0/0 | 0/0 |
| 22 | 7/11 | 6/10 | 4/7 |
| 23 | 2/4 | 1/1 | 1/1 |
| 24 | 5/6 | 4/5 | 5/5 |
| 25 | 7/8 | 6/6 | 6/6 |
| **Toplam** | **56/74** | **46/60** | **38/47** |

**Eksik gün gerçeği:** 09 ve 21 Ekim'de A/B/C sıfır. A ve B yalnız 15/17 gün sinyal üretir, C yalnız 14/17 gün üretir. Ortalama 2+ sağlamak her gün kesin 2 sinyal üretebilecekleri anlamına gelmez. 21 Ekim mevcut bütün V1 evreninde sadece 1 sinyal vardı; sırf V1 tabanıyla o gün için 2 yaratmak imkânsız.

## Daha çok maç alternatifinde sınır
**D V1_VOLUME:** V1 + odds <2.20 + money ≥£2.000 + share ≥82% ve <90% + ≤10m snapshot: **60/80=75,00%**, günde 4,71 sinyal, ort. SXF 1,700, son tarih bölümünde 42/59=%71,2; 15/17 gün sinyal. İn-sample tam %75'e dayanması ve son bölüm zayıflığı sebebiyle **ana tavsiye değil**, sadece hacim testi.

## Piyasa ve ROI notu
Geçmişte kaynak-recorded SXF 1X2 odds ile hipotetik 1-birim stake hesaplandığında: A +%21,1, B +%22,1, C +%24,7. Gerçek bookmaker/executable oranı doğrulanmadı; bunlar **gerçek kâr veya garanti edilen getiri değildir**. Sinyal sayısı, ortalama SXF fiyatı, kayıp türü ve kalite ölçütleri isabet kadar önemlidir.

### Test sırası / mühendislik eylem planı
1. Orijinal V1, V2, HEAVY motoru ve üretim kriterleri **olduğu gibi** kalsın. Sadece kaynak anında A, B, C shadow bayrakları hesaplanıp **AS_OF ve kaynak timestamp** ile dondurulsun; C'de aynı maç aynı kaynak çoklu-market kontrolü şart.
2. Bağımsız günlerden **en az 50 yeni aday sinyal**, tercihen 100+ ve ayda/ligde çeşitlilik; **gerçek dinamik AS_OF** yöntemiyle kaç çıkan/gün ölç. 2/gün 17 günlük **geçmiş ortalama**, yoğun güne bağımlı olabilir.
3. Sonradan FT kontrolüyle haftalık per-day win/loss, Wilson CI, retained winners and dropped winners, sub-£10k coverage, data stale/mismatch, actual price ROI, odds bandı, league, home/away segmentlerini çıkar.
4. V1 ve V2 etiketlerini bağımsız bahis sayma; herhangi bir önceden seçilmemiş eşik önce ayrı shadow deney kaydı alsın.
5. Yalnız Prospektif performans gerçekten kullanıcı eşiklerini karşılar ve kullanıcı açıkça onay verirse yeni canonical methodology PR düşünülsün.

**NO LIVE MOTOR CHANGE; NO GITHUB RAW SOURCE DELETE; NO SUPABASE WRITE.**
