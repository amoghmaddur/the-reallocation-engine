---
status: RUNNABLE-SAMPLE
todos_open: 6
last_gate: "sample-run, 2026-10-10, logs/runs/2026fa-amoghmaddur-1.md"
attestation: null
recipe_version: 0.4.0
---

# Creative-Technical SOC Arbitrage for AI-Media Builders

## Executive summary

**What this is.** An operating recipe for an international student on OPT whose one
portfolio — programmatic video, animation pipelines, interface work — could be
honestly titled several ways: motion designer, product designer, front-end engineer.
It counts, from the engine's own historical sponsorship records, how many employers
have ever sponsored each of those titles, and shows the wage and automation-risk
trade-off of each.

**Why read it.** A job board shows openings, not sponsorship history by title. For
this candidate the title on the résumé decides which employers are even in play, and
choosing it wrong can cost months of a 12-month clock.

**What it decides — and what it does not.** It produces a comparison, not a
recommendation; the person picks the title. In its last run, the most-sponsored title
the candidate can honestly claim was *product/interface designer* (55 employers),
against 2 for motion design. It cannot see live openings, the occupation code an
employer would actually file, or what a sponsored designer is paid — and most of the
AI-video companies this candidate would target are not in the data at all.

---

## When to use it

**Once, early** — before writing the résumé headline and before saving job-board
queries. It is a *targeting* recipe, not per-posting triage. Re-run only when the
portfolio changes. Per-posting work goes to the existing pipeline afterwards (step 8).

**Who it is for:** an F-1 OPT / STEM OPT candidate whose work is legible under both a
creative-media SOC (27-\*) and a computer/interface SOC (15-\*). If your occupation
is unambiguous (a biostatistician is 15-2041), this recipe adds nothing.

**Relationship to existing recipes.** `recipes/cases/2026su/case-ux-designer-stem-opt.md`
lists "SOC ambiguity" as one triage factor, but every one of its steps is an unbuilt
development placeholder; this recipe implements that one factor, with a tested
script. Chapter 12's *OPT Framing Generator* is about how to disclose visa status,
not which occupation to present as — a different question.

> **Not legal advice.** SOC codes are used here to read labor-market data. The SOC on
> an LCA is chosen by the employer's counsel. This recipe never says what to file.

**No step calls an LLM.** Every number comes from a committed dataset through a stored,
tested script. An LLM may be used only after a run, to explain the report in plain
language or draft a résumé headline for the title the human already chose. It never
assigns a SOC, counts anything, or picks the framing.

---

## Source inventory

| Source | Type | Exact path / command | Supplies | Human check |
|---|---|---|---|---|
| 80 Days H-1B + Form D join | CSV, committed | `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` | `top_job_titles_sponsored`, `Total Approvals`, `Approval_Rate`, `median_salary_offered`, `latest_funding_date`, `latest_funding_stage` | 30,369 rows; only 1,557 carry H-1B history — check before trusting any denominator. |
| SOC compact table | CSV, committed | `data/bls/compact/soc_occupation_compact.csv` | `cognitive_pivot_score`, `annual_median_wage`, `job_zone` | 122 of 1,016 rows have no `cognitive_pivot_score`. |
| Coverage audit | Markdown, committed | `data/80-days-to-stay/data/SEC_DOL_H1b_data_mapped-audit.md` | the 5.1% H-1B coverage figure the denominators rely on | Read before quoting any share. |
| **Scorer (this recipe)** | Node, contrib | `node scripts/contrib/2026fa/amoghmaddur-soc-arbitrage/soc-arbitrage.mjs` | framing comparison, agent JSON, human report | Offline; no network, no credentials. |
| **Fixture tests** | Node | `node --test scripts/contrib/2026fa/amoghmaddur-soc-arbitrage/soc-arbitrage.test.mjs` | 15 behaviour tests on fixture CSVs (scorer + niche check) | Must be green before a real run. |
| **Independent cross-check** | Python, stdlib | `python scripts/contrib/2026fa/amoghmaddur-soc-arbitrage/crosscheck.py <framings> --against <agent-log>` | re-counts every count with separate code; exit 1 on mismatch | Run after every real run. |
| **Niche-coverage check** | Python, stdlib | `python scripts/contrib/2026fa/amoghmaddur-soc-arbitrage/niche-coverage.py <niche-employers.json>` | for each target employer: in the file? any H-1B record? | Read before trusting any count as relevant to *your* targets. |
| Niche employers (input) | JSON, fictional | `search/examples/ishaan-varma/niche-employers.json` | the candidate's own AI-video target list (public names) | The list is a judgment, not a record. |
| Framings (input) | JSON, fictional | `search/examples/ishaan-varma/soc-arbitrage-framings.v2.json` | the titles to compare; `claimable:false` marks a control | Must point at a fictional persona for anything committed. |
| Persona | YAML, fictional | `search/examples/ishaan-varma/profile.yml` | visa clock, STEM eligibility | Never substitute real data in a tracked file. |
| Downstream, existing | Node | `npm run ats:scan -- --dry-run` · `npm run ats:liveness -- <url>` · `npm run score <roles.json>` | per-posting liveness and Apply/Consider/Skip | **Not exercised by this recipe** — see step 8. |

