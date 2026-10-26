# CAPİTALE SXF Araştırma — 26 Ekim 2026

> **Tarihsel karar noktası yeniden oluşturması; 26 Ekim'de canlı yayımlanmış orijinal tarama değildir.** Karar sonrasındaki para/oran hareketleri ve maç sonuçları kullanılmadı.

**Saat:** 16:00–24:00 TSİ · **Karar:** her maçın kendi T-6, tam veri yoksa T-8 · **Mod:** `CHECKPOINT_RESEARCH_T6_FALLBACK_T8` · **SXF:** DRAFT v0.4
**Kaynak:** `public.fixtures` + salt-okunur `public.moneyway_snapshots`; `research_archive.moneyway_snapshots` bu gün için boş.
**Kapsam:** **87 maç · 64 tam piyasa verisi bulunan · 15 sinyalli maç · 18 farklı seçim · 23 motor etiketi**. 83 maçta herhangi bir ham kayıt, 4 maçta hiç ham kayıt yok.

## 1X2 — 8 seçim

| Saat · Maç → Seçim | Aktif motorlar | SXF oranı | Para % | Para £ | Karar |
|---|---|---:|---:|---:|---|
| 16:45 Neftchi Fargona – Al-Ittihad → **Al-Ittihad** | EARLY_T12, V1 | 1,83 | 89,5 | 4.515 | T-6 |
| 18:00 Lokomotiv Plovdiv – Slavia Sofia → **Lokomotiv Plovdiv** | V1 | 2,24 | 84,9 | 1.131 | T-6 |
| 19:00 Rizespor – Trabzonspor → **Trabzonspor** | EARLY_CORE, EARLY_T12 | 1,95 | 75,1 | 15.996 | T-6 |
| 20:00 Oppsal – Lyn 2 → **Oppsal** | V1 | 1,44 | 98,3 | 3.261 | T-6 |
| 21:00 ACS Sepsi OSK – Universitatea Craiova → **Universitatea Craiova** | V1, V2 | 1,54 | 85,5 | 1.037 | T-6 |
| 21:45 Santa Clara – Benfica → **Benfica** | EARLY_CORE, EARLY_T12 | 1,35 | 85,6 | 52.584 | T-6 |
| 22:30 Paris St-G – Lyon → **Paris St-G** | EARLY_CORE, EARLY_T12 | 1,38 | 80,3 | 341.066 | T-6 |
| 23:00 Sevilla – Osasuna → **Sevilla** | EARLY_CORE | 1,90 | 73,2 | 70.140 | T-6 |

## Üst 2.5 — 2 seçim

| Saat · Maç → Seçim | Aktif motorlar | SXF oranı | Para % | Para £ | Karar |
|---|---|---:|---:|---:|---|
| 21:45 Santa Clara – Benfica → **Üst 2.5** | PREMIUM_OVER_2_5 | 1,70 | 81,8 | 2.878 | T-6 |
| 22:30 Paris St-G – Lyon → **Üst 2.5** | STABLE_OVER_2_5 | 1,41 | 72,3 | 1.648 | T-6 |

## KG VAR / BTTS YES — 1 seçim

| Saat · Maç → Seçim | Aktif motorlar | SXF oranı | Para % | Para £ | Karar |
|---|---|---:|---:|---:|---|
| 22:30 Paris St-G – Lyon → **KG VAR** | BTTS_YES | 1,67 | 70,7 | 6.329 | T-6 |

## SURPRISE — yenilmeme riski — 7 seçim

