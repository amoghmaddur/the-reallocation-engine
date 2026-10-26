# 2026fa — amoghmaddur — run 1

## Executive summary

Two sample runs of the creative-technical SOC-arbitrage recipe against the engine's
committed company and occupation data, for a fictional persona. The first run's
headline (150×, in favour of a software framing) came from a probe that matched titles
the persona cannot claim. The second run, with revised inputs, ranks
product/interface design first among claimable titles (55 employers). Both runs were
re-counted by independent code with zero mismatches. A third entry (2026-10-10) checks
whether the persona's own AI-video target employers are in the data: 10 of 14 are not. Filed here, not in
`logs/RUN_LOG.md`, per that file's header and the contrib gate.

## 2026-10-03 — SOC arbitrage, ishaan-varma (fictional) — run 1 of 2

- **Recipe:** `recipes/cases/2026fa/amoghmaddur-ai-media-soc-arbitrage.md` v0.3.0 (status: RUNNABLE-SAMPLE)
- **Inputs:** `search/examples/ishaan-varma/soc-arbitrage-framings.json` (5 framings) · `--asof 2026-10-03`
- **Commands:** `node --test scripts/contrib/2026fa/amoghmaddur-soc-arbitrage/soc-arbitrage.test.mjs` (13/13) · `node scripts/contrib/2026fa/amoghmaddur-soc-arbitrage/soc-arbitrage.mjs <inputs> --asof 2026-10-03 --out-dir course/2026fa/submissions/amoghmaddur/evidence` · same with `--dry-run --strict` (exit 2) · `python scripts/contrib/2026fa/amoghmaddur-soc-arbitrage/crosscheck.py <inputs> --against <agent-log>`
- **Outputs:** `course/2026fa/submissions/amoghmaddur/evidence/soc-arbitrage-2026-10-03-001.{json,md}`
- **Result:** front-end/software 450 · product/interface 55 · graphic 5 · creative direction 4 · motion 3 (150.0×). Rows showed 441 of 450 come from the generic `SOFTWARE ENGINEER` probe and `FILM` matched an engineering title, so the inputs were revised.
- **Gates:** 1, 2, 4, 6 passed · 3 closed (15-1255 unscored) · 5 closed (funding 372 days stale) · 7 (human read) → inputs revised, no framing chosen
- **Stop conditions / caveats fired:** `UNSCORABLE_FRAMING`, `STALE_FUNDING_DATA`, `TITLE_LIST_IS_A_SUMMARY`
- **Cross-check:** 15 compared, 0 mismatch(es)
- **Verified:** all counts, universe facts, SOC wages/scores where present
- **Inferred:** title→SOC mapping (no SOC column in source)
- **Open issues:** see run 2

## 2026-10-03 — SOC arbitrage, ishaan-varma (fictional) — run 2 of 2

- **Recipe:** same, v0.3.0
- **Inputs:** `search/examples/ishaan-varma/soc-arbitrage-framings.v2.json` (6 claimable + 1 control) · `--asof 2026-10-03`
- **Outputs:** `course/2026fa/submissions/amoghmaddur/evidence/soc-arbitrage-2026-10-03-002.{json,md}`
- **Result:** product/interface 55 · front-end/UI 18 · graphic 5 · creative direction 4 · motion 2 · creative technologist 0; control "Software Engineer (any)" 441, excluded from the spread
- **Gates:** 1, 2, 4, 6 passed · 3 closed (15-1255, 15-1299 unscored) · 5 closed · 7 open: the comparison is published for the persona's human reviewer; no framing chosen on their behalf
- **Stop conditions / caveats fired:** `UNSCORABLE_FRAMING`, `STALE_FUNDING_DATA`, `NO_SPONSORSHIP_RECORD` (creative-technologist), `TITLE_LIST_IS_A_SUMMARY`
- **Cross-check:** 19 compared, 0 mismatch(es)
- **Verified:** all counts; one-off: 55 → 48 product/interface employers without Head/Director/Manager/Researcher titles
- **Inferred:** title→SOC mapping; `claimable` flags
- **Fixed this session:** company-wide salary/approval no longer shown as title-level; control framings excluded from headline; run IDs auto-increment (no overwrite); malformed profile JSON exits 65 legibly; frontmatter `attestation` reset to `null` per lifecycle rules
- **Open issues:** 6 typed TODOs in the recipe (LCA data; pivot-score backfill for 15-1255/15-1299/15-2051; seniority filter; title-liveness bridge; E-Verify list; funding-stage errors for listed companies)
- **Repo conditions found, not fixed (maintainer scope):** on Windows `python3` hits the Store stub (37 conformance failures without a shim); manifest `E3` ×6 and doctor's "0/33 frontmatter" are both CRLF checkout artifacts (identical under `--strip-trailing-cr`); CI `harness-regression` references `scripts/test/` and `scripts/gates/`, which are absent from this cut
- **Privacy:** fictional persona only; `npm run pii-scan` shows one pre-existing `package-lock.json` npm-metadata finding and nothing from these files

## 2026-10-10 — SOC arbitrage, ishaan-varma (fictional) — run 3: niche coverage + requirements audit

- **Recipe:** same, now v0.4.0 (adds step 6, niche coverage). The scorer's counting is unchanged: runs 1–2 re-run under v0.4.0 give byte-identical reports apart from the version string, so their v0.3.0 evidence stands.
- **Inputs:** `search/examples/ishaan-varma/niche-employers.json` (15 names, 14 companies; the list is the persona's judgment)
- **Commands:** `python scripts/contrib/2026fa/amoghmaddur-soc-arbitrage/niche-coverage.py search/examples/ishaan-varma/niche-employers.json` · `node --test scripts/contrib/2026fa/amoghmaddur-soc-arbitrage/soc-arbitrage.test.mjs` (15/15; substring mutant 13 pass / 2 fail)
- **Outputs:** table on stdout, pasted into `course/2026fa/submissions/amoghmaddur/worked-example.md` §3
- **Result:** 4 of 14 niche employers in the file (Runway AI, Descript, Luma AI, Higgsfield), 0 with an H-1B record; 10 absent. A file-wide title ranking says little about this persona's targets.
- **Fixed:** the niche script's first version crashed on Windows (cp1252 console, non-ASCII output) → ASCII-only output. The domain justification rendered to 2 pages (US Letter, 1in margins, 11pt), breaking the brief's one-page limit → cut to 1 page, verified by rendering.
- **Open issues:** unchanged (6 typed TODOs); LCA proposal now also justified by niche coverage
