export type CommunityReview = {
  id: number;
  countryCode: "IT" | "ES" | "NL" | "BE" | "PL" | "HU" | "DE";
  countryName: string;
  displayName: string;
  initials: string;
  localizedText: string;
  englishText: string;
  featured: boolean;
};

export const communityReviews: CommunityReview[] = [
  {
    id: 1,
    countryCode: "IT",
    countryName: "Italy",
    displayName: "Marco R.",
    initials: "MR",
    featured: false,
    localizedText:
      "Gioco più o meno la stessa cifra da circa un mese. Non sono grandi somme, però a fine mese è diventata una bella entrata extra oltre allo stipendio.",
    englishText:
      "I've been staking roughly the same amount for about a month. It's not a huge sum, but by the end of the month it has become a nice extra income on top of my salary.",
  },
  {
    id: 2,
    countryCode: "NL",
    countryName: "Netherlands",
    displayName: "Daan V.",
    initials: "DV",
    featured: false,
    localizedText:
      "Ik heb eerder heel wat tipgroepen geprobeerd. Hier worden slechte dagen tenminste niet weggestopt en kun je aan het einde van de maand het echte totaalplaatje zien.",
    englishText:
      "I've tried quite a few tipster groups before. At least here, bad days are not hidden, and at the end of the month you can see the real overall picture.",
  },
  {
    id: 3,
    countryCode: "HU",
    countryName: "Hungary",
    displayName: "Bence N.",
    initials: "BN",
    featured: false,
    localizedText:
      "Azt szeretem benne a legjobban, hogy nem hajszolja állandóan a magas oddsokat. Kontrolláltabban halad, és hosszú távon sokkal értelmesebbnek tűnik.",
    englishText:
      "What I like most is that it doesn't constantly chase high odds. It moves in a more controlled way and makes much more sense in the long run.",
  },
  {
    id: 4,
    countryCode: "DE",
    countryName: "Germany",
    displayName: "Lukas H.",
    initials: "LH",
    featured: false,
    localizedText:
      "Auf dem Markt gibt es viele Seiten mit leeren Versprechen. Ehrlich gesagt war ich anfangs auch skeptisch, aber nachdem ich es regelmäßig verfolgt habe, habe ich wirklich Ergebnisse gesehen.",
    englishText:
      "There are many pages in this market making empty promises. Honestly, I was skeptical at first too, but after following it consistently, I saw real results.",
  },
  {
    id: 5,
    countryCode: "BE",
    countryName: "Belgium",
    displayName: "Laurent V.",
    initials: "LV",
    featured: true,
    localizedText:
      "J'ai déjà payé pour plusieurs groupes de pronostics et, dans la plupart, ils ne montraient que les gains. Ici, les mauvaises journées sont aussi visibles, donc ça m'a semblé plus fiable. Je ne regrette pas.",
    englishText:
      "I've paid for several tipping groups before, and most of them only showed the wins. Here, the bad days are visible too, which made it feel more trustworthy. I don't regret joining.",
  },
  {
    id: 6,
    countryCode: "IT",
    countryName: "Italy",
    displayName: "Luca B.",
    initials: "LB",
    featured: false,
    localizedText:
      "Mi piace la logica del sistema. Invece di inseguire grandi vincite ogni giorno, procede in modo più regolare. Io lo vedo un po' come gli interessi in banca: con pazienza, si accumula un'entrata in più.",
    englishText:
      "I like the logic behind the system. Instead of chasing big wins every day, it progresses more steadily. I see it a bit like bank interest: with patience, it builds into extra income.",
  },
  {
    id: 7,
    countryCode: "NL",
    countryName: "Netherlands",
    displayName: "Jeroen K.",
    initials: "JK",
    featured: false,
    localizedText:
      "Ik begon met een lidmaatschap van één maand. Toen ik tevreden was met de resultaten, heb ik verlengd. Inmiddels doe ik al meerdere periodes mee.",
    englishText:
      "I started with a one-month membership. Once I was happy with the results, I renewed. I've now stayed for several membership periods.",
  },
  {
    id: 8,
    countryCode: "ES",
    countryName: "Spain",
    displayName: "Sergio M.",
    initials: "SM",
    featured: true,
    localizedText:
      "Al principio solo seguía los Free Bets. Después de unas semanas, los resultados me convencieron y pasé a la membresía. Hasta ahora, ha sido una buena decisión.",
    englishText:
      "At first, I only followed the Free Bets. After a few weeks, the results convinced me to become a member. So far, it has been a good decision.",
  },
  {
    id: 9,
    countryCode: "HU",
    countryName: "Hungary",
    displayName: "Gábor T.",
    initials: "GT",
    featured: false,
    localizedText:
      "Nekem a bizalom volt a legfontosabb. Sokat utánanéztem, egy ideig az ingyenes tippeket figyeltem, és a tagság után is ugyanaz a következetesség maradt.",
    englishText:
      "Trust was the most important thing for me. I did a lot of research and followed the free picks for a while. The same consistency continued after I became a member.",
  },
  {
    id: 10,
    countryCode: "NL",
    countryName: "Netherlands",
    displayName: "Bram S.",
    initials: "BS",
    featured: true,
    localizedText:
      "Je verdient natuurlijk niet elke dag, maar als ik aan het einde van de maand kijk, sta ik in totaal wel in de plus. Ik zocht ook geen losse winnende bet, maar een regelmatig resultaat.",
    englishText:
      "Of course, you don't make money every single day, but when I look at the end of the month, I'm still in profit overall. I wasn't looking for one winning bet either; I wanted consistent results.",
  },
  {
    id: 11,
    countryCode: "DE",
    countryName: "Germany",
    displayName: "Daniel M.",
    initials: "DM",
    featured: false,
    localizedText:
      "Auf dem Markt stellt sich jeder als extrem erfolgreich dar, aber echte Ergebnisse sind schwer zu finden. Hier ist wenigstens klar, was gespielt wurde und wie es ausgegangen ist. Deshalb konnte ich Vertrauen fassen.",
    englishText:
      "Everyone in this market presents themselves as extremely successful, but real results are hard to find. Here, at least, it's clear what was played and how it ended. That's why I was able to trust it.",
  },
  {
    id: 12,
    countryCode: "HU",
    countryName: "Hungary",
    displayName: "Márk V.",
    initials: "MV",
    featured: false,
    localizedText:
      "Nem játszom nagy tétekkel. Fix összeggel haladok, és a hónap végére az összegyűlt nyereség már tényleg olyan, mint egy kis plusz bevétel.",
    englishText:
      "I don't use high stakes. I stick to a fixed amount, and by the end of the month the accumulated profit really feels like a small extra income.",
  },
  {
    id: 13,
    countryCode: "IT",
    countryName: "Italy",
    displayName: "Alessandro C.",
    initials: "AC",
    featured: true,
    localizedText:
      "Mi piace che non punti continuamente su schedine rischiose ad alta quota. L'approccio è più equilibrato e, sul lungo periodo, mi sembra più sensato e sostenibile.",
    englishText:
      "I like that it doesn't constantly rely on risky, high-odds slips. The approach is more balanced and, in the long term, feels more sensible and sustainable.",
  },
  {
    id: 14,
    countryCode: "BE",
    countryName: "Belgium",
    displayName: "Mathias D.",
    initials: "MD",
    featured: false,
    localizedText:
      "Wie twijfelt om mee te doen, zou eerst een paar dagen de Free Bets moeten volgen. Zo heb ik het ook gedaan, en zodra je het systeem ziet, wordt de keuze veel makkelijker.",
    englishText:
      "Anyone unsure about joining should follow the Free Bets for a few days first. That's what I did, and once you see how the system works, the decision becomes much easier.",
  },
  {
    id: 15,
    countryCode: "NL",
    countryName: "Netherlands",
    displayName: "Niels D.",
    initials: "ND",
    featured: false,
    localizedText:
      "In het begin twijfelde ik ook om ervoor te betalen. Er zijn eerlijk gezegd veel slechte voorbeelden in deze markt. Volg eerst het gratis gedeelte en stap pas in als het goed voelt.",
    englishText:
      "At first, I also hesitated to pay for it. There are honestly many bad examples in this market. Follow the free section first and only join when it feels right.",
  },
  {
    id: 16,
    countryCode: "PL",
    countryName: "Poland",
    displayName: "Piotr K.",
    initials: "PK",
    featured: true,
    localizedText:
      "Nie oceniajcie wszystkiego po jednym dniu. Są dobre i słabe dni. Najlepiej spojrzeć na wyniki z co najmniej kilku tygodni i dopiero wtedy wyrobić sobie zdanie.",
    englishText:
      "Don't judge everything based on one day. There are good days and bad days. It's better to look at results over at least a few weeks before making up your mind.",
  },
  {
    id: 17,
    countryCode: "HU",
    countryName: "Hungary",
    displayName: "Ádám S.",
    initials: "AS",
    featured: false,
    localizedText:
      "Szerintem a legnagyobb hiba az, ha valaki már az első naptól csodát vár. Fix kerettel és következetesen haladva sokkal jobban érthető a rendszer lényege.",
    englishText:
      "I think the biggest mistake is expecting a miracle from day one. With a fixed budget and a consistent approach, the logic of the system becomes much clearer.",
  },
  {
    id: 18,
    countryCode: "DE",
    countryName: "Germany",
    displayName: "Jonas K.",
    initials: "JK",
    featured: false,
    localizedText:
      "Nur weil die Quote hoch ist, sollte man nicht sofort das ganze Budget setzen. Man muss sich an den vorgegebenen Plan halten. Das würde ich jedem raten, der über eine Mitgliedschaft nachdenkt.",
    englishText:
      "Just because the odds are high doesn't mean you should put your entire budget on it. You need to stick to the plan. That's what I would tell anyone considering a membership.",
  },
  {
    id: 19,
    countryCode: "ES",
    countryName: "Spain",
    displayName: "Javier R.",
    initials: "JR",
    featured: false,
    localizedText:
      "Lo que diferencia esto de otros grupos es que no intenta venderte una sola apuesta milagrosa. Si vas a seguir el sistema, hay que pensarlo por meses, no por días.",
    englishText:
      "What sets this apart from other groups is that it doesn't try to sell you one miracle bet. If you're going to follow the system, you need to think in months, not days.",
  },
  {
    id: 20,
    countryCode: "IT",
    countryName: "Italy",
    displayName: "Matteo F.",
    initials: "MF",
    featured: true,
    localizedText:
      "Sono entrato su consiglio di un amico, ma ho comunque iniziato con un abbonamento di una settimana. Quando ho visto che ottenevo davvero risultati, sono passato al piano di tre mesi.",
    englishText:
      "I joined on a friend's recommendation, but I still started with a one-week membership. When I saw that I was actually getting results, I switched to the three-month plan.",
  },
  {
    id: 21,
    countryCode: "HU",
    countryName: "Hungary",
    displayName: "Zoltán K.",
    initials: "ZK",
    featured: false,
    localizedText:
      "Én elégedett vagyok. Ha valaki bizonytalan, a saját nyereségem és tapasztalataim alapján nyugodt szívvel ajánlom.",
    englishText:
      "I'm satisfied. If anyone is unsure, based on my own profits and experience, I can honestly recommend it.",
  },
  {
    id: 22,
    countryCode: "NL",
    countryName: "Netherlands",
    displayName: "Thomas B.",
    initials: "TB",
    featured: false,
    localizedText:
      "Wie overweegt lid te worden, moet eerst naar de eerdere resultaten kijken. Die resultaten hebben mij overtuigd en ik ben nu nog steeds erg tevreden.",
    englishText:
      "Anyone thinking about becoming a member should look at the past results first. Those results convinced me, and I'm still very satisfied.",
  },
  {
    id: 23,
    countryCode: "HU",
    countryName: "Hungary",
    displayName: "Tamás F.",
    initials: "TF",
    featured: false,
    localizedText:
      "Ez az oldal megmutatta, hogy a fogadásból csodák nélkül is lehet pénzt keresni. Két hónapja használom, köszönöm.",
    englishText:
      "This site showed me that it's possible to make money from betting without needing miracles. I've been using it for two months. Thank you.",
  },
  // ── Italy (new) ────────────────────────────────────────────────────────────
  {
    id: 24,
    countryCode: "IT",
    countryName: "Italy",
    displayName: "Lorenzo P.",
    initials: "LP",
    featured: false,
    localizedText:
      "Ho imparato che il risultato di una singola giornata conta poco. Da quando guardo il rendimento complessivo, seguire il servizio è molto più semplice.",
    englishText:
      "I learned that the result of a single day matters very little. Since I started looking at the overall performance, following the service has become much easier.",
  },
  {
    id: 25,
    countryCode: "IT",
    countryName: "Italy",
    displayName: "Davide M.",
    initials: "DM",
    featured: false,
    localizedText:
      "Preferisco poche giocate ma selezionate bene. In passato puntavo troppo spesso e alla fine era solo confusione.",
    englishText:
      "I prefer fewer bets that are carefully selected. In the past I used to bet too often and in the end it was just confusing.",
  },
  {
    id: 26,
    countryCode: "IT",
    countryName: "Italy",
    displayName: "Riccardo B.",
    initials: "RB",
    featured: false,
    localizedText:
      "Nessuno può vincere sempre. Quello che mi interessa è vedere un metodo che rimanga coerente anche dopo una giornata negativa.",
    englishText:
      "Nobody can win all the time. What matters to me is seeing a method that remains consistent even after a bad day.",
  },
  {
    id: 27,
    countryCode: "IT",
    countryName: "Italy",
    displayName: "Simone G.",
    initials: "SG",
    featured: false,
    localizedText:
      "Continuo a usare lo stesso budget ogni settimana. Così riesco a seguire il piano senza prendere decisioni impulsive.",
    englishText:
      "I keep using the same budget every week. This helps me follow the plan without making impulsive decisions.",
  },
  {
    id: 28,
    countryCode: "IT",
    countryName: "Italy",
    displayName: "Matteo R.",
    initials: "MR",
    featured: false,
    localizedText:
      "Ho iniziato con prudenza e senza aspettative troppo alte. Col tempo i risultati hanno parlato da soli.",
    englishText:
      "I started cautiously and without unrealistic expectations. Over time, the results spoke for themselves.",
  },
  // ── Spain (new) ────────────────────────────────────────────────────────────
  {
    id: 29,
    countryCode: "ES",
    countryName: "Spain",
    displayName: "Álvaro C.",
    initials: "AC",
    featured: false,
    localizedText:
      "Antes buscaba cuotas altas todo el tiempo. Ahora prefiero seguir un método y dejar que los resultados lleguen poco a poco.",
    englishText:
      "I used to chase high odds all the time. Now I prefer to follow a method and let the results come gradually.",
  },
  {
    id: 30,
    countryCode: "ES",
    countryName: "Spain",
    displayName: "Rubén P.",
    initials: "RP",
    featured: false,
    localizedText:
      "Lo mejor es que no desaparecen los días malos. Eso hace que todo resulte mucho más creíble.",
    englishText:
      "The best part is that the bad days do not disappear. That makes everything feel much more credible.",
  },
  {
    id: 31,
    countryCode: "ES",
    countryName: "Spain",
    displayName: "Miguel F.",
    initials: "MF",
    featured: false,
    localizedText:
      "Después de un mes siguiendo el servicio entendí que la diferencia está en la constancia, no en una apuesta concreta.",
    englishText:
      "After following the service for a month, I understood that the difference is in consistency, not in one particular bet.",
  },
  // ── Netherlands (new) ──────────────────────────────────────────────────────
  {
    id: 32,
    countryCode: "NL",
    countryName: "Netherlands",
    displayName: "Tim R.",
    initials: "TR",
    featured: false,
    localizedText:
      "Ik kijk niet meer naar losse dagen. Aan het einde van de maand zie je pas echt hoe het systeem presteert.",
    englishText:
      "I no longer focus on individual days. At the end of the month you can really see how the system performs.",
  },
  {
    id: 33,
    countryCode: "NL",
    countryName: "Netherlands",
    displayName: "Kevin M.",
    initials: "KM",
    featured: false,
    localizedText:
      "Voor mij voelt het veel rustiger om een plan te volgen dan steeds zelf nieuwe keuzes te maken.",
    englishText:
      "For me, following a plan feels much calmer than constantly making new choices myself.",
  },
  {
    id: 34,
    countryCode: "NL",
    countryName: "Netherlands",
    displayName: "Lars V.",
    initials: "LV",
    featured: false,
    localizedText:
      "Ik begon voorzichtig met een klein bedrag. Daardoor kon ik eerst vertrouwen opbouwen.",
    englishText:
      "I started cautiously with a small amount. That allowed me to build confidence first.",
  },
  {
    id: 35,
    countryCode: "NL",
    countryName: "Netherlands",
    displayName: "Stefan H.",
    initials: "SH",
    featured: false,
    localizedText:
      "De Free Bets waren voor mij voldoende om te zien hoe alles werkte voordat ik lid werd.",
    englishText:
      "The Free Bets were enough for me to see how everything worked before I became a member.",
  },
  {
    id: 36,
    countryCode: "NL",
    countryName: "Netherlands",
    displayName: "Robin K.",
    initials: "RK",
    featured: false,
    localizedText:
      "Ik waardeer vooral dat er geen overdreven beloftes worden gedaan. Dat zie je tegenwoordig niet vaak meer.",
    englishText:
      "What I appreciate most is that there are no exaggerated promises. You do not see that very often these days.",
  },
  // ── Belgium (new) ──────────────────────────────────────────────────────────
  {
    id: 37,
    countryCode: "BE",
    countryName: "Belgium",
    displayName: "Olivier M.",
    initials: "OM",
    featured: false,
    localizedText:
      "J'ai préféré observer plusieurs semaines avant de prendre un abonnement. Avec le recul, c'était la bonne décision.",
    englishText:
      "I preferred to observe for several weeks before subscribing. Looking back, it was the right decision.",
  },
  {
    id: 38,
    countryCode: "BE",
    countryName: "Belgium",
    displayName: "Thomas R.",
    initials: "TR",
    featured: false,
    localizedText:
      "Je ne cherche plus le gros gain sur un seul pari. Je préfère une progression plus régulière.",
    englishText:
      "I no longer look for one big win on a single bet. I prefer more consistent progress.",
  },
  // ── Poland (new) ───────────────────────────────────────────────────────────
  {
    id: 39,
    countryCode: "PL",
    countryName: "Poland",
    displayName: "Mateusz L.",
    initials: "ML",
    featured: false,
    localizedText:
      "Darmowe typy pozwoliły mi spokojnie sprawdzić, czy ten sposób gry mi odpowiada.",
    englishText:
      "The free picks allowed me to calmly see whether this way of betting suited me.",
  },
  // ── Hungary (new) ──────────────────────────────────────────────────────────
  {
    id: 40,
    countryCode: "HU",
    countryName: "Hungary",
    displayName: "Krisztián B.",
    initials: "KB",
    featured: false,
    localizedText:
      "Korábban túl sok meccset játszottam egyszerre. Most sokkal átgondoltabban fogadok.",
    englishText:
      "I used to bet on too many matches at once. Now I bet much more thoughtfully.",
  },
  {
    id: 41,
    countryCode: "HU",
    countryName: "Hungary",
    displayName: "Balázs T.",
    initials: "BT",
    featured: false,
    localizedText:
      "Egy rossz nap után sem változtatok a terven. Hosszú távon ez sokkal jobban működik.",
    englishText:
      "I do not change the plan even after a bad day. In the long run, this works much better.",
  },
  {
    id: 42,
    countryCode: "HU",
    countryName: "Hungary",
    displayName: "Norbert V.",
    initials: "NV",
    featured: false,
    localizedText:
      "Először csak figyeltem az eredményeket. Később döntöttem úgy, hogy csatlakozom.",
    englishText:
      "At first I only watched the results. Later I decided to join.",
  },
  {
    id: 43,
    countryCode: "HU",
    countryName: "Hungary",
    displayName: "Péter H.",
    initials: "PH",
    featured: false,
    localizedText:
      "Nem minden hét ugyanolyan, de összességében elégedett vagyok a rendszerrel.",
    englishText:
      "Not every week is the same, but overall I am satisfied with the system.",
  },
  {
    id: 44,
    countryCode: "HU",
    countryName: "Hungary",
    displayName: "Roland M.",
    initials: "RM",
    featured: false,
    localizedText:
      "Nekem fontosabb a kiszámíthatóság, mint az egyszeri nagy nyeremény.",
    englishText:
      "For me, predictability is more important than a one-time big win.",
  },
  {
    id: 45,
    countryCode: "HU",
    countryName: "Hungary",
    displayName: "Gergő K.",
    initials: "GK",
    featured: false,
    localizedText:
      "Már nem érzem azt, hogy minden nap játszanom kell. Ez önmagában is nagy változás.",
    englishText:
      "I no longer feel like I have to bet every day. That alone is a big change.",
  },
  // ── Germany (new) ──────────────────────────────────────────────────────────
  {
    id: 46,
    countryCode: "DE",
    countryName: "Germany",
    displayName: "Patrick R.",
    initials: "PR",
    featured: false,
    localizedText:
      "Seit ich mich an einen festen Einsatz halte, treffe ich deutlich ruhigere Entscheidungen.",
    englishText:
      "Since I started sticking to a fixed stake, I make much calmer decisions.",
  },
  {
    id: 47,
    countryCode: "DE",
    countryName: "Germany",
    displayName: "Tobias W.",
    initials: "TW",
    featured: false,
    localizedText:
      "Mir gefällt, dass der Fokus auf dem gesamten Zeitraum liegt und nicht nur auf einzelnen Treffern.",
    englishText:
      "I like that the focus is on the whole period rather than just individual wins.",
  },
  {
    id: 48,
    countryCode: "DE",
    countryName: "Germany",
    displayName: "Marcel F.",
    initials: "MF",
    featured: false,
    localizedText:
      "Ich habe erst einige Wochen kostenlos mitverfolgt. Danach fiel mir die Entscheidung für die Mitgliedschaft leicht.",
    englishText:
      "I followed for free for a few weeks first. After that, the decision to become a member was easy.",
  },
  // ── Italy (remaining to reach 12) ─────────────────────────────────────────
  {
    id: 49,
    countryCode: "IT",
    countryName: "Italy",
    displayName: "Federico A.",
    initials: "FA",
    featured: false,
    localizedText:
      "L'aspetto che più mi ha convinto è la trasparenza sui risultati. Non vengono nascosti i giorni negativi, e questo fa una grande differenza.",
    englishText:
      "The aspect that convinced me most is the transparency about results. The bad days are not hidden, and that makes a big difference.",
  },
  {
    id: 50,
    countryCode: "IT",
    countryName: "Italy",
    displayName: "Andrea C.",
    initials: "AC",
    featured: false,
    localizedText:
      "Prima di tutto ho seguito i Free Bets per qualche settimana. Solo dopo aver visto i risultati con i miei occhi ho deciso di abbonarmi.",
    englishText:
      "First I followed the Free Bets for a few weeks. Only after seeing the results with my own eyes did I decide to subscribe.",
  },
  {
    id: 51,
    countryCode: "IT",
    countryName: "Italy",
    displayName: "Stefano L.",
    initials: "SL",
    featured: false,
    localizedText:
      "Non cerco di diventare ricco in un giorno. Seguo il piano, mantengo il budget fisso, e alla fine del mese verifico i progressi.",
    englishText:
      "I am not trying to get rich in a day. I follow the plan, keep a fixed budget, and at the end of the month I check the progress.",
  },
  // ── Spain (remaining to reach 6) ──────────────────────────────────────────
  {
    id: 52,
    countryCode: "ES",
    countryName: "Spain",
    displayName: "Carlos V.",
    initials: "CV",
    featured: false,
    localizedText:
      "Lo que más valoro es que no promete resultados imposibles. Es un servicio honesto, y eso me da confianza para seguir.",
    englishText:
      "What I value most is that it does not promise impossible results. It is an honest service, and that gives me confidence to continue.",
  },
  // ── Netherlands (remaining to reach 15) ───────────────────────────────────
  {
    id: 53,
    countryCode: "NL",
    countryName: "Netherlands",
    displayName: "Sander B.",
    initials: "SB",
    featured: false,
    localizedText:
      "Ik heb lang getwijfeld, maar de transparantie overtuigde me. Je kunt gewoon alle resultaten terugzien.",
    englishText:
      "I hesitated for a long time, but the transparency convinced me. You can simply look back at all the results.",
  },
  {
    id: 54,
    countryCode: "NL",
    countryName: "Netherlands",
    displayName: "Joost P.",
    initials: "JP",
    featured: false,
    localizedText:
      "Het systeem werkt het beste als je het consistent volgt. Ik probeer me daar zoveel mogelijk aan te houden.",
    englishText:
      "The system works best when you follow it consistently. I try to stick to that as much as possible.",
  },
  {
    id: 55,
    countryCode: "NL",
    countryName: "Netherlands",
    displayName: "Matthijs E.",
    initials: "ME",
    featured: false,
    localizedText:
      "Ik gebruik een vast weekbudget. Dat maakt het makkelijker om overzicht te houden en niet impulsief te handelen.",
    englishText:
      "I use a fixed weekly budget. That makes it easier to keep track and not act impulsively.",
  },
  {
    id: 56,
    countryCode: "NL",
    countryName: "Netherlands",
    displayName: "Ruben H.",
    initials: "RH",
    featured: false,
    localizedText:
      "Na een paar weken gratis meekijken zag ik genoeg om lid te worden. Sindsdien ben ik tevreden gebleven.",
    englishText:
      "After watching for free for a few weeks I saw enough to become a member. Since then I have stayed satisfied.",
  },
  {
    id: 57,
    countryCode: "NL",
    countryName: "Netherlands",
    displayName: "Arjan W.",
    initials: "AW",
    featured: false,
    localizedText:
      "Verliezende dagen zijn ook zichtbaar. Die eerlijkheid is voor mij het grootste verschil met andere diensten.",
    englishText:
      "Losing days are also visible. That honesty is for me the biggest difference from other services.",
  },
  // ── Belgium (remaining to reach 6) ────────────────────────────────────────
  {
    id: 58,
    countryCode: "BE",
    countryName: "Belgium",
    displayName: "Nicolas H.",
    initials: "NH",
    featured: false,
    localizedText:
      "J'apprécie que le service soit transparent sur les mauvais jours. C'est ce qui m'a convaincu de rester.",
    englishText:
      "I appreciate that the service is transparent about bad days. That is what convinced me to stay.",
  },
  {
    id: 59,
    countryCode: "BE",
    countryName: "Belgium",
    displayName: "Antoine C.",
    initials: "AC",
    featured: false,
    localizedText:
      "Je suis les résultats depuis plusieurs mois. Même si tous les jours ne sont pas gagnants, le bilan mensuel reste positif.",
    englishText:
      "I have been following the results for several months. Even if not every day is a winner, the monthly balance remains positive.",
  },
  // ── Poland (remaining to reach 3) ─────────────────────────────────────────
  {
    id: 60,
    countryCode: "PL",
    countryName: "Poland",
    displayName: "Bartosz W.",
    initials: "BW",
    featured: false,
    localizedText:
      "Ważne jest, żeby nie oczekiwać cudu po pierwszym dniu. Wyniki widać dopiero po kilku tygodniach regularnego śledzenia.",
    englishText:
      "It is important not to expect a miracle after the first day. Results become visible only after several weeks of regular following.",
  },
  // ── Hungary (remaining to reach 18) ───────────────────────────────────────
  {
    id: 61,
    countryCode: "HU",
    countryName: "Hungary",
    displayName: "Dávid F.",
    initials: "DF",
    featured: false,
    localizedText:
      "Nem próbálom egyetlen nap alatt visszanyerni, amit elveszítettem. A következetesség az, ami hosszú távon számít.",
    englishText:
      "I do not try to recover in one day what I lost. Consistency is what matters in the long run.",
  },
  {
    id: 62,
    countryCode: "HU",
    countryName: "Hungary",
    displayName: "István M.",
    initials: "IM",
    featured: false,
    localizedText:
      "Az ingyenes tippek elég meggyőzőek voltak ahhoz, hogy belépjek. Azóta sem bántam meg a döntést.",
    englishText:
      "The free tips were convincing enough for me to join. I have not regretted the decision since.",
  },
  {
    id: 63,
    countryCode: "HU",
    countryName: "Hungary",
    displayName: "Tibor N.",
    initials: "TN",
    featured: false,
    localizedText:
      "Fix tétet játszom minden meccsnél, és nem térek el tőle. Így sokkal egyszerűbb követni az eredményeket.",
    englishText:
      "I play a fixed stake on every match and do not deviate from it. That makes it much easier to track the results.",
  },
  {
    id: 64,
    countryCode: "HU",
    countryName: "Hungary",
    displayName: "Attila K.",
    initials: "AK",
    featured: false,
    localizedText:
      "Egy-két hetes eredmények alapján nem ítélek. Legalább egy hónapos időszakot szoktam megvizsgálni.",
    englishText:
      "I do not judge based on one or two weeks of results. I usually examine at least a one-month period.",
  },
  {
    id: 65,
    countryCode: "HU",
    countryName: "Hungary",
    displayName: "Csaba L.",
    initials: "CL",
    featured: false,
    localizedText:
      "Ezzel a szolgáltatással megtanultam, hogy a türelem a fogadásban is erény. Rövid távon nem mindig látszik az eredmény.",
    englishText:
      "With this service I learned that patience is a virtue in betting too. In the short term the result is not always visible.",
  },
  {
    id: 66,
    countryCode: "HU",
    countryName: "Hungary",
    displayName: "Viktor B.",
    initials: "VB",
    featured: false,
    localizedText:
      "Hónapok óta ugyanolyan megközelítéssel játszom. Ez stabilitást ad, és segít elkerülni a felesleges kockázatokat.",
    englishText:
      "I have been playing with the same approach for months. This gives stability and helps avoid unnecessary risks.",
  },
  // ── Germany (remaining to reach 9) ────────────────────────────────────────
  {
    id: 67,
    countryCode: "DE",
    countryName: "Germany",
    displayName: "Florian G.",
    initials: "FG",
    featured: false,
    localizedText:
      "Ich schaue mir immer das Monatsergebnis an, nicht einzelne Tage. Erst dann ergibt das System wirklich Sinn.",
    englishText:
      "I always look at the monthly result, not individual days. Only then does the system really make sense.",
  },
  {
    id: 68,
    countryCode: "DE",
    countryName: "Germany",
    displayName: "Christian B.",
    initials: "CB",
    featured: false,
    localizedText:
      "Wer erwartet, jeden Tag zu gewinnen, wird enttäuscht sein. Das System ist auf langfristige Konstanz ausgelegt.",
    englishText:
      "Anyone who expects to win every day will be disappointed. The system is designed for long-term consistency.",
  },
  {
    id: 69,
    countryCode: "DE",
    countryName: "Germany",
    displayName: "Simon N.",
    initials: "SN",
    featured: false,
    localizedText:
      "Ich bin seit mehreren Monaten dabei und hatte keinen Grund aufzuhören. Die Ergebnisse sprechen für sich.",
    englishText:
      "I have been here for several months and have had no reason to stop. The results speak for themselves.",
  },
];

export const COUNTRY_FILTERS = [
  { code: "ALL", name: "All" },
  { code: "IT",  name: "Italy" },
  { code: "ES",  name: "Spain" },
  { code: "NL",  name: "Netherlands" },
  { code: "BE",  name: "Belgium" },
  { code: "PL",  name: "Poland" },
  { code: "HU",  name: "Hungary" },
  { code: "DE",  name: "Germany" },
] as const;

export const FEATURED_IDS = [5, 8, 10, 13, 16, 20];
