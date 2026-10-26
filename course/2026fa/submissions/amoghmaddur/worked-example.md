# Worked Example — creative-technical SOC arbitrage

## Executive summary

**What this is.** A record of running the recipe twice against the engine's real
company and occupation data, for a fictional student whose portfolio could be titled
five or more ways. **Why read it.** It shows the output, what was checked against an
independent re-count, and where the first result was wrong. **What it found.** The
first run reported a 150-fold advantage for "front-end/software engineer". Reading the
rows showed that most of it came from software jobs this student could not claim.
After revising the inputs, the strongest title the student can honestly use is
*product/interface designer* (55 employers), against 18 for front-end and 2 for
motion design. Every count is a floor. A third check found the biggest gap: of the 14
AI-video companies this student would actually target, 10 are not in the data at all,
and none of the other 4 has a sponsorship record.

---

## 1. Scenario and inputs

- **Persona (fictional):** `search/examples/ishaan-varma/profile.yml`. F-1 OPT year 1,
  STEM-eligible, `opt_end_date: 2027-07-31`, 12 of 90 unemployment days used. Builds
  programmatic video / explainer tooling. 555 phone, `@example.com`; no real data.
- **Run 1 input (as designed):** `soc-arbitrage-framings.json`, with 5 framings across
  27-1014, 27-1011, 27-1024, 15-1255 and 15-1252.
- **Run 2 input (revised after reading run 1):** `soc-arbitrage-framings.v2.json`. The
  `FILM` probe is dropped; front-end is split from generic software engineering, which
  becomes a `claimable:false` control; a creative-technologist framing (15-1299) is added.
- **Run 3 input (niche check, 2026-10-10):** `niche-employers.json`, the persona's own
  list of AI-video employers: 15 names covering 14 companies (ElevenLabs is searched
  under two spellings). Choosing the list is a judgment; the counts are not.
- **Versions:** runs 1–2 ran under recipe v0.3.0, which is the version their evidence files
  record. v0.4.0 added the niche step. The scorer's counting is unchanged: re-running both
  under v0.4.0 gives byte-identical reports apart from the version string.
- **Data (committed, unmodified):**

| File | Rows | SHA-256 (first 16) |
|---|---:|---|
| `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` | 30,369 | `b04a2f21ddc9214c` |
| `data/bls/compact/soc_occupation_compact.csv` | 1,016 | `bac5acf77ca2d252` |

- **Repo:** clean clone of `nikbearbrown/the-reallocation-engine` @ `015843d`, Windows 11,
  Node v24.13.0, Python 3.14.2. As-of date `2026-10-03` for runs 1–2.

## 2. Commands run

```bash
node --test scripts/contrib/2026fa/amoghmaddur-soc-arbitrage/soc-arbitrage.test.mjs
node scripts/contrib/2026fa/amoghmaddur-soc-arbitrage/soc-arbitrage.mjs search/examples/ishaan-varma/soc-arbitrage-framings.json --asof 2026-10-03 --dry-run
node scripts/contrib/2026fa/amoghmaddur-soc-arbitrage/soc-arbitrage.mjs search/examples/ishaan-varma/soc-arbitrage-framings.json --asof 2026-10-03 --out-dir course/2026fa/submissions/amoghmaddur/evidence
python scripts/contrib/2026fa/amoghmaddur-soc-arbitrage/crosscheck.py search/examples/ishaan-varma/soc-arbitrage-framings.json --against course/2026fa/submissions/amoghmaddur/evidence/soc-arbitrage-2026-10-03-001.json
node scripts/contrib/2026fa/amoghmaddur-soc-arbitrage/soc-arbitrage.mjs search/examples/ishaan-varma/soc-arbitrage-framings.json --asof 2026-10-03 --dry-run --strict
node scripts/contrib/2026fa/amoghmaddur-soc-arbitrage/soc-arbitrage.mjs search/examples/ishaan-varma/soc-arbitrage-framings.v2.json --asof 2026-10-03 --out-dir course/2026fa/submissions/amoghmaddur/evidence
python scripts/contrib/2026fa/amoghmaddur-soc-arbitrage/crosscheck.py search/examples/ishaan-varma/soc-arbitrage-framings.v2.json --against course/2026fa/submissions/amoghmaddur/evidence/soc-arbitrage-2026-10-03-002.json
python scripts/contrib/2026fa/amoghmaddur-soc-arbitrage/niche-coverage.py search/examples/ishaan-varma/niche-employers.json
npm run verify
npm run doctor
npm run pii-scan
```

