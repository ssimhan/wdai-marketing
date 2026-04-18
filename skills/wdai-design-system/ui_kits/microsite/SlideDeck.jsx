// SlideDeck.jsx — keyboard-driven slide viewer
const { useState, useEffect, useCallback, useRef, useLayoutEffect } = React;

function SlideDeck({ slides, lessonTitle, trackLabel }) {
  const [idx, setIdx] = useState(() => {
    const saved = localStorage.getItem('wdai:slideIdx');
    const n = saved ? parseInt(saved, 10) : 0;
    return (isFinite(n) && n >= 0 && n < slides.length) ? n : 0;
  });
  const [showNotes, setShowNotes] = useState(false);
  const frameRef = useRef(null);
  const [scale, setScale] = useState(0.5);

  useLayoutEffect(() => {
    const update = () => {
      const el = frameRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setScale(r.width / 1920);
    };
    update();
    const ro = new ResizeObserver(update);
    if (frameRef.current) ro.observe(frameRef.current);
    window.addEventListener('resize', update);
    return () => { ro.disconnect(); window.removeEventListener('resize', update); };
  }, []);

  useEffect(() => { localStorage.setItem('wdai:slideIdx', String(idx)); }, [idx]);

  const next = useCallback(() => setIdx(i => Math.min(i + 1, slides.length - 1)), [slides.length]);
  const prev = useCallback(() => setIdx(i => Math.max(i - 1, 0)), []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
      else if (e.key === 's' || e.key === 'S') { setShowNotes(v => !v); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  const slide = slides[idx];

  return (
    <div className="deck">
      <header className="deck-header">
        <div className="deck-brand">
          <img src="../../assets/wdai-logo.png" alt="WDAI" />
          <div>
            <div className="track">{trackLabel}</div>
            <div className="lesson">{lessonTitle}</div>
          </div>
        </div>
        <div className="deck-controls">
          <button className="btn ghost" onClick={() => setShowNotes(v => !v)}>
            {showNotes ? 'Hide notes' : 'Speaker notes'} <span className="kbd">S</span>
          </button>
          <div className="counter">{String(idx + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</div>
        </div>
      </header>

      <main className="deck-stage">
        <div className="slide-frame" ref={frameRef}>
          <div className="slide-scaler" style={{ position: 'absolute', top: 0, left: 0, width: '1920px', height: '1080px', transformOrigin: 'top left', transform: `scale(${scale})` }}>
            {slide.render()}
          </div>
        </div>
        <button className="nav nav-left" onClick={prev} disabled={idx === 0} aria-label="Previous">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button className="nav nav-right" onClick={next} disabled={idx === slides.length - 1} aria-label="Next">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6"/></svg>
        </button>
      </main>

      <div className="progress">
        <div className="progress-fill" style={{ width: `${((idx + 1) / slides.length) * 100}%` }} />
      </div>

      {showNotes && (
        <div className="notes">
          <div className="notes-label">Speaker notes</div>
          <p>{slide.notes || 'No notes for this slide.'}</p>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { SlideDeck });
