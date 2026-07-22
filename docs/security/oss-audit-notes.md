# OSS security audit notes (web)

Summary pass for Lead Studio web open source. Not a penetration test.

## Threat model

- Primary: solo/trusted operator on localhost.
- `NEXT_PUBLIC_SERVER_URL` is public in the client bundle.

## Findings

| Severity | Area | Note |
|----------|------|------|
| Info | Auth | No app login; relies on express dev bypass locally |
| Low | Production | README + SECURITY.md state express must enforce auth before wider deploy |

## Recommended before production

- HTTPS, auth on express, restrict CORS
- Optional `security.txt` on deployed domain

Full checklists: mentorai-server `data/open-source/`.
