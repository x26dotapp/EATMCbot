const token = process.env.TELEGRAM_BOT_TOKEN;
const botName = process.env.BOT_NAME || "EarthALiEN Mission Control";
const keepLimit = Number.parseInt(process.env.ALERT_KEEP_LIMIT || "10", 10);

if (!token || token === "replace_with_your_bot_token") {
  console.error("Missing TELEGRAM_BOT_TOKEN. Set it in your environment or local .env runner.");
  process.exit(1);
}

const apiBase = `https://api.telegram.org/bot${token}`;
let offset = 0;

const helpText = [
  `${botName}`,
  "",
  "Commands:",
  "/orbit - Show current token price and status",
  "/buys - Show the latest buys",
  "/radar - Scan tracked token activity",
  "/set_token - Set the group token contract",
  "/tokens - List tracked tokens",
  "/settings - Configure alerts and cleanup",
  "/help - Show bot commands",
  "",
  `Clean chat target: keep the latest ${keepLimit} buy alerts visible when cleanup is enabled.`
].join("\n");

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

async function handleMessage(message) {
  const chatId = message.chat?.id;
  const text = message.text?.trim();

  if (!chatId || !text) return;

  const command = text.split(/\s+/)[0].split("@")[0].toLowerCase();

  if (command === "/start" || command === "/help") {
    await sendMessage(chatId, helpText);
    return;
  }

  if (command === "/orbit") {
    await sendMessage(chatId, "Orbit scan placeholder: price and launch status feed is not connected yet.");
    return;
  }

  if (command === "/buys") {
    await sendMessage(chatId, `Buy feed placeholder: latest ${keepLimit} buys will appear here once tracking is connected.`);
    return;
  }

  if (command === "/radar") {
    await sendMessage(chatId, "Radar placeholder: token activity scanner is not connected yet.");
    return;
  }

  if (command === "/set_token") {
    await sendMessage(chatId, "Token setup placeholder: persistent group settings are not connected yet.");
    return;
  }

  if (command === "/tokens") {
    await sendMessage(chatId, "Tracked tokens placeholder: no persistent token registry is connected yet.");
    return;
  }

  if (command === "/settings") {
    await sendMessage(chatId, `Settings placeholder: alert cleanup target is ${keepLimit} recent buy alerts.`);
  }
}

async function poll() {
  while (true) {
    try {
      const updates = await telegram("getUpdates", {
        offset,
        timeout: 30,
        allowed_updates: ["message"]
      });

      for (const update of updates) {
        offset = update.update_id + 1;
        await handleMessage(update.message);
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
