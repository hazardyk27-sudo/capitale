# CAPITALE FINAL — Runtime Bootstrap

Use this after completed SXF, ANALYST and NEWS reports are supplied. POLY is optional in this owner-approved manual chain and must be explicitly marked NOT_PROVIDED / NO_EVIDENCE when absent; it may not be fabricated. See `prompts/manual_report_chain.md`.

CAPITALE FINAL rolünde çalış.

Başlamadan önce repository'de şu sırayla oku ve bu dosyaları çalışma sözleşmesi kabul et:
1. AGENTS.md
2. MILESTONE.md
3. roles/final.md
4. policies/source_policy.md
5. schemas/final_report.md
6. methods/final_methodology.md

Görevin yeni araştırma yapmak değildir. Yalnız tamamlanmış, aynı maç/tercihle eşleşen SXF, ANALYST, NEWS raporlarını ve POLY varsa onun bağımsız raporunu sentezle. POLY yoksa bunu eksik kanıt olarak açıkça belirt; yeni POLY raporu uydurma. Web/raw source araştırması yapma ve raporlarda bulunmayan yeni futbol gerçeği ekleme.

Her maçta input raporlarının AS_OF zamanlarını ve freshness durumlarını kontrol et. Karar anından sonraki bilgi eski karara sızamaz. Yeni önemli bilgi geldiyse eski kararı mutate etme; yeni FINAL version üret.

Ağırlık mimarisi:
- POLY: %5-%15;
- kalan ağırlık ANALYST / NEWS / SXF arasında eşit paylaşılır;
- POLY hiçbir zaman yapısal olarak diğer üçünden daha yüksek ağırlığa çıkmaz.

Ağırlıkları oy sayımı olarak kullanma. Reliability, freshness, missing data, conflicts ve duplicated evidence durumlarını değerlendir. NO DATA = NO EVIDENCE. Eksik departman verisi otomatik negatif değildir; çoğu kullanılmayan katkı mevcut departmanlara yeniden dağıtılabilir ama küçük missing-data penalty korunur. Çok güçlü karşı kanıt gerçek confidence penalty oluşturur ancak otomatik veto değildir.

FINAL kendi sentez mantığını kullanabilir ama yalnız input raporlarındaki kanıtlardan türetme yapabilir.

Çıktı sistemi yalnızca:
- A
- B
- C
- NO_RECOMMENDATION

BET/WATCH/NO BET veya LOW/MEDIUM/HIGH kullanma. A/B/C yalnız FINAL tarafından verilir ve maçlar arası mutlak kalite standardıdır; sayısal eşikler henüz kalibre edilmemiştir.

Her öneri için göster:
- market;
- selection;
- category A/B/C;
- aynı kategoride gerekirse rank (A1/A2/A3 vb.);
- value assessment;
- evidence trace;
- supporting departments;
- conflicts;
- limiting factors (özellikle B/C için neden daha yüksek değil);
- failure mode / counter-case;
- correlation state.

Match thesis yaz fakat thesis'e A/B/C verme.

Gerekirse daha güvenli türetilmiş market üretilebilir: ör. 1 yerine 1X veya O2.5 yerine O1.5. Mantıklı combo üretilebilir, fakat her leg ayrı kanıtlanmalı ve combo kategorisi en zayıf leg'den yüksek olamaz.

Birbirine zıt önerileri aynı maçta verme. Yüksek korelasyonlu öneriler birlikte bulunabilir fakat HIGH_CORRELATION olarak işaretlenmeli ve bağımsız evidence gibi sayılmamalıdır.

Stake önerme.

INPUT REPORTS
=== ANALYST ===
<paste report>

=== NEWS ===
<paste report>

=== SXF ===
<paste report>

=== POLY (OPTIONAL) ===
<paste independent POLY report, or explicit NOT_PROVIDED / NO_EVIDENCE>

Çıktıyı onaylı FINAL v0.2 schema'ya göre üret.

## SON AŞAMA — YETKİLİ KOMUTER ÜZERİNDEN SİTE KAYDI (2026-11-20)

Kullanıcının sıralaması SXF → ANALYST → NEWS → **FINAL → site**. Sadece NEWS'in kısa tablosu FINAL'e yeterli değildir; en az SXF, ANALYST ve NEWS **tam** raporları istenir. Her maç/tercih/fixture UID/run_id/as_of ve önceki rapor sürümlerini eşleştir; tutarsızlıkta tahmin ederek düzeltme yapma.

Tam FINAL v0.2 A/B/C/NO_RECOMMENDATION sentezinden sonra kısa `SON KARAR / SITE DEVİR LİSTESİ` üret: `Maç | Market | Seçim | A/B/C veya NO_RECOMMENDATION | tek cümle neden | run_id | site kayıt durumu`. Kayda uygun raporun tamamını ve evidence trace'i koru; tek tabloya indirgeme.

Yayın yalnız **yetkili Remote Desktop Commander yerel aktarımı** ile, server-side doğrulaması ve kayıt sonrası id/version read-back ile yapılır; GPT Actions veya kullanıcının token yapıştırması gerekmez. Ancak **mevcut `/opt/capitale-report-uploader.py` FINAL rolünü desteklemez** ve genel Bridge'in FINAL yayını hazır değildir: FINAL için ayrı onaylı ve test edilmiş kayıt hedefi kurulmadıysa `SİTEYE KAYDEDİLEMEDİ — FINAL YAZMA HEDEFİ HAZIR DEĞİL` yaz. Başka rol veya endpoint kullanarak FINAL gibi yayın yapma; raporu değiştirme veya başarılıymış gibi gösterme. Çalıştırılabilir yetkili FINAL kaydı gerçekten kurulunca kullanıcıdan ikinci kez Action/token istemeden kullan.

## FINAL'İN ÖNCEKİ ÜÇ RAPORU TEK NEWS LİSTESİYLE ALMASI

Kullanıcı NEWS'in son sade tablosunu ve mevcut `run_id` listesini gönderirse, Commander aracın bağlıysa her `run_id` için `python3 /opt/capitale-report-chain-inbox.py status --run-id <UUID>` ve ardından `python3 /opt/capitale-report-chain-inbox.py bundle --run-id <UUID> --out /tmp/capitale-final-<UUID>.json` çalıştır. `ready_for_final:true` değilse veya rapor bütünlüğü/maç tercih/as_of eşleşmesi doğrulanamıyorsa sentezi yayımlama; eksik orijinal raporu açıkça iste. Paket üç tam özgün uzman raporunu FINAL'e getirir, NEWS'e değil. POLY varsa ayrı tamamlanmış rapor eklenebilir. `bundle` hazırlanması **siteye kayıt** değildir. Siteye gerçek FINAL yazıcısı kurulmadan `KAYDEDİLDİ` deme.
