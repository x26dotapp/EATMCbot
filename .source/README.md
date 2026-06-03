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

## Official Group Guard

By default, the bot only stays in these Telegram groups:

```text
@EarthALiENtim
@EarthALiENspace
```

If the bot is added to another group or supergroup, it sends a short notice and
leaves by itself. It listens for Telegram `my_chat_member` updates so it can
leave immediately after being added.

Use `ALLOWED_TELEGRAM_GROUPS` to change the allowlist:

```text
ALLOWED_TELEGRAM_GROUPS=EarthALiENtim,EarthALiENspace
```

Private groups can be allowed by numeric chat ID:

```text
ALLOWED_TELEGRAM_GROUPS=EarthALiENtim,-1001234567890
```

## Security

Never commit:

- Telegram bot tokens.
- API keys.
- Private keys.
- Seed phrases.
- Production database credentials.