Windows note: the scorer is Node so it runs on a stock Windows clone. `python3` resolves
to the Microsoft Store stub there; call the Python scripts with `python`.

## Inputs

| Field | Type | Who decides | Required |
|---|---|---|---|
| `candidate` | string — persona handle, never a real name in a tracked file | human | yes |
| `authorization` | string from the persona's `visa:` block | human | yes |
| `framings[].id`, `.label` | string | human | yes |
| `framings[].soc` | SOC code | **human — inferred, see boundary** | yes |
| `framings[].title_probes` | string[]; left-boundary, suffix-tolerant, case-insensitive | human | yes |
| `framings[].claimable` | bool, default `true`; `false` = control row, never the headline | human | no |

**Probe rules (each learned from a run).** A probe matches at a word start and may
extend rightwards: `PRODUCT DESIGN` catches "Product Designer"; `MOTION` no longer
catches "Pro**motion**s". Lexically clean is not semantically clean: `FILM` caught a
"Film/Game 3D Production Research **Engineer**", and `SOFTWARE ENGINEER` caught QA,
infrastructure and manager titles. **Read the sample rows of every framing before
reading its count.** A probe you would not put on your own résumé belongs in a
`claimable:false` control framing.

---

## What the mode can and cannot verify

### Can verify — read or counted from a committed record (`source: record | derived`)

- How many distinct employers list a sponsored title matching each framing's probes,
  and how many matching title strings — reproduced by an independent implementation.
- That 1,557 of 30,369 companies (5.1%) carry any H-1B history.
- That 1,517 of those 1,557 (97.4%) have more approvals than listed titles — the title
  field is a short summary of "common roles", not a petition list.
- Cognitive-pivot score, SOC median wage and job zone, **for SOCs that have one**.
- The newest `latest_funding_date` in the file (2025-09-26).
- Whether each employer on the candidate's niche list is in the file, and whether it
  carries any H-1B record.

### Cannot verify — human judgment the data cannot check (`inferred`)

- **The title→SOC mapping.** The 80 Days file has no SOC column. "Motion Designer →
  27-1014" is the candidate's call; every role-quality number hangs off it.
- **Which framings are honestly claimable** (the `claimable` flag), and which employers
  belong on the niche list.
- Whether any employer would accept a reframed title for *this* candidate.

### Cannot verify — the field exists but describes something else (scope trap)

- **What a title pays, or its approval odds.** `median_salary_offered` and
  `Approval_Rate` are company-wide, across every role the employer sponsored. They are
  reported only as "matched companies' median, all roles". Figma's $190,000 is its
  engineering-heavy H-1B workforce, not its motion designer.
- **Company stage.** `latest_funding_stage` labels some publicly listed companies
  "Pre-Seed"; it is not used as a stability signal.

### Cannot verify — missing from the data (`missing`; never filled)

- `cognitive_pivot_score` for 15-1255 (Web and Digital Interface Designers) and
  15-1299 (Computer Occupations, All Other) — the two pivot targets this candidate
  most needs scored.
- Any title the summary list dropped. Counts are **lower bounds**, loosest for rare titles.
- **The candidate's own niche.** Of 14 AI-video employers on the persona's list, 10 are
  not in the file and the 4 that are carry no H-1B record. Absent ≠ does not sponsor:
  the file covers Form D filers only.
- **Cap-exempt employers** — universities, museums, research nonprofits — rarely file
  Form D, so the file barely sees them, though for creative-technical work they can be
  a real sponsorship path.
- **Live openings and liveness** — historical record only; no posting is checked.
- **Recent funding** — newest funding date is over a year old (staleness gate).
- **E-Verify enrollment**, required for the STEM OPT extension.

---

## Phase gates

A gate clears only when its test passes **and** a named human records it in the run
log. Gates 3 and 5 are hard stops on the claim they guard, not votes.

1. **Problem** — ≥2 framings with distinct SOCs, ≥1 of them claimable.
   Test: `node -e "const p=require('./search/examples/ishaan-varma/soc-arbitrage-framings.v2.json');process.exit(new Set(p.framings.map(f=>f.soc)).size>=2&&p.framings.some(f=>f.claimable!==false)?0:1)"`
2. **Local evidence + tests** — both CSVs exist and the fixture tests pass.
   Test: `test -f data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv && test -f data/bls/compact/soc_occupation_compact.csv && node --test scripts/contrib/2026fa/amoghmaddur-soc-arbitrage/soc-arbitrage.test.mjs`
