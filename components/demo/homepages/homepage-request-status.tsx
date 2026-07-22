import Link from "next/link";

export interface HomepageStatusEvent {
  readonly label: string;
  readonly timestamp: string;
  readonly state: "done" | "active" | "pending";
}

interface HomepageRequestStatusProps {
  readonly requestId: string;
  readonly currentStep: string;
  readonly nextStep: string;
  readonly events: readonly HomepageStatusEvent[];
}

const stateClasses: Record<HomepageStatusEvent["state"], string> = {
  done: "bg-[#d8ff00] ring-[#d8ff00]",
  active: "bg-[#2557ff] ring-[#2557ff]",
  pending: "bg-transparent ring-white/30",
};

export function HomepageRequestStatus({
  requestId,
  currentStep,
  nextStep,
  events,
}: HomepageRequestStatusProps) {
  return (
    <div className="flex h-full flex-col gap-3">
      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-white backdrop-blur-sm">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <p className="text-[13px] font-medium text-white/70">
              Track a request
            </p>
          </div>

          <Link
            href="/demo/track"
            className="text-[13px] font-medium text-white/80 transition hover:text-white"
          >
            View details →
          </Link>
        </div>

        <div className="pt-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-white/45">
            Request ID
          </p>

          <p className="mt-2 text-[40px] font-semibold tracking-tight text-white">
            {requestId}
          </p>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="space-y-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-white/45">
                  Current status
                </p>

                <div className="mt-2 flex items-start gap-3">
                <span className="mt-1.5 h-3 w-3 rounded-full bg-[#2557ff]" />
                  <p className="text-[20px] leading-6 text-white">
                    {currentStep}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-white/45">
                  Next step
                </p>

                <div className="mt-2 flex items-start gap-3">
                  <span className="mt-1.5 h-3 w-3 rounded-full border border-white/30" />
                  <p className="text-[18px] leading-6 text-white/80">
                    {nextStep}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-white backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
          <p className="text-[13px] font-medium text-white/80">Live status</p>

          <Link
            href="/demo/requests"
            className="text-[13px] font-medium text-white/80 transition hover:text-white"
          >
            See all
          </Link>
        </div>

        <div className="pt-4">
          <ul className="space-y-4">
            {events.map((event) => (
              <li
                key={`${event.label}-${event.timestamp}`}
                className="grid grid-cols-[18px_minmax(0,1fr)_auto] items-start gap-3"
              >
                <span
                  className={`mt-1.5 h-3 w-3 rounded-full ring-1 ${stateClasses[event.state]}`}
                />

                <span className="text-[14px] leading-5 text-white/85">
                  {event.label}
                </span>

                <span className="text-right text-[12px] leading-5 text-white/50">
                  {event.timestamp}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
