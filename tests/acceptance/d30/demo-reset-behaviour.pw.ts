import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import path from "node:path";

const audit = JSON.parse(
  readFileSync(
    path.resolve(
      "docs/demo-engine-base/d30-freeze/"
        + "D30-11-RESET-IMPLEMENTATION-AUDIT.json",
    ),
    "utf8",
  ),
) as { storageKeysUnderContract: string[] };

test.describe.configure({ mode: "serial" });

test("Reset demo clears temporary state and restores /demo", async ({ page }) => {
  const pageErrors: string[] = [];
  const externalMutations: string[] = [];

  page.on("pageerror", error => pageErrors.push(error.message));
  page.on("request", request => {
    const url = new URL(request.url());
    const local = url.hostname === "127.0.0.1" || url.hostname === "localhost";
    if (!local && ["POST", "PUT", "PATCH", "DELETE"].includes(request.method())) {
      externalMutations.push(`${request.method()} ${url.origin}${url.pathname}`);
    }
  });

  await page.goto("/demo", { waitUntil: "networkidle" });
  const reset = page.getByRole("button", { name: /Reset demo/i });
  await expect(reset).toBeVisible();

  const sentinel = "__d30_11_mutated__";
  await page.evaluate(({ keys, sentinel }) => {
    for (const key of keys) {
      sessionStorage.setItem(key, sentinel);
      localStorage.setItem(key, sentinel);
    }
  }, { keys: audit.storageKeysUnderContract, sentinel });

  await reset.click();
  await page.waitForTimeout(800);

  const values = await page.evaluate(keys => keys.map(key => ({
    key,
    session: sessionStorage.getItem(key),
    local: localStorage.getItem(key),
  })), audit.storageKeysUnderContract);

  for (const value of values) {
    expect(value.session, `${value.key} remained mutated in sessionStorage`).not.toBe(sentinel);
    expect(value.local, `${value.key} remained mutated in localStorage`).not.toBe(sentinel);
  }

  expect(new URL(page.url()).pathname).toBe("/demo");
  await expect(page.locator("body")).toContainText(/Savannah Technical College|Savannah Tech/i);
  await expect(page.getByRole("button", { name: /Reset demo/i })).toBeVisible();
  expect(externalMutations).toEqual([]);
  expect(pageErrors).toEqual([]);
});

test("Reset demo preserves the active Officer route and remains usable", async ({ page }) => {
  const pageErrors: string[] = [];
  const externalMutations: string[] = [];

  page.on("pageerror", error => pageErrors.push(error.message));
  page.on("request", request => {
    const url = new URL(request.url());
    const local = url.hostname === "127.0.0.1" || url.hostname === "localhost";

    if (
      !local
      && ["POST", "PUT", "PATCH", "DELETE"].includes(request.method())
    ) {
      externalMutations.push(`${request.method()} ${url.origin}${url.pathname}`);
    }
  });

  await page.goto("/demo/officer", { waitUntil: "networkidle" });

  const originalPath = new URL(page.url()).pathname;
  expect(originalPath).toBe("/demo/officer");

  const reset = page.getByRole("button", { name: /Reset demo/i });
  await expect(reset).toBeVisible();

  await reset.click();
  await page.waitForLoadState("domcontentloaded").catch(() => undefined);
  await page.waitForTimeout(800);

  const resultingPath = new URL(page.url()).pathname;

  expect(
    resultingPath,
    "Reset demo unexpectedly changed the active role route.",
  ).toBe(originalPath);

  await expect(
    page.getByRole("button", { name: /Reset demo/i }),
  ).toBeVisible();

  await expect(page.locator("body")).not.toContainText(
    /Internal Server Error|Application error: a client-side exception has occurred/i,
  );

  expect(externalMutations).toEqual([]);
  expect(pageErrors).toEqual([]);
});