| Saat · Maç → Risk tarafı | Motor | SXF takım galibiyet oranı | Para % | Para £ | Karar |
|---|---|---:|---:|---:|---|
| 16:00 Mladost Zdralovi – Jadran Luka Ploce → **Jadran Luka Ploce** | SURPRISE_TEAM | 3,20 | 62,1 | 69 | T-6 |
| 16:30 Sporting Ben Arous – AS Megrine → **AS Megrine** | SURPRISE_TEAM | 4,10 | 62,2 | 5 | T-6 |
| 18:00 Al Bukayriyah – Hajer Club → **Hajer Club** | SURPRISE_TEAM | 3,25 | 70,1 | 20 | T-6 |
| 18:30 SC Dimona – Hapoel Rishon Lezion → **SC Dimona** | SURPRISE_TEAM | 3,85 | 86,4 | 145 | T-6 |
| 19:00 Pirata FC – Union Comercio → **Pirata FC** | SURPRISE_TEAM | 3,20 | 52,4 | 15 | T-6 |
| 19:00 Nueva Chicago – San Martin de San Juan → **San Martin de San Juan** | SURPRISE_TEAM | 3,70 | 85,3 | 1.300 | T-6 |
| 20:00 Våg – Odd II → **Odd II** | SURPRISE_TEAM | 3,10 | 51,8 | 156 | T-6 |

> SURPRISE seçimi **takımın yenilmeme/direnç riski** anlamına gelir; tabloda verilen SXF oranı **1X2 takım galibiyeti fiyatıdır**, yenilmeme oranı değildir.

## Motor etiketlerinin dağılımı

| Motor | Etiket sayısı |
|---|---:|
| EARLY_CORE | 4 |
| EARLY_T12 | 4 |
| V1 | 4 |
| V2 | 1 |
| HEAVY | 0 |
| SURPRISE_TEAM | 7 |
| STABLE_OVER_2_5 | 1 |
| PREMIUM_OVER_2_5 | 1 |
| BTTS_YES | 1 |
| **Toplam** | **23** |

**Sayım:** Bir maçta birden fazla piyasa seçimi ve bir seçimde birden fazla motor etiketi olabilir. V2, V1'in kalite katmanıdır; PREMIUM, aynı Üst seçiminde STABLE'ın yerine geçer. Etiketler bağımsız maç sayısı değildir.

## CORE Retention-55 — mevcut tüm ham 1X2 gözlemleri

| Maç → taraf | İlk kaynak kökeni | Kaynak köken payı | En düşük gözlenen pay | İncelenen ham tick | Sonuç |
|---|---|---:|---:|---:|---|
| Santa Clara – Benfica → Benfica | T-24 | %86,9 | %82,8 | 329 | PASS |
| Sevilla – Osasuna → Sevilla | T-24 | %87,2 | %72,8 | 328 | PASS |
| Sevilla – Osasuna → Sevilla | T-40 | %93,0 | %72,8 | 616 | PASS |
| Rizespor – Trabzonspor → Trabzonspor | T-60 | %93,4 | %74,6 | 959 | PASS |
| Paris St-G – Lyon → Paris St-G | T-24 | %93,8 | %80,3 | 329 | PASS |
| Paris St-G – Lyon → Paris St-G | T-40 | %95,8 | %80,3 | 617 | PASS |
| Paris St-G – Lyon → Paris St-G | T-60 | %96,2 | %80,3 | 963 | PASS |
| Paris St-G – Lyon → Paris St-G | T-72 | %96,4 | %80,3 | 1166 | PASS |

**Denetim:** 8 geçerli CORE kökeni, 0 Retention-55 kırılması. Çoklu kökenler aynı maç/taraf için tek EARLY_CORE etiketine indirgenmiştir. Yalnız mevcut ham gözlem geçmişi doğrulanabilir; yukarı akışta hiç yakalanmamış tick olmadığı garanti edilmez.

## V2 — önceki üç saatlik ham kalite kontrolü

| Maç → V1 tarafı | 3s minimum para payı | Maks. olumsuz oran artışı | Pencere tick | V2 |
|---|---:|---:|---:|---|
| Neftchi Fargona – Al-Ittihad → Al-Ittihad | %89,4 | %3,95 | 55 | **FAIL** |
| Lokomotiv Plovdiv – Slavia Sofia → Lokomotiv Plovdiv | %35,7 | %4,67 | 55 | **FAIL** |
| ACS Sepsi OSK – Universitatea Craiova → Universitatea Craiova | %76,1 | %1,28 | 54 | **PASS** |
| Oppsal – Lyn 2 → Oppsal | %98,2 | %5,11 | 55 | **FAIL** |

