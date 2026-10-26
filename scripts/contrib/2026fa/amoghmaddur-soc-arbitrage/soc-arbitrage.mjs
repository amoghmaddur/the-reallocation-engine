#!/usr/bin/env node
// soc-arbitrage.mjs — Creative-Technical SOC Arbitrage
// recipe: recipes/cases/2026fa/amoghmaddur-ai-media-soc-arbitrage.md
//
// THE QUESTION: a candidate whose skillset is describable under BOTH a
// creative-media SOC (27-*) and a computer/interface SOC (15-*) cannot see, from
// a job board, which *framing* of the same portfolio has H-1B sponsorship history.
// This script measures that, from committed records only.
//
//   node scripts/contrib/2026fa/amoghmaddur-soc-arbitrage/soc-arbitrage.mjs <framings.json> [options]
//
// Options:
//   --out-dir <dir>     agent JSON destination        (default: reports/generated)
//   --md <path>         human report destination      (default: <out-dir>/<run_id>.md)
//   --dry-run           compute and print; write nothing
//   --strict            exit 2 if any framing is UNSCORABLE (missing cognitive_pivot_score)
//   --funding-window N  days before --asof that count as "recent" (default 365)
//   --asof YYYY-MM-DD   evaluation date               (default: today)
//   --h1b-csv <path>    override the 80 Days CSV       (fixtures/tests only)
//   --soc-csv <path>    override the SOC compact CSV   (fixtures/tests only)
//
// Exit codes: 0 ok · 2 --strict and a framing is unscorable · 64 usage · 65 bad profile.
//
// PROVENANCE IS THE POINT. Every emitted number carries `source`:
//   record  — read from a committed dataset, traceable to a file+column
//   derived — arithmetic over records (count/median), no judgment
//   missing — the dataset has no value; the mode refuses to fill it
// and, where it matters, `scope`: 'title' (about the matched title) or
// 'company-wide' (about every role the matched company sponsored).
//
// This script does NOT infer, predict, or rank by model judgment. It counts.

import fs from 'node:fs';
import path from 'node:path';

const WORKFLOW = 'amoghmaddur-ai-media-soc-arbitrage';
const VERSION = '0.4.0';

// -- argv ------------------------------------------------------------------
const argv = process.argv.slice(2);
const VALUE_FLAGS = new Set(['--out-dir', '--md', '--funding-window', '--asof', '--h1b-csv', '--soc-csv']);
const flag = (n, d = null) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
const has = (n) => argv.includes(n);
const profilePath = argv.find((a, i) => !a.startsWith('--') && !(i > 0 && VALUE_FLAGS.has(argv[i - 1])));

const H1B_CSV = flag('--h1b-csv', 'data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv');
const SOC_CSV = flag('--soc-csv', 'data/bls/compact/soc_occupation_compact.csv');

if (!profilePath) {
  console.error('usage: node scripts/contrib/2026fa/amoghmaddur-soc-arbitrage/soc-arbitrage.mjs <framings.json> [--dry-run] [--strict]');
  process.exit(64);
}
const DRY = has('--dry-run');
const STRICT = has('--strict');
const FUNDING_WINDOW = Number(flag('--funding-window', 365));
const ASOF = flag('--asof', new Date().toISOString().slice(0, 10));

// A bad profile must fail legibly and write nothing (v0.2.0 threw a raw stack).
function badProfile(msg) {
  console.error('soc-arbitrage: bad profile ' + profilePath + ' — ' + msg + '\nnothing written.');
  process.exit(65);
}
function loadProfile(p) {
  let txt;
  try { txt = fs.readFileSync(p, 'utf8'); } catch (e) { badProfile('cannot read file (' + e.code + ')'); }
  let prof;
  try { prof = JSON.parse(txt); } catch (e) { badProfile('not valid JSON (' + e.message + ')'); }
  if (!Array.isArray(prof.framings) || prof.framings.length < 1) badProfile('`framings` must be a non-empty array');
  prof.framings.forEach((f, i) => {
    if (!f.id || !f.soc) badProfile('framings[' + i + '] needs `id` and `soc`');
    if (!Array.isArray(f.title_probes) || !f.title_probes.length) badProfile('framings[' + i + '] needs a non-empty `title_probes` array');
  });
  return prof;
}

// -- tiny CSV reader (quoted fields, embedded commas/newlines) --------------
function readCSV(file) {
  const text = fs.readFileSync(file, 'utf8');
  const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; }
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (c !== '\r') cell += c;
  }
  if (cell.length || row.length) { row.push(cell); rows.push(row); }
  const head = rows.shift();
  return rows.filter((r) => r.length > 1).map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ''])));
}

