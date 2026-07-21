import { cloneElement, type CSSProperties } from "react";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  FileText,
  Inbox,
  LoaderCircle,
  Search,
  Settings,
  XCircle,
} from "lucide-react";

export const metadata = {
  title: "Design Lab | FAIDIA",
  description: "Temporary visual testing environment for the FAIDIA design system.",
};

const colours = [
    {
      name: "Background",
      variable: "--background",
      fallback: "#F8FAFC",
    },
    {
      name: "Surface",
      variable: "--surface",
      fallback: "#FFFFFF",
    },
    {
      name: "Surface subtle",
      variable: "--surface-subtle",
      fallback: "#F1F5F9",
    },
    {
      name: "Foreground",
      variable: "--foreground",
      fallback: "#0B1B4D",
    },
    {
      name: "Text",
      variable: "--text",
      fallback: "#172554",
    },
    {
      name: "Muted foreground",
      variable: "--muted-foreground",
      fallback: "#64748B",
    },
    {
      name: "Border",
      variable: "--border",
      fallback: "#DCE4EF",
    },
    {
      name: "Border strong",
      variable: "--border-strong",
      fallback: "#C5D1E2",
    },
    {
      name: "Primary",
      variable: "--primary",
      fallback: "#2337B8",
    },
    {
      name: "Primary hover",
      variable: "--primary-hover",
      fallback: "#1B2C97",
    },
    {
      name: "Primary soft",
      variable: "--primary-soft",
      fallback: "#EEF0FB",
    },
    {
      name: "Focus",
      variable: "--focus",
      fallback: "#2337B8",
    },
  ];

  const statuses = [
    {
      name: "Neutral",
      label: "Draft",
      background: cssVariable(
        "--status-neutral-bg",
        "#F1F5F9",
      ),
      foreground: cssVariable(
        "--status-neutral-text",
        "#475569",
      ),
      border: cssVariable(
        "--status-neutral-border",
        "#CBD5E1",
      ),
    },
    {
      name: "Information",
      label: "In review",
      background: cssVariable(
        "--status-info-bg",
        "#EEF0FB",
      ),
      foreground: cssVariable(
        "--status-info-text",
        "#2337B8",
      ),
      border: cssVariable(
        "--status-info-border",
        "#C7D2FE",
      ),
    },
    {
      name: "Success",
      label: "Completed",
      background: cssVariable(
        "--status-success-bg",
        "#ECFDF3",
      ),
      foreground: cssVariable(
        "--status-success-text",
        "#067647",
      ),
      border: cssVariable(
        "--status-success-border",
        "#ABEFC6",
      ),
    },
    {
      name: "Warning",
      label: "Due soon",
      background: cssVariable(
        "--status-warning-bg",
        "#FFFAEB",
      ),
      foreground: cssVariable(
        "--status-warning-text",
        "#B54708",
      ),
      border: cssVariable(
        "--status-warning-border",
        "#FEDF89",
      ),
    },
    {
      name: "Danger",
      label: "Overdue",
      background: cssVariable(
        "--status-danger-bg",
        "#FEF3F2",
      ),
      foreground: cssVariable(
        "--status-danger-text",
        "#B42318",
      ),
      border: cssVariable(
        "--status-danger-border",
        "#FECDCA",
      ),
    },
  ];

const spacingTokens = [
  { name: "1", value: 4 },
  { name: "2", value: 8 },
  { name: "3", value: 12 },
  { name: "4", value: 16 },
  { name: "5", value: 20 },
  { name: "6", value: 24 },
  { name: "8", value: 32 },
  { name: "10", value: 40 },
  { name: "12", value: 48 },
  { name: "16", value: 64 },
];

const radiusTokens = [
  { name: "Small", value: 5 },
  { name: "Medium", value: 10 },
  { name: "Large", value: 18 },
  { name: "Extra large", value: 26 },
];

const tableRows = [
  {
    reference: "REQ-2026-00421",
    service: "Transcript request",
    applicant: "Amina Kamau",
    status: "In review",
    due: "22 Jul 2026",
  },
  {
    reference: "REQ-2026-00420",
    service: "Certificate replacement",
    applicant: "Brian Otieno",
    status: "Due soon",
    due: "21 Jul 2026",
  },
  {
    reference: "REQ-2026-00419",
    service: "Clearance request",
    applicant: "Cynthia Wanjiku",
    status: "Completed",
    due: "18 Jul 2026",
  },
];

