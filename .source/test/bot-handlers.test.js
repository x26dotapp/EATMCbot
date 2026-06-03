import assert from "node:assert/strict";
import test from "node:test";

import { createBotHandlers } from "../src/bot-handlers.js";
import { parseAllowedGroups } from "../src/access-control.js";

function createTestHandlers() {
  const sentMessages = [];
  const leftChats = [];

  const handlers = createBotHandlers({
    allowedGroups: parseAllowedGroups("EarthALiENtim,EarthALiENspace"),
    botName: "EarthALiEN Mission Control",
    keepLimit: 10,
    sendMessage: async (chatId, text) => sentMessages.push({ chatId, text }),
    leaveChat: async (chatId) => leftChats.push(chatId),
    logger: { warn() {} }
  });

  return { handlers, sentMessages, leftChats };
}

test("leaves an unauthorized group as soon as the bot is added", async () => {
  const { handlers, sentMessages, leftChats } = createTestHandlers();

  await handlers.handleUpdate({
    my_chat_member: {
      chat: { type: "supergroup", id: -1003, username: "RandomTokenGroup" },
      new_chat_member: { status: "member" }
    }
  });

  assert.deepEqual(leftChats, [-1003]);
  assert.match(sentMessages[0].text, /official EarthALiENtim groups/i);
});

test("does not leave official groups", async () => {
  const { handlers, sentMessages, leftChats } = createTestHandlers();

  await handlers.handleUpdate({
    my_chat_member: {
      chat: { type: "supergroup", id: -1001, username: "EarthALiENtim" },
      new_chat_member: { status: "member" }
    }
  });

  assert.deepEqual(leftChats, []);
  assert.deepEqual(sentMessages, []);
});

test("leaves an unauthorized group when it receives a later command there", async () => {
  const { handlers, leftChats } = createTestHandlers();

  await handlers.handleUpdate({
    message: {
      chat: { type: "group", id: -1004, username: "AnotherGroup" },
      text: "/orbit"
    }
  });

  assert.deepEqual(leftChats, [-1004]);
});
