# CAPİTALE SXF Araştırma — 13 Ekim 2026

> **Retrospektif araştırma; özgün tarihte yayımlanmış canlı tarama değildir.** Sonuç/skor ya da T-6 sonrası bilgi seçimlerde kullanılmadı.

**Maç aralığı:** 16:00–24:00 TSİ · **Karar:** Her fikstürde T-6, veri tam değilse T-8 fallback · **Mod:** `CHECKPOINT_RESEARCH_T6_FALLBACK_T8` · **SXF:** DRAFT v0.4
**Kapsam:** 147 maç · 44 veri bulunan maç · 16 sinyalli maç · 19 seçim · 33 motor etiketi

## 1X2 — 11 seçim

| Saat / Maç → Tercih | Aktif motorlar | SXF oranı | Para % | Para £ | Karar |
|---|---|---:|---:|---:|---|
| 19:45 FC Sabah – Slavia Prague → **Slavia Prague** | EARLY_CORE | 2,12 | 76,1 | 14.607 | T-6 |
| 21:00 Walsall – Fulham U21 → **Fulham U21** | EARLY_T12 | 3,75 | 95,7 | 3.358 | T-6 |
| 21:45 Bristol City – Blackburn → **Bristol City** | EARLY_CORE, EARLY_T12, V1, HEAVY | 2,18 | 86,2 | 15.692 | T-6 |
| 21:45 Burnley – Charlton → **Burnley** | EARLY_T12, V1 | 1,69 | 90,1 | 2.252 | T-6 |
| 21:45 Millwall – Swansea → **Millwall** | EARLY_T12 | 2,54 | 88,5 | 1.808 | T-6 |
| 22:00 Atletico Madrid – Man Utd → **Atletico Madrid** | EARLY_CORE | 1,96 | 78,1 | 380.610 | T-6 |
| 22:00 Birmingham – Preston → **Birmingham** | EARLY_CORE, EARLY_T12, V1, V2, HEAVY | 1,53 | 91,8 | 52.610 | T-6 |
| 22:00 Galatasaray – Barcelona → **Barcelona** | EARLY_CORE, EARLY_T12 | 1,31 | 87,1 | 374.213 | T-6 |
| 22:00 RB Leipzig – PSV → **RB Leipzig** | EARLY_CORE, EARLY_T12, V1, V2, HEAVY | 1,64 | 84,2 | 220.236 | T-6 |
| 22:00 Villarreal – Napoli → **Villarreal** | EARLY_CORE | 2,18 | 64,7 | 74.621 | T-6 |
| 22:15 USM Alger – JS Saoura → **USM Alger** | V1, V2 | 1,56 | 93,1 | 1.137 | T-6 |

## Üst 2.5 — 2 seçim

| Saat / Maç → Tercih | Aktif motorlar | SXF oranı | Para % | Para £ | Karar |
|---|---|---:|---:|---:|---|
| 22:00 Arsenal – Lille → **Üst 2.5** | STABLE_OVER_2_5 | 1,57 | 73,9 | 2.241 | T-6 |
| 22:00 Villarreal – Napoli → **Üst 2.5** | STABLE_OVER_2_5 | 1,75 | 65,6 | 3.237 | T-6 |

## KG VAR / BTTS YES — 2 seçim

| Saat / Maç → Tercih | Aktif motorlar | SXF oranı | Para % | Para £ | Karar |
|---|---|---:|---:|---:|---|
| 22:00 Atletico Madrid – Man Utd → **KG VAR** | BTTS_YES | 1,68 | 60,0 | 5.308 | T-6 |
| 22:00 Inter – Club Brugge → **KG VAR** | BTTS_YES | 1,83 | 64,6 | 13.263 | T-6 |

## SURPRISE — yenilmeme riski — 4 seçim