Full reports, unedited: `evidence/soc-arbitrage-2026-10-03-001.{md,json}` (run 1) and
`evidence/soc-arbitrage-2026-10-03-002.{md,json}` (run 2).

## 3. What the mode produced

### Run 1: the framings as originally designed

```
| Framing | SOC *(inferred)* | Sponsoring cos. *(≥)* | Title hits *(≥)* | Cog-pivot | SOC median wage | Matched cos.' median H-1B salary, **all roles** | Matched cos.' median approval %, **all roles** |
| Motion / Media Designer | 27-1014 | **3** | 3 | 3.389 | $99,800 | $150,000 | 98.9 |
| Art / Creative Director | 27-1011 | **4** | 4 | 3.78 | $111,040 | $155,572 | 100.0 |
| Graphic / Visual Designer | 27-1024 | **5** | 5 | 3.264 | $61,300 | $73,466 | 100.0 |
| Product / Interface Designer | 15-1255 | **55** | 59 | **missing** | $98,090 | $145,000 | 100.0 |
| Front-End / Software Engineer | 15-1252 | **450** | 673 | 3.834 | $133,080 | $147,650 | 100.0 |

STOP[UNSCORABLE_FRAMING] 1 framing(s) have no cognitive_pivot_score in data/bls/compact/soc_occupation_compact.csv: 15-1255 (Web and Digital Interface Designers)
STOP[STALE_FUNDING_DATA] newest latest_funding_date in data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv is 2025-09-26, 372 days before --asof 2026-10-03.
STOP[TITLE_LIST_IS_A_SUMMARY] 1517 of 1557 companies (97.4%) have more approvals than listed titles (max list length 14).
```

Headline: **Front-End / Software Engineer (450) vs Motion / Media Designer (3), 150.0×.**
The count was right and reproduced exactly. The sample rows showed it was the wrong
question:

```
### Front-End / Software Engineer — 15-1252
| A10 NETWORKS INC | CA | Pre-Seed | 2016-06-23 | 106 | Staff Software Engineer; Senior Software Engineer; Principal QA Software Engineer; Software Engineer  |
| ACCOLADE INC | WA | Series D+ | 2021-03-03 | 28 | Mgr, Software Engineer |
### Motion / Media Designer — 27-1014
| PIXELWORKS INC | CA | Series A | 2020-12-07 | 4 | Film/Game 3D Production Research Engineer |
```

A probe can be lexically clean and semantically wrong. `SOFTWARE ENGINEER` matched QA
and manager titles; `FILM` matched an engineer. The rows also show A10 Networks, a
company that has been publicly listed, labelled "Pre-Seed".

### Run 2: revised framings

```
| Framing | SOC *(inferred)* | Sponsoring cos. *(≥)* | Title hits *(≥)* | Cog-pivot | SOC median wage | Matched cos.' median H-1B salary, **all roles** | Matched cos.' median approval %, **all roles** |
| Motion / Media Designer | 27-1014 | **2** | 2 | 3.389 | $99,800 | $170,000 | 98.7 |
| Art / Creative Director | 27-1011 | **4** | 4 | 3.78 | $111,040 | $155,572 | 100.0 |
| Graphic / Visual Designer | 27-1024 | **5** | 5 | 3.264 | $61,300 | $73,466 | 100.0 |
| Creative Technologist | 15-1299 | **0** | 0 | **missing** | $108,970 | — | — |
| Product / Interface Designer | 15-1255 | **55** | 59 | **missing** | $98,090 | $145,000 | 100.0 |
| Front-End / UI Engineer | 15-1252 | **18** | 19 | 3.834 | $133,080 | $119,764 | 100.0 |
| Software Engineer (any) *(control)* | 15-1252 | **441** | 661 | 3.834 | $133,080 | $149,100 | 100.0 |

**Product / Interface Designer** (55 employers) vs **Creative Technologist** (0) — 55 vs 0, biased upward (see TITLE_LIST_IS_A_SUMMARY). Control framings excluded: Software Engineer (any) (441).
```

