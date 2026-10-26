# Presentation notes — 5-minute show-and-tell

## Executive summary

A timed talk track for the in-class show-and-tell. It covers the three required
points (situation, information gap, one thing learned from running it) plus one honest
limitation, and says which file or command to show at each step. No slides.

## Talk track

**0:00–0:45 · The situation.** *Show:* mode file, "When to use it".
An international master's student on OPT, year 1, who builds programmatic video
tooling. One portfolio, four honest titles: motion designer, product designer,
creative technologist, front-end engineer. They pick one before writing the résumé
headline, and it decides which employers are even in play.

**0:45–1:45 · The information gap.** *Show:* run 2 table in
`evidence/soc-arbitrage-2026-10-03-002.md`.
A job board shows openings, not sponsorship history *by title*. In the engine's
30,369-company file: product/interface design 55 employers, front-end 18, motion 2,
creative technologist 0. Without this, a rejected motion application reads as personal
failure, when the variable was the noun on the posting.

**1:45–3:30 · The one thing I learned: the right count, the wrong answer.**
*Show:* run 1 table, then its sample rows (A10 Networks "Principal QA Software
Engineer", Accolade "Mgr, Software Engineer").
My first run said 150× in favour of "front-end/software engineer". The arithmetic was
correct, and an independent Python re-count agreed. But 441 of those 450 employers came
from the generic "software engineer" probe, which catches jobs this student can't
claim. Only reading the rows showed it. Honest front-end count: 18. Real leader:
product design. I also had a salary column mislabelled: Figma's $190K is its engineers,
not its motion designer. *Lesson:* read rows before totals. It's now a gate in the mode.

*Optional live demo (about 1 second, offline):*

```bash
node scripts/contrib/2026fa/amoghmaddur-soc-arbitrage/soc-arbitrage.mjs search/examples/ishaan-varma/soc-arbitrage-framings.v2.json --asof 2026-10-03 --dry-run
```

**3:30–4:30 · What it can't do.** *Show:* run 3 table (worked example §3).
Of 14 AI-video companies this student would target, 10 aren't in the file, and the 4
that are have no sponsorship record. Universities and museums are barely there either.
The title→occupation mapping is my judgment, not data. No live posting is checked.

**4:30–5:00 · Close.** The mode never recommends a title. It shows the spread, labels
every number as read, computed, or missing, and hands the decision back to the student.

## If the demo fails

Open `evidence/soc-arbitrage-2026-10-03-002.md` directly. It is the same output.
