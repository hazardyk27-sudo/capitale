# SXF SURPRISE — T-72 → T-24 süreklilik ve para payı ivmesi araştırması

**Çalışma:** 2026-10-28. **Sadece araştırma / SHADOW.** SXF kodu, kuralları, performans arşivleri ve ham Pratik Arşiv değiştirilmedi.

## Mekanik test (önceden tanımlanabilen, sonuç bazlı olmayan)

Kaynak: `archive/2026/10/DD/05_pratik_arsiv/checkpoints.jsonl.gz`. SURPRISE koşulu **aynı 1X2 ev/deplasman takımı**, SXF decimal oranı **2.90–4.49 (dahil)** ve aynı takımın para payı **>=%50**. Her iki zamanın kaynak gecikmesi en fazla **35 dakika** ve ilgili seçim için oran/para payı okunabilir olmalı. T-72'de koşulu sağlayan bütün ev/deplasman adayları sayıldı; T-24'te aynı tarafın koşulları devam edip etmediğine bakıldı. Kaydı eksik olanlar başarısız diye işaretlenmedi. Sonuç etiketi ev/deplasman takımı için normal zaman galibiyet/beraberlik/mağlubiyetten türetildi. Bu çalışmanın evreni **tüm arşivlenmiş maçlardaki T-72 orijinli adaylardır**, yalnız karar anında yayımlanmış 97 SURPRISE sinyali değildir.

