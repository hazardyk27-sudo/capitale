# SXF BTTS_YES — Genel sinyal hacmini koruyan çift-koşullu risk vetosu (T-6)

**27 Ekim 2026 | EXPERIMENTAL / SHADOW ONLY | Canonical SXF v0.4 motorunu değiştirmez**

## Araştırma sorusu
Mevcut kanonik KG VAR motoru **29/41=%70,73**, 9–25 Ekim 2026 tarihleri boyunca **2,41 sinyal/gün**. Kullanıcının hedefi isabeti artırıp sinyal hacmini yaklaşık 2/gün veya üzeri tutmak.

## Korunan KG VAR temel kriterleri
Mevcut BTTS_YES: YES para en az **£750**, YES para payı en az **%60**, YES SXF odds **1,60–1,90**, gerçek karar anı **T-6**. Kaynak: günlük SXF arşiv sinyalleri `loss_features_2026-10-09_16_v1.json`, `loss_features_2026-10-17_25_v1.json`.

## Shadow risk adayı: BOTH-NEGATIVE-VETO
Temel KG VAR sinyali oluştuğunda:
1. Aynı fixture için **T-6 SXF ÜST 2.5 (OU25 O) oranı > 2,00** (goller piyasasında ÜST görece pahalı = düşük ima edilen toplam gol desteği) **VE**
2. SXF BTTS Y/N fiyatlarından de-vig hesaplanan `p_B=(1/YES)/[(1/YES)+(1/NO)]` **T-6'da T-8'den düşük**,
ise sadece **shadow-risk**: `BTTS_RISK_VETO_CANDIDATE`.

Veto **yalnız bu iki koşul AYNI ANDA** varsa geçerli. Üst 2.5 T-6 odds <=2,00 ise tek başına veto yok. KG YES implied price T-6'da T-8'den düşük değilse, ÜST 2.5 >2,00 olsa da tek başına veto yok.
- T-8 ve T-6 BTTS Y/N aynı fixture ve timestamp, her snapshot ilgili hedef anından önce en fazla 10 dakika eski olmalı; T-6 arşiv sinyaliyle fiyat ±0,02; T-6 OU25 O/U tam ve aynı kaynak anında olmalı.
- Eksik/eskimiş cross-market snapshot durumunda otomatik olumlu kabul veya kalıcı sinyal silme yok: `RISK_UNVERIFIED`, mevcut canonical sinyal korunur.
- Baz araştırma T-6 odaklıdır. Canlı farklı horizon'a T-8/T-6 şartı bire bir aktarılmaz; dynamic AS_OF için ayrı test gerekir.

## Geçmiş T-6 sınama (mevcut 41 settled sinyal)
| Tanım | WIN/N | İsabet | Sinyal/gün (17 gün) | 9–16 Ekim | 17–25 Ekim |
|---|---:|---:|---:|---:|---:|
| Canonical BTTS_YES (hiç veto yok) | 29/41 | %70,73 | 2,41 | 16/20 | 13/21 |
| **BOTH-NEGATIVE-VETO sonrası kalan** | **29/37** | **%78,38** | **2,18** | **16/20** | **13/17** |
| Basit KG YES oranı <=1,80 | 24/31 | %77,42 | 1,82 | 12/16 | 12/15 |
| KG YES para payı >=%70 | 23/31 | %74,19 | 1,82 | 11/13 | 12/18 |
| ÜST2.5 SXF oranı <=2,00 tek başına | 27/35 | %77,14 | 2,06 | 15/19 | 12/16 |
| Daha sıkı test: ÜST2.5 <=1,90 VEYA KG fiyatı teyit ediyor | 28/36 | %77,78 | 2,12 | 15/19 | 13/17 |
| KG YES T-8→T-6 fiyat teyidi tek başına | 14/16 | %87,50 | 0,94 | 8/9 | 6/7 |
| KG ve ÜST çift fiyat teyidi | 13/14 | %92,86 | 0,82 | 7/7 | 6/7 |

**Veto edilen dört maç (arşivde FT skorları, harici doğrulama yok):**
1. 18 Ekim Bournemouth – Sunderland: 2-0, LOSS; OVER 2.5 SXF oranı T-6 **2,04**, KG YES fiyat piyasası T-8→T-6 zayıfladı.
2. 20 Ekim Burton Albion – Bradford: 0-0, LOSS; OVER T-6 **2,04**, KG fiyat zayıfladı.
3. 24 Ekim Blackburn – Wrexham: 2-0, LOSS; OVER T-6 **2,20**, KG fiyat zayıfladı.
4. 25 Ekim Udinese – AC Milan: 0-2, LOSS; OVER T-6 **2,02**, KG fiyat zayıfladı.

Bütün bu seçimlerin 12 kayıptan 4'ünü çıkarması geri kalan kaybeden maçlar için yanlış güven yaratmamalı. Kalan **8/37 kayıp** var. Çoklu alternatif denemesi nedeniyle 29/37 oranı iyimser ve **geçmiş veriye aşırı uyum** riski yüksektir. Bu kural 17–25 Ekim sonuçları bilindikten sonra geliştirildi: sonuçların yalnız son tarihlerde görünmesi bağımsız holdout testi olmadığı gerçeğini değiştirmez.

## Gerekçe
KG VAR'ın gerçekleşmesi iki takımın da gol bulmasını gerektirir. SXF ÜST 2.5 fiyatının 2,00 üzerinde olması yüksek gol toplamının piyasa tarafından kuvvetle desteklenmediğine işaret eder; KG YES de-vig implied odds T-8→T-6 düşüşü ise bu seçeneğin piyasada güç kaybettiğine işaret eder. İkisi beraber **piyasa-içi tutarsızlık / gol beklentisi aşağı riski** verebilir. Bu doğrulanmış nedensellik veya marketlerden bağımsız ikinci kanıt değildir.

## Araştırma sonucundan üretim kararına
1. **Canonical değişmedi**. Araştırma gölge risk/veto etiketi dışında canlı sinyal iptali yok.
2. **Ön koşullu geleceğe dönük test**: En az 50 tercihen 100+ *gelecek* T-6 BTTS_YES sinyalini etiketle; veto ve baseline önceden AS_OF ile dondurulsun. Bütün 41 araştırma maçının geçmişte kural karşılaştırmalarında kullanılması nedeniyle bunlar dış örneklem sayılamaz.
3. Başarı kıstası: kalan KG YES için >%75 isabet **ve** en az 2/gün hacim, gerçek oynanabilir oranlarda beklenen değer ve günlük istikrar, veto edilenler arasında kayıp oranı yüksek mi? Piyasa fiyatından bağımsız kabul yok.
4. Sadece %70→%78 historik sıçramayı baz alıp kesin 'iyileşti' deme. Kadro/lig haberleri, dış form, POLY, ek kaynak bu araştırmada kullanılmadı.

**STATUS: Research-only candidate.**