function cssVariable(variable: string, fallback: string): string {
  return `var(${variable}, ${fallback})`;
}

function statusStyle(status: string): CSSProperties {
    if (status === "Completed") {
      return {
        backgroundColor: cssVariable(
          "--status-success-bg",
          "#ECFDF3",
        ),
        color: cssVariable(
          "--status-success-text",
          "#067647",
        ),
        borderColor: cssVariable(
          "--status-success-border",
          "#ABEFC6",
        ),
      };
    }
    if (status === "Due soon") {
      return {
        backgroundColor: cssVariable(
          "--status-warning-bg",
          "#FFFAEB",
        ),
        color: cssVariable(
          "--status-warning-text",
          "#B54708",
        ),
        borderColor: cssVariable(
          "--status-warning-border",
          "#FEDF89",
        ),
      };
    }
    if (status === "Overdue") {
      return {
        backgroundColor: cssVariable(
          "--status-danger-bg",
          "#FEF3F2",
        ),
        color: cssVariable(
          "--status-danger-text",
          "#B42318",
        ),
        borderColor: cssVariable(
          "--status-danger-border",
          "#FECDCA",
        ),
      };
    }

    return {
      backgroundColor: cssVariable(
        "--status-info-bg",
        "#EEF0FB",
      ),
      color: cssVariable(
        "--status-info-text",
        "#2337B8",
      ),
      borderColor: cssVariable(
        "--status-info-border",
        "#C7D2FE",
      ),
    };
  }

