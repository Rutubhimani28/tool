"use client";

import { useEffect } from "react";

type AdBannerProps = {
    dataAdSlot: string;
    dataAdFormat?: string;
    dataFullWidthResponsive?: boolean;
};

export default function AdBanner({
    dataAdSlot,
    dataAdFormat = "auto",
    dataFullWidthResponsive = true,
}: AdBannerProps) {
    useEffect(() => {
        // Do not push ads in development mode
        if (process.env.NODE_ENV === "development") return;

        let timeoutId: NodeJS.Timeout;

        const pushAd = () => {
            try {
                // @ts-ignore
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (error) {
                console.error("AdSense error:", error);
            }
        };

        // Small delay to ensure the DOM is fully painted and container has width
        timeoutId = setTimeout(pushAd, 200);

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, []);

    // Show a placeholder in development mode to avoid "refused to connect" errors
    if (process.env.NODE_ENV === "development") {
        return (
            <div className="w-full min-w-[250px] min-h-[90px] bg-zinc-200 dark:bg-zinc-800 border-2 border-dashed border-zinc-400 dark:border-zinc-600 flex items-center justify-center my-4 rounded-lg text-zinc-500 dark:text-zinc-400 text-sm font-medium">
                AdSense Banner (Hidden in Development)
            </div>
        );
    }

    return (
        <div className="w-full min-w-[250px] min-h-[50px] overflow-hidden flex justify-center my-4">
            <ins
                className="adsbygoogle"
                style={{ display: "block", width: "100%" }}
                data-ad-client="ca-pub-7796384906806193"
                data-ad-slot={dataAdSlot}
                data-ad-format={dataAdFormat}
                data-full-width-responsive={dataFullWidthResponsive.toString()}
            />
        </div>
    );
}
