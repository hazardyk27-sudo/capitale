# CAPİTALE SXF — 22 Ekim 2026 · T-6 / T-8 checkpoint taraması

> **Kullanıcının daha önce maç öncesinde gördüğü taramanın arşiv kopyasıdır.** GitHub'a ilk kez şimdi yazılıyor. `publication_state=RECONSTRUCTED`; AS_OF anında GitHub'da özgün donmuş run bulunmadığı için otomatik üretim/gerçek zamanlı arşivleme olarak sunulmaz. **Maç sonucu kullanılmadı.**

## Tarama kimliği ve yöntem

- Run: `sxf-2026-10-22-checkpoint-t6-fallback-t8-asof-151630-tr-v1`; scan: `scan-20261022-151630-tr-t6t8-v1`
- Maç tarihi: **22 Ekim 2026**; saat aralığı **19:30–23:00 TSİ**; rapor AS_OF **15:16:30 TSİ (12:16:30 UTC)**.
- Tarama modu: **CHECKPOINT_RESEARCH_T6_FALLBACK_T8**; motor kuralları **SXF v0.4 DRAFT**.
- Maçın T-6 zamanı geçmişse o anda veya öncesindeki son snapshot, değilse T-8 son snapshot kullanıldı. EARLY motorlarında T-72/T-60/T-40/T-24/T-12 kökeni ayrı; CORE için Retention 55 kontrol edildi.
- Yalnızca Supabase'deki SmartXFlow tabloları **SELECT-only** okundu. Kalıcı çıktı yalnızca CAPİTALE GitHub'dadır.
- **47 maç** (T-6 **21**, T-8 **26**); **28** farklı sinyalli maç; **30** farklı piyasa seçimi; **19** sinyalsiz maç; **72** etkin motor etiketi.
- Para tutarları burada **kullanıcıya sunulduğu gibi tam pounda yuvarlanmış** gösterilir; JSON'da checkpoint kaynak hassasiyeti saklıdır.

## Sinyal tabloları — orijinal yayımlanan tercihler

### 1X2 — 19 seçim

