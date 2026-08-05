type AdminRouteSurfaceProps = Readonly<{
  section: string;
  title: string;
  description: string;
  route: string;
  capabilities: readonly string[];
}>;

/**
 * D34-2 canonical admin route surface.
 *
 * This component provides page content only. Shell, sidebar, top bar, role,
 * organization identity, and mobile navigation remain owned by
 * app/demo/admin/layout.tsx and its existing AdminWorkspaceShell.
 */
export function AdminRouteSurface({
  section,
  title,
  description,
  route,
  capabilities,
}: AdminRouteSurfaceProps) {
  return (
    <main className="mx-auto w-full max-w-[1440px] px-5 py-6 sm:px-7 lg:px-9 lg:py-8">
      <section
        aria-labelledby="admin-route-title"
        className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              {section}
            </p>
            <h1
              id="admin-route-title"
              className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-3xl"
            >
              {title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-[15px]">
              {description}
            </p>
          </div>

          <div className="shrink-0 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-800">
              Route surface
            </p>
            <p className="mt-1 text-sm font-medium text-emerald-950">
              Ready for demo integration
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {capabilities.map((capability, index) => (
            <article
              key={capability}
              className="min-h-32 rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <p className="text-xs font-semibold text-slate-500">
                {String(index + 1).padStart(2, "0")}
              </p>
              <p className="mt-3 text-sm font-semibold leading-6 text-slate-900">
                {capability}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-950 px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
              Canonical admin destination
            </p>
            <p className="mt-1 break-all font-mono text-sm text-slate-100">
              {route}
            </p>
          </div>
          <p className="text-sm text-slate-300">
            Full feature behavior is implemented in later bounded stages.
          </p>
        </div>
      </section>
    </main>
  );
}
