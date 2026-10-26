// soc-arbitrage.test.mjs — fixture tests for soc-arbitrage.mjs (node --test).
// Runs the real CLI as a subprocess against fixtures/ — it does not re-implement
// the counting it tests. Run from the repo root:
//   node --test scripts/contrib/2026fa/amoghmaddur-soc-arbitrage/soc-arbitrage.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SCRIPT = path.join(HERE, 'soc-arbitrage.mjs');
const FX = (f) => path.join(HERE, 'fixtures', f);

function run(extra = [], profile = FX('profile-mini.json')) {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'soc-arb-'));
  const asof = extra.includes('--asof') ? [] : ['--asof', '2026-10-03']; // the CLI reads the first --asof
  const r = spawnSync(process.execPath, [SCRIPT, profile,
    '--h1b-csv', FX('h1b-mini.csv'), '--soc-csv', FX('soc-mini.csv'),
    '--out-dir', out, ...asof, ...extra], { encoding: 'utf8' });
  const files = fs.readdirSync(out);
  const jsonFile = files.find((f) => f.endsWith('.json'));
  const log = jsonFile ? JSON.parse(fs.readFileSync(path.join(out, jsonFile), 'utf8')) : null;
  const md = files.find((f) => f.endsWith('.md'));
  return { ...r, out, files, log, md: md ? fs.readFileSync(path.join(out, md), 'utf8') : null };
}
const framing = (log, id) => log.framings.find((f) => f.framing_id === id);

test('left-boundary probes: "Promotions" is not MOTION; "Designer, Motion Graphics" is', () => {
  const { status, log } = run();
  assert.equal(status, 0);
  const m = framing(log, 'motion');
  assert.equal(m.sponsorship.distinct_companies.value, 1);
  assert.deepEqual(m.sample_companies.map((c) => c.company), ['STUDIO CO']);
  assert.deepEqual(m.sample_companies[0].titles, ['Senior Designer, Motion Graphics']);
});

test('suffix-tolerant probes and quoted titles: "Product Designer" ~ PRODUCT DESIGN', () => {
  const { log } = run();
  assert.equal(framing(log, 'product-ux').sponsorship.distinct_companies.value, 1);
  assert.equal(log.universe.title_instances_total.value, 7); // incl. "Designer's Assistant"
});

test('counts distinct companies vs title instances', () => {
  const f = framing(run().log, 'frontend');
  assert.equal(f.sponsorship.distinct_companies.value, 2);
  assert.equal(f.sponsorship.title_instances.value, 3);
});

test('company-wide fields are labelled company-wide; title counts are lower bounds', () => {
  const f = framing(run().log, 'frontend');
  assert.equal(f.sponsorship.matched_cos_median_salary_all_roles.value, 165000);
  assert.equal(f.sponsorship.matched_cos_median_salary_all_roles.scope, 'company-wide');
  assert.equal(f.sponsorship.distinct_companies.bound, 'lower');
  assert.equal(f.soc_mapping.source, 'inferred');
});

test('TITLE_LIST_IS_A_SUMMARY fires with the derived count', () => {
  const { log } = run();
  assert.equal(log.universe.companies_with_more_approvals_than_listed_titles.value, 3);
  assert.ok(log.stop_conditions.some((s) => s.condition === 'TITLE_LIST_IS_A_SUMMARY'));
});

test('missing cognitive_pivot_score is reported missing, never imputed; --strict exits 2', () => {
  const { log } = run();
  const p = framing(log, 'product-ux');
  assert.equal(p.role_quality.cognitive_pivot_score.value, null);
  assert.equal(p.role_quality.cognitive_pivot_score.source, 'missing');
  assert.equal(p.scorable, false);
  assert.equal(run(['--strict']).status, 2);
});

test('staleness gate: closed at 372 days, open at 5 days', () => {
  assert.ok(run().log.stop_conditions.some((s) => s.condition === 'STALE_FUNDING_DATA'));
  const fresh = run(['--asof', '2025-10-01']);
  assert.ok(!fresh.log.stop_conditions.some((s) => s.condition === 'STALE_FUNDING_DATA'));
  assert.equal(framing(fresh.log, 'motion').sponsorship.companies_funded_within_window.value, 1);
});

