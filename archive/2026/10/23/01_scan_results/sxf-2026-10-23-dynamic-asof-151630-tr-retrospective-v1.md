# CAPİTALE SXF — 23 Ekim 2026 dinamik AS_OF yeniden taraması

> **RECONSTRUCTED (tarihsel yeniden oluşturma).** Bu dosya canlı karar anında GitHub'a kaydedilmiş özgün bir tarama değildir. Kullanıcıya daha sonra sunulan 23 Ekim 2026 SXF değerlendirmesinin salt-okunur kaynak üzerinden arşiv kaydıdır. Maç skoru, bitiş sonucu, kapanış oranı ve AS_OF sonrası sinyal kararları kullanılmamıştır.

- Run: `sxf-2026-10-23-dynamic-asof-151630-tr-retrospective-v1`
- Scan: `scan-20261023-151630-tr-dynamic-v04-reconstructed-v1`
- Maç tarih/saat filtresi: **23 Ekim 2026, 19:30–23:00 TSİ**
- Tarihsel AS_OF: **23 Ekim 2026 15:16:30 TSİ** (`2026-10-23T12:16:30Z`)
- Mod: `DYNAMIC_AS_OF_V04`; metodoloji: `sxf-draft-0.4`
- Kayıt kaynağı: `public.fixtures`, `public.moneyway_snapshots`, EARLY geçmişi ve sinyal eventleri; Supabase sadece SELECT
- Kapsam: **91 farklı maç**, **84 veri bulunan**, **7 hiç veri bulunmayan**, **15 sinyalli maç**, **15 farklı seçim**, **26 motor etiketi**
- 1X2 / Üst-Alt / BTTS tam karşıtlı piyasa kapsamı: **72 / 63 / 47** maç
- Her seçimde farklı T-minus süresi `kickoff_utc − AS_OF` ile ayrı hesaplandı; ortak T-6/T-8 uygulanmadı.

## Sinyal tabloları

### 1X2 — 11 seçim

| Saat TSİ · Maç | Seçim | Motor etiketleri | SXF oranı | Para payı | Para (£) | Gerçek ufuk |
|---|---|---|---:|---:|---:|---|
| 19:30 · Bochum – Wolfsburg | **Wolfsburg** | EARLY_T12 | 2,20 | %78,2 | 22.342 | T-4h13m30s |
| 19:30 · First Vienna Fc 1894 – Floridsdorfer AC | **First Vienna Fc 1894** | V1 | 1,64 | %92,5 | 5.495 | T-4h13m30s |
| 20:00 · Hvidovre – HB Koge | **Hvidovre** | EARLY_T12, V1, V2 | 1,87 | %82,6 | 2.878 | T-4h43m30s |
| 20:00 · Vasteras SK – Halmstads | **Vasteras SK** | V1, V2 | 1,74 | %82,1 | 2.076 | T-4h43m30s |
| 21:00 · Go Ahead Eagles – SC Telstar | **Go Ahead Eagles** | V1, HEAVY | 1,64 | %81,9 | 10.964 | T-5h43m30s |
| 21:00 · Nancy – Laval | **Nancy** | V1, V2 | 1,70 | %82,8 | 1.828 | T-5h43m30s |
| 21:30 · Stuttgart – Mgladbach | **Stuttgart** | EARLY_CORE | 1,39 | %84,4 | 139.561 | T-6h13m30s |
| 21:45 · Derry City – Dundalk | **Derry City** | V1, V2 | 1,83 | %90,7 | 2.436 | T-6h28m30s |
| 21:45 · Galway Utd – St Patricks | **St Patricks** | EARLY_T12 | 1,70 | %78,0 | 1.307 | T-6h28m30s |
| 21:45 · Gateshead – Tamworth FC | **Tamworth FC** | V1, V2 | 1,69 | %92,8 | 1.585 | T-6h28m30s |
| 22:00 · Alaves – Malaga | **Alaves** | EARLY_CORE, EARLY_T12, V1, V2, HEAVY | 1,69 | %87,6 | 128.312 | T-6h43m30s |

### Üst 2.5 — 1 seçim

| Saat TSİ · Maç | Seçim | Motor etiketleri | SXF oranı | Para payı | Para (£) | Gerçek ufuk |
|---|---|---|---:|---:|---:|---|
| 21:00 · Dunkerque – Metz | **Üst 2.5** | PREMIUM_OVER_2_5 | 1,68 | %99,3 | 6.133 | T-5h43m30s |

### KG VAR / BTTS YES — 2 seçim

| Saat TSİ · Maç | Seçim | Motor etiketleri | SXF oranı | Para payı | Para (£) | Gerçek ufuk |
|---|---|---|---:|---:|---:|---|
| 20:30 · SCR Altach – Austria Wien | **KG VAR** | BTTS_YES | 1,69 | %95,6 | 2.481 | T-5h13m30s |
| 22:00 · Ipswich – Nottm Forest | **KG VAR** | BTTS_YES | 1,66 | %85,0 | 4.158 | T-6h43m30s |

