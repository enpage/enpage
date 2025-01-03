import { Type, type Static } from "@sinclair/typebox";
import { linksSchema } from "../links/schema";

export const contactInfoSchema = Type.Object(
  {
    email: Type.String({ format: "email" }),
    phone: Type.Optional(Type.String()),
    companyName: Type.Optional(Type.String()),
    firstName: Type.Optional(Type.String()),
    lastName: Type.Optional(Type.String()),
    url: Type.Optional(Type.String({ format: "uri" })),
    address: Type.Optional(Type.String()),
    socialLinks: linksSchema,
  },
  {
    description: "A generic schema representing a person or company contact information",
  },
);

export type ContactInfo = Static<typeof contactInfoSchema>;
