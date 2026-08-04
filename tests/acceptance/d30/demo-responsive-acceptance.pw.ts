import {
  expect,
  test,
  type Page,
} from "@playwright/test";
import {
  mkdir,
} from "node:fs/promises";
import {
  readFileSync,
} from "node:fs";
import path from "node:path";

type DemoRole =
  | "public"
  | "applicant"
  | "officer"
  | "supervisor"
  | "admin";

type ResponsiveRoute = {
  readonly id: string;
  readonly path: string;
  readonly role: DemoRole;
  readonly requiresChart: boolean;
};

type ResponsiveViewport = {
  readonly id: string;
  readonly width: number;
  readonly height: number;
};

type ResponsiveManifest = {
  readonly routes:
    readonly ResponsiveRoute[];
  readonly viewports:
    readonly ResponsiveViewport[];
};

const manifest =
  JSON.parse(
    readFileSync(
      path.resolve(
        "docs/demo-engine-base/d30-freeze/"
          + "D30-13-RESPONSIVE-MANIFEST.json",
      ),
      "utf8",
    ),
  ) as ResponsiveManifest;

const screenshotRoot =
  path.resolve(
    "docs/demo-engine-base/d30-freeze/"
      + "screenshots/responsive",
  );

const roleSelectors: Readonly<
  Record<
    Exclude<
      DemoRole,
      "public" | "applicant"
    >,
    string
  >
> = {
  officer:
    '[data-dashboard-role="officer"], [data-demo-role="officer"], .officer-dashboard',
  supervisor:
    '[data-dashboard-role="supervisor"], [data-demo-role="supervisor"]',
  admin:
    '[data-dashboard-role="admin"], [data-demo-role="admin"]',
};

test.describe.configure({
  // Keep one worker for deterministic screenshots, but do not use serial mode.
  // A failed viewport must not prevent the remaining cases from running.
  mode:
    "default",
});

async function stabilize(
  page: Page,
): Promise<void> {
  await page.emulateMedia({
    reducedMotion:
      "reduce",
  });

  await page.evaluate(
    async () => {
      await document.fonts.ready;
    },
  );

  await page.addStyleTag({
    content: `
      *,
      *::before,
      *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        caret-color: transparent !important;
      }
    `,
  });

  await page.waitForTimeout(
    250,
  );
}

async function openRoute(
  page: Page,
  route: string,
): Promise<
  readonly string[]
> {
  const errors:
    string[] = [];

  page.on(
    "pageerror",
    (error) => {
      errors.push(
        error.message,
      );
    },
  );

  const response =
    await page.goto(
      route,
      {
        waitUntil:
          "networkidle",
      },
    );

  expect(
    response,
    `${route} did not return a document response.`,
  ).not.toBeNull();

  expect(
    response!.status(),
    `${route} returned a non-success response.`,
  ).toBeLessThan(
    400,
  );

  await stabilize(page);

  return errors;
}

