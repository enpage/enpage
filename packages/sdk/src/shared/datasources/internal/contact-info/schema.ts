import { Type, type Static } from "@sinclair/typebox";
import { links } from "../links/schema";

export const contactInfo = Type.Object({
  email: Type.String({ format: "email" }),
  phone: Type.String(),
  address: Type.String(),
  socialLinks: links,
});

export type ContactInfo = Static<typeof contactInfo>;
