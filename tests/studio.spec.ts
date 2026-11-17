import { test, expect, type Page } from "@playwright/test";

declare global {
  interface Window {
    studioDraws: number;
  }
}

async function openStudio(page: Page) {
  await page.getByRole("button", { name: "Enter the 3D studio" }).click();
  await expect(
    page.getByRole("dialog", { name: "Interactive 3D portfolio studio" }),
  ).toBeVisible();
  await expect(page.locator("canvas")).toBeVisible();
  await expect
    .poll(() =>
      page.locator("canvas").evaluate((canvas) => {
        const gl = (canvas as HTMLCanvasElement).getContext("webgl2");
        return !!gl && !gl.isContextLost();
      }),
    )
    .toBe(true);
}

async function drawCount(page: Page) {
  return page.evaluate(() => window.studioDraws);
}

async function waitForRest(page: Page) {
  let previous = -1;
  let stableSince = 0;
  await expect
    .poll(
      async () => {
        const count = await drawCount(page);
        if (count !== previous) {
          previous = count;
          stableSince = Date.now();
        }
        return count > 0 && Date.now() - stableSince >= 2000;
      },
      { timeout: 30_000, intervals: [250] },
    )
    .toBe(true);
}

test.beforeEach(async ({ page }) => {
  // Existing production analytics is unrelated to local studio functionality.
  await page.route("https://static.cloudflareinsights.com/**", (route) =>
    route.abort(),
  );
  await page.addInitScript(() => {
    const state = window;
    state.studioDraws = 0;
    for (const type of [WebGLRenderingContext, WebGL2RenderingContext]) {
      for (const name of [
        "drawArrays",
        "drawElements",
        "drawArraysInstanced",
        "drawElementsInstanced",
      ]) {
        const prototype = type.prototype as unknown as Record<
          string,
          (...args: unknown[]) => unknown
        >;
        const original = prototype[name];
        if (typeof original !== "function") continue;
        prototype[name] = function (...args: unknown[]) {
          state.studioDraws++;
          return original.apply(this, args);
        };
      }
    }
  });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      /shader|WebGLProgram|THREE\.|R3F/.test(message.text())
    )
      errors.push(message.text());
  });
  await page.goto("./");
  // Shader and uncaught application failures must not hide behind an accessible fallback.
  await expect(
    page.getByRole("heading", { name: "SmartStay Rentals", exact: true }),
  ).toBeVisible();
  (page as Page & { studioErrors?: string[] }).studioErrors = errors;
});

test.afterEach(async ({ page }) => {
  expect(
    (page as Page & { studioErrors?: string[] }).studioErrors || [],
  ).toEqual([]);
});

test("new products filter and open correct links while 3D remains unloaded", async ({
  page,
}) => {
  await expect(page.locator("canvas")).toHaveCount(0);
  const loadedScripts = await page.evaluate(() =>
    [...document.scripts]
      .filter(
        (script) =>
          script.src && new URL(script.src).origin === location.origin,
      )
      .map((script) => script.src),
  );
  for (const url of loadedScripts) {
    const response = await page.request.get(url);
    expect(await response.text()).not.toContain("ARRANGING THE WORKSPACE");
  }
  await page
    .getByRole("button", { name: "Product engineering", exact: true })
    .click();
  for (const [title, url] of [
    ["SmartStay Rentals", "https://smartstaysrental.com"],
    ["Mailyte", "https://mailyte.com/"],
  ]) {
    const trigger = page.getByRole("button", {
      name: `Explore project: ${title}`,
      exact: true,
    });
    await expect(trigger).toBeVisible();
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: title, exact: true });
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole("link", { name: "Open live website" }),
    ).toHaveAttribute("href", url);
    await expect(dialog.locator(".pf-tags")).toHaveCount(0);
    await expect(dialog.locator("iframe")).toHaveCount(0);
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
  }
  await expect(page.locator("canvas")).toHaveCount(0);
});

