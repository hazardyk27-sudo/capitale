# CAPİTALE SXF — Kazanan ve Kaybeden Sinyallerin Ortak Özellikleri

**9–25 Ekim 2026 · T-6 esas / eksikse T-8 · SXF v0.4 DRAFT · Gerçekleşmiş sinyaller üzerinden ayrı EXPLORATORY araştırma**

> Bu çalışma motorları değiştirmez. Veriye sonradan bakarak oluşturulmuş aday filtreler gelecekte aynı başarıyı göstermek zorunda değildir. Finansal getiri/ROI/unit hesaplaması yapılmadı; yalnızca isabet incelendi.

**Örneklem:** 464 sinyal · 463 sonuçlanan · 1 doğrulanamayan · 417 maç/gün kimliği. 1X2 259, Üst 2.5 66, BTTS 41, SURPRISE 97.

## 1. Soru: Kaybedenlerde ne farklı?

| Piyasa | Kazananlarda ort. oran | Kaybedenlerde ort. oran | Kazananlarda ort. para payı | Kaybedenlerde ort. para payı | Kazananlarda ort. £ | Kaybedenlerde ort. £ |
|---|---:|---:|---:|---:|---:|---:|
| 1X2 | 1,75 | 1,90 | %84,2 | %84,7 | 49.628 | 36.601 |
| Üst 2.5 | 1,60 | 1,57 | %82,6 | %82,6 | 5.388 | 3.309 |
| KG VAR | 1,73 | 1,77 | %80,7 | %77,4 | 4.315 | 3.426 |
| SURPRISE (yenilmeme) | 3,30 | 3,39 | %65,0 | %69,7 | 790 | 1.247 |

**1X2 kayıplarında daha yüksek fiyat dikkat çekiyor:** Kazananların ortalama SXF oranı 1,75; kaybedenlerin 1,90. Buna karşılık ortalama para payı hemen hemen aynı (%84,2 / %84,7). Büyük para tek başına değil, fiyat ve pazar türüyle birlikte incelenmeli.

**1X2'de toplam 92 kayıp:** 53 beraberlik ve 39 rakip galibiyeti. Kayıpların %57,6'i beraberlikle geldi. HEAVY'nin 19 kaybının 12 tanesi de beraberliktir. Bu, T-6'daki **X tarafı para/oran davranışını** sonraki araştırmada ayrıca incelemek için güçlü bir gerekçedir; şu anki kayıtlardan X hareketinin sebep olduğu sonucunu çıkaramayız.

## 2. En önemli bulgu: HEAVY'nin ek ayırt ediciliği

| Karşılaştırma | Birinci grup (isabet) | İkinci grup (isabet) | Ortalama SXF oranları |
|---|---|---|---|
| V1 HEAVY / V1 HEAVY değil | 49/68 (%72,1) | 68/116 (%58,6) | 1,75 / 1,77 |
| V1 ve oran <2.00: HEAVY / HEAVY değil | 41/53 (%77,4) | 56/91 (%61,5) | 1,64 / 1,66 |
| V1: HEAVY ve oran <2.00 / kalan bütün V1 | 41/53 (%77,4) | 76/131 (%58,0) | 1,64 / 1,82 |

Benzer oranlı (**<2,00**) V1 gruplarında HEAVY 41/53 (%77,4), HEAVY olmayan 56/91 (%61,5). Ortalama oranlar sırasıyla 1,64 ve 1,66. Böylece fark yalnızca HEAVY'nin daha düşük oran seçmesiyle açıklanamıyor; yine de nedensellik veya ileriye dönük üstünlük ispatı değildir.

Dönem testi: 9–16 Ekim'de HEAVY / HEAVY olmayan (<2.00) **14/16 (%87,5) / 27/36 (%75,0)**; 17–25 Ekim'de **27/37 (%73,0) / 29/55 (%52,7)**. HEAVY işaretinin yönü iki bölümde de tutarlı.

## 3. Beklenmedik zayıflık: aşırı para yüzdesi

| İncelenen V1 grubu | Filtre koşulunu sağlayan | Sağlamayan | Ortalama oranlar |
|---|---|---|---|
| Seçilene giden para ≥%95 / <%95 | 9/20 (%45,0) | 108/164 (%65,9) | 1,71 / 1,77 |
| Para ≥%95 ve hacim <£10.000 / diğerleri | 7/18 (%38,9) | 110/166 (%66,3) | 1,71 / 1,77 |
| V2'nin son 3 saat minimumu ≥%90 / <%90 (yalnız V2 evreninde) | 12/28 (%42,9) | 78/116 (%67,2) | 1,75 / 1,75 |

V1'de güncel pay **≥%95** olduğunda 9/20 (%45,0); bunun dışındakilerde 108/164 (%65,9). Başarı farkı daha yüksek oranlardan ileri gelmiyor (bu yüksek-pay grubunun ortalama oranı **1,71**, diğer grubun **1,77**). Aşırı yüksek oran yüzdesi çoğu zaman daha düşük mutlak para hacmiyle birlikte görünüyor.

