# Security

## Supported use

**Local / trusted development** is the primary assumption for this open-source web app: you run Next and [lead-studio-express-server](https://github.com/lead-open-source/lead-studio-express-server) on your machine or a controlled network. See the **“Local development and trust”** section in `README.md` for env vars, client vs server secrets, and where HTTP traffic is sent.

## Reporting a vulnerability

Use one of the following (pick what applies to your fork or deployment). **Do not** post exploit details in public issues before a fix is coordinated.

### 1. GitHub private security advisories (preferred for repos on GitHub)

1. Open this repository on GitHub.
2. Go to the **Security** tab.
3. Use **Report a vulnerability** (private submission).

Repository owners must enable **private vulnerability reporting** for the repo or organization if that button is not visible. See GitHub’s docs: [Privately reporting a security vulnerability](https://docs.github.com/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability).

### 2. Maintainer email (optional; forks should set this)

If private advisories are unavailable or you need an alternate channel, **edit this file** and add a working address—for example:

`mailto:security@your-domain.org`

Remove this subsection entirely if you rely only on GitHub private advisories.

### 3. `security.txt` (optional; production sites)

For deployed web apps, consider publishing a [`security.txt`](https://securitytxt.org/) file so scanners and researchers can find your policy—for example at `https://<your-domain>/.well-known/security.txt`. This repo does not ship that file by default; add it in your hosting project if needed.

## Scope and limitations

- This document does not replace a professional security assessment for production or multi-tenant deployments.
- **Client bundle** (`NEXT_PUBLIC_*`) and **`src/api`** behavior are only one layer; **Express** (and any **`app/api`** routes you add) must enforce authentication, authorization, rate limits, and safe outbound requests for your threat model.

## Versions

Security fixes are applied to the **default branch** unless maintainers publish a separate support policy. When in doubt, use the latest commit or tagged release.

Disclosure timeline for this OSS project is **best-effort** unless maintainers publish a stricter SLA.