test("workspace objects, quality, content and demand rendering work with keyboard controls", async ({
  page,
}) => {
  const trigger = page.getByRole("button", { name: "Enter the 3D studio" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openStudio(page);
  await expect(page.getByRole("button", { name: "Eco quality" })).toBeVisible();
  await waitForRest(page);
  const resting = await drawCount(page);
  await page.waitForTimeout(600);
  expect(await drawCount(page)).toBe(resting);

  const laptop = page.getByRole("button", { name: /Open the laptop/ });
  await laptop.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { name: "A closer look." }),
  ).toBeVisible();
  await expect(laptop).toHaveAttribute("aria-pressed", "true");
  await expect.poll(() => drawCount(page)).toBeGreaterThan(resting);
  await waitForRest(page);
  const laptopRest = await drawCount(page);
  await page.waitForTimeout(600);
  expect(await drawCount(page)).toBe(laptopRest);

  const chair = page.getByRole("button", { name: /Take a seat/ });
  await chair.focus();
  await page.keyboard.press("Space");
  await expect(
    page.getByRole("heading", { name: "Pull up a chair." }),
  ).toBeVisible();
  await expect(chair).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: /Change the light/ }).click();
  await expect(
    page.getByRole("button", { name: "Evening", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Eco quality" }).click();
  await expect(
    page.getByRole("button", { name: "Detail quality" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Detail quality" }).click();
  await page.getByRole("button", { name: "Meet the engineer" }).click();
  await expect(
    page.getByRole("region", { name: "about information" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Close panel and return to studio" })
    .click();

  await page.getByRole("button", { name: "2D view" }).click();
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(
    page
      .getByRole("dialog", { name: "Interactive 3D portfolio studio" })
      .getByRole("status"),
  ).toContainText("Lightweight view");
  await page.getByRole("button", { name: "Enable 3D" }).click();
  await expect(page.locator("canvas")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("dialog", { name: "Interactive 3D portfolio studio" }),
  ).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("reduced-motion mobile controls keep products and panels usable without overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openStudio(page);
  await page.getByRole("button", { name: /Open the laptop/ }).tap();
  await expect(
    page.getByRole("heading", { name: "A closer look." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Explore selected work" }).tap();
  const panel = page.getByRole("region", { name: "projects information" });
  await expect(panel).toBeVisible();
  for (const [title, url] of [
    ["SmartStay Rentals", "https://smartstaysrental.com"],
    ["Mailyte", "https://mailyte.com/"],
  ]) {
    await panel.getByRole("button").filter({ hasText: title }).click();
    await expect(
      panel.getByRole("link", { name: "VISIT LIVE PROJECT" }),
    ).toHaveAttribute("href", url);
    await expect(panel.getByText("TECHNOLOGY", { exact: true })).toHaveCount(0);
    await panel.getByRole("button", { name: "ALL PROJECTS" }).click();
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({ path: test.info().outputPath("mobile-studio.png") });
  await page.setViewportSize({ width: 320, height: 740 });
  await panel
    .getByRole("button", { name: "Close panel and return to studio" })
    .click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const objectButtons = page
    .getByRole("navigation", { name: "Workspace objects" })
    .getByRole("button");
  for (const button of await objectButtons.all()) {
    await expect(button).toBeVisible();
    const bounds = await button.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(320);
  }
  await page.screenshot({
    path: test.info().outputPath("mobile-studio-320.png"),
  });
});

test("context loss exposes a useful fallback with working content navigation", async ({
  page,
}) => {
  await openStudio(page);
  const supported = await page.locator("canvas").evaluate((canvas) => {
    const extension = (canvas as HTMLCanvasElement)
      .getContext("webgl2")
      ?.getExtension("WEBGL_lose_context");
    extension?.loseContext();
    return !!extension;
  });
  expect(supported).toBe(true);
  await expect(
    page
      .getByRole("dialog", { name: "Interactive 3D portfolio studio" })
      .getByRole("status"),
  ).toContainText("3D is unavailable");
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "3D unavailable" }),
  ).toBeDisabled();
  await page
    .getByRole("button", { name: "Selected work", exact: true })
    .click();
  await expect(
    page.getByRole("region", { name: "projects information" }),
  ).toBeVisible();
});

test("normal-motion camera, lid and chair transitions settle back to an idle scene", async ({
  page,
}) => {
  test.setTimeout(120_000);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await openStudio(page);
  await waitForRest(page);
  const overview = await drawCount(page);

  await page.getByRole("button", { name: /Open the laptop/ }).click();
  await expect(
    page.getByRole("heading", { name: "A closer look." }),
  ).toBeVisible();
  await expect.poll(() => drawCount(page)).toBeGreaterThan(overview);
  await waitForRest(page);
  await page.screenshot({
    path: test.info().outputPath("laptop-normal-motion.png"),
  });
  const laptop = await drawCount(page);

  await page.getByRole("button", { name: /Take a seat/ }).click();
  await expect(
    page.getByRole("heading", { name: "Pull up a chair." }),
  ).toBeVisible();
  await expect.poll(() => drawCount(page)).toBeGreaterThan(laptop);
  await waitForRest(page);
  const chair = await drawCount(page);

  await page.getByRole("button", { name: "Reset camera" }).click();
  await expect(
    page.getByRole("heading", { name: "Where ideas take shape." }),
  ).toBeVisible();
  await expect.poll(() => drawCount(page)).toBeGreaterThan(chair);
  await waitForRest(page);
  const resting = await drawCount(page);
  await page.waitForTimeout(600);
  expect(await drawCount(page)).toBe(resting);
});
