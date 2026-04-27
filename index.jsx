import { useState } from "react";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  blue: "#0057B8",
  dark: "#003A7A",
  gold: "#FFCD00",
  light: "#E8F0FB",
  bg: "#EDF2FA",
  surface: "#FFFFFF",
  text: "#0D1B2A",
  muted: "#5A6A80",
  border: "rgba(0,87,184,0.15)",
};

const CAT_COLORS = {
  Transfer: "#7B4FD4",
  Match: "#0057B8",
  Injury: "#C0392B",
  Club: "#1A8A3C",
  Manager: "#D4780A",
};

const OUTCOME_STYLE = {
  win:  { color: "#1A8A3C", bg: "#E8F7EE" },
  draw: { color: "#0057B8", bg: "#EAF1FB" },
  loss: { color: "#C0392B", bg: "#FCECEA" },
};

const POS_LABELS = { GK: "Goalkeeper", DEF: "Defender", MID: "Midfielder", FWD: "Forward" };

// ─── Static mock data ─────────────────────────────────────────────────────────
const NEWS = [
  {
    title: "Brighton Secure Late Winner Against Wolves",
    summary: "Joao Pedro's 88th-minute header secured all three points for Brighton at the Amex. The result moves the Seagulls up to eighth in the Premier League table.",
    category: "Match",
    date: "Apr 2025",
  },
  {
    title: "Fabian Hurzeler Eyes Summer Reinforcements",
    summary: "Brighton's head coach has outlined his plans to strengthen the squad ahead of the 2025-26 season. The club is reportedly targeting a new central midfielder and a backup striker.",
    category: "Manager",
    date: "Apr 2025",
  },
  {
    title: "Tariq Lamptey Returns to Full Training",
    summary: "The right-back has resumed full training after a six-week hamstring injury absence. Lamptey is expected to be available for selection in the upcoming fixture against Brentford.",
    category: "Injury",
    date: "Mar 2025",
  },
  {
    title: "Club Breaks Transfer Record with New Signing",
    summary: "Brighton have completed the signing of a highly rated Bundesliga midfielder in a club-record deal. The 23-year-old arrives with an impressive 14 goals and 11 assists this season.",
    category: "Transfer",
    date: "Mar 2025",
  },
  {
    title: "Amex Stadium Expansion Plans Approved",
    summary: "Brighton have received planning permission to expand the Amex Stadium's capacity to 34,500. Construction is expected to begin in the summer of 2025.",
    category: "Club",
    date: "Feb 2025",
  },
];

