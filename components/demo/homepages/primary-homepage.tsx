import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  Building2,
  CalendarDays,
  Check,
  CircleUserRound,
  ClipboardList,
  CreditCard,
  FileBadge2,
  FilePlus2,
  FileText,
  Landmark,
  Search,
  ShieldCheck,
  Upload,
  Users,
} from "lucide-react";

import {
  HomepageProcess,
  type HomepageProcessStep,
} from "@/components/demo/homepages/homepage-process";
import {
  HomepageFaq,
  type HomepageFaqItem,
} from "@/components/demo/homepages/homepage-faq";
import {
  HomepageRequestStatus,
  type HomepageStatusEvent,
} from "@/components/demo/homepages/homepage-request-status";
import {
  HomepageServiceList,
  type HomepageServiceItem,
} from "@/components/demo/homepages/homepage-service-list";

const quickActions = [
  {
    label: "New application",
    href: "/demo/sign-up",
    icon: FilePlus2,
  },
  {
    label: "Upload documents",
    href: "/demo/apply",
    icon: Upload,
  },
  {
    label: "Check requirements",
    href: "/demo/services",
    icon: ClipboardList,
  },
  {
    label: "Make a payment",
    href: "/demo/apply",
    icon: CreditCard,
  },
  {
    label: "Track request",
    href: "/demo/track",
    icon: FileText,
  },
] as const;

const requestEvents: readonly HomepageStatusEvent[] = [
  {
    label: "Request received",
    timestamp: "May 12, 10:24 am",
    state: "done",
  },
  {
    label: "With receiving department",
    timestamp: "May 12, 11:47 am",
    state: "active",
  },
  {
    label: "Supervisor decision",
    timestamp: "Pending",
    state: "pending",
  },
  {
    label: "Final decision",
    timestamp: "Pending",
    state: "pending",
  },
];

const services: readonly HomepageServiceItem[] = [
  {
    number: "01",
    title: "Request a transcript",
    description:
      "Get an official academic transcript for further studies or employment.",
    href: "/demo/services",
    icon: FileText,
    numberClassName: "text-[#2557ff]",
    iconClassName: "text-[#2557ff]",
    iconPanelClassName: "bg-[#ecf1ff]",
  },
  {
    number: "02",
    title: "Student clearance request",
    description:
      "Complete your clearance checks before graduation or final release.",
    href: "/demo/services",
    icon: ClipboardList,
    numberClassName: "text-[#ff7b39]",
    iconClassName: "text-[#ff7b39]",
    iconPanelClassName: "bg-[#fff0e7]",
  },
  {
    number: "03",
    title: "Certificate replacement",
    description:
      "Request a replacement certificate and validate supporting details.",
    href: "/demo/services",
    icon: FileBadge2,
    numberClassName: "text-[#9dc300]",
    iconClassName: "text-[#86aa00]",
    iconPanelClassName: "bg-[#f1f7d8]",
  },
  {
    number: "04",
    title: "Track an existing request",
    description:
      "See your current status, next step and the most recent updates.",
    href: "/demo/track",
    icon: Search,
    numberClassName: "text-slate-400",
    iconClassName: "text-slate-500",
    iconPanelClassName: "bg-[#f3f2f0]",
  },
];

const processSteps: readonly HomepageProcessStep[] = [
  {
    number: "01",
    title: "Submit",
    description: "Provide details and upload any required documents.",
    icon: FileText,
    accentClassName: "text-[#2557ff]",
    ringClassName: "border-[#cdd9ff]",
    iconClassName: "text-[#2557ff]",
  },
  {
    number: "02",
    title: "Review",
    description: "We review and assign your request.",
    icon: CircleUserRound,
    accentClassName: "text-[#ff7b39]",
    ringClassName: "border-[#ffd9c5]",
    iconClassName: "text-slate-900",
  },
  {
    number: "03",
    title: "Decision",
    description: "The responsible team makes a decision.",
    icon: Check,
    accentClassName: "text-[#9dc300]",
    ringClassName: "border-[#d8eaa8]",
    iconClassName: "text-slate-900",
  },
  {
    number: "04",
    title: "Outcome",
    description: "You'll receive an update and any next steps clearly.",
    icon: BellRing,
    accentClassName: "text-slate-500",
    ringClassName: "border-slate-300",
    iconClassName: "text-slate-900",
  },
];

const faqItems: readonly HomepageFaqItem[] = [
  {
    question: "How do I track my request?",
    answer:
      "Open the tracking page using your request number to view the latest status and next step.",
  },
  {
    question: "How long does it take to get a response?",
    answer:
      "Processing time depends on the service, but the status timeline will show each stage as it moves.",
  },
  {
    question: "What documents do I need?",
    answer:
      "Each service page shows the required supporting documents before you start your request.",
  },
  {
    question: "Can I edit my application after submission?",
    answer:
      "You can update certain details while the request is still under review, depending on the service.",
  },
];

