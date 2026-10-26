# SXF — Birlikte not alınan iki yeni motor geliştirme adayı

**Kayıt tarihi:** 2026-10-27
**Kullanıcı talebi:** "Ekol 3'ü not et, diğer 2.5 güncellemesinin yanına."
**Statü:** SAHİBİ TARAFINDAN ARAŞTIRMA ADAYI OLARAK NOT EDİLDİ — EXPERIMENTAL / SHADOW ONLY. SXF v0.4 üretim/kanonik STABLE, PREMIUM, V1, V2, HEAVY vb. kuralları **DEĞİŞMEDİ**. Bu belge motoru aktive etmez; geriye dönük başarının gelecekte süreceğini vaat etmez.

## 1. Üst 2.5 yeni aday — OVER_STRONG

**Ayrıntılı önceki kayıt:** [OVER_STRONG_Shadow_Research_Note_2026-10-26.md](OVER_STRONG_Shadow_Research_Note_2026-10-26.md)

- Önce mevcut STABLE veya PREMIUM OVER 2.5 sinyali oluşmalı.
- Sinyal karar anında aynı fixture'nin **BTTS YES SXF oranı >1,60**.
- Karar anında seçilen ÜST 2.5 toplam parası **≥£2.500**.
- ÜST para payındaki **T-8 → T-6 değişim > -2,00 yüzde puan** (pay düşüşü iki yüzde puandan az veya artış).
- Kaynak/snapshot AS_OF doğrulaması zorunlu; eksik veya uyuşmayan cross-market veri = `CROSSMARKET_UNVERIFIED`, mevcut STABLE/PREMIUM sinyali korunur.
- **9–25 Ekim 2026 tarihsel T-6 denemesi:** **16/17 = %94,1**; ortalama SXF OVER oranı **1,609**. Çok küçük ve geçmiş sonuçlar görülerek optimize edilmiş örneklem. Canonical ÜST motoruna uygulanmadı.
- T-8/T-6 şartları araştırma kohortu içindir; gerçek değişken AS_OF canlı kullanımında ek metodoloji doğrulaması gerekir.

## 2. 1X2 yeni aday — EKOL 3 / ERKEN PARA İVMESİ + FİYAT TEYİDİ

**Ayrıntılı ve 34 maçlık kaynak:** [SXF_EKOL3_Early_Acceleration_T8_T7_T6_Research_2026-10-27_v1.md](SXF_EKOL3_Early_Acceleration_T8_T7_T6_Research_2026-10-27_v1.md)

- Temel V1 1X2 HOME/AWAY seçimi geçerli: seçilen takım en fazla parayı toplar, **≥£1.000**, **≥%80 pay**, **1,40–2,50 SXF oranı**.
- T-8, T-7, T-6 karşılaştırması yalnız **gerçek T-6 karar anında erişilebilir** geçmiş SmartXFlow 1/X/2 snapshotlarıyla yapılır.
- **İlk saat ivmesi:** T-8→T-7 döneminde seçilen tarafın **yeni 1X2 para içindeki payı**, T-8'de seçilen tarafın eski toplam para payından **yüksek** olmalı.
- **İki saatlik ivme:** T-8→T-6 döneminde seçilen tarafın yeni 1X2 para içindeki payı yine T-8'deki eski toplam para payından **yüksek** olmalı.
- **Fiyat teyidi:** 1/X/2 oranlarından normalize edilen marjdan arındırılmış seçilen takım örtük olasılığı **T-6'da T-8'den düşük olmamalı**.
- Her karşılaştırma aralığında seçilen/X/rakip kümülatif para miktarları negatif fark vermemeli, toplam yeni para pozitif olmalı.
- T-8, T-7, T-6 snapshotları her hedef andan önce en fazla **10 dakika eski**, aynı fixture ve 1X2 içinde 1/X/2 tam olmalı. T-6 kaynak seçilen oran ve para payı arşivle sırasıyla **±0,02 oran, ±2,0 yüzde puan** uzlaşmalı. Eksik/eskimiş/uyumsuz veri = yeni etiket yok.
- Mevcut V2 ve HEAVY etiketi **zorunlu değil** ve ikinci bağımsız oy değil.
- **9–25 Ekim 2026 tarihsel T-6 denemesi:** **29/34 = %85,3**, 17 takvim gününde **2,00 tekil sinyal/gün**, sinyal bulunan gün **13/17**; ortalama seçilen SXF oranı **1,732**; ilk 8 gün 8/10, kalan 9 gün 21/24.
- Karşılaştırma: Ekol 2 mevcut para ivmesi + fiyat teyidi **36/48 = %75,0**, **2,82/gün**. Ekol 3 bunun daha seçici alt grubudur; 14 maç eler (7 WIN, 7 LOSS).
- Ekol 3, aynı geçmiş veride çeşitli filtreler incelenirken keşfedildiği için **in-sample / çoklu karşılaştırma ve overfitting** riski yüksektir. Bu %85,3 bir **gelecek isabet garantisi veya doğrulanmış üretim performansı değildir**.

## Korunan araştırma kararı
İki gelişim adayını aynı araştırma portföyünde **yan yana tut** ve ileride yeni, bağımsız maçlarda gerçek **decision AS_OF** anında gölge sinyal olarak test et. Canlı SXF v0.4, canonical motor isimleri/eşikleri ve geçmiş arşivler değişmez. Üretime geçirmek için ayrı kullanıcı onayı, ayrı versiyonlu motor/metodoloji/schema değişikliği ve bağımsız ileri tarih doğrulaması gerekli.

**İlgili kaynak detayları:** ÜST için [SXF_OVER25_Filter_Research_2026-10-09_25_v1.md](SXF_OVER25_Filter_Research_2026-10-09_25_v1.md); EKOL 3 için yukarıdaki özgün 48 maçlık araştırma dosyası.
