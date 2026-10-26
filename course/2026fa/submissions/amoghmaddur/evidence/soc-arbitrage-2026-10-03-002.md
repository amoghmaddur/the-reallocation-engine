# SOC Arbitrage — ishaan-varma (fictional persona)

## Executive summary

**What this is.** A comparison of 6 different job titles that honestly describe one portfolio (plus 1 control title the candidate cannot claim, shown for context only), ranked by how many employers in the engine's company file have ever sponsored an H-1B worker under a matching title.

**Why read it.** A job board shows openings, not which way of describing yourself has a sponsorship history. Pick the wrong title and every application goes to employers with no record of sponsoring that work.

**What it found.** "Product / Interface Designer" matched 55 sponsoring employers; "Creative Technologist" matched 0 — a 55 vs 0 spread. Treat this as a floor and a direction, not an exact ratio: the file lists only each employer's most common sponsored titles, which hides rare titles such as creative ones, so the gap is overstated by an amount the data cannot tell us. The automation-resilience comparison is withheld for "Creative Technologist", "Product / Interface Designer", because the occupation table has no score for them. No "recently funded" claim is made: the newest funding date in the file is 372 days old.

**What it did not do.** It does not recommend a title, check any live job posting, or say what a sponsored designer is paid — the salary figures below describe each employer's sponsored workforce as a whole.

## Run record

`soc-arbitrage-2026-10-03-002` · as-of 2026-10-03 · mode sample · amoghmaddur-ai-media-soc-arbitrage v0.3.0 · authorization: F-1 OPT year 1, STEM-eligible, needs sponsorship (opt_end 2027-07-31)

## Universe (derived from committed data)

| Fact | Value | Source |
|---|---:|---|
| Companies in file | 30,369 | derived |
| ...with any H-1B history | 1,557 (5.1%) | derived |
| Sponsored title instances | 3,319 | derived |
| Companies with more approvals than listed titles | 1,517 (97.4%) | derived |
| SOC rows with no cognitive-pivot score | 122 of 1016 | derived |
| Newest funding date | 2025-09-26 | record |
| Funding staleness vs as-of | 372 days | derived |

## Framing comparison

| Framing | SOC *(inferred)* | Sponsoring cos. *(≥)* | Title hits *(≥)* | Cog-pivot | SOC median wage | Matched cos.' median H-1B salary, **all roles** | Matched cos.' median approval %, **all roles** |
|---|---|---:|---:|---:|---:|---:|---:|
| Motion / Media Designer | 27-1014 | **2** | 2 | 3.389 | $99,800 | $170,000 | 98.7 |
| Art / Creative Director | 27-1011 | **4** | 4 | 3.78 | $111,040 | $155,572 | 100.0 |
| Graphic / Visual Designer | 27-1024 | **5** | 5 | 3.264 | $61,300 | $73,466 | 100.0 |
| Creative Technologist | 15-1299 | **0** | 0 | **missing** | $108,970 | — | — |
| Product / Interface Designer | 15-1255 | **55** | 59 | **missing** | $98,090 | $145,000 | 100.0 |
| Front-End / UI Engineer | 15-1252 | **18** | 19 | 3.834 | $133,080 | $119,764 | 100.0 |
| Software Engineer (any) *(control)* | 15-1252 | **441** | 661 | 3.834 | $133,080 | $149,100 | 100.0 |

> **Read the columns by scope.** *Sponsoring cos.* and *Title hits* are about the matched title, and are lower bounds. *Cog-pivot* and *SOC median wage* are about the SOC you mapped the framing to — your judgment, not the data's. The last two columns are about the matched **companies**, across every role they sponsor; they say nothing about what that title pays.

## Spread

**Product / Interface Designer** (55 employers) vs **Creative Technologist** (0) — 55 vs 0, biased upward (see TITLE_LIST_IS_A_SUMMARY). Control framings excluded: Software Engineer (any) (441).

## Stop conditions and caveats fired

- **UNSCORABLE_FRAMING** — 2 framing(s) have no cognitive_pivot_score in data/bls/compact/soc_occupation_compact.csv: 15-1299 (Computer Occupations, All Other), 15-1255 (Web and Digital Interface Designers)
  - *Effect:* Role-quality comparison is WITHHELD for these framings. Sponsorship counts remain valid.
- **STALE_FUNDING_DATA** — newest latest_funding_date in data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv is 2025-09-26, 372 days before --asof 2026-10-03.
  - *Effect:* No company can satisfy a 365-day funding-recency gate from committed data. Refresh via scripts/sec/ before trusting any "recently funded" claim.
- **NO_SPONSORSHIP_RECORD** — framing(s) with zero matching companies in committed history: creative-technologist
  - *Effect:* Absence of record is NOT proof of non-sponsorship. Treat as unknown, not as a negative.
- **TITLE_LIST_IS_A_SUMMARY** — 1517 of 1557 companies (97.4%) have more approvals than listed titles (max list length 14).
  - *Effect:* Per-framing counts are LOWER BOUNDS, and the bound is loosest for low-volume titles. A spread between a high-volume framing and a low-volume one is biased upward by an unknown factor.

## Not verified by this run

