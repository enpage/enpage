import type { BaseAnalytics, ClickAnalytics, VisitAnalytics } from '~/server/common/analytics/schemas';
import type { RequestInitCfProperties } from '~/server/common/analytics/types';
import { getBrowserInfo, createOrderedBlobs } from "~/server/common/analytics/utils";
import type { CloudflareWorkersPlatformInfo } from "@hattip/adapter-cloudflare-workers";
import type { RequestContext } from "@hattip/compose";

function buildBaseAnalytics(
    siteId: string,
    siteVersionId: string,
    ctx: RequestContext<CloudflareWorkersPlatformInfo>
): BaseAnalytics {
    // @ts-ignore ignore
    if (!ctx.request.cf) throw new Error('CF data not available');

    const url = new URL(ctx.request.url);
    const userAgent = ctx.request.headers.get('user-agent') || '';
    const browserInfo = getBrowserInfo(userAgent);

    // @ts-ignore ignore
    const cfInfo = ctx.request.cf as RequestInitCfProperties;

    return {
        siteId,
        siteVersionId,
        hostname: url.hostname,
        pathname: url.pathname,
        country: cfInfo.country || "",
        continent: cfInfo.continent || "",
        isEUCountry: cfInfo.isEUCountry || "",
        regionCode: cfInfo.regionCode || "",
        timezone: cfInfo.timezone || "",
        browser: browserInfo.browser,
        os: browserInfo.os,
        device: browserInfo.device,
        referer: ctx.request.headers.get('referer') || "",
        sessionId: "",
    } as BaseAnalytics;
}

async function writeAnalytics<T extends BaseAnalytics>(
    binding: AnalyticsEngineDataset,
    data: T,
    doubles: number[] = [1]
): Promise<void> {
    const blobs = createOrderedBlobs(data);
    const indexes = [data.siteId];

    await binding.writeDataPoint({
        blobs,
        indexes,
        doubles,
    });
}

export const Analytics = {
    Visit: {
        track: async (
            siteId: string,
            siteVersionId: string,
            ctx: RequestContext<CloudflareWorkersPlatformInfo>
        ): Promise<void> => {
            // @ts-ignore ignore
            if (!ctx.request.cf) return;
            const data = buildBaseAnalytics(siteId, siteVersionId, ctx) as VisitAnalytics;

            // @ts-ignore ignore
            await writeAnalytics(ctx.env.binding_visits, data);
        }
    },
    Click: {
        track: async (
            siteId: string,
            siteVersionId: string,
            buttonVersionId: string,
            ctx: RequestContext<CloudflareWorkersPlatformInfo>
        ): Promise<void> => {
            // @ts-ignore ignore
            if (!ctx.request.cf) return;
            const baseData = buildBaseAnalytics(siteId, siteVersionId, ctx);
            const buttonData: ClickAnalytics = {
                ...baseData,
                buttonId: buttonVersionId
            };
            // @ts-ignore ignore
            await writeAnalytics(ctx.env.binding_clicks, buttonData);
        }
    }
};

// Add new functions to add new analytics
export const AnalyticsFunctions = {
    trackVisit: Analytics.Visit.track,
    trackClick: Analytics.Click.track,
    // trackForm: async (formId: string, ...) => { ... },
    // trackSearch: async (searchTerm: string, ...) => { ... },
};
