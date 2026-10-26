# SXF EKOL 1 — PARA GELİR, FİYAT ONAYLAR, RAKİP PİYASA İTİRAZ ETMEZ

**Dondurma tarihi:** 2026-10-26
**Aşama:** EX ANTE MECHANISM SPECIFICATION / PRE-TEST RULE FREEZE. 9–25 Ekim sonuçları, önceki V1/V2 filtre araştırmalarının sonuçları ve fiyat/hacim özetleri araştırmacı tarafından zaten görüldü: bu dosya tam kör pre-registration değildir. **Bu yeni mekanizma kombinasyonunun henüz hesaplanmamış tarihsel sonucu görülmeden önce kural dondurma niyetidir**. 
**Üretim statüsü:** Yalnız gölge/deneysel. `methods/sxf_methodology.md`, `roles/sxf.md` ve canlı V1/V2 eşikleri DEĞİŞMEZ.

## Ana tez (neden?)
1. **Seçili hisseye geçmişte yığılmış toplam para, bugün yeni bilgili para geldiğini kanıtlamaz.** Para payı yüksek olup piyasada yeni aktivite olmaması, birkaç büyük/yanıltıcı işlem veya dar likiditeden doğabilir. Bundan dolayı *stok* para payı yerine son iki saatteki **marjinal yeni para** incelenir.
2. **Bilgili akışın karar piyasasına yansıması beklenir:** Seçilen tarafa diğer 1X2 alternatiflerinin toplamından daha fazla *yeni* para geliyorsa, 1X2 fiyatının normalleştirilmiş örtük takım-galibiyeti olasılığının buna ters yönde gitmemesi gerekir. Tam tersi, 'popüler para ama fiyat ikna olmamış' çatışmasıdır.
3. **1X2 galibiyetini engelleyen iki yol vardır: X ve diğer takım galibiyeti.** Seçilen tarafa yönelen para varken X'in piyasa tarafından fiyatlandırılan olasılığı aynı anda yükseliyorsa beraberlik bilgisi/çatışması mümkündür. Kesin beraberlik öngörülmez; karşıt kanıt işaretlenir.
4. **Sayısal eşikler skordan seçilmez:** 'Son iki saat', T-8→T-6 tarihsel checkpointiyle ve 3 saatlik V2 ufkuyla tutarlı sabit gözlem aralığıdır; ±0 artış/azalış matematiksel yön şartıdır. Belirli %82–90, odds<1,9, £7500 vb. eski sonuç-uyum eşikleri kullanılmaz.
5. **Fiyat ile hacim tamamen bağımsız değildir** (bookmaker oranı para gelişine mekanik yanıt verebilir). Bu kural 'bilgili para kanıtlandı' iddiası değil, fiyat/akış **tutarlılık testi**dir. Piyasa verisi dışındaki takım haberi, form, analiz ve POLY yasağı korunur.

## Evren ve denetim
- Temel V1 zaten tetiklenmiş olmalı (HOME/AWAY top-money; seçilen £≥1.000; seçili pay≥80%; odds 1.40–2.50). V2 mevcut V1'in üzerine gelen 3s paylaşım/olumsuz fiyat-aşınma etiketi; V2 bir ekstra bahis oyu değil.
- Anlar: `t0 = fixture-specific decision_as_of`, `t1 = t0 - 2 hours`. Aynı `fixture_uid` için yalnız `public.moneyway_snapshots` SmartXFlow kayıtları, `market=1X2`, seçimler `1,X,2` ve `scraped_at_utc<=target`.
- `t0` ve `t1` için birbirine *eşit snapshot timestampinde* aynı kaynakta 1/X/2 üçü de mevcut olmalı. T0 ve T1 ayrı ayrı hedef andan önce en fazla **10 dakika** eski olabilir. Seçilen taraftaki T0 odds ve pay arşivdeki orijinal V1 kararıyla **±0.02 odds ve ±2.0 yüzde puanı** içinde uyuşmalı; aksi hâlde `UNVERIFIED` ve yeni etiket verilmez.
- Geçmiş ve şimdiki `volume` aynı fixture, market ve seçim üzerindeki kümülatif £ büyüklüğünü temsil ettiği varsayımı doğrulanmadan net akış yorumlanamaz. Negatif hacim farkı (iptal/reset) veya üç taraf toplamı anlamlı artmıyorsa **UNKNOWN**.
- `dv_i = V_i(t0)-V_i(t1)`. `dv_pick > 0`, `dv_X>=0`, `dv_other>=0` ve **`dv_pick > dv_X + dv_other`**: son iki saatte yeni 1X2 parasının çoğunluğu seçilen tarafa girmiş olacak. Teknik olarak %50 üzeri **marjinal** akış, önceden görülen toplam %80 para payı değildir. Eksik / negatif / reset = UNKNOWN.
- Her iki an için `q_i = 1 / decimal_odds_i`, `p_i = q_i / (q_1+q_X+q_2)` (1X2 overround normalize). `p_pick(t0) >= p_pick(t1)`: fiyat piyasasının seçimi geriletmemesi. `p_X(t0) <= p_X(t1)`: beraberlik riskinin fiyat olarak yükselmemesi. Hesaplama yalnız aynı kaynaktan aynı anda bulunan 1/X/2 oranlarıyla.
- Tolerans: float kıyaslamasında yalnız makine hata toleransı (`1e-9`), **performansa bakarak seçilmiş spread veya belirli odds bandı eşiği yok**.
- Hedef `≥75% hit rate` ve 17 tam takvim gününde `≥34` özgün V1 seçimi (≥2/gün ortalama). **Bu hedef koşulu filtre tanımı değiştirmeyecek.** 2/gün ortalama her gün iki seçim olduğunu iddia etmez.

