# SXF BTTS YES — Mekanizma önce, sonuç sonra: ön test kuralları

**Tarih**: 2026-10-27. **Statü**: Research-only / pre-combination-test freeze, canonical SXF v0.4 değişmez.

## Evren
9–25 Ekim 2026 16–24 TSİ T-6 tarihsel sinyal kohortu, mevcut **BTTS YES**: yes money >= £750, yes share >=60%, yes SXF odds 1.60–1.90. Her benzersiz fixture yalnız bir sinyal. 41 mevcut sonuç etiketi geçmişte bazı raporlardan zaten biliniyor, bu gerçek kör ön kayıt değildir.

## Piyasa mekanizması
BTTS YES'in kazanması için **iki ayrı takımın da gol atması** gerekir. Sırf yüksek 'YES money share' hem geç oluşmuş stok yoğunluğu hem bir tek takımın gol gücünden kaynaklanan popüler talep olabilir.
- **A: yeni KG VAR parası**. BTTS YES T-8→T-6 yeni para payı, T-8 kümülatif YES payının **üstünde** olmalı. YES ve NO kümülatif volüm monoton, iki saatlik toplam artış pozitif. Bu rakamsal eşik değil, 'para yoğunlaşması gerçekten artıyor mu?' kimlik koşulu.
- **B: KG VAR fiyat onayı**. BTTS YES/NO SXF odds'larından vigorish normalize edilen `P_yes` T-6 >= T-8. Bu, yalnız piyasanın aynı akışı fiyatla reddetmemesi; bahisçi akışından bağımsız bilgi olduğu kesin değil.
- **C: erken KG ivmesi**. T-8→T-7 yeni YES para payı, T-8 önceki YES payından yüksek. T-7'den T-6'ya yeni akış ivmesi ek şart değil.
- **D: OVER2.5 çapraz teyidi**. Aynı fixture, aynı AS_OF'ta OU25 O/U fiyatlarından normalize edilen `P_over` T-6>=T-8. KG VAR için 1-1 mümkün olduğundan OVER zorunlu değildir; bu hipotez yalnız 'açık maç temposu' teyidi ve veto kullanımı alternatifi.
- **E: OVER2.5 yeni para teyidi**. OU25 O/U için `new_over_share_{T-8→T-6} > cumulative_over_share_T-8`, iki taraf monoton ve pozitif yeni toplam; KG YES'e benzer. OVER ve BTTS kendi içlerinde/ortak nedenden bağımlı sinyallerdir; ikinci bağımsız oy sayılmaz.
- **F: NO price threat**. YES fiyat onayıyla matematiksel olarak aynı ikili piyasa olduğundan ayrıca bağımsız karşı oy sayılmaz. CROSSMARKET sonucu test edilecek.

## Önceden tanımlanan adaylar ve sırası
1. **PRIMARY KG_FLOW_PRICE** = canonical BTTS YES + A + B.
2. **KG_EARLY_FLOW_PRICE** = PRIMARY + C. Erken gelişmiş akış mekanizması.
3. **KG_OVER_PRICE** = PRIMARY + D. BTTS ile toplam goller fiyat tutarlılığı.
4. **KG_OVER_DUAL_FLOW** = PRIMARY + D + E. KG VAR ve OVER yeni para yapısı birlikte hızlanıyor, daha seyrek olabilir.
5. **KG_OVER_PRICE_ONLY** = canonical BTTS YES + D, basit çapraz test.
6. **KG_FLOW_ONLY** = canonical BTTS YES + A, izole marjinal para bileşeni.
7. **KG_PRICE_ONLY** = canonical BTTS YES + B, izole fiyat bileşeni.
8. **KG_EARLY_ONLY** = canonical BTTS YES + C (temel FIRST-HOUR akış).
9. **KG_PRICE_OVER_ONLY** = canonical BTTS YES + B + D, iki fiyatın paralel okuması.

## AS_OF veri kalite kapısı
- Karar T-6; geçmiş hedefler T-7, T-8. Yalnız `public.moneyway_snapshots` READ ONLY, `scraped_at_utc<=target`.
- Market BTTS: aynı timestampte Y/N; market OU25: aynı timestampte O/U. Her horizon anında kaynak tazeliği <=10 dakika (BTTS target anchor), OU25 anchor aynı fixture ve yeterince yakın aynı source scrape stamp; T-6 BTTS YES odds ve share GitHub frozen record ile ±0,02 ve ±2 pp uyumlu. Cross-market tazelik <=10 dakika.
- Kazanç/kayıp etiketi yalnız FT'den; hiçbir bahis sonra verisi modele dahil değil. Missing/stale/reset = UNKNOWN, yeni etiket verilmez.
- Testte kayıtların üç zamanlı kaynak kapsamı, days with 0, 9–16 vs17–25, en az 2/gün gibi hacim, Wilson interval, average SXF odds, heterojen fixture ve lig dağılımı, excluded matches ve FT 1-0/0-1/0-0/2-0 gibi KG NO yenilgi nedenleri raporlanır.

## Araştırma kararı
- Önce tanımlar sabitlendi, sonra performans ölçülecek. **Herhangi bir alternatifin %85 çıkması, onu otomatik üretime geçirme kararı değildir**. Sırf geçmişte iyi diye %80–90 share aralığı, >1.7 BTTS odds vb. rastgele eşik araması yapılmaz.
- 17 günlük 41 sinyal az; gelecek dönemde >50 tercihen 100+ yeni ayrı kickoff UID ve gerçek T-6 kayıtlarıyla ileri tarih gölge test şart.
- SXF dışında takım formu, mevcut haber, POLY yasak; canonical BTTS v0.4 motoru değişmiyor.

**Status: HYPOTHESES WRITTEN BEFORE COMBINATION PERFORMANCE.**