| Saat / Maç → Tercih | Aktif motorlar | SXF oranı | Para % | Para £ | Karar |
|---|---|---:|---:|---:|---|
| 19:00 Poland (W) – Belgium (W) → **Poland (W)** | SURPRISE_TEAM | 3,25 | 68,0 | 2 | T-6 |
| 20:00 Petrojet – Wadi Degla → **Petrojet** | SURPRISE_TEAM | 3,40 | 56,6 | 63 | T-6 |
| 21:00 Walsall – Fulham U21 → **Fulham U21** | SURPRISE_TEAM | 3,75 | 95,7 | 3.358 | T-6 |
| 21:45 Wrexham – West Brom → **West Brom** | SURPRISE_TEAM | 3,40 | 51,1 | 389 | T-6 |

## Motor denetim sonuçları

| Motor | Etiket sayısı |
|---|---:|
| SURPRISE_TEAM | 4 |
| EARLY_CORE | 7 |
| EARLY_T12 | 7 |
| V1 | 5 |
| HEAVY | 3 |
| STABLE_OVER_2_5 | 2 |
| BTTS_YES | 2 |
| V2 | 3 |
| **Toplam** | **33** |

## CORE Retention-55 iptalleri

| Maç / Taraf | CORE başlangıcı | En düşük pay | İlk kırılma (UTC) |
|---|---|---:|---|
| İptal yok | — | — | — |

## 1,30 altı oran filtresi


- Norway (W) – Romania (W) → Norway (W): 1,04 (EARLY_T12)
- England (W) – Greece (W) → England (W): 1,04 (EARLY_T12)
- Arsenal – Lille → Arsenal: 1,24 (EARLY_CORE, EARLY_T12)
- Inter – Club Brugge → Inter: 1,27 (EARLY_CORE, EARLY_T12)
- Viking – Bayern Munich → Bayern Munich: 1,14 (EARLY_CORE, EARLY_T12)

## Veri kapsamı

| Piyasa | T-6 tam | T-8 tam | Kullanılabilir |
|---|---:|---:|---:|
| 1X2 | 36 | 34 | 36 |
| OU25 | 24 | 22 | 24 |
| BTTS | 24 | 22 | 24 |

**T-8 fallback kullanılan piyasa:** 0 · **Hiç tam piyasa bulunmayan maç:** 103.

