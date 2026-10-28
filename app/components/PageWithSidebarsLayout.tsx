import React from "react";
import Link from "next/link";
import { ArrowBack } from "@mui/icons-material";
import ResponsiveAdBanner from "@/app/components/ResponsiveAdBanner";

interface PageWithSidebarsLayoutProps {
  title: string;
  subtitle?: string;
  badgeGradient?: string;
  backHref?: string;
  backText?: string;
  children: React.ReactNode;
}

export default function PageWithSidebarsLayout({
  title,
  subtitle,
  badgeGradient = "from-blue-500 to-indigo-600",
  backHref = "/",
  backText = "Back to Home",
  children,
}: PageWithSidebarsLayoutProps) {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8 flex-1 flex flex-col xl:flex-row justify-center items-start gap-8 relative">
      {/* Left Sidebar Ads (Sticky on desktop XL) */}
      <aside className="hidden xl:flex flex-col w-[300px] shrink-0 sticky top-24 gap-6">
        <div className="w-[300px] min-h-[250px] flex items-center justify-center relative">
          <iframe
            src="/ad1.html"
            width="300"
            height="250"
            style={{ border: "none", overflow: "hidden" }}
            scrolling="no"
            title="Advertisement"
          />
        </div>
        <div className="w-[300px] min-h-[250px] flex items-center justify-center relative">
          <iframe
            src="/ad2.html"
            width="300"
            height="250"
            style={{ border: "none", overflow: "hidden" }}
            scrolling="no"
            title="Advertisement"
          />
        </div>
        <div className="w-[300px] min-h-[250px] flex items-center justify-center relative">
          <iframe
            src="/ad3.html"
            width="300"
            height="250"
            style={{ border: "none", overflow: "hidden" }}
            scrolling="no"
            title="Advertisement"
          />
        </div>
      </aside>

      {/* Main Center Content Column */}
      <div className="flex-1 w-full max-w-4xl min-w-0 flex flex-col">
        {/* Mobile/Tablet Top Ad */}
        <ResponsiveAdBanner slot="ad1" className="mb-4" />

        <div className="mb-6">
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white transition-colors group"
          >
            <ArrowBack className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            {backText}
          </Link>
        </div>

        <div className="mb-8">
          <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${badgeGradient} mb-4`} />
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              {subtitle}
            </p>
          )}
        </div>

        {/* Page Inner Content */}
        {children}

        {/* Mobile/Tablet Bottom Ad */}
        <ResponsiveAdBanner slot="ad2" className="mt-8" />
      </div>

      {/* Right Sidebar Ads (Sticky on desktop XL) */}
      <aside className="hidden xl:flex flex-col w-[300px] shrink-0 sticky top-24 gap-6">
        <div className="w-[300px] min-h-[250px] flex items-center justify-center relative">
          <iframe
            src="/ad2.html"
            width="300"
            height="250"
            style={{ border: "none", overflow: "hidden" }}
            scrolling="no"
            title="Advertisement"
          />
        </div>
        <div className="w-[300px] min-h-[250px] flex items-center justify-center relative">
          <iframe
            src="/ad1.html"
            width="300"
            height="250"
            style={{ border: "none", overflow: "hidden" }}
            scrolling="no"
            title="Advertisement"
          />
        </div>
        <div className="w-[300px] min-h-[250px] flex items-center justify-center relative">
          <iframe
            src="/ad2.html"
            width="300"
            height="250"
            style={{ border: "none", overflow: "hidden" }}
            scrolling="no"
            title="Advertisement"
          />
        </div>
      </aside>
    </div>
  );
}

