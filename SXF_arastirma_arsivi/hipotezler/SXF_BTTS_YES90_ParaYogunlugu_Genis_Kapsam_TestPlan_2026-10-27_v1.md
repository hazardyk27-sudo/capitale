# SXF BTTS YES ≥90% para payı — araştırma tanım ve sağlamlık protokolü

**2026-10-27**. **Research-only**, SXF v0.4/live kriterleri DEĞİŞMEDİ. Kullanıcı: KG YES'e %90 para geldiğinde kaç maçta KG var olduğunu incele; ayrıca spesifik, birkaç örnekli %75 yanılsamasından kaçın.

## T-6 / evren
- 9–25 Ekim 2026; 16:00–24:00 TSİ kickoff. `research_archive.fixtures` tüm fikstür; aynı UID T-6 as-of için `public.moneyway_snapshots` BTTS `Y` ve `N` tam çift, en fazla 10 dakika eski, aynı snapshot zamanında geçerli odds, volume ve pay.
- `research_archive.results` FT; strict match_hash+home+away ve unique score. Her iki takım gol atınca KG VAR. Kaynakları SXF/Supabase only; gelecekteki karar anından sonraki bilgi alınmaz.
- Birincil, hiçbir ek filtre yok: `BTTS YES money share>=90.0%`. İkincil doğru kapsam kıyası %60/%70/%80/%95+. Kağıt üstü yüzdeler örneklem ortalaması.
- Para hacmi kırılımı: min £0 / £100 / £250 / £750 / £1500; payın %90 olması düşük hacimde yanıltabilir.
- Fiyat koşulları, sonuçları görmeden mantıken: BTTS YES SXF odds ≤1.60, ≤1.70, 1.60–1.90, >1.90, tüm odds. Odds'un marjdan arındırılmış ima ettiği olasılık yalnız piyasa beklentisidir.
- SXF crossmarket yalnız ayrı ikinci test: OU25 düşük OVER fiyatı piyasanın gol toplamı beklentisini ifade eder (≤1.60,≤1.80), 1X2 oranıyla dengeli HOME/AWAY güç farkı da ayrı betimlenir. Data missing bir mağlubiyet değildir.
- Günlük sayı / hit, first 8 days vs last 9 days, non-prespecified threshold fishing varsa açıklama, Wilson interval, ROI only actual executable bookmaker odds teyit edilirse.
- Sırf 10/12=83% gibi küçük bir subset çıkması **minimum 75%'lik gerçek prospectif motor kanıtı değildir**. Güçlü aday için n≥30-50 ve ileri tarihte önceden kayıtlı out-of-sample doğrulama beklenir.

Status: research definitions; no production change.