### SURPRISE / Kaybetmeme riski — 1 seçim

| Saat TSİ · Maç | Seçim | Motor etiketleri | SXF oranı | Para payı | Para (£) | Gerçek ufuk |
|---|---|---|---:|---:|---:|---|
| 21:30 · Perugia – Pescara | **Perugia kaybetmez (risk)** | SURPRISE_TEAM | 2,98 | %86,1 | 392 | T-6h13m30s |

## Motor etiketi sayıları

| Motor | Adet |
|---|---:|
| EARLY_CORE | 2 |
| EARLY_T12 | 4 |
| V1 | 8 |
| V2 | 6 |
| HEAVY | 2 |
| PREMIUM_OVER_2_5 | 1 |
| BTTS_YES | 2 |
| SURPRISE_TEAM | 1 |
| **Toplam (birbirinden bağımsız seçim değil)** | **26** |

## Önemli motor denetimleri

- V2 geçti: Hvidovre, Västerås, Nancy, Derry City, Tamworth FC, Alavés (6 V1 tercihi).
- V2 elendi: First Vienna — üç saatte olumsuz oran artışı **%3,49** (>%3); Go Ahead Eagles — üç saatte minimum para payı **%68,2** (<%70). İkisinde V1 devam ediyor.
- EARLY CORE Retention-55 korundu: Stuttgart için kaynakta minimum **%71,6**, Alavés için **%79,4** (tarihsel AS_OF'a kadar).
- EARLY T12: Bochum–Wolfsburg / Wolfsburg, Hvidovre–HB Køge / Hvidovre, Galway–St Patricks / St Patricks, Alavés–Málaga / Alavés.
- HEAVY 1X2, aynı V1 tercihini güçlendiren etiket: Go Ahead Eagles ve Alavés; ayrı seçim değildir.
- PREMIUM OVER (Dunkerque–Metz), STABLE OVER etiketini supersede eder; iki defa sayılmaz.
- SURPRISE oranı doğrudan takım galibiyet fiyatıdır, **kaybetmeme bahis fiyatı değildir**.
- Oran nedeniyle elenen: Shamrock Rovers – Sligo Rovers / EARLY T12; T-12 kaynağı **1,19**, karar anı **1,18**; genel minimum **1,30** sağlanmadı.

## Kapsam, eksikler ve provenance

- 91 maçın her biri makine okunur JSON'da `all_fixtures` altında fixture_uid, kickoff UTC, gerçek ufuk, piyasa mevcudiyeti ve SIGNAL/NO_SIGNAL/NO_SOURCE_SNAPSHOT durumuyla saklı.
- Kaynakta hiç piyasa snapshot'ı bulunmayan 7 maç:
  - 21:00 Everton U21 – Wolves U21 (`6e48fa05-9cc7-40eb-8821-beabea78deb8`)
  - 21:00 Fulham U21 – Brighton U21 (`caf00f5e-96c1-4c4e-86cc-377ee08e2aa5`)
  - 21:00 Man City U21 – Stoke U21 (`303ec29c-8c35-400f-9121-d9dd5f0fbd2a`)
  - 21:00 RFC de Liege U21 – Beerschot Wilrijk (Res) (`741048c7-cdf1-4501-b01b-ae2bfdd4af38`)
  - 21:30 Francs Borains U21 – RAAL U21 (`db9a6cc1-e60b-42cd-bfa7-3c74122fc468`)
  - 22:00 MC Alger – Enugu Rangers International (`721abedc-fcaa-4f69-9ca0-784a3034f051`)
  - 23:00 Raja Casablanca – El Kanemi Warriors (`fb1aec4f-b3d1-4937-88c9-85e4c5f97c7d`)

- Sinyal seçimlerinde 1X2, Üst 2.5, BTTS ve SURPRISE snapshot timestamp'i **2026-10-23T12:13:35Z**; karar kesimi **2026-10-23T12:16:30Z**. Diğer fixture/marketlerin gerçek gözlem zamanları JSON'da tutulur.
- Bu rapor anlık araştırma kesitidir; tam günün sekiz ham veri tablosunun aktarımı veya dokuz zamanlı konsantre arşiv **değildir**.
- Kaynak satır SHA-256'ları toplanmadı. GitHub commit ve blob SHA doğrulaması dosyanın kaydını doğrular, ham kaynak eşitliğini kanıtlamaz.
- Publication = `RECONSTRUCTED`, orijinal canlı yayım veya bahis işlemi iddiası yok. Sonuç/performans değerlendirmesi bu dosyada **yok**.

Makine okunur dosya: `archive/2026/10/23/01_scan_results/sxf-2026-10-23-dynamic-asof-151630-tr-retrospective-v1.json`
