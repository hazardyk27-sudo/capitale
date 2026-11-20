# CAPITALE — Güncel Agent Başlangıçları

**AKTİF VARSAYILAN (2026-11-20):** SXF → ANALYST → NEWS → FINAL, **her agent kendi orijinal tam raporunu doğrudan /admin/software kaydına yazar.** Kanonik açıklama: `prompts/manual_report_chain.md` **v3.0**.

Her agent başlangıçta `AGENTS.md`, `MILESTONE.md`, ilgili `roles/<rol>.md`, `policies/source_policy.md`, rol kaynak politikası, `methods/<rol>_methodology.md`, `schemas/<rol>_report.md`, `prompts/<rol>_start.md` ve `prompts/manual_report_chain.md` okur.

| Agent | Tam bağımsız araştırma | Site kaydı | Rapor sonu |
|---|---|---|---|
| SXF v0.4.3 DRAFT | SmartXFlow FINAL_SIGNAL, DAILY T-6 / geçerli T-8 fallback | Kaynak `FINAL_SIGNAL` olayları her 3 dk otomatik; gerekirse tam SXF raporu kendi alanında sürümlenir | Gerçek sinyaller + **1–3 bulgu (en az 1)** + nötr ANALYST listesi |
| ANALYST v2.1 CANONICAL | Yalnız üç futbol faktörü; A ordinal destek /100 | Commander ile gerçek run_id'nin **yalnız A/Statistics** bölümüne tam raporu yazar | Tam rapor + A listesi + nötr NEWS listesi |
| NEWS v1.6 CANONICAL | Yalnız bağımsız sekiz haber alanı + H# yedi piyasa etkisi; N ordinal /100 | Commander ile aynı run_id'nin **yalnız News** bölümüne tam raporu yazar | Tam rapor + N listesi + FINAL'e run_id |
| FINAL v0.2 DRAFT | Üç tam raporu **site üzerinden** alıp bağımsız sentezler; POLY opsiyonel | FINAL'in son A/B/C yazıcısı halen geliştiriliyor (issue #8) | A/B/C veya NO_RECOMMENDATION + gerçek site kayıt durumu |

**Nötr devir:** SXF → ANALYST ve ANALYST → NEWS arası yalnız `tarih/saat/iki takım/market/seçim/fixture_uid/run_id/SXF karar AS_OF`. Önceki uzmanların kanıt, puan, para, odds veya yorumları yeni araştırma girdisine **girmez**.

**Commander komutları (private server):**
- Gerçek SXF final-signal otomatik import: `/opt/capitale-sxf-software-sync.py`, watcher `/opt/capitale-sxf-software-watch.py`.
- ANALYST/NEWS kendi raporuna kayıt: `python3 /opt/capitale-report-uploader.py submit --role analyst|news --file <gerçek-rapor.json>`; `SAVED_READBACK_OK` zorunlu.
- FINAL için siteden orijinal üç raporu okuma: `python3 /opt/capitale-site-report-reader.py --run-id <UUID> --require-all --out <private.json>`.
- Eski `tools/manual_report_inbox.py` / `/opt/capitale-report-chain-inbox.py` **yalnız yedek devir**; artık normal rapor yayın yolu değildir.

**Güvenlik:** İnternete açık eski tokenless `/api/capitale/agent-bridge/reports/:department` yoluna Nginx 403 döner. Site kaydı yalnız yerel yetkili Commander ve özel server DB rolüyle yapılır. Kullanıcıdan token, GPT Action veya Chrome müdahalesi istenmez. Bir rol diğer rolü taklit etmez. Gerçek `report_id`, `version`, `run_id`, role ve kaynak hash readback olmadan kayıt başarısı iddia edilmez.

**Önemli sınırlamalar:** Henüz bir araştırma run'ında farklı birden fazla market/selection varsa otomatik import bunu açıkça `multiple_picks_require_expanded_board` durumuna alır; tüm tercihleri farklı satırlar halinde gösterecek genişletme ayrıca geliştirilmelidir. FINAL'in nihai veritabanı/site yazıcısı henüz doğrulanmadı; son kararın sitede kaydedildiği söylenemez.

Bağımsız SXF arşiv operasyonu korunur: `prompts/sxf_archive_scan.md`, `prompts/sxf_archive_save.md`, `prompts/sxf_archive_settle.md`, `methods/sxf_archive_methodology.md`, `schemas/sxf_archive_schema.md`. Supabase SXF taramasında **salt okunur kaynak** olabilir; araştırma arşivi GitHub'a yazılır. Siteye yetkili rapor yazımı ayrı bir CAPITALE karar kaydıdır, ham araştırma arşivini değiştirmez.
