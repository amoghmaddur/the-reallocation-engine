# search/gaps.md — what an AI Engineer role demands that my record does not yet evidence

## Executive summary

**What this is.** The gap between my attested record (`resume.json`) and the role I declared
(`profile.yml`: AI Engineer; occupations 15-1252 Software Developers and 15-2051 Data
Scientists; Seed–Series D startups with sponsorship history). **Why read it.** Each row is a
thing I would have to prove before an employer would. **What it found.** The largest gaps are
experience level (12 of the 14 sampled postings are Senior or above) and shipped, evaluated ML
systems. Each gap closes only when new evidence exists that someone else can check.

*AGENT DRAFT, 2026-10-26.* Awaiting my two edits: one killed row (with reason) and one row
rewritten in my own words.

## Evidence base (how every row is sourced)

- **Postings:** 14 US-based AI/ML engineering postings (P1–P14 below), mined on 2026-10-26 from the
  public boards of 8 companies that have sponsored an ML/AI title in the engine's 80 Days file.
  Raw API responses are saved in `search/postings/`. Inclusion rule (fixed before counting): title
  has AI/ML and engineer/scientist/researcher/developer; not a manager, director, designer, analyst
  or specialist role; US location. 4 boards had matching postings; **9 of 14 are from one company
  (Whoop)**, so counts lean on one employer.
- **Counts** use a vocabulary fixed before reading results. Each term was checked against a
  snippet. Two terms were dropped as semantically wrong: "computer vision" matched generative
  *image content*, and "distributed / scale" mostly matched "scalable".
- **O\*NET:** `data/bls/compact/soc_occupation_compact.csv`, row 15-1252.00 (skill levels on a
  0–7 scale). Row 15-2051.00 has no skill data, so it supports no row here.

| Gap | Evidence the target demands it | What I have | Plan to close it (closing condition) |
|---|---|---|---|
| **1. A shipped, operated ML system** | "production" in 10/14 postings. P3 (Whoop Senior MLE): *"the ability to deliver production-ready ML systems."* | Sphere Soft chatbot MVP, deployed on AWS during an internship as part of a team; no measured outcomes after attestation. No project has a public URL. | Deploy one ML/LLM feature end to end (API, logging, monitoring) at a public URL. **Closed when** a stranger can call the endpoint and read the repo and monitoring logs; then a `projects[]` entry with `url` is added to `resume.json`. |
| **2. A deep-learning framework (PyTorch / TensorFlow)** | PyTorch in 5/14, TensorFlow in 4/14. P5 (Whoop): *"Proficiency in Python and deep learning frameworks (e.g., PyTorch, TensorFlow)."* 2 of the 5 accept scikit-learn instead (P9, P13). | scikit-learn in Financial Fraud Detection (solo, attested). No PyTorch or TensorFlow anywhere in the record. | Train and evaluate one PyTorch model on a public dataset. **Closed when** a public repo's README reproduces the reported metric from a clean clone. |
| **3. Evaluating AI systems (evals, guardrails, monitoring)** | "evaluation" in 8/14. P1 (Vanta Senior SWE, AI Product): *"Instrument evaluations, guardrails, and monitoring"* O\*NET 15-1252: systems evaluation level 4.12, tied highest of its 10 rated skills. | Classical model evaluation in Fraud Detection (AUPRC, 3-fold stratified CV, 6 metrics; solo). Nothing for an LLM-backed system. | Publish an evaluation harness for one LLM feature: labelled test set, failure taxonomy, regression run on each change. **Closed when** a public repo and report with pass/fail counts can be re-run by a reviewer. |
| **4. Professional experience level** | 12/14 titles are Senior, Staff, Principal or III. Stated minimums: *"4+ years"* (P3), *"5+ years"* (P14), *"At least 7 years"* (P1), Master's *"with 5 or more years"* (P12). The only two non-senior roles: P8 *"0 to 2 years … including internships or co-ops"*, P4 *"2-4 years"* | Two internships: 2023-07 to 2023-08 and 2024-06 to 2024-08 (about 5 months, title "Intern"). | Close by employment, not study: an AI/ML engineering co-op now, then entry-level titles only (P8-type "I"/new-grad). **Closed when** there is a signed co-op or entry-level offer in an AI/ML engineering role, added as a `resume.json` experience entry with the offer letter as evidence. |
| **5. Degree field named by postings** | Master's or PhD in 8/14, with fields named. P12: *"Master's degree in Machine Learning, Computer Science, Data Science, Statistics, Applied Mathematics (or a closely related discipline)"* P7: *"MS or PhD in … Computer Science, Machine Learning, Applied Mathematics, or a related quantitative field."* | BTech Computer Science (completed 2025-06). MS Management Information Systems (in progress, expected 2027-12). MIS is not on the named lists. | Show ML/quantitative depth inside the MS: ML or statistics electives on the official transcript. **Closed when** the transcript (external issuer: the university) lists them and the MS is conferred. |
| **6. A co-op sourcing channel** | 0 intern or co-op postings among all 407 postings on the 8 public boards checked (2026-10-26). | `profile.yml` says co-op now; no co-op pipeline is recorded. | Source co-ops through the university co-op channel instead of public ATS boards. **Closed when** a co-op offer exists (the first milestone of row 4). |
| **7. LLM application stack (LLMs, RAG, agents, prompting)** | LLMs in 2/14, agents 3/14, RAG 1/14, prompting 1/14. P1: *"You've shipped LLM-backed products and have experience with prompting, RAG, and/or agent frameworks"* | Gemini API integration in Carbon Footprint Calculator (team, contributor). Personal AI Prompter (solo; stores prompts, not an LLM pipeline). Chatbot intent classification (internship). | Build one retrieval-augmented feature with a retrieval-quality evaluation. **Closed when** a public repo reports retrieval and answer metrics a reviewer can re-run. |

