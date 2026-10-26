# CAPİTALE SXF — 1X2 motorlarını iyileştirme araştırması (9–25 Ekim 2026)

**Araştırma tarihi:** 2026-10-26  
**Durum:** EXPERIMENTAL / RETROSPECTIVE DISCOVERY / NOT PRODUCTION / NOT A CALIBRATED PROBABILITY  
**Orijinal tarama modu:** CHECKPOINT_RESEARCH_T6_FALLBACK_T8, 16:00–24:00 TSİ. Bu veri **SXF v0.4 gerçek zamanlı dinamik-AS_OF koşularının kanıtı değildir**. 26 Ekim oynanmayan/henüz sonuçlanmamış karşılaşmalar değerlendirmeye dahil edilmedi.  
**Kaynaklar:** [genel motor performansları](Sinyal_Performanslari.json) · [kazanan/kaybeden ana araştırması](Kazanan_Kaybeden_Analizi_2026-10-09_25_v1.md) · [9–16 Ekim as-of özellik kayıtları](loss_features_2026-10-09_16_v1.json) · [17–25 Ekim as-of özellik kayıtları](loss_features_2026-10-17_25_v1.json).  
**Yeni doğrulama:** Supabase `pswdvnmqjjnjodwzkmkp` `public.moneyway_snapshots` tablosu yalnız SELECT ile okundu. GitHub tek kalıcı araştırma hedefi. Her SQL seçimi yalnız as-of öncesi/sırasındaki X ve seçilen takım 1X2 snapshotlarıyla sınırlandı.

## 1. Ayrık 1X2 seçimleri: temel sonuçlar

- 9–25 Ekim: 260 arşiv 1X2 seçimi; **259 sonuçlanmış = 167 kazandı / 92 kaybetti (%64,5)**. 15 Ekim Sportivo Luqueño–Cerro Porteño `UNVERIFIED`, her isabet hesabından hariç.
- **92 mağlubiyetin 53'ü beraberlik**, 39'u seçilmeyen tarafın galibiyeti.
- Motor etiketleri aynı seçime binebilir ve bağımsız oy veya ayrı kupon sayılamaz.

| Motor / kesit | Kazanç | İsabet | Ortalama SXF |
|---|---:|---:|---:|
| EARLY CORE | 55/83 | 66,3% | 1,797 |
| EARLY T12 | 102/162 | 63,0% | 1,792 |
| V1 | 117/184 | 63,6% | 1,764 |
| V2 | 90/144 | 62,5% | 1,750 |
| HEAVY | 49/68 | 72,1% | 1,753 |
| V1 ve SXF <2,00 | 97/144 | 67,4% | 1,648 |
| HEAVY ve SXF <2,00 | **41/53** | **77,4%** | **1,635** |
| V1, HEAVY değil, SXF <2,00 | 56/91 | 61,5% | 1,656 |
| V1 SXF ≥2,00 | 20/40 | 50,0% | yaklaşık 2,18 |
| V1 para payı ≥95% | 9/20 | 45,0% | 1,708 |
| V2 önceki 3 saatte min. para payı ≥90% | 12/28 | 42,9% | 1,751 |

**Dönemler:** HEAVY+SXF<2: 9–16 Ekim 14/16 (%87,5), 17–25 Ekim 27/37 (%73,0). Benzer oranlı HEAVY olmayan V1: ilk 27/36 (%75), son 29/55 (%52,7). Bu kronolojik alt gruplar, eşikleri önceden dondurmadığımız için hakiki kör/gelecek test değildir.

## 2. YENİ çapraz-piyasa araştırması: X (beraberlik) para payı son 2 saatte artıyor mu?

Original frozen 1X2 `selection_id`, `fixture_uid`, `decision_time`, seçim oranı ve para payı, FT sonucu kaynak dosyalarından; diğer 1X2 tarafı X'in son snapshotı `public.moneyway_snapshots` içinden **AS_OF <= snapshot** şartıyla toplandı.

**Kayıt kalitesi:**
- 259 sonuçlanmış 1X2 seçimi için ayrı X sorgusu yapıldı.
- 246 seçimin X snapshotı AS_OF öncesi son 15 dakikada, seçilen takımın odds/share kaydı orijinal seçime ±0,02 oran / ±2 puan toleransı içinde eşleşmiş bulundu.
- 239 örnekte T-6'dan tam iki saat önce hedeflenen ana kontrol noktası için son **<= hedef snapshot** da son 15 dakikadaydı.
- Analize göre cohort değişebilir: `HEAVY + SXF<2` toplam 53; bu grupta **49** örneğin hem bugünkü hem iki saat önceki X snapshotı sıkı kaliteden geçti; **4** örnek tam iki-nokta karşılaştırması için dışarıda tutuldu. Böylece eksik veri varsayılan pozitif değildir.
- Test değişkeni = `X_share(AS_OF) - X_share(AS_OF - 2h)`, yüzde puan. 0 veya negatif = **X para payı artmıyor**.

