import { Type, type Static } from "@sinclair/typebox";

export const mastodonAccountSchema = Type.Object({
  id: Type.String(),
  username: Type.String(),
  acct: Type.String(),
  url: Type.String(),
  display_name: Type.Optional(Type.String()),
  note: Type.String(),
  avatar: Type.String(),
  avatar_static: Type.String(),
  header: Type.String(),
  header_static: Type.String(),
  locked: Type.Boolean(),
  fields: Type.Array(
    Type.Object({
      name: Type.String(),
      value: Type.String(),
      verified_at: Type.Optional(Type.String()),
    }),
  ),
  emojis: Type.Array(
    Type.Object({
      shortcode: Type.String(),
      url: Type.String(),
      static_url: Type.String(),
      visible_in_picker: Type.Boolean(),
      category: Type.Optional(Type.String()),
    }),
  ),
  bot: Type.Boolean(),
  group: Type.Boolean(),
  discoverable: Type.Union([Type.Boolean(), Type.Null()]),
  noindex: Type.Optional(Type.Boolean()),
  moved: Type.Optional(Type.String()),
  suspended: Type.Optional(Type.Boolean()),
  limited: Type.Optional(Type.Boolean()),
  created_at: Type.String(),
  last_status_at: Type.Optional(Type.String()),
  statuses_count: Type.Number(),
  followers_count: Type.Number(),
  following_count: Type.Number(),
});

export type MastodonAccountSchema = Static<typeof mastodonAccountSchema>;
