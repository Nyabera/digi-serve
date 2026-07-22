import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

export interface HomepageProcessStep {
  readonly number: string;
  readonly title: string;
  readonly description: string;
  readonly icon: LucideIcon;
  readonly accentClassName: string;
  readonly ringClassName: string;
  readonly iconClassName: string;
}

interface HomepageProcessProps {
  readonly steps: readonly HomepageProcessStep[];
}

export function HomepageProcess({
  steps,
}: HomepageProcessProps) {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-[1320px] gap-10 px-6 py-16 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-12 lg:px-8 lg:py-20">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            How it works
          </p>

          <h2 className="mt-4 max-w-[220px] font-serif text-[48px] leading-[0.98] tracking-tight text-slate-950">
            How your
            <br />
            request moves
          </h2>

          <p className="mt-5 text-[22px] italic leading-8 text-slate-700">
            Simple. Transparent. Reliable.
          </p>

          <Link
            href="/demo/services"
            className="mt-8 inline-flex items-center gap-2 text-[15px] font-medium text-[#2557ff] transition hover:gap-3"
          >
            Learn more about our process
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="relative">
          <div className="absolute left-[11%] right-[11%] top-[58px] hidden border-t border-dashed border-slate-300 lg:block" />

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div key={step.number} className="relative">
                  <p className={`text-[18px] font-medium ${step.accentClassName}`}>
                    {step.number}
                  </p>

                  <div
                    className={`mt-4 flex h-[88px] w-[88px] items-center justify-center rounded-full border bg-white ${step.ringClassName}`}
                  >
                    <Icon className={`h-9 w-9 ${step.iconClassName}`} />
                  </div>

                  <h3 className="mt-6 text-[28px] leading-[1.05] tracking-tight text-slate-950">
                    {step.title}
                  </h3>

                  <p className="mt-3 max-w-[180px] text-[15px] leading-6 text-slate-500">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
