# SXF T-6 1X2 favori oranı (1.50, 2.00] — KG VAR araştırması

**Tarih:** 2026-10-27
**Arşiv dönemi:** 9–25 Ekim 2026; başlama saati 16:00–24:00 TRT (UTC+3).
**Durum:** TANIMLAYICI TARİHSEL ARAŞTIRMA; sinyal filtresi veya üretim motoru değişikliği yok.

## Kurallar — önceki 1.01–1.50 araştırmasıyla aynı
1. `research_archive.fixtures` benzersiz fixture UID ve kaynak `match_id_hash`.
2. Her maç için bireysel `kickoff - 6h` tam AS_OF. SXF `public.moneyway_snapshots` 1X2 piyasasında seçimler `1`, `X`, `2` için aynı `scraped_at_utc` ile tam 3 seçeneğin oranı ve snapshot hedef anından maksimum 10 dakika eski; sonraki fiyat kullanılmaz.
3. Favori, `min(o1,o2)` değeri `ox` değerinden kesin küçük olan HOME veya AWAY takımı; eşit HOME/AWAY minimumları dışlanır.
4. **Karşılaştırma için çakışmasız bant: `1.50 < favorite_SXF_odds <= 2.00`**. Bir önceki `1.01 <= odds <= 1.50` çalışmasına 1.50 dahil olduğundan 1.50 bu grupta **hariç**.
5. `research_archive.results` FT skorları ile `match_id_hash + home_team + away_team` tam eşleşme, tekil geçerli FT skor, pozitif en az bir gol her iki takımda ⇒ KG VAR; aksi ⇒ KG YOK. Şüpheli veya eksik FT => paydada yok.
6. SXF fiyatı 1X2 maç kazanan tarafın fiyatıdır, BTTS bahis odds'u değildir. Sinyal üretmek için KG piyasası veya bahis şirketi oranı kullanılmaz.
7. Tüm ligler, kadın/farklı ülke/alt lig ayrımı yapılmaksızın dahil. Gelecek tahmin performansı veya KG bahis avantajı vaat edilmez.

## Esas toplam
- Öncekiyle aynı evren: **2703** maç, **1657** tam ve maksimum 10 dakika eski 1X2 T-6 üçlü fiyatlı fixture (önceki ana audit).
- Favori oranı (1.50,2.00] bulunan: **569**. FT eşleşmesi **568**, FT yok **1** (Deportivo La Guaira – Trujillanos, 17 Ekim); bilinmeyen sonuç payda dışı.
- **KG VAR: 311/568 = 54.75%**; KG YOK **257/568 = 45.25%**.
- İlk grup 1.01–1.50: **150/286 =52,45%**. İkinci çakışmasız grup **311/568 =54.75%**, geçmişte **2.31 yüzde puan** yüksek.
- Günlük sinyal üretim testi değil; bu fiyat bandında KG olaylarının sayımıdır. Bu bandın **17 günlük takvim ortalama maç sayısı 33.41**, geçerli fiyat/FT bulunan gün sayısı **16/17**.

## Günlük sonuçlar
| Tarih | Maç | KG VAR | KG YOK | KG VAR % |
|---|---:|---:|---:|---:|
| 2026-10-09 | 38 | 17 | 21 | 44.74% |
| 2026-10-10 | 67 | 34 | 33 | 50.75% |
| 2026-10-11 | 47 | 29 | 18 | 61.70% |
| 2026-10-12 | 0 | 0 | 0 | VERİ YOK |
| 2026-10-13 | 4 | 0 | 4 | 0.00% |
| 2026-10-14 | 17 | 8 | 9 | 47.06% |
| 2026-10-15 | 12 | 7 | 5 | 58.33% |
| 2026-10-16 | 39 | 18 | 21 | 46.15% |
| 2026-10-17 | 46 | 21 | 25 | 45.65% |
| 2026-10-18 | 51 | 28 | 23 | 54.90% |
| 2026-10-19 | 25 | 15 | 10 | 60.00% |
| 2026-10-20 | 21 | 12 | 9 | 57.14% |
| 2026-10-21 | 16 | 7 | 9 | 43.75% |
| 2026-10-22 | 20 | 14 | 6 | 70.00% |
| 2026-10-23 | 45 | 30 | 15 | 66.67% |
| 2026-10-24 | 68 | 41 | 27 | 60.29% |
| 2026-10-25 | 52 | 30 | 22 | 57.69% |
| **TOPLAM** | **568** | **311** | **257** | **54.75%** |

12 Ekim kayıtları: Önceki SXF T-6 kontrolünde 109 fixture ve 0 uygun tam/güncel T-6 1X2 snapshotı; bu günün burada 0 olması maç oynanmadığı veya bandda favori olmadığı anlamına gelmez.

## Alt oran aralıkları
| Favori oranı | Maç | KG VAR | KG YOK | KG VAR |
|---|---:|---:|---:|---:|
| 1.51–1.60 | 112 | 57 | 55 | 50.89% |
| 1.61–1.70 | 130 | 74 | 56 | 56.92% |
| 1.71–1.80 | 104 | 65 | 39 | 62.50% |
| 1.81–1.90 | 100 | 50 | 50 | 50.00% |
| 1.91–2.00 | 122 | 65 | 57 | 53.28% |
| **TOPLAM** | **568** | **311** | **257** | **54.75%** |

## Favorinin ev sahibi / deplasman oluşu
| Favori | Maç | KG VAR | KG YOK | KG VAR |
|---|---:|---:|---:|---:|
| HOME | 401 | 226 | 175 | 56.36% |
| AWAY | 167 | 85 | 82 | 50.90% |

## Sınır denetimi: Kullanıcı kelimesi kelimesine 1.50–2.00 dahil isterse
Önceki kayıtta **tam 1,50 fiyatında 13 sonuçlanmış fixture** mevcut; 7'si KG VAR, 6'sı KG YOK.
- Her iki ucu dahil `1.50 <= odds <=2.00`: **318/581 = 54.73%**.
- Ama ilk çalışmayla çakışmasız karşılaştırma için 1,50 tam sınırından gelen 13 maç iki kez sayılmamalı; ana `(1.50,2.00]` sonucu doğru.
| Gün | Maç | Favori | SXF oranı | Skor | KG |
|---|---|---|---:|---|---|
| 10 Ekim | Hearts – St Mirren | Hearts (HOME) | 1.50 | 5-0 | YOK |
| 11 Ekim | St Gallen – Lausanne | St Gallen (HOME) | 1.50 | 1-0 | YOK |
| 11 Ekim | Vikingur Reykjavik – IA Akranes | Vikingur Reykjavik (HOME) | 1.50 | 2-2 | VAR |
| 15 Ekim | Tallinna FC Flora – FCI Tallinn | FCI Tallinn (AWAY) | 1.50 | 1-3 | VAR |
| 16 Ekim | Dinamo Bucharest – Botosani | Dinamo Bucharest (HOME) | 1.50 | 2-0 | YOK |
| 17 Ekim | Apollon Limassol – Nea Salamis | Apollon Limassol (HOME) | 1.50 | 4-2 | VAR |
| 18 Ekim | Al Ahli (BRN) – Al Khalidiyah | Al Khalidiyah (AWAY) | 1.50 | 1-2 | VAR |
| 18 Ekim | Tromso – Kfum Oslo | Tromso (HOME) | 1.50 | 1-1 | VAR |
| 19 Ekim | Hapoel Kfar Shelem – Hapoel Akko | Hapoel Kfar Shelem (HOME) | 1.50 | 4-0 | YOK |
| 19 Ekim | Bursaspor – Pendikspor | Bursaspor (HOME) | 1.50 | 2-0 | YOK |
| 20 Ekim | Ebbsfleet Utd – Horsham FC | Ebbsfleet Utd (HOME) | 1.50 | 2-2 | VAR |
| 21 Ekim | Inter U19 – Shakhtar U19 | Inter U19 (HOME) | 1.50 | 2-0 | YOK |
| 24 Ekim | Al-Duhail SC – Lusail | Al-Duhail SC (HOME) | 1.50 | 3-1 | VAR |

