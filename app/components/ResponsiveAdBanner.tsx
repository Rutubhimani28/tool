import React from "react";

interface ResponsiveAdBannerProps {
  slot?: "ad1" | "ad2" | "ad3";
  className?: string;
  showOnDesktop?: boolean;
}

export default function ResponsiveAdBanner({
  slot = "ad1",
  className = "",
  showOnDesktop = false,
}: ResponsiveAdBannerProps) {
  // If showOnDesktop is false, only show on mobile & tablet (hidden on xl/desktop)
  const visibilityClass = showOnDesktop ? "flex" : "flex xl:hidden";

  return (
    <div
      className={`w-full max-w-full my-4 flex-col items-center justify-center overflow-hidden bg-transparent ${visibilityClass} ${className}`}
    >
      <div className="w-[300px] max-w-[100vw] h-[250px] mx-auto flex items-center justify-center overflow-hidden relative">
        <iframe
          src={`/${slot}.html`}
          width="300"
          height="250"
          style={{ border: "none", overflow: "hidden", background: "transparent", maxWidth: "100%" }}
          scrolling="no"
          title="Advertisement"
          loading="lazy"
        />
      </div>
    </div>
  );
}
