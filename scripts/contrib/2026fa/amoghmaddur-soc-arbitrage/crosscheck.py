"""crosscheck.py — independent re-count for soc-arbitrage.mjs.

Shares no code with the Node scorer: stdlib `csv` instead of a hand-rolled
reader, `ast.literal_eval` instead of a regex for the Python-repr title lists,
and its own matcher written from the recipe's rule (left-boundary,
suffix-tolerant). If both agree on every count, a parser bug in either would
have to be the same bug twice.

    python scripts/contrib/2026fa/amoghmaddur-soc-arbitrage/crosscheck.py \
        search/examples/ishaan-varma/soc-arbitrage-framings.json \
        --against <agent-log.json>

Exit 0 when every compared count matches, 1 on any mismatch.
"""
import argparse
import ast
import csv
import json
import re
import sys

H1B = "data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv"
SOC = "data/bls/compact/soc_occupation_compact.csv"


def titles(cell):
    cell = (cell or "").strip()
    return list(ast.literal_eval(cell)) if cell else []


def matcher(probes):
    pats = [re.compile(r"(?<![A-Z])" + re.escape(p.upper())) for p in probes]
    return lambda t: any(p.search(t.upper()) for p in pats)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("profile")
    ap.add_argument("--against", help="agent JSON from soc-arbitrage.mjs to compare")
    ap.add_argument("--h1b-csv", default=H1B)
    ap.add_argument("--soc-csv", default=SOC)
    a = ap.parse_args()

    csv.field_size_limit(10**7)
    with open(a.h1b_csv, encoding="utf-8", newline="") as fh:
        rows = list(csv.DictReader(fh))
    with open(a.soc_csv, encoding="utf-8", newline="") as fh:
        soc = list(csv.DictReader(fh))
    with open(a.profile, encoding="utf-8") as fh:
        prof = json.load(fh)

    sp = [r for r in rows if (r["top_job_titles_sponsored"] or "").strip()]
    mine = {
        "universe.companies_total": len(rows),
        "universe.companies_with_any_h1b_history": len(sp),
        "universe.title_instances_total": sum(len(titles(r["top_job_titles_sponsored"])) for r in sp),
        "universe.companies_with_more_approvals_than_listed_titles": sum(
            1 for r in sp
            if float(r["Total Approvals"] or 0) > len(titles(r["top_job_titles_sponsored"]))),
        "universe.soc_rows_without_cognitive_pivot_score": sum(
            1 for r in soc if not (r["cognitive_pivot_score"] or "").strip()),
    }
    for f in prof["framings"]:
        hit = matcher(f["title_probes"])
        cos, n = set(), 0
        for r in sp:
            k = sum(1 for t in titles(r["top_job_titles_sponsored"]) if hit(t))
            if k:
                cos.add(r["company_name"])
                n += k
        mine[f["id"] + ".distinct_companies"] = len(cos)
        mine[f["id"] + ".title_instances"] = n

    theirs = {}
    if a.against:
        with open(a.against, encoding="utf-8") as fh:
            log = json.load(fh)
        for k, v in log["universe"].items():
            theirs["universe." + k] = v["value"]
        for f in log["framings"]:
            for k in ("distinct_companies", "title_instances"):
                theirs[f["framing_id"] + "." + k] = f["sponsorship"][k]["value"]

    bad = 0
    for k, v in mine.items():
        if k in theirs:
            ok = theirs[k] == v
            bad += not ok
            print(f"{'MATCH   ' if ok else 'MISMATCH'} {k:<62} python={v:<6} node={theirs[k]}")
        else:
            print(f"         {k:<62} python={v}")
    if a.against:
        print(f"{len([k for k in mine if k in theirs])} compared, {bad} mismatch(es)")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
