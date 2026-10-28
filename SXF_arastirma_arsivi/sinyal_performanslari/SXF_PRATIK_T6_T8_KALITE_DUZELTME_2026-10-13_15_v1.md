# SXF — Pratik Arşiv ile T-6/T-8 Veri Kalitesi Düzeltme Denetimi (13–15 Ekim 2026)

> **Orijinal tahmin ve settlement dosyaları değiştirilmedi.** Burada kalite filtreli motor performansı orijinal rapora ek araştırma serisidir. 10 dakikalık tazelik filtresi resmen onaylanmış yeni motor kuralı değildir.

## Ne doğrulandı?

GitHub `archive/YYYY/MM/DD/05_pratik_arsiv/checkpoints.jsonl.gz` 34 noktalık arşivleri açıldı; 13 Ekim 192, 14 Ekim 152, 15 Ekim 160 fixture içeriyor. 11 sorunlu seçimin `fixture_uid`, T-6, T-8 durumu ve kaynak zamanları tek tek doğrulandı.

- **13 Ekim: 9 seçim** T-6 ve T-8 checkpoint'lerinde `MISSING`; özgün raporun T-6 diye kullandığı kaynak **782–947 dakika** eski. Gün içinde T-5/T-4 daha geç bazı kayıtlar görülebilir, ancak bunlar geçmiş T-6 taramasının yerine geçirilemez.
- **14 Ekim: 1 seçim**, Atletico el Vigia – Zamora FC → Atletico el Vigia SURPRISE; T-6 checkpoint'i mevcut, gerçek gözlem gecikmesi **18,13 dakika**. T-8 de mevcut. Tazelik uyarısıdır; 10 dakika resmî kanonik limit olmadığı için zorunlu yanlış sinyal olarak ilan edilmez.
- **15 Ekim: 1 seçim**, Sportivo Luqueño – Cerro Porteño → Cerro Porteño; T-6 ve T-8 `MISSING`, kaynak 6.400 dakika eski, skor zaten `UNVERIFIED`; farklı tarihli sonucun uygulanması yasaktır.

## Genel alternatif performans (SURPRISE = yenilmeme)

| Seri | Seçim | FT | Başarılı | Oran | Açıklama |
|---|---:|---:|---:|---:|---|
| Orijinal (korunuyor) | 506 | 505 | 331 | %65,5 | Tüm tarihsel seçimler |
| T-6/T-8 kanıtı olmayanlar ayrıldı | 496 | 496 | 328 | %66,1 | 10 seçim hariç, 14 Ekim uyarısı dahil |
| Sıkı 10 dakika duyarlılık filtresi | 495 | 495 | 328 | %66,3 | 11 seçim hariç, **deneysel** |

Bu tablonun genel isabeti SURPRISE yenilmeme ve doğrudan bahisleri birlikte saydığı için **tek bir bahis olasılığı değildir**. Kayıpların fazlaca dışarıda kalması geçmişe dönük filtre istatistiği yükseltebilir; ileriye dönük başarı ispatlanmamıştır.

## Motor bazında karşılaştırma

| Motor | Orijinal başarı | T-6/T-8 kanıt filtresi | Sıkı 10dk |
|---|---:|---:|---:|
| EARLY CORE | 61/89 (%68,5) | 61/87 (%70,1) | 61/87 (%70,1) |
| EARLY T12 | 111/174 (%63,8) | 111/170 (%65,3) | 111/170 (%65,3) |
| V1 | 122/193 (%63,2) | 122/191 (%63,9) | 122/191 (%63,9) |
| V2 | 93/149 (%62,4) | 93/149 (%62,4) | 93/149 (%62,4) |
| HEAVY | 49/69 (%71,0) | 49/68 (%72,1) | 49/68 (%72,1) |
| STABLE Üst 2.5 | 25/35 (%71,4) | 25/35 (%71,4) | 25/35 (%71,4) |
| PREMIUM Üst 2.5 | 26/35 (%74,3) | 26/35 (%74,3) | 26/35 (%74,3) |
| KG VAR | 32/46 (%69,6) | 32/46 (%69,6) | 32/46 (%69,6) |
| SURPRISE (yenilmeme) | 66/111 (%59,5) | 63/107 (%58,9) | 63/106 (%59,4) |

## Problemli seçimlerin kaydı

| Tarih | Maç → Seçim | Orijinal kaynak gecikmesi | Pratik T-6 | Pratik T-8 | FT / Sonuç |
|---|---|---:|---|---|---|
| 13 Eki | undefined → Poland (W) | 781,8 dk | MISSING | MISSING | 2-1 / NONLOSS_WIN |
| 13 Eki | undefined → Slavia Prague | 826,8 dk | MISSING | MISSING | 2-0 / LOSS |
| 13 Eki | undefined → Petrojet | 841,8 dk | MISSING | MISSING | 2-2 / NONLOSS_DRAW |
| 13 Eki | undefined → Fulham U21 | 901,8 dk | MISSING | MISSING | 3-2 / LOSS |
| 13 Eki | undefined → Fulham U21 | 901,8 dk | MISSING | MISSING | 3-2 / LOSS |
| 13 Eki | undefined → Bristol City | 946,8 dk | MISSING | MISSING | 0-1 / LOSS |
| 13 Eki | undefined → Burnley | 946,8 dk | MISSING | MISSING | 2-2 / LOSS |
| 13 Eki | undefined → Millwall | 946,8 dk | MISSING | MISSING | 0-1 / LOSS |
| 13 Eki | undefined → West Brom | 946,8 dk | MISSING | MISSING | 1-2 / NONLOSS_WIN |
| 14 Eki | undefined → Atletico el Vigia | 18,1 dk | Mevcut, 18,13 dk | Mevcut | 1-3 / LOSS |
| 15 Eki | undefined → Cerro Porteno | 6.400,2 dk | MISSING | MISSING | — / UNVERIFIED |

## Kaynak ve düzeltme politikası

- Kaynaklar: [13 Ekim Pratik manifest](../../archive/2026/10/13/05_pratik_arsiv/manifest.json), [14 Ekim Pratik manifest](../../archive/2026/10/14/05_pratik_arsiv/manifest.json), [15 Ekim Pratik manifest](../../archive/2026/10/15/05_pratik_arsiv/manifest.json). Bu göreli bağlantılar repo kökü üzerinden tekrar doğrulanmalıdır; ham JSON tam dosya yollarını içerir.
- Orijinal `sxf-research-*` ve `outcome-*` dosyalarına dokunulmadı. Önceden verilmiş motor isabetleri yeniden yazılmadı; ayrıştırılmış kalite serileri yeni sürümde tutuluyor.
- `10 dakika` kabul sınırı yalnızca alternatif denetim senaryosudur; tarihsel SXF v0.4 kanonik kuralı olarak kullanılmaz. T-5/T-4 verisi T-6 sinyalini geriye dönük onarmaz.
- Pratik arşiv kaynak `PARTIAL` olduğundan eski seçimler doğrulanamayanlar olarak işaretlenmiş; tüm geçmişte eksik veri bulunmadığı iddia edilmiyor.

