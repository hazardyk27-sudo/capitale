# SXF EKOL-2 — Gerçek karar zamanı T-6 doğrulaması

**26 Ekim 2026** — Araştırma denetimi, performans sonuçlarından bağımsız zaman kilidi.

## Kaynak ve denetim
- GitHub `SXF_arastirma_arsivi/2026/10/09` ... `/25` tüm 17 adet `sxf-research-YYYY-MM-DD-t6-fallback-t8-16to24-v1/v2.json` günlük scan dosyası tekrar okundu.
- `market="1X2"` ve `V1` engine tag olan orijinal tarama satırı **185**.
- **185/185** V1 tarama satırının `kickoff_utc - (decision_as_of_utc|as_of_utc)` süresi **tam 6 saat**. Kontrol `checkpoint=6` veya `reference_checkpoint="T-6"` ile tutarlı.
- Bu 185 V1 satırının **184 tanesi WIN/LOSS** arşiv sonuçlarıyla eşlenmiş olup Ekol-1 ve Ekol-2 değerlendirmelerinin evreni olan 184; 1 sonuç **UNVERIFIED**. Bu yüzden model performansı 184 tabanında ölçüldü.
- Dosya adındaki `t6-fallback-t8` ifadesi bu V1 kohortunun T-8'de karar verdiği anlamına **gelmez**: incelenen **185 V1 kararının tamamı T-6**.

## Ekol-2 bu kararla nasıl çalışır?
- Ekol-2 kararı `t0 = T-6` (kickoff'tan 6 saat önce).
- `t1 = t0 - 2 saat = T-8`: aynı fixture için T-8 anında veya **ondan önceki en son** taze kaynak snapshotı (en fazla 10 dakika eskilik, 1/X/2 aynı timestamp).
- `t0` snapshotı T-6 anında veya **öncesinde** olmalı (en fazla 10 dakika eskilik).
- `marginal_pick_share`, 1X2 `1/X/2` para hacimlerindeki **T-8→T-6** farkından; `previous_cumulative_pick_share` yalnız T-8'den.
- De-vig fiyat teyidi aynı T-8 ve T-6 kaynak oranlarından hesaplanır.
- T-6 sonrası **T-5, T-4, T-3, kapanış ve maç içi veri yok**. Sonradan bağlanan 90-dakika FT yalnız backtest kazanç/kayıp etiketidir, giriş/sinyal özelliği değildir.
- T-8/T-6 veri eksik veya uyuşmazsa yeni araştırma etiketi yok; **sinyal zamanı ertelenip T-5/T-4 verisiyle "tamamlanmaz"**. Mevcut V1 kanonik sinyali ayrı kalır.

## Örnek
- `Al-Fateh (KSA) – Al Ahli`, KO 2026-10-09 14:55 UTC (17:55 TSİ). Arşiv karar anı 2026-10-09 **08:55 UTC = 11:55 TSİ**, KO'dan tam 6 saat önce. İvme karşılaştırması hedef T-8 06:55 UTC = 09:55 TSİ ile T-6 08:55 UTC = 11:55 TSİ arasındadır.
- Başlama 20:00 TSİ ise geçmiş tarama T-8=12:00 TSİ, nihai sinyal T-6=14:00 TSİ. Kullanıcı için iki saat geç sinyal üretimi söz konusu değildir.

## Performansla ilişki
- Ekol-2 önceden tanımlanmış tanısal `accel+price` sürümü T-6 kohortunda 36/48 (**%75,0**), 48/17 (**2,82 tekil sinyal/gün**); primary birleşik draw filtresi 35/47 (**%74,5**).
- Sinyal zamanlarının T-6 olarak doğrulanması, **geçmişte seçilmiş ve daha önce görülmüş sonuçları bağımsız prospektif test haline getirmez**. Gelecekte gerçek `T-6` veya gerçek dinamik per-fixture AS_OF ile test gerekli.
- Canonical `methods/sxf_methodology.md` ve `roles/sxf.md` değiştirilmemiştir. Bu audit **T-6 araştırma kohortunun** zamanlamasını teyit eder; gerçek canlı dinamik per-match AS_OF politikasının yerine geçmez.

**Verified research-only / NO CANONICAL CHANGE.**
