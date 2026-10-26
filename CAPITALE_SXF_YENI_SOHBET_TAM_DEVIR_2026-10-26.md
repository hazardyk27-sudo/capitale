# CAPİTALE / SXF — YENİ SOHBETE KAPSAMLI DEVİR
**Tarih:** 26 Ekim 2026, Türkiye saati. **Kaynak:** Bu sohbetin kullanıcı talepleri ve tamamlanmış işleri + canlı olarak doğrulanan GitHub dosyaları. **Sürüm:** 1.0.

> ## YENİ AGENT: BUNU İLK OKU
> Bu dosya bir **çalışma sürekliliği ve kaynak envanteri**dir. Sohbetin tüm gizli/silinmiş/önceki mesajlarının harfi harfine transcript'i değildir. **Geçmişten kalan tamamlanmış verilerin tam hali GitHub'daki orijinal MD/JSON dosyalarındadır; bunlar mevcut dosyanın özetiyle değil asıllarıyla okunmalıdır.** Bu devir sayesinde konuşma bağlamı kopmadan çalışma sürdürülebilir. Kanonik kuralları değiştirmeden önce GitHub'dan yeniden oku.
>
> Kullanıcının istediği rol: **CAPİTALE SXF / SmartXFlow**, piyasa akışı araştırmacısı. **Kısa, net Türkçe; uydurma yok, gerçek SQL + GitHub doğrulaması.** İlgili görevi mevcut sohbetin sırasından devam ettir. Aktif son konu: **Üst 2.5 motorlarının başarı oranını artırabilecek gölge filtreleri araştırmak**, üretim motorlarını değiştirmek değil.

## 1. Sorumluluk, kullanıcı beklentisi ve çalışma disiplini

- CAPİTALE dört bağımsız kanıt departmanı içerir: **ANALYST** (taktik/istatistik/form), **NEWS** (haber ve maç atmosferi), **SXF** (yalnız SmartXFlow odds/para akışı), **POLY** (Polymarket cüzdan/bettor). **FINAL** yalnız bitmiş dört raporu birleştirir; ENGINEER teknik bakım ve metodoloji.
- SXF analizi **takım formu, sakatlık, haber, taktik, Polymarket veya diğer ajan sonuçlarıyla karıştırılmaz**. Sonuç doğrulamak için bağımsız maç skor kaynağına bakılabilir; ama bu skorlar AS_OF öncesi sinyal hesaplamasına sokulmaz.
- Kaynağın/karar anının **as-of disiplini mutlak**: hiçbir maçın kendi cutoff'undan sonraki snapshot, alarm, para, oran, sonuç kullanılamaz. Arşiv incelemesi ile normal canlı tarama aynı şey değildir.
- **Supabase mevcut verilerde sadece SELECT / READ-ONLY**, günlük araştırma ve arşiv çıktılarının **tek kalıcı hedefi GitHub**. Supabase'e araştırma/ham arşiv/performans için INSERT/UPDATE/DELETE yapılmaz. Yeni veri platformu eklenmez. Ham veri silinmez.
- Veri eksik, uyumsuz veya snapshot eskimişse **MISSING / UNVERIFIED / SOURCE_CONFLICT** denir. Tamamlanmayan aktarım tamamlandı diye yazılmaz. Orijinal seçimler sonuçlara bakılarak silinmez veya değiştirilmez.
- Kullanıcı **motor başarı oranı ve ortalama SXF oranı** istiyor; bu mevcut çalışmada **ROI ve unit istemiyor**. Genel kural dosyasında ROI bulunması, kullanıcının bu araştırmadaki ROI istememe talebini geçersiz kılmaz.
- Piyasa raporu: 1X2, Üst 2.5, KG VAR, SURPRISE ayrı; seçim için saat, maç, taraf, motorlar, SXF oranı, para payı, £ hacmi, karar ve kaynak snapshot zamanı; ayrıca sinyalsiz maçlar/kapsam. Günlük sonuç raporunda 90 dakika skoru, kazandı/kaybetti, motor performansı ve kaynak belirsizlikleri.
- Tarihler **Europe/Istanbul (TSİ UTC+3)**. Aynı maç farklı pazarlarda birden çok seçim verebilir; birden çok motor etiketi birden çok bağımsız bahis değildir.
- Kullanıcı defalarca **sorunları “hazır” diye geçiştirmemeyi, GitHub read-after-write kontrolünü, timeout durumunda işi küçük parçalara bölmeyi ve yeni sohbete ayrıntılı aktarımı** vurguladı.
- İleriye dönük kullanılacak yeni filtreler ancak **araştırma/gölge test**; kullanıcının açık onayı ve bağımsız yeterli prospektif veri olmadan kanonik SXF v0.4 motorlarına veto, güven puanı, ekstra motor veya otomatik değişiklik yapılmaz.

## 2. DEĞİŞTİRİLMEYECEK otorite sırası ve okunacak repo dosyaları

**GitHub:** https://github.com/hazardyk27-sudo/capitale (varsayılan dalı kontrol et).

Aşağıdaki sırayı uygula:
1. `AGENTS.md` — CAPİTALE anayasa / departman ayrımı; incelendiğinde **v1.14 / 2026-10-23** idi.
2. `MILESTONE.md` — proje geçmişi, SUPERSEDED kural kayıtları.
3. `roles/sxf.md` — **SXF DRAFT v0.4**.
4. `policies/source_policy.md` — kaynağı, zamanı, belirsizliği açıklama.
5. `policies/sxf_sources.md` — sadece SmartXFlow.
6. `schemas/sxf_report.md` — per-match horizon, motor statüleri.
7. `methods/sxf_methodology.md` — **v0.4 motor eşikleri ve normal canlı DYNAMIC_AS_OF**.
8. `methods/sxf_archive_methodology.md` — **GitHub-only arşiv v1.0**.
9. `schemas/sxf_archive_schema.md` — arşiv serileştirme kuralları.
10. `prompts/sxf_archive_scan.md` — **Supabase SELECT serbest, GitHub WRITE** açıklığı.
11. `prompts/sxf_archive_save.md` — orijinal pre-match taramayı arşive kaydetme usulü.
12. `archive/README.md` — resmî tarama, outcome, full snapshots, konsantre arşiv 4 unsur.
13. `SXF_arastirma_arsivi/README.md` — bu sohbetteki **9–25 Ekim T-6 araştırma arşivi**; tarih listeleri ve kaynak istisnaları.
14. `SXF_arastirma_arsivi/Sinyal_Performanslari.md` — 17 günlük toplu motor ve piyasa hit% / ortalama oran.
15. `SXF_arastirma_arsivi/sinyal_performanslari/Kazanan_Kaybeden_Analizi_2026-10-09_25_v1.md` — kaybeden ortak özellikleri ve 1X2 gölge hipotezleri.
16. `SXF_arastirma_arsivi/sinyal_performanslari/SXF_OVER25_Filter_Research_2026-10-09_25_v1.md` ve eş JSON — **EN SON, AKTİF ARAŞTIRMA KONUSU**.

