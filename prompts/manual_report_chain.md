# CAPITALE — MANUEL RAPOR ZİNCİRİ (SXF → ANALYST → NEWS → FINAL → SITE)

Status: OWNER-APPROVED OPERATIONAL WORKFLOW
Version: 1.0
Date: 2026-11-20
Scope: rapor devir biçimi ve yayın iş akışı; rol metodolojisini veya kaynak yetkilerini değiştirmez.

## Amaç

Kullanıcı maçları SXF'ye verir. SXF tam SmartXFlow raporunu üretir; sonunda kısa sinyal/maç tablosu ve kopyalanabilir **ANALYST GİRDİSİ** bloğu sunar. Kullanıcı yalnız bu girdi bloğunu ANALYST'e verir. ANALYST kendi üç faktörlü v2.1 bağımsız raporunu üretir, sonunda A destek puanlı kısa sonucu ve **NEWS GİRDİSİ** bloğunu sunar. Kullanıcı NEWS'e yalnız bu girdi bloğunu verir. NEWS kendi v1.6 haber araştırmasını tamamlayıp son kısa tabloyu ve **FINAL GİRDİ KONTROLÜ**nü sunar. Kullanıcı üç **tam ve orijinal** uzman raporunu FINAL'e iletir; POLY raporu ayrıca varsa ekler, yoksa açıkça `POLY=NOT_PROVIDED/NO_EVIDENCE` olarak belirtilir. FINAL yalnız uzman raporlarından sentez yapar ve doğrulanmış bir aktarım yetkisi varsa siteye kaydeder.

### Kaynak izolasyonu / neden sadece giriş bloğu kopyalanır?

- ANALYST, SXF'nin **signal_code / para / oran / quality / iddia / sonuçlarını** görmez veya analizine taşımaz; yalnız maç/tarih/saat/piyasa/tercih ve kimlik alır.
- NEWS, SXF ve ANALYST'in görüş, A skoru, istatistik veya para akışını görmez/kanıt saymaz; yalnız aynı nötr yönlendirme girdisini alır.
- Başka departmana **önceki raporun tamamını göndermek**, "sadece yönlendirme" olduğu söylense bile LLM kaynak bulaşması riskini artırır. Kullanıcıya sadece son `GİRDİ` bloğunu kopyalat.
- POLY bağımsız kalır; opsiyonel POLY raporu yalnız FINAL'e eklenebilir. POLY yokluğu, POLY'nin aksi yönde sinyal verdiği veya 0 puan aldığı anlamına gelmez.
- Önceki uzmanların tam raporlarını FINAL için sakla. NEWS'in son tablosu, SXF/ANALYST'in tam raporlarının yerine GEÇMEZ.
- Girdi bloğunda SXF kodu, orijinal sonuç, A/NEWS puanı, oran, money share veya uzman yorumu taşıma.

## A. SXF — tam rapor + iki kapanış tablosu

SXF güncel `roles/sxf.md` ve `methods/sxf_methodology.md` v0.4.3 kurallarını uygular: varsayılan DAILY T-6; T-6 henüz gelmemiş/market verisi yok/geçersizse geçerli T-8 fallback. Geçerli T-6'nın tetiklenmemesi fallback gerekçesi değildir. DYNAMIC_AS_OF_V04 yalnız kullanıcı özel isterse. Retired/shadow motorlar aktifmiş gibi gösterilmez.

Tam raporun **en sonunda**, ilgili veri varsa iki **kısa** tablo üret:

**SXF — TETİKLENEN SİNYALLER**

| Maç (tarih TSİ, saat TSİ) | Market / tercih | Motor(lar) | Görünen kısa kod | Kontrol | run_id |
|---|---|---|---|---|---|
| <gerçek maç> | <1X2/Ev vb> | <gerçek motor adları> | <MOM/PRM/CRL/SLD> | <T-6/T-8 fallback/dinamik> | <doğrulanmış UUID veya YOK> |

**Etiket sözlüğü:** V1/V2/HEAVY + BTTS YES → MOM; Premium Over, OVER_STRONG, EKOL 3 → PRM; Stable Over + SURPRISE TEAM → CRL; Early Money Core + Early Money Core V2 → SLD. Kod, farklı motorları **tek motor** haline getirmez; tam orijinal motorlar ve precedence raporda korunur. Experimental/shadow EARLY CORE V2, OVER_STRONG ve EKOL 3 bulunsa bile "SHADOW / NOT ACTIVE" diye ayrıca göster; doğrulanmış aktif sinyal gibi ANALYST girişine sokma. Sinyal yoksa `SİNYAL YOK` yaz, maç veya tercih uydurma.