| Saat / maç | Tercih | Etkin motorlar | Checkpoint | SXF oranı | Para payı | Seçim parası (£) | Önemli not |
|---|---|---|---|---:|---:|---:|---|
| 19:45 Ararat Armenia – Az Alkmaar | **Az Alkmaar** | EARLY_T12, V1, V2, HEAVY | T-6 | 1,43 | %83,0 | 17.415 | T-6; EARLY T12 kökeni ve V2 üç saat kontrolü |
| 19:45 Dinamo Zagreb – NEC Nijmegen | **Dinamo Zagreb** | EARLY_T12, V1, V2, HEAVY | T-6 | 1,53 | %89,2 | 55.554 | CORE başlangıcı geçmiş kayıtlar açısından ayrıca doğrulanamadığı için etiketlenmedi |
| 19:45 FK Kauno Zalgiris – Brann | **Brann** | EARLY_T12, V1, V2 | T-6 | 1,79 | %87,6 | 5.956 | T-6; V2 koşulları sağlandı |
| 19:45 Getafe – Lugano | **Getafe** | EARLY_T12, V1, V2 | T-6 | 2,04 | %81,6 | 8.701 | T-6; para payı %80 sınırına yakın |
| 19:45 Inter Club Escaldes – Universitatea Craiova | **Universitatea Craiova** | EARLY_T12, V1, V2 | T-6 | 1,62 | %93,2 | 7.891 | T-6; güçlü para payı |
| 19:45 Juventus – Rennes | **Juventus** | EARLY_CORE, EARLY_T12, V1, V2, HEAVY | T-6 | 1,47 | %86,3 | 78.987 | CORE T-60, Retention-55 korundu; V2 oran hareketi uygun |
| 19:45 Lech Poznan – Sunderland | **Sunderland** | EARLY_CORE, EARLY_T12 | T-6 | 1,78 | %78,1 | 56.791 | CORE T-72; T-6 payı %80 altında olduğundan V1 yok |
| 19:45 Pafos FC – FK Riga | **Pafos FC** | V1, V2 | T-6 | 1,64 | %87,9 | 1.973 | T-6; V2 uygun |
| 19:45 Trabzonspor – Hearts | **Trabzonspor** | EARLY_T12 | T-6 | 1,31 | %93,1 | 23.335 | T-6 fiyatı 1.31; global 1.30 eşiğini geçti; konsantrasyon oran aralığında değil |
| 19:45 Union St Gilloise – Hapoel Be'er Sheva | **Union St Gilloise** | EARLY_T12, V1, V2, HEAVY | T-6 | 1,40 | %85,6 | 68.246 | T-6; HEAVY para eşiği geçildi |
| 22:00 AGF – Egnatia Rrogozhine | **AGF** | V1, V2 | T-8 | 1,52 | %97,4 | 2.517 | T-8; yüksek para yüzdesi |
| 22:00 Ajax – Atalanta | **Ajax** | EARLY_CORE, EARLY_T12, V1, HEAVY | T-8 | 2,20 | %83,8 | 37.869 | T-8; V2 elendi, önceki üç saatte olumsuz fiyat hareketi %4.76 |
| 22:00 Borac Banja Luka – KuPS | **Borac Banja Luka** | EARLY_T12, V1, V2 | T-8 | 1,86 | %90,1 | 3.092 | T-8; V2 koşulları uygun |
| 22:00 Hoffenheim – Lyon | **Hoffenheim** | EARLY_CORE, EARLY_T12, V1, V2, HEAVY | T-8 | 2,14 | %83,4 | 121.617 | CORE T-72, Retention-55 korundu; £121,617 kaynak parası; daha yüksek galibiyet fiyatı |
| 22:00 Lillestrom – Real Sociedad | **Real Sociedad** | EARLY_T12, V1, V2, HEAVY | T-8 | 1,50 | %91,2 | 21.771 | T-8; güçlü para payı |
| 22:00 Midtjylland – Sint Truiden | **Midtjylland** | V1 | T-8 | 1,78 | %82,3 | 5.690 | T-8; V2 elendi, önceki üç saatte olumsuz fiyat hareketi %4.65 |
| 22:00 NK Celje – Red Bull Salzburg | **Red Bull Salzburg** | EARLY_CORE, EARLY_T12, V1, V2, HEAVY | T-8 | 1,57 | %84,3 | 37.407 | CORE T-72, Retention-55 korundu |
| 22:00 Olympiakos – Sparta Prague | **Olympiakos** | EARLY_CORE, EARLY_T12, V1, V2, HEAVY | T-8 | 1,55 | %89,0 | 34.948 | CORE T-60, Retention-55 korundu |
| 22:00 Omonia – Benfica | **Benfica** | EARLY_T12 | T-8 | 1,36 | %94,6 | 32.733 | T-8; V1'in minimum 1.40 oran koşulu sağlanmadı |

### Üst 2.5 — 4 seçim

| Saat / maç | Tercih | Etkin motorlar | Checkpoint | SXF oranı | Para payı | Seçim parası (£) | Önemli not |
|---|---|---|---|---:|---:|---:|---|
| 19:45 FK Jablonec – Brighton | **Üst 2.5** | STABLE_OVER_2_5 | T-6 | 1,46 | %77,9 | 1.547 | T-6; STABLE eşiğini geçti, PREMIUM para eşiği altında |
| 22:00 Besiktas – Crystal Palace | **Üst 2.5** | STABLE_OVER_2_5 | T-8 | 1,54 | %75,4 | 2.301 | T-8; PREMIUM £2,500 eşiği sağlanmadı |
| 22:00 Hoffenheim – Lyon | **Üst 2.5** | PREMIUM_OVER_2_5 | T-8 | 1,50 | %82,8 | 3.060 | T-8; PREMIUM, STABLE etiketini supersede eder |
| 22:00 Lillestrom – Real Sociedad | **Üst 2.5** | PREMIUM_OVER_2_5 | T-8 | 1,53 | %85,8 | 7.699 | T-8; PREMIUM, STABLE etiketini supersede eder |

### KG VAR / BTTS YES — 3 seçim

