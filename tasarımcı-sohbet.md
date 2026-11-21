# CAPITALE — TASARIMCI SOHBET VE DEVİR GÜNLÜĞÜ

**Sorumlu:** TASARIMCI  
**Belge amacı:** CAPITALE tasarımcısının sohbetler arası kalıcı belleği; yapılan bütün bilinen tasarım işleri, sürümler, onaylar, uygulanmış değişiklikler, doğrulamalar, yedekler ve sıradaki görevler.  
**Son güncelleme:** 21 Kasım 2026  
**Rol ve çalışma kuralları:** [tasarımcı.md](tasarımcı.md)  
**Anayasa:** [AGENTS.md](AGENTS.md) · [MILESTONE.md](MILESTONE.md)

> **SON DURUM — V18 ÖNİZLEME AKTİF / ANA SİTEYE HENÜZ AKTARILMADI.** Bu belge sonraki sohbetin başlangıç dosyasıdır. Sohbet ilerledikçe dosyayı **aynı dosya yolu üzerinden güncelle**, eski kararları silme; gerekirse SUPERSEDED diye işaretle.

---

## 1. Şu an tam olarak nerede kaldık?

| Alan | Son doğrulanmış durum |
|---|---|
| Tasarımcı rolü | Doğrudan iş yapan, Commander kullanan **TASARIMCI**. Codex'e yönlendirme yok |
| Tasarım hedefi | CAPITALE ana sayfası / hero; beyaz zemin, siyah-turuncu başlık, sağda animasyonlu yazılım akışı |
| Aktif örnek site | **https://betcapitale.com/preview/home-v1/** |
| Güncel sürüm | **V18 — English hero marketing copy**, 2026-11-21 |
| V18 ana başlık | **Use software to achieve** / **consistent daily profits.** |
| V18 başlık altı, 1 | **We do the planning. You enjoy the winning.** |
| V18 başlık altı, 2 | **Built on the right strategy for consistent long-term profits.** |
| Başlık renk/fontu | Mevcut DM Serif Display, koyu mürekkep + CAPITALE turuncusu. Alt metin Manrope |
| Üç CTA | Today's Matches, Community Voice, Calculate Profit — hizalar, renkler ve route'lar korunuyor |
| Sağdaki sistem | MARKET SPECIALIST / NEWS / ANALYST → CAPITALE çekirdeği → MATCHES / COUPONS / RESULTS |
| Üst yazı ve prompt | «THE CAPITALE SYSTEM», «ILLUSTRATIVE PREVIEW» ve animasyonlu üst konuşma kutusu **V17'de silindi** |
| Analist alt metni | **REVIEWS STATISTICS** |
| Sahte veri uyarısı | Alt konsolda **CONCEPT, NOT LIVE DATA**; bu gerçek canlı karar motoru değildir |
| Üye sayacı | Hero altında yatay mevcut biçim; kaynak mantığına dokunulmadı |
| QA | V18 TypeScript + Vite derlemesi başarılı; **320, 350, 390, 430, 768, 900, 1000, 1179, 1180, 1200, 1280, 1380, 1498, 1662, 1880 px** kontrol edildi. Yatay taşma / CTA çakışması / eksik metin tespit edilmedi |
| Yayın sınırı | **Yalnızca önizleme**. Üretim sayfası ve \`dist/index.cjs\` değiştirilmedi |
| Üretime geçiş | **Henüz kullanıcı onayı verilmedi** — kendiliğinden yayınlama |
| V17 yedeği | \`/srv/capitale-preview/home-v1.rollback-hero-copy-v18-20261121\` |

Önizlemenin son doğrulanmış bundle referansları (daha sonra değişebilir):
- JS: \`/preview/home-v1/assets/index-st17SHV_.js\`
- CSS: \`/preview/home-v1/assets/index-CcUymKZ4.css\`
- İkisi de HTTPS 200 olarak görüldü; önizleme HTML 200, ana site HTTP 200, yetkisiz admin API 401.

**İlk iş olarak bu bilgilerin hâlâ güncel olduğunu doğrula.** Başka görev/sunucu deploy'u paralel gerçekleşebilir; sabit hash'e güvenme.

## 2. Tasarımcının teknik çalışma ortamı

- **GitHub depo:** \`hazardyk27-sudo/capitale\`, varsayılan dal \`main\`.
- **Sunucu erişimi:** Desktop Commander, bağlı cihaz adı **smartxflow**. Yetkili cihazları her oturumda yeniden listele. Root/admin gizli verilerini GitHub belgesine koyma.
- **Canlı site:** \`https://betcapitale.com/\`
- **Önizleme:** \`https://betcapitale.com/preview/home-v1/\`
- **Önizleme statik dosyaları:** \`/srv/capitale-preview/home-v1\`
- **Aktif V18 çalışma kopyası:** \`/opt/capitale-software-en-60048de8ba8f9736466a0d5ca13594d6b9023d87/betcapitale-home-preview-copy-designer-v18-work\`
- **Önceki V17 çalışma kopyası:** Aynı kökte \`betcapitale-home-preview-simplified-flow-v17-work\`.
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

## 5. Tamamlanan SON OTURUM — 2026-11-21, V18

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

## 6. Sıradaki görevler ve açılmış kararlar

- [x] V18 yeni başlık ve alt copy masaüstü/mobil önizlemeye uygulandı, görüntüsü doğrulandı.
- [x] «Codex yerine doğrudan tasarımcı uygulasın» talimatı rol kurallarına işlendi.
- [x] Tasarımcının GitHub rol ve sohbet dosyaları açıldı.
- [ ] **Kullanıcının V18 görünümünü değerlendirmesini al**. Değişiklik isterse yalnızca istediği bölgede V19 sürümü aç; V18 yedeğini koru.
- [ ] **Ana siteye geçiş için açık kullanıcı talimatı bekle.** Preview beğenilmeden canlı \`/\` yolunu değiştirme.
- [ ] Sonraki her tasarım tamamlandığında **önizleme + kod patch + bu günlük** aynı turda güncellensin. Tarih/sürüm/commit/test/yedek alanlarını kaydet.
- [ ] Gelecekte gerçek sistem metrikleri veya günlük sonuçlar bağlanacaksa işleme başlamadan kaynak, güvenilirlik ve statik demo ayrımını doğrula; onaysız veya sahte kâr verisini gerçek gibi sunma.

### Sonraki tasarımcı için tek paragraf başlangıç komutu

> Ben CAPITALE'nin **TASARIMCI** ajanıyım. Önce \`AGENTS.md\`, \`MILESTONE.md\`, \`tasarımcı.md\` ve \`tasarımcı-sohbet.md\` dosyalarını GitHub'dan güncel olarak okuyacağım. Desktop Commander'da \`smartxflow\` cihazını bulup \`https://betcapitale.com/preview/home-v1/\` önizlemesinin gerçekte hangi sürüm olduğunu doğrulayacağım. Son onaylanmayı bekleyen tasarım V18'dir. Kullanıcının bir sonraki görsel düzenleme talebini ayrı V19 worktree'de bizzat uygulayıp yalnızca preview'ya derleyip deploy edeceğim; 320–1880px QA, rollback ve GitHub patch kaydından sonra **bu aynı sohbet günlüğünü güncelleyeceğim**. Codex promptu vermeyeceğim ve kullanıcı onayı olmadan ana siteyi değiştirmeyeceğim.

---

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
