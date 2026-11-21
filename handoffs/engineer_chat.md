# CAPITALE — ENGINEER Sohbet Devamlılık ve Devir Kaydı

**Sorumlu:** ENGINEER / CAPITALE geliştirici agentı  
**Durum:** AKTİF — yalnızca geliştirici sohbeti için; kanonik metodoloji yerine geçmez  
**Son sohbet kaydı:** 2026-11-21 (Europe/Istanbul)  
**Depo:** `hazardyk27-sudo/capitale`  
**Önce okunacak dosyalar:** `AGENTS.md`, `MILESTONE.md`, `roles/engineer.md`, `policies/source_policy.md`, `prompts/manual_report_chain.md`, ardından BU dosya.

## Kullanıcının kalıcı çalışma talimatı

- Bu ChatGPT sohbetinin rolü **CAPITALE ENGINEER / geliştirici**. ANALYST, NEWS, SXF, POLY veya FINAL rolünü üstlenip maç tahmini üretme.
- Her sohbetin sonunda veya önemli bir teknik karar/uygulama sonrasında **bu dosyayı güncelle**: ne istendi, ne yapıldı, gerçek doğrulama durumu, açık sorunlar ve kesin sonraki adımlar. Diğer ajanların sohbet kayıtlarına dokunma.
- Yeni sohbet başladığında **bu dosyayı ve güncel GitHub kanonik kurallarını oku**; burada yazan tarihsel durum ile canlı durum farklıysa canlı sistemi ayrıca doğrula.
- Her işlem için `YAPILDI / DOĞRULANDI / BEKLİYOR / DOĞRULANMADI` statülerini dürüstçe ayır. GitHub'a yazılamadıysa yazılmış gibi davranma. Arka planda otomatik sohbet-sonu güncellemesi varmış gibi varsayma; araç erişimi olan oturumda açıkça güncelle.
- Bu özel dosya, kurallar ve MILESTONE'un yerine geçmez; metodolojik değişiklikleri onaysız kanonikleştirme.

## Projenin bağlamı / daha önce alınan önemli kararlar

1. CAPITALE bağımsız uzman raporlarını birleştiren bir futbol araştırma/karar sistemidir. SXF SmartXFlow piyasa sinyalleri, ANALYST v2.1 üç faktörlü istatistik analizi ve A destek puanı, NEWS v1.6 sekiz haber alanı / yedi piyasa etkisi / N destek puanı üretir; FINAL v0.2 yalnız uzman raporlarından A/B/C veya NO_RECOMMENDATION kararı çıkarır. POLY opsiyoneldir ve yoksa NO_EVIDENCE olarak ele alınır.
2. Uzmanlar birbirlerinin bulgu ve skorlarından etkilenmeyecek. FINAL, tüm tamamlanmış orijinal raporları okuyabilir. Kaynak izolasyonu ve AS_OF / future-data disiplini zorunlu.
3. Kullanıcı eski CLI rapor yükleme, agentlar arası rapor paketi taşıma ve manuel API gönderme akışını normal çalışma yöntemi olarak **iptal etti**. **Onaylı varsayılan: BROWSER-DIRECT v4.0.** Her ajan giriş yapılmış gerçek `https://betcapitale.com/admin/software?agent=<role>` sayfasında kendi kutusunu düzenler, Save'e basar, gerçek rapor ID/sürümünü ve SAVED & VERIFIED çıktısını görür. Tarayıcı otomasyonu yoksa yapılmış sayılmaz.
4. Doğrulanmış SXF FINAL_SIGNAL satırları Software'a otomatik kaynak senkronuyla gelebilir; bu, SXF agentının bütün orijinal raporunu girdiği anlamına gelmez. SXF her maç/tercih için 1–3 gerçek doğrulanmış bulgu vermeli; diğer agentlar da kendi formundaki gerekleri yerine getirmeli.
5. Web formları / backend / doğrulama ve izolasyon değişiklikleri önceki sohbetin kayıtlarına göre hazırlanıp canlıya alınmış. `prompts/manual_report_chain.md` v4.0'a göre HTTP 200, girişsiz kayıt isteği 401, eski açık uç 403 ve build/type-check testleri başarılıydı. **Bunlar geçmiş kayıtlar; bu oturumda canlı site yeniden test edilmedi.**
6. **Eksik kritik doğrulama:** Yetkili gerçek browser session ile SXF → ANALYST → NEWS → FINAL tam rapor doldurma / Save / database readback uçtan uca henüz doğrulanmadı. Hiçbir gerçek agent kaydının başarılı olduğunu kanıtsız iddia etme.

## Son kaldığımız nokta — 2026-11-21

