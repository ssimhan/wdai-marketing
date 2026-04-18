// Slides.jsx — inline React versions of a few slide archetypes used by SlideDeck
const Slide = ({ variant = 'hero', children }) => (
  <div className={`slide-canvas ${variant}`}>{children}</div>
);

const CoverSlide = () => (
  <Slide variant="hero">
    <div className="cover-brand">
      <img src="../../assets/wdai-logo.png" alt="WDAI" />
      <span>Women Defining AI</span>
    </div>
    <div className="cover-body">
      <div className="eyebrow">AI Foundations · Day 03</div>
      <h1>How a model <span className="grad-text">predicts</span> the next word.</h1>
      <p>Attention, tokens, and the quiet math beneath fluency.</p>
    </div>
  </Slide>
);

const QuoteSlide = () => (
  <Slide variant="hero-left">
    <div className="quote-mark">“</div>
    <h1 className="quote-body">
      You don't need to write code to reason about AI. You need to notice when a model <span className="grad-text">is guessing</span>.
    </h1>
    <div className="quote-attr">
      <div className="rule" />
      <div>
        <div className="name">Fei-Fei Li</div>
        <div className="role">Stanford HAI · 2024</div>
      </div>
    </div>
  </Slide>
);

const DefinitionSlide = () => (
  <Slide variant="flat">
    <div className="def-grid">
      <div>
        <div className="eyebrow">Definition</div>
        <h1 className="grad-text def-term">Token.</h1>
        <div className="def-ipa">/ˈtoʊ.kən/ · noun</div>
      </div>
      <div>
        <p className="def-primary">The smallest chunk a model reads — roughly a syllable, sometimes a whole word, sometimes a fragment of punctuation.</p>
        <p className="def-secondary">Everything a model predicts, it predicts one token at a time.</p>
        <div className="token-row">
          <span className="tok">In</span>
          <span className="tok pink">telli</span>
          <span className="tok coral">gen</span>
          <span className="tok yellow">ce</span>
        </div>
      </div>
    </div>
  </Slide>
);

const ProbabilitySlide = () => {
  const bars = [
    { word: '" word"', pct: 86.4, w: 86, color: 'grad' },
    { word: '" token"', pct: 9.1, w: 9, color: 'grad-dim' },
    { word: '" step"', pct: 2.8, w: 3, color: 'grad-dimmer' },
    { word: '" sentence"', pct: 1.2, w: 1.5, color: 'yellow' },
  ];
  return (
    <Slide variant="flat">
      <div className="bars-wrap">
        <div className="eyebrow">Next-token probabilities</div>
        <h1>What the model is <span className="grad-text">actually</span> choosing between.</h1>
        <div className="bars">
          {bars.map(b => (
            <div className="bar-row" key={b.word}>
              <div className="bar-label">{b.word}</div>
              <div className="bar-track"><div className={`bar-fill ${b.color}`} style={{ width: `${b.w}%` }} /></div>
              <div className="bar-pct">{b.pct}%</div>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
};

const FeedbackSlide = () => (
  <Slide variant="hero">
    <div className="feedback-body">
      <div className="eyebrow">Closing · Day 03</div>
      <h1>What's <span className="grad-text">still fuzzy</span> for you?</h1>
      <p>One sentence in the margin. Your confusion is the most valuable thing you'll bring to tomorrow.</p>
    </div>
    <div className="feedback-note">
      <div className="note-head">
        <div className="avatar">MR</div>
        <div>
          <div className="name">Maya R.</div>
          <div className="time">2 min ago · slide 11</div>
        </div>
      </div>
      <p>The token visualization clicked for me. But I'm still unclear on how attention "weights" get learned.</p>
      <div className="chips"><span className="chip pink">Question</span><span className="chip">Day 03</span></div>
    </div>
  </Slide>
);

Object.assign(window, { CoverSlide, QuoteSlide, DefinitionSlide, ProbabilitySlide, FeedbackSlide });
