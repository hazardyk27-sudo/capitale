# SXF BTTS — Tam maç evreni ve fiyat teyidiyle kapsam artırma denetimi

**Tarih:** 2026-10-27 | **Durum:** Historical mechanism test, experimental/shadow only, NO CANONICAL CHANGE.

## Önceden tanımlanmış sabit adaylar
Veri toplanmadan *önce* saklanan liste:
[SXF_BTTS_GenisEvren_DualFiyat_T6_PreSpec_2026-10-27_v1.md](../hipotezler/SXF_BTTS_GenisEvren_DualFiyat_T6_PreSpec_2026-10-27_v1.md).
Önceki 41 BTTS sonuçları ve 13/14 çift-teyit tarihi zaten araştırmacı tarafından görülmüştür; yalnız bu *geniş kohortun birleşik ölçümü* daha önce yapılmadı. Bu tam bir dış/kör örneklem testi DEĞİLDİR.

## Evren ve veri kalite
- 9–25 Ekim 2026 TSİ, 16:00 ≤ kickoff <24:00, her maçın gerçek T-6 AS_OF'ı.
- `research_archive.fixtures` benzersiz UID sayısı **2703**, `research_archive.results` match_hash+home+away+FT+valid score eşleşmesi **2633**. Geçmiş skor yalnız settlement için.
- `public.moneyway_snapshots` yalnız READ/SELECT; aynı UID T-8 ve T-6 tarihinde veya daha önce <10 dakika lag, her iki horizon ve iki market için aynı anlık tam BTTS YES/NO + OU25 OVER/UNDER, geçerli odds ve Y/N pozitif para. **633** kaliteli kayıt; **632** kaliteli ve geçerli FT.
- Verisi olmayan 2070 maçın doğru şekilde dışlanması BTTS NO tahmini değildir. Eski 41 canonical BTTS satırının UID hepsi evrende: 36 kaliteli, 5 veri eksik/stale; 36'sında 25 kazanan.
- Fiyat teyidi `p_B(t6)>=p_B(t8)` ve `p_O(t6)>=p_O(t8)`, ayrı market içi normalleştirilmiş `1/odds` hesapları. Fiyat kaynaklarının ikisi de aynı SXF feed olduğundan bağımsız iki bilgi oyu sayılmamalıdır.
- Canonical 1.60–1.90 inclusive, YES GBP ≥750, share ≥60%. Kaynak tam örneklemde 25/36 (%69,4); frozen original 41 settled'de 29/41 (%70,7). Bu iki paydayı birbirine karıştırma.

## Tam evrende adaylar

| Önceden tanımlanan aday | WIN/N | İsabet | N/17g | Sinyal olan gün | Önceki kanonikten farklı yeni maç (WIN/N) | İlk 9–16 Ekim | Son 17–25 Ekim | Ortalama SXF oran |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| BASE_CANONICAL (quality matched) | 25/36 | 69,4% | 2,12 | 15/17 | 0/0 | 13/16 | 12/20 | 1,745 |
| DUAL_CANONICAL: canonical + çift fiyat teyidi | 13/14 | 92,9% | 0,82 | 9/17 | 0/0 | 7/7 | 6/7 | 1,746 |
| **DUAL_MAJORITY**: share≥50, GBP≥750 + çift fiyat | **15/17** | **88,2%** | **1,00** | 11/17 | **2/3** | 9/9 | 6/8 | 1,745 |
| DUAL_LOW_VOLUME: share≥50, GBP≥250 + çift fiyat | 23/34 | 67,6% | 2,00 | 13/17 | **10/20** | 14/18 | 9/16 | 1,735 |
| DUAL_WIDE_ODDS: odds1.50–2.00, share≥50, GBP≥750 + çift fiyat | 19/30 | 63,3% | 1,76 | 13/17 | **6/16** | 9/14 | 10/16 | 1,701 |
| BTTS_PRICE_MAJORITY: odds1.60–1.90, share≥50, GBP≥750 + KG fiyat teyidi | 17/21 | 81,0% | 1,24 | 12/17 | **3/5** | 10/12 | 7/9 | 1,729 |
| OVER_PRICE_MAJORITY: odds1.60–1.90, share≥50, GBP≥750 + ÜST fiyat teyidi | 20/26 | 76,9% | 1,53 | 12/17 | **2/3** | 10/11 | 10/15 | 1,748 |
| NO_MINIMUM_AMOUNT sensitivity, share≥50 and dual prices | 59/93 | 63,4% | 5,47 | 15/17 | **46/79** | 25/38 | 34/55 | 1,739 |

