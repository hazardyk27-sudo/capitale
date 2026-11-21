# CAPITALE — TASARIMCI SOHBET VE DEVİR GÜNLÜĞÜ

**Sorumlu:** TASARIMCI  
**Belge amacı:** CAPITALE tasarımcısının sohbetler arası kalıcı belleği; yapılan bütün bilinen tasarım işleri, sürümler, onaylar, uygulanmış değişiklikler, doğrulamalar, yedekler ve sıradaki görevler.  
**Son güncelleme:** 22 Kasım 2026 · Match List v2 V8 orijinal CAPITALE sembolü ve Match List v1 sonuç mekanizması CANLI  
**Rol ve çalışma kuralları:** [tasarımcı.md](tasarımcı.md)  
**Anayasa:** [AGENTS.md](AGENTS.md) · [MILESTONE.md](MILESTONE.md)

> **SON DURUM — V33 KULLANICI ONAYIYLA CANLIYA AKTARILDI (2026-11-21). `https://betcapitale.com/` ANA SAYFASI V33 HERO İLE ÇALIŞIYOR. Outfit Light logo, 3 kaynak, merkez CAPITALE simgesi, 4 açıklama adımı, 4 demo maç/oran/kâr senaryosu ve sayaç ilk-fold düzeltmesi yayında. DİĞER ROTALARIN ORIGINAL FRONTEND PAKETİ, AUTH/ADMIN YAZILIMI, ANALYTICS/IMPORTMAP VE BACKEND DEĞİŞMEDİ. Canlı HTML rollback yedeği hazır; masaüstü/mobil/rotalar/animasyonlar test edildi. Önizleme de ayrıca V33 olarak korunuyor.** Devam eden her tasarımda gerçek sunucu durumunu tekrar kontrol et. Bu belge geçmişi ve son devir durumunu taşır.

**Güncel ek bilgi — 22.11.2026:** **Admin / Match List v2 V8 CANLI.** Kullanıcının 5.07 saniyelik yönetim paneli videosu izlenerek `Match List v1` kaynak kodunun `Maç Öncesi` / `Sonuç` davranışı doğrulandı. V2 artık aynı mevcut `variant` üzerinden `prematch` modunda maçın saatini, `result` modunda `today_matches.result` gerçek statüsünden **WON (yeşil) / LOST (kırmızı) / VOID veya PENDING (gri)** gösteriyor; başlık `Today's Results` oluyor. Üstte halihazırda site üzerinde bulunan turuncu `/capitale-premium-symbol.svg` ile ince Georgia serif **CAPITALE** kelimesi kullanıldı (kullanıcının logo referansına göre). Mevcut beyaz/açık gri/turuncu marka paleti ve V7 metrik düzeni korundu. Kartlar **6–15 maç** için story/post ölçülerine göre ayarlandı. Production testinde 6/6 senaryo PASS, tüm logolar yüklendi. Software v16, site backend ve maç/rapor kayıtları değişmedi; V7 rollback mevcut.

---

## 1. Şu an tam olarak nerede kaldık?

| Alan | Son doğrulanmış durum |
|---|---|
| Match List v2 (CANLI) | **V8 results + brand, 22.11.2026 LIVE:** `/admin` → Social Media → Match List v2. **Maç Öncesi:** son sütunda kickoff; **Sonuç:** v1 ile aynı `result` kaydından WON/LOST/VOID/PENDING ve başlık `Today's Results`. Üstte turuncu orijinal CAPITALE sembolü, siyah zarif Georgia serif CAPITALE yazısı. Beyaz/turuncu V7 tema ve kaynak-backed SXF/A/V/N/B/O korunur. 6/10/15 maç için story 1080×1920 ve post 1080×1350 ölçeklenir. 6 canlı-alan adı mock-only QA PASS; Software v16/backend aynı. |
| Tasarımcı rolü | Doğrudan iş yapan, Commander kullanan **TASARIMCI**. Codex'e yönlendirme yok |
| Tasarım hedefi | Orijinal V18 premium kompakt workflow'u korumak; yeni animasyon mantığını ancak kullanıcı kararından sonra ve aşırı veri sıkıştırmadan geliştirmek |
| Canlı ana site | **https://betcapitale.com/** — kullanıcının açık onayıyla V33 hero aktarıldı; diğer route'lar mevcut üretim paketlerinde |
| Aktif örnek site | **https://betcapitale.com/preview/home-v1/** (V33 tasarım önizlemesi korunuyor) |
| Güncel sürüm | **V33 LIVE** (2026-11-21): 4 font arasından seçilen Outfit Light 300 wordmark, V18 kompakt 3 sütunlu workflow + 4 demo senaryo ve 15sn döngü, hero sol/sağ akış ve sayaç ilk fold altında; canlı `betcapitale.com/` ana sayfasında. Önizleme V33 aynen duruyor |
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
| QA | V33 LIVE: production-safe TSC/Vite PASS; canlı farklı ekranlarda 1825/1440/1200/1024/768/430/390/320px PASS; 4 demo senaryo ve tam döngü iki ekranda, reduced motion, Today/History/Plans/Free Bet/How It Works/Login/Admin Software GET ve gerçek menü tıklaması PASS; JS fatal hata/taşma yok; **backend SHA değişmedi** |
| Yayın sınırı | **Kullanıcı 2026-11-21'de canlı ana sayfaya açık onay verdi**; yalnızca production `dist/public/index.html` atomik değişti ve 55 yeni hashed statik dosya eklendi. Önceki paketlerin üzerine yazılmadı; `dist/index.cjs` backend değişmedi |
| Üretime geçiş | **TAMAMLANDI:** V33 hero `https://betcapitale.com/` canlı. Sonraki tasarım değişiklikleri ayrıca izin verilmedikçe varsayılan olarak yalnızca preview'a uygulanır |
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

