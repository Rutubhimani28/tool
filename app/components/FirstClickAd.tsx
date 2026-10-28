"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const AD_URL = "https://affectionatestorage.com/b.3oVm0UPs3_pDvJbnmbV/JhZfDm0/3UMcz/kC3LNCjQIr5lLoT/c-zHOsTact2EMFz/Mi";

export default function FirstClickAd() {
  const pathname = usePathname();
  const hasTriggeredOnPageRef = useRef(false);

  useEffect(() => {
    // Reset trigger whenever pathname changes (page change, back, forward)
    hasTriggeredOnPageRef.current = false;

    const triggerAd = (target: EventTarget | null) => {
      // Check if clicked element is an anchor link or inside an anchor link
      const element = target as HTMLElement | null;
      const isLink = !!element?.closest?.("a, button, [role='button']");

      // If user clicks a link/button OR if it's the first click anywhere on the page
      if (!hasTriggeredOnPageRef.current || isLink) {
        hasTriggeredOnPageRef.current = true;
        try {
          window.open(AD_URL, "_blank", "noopener,noreferrer");
        } catch (err) {
          console.error("Ad open error:", err);
        }
      }
    };

    const handleClick = (e: MouseEvent) => {
      triggerAd(e.target);
    };

    // Use capture phase so we always intercept before Next.js Link or browser navigates
    window.addEventListener("click", handleClick, true);

    return () => {
      window.removeEventListener("click", handleClick, true);
    };
  }, [pathname]);

  return null;
}
