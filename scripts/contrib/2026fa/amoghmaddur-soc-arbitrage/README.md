---
owner: amoghmaddur
term: 2026fa
component: soc-arbitrage
status: RUNNABLE-SAMPLE
promoted_to: null
---

# soc-arbitrage — contribution

## Executive summary

**What this is.** The script, tests and independent re-count behind the
creative-technical SOC-arbitrage recipe. **Why read it.** To re-run or check the
recipe's numbers. **What it does.** It counts, from committed data only, how many
employers have ever sponsored each title a candidate could honestly use — and
labels every number as read, computed, or missing.

## Files

| File | Role |
|---|---|
| `soc-arbitrage.mjs` | the scorer — offline, Node, no dependencies |
| `soc-arbitrage.test.mjs` | 15 tests against `fixtures/`; runs the real CLIs as subprocesses |
| `niche-coverage.py` | is each employer on the candidate's list in the file, and does it have an H-1B record? |
| `crosscheck.py` | independent Python re-count; `--against <agent-log>` exits 1 on any mismatch |
| `fixtures/` | 5-company H-1B CSV, 3-row SOC CSV, 3-framing profile (shared by both scripts' tests) |

## Run

```bash
node --test scripts/contrib/2026fa/amoghmaddur-soc-arbitrage/soc-arbitrage.test.mjs
node scripts/contrib/2026fa/amoghmaddur-soc-arbitrage/soc-arbitrage.mjs search/examples/ishaan-varma/soc-arbitrage-framings.v2.json --dry-run
```

Recipe: `recipes/cases/2026fa/amoghmaddur-ai-media-soc-arbitrage.md`.
Run evidence: `course/2026fa/submissions/amoghmaddur/`.
No `package.json` script — contribution tools get one only at promotion.