- The title→SOC mapping for each framing (the source has no SOC column; it is the candidate's judgment).
- Salary or approval rate for the matched TITLE — both available fields are company-wide, across all roles.
- Whether any employer would accept a reframed title for this candidate.
- Current openings — this file is historical sponsorship record, not live postings.
- Sponsorship by firms absent from the dataset (94.9% of rows carry no H-1B record).

## Sample employers per framing

### Motion / Media Designer — 27-1014

| Company | ST | Stage | Last funding | Total approvals (all roles) | Matched title(s) |
|---|---|---|---|---:|---|
| APPLOVIN CORP | CA | Series D+ | 2022-02-23 | 130 | Senior Designer, Motion Graphics |
| FIGMA INC | CA | Series D+ | 2024-05-15 | 188 | Motion Designer, Brand Studio |

### Art / Creative Director — 27-1011

| Company | ST | Stage | Last funding | Total approvals (all roles) | Matched title(s) |
|---|---|---|---|---:|---|
| CHEGG INC | CA | Pre-Seed | 2014-04-09 | 132 | Associate Creative Director |
| MAGICAL TOME INC | CA | Series C | 2023-02-17 | 14 | Creative Strategy Lead |
| NOSOTROS LIFE & SPIRITS INC | CA | Series A | 2023-05-04 | 2 | Head of Creative Direction |
| REDDIT INC | CA | Series D+ | 2021-08-11 | 408 | Senior Creative Strategist |

### Graphic / Visual Designer — 27-1024

| Company | ST | Stage | Last funding | Total approvals (all roles) | Matched title(s) |
|---|---|---|---|---:|---|
| FITLAB INC | CA | Series A | 2023-03-08 | 2 | Visual Designer |
| LOOPIE INC | WA | Pre-Seed | 2020-02-03 | 2 | Graphic Designer |
| ODK MEDIA INC | CA | Pre-Seed | 2015-08-25 | 12 | Junior Visual Designer |
| SENDBIRD INC | CA | Series D+ | 2021-03-19 | 24 | Brand Designer |
| YENDO INC | TX | Series B | 2023-04-03 | 2 | Brand Designer |

### Creative Technologist — 15-1299

_No company in committed history lists a sponsored title matching these probes._

### Product / Interface Designer — 15-1255

| Company | ST | Stage | Last funding | Total approvals (all roles) | Matched title(s) |
|---|---|---|---|---:|---|
| ADDEPAR INC | CA | Series D+ | 2021-06-07 | 150 | Product Designer |
| AMBERFLOIO INC | CA | Series B | 2022-12-30 | 4 | Product Designer |
| AMBIENCE HEALTHCARE INC | CA | Series D+ | 2025-07-01 | 6 | Founding Product Designer |
| APIXIO INC | CA | Series A | 2018-07-31 | 22 | Senior Product Designer |
| ASANA INC | CA | Series C | 2018-11-15 | 352 | Product Designer ; Senior Director of Product Design |
| BRIDGE IT INC | NY | Pre-Seed | 2019-02-12 | 26 | Senior Product Design Manager |
| BRIGHTCOVE INC | MA | Pre-Seed | 2022-02-01 | 36 | Senior UX Designer |
| CHECKR INC | CA | Series D+ | 2021-08-24 | 76 | Senior Product Designer  |

### Front-End / UI Engineer — 15-1252

| Company | ST | Stage | Last funding | Total approvals (all roles) | Matched title(s) |
|---|---|---|---|---:|---|
| BARSTOOL SPORTS INC | NY | Series A | 2017-11-07 | 4 | Senior Front-end Engineer |
| EARGO INC | CA | Series C | 2020-07-13 | 14 | Staff Frontend Software Engineer |
| ENFUSION LTD LLC | IL | Series A | 2015-01-06 | 28 | Junior Front End Developer |
| EXTEN TECHNOLOGIES INC | TX | Pre-Seed | 2019-09-18 | 82 | Web Developer; Web Developer  |
| FORRGE INC | NY | Pre-Seed | 2015-11-23 | 2 | Front End Engineer |
| HINGE HEALTH INC | CA | Series D+ | 2021-10-22 | 84 | Senior Software Engineer – Front End |
| LILT INC | CA | Series C | 2024-11-15 | 6 | Senior Front End Engineer |
| MYTIDE THERAPEUTICS INC | MA | Pre-Seed | 2022-12-23 | 2 | Front End Developer |

### Software Engineer (any) — 15-1252

| Company | ST | Stage | Last funding | Total approvals (all roles) | Matched title(s) |
|---|---|---|---|---:|---|
| 1UPHEALTH INC | MA | Series C | 2023-04-03 | 12 | Senior Software Engineer |
| 23ANDME INC | CA | Series C | 2020-12-09 | 52 | Sr. Software Engineer III |
| 6SENSE INSIGHTS INC | CA | Series D+ | 2022-01-20 | 62 | Senior Software Engineer |
| A10 NETWORKS INC | CA | Pre-Seed | 2016-06-23 | 106 | Staff Software Engineer; Senior Software Engineer; Principal QA Software Engineer; Software Engineer  |
| ABACUS INSIGHTS INC | MA | Series A | 2024-10-01 | 22 | Software Engineer |
| ACADEMIA INC | CA | Series A | 2013-08-09 | 10 | Software Engineer |
| ACCOLADE INC | WA | Series D+ | 2021-03-03 | 28 | Mgr, Software Engineer |
| ACORNS GROW INC | CA | Series D+ | 2019-01-25 | 42 | Sr. Software Engineer |