**SXF — MAÇ / TERCİH BAZINDA KISA AÇIKLAMALAR (1–3 MADDE)**

**Her maç + market + tercih için mutlaka en az BİR numaralı bulgu; en fazla ÜÇ bulgu** yaz. Hiçbir maçı veya tercihi maddesiz bırakma. Üç ayrı doğrulanmış kanıt varsa 3 madde; 2 varsa 2; 1 varsa 1. Tetiklenen aktif sinyalde motor ve gerçek checkpoint doğrulaması zaten temel bulgudur: bunu en az bir maddede açıkla. Eğer hiç doğrulanmış aktif sinyal/kanıt yoksa dahi bir **doğrulama bulgusu** yaz: `1. Bu maç/tercihte geçerli SXF sinyali doğrulanamadı; [varsa gerçekten gözlenen eksik veri/kesit nedeni].` Böyle bir maçı aktif tetiklenmiş sinyal tablosuna ekleme; `NO_EVIDENCE` ifadesini tek başına maddesiz bırakma. Kanıt veya eksik veri nedenini uydurma; belirsizse `doğrulama nedeni bilinmiyor` yaz. Maddeler tam SXF raporundan gelir, ANALYST'e aktarılan nötr girdi bloğuna girmez.

Öncelik sırasıyla: (i) tetiklenen aktif motor + gerçek T-6/T-8 checkpoint, (ii) seçim tarafı para payı/tutarı ve varsa ilgili beraberlik payı, (iii) aynı seçim ve marketin doğrulanmış odds hareketi/retention/persistence, çelişki veya risk. Maddeyi **ilgili tek maç+market+seçim** kimliğine bağla. Bu maddeler SXF tam raporundan gelir ve ANALYST'in nötr girdi bloğuna, NEWS'e veya FINAL dışındaki bir departmana **aktarılmaz**. Site için ayrı `software_detail_bullets_en` kullanılıyorsa aynı doğrulanmış 1–3 bulgunun İngilizce sunumudur, yeni kanıt değildir.

Örnek yerleşim (tamamen **biçim örneği**, gerçek bulgu değil):
`Maç / Tercih`
- `1. [doğrulanmış motor ve checkpoint]`
- `2. [varsa doğrulanmış para akışı]`
- `3. [varsa doğrulanmış odds/retention/risk]`

**KOPYALA → ANALYST GİRDİSİ** (yalnızca şu tablo)

| tarih (TSİ) | başlama (TSİ) | ev sahibi | deplasman | market | seçim | fixture_uid | run_id | AS_OF / karar kesiti |
|---|---|---|---|---|---|---|---|---|

- Yalnızca doğrulanmış **aktif** SXF seçimlerini geçir; kullanıcı açıkça ek maç istiyorsa ayrıca etiketle. `run_id` doğrulanmamışsa `YOK — YENİ RUN GEREKİR` yaz, UUID uydurma.
- `SXF → ANALYST` girdisinde motor adı/kodu, checkpoint tipi, para/oran ve SXF yorumu yoktur. Çekirdek market/selection aynen korunur.
- Bir maçta iki farklı seçim varsa iki ayrı satır; aynı seçimde birkaç örtüşen motor varsa **tek seçim satırı**.
- Tüm satırlarda kimlik, kickoff ve as_of uyumunu doğrula; T-6, T-8 veya dynamic olduğu SXF tam raporunda kalır.

## B. ANALYST — kendi tam v2.1 raporu + iki kapanış tablosu

Girdi: kullanıcının yapıştırdığı `KOPYALA → ANALYST GİRDİSİ` bloğu. Kullanıcıya ait seçimlerdir, SXF kanıtı değildir. ANALYST yalnız üç faktör: topa sahip olma, form ivmesi (son 3 ve son 1), rakip mantığı + her iki takımın tüm ev/deplasman maçları. Her seçim için doğrulanmış ordinal `Tercih destek puanı N/100` veya `veri yetersiz`. SXF kodu/odds, NEWS, POLY yok.

Tam raporun **en sonunda**:

**ANALYST — KISA SONUÇ**

| Maç (TSİ) | Market / seçim | A (destek /100 veya veri yetersiz) | Kısa futbol değerlendirmesi | run_id |
|---|---|---|---|---|