### 2026-11-21 — V33 canlı ana sayfa aktarımı (kullanıcı onaylı)

- **Talimat:** Kullanıcı V33 hero tasarımını *hatasız ve birebir* gerçek `betcapitale.com` ana sayfasına aktar dedi. Bu, önceki preview-only sınırına verilen açık canlı yayın onayıdır.
- **Üretim-safe entegrasyon:** Önizlemenin React root içindeki GET-only read-only davranışı *canlıya alınmadı*. Gerçek `App` girişi ile V33 home üretim derlemesi yapıldı; önizlemedeki 35px uyarı bandı canlıda olmadığından sayaç fold offsetleri üretim için 35px uyarlandı.
- **Yayın yöntemi:** Production `index.html` içindeki analytics, SEO, Meta/Reddit pixel, ikonlar, admin software scroll bootstrap ve importmap korunarak yalnızca root bundle seçimi eklendi. `/` = V33 ana sayfa paketi `/assets/index-DFn7x5WA.js` + `/assets/index-DEhu_p5g.css`. Diğer rotalar = önceki production `/assets/index-Bg9uIRfV.js` + `/assets/index-DCOG0Mgo.css`. Ana sayfa sınırını geçen SPA navigasyonları tam sayfa geçişi ile izole, farklı React sürümleri karışmıyor. Admin patched `admin-software-logo-layout-v6-20261121.js` aynı kaldı. **55 adet yeni hashed statik asset eklendi; eski paketler, backend ve servis restartı yok.**
- **İşlemi gerçekleştiren yetkili sunucu:** Desktop Commander/smartxflow. Production: `/app/betcapitale/dist/public/index.html`. Production-safe kaynak: `/opt/capitale-software-en-60048de8ba8f9736466a0d5ca13594d6b9023d87/betcapitale-live-hero-v33-production-safe-20261121-work`. V33 preview kaynakları ve önizleme bağımsız şekilde korunuyor.
- **Düzeltme:** Önizleme banner'ından kaynaklanan ilk-fold farkı production CSS'de düzeltildi; sayaç ilk ekrandan kayboldu, aşağı kaydırınca görünüyor.
- **Canlı testler:** TypeScript ve Vite build PASS. Ana sayfa HTTPS 200, 320–1825px aralığında responsive/Outfit fontu/4 adım/3 kutu/sayaç PASS. 1.8s MATCHES, 6.5s COUPONS, 12s RESULTS animasyon PASS; 4 senaryonun tamamı ve başa dönüş 1440/390px PASS: Roma–Inter / BTTS YES / 4.57 / +€200; Ajax–PSV / OVER 2.5 / 5.11 / +€356; Lille–Lyon / FT 1 / 4.82 / +€148; Porto–Braga / OVER 2.5 / 5.06 / +€427. Reduced motion PASS. Real-link `/`→`/today`→`/` 1440/390px PASS. `/today`, `/free-bet`, `/history`, `/plans`, `/how-it-works`, `/login`, `/admin/software` guest smoke PASS. `admin/software` patch v6 kaynak JS HTTP 200. Tarayıcı fatal JS hata/taşma yok. **Kimliği doğrulanmış admin yazma eylemleri veya ödeme akışları otomatik test edilmedi**; backend değişmedi.
- **Backend hash değişmedi:** `79b0bed37aed965979fc0d0bc6c093c4dcfe07a59934096cc65f2fb5c7ce3832`. Orijinal live HTML SHA `fb22c27e5c24d225bb720b7bfdf0c56c9b9bb60a451ced1917cc763c10dab61a`; yeni HTML SHA `b042ef7dcabb050277d11b5bb45ac1ca2925f71c9312fe5455cb9d59a67eeec7`.
- **Rollback:** `/app/betcapitale/rollback-hero-v33-prod-20261121/index.html`; dosya listesi `added-asset-names.txt`; eski dosyalar hash adlarıyla yerinde. Backend rollback gerekmez.
- **GitHub:** `deployments/betcapitale/home-v33-preview-to-production-safe-20261121.patch` (commit `7ebf0e0058775f4f04a0cd41dfa86ff0c0a34fd8`), `deployments/betcapitale/home-v33-production-index-router-20261121.patch` (`7d6bbd05a4893ba10e53bbcfb8cc965bdd092be3`), `deployments/betcapitale/home-v33-production-deploy-report-20261121.md` (`a4db278430e59b61525c5595efca24503f7e841c`).
- **Bir sonraki adım:** Canlı hero'ya yeni değişiklik talebi gelirse önce preview üzerinde ayrı sürüm; açık kullanıcı emri olmadan yönetim sayfası ve backend'e müdahale etme.

### 2026-11-21 — Match List v2 canlı otomatik Software metrikleri ve takım logoları