- FC Giugliano – Inter Milan (Res) (d0e75e9c-791d-4e12-9dcb-a0f1436d83b8)
- FK Cadca – Tatran Presov (2297ec83-a17a-4713-9dff-853a1d69651e)
- Lugazi FC – Bul FC (32966d46-4af4-4ff1-a172-3655163bcb82)
- Ntugasaze FC – Kampala City Council (3708abb6-ae56-4756-acd1-8f4d1c42a107)
- OFK Banik Lehota – Zemplin (ff78fc1e-e87b-4528-87d6-1103ca4c4b59)
- Queens Park Rangers U21 – Cardiff City U21 (6420faa1-fb8e-4eba-b7f7-7c8018c91ebf)
- SK Svaty Jur – Nove Zamky (8e744d34-4406-4ca2-8a11-6f9aaa99cd6f)
- Tanzania (W) – Botswana (W) (bb7a4d90-8a83-419b-978a-b4c18b7996a1)
- Zimbabwe (W) – Malawi (W) (99d4ec1f-6bd7-485c-84fa-b3277e0e05bf)
- Dinthar FC – Mizoram Police (be82779f-2324-411c-b983-a41c2a770f3a)
- Quess East Bengal – AL Shorta Baghdad (d1671119-7d43-4542-9831-4e508b6a1c60)
- Abo Qair Semads – Asyut Petroleum (a7139b4b-10fe-4241-a64d-15a83d7ea60d)
- ASM Oran – Taghit (e717c71b-90cd-4d49-8a19-c5b23fffbac3)
- CA Batna – AS Khroub (d19c5f4f-a317-40a3-b879-bd71348322c4)
- CR Beni Thour – IRB Nezla (d687dfa0-d5e4-469f-9c83-75ffe13a1878)
- Equatorial Guinea (W) – Burkina Faso Women (890b4fd2-1606-4013-8161-94ebfb27b0c3)
- ESM Kolea – ES Mostaganem (ec76dca8-ab48-4d94-827a-620eb92ef8b6)
- Famalicao U23 – Estrela U23 (074ead73-7bbc-4c64-85f5-18efdc37a69c)
- Farense U23 – União de Leiria U23 (c9dfed0b-84fd-4893-b601-cdfa55f57f72)
- Felgueiras U23 – Rio Ave FC U23 (302d43f0-2f8f-45ad-a7f0-2b66e9ffe3e6)
- Gil Vicente U23 – Vizela U23 (aea7e9f3-7a2d-419c-9bdf-3276f3d50e5a)
- JSD Jijel – Msp Batna (8c52631e-4819-4aa0-9834-9d430c0275e1)
- JSM Skikda – NC Magra (bf3a2ec8-bf42-438a-9fd5-f6c2286eb8cc)
- Juventus B – Lumezzane (f16ebbb3-ea32-4042-b283-1985f202991f)
- MC Saida – JSM Tiaret (16190084-ad97-4827-9059-a8b1ce420ed0)
- National Bank – El Geish (4652d133-7411-4874-b831-eae98af204d7)
- NRB Teleghma – Usm Annaba (90c6e5db-ec94-4f7e-b924-1f323a547d6f)
- Sariyer G.K. – Bodrum Belediyesi Bodrumspor (ca26554e-792c-48d4-8246-9fb071c4061e)
- US Chaouia – Paradou (8d9dba3b-79e3-47a7-b74e-eeb16dadc832)
- Villarreal U19 – Napoli U19 (6aedb20a-589a-4db3-9e05-97b7e68895ee)
- WA Tlemcen – USM Blida (cef60804-dd90-4df9-a36e-389a0d5e8c00)
- Qatar SC Doha – Al Zawraa (be08b1fe-ff7b-4658-ab9b-192111543603)
- Montana – Ludogorets Razgrad B (3783155a-719a-45bf-8ce1-77113b7d1145)
- Nigeria (W) – Comoros (W) (c8982e11-f329-4e5a-b6e9-5882462ef002)
- Parnu JK Vaprus – Nomme Kalju (e236e3c0-8c3f-41f4-9f7b-878fb65eef82)
- Slovenia (W) – Turkey (W) (0e765d5d-ceb4-40d5-a456-866d09ea50c1)
- Ukraine (W) – Slovakia (W) (0cd2445b-e440-4cfc-88df-bcc2c178d388)
- Al-Nassr Riyadh U21 – Al Tadamon U21 (2cecc2c5-31be-4fbc-a049-e63b83cdfe1b)
- Al Bukayriyah – Al-Zulfi SC (b97b16a9-6f8a-4234-899b-ec00638b2048)
- Al Akhdoud U21 – Al Jabalain U21 (778c3232-273d-454b-b6bd-465d53babc86)
- Al Hazm U21 – Damac FC U21 (d337e0f7-9d26-4bf3-a1a4-9af449045974)
- Al Orubah U21 – Al-Fayha U21 (c13b2daa-022e-4ce2-ba1b-d21d60690c7a)
- Hapoel Umm Al Fahm – Shefa-amr FC (4a0d4fa4-5212-4763-8a9d-32e873c8a7a3)
- SK Artis Brno B – FC Zbrojovka Brno B (910e05ca-cc4b-44b8-baa6-5984e89894f4)
- Germany (w) – Japan (W) (9bd27ca4-71ca-477a-bf8c-f9faf37521cc)
- Al Nasr (UAE) – Al Riffa (4315f853-6ecb-4da7-a72f-359710d606c2)
- Al Seeb – Al Hussein (c90a2c82-4d44-4018-b034-79e126c7ec8e)
- Al-Sadd – Al-Hilal (c022465f-997f-4729-92ab-a08aaee5ed3e)
- Arad FC – MK Kfar Saba 1928 (694d2a82-93cf-4a5c-94db-36c5c02f1403)
- Bnei Yehuda – Hapoel Akko (3a960072-07a5-404f-844e-b2b90504e47e)
- KF Gjilani – Drenica Skenderaj (2ae00f7b-15dd-4972-952b-40c13841422e)
- Penafiel U23 – Benfica U23 (147469a0-c0e6-45a2-a505-67409a3ddaf3)
- Peru (W) – Philippines (W) (5e0fae72-e8ad-4ac8-9d76-9937c9b1d8fb)
- SC Uniao Torreense U23 – Leixoes U23 (b8b47e69-2af6-4859-9016-c2108021be41)
- Simba – Mashujaa FC (79883d1c-6ba8-4537-b0dd-8f764ab44b4a)
- Zambia (W) – Uganda (W) (b918fcda-db5c-4362-a124-3b662f732fcf)
- Italy (W) – Belarus (W) (40eebf22-3a05-43d7-b5cb-2d25f814a8cb)
- ASO Chlef – MC Alger (ee5a4d6a-02f3-42f5-8b19-567d7baca5d8)
- Al Ittihad (EGY) – El Gounah (038a0f5b-e02a-41a8-a708-69965d8255df)
- Al-Ula FC – Al Jeel (61d93f2b-4ff1-4188-b6c8-b658a4f0e940)
- Luxembourg (W) – Montenegro (W) (c84b98f4-a682-43b0-ab10-3510a09c0db1)
- Mali (W) – Benin (W) (158e1406-a0c4-4396-aac2-d17e51cb78d9)
- Saarbrucken – Duisburg (e4488a52-6c9e-4718-8b03-4809eacd6f1d)
- Senegal (W) – Tunisia (W) (97979eed-a2c3-44a8-9325-91311fc15042)
- TSV Havelse – Wurzburger Kickers (b1e44ea5-f986-4a55-a7e1-a2ff7a7cc6c4)
- Durban City – Amazulu (7bcead5a-19e9-4623-b63f-1a128754fb8b)
- Kaizer Chiefs – Stellenbosch FC (a48daca8-dccf-4049-8d7d-31a91c402d65)
- Richards Bay FC – Mamelodi Sundowns (3c224e3a-d14c-440a-9e17-d6e1b010ecc5)
- Boston Utd – Southampton U21 (54734d09-b97e-43f1-87f6-e2b1a707853c)
- Bromley U21 – Coventry City U21 (4d333538-c73c-476f-bbb1-d48b9a470f2e)
- CA Banfield (Res) – Gimnasia Esgrima (Res) (b8fd8e63-726f-4455-b9c0-038ba9a33ffd)
- CA Independiente (Res) – CA Huracan BA (Res) (3a685d63-c219-452e-9256-fe910608374c)
- Cheltenham – Tottenham U21 (3936f740-9094-488d-b5ee-2500c3fb6149)
- FC Halifax Town – Stoke U21 (276c2a7a-5283-40a0-b228-3a9c4acb8097)
- Gateshead – Wolves U21 (f634449f-65e5-4366-87f7-8929c8dd6c97)
- Gillingham – Brighton U21 (4d7be415-0d7d-4ab0-b8cc-b23405bb579a)
- NEOM Sports Club – Shab Hadramawt (c8e9b61e-86e5-47b9-80d3-5e83cb2e385c)
- Oldham – Leeds United U21 (cb4feae8-2dcc-4cc1-ad58-f3b17584d6ef)
- Quilmes (Res) – Newells Old Boys (Res) (e8dd5e6b-7c99-4d30-b651-b4a963e3d306)
- Reading – Chelsea U21 (208b5004-d21b-4c5f-815f-90e061be16ac)
- RSB Berkane – Club R Zemamra (9c5f1660-3c9a-46a1-9634-cf356c6a7bec)
- Scunthorpe – Derby U21 (996fbe0a-ff85-4c27-8e28-89d84bb3af2b)
- Solihull Moors – Everton U21 (911bcbe2-78c4-4b19-a8a0-06d58f717ca7)
- Sutton Utd – West Brom U21 (a43a8928-ad87-445f-a745-581c70c5f11a)
- Truro City – Birmingham U21 (d71a37f0-71ad-4c9d-a1fa-30204e1923ec)
- Al-Ittihad – Al Ahli (UAE) (f192d5ad-8399-4429-8b5a-dcc43400dfb6)
- Scotland (W) – Czechia (W) (6160ee79-7343-4875-aa47-5d78e5bcbe4f)
- Braintree – West Ham U21 (2d7a67a0-6a20-4256-b7e3-5c1ad7837aba)
- Aldershot – Norwich U21 (71f9f2e2-61e8-4ef2-9d34-2d1b226a5e31)
- Annan – Alloa (3e615a1f-8ddf-43ba-ae7b-693a6040d1eb)
- Berwick – Queen of South (41116e23-059c-4f17-a0e8-5a5b6b16504a)
- Clydebank – Dumbarton (a246edfd-c8f4-479b-8a0f-76e1a658abec)
- Cove Rangers – Formartine Utd (19c46050-ed1f-4a85-9cb1-80ffe1802b76)
- East Kilbride – Kelty Hearts (8b27cd60-7b28-4d58-84d6-4cde02020dcd)
- Ebbsfleet Utd – AFC Totton (12f7e9ef-1188-4870-ab37-ef0280e247c4)
- Edinburgh City – St Mirren B (4ae51fc9-aa37-4a06-9236-3dc9c009f4df)
- Elgin City FC – Aberdeen B (7e8c5340-99e8-4837-9972-ba0763cbf0c0)
- Peterhead – Rangers B (9f8da0c2-d7e3-40bd-8d5b-fd33f8280ca3)
- Ross Co – Forfar (00e0c0fa-51a6-4899-98cc-75a26831d234)
- Spartans – Bonnyrigg (e9373325-9fbe-4b33-a87b-f22c4ad872ce)
- Woking – Leicester U21 (b11d8584-9984-4d43-a3fd-4949188a0660)
- Workington – Whitby Town (2e1bb204-bbfc-4d57-befe-be2c45233544)
- Worthing – Ipswich Town U21 (e2dbd2ec-f07c-47b9-b75b-dd7ca9fb6ee0)

## Denetim ve sınırlar

- EARLY T-72, T-60, T-40, T-24, T-12 başlangıçları ancak tam 1X2 kesitinde tetiklendi. CORE için sonradan gelen tüm erişilebilir 1X2 ham pay kayıtlarında %55 kırılması arandı.
- V1/HEAVY seçilen takımın top-money olması ve eşikleriyle; V2 geçmiş üç saat ham para payı, anchor ve en kötü olumsuz oran artışıyla denetlendi. Eksik geçmişte V2 verilmedi.
- STABLE/PREMIUM bağımsız Üst 2.5 kriterlerine tabi, PREMIUM STABLE'ın yerini alır. SURPRISE doğrudan galibiyet önerisi değildir.
- Fikstür bazında T-6 veri kullanıldı; yalnızca eksik tam piyasa varsa T-8 kullanıldı. Sonuç veya karar sonrasındaki veriler taramaya karıştırılmadı.
- Ham snapshot kaynağının bütün tick geçmişini eksiksiz sakladığı ayrıca onaylanmış değildir; veri yokluğu sinyal değildir.

Tüm 147 maçın kaynak kapsamı, seçim ve motor kanıtları: `sxf-research-2026-10-13-t6-fallback-t8-16to24-v1.json`.
