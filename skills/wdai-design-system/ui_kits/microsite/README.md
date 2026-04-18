# Microsite UI kit

Recreation of the **curriculum.helenleekupp.com** experience at UI-kit fidelity. A hub index listing 15 days of AI Foundations, and a keyboard-driven slide deck that opens when you pick a lesson.

## Files
- `index.html` — entry point, click-thru prototype
- `microsite.css` — all microsite styles (imports `colors_and_type.css`)
- `App.jsx` — routes between hub and deck
- `LessonHub.jsx` — `/basics` style day-grid
- `SlideDeck.jsx` — keyboard slide viewer (←/→, space, `s` for notes)
- `Slides.jsx` — React versions of 5 slide archetypes (Cover, Quote, Definition, Probability, Feedback)

## Interactions
- Click any day card in the hub → opens the deck.
- `← Back` returns to the hub.
- Arrow keys navigate slides; `s` toggles speaker notes; current slide index persists across reloads via `localStorage`.
- Progress bar fills pink→orange as you advance.

## Caveat
No codebase was shipped with the brief, so interaction details (nav link copy, exact day titles, footer, note-taking UI) are best-guess reconstructions from the written spec. Attach the real Vite + React source and I'll align pixel-for-pixel.
