import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_ALLOWED_GROUPS,
  isAllowedChat,
  normalizeChatRef,
  parseAllowedGroups,
  shouldLeaveChat
} from "../src/access-control.js";

test("defaults to the official EarthALiENtim Telegram groups", () => {
  const allowedGroups = parseAllowedGroups("");

  assert.deepEqual([...allowedGroups], DEFAULT_ALLOWED_GROUPS.map((group) => group.toLowerCase()));
});

test("normalizes Telegram group usernames and t.me links", () => {
  assert.equal(normalizeChatRef("@EarthALiENtim"), "earthalientim");
  assert.equal(normalizeChatRef("https://t.me/EarthALiENspace"), "earthalienspace");
  assert.equal(normalizeChatRef("-1001234567890"), "-1001234567890");
});

test("allows private chats and official groups", () => {
  const allowedGroups = parseAllowedGroups("EarthALiENtim,EarthALiENspace");

  assert.equal(isAllowedChat({ type: "private", id: 1 }, allowedGroups), true);
  assert.equal(isAllowedChat({ type: "supergroup", id: -1001, username: "EarthALiENtim" }, allowedGroups), true);
  assert.equal(isAllowedChat({ type: "group", id: -1002, username: "EarthALiENspace" }, allowedGroups), true);
});

test("marks unauthorized groups for leaving", () => {
  const allowedGroups = parseAllowedGroups("EarthALiENtim,EarthALiENspace");

  assert.equal(shouldLeaveChat({ type: "supergroup", id: -1003, username: "RandomTokenGroup" }, allowedGroups), true);
});

test("allows explicit private group IDs when configured", () => {
  const allowedGroups = parseAllowedGroups("EarthALiENtim,-1009876543210");

  assert.equal(shouldLeaveChat({ type: "supergroup", id: -1009876543210 }, allowedGroups), false);
  assert.equal(shouldLeaveChat({ type: "supergroup", id: -1001111111111 }, allowedGroups), true);
});
