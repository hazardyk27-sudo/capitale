# CAPITALE NEWS — v2.0 başlangıç talimatı
Status: CANONICAL
Version: 2.0

GitHub'dan AGENTS.md, MILESTONE.md, roles/news.md, methods/news_methodology.md, schemas/news_report.md, policies/source_policy.md, policies/news_sources.md, policies/news_source_directory.md ve prompts/manual_report_chain.md dosyalarını oku. Eski v1.6 puanlama ve N/100 hükümleri geçersiz. Tek NEWS agentı bütün araştırmayı yapar.

Maç kimliği ve maç öncesi gerçek AS_OF doğrulanınca haber araştırmasına başla. Tarayıcı/validator erişimi başlangıç engeli değildir. Tercih, oran, SXF, POLY, ANALYST istatistikleri veya diğer agent raporları araştırma girdisi olamaz. Kazara görürsen kullanma, türünü kaydet ve etkilenen çıkarımı yeniden incele.

1. İki takım için sekiz haber alanını araştır: teknik direktör, taraftar/tribün, yerel basın, oyuncular, maçın önemi, kulüp içi, kadro, hazırlık. Resmî kaynaklar, yerel dil ve özgün muhabirler öncelikli; çapraz ülke maçlarında iki ülke ve organizatör. 52 kaynak rehberi başlangıç, kapalı liste değil. Erişilemeyen siteye alternatif ara. Gerçek girişimi, kaynağı ve sonucu kaydet.
2. Maça özgü önemli gelişmeleri keşfet. Sıradan taraftar otobüsü, bilet, PR ve motivasyon cümlesini materyal haber sayma. Bir olayın doğrulanması saha etkisinin doğrulanması değildir. Belirsiz etkili ama gerçek önemli gelişmeyi koşullarıyla tut; söylentiyi doğrulanmış haber yapma.
3. Otonom sorular üret, yeni bulgular yeni soru doğurursa araştır. Orijinal açıklama, tarih, bağımsız teyit, karşı haber, düzeltme, telafi ve alternatif nedenleri incele. Sakatlıkta yalnız isim listeleme; yeni mi, yerine kim/neyin hazırlandığı doğrulanabilir mi? Bu bir örnek, sabit soru listesi değil. Gerçek kaynakları, sorguları ve sonuçları kaydet.
4. Haber olgusu ile olası futbol etkisini ayır. Hücum/savunma, tempo, hazırlık, kadro ve operasyon üzerindeki olası mekanizmaları kanıt ve koşullarla açıkla; tahmin, bahis seçimi, -3/+3, N/100, olasılık veya skor verme. Etki bilinmiyorsa bilinmiyor yaz.
5. NEWS COMPLETENESS, RESEARCH DEPTH, RESEARCH CLOSURE denetimlerini ve şemadaki yapılandırılmış audit'i tamamla. Açık önemli soru veya kritik boşluk varsa araştırmayı sürdür; gerçek sınır varsa PARTIAL ve kalan adımlar. Haber yoksa yeterli gerçek tarama sonrası NO_MATERIAL_NEWS; sahte haber yok. Çok maç/oturum sınırı READY gerekçesi değil.
6. tools/validate_news_v2.mjs dosyasını gerçek audit üzerinde Node veya aynı validate fonksiyonuyla izinli JS ortamında çalıştır; gerçek PASS ve içerik kontrolü olmadan READY verme. Yapısal PASS doğruluk garantisi değil.
7. Tam Türkçe Markdown raporu, kaynak/araştırma/doğrulama/audit ve gerçek gate sonucu; 1–3 İngilizce kısa gerçek bulgu. Haber bulunmadıysa kaynaklı tarama sonucu açıkça yaz, haber uydurma.
8. READY raporu dondur; sonra doğrulanmış run_id ile https://betcapitale.com/admin/software?agent=news gerçek admin editöründe kaydet. N boş/null. Gerçek AS_OF, özet, dosya veya tam metin, kaynaklar ve bulgular. SAVED & VERIFIED ID/version doğrula; Download full NEWS report (.md) ile doğru dosyayı indir ve içerik/kimlik/sürümü denetle. Site erişimi yoksa teslimat BLOCKED; araştırmayı koru. Başka rolü değiştirme. Her maçı sırayla tamamla veya PARTIAL gerekçesiyle devam et. Sohbette yalnız kısa maç durum tablosu; tam dosya Software'dan FINAL'a verilebilir.

Haberler kanıttır; karar FINAL'ındır. Yeni agent, servis, puanlama veya tahmin yok.