V2 için V1 şartları, başlangıç anchor'ı, ham üç saatlik tick'ler, en düşük pay **≥%70** ve zamana göre olumsuz fiyat artışı **≤%3** birlikte değerlendirildi. **4 V1 adayı → 1 V2 onayı**. Kısmi 1X2 tick'i veya eksik anchor olsaydı kalite doğrulaması verilmezdi.

## Kaynak kapsamı ve T-8 fallback

| Piyasa | T-6 tam | T-8 tam | Kararda tam | T-8 fallback |
|---|---:|---:|---:|---:|
| 1X2 | 62 | 52 | 62 | 0 |
| OU25 | 34 | 26 | 34 | 0 |
| BTTS | 28 | 22 | 28 | 0 |

**23 maçın hiçbir piyasasında tam seçim seti yok:** 19 maçta yalnız eksik/kısmi kayıt, 4 maçta hiç ham kayıt yok. Kısmi markette eksik tarafı sıfır varsayarak sinyal üretilmedi.

- 16:00 Gamo Chencha – Ethiopia Nigd Bank — hiç ham veri yok; 1X2 0/3, OU25 0/2, BTTS 0/2.
- 16:00 Swansea U21 – Charlton U21 — kısmi piyasa; 1X2 1/3, OU25 0/2, BTTS 0/2.
- 16:30 AS Solimane – CS Chebba — kısmi piyasa; 1X2 1/3, OU25 0/2, BTTS 0/2.
- 16:30 EM Mahdia – US Tataouine — hiç ham veri yok; 1X2 0/3, OU25 0/2, BTTS 0/2.
- 16:30 ES Bouchamma – Kalaa Sport — kısmi piyasa; 1X2 1/3, OU25 0/2, BTTS 0/2.
- 16:30 SC Landskron – FC Nussdorf — hiç ham veri yok; 1X2 0/3, OU25 0/2, BTTS 0/2.
- 17:00 CA Penarol (Res) – Montevideo Wanderers (Res) — kısmi piyasa; 1X2 2/3, OU25 0/2, BTTS 0/2.
- 17:00 Mohun Bagan Super Giants – Chennaiyin FC — kısmi piyasa; 1X2 2/3, OU25 1/2, BTTS 1/2.
- 17:00 Oriental (Res) – Boston River (Res) — kısmi piyasa; 1X2 1/3, OU25 0/2, BTTS 0/2.
- 17:00 Sheff Utd U21 – Fleetwood Town U21 — kısmi piyasa; 1X2 2/3, OU25 0/2, BTTS 0/2.
- 18:00 FC Iberia 1999 – Torpedo Kutaisi — kısmi piyasa; 1X2 2/3, OU25 1/2, BTTS 1/2.
- 18:00 MS Kfar Kasem – Beitar Petah Tikva — kısmi piyasa; 1X2 2/3, OU25 1/2, BTTS 0/2.
- 18:00 Welayta Dicha – Halaba Ketema — kısmi piyasa; 1X2 1/3, OU25 0/2, BTTS 0/2.
- 19:00 Busaiteen Club – Buri FC — hiç ham veri yok; 1X2 0/3, OU25 0/2, BTTS 0/2.
- 20:00 Racing CM (Res) – Juventud Piedras (Res) — kısmi piyasa; 1X2 2/3, OU25 0/2, BTTS 0/2.
- 21:00 Atl River Plate (Res) – Liverpool Montevideo (Res) — kısmi piyasa; 1X2 1/3, OU25 0/2, BTTS 0/2.
- 21:00 Maldonado (Res) – Defensor Sporting (Res) — kısmi piyasa; 1X2 1/3, OU25 0/2, BTTS 0/2.
- 21:00 Montevideo (Res) – Progreso (Res) — kısmi piyasa; 1X2 1/3, OU25 0/2, BTTS 0/2.
- 21:00 Valerenga II – KFUM Oslo Fotball II — kısmi piyasa; 1X2 2/3, OU25 0/2, BTTS 0/2.
- 22:00 Crystal Palace U21 – Southampton U21 — kısmi piyasa; 1X2 2/3, OU25 1/2, BTTS 0/2.
- 22:00 Derby U21 – Norwich U21 — kısmi piyasa; 1X2 2/3, OU25 0/2, BTTS 1/2.
- 22:30 Crotone – S.S.D. Casarano Calcio — kısmi piyasa; 1X2 2/3, OU25 0/2, BTTS 0/2.
- 23:00 Sp. San Lorenzo (Res) – Cerro Porteno (Res) — kısmi piyasa; 1X2 1/3, OU25 0/2, BTTS 1/2.

