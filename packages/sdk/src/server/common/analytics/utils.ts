import { type BrowserInfo, BrowserInfoSchema } from './schemas';
import type { AnalyticsBlobs } from '~/server/common/analytics/types';
import type { BaseAnalytics } from '~/server/common/analytics/schemas';

export function getBrowserInfo(userAgent: string): BrowserInfo {
    const ua = userAgent.toLowerCase();

    const browser =
        ua.includes('firefox') ? 'Firefox' :
        ua.includes('chrome') ? 'Chrome' :
        ua.includes('safari') ? 'Safari' :
        ua.includes('edge') ? 'Edge' :
        'Other';

    const os =
        ua.includes('windows') ? 'Windows' :
        ua.includes('mac') ? 'MacOS' :
        ua.includes('linux') ? 'Linux' :
        ua.includes('android') ? 'Android' :
        ua.includes('iphone') || ua.includes('ipad') ? 'iOS' :
        'Other';

    const device =
        ua.includes('mobile') ? 'Mobile' :
        ua.includes('tablet') ? 'Tablet' :
        'Desktop';

    return BrowserInfoSchema.parse({ browser, os, device });
}

export function createOrderedBlobs<T extends BaseAnalytics>(data: T): AnalyticsBlobs {
  return [
      data.siteId,
      data.siteVersionId,
      data.hostname,
      data.pathname,
      data.country,
      data.continent,
      data.isEUCountry,
      data.regionCode,
      data.timezone,
      data.browser,
      data.os,
      data.device,
      data.referer,
      data.sessionId,
  ];
}