GitHub'ın en güncel dosya içeriği bu devir metninden önce gelir; bir tutarsızlık varsa açıklayıp kanıtla. Devir dosyası metodolojiyi kanonik olarak değiştirmez.

## 3. SXF v0.4 MOTOR EŞİKLERİ — mevcut kanonik DRAFT (sakın tek taraflı değiştirme)

**EARLY MONEY, 1X2:** yalnız ev/deplasman takım tarafı; X hariç. Her referans anında *en çok para alan TEAM tarafı*:
- T-72 ve T-60: **≥£5.000, ≥%50**
- T-40 ve T-24: **≥£10.000, ≥%50**
- T-12: **≥£1.000, ≥%80**
- T-72/T-60/T-40/T-24'ten ilk doğan **CORE** için o andan mevcut karar AS_OF'una kadar gözlenen bütün sonrakilerde **%55 altına düşüş = RETENTION_BREAK ve yalnız CORE iptali**. T-12 farklı tetik, bu CORE köken-retention kuralına tabi değil.
- İleri sinyalden sonra başka bir motor bağımsız geçerliyse yalnız CORE iptalinden dolayı maçı yasaklama.

**Concentration V1, 1X2:** yalnız ev/deplasman tarafı, 1X2 top-money tarafı, **≥£1.000, ≥%80, SXF oran 1,40–2,50**.

**V2:** V1 geçmeli; karar anından geriye tam **3 saat** boyunca mevcut ham geçmişte seçili taraf payı hiçbir eligible gözlemde **%70 altına düşmemiş** olmalı ve adverse odds artışı **%3'ü aşmamalı**. Önceki zaman çıpası, gözlem sayısı, tazelik ve fiyat karşılaştırması raporlanmalı; yetersiz geçmiş varsa V2 verildiğini iddia etme. V2 ayrı oy değil, V1 ek kalite etiketi.

**HEAVY 1X2:** V1 family + seçili para **≥£10.000**, seçili pay **≥%80**. Ayrı bahis/oy değil.

**SURPRISE TEAM:** ev/deplasman; **galibiyet SXF oranı 2,90–4,49**, para payı **≥%50**, minimum mutlak para şartı **yok**. Yorum: **yenilmeme / sürpriz direnci**, düz takım kazanır önerisine otomatik çevrilemez. Sonuçlandırma birincil ölçüt: 90 dakika **galibiyet VEYA beraberlik**; gösterilen oran halen **1X2 kazanma fiyatı** olduğundan yenilmeme fiyatı değil.

**STABLE OVER 2.5:** Üst 2.5, **≥£1.500, ≥%65**, SXF oran **1,40–1,80**.

**PREMIUM OVER 2.5:** Üst 2.5, **≥£2.500, ≥%75**, SXF oran **1,40–1,80**. Aynı seçimde PREMIUM, STABLE etiketini **supersede** eder; ikisini iki ayrı sinyal sayma.

**BTTS YES / KG VAR:** **≥£750, ≥%60, SXF oran 1,60–1,90**.

**Araştırma taramasında kullanıcı global 1X2 yayın oran tabanı:** **1,30**; bunu ayrı v0.4 motor fiyat aralıklarını değiştirmiş gibi yorumlama.

## 4. İKİ farklı karar modu — karışmasın

**Normal canlı SXF `DYNAMIC_AS_OF_V04`:** Şu an gerçek rapor zamanını al; her maçın `kickoff_utc - as_of_utc` farkı bağımsız. T-3, T-4, T-6 gibi referanslar **yeni motor değil** ve gerçek canlı analizin tüm maçlarına ortak yapışmaz. Karardan sonra gelecek hiçbir veriye bakma.

**Kullanıcının tarihsel özel araştırması `CHECKPOINT_RESEARCH_T6_FALLBACK_T8`:**
- Tarih aralığı: **9 Ekim 2026'dan başlayarak gün gün**; başlangıçta 4'er günlük partiler.
- Fikstür aralığı: her gün **16:00–24:00 TSİ**; başka bir 17:00–24:00 canlı taramayla KARIŞTIRMA.
- Her maçın **kendi T-6** pre-match checkpoint'i; *tam T-6 piyasası* yoksa piyasa bazında **T-8 fallback**. Sonradan gelen snapshot kullanma.
- T-72/60/40/24/12 kökeni ve T-6'ya kadarki ham gözlemlerden Retention-55; V2 için karar anından önceki 3 saatin erişilebilir ham snapshot dizisini kullan. Sadece 9 checkpoint GRID'ini bütün tic'ler eksiksizmiş gibi gösterme.
- Bu 17 günlük seri **geriye dönük yeniden oluşturulmuş** sonuç/tercih kaydıdır; orijinal canlı yayımlanmış gerçek zamanlı prediction veya kalibre olasılık değildir. İlk tarama JSON'u sonradan bulunan maç skorlarından **ayrı ve değişmeden** durmalı.
- Bir maçta 1X2, OU25, BTTS sonuçları farklı seçim olabilir. JSON'da fixture identity, market, side, odds, £, %, kaynak anları, audit ve no-data fikstürleri aranmalı.

## 5. Kaynak/altyapı detayları ve ayrım

