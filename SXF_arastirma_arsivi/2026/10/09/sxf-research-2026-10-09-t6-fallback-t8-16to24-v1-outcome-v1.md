# CAPİTALE SXF — 09 Ekim 2026 Sinyal Sonuçları ve Motor İstatistikleri

> Orijinal **09 Ekim** tarama dosyasını değiştirmeyen, ayrı sonuçlandırma raporudur. 90 dakika sonuçları esas alınır.

**Tarama:** `sxf-research-2026-10-09-t6-fallback-t8-16to24-v1` · **Seçim:** 24 · **Sonuçlanan:** 24 · **Doğrulanamayan:** 0

## Motor performansı

| Motor | Başarılı / sonuçlanan | Başarı | Ort. SXF oranı |
|---|---:|---:|---:|
| CORE | 0/2 | %0,0 | 1,45 |
| T12 | 1/4 | %25,0 | 1,64 |
| V1 | 8/10 | %80,0 | 1,72 |
| V2 | 6/7 | %85,7 | 1,64 |
| HEAVY | 0/1 | %0,0 | 1,51 |
| STABLE OVER | 1/2 | %50,0 | 1,42 |
| PREMIUM OVER | 1/3 | %33,3 | 1,54 |
| BTTS YES | 3/3 | %100,0 | 1,75 |
| SURPRISE | 3/4 | %75,0 | 3,36 |

**SURPRISE:** Başarı, takımın kazanması **veya berabere kalması**dır. Buradaki oran takımın doğrudan galibiyet SXF fiyatıdır. V2/HEAVY/V1 ve CORE/T12 aynı seçime ait örtüşen etiketler olabilir.

## Maç maç sinyal sonuçları

| Saat / Maç | Piyasa / tercih | Motorlar | SXF oranı | 90 dk skor | Sonuç |
|---|---|---|---:|---|---|
| 17:30 FC Yantra – Vihren Sandanski | SURPRISE → FC Yantra | SURPRISE_TEAM | 3,30 | 1-0 | ✅ Yenilmedi (kazandı) |
| 17:55 Al-Fateh (KSA) – Al Ahli | Al Ahli | V1, V2 | 1,48 | 0-4 | ✅ Kazandı |
| 18:00 Slavia Praha B – FC Sellier & Bellot Vlasim | SURPRISE → FC Sellier & Bellot Vlasim | SURPRISE_TEAM | 2,92 | 0-2 | ✅ Yenilmedi (kazandı) |
| 18:30 Finland (W) – Serbia (W) | Finland (W) | V1, V2 | 1,57 | 3-1 | ✅ Kazandı |
| 19:00 Turkey (W) – Slovenia (W) | SURPRISE → Turkey (W) | SURPRISE_TEAM | 3,25 | 3-3 | ✅ Yenilmedi (berabere) |
| 19:30 FC Heidenheim – Kaiserslautern | FC Heidenheim | EARLY_T12 | 1,96 | 0-0 | ❌ Kaybetti |
| 20:00 Brann – Viking | Üst 2.5 | STABLE_OVER_2_5 | 1,42 | 0-2 | ❌ Kaybetti |
| 20:00 IFK Goteborg – Vasteras SK | Üst 2.5 | PREMIUM_OVER_2_5 | 1,59 | 1-0 | ❌ Kaybetti |
| 21:00 ACS Sepsi OSK – Dinamo Bucharest | Dinamo Bucharest | EARLY_T12, V1 | 1,68 | 0-2 | ✅ Kazandı |
| 21:00 Al Nassr – Al Draih | Al Nassr | V1, V2 | 1,40 | 3-0 | ✅ Kazandı |
| 21:00 Almere City – FC Eindhoven | Almere City | V1, V2 | 1,44 | 3-0 | ✅ Kazandı |
| 21:00 Nancy – Guingamp | SURPRISE → Guingamp | SURPRISE_TEAM | 3,95 | 1-0 | ❌ Kaybetti |
| 21:15 Belgium (W) – Poland (W) | Belgium (W) | V1, V2 | 1,97 | 1-0 | ✅ Kazandı |
| 21:30 Dortmund – Werder Bremen | Dortmund | EARLY_CORE, EARLY_T12 | 1,39 | 2-2 | ❌ Kaybetti |
| 21:30 Dortmund – Werder Bremen | KG VAR | BTTS_YES | 1,67 | 2-2 | ✅ Kazandı |
| 21:30 Dortmund – Werder Bremen | Üst 2.5 | STABLE_OVER_2_5 | 1,41 | 2-2 | ✅ Kazandı |
| 21:30 First Vienna Fc 1894 – St Polten | First Vienna Fc 1894 | V1, V2 | 2,08 | 3-1 | ✅ Kazandı |
| 21:30 Rakow Czestochowa – GKS Katowice | Rakow Czestochowa | V1 | 2,30 | 1-4 | ❌ Kaybetti |
| 21:45 Shelbourne – Sligo Rovers | Üst 2.5 | PREMIUM_OVER_2_5 | 1,47 | 5-1 | ✅ Kazandı |
| 21:45 Sutton Utd – Boreham Wood | Boreham Wood | V1 | 1,79 | 0-2 | ✅ Kazandı |
| 22:00 West Ham – QPR | West Ham | EARLY_CORE, EARLY_T12, V1, V2, HEAVY | 1,51 | 1-1 | ❌ Kaybetti |
| 22:00 West Ham – QPR | KG VAR | BTTS_YES | 1,74 | 1-1 | ✅ Kazandı |
| 22:00 West Ham – QPR | Üst 2.5 | PREMIUM_OVER_2_5 | 1,57 | 1-1 | ❌ Kaybetti |
| 22:15 Braga – Sporting Lisbon | KG VAR | BTTS_YES | 1,84 | 1-3 | ✅ Kazandı |

## Kaynak denetimi

- SXF `research_archive.results` ve `public.live_fixtures` sonuçları maç kimliği ve iki takım adıyla eşleştirildi; bitiş statüsü, normal süre skoru ve çelişki kontrolü yapıldı.
- Bağımsız web doğrulaması bulunan maçların bağlantıları ilgili JSON satırına eklendi. **SXF'deki FT, bağımsız olarak ayrıca doğrulanmamışsa yalnız SXF FT olarak etiketlenir**.
- Maç sonucu ve seçim sonucu alanları, orijinal sinyal JSON dosyasına eklenmedi; tarihsel karar korunuyor.

**Ayrıntılı yapılandırılmış sonuçlar:** `sxf-research-2026-10-09-t6-fallback-t8-16to24-v1-outcome-v1.json`.