export default function DesignLabPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-8 text-text sm:px-6 lg:px-10">   
      <div className="mx-auto max-w-[1440px]">
        <header
          className="mb-10 rounded-[18px] border p-6 sm:p-8"
          style={{
            backgroundColor: cssVariable("--surface", "#FFFFFF"),
            borderColor: cssVariable("--border", "#DCE4EF"),
          }}
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p
                className="mb-3 text-xs font-semibold uppercase tracking-[0.16em]"
                style={{
                  color: cssVariable("--primary", "#2337B8"),
                }}
              >
                FAIDIA · Stage 8
              </p>

              <h1
                className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl"
                style={{
                  color: cssVariable("--foreground", "#0B1B4D"),
                }}
              >
                Design System Laboratory
              </h1>

              <p
                className="mt-4 max-w-2xl text-sm leading-6 sm:text-base"
                style={{
                  color: cssVariable("--muted-foreground", "#64748B"),
                }}
              >
                This temporary page exposes the typography, colours, spacing,
                controls, states, tables and chart treatments used throughout
                FAIDIA.
              </p>
            </div>

            <div
              className="rounded-[10px] border px-4 py-3 text-sm"
              style={{
                backgroundColor: cssVariable("--primary-soft", "#EEF0FB"),
                borderColor: "#C7D2FE",
                color: cssVariable("--primary", "#2337B8"),
              }}
            >
              <p className="font-semibold">Testing status</p>
              <p className="mt-1 text-xs">Not yet approved or frozen</p>
            </div>
          </div>
        </header>

        <div className="space-y-10">
          {/* Typography */}
          <section
            className="rounded-[18px] border p-6 sm:p-8"
            style={{
              backgroundColor: cssVariable("--surface", "#FFFFFF"),
              borderColor: cssVariable("--border", "#DCE4EF"),
            }}
          >
            <SectionHeader
              eyebrow="01"
              title="Typography"
              description="Check hierarchy, wrapping, font weight, line height and numerical alignment."
            />

            <div className="mt-8 space-y-8">
              <TypographyExample
                label="Display"
                className="text-display"
              >
                Institutional services without the operational confusion
              </TypographyExample>

              <TypographyExample
                label="Page title"
                className="text-page-title"
              >
                Transcript request management
              </TypographyExample>

              <TypographyExample
                label="Section title"
                className="text-section-title"
              >
                Requests requiring attention
              </TypographyExample>

              <TypographyExample
                label="Card title"
                className="text-card-title"
              >
                Finance verification
              </TypographyExample>

              <TypographyExample
                label="Body"
                className="text-body max-w-3xl"
             >
                Review the applicant&apos;s submitted information and verify that
                the required institutional records are complete before advancing
                the request to the next workflow step.
              </TypographyExample>

              <TypographyExample
                label="Applicant body"
                className="text-body-applicant max-w-3xl"
            >
                Follow the steps below to complete your request. You can save your
                progress and return later before submitting the final application.
              </TypographyExample>

              <TypographyExample
                label="Compact body"
                className="text-body-compact"
              >
                Assigned to Student Records · Updated 14 minutes ago
              </TypographyExample>

              <TypographyExample
                label="Label"
                className="text-label"
              >
                Admission number
              </TypographyExample>

              <TypographyExample
                label="Caption"
                className="text-caption"
              >
                PDF, JPG or PNG · Maximum file size 10 MB
              </TypographyExample>

              <div
                className="rounded-[10px] border p-5"
                style={{
                  borderColor: cssVariable("--border", "#DCE4EF"),
                  backgroundColor: cssVariable(
                    "--surface-subtle",
                    "#F1F5F9",
                  ),
                }}
              >
                <p
                  className="text-[11px] font-semibold uppercase tracking-[0.12em]"
                  style={{
                    color: cssVariable("--muted-foreground", "#64748B"),
                  }}
                >
                  Tabular numbers
                </p>

                <div className="numbers-tabular mt-3 flex flex-wrap gap-x-8 gap-y-2 text-lg font-semibold">
                <span className="text-reference">REQ-2026-00421</span>
                  <span>KES 123,456.00</span>
                  <span>08:42:19</span>
                  <span>97.4%</span>
                </div>
              </div>
            </div>
          </section>

          {/* Colours */}
          <section
            className="rounded-[18px] border p-6 sm:p-8"
            style={{
              backgroundColor: cssVariable("--surface", "#FFFFFF"),
              borderColor: cssVariable("--border", "#DCE4EF"),
            }}
          >
            <SectionHeader
              eyebrow="02"
              title="Colour system"
              description="Inspect semantic colours against white, subtle and application backgrounds."
            />

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {colours.map((colour) => (
                <article
                  key={colour.name}
                  className="overflow-hidden rounded-[10px] border"
                  style={{
                    borderColor: cssVariable("--border", "#DCE4EF"),
                  }}
                >
                  <div
                    className="h-24"
                    style={{
                      backgroundColor: cssVariable(
                        colour.variable,
                        colour.fallback,
                      ),
                    }}
                  />

                  <div className="p-4">
                    <p className="text-sm font-semibold">{colour.name}</p>
                    <p
                      className="mt-1 font-mono text-xs"
                      style={{
                        color: cssVariable(
                          "--muted-foreground",
                          "#64748B",
                        ),
                      }}
                    >
                      {colour.fallback}
                    </p>
                    <p
                      className="mt-1 font-mono text-[11px]"
                      style={{
                        color: cssVariable(
                          "--muted-foreground",
                          "#64748B",
                        ),
                      }}
                    >
                      {colour.variable}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Statuses */}
          <section
            className="rounded-[18px] border p-6 sm:p-8"
            style={{
              backgroundColor: cssVariable("--surface", "#FFFFFF"),
              borderColor: cssVariable("--border", "#DCE4EF"),
            }}
          >
            <SectionHeader
              eyebrow="03"
              title="Status colours"
              description="Every state must remain understandable through text, not colour alone."
            />

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {statuses.map((status) => (
                <article
                  key={status.name}
                  className="rounded-[10px] border p-4"
                  style={{
                    backgroundColor: status.background,
                    borderColor: status.border,
                    color: status.foreground,
                  }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide">
                    {status.name}
                  </p>

                  <p className="mt-4 inline-flex items-center gap-2 rounded-[5px] border border-current px-2.5 py-1 text-xs font-semibold">
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-current"
                    />
                    {status.label}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {/* Spacing */}
          <section
            className="rounded-[18px] border p-6 sm:p-8"
            style={{
              backgroundColor: cssVariable("--surface", "#FFFFFF"),
              borderColor: cssVariable("--border", "#DCE4EF"),
            }}
          >
            <SectionHeader
              eyebrow="04"
              title="Spacing scale"
              description="The blocks show the actual pixel width assigned to each spacing token."
            />

            <div className="mt-8 space-y-4">
              {spacingTokens.map((token) => (
                <div
                  key={token.name}
                  className="grid grid-cols-[70px_1fr] items-center gap-4"
                >
                  <div>
                    <p className="text-sm font-semibold">Space {token.name}</p>
                    <p
                      className="text-xs"
                      style={{
                        color: cssVariable(
                          "--muted-foreground",
                          "#64748B",
                        ),
                      }}
                    >
                      {token.value}px
                    </p>
                  </div>

                  <div
                    className="h-5 rounded-[5px]"
                    style={{
                      width: `${token.value}px`,
                      minWidth: `${token.value}px`,
                      backgroundColor: cssVariable("--primary", "#2337B8"),
                    }}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Radius and shadows */}
          <section className="grid gap-6 lg:grid-cols-2">
            <div
              className="rounded-[18px] border p-6 sm:p-8"
              style={{
                backgroundColor: cssVariable("--surface", "#FFFFFF"),
                borderColor: cssVariable("--border", "#DCE4EF"),
              }}
            >
              <SectionHeader
                eyebrow="05"
                title="Radius"
                description="Compare the approved surface rounding levels."
              />

              <div className="mt-8 grid grid-cols-2 gap-4">
                {radiusTokens.map((token) => (
                  <div
                    key={token.name}
                    className="flex min-h-32 flex-col justify-between border p-4"
                    style={{
                      borderColor: cssVariable("--border-strong", "#C5D1E2"),
                      borderRadius: `${token.value}px`,
                      backgroundColor: cssVariable(
                        "--surface-subtle",
                        "#F1F5F9",
                      ),
                    }}
                  >
                    <p className="text-sm font-semibold">{token.name}</p>
                    <p
                      className="text-xs"
                      style={{
                        color: cssVariable(
                          "--muted-foreground",
                          "#64748B",
                        ),
                      }}
                    >
                      {token.value}px
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="rounded-[18px] border p-6 sm:p-8"
              style={{
                backgroundColor: cssVariable("--surface", "#FFFFFF"),
                borderColor: cssVariable("--border", "#DCE4EF"),
              }}
            >
              <SectionHeader
                eyebrow="06"
                title="Shadows"
                description="FAIDIA should primarily use borders, with shadows reserved for layering."
              />

              <div className="mt-8 space-y-5">
                <div
                  className="rounded-[18px] border p-5"
                  style={{
                    borderColor: cssVariable("--border", "#DCE4EF"),
                  }}
                >
                  <p className="text-sm font-semibold">No shadow</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Default cards and table containers
                  </p>
                </div>

                <div
                  className="rounded-[18px] border p-5"
                  style={{
                    borderColor: cssVariable("--border", "#DCE4EF"),
                    boxShadow: "0 1px 2px rgb(15 23 42 / 0.06)",
                  }}
                >
                  <p className="text-sm font-semibold">Small shadow</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Lightly layered surfaces
                  </p>
                </div>

                <div
                  className="rounded-[18px] border p-5"
                  style={{
                    borderColor: cssVariable("--border", "#DCE4EF"),
                    boxShadow: "0 16px 40px rgb(15 23 42 / 0.14)",
                  }}
                >
                  <p className="text-sm font-semibold">Overlay shadow</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Dialogs, drawers and menus only
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Icons */}
          <section
            className="rounded-[18px] border p-6 sm:p-8"
            style={{
              backgroundColor: cssVariable("--surface", "#FFFFFF"),
              borderColor: cssVariable("--border", "#DCE4EF"),
            }}
          >
            <SectionHeader
              eyebrow="07"
              title="Lucide icon sizing"
              description="Icons should use one outline family and a controlled sizing system."
            />

            <div className="mt-8 flex flex-wrap gap-6">
              <IconExample label="14px" size={14}>
                <Search />
              </IconExample>

              <IconExample label="16px" size={16}>
                <Bell />
              </IconExample>

              <IconExample label="18px" size={18}>
                <FileText />
              </IconExample>

              <IconExample label="20px" size={20}>
                <Settings />
              </IconExample>

              <IconExample label="24px" size={24}>
                <CircleAlert />
              </IconExample>

              <IconExample label="32px" size={32}>
                <Inbox />
              </IconExample>
            </div>
          </section>

          {/* Buttons and inputs */}
          <section
            className="rounded-[18px] border p-6 sm:p-8"
            style={{
              backgroundColor: cssVariable("--surface", "#FFFFFF"),
              borderColor: cssVariable("--border", "#DCE4EF"),
            }}
          >
            <SectionHeader
              eyebrow="08"
              title="Controls"
              description="Review comfortable and compact dimensions before shared components are built."
            />

            <div className="mt-8 grid gap-8 xl:grid-cols-2">
              <div>
                <h3 className="text-base font-semibold">Buttons</h3>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    className="inline-flex h-11 items-center justify-center rounded-[10px] px-5 text-sm font-semibold text-white transition-colors"
                    style={{
                      backgroundColor: cssVariable("--primary", "#2337B8"),
                    }}
                  >
                    Primary action
                  </button>

                  <button
                    type="button"
                    className="inline-flex h-11 items-center justify-center rounded-[10px] border px-5 text-sm font-semibold"
                    style={{
                      borderColor: cssVariable("--border-strong", "#C5D1E2"),
                      backgroundColor: cssVariable("--surface", "#FFFFFF"),
                    }}
                  >
                    Secondary
                  </button>

                  <button
                    type="button"
                    className="inline-flex h-11 items-center justify-center rounded-[10px] px-5 text-sm font-semibold"
                    style={{
                      color: cssVariable("--primary", "#2337B8"),
                    }}
                  >
                    Ghost action
                  </button>

                  <button
                    type="button"
                    className="inline-flex h-11 items-center justify-center rounded-[10px] bg-red-600 px-5 text-sm font-semibold text-white"
                  >
                    Destructive
                  </button>

                  <button
                    type="button"
                    disabled
                    className="inline-flex h-11 cursor-not-allowed items-center justify-center rounded-[10px] bg-slate-200 px-5 text-sm font-semibold text-slate-500"
                  >
                    Disabled
                  </button>

                  <button
                    type="button"
                    aria-busy="true"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] px-5 text-sm font-semibold text-white"
                    style={{
                      backgroundColor: cssVariable("--primary", "#2337B8"),
                    }}
                  >
                    <LoaderCircle
                      aria-hidden="true"
                      className="h-4 w-4 animate-spin"
                    />
                    Saving
                  </button>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    className="h-9 rounded-[10px] border px-4 text-[13px] font-semibold"
                    style={{
                      borderColor: cssVariable("--border-strong", "#C5D1E2"),
                    }}
                  >
                    Dense 36px
                  </button>

                  <button
                    type="button"
                    className="h-10 rounded-[10px] border px-4 text-sm font-semibold"
                    style={{
                      borderColor: cssVariable("--border-strong", "#C5D1E2"),
                    }}
                  >
                    Compact 40px
                  </button>

                  <button
                    type="button"
                    className="h-11 rounded-[10px] border px-5 text-sm font-semibold"
                    style={{
                      borderColor: cssVariable("--border-strong", "#C5D1E2"),
                    }}
                  >
                    Comfortable 44px
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold">Inputs</h3>

                <div className="mt-4 space-y-5">
                  <label className="block">
                    <span className="mb-2 block text-[13px] font-semibold">
                      Applicant input · 50px
                    </span>

                    <input
                      type="text"
                      placeholder="Enter admission number"
                      className="h-[50px] w-full rounded-[10px] border bg-white px-4 text-sm outline-none"
                      style={{
                        borderColor: cssVariable(
                          "--border-strong",
                          "#C5D1E2",
                        ),
                      }}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-[13px] font-semibold">
                      Staff input · 40px
                    </span>

                    <div className="relative">
                      <Search
                        aria-hidden="true"
                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="search"
                        placeholder="Search requests"
                        className="h-10 w-full rounded-[10px] border bg-white pl-10 pr-4 text-[13px] outline-none"
                        style={{
                          borderColor: cssVariable(
                            "--border-strong",
                            "#C5D1E2",
                          ),
                        }}
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-[13px] font-semibold text-red-700">
                      Invalid input
                    </span>

                    <input
                      type="text"
                      aria-invalid="true"
                      aria-describedby="design-lab-error"
                      defaultValue="Incorrect reference"
                      className="h-[50px] w-full rounded-[10px] border border-red-500 bg-red-50 px-4 text-sm outline-none"
                    />

                    <span
                      id="design-lab-error"
                      className="mt-2 block text-xs font-medium text-red-700"
                    >
                      Enter a valid institutional reference number.
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Cards and badges */}
          <section
            className="rounded-[18px] border p-6 sm:p-8"
            style={{
              backgroundColor: cssVariable("--surface", "#FFFFFF"),
              borderColor: cssVariable("--border", "#DCE4EF"),
            }}
          >
            <SectionHeader
              eyebrow="09"
              title="Cards and badges"
              description="Compare default, operational and action-required surfaces."
            />

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <article
                className="rounded-[18px] border p-5"
                style={{
                  borderColor: cssVariable("--border", "#DCE4EF"),
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-base font-semibold">Standard card</p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Used for normal information and low-priority content.
                    </p>
                  </div>

                  <FileText
                    aria-hidden="true"
                    className="h-5 w-5 text-slate-400"
                  />
                </div>
              </article>

              <article
                className="rounded-[18px] border p-5"
                style={{
                  borderColor: cssVariable("--border", "#DCE4EF"),
                  backgroundColor: cssVariable(
                    "--surface-subtle",
                    "#F1F5F9",
                  ),
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-base font-semibold">Operational card</p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Compact staff information without decorative treatment.
                    </p>
                  </div>

                  <Clock3
                    aria-hidden="true"
                    className="h-5 w-5 text-slate-400"
                  />
                </div>
              </article>

              <article className="rounded-[18px] border border-amber-300 bg-amber-50 p-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle
                    aria-hidden="true"
                    className="mt-0.5 h-5 w-5 shrink-0 text-amber-700"
                  />

                  <div>
                    <p className="text-base font-semibold text-amber-950">
                      Action required
                    </p>
                    <p className="mt-2 text-sm leading-6 text-amber-800">
                      This request is approaching its service deadline.
                    </p>
                  </div>
                </div>
              </article>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {statuses.map((status) => (
                <span
                  key={status.label}
                  className="inline-flex items-center gap-2 rounded-[5px] border px-2.5 py-1 text-xs font-semibold"
                  style={{
                    backgroundColor: status.background,
                    color: status.foreground,
                    borderColor: status.border,
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-current"
                  />
                  {status.label}
                </span>
              ))}
            </div>
          </section>

          {/* Navigation */}
          <section
            className="rounded-[18px] border p-6 sm:p-8"
            style={{
              backgroundColor: cssVariable("--surface", "#FFFFFF"),
              borderColor: cssVariable("--border", "#DCE4EF"),
            }}
          >
            <SectionHeader
              eyebrow="10"
              title="Navigation states"
              description="Check default, hover-style, active and disabled navigation treatments."
            />

            <div className="mt-8 max-w-sm rounded-[18px] border p-3">
              <NavigationItem icon={<Inbox />} label="My queue" />

              <NavigationItem
                icon={<FileText />}
                label="Requests"
                active
                count={12}
              />

              <NavigationItem
                icon={<Bell />}
                label="Notifications"
                count={4}
              />

              <NavigationItem icon={<Settings />} label="Settings" disabled />
            </div>
          </section>

          {/* States */}
          <section
            className="rounded-[18px] border p-6 sm:p-8"
            style={{
              backgroundColor: cssVariable("--surface", "#FFFFFF"),
              borderColor: cssVariable("--border", "#DCE4EF"),
            }}
          >
            <SectionHeader
              eyebrow="11"
              title="Page states"
              description="Empty, error and loading treatments must preserve context and suggest the correct next action."
            />

            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              <StateCard
                icon={
                  <Inbox className="h-8 w-8" aria-hidden="true" />
                }
                title="No assigned requests"
                description="New work assigned to you will appear in this queue."
                action="Refresh queue"
              />

              <StateCard
                icon={
                  <XCircle
                    className="h-8 w-8 text-red-600"
                    aria-hidden="true"
                  />
                }
                title="Unable to load requests"
                description="The request list could not be retrieved. No records were changed."
                action="Try again"
                error
              />

              <div
                className="rounded-[18px] border p-5"
                style={{
                  borderColor: cssVariable("--border", "#DCE4EF"),
                }}
                aria-label="Loading example"
              >
                <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
                <div className="mt-5 space-y-3">
                  <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
                </div>
                <div className="mt-8 h-10 w-28 animate-pulse rounded-[10px] bg-slate-200" />
              </div>
            </div>
          </section>

          {/* Table */}
          <section
            className="overflow-hidden rounded-[18px] border"
            style={{
              backgroundColor: cssVariable("--surface", "#FFFFFF"),
              borderColor: cssVariable("--border", "#DCE4EF"),
            }}
          >
            <div className="p-6 sm:p-8">
              <SectionHeader
                eyebrow="12"
                title="Table density"
                description="Verify references, statuses, dates and action controls at staff-workspace density."
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead
                  style={{
                    backgroundColor: cssVariable(
                      "--surface-subtle",
                      "#F1F5F9",
                    ),
                  }}
                >
                  <tr>
                    {[
                      "Reference",
                      "Service",
                      "Applicant",
                      "Status",
                      "Due date",
                      "",
                    ].map((heading) => (
                      <th
                        key={heading || "actions"}
                        scope="col"
                        className="h-11 border-y px-4 text-[11px] font-semibold uppercase tracking-[0.08em]"
                        style={{
                          borderColor: cssVariable("--border", "#DCE4EF"),
                          color: cssVariable(
                            "--muted-foreground",
                            "#64748B",
                          ),
                        }}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {tableRows.map((row) => (
                    <tr key={row.reference}>
                      <td
                        className="h-[52px] border-b px-4 font-mono text-[13px] font-semibold"
                        style={{
                          borderColor: cssVariable("--border", "#DCE4EF"),
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {row.reference}
                      </td>

                      <td
                        className="h-[52px] border-b px-4 text-[13px]"
                        style={{
                          borderColor: cssVariable("--border", "#DCE4EF"),
                        }}
                      >
                        {row.service}
                      </td>

                      <td
                        className="h-[52px] border-b px-4 text-[13px]"
                        style={{
                          borderColor: cssVariable("--border", "#DCE4EF"),
                        }}
                      >
                        {row.applicant}
                      </td>

                      <td
                        className="h-[52px] border-b px-4"
                        style={{
                          borderColor: cssVariable("--border", "#DCE4EF"),
                        }}
                      >
                        <span
                          className="inline-flex rounded-[5px] border px-2 py-1 text-xs font-semibold"
                          style={statusStyle(row.status)}
                        >
                          {row.status}
                        </span>
                      </td>

                      <td
                        className="h-[52px] border-b px-4 text-[13px]"
                        style={{
                          borderColor: cssVariable("--border", "#DCE4EF"),
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {row.due}
                      </td>

                      <td
                        className="h-[52px] border-b px-4 text-right"
                        style={{
                          borderColor: cssVariable("--border", "#DCE4EF"),
                        }}
                      >
                        <button
                          type="button"
                          aria-label={`Open ${row.reference}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] text-slate-500"
                        >
                          <ChevronRight
                            aria-hidden="true"
                            className="h-4 w-4"
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Chart placeholder */}
          <section
            className="rounded-[18px] border p-6 sm:p-8"
            style={{
              backgroundColor: cssVariable("--surface", "#FFFFFF"),
              borderColor: cssVariable("--border", "#DCE4EF"),
            }}
          >
            <SectionHeader
              eyebrow="13"
              title="Chart calibration area"
              description="Recharts will be inserted here after chart tokens are defined."
            />

            <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_320px]">
              <div
                className="relative min-h-[320px] overflow-hidden rounded-[18px] border p-5"
                style={{
                  borderColor: cssVariable("--border", "#DCE4EF"),
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-semibold">Requests submitted</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Previous seven days
                    </p>
                  </div>

                  <span className="text-xs font-medium text-slate-500">
                    Chart placeholder
                  </span>
                </div>

                <div className="mt-8 flex h-52 items-end gap-4 border-b border-l border-slate-200 px-4">
                  {[42, 68, 52, 88, 74, 96, 63].map((height, index) => (
                    <div
                      key={`${height}-${index}`}
                      className="flex h-full flex-1 items-end"
                    >
                      <div
                        className="w-full rounded-t-[5px]"
                        style={{
                          height: `${height}%`,
                          backgroundColor: cssVariable(
                            "--primary",
                            "#2337B8",
                          ),
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <StateCard
                  compact
                  icon={<Inbox className="h-6 w-6" aria-hidden="true" />}
                  title="No chart data"
                  description="No requests were recorded for the selected period."
                />

                <div
                  className="rounded-[18px] border p-5"
                  style={{
                    borderColor: cssVariable("--border", "#DCE4EF"),
                  }}
                >
                  <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                  <div className="mt-6 h-32 animate-pulse rounded-[10px] bg-slate-100" />
                  <div className="mt-4 h-3 w-40 animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            </div>
          </section>
        </div>

        <footer className="py-10 text-center text-xs text-slate-500">
          Temporary developer route · Remove or protect before production
        </footer>
      </div>
    </main>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex max-w-3xl gap-4">
      <span
        className="mt-0.5 inline-flex h-7 min-w-7 items-center justify-center rounded-[5px] px-1.5 text-xs font-bold"
        style={{
          backgroundColor: cssVariable("--primary-soft", "#EEF0FB"),
          color: cssVariable("--primary", "#2337B8"),
        }}
      >
        {eyebrow}
      </span>

      <div>
        <h2
          className="text-xl font-semibold leading-7"
          style={{
            color: cssVariable("--foreground", "#0B1B4D"),
          }}
        >
          {title}
        </h2>

        <p
          className="mt-1 text-sm leading-6"
          style={{
            color: cssVariable("--muted-foreground", "#64748B"),
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

function TypographyExample({
  label,
  className,
  children,
}: {
  label: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-3 lg:grid-cols-[150px_1fr] lg:items-start">
      <p
        className="pt-1 text-[11px] font-semibold uppercase tracking-[0.1em]"
        style={{
          color: cssVariable("--muted-foreground", "#64748B"),
        }}
      >
        {label}
      </p>

      <p
        className={className}
        style={{
          color: cssVariable("--foreground", "#0B1B4D"),
        }}
      >
        {children}
      </p>
    </div>
  );
}

function IconExample({
    label,
    size,
    children,
  }: {
    label: string;
    size: number;
    children: React.ReactElement<{
      size?: number;
      strokeWidth?: number;
      "aria-hidden"?: boolean;
    }>;
  }) {
    return (
      <div
        className="flex min-h-32 min-w-24 flex-col items-center justify-center gap-3 rounded-[10px] border p-4"
        style={{
          borderColor: cssVariable("--border", "#DCE4EF"),
        }}
      >
        <span
          className="flex shrink-0 items-center justify-center"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            color: cssVariable("--primary", "#2337B8"),
          }}
        >
          {cloneElement(children, {
            size,
            strokeWidth: 2,
            "aria-hidden": true,
          })}
        </span>
  
        <span
          className="text-xs font-medium"
          style={{
            color: cssVariable("--muted-foreground", "#64748B"),
          }}
        >
          {label}
        </span>
      </div>
    );
  }

function NavigationItem({
  icon,
  label,
  active = false,
  disabled = false,
  count,
}: {
  icon: React.ReactElement;
  label: string;
  active?: boolean;
  disabled?: boolean;
  count?: number;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={[
        "flex min-h-10 w-full items-center gap-3 rounded-[10px] px-3 text-left text-[13px] font-semibold",
        active ? "" : "text-slate-600 hover:bg-slate-50",
        disabled ? "cursor-not-allowed opacity-40" : "",
      ].join(" ")}
      style={
        active
          ? {
              backgroundColor: cssVariable("--primary-soft", "#EEF0FB"),
              color: cssVariable("--primary", "#2337B8"),
            }
          : undefined
      }
    >
      <span className="[&>svg]:h-[18px] [&>svg]:w-[18px]">{icon}</span>
      <span className="min-w-0 flex-1 truncate">{label}</span>

      {typeof count === "number" ? (
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
          {count}
        </span>
      ) : null}
    </button>
  );
}

function StateCard({
  icon,
  title,
  description,
  action,
  error = false,
  compact = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: string;
  error?: boolean;
  compact?: boolean;
}) {
  return (
    <article
      className={[
        "rounded-[18px] border text-center",
        compact ? "p-5" : "p-6",
      ].join(" ")}
      style={{
        borderColor: error
          ? "#FECDCA"
          : cssVariable("--border", "#DCE4EF"),
        backgroundColor: error ? "#FEF3F2" : undefined,
      }}
    >
      <div
        className={[
          "mx-auto flex items-center justify-center rounded-full",
          compact ? "h-11 w-11" : "h-14 w-14",
          error ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-500",
        ].join(" ")}
      >
        {icon}
      </div>

      <h3
        className="mt-4 text-base font-semibold"
        style={{
          color: error
            ? "#7A271A"
            : cssVariable("--foreground", "#0B1B4D"),
        }}
      >
        {title}
      </h3>

      <p
        className="mx-auto mt-2 max-w-sm text-sm leading-6"
        style={{
          color: error
            ? "#B42318"
            : cssVariable("--muted-foreground", "#64748B"),
        }}
      >
        {description}
      </p>

      {action ? (
        <button
          type="button"
          className="mt-5 inline-flex h-10 items-center justify-center rounded-[10px] border px-4 text-sm font-semibold"
          style={{
            borderColor: error
              ? "#FDA29B"
              : cssVariable("--border-strong", "#C5D1E2"),
            backgroundColor: cssVariable("--surface", "#FFFFFF"),
            color: error
              ? "#B42318"
              : cssVariable("--primary", "#2337B8"),
          }}
        >
          {action}
        </button>
      ) : null}
    </article>
  );
}