**Supabase proje ID:** `pswdvnmqjjnjodwzkmkp`. **Sadece SELECT.**
Öne çıkan mevcut şemalar:
- `public.fixtures(fixture_uid, match_id_hash, home_team, away_team, league, kickoff_utc)`
- `public.moneyway_snapshots(fixture_uid, market, selection, odds, volume, share, scraped_at_utc)`
- `public.sxf_base_signal_events(...)` (sinyal-event denetimi için)
- `research_archive.moneyway_snapshots` (bazı günler tam, bazı günler eksik veya boş)
- `research_archive.results` (maç final skorları / statü / gün)
- `public.live_fixtures` (ikinci FT skor kaynağı, karşılaştırma)
- `research_archive.fixtures`, diğer arşiv yerleşimleri için GitHub/Supabase şemasını teyit et.
Market key'leri mevcut snapshot'larda: `1X2` selections `1/X/2`; `OU25` selections `O/U`; `BTTS` selections `Y/N`. Tam piyasa sayısı sırasıyla **3/2/2** seçenek.
- Snapshot eşleştirmesi sadece `fixture_uid`/geçerli canonical identity; karar anından **en son <= cutoff** gözlem. Full selection seti ve zaman damgası kontrol. `local_date` timezone riskine dikkat.
- Supabase `research_archive` küçük/kapsamı eksik olabiliyor. Özellikle 23 Ekim'de büyük arşiv sorgusunda timeout yaşandı, 24 Ekim'de research archive sadece **5** maç kimliği içerdiği için `public` geçmişine geçildi, 25 Ekim research archive'da gün kaydı yoktu ve public kullanıldı.
- **Salt okunur kuralı veri çekmeye engel değildir**: kullanıcı geçmişte yanlışlıkla “Supabase kullanma” anlaşılmasına çok sert itiraz etti. Kısıt sadece Supabase'e **yeni arşiv yazmamak** için. Supabase'ten SmartXFlow okumak serbest ve gerekli.
- Yeni agent GitHub için ilgili bağlayıcıyı kullanabilir; repository public GitHub linkleri dosyalara yönlendirir. `SELECT` sorguları büyükse **küçük gün/maç batch'leriyle** çalış; timeout sonrası baştan tekrar büyük sorgu yapma.
- 9–25 Ekim tüm eski tam ham/konsantre arşiv göçünün durumunu bu tarama serisinden **çıkarmamak gerekir**. Resmî tam arşiv 4 unsur: **01 Scan Results, 02 Outcomes, 03 Full Raw Snapshots, 04 Concentrated (T-72, T-60, T-40, T-24, T-12, T-8, T-6, T-3, T-1)**. Tam snapshot bütün fikstür ve gerçekten kaydedilmiş her market kaydıdır, sinyalli maçlarla sınırlı değildir; tamamlanmamışsa `NOT_COLLECTED`, `NOT_UPLOADED` gibi dürüst durum kullanılmalı.
- Anlaşılan arşiv mimarisi: bütün yeni kalıcı arşivler **GitHub repo/release**, yeni platform yok, ham veri silinmez, release asset/hashes ve read-after-write kontrol şart. Geçmiş günlerde kaynak aktarımıyla ilgili işler diğer sohbetlerde ilerlemiş olabilir; **canlı GitHub kayıtlarını yeniden doğrulamadan “tam” deme**.

## 6. 9–25 Ekim TARİHSEL SİNYAL ARAŞTIRMASI — 17 günün asıl dosya envanteri

Orijinal sinyal araştırma dosyalarının yol kalıbı:
`SXF_arastirma_arsivi/2026/10/DD/sxf-research-2026-10-DD-t6-fallback-t8-16to24-v1.{md,json}`.

**İSTİSNALAR:**
- **12 Ekim** kaynak kapsama hatalı eski **v1 SUPERSEDED**, DOĞRU ORİJİNAL TARAMA **v2**.
- **15 Ekim** kaynak-skor tarihi tutarsızlığı nedeniyle DOĞRU OUTCOME dosyası **outcome-v2**. Eski outcome-v1 silinmedi.
- Diğer günlerde yukarıdaki kalıp ve **outcome-v1**.

