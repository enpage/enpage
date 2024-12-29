import { Type, type Static } from "@sinclair/typebox";

const googleOAuthTokenSchema = Type.Object({
  access_token: Type.String(),
  token_type: Type.String(), // Usually "Bearer"
  expires_in: Type.Number(), // Seconds until token expires, typically 3600 (1 hour)
  refresh_token: Type.Optional(Type.String()), // Only present in first OAuth exchange
  scope: Type.String(), // Space-separated list of granted scopes
  id_token: Type.Optional(Type.String()), // JWT token containing user info, if requested
});

export type GoogleOAuthToken = Static<typeof googleOAuthTokenSchema>;

// You might also want to define the decoded id_token structure:
const googleIdTokenSchema = Type.Object({
  iss: Type.String(), // Issuer (usually 'https://accounts.google.com')
  sub: Type.String(), // Unique Google ID for the user
  aud: Type.String(), // Your client ID
  iat: Type.Number(), // Issued at (timestamp)
  exp: Type.Number(), // Expiration time (timestamp)
  email: Type.Optional(Type.String()),
  email_verified: Type.Optional(Type.Boolean()),
  name: Type.Optional(Type.String()),
  picture: Type.Optional(Type.String()),
  given_name: Type.Optional(Type.String()),
  family_name: Type.Optional(Type.String()),
  locale: Type.Optional(Type.String()),
});

export type GoogleIdToken = Static<typeof googleIdTokenSchema>;