## Dondurulan test etiketleri / fonksiyonları
- **PRIMARY `EKOL1_TRIPLE_CONFIRM`**: V1 + kalitesi doğrulanmış marjinal yeni para çoğunluğu + `p_pick` yükseliyor/sabit + `p_X` düşüyor/sabit. Sadece bu birincil öneri hipotezi. 
- **DIAGNOSTIC `EKOL1_FLOW_AND_PRICE`**: V1 + marjinal yeni para çoğunluğu + `p_pick` yükseliyor/sabit; X kuralı yok. Amaç X karşı teyidinin ayrı katkısını ölçmek, sonuçlara göre başka yeni eşik icat etmek değil.
- **DIAGNOSTIC `EKOL1_FLOW_ONLY`**: V1 + yeni para çoğunluğu; amaç fiyat-otoritesinin katma değerini ölçmek.
- **DIAGNOSTIC `EKOL1_V2_TRIPLE`**: PRIMARY + orijinal V2 etiketi; V2'yi zorunlu tutmanın marjinal katkısını ve hacim kaybını görmek.
- **DIAGNOSTIC `EKOL1_PRICE_ONLY`**: V1 + fiyatların `p_pick` artmıyor değil + `p_X` artmıyor; yeni para çoğunluğu olmadan sadece bookmaker fiyat teyidinin katkısını görmek.
- **NEGATIVE CONTROL:** V1 + `p_pick(t0) < p_pick(t1)` + `p_X(t0)>p_X(t1)`: takım galibiyetinden uzaklaşan, X'e kayan fiyat. Bu grubun isabetinde düşüş beklenir.

## Sonuçtan önce kilitli ölçüm planı
- Her model `WIN/N`, güven aralığı, ortalama SXF odds, 17 güne göre maç/gün, sinyal gelen gün sayısı, 9–16 ve 17–25 alt dönemleri, V1/V2 ayrımı, £10k altı sinyaller, kaynak/AS_OF uyumu, elediği kazanma/kaybetme, teorik SXF-unit getiri.
- Model 75% / 2/gün şartını tutturmuyorsa sonucu açıkça **BAŞARISIZ veya KAPSAM YETERSİZ** raporla; yeni eşiklerle post hoc optimize etme.
- Tüm 9–25 Ekim FT verisi mevcut olduğu ve önceki araştırmalar görüldüğü için test **mekanizma keşfi için tarihsel tanısal testtir**, gerçek dış-örneklem kanıtı değildir. Kısa/orta süreli **yeni gerçek dinamik AS_OF tarihleriyle blind prospective** gölge takip olmadan üretime yükseltme yok.
- Parasal getiri seçilen `SXF odds` fiyatına göre ancak teoriktir; oynanabilir bahis fiyatını kullanmadan gerçek kâr ve pozitif edge denmez.
- Belge/sürüm dondurulması metodoloji izin değil; bu sonuçları production SXF sinyalleri yerine otomatik koyma.

**Status: FREEZE BEFORE EVALUATION, NO CANONICAL CHANGE.**