| Tarih | Taranan fikstür | Farklı seçim | Motor etiketi | Orijinal tarama | Maç sonucu ve motor performansı |
|---|---:|---:|---:|---|---|
| 2026-10-09 | 183 | 24 | 36 | [Orijinal MD](SXF_arastirma_arsivi/2026/10/09/sxf-research-2026-10-09-t6-fallback-t8-16to24-v1.md) · [JSON](SXF_arastirma_arsivi/2026/10/09/sxf-research-2026-10-09-t6-fallback-t8-16to24-v1.json) | [Sonuç + gün/motor MD](SXF_arastirma_arsivi/2026/10/09/sxf-research-2026-10-09-t6-fallback-t8-16to24-v1-outcome-v1.md) · [JSON](SXF_arastirma_arsivi/2026/10/09/sxf-research-2026-10-09-t6-fallback-t8-16to24-v1-outcome-v1.json) |
| 2026-10-10 | 294 | 52 | 75 | [Orijinal MD](SXF_arastirma_arsivi/2026/10/10/sxf-research-2026-10-10-t6-fallback-t8-16to24-v1.md) · [JSON](SXF_arastirma_arsivi/2026/10/10/sxf-research-2026-10-10-t6-fallback-t8-16to24-v1.json) | [Sonuç + gün/motor MD](SXF_arastirma_arsivi/2026/10/10/sxf-research-2026-10-10-t6-fallback-t8-16to24-v1-outcome-v1.md) · [JSON](SXF_arastirma_arsivi/2026/10/10/sxf-research-2026-10-10-t6-fallback-t8-16to24-v1-outcome-v1.json) |
| 2026-10-11 | 176 | 26 | 46 | [Orijinal MD](SXF_arastirma_arsivi/2026/10/11/sxf-research-2026-10-11-t6-fallback-t8-16to24-v1.md) · [JSON](SXF_arastirma_arsivi/2026/10/11/sxf-research-2026-10-11-t6-fallback-t8-16to24-v1.json) | [Sonuç + gün/motor MD](SXF_arastirma_arsivi/2026/10/11/sxf-research-2026-10-11-t6-fallback-t8-16to24-v1-outcome-v1.md) · [JSON](SXF_arastirma_arsivi/2026/10/11/sxf-research-2026-10-11-t6-fallback-t8-16to24-v1-outcome-v1.json) |
| 2026-10-12 | 109 | 11 | 21 | [Orijinal MD](SXF_arastirma_arsivi/2026/10/12/sxf-research-2026-10-12-t6-fallback-t8-16to24-v2.md) · [JSON](SXF_arastirma_arsivi/2026/10/12/sxf-research-2026-10-12-t6-fallback-t8-16to24-v2.json) | [Sonuç + gün/motor MD](SXF_arastirma_arsivi/2026/10/12/sxf-research-2026-10-12-t6-fallback-t8-16to24-v2-outcome-v1.md) · [JSON](SXF_arastirma_arsivi/2026/10/12/sxf-research-2026-10-12-t6-fallback-t8-16to24-v2-outcome-v1.json) |
| 2026-10-13 | 147 | 19 | 33 | [Orijinal MD](SXF_arastirma_arsivi/2026/10/13/sxf-research-2026-10-13-t6-fallback-t8-16to24-v1.md) · [JSON](SXF_arastirma_arsivi/2026/10/13/sxf-research-2026-10-13-t6-fallback-t8-16to24-v1.json) | [Sonuç + gün/motor MD](SXF_arastirma_arsivi/2026/10/13/sxf-research-2026-10-13-t6-fallback-t8-16to24-v1-outcome-v1.md) · [JSON](SXF_arastirma_arsivi/2026/10/13/sxf-research-2026-10-13-t6-fallback-t8-16to24-v1-outcome-v1.json) |
| 2026-10-14 | 90 | 22 | 36 | [Orijinal MD](SXF_arastirma_arsivi/2026/10/14/sxf-research-2026-10-14-t6-fallback-t8-16to24-v1.md) · [JSON](SXF_arastirma_arsivi/2026/10/14/sxf-research-2026-10-14-t6-fallback-t8-16to24-v1.json) | [Sonuç + gün/motor MD](SXF_arastirma_arsivi/2026/10/14/sxf-research-2026-10-14-t6-fallback-t8-16to24-v1-outcome-v1.md) · [JSON](SXF_arastirma_arsivi/2026/10/14/sxf-research-2026-10-14-t6-fallback-t8-16to24-v1-outcome-v1.json) |
| 2026-10-15 | bkz. JSON | 25 | bkz. JSON | [Orijinal MD](SXF_arastirma_arsivi/2026/10/15/sxf-research-2026-10-15-t6-fallback-t8-16to24-v1.md) · [JSON](SXF_arastirma_arsivi/2026/10/15/sxf-research-2026-10-15-t6-fallback-t8-16to24-v1.json) | [Sonuç + gün/motor MD](SXF_arastirma_arsivi/2026/10/15/sxf-research-2026-10-15-t6-fallback-t8-16to24-v1-outcome-v2.md) · [JSON](SXF_arastirma_arsivi/2026/10/15/sxf-research-2026-10-15-t6-fallback-t8-16to24-v1-outcome-v2.json) |
| 2026-10-16 | bkz. JSON | 19 | bkz. JSON | [Orijinal MD](SXF_arastirma_arsivi/2026/10/16/sxf-research-2026-10-16-t6-fallback-t8-16to24-v1.md) · [JSON](SXF_arastirma_arsivi/2026/10/16/sxf-research-2026-10-16-t6-fallback-t8-16to24-v1.json) | [Sonuç + gün/motor MD](SXF_arastirma_arsivi/2026/10/16/sxf-research-2026-10-16-t6-fallback-t8-16to24-v1-outcome-v1.md) · [JSON](SXF_arastirma_arsivi/2026/10/16/sxf-research-2026-10-16-t6-fallback-t8-16to24-v1-outcome-v1.json) |
| 2026-10-17 | bkz. JSON | 38 | bkz. JSON | [Orijinal MD](SXF_arastirma_arsivi/2026/10/17/sxf-research-2026-10-17-t6-fallback-t8-16to24-v1.md) · [JSON](SXF_arastirma_arsivi/2026/10/17/sxf-research-2026-10-17-t6-fallback-t8-16to24-v1.json) | [Sonuç + gün/motor MD](SXF_arastirma_arsivi/2026/10/17/sxf-research-2026-10-17-t6-fallback-t8-16to24-v1-outcome-v1.md) · [JSON](SXF_arastirma_arsivi/2026/10/17/sxf-research-2026-10-17-t6-fallback-t8-16to24-v1-outcome-v1.json) |
| 2026-10-18 | bkz. JSON | 36 | bkz. JSON | [Orijinal MD](SXF_arastirma_arsivi/2026/10/18/sxf-research-2026-10-18-t6-fallback-t8-16to24-v1.md) · [JSON](SXF_arastirma_arsivi/2026/10/18/sxf-research-2026-10-18-t6-fallback-t8-16to24-v1.json) | [Sonuç + gün/motor MD](SXF_arastirma_arsivi/2026/10/18/sxf-research-2026-10-18-t6-fallback-t8-16to24-v1-outcome-v1.md) · [JSON](SXF_arastirma_arsivi/2026/10/18/sxf-research-2026-10-18-t6-fallback-t8-16to24-v1-outcome-v1.json) |
| 2026-10-19 | bkz. JSON | 12 | bkz. JSON | [Orijinal MD](SXF_arastirma_arsivi/2026/10/19/sxf-research-2026-10-19-t6-fallback-t8-16to24-v1.md) · [JSON](SXF_arastirma_arsivi/2026/10/19/sxf-research-2026-10-19-t6-fallback-t8-16to24-v1.json) | [Sonuç + gün/motor MD](SXF_arastirma_arsivi/2026/10/19/sxf-research-2026-10-19-t6-fallback-t8-16to24-v1-outcome-v1.md) · [JSON](SXF_arastirma_arsivi/2026/10/19/sxf-research-2026-10-19-t6-fallback-t8-16to24-v1-outcome-v1.json) |
| 2026-10-20 | bkz. JSON | 26 | bkz. JSON | [Orijinal MD](SXF_arastirma_arsivi/2026/10/20/sxf-research-2026-10-20-t6-fallback-t8-16to24-v1.md) · [JSON](SXF_arastirma_arsivi/2026/10/20/sxf-research-2026-10-20-t6-fallback-t8-16to24-v1.json) | [Sonuç + gün/motor MD](SXF_arastirma_arsivi/2026/10/20/sxf-research-2026-10-20-t6-fallback-t8-16to24-v1-outcome-v1.md) · [JSON](SXF_arastirma_arsivi/2026/10/20/sxf-research-2026-10-20-t6-fallback-t8-16to24-v1-outcome-v1.json) |
| 2026-10-21 | 60 | 10 | 15 | [Orijinal MD](SXF_arastirma_arsivi/2026/10/21/sxf-research-2026-10-21-t6-fallback-t8-16to24-v1.md) · [JSON](SXF_arastirma_arsivi/2026/10/21/sxf-research-2026-10-21-t6-fallback-t8-16to24-v1.json) | [Sonuç + gün/motor MD](SXF_arastirma_arsivi/2026/10/21/sxf-research-2026-10-21-t6-fallback-t8-16to24-v1-outcome-v1.md) · [JSON](SXF_arastirma_arsivi/2026/10/21/sxf-research-2026-10-21-t6-fallback-t8-16to24-v1-outcome-v1.json) |
| 2026-10-22 | 76 | 35 | 81 | [Orijinal MD](SXF_arastirma_arsivi/2026/10/22/sxf-research-2026-10-22-t6-fallback-t8-16to24-v1.md) · [JSON](SXF_arastirma_arsivi/2026/10/22/sxf-research-2026-10-22-t6-fallback-t8-16to24-v1.json) | [Sonuç + gün/motor MD](SXF_arastirma_arsivi/2026/10/22/sxf-research-2026-10-22-t6-fallback-t8-16to24-v1-outcome-v1.md) · [JSON](SXF_arastirma_arsivi/2026/10/22/sxf-research-2026-10-22-t6-fallback-t8-16to24-v1-outcome-v1.json) |
| 2026-10-23 | 170 | 16 | 28 | [Orijinal MD](SXF_arastirma_arsivi/2026/10/23/sxf-research-2026-10-23-t6-fallback-t8-16to24-v1.md) · [JSON](SXF_arastirma_arsivi/2026/10/23/sxf-research-2026-10-23-t6-fallback-t8-16to24-v1.json) | [Sonuç + gün/motor MD](SXF_arastirma_arsivi/2026/10/23/sxf-research-2026-10-23-t6-fallback-t8-16to24-v1-outcome-v1.md) · [JSON](SXF_arastirma_arsivi/2026/10/23/sxf-research-2026-10-23-t6-fallback-t8-16to24-v1-outcome-v1.json) |
| 2026-10-24 | 290 | 54 | 92 | [Orijinal MD](SXF_arastirma_arsivi/2026/10/24/sxf-research-2026-10-24-t6-fallback-t8-16to24-v1.md) · [JSON](SXF_arastirma_arsivi/2026/10/24/sxf-research-2026-10-24-t6-fallback-t8-16to24-v1.json) | [Sonuç + gün/motor MD](SXF_arastirma_arsivi/2026/10/24/sxf-research-2026-10-24-t6-fallback-t8-16to24-v1-outcome-v1.md) · [JSON](SXF_arastirma_arsivi/2026/10/24/sxf-research-2026-10-24-t6-fallback-t8-16to24-v1-outcome-v1.json) |
| 2026-10-25 | 188 | 39 | 78 | [Orijinal MD](SXF_arastirma_arsivi/2026/10/25/sxf-research-2026-10-25-t6-fallback-t8-16to24-v1.md) · [JSON](SXF_arastirma_arsivi/2026/10/25/sxf-research-2026-10-25-t6-fallback-t8-16to24-v1.json) | [Sonuç + gün/motor MD](SXF_arastirma_arsivi/2026/10/25/sxf-research-2026-10-25-t6-fallback-t8-16to24-v1-outcome-v1.md) · [JSON](SXF_arastirma_arsivi/2026/10/25/sxf-research-2026-10-25-t6-fallback-t8-16to24-v1-outcome-v1.json) |

