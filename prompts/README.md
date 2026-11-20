# CAPITALE — Agent Başlangıç Talimatları

**TEK VARSAYILAN İŞ AKIŞI:** `prompts/manual_report_chain.md` — **SXF → ANALYST → NEWS → FINAL → site**.

Her agent yeni çalışma başlangıcında `AGENTS.md`, `MILESTONE.md`, `roles/<rol>.md`, `policies/source_policy.md`, rol kaynak politikası, `methods/<rol>_methodology.md`, `schemas/<rol>_report.md` ve kendi `prompts/<rol>_start.md` dosyasını okur. Daha eski deneysel ANALYST yöntemleri **aktif değildir**, geçmiş sürümleri Git tarihinde bulunur.

| Rol | Başlangıç | Metodoloji | Final öncesi kapanış |
|---|---|---|---|
| SXF v0.4.3 DRAFT | `prompts/sxf_start.md` | DAILY T-6; uygun T-8 fallback | Gerçek sinyaller + **her maç/tercih için en az 1, en fazla 3 bulgu** + yalnız nötr ANALYST listesi |
| ANALYST v2.1 CANONICAL | `prompts/analyst_start.md` | Üç futbol faktörü, ordinal A /100 | Tam rapor + kısa A listesi + nötr NEWS listesi |
| NEWS v1.6 CANONICAL | `prompts/news_start.md` | 8 haber alanı, 7 etki toplamı, ordinal N /100 | Tam rapor + kısa N/100 listesi + FINAL'e arşiv durumu |
| FINAL v0.2 DRAFT | `prompts/final_start.md` | Mevcut tam uzman raporlarının sentezi | A/B/C/NO_RECOMMENDATION + gerçek kayıt durumu |

POLY v1.4 `prompts/poly_start.md` ile **opsiyonel bağımsız** kanıt sağlayabilir; yoksa `NO_EVIDENCE`; FINAL POLY bulgusu uydurmaz. ENGINEER ayrı teknik roldür.

### Tek geçerli devir yöntemi

SXF → ANALYST → NEWS'e **yalnız nötr maç/tercih/kimlik tablosu** verilir. Orijinal üç tam rapor başka uzmanların kanıtı olmaz; FINAL bunları yalnız doğrulanmış `run_id` ile **özel Commander arşivinden** alır (`tools/manual_report_inbox.py` / sunucuda `/opt/capitale-report-chain-inbox.py`). Commander yok veya rapor eksikse kullanıcı üç tam raporu FINAL'e verir. **Arşiv kaydı siteye yayın değildir.**

SXF, ANALYST ve NEWS artık **siteye ayrı ayrı yükleme yapmaz**. Sitenin son yazma adımı FINAL'e aittir, ancak **FINAL yetkili yazıcısı henüz uygulanmamış/doğrulanmamıştır (issue #8)**. Gerçek kayıt ID/versiyon + admin read-back olmadan `KAYDEDİLDİ` denemez. Kullanıcıdan GPT Action, token veya Chrome arayüz işlemi istenmez. GitHub dosyası tek başına siteye yazma izni vermez.

### SXF'nin bağımsız araştırma/arşiv operasyonu

Bu günlük rapor zincirinin **ayrı teknik operasyonudur** ve silinmez: `prompts/sxf_archive_scan.md`, `prompts/sxf_archive_save.md`, `prompts/sxf_archive_settle.md`; yöntem `methods/sxf_archive_methodology.md`, schema `schemas/sxf_archive_schema.md`, kurallar `archive/README.md`. Çeşitli T-72…T-1 kaynak checkpoint'leri araştırma arşivinde bulunabilir; günlük sinyal varsayılanı bunlardan farklı olarak T-6/T-8'dir. SmartXFlow kaynakları Supabase'den okunabilir, SXF araştırma arşivi GitHub'da tutulur.

**Temel güvenlik:** AS_OF sonrası bilgi kullanma, çalışma kimliği/fixture/market uydurma, başka rolün puanlarını kanıt sayma, site yayını yapılmadıysa başarı iddia etme.
