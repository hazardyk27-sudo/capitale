# CAPITALE — Founder Consumer Panel (ChatGPT uyarlaması)

**Durum:** ChatGPT projesinde kullanılabilen çalışma talimatı. Claude Code'un `founder-consumer` eklentisinin birebir kurulumu, Python scriptlerinin veya 100 bağımsız alt ajanın çalıştırılması değildir.

**Esin kaynağı:** `Jakeschincariol/founder-skill`, `skills/founder-consumer/SKILL.md` (MIT lisanslı açık kaynak proje). Kaynak: https://github.com/Jakeschincariol/founder-skill

## Amaç

CAPITALE adlı futbol analiz yazılımının İtalya'daki Instagram izleyicileri nezdindeki algısını, Reels senaryolarını, profil açıklamalarını ve ücretsiz Telegram kanalına geçişteki itirazları sanal kullanıcı profilleriyle **keşif amaçlı** değerlendirmek. Gerçek kullanıcı araştırması, reklam testi veya dönüşüm tahmini yerine geçmez.

## Başlangıç bilgisi

- Proje: CAPITALE — yazılımla futbol maçlarını analiz eder; sonuçları, günlük planları ve ücretsiz seçilmiş tahminleri paylaşır.
- Platformlar: Instagram `@thecapitalee`, Telegram bağlantısı Instagram biyografisinde.
- Hedef: İtalya'daki **18 yaş üzeri** futbol izleyicileri. Reels üzerinden organik keşif, profil ziyaretleri ve ilgilenen kişilerin Telegram'a geçişi.
- İçerikler hakkında emin olunmayan ayrıntıları gerçekmiş gibi anlatma. Ziyaretçi ülkeleri, takipçi oranları veya dönüşümleri uydurma.
- Spor bahisleri alanındaki reklam ve tanıtım kısıtlarına uygunluk incelemesini ayrı bir adım olarak ele al. İnsanları hızlı gelir vaatleriyle yanıltma.

## Komutlar

- `PANEL 20`: 20 farklı **kurgusal** İtalyan profilinin değerlendirildiği ön test.
- `PANEL 100`: 100 farklı **kurgusal** İtalyan profilinin değerlendirildiği geniş test.
- `PANEL REELS`: Kullanıcının sağladığı Reels metinlerini ve içeriklerini karşılaştır.
- `PANEL PROFİL`: Kullanıcının sağladığı Instagram profil biyografisini ve ekran görüntülerini incele.
- `PANEL TELEGRAM`: Telegram'a geçiş öncesindeki şüpheleri, ilgiyi ve kullanıcı deneyimi sorunlarını keşfet.

## Yöntem

1. **Kaynağı belirle.** Kullanıcının sağladığı metin, görsel veya videoyu esas al. İçeriği görmediysen görmüş gibi yapma. Gerekiyorsa kaynağı aç.
2. **Teklif metnini sabitle.** Her sanal profile aynı gerçek Instagram biyografisini, aynı video senaryosunu veya aynı çağrıyı göster. Deney sırasında metni farklılaştırma.
3. **Segmentleri oluştur.** 18+ Serie A takipçileri, futbol veri/istatistik meraklıları, bahis içeriklerine mesafeli futbolseverler ve Telegram kullanıcıları gibi 2–4 segment kullan. Yaş, alışkanlık, güven itirazı, içerik zevki ve dijital davranış açısından farklı kurgusal profiller yarat. Segment oranları araştırmaya dayanmıyorsa tahmini olduğunu belirt.
4. **Her persona için sabit değerlendirme alanları:**
   - Profili/videoyu doğru anladı mı?
   - Hangi ifade veya görsel dikkatini çekti?
   - Hangi bilgi eksik veya şüpheli?
   - Bu hesabı takip etmesine ya da etmemesine ne sebep olur?
   - Telegram'a geçişte hangi çekinceleri yaşar?
   - Daha güvenilir bir sunum için somut önerisi nedir?
5. **Değerlendirmeleri sakla.** Sonuçların tamamını tablo olarak göster veya CSV/Markdown dosyası halinde üret. Persona yorumlarını **gerçek müşteri görüşü** gibi sunma.
6. **Örüntüleri çıkar.** En yaygın 3–5 itirazı, segmentler arasındaki farklılıkları ve yaratıcı düzenleme önerilerini ayır.
7. **Gerçek dünya doğrulaması:** Gerçek İtalya erişim verileri, profil ziyaretleri, Reels izlenme süresi, görüntülenme sonrası takip oranı ve mümkünse gönüllü gerçek kullanıcı geri bildirimiyle sınamadan başarı tahmininde bulunma.

## Rapor formatı

1. Test edilen CAPITALE içeriği (aynen).
2. Persona/segment üretim varsayımları.
3. Sanal panelde ortak bulunan güçlü taraflar.
4. En sık görülen itirazlar ve somut metin/görsel iyileştirmeleri.
5. Segment bazlı farklılıklar.
6. Eksik bilgi ve ileriye dönük gerçek test önerisi.
7. Not: 'Sanal paneldir. Gerçek müşteri, gerçek satın alma kararı veya dönüşüm oranı ölçümü değildir.'

## Çalışma sınırı

Bu dosya ChatGPT'ye otomatik olarak 100 ayrı bağımsız LLM ajanı eklemez. ChatGPT içinden yapılan persona değerlendirmeleri aynı modelin simülasyonudur. Claude Code'daki `panel.py` otomasyonunun ve Agent alt görevlerinin birebir muadili gibi sunulamaz.

## Projede nasıl kullanılır?

Bu Markdown dosyasını CAPITALE projesine **Dosya ekle** üzerinden yükle. Proje talimatlarına kısa bir hatırlatma da eklenebilir:

> `CAPITALE_FOUNDER_CONSUMER_CHATGPT.md` dosyasındaki sanal kullanıcı testi yöntemini, kullanıcı `PANEL 20`, `PANEL 100`, `PANEL REELS`, `PANEL PROFİL` veya `PANEL TELEGRAM` dediğinde uygula. Yanıtları gerçek kullanıcı görüşü olarak sunma.

Daha sonra sohbete `PANEL 20 — mevcut CAPITALE Instagram profilini değerlendir` yaz.
