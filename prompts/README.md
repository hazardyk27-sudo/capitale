# CAPITALE Runtime Prompts

**GÜNCEL KULLANICI ÇALIŞMA ŞEKLİ (2026-11-20):** `prompts/manual_report_chain.md` — **SXF → ANALYST → NEWS → FINAL → siteye kayıt**. Bu zincir önceki paralel çalışma yönteminin yanında, kullanıcı tarafından onaylanan manuel aktarım modudur; araştırma metodolojilerini değiştirmez.

Bir agentın GitHub talimatlarını okuması tek başına onun siteye yazabildiği anlamına gelmez. Yalnız gerçek yetkili Commander/yükleyici başarılı kayıt ID'si döndürür ve read-back doğrulaması geçerse "kaydedildi" denebilir. Mevcut yerel yükleyici ANALYST, NEWS ve SXF kabul ediyor; FINAL desteği hazır değil ve ayrıca uygulanmalıdır.

**Aktif roller ve sürümler:**
- SXF v0.4.3 DRAFT — günlük varsayılan per-fixture T-6, gerektiğinde geçerli T-8 fallback. Dynamic as-of ancak kullanıcı isterse.
- ANALYST v2.1 CANONICAL — yalnız üç faktör, kullanıcı tercihine ordinal A destek /100.
- NEWS v1.6 CANONICAL — 8 haber alanı, materyal H# hikâyeleri, 7 etki toplamı + kullanıcı tercihine ordinal N destek /100.
- POLY v1.4 CANONICAL — bağımsız direct Polymarket; manuel üç uzmanlı zincirde opsiyoneldir, yoksa FINAL için NO_EVIDENCE.
- FINAL v0.2 DRAFT — yalnız uzman raporlarının sentezi; A/B/C/NO_RECOMMENDATION. FINAL'in kalıcı site yazıcısı henüz kurulmamıştır.

**Manuel rapor zinciri (kullanıcı kopyala-yapıştır):**
1. SXF tam analiz → en sonda kısa sinyal tablosu + **KOPYALA → ANALYST GİRDİSİ**.
2. Kullanıcı yalnız nötr son girdi bloğunu ANALYST'e gönderir (önceki uzman raporunu değil).
3. ANALYST kendi tam üç faktör raporu → en sonda A skorlu kısa özet + **KOPYALA → NEWS GİRDİSİ**.
4. Kullanıcı yalnız nötr girdi bloğunu NEWS'e gönderir.
5. NEWS tam rapor ve kısa N/100 tablosunu üretir.
6. Kullanıcı FINAL'e **üç özgün tam raporu** ve POLY varsa POLY raporunu iletir; FINAL sentezler ve yayın ancak gerçek yetkili FINAL bağlantısı çalışırsa gerçekleşir.

Bu `prompts/manual_report_chain.md` modu dışında, bağımsız paralel çalışmada SXF, ANALYST, NEWS ve POLY raporları yine FINAL öncesi paylaşılmaz. Rol kaynak ayrımı ve zaman kesiti politikası değişmez.

Her yeni bağımsız role çalışmasında ilgili bootstrap:
- `prompts/sxf_start.md`
- `prompts/analyst_start.md`
- `prompts/news_start.md`
- `prompts/poly_start.md`
- `prompts/final_start.md`

Çalışamayan/verisi olmayan/kaynağına erişemeyen agent bunu açıkça belirtir; eksik satır/tercih/kimlik veya site yazma yetkisi uydurulmaz.

## SXF daily archive prompts (GitHub-only)

The owner-approved SXF archive v1.0 uses these separate prompts:
- `prompts/sxf_archive_scan.md`: screen matches, report pre-match evidence only; do NOT store post-match results.
- `prompts/sxf_archive_save.md`: freeze the published scan, and store independently collected full and concentrated data when actually available.
- `prompts/sxf_archive_settle.md`: independently verify full-time scores, compute engine evaluation, and append outcome files without changing frozen scans.

Rules and formats: `methods/sxf_archive_methodology.md`, `schemas/sxf_archive_schema.md`, `archive/README.md`. Nine checkpoints: T-72, T-60, T-40, T-24, T-12, T-8, T-6, T-3, T-1. Supabase is permitted solely as a READ-ONLY data source for SmartXFlow fixtures/snapshots/results; archive storage and reporting are GitHub-only. Automated extraction and publishing remain unimplemented; prompts cannot guarantee actual collection on their own.

## Commander özel arşiv (2026-11-20)

GitHub `tools/manual_report_inbox.py`, Commander `/opt/capitale-report-chain-inbox.py`: her uzman kendi tam raporunu run_id ile özel arşive kaydeder (siteye değil). FINAL son NEWS tablosundan run_id'leri alıp `status` + `bundle` ile üç orijinal raporu toplar; böylece kullanıcı tek son raporla ilerleyebilir. Ayrıntılar: `prompts/manual_report_chain.md`. Gerçek Commander bağlantısı olmadığında üç tam rapor FINAL'e manuel gönderilmelidir. FINAL web kaydı halen bağımsız implementasyon/doğrulama bekler.