const metrics = [
  {
    value: "120+",
    label: "Institutions onboarded",
    icon: Landmark,
    panelClassName: "bg-[#edf2ff]",
    iconClassName: "text-[#2557ff]",
  },
  {
    value: "1.4M+",
    label: "Requests processed",
    icon: Users,
    panelClassName: "bg-[#f0f7df]",
    iconClassName: "text-[#86aa00]",
  },
  {
    value: "92%",
    label: "On-time decisions",
    icon: CircleUserRound,
    panelClassName: "bg-[#fff1e7]",
    iconClassName: "text-[#ff7b39]",
  },
  {
    value: "99.8%",
    label: "System uptime",
    icon: ShieldCheck,
    panelClassName: "bg-[#f3f2f0]",
    iconClassName: "text-slate-700",
  },
] as const;

export function PrimaryHomepage() {
  return (
    <div className="bg-[#f6f4f1] text-slate-950">
      <section className="bg-[#05060c] text-white">
        <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
          <nav className="flex flex-col gap-6 py-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-5">
              <div className="flex items-center gap-4">
                <span className="text-[46px] font-semibold tracking-tight">
                  FAIDIA
                </span>

                <span className="hidden h-10 w-px bg-white/20 lg:block" />
              </div>

              <p className="max-w-[140px] text-[13px] leading-4 text-white/70">
                Service Operations
                <br />
                Platform for Institutions
              </p>
            </div>

            <div className="hidden items-center gap-10 lg:flex">
              <Link href="/demo/services" className="text-[14px] text-white/85 transition hover:text-white">
                Services
              </Link>
              <Link href="/demo/requests" className="text-[14px] text-white/85 transition hover:text-white">
                My requests
              </Link>
              <Link href="/demo/services" className="text-[14px] text-white/85 transition hover:text-white">
                Help
              </Link>
              <Link href="/demo/officer" className="text-[14px] text-white/85 transition hover:text-white">
                For institutions
              </Link>
            </div>

            <Link
              href="/demo/sign-up"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 px-5 text-[15px] font-medium text-white transition hover:bg-white/5"
            >
              Sign in
            </Link>
          </nav>

          <div className="grid gap-10 pb-5 pt-2 lg:grid-cols-[minmax(0,1fr)_460px] lg:items-start">
            <div>
              <h1 className="max-w-[640px] text-[82px] font-medium leading-[0.95] tracking-[-0.05em] text-white">
                Start it here.
                <br />
                Follow it everywhere.
              </h1>

              <p className="mt-8 max-w-[340px] text-[28px] leading-[1.15] text-white/82">
                One place for applications, approvals, documents and updates.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/demo/services"
                  className="inline-flex h-14 items-center justify-center rounded-xl bg-[#2557ff] px-7 text-[16px] font-medium text-white transition hover:bg-[#1945de]"
                >
                  Browse services
                  <ArrowRight className="ml-3 h-4 w-4" />
                </Link>

                <Link
                  href="/demo/track"
                  className="inline-flex h-14 items-center justify-center rounded-xl border border-white/20 px-7 text-[16px] font-medium text-white transition hover:bg-white/5"
                >
                  Track request
                </Link>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex h-[66px] items-center rounded-2xl border border-white/10 bg-white/[0.05] px-5 text-white/70 backdrop-blur-sm">
                <Search className="h-5 w-5 shrink-0" />

                <span className="ml-4 text-[18px]">What do you need help with?</span>

                <span className="ml-auto inline-flex h-9 items-center rounded-lg border border-white/10 px-3 text-[13px] tracking-[0.12em] text-white/50">
                  ⌘ K
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-3 pb-8 pt-3 lg:grid-cols-[220px_minmax(0,1fr)_340px]">
            <div className="flex flex-col gap-3">
              <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
                <p className="text-[15px] font-medium text-white">Quick actions</p>

                <div className="mt-4 space-y-1">
                  {quickActions.map((action) => {
                    const Icon = action.icon;

                    return (
                      <Link
                        key={action.label}
                        href={action.href}
                        className="flex items-center justify-between rounded-xl px-3 py-3 text-white/85 transition hover:bg-white/[0.06]"
                      >
                        <span className="flex items-center gap-3 text-[14px]">
                          <Icon className="h-4 w-4" />
                        {action.label}
                        </span>

                        <ArrowRight className="h-4 w-4 text-white/40" />
                      </Link>
                    );
                  })}
                </div>
              </section>

              <section className="rounded-2xl bg-[#d8ff00] p-5 text-slate-950">
                <p className="text-[15px] font-medium">Average response time</p>

                <div className="mt-6 flex items-end gap-2">
                  <span className="text-[78px] font-light leading-none">2.6</span>
                  <span className="mb-3 text-[18px]">days</span>
                </div>

                <p className="mt-4 text-[13px] font-medium">
                  ▲ 18% faster this month
                </p>
              </section>
            </div>

            <section className="relative min-h-[515px] overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_75%_25%,rgba(255,255,255,0.14),transparent_24%),radial-gradient(cile_at_20%_15%,rgba(255,148,68,0.12),transparent_24%),linear-gradient(135deg,#261a18_0%,#40322f_20%,#6c554f_44%,#2a2b31_74%,#1b1d2a_100%)]">
              <div className="absolute inset-0 bg-black/18" />

              <div className="relative flex h-full flex-col justify-between p-6">
                <div className="max-w-[240px] rounded-2xl bg-[#0e1424]/75 px-5 py-4 backdrop-blur-sm">
                  <p className="text-[15px] text-white/70">Institution service desk</p>
                  <p className="mt-3 text-[40px] leading-[1.02] tracking-tight text-white">
                    Huduma
                    <br />
                    Inapatikana
                    <br />
                    Kwa Wote.
                  </p>
                  <p className="mt-3 text-[14px] leading-6 text-white/78">
                    Services for all — applications, verifications and updates in one place.
                  </p>
                </div>

                <div className="absolute bottom-6 left-6 right-6 flex ems-center justify-between rounded-2xl border border-white/10 bg-[#070912]/80 px-5 py-4 backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5">
                      <Users className="h-5 w-5 text-white" />
                    </span>

                    <div>
                      <p className="text-[18px] text-white">Live support</p>
                      <p className="text-[14px] text-white/65">Talk to our team</p>
                    </div>
                  </div>

                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5">
                    <ArrowRight className="h-4 w-4 text-white" />
                  </span>
                </div>
              </div>
            </section>

            <HomepageRequestStatus
              requestId="FD-28491"
              currentStep="With receiving department"
              nextStep="Supervisor decision"
              events={requestEvents}
            />
          </div>
        </div>
      </section>

      <HomepageServiceList items={services} />

      <HomepageProcess steps={processSteps} />

      <section className="bg-[#f6f4f1]">
        <div className="mx-auto grid max-w-[1320px] gap-0 px-6 py-0 lg:grid-cols-[42%_58%] lg:px-8">
          <div className="min-h-[430px] bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.16),transparent_18%),linear-gradient(135deg,#526174_0%,#b5b29e_35%,#d8d6ca_65%,#758195_100%)]" />

          <div className="flex min-h-[430px] flex-col justify-between bg-[#f1efeb] px-8 py-8 lg:px-10 lg:py-10">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Real impact
              </p>

              <h2 className="mt-4 max-w-[580px] font-serif text-[58px] leading-[0.98] tracking-tight text-slate-950">
                From application to approval—
                <br />
                without the runaround.
              </h2>

              <p className="mt-6 max-w-[560px] text-[16px] leading-7 text-slate-500">
                Grace applied for her transcript online and received clear updates at every stage.
                No queues. No guesswork. Just a simple process from start to outcome.
              </p>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
              <div>
                <p className="text-[26px] leading-tight text-slate-950">Grace W.</p>
                <p className="mt-2 text-[14px] text-slate-500">
                  Applicant, Nairobi
                </p>
              </div>

              <blockquote className="max-w-[320px] justify-self-start font-serif text-[28px] italic leading-[1.22] text-slate-700 lg:justify-self-end">
                “FAIDIA made the process simple and kept me informed at every step.”
              </blockquote>
        </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f6f4f1]">
        <div className="mx-auto max-w-[1320px] px-6 py-12 lg:px-8 lg:py-14">
          <div className="grid gap-6 border-t border-slate-200 pt-12 md:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;

              return (
                <div
                  key={metric.label}
                  className={`flex items-center gap-5 ${index < metrics.length - 1 ? "lg:border-r lg:border-slate-200 lg:pr-6" : ""}`}
                >
                  <span
                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${metric.panelClassName}`}
                  >
                    <Icon className={`h-8 w-8 ${metric.iconClassName}`} />
                  </span>

                  <div>
                    <p className="text-[48px] leading-none tracking-tight text-slate-950">
                      {metric.value}
                    </p>
                    <p className="mt-2 text-[15px] text-slate-500">
                      {metric.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <HomepageFaq items={faqItems} />

      <section className="bg-[#2557ff]">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-8 px-6 py-8 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-6">
            <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white text-[#2557ff]">
              <Building2 className="h-8 w-8" />
            </span>

            <div>
              <h2 className="text-[52px] leading-[0.98] tracking-tight text-white">
                Ready to get started?
              </h2>

              <p className="mt-3 text-[18px] text-white/80">
                Find the service you need and get things moving.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/demo/services"
              className="inline-flex h-14 items-center justify-center rounded-xl bg-[#f1ef00] px-7 text-[16px] font-medium text-slate-950 transition hover:bg-[#e7e500]"
            >
              Browse services
              <ArrowRight className="ml-3 h-4 w-4" />
            </Link>

            <Link
              href="/demo/track"
              className="inline-flex h-14 items-center justify-center rounded-xl border border-white/30 px-7 text-[16px] font-medium text-white transition hover:bg-white/10"
            >
              Track a request
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
