# SXF 1X2 favori oranı 1.01–1.50 olan maçlarda KG VAR — 9–25 Ekim 2026

**Araştırma tarihi:** 2026-10-27. **Yalnız SmartXFlow (SXF) para/oran verisi ve arşivdeki maç sonu skorları kullanılmıştır.** Bu bir sinyal motoru eğitimi, geriye dönük uyarlama veya gelecek tahmin garantisi değildir.

## Tanım / kapsam
- `research_archive.fixtures`, **9–25 Ekim 2026**, İstanbul zamanıyla (TRT, UTC+3) **16:00 ≤ kickoff < 24:00**; toplam **2703** benzersiz maç.
- Her maç `kickoff_utc - interval '6 hours'` T-6 karar anında `public.moneyway_snapshots` son **o anda veya öncesinde** bulunan 1X2 snapshotı. Tam `1/X/2` aynı an, fiyatların hepsi decimal >1, kayıt maksimum 10 dakika eski. 2703 içinden **1657** maç uygun 1X2 kalite sınırını sağladı. Diğer **1046** eksik/eski/uyumsuz snapshot nedeniyle oranlı araştırmadan çıkarıldı; bu bir sonuç tahmini değildir.
- Favori **ev sahibi veya deplasmandan** oranı daha düşük olan taraf; tercih edilen takımın SXF oranı **1,01–1,50 dahil**, beraberlik X oranından da küçük, HOME/AWAY arasında eşit minimum yok.
- Tam verili oran grubunda **287** maç; `research_archive.results` içinde tam `match_id_hash`, aynı home+away isimleri, FT ve tekil 0-9 skor biçimi ile **286** maç geçerli sonuca sahip. 1 maç (**Cavalry – Pacific**) skor eşleşmesi eksik olduğundan payda dışındadır. T-6 sonrası oranlar ve para karar değişkeni olarak kullanılmadı.
- KG VAR = FT skorunda ev sahibi ≥1 ve deplasman ≥1. Oranlar BTTS YES oranları değil, yalnız **1X2 takım favori oranlarıdır**.
- Taramaya tüm dahil ligler (kadın, alt lig ve diğerleri) girer; yalnız lig/ülke bazlı daraltma yok.

## ANA CEVAP
**286 doğrulanmış maçtan 150 KG VAR, 136 KG YOK ⇒ 52.45% KG VAR.** 17 gün toplamı üzerinden günde 16.82 bu fiyat bandı favorili maç, aktif oran verili gün sayısı 16. Bu oran seçilen geçmiş örneklemdeki gerçekleşme sıklığıdır, “KG VAR'a bahis yapılır” sinyali değildir.

## Günlük maç / KG
| Tarih (2026) | Maç | KG VAR | KG YOK | KG VAR |
|---|---:|---:|---:|---:|
| 09 Ekim | 24 | 7 | 17 | 29.17% |
| 10 Ekim | 31 | 18 | 13 | 58.06% |
| 11 Ekim | 12 | 6 | 6 | 50.00% |
| 12 Ekim | 0 | 0 | 0 | — |
| 13 Ekim | 4 | 3 | 1 | 75.00% |
| 14 Ekim | 11 | 6 | 5 | 54.55% |
| 15 Ekim | 20 | 13 | 7 | 65.00% |
| 16 Ekim | 12 | 6 | 6 | 50.00% |
| 17 Ekim | 28 | 15 | 13 | 53.57% |
| 18 Ekim | 28 | 16 | 12 | 57.14% |
| 19 Ekim | 10 | 4 | 6 | 40.00% |
| 20 Ekim | 12 | 8 | 4 | 66.67% |
| 21 Ekim | 15 | 8 | 7 | 53.33% |
| 22 Ekim | 11 | 5 | 6 | 45.45% |
| 23 Ekim | 19 | 11 | 8 | 57.89% |
| 24 Ekim | 28 | 11 | 17 | 39.29% |
| 25 Ekim | 21 | 13 | 8 | 61.90% |
| TOPLAM | 286 | 150 | 136 | 52.45% |

### Kendi içinde odds şeritleri (tanımlayıcı, ek filtre yapılmaz)
| Favori 1X2 SXF oranı | Maç | KG VAR | KG YOK | KG VAR |
|---|---:|---:|---:|---:|
| 1.01–1.20 | 48 | 17 | 31 | 35.42% |
| 1.21–1.30 | 65 | 40 | 25 | 61.54% |
| 1.31–1.40 | 80 | 49 | 31 | 61.25% |
| 1.41–1.50 | 93 | 44 | 49 | 47.31% |
| TOPLAM | 286 | 150 | 136 | 52.45% |

### Favori ev/deplasman
| Favori yer | Maç | KG VAR | KG YOK | KG VAR |
|---|---:|---:|---:|---:|
| HOME | 199 | 110 | 89 | 55.28% |
| AWAY | 87 | 40 | 47 | 45.98% |

### Kapsam notları
- **12 Ekim 2026:** 109 maç olmasına rağmen SXF arşivinde hiçbir maçın T-6 zamanına ±10 dakika yakın tam 1X2 verisi yok; o gün tabloda 0 görünmesi “favori yoktu” anlamına gelmez. Günün 42 maçında bulunan son öncesi snapshot **en az 422 dakika eski**ydi.
- 13 Ekim yalnız **11** fiyatı doğrulanmış genel maç bulundu; oradaki 4 favori sonucu küçük örnek.
- Araştırmaya kadın maçları dahil. Takım/lig adında açık kadın göstergesi olan 8 maçın KG VAR sonucu **1/8 = 12.50%**; kalan 278 diğer maçlarda **149/278 = 53.60%**. Bu otomatik metin sınıflandırması kesin kadın/erkek lig tespiti değildir; yalnız bileşim duyarlılık göstergesidir.
- Başlıca KG YOK FT örnek skorları: 1-0=21, 2-0=20, 3-0=19, 0-1=18, 4-0=14, 0-2=13, 0-0=9, 0-3=7, 0-4=5, 5-0=5, 7-0=2, 0-8=1.
- Günler arası verinin farklı tamamlıkta olması, lig/maç dağılımı ve oran örneklemi gelecekteki oranları değiştirebilir. 1X2 favori oranı ile karşı tarafın gol atmaması güçlü biçimde ilişkili olabilir, ancak nedensellik ve bahis değeri kanıtı değildir.