- **Kullanıcı talimatı:** `/admin` → Social Media → Match List v2 maçları kuponlardan geliyor. Her maçın Software'daki gerçek `SIGNAL`, `T-6/T-8`, `V`, `A`, `N`, `B`, `O Δ` değerleri manuel girişsiz otomatik dolsun; varsa takım logoları da eklensin.
- **Uygulama:** `client/src/pages/admin-social-media.tsx` yenilendi: aynı yönetici oturumuyla Software `/api/admin/software` kaynak-backed yanıtı okunuyor, tarih ve iki takım adına göre deterministik eşleşme yapılıyor. `client/src/lib/match-list-v2-auto.ts` eklendi. Saat dilimi belirsiz `today_matches.kickoff_at` alanı, UTC Software saatini haksız yere elemek için kullanılmıyor. Çoklu market veya çelişen rapor eşleşmeleri fail-closed `ambiguous` kalıyor; hiçbir sentetik/demo veya tarayıcı localStorage metriği gerçek değere dönüştürülmüyor.
- **Tasarım:** `client/src/components/match-list-template-2.tsx` güncellendi. Maç altına `SIGNAL`, `T`, `V`, `A`, `N`, `B`, `O Δ` etiketli 7 kompakt veri hücresi, kaynağı doğrulanan değerler ve kaynak yoksa `—`; takımlarda `/team-logos/current-fixture-coverage.json` manifestinden güvenilir yerel logo varsa gösteriliyor, aksi durumda önceki harfli simge. Mevcut 108 logo kapsamı. Admin sol panelindeki beş manuel metrik inputu yerine otomatik kaynak durumu, eşleşen/eksik/belirsiz sayıları ve `Refresh Software values` butonu.
- **Veri gerçeği:** 21.11.2026 tarihinde Software kaynağında 60 run, 60 SXF sinyali / V; NEWS ve ANALYST raporu henüz 0 olduğu için A/N gerçek veri gelinceye kadar boş. Site `today_matches` tablosunda aynı gün 10 maç, Software feedinde bu isimlerden 7'si var; bu 7'sinin otomatik gösterimi market/versiyon benzersizliği şartına bağlıdır. Sonuç uydurulmaz.
- **Canlı deploy izolasyonu:** Eski production `/assets/admin-social-media-BufGLmZ1.js` dosyası silinmedi/değiştirilmedi. Sadece yeni `/assets/admin-social-media-v2-auto-20261121.js` eklendi ve production `index.html` importmap'ine tek alias girildi; mevcut Software v13 üç aliası korunuyor. Ana sayfa V33, `/admin/software`, kuponlar, Today, backend `dist/index.cjs` veya Supabase tabloları değiştirilmedi.
- **Rollback:** `/app/betcapitale/rollback-matchlist-v2-software-auto-logos-20261121/index.html` eski HTML; tek atomik dosya geri dönüşü yeterli. HTML SHA önce `a2156310d4a9d0f59c7fb7431ed06568ab57e593ca37d63ab97df4ce1ed93ad0`, sonra `87409c6ce727a54803a9ef488ffd82050740be708608d1fc7b9e6ee16523ed01`. Backend SHA sabit: `79b0bed37aed965979fc0d0bc6c093c4dcfe07a59934096cc65f2fb5c7ce3832`.
- **QA:** `tsc --noEmit` PASS, Vite PASS, 13 birim doğrulama grubu PASS. Staging ve gerçek alan adında *yalnızca test tarayıcısı içinde mocklanan* Software/today API cevaplarıyla 2 matched/1 ambiguous senaryosu, logo yükleme (Chelsea/Leeds), A/N görünürlük, kaynak kapalıyken boş metrikler, 1080px grafik, fatal JS hatasız PASS. Guest smoke `/`, `/admin`, `/admin/social-media`, `/admin/software`, `/today`, `/plans` PASS. Üretim kullanıcı oturumuyla admin export/save testi yapılmadı; gerçek raporlara veya kuponlara hiçbir test yazımı yapılmadı.
- **GitHub kaynak ve raporlar:** `deployments/betcapitale/admin-matchlist-v2-auto-software-logos-20261121.patch` (commit `98a148d27917ca55ae2c272a1b5d4246067c0c26`), `deployments/betcapitale/admin-matchlist-v2-live-importmap-20261121.patch` (`5acf2f8d577e3c451a1aa46e3c0dff895f69792b`), `deployments/betcapitale/admin-matchlist-v2-auto-live-20261121-report.md` (`7648904896bde6f329f1388a08faf085237210c2`).
- **Gelecek adım:** Kullanıcı gerçek oturumunda Match List v2'yi ve Instagram dışa aktarma sonuçlarını kontrol etsin. Sonraki değişiklikler için mevcut live SHA ve başka agent deploy'ları tekrar karşılaştırılsın.

### 2026-11-21 — Match List v2 V3 premium görsel düzeltmesi + 20 takım logosu (CANLI)

