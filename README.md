# Contact Form (Vercel-ready)

A simple contact form that sends messages to your Gmail inbox via a Vercel serverless function.

## Structure
```
.
├── api/
│   └── send.js       # Serverless function (POST /api/send)
├── index.html         # Static contact form
├── package.json
└── .env.example
```

## Deploy to Vercel

1. Push this folder to a GitHub repo (or drag-and-drop deploy on vercel.com).
2. Import the repo in Vercel.
3. Before/after the first deploy, go to **Project → Settings → Environment Variables** and add:
   - `EMAIL_USER` — your Gmail address
   - `EMAIL_PASS` — a Gmail **App Password** (see below), NOT your normal password
4. Redeploy (env var changes require a redeploy to take effect).

## Getting a Gmail App Password

Regular Gmail passwords won't work with nodemailer. You need an App Password:
1. Turn on 2-Step Verification on the Google account: https://myaccount.google.com/security
2. Go to https://myaccount.google.com/apppasswords
3. Create a new app password (name it e.g. "contact-form") and copy the 16-character code.
4. Use that as `EMAIL_PASS`.

## Local development

```bash
npm install
vercel dev
```

This runs the site locally with the `api/send.js` function working the same way it will on Vercel (requires the Vercel CLI: `npm i -g vercel`).

## Notes on what changed from the original

- `package.json` was empty — this is why the original deploy failed. It now lists `nodemailer` as a dependency.
- The original used a long-running Express server (`app.listen`), which doesn't run on Vercel's serverless platform. The mail-sending logic was moved into `api/send.js`, which Vercel automatically turns into a serverless function reachable at `/api/send`.
- The form's fetch call now points to `/api/send` instead of `/send`.
- The email's `from` field is set to your own `EMAIL_USER` (Gmail rejects/spoofs mail claiming to be "from" an address it doesn't control); the visitor's email is now used as `replyTo` instead, so hitting "reply" in your inbox still goes to them.
- Removed `express`, `cors`, and `dotenv` dependencies since they aren't needed for a single serverless function — Vercel injects environment variables automatically and same-origin requests don't need CORS.