## Tekil 286 maç (tam denetim)
| # | Tarih | TSİ | Maç | Favori (1X2) | SXF favori oranı (T-6) | FT | KG |
|---|---|---|---|---|---:|---|---|
| 1 | 09 Ekim | 16:30 | FK Kokand 1912 – Mash al Mubarek | FK Kokand 1912 (HOME) | 1.37 | 3-0 | YOK | `277c4db1-b1e6-4c41-ab91-750066e9c2ef` |
| 2 | 09 Ekim | 17:00 | USM Blida – ESM Kolea | USM Blida (HOME) | 1.45 | 1-0 | YOK | `bc4d92cc-dc53-49fc-b144-b0cdfe27500e` |
| 3 | 09 Ekim | 17:50 | Al Nasar (KUW) – Kuwait SC | Kuwait SC (AWAY) | 1.46 | 1-7 | VAR | `cca9be65-f5f6-49ac-a59e-cd9ff65aaf44` |
| 4 | 09 Ekim | 17:55 | Al-Fateh (KSA) – Al Ahli | Al Ahli (AWAY) | 1.48 | 0-4 | YOK | `5dc7a408-09cc-49e1-b787-f7c739fb569c` |
| 5 | 09 Ekim | 18:00 | Kazakhstan (W) – Rep of Ireland (W) | Rep of Ireland (W) (AWAY) | 1.15 | 0-8 | YOK | `ab15a58c-6ae1-463c-81bc-720ad24e522a` |
| 6 | 09 Ekim | 19:00 | Albania (W) – Wales (W) | Wales (W) (AWAY) | 1.18 | 0-1 | YOK | `85d4bf65-f052-4e49-aa38-ad8915390d8c` |
| 7 | 09 Ekim | 19:00 | Karmiotissa Polemidion – Omonia | Omonia (AWAY) | 1.23 | 0-3 | YOK | `87428f56-c383-4271-9df6-524e629d6c02` |
| 8 | 09 Ekim | 19:00 | Kosovo (W) – Austria (W) | Austria (W) (AWAY) | 1.17 | 1-2 | VAR | `7e942086-01df-4f68-8ffc-efc10510a447` |
| 9 | 09 Ekim | 19:00 | Malkiya – Al Riffa | Al Riffa (AWAY) | 1.34 | 1-1 | VAR | `807d0e1b-2890-4d55-b54a-89e3d20d075b` |
| 10 | 09 Ekim | 19:00 | Zlin – Slavia Prague | Slavia Prague (AWAY) | 1.29 | 0-1 | YOK | `d5787040-db79-42aa-88b0-5eaadea2052f` |
| 11 | 09 Ekim | 19:15 | Belarus (W) – Italy (W) | Italy (W) (AWAY) | 1.09 | 0-2 | YOK | `4436b8e9-e1a5-4562-a434-be67d4684d6a` |
| 12 | 09 Ekim | 19:45 | Croatia (W) – Iceland (W) | Iceland (W) (AWAY) | 1.20 | 0-4 | YOK | `9f152de4-5de4-4620-bba9-415ac8ccb3ae` |
| 13 | 09 Ekim | 20:00 | Galatasaray – Kasimpasa | Galatasaray (HOME) | 1.29 | 3-1 | VAR | `a3078e67-6fdf-44d6-b1ad-98b2a1c84f7a` |
| 14 | 09 Ekim | 21:00 | Al Nassr – Al Draih | Al Nassr (HOME) | 1.40 | 3-0 | YOK | `78a11969-d4f7-44df-87b9-bacdeb2a9d71` |
| 15 | 09 Ekim | 21:00 | Almere City – FC Eindhoven | Almere City (HOME) | 1.44 | 3-0 | YOK | `4e0cbe3f-2b5e-4881-a1e4-67e00bebe472` |
| 16 | 09 Ekim | 21:00 | FCV Dender – Club Brugge B | FCV Dender (HOME) | 1.49 | 3-0 | YOK | `ddb82f9b-2846-4609-a138-7f5097b67ef2` |
| 17 | 09 Ekim | 21:00 | NAC Breda – MVV Maastricht | NAC Breda (HOME) | 1.38 | 1-0 | YOK | `59eebf96-85e7-4e75-b566-e827f3c07566` |
| 18 | 09 Ekim | 21:00 | Northern Ireland (W) – Portugal (W) | Portugal (W) (AWAY) | 1.28 | 0-4 | YOK | `7eb7dc18-11a0-4587-9ecc-8b08c4b7bf6f` |
| 19 | 09 Ekim | 21:00 | PSV – Heerenveen | PSV (HOME) | 1.37 | 2-0 | YOK | `a0c3b18a-2932-4fbd-bc9b-b4fb5c73c377` |
| 20 | 09 Ekim | 21:00 | Wolves U21 – Fleetwood Town U21 | Wolves U21 (HOME) | 1.47 | 1-1 | VAR | `68dcb2a5-4066-4651-89a2-95c58085ad92` |
| 21 | 09 Ekim | 21:30 | Dortmund – Werder Bremen | Dortmund (HOME) | 1.39 | 2-2 | VAR | `e0a7aff4-1ce3-4404-a7dc-e8f9e57d0a6d` |
| 22 | 09 Ekim | 21:45 | Cork City – Finn Harps | Cork City (HOME) | 1.17 | 2-0 | YOK | `f684e255-ce09-4df0-8f83-33a2044cda84` |
| 23 | 09 Ekim | 21:45 | Shelbourne – Sligo Rovers | Shelbourne (HOME) | 1.29 | 5-1 | VAR | `2f322d41-ba84-4b67-b540-c42c20d73c87` |
| 24 | 09 Ekim | 23:00 | Real Soacha Cundinamarca FC – Real Santander | Real Soacha Cundinamarca FC (HOME) | 1.46 | 0-1 | YOK | `8b4cda3f-196e-4734-9c3d-4b2324967222` |
| 25 | 10 Ekim | 16:00 | RoPS – JJK | RoPS (HOME) | 1.37 | 6-1 | VAR | `7e35d80e-e2d0-43be-9cf1-0ca40a21e5a4` |
| 26 | 10 Ekim | 16:30 | Augsburg – Bayern Munich | Bayern Munich (AWAY) | 1.20 | 2-2 | VAR | `5cc1a6e0-d3ca-4e1a-a30b-b477d8a8822c` |
| 27 | 10 Ekim | 16:30 | Hoffenheim – Hamburger SV | Hoffenheim (HOME) | 1.45 | 2-3 | VAR | `d97818bd-9dd4-4de5-bdbd-35ad8764152a` |
| 28 | 10 Ekim | 16:30 | Sportive De Tunis – Olympique De Beja | Sportive De Tunis (HOME) | 1.17 | 3-1 | VAR | `345596fc-3366-43ff-91e0-8a8555b559c7` |
| 29 | 10 Ekim | 17:00 | Bodo Glimt – Kristiansund | Bodo Glimt (HOME) | 1.09 | 3-1 | VAR | `acbcd521-2f68-4890-8a0e-7d4be0f8aa7c` |
| 30 | 10 Ekim | 17:00 | FC Halifax Town – Gateshead | FC Halifax Town (HOME) | 1.43 | 4-1 | VAR | `ed3c294d-2bb1-4f27-89d4-8eaf66826771` |
| 31 | 10 Ekim | 17:00 | Hearts – St Mirren | Hearts (HOME) | 1.50 | 5-0 | YOK | `e919cc0f-f5b3-4596-82ad-a0e8faa0c9b5` |
| 32 | 10 Ekim | 17:00 | Rangers – Kilmarnock | Rangers (HOME) | 1.16 | 3-1 | VAR | `47ae7214-9908-468a-8060-eafe5a203df5` |
| 33 | 10 Ekim | 17:00 | Stockport – Barnsley | Stockport (HOME) | 1.46 | 3-1 | VAR | `28453895-9a26-4f62-b1e1-ea576549799b` |
| 34 | 10 Ekim | 17:00 | Torquay – Slough Town | Torquay (HOME) | 1.39 | 5-1 | VAR | `7a7c88a4-4689-4ed3-b07f-900ec078f565` |
| 35 | 10 Ekim | 17:50 | Al Tadhamon – Al-Qadsia | Al-Qadsia (AWAY) | 1.29 | 0-2 | YOK | `04521f0d-2c8c-4515-b1f5-c555fb577915` |
| 36 | 10 Ekim | 18:00 | Ferencvaros – Debreceni VSC | Ferencvaros (HOME) | 1.35 | 1-1 | VAR | `293c8192-bb13-4b31-bff7-5486375db318` |
| 37 | 10 Ekim | 18:15 | Lille – Le Havre | Lille (HOME) | 1.47 | 1-0 | YOK | `90cca26a-015f-4bed-b5c8-c341691d4fe0` |
| 38 | 10 Ekim | 19:00 | Inter – Parma | Inter (HOME) | 1.16 | 3-0 | YOK | `858b5d9a-943c-48cb-824e-7585890e53ef` |
| 39 | 10 Ekim | 19:00 | Ironi Tiberias – Hapoel Be'er Sheva | Hapoel Be'er Sheva (AWAY) | 1.39 | 0-2 | YOK | `96aeb864-1a7d-4473-b76c-dfc130f5d26c` |
| 40 | 10 Ekim | 19:00 | Kayserispor – Manisa FK | Kayserispor (HOME) | 1.43 | 3-2 | VAR | `11f0fdee-d83d-47de-bb69-9c42d4919f9a` |
| 41 | 10 Ekim | 19:00 | Rosenborg – Sandefjord | Rosenborg (HOME) | 1.39 | 1-1 | VAR | `9c0f8f0e-ff34-4c54-864b-16034128050c` |
| 42 | 10 Ekim | 19:15 | RAAL La Louviere – Club Brugge | Club Brugge (AWAY) | 1.41 | 1-4 | VAR | `a4adf020-4156-45fc-ac7d-2e024f3ca6b4` |
| 43 | 10 Ekim | 19:30 | AEK Athens – OFI | AEK Athens (HOME) | 1.31 | 3-0 | YOK | `138d929e-baa0-42af-ab63-a23f17091341` |
| 44 | 10 Ekim | 19:30 | Al Salt – Al Faisaly SC | Al Faisaly SC (AWAY) | 1.48 | 0-1 | YOK | `7869c570-2984-4272-a272-75d52b9a2cbe` |
| 45 | 10 Ekim | 19:30 | Barcelona – Getafe | Barcelona (HOME) | 1.12 | 3-0 | YOK | `b090353f-26e0-44a1-84cd-91b38095bbe9` |
| 46 | 10 Ekim | 19:30 | Maccabi Tel Aviv – Bnei Sakhnin | Maccabi Tel Aviv (HOME) | 1.16 | 0-0 | YOK | `8397e190-4035-4c53-a6d8-b5350c33b737` |
| 47 | 10 Ekim | 20:00 | FK Radnicki 1923 – Crvena Zvezda | Crvena Zvezda (AWAY) | 1.49 | 0-3 | YOK | `9574af9e-280c-4125-9259-7a43192f3eb5` |
| 48 | 10 Ekim | 20:00 | Maritimo – Porto | Porto (AWAY) | 1.33 | 1-2 | VAR | `f9b4bb42-4c6c-44a6-9a33-8ef6036346b0` |
| 49 | 10 Ekim | 21:00 | Al-Hilal – Al-Ittihad | Al-Hilal (HOME) | 1.34 | 3-2 | VAR | `78db7da5-189e-4beb-8ab3-95646721496a` |
| 50 | 10 Ekim | 21:00 | Fortuna Sittard – FC Twente | FC Twente (AWAY) | 1.47 | 1-1 | VAR | `11f5ae9e-3fdb-4325-83a5-78b9e063665e` |
| 51 | 10 Ekim | 21:00 | St Etienne – Rodez | St Etienne (HOME) | 1.40 | 2-0 | YOK | `405f25da-13fb-42cd-965a-7a367a19a30e` |
| 52 | 10 Ekim | 21:45 | Genk – Kortrijk | Genk (HOME) | 1.43 | 3-0 | YOK | `6b58f368-d755-4cff-8585-8f12dccb9a71` |
| 53 | 10 Ekim | 21:45 | Paris St-G – Le Mans | Paris St-G (HOME) | 1.14 | 3-1 | VAR | `1965067c-3085-495d-8d7e-4aae02addced` |
| 54 | 10 Ekim | 22:00 | Ajax – NEC Nijmegen | Ajax (HOME) | 1.36 | 1-1 | VAR | `947dc6ec-b096-492a-ac72-6bf3b1b0391e` |
| 55 | 10 Ekim | 22:00 | Real Madrid – Villarreal | Real Madrid (HOME) | 1.39 | 1-0 | YOK | `2de709d1-ecd2-43e1-b4da-2f74f4972eaa` |
| 56 | 11 Ekim | 16:00 | SJK 2 – KTP | KTP (AWAY) | 1.38 | 4-3 | VAR | `b708f68c-921c-4fc7-82d3-3229931aa839` |
| 57 | 11 Ekim | 17:00 | Union St Gilloise – Oud-Heverlee Leuven | Union St Gilloise (HOME) | 1.27 | 1-1 | VAR | `b516cc63-bfe0-4766-ac94-0f967d0dfdbe` |
| 58 | 11 Ekim | 17:30 | Hacken – Orgryte | Hacken (HOME) | 1.35 | 3-0 | YOK | `4a54eb81-6821-4d15-85ae-fdfcf30f19e3` |
| 59 | 11 Ekim | 17:30 | St Gallen – Lausanne | St Gallen (HOME) | 1.50 | 1-0 | YOK | `3909d1f0-a5df-43bc-a770-70c6276d485a` |
| 60 | 11 Ekim | 18:00 | Csikszereda – Universitatea Craiova | Universitatea Craiova (AWAY) | 1.33 | 0-1 | YOK | `6817d6e0-ec10-4355-9ddf-180d0e1eb24d` |
| 61 | 11 Ekim | 18:00 | Stabaek – Strommen | Stabaek (HOME) | 1.48 | 2-2 | VAR | `2e189755-ea4e-4703-8804-362c9f3ff68d` |
| 62 | 11 Ekim | 18:15 | Rennes – Auxerre | Rennes (HOME) | 1.47 | 4-1 | VAR | `999258b9-4e89-419f-b472-2a50ee94a654` |
| 63 | 11 Ekim | 19:00 | Besiktas – Kocaelispor | Besiktas (HOME) | 1.27 | 2-1 | VAR | `16df7e31-bd70-4ebb-880c-63c1e82e8ba5` |
| 64 | 11 Ekim | 19:00 | Sparta Prague – Pardubice | Sparta Prague (HOME) | 1.40 | 2-0 | YOK | `1f20e753-240f-496f-8514-9d55971bb98c` |
| 65 | 11 Ekim | 20:00 | Benfica – Guimaraes | Benfica (HOME) | 1.26 | 2-0 | YOK | `12c983e9-1be1-48cc-909c-95966153b645` |
| 66 | 11 Ekim | 22:00 | Patronato – CA Guemes | Patronato (HOME) | 1.48 | 2-0 | YOK | `5ea1d2b4-f4e0-4f26-9bee-6d2c6b55b6c8` |
| 67 | 11 Ekim | 22:15 | Vikingur Reykjavik – IA Akranes | Vikingur Reykjavik (HOME) | 1.50 | 2-2 | VAR | `b2092643-ab02-4113-a288-a6439ff92216` |
| 68 | 13 Ekim | 22:00 | Arsenal – Lille | Arsenal (HOME) | 1.24 | 3-0 | YOK | `6938d0bc-5d5c-4cf9-a4ac-a59b3095a6a3` |
| 69 | 13 Ekim | 22:00 | Galatasaray – Barcelona | Barcelona (AWAY) | 1.31 | 1-4 | VAR | `c1903fb4-c4dd-4a4a-8e61-a639d3ebbf93` |
| 70 | 13 Ekim | 22:00 | Inter – Club Brugge | Inter (HOME) | 1.27 | 3-4 | VAR | `14b9036b-6191-4a50-aa9a-db48a45154ab` |
| 71 | 13 Ekim | 22:00 | Viking – Bayern Munich | Bayern Munich (AWAY) | 1.14 | 3-3 | VAR | `a13fc1df-005d-4c80-b1dd-f23eab7bf203` |
| 72 | 14 Ekim | 16:00 | MFK Vranov nad Toplou – Dukla Banska Bystrica | Dukla Banska Bystrica (AWAY) | 1.21 | 0-2 | YOK | `ffa03dac-1a30-46a7-9eaf-de220050baf4` |
| 73 | 14 Ekim | 16:00 | PFK Piestany – Spartak Trnava | Spartak Trnava (AWAY) | 1.09 | 0-2 | YOK | `20ea4677-0c34-477b-97e2-94012cbc50f2` |
| 74 | 14 Ekim | 17:45 | Al-Jazira (Kuwait) – Al Shamiya | Al-Jazira (Kuwait) (HOME) | 1.34 | 6-1 | VAR | `79aec883-5fc4-4a13-9c77-3ae3040de483` |
| 75 | 14 Ekim | 18:00 | Parnu JK Vaprus U21 – Tabasalu JK | Parnu JK Vaprus U21 (HOME) | 1.36 | 2-1 | VAR | `0eb72017-7799-4b33-b5b3-c4d849bc7338` |
| 76 | 14 Ekim | 19:00 | Al Jazira – Arkadag FK | Al Jazira (HOME) | 1.18 | 2-1 | VAR | `c0ceb6ad-5766-443e-a17b-082461aaed96` |
| 77 | 14 Ekim | 19:45 | Lask Linz – Liverpool | Liverpool (AWAY) | 1.42 | 3-6 | VAR | `70ca1d12-a91a-4fc2-9366-ec6cb7094a1c` |
| 78 | 14 Ekim | 20:00 | Bryne – Raufoss | Bryne (HOME) | 1.29 | 1-1 | VAR | `63b34191-8a63-4417-aad6-efc90d334cc8` |
| 79 | 14 Ekim | 20:00 | Haugesund – Lyn | Haugesund (HOME) | 1.31 | 3-0 | YOK | `c3ad9632-0bae-4b7f-84a6-d8d409ad7426` |
| 80 | 14 Ekim | 20:00 | Omonia 29th May – AEP Polemidion | Omonia 29th May (HOME) | 1.09 | 0-0 | YOK | `e1c6ae78-778f-4105-8db9-cb351c795c0b` |
| 81 | 14 Ekim | 21:00 | Santarem – Gil Vicente | Gil Vicente (AWAY) | 1.46 | 2-2 | VAR | `e30418ea-1f76-4589-b0c5-ea770bf35e10` |
| 82 | 14 Ekim | 22:00 | Slovan Bratislava – Stuttgart | Stuttgart (AWAY) | 1.39 | 0-3 | YOK | `eef9393e-d076-43fb-9ac9-2b6a8370776c` |
| 83 | 15 Ekim | 17:00 | Mash al Mubarek – Olmaliq | Olmaliq (AWAY) | 1.47 | 0-1 | YOK | `3f361138-bcfe-4bcf-8413-5f894af41200` |
| 84 | 15 Ekim | 17:00 | Rigas Futbola Skola – SK Super Nova | Rigas Futbola Skola (HOME) | 1.13 | 4-0 | YOK | `91d8c8fb-9101-4027-95e1-0c8dc512d32f` |
| 85 | 15 Ekim | 17:00 | USM El Harrach – RC Arba | USM El Harrach (HOME) | 1.17 | 3-1 | VAR | `09b2968d-dc6d-4c57-b780-d7dbce4bbf84` |
| 86 | 15 Ekim | 19:00 | Tallinna FC Flora – FCI Tallinn | FCI Tallinn (AWAY) | 1.50 | 1-3 | VAR | `7d22ea9a-a496-46a0-b53e-56aa80b99555` |
| 87 | 15 Ekim | 19:45 | Az Alkmaar – Hapoel Be'er Sheva | Az Alkmaar (HOME) | 1.37 | 2-1 | VAR | `ff02b04f-67e2-4ad9-af05-43685074e9ae` |
| 88 | 15 Ekim | 19:45 | Mjallby – Inter Club Escaldes | Mjallby (HOME) | 1.37 | 2-0 | YOK | `a4b904f2-a8f9-4051-b585-759591bfedc8` |
| 89 | 15 Ekim | 19:45 | Panathinaikos – Borac Banja Luka | Panathinaikos (HOME) | 1.24 | 2-1 | VAR | `60065faa-d8fe-44a2-9558-a4cb2f97a546` |
| 90 | 15 Ekim | 19:45 | Sparta Prague – Lillestrom | Sparta Prague (HOME) | 1.37 | 1-1 | VAR | `ed8c7c6d-4887-4e24-bc3d-a59f89cfb4b3` |
| 91 | 15 Ekim | 19:45 | Torreense – Sunderland | Sunderland (AWAY) | 1.35 | 1-2 | VAR | `39ba662f-ed11-46e5-b5f7-3d28134a4f15` |
| 92 | 15 Ekim | 22:00 | Atalanta – Pafos FC | Atalanta (HOME) | 1.35 | 3-1 | VAR | `cdabb53d-a1c6-4360-8187-3c3cec608079` |
| 93 | 15 Ekim | 22:00 | Benfica – Celtic | Benfica (HOME) | 1.23 | 4-1 | VAR | `049b3596-699c-41d3-9c4a-fcdb30e4fb8e` |
| 94 | 15 Ekim | 22:00 | Bournemouth – Sturm Graz | Bournemouth (HOME) | 1.21 | 3-0 | YOK | `697f99ac-bbcc-40cb-a109-054883246e07` |
| 95 | 15 Ekim | 22:00 | Brann – Lincoln Red Imps | Brann (HOME) | 1.17 | 2-1 | VAR | `2ae76bdf-3c18-48c0-a488-f493379b9214` |
| 96 | 15 Ekim | 22:00 | Brighton – FK Kauno Zalgiris | Brighton (HOME) | 1.05 | 4-0 | YOK | `594d9bcb-8b00-4c3e-9d27-f2a6002b094f` |
| 97 | 15 Ekim | 22:00 | FC Twente – Thun | FC Twente (HOME) | 1.24 | 1-0 | YOK | `bbfe3a67-aedc-4750-b100-2184f1c513b6` |
| 98 | 15 Ekim | 22:00 | Freiburg – FK Jablonec | Freiburg (HOME) | 1.22 | 3-2 | VAR | `1d17c896-6b8b-4038-999e-6b991b854460` |
| 99 | 15 Ekim | 22:00 | Jagiellonia Bialystock – Ararat Armenia | Jagiellonia Bialystock (HOME) | 1.45 | 3-1 | VAR | `9834b69b-4972-44c0-878d-ab8644cece6a` |
| 100 | 15 Ekim | 22:00 | Rennes – OFI | Rennes (HOME) | 1.24 | 2-1 | VAR | `e86686ef-db52-4c31-9c14-8fd7c9d93d7b` |
| 101 | 15 Ekim | 22:00 | Sint Truiden – FC Iberia 1999 | Sint Truiden (HOME) | 1.25 | 2-0 | YOK | `f2611be4-3479-49e0-b1ce-7fd22eb71161` |
| 102 | 15 Ekim | 23:00 | Cumbaya FC – 22 de Julio FC | Cumbaya FC (HOME) | 1.22 | 7-1 | VAR | `8cdeaf5f-b4f9-4d8f-8cfe-41f7e9482983` |
| 103 | 16 Ekim | 16:00 | Alashkert – FC Syunik | Alashkert (HOME) | 1.25 | 5-1 | VAR | `1789a133-6e64-4310-b832-745854ae5772` |
| 104 | 16 Ekim | 16:15 | Al-Quadisiya (KSA) – Abha | Al-Quadisiya (KSA) (HOME) | 1.15 | 2-1 | VAR | `d472eee5-9fb3-48ff-a461-4c87a72ca9e6` |
| 105 | 16 Ekim | 17:00 | Sporting Club Delhi – Mohun Bagan Super Giants | Mohun Bagan Super Giants (AWAY) | 1.40 | 1-2 | VAR | `b5659f2c-d6b4-4539-ae3a-f5aaf58e8402` |
| 106 | 16 Ekim | 18:45 | Bani Yas – Al Wasl | Al Wasl (AWAY) | 1.48 | 0-2 | YOK | `3c1f690f-3f28-48db-ae8c-acfce11e1870` |
| 107 | 16 Ekim | 19:00 | FK Panevezio Ekranas – FK Dainava Alytus | FK Dainava Alytus (AWAY) | 1.49 | 1-3 | VAR | `9ac07f12-2a28-4262-8f2a-f7820b738cee` |
| 108 | 16 Ekim | 19:00 | Triglav – NK Jadran Dekani | Triglav (HOME) | 1.26 | 1-0 | YOK | `bbb9f576-5026-4da6-ad51-3f649cc2edec` |
| 109 | 16 Ekim | 20:30 | Rapid Vienna – Hartberg | Rapid Vienna (HOME) | 1.29 | 3-1 | VAR | `908f7e25-865a-479f-87ef-19b658e093c0` |
| 110 | 16 Ekim | 21:00 | Dinamo Bucharest – Botosani | Dinamo Bucharest (HOME) | 1.50 | 2-0 | YOK | `98f1e068-ef4e-47ec-be38-d1d4236c3507` |
| 111 | 16 Ekim | 21:00 | Rapperswil-Jona – St Gallen | St Gallen (AWAY) | 1.49 | 0-2 | YOK | `16b48900-ba1e-4056-9ab1-f6c2e210b5dc` |
| 112 | 16 Ekim | 21:00 | Stoke U21 – Chelsea U21 | Chelsea U21 (AWAY) | 1.40 | 1-2 | VAR | `2882bf6a-a67d-4f3e-965d-daf01a7d68b0` |
| 113 | 16 Ekim | 21:15 | Stade Nyonnais – FC Basel | FC Basel (AWAY) | 1.20 | 0-3 | YOK | `107cc0fb-a9c8-4d4b-8c33-e1ffbddb7804` |
| 114 | 16 Ekim | 21:30 | Waasland-Beveren – Habay-la-Neuve | Waasland-Beveren (HOME) | 1.18 | 3-0 | YOK | `ede117ae-e8b4-41d2-9ca3-22fcdc66cde7` |
| 115 | 17 Ekim | 16:00 | Cukaricki – Zemun | Cukaricki (HOME) | 1.43 | 3-0 | YOK | `48658982-0b06-42ce-b71d-a4cf9f3198d0` |
| 116 | 17 Ekim | 16:00 | Genclerbirligi – Galatasaray | Galatasaray (AWAY) | 1.42 | 0-1 | YOK | `f11aea87-54bf-4ecb-bd1c-9f108714e660` |
| 117 | 17 Ekim | 16:00 | PK-35 RY – SJK 2 | PK-35 RY (HOME) | 1.25 | 3-2 | VAR | `6d5b405d-dffc-4171-8ba0-1d086d6a0223` |
| 118 | 17 Ekim | 16:00 | Slavia Prague – Hradec Kralove | Slavia Prague (HOME) | 1.37 | 0-0 | YOK | `81a3c0b4-920c-4eed-b952-7440b4c7e8b8` |
| 119 | 17 Ekim | 17:00 | Man City – Ipswich | Man City (HOME) | 1.26 | 3-2 | VAR | `13541c5d-03e9-400b-9ee3-79ceddba6c75` |
| 120 | 17 Ekim | 17:00 | Salford City – Crawley Town | Salford City (HOME) | 1.40 | 2-1 | VAR | `114a3910-f2aa-4232-8a43-fb098f520168` |
| 121 | 17 Ekim | 17:00 | Southampton – Bolton | Southampton (HOME) | 1.47 | 0-0 | YOK | `a98b5aac-c459-4080-8f95-055377bad744` |
| 122 | 17 Ekim | 17:00 | Stockport – Bromley | Stockport (HOME) | 1.27 | 1-0 | YOK | `4fe6c3dd-b6db-4752-9eb6-ceecdc1ead11` |
| 123 | 17 Ekim | 17:15 | Villarreal – Elche | Villarreal (HOME) | 1.45 | 0-0 | YOK | `fe2ac5c6-c301-4ac2-ac1d-fa416bd913be` |
| 124 | 17 Ekim | 17:30 | ADO Den Haag – PSV | PSV (AWAY) | 1.32 | 2-1 | VAR | `24b1a80b-82c8-457a-bcff-28c8ac6dcf2d` |
| 125 | 17 Ekim | 18:00 | FC Inter Turku – AC Oulu | FC Inter Turku (HOME) | 1.44 | 1-2 | VAR | `796f3324-7072-4a94-9a8f-96c83781b60e` |
| 126 | 17 Ekim | 18:00 | SC Austria Lustenau – Lask Linz | Lask Linz (AWAY) | 1.43 | 0-4 | YOK | `78c94bb6-f092-4e14-bb7a-89e3ba5bbc63` |
| 127 | 17 Ekim | 18:00 | Shakhtar – Kolos Kovalyovka | Shakhtar (HOME) | 1.32 | 2-1 | VAR | `c2504184-ff97-4c21-910f-ae61cbd2e2da` |
| 128 | 17 Ekim | 18:15 | Strasbourg – Paris St-G | Paris St-G (AWAY) | 1.45 | 1-3 | VAR | `ccf7d433-4d41-464b-a509-f4de60aecfb4` |
| 129 | 17 Ekim | 18:30 | FC Blau Weiss Linz – FC Liefering | FC Blau Weiss Linz (HOME) | 1.47 | 4-1 | VAR | `0bc053b4-c7b3-4391-b43d-9071196a6bc8` |
| 130 | 17 Ekim | 18:30 | R AEC Mons – Charleroi | Charleroi (AWAY) | 1.31 | 0-0 | YOK | `1c298459-7921-4689-b496-60648d8bd3cd` |
| 131 | 17 Ekim | 19:00 | Apollon Limassol – Nea Salamis | Apollon Limassol (HOME) | 1.50 | 4-2 | VAR | `ea51f93b-19b2-4c93-8db3-7822725ed5e8` |
| 132 | 17 Ekim | 19:00 | Fenerbahce – Alanyaspor | Fenerbahce (HOME) | 1.33 | 3-0 | YOK | `d1e15840-42cb-448b-b086-4d12e673d93f` |
| 133 | 17 Ekim | 19:00 | Viking – Fredrikstad | Viking (HOME) | 1.39 | 3-2 | VAR | `9d4fbcd4-8bbc-4631-aec3-6e04d4116a2a` |
| 134 | 17 Ekim | 19:30 | Bayern Munich – RB Leipzig | Bayern Munich (HOME) | 1.23 | 6-1 | VAR | `4ad2d704-7508-462c-8c25-2d6cc8757379` |
| 135 | 17 Ekim | 19:30 | Betis – Barcelona | Barcelona (AWAY) | 1.48 | 2-5 | VAR | `a018ae91-45ce-41f8-9b57-88bee712154a` |
| 136 | 17 Ekim | 20:30 | Al-Qadsia – Fortis FC Limited | Al-Qadsia (HOME) | 1.17 | 3-0 | YOK | `29b5f65e-6742-4232-ad37-f54c560f7cef` |
| 137 | 17 Ekim | 21:00 | SC Telstar – Feyenoord | Feyenoord (AWAY) | 1.37 | 3-4 | VAR | `4ead0578-fd67-4a28-8550-e2e2159333e0` |
| 138 | 17 Ekim | 21:30 | Philadelphia – Charlotte FC | Philadelphia (HOME) | 1.48 | 2-2 | VAR | `b31ac936-5f65-448e-8161-21d2cdb5d314` |
| 139 | 17 Ekim | 21:30 | Villarreal B – CD Teruel | Villarreal B (HOME) | 1.32 | 2-0 | YOK | `7eea0702-3848-4948-947a-f13956209089` |
| 140 | 17 Ekim | 21:45 | Club Brugge – SC Lokeren-Temse | Club Brugge (HOME) | 1.15 | 1-0 | YOK | `d5f666fc-3b40-4f2d-a5da-cc065c44b0ef` |
| 141 | 17 Ekim | 21:45 | Excelsior Virton – Genk | Genk (AWAY) | 1.38 | 0-2 | YOK | `0b36e812-0bfb-4f21-a7e9-2cb618384a4b` |
| 142 | 17 Ekim | 22:00 | Dundee – Rangers | Rangers (AWAY) | 1.43 | 2-2 | VAR | `a937996b-8281-434b-9c5f-af4c2eb0a525` |
| 143 | 18 Ekim | 16:00 | FK Riga – SK Super Nova | FK Riga (HOME) | 1.14 | 2-1 | VAR | `cdc73a2c-4ff3-4172-9750-4a03ba6e0ee9` |
| 144 | 18 Ekim | 16:00 | Kuressaare – FCI Tallinn | FCI Tallinn (AWAY) | 1.29 | 0-2 | YOK | `07a37985-20ff-4dad-ad6d-67fb43b80cc8` |
| 145 | 18 Ekim | 16:00 | Terengganu – Johor Darul Ta'zim | Johor Darul Ta'zim (AWAY) | 1.13 | 0-3 | YOK | `fd4c8153-69ee-4872-b018-3c129acf727f` |
| 146 | 18 Ekim | 17:00 | Alcochetense – Maritimo | Maritimo (AWAY) | 1.37 | 1-2 | VAR | `36a913f1-d2cc-4d2e-86d9-5d808b2de009` |
| 147 | 18 Ekim | 17:00 | Crvena Zvezda – Mladost Lucani | Crvena Zvezda (HOME) | 1.10 | 5-1 | VAR | `e662decf-bf96-459c-822f-e51323d968a2` |
| 148 | 18 Ekim | 17:00 | Fatima – Academico de Viseu | Academico de Viseu (AWAY) | 1.49 | 1-0 | YOK | `60bfd279-c60f-4724-907f-9b5f1f9bb250` |
| 149 | 18 Ekim | 17:00 | FC Astana – FK Kaspyi Aktau | FC Astana (HOME) | 1.33 | 2-2 | VAR | `dc0ad2b8-52fb-4401-97f2-f18f5b1e66a3` |
| 150 | 18 Ekim | 17:00 | Lusitania Futebol Clube – AD Limianos | Lusitania Futebol Clube (HOME) | 1.26 | 2-1 | VAR | `f208d12c-c1d6-4a4f-bc05-61310e8a2877` |
| 151 | 18 Ekim | 17:00 | Panaitolikos – Olympiakos | Olympiakos (AWAY) | 1.34 | 0-2 | YOK | `febbca3d-96de-43dd-8a60-a03952ecf457` |
| 152 | 18 Ekim | 17:00 | Salgueiros – Estoril Praia | Estoril Praia (AWAY) | 1.41 | 1-1 | VAR | `06147c6c-6897-480e-bafb-7ad604a53cba` |
| 153 | 18 Ekim | 17:30 | Halmstads – Hammarby | Hammarby (AWAY) | 1.28 | 0-1 | YOK | `660d49f3-7c71-4374-b35b-8e9994fe94a6` |
| 154 | 18 Ekim | 17:30 | Panathinaikos – Asteras Tripolis | Panathinaikos (HOME) | 1.24 | 5-1 | VAR | `63d6a7fb-4925-4edc-83c1-73a52968752a` |
| 155 | 18 Ekim | 17:45 | MVV Maastricht – Heracles | Heracles (AWAY) | 1.48 | 1-5 | VAR | `19e88a3c-741b-4f85-93ea-e08efe0d413d` |
| 156 | 18 Ekim | 18:00 | Asane – Stabaek | Stabaek (AWAY) | 1.41 | 0-1 | YOK | `d2b1932f-0bf9-4b07-9737-a400db71c260` |
| 157 | 18 Ekim | 18:00 | Kongsvinger – Sandnes Ulf | Kongsvinger (HOME) | 1.37 | 4-0 | YOK | `a02bbefb-8d4c-4edc-9bf0-44f58abc8ca4` |
| 158 | 18 Ekim | 18:00 | Molde – Start | Molde (HOME) | 1.38 | 6-1 | VAR | `5d4eebf2-dc45-4a46-860b-b0efc6bd4a6c` |
| 159 | 18 Ekim | 18:00 | Spartak Pleven – PFC Levski Sofia | PFC Levski Sofia (AWAY) | 1.11 | 0-2 | YOK | `2fd00d78-86eb-4cb9-8a9b-d74f4e938ccd` |
| 160 | 18 Ekim | 19:00 | Al Ahli (BRN) – Al Khalidiyah | Al Khalidiyah (AWAY) | 1.50 | 1-2 | VAR | `2d08eebe-f8ac-47df-a48a-c64077b957a5` |
| 161 | 18 Ekim | 19:00 | Al-Muharraq – Malkiya | Al-Muharraq (HOME) | 1.32 | 3-0 | YOK | `c836c679-4ac0-4aab-a1a7-0117b0905dbe` |
| 162 | 18 Ekim | 19:00 | Slaven Belupo – Dinamo Zagreb | Dinamo Zagreb (AWAY) | 1.43 | 1-5 | VAR | `798d0d7c-8427-41ed-9d3f-5b666b8406ec` |
| 163 | 18 Ekim | 19:15 | Vikingur Gota – AB Argir | Vikingur Gota (HOME) | 1.48 | 2-0 | YOK | `52745532-f582-43ee-8ede-410842b8f567` |
| 164 | 18 Ekim | 20:15 | Hapoel Be'er Sheva – Hapoel Jerusalem | Hapoel Be'er Sheva (HOME) | 1.36 | 2-1 | VAR | `a126a3be-f80e-4b03-a231-37cc557fc710` |
| 165 | 18 Ekim | 20:15 | Tromso – Kfum Oslo | Tromso (HOME) | 1.50 | 1-1 | VAR | `77a4df15-2c97-4178-a156-644a5d3f0d2f` |
| 166 | 18 Ekim | 21:00 | FC Twente – FC Utrecht | FC Twente (HOME) | 1.39 | 1-2 | VAR | `48515870-deb7-4a32-8474-1f586132df98` |
| 167 | 18 Ekim | 21:00 | PAOK – Iraklis | PAOK (HOME) | 1.33 | 2-1 | VAR | `b9978a84-beaf-4f8c-aa92-f4d2d4c8d706` |
| 168 | 18 Ekim | 21:00 | Universitatea Craiova – Farul Constanta | Universitatea Craiova (HOME) | 1.46 | 2-0 | YOK | `23b845de-db8d-4333-99a7-286cdd7e490f` |
| 169 | 18 Ekim | 21:30 | Uniao Sport Clube de Paredes – Famalicao | Famalicao (AWAY) | 1.44 | 1-0 | YOK | `72e4972c-7749-4d26-9af3-33a4e4a3898f` |
| 170 | 18 Ekim | 22:00 | Real Madrid – Sevilla | Real Madrid (HOME) | 1.27 | 4-1 | VAR | `dc660aec-6474-4212-a043-f4eff6cd9f28` |
| 171 | 19 Ekim | 16:00 | Al Nahdha – Sur Club | Al Nahdha (HOME) | 1.45 | 5-1 | VAR | `36b99c49-9e71-418a-b066-9eaf1a457a81` |
| 172 | 19 Ekim | 17:40 | Kuwait SC – AL-Salibikhaet | Kuwait SC (HOME) | 1.21 | 7-0 | YOK | `b8a80057-9db6-425b-9686-5b97b1175b82` |
| 173 | 19 Ekim | 18:00 | Tatran Presov – MSK Zilina II | Tatran Presov (HOME) | 1.47 | 1-1 | VAR | `1b67bef5-fa11-49c5-bce4-8a7c4a04ee04` |
| 174 | 19 Ekim | 18:05 | Al-Feiha – Al Ahli | Al Ahli (AWAY) | 1.42 | 2-3 | VAR | `a6e60239-152e-4261-9299-b7a47bd8eabc` |
| 175 | 19 Ekim | 19:00 | Hapoel Kfar Shelem – Hapoel Akko | Hapoel Kfar Shelem (HOME) | 1.50 | 4-0 | YOK | `4414020d-26ff-47a7-b588-574cc8250cc0` |
| 176 | 19 Ekim | 19:00 | Omonia – Olympiakos Nicosia FC | Omonia (HOME) | 1.27 | 2-2 | VAR | `44e355c5-22a7-455d-8562-b88d9e3e27c2` |
| 177 | 19 Ekim | 19:00 | Rigas Futbola Skola – FK Tukums 2000 | Rigas Futbola Skola (HOME) | 1.10 | 2-0 | YOK | `4a6ef2c5-2012-44d3-bb78-78fbbf9a1cf2` |
| 178 | 19 Ekim | 19:00 | Tabasalu JK – Narva Trans II | Narva Trans II (AWAY) | 1.31 | 0-0 | YOK | `ad93aca9-cd4e-4e32-a1b4-b0c714fd27a2` |
| 179 | 19 Ekim | 20:00 | Bursaspor – Pendikspor | Bursaspor (HOME) | 1.50 | 2-0 | YOK | `a4069eab-684d-4d83-9869-bca212dd7e17` |
| 180 | 19 Ekim | 21:00 | Al-Hilal – Al-Hazm (KSA) | Al-Hilal (HOME) | 1.08 | 1-0 | YOK | `2463bbb5-95ac-473c-b2a3-fc451de44bf0` |
| 181 | 20 Ekim | 17:00 | Asyut Petroleum – Zamalek | Zamalek (AWAY) | 1.42 | 0-1 | YOK | `cd5ab1ef-e18a-4cad-8336-2f4646e9be6d` |
| 182 | 20 Ekim | 17:00 | Man City U19 – AEK Athens FC U19 | Man City U19 (HOME) | 1.18 | 1-1 | VAR | `58db0b83-4e0e-410e-96f6-c957a692bf26` |
| 183 | 20 Ekim | 18:10 | Al-Taawoun Buraidah – Al-Quadisiya (KSA) | Al-Quadisiya (KSA) (AWAY) | 1.47 | 0-1 | YOK | `81754a04-45d8-4857-82a2-ceb174b981a9` |
| 184 | 20 Ekim | 19:00 | Karlovac – Rijeka | Rijeka (AWAY) | 1.22 | 1-4 | VAR | `540e95c5-7f2a-4e2b-b724-f87588f7e7bf` |
| 185 | 20 Ekim | 19:45 | FC Sabah – Dortmund | Dortmund (AWAY) | 1.33 | 1-2 | VAR | `5ac19679-b984-4bf0-954e-930fa809e14c` |
| 186 | 20 Ekim | 20:00 | El Geish – Pyramids | Pyramids (AWAY) | 1.46 | 1-4 | VAR | `a899f221-94ea-4b57-80e4-74f2b5c8585d` |
| 187 | 20 Ekim | 21:00 | Al Nassr – NEOM Sports Club | Al Nassr (HOME) | 1.43 | 1-0 | YOK | `5033f864-b0c2-4314-9c1b-6aa49665f419` |
| 188 | 20 Ekim | 21:00 | Boreham Wood – Middlesbrough U21 | Boreham Wood (HOME) | 1.39 | 7-1 | VAR | `0eb3af36-6b5e-4c4f-8daa-8901d989f34c` |
| 189 | 20 Ekim | 21:45 | Ebbsfleet Utd – Horsham FC | Ebbsfleet Utd (HOME) | 1.50 | 2-2 | VAR | `78149d25-54b9-446e-8b73-2d2edb4b7679` |
| 190 | 20 Ekim | 21:45 | Luton – Barnsley | Luton (HOME) | 1.48 | 2-1 | VAR | `68586030-3314-4413-909a-950f14142d22` |
| 191 | 20 Ekim | 22:00 | Man City – AEK Athens | Man City (HOME) | 1.15 | 5-1 | VAR | `eda91354-0ce6-4f12-8f0d-b5604632c7dc` |
| 192 | 20 Ekim | 22:00 | Roma – Slovan Bratislava | Roma (HOME) | 1.16 | 4-0 | YOK | `7671254a-74f3-4bdd-b296-9d27065c5148` |
| 193 | 21 Ekim | 16:00 | Aston Villa U19 – Viking FK U19 | Aston Villa U19 (HOME) | 1.27 | 0-1 | YOK | `2fb9b393-62fd-4411-94f9-a64696c0f16c` |
| 194 | 21 Ekim | 16:00 | Sporting CP U19 – LASK Linz U19 | Sporting CP U19 (HOME) | 1.39 | 2-1 | VAR | `5c7d2244-5d92-4dc7-b4d5-f099032cb4c1` |
| 195 | 21 Ekim | 17:00 | AEK Larnaca – Akritas Chlorakas | AEK Larnaca (HOME) | 1.10 | 2-2 | VAR | `341ab616-aff5-4691-bfe5-4ffd279dc115` |
| 196 | 21 Ekim | 17:00 | FK Navbahor Namangan – Gʻazalkent FK | FK Navbahor Namangan (HOME) | 1.33 | 3-1 | VAR | `e12670ae-d58b-4bcd-939f-aef872c60288` |
| 197 | 21 Ekim | 17:00 | Inter U19 – Shakhtar U19 | Inter U19 (HOME) | 1.50 | 2-0 | YOK | `54c2150a-d5d5-49e3-91ea-34e0afc50f61` |
| 198 | 21 Ekim | 17:00 | Real Madrid U19 – RB Leipzig U19 | Real Madrid U19 (HOME) | 1.23 | 5-2 | VAR | `083c5858-ff80-4b48-b026-f867a7bd971b` |
| 199 | 21 Ekim | 18:00 | Nea Salamis – Apea Akrotiriou | Nea Salamis (HOME) | 1.21 | 4-0 | YOK | `f8ac3309-61d1-4601-98e0-796a1bbc7e75` |
| 200 | 21 Ekim | 20:00 | Al Ahly Cairo – Olympic El Qanal | Al Ahly Cairo (HOME) | 1.32 | 3-3 | VAR | `cbbfaed5-b24f-44cd-9bd6-b67e8792bcba` |
| 201 | 21 Ekim | 22:00 | Aston Villa – Viking | Aston Villa (HOME) | 1.28 | 3-1 | VAR | `d23903ac-9196-4fea-a94f-423b2298d558` |
| 202 | 21 Ekim | 22:00 | Inter – Shakhtar | Inter (HOME) | 1.25 | 1-0 | YOK | `a335695b-9bca-4bd8-ae4c-15129c5c3a79` |
| 203 | 21 Ekim | 22:00 | Reading – Leyton Orient | Reading (HOME) | 1.49 | 1-0 | YOK | `9b6fe299-5635-4d4f-b7e5-10a8ddb9f215` |
| 204 | 21 Ekim | 22:00 | Real Madrid – RB Leipzig | Real Madrid (HOME) | 1.27 | 4-1 | VAR | `8c6e1b89-de7b-47e5-a4a9-d2e9e0e68592` |
| 205 | 21 Ekim | 22:00 | Sporting Lisbon – Lask Linz | Sporting Lisbon (HOME) | 1.30 | 2-3 | VAR | `5850f993-1227-49f0-882c-7ce2826b655d` |
| 206 | 21 Ekim | 23:00 | 22 de Julio FC – LDU de Portoviejo | LDU de Portoviejo (AWAY) | 1.19 | 0-0 | YOK | `233b0c61-f362-449f-9493-48efb3a93382` |
| 207 | 21 Ekim | 23:00 | Colo Colo (W) – Caracas FC (W) | Colo Colo (W) (HOME) | 1.20 | 3-0 | YOK | `b29f01e8-3aa0-46ed-a7e4-d6e061c6d0bf` |
| 208 | 22 Ekim | 19:45 | Ararat Armenia – Az Alkmaar | Az Alkmaar (AWAY) | 1.43 | 0-4 | YOK | `4e71788e-56bd-4d7b-8607-38b20c76eff2` |
| 209 | 22 Ekim | 19:45 | FC Nordsjaelland – CSKA Sofia | FC Nordsjaelland (HOME) | 1.47 | 2-2 | VAR | `3427b37b-c22c-4223-873d-22d2212e6651` |
| 210 | 22 Ekim | 19:45 | Ferencvaros – Torreense | Ferencvaros (HOME) | 1.33 | 4-1 | VAR | `8b928072-ec2c-4909-8ddb-81a255f59ead` |
| 211 | 22 Ekim | 19:45 | FK Jablonec – Brighton | Brighton (AWAY) | 1.21 | 0-0 | YOK | `88a8a53c-8f66-4898-b885-bd4b19a8d4d2` |
| 212 | 22 Ekim | 19:45 | Juventus – Rennes | Juventus (HOME) | 1.47 | 2-2 | VAR | `7b53affd-b18e-4ac8-a880-4ed7bf96086f` |
| 213 | 22 Ekim | 19:45 | OFI – Leverkusen | Leverkusen (AWAY) | 1.24 | 0-2 | YOK | `8e31358c-21ad-44b0-8304-f851d6a1d4da` |
| 214 | 22 Ekim | 19:45 | Trabzonspor – Hearts | Trabzonspor (HOME) | 1.31 | 2-0 | YOK | `aa1caafb-a340-426b-bcae-93b426af9005` |
| 215 | 22 Ekim | 19:45 | Union St Gilloise – Hapoel Be'er Sheva | Union St Gilloise (HOME) | 1.40 | 4-0 | YOK | `c4b18834-2ed9-41eb-be83-41816478e78e` |
| 216 | 22 Ekim | 22:00 | Lillestrom – Real Sociedad | Real Sociedad (AWAY) | 1.48 | 0-6 | YOK | `489cf219-1a02-4bcb-abad-4077c0cbc5ac` |
| 217 | 22 Ekim | 22:00 | Lincoln Red Imps – FC Twente | FC Twente (AWAY) | 1.24 | 1-4 | VAR | `dd5debb8-dce3-4460-a504-35926c700cef` |
| 218 | 22 Ekim | 22:00 | Omonia – Benfica | Benfica (AWAY) | 1.36 | 1-4 | VAR | `2a3cb97d-b76f-42a7-b226-754b6b96e4da` |
| 219 | 23 Ekim | 16:25 | Fortis FC Limited – Regar-TadAZ | Regar-TadAZ (AWAY) | 1.24 | 3-1 | VAR | `a3cfdb49-2def-4287-a3ae-1cecb07c6ab6` |
| 220 | 23 Ekim | 16:30 | Al Faisaly ( KSA ) – Al Nassr | Al Nassr (AWAY) | 1.27 | 1-3 | VAR | `809a0c85-b421-45ce-a41b-985cff22772e` |
| 221 | 23 Ekim | 17:30 | East Riffa – Al-Muharraq | Al-Muharraq (AWAY) | 1.48 | 0-1 | YOK | `1f408568-8727-47b9-bf94-e24c96b8762f` |
| 222 | 23 Ekim | 17:30 | Petro Luanda – Scottland FC Mabvuku | Petro Luanda (HOME) | 1.15 | 3-0 | YOK | `b567d4f5-bb0f-4d06-8cee-51444b9a748c` |
| 223 | 23 Ekim | 17:35 | Kazma Sc – AL-Salibikhaet | Kazma Sc (HOME) | 1.32 | 2-1 | VAR | `2d678026-e4c6-4a12-be9b-80606ed1b713` |
| 224 | 23 Ekim | 18:00 | Al Aqaba – Al Ahli Amman | Al Ahli Amman (AWAY) | 1.34 | 1-3 | VAR | `149a4224-d82d-4bca-9bf4-fd33d14f2ec5` |
| 225 | 23 Ekim | 18:00 | Al Ittihad Aleppo – Paro FC | Al Ittihad Aleppo (HOME) | 1.48 | 2-1 | VAR | `62c20542-cd95-4f10-ac37-b9cdbeef898c` |
| 226 | 23 Ekim | 18:00 | Hebar – Nesebar | Hebar (HOME) | 1.40 | 2-1 | VAR | `e1dedd74-4f8e-4fad-9d22-c7e76fe59353` |
| 227 | 23 Ekim | 18:00 | Lokomotiv GO – Pirin Blagoevgrad | Lokomotiv GO (HOME) | 1.37 | 2-0 | YOK | `3c818993-a5bb-42fc-8788-04c7b667fc82` |
| 228 | 23 Ekim | 18:50 | Al Seeb – Sohar | Al Seeb (HOME) | 1.41 | 2-0 | YOK | `cafe5f7b-150f-478d-a651-fcd021b40906` |
| 229 | 23 Ekim | 19:00 | KF Gjilani – KF Llapi | KF Gjilani (HOME) | 1.24 | 1-1 | VAR | `ea1fe177-ccf5-4ad4-8f08-1046a0efca49` |
| 230 | 23 Ekim | 19:45 | Al Sailiya – Al Rayyan | Al Rayyan (AWAY) | 1.31 | 1-6 | VAR | `2c505903-dd7d-461c-b621-0e6bb3d136e8` |
| 231 | 23 Ekim | 20:00 | Oddevold – Sundsvall | Oddevold (HOME) | 1.38 | 7-0 | YOK | `e1949694-763b-491f-b514-724d3f7af486` |
| 232 | 23 Ekim | 20:30 | FC Jarfalla – Hammarby TFF | Hammarby TFF (AWAY) | 1.48 | 2-2 | VAR | `008965a6-512f-42b7-a0bc-d2825ff51ab7` |
| 233 | 23 Ekim | 21:00 | Al Ahli – Al-Khaleej Saihat | Al Ahli (HOME) | 1.36 | 4-1 | VAR | `3c73a624-c39d-47d7-b3e0-e2f6ae08034f` |
| 234 | 23 Ekim | 21:15 | Winterthur – Stade Nyonnais | Winterthur (HOME) | 1.25 | 4-0 | YOK | `1651206b-f470-447a-9608-f8a5b28f12dc` |
| 235 | 23 Ekim | 21:30 | Stuttgart – Mgladbach | Stuttgart (HOME) | 1.38 | 2-3 | VAR | `67bec279-b5c7-4443-b639-d073ebe103bf` |
| 236 | 23 Ekim | 22:00 | Shamrock Rovers – Sligo Rovers | Shamrock Rovers (HOME) | 1.17 | 4-0 | YOK | `06ddc554-484c-45a8-8330-775268030dac` |
| 237 | 23 Ekim | 22:05 | Paris St-G (W) – Montpellier (W) | Paris St-G (W) (HOME) | 1.30 | 1-0 | YOK | `c23b9be0-8e77-4a33-ae84-b0f2f42a6ea9` |
| 238 | 24 Ekim | 16:00 | FC Ordabasy – Zhenys | FC Ordabasy (HOME) | 1.24 | 1-1 | VAR | `4a660e31-c339-4736-9cb9-0f8623d0a56b` |
| 239 | 24 Ekim | 16:00 | Hacken – Degerfors | Hacken (HOME) | 1.43 | 4-0 | YOK | `d0ea61cb-f354-4245-8333-b7ad68acaece` |
| 240 | 24 Ekim | 16:30 | RB Leipzig – Elversberg | RB Leipzig (HOME) | 1.46 | 4-0 | YOK | `de6acc4e-2451-4f72-85fe-5e8a1289e87d` |
| 241 | 24 Ekim | 16:30 | Slovan Bratislava – Dukla Banska Bystrica | Slovan Bratislava (HOME) | 1.35 | 2-2 | VAR | `a82437aa-5949-4e8f-adda-9f0d8a54c73d` |
| 242 | 24 Ekim | 17:00 | Arsenal – Everton | Arsenal (HOME) | 1.47 | 2-0 | YOK | `ccff7904-a107-436c-8991-bf7e05bab6ac` |
| 243 | 24 Ekim | 17:00 | Bodo Glimt – Valerenga | Bodo Glimt (HOME) | 1.16 | 0-1 | YOK | `71c4a717-2cd6-43e8-86ce-d5ffa88f40d2` |
| 244 | 24 Ekim | 17:00 | Boreham Wood – AFC Fylde | Boreham Wood (HOME) | 1.44 | 4-0 | YOK | `14e27876-150d-4669-95c6-029ea1e08429` |
| 245 | 24 Ekim | 17:00 | FCI Tallinn – Harju JK Laagri | FCI Tallinn (HOME) | 1.29 | 2-1 | VAR | `9d2383db-8a4b-4ba0-a272-039fab3fe0f5` |
| 246 | 24 Ekim | 17:00 | Hamilton – East Fife | Hamilton (HOME) | 1.32 | 2-1 | VAR | `0658d33e-0eed-47b7-ae26-92e74d4bf381` |
| 247 | 24 Ekim | 17:00 | Livingston – Arbroath | Livingston (HOME) | 1.36 | 1-0 | YOK | `fd8ce8ff-277e-4d12-ad1a-bd6b4018fd31` |
| 248 | 24 Ekim | 17:00 | Rangers – St Johnstone | Rangers (HOME) | 1.23 | 4-0 | YOK | `2072d1e4-9678-4613-9086-27eb0d39ee90` |
| 249 | 24 Ekim | 17:00 | Wolves – Watford | Wolves (HOME) | 1.42 | 1-0 | YOK | `cffcf6e0-7ec2-474a-a5ab-fcec9d28c880` |
| 250 | 24 Ekim | 17:30 | TransINVEST Vilnius – Hegelmann Litauen | TransINVEST Vilnius (HOME) | 1.42 | 2-0 | YOK | `560bbd1a-621a-4e92-8b49-1faf057f188b` |
| 251 | 24 Ekim | 18:30 | Djurgardens – Orgryte | Djurgardens (HOME) | 1.21 | 2-2 | VAR | `8b97197f-9481-4ba0-9c05-57a07f5a72df` |
| 252 | 24 Ekim | 18:45 | Hapoel Jerusalem – Hapoel Tel Aviv | Hapoel Tel Aviv (AWAY) | 1.48 | 0-3 | YOK | `f26dee58-9650-4ff6-ac0d-3bb0b8c9e950` |
| 253 | 24 Ekim | 19:00 | Slavia Prague – Mlada Boleslav | Slavia Prague (HOME) | 1.29 | 1-1 | VAR | `c4f4263c-e0b0-49cb-99e9-4177a147d03c` |
| 254 | 24 Ekim | 19:00 | Sportive De Tunis – Asswehly | Sportive De Tunis (HOME) | 1.17 | 1-0 | YOK | `f9c5965b-ec55-4a2a-a551-a1c840988b13` |
| 255 | 24 Ekim | 19:30 | Girona – Celta Vigo B | Girona (HOME) | 1.36 | 5-1 | VAR | `535e5d7b-906c-4ce1-adda-32b35e785f8a` |
| 256 | 24 Ekim | 19:30 | Maccabi Tel Aviv – Hapoel Haifa | Maccabi Tel Aviv (HOME) | 1.30 | 6-2 | VAR | `f2536733-4c29-4b64-b48d-b917984e96cd` |
| 257 | 24 Ekim | 19:45 | Al-Duhail SC – Lusail | Al-Duhail SC (HOME) | 1.50 | 3-1 | VAR | `c387c195-4935-4a29-ab3d-8fba0a019bb3` |
| 258 | 24 Ekim | 20:00 | AEK Athens – Panaitolikos | AEK Athens (HOME) | 1.15 | 5-0 | YOK | `27164e08-8a34-4c10-b623-cf4a4d1ba5ba` |
| 259 | 24 Ekim | 20:00 | Dunajska Streda – Ruzomberok | Dunajska Streda (HOME) | 1.35 | 5-0 | YOK | `5a9917c8-5953-41f8-8f71-9e0f81f73b5d` |
| 260 | 24 Ekim | 20:00 | Pyramids – El Merriekh Bentiu | Pyramids (HOME) | 1.10 | 4-0 | YOK | `d57d7b13-9c92-42b4-8cfb-794d4202ef20` |
| 261 | 24 Ekim | 20:00 | Zamalek – APR FC | Zamalek (HOME) | 1.27 | 1-0 | YOK | `bb7fab68-c5ce-4bcf-9191-af1364314cf2` |
| 262 | 24 Ekim | 20:30 | Rapid Vienna – SC Austria Lustenau | Rapid Vienna (HOME) | 1.24 | 5-1 | VAR | `dec8e0ba-4c57-4112-a915-d23ff010de53` |
| 263 | 24 Ekim | 20:45 | Sport Huancayo – Alianza Atletico | Sport Huancayo (HOME) | 1.48 | 4-1 | VAR | `7b434417-2dc3-4622-b826-ec18e3552b3a` |
| 264 | 24 Ekim | 22:00 | Atletico Madrid – Deportivo | Atletico Madrid (HOME) | 1.29 | 1-0 | YOK | `0f25d2ea-e877-49a1-95db-84b2745d610d` |
| 265 | 24 Ekim | 22:30 | Gil Vicente – Porto | Porto (AWAY) | 1.49 | 0-1 | YOK | `a269e232-0950-4ae0-a41e-169f2ce47527` |
| 266 | 25 Ekim | 16:00 | Midtjylland – Lyngby | Midtjylland (HOME) | 1.46 | 3-2 | VAR | `3027cca7-9c7c-4448-b0ae-8a2711837760` |
| 267 | 25 Ekim | 16:30 | Haugesund – Hodd | Haugesund (HOME) | 1.23 | 3-2 | VAR | `1abd6501-d92d-427a-a8af-261852ee3f78` |
| 268 | 25 Ekim | 17:00 | Catania – FC Giugliano | Catania (HOME) | 1.41 | 6-0 | YOK | `06a661ae-367c-41db-bd33-b0b78ca9c2d8` |
| 269 | 25 Ekim | 17:00 | Olympiakos – Kalamata | Olympiakos (HOME) | 1.19 | 5-0 | YOK | `c7eec6cf-4e4f-43bf-babc-1b73e72d2b50` |
| 270 | 25 Ekim | 17:00 | Palermo – Carrarese | Palermo (HOME) | 1.48 | 2-1 | VAR | `59e41080-6fc9-45d9-aed6-bc8bc03bcc18` |
| 271 | 25 Ekim | 17:00 | Sparta Prague – Slovacko | Sparta Prague (HOME) | 1.29 | 5-1 | VAR | `b5174a89-5f3b-4c13-baa4-bdac6340bbad` |
| 272 | 25 Ekim | 18:00 | Club Brugge – Sint Truiden | Club Brugge (HOME) | 1.39 | 3-2 | VAR | `45c47926-3faf-415b-88bd-8a8f5dd63055` |
| 273 | 25 Ekim | 18:00 | OFK Beograd – Crvena Zvezda | Crvena Zvezda (AWAY) | 1.34 | 0-1 | YOK | `ab59e3da-bbdd-4e60-a55e-a1cf8918cf13` |
| 274 | 25 Ekim | 18:30 | Mjallby – Hammarby | Hammarby (AWAY) | 1.47 | 0-2 | YOK | `573314ba-1a75-45f8-ab51-bddc4e4a33f4` |
| 275 | 25 Ekim | 18:45 | Sparta Rotterdam – Ajax | Ajax (AWAY) | 1.48 | 1-2 | VAR | `acf5d095-9f37-4773-96b0-31aa70b5a0f3` |
| 276 | 25 Ekim | 19:00 | APOEL – Omonia 29th May | APOEL (HOME) | 1.29 | 4-1 | VAR | `a76dcbed-c364-49e5-9388-56b5205fa64c` |
| 277 | 25 Ekim | 19:00 | NFC Volos – Panathinaikos | Panathinaikos (AWAY) | 1.33 | 0-1 | YOK | `a9063dee-9860-4890-928f-f1f69fc00df7` |
| 278 | 25 Ekim | 19:00 | SK Super Nova – Rigas Futbola Skola | Rigas Futbola Skola (AWAY) | 1.19 | 0-3 | YOK | `ad5769e1-7057-4963-9c96-478c089ff4c8` |
| 279 | 25 Ekim | 20:00 | Ferencvaros – MTK Budapest | Ferencvaros (HOME) | 1.44 | 5-0 | YOK | `a697ecf6-0d52-4c59-a6e3-d4e7d339a131` |
| 280 | 25 Ekim | 20:00 | Osijek – Rudes | Osijek (HOME) | 1.49 | 0-1 | YOK | `09782e26-89e2-465d-9a53-e857935329b2` |
| 281 | 25 Ekim | 21:15 | Molde – Fredrikstad | Molde (HOME) | 1.44 | 5-1 | VAR | `74d5470d-d98c-4aba-b440-d32b42dc7b48` |
| 282 | 25 Ekim | 21:15 | Union St Gilloise – Cercle Brugge | Union St Gilloise (HOME) | 1.35 | 5-2 | VAR | `59b3906f-c2d9-491c-b386-c8f78e3f727b` |
| 283 | 25 Ekim | 22:00 | Always Ready – CDT Real Oruro | Always Ready (HOME) | 1.18 | 5-1 | VAR | `c7a9c32c-6ae2-4e3b-b93f-17a1d7c6ae69` |
| 284 | 25 Ekim | 23:00 | CD Maipu – CA Guemes | CD Maipu (HOME) | 1.25 | 3-1 | VAR | `19ebfd47-74eb-42f0-820d-99795f234a32` |
| 285 | 25 Ekim | 23:00 | Humble Lions – Racing United FC | Racing United FC (AWAY) | 1.40 | 1-2 | VAR | `585c72ca-fc94-456d-86f4-2adc61f58477` |
| 286 | 25 Ekim | 23:30 | Sporting Lisbon – Academico de Viseu | Sporting Lisbon (HOME) | 1.23 | 1-2 | VAR | `62a6d161-9dac-49ad-90bc-bb1787eb4732` |

## Kontrol için veri noktaları
Yalnız `research_archive.fixtures`, `public.moneyway_snapshots`, `research_archive.results` Supabase READ ONLY. Her maç UID/FT/T-6 price yukarıdadır. Sources hem SXF orijinal feed hem SXF sonuç arşividir. Oranları oynanabilir bahis şirketi fiyatı veya KG VAR piyasası olarak yorumlama.

**Araştırma statüsü:** 1.01–1.50 FAVORITES COMPLETED / other bands 1.50–2.00 and 2.00–2.50 NOT YET CALCULATED.