**9–25 Ekim TÜM ARAŞTIRMA:** yaklaşık **2.703 taranmış fikstür adedi**, **464 farklı market seçimi**, **847 motor etiketi**, **17 gün**. Fikstür rakamını/orijinal toplamı tek tek arşivde doğrula; bu sayı farklı günlerin *tarama kapsamı toplamıdır*, benzersiz takım/lig sayısı değil.

**Sinyallerin sonuçlandırılması:** **464 seçim**, **463 doğrulanıp sonuçlandırılmış**, **1 UNVERIFIED**. Bir seçim birden fazla motor etiketi taşıyabilir. Sonuçlar ayrı outcome dosyalarına yazıldı. 90 dakika temel: 1X2 yön kazanmalı; Üst 2.5 en az 3 gol; KG VAR iki takım gol atmalı; SURPRISE 90 dakikada yenilmemeli.

**Günlük seçim sayıları sırasıyla (9→25):** 24, 52, 26, 11, 19, 22, 25, 19, 38, 36, 12, 26, 10, 35, 16, 54, 39. **Bunlar topyekûn motor etiket sayısı değildir.**

**Önemli:** 25 Ekim'de **iki ayrı araştırma/tarama** olayı var:
1. **Canlı `DYNAMIC_AS_OF_V04`** 25 Ekim 15:13:55 TSİ karar / **17:00–24:00 TSİ**: **156 fikstür**, **37 sinyalli maç**, **39 seçim**, 77 motor etiketi. Bu raporun orijinal sohbet notu “sonraki SXF ARŞİVE KAYDET ile resmî kaydedilecek” idi; bu özgün canlı raporun ayrı kalıcı arşivini teyit etmeden varmış gibi gösterme.
2. **Tarihsel `CHECKPOINT_RESEARCH_T6_FALLBACK_T8`** **16:00–24:00 TSİ**: **188 fikstür**, **38 sinyalli maç**, **39 seçim**, **78 motor etiketi**, GitHub'a kaydedildi. **Aynı seçimler/aynı AS_OF sanma.**

## 7. Motor başarıları — 9–25 Ekim, yalnız isabet + ortalama oran

Kaynak: `SXF_arastirma_arsivi/Sinyal_Performanslari.md` ve makine okunur `SXF_arastirma_arsivi/sinyal_performanslari/Sinyal_Performanslari.json`.

| Motor etiketi | Sonuçlanan | Kazanan | İsabet | Ort. SXF oranı |
|---|---:|---:|---:|---:|
| EARLY CORE | 83 | 55 | **%66,3** | 1,80 |
| EARLY T12 | 162 | 102 | **%63,0** | 1,79 |
| Concentration V1 | 184 | 117 | **%63,6** | 1,76 |
| Concentration V2 | 144 | 90 | **%62,5** | 1,75 |
| HEAVY 1X2 | 68 | 49 | **%72,1** | 1,75 |
| STABLE Üst 2.5 | 33 | 24 | **%72,7** | 1,60 |
| PREMIUM Üst 2.5 | 33 | 24 | **%72,7** | 1,58 |
| BTTS YES | 41 | 29 | **%70,7** | 1,74 |
| SURPRISE (yenilmeme) | 97 | 60 | **%61,9** | 3,33 |

Piyasa bazında **tekil seçim**: **1X2 167/259 (%64,5), Üst 2.5 48/66 (%72,7), BTTS 29/41 (%70,7), SURPRISE 60/97 (%61,9)**. 1X2'de **1 UNVERIFIED** olduğu için orijinal toplam 260'dır. Bütün marketler toplam 463 sonuçlanan, 464 sinyaldir.

**Ana fark:** Motor etiketleri örtüşür; toplama yaparken yanlışlıkla 847 “bağımsız bahis” üretme. Ort. oran **sonuçlandırılmış motor sinyallerinin orijinal karar anındaki SXF decimal odds aritmetik ortalamasıdır**, bahis yapılabilir fiyat/ROI değil.

