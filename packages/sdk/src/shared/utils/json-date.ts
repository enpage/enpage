import { Type, type TSchema, type StaticDecode, type StaticEncode } from "@sinclair/typebox";

export const jsonDate = Type.Transform(Type.String({ format: "date-time" }))
  .Decode((value) => new Date(value)) // decode: number to Date
  .Encode((value) => value.toISOString());

export type JsonDateObj = StaticDecode<typeof jsonDate>;
export type JsonDateStr = StaticEncode<typeof jsonDate>;
