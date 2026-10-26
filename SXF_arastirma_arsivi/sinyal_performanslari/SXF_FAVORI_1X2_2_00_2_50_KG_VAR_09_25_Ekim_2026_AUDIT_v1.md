# SXF 1X2 Favori 2,00 üzeri–2,50 KG VAR gerçekleşme araştırması (9–25 Ekim 2026)

**Rapor:** 2026-10-27. **Kaynak:** sadece SmartXFlow 1X2 oran geçmişi ve SXF araştırma arşivi FT maç sonuçları. Tarihsel gözlem; BTTS bahis sinyali veya canlı motor kuralı değildir.

## Kohort ve karar anı
- Süre: 9–25 Ekim 2026, her gün **16:00 ≤ TSİ kickoff <24:00**, İstanbul/TSİ (UTC+3).
- Oran `public.moneyway_snapshots`: fixture'nin kendi `kickoff_utc - interval '6h'` anındaki en son **öncesi** 1X2 snapshot; 1/X/2 aynı kaynak zamanında tam; 0–10 dakika geçmiş; tüm ondalık fiyatlar >1.
- Takım favorisi `least(odds_home,odds_away) < odds_draw` ve home/away fiyatları birbirine eşit değil; oran aralığı **`2.00 < least(odds_home,odds_away) <= 2.50`**.
- Maç sonuçları `research_archive.results` içinde `match_id_hash` + aynı home ve away + FT + tam `[0-9]+-[0-9]+` skor. Farklı/eksik sonuçlar paydadan çıkarılır. **FT KG VAR** her iki takımdan en az bir gol; aksi KG YOK.
- SXF favori fiyatı **KG VAR odds'u değildir**. BTTS piyasası bu soruda karar değişkeni olarak kullanılmadı.
- T-6 sonrası oran/para/final sonuç sinyal hesabına asla girmez; skor yalnız gerçekleşme etiketidir.

## Ana sonuç
**541 uygun T-6 favori oranı**, bunların **539** tanesinde FT doğrulanmış; **302 KG VAR / 237 KG YOK** = **56.03%**.
FT bulunamayanlar: Juan Pablo II College – Sport Boys (Per) (2026-10-17 20:00 UTC); Independiente Rivadavia – Tigre (2026-10-17 20:30 UTC).

Aynı 17 gün ve aynı SXF kalite/AS_OF kurallarıyla önceki iki çalışma:
| Favori SXF T-6 1X2 oranı | Doğrulanmış maç | KG VAR | KG YOK | KG VAR sıklığı |
|---|---:|---:|---:|---:|
| [1.01,1.50] | 286 | 150 | 136 | 52,45% |
| (1.50,2.00] | 568 | 311 | 257 | 54,75% |
| **(2.00,2.50]** | **539** | **302** | **237** | **56,03%** |
| **Birleşik** | **1393** | **763** | **630** | **54,77%** |

2,00 fiyatı önceki banda dahil; iki defa sayılmaması için bu ana bantta >2,00 şartı korunur.

## Günlük dağılım
| Gün (TSİ) | Maç | KG VAR | KG YOK | % |
|---|---:|---:|---:|---:|
| 2026-10-09 | 33 | 15 | 18 | 45.45% |
| 2026-10-10 | 75 | 41 | 34 | 54.67% |
| 2026-10-11 | 46 | 25 | 21 | 54.35% |
| 2026-10-12 | 0 | 0 | 0 | — |
| 2026-10-13 | 2 | 2 | 0 | 100.00% |
| 2026-10-14 | 25 | 13 | 12 | 52.00% |
| 2026-10-15 | 18 | 10 | 8 | 55.56% |
| 2026-10-16 | 38 | 23 | 15 | 60.53% |
| 2026-10-17 | 45 | 24 | 21 | 53.33% |
| 2026-10-18 | 44 | 29 | 15 | 65.91% |
| 2026-10-19 | 19 | 9 | 10 | 47.37% |
| 2026-10-20 | 17 | 10 | 7 | 58.82% |
| 2026-10-21 | 12 | 7 | 5 | 58.33% |
| 2026-10-22 | 20 | 12 | 8 | 60.00% |
| 2026-10-23 | 28 | 21 | 7 | 75.00% |
| 2026-10-24 | 69 | 34 | 35 | 49.28% |
| 2026-10-25 | 48 | 27 | 21 | 56.25% |
| **TOPLAM** | **539** | **302** | **237** | **56.03%** |

**12 Ekim eksik veri:** Önceki 1.01–1.50 araştırmasındaki kaynağa göre 109 maçta T-6 snapshotları hiç gerekli güncellik aralığında değildi. Bu gündeki 0 "maç yok" anlamına gelmez. 13 Ekim n=2, oran %100 tek günde anlamsız örneklem.

## Fiyatın onluk alt bantları
| SXF oranı | Maç | KG VAR | KG YOK | % |
|---|---:|---:|---:|---:|
| 2.01–2.10 | 106 | 63 | 43 | 59.43% |
| 2.11–2.20 | 118 | 68 | 50 | 57.63% |
| 2.21–2.30 | 102 | 42 | 60 | 41.18% |
| 2.31–2.40 | 112 | 65 | 47 | 58.04% |
| 2.41–2.50 | 101 | 64 | 37 | 63.37% |
| **TOPLAM** | **539** | **302** | **237** | **56.03%** |

## HOME/AWAY favorisi
| Favori | Maç | KG VAR | KG YOK | % |
|---|---:|---:|---:|---:|
| HOME | 337 | 187 | 150 | 55.49% |
| AWAY | 202 | 115 | 87 | 56.93% |

## Eğer 2.00 başlangıcı DAHİL istenirse
Önceki 1.50–2.00 arşivinde **tam 2.00 SXF favori fiyatlı 21 maç**, **9 KG VAR**, **12 KG YOK**. İki uç dahil `2.00 <= favorite odds <= 2.50` için **560 maç**, **311 KG VAR**, **249 KG YOK**, oran **55.54%**. Bu, çakışmasız ana üçlü tabloya eklenmez.
| Tarih | Maç | Favori | Oran | FT | KG |
|---|---|---|---:|---|---|
| 2026-10-09 | Be1 NFA – FK Dainava Alytus | Be1 NFA (HOME) | 2.00 | 2-2 | VAR |
| 2026-10-09 | Brann – Viking | Viking (AWAY) | 2.00 | 0-2 | YOK |
| 2026-10-09 | Jong AZ Alkmaar – Den Bosch | Jong AZ Alkmaar (HOME) | 2.00 | 0-1 | YOK |
| 2026-10-10 | AIK – Brommapojkarna | AIK (HOME) | 2.00 | 5-6 | VAR |
| 2026-10-10 | East Kilbride – Airdrieonians | East Kilbride (HOME) | 2.00 | 2-2 | VAR |
| 2026-10-10 | Peterhead – Queen of South | Peterhead (HOME) | 2.00 | 0-1 | YOK |
| 2026-10-10 | Tranmere – Rochdale | Tranmere (HOME) | 2.00 | 1-1 | VAR |
| 2026-10-10 | Istanbulspor – Erokspor A.S | Erokspor A.S (AWAY) | 2.00 | 0-1 | YOK |
| 2026-10-11 | Al Sahel – Al Fahaheel FC | Al Fahaheel FC (AWAY) | 2.00 | 0-4 | YOK |
| 2026-10-11 | Leiria – Academica | Leiria (HOME) | 2.00 | 0-2 | YOK |
| 2026-10-15 | Ferencvaros – Plzen | Ferencvaros (HOME) | 2.00 | 2-1 | VAR |
| 2026-10-17 | Leicester – Doncaster | Leicester (HOME) | 2.00 | 2-1 | VAR |
| 2026-10-19 | FK Suduva – FK Kauno Zalgiris | FK Kauno Zalgiris (AWAY) | 2.00 | 0-1 | YOK |
| 2026-10-20 | Oxford Utd – Wigan | Oxford Utd (HOME) | 2.00 | 2-1 | VAR |
| 2026-10-20 | Independiente Yumbo – Boca Juniors de Cali | Independiente Yumbo (HOME) | 2.00 | 3-0 | YOK |
| 2026-10-21 | CA Lanus (Res) – Quilmes (Res) | CA Lanus (Res) (HOME) | 2.00 | 4-1 | VAR |
| 2026-10-23 | JS Omrane – Olympique De Beja | JS Omrane (HOME) | 2.00 | 0-0 | YOK |
| 2026-10-23 | Istiqlol – Homs Al Fidaa SC | Istiqlol (HOME) | 2.00 | 0-2 | YOK |
| 2026-10-23 | ASD Pineto Calcio – Gubbio | ASD Pineto Calcio (HOME) | 2.00 | 1-0 | YOK |
| 2026-10-24 | US Cremonese – Juve Stabia | US Cremonese (HOME) | 2.00 | 0-1 | YOK |
| 2026-10-25 | Sabadell – Tenerife | Sabadell (HOME) | 2.00 | 1-1 | VAR |

