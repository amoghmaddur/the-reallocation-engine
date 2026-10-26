# Creative-technical SOC arbitrage — human card

## Executive summary

**What this is.** A one-page guide to a tool that compares the different job titles one
creative-technical portfolio could honestly carry, by how many employers have ever
sponsored each.
**Why read it.** It tells you what the numbers can and cannot support before you act on them.
**What it found last run.** Product/interface designer: 55 employers. Front-end engineer:
18. Motion designer: 2. Creative technologist: 0. Every count is a floor, not a total.

**Audience:** an OPT candidate (or their advisor) deciding which job title to lead with.
**Agent twin:** `recipes/cases/2026fa/amoghmaddur-ai-media-soc-arbitrage.md` — full gates, contract, and TODOs live there.

## What it can tell you

- Which titles have *any* sponsorship history in the engine's 30,369-company file, and roughly how much.
- For titles mapped to an occupation with a score: that occupation's national median wage and automation-resilience score.

## What it cannot tell you

- What occupation code an employer would actually file for you — the mapping is yours.
- What a sponsored designer is paid — the only salary on file is each employer's median across *all* its sponsored roles.
- Rare titles the file's short "common roles" list dropped — which is why creative counts are floors.
- Whether anything is hiring now, or whether a company is recently funded (funding data is a year old).
- Most of your niche: of 14 AI-video companies on the example list, 10 are not in the file, and the 4 that are have no sponsorship record. Run the niche check on your own list before trusting any count.
- Universities, museums and research nonprofits, which rarely appear in this file but can sponsor creative-technical work.

## How to use the result

1. Run the **niche check** on your own target employers, and read the **sample employers** under every title before reading any count.
2. If a title's sample rows are jobs you could not honestly claim, mark that title as a control and re-run.
3. Pick your lead title yourself. The tool never recommends one.

## Named failure modes (detail in the domain justification)

1. **The occupation mapping is invisible in the good-news direction** — it can understate the wage of the title you are about to choose.
2. **A broad title and a summarised list inflate the gap together**, both toward "call yourself an engineer".
