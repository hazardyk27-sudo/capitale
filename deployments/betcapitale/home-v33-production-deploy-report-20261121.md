# CAPITALE V33 — Canlı hero aktarımı (2026-11-21)

**Durum:** Yayında, https://betcapitale.com/ . Kullanıcı doğrudan canlı yayın onayı verdi. Önizleme https://betcapitale.com/preview/home-v1/ aynı bırakıldı.

## Kaynak ve entegrasyon

- Kullanıcının kabul ettiği tasarım: **V33** (`betcapitale-home-preview-copy-designer-v33-outfit-light-wordmark-work`).
- Canlı uygulamanın V33 entegrasyon çalışma kopyası: `betcapitale-live-hero-v33-production-safe-20261121-work`.
- Önizlemedeki yalnızca GET/HEAD izni veren `client/src/main.tsx` gerçek üretim `App` girişine geri çevrildi; canlı sitede yazma işlemlerini engelleyen önizleme güvenliği kullanılmadı.
- Önizlemedeki 35 piksel banner canlı ana sayfada bulunmadığı için sayaç ilk ekranın altında kalacak biçimde üretim CSS yüksekliği ayarlandı (desktop 665px, tablet 825px, mobile 705px offset).
- **Canlı `/` yolu:** V33 yeni frontend girişini `index-DFn7x5WA.js` ve `index-DEhu_p5g.css` kullanır. Hero başlığı, 3 kaynak kartı, CAPITALE merkezi, sol DATA STREAMS, 4 aşamalı sağ açıklama, sabit MATCHES/COUPONS/RESULTS, 4 eşleştirilmiş kurgusal kupon senaryosu, Outfit Light logo ve sayaç alt fold korunur.
- **Diğer yollar:** `index-Bg9uIRfV.js` ve `index-DCOG0Mgo.css` dahil önceki production paketleri aynen kullanılır. Böylece canlı admin/software özel importmap `admin-software-logo-layout-v6-20261121.js`, oturum, ödeme ve üyelik sayfalarının kodu değiştirilmedi.
- Ana sayfa ile diğer sayfalar arasında istemci tarafı geçiş, route loader tarafından **tam sayfa yenilemesi** ile gerçekleştirilir. Bu sınır farklı React bundle sürümlerinin karışmasını önler. Gerçek link tıklamalarıyla masaüstü ve mobilde doğrulandı.
- Mevcut production `index.html` içindeki analytics/metatag/SEO/ikonlar ve admin importmap korunmuştur. `index.html` atomik olarak değiştirilmiştir. İsimleri hash'lenmiş **55 yeni statik dosya** eklendi; mevcut dosyaların hiçbiri overwrite edilmedi. Backend ve servis restart edilmedi.

## Doğrulama

- `tsc --noEmit`: PASS, `vite build --base=/`: PASS.
- Yeni ve eski frontend asset URL'leri: HTTP 200; canlı homepage HTTP 200.
- Canlı Puppeteer, farklı boyutlarda: 1825×864, 1440×900, 1200×800, 1024×768, 768×900, 430×932, 390×844, 320×640. Outfit Light 300, marka sembolü, 3 kart, 4 işlem adımı, örnek veri uyarısı, üye sayacının first-fold altında kalması ve taşma kontrolü PASS.
- Animasyon: MATCHES 1.8sn, COUPONS 6.5sn, RESULTS 12sn. Dört senaryonun tamamı ve ilk senaryoya dönen döngü 1440px/390px canlıda PASS.
- Reduced motion masaüstü ve mobil PASS.
- Yolların public smoke testi PASS: `/today`, `/free-bet`, `/history`, `/plans`, `/how-it-works`, `/login`, `/admin/software`; eski bundle yüklendi, fatal JS hatası görülmedi. `admin/software` patched v6 bundle HTTP 200 doğrulandı. **Oturum açılmış yönetici eylemleri ve ödemeler tetiklenmedi/test edilmedi.**
- Gerçek link tıklama testi desktop 1440px ve mobile 390px PASS: `Ana sayfa → Today → Ana sayfa`.

## Geri dönüş

- Orijinal canlı index dosyası: `/app/betcapitale/rollback-hero-v33-prod-20261121/index.html`.
- Yeni eklenen paket listesi: aynı klasörde `added-asset-names.txt`. Yeni dosyalar referanslı olmadığında bir zarar vermez; rollback'te silmek gerekli değil.
- Geri dönüş: canlı dosyanın SHA'sını kontrol ederek orijinal HTML'i atomik olarak `/app/betcapitale/dist/public/index.html` üzerine geri koyun. Backend değişmediği için servis restart gerekmiyor.
- Önceki HTML SHA-256: `fb22c27e5c24d225bb720b7bfdf0c56c9b9bb60a451ced1917cc763c10dab61a`.
- Yayınlanan HTML SHA-256: `b042ef7dcabb050277d11b5bb45ac1ca2925f71c9312fe5455cb9d59a67eeec7`.
- Backend SHA-256 (değişmedi): `79b0bed37aed965979fc0d0bc6c093c4dcfe07a59934096cc65f2fb5c7ce3832`.

## GitHub yama dosyaları

- `deployments/betcapitale/home-v33-preview-to-production-safe-20261121.patch`
- `deployments/betcapitale/home-v33-production-index-router-20261121.patch`

## Sınırlar

- Gösterilen maç, oran ve kâr verileri **kurgusal demo** olup gerçek sonuç iddiası değildir; `CONCEPT, NOT LIVE DATA` etiketi korunmuştur.
- Diğer route'ların orijinal tasarımını ve backend kodunu değiştirmemek kapsamın temel şartıdır.

[executed on device: smartxflow (72356617-e1b7-486f-af4e-02cc4f4b23bf)]