## 539 tekil maç — tam denetim listesi
| # | Tarih | TSİ | Maç | Favori | SXF 1X2 favori fiyatı T-6 | FT | KG | UID |
|---|---|---|---|---|---:|---|---|---|
| 1 | 2026-10-09 | 16:30 | BTS Rekord B-B – Sandecja Nowy Sacz | Sandecja Nowy Sacz (AWAY) | 2.30 | 1-1 | VAR | `20096471-a8b3-4adf-8ce1-b5321bd68fcb` |
| 2 | 2026-10-09 | 17:00 | Usm Annaba – US Chaouia | Usm Annaba (HOME) | 2.10 | 3-0 | YOK | `427f6fc6-e631-4d27-88ad-2220fedf1832` |
| 3 | 2026-10-09 | 18:00 | FK Siauliai II – FK Kauno Zalgiris 2 | FK Siauliai II (HOME) | 2.12 | 3-3 | VAR | `95d81c56-7e44-4ee1-a994-33aa93093c33` |
| 4 | 2026-10-09 | 18:00 | Slavia Praha B – FC Sellier & Bellot Vlasim | Slavia Praha B (HOME) | 2.32 | 0-2 | YOK | `bcfafd8c-dcdc-483c-a306-0720994ce1fc` |
| 5 | 2026-10-09 | 18:45 | Al Sharjah – Al Jazira | Al Jazira (AWAY) | 2.06 | 0-0 | YOK | `fbdd9498-948a-4a3a-af15-959b888fcbe0` |
| 6 | 2026-10-09 | 19:00 | Al Khalidiyah – Al-Muharraq | Al Khalidiyah (HOME) | 2.46 | 2-2 | VAR | `2e5b5aa7-193d-441a-83b5-08221704c487` |
| 7 | 2026-10-09 | 19:00 | Chojniczanka Chojnice – NKP Podhale Nowy Targ | NKP Podhale Nowy Targ (AWAY) | 2.46 | 2-2 | VAR | `7b8566e9-f575-4d02-9569-e68fb8fa62e1` |
| 8 | 2026-10-09 | 19:00 | FK Velez Mostar – Siroki Brijeg | FK Velez Mostar (HOME) | 2.08 | 0-0 | YOK | `de481d16-64a1-4949-9aba-1dcae5925fd6` |
| 9 | 2026-10-09 | 19:00 | Klubi-04 – EIF | Klubi-04 (HOME) | 2.20 | 7-0 | YOK | `3b0c53b2-126d-465c-89aa-bfccedafdc8e` |
| 10 | 2026-10-09 | 19:00 | Turkey (W) – Slovenia (W) | Slovenia (W) (AWAY) | 2.44 | 3-3 | VAR | `001b2ff1-6c5c-4da9-a0b1-39ff52be7692` |
| 11 | 2026-10-09 | 19:00 | Usti Nad Labem – SFC Opava | Usti Nad Labem (HOME) | 2.04 | 2-3 | VAR | `192b1c88-a66b-4f52-b383-0cc6d18cd182` |
| 12 | 2026-10-09 | 19:00 | Wieczysta Krakow – Wisla Plock | Wieczysta Krakow (HOME) | 2.30 | 3-0 | YOK | `e9fb538f-70d0-4ef8-b95a-f9b1074bca3f` |
| 13 | 2026-10-09 | 19:30 | JK Welco Elekter – FC Elva | JK Welco Elekter (HOME) | 2.04 | 4-0 | YOK | `64e21163-fd0e-4421-9d41-00d560bfff9a` |
| 14 | 2026-10-09 | 19:30 | SKU Amstetten – FC Blau Weiss Linz | FC Blau Weiss Linz (AWAY) | 2.26 | 1-1 | VAR | `c2972de7-2129-49d1-a676-7998f0706ce3` |
| 15 | 2026-10-09 | 20:00 | AB – Aarhus Fremad | AB (HOME) | 2.20 | 2-0 | YOK | `f11bfd68-30f7-4d5f-b65e-28cd2f8c965e` |
| 16 | 2026-10-09 | 20:00 | Etar – FC Fratria | FC Fratria (AWAY) | 2.28 | 2-0 | YOK | `e4a9cdb7-a2d1-40c7-9c04-5bb9be2e8db0` |
| 17 | 2026-10-09 | 20:00 | Preussen Munster – Rot-Weiss Essen | Rot-Weiss Essen (AWAY) | 2.14 | 3-3 | VAR | `ac5746fd-92e3-4d44-909c-f76fc2cc5607` |
| 18 | 2026-10-09 | 20:00 | Van Buyuksehir Belediyespor – Bandirmaspor | Bandirmaspor (AWAY) | 2.34 | 0-2 | YOK | `09e76a99-39d2-4973-a937-cb3a176b72e3` |
| 19 | 2026-10-09 | 20:30 | Neuchatel Xamax – Winterthur | Winterthur (AWAY) | 2.18 | 3-0 | YOK | `54d16cfb-e869-47ee-944c-bd939e90a7a3` |
| 20 | 2026-10-09 | 20:45 | Moreirense – Gil Vicente | Gil Vicente (AWAY) | 2.40 | 0-1 | YOK | `41c48699-68a6-41ec-9c98-5054e3097101` |
| 21 | 2026-10-09 | 21:00 | Dunkerque – Annecy | Dunkerque (HOME) | 2.38 | 0-1 | YOK | `cbca34d1-8778-4e9b-b43b-b65cefce9189` |
| 22 | 2026-10-09 | 21:00 | FC Dordrecht – Emmen | Emmen (AWAY) | 2.26 | 0-3 | YOK | `ef0f16fe-213c-40a0-ab1f-677475aebd54` |
| 23 | 2026-10-09 | 21:00 | FC Oss – Helmond Sport | FC Oss (HOME) | 2.32 | 3-1 | VAR | `1c79e11b-0f06-4d96-9712-85287c31ab12` |
| 24 | 2026-10-09 | 21:00 | FC Volendam – Vitesse Arnhem | FC Volendam (HOME) | 2.50 | 2-0 | YOK | `c4f986f2-4dc1-47ac-9a6e-429e2a287b0b` |
| 25 | 2026-10-09 | 21:00 | Jong Ajax Amsterdam – VVV Venlo | VVV Venlo (AWAY) | 2.30 | 0-3 | YOK | `2a5f7a73-4167-4b93-8cbd-46d7954a1c05` |
| 26 | 2026-10-09 | 21:00 | Mosta – Birzebbuga St Peters | Birzebbuga St Peters (AWAY) | 2.26 | 2-2 | VAR | `8a445859-2647-4111-bb46-20a270605049` |
| 27 | 2026-10-09 | 21:00 | Nancy – Guingamp | Nancy (HOME) | 2.02 | 1-0 | YOK | `f293234d-523a-4b15-8bb7-60efecda6997` |
| 28 | 2026-10-09 | 21:00 | Pau – Laval | Pau (HOME) | 2.16 | 3-2 | VAR | `b1cc5b4d-756d-4671-81fb-ef09d1fb57c6` |
| 29 | 2026-10-09 | 21:30 | First Vienna Fc 1894 – St Polten | First Vienna Fc 1894 (HOME) | 2.08 | 3-1 | VAR | `c8b86669-f9c3-4272-b3de-84c1ca3fe4d2` |
| 30 | 2026-10-09 | 21:30 | Rakow Czestochowa – GKS Katowice | Rakow Czestochowa (HOME) | 2.30 | 1-4 | VAR | `f9e80981-ab2a-4ad5-b815-bb6819598392` |
| 31 | 2026-10-09 | 22:15 | Braga – Sporting Lisbon | Sporting Lisbon (AWAY) | 2.48 | 1-3 | VAR | `711d3d7e-564a-4413-a465-2518dcef8104` |
| 32 | 2026-10-09 | 23:00 | Moghreb Tetouan – FUS Rabat | FUS Rabat (AWAY) | 2.42 | 0-0 | YOK | `e9b95dcd-de26-4ec5-8b91-b4261ca045c8` |
| 33 | 2026-10-09 | 23:30 | Delfin – Mushuc Runa | Delfin (HOME) | 2.46 | 3-2 | VAR | `c011084e-d962-4a81-b2cf-9f3b8d026046` |
| 34 | 2026-10-10 | 16:00 | Alanyaspor – Erzurum BB | Alanyaspor (HOME) | 2.04 | 0-0 | YOK | `a44d2aa6-9dd9-4d5f-933f-1c3cbddfbc34` |
| 35 | 2026-10-10 | 16:00 | Benevento – Cesena | Benevento (HOME) | 2.08 | 2-0 | YOK | `e0c397b8-c5ff-4554-8d1d-cc8883a06fc0` |
| 36 | 2026-10-10 | 16:00 | Empoli – Palermo | Palermo (AWAY) | 2.04 | 2-4 | VAR | `938d5fb5-6fe7-4350-906b-4c35652ba937` |
| 37 | 2026-10-10 | 16:00 | Entella – Juve Stabia | Entella (HOME) | 2.10 | 1-1 | VAR | `3960ece7-4097-4a86-b533-c0ce7c27cecd` |
| 38 | 2026-10-10 | 16:00 | Genoa – Fiorentina | Fiorentina (AWAY) | 2.40 | 2-1 | VAR | `8e533f1b-1db7-4271-9acc-cdab84c88c06` |
| 39 | 2026-10-10 | 16:00 | Hajduk Split – Dinamo Zagreb | Dinamo Zagreb (AWAY) | 2.28 | 2-1 | VAR | `da41030c-084c-4832-84e8-e28be690500c` |
| 40 | 2026-10-10 | 16:00 | Ostersunds FK – Varbergs BoIS | Ostersunds FK (HOME) | 2.16 | 0-0 | YOK | `bc58f6db-d6e2-4cb7-93ba-509b2ba3d523` |
| 41 | 2026-10-10 | 16:00 | Samsunspor – Trabzonspor | Trabzonspor (AWAY) | 2.08 | 0-3 | YOK | `106b363b-218f-48ca-af77-e4aa618e3c63` |
| 42 | 2026-10-10 | 16:30 | Arka Gdynia – Polonia Warszawa | Arka Gdynia (HOME) | 2.28 | 1-2 | VAR | `5a08a391-310e-4298-923e-5535519ddcd7` |
| 43 | 2026-10-10 | 16:30 | Ben Guerdane – Club Africain | Club Africain (AWAY) | 2.08 | 2-1 | VAR | `19c77c5a-f2c3-46d1-8c2b-1d753818d8db` |
| 44 | 2026-10-10 | 16:30 | Birkirkara – Valletta | Valletta (AWAY) | 2.48 | 0-2 | YOK | `52be44e8-e604-45fc-8c3c-1451bb5d221d` |
| 45 | 2026-10-10 | 16:30 | Chrobry Glogow – Pogon Grodzisk Mazowiecki | Chrobry Glogow (HOME) | 2.24 | 0-4 | YOK | `78c5cd51-e676-404e-baa0-ca2f146c5f9c` |
| 46 | 2026-10-10 | 16:30 | FC Liefering – SK Sturm Graz II | FC Liefering (HOME) | 2.30 | 3-1 | VAR | `8c755895-91c3-4ec3-913d-dec6117ab5eb` |
| 47 | 2026-10-10 | 16:30 | Mainz – Leverkusen | Leverkusen (AWAY) | 2.26 | 3-4 | VAR | `e3f448c3-53ae-4492-a252-abec10132aa7` |
| 48 | 2026-10-10 | 16:30 | Rapid Vienna (Am) – FC Wacker Innsbruck | FC Wacker Innsbruck (AWAY) | 2.14 | 1-2 | VAR | `162a9865-d389-4907-8d5b-1d70e97a8989` |
| 49 | 2026-10-10 | 16:30 | Trencin – Dukla Banska Bystrica | Trencin (HOME) | 2.06 | 0-1 | YOK | `9148a4ab-7f6b-4ea2-b5a1-1d457436c7c0` |
| 50 | 2026-10-10 | 16:30 | WSC Hertha Wels – Bregenz | Bregenz (AWAY) | 2.38 | 1-0 | YOK | `c5d1eb57-0907-427e-b514-cc3e39b19509` |
| 51 | 2026-10-10 | 17:00 | Annan – Stranraer | Stranraer (AWAY) | 2.36 | 1-6 | VAR | `95b70980-e3a9-45c5-bf6b-5d236dc34d42` |
| 52 | 2026-10-10 | 17:00 | Ayr – Dunfermline | Dunfermline (AWAY) | 2.30 | 1-1 | VAR | `f3666317-e09b-4143-b8a0-a586b0b0164f` |
| 53 | 2026-10-10 | 17:00 | Blackburn – Cardiff | Cardiff (AWAY) | 2.42 | 2-1 | VAR | `c29f1473-d471-4c58-8880-a578034de77b` |
| 54 | 2026-10-10 | 17:00 | Bristol Rovers – Barnet | Bristol Rovers (HOME) | 2.48 | 1-3 | VAR | `5c5cfbfe-b6ee-41bd-b31a-7e1e00d5c843` |
| 55 | 2026-10-10 | 17:00 | Cambridge Utd – Blackpool | Cambridge Utd (HOME) | 2.08 | 1-0 | YOK | `c448f0a5-a262-4cdf-9995-4758b8f9e27a` |
| 56 | 2026-10-10 | 17:00 | Chorley – AFC Telford | Chorley (HOME) | 2.48 | 2-1 | VAR | `09c4a6bb-8484-458b-95b5-41ed90def53d` |
| 57 | 2026-10-10 | 17:00 | Cove Rangers – East Fife | Cove Rangers (HOME) | 2.24 | 1-1 | VAR | `8ccaee10-514b-4b06-8c37-0eacecc5fb4b` |
| 58 | 2026-10-10 | 17:00 | Derby – Wrexham | Wrexham (AWAY) | 2.50 | 1-1 | VAR | `c7e0d0f8-e604-4a22-b280-f99a9dd8634b` |
| 59 | 2026-10-10 | 17:00 | Falkirk – Dundee | Falkirk (HOME) | 2.12 | 1-2 | VAR | `5622890d-86e3-4297-ac79-549da07efc88` |
| 60 | 2026-10-10 | 17:00 | Forfar – Elgin City FC | Elgin City FC (AWAY) | 2.04 | 1-2 | VAR | `5df13b1e-369c-4e62-88c9-e9b69cd8b06d` |
| 61 | 2026-10-10 | 17:00 | Hornchurch – Eastleigh | Hornchurch (HOME) | 2.18 | 2-0 | YOK | `ad2b2c5f-4db2-4219-998c-977e317d286c` |
| 62 | 2026-10-10 | 17:00 | Middlesbrough – Wolves | Middlesbrough (HOME) | 2.20 | 1-0 | YOK | `a80c20d9-7365-458f-98d3-c2cc3cd570a1` |
| 63 | 2026-10-10 | 17:00 | Preston – Millwall | Millwall (AWAY) | 2.48 | 0-1 | YOK | `62a11a5d-f710-4d74-ae93-c76a20b14d60` |
| 64 | 2026-10-10 | 17:00 | Rotherham – Gillingham | Rotherham (HOME) | 2.12 | 1-4 | VAR | `39133c02-c55b-4e74-88ac-94862ecaf942` |
| 65 | 2026-10-10 | 17:00 | Sheff Utd – Lincoln | Sheff Utd (HOME) | 2.28 | 3-0 | YOK | `b02f9b1a-d193-482c-9c28-d26f406799fb` |
| 66 | 2026-10-10 | 17:00 | Shrewsbury – Exeter | Shrewsbury (HOME) | 2.24 | 0-1 | YOK | `f3383c4e-2ddc-4124-bc9f-e41a48569a14` |
| 67 | 2026-10-10 | 17:00 | Stevenage – Wigan | Stevenage (HOME) | 2.18 | 1-0 | YOK | `21f2935a-2ed3-47b6-8d8d-6bd9b6e9f0c5` |
| 68 | 2026-10-10 | 17:00 | Stirling – Kelty Hearts | Stirling (HOME) | 2.36 | 2-1 | VAR | `938afc15-d4b4-4cde-a992-aeb2674dbfcd` |
| 69 | 2026-10-10 | 17:00 | Sunderland – Brighton | Brighton (AWAY) | 2.40 | 0-2 | YOK | `e612cac7-c663-4291-8cca-2580f6df7933` |
| 70 | 2026-10-10 | 17:00 | Thor – IBV | IBV (AWAY) | 2.40 | 1-0 | YOK | `fa4ab6af-35f6-4ac8-a38e-f2cca7ac8df1` |
| 71 | 2026-10-10 | 17:00 | TPS – Jaro | TPS (HOME) | 2.22 | 0-1 | YOK | `1c5e757a-36a0-48dc-bf24-23efb6a15062` |
| 72 | 2026-10-10 | 17:00 | Valur – Hafnarfjordur | Valur (HOME) | 2.24 | 3-5 | VAR | `1be2f5f9-abdb-433a-8d8f-01b7abf11faa` |
| 73 | 2026-10-10 | 17:00 | Wealdstone – Yeovil | Yeovil (AWAY) | 2.34 | 0-6 | YOK | `a8b893cf-f001-4990-949b-e08faabbfcc0` |
| 74 | 2026-10-10 | 17:00 | Woking – Harrogate Town | Harrogate Town (AWAY) | 2.28 | 0-1 | YOK | `486fed57-b616-4efb-bc02-3b4e5ec8b665` |
| 75 | 2026-10-10 | 17:15 | AD Ceuta FC – Sabadell | Sabadell (AWAY) | 2.44 | 1-2 | VAR | `b0e93b66-21df-4b5a-b9c8-1ba611130ba9` |
| 76 | 2026-10-10 | 17:30 | Lokomotiv Sofia – Lokomotiv Plovdiv | Lokomotiv Sofia (HOME) | 2.22 | 1-1 | VAR | `306f4453-704d-4db6-a35b-4b8b4ebcab52` |
| 77 | 2026-10-10 | 17:45 | Al Shahaniya – Lusail | Al Shahaniya (HOME) | 2.32 | 1-0 | YOK | `5ac7ce76-5cda-4814-820a-bf0286c26850` |
| 78 | 2026-10-10 | 17:55 | Al-Ettifaq – Al-Khaleej Saihat | Al-Ettifaq (HOME) | 2.22 | 1-1 | VAR | `02e5cd7a-f2c0-443b-b06d-8a71e5ee2da8` |
| 79 | 2026-10-10 | 18:00 | Norrby IF – Osters | Norrby IF (HOME) | 2.10 | 2-0 | YOK | `dba9201d-cd39-4b72-9ed6-ac2f02f26261` |
| 80 | 2026-10-10 | 18:30 | ASD Pineto Calcio – Reggiana | Reggiana (AWAY) | 2.24 | 2-0 | YOK | `b6f7e061-dc5f-46e7-bf46-6b46b47fb67a` |
| 81 | 2026-10-10 | 18:30 | Desenzano Calvina – SSD Dolomiti Bellunesi | Desenzano Calvina (HOME) | 2.22 | 2-0 | YOK | `17769f94-fd32-4b44-9db0-f859b5067efe` |
| 82 | 2026-10-10 | 18:30 | Lumezzane – Albinoleffe | Lumezzane (HOME) | 2.40 | 3-2 | VAR | `f3a95500-ef5f-4432-9862-387adc4c888c` |
| 83 | 2026-10-10 | 19:00 | Bohemians 1905 – Banik Ostrava | Bohemians 1905 (HOME) | 2.26 | 1-0 | YOK | `e68e7aaf-e90d-4a55-99d4-b8d0bd191e1c` |
| 84 | 2026-10-10 | 19:00 | Hapoel Haifa – Maccabi Petach Tikva | Hapoel Haifa (HOME) | 2.02 | 2-1 | VAR | `bc704af7-6ad9-4dd9-a70d-5eedb3b1dd75` |
| 85 | 2026-10-10 | 19:00 | IFK Mariehamn – Ilves | Ilves (AWAY) | 2.38 | 1-1 | VAR | `384a3aa6-8266-410a-b34b-93af201217c5` |
| 86 | 2026-10-10 | 19:00 | Manama Club – Al Ahli (BRN) | Al Ahli (BRN) (AWAY) | 2.08 | 1-3 | VAR | `cc75013c-5db4-4b4e-9a86-908e03973657` |
| 87 | 2026-10-10 | 19:00 | Osijek – NK Istra | Osijek (HOME) | 2.06 | 1-3 | VAR | `dce7326f-068a-47c2-a710-fee8de2ff1e9` |
| 88 | 2026-10-10 | 19:00 | Servette – Sion | Sion (AWAY) | 2.22 | 3-0 | YOK | `7e4cc17f-4e65-4649-91ef-808978e8c14f` |
| 89 | 2026-10-10 | 19:30 | Eldense – Cordoba | Eldense (HOME) | 2.30 | 2-1 | VAR | `bfedb220-0391-40ef-8f42-b572123ddd11` |
| 90 | 2026-10-10 | 19:45 | UD Ourense – Barakaldo | Barakaldo (AWAY) | 2.20 | 1-0 | YOK | `427baa55-4a37-4997-a430-f3f4196d6c62` |
| 91 | 2026-10-10 | 20:00 | Toronto FC – CF Montreal | Toronto FC (HOME) | 2.08 | 2-1 | VAR | `f8b81948-3aaa-4591-8a24-15e9ebb1105e` |
| 92 | 2026-10-10 | 20:30 | Arezzo – US Cremonese | US Cremonese (AWAY) | 2.34 | 0-0 | YOK | `4e3a63e2-4ce0-4e97-a3a5-02a63ca6790b` |
| 93 | 2026-10-10 | 20:30 | Austria Wien – Sturm Graz | Sturm Graz (AWAY) | 2.24 | 0-2 | YOK | `ece8108b-39fe-4281-aa6d-1ab1c1987c4f` |
| 94 | 2026-10-10 | 20:30 | Santiago Wanderers – Curico Unido | Santiago Wanderers (HOME) | 2.06 | 1-2 | VAR | `f6c6e6b1-3086-472d-9add-bcf6909c45ed` |
| 95 | 2026-10-10 | 21:00 | Cobresal – Univ de Concepcion | Cobresal (HOME) | 2.10 | 1-1 | VAR | `67178977-1def-4693-bf97-adbe66357711` |
| 96 | 2026-10-10 | 21:00 | Wanderers (Uru) – Boston River | Wanderers (Uru) (HOME) | 2.36 | 1-3 | VAR | `fec91ea8-a4e0-46bf-b905-f7422657f448` |
| 97 | 2026-10-10 | 21:30 | Chicago Fire – New York City | Chicago Fire (HOME) | 2.04 | 2-1 | VAR | `8a560b42-26cd-45ad-a430-d66bd8f446dd` |
| 98 | 2026-10-10 | 21:45 | Brest – Angers | Brest (HOME) | 2.02 | 5-1 | VAR | `4dd64c78-e0a0-4ca8-85a6-bcd3843d5df3` |
| 99 | 2026-10-10 | 21:45 | Lorient – Paris FC | Paris FC (AWAY) | 2.16 | 1-0 | YOK | `ae1a549e-4291-4e21-bad2-b689bbe3a560` |
| 100 | 2026-10-10 | 22:00 | Cerrito – Tacuarembo | Cerrito (HOME) | 2.02 | 2-1 | VAR | `05c1ed92-e401-4488-8c5a-01f005213486` |
| 101 | 2026-10-10 | 22:00 | Manta FC – Tecnico Universitario | Manta FC (HOME) | 2.24 | 1-0 | YOK | `609a9d23-47dd-43dd-bb19-69690cc78481` |
| 102 | 2026-10-10 | 22:15 | Fram – KR Reykjavik | Fram (HOME) | 2.26 | 1-2 | VAR | `38c9bf60-7cce-43b9-9d44-2c780250ccdc` |
| 103 | 2026-10-10 | 22:30 | Academico de Viseu – Estoril Praia | Academico de Viseu (HOME) | 2.38 | 2-1 | VAR | `57aded8f-14a3-4ddf-a308-7c2adee400b9` |
| 104 | 2026-10-10 | 22:30 | Casa Pia – Santa Clara | Santa Clara (AWAY) | 2.20 | 0-1 | YOK | `9b332d82-c9dc-49e2-bfa8-50160e294375` |
| 105 | 2026-10-10 | 22:30 | Vizela – Sporting Lisbon B | Vizela (HOME) | 2.18 | 0-2 | YOK | `605566dc-95b3-418b-be3c-f7962decfb61` |
| 106 | 2026-10-10 | 23:00 | Botafogo PB – Santa Cruz PE | Botafogo PB (HOME) | 2.24 | 1-0 | YOK | `8a33cd66-d366-49a5-b1d2-ff857e2f07c5` |
| 107 | 2026-10-10 | 23:00 | FC Supra du Quebec – Vancouver FC | FC Supra du Quebec (HOME) | 2.08 | 2-2 | VAR | `6cca36cc-1355-476b-98b3-7fdcd9463caf` |
| 108 | 2026-10-10 | 23:30 | Deportes Temuco – Club Deportes Santa Cruz | Deportes Temuco (HOME) | 2.02 | 2-1 | VAR | `af5f04c1-fba8-425d-8c4d-a9b21782a793` |
| 109 | 2026-10-11 | 16:00 | Aberdeen – St Johnstone | Aberdeen (HOME) | 2.16 | 0-1 | YOK | `0695e44f-3047-480f-ba6e-9872ae00c43c` |
| 110 | 2026-10-11 | 16:00 | Catanzaro – Mantova | Catanzaro (HOME) | 2.44 | 1-3 | VAR | `178fcc3e-a83f-4df1-8aef-921af10de61d` |
| 111 | 2026-10-11 | 16:00 | Hull – Everton | Everton (AWAY) | 2.16 | 2-2 | VAR | `0baecd1f-4ee7-4838-8fc6-bcfe48bec7ee` |
| 112 | 2026-10-11 | 16:00 | Lecce – Bologna | Bologna (AWAY) | 2.08 | 1-2 | VAR | `02e8d0f7-1a49-4d17-8bae-dc5b50fd122e` |
| 113 | 2026-10-11 | 16:00 | Lokomotiva – Varazdin | Varazdin (AWAY) | 2.28 | 0-1 | YOK | `3dc87ce9-c245-49fd-a0c0-d0fa4315591f` |
| 114 | 2026-10-11 | 16:00 | Nairobi United – KCB | Nairobi United (HOME) | 2.14 | 2-2 | VAR | `11cd68a3-8263-449f-86d6-22441521e7f5` |
| 115 | 2026-10-11 | 16:00 | Nice – Strasbourg | Nice (HOME) | 2.44 | 2-1 | VAR | `c0321f57-96ea-4ecd-9851-ccb2f6ae55a2` |
| 116 | 2026-10-11 | 16:30 | FC Koln – Mgladbach | FC Koln (HOME) | 2.04 | 2-1 | VAR | `10e43f04-32e0-401b-be75-e75bc9925227` |
| 117 | 2026-10-11 | 17:30 | Alemannia Aachen – Viktoria Koln | Alemannia Aachen (HOME) | 2.42 | 2-5 | VAR | `8ff236a8-4952-4324-99f2-ebe076fce516` |
| 118 | 2026-10-11 | 17:30 | FC Vaduz – FC Basel | FC Basel (AWAY) | 2.44 | 3-0 | YOK | `42697082-de7d-44ef-bef2-74b20a106ce3` |
| 119 | 2026-10-11 | 17:30 | Rio Ave – CD Nacional Funchal | Rio Ave (HOME) | 2.28 | 3-2 | VAR | `12bb217c-698d-499a-9569-4e036c71488f` |
| 120 | 2026-10-11 | 18:00 | Aalesunds – Sarpsborg | Aalesunds (HOME) | 2.50 | 2-4 | VAR | `977ffcb8-71cd-477d-8ee3-0598d87ae2d7` |
| 121 | 2026-10-11 | 18:00 | Asane – Sogndal | Sogndal (AWAY) | 2.48 | 2-1 | VAR | `6019ebe0-80a9-4e3a-bbd9-8aab1cccc3cb` |
| 122 | 2026-10-11 | 18:00 | IK Brage – Helsingborgs | IK Brage (HOME) | 2.32 | 2-0 | YOK | `827af433-2b43-4970-a372-f8ebc085044a` |
| 123 | 2026-10-11 | 18:30 | Lecco – ASD Alcione | Lecco (HOME) | 2.08 | 1-1 | VAR | `02aec281-51e5-472c-95d0-39ee8174f715` |
| 124 | 2026-10-11 | 18:30 | Liverpool – Man City | Man City (AWAY) | 2.28 | 0-3 | YOK | `6eed1e69-62e8-41e1-81a3-f35b7198926a` |
| 125 | 2026-10-11 | 18:30 | Pogon Szczecin – Korona Kielce | Pogon Szczecin (HOME) | 2.36 | 2-0 | YOK | `6ea4239e-144b-458b-beb7-749cf916ba16` |
| 126 | 2026-10-11 | 19:00 | Sitra – Al Najma (BRN) | Sitra (HOME) | 2.26 | 0-2 | YOK | `95eb2079-705d-4436-b87f-1b467cd61f91` |
| 127 | 2026-10-11 | 19:30 | Vllaznia Shkoder – Dinamo Tirana | Dinamo Tirana (AWAY) | 2.24 | 1-0 | YOK | `f11fc0f8-1d94-4d5c-9e3d-294a397f7f31` |
| 128 | 2026-10-11 | 19:30 | Westerlo – Antwerp | Westerlo (HOME) | 2.14 | 5-1 | VAR | `e218aa31-4192-4519-9d8c-8e780822645a` |
| 129 | 2026-10-11 | 20:00 | CSKA 1948 Sofia – CSKA Sofia | CSKA Sofia (AWAY) | 2.06 | 2-3 | VAR | `9da0b328-bf94-45c9-8122-a9518db43e35` |
| 130 | 2026-10-11 | 20:00 | Gyori – Puskas Akademia | Gyori (HOME) | 2.46 | 0-1 | YOK | `94a27b90-2020-4e5b-ab31-6c54f5a3223d` |
| 131 | 2026-10-11 | 20:00 | Zamalek – Al Ahly Cairo | Al Ahly Cairo (AWAY) | 2.02 | 0-2 | YOK | `c3344c73-0baf-4b1d-bfe0-215955e73cad` |
| 132 | 2026-10-11 | 20:15 | KAA Gent II – Seraing Utd | KAA Gent II (HOME) | 2.12 | 3-2 | VAR | `744976d2-9cae-4d9c-b80c-8f05a0c2091a` |
| 133 | 2026-10-11 | 20:15 | Lillestrom – Molde | Molde (AWAY) | 2.48 | 2-2 | VAR | `87315e8e-4278-4de7-b610-8fad67c79abe` |
| 134 | 2026-10-11 | 20:15 | Yellow-Red Mechelen – Sint Truiden | Sint Truiden (AWAY) | 2.34 | 4-3 | VAR | `d384ef8c-b6fc-45c7-84ff-9c06db0aeb67` |
| 135 | 2026-10-11 | 20:30 | Modena – Verona | Modena (HOME) | 2.12 | 3-2 | VAR | `2372abc9-3bbe-49df-b9b0-80c5d84e3fc4` |
| 136 | 2026-10-11 | 21:00 | Al-Shabab (KSA) – Al-Taawoun Buraidah | Al-Shabab (KSA) (HOME) | 2.30 | 3-0 | YOK | `8e003fbf-8c16-4dcc-89f9-c14d2f69a4eb` |
| 137 | 2026-10-11 | 21:00 | CA Atlanta – San Martin de Tucuman | CA Atlanta (HOME) | 2.26 | 1-0 | YOK | `ffe312cf-51cf-45ba-9392-9b6fce06ddf0` |
| 138 | 2026-10-11 | 21:00 | Coquimbo Unido – Colo Colo | Colo Colo (AWAY) | 2.30 | 5-2 | VAR | `ac2c4518-7dca-4c27-a41b-c73601bb9a38` |
| 139 | 2026-10-11 | 21:00 | Olympiakos – Panathinaikos | Olympiakos (HOME) | 2.24 | 1-0 | YOK | `2ae0c71b-efac-451f-8396-00d536113d91` |
| 140 | 2026-10-11 | 21:00 | UTC Cajamarca – Sporting Cristal | Sporting Cristal (AWAY) | 2.06 | 0-1 | YOK | `c429ef67-5c11-409d-ba4f-773103034123` |
| 141 | 2026-10-11 | 21:15 | Legia Warsaw – Wisla Krakow | Legia Warsaw (HOME) | 2.16 | 2-0 | YOK | `c45d321b-3440-4eed-b236-03dc6090d8b9` |
| 142 | 2026-10-11 | 21:30 | Almirante Brown – CA San Miguel | Almirante Brown (HOME) | 2.10 | 1-1 | VAR | `e335c876-dbc7-4d31-84d3-0821750a2045` |
| 143 | 2026-10-11 | 21:45 | ESTAC Troyes – Marseille | Marseille (AWAY) | 2.14 | 0-2 | YOK | `0a22067a-6fc0-4766-825b-16882345f15b` |
| 144 | 2026-10-11 | 21:45 | Orense Sporting Club – Deportivo Cuenca | Orense Sporting Club (HOME) | 2.20 | 0-0 | YOK | `f3909e20-21bc-4630-b108-760ab5891a8a` |
| 145 | 2026-10-11 | 22:00 | Atletico MG – Santos | Atletico MG (HOME) | 2.28 | 2-1 | VAR | `28a9c7e1-c311-4f2e-a4bd-dbb8fbdcca36` |
| 146 | 2026-10-11 | 22:00 | Cadiz – Sporting Gijon | Cadiz (HOME) | 2.20 | 0-1 | YOK | `6b59c217-e171-4301-9e5c-01e200c8336c` |
| 147 | 2026-10-11 | 22:00 | Racing Santander – Valencia | Racing Santander (HOME) | 2.34 | 2-2 | VAR | `bcbbddd2-1d63-49a7-bf61-45e422092720` |
| 148 | 2026-10-11 | 22:30 | Arouca – Club Football Estrela | Arouca (HOME) | 2.28 | 1-0 | YOK | `29079330-01e8-4cc3-8c90-68a20f0d148f` |
| 149 | 2026-10-11 | 23:00 | CD Maipu – San Martin De San Juan | CD Maipu (HOME) | 2.32 | 1-1 | VAR | `ae94f0c9-a42e-4aef-82e0-74b07638172f` |
| 150 | 2026-10-11 | 23:00 | Envigado – Internacional de Palmira | Envigado (HOME) | 2.14 | 1-1 | VAR | `6146169f-922a-4cc9-b7dd-7c12c041d24b` |
| 151 | 2026-10-11 | 23:00 | Humble Lions – Chapelton | Chapelton (AWAY) | 2.04 | 0-0 | YOK | `5f32c631-ff42-4dac-806b-32aa000d3f3d` |
| 152 | 2026-10-11 | 23:00 | Rosario Central – Independiente Rivadavia | Rosario Central (HOME) | 2.08 | 5-0 | YOK | `8eb4397c-862d-4c50-b1bf-b1b86c4d0454` |
| 153 | 2026-10-11 | 23:30 | Deportes Concepcion – Union La Calera | Deportes Concepcion (HOME) | 2.04 | 1-1 | VAR | `51428af0-b21f-4a99-bd2b-3caa4ebfe4b9` |
| 154 | 2026-10-11 | 23:30 | Sport Boys (Per) – Alianza Atletico | Sport Boys (Per) (HOME) | 2.08 | 1-3 | VAR | `47f9080c-bd6c-477a-943e-d156775092fa` |
| 155 | 2026-10-13 | 22:00 | Stoke – Middlesbrough | Middlesbrough (AWAY) | 2.10 | 2-3 | VAR | `882ae1b9-9da8-4cf1-aa07-d901389d63c0` |
| 156 | 2026-10-13 | 22:00 | Villarreal – Napoli | Villarreal (HOME) | 2.18 | 3-1 | VAR | `58c4adac-8c3d-43ee-96e4-d01a2e920174` |
| 157 | 2026-10-14 | 16:00 | US Latina Calcio – Atalanta U23 | US Latina Calcio (HOME) | 2.08 | 2-0 | YOK | `59232ee2-524e-4426-8341-83fc2528a300` |
| 158 | 2026-10-14 | 16:45 | Nasaf – Al Wahda (Abu Dhabi) | Al Wahda (Abu Dhabi) (AWAY) | 2.34 | 1-2 | VAR | `523749a7-a1c1-42b9-9016-549cf803a62c` |
| 159 | 2026-10-14 | 17:00 | FK Atyrau – Elimai FC | Elimai FC (AWAY) | 2.32 | 1-2 | VAR | `1030b55d-8f9a-4018-8115-45f380dd1925` |
| 160 | 2026-10-14 | 17:00 | WA Mostaganem – RC Kouba | RC Kouba (AWAY) | 2.14 | 0-0 | YOK | `45ee7eb6-7b7a-41f5-920a-17d69ec64078` |
| 161 | 2026-10-14 | 18:00 | Mezokovesd-Zsory – FC Ajka | Mezokovesd-Zsory (HOME) | 2.04 | 1-1 | VAR | `5a53bfcd-9af4-427f-b9f5-47ebcf51db47` |
| 162 | 2026-10-14 | 19:00 | Al-Taawoun Buraidah – Al Rayyan | Al Rayyan (AWAY) | 2.48 | 2-1 | VAR | `c500ce29-b936-4407-b984-6297afacebdc` |
| 163 | 2026-10-14 | 19:00 | Bohemians 1905 – Mlada Boleslav | Bohemians 1905 (HOME) | 2.28 | 1-0 | YOK | `90bd8fac-bae2-4288-83f6-b8fc64bba852` |
| 164 | 2026-10-14 | 19:00 | Kuwait SC – Al Khalidiyah | Kuwait SC (HOME) | 2.30 | 3-1 | VAR | `167e518d-7bbc-4677-b7b4-1581a7762edd` |
| 165 | 2026-10-14 | 19:45 | Feyenoord – Como | Como (AWAY) | 2.20 | 3-2 | VAR | `52b67f7d-8361-4c2b-bdd1-304bc452b310` |
| 166 | 2026-10-14 | 20:00 | Cr Temouchent – MB Rouissat | Cr Temouchent (HOME) | 2.12 | 0-2 | YOK | `fd4fc762-6d14-46ea-874d-2f71ac3b3cc8` |
| 167 | 2026-10-14 | 20:00 | Hodd – Ranheim IL | Ranheim IL (AWAY) | 2.12 | 1-1 | VAR | `f4e8b129-6ed1-469c-a520-3fb946b1db6e` |
| 168 | 2026-10-14 | 20:00 | Keciorengucu – 76 Igdir Belediyespor | Keciorengucu (HOME) | 2.28 | 0-0 | YOK | `0174775d-bfe3-46b2-80e2-701cf5acce2f` |
| 169 | 2026-10-14 | 20:00 | Moss – Egersund | Moss (HOME) | 2.20 | 0-0 | YOK | `995d51ae-282f-416d-81c1-3889591e6d71` |
| 170 | 2026-10-14 | 20:00 | Verl – Jahn Regensburg | Verl (HOME) | 2.32 | 2-2 | VAR | `75e75b4f-7168-4ee0-bdaf-4b276fa21462` |
| 171 | 2026-10-14 | 20:00 | Waldhof Mannheim – Ingolstadt | Waldhof Mannheim (HOME) | 2.02 | 0-3 | YOK | `92dfd865-a45a-4b53-bd13-37fb1a25ad65` |
| 172 | 2026-10-14 | 20:00 | Wehen Wiesbaden – Alemannia Aachen | Wehen Wiesbaden (HOME) | 2.40 | 3-0 | YOK | `6fce8b16-90d2-49b3-ba4f-ada012df4a22` |
| 173 | 2026-10-14 | 21:00 | Estud de La Plata (Res) – CA Lanus (Res) | Estud de La Plata (Res) (HOME) | 2.28 | 4-4 | VAR | `b4af45f7-340b-4861-9535-d57015d1fafd` |
| 174 | 2026-10-14 | 21:15 | Al Faisaly SC – Al Nahdha | Al Faisaly SC (HOME) | 2.04 | 2-0 | YOK | `61bccd18-2822-4623-a645-c5a4a6ac3f8b` |
| 175 | 2026-10-14 | 21:45 | Norwich – Southampton | Norwich (HOME) | 2.50 | 0-1 | YOK | `798b1bd4-e38f-4c6e-aa90-ff8ae83f2500` |
| 176 | 2026-10-14 | 21:45 | Portsmouth – Sheff Utd | Portsmouth (HOME) | 2.44 | 3-2 | VAR | `f91fd937-4702-40de-a462-8d17551d77ad` |
| 177 | 2026-10-14 | 22:00 | Betis – Porto | Betis (HOME) | 2.12 | 3-2 | VAR | `f38db51f-d649-4dc8-9dbb-531935cf4e68` |
| 178 | 2026-10-14 | 22:00 | Bodo Glimt – Dortmund | Dortmund (AWAY) | 2.30 | 1-0 | YOK | `eb9e5c58-5811-48c9-83d2-b95831621fc4` |
| 179 | 2026-10-14 | 22:00 | Man City – Paris St-G | Man City (HOME) | 2.14 | 2-4 | VAR | `6e68980b-acff-4a08-9c11-ce3d7ac0450f` |
| 180 | 2026-10-14 | 22:00 | Roma – Real Madrid | Real Madrid (AWAY) | 2.04 | 3-4 | VAR | `bd864737-f3b4-4bbd-98b0-e9fb54c563fa` |
| 181 | 2026-10-14 | 23:00 | Trujillanos – Rayo Zuliano | Rayo Zuliano (AWAY) | 2.50 | 0-0 | YOK | `0463a8d6-84ac-4a1d-b42a-15b8a35bcb3d` |
| 182 | 2026-10-15 | 16:00 | Ma'an – Jerash SC | Jerash SC (AWAY) | 2.06 | 0-2 | YOK | `8aff0c46-7079-4eb4-908d-29ae796c434e` |
| 183 | 2026-10-15 | 16:40 | Al Faisaly ( KSA ) – Al-Kholood Club | Al-Kholood Club (AWAY) | 2.16 | 3-2 | VAR | `6b9d0383-a5f4-4f56-ad87-a35073b2b336` |
| 184 | 2026-10-15 | 17:00 | Mardin Buyuksehir Beled – Fatih Karagumruk Istanb | Mardin Buyuksehir Beled (HOME) | 2.16 | 1-0 | YOK | `d6f8cb06-cb8f-4b2e-b497-d81966caf8f1` |
| 185 | 2026-10-15 | 17:50 | Al-Khaleej Saihat – Al-Feiha | Al-Khaleej Saihat (HOME) | 2.06 | 2-0 | YOK | `3bd4a5f4-782f-4c41-ba61-467637f50455` |
| 186 | 2026-10-15 | 18:00 | Al Arabi (JOR) – Shabab Al Ordon | Shabab Al Ordon (AWAY) | 2.34 | 1-0 | YOK | `0ccbb9bb-f7a5-4c47-afc3-592f9df4e12b` |
| 187 | 2026-10-15 | 19:45 | FK Riga – Kairat Almaty | FK Riga (HOME) | 2.04 | 1-1 | VAR | `e9fa44f3-dc47-4734-9b0d-4ab2b6f3899a` |
| 188 | 2026-10-15 | 19:45 | Lugano – Crvena Zvezda | Lugano (HOME) | 2.50 | 3-2 | VAR | `e9d49a3c-e1b4-479f-9d5f-1cab7894c862` |
| 189 | 2026-10-15 | 19:45 | Lyon – Crystal Palace | Lyon (HOME) | 2.46 | 3-2 | VAR | `083ff00c-6850-4135-867d-e835a4efb016` |
| 190 | 2026-10-15 | 19:45 | Red Bull Salzburg – AC Milan | AC Milan (AWAY) | 2.04 | 0-4 | YOK | `96950ac2-c1ff-4188-afe9-6cc7967aaf3b` |
| 191 | 2026-10-15 | 20:00 | Manisa FK – Erokspor A.S | Erokspor A.S (AWAY) | 2.06 | 1-1 | VAR | `ab1c1d81-3094-45c0-94fd-0f58b8928c99` |
| 192 | 2026-10-15 | 21:45 | Caen – La Roche-sur-Yon VF | Caen (HOME) | 2.44 | 2-1 | VAR | `f61e351b-821b-4c3c-b5d2-6ab0101baa32` |
| 193 | 2026-10-15 | 22:00 | Atletico Rojiblanco – Independiente Juniors | Atletico Rojiblanco (HOME) | 2.30 | 1-0 | YOK | `80dde18f-59d7-4269-b357-bf35514434c0` |
| 194 | 2026-10-15 | 22:00 | Celta Vigo – Juventus | Juventus (AWAY) | 2.28 | 1-2 | VAR | `04c79241-6f60-462c-882e-015b07bbf5b8` |
| 195 | 2026-10-15 | 22:00 | Dinamo Zagreb – Anderlecht | Dinamo Zagreb (HOME) | 2.06 | 1-0 | YOK | `04953c39-e180-4379-a7a3-635a438e0c92` |
| 196 | 2026-10-15 | 22:00 | Hearts – FC Nordsjaelland | FC Nordsjaelland (AWAY) | 2.34 | 1-1 | VAR | `849da34f-f872-4009-8f93-5e0fb88b525a` |
| 197 | 2026-10-15 | 22:00 | Hoffenheim – Besiktas | Hoffenheim (HOME) | 2.06 | 2-3 | VAR | `62b5f1e8-b230-4b5f-8958-79f5353456c7` |
| 198 | 2026-10-15 | 22:00 | Mansfield – Oxford Utd | Mansfield (HOME) | 2.46 | 1-1 | VAR | `01912291-cc43-4ee7-bcb1-1ab254bc7427` |
| 199 | 2026-10-15 | 22:00 | Marseille – Olympiakos | Marseille (HOME) | 2.44 | 0-1 | YOK | `287e0e17-2437-4630-b4ae-e3ebc07e0f82` |
| 200 | 2026-10-16 | 16:00 | Al Oruba – Dibba Al-Hisn | Al Oruba (HOME) | 2.46 | 1-1 | VAR | `dd5f0c7c-07ea-4a1b-b4c5-ba5a8ec5bdeb` |
| 201 | 2026-10-16 | 16:00 | Al-Fujairah FC – Palm City FC | Palm City FC (AWAY) | 2.34 | 2-4 | VAR | `492cac3d-5dc1-4796-9695-8422fe663cbc` |
| 202 | 2026-10-16 | 16:00 | Banik Ostrava B – Slavia Praha B | Banik Ostrava B (HOME) | 2.02 | 2-1 | VAR | `c41f8a61-3202-43e6-9840-332e71f8d95a` |
| 203 | 2026-10-16 | 16:00 | Gulf United – Emirates Club | Emirates Club (AWAY) | 2.40 | 1-7 | VAR | `0359a2de-b489-47c0-ab14-ef1f3ab00f39` |
| 204 | 2026-10-16 | 16:30 | Opatija – NK Sesvete | Opatija (HOME) | 2.38 | 1-0 | YOK | `e8aa16db-f540-4a60-805f-ca8abe02cacf` |
| 205 | 2026-10-16 | 17:30 | Al Ahli (QAT) – Al-Wakra | Al Ahli (QAT) (HOME) | 2.42 | 0-3 | YOK | `390e9b48-9b2d-4ac9-ad98-5a7518f71af7` |
| 206 | 2026-10-16 | 18:00 | Amman – Al Sareeh | Amman (HOME) | 2.30 | 2-1 | VAR | `c2f3f43c-7670-43d6-a104-f687236e93aa` |
| 207 | 2026-10-16 | 18:00 | Pohronie – Malzenice | Pohronie (HOME) | 2.04 | 0-0 | YOK | `f41dd0f6-9306-4570-b302-2687598bfa19` |
| 208 | 2026-10-16 | 18:00 | Radnik Surdulica – Radnicki Nis | Radnik Surdulica (HOME) | 2.26 | 3-0 | YOK | `6eedaec5-24b0-4f45-9e0f-6c83e6bb2e64` |
| 209 | 2026-10-16 | 19:00 | Aali Club – Sitra | Sitra (AWAY) | 2.42 | 0-2 | YOK | `2ef2b175-22c6-405b-98d7-147542902401` |
| 210 | 2026-10-16 | 19:00 | Dravinja Kostroj – Jesenice | Jesenice (AWAY) | 2.46 | 2-1 | VAR | `3bec71aa-327c-4f0b-9986-5fed774462bf` |
| 211 | 2026-10-16 | 19:00 | Prostejov – Usti nad Labem | Usti nad Labem (AWAY) | 2.16 | 2-2 | VAR | `41c1b7ae-cf0e-43b7-9e87-2bb3f980ec36` |
| 212 | 2026-10-16 | 19:00 | SFC Opava – Vysocina Jihlava | SFC Opava (HOME) | 2.46 | 1-3 | VAR | `96718a30-75dd-4623-8e73-1a3bbcbb33d8` |
| 213 | 2026-10-16 | 19:00 | Sloga Doboj – Siroki Brijeg | Sloga Doboj (HOME) | 2.08 | 0-1 | YOK | `8ca7864b-60a4-4d76-af7f-7d86b8a15527` |
| 214 | 2026-10-16 | 19:00 | Wieczysta Krakow – Rakow Czestochowa | Wieczysta Krakow (HOME) | 2.12 | 1-2 | VAR | `e7a0888d-a81a-49dd-ada3-f3d1e52ccf4e` |
| 215 | 2026-10-16 | 19:30 | Al Buqaa – Al Salt | Al Salt (AWAY) | 2.22 | 0-0 | YOK | `b310ebfc-6a35-4405-8898-9ab32398b1ba` |
| 216 | 2026-10-16 | 19:30 | Holstein Kiel – Hertha Berlin | Hertha Berlin (AWAY) | 2.42 | 0-0 | YOK | `1822ca63-3dba-4556-b09a-7f9fccb61849` |
| 217 | 2026-10-16 | 19:30 | Voitsberg – First Vienna Fc 1894 | First Vienna Fc 1894 (AWAY) | 2.22 | 1-2 | VAR | `0c7538ed-4409-43bf-95ea-fb513b9fc7ad` |
| 218 | 2026-10-16 | 20:00 | Aarhus Fremad – Esbjerg | Aarhus Fremad (HOME) | 2.36 | 0-0 | YOK | `63809201-55f3-436f-a86d-9284ff6d400e` |
| 219 | 2026-10-16 | 20:00 | Corum Belediyespor – Rizespor | Corum Belediyespor (HOME) | 2.12 | 2-1 | VAR | `bac5f384-0790-43ff-a325-c2ce85f9e20e` |
| 220 | 2026-10-16 | 20:00 | Fortuna Koln – Stuttgart II | Fortuna Koln (HOME) | 2.32 | 0-1 | YOK | `142b4c03-9c3f-446f-a472-ef8bbef7eb92` |
| 221 | 2026-10-16 | 20:00 | HB Koge – AB | HB Koge (HOME) | 2.48 | 2-3 | VAR | `459341dd-215c-4884-8363-a79465a7c58e` |
| 222 | 2026-10-16 | 20:00 | IBV – Hafnarfjordur | Hafnarfjordur (AWAY) | 2.34 | 3-1 | VAR | `c7c6fab4-2a09-425a-8a3a-c08259569c6d` |
| 223 | 2026-10-16 | 21:00 | Annecy – Nancy | Nancy (AWAY) | 2.48 | 1-2 | VAR | `08ba2880-e8ac-4b74-be20-e46e526298a9` |
| 224 | 2026-10-16 | 21:00 | FC Eindhoven – Vitesse Arnhem | Vitesse Arnhem (AWAY) | 2.20 | 0-1 | YOK | `34260cc5-5c68-4fb3-9e0f-8f79e8be1b4b` |
| 225 | 2026-10-16 | 21:00 | Guingamp – Pau | Guingamp (HOME) | 2.36 | 1-2 | VAR | `96ddd745-5a25-4dee-b68f-eb61de300224` |
| 226 | 2026-10-16 | 21:00 | Laval – Clermont | Laval (HOME) | 2.30 | 3-3 | VAR | `80bd1b59-14d8-42c3-905f-b556bb4d1789` |
| 227 | 2026-10-16 | 21:00 | VVV Venlo – Jong AZ Alkmaar | VVV Venlo (HOME) | 2.12 | 4-4 | VAR | `eda4e04a-8659-4c5b-a2a4-105491cb183f` |
| 228 | 2026-10-16 | 21:30 | FC Wacker Innsbruck – SV Austria Salzburg | FC Wacker Innsbruck (HOME) | 2.46 | 0-1 | YOK | `adb961e5-9499-4b20-98e7-f6b21900f74a` |
| 229 | 2026-10-16 | 21:30 | Livorno – Grosseto | Livorno (HOME) | 2.18 | 4-4 | VAR | `f58c9b41-c469-4ad9-b407-5bdc684ba6e9` |
| 230 | 2026-10-16 | 21:30 | Widzew Lodz – Wisla Krakow | Widzew Lodz (HOME) | 2.46 | 0-0 | YOK | `26368836-9c04-4068-91f5-f0d1816de2ae` |
| 231 | 2026-10-16 | 21:45 | Drogheda – Derry City | Derry City (AWAY) | 2.32 | 2-0 | YOK | `247222ad-7882-4150-92ce-7f86036a5a48` |
| 232 | 2026-10-16 | 21:45 | Frosinone – Sassuolo | Frosinone (HOME) | 2.48 | 4-2 | VAR | `6768f27d-d9b7-4e44-ab29-acfc0261234a` |
| 233 | 2026-10-16 | 21:45 | Le Mans – Toulouse | Toulouse (AWAY) | 2.34 | 0-3 | YOK | `a8f5c815-2d7f-42ba-bc91-944f8600a489` |
| 234 | 2026-10-16 | 22:00 | Burnley – Wolves | Wolves (AWAY) | 2.28 | 1-2 | VAR | `891b0817-81d7-4203-a225-abf76cea4e69` |
| 235 | 2026-10-16 | 22:00 | Deportivo – Levante | Deportivo (HOME) | 2.18 | 1-1 | VAR | `806fcfc1-7a1b-4db5-a327-05ec4dfd68c7` |
| 236 | 2026-10-16 | 22:15 | Alcorcon – Huesca | Alcorcon (HOME) | 2.20 | 1-1 | VAR | `9203be75-ef93-48c7-a758-191054974876` |
| 237 | 2026-10-16 | 23:30 | CD Los Chankas – Asociacion Deportiva Tarma | CD Los Chankas (HOME) | 2.36 | 2-1 | VAR | `93b5b535-7334-4894-92a5-9aa06b5717e4` |
| 238 | 2026-10-17 | 16:00 | EIF – KaPa | KaPa (AWAY) | 2.08 | 3-2 | VAR | `9be3e53a-2877-4ad8-bb9a-86f0d14ec8ae` |
| 239 | 2026-10-17 | 16:00 | Falkenbergs – Landskrona | Falkenbergs (HOME) | 2.50 | 4-3 | VAR | `73ad55b5-be37-454c-9633-2d451728124f` |
| 240 | 2026-10-17 | 16:00 | KTP – Klubi-04 | KTP (HOME) | 2.30 | 0-0 | YOK | `54a5e068-d3a7-4b5e-b484-2802ebd86f8c` |
| 241 | 2026-10-17 | 16:00 | Mlada Boleslav – Teplice | Mlada Boleslav (HOME) | 2.22 | 1-0 | YOK | `1c4ea8fc-0f85-4f4e-b09c-6bec9839c26c` |
| 242 | 2026-10-17 | 16:00 | Sandvikens IF – Ostersunds FK | Ostersunds FK (AWAY) | 2.30 | 0-0 | YOK | `23ff46c3-fe01-40e0-bfef-48e280c00860` |
| 243 | 2026-10-17 | 16:00 | Sivasspor – Sariyer G.K. | Sivasspor (HOME) | 2.38 | 1-1 | VAR | `7527866b-be55-422e-b0f8-e756712b30b2` |
| 244 | 2026-10-17 | 16:25 | FC Goa – Regar-TadAZ | FC Goa (HOME) | 2.42 | 1-2 | VAR | `7074d89b-54a9-4001-b36e-a0a555131323` |
| 245 | 2026-10-17 | 16:30 | Bregenz – SKU Amstetten | SKU Amstetten (AWAY) | 2.32 | 0-0 | YOK | `1079b1ef-e091-4404-af06-f8b5fbc7763f` |
| 246 | 2026-10-17 | 16:30 | Schalke 04 – Mainz | Mainz (AWAY) | 2.44 | 0-1 | YOK | `8e36c557-cdc9-4b43-97d1-fea2832e84ad` |
| 247 | 2026-10-17 | 17:00 | Accrington – Gillingham | Accrington (HOME) | 2.36 | 3-1 | VAR | `427e820f-a680-4503-a280-cbf01f644ca0` |
| 248 | 2026-10-17 | 17:00 | Birmingham – QPR | Birmingham (HOME) | 2.08 | 3-0 | YOK | `54f17209-63b4-4bb1-b1dd-e7e4c8a856ce` |
| 249 | 2026-10-17 | 17:00 | Bradford – Stevenage | Bradford (HOME) | 2.02 | 2-0 | YOK | `b67dc0e3-4c56-499f-a3a2-090f517edac9` |
| 250 | 2026-10-17 | 17:00 | Bristol City – Sheff Utd | Bristol City (HOME) | 2.06 | 0-1 | YOK | `f1ed0bec-f652-439a-8994-6b3d1346cc6b` |
| 251 | 2026-10-17 | 17:00 | Colchester – Exeter | Colchester (HOME) | 2.30 | 0-0 | YOK | `f7372d5f-6c6c-4c13-a378-17928c8787fa` |
| 252 | 2026-10-17 | 17:00 | FK Aktobe – FC Ordabasy | FC Ordabasy (AWAY) | 2.02 | 1-3 | VAR | `0d99e20b-37c4-479f-b746-bd5d12784487` |
| 253 | 2026-10-17 | 17:00 | Kilmarnock – Motherwell | Motherwell (AWAY) | 2.44 | 3-2 | VAR | `42271103-dc6a-4694-8185-a553aa5fdec1` |
| 254 | 2026-10-17 | 17:00 | KS Skenderbeu Korce – AF Elbasani | AF Elbasani (AWAY) | 2.42 | 2-1 | VAR | `4aab558a-e4ac-48b8-8554-9bc4d702c660` |
| 255 | 2026-10-17 | 17:00 | Levadiakos – NFC Volos | Levadiakos (HOME) | 2.32 | 0-0 | YOK | `675f9de2-939b-4d48-b58d-ff1d3ce217ff` |
| 256 | 2026-10-17 | 17:00 | Leyton Orient – Blackpool | Leyton Orient (HOME) | 2.28 | 2-0 | YOK | `22f8e01c-fe7f-4608-bb1b-8a820989c7bd` |
| 257 | 2026-10-17 | 17:00 | Newport County – York City | York City (AWAY) | 2.08 | 1-1 | VAR | `afdbad37-1776-4b06-9aee-8b41b044fc5d` |
| 258 | 2026-10-17 | 17:00 | Spartans – Stranraer | Spartans (HOME) | 2.40 | 0-2 | YOK | `ccd42b4e-f166-443e-a190-f262fd68c5cd` |
| 259 | 2026-10-17 | 17:00 | Swansea – West Ham | West Ham (AWAY) | 2.20 | 0-1 | YOK | `57ea9cf6-0b5e-49f1-9b28-08ec39716086` |
| 260 | 2026-10-17 | 17:00 | Tranmere – Barnet | Barnet (AWAY) | 2.16 | 1-2 | VAR | `4c47e3b7-79e2-4670-ae64-4bce71b863f2` |
| 261 | 2026-10-17 | 17:00 | Wycombe – Notts Co | Wycombe (HOME) | 2.04 | 2-0 | YOK | `d2a42357-f07b-4b27-b7fd-c65c28a598fa` |
| 262 | 2026-10-17 | 17:15 | ACS Petrolul 52 – ACS Sepsi OSK | ACS Petrolul 52 (HOME) | 2.18 | 1-1 | VAR | `0e7021b7-548b-47bb-973e-ac3d1e9cc60d` |
| 263 | 2026-10-17 | 17:30 | Emmen – Almere City | Emmen (HOME) | 2.30 | 2-1 | VAR | `2431dcdb-a26f-4c23-a309-3e515d1c2990` |
| 264 | 2026-10-17 | 18:00 | Digenis Ypsona – Karmiotissa Polemidion | Digenis Ypsona (HOME) | 2.44 | 2-1 | VAR | `fb884495-cb8b-42c8-becf-1e0dd9ea10cc` |
| 265 | 2026-10-17 | 18:00 | Osters – Oddevold | Oddevold (AWAY) | 2.18 | 3-1 | VAR | `3f20c8bd-adcb-417e-b53f-f73b73608f26` |
| 266 | 2026-10-17 | 18:15 | Mantova – Palermo | Palermo (AWAY) | 2.26 | 0-2 | YOK | `d935f281-b8df-43ba-93ce-5e5b5f94ea9e` |
| 267 | 2026-10-17 | 18:30 | AIK – IFK Goteborg | IFK Goteborg (AWAY) | 2.44 | 2-2 | VAR | `92deedc9-ea98-4cc9-bdd9-a74ee0f06f4f` |
| 268 | 2026-10-17 | 18:30 | GKS Katowice – Pogon Szczecin | GKS Katowice (HOME) | 2.12 | 0-1 | YOK | `1aceec40-8d1e-41a4-a13d-b94e29adbee1` |
| 269 | 2026-10-17 | 19:30 | Airdrieonians – Hamilton | Hamilton (AWAY) | 2.10 | 1-2 | VAR | `d9f86f04-8685-42dd-a54f-cb4feee76dcc` |
| 270 | 2026-10-17 | 19:30 | Newcastle – Aston Villa | Newcastle (HOME) | 2.40 | 0-1 | YOK | `0a0048d9-10a8-418d-b5fe-af5bff5fffa7` |
| 271 | 2026-10-17 | 19:30 | Sporting Gijon – Albacete | Sporting Gijon (HOME) | 2.12 | 2-1 | VAR | `30cfe98b-10a2-4d75-b7f0-4ee57f3f1c1c` |
| 272 | 2026-10-17 | 20:30 | Pisa – US Cremonese | Pisa (HOME) | 2.20 | 3-1 | VAR | `125724d9-ac8c-461b-bc8a-359f31f267e5` |
| 273 | 2026-10-17 | 20:30 | SV Ried – Austria Wien | SV Ried (HOME) | 2.50 | 3-2 | VAR | `f822f09d-8d74-4528-bdd9-eaa1a29f0403` |
| 274 | 2026-10-17 | 21:00 | Al Draih – Al-Taawoun Buraidah | Al Draih (HOME) | 2.04 | 1-1 | VAR | `71dd57b4-55f9-4fdb-8d53-212110529f27` |
| 275 | 2026-10-17 | 21:00 | Banfield – Argentinos Juniors | Argentinos Juniors (AWAY) | 2.14 | 0-1 | YOK | `fbda24c7-92de-405e-a95d-848d153de50c` |
| 276 | 2026-10-17 | 21:00 | Cruz Azul Hidalgo – Mineros de Zacatecas | Mineros de Zacatecas (AWAY) | 2.40 | 2-1 | VAR | `b902b611-f6d8-44a6-94a4-af2214673acb` |
| 277 | 2026-10-17 | 21:00 | Red Star – St Etienne | St Etienne (AWAY) | 2.28 | 0-1 | YOK | `172ecc08-a59f-45a6-8724-7b4f29ae1d7e` |
| 278 | 2026-10-17 | 21:45 | Lille – Brest | Lille (HOME) | 2.08 | 1-1 | VAR | `109893aa-2361-45f4-a75e-19d26d006a3f` |
| 279 | 2026-10-17 | 22:00 | Las Palmas – CD Castellon | CD Castellon (AWAY) | 2.12 | 0-3 | YOK | `46ba2f36-1f2c-493d-a179-de4beb5d47af` |
| 280 | 2026-10-17 | 22:00 | Valencia – Athletic Bilbao | Athletic Bilbao (AWAY) | 2.40 | 0-0 | YOK | `674e2fe2-d357-4b32-a591-f302e81825eb` |
| 281 | 2026-10-17 | 22:15 | Academica – Amarante | Academica (HOME) | 2.06 | 3-2 | VAR | `df1ba033-a150-4b70-a7fe-166a3e10605d` |
| 282 | 2026-10-17 | 23:00 | DHJ El Jadida – Moghreb Tetouan | DHJ El Jadida (HOME) | 2.12 | 4-1 | VAR | `e79e3fe0-dfdd-47b9-a538-9f49f0d7512b` |
| 283 | 2026-10-18 | 16:00 | Albion FC – Torque | Torque (AWAY) | 2.26 | 2-1 | VAR | `275681fc-0ef5-4aca-a599-45b5b6a29d70` |
| 284 | 2026-10-18 | 16:00 | Angers – Marseille | Marseille (AWAY) | 2.06 | 2-5 | VAR | `f7a06fab-ff73-4388-ac7b-2ec61738af44` |
| 285 | 2026-10-18 | 16:00 | Bournemouth – Sunderland | Bournemouth (HOME) | 2.22 | 2-0 | YOK | `c54b6cbc-402f-4caf-812b-bce469ee2f27` |
| 286 | 2026-10-18 | 16:00 | Fiorentina – Como | Como (AWAY) | 2.12 | 1-3 | VAR | `714ead25-7f6d-49ab-afa1-1a4359439a96` |
| 287 | 2026-10-18 | 16:00 | Juve Stabia – Sudtirol | Juve Stabia (HOME) | 2.24 | 3-0 | YOK | `38f62e5b-5672-4675-a8c2-c5a507c156c9` |
| 288 | 2026-10-18 | 16:00 | Van Buyuksehir Belediyespor – Umraniyespor | Van Buyuksehir Belediyespor (HOME) | 2.42 | 0-2 | YOK | `589aa743-db7a-4f31-aed0-164f222cd581` |
| 289 | 2026-10-18 | 16:30 | Dukla Banska Bystrica – Podbrezova | Podbrezova (AWAY) | 2.06 | 1-0 | YOK | `e288c6a3-dac8-48c2-968a-f8ce4a64c131` |
| 290 | 2026-10-18 | 16:30 | Olympique De Beja – Etoile Sportive Sahel | Etoile Sportive Sahel (AWAY) | 2.32 | 1-2 | VAR | `36398a36-059d-455e-9f4e-123e5ffe2854` |
| 291 | 2026-10-18 | 16:30 | Zemplin – FC Kosice | FC Kosice (AWAY) | 2.16 | 1-1 | VAR | `f71418ba-05b3-43ce-97e1-d97b4b32f7ae` |
| 292 | 2026-10-18 | 17:00 | Kristianstads – FC Trollhattan | FC Trollhattan (AWAY) | 2.40 | 3-1 | VAR | `1831ee67-2d52-49b6-a1cf-e3271b60fd4b` |
| 293 | 2026-10-18 | 17:00 | Northeast United – Kerala Blasters FC | Northeast United (HOME) | 2.12 | 4-1 | VAR | `bde57099-4f41-46a3-9278-db4a621b848f` |
| 294 | 2026-10-18 | 17:00 | OB – Brondby | Brondby (AWAY) | 2.38 | 2-1 | VAR | `33eeadbc-ba73-4c2f-ac19-87c6e4c2e141` |
| 295 | 2026-10-18 | 17:00 | Tondela – Alverca | Alverca (AWAY) | 2.40 | 0-0 | YOK | `45f450b4-3dad-4794-b9fb-5222f431f65e` |
| 296 | 2026-10-18 | 17:15 | Celta Vigo – Alaves | Celta Vigo (HOME) | 2.36 | 2-1 | VAR | `f8f5a13d-d519-4475-a255-cba5091af6aa` |
| 297 | 2026-10-18 | 17:15 | Granada – Cadiz | Granada (HOME) | 2.04 | 2-0 | YOK | `a4aeae9d-6ed7-4b47-8f6a-f6ebb9a94ea4` |
| 298 | 2026-10-18 | 17:30 | Duisburg – Viktoria Koln | Duisburg (HOME) | 2.30 | 1-1 | VAR | `dd93eaf7-3688-4116-9bf0-cb7b2a02cad7` |
| 299 | 2026-10-18 | 18:00 | Lyn – Moss | Lyn (HOME) | 2.26 | 1-0 | YOK | `84dd6f45-3ce3-44f4-8c7f-e4ae1a685ef6` |
| 300 | 2026-10-18 | 18:00 | Valerenga – Brann | Valerenga (HOME) | 2.38 | 3-1 | VAR | `1ff73d99-59cc-409b-9463-07ecd14d0f9a` |
| 301 | 2026-10-18 | 18:15 | Cesena – Calcio Avellino SSD | Cesena (HOME) | 2.46 | 1-1 | VAR | `9aac7e76-2b95-4036-8de3-b641d98d3517` |
| 302 | 2026-10-18 | 18:15 | Le Havre – Auxerre | Le Havre (HOME) | 2.40 | 1-3 | VAR | `4a1b824a-2970-4a1b-89f0-c420033f879d` |
| 303 | 2026-10-18 | 18:15 | Lorient – Monaco | Monaco (AWAY) | 2.18 | 1-0 | YOK | `9ec0426f-27d5-460d-900b-691843ed3289` |
| 304 | 2026-10-18 | 18:15 | Paris FC – Rennes | Paris FC (HOME) | 2.22 | 4-3 | VAR | `e315915a-c63f-4614-a991-845c8ee0ed89` |
| 305 | 2026-10-18 | 18:15 | UTA Arad – CFR Cluj | UTA Arad (HOME) | 2.30 | 1-0 | YOK | `853bfd6d-0a3f-41ef-841a-31b0f9d685b0` |
| 306 | 2026-10-18 | 18:30 | Mgladbach – Hoffenheim | Hoffenheim (AWAY) | 2.20 | 1-2 | VAR | `56a09019-0aa0-4f27-8624-75ef9b5f5efb` |
| 307 | 2026-10-18 | 19:00 | KFCO Beerschot Wilrijk – Anderlecht | Anderlecht (AWAY) | 2.22 | 2-1 | VAR | `880473ea-5a50-4648-ba12-a7c0662c6f79` |
| 308 | 2026-10-18 | 19:00 | Zilina – Dunajska Streda | Dunajska Streda (AWAY) | 2.18 | 2-3 | VAR | `385f610f-43f8-4050-b327-5f9cb7687da6` |
| 309 | 2026-10-18 | 19:15 | Real Jaen – CF Rayo Majadahonda | Real Jaen (HOME) | 2.30 | 1-0 | YOK | `e22ee17e-4d18-4aeb-adcc-f496d93063c6` |
| 310 | 2026-10-18 | 19:30 | Delfin – Manta FC | Delfin (HOME) | 2.32 | 4-2 | VAR | `d77214cf-c3d3-4f71-b13c-8ec89b98e5c6` |
| 311 | 2026-10-18 | 19:30 | Malaga – Real Sociedad | Real Sociedad (AWAY) | 2.36 | 2-5 | VAR | `ee815cd8-121a-4c00-b315-e030c8d2511b` |
| 312 | 2026-10-18 | 19:30 | Valladolid – Eldense | Valladolid (HOME) | 2.04 | 2-3 | VAR | `10103d8a-e437-4041-8153-da920a760977` |
| 313 | 2026-10-18 | 19:30 | Zeleznicar Pancevo – Partizan Belgrade | Zeleznicar Pancevo (HOME) | 2.36 | 1-0 | YOK | `bc2f1dd5-3fde-43ab-9087-34da478c3eed` |
| 314 | 2026-10-18 | 20:00 | Cr Temouchent – ASO Chlef | Cr Temouchent (HOME) | 2.22 | 1-1 | VAR | `3ea6dd53-6642-4644-b306-ef4018f7b2a6` |
| 315 | 2026-10-18 | 20:00 | Kifisia – Aris | Aris (AWAY) | 2.46 | 1-2 | VAR | `6d1c9c90-c859-4c50-8bca-3a950ab48e47` |
| 316 | 2026-10-18 | 20:00 | MB Rouissat – JS Saoura | MB Rouissat (HOME) | 2.12 | 1-0 | YOK | `90408639-c5ce-446a-9368-bcb8d81c502f` |
| 317 | 2026-10-18 | 20:45 | Racing Club – CA Independiente | Racing Club (HOME) | 2.40 | 1-1 | VAR | `a9ac67d0-38bc-44d8-aab3-e8b3ab279962` |
| 318 | 2026-10-18 | 21:00 | Al-Fateh (KSA) – Al-Khaleej Saihat | Al-Fateh (KSA) (HOME) | 2.46 | 2-3 | VAR | `27649ece-bf36-4f72-8e23-570e86f87d02` |
| 319 | 2026-10-18 | 21:30 | Lechia Gdansk – Arka Gdynia | Lechia Gdansk (HOME) | 2.32 | 2-1 | VAR | `68daf009-442b-4ee9-91ae-f63ace5fcb9e` |
| 320 | 2026-10-18 | 21:30 | Los Andes – All Boys | Los Andes (HOME) | 2.18 | 1-1 | VAR | `e64bdcc9-7d7e-4263-ab23-502d6829abcd` |
| 321 | 2026-10-18 | 21:30 | Nueva Chicago – Gimnasia Jujuy | Nueva Chicago (HOME) | 2.44 | 0-1 | YOK | `d276879c-cf57-4725-8ac9-a2caf03b19d7` |
| 322 | 2026-10-18 | 22:00 | Avai – Athletic Club | Avai (HOME) | 2.38 | 0-0 | YOK | `46a8bf79-a79e-4c88-8e4f-6f12b07f3c89` |
| 323 | 2026-10-18 | 22:00 | Fluminense – Santos | Fluminense (HOME) | 2.42 | 1-2 | VAR | `005ee851-499b-441a-a177-ba9b20928cc4` |
| 324 | 2026-10-18 | 22:00 | Gremio – Cruzeiro MG | Cruzeiro MG (AWAY) | 2.30 | 2-4 | VAR | `84099d74-1442-4920-b278-a96ba62ab8da` |
| 325 | 2026-10-18 | 22:00 | Sao Bernardo – Criciuma | Criciuma (AWAY) | 2.42 | 0-1 | YOK | `4f665c3e-ccdb-4143-ada7-6a84edca737a` |
| 326 | 2026-10-18 | 23:00 | Chaco For Ever – CA Central Norte | Chaco For Ever (HOME) | 2.22 | 1-2 | VAR | `644d3656-971b-4919-8387-65b6352eb11e` |
| 327 | 2026-10-19 | 17:00 | El Gounah – Smouha | Smouha (AWAY) | 2.40 | 0-2 | YOK | `aa00d55c-1580-489f-b0b4-7572012f09f2` |
| 328 | 2026-10-19 | 17:00 | Manisa FK – Muglaspor | Manisa FK (HOME) | 2.50 | 3-4 | VAR | `4d14691a-2af7-44ce-abaf-2dee23da8217` |
| 329 | 2026-10-19 | 17:00 | Msp Batna – Mo Bejaia | Msp Batna (HOME) | 2.30 | 1-0 | YOK | `ddf211fe-702e-4413-afd7-c1282853f759` |
| 330 | 2026-10-19 | 17:00 | Punjab FC – Mumbai City FC | Punjab FC (HOME) | 2.46 | 1-1 | VAR | `7a73d2e1-4772-4c07-867d-76a68650faf4` |
| 331 | 2026-10-19 | 18:30 | Sohar – Al Shabab | Al Shabab (AWAY) | 2.06 | 0-5 | YOK | `494e7c95-1b1f-4877-bd09-47507ae3c0db` |
| 332 | 2026-10-19 | 19:00 | Etar – Spartak Varna | Spartak Varna (AWAY) | 2.02 | 2-4 | VAR | `c524cbe7-2845-4bd0-a4a1-c990d40597eb` |
| 333 | 2026-10-19 | 19:00 | FK Spartak – FK Borac Cacak | FK Spartak (HOME) | 2.08 | 3-3 | VAR | `1b95a4ed-b9f8-4532-881e-a18fe37305d9` |
| 334 | 2026-10-19 | 19:30 | AC Monza – Cagliari | AC Monza (HOME) | 2.42 | 4-0 | YOK | `6509c26a-166d-4cd5-ae9f-c37895423152` |
| 335 | 2026-10-19 | 20:00 | Erokspor A.S – Mardin Buyuksehir Belediyespor | Erokspor A.S (HOME) | 2.10 | 4-2 | VAR | `b6bdc242-be11-439a-9a1b-ca5f2b3c0e0b` |
| 336 | 2026-10-19 | 20:00 | Viborg – Midtjylland | Midtjylland (AWAY) | 2.46 | 1-2 | VAR | `f1d8700d-f514-4a5b-9bc9-ef7a96ede043` |
| 337 | 2026-10-19 | 20:30 | Beitar Jerusalem – Maccabi Tel Aviv | Maccabi Tel Aviv (AWAY) | 2.26 | 0-0 | YOK | `61fe5b18-0027-4df2-abcf-91fe347b2687` |
| 338 | 2026-10-19 | 21:00 | Jong Ajax Amsterdam – De Graafschap | De Graafschap (AWAY) | 2.42 | 2-1 | VAR | `3a7149a3-93d2-4efe-9b6d-e0bce1036471` |
| 339 | 2026-10-19 | 21:00 | Jong PSV Eindhoven – FC Dordrecht | Jong PSV Eindhoven (HOME) | 2.20 | 0-1 | YOK | `06785f40-2afe-4062-a2f4-51820cfff529` |
| 340 | 2026-10-19 | 21:00 | Sportivo Barracas – Sacachispas | Sportivo Barracas (HOME) | 2.12 | 0-0 | YOK | `6d44041b-2444-4c07-a2b3-0dcf3d503ae3` |
| 341 | 2026-10-19 | 21:00 | Wolves U21 – West Brom U21 | Wolves U21 (HOME) | 2.38 | 2-1 | VAR | `457cd891-6abd-47d7-930c-d8389104b931` |
| 342 | 2026-10-19 | 21:30 | Juventus B – Renate | Juventus B (HOME) | 2.32 | 2-1 | VAR | `5bdde388-1789-40a1-8f06-a9764c21cc24` |
| 343 | 2026-10-19 | 21:45 | Rodez – Montpellier | Montpellier (AWAY) | 2.42 | 0-3 | YOK | `084efa11-d5d1-45fc-8efa-2f3446ef8fae` |
| 344 | 2026-10-19 | 22:00 | Derry City – St Patricks | St Patricks (AWAY) | 2.22 | 1-0 | YOK | `62f1bda7-a4d7-4918-a1a8-6aebe4c462d5` |
| 345 | 2026-10-19 | 22:00 | Real Santander – Leones FC | Real Santander (HOME) | 2.14 | 1-0 | YOK | `50937c60-693c-40a7-a300-820835661144` |
| 346 | 2026-10-20 | 16:00 | VFB Stuttgart U19 – Atletico Madrid U19 | Atletico Madrid U19 (AWAY) | 2.04 | 2-4 | VAR | `b8e82076-d250-48cd-8fd5-230589544a7c` |
| 347 | 2026-10-20 | 17:00 | Liverpool U19 – Villarreal U19 | Liverpool U19 (HOME) | 2.28 | 0-0 | YOK | `857b2d69-4809-49cb-8163-573cc1a73fc6` |
| 348 | 2026-10-20 | 17:30 | ASA Targu Mures – Chindia Targoviste | Chindia Targoviste (AWAY) | 2.26 | 2-4 | VAR | `99e12b11-a6a2-452f-b76f-018c682bab18` |
| 349 | 2026-10-20 | 18:00 | Tatran Lip Mikulas – MFk Skalica | MFk Skalica (AWAY) | 2.36 | 0-0 | YOK | `6daf7450-041f-4062-879c-872433d7d980` |
| 350 | 2026-10-20 | 18:20 | Al Orubah – Al Bukayriyah | Al Orubah (HOME) | 2.12 | 1-1 | VAR | `42eff41e-975f-4417-b714-c450ec1af7f1` |
| 351 | 2026-10-20 | 21:00 | Al-Ettifaq – Al-Ittihad | Al-Ittihad (AWAY) | 2.10 | 1-4 | VAR | `cdf555dc-3e1c-47c9-b078-9cebe385b34c` |
| 352 | 2026-10-20 | 21:00 | CA Aldosivi (Res) – CA Banfield (Res) | CA Aldosivi (Res) (HOME) | 2.20 | 2-1 | VAR | `63bc2855-e7b2-466a-aabd-ca3b37c08d33` |
| 353 | 2026-10-20 | 21:00 | Wealdstone – Nottingham Forest U21 | Wealdstone (HOME) | 2.18 | 1-0 | YOK | `bc2b9bd4-897d-4d49-97ef-65c8046ec28e` |
| 354 | 2026-10-20 | 21:45 | AFC Wimbledon – Mansfield | Mansfield (AWAY) | 2.18 | 0-3 | YOK | `4df7167b-d3bd-4c48-b03f-aa19dce2a74e` |
| 355 | 2026-10-20 | 21:45 | Cheltenham – Fleetwood Town | Fleetwood Town (AWAY) | 2.34 | 4-2 | VAR | `ccbe35a5-b5ed-4bff-95e7-2202a7ad6176` |
| 356 | 2026-10-20 | 21:45 | Northampton – Tranmere | Northampton (HOME) | 2.36 | 0-1 | YOK | `61578bb2-fcde-46d1-8b88-f1051ce6e1ab` |
| 357 | 2026-10-20 | 21:45 | Notts Co – Sheff Wed | Sheff Wed (AWAY) | 2.24 | 2-0 | YOK | `4c4d5c9e-9231-4ecd-83a1-225679e8a8f2` |
| 358 | 2026-10-20 | 21:45 | Rochdale – Grimsby | Grimsby (AWAY) | 2.30 | 2-2 | VAR | `e73a2fab-0b89-4133-bf5e-66ab2c767514` |
| 359 | 2026-10-20 | 21:45 | Rotherham – Newport County | Rotherham (HOME) | 2.32 | 2-2 | VAR | `b8ae2d71-b635-4faa-8f38-226f87b8ca4c` |
| 360 | 2026-10-20 | 22:00 | Gillingham – Port Vale | Port Vale (AWAY) | 2.34 | 1-1 | VAR | `676c20a4-d3cf-45cc-951d-360e2fcc3f8d` |
| 361 | 2026-10-20 | 22:00 | Ipswich Town U21 – Anderlecht (Res) | Anderlecht (Res) (AWAY) | 2.08 | 0-1 | YOK | `c1aa85ee-1065-4aae-a7a5-9aae60bc7d35` |
| 362 | 2026-10-20 | 22:00 | Stuttgart – Atletico Madrid | Atletico Madrid (AWAY) | 2.16 | 1-1 | VAR | `b8b9c9f0-44b1-40d1-bdc5-5f1d194a5b95` |
| 363 | 2026-10-21 | 17:45 | Al Jeel – Al-Jndal | Al-Jndal (AWAY) | 2.46 | 0-0 | YOK | `bcbecb16-dcd1-434c-bfed-494e55746d44` |
| 364 | 2026-10-21 | 18:00 | Al-Anwar Club – Al-Wahda (KSA) | Al-Wahda (KSA) (AWAY) | 2.40 | 1-1 | VAR | `a93b8dc1-1645-4861-a229-45386ae9a566` |
| 365 | 2026-10-21 | 18:30 | Cherno More – Lokomotiv Plovdiv | Cherno More (HOME) | 2.26 | 0-1 | YOK | `b590515d-117d-40f7-b26b-206cd59b56ee` |
| 366 | 2026-10-21 | 18:30 | PK-35 RY – Jaro | Jaro (AWAY) | 2.50 | 1-1 | VAR | `29355be5-d766-4f01-bc05-c9abc05c8928` |
| 367 | 2026-10-21 | 19:45 | Como – Man Utd | Como (HOME) | 2.42 | 4-1 | VAR | `5bf02932-839b-4c2b-a461-ff71d405b172` |
| 368 | 2026-10-21 | 19:45 | Lille – Galatasaray | Lille (HOME) | 2.32 | 2-4 | VAR | `eafea45a-891a-48c3-afd9-c224c6d85476` |
| 369 | 2026-10-21 | 20:00 | Ceramica Cleopatra – Petrojet | Ceramica Cleopatra (HOME) | 2.20 | 2-0 | YOK | `192a70c4-ac7e-413f-ae9f-081a70724df6` |
| 370 | 2026-10-21 | 21:00 | Belgrano (Res) – Estudiantes DLP (Res) | Belgrano (Res) (HOME) | 2.12 | 0-2 | YOK | `1f8472dd-3fd9-4e6e-bebb-ce0a48e0e1c9` |
| 371 | 2026-10-21 | 21:00 | Levante – Athletic Bilbao | Athletic Bilbao (AWAY) | 2.20 | 3-1 | VAR | `b940a4e3-4d0b-4c08-a9f5-50f466d76dfa` |
| 372 | 2026-10-21 | 21:00 | Southampton (W) – Crystal Palace (W) | Crystal Palace (W) (AWAY) | 2.08 | 3-2 | VAR | `9d25d204-4784-44c0-88fc-781bb538c06b` |
| 373 | 2026-10-21 | 21:30 | Charlton (W) – Bristol City (W) | Charlton (W) (HOME) | 2.44 | 2-0 | YOK | `9a73f7c2-1ce2-4398-915d-abf8685a9977` |
| 374 | 2026-10-21 | 22:00 | Bayern Munich – Arsenal | Bayern Munich (HOME) | 2.34 | 2-2 | VAR | `d8c6b7f5-817f-44f4-bdcf-afa5facc26dc` |
| 375 | 2026-10-22 | 16:00 | Bihor Oradea – CSM Scolar Resita | Bihor Oradea (HOME) | 2.26 | 2-0 | YOK | `2c4ad682-9877-4909-99ff-b41c8a7b0b6d` |
| 376 | 2026-10-22 | 16:40 | Al-Hazm (KSA) – Al-Feiha | Al-Hazm (KSA) (HOME) | 2.38 | 2-2 | VAR | `4a96bd00-f6e8-4327-814f-6614c72d5ea0` |
| 377 | 2026-10-22 | 17:45 | Al-Fateh (KSA) – Al-Shabab (KSA) | Al-Shabab (KSA) (AWAY) | 2.18 | 1-3 | VAR | `893689a5-4733-48bc-8149-2bf671fdeb43` |
| 378 | 2026-10-22 | 18:00 | Al Sareeh – Jerash SC | Jerash SC (AWAY) | 2.34 | 1-1 | VAR | `38ed6762-f75c-4672-96af-3555dc31d8d3` |
| 379 | 2026-10-22 | 19:00 | Al Ahli (UAE) – Al Ain | Al Ain (AWAY) | 2.48 | 2-2 | VAR | `6554d0b8-13ac-420c-94e7-5953141f60dc` |
| 380 | 2026-10-22 | 19:00 | Al Najma (BRN) – Aali Club | Al Najma (BRN) (HOME) | 2.46 | 1-2 | VAR | `f894999b-3bcd-416a-acb6-d00984c2ba92` |
| 381 | 2026-10-22 | 19:00 | Flora Tallinn II – FC Nõmme United U21 | Flora Tallinn II (HOME) | 2.20 | 3-2 | VAR | `daf468c0-0fcd-4a47-93e0-aa17ee623d98` |
| 382 | 2026-10-22 | 19:45 | Crvena Zvezda – FC Copenhagen | Crvena Zvezda (HOME) | 2.38 | 2-2 | VAR | `7fcac3bc-69d1-486c-97d0-cfba22f8f8c4` |
| 383 | 2026-10-22 | 19:45 | FC Iberia 1999 – Mjallby | Mjallby (AWAY) | 2.48 | 1-1 | VAR | `6f5acb5e-43ff-4805-9664-69abbf3ba491` |
| 384 | 2026-10-22 | 19:45 | Getafe – Lugano | Getafe (HOME) | 2.04 | 2-5 | VAR | `45cf0ac6-e90f-4143-be23-9d363879b094` |
| 385 | 2026-10-22 | 21:30 | Vinotinto Ecuador – Independiente Juniors | Vinotinto Ecuador (HOME) | 2.02 | 2-0 | YOK | `f802b90c-01ee-493c-8e7e-d71ac909f65c` |
| 386 | 2026-10-22 | 22:00 | Ajax – Atalanta | Ajax (HOME) | 2.20 | 2-0 | YOK | `b65d3e49-b17d-4036-9889-7f8bb4cd6b7e` |
| 387 | 2026-10-22 | 22:00 | Besiktas – Crystal Palace | Besiktas (HOME) | 2.34 | 2-2 | VAR | `b37291df-1ba7-4f25-be3e-9fe926c3e1d1` |
| 388 | 2026-10-22 | 22:00 | Bournemouth – AC Milan | Bournemouth (HOME) | 2.02 | 3-0 | YOK | `7385ca26-cbf2-4d5b-a2ef-2cc8f14f3f1c` |
| 389 | 2026-10-22 | 22:00 | Hoffenheim – Lyon | Hoffenheim (HOME) | 2.12 | 3-0 | YOK | `499dbd53-66d0-4394-bf4a-ff3997b2198d` |
| 390 | 2026-10-22 | 22:00 | Jagiellonia Bialystock – Anderlecht | Anderlecht (AWAY) | 2.34 | 0-3 | YOK | `96d76ab4-3e61-4796-be46-c563646f141b` |
| 391 | 2026-10-22 | 22:00 | Monaco – Freiburg | Monaco (HOME) | 2.24 | 3-0 | YOK | `1e29a7aa-08bc-4080-96bb-9ca702fdaada` |
| 392 | 2026-10-22 | 22:00 | Thun – Hajduk Split | Hajduk Split (AWAY) | 2.34 | 0-1 | YOK | `cc92a8a7-ee2e-41bd-a7d1-5a1a34d41c9e` |
| 393 | 2026-10-22 | 23:00 | Libertad Limpeno (W) – Nacional de Football (W) | Libertad Limpeno (W) (HOME) | 2.36 | 2-2 | VAR | `b2456b5c-a9a0-4861-9eaf-00c3b45d388b` |
| 394 | 2026-10-22 | 23:00 | Universidad de Chile (W) – Deportivo Cali (W) | Deportivo Cali (W) (AWAY) | 2.50 | 2-3 | VAR | `4ffbe333-613e-4f77-8e86-da7b3024c78b` |
| 395 | 2026-10-23 | 16:00 | Hapoel Rishon Lezion – Hapoel Kfar Shelem | Hapoel Rishon Lezion (HOME) | 2.02 | 0-3 | YOK | `7e0b4511-f287-4d44-8ad9-47496548d0f6` |
| 396 | 2026-10-23 | 17:00 | Sporting Braga U23 – Benfica U23 | Sporting Braga U23 (HOME) | 2.18 | 4-3 | VAR | `1f8f061f-f7db-4f57-b51e-32a317c6503e` |
| 397 | 2026-10-23 | 18:00 | Botosani – ACS Petrolul 52 | Botosani (HOME) | 2.18 | 1-3 | VAR | `377870c9-bf3a-414b-8802-1832ae458da2` |
| 398 | 2026-10-23 | 18:30 | Triglav – Nafta Lendava | Nafta Lendava (AWAY) | 2.32 | 1-1 | VAR | `fb474d0b-bb1c-482f-80f3-d1d11d289f92` |
| 399 | 2026-10-23 | 19:00 | CSKA 1948 Sofia – Botev Plovdiv | CSKA 1948 Sofia (HOME) | 2.06 | 4-0 | YOK | `4ee6498d-f653-430c-aec7-b9675dec1aa9` |
| 400 | 2026-10-23 | 19:00 | Hobro – Vendsyssel FF | Hobro (HOME) | 2.40 | 2-2 | VAR | `e5ffb246-b278-48e5-828a-e9e2e8c6dee9` |
| 401 | 2026-10-23 | 19:00 | LKP Motor Lublin – Zaglebie Lubin | LKP Motor Lublin (HOME) | 2.06 | 2-2 | VAR | `bfcd90cd-657f-4e20-8e46-f4bc2eff7cdf` |
| 402 | 2026-10-23 | 19:00 | Nomme Utd – Parnu JK Vaprus | Nomme Utd (HOME) | 2.20 | 4-2 | VAR | `0fecfbde-cd26-4878-b0d4-9d20486bbf37` |
| 403 | 2026-10-23 | 19:30 | Bochum – Wolfsburg | Wolfsburg (AWAY) | 2.14 | 1-1 | VAR | `c68aafac-3133-4467-9b3d-bf4de8eef825` |
| 404 | 2026-10-23 | 19:30 | SV Darmstadt – St Pauli | St Pauli (AWAY) | 2.44 | 0-0 | YOK | `db0410c1-3f3d-439d-a441-13ab35f64fb2` |
| 405 | 2026-10-23 | 20:00 | Alanyaspor – Kocaelispor | Alanyaspor (HOME) | 2.06 | 1-2 | VAR | `0c55ba18-1511-4a4b-a486-a225a4ff9558` |
| 406 | 2026-10-23 | 20:00 | Elfsborg – Malmo FF | Elfsborg (HOME) | 2.16 | 0-0 | YOK | `9539159c-ec44-4434-af57-c4fb48788adb` |
| 407 | 2026-10-23 | 20:00 | Randers – Brondby | Brondby (AWAY) | 2.10 | 1-3 | VAR | `6adb8c41-b72b-44b5-8281-b9bf76bc50ee` |
| 408 | 2026-10-23 | 20:30 | FC Wil – Rapperswil-Jona | FC Wil (HOME) | 2.12 | 2-2 | VAR | `cb2f4460-321e-45ea-a808-0e19d6972a80` |
| 409 | 2026-10-23 | 20:30 | SCR Altach – Austria Wien | SCR Altach (HOME) | 2.44 | 2-1 | VAR | `e56850a1-9f5d-4326-a53e-f06dd34a7c46` |
| 410 | 2026-10-23 | 21:00 | Al-Quadisiya (KSA) – Al-Hilal | Al-Hilal (AWAY) | 2.14 | 2-3 | VAR | `cefd73e2-3919-4782-b140-18770224174b` |
| 411 | 2026-10-23 | 21:00 | Clermont – Guingamp | Guingamp (AWAY) | 2.32 | 0-2 | YOK | `8b5aa97d-930a-43d7-8b03-d5119c7e2f66` |
| 412 | 2026-10-23 | 21:00 | De Graafschap – RKC Waalwijk | RKC Waalwijk (AWAY) | 2.48 | 1-1 | VAR | `1291e3ce-0192-4966-bdfa-f6e2280aec44` |
| 413 | 2026-10-23 | 21:00 | Dunkerque – Metz | Metz (AWAY) | 2.36 | 1-1 | VAR | `d0278405-6153-473a-86aa-da9b4c521d0c` |
| 414 | 2026-10-23 | 21:00 | FC Oss – Jong Ajax Amsterdam | FC Oss (HOME) | 2.18 | 3-3 | VAR | `54cf7206-aff2-409a-8e53-0c8bd1d2ec96` |
| 415 | 2026-10-23 | 21:00 | Francs Borains – FCV Dender | FCV Dender (AWAY) | 2.40 | 0-0 | YOK | `49ff640f-00e4-4557-a909-115a08420d36` |
| 416 | 2026-10-23 | 21:00 | Vitesse Arnhem – Emmen | Vitesse Arnhem (HOME) | 2.42 | 0-2 | YOK | `1e2416c2-355e-4fb4-87f1-b53c6e577009` |
| 417 | 2026-10-23 | 21:30 | Granada – Valladolid | Granada (HOME) | 2.34 | 2-1 | VAR | `47cf6cae-364e-4039-84ae-5221e6764ba8` |
| 418 | 2026-10-23 | 21:30 | Ostia Mare Lido – FC Vado | Ostia Mare Lido (HOME) | 2.06 | 1-2 | VAR | `3f6664e8-f2c6-481b-8e0e-f5e1a53b0285` |
| 419 | 2026-10-23 | 21:30 | Widzew Lodz – Gornik Zabrze | Gornik Zabrze (AWAY) | 2.32 | 1-1 | VAR | `d007281e-e0f1-4879-885a-f5a667c48464` |
| 420 | 2026-10-23 | 21:45 | Brest – Nice | Brest (HOME) | 2.34 | 1-2 | VAR | `f6cd1934-5452-4646-9f8d-192097435d20` |
| 421 | 2026-10-23 | 21:45 | Torino – AC Monza | Torino (HOME) | 2.20 | 3-2 | VAR | `ea78dd6c-83b7-498f-8eef-2af5dadabab7` |
| 422 | 2026-10-23 | 22:00 | Ipswich – Nottm Forest | Nottm Forest (AWAY) | 2.42 | 1-1 | VAR | `f87096a5-100b-40b4-874f-c34160504480` |
| 423 | 2026-10-24 | 16:00 | Calcio Avellino SSD – Padova | Calcio Avellino SSD (HOME) | 2.34 | 0-1 | YOK | `6fd19dd6-9029-4603-ad30-80230b26deb5` |
| 424 | 2026-10-24 | 16:00 | Entella – Mantova | Entella (HOME) | 2.48 | 0-1 | YOK | `d2d1c085-af8a-4af0-a886-c730e1e25790` |
| 425 | 2026-10-24 | 16:30 | Admira Wacker – FC Wacker Innsbruck | Admira Wacker (HOME) | 2.30 | 1-0 | YOK | `3b28f48c-94f6-472c-8f75-b539f6d7d3d0` |
| 426 | 2026-10-24 | 16:30 | Arka Gdynia – Nieciecza | Arka Gdynia (HOME) | 2.28 | 3-1 | VAR | `8a3ce9ca-fd9a-4b1a-bde6-12a33382bba9` |
| 427 | 2026-10-24 | 16:30 | FC Koln – Schalke 04 | FC Koln (HOME) | 2.18 | 0-0 | YOK | `fd620058-7c44-4937-978a-2242c693649f` |
| 428 | 2026-10-24 | 16:30 | Paderborn – Hamburger SV | Paderborn (HOME) | 2.48 | 1-0 | YOK | `235e6eb2-af0c-4fe7-96bb-26e205341757` |
| 429 | 2026-10-24 | 16:30 | Zemplin – Podbrezova | Podbrezova (AWAY) | 2.44 | 1-4 | VAR | `276a58e5-aea1-4cf8-a6e4-b00cd3b58f63` |
| 430 | 2026-10-24 | 17:00 | AFC Telford – Hebburn Town | AFC Telford (HOME) | 2.04 | 2-2 | VAR | `52d53cac-4676-44f7-8761-56e094b366d2` |
| 431 | 2026-10-24 | 17:00 | Aldershot – Wealdstone | Aldershot (HOME) | 2.42 | 0-1 | YOK | `eb8c1b25-7742-4ed1-871b-cc255630b112` |
| 432 | 2026-10-24 | 17:00 | Brackley Town – Radcliffe Borough | Brackley Town (HOME) | 2.34 | 0-1 | YOK | `aa8f2441-9a98-4a69-8838-ddc044b2e6a9` |
| 433 | 2026-10-24 | 17:00 | Bromley – Peterborough | Peterborough (AWAY) | 2.08 | 1-1 | VAR | `39e78cd4-8904-4f6f-a7c8-06ced49b5f94` |
| 434 | 2026-10-24 | 17:00 | CF Rayo Majadahonda – UE Sant Andreu | CF Rayo Majadahonda (HOME) | 2.30 | 2-1 | VAR | `b6e2a3c9-c0ec-4b89-9346-3453e0ec279d` |
| 435 | 2026-10-24 | 17:00 | Coventry – Fulham | Fulham (AWAY) | 2.34 | 0-1 | YOK | `27f00830-8119-4755-ba3e-36f25d2a7685` |
| 436 | 2026-10-24 | 17:00 | Darlington – Spennymoor Town | Darlington (HOME) | 2.10 | 3-0 | YOK | `fde2c65a-a5b2-460d-a5d1-bd10b0c7802a` |
| 437 | 2026-10-24 | 17:00 | Doncaster – Sheff Wed | Sheff Wed (AWAY) | 2.48 | 2-0 | YOK | `44f0b0ac-6b4f-4cdd-840e-418a4e21fb22` |
| 438 | 2026-10-24 | 17:00 | Dundee Utd – Aberdeen | Dundee Utd (HOME) | 2.16 | 3-2 | VAR | `780fe6f7-b0a6-400c-b7d6-caca919f98ef` |
| 439 | 2026-10-24 | 17:00 | Gillingham – Grimsby | Grimsby (AWAY) | 2.18 | 1-4 | VAR | `e4e744f6-86b2-497f-9ffa-1db591dfbf56` |
| 440 | 2026-10-24 | 17:00 | Hafnarfjordur – Thor | Hafnarfjordur (HOME) | 2.20 | 1-2 | VAR | `b8dd5ace-5b9c-4159-ada5-f3890bf53738` |
| 441 | 2026-10-24 | 17:00 | Hartlepool – Hornchurch | Hartlepool (HOME) | 2.08 | 2-1 | VAR | `7f95acd5-bc08-4bdd-b749-ac0bd4434ddd` |
| 442 | 2026-10-24 | 17:00 | Merthyr Town – Morecambe | Morecambe (AWAY) | 2.50 | 1-3 | VAR | `4bf18632-60a4-40bf-aed1-dbe2e70999f1` |
| 443 | 2026-10-24 | 17:00 | Montrose – Peterhead | Montrose (HOME) | 2.04 | 3-0 | YOK | `29bbdf8d-5984-4389-9024-67562e3b0191` |
| 444 | 2026-10-24 | 17:00 | Morton – Ayr | Ayr (AWAY) | 2.28 | 0-0 | YOK | `3ee351c9-1e50-46cc-8e62-b83c9af2f1bf` |
| 445 | 2026-10-24 | 17:00 | Preston – West Brom | West Brom (AWAY) | 2.12 | 1-1 | VAR | `42765ebd-6065-4ccd-b260-117cbc63a608` |
| 446 | 2026-10-24 | 17:00 | St Mirren – Dundee | St Mirren (HOME) | 2.36 | 2-1 | VAR | `59921890-28ac-4cc0-aa61-64c8e569cef8` |
| 447 | 2026-10-24 | 17:00 | Stevenage – MK Dons | Stevenage (HOME) | 2.10 | 0-1 | YOK | `317ec8c5-29d9-40d6-8b31-457bd5bfa7d1` |
| 448 | 2026-10-24 | 17:00 | Torquay – Maidstone Utd | Torquay (HOME) | 2.16 | 1-1 | VAR | `203e94b6-09f4-47d7-b46b-a3375ba91021` |
| 449 | 2026-10-24 | 17:00 | Yeovil – Altrincham | Yeovil (HOME) | 2.12 | 1-2 | VAR | `abddf608-8096-400c-ac6f-c0ce09e52eda` |
| 450 | 2026-10-24 | 17:00 | York City – Port Vale | York City (HOME) | 2.08 | 2-0 | YOK | `0e5f8a33-0c16-42e8-8f8a-efb3af7324bc` |
| 451 | 2026-10-24 | 17:15 | Leganes – Mallorca | Mallorca (AWAY) | 2.30 | 1-1 | VAR | `735f7bda-d88c-40fe-ad3b-fa2093a3328b` |
| 452 | 2026-10-24 | 17:15 | Racing Santander – Espanyol | Racing Santander (HOME) | 2.40 | 2-1 | VAR | `a3201964-d61e-4e3c-9d94-75066f07fd4d` |
| 453 | 2026-10-24 | 18:00 | Gyori – Ujpest | Gyori (HOME) | 2.44 | 1-0 | YOK | `1b4ddcc9-1833-485a-9281-d49f8a4fc1bf` |
| 454 | 2026-10-24 | 18:00 | IK Brage – Osters | IK Brage (HOME) | 2.06 | 4-5 | VAR | `8552a934-97d4-48eb-9650-40073730e0a1` |
| 455 | 2026-10-24 | 18:00 | WSG Wattens – Grazer AK | WSG Wattens (HOME) | 2.28 | 1-1 | VAR | `12d9c6c0-a95a-4796-bfe4-6b035fb01b6b` |
| 456 | 2026-10-24 | 18:30 | La Serena – Deportes Concepcion | La Serena (HOME) | 2.50 | 3-1 | VAR | `4485f70b-5a73-41fe-94dc-38d407814d5a` |
| 457 | 2026-10-24 | 18:30 | US Savoia 1908 – Cosenza | US Savoia 1908 (HOME) | 2.32 | 1-1 | VAR | `71722023-d72c-4de5-8ca8-14686c2a6a54` |
| 458 | 2026-10-24 | 18:45 | Hapoel Kiryat Shmona – Bnei Sakhnin | Hapoel Kiryat Shmona (HOME) | 2.36 | 0-1 | YOK | `431f8ace-cb32-41e1-ab6e-d62f98c20314` |
| 459 | 2026-10-24 | 19:00 | Al Hidd – Manama Club | Al Hidd (HOME) | 2.36 | 1-1 | VAR | `9e63806f-6695-4ab9-b810-535f20301646` |
| 460 | 2026-10-24 | 19:00 | Anorthosis – Omonia FC Aradippou | Anorthosis (HOME) | 2.14 | 2-0 | YOK | `94894fdd-ead8-4e36-aed6-c3c404695b59` |
| 461 | 2026-10-24 | 19:00 | ASO Chlef – MB Rouissat | ASO Chlef (HOME) | 2.02 | 1-1 | VAR | `9c125fb4-56df-444d-99e7-f0ff764597bc` |
| 462 | 2026-10-24 | 19:00 | FC Zurich – Luzern | Luzern (AWAY) | 2.48 | 2-1 | VAR | `7079966b-4b81-45f2-b7ad-d0ce598e7d31` |
| 463 | 2026-10-24 | 19:00 | Gor Mahia FC – Bandari FC (Kenya) | Gor Mahia FC (HOME) | 2.50 | 1-0 | YOK | `48c23816-e840-4a3d-9e56-f83a5193b2bb` |
| 464 | 2026-10-24 | 19:00 | Samsunspor – Amed Sportif Faaliyetler | Amed Sportif Faaliyetler (AWAY) | 2.38 | 1-2 | VAR | `ac9c10a6-823e-4a03-9407-73852bedb3e8` |
| 465 | 2026-10-24 | 19:00 | Servette – FC Vaduz | Servette (HOME) | 2.12 | 2-1 | VAR | `554a2b6d-23c5-461e-8c04-a9a895ac5be2` |
| 466 | 2026-10-24 | 19:30 | Asteras Tripolis – Levadiakos | Asteras Tripolis (HOME) | 2.14 | 0-0 | YOK | `1f6806bb-7c33-4214-8eec-d0e4f47d06a1` |
| 467 | 2026-10-24 | 19:30 | Chelsea – Tottenham | Chelsea (HOME) | 2.02 | 0-2 | YOK | `ad5943ab-f8e4-431c-906b-dc5733095413` |
| 468 | 2026-10-24 | 19:30 | Las Palmas – Sociedad B | Las Palmas (HOME) | 2.36 | 1-0 | YOK | `bad6c89e-f4d4-4bc8-b760-bafe7d1ee566` |
| 469 | 2026-10-24 | 19:30 | Manta FC – Deportivo Cuenca | Manta FC (HOME) | 2.20 | 0-2 | YOK | `00ef1f8c-1239-4281-af7b-0a5420dcfc0a` |
| 470 | 2026-10-24 | 19:30 | Valencia – Villarreal | Villarreal (AWAY) | 2.14 | 1-2 | VAR | `79359648-69f6-44ec-bc8d-15b00c8565b0` |
| 471 | 2026-10-24 | 20:00 | Alverca – Arouca | Alverca (HOME) | 2.26 | 0-1 | YOK | `8910689e-65bd-4144-b033-13887cad8a92` |
| 472 | 2026-10-24 | 20:00 | Farense – Penafiel | Farense (HOME) | 2.06 | 1-4 | VAR | `bde50741-a45b-4677-ba99-863fddbc1043` |
| 473 | 2026-10-24 | 20:00 | JS Saoura – ES Ben Aknoun | JS Saoura (HOME) | 2.08 | 0-0 | YOK | `f9514e16-f52a-4266-a397-7fdbdb8f9906` |
| 474 | 2026-10-24 | 20:30 | Arezzo – Benevento | Benevento (AWAY) | 2.46 | 0-3 | YOK | `bd00feec-3b48-4982-bd15-54c021a6e26d` |
| 475 | 2026-10-24 | 20:45 | Banfield – Lanus | Lanus (AWAY) | 2.20 | 1-1 | VAR | `89ec6062-69b3-4f34-b2f4-40865743f310` |
| 476 | 2026-10-24 | 21:00 | FCSB – Rapid Bucharest | FCSB (HOME) | 2.46 | 4-1 | VAR | `4ff1baeb-16e0-4dc4-9074-2b516ab3eda0` |
| 477 | 2026-10-24 | 21:00 | Union de Touarga – Wydad Casablanca | Wydad Casablanca (AWAY) | 2.44 | 0-1 | YOK | `8a833c42-43a0-4fa9-8db1-47b0d179df30` |
| 478 | 2026-10-24 | 21:30 | Longford – UCD | UCD (AWAY) | 2.36 | 0-2 | YOK | `5dbc4032-6614-44d3-b79a-af66449df5ab` |
| 479 | 2026-10-24 | 21:30 | Nurnberg – Kaiserslautern | Nurnberg (HOME) | 2.20 | 0-1 | YOK | `b62970b8-30cd-4e23-b41b-a7bedadc37e9` |
| 480 | 2026-10-24 | 21:45 | RAAL La Louviere – Zulte-Waregem | Zulte-Waregem (AWAY) | 2.46 | 3-0 | YOK | `540de7e3-a720-4204-aca9-0ca15166bd30` |
| 481 | 2026-10-24 | 22:00 | ADO Den Haag – Heerenveen | Heerenveen (AWAY) | 2.06 | 2-3 | VAR | `3c40dd83-563a-4dd8-93ac-4d607101d801` |
| 482 | 2026-10-24 | 22:00 | Avai – Botafogo SP | Avai (HOME) | 2.40 | 0-2 | YOK | `df460e6d-1cb8-4f42-8718-267b0531be3c` |
| 483 | 2026-10-24 | 22:30 | Internacional – Botafogo FR | Internacional (HOME) | 2.12 | 3-0 | YOK | `4a3638f7-44a1-44ea-9735-5faef2d68439` |
| 484 | 2026-10-24 | 22:30 | Mirassol – Sao Paulo | Mirassol (HOME) | 2.38 | 1-1 | VAR | `daf665d6-953a-40fa-8fad-1526c5e45603` |
| 485 | 2026-10-24 | 23:00 | Nacional (Par) – Sportivo Trinidense | Nacional (Par) (HOME) | 2.50 | 0-1 | YOK | `88e42995-6f39-4524-9204-884ea3f10723` |
| 486 | 2026-10-24 | 23:00 | Quilmes – San Martin de Tucuman | Quilmes (HOME) | 2.14 | 2-1 | VAR | `996fba95-0659-402b-92d9-02e2d1e7fce9` |
| 487 | 2026-10-24 | 23:00 | Talleres – Defensa y Justicia | Talleres (HOME) | 2.50 | 1-2 | VAR | `21e0782c-f0c7-4e0e-a76e-a3006fafd8da` |
| 488 | 2026-10-24 | 23:00 | Xelaju – CSD Municipal | Xelaju (HOME) | 2.50 | 1-0 | YOK | `94a4bb71-8965-4cda-b6e2-e8b5d57431ca` |
| 489 | 2026-10-24 | 23:15 | Cusco FC – Sporting Cristal | Cusco FC (HOME) | 2.02 | 3-1 | VAR | `974267f5-8c7b-41a9-956e-8f2a5960705d` |
| 490 | 2026-10-24 | 23:30 | Boyaca Patriotas – Envigado | Boyaca Patriotas (HOME) | 2.34 | 0-2 | YOK | `77a9a97e-5859-45c0-b762-e244c9fa2e96` |
| 491 | 2026-10-24 | 23:30 | CSD Rangers – Cobreloa Calama | CSD Rangers (HOME) | 2.18 | 0-1 | YOK | `b7a14e1b-9ad4-48b8-80cc-79292b814e83` |
| 492 | 2026-10-25 | 16:00 | FK Aktobe – Kairat Almaty | Kairat Almaty (AWAY) | 2.26 | 2-2 | VAR | `5610f557-e2e6-47cf-bfd9-8a359f9f80ef` |
| 493 | 2026-10-25 | 16:30 | Foggia – Cavese 1919 | Foggia (HOME) | 2.30 | 1-0 | YOK | `8878c1f5-4331-4c72-a9ff-e1f80e64196f` |
| 494 | 2026-10-25 | 16:30 | NEC Nijmegen – FC Groningen | NEC Nijmegen (HOME) | 2.34 | 2-2 | VAR | `168a7b78-c80f-4e0a-a93a-e0ca61c7248c` |
| 495 | 2026-10-25 | 16:30 | PSV – Feyenoord | PSV (HOME) | 2.18 | 1-1 | VAR | `d5096fec-8a9a-4fc7-ba3a-2a2c294222d9` |
| 496 | 2026-10-25 | 16:30 | Sandnes Ulf – Lyn | Sandnes Ulf (HOME) | 2.48 | 2-1 | VAR | `50c01960-76a7-4f95-8ae3-157a8a833114` |
| 497 | 2026-10-25 | 16:30 | Sassari Torres – FC Guidonia Montecelio 1937 | Sassari Torres (HOME) | 2.40 | 2-0 | YOK | `f68f872d-14f8-4100-9738-02e4d1e92207` |
| 498 | 2026-10-25 | 16:45 | Jagiellonia Bialystock – Wisla Plock | Jagiellonia Bialystock (HOME) | 2.02 | 1-0 | YOK | `073560c9-6189-47e2-885d-08e38a523d32` |
| 499 | 2026-10-25 | 17:00 | Crystal Palace – Newcastle | Newcastle (AWAY) | 2.46 | 0-2 | YOK | `f88544f2-6262-46f7-b410-ef2537b8f990` |
| 500 | 2026-10-25 | 17:00 | Everton (W) – Aston Villa (W) | Everton (W) (HOME) | 2.34 | 2-3 | VAR | `5eb28158-2c2a-4ed4-826d-45e051e5536a` |
| 501 | 2026-10-25 | 17:00 | Farul Constanta – Otelul Galati | Farul Constanta (HOME) | 2.06 | 4-3 | VAR | `24bcad6c-edda-4851-a19f-683432ceda5a` |
| 502 | 2026-10-25 | 17:00 | Genoa – Venezia | Genoa (HOME) | 2.26 | 1-0 | YOK | `121a249a-40e2-4d36-945f-be1356d15833` |
| 503 | 2026-10-25 | 17:00 | Helsingborgs – Ljungskile | Helsingborgs (HOME) | 2.32 | 1-1 | VAR | `dccb26f7-7292-43ab-b512-7922cab27f71` |
| 504 | 2026-10-25 | 17:00 | Liverpool – Brighton | Liverpool (HOME) | 2.24 | 2-0 | YOK | `330f5435-fdc2-436c-8afc-4b195672dd00` |
| 505 | 2026-10-25 | 17:00 | Man Utd – Bournemouth | Man Utd (HOME) | 2.40 | 0-3 | YOK | `fbb8f5d3-b2c6-429b-97c9-f771fd644055` |
| 506 | 2026-10-25 | 17:00 | Monaco – Lille | Monaco (HOME) | 2.04 | 1-1 | VAR | `27362c89-51b1-4a10-afad-da23485736b7` |
| 507 | 2026-10-25 | 17:00 | Motherwell – Hearts | Hearts (AWAY) | 2.16 | 0-2 | YOK | `bce2caee-ca06-4b54-8127-bd99dde6ad26` |
| 508 | 2026-10-25 | 17:30 | Hoffenheim – Leverkusen | Leverkusen (AWAY) | 2.18 | 3-0 | YOK | `8b5877bd-e474-48f3-9018-438d6fba4337` |
| 509 | 2026-10-25 | 17:30 | Puskas Akademia – Nyiregyhaza | Puskas Akademia (HOME) | 2.12 | 1-2 | VAR | `1d6b8bd3-95f3-467d-9da1-eed67f0b03ac` |
| 510 | 2026-10-25 | 18:15 | Cadiz – AD Ceuta FC | Cadiz (HOME) | 2.18 | 3-1 | VAR | `0723e521-8233-45c8-8d84-e4ecd5fa3e02` |
| 511 | 2026-10-25 | 18:15 | Celta Vigo – Betis | Betis (AWAY) | 2.34 | 0-0 | YOK | `9d47191a-5e71-4e44-8336-839ff2628655` |
| 512 | 2026-10-25 | 18:30 | Balzan FC – Birkirkara | Birkirkara (AWAY) | 2.40 | 0-2 | YOK | `cfba9710-aa96-4aa2-91f2-402870e49d2c` |
| 513 | 2026-10-25 | 18:30 | Nublense – Coquimbo Unido | Coquimbo Unido (AWAY) | 2.46 | 2-1 | VAR | `e0773e6e-f960-4032-b57a-e162f6ac84bb` |
| 514 | 2026-10-25 | 18:30 | Preussen Munster – Fortuna Koln | Preussen Munster (HOME) | 2.20 | 1-0 | YOK | `bc82afca-6adc-4cc9-aac8-5f467e3cf51c` |
| 515 | 2026-10-25 | 19:00 | Atenas – Centro Atletico Fenix | Centro Atletico Fenix (AWAY) | 2.30 | 4-0 | YOK | `142470ad-e997-4690-ac07-edde9c410c98` |
| 516 | 2026-10-25 | 19:00 | Goztepe – Corum Belediyespor | Goztepe (HOME) | 2.26 | 2-0 | YOK | `19753f5b-17da-4ce5-bbd7-3f3894d2265d` |
| 517 | 2026-10-25 | 19:00 | Keciorengucu – Bursaspor | Bursaspor (AWAY) | 2.10 | 2-4 | VAR | `6a7e45cd-d332-4d8c-87d5-44773fedd8d0` |
| 518 | 2026-10-25 | 19:00 | Kristiansund – KFUM Oslo | Kristiansund (HOME) | 2.50 | 2-2 | VAR | `96d87e11-2789-4a3e-a10f-3042ddfda092` |
| 519 | 2026-10-25 | 19:00 | LASK Linz – Red Bull Salzburg | LASK Linz (HOME) | 2.26 | 1-3 | VAR | `0f8d5980-92f6-4905-b46d-9d9e34e07d78` |
| 520 | 2026-10-25 | 19:00 | Lillestrom – Brann | Lillestrom (HOME) | 2.38 | 3-2 | VAR | `3224f64c-c18a-433c-a609-f7cf24e1803f` |
| 521 | 2026-10-25 | 19:00 | Podbeskidzie B-B – Stal Rzeszow | Podbeskidzie B-B (HOME) | 2.14 | 2-1 | VAR | `5eb83732-39e5-4079-9ac0-1737399872f7` |
| 522 | 2026-10-25 | 19:15 | Auxerre – Le Mans | Auxerre (HOME) | 2.20 | 1-1 | VAR | `20f7bba9-face-455e-9e6f-6e7de1de5cfd` |
| 523 | 2026-10-25 | 19:15 | Verona – Pisa | Verona (HOME) | 2.44 | 1-1 | VAR | `a25ad1f1-c889-4ae6-ab28-1360fb72a5b3` |
| 524 | 2026-10-25 | 19:30 | CD Leones del Norte – Libertad FC | CD Leones del Norte (HOME) | 2.12 | 4-1 | VAR | `692afe96-99f6-459c-a98c-18c7e0870f3e` |
| 525 | 2026-10-25 | 19:30 | Pro Vercelli – AC Ospitaletto | AC Ospitaletto (AWAY) | 2.24 | 2-1 | VAR | `49e8597e-e9fd-4272-8714-d4b22333f49a` |
| 526 | 2026-10-25 | 20:00 | A.E.L. – Aris FC Limassol | Aris FC Limassol (AWAY) | 2.02 | 1-3 | VAR | `ec088ff3-9545-4e96-9940-da674f82f86a` |
| 527 | 2026-10-25 | 20:00 | AGF – Viborg | AGF (HOME) | 2.44 | 2-1 | VAR | `f5e111b8-e8fd-4960-a96a-aa13e1f0b2dc` |
| 528 | 2026-10-25 | 20:00 | FC Kosice – Zilina | FC Kosice (HOME) | 2.18 | 2-2 | VAR | `0afc8f8c-c438-4006-b854-fe275fb38f96` |
| 529 | 2026-10-25 | 20:30 | Dinamo Tirana – Egnatia Rrogozhine | Egnatia Rrogozhine (AWAY) | 2.38 | 2-1 | VAR | `6e05216c-499a-4c54-a831-4074a7f217b0` |
| 530 | 2026-10-25 | 20:30 | Gent – Anderlecht | Gent (HOME) | 2.40 | 4-0 | YOK | `834be79b-420e-44fa-b1af-694eab8c8b21` |
| 531 | 2026-10-25 | 20:45 | Aldosivi – Belgrano | Belgrano (AWAY) | 2.14 | 1-0 | YOK | `b7d878ef-43a0-43a7-aed5-737c87333bbf` |
| 532 | 2026-10-25 | 21:00 | Kawkab Marrakech – DHJ El Jadida | Kawkab Marrakech (HOME) | 2.40 | 1-1 | VAR | `a8cebf24-d846-45e7-a91a-ac774dc3bd51` |
| 533 | 2026-10-25 | 21:00 | Rio Ave – Famalicao | Famalicao (AWAY) | 2.12 | 0-4 | YOK | `7eea97f9-15f1-4f80-98f2-21d13d1bbfe3` |
| 534 | 2026-10-25 | 21:30 | Waldhof Mannheim – Hoffenheim II | Waldhof Mannheim (HOME) | 2.42 | 4-1 | VAR | `232a786d-1059-4c43-b5b8-f7aa1319a23e` |
| 535 | 2026-10-25 | 22:00 | Az Alkmaar – FC Twente | Az Alkmaar (HOME) | 2.24 | 0-2 | YOK | `30f3fe21-cfb9-4fdf-b71b-b41637387b57` |
| 536 | 2026-10-25 | 22:00 | CA Temperley – Chacarita | CA Temperley (HOME) | 2.18 | 0-1 | YOK | `50ff58f1-5caf-4277-b0c6-5d56ccd9b71e` |
| 537 | 2026-10-25 | 22:30 | Club F de la Mora – Deportivo Santani | Deportivo Santani (AWAY) | 2.34 | 1-3 | VAR | `6dbd5e79-9c7c-4f25-accb-d3deedc6f502` |
| 538 | 2026-10-25 | 22:30 | General Caballero – 12 de Junio de Villa Hayes | General Caballero (HOME) | 2.48 | 0-0 | YOK | `c57adffd-b004-4d9f-bcd8-00782da22cd3` |
| 539 | 2026-10-25 | 23:00 | CA Independiente – Boca Juniors | Boca Juniors (AWAY) | 2.24 | 0-1 | YOK | `c16a7e24-7d82-43fc-8b43-29728fbd7fd3` |

## Yorum
Ana 3 grubun KG VAR yüzdeleri **52,45 / 54,75 / 56,03**; farklar sınırlı ve tek başına istatistiksel anlamlı veya oyun değeri kanıtı değil. 2.21–2.30 alt grubu düşük olduğundan basit monoton ilişki de görülmüyor. Geriye dönük fiyat bandı optimizasyonu, sonraki maçların isabetini kanıtlamaz.

Önceki iki denetim:
- [1.01–1.50](SXF_FAVORI_1X2_1_01_1_50_KG_VAR_09_25_Ekim_2026_AUDIT_v1.md)
- [1.50–2.00](SXF_FAVORI_1X2_1_50_2_00_KG_VAR_09_25_Ekim_2026_AUDIT_v1.md)

**Durum:** Araştırma tamamlandı; SXF v0.4 kanonik motorları değiştirilmedi. Supabase salt okunur analiz, kalıcı rapor GitHub.