**Kritik sonuç:** 14'ten 17'ye çıkmak isabeti 92,9%'dan 88,2%'ye düşürür, ama 1/gün sağlar. Asıl 2/gün'e ulaşmak için tutar eşiğini £250'ye çekmek eklenen 20 maçta sadece **10/20** verir ve performansı 23/34 (%67,6)'ya indirir. Oran bandını genişletmek de 6/16 yeni maçla 19/30 (%63,3) olur. Bu dönemde isabet ve hacim birlikte korunmadı.

## DUAL_MAJORITY'e eklenen 3 maç: kazanma durumları
- 2026-10-15 **Benfica – Celtic**, KG YES odds **1,87**, para **£4.050,47**, YES share **58,2%**, FT **4-1** = WIN.
- 2026-10-16 **Çorum Belediyespor – Rizespor**, KG YES odds **1,62**, para **£2.889,37**, YES share **55,6%**, FT **2-1** = WIN.
- 2026-10-20 **Porto – PSV**, KG YES odds **1,73**, para **£961,74**, YES share **54,6%**, FT **0-1** = LOSS.
- Bunlar yeni sinyaller olup orijinal canonical KG VAR sinyali değildi; kaynak zamanları T-8/T-6 ve geçerli FT birlikte doğrulandı.

## Değerlendirme / uygulama
1. **Karar anı T-6** kesin; daha sonraki saatlerden veri alınmadı. FT settlement sadece değerlendirme.
2. Önceki 13/14 =92,9%'lik güçlü research-only BTTS filtresi korunabilir ama ancak 0,82/gün. 15/17=88,2% düşük kapsama, 17/21=81% 1,24/gün, 20/26=76,9% 1,53/gün. **2/gün ve ≥85%** ikisini bir arada sağlayan önceden tanımlı aday yok.
3. Zorlama para min düşüşü eski modelden yeni 20 maçı 10/20 hit ile eklediği için ana motor mantığına uygun değil. Üç yeni match yararlıdır ama %50 seçili cash threshold'un gelecekte avantajı ispatlanmadı.
4. Veri kalitesi darboğazı: 2703 fixture'dan yalnız 633'ü aynı T-8/T-6 KG+ÜST tam snap verisine sahip. Kapsama için daha çok gerçek veri arşivlemek/önceki futbol fixture saatlerini taramak alternatif strateji, eski kalite kurallarını gevşetmek gerekmez. *Data coverage* ile 'başarısız' maçları karıştırma.
5. Gelecek 50+ tercihen 100+ yeni T-6 gölge sinyal (eski v0.4 motor + frozen test flags), sample binomial CI, actual bookmaker odds & net ROI. Üretim canonical SXF değişmeyecek.

**NO NEW CANONICAL ENGINE, NO PROSPECTIVE CLAIM.**


## Opsiyonel saat genişletmesi: 00:00–15:59 TSİ (sonradan yapılan operasyonel kapsam kontrolü)
- Aynı 9–25 Ekim 17 günde, kickoff saati **00:00–15:59 TSİ** olan başka **1722** fixture, **1698** FT ile doğrulanmış sonuç; yalnız **230** tanesinde T-8/T-6 tam/taze BTTS + ÜST snapshot, bunların **229**'unda da FT score mevcut.
- Aynı **DUAL_CANONICAL** (≥%60, ≥£750, odds1.60–1.90, hem KG hem ÜST fiyat teyidi): **0 ilave sinyal**.
- Aynı **DUAL_MAJORITY** (≥%50, ≥£750, odds1.60–1.90, çift fiyat teyidi): **0 ilave sinyal**.
- Aynı **BTTS_PRICE_MAJORITY** (tek KG fiyat teyidi): **1 ek sinyal, 0 galibiyet** (17 Ekim Everton–Chelsea 0-2, 1,60).
- Aynı kanonik KG YES fiyat/para koşulları, fiyat teyidi olmadan: **2/4** ilave. Bu 4 maçtan biri Everton–Chelsea kaybı, diğerleri Santos–Flamengo 2-2 WIN, Inter–Fiorentina 2-1 WIN, Fortuna Sittard–Excelsior 1-0 LOSS.
- Yalnız başlangıç saatini genişletmek, dönemin mevcut T-6 kaynak kapsamı içinde güçlü çift fiyat adayına **hiç hacim kazandırmadı**. Bu uygulama notu mevcut filtre geliştirmelerinden sonra yapıldı, doğrulanmış bağımsız ileri tarih testi sayılmaz.
- Tüm gün sonuçları: 2703 (16–24) +1722 (00–16) = **4425 benzersiz fixture**; T-6/T-8 tam iki piyasa coverage 633+230=**863**, kalite+FT 632+229=**861**. Bunlar yalnız bu belirlenmiş zaman/kapsam evreni içindir.
