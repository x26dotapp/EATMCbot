import { parseAllowedGroups } from "./access-control.js";
import { createBotHandlers } from "./bot-handlers.js";

const token = process.env.TELEGRAM_BOT_TOKEN;
const botName = process.env.BOT_NAME || "EarthALiEN Mission Control";
const keepLimit = Number.parseInt(process.env.ALERT_KEEP_LIMIT || "10", 10);
const allowedGroups = parseAllowedGroups(process.env.ALLOWED_TELEGRAM_GROUPS);

if (!token || token === "replace_with_your_bot_token") {
  console.error("Missing TELEGRAM_BOT_TOKEN. Set it in your environment or local .env runner.");
  process.exit(1);
}

const apiBase = `https://api.telegram.org/bot${token}`;
let offset = 0;

async function telegram(method, payload = {}) {
  const response = await fetch(`${apiBase}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (!data.ok) {
    throw new Error(`${method} failed: ${data.description || "unknown Telegram error"}`);
  }
  return data.result;
}

async function sendMessage(chatId, text) {
  return telegram("sendMessage", {
    chat_id: chatId,
    text,
    disable_web_page_preview: true
  });
}

async function leaveChat(chatId) {
  return telegram("leaveChat", {
    chat_id: chatId
  });
}

const handlers = createBotHandlers({
  allowedGroups,
  botName,
  keepLimit,
  sendMessage,
  leaveChat
});

async function poll() {
  while (true) {
    try {
      const updates = await telegram("getUpdates", {
        offset,
        timeout: 30,
        allowed_updates: ["message", "my_chat_member"]
      });

      for (const update of updates) {
        offset = update.update_id + 1;
        await handlers.handleUpdate(update);
      }
    } catch (error) {
      console.error(error.message);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
}

await telegram("setMyCommands", {
  commands: [
    { command: "orbit", description: "Show current token price and status" },
    { command: "buys", description: "Show the latest buys" },
    { command: "radar", description: "Scan tracked token activity" },
    { command: "set_token", description: "Set the group token contract" },
    { command: "tokens", description: "List tracked tokens" },
    { command: "settings", description: "Configure alerts and cleanup" },
    { command: "help", description: "Show bot commands" }
  ]
});

console.log(`${botName} polling started.`);
await poll();
