import {
    cloneElement,
    type CSSProperties,
    type ReactElement,
    type ReactNode,
  } from "react";
  import {
    AlertTriangle,
    Bell,
    ChevronRight,
    CircleAlert,
    Clock3,
    FileText,
    Inbox,
    Eye,
    LoaderCircle,
    LockKeyhole,
    Plus,
    Search,
    Settings,
    Trash2,
    XCircle,
  } from "lucide-react";
  
  import { ChartShowcase } from "./chart-showcase";
  
  export const metadata = {
    title: "Design Lab | FAIDIA",
    description:
      "Temporary visual testing environment for the FAIDIA design system.",
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
      background: cssVariable("--status-neutral-bg", "#F1F5F9"),
      foreground: cssVariable("--status-neutral-text", "#475569"),
      border: cssVariable("--status-neutral-border", "#CBD5E1"),
    },
    {
      name: "Information",
      label: "In review",
      background: cssVariable("--status-info-bg", "#EEF0FB"),
      foreground: cssVariable("--status-info-text", "#2337B8"),
      border: cssVariable("--status-info-border", "#C7D2FE"),
    },
    {
      name: "Success",
      label: "Completed",
      background: cssVariable("--status-success-bg", "#ECFDF3"),
      foreground: cssVariable("--status-success-text", "#067647"),
      border: cssVariable("--status-success-border", "#ABEFC6"),
    },
    {
      name: "Warning",
      label: "Due soon",
      background: cssVariable("--status-warning-bg", "#FFFAEB"),
      foreground: cssVariable("--status-warning-text", "#B54708"),
      border: cssVariable("--status-warning-border", "#FEDF89"),
    },
    {
      name: "Danger",
      label: "Overdue",
      background: cssVariable("--status-danger-bg", "#FEF3F2"),
      foreground: cssVariable("--status-danger-text", "#B42318"),
      border: cssVariable("--status-danger-border", "#FECDCA"),
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
        backgroundColor: cssVariable("--status-success-bg", "#ECFDF3"),
        color: cssVariable("--status-success-text", "#067647"),
        borderColor: cssVariable("--status-success-border", "#ABEFC6"),
      };
    }
  
    if (status === "Due soon") {
      return {
        backgroundColor: cssVariable("--status-warning-bg", "#FFFAEB"),
        color: cssVariable("--status-warning-text", "#B54708"),
        borderColor: cssVariable("--status-warning-border", "#FEDF89"),
      };
    }
  
    if (status === "Overdue") {
      return {
        backgroundColor: cssVariable("--status-danger-bg", "#FEF3F2"),
        color: cssVariable("--status-danger-text", "#B42318"),
        borderColor: cssVariable("--status-danger-border", "#FECDCA"),
      };
    }
  
    return {
      backgroundColor: cssVariable("--status-info-bg", "#EEF0FB"),
      color: cssVariable("--status-info-text", "#2337B8"),
      borderColor: cssVariable("--status-info-border", "#C7D2FE"),
    };
  }
  
  export default function DesignLabPage() {
    return (
      <main className="min-h-screen bg-background py-8 text-text">
        <div className="content-shell content-wide">
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
  
            {/* Layout geometry */}
            <section className="rounded-lg border border-border bg-surface p-6 shadow-card sm:p-8">
              <SectionHeader
                eyebrow="08"
                title="Layout geometry"
                description="Content widths, responsive breakpoints, sidebar widths and top-bar heights."
              />
  
              <div className="mt-8 space-y-10">
                <div>
                  <h3 className="text-card-title text-foreground">
                    Content widths
                  </h3>
  
                  <p className="text-body mt-1 text-muted-foreground">
                    Content remains centred while each workflow uses a controlled
                    maximum width.
                  </p>
  
                  <div className="mt-5 space-y-4 overflow-hidden rounded-md border border-border bg-background p-4">
                    <div className="max-w-content-narrow rounded-md border border-primary/20 bg-primary-soft p-4">
                      <p className="text-label text-primary">Narrow — 640px</p>
                      <p className="text-body-compact mt-1 text-muted-foreground">
                        Reading pages, confirmations and compact detail views.
                      </p>
                    </div>
  
                    <div className="max-w-content-form rounded-md border border-primary/20 bg-primary-soft p-4">
                      <p className="text-label text-primary">Form — 768px</p>
                      <p className="text-body-compact mt-1 text-muted-foreground">
                        Applicant forms and focused data-entry workflows.
                      </p>
                    </div>
  
                    <div className="max-w-content-standard rounded-md border border-primary/20 bg-primary-soft p-4">
                      <p className="text-label text-primary">
                        Standard — 1152px
                      </p>
                      <p className="text-body-compact mt-1 text-muted-foreground">
                        Staff workspaces, queues and normal dashboard pages.
                      </p>
                    </div>
  
                    <div className="max-w-content-wide rounded-md border border-primary/20 bg-primary-soft p-4">
                      <p className="text-label text-primary">Wide — 1440px</p>
                      <p className="text-body-compact mt-1 text-muted-foreground">
                        Dense admin pages, analytics and wide operational tables.
                      </p>
                    </div>
                  </div>
                </div>
  
                <div>
                  <h3 className="text-card-title text-foreground">
                    Active responsive breakpoint
                  </h3>
  
                  <p className="text-body mt-1 text-muted-foreground">
                    Resize the browser and confirm that exactly one label is
                    visible.
                  </p>
  
                  <div className="mt-5 rounded-md border border-border bg-surface-subtle p-5">
                    <p className="text-label text-primary sm:hidden">
                      Base/mobile — below 640px
                    </p>
  
                    <p className="text-label hidden text-primary sm:block md:hidden">
                      Small — 640px to 767px
                    </p>
  
                    <p className="text-label hidden text-primary md:block lg:hidden">
                      Medium — 768px to 1023px
                    </p>
  
                    <p className="text-label hidden text-primary lg:block xl:hidden">
                      Large — 1024px to 1279px
                    </p>
  
                    <p className="text-label hidden text-primary xl:block 2xl:hidden">
                      Extra large — 1280px to 1439px
                    </p>
  
                    <p className="text-label hidden text-primary 2xl:block">
                      Wide desktop — 1440px and above
                    </p>
                  </div>
                </div>
  
                <div>
                  <h3 className="text-card-title text-foreground">
                    Sidebar dimensions
                  </h3>
  
                  <div className="mt-5 overflow-x-auto rounded-md border border-border bg-background p-4">
                    <div className="min-w-[720px] space-y-4">
                      <div
                        className="flex h-16 items-center rounded-md border border-border-control bg-surface px-4"
                        style={{ width: "var(--sidebar-width-staff)" }}
                      >
                        <span className="text-label text-foreground">
                          Staff/admin — 264px
                        </span>
                      </div>
  
                      <div
                        className="flex h-16 items-center rounded-md border border-border-control bg-surface px-4"
                        style={{ width: "var(--sidebar-width-applicant)" }}
                      >
                        <span className="text-label text-foreground">
                          Applicant — 248px
                        </span>
                      </div>
  
                      <div
                        className="flex h-16 items-center justify-center rounded-md border border-border-control bg-surface"
                        style={{ width: "var(--sidebar-width-collapsed)" }}
                      >
                        <span className="text-label text-foreground">72px</span>
                      </div>
                    </div>
                  </div>
                </div>
  
                <div>
                  <h3 className="text-card-title text-foreground">
                    Top-bar dimensions
                  </h3>
  
                  <div className="mt-5 space-y-4">
                    <div
                      className="flex items-center rounded-md border border-border-control bg-surface px-4"
                      style={{ height: "var(--topbar-height-mobile)" }}
                    >
                      <span className="text-label text-foreground">
                        Mobile top bar — 56px
                      </span>
                    </div>
  
                    <div
                      className="flex items-center rounded-md border border-border-control bg-surface px-4"
                      style={{ height: "var(--topbar-height-desktop)" }}
                    >
                      <span className="text-label text-foreground">
                        Desktop top bar — 64px
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
  
            {/* Buttons, inputs and focus states */}
            <section className="card-base card-comfortable shadow-card">
              <SectionHeader
                eyebrow="09"
                title="Buttons, inputs and focus states"
                description="Calibrate button variants, field states and keyboard focus before reusable components are built."
              />
  
              <div className="mt-8 grid gap-10 xl:grid-cols-2">
                <div>
                  <h3 className="text-card-title text-foreground">
                    Button variants
                  </h3>
  
                  <p className="text-body mt-1 text-muted-foreground">
                    Primary actions remain dominant. Secondary, ghost and
                    destructive actions use quieter visual treatments.
                  </p>
  
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      className="button-base button-comfortable button-primary"
                    >
                      <Plus
                        aria-hidden="true"
                        className="icon-16"
                        strokeWidth={1.4}
                        absoluteStrokeWidth
                      />
                      Create request
                    </button>
  
                    <button
                      type="button"
                      className="button-base button-comfortable button-secondary"
                    >
                      <FileText
                        aria-hidden="true"
                        className="icon-16"
                        strokeWidth={1.4}
                        absoluteStrokeWidth
                      />
                      View document
                    </button>
  
                    <button
                      type="button"
                      className="button-base button-comfortable button-ghost"
                    >
                      <Eye
                        aria-hidden="true"
                        className="icon-16"
                        strokeWidth={1.4}
                        absoluteStrokeWidth
                      />
                      Preview
                    </button>
  
                    <button
                      type="button"
                      className="button-base button-comfortable button-destructive"
                    >
                      <Trash2
                        aria-hidden="true"
                        className="icon-16"
                        strokeWidth={1.4}
                        absoluteStrokeWidth
                      />
                      Delete
                    </button>
  
                    <button
                      type="button"
                      disabled
                      className="button-base button-comfortable button-secondary"
                    >
                      Disabled
                    </button>
  
                    <button
                      type="button"
                      aria-busy="true"
                      className="button-base button-comfortable button-primary"
                    >
                      <LoaderCircle
                        aria-hidden="true"
                        className="icon-16 animate-spin"
                        strokeWidth={1.4}
                        absoluteStrokeWidth
                      />
                      Saving
                    </button>
  
                    <button
                      type="button"
                      aria-label="Notifications"
                      className="button-base button-icon button-secondary"
                    >
                      <Bell
                        aria-hidden="true"
                        className="icon-18"
                        strokeWidth={1.4}
                        absoluteStrokeWidth
                      />
                    </button>
                  </div>
  
                  <div className="mt-8">
                    <p className="text-label text-foreground">
                      Size comparison
                    </p>
  
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        className="button-base button-dense button-secondary"
                      >
                        Dense 36px
                      </button>
  
                      <button
                        type="button"
                        className="button-base button-compact button-secondary"
                      >
                        Compact 40px
                      </button>
  
                      <button
                        type="button"
                        className="button-base button-comfortable button-primary"
                      >
                        Comfortable 44px
                      </button>
                    </div>
                  </div>
  
                  <div className="mt-8">
                    <p className="text-label text-foreground">
                      Keyboard-focus preview
                    </p>
  
                    <p className="text-body mt-1 text-muted-foreground">
                      The static preview below matches the ring displayed when
                      keyboard users press Tab.
                    </p>
  
                    <div className="mt-5 flex flex-wrap items-center gap-6 p-2">
                      <button
                        type="button"
                        className="button-base button-compact button-primary focus-preview"
                      >
                        Focused button
                      </button>
  
                      <button
                        type="button"
                        className="button-base button-icon button-secondary focus-preview"
                        aria-label="Focused icon button"
                      >
                        <Bell
                          aria-hidden="true"
                          className="icon-18"
                          strokeWidth={1.4}
                          absoluteStrokeWidth
                        />
                      </button>
                    </div>
                  </div>
                </div>
  
                <div>
                  <h3 className="text-card-title text-foreground">
                    Input variants
                  </h3>
  
                  <p className="text-body mt-1 text-muted-foreground">
                    Field variants retain the approved 36px, 40px and 50px
                    dimensions while exposing clear disabled, read-only, invalid
                    and focus states.
                  </p>
  
                  <div className="mt-5 space-y-5">
                    <label className="block">
                      <span className="field-label">Dense input · 36px</span>
                      <input
                        type="text"
                        placeholder="Dense operational input"
                        className="input-base input-dense"
                      />
                      <span className="field-help">
                        Use for dense filters and compact staff tools.
                      </span>
                    </label>
  
                    <label className="block">
                      <span className="field-label">
                        Staff search · 40px
                      </span>
  
                      <div className="relative">
                        <Search
                          aria-hidden="true"
                          className="icon-16 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          strokeWidth={1.4}
                          absoluteStrokeWidth
                        />
  
                        <input
                          type="search"
                          placeholder="Search requests"
                          className="input-base input-compact input-icon-start"
                        />
                      </div>
                    </label>
  
                    <label className="block">
                      <span className="field-label">
                        Applicant input · 50px
                      </span>
                      <input
                        type="text"
                        placeholder="Enter admission number"
                        className="input-base input-applicant"
                      />
                      <span className="field-help">
                        Longer applicant-facing workflows use the taller control.
                      </span>
                    </label>
  
                    <label className="block">
                      <span className="field-label">Read-only input</span>
                      <div className="relative">
                        <LockKeyhole
                          aria-hidden="true"
                          className="icon-16 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          strokeWidth={1.4}
                          absoluteStrokeWidth
                        />
                        <input
                          type="text"
                          readOnly
                          value="REQ-2026-00421"
                          className="input-base input-compact input-icon-start text-reference"
                        />
                      </div>
                    </label>
  
                    <label className="block">
                      <span className="field-label">Disabled input</span>
                      <input
                        type="text"
                        disabled
                        value="Unavailable until approval"
                        className="input-base input-compact"
                      />
                    </label>
  
                    <label className="block">
                      <span className="field-label text-status-danger-text">
                        Invalid applicant input
                      </span>
                      <input
                        type="text"
                        aria-invalid="true"
                        aria-describedby="design-lab-error"
                        defaultValue="Incorrect reference"
                        className="input-base input-applicant"
                      />
                      <span id="design-lab-error" className="field-error">
                        Enter a valid institutional reference number.
                      </span>
                    </label>
  
                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="block">
                        <span className="field-label">Focused input preview</span>
                        <input
                          type="text"
                          defaultValue="Active field"
                          className="input-base input-compact input-focus-preview"
                        />
                      </label>
  
                      <label className="block">
                        <span className="field-label text-status-danger-text">
                          Error-focus preview
                        </span>
                        <input
                          type="text"
                          aria-invalid="true"
                          defaultValue="Invalid value"
                          className="input-base input-compact input-error-focus-preview"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </section>
  
            {/* Cards and badges */}
            <section className="card-base card-comfortable shadow-card">
              <SectionHeader
                eyebrow="10"
                title="Cards and badges"
                description="Compare standard, subtle, interactive, selected and action-required cards alongside the approved badge system."
              />
  
              <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                <article className="card-base card-default">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-card-title text-foreground">
                        Standard card
                      </p>
                      <p className="text-body mt-2 text-muted-foreground">
                        Normal information and low-priority operational content.
                      </p>
                    </div>
                    <FileText
                      aria-hidden="true"
                      className="icon-20 text-muted-foreground"
                      strokeWidth={1.4}
                      absoluteStrokeWidth
                    />
                  </div>
                </article>
  
                <article className="card-base card-default card-subtle">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-card-title text-foreground">
                        Subtle operational card
                      </p>
                      <p className="text-body mt-2 text-muted-foreground">
                        Dense staff information that should remain visually quiet.
                      </p>
                    </div>
                    <Clock3
                      aria-hidden="true"
                      className="icon-20 text-muted-foreground"
                      strokeWidth={1.4}
                      absoluteStrokeWidth
                    />
                  </div>
                </article>
  
                <article
                  tabIndex={0}
                  className="card-base card-default card-interactive"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-card-title text-foreground">
                        Interactive card
                      </p>
                      <p className="text-body mt-2 text-muted-foreground">
                        Hover or focus this card to inspect its interactive state.
                      </p>
                    </div>
                    <ChevronRight
                      aria-hidden="true"
                      className="icon-20 text-primary"
                      strokeWidth={1.4}
                      absoluteStrokeWidth
                    />
                  </div>
                </article>
  
                <article className="card-base card-default card-selected">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-card-title text-primary">
                        Selected card
                      </p>
                      <p className="text-body mt-2 text-muted-foreground">
                        Used when a user has explicitly selected an option.
                      </p>
                    </div>
                    <CircleAlert
                      aria-hidden="true"
                      className="icon-20 text-primary"
                      strokeWidth={1.4}
                      absoluteStrokeWidth
                    />
                  </div>
                </article>
  
                <article className="card-base card-default card-warning">
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      aria-hidden="true"
                      className="icon-20 mt-0.5 shrink-0"
                      strokeWidth={1.4}
                      absoluteStrokeWidth
                    />
                    <div>
                      <p className="text-card-title">Action required</p>
                      <p className="text-body mt-2">
                        This request is approaching its service deadline.
                      </p>
                    </div>
                  </div>
                </article>
  
                <article className="card-base card-default card-danger">
                  <div className="flex items-start gap-3">
                    <XCircle
                      aria-hidden="true"
                      className="icon-20 mt-0.5 shrink-0"
                      strokeWidth={1.4}
                      absoluteStrokeWidth
                    />
                    <div>
                      <p className="text-card-title">Failed operation</p>
                      <p className="text-body mt-2">
                        Use danger cards only when the whole surface represents a
                        failed or destructive state.
                      </p>
                    </div>
                  </div>
                </article>
              </div>
  
              <div className="mt-10">
                <h3 className="text-card-title text-foreground">
                  Status badges
                </h3>
                <p className="text-body mt-1 text-muted-foreground">
                  Every semantic badge combines text with a border and optional
                  status dot. Colour is never the only identifier.
                </p>
  
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <span className="badge-base badge-default badge-dot badge-neutral">
                    Draft
                  </span>
                  <span className="badge-base badge-default badge-dot badge-info">
                    In review
                  </span>
                  <span className="badge-base badge-default badge-dot badge-success">
                    Completed
                  </span>
                  <span className="badge-base badge-default badge-dot badge-warning">
                    Due soon
                  </span>
                  <span className="badge-base badge-default badge-dot badge-danger">
                    Overdue
                  </span>
                  <span className="badge-base badge-default badge-outline">
                    Outline
                  </span>
                  <span className="badge-base badge-default badge-count badge-info">
                    12
                  </span>
                </div>
  
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <span className="badge-base badge-compact badge-neutral">
                    Compact
                  </span>
                  <span className="badge-base badge-default badge-neutral">
                    Default
                  </span>
                </div>
              </div>
            </section>
  
            {/* Navigation */}
            <section className="card-base card-comfortable shadow-card">
              <SectionHeader
                eyebrow="11"
                title="Navigation states"
                description="Check default, hover, pressed, active, counted, disabled and keyboard-focus treatments."
              />
  
              <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,384px)_1fr]">
                <div className="card-base card-compact">
                  <div className="nav-list">
                    <NavigationItem icon={<Inbox />} label="Default item" />
  
                    <NavigationItem
                      icon={<Search />}
                      label="Hover preview"
                      preview="hover"
                    />
  
                    <NavigationItem
                      icon={<Bell />}
                      label="Pressed preview"
                      preview="pressed"
                      count={4}
                    />
  
                    <NavigationItem
                      icon={<FileText />}
                      label="Active page"
                      active
                      count={12}
                    />
  
                    <NavigationItem
                      icon={<Settings />}
                      label="Disabled item"
                      disabled
                    />
                  </div>
                </div>
  
                <div className="space-y-5">
                  <div className="card-base card-default card-subtle">
                    <h3 className="text-card-title text-foreground">
                      State rules
                    </h3>
                    <div className="text-body mt-3 space-y-2 text-muted-foreground">
                      <p>
                        Default items use muted text and a transparent background.
                      </p>
                      <p>
                        Hover uses a subtle surface; pressed uses primary-soft.
                      </p>
                      <p>
                        Active pages use primary-soft, a visible border and a
                        three-pixel leading indicator.
                      </p>
                      <p>
                        Disabled items remain visible but cannot receive pointer
                        interaction.
                      </p>
                    </div>
                  </div>
  
                  <div className="card-base card-default">
                    <h3 className="text-card-title text-foreground">
                      Keyboard-focus test
                    </h3>
                    <p className="text-body mt-2 text-muted-foreground">
                      Click outside this panel, press Tab and confirm that the
                      navigation item receives a visible focus ring before it is
                      activated.
                    </p>
  
                    <div className="mt-5 max-w-sm">
                      <NavigationItem
                        icon={<Inbox />}
                        label="Focus preview"
                        focusPreview
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
  
            {/* System states */}
            <section className="rounded-lg border border-border bg-surface p-6 shadow-card sm:p-8">
              <SectionHeader
                eyebrow="12"
                title="System states"
                description="Empty, error and loading states must preserve context, explain what happened and provide the correct next action."
              />
  
              <div className="mt-8 grid gap-5 xl:grid-cols-3">
                <StateCard
                  variant="empty"
                  icon={
                    <Inbox
                      className="icon-32"
                      strokeWidth={1.4}
                      absoluteStrokeWidth
                      aria-hidden="true"
                    />
                  }
                  title="No assigned requests"
                  description="New work assigned to you will appear in this queue. You can refresh now or return to the full request list."
                  primaryAction="Refresh queue"
                  secondaryAction="View all requests"
                />
  
                <StateCard
                  variant="error"
                  icon={
                    <XCircle
                      className="icon-32"
                      strokeWidth={1.4}
                      absoluteStrokeWidth
                      aria-hidden="true"
                    />
                  }
                  title="Unable to load requests"
                  description="The request list could not be retrieved. No records were changed, and it is safe to try again."
                  primaryAction="Try again"
                  secondaryAction="View system status"
                />
  
                <LoadingStatePreview />
              </div>
  
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div className="state-inline">
                  <span className="state-icon !size-10">
                    <Search
                      className="icon-20"
                      strokeWidth={1.4}
                      absoluteStrokeWidth
                      aria-hidden="true"
                    />
                  </span>
  
                  <div>
                    <p className="text-label text-foreground">
                      No matching results
                    </p>
                    <p className="text-body-compact mt-1 text-muted-foreground">
                      Keep the current search visible and offer a direct way to
                      clear the active filters.
                    </p>
                  </div>
                </div>
  
                <div className="state-inline state-inline-error">
                  <span className="inline-flex shrink-0 text-status-danger-text">
                    <CircleAlert
                      className="icon-20"
                      strokeWidth={1.4}
                      absoluteStrokeWidth
                      aria-hidden="true"
                    />
                  </span>
  
                  <div>
                    <p className="text-label">Document upload failed</p>
                    <p className="text-body-compact mt-1">
                      State what failed, confirm whether data was preserved and
                      provide a recovery action.
                    </p>
                  </div>
                </div>
              </div>
            </section>
  
            {/* Table */}
            <section className="rounded-lg border border-border bg-surface shadow-card">
              <div className="p-6 sm:p-8">
                <SectionHeader
                  eyebrow="13"
                  title="Table density"
                  description="Compare dense, compact and comfortable operational table rows."
                />
  
                <div className="mt-8 space-y-8">
                  <TableDensityPreview
                    title="Dense — 40px rows"
                    description="High-volume queues and tightly managed admin tables."
                    densityClassName="table-density-dense"
                  />
  
                  <TableDensityPreview
                    title="Compact — 48px rows"
                    description="Default density for staff workspaces and request queues."
                    densityClassName="table-density-compact"
                    recommended
                  />
  
                  <TableDensityPreview
                    title="Comfortable — 56px rows"
                    description="Low-density review tables and applicant-facing summaries."
                    densityClassName="table-density-comfortable"
                  />
                </div>
              </div>
            </section>
  
            {/* Recharts system */}
            <section className="rounded-lg border border-border bg-surface p-6 shadow-card sm:p-8">
              <SectionHeader
                eyebrow="14"
                title="Recharts system"
                description="Calibrate chart colours, typography, gridlines, tooltips, legends, empty states and loading states."
              />
  
              <div className="mt-8">
                <ChartShowcase />
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
    children: ReactNode;
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
    children: ReactElement<{
      size?: number;
      strokeWidth?: number;
      absoluteStrokeWidth?: boolean;
      "aria-hidden"?: boolean;
    }>;
  }) {
    return (
      <div className="flex min-h-32 min-w-24 flex-col items-center justify-center gap-3 rounded-md border border-border p-4">
        <span
          className="flex shrink-0 items-center justify-center text-primary"
          style={{
            width: `${size}px`,
            height: `${size}px`,
          }}
        >
          {cloneElement(children, {
            size,
            strokeWidth: 1.4,
            absoluteStrokeWidth: true,
            "aria-hidden": true,
          })}
        </span>
  
        <span className="text-body-compact font-medium text-muted-foreground">
          {label}
        </span>
      </div>
    );
  }
  
  function TableDensityPreview({
    title,
    description,
    densityClassName,
    recommended = false,
  }: {
    title: string;
    description: string;
    densityClassName:
      | "table-density-dense"
      | "table-density-compact"
      | "table-density-comfortable";
    recommended?: boolean;
  }) {
    return (
      <div>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-card-title text-foreground">{title}</h3>
            <p className="text-body-compact mt-1 text-muted-foreground">
              {description}
            </p>
          </div>
  
          {recommended ? (
            <span className="inline-flex w-fit rounded-sm border border-status-info-border bg-status-info-bg px-2.5 py-1 text-caption font-semibold text-status-info-text">
              Default staff density
            </span>
          ) : null}
        </div>
  
        <div className="overflow-x-auto rounded-md border border-border">
          <table className={`${densityClassName} min-w-[760px]`}>
            <thead className="bg-surface-subtle">
              <tr>
                {["Reference", "Service", "Applicant", "Status", "Due date", ""].map(
                  (heading) => (
                    <th
                      key={heading || "actions"}
                      scope="col"
                      className="whitespace-nowrap uppercase tracking-[0.08em]"
                    >
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
  
            <tbody>
              {tableRows.map((row) => (
                <tr key={`${densityClassName}-${row.reference}`}>
                  <td className="text-reference whitespace-nowrap font-semibold text-foreground">
                    {row.reference}
                  </td>
  
                  <td className="whitespace-nowrap text-foreground">
                    {row.service}
                  </td>
  
                  <td className="whitespace-nowrap text-foreground">
                    {row.applicant}
                  </td>
  
                  <td>
                    <span
                      className="inline-flex whitespace-nowrap rounded-sm border px-2 py-1 text-caption font-semibold"
                      style={statusStyle(row.status)}
                    >
                      {row.status}
                    </span>
                  </td>
  
                  <td className="numbers-tabular whitespace-nowrap text-foreground">
                    {row.due}
                  </td>
  
                  <td className="text-right">
                    <button
                      type="button"
                      aria-label={`Open ${row.reference}`}
                      className="button-base button-icon button-ghost"
                    >
                      <ChevronRight
                        aria-hidden="true"
                        className="icon-16"
                        strokeWidth={1.4}
                        absoluteStrokeWidth
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  
  function NavigationItem({
    icon,
    label,
    active = false,
    disabled = false,
    count,
    preview,
    focusPreview = false,
  }: {
    icon: ReactElement<{
      className?: string;
      strokeWidth?: number;
      absoluteStrokeWidth?: boolean;
      "aria-hidden"?: boolean;
    }>;
    label: string;
    active?: boolean;
    disabled?: boolean;
    count?: number;
    preview?: "hover" | "pressed";
    focusPreview?: boolean;
  }) {
    return (
      <button
        type="button"
        disabled={disabled}
        aria-current={active ? "page" : undefined}
        className={[
          "nav-item",
          preview === "hover" ? "nav-item-preview-hover" : "",
          preview === "pressed" ? "nav-item-preview-pressed" : "",
          focusPreview ? "focus-preview" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <span className="nav-item-icon">
          {cloneElement(icon, {
            className: "icon-18",
            strokeWidth: 1.4,
            absoluteStrokeWidth: true,
            "aria-hidden": true,
          })}
        </span>
  
        <span className="nav-item-label">{label}</span>
  
        {typeof count === "number" ? (
          <span className="nav-item-count">{count}</span>
        ) : null}
      </button>
    );
  }
  
  function StateCard({
    icon,
    title,
    description,
    primaryAction,
    secondaryAction,
    variant,
  }: {
    icon: ReactNode;
    title: string;
    description: string;
    primaryAction?: string;
    secondaryAction?: string;
    variant: "empty" | "error";
  }) {
    const isError = variant === "error";
  
    return (
      <article
        className={[
          "state-panel",
          isError ? "state-panel-error" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <span className="state-icon">{icon}</span>
  
        <h3 className="state-title">{title}</h3>
        <p className="state-description">{description}</p>
  
        {primaryAction || secondaryAction ? (
          <div className="state-actions">
            {primaryAction ? (
              <button
                type="button"
                className={[
                  "button-base button-compact",
                  isError ? "button-destructive" : "button-primary",
                ].join(" ")}
              >
                {primaryAction}
              </button>
            ) : null}
  
            {secondaryAction ? (
              <button
                type="button"
                className="button-base button-compact button-secondary"
              >
                {secondaryAction}
              </button>
            ) : null}
          </div>
        ) : null}
      </article>
    );
  }
  
  function LoadingStatePreview() {
    return (
      <article
        className="loading-panel"
        role="status"
        aria-label="Loading request list"
        aria-busy="true"
      >
        <div className="loading-status">
          <LoaderCircle
            className="icon-16 animate-spin"
            strokeWidth={1.4}
            absoluteStrokeWidth
            aria-hidden="true"
          />
          Loading requests
        </div>
  
        <div className="mt-6 space-y-4" aria-hidden="true">
          <div className="skeleton skeleton-title" />
  
          <div className="space-y-3">
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line skeleton-line-short" />
          </div>
  
          <div className="mt-8 flex gap-3">
            <div className="skeleton skeleton-control" />
            <div className="skeleton skeleton-control" />
          </div>
        </div>
  
        <span className="sr-only">
          Request data is loading. Existing content has not changed.
        </span>
      </article>
    );
  }