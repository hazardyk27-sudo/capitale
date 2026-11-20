# CAPITALE — AKTİF MANUEL AGENT ZİNCİRİ

Status: OWNER-APPROVED OPERATIONAL WORKFLOW
Version: 2.0 — 2026-11-20

**Tek varsayılan kullanıcı iş akışı: SXF → ANALYST → NEWS → FINAL → site.**
Başka bir akış yalnız kullanıcı açıkça isterse ayrı bir araştırma modu olarak çalışabilir; bu belge geçmişteki bağımsız/parallel yayın modunu AKTİF KABUL ETMEZ.
Bu belge yalnız rapor aktarımı ve sunum biçimidir; SXF/ANALYST/NEWS/FINAL/POLY analiz eşikleri, source policy, AS_OF veya sonuç metodolojilerini değiştirmez.

## Ortak ilkeler

- SXF, ANALYST ve NEWS **tam bağımsız özgün rapor** üretir ve yalnız kendi izinli verisini kullanır.
- SXF → ANALYST ve ANALYST → NEWS **yalnız nötr seçim bilgisi** taşır: tarih, saat, ev sahibi, deplasman, market, seçim, doğrulanmış fixture_uid, run_id ve karar AS_OF. Uzmanın açıklama ve puanları sonraki uzman için kanıt değildir.
- Orijinal üç tam raporu yalnız FINAL birlikte değerlendirir. POLY bağımsız isteğe bağlıdır; yoksa `NOT_PROVIDED / NO_EVIDENCE`, asla sahte POLY desteği yoktur.
- `run_id` formatı geçerli olmakla kalmayıp kanonik araştırma kaydıyla gerçekten eşleştirilmiş olmalıdır; UUID uydurulmaz. `fixture_uid`, market, seçim, kickoff ve tüm kaynak kesitleri tutarlı olmalıdır.
- Verisi eksik maçı sinyal varmış gibi gösterme; AS_OF sonrasındaki hiçbir snapshot karar verisini değiştiremez.

## 1. SXF — tam rapor, sinyaller, en az 1 bulgu, nötr liste

SXF v0.4.3 DRAFT; SmartXFlow kaynakları, engine precedence ve AS_OF politikası uygulanır. Günlük varsayılan: her maç/market için geçmişte oluşmuş geçerli **T-6**. T-6 henüz gelmediyse veya market T-6 verisi eksik/geçersizse ve gerçek T-8 verisi uygunsa **T-8 fallback**; geçerli T-6 sinyal vermediği için T-8'e geçilemez. `DYNAMIC_AS_OF_V04` yalnız özel istekle. Retired/shadow motorlar asla aktif sinyal diye listelenmez.

Önce **eksiksiz SXF raporunu** üret. En sonunda sırasıyla:

**SXF — TETİKLENEN SİNYALLER**

| Maç ve başlangıç (TSİ) | Market / seçim | Gerçek motor(lar) | Kısa kod | Karar checkpoint | run_id |
|---|---|---|---|---|---|
| Gerçek veri varsa satır | Gerçek seçim | Tetiklenen onaylı motor(lar) | MOM / PRM / CRL / SLD | T-6 veya gerekçeli T-8 | Doğrulanmış UUID |

Kısa kodlar SADECE görüntü etiketidir; motor listesi/önceliği korunur. V1/V2/HEAVY ve BTTS YES → MOM; PREMIUM OVER → PRM; STABLE OVER ve SURPRISE TEAM → CRL; EARLY MONEY CORE → SLD. OVER_STRONG, EKOL 3 ve EARLY CORE v2 yalnız SHADOW/RESEARCH; core sinyal olarak aktarılmaz. Aktif sinyal yoksa `SİNYAL YOK` yaz.

**SXF — HER MAÇ/TERCİH İÇİN 1–3 NUMARALI BULGU (ZORUNLU)**

