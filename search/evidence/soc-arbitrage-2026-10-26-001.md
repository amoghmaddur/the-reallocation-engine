# SOC Arbitrage — amogh (private layer)

## Executive summary

**What this is.** A comparison of 5 different job titles that honestly describe one portfolio, ranked by how many employers in the engine's company file have ever sponsored an H-1B worker under a matching title.

**Why read it.** A job board shows openings, not which way of describing yourself has a sponsorship history. Pick the wrong title and every application goes to employers with no record of sponsoring that work.

**What it found.** "Software Engineer / Developer" matched 482 sponsoring employers; "Systems / IT Analyst" matched 20 — a 24.1× spread. Treat this as a floor and a direction, not an exact ratio: the file lists only each employer's most common sponsored titles, which hides rare titles such as creative ones, so the gap is overstated by an amount the data cannot tell us. The automation-resilience comparison is withheld for "Data / BI Analyst", "Product Manager (APM/PM)", because the occupation table has no score for them. No "recently funded" claim is made: the newest funding date in the file is 395 days old.

**What it did not do.** It does not recommend a title, check any live job posting, or say what a sponsored designer is paid — the salary figures below describe each employer's sponsored workforce as a whole.

## Run record

`soc-arbitrage-2026-10-26-001` · as-of 2026-10-26 · mode sample · amoghmaddur-ai-media-soc-arbitrage v0.4.0 · authorization: F-1 student (MS in progress, program end 2027-12); requires sponsorship

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
| Business Analyst | 13-1111 | **32** | 34 | 4.013 | $101,190 | $116,500 | 100.0 |
| Systems / IT Analyst | 15-1211 | **20** | 23 | 4.024 | $103,790 | $127,460 | 100.0 |
| Data / BI Analyst | 15-2051 | **57** | 63 | **missing** | $112,590 | $122,033 | 100.0 |
| Product Manager (APM/PM) | 15-1299 | **112** | 126 | **missing** | $108,970 | $150,000 | 100.0 |
| Software Engineer / Developer | 15-1252 | **482** | 729 | 3.834 | $133,080 | $145,000 | 100.0 |

> **Read the columns by scope.** *Sponsoring cos.* and *Title hits* are about the matched title, and are lower bounds. *Cog-pivot* and *SOC median wage* are about the SOC you mapped the framing to — your judgment, not the data's. The last two columns are about the matched **companies**, across every role they sponsor; they say nothing about what that title pays.

## Spread

**Software Engineer / Developer** (482 employers) vs **Systems / IT Analyst** (20) — 24.1×, biased upward (see TITLE_LIST_IS_A_SUMMARY).

## Stop conditions and caveats fired

- **UNSCORABLE_FRAMING** — 2 framing(s) have no cognitive_pivot_score in data/bls/compact/soc_occupation_compact.csv: 15-2051 (Data Scientists), 15-1299 (Computer Occupations, All Other)
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

### Business Analyst — 13-1111

| Company | ST | Stage | Last funding | Total approvals (all roles) | Matched title(s) |
|---|---|---|---|---:|---|
| ABACUS INSIGHTS INC | MA | Series A | 2024-10-01 | 22 | Business Analyst Manager - Data Distribution Team |
| APEX TECHNOLOGY INC | CA | Series D+ | 2025-04-16 | 62 | Business Analyst |
| ASTRUMU INC | WA | Pre-Seed | 2018-11-26 | 12 | Business Analyst |
| BENCHLING INC | CA | Series A | 2016-04-18 | 78 | Business Systems Analyst |
| BLUEBIRD BIO INC | MA | Series C | 2021-09-10 | 50 | BUSINESS SYSTEMS ANALYST II |
| CONFLUENT INC | CA | Series C | 2017-02-21 | 610 | Sr. Business Systems Analyst - GTM |
| DELOITTE TOUCHE TOHMATSU SERVICES INC | NY | Pre-Seed | 2018-01-12 | 242 | Global Audit and Assurance Business Systems Analyst- I & A  |
| DELOITTE TOUCHE TOHMATSU SERVICES LLC | NY | Seed | 2024-01-12 | 242 | Global Audit and Assurance Business Systems Analyst- I & A  |

### Systems / IT Analyst — 15-1211

