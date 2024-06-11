import { type DatasourceManifestMap, providersSchemaMap } from "@enpage/types/datasources";
import { providersSamples } from "./sample";

export function createFakeContext(ds: DatasourceManifestMap) {
  const ctx: Record<string, any> = {};
  for (const key in ds) {
    const provider = ds[key].provider;
    if (typeof provider === "string") {
      ctx[key] = providersSamples[provider];
    } else if ("sampleData" in ds[key] && ds[key].sampleData) {
      ctx[key] = ds[key].sampleData;
    }
  }
  return ctx;
}