Among titles this student can claim, product/interface design leads (55). Front-end is
18, not 450. The creative framings stay small (2 to 5), and those are floors.

### Run 3: is this student's niche in the file at all? (2026-10-10)

```
| Target | In file | Matched company | Latest funding | H-1B record | Approvals |
|---|---|---|---|---|---:|
| RUNWAY | yes | RUNWAY AI INC | 2022-12-02 | no | - |
| SYNTHESIA | no | - | - | - | - |
| ELEVEN LABS | no | - | - | - | - |
| ELEVENLABS | no | - | - | - | - |
| HEYGEN | no | - | - | - | - |
| PIKA | no | - | - | - | - |
| DESCRIPT | yes | DESCRIPT INC | 2022-11-10 | no | - |
| LUMA AI | yes | LUMA AI INC | 2023-01-13 | no | - |
| CAPTIONS | no | - | - | - | - |
| HEDRA | no | - | - | - | - |
| HIGGSFIELD | yes | HIGGSFIELD INC | 2024-01-18 | no | - |
| MOONVALLEY | no | - | - | - | - |
| GENMO | no | - | - | - | - |
| TAVUS | no | - | - | - | - |
| KAIBER | no | - | - | - | - |

15 targets | 4 in file | 0 with any H-1B record | 11 absent (absent != does not sponsor; the file is Form D filers only)
```

Fifteen names, fourteen companies: 4 are in the file, none with an H-1B record; 10 are
absent. Runs 1–2 rank titles across 30,369 companies. This shows that ranking says
almost nothing about the employers this student is actually aiming at.

## 4. Verified vs inferred

| Output | Status | Basis |
|---|---|---|
| 30,369 companies; 1,557 with H-1B history; 3,319 title strings | **verified** | counted, and matched by the independent re-count |
| Every per-framing company and title count (both runs) | **verified** | 15/15 and 19/19 match in `crosscheck.py` |
| 1,517 of 1,557 companies have more approvals than listed titles | **verified** | counted; the field is a summary, not a filing list |
| Cognitive-pivot scores, SOC median wages, job zones | **verified (record)** | read from the SOC table |
| 15-1255 and 15-1299 have no cognitive-pivot score | **verified (missing)** | empty cell; not imputed |
| Funding data 372 days stale | **verified** | max `latest_funding_date` = 2025-09-26 |
| "Matched cos.' median salary / approval %" | **verified, but company-wide** | about all of each employer's sponsored roles, **not** the matched title |
| Which SOC each framing belongs to | **inferred** | no SOC column in the source; my mapping |
| Which framings are claimable (the control flag) | **inferred** | my judgment after reading rows |
| 55 → 48 employers after removing Head/Director/Manager/Researcher titles | **verified, one-off** | ad-hoc count, not in the script; proposed as an addition |
| A10, Chegg, Brightcove are mislabelled "Pre-Seed" | **human spot-check** | outside repo data; not used by the mode |
| 4 of 14 niche employers in the file; 0 with an H-1B record | **verified** | `niche-coverage.py`, whole-word match on `company_name` |
| Which employers belong on the niche list | **inferred** | the persona's own target list |
| That absent niche employers do not sponsor | **not claimed** | the file is Form D filers only; absent means unknown |
| That product design is the right lead title for this student | **not claimed** | the mode emits no recommendation |

