# SXF 1X2 — Yaygın sinyalleri koruyan kayıp riski filtresi
**Araştırma tarihi:** 2026-10-26  
**Kapsam:** 9–25 Ekim 2026, T-6 / T-8 fallback araştırma taramaları, 16:00–24:00 TSİ, 259 sonuçlanmış 1X2 tekil seçim.  
**Durum:** EXPLORATORY SHADOW, **SXF v0.4 motorlarında hiçbir değişiklik yok**. Gerçek zamanlı dinamik AS_OF için ayrı doğrulama şarttır.

Kaynaklar:
- [Genel 17 günlük performans](Sinyal_Performanslari.json)
- [1X2 orijinal sinyal özellikleri, 9–16](loss_features_2026-10-09_16_v1.json)
- [1X2 orijinal sinyal özellikleri, 17–25](loss_features_2026-10-17_25_v1.json)
- [İlk güçlü-1X2 araştırması](SXF_1X2_Filter_Research_2026-10-09_25_v1.md)

## Kullanıcı hedefi
Nadir görülen HEAVY + X para değişimi gibi çok seçici 'strong' şartları yerine **tüm 1X2 motorlarında yüksek coverage ile şüpheli kayıpları eleme**. Tüm sinyaller sabit pre-match as-of özelliklerinden ve ayrı FT settlement sonucundan araştırıldı. 15 Ekim tarih uyuşmazlıklı Cerro Porteño seçimi **UNVERIFIED** ve hariç; 26 Ekim henüz sonuçlanmayan maçlar hariç.

## Esas iki kalite/risk kapısı (LIGHT)
1. `STALE_SOURCE`: Seçimin son kaynak 1X2 snapshot zamanı karar-anı AS_OF'tan **10 dakikadan eski**. Kaynak gözlem olmayan / timestamp uyuşmayan vakaları otomatik olumlu sayma; quality unknown.
2. `EXTREME_SHARE_THIN_MONEY`: Seçilen tarafın **para payı >=%95** VE **seçim parası < £10.000**. Bu koşul birleşik olmalı: sadece %95+ olan yüksek £ sinyallerini sırf yüzdeden dolayı elemeyelim.

**Yalnızca en az bir kapı geçersiz ise sinyali riskli olarak işaretle.** Bu bir veto/ana motor değişikliği değildir; user approval ve prospective test öncesi shadow-only.

| Cohort | Seçim | WIN | LOSS | İsabet | Coverage |
|---|---:|---:|---:|---:|---:|
| Filtresiz 1X2 | 259 | 167 | 92 | 64,5% | 100% |
| LIGHT sonrası tutulan | 236 | 160 | 76 | **67,8%** | **91,1%** |
| LIGHT tarafından işaretlenen | 23 | 7 | 16 | 30,4% | 8,9% |

- 23 riskli sinyal içinde **16 LOSS, 7 WIN**; toplam tarihsel kayıpların 16/92 = **17,4%**'ü ve tarihsel kazananların 7/167 = **4,2%**'si risk grubuna giriyor.
- Risk bayrakları ayrı olarak `STALE_SOURCE`: 5/5 LOSS, 0 WIN; `EXTREME_SHARE_THIN_MONEY`: 19 seçim, 12 LOSS, 7 WIN, **1 çakışma**.
- Kaynak yaşlılığına bağlı beş kötü gözlem **13 Ekim** tarihine yoğunlaşmış ve snapshot yaşları yaklaşık **827–947 dakika**; bunlar motor matematiğinden çok veri tazeliği kusuru olabilir. Bu günü hariç tutunca baseline 161/248 = 64,9%; LIGHT 154/230 = 67,0%; gözlenen fark **+2,1 puan** kalıyor, +3,3 puanın tamamını kalıcı motor becerisi sayamayız.

**Gün ayrımı (eşikler tamamı görülerek seçildi, holdout DEĞİL):**
- 9–16 Ekim: 79/109 = 72,5% → 74/96 = 77,1%
- 17–25 Ekim: 88/150 = 58,7% → 86/140 = 61,4%.

