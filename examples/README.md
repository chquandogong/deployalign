# Example document sets

Three synthetic sets you can compile immediately — no credentials, no model. Each folder
holds one customer note, one sales proposal and one engineering review; the role comes
from the file name (`customer*`, `sales*`, `engineering*` or `고객*`, `영업*`, `엔지니어링*`).

| Folder | Language | What it shows | Expected verdict |
| --- | --- | --- | --- |
| `hospital-delivery-robot/` | English | "every ward … autonomously" against six mapped wards and an unmeasured lift door | `FAIL` — DA-001, DA-002, DA-004, DA-005, DA-006 |
| `warehouse-amr/` | English | a bounded, evidenced proposal with completed tests | `PASS` — no diagnostics |
| `sub-fab-raman-ko/` | Korean | the Raman fixture in Korean: quantifiers after nouns, attached counters (`12곳의`), verbatim Korean patch values | `FAIL` — DA-001 … DA-006 |

```bash
pnpm exec deployalign compile examples/hospital-delivery-robot --out /tmp/da --fail-on blocker
pnpm exec deployalign compile examples/warehouse-amr
pnpm exec deployalign compile examples/sub-fab-raman-ko --json | head -40
```

Or paste the three texts into the UI with `ALLOW_CUSTOM_ARTIFACTS=true pnpm dev`. All content is
fictional; none of it describes a real customer, site or vendor.