## Killed row

*To be written by me: the row number, and one sentence on what the agent got wrong about my
situation that made it generate the row.*

## Rewritten in my own words

*To be written by me: the gap that matters most to me, restated in my own words (evidence,
what I have, plan).*

## Postings cited

| ID | Company | Title | Location | Posted | URL |
|---|---|---|---|---|---|
| P1 | Vanta | Senior Software Engineer, AI Product | Remote U.S. | 2025-11-21 | https://jobs.ashbyhq.com/vanta/1fb75eb1-739a-4394-9f9b-ca684a61dfd3 |
| P2 | Vanta | Senior Data Scientist | Remote U.S. | 2026-08-11 | https://jobs.ashbyhq.com/vanta/aa7512c2-fb94-4238-bb15-f0063307af53 |
| P3 | Whoop | Senior Machine Learning Engineer, Core Algorithms | Boston, MA | 2026-07-15 | https://jobs.ashbyhq.com/whoop/5502fb12-e948-4f62-8db6-b725fb3dc8e5 |
| P4 | Whoop | Software Engineer II (Backend, AI Experiences & AI Platform) | Boston, MA | 2026-07-10 | https://jobs.ashbyhq.com/whoop/a7a80da5-5fa5-44fb-8a7c-2ea141cabda8 |
| P5 | Whoop | Senior AI/ML Researcher (Foundation AI) | Boston, MA | 2026-07-10 | https://jobs.ashbyhq.com/whoop/85da87ff-c1a6-4fcd-8c7c-162e57b18281 |
| P6 | Whoop | Principal AI/ML Researcher | Boston, MA | 2026-07-21 | https://jobs.ashbyhq.com/whoop/eefc60a9-fec8-4df6-bd4b-5b75bf57e04c |
| P7 | Whoop | Staff Applied Machine Learning Scientist | Boston, MA | 2026-10-06 | https://jobs.ashbyhq.com/whoop/23264cb1-d3cf-43e6-b05a-ec5f0fca56c6 |
| P8 | Whoop | Software Engineer I (Frontend, AI Platform) | Boston, MA | 2026-10-06 | https://jobs.ashbyhq.com/whoop/ae351985-e5cf-4bd8-b8a1-6f8c2d5b5de3 |
| P9 | Whoop | Senior Applied ML Algorithm Engineer | Boston, MA | 2026-10-09 | https://jobs.ashbyhq.com/whoop/93218baa-4989-4141-b500-32f937e72131 |
| P10 | Whoop | Staff AI Researcher (Foundation AI) | Boston, MA | 2026-10-09 | https://jobs.ashbyhq.com/whoop/aac41dfe-9ddb-4194-a81e-95f339aa86c7 |
| P11 | Whoop | Staff Applied Machine Learning Scientist (Health) | Boston, MA | 2026-10-09 | https://jobs.ashbyhq.com/whoop/9ab3c65e-96ff-4471-9e79-1c04fed92000 |
| P12 | PathAI | Machine Learning Engineer III (Applied Research & Model Development) | Boston / New York (Onsite) or Remote | 2026-09-08 | https://www.pathai.com/careers/8786343002?gh_jid=8786343002 |
| P13 | PathAI | Senior/Staff Software Engineer, ML Ops | Boston, MA | 2026-09-11 | https://www.pathai.com/careers/8769653002?gh_jid=8769653002 |
| P14 | Typeface | Senior ML Engineer | Palo Alto, CA | 2025-08-19 | https://job-boards.greenhouse.io/typeface/jobs/4833219007 |

## Closed gaps

*(A row moves here only when its closing evidence exists and a matching entry is added to `resume.json`.)*
