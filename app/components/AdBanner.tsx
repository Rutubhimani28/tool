"use client";

import { useEffect, useRef } from "react";

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
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current && !containerRef.current.hasAttribute("data-ad-loaded")) {
            containerRef.current.setAttribute("data-ad-loaded", "true");
            
            const script1 = document.createElement("script");
            script1.src = "//juvenilechoice.com/bgXBV.spddGolp0XYdWLcF/Ae-m/9BujZdUJl/klPKTWcLz/O-TWcu2/MCTSMrt/NwzIMu5/NUzQYox-NFwT";
            script1.async = true;
            script1.referrerPolicy = "no-referrer-when-downgrade";
            (script1 as any).settings = {};
            containerRef.current.appendChild(script1);

            const script2 = document.createElement("script");
            script2.src = "//second-director.com/cBD/9_6fb.2p5AlrSsW/Qi9/NxzFMr5KN/zWUhycNtSv0q3eMDz/kd3/NMTGIm5v";
            script2.async = true;
            script2.referrerPolicy = "no-referrer-when-downgrade";
            (script2 as any).settings = {};
            containerRef.current.appendChild(script2);
        }
    }, []);

    return (
        <div 
            ref={containerRef}
            className="w-full min-w-[250px] min-h-[50px] flex justify-center my-4 relative z-50"
        >
        </div>
    );
}
