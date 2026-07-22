import Image from "next/image";

import { PRIMARY_HOMEPAGE_REFERENCE } from "@/config/demo/homepage-reference";

export function HomepageReferencePreview() {
  const reference = PRIMARY_HOMEPAGE_REFERENCE;

  return (
    <section
      aria-labelledby="homepage-reference-preview-title"
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            D10 · Approved homepage reference
          </p>

          <h2
            id="homepage-reference-preview-title"
            className="mt-3 text-3xl font-bold tracking-tight text-slate-950"
          >
            {reference.name}
          </h2>

          <p className="mt-4 text-sm leading-6 text-slate-600">
            {reference.purpose}
          </p>
        </div>

        <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
          {reference.approvalStatus}
        </span>
      </div>

      <figure className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
        <div className="relative aspect-[16/10] w-full">
          <Image
            src={reference.imagePath}
            alt={reference.imageAlt}
            fill
            priority
            unoptimized
            sizes="(min-width: 1280px) 1120px, 100vw"
            className="object-contain"
          />
        </div>

        <figcaption className="border-t border-slate-200 bg-white px-5 py-4 text-sm leading-6 text-slate-600">
          This screenshot is a design reference. D11 will translate
          it into responsive React components using the active client
          configuration and existing public-service journey.
        </figcaption>
      </figure>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <section>
          <h3 className="text-sm font-bold text-slate-950">
            Implementation principles
          </h3>

          <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-600">
            {reference.implementationPrinciples.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-sm font-bold text-slate-950">
            Preserve from the reference
          </h3>

          <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-600">
            {reference.preserve.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-sm font-bold text-slate-950">
            Do not carry forward
          </h3>

          <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-600">
            {reference.avoid.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}