**Tek maçla browser-direct v4 smoke/E2E testi yapılacak:**

- Maç: Cercle Brugge – Westerlo
- Tercih: Üst 2.5
- `run_id`: `fa423695-4e01-4e36-ae93-0eda6375ea97`
- SXF: `https://betcapitale.com/admin/software?agent=sxf`
- ANALYST: `https://betcapitale.com/admin/software?agent=analyst`
- NEWS: `https://betcapitale.com/admin/software?agent=news`
- FINAL: `https://betcapitale.com/admin/software?agent=final`

**Plan:** SXF kendi orijinal raporunu girer/kaydeder/doğrular → ANALYST bağımsız raporunu girer/kaydeder/doğrular → NEWS bağımsız raporunu girer/kaydeder/doğrular → FINAL üçünü sayfada okuyup kararını girer/kaydeder/doğrular. Her aşamada gerçek `report_id`/`version` ya da FINAL karar ID'si alınır, hiçbir rol başkasının kutusunu değiştirme. Giriş ve browser GUI kontrolü gerçekten mevcut olmalı.

**Bu konuşmada ayrıca tamamlanan:** Kullanıcı geliştiriciye, bundan sonraki sohbetlerin sürekliliği için diğer departmanlardan ayrı bir GitHub MD dosyası oluşturmasını ve her sohbet sonunda kaldığımız yeri buraya yazmasını istedi. Bu dosya o istek için oluşturuldu. Bu oturumda browser-direct testi **yapılmadı**.

## Bir sonraki ENGINEER sohbetinin başlangıç kontrol listesi

1. `AGENTS.md`, `MILESTONE.md`, `roles/engineer.md`, `policies/source_policy.md`, `prompts/manual_report_chain.md` ve bu dosyanın en güncel sürümünü oku.
2. Site/branch/backend'in o andaki gerçek deploy ve yetki durumunu doğrula; önceki sohbetlerin iddialarını canlı test gibi sunma.
3. Admin oturumlu tarayıcı kontrolü varsa, yukarıdaki tek maç E2E browser-direct zincirini gerçek raporlarla ve gerçek kayıt ID'leriyle doğrula. Yetki yoksa net engeli belirt; CLI'yi agent kullanıcı akışıymış gibi kullanma.
4. Test sonuçlarını ve varsa hata/fix/commitleri bu dosyaya tarihle ekle. Gerektiğinde MILESTONE'a ayrı teknik tarihçe gir.

## Güncelleme şablonu (her oturum sonunda en alta ekle)

### YYYY-MM-DD — ENGINEER sohbet devir notu
- **İstek / hedef:**
- **Yapılan değişiklikler (dosya/commit):**
- **Doğrulanan testler (kanıt/ID):**
- **Eksik / başarısız / bloke olanlar:**
- **Sonraki adım:**
- **Sürüm/kanonik kural etkisi:** Yok / ayrıntı.

---
**Not:** Bu MD, ayrı ENGINEER sohbetinin operasyonel hafızasıdır; uzman raporu, kaynak kanıtı veya otomatik sistem logu değildir.

### 2026-11-21 — Software liste görünümünde oran değerinin kaldırılması
- **İstek / hedef:** Kullanıcı /admin/software MATCH / SIGNAL / A / N / V / B / O Δ% tablosunda ham oran (ör. 3.15, 1.77) gösterilmesini istemiyor; yalnız oran değişimi yüzde/ok gösterilecek. Ekran görüntüsü hem ham oran hem Δ% gösterildiğini doğruladı.
- **Yapılan değişiklikler:** Aktif üretim sunucusunda `/app/betcapitale/dist/public/assets/admin-software-B_RQbAaY.js` liste hücresindeki ham `currentOdds.toFixed(2)` çıktı elemanı kaldırılarak yalnız mevcut delta metni bırakıldı. Yeni asset: `admin-software-delta-only-20261121.js`. Aktif `index-Bg9uIRfV.js` dosyasındaki iki chunk referansı yeni asset'e geçirildi; index yedeği `index-Bg9uIRfV.js.bak-20261121-delta-only` olarak tutuldu. Detay panelinin odds bilgileri, veriler, backend ve hesaplama değişmedi.
- **Doğrulanan testler:** Sunucu yerel patch kontrolü başarılı; aktif index'te yeni chunk referansı 2 adet; canlı HTTPS'te yeni asset HTTP 200. Gerçek admin oturumu ile görsel GUI doğrulaması henüz yapılmadı. Eski browser cache'i hard refresh gerektirebilir.
- **Eksik / başarısız / bloke olanlar:** Bu değişiklik doğrudan üretim derlenmiş asset'ine yapıldı. Kalıcı kaynak reposunda aynı gösterim kuralı ayrıca güvence altına alınmalı; yeniden build/deploy eski sürümü geri getirmemeli. Kapsam kuralı: sadece liste O Δ% hücresinde ham oran yok; talep netleştirilmedikçe analiz detaylarındaki ham veriler korunur.
- **Sonraki adım:** Kullanıcıyla aktif admin UI'de görsel kontrol; uygun kaynak koduna delta-only render testi ve kalıcı commit; browser-direct E2E agent zinciri henüz beklemede.
- **Sürüm/kanonik kural etkisi:** Yok, sadece UI düzeltmesi.