## Veri bütünlüğü ve yöntem notları

- **Güncel envanter:** Bu salt-okunur çalıştırmada **87** fikstür görüldü. 26 Ekim 03:03 TSİ'deki erken durum belgesindeki **66** sayı daha eski envanterdir; sıfır sinyal olarak yorumlanamaz.
- **T-6/T-8:** Her fikstür için kickoff'tan ayrı ayrı çıkarıldı. Tam T-6 piyasası yoksa T-8'in tamlığı kontrol edildi; T-8'den ek tam piyasa gelmedi. Gelecek gözlem kullanılmadı.
- **Kısmi kayıt:** 1X2'de 21, OU25'te 18, BTTS'de 14 fikstürün en son T-6 gözleminde eksik seçim tarafları var. Bunlar tam piyasa diye etiketlenmedi; veri yokluğu başarı/başarısızlık anlamına gelmez.
- **Retention:** T-72/60/40/24 kökenleri top-money takım/£ eşiğiyle doğrulandı. Kaynak kökeninden T-6'ya kadar gözlenen ham 1X2 tick'lerinde %55 altı kontrol edildi. T-12 Retention-55 kökeni değildir.
- **V2:** V1 için üç saatlik ham 1X2 dizisi, anchor, pay tabanı ve kronolojik olumsuz oran artışı incelendi; V2 bağımsız ikinci yön sinyali değildir.
- **1,30 global SXF yayın alt sınırı:** 0 tetik dışarıda bırakıldı; varsa tümü JSON'daki `quality_audit.global_odds_floor_exclusions` bölümünde tutulur.
- **Veri kaynağı:** 26 Ekim için araştırma arşivi snapshot tablosunda uygun ham satır bulunmadığından `public.moneyway_snapshots` kullanıldı. Bu kaynağın bütün gerçek SXF tick'lerini eksiksiz topladığı bağımsız doğrulanmış değildir.
- **SXF oranı:** Bahis şirketinde gerçekten alınabilecek oran değildir. Takım formu, haber, Polymarket, diğer departmanlar, FT skorları ve maç sonuçları bu taramada kullanılmadı.
- **Mod:** Tarihsel `CHECKPOINT_RESEARCH_T6_FALLBACK_T8`; canlı `DYNAMIC_AS_OF_V04` taraması olduğu iddia edilmez. Üst 2.5 için geçmişte keşfedilen C1/C2/C3 gölge filtreleri uygulanmadı; v0.4 eşikleri değiştirilmedi.

## Kanıt dosyaları

- [Tüm 87 fikstürün checkpoint kaynak kanıtları](sxf-research-2026-10-26-source-checkpoints-v1.json)
- [Retention ve V2 ham gözlem denetimi](sxf-research-2026-10-26-quality-audit-v1.json)
- [Bu günün tüm fikstür/seçim JSON'u](sxf-research-2026-10-26-t6-fallback-t8-16to24-v1.json)

**Rapor/JSON, 26 Ekim T-6 karar anlarını sonradan yeniden oluşturur; orijinal canlı tahmin arşivi değildir.**