- Her incelenen maç + market + seçim için **EN AZ 1** numaralı somut bulgu yaz; veri yeterliyse 2 ya da 3, **en fazla 3**. Madde hiç atlanmaz.
- Aktif sinyal varsa en azından doğrulanan **motor + checkpoint + o tercihe neden tetiklendiği** birinci maddedir. Kalan maddelerde doğrulanmış para payı/tutarı, retention, aynı market-seçimin odds hareketi, önemli conflict/risk yaz.
- Veri/sinyal doğrulanamıyorsa yine bir numaralı **doğrulama bulgusu** yaz: `1. Geçerli SXF sinyali doğrulanamadı; [gerçekten bilinen veri/kesit eksiği veya gerekçe bilinmiyor].` Bu maç aktif sinyal tablosunda veya nötr aktif seçim devrinde yer alamaz. Gerekçe, sayı veya olay uydurulmaz.
- Bu açıklamalar SXF tam raporunda saklanır, **ANALYST veya NEWS'in yönlendirme girdisine girmez**.

**KOPYALA → ANALYST GİRDİSİ** (yalnız gerçek aktif seçimler)

| Tarih TSİ | Saat TSİ | Ev sahibi | Deplasman | Market | Seçim | fixture_uid | run_id | AS_OF |
|---|---|---|---|---|---|---|---|---|

Örtüşen motorların aynı market/seçiminde tek satır; farklı gerçek seçim ayrı satır. Nötr girdide motor, kısa kod, odds, para, risk açıklaması, SXF maddesi yok. Kimlik yoksa `YOK — DOĞRULAMA GEREKİR`, sahte UUID yok.

## 2. ANALYST — tam üç faktör, A ve NEWS nötr girdisi

ALDIĞI: yalnız `KOPYALA → ANALYST GİRDİSİ`.
ANALYST v2.1 CANONICAL: bağımsız topa sahip olma, form ivmesi (son 3/son 1), rakip ve ev/deplasman mantığı. A, tek tercihi destekleyen ordinal /100 veya veri yetersizdir, kazanma olasılığı değildir. Önce **tam orijinal araştırma raporunu** yaz.

**ANALYST — KISA SONUÇ**

| Maç (TSİ) | Market / seçim | A /100 veya veri yetersiz | Kısa futbol değerlendirmesi | run_id |
|---|---|---|---|---|

**KOPYALA → NEWS GİRDİSİ:** SXF'deki nötr girdinin **aynı sütun ve bütün seçimleri**. A, SXF kodu, money, odds veya analiz yorumu bulunmaz; olumsuz analizi olan seçim bile sessizce elenmez.

## 3. NEWS — tam haber analizi, N ve FINAL listesi

ALDIĞI: yalnız `KOPYALA → NEWS GİRDİSİ`. NEWS v1.6 CANONICAL iki takımı simetrik inceler, sekiz haber alanını araştırır, yalnız materyal H# hikâyelerini yedi 1/X/2/Üst/Alt/KG VAR/KG YOK etki sütununda −3..+3 puanlar ve yedi imzalı toplamı hesaplar; seçimin **bağımsız** NEWS ordinal N /100 desteğini verir. Veri yoksa `50/100 — veri yetersiz` kalıbını belirtir. Önce tam rapor yaz.

**NEWS — SONUÇ / FINAL'E VERİLECEK LİSTE**

| Maç (TSİ) | Market / seçim | N /100 (veya veri yetersiz) | İlgili imzalı ham NEWS toplamı | Materyal kanıt/eksik | run_id |
|---|---|---|---|---|---|

**FINAL DEVİR DURUMU:** Commander arşivinde SXF / ANALYST / NEWS tam raporlarının bulunma durumunu ancak gerçekten kontrol edebiliyorsan yaz. Kontrol edemiyorsan `ARŞİV DOĞRULANMADI` yaz; hepsinin yüklendiğini varsayma.

## 4. Özel Commander arşivi — tam raporları FINAL'e taşır; siteye yazmaz

