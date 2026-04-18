// App.jsx — top-level click-through between Hub and Deck views
const { useState } = React;

const lessonSlides = [
  { render: () => <CoverSlide />, notes: 'Welcome everyone. Today we build the vocabulary for everything else in the track.' },
  { render: () => <QuoteSlide />, notes: 'Sit with this for a beat. The skill is noticing, not coding.' },
  { render: () => <DefinitionSlide />, notes: 'Walk through the Intelligence example. 4 tokens — count them out loud.' },
  { render: () => <ProbabilitySlide />, notes: 'The 50,251 others is the point. Models live in long-tail distributions.' },
  { render: () => <FeedbackSlide />, notes: 'Leave two minutes for quiet writing before discussion.' },
];

function App() {
  const [view, setView] = useState('hub');  // 'hub' | 'deck'

  return (
    <div className="app">
      {view === 'hub'  && <LessonHub  onSelectLesson={() => setView('deck')} />}
      {view === 'deck' && (
        <div className="deck-wrap">
          <button className="back-to-hub" onClick={() => setView('hub')}>← All lessons</button>
          <SlideDeck slides={lessonSlides} lessonTitle="How a model predicts the next word" trackLabel="AI Foundations · Day 03" />
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