### 2026-11-21 — Software maç listesine gerçek takım armaları eklendi
- **İstek:** Maç tablosunda takım adlarının yanında küçük logolar gösterilsin; O Δ% sütunundaki yalnız oran değişimi kuralı korunsun.
- **Yapılan:** Canlı asset'in liste MATCH hücresinde ev/deplasman isimlerine 24x24 logo alanı eklendi. 14 kulüp için doğrulanmış ESPN takım ID'lerinden png logolar yerel `/app/betcapitale/dist/public/team-logos/*.png` alanına kaydedildi: AGF, Lyngby, Al Ahli, Al Nassr, Arminia Bielefeld, Magdeburg, Athletic Bilbao, Espanyol, Barnsley, Sheffield Wednesday, Bayern Munich, FC Köln, Cercle Brugge ve Westerlo. Ad eşleştirmesi için açık alias haritası kullanıldı; bilinmeyen takımlar için yanlış logo yerine tarafsız simge gösteriliyor. Kullanıcının görünen maç tablosundaki küçük oran değerleri kaldırılmış olarak kalıyor. Aktif yeni chunk: `admin-software-crests-delta-only-20261121.js`, `index-Bg9uIRfV.js` içindeki iki import referansı değiştirildi. Geri dönüş index kopyası: `index-Bg9uIRfV.js.bak-20261121-logos`.
- **Kontrol:** `node --check` geçti; hem yeni JS hem logo canlı HTTPS 200 döndü. Ancak yetkili browser GUI görsel doğrulaması yapılmadı.
- **Eksik:** Trento ve Cittadella dahil diğer kulüplerin onaylı armaları henüz yok; fallback kullanılıyor. Gelecek yeni maçlarda tüm takımların gösterilmesi için veri kaynağında stable team ID + doğrulanmış crest URL, yerel cache ve eşleştirme rutini kalıcı olarak geliştirilmelidir. Derlenmiş asset hotfix'i gelecekteki deploy'da kaybolabilir, kanonik frontend kaynak koduna ve testlere port edilmelidir.
- **Sonraki adım:** Canlı GUI kontrol, eksik takım armalarını tamamlama, kalıcı source + deploy ile yeniden test. Browser-direct dört agent E2E halen bekliyor.

