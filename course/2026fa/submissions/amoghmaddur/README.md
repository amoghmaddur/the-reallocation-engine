# Submission — creative-technical SOC arbitrage (amoghmaddur, 2026fa)

## Executive summary

**What this is.** The index to one mode for The Reallocation Engine, built for an
international student on OPT whose one portfolio could be titled as design, motion, or
engineering. **Why read it.** It points to the three graded pieces and to the files
that let anyone re-run them. **Where it landed.** Runnable on the engine's committed
data, with three logged runs and an independent re-count. It has not been run against
live job postings.

## The three deliverables

| Deliverable | File |
|---|---|
| 1. Mode file | `recipes/cases/2026fa/amoghmaddur-ai-media-soc-arbitrage.md` (human card: `.card.md`) |
| 2. Domain justification | `course/2026fa/submissions/amoghmaddur/domain-justification.md` |
| 3. Worked example | `course/2026fa/submissions/amoghmaddur/worked-example.md` (+ `evidence/`) |
| Run-log entry | `logs/runs/2026fa-amoghmaddur-1.md` |
| Presentation (5 min) | `course/2026fa/submissions/amoghmaddur/presentation-notes.md` |

Supporting files: `scripts/contrib/2026fa/amoghmaddur-soc-arbitrage/` (scorer, niche check,
15 tests, independent cross-check, fixtures) · `search/examples/ishaan-varma/` (fictional
persona, two framing files, niche-employer list) · one added row in `search/examples/README.md`.

## Reproduce (from the repo root)

```bash
node --test scripts/contrib/2026fa/amoghmaddur-soc-arbitrage/soc-arbitrage.test.mjs
node scripts/contrib/2026fa/amoghmaddur-soc-arbitrage/soc-arbitrage.mjs search/examples/ishaan-varma/soc-arbitrage-framings.v2.json --asof 2026-10-03 --dry-run
python scripts/contrib/2026fa/amoghmaddur-soc-arbitrage/crosscheck.py search/examples/ishaan-varma/soc-arbitrage-framings.v2.json --against course/2026fa/submissions/amoghmaddur/evidence/soc-arbitrage-2026-10-03-002.json
python scripts/contrib/2026fa/amoghmaddur-soc-arbitrage/niche-coverage.py search/examples/ishaan-varma/niche-employers.json
```

## Deviations from the brief (deliberate)

- The brief says `modes/` and `modes/RUN_LOG.md`. This repo calls modes **recipes**. Student
  recipes go in `recipes/cases/<term>/`, and run logs go in `logs/runs/`, because
  `logs/RUN_LOG.md` is maintainer-only and the contrib CI gate fails any student PR that
  touches it.