| Saat / maç | Tercih | Etkin motorlar | Checkpoint | SXF oranı | Para payı | Seçim parası (£) | Önemli not |
|---|---|---|---|---:|---:|---:|---|
| 19:45 OFI – Leverkusen | **KG VAR** | BTTS_YES | T-6 | 1,90 | %70,0 | 3.116 | T-6; BTTS oran aralığının üst sınırında |
| 19:45 Sturm Graz – Marseille | **KG VAR** | BTTS_YES | T-6 | 1,67 | %91,4 | 2.362 | T-6; yüksek para yüzdesi |
| 22:00 Plzen – PFC Levski Sofia | **KG VAR** | BTTS_YES | T-8 | 1,79 | %89,2 | 3.227 | T-8; yüksek para yüzdesi |

### SURPRISE (kaybetmeme riski) — 4 seçim

| Saat / maç | Tercih | Etkin motorlar | Checkpoint | SXF oranı | Para payı | Seçim parası (£) | Önemli not |
|---|---|---|---|---:|---:|---:|---|
| 19:45 Al Gharafa – Al Ahli (QAT) | **Al Ahli (QAT) kaybetmez (risk)** | SURPRISE_TEAM | T-6 | 3,85 | %51,7 | 61 | T-6; çok düşük mutlak para; doğrudan galibiyet değil, kaybetmeme riski |
| 19:45 Crvena Zvezda – FC Copenhagen | **FC Copenhagen kaybetmez (risk)** | SURPRISE_TEAM | T-6 | 3,15 | %68,3 | 9.591 | T-6; yüksek para yoğunluğu; doğrudan galibiyet değil, kaybetmeme riski |
| 20:15 Hapoel Herzliya – Hapoel Azor | **Hapoel Azor kaybetmez (risk)** | SURPRISE_TEAM | T-6 | 2,94 | %67,8 | 26 | T-6; çok düşük mutlak para; doğrudan galibiyet değil, kaybetmeme riski |
| 23:00 Libertad Limpeno (W) – Nacional de Football (W) | **Nacional de Football (W) kaybetmez (risk)** | SURPRISE_TEAM | T-8 | 3,40 | %75,9 | 26 | T-8; çok düşük mutlak para; doğrudan galibiyet değil, kaybetmeme riski |

## Motor etiketi sayıları (mükerrer seçim toplamına eklenmez)

| Motor | Etiket |
|---|---:|
| EARLY_CORE | 6 |
| EARLY_T12 | 16 |
| V1 | 16 |
| V2 | 14 |
| HEAVY | 9 |
| STABLE_OVER_2_5 | 2 |
| PREMIUM_OVER_2_5 | 2 |
| BTTS_YES | 3 |
| SURPRISE_TEAM | 4 |
| **Toplam (seçim değil)** | **72** |

## Daha önce sunulan en güçlü 5 SXF tercihi

