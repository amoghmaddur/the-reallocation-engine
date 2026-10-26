# AI Use Disclosure — personal data layer (`search/`)

## Executive summary

How I used AI to build my résumé record, search profile and gap table, and the one thing it got
wrong about me. Amogh Maddur, 2026-10-26.

## In my words

I have used AI for efficiency and verification. None of whatever I learnt while using it is for
waste.

The AI (Claude, in Claude Code) did the extraction, the drafting and the checking: it turned my
résumé into `resume.json` and compared it with my LinkedIn and an older draft, interviewed me for
`profile.yml`, pulled 14 real job postings and the O\*NET data for `gaps.md`, and re-ran tests on
my own project. I did the deciding: I answered every question, said which differences were real
errors, corrected my records, chose the gap to kill, and attested the final files.

## What the AI could not do

The agent described my Personal AI Prompter as an app that only stores prompts, and built an
"LLM application stack" gap on that. It could not know that Pepper makes an active LLM call to
add the deeper context a typed prompt needs, and reshapes its suggestions after onboarding, so I
killed that row.

## Also disclosed

- I asked the agent to write the rewritten gap row (row 1) from my explanation of Pepper and my
  Pepper repository. It is labelled that way in `gaps.md`.
- I asked the agent to put this disclosure together around my own sentences above.
- My visa facts (F-1, pre-OPT, STEM eligibility confirmed by my DSO) are my statements; the agent
  did not read my I-20.
- Phone number and email were removed from `resume.json` before publishing.
