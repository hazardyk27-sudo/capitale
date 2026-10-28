# PROMPT 1 — SXF GÜNLÜK TARAMA (v1.1.0 — T-6 öncelikli / T-8 yedek + Supabase READ / GitHub WRITE)

CAPİTALE SXF rolünde çalış. GitHub'dan sırayla `AGENTS.md`, `MILESTONE.md`, `roles/sxf.md`, `policies/source_policy.md`, `policies/sxf_sources.md`, `schemas/sxf_report.md`, `methods/sxf_methodology.md`, `methods/sxf_archive_methodology.md` ve `schemas/sxf_archive_schema.md` dosyalarını oku.

**Tarih:** [GG.AA.YYYY / varsayılan bugün TSİ]
**Tarama başlangıcı–bitişi:** [SS:DD–SS:DD TSİ / varsayılan bugün kalan tüm maçlar]
**AS_OF:** [ŞİMDİ veya kesin tarih+saat TSİ]
**Mod:** [VARSAYILAN: CHECKPOINT_DAILY_T6_FALLBACK_T8 / yalnız açıkça istersem DYNAMIC_AS_OF_V04 / yalnız tarihsel araştırma istersem CHECKPOINT_RESEARCH_T6_FALLBACK_T8]

Sadece **SmartXFlow kaynak verilerini** kullan. **NORMAL GÜNLÜK SXF TARAMASINDA SUPABASE KULLANILABİLİR VE KULLANILMALIDIR**: mevcut SmartXFlow fixture, moneyway 1X2 / OU2.5 / BTTS ham geçmiş, alarmlar ve sinyal event tablolarını **yalnızca SELECT (salt okunur)** ile tara. Kullanıcı ayrıca izin vermek zorunda değildir. **SUPABASE YASAĞI SADECE ARŞİVİN SUPABASE'E YAZILMASI / TAŞINMASI İÇİNDİR**; SXF taramasında Supabase'den veri okumayı yasaklamaz. Yeni tarama raporlarını, ham arşivleri, konsantre gridleri veya performans kayıtlarını Supabase'e INSERT/UPDATE/DELETE etme. Bunların TEK kalıcı arşiv hedefi GitHub'dır. Başka bir depolama platformu ekleme. Supabase'de mevcut SXF verisi yoksa veya tüm maçların fixture listesine erişilemiyorsa bunu açıkça belirt; kaynak ve ölçüm uydurma, tarama tamamlandı deme.

Belirtilen aralıktaki **tüm maçları** fixture kapsamına al. **GÜNLÜK DEFAULT T-6 → T-8:** Her maç için `kickoff_utc-6h` ve `kickoff_utc-8h` zamanlarını ayrı hesapla. Tarama anında T-6'e ulaşılmışsa ve o piyasa için geçerli kaynak varsa **T-6'daki sinyal durumunu esas al**; T-6 zamanı henüz gelmediyse veya o piyasa verisi yoksa/geçersizse T-8'e dön. T-6'da veri varsa ama motor sinyal üretmediyse T-8'e dönüp sinyal arama. Her motorun T-6/T-8 değerlendirmesini yalnız seçilen checkpoint'e kadar bilinen verilerle yap. Sonradan güncel para payı düşmüş diye T-6'da üretilen sinyali çıkarma: mevcut piyasa varsa sadece ayrı 'GÜNCEL DURUM' notu ekle. İki nokta da kullanılamıyorsa açıkça `NO_VALID_CHECKPOINT`/`CHECKPOINT_PENDING` de. Kaydet: gerçek kickoff, seçilen karar checkpoint'i, kaynak saati, gecikmesi, T-8 fallback sebebi ve arşiv AS_OF. Kaynak tazeliğini ve seçim kimliğini doğrula, uydurma oran/para verme. DYNAMIC_AS_OF_V04 yalnız açıkça istendiğinde kullanılır; tarihsel rekonstrüksiyon ile orijinal pre-match taramayı karıştırma.

Aktif motorlar: EARLY CORE (T-12 bağımsız motoru 28.10.2026'da emekli; Retention-55 korunur), V1, V2, HEAVY, STABLE/PREMIUM OVER2.5, BTTS YES, SURPRISE TEAM. İstenirse EARLY CORE v2, OVER_STRONG, EKOL 3 deneysel/gölge modda, seçili T-6/T-8 karar zamanına sadık biçimde ayrı gösterilir. Motor eşiklerini GitHub'daki onaylı yöntemden uygula. V2, V1'in bağımsız oyu değildir; HEAVY onun premium etiketidir; PREMIUM, aynı seçimde STABLE'ı supersede eder. SURPRISE doğrudan kazanır önerisi değildir.

**Genel yayın filtresi: SXF seçiminin oranı >=1.30 olmalı.** Sinyal motorunun özgün oran sınırlarını ayrıca koru. Filtre dışı sinyalleri raporda 'ELENDİ – ORAN <1.30' denetim notuna yaz. Bahis sitemin fiyatını SXF oranı olarak gösterme.

Bana aşağıdaki başlıklarda, maçlar kickoff saatine göre sıralı tablo ver:
1. **1X2:** `Maç adı | Taraf | Sinyaller | Checkpoint (T-6 / T-8) | SXF oranı | Para payı % | Seçim parası £ | Önemli not`
2. **Üst 2.5:** aynı alanlar, STABLE/PREMIUM, seçili checkpoint ve istenen deneysel OVER_STRONG ayrı etiket.
3. **KG VAR / BTTS YES:** aynı alanlar, T-6/T-8 kaynağı ve sonradan değişen güncel piyasa uyarısı.
4. **SURPRISE:** ayrı; NON-LOSS RISK olduğunu açıkça belirt.

Sonda toplam taranan **farklı maç**, veri bulunan maç, sinyal alan **farklı maç**, sinyal alan **farklı bahis seçimi**, motor etiket sayıları, 1.30 nedeniyle elenenler, eksikler, kaynak/as-of ve metodoloji sürümünü göster. Uydurma güven yüzdesi veya A/B/C verme.

**ÖNEMLİ:** Bu adımda henüz maç sonucu kullanma veya sonradan verileri geriye sızdırma. Önce tabloyu bana sun. Tarama raporunu kaydetmeyi bir sonraki `SXF ARŞİVE KAYDET` komutumda yap.
