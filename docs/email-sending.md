# Email sending (Workspace service account)

Lead Studio sends outbound lead email through **lead-studio-express-server** using a Google Cloud **service account** with **domain-wide delegation** (Google Workspace). There is no per-user “Connect Gmail” step in the web app.

## Required server environment

Set these on **lead-studio-express-server** (see also `src/services/email/README.md` in that repo):

| Variable | Required | Description |
|----------|----------|-------------|
| `GMAIL_SERVICE_ACCOUNT_JSON_PATH` | One of these | Path to your downloaded `.json` key file (easiest for local dev) |
| `GMAIL_SERVICE_ACCOUNT_JSON` | One of these | Minified JSON string on one line |
| `GMAIL_SERVICE_ACCOUNT_JSON_BASE64` | One of these | Base64-encoded JSON (Railway). Leave unset if you use PATH or JSON |
| `GMAIL_SEND_AS_EMAIL` | Yes | Default Workspace mailbox to impersonate when no From identity is selected |

Optional:

- Per-identity env vars from `email_sending_identities` rows (`send_as_env_key` → address)
- `GMAIL_PUBSUB_TOPIC` + `gmail.readonly` scope for reply detection
- `EMAIL_OPEN_TRACKING_BASE_URL` for open pixels
- `CRON_SECRET` for `POST /api/email/test` and research workers

## Google Workspace setup (summary)

1. Enable **Gmail API** on your GCP project.
2. Create a service account and download a JSON key.
3. In Google Admin → **Domain-wide delegation**, add the service account **Client ID** with scopes:
   - `https://www.googleapis.com/auth/gmail.send`
   - `https://www.googleapis.com/auth/gmail.readonly` (if using push / reply tracking)
4. Set `GMAIL_SEND_AS_EMAIL` to a real user in that domain.
5. Restart express; send a draft from Lead Studio or smoke-test:

```bash
curl -X POST http://localhost:3032/api/email/test \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CRON_SECRET" \
  -d '{"to":"you@example.com","subject":"Lead Studio test"}'
```

## Web app configuration

```env
NEXT_PUBLIC_SERVER_URL=http://localhost:3032
```

The browser calls Express directly for send-now, queue, and drafts. Secrets stay on the server only.
