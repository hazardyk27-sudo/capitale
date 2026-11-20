# CAPITALE — CANLI DOĞRUDAN RAPOR AKIŞI

Status: OWNER-APPROVED — ACTIVE DEFAULT
Version: 3.0 — 2026-11-20

**SXF → ANALYST → NEWS → FINAL. HER ROL KENDİ RAPORUNU AYNI CANLI MAÇ KAYDINA YAZAR.** Artık üç raporun FINAL'e kadar gizli bir arşivde bekletilmesi normal akış değildir. Sitenin `/admin/software` sayfası çalışmanın ana kayıt merkezidir. Tam uzman raporları korunur; yalnız kısa özet yayınlamak tam raporun yerine geçmez.

## 1. SXF — sinyal oluşunca Software'e doğrudan aktarım

- SmartXFlow'un `public.sxf_base_signal_events` tablosundaki **doğrulanmış `FINAL_SIGNAL`** olayları sunucuda `tools/capitale_sxf_software_sync.py` / `/opt/capitale-sxf-software-sync.py` ile analiz edilir.
- `tools/capitale_sxf_software_watch.py` / `/opt/capitale-sxf-software-watch.py` her **3 dakikada bir** yeni olay olup olmadığını denetler. Yalnız geçerli T-6/T-8 checkpoint, source snapshot zamanı karar kesitini aşmayan, kanonik fixture kimliğiyle doğrulanmış **aktif motorları** kullanır. Deneysel/retired motorlar, prelim/sıradan alarm ve gelecekteki veri otomatik sinyal sayılmaz. Aynı seçimde V1+V2 veya STABLE+PREMIUM tek seçim kaydı olur. Farklı seçimli/şüpheli gruplaşma kontrol bekler, sessizce diğer seçimi atmaz. Varsayılan günlük yöntem T-6, uygun durumda T-8 fallback; geçerli T-6 nontrigger sonrasında T-8'e kaçılmaz. `SURPRISE_TEAM` sadece **watch_only** izleme etiketiyle aktarılır; kazanan taraf bahsi olarak önerilmez.
- Siteye seçimin `fixture_uid`, gerçek `run_id`, maç saati, market/seçim, motorlar, MOM/PRM/CRL/SLD görünüm kodu, checkpoint, verified share/amount, mevcut ve gerçekten geçmiş referans odds ve oran değişim % bilgileri ile **1–3 kanıt maddesi** kaydedilir. Kaynak odds referansı yoksa O sütunu `—` gösterir, oran yüzdesi uydurulmaz. Maç listesindeki O alanı **yalnız oran değişim yüzdesidir**.
- SXF sohbet agentı kendi **tam kaynak/snapshot/motor raporunu** ayrıca üretir. Kapanışta `SXF — TETİKLENEN SİNYALLER` tablosu, her incelenen maç+market+tercih için **en az bir, en fazla üç numaralı doğrulanmış bulgu** ve `KOPYALA → ANALYST GİRDİSİ` nötr tablosu bulunur. Sinyal yoksa en az bir dürüst doğrulama bulgusu yazılır; aktifmiş gibi yayınlanmaz.
- SXF sohbeti otomatik veri kaydını önce doğrular (yalnız gerçek `run_id` ve rapor kimliğiyle `SAVED_READBACK_OK`). Tam sohbet raporuna yeni gerçek kanıt eklendiyse kendi `sxf` raporunun **yeni versiyonunu**, aynı `run_id` ile Commander uploader'dan yükleyebilir; eski sürümü silmez.
- Sadece gerçekten aktif ve doğrulanmış seçimleri ANALYST'e ver. `SURPRISE_TEAM` watch_only ise otomatik kazanan taraf tercihi olarak aktarılmaz.

## 2. ANALYST — kendi tam raporunu aynı site kaydına ekler