- **Geri bildirim:** Kullanıcı 1080×1920 story görselinin gereksiz boşluklu, okunaksız ve eksik logolu olduğunu belirtti; değerlerin de eksik görünmesini istedi. Önceki 7/10 SXF kaydı vardı; A/N yok ve bazı takım logoları örtüşmüyordu.
- **Yapılan tasarım:** Match List v2 kartları 10 maçlık story akışına göre yeniden yerleştirildi. `CAPITALE · SOFTWARE INTELLIGENCE` üst imzası, daha temiz başlık/hiyerarşi, büyük kulüp logoları + takım isimleri, belirgin SXF kodu/T-6/T-8 ve insan-okur seçimi (`1X2 home` → `HOME WIN`), daha büyük üç sayı grubu `FLOW · V`, `DRAW · B`, `ODDS Δ`, A/N sadece gerçek rapor varsa, veri yoksa `PENDING/NO VERIFIED SOFTWARE RECORD` olarak dürüst gösterim.
- **Logolar:** Eksik 12 gerçek kulüp logosu TheSportsDB ve ESPN futbol takım verisiyle isim/lig eşleştirmesi yapılarak indirildi ve üretim `team-logos/` altına eklendi: Aston Villa, Sunderland, Tottenham, Ipswich, Grazer AK, Rapid Vienna, Sion, Servette, Motherwell, Rangers, FC Groningen, Heerenveen. Versioned yeni manifest `/team-logos/current-fixture-coverage-v2.json`; katalog **108 → 120 takım**. 21.11.2026 tarihli 10 maçta 20/20 logo, Puppeteer PNG export önizlemesinde `naturalWidth>0` ile doğrulandı.
- **Asıl veri açıklaması:** Supabase Software feed kaynağında 60 SXF run/sinyal/V mevcut; A ve N için sıfır tamamlanmış rapor; Today 10 maçın 7'si Software fixture adlarıyla eşleşir. 3 mevcut kaynak eşleşmeyen maçın sinyalleri, A/N ve raporlar **rastgele üretilmedi**. Çoklu seçim eşleşmeleri hâlâ fail-closed.
- **Kapsam/yayın:** Önceki tasarım çalışma klasörünün kopyası: `/opt/capitale-software-en-60048de8ba8f9736466a0d5ca13594d6b9023d87/betcapitale-admin-matchlist-v2-premium-fix-20261121-work`. Yalnızca yeni `/assets/admin-social-media-v3-premium-20261121.js` ve 12 PNG + tek v2 JSON eklendi; production HTML `importmap` yalnızca V2 → V3 social-media aliasını değiştirdi. Ana sayfa V33, Software v13, TODAY/Coupon/CSS/analiz motorları ve `dist/index.cjs` aynı kaldı.
- **QA:** `tsc --noEmit` PASS, Vite PASS, 13 birim test grubu PASS; test tarayıcısı üzerinde 1080×1920 10 maç / 20 logo + kaynak yokken boş değer / overflow 2/2 PASS; canlı domain üzerinde API yanıtları yalnızca test tarayıcısında mocklanarak aynı test tekrar 2/2 PASS. `/`, `/admin`, `/admin/social-media`, `/admin/software`, `/today`, `/plans` HTTP 200 ve sayfa smoke PASS. Gerçek admin login altında PNG save/download ayrı manuel test edilmedi; veri/bahis kayıtlarına test yazımı olmadı.
- **Rollback:** `/app/betcapitale/rollback-matchlist-v2-premium-20261121/index.html`; canlı indeks atomik geri döndürülebilir. Eski index SHA `87409c6ce727a54803a9ef488ffd82050740be708608d1fc7b9e6ee16523ed01`; V3 index SHA `9bb028ef51abf19ba2df9cb3c03142cf90e9c7efb393ac9e48dba0939104329b`. Backend SHA değişmedi: `79b0bed37aed965979fc0d0bc6c093c4dcfe07a59934096cc65f2fb5c7ce3832`.
- **GitHub versiyon kaydı:** `deployments/betcapitale/matchlist-v2-premium-visual-and-crest-fix-20261121.patch` (`5a967da4f80a47c23ff4536b9c1c889c9e8e264a`), `deployments/betcapitale/matchlist-v2-premium-v3-importmap-20261121.patch` (`eecae4a4f8be91d643c057fe30f0014e3f12ee5e`), `deployments/betcapitale/matchlist-v2-premium-v3-crest-catalog-20261121.json` (`f00557189dbf8a491ef3f46799fd0baa18f0683d`), `deployments/betcapitale/matchlist-v2-premium-v3-crest-provenance-20261121.json` (`c199fa41286e11fc88f7066e3d2685817f87c959`), `deployments/betcapitale/matchlist-v2-premium-v3-live-report-20261121.md` (`b964c041591652435901b57d900d1cd67c6ea2a5`).
- **Sonraki adım:** Kullanıcı gerçek yönetici oturumunda JPG/PNG indirme ve görünümü kontrol etsin. Yeni A/N raporları kaydedildikçe yazılım tarafından otomatik taşınır. Doğrulanmış veri olmayan maçlar boş kalır; gerekirse önce SXF veri kaynağı tamamlanır.

### 2026-11-21 — Match List v2 V4 LIVE — Dikey logo/isimler ve sağda SXF veri paneli

