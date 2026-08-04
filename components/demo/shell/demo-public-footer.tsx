import Link from "next/link";

import { getDefaultDemoClient } from "@/config/demo";

export function DemoPublicFooter() {
  const client = getDefaultDemoClient();

  const primaryService =
    client.services.find((service) => service.featured) ??
    client.services[0];

  const serviceHref = `/demo/services/${
    primaryService?.slug ?? "transcript-request"
  }`;

  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <section>
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold text-slate-950"
              style={{
                backgroundColor: client.branding.accentColor,
              }}
            >
              {client.branding.logoMark}
            </span>

            <div>
              <p className="text-sm font-bold">
                {client.organization.name}
              </p>
              <p className="text-xs text-slate-400">
                Digital Service Portal
              </p>
            </div>
          </div>

          <p className="mt-5 max-w-sm text-sm leading-6 text-slate-300">
            {client.organization.description}
          </p>
        </section>

        <section>
          <h2 className="text-sm font-bold">Service links</h2>

          <nav
            aria-label="Footer service links"
            className="mt-4 grid gap-3 text-sm"
          >
            <Link
              href="/demo"
              className="text-slate-300 transition hover:text-white"
            >
              Portal home
            </Link>

            <Link
              href={serviceHref}
              className="text-slate-300 transition hover:text-white"
            >
              Service information
            </Link>

            <Link
              href="/demo/track/REQ-DEMO-001"
              className="text-slate-300 transition hover:text-white"
            >
              Track a request
            </Link>

            <Link
              href="/demo/officer"
              className="text-slate-300 transition hover:text-white"
            >
              Staff workspace
            </Link>
          </nav>
        </section>

        <section>
          <h2 className="text-sm font-bold">Contact</h2>

          <address className="mt-4 grid gap-3 text-sm not-italic text-slate-300">
            <span>{client.organization.location}</span>

            <a
              href={`mailto:${client.organization.contact.email}`}
              className="transition hover:text-white"
            >
              {client.organization.contact.email}
            </a>

            <a
              href={`tel:${client.organization.contact.phone.replace(
                /\s/g,
                "",
              )}`}
              className="transition hover:text-white"
            >
              {client.organization.contact.phone}
            </a>
          </address>
        </section>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-5 text-xs text-slate-400 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>
            © {new Date().getFullYear()}{" "}
            {client.organization.name}
         </p>

          <p>
            Synthetic FAIDIA demonstration. No production records
            are used.
          </p>
        </div>
      </div>
    </footer>
  );
}
