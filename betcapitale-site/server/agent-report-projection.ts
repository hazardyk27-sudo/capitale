
type JsonObject = Record<string, any>;
export function softwareRow(run: JsonObject) {
 const reports: JsonObject[]=run.reports ?? [];
 const latest=(role:string)=>reports.find(r=>r.role===role);
 const a=latest("analyst"),n=latest("news"),s=latest("sxf");
 const sd=s?.display ?? {};
 const num=(v:unknown,min:number,max:number)=>typeof v==="number"&&Number.isFinite(v)&&v>=min&&v<=max?v:null;
 const str=(v:unknown)=>typeof v==="string"&&v.trim()?v:null;
 const score=(v:unknown)=>num(v,0,100);
 const kickoff=str(run.kickoff_utc);
 return {id:run.id,fixtureUid:run.fixture_uid,
 date:kickoff?new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/Istanbul"}).format(new Date(kickoff)):"",
 kickoffAt:kickoff,league:str(run.league),homeTeam:str(run.home_team)??"—",awayTeam:str(run.away_team)??"—",
 market:str(sd.market),selection:str(sd.selection),signalCode:str(sd.signal_code)??"—",
 analystScore:a?.display?.market===sd.market && a?.display?.selection===sd.selection && str(sd.selection)?score(a?.display?.support_score):null,
 newsScore:n?.display?.market===sd.market && n?.display?.selection===sd.selection && str(sd.selection)?score(n?.display?.support_score):null,
 volumeShare:score(sd.volume_share_pct),drawShare:score(sd.draw_share_pct),
 currentOdds:num(sd.current_odds,1.001,10000),referenceOdds:num(sd.reference_odds,1.001,10000),
 referenceOddsAt:str(sd.reference_odds_at),currentOddsAt:str(sd.current_odds_at),
 capturedAt:str(s?.as_of),source:str(sd.source),reportStatus:reports.length===3?"complete":reports.length?"partial":"pending"};
}