**SURPRISE 60 yenilmeme başarısı:** 25 doğrudan galibiyet, 35 beraberlik. Oran 3,33 ortalama doğrudan 1X2 galibiyet oranıdır.

## 8. Skor doğruluğu, kritik istisnalar

- Önce SXF `research_archive.results` FT ve `public.live_fixtures` FT karşılaştır; **fixture_uid + match_id_hash + ev/deplasman adları + doğru kickoff tarihi + 90 dakika** doğrulama. Birbirine uymayan statü/skor/başlama veya aynı hash'in başka güne ait FT skoru = otomatik WIN/LOSS verme.
- **15 Ekim “Sportivo Luqueño – Cerro Porteño”** orijinal arşiv fikstürüne ilişkin dış kaynaklarda **10 Ekim 0-3** maçı bulunuyor. **10 Ekim FT'sini 15 Ekim fikstürüne taşımadık.** Bu tek seçim `UNVERIFIED`; 15 Ekim sonuç **outcome-v2** ve genel hit oranlarının paydasına dahil değil.
- **13 Ekim Polonya (K) – Belçika (K):** 90 dk **2-1**; uzatmalar sonu **3-2**, penaltılar sonu **4-3**. SXF normal süre için 2-1 kullan.
- 17 Ekim **Juan Pablo II – Sport Boys 2-0**, **Zamora – Anzoátegui 1-2** bağımsız skorla ayrıca kontrol edilmişti. Diğer iç FT kayıtları kimlik/statü açısından çapraz kontrol edildi ama **418 maçın her biri için bağımsız web doğrulaması yapıldığı iddia edilmez**.
- Geçmiş sonuçlar yalnız outcome dosyasına kaydedildi. Orijinal pre-match karar **asla değişmedi**.

## 9. KAZANAN–KAYBEDEN 1X2 araştırması (bir önceki iş)

Kaynak: `SXF_arastirma_arsivi/sinyal_performanslari/Kazanan_Kaybeden_Analizi_2026-10-09_25_v1.md`; tüm test rakamları eş JSON'da.

- **1X2 kaybeden 92 sinyal:** **53 beraberlik**, **39 rakip galibiyeti**. Beraberliğin tahmin edilebilir olup olmadığı için T-6'da **X pay/oran hareketi** gelecekte araştırılmalı.
- **V1 + HEAVY** 49/68 **%72,1** vs HEAVY olmayan V1 68/116 **%58,6**.
- **V1 ve SXF oran <2,00** alt kümesinde **HEAVY 41/53 (%77,4), HEAVY olmayan 56/91 (%61,5)**; ort. oranları 1,64 ve 1,66. 9–16 ve 17–25 alt gruplarında aynı yönde fark var, ancak prospektif ispat yok.
- **V1 seçili para payı ≥%95** olan 9/20 **%45**, diğer V1 108/164 **%65,9**. ≥%95 ve seçili para **<£10.000** ise 7/18 **%38,9** (risk hipotezi).
- V2 son üç saat minimum para payı **≥%90** ise 12/28 **%42,9**, <%90 ise 78/116 **%67,2** (çok küçük örneklem).
- Motor v0.4 eşikleri **bu bulgularla değiştirilmedi**. Gölge test hipotezleri: HEAVY+<2, aşırı %95 ve düşük hacim bayrağı, X tarafı beraberlik hareketleri. Yüzde ile mutlak para aynı şey değil.

## 10. **EN SON / AKTİF KONU: ÜST 2.5 MOTORUNU GELİŞTİRME ARAŞTIRMASI**

Kullanıcının son araştırma talebi: **“önce 2.5 sinyallerini nasıl geliştirebiliriz buna bak. nasıl filtre uygularsak kriter koyarsak başarı oranını artırırız araştır”**. Görev yapıldı ve aşağıdaki belgeler GitHub'da **2026-10-26'da oluşturuldu, içerikleri daha sonra canlı olarak fetch ile doğrulandı**:

**Ana okunabilir rapor:**
`SXF_arastirma_arsivi/sinyal_performanslari/SXF_OVER25_Filter_Research_2026-10-09_25_v1.md`

**Denetim JSON'u:**
`SXF_arastirma_arsivi/sinyal_performanslari/SXF_OVER25_Filter_Research_2026-10-09_25_v1.json`

**66 fikstürün karar-anı çapraz piyasa özellikleri** (tüm seçili veri ve BTTS/1X2/OU market snapshot):
`SXF_arastirma_arsivi/sinyal_performanslari/over25_crossmarket_features_2026-10-09_25_v1.json`

**Önceki tüm market kaynak/sonuç eşleştirme özellikleri:**
`SXF_arastirma_arsivi/sinyal_performanslari/loss_features_2026-10-09_16_v1.json`
`SXF_arastirma_arsivi/sinyal_performanslari/loss_features_2026-10-17_25_v1.json`

### Üst 2.5 mevcut isabet
- **66 seçim, 48 kazanan, 18 kaybeden = %72,7**.
- STABLE **24/33**, PREMIUM **24/33** → daha fazla pay/hacim gerektiren mevcut PREMIUM tek başına daha yüksek isabet göstermedi.
- Başarısızların 10'u 2 toplam gol, 7'si 1 toplam gol, 1'i 0 toplam gol.
- İlk dönem 9–16 Ekim: **25/31 = %80,6**; 17–25 Ekim: **23/35 = %65,7**.

### Üst cross-market kaynak istisnası (ÇOK KRİTİK)
- **12 Ekim Atalanta – Venezia, 3-1**: Orijinal sinyal JSON T-6 Üst **1,57 / £2.528,26 / %72,4**, `public.moneyway_snapshots` T-6 Üst **1,60 / £1.101,35 / %77,9**; son `public` BTTS gözlemi karar anından **632,6 dk (~10,54 saat) eski**. Bu sorun T-8/T-6 yanlış kullanımı değil, **kaynak uyuşmazlığı ve cross-market BTTS tazeliği**. Araştırma sinyali bozulmadı, fakat **çapraz-piyasa testinden 1 kazanan çıkarıldı**, 65 tutarlı maç kaldı.
- Böylece cross-market karşılaştırma **65 maç, 47 başarılı, 18 kayıp = %72,3**. Özellikle yeni canlı uygulamada BTTS piyasa verisinin *karar-anı source freshness ve same-source provenance* kontrolü şart, aksi `UNVERIFIED_CROSS_MARKET`.