| Eşit kaynak + geçmiş iki saat kontrolü | Kazanç | İsabet | Ort. SXF | Açıklama |
|---|---:|---:|---:|---|
| HEAVY, SXF<2, X payı artmıyor (Δ<=0) | **22/25** | **88,0%** | **1,668** | Aday gölge filtre |
| HEAVY, SXF<2, X payı artıyor (Δ>0) | 15/24 | 62,5% | 1,594 | Karşılaştırma |
| V1, SXF<2, X payı artmıyor (Δ<=0) | 53/72 | 73,6% | ~1,67 | Daha geniş kontrol |
| V1, SXF<2, X payı artıyor (Δ>0) | 36/63 | 57,1% | ~1,62 | Daha geniş kontrol |
| HEAVY+SXF<2+Δ<=0+V2 | 21/23 | 91,3% | 1,672 | Çok küçük ilave ayrıştırma; üretim filtresi yapma |

İlk HEAVY kıyasındaki oran ve hacimler aynı değildir: X düşmeyen grupta ortalama seçilen SXF odds **1,668**, para **£130.747**, para payı **%84,9**; X artan grupta odds **1,594**, para **£68.334**, para payı **%85,2**. Bu yüzden farkı yalnız X trendine nedensel olarak bağlamak mümkün değil: hacim, fiyat, maç türü ve dönem etkileri var.

SXF fiyatlarıyla, her seçime teorik 1 unit yatırılıyormuş gibi hesaplanan **referans** ROI, seçilen grupta +%46,7; karşılaştırmada -%0,8. Bunlar **gerçek yürütülebilir bahis oranları ya da gerçek kâr değildir**, kayıtlı SXF fiyatına dayanır. User'ın gerçek bahis sitesi fiyatları doğrulanmadan ekonomik başarı ilan edilemez.

Wilson yaklaşık %95 güven aralığı, 22/25 için **%70–96** ve 15/24 için **%43–79**. İki grup Fisher kesin testi p≈0,051 (çoklu test düzeltmesi yapılmadı). Filtre geçmişte keşfedildiğinden anlamlılık/sabit gelecek başarısı iddiası YOKTUR.

**X trendi neden 'beraberlik tahmini' değildir?** Valid HEAVY<2 kesitinde X artmayan 25 seçimin kaybı 3 ve üçünün skoru beraberlik; X artan 24 seçimde 9 kaybın 6'sı beraberlik, 3'ü rakip galibiyeti. Bu, geçmişte takım galibiyeti isabetini ayırt etmiştir; beraberliği izole tahmin ettiği kanıtlanmadı.

## 3. Potansiyel 1X2_STRONG gölge etiketi — yalnız test için

1. Mevcut SXF v0.4 kapsamında **V1 + HEAVY** (mevcut V1 yönü, seçilen £≥10.000 ve pay≥%80) oluşmalı.
2. Karar-anı orijinal seçilen takım **SXF odds <2,00** ve mevcut V1 alt sınırı (1,40) geçerli olmalı.
3. Seçilen takım ve X için **aynı maçta, AS_OF öncesi** güncel tam 1X2 Moneyway snapshotları kaynak/yaş eşleşmesinden geçmeli (deneysel tazelik kuralı: en fazla 15 dakika).
4. **X para payı son iki saatte artmamış** olmalı: `X_share(AS_OF) <= X_share(AS_OF-2h)`. Her iki okuma yalnız hedef andan önce/aynında yapılır. Eski gözlem eksikse `X_TREND_UNKNOWN`, **STRONG etiketi üretme**.
5. Kural şu an yalnız **retrospektif T-6 checkpoint** örnekleminde ölçülmüştür; gerçek dinamik AS_OF canlı akışına otomatik aktarma. Canonical V1/V2/HEAVY/EARLY motorlarının mevcut çıktısını değiştirme.

### 3a. Gölge koşulunu geçmişte geçen 25 maç

