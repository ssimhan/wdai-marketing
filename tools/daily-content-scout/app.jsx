
const MODEL = "claude-sonnet-4-20250514";
const CHANNEL_ID = "C0AKR6N50T0"; // #team-marketing-workstream2-content-ideas
const LUMA_CALENDAR_ID = "ednnph5j2tft0a8qahllu39ua0v174nc@import.calendar.google.com";

function isMonday() {
  return new Date().getDay() === 1;
}
function get24hAgo() {
  return Math.floor((Date.now() - 24 * 60 * 60 * 1000) / 1000).toString();
}
function get72hAgo() {
  return Math.floor((Date.now() - 72 * 60 * 60 * 1000) / 1000).toString();
}
function get7dAgo() {
  return Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000).toString();
}

const SEARCH_PASSES = [
  { label: "Pass 1 — Shipping", queries: ["built", "shipped", "launched", "deployed", "live"] },
  { label: "Pass 2 — Demo/Share", queries: ["demo", "walkthrough", "I made", "check this out"] },
  { label: "Pass 3 — Tools", queries: ["Lovable", "Bolt", "Replit", "Claude", "Cursor", "Vercel"] },
  { label: "Pass 4 — Journey", queries: ["vibe coding", "first time", "figured out", "learned", "struggled", "finally"] },
  { label: "Pass 5 — Feedback", queries: ["feedback", "would love thoughts", "take a look", "share your project"] },
  { label: "Pass 6 — Topic Channels", queries: ["anyone using", "how does everyone", "tip for", "recommendation", "question about", "game changer", "trying this"] },
  { label: "Pass 7 — Session-Inspired", queries: ["after the session", "from the workshop", "office hour", "BuildTogether", "SheBuilds", "inspired by", "tried it after", "because of this community"] },
];

async function fetchCalendarEvents() {
  const today = new Date();
  const in14Days = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
  const timeMin = today.toISOString().slice(0, 19);
  const timeMax = in14Days.toISOString().slice(0, 19);

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1000,
      mcp_servers: [{ type: "url", url: "https://mcp.gcal.com/mcp", name: "gcal-mcp" }],
      system: "You are a calendar assistant. Use the gcal_list_events tool to fetch events and return a clean list of event names, dates, and any host/organizer information. Return raw event details — do not summarize.",
      messages: [{
        role: "user",
        content: `Fetch all events from calendar ID "${LUMA_CALENDAR_ID}" between ${timeMin} and ${timeMax}. For each event return: event name, start date/time, end date/time, description, and organizer/host name if available.`
      }]
    })
  });
  const data = await response.json();
  const toolResults = data.content?.filter(b => b.type === "mcp_tool_result").map(b => b.content?.[0]?.text || "").join("\n") || "";
  const textBlocks = data.content?.filter(b => b.type === "text").map(b => b.text || "").join("\n") || "";
  return toolResults || textBlocks || "No upcoming events found in the next 14 days.";
}

async function runSlackSearch(query, after) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1000,
      mcp_servers: [{ type: "url", url: "https://mcp.slack.com/mcp", name: "slack-mcp" }],
      system: "You are a Slack search assistant. When asked to search Slack, use the slack_search_public_and_private tool and return the raw results as-is. Do not summarize or interpret. Just return what the tool returns.",
      messages: [{
        role: "user",
        content: `Search Slack for messages containing: "${query}" after timestamp ${after}. Return up to 10 results with concise format. Include channel name, author, and message text.`
      }]
    })
  });
  const data = await response.json();
  const toolResults = data.content?.filter(b => b.type === "mcp_tool_result").map(b => b.content?.[0]?.text || "").join("\n") || "";
  const textBlocks = data.content?.filter(b => b.type === "text").map(b => b.text || "").join("\n") || "";
  return toolResults || textBlocks;
}

async function analyzeOpportunities(allResults, calendarEvents, focusNote, windowLabel = "24 hours") {
  const calendarSection = `## Upcoming WDAI Events (next 14 days)\n\n${calendarEvents}`;
  const prompt = `Here are Slack search results from 7 keyword passes across the WDAI workspace from the past ${windowLabel}.\n\n${focusNote ? `Today's focus: ${focusNote}\n\n` : ""}${calendarSection}\n\n---\n\n## Slack Search Results\n\n${allResults}\n\nNow identify and format the content opportunities as instructed. Tag each one [Internal], [External], or [Both]. Include "Push to" for all Internal and Both items. Include "Tied to" wherever a calendar connection exists within 14 days.`;
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }]
    })
  });
  const data = await response.json();
  return data.content?.find(b => b.type === "text")?.text || "No analysis returned.";
}