**KOPYALA → NEWS GİRDİSİ**: SXF'den gelen `KOPYALA → ANALYST GİRDİSİ` tablosunun **aynı nötr sütunları**; ANALYST skoru/yorumu veya SXF sinyali EKLEME. Bir seçim analitik olarak desteklenmiyorsa onu gizleme: NEWS yine bağımsız inceler. Satırları sessizce silme veya tercihleri değiştirme.

## C. NEWS — kendi tam v1.6 raporu + kapanış tablosu

Girdi: yalnız `KOPYALA → NEWS GİRDİSİ`. NEWS hem ev sahibini hem deplasmanı 8 haber ailesinde inceler, yalnız maç açısından materyal H# haberlerini seçer, her H# için 1/X/2/Üst/Alt/KG VAR/KG YOK etki puanları -3..+3 ve tüm yedi sütun toplamını hesaplar. Kullanıcının tercihine özel tek ordinal NEWS destek /100; veri yetersizliğinde v1.6'nın `50/100 — veri yetersiz` etiketi, sahte kanıt değil. NEWS önceki uzmanları okuyup yorumlarını kullanmaz.

Tam raporun **en sonunda**:

**NEWS — KISA SONUÇ / FINAL'E GİDECEK LİSTE**

| Maç (TSİ) | Market / seçim | N (NEWS destek /100 veya 50 — veri yetersiz) | NEWS ilgili ham yön puanı | Öne çıkan materyal haber/kanıt açığı | run_id |
|---|---|---|---|---|---|

**FINAL GİRDİ KONTROLÜ:** `SXF TAM RAPORU: kullanıcıdan eklenecek` ; `ANALYST TAM RAPORU: kullanıcıdan eklenecek` ; `NEWS TAM RAPORU: hazır` ; `POLY: var / yok`. NEWS önceki raporları kendi çıktısına tekrar yazmaz veya yeniden özetlemez.

## D. FINAL — sentez + siteye aktarım

Kullanıcının FINAL'e verdiği: **aynı seçimlere ait 3 tam rapor** (SXF, ANALYST, NEWS), ek POLY raporu varsa o da, güncel karar `as_of_utc`, doğrulanmış `run_id` ve doğrulanmış fixture kimliği. Son NEWS tablosu yalnız indeks; tek başına yeterli kanıt değildir.

FINAL `roles/final.md`, `methods/final_methodology.md`, `schemas/final_report.md` v0.2 ile sadece raporları sentezler. Kaynak araştırmaz. Farklı as-of, seçim, fixture, run_id, veriler eksikse bunu belirtir; eski bilgiyle gelecek bilgiyi karıştırmaz. POLY yoksa `NO_EVIDENCE`, belirsizlik ve missing-data etkisi; POLY için sahte %5-15 katkı üretme. A/B/C/NO_RECOMMENDATION yalnız FINAL'e aittir, diğer rollere değil.

FINAL tam rapor sonunda:
**SON KARAR / SITE DEVİR LİSTESİ**

| Maç | Market | Seçim | Karar (A/B/C/NO_RECOMMENDATION) | Kısa neden | run_id | Site kayıt durumu |
|---|---|---|---|---|---|---|

**Yayın kuralı:** Kullanıcı bu FINAL raporunu siteye eklemek istediğinde (bu zincirde son aşama olarak açıkça yetki vermiştir) agent, mevcut bağlı **Remote Desktop Commander** üzerinden sadece doğrulanmış CAPITALE yetkili yerel yükleyiciyi çalıştırır. Kullanıcıdan GPT Action veya token istemez; sunucu gizli kimlik bilgilerini sohbet içinde göstermez. **Önce gerçek backend'in FINAL için kayıt desteği olduğunu doğrula.** Mevcut `/opt/capitale-report-uploader.py` ANALYST/NEWS/SXF rollerini destekler; FINAL için otomatik olarak bunu kullanıp başarı iddia etmek YASAK. FINAL kaydı için ayrıca güvenli yetkili hedef/API ve gerekli veritabanı/site gösterimi doğrulanmalıdır. Bağlantı hazır değilse raporu üret, `SİTEYE KAYDEDİLEMEDİ — FINAL YAZMA HEDEFİ HAZIR DEĞİL` yaz ve raporu değiştirme. Endpoint'i hackleme, başka rol kimliğiyle kaydetme, web admin yetkilerini atlatma.
- Gerçek site kaydı ancak sunucudan başarılı kayıt id/version ve mümkünse read-back ile doğrulanınca `KAYDEDİLDİ`.
- Final puanı tahminin kazanma olasılığı gibi sunma; oran, stake veya kesin kazanç uydurma.
- Önceki raporların orijinal tam metni ve sürümü saklanır.