## 5. What the mode missed

Things the output looked right without, found only by reading the rows or by asking a
question the mode did not ask:

1. **Unclaimable titles inflating the winner.** 441 of run 1's 450 "front-end/software"
   employers were generic software roles. The count was correct; the framing was not.
2. **Rare titles dropped by the data itself.** The title field is a short summary
   (97.4% of companies have more approvals than titles listed), so creative counts are
   floors. The mode can label this but cannot measure how much is missing.
3. **Seniority.** 7 of the 29 product/interface titles are Head, Director or Manager
   roles. Without them the count is 48, not 55. The mode has no seniority filter yet.
4. **The student's actual niche.** 10 of 14 target AI-video employers are absent and 0
   of the 4 present have a record (run 3). Until v0.4.0 the mode never asked.
5. **Cap-exempt employers.** Universities, museums and research nonprofits rarely file
   Form D, so the file barely sees them. For creative-technical work they may be the
   most realistic sponsors. The mode is blind to them.
6. **Anything live.** No posting was checked; the Job-Ops hand-off is still manual.

## 6. Attestation

- Recipe: amoghmaddur-ai-media-soc-arbitrage v0.4.0 (runs 1–2 executed under v0.3.0; counting unchanged)
- By: Amogh Maddur · 2026-10-10

### Tested

| Ran | Saw | Expected |
|---|---|---|
| `node --test …/soc-arbitrage.test.mjs` | `ℹ tests 15 · ℹ pass 15 · ℹ fail 0` | all pass |
| **Break:** same tests against a mutant with plain-substring matching | `ℹ pass 13 · ℹ fail 2` (left-boundary and staleness tests fail) | tests catch the old bug |
| Run 1 and run 2 against real data | 2 JSON + 2 MD written, `-001` and `-002` | evidence files |
| `crosscheck.py --against` run 1 / run 2 | `15 compared, 0 mismatch(es)` / `19 compared, 0 mismatch(es)` | independent agreement |
| `--dry-run --strict` | `--strict: UNSCORABLE framing present -> exit 2` | exit 2 (15-1255 unscored) |
| `--dry-run` | `-- DRY RUN — nothing written --`; no files created | no writes |
| **Break:** malformed profile JSON | `soc-arbitrage: bad profile … — not valid JSON (Expected double-quoted property name in JSON at position 29 (line 1 column 30))` · `nothing written.` · exit 65 | legible failure, no writes |
| **Break:** no profile argument | `usage: node scripts/contrib/…/soc-arbitrage.mjs <framings.json> [--dry-run] [--strict]`, exit 64 | usage error |
| **Break:** SOC `99-9999`, probe `ZZQX`, on real data | `\| Ghost \| 99-9999 \| **0** \| 0 \| **missing** \|` + `UNSCORABLE_FRAMING … (SOC not in table)` + `NO_SPONSORSHIP_RECORD … ghost`, exit 0 | degrade honestly, invent nothing |
| `niche-coverage.py` on the persona's list (run 3) | `15 targets \| 4 in file \| 0 with any H-1B record \| 11 absent`, exit 0 | a coverage table |
| **Break:** niche list `[]`; niche list file missing | `` `employers` must be a non-empty list ``, exit 65; `cannot read … (FileNotFoundError)`, exit 65 | legible failure |
| Re-ran runs 1–2 under v0.4.0 | reports byte-identical apart from the version string; JSON identical apart from timestamp and version | v0.4.0 moved no number |
| Re-ran run 1 with the final script | report byte-identical; JSON identical apart from timestamp and the new `claimable` field | later fixes did not move run-1 numbers |
| `npm run verify` (with a `python3`→`python` shim) | `conformance: 165 files … ✓ all conform`; manifest check `✗ FAILED (6 errors)`, all E3 | see §8: Windows line endings, not drift |
| `npm run doctor` | `environment: ✓ runnable` | runnable |
| `npm run pii-scan` | `1 finding(s)` — an npm-metadata address in `package-lock.json` (quoted address omitted on purpose) | nothing from my files |

