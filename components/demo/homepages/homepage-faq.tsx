import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

export interface HomepageFaqItem {
  readonly question: string;
  readonly answer: string;
}

interface HomepageFaqProps {
  readonly items: readonly HomepageFaqItem[];
}

export function HomepageFaq({
  items,
}: HomepageFaqProps) {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-[1320px] gap-10 px-6 py-16 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-12 lg:px-8 lg:py-20">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            FAQ
          </p>

          <h2 className="mt-4 max-w-[220px] font-sans text-[48px] leading-[0.98] tracking-tight text-slate-950">
            Everything you
            <br />
            need to know
          </h2>

          <Link
            href="/demo/services"
            className="mt-8 inline-flex items-center gap-2 text-[15px] font-medium text-[#2557ff] transition hover:gap-3"
          >
            View all FAQs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div>
          {items.map((item, index) => (
            <details
              key={item.question}
              className={`group ${index !== items.length - 1 ? "border-b border-slate-200" : ""}`}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-6">
                <span className="text-[28px] leading-[1.08] tracking-tight text-slate-950">
                  {item.question}
                </span>

                <span className="flex h-8 w-8 items-center justify-center rounded-full transition group-open:rotate-45">
                  <Plus className="h-5 w-5 text-slate-700" />
                </span>
              </summary>

              <div className="pb-6 pr-10 text-[15px] leading-7 text-slate-500">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
