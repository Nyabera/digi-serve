"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { getDefaultDemoClient } from "@/config/demo";

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/demo") {
    return pathname === "/demo";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DemoPublicHeader() {
  const pathname = usePathname();
  const client = getDefaultDemoClient();

  const primaryService =
    client.services.find((service) => service.featured) ??
    client.services[0];

  const serviceHref = `/demo/services/${
    primaryService?.slug ?? "transcript-request"
  }`;

  const applyHref = `/demo/apply/${
    primaryService?.slug ?? "transcript-request"
  }`;

  const navigationItems = [
    {
      label: "Home",
      href: "/demo",
    },
    {
      label: "Services",
      href: serviceHref,
    },
    {
      label: "Apply",
      href: applyHref,
    },
    {
      label: "Track request",
      href: "/demo/track/REQ-DEMO-001",
    },
  ] as const;

  return (
    <header className="relative border-b border-slate-200 bg-white">
      <div className="mx-auto flex min-h-20 max-w-[1440px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link
          href="/demo"
          className="flex min-w-0 items-center gap-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          aria-label={`${client.organization.name} service portal home`}
        >
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm"
            style={{
              backgroundColor: client.branding.primaryColor,
            }}
          >
            {client.branding.logoMark}
          </span>

          <span className="min-w-0">
            <span className="block truncate text-sm font-bold text-slate-950 sm:text-base">
              {client.organization.name}
            </span>

            <span className="block truncate text-xs text-slate-500">
              Digital Service Portal
            </span>
          </span>
        </Link>

        <nav
          aria-label="Public service navigation"
          className="hidden items-center gap-1 md:flex"
        >
          {navigationItems.map((item) => {
            const isActive = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "rounded-lg px-3 py-2 text-sm font-semibold transition",
                  "focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2",
                  isActive
                    ? "bg-slate-100 text-slate-950"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}

          <Link
            href="/demo/officer"
            className="ml-2 inline-flex min-h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            style={{
              backgroundColor: client.branding.primaryColor,
            }}
          >
            Staff workspace
          </Link>
        </nav>

        <details className="relative md:hidden">
          <summary className="cursor-pointer list-none rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2">
            Menu
          </summary>

          <div className="absolute right-0 z-40 mt-3 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
            <nav
              aria-label="Mobile public service navigation"
              className="grid gap-1"
            >
              {navigationItems.map((item) => {
                const isActive = isActivePath(
                  pathname,
                  item.href,
                );

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={[
                      "rounded-lg px-3 py-3 text-sm font-semibold transition",
                      "focus:outline-none focus:ring-2 focus:ring-slate-400",
                      isActive
                        ? "bg-slate-100 text-slate-950"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <Link
                href="/demo/officer"
                className="mt-2 inline-flex min-h-11 items-center justify-center rounded-lg px-4 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                style={{
                  backgroundColor: client.branding.primaryColor,
                }}
              >
                Staff workspace
              </Link>
            </nav>
          </div>
        </details>
      </div>
    </header>
  );
}
