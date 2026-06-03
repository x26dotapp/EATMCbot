export const DEFAULT_ALLOWED_GROUPS = ["EarthALiENtim", "EarthALiENspace"];

const GROUP_CHAT_TYPES = new Set(["group", "supergroup"]);

export function normalizeChatRef(value) {
  const ref = String(value || "").trim();
  if (!ref) return "";

  if (/^-?\d+$/.test(ref)) return ref;

  const withoutProtocol = ref.replace(/^https?:\/\/t\.me\//i, "");
  const withoutMention = withoutProtocol.replace(/^@/, "");
  return withoutMention.split(/[/?#]/)[0].toLowerCase();
}

export function parseAllowedGroups(value) {
  const rawGroups = value?.trim() ? value.split(",") : DEFAULT_ALLOWED_GROUPS;
  return new Set(rawGroups.map(normalizeChatRef).filter(Boolean));
}

export function isGroupChat(chat) {
  return GROUP_CHAT_TYPES.has(chat?.type);
}

export function chatRefs(chat) {
  const refs = new Set();

  if (chat?.id !== undefined && chat?.id !== null) {
    refs.add(String(chat.id));
  }

  const username = normalizeChatRef(chat?.username);
  if (username) refs.add(username);

  return refs;
}

export function isAllowedChat(chat, allowedGroups) {
  if (!isGroupChat(chat)) return true;

  for (const ref of chatRefs(chat)) {
    if (allowedGroups.has(ref)) return true;
  }

  return false;
}

export function shouldLeaveChat(chat, allowedGroups) {
  return isGroupChat(chat) && !isAllowedChat(chat, allowedGroups);
}

export function describeAllowedGroups(allowedGroups) {
  return [...allowedGroups]
    .map((group) => (/^-?\d+$/.test(group) ? group : `@${group}`))
    .join(", ");
}