| Sıra | Tercih | Referans | SXF oranı | Pay | Para (£) | Gerekçe |
|---:|---|---|---:|---:|---:|---|
| 1 | **Juventus** (Juventus – Rennes) | T-6 | 1,47 | %86,3 | 78.987 | CORE T-60 + T12 + V1 + V2 + HEAVY; retention korundu, V2 uygun |
| 2 | **Olympiakos** (Olympiakos – Sparta Prague) | T-8 | 1,55 | %89,0 | 34.948 | CORE T-60 + T12 + V1 + V2 + HEAVY; %89 para payı |
| 3 | **Red Bull Salzburg** (NK Celje – Red Bull Salzburg) | T-8 | 1,57 | %84,3 | 37.407 | Salzburg tarafında CORE T-72 + T12 + V1 + V2 + HEAVY; erken para korundu |
| 4 | **Hoffenheim** (Hoffenheim – Lyon) | T-8 | 2,14 | %83,4 | 121.617 | CORE T-72 + T12 + V1 + V2 + HEAVY; yüksek para tutarı, 2.14 oranlı direkt galibiyet daha riskli |
| 5 | **Union St Gilloise** (Union St Gilloise – Hapoel Be'er Sheva) | T-6 | 1,40 | %85,6 | 68.246 | T12 + V1 + V2 + HEAVY; CORE yok, güçlü para tutarı |

Bu sıralama yalnızca **SXF motor kanıtlarına dayalı göreli önceliktir**, kesinlik veya kalibre edilmiş olasılık değildir. **SURPRISE** motoru doğrudan 1X2 galibiyet değil **kaybetmeme riski** ölçer.

## 47 maçlık kapsam denetimi — sinyal üretmeyenler

19 maç, tarama dışında bırakılmamış; sıfır sinyal durumu JSON'da `all_fixtures` dizisinde korunmuştur.

| Saat | Maç | Referans | 1X2 / OU25 / BTTS kaynak snapshot |
|---|---|---|---|
| 19:45 | FC Iberia 1999 – Mjallby | T-6 | 3/3 kayıt |
| 19:45 | FC Nordsjaelland – CSKA Sofia | T-6 | 3/3 kayıt |
| 19:45 | Ferencvaros – Torreense | T-6 | 3/3 kayıt |
| 20:00 | MS Tira – Hapoel Tirat HaCarmel | T-6 | 3/3 kayıt |
| 21:00 | Al Ahli – Al-Khaleej Saihat | T-6 | 3/3 kayıt |
| 21:30 | CD Cuenca Juniors – Atletico Rojiblanco | T-8 | 3/3 kayıt |
| 21:30 | Paola Hibernians FC – Gzira United FC | T-8 | 3/3 kayıt |
| 21:30 | San Antonio FC – Club Nueve de Octubre | T-8 | 3/3 kayıt |
| 21:30 | Vinotinto Ecuador – Independiente Juniors | T-8 | 3/3 kayıt |
| 22:00 | Bournemouth – AC Milan | T-8 | 3/3 kayıt |
| 22:00 | Braga – Gent | T-8 | 3/3 kayıt |
| 22:00 | Celtic – Celta Vigo | T-8 | 3/3 kayıt |
| 22:00 | Jagiellonia Bialystock – Anderlecht | T-8 | 3/3 kayıt |
| 22:00 | Lincoln Red Imps – FC Twente | T-8 | 3/3 kayıt |
| 22:00 | Metropolitanos – Academia Anzoategui FC | T-8 | 3/3 kayıt |
| 22:00 | Monaco – Freiburg | T-8 | 3/3 kayıt |
| 22:00 | Thun – Hajduk Split | T-8 | 3/3 kayıt |
| 23:00 | Cumbaya FC – El Nacional | T-8 | 3/3 kayıt |
| 23:00 | Universidad de Chile (W) – Deportivo Cali (W) | T-8 | 3/3 kayıt |

## Durum ve veri kalitesi

- 30 seçimin her biri `fixture_uid`, kickoff UTC, market, taraf, oran, para yüzdesi, pound tutarı, AS_OF, T-6/T-8 kaynak cutoff'u ve gerçek kaynak snapshot zamanı ile JSON'da eşleştirilmiştir.
- EARLY kayıtları bazı durumlarda ilgili checkpoint'ten **sonra event olarak kaydedildi**. Köken snapshot'ları daha eski olsa da bu durum otomatik canlı kararın o saatte yayımlandığını doğrulamaz.
- V2'nin üç saatlik kontrolü ilk raporda yapıldı; arşivleme sırasında yeni bir tahmin veya ileri tarihli gözlem ile geriye dönük etiket değiştirilmedi.
- Global SXF oran eşiği 1,30'dur; motorların kendi fiyat sınırları ayrıca geçerlidir. Önceki rapor tüm dışlanan olayların tam denetim sayısını vermediğinden bu alan bilinmiyor; sıfır iddia edilmez.
- Verisi tam olmayan bazı kaynak alanları mevcuttur. T-6/T-8 checkpoint incelemesi, dokuz referans noktasının tümünü içeren bir `04_concentrated` arşivi değildir.
- Kaynak orijinal snapshot SHA-256 hash'leri çıkarılmadı. JSON ve Markdown dosyaları GitHub'dan okunarak doğrulanmalıdır.
- **02 sonuç/performans, 03 tam ham snapshot release ve 04 tüm maç/tüm checkpoint grid** bu kayıtla oluşmuş değildir; durumları günlük manifestte açıkça ayrılır.

Oluşturulma (UTC): 2026-10-22T13:12:43.394Z
JSON: `archive/2026/10/22/01_scan_results/sxf-2026-10-22-checkpoint-t6-fallback-t8-asof-151630-tr-v1.json`
