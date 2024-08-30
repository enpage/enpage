import type { MastodonAccountSchema } from "./schema";

export const sample = {
  acct: "Gargron",
  avatar: "https://files.mastodon.social/accounts/avatars/000/000/001/original/7b7e3c3e3e7e3e3e.png",
  avatar_static: "https://files.mastodon.social/accounts/avatars/000/000/001/original/7b7e3c3e3e7e3e3e.png",
  bot: false,
  created_at: "2016-04-04T17:41:54.000Z",
  display_name: "Eugen",
  emojis: [
    {
      category: "custom",
      shortcode: "blobawave",
      static_url: "https://files.mastodon.social/custom_emojis/images/000/000/001/static/1f4a9.png",
      url: "https://files.mastodon.social/custom_emojis/images/000/000/001/original/1f4a9.png",
      visible_in_picker: true,
    },
  ],
} as MastodonAccountSchema;