- **Kullanıcı referansı ve talebi:** V3'te takım isimleri/logoları birbirinden uzak kaldı. Ev sahibi logo+isim **üstte**, deplasman logo+isim **hemen altında** olmalı; **sağ tarafta** Software'dan gelen sinyal kodu, T ve veriler bulunmalı. Daha ilgi çekici ama CAPITALE kurumsal/minimal teması korunmalı.
- **Tasarım:** `client/src/components/match-list-template-2.tsx` kartı iki kolonlu yapıya geçirildi: %44 sol dikey iki takım, %56 sağ açık gri entegre veri paneli. Üst satırda lig/kickoff, sağ üst SXF sinyal/T-6/T-8 ve insan-okur seçim (`HOME WIN`), alt metriklerde `V · FLOW`, `B · DRAW`, `ODDS Δ`. Geniş story panelinde gerçek kaynaktan gelirse A/N bilgi satırı; dar post panelinde üçüncü satır sıkışmasın diye aynı 5 metrik tek sırada (`V/B/ODDS/A/N`). Doğrulanmış maçlarda hafif turuncu sol vurgusu, veri olmayanlarda gri çizgi ve PENDING. Eski iki uca dağılmış isimler, gereksiz ortadaki VS boşluğu kaldırıldı.
- **Veri:** V2/V3'teki gerçek Software eşleştirme kuralları, 120 yerel kulüp logolu manifest ve tüm kaynak güvenlik kontrolleri aynen korundu. 21.11'de Software kaydına eşleşen 7/10 fixture için mevcut veriler; diğer 3 fixture ve NEWS/ANALYST puanları kaynakta yoksa **boş**. Demo/random gerçekmiş gibi gösterilmedi, veritabanına müdahale edilmedi.
- **Derleme/test:** TypeScript `tsc --noEmit` PASS; Vite PASS; 13 saf eşleştirme birim testi PASS. İzole tarayıcıyla 1080×1920 story'de 10 kart/20 sağlam logo; kaynak bağlı/bağlı değil senaryoları 2/2 PASS. 1080×1350 post 10 kart + 5 metriklik kompakt panel PASS. Aynı testler canlı betcapitale.com üzerinde **yalnızca QA tarayıcısında mock veri** ile story 2/2 ve post 1/1 PASS; canlı veri değiştirilmedi. Guest `/`, `/admin`, `/admin/social-media`, `/admin/software`, `/today`, `/plans` smoke PASS (auth olmadan admin sosyal chunk'ı bazen yüklenmez; mocked-auth testi modülü gerçekten yükleyip ekranı doğruladı). Fatal JS hata veya tam sayfa taşması yok. Gerçek admin PNG indirme kullanıcı oturumunda ayrıca yapılmadı.
- **Canlı yayın/izolasyon:** Sunucu `smartxflow`, izole kaynak kopyası: `/opt/capitale-software-en-60048de8ba8f9736466a0d5ca13594d6b9023d87/betcapitale-admin-matchlist-v2-stacked-clubs-v4-20261121-work`. Yeni JS `/assets/admin-social-media-v4-stacked-clubs-20261121.js` olarak eklendi; eski V3 ve diğer dosyalar yerinde kaldı. Production `index.html` içindeki tek importmap hedefi V3→V4 değiştirildi. Ana site V33, Software v13, Today, Plans, backend ve Supabase tabloları değiştirilmedi.
- **Rollback:** `/app/betcapitale/rollback-matchlist-v2-stacked-v4-20261121/index.html` (V3). Eski HTML SHA `9bb028ef51abf19ba2df9cb3c03142cf90e9c7efb393ac9e48dba0939104329b`; yeni HTML SHA `dd823863cc47f29e2aa75d4f96ec36ed4d97b774e8eda9dfe19c43513e51495f`. Backend SHA hâlâ `79b0bed37aed965979fc0d0bc6c093c4dcfe07a59934096cc65f2fb5c7ce3832`.
- **GitHub:** `deployments/betcapitale/matchlist-v3-to-v4-stacked-clubs-20261121.patch` commit `2dbab783c2c4093227a90a22e2e050a7a4ae285f`; `deployments/betcapitale/matchlist-v4-production-importmap-20261121.patch` commit `9b7d656076cd65301c4c7c7e83066153ff332364`; `deployments/betcapitale/matchlist-v4-stacked-clubs-live-20261121.md` commit `d82e1670f4d49db7bbb30798087cb298e4faebee`.
- **İleri adım:** Kullanıcı gerçek `/admin` oturumunda Match List v2'nin story/post görüntüsünü ve indirilen PNG'yi kontrol etsin; yeni değişiklikte önce mevcut live SHA kontrol edilsin.

### 2026-11-21 — Match List v2 V5 LIVE — Referans tek satır ve A/V/N/B/O

- **Talimat:** Kullanıcı V4'ün sağ veri panelini reddetti, orijinal referansta görünen ince yatay satırları istedi; **tercih, seçenek, ekstra açıklamalar ve istemediği diğer yazılar olmayacak**. Referans sırası: `01 | iki logo | Chelsea – Leeds | MOM-8 | A | V | N | B | [eklenmiş O] | 16:00`. MOM-8 sadece referans örneği; gerçek kaynak MOM-6 geliyorsa MOM-6 gösterilir, kod uydurulmaz.
- **Yapılan:** `client/src/components/match-list-template-2.tsx` V4'ten ayrı V5 klasöründe yeniden yazıldı. 10 sütun: sıra numarası, yan yana gerçek kulüp logoları, tek satır maç adı, kaynağa uygun renkte sinyal rozeti, A, V, N, B, O, sağda saat. Artık maç başına lig satırı, SXF+T ayrı bölümü, bet seçimi (HOME WIN/BTTS), source/pending/review, büyük metrik kutuları ve açıklama yok. Sadece üst CAPITALE/Today's matches/tarih/maç sayısı ve sade footer kaldı. Uzun isimlerin story'de kırpılmaması için karakter uzunluğuna göre font küçültülüyor.
- **Veri:** Eski deterministik Software/API ve yerel logoları eşleştiren kod değişmedi. 120 kulüp ve 20/20 görüntü. A/N 0–100 destek puanı doğrulanırsa görselde yüzde ölçeğinde gösteriliyor, bunlar olasılık tahmini değildir. Kaynaksız değer `—`; herhangi bir A/N skoru veya sinyal **random doldurulmadı**.
- **Canlı yayın:** `smartxflow` Desktop Commander; kaynak `/opt/capitale-software-en-60048de8ba8f9736466a0d5ca13594d6b9023d87/betcapitale-admin-matchlist-v2-reference-row-v5-20261121-work`. Eski V4 JS ve başka paketler korunarak `/assets/admin-social-media-v5-reference-row-20261121.js` eklendi. Production `/app/betcapitale/dist/public/index.html` içindeki **tek importmap aliası** `admin-social-media-BufGLmZ1.js` V4→V5 yapıldı. İlk kontrol sabit V4 SHA beklerken durdu: paralel Software agent zaten v13→v15'e geçirmişti. Yeniden kontrol edildi; **Software v15'in üç aliası** ve tüm diğer index içerikleri korundu, sadece social alias değişti. Backend/service/Supabase değişmedi.
- **Testler:** `tasarımcı.md` ve `tasarımcı-sohbet.md` yeni sohbette tekrar okundu; `AGENTS.md`/`MILESTONE.md` kuralları kontrol edildi. TypeScript PASS, Vite PASS, 13 kaynak birim testi PASS, staging story bağlı/bağlı değil 2/2 PASS ve post 1/1 PASS. Aynı testler gerçek domain üzerinde **yalnızca test tarayıcısında mock veri** ile 2/2 story ve 1/1 post PASS; 10 satır, 20/20 logo, 1080×1920 ve 1080×1350 ölçüleri, extra yazı sızıntısı yok, fatal JS hata ve taşma yok. Guest `/`, `/admin`, `/admin/social-media`, `/admin/software`, `/today`, `/plans` HTTP 200 ve root yükleniyor. `/admin/social-media` misafir oturumunda chunk yetki kontrolünden ötürü yüklenmeyebilir; mock-admin testinde tam sayfa görüldü. Gerçek admin PNG dışa aktarma/save işlemi tetiklenmedi.
- **Rollback/Hash:** `/app/betcapitale/rollback-matchlist-v2-reference-row-v5-20261121/index.html` (V4+Software v15), prelive `d9f99c3a610879ba6e8ff108e20de6d93bc2b27e9c7f66eacf1f7bc5c1b49db9` → V5 `02e58c35afcab7f17b9a1c82d88c7b842fd89510e9ff767227d24a4dfaa40fec`. Backend `79b0bed37aed965979fc0d0bc6c093c4dcfe07a59934096cc65f2fb5c7ce3832` aynı.
- **GitHub:** `deployments/betcapitale/matchlist-v4-to-v5-reference-single-row-20261121.patch` commit `f2a7644ba0a36cfdb9d7b48a1328647ef2b63613`; `deployments/betcapitale/matchlist-v5-production-importmap-20261121.patch` `6294155e3ff61694a3888724ffe1fe7d5815169f`; `deployments/betcapitale/matchlist-v5-reference-single-row-live-20261121.md` `7c9ac5cc0567a0ac374311a08d0da955e5e151a8`.
- **Bir sonraki adım:** Kullanıcı kendi yönetici oturumunda Match List v2'yi ve indirilen PNG'yi kontrol etsin. Yeni tasarım değişikliği istenirse tek tek kod/alanlardan çıkmadan V5 referans sırası korunmalı.

