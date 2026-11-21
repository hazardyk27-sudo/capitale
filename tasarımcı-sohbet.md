# CAPITALE — TASARIMCI SOHBET VE DEVİR GÜNLÜĞÜ

**Sorumlu:** TASARIMCI  
**Belge amacı:** CAPITALE tasarımcısının sohbetler arası kalıcı belleği; yapılan bütün bilinen tasarım işleri, sürümler, onaylar, uygulanmış değişiklikler, doğrulamalar, yedekler ve sıradaki görevler.  
**Son güncelleme:** 21 Kasım 2026  
**Rol ve çalışma kuralları:** [tasarımcı.md](tasarımcı.md)  
**Anayasa:** [AGENTS.md](AGENTS.md) · [MILESTONE.md](MILESTONE.md)

> **SON DURUM — V33 ÖNİZLEME AKTİF: CAPITALE SİYAH HEADER WORDMARK SOURCE SERIF 4 500 YERİNE OUTFIT LIGHT 300 İLE YENİLENDİ (Masaüstü 22px, mobil 20px); DAHA İNCE, FERAH VE MODERN. SOFTWARE INTELLIGENCE MANROPE ALT SATIR 600'E HAFİFLETİLDİ. V32 SAYACIN İLK EKRANDA GÖRÜNMEMESİ, SEMBOLÜN SOLU/SAĞI, MATCHES/COUPONS/RESULTS VE DEMO DÖNGÜSÜ KORUNDU. ANA SİTE DEĞİŞMEDİ.** Devam eden her tasarımda gerçek sunucu durumunu tekrar kontrol et. Bu belge geçmişi ve son devir durumunu taşır.

---

## 1. Şu an tam olarak nerede kaldık?