Kullanıcının token veya GPT Action kurmasına gerek yoktur. Her uzman, **bu sohbette Commander gerçekten bağlıysa**, orijinal tam raporunu geçici UTF-8 dosyasına kaydeder ve **her doğrulanmış run_id için** sunucudaki `/opt/capitale-report-chain-inbox.py` komutuna kendi rolüyle verir:

```bash
python3 /opt/capitale-report-chain-inbox.py save --role sxf --run-id <GERÇEK_UUID> --as-of <ISO8601> --input /tmp/<tam-sxf-rapor>.md
```

ANALYST için `--role analyst`, NEWS için `--role news`. Beklenen `STAGED_ONLY_NOT_SITE` veya `ALREADY_STAGED` yanıtıdır. Bu **özel devir kaydı**; CAPITALE sitesine yayın değildir. Orijinal raporlar SHA256 ve sürüm ile saklanır.

Kullanıcı FINAL'e **yalnız son NEWS tablosu + run_id** verebilir, ancak 3 tam rapor da gerçekten Commander arşivindeyse. FINAL:

```bash
python3 /opt/capitale-report-chain-inbox.py status --run-id <GERÇEK_UUID>
python3 /opt/capitale-report-chain-inbox.py bundle --run-id <GERÇEK_UUID> --out /tmp/capitale-final-<GERÇEK_UUID>.json
```

`ready_for_final:true` sadece 3 rolün arşivde bulunduğuna işaret eder; orijinal raporların aynı fixture/selection/cutoff olduğunu ayrıca doğrulamadan sentez yapılmaz. Paket hiç yeni analiz üretmez. Commander bağlantısı yoksa, eksik rapor varsa veya arşiv bütünlüğü doğrulanmıyorsa kullanıcı **üç tam raporu** FINAL'e manuel verir; eksikler uydurulmaz.

## 5. FINAL — tam sentez ve son yayın adımı

FINAL v0.2 DRAFT; yalnız **özgün üç tam rapor** (POLY varsa dört) üzerinden sentezler. Aynı maç/market/seçim/run ve AS_OF doğrulanır; çatışma, freshness, etki bağımlılıkları ve eksikler açıkça işlenir. A/B/C veya NO_RECOMMENDATION yalnız FINAL kararlarıdır; kimse yeni raw maç kanıtı icat etmez.

**SON KARAR / SITE DEVİR LİSTESİ**

| Maç | Market | Seçim | A/B/C veya NO_RECOMMENDATION | Kısa neden | run_id | Site kayıt durumu |
|---|---|---|---|---|---|---|

**Tek site-yayın sahibi FINAL'dir.** FULL FINAL raporunu, üç kaynak raporunu ve evidence trace'i korur. Yalnız yetkili Commander sunucu yazıcısı gerçek kayıt ID/versiyon döndürüp **authenticated admin read-back** ile doğrulanırsa `KAYDEDİLDİ` denir. Mevcut `/opt/capitale-report-uploader.py` SXF/ANALYST/NEWS içindir, **FINAL desteklemez**. FINAL yazıcısı henüz doğrulanmamıştır (GitHub issue #8): destek olmadan rapor üretilir fakat `SİTEYE KAYDEDİLEMEDİ — FINAL YAZMA HEDEFİ HAZIR DEĞİL` denir. Diğer agent kimliğiyle gönderme, açık/tokensız endpoint'i kullanma, token veya GPT Action isteme.

## Değişmeyenler

Source policies, mevcut analiz sürümleri, SXF T-6/T-8 önceliği, AS_OF, bağımsızlık, geçmiş raporların değiştirilmemesi, ekranda A/N/V/B/O alanlarının kaynak ayrımı ve hatalı veri üretmeme aynen geçerlidir. Arşiv ve görüntüleme amaçlı geçmiş belgeler günlük agent giriş kuralı sayılmaz.
