"""Build index.html from base.html + one file per concept. Run: python3 build.py"""
import json, glob, os
D = os.path.dirname(os.path.abspath(__file__))
rd = lambda p: open(os.path.join(D, p), encoding="utf-8").read()
concepts = [rd(f"concepts/{os.path.basename(p)}").strip() for p in sorted(glob.glob(f"{D}/concepts/*.js"))]
res = {str(int(os.path.basename(p)[:2])): json.load(open(p)) for p in sorted(glob.glob(f"{D}/resources/*.json"))}
vis = [open(p, encoding="utf-8").read() for p in sorted(glob.glob(f"{D}/visuals/*.js"))]
out = rd("base.html").replace("/*@@CONCEPTS@@*/", ",\n".join(concepts)) \
    .replace("/*@@RESOURCES@@*/", json.dumps(res, ensure_ascii=False)).replace("/*@@VISUALS@@*/", "\n".join(vis))
open(os.path.join(D, "index.html"), "w", encoding="utf-8").write(out)
print("built", len(concepts), "concepts,", len(vis), "visuals,", len(out), "bytes")