### Did not test

- Any **live** network path. `ats:liveness` and `ats:scan` were never called, which is
  why the status is `RUNNABLE-SAMPLE`.
- The SEC refresh pipeline. The 372-day staleness is reported, not remediated.
- Whether my title→SOC mapping matches what employers filed. That is not testable
  with repo data (proposed addition 1).
- Whether the niche list is complete or well chosen; it is the persona's own list.
- Non-English titles. Encoding damage in source titles (`UX Developer � Band 1 & 2`)
  was seen but not handled; the matcher still matched those titles.
- The CI `harness-regression` job. It calls `scripts/test/` and `scripts/gates/`
  paths that do not exist in this fresh cut.

### Broke during testing, fixed

- **Company-wide numbers presented as title numbers.** The v0.2 report had a
  "Med. salary" column showing $150,000 for motion design. `median_salary_offered` is
  per company across all roles (Figma: $190,000 over 188 approvals, mostly engineers).
  The fields are renamed to `matched_cos_median_salary_all_roles` / `_approval_rate`
  with `scope: "company-wide"`, and labelled "all roles" in the table.
- **The headline crowned an unclaimable title.** Run 2's first draft summary led with
  "Software Engineer (any) matched 441". Added `claimable:false`: controls are counted
  but excluded from the headline and spread. A test covers it.
- **Second run would have overwritten the first.** Run IDs were fixed at `-001`; they
  now take the next free number. A test runs twice into one folder.
- **Malformed JSON threw a raw Node stack.** It now exits 65 with one readable line
  and writes nothing (closed v0.2 TODO).
- **Frontmatter claimed an attestation at RUNNABLE-SAMPLE.** The constitution sets
  `attestation` only at VERIFIED. It is now `null`, and `last_gate` names the run log.
- **Niche check crashed on Windows.** Its first version printed `—`, `·` and `≠`; Windows
  consoles default to cp1252, so cells came out garbled and `≠` raised
  `UnicodeEncodeError`. Output is now ASCII-only.
- **Test bug:** the staleness test passed a second `--asof` that the CLI ignores (it
  reads the first). Fixed in the helper before trusting the result.

## 7. What I would change, based on the output

1. **Read rows before counts, by procedure.** It is now gate 7 and step 7 of the mode.
   Every flaw above was invisible in the totals and obvious in the sample rows.
2. **Seniority filter on probes** (proposed addition 3). 7 of the 29 product/interface
   titles are Head, Director or Manager roles; excluding them takes 55 to 48.
3. **Title-level data** (proposed addition 1). DOL LCA disclosures carry employer + SOC +
   title + wage per filing. That fixes the inferred mapping, the company-wide salary and
   the five-title summary at once.
4. **Score the pivot targets** (proposed addition 2). The best claimable framing is the
   one framing the Cognitive Pivot layer cannot score.
5. **Check the niche first** (now step 6). Had run 3 come first, the student would have
   known before any ranking that the file barely covers their target employers.

## 8. Environment findings (repo conditions, not caused by this mode)

- **`python3` on Windows** resolves to the Microsoft Store stub. Stock `npm run verify`
  reports `✗ 37 file(s) FAILED conformance`, all from that one cause. The scorer is Node,
  so the mode runs without the shim; call the cross-check with `python`.
- **Both "repo is broken" signals on Windows are line endings.** With
  `core.autocrlf=true`, files check out as CRLF. All 6 manifest `E3` files are identical
  to a fresh build under `diff --strip-trailing-cr`. Doctor's "0/33 recipes carry
  lifecycle frontmatter" comes from its `(.*)$` regex failing on the trailing `\r`. A
  repo-level `.gitattributes` rule (`* text=auto eol=lf`) would likely fix both. That is
  a maintainer change, so it is reported here and not patched.
