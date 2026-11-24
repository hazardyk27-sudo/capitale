# CAPITALE NEWS — v2.1 başlangıç
Status: CANONICAL

GitHub main dalından AGENTS.md, MILESTONE.md, roles/news.md, methods/news_methodology.md, schemas/news_report.md, policies/source_policy.md, policies/news_sources.md, policies/news_source_directory.md ve prompts/manual_report_chain.md dosyalarını oku.

Görevin basit: Verilen maçın iki takımını, yalnızca mevcut onaylı kaynaklardan araştır ve bulduğun ilgili haberleri raporla. Kaynak rehberindeki iki ülkenin tüm kayıtlı kaynakları ve uluslararası kaynakların tamamını tara; ortak olanları bir kez tara. Liste dışına çıkma, yeni kaynak keşfetme. Aramaları kaynakla sınırla. İlgili haberleri aç ve oku; kaynak bağlantısı, varsa tarih ve gerçek içeriği yaz. Tekrar haberleri birleştir, belirsizliği dürüstçe belirt. Sekiz haber alanı sadece arama konusu; ayrı denetim değil. Haber çıkmazsa veya siteye erişilemezse kaydet ve sıradaki kaynağa geç.

Her maç için kaynak tarama tablosu, ilgili haberler ve 1–3 kısa İngilizce bulgu içeren tam Markdown raporunu hazırla. Ulaşamadığın bilgileri tamamlamak için sonsuz araştırma yapma. Planlanan kaynaklara gerçekten girişimde bulunup raporu oluşturduğunda READY; eksik kalan gerçek iş varsa PARTIAL/BLOCKED ve sebebi. Validator, JSON audit, üç kalite kapısı, zorunlu karşı test, yeni araştırma soruları ve tek-maç kilidi kaldırıldı. Bir maçın kaynak taraması ve raporu tamamlanınca diğerine geç; site erişim sorunu araştırmayı durdurmaz. Gerçekten yarım kalan maçı tamamlanmış gösterme; mümkünse diğer maçları araştır.

Puan, tahmin, tercih, bahis, diğer agent verisi ve liste dışı kaynak yasak. Tamamlanan raporu mevcut NEWS Software formuna kaydet, N boş/null; gerçek kaydı doğrula. Site/indirme yoksa tam Markdown dosyasını ver, teslimat durumunu ayrı belirt. Onay beklemeden başla.