**İşlenen 15 gün:** 09,11,12,13,14,15,16,19,20,21,22,23,24,25,26 Ekim. **Erişilemeyen üç gün:** 10,17,18 Ekim (büyük gzip kaynakları GitHub Contents API'de içeriksiz döndü). Bu nedenle 9–26 Ekim eksiksiz nüfusu değildir.

## Sonuçlar

| Grup | Kaybetmedi (W+D) / Toplam | Başarı |
|---|---:|---:|
| T-72 SURPRISE adayları toplam | 22/39 | %56,41 |
| T-24'te de SURPRISE kalan aynı takım | **7/14** | **%50,00** |
| T-24'te SURPRISE vasfını kaybeden | **15/25** | **%60,00** |
| T-24 para payı >= T-72 para payı (tüm T-72 adayları) | **7/9** | **%77,78** |
| T-24 para payı < T-72 para payı | **15/30** | **%50,00** |
| İki noktada da SURPRISE ve para payı düşmemiş | **6/7** | **%85,71** |
| İki noktada da SURPRISE ve para payı düşmüş | **1/7** | **%14,29** |
| T-24 para payı > T-72, T-24 para miktarı > T-72 ve T-24 oranı <= T-72 (tüm T-72 adayları, oran T-24'te SURPRISE altına düşebilir) | **5/5** | **%100,0 (n=5; kesinlikle genellenemez)** |

**Önemli:** Son üç grup, aynı sonuçlar incelenirken incelenen mantıksal alt koşullardır; başarı rakamları keşif amaçlıdır, prospektif kanıt ya da beklenen ROI değildir. Tam SURPRISE sürekliliği **olumlu değil**, para payı eğilimi ise küçük örneklemde araştırmaya değer. T-72'de %100 share ama tek tarafın toplam £2.38 gibi çok düşük para ile oluşan durumları görebiliyoruz; yüzdenin tek başına likidite güvencesi yok. Hedef tarafın yeni para almaması da arşivlenmiş payın değişmemesiyle karıştırılmamalıdır.

## İki zamanda da SURPRISE olan 14 adayın tam listesi

| Tarih | Maç / seçilen taraf | Sonuç | Para payı T72→T24 | Oran T72→T24 | Seçilen taraf £ T72→T24 | Etiket |
|---|---|---|---|---|---|---|
| 11 | Rosario Central–Independiente Rivadavia / deplasman | 5-0 | 100→64.6 | 3.70→3.95 | 4.71→145.28 | LOSS |
| 12 | Levante–Sevilla / deplasman | 3-3 | 68.0→72.5 | 2.94→2.92 | 1033.30→3212.72 | DRAW |
| 24 | Boyaca Chico–Atletico Bucaramanga / ev | 1-0 | 100→100 | 3.65→3.65 | 2.38→2.38 | WIN |
| 24 | Cheltenham–Newport County / deplasman | 1-0 | 100→61.5 | 3.00→2.92 | 135.02→186.37 | LOSS |
| 24 | Charlton–Norwich / ev | 1-3 | 89.0→73.7 | 3.55→3.40 | 7385.46→9581.56 | LOSS |
| 24 | Antwerp–Charleroi / ev | 3-0 | 96.8→97.4 | 4.30→4.40 | 144.19→176.20 | WIN |
| 24 | Crawley Town–Tranmere / ev | 1-1 | 74.9→82.6 | 2.92→2.90 | 150.84→461.62 | DRAW |
| 24 | Rotherham–Shrewsbury / deplasman | 3-3 | 86.5→78.6 | 2.98→3.20 | 443.96→690.65 | DRAW |
| 24 | FCSB–Rapid Bucharest / deplasman | 4-1 | 100→87.6 | 3.35→3.40 | 156.05→525.80 | LOSS |
| 25 | Sydney FC–Adelaide United / deplasman | 2-1 | 91.4→81.2 | 3.15→3.10 | 126.26→142.14 | LOSS |
| 25 | Atalanta–Frosinone / deplasman | 4-4 | 61.0→63.8 | 4.20→4.10 | 8128.32→32424.90 | DRAW |
| 25 | Independiente–Boca Juniors / ev | 0-1 | 83.3→75.8 | 4.20→4.20 | 57.93→57.97 | LOSS |
| 25 | Barcelona–Real Madrid / deplasman | 1-2 | 54.0→54.7 | 4.10→3.80 | 55684.70→136821.00 | WIN |
| 26 | Montpellier–Red Star / deplasman | 2-1 | 56.8→67.7 | 3.05→3.15 | 42.53→77.86 | LOSS |

## Filtre tavsiyesi: SURPRISE FLOW CONFIRMATION — ileriye dönük shadow

Rastgele üst oran veya üst para payı sınırını **yeni kural olarak önermiyoruz**. Bunun yerine, T-72 gibi çok erken olabilen ancak nadir sinyalleri T-24'te değerlendirmek için temel kanıt sıralaması:

1. **Gerçek piyasa ve veri kalitesi:** 1X2'nin uygun tarafının oran, para payı, karşı taraf bilgileri, kaynak tarihi ve zamanının geçerli olduğu gözlem. Tek bir £2.38'lik girişin %100 share olması doğrulanmış likidite sayılmaz; piyasanın kaç sonucu parasal olarak işlenmiş olduğunu gözlemle.
2. **Pay koruması/ivmesi:** Aynı takımda seçilen para payının ilk kontrol anından sonra gerilememesi. Bu doğrudan süreklilik ölçüsüdür; keyfî bir %50-69 'ideal' bandı gerektirmez.
3. **Yeni para girişi:** Sonraki kontrol noktasında yalnız yüzde değil, seçilen tarafın gerçek £ desteğinin de artması. Birikimli toplamları karşı tarafın ve beraberliğin net para artışıyla kıyasla; varsa anlık hacim ve piyasa toplam artışını karşılaştır.
4. **Bağımsız fiyat onayı:** Aynı takımın oranı yükselmiyorsa (fiyat sabit/düşüyor) para desteği ve piyasa fiyatlaması aynı yöne işaret edebilir. 2.90 altına düşen oranı otomatik "SUPRISE bozuldu" diye olumsuz sayma; fiyat düşüşü lehine olabilir.
5. **Daha fazla sinyal için yakın zaman testi:** T-72 kökeni çok nadir olduğundan T-24 → T-12 → T-8/T-6 akışının ayrıca değerlendirilmesi gerekir; **bu zaman zinciri için bu rapor prospektif veya eksiksiz bir performans sayısı iddia etmiyor**.

Yeni canlı filtre uygulanmadı, öneri **SHADOW/test** statüsünde. Tarih ve lig etkisi, kaynak kapsamı, 35 dk tolerans ve in-sample eşik seçimi nedeni ile güvenilir ileri başarı oranı bu analizden çıkarılamaz.
