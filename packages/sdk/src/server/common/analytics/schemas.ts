import { z } from "zod";

// Schemas
export const BrowserInfoSchema = z.object({
  browser: z.string(),
  os: z.string(),
  device: z.string(),
});

export const AnalyticsSiteSchema = z.object({
  siteId: z.string(),
  siteVersionId: z.string(),
});

export const AnalyticsCloudflareSchema = z.object({
  country: z.string(),
  continent: z.string(),
  isEUCountry: z.string(),
  regionCode: z.string(),
  timezone: z.string(),
});

export const BaseAnalyticsSchema = AnalyticsSiteSchema.extend({
  ...AnalyticsSiteSchema.shape,
  ...AnalyticsCloudflareSchema.shape,
  ...BrowserInfoSchema.shape,
  hostname: z.string(),
  pathname: z.string(),
  referer: z.string(),
  sessionId: z.string(),
});

export const AnylyticsIndexesSchema = z.object({
  ...AnalyticsSiteSchema.shape,
});

export const VisitAnalyticsSchema = BaseAnalyticsSchema;

export const ClickAnalyticsSchema = z.object({
  ...BaseAnalyticsSchema.shape,
  buttonId: z.string(),
});

// Types
export type BrowserInfo = z.infer<typeof BrowserInfoSchema>;
export type BaseAnalytics = z.infer<typeof BaseAnalyticsSchema>;
export type VisitAnalytics = z.infer<typeof VisitAnalyticsSchema>;
export type ClickAnalytics = z.infer<typeof ClickAnalyticsSchema>;
