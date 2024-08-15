import type { Options } from "../../types";

export interface YoutubeListOptions extends Options {
  urlParams: {
    channelId: string;
    order?: string;
    maxResults?: string;
    regionCode?: string;
    relevanceLanguage?: string;
  };
}

export interface YoutubeListData {
  items: {
    id: {
      videoId: string;
    };
  }[];
}