const PLAYERS = [
  { name: "Bart Verbruggen",    number: 1,  position: "GK",  flag: "🇳🇱" },
  { name: "Jason Steele",       number: 23, position: "GK",  flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { name: "Joel Veltman",       number: 2,  position: "DEF", flag: "🇳🇱" },
  { name: "Lewis Dunk",         number: 5,  position: "DEF", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { name: "Jan Paul van Hecke", number: 6,  position: "DEF", flag: "🇳🇱" },
  { name: "Pervis Estupinan",   number: 3,  position: "DEF", flag: "🇪🇨" },
  { name: "Tariq Lamptey",      number: 18, position: "DEF", flag: "🇬🇭" },
  { name: "Adam Webster",       number: 4,  position: "DEF", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { name: "Carlos Baleba",      number: 28, position: "MID", flag: "🇨🇲" },
  { name: "Yasin Ayari",        number: 21, position: "MID", flag: "🇸🇪" },
  { name: "Jack Hinshelwood",   number: 47, position: "MID", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { name: "Matt O'Riley",       number: 10, position: "MID", flag: "🇩🇰" },
  { name: "James Milner",       number: 16, position: "MID", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { name: "Brajan Gruda",       number: 20, position: "MID", flag: "🇩🇪" },
  { name: "Simon Adingra",      number: 29, position: "FWD", flag: "🇨🇮" },
  { name: "Joao Pedro",         number: 9,  position: "FWD", flag: "🇧🇷" },
  { name: "Danny Welbeck",      number: 7,  position: "FWD", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { name: "Georginio Rutter",   number: 14, position: "FWD", flag: "🇫🇷" },
  { name: "Evan Ferguson",      number: 27, position: "FWD", flag: "🇮🇪" },
];

const FIXTURES = [
  { date: "5",  month: "Apr", opponent: "Wolves",       home: true,  competition: "Premier League", result: "2-1", outcome: "win",  time: null },
  { date: "29", month: "Mar", opponent: "Bournemouth",   home: false, competition: "Premier League", result: "1-1", outcome: "draw", time: null },
  { date: "15", month: "Mar", opponent: "Nottm Forest",  home: true,  competition: "Premier League", result: "0-2", outcome: "loss", time: null },
  { date: "8",  month: "Mar", opponent: "Newcastle",     home: false, competition: "Premier League", result: "3-1", outcome: "win",  time: null },
  { date: "22", month: "Feb", opponent: "Everton",       home: true,  competition: "Premier League", result: "2-0", outcome: "win",  time: null },
  { date: "13", month: "Apr", opponent: "Brentford",     home: false, competition: "Premier League", result: null,  outcome: null,   time: "14:00" },
  { date: "20", month: "Apr", opponent: "Man United",    home: true,  competition: "Premier League", result: null,  outcome: null,   time: "16:30" },
  { date: "3",  month: "May", opponent: "Fulham",        home: false, competition: "Premier League", result: null,  outcome: null,   time: "15:00" },
];

// ─── Shared primitives ────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: "'Barlow Condensed', sans-serif",
      fontSize: 11, fontWeight: 700, letterSpacing: 2,
      textTransform: "uppercase", color: C.blue,
      marginBottom: 12, marginTop: 4,
    }}>
      {children}
    </div>
  );
}

function GroupLabel({ children }) {
  return (
    <div style={{
      fontFamily: "'Barlow Condensed', sans-serif",
      fontSize: 11, fontWeight: 700, letterSpacing: 2,
      textTransform: "uppercase", color: C.muted,
      margin: "16px 0 8px", paddingLeft: 2,
    }}>
      {children}
    </div>
  );
}

// ─── News panel ───────────────────────────────────────────────────────────────
function NewsPanel() {
  return (
    <div>
      <SectionLabel>Latest Updates</SectionLabel>
      {NEWS.map((n, i) => {
        const col = CAT_COLORS[n.category] || C.blue;
        return (
          <div key={i} style={{
            background: C.surface, borderRadius: 10,
            border: `1px solid ${C.border}`, padding: 16, marginBottom: 12,
          }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{
                width: 8, height: 8, background: col, borderRadius: "50%",
                marginTop: 7, flexShrink: 0,
              }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4, color: C.text, marginBottom: 5 }}>
                  {n.title}
                </div>
                <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>{n.summary}</div>
                <div style={{ fontSize: 11, marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: col, fontWeight: 600 }}>{n.category}</span>
                  <span style={{ width: 3, height: 3, background: col, borderRadius: "50%", opacity: 0.4, display: "inline-block" }} />
                  <span style={{ color: C.muted }}>{n.date}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Roster panel ─────────────────────────────────────────────────────────────
function RosterPanel() {
  const [posFilter, setPosFilter] = useState("All");
  const positions = ["All", "GK", "DEF", "MID", "FWD"];
  const filtered = posFilter === "All" ? PLAYERS : PLAYERS.filter(p => p.position === posFilter);

  const def = PLAYERS.filter(p => p.position === "DEF").length;
  const mid = PLAYERS.filter(p => p.position === "MID").length;
  const fwd = PLAYERS.filter(p => p.position === "FWD").length;

  const initials = name => name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div>
      {/* Stat strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 20 }}>
        {[{ val: def, lbl: "Defenders" }, { val: mid, lbl: "Midfielders" }, { val: fwd, lbl: "Forwards" }].map(({ val, lbl }) => (
          <div key={lbl} style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: 10, padding: "12px 10px", textAlign: "center",
          }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 26, color: C.blue, lineHeight: 1 }}>{val}</div>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 500, marginTop: 2 }}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* Position filter */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
        {positions.map(pos => (
          <button key={pos} onClick={() => setPosFilter(pos)} style={{
            padding: "5px 12px", borderRadius: 20,
            border: `1px solid ${posFilter === pos ? C.blue : C.border}`,
            background: posFilter === pos ? C.blue : C.surface,
            fontSize: 12, fontWeight: 600,
            color: posFilter === pos ? "#fff" : C.muted,
            cursor: "pointer", fontFamily: "Barlow, sans-serif", transition: "all 0.15s",
          }}>
            {pos}
          </button>
        ))}
      </div>

      {/* Player grid */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
        gap: 10, marginBottom: 12,
      }}>
        {filtered.map((p, i) => (
          <div key={i} style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: 10, padding: "14px 12px", textAlign: "center",
          }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 28, color: C.blue, lineHeight: 1 }}>
              {p.number}
            </div>
            <div style={{
              width: 42, height: 42, background: C.light, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 15,
              color: C.blue, margin: "6px auto", border: `2px solid ${C.border}`,
            }}>
              {initials(p.name)}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text, lineHeight: 1.3 }}>{p.name}</div>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 500 }}>{POS_LABELS[p.position]}</div>
            <div style={{ fontSize: 16, marginTop: 4 }}>{p.flag}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Fixtures panel ───────────────────────────────────────────────────────────
function FixturesPanel() {
  const results = FIXTURES.filter(f => f.result);
  const upcoming = FIXTURES.filter(f => !f.result);

  function FixtureCard({ f }) {
    const os = f.outcome ? OUTCOME_STYLE[f.outcome] : null;
    return (
      <div style={{
        background: C.surface, borderRadius: 10, border: `1px solid ${C.border}`,
        padding: "14px 16px", marginBottom: 10, display: "flex", alignItems: "center", gap: 12,
      }}>
        {/* Date */}
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, fontWeight: 700,
          textAlign: "center", color: C.muted, minWidth: 38,
          textTransform: "uppercase", lineHeight: 1.3,
        }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: C.blue, display: "block", lineHeight: 1 }}>{f.date}</span>
          {f.month}
        </div>

        <div style={{ width: 1, height: 40, background: C.border, flexShrink: 0 }} />

        {/* Match info */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 3 }}>
            {f.home
              ? <><span style={{ color: C.blue }}>Brighton</span> vs {f.opponent}</>
              : <>{f.opponent} vs <span style={{ color: C.blue }}>Brighton</span></>}
          </div>
          <div style={{ fontSize: 12, color: C.muted }}>
            {f.competition} · {f.home ? "Amex Stadium" : "Away"}
          </div>
        </div>

        {/* Result or time */}
        {f.result ? (
          <div style={{ textAlign: "center", minWidth: 52 }}>
            <div style={{
              fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
              letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 4,
              background: os.bg, color: os.color,
            }}>
              {f.outcome.toUpperCase()}
            </div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 16, color: os.color }}>
              {f.result}
            </div>
          </div>
        ) : (
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
            fontSize: 14, color: C.muted, minWidth: 40, textAlign: "center",
          }}>
            {f.time}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <GroupLabel>Recent Results</GroupLabel>
      {results.map((f, i) => <FixtureCard key={i} f={f} />)}
      <GroupLabel>Upcoming Fixtures</GroupLabel>
      {upcoming.map((f, i) => <FixtureCard key={i} f={f} />)}
    </div>
  );
}

