# PROMPT 2 — SXF ARŞİVE KAYDET (v1.0)

CAPİTALE SXF arşiv kayıt işlemini başlat. GitHub'da `methods/sxf_archive_methodology.md`, `schemas/sxf_archive_schema.md` ve `archive/README.md` kurallarına uy.

**Kayıt kapsamı:** Bu konuşmada en son **bana sunulmuş, maç öncesi AS_OF'u belirli SXF tarama raporu**. Hangi rapor olduğu belirsizse bir kez sor. **Supabase'i yalnızca mevcut SmartXFlow verilerini okumak için (SELECT) kullanabilirsin; Supabase'e yeni arşiv kaydı, snapshot veya performans raporu yazma. Tüm kalıcı arşivleme yalnızca GitHub'da yapılır.** Yeni depolama platformu ekleme.

**İşlem sırası:**

1. Rapordaki AS_OF, tarih, tarama aralığı, motor sürümü, mod (`DYNAMIC_AS_OF_V04` veya açıkça belirtilmiş `CHECKPOINT_RESEARCH_T6_FALLBACK_T8`), fixture_uid, kaynak timestamp'leri ve özgün SXF oranlarının kayıtlı olduğunu denetle. Eksik alanları tahminle doldurma.
2. Bu tarama için benzersiz `run_id` ve `scan_id` üret. Daha önce aynı run kaydedildiyse kopyasını açma; gerekiyorsa yeni revizyon ekle.
3. **1 — Tarama Sonuçları:** `archive/YYYY/MM/DD/01_scan_results/` altına makine okunur JSON ve okunabilir Markdown raporu kaydet. Her seçim için maç, piyasa/taraf, motor etiketleri, oran, para payı, **seçim parası £**, kısa önemli not, AS_OF ve kaynak snapshot referansını tut. Min 1.30 nedeniyle elenen sinyalleri denetim kaydına al. Henüz maç sonuçlarını bu orijinal rapora ekleme.
4. **3 — Günün tüm snapshot arşivi:** Sinyal çıkanlar değil **günün bütün maçlarının bütün gerçekten toplanmış pre-match 1X2/OU/BTTS snapshot'ları** kaynak erişiminden mevcutsa sıkıştırılmış dosyalar olarak GitHub Releases'e yükle; SHA-256, kayıt sayısı, saat aralığı ve eksikleri `03_full_snapshots/manifest.json` içinde göster. GitHub Releases'e büyük dosya yazamıyorsan `NOT_COLLECTED` / `NOT_UPLOADED` olarak işaretle; yüklenmiş gibi gösterme.
5. **4 — Konsantre Arşivi:** Günün **bütün maçları** için T-72, T-60, T-40, T-24, T-12, T-8, T-6, T-3, T-1 noktalarında tüm üç piyasanın kayıtlarını üret. Her T için yalnızca o T anında veya **öncesinde** bulunan son snapshot'ı seç; gerçek kaynak zamanı ve gecikmeyi sakla. Yoksa MISSING. Sinyalsiz maçları çıkarma. Büyükse yine sıkıştırılmış GitHub Release dosyası + manifest kullan.
6. Günün `archive/YYYY/MM/DD/manifest.json` dosyasında dört arşivin durumunu (`COMPLETE`, `PARTIAL`, `MISSING`, `NOT_COLLECTED`) ve kesin GitHub yolları, commit SHA/release asset linkleri ile özetle. Kullanıcıya kaydedilen ve kaydedilemeyen parçaları ayrı göster.

**Değişmez kural:** Daha sonra görülen maç sonucuyla orijinal pre-match sinyal kaydını değiştirme. Git commit geçmişini koru; orijinal raporun değiştirilmesi gerekiyorsa yeni revizyon oluştur. Sonuçlar yalnız sonraki 'SXF SONUÇLARI İŞLE' komutuyla ayrı kayıt olur.

GitHub'a gerçekten yazamadığın dosya için "kaydedildi" deme; gerçek durum ve engeli bildir. Hiçbir uygulama tamamlanmadan tamamlandı iddiasında bulunma.
