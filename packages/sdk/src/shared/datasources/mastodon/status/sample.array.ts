import type { MastodonStatusArraySchema } from "./schema";

export const sample = [
  {
    account: {
      acct: "Gargron",
      avatar: "https://files.mastodon.social/accounts/avatars/000/000/001/original/7b7e3c3e3e7e3e3e.png",
      avatar_static:
        "https://files.mastodon.social/accounts/avatars/000/000/001/original/7b7e3c3e3e7e3e3e.png",
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
      id: "1",
      url: "https://mastodon.social/@Gargron",
      username: "Gargron",
      discoverable: true,
      fields: [],
      followers_count: 100,
      following_count: 100,
      group: false,
      header: "https://files.mastodon.social/accounts/headers/000/000/001/original/7b7e3c3e3e7e3e3e.png",
      header_static:
        "https://files.mastodon.social/accounts/headers/000/000/001/original/7b7e3c3e3e7e3e3e.png",
      last_status_at: "2021-06-26T18:00:00",
      locked: false,
      note: "Admin of mastodon.social",
      noindex: false,
      statuses_count: 100,
      suspended: false,
    },
    content: "Hello, world!",
    created_at: "2021-06-26T18:00:00",
    id: "1",
    media_attachments: [],
    reblogs_count: 0,
    replies_count: 0,
    favourites_count: 0,
    tags: [],
    uri: "https://mastodon.social/@Gargron/1",
    visibility: "public",
    sensitive: false,
    application: {
      name: "Mastodon",
      website: "https://joinmastodon.org",
    },
    mentions: [],
    emojis: [],
    url: "https://mastodon.social/@Gargron/1",
  },
] satisfies MastodonStatusArraySchema;