**Motor kesitleri (bir selection birden çok etikete dahil olabilir):**
- EARLY CORE: 55/83 (%66,3) → 55/81 (%67,9).
- EARLY T12: 102/162 (%63,0) → 99/149 (%66,4).
- V1: 117/184 (%63,6) → 110/164 (%67,1).
- V2: 90/144 (%62,5) → 83/128 (%64,8).
- HEAVY: 49/68 (%72,1) → 49/67 (%73,1).

**SXF para/odds sonucu yalnız teorik getiri:**
- Tüm orijinal SXF karar oranıyla birim-stake getiri: 12,6% → 18,8%; SXF × 0,93 yapay fiyat senaryosu: 4,8% → 10,5%.
- Bunlar **betting platform executable fiyatları veya gerçek ROI değildir**, referans hesaplarıdır; geçmiş performans ekonomik avantaj garantisi vermez.

## Üçüncü kademenin deneysel opsiyonu (MEDIUM)
Yukarıdaki LIGHT kurallarına ek olarak **V2 son üç saat minimum seçilen taraf para payı >=%90** olduğunda RİSK bayrağı. Böylece yüksek yoğunluğun düşük £ ile beraber olabildiği güçlü gözüken ama geçmişte sıkça kaybeden küçük grup inceleniyor. **Yeni canonical veto değil.**

| Cohort | Seçim | WIN | LOSS | İsabet | Coverage |
|---|---:|---:|---:|---:|---:|
| MEDIUM sonrası tutulan | 223 | 154 | 69 | **69,1%** | **86,1%** |
| MEDIUM işaretlenen (birleştirilmiş) | 36 | 13 | 23 | 36,1% | 13,9% |

MEDIUM, LIGHT'a göre ilaveten **13** sinyal siliyor: **7 kaybeden ve 6 kazanan**. Hacim kaybı için kazanç daha küçük olduğu için **LIGHT, yüksek kapsama hedefi açısından tercih edilen deneysel varsayılandır**.

- 9–16 Ekim: 69/88 = 78,4%
- 17–25 Ekim: 85/135 = 63,0%.
- `V2 3h min share >=90%` tek başına 12/28 (%42,9); fakat eşik geçmiş başarı sonuçları üzerinden keşfedildiği için canlı veto yapılmamalıdır.

## Negatif karşı-test
- X (beraberlik) para payının 2 saat içinde artması bütün 1X2 evrenine tek başına veto olarak taşınmamalı. Kaynağı taze ve kaynak uyumlu iki-saat geçmişi bulunan 239 seçimde `X share yükseldi >=1pp` kuralıyla 45 seçim elendi ama **29 WIN** ve sadece **16 LOSS** vardı: %82,6 coverage ile isabet hemen hemen **64,5%**, yani faydalı bir genel veto değil.
- HEAVY <2 grubundaki X trendi bulgusu yalnız **dar bir alt grupta** umut vericidir; tüm sinyale genellenmemeli.
- Aynı örneklemde çok sayıda aday denendi. Sonuç bazlı karar sonrası optimizasyon nedeniyle gerçek ileriye dönük etki ve net ROI **bilinmiyor**.

## Uygulama / validasyon
- Yeni `LIGHT_RISK` ve `MEDIUM_RISK` gölge işaretleri kaynak seçimiyle beraber AS_OF anında kaydedilsin.
- `NO_DATA / STALE` kesin kaynak kalitesi farkı olarak görülsün; doğru maç ve tarih eşleştirmesi yapılmamışsa sonuçlar `UNVERIFIED` kalsın.
- 1X2 V1/V2/HEAVY/EARLY aktif kuralları ve tarihsel frozen seçim dosyaları DEĞİŞTİRİLMEYECEK. Yeniden tarama sırasında yalnız debug/shadow flags.
- Min. 50 yeni, prospective ve kaynak eşlenmiş karar ile, gerekiyorsa daha fazla maçla ayrı altgrup örneklemi; raporla: unique selection, dropped win/loss, remaining hit, coverage, per-day consistency, normal-time FT cross-verification, real available bookmaker prices, ROI, confidence intervals; kronolojik out-of-sample ile izle. Kör doğrulama ve sahibin son kararı olmadan yeni veto production'a geçirilmez.

**NOTE ONLY — no canonical production change.**
