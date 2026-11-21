# CAPITALE — TASARIMCI SOHBET VE DEVİR GÜNLÜĞÜ

**Sorumlu:** TASARIMCI  
**Belge amacı:** CAPITALE tasarımcısının sohbetler arası kalıcı belleği; yapılan bütün bilinen tasarım işleri, sürümler, onaylar, uygulanmış değişiklikler, doğrulamalar, yedekler ve sıradaki görevler.  
**Son güncelleme:** 21 Kasım 2026  
**Rol ve çalışma kuralları:** [tasarımcı.md](tasarımcı.md)  
**Anayasa:** [AGENTS.md](AGENTS.md) · [MILESTONE.md](MILESTONE.md)

> **SON DURUM — ÖNİZLEME V26 AKTİF: V18 KOMPAKT ÜÇ KUTU; MATCHES SIRASINDA ÖRNEK MAÇ/TERCİH, COUPONS SIRASINDA YÜZDESİZ 4.57/5.11 GİBİ ONDALIK ORAN, RESULTS SIRASINDA YEŞİL +€200 DEMO KÂR. V19–V21 REDDEDİLDİ. ANA SİTE DEĞİŞMEDİ.** Devam eden her tasarımda gerçek sunucu durumunu tekrar kontrol et. Bu belge geçmişi ve son devir durumunu taşır.

---

## 1. Şu an tam olarak nerede kaldık?

| Alan | Son doğrulanmış durum |
|---|---|
| Tasarımcı rolü | Doğrudan iş yapan, Commander kullanan **TASARIMCI**. Codex'e yönlendirme yok |
| Tasarım hedefi | Orijinal V18 premium kompakt workflow'u korumak; yeni animasyon mantığını ancak kullanıcı kararından sonra ve aşırı veri sıkıştırmadan geliştirmek |
| Aktif örnek site | **https://betcapitale.com/preview/home-v1/** |
| Güncel sürüm | **V26** (2026-11-21): V18 boyutlarında üç kutu; 15 sn MATCHES (kurgusal takım/tercih) → COUPONS (4.57, 5.11 gibi yüzdesiz örnek oran) → RESULTS (yeşil +€200) döngüsü |
| V18 ana başlık | **Use software to achieve** / **consistent daily profits.** |
| V18 başlık altı, 1 | **We do the planning. You enjoy the winning.** |
| V18 başlık altı, 2 | **Built on the right strategy for consistent long-term profits.** |
| Başlık renk/fontu | Mevcut DM Serif Display, koyu mürekkep + CAPITALE turuncusu. Alt metin Manrope |
| Üç CTA | Today's Matches, Community Voice, Calculate Profit — hizalar, renkler ve route'lar korunuyor |
| Sağdaki sistem | MARKET SPECIALIST / NEWS / ANALYST → CAPITALE → **V18 boyutlarında hep görünür üç kutu**; MATCHES: rastgele örnek maç/tercih, COUPONS: örnek ondalık stake/kupon oranı (yüzde değil), RESULTS: yeşil +€200 |
| Üst yazı ve prompt | «THE CAPITALE SYSTEM», «ILLUSTRATIVE PREVIEW» ve animasyonlu üst konuşma kutusu **V17'de silindi** |
| Analist alt metni | **REVIEWS STATISTICS** |
| Sahte veri uyarısı | **CONCEPT, NOT LIVE DATA** korunur; +€200 yalnızca kurgusal demo, gerçek bahis sonucu değildir; V19–V21 kupon detayları geri gelmedi |
| Üye sayacı | Hero altında yatay mevcut biçim; kaynak mantığına dokunulmadı |
| QA | V26 TSC/Vite PASS; HTTP 200; Puppeteer 1662/1200/768/390/320 px safhalar ve oran kontrolü PASS; üç kutu hep yerinde, demo uyarısı korunur. Yüzdelik değer kaldırıldı; canlı frontend/backend SHA sabit |
| Yayın sınırı | **Yalnızca önizleme**. Üretim sayfası ve \`dist/index.cjs\` değiştirilmedi |
| Üretime geçiş | **Henüz kullanıcı onayı verilmedi** — kendiliğinden yayınlama |
| V18 yedeği | V18 geri dönüş kaynağı: `/srv/capitale-preview/home-v1.rollback-animated-workflow-v19-20261121`; reddedilen V21 için yedek: `/srv/capitale-preview/home-v1.rollback-rejected-v21-before-v18-restoration-20261121` |

Önizlemenin son doğrulanmış bundle referansları (daha sonra değişebilir):
- JS: `/preview/home-v1/assets/index-CsEyJBau.js`
- CSS: `/preview/home-v1/assets/index-CqtrfdNd.css`
- İkisi de HTTPS 200 olarak görüldü; önizleme HTML 200, ana site HTTP 200, yetkisiz admin API 401.

**İlk iş olarak bu bilgilerin hâlâ güncel olduğunu doğrula.** Başka görev/sunucu deploy'u paralel gerçekleşebilir; sabit hash'e güvenme.

## 2. Tasarımcının teknik çalışma ortamı

- **GitHub depo:** \`hazardyk27-sudo/capitale\`, varsayılan dal \`main\`.
- **Sunucu erişimi:** Desktop Commander, bağlı cihaz adı **smartxflow**. Yetkili cihazları her oturumda yeniden listele. Root/admin gizli verilerini GitHub belgesine koyma.
- **Canlı site:** \`https://betcapitale.com/\`
- **Önizleme:** \`https://betcapitale.com/preview/home-v1/\`
- **Önizleme statik dosyaları:** \`/srv/capitale-preview/home-v1\`
- **Aktif V26 çalışma kopyası:** `/opt/capitale-software-en-60048de8ba8f9736466a0d5ca13594d6b9023d87/betcapitale-home-preview-copy-designer-v26-decimal-odds-work`. (V24 önceki sürüm olarak korunmuştur.)
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
