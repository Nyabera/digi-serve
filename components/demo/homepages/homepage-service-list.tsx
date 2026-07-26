import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

export interface HomepageServiceItem {
  readonly number: string;
  readonly title: string;
  readonly description: string;
  readonly href: string;
  readonly icon: LucideIcon;
  readonly numberClassName: string;
  readonly iconClassName: string;
  readonly iconPanelClassName: string;
}

interface HomepageServiceListProps {
  readonly items: readonly HomepageServiceItem[];
}

export function HomepageServiceList({
  items,
}: HomepageServiceListProps) {
  return (
    <section className="bg-[#f6f4f1]">
      <div className="mx-auto grid max-w-[1320px] gap-10 px-6 py-16 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-12 lg:px-8 lg:py-20">
        <div className="flex flex-col justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Popular services
            </p>

            <h2 className="mt-4 max-w-[240px] font-sans text-[48px] leading-[0.98] tracking-tight text-slate-950">
              What would you
              <br />
              like to do today?
            </h2>
          </div>

          <Link
            href="/demo/services"
            className="mt-8 inline-flex items-center gap-2 text-[15px] font-medium text-[#2557ff] transition hover:gap-3"
          >
            View all services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="overflow-hidden rounded-[20px] border border-slate-200/80 bg-white">
          {items.map((item, index) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.number}
                href={item.href}
                className={`grid grid-cols-[72px_72px_minmax(0,1fr)_32px] items-center gap-4 px-6 py-7 transition hover:bg-slate-50 ${
                  index !== items.length - 1 ? "border-b border-slate-200/80" : ""
                }`}
              >
                <span
                  className={`text-[46px] font-light leading-none ${item.numberClassName}`}
                >
                  {item.number}
                </span>

                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.iconPanelClassName}`}
                >
                  <Icon className={`h-7 w-7 ${item.iconClassName}`} />
                </span>

                <span className="block">
                  <span className="block text-[28px] leading-[1.1] tracking-tight text-slate-950">
                    {item.title}
                  </span>

                  <span className="mt-2 block text-[15px] leading-6 text-slate-500">
                    {item.description}
                  </span>
                </span>

                <ArrowRight className="h-5 w-5 text-slate-400" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
