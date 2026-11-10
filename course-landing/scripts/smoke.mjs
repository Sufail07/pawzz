import { chromium } from "@playwright/test";

const base = "http://127.0.0.1:5173";
const results = [];
function check(name, ok, extra = "") {
  results.push(`${ok ? "PASS" : "FAIL"} ${name}${extra ? " :: " + extra : ""}`);
}

const browser = await chromium.launch();
const errors = [];

function trackErrors(page) {
  page.on("pageerror", (error) => errors.push(String(error)));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
}

// ---------- Mobile ----------
const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
trackErrors(page);
await page.goto(
  `${base}/?utm_source=instagram&utm_medium=social&utm_campaign=launch`,
  { waitUntil: "networkidle" },
);

check(
  "hero headline visible",
  await page
    .getByRole("heading", { level: 1, name: /learn ai by building real things/i })
    .isVisible(),
);
check(
  "header CTA visible",
  await page
    .getByRole("banner")
    .getByRole("button", { name: "Book a free intro", exact: true })
    .isVisible(),
);

const sticky = page.locator("div.fixed.inset-x-0.bottom-0");
check(
  "mobile sticky CTA on load",
  await sticky
    .getByRole("button", { name: "Book a free intro", exact: true })
    .isVisible(),
);

await page.getByRole("radio", { name: "AI at Work" }).click();
await page
  .getByRole("heading", { name: /what you'll be able to do on ai at work/i })
  .waitFor({ timeout: 5000 });
check("track switcher updates outcomes", true);

await page.locator("#projects").scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
check(
  "sticky CTA reachable after scroll",
  await sticky
    .getByRole("button", { name: "Book a free intro", exact: true })
    .isVisible(),
);

await sticky
  .getByRole("button", { name: "Book a free intro", exact: true })
  .click();
const dialog = page.getByRole("dialog");
await dialog.waitFor({ timeout: 5000 });
check("lead dialog opens", await dialog.isVisible());
check(
  "dialog preselects the chosen track",
  (await dialog.getByLabel("Track of interest").inputValue()) === "at-work",
);
check("sticky bar hides while the form is open", (await sticky.count()) === 0);

await dialog.getByRole("button", { name: /book my free intro/i }).click();
check(
  "inline validation appears",
  await dialog.getByText("Name is required").isVisible(),
);

await dialog.getByLabel("Full name").fill("Asha Menon");
await dialog.getByLabel("WhatsApp number").fill("98765 43210");
await dialog.getByRole("checkbox").check();
await dialog.getByRole("button", { name: /book my free intro/i }).click();
await dialog
  .getByRole("heading", { name: "You're booked in" })
  .waitFor({ timeout: 5000 });
check("intro lead confirms", true);

const leads = await page.evaluate(() =>
  JSON.parse(localStorage.getItem("lumen.leads.v1") || "[]"),
);
check(
  "lead stored with UTM and track",
  leads[0]?.payload?.utm_source === "instagram" &&
    leads[0]?.payload?.utm_campaign === "launch" &&
    leads[0]?.payload?.track_id === "at-work" &&
    leads[0]?.payload?.lead_type === "intro_call",
  JSON.stringify({ utm: leads[0]?.payload?.utm_source, track: leads[0]?.payload?.track_id }),
);

await dialog.getByRole("button", { name: "Done" }).click();
await dialog.waitFor({ state: "detached", timeout: 5000 });

await page.getByRole("button", { name: "Download the syllabus" }).click();
await dialog.waitFor({ timeout: 5000 });
await dialog.getByLabel("Full name").fill("Asha");
await dialog.getByLabel("Email address").fill("asha@example.com");
await dialog.getByRole("checkbox").check();
await dialog.getByRole("button", { name: /download the syllabus/i }).click();
await dialog
  .getByRole("heading", { name: "Your syllabus is ready" })
  .waitFor({ timeout: 5000 });
const download = dialog.getByRole("link", { name: /download the syllabus/i });
check(
  "syllabus download revealed",
  (await download.getAttribute("href")) ===
    "/AI_Skills_Studio_Sample_Syllabus.pdf",
);

const pdfResponse = await page.request.get(
  `${base}/AI_Skills_Studio_Sample_Syllabus.pdf`,
);
check(
  "syllabus PDF is served",
  pdfResponse.ok() &&
    (pdfResponse.headers()["content-type"] || "").includes("pdf"),
  pdfResponse.headers()["content-type"] || "",
);

await dialog.getByRole("button", { name: "Done" }).click();
await dialog.waitFor({ state: "detached", timeout: 5000 });

await page.getByRole("button", { name: "What does it cost?" }).click();
check(
  "FAQ accordion toggles",
  (await page
    .getByRole("button", { name: "What does it cost?" })
    .getAttribute("aria-expanded")) === "true",
);

const overflow = await page.evaluate(
  () => document.documentElement.scrollWidth > window.innerWidth + 1,
);
check("no horizontal scroll at 375px", !overflow);

// ---------- Desktop ----------
const desk = await browser.newPage({ viewport: { width: 1280, height: 900 } });
trackErrors(desk);
await desk.goto(base + "/", { waitUntil: "networkidle" });
check(
  "desktop anchor navigation visible",
  await desk.getByRole("navigation", { name: "Primary" }).isVisible(),
);
check(
  "desktop sticky bar hidden",
  !(await desk.locator("div.fixed.inset-x-0.bottom-0").isVisible()),
);

await desk
  .getByRole("banner")
  .getByRole("button", { name: "Book a free intro", exact: true })
  .click();
const deskDialog = desk.getByRole("dialog");
await deskDialog.waitFor({ timeout: 5000 });
check("desktop modal opens", await deskDialog.isVisible());
await desk.keyboard.press("Escape");
await deskDialog.waitFor({ state: "detached", timeout: 5000 });
check("Escape closes the dialog", true);

await desk.locator("#final-cta").scrollIntoViewIfNeeded();
await desk.waitForTimeout(400);
check(
  "inline final form is present",
  await desk
    .locator("#final-cta")
    .getByRole("heading", { name: "Book a free intro session" })
    .isVisible(),
);

await desk.goto(base + "/privacy", { waitUntil: "networkidle" });
check(
  "privacy note loads",
  await desk.getByRole("heading", { name: "Privacy note" }).isVisible(),
);

await desk.goto(base + "/styleguide", { waitUntil: "networkidle" });
check(
  "styleguide loads",
  await desk
    .getByRole("heading", { name: "Coded design system" })
    .isVisible(),
);

check("no console errors", errors.length === 0, errors.slice(0, 3).join(" | "));

console.log(results.join("\n"));
if (results.some((line) => line.startsWith("FAIL"))) process.exitCode = 1;
await browser.close();