3. **Scorability (HARD on role quality)** — every framing's SOC has a cognitive-pivot
   score, or the role-quality comparison is withheld for that framing.
   Test: `node scripts/contrib/2026fa/amoghmaddur-soc-arbitrage/soc-arbitrage.mjs <framings> --dry-run --strict` → exit 0.
   *Closed in both logged runs (15-1255; 15-1299). That is a finding, not a failure to hide.*
4. **Reproduction** — the agent log parses and an independent re-count agrees.
   Test: `python scripts/contrib/2026fa/amoghmaddur-soc-arbitrage/crosscheck.py <framings> --against <agent-log>` → `0 mismatch(es)`, exit 0.
5. **Staleness (HARD on funding claims)** — no "recently funded" statement while
   `universe.funding_staleness_days > --funding-window`.
   *Closed: 372 days at as-of 2026-10-03.*
6. **Privacy** — `npm run pii-scan` reports nothing from this recipe's files.
7. **Human read** — the person has read the sample rows of every framing, the caveats,
   and the niche-coverage table, and records which framing they will lead with.
   **Not automatable.**
8. **Logging** — run recorded in `logs/runs/<term>-<handle>-<n>.md`.

## Steps

1. **Compile framings.** Labor: script. Probes → left-boundary regexes; profile
   validated (malformed JSON exits 65 with a legible message and writes nothing).
2. **Count by framing.** Labor: script, no judgment. Distinct companies, title
   instances, company-wide medians, funded-within-window count; every leaf tagged
   `record | derived | missing`, with `scope` and `bound` where they matter.
3. **Attach role quality.** Labor: script. Cognitive-pivot score, SOC median wage, job
   zone — or `missing`, never borrowed from a sibling SOC.
4. **Fire stop conditions and caveats.** Labor: script.
5. **Cross-check.** Labor: script. `crosscheck.py --against` the agent log.
6. **Niche coverage.** Labor: script. `niche-coverage.py` on the candidate's own
   target-employer list: is each one in the file, and does it carry any H-1B record?
   A framing that wins file-wide can still be irrelevant if your niche is absent.
7. **Human reads and decides** (gate 7). Labor: **human only.** Read every framing's
   sample rows first; demote any framing whose rows you could not claim to
   `claimable:false` and re-run. The recipe never recommends.
8. **(Optional) Hand off to per-posting triage.** Labor: human + existing scripts:
   `npm run ats:scan -- --dry-run`, `npm run ats:liveness -- <url>`, `npm run score <roles.json>`.
   Today this hand-off is manual — see proposed addition 4.

## Run commands

```bash
node --test scripts/contrib/2026fa/amoghmaddur-soc-arbitrage/soc-arbitrage.test.mjs
node scripts/contrib/2026fa/amoghmaddur-soc-arbitrage/soc-arbitrage.mjs search/examples/ishaan-varma/soc-arbitrage-framings.v2.json --asof 2026-10-03 --dry-run
node scripts/contrib/2026fa/amoghmaddur-soc-arbitrage/soc-arbitrage.mjs search/examples/ishaan-varma/soc-arbitrage-framings.v2.json --asof 2026-10-03 --out-dir course/2026fa/submissions/amoghmaddur/evidence
python scripts/contrib/2026fa/amoghmaddur-soc-arbitrage/crosscheck.py search/examples/ishaan-varma/soc-arbitrage-framings.v2.json --against course/2026fa/submissions/amoghmaddur/evidence/soc-arbitrage-2026-10-03-002.json
python scripts/contrib/2026fa/amoghmaddur-soc-arbitrage/niche-coverage.py search/examples/ishaan-varma/niche-employers.json
```

Flags: `--dry-run` · `--strict` (exit 2 if any framing unscorable) · `--funding-window N`
(default 365) · `--asof YYYY-MM-DD` · `--out-dir` (default `reports/generated`, gitignored)
· `--md`. Run IDs auto-increment (`-001`, `-002`, …); a run never overwrites earlier evidence.

---

## Output contract

Two artifacts per scorer run, two readers (P5), plus one table from the niche check.

**Agent log — JSON** · `<out-dir>/soc-arbitrage-<asof>-<NNN>.json`
Fields: `workflow`, `run_id`, `recipe_version`, `mode`, `asof`, `generated_at`,
`candidate_ref`, `authorization`, `source_files[]`, `universe{}`, `framings[]`,
`stop_conditions[]`, `not_verified[]`. Every numeric leaf is
`{value, source, from}`; title-level counts add `scope:"title", bound:"lower"`;
company-wide medians add `scope:"company-wide"`; each framing carries
`soc_mapping.source:"inferred"` and `claimable`.