async function sendToChannel(analysis, focusNote, windowLabel = "24 hours") {
  const msg = `*📣 WDAI Daily Content Scout — ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}*\n_Search window: ${windowLabel}_${focusNote ? `\n_Focus: ${focusNote}_` : ""}\n\n${analysis}`;
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1000,
      mcp_servers: [{ type: "url", url: "https://mcp.slack.com/mcp", name: "slack-mcp" }],
      system: "You are a Slack assistant. Post a message to a channel exactly as instructed using the slack send message tool.",
      messages: [{
        role: "user",
        content: `Send this exact message to Slack channel ID ${CHANNEL_ID}:\n\n${msg}`
      }]
    })
  });
  const data = await response.json();
  return data.content?.some(b => b.type === "mcp_tool_result");
}

export default function App() {
  const [status, setStatus] = useState("idle");
  const [log, setLog] = useState([]);
  const [result, setResult] = useState("");
  const [focusNote, setFocusNote] = useState("");
  const [posted, setPosted] = useState(false);

  const addLog = (msg) => setLog(l => [...l, msg]);

  const runScout = async () => {
    setStatus("running");
    setLog([]);
    setResult("");
    setPosted(false);

    const monday = isMonday();
    const after = monday ? get72hAgo() : get24hAgo();
    const windowLabel = monday ? "72 hours (Fri–Mon)" : "24 hours";
    let allResults = "";

    if (monday) addLog("📅 It's Monday — expanding search window to cover the weekend (72h)");

    try {
      // Step 0: Fetch calendar events
      addLog("📅 Step 0 — Fetching upcoming WDAI events from calendar...");
      let calendarEvents = "No upcoming events found.";
      try {
        calendarEvents = await fetchCalendarEvents();
        addLog("✅ Calendar fetched");
      } catch (e) {
        addLog("⚠️ Calendar fetch failed, continuing without it");
      }

      for (const pass of SEARCH_PASSES) {
        addLog(`🔍 ${pass.label}...`);
        for (const kw of pass.queries) {
          try {
            const r = await runSlackSearch(kw, after);
            if (r && r.length > 50) {
              allResults += `\n\n--- ${pass.label} | keyword: "${kw}" ---\n${r}`;
            }
          } catch (e) {
            addLog(`  ⚠️ "${kw}" failed, skipping`);
          }
        }
      }

      addLog("🧠 Analyzing opportunities...");
      const analysis = await analyzeOpportunities(allResults || `No results found in ${windowLabel}.`, calendarEvents, focusNote, windowLabel);
      setResult(analysis);

      addLog("📬 Posting to #team-marketing-workstream2-content-ideas...");
      const sent = await sendToChannel(analysis, focusNote, windowLabel);
      setPosted(sent);
      addLog(sent ? "✅ Posted to channel!" : "⚠️ Post may not have sent — check Slack");

      setStatus("done");
    } catch (e) {
      addLog(`❌ Error: ${e.message}`);
      setStatus("error");
    }
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 680, margin: "0 auto", padding: 24, background: "#0f0f0f", minHeight: "100vh", color: "#f0f0f0" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#c084fc", margin: 0 }}>📣 WDAI Content Scout</h1>
        <p style={{ fontSize: 13, color: "#888", marginTop: 4 }}>Searches the full WDAI Slack workspace and posts tagged opportunities to #team-marketing-workstream2-content-ideas.</p>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 13, color: "#aaa", display: "block", marginBottom: 6 }}>Today's focus (optional)</label>
        <input
          value={focusNote}
          onChange={e => setFocusNote(e.target.value)}
          placeholder="e.g. Module 2 is launching next week, flag SheBuilds IWD stories..."
          disabled={status === "running"}
          style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #333", background: "#1a1a1a", color: "#f0f0f0", fontSize: 13, boxSizing: "border-box", outline: "none" }}
        />
      </div>

      <button
        onClick={runScout}
        disabled={status === "running"}
        style={{
          width: "100%", padding: "12px 0", borderRadius: 8, border: "none",
          background: status === "running" ? "#4a2d6e" : "#7c3aed",
          color: "#fff", fontWeight: 600, fontSize: 15, cursor: status === "running" ? "not-allowed" : "pointer",
          transition: "background 0.2s"
        }}
      >
        {status === "running" ? "⏳ Scouting..." : "🚀 Run Daily Scout"}
      </button>

      {log.length > 0 && (
        <div style={{ marginTop: 20, background: "#1a1a1a", borderRadius: 8, padding: 14, fontSize: 12, color: "#888", lineHeight: 1.8 }}>
          {log.map((l, i) => <div key={i}>{l}</div>)}
        </div>
      )}

      {result && (
        <div style={{ marginTop: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: "#c084fc", margin: 0 }}>Results</h2>
            {posted && <span style={{ fontSize: 12, color: "#4ade80" }}>✅ Posted to #team-marketing-workstream2-content-ideas</span>}
          </div>
          <div style={{
            background: "#1a1a1a", borderRadius: 8, padding: 16, fontSize: 13,
            color: "#e0e0e0", lineHeight: 1.8, whiteSpace: "pre-wrap",
            border: "1px solid #2a2a2a"
          }}>
            {result}
          </div>
        </div>
      )}
    </div>
  );
}