| Company | ST | Stage | Last funding | Total approvals (all roles) | Matched title(s) |
|---|---|---|---|---:|---|
| BENCHLING INC | CA | Series A | 2016-04-18 | 78 | Business Systems Analyst |
| BLUEBIRD BIO INC | MA | Series C | 2021-09-10 | 50 | BUSINESS SYSTEMS ANALYST II |
| CONFLUENT INC | CA | Series C | 2017-02-21 | 610 | Sr. Business Systems Analyst - GTM |
| DELOITTE TOUCHE TOHMATSU SERVICES INC | NY | Pre-Seed | 2018-01-12 | 242 | Global Audit and Assurance Business Systems Analyst- I & A  |
| DELOITTE TOUCHE TOHMATSU SERVICES LLC | NY | Seed | 2024-01-12 | 242 | Global Audit and Assurance Business Systems Analyst- I & A  |
| DEXCOM INC | CA | Series A | 2016-05-02 | 290 | Sr. Staff Business Systems Analyst |
| FORGEROCK INC | CA | Series C | 2020-04-06 | 36 | Computer Systems Analyst (Senior IT Project Manager) |
| FUSION SURPLUS SOLUTIONS INC | CA | — | — | 204 | SYSTEMS ANALYST |

### Data / BI Analyst — 15-2051

| Company | ST | Stage | Last funding | Total approvals (all roles) | Matched title(s) |
|---|---|---|---|---:|---|
| ACE-UP INC | MA | Series B | 2024-04-04 | 2 | Business Intelligence Analyst |
| AFFINITY SOLUTIONS INC | NY | Series B | 2019-05-07 | 40 | SENIOR DATA ANALYST; DATA ANALYST |
| ALLAKOS INC | CA | Series D+ | 2017-11-30 | 8 | Data Analyst |
| ALPHONSO INC | CA | Series A | 2017-04-27 | 130 | Sr. Manager, Product Strategy and Business Intelligence; Senior Business and Data Analyst |
| ANAPLAN INC | CA | Series C | 2017-11-21 | 156 | Business Intelligence Engineer |
| APRICUS BIOSCIENCES INC | CA | Seed | 2017-09-13 | 90 | Senior Enterprise Systems & Data Analyst |
| ASCUS BIOSCIENCES INC | CA | Series A | 2019-05-31 | 90 | Senior Enterprise Systems & Data Analyst |
| AUTOFI INC | CA | Series A | 2019-04-12 | 6 | Associate Business Intelligence Analyst |

### Product Manager (APM/PM) — 15-1299

| Company | ST | Stage | Last funding | Total approvals (all roles) | Matched title(s) |
|---|---|---|---|---:|---|
| ACCELA INC | CA | Series D+ | 2015-02-13 | 4 | Software Developer (Product Manager) |
| ACCELBYTE INC | WA | Series C | 2022-04-07 | 2 | Product Manager - Analytics |
| ACORNS GROW INC | CA | Series D+ | 2019-01-25 | 42 | Sr. Product Manager |
| AIERA INC | NY | Series B | 2025-05-15 | 102 | Product Manager |
| AIRBYTE INC | CA | Series B | 2021-05-20 | 20 | Product Manager, Connectors |
| AKOYA BIOSCIENCES INC | CA | Series B | 2018-09-26 | 26 | Sr. Product Manager, PhenoCycler Instruments |
| ALPHONSO INC | CA | Series A | 2017-04-27 | 130 | Product Manager; Associate Product Manager |
| ALTERYX INC | CA | Seed | 2017-05-26 | 56 | TECHNICAL PRODUCT MANAGER/PRODUCT OWNER |

### Software Engineer / Developer — 15-1252

| Company | ST | Stage | Last funding | Total approvals (all roles) | Matched title(s) |
|---|---|---|---|---:|---|
| 1UPHEALTH INC | MA | Series C | 2023-04-03 | 12 | Senior Software Engineer |
| 23ANDME INC | CA | Series C | 2020-12-09 | 52 | Sr. Software Engineer III |
| 6SENSE INSIGHTS INC | CA | Series D+ | 2022-01-20 | 62 | Senior Software Engineer |
| A10 NETWORKS INC | CA | Pre-Seed | 2016-06-23 | 106 | Staff Software Engineer; Senior Software Engineer; Principal QA Software Engineer; Software Engineer  |
| ABACUS INSIGHTS INC | MA | Series A | 2024-10-01 | 22 | Software Engineer |
| ACADEMIA INC | CA | Series A | 2013-08-09 | 10 | Software Engineer |
| ACCELA INC | CA | Series D+ | 2015-02-13 | 4 | Software Developer (Product Manager) |
| ACCOLADE INC | WA | Series D+ | 2021-03-03 | 28 | Mgr, Software Engineer |

