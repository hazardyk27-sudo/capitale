/**
 * Shared Terms of Use, Membership and Service content — the verbatim legal
 * text and its section-rendering component. Used by both the full `/terms`
 * page and the compact popup opened from the Register page, so the text
 * never drifts between the two surfaces.
 */
const NAVY   = "#071B33";
const ORANGE = "#F47A12";
const BORDER = "#E2E5E9";

export type Block =
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  | { type: "label"; text: string };
export type Section = { number: number; title: string; blocks: Block[] };

export const INTRO: string[] = [
  `These Terms of Use, Membership and Service (“Terms”) govern the use of the Bet Capitale website, membership areas, private communities, sports-related analyses, selections, coupon plans, performance records, free content, and other digital services provided by Bet Capitale.`,
  `Any person who purchases a membership, accesses paid content, or otherwise uses Bet Capitale membership services shall hereinafter be referred to as the “Member” or “User.”`,
  `By accepting these Terms, the User acknowledges and agrees to the nature of the Bet Capitale service, including the fact that certain services consist of time-sensitive digital content, and that the conditions below form an integral part of the membership.`,
];

export const SECTIONS: Section[] = [
  {
    number: 1,
    title: "NATURE OF THE BET CAPITALE SERVICE",
    blocks: [
      { type: "p", text: "Bet Capitale is a digital membership service that provides sports-related analysis, evaluations, data review, strategy, selections, and coupon plans." },
      { type: "p", text: "Bet Capitale does not:" },
      { type: "list", items: [
        "accept wagers;",
        "place bets on behalf of Users;",
        "collect or hold betting balances;",
        "operate as a bookmaker or betting operator;",
        "manage betting accounts on behalf of Users;",
        "hold User funds for betting purposes;",
        "control the outcome of any sporting event.",
      ] },
      { type: "p", text: "The product purchased by the Member is not the purchase of a particular sporting result or a guaranteed financial return." },
      { type: "p", text: "The service purchased by the Member is the right to access digital analyses, selections, coupon structures, and other membership content published by Bet Capitale during the applicable membership period." },
      { type: "label", text: "Example" },
      { type: "p", text: "If a Member purchases a 30-day membership, the Member is not purchasing “30 days of guaranteed profit.”" },
      { type: "p", text: "The purchased service consists of access, during the applicable membership period, to:" },
      { type: "list", items: [
        "membership areas;",
        "published selections;",
        "published coupons;",
        "analyses and other membership content, where available.",
      ] },
    ],
  },
  {
    number: 2,
    title: "NO GUARANTEE OF PROFIT OR RESULTS",
    blocks: [
      { type: "p", text: "No selection, coupon, analysis, statistic, strategy, or other content provided by Bet Capitale constitutes a guarantee of a particular outcome or guaranteed profit." },
      { type: "p", text: "Sporting events are inherently uncertain. A selection that has been carefully analysed or a coupon considered appropriate by Bet Capitale may still lose." },
      { type: "p", text: "Past performance does not guarantee that the same or similar performance will continue in the future." },
      { type: "p", text: "The Member therefore acknowledges and agrees that:" },
      { type: "list", items: [
        "the loss of a coupon does not mean that the service was not provided;",
        "a negative day does not constitute a failure to provide the service;",
        "failure to achieve an expected financial result does not, by itself, create a right to a refund;",
        "past performance must not be interpreted as a guarantee of future performance;",
        "the final decision whether to place a bet remains entirely with the User.",
      ] },
      { type: "label", text: "Example" },
      { type: "p", text: "If Bet Capitale publishes three coupons on a particular day and two of them lose, the Member may not claim that the service was not delivered solely because the outcome did not meet the Member’s expectations." },
      { type: "p", text: "Delivery of the service is assessed primarily by whether the relevant time-sensitive digital content was made available to the Member, not by the final result of the sporting events." },
    ],
  },
  {
    number: 3,
    title: "PUBLIC PRELIMINARY PLANS AND FINAL MEMBER CONTENT",
    blocks: [
      { type: "p", text: "Before final membership content is published, Bet Capitale may display preliminary information concerning the planned content for a particular day on its website, social media accounts, Today section, or other public areas." },
      { type: "p", text: "Such preliminary information may include, for example:" },
      { type: "list", items: [
        "the planned number of matches;",
        "the planned number of coupons;",
        "preliminary total odds;",
        "planned stake groups;",
        "preliminary coupon structures;",
        "estimated potential return information.",
      ] },
      { type: "p", text: "This information is preliminary only." },
      { type: "p", text: "A public preliminary plan does not constitute a binding commitment that the same content will be delivered to Members in exactly the same form." },
      { type: "p", text: "Bet Capitale may continue its risk assessment until the final Member publication." },
      { type: "p", text: "During this process:" },
      { type: "list", items: [
        "a selection may be removed;",
        "a new selection may be added;",
        "a selection may be replaced;",
        "a coupon may be restructured;",
        "total odds may be reduced;",
        "total odds may increase;",
        "the number of matches in a coupon may change;",
        "a lower-risk alternative may be preferred;",
        "a coupon considered excessively risky may be cancelled entirely.",
      ] },
      { type: "label", text: "Example" },
      { type: "p", text: "The public preliminary plan may display:" },
      { type: "list", items: ["Coupon 1 — 3.56", "Coupon 2 — 3.41", "Coupon 3 — 5.67"] },
      { type: "p", text: "If the third coupon with total odds of 5.67 is later considered too risky during the final assessment, Bet Capitale may restructure the coupon and publish, for example, a lower-risk version with total odds of 3.20 to Members." },
      { type: "p", text: "In that case, the 3.20 final version is the official coupon delivered to the Member." },
      { type: "p", text: "The publicly displayed 5.67 figure is treated as part of the preliminary plan only." },
    ],
  },
  {
    number: 4,
    title: "DETERMINATION OF FINAL AND OFFICIAL CONTENT",
    blocks: [
      { type: "p", text: "For a coupon or selection to be considered part of Bet Capitale’s official record, it must have been finally published to Members." },
      { type: "p", text: "Content that, before final Member publication, was:" },
      { type: "list", items: [
        "created as a draft;",
        "displayed in a public preview;",
        "subsequently changed;",
        "removed following risk assessment;",
        "restructured;",
      ] },
      { type: "p", text: "shall not be treated as an official Bet Capitale result." },
      { type: "p", text: "The final version published in the members-only area is the official and valid Bet Capitale content for the relevant day." },
      { type: "p", text: "This rule applies equally to both the User and Bet Capitale." },
    ],
  },
  {
    number: 5,
    title: "CALCULATION OF PERFORMANCE RECORDS",
    blocks: [
      { type: "p", text: "Bet Capitale aims to base its performance history only on final content actually delivered to Members." },
      { type: "p", text: "Accordingly:" },
      { type: "list", items: [
        "winning final coupons are recorded as wins;",
        "losing final coupons are recorded as losses;",
        "voided, cancelled, or refunded results, where applicable, are recorded under the relevant status.",
      ] },
      { type: "p", text: "Where a public preliminary plan differs from the final coupon, the final coupon is used for performance calculations." },
      { type: "label", text: "Example" },
      { type: "p", text: "Preliminary plan:" },
      { type: "p", text: "5.67" },
      { type: "p", text: "Final version published to Members:" },
      { type: "p", text: "3.20" },
      { type: "p", text: "If the coupon wins, the performance record will use 3.20, not 5.67." },
      { type: "p", text: "Likewise, if the preliminary 5.67 version would have won but the final 3.20 coupon delivered to Members loses, Bet Capitale will record the 3.20 final coupon as a loss." },
      { type: "p", text: "This approach is intended to ensure that the performance history corresponds to the product actually delivered to Members." },
    ],
  },
  {
    number: 6,
    title: "CHANGES IN ODDS AND MARKET CONDITIONS",
    blocks: [
      { type: "p", text: "Betting odds are not determined by Bet Capitale." },
      { type: "p", text: "Odds are set and continuously adjusted by third-party bookmakers and betting markets." },
      { type: "p", text: "A selection may, for example, be available at odds of 1.80 when Bet Capitale publishes it, while the User may later find the same selection available at:" },
      { type: "list", items: ["1.76;", "1.70;", "1.90;"] },
      { type: "p", text: "when attempting to place a wager." },
      { type: "p", text: "Such differences do not, by themselves, constitute a defect in the Bet Capitale service." },
      { type: "p", text: "Bet Capitale shall not be responsible for third-party changes including:" },
      { type: "list", items: [
        "bookmaker odds changes;",
        "removal or suspension of a betting market;",
        "unavailability of a market in the User’s country;",
        "account-specific limits imposed by a bookmaker;",
        "restrictions placed on the User’s betting account;",
        "delays in odds updates;",
        "third-party system failures.",
      ] },
    ],
  },
  {
    number: 7,
    title: "DELIVERY OF TIME-SENSITIVE DIGITAL CONTENT",
    blocks: [
      { type: "p", text: "A fundamental feature of the Bet Capitale service is that certain content is time-sensitive." },
      { type: "p", text: "A selection published for a particular sporting event has informational and economic value before that event begins." },
      { type: "p", text: "Once the event has started or concluded, the same information may no longer have the same nature or value." },
      { type: "p", text: "For this reason, access to the day’s selections and coupons is directly linked to time and differs from the delivery of an ordinary physical product." },
      { type: "p", text: "In particular:" },
      { type: "p", text: "By purchasing a membership, I agree that access to time-sensitive digital content will begin immediately. Once I begin accessing the content, I understand and agree that, to the extent permitted by applicable law, I may lose my right of withdrawal/refund." },
      { type: "p", text: "This statement forms part of these Terms and will not be presented as a separate checkbox." },
    ],
  },
  {
    number: 8,
    title: "DETERMINING WHETHER CONTENT HAS BEEN ACCESSED",
    blocks: [
      { type: "p", text: "In the event of a dispute or refund request, Bet Capitale may use technical records to assess whether the service was delivered and accessed." },
      { type: "p", text: "Such records may include:" },
      { type: "list", items: [
        "payment date and time;",
        "membership activation time;",
        "login time to the Bet Capitale account;",
        "entry into a members-only area;",
        "viewing of the relevant content page;",
        "access to a private Telegram group or other private area;",
        "session information;",
        "relevant order or transaction number;",
        "content-access timestamps.",
      ] },
      { type: "label", text: "Example" },
      { type: "p", text: "A User:" },
      { type: "list", items: [
        "14:03 — purchases a membership",
        "14:04 — membership is activated",
        "14:07 — enters the Today’s Selections section",
        "14:10 — views the day’s coupons",
        "15:20 — submits a refund request",
      ] },
      { type: "p", text: "Such records may be submitted as evidence that the content was made available and accessed before the refund request was submitted." },
    ],
  },
  {
    number: 9,
    title: "BASIS OF THE REFUND POLICY",
    blocks: [
      { type: "p", text: "Bet Capitale distinguishes between genuine customer-service issues and attempts to obtain the value of time-sensitive paid content and subsequently reverse the payment." },
      { type: "p", text: "Refund requests are not necessarily rejected automatically." },
      { type: "p", text: "The nature of the service, access status, technical records, and circumstances of the request may be considered." },
      { type: "p", text: "For example, a refund request may be reviewed separately where:" },
      { type: "list", items: [
        "the User never received access to the paid content;",
        "a technical error prevented membership activation;",
        "the same transaction was mistakenly charged more than once;",
        "the wrong membership plan was charged;",
        "applicable mandatory consumer law requires a refund.",
      ] },
      { type: "p", text: "By contrast, the following reasons alone do not automatically establish a right to a refund:" },
      { type: "list", items: [
        "a coupon lost;",
        "the result was worse than expected;",
        "the User expected to make more money;",
        "the User viewed the content and later changed their mind;",
        "the User used the selections and subsequently decided they no longer wanted the service.",
      ] },
    ],
  },
  {
    number: 10,
    title: "REFUND REQUESTS AFTER ACCESS TO CONTENT",
    blocks: [
      { type: "p", text: "Where a User has accessed the relevant day’s time-sensitive members-only content after purchase, this may be considered an important factor when reviewing a refund request." },
      { type: "p", text: "Certain digital content cannot effectively be “returned” to Bet Capitale once it has been viewed." },
      { type: "label", text: "Example" },
      { type: "p", text: "Once the User has viewed:" },
      { type: "list", items: ["the day’s matches;", "selections;", "coupon combinations;", "final odds;"] },
      { type: "p", text: "the User has already obtained the information." },
      { type: "p", text: "A subsequent full reversal of the membership payment may result in the User retaining the economic value of the content while the payment is reversed." },
      { type: "p", text: "Bet Capitale therefore reserves the right to provide content-access records during the review of a refund request." },
      { type: "p", text: "Mandatory consumer rights remain unaffected." },
    ],
  },
  {
    number: 11,
    title: "ABUSE OF THE REFUND SYSTEM",
    blocks: [
      { type: "p", text: "Bet Capitale does not seek to prevent Users from exercising legitimate refund rights." },
      { type: "p", text: "However, systematic use of refund mechanisms for the purpose of obtaining paid content without ultimately paying for that content may be treated as abuse of the service." },
      { type: "p", text: "Examples of conduct that may be reviewed include:" },
      { type: "list", items: [
        "purchasing a membership;",
        "accessing members-only content;",
        "viewing the day’s selections;",
        "requesting a refund shortly afterwards despite there being no technical failure in service delivery;",
        "repeatedly engaging in similar conduct;",
        "providing false or misleading information about whether the service was delivered for the purpose of reversing a payment.",
      ] },
      { type: "p", text: "In such circumstances, Bet Capitale may:" },
      { type: "list", items: [
        "review access records;",
        "provide evidence to the relevant payment provider;",
        "contest the refund request;",
        "restrict future access to the service;",
        "apply reasonable account-security measures.",
      ] },
    ],
  },
  {
    number: 12,
    title: "DISTINCTION BETWEEN REFUND ELIGIBILITY AND SPORTING RESULTS",
    blocks: [
      { type: "p", text: "The quality or delivery of the Bet Capitale service is not determined solely by the outcome of one sporting event." },
      { type: "p", text: "For example, where a User requests refunds only on losing days while continuing to use the service on winning days, this behaviour may not constitute a valid basis for claiming that the digital service was not delivered." },
      { type: "p", text: "Refund reviews primarily consider the following question:" },
      { type: "p", text: "“Was the purchased digital membership service delivered to the User?”" },
      { type: "p", text: "They do not primarily consider:" },
      { type: "p", text: "“Did the User obtain the sporting or financial result they hoped for on that particular day?”" },
    ],
  },
  {
    number: 13,
    title: "PERSONAL NATURE OF MEMBERSHIP ACCOUNTS",
    blocks: [
      { type: "p", text: "A Bet Capitale membership is provided solely for use by the person who purchased the membership." },
      { type: "p", text: "Membership access may not be shared with:" },
      { type: "list", items: ["friends;", "family members;", "other betting groups;", "third-party Telegram channels;", "other paid communities."] },
      { type: "p", text: "Where there are reasonable technical indicators that an account is being used by multiple individuals, Bet Capitale may conduct a security review." },
    ],
  },
  {
    number: 14,
    title: "SHARING OF PAID CONTENT",
    blocks: [
      { type: "p", text: "Members-only content constitutes an essential part of Bet Capitale’s paid service." },
      { type: "p", text: "The following activities are prohibited:" },
      { type: "list", items: [
        "sharing coupons in other groups;",
        "distributing selections through screenshots;",
        "reselling paid content;",
        "using Bet Capitale content as part of another tipster or paid service;",
        "removing identifying information and republishing content;",
        "distributing content in order to allow others to avoid paying membership fees.",
      ] },
      { type: "p", text: "Such conduct may result in termination of membership access." },
    ],
  },
  {
    number: 15,
    title: "INTELLECTUAL PROPERTY AND USE OF CONTENT",
    blocks: [
      { type: "p", text: "Bet Capitale content, including:" },
      { type: "list", items: [
        "written materials;",
        "analyses;",
        "coupon structures;",
        "original graphics;",
        "performance displays;",
        "branding elements;",
        "designs;",
        "members-only materials;",
      ] },
      { type: "p", text: "is provided for personal use only." },
      { type: "p", text: "Purchasing a membership does not transfer ownership of the content to the User." },
      { type: "p", text: "The User receives only a personal right of access during the applicable membership period." },
    ],
  },
  {
    number: 16,
    title: "AUTOMATICALLY RENEWING SUBSCRIPTIONS",
    blocks: [
      { type: "p", text: "Where a membership is sold as an automatically renewing subscription:" },
      { type: "list", items: ["the price;", "renewal period;", "subscription duration;"] },
      { type: "p", text: "shall be displayed during the purchase process." },
      { type: "p", text: "The User acknowledges that the payment plan accepted at checkout may automatically renew on the applicable renewal date unless cancelled." },
      { type: "label", text: "Example" },
      { type: "p", text: "If an monthly membership is displayed at checkout as:" },
      { type: "p", text: "€99.90 / month" },
      { type: "p", text: "the applicable amount may be charged again in the following month in accordance with the conditions of the relevant payment provider unless the subscription is cancelled." },
    ],
  },
  {
    number: 17,
    title: "CANCELLATION OF A SUBSCRIPTION",
    blocks: [
      { type: "p", text: "The User may stop future automatic renewals through the cancellation tools provided by the relevant payment or membership provider." },
      { type: "p", text: "Cancellation of future renewal and a request for a refund of a past membership period are separate matters." },
      { type: "label", text: "Example" },
      { type: "p", text: "If a User purchases a 30-day membership and cancels the subscription after 20 days:" },
      { type: "list", items: [
        "the next automatic renewal may be stopped;",
        "access for the current paid membership period may continue in accordance with the applicable plan;",
        "the act of cancelling does not automatically create a right to a refund for the previous 20 days of delivered service.",
      ] },
    ],
  },
  {
    number: 18,
    title: "THIRD-PARTY PLATFORMS AND SERVICES",
    blocks: [
      { type: "p", text: "Certain elements of the Bet Capitale service may depend on third-party services, including:" },
      { type: "list", items: ["Whop;", "Telegram;", "payment processors;", "hosting providers;", "data providers;", "bookmakers."] },
      { type: "p", text: "These services operate independently from Bet Capitale." },
      { type: "p", text: "Bet Capitale may not be responsible for interruptions or failures outside its reasonable control." },
      { type: "p", text: "However, Bet Capitale will make reasonable efforts to resolve access issues that are within its control." },
    ],
  },
  {
    number: 19,
    title: "TECHNICAL ISSUES",
    blocks: [
      { type: "p", text: "Temporary technical problems may occasionally occur." },
      { type: "p", text: "Examples include:" },
      { type: "list", items: [
        "short-term website outages;",
        "Telegram outages;",
        "hosting problems;",
        "internet connectivity issues;",
        "third-party API interruptions.",
      ] },
      { type: "p", text: "A temporary technical issue does not automatically constitute a complete failure to provide the membership service." },
      { type: "p", text: "However, where the User is completely unable to access the purchased service or experiences a serious and prolonged technical failure, the matter may be reviewed separately." },
    ],
  },
  {
    number: 20,
    title: "DEVELOPMENT AND MODIFICATION OF THE SERVICE",
    blocks: [
      { type: "p", text: "Bet Capitale may develop and modify its service over time." },
      { type: "p", text: "Such changes may include:" },
      { type: "list", items: [
        "introduction of new analysis screens;",
        "changes to content format;",
        "improvements to the coupon system;",
        "changes to stake models;",
        "changes to publishing schedules;",
        "introduction of new membership features.",
      ] },
      { type: "p", text: "Bet Capitale may not be required to obtain separate User approval for every reasonable modification made for the purpose of improving or operating the service." },
      { type: "p", text: "However, any material change that substantially reduces the fundamental nature of an already purchased service may be assessed separately." },
    ],
  },
  {
    number: 21,
    title: "RESPONSIBLE BETTING AND USER RESPONSIBILITY",
    blocks: [
      { type: "p", text: "Bet Capitale does not encourage any User to gamble with borrowed money or with funds that the User cannot afford to lose." },
      { type: "p", text: "The User is solely responsible for deciding:" },
      { type: "list", items: [
        "whether to place a wager;",
        "how much money to use;",
        "which bookmaker to use;",
        "whether to follow or disregard Bet Capitale content.",
      ] },
      { type: "p", text: "Bet Capitale content is not personalised financial advice based on the User’s individual financial circumstances." },
    ],
  },
  {
    number: 22,
    title: "AGE AND LOCAL LAW",
    blocks: [
      { type: "p", text: "Bet Capitale services may only be used by individuals who meet the applicable legal age requirement in their jurisdiction." },
      { type: "p", text: "Where sports betting or related activities are restricted by law in the User’s country or region, it is the User’s responsibility to verify and comply with local law." },
      { type: "p", text: "Purchasing a Bet Capitale membership does not grant the User any right to participate in an activity that is unlawful in the User’s jurisdiction." },
    ],
  },
  {
    number: 23,
    title: "SUSPENSION OR TERMINATION OF MEMBERSHIP",
    blocks: [
      { type: "p", text: "Bet Capitale may review, temporarily restrict, or terminate membership access in cases involving:" },
      { type: "list", items: [
        "payment fraud;",
        "account sharing;",
        "unauthorised distribution of private content;",
        "technical abuse of the service;",
        "abuse of payment or refund mechanisms;",
        "attempted unauthorised access to Bet Capitale systems;",
        "malicious conduct intended to harm the service or other Users.",
      ] },
      { type: "p", text: "Nothing in this section limits any mandatory rights the User may have under applicable law." },
    ],
  },
  {
    number: 24,
    title: "SUPPORT AND DISPUTES",
    blocks: [
      { type: "p", text: "Where a User experiences a genuine issue concerning a purchase, membership activation, or access to the service, the User is encouraged to contact Bet Capitale support before initiating a payment dispute." },
      { type: "p", text: "Where reasonably possible, Bet Capitale aims to:" },
      { type: "list", items: [
        "investigate the technical issue;",
        "review the payment record;",
        "verify membership activation;",
        "provide an appropriate resolution.",
      ] },
      { type: "p", text: "Refund requests and payment disputes may also be subject to the rules and procedures of the applicable payment provider." },
    ],
  },
  {
    number: 25,
    title: "PROTECTION OF MANDATORY CONSUMER RIGHTS",
    blocks: [
      { type: "p", text: "Nothing in these Terms shall be interpreted as removing or limiting any mandatory consumer right that cannot legally be waived or excluded." },
      { type: "p", text: "Where a provision of these Terms conflicts with a mandatory provision of applicable consumer law, the mandatory legal provision shall prevail." },
    ],
  },
  {
    number: 26,
    title: "CHANGES TO THESE TERMS",
    blocks: [
      { type: "p", text: "Bet Capitale may update these Terms due to:" },
      { type: "list", items: [
        "changes to the service structure;",
        "changes to payment systems;",
        "security requirements;",
        "introduction of new product features;",
        "legal or regulatory requirements.",
      ] },
      { type: "p", text: "Each material version of these Terms should be assigned a separate version number." },
      { type: "p", text: "For example:" },
      { type: "list", items: ["Version 1.0 — 19 August 2026", "Version 1.1 — 02 October 2026"] },
      { type: "p", text: "A User’s previous acceptance record must not be overwritten when a new version is published." },
    ],
  },
  {
    number: 27,
    title: "RETENTION OF TERMS ACCEPTANCE RECORDS",
    blocks: [
      { type: "p", text: "Bet Capitale may record and retain evidence of the User’s acceptance of these Terms for contractual, security, compliance, and dispute-resolution purposes." },
      { type: "p", text: "Such records may include, where available:" },
      { type: "list", items: [
        "User ID;",
        "date and time of acceptance;",
        "Terms version;",
        "relevant order or purchase ID;",
        "IP address;",
        "device or user-agent information.",
      ] },
      { type: "p", text: "Acceptance records for previous versions should remain separate from later acceptance records." },
      { type: "label", text: "Example" },
      { type: "p", text: "If a User accepted:" },
      { type: "p", text: "Version 1.0 — 19 August 2026" },
      { type: "p", text: "and later accepted:" },
      { type: "p", text: "Version 1.2 — 12 November 2026" },
      { type: "p", text: "both acceptance records should be retained separately." },
    ],
  },
  {
    number: 28,
    title: "ACCEPTANCE OF THESE TERMS",
    blocks: [
      { type: "p", text: "By completing the acceptance process displayed at the bottom of this page, the User confirms that they:" },
      { type: "list", items: [
        "have read these Terms;",
        "understand the nature of the Bet Capitale service;",
        "understand that no guaranteed outcome or profit is promised;",
        "understand that preliminary plans may differ from final Member content;",
        "understand that time-sensitive digital content may become available immediately following purchase;",
        "have reviewed the refund conditions;",
        "understand the applicable automatic-renewal terms.",
      ] },
    ],
  },
];

