export const dynamic = "force-static";

const journeyCards = [
  {
    title: "Homepage",
    description: "Savannah Technical College student-services homepage.",
    href: "/demo",
  },
  {
    title: "Service information",
    description: "Transcript requirements, eligibility, documents and timing.",
    href: "/demo/services/transcript-request",
  },
  {
    title: "Applicant sign-up",
    description: "Create the seeded applicant session used in the demonstration.",
    href: "/demo/sign-up",
  },
  {
    title: "Application form",
    description: "Complete the transcript request form and upload demo documents.",
    href: "/demo/apply/transcript-request",
  },
  {
    title: "Submission confirmation",
    description: "Review the generated request reference and next steps.",
    href: "/demo/requests/REQ-DEMO-001/confirmation",
  },
  {
    title: "Applicant tracking",
    description: "Follow the student-safe request timeline.",
    href: "/demo/track/REQ-DEMO-001",
  },
  {
    title: "Officer dashboard",
    description: "Open the Student Records operational queue.",
    href: "/demo/officer",
  },
  {
    title: "Officer review",
    description: "Review documents, request corrections and create a Finance referral.",
    href: "/demo/officer/requests/REQ-DEMO-001",
  },
  {
    title: "Finance inbox",
    description: "Open the receiving department handoff queue.",
    href: "/demo/department",
  },
  {
    title: "Finance processing",
    description: "Accept, verify and return the Finance result.",
    href: "/demo/department/handoffs/HND-DEMO-001",
  },
  {
    title: "Supervisor dashboard",
    description: "Review the Registrar approval queue and workload.",
    href: "/demo/supervisor",
  },
  {
    title: "Registrar approval",
    description: "Confirm prerequisites and record the final decision.",
    href: "/demo/supervisor/approvals/REQ-DEMO-001",
  },
  {
    title: "Controlled outcome",
    description: "Issue, download or record collection of the exact outcome.",
    href: "/demo/outcomes/REQ-DEMO-001",
  },
  {
    title: "Operational reports",
    description: "Review workload, SLA health, backlog and workflow completion.",
    href: "/demo/reports",
  },
];

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderCard(card: (typeof journeyCards)[number], index: number) {
  return `
    <a class="card" href="${escapeHtml(card.href)}">
      <span class="number">${String(index + 1).padStart(2, "0")}</span>
      <span class="card-copy">
        <strong>${escapeHtml(card.title)}</strong>
        <span>${escapeHtml(card.description)}</span>
        <code>${escapeHtml(card.href)}</code>
      </span>
      <span class="arrow" aria-hidden="true">→</span>
    </a>
  `;
}

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>FAIDIA demonstration journey</title>
    <style>
      :root {
        color-scheme: light;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: #f4f6fa;
        color: #101827;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        min-width: 320px;
      }

      a {
        color: inherit;
      }

      .page {
        width: min(1120px, calc(100% - 40px));
        margin: 0 auto;
        padding: 56px 0 72px;
      }

      .topline {
        display: flex;
        justify-content: space-between;
        gap: 24px;
        align-items: center;
        margin-bottom: 48px;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 800;
      }

      .mark {
        display: grid;
        width: 44px;
        height: 44px;
        place-items: center;
        border-radius: 12px;
        background: #070a12;
        color: white;
        letter-spacing: .08em;
      }

      .back {
        min-height: 44px;
        display: inline-flex;
        align-items: center;
        padding: 0 16px;
        border: 1px solid #d9deea;
        border-radius: 10px;
        text-decoration: none;
        background: white;
        font-weight: 700;
      }

      .eyebrow {
        margin: 0 0 14px;
        color: #2f5bff;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: .13em;
        text-transform: uppercase;
      }

      h1 {
        max-width: 780px;
        margin: 0;
        font-family: "Plus Jakarta Sans", Inter, ui-sans-serif, system-ui, sans-serif;
        font-size: clamp(42px, 6vw, 72px);
        line-height: 1;
        letter-spacing: -.045em;
      }

      .lead {
        max-width: 720px;
        margin: 22px 0 0;
        color: #5f6775;
        font-size: 18px;
        line-height: 1.65;
      }

      .note {
        margin-top: 24px;
        padding: 16px 18px;
        border-left: 4px solid #d9f45b;
        background: #fff;
        color: #4b5565;
        line-height: 1.55;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 14px;
        margin-top: 42px;
      }

      .card {
        display: grid;
        grid-template-columns: 46px minmax(0, 1fr) auto;
        gap: 16px;
        align-items: start;
        min-height: 132px;
        padding: 20px;
        border: 1px solid #e1e5ed;
        border-radius: 14px;
        background: white;
        text-decoration: none;
        transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
      }

      .card:hover {
        transform: translateY(-2px);
        border-color: #aab9ff;
        box-shadow: 0 14px 34px rgba(16, 24, 39, .08);
      }

      .card:focus-visible,
      .back:focus-visible {
        outline: 3px solid #2f5bff;
        outline-offset: 3px;
      }

      .number {
        color: #2f5bff;
        font-variant-numeric: tabular-nums;
        font-weight: 800;
      }

      .card-copy {
        display: grid;
        gap: 8px;
      }

      .card-copy strong {
        font-family: "Plus Jakarta Sans", Inter, ui-sans-serif, system-ui, sans-serif;
        font-size: 18px;
      }

      .card-copy > span {
        color: #5f6775;
        line-height: 1.5;
      }

      code {
        overflow-wrap: anywhere;
        color: #2046d9;
        font-size: 12px;
      }

      .arrow {
        font-size: 22px;
      }

      @media (max-width: 760px) {
        .page {
          width: min(100% - 32px, 1120px);
          padding-top: 30px;
        }

        .topline {
          align-items: flex-start;
        }

        .grid {
          grid-template-columns: 1fr;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          scroll-behavior: auto !important;
          transition-duration: .01ms !important;
        }
      }
    </style>
  </head>
  <body>
    <main class="page">
      <div class="topline">
        <div class="brand">
          <span class="mark">F</span>
          <span>FAIDIA Demo Engine</span>
        </div>
        <a class="back" href="/demo">Return to college homepage</a>
      </div>

      <p class="eyebrow">Presentation control centre</p>
      <h1>Complete demonstration journey</h1>
      <p class="lead">
        Open any stage directly or move through the full Savannah Technical College
        transcript-request story from student discovery to controlled outcome.
      </p>
      <div class="note">
        This route is a demonstration map for presenters and staff. It is intentionally
        separated from the student-facing homepage.
      </div>

      <section class="grid" aria-label="Demonstration routes">
        ${journeyCards.map(renderCard).join("")}
      </section>
    </main>
  </body>
</html>`;

export function GET() {
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
