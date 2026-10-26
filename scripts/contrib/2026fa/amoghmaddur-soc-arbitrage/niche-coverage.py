"""niche-coverage.py — are the employers in my niche even in the file?

The SOC-arbitrage scorer ranks titles across every company in the 80 Days file.
That says nothing about the handful of employers a candidate actually targets.
This script takes the candidate's own list of niche employers and reports, for
each, whether the file contains it and whether it carries any H-1B record.
It counts; it does not judge. The list itself is the candidate's judgment.

    python scripts/contrib/2026fa/amoghmaddur-soc-arbitrage/niche-coverage.py \
        search/examples/ishaan-varma/niche-employers.json

Matching: whole-word, case-insensitive, against `company_name`
("LUMA AI" matches "LUMA AI INC"; "PIKA" does not match "PIKACHU LLC").
Output is ASCII-only: Windows consoles default to cp1252, where the first
version crashed on a non-ASCII character.
Exit codes: 0 ok, 65 bad input file.
"""
import argparse
import csv
import json
import re
import sys

H1B = "data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv"


def die(msg):
    print("niche-coverage: " + msg, file=sys.stderr)
    sys.exit(65)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("employers", help="JSON file with an `employers` list of names")
    ap.add_argument("--h1b-csv", default=H1B)
    a = ap.parse_args()

    try:
        with open(a.employers, encoding="utf-8") as fh:
            names = json.load(fh).get("employers")
    except (OSError, ValueError) as e:
        die("cannot read " + a.employers + " (" + e.__class__.__name__ + ")")
    if not isinstance(names, list) or not names:
        die("`employers` must be a non-empty list")

    csv.field_size_limit(10**7)
    with open(a.h1b_csv, encoding="utf-8", newline="") as fh:
        rows = list(csv.DictReader(fh))

    print("| Target | In file | Matched company | Latest funding | H-1B record | Approvals |")
    print("|---|---|---|---|---|---:|")
    found = with_record = 0
    for n in names:
        pat = re.compile(r"(?<![A-Z0-9])" + re.escape(n.upper()) + r"(?![A-Z0-9])")
        hits = [r for r in rows if pat.search(r["company_name"].upper())]
        if not hits:
            print(f"| {n} | no | - | - | - | - |")
            continue
        found += 1
        rec = [r for r in hits if (r["top_job_titles_sponsored"] or "").strip()]
        with_record += bool(rec)
        for r in hits:
            has = "yes" if (r["top_job_titles_sponsored"] or "").strip() else "no"
            print(f"| {n} | yes | {r['company_name']} | {r['latest_funding_date'] or '-'} | {has} | {r['Total Approvals'] or '-'} |")
    print()
    print(f"{len(names)} targets | {found} in file | {with_record} with any H-1B record | "
          f"{len(names) - found} absent (absent != does not sponsor; the file is Form D filers only)")


if __name__ == "__main__":
    main()
