# BTTS YES — Ekol genişleme / önce mekanizma, sonra sonuç (EXPLORATORY FREEZE)

**Tarih:** 2026-10-27. **Durum:** Araştırma kural tanımı, tüm-maç-evreni sonuçları sorgulanmadan önce dondurulmuştur. Önceki BTTS 41 maç ve çapraz teyit 13/14 sonuçları zaten bilinmektedir; tarihsel veriler tam kör holdout değildir. Elde edilen iyi sonuç üretim kanıtı DEĞİLDİR.

## Sabit mantık
BTTS YES yalnız para payı %60 eşiğine ulaşan 41 adayla sınırlanırsa, iki piyasanın fiyat teyidi 14 maça iner. **Daha çok sinyal için fiyat-kabul mekanizmasını koruyup mevcut giriş evrenini genişletmek** gerekir. Artan miktar ve seçilen YES fiyatı üzerinden 4 mekanik/geometrik aday önceden tanımlanır.

### Önce tüm maçlar
- 9–25 Ekim 2026 takvim günleri ve 16:00–24:00 TSİ kickoff penceresi içinde `research_archive.fixtures` her benzersiz fixture (orijinal SCAN `all_fixtures` evreniyle tutarlılık), yalnız gerçek karar **kickoff−6h**.
- Aynı fixture'nin yalnız iki piyasa Y/N BTTS ve O/U OU25, T-8 ve T-6 hedefinden **önce** son snapshot <=10 dakika yaşında; her piyasa iki taraflı tam ve (varsa) aynı kaynak zaman damgası; T-6 selected BET fiyatı ve para payı as-of veriyle. Yalnız `public.moneyway_snapshots` SXF, başka departman veri yok.
- FT score settlement yalnız sonuç değerlendirmek için (fit to result yok); matching fixture UID preferred, `match_id_hash` + home/away + kickoff safeguard. Duplicates, suspicious or inconsistent score = UNVERIFIED ve isabet hesaplarından ayrılır.
- Fiyat de-vig: `p_B = (1/BTTS_yes_odds) / [(1/YES)+(1/NO)]`, `p_O = (1/OVER_odds)/[(1/OVER)+(1/UNDER)]`, **`p_B(T-6)>=p_B(T-8)` AND `p_O(T-6)>=p_O(T-8)`**. Bunlar iki bağımsız bilgi kaynağı değil, gözlenen aynı maç fiyat tutarlılığı.
- Güvenlik: her market iki seçimli, pozitif para ve decimal odds >1.0. BTTS YES para monoton check fiyat teyit kuralı için *gerekli değil*; reset/mismatch PRICE_ONLY market için karar fiyatlarını bozmadıkça yeni para mekanizması sayılmaz.
- Zamanlama: **T-6 kararı**, T-5 ve sonrası yok. Her gün 0 sinyal çıkabilir.

### Geçmiş sonuçlara göre seçilmemiş adaylar
| İsim | BTTS T-6 YES odds | BTTS T-6 YES money | BTTS T-6 YES money share | Fiyat mekanizması |
|---|---|---|---|---|
| BASE_CANONICAL | 1.60–1.90 | >=£750 | >=60% | fiyat teyidi yok (güncel motorla referans) |
| DUAL_CANONICAL | 1.60–1.90 | >=£750 | >=60% | iki p yükseliyor/sabit |
| **DUAL_MAJORITY** | 1.60–1.90 | >=£750 | >=50% | iki p yükseliyor/sabit |
| **DUAL_LOW_VOLUME** | 1.60–1.90 | >=£250 | >=50% | iki p yükseliyor/sabit |
| **DUAL_WIDE_ODDS** | 1.50–2.00 | >=£750 | >=50% | iki p yükseliyor/sabit |
| **BTTS_PRICE_MAJORITY** | 1.60–1.90 | >=£750 | >=50% | sadece p_B yükseliyor/sabit |
| **OVER_PRICE_MAJORITY** | 1.60–1.90 | >=£750 | >=50% | sadece p_O yükseliyor/sabit |

**Eşik mantığı:** %50 YES en çok para alan taraf; %60 mevcut kesin kanonik eşik. £750 mevcut minimum; £250 düşük hacim duyarlılık kontrolü. 1.50–2.00 varolan 1.60–1.90 bandını simetrik genişletir, fakat bu *ek hipotezdir*, sonuç tabanlı fiyat optimizasyonu değildir. 17 günde iki veya daha fazla toplam/gün ortalaması kalite hedefi, sonuç verilerini görüp sayıları kurallara uydurma izni vermez.

## Ölçümler
- Tüm benzersiz fixtures sayısı, T-6 BTTS AND OU25 T-8/T-6 kaynak erişimi, score FT doğrulanabilme, canonical BTTS YES motor arşiv 41 settled ile farkın nedenleri.
- Aynı doğrulanabilir evrende her model wins/N, odds avg, hit %, N/17, aktif gün, 9–16 vs 17–25, her gün SINYAL SAYISI, 95% Wilson, dışarıda ve içine yeni alınan vs canonical farkı, risk of time leak.
- Birden fazla kural denendi: en çok kazanan sonrası rastgele seçilip üretime konmaz. Herhangi bir '≥80% ve ≥2/gün' sonuç modelin prospective doğrulandığını göstermez. Gölge test, yeni tarihlerden en az 100 sinyal ve gerçek yürütülebilir odds/P&L gerek.
- Canonical SXF dosyaları ve üretim motoru DEĞİŞMEYECEK, yalnız GitHub araştırma notları. Supabase SELECT ile araştırma.

**STATUS: FREEZE BEFORE BROAD UNIVERSE OUTCOMES.**
