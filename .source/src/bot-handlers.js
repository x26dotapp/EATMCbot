import { describeAllowedGroups, shouldLeaveChat } from "./access-control.js";

const ACTIVE_CHAT_MEMBER_STATUSES = new Set(["member", "administrator", "restricted"]);

export function createBotHandlers({
  allowedGroups,
  botName,
  keepLimit,
  sendMessage,
  leaveChat,
  logger = console
}) {
  const allowedGroupsText = describeAllowedGroups(allowedGroups);
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
    `Official groups only: ${allowedGroupsText}`,
    `Clean chat target: keep the latest ${keepLimit} buy alerts visible when cleanup is enabled.`
  ].join("\n");

  async function leaveUnauthorizedChat(chat) {
    if (!chat?.id) return;

    try {
      await sendMessage(
        chat.id,
        `EarthALiEN Mission Control is limited to official EarthALiENtim groups: ${allowedGroupsText}. Leaving this group now.`
      );
    } catch (error) {
      logger.warn?.(`Could not notify unauthorized chat ${chat.id}: ${error.message}`);
    }

    await leaveChat(chat.id);
    logger.warn?.(`Left unauthorized chat ${chat.id}${chat.username ? ` (@${chat.username})` : ""}.`);
  }

  async function guardChat(chat) {
    if (!shouldLeaveChat(chat, allowedGroups)) return false;
    await leaveUnauthorizedChat(chat);
    return true;
  }

  async function handleMessage(message) {
    const chatId = message?.chat?.id;
    const text = message?.text?.trim();

    if (!chatId) return;
    if (await guardChat(message.chat)) return;
    if (!text) return;

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

  async function handleMyChatMember(myChatMember) {
    const status = myChatMember?.new_chat_member?.status;
    if (!ACTIVE_CHAT_MEMBER_STATUSES.has(status)) return;
    await guardChat(myChatMember.chat);
  }

  async function handleUpdate(update) {
    if (update.my_chat_member) {
      await handleMyChatMember(update.my_chat_member);
    }

    if (update.message) {
      await handleMessage(update.message);
    }
  }

  return {
    helpText,
    handleMessage,
    handleMyChatMember,
    handleUpdate
  };
}
