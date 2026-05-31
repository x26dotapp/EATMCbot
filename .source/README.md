# EATMCbot Source

This folder contains starter source for EarthALiEN Mission Control Bot.

This folder is public if committed to GitHub. Keep all secrets out of source control.

## Local Setup

1. Copy `.env.example` to `.env`.
2. Set `TELEGRAM_BOT_TOKEN` locally.
3. Run:

```bash
npm install
npm start
```

The starter bot uses Telegram long polling and does not require a webhook.

## Security

Never commit:

- Telegram bot tokens.
- API keys.
- Private keys.
- Seed phrases.
- Production database credentials.