/** Renders the intro paragraphs + all numbered sections. Caller controls the outer container/scrolling. */
export function TermsBody() {
  return (
    <>
      {INTRO.map((t, i) => (
        <p key={i} style={{ fontSize: "15px", lineHeight: 1.75, color: "#28313D", margin: i === 0 ? 0 : "16px 0 0" }}>{t}</p>
      ))}

      {SECTIONS.map((section) => (
        <div key={section.number} style={{ marginTop: "40px", paddingTop: "28px", borderTop: `1px solid ${BORDER}` }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "14px" }}>
            <span style={{ fontSize: "13px", fontWeight: 800, color: ORANGE, fontVariantNumeric: "tabular-nums" }}>
              {String(section.number).padStart(2, "0")}
            </span>
            <h3 style={{
              fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: NAVY,
              fontSize: "15.5px", letterSpacing: "0.01em", margin: 0, textTransform: "uppercase",
            }}>
              {section.title}
            </h3>
          </div>

          {section.blocks.map((block, i) => {
            if (block.type === "p") {
              return (
                <p key={i} style={{ fontSize: "15px", lineHeight: 1.75, color: "#28313D", margin: i === 0 ? 0 : "14px 0 0" }}>
                  {block.text}
                </p>
              );
            }
            if (block.type === "label") {
              return (
                <p key={i} style={{ fontSize: "11px", fontWeight: 800, color: ORANGE, textTransform: "uppercase", letterSpacing: "0.08em", margin: i === 0 ? 0 : "18px 0 0" }}>
                  {block.text}
                </p>
              );
            }
            return (
              <ul key={i} style={{ margin: "12px 0 0", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                {block.items.map((item, j) => (
                  <li key={j} style={{ fontSize: "15px", lineHeight: 1.65, color: "#28313D" }}>{item}</li>
                ))}
              </ul>
            );
          })}
        </div>
      ))}
    </>
  );
}