### 2026-11-21 — ÖNCEKİ YAYIN İDDİASININ DÜZELTİLMESİ / GERÇEK CANLI ASSET CACHE BUST
- **Kullanıcı geri bildirimi:** Orijinal `https://betcapitale.com/admin/software` sayfasında önceki oran ve 14-logo değişiklikleri GÖRÜNMÜYORDU. Önceki “yayında” ifadesi tarayıcıda doğrulanmadan verilmişti.
- **Kök neden:** HTML `/assets/index-Bg9uIRfV.js` dosyasını yüklerken bu JS `Cache-Control: public,max-age=31536000,immutable` ile servis ediliyordu. Daha önce aynı isimli ana JS dosyasının içeriği değiştirildi; bu yüzden mevcut tarayıcılar eski modülü saklayabiliyordu. Sadece içeriği değiştirmek yeterli değildi.
- **Kesin düzeltme:** Gerçek üretim kökü `/app/betcapitale/dist/public/index.html` tespit edildi. Orijinal sayfanın HTML entry referansı **yeni benzersiz sürüme** `/assets/index-capitale-admin-software-v3-20261121.js` taşındı. O ana modül, yeni `/assets/admin-software-team-crests-v3-20261121.js` chunk'ını çağırıyor. Liste `O Δ%` hücresinde ham `currentOdds.toFixed(2)` artık render edilmiyor; yalnız yükseliş/düşüş/Unchanged göstergesi var. Ayrıntı panelindeki gerçek oran veri alanları teknik inceleme için korunuyor.
- **Takım logoları:** Kullanıcının gönderdiği eksik ekran görüntüsünde bulunan FC Oss, Roda JC, Fujieda MYFC, FC Imabari, Inverness CT, Ayr, Miedz Legnica, LKS Lodz, Molde, Bodo Glimt, Palestino, Union La Calera, Red Star, Pau, Southend, Boreham Wood, Tokyo-V ve Nagoya armaları gerçek kulüp logosu dosyalarıyla tamamlandı. Önceden eklenen 14 kulüp yanında Trento ve Cittadella da eklendi. Takım adlarına açık doğrulanmış alias map eklendi; isimsiz nokta yerine henüz eşleştirilmemiş kulüplerde harfli nötr fallback kullanılıyor. Logo dosyaları üretim `/team-logos/` dizininde yerel cache olarak saklı.
- **Test:** Gerçek orijinal site HTML'sinin yeni ana JS'i referansladığı, yeni ana JS'in yeni Software chunk'ını yüklediği, bu chunk'ta hem ev/deplasman crest render'ı bulunduğu ve tablo fiyat elementinin bulunmadığı canlı HTTPS üstünden doğrulandı. 20 kulübün PNG'si canlı HTTPS üzerinden **tek tek status 200 + geçerli PNG magic bytes** ile doğrulandı. Yeni bundle'ların `node --check` sözdizimi testi geçti. Üretim HTML yedeği: `/app/betcapitale/dist/public/index.html.bak-20261121-before-logo-real-deploy`.
- **Kalan sınırlar:** Kullanıcının giriş yapılmış gerçek browser görüntüsünü uzaktan açma kontrolü bu oturumda sağlanmadığı için son GUI doğrulaması yok. Bu bir canlı derlenmiş asset hotfix'idir, derleme/deploy kaynak koduna kalıcı commit **henüz yapılmadı**. Gelecek kaynak deploy'un eski UI'yi getirmemesi için doğru canonical frontend build kaynağı bulunmalı ve delta-only + tam logo çözümlemesi oraya port edilmeli. Test edilen tek tek armalar dışında yeni takımlar eksikse fallback görünür.
- **Sonraki adım:** Kullanıcı giriş yapılmış gerçek sitede yenileme sonrası kontrol; kalıcı kaynak depo ve deploy otomasyonuna logo ID/URL cache ve delta-only kuralı ekleme; browser-direct E2E zinciri hâlâ beklemede.

### 2026-11-21 — ACİL SİTE ERİŞİM OLAYI / ÜRETİM GERİ ALMA
- **Bildirim:** Kullanıcı siteye hiçbir sayfadan erişemediğini söyledi; hemen önceki software logo/oran deploy'u şüpheliydi.
- **İlk tanı:** `nginx` ve `betcapitale-web.service` aktif, 443 ve 5000 portları dinliyor; `/`, `/admin/software`, `127.0.0.1:5000/` HTTP 200 döndü. Bu tek başına JS uygulamasının tarayıcıda çalıştığını kanıtlamıyordu.
- **Önlem / rollback:** Son değişiklikle üretime alınan HTML entry `/assets/index-capitale-admin-software-v3-20261121.js` yerine, `/app/betcapitale/dist/public/index.html.bak-20261121-before-logo-real-deploy` yedeğinden önceki `/assets/index-Bg9uIRfV.js` girişine geri dönüldü. Arıza anındaki HTML `index.html.bak-20261121-incident` olarak saklandı. Web uygulaması restart edilmedi, DB değiştirilmedi.
- **Gerçek tarayıcı doğrulaması:** Bağlı Windows YKC cihazında Puppeteer + Chrome headless ile HTTPS URL'leri `/`, `/admin/software`, `/giris` açıldı. Üçü de HTTP 200; React root içinde gerçek sayfa içerikleri render oldu (ana sayfa, Software Analysis, Sign In), `pageerror` ve failed request çıkmadı. Admin oturumu olmadan `/admin/software` tasarım önizlemesi / "Data source not connected" görünmesi beklenir; authenticated E2E yapılmadı.
- **Kök neden durumu:** Yeni sürümlenmiş ana JS/HTML değişikliği ile semptomlar zaman olarak ilişkilidir; rollback sonrası tarayıcı testleri geçti. Kesin JS hata izi önceden yakalanamadığından **tam kök neden henüz kanıtlanmadı**. Önceki `Cache-Control: immutable` konfigürasyonu canlı asset adını değiştirmeden yapılan müdahaleleri tehlikeli hâle getirir.
- **Etki / yapılacaklar:** Güvenli erişim için son release geri alındı; logo/oran düzeltmesinin güncel tarayıcılarda eksiksiz çalıştığı iddia edilmemeli. Gelecekte: kaynak build'den düzgün hashed JS ve HTML deploy, staging üzerinde Chrome smoke testi, atomik deploy, rollback doğrulaması, admin oturumlu E2E test. Yeni hotfix yapmadan önce kullanıcıya erişimin geri geldiğini bildir.