## Tek tek 568 maç — denetlenebilir
| # | Tarih | TSİ | Maç | Favori | SXF favori oranı T-6 | FT | KG | Fixture UID |
|---|---|---|---|---|---:|---|---|---|
| 1 | 2026-10-09 | 16:50 | Al-Kholood Club – Al-Quadisiya (KSA) | Al-Quadisiya (KSA) (AWAY) | 1.51 | 0-5 | YOK | `e0030420-f88a-4833-8d35-728ae7ad7c88` |
| 2 | 2026-10-09 | 17:00 | Paradou – JSM Skikda | Paradou (HOME) | 1.62 | 0-0 | YOK | `a55b1773-d289-421b-8e47-09257ba877be` |
| 3 | 2026-10-09 | 17:30 | Be1 NFA – FK Dainava Alytus | Be1 NFA (HOME) | 2.00 | 2-2 | VAR | `7cbc6563-8c73-4341-89c9-26fc7b370773` |
| 4 | 2026-10-09 | 18:00 | FC Hunedoara – FC Voluntari | FC Hunedoara (HOME) | 1.77 | 3-2 | VAR | `95cd5da3-836c-4a06-a090-ae22053e2a9f` |
| 5 | 2026-10-09 | 18:30 | Finland (W) – Serbia (W) | Finland (W) (HOME) | 1.57 | 3-1 | VAR | `27206771-a786-42ea-a0a7-2eb034bec684` |
| 6 | 2026-10-09 | 19:00 | HNK Gorica – Rudes | HNK Gorica (HOME) | 1.67 | 1-2 | VAR | `43c53bf6-c876-4090-a683-04760393ea67` |
| 7 | 2026-10-09 | 19:00 | JaPS – JIPPO | JIPPO (AWAY) | 1.95 | 0-4 | YOK | `5546a464-9b83-423c-b3bc-ef5deb52137d` |
| 8 | 2026-10-09 | 19:00 | Vejle – Hvidovre | Vejle (HOME) | 1.79 | 1-2 | VAR | `b0acba5a-4e2a-4f8a-827b-35ac5d5058ea` |
| 9 | 2026-10-09 | 19:00 | Vysocina Jihlava – Prostejov | Vysocina Jihlava (HOME) | 1.76 | 2-2 | VAR | `af7e1f40-7ecc-4c72-9429-2046e4af1776` |
| 10 | 2026-10-09 | 19:30 | FC Heidenheim – Kaiserslautern | FC Heidenheim (HOME) | 1.96 | 0-0 | YOK | `9679e2cd-aaae-4b7c-9d44-a3174fb6dc11` |
| 11 | 2026-10-09 | 20:00 | Brann – Viking | Viking (AWAY) | 2.00 | 0-2 | YOK | `241aa9a1-8237-4b0c-95e0-8bf2bd5bc208` |
| 12 | 2026-10-09 | 20:00 | FC Nordsjaelland – OB | FC Nordsjaelland (HOME) | 1.56 | 0-0 | YOK | `f2729197-a242-47db-9077-d954ae626a7f` |
| 13 | 2026-10-09 | 20:00 | IFK Goteborg – Vasteras SK | IFK Goteborg (HOME) | 1.81 | 1-0 | YOK | `fbb1f874-3f63-4108-8588-6836e4e9fcc1` |
| 14 | 2026-10-09 | 20:00 | Penafiel – AVS Futebol SAD | Penafiel (HOME) | 1.98 | 1-2 | VAR | `4df60c70-6fcf-499c-a101-44fe9e2aa500` |
| 15 | 2026-10-09 | 20:00 | Sollentuna FF – IFK Stocksund | Sollentuna FF (HOME) | 1.75 | 3-0 | YOK | `76ddf79f-85fa-4c54-8f54-e7468cb5d0a6` |
| 16 | 2026-10-09 | 20:30 | Rapperswil-Jona – Stade Lausanne-Ouchy | Stade Lausanne-Ouchy (AWAY) | 1.86 | 0-3 | YOK | `b46878cb-def3-4c10-90de-238e5e73df30` |
| 17 | 2026-10-09 | 21:00 | ACS Sepsi OSK – Dinamo Bucharest | Dinamo Bucharest (AWAY) | 1.68 | 0-2 | YOK | `7c2211c5-455c-43d4-a2a1-60225aba44df` |
| 18 | 2026-10-09 | 21:00 | Anderlecht B – Eupen | Eupen (AWAY) | 1.97 | 0-2 | YOK | `71544e5a-f758-4811-b1ef-e3ed05125cc3` |
| 19 | 2026-10-09 | 21:00 | De Graafschap – Jong FC Utrecht | De Graafschap (HOME) | 1.67 | 2-1 | VAR | `0273f9b8-54c8-48e5-a756-fa550a29ecf3` |
| 20 | 2026-10-09 | 21:00 | Heracles – RKC Waalwijk | Heracles (HOME) | 1.53 | 3-0 | YOK | `b71bdb5b-e442-40ca-95ac-8a799b04ea29` |
| 21 | 2026-10-09 | 21:00 | Jong AZ Alkmaar – Den Bosch | Jong AZ Alkmaar (HOME) | 2.00 | 0-1 | YOK | `c8aeb61f-47d2-45e9-9976-882aa348e17f` |
| 22 | 2026-10-09 | 21:00 | Leeds United U21 – Stockport County U21 | Leeds United U21 (HOME) | 1.67 | 3-1 | VAR | `34b5fb87-3a35-4c48-95ab-769e460e995e` |
| 23 | 2026-10-09 | 21:00 | Montpellier – Grenoble | Montpellier (HOME) | 1.69 | 2-0 | YOK | `a56ab947-42c2-419c-aa5f-db3d3b932a1a` |
| 24 | 2026-10-09 | 21:00 | Newcastle U21 – Luton Town U21 | Newcastle U21 (HOME) | 1.54 | 4-1 | VAR | `104c151c-f99a-4d1b-966f-aec31e65b059` |
| 25 | 2026-10-09 | 21:00 | Roda JC – Jong PSV Eindhoven | Roda JC (HOME) | 1.76 | 1-1 | VAR | `ec0ac152-2673-4bf2-80b8-c2ece200db66` |
| 26 | 2026-10-09 | 21:15 | Belgium (W) – Poland (W) | Belgium (W) (HOME) | 1.97 | 1-0 | YOK | `862469d9-38a6-4ed2-9ea2-a4dd598135bf` |
| 27 | 2026-10-09 | 21:15 | Etoile Carouge – Yverdon Sport | Yverdon Sport (AWAY) | 1.97 | 0-2 | YOK | `0fce1b15-54d0-40c1-b9e2-3bc9a5130000` |
| 28 | 2026-10-09 | 21:15 | Stade Nyonnais – Aarau | Aarau (AWAY) | 1.56 | 2-1 | VAR | `4120e323-ff02-4686-b0ee-1f8b761548d1` |
| 29 | 2026-10-09 | 21:30 | Podbeskidzie B-B – Pogon Siedlce | Podbeskidzie B-B (HOME) | 1.92 | 1-0 | YOK | `8a2e0966-0e7b-459f-a082-5911e5be8b8e` |
| 30 | 2026-10-09 | 21:45 | Athlone Town – Treaty United | Athlone Town (HOME) | 1.53 | 1-2 | VAR | `dfc61d0b-06a7-4480-80d7-886633c77de6` |
| 31 | 2026-10-09 | 21:45 | Bohemians – Waterford | Bohemians (HOME) | 1.60 | 0-2 | YOK | `9986cbdc-e973-4922-95f7-50eefd026040` |
| 32 | 2026-10-09 | 21:45 | Bray Wanderers – Wexford F.C | Bray Wanderers (HOME) | 1.64 | 2-2 | VAR | `da0b4341-a4e7-437f-a2d5-2cafa25b1a82` |
| 33 | 2026-10-09 | 21:45 | Sutton Utd – Boreham Wood | Boreham Wood (AWAY) | 1.79 | 0-2 | YOK | `d2364353-c098-4fc7-bd2e-0181b4c00498` |
| 34 | 2026-10-09 | 21:45 | UCD – Longford | UCD (HOME) | 1.83 | 1-1 | VAR | `ce1ba61f-bf2f-4206-84bf-2f907d84144c` |
| 35 | 2026-10-09 | 21:45 | Waasland-Beveren – Lommel | Waasland-Beveren (HOME) | 1.89 | 1-3 | VAR | `901c3cc3-c25e-4466-9437-37ba00a80034` |
| 36 | 2026-10-09 | 22:00 | S A Bulo Bulo – Real Tomayapo | S A Bulo Bulo (HOME) | 1.84 | 0-0 | YOK | `9940cf26-6f6f-440c-82f2-9294f8326d8a` |
| 37 | 2026-10-09 | 22:00 | West Ham – QPR | West Ham (HOME) | 1.51 | 1-1 | VAR | `a0dc59f0-eb1e-4061-bf6b-4757ecfee3ff` |
| 38 | 2026-10-09 | 23:00 | Torque – Danubio | Torque (HOME) | 1.94 | 1-0 | YOK | `cd920d7a-cba9-4992-bf7a-2406645cb3f0` |
| 39 | 2026-10-10 | 16:00 | AIK – Brommapojkarna | AIK (HOME) | 2.00 | 5-6 | VAR | `545067be-531c-4166-975e-40f5c3d6a37f` |
| 40 | 2026-10-10 | 16:00 | FK IMT Novi Beograd – Radnik Surdulica | FK IMT Novi Beograd (HOME) | 1.92 | 1-0 | YOK | `afc504f8-5902-42f9-84ae-7fe686adab2e` |
| 41 | 2026-10-10 | 16:00 | Hradec Kralove – SK Artis Brno | Hradec Kralove (HOME) | 1.53 | 2-4 | VAR | `9ba90e6a-dec4-4c89-9e9c-318e8f44a096` |
| 42 | 2026-10-10 | 16:00 | Plzen – Mlada Boleslav | Plzen (HOME) | 1.53 | 3-0 | YOK | `2b9355d1-c858-4c98-b08d-6dad264e9361` |
| 43 | 2026-10-10 | 16:30 | FC Kosice – KFC Komarno | FC Kosice (HOME) | 1.76 | 1-1 | VAR | `e6ecd246-1f17-4c4a-ae69-a1929da0a5b8` |
| 44 | 2026-10-10 | 16:30 | MFK Skalica – Slovan Bratislava | Slovan Bratislava (AWAY) | 1.53 | 1-1 | VAR | `687ae4f6-83a8-402f-9a4d-f4475f317a90` |
| 45 | 2026-10-10 | 16:30 | Paderborn – Stuttgart | Stuttgart (AWAY) | 1.64 | 0-2 | YOK | `6bdfa7a1-938c-47e3-8d17-bfe572f85253` |
| 46 | 2026-10-10 | 16:50 | Al-Hazm (KSA) – NEOM Sports Club | NEOM Sports Club (AWAY) | 1.75 | 1-1 | VAR | `f859b397-e0bd-42db-ac7f-08f4fbb8cbde` |
| 47 | 2026-10-10 | 17:00 | AFC Fylde – Scunthorpe | AFC Fylde (HOME) | 1.82 | 2-0 | YOK | `43d400cc-c28d-4dda-8694-1b6635f7ce68` |
| 48 | 2026-10-10 | 17:00 | AFC Totton – Walton & Hersham | AFC Totton (HOME) | 1.86 | 0-1 | YOK | `9fe2ddc3-d642-4095-804f-787ea5b80ae9` |
| 49 | 2026-10-10 | 17:00 | Alloa – Hamilton | Hamilton (AWAY) | 1.88 | 0-3 | YOK | `f087f46e-af3a-4ec5-9989-a59dd90af81a` |
| 50 | 2026-10-10 | 17:00 | Arbroath – Morton | Arbroath (HOME) | 1.93 | 1-2 | VAR | `9a78702c-ce66-480b-8dc0-8dc4aa32973f` |
| 51 | 2026-10-10 | 17:00 | Boston Utd – Southend | Southend (AWAY) | 1.83 | 1-2 | VAR | `9ff45112-0885-46d3-8f75-133e6c3b2395` |
| 52 | 2026-10-10 | 17:00 | Bradford – Leyton Orient | Bradford (HOME) | 1.63 | 0-0 | YOK | `375035d4-9b7b-4da2-b965-9aeeb7ebae1f` |
| 53 | 2026-10-10 | 17:00 | Cercle Brugge – Anderlecht | Anderlecht (AWAY) | 1.99 | 1-2 | VAR | `2d00794d-72b1-413b-bf67-b21179d56050` |
| 54 | 2026-10-10 | 17:00 | Chelsea – Bournemouth | Chelsea (HOME) | 1.87 | 5-1 | VAR | `32ad049a-9fc0-4192-b1a0-842f676476e7` |
| 55 | 2026-10-10 | 17:00 | Cheltenham – Salford City | Salford City (AWAY) | 1.91 | 0-2 | YOK | `6839fca4-b6e8-47d6-b95a-66a18f7c0253` |
| 56 | 2026-10-10 | 17:00 | Clyde – Dumbarton | Clyde (HOME) | 1.58 | 2-1 | VAR | `f4cc138a-e60e-4f99-98c3-c9835b5ebdc9` |
| 57 | 2026-10-10 | 17:00 | Crawley Town – Chesterfield | Chesterfield (AWAY) | 1.69 | 2-2 | VAR | `c9d08d9c-a687-4725-aacc-2b8e92f1449b` |
| 58 | 2026-10-10 | 17:00 | Defensor Sporting – Cerro | Defensor Sporting (HOME) | 1.89 | 2-3 | VAR | `4a6752a3-c47c-4d15-ba0c-7a879e8e53ef` |
| 59 | 2026-10-10 | 17:00 | Doncaster – Burton Albion | Doncaster (HOME) | 1.77 | 1-0 | YOK | `1e6a2068-d421-4169-b414-3c509257b207` |
| 60 | 2026-10-10 | 17:00 | East Kilbride – Airdrieonians | East Kilbride (HOME) | 2.00 | 2-2 | VAR | `43beb4d3-b8d0-425e-8b45-bb6368eff91a` |
| 61 | 2026-10-10 | 17:00 | FC Goa – Chennaiyin FC | FC Goa (HOME) | 1.84 | 1-1 | VAR | `e0664b5b-3949-4fa8-8636-c5b97d0e409c` |
| 62 | 2026-10-10 | 17:00 | Huddersfield – Sheff Wed | Huddersfield (HOME) | 1.73 | 2-2 | VAR | `0f413755-c2e7-412c-b09b-1de34b47c611` |
| 63 | 2026-10-10 | 17:00 | Inverness CT – Stenhousemuir | Inverness CT (HOME) | 1.85 | 2-0 | YOK | `a2a5b3a8-ac2f-46ce-99ce-dd45c5dd4bab` |
| 64 | 2026-10-10 | 17:00 | Leicester – Peterborough | Leicester (HOME) | 1.58 | 1-3 | VAR | `cdfbfea6-34fe-4b0f-a3e6-eb68d65315cb` |
| 65 | 2026-10-10 | 17:00 | Mansfield – Bromley | Mansfield (HOME) | 1.83 | 2-1 | VAR | `977b5687-237a-4dbe-8f5a-416ff46e987c` |
| 66 | 2026-10-10 | 17:00 | Montrose – Ross Co | Ross Co (AWAY) | 1.53 | 0-5 | YOK | `32a2c334-0bcf-4cfd-ab68-2722665a598b` |
| 67 | 2026-10-10 | 17:00 | Peterhead – Queen of South | Peterhead (HOME) | 2.00 | 0-1 | YOK | `096b26e6-b26f-46fe-9cf4-a020b24c2841` |
| 68 | 2026-10-10 | 17:00 | Raith – Queens Park | Raith (HOME) | 1.53 | 2-0 | YOK | `b40da493-c9fa-4bb1-b1cc-b338c98b5304` |
| 69 | 2026-10-10 | 17:00 | Stjarnan – KA Akureyri | Stjarnan (HOME) | 1.94 | 0-3 | YOK | `5531ec2f-dfe8-4df6-b1ee-1456b0886ce4` |
| 70 | 2026-10-10 | 17:00 | TPV – KPV | TPV (HOME) | 1.66 | 4-0 | YOK | `dc8a02d2-189a-4e5c-8c3f-a325c64605ce` |
| 71 | 2026-10-10 | 17:00 | Tranmere – Rochdale | Tranmere (HOME) | 2.00 | 1-1 | VAR | `3bd34279-5e6d-45d1-ae3b-e9f5b28909c5` |
| 72 | 2026-10-10 | 17:00 | Worthing – Solihull Moors | Worthing (HOME) | 1.64 | 5-0 | YOK | `73d986fe-b5ad-4223-9e72-d16efa784010` |
| 73 | 2026-10-10 | 17:00 | York City – Northampton | York City (HOME) | 1.53 | 1-1 | VAR | `5765e50e-bf84-4a94-b076-bfdbd1164f21` |
| 74 | 2026-10-10 | 17:15 | Alaves – Atletico Madrid | Atletico Madrid (AWAY) | 1.88 | 1-2 | VAR | `78ea1cf8-501c-4e2f-94dc-35d182912488` |
| 75 | 2026-10-10 | 17:30 | Duisburg – Hoffenheim II | Duisburg (HOME) | 1.80 | 3-2 | VAR | `e53338c0-10e1-4abb-be5e-1fae288f8ea5` |
| 76 | 2026-10-10 | 17:30 | Go Ahead Eagles – Sparta Rotterdam | Go Ahead Eagles (HOME) | 1.74 | 3-3 | VAR | `fb94e662-56aa-4694-bfaa-96c19651827c` |
| 77 | 2026-10-10 | 17:30 | Leixoes – Porto B | Leixoes (HOME) | 1.63 | 1-2 | VAR | `5551c31f-4158-4f50-97d4-3524eccf0951` |
| 78 | 2026-10-10 | 18:00 | Cukaricki – Macva Sabac | Cukaricki (HOME) | 1.58 | 2-2 | VAR | `785373a8-cbbe-4f48-a920-0c199909d490` |
| 79 | 2026-10-10 | 18:00 | Oddevold – United IK Nordic | Oddevold (HOME) | 1.83 | 2-0 | YOK | `142d045f-6d55-49c4-ad42-4ecaf94c7513` |
| 80 | 2026-10-10 | 18:30 | Mjallby – Degerfors | Mjallby (HOME) | 1.96 | 1-1 | VAR | `d3f868ad-7263-4792-8655-893852894059` |
| 81 | 2026-10-10 | 18:30 | NK Celje – NK Aluminij | NK Celje (HOME) | 1.64 | 1-0 | YOK | `795e821c-9289-48c7-a799-4ff2a7f993ea` |
| 82 | 2026-10-10 | 18:30 | Slask Wroclaw – Lech Poznan | Lech Poznan (AWAY) | 1.68 | 1-4 | VAR | `126e4327-c48e-4c8a-98df-85fdc254c2bb` |
| 83 | 2026-10-10 | 19:00 | APOEL – Nea Salamis | APOEL (HOME) | 1.51 | 2-1 | VAR | `d84903af-c27e-4a98-b0bd-b829f3f5ad4e` |
| 84 | 2026-10-10 | 19:00 | Istanbulspor – Erokspor A.S | Erokspor A.S (AWAY) | 2.00 | 0-1 | YOK | `ba229653-1cc0-4b04-9615-efe920d39863` |
| 85 | 2026-10-10 | 19:00 | Lugano – Luzern | Lugano (HOME) | 1.78 | 4-0 | YOK | `c8b80a1d-c20e-4401-89e4-98880c378218` |
| 86 | 2026-10-10 | 19:00 | Rizespor – Fenerbahce | Fenerbahce (AWAY) | 1.74 | 0-3 | YOK | `234a8837-c840-4c96-9aa8-98c4c84bd0c1` |
| 87 | 2026-10-10 | 19:00 | Zemplin – Dunajska Streda | Dunajska Streda (AWAY) | 1.68 | 0-3 | YOK | `09c36b80-0f29-4fb0-8bc4-cf487be8f057` |
| 88 | 2026-10-10 | 19:15 | Hapoel Kiryat Shmona – Hapoel Tel Aviv | Hapoel Tel Aviv (AWAY) | 1.52 | 1-3 | VAR | `ec857b97-cf9a-4a6e-88fc-f03e12a73f6d` |
| 89 | 2026-10-10 | 19:30 | Forest Green – Hartlepool | Forest Green (HOME) | 1.74 | 2-4 | VAR | `29637fa3-9e45-4284-bd2e-ef5792313dd1` |
| 90 | 2026-10-10 | 19:30 | Man Utd – Tottenham | Man Utd (HOME) | 1.80 | 1-1 | VAR | `80b1ccd9-d633-44e2-8f6c-9d73ca01ab1e` |
| 91 | 2026-10-10 | 19:30 | RB Leipzig – Eintracht Frankfurt | RB Leipzig (HOME) | 1.65 | 6-0 | YOK | `4c511e79-5867-4dc4-8adf-4d609a6ec714` |
| 92 | 2026-10-10 | 19:45 | Feyenoord – AZ Alkmaar | Feyenoord (HOME) | 1.72 | 2-0 | YOK | `cea30551-b9ea-46cb-b3da-30d166405e2b` |
| 93 | 2026-10-10 | 20:00 | Botev Plovdiv – Slavia Sofia | Botev Plovdiv (HOME) | 1.64 | 1-0 | YOK | `b4a7d4a4-2080-4f66-b9fa-54b9d0c9158c` |
| 94 | 2026-10-10 | 20:30 | Paks – MTK Budapest | Paks (HOME) | 1.96 | 3-0 | YOK | `0ff7c09b-80f7-4dbe-af8d-722ff51c283b` |
| 95 | 2026-10-10 | 21:00 | Asociacion Deportiva Tarma – FC Cajamarca | Asociacion Deportiva Tarma (HOME) | 1.83 | 0-0 | YOK | `b01f144b-2b9b-47a7-a76c-faa1ca7a759b` |
| 96 | 2026-10-10 | 21:00 | KFCO Beerschot Wilrijk – FC Liege | KFCO Beerschot Wilrijk (HOME) | 1.52 | 5-1 | VAR | `f65a3913-db67-4e6a-94e2-e6e1c75df90e` |
| 97 | 2026-10-10 | 21:30 | FCSB – Otelul Galati | FCSB (HOME) | 1.51 | 1-0 | YOK | `cff17144-cc67-4f64-9a71-9a1e77b3883e` |
| 98 | 2026-10-10 | 21:45 | Monaco – Toulouse | Monaco (HOME) | 1.70 | 2-2 | VAR | `d01e6966-6410-49b2-a020-f015063e004b` |
| 99 | 2026-10-10 | 21:45 | Napoli – Frosinone | Napoli (HOME) | 1.51 | 3-0 | YOK | `3f6ce57f-a20a-4001-acc3-da2a0fc3ad98` |
| 100 | 2026-10-10 | 22:00 | Quilmes – Agropecuario | Quilmes (HOME) | 1.88 | 0-1 | YOK | `224b39d8-77cf-41be-8808-8dd8ee270801` |
| 101 | 2026-10-10 | 22:30 | FC Midland – Atletico Rafaela | FC Midland (HOME) | 1.83 | 4-0 | YOK | `0427d48c-a6f9-4e6c-975c-08c855dc043d` |
| 102 | 2026-10-10 | 23:00 | Maringa – Floresta EC | Maringa (HOME) | 1.68 | 2-0 | YOK | `0e762c9b-2a67-4c10-8654-77c25ef61842` |
| 103 | 2026-10-10 | 23:00 | Sportivo San Lorenzo – Sportivo Trinidense | Sportivo Trinidense (AWAY) | 1.74 | 1-1 | VAR | `89b8cc64-ef9b-407c-997e-97ca693137e0` |
| 104 | 2026-10-10 | 23:30 | Comerciantes Unidos – Juan Pablo II College | Comerciantes Unidos (HOME) | 1.87 | 1-1 | VAR | `6ab66b90-5e29-40a0-b430-ec705ed0e71d` |
| 105 | 2026-10-10 | 23:30 | Deportivo Pereira – Deportivo Cali | Deportivo Cali (AWAY) | 1.80 | 0-0 | YOK | `5cac7b79-1329-4b1a-ac5d-ed2ffd67c480` |
| 106 | 2026-10-11 | 16:00 | Farense – Feirense | Farense (HOME) | 1.82 | 2-1 | VAR | `6288c420-03a9-4b7c-a009-680e04c8e10a` |
| 107 | 2026-10-11 | 16:00 | Lazio – AC Monza | Lazio (HOME) | 1.75 | 3-1 | VAR | `47751fd2-5e9b-4939-9684-0e53d12f4433` |
| 108 | 2026-10-11 | 16:00 | Radnicki Nis – Vojvodina | Vojvodina (AWAY) | 1.95 | 1-4 | VAR | `f9f5b1fc-c79d-494a-b2c1-d4d318e6451a` |
| 109 | 2026-10-11 | 17:00 | Brondby – Lyngby | Brondby (HOME) | 1.78 | 5-2 | VAR | `51571403-f9de-488b-babf-5374a10ca355` |
| 110 | 2026-10-11 | 17:00 | FK Kaisar – FC Ordabasy | FC Ordabasy (AWAY) | 1.54 | 1-4 | VAR | `db2a386a-b2b6-4ff5-b50d-71ce9b15e084` |
| 111 | 2026-10-11 | 17:00 | Kifisia – Panaitolikos | Kifisia (HOME) | 1.99 | 2-0 | YOK | `b138f127-a468-4416-b02b-2d631cf8757e` |
| 112 | 2026-10-11 | 17:00 | Olympic El Qanal – Al-Masry | Al-Masry (AWAY) | 1.83 | 1-1 | VAR | `c1b9b62c-9743-4b89-bfd4-22e3696c66f4` |
| 113 | 2026-10-11 | 17:15 | Almeria – Leganes | Almeria (HOME) | 1.66 | 3-0 | YOK | `13cc94ff-8d66-4a06-bc32-b94882b691b4` |
| 114 | 2026-10-11 | 17:15 | Real Sociedad – Deportivo | Real Sociedad (HOME) | 1.67 | 3-2 | VAR | `2ce78091-7dbd-4fe1-9e15-71322fe5d355` |
| 115 | 2026-10-11 | 17:30 | Cherno More – PFC Levski Sofia | PFC Levski Sofia (AWAY) | 1.75 | 0-2 | YOK | `daf8570e-18a9-4b52-bc02-edc6b57ade60` |
| 116 | 2026-10-11 | 17:30 | Ponferradina – Real Aviles | Ponferradina (HOME) | 1.88 | 0-2 | YOK | `52b90375-d335-480b-bc93-ecd472e4762c` |
| 117 | 2026-10-11 | 17:45 | Al Sahel – Al Fahaheel FC | Al Fahaheel FC (AWAY) | 2.00 | 0-4 | YOK | `37260aad-a849-416e-b1fb-6411f9789261` |
| 118 | 2026-10-11 | 18:00 | Egersund – Hodd | Egersund (HOME) | 1.71 | 3-1 | VAR | `ae436df7-d33f-4466-b9a1-c292c3cbfa4e` |
| 119 | 2026-10-11 | 18:00 | Kongsvinger – Ranheim IL | Kongsvinger (HOME) | 1.65 | 6-2 | VAR | `a6ebf0b1-fe46-485d-a167-85ffa198961c` |
| 120 | 2026-10-11 | 18:00 | LASK Linz – Rapid Vienna | LASK Linz (HOME) | 1.98 | 0-2 | YOK | `f545dede-ca72-4900-a6f0-cd8f792e80c6` |
| 121 | 2026-10-11 | 18:00 | Lyn – Stromsgodset | Stromsgodset (AWAY) | 1.64 | 1-5 | VAR | `dd9426e2-1c6a-4712-a1b8-09f422c65bf2` |
| 122 | 2026-10-11 | 18:00 | Partizan Belgrade – FK Novi Pazar | Partizan Belgrade (HOME) | 1.62 | 1-0 | YOK | `2bf0d5ee-97f5-42e7-914d-a31c57e25859` |
| 123 | 2026-10-11 | 18:00 | Raufoss – Moss | Moss (AWAY) | 1.80 | 1-2 | VAR | `01d438fb-900a-48b2-b075-dd39abbb496d` |
| 124 | 2026-10-11 | 18:00 | Sandnes Ulf – Haugesund | Haugesund (AWAY) | 1.60 | 1-1 | VAR | `e9b1b19a-4e8f-48f3-b0a9-d60b4f1e1806` |
| 125 | 2026-10-11 | 18:00 | Start – Ham-Kam | Start (HOME) | 1.92 | 2-4 | VAR | `d8427760-1a28-4892-8d5b-0234ae668b2b` |
| 126 | 2026-10-11 | 18:15 | Padova – Carrarese | Padova (HOME) | 1.96 | 0-2 | YOK | `72ac4943-38cb-4d05-aa09-072d927da734` |
| 127 | 2026-10-11 | 18:30 | A.C. Trento S.C.S.D. – Caratese | A.C. Trento S.C.S.D. (HOME) | 1.81 | 1-0 | YOK | `2cd4269f-8f5f-4509-8166-94af46a512da` |
| 128 | 2026-10-11 | 18:30 | Freiburg – Schalke 04 | Freiburg (HOME) | 1.73 | 2-1 | VAR | `89d3e87f-b956-4540-9c31-e248a674d271` |
| 129 | 2026-10-11 | 18:30 | Perugia – FC Vado | Perugia (HOME) | 1.77 | 0-2 | YOK | `542571df-2b4f-46b3-ac8c-fc45f0fd173d` |
| 130 | 2026-10-11 | 19:00 | Aris – NFC Volos | Aris (HOME) | 1.57 | 3-2 | VAR | `69455d5f-1985-432d-a026-862c26e97f75` |
| 131 | 2026-10-11 | 19:00 | Bursaspor – Mardin 1969 Spor | Bursaspor (HOME) | 1.68 | 1-2 | VAR | `8e2bbf08-9ba6-4a35-aa11-b5ef3f90e4d1` |
| 132 | 2026-10-11 | 19:00 | Sassuolo – AC Milan | AC Milan (AWAY) | 1.91 | 1-1 | VAR | `648bad32-c4f8-479c-9c54-e83ccd6419dc` |
| 133 | 2026-10-11 | 19:30 | Betis – Osasuna | Betis (HOME) | 1.55 | 5-2 | VAR | `1fb9fa8c-8dc0-4e41-8309-e9b3d57ea7a0` |
| 134 | 2026-10-11 | 19:30 | Mallorca – Las Palmas | Mallorca (HOME) | 1.60 | 3-1 | VAR | `6903a842-07b8-42ae-95b2-c5372a6d8bdd` |
| 135 | 2026-10-11 | 19:30 | Suchitepequez – Deportivo Mixco | Suchitepequez (HOME) | 1.55 | 1-0 | YOK | `5c3acade-6ca2-4146-91dd-a8c8ec597c69` |
| 136 | 2026-10-11 | 19:30 | Univ Catolica (Ecu) – Macara | Univ Catolica (Ecu) (HOME) | 1.85 | 0-1 | YOK | `c1e0f00a-f6ca-4fcd-9a2c-8a4cc710562c` |
| 137 | 2026-10-11 | 20:00 | Leiria – Academica | Leiria (HOME) | 2.00 | 0-2 | YOK | `3b625a81-2c93-4c0f-9b82-03c3b2b110c4` |
| 138 | 2026-10-11 | 20:00 | Zemun – Zeleznicar Pancevo | Zeleznicar Pancevo (AWAY) | 1.55 | 0-3 | YOK | `b515739c-42d6-4233-8852-8e6afbe2a7aa` |
| 139 | 2026-10-11 | 20:15 | Hapoel Ramat Gan – Beitar Jerusalem | Beitar Jerusalem (AWAY) | 1.54 | 0-4 | YOK | `4d4c1e40-2eb4-4bd1-952a-1e4c7cf216a2` |
| 140 | 2026-10-11 | 20:30 | Fortuna Dusseldorf – Verl | Fortuna Dusseldorf (HOME) | 1.89 | 2-2 | VAR | `575e4dd2-742e-46f4-a76a-ebf8f9a664a3` |
| 141 | 2026-10-11 | 21:00 | Deportivo Madryn – Chaco For Ever | Deportivo Madryn (HOME) | 1.75 | 1-2 | VAR | `d46ad653-2be8-452d-89df-7592dfe49426` |
| 142 | 2026-10-11 | 21:00 | Farul Constanta – ACS Petrolul 52 | Farul Constanta (HOME) | 1.97 | 3-1 | VAR | `5da007bb-76f2-4e05-bb46-1c3c1327d1da` |
| 143 | 2026-10-11 | 21:45 | Cagliari – Juventus | Juventus (AWAY) | 1.59 | 1-1 | VAR | `b1f60856-a2fb-48d3-8279-f2fb2da13188` |
| 144 | 2026-10-11 | 22:00 | CA Temperley – Nueva Chicago | CA Temperley (HOME) | 1.97 | 2-1 | VAR | `f5df61a3-79e3-47d9-8511-052079555d56` |
| 145 | 2026-10-11 | 22:00 | Gimnasia Jujuy – Club Gimnasia y Tiro | Gimnasia Jujuy (HOME) | 1.96 | 2-2 | VAR | `0a2d3109-2e94-4025-ae92-f310c6eb9f00` |
| 146 | 2026-10-11 | 22:00 | Juventude – Sao Bernardo | Juventude (HOME) | 1.63 | 2-2 | VAR | `6656a2f3-edc2-477b-9add-0c6d56e1f7d7` |
| 147 | 2026-10-11 | 22:10 | Atletico GO – Sport Recife | Atletico GO (HOME) | 1.90 | 1-1 | VAR | `b30a70e9-13fa-4ab6-84f4-bf0b373e463b` |
| 148 | 2026-10-11 | 22:15 | Breidablik – Keflavik | Breidablik (HOME) | 1.99 | 3-1 | VAR | `b7c6f8a1-e63e-45dd-a055-ff3941c1d647` |
| 149 | 2026-10-11 | 23:00 | Rubio Nu – Olimpia | Olimpia (AWAY) | 1.85 | 0-0 | YOK | `b3416161-7558-45d7-a7ae-c533906de99f` |
| 150 | 2026-10-11 | 23:00 | Wydad Casablanca – CODM Meknes | Wydad Casablanca (HOME) | 1.75 | 0-0 | YOK | `e9746ed3-a706-4fc8-9ef5-02ae966920f7` |
| 151 | 2026-10-11 | 23:30 | Flamengo – Fluminense | Flamengo (HOME) | 1.55 | 1-0 | YOK | `52421b05-f89a-44df-a7fd-6842800e46fc` |
| 152 | 2026-10-11 | 23:30 | SE Palmeiras – Corinthians | SE Palmeiras (HOME) | 1.69 | 4-1 | VAR | `c86f541a-9052-44b0-9678-efabd509a4e6` |
| 153 | 2026-10-13 | 22:00 | Atletico Madrid – Man Utd | Atletico Madrid (HOME) | 1.96 | 2-0 | YOK | `2e3e8e6c-a77f-40c5-add7-9d76e6c7e0a4` |
| 154 | 2026-10-13 | 22:00 | Birmingham – Preston | Birmingham (HOME) | 1.53 | 4-0 | YOK | `e5d99697-ae5a-49f6-b4e9-4460f0222aa2` |
| 155 | 2026-10-13 | 22:00 | RB Leipzig – PSV | RB Leipzig (HOME) | 1.64 | 1-0 | YOK | `cc4de8d8-7fc1-4320-8780-7c707f1c37b4` |
| 156 | 2026-10-13 | 22:15 | USM Alger – JS Saoura | USM Alger (HOME) | 1.56 | 1-0 | YOK | `5d3cc27f-efda-475a-997f-cafd22d65011` |
| 157 | 2026-10-14 | 16:00 | Strommen – Asane | Strommen (HOME) | 1.97 | 6-1 | VAR | `ca8d4964-f094-4854-ae9f-0e26a344eed8` |
| 158 | 2026-10-14 | 17:00 | Betis Sevilla U19 – Porto U19 | Betis Sevilla U19 (HOME) | 1.89 | 5-0 | YOK | `8dc1b297-a329-4ab1-a88d-523499b8d1c5` |
| 159 | 2026-10-14 | 17:00 | Man City U19 – Paris St-G U19 | Man City U19 (HOME) | 1.91 | 0-2 | YOK | `27e7a2fc-afab-4d6e-bcea-0137362e8d31` |
| 160 | 2026-10-14 | 17:00 | MO Constantine – JS Azazga | MO Constantine (HOME) | 1.88 | 1-0 | YOK | `de8fb1ef-b8d8-4cb7-8087-87b1bd5ab5a5` |
| 161 | 2026-10-14 | 17:00 | Punjab FC – Odisha | Punjab FC (HOME) | 1.98 | 2-1 | VAR | `f4f0b59d-13e9-46c6-8689-0fde47a337e2` |
| 162 | 2026-10-14 | 17:00 | Umraniyespor – Boluspor | Umraniyespor (HOME) | 1.52 | 0-1 | YOK | `5c3c7173-08c9-42b8-9b66-a5d2793b0efa` |
| 163 | 2026-10-14 | 18:00 | Spartakos Kitiou FC – Digenis Ypsona | Digenis Ypsona (AWAY) | 1.69 | 0-2 | YOK | `93a728b3-bd25-4bd2-a694-88d548d53fd8` |
| 164 | 2026-10-14 | 19:00 | Paide Linnameeskond – Tammeka Tartu | Paide Linnameeskond (HOME) | 1.65 | 2-1 | VAR | `d82b0ca7-6712-43e7-bd66-d006dff7dfdc` |
| 165 | 2026-10-14 | 20:00 | ES Setif – Kabylie | ES Setif (HOME) | 1.97 | 1-1 | VAR | `167b4a8f-3747-4395-962b-dd17debb942a` |
| 166 | 2026-10-14 | 20:00 | Sogndal – Odds BK | Odds BK (AWAY) | 1.95 | 0-1 | YOK | `209a91d4-4148-4d18-b682-f768fa7458ec` |
| 167 | 2026-10-14 | 20:00 | Stabaek – Sandnes Ulf | Stabaek (HOME) | 1.51 | 4-1 | VAR | `dfca43b4-e0a5-45f6-a9e9-72943ce80f82` |
| 168 | 2026-10-14 | 20:00 | Stromsgodset – Kongsvinger | Stromsgodset (HOME) | 1.89 | 5-1 | VAR | `9be1ff79-0e27-4af6-bf3d-e34c9bd2b4f0` |
| 169 | 2026-10-14 | 20:00 | Viktoria Koln – SG Sonnenhof | Viktoria Koln (HOME) | 1.57 | 2-2 | VAR | `fd06fd02-40f6-41c4-8416-bd3acd8ace03` |
| 170 | 2026-10-14 | 21:30 | Boston River – River Plate (Uru) | Boston River (HOME) | 1.78 | 0-0 | YOK | `33f39d69-89f2-4897-b93f-39fc8da6d449` |
| 171 | 2026-10-14 | 21:45 | QPR – Derby | QPR (HOME) | 1.75 | 4-1 | VAR | `15751dcb-d2f9-4697-8ac9-5fac6a22917d` |
| 172 | 2026-10-14 | 22:00 | Aston Villa – Fenerbahce | Aston Villa (HOME) | 1.74 | 6-0 | YOK | `e99c7b67-91ad-4243-9bdb-2f1b60a042f3` |
| 173 | 2026-10-14 | 22:00 | Lincoln – West Ham | West Ham (AWAY) | 1.76 | 0-6 | YOK | `83bbf17d-2de0-4dd6-bfcc-48c6ff64390b` |
| 174 | 2026-10-15 | 17:00 | Mo Bejaia – Beni Oualbane | Mo Bejaia (HOME) | 1.58 | 0-0 | YOK | `0d3f1cba-a1fa-4752-a0fb-bbf65df47b4b` |
| 175 | 2026-10-15 | 19:00 | FC Tallinn – JK Welco Elekter | JK Welco Elekter (AWAY) | 1.54 | 0-7 | YOK | `eac1684d-d07f-475a-a64a-c6d72823dd5c` |
| 176 | 2026-10-15 | 19:45 | CSKA Sofia – Monaco | Monaco (AWAY) | 1.55 | 1-2 | VAR | `e3576847-29df-486b-9e6b-c2547b9b748d` |
| 177 | 2026-10-15 | 19:45 | Egnatia Rrogozhine – Midtjylland | Midtjylland (AWAY) | 1.58 | 1-1 | VAR | `770cbb09-bb66-4e87-922e-a040a78263ff` |
| 178 | 2026-10-15 | 19:45 | Gent – AGF | Gent (HOME) | 1.68 | 1-0 | YOK | `9fcbb436-ba91-4f63-a9c3-bf0acefc13d8` |
| 179 | 2026-10-15 | 19:45 | Hajduk Split – Ajax | Ajax (AWAY) | 1.71 | 2-1 | VAR | `57b0d0e0-0f1c-42c0-b085-909f0e1faa64` |
| 180 | 2026-10-15 | 19:45 | KuPS – Trabzonspor | Trabzonspor (AWAY) | 1.63 | 2-4 | VAR | `c5301523-a3df-48a6-98cb-a50d175a9548` |
| 181 | 2026-10-15 | 19:45 | Lech Poznan – Leverkusen | Leverkusen (AWAY) | 1.63 | 0-4 | YOK | `56997e98-70f0-4c82-9273-e6bbff428a5f` |
| 182 | 2026-10-15 | 20:00 | Muglaspor – Bursaspor | Bursaspor (AWAY) | 1.67 | 0-3 | YOK | `e14bd779-84ae-48d4-9326-faaee7dd6069` |
| 183 | 2026-10-15 | 21:00 | Xelaju – Malacateco | Xelaju (HOME) | 1.52 | 2-1 | VAR | `098a2ab1-51ce-4c9a-8565-71b4eabf2b5a` |
| 184 | 2026-10-15 | 22:00 | Ferencvaros – Plzen | Ferencvaros (HOME) | 2.00 | 2-1 | VAR | `a357b4d8-4af9-42f2-92f5-be9eff98e574` |
| 185 | 2026-10-15 | 22:00 | NEC Nijmegen – PFC Levski Sofia | NEC Nijmegen (HOME) | 1.94 | 1-1 | VAR | `861ee3d6-4644-4ff8-9376-aa76666c4800` |
| 186 | 2026-10-16 | 16:00 | Kelantan Red Warrior FC – Imigresen FC | Imigresen FC (AWAY) | 1.56 | 2-5 | VAR | `d9863cbd-9237-4cc8-a8d3-3245ab03c10f` |
| 187 | 2026-10-16 | 16:30 | GNK Dinamo Zagreb II – Karlovac | GNK Dinamo Zagreb II (HOME) | 1.81 | 0-1 | YOK | `76d39a30-2165-4020-8c11-19bf3b643177` |
| 188 | 2026-10-16 | 17:00 | FK Kokand 1912 – Neftchi Fargona | Neftchi Fargona (AWAY) | 1.64 | 2-4 | VAR | `88fb5d26-7840-4e3e-b48d-a755fa1e68bc` |
| 189 | 2026-10-16 | 17:30 | Be1 NFA – FC Neptunas Klaipeda | Be1 NFA (HOME) | 1.93 | 2-0 | YOK | `c987b15e-939d-40f0-8e08-86046016f0cf` |
| 190 | 2026-10-16 | 18:00 | FC Sellier & Bellot Vlasim – H Slavia Kromeriz | FC Sellier & Bellot Vlasim (HOME) | 1.70 | 1-0 | YOK | `28ce3cd8-a20e-4c81-a562-2d7185902a30` |
| 191 | 2026-10-16 | 18:00 | Otelul Galati – Csikszereda | Otelul Galati (HOME) | 1.75 | 1-1 | VAR | `1e4b6d5a-75b0-4aa0-be2a-ce38c75f0850` |
| 192 | 2026-10-16 | 18:00 | Tatran Lip Mikulas – OFK Banik Lehota | Tatran Lip Mikulas (HOME) | 1.73 | 1-0 | YOK | `33990f30-366e-451f-8c89-1623fa0037ad` |
| 193 | 2026-10-16 | 18:30 | MFK Karvina – Dukla Prague | MFK Karvina (HOME) | 1.88 | 3-0 | YOK | `9e8fdae5-c072-4d1e-bbec-24b53899c565` |
| 194 | 2026-10-16 | 18:30 | NK Aluminij – Olimpija | Olimpija (AWAY) | 1.98 | 0-1 | YOK | `49540bbb-dee8-4a4f-b027-1793631ca10a` |
| 195 | 2026-10-16 | 19:00 | Al-Ittifaq Maqaba – Manama Club | Al-Ittifaq Maqaba (HOME) | 1.64 | 2-2 | VAR | `b192fd7e-72fe-408d-9b24-368f0177b773` |
| 196 | 2026-10-16 | 19:00 | APR FC – Zamalek | Zamalek (AWAY) | 1.75 | 0-1 | YOK | `f58b9795-2d09-4a21-88ef-d04c148a8716` |
| 197 | 2026-10-16 | 19:00 | FK Pribram – Trinec | FK Pribram (HOME) | 1.71 | 2-3 | VAR | `54fad0b3-07f5-477b-a735-f53a8271c2eb` |
| 198 | 2026-10-16 | 19:00 | Hegelmann Litauen B – Fk Tauras | Fk Tauras (AWAY) | 1.94 | 4-4 | VAR | `361f7ba6-939a-465a-86b1-a302c160b1c7` |
| 199 | 2026-10-16 | 19:30 | Cottbus – Nurnberg | Nurnberg (AWAY) | 1.88 | 1-1 | VAR | `9f8daac0-831c-4bad-8491-e77fea1ea5cf` |
| 200 | 2026-10-16 | 19:30 | St Polten – Rapid Vienna (Am) | St Polten (HOME) | 1.56 | 0-0 | YOK | `5caa9455-65bd-4e52-8d52-fe3d99980727` |
| 201 | 2026-10-16 | 19:45 | Al Shahaniya – Al Arabi (QAT) | Al Arabi (QAT) (AWAY) | 1.83 | 0-6 | YOK | `c698e8f7-40a2-44c9-8e4e-533333737a9e` |
| 202 | 2026-10-16 | 20:00 | Brommapojkarna – Djurgardens | Djurgardens (AWAY) | 1.61 | 0-2 | YOK | `013c6e3f-0276-4449-b069-f244c19e0c14` |
| 203 | 2026-10-16 | 20:00 | FC Cartagena – CE Europa | FC Cartagena (HOME) | 1.67 | 3-0 | YOK | `4ea61414-6e8c-4e27-98af-9cb04ec5f984` |
| 204 | 2026-10-16 | 20:00 | Fremad Amager – Nykobing FC | Nykobing FC (AWAY) | 1.84 | 3-2 | VAR | `729bd199-e719-4a83-87e9-bac241a2056d` |
| 205 | 2026-10-16 | 20:00 | Kolding IF – Vendsyssel FF | Kolding IF (HOME) | 1.95 | 2-1 | VAR | `8d74ea46-d0fe-4c7c-9822-5086a13beec6` |
| 206 | 2026-10-16 | 20:30 | IFK Stocksund – Enkopings SK | Enkopings SK (AWAY) | 1.66 | 1-3 | VAR | `0f6fc979-331c-4f9d-a246-6f60efca2ad3` |
| 207 | 2026-10-16 | 21:00 | Den Bosch – FC Oss | Den Bosch (HOME) | 1.71 | 2-1 | VAR | `d4e022ee-26ed-4cad-9830-c56de5e38a7c` |
| 208 | 2026-10-16 | 21:00 | Heerenveen – Excelsior | Heerenveen (HOME) | 1.63 | 4-0 | YOK | `dad92e72-067f-4d92-ba76-6cec65f92297` |
| 209 | 2026-10-16 | 21:00 | Helmond Sport – NAC Breda | NAC Breda (AWAY) | 1.61 | 0-2 | YOK | `6cf6ec27-0eeb-4321-853d-4d72d1f77fd5` |
| 210 | 2026-10-16 | 21:00 | Reims – Dijon | Reims (HOME) | 1.88 | 4-2 | VAR | `2f5bfec2-39c4-4ac4-82e5-ad9fad8480e2` |
| 211 | 2026-10-16 | 21:00 | Sport Huancayo – Cusco FC | Sport Huancayo (HOME) | 1.89 | 2-1 | VAR | `490f474f-7ab5-4695-b1ca-4b37beefaf67` |
| 212 | 2026-10-16 | 21:30 | Ayr – Partick | Partick (AWAY) | 1.68 | 0-1 | YOK | `5b880470-2fc9-4dd1-ac6a-0712cbd07dea` |
| 213 | 2026-10-16 | 21:30 | Eintracht Frankfurt – FC Koln | Eintracht Frankfurt (HOME) | 1.93 | 1-0 | YOK | `b91d38e4-0679-477c-9f27-bc6eff82bd81` |
| 214 | 2026-10-16 | 21:30 | Ruch Chorzow – Odra Opole | Ruch Chorzow (HOME) | 1.87 | 3-0 | YOK | `9ed6209f-f47d-4cb9-bb82-ccc2f0cdc18c` |
| 215 | 2026-10-16 | 21:30 | Verona – Catanzaro | Verona (HOME) | 1.85 | 2-2 | VAR | `9aaa677d-e3d2-4e64-86a7-94f5d234404d` |
| 216 | 2026-10-16 | 21:30 | Westerlo – Patro Eisden Maasmechelen | Westerlo (HOME) | 1.54 | 2-0 | YOK | `51dc8538-1b46-4bae-9fbf-f977ee8e7e1b` |
| 217 | 2026-10-16 | 21:45 | Bohemians – Waterford | Bohemians (HOME) | 1.77 | 2-1 | VAR | `137be4c6-199d-4328-9a95-0c3ec9461326` |
| 218 | 2026-10-16 | 21:45 | Finn Harps – Bray Wanderers | Bray Wanderers (AWAY) | 1.51 | 2-0 | YOK | `b994c5cd-5627-4e56-b05e-e966a80ab604` |
| 219 | 2026-10-16 | 21:45 | Galway Utd – Shamrock Rovers | Shamrock Rovers (AWAY) | 1.83 | 2-0 | YOK | `39a4cf99-0b5d-4957-9984-0b7d3eeb2a68` |
| 220 | 2026-10-16 | 21:45 | Treaty United – Cobh Ramblers | Cobh Ramblers (AWAY) | 1.92 | 2-0 | YOK | `05f0ea17-26c9-4095-ac70-b142a890c3fa` |
| 221 | 2026-10-16 | 22:00 | St Patricks – Shelbourne | St Patricks (HOME) | 1.67 | 1-2 | VAR | `455e7689-4b19-4f64-92f2-00c90d94f4fa` |
| 222 | 2026-10-16 | 22:00 | Standard – FCV Dender | Standard (HOME) | 1.54 | 2-0 | YOK | `ebd91fda-5d35-4b4b-b374-d6fc876fdbc6` |
| 223 | 2026-10-16 | 23:00 | Deportivo Cali (W) – Libertad Limpeno (W) | Deportivo Cali (W) (HOME) | 1.57 | 1-1 | VAR | `6bfa0008-9856-4308-bdf9-54998af27d45` |
| 224 | 2026-10-16 | 23:30 | Deportivo Cuenca – Tecnico Universitario | Deportivo Cuenca (HOME) | 1.88 | 2-1 | VAR | `0ef92327-55c3-47ca-8596-c1d75b26f276` |
| 225 | 2026-10-17 | 16:00 | Amed Sportif Faaliyetler – Konyaspor | Amed Sportif Faaliyetler (HOME) | 1.98 | 1-0 | YOK | `33404f21-ad11-434b-8b53-4e8811fbe486` |
| 226 | 2026-10-17 | 16:00 | Ascoli – Empoli | Ascoli (HOME) | 1.97 | 1-1 | VAR | `63065a93-b03c-4b52-ba9c-75b085b1904e` |
| 227 | 2026-10-17 | 16:00 | Benevento – LR Vicenza Virtus | Benevento (HOME) | 1.99 | 2-2 | VAR | `1a975039-b409-4feb-b098-41f72598d74a` |
| 228 | 2026-10-17 | 16:00 | Carrarese – Modena | Modena (AWAY) | 1.90 | 2-1 | VAR | `d92be330-c522-404a-8f05-4fb0aacc092c` |
| 229 | 2026-10-17 | 16:00 | HJK Helsinki – Gnistan | HJK Helsinki (HOME) | 1.53 | 4-0 | YOK | `88c421cf-cf2b-472e-9504-1dd039b5fd08` |
| 230 | 2026-10-17 | 16:00 | NK Bravo – NK Radomlje | NK Bravo (HOME) | 1.89 | 2-2 | VAR | `0449d4f3-6447-4b25-8486-4941bb0d76d0` |
| 231 | 2026-10-17 | 16:00 | Venezia – Napoli | Napoli (AWAY) | 1.80 | 1-0 | YOK | `692f2eb8-9dcc-4a7e-8b8b-956da6f9b1fa` |
| 232 | 2026-10-17 | 16:30 | Hamburger SV – Stuttgart | Stuttgart (AWAY) | 1.86 | 1-0 | YOK | `ac2f4ea9-5329-45d7-85d4-fff3c934f945` |
| 233 | 2026-10-17 | 16:30 | Union Berlin – Dortmund | Dortmund (AWAY) | 1.62 | 0-0 | YOK | `5ad2596b-0bd0-4d83-8af9-a3ccdaa4d1b0` |
| 234 | 2026-10-17 | 16:30 | Werder Bremen – Paderborn | Werder Bremen (HOME) | 1.82 | 2-2 | VAR | `50596685-bcd1-4bac-b06c-1bcac58110c1` |
| 235 | 2026-10-17 | 17:00 | Aberdeen – St Mirren | Aberdeen (HOME) | 1.88 | 3-1 | VAR | `9a98a935-49d9-44f9-87cf-53fb330ac72b` |
| 236 | 2026-10-17 | 17:00 | Crewe – Rochdale | Crewe (HOME) | 1.97 | 3-2 | VAR | `934911e9-a0e9-49ba-92ba-038636550d64` |
| 237 | 2026-10-17 | 17:00 | East Kilbride – Montrose | East Kilbride (HOME) | 1.78 | 1-1 | VAR | `f35dbd63-68b0-43d8-bca1-6fd8e93147d0` |
| 238 | 2026-10-17 | 17:00 | Fulham – Hull | Fulham (HOME) | 1.68 | 1-0 | YOK | `489aba3a-5f19-4a47-b9e1-ccce4ae9c491` |
| 239 | 2026-10-17 | 17:00 | Grimsby – Northampton | Grimsby (HOME) | 1.81 | 0-2 | YOK | `5db460b8-2eb4-44f2-8a88-d5a18df746b9` |
| 240 | 2026-10-17 | 17:00 | Hibernian – Falkirk | Hibernian (HOME) | 1.77 | 1-2 | VAR | `c6f901cd-91f2-494e-ae6a-405aa7cc63fe` |
| 241 | 2026-10-17 | 17:00 | Inverness CT – Arbroath | Inverness CT (HOME) | 1.51 | 2-0 | YOK | `ac1e8872-9dbb-4fb7-a5ff-79a6e412d07f` |
| 242 | 2026-10-17 | 17:00 | Leicester – Doncaster | Leicester (HOME) | 2.00 | 2-1 | VAR | `92f4c0c5-0091-4414-b2a5-1ce22f101eef` |
| 243 | 2026-10-17 | 17:00 | Norwich – Portsmouth | Norwich (HOME) | 1.95 | 0-1 | YOK | `4eee5638-8773-4ece-85aa-ad3681aa2776` |
| 244 | 2026-10-17 | 17:00 | Oldham – Cheltenham | Oldham (HOME) | 1.84 | 4-1 | VAR | `88196fae-6fef-47ff-af86-6bba1adebfc1` |
| 245 | 2026-10-17 | 17:00 | Sheff Wed – AFC Wimbledon | Sheff Wed (HOME) | 1.71 | 5-0 | YOK | `1b223e77-1b18-4026-a4eb-29f1a69ffdb0` |
| 246 | 2026-10-17 | 17:00 | West Brom – Blackburn | West Brom (HOME) | 1.98 | 3-2 | VAR | `37de217e-f00d-4048-9361-ca9959ef348b` |
| 247 | 2026-10-17 | 17:00 | Wigan – Reading | Reading (AWAY) | 1.98 | 1-0 | YOK | `9e2f98d3-2dce-4508-8360-f7570a4cf107` |
| 248 | 2026-10-17 | 17:00 | Wrexham – Preston | Wrexham (HOME) | 1.62 | 4-1 | VAR | `2327f42a-8dfa-45fd-ba1b-eaef6010999e` |
| 249 | 2026-10-17 | 17:30 | Athletic Bilbao (W) – Valencia (W) | Athletic Bilbao (W) (HOME) | 1.57 | 1-0 | YOK | `11057747-6905-4973-a91a-e1688ddb7819` |
| 250 | 2026-10-17 | 18:00 | Paks – Gyori | Paks (HOME) | 1.94 | 1-2 | VAR | `5d1f871f-7a62-4ab5-a17f-2cf57ce45387` |
| 251 | 2026-10-17 | 18:00 | Vojvodina – FK Radnicki 1923 | Vojvodina (HOME) | 1.73 | 2-0 | YOK | `f940f34f-1c42-491b-9f30-431f0d50ecd8` |
| 252 | 2026-10-17 | 18:40 | NEOM Sports Club – Al-Ettifaq | NEOM Sports Club (HOME) | 1.99 | 0-1 | YOK | `bd275d7a-3764-41f6-9aa5-625ec31bfd16` |
| 253 | 2026-10-17 | 19:00 | Bologna – Inter | Inter (AWAY) | 1.63 | 1-3 | VAR | `b25a5bac-bdec-49bd-809d-133d753dea90` |
| 254 | 2026-10-17 | 19:00 | Hapoel Haifa – Hapoel Ramat Gan | Hapoel Haifa (HOME) | 1.80 | 0-2 | YOK | `ff6ad473-47de-403d-accd-6db668100e08` |
| 255 | 2026-10-17 | 19:00 | Osijek – HNK Gorica | Osijek (HOME) | 1.71 | 1-1 | VAR | `ca198bfd-d3b5-4687-90ad-d3b9c41e4c35` |
| 256 | 2026-10-17 | 19:00 | Winterthur – Luzern | Luzern (AWAY) | 1.93 | 0-1 | YOK | `e111db21-6472-4001-9815-4f6dd5190afa` |
| 257 | 2026-10-17 | 19:15 | Maccabi Netanya – Hapoel Kiryat Shmona | Maccabi Netanya (HOME) | 1.84 | 1-0 | YOK | `3a87ecd5-dda3-42e3-ac49-dd1d42208cd6` |
| 258 | 2026-10-17 | 19:30 | Fredericia – Hobro | Fredericia (HOME) | 1.59 | 3-0 | YOK | `9fcebfe5-13fe-4752-912e-d508749b044d` |
| 259 | 2026-10-17 | 20:00 | Atletico Ottawa – Forge | Forge (AWAY) | 1.58 | 1-2 | VAR | `8a262e81-ded8-4eee-82e9-0d5b202098b5` |
| 260 | 2026-10-17 | 20:00 | Centro Atletico Fenix – Paysandu FC | Centro Atletico Fenix (HOME) | 1.58 | 0-1 | YOK | `8b9cf8fd-f961-4ea9-98ba-863419832626` |
| 261 | 2026-10-17 | 21:00 | MC Oran – USM Khenchela | MC Oran (HOME) | 1.70 | 1-0 | YOK | `61319890-1c7f-4e0b-a180-38b0f851307f` |
| 262 | 2026-10-17 | 21:30 | Rapid Bucharest – FC Hunedoara | Rapid Bucharest (HOME) | 1.62 | 2-0 | YOK | `3a4f1392-254f-4918-9257-1f81024d509d` |
| 263 | 2026-10-17 | 21:45 | ESTAC Troyes – Lens | Lens (AWAY) | 1.95 | 1-3 | VAR | `d3938561-f133-4484-9f2b-0da6499bb68d` |
| 264 | 2026-10-17 | 21:45 | RAAL La Louviere – FC Liege | RAAL La Louviere (HOME) | 1.64 | 4-0 | YOK | `7870e75f-8c6d-402b-8a8e-4ceba4324bc0` |
| 265 | 2026-10-17 | 21:45 | Roma – Genoa | Roma (HOME) | 1.62 | 2-0 | YOK | `1b3b2b41-51a7-4b9e-8096-de20f3213db7` |
| 266 | 2026-10-17 | 21:45 | Sligo Rovers – Dundalk | Dundalk (AWAY) | 1.84 | 1-1 | VAR | `a456d2cd-7b08-459a-8b5b-f563b194f1a1` |
| 267 | 2026-10-17 | 22:00 | Macara – Independiente (Ecu) | Independiente (Ecu) (AWAY) | 1.81 | 1-0 | YOK | `f0ea6268-e659-4fc7-8a67-663c7b9ac60c` |
| 268 | 2026-10-17 | 22:00 | Sparta Rotterdam – Willem II | Sparta Rotterdam (HOME) | 1.65 | 3-2 | VAR | `94f56a7a-0836-40d5-9e49-af4532894ea4` |
| 269 | 2026-10-17 | 22:30 | Tristan Suarez – Patronato | Tristan Suarez (HOME) | 1.98 | 1-0 | YOK | `00db0fc1-6926-4d22-a2cd-576b7493a1d2` |
| 270 | 2026-10-17 | 23:00 | Boyaca Chico – Atletico Nacional Medellin | Atletico Nacional Medellin (AWAY) | 1.51 | 1-4 | VAR | `5ee2f430-c43f-4af1-b709-ee34e10446fe` |
| 271 | 2026-10-18 | 16:00 | Aston Villa (W) – Liverpool (W) | Liverpool (W) (AWAY) | 1.83 | 2-1 | VAR | `e9934745-0892-4dc0-8df1-8efcca74205e` |
| 272 | 2026-10-18 | 16:00 | Banik Ostrava – Sparta Prague | Sparta Prague (AWAY) | 1.75 | 0-0 | YOK | `26c3ce36-ce65-498f-9064-56d4cd1010ae` |
| 273 | 2026-10-18 | 16:00 | Brighton – Crystal Palace | Brighton (HOME) | 1.51 | 5-0 | YOK | `bb10d807-2def-48d5-a192-a2e6fe4baa75` |
| 274 | 2026-10-18 | 16:00 | Hajduk Split – Varazdin | Hajduk Split (HOME) | 1.88 | 1-0 | YOK | `7646597e-7416-489c-b245-1fdeecb410f3` |
| 275 | 2026-10-18 | 16:00 | Kayserispor – Batman Petrolspor | Kayserispor (HOME) | 1.74 | 2-2 | VAR | `94f809e8-a92a-4342-b53a-696b3b456e04` |
| 276 | 2026-10-18 | 16:00 | Koper – NK Brinje Grosuplje | Koper (HOME) | 1.75 | 5-0 | YOK | `d9c5e33c-eee8-4284-b667-cbb7ada68af4` |
| 277 | 2026-10-18 | 16:00 | Liepajas Metalurgs – FK Jelgava | Liepajas Metalurgs (HOME) | 1.81 | 3-0 | YOK | `d766334d-4db3-4b87-b2bb-903b112784a7` |
| 278 | 2026-10-18 | 16:00 | SSD Bari – Crotone | SSD Bari (HOME) | 1.81 | 0-0 | YOK | `5bc520d5-7063-4a4b-b42d-0dd566b32dec` |
| 279 | 2026-10-18 | 16:00 | Sundsvall – Varnamo | Varnamo (AWAY) | 1.73 | 0-1 | YOK | `ab9c055a-e0f6-4f2e-a2e1-5958a7edebe0` |
| 280 | 2026-10-18 | 16:30 | Debreceni VSC – Zalaegerszeg | Debreceni VSC (HOME) | 1.93 | 3-0 | YOK | `47d18ae6-883e-47c2-b162-f3dc3f9a0e10` |
| 281 | 2026-10-18 | 16:30 | Leverkusen – Freiburg | Leverkusen (HOME) | 1.67 | 2-1 | VAR | `94f31b71-e899-4be8-a3f6-e1f3b607e827` |
| 282 | 2026-10-18 | 16:30 | Paola Hibernians FC – Birzebbuga St Peters | Paola Hibernians FC (HOME) | 1.90 | 1-0 | YOK | `ff43579b-74d0-4f35-8077-268a9428ba8a` |
| 283 | 2026-10-18 | 17:00 | Celtic – Hearts | Celtic (HOME) | 1.60 | 7-1 | VAR | `0cfb0207-501e-43bc-a9ef-bd48036b3dbe` |
| 284 | 2026-10-18 | 17:00 | Felgueiras – Fafe | Felgueiras (HOME) | 1.69 | 1-0 | YOK | `5147f9ff-ca66-4531-a88a-54a6058dca3c` |
| 285 | 2026-10-18 | 17:00 | Mafra – Santa Clara | Santa Clara (AWAY) | 1.65 | 2-2 | VAR | `f4290332-5abb-428b-88bf-1757a3364ea5` |
| 286 | 2026-10-18 | 17:00 | Paide Linnameeskond – Trans Narva | Paide Linnameeskond (HOME) | 1.56 | 2-1 | VAR | `49d020a5-aee0-4ceb-9b2b-839c0efe255b` |
| 287 | 2026-10-18 | 17:30 | Orgryte – GAIS | GAIS (AWAY) | 1.61 | 4-2 | VAR | `c2c855b1-7d55-44e5-8320-0c25a8dfe184` |
| 288 | 2026-10-18 | 17:45 | FC Groningen – Ajax | Ajax (AWAY) | 1.95 | 2-5 | VAR | `4113b2bf-f8f6-41d9-9b35-033b24e433cc` |
| 289 | 2026-10-18 | 18:00 | Hodd – Raufoss | Hodd (HOME) | 1.81 | 5-1 | VAR | `261b1fd8-3cb7-476e-b7d6-8dde261f81eb` |
| 290 | 2026-10-18 | 18:00 | Karpaty – FC Epicentr Dunaivtsi | Karpaty (HOME) | 1.84 | 2-2 | VAR | `dd069bc4-488c-47a1-ab3d-736f5914cba6` |
| 291 | 2026-10-18 | 18:00 | Odds BK – Strommen | Odds BK (HOME) | 1.51 | 1-2 | VAR | `a12020c3-3677-4a2a-80ae-dd81b67ce697` |
| 292 | 2026-10-18 | 18:00 | Sturm Graz – Grazer AK | Sturm Graz (HOME) | 1.91 | 6-1 | VAR | `a30b3dbd-6508-4311-8e97-3d8542b1c1ef` |
| 293 | 2026-10-18 | 18:30 | AC Ospitaletto – Pergolettese | AC Ospitaletto (HOME) | 1.91 | 2-3 | VAR | `8ae4e4ce-2c62-43ba-8b1a-4d3223c50335` |
| 294 | 2026-10-18 | 18:30 | Lech Poznan – Korona Kielce | Lech Poznan (HOME) | 1.60 | 6-1 | VAR | `8f44cdde-7024-44bf-b9b4-9be1444dc1b7` |
| 295 | 2026-10-18 | 18:30 | Nottm Forest – Arsenal | Arsenal (AWAY) | 1.62 | 0-1 | YOK | `03c6bdc9-012e-4ca1-9899-afc811607f77` |
| 296 | 2026-10-18 | 19:00 | AC Milan – Atalanta | AC Milan (HOME) | 1.79 | 3-2 | VAR | `a84de65b-6c39-46f3-a99a-97c5729edf4c` |
| 297 | 2026-10-18 | 19:00 | Basaksehir – Gaziantep FK | Basaksehir (HOME) | 1.74 | 2-1 | VAR | `cf191596-ecb5-4d94-824f-8428de792f31` |
| 298 | 2026-10-18 | 19:00 | FC Copenhagen – AGF | FC Copenhagen (HOME) | 1.66 | 1-1 | VAR | `71a61413-9752-4528-83c4-e626cd86d998` |
| 299 | 2026-10-18 | 19:00 | Omonia 29th May – Anorthosis | Anorthosis (AWAY) | 1.76 | 1-0 | YOK | `12825bd8-e984-4c31-b3ee-13af39e437bd` |
| 300 | 2026-10-18 | 19:00 | Tallinna FC Flora – Tammeka Tartu | Tallinna FC Flora (HOME) | 1.75 | 2-0 | YOK | `10b76468-6970-447e-82ed-ce12b264b506` |
| 301 | 2026-10-18 | 19:30 | Girona – FC Andorra | Girona (HOME) | 1.84 | 2-0 | YOK | `4f88809e-53b1-4a47-8135-1acff608606d` |
| 302 | 2026-10-18 | 19:45 | Al Gharafa – Al Rayyan | Al Rayyan (AWAY) | 1.80 | 0-0 | YOK | `c37813e8-10e2-4115-8983-d4fc16394a4b` |
| 303 | 2026-10-18 | 20:30 | Sampdoria – Arezzo | Sampdoria (HOME) | 1.87 | 1-2 | VAR | `9915ea98-893d-4f13-9fd1-a530ae280df1` |
| 304 | 2026-10-18 | 20:30 | Sandecja Nowy Sacz – Zawisza Bydgoszcz | Sandecja Nowy Sacz (HOME) | 1.79 | 4-3 | VAR | `d11df3ca-cf7b-431b-a066-d392218bc7fa` |
| 305 | 2026-10-18 | 20:30 | SV Meppen – TSV Havelse | SV Meppen (HOME) | 1.73 | 1-1 | VAR | `cde0ee1f-3e45-4e11-be77-a35a20d523d8` |
| 306 | 2026-10-18 | 21:00 | Celik Zenica – Zrinjski | Zrinjski (AWAY) | 1.56 | 0-3 | YOK | `cc3bcebb-64c0-443b-801c-2c21797bf4f9` |
| 307 | 2026-10-18 | 21:00 | Deportivo Moron – Club Atletico Mitre | Deportivo Moron (HOME) | 1.82 | 0-2 | YOK | `ee594981-b29e-4e71-92de-528b2229ac60` |
| 308 | 2026-10-18 | 21:00 | NEC Nijmegen – Fortuna Sittard | NEC Nijmegen (HOME) | 1.82 | 2-2 | VAR | `f5b881ab-40c9-499d-87cc-41c0bffef903` |
| 309 | 2026-10-18 | 21:00 | San Marcos – Puerto Montt | San Marcos (HOME) | 1.69 | 0-0 | YOK | `f0fbe212-292d-437e-906e-389e74d4483f` |
| 310 | 2026-10-18 | 21:15 | FC Cajamarca – Cesar Vallejo Moquegua | FC Cajamarca (HOME) | 1.75 | 0-1 | YOK | `701ce544-3056-496e-9221-148c3b06f025` |
| 311 | 2026-10-18 | 21:45 | CF Os Belenenses – Arouca | Arouca (AWAY) | 1.62 | 3-3 | VAR | `78f2eb7c-2ae0-42d2-83dc-76c2973f9d6d` |
| 312 | 2026-10-18 | 21:45 | Juventus – Lazio | Juventus (HOME) | 1.62 | 0-3 | YOK | `1b38c009-5295-4bb2-a6a7-3cddbb8bab11` |
| 313 | 2026-10-18 | 21:45 | Lyon – Nice | Lyon (HOME) | 1.93 | 2-1 | VAR | `07de74b3-96a7-4286-a617-a3e2756a6162` |
| 314 | 2026-10-18 | 22:00 | CD Leones del Norte – Emelec | CD Leones del Norte (HOME) | 1.98 | 1-3 | VAR | `33d60e24-6e3a-4e06-846c-ecc68bd5d39d` |
| 315 | 2026-10-18 | 22:00 | CRB – Botafogo SP | CRB (HOME) | 1.62 | 0-1 | YOK | `5a887cd4-bdb1-4065-b36f-add2cf231fad` |
| 316 | 2026-10-18 | 22:00 | Ferro Carril Oeste – CA Racing de Cordo | Ferro Carril Oeste (HOME) | 1.56 | 1-0 | YOK | `91060eb3-747b-4406-8489-efcfe69fcadd` |
| 317 | 2026-10-18 | 22:00 | Nacional Potosi – Bolivar | Bolivar (AWAY) | 1.78 | 0-1 | YOK | `3ab9be38-b249-4aa4-b712-1bd45709d168` |
| 318 | 2026-10-18 | 22:30 | Estudiantes de Merida – Metropolitanos | Estudiantes de Merida (HOME) | 1.77 | 2-2 | VAR | `af715d59-d8ad-4d98-b6d7-4fbea679ca3a` |
| 319 | 2026-10-18 | 22:30 | Puerto Cabello – Monagas | Puerto Cabello (HOME) | 1.80 | 3-3 | VAR | `87926728-4268-4bbd-a9bb-8be486792668` |
| 320 | 2026-10-18 | 23:00 | CA Guemes – Almagro BA | Almagro BA (AWAY) | 1.57 | 2-1 | VAR | `64601924-06a2-4868-b8a6-93cb876431ae` |
| 321 | 2026-10-18 | 23:00 | Cerro Porteno – Club Sportivo Ameliano | Cerro Porteno (HOME) | 1.68 | 2-2 | VAR | `5f265184-4761-4048-8fee-b2fa5d07e88c` |
| 322 | 2026-10-19 | 18:00 | Universitatea Cluj – Arges Pitesti | Universitatea Cluj (HOME) | 1.67 | 2-2 | VAR | `3cf629a2-b850-4d01-939a-886d5bfbc56a` |
| 323 | 2026-10-19 | 18:05 | Al-Zulfi SC – Al-Ula FC | Al-Ula FC (AWAY) | 1.95 | 1-1 | VAR | `307cc270-4106-4b6f-aa79-2b79f73af1d1` |
| 324 | 2026-10-19 | 18:45 | FK Suduva – FK Kauno Zalgiris | FK Kauno Zalgiris (AWAY) | 2.00 | 0-1 | YOK | `8da8b2d2-ded9-4a2b-bf77-6661f88f565a` |
| 325 | 2026-10-19 | 19:00 | FC Tallinn – Viimsi JK | Viimsi JK (AWAY) | 1.63 | 0-3 | YOK | `bb363229-2d7a-4b19-a741-31ca693e9597` |
| 326 | 2026-10-19 | 19:00 | Lyn 2 – Orn Horten | Lyn 2 (HOME) | 1.70 | 3-1 | VAR | `0d7f47c7-6ef2-44f2-94a7-0e4a901f71df` |
| 327 | 2026-10-19 | 19:00 | Nieciecza – Puszcza Niepolomice | Nieciecza (HOME) | 1.85 | 2-0 | YOK | `517d889f-586f-45b3-b173-2b6bfc2f17d7` |
| 328 | 2026-10-19 | 20:00 | Al-Masry – Abo Qair Semads | Al-Masry (HOME) | 1.55 | 1-1 | VAR | `7dad639b-ddd0-497f-9216-bccf0868d2d3` |
| 329 | 2026-10-19 | 20:00 | KFUM Oslo Fotball II – Frigg | KFUM Oslo Fotball II (HOME) | 1.52 | 6-0 | YOK | `3f2e7674-528e-4a7d-8449-cd43325412b1` |
| 330 | 2026-10-19 | 20:00 | Tzeirey Tira FC – Hapoel Eran Hadera | Hapoel Eran Hadera (AWAY) | 1.66 | 0-1 | YOK | `4d4d0f40-7657-4dd3-a3e6-254aa66b765c` |
| 331 | 2026-10-19 | 20:00 | Wisla Plock – Radomiak Radom | Wisla Plock (HOME) | 1.93 | 1-0 | YOK | `d62a4901-fb55-4ae9-9748-3dc64f017e2d` |
| 332 | 2026-10-19 | 20:05 | Varbergs BoIS – Helsingborgs | Varbergs BoIS (HOME) | 1.90 | 0-0 | YOK | `86759dbd-4d32-4359-8fbb-75b21466dc07` |
| 333 | 2026-10-19 | 20:30 | Diosgyori – Kazincbarcika | Diosgyori (HOME) | 1.90 | 2-2 | VAR | `fc3c4696-26bd-4c9a-9ae7-a6d7fb0d6fca` |
| 334 | 2026-10-19 | 21:00 | Al-Shabab (KSA) – Al Faisaly ( KSA ) | Al-Shabab (KSA) (HOME) | 1.65 | 2-2 | VAR | `36c0cbbd-34ec-4a48-992e-339a03bbea00` |
| 335 | 2026-10-19 | 21:00 | FC Voluntari – FCSB | FCSB (AWAY) | 1.62 | 1-2 | VAR | `1eeca140-4f71-429e-99bf-49af518a9aa7` |
| 336 | 2026-10-19 | 21:00 | Jong FC Utrecht – Roda JC | Roda JC (AWAY) | 1.87 | 1-2 | VAR | `20266d3d-2ac4-4276-8c48-804a6a41eba1` |
| 337 | 2026-10-19 | 21:30 | Cittadella – Arzignanochiampo | Cittadella (HOME) | 1.69 | 1-0 | YOK | `bf003627-527c-4288-b95f-a0ccdbe2aa66` |
| 338 | 2026-10-19 | 21:30 | Giana Erminio – Union Brescia | Union Brescia (AWAY) | 1.67 | 2-1 | VAR | `8d4f2fb2-6d1b-4e76-9727-7e18e65669d6` |
| 339 | 2026-10-19 | 21:30 | SSD Dolomiti Bellunesi – A.C. Trento S.C.S.D. | A.C. Trento S.C.S.D. (AWAY) | 1.74 | 0-3 | YOK | `fe2264e0-03b7-4c53-96d6-f0db987e7476` |
| 340 | 2026-10-19 | 21:45 | Waterford – Galway Utd | Waterford (HOME) | 1.95 | 3-2 | VAR | `4f4217aa-d2c1-47cd-9704-657e75feb293` |
| 341 | 2026-10-19 | 22:00 | Tottenham – Coventry | Tottenham (HOME) | 1.59 | 3-1 | VAR | `bfb4298f-b05f-4428-a490-f72062f22161` |
| 342 | 2026-10-19 | 22:15 | Braga – Gil Vicente | Braga (HOME) | 1.58 | 1-2 | VAR | `a2b219d3-b4e0-4f8d-ad9f-234a943d7968` |
| 343 | 2026-10-19 | 22:15 | Fram – IA Akranes | Fram (HOME) | 1.91 | 2-4 | VAR | `7d7cabd9-0740-4058-a5f3-6d9b645dce56` |
| 344 | 2026-10-19 | 22:30 | Deportivo Santani – 3 de Noviembre | Deportivo Santani (HOME) | 1.81 | 2-0 | YOK | `e041187f-b375-4e87-bf4d-b63efab5cc8c` |
| 345 | 2026-10-19 | 22:30 | Encarnacion – General Caballero | General Caballero (AWAY) | 1.73 | 3-2 | VAR | `8a2f670b-2218-4da4-a5f5-a1c9343ff832` |
| 346 | 2026-10-19 | 23:30 | Mushuc Runa – Orense Sporting Club | Mushuc Runa (HOME) | 1.93 | 1-1 | VAR | `619a2483-ceef-42ef-bcbf-09ce8d55c872` |
| 347 | 2026-10-20 | 16:25 | Fortis FC Limited – FC Goa | FC Goa (AWAY) | 1.95 | 1-2 | VAR | `9eec8084-df7d-4232-b189-bf5e7f5bc62c` |
| 348 | 2026-10-20 | 17:00 | Istiqlol – Al Arabi Kuwait | Istiqlol (HOME) | 1.90 | 2-0 | YOK | `e4bc4159-6ba6-45ef-9859-52100206f376` |
| 349 | 2026-10-20 | 17:45 | Hajer Club – Al Najma Club | Al Najma Club (AWAY) | 1.66 | 2-4 | VAR | `47c9888f-112e-45bb-8ac2-8ccf936d51c6` |
| 350 | 2026-10-20 | 18:00 | Al Draih – Al Riyadh SC | Al Draih (HOME) | 1.68 | 1-0 | YOK | `c871a6cb-db71-46c8-b1a0-3d2ffb4493ee` |
| 351 | 2026-10-20 | 19:45 | Fenerbahce – Slavia Prague | Fenerbahce (HOME) | 1.62 | 2-2 | VAR | `b4edec4f-7a53-4643-ad5b-510b12472f7d` |
| 352 | 2026-10-20 | 20:00 | Norrkoping – Orebro | Norrkoping (HOME) | 1.66 | 2-2 | VAR | `48b70bcf-485f-40fd-b1bb-c235eba6697e` |
| 353 | 2026-10-20 | 20:30 | Regar-TadAZ – Al-Qadsia | Al-Qadsia (AWAY) | 1.88 | 0-1 | YOK | `fcd2aa11-66ec-47d5-8279-e3d4b1d44d98` |
| 354 | 2026-10-20 | 21:45 | Barnet – Swindon | Barnet (HOME) | 1.51 | 1-3 | VAR | `9da86f80-2f74-4122-99d3-aee3f4e772c4` |
| 355 | 2026-10-20 | 21:45 | Bromley – Leicester | Leicester (AWAY) | 1.74 | 0-4 | YOK | `b364b030-2718-430b-8f21-fd557792780d` |
| 356 | 2026-10-20 | 21:45 | Burton Albion – Bradford | Bradford (AWAY) | 1.88 | 0-0 | YOK | `80b0c9e8-042c-451f-9ff9-4c8ce11068d3` |
| 357 | 2026-10-20 | 21:45 | Chesterfield – Colchester | Chesterfield (HOME) | 1.62 | 1-1 | VAR | `9f3a56e9-8b59-44dc-a222-b9e7cf462f56` |
| 358 | 2026-10-20 | 21:45 | Doncaster – Stockport | Stockport (AWAY) | 1.80 | 0-2 | YOK | `623fe81f-19d9-40ba-8297-59a128c83f4e` |
| 359 | 2026-10-20 | 21:45 | Huddersfield – Peterborough | Huddersfield (HOME) | 1.56 | 4-1 | VAR | `6f079a81-5d8f-4164-9eb9-a101ca1947c2` |
| 360 | 2026-10-20 | 21:45 | Oxford Utd – Wigan | Oxford Utd (HOME) | 2.00 | 2-1 | VAR | `fcda4c25-1819-4fbe-b0cf-0530115f3d0d` |
| 361 | 2026-10-20 | 21:45 | Wolves – Portsmouth | Wolves (HOME) | 1.65 | 1-1 | VAR | `e51551d0-606b-4380-85ee-3ec75f333917` |
| 362 | 2026-10-20 | 21:45 | York City – Accrington | York City (HOME) | 1.77 | 1-1 | VAR | `9d24c48d-a9b0-4d4c-8b3c-fabaafdcd741` |
| 363 | 2026-10-20 | 22:00 | Liverpool – Villarreal | Liverpool (HOME) | 1.54 | 4-3 | VAR | `a1a05138-aa61-433d-94bb-2f05a17a7768` |
| 364 | 2026-10-20 | 22:00 | Napoli – Bodo Glimt | Napoli (HOME) | 1.80 | 4-3 | VAR | `9cc2985b-5cdf-466e-b4a8-72fe9aba1a46` |
| 365 | 2026-10-20 | 22:00 | Porto – PSV | Porto (HOME) | 1.59 | 0-1 | YOK | `2b3129c8-61c5-40aa-8e9e-1b4bdf0e00c1` |
| 366 | 2026-10-20 | 23:00 | Independiente Yumbo – Boca Juniors de Cali | Independiente Yumbo (HOME) | 2.00 | 3-0 | YOK | `3ce89fe4-9bf6-4954-b8f3-3e14d3270faa` |
| 367 | 2026-10-20 | 23:30 | Atletico FC Cali – Quindio | Quindio (AWAY) | 1.70 | 0-1 | YOK | `c985dcc5-62d9-4ef2-9cf6-0d4e24037b32` |
| 368 | 2026-10-21 | 16:00 | Betis Sevilla U19 – Feyenoord Youth | Betis Sevilla U19 (HOME) | 1.53 | 1-4 | VAR | `e63be68b-f249-469b-ab56-14fa1c19fd62` |
| 369 | 2026-10-21 | 18:00 | Harju JK Laagri – Tallinna FC Flora | Tallinna FC Flora (AWAY) | 1.96 | 3-1 | VAR | `2104684f-43ee-42eb-a2d2-13c2643d1345` |
| 370 | 2026-10-21 | 18:30 | Zlate Moravce – KFC Komarno | KFC Komarno (AWAY) | 1.84 | 0-0 | YOK | `b62de03f-6d65-45a1-9b71-4ab66fbcda4f` |
| 371 | 2026-10-21 | 19:00 | Birzebbuga St Peters – Marsaxlokk FC | Marsaxlokk FC (AWAY) | 1.80 | 2-0 | YOK | `ae58ad77-6be7-4f51-8d75-7cb9820d36cb` |
| 372 | 2026-10-21 | 19:00 | Hamrun Spartans FC – Balzan FC | Hamrun Spartans FC (HOME) | 1.82 | 1-1 | VAR | `b4cfc3af-d42c-44dd-bb35-55179a6d9095` |
| 373 | 2026-10-21 | 19:50 | Jeddah Club – Al Jabalain | Al Jabalain (AWAY) | 1.64 | 0-1 | YOK | `752382ea-f27c-4bd2-8f1e-f4c4f3c6739c` |
| 374 | 2026-10-21 | 20:00 | Sogndal – Raufoss | Sogndal (HOME) | 1.52 | 2-1 | VAR | `1a9afe0f-9656-4490-9c3f-17d930c206bb` |
| 375 | 2026-10-21 | 20:00 | Vanlose – Nykobing FC | Nykobing FC (AWAY) | 1.54 | 0-2 | YOK | `3441a352-caa6-4bff-ae0c-210b235edaed` |
| 376 | 2026-10-21 | 21:00 | CA Lanus (Res) – Quilmes (Res) | CA Lanus (Res) (HOME) | 2.00 | 4-1 | VAR | `e9f7c348-26b0-4b81-b994-c2bb5098210d` |
| 377 | 2026-10-21 | 21:00 | Durham (W) – Birmingham (W) | Birmingham (W) (AWAY) | 1.55 | 0-5 | YOK | `697f7da6-b588-4a1e-95e1-8b6e61f5e1f1` |
| 378 | 2026-10-21 | 21:00 | West Ham United (W) – London City Lionesses | London City Lionesses (AWAY) | 1.73 | 1-2 | VAR | `85deddf9-3576-477c-a0cd-561e18ea5d39` |
| 379 | 2026-10-21 | 21:30 | Mosta – Valletta | Valletta (AWAY) | 1.58 | 0-2 | YOK | `5f708e34-70d4-44e1-95b5-0eed604a7e8d` |
| 380 | 2026-10-21 | 22:00 | Betis – Feyenoord | Betis (HOME) | 1.70 | 1-0 | YOK | `b52eb311-aee7-413f-8db9-ecb5f799f9f6` |
| 381 | 2026-10-21 | 22:00 | Club Brugge – Lens | Club Brugge (HOME) | 1.94 | 3-0 | YOK | `a3a6815f-11c2-47be-b2e5-13f8fa017fa5` |
| 382 | 2026-10-21 | 22:00 | Liverpool Montevideo – Cerro Largo FC | Liverpool Montevideo (HOME) | 1.87 | 1-0 | YOK | `6bf2a42e-643a-478e-b31a-0a15de50f62c` |
| 383 | 2026-10-21 | 23:00 | Independiente Santa Fe (W) – Corinthians (W) | Corinthians (W) (AWAY) | 1.61 | 1-5 | VAR | `ced059e8-5f0a-4733-8f54-e6a6a39568fa` |
| 384 | 2026-10-22 | 16:30 | Bunyodkor – Mash al Mubarek | Bunyodkor (HOME) | 1.51 | 2-1 | VAR | `f7f53e14-e39a-452e-913f-63568639a639` |
| 385 | 2026-10-22 | 17:30 | Kairat Almaty – Panathinaikos | Panathinaikos (AWAY) | 1.69 | 1-5 | VAR | `ad2125c1-e8c4-4500-8a7c-395fe5486e6e` |
| 386 | 2026-10-22 | 18:00 | Sardarapat FC – FC Urartu | FC Urartu (AWAY) | 1.91 | 0-0 | YOK | `66ef7c13-3834-43ae-b4d2-693458584256` |
| 387 | 2026-10-22 | 19:00 | Sitra – Al Riffa | Al Riffa (AWAY) | 1.57 | 2-3 | VAR | `750c54db-f4b2-46c3-b971-b9c17bcfada3` |
| 388 | 2026-10-22 | 19:45 | Al Gharafa – Al Ahli (QAT) | Al Gharafa (HOME) | 1.98 | 2-2 | VAR | `b08d84b9-235c-4ce5-b719-fb5d8c67b91c` |
| 389 | 2026-10-22 | 19:45 | Dinamo Zagreb – NEC Nijmegen | Dinamo Zagreb (HOME) | 1.53 | 2-4 | VAR | `66bc0f79-d292-43db-b990-b5efdf1e33c1` |
| 390 | 2026-10-22 | 19:45 | FK Kauno Zalgiris – Brann | Brann (AWAY) | 1.79 | 1-4 | VAR | `67bf8064-109e-49bb-8508-bd2438f22b96` |
| 391 | 2026-10-22 | 19:45 | Inter Club Escaldes – Universitatea Craiova | Universitatea Craiova (AWAY) | 1.62 | 1-3 | VAR | `f73be6e7-9cb3-4480-ac66-cf550ac291dc` |
| 392 | 2026-10-22 | 19:45 | Lech Poznan – Sunderland | Sunderland (AWAY) | 1.78 | 1-1 | VAR | `756a8a79-0890-4273-ae7b-9b111985ea52` |
| 393 | 2026-10-22 | 19:45 | Pafos FC – FK Riga | Pafos FC (HOME) | 1.64 | 1-1 | VAR | `b5429f72-f033-47ec-b417-0fc5661a21fd` |
| 394 | 2026-10-22 | 19:45 | Sturm Graz – Marseille | Marseille (AWAY) | 1.94 | 1-0 | YOK | `36420c6e-9b4a-4afe-acf8-b0211744efe0` |
| 395 | 2026-10-22 | 21:30 | San Antonio FC – Club Nueve de Octubre | Club Nueve de Octubre (AWAY) | 1.60 | 3-3 | VAR | `2714e670-f364-40c6-8f03-90b855b5f0cf` |
| 396 | 2026-10-22 | 22:00 | AGF – Egnatia Rrogozhine | AGF (HOME) | 1.52 | 1-1 | VAR | `0bdfc937-133d-4595-816a-3edf5e7b8ee0` |
| 397 | 2026-10-22 | 22:00 | Borac Banja Luka – KuPS | Borac Banja Luka (HOME) | 1.86 | 2-0 | YOK | `89f5993c-d244-4218-8866-da0d9ea90cd0` |
| 398 | 2026-10-22 | 22:00 | Braga – Gent | Braga (HOME) | 1.99 | 2-0 | YOK | `8741206a-e1ee-4445-9066-2ae0a5456f35` |
| 399 | 2026-10-22 | 22:00 | Metropolitanos – Academia Anzoategui FC | Metropolitanos (HOME) | 1.69 | 1-1 | VAR | `9a59ed17-3203-4918-b020-544fa51906d3` |
| 400 | 2026-10-22 | 22:00 | Midtjylland – Sint Truiden | Midtjylland (HOME) | 1.77 | 0-1 | YOK | `a11d5c30-0456-4071-b9d0-1800456580b8` |
| 401 | 2026-10-22 | 22:00 | NK Celje – Red Bull Salzburg | Red Bull Salzburg (AWAY) | 1.57 | 2-2 | VAR | `448f3799-649c-4f94-bd52-29ad1a0d0b12` |
| 402 | 2026-10-22 | 22:00 | Olympiakos – Sparta Prague | Olympiakos (HOME) | 1.56 | 1-0 | YOK | `3c4226f2-d073-4ec9-940d-b3464d815661` |
| 403 | 2026-10-22 | 22:00 | Plzen – PFC Levski Sofia | Plzen (HOME) | 1.77 | 1-2 | VAR | `1605478d-9523-4e0a-b9ed-84af28d3c6da` |
| 404 | 2026-10-23 | 16:00 | CSKA Sofia II – FC Yantra | CSKA Sofia II (HOME) | 1.98 | 3-3 | VAR | `ed2277e4-4eef-4938-8954-c1490d88f32a` |
| 405 | 2026-10-23 | 16:30 | Avenir S Marsa – Hammam-Lif | Avenir S Marsa (HOME) | 1.95 | 1-1 | VAR | `c8e7c040-2564-480f-8cac-34f32dfcda2f` |
| 406 | 2026-10-23 | 16:30 | JS Omrane – Olympique De Beja | JS Omrane (HOME) | 2.00 | 0-0 | YOK | `1ece7452-fecd-4c5e-9333-ef857a12b6a1` |
| 407 | 2026-10-23 | 17:00 | Istiqlol – Homs Al Fidaa SC | Istiqlol (HOME) | 2.00 | 0-2 | YOK | `be15e401-751f-41e2-8b60-75e0f08ac5ba` |
| 408 | 2026-10-23 | 17:30 | Al Shamal – Qatar SC | Al Shamal (HOME) | 1.82 | 2-3 | VAR | `3d04f0b5-dd86-40e4-836d-a8572a02b65f` |
| 409 | 2026-10-23 | 18:00 | Etihad Al Ramtha – Alhashemyya | Etihad Al Ramtha (HOME) | 1.69 | 1-1 | VAR | `933157ed-009e-478d-b597-8c4e6f12970a` |
| 410 | 2026-10-23 | 18:00 | Zira – FK Sumqayit | Zira (HOME) | 1.81 | 3-2 | VAR | `bda9bb8c-3482-4ab6-90a9-e61815e5e572` |
| 411 | 2026-10-23 | 18:30 | Al-Ittihad – Al Draih | Al-Ittihad (HOME) | 1.85 | 2-0 | YOK | `133a32eb-0f24-4b39-b8f9-14bf2a21a63c` |
| 412 | 2026-10-23 | 19:00 | Al Khalidiyah – Al-Ittifaq Maqaba | Al Khalidiyah (HOME) | 1.61 | 2-2 | VAR | `be809901-d1e7-41b7-b708-0c4a130dfd69` |
| 413 | 2026-10-23 | 19:00 | Dukla Prague – SK Kladno | Dukla Prague (HOME) | 1.68 | 1-1 | VAR | `37cbae12-c80a-4e4b-94c5-29f60c84f6fd` |
| 414 | 2026-10-23 | 19:00 | JK Welco Elekter – Tallinna Kalev | JK Welco Elekter (HOME) | 1.60 | 3-2 | VAR | `b214db3e-5706-4938-adbe-21c8b475fdc3` |
| 415 | 2026-10-23 | 19:00 | MAS Taborsko – Trinec | MAS Taborsko (HOME) | 1.67 | 1-1 | VAR | `aff85677-176e-42da-b039-ca131630ccf3` |
| 416 | 2026-10-23 | 19:00 | Polonia Warszawa – Miedz Legnica | Polonia Warszawa (HOME) | 1.96 | 1-1 | VAR | `cabf3898-d728-497a-a2ea-0ff368ee7510` |
| 417 | 2026-10-23 | 19:00 | Tammeka Tartu – Trans Narva | Tammeka Tartu (HOME) | 1.94 | 5-1 | VAR | `71a907c4-9e83-43c4-89c8-ebf905ccfd21` |
| 418 | 2026-10-23 | 19:00 | Vysocina Jihlava – FC Sellier & Bellot Vlasim | Vysocina Jihlava (HOME) | 1.96 | 2-0 | YOK | `65bc8555-00fd-4f49-a6bb-b0e1d82b5306` |
| 419 | 2026-10-23 | 19:00 | Zawisza Bydgoszcz – Swit Skolwin | Zawisza Bydgoszcz (HOME) | 1.66 | 4-2 | VAR | `27344e01-9d80-4464-a816-700d59dbc16c` |
| 420 | 2026-10-23 | 19:30 | First Vienna Fc 1894 – Floridsdorfer AC | First Vienna Fc 1894 (HOME) | 1.65 | 2-0 | YOK | `7f9ad165-78c0-44de-b909-81c147337057` |
| 421 | 2026-10-23 | 19:30 | KSV 1919 – St Polten | St Polten (AWAY) | 1.61 | 1-1 | VAR | `2073fda0-65eb-4e14-9d84-9146fbb951db` |
| 422 | 2026-10-23 | 19:30 | SKU Amstetten – Rapid Vienna (Am) | SKU Amstetten (HOME) | 1.55 | 3-2 | VAR | `35b9fab4-697f-4ac2-9b05-b72974c4e620` |
| 423 | 2026-10-23 | 20:00 | Boluspor – Van Buyuksehir Belediyespor | Van Buyuksehir Belediyespor (AWAY) | 1.89 | 0-3 | YOK | `41040de1-ac49-41c9-8ec5-c6b8bab55fd7` |
| 424 | 2026-10-23 | 20:00 | Hvidovre – HB Koge | Hvidovre (HOME) | 1.94 | 2-2 | VAR | `41481849-7ce1-4fd1-a902-e1580506b3b9` |
| 425 | 2026-10-23 | 20:00 | Rot-Weiss Essen – Jahn Regensburg | Rot-Weiss Essen (HOME) | 1.78 | 1-0 | YOK | `36e14559-c8b6-47c9-b070-a10443a53d63` |
| 426 | 2026-10-23 | 20:00 | Vasteras SK – Halmstads | Vasteras SK (HOME) | 1.69 | 1-2 | VAR | `ad842107-a834-492c-91e6-d079618b6b8b` |
| 427 | 2026-10-23 | 20:30 | FC Goa – Al-Qadsia | Al-Qadsia (AWAY) | 1.84 | 1-2 | VAR | `1a010cb3-3cc0-4f68-94d6-992948be6afe` |
| 428 | 2026-10-23 | 20:30 | Stade Lausanne-Ouchy – Neuchatel Xamax | Stade Lausanne-Ouchy (HOME) | 1.63 | 0-0 | YOK | `671b3759-f260-453c-b3ee-aefe40930719` |
| 429 | 2026-10-23 | 21:00 | Almere City – Roda JC | Almere City (HOME) | 1.99 | 2-3 | VAR | `260bc38f-6e99-485e-93e3-850e4b06d655` |
| 430 | 2026-10-23 | 21:00 | Den Bosch – MVV Maastricht | Den Bosch (HOME) | 1.78 | 2-2 | VAR | `fd8243f9-139f-433d-9adb-26ee92dfc889` |
| 431 | 2026-10-23 | 21:00 | FC Volendam – Jong FC Utrecht | FC Volendam (HOME) | 1.73 | 6-2 | VAR | `8bba8b28-b140-4056-8c5a-5bb5a4a86f97` |
| 432 | 2026-10-23 | 21:00 | Go Ahead Eagles – SC Telstar | Go Ahead Eagles (HOME) | 1.62 | 3-2 | VAR | `e1f46a80-b4cf-4a6e-ace0-1bd34a9195ae` |
| 433 | 2026-10-23 | 21:00 | Jong AZ Alkmaar – Helmond Sport | Jong AZ Alkmaar (HOME) | 1.91 | 5-4 | VAR | `72359eaf-c190-45b7-8de0-fb22c5e7b15d` |
| 434 | 2026-10-23 | 21:00 | Nancy – Laval | Nancy (HOME) | 1.72 | 1-0 | YOK | `18575e43-e1b3-46eb-bcd7-173c43a5fcf0` |
| 435 | 2026-10-23 | 21:00 | Pau – Grenoble | Pau (HOME) | 1.95 | 2-1 | VAR | `f8631476-c835-45dd-bacf-df29c42a0097` |
| 436 | 2026-10-23 | 21:00 | UTC Cajamarca – Melgar | Melgar (AWAY) | 1.65 | 1-2 | VAR | `e8b8b1a8-57fa-403a-84a6-da01754c5cde` |
| 437 | 2026-10-23 | 21:30 | Altamura – Potenza | Potenza (AWAY) | 1.98 | 2-2 | VAR | `8dc8adbf-9d56-42c4-a51b-1c5dae330ea5` |
| 438 | 2026-10-23 | 21:30 | ASD Pineto Calcio – Gubbio | ASD Pineto Calcio (HOME) | 2.00 | 1-0 | YOK | `1e390d9f-ec66-407b-a42d-a7407acbb116` |
| 439 | 2026-10-23 | 21:45 | Bohemians – Shelbourne | Bohemians (HOME) | 1.68 | 0-1 | YOK | `d35cd72b-c57f-4288-bbae-80010f5d7f3e` |
| 440 | 2026-10-23 | 21:45 | Derry City – Dundalk | Derry City (HOME) | 1.82 | 2-1 | VAR | `34781b64-1ff1-40b7-8a7d-73b9803228a5` |
| 441 | 2026-10-23 | 21:45 | Galway Utd – St Patricks | St Patricks (AWAY) | 1.70 | 0-0 | YOK | `593f4b6e-1e75-4e65-8449-77c6cf1288b1` |
| 442 | 2026-10-23 | 21:45 | Gateshead – Tamworth FC | Tamworth FC (AWAY) | 1.69 | 0-0 | YOK | `b92109b7-0fbc-4241-b093-c6b3b01a0f86` |
| 443 | 2026-10-23 | 21:45 | Waterford – Drogheda | Waterford (HOME) | 1.75 | 3-1 | VAR | `fa6de1dc-bd8a-49d5-9b99-c99842f9a6d2` |
| 444 | 2026-10-23 | 22:00 | Alaves – Malaga | Alaves (HOME) | 1.69 | 1-1 | VAR | `82e1af96-5a39-4ae7-b090-70487a5a36ed` |
| 445 | 2026-10-23 | 22:00 | Bolton – Middlesbrough | Middlesbrough (AWAY) | 1.67 | 1-5 | VAR | `d949f9d6-cfa3-4cd3-b6e9-fec4937d1584` |
| 446 | 2026-10-23 | 22:15 | CE Europa – Zaragoza | Zaragoza (AWAY) | 1.92 | 0-1 | YOK | `05074605-8d27-4770-930c-58bdeb74f3c9` |
| 447 | 2026-10-23 | 22:45 | Guimaraes – Maritimo | Guimaraes (HOME) | 1.59 | 5-0 | YOK | `0efa6339-c331-4d84-9e8c-c82f3e4ecd88` |
| 448 | 2026-10-23 | 23:15 | Atletico Grau – Asociacion Deportiva Tarma | Atletico Grau (HOME) | 1.78 | 1-1 | VAR | `a7f9cded-9f70-42b8-9502-364cfc25d981` |
| 449 | 2026-10-24 | 16:00 | B93 Copenhagen – Brabrand | B93 Copenhagen (HOME) | 1.80 | 2-3 | VAR | `5b7192b4-d8fb-4a16-a31b-faa1425522cc` |
| 450 | 2026-10-24 | 16:00 | Como – Sassuolo | Como (HOME) | 1.52 | 2-0 | YOK | `436d2ff9-7d7a-42e4-b40e-4cd32dd10802` |
| 451 | 2026-10-24 | 16:00 | Modena – Cesena | Modena (HOME) | 1.61 | 3-0 | YOK | `6e856947-f01d-42f3-8a58-8dfca72d7021` |
| 452 | 2026-10-24 | 16:00 | Sirius – AIK | Sirius (HOME) | 1.61 | 1-2 | VAR | `f3267dd8-601e-44a8-b6c1-98fcbcfb2fa0` |
| 453 | 2026-10-24 | 16:00 | US Cremonese – Juve Stabia | US Cremonese (HOME) | 2.00 | 0-1 | YOK | `eaf29729-fb32-41a1-bd3c-1de63319d6df` |
| 454 | 2026-10-24 | 16:30 | Augsburg – Union Berlin | Augsburg (HOME) | 1.85 | 1-1 | VAR | `7e549491-e026-437c-8772-0fdb74430ad7` |
| 455 | 2026-10-24 | 16:30 | Lokomotiv Sofia – Botev Vratsa | Lokomotiv Sofia (HOME) | 1.98 | 1-1 | VAR | `25f7895e-1123-4994-a519-841ef011acc4` |
| 456 | 2026-10-24 | 16:30 | Mainz – Werder Bremen | Mainz (HOME) | 1.79 | 2-3 | VAR | `30cfa426-6ff4-4738-82e8-369541581912` |
| 457 | 2026-10-24 | 17:00 | AFC Wimbledon – Wycombe | Wycombe (AWAY) | 1.90 | 1-1 | VAR | `1e89cd99-2a76-429a-8d90-593af7680807` |
| 458 | 2026-10-24 | 17:00 | Antwerp – Charleroi | Charleroi (AWAY) | 1.85 | 3-0 | YOK | `0598b4af-4d8e-4575-b9a7-07e95d2414d2` |
| 459 | 2026-10-24 | 17:00 | Barnet – Oldham | Barnet (HOME) | 1.75 | 1-1 | VAR | `77da3111-a3d4-4825-abe1-7a01d0e316e4` |
| 460 | 2026-10-24 | 17:00 | Barrow – Forest Green | Barrow (HOME) | 1.99 | 1-0 | YOK | `7c694190-873a-4d0e-9303-84f5f3158d71` |
| 461 | 2026-10-24 | 17:00 | Chesterfield – Crewe | Chesterfield (HOME) | 1.72 | 5-1 | VAR | `a5305010-103f-419c-92fb-f0862c2dce60` |
| 462 | 2026-10-24 | 17:00 | Cove Rangers – East Kilbride | East Kilbride (AWAY) | 1.97 | 0-1 | YOK | `d290a5e7-9e91-4da3-ae77-f3d8fed006f4` |
| 463 | 2026-10-24 | 17:00 | Falkirk – Kilmarnock | Falkirk (HOME) | 1.96 | 3-0 | YOK | `c66f0bbe-9a79-47bf-99c5-19bdf6f4cd13` |
| 464 | 2026-10-24 | 17:00 | Gnistan – AC Oulu | Gnistan (HOME) | 1.94 | 3-4 | VAR | `f31aedc5-fbcb-40f0-9806-1f76939a6ad6` |
| 465 | 2026-10-24 | 17:00 | Harborough Town – Worksop Town | Harborough Town (HOME) | 1.93 | 1-1 | VAR | `d0523aa5-4cb0-45b7-aa96-bd75e6220e5d` |
| 466 | 2026-10-24 | 17:00 | Horsham FC – Walton & Hersham | Horsham FC (HOME) | 1.60 | 1-0 | YOK | `815f5047-f4a3-41cb-a388-2292998508dc` |
| 467 | 2026-10-24 | 17:00 | IA Akranes – Keflavik | IA Akranes (HOME) | 1.63 | 4-4 | VAR | `cfcf1101-f4b2-4c75-bd64-cbadc231ed6c` |
| 468 | 2026-10-24 | 17:00 | KA Akureyri – IBV | KA Akureyri (HOME) | 1.72 | 5-1 | VAR | `9ca081d4-ed3f-41b9-8f4e-6a33f4e94e4c` |
| 469 | 2026-10-24 | 17:00 | Kings Lynn – Southport | Kings Lynn (HOME) | 1.67 | 0-0 | YOK | `6547fd02-e8a6-413d-8d42-57324343869d` |
| 470 | 2026-10-24 | 17:00 | Macclesfield – Hereford FC | Macclesfield (HOME) | 1.82 | 1-2 | VAR | `a8d20622-bf33-41e2-9cd1-bc14455b99fb` |
| 471 | 2026-10-24 | 17:00 | NEOM Sports Club – Abha | NEOM Sports Club (HOME) | 1.56 | 2-0 | YOK | `2855a92d-92ea-43da-b7b2-70ec6b93b87d` |
| 472 | 2026-10-24 | 17:00 | Notts Co – Stockport | Stockport (AWAY) | 1.68 | 1-1 | VAR | `2ad5f9fe-858d-4c16-99fc-edccff9f49b5` |
| 473 | 2026-10-24 | 17:00 | Partick – Stenhousemuir | Partick (HOME) | 1.51 | 3-0 | YOK | `5ed05b94-c761-4975-96af-31e4cbda8a49` |
| 474 | 2026-10-24 | 17:00 | Partizan Belgrade – Cukaricki | Partizan Belgrade (HOME) | 1.69 | 0-2 | YOK | `8072f97d-fd6b-4e7b-8b14-0c6b518dc2c3` |
| 475 | 2026-10-24 | 17:00 | Queens Park – Dunfermline | Dunfermline (AWAY) | 1.62 | 0-1 | YOK | `44802728-ffb0-4931-a486-4da352b99141` |
| 476 | 2026-10-24 | 17:00 | Reading – Barnsley | Reading (HOME) | 1.64 | 2-1 | VAR | `c31e7c0f-d17c-4c5b-81fe-79f6357bd9ae` |
| 477 | 2026-10-24 | 17:00 | Slough Town – Dorking Wanderers | Dorking Wanderers (AWAY) | 1.82 | 1-3 | VAR | `8a800dcf-40eb-40af-9f6e-92ae0502a5e3` |
| 478 | 2026-10-24 | 17:00 | Solihull Moors – Carlisle | Carlisle (AWAY) | 1.62 | 1-2 | VAR | `43a515ea-3b92-4e01-a02d-4f8995a4c032` |
| 479 | 2026-10-24 | 17:00 | Southend – FC Halifax Town | Southend (HOME) | 1.72 | 2-2 | VAR | `d005a2b6-13c2-4dab-a416-756061405afb` |
| 480 | 2026-10-24 | 17:00 | Stjarnan – Valur | Stjarnan (HOME) | 1.98 | 6-0 | YOK | `775b7022-e35c-447e-b5b8-eb14b60f5743` |
| 481 | 2026-10-24 | 17:00 | West Ham – Southampton | West Ham (HOME) | 1.72 | 2-3 | VAR | `03137d05-c74b-4b3a-aa59-84c1b2aff8dc` |
| 482 | 2026-10-24 | 17:30 | Club Football Estrela – Casa Pia | Club Football Estrela (HOME) | 1.80 | 0-2 | YOK | `5a5d2ce2-1aee-43c3-8eef-faa7fd4f671d` |
| 483 | 2026-10-24 | 17:30 | FC Utrecht – PEC Zwolle | FC Utrecht (HOME) | 1.71 | 1-1 | VAR | `b71b32da-f9e9-40c4-adb3-bca932d0cb5b` |
| 484 | 2026-10-24 | 18:00 | Hartberg – RZ Pellets WAC | Hartberg (HOME) | 1.97 | 1-0 | YOK | `bbceb51b-4676-40d6-b383-4073be35e667` |
| 485 | 2026-10-24 | 18:00 | Neftchi Baku – PFK Turan Tovuz | Neftchi Baku (HOME) | 1.75 | 1-1 | VAR | `a215d3dd-588c-4392-9dc1-67a5c33a67c7` |
| 486 | 2026-10-24 | 18:30 | Kalmar FF – Brommapojkarna | Kalmar FF (HOME) | 1.84 | 0-3 | YOK | `6b3168f1-894a-48ec-8683-48aba454ac1c` |
| 487 | 2026-10-24 | 18:30 | Pogon Szczecin – Radomiak Radom | Pogon Szczecin (HOME) | 1.74 | 4-3 | VAR | `2b5d775f-237d-4d4e-9922-316980d38f1a` |
| 488 | 2026-10-24 | 18:30 | Sur Club – Oman FC | Oman FC (AWAY) | 1.63 | 2-1 | VAR | `c5736274-f78b-48ec-b00f-76f088b055ff` |
| 489 | 2026-10-24 | 19:00 | Aarau – Etoile Carouge | Aarau (HOME) | 1.80 | 1-2 | VAR | `31cf38d8-1039-4131-adc5-ab7da4d3cd3f` |
| 490 | 2026-10-24 | 19:00 | Ham-Kam – Rosenborg | Rosenborg (AWAY) | 1.59 | 0-3 | YOK | `58b69480-2df4-47d0-aea1-8f8ff1495a40` |
| 491 | 2026-10-24 | 19:00 | Ironi Tiberias – Maccabi Netanya | Maccabi Netanya (AWAY) | 1.65 | 1-1 | VAR | `fd854432-a2dc-4d7e-a98f-6ba5b31d5d1d` |
| 492 | 2026-10-24 | 19:00 | Malkiya – Al Ahli (BRN) | Al Ahli (BRN) (AWAY) | 1.99 | 1-1 | VAR | `a06a19fd-1275-44df-8883-631bfb85a4d9` |
| 493 | 2026-10-24 | 19:00 | MFK Skalica – Spartak Trnava | Spartak Trnava (AWAY) | 1.83 | 1-1 | VAR | `1ef688be-5f70-473f-a38d-b924311b67a4` |
| 494 | 2026-10-24 | 19:00 | Mladost Lucani – Vojvodina | Vojvodina (AWAY) | 1.61 | 1-1 | VAR | `cea7d903-7da0-488b-b3a4-af45d93675d0` |
| 495 | 2026-10-24 | 19:00 | Varazdin – Slaven Belupo | Varazdin (HOME) | 1.73 | 1-2 | VAR | `eb941907-6190-457b-aee7-ca6386d7fa0d` |
| 496 | 2026-10-24 | 19:15 | Oud-Heverlee Leuven – Lommel | Oud-Heverlee Leuven (HOME) | 1.96 | 2-2 | VAR | `99c046a7-a660-43a0-9002-4908115cf568` |
| 497 | 2026-10-24 | 19:15 | Vikingur Reykjavik – Fram | Vikingur Reykjavik (HOME) | 1.64 | 2-2 | VAR | `ef61bf1b-ca94-4e92-b4e9-387a9f8a077b` |
| 498 | 2026-10-24 | 19:30 | Dortmund – Eintracht Frankfurt | Dortmund (HOME) | 1.53 | 1-0 | YOK | `cbd4f88e-a4a2-41c4-864b-b38866b83eea` |
| 499 | 2026-10-24 | 19:30 | Shabab Al Ordon – Al Wehdat | Al Wehdat (AWAY) | 1.67 | 0-1 | YOK | `7260e619-15dc-4159-b044-83c2a98fd221` |
| 500 | 2026-10-24 | 19:30 | Vejle – Aarhus Fremad | Vejle (HOME) | 1.54 | 0-0 | YOK | `c91a6be2-c275-44c6-b64a-7c7a0c09702f` |
| 501 | 2026-10-24 | 20:30 | CF Montreal – Nashville SC | Nashville SC (AWAY) | 1.57 | 0-2 | YOK | `b2009340-150e-4d99-bd9f-ecaa361ee6ae` |
| 502 | 2026-10-24 | 20:30 | Zalaegerszeg – Kisvarda | Zalaegerszeg (HOME) | 1.83 | 1-1 | VAR | `3e2347dd-7162-4b2b-b21c-97f28467eeb4` |
| 503 | 2026-10-24 | 20:46 | Sarajevo – Zeljeznicar | Sarajevo (HOME) | 1.57 | 2-0 | YOK | `6da1f96a-443e-4bde-9e44-d3de5021cbea` |
| 504 | 2026-10-24 | 21:00 | Arsenal de Sarandi – Camioneros | Arsenal de Sarandi (HOME) | 1.62 | 2-1 | VAR | `7ad6d973-dc40-41b0-b071-6a216ad0211c` |
| 505 | 2026-10-24 | 21:15 | Wisla Krakow – Rakow Czestochowa | Wisla Krakow (HOME) | 1.85 | 2-1 | VAR | `cda13520-8eeb-4819-842b-53b3f3b38916` |
| 506 | 2026-10-24 | 21:30 | Almagro BA – Tristan Suarez | Tristan Suarez (AWAY) | 1.80 | 1-1 | VAR | `c741c8f9-ca77-4fcd-8eb3-1070b4b4d022` |
| 507 | 2026-10-24 | 21:30 | Young Boys – St Gallen | Young Boys (HOME) | 1.83 | 2-0 | YOK | `45e48c74-ca1e-4458-b0d7-a764376e577d` |
| 508 | 2026-10-24 | 21:45 | Lazio – Parma | Lazio (HOME) | 1.52 | 2-1 | VAR | `a8a97e19-f84c-457f-9c6b-0dbf1f90a070` |
| 509 | 2026-10-24 | 21:45 | St Etienne – Nantes | St Etienne (HOME) | 1.78 | 1-0 | YOK | `6a9da5d7-17b8-487f-9ca7-4e12e3744722` |
| 510 | 2026-10-24 | 21:45 | Westerlo – Waasland-Beveren | Westerlo (HOME) | 1.93 | 4-4 | VAR | `a3465615-3daa-49e5-a5de-9ceccaac6162` |
| 511 | 2026-10-24 | 22:00 | Almeria – Oviedo | Almeria (HOME) | 1.76 | 2-2 | VAR | `5b0908f9-7814-4485-ad57-a7f775319dfc` |
| 512 | 2026-10-24 | 22:00 | Ferro Carril Oeste – Chaco For Ever | Ferro Carril Oeste (HOME) | 1.51 | 0-3 | YOK | `9a0c5416-d778-4366-849a-938cca7dbb08` |
| 513 | 2026-10-24 | 22:30 | Columbus – Toronto FC | Columbus (HOME) | 1.73 | 4-2 | VAR | `ea0ca258-7a9c-43e4-995e-09218a7086fb` |
| 514 | 2026-10-24 | 23:00 | CD Gualberto Villarroel – Blooming Santa Cruz | CD Gualberto Villarroel (HOME) | 1.77 | 2-1 | VAR | `9fda742f-d933-45b3-ac0e-bffc92bf7e09` |
| 515 | 2026-10-24 | 23:30 | Barranquilla – Real Cartagena | Real Cartagena (AWAY) | 1.55 | 1-1 | VAR | `f70e9a7e-88d7-4355-9c56-f8561d363b17` |
| 516 | 2026-10-24 | 23:30 | Quindio – Tigres FC Zipaquira | Quindio (HOME) | 1.64 | 2-0 | YOK | `aa309f67-2516-42d6-8838-9e98d589b6c6` |
| 517 | 2026-10-25 | 16:00 | Anagennisi Karditsas – PAOK B | Anagennisi Karditsas (HOME) | 1.91 | 1-0 | YOK | `f8922a2a-61f0-49d6-a6bd-087efd0d6318` |
| 518 | 2026-10-25 | 16:00 | Athletic Bilbao – Getafe | Athletic Bilbao (HOME) | 1.59 | 4-0 | YOK | `ac74ce9c-8716-4c86-97aa-ac7408cb26ba` |
| 519 | 2026-10-25 | 16:00 | HJK Helsinki – KuPS | HJK Helsinki (HOME) | 1.73 | 2-2 | VAR | `0bd09627-8f80-4fe6-88ea-f49d19afeea6` |
| 520 | 2026-10-25 | 16:00 | Konyaspor – Genclerbirligi | Konyaspor (HOME) | 1.98 | 2-0 | YOK | `caa01367-7bdc-4d64-a873-1ff4921c10dd` |
| 521 | 2026-10-25 | 16:00 | Panthrakikos – Asteras Tripolis II | Panthrakikos (HOME) | 1.96 | 2-2 | VAR | `08df742e-83e2-4e08-af8e-485473e35c4a` |
| 522 | 2026-10-25 | 16:00 | Sabadell – Tenerife | Sabadell (HOME) | 2.00 | 1-1 | VAR | `26417099-b883-4f10-99c5-4fa3a0304fd5` |
| 523 | 2026-10-25 | 16:00 | Silkeborg – FC Nordsjaelland | FC Nordsjaelland (AWAY) | 1.65 | 1-1 | VAR | `5a525244-65a3-4d14-ba5a-11f87a25a7ae` |
| 524 | 2026-10-25 | 16:00 | Thun – Lugano | Lugano (AWAY) | 1.89 | 2-3 | VAR | `f86d4dcb-d4fa-40ce-afef-310fca254909` |
| 525 | 2026-10-25 | 16:30 | Ruch Chorzow – Pogon Grodzisk Mazowiecki | Ruch Chorzow (HOME) | 1.66 | 2-0 | YOK | `4154c1ab-1e79-4f30-8a00-ddc32d33f8e2` |
| 526 | 2026-10-25 | 16:30 | Sturm Graz – SV Ried | Sturm Graz (HOME) | 1.70 | 2-2 | VAR | `2b3a864f-b6df-4a15-a2ac-a0ea1a09d3fd` |
| 527 | 2026-10-25 | 16:30 | Viking – Tromso | Viking (HOME) | 1.60 | 3-1 | VAR | `966a519f-9ce9-4095-824a-6285a5279a72` |
| 528 | 2026-10-25 | 17:00 | Atalanta – Frosinone | Atalanta (HOME) | 1.95 | 4-4 | VAR | `5f452688-9694-4a49-b87a-b47e8941f058` |
| 529 | 2026-10-25 | 17:00 | FC Astana – FK Kaisar | FC Astana (HOME) | 1.51 | 0-0 | YOK | `20e24919-c073-4833-a5e9-acd48779f4fe` |
| 530 | 2026-10-25 | 17:00 | Hull – Brentford | Brentford (AWAY) | 1.70 | 1-1 | VAR | `2f195c3b-0d8a-44ff-86a0-d99236e76a81` |
| 531 | 2026-10-25 | 17:00 | Liverpool (W) – London City Lionesses | London City Lionesses (AWAY) | 1.83 | 2-2 | VAR | `2b5eed9b-2906-4cb2-a758-25d807112e2d` |
| 532 | 2026-10-25 | 17:30 | KFC Komarno – Trencin | KFC Komarno (HOME) | 1.91 | 0-0 | YOK | `f5dabc03-ecc4-4e2f-a909-2091faf0b683` |
| 533 | 2026-10-25 | 18:30 | Estoril Praia – Moreirense | Estoril Praia (HOME) | 1.82 | 1-3 | VAR | `fea0df8e-ff88-4e18-bb17-0c92d8000394` |
| 534 | 2026-10-25 | 18:30 | FC Basel – Grasshoppers Zurich | FC Basel (HOME) | 1.79 | 0-0 | YOK | `2f9e2b8e-ac4d-4719-b473-22e0277f52b5` |
| 535 | 2026-10-25 | 18:30 | Porto B – Leiria | Leiria (AWAY) | 1.99 | 1-1 | VAR | `c00d62ca-8d10-4f92-bba8-aa246e7875dc` |
| 536 | 2026-10-25 | 18:30 | Sion – Lausanne | Sion (HOME) | 1.54 | 1-0 | YOK | `baab3abc-13ff-4645-a4fb-44ca39408907` |
| 537 | 2026-10-25 | 18:30 | Yverdon Sport – Kriens | Yverdon Sport (HOME) | 1.53 | 5-2 | VAR | `7dac1b87-f82d-4686-a932-260f823baf2a` |
| 538 | 2026-10-25 | 19:00 | Moss – Asane | Moss (HOME) | 1.61 | 1-3 | VAR | `a8ae5974-b450-4d2c-bc2c-3955acbc74ee` |
| 539 | 2026-10-25 | 19:00 | Sarpsborg – Aalesunds | Sarpsborg (HOME) | 1.94 | 2-1 | VAR | `0658fb2d-6a27-4484-83f5-b8d614feeb16` |
| 540 | 2026-10-25 | 19:00 | Sogndal – Kongsvinger | Kongsvinger (AWAY) | 1.63 | 3-1 | VAR | `b3479d41-431c-4cfe-985a-1f467c89e3c4` |
| 541 | 2026-10-25 | 19:15 | Marseille – Le Havre | Marseille (HOME) | 1.52 | 4-3 | VAR | `90426ac1-fd7b-406a-9a53-fc741102526a` |
| 542 | 2026-10-25 | 19:15 | Rennes – Strasbourg | Rennes (HOME) | 1.83 | 3-0 | YOK | `80e73c43-cc66-4a24-b204-ff348bfd30de` |
| 543 | 2026-10-25 | 19:15 | Toulouse – ESTAC Troyes | Toulouse (HOME) | 1.57 | 0-0 | YOK | `35d3546f-1859-48b7-8773-70c99b85522b` |
| 544 | 2026-10-25 | 19:30 | Freiburg – Bayern Munich | Bayern Munich (AWAY) | 1.54 | 1-3 | VAR | `574c40dd-91ca-4fbf-ad96-508f73dff927` |
| 545 | 2026-10-25 | 19:30 | Lecco – Caratese | Lecco (HOME) | 1.94 | 2-2 | VAR | `4fb3d4af-4bd0-4d60-a835-72edb9819070` |
| 546 | 2026-10-25 | 20:00 | CFR Cluj – Dinamo Bucharest | Dinamo Bucharest (AWAY) | 1.92 | 2-2 | VAR | `36e915a1-db42-4126-bc7e-9e64190b3fff` |
| 547 | 2026-10-25 | 20:00 | Lecce – Juventus | Juventus (AWAY) | 1.57 | 0-2 | YOK | `c5d5a3c5-9eb1-4781-95a7-fd52c51f3308` |
| 548 | 2026-10-25 | 20:00 | Plzen – Pardubice | Plzen (HOME) | 1.67 | 1-2 | VAR | `661dc420-a351-4155-b846-a347dc0fa73f` |
| 549 | 2026-10-25 | 20:30 | Aris – Atromitos | Aris (HOME) | 1.70 | 3-1 | VAR | `8449e4ca-cf23-4df2-9e57-8fa62e87dc8f` |
| 550 | 2026-10-25 | 20:30 | CD Castellon – Sporting Gijon | CD Castellon (HOME) | 1.55 | 4-0 | YOK | `58151f71-3e0f-4302-97a2-aa7ef773fa75` |
| 551 | 2026-10-25 | 20:30 | Real Sociedad – Levante | Real Sociedad (HOME) | 1.62 | 2-1 | VAR | `513e3a4e-de18-41f0-82b2-9f08d5cf3958` |
| 552 | 2026-10-25 | 21:00 | CD Nacional Funchal – Braga | Braga (AWAY) | 1.52 | 1-0 | YOK | `2f2ed805-0a31-4fb1-a617-87e9f2eeaa47` |
| 553 | 2026-10-25 | 21:00 | Man Utd (W) – Man City (W) | Man City (W) (AWAY) | 1.59 | 1-1 | VAR | `a2fd4698-58de-49a9-9620-c1475b397a71` |
| 554 | 2026-10-25 | 21:00 | OFI – PAOK | PAOK (AWAY) | 1.79 | 2-1 | VAR | `86968eda-1981-46cc-b190-07beddc64c1e` |
| 555 | 2026-10-25 | 21:15 | Cesar Vallejo Moquegua – Alianza Lima | Alianza Lima (AWAY) | 1.59 | 0-1 | YOK | `02426d1c-dae5-4d83-b1a8-bc105fd43484` |
| 556 | 2026-10-25 | 21:30 | Estudiantes de Caseros – Los Andes | Estudiantes de Caseros (HOME) | 1.78 | 1-1 | VAR | `d5da7765-4bfa-48f6-9b69-fd44177c480f` |
| 557 | 2026-10-25 | 22:00 | Emelec – Guayaquil City | Emelec (HOME) | 1.94 | 0-1 | YOK | `1525553b-3b80-4f22-9361-81181d11568a` |
| 558 | 2026-10-25 | 22:00 | Patronato – Agropecuario | Patronato (HOME) | 1.88 | 0-2 | YOK | `c5f26b40-6d7e-4c7a-86d8-bfddca49e9a1` |
| 559 | 2026-10-25 | 22:45 | Udinese – AC Milan | AC Milan (AWAY) | 1.89 | 0-2 | YOK | `a03a6983-7e1f-444f-87c8-26a85681ab2d` |
| 560 | 2026-10-25 | 23:00 | Barcelona – Real Madrid | Barcelona (HOME) | 1.63 | 1-2 | VAR | `cd60b109-58be-417c-b970-4f5c8de22c76` |
| 561 | 2026-10-25 | 23:00 | Cavalry – Vancouver FC | Cavalry (HOME) | 1.74 | 1-0 | YOK | `896731ac-00c3-4583-890a-85f38948abe4` |
| 562 | 2026-10-25 | 23:00 | Club Atletico Mitre – Godoy Cruz | Godoy Cruz (AWAY) | 1.91 | 0-3 | YOK | `f2338968-eab3-4c97-b8f7-a452fc47a465` |
| 563 | 2026-10-25 | 23:00 | FC Midland – Club Gimnasia y Tiro | FC Midland (HOME) | 1.80 | 3-0 | YOK | `0ce321fe-e62a-4896-b2e6-f52728493944` |
| 564 | 2026-10-25 | 23:00 | HFX Wanderers – FC Supra du Quebec | FC Supra du Quebec (AWAY) | 1.89 | 3-4 | VAR | `d4ab892b-6e0e-493f-a25b-15f77717e87b` |
| 565 | 2026-10-25 | 23:00 | Portmore Utd – Chapelton | Portmore Utd (HOME) | 1.63 | 0-0 | YOK | `f98bb22f-72e4-43c2-aeba-284044537377` |
| 566 | 2026-10-25 | 23:00 | Treasure Beach FC – Tru-Juice FC | Tru-Juice FC (AWAY) | 1.88 | 0-5 | YOK | `4c74abef-fa51-4cc3-ba6d-ef78e3f864de` |
| 567 | 2026-10-25 | 23:30 | Palestino – Colo Colo | Colo Colo (AWAY) | 1.90 | 1-1 | VAR | `b74e8ac8-dbe3-4fe6-8395-261a1edd08fb` |
| 568 | 2026-10-25 | 23:30 | Sport Boys (Per) – FC Cajamarca | Sport Boys (Per) (HOME) | 1.71 | 4-2 | VAR | `3c4683f3-d337-4b22-96dc-58d7b91ef482` |

**Kaynak:** SXF `research_archive.fixtures`, `public.moneyway_snapshots`, `research_archive.results`, Supabase SQL READ ONLY; ilk band doğrulama [1.01–1.50 audit](SXF_FAVORI_1X2_1_01_1_50_KG_VAR_09_25_Ekim_2026_AUDIT_v1.md).

**Sonraki karşılaştırma:** `2.00 < odds <= 2.50` bandı aynı non-overlap kuralla ayrıca araştırılmadı; gelecekteki sonuçlar hakkında çıkarım yapılmaz.