**Human report — Markdown** · `<out-dir>/soc-arbitrage-<asof>-<NNN>.md`
Reader: the candidate, or an advisor reviewing their targeting.
Decision enabled: which title to lead with, and what it costs.
Sections, in order: executive summary (plain language) · run record · universe ·
framing comparison (control rows marked) · spread (claimable framings only) · stop
conditions and caveats · not verified · sample employers per framing.

Comparison table template:

| Framing | SOC *(inferred)* | Sponsoring cos. *(≥)* | Title hits *(≥)* | Cog-pivot | SOC median wage | Matched cos.' median H-1B salary, **all roles** | Matched cos.' median approval %, **all roles** |
|---|---|---:|---:|---:|---:|---:|---:|

**Niche-coverage table — Markdown on stdout** (paste into the run log; no JSON twin yet):

| Target | In file | Matched company | Latest funding | H-1B record | Approvals |
|---|---|---|---|---|---:|

followed by one line: `<n> targets | <k> in file | <m> with any H-1B record | <n-k> absent`.

## Stop conditions

| Condition | Fires when | Effect |
|---|---|---|
| `UNSCORABLE_FRAMING` | a framing's SOC has no cognitive-pivot score | role-quality comparison withheld for it; `--strict` exits 2 |
| `STALE_FUNDING_DATA` | newest funding date older than `--funding-window` | no "recently funded" claim; refresh via `scripts/sec/refresh-recent-sec-quarters.py` first |
| `NO_SPONSORSHIP_RECORD` | a framing matches 0 companies | reported as *unknown*, never as "does not sponsor" |
| `TITLE_LIST_IS_A_SUMMARY` | any company has more approvals than listed titles | counts labelled lower bounds; spread labelled biased upward |

Always refuse: a filing or legal conclusion; a borrowed score from a sibling SOC; any
run against real personal data in a tracked path.

---

## Proposed additions

| # | Proposal | Type | Why it belongs |
|---|---|---|---|
| 1 | DOL LCA disclosure data (employer + SOC + job title + wage) | [TODO: DATA SOURCE] | Converts the title→SOC step from *inferred* to *record*, gives a title-level wage instead of a company-wide one, replaces the 5-title summary with every filing, and covers employers that never filed Form D (10 of this persona's 14 niche employers) — fixing the four largest honesty gaps at once. |
| 2 | Backfill `cognitive_pivot_score` for 15-1255, 15-1299, 15-2051 | [TODO: DEV] | 122 of 1,016 SOCs are unscored and the gap lands on this candidate's pivot targets. Owner: `scripts/bls/extract-soc-occupation-table.py`. |
| 3 | Seniority filter on probes (exclude HEAD / DIRECTOR / MANAGER / RESEARCHER) | [TODO: DEV] | 7 of the 29 product/interface titles behind the headline are management; a one-off count drops 55 → 48 employers. An OPT candidate cannot claim them. |
| 4 | `title-liveness-bridge.mjs` | [TODO: DEV] | Feeds the chosen framing into `ats:scan` / `ats:liveness`; today the hand-off from "which title" to "which live posting" is manual. |
| 5 | E-Verify employer list | [TODO: DATA SOURCE] | The STEM OPT 24-month extension requires an E-Verify employer; nothing in the current data shows enrollment. |
| 6 | Correct `latest_funding_stage` for public companies | [TODO: DATA SOURCE] | Human spot-check of sample rows: Chegg, A10 Networks and Brightcove — companies that have been publicly listed — are labelled "Pre-Seed". Stage cannot be used as a stability signal until fixed upstream. |

---

## Run log template

This is the brief's `modes/RUN_LOG.md` template. In this repo that log is `logs/RUN_LOG.md`,
which students may not edit; file entries as `logs/runs/<term>-<handle>-<n>.md`.

```markdown
## YYYY-MM-DD — SOC arbitrage, <persona handle>

- **Recipe:** amoghmaddur-ai-media-soc-arbitrage v0.4.0 (status: RUNNABLE-SAMPLE)
- **Inputs:** search/examples/<persona>/<framings>.json · <niche-employers>.json · --asof YYYY-MM-DD
- **Commands:** <test, run, cross-check — verbatim>
- **Outputs:** <out-dir>/soc-arbitrage-<asof>-<NNN>.{json,md}
- **Result:** <best claimable framing (N)> vs <worst claimable (M)>; controls: <label (K)>
- **Gates:** passed <list> · closed <list, with why> · human gate 7 cleared by <name> — <framing chosen>
- **Stop conditions / caveats fired:** <list>
- **Cross-check:** <n> compared, <m> mismatch(es)
- **Niche coverage:** <n> targets · <k> in file · <m> with H-1B record
- **Verified:** counts, universe facts, SOC wages/scores where present
- **Inferred:** title→SOC mapping; claimable flags; niche list
- **Open issues:** <typed TODOs, blockers>
```