### Kriter deneyleri (temiz 65 maç, tamamı geriye dönük keşif)
| Kod | Sadece araştırma filtresi | Kazanan/toplam | İsabet | Ortalama SXF Üst oranı | 9–16 | 17–25 |
|---|---|---:|---:|---:|---:|---:|
| **C1** | **T-6 BTTS YES SXF oranı >1,60** | 31/37 | **%83,8** | 1,62 | 16/17 | 15/20 |
| **C2** | **C1 + Üst 2.5 seçili £ ≥2.500** | 20/22 | **%90,9** | 1,61 | **10/11** | **10/11** |
| **C3** | **C1 + T-8→T-6 Üst para payı düşüşü <2,00 yüzde puanı** | 24/27 | **%88,9** | 1,63 | 15/16 | 9/11 |
| **C4** | Sadece Üst pay düşüşü <2,00 puan | 38/49 | %77,6 | 1,60 | 21/26 | 17/23 |
| **C5** | UEFA müsabakası etiketi | 21/24 | %87,5 | 1,58 | 11/12 | 10/12 |
| **C6** | Mevcut PREMIUM (kontrol) | 24/33 | %72,7 | 1,58 | 10/15 | 14/18 |
| **C7** | English Premier League (risk gözlemi) | 6/12 | %50,0 | 1,64 | 3/4 | 3/8 |

**C2 en çok umut veren gölge test önerisi.** 22 seçimin 20'si geldi, **43 maç elendi**, bunların **16'sı kayıp, 27'si aslında kazanan**. Yani daha yüksek isabet yüzdesi adına kapsama ciddi düşüyor. %95 Wilson kaba güven aralığı **%72–98**, yeni örneklem gerekir. İlk/son tarih alt grupları 10/11 ve 10/11 olsa da bu kronolojik bölmeler **sonuçlar görülerek tasarlanmış, gerçek kör holdout değildir**. Bir sürü eşik denenmiştir; multiple testing ve overfitting riskini açık söyle.

**C3 alternatif teyit:** karar T-6, T-8 referans sadece önceki gözlem. Üst para payındaki `T6_share - T8_share > -2.00` puan ve BTTS YES fiyat `>1.60`; 24/27. Yeni gölge etiket `MOMENTUM_RESEARCH_C3`.

**Çapraz piyasa BTTS fiyatı kullanımı önemli nüans:** `BTTS YES odds >1.60` **BTTS motorunun tetiklenmesini gerektirmiyor**! BTTS motoru ayrı para/pay şartları da içerir. C2 yalnız karar anındaki karşı-piyasa BTTS YES **SXF fiyatına** bakar. Yanlışlıkla “BTTS YES motoru da aktif” şartı ekleme; bu, kullanıcı onayı olmayan yeni ve farklı bir filtre olur.

**C2 elenmeyen ama kaybeden 2 maç:** 
- **9 Ekim West Ham–QPR 1-1**, Üst SXF 1,57, £5.242,42, BTTS YES oran 1,74.
- **24 Ekim FC Utrecht–PEC Zwolle 1-1**, Üst SXF 1,58, £4.013,04, BTTS YES oran 1,62.
Bu iki kayıp, BTTS YES marketi yüksek fiyatlı olsa bile 2 golde kalma riskinin sürdüğünü gösteriyor. Bağımsız skor kaynakları ana raporda referanslı.

**UEFA 21/24**, domestic 26/41; EPL 6/12. Lig etiketi tek başına kalıcı production veto olmamalı; örneklem/fixture coverage ayrışması, lig veri yoğunluğu ve fiyat dağılımı etkisi olası.

**Kullanıcının son onaylamadığı bir şey:** C1/C2/C3/C4/C5 filtreleri yalnız `EXPLORATORY_NOT_PRODUCTION`; **SXF `roles/sxf.md` ve `methods/sxf_methodology.md` v0.4 değişmedi**. Bunları ancak kullanıcı isterse gölge test olarak günün T-6 raporuyla birlikte dondur, kanonik motoru değiştirme. T-6 öncesi/sonrası bilgi ve yanlış kaynakları birbirine karıştırma.

## 11. BUGÜNKÜ TARİH 26 Ekim 2026 — açık kalan tarama

- 26 Ekim 16:00–24:00 TSİ aralığında daha önce **66 aday fikstür** vardı (fikstür sayısı o anki kaynak tablosundan).
- 26 Ekim **03:03 TSİ** itibarıyla T-8/T-6 kontrol anları henüz gelmemişti. Bu nedenle GitHub'da `SXF_arastirma_arsivi/2026/10/26/status-2026-10-26-pending-t6-asof-030315-tr.json` dosyası **PENDING_ASOF_NOT_REACHED** olarak tutuldu.
- İlk T-8 saat **08:00 TSİ**, ilk T-6 saat **10:00 TSİ**, son T-6 saat **17:45 TSİ**. **26 Ekim 15:51 civarındaki bu devir anında** günün bazı T-6'ları artık olmuş, hepsi henüz olmamış olabilir; saat geldi mi kontrol et.
- Bu sohbetten **26 Ekim 17:50 TSİ tek seferlik otomasyon** oluşturuldu: 16:00–24:00 TSİ için doğru T-6/T-8 taramayı yapmak, günlük MD+JSON oluşturmak, GitHub'a kaydetmek, indeksi doğrulamak. **Otomasyon oluşturuldu demek görevi yaptı demek değildir.** Yeni agent bunu tekrar tetiklemeden önce durumunu ve GitHub 26 Ekim dosyalarını kontrol etmeli.
- 26 Ekim tamamlandıysa 17 günlük performans raporuna ve Üst 2.5 prospektif shadow setine yeni günü **ayrı kaynak/yeni karar tarihi** olarak ekle; ancak eski 9–25 ekim metriklerini değiştirmeden yeni sürüm oluştur. Henüz canlı olmayan maçların kesin FT'sini varsayma.

## 12. Görev sırası / yeni agent'ın en güvenli ilerleyişi

