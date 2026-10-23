# PROMPT 1 — SXF GÜNLÜK TARAMA (v1.0.1 — Supabase READ / GitHub WRITE ayrımı)

CAPİTALE SXF rolünde çalış. GitHub'dan sırayla `AGENTS.md`, `MILESTONE.md`, `roles/sxf.md`, `policies/source_policy.md`, `policies/sxf_sources.md`, `schemas/sxf_report.md`, `methods/sxf_methodology.md`, `methods/sxf_archive_methodology.md` ve `schemas/sxf_archive_schema.md` dosyalarını oku.

**Tarih:** [GG.AA.YYYY / varsayılan bugün TSİ]
**Tarama başlangıcı–bitişi:** [SS:DD–SS:DD TSİ / varsayılan bugün kalan tüm maçlar]
**AS_OF:** [ŞİMDİ veya kesin tarih+saat TSİ]
**Mod:** [DYNAMIC_AS_OF_V04 / benim özellikle istediğimde CHECKPOINT_RESEARCH_T6_FALLBACK_T8]

Sadece **SmartXFlow kaynak verilerini** kullan. **NORMAL GÜNLÜK SXF TARAMASINDA SUPABASE KULLANILABİLİR VE KULLANILMALIDIR**: mevcut SmartXFlow fixture, moneyway 1X2 / OU2.5 / BTTS ham geçmiş, alarmlar ve sinyal event tablolarını **yalnızca SELECT (salt okunur)** ile tara. Kullanıcı ayrıca izin vermek zorunda değildir. **SUPABASE YASAĞI SADECE ARŞİVİN SUPABASE'E YAZILMASI / TAŞINMASI İÇİNDİR**; SXF taramasında Supabase'den veri okumayı yasaklamaz. Yeni tarama raporlarını, ham arşivleri, konsantre gridleri veya performans kayıtlarını Supabase'e INSERT/UPDATE/DELETE etme. Bunların TEK kalıcı arşiv hedefi GitHub'dır. Başka bir depolama platformu ekleme. Supabase'de mevcut SXF verisi yoksa veya tüm maçların fixture listesine erişilemiyorsa bunu açıkça belirt; kaynak ve ölçüm uydurma, tarama tamamlandı deme.

Belirtilen aralıktaki **tüm maçları** fixture kapsamına al. Her maç için kickoff_utc, exact AS_OF, gerçek T-minus süre, piyasa bazında kaynak snapshot zamanı ve kapsama durumunu kontrol et. Canlı SXF v0.4 varsayılanında hiçbir maça ortak T-6 uygulama; her maçın kesin kalan süresini esas al. Eğer özel T-6/T-8 araştırma modu seçtiysem bunu LIVE v0.4 diye etiketleme.

Onaylı motorlar: EARLY CORE, EARLY T12 / Retention-55, V1, V2, HEAVY, STABLE/PREMIUM OVER2.5, BTTS YES, SURPRISE TEAM. Motor eşiklerini GitHub'daki onaylı yöntemden uygula. V2, V1'in bağımsız oyu değildir; HEAVY onun premium etiketidir; PREMIUM, aynı seçimde STABLE'ı supersede eder. SURPRISE doğrudan kazanır önerisi değildir.

**Genel yayın filtresi: SXF seçiminin oranı >=1.30 olmalı.** Sinyal motorunun özgün oran sınırlarını ayrıca koru. Filtre dışı sinyalleri raporda 'ELENDİ – ORAN <1.30' denetim notuna yaz. Bahis sitemin fiyatını SXF oranı olarak gösterme.

Bana aşağıdaki başlıklarda, maçlar kickoff saatine göre sıralı tablo ver:
1. **1X2:** `Maç adı | Taraf | Sinyaller | SXF oranı | Para payı % | Seçim parası £ | Önemli not`
2. **Üst 2.5:** aynı alanlar, STABLE/PREMIUM.
3. **KG VAR / BTTS YES:** aynı alanlar.
4. **SURPRISE:** ayrı; NON-LOSS RISK olduğunu açıkça belirt.

Sonda toplam taranan **farklı maç**, veri bulunan maç, sinyal alan **farklı maç**, sinyal alan **farklı bahis seçimi**, motor etiket sayıları, 1.30 nedeniyle elenenler, eksikler, kaynak/as-of ve metodoloji sürümünü göster. Uydurma güven yüzdesi veya A/B/C verme.

**ÖNEMLİ:** Bu adımda henüz maç sonucu kullanma veya sonradan verileri geriye sızdırma. Önce tabloyu bana sun. Tarama raporunu kaydetmeyi bir sonraki `SXF ARŞİVE KAYDET` komutumda yap.