- ALDIĞI: yalnız nötr `tarih | saat | ev sahibi | deplasman | market | seçim | fixture_uid | run_id | SXF karar AS_OF` tablosu. SXF motor/para/oran/yorum bilgisi analiz kanıtı olarak kullanılmaz.
- ANALYST v2.1 CANONICAL üç bağımsız futbol faktörünü eksiksiz çalıştırır: (1) topa sahip olma, (2) sezon, son üç ve son bir maç form ivmesi, (3) rakip seviyesi/taktik ve iki takımın bütün ev/deplasman lig maçları. Tek **ordinal A destek /100** veya `veri yetersiz`; kazanma olasılığı değildir.
- Tam raporun sonunda `ANALYST — KISA SONUÇ` + aynı nötr sütunlu `KOPYALA → NEWS GİRDİSİ` gösterir.
- Commander bağlıysa **orijinal tam raporunu** ve rolüne ait `payload.display` bilgilerini `python3 /opt/capitale-report-uploader.py submit --role analyst --file /tmp/analyst-<run_id>.json` ile siteye yazar. SXF'ye ait anahtarları değiştirmez. `SAVED_READBACK_OK` sonucunu görmeden başarı iddiasında bulunmaz.

## 3. NEWS — kendi tam raporunu aynı site kaydına ekler

- ALDIĞI: yalnız `KOPYALA → NEWS GİRDİSİ` nötr tablosu. Önceki A puanı/SXF sinyal/yorumları kaynak değildir. Her iki takımın sekiz haber alanını simetrik araştır, yalnız materyal H# haberlerini yedi 1/X/2/O/U/KG Y/KG N etki sütunuyla puanla. N/100 yalnız kaynağa dayalı ordinal destek, olasılık değildir. Yeterli haber yoksa `50/100 — veri yetersiz` etiketi.
- Tam rapor sonunda `NEWS — KISA SONUÇ / FINAL'E GİDECEK LİSTE` (maç, market, seçim, N/100, yedi marketten ilgili ham NEWS etkisi, kısa gerekçe, gerçek run_id) göster.
- Commander bağlıysa **orijinal tam NEWS raporunu** `python3 /opt/capitale-report-uploader.py submit --role news --file /tmp/news-<run_id>.json` ile kaydet; `SAVED_READBACK_OK` şarttır. SXF/ANALYST alanlarını değiştirmez.

## 4. Her rolün yazma zarfı — sunucu tarafından doğrulanır

`/opt/capitale-report-uploader.py` mevcut yetkili **localhost-only Commander** rapor yükleyicisidir. Kullanıcı token, GPT Actions veya Chrome işlemi yapmaz. Dosya **gerçek mevcut rapordan** hazırlanmış JSON olmalı; uydurma örnek kimlik, maç veya kaynak hash'i yüklenmez.

```text
{
  "run_id": "<SXF tarafından oluşturulmuş GERÇEK UUID>",
  "role": "<analyst veya news veya sxf>",
  "report": {
    "status": "complete",
    "as_of": "<rolün GERÇEK kaynak araştırma kesiti UTC>",
    "source_count": "<orijinal raporda doğrulanmış tamsayı>",
    "summary": "<tam raporun kısa özeti>",
    "payload": {
      "display": {
        "market": "<SXF ile aynı orijinal 1X2 / OU25 / BTTS>",
        "selection": "<SXF ile aynı orijinal 1 / 2 / O / Y>",
        "support_score": "<yalnız ANALYST/NEWS: 0-100 veya null>",
        "software_detail_bullets_en": ["<varsa en çok üç kaynaklı İngilizce bulgu>"]
      },
      "<role>_full_report": "<kaynaklarıyla birlikte eksiksiz orijinal rapor>"
    },
    "prompt_version": "<gerçek sürüm>",
    "input_snapshot_hash": "<gerçek giriş/kaynak setinin SHA256 hex'i>"
  },
  "evidence": "<0..100 kanıt girdisi>"
}
```