| Alan | Son doğrulanmış durum |
|---|---|
| Tasarımcı rolü | Doğrudan iş yapan, Commander kullanan **TASARIMCI**. Codex'e yönlendirme yok |
| Tasarım hedefi | Orijinal V18 premium kompakt workflow'u korumak; yeni animasyon mantığını ancak kullanıcı kararından sonra ve aşırı veri sıkıştırmadan geliştirmek |
| Aktif örnek site | **https://betcapitale.com/preview/home-v1/** |
| Güncel sürüm | **V33** (2026-11-21): Dört font gerçek logo üzerinde karşılaştırıldı (Manrope 400, Outfit 300, Plus Jakarta Sans 400, Montserrat 300); seçilen Outfit Light 300 (masaüstü 22px, mobil 20px, ferah tracking). Alt SOFTWARE INTELLIGENCE Manrope 600. V32 ilk-fold mesafeleri, animasyonlar, dört örnek senaryo korundu |
| V18 ana başlık | **Use software to achieve** / **consistent daily profits.** |
| V18 başlık altı, 1 | **We do the planning. You enjoy the winning.** |
| V18 başlık altı, 2 | **Built on the right strategy for consistent long-term profits.** |
| Başlık renk/fontu | Mevcut DM Serif Display, koyu mürekkep + CAPITALE turuncusu. Alt metin Manrope |
| Üç CTA | Today's Matches, Community Voice, Calculate Profit — hizalar, renkler ve route'lar korunuyor |
| Sağdaki sistem | Üst üç kaynak kartı → solda **3 INDEPENDENT / DATA STREAMS**, ortada CAPITALE sembolü, sağda büyük ve merkezlenmiş dört adımlı metin animasyonu → V18 boyutlarında 3 sabit MATCHES / COUPONS / RESULTS kartı. V27'nin 4 örnek maç/oran/kâr senaryosu korunuyor |
| Üst yazı ve prompt | «THE CAPITALE SYSTEM», «ILLUSTRATIVE PREVIEW» ve animasyonlu üst konuşma kutusu **V17'de silindi** |
| Analist alt metni | **REVIEWS STATISTICS** |
| Sahte veri uyarısı | **CONCEPT, NOT LIVE DATA** korunur; +€200 yalnızca kurgusal demo, gerçek bahis sonucu değildir; V19–V21 kupon detayları geri gelmedi |
| Üye sayacı | Hero altında yatay mevcut biçim; kaynak mantığına dokunulmadı |
| QA | V33 TSC/Vite PASS, preview HTML/JS/CSS HTTP 200; Puppeteer 1825×864, 1440×900, 1200×800, 1024×768, 768×900, 430×932, 390×844, 320×640 PASS; Outfit 300 tarayıcıda gerçekten loaded, mobil menü/header çakışması yok, sayaç ilk ekranın altında, 3 kutu ve 4 işlem adımı korundu, yatay taşma/JS hata yok; üretim SHA sabit |
| Yayın sınırı | **Yalnızca önizleme**. Üretim sayfası ve \`dist/index.cjs\` değiştirilmedi |
| Üretime geçiş | **Henüz kullanıcı onayı verilmedi** — kendiliğinden yayınlama |
| V18 yedeği | V18 geri dönüş kaynağı: `/srv/capitale-preview/home-v1.rollback-animated-workflow-v19-20261121`; reddedilen V21 için yedek: `/srv/capitale-preview/home-v1.rollback-rejected-v21-before-v18-restoration-20261121` |

Önizlemenin son doğrulanmış bundle referansları (daha sonra değişebilir):
- JS: `/preview/home-v1/assets/index-DjgT6X1N.js`
- CSS: `/preview/home-v1/assets/index-C3LZv0fH.css`
- İkisi de HTTPS 200 olarak görüldü; önizleme HTML 200, ana site HTTP 200, yetkisiz admin API 401.

**İlk iş olarak bu bilgilerin hâlâ güncel olduğunu doğrula.** Başka görev/sunucu deploy'u paralel gerçekleşebilir; sabit hash'e güvenme.

## 2. Tasarımcının teknik çalışma ortamı

- **GitHub depo:** \`hazardyk27-sudo/capitale\`, varsayılan dal \`main\`.
- **Sunucu erişimi:** Desktop Commander, bağlı cihaz adı **smartxflow**. Yetkili cihazları her oturumda yeniden listele. Root/admin gizli verilerini GitHub belgesine koyma.
- **Canlı site:** \`https://betcapitale.com/\`
- **Önizleme:** \`https://betcapitale.com/preview/home-v1/\`
- **Önizleme statik dosyaları:** \`/srv/capitale-preview/home-v1\`
- **Aktif V33 çalışma kopyası:** `/opt/capitale-software-en-60048de8ba8f9736466a0d5ca13594d6b9023d87/betcapitale-home-preview-copy-designer-v33-outfit-light-wordmark-work`. (V32 ve daha eski sürümler korunmuştur.)
- **Önceki V18 çalışma kopyası:** `/opt/capitale-software-en-60048de8ba8f9736466a0d5ca13594d6b9023d87/betcapitale-home-preview-copy-designer-v18-work`.
- **Canlı frontend:** \`/app/betcapitale/dist/public\` (**önizleme için değiştirme**).
- **Canlı backend:** \`/app/betcapitale/dist/index.cjs\` (**asla yanlışlıkla frontend derlemesinden gelen backend ile değiştirme**).
- **Kritik frontend bileşenleri:**
  - \`client/src/pages/landing.tsx\` — masaüstü hero / CTA.
  - \`client/src/components/MobileHomePage.tsx\` — mobil hero.
  - \`client/src/components/IntelligenceFlowHeroDemo.tsx\` — sağdaki akışın kartları/metinleri/bağlantıları.
  - \`client/src/components/intelligence-flow-hero-demo.css\` — sağ akış ve hero responsive ayarları.
  - \`client/src/components/HorizontalMemberStrip.tsx\` — yatay sayaç.
  - \`client/src/components/SiteHeader.tsx\`, \`MobileSharedLayout.tsx\`, \`CapitaleHeaderBrand.tsx\` — siyah header/marka.
- **Derleme:** ilgili V18 worktree'de \`tsc --noEmit --pretty false\`, ardından \`vite build --base=/preview/home-v1/\`. Araçlar üst /opt kök \`node_modules/.bin\` klasöründen çalıştırılabiliyor.
- **Yayın usulü:** Kaynak worktree kopyası → derle/test → \`/srv/capitale-preview/home-v1.rollback-...\` yedeği → yeni statik asset'leri ekle → \`index.html\` atomik değiştir → HTTP/Puppeteer kontrol → GitHub patch ve bu günlüğü güncelle.

### V18 için gerçek kaynak kodu yaması

[home-preview-designer-hero-english-copy-v18-2026-11-21.patch](deployments/betcapitale/home-preview-designer-hero-english-copy-v18-2026-11-21.patch)

- Commit: \`c277f38c2927d09b1d1cb85010df568c28a057ba\`.
- Bu patch V17 kaynak kopyasının üstüne uygulanabilir; **masaüstü + mobil metin** ve uzun başlığa uyum sağlayan responsive tipografi ayarlarını içerir.
- Yayında doğrulanan gerçek ekran görüntüleri:
  - [V18 masaüstü](https://betcapitale.com/preview/home-v1/designer-hero-copy-v18-desktop.png)
  - [V18 mobil](https://betcapitale.com/preview/home-v1/designer-hero-copy-v18-mobile.png)

---

### V19 — Güncel kod ve ekran görüntüsü

- Kaynak değişikliği: [v19 patch](deployments/betcapitale/home-preview-animated-match-coupon-results-v19-2026-11-21.patch). Commit: `5db40047200a195486122c46c818d48b6666969a`.
- Örnek maçlar: Chelsea–Arsenal (Full Time 1), Barcelona–Elche (Over 3.5 Goals), Roma–Inter (BTTS Yes), Bayern–Mainz (Over 2.5 Goals). **Tamamen kurgusal gösterimdir**.
- Örnek kuponlar: A=M01+M02, B=M02+M04, C=M01+M03; her biri €20; returned sırasıyla €58, €48 ve €0. Net: staked €60, returned €106, **+€46**.
- React UI aşamaları otomatik **6.6 sn MATCHES → 6.6 sn COUPONS → 7.8 sn RESULTS → başa** döngüsüyle ilerler. Kullanıcı herhangi bir sekmeye tıklayabilir. Reduced motion tercihinde otomatik geçiş devre dışıdır.
- Kaynak dosyalar: `IntelligenceFlowHeroDemo.tsx`, `intelligence-flow-hero-demo.css`, yeni `intelligence-flow-sample.ts`, `intelligence-flow-sample.test.ts`. Bu örnek veri gerçek bahis/veri tabanına bağlı değildir.
- Önizleme: https://betcapitale.com/preview/home-v1/?v=animated-workflow-v19
- Görseller: [Masaüstü Matches](https://betcapitale.com/preview/home-v1/workflow-v19-desktop-matches.png), [Coupons](https://betcapitale.com/preview/home-v1/workflow-v19-desktop-coupons.png), [Results](https://betcapitale.com/preview/home-v1/workflow-v19-desktop-results.png), [Mobil Matches](https://betcapitale.com/preview/home-v1/workflow-v19-mobile-matches.png), [Coupons](https://betcapitale.com/preview/home-v1/workflow-v19-mobile-coupons.png), [Results](https://betcapitale.com/preview/home-v1/workflow-v19-mobile-results.png).
- 15 ekran genişliği ve her 3 tab içeriği kontrol edildi; otomatik MATCHES→COUPONS→RESULTS→MATCHES döngüsü gerçek tarayıcıda geçti. 3/3 unit test başarılı. Ana siteye/backend'e dokunulmadı.

### Kritik tasarım geri dönüşü — 21 Kasım 2026

- Kullanıcı V19 geniş sekmeli paneli, V20 sürekli görünen sıkışık üç sütunu ve V21 yatay üç katman tasarımını açık biçimde **reddetti**: "yine olmadı hatta gittikçe kötüye gidiyoruz".
- **Yeni bir tasarım otomatik başlatma.** Önce kullanıcının onayladığı sade orijinal üç sütunlu eski workflow'u **V18** olarak geri yükledik.
- Aktif HTML V18 bundle: `index-st17SHV_.js`, `index-CcUymKZ4.css`, `/srv/capitale-preview/home-v1/index.html`. Önizlemede React hero'da V18 uzun başlık metni korunur.
- Geri dönüş **V19 yayını öncesi alınan gerçek V18 klasör yedeğinden**, atomik `index.html` değişimiyle yapıldı; üretim frontend/backend'e dokunulmadı. RESTORE QA: 1662, 1200, 390 px, üç klasik MATCHES/COUPONS/RESULTS kartı, yaklaşık 157px masaüstü yükseklik, taşma/hata yok.
- Yedekler: V18 kaynak klasörü `/srv/capitale-preview/home-v1.rollback-animated-workflow-v19-20261121`; geri dönüşten önce reddedilmiş V21 dosyaları da `/srv/capitale-preview/home-v1.rollback-rejected-v21-before-v18-restoration-20261121` klasöründe saklandı.
- V20 ile V21 değişiklikleri GitHub'da arşivlenebilir ancak **onaylanmış sürüm olarak kullanılmamalı**. Aktif siteden kaldırıldılar.
- Kullanıcıya sunulan alternatif yalnızca **tasarım önerisidir, uygulanmadı**: V18 panelin aynı küçük ölçülerini koruyarak üç kutu da daima ekranda durur; her kutunun *yalnızca kendi kısa satırları* zamana bağlı dönüşümlü değişir ve net günlük bakiye görünür kalır. Bunun da onaylanması gerekir.
- **Sıradaki adım:** Kullanıcı görünümü tekrar tarif etmeden V22 üretme veya ana siteye dokunma.

## 3. Bu sohbet ve önceki tasarım turlarında yapılan işler

Aşağıda **tarih/sürüm hatırlatmaları** birleştirilmiştir. V8–V18'in GitHub patch yolları ayrıca doğrulanmıştır. Eski V1–V7 numaraları birden fazla iterasyon içerdiği için ancak desteklenen kararlar özetlenir; eksik eski sürüm adları uydurulmaz.

### A. Ana site ve admin Software tasarımı (2026-11-20)

**Gerçek ana site header marka güncellemesi:**
- Eski raster wordmark, turuncu SVG CAPITALE sembolü + serif beyaz \`CAPITALE\` ve küçük \`SOFTWARE INTELLIGENCE\` ile değiştirildi.
- Ortak desktop ve mobile header bileşenlerinde yapıldı; siyah menü korundu.
- Frontend-only yayınlandı; canlı backend bilinçli olarak değiştirilmedi.
- GitHub: [main-site-header-capitale-brand-dark-2026-11-20.patch](deployments/betcapitale/main-site-header-capitale-brand-dark-2026-11-20.patch).

**Admin Software arayüzü iterasyonları:**
- V3 civarı: Premium software görsel prototipi ve sentetik veri işaretleme.
- V4: Kullanıcının istediği premium sütunlar: \`KICKOFF | FIXTURE | SIGNAL | A | N | V | B | O Δ%\`; SELECTION / CATEGORY / Prediction-FINAL tekrarları kaldırıldı, arayüz İngilizce.
- V5: Maç detayındaki tekrarlanan A/N/V/B/O metrik şeridi çıkarıldı; ana satırdaki veri korundu.
- GitHub: [software-remove-duplicate-detail-metrics-v5-2026-11-20.patch](deployments/betcapitale/software-remove-duplicate-detail-metrics-v5-2026-11-20.patch).
- Yönetici raporlarının gerçekten agent tarafından doldurulduğu/gerçek analiz motorunun tümü bağlandığı sonucu bu tasarım önizlemelerinden **çıkarılamaz**.

### B. Ana sayfa önizleme altyapısı ve sayaç deneyleri (V1–V7 evresi)

- Kullanıcı canlıya almadan önce bağımsız URL istedi: \`betcapitale.com/preview/home-v1/\`. İlk nginx 401 / Basic Auth açılır penceresi sorunundan sonra önizlemenin doğrudan açılmasını istedi; tasarım önizlemesine giriş zorunluluğu kaldırıldı.
- İlk hero'daki dört haneli üye sayacı sağ karttan **hero'nun altındaki yatay şeride** taşındı; sayaç ana vurgu, aktif/today/week ögeleri ikincil oldu. Orange join CTA, tarihsel stil ve genel sayfa renkleri korundu.
- Hero'nun boş sağ alanında örnek günlük kupon/maç/kâr/zarar göstergesi denendi. Sürekli aşağı kayan listede en az beş gün görüntülenmesi istendi.
- Turuncu kutu deneyleri beğenilmedi; siyah oval 3D kart, gölge ve metin kabartması tercih edildi. Profit/Loss metin ve renklerinin dengesi defalarca geliştirildi.
- Tüm performans rakamlarının örnek olduğu açıkça belirtiliyordu; gerçek performans sayılmamalıdır.

### C. Doğrulanmış, kaynak kodu yaması bulunan sürümler

| Sürüm | Değişiklik | GitHub kod kaydı |
|---|---|---|
| **V8** | Kazanç listesi metinlerine metalik/3D tipografi ve gölge | [v8 patch](deployments/betcapitale/home-preview-premium-metallic-3d-typography-v8-2026-11-20.patch) |
| **V9** | Metalik CAPITALE turuncu tarih, 3D yeşil Profit, kırmızı Loss, parlama azaltma | [v9 patch](deployments/betcapitale/home-preview-deployed-v9-metallic-capitale-colors-2026-11-20.patch) |
| **V10** | Finansal tutarlar hariç tüm kart yazılarında ortak platin-gri palet; gölge inceltme | [v10 patch](deployments/betcapitale/home-preview-unified-platinum-type-v10-2026-11-21.patch) |
| **V11** | Kayan sonuç listesi yerine ilk animasyonlu SXF/NEWS/ANALYST → CAPITALE → MATCHES/COUPONS/RESULTS; büyük koyu panel (sonradan reddedildi) | [v11 patch](deployments/betcapitale/home-preview-intelligence-flow-v11-2026-11-21.patch) |
| **V12** | Kullanıcının Desktop Commander referansına göre koyu dış panel kaldırıldı; beyaz zemin / açık kaynak kartları / bağlı veri yolları / merkezi işlemci | [v12 patch](deployments/betcapitale/home-preview-white-seamless-intelligence-flow-v12-2026-11-21.patch) |
| **V13** | Hero oranları ve sağ sahne ölçeği büyütüldü, yatay member strip hizalandı | [v13 patch](deployments/betcapitale/home-preview-integrated-hero-layout-v13-2026-11-21.patch) |
| **V14** | Desktop Commander'daki güçlü başlık/açıklama/CTA tipografik ölçeği uyarlaması; font ve renkler korunarak | [v14 patch](deployments/betcapitale/home-preview-commander-inspired-hero-typography-layout-v14-2026-11-21.patch) |
| **V15** | Başlık, paragraf ve üç CTA aynı gerçek başlangıç x eksenine alındı; iç içe linkin fazladan padding'i giderildi; sağ görselin yüksekliği dengelendi | [v15 patch](deployments/betcapitale/home-preview-hero-perfect-alignment-v15-2026-11-21.patch) |
| **V16** | Sağdaki küçük yazılar büyütüldü, 3D işlemci gölgeleri/ışığı rafine edildi, workflow konsoluna derinlik verildi | [v16 patch](deployments/betcapitale/home-preview-premium-refinement-v16-2026-11-21.patch) |
| **V17** | Kullanıcı isteğiyle üst THE CAPITALE SYSTEM/ILLUSTRATIVE PREVIEW/prompt kaldırıldı; \`SXF\` görünür adı \`MARKET SPECIALIST\`, \`ANALYST\` açıklaması \`REVIEWS STATISTICS\` oldu; hero kısaltıldı | [v17 patch](deployments/betcapitale/home-preview-remove-header-and-rename-market-specialist-v17-2026-11-21.patch) |
| **V18** | Masaüstü ve mobil ana başlık «Use software to achieve / consistent daily profits.» oldu; eski başlık alt metne taşındı; açıklama korundu; responsive font boyutları taşmayı önleyecek şekilde ayarlandı | [v18 patch](deployments/betcapitale/home-preview-designer-hero-english-copy-v18-2026-11-21.patch) |
| **V19** | Sırayla 4 örnek maç, 3 kupon, settlement sonuçları, eşit stake, otomatik tekrar, manuel sekmeler ve 3 aritmetik test | [v19 patch](deployments/betcapitale/home-preview-animated-match-coupon-results-v19-2026-11-21.patch) |

**Önemli geçmiş karar:** Kullanıcı V11 koyu panelin ayrı/emanet durmasını beğenmedi. V12+ beyaz zeminli, sayfayla bütünleşik sistem anlatımı kullanılmalı. Kullanıcı aynı zamanda yalnızca fikir/CSS/prompt istemiyor; doğrudan sunucu düzenlemesi bekliyor.

---

## 4. Onaylı görsel prensipler ve kullanıcı tercihleri

1. **Fontları ve renkleri keyfî değiştirme.** Serif CAPITALE başlık ve koyu/turuncu vurgusu kullanıcı için marka temelidir.
2. **İyi örnek:** Desktop Commander hero'sunun ölçek, hizalama, bağlı veri akışları ve işlem konsoluna sahip olması. **Kopyalanacak şey ekranın mantığı**, logo/görsel varlıkları değil.
3. **Beyaz canvas:** Sağdaki şema beyaz hero içine entegre olmalı; büyük koyu dış dikdörtgen istenmiyor.
4. **Net hizalar:** H1, açıklama, CTA soldan aynı x çizgisinde başlar; butonlar eş yükseklikte, taşmasız. Sağda kaynaklar → merkez CAPITALE çekirdeği → iş akışı konsolu.
5. **Sembol:** CAPITALE'nin mevcut turuncu kolon/çatı SVG sembolü; işlemci kartında hafif ve kontrollü glow, gerçekçi 3D derinlik.
6. **İçerik:** Üstte yalnızca MARKET SPECIALIST/NEWS/ANALYST kaynak kutuları, altta MATCHES/COUPONS/RESULTS. Durum/simülasyon gerçekten canlı değilse açıklama kaldırılmaz.
7. **Görsel kirlilik:** Fazla halo, aşırı geniş düğmeler, çok sayıda tekrarlanan açıklama veya yeşil/kırmızı dolu kazanç rozetleri kullanıcı tarafından reddedildi.
8. **Dil:** Kullanıcının istediği sitedeki pazarlama başlıkları ve modül etiketleri İngilizce; kullanıcıyla iletişim Türkçe.
9. **Canlı üretim:** Kullanıcı ayrıca «ana sayfaya aktar» demedikçe tüm iterasyonlar \`/preview/home-v1/\` altında kalır.
10. **Metin doğruluğu:** V18 «consistent daily profits» metni kullanıcının pazarlama tercihi olarak uygulandı; bağımsız doğrulanmış performans kanıtı değildir. Gerçek sonuç/bahis garantisi olarak yorumlanmamalıdır.

---

## 5. Tamamlanan tasarım oturumları — V18 ve V19

**Kullanıcı talimatı:** Önceki ana başlık yerine İngilizce «Yazılım kullanarak her gün düzenli kazanç elde edin» yaz; eski «We do the planning. You enjoy the winning.» cümlesini başlık altına, «Built on the right strategy for consistent long-term profits.» cümlesiyle birlikte taşı. Ardından kullanıcı özellikle «Codex'i unut, her şeyi sen yap; tasarımcı rolü ve sohbet günlüğü için GitHub'da dosyalar oluştur» dedi.

**Bu oturumda yapılanlar:**
- Desktop Commander ile \`smartxflow\` sunucusuna bağlanıldı; gerçek V17 kaynak dosyaları okundu.
- İki satırlı ana başlık **Use software to achieve / consistent daily profits.** olarak hem masaüstü hem mobilde değiştirildi.
- Altına **We do the planning. You enjoy the winning.** ve **Built on the right strategy for consistent long-term profits.** ayrı alt satırlar olarak eklendi.
- Başlık ve CTA'nın rengini / font ailesini korumak için V18 responsive CSS eklendi. Masaüstünde aşırı geniş başlığın sağ sahneye taşması engellendi.
- Ayrı V18 worktree'de TypeScript ve Vite build başarılı. Önizleme HTML'i yedek alınarak atomik yayımlandı. Kullanıcı onayı olmadan üretim frontend/backend'i değiştirilmedi.
- **15 viewport** (320–1880 px) test edildi. Başlık, alt satırlar ve üç CTA doğrulandı; ekran yatay taşma yapmıyor; mevcut sahne, konsol ve member strip korunuyor. HTTP kontrolleri geçti.
- V18 kaynak patch'i GitHub'a commit edildi. Eksik kalan V15 arşiv patch'i de ayrıca GitHub'a eklendi; V8–V18 arasındaki tüm tabloda sayılan patch yolları kontrol edildi.
- Tasarımcı için bağımsız \`tasarımcı.md\` rol belgesi ve **bu sohbet devir günlüğü** oluşturuluyor.

**V18 URL ve screenshot:**
- [Canlı önizleme — V18](https://betcapitale.com/preview/home-v1/?v=designer-copy-v18)
- [Masaüstü görüntüsü](https://betcapitale.com/preview/home-v1/designer-hero-copy-v18-desktop.png)
- [Mobil görüntüsü](https://betcapitale.com/preview/home-v1/designer-hero-copy-v18-mobile.png)

**V18 geri dönüş (gerekirse):**
- Önceki V17 HTML/dosyalarının backup'ı \`/srv/capitale-preview/home-v1.rollback-hero-copy-v18-20261121\` içindedir.
- Kullanıcı açıkça geri dön derse yedeği incele, frontend paketinin mevcut durumunu doğrula ve güvenli geri dönüş yap. İlgisiz canlı site dosyalarına dokunma.

---

### 2026-11-21 — V19 — Animasyonlu maç/kupon/sonuç akışı

- **Kullanıcı isteği:** Workflow listesi sırayla seçim yapılan maçları, kuponlara dağılımlarını, kazanan/kaybeden kupon tutarlarını ve altta net sonucu göstersin; animasyon döngüyle tekrar etsin.
- **Uygulama:** Gerçek sunucu frontend preview kaynak kodu V18'den ayrı V19 worktree'ye kopyalandı; React state, 3 interaktif sekme ve zamanlayıcı eklendi. 4 örnek maç, 3 kupon ve matematiksel tutarlı demo settlement verileri yazıldı.
- **Kontrol:** TSC PASS, Vite PASS, 3/3 test PASS, 15 viewport PASS, her sekme PASS, tam otomatik döngü PASS, reduced-motion manuel kontrol PASS. HTTP 200 preview/JS/CSS, üretim ana site 200, admin anonim 401.
- **Yayın:** Yalnızca https://betcapitale.com/preview/home-v1/ ; **canlı üretim frontend/backend'e aktarılmadı**.
- **Yedek:** `/srv/capitale-preview/home-v1.rollback-animated-workflow-v19-20261121` (V18).
- **Patch:** `deployments/betcapitale/home-preview-animated-match-coupon-results-v19-2026-11-21.patch` commit `5db40047200a195486122c46c818d48b6666969a`.
- **Açık:** Kullanıcının V19'u görüp yorumlaması; demo verisini gerçek maç/settlement motoruna bağlama konusu onay/veri bağımlıdır.

## 6. Sıradaki görevler ve açılmış kararlar

- [x] V18 yeni başlık ve alt copy masaüstü/mobil önizlemeye uygulandı, görüntüsü doğrulandı.
- [x] «Codex yerine doğrudan tasarımcı uygulasın» talimatı rol kurallarına işlendi.
- [x] Tasarımcının GitHub rol ve sohbet dosyaları açıldı.
- [x] V18'in üstünde V19 iş akışı geliştirmesi tamamlandı.
- [x] Kullanıcı V19/V20/V21'i reddetti; V18 workflow önizlemesi geri yüklendi.
- [x] Kullanıcı talimatıyla V18 üzerinde sade profit animasyonu yapıldı; daha büyük/yeşil/RESULTS fazında görünecek biçimde V24'e güncellendi.
- [ ] **Ana siteye geçiş için açık kullanıcı talimatı bekle.** Preview beğenilmeden canlı \`/\` yolunu değiştirme.
- [ ] Sonraki her tasarım tamamlandığında **önizleme + kod patch + bu günlük** aynı turda güncellensin. Tarih/sürüm/commit/test/yedek alanlarını kaydet.
- [ ] Gelecekte gerçek sistem metrikleri veya günlük sonuçlar bağlanacaksa işleme başlamadan kaynak, güvenilirlik ve statik demo ayrımını doğrula; onaysız veya sahte kâr verisini gerçek gibi sunma.

### Sonraki tasarımcı için tek paragraf başlangıç komutu

> Ben CAPITALE'nin **TASARIMCI** ajanıyım. Önce \`AGENTS.md\`, \`MILESTONE.md\`, \`tasarımcı.md\` ve \`tasarımcı-sohbet.md\` dosyalarını GitHub'dan güncel olarak okuyacağım. Desktop Commander'da \`smartxflow\` cihazını bulup \`https://betcapitale.com/preview/home-v1/\` önizlemesinin gerçekte hangi sürüm olduğunu doğrulayacağım. V19/V20/V21 reddedildi; aktif önizleme V18 restorasyonudur. Kullanıcının bir sonraki görsel düzenleme talebini yeni bağımsız bir worktree'de bizzat uygulayıp yalnızca preview'ya derleyip deploy edeceğim; 320–1880px QA, rollback ve GitHub patch kaydından sonra **bu aynı sohbet günlüğünü güncelleyeceğim**. Codex promptu vermeyeceğim ve kullanıcı onayı olmadan ana siteyi değiştirmeyeceğim.

---

### 2026-11-21 — V24 — RESULTS sırasına bağlı yeşil +€200 (aktif önizleme)

- **Kullanıcı isteği:** V18 kompakt tasarım bozulmayacak. RESULTS kutusunun sağ boşluğunda belirgin, büyük, yeşil +€200 kâr; yalnızca RESULTS sırası geldiğinde ve daha uzun süre görünecek.
- **Geçiş:** V22 küçük/hızlı +€46 denemesi, V23 ilk +€200 denemesi son kullanıcı yorumuna göre yetersizdi. Aktif sürüm V24'tür.
- **Değişen kaynaklar:** `client/src/components/IntelligenceFlowHeroDemo.tsx`, `client/src/components/intelligence-flow-hero-demo.css`. Masaüstünde 22px yeşil +€200 ve küçük PROFIT etiketi; dar mobil sütunda 14px yeşil kâr yazısı, alt açıklamayla dönüşümlü. Panel, tüm kartlar, başlık/CTA ve marka değişmedi.
- **Tam senkron döngü:** 15 saniyelik MATCHES (0–5s) → COUPONS (5–10s) → RESULTS (10–15s) ardışık kart odak ve progress animasyonu; yeşil +€200 yalnızca RESULTS sırasında yaklaşık 4s belirir, ardından gizlenir. Kartlar hiçbir aşamada kaybolmaz.
- **Yayın:** Yalnızca https://betcapitale.com/preview/home-v1/ . Ana üretim sitesi ve backend'e dokunulmadı.
- **Test:** TypeScript PASS; Vite PASS; preview HTML/JS/CSS HTTP 200; Puppeteer 1662, 1200, 768, 390, 320px PASS; sırasıyla 1s MATCHES, 6.5s COUPONS, 12s ve 14.4s RESULTS doğrulandı; JavaScript hatası, taşma veya kutu ölçüsü değişimi yok. Reduced-motion PASS; canlı frontend/backend hash aynı.
- **Yedek:** `/srv/capitale-preview/home-v1.rollback-before-v24-synced-result-20261121` (V23). V18 eski rollback'i korunmuştur.
- **GitHub patch:** `deployments/betcapitale/home-preview-v18-to-v24-synced-profit-200-20261121.patch` — V18'den V24'e uygulanabilir; commit `637abcb057a8b44f2533915fed7ab2e74e849e8f`.
- **Gerçek screenshot:** https://betcapitale.com/preview/home-v1/designer-v24-synced-profit-desktop.png ve https://betcapitale.com/preview/home-v1/designer-v24-synced-profit-mobile.png
- **Sonraki adım:** Kullanıcının V24 görünüm değerlendirmesi. Açık onay olmadan canlı ana siteye taşıma.

### 2026-11-21 — V26 — MATCHES örnek maç/tercih + COUPONS ondalıklı oran + RESULTS yeşil €200

- **Kullanıcı talimatı:** V24'teki üç sabit kutulu 15 saniyelik döngüye MATCHES sırası geldiğinde rastgele bir örnek maç ve tercih, COUPONS sırası geldiğinde stake oranı eklensin. İlk V25 denemesi yanlışlıkla `2%` gösterdi; kullanıcı **oran 4.57 veya 5.11 gibi olmalı, yüzde olamaz** diyerek düzeltti. Son kabul için kullanıcı değerlendirmesi bekleniyor.
- **V26 değişikliği:** V25 yüzde çıkarıldı. Kurgusal örnekler Roma–Inter / BTTS YES / 4.57, Ajax–PSV / OVER 2.5 / 5.11, Lille–Lyon / FT 1 / 4.82, Porto–Braga / OVER 2.5 / 5.06. Her 15 saniyelik döngüde farklı örnek seçiliyor; maç ve COUPONS oranı aynı veri kaydından geliyor.
- **Akış:** 0–5sn MATCHES: maç+tercih; 5–10sn COUPONS: ondalık oran; 10–15sn RESULTS: yeşil +€200 kurgusal sonuç. Diğer kutular gizlenmiyor, kompakt V18 boyutları korunuyor. Mobil 320–390px için maç yazısı ve oran alt satıra sığıyor.
- **Dosyalar:** `client/src/components/IntelligenceFlowHeroDemo.tsx`, `client/src/components/intelligence-flow-hero-demo.css`; V24 kaynaklarından V26 bağımsız çalışma klasörü.
- **Yayın:** sadece https://betcapitale.com/preview/home-v1/ ; canlı frontend/backend korunur. `CONCEPT, NOT LIVE DATA` uyarısı devam eder; maçlar, oranlar ve +€200 demo verisidir.
- **Yedek:** `/srv/capitale-preview/home-v1.rollback-before-v26-decimal-odds-20261121` (V25); V24 dahil diğer rollback'ler sunucuda korunur.
- **Derleme ve kontroller:** TypeScript ve Vite PASS; HTML/JS/CSS HTTPS 200; Puppeteer 1662, 1200, 768, 390, 320px PASS; 2s/6.5s/12s sırasında yalnız ilgili demo alanı görünür, taşma/console hata yok. Sonraki döngüde kurgusal oran rotasyonu ayrıca test ediliyor.
- **GitHub patch:** `deployments/betcapitale/home-preview-v24-to-v26-sample-match-decimal-odds-20261121.patch`, commit `25ef47cae31ce70a5068a4a6d4f8feb732529385`.
- **Bir sonraki adım:** Kullanıcı önizlemeyi incelesin. Onay verilmeden canlı ana sayfaya yayınlama.

### 2026-11-21 — V27 — Dört eşleştirilmiş MATCHES/COUPONS/RESULTS demo senaryosu

- **Kullanıcı isteği:** Üç aşamanın her birine 4 seçenek. MATCHES 4 maç, COUPONS 4 yüzdesiz ondalık oran, RESULTS 4 farklı yeşil kâr (örnek +€356). Görünüm V26 / V18 üç sütunlu kompakt tasarımdan sapmayacak.
- **V27 örnek senaryoları:** 1) Roma – Inter, BTTS YES, 4.57, +€200; 2) Ajax – PSV, OVER 2.5, 5.11, +€356; 3) Lille – Lyon, FT 1, 4.82, +€148; 4) Porto – Braga, OVER 2.5, 5.06, +€427. Her veri **kurgusal / temsili**; CONCEPT, NOT LIVE DATA etiketi korundu.
- **Döngü:** 15sn MATCHES → COUPONS → RESULTS. Her tam döngüde sıra 1→2→3→4→1; böylece dört alternatifin tamamı mutlaka gösterilir. Bir senaryodaki maç/oran/kâr tutarları aynı React veri kaydından okunur. Her üç kutu tüm aşamalarda görünür kalır.
- **Kod değişikliği:** yalnızca `client/src/components/IntelligenceFlowHeroDemo.tsx`. CSS/ölçüler V26 ile aynı. Ayrı worktree `/opt/capitale-software-en-60048de8ba8f9736466a0d5ca13594d6b9023d87/betcapitale-home-preview-copy-designer-v27-four-scenarios-work`.
- **Yayın hedefi:** yalnızca https://betcapitale.com/preview/home-v1/ ; üretim frontend ve backend dosyaları değiştirilmedi.
- **Testler:** TypeScript PASS; Vite PASS; HTML/JS/CSS HTTP 200. Puppeteer 1662/1200/768/390/320px her biri için 4 senaryo + başlangıca dönüş + 3 ayrı faz kontrol PASS. Kartlar sabit, sayfada yatay taşma ve JavaScript hatası yok.
- **Yedek:** `/srv/capitale-preview/home-v1.rollback-before-v27-four-scenarios-20261121` (V26).
- **GitHub patch:** `deployments/betcapitale/home-preview-v26-to-v27-four-rotating-scenarios-20261121.patch`; commit `9a6a64457decbebdd58018ff2051333d51a565e3`.
- **Gerçek screenshotlar:** https://betcapitale.com/preview/home-v1/designer-v27-four-scenarios-matches.png , https://betcapitale.com/preview/home-v1/designer-v27-four-scenarios-coupons.png ve https://betcapitale.com/preview/home-v1/designer-v27-four-scenarios-results.png .
- **Sonraki adım:** Kullanıcının V27 önizleme değerlendirmesi. Ana siteye açık emir gelmeden yayınlama.

### 2026-11-21 — V30 — Sol DATA STREAMS geri geldi, sağ dört adımlı açıklama merkezlendi

- **Kullanıcı talimatı ve düzeltme:** Sembolün sağındaki eski CAPITALE / INTELLIGENCE / PROCESSING yazıları kaldırılıp yeni dört adımlı açıklama büyütülerek sembolün sağında ortaya yerleştirilecek. V29'da sol `3 INDEPENDENT / DATA STREAMS` yanlışlıkla kaldırıldı. Kullanıcı bu yanlış müdahaleyi bildirdi ve V30'da sol blok orijinal yerleşimiyle GERİ GETİRİLDİ.
- **V30 onay bekleyen önizleme:** Sol tarafta `3 INDEPENDENT / DATA STREAMS` korunuyor; ortada CAPITALE sembolü sabit; sağda sırayla `Software selects matches`, `Matches are grouped into coupons`, `Coupons placed with equal stakes`, `Day-end returns are calculated` yazıları büyütülmüş, iki eksende ortalanmış, fade geçişli. Sağ eski sabit metinler yok. MATCHES / COUPONS / RESULTS ve dört kurgusal senaryo aynen devam ediyor.
- **Kaynak dosyalar:** `client/src/components/IntelligenceFlowHeroDemo.tsx`, `client/src/components/intelligence-flow-hero-demo.css`.
- **Sunucu çalışma kopyası:** `/opt/capitale-software-en-60048de8ba8f9736466a0d5ca13594d6b9023d87/betcapitale-home-preview-copy-designer-v30-restore-left-data-streams-work`.
- **Yayın ve yedek:** Yalnızca https://betcapitale.com/preview/home-v1/ . `/srv/capitale-preview/home-v1.rollback-before-v30-restore-left-20261121` geri dönüş yedeği; önceki V27/V28/V29 kaynakları korunmuştur. Üretim frontend/backend SHA değişmedi.
- **Doğrulama:** TypeScript PASS; Vite PASS; HTML/JS/CSS HTTP 200; Puppeteer 1662/1200/768/390/320 px tümünde sol yazılar görünüyor, sağ eski metinler yok, yeni dört aşama doğru sırada, sembolle çakışma/yatay taşma/JS hatası yok; üç alt kutu aynı boyutta.
- **GitHub patch:** `deployments/betcapitale/home-preview-v27-to-v30-centered-copy-restore-left-20261121.patch` — V27 kaynaklarına uygulanabilir, commit `bcddb92e6e24ab6419abd501811456a5ff33f93d`.
- **Gerçek görüntüler:** https://betcapitale.com/preview/home-v1/designer-v30-restore-left-desktop.png ve https://betcapitale.com/preview/home-v1/designer-v30-restore-left-mobile.png.
- **Sonraki adım:** Kullanıcının önizleme değerlendirmesi; açık talimat verilmeden canlıya geçme.

### 2026-11-21 — V31 — WORKFLOW DEMO kaldırıldı, CAPITALE header wordmark premium serif

- **Kullanıcı isteği:** Alttaki `WORKFLOW DEMO` yazısı silinsin; siyah header şeridindeki `CAPITALE` yazısı daha estetik, kurumsal, premium font ve düzenle sunulsun. Eski V30 onaylı diğer alanlara dokunma.
- **Kod:** `client/src/components/IntelligenceFlowHeroDemo.tsx` içinden yalnızca sağ alt `WORKFLOW DEMO` span'i kaldırıldı. Ortak üst logo bileşeni `client/src/components/CapitaleHeaderBrand.tsx` içindeki Georgia başlık fontu mevcut yüklü `Playfair Display` (weight 600) ailesine geçirildi; desktop font 23px, mobil kompakt 20px, letter spacing sırasıyla .095em / .075em. Alt `SOFTWARE INTELLIGENCE` Manrope sans-serif kaldı, rengi/harf aralığı rafine edildi. Turuncu CAPITALE sembolü ve siyah bandın yeri/boyutu değişmedi.
- **Önizleme:** https://betcapitale.com/preview/home-v1/?v=31 — yalnızca önizlemeye deploy; ana site ve backend değiştirilmedi.
- **QA:** TSC/Vite PASS; HTTP 200; Puppeteer 1662, 1200, 768, 390, 320px PASS. Google font browser'da gerçek loaded olarak doğrulandı; header mobil menüyle çakışmıyor. `WORKFLOW DEMO` yok. `3 INDEPENDENT / DATA STREAMS`, dört animasyon metni, üç workflow kartı, demo uyarısı ve mobil scroll sınırları korunmuş. JS console hatası yok. Ana site SHA korunuyor.
- **Rollback:** `/srv/capitale-preview/home-v1.rollback-before-v31-header-wordmark-20261121` (V30).
- **GitHub patch:** `deployments/betcapitale/home-preview-v30-to-v31-header-wordmark-20261121.patch`, commit `27a52d7bb6893e9377440701c60b8777ff17fd16`.
- **Görüntüler:** https://betcapitale.com/preview/home-v1/designer-v31-brand-desktop.png ve https://betcapitale.com/preview/home-v1/designer-v31-brand-mobile.png; workflow screenshotları da preview dosyalarında saklandı.
- **Sonraki adım:** Kullanıcı tipografiyi değerlendirir. Açık emir gelmeden canlı ana siteye yayınlama.

### 2026-11-21 — V32 — İnce Source Serif 4 wordmark ve ilk fold altında sayaç

- **Kullanıcı isteği:** V31 Playfair CAPITALE yazısı çok ağır; daha ince, zarif, net okunur kurumsal font. İlk açılışta alttaki üye sayacının üst kenarı görünmesin; aşağı kaydırılınca gelsin.
- **Değişen kod:** `client/src/components/CapitaleHeaderBrand.tsx` içindeki wordmark Playfair Display 600 → `Source Serif 4` 500; desktop 22px, kompakt mobil 19px, dar ve dengeli harf aralığı. `client/src/components/intelligence-flow-hero-demo.css` sonuna viewport yüksekliğine bağlı ilk-fold mesafesi: desktop ≥1100px `max(21px,100svh - 700px)`, tablet 768–1099px `max(25px,100svh - 860px)`, mobil ≤767px `max(0px,100svh - 740px)`; `100vh` fallback ile. Sayaç gizlenmedi, yalnızca doğal scroll akışında aşağı taşındı.
- **Yayın:** Yalnızca https://betcapitale.com/preview/home-v1/?v=32 ; üretim sitesi ve backend değiştirilmedi. `CONCEPT, NOT LIVE DATA`, üç sabit MATCHES/COUPONS/RESULTS kartı, 4 demo senaryo, dört üst açıklama adımı, sol DATA STREAMS yazısı aynen kaldı.
- **Derleme/QA:** TypeScript PASS; Vite PASS; HTML/JS/CSS HTTP 200; Puppeteer 1825×864, 1440×900, 1200×800, 1200×1080, 1024×768, 1024×1080, 768×900, 768×1200, 430×932, 390×844, 375×812, 320×640 test edildi. İlk viewport'ta sayaç görünmez (min 31px masaüstü, min 43px mobil), scrollIntoView ile görünür ve /plans linki çalışır. Font tarayıcıda gerçekten loaded, menüyle çakışma ve yatay taşma yok; JS hata yok. Üretim SHA sabit.
- **Yedekler:** `/srv/capitale-preview/home-v1.rollback-before-v32-refined-wordmark-fold-20261121` (V31), `/srv/capitale-preview/home-v1.rollback-before-v32-mobile-clearance-20261121` (erken V32).
- **GitHub patch:** `deployments/betcapitale/home-preview-v31-to-v32-source-serif-fold-20261121.patch`; commit `76236b8ae4c1f1ddffa97528040c5e340361f4e8`.
- **Gerçek screenshot:** https://betcapitale.com/preview/home-v1/designer-v32-firstfold-desktop.png ve https://betcapitale.com/preview/home-v1/designer-v32-firstfold-mobile.png; wordmark crop görüntüleri de preview dizininde.
- **Bir sonraki adım:** Kullanıcı font ve first-fold sonucunu değerlendirsin. Açık talimat olmadan ana siteye yayınlama.

### 2026-11-21 — V33 — CAPITALE üst wordmark Outfit Light 300

- **Kullanıcı geri bildirimi:** V32 Source Serif 4 Medium hâlâ kaba; daha ince, narin, okunaklı ve CAPITALE'nin yazılım temasına uyan kurumsal font seçilsin ve uygulansın.
- **Tasarım karşılaştırması:** Aynı gerçek header logoda Manrope 400, Outfit 300, Plus Jakarta Sans 400, Montserrat 300 gerçek Google Font web yüklenerek test edildi. Daha ince ama okunur, modern ve premium denge nedeniyle **Outfit Light (300)** seçildi.
- **Yapılan değişiklik:** `client/src/components/CapitaleHeaderBrand.tsx` içinde CAPITALE yazısı `Outfit, Manrope, sans-serif` weight 300, desktop 22px letter spacing .145em, compact 20px .115em. `SOFTWARE INTELLIGENCE` alt satırı Manrope 600'e inceltildi, tracking desktop .15em. Turuncu sembol, header boyutu ve siyah arka plan korunuyor. Başka bileşen değiştirilmedi.
- **Yayın:** https://betcapitale.com/preview/home-v1/?v=33 — sadece preview. Canlı üretim frontend/backend SHA sabit; canlı siteye dokunulmadı.
- **QA:** TypeScript PASS, Vite PASS, preview HTML/JS/CSS HTTPS 200; Puppeteer 1825×864, 1440×900, 1200×800, 1024×768, 768×900, 430×932, 390×844, 320×640 testleri PASS. Outfit gerçek font-face loaded; mobil menüyle örtüşme, yatay taşma ya da JS hatası yok. Sayaç ilk fold altında, solda DATA STREAMS, dört anlatım metni, 3 workflow kutusu ve uyarı korundu.
- **Yedek:** `/srv/capitale-preview/home-v1.rollback-before-v33-outfit-light-20261121` (V32).
- **GitHub patch:** `deployments/betcapitale/home-preview-v32-to-v33-outfit-light-wordmark-20261121.patch`, commit `6e515f4f092e5a54d7d7527b1db022c4d04416ab`.
- **Ekran görüntüleri:** https://betcapitale.com/preview/home-v1/designer-v33-wordmark-desktop.png, https://betcapitale.com/preview/home-v1/designer-v33-wordmark-mobile.png ve ilk fold ekran görüntüleri.
- **Sonraki adım:** Kullanıcı V33 fontunu değerlendirir. Açık talimat olmadan ana siteye deploy edilmez.

## 7. Bundan sonra günlük kayıt formatı

Her yeni işten sonra bu belgenin **1. bölümündeki güncel durumu** yenile ve en alta aşağıdaki formatta yeni kayıt ekle. Mevcut tarihçeyi silme.

\`\`\`md
### YYYY-MM-DD — Vxx — [kısa başlık]
- Kullanıcı isteği:
- Değiştirilen gerçek dosyalar:
- Önizleme / üretim hedefi:
- Önceki sürüm ve yedek:
- Derleme ve tarayıcı/HTTP testleri:
- GitHub patch yolu ve commit:
- Gerçek ekran görüntüsü (varsa):
- Onay / eksik kalan konu:
- Bir sonraki adım:
\`\`\`

**Not:** Bu günlük proje dosyasıdır; araç kimlik bilgisi, şifre, token, gizli URL, gerçek kullanıcının özel verileri veya yetkisiz erişim ayrıntıları burada tutulmaz.
