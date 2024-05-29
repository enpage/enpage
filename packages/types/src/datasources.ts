import z from "zod";

type DatasourceProvider =
  | "youtube"
  | "twitter"
  | "instagram"
  | "linkedin"
  | "facebook"
  | "google"
  | "spotify"
  | "tiktok"
  | "github"
  | "reddit"
  | "snapchat"
  | "pinterest"
  | "twitch";

export type DatasourceManifest<S extends z.ZodTypeAny> =
  | {
      provider: DatasourceProvider;
      name: string;
      description?: string;
      refresh?: {
        method: "interval" | "manual";
        interval?: number;
      };
      schema: S;
      sampleData: z.infer<S>;
      data?: z.infer<S>;
      hideInInspector?: boolean | "if-empty";
      group?: string;
      advanced?: boolean;
    }
  | {
      name: string;
      description?: string;
      schema: S;
      refresh?: {
        method: "interval" | "manual";
        interval?: number;
      };
      sampleData: z.infer<S>;
      data?: z.infer<S>;
      hideInInspector?: boolean | "if-empty";
      group?: string;
      advanced?: boolean;
    };

export type DatasourceManifestMap = Record<string, DatasourceManifest<any>>;