Bu bir **alan sözleşmesi gösterimi**dir, çalıştırılabilir hazır örnek JSON değildir. `role` dış zarfta yalnız CLI tutarlılık kontrolüne yarar; sunucu rolü gizli server kimliğiyle belirler. `as_of` yalnız gerçek raporun veri kesitidir ve kickoff'tan önce olmalıdır. SXF'nin T-6/T-8 karar kesitiyle ANALYST/NEWS'in bağımsız rapor AS_OF değerlerinin aynı olması gerekmez. Tüm raporlar `FINAL` karar anından önceki kanıta dayanmalı ve maç sonrası haber/görüş ile eski karar değiştirilmemelidir. `source_count` ve `input_snapshot_hash` uydurulmaz.

## 5. FINAL — sitedeki üç gerçek raporu okur ve sentezler

- Kullanıcı FINAL'e yalnız son NEWS listesini ve gerçek `run_id` verir. FINAL, Commander aracılığıyla `python3 /opt/capitale-site-report-reader.py --run-id <UUID> --require-all --out /tmp/capitale-final-source-<UUID>.json` komutunu çalıştırıp **sitedeki** SXF, ANALYST ve NEWS tam kaynak raporlarını alır; özgeçmiş Commander devir arşivinden alması zorunlu değildir.
- CLI `ready_for_final:true` olmadan, aynı maç+market+seçim, kaynak kesitleri, pre-match ve rapor bütünlüğü eşleşmeden FINAL kararını siteye yazmaz. Yalnız `sxf` mevcutsa ANALYST/NEWS'i var saymaz.
- FINAL v0.2 **A/B/C/NO_RECOMMENDATION** sentezi; sadece diğer departmanların tam raporlarını kullanır. POLY raporu varsa bağımsız ek kanıt olarak sunulabilir; yoksa `NO_EVIDENCE`, sahte %5–15 POLY oyu üretme.
- Tam FINAL raporu sonunda kısa `SON KARAR / SITE DEVİR LİSTESİ` yazılır.
- **FINAL yazma bağlantısı henüz ayrıca tamamlanıp canlı test edilmedi** (GitHub issue #8). Gerçek son kayıt ID/version + authenticated admin readback görülmediyse `SİTEYE KAYDEDİLEMEDİ — FINAL YAZMA HEDEFİ HAZIR DEĞİL`. Başka rolün alanını veya tokenless endpoint'i taklit ederek FINAL yükleme YASAK.

## 6. Güvenlik ve durumlar

- SXF, ANALYST ve NEWS sadece kendi rol kayıtlarının **yeni sürümünü** ekler; eski rapor/diğer departman kaydı değiştirilmez. FINAL ayrı karar alanına yazar.
- Sunucu eski `/api/capitale/agent-bridge/reports/:department` tokenless **internet** yolunu Nginx'te 403 ile kapatır. Yetkili localhost Commander backend ve server-only DB credentials işler. Chat veya browser hiçbir gizli anahtar almaz.
- `KAYDEDİLDİ` ancak gerçek `report_id`, `report_version` ve aynı rol/`run_id`/`input_snapshot_hash` tekrar okunup doğrulanınca kullanılır. Bir rapor yoksa sitede `RAPOR BEKLENİYOR`/eksik statüsü olur.
- Çok seçimli tek fikstürde mevcut arayüz yalnız bir ayrı `display` seçimini bir `run_id` için göstermektedir; otomatik import bu durumları **sessizce elemez/uydurmaz**, `multiple_picks_require_expanded_board` olarak işaretler. Tüm seçimleri ayrı satır gösteren genişletme ayrıca doğrulanmalıdır.
- Geçmiş `tools/manual_report_inbox.py` ve üç tam raporu FINAL'de toplayan arşiv yolu sadece **bağlantı yoksa manuel yedek**; günlük varsayılan akış DEĞİL.
- Motor eşikleri, ANALYST üç faktörü, NEWS H# ve source-policy ayrımı, SXF tarihsel snapshot/arşivleri veya FINAL karar metodolojisi değiştirilmez.
