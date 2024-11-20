export interface RequestInitCfProperties {
  botManagement?: {
    score: number;
  };
  country: string;
  continent?: string;
  regionCode?: string;
  timezone?: string;
  isEUCountry?: string;
}

interface AnalyticsEngineDataset {
  writeDataPoint(data: {
    blobs?: Record<string, string>[];
    doubles?: number[];
    indexes?: string[];
  }): Promise<void>;
}

export interface Env {
  binding_visits: AnalyticsEngineDataset;
  binding_clicks: AnalyticsEngineDataset;
}

export type AnalyticsBlobs = [
  string, // siteId
  string, // siteVersionId
  string, // hostname
  string, // pathname
  string, // country
  string, // continent
  string, // isEUCountry
  string, // regionCode
  string, // timezone
  string, // browser
  string, // os
  string, // device
  string, // referer
  string, // sessionId
];
