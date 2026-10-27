# SXF OVER 2.5 — STABLE/PREMIUM'DAN BAĞIMSIZ yeni sinyal araştırması: sonuç sorgusundan önce protokol

**2026-10-27 | STABLE/PREMIUM kurallarına bağımlılık YOK | Araştırma-only.**
Bu protokol, kapsamlı tarihsel 9–25 Ekim bitiş skorları üzerinden yeni adayların performansı alınmadan önce GitHub'a kaydedildi. Araştırmacı önceki 66 kanonik OVER sinyalinin sonuçlarını zaten gördüğü için bu **tam bağımsız ön-kayıt / kör dış örneklem değildir**. Yeni evrende yalnız SXF verileriyle geniş bir fonksiyon ailesini ölçer; kullanıcıya gelecekte kesin isabet vaadinde bulunmaz.

## Kaynak, karar noktası ve evren
- `research_archive.fixtures`: 9–25 Ekim 2026, 16:00–24:00 TSİ tüm fikstürler.
- `public.moneyway_snapshots`: aynı fixture, T-6 ve (gerekiyorsa) T-8 öncesinde en fazla 10 dakika yaşlı kayıt. T-6 OU25 O+U tek kaynak zamanında; T-8 OU25 O+U tek zamanında; T-6 BTTS Y+N ve T-6 1X2 1/X/2 kullanılıyorsa o kaynaktaki aynı zaman ve tamlık zorunlu.
- FT `research_archive.results`: `match_id_hash+home_team+away_team` eşleşmesi, FT tekil geçerli skor; yalnız **3+ toplam gol** etiketle. Bir maç bir sinyal.
- Tarihsel model kıyası 9–16 (ilk dönem) ve 17–25 (ikinci dönem), ayrıca özellikle **orijinal STABLE/PREMIUM 66'sı DIŞINDAKİ MAÇLARIN** sayısı/isabeti ve `OVER_STRONG` 17 orijinal seçim dışında kalan yeni tekil maçlar raporlanır.
- Fiyat marjı normalize `p_O=(1/odd_over)/[(1/odd_over)+(1/odd_under)]`, `p_B` benzer BTTS YES/NO, `p_H`,`p_A` 1X2 normalize.
- T-8→T-6 fiyat teyidi `p_O6>=p_O8`; T8→T6 kümülatif O/U volume artışı >=0, yeni toplam para pozitif. Yeni OVER payı = `(O6-O8)/[(O6-O8)+(U6-U8)]`.
- T-6 dönemi olmayan karar zamanları dinamik AS_OF için yeniden tasarlanır.

## Motor hipotezleri — geçmişteki mevcut STABLE/PREMIUM tetiklenmesi aranmıyor
A. **MARKET_65**: `p_O6 >= 0.65`. En yalın SXF piyasa-gol modelinin en yüksek piyasa olasılığı seçimi. Para ya da kanonik motor kuralı YOK.
B. **PRICE_CONFIRM_65**: A + T8→T6 `p_O6>=p_O8`. Piyasa fiyatı güçlü ve zayıflamıyor.
C. **PRICE_MONEY_62**: `p_O6>=0.62`, `p_O6>=p_O8`, `O6 volume>=GBP500`. Para miktarı sadece ölçülebilir piyasa derinliğine dair geniş güven koşulu.
D. **PRICE_FLOW_62**: `p_O6>=0.62`, fiyat teyidi, yeni O/U volume her ikisi >=0 ve toplam yeni volume>0, yeni OVER yatırımı payı >=55%, T6 OVER toplam pay >=55%. Bu seçim *yön ve fiyat arasında pozitif teyit* mekanizmasını araştırır.
E. **CROSS_GOALS_60**: `p_O6>=0.60`, `p_B6>=0.50`, `p_O6>=p_O8`. Toplam gol beklentisi artarken çift takım gol ihtimali piyasa tarafından en az 50% destekleniyor.
F. **3MARKET_BALANCE_60**: E + 1X2 `min(home_odds,away_odds)>=1.55`. Aşırı tek-taraflı farklı bir gol dağılımı riskini kısıtlar, tam 1X2 kaydı gerekir.
G. **MARKET_70**: `p_O6>=0.70`; yüksek güçlü piyasa beklentisi karşılaştırması, getirisi SXF odds düşük olabileceğinden ROI ayrı.
H. **PRICE_CONFIRM_70**: G + fiyat teyidi.
I. **STRONG_FLOW_65**: `p_O6>=0.65`, T8→T6 fiyat teyidi, yeni OVER para payı>=55% ve T6 OVER volume>=GBP500.
J. **FLOW_PLUS_BOTH_60**: `p_O6>=0.60`, `p_B6>=0.50`, T8→T6 `p_O6>=p_O8`, ve yeni OVER para payı>=55%.

Bu eşik/bantlar matematiksel fiyat olasılık/para akışı tasarım seçeneğidir; SXF bookmaker executable net oran değildir. **%75+ ve 2+ farklı sinyal/gün** hedefli olsa da teyit olmadan iddia yok; çok adaylı seçim aynı dönemde overfitting içerir.

## Analiz kararı
Önce bu kurallarla **tüm maçlara sonuç kullanmadan etiket**; yalnız sonrasında FT sonuçlarıyla performans ölç. İki farklı örneklem raporla: tüm 9–25 uygun maçlar ve daha önce sonuçlarını araştırdığımız kanonik 66 sinyalin dışında kalanlar. **Yeni hacim** = STRONG UID'leriyle birleşimde tekrar etmeyen yeni maçlar. Basit toplamları çift sayma.

## Yönetim
SXF v0.4 STABLE/PREMIUM/OVER_STRONG'a otomatik müdahale veya canlı sinyal açma yok. Sonradan seçilen en iyi hipotez bir **research candidate** olur, prospectif validasyon gerekir.
