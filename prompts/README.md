# CAPITALE — Güncel dört agent başlangıçları

**AKTİF (2026-11-20):** SXF → ANALYST → NEWS → FINAL. **HER AGENT WEB SİTESİNDE KENDİ FORMUNU TARAYICIDA AÇAR, TAM RAPORUNU GİRER VE KAYDET’E TIKLAR.** API JSON/Commander CLI rapor aktarımı veya özel inbox **NORMAL AGENT AKIŞI DEĞİLDİR**. Kanonik: `prompts/manual_report_chain.md` **v4.10**.

| Rol | Direkt agent sayfası | Form |
|---|---|---|
| SXF | `https://betcapitale.com/admin/software?agent=sxf` | Edit SXF — Market report |
| ANALYST | `https://betcapitale.com/admin/software?agent=analyst` | Edit ANALYST — Statistics report |
| NEWS | `https://betcapitale.com/admin/software?agent=news` | Edit NEWS — News report |
| FINAL | `https://betcapitale.com/admin/software?agent=final` | Edit FINAL — Decision |

ANALYST v3.0.7 yalnız `prompts/analyst_start.md` dosyasını oturum başında bir kez okur; ilgili teknik referansları aşamasında kullanır. Tek aktif maç; gerçek araştırma/doğrulama engelinde kalan maçlar QUEUED, yalnız kullanıcı izin verirse atlanır. READY olup yalnız teslimi engellenmiş maçın özgün dosyası korunur ve sıradaki maça geçilir.

Diğer roller başlangıçta `AGENTS.md`, `MILESTONE.md`, `roles/<rol>.md`, `policies/source_policy.md`, ilgili rol kaynak politikası, `methods/<rol>_methodology.md`, `schemas/<rol>_report.md`, `prompts/<rol>_start.md` ve `prompts/manual_report_chain.md` **okunur**.

SXF gerçek `FINAL_SIGNAL` taraması ayrıca otomatik olarak kaynak senkronizasyonunu yapar; **sitenin otomatik kaynak kaydı tam uzman raporu değildir**. SXF tam raporunu siteye kendi formuyla ekler ve her seçim için zorunlu 1–3 kanıt maddesi verir. ANALYST nötr girdiyle v3.0.7 DATA/HUMAN kanıt araştırması (14 HUMAN kaynağı her maçta, ülke filtresi yok; ledger-v1 kompakt rapor) ve tam rapor üretir; A boş. NEWS nötr girdiyle v2.1 yalnız kayıtlı kaynakları tarar, ilgili haberleri ve kaynak durumunu Markdown olarak raporlar; N boş. Validator, JSON audit ve tek-maç kilidi yok. FINAL kendi sayfasında üç özgün tam raporu okur, kendi A/B/C/NO_RECOMMENDATION kararını ayrı FINAL formuna kaydeder; POLY isteğe bağlıdır.

**Mutlaka gerçek admin tarayıcı oturumu gereklidir.** Kullanıcıdan ChatGPT sohbetinde şifre/token istenmez. Commander terminali tek başına web sayfasına tıklama yapmış sayılmaz; Work Cloud Browser veya yetkili gerçek tarayıcı kontrolü gerekir. Böyle bir yetki/araç yoksa ilgili agent UI işlemi yapılmadığını açıkça söyler.

Sadece `SAVED & VERIFIED` + report_id/version (FINAL: `FINAL SAVED & VERIFIED` + decision_id/version) **sayfada gerçekten görüntülendiyse** siteye yazıldı denir. Yalnız rolün kendi kutusu güncellenir; diğerlerini değiştirme. `AS_OF` gerçektir, fikstür başlamadan önce kaynak kesitidir, rastgele saat girilmez. Tam rapor, kısa özet, 1–3 İngilizce bulgu ve kaynaklar site formuna eksiksiz girilir.

İlgili kaynak kodlar sunucu deployment stage kaydındadır. Site ve negatif güvenlik testleri tamamlandı; **dört agentın gerçek tarayıcı üzerinden yazdığı uçtan uca test henüz yapılmadı**. Eski `tools/capitale_report_uploader.py`, `tools/manual_report_inbox.py` yalnız sistem içi yedek/otomatik kaynak altyapısı için tutulur. Günlük agent mesajlarında varsayılan olarak önerme.