### 2026-11-21 — Match List v2 V6 premium scoreboard · CANLI

- **Kullanıcı geri bildirimi:** V5 beyaz temalı, büyük boşluklu kartlar ve dağınık küçük metriklerle ruhsuz kaldı. Kullanıcı örnek araştırması yapıp **dolu dolu, premium ve dikkat çekici** görselle yenilenmesini istedi. Önceki açık içerik sınırı korundu: yalnızca sıra, logolar, maç ismi, sinyal, A/V/N/B/O ve saat.
- **Dış araştırma:** FotMob okunabilir futbol veri hiyerarşisi (`https://dezzayn.com/apps/fotmob`), koyu spor dashboard'u (`https://dribbble.com/shots/27043428-Live-Sports-Dashboard-UI-Design`) ve koyu fikstür tasarımı (`https://dribbble.com/shots/27234202-Football-Match-Dashboard-UI`) incelendi. Estetik ilham alındı; marka veya üçüncü taraf grafik kopyalanmadı.
- **Tasarımın gerçek kaynağı:** `client/src/components/match-list-template-2.tsx` V5'ten ayrı `/opt/capitale-software-en-60048de8ba8f9736466a0d5ca13594d6b9023d87/betcapitale-admin-matchlist-v2-premium-scoreboard-v6-20261121-work` klasöründe değiştirildi. CAPITALE koyu lacivert başlık paneli, beyaz serif Today's matches, turuncu çizgi/count; 10 kart için yatay olarak genişletilmiş premium lacivert satırlar, yerel kulüp logoları beyaz taşıyıcılı, fontları büyümüş tam maç isimleri, sinyale özel renkli rozet, A/V/N/B/O rakamlarını ayrı kontrastlı 5 kutu, turuncu saat; oran hareketi artış yeşil/düşüş kırmızı. Gereksiz içeriğe geri dönülmedi.
- **İsim/uyum:** İlk V6 story testinde uzun takım isimlerinin sığmadığı görüldü; adaptif font + maksimum iki satır aynı kartta render edildi. Sadece uzun adlar kırılır; metin tam kalır. Story 1080×1920 ve Post 1080×1350 için ayrı yükseklik/font parametreleri uygulandı. Boş son üçte birlik bölge doldu, kartlar görselin altına yayıldı.
- **Veri:** Eski `client/src/lib/match-list-v2-auto.ts` ve sayfanın doğrulanmış Software API eşleştirmesi değiştirilmedi; 120 kulüplü yerel logo manifesti aynen. A/N raporu gerçekten yoksa `—`. Hiçbir skor, sinyal, kâr veya oran uydurulmadı. Gösterilen SXF kodlarının sıra/hiyerarşisi kaynaktan geliyor.
- **Test:** TypeScript PASS, Vite PASS, 13 birim test grubu PASS. İzole sahte verili test *yalnızca test tarayıcısında* story connected/unavailable 2/2 PASS, post connected 1/1 PASS; 10/10 kart, 20/20 gerçek yerel logo, uzun adlarda taşma yok, içerik sınırı korunuyor. Canlı `betcapitale.com/admin/social-media` üzerinde mock-only browser testleri yine story 2/2, post 1/1 PASS. `/`, `/admin`, `/admin/social-media`, `/admin/software`, `/today`, `/plans` guest smoke PASS; JS fatal hata/yatay taşma yok. **Gerçek admin oturumuyla PNG indirme yapılmadı**; görsel DOM ekran görüntüleri 1080×1920 ve 1080×1350 test edildi.
- **Yayın güvenliği:** Eski V5 dosyası değiştirilmeden yeni `/assets/admin-social-media-v6-premium-20261121.js` eklendi. Üretim `index.html` içindeki yalnızca `admin-social-media-BufGLmZ1.js` importmap aliası V5→V6 yapıldı. Önceden bir başkası tarafından yükseltilmiş **Software v16** üç aliası aynı kaldı. Ana sayfa V33, diğer admin modülleri, Today, ödeme, backend `dist/index.cjs`, Supabase, site analiz motoru değiştirilmedi. Servis restartı yapılmadı.
- **Rollback:** `/app/betcapitale/rollback-matchlist-v2-premium-scoreboard-v6-20261121/index.html` (V5 + Software v16). Önceki index SHA `8aed4fcac7b3d7a9a9e96c957aa2d1532ae7ff2cb215f36036b1a6800df545a4`, yeni index SHA `63e314da4a90ed94d35340d845b54b6abfb279bcb9d679f17602025bcbf95db4`; backend SHA `79b0bed37aed965979fc0d0bc6c093c4dcfe07a59934096cc65f2fb5c7ce3832` değişmedi.
- **GitHub:** Kaynak patch `deployments/betcapitale/matchlist-v5-to-v6-premium-scoreboard-20261121.patch` commit `43393d28e314f4a26a9e421a99dd46e9bb74ca7f`; yalnızca HTML importmap farkı `deployments/betcapitale/matchlist-v6-premium-production-importmap-20261121.patch` `afe67236efafb50bce6cd96c515439f11adcb45a`; tam rapor `deployments/betcapitale/matchlist-v6-premium-scoreboard-live-20261121.md` `54445fa2591f71fa4aa7d7cdeec887c5fb0ad79d`.
- **Devam:** Kullanıcı gerçek yönetici oturumunda export görüntüsünü gözden geçirsin; kullanıcı yeni revizyon istemedikçe V6 kaynağı ve Software v16 korunmalı.