V2'nin 3 saatlik minimum payı ≥%90 olanlar 12/28 (%42,9), daha düşük olanlar 78/116 (%67,2); her iki grubun ortalama SXF oranı yaklaşık **1,75**. Ancak ≥%90 grubunun büyüklüğü yalnızca **28** ve bu eşik sonuçları gördükten sonra test edildi.

**Önemli sonuç:** Daha yoğun para payı her zaman daha çok isabet anlamına gelmiyor. Bu, yarından itibaren herkese %95 veto koyma gerekçesi değil; ayrı risk bayrağı ve ileriye dönük test hipotezidir.

## 4. Odds bandı: 2,00 üzerindeki V1 seçiminin kayıp eğilimi

| V1 grubu | İsabet | Diğer V1 grubu | Diğer isabet |
|---|---|---|---|
| V1 oran ≥2,00 | 20/40 (%50,0) | V1 oran <2,00 | 97/144 (%67,4) |
| 9–16 Ekim | 10/17 (%58,8) | 9–16 Ekim <2,00 | 41/52 (%78,9) |
| 17–25 Ekim | 10/23 (%43,5) | 17–25 Ekim <2,00 | 56/92 (%60,9) |

Oranın yükseldikçe isabet yüzdesinin düşmesi kısmen beklenen bir olgudur: daha yüksek fiyat genellikle daha zor bir sonucu temsil eder. Bu nedenle yalnız isabeti yükselten oran kesmesini ekonomik avantaj veya model kalibrasyonu olarak yorumlamamak gerekir.

## 5. V2, motor birikimi ve diğer piyasalar

- **V2:** V1 içinde V2 doğrulaması olan 90/144 (%62,5), olmayan 27/40 (%67,5). Bu örneklemde V2 etiketinin tek başına pozitif ayırt ediciliği görülmedi; negatif farkın nedeni veri grupları ve diğer faktörler olabilir.
- **SURPRISE:** ≥£1.000 yüklü 6/15 (%40,0), daha düşük yüklü 54/82 (%65,9). İki tarih alt grubunda da yön aynı; yine de yalnız **15** yüksek hacimli örnek vardır. SURPRISE'ın başarısı yenilmemedir ve 1X2 doğrudan galibiyet isabetiyle aynı şey değildir.
- **Üst 2.5:** PREMIUM 24/33 (%72,7), STABLE 24/33 (%72,7). Para-pay ve hacim eşiklerini artırmak bu 17 günde daha fazla isabet üretmedi. İlk/son dönemlerde farklı yönler görülüyor; aşırı yorumlanmamalı.
- **KG VAR:** 29/41 başarılı. Hacim/pay düzeylerine göre istikrarlı bir ek kesme eşiği için örneklem küçük.
- **CORE retention:** T-6'ya kadar %55'in altına düşen erken akışlar zaten mevcut kuralla iptal ediliyor. Geçerli CORE'lar arasında yeni optimum retention sınırı belirlemek için veri yetersiz; yeni eşik uydurulmadı.
- **T-8 → T-6 eğilimi:** Karar saatindeki oran/para değişimi tüm günlerin orijinal seçim JSON'larında aynı şemayla saklanmadığından yalnız ilk üç günlük karşılaştırma mümkün. Bu veriyle genel geçer ivme filtresi üretmek güvenilir değil.

## 6. Ayrıntılı tarihsel gölge-filtre karşılaştırması

| Deneysel grup (V1 içinde) | İstenen koşul | İsabet | Kapsam | 9–16 Ekim | 17–25 Ekim |
|---|---|---|---:|---|---|
| HEAVY etiketi | ARAŞTIRMA | 49/68 (%72,1) | 68/184 | 18/23 (%78,3) | 31/45 (%68,9) |
| HEAVY ve SXF <2,00 | ARAŞTIRMA | 41/53 (%77,4) | 53/184 | 14/16 (%87,5) | 27/37 (%73,0) |
| SXF ≥2,00 (risk grubu) | ARAŞTIRMA | 20/40 (%50,0) | 40/184 | 10/17 (%58,8) | 10/23 (%43,5) |
| Para payı ≥%95 (risk grubu) | ARAŞTIRMA | 9/20 (%45,0) | 20/184 | 6/9 (%66,7) | 3/11 (%27,3) |
| Para ≥%95 ve <£10k (risk grubu) | ARAŞTIRMA | 7/18 (%38,9) | 18/184 | 5/8 (%62,5) | 2/10 (%20,0) |

**Buradaki tüm eşikler geçmiş sonuçlara bakılarak denendi.** 'İlk/son dönem' sütunu aynı geçmiş arşivin kronolojik alt bölümü, geleceği görmeden yürütülmüş gerçek bir holdout testi değildir. Bu sonuçlar üretim motor kurallarını **değiştirmez**.

