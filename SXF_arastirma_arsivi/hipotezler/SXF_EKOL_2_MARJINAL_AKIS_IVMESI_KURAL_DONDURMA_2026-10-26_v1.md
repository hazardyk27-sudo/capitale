# SXF EKOL 2 — MEVCUT PARA PAYINI GEÇEN YENİ PARA AKIŞI

**Tarih:** 2026-10-26. **Statü:** KURALLAR TESTTEN ÖNCE DONDURULDU / EXPLORATORY / PRODUCTION DEĞİL.

## Gerekçe: Ekol-1 matematiksel yanlış pozitifinden öğrenilen TANIMSAL düzeltme
V1 zaten karar anında ≥%80 kümülatif 1X2 para payına sahip takımı seçer. Yeni paranın sadece >%50'sini seçilen takımın alması, o takımın konsantrasyonunun **güçlendiğini** göstermez. Örneğin eski pay %85 ve gelen yeni paranın %60'ı seçilen takıma giderse hâlâ miktarın çoğunu seçilen taraf alır ama kümülatif para payı **azalır**. İlk frozen Ekol-1 backtesti PRIMARY 46/70 (%65,7) bulmuştur; bu başarısızlık hiçbir eşik aramaya gerekçe olamaz. Bu yeni hipotez, genel geçer fiziksel/hesapsal tutarsızlığı giderir.

## Düzenlenmeden uygulanacak tekil ana hipotez
1. **Evren:** Canonical V1 (top-money 1X2 HOME/AWAY; selected money ≥£1000; selected share ≥80%; selected SXF odds 1.40–2.50). Mevcut V2 etiketi opsiyonel tanı. Aynı 1X2 seçimi yalnız bir kez sayılır.
2. **Veri kalitesi:** Aynı fixture UID, tüm `1,X,2` oran/GBP/pay aynı tam snapshotta; current target `t0 = original_decision_as_of`; prior target `t1 = t0-2h`. Her snapshot en çok **10 dakika** eski ve tam, yalnız `scraped_at<=target`; current selected odds ±0.02 / share ±2pp ile frozen V1 source uyumlu. Eksik reset/uyuşmazlık UNKNOWN, risk pozitif değil.
3. **Temel akış ivmesi:** `dv_pick, dv_X, dv_other >=0`, `dv_total >0`. Önceki pay `base_pick_share = V_pick(t1) / (V_pick(t1)+V_X(t1)+V_other(t1))`; son iki saatin yeni para payı `marginal_pick_share = dv_pick / dv_total`. **`marginal_pick_share > base_pick_share`**. Bu matematiksel olarak 'yeni para mevcut konsantrasyonu artırıyor' demektir, kazanan maçlardan elde edilmiş %82, %90 vs yoktur.
4. **Piyasa fiyatı bunu reddetmiyor:** İki anda de-vig normalize edilen `p_pick=(1/odds_pick)/sum(1/odds_1,1/odds_X,1/odds_2)`, şart `p_pick(t0) >= p_pick(t1)`. Fiyat ile para tamamen bağımsız değildir, yalnız çelişki testi yapılır.
5. **Yalnız birlikte gelen beraberlik tehlikesi veto edilir:** `p_draw(t0) > p_draw(t1)` VE `marginal_X_share > base_X_share` **ikisi birden** ise veto. Tek tek X fiyatı veya X para yükselişi gürültü olabileceğinden ayrı başına engelleyici değildir. İki taraflı gerçek bilgi işareti hipotezi. Fiyatlar de-vig, cash share tüm 1X2 aynı anda.
6. **PRIMARY:** V1 + kaynak quality + 'marginal pick share exceeds base share' + pick de-vig price not lower + *joint draw price-and-money confirmation absent*. FLOAT tolerance only 1e-9.
7. **DIAGNOSTICS (sonuçtan eşik uydurma değildir):** (a) ACCEL_ONLY, (b) ACCEL_AND_PICK_PRICE (draw veto yok), (c) V2 işareti ayrıca gerekli olduğunda aynı PRIMARY, (d) karşı-kontrol: marjinal pick share eski paydan düşük. Bunlar salt ablation; PRIMARY tutmazsa bunlardan en iyisini üretime almak için bahane değil.

## Ölçüm ön koşulu
- 9–25 Ekim 17 takvim günü tarihsel araştırması ve mevcut V1/FT arşivi, **önceki 1X2 sonuçları araştırmacıya biliniyor**. Gerçek blind holdout değil.
- Metrikler: WIN/n, 17 güne göre tekil sinyal/gün, ortalama odds, distinct active days, Wilson CI, 9–16 vs17–25, kaynak uyumu, kazanan/kaybeden dışlanan, observed money acceleration distribution, SXF referans teorik unit return.
- Success criterion `>=75% hit` & `n>=34` (>=2/day) kilitli; tutmazsa **NOT PASSED** ilan edilecek.
- Ekol-2 model tanımı bir ekol-1 başarısızlığı ve tanımsal tutarsızlığından sonra oluşturulduğu için 'önce görmedik' veya tam pre-registered olmayan tarihsel döneme ilişkin tutarlılık garantisi iddia edilmez. Yalnız yeni AS_OF fiksürlerde gölge test sonucu dış örneklem sayılabilir.
- Existing SXF V1, V2, HEAVY, EARLY ve versiyonlar **değiştirilmiyor**. Supabase sadece SELECT, GitHub kalıcı araştırma.

**FROZEN PRE-TEST; NO CANONICAL CHANGE.**