### 2026-11-21 — Match List v2 V7 — Eski CAPITALE renkleri geri döndü (CANLI)

- **Kullanıcı kararı:** V6 koyu lacivert tasarım CAPITALE renk kimliğine uymuyor. Kullanıcı **önce sadece renkleri eski beyaz/açık gri/turuncu hale getir; sonra tasarımı tekrar bakalım** dedi. Bu aşamada yeni tasarım fikirleri veya yapısal değişiklikler uygulanmayacak.
- **Tam uygulama:** V6 çalışma klasörünün izolasyon kopyası `/opt/capitale-software-en-60048de8ba8f9736466a0d5ca13594d6b9023d87/betcapitale-admin-matchlist-v2-original-colors-v7-20261121-work`. **Sadece** `client/src/components/match-list-template-2.tsx` üzerinde 21 kontrollü renk paleti değişimi: koyu hero → beyaz sıcak tonlu başlık, koyu kart → beyaz ince gri kenarlı kart, koyu yazı, turuncu CAPITALE vurgusu ve saat, veri kutuları açık gri; O artı yeşil/eksi kırmızı. SXF sinyal renkleri aynen kaldı. Maç listesi kolonları, boyutlar, tam isim, logolar, kaynak ve otomatik eşleştirme değiştirilmedi; bahis tercihi ve ek bilgi eklenmedi.
- **Testler:** TypeScript PASS, Vite PASS, 13 kaynak birim test grubu PASS. Staging ve canlı domain mock-only test tarayıcısında story bağlı/bağlı değil 2/2 ve post 1/1 PASS; 10 maç, 20/20 logo, uzun isimler kesilmedi, 1080×1920/1350 tam görsellerde taşma/hata yok. Public route smoke `/`, `/admin`, `/admin/social-media`, `/admin/software`, `/today`, `/plans` PASS. Canlı gerçek admin PNG download/save ayrıca test edilmedi; üretim raporlarına test verisi yazılmadı.
- **Deploy:** Yeni immutable `/assets/admin-social-media-v7-restored-colors-20261121.js`; production `index.html` importmap'inde **yalnızca tek social module V6→V7** yönlendirmesi. Başka agentın güncel **Software v16** üç aliası, V33 ana sayfa, backend, Supabase, gerçek raporlar ve diğer rotalar aynı kaldı.
- **Rollback/hash:** `/app/betcapitale/rollback-matchlist-v2-restored-colors-v7-20261121/index.html` (V6 + Software v16) önceki HTML SHA `63e314da4a90ed94d35340d845b54b6abfb279bcb9d679f17602025bcbf95db4`, V7 canlı HTML SHA `5eecb46a5b43611eaba57af1e6cadded18199d28096108aee140f9cc1a07221f`, backend değişmedi `79b0bed37aed965979fc0d0bc6c093c4dcfe07a59934096cc65f2fb5c7ce3832`.
- **GitHub:** `deployments/betcapitale/matchlist-v6-to-v7-restored-colors-20261121.patch` commit `3daece59b7e3ef6cc5dad521496ee7886bf2459b`; `deployments/betcapitale/matchlist-v7-production-importmap-20261121.patch` `849261777136235d98a6082e0c7c1ff69dad5f23`; `deployments/betcapitale/matchlist-v7-original-colors-live-20261121.md` `f8ce4c324d8597e31ceba339f1d156e078571942`.
- **Sonraki adım:** Kullanıcının V7 renklerini ve kalan yerleşimi değerlendirmesi. Kullanıcı istemeden V6 gibi yeniden koyu tema veya yeni düzen yapılmayacak.