for (
  const viewport
  of manifest.viewports
) {
  for (
    const route
    of manifest.routes
  ) {
    test(
      `responsive:${viewport.id}:${route.id}`,
      async ({
        page,
      }) => {
        await page.setViewportSize({
          width:
            viewport.width,
          height:
            viewport.height,
        });

        const errors =
          await openRoute(
            page,
            route.path,
          );

        const bodyText =
          (
            await page.locator(
              "body",
            ).innerText()
          )
            .replace(
              /\s+/g,
              " ",
            )
            .trim();

        expect(
          bodyText.length,
          `${route.path} rendered an effectively blank page.`,
        ).toBeGreaterThan(
          50,
        );

        if (
          route.role
          === "applicant"
        ) {
          await expect(
            page.locator(
              '[data-track-request-ui="service-workflow"], main',
            ).first(),
          ).toBeVisible();
        } else if (
          route.role
          !== "public"
        ) {
          const workspaces =
            page.locator(
              roleSelectors[
                route.role
              ],
            );

          expect(
            await workspaces.count(),
            `${route.path} did not expose its ${route.role} workspace.`,
          ).toBeGreaterThan(
            0,
          );

          await expect(
            workspaces.first(),
          ).toBeVisible();
        }

        const geometry =
          await page.evaluate(
            () => {
              const documentElement =
                document.documentElement;

              const body =
                document.body;

              const viewportWidth =
                window.innerWidth;

              const viewportHeight =
                window.innerHeight;

              const rawDocumentOverflow =
                Math.max(
                  documentElement.scrollWidth,
                  body.scrollWidth,
                )
                - viewportWidth;

              function isVisiblyRendered(
                element: Element,
              ): boolean {
                const htmlElement =
                  element as HTMLElement;

                if (
                  htmlElement.closest(
                    [
                      '[aria-hidden="true"]',
                      "[hidden]",
                      "[inert]",
                      '[data-state="closed"]',
                      '[data-visibility="hidden"]',
                    ].join(","),
                  )
                ) {
                  return false;
                }

                let current:
                  Element | null =
                    element;

                while (current) {
                  const style =
                    getComputedStyle(
                      current,
                    );

                  if (
                    style.display
                      === "none"
                    || style.visibility
                      === "hidden"
                    || style.visibility
                      === "collapse"
                    || Number(
                      style.opacity,
                    ) <= 0.05
                  ) {
                    return false;
                  }

                  current =
                    current.parentElement;
                }

                const rect =
                  htmlElement
                    .getBoundingClientRect();

                const horizontalIntersection =
                  Math.min(
                    rect.right,
                    viewportWidth,
                  )
                  - Math.max(
                    rect.left,
                    0,
                  );

                const verticalIntersection =
                  Math.min(
                    rect.bottom,
                    viewportHeight,
                  )
                  - Math.max(
                    rect.top,
                    0,
                  );

                return (
                  rect.width > 1
                  && rect.height > 1
                  && horizontalIntersection > 2
                  && verticalIntersection > 2
                );
              }

              function hasLocalHorizontalBoundary(
                element: Element,
              ): boolean {
                let current =
                  element.parentElement;

                while (
                  current
                  && current
                    !== body
                  && current
                    !== documentElement
                ) {
                  const style =
                    getComputedStyle(
                      current,
                    );

                  const rect =
                    current
                      .getBoundingClientRect();

                  const overflowX =
                    style.overflowX;

                  const boundary =
                    [
                      "auto",
                      "scroll",
                      "hidden",
                      "clip",
                    ].includes(
                      overflowX,
                    );

                  const boundaryInsideViewport =
                    rect.left >= -2
                    && rect.right
                      <= viewportWidth + 2
                    && rect.width
                      <= viewportWidth + 4;

                  if (
                    boundary
                    && boundaryInsideViewport
                  ) {
                    return true;
                  }

                  current =
                    current.parentElement;
                }

                return false;
              }

              function describe(
                element: Element,
              ): string {
                const htmlElement =
                  element as HTMLElement;

                const classes =
                  Array.from(
                    htmlElement.classList,
                  )
                    .slice(
                      0,
                      3,
                    )
                    .join(".");

                return (
                  htmlElement.tagName
                    .toLowerCase()
                  + (
                    htmlElement.id
                      ? `#${htmlElement.id}`
                      : ""
                  )
                  + (
                    classes
                      ? `.${classes}`
                      : ""
                  )
                );
              }

              function overflowRecord(
                element: Element,
              ) {
                const htmlElement =
                  element as HTMLElement;

                const rect =
                  htmlElement
                    .getBoundingClientRect();

                const leftOverflow =
                  Math.max(
                    0,
                    -rect.left,
                  );

                const rightOverflow =
                  Math.max(
                    0,
                    rect.right
                      - viewportWidth,
                  );

                return {
                  selector:
                    describe(
                      element,
                    ),
                  left:
                    Number(
                      rect.left.toFixed(
                        1,
                      ),
                    ),
                  right:
                    Number(
                      rect.right.toFixed(
                        1,
                      ),
                    ),
                  width:
                    Number(
                      rect.width.toFixed(
                        1,
                      ),
                    ),
                  overflow:
                    Number(
                      Math.max(
                        leftOverflow,
                        rightOverflow,
                      ).toFixed(
                        1,
                      ),
                    ),
                };
              }

              const overflowingElements =
                Array.from(
                  document.querySelectorAll(
                    "body *",
                  ),
                )
                  .filter(
                    (element) => {
                      if (
                        !isVisiblyRendered(
                          element,
                        )
                      ) {
                        return false;
                      }

                      const rect =
                        element
                          .getBoundingClientRect();

                      const overflows =
                        rect.left < -2
                        || rect.right
                          > viewportWidth + 2;

                      if (
                        !overflows
                      ) {
                        return false;
                      }

                      if (
                        hasLocalHorizontalBoundary(
                          element,
                        )
                      ) {
                        return false;
                      }

                      const style =
                        getComputedStyle(
                          element,
                        );

                      // Decorative transformed graphics can extend outside a
                      // card without making content or controls unusable.
                      const decorativeGraphic =
                        element.matches(
                          "svg, path, circle, rect, line, polyline, polygon, canvas",
                        )
                        || (
                          style.position
                            === "absolute"
                          && style.pointerEvents
                            === "none"
                        );

                      return !decorativeGraphic;
                    },
                  )
                  .map(
                    overflowRecord,
                  )
                  .sort(
                    (
                      first,
                      second,
                    ) =>
                      second.overflow
                      - first.overflow,
                  );

              const uniqueOverflow =
                new Map<
                  string,
                  {
                    selector: string;
                    left: number;
                    right: number;
                    width: number;
                    overflow: number;
                  }
                >();

              for (
                const item
                of overflowingElements
              ) {
                const key =
                  [
                    item.selector,
                    item.left,
                    item.right,
                    item.width,
                  ].join(
                    "::",
                  );

                if (
                  !uniqueOverflow.has(
                    key,
                  )
                ) {
                  uniqueOverflow.set(
                    key,
                    item,
                  );
                }
              }

              const uncontainedOverflow =
                Array.from(
                  uniqueOverflow.values(),
                )
                  .slice(
                    0,
                    12,
                  );

              const clippedNavigation =
                Array.from(
                  document.querySelectorAll(
                    "nav",
                  ),
                )
                  .filter(
                    isVisiblyRendered,
                  )
                  .filter(
                    (element) => {
                      const rect =
                        element
                          .getBoundingClientRect();

                      const extendsOutside =
                        rect.left < -2
                        || rect.right
                          > viewportWidth + 2;

                      return (
                        extendsOutside
                        && !hasLocalHorizontalBoundary(
                          element,
                        )
                      );
                    },
                  )
                  .map(
                    overflowRecord,
                  )
                  .slice(
                    0,
                    12,
                  );

              return {
                rawDocumentOverflow:
                  Number(
                    rawDocumentOverflow.toFixed(
                      1,
                    ),
                  ),
                uncontainedOverflow,
                clippedNavigation,
              };
            },
          );

        expect(
          geometry.uncontainedOverflow,
          [
            `${route.path} has visible uncontained horizontal overflow`,
            `at ${viewport.id}.`,
            `Raw document overflow: ${geometry.rawDocumentOverflow}px.`,
          ].join(" "),
        ).toEqual([]);

        expect(
          geometry.clippedNavigation,
          `${route.path} has visible navigation clipped by ${viewport.id}.`,
        ).toEqual([]);

        if (
          route.requiresChart
        ) {
          const substantialGraphics =
            await page.evaluate(
              () =>
                Array.from(
                  document.querySelectorAll(
                    [
                      ".recharts-wrapper",
                      "[data-chart]",
                      'svg[role="img"]',
                      "canvas",
                      "svg",
                    ].join(","),
                  ),
                )
                  .filter(
                    (element) => {
                      const htmlElement =
                        element as HTMLElement;

                      const style =
                        getComputedStyle(
                          htmlElement,
                        );

                      const rect =
                        htmlElement
                          .getBoundingClientRect();

                      return (
                        style.display
                          !== "none"
                        && style.visibility
                          !== "hidden"
                        && Number(
                          style.opacity,
                        ) > 0.05
                        && rect.width
                          >= 120
                        && rect.height
                          >= 70
                      );
                    },
                  )
                  .length,
            );

          expect(
            substantialGraphics,
            `${route.path} lost all substantial charts or data graphics at ${viewport.id}.`,
          ).toBeGreaterThan(
            0,
          );
        }

        const grossContrastFailures =
          await page.evaluate(
            () => {
              type Color = readonly [
                number,
                number,
                number,
                number,
              ];

              function parseColor(
                value: string,
              ): Color | null {
                const match =
                  value.match(
                    /rgba?\(([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?\)/,
                  );

                if (!match) {
                  return null;
                }

                return [
                  Number(match[1]),
                  Number(match[2]),
                  Number(match[3]),
                  match[4]
                    ? Number(match[4])
                    : 1,
                ];
              }

              function luminance(
                color: Color,
              ): number {
                const channels =
                  color
                    .slice(0, 3)
                    .map(
                      (channel) => {
                        const normalized =
                          channel / 255;

                        return normalized
                          <= 0.03928
                          ? normalized
                            / 12.92
                          : (
                            (
                              normalized
                              + 0.055
                            )
                            / 1.055
                          ) ** 2.4;
                      },
                    );

                return (
                  0.2126
                    * channels[0]
                  + 0.7152
                    * channels[1]
                  + 0.0722
                    * channels[2]
                );
              }

              function contrast(
                first: Color,
                second: Color,
              ): number {
                const firstLuminance =
                  luminance(first);

                const secondLuminance =
                  luminance(second);

                const lighter =
                  Math.max(
                    firstLuminance,
                    secondLuminance,
                  );

                const darker =
                  Math.min(
                    firstLuminance,
                    secondLuminance,
                  );

                return (
                  lighter + 0.05
                )
                / (
                  darker + 0.05
                );
              }

              function directText(
                element: Element,
              ): string {
                return Array.from(
                  element.childNodes,
                )
                  .filter(
                    (node) =>
                      node.nodeType
                      === Node.TEXT_NODE,
                  )
                  .map(
                    (node) =>
                      node.textContent
                      ?? "",
                  )
                  .join(
                    " ",
                  )
                  .replace(
                    /\s+/g,
                    " ",
                  )
                  .trim();
              }

              function hasUnknownSurface(
                element: Element,
              ): boolean {
                if (
                  /image to replace this placeholder|placeholder image/i.test(
                    element.textContent
                    ?? "",
                  )
                ) {
                  return true;
                }

                let current:
                  Element | null =
                    element;

                while (current) {
                  const style =
                    getComputedStyle(
                      current,
                    );

                  if (
                    style.backgroundImage
                    && style.backgroundImage
                      !== "none"
                  ) {
                    return true;
                  }

                  if (
                    current.matches(
                      [
                        "figure",
                        "picture",
                        '[role="img"]',
                        "[data-image-placeholder]",
                        "[data-media]",
                        "svg",
                        "canvas",
                      ].join(","),
                    )
                  ) {
                    return true;
                  }

                  current =
                    current.parentElement;
                }

                return false;
              }

              function backgroundFor(
                element: Element,
              ): Color | null {
                let current:
                  Element | null =
                    element;

                while (current) {
                  const style =
                    getComputedStyle(
                      current,
                    );

                  const color =
                    parseColor(
                      style.backgroundColor,
                    );

                  if (
                    color
                    && color[3]
                      >= 0.95
                  ) {
                    return color;
                  }

                  current =
                    current.parentElement;
                }

                return [
                  255,
                  255,
                  255,
                  1,
                ];
              }

              const candidates =
                Array.from(
                  document.querySelectorAll(
                    [
                      "h1",
                      "h2",
                      "h3",
                      "h4",
                      "h5",
                      "h6",
                      "p",
                      "a",
                      "button",
                      "td",
                      "th",
                      "label",
                      "span",
                      "li",
                      "small",
                      "strong",
                      "em",
                    ].join(","),
                  ),
                )
                  .filter(
                    (element) => {
                      const htmlElement =
                        element as HTMLElement;

                      const style =
                        getComputedStyle(
                          htmlElement,
                        );

                      const rect =
                        htmlElement
                          .getBoundingClientRect();

                      const text =
                        directText(
                          element,
                        );

                      const clipped =
                        style.clip
                          !== "auto"
                        || style.clipPath
                          !== "none";

                      return (
                        text.length > 0
                        && style.display
                          !== "none"
                        && style.visibility
                          !== "hidden"
                        && Number(
                          style.opacity,
                        ) >= 0.5
                        && Number.parseFloat(
                          style.fontSize,
                        ) >= 10
                        && rect.width > 2
                        && rect.height > 2
                        && rect.right > 0
                        && rect.left
                          < window.innerWidth
                        && rect.bottom > 0
                        && rect.top
                          < window.innerHeight
                        && !clipped
                        && !htmlElement.closest(
                          [
                            '[aria-hidden="true"]',
                            "[disabled]",
                            '[data-contrast-ignore="true"]',
                            ".sr-only",
                            ".visually-hidden",
                          ].join(","),
                        )
                        && !hasUnknownSurface(
                          element,
                        )
                      );
                    },
                  )
                  .slice(
                    0,
                    1000,
                  );

              const failures =
                candidates
                  .map(
                    (element) => {
                      const style =
                        getComputedStyle(
                          element,
                        );

                      const foreground =
                        parseColor(
                          style.color,
                        );

                      const background =
                        backgroundFor(
                          element,
                        );

                      if (
                        !foreground
                        || !background
                      ) {
                        return null;
                      }

                      const ratio =
                        contrast(
                          foreground,
                          background,
                        );

                      if (
                        ratio >= 1.8
                      ) {
                        return null;
                      }

                      return {
                        text:
                          directText(
                            element,
                          )
                            .slice(
                              0,
                              80,
                            ),
                        ratio:
                          Number(
                            ratio.toFixed(
                              3,
                            ),
                          ),
                        tag:
                          element.tagName
                            .toLowerCase(),
                      };
                    },
                  )
                  .filter(
                    (
                      value,
                    ): value is {
                      text: string;
                      ratio: number;
                      tag: string;
                    } =>
                      value !== null,
                  );

              const unique =
                new Map<
                  string,
                  {
                    text: string;
                    ratio: number;
                    tag: string;
                  }
                >();

              for (
                const failure
                of failures
              ) {
                const key =
                  [
                    failure.tag,
                    failure.text,
                    failure.ratio,
                  ].join(
                    "::",
                  );

                if (
                  !unique.has(
                    key,
                  )
                ) {
                  unique.set(
                    key,
                    failure,
                  );
                }
              }

              return Array.from(
                unique.values(),
              )
                .slice(
                  0,
                  12,
                );
            },
          );

        expect(
          grossContrastFailures,
          `${route.path} contains grossly illegible text/background pairs at ${viewport.id}.`,
        ).toEqual([]);

        expect(
          errors,
          `${route.path} emitted uncaught browser errors at ${viewport.id}.`,
        ).toEqual([]);

        const directory =
          path.join(
            screenshotRoot,
            viewport.id,
          );

        await mkdir(
          directory,
          {
            recursive:
              true,
          },
        );

        await page.screenshot({
          path:
            path.join(
              directory,
              `${route.id}.png`,
            ),
          animations:
            "disabled",
          caret:
            "hide",
          fullPage:
            false,
        });
      },
    );
  }
}