// titles arrive as a Python repr list inside a CSV cell: "['A', 'B']"
function parseTitleList(s) {
  if (!s || !s.trim()) return [];
  const out = [];
  const re = /'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"/g;
  let m;
  while ((m = re.exec(s))) out.push((m[1] ?? m[2]).replace(/\\'/g, "'"));
  return out;
}

// Probe matching is LEFT-BOUNDARY, suffix-tolerant.
//   accept: "Product Designer"            ~ PRODUCT DESIGN  (suffix -er extends)
//   accept: "Senior Designer, Motion Gfx" ~ MOTION          (word start)
//   REJECT: "Senior Promotions Manager"   ~ MOTION          (pro-MOTION-s, mid-word)
// A right-hand boundary would be wrong — it would drop "Product Designer".
const probeRe = (p) => new RegExp('(?<![A-Z])' + p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
const matches = (title, compiled) => { const T = title.toUpperCase(); return compiled.some((re) => re.test(T)); };

const num = (s) => { const v = parseFloat(String(s).replace(/[$,]/g, '')); return isFinite(v) ? v : null; };
const median = (a) => {
  if (!a.length) return null;
  const s = [...a].sort((x, y) => x - y); const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const daysBetween = (a, b) => Math.round((new Date(a) - new Date(b)) / 86400000);
const pct = (a, b) => Number((100 * a / b).toFixed(1));

// -- load -------------------------------------------------------------------
const profile = loadProfile(profilePath);
const h1b = readCSV(H1B_CSV);
const soc = readCSV(SOC_CSV);

const socByCode = new Map();
for (const r of soc) if (!socByCode.has(r.bls_soc_code)) socByCode.set(r.bls_soc_code, r);
const socUnscored = soc.filter((r) => !(r.cognitive_pivot_score || '').trim()).length;

// universe facts (derived, used for honest denominators)
const sponsoring = h1b.filter((r) => (r.top_job_titles_sponsored || '').trim());
const allPairs = [];
for (const r of sponsoring) for (const t of parseTitleList(r.top_job_titles_sponsored)) allPairs.push({ r, t });

// The title field is a short summary ("common roles"), not a petition-level list.
// Count companies whose approvals exceed their listed titles: for those, the list
// cannot be complete, and low-volume titles are the ones a summary drops.
const listLens = sponsoring.map((r) => parseTitleList(r.top_job_titles_sponsored).length);
const summarised = sponsoring.filter((r, i) => (num(r['Total Approvals']) ?? 0) > listLens[i]).length;

const fundingDates = h1b.map((r) => (r.latest_funding_date || '').trim()).filter(Boolean).sort();
const newestFunding = fundingDates[fundingDates.length - 1] ?? null;
const fundingStaleDays = newestFunding ? daysBetween(ASOF, newestFunding) : null;

// -- per-framing measurement ------------------------------------------------
const results = [];
for (const f of profile.framings) {
  const compiled = f.title_probes.map((p) => probeRe(p.toUpperCase()));
  const hits = allPairs.filter(({ t }) => matches(t, compiled));
  const companies = new Map();
  for (const { r } of hits) companies.set(r.company_name, r);
  const cos = [...companies.values()];

  const rates = cos.map((r) => num(r.Approval_Rate)).filter((v) => v !== null);
  const sals = cos.map((r) => num(r.median_salary_offered)).filter((v) => v !== null);
  const recent = cos.filter((r) => {
    const d = (r.latest_funding_date || '').trim();
    return d && daysBetween(ASOF, d) <= FUNDING_WINDOW;
  });

  const s = socByCode.get(f.soc) || null;
  const cps = s && (s.cognitive_pivot_score || '').trim() ? Number(s.cognitive_pivot_score) : null;
  const wage = s && (s.annual_median_wage || '').trim() ? Number(s.annual_median_wage) : null;

  results.push({
    framing_id: f.id,
    label: f.label ?? f.id,
    // claimable:false marks a control framing — counted for context, never the headline.
    claimable: f.claimable !== false,
    soc: f.soc,
    soc_mapping: { source: 'inferred', note: 'title→SOC assigned by the candidate; the 80 Days CSV has no SOC column' },
    soc_title: s ? s.title : null,
    soc_found: Boolean(s),
    title_probes: f.title_probes,
    sponsorship: {
      title_instances: { value: hits.length, source: 'derived', scope: 'title', bound: 'lower', from: H1B_CSV + '#top_job_titles_sponsored' },
      distinct_companies: { value: companies.size, source: 'derived', scope: 'title', bound: 'lower', from: H1B_CSV + '#top_job_titles_sponsored' },
      matched_cos_median_approval_rate: { value: median(rates), source: rates.length ? 'derived' : 'missing', scope: 'company-wide', n: rates.length, from: H1B_CSV + '#Approval_Rate' },
      matched_cos_median_salary_all_roles: { value: median(sals), source: sals.length ? 'derived' : 'missing', scope: 'company-wide', n: sals.length, from: H1B_CSV + '#median_salary_offered' },
      companies_funded_within_window: { value: recent.length, source: 'derived', window_days: FUNDING_WINDOW, from: H1B_CSV + '#latest_funding_date' },
    },
    role_quality: {
      cognitive_pivot_score: { value: cps, source: cps === null ? 'missing' : 'record', from: SOC_CSV + '#cognitive_pivot_score' },
      annual_median_wage: { value: wage, source: wage === null ? 'missing' : 'record', from: SOC_CSV + '#annual_median_wage' },
      job_zone: { value: s ? s.job_zone : null, source: s ? 'record' : 'missing' },
    },
    scorable: cps !== null,
    sample_companies: cos.slice(0, 8).map((r) => ({
      company: r.company_name,
      state: r.state,
      stage: r.latest_funding_stage,
      last_funding: r.latest_funding_date,
      total_approvals: num(r['Total Approvals']),
      titles: parseTitleList(r.top_job_titles_sponsored).filter((t) => matches(t, compiled)),
    })),
  });
}

// -- stop conditions + caveats ---------------------------------------------
const stops = [];
const unscorable = results.filter((r) => !r.scorable);
if (unscorable.length) {
  stops.push({
    condition: 'UNSCORABLE_FRAMING',
    detail: unscorable.length + ' framing(s) have no cognitive_pivot_score in ' + SOC_CSV + ': ' +
      unscorable.map((r) => r.soc + ' (' + (r.soc_title ?? 'SOC not in table') + ')').join(', '),
    effect: 'Role-quality comparison is WITHHELD for these framings. Sponsorship counts remain valid.',
  });
}
if (fundingStaleDays !== null && fundingStaleDays > FUNDING_WINDOW) {
  stops.push({
    condition: 'STALE_FUNDING_DATA',
    detail: 'newest latest_funding_date in ' + H1B_CSV + ' is ' + newestFunding + ', ' + fundingStaleDays + ' days before --asof ' + ASOF + '.',
    effect: 'No company can satisfy a ' + FUNDING_WINDOW + '-day funding-recency gate from committed data. Refresh via scripts/sec/ before trusting any "recently funded" claim.',
  });
}
const zero = results.filter((r) => r.sponsorship.distinct_companies.value === 0);
if (zero.length) {
  stops.push({
    condition: 'NO_SPONSORSHIP_RECORD',
    detail: 'framing(s) with zero matching companies in committed history: ' + zero.map((r) => r.framing_id).join(', '),
    effect: 'Absence of record is NOT proof of non-sponsorship. Treat as unknown, not as a negative.',
  });
}
if (summarised) {
  stops.push({
    condition: 'TITLE_LIST_IS_A_SUMMARY',
    detail: summarised + ' of ' + sponsoring.length + ' companies (' + pct(summarised, sponsoring.length) + '%) have more approvals than listed titles (max list length ' + Math.max(...listLens) + ').',
    effect: 'Per-framing counts are LOWER BOUNDS, and the bound is loosest for low-volume titles. A spread between a high-volume framing and a low-volume one is biased upward by an unknown factor.',
  });
}

// -- assemble ---------------------------------------------------------------
// Never overwrite an earlier run's evidence: take the next free sequence number.
const outDir = flag('--out-dir', path.join('reports', 'generated'));
let seq = 1;
const idFor = (n) => 'soc-arbitrage-' + ASOF + '-' + String(n).padStart(3, '0');
while (fs.existsSync(path.join(outDir, idFor(seq) + '.json'))) seq++;
const runId = idFor(seq);
const absentPct = pct(h1b.length - sponsoring.length, h1b.length);
const agent = {
  workflow: WORKFLOW,
  run_id: runId,
  recipe_version: VERSION,
  mode: DRY ? 'dry-run' : 'sample',
  asof: ASOF,
  generated_at: new Date().toISOString(),
  candidate_ref: profile.candidate ?? null,
  authorization: profile.authorization ?? null,
  source_files: [
    { path: H1B_CSV, rows: h1b.length, rows_with_h1b_history: sponsoring.length },
    { path: SOC_CSV, rows: soc.length, rows_without_cognitive_pivot_score: socUnscored },
  ],
  universe: {
    companies_total: { value: h1b.length, source: 'derived' },
    companies_with_any_h1b_history: { value: sponsoring.length, source: 'derived' },
    h1b_coverage_pct: { value: pct(sponsoring.length, h1b.length), source: 'derived' },
    title_instances_total: { value: allPairs.length, source: 'derived' },
    companies_with_more_approvals_than_listed_titles: { value: summarised, source: 'derived' },
    soc_rows_without_cognitive_pivot_score: { value: socUnscored, source: 'derived' },
    newest_funding_date: { value: newestFunding, source: 'record' },
    funding_staleness_days: { value: fundingStaleDays, source: 'derived' },
  },
  framings: results,
  stop_conditions: stops,
  not_verified: [
    'The title→SOC mapping for each framing (the source has no SOC column; it is the candidate\'s judgment).',
    'Salary or approval rate for the matched TITLE — both available fields are company-wide, across all roles.',
    'Whether any employer would accept a reframed title for this candidate.',
    'Current openings — this file is historical sponsorship record, not live postings.',
    'Sponsorship by firms absent from the dataset (' + absentPct + '% of rows carry no H-1B record).',
  ],
};

// -- human report -----------------------------------------------------------
const money = (v) => (v == null ? '—' : '$' + Math.round(v).toLocaleString('en-US'));
const n1 = (v) => (v == null ? '—' : Number(v).toFixed(1));
// The headline spread compares only framings the candidate can claim. In run 2 an
// unclaimable control ("Software Engineer (any)") took the headline before this filter.
const claimable = results.filter((r) => r.claimable);
const controls = results.filter((r) => !r.claimable);
const ranked = [...(claimable.length ? claimable : results)].sort((a, b) => b.sponsorship.distinct_companies.value - a.sponsorship.distinct_companies.value);
const best = ranked[0], worst = ranked[ranked.length - 1];
const bv = best.sponsorship.distinct_companies.value, wv = worst.sponsorship.distinct_companies.value;
const ratio = wv === 0 ? bv + ' vs 0' : (bv / wv).toFixed(1) + '×';

// Executive summary first (SNICKERDOODLE P9): plain language, no paths or field names.
let md = '# SOC Arbitrage — ' + (profile.candidate ?? 'unnamed profile') + '\n\n';
md += '## Executive summary\n\n';
md += '**What this is.** A comparison of ' + claimable.length + ' different job titles that honestly describe one portfolio'
   + (controls.length ? ' (plus ' + controls.length + ' control title' + (controls.length > 1 ? 's' : '') + ' the candidate cannot claim, shown for context only)' : '')
   + ', ranked by how many employers in the engine\'s company file have ever sponsored an H-1B worker under a matching title.\n\n';
md += '**Why read it.** A job board shows openings, not which way of describing yourself has a sponsorship history. Pick the wrong title and every application goes to employers with no record of sponsoring that work.\n\n';
md += '**What it found.** "' + best.label + '" matched ' + bv + ' sponsoring employers; "' + worst.label + '" matched ' + wv + ' — a ' + ratio + ' spread. ';
md += 'Treat this as a floor and a direction, not an exact ratio: the file lists only each employer\'s most common sponsored titles, which hides rare titles such as creative ones, so the gap is overstated by an amount the data cannot tell us.';
if (unscorable.length) md += ' The automation-resilience comparison is withheld for ' + unscorable.map((r) => '"' + r.label + '"').join(', ') + ', because the occupation table has no score for ' + (unscorable.length > 1 ? 'them.' : 'it.');
if (fundingStaleDays > FUNDING_WINDOW) md += ' No "recently funded" claim is made: the newest funding date in the file is ' + fundingStaleDays + ' days old.';
md += '\n\n**What it did not do.** It does not recommend a title, check any live job posting, or say what a sponsored designer is paid — the salary figures below describe each employer\'s sponsored workforce as a whole.\n\n';

md += '## Run record\n\n';
md += '`' + runId + '` · as-of ' + ASOF + ' · mode ' + agent.mode + ' · ' + WORKFLOW + ' v' + VERSION + ' · authorization: ' + (profile.authorization ?? '—') + '\n\n';
md += '## Universe (derived from committed data)\n\n';
md += '| Fact | Value | Source |\n|---|---:|---|\n';
md += '| Companies in file | ' + h1b.length.toLocaleString('en-US') + ' | derived |\n';
md += '| ...with any H-1B history | ' + sponsoring.length.toLocaleString('en-US') + ' (' + agent.universe.h1b_coverage_pct.value + '%) | derived |\n';
md += '| Sponsored title instances | ' + allPairs.length.toLocaleString('en-US') + ' | derived |\n';
md += '| Companies with more approvals than listed titles | ' + summarised.toLocaleString('en-US') + ' (' + pct(summarised, sponsoring.length) + '%) | derived |\n';
md += '| SOC rows with no cognitive-pivot score | ' + socUnscored + ' of ' + soc.length + ' | derived |\n';
md += '| Newest funding date | ' + newestFunding + ' | record |\n';
md += '| Funding staleness vs as-of | ' + fundingStaleDays + ' days | derived |\n\n';
md += '## Framing comparison\n\n';
md += '| Framing | SOC *(inferred)* | Sponsoring cos. *(≥)* | Title hits *(≥)* | Cog-pivot | SOC median wage | Matched cos.\' median H-1B salary, **all roles** | Matched cos.\' median approval %, **all roles** |\n|---|---|---:|---:|---:|---:|---:|---:|\n';
for (const r of results) {
  md += '| ' + r.label + (r.claimable ? '' : ' *(control)*') + ' | ' + r.soc + ' | **' + r.sponsorship.distinct_companies.value + '** | ' + r.sponsorship.title_instances.value + ' | '
     + (r.role_quality.cognitive_pivot_score.value ?? '**missing**') + ' | ' + money(r.role_quality.annual_median_wage.value) + ' | '
     + money(r.sponsorship.matched_cos_median_salary_all_roles.value) + ' | ' + n1(r.sponsorship.matched_cos_median_approval_rate.value) + ' |\n';
}
md += '\n> **Read the columns by scope.** *Sponsoring cos.* and *Title hits* are about the matched title, and are lower bounds. *Cog-pivot* and *SOC median wage* are about the SOC you mapped the framing to — your judgment, not the data\'s. The last two columns are about the matched **companies**, across every role they sponsor; they say nothing about what that title pays.\n\n';
md += '## Spread\n\n**' + best.label + '** (' + bv + ' employers) vs **' + worst.label + '** (' + wv + ') — ' + ratio + ', biased upward (see TITLE_LIST_IS_A_SUMMARY).'
   + (controls.length ? ' Control framings excluded: ' + controls.map((r) => r.label + ' (' + r.sponsorship.distinct_companies.value + ')').join(', ') + '.' : '') + '\n\n';
md += '## Stop conditions and caveats fired\n\n';
md += stops.length ? stops.map((s) => '- **' + s.condition + '** — ' + s.detail + '\n  - *Effect:* ' + s.effect).join('\n') : '_none_';
md += '\n\n## Not verified by this run\n\n' + agent.not_verified.map((x) => '- ' + x).join('\n') + '\n\n';
md += '## Sample employers per framing\n\n';
for (const r of results) {
  md += '### ' + r.label + ' — ' + r.soc + '\n\n';
  if (!r.sample_companies.length) { md += '_No company in committed history lists a sponsored title matching these probes._\n\n'; continue; }
  md += '| Company | ST | Stage | Last funding | Total approvals (all roles) | Matched title(s) |\n|---|---|---|---|---:|---|\n';
  for (const c of r.sample_companies) {
    md += '| ' + c.company + ' | ' + (c.state || '—') + ' | ' + (c.stage || '—') + ' | ' + (c.last_funding || '—') + ' | ' + (c.total_approvals ?? '—') + ' | ' + c.titles.join('; ') + ' |\n';
  }
  md += '\n';
}

// -- emit -------------------------------------------------------------------
const jsonPath = path.join(outDir, runId + '.json');
const mdPath = flag('--md', path.join(outDir, runId + '.md'));

if (DRY) {
  console.log('-- DRY RUN — nothing written --');
  console.log(md);
  console.log('[would write] ' + jsonPath);
  console.log('[would write] ' + mdPath);
} else {
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(path.dirname(mdPath), { recursive: true });
  fs.writeFileSync(jsonPath, JSON.stringify(agent, null, 2) + '\n');
  fs.writeFileSync(mdPath, md);
  console.log(md);
  console.log('agent log    -> ' + jsonPath);
  console.log('human report -> ' + mdPath);
}

for (const s of stops) console.error('STOP[' + s.condition + '] ' + s.detail);
if (STRICT && unscorable.length) { console.error('--strict: UNSCORABLE framing present -> exit 2'); process.exit(2); }