test('unknown SOC + nonsense probe degrades honestly: 0 companies, UNSCORABLE, NO_SPONSORSHIP_RECORD', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'soc-arb-prof-'));
  const p = path.join(dir, 'p.json');
  fs.writeFileSync(p, JSON.stringify({ candidate: 'x', framings: [{ id: 'ghost', soc: '99-9999', title_probes: ['ZZQX'] }] }));
  const { status, log } = run([], p);
  assert.equal(status, 0);
  assert.equal(framing(log, 'ghost').sponsorship.distinct_companies.value, 0);
  const names = log.stop_conditions.map((s) => s.condition);
  assert.ok(names.includes('UNSCORABLE_FRAMING') && names.includes('NO_SPONSORSHIP_RECORD'));
});

test('malformed profile JSON fails legibly (exit 65) and writes nothing', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'soc-arb-bad-'));
  const p = path.join(dir, 'bad.json');
  fs.writeFileSync(p, '{ "framings": [ { "id": "x", ');
  const r = run([], p);
  assert.equal(r.status, 65);
  assert.match(r.stderr, /not valid JSON/);
  assert.doesNotMatch(r.stderr, /at JSON\.parse/); // no raw stack trace
  assert.equal(r.files.length, 0);
});

test('--dry-run writes nothing', () => {
  const r = run(['--dry-run']);
  assert.equal(r.status, 0);
  assert.equal(r.files.length, 0);
  assert.match(r.stdout, /DRY RUN/);
});

test('a claimable:false control framing is counted but never takes the headline', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'soc-arb-ctl-'));
  const p = path.join(dir, 'p.json');
  const prof = JSON.parse(fs.readFileSync(FX('profile-mini.json'), 'utf8'));
  prof.framings.find((f) => f.id === 'frontend').claimable = false;
  fs.writeFileSync(p, JSON.stringify(prof));
  const { log, md } = run([], p);
  assert.equal(framing(log, 'frontend').sponsorship.distinct_companies.value, 2); // still counted
  assert.equal(framing(log, 'frontend').claimable, false);
  assert.match(md, /2 different job titles .*plus 1 control title/);
  assert.doesNotMatch(md.split('## Run record')[0], /"Frontend" matched/);
  assert.match(md, /Frontend \*\(control\)\*/);
});

test('a second run on the same as-of date gets -002 and never overwrites -001', () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'soc-arb-seq-'));
  const args = [SCRIPT, FX('profile-mini.json'), '--h1b-csv', FX('h1b-mini.csv'),
    '--soc-csv', FX('soc-mini.csv'), '--out-dir', out, '--asof', '2026-10-03'];
  spawnSync(process.execPath, args);
  const first = fs.readFileSync(path.join(out, 'soc-arbitrage-2026-10-03-001.json'), 'utf8');
  spawnSync(process.execPath, args);
  assert.deepEqual(fs.readdirSync(out).filter((f) => f.endsWith('.json')).sort(),
    ['soc-arbitrage-2026-10-03-001.json', 'soc-arbitrage-2026-10-03-002.json']);
  assert.equal(fs.readFileSync(path.join(out, 'soc-arbitrage-2026-10-03-001.json'), 'utf8'), first);
});

// niche-coverage.py — Python; on Windows `python3` is the Microsoft Store stub.
const PY = process.platform === 'win32' ? 'python' : 'python3';
const NICHE = path.join(HERE, 'niche-coverage.py');
function niche(list) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'soc-arb-niche-'));
  const p = path.join(dir, 'n.json');
  fs.writeFileSync(p, JSON.stringify({ employers: list }));
  return spawnSync(PY, [NICHE, p, '--h1b-csv', FX('h1b-mini.csv')], { encoding: 'utf8' });
}

test('niche-coverage: whole-word match, H-1B record flag, absent names reported', () => {
  const r = niche(['STUDIO CO', 'PROMO', 'PROM', 'NOSPONSOR CO', 'ZZQX']);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /\| STUDIO CO \| yes \| STUDIO CO \| 2025-06-01 \| yes \| 40\.0 \|/);
  assert.match(r.stdout, /\| NOSPONSOR CO \| yes \| NOSPONSOR CO \| 2025-09-26 \| no \|/);
  assert.match(r.stdout, /\| PROM \| no \|/); // "PROM" must not match "PROMO CO"
  assert.match(r.stdout, /5 targets \| 3 in file \| 2 with any H-1B record \| 2 absent/);
});

test('niche-coverage: empty list fails legibly (exit 65)', () => {
  const r = niche([]);
  assert.equal(r.status, 65);
  assert.match(r.stderr, /non-empty list/);
});

test('human report opens with an executive summary (P9) before any table', () => {
  const { md } = run();
  const es = md.indexOf('## Executive summary');
  assert.ok(es > 0 && es < md.indexOf('|'));
});