## Basit kullanıcı akışı

1. Kullanıcı SXF'ye maçları gönderir. SXF tam raporu ve **kopyalık ANALYST listesini** döner.
2. Kullanıcı sadece son `KOPYALA → ANALYST GİRDİSİ` tablosunu ANALYST'e yapıştırır, SXF tam raporunu saklar.
3. ANALYST tam raporu ve **kopyalık NEWS listesini** döner. Kullanıcı sadece bu listeyi NEWS'e verir, ANALYST raporunu saklar.
4. NEWS tam raporu ve kısa FINAL listesini döner.
5. Kullanıcı FINAL'e üç tam raporu (opsiyonel POLY'yi) gönderir. FINAL sonuçlandırır ve siteye ancak yetkili/işleyen kayıt yolu ile aktarır.

## Değişmeyen kurallar

- Yeni tahmin/sinyal metodolojisi, eşik veya başarı iddiası ekleme.
- Uydurma maç/tercih/skor/run_id/veri yok.
- Aynı fixture/market/selection ve as-of ile çapraz-devir, eksik veri açık.
- Bağımsız araştırma ve kaynağı/kanıt sınırlama aynen sürer.
- Varsayılan akış **SXF → ANALYST → NEWS → FINAL**; POLY varsa FINAL'e bağımsız dördüncü kanıt olarak sunulur.

## 2026-11-20 — Commander özel devir arşivi (tek son NEWS paketiyle FINAL)

Kullanıcının istediği basit tek-yönlü akış için sunucuya **özel rapor devir arşivi** eklendi: `/opt/capitale-report-chain-inbox.py` (GitHub kodu: `tools/manual_report_inbox.py`). Bu sadece sunucu içi özgün raporları saklar; siteye yayın YAPMAZ.

**Her uzman için:** Tam rapor hazır olduğunda agent, bağlı Commander aracını kullanarak kendi orijinal rapor metnini bir geçici UTF-8 dosyasına yazar ve **her doğrulanmış run_id** için şunu çalıştırır:

```bash
python3 /opt/capitale-report-chain-inbox.py save --role sxf --run-id <UUID> --as-of <ISO8601> --input /tmp/<tam-rapor>.md
```

ANALYST için `--role analyst`; NEWS için `--role news`. Bu bir **site kaydı değildir**. Komutun `STAGED_ONLY_NOT_SITE` veya `ALREADY_STAGED` cevabını görmeden "arşivlendi" deme. Raporlar SHA256 kontrolüyle sürüm sürüm korunur; mevcut dosyalar üzerine yazılmaz. Geçici dosyanın içeriğini loglara/yanlış sohbete taşımadan işle. Gerekirse bütün maçların ortak tam raporu her ilgili `run_id` altında saklanabilir; sahte run_id üretilemez.

**FINAL'e artık tek son tablo verilebilir:** Kullanıcı NEWS'in son kısa listesini ve doğrulanmış run_id(leri)ni FINAL'e iletir. FINAL bağlı Commander ile:

```bash
python3 /opt/capitale-report-chain-inbox.py status --run-id <UUID>
python3 /opt/capitale-report-chain-inbox.py bundle --run-id <UUID> --out /tmp/capitale-final-<UUID>.json
```

komutlarını çalıştırır, yalnızca `ready_for_final: true` ise oluşturulmuş **orijinal tam SXF/ANALYST/NEWS** raporları içeren özel JSON zarfını okur. Daha sonra farklı fixture/selection/as_of uyumunu ayrıca doğrular. POLY varsa kullanıcı ayrı ekleyebilir; yoksa `NO_EVIDENCE`. Bir rapor `MISSING` ise SITEYE aktarım yapılmaz; eksik orijinal rapor kullanıcıdan istenir. `bundle` asla yeni analiz/kanıt yaratmaz.

**Commander başka agent sohbetinde bağlı değilse:** Otomatik devir gerçekleşmez. Bu durumda eski güvenli yol: kullanıcı SON FINAL aşamasına 3 tam raporu bir defada verir. Hangi aktarım yöntemi kullanıldığını doğru söyle. FINAL'in site yazıcısı hâlâ ayrı bir yetkili entegrasyon gerektirir.