// ─── Root app ─────────────────────────────────────────────────────────────────
const TABS = ["News", "Roster", "Fixtures"];

export default function BrightonTracker() {
  const [activeTab, setActiveTab] = useState("News");

  return (
    <div style={{ fontFamily: "Barlow, sans-serif", background: C.bg, minHeight: "100vh", color: C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button { font-family: inherit; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ background: C.blue, padding: "20px 24px 0", position: "relative", overflow: "hidden" }}>
        {/* Gold glow orb */}
        <div style={{
          position: "absolute", top: -40, right: -60, width: 200, height: 200,
          background: C.gold, opacity: 0.08, borderRadius: "50%",
        }} />

        {/* Club identity */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, position: "relative" }}>
          <div style={{
            width: 52, height: 52, background: "#fff", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900,
            fontSize: 15, color: C.blue, border: `2px solid ${C.gold}`, flexShrink: 0,
          }}>
            BHA
          </div>
          <div>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 22,
              color: "#fff", letterSpacing: 0.5, lineHeight: 1, textTransform: "uppercase",
            }}>
              Brighton & Hove Albion
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 3, letterSpacing: 0.5 }}>
              The Seagulls · Premier League · Amex Stadium
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", position: "relative" }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
              fontSize: 14, letterSpacing: 1, textTransform: "uppercase",
              color: activeTab === tab ? C.gold : "rgba(255,255,255,0.6)",
              padding: "10px 20px", border: "none", background: "none", cursor: "pointer",
              borderBottom: `3px solid ${activeTab === tab ? C.gold : "transparent"}`,
              transition: "all 0.2s",
            }}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ padding: "20px" }}>
        {activeTab === "News"     && <NewsPanel />}
        {activeTab === "Roster"   && <RosterPanel />}
        {activeTab === "Fixtures" && <FixturesPanel />}
      </div>
    </div>
  );
}