## 7. Kaybedenlerde örnek olaylar

- **Hull – Brentford (25 Ekim, 1–1):** V1/V2/HEAVY + CORE, yaklaşık £181.147 para ve %84,9 pay olmasına rağmen doğrudan deplasman galibiyeti gelmedi. Yoğun para akışı beraberlik riskini ortadan kaldırmıyor.
- **Toulouse – Troyes (25 Ekim, 0–0):** Birden fazla motor doğrulaması ve yüksek hacim vardı; buna rağmen beraberlik yüzünden kayıp.
- **Palestino – Colo Colo (25 Ekim, 1–1):** Para payı %98,0 ve yaklaşık £5.726, ancak galibiyet seçimi kaybetti. Aşırı yoğun yüzde + sınırlı mutlak hacim risk örneği.
- **Fenerbahçe – Slavia Prag (20 Ekim, 2–2):** HEAVY etiketi bulunmasına rağmen yüksek £ hacmi 1X2 galibiyeti garanti etmedi.

Bu örnekler kayıtlı SXF FT skorlarından alınmıştır; bütün örneklerin maç günü kimliği bağımsız web üzerinden yeniden doğrulanmış değildir. Tekil örnekler istatistiklerin yerine geçmez.

## 8. Sistem performansını artırmak için önerilen test planı

1. **Gölge test A — HEAVY+V1 ve SXF <2,00:** Mevcut motoru değiştirmeden ayrıca işaretle; tüm V1 ve aynı oran bandındaki HEAVY olmayan V1 ile karşılaştır. İlk hedef isabet farkının yeni, henüz oynanmamış maçlarda da sürmesi.
2. **Gölge test B — aşırı yüzde/düşük mutlak para:** `V1 share≥95%`, `V1 share≥95% & money<£10000`, `V2 3h min share≥90%` için yalnız **RİSK BAYRAĞI** oluştur; otomatik veto uygulama. Para yüzdesinin az hacimde yapay büyüyüp büyümediğini ve ligin veri yoğunluğunu incele.
3. **Gölge test C — beraberlik riski:** Kazanamayan 1X2 seçimlerinde T-6 anındaki **X para payı, X oranı ve X oran hareketini** ayrı, karardan önce bilinen değişkenler olarak araştır. FT'de 1–1 / 0–0 gibi beraberlikleri önceden gösterebiliyor mu kontrol et.
4. **Market ayrımı:** 1X2 HEAVY hacim bulgusunu SURPRISE'a uygulama. SURPRISE için yenilmeme ve doğrudan galibiyet iki ayrı çıktı olarak tutulmalı. OVER ve BTTS eşik değişiklikleri için daha uzun örneklem gerekiyor.
5. **Prospektif doğrulama:** En az birkaç hafta / anlamlı örneklem boyunca mevcut v0.4 sinyallerini **olduğu gibi** arşivle; aday risk bayraklarını aynı T-6 anında ayrıca dondur. Daha sonra bağımsız FT doğrulamasından sonra haftalık/lig bazında ve aynı fiyat bandındaki örneklerle karşılaştır. Başarılı değilse üretime alma.

## 9. Veri kalitesi ve sınırlamalar

- 9–25 Ekim'in 464 seçiminin 463'ü sonuçlandı. **15 Ekim Sportivo Luqueño – Cerro Porteño** tarih belirsizliği yüzünden `UNVERIFIED` tutularak her isabet hesabından çıkarıldı.
- SXF arşivi tarihsel, maç günü canlı dondurulmuş ileriye dönük test değildir. Orijinal 17 günlük seçimler korunmuştur.
- Kaynak SXF iç FT kayıtları maç kimliği ve skor durumuna göre kontrol edildi, fakat her karşılaşma için bağımsız internet teyidi bulunmuyor.
- Motor etiketleri aynı seçime binilebilir: V1/V2/HEAVY, CORE/T12 toplamlarını sistemin bağımsız sinyal sayısı saymak yanlıştır.
- Yüksek oran / düşük isabet ilişkisi tek başına ekstra motor zayıflığı kanıtı değildir.
- Farklı eşik, fiyat ve haftalarla çok sayıda karşılaştırma yaptığımız için **çoklu karşılaştırma ve aşırı uyum riski** var. Bulgular araştırma hipotezidir, kalibre edilmiş olasılık/puan değildir.

**Denetim JSON'u:** [Kazanan_Kaybeden_Analizi_2026-10-09_25_v1.json](Kazanan_Kaybeden_Analizi_2026-10-09_25_v1.json) · [Özellik matrisi 9–16](loss_features_2026-10-09_16_v1.json) · [Özellik matrisi 17–25](loss_features_2026-10-17_25_v1.json).