1. **GitHub bağlantısını kullan, bu dosya + `AGENTS.md` + kanonik SXF v0.4 + 3 araştırma raporunu gerçekten oku.** Önceki agent rolü otomatik üstlenmiş gibi varsayma.
2. **EN SON Üst 2.5 çalışma raporunu aç ve doğru durumla devam et:** `SXF_OVER25_Filter_Research_2026-10-09_25_v1.md`. Araştırmanın başarılı yazma durumu bağımsız olarak GitHub'da okundu.
3. **İstenirse C1/C2/C3'ü shadow-test** olarak ayrı etiketle (T-6 per-fixture AS_OF, aynı kaynakla çapraz BTTS, snapshot lag taze, T-8 önceki kaynak). Orijinal STABLE/PREMIUM motorları olduğu gibi kalmalı; user açıkça onaylayana kadar canonical code/metodolojiye veto yazma.
4. **Özellikle C2** için kontrol sütunları: match UID, kickoff TSİ/UTC, AS_OF UTC, original Over engine, Over SXF oranı, Over £, Over %, T-8 ve T-6 snapshot observed_at ve lag, BTTS YES T-6 odds ve source_age, C1/C2/C3 bool, FT sonrası skor, C2 başarı/kaçan kazananlar. Kaynak sorunları UNVERIFIED şeklinde izle.
5. İzleyen gerçek günler tamamlandıkça **SXF FT 90 dakika** skorlarını güvenilir kaynakla eşleştir; kaynak hatası varsa sonucu tahmin etme. Adayları 1–2 günde “kanıtlandı” diye üretime alma.
6. 26 Ekim schedule/GitHub durumunu **ayrıca kontrol et**. Proje ham/konsantre arşivlerinin tümünü complete sayma; farklı sohbetlerde aktarım işleri devam etmiş olabilir.
7. Her veri okuma ve GitHub yazımından sonra **kapsam/numerik kontrol + read-after-write**. Zaman aşımında 2–4 günlük veya küçük fixture chunk'ları kullan.
8. Kullanıcı özellikle hızlı ve net Türkçe istediğinden cevapları kısa özet + gerekli tablo + rapor bağlantısı şeklinde sun. Kesinlik olmayan bulguları deneysel statüyle açıkla.

## 13. Kullanılabilecek SQL araştırma kalıbı (yalnız SELECT)

```sql
-- Her maçın T-6 noktasında, 1 market için EN SON meşru snapshot:
WITH f AS (
  SELECT fixture_uid, home_team, away_team, kickoff_utc
  FROM public.fixtures
  WHERE (kickoff_utc AT TIME ZONE 'Europe/Istanbul')::date = DATE '2026-10-25'
    AND (kickoff_utc AT TIME ZONE 'Europe/Istanbul')::time >= TIME '16:00'
),
p AS (
 SELECT f.*, m.market,
        f.kickoff_utc - INTERVAL '6 hours' AS as_of_utc
 FROM f CROSS JOIN (VALUES ('1X2'),('OU25'),('BTTS')) AS m(market)
),
eligible AS (
 SELECT p.*, s.scraped_at_utc
 FROM p LEFT JOIN LATERAL (
  SELECT scraped_at_utc
  FROM public.moneyway_snapshots s
  WHERE s.fixture_uid = p.fixture_uid
    AND s.market = p.market
    AND s.scraped_at_utc <= p.as_of_utc
  ORDER BY scraped_at_utc DESC LIMIT 1
 ) s ON TRUE
)
SELECT * FROM eligible;
```

Bu SELECT yalnız nokta bulma örneğidir. **T-8 fallback, 3/2/2 tam piyasa denetimi, Retention-55 ve V2 üç saatlik snapshot dizisi bu sorguya eklenmeden sinyal hesaplaması tamam sayılmaz**. SOURCE lag ve 90dk FT ayrı tutulmalı. Tarih/turnuva filtreleri `<24:00` gibi SQL'de TIME literal kullanılarak hatalı yazılmamalı; gerekirse sonraki güne sıfır aralığını sınırla. Tarihsel AS_OF'tan sonra hiç gözlem alınmamalı.

## 14. Başka sohbetlere ait görevler — SXF ile karıştırma

Aynı CAPİTALE projesinde daha önceki konuşmalarda:
- **Ham veri arşivi ve 9 noktalı konsantre arşiv transferi**, GitHub kalıcılığı, eksik günler, deploy/Hetzner/Supabase işleri var. Bunlar *mevcut 17 günlük SXF Araştırma Arşivi'nden ayrı* ve dosyalardan son durum araştırılmadan “tamam” denemez.
- **ANALYST** kullanıcı tarafından topa sahip olma oyunu, form ivmesi, rakip seviyesi mantığı, ev/deplasman performansıyla sınırlandı; bu SXF'e katılmaz.
- **NEWS** destekleyen/desteklemeyen/nötr haber kanıtları ve puanlandırma; SXF'e katılmaz.
- **POLY** bağımsız cüzdan/bettor araştırması; SXF'e katılmaz.
- **FINAL** diğer 4 departman tamamlanınca ağırlıklı sentez yapar; SXF tek başına FINAL A/B/C önerisi vermez.
- Kullanıcı GitHub'a saklanan metot dosyalarının **asıl kaynak** olmasını istiyor; yalnız sohbet özetiyle motor değiştirme.

## 15. Başlangıç mesajı (yeni sohbetin ilk kullanıcı mesajı önerisi)

> **“CAPİTALE SXF rolünde devam et. GitHub `hazardyk27-sudo/capitale` içindeki `CAPITALE_SXF_YENI_SOHBET_TAM_DEVIR_2026-10-26.md` dosyasını baştan sona oku; referans verdiği AGENTS.md, SXF v0.4 rol/metot dosyalarını ve `SXF_arastirma_arsivi/sinyal_performanslari/SXF_OVER25_Filter_Research_2026-10-09_25_v1.md` ile JSON'unu da oku. Kaldığımız yer Üst 2.5 sinyallerinin başarı oranını artırma araştırması: C1, C2, C3, kaynak/AS_OF denetimi, bağımsız yeni günlerde gölge test. GitHub'a yazılmamış işi tamamlanmış gösterme. Supabase'i yalnız SELECT için kullan; sonuçları GitHub'a kaydet. Kanonik v0.4'ü izinsiz değiştirme. İlk cevabında dosyaları gerçekten okuduğunu, son gerçek durumu, doğrulanan başarı sayılarını, riskleri ve sıradaki işlemi kısa ve net anlat.”**

### Dosya yönetimi

- Ana devir dosyası: `CAPITALE_SXF_YENI_SOHBET_TAM_DEVIR_2026-10-26.md`.
- **Kanonik metodoloji = GitHub AGENTS/roles/methods**, devir dosyası sadece geçiş haritası.
- Çalışma sonucu kalıcıysa GitHub'a yeni sürüm dosyası + denetim JSON'u; istenmedikçe eski orijinal scan'i değiştirme.
- **Bütün sohbetin harfi harfine metni bu belgede yoktur.** Verileri yeniden üretmek için MD+JSON bağlantıları ve metodoloji yolları verildi. Sohbet içeriğinin sistemce otomatik olarak yeni sohbete taşındığı iddia edilemez.
