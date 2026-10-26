# SOC Arbitrage — amogh (private layer)

## Executive summary

**What this is.** A comparison of 3 different job titles that honestly describe one portfolio, ranked by how many employers in the engine's company file have ever sponsored an H-1B worker under a matching title.

**Why read it.** A job board shows openings, not which way of describing yourself has a sponsorship history. Pick the wrong title and every application goes to employers with no record of sponsoring that work.

**What it found.** "ML / Applied / Data Scientist" matched 111 sponsoring employers; "AI Engineer (exact title)" matched 1 — a 111.0× spread. Treat this as a floor and a direction, not an exact ratio: the file lists only each employer's most common sponsored titles, which hides rare titles such as creative ones, so the gap is overstated by an amount the data cannot tell us. The automation-resilience comparison is withheld for "ML / Applied / Data Scientist", because the occupation table has no score for it. No "recently funded" claim is made: the newest funding date in the file is 395 days old.

**What it did not do.** It does not recommend a title, check any live job posting, or say what a sponsored designer is paid — the salary figures below describe each employer's sponsored workforce as a whole.

## Run record

`soc-arbitrage-2026-10-26-002` · as-of 2026-10-26 · mode sample · amoghmaddur-ai-media-soc-arbitrage v0.4.0 · authorization: F-1 student (MS in progress, program end 2027-12); requires sponsorship

## Universe (derived from committed data)

| Fact | Value | Source |
|---|---:|---|
| Companies in file | 30,369 | derived |
| ...with any H-1B history | 1,557 (5.1%) | derived |
| Sponsored title instances | 3,319 | derived |
| Companies with more approvals than listed titles | 1,517 (97.4%) | derived |
| SOC rows with no cognitive-pivot score | 122 of 1016 | derived |
| Newest funding date | 2025-09-26 | record |
| Funding staleness vs as-of | 395 days | derived |

## Framing comparison

| Framing | SOC *(inferred)* | Sponsoring cos. *(≥)* | Title hits *(≥)* | Cog-pivot | SOC median wage | Matched cos.' median H-1B salary, **all roles** | Matched cos.' median approval %, **all roles** |
|---|---|---:|---:|---:|---:|---:|---:|
| AI Engineer (exact title) | 15-1221 | **1** | 1 | 4.516 | $140,910 | $172,000 | 100.0 |
| Machine Learning Engineer | 15-1252 | **50** | 57 | 3.834 | $133,080 | $158,625 | 100.0 |
| ML / Applied / Data Scientist | 15-2051 | **111** | 125 | **missing** | $112,590 | $141,960 | 100.0 |

> **Read the columns by scope.** *Sponsoring cos.* and *Title hits* are about the matched title, and are lower bounds. *Cog-pivot* and *SOC median wage* are about the SOC you mapped the framing to — your judgment, not the data's. The last two columns are about the matched **companies**, across every role they sponsor; they say nothing about what that title pays.

## Spread

**ML / Applied / Data Scientist** (111 employers) vs **AI Engineer (exact title)** (1) — 111.0×, biased upward (see TITLE_LIST_IS_A_SUMMARY).

## Stop conditions and caveats fired

- **UNSCORABLE_FRAMING** — 1 framing(s) have no cognitive_pivot_score in data/bls/compact/soc_occupation_compact.csv: 15-2051 (Data Scientists)
  - *Effect:* Role-quality comparison is WITHHELD for these framings. Sponsorship counts remain valid.
- **STALE_FUNDING_DATA** — newest latest_funding_date in data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv is 2025-09-26, 395 days before --asof 2026-10-26.
  - *Effect:* No company can satisfy a 365-day funding-recency gate from committed data. Refresh via scripts/sec/ before trusting any "recently funded" claim.
- **TITLE_LIST_IS_A_SUMMARY** — 1517 of 1557 companies (97.4%) have more approvals than listed titles (max list length 14).
  - *Effect:* Per-framing counts are LOWER BOUNDS, and the bound is loosest for low-volume titles. A spread between a high-volume framing and a low-volume one is biased upward by an unknown factor.

## Not verified by this run

- The title→SOC mapping for each framing (the source has no SOC column; it is the candidate's judgment).
- Salary or approval rate for the matched TITLE — both available fields are company-wide, across all roles.
- Whether any employer would accept a reframed title for this candidate.
- Current openings — this file is historical sponsorship record, not live postings.
- Sponsorship by firms absent from the dataset (94.9% of rows carry no H-1B record).

## Sample employers per framing

### AI Engineer (exact title) — 15-1221

| Company | ST | Stage | Last funding | Total approvals (all roles) | Matched title(s) |
|---|---|---|---|---:|---|
| GOTIT! INC | CA | Pre-Seed | 2018-04-03 | 2 | AI Engineering Lead |

### Machine Learning Engineer — 15-1252

| Company | ST | Stage | Last funding | Total approvals (all roles) | Matched title(s) |
|---|---|---|---|---:|---|
| ACV AUCTIONS INC | NY | Series C | 2018-12-06 | 22 | Machine Learning Engineer III |
| AGENT TECHNOLOGIES INC | NY | Seed | 2022-03-02 | 216 | Machine Learning Engineer |
| AIM INTELLIGENT MACHINES INC | WA | Series C | 2024-12-19 | 10 | Machine Learning Engineer |
| AKTANA INC | CA | Series B | 2020-09-04 | 18 | Senior Machine Learning Engineer |
| ANDIUM INC | NY | Series B | 2024-09-09 | 4 | Machine Learning Engineer |
| APPLOVIN CORP | CA | Series D+ | 2022-02-23 | 130 | Machine Learning Engineer |
| ATTENTIVE MOBILE INC | NY | Series D+ | 2020-09-09 | 96 | Senior Machine Learning Engineer I |
| BLUE RIVER TECHNOLOGY INC | CA | Series B | 2015-11-24 | 2 | Senior Machine Learning Engineer; Machine Learning Engineer |

### ML / Applied / Data Scientist — 15-2051

| Company | ST | Stage | Last funding | Total approvals (all roles) | Matched title(s) |
|---|---|---|---|---:|---|
| ADAPTIVE BIOTECHNOLOGIES CORP | WA | Series D+ | 2015-05-05 | 12 | Research Scientist |
| ADEPT ID INC | MA | Pre-Seed | 2021-11-15 | 4 | Research Data Scientist |
| AFFINITY SOLUTIONS INC | NY | Series B | 2019-05-07 | 40 | DATA SCIENTIST |
| AIRBNB INC | CA | Series B | 2019-08-05 | 1000 | Data Scientist; Senior Data Scientist |
| ALVEO TECHNOLOGIES INC | CA | Series B | 2021-03-11 | 4 | Data Scientist |
| AMPLIFICA HOLDINGS GROUP INC | CA | Seed | 2022-04-21 | 2 | Research Scientist |
| APP ORCHID INC | CA | Pre-Seed | 2024-05-13 | 38 | SENIOR DATA SCIENTIST  |
| ATTACKIQ INC | CA | Series C | 2021-04-30 | 4 | Security Data Scientist |