| Tarih | 1X2 maç / seçim tarafı | SXF | Δ X pay (pp) | FT | Sonuç |
|---|---|---:|---:|---|---|
| 11.10 | Lazio – Monza / ev | 1,75 | -0,2 | 3-1 | WIN |
| 11.10 | Betis – Osasuna / ev | 1,55 | -0,9 | 5-2 | WIN |
| 14.10 | QPR – Derby / ev | 1,75 | -0,2 | 4-1 | WIN |
| 15.10 | Lech Poznań – Leverkusen / deplasman | 1,63 | -0,8 | 0-4 | WIN |
| 16.10 | Heerenveen – Excelsior / ev | 1,63 | -0,1 | 4-0 | WIN |
| 16.10 | Frankfurt – Köln / ev | 1,93 | -3,9 | 1-0 | WIN |
| 17.10 | Fulham – Hull / ev | 1,68 | -0,6 | 1-0 | WIN |
| 17.10 | Betis – Barcelona / deplasman | 1,48 | 0,0 | 2-5 | WIN |
| 17.10 | Troyes – Lens / deplasman | 1,95 | -0,3 | 1-3 | WIN |
| 17.10 | Roma – Genoa / ev | 1,62 | -0,3 | 2-0 | WIN |
| 18.10 | Brighton – Crystal Palace / ev | 1,51 | 0,0 | 5-0 | WIN |
| 18.10 | Leverkusen – Freiburg / ev | 1,67 | -2,1 | 2-1 | WIN |
| 18.10 | Nottingham Forest – Arsenal / deplasman | 1,62 | -0,6 | 0-1 | WIN |
| 18.10 | AC Milan – Atalanta / ev | 1,79 | -0,6 | 3-2 | WIN |
| 18.10 | Lyon – Nice / ev | 1,93 | 0,0 | 2-1 | WIN |
| 20.10 | Fenerbahçe – Slavia Prag / ev | 1,62 | -3,7 | 2-2 | LOSS |
| 20.10 | Liverpool – Villarreal / ev | 1,54 | -0,3 | 4-3 | WIN |
| 20.10 | Napoli – Bodø/Glimt / ev | 1,80 | -1,9 | 4-3 | WIN |
| 22.10 | Ararat-Armenia – AZ / deplasman | 1,43 | -0,6 | 0-4 | WIN |
| 23.10 | Alavés – Málaga / ev | 1,69 | -1,0 | 1-1 | LOSS |
| 24.10 | Arsenal – Everton / ev | 1,47 | -1,2 | 2-0 | WIN |
| 24.10 | Lazio – Parma / ev | 1,52 | -5,8 | 2-1 | WIN |
| 25.10 | Hull – Brentford / deplasman | 1,70 | -0,1 | 1-1 | LOSS |
| 25.10 | Freiburg – Bayern Münih / deplasman | 1,54 | -0,4 | 1-3 | WIN |
| 25.10 | Udinese – AC Milan / deplasman | 1,89 | -1,7 | 0-2 | WIN |

FT skorları arşiv SXF settlement sonuçlarıdır; tüm 25 maç bağımsız resmî ikinci kaynakla doğrulanmış sayılmaz. Bu liste geçmişe dayalı araştırma çıktısıdır; AS_OF anında önceden yayımlanmış yeni motor sinyali değildir.

## 4. Ek negatif risk ve kalite bulguları

- V2 tek başına V1'e üstün değil (V2 62,5% vs V1 63,6%). V2/V1 bağımsız sinyal olarak toplama.
- Seçilen taraf payı **≥%95** V1 grubunda **9/20 (%45)**, para <£10.000 eklenince **7/18 (%38,9)**. Çoğunluğu düşük hacimli olabilir; araştırma **risk bayrağı** olarak test et; otomatik veto yapma.
- V2 3 saat min. share **≥%90**, **12/28 (%42,9)**; düşük olan **78/116 (%67,2)**. Şaşırtıcı ama sonuçtan öğrenilmiş eşik, canlı sisteme hemen uygulama.
- Oran bandı ≥2,00 V1 **20/40 (%50)**; fiyatın yüksek oluşu zaten daha düşük doğal kazanma olasılığı demektir. İsabet artışını otomatik ROI artışı olarak yorumlama.
- Son-10-dakika kaynak tazeliği / eşleşmesi önemlidir. Tarihsel kohortta T-6 anında birden fazla gün eski, asıl maça ait olmayan veya sonuç tarihi belirsiz olan sinyal karar düzeyinde güvenilmezdir. Tarih/fikstür/FT bağımsız kontrolünün arşivde ayrı quality gate olması gerekir.
- Sinyal yoğunluğu, lig bazında veri ve bahis fiyatı karşılaştırmaları bu küçük örneklemde ayrı test edilmelidir.

## 5. Ölçüm ve ileriye dönük deney planı

**Kesin karara dönüşmez:** Bu araştırma geçmişe dönük çok sayıda kesit denemiştir. Geçmişi 9–16 /17–25 olarak bölmek dış örneklem doğrulaması değildir.

**İki test tasarımı:**
1. `HEAVY_UNDER2`: V1+HEAVY, odds <2,00, yeterli taze veri. Bunu **V1+odds<2,00 olup HEAVY olmayan** aynı dönem/grupla kıyasla.
2. `X_FLOW_NOT_RISING`: yalnız yeterli taze X snapshotları ve en az iki saatlik önceki kontrolü bulunan `HEAVY_UNDER2` örneklerine ekle; X akışı artan grupla aynı oran/hacim ve tarih katmanlarında kıyasla.

**Prospektif:** En az 50 yeni ve kaynak-tarihi kesintisiz sinyal; başarım `hit rate`, `coverage loss`, V1/V2/HEAVY alt grupları, beraberlik ve rakip galibiyeti dağılımı, güven aralıkları, SXF referans fiyatı ile teorik ROI ve **yalnız mevcutsa gerçek yürütülebilir bahis fiyatıyla gerçek ROI**. Bağımsız FT/fikstür doğrulaması şart. Sinyalleri AS_OF anında dondur; sonuçları ayrı rapora ekle. Ancak yeterli dış örneklem ve sahibin açık onayı sonrasında sürümlü canonical değişiklik düşün.

**Status: RESEARCH DOCUMENT ONLY. NO CANONICAL SXF v0.4 MOTOR CHANGE.**