### 2026-11-22 — Match List v2 V8 — Video ile doğrulanan v1 sonuçları + CAPITALE serif logo · CANLI

- **Kullanıcı isteği:** Gönderilen `Ekran Kaydı 2026-11-22 021152.mp4` 5.07 saniyelik ekran videosu izlenip Match List v1'in **Maç Öncesi** ve **Sonuç** düğmelerinin mevcut mekanizmasına bakılarak V2'ye uygulanması; önceki görseldeki turuncu amblem + siyah serif CAPITALE wordmark'ının kullanılması.
- **Kaynak bulgusu:** Mevcut `client/src/pages/admin-social-media.tsx` içindeki `MacListesiTemplate` v1 kodunda **aynı paylaşılan `variant`** (`prematch` / `result`) ile `prematch` modunda `m.kickoffAt`, `result` modunda `m.result==='won'` → **WON yeşil**, `lost` → **LOST kırmızı**, `void` → **VOID**, diğerleri → **PENDING** gösteriliyor. Videoda gerçekten WON/LOST durum etiketleri görünüyor; bu tam skor değil, bahis sonuç statüsüdür. V2'nin aynı `TM.result` verisini zaten alan props'u vardı fakat `variant` görsel mantığı yoktu.
- **Uygulama:** İzole kaynak `/opt/capitale-software-en-60048de8ba8f9736466a0d5ca13594d6b9023d87/betcapitale-admin-matchlist-v2-v1-results-brand-v8-20261122-work`, V7'den kopyalandı. **Yalnızca** `client/src/components/match-list-template-2.tsx` güncellendi: `variant==='result'` ise başlık `Today's Results`; son kolon `match.result` statüsünü v1 rengiyle gösterir, saat kaldırılır. `prematch` modunda orijinal saat korunur. Üstte sitenin mevcut `/capitale-premium-symbol.svg` turuncu simgesi ve kullanıcının referansına uygun düzenli **Georgia serif CAPITALE** yazısı; kaynak harici görsel/font yüklenmedi.
- **6–15 maç uyumu:** Önceki istekteki 6, 10, 15 adet maç ve story/post durumları test edilerek `rowHeight` hesabı güvenli adaptif hale getirildi. 6 maçta kartlar büyür, 13–15 maçta aralık/logo/metric kutusu kompaktlaşır; 15 maçlık postta son kart footer'ın üstünde kalır. Sinyal ve A/V/N/B/O kaynak kodu, gerçek Supabase raporu, orijinal beyaz/turuncu CAPITALE tema değişmedi. Eksik A/N rastgele doldurulmadı.
- **Derleme ve QA:** TypeScript PASS, Vite PASS, 13 veri kaynak eşleştirme birim test grubu PASS. İzole staging tam tarayıcı testleri 6/6 PASS: prematch 10-story, result 10-story, result 10-post, prematch 6-story, result 15-story, result 15-post. Aynı testler `https://betcapitale.com/admin/social-media` üzerinde **yalnızca test tarayıcısında yerel mock API yanıtlarıyla** 6/6 PASS. Her maçın 2 kulüp logosu ve ayrıca CAPITALE simgesi başarılı; tüm sonuç/başlıklar doğru; görsel 1080×1920 veya 1080×1350, alt kart footer'a taşmıyor, JS hatası yok. Gerçek admin oturumunda PNG indirme henüz bizzat test edilmedi.
- **Production yayın:** Yeni `/assets/admin-social-media-v8-brand-results-20261122.js` immutable dosyası eklendi. Canlı `index.html` içindeki **tek** `admin-social-media-BufGLmZ1.js` importmap aliası V7→V8 yapıldı; diğer üç **Software v16** aliası, ana sayfa V33, backend ve veritabanı değiştirilmedi. Production backend SHA `79b0bed37aed965979fc0d0bc6c093c4dcfe07a59934096cc65f2fb5c7ce3832`. Önceki HTML SHA `5eecb46a5b43611eaba57af1e6cadded18199d28096108aee140f9cc1a07221f`; yeni HTML SHA `5ae433c2f1787d8247a392d1d58bcf3f314310a57b238137f57937a8bdcde83f`.
- **Rollback:** `/app/betcapitale/rollback-matchlist-v2-v1-results-brand-v8-20261122/index.html`. Bu HTML atomik olarak geri konunca V7 tasarımına döner; yeni V8 statik dosyası kullanılmadan yerinde kalabilir.
- **GitHub:** `deployments/betcapitale/matchlist-v7-to-v8-v1-results-brand-responsive-20261122.patch` commit `66d1357335a65050ef16306a0802a338ca9918ea`; `deployments/betcapitale/matchlist-v8-production-importmap-20261122.patch` commit `504f747a9fae12bc5507afd6c125f3cabf9f3fe7`; `deployments/betcapitale/matchlist-v8-v1-results-brand-live-20261122.md` commit `39426e58454d509f8e5c64fb13db239f67954729`.
- **Bir sonraki adım:** Kullanıcı canlı admin hesabındaki Match List v2 için `Maç Öncesi → Sonuç` düğmesini ve üretilen PNG'nin aynı sonucu verdiğini kontrol edebilir. İleride istatistikleri demo amaçlı rastgele doldurma istenirse gerçek kaynaklı raporlardan ayrı, açıkça işaretli ve üretim verisine yazmayan mod kullanılmalı.

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
