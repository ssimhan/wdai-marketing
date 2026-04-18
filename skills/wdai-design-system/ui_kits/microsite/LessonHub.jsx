// LessonHub.jsx — hub index page listing 15 days of a track
const trackLessons = [
  { day: '01', title: 'What AI is, and what it is not', minutes: 12, status: 'done' },
  { day: '02', title: 'Tokens, embeddings, and the vocabulary a model sees', minutes: 14, status: 'done' },
  { day: '03', title: 'How a model predicts the next word', minutes: 16, status: 'current' },
  { day: '04', title: 'Why models hallucinate and how to catch them', minutes: 18, status: 'upcoming' },
  { day: '05', title: 'Context windows and the cost of memory', minutes: 12, status: 'upcoming' },
  { day: '06', title: 'Temperature, top-p, and the feel of randomness', minutes: 14, status: 'upcoming' },
  { day: '07', title: 'Prompting as a form of writing', minutes: 18, status: 'upcoming' },
  { day: '08', title: 'Fine-tuning vs. in-context learning', minutes: 20, status: 'upcoming' },
  { day: '09', title: 'Retrieval and why your PDF search keeps lying to you', minutes: 16, status: 'upcoming' },
];

function LessonHub({ onSelectLesson }) {
  return (
    <div className="hub">
      <header className="hub-header">
        <div className="hub-brand">
          <img src="../../assets/wdai-logo.png" alt="WDAI" />
          <span>Women Defining AI</span>
        </div>
        <nav className="hub-nav">
          <a className="nav-link active">Foundations</a>
          <a className="nav-link">Intermediate</a>
          <a className="nav-link">Advanced</a>
          <a className="nav-link">Charter</a>
        </nav>
      </header>

      <section className="hub-hero">
        <div className="eyebrow">15 days · AI Foundations</div>
        <h1>
          The vocabulary you need<br/>
          to <span className="grad-text">reason</span> about AI in public.
        </h1>
        <p>A daily lesson — 12 to 20 minutes — that builds a working mental model of how these systems actually work. No code required. No math homework. Claim-first writing for sophisticated professionals.</p>
        <div className="hub-cta">
          <button className="btn primary" onClick={() => onSelectLesson('03')}>Continue Day 03 →</button>
          <button className="btn ghost">See the syllabus</button>
        </div>
      </section>

      <section className="hub-days">
        <div className="section-head">
          <h2>Lessons</h2>
          <div className="meta-line">
            <span className="dot pink"></span> In progress &nbsp;
            <span className="dot cream"></span> Done &nbsp;
            <span className="dot dim"></span> Upcoming
          </div>
        </div>
        <div className="day-grid">
          {trackLessons.map((l) => (
            <button key={l.day} className={`day-card ${l.status}`} onClick={() => onSelectLesson(l.day)}>
              <div className="day-top">
                <div className="day-num">Day {l.day}</div>
                <div className="day-min">{l.minutes} min</div>
              </div>
              <div className="day-title">{l.title}</div>
              <div className="day-bottom">
                {l.status === 'done'    && <span className="status done">Complete</span>}
                {l.status === 'current' && <span className="status current">Continue →</span>}
                {l.status === 'upcoming'&& <span className="status upcoming">Start</span>}
              </div>
            </button>
          ))}
        </div>
      </section>

      <footer className="hub-foot">
        <div>© 2026 Women Defining AI · a non-profit community</div>
        <div className="foot-links"><a>About</a><a>Charter</a><a>Newsletter</a></div>
      </footer>
    </div>
  );
}

Object.assign(window, { LessonHub });
