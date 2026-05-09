# Security documentation index

This folder exists so security-related notes have a stable path in the tree. **Authoritative policy for this repo:**

| Document | Purpose |
|----------|---------|
| **[`SECURITY.md`](../../SECURITY.md)** (repo root) | How to report vulnerabilities, GitHub advisories, optional email / `security.txt`, scope limits |
| **[`README.md`](../../README.md)** — *Local development and trust* | Threat model for local dev, `NEXT_PUBLIC_*`, where HTTP traffic goes, production checklist |

There is no separate architecture diagram here; the root README carries deployment and trust-boundary context for now.

For HTTP client code, see **`src/api/README.md`**.

**Full tree of per-folder docs:** root **`README.md`** → *Documentation map* (links to every **`src/*/README.md`**). Entry point for **`docs/`** only: **[`../README.md`](../README.md)** (this folder’s hub).
