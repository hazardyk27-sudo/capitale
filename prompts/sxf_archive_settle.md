# PROMPT 3 — SXF MAÇ SONUÇLARI VE MOTOR PERFORMANSI (v1.0)

CAPİTALE SXF'nin **önceden kaydedilmiş** günlük taramasını sonuçlandır. GitHub'daki `methods/sxf_archive_methodology.md`, `schemas/sxf_archive_schema.md` ve `archive/README.md` kurallarını oku.

**Tarih:** [GG.AA.YYYY TSİ / varsayılan en son tamamlanmış rapor]
**Run ID:** [varsa gir; yoksa o tarihteki yayımlanmış scan'leri listeleyip doğru taramayı belirle]
**Getiri hesabı:** [1 unit / seçim; ayrıca %7 düşük oran senaryosu]
**Minimum bahis oranı:** 1.30
**Veri kaynağı:** Gerekli canlı/ham SmartXFlow verilerini veya mevcut maç sonucu kayıtlarını Supabase'den salt okunur sorgularla okuyabilirsin. **Arşiv ve performans raporlarının tek yazma hedefi GitHub'dır; Supabase'e hiçbir arşiv/performance kaydı yazma.**

1. GitHub'daki orijinal `01_scan_results` raporunu **değiştirmeden** oku. Bu rapordaki seçimleri esas al; sonradan çıkan yeni sinyalleri, kapanış oranlarını ya da maç sonucunu kullanarak seçimleri geriye dönük düzeltme.
2. Günün tüm maçlarının normal süre skorlarını güvenilir sonuç kaynaklarından doğrula. Fixture UID + kickoff ile doğru maçı eşleştir. FT olmayan, ertelenen veya doğrulanmayanları `PENDING/UNVERIFIED` tut; kesin sonuç yazma.
3. **Önce her piyasa/seçim için tablo:** `Maç adı | Taraf | Motorlar | SXF oranı | Para payı | Seçim parası £ | Skor | Kazandı/Kaybetti/Bekliyor | Not`. 1X2, Üst 2.5, BTTS YES ve SURPRISE'ı ayrı göster. SURPRISE'ın öncelikli başarı ölçüsü **kaybetmeme**; onu doğrudan kazanç bahsi olarak hesaplama.
4. **Motor bazlı performans tablosu:** V1, V2, HEAVY, EARLY CORE, EARLY T12, STABLE/PREMIUM OVER, BTTS, SURPRISE için sinyal sayısı, galibiyet/isabet, beraberlik/başarısızlık, isabet yüzdesi, gerçek SXF fiyatıyla net unit/ROI ve **ayrı** %7 düşük oran senaryosu. Birleşik getiri yalnızca `fixture_uid + market + selection + scan_id` bazında TEKİL seçimlerden hesaplansın; motorlar üst üste binebilir ve toplamları toplanmaz.
5. %7 senaryosunda tahmini fiyat = `SXF oranı × 0.93`. İki ondalık yuvarlama farkını hesapta gizleme. 1.30 altına düşenleri bu senaryonun bahis listesi dışında bırak ve sayısını belirt. Kullanıcının gerçek sitesinin oranı varsa ayrıca hesapla; bu tahmini fiyatı gerçek oynanan fiyat diye sunma.
6. Kayıp nedenlerinde `maç sonucu olgusu`, `maç öncesi risk hipotezi` ve `maç sonrası yorum` ayrımını koru. Özellikle beraberlik, odds değişimi, para payı düşüşü ve düşük likidite incelemeleri yapabilirsin; maç sonrası veriyi önceki karara geri yazma.
7. **2 — Tarama ve Maç Sonuçlarıyla Performans Ölçümü** raporunu `archive/YYYY/MM/DD/02_outcome_performance/` altında ayrı JSON + Markdown dosyaları olarak GitHub'a kaydet. Önceki scan'i koru. Günlük manifestte link/status güncelle. GitHub erişimin yoksa raporu burada hazırla ama kalıcı kaydedildiğini iddia etme.
8. Bana en sonda **günün motor sonuçları**, toplam tekil seçimlerin ROI'si, başarısızlık örüntüleri ve kaydedilmiş GitHub dosyalarının doğrulanabilir bağlantılarını ver.

Bu komut yalnız araştırma ve performans ölçümü içindir; yeni motor eşiği veya FINAL A/B/C kararı üretmez.
