# EarthALiEN Mission Control Bot

EarthALiEN Mission Control Bot is a Telegram helper for EarthALiENtim token communities.

Bot: [@EATMCbot](https://t.me/EATMCbot)

It is designed to act like a friendly launchpad-aware market bot for tokens that may not be listed on major price sites yet. The bot can show token status, recent buys, price snapshots, and clean group alerts without flooding the chat.

## What It Does

- Tracks early token activity for EarthALiENtim communities.
- Shows current token price/status when requested.
- Displays recent buys while keeping the chat clean.
- Keeps only a limited recent alert history instead of endless buy spam.
- Supports launchpad-style tokens before graduation.
- Gives group admins simple commands to configure tracked tokens.

## Telegram Commands

These are the planned public commands for the bot:

```text
/orbit       Show current token price and status
/buys        Show the latest buys
/radar       Scan tracked token activity
/set_token   Set the group token contract
/tokens      List tracked tokens
/settings    Configure alerts and cleanup
/help        Show bot commands
```

## How To Use

1. Open [@EATMCbot](https://t.me/EATMCbot) on Telegram.
2. Start the bot with `/start`.
3. Add it to your Telegram group.
4. Give the bot permission to post messages.
5. Use `/set_token` to configure the token for the group.
6. Use `/orbit`, `/buys`, or `/radar` to check activity.

For clean chat behavior, the bot is intended to keep only the newest buy/activity messages visible, such as the latest 10 buy alerts, and remove older bot alerts when possible.

## Privacy

Privacy policy: [PrivacyPolicy.md](./PrivacyPolicy.md)

Short version: the bot is designed to avoid collecting personal data, does not ask for wallet private keys or seed phrases, and does not sell data.

## Source

Starter source code is kept in the `.source` folder.

Important: `.source` is dot-prefixed for organization only. In a public GitHub repository, it is still public. Do not place bot tokens, API keys, private keys, seed phrases, or deployment secrets in this repository.

## Status

This repository is the public home for EATMCbot documentation, assets, privacy policy, and starter bot